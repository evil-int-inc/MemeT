import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Int "mo:core/Int";
import List "mo:core/List";
import JoinRequestTypes "../types/join-request";
import AdTypes "../types/advertisement";
import Common "../types/common";

// Domain logic for the join-request feature
module {
  // Sends a join request from `caller` for the given ad.
  // Validates: ad exists, ad is published, caller is not owner, no duplicate active request.
  // Returns the created JoinRequest or an error.
  public func sendJoinRequest(
    joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
    caller : Principal,
    adId : Text,
    ads : Map.Map<Text, AdTypes.Advertisement>,
  ) : Common.Result<JoinRequestTypes.JoinRequest, Text> {
    // Check ad exists and is published
    let ad = switch (ads.get(adId)) {
      case (null) { return #err("Advertisement not found") };
      case (?a) { a };
    };
    if (ad.status != #published) {
      return #err("Advertisement is not published");
    };
    // Caller cannot send a request on their own ad
    if (Principal.equal(ad.creatorPrincipal, caller)) {
      return #err("You cannot send a join request on your own advertisement");
    };
    // Check for duplicate active request
    let hasDuplicate = joinRequests.any(
      func(_, req : JoinRequestTypes.JoinRequest) : Bool {
        Principal.equal(req.requesterPrincipal, caller) and req.adId == adId and req.status == #active
      }
    );
    if (hasDuplicate) {
      return #err("You already have an active join request for this advertisement");
    };
    // Generate unique ID: timestamp + caller principal text
    let now = Time.now();
    let id = now.toText() # "-" # caller.toText();
    let newRequest : JoinRequestTypes.JoinRequest = {
      id;
      adId;
      requesterPrincipal = caller;
      createdAt = now;
      status = #active;
    };
    joinRequests.add(id, newRequest);
    #ok(newRequest);
  };

  // Cancels a join request owned by `caller`.
  public func cancelJoinRequest(
    joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
    caller : Principal,
    requestId : Text,
  ) : Common.Result<(), Text> {
    let req = switch (joinRequests.get(requestId)) {
      case (null) { return #err("Join request not found") };
      case (?r) { r };
    };
    if (not Principal.equal(req.requesterPrincipal, caller)) {
      return #err("You can only cancel your own join requests");
    };
    let updated = { req with status = #cancelled };
    joinRequests.add(requestId, updated);
    #ok(());
  };

  // Returns all active join requests for an ad — only the ad owner may call this.
  public func getJoinRequestsForAd(
    joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
    caller : Principal,
    adId : Text,
    ads : Map.Map<Text, AdTypes.Advertisement>,
  ) : Common.Result<[JoinRequestTypes.JoinRequest], Text> {
    let ad = switch (ads.get(adId)) {
      case (null) { return #err("Advertisement not found") };
      case (?a) { a };
    };
    if (not Principal.equal(ad.creatorPrincipal, caller)) {
      return #err("Only the advertisement owner can view join requests");
    };
    let result = List.empty<JoinRequestTypes.JoinRequest>();
    for ((_, req) in joinRequests.entries()) {
      if (req.adId == adId and req.status == #active) {
        result.add(req);
      };
    };
    #ok(result.toArray());
  };

  // Returns all active join requests made by `caller`.
  public func getMyJoinRequests(
    joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
    caller : Principal,
  ) : [JoinRequestTypes.JoinRequest] {
    let result = List.empty<JoinRequestTypes.JoinRequest>();
    for ((_, req) in joinRequests.entries()) {
      if (Principal.equal(req.requesterPrincipal, caller) and req.status == #active) {
        result.add(req);
      };
    };
    result.toArray();
  };

  // Returns true if `caller` has an active join request for `adId`.
  public func hasJoinRequest(
    joinRequests : Map.Map<Text, JoinRequestTypes.JoinRequest>,
    caller : Principal,
    adId : Text,
  ) : Bool {
    joinRequests.any(
      func(_, req : JoinRequestTypes.JoinRequest) : Bool {
        Principal.equal(req.requesterPrincipal, caller) and req.adId == adId and req.status == #active
      }
    );
  };
};
