// Domain-specific types for the referral system
module {
  // Commission rate: 33% of each referred user's ad payment goes to the referrer
  public let REFERRAL_COMMISSION_RATE : Float = 0.33;

  // Represents one referred user's stats from the referrer's perspective
  public type ReferralEntry = {
    referredPrincipal : Principal;
    referredAt : Int;      // Time.now() when referral was established
    adsPublished : Nat;    // number of paid/published ads created by the referred user
    totalEarned : Float;   // total commissions earned from this referred user
  };
};
