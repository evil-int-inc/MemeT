import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProfileLib "../lib/profile";
import ProfileTypes "../types/profile";
import Common "../types/common";
import AdTypes "../types/advertisement";
import JoinRequestTypes "../types/join-request";

// Public API mixin for the profile domain
mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
  usernameIndex : Map.Map<Text, Principal>,
  dateOfBirths : Map.Map<Principal, Int>,
  referralCodeIndex : Map.Map<Text, Principal>,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
) {
  // Returns the caller's own profile
  public query ({ caller }) func getMyProfile() : async ?ProfileTypes.UserProfile {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.getMyProfile(profiles, caller);
  };

  // Creates or updates the caller's profile
  public shared ({ caller }) func upsertProfile(
    input : ProfileTypes.ProfileInput
  ) : async Common.Result<ProfileTypes.UserProfile, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.upsertProfile(profiles, usernameIndex, dateOfBirths, referralCodeIndex, caller, input, Time.now());
  };

  // Returns a public profile (no contact info) for any principal
  public query func getPublicProfile(
    principalText : Text
  ) : async ?ProfileTypes.UserProfilePublic {
    ProfileLib.getPublicProfile(profiles, dateOfBirths, principalText);
  };

  // Returns full profile including contact; only the owner may call
  public shared ({ caller }) func getPublicProfileWithContact(
    principalText : Text
  ) : async Common.Result<ProfileTypes.UserProfile, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    ProfileLib.getPublicProfileWithContact(profiles, caller, principalText);
  };

  // Returns true if targetPrincipal has at least one active join request
  // on any ad owned by viewerPrincipal. Used to decide whether to show
  // contact details on the target's profile page.
  public query func hasJoinRequestRelationship(
    viewerPrincipal : Principal,
    targetPrincipal : Principal,
  ) : async Bool {
    for ((_id, jr) in joinRequests.entries()) {
      if (jr.requesterPrincipal == targetPrincipal and jr.status == #active) {
        switch (ads.get(jr.adId)) {
          case (?ad) {
            if (ad.creatorPrincipal == viewerPrincipal) {
              return true;
            };
          };
          case null {};
        };
      };
    };
    false;
  };
};
