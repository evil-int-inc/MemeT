import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import LikeTypes "../types/like";
import AdTypes "../types/advertisement";
import ProfileTypes "../types/profile";
import Common "../types/common";

// Public API mixin for the likes domain.
// Follows the same pattern as favourites-api.mo.
mixin (
  accessControlState : AccessControl.AccessControlState,
  adLikes : Map.Map<Text, LikeTypes.AdLike>,
  profileLikes : Map.Map<Text, LikeTypes.ProfileLike>,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
) {

  // Composite key for (userPrincipal, adId) ad-like lookups
  func adLikeKey(user : Principal, adId : Text) : Text {
    user.toText() # "__adlike__" # adId;
  };

  // Composite key for (likerPrincipal, profilePrincipal) profile-like lookups
  func profileLikeKey(liker : Principal, profile : Principal) : Text {
    liker.toText() # "__profilelike__" # profile.toText();
  };

  // Builds an AdvertisementPublic from an Advertisement + optional creator profile.
  // Private copy for this mixin (avoids duplicate definition with favourites-api.mo).
  func likesBuildAdPublic(
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
      createdAt = ad.createdAt;
      updatedAt = ad.updatedAt;
      publishedAt = ad.publishedAt;
      creatorProfile = maybeProfile;
    };
  };

  // Resolves a UserProfile to UserProfilePublic (without contact info).
  // Private copy for this mixin (avoids duplicate definition with favourites-api.mo).
  func likesToProfilePublic(p : ProfileTypes.UserProfile) : ProfileTypes.UserProfilePublic {
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
      dateOfBirth = null;
      createdAt = p.createdAt;
      updatedAt = p.updatedAt;
    };
  };

  // ─── Ad Likes ────────────────────────────────────────────────────────────────

  // Adds the caller's like for the given ad. Idempotent. Only works on published+paid ads.
  public shared ({ caller }) func addAdLike(
    adId : Text
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (ads.get(adId)) {
      case (null) { return #err("Ad not found") };
      case (?ad) {
        if (ad.status != #published or ad.paymentStatus != #paid) {
          return #err("Only published ads can be liked");
        };
      };
    };
    let key = adLikeKey(caller, adId);
    // Idempotent: already liked
    if (adLikes.get(key) != null) {
      return #ok(());
    };
    let like : LikeTypes.AdLike = {
      id = key;
      adId = adId;
      userPrincipal = caller;
      createdAt = Time.now();
    };
    adLikes.add(key, like);
    #ok(());
  };

  // Removes the caller's like for the given ad.
  public shared ({ caller }) func removeAdLike(
    adId : Text
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let key = adLikeKey(caller, adId);
    switch (adLikes.get(key)) {
      case (null) { #err("Like not found") };
      case (?_) {
        adLikes.remove(key);
        #ok(());
      };
    };
  };

  // Returns all ads the caller has liked, each paired with full ad data.
  public query ({ caller }) func getMyAdLikes() : async Common.Result<[LikeTypes.AdLikeWithAd], Text> {
    if (caller.isAnonymous()) {
      return #err("Not authenticated");
    };
    let result = List.empty<LikeTypes.AdLikeWithAd>();
    for ((_, like) in adLikes.entries()) {
      if (like.userPrincipal == caller) {
        let maybeAd : ?AdTypes.AdvertisementPublic = switch (ads.get(like.adId)) {
          case (null) { null };
          case (?ad) {
            let maybeProfile : ?ProfileTypes.UserProfilePublic = switch (profiles.get(ad.creatorPrincipal)) {
              case (null) { null };
              case (?p) { ?likesToProfilePublic(p) };
            };
            ?likesBuildAdPublic(ad, maybeProfile);
          };
        };
        result.add({
          like = {
            id = like.id;
            adId = like.adId;
            userPrincipal = like.userPrincipal;
            createdAt = like.createdAt;
          };
          ad = maybeAd;
        });
      };
    };
    #ok(result.toArray());
  };

  // Returns how many users have liked a given ad. Public query, no auth required.
  public query func getAdLikeCount(adId : Text) : async Nat {
    var count : Nat = 0;
    for ((_, like) in adLikes.entries()) {
      if (like.adId == adId) {
        count += 1;
      };
    };
    count;
  };

  // Returns true if the caller has liked the given ad.
  public query ({ caller }) func isAdLikedByMe(adId : Text) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    adLikes.get(adLikeKey(caller, adId)) != null;
  };

  // ─── Profile Likes ───────────────────────────────────────────────────────────

  // Adds the caller's like for the given profile. Idempotent. Any authenticated user can like any profile.
  public shared ({ caller }) func addProfileLike(
    profilePrincipal : Principal
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let key = profileLikeKey(caller, profilePrincipal);
    // Idempotent: already liked
    if (profileLikes.get(key) != null) {
      return #ok(());
    };
    let like : LikeTypes.ProfileLike = {
      id = key;
      profilePrincipal = profilePrincipal;
      likerPrincipal = caller;
      createdAt = Time.now();
    };
    profileLikes.add(key, like);
    #ok(());
  };

  // Removes the caller's like for the given profile.
  public shared ({ caller }) func removeProfileLike(
    profilePrincipal : Principal
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let key = profileLikeKey(caller, profilePrincipal);
    switch (profileLikes.get(key)) {
      case (null) { #err("Like not found") };
      case (?_) {
        profileLikes.remove(key);
        #ok(());
      };
    };
  };

  // Returns how many users have liked a given profile. Public query, no auth required.
  public query func getProfileLikeCount(profilePrincipal : Principal) : async Nat {
    var count : Nat = 0;
    for ((_, like) in profileLikes.entries()) {
      if (like.profilePrincipal == profilePrincipal) {
        count += 1;
      };
    };
    count;
  };

  // Returns true if the caller has liked the given profile.
  public query ({ caller }) func isProfileLikedByMe(profilePrincipal : Principal) : async Bool {
    if (caller.isAnonymous()) {
      return false;
    };
    profileLikes.get(profileLikeKey(caller, profilePrincipal)) != null;
  };
  // Returns all profile Principals the caller has liked.
  public query ({ caller }) func getMyProfileLikes() : async [Principal] {
    if (caller.isAnonymous()) {
      return [];
    };
    let result = List.empty<Principal>();
    for ((_, like) in profileLikes.entries()) {
      if (like.likerPrincipal == caller) {
        result.add(like.profilePrincipal);
      };
    };
    result.toArray();
  };
};
