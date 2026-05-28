import ProfileTypes "profile";

// Domain-specific types for the advertisement domain
module {
  public type EventType = {
    #restaurant;
    #cinema;
    #coffee;
    #walking;
    #sport;
    #gaming;
    #study;
    #concert;
    #travel;
    #virtual;
    #other;
  };

  public type MeetType = { #inPerson; #online };

  public type ExpectedCompanionSex = { #male; #female; #both };

  public type AdStatus = {
    #draft;
    #pending_payment;
    #published;
    #rejected;
    #deleted;
  };

  public type PaymentStatus = {
    #unpaid;
    #pending;
    #paid;
    #failed;
  };

  public type LinkPreview = {
    url : Text;
    title : ?Text;
    description : ?Text;
    image : ?Text;
    domain : ?Text;
  };

  public type Advertisement = {
    id : Text;
    creatorPrincipal : Principal;
    eventName : Text;
    eventType : EventType;
    city : ?Text;
    isVirtual : Bool;
    meetType : MeetType;
    description : Text;
    expectedCompanionSex : ExpectedCompanionSex;
    howPaysForEvent : HowPaysForEvent;
    eventLink : ?Text;
    linkPreview : ?LinkPreview;
    photos : [ProfileTypes.BlobMetadata];
    status : AdStatus;
    paymentStatus : PaymentStatus;
    paymentProvider : ?Text;
    paymentReference : ?Text;
    paid : Float;
    createdAt : Int;
    updatedAt : Int;
    publishedAt : ?Int;
  };

  // Advertisement with embedded public creator profile
  public type AdvertisementPublic = {
    id : Text;
    creatorPrincipal : Principal;
    eventName : Text;
    eventType : EventType;
    city : ?Text;
    isVirtual : Bool;
    meetType : MeetType;
    description : Text;
    expectedCompanionSex : ExpectedCompanionSex;
    howPaysForEvent : HowPaysForEvent;
    eventLink : ?Text;
    linkPreview : ?LinkPreview;
    photos : [ProfileTypes.BlobMetadata];
    status : AdStatus;
    paymentStatus : PaymentStatus;
    paymentProvider : ?Text;
    paymentReference : ?Text;
    paid : Float;
    createdAt : Int;
    updatedAt : Int;
    publishedAt : ?Int;
    creatorProfile : ?ProfileTypes.UserProfilePublic;
  };

  public type HowPaysForEvent = { #me; #you; #split; #free };

  // Input type for creating/updating an advertisement
  public type AdInput = {
    eventName : Text;
    eventType : EventType;
    city : ?Text;
    isVirtual : Bool;
    meetType : MeetType;
    description : Text;
    expectedCompanionSex : ExpectedCompanionSex;
    howPaysForEvent : HowPaysForEvent;
    eventLink : ?Text;
    photos : [ProfileTypes.BlobMetadata];
  };

  public type SortBy = { #newest; #oldest; #city; #eventType };

  public type FeedFilter = {
    ageMin : ?Nat;
    ageMax : ?Nat;
    eventType : ?EventType;
    creatorSex : ?ProfileTypes.Sex;
    city : ?Text;
    expectedCompanionSex : ?ExpectedCompanionSex;
    virtualOnly : ?Bool;
    offlineOnly : ?Bool;
    meetType : ?MeetType;
    language : ?Text;
    searchText : ?Text;
    sortBy : ?SortBy;
  };

  public type StripeSession = {
    sessionId : Text;
    checkoutUrl : Text;
  };
};
