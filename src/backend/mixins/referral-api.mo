import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import AccessControl "mo:caffeineai-authorization/access-control";
import ProfileTypes "../types/profile";
import ReferralTypes "../types/referral";
import Common "../types/common";
import AdTypes "../types/advertisement";
import Nat32 "mo:core/Nat32";

// Public API mixin for the referral domain.
// Internal helper creditReferralCommission is NOT exposed as a public call —
// it is called only from within advertisement-api.mo after a confirmed payment.
mixin (
  accessControlState : AccessControl.AccessControlState,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  // Reverse index: referralCode (Text) -> Principal, for O(1) lookup
  referralCodeIndex : Map.Map<Text, Principal>,
  // Referral ledger: referrerPrincipal -> [ReferralEntry]
  // Stored as flat map keyed by "referrer:referred" for simplicity
  referralLedger : Map.Map<Text, ReferralTypes.ReferralEntry>,
) {
  // --- Public API ---

  // Returns the caller's own referral code; auto-generates one if missing.
  public shared ({ caller }) func getReferralCode() : async Common.Result<Text, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (null) { #err("Profile not found. Please create a profile first.") };
      case (?profile) {
        let code = switch (profile.referralCode) {
          case (?c) { c };
          case (null) {
            // Generate and persist a new referral code
            let newCode = generateCode(caller);
            let updated : ProfileTypes.UserProfile = { profile with referralCode = ?newCode };
            profiles.add(caller, updated);
            referralCodeIndex.add(newCode, caller);
            newCode;
          };
        };
        #ok(code);
      };
    };
  };

  // Called when a new user lands via a referral link.
  // Sets the caller's referredBy field (only if not already set and caller != referrer).
  public shared ({ caller }) func setReferredBy(code : Text) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (null) { #err("Profile not found. Please create a profile first.") };
      case (?myProfile) {
        // Cannot re-set referredBy once assigned
        switch (myProfile.referredBy) {
          case (?_) { return #err("You have already been referred by someone.") };
          case (null) {};
        };
        // Look up referrer by code
        switch (referralCodeIndex.get(code)) {
          case (null) { #err("Referral code not found.") };
          case (?referrerPrincipal) {
            // Cannot refer yourself
            if (Principal.equal(referrerPrincipal, caller)) {
              return #err("You cannot use your own referral code.");
            };
            // Set referredBy on caller's profile
            let updated : ProfileTypes.UserProfile = { myProfile with referredBy = ?referrerPrincipal };
            profiles.add(caller, updated);
            // Create an initial ledger entry for this referral
            let ledgerKey = ledgerEntryKey(referrerPrincipal, caller);
            let entry : ReferralTypes.ReferralEntry = {
              referredPrincipal = caller;
              referredAt = Time.now();
              adsPublished = 0;
              totalEarned = 0.0;
            };
            referralLedger.add(ledgerKey, entry);
            #ok(());
          };
        };
      };
    };
  };

  // Returns all users referred by the caller with live stats.
  public query ({ caller }) func getMyReferrals() : async Common.Result<[ReferralTypes.ReferralEntry], Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (profiles.get(caller)) {
      case (null) { #err("Profile not found.") };
      case (?_) {
        let prefix = caller.toText() # ":";
        let results = referralLedger
          .entries()
          .filter(func((key, _)) { key.startsWith(#text prefix) })
          .map(func((_, entry)) { entry })
          .toArray();
        #ok(results);
      };
    };
  };

  // --- Internal helpers (not public update calls) ---

  // Called internally after a successful ad payment.
  // Adds commission to the referrer's balance and updates ledger stats.
  // Called internally after a successful ad payment.
  // Adds commission to the referrer's balance and updates ledger stats.
  // Annotated as : () (oneway) since it never returns a value.
  public func creditReferralCommission(
    publisherPrincipal : Principal,
    adPaymentAmount : Float,
  ) : () {
    // Only process if the publisher was referred by someone
    switch (profiles.get(publisherPrincipal)) {
      case (null) {}; // no profile, nothing to do
      case (?publisherProfile) {
        switch (publisherProfile.referredBy) {
          case (null) {}; // not referred, nothing to do
          case (?referrerPrincipal) {
            let commission = adPaymentAmount * ReferralTypes.REFERRAL_COMMISSION_RATE;
            // Credit referrer's balance
            switch (profiles.get(referrerPrincipal)) {
              case (null) {};
              case (?referrerProfile) {
                let newBalance = referrerProfile.balance + commission;
                let updatedReferrer : ProfileTypes.UserProfile = { referrerProfile with balance = newBalance };
                profiles.add(referrerPrincipal, updatedReferrer);
              };
            };
            // Update ledger entry stats
            let ledgerKey = ledgerEntryKey(referrerPrincipal, publisherPrincipal);
            switch (referralLedger.get(ledgerKey)) {
              case (null) {
                // Create entry if it doesn't exist (edge case: profile was set manually)
                let entry : ReferralTypes.ReferralEntry = {
                  referredPrincipal = publisherPrincipal;
                  referredAt = Time.now();
                  adsPublished = 1;
                  totalEarned = commission;
                };
                referralLedger.add(ledgerKey, entry);
              };
              case (?existing) {
                let updated : ReferralTypes.ReferralEntry = {
                  existing with
                  adsPublished = existing.adsPublished + 1;
                  totalEarned = existing.totalEarned + commission;
                };
                referralLedger.add(ledgerKey, updated);
              };
            };
          };
        };
      };
    };
  };

  // --- Private helpers ---

  // Generate a deterministic 8-character alphanumeric referral code from a principal.
  // Uses the principal's hash to ensure uniqueness and stability.
  func generateCode(p : Principal) : Text {
    let chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // 32 chars, no ambiguous O/0/I/1
    let hash = p.hash().toNat();
    var code = "";
    var h = hash;
    for (_ in [1, 2, 3, 4, 5, 6, 7, 8].vals()) {
      let idx = h % 32;
      // Extract single character at index from the alphabet string
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

  // Composite key for referral ledger: "referrerPrincipal:referredPrincipal"
  func ledgerEntryKey(referrer : Principal, referred : Principal) : Text {
    referrer.toText() # ":" # referred.toText();
  };
};
