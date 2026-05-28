import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import AccessControl "mo:caffeineai-authorization/access-control";
import Stripe "mo:caffeineai-stripe/stripe";
import OutCall "mo:caffeineai-http-outcalls/outcall";
import AdLib "../lib/advertisement";
import AdTypes "../types/advertisement";
import ProfileTypes "../types/profile";
import ReferralTypes "../types/referral";
import Common "../types/common";

// Public API mixin for the advertisement domain

mixin (
  accessControlState : AccessControl.AccessControlState,
  ads : Map.Map<Text, AdTypes.Advertisement>,
  profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
  dateOfBirths : Map.Map<Principal, Int>,
  adState : { var nextAdId : Nat },
  stripeConfig : { var config : ?Stripe.StripeConfiguration },
  transform : OutCall.Transform,
  referralLedger : Map.Map<Text, ReferralTypes.ReferralEntry>,
) {
  // Private promo code — never returned from any public function
  let PROMO_CODE : Text = "rfh%6.._)Rt56!Q__1:2";

  // Returns published feed with optional filters and pagination
  public query func getFeed(
    filter : AdTypes.FeedFilter,
    offset : Nat,
    limit : Nat,
  ) : async [AdTypes.AdvertisementPublic] {
    AdLib.getFeed(ads, profiles, dateOfBirths, filter, offset, limit);
  };

  // Returns a single published ad by id (public).
  // If the creator has hideContactsInAds = true, the contact field is omitted for non-owners.
  public query ({ caller }) func getAdById(id : Text) : async ?AdTypes.AdvertisementPublic {
    switch (AdLib.getAdById(ads, profiles, dateOfBirths, id)) {
      case (null) { null };
      case (?pub) {
        // Hide contact from creator profile if hideContactsInAds is set and caller is not the owner
        let maskedProfile : ?ProfileTypes.UserProfilePublic = switch (pub.creatorProfile) {
          case (null) { null };
          case (?cp) {
            // Only mask if caller is NOT the ad owner
            let isOwner = Principal.equal(caller, pub.creatorPrincipal);
            if (not isOwner) {
              // Check raw profile for hideContactsInAds flag
              switch (profiles.get(pub.creatorPrincipal)) {
                case (null) { ?cp };
                case (?raw) {
                  if (raw.hideContactsInAds) {
                    // contact is not part of UserProfilePublic — already stripped;
                    // nothing extra to mask at this layer
                    ?cp;
                  } else { ?cp };
                };
              };
            } else { ?cp };
          };
        };
        ?{ pub with creatorProfile = maskedProfile };
      };
    };
  };

  // Returns all ads created by the caller
  public query ({ caller }) func getMyAds() : async [AdTypes.Advertisement] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AdLib.getMyAds(ads, caller);
  };

  // Creates a new ad draft
  public shared ({ caller }) func createAd(
    input : AdTypes.AdInput
  ) : async Common.Result<AdTypes.Advertisement, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AdLib.createAd(ads, adState, caller, input, Time.now());
  };

  // Updates an existing ad owned by caller
  public shared ({ caller }) func updateAd(
    id : Text,
    input : AdTypes.AdInput,
  ) : async Common.Result<AdTypes.Advertisement, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AdLib.updateAd(ads, caller, id, input, Time.now());
  };

  // Soft-deletes an ad owned by caller
  public shared ({ caller }) func deleteAd(
    id : Text
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    AdLib.deleteAd(ads, caller, id, Time.now());
  };

  // Creates a Stripe checkout session for the given ad; marks ad as pending_payment
  // Creates a Stripe checkout session for the given ad and returns raw JSON string from Stripe
  public shared ({ caller }) func createStripeSession(
    adId : Text,
    successUrl : Text,
    cancelUrl : Text,
  ) : async Common.Result<Text, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let cfg = switch (stripeConfig.config) {
      case (null) { return #err("Stripe is not configured") };
      case (?c) { c };
    };
    // Verify ad exists and belongs to caller
    switch (ads.get(adId)) {
      case (null) { return #err("Advertisement not found") };
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        let items : [Stripe.ShoppingItem] = [{
          currency = "usd";
          productName = ad.eventName;
          productDescription = ad.description;
          priceInCents = 499; // $4.99 USD
          quantity = 1;
        }];
        // Return raw JSON string from Stripe — frontend will parse and extract url + session id
        let jsonStr = await Stripe.createCheckoutSession(cfg, caller, items, successUrl, cancelUrl, transform);
        if (jsonStr == "") {
          return #err("Stripe session created but response is empty");
        };
        #ok(jsonStr);
      };
    };
  };

  // Confirms Stripe payment and publishes the ad
  // Saves the Stripe session ID as paymentReference on the ad (called by frontend after parsing JSON)
  public shared ({ caller }) func savePaymentReference(
    adId : Text,
    sessionId : Text,
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (AdLib.markPendingPayment(ads, caller, adId, sessionId, Time.now())) {
      case (#ok(_)) { #ok(()) };
      case (#err(e)) { #err(e) };
    };
  };

  public shared ({ caller }) func confirmPayment(
    adId : Text,
    sessionId : Text,
  ) : async Common.Result<AdTypes.Advertisement, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    let cfg = switch (stripeConfig.config) {
      case (null) { return #err("Stripe is not configured") };
      case (?c) { c };
    };
    // Verify payment status with Stripe
    let status = await Stripe.getSessionStatus(cfg, sessionId, transform);
    switch (status) {
      case (#failed { error }) {
        // Mark payment failed
        switch (ads.get(adId)) {
          case (?ad) {
            if (Principal.equal(ad.creatorPrincipal, caller)) {
              let updated : AdTypes.Advertisement = { ad with paymentStatus = #failed; updatedAt = Time.now() };
              ads.add(adId, updated);
            };
          };
          case null {};
        };
        #err("Payment failed: " # error);
      };
      case (#completed { userPrincipal = _ ; response = _ }) {
        let result = AdLib.confirmPayment(ads, caller, adId, sessionId, Time.now());
        // After publishing, set paid = 4.99 and credit referral commission
        switch (result) {
          case (#ok(publishedAd)) {
            // ALPHA: Temporarily disabled — re-enable when prod Stripe keys are configured
            // let paidAd : AdTypes.Advertisement = { publishedAd with paid = 4.99 };
            // ads.add(adId, paidAd);

            // ALPHA: Temporarily disabled — re-enable when prod Stripe keys are configured
            // let creatorPrincipal = publishedAd.creatorPrincipal;
            // switch (profiles.get(creatorPrincipal)) {
            //   case (null) {};
            //   case (?creatorProfile) {
            //     switch (creatorProfile.referredBy) {
            //       case (null) {}; // not referred — nothing to credit
            //       case (?referrerPrincipal) {
            //         let commission : Float = 4.99 * 0.33;
            //         // Credit referrer's balance
            //         switch (profiles.get(referrerPrincipal)) {
            //           case (null) {};
            //           case (?referrerProfile) {
            //             let updatedReferrer : ProfileTypes.UserProfile = { referrerProfile with balance = referrerProfile.balance + commission };
            //             profiles.add(referrerPrincipal, updatedReferrer);
            //           };
            //         };
            //         // Update referral ledger entry
            //         let ledgerKey = referrerPrincipal.toText() # ":" # creatorPrincipal.toText();
            //         switch (referralLedger.get(ledgerKey)) {
            //           case (null) {
            //             let newEntry : ReferralTypes.ReferralEntry = {
            //               referredPrincipal = creatorPrincipal;
            //               referredAt = Time.now();
            //               adsPublished = 1;
            //               totalEarned = commission;
            //             };
            //             referralLedger.add(ledgerKey, newEntry);
            //           };
            //           case (?existing) {
            //             let updatedEntry : ReferralTypes.ReferralEntry = {
            //               existing with
            //               adsPublished = existing.adsPublished + 1;
            //               totalEarned = existing.totalEarned + commission;
            //             };
            //             referralLedger.add(ledgerKey, updatedEntry);
            //           };
            //         };
            //       };
            //     };
            //   };
            // };

            #ok(publishedAd);
          };
          case (#err(e)) { #err(e) };
        };
      };
    };
  };

  // Publishes an ad using a promo code instead of payment
  public shared ({ caller }) func publishByPromoCode(
    adId : Text,
    code : Text,
  ) : async Common.Result<(), Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    if (not Text.equal(code, PROMO_CODE)) {
      return #err("Invalid promo code");
    };
    switch (ads.get(adId)) {
      case (null) { return #err("Advertisement not found") };
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        let updated : AdTypes.Advertisement = {
          ad with
          status = #published;
          paymentStatus = #paid;
          paid = 0.0;
          publishedAt = ?Time.now();
          updatedAt = Time.now();
        };
        ads.add(adId, updated);
        #ok(());
      };
    };
  };

  // Fetches and stores a link preview for an ad's eventLink via HTTP outcall
  public shared ({ caller }) func updateLinkPreview(
    adId : Text
  ) : async Common.Result<AdTypes.LinkPreview, Text> {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized");
    };
    switch (ads.get(adId)) {
      case (null) { return #err("Advertisement not found") };
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        switch (ad.eventLink) {
          case (null) { return #err("No eventLink set on this advertisement") };
          case (?url) {
            // Fetch the page HTML via HTTP outcall
            let html = await OutCall.httpGetRequest(url, [], transform);
            let preview = parsePreviewFromHtml(url, html);
            AdLib.storeLinkPreview(ads, caller, adId, preview, Time.now());
          };
        };
      };
    };
  };

  // --- Private helpers ---

  // Extract a JSON string field value by key (minimal, no full parser)
  func extractJsonField(json : Text, fieldName : Text) : ?Text {
    let needle = "\"" # fieldName # "\"";
    // Find needle followed by : "value"
    let parts = json.split(#text needle);
    var found = false;
    var result : ?Text = null;
    for (part in parts) {
      if (found and result == null) {
        // part starts after the field name; find ":" then extract quoted string
        let afterColon = part.split(#text ":");
        var skipFirst = true;
        for (segment in afterColon) {
          if (skipFirst) { skipFirst := false }
          else if (result == null) {
            let trimmed = segment.trim(#text " ");
            if (trimmed.startsWith(#text "\"")) {
              // Extract up to next quote
              let inner = trimmed.stripStart(#text "\"");
              switch (inner) {
                case (?s) {
                  let valueParts = s.split(#text "\"");
                  var gotVal = false;
                  for (vp in valueParts) {
                    if (not gotVal) {
                      result := ?vp;
                      gotVal := true;
                    };
                  };
                };
                case null {};
              };
            };
          };
        };
      };
      if (not found) { found := true };
    };
    result;
  };

  // Parse a minimal link preview from HTML (extract og/meta tags)
  func parsePreviewFromHtml(url : Text, html : Text) : AdTypes.LinkPreview {
    let title = extractMetaContent(html, "og:title");
    let description = extractMetaContent(html, "og:description");
    let image = extractMetaContent(html, "og:image");
    // Extract domain from url
    let domain : ?Text = do {
      let withoutProto = if (url.startsWith(#text "https://")) {
        switch (url.stripStart(#text "https://")) { case (?s) s; case null url }
      } else if (url.startsWith(#text "http://")) {
        switch (url.stripStart(#text "http://")) { case (?s) s; case null url }
      } else { url };
      let domainParts = withoutProto.split(#text "/");
      var d : ?Text = null;
      var gotFirst = false;
      for (part in domainParts) {
        if (not gotFirst) { d := ?part; gotFirst := true };
      };
      d;
    };
    { url; title; description; image; domain };
  };

  // Extract content attribute of a meta tag by property name
  func extractMetaContent(html : Text, property : Text) : ?Text {
    let needle = "property=\"" # property # "\"";
    let parts = html.split(#text needle);
    var found = false;
    var result : ?Text = null;
    for (part in parts) {
      if (found and result == null) {
        // Look for content="..."
        let contentParts = part.split(#text "content=\"");
        var skipFirst2 = true;
        for (seg in contentParts) {
          if (skipFirst2) { skipFirst2 := false }
          else if (result == null) {
            let valueParts = seg.split(#text "\"");
            var gotVal = false;
            for (vp in valueParts) {
              if (not gotVal) {
                result := ?vp;
                gotVal := true;
              };
            };
          };
        };
      };
      if (not found) { found := true };
    };
    result;
  };
};
