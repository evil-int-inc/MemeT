// Domain-specific types for the join-request domain
module {
  public type JoinRequestStatus = { #active; #cancelled };

  public type JoinRequest = {
    id : Text;
    adId : Text;
    requesterPrincipal : Principal;
    createdAt : Int;
    status : JoinRequestStatus;
  };

  // Public projection — no private fields (same shape for now)
  public type JoinRequestPublic = {
    id : Text;
    adId : Text;
    requesterPrincipal : Principal;
    createdAt : Int;
    status : JoinRequestStatus;
  };
};
