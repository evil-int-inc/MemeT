import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import AccessControl "mo:caffeineai-authorization/access-control";
import JoinRequestLib "../lib/join-request";
import JoinRequestTypes "../types/join-request";
import AdTypes "../types/advertisement";
import ProfileTypes "../types/profile";
import Common "../types/common";

// Public API mixin for the join-request domain
mixin (
  accessControlState : AccessControl.AccessControlState,
  joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
) {
  // Sends a join request from the caller for the given ad.
  public shared ({ caller }) func sendJoinRequest(
    adId : Text
  ) : async Common.Result<JoinRequestTypes.JoinRequestPublic, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (JoinRequestLib.sendJoinRequest(joinRequests, caller, adId, ads)) {
      case (#err(e)) { #err(e) };
      case (#ok(req)) {
        #ok({
          id = req.id;
          adId = req.adId;
          requesterPrincipal = req.requesterPrincipal;
          createdAt = req.createdAt;
          status = req.status;
        });
      };
    };
  };

  // Cancels the caller's own join request.
  public shared ({ caller }) func cancelJoinRequest(
    requestId : Text
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    JoinRequestLib.cancelJoinRequest(joinRequests, caller, requestId);
  };

  // Returns all join requesters for an ad — only the ad owner may call this.
  // Each entry pairs the join request with the requester's public profile.
  public query ({ caller }) func getJoinRequestsForAd(
    adId : Text
  ) : async Common.Result<[{ request : JoinRequestTypes.JoinRequestPublic; profile : ?ProfileTypes.UserProfilePublic }], Text> {
    switch (JoinRequestLib.getJoinRequestsForAd(joinRequests, caller, adId, ads)) {
      case (#err(e)) { #err(e) };
      case (#ok(requests)) {
        let result = List.empty<{ request : JoinRequestTypes.JoinRequestPublic; profile : ?ProfileTypes.UserProfilePublic }>();
        for (req in requests.vals()) {
          let maybeProfile : ?ProfileTypes.UserProfilePublic = switch (profiles.get(req.requesterPrincipal)) {
            case (null) { null };
            case (?p) {
              ?{
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
                dateOfBirth = null; // dateOfBirth is in a separate map not accessible in query
                createdAt = p.createdAt;
                updatedAt = p.updatedAt;
              };
            };
          };
          result.add({
            request = {
              id = req.id;
              adId = req.adId;
              requesterPrincipal = req.requesterPrincipal;
              createdAt = req.createdAt;
              status = req.status;
            };
            profile = maybeProfile;
          });
        };
        #ok(result.toArray());
      };
    };
  };

  // Returns all ads the caller has sent a join request for (active requests only),
  // paired with the ad's public data.
  public query ({ caller }) func getMyJoinRequests() : async Common.Result<[{ request : JoinRequestTypes.JoinRequestPublic; ad : ?AdTypes.AdvertisementPublic }], Text> {
    let requests = JoinRequestLib.getMyJoinRequests(joinRequests, caller);
    let result = List.empty<{ request : JoinRequestTypes.JoinRequestPublic; ad : ?AdTypes.AdvertisementPublic }>();
    for (req in requests.vals()) {
      let maybeAd : ?AdTypes.AdvertisementPublic = switch (ads.get(req.adId)) {
        case (null) { null };
        case (?ad) {
          let creatorProfile : ?ProfileTypes.UserProfilePublic = switch (profiles.get(ad.creatorPrincipal)) {
            case (null) { null };
            case (?p) {
              ?{
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
          };
          ?{
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
            creatorProfile;
          };
        };
      };
      result.add({
        request = {
          id = req.id;
          adId = req.adId;
          requesterPrincipal = req.requesterPrincipal;
          createdAt = req.createdAt;
          status = req.status;
        };
        ad = maybeAd;
      });
    };
    #ok(result.toArray());
  };

  // Returns true if the caller has an active join request for the given ad.
  public query ({ caller }) func hasJoinRequest(
    adId : Text
  ) : async Common.Result<Bool, Text> {
    #ok(JoinRequestLib.hasJoinRequest(joinRequests, caller, adId));
  };
};
