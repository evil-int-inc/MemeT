import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Types "../types/profile";
import Common "../types/common";

// Domain logic for user profiles
module {
  // Get a user's own profile
  public func getMyProfile(
    profiles : Map.Map<Principal, Types.UserProfile>,
    caller : Principal,
  ) : ?Types.UserProfile {
    profiles.get(caller);
  };

  // Upsert (create or update) a profile
  public func upsertProfile(
    profiles : Map.Map<Principal, Types.UserProfile>,
    usernameIndex : Map.Map<Text, Principal>,
    dateOfBirths : Map.Map<Principal, Int>,
    referralCodeIndex : Map.Map<Text, Principal>,
    caller : Principal,
    input : Types.ProfileInput,
    now : Int,
  ) : Common.Result<Types.UserProfile, Text> {
    // Validate input
    switch (validateInput(input)) {
      case (?err) { return #err(err) };
      case null {};
    };
    // Enforce unique username
    switch (input.username) {
      case (?uname) {
        switch (usernameIndex.get(uname)) {
          case (?existing) {
            if (not Principal.equal(existing, caller)) {
              return #err("Username already taken");
            };
          };
          case null {};
        };
      };
      case null {};
    };
    // If old profile exists, clear old username from index
    switch (profiles.get(caller)) {
      case (?old) {
        switch (old.username) {
          case (?oldName) { usernameIndex.remove(oldName) };
          case null {};
        };
      };
      case null {};
    };
    // Determine stable defaultAvatar: reuse existing or assign based on principal hash
    let defaultAvatar = switch (profiles.get(caller)) {
      case (?existing) { existing.defaultAvatar };
      case null {
        let hash = caller.hash();
        if (hash % 2 == 0) { "pepe" } else { "doge" };
      };
    };
    let createdAt : Int = switch (profiles.get(caller)) {
      case (?existing) { existing.createdAt };
      case null { now };
    };
    // Preserve referral-system fields (never overwritten by user input)
    let (referralCode, referredBy, balance) = switch (profiles.get(caller)) {
      case (?existing) {
        (existing.referralCode, existing.referredBy, existing.balance);
      };
      case null {
        // New profile: auto-generate a unique referral code
        let newCode = generateReferralCode(caller);
        referralCodeIndex.add(newCode, caller);
        (?newCode, null, 0.0);
      };
    };
    // Store dateOfBirth in the separate map
    switch (input.dateOfBirth) {
      case (?dob) { dateOfBirths.add(caller, dob) };
      case null { dateOfBirths.remove(caller) };
    };
    let profile : Types.UserProfile = {
      principal = caller;
      fullName = input.fullName;
      username = input.username;
      phoneNumber = input.phoneNumber;
      telegram = input.telegram;
      instagram = input.instagram;
      photos = input.photos;
      defaultAvatar;
      bio = input.bio;
      sex = input.sex;
      city = input.city;
      language = input.language;
      hideContactsInAds = input.hideContactsInAds;
      age = null; // deprecated — preserved for stable upgrade compatibility
      referralCode;
      referredBy;
      balance;
      createdAt;
      updatedAt = now;
    };
    profiles.add(caller, profile);
    // Update username index
    switch (input.username) {
      case (?uname) { usernameIndex.add(uname, caller) };
      case null {};
    };
    #ok(profile);
  };

  // Get a public profile (no contact info)
  public func getPublicProfile(
    profiles : Map.Map<Principal, Types.UserProfile>,
    dateOfBirths : Map.Map<Principal, Int>,
    principalText : Text,
  ) : ?Types.UserProfilePublic {
    let p = Principal.fromText(principalText);
    switch (profiles.get(p)) {
      case (?profile) { ?toPublic(profile, dateOfBirths.get(p)) };
      case null { null };
    };
  };

  // Get full profile with contact — only owner may call
  public func getPublicProfileWithContact(
    profiles : Map.Map<Principal, Types.UserProfile>,
    caller : Principal,
    principalText : Text,
  ) : Common.Result<Types.UserProfile, Text> {
    let p = Principal.fromText(principalText);
    if (not Principal.equal(caller, p)) {
      return #err("Unauthorized: can only view your own full profile");
    };
    switch (profiles.get(p)) {
      case (?profile) { #ok(profile) };
      case null { #err("Profile not found") };
    };
  };

  // Strip contact from a UserProfile to produce UserProfilePublic
  public func toPublic(profile : Types.UserProfile, dateOfBirth : ?Int) : Types.UserProfilePublic {
    {
      principal = profile.principal;
      fullName = profile.fullName;
      username = profile.username;
      photos = profile.photos;
      defaultAvatar = profile.defaultAvatar;
      bio = profile.bio;
      sex = profile.sex;
      city = profile.city;
      language = profile.language;
      hideContactsInAds = profile.hideContactsInAds;
      age = profile.age; // deprecated field, pass through for compatibility
      dateOfBirth;
      createdAt = profile.createdAt;
      updatedAt = profile.updatedAt;
    };
  };

  // Generate a deterministic 8-character alphanumeric referral code from a principal
  public func generateReferralCode(p : Principal) : Text {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no ambiguous O/0/I/1
    let hash : Nat = p.hash().toNat();
    var code = "";
    var h = hash;
    for (_ in [1, 2, 3, 4, 5, 6, 7, 8].vals()) {
      let idx = h % 32;
      let charSlice = chars.chars();
      var i : Nat = 0;
      var ch = 'A';
      for (c in charSlice) {
        if (i == idx) { ch := c };
        i += 1;
      };
      code := code # Text.fromChar(ch);
      h := h / 32;
    };
    code;
  };

  // Validate profile input; returns error text if invalid
  public func validateInput(input : Types.ProfileInput) : ?Text {
    if (input.fullName.size() == 0) {
      return ?("fullName is required");
    };
    if (input.bio.size() == 0) {
      return ?("bio is required");
    };
    // At least one contact method must be provided
    let hasPhone = switch (input.phoneNumber) {
      case (?p) { p.size() > 0 };
      case null { false };
    };
    let hasTelegram = switch (input.telegram) {
      case (?t) { t.size() > 0 };
      case null { false };
    };
    let hasInstagram = switch (input.instagram) {
      case (?i) { i.size() > 0 };
      case null { false };
    };
    if (not hasPhone and not hasTelegram and not hasInstagram) {
      return ?("At least one contact method (phone number, Telegram, or Instagram) is required");
    };
    // Validate phoneNumber: at least 5 characters
    switch (input.phoneNumber) {
      case (?p) {
        if (p.size() > 0 and p.size() < 5) {
          return ?("Phone number must be at least 5 characters");
        };
      };
      case null {};
    };
    // Validate telegram: must start with @ and be at least 2 chars
    switch (input.telegram) {
      case (?t) {
        if (t.size() > 0) {
          if (not t.startsWith(#text "@")) {
            return ?("Telegram username must start with @");
          };
          if (t.size() < 2) {
            return ?("Telegram username must be at least 2 characters");
          };
        };
      };
      case null {};
    };
    // Validate instagram: must start with @ and be at least 2 chars
    switch (input.instagram) {
      case (?i) {
        if (i.size() > 0) {
          if (not i.startsWith(#text "@")) {
            return ?("Instagram handle must start with @");
          };
          if (i.size() < 2) {
            return ?("Instagram handle must be at least 2 characters");
          };
        };
      };
      case null {};
    };
    if (input.photos.size() > 7) {
      return ?("Maximum 7 photos allowed");
    };
    // Validate dateOfBirth: if provided must be in the past and at most 120 years ago
    switch (input.dateOfBirth) {
      case (?dob) {
        let nowMs : Int = Time.now() / 1_000_000;
        if (dob >= nowMs) {
          return ?("dateOfBirth must be in the past");
        };
        let maxAgeMs : Int = 120 * 365 * 24 * 60 * 60 * 1000;
        if (nowMs - dob > maxAgeMs) {
          return ?("dateOfBirth is too far in the past (max 120 years)");
        };
      };
      case null {};
    };
    null;
  };
};
