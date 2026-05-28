import Storage "mo:caffeineai-object-storage/Storage";

// Domain-specific types for the user profile domain
module {
  public type Sex = { #male; #female; #other };

  public type BlobMetadata = {
    blob : Storage.ExternalBlob;
    contentType : Text;
    size : Nat;
    createdAt : Int;
  };

  public type UserProfile = {
    principal : Principal;
    fullName : Text;
    username : ?Text;
    phoneNumber : ?Text;
    telegram : ?Text;
    instagram : ?Text;
    photos : [BlobMetadata];
    defaultAvatar : Text; // "pepe" | "doge"
    bio : Text;
    sex : Sex;
    city : ?Text;
    language : Text;
    hideContactsInAds : Bool;
    age : ?Nat; // deprecated legacy field — stable compat; dateOfBirth stored separately
    // Referral system fields (new — default null/0.0 for existing profiles)
    referralCode : ?Text;    // unique code for sharing referral links
    referredBy : ?Principal; // set once when user registers via a referral link
    balance : Float;         // accumulated referral commission earnings (read-only for user)
    createdAt : Int;
    updatedAt : Int;
  };

  // Public profile without contact details
  public type UserProfilePublic = {
    principal : Principal;
    fullName : Text;
    username : ?Text;
    photos : [BlobMetadata];
    defaultAvatar : Text;
    bio : Text;
    sex : Sex;
    city : ?Text;
    language : Text;
    hideContactsInAds : Bool;
    age : ?Nat; // deprecated legacy field
    dateOfBirth : ?Int; // stored in separate stable map in main.mo
    createdAt : Int;
    updatedAt : Int;
  };

  // Input type for creating/updating a profile
  public type ProfileInput = {
    fullName : Text;
    username : ?Text;
    phoneNumber : ?Text;
    telegram : ?Text;
    instagram : ?Text;
    photos : [BlobMetadata];
    bio : Text;
    sex : Sex;
    city : ?Text;
    language : Text;
    hideContactsInAds : Bool;
    dateOfBirth : ?Int;
  };
};
