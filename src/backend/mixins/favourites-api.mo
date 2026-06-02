import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import FavouriteTypes "../types/favourite";
import AdTypes "../types/advertisement";
import ProfileTypes "../types/profile";
import Common "../types/common";

// Public API mixin for the favourites domain.
// Follows the same pattern as join-request-api.mo.
mixin (
  accessControlState : AccessControl.AccessControlState,
  favourites : Map.Map<Text, FavouriteTypes.Favourite>,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
) {

  // Returns a stable composite key for (userPrincipal, adId).
  func favouriteKey(user : Principal, adId : Text) : Text {
    user.toText() # "__" # adId;
  };

  // Builds an AdvertisementPublic from an Advertisement + optional creator profile.
  func buildAdPublic(
    ad : AdTypes.Advertisement,
    maybeProfile : ?ProfileTypes.UserProfilePublic,
  ) : AdTypes.AdvertisementPublic {
    {
      id = ad.id;
      creatorPrincipal = ad.creatorPrincipal;
      eventName = ad.eventName;
      eventType = ad.eventType;
      city = ad.city;
      isVirtual = ad.isVirtual;
      meetType = ad.meetType;
      description = ad.description;
      expectedCompanionSex = ad.expectedCompanionSex;
      howPaysForEvent = ad.howPaysForEvent;
      eventLink = ad.eventLink;
      linkPreview = ad.linkPreview;
      photos = ad.photos;
      status = ad.status;
      paymentStatus = ad.paymentStatus;
      paymentProvider = ad.paymentProvider;
      paymentReference = ad.paymentReference;
      paid = ad.paid;
      address = ad.address;
      createdAt = ad.createdAt;
      updatedAt = ad.updatedAt;
      publishedAt = ad.publishedAt;
      creatorProfile = maybeProfile;
    };
  };

  // Resolves a UserProfile to UserProfilePublic (without contact info).
  func toProfilePublic(p : ProfileTypes.UserProfile) : ProfileTypes.UserProfilePublic {
    {
      principal = p.principal;
      fullName = p.fullName;
      username = p.username;
      photos = p.photos;
      defaultAvatar = p.defaultAvatar;
      bio = p.bio;
      sex = p.sex;
      city = p.city;
      language = p.language;
      hideContactsInAds = p.hideContactsInAds;
      age = p.age;
      dateOfBirth = null; // dateOfBirth stored in separate stable map in main.mo
      createdAt = p.createdAt;
      updatedAt = p.updatedAt;
    };
  };

  // Adds the caller's favourite for the given ad. Idempotent — returns existing if already favourited.
  public shared ({ caller }) func addToFavourites(
    adId : Text
  ) : async Common.Result<FavouriteTypes.FavouritePublic, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    // Validate ad exists and is published
    switch (ads.get(adId)) {
      case (null) { return #err("Ad not found") };
      case (?ad) {
        if (ad.status != #published or ad.paymentStatus != #paid) {
          return #err("Only published ads can be favourited");
        };
      };
    };
    let key = favouriteKey(caller, adId);
    // Idempotent: return existing favourite if already present
    switch (favourites.get(key)) {
      case (?existing) {
        return #ok({
          id = existing.id;
          adId = existing.adId;
          userPrincipal = existing.userPrincipal;
          createdAt = existing.createdAt;
        });
      };
      case (null) {};
    };
    let fav : FavouriteTypes.Favourite = {
      id = key;
      adId = adId;
      userPrincipal = caller;
      createdAt = Time.now();
    };
    favourites.add(key, fav);
    #ok({
      id = fav.id;
      adId = fav.adId;
      userPrincipal = fav.userPrincipal;
      createdAt = fav.createdAt;
    });
  };

  // Removes the caller's favourite for the given ad.
  public shared ({ caller }) func removeFromFavourites(
    adId : Text
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let key = favouriteKey(caller, adId);
    switch (favourites.get(key)) {
      case (null) { #err("Favourite not found") };
      case (?_) {
        favourites.remove(key);
        #ok(());
      };
    };
  };

  // Returns all ads the caller has favourited, each paired with full ad data.
  public query ({ caller }) func getMyFavourites() : async Common.Result<[FavouriteTypes.FavouriteWithAd], Text> {
    if (caller.isAnonymous()) {
      return #err("Not authenticated");
    };
    let result = List.empty<FavouriteTypes.FavouriteWithAd>();
    for ((_, fav) in favourites.entries()) {
      if (fav.userPrincipal == caller) {
        let maybeAd : ?AdTypes.AdvertisementPublic = switch (ads.get(fav.adId)) {
          case (null) { null };
          case (?ad) {
            let maybeProfile : ?ProfileTypes.UserProfilePublic = switch (profiles.get(ad.creatorPrincipal)) {
              case (null) { null };
              case (?p) { ?toProfilePublic(p) };
            };
            ?buildAdPublic(ad, maybeProfile);
          };
        };
        result.add({
          favourite = {
            id = fav.id;
            adId = fav.adId;
            userPrincipal = fav.userPrincipal;
            createdAt = fav.createdAt;
          };
          ad = maybeAd;
        });
      };
    };
    #ok(result.toArray());
  };

  // Returns true if the caller has favourited the given ad.
  public query ({ caller }) func isFavourited(
    adId : Text
  ) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    let key = favouriteKey(caller, adId);
    favourites.get(key) != null;
  };
  // Returns how many users have favourited a given ad. Callable by anyone (no auth required).
  public query func getFavouriteCount(adId : Text) : async Nat {
    var count : Nat = 0;
    for ((_, fav) in favourites.entries()) {
      if (fav.adId == adId) {
        count += 1;
      };
    };
    count;
  };
};
