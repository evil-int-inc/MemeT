import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import MixinObjectStorage "mo:caffeineai-object-storage/Mixin";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import ProfileApi "mixins/profile-api";
import AdvertisementApi "mixins/advertisement-api";
import ProfileTypes "types/profile";
import AdTypes "types/advertisement";
import JoinRequestTypes "types/join-request";
import JoinRequestApi "mixins/join-request-api";
import FavouriteTypes "types/favourite";
import FavouritesApi "mixins/favourites-api";
import LikeTypes "types/like";
import LikesApi "mixins/likes-api";
import ReferralApi "mixins/referral-api";
import ReferralTypes "types/referral";
















actor {
  // Authorization state (first logged-in user becomes admin)
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Object storage infrastructure
  include MixinObjectStorage();

  // Profile domain state
  // `profiles` stable type has age:?Nat only (no dateOfBirth — stable compat with deployed version)
  // dateOfBirth is stored separately in `dateOfBirthMap` to avoid M0170 upgrade errors
  stable let profiles = Map.empty<Principal, ProfileTypes.UserProfile>();
  stable let usernameIndex = Map.empty<Text, Principal>();
  // Separate stable storage for dateOfBirth (serialized as array of tuples for stable compat)
  stable var dateOfBirthEntries : [(Principal, Int)] = [];
  var dateOfBirths : Map.Map<Principal, Int> = Map.empty<Principal, Int>();

  system func preupgrade() {
    dateOfBirthEntries := dateOfBirths.toArray();
  };

  system func postupgrade() {
    dateOfBirths := Map.fromArray<Principal, Int>(dateOfBirthEntries, );
    // Re-sync stripeConfig wrapper from stable var after upgrade
    switch (stripeConfiguration) {
      case (?cfg) { stripeConfig.config := ?cfg };
      case (null) { stripeConfig.config := ?defaultStripeCfg };
    };
  };

  // Advertisement domain state
  let ads = Map.empty<Text, AdTypes.Advertisement>();
  let adState = { var nextAdId : Nat = 0 };

  // --- Stripe integration (must be declared directly in actor per extension constraint) ---

  // Stripe publishable key constant (safe to expose to frontend)
  let STRIPE_PUBLISHABLE_KEY : Text = "pk_test_51SfIyIK1zfEn4rUHn8nsT4Rn0sxtxtWndV9opLom3ZtwmrtOHsoqw96htRftrBy18XGux4lLhObAXomGFM2SCkz200FnmBopE1";

  // Stripe configuration — initialized at declaration time and persisted across upgrades
  let defaultStripeCfg : Stripe.StripeConfiguration = {
    secretKey = "sk_test_51SfIyIK1zfEn4rUHFNqkV2mBaUju5IT4Y6UOjSOO84XACP5izea0nonvvrCV1JzYzW8YjXwHBa9gUIurzO5gIuFL00EeqULYSl";
    allowedCountries = ["US", "GB", "ES", "FR", "DE", "PT", "RU", "CN", "IN", "BR", "AE"];
  };

  // Stable storage for Stripe config (persists across upgrades)
  stable var stripeConfiguration : ?Stripe.StripeConfiguration = ?defaultStripeCfg;

  // Shared record wrapper so mixins can access the same config reference
  let stripeConfig = { var config : ?Stripe.StripeConfiguration = ?defaultStripeCfg };

  // Returns true if Stripe has been configured
  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  // Returns the Stripe publishable key (safe to expose — publishable keys are public)
  public query func getStripePublishableKey() : async Text {
    STRIPE_PUBLISHABLE_KEY;
  };

  // Webhook stub — inbound HTTP from Stripe is not possible on ICP.
  // Use confirmPayment(adId, sessionId) instead: backend calls Stripe to verify session status.
  public func handleStripeWebhook(_payload : Text, _signature : Text) : async { #ok : Text; #err : Text } {
    #err("Webhooks not supported in ICP environment - use confirmPayment instead");
  };

  // Admin: override Stripe configuration (e.g. rotate keys without redeploying)
  public shared ({ caller }) func setStripeConfiguration(
    config : Stripe.StripeConfiguration
  ) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfiguration := ?config;
    stripeConfig.config := ?config;
  };

  // Create a Stripe checkout session (required directly in actor)
  public shared ({ caller }) func createCheckoutSession(
    items : [Stripe.ShoppingItem],
    successUrl : Text,
    cancelUrl : Text,
  ) : async Text {
    let cfg = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.createCheckoutSession(cfg, caller, items, successUrl, cancelUrl, transform);
  };

  // Check a Stripe session payment status (required directly in actor)
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    let cfg = switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe is not configured") };
      case (?c) { c };
    };
    await Stripe.getSessionStatus(cfg, sessionId, transform);
  };

  // Required IC transform callback for HTTP outcalls (must be a query on the actor)
  public query func transform(
    input : OutCall.TransformationInput
  ) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Referral domain state
  // referralCodeIndex: code (Text) -> Principal (O(1) code lookup)
  let referralCodeIndex = Map.empty<Text, Principal>();
  // referralLedger: "referrerPrincipal:referredPrincipal" -> ReferralEntry
  let referralLedger = Map.empty<Text, ReferralTypes.ReferralEntry>();

  // Join-request domain state
  let joinRequests = Map.empty<Text, JoinRequestTypes.JoinRequest>();
  // Favourites domain state
  let favourites = Map.empty<Text, FavouriteTypes.Favourite>();
  // Likes domain state
  let adLikes = Map.empty<Text, LikeTypes.AdLike>();
  let profileLikes = Map.empty<Text, LikeTypes.ProfileLike>();

  // Include profile API mixin
  include ProfileApi(accessControlState, profiles, usernameIndex, dateOfBirths, referralCodeIndex);

  // Include advertisement API mixin — passes stripeConfig wrapper so mixin can use Stripe
  include AdvertisementApi(accessControlState, ads, profiles, dateOfBirths, adState, stripeConfig, transform, referralLedger);
  // Include join-request API mixin
  include JoinRequestApi(accessControlState, joinRequests, ads, profiles);
  // Include favourites API mixin (exposes addToFavourites, removeFromFavourites, getMyFavourites, isFavourited, getFavouriteCount)
  include FavouritesApi(accessControlState, favourites, ads, profiles);
  // Include likes API mixin (exposes addAdLike, removeAdLike, getMyAdLikes, getAdLikeCount, isAdLikedByMe, addProfileLike, removeProfileLike, getProfileLikeCount, isProfileLikedByMe, getMyProfileLikes)
  include LikesApi(accessControlState, adLikes, profileLikes, ads, profiles);
  // Include referral API mixin (exposes getReferralCode, setReferredBy, getMyReferrals, creditReferralCommission)
  include ReferralApi(accessControlState, profiles, ads, referralCodeIndex, referralLedger);
};
