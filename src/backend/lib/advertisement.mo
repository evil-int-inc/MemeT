import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import ProfileLib "profile";
import AdTypes "../types/advertisement";
import ProfileTypes "../types/profile";
import Common "../types/common";
import Order "mo:core/Order";
import Time "mo:core/Time";

// Domain logic for advertisements
module {
  // Query the published feed with filters and pagination
  public func getFeed(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
    dateOfBirths : Map.Map<Principal, Int>,
    filter : AdTypes.FeedFilter,
    offset : Nat,
    limit : Nat,
  ) : [AdTypes.AdvertisementPublic] {
    // Collect published+paid ads, apply filters, then paginate
    let all = ads.values().toArray();
    let filtered = all.filter(func(ad : AdTypes.Advertisement) : Bool {
      // Only published + paid ads
      let isPublished = switch (ad.status) { case (#published) true; case _ false };
      let isPaid = switch (ad.paymentStatus) { case (#paid) true; case _ false };
      if (not isPublished or not isPaid) return false;
      // Virtual / offline filter
      switch (filter.virtualOnly) {
        case (?true) { if (not ad.isVirtual) return false };
        case _ {};
      };
      switch (filter.offlineOnly) {
        case (?true) { if (ad.isVirtual) return false };
        case _ {};
      };
      // Meet type filter
      switch (filter.meetType) {
        case (?#inPerson) {
          switch (ad.meetType) { case (#inPerson) {}; case (#online) { return false } };
        };
        case (?#online) {
          switch (ad.meetType) { case (#online) {}; case (#inPerson) { return false } };
        };
        case null {};
      };
      // Event type filter
      switch (filter.eventType) {
        case (?et) {
          let matches = switch (ad.eventType) {
            case (#restaurant) { switch et { case (#restaurant) true; case _ false } };
            case (#cinema)     { switch et { case (#cinema) true; case _ false } };
            case (#coffee)     { switch et { case (#coffee) true; case _ false } };
            case (#walking)    { switch et { case (#walking) true; case _ false } };
            case (#sport)      { switch et { case (#sport) true; case _ false } };
            case (#gaming)     { switch et { case (#gaming) true; case _ false } };
            case (#study)      { switch et { case (#study) true; case _ false } };
            case (#concert)    { switch et { case (#concert) true; case _ false } };
            case (#travel)     { switch et { case (#travel) true; case _ false } };
            case (#virtual)    { switch et { case (#virtual) true; case _ false } };
            case (#other)      { switch et { case (#other) true; case _ false } };
          };
          if (not matches) return false;
        };
        case null {};
      };
      // City filter: skip city check for virtual ads unless offlineOnly
      switch (filter.city) {
        case (?fc) {
          if (not ad.isVirtual) {
            switch (ad.city) {
              case (?c) { if (not Text.equal(c.toLower(), fc.toLower())) return false };
              case null { return false };
            };
          };
        };
        case null {};
      };
      // Expected companion sex filter
      switch (filter.expectedCompanionSex) {
        case (?ecs) {
          let matches = switch (ad.expectedCompanionSex) {
            case (#male) { switch ecs { case (#male) true; case _ false } };
            case (#female) { switch ecs { case (#female) true; case _ false } };
            case (#both) { switch ecs { case (#both) true; case _ false } };
          };
          if (not matches) return false;
        };
        case null {};
      };
      // Search text
      switch (filter.searchText) {
        case (?q) {
          let lq = q.toLower();
          let inName = ad.eventName.toLower().contains(#text lq);
          let inDesc = ad.description.toLower().contains(#text lq);
          let inCity = switch (ad.city) {
            case (?c) { c.toLower().contains(#text lq) };
            case null { false };
          };
          if (not inName and not inDesc and not inCity) return false;
        };
        case null {};
      };
      // Creator profile filters (age, sex, language)
      let profileOpt = profiles.get(ad.creatorPrincipal);
      switch (filter.creatorSex) {
        case (?cs) {
          switch (profileOpt) {
            case (?prof) {
              let matches = switch (prof.sex) {
                case (#male) { switch cs { case (#male) true; case _ false } };
                case (#female) { switch cs { case (#female) true; case _ false } };
                case (#other) { switch cs { case (#other) true; case _ false } };
              };
              if (not matches) return false;
            };
            case null { return false };
          };
        };
        case null {};
      };
      switch (filter.language) {
        case (?lang) {
          switch (profileOpt) {
            case (?prof) {
              if (not Text.equal(prof.language, lang)) return false;
            };
            case null { return false };
          };
        };
        case null {};
      };
      // Age range filter — computed from dateOfBirth in separate map; unknown dateOfBirth is excluded when a range is specified
      let ageMin = filter.ageMin;
      let ageMax = filter.ageMax;
      if (ageMin != null or ageMax != null) {
        switch (profileOpt) {
          case (?prof) {
            switch (dateOfBirths.get(prof.principal)) {
              case (?dob) {
                let nowMs : Int = Time.now() / 1_000_000;
                let ageYears : Int = (nowMs - dob) / (365 * 24 * 60 * 60 * 1000);
                switch (ageMin) {
                  case (?mn) { if (ageYears < mn) return false };
                  case null {};
                };
                switch (ageMax) {
                  case (?mx) { if (ageYears > mx) return false };
                  case null {};
                };
              };
              case null { return false }; // exclude unknown dateOfBirth
            };
          };
          case null { return false };
        };
      };
      true;
    });
    // Sort
    let sortBy = switch (filter.sortBy) {
      case (?s) { s };
      case null { #newest };
    };
    let sorted = filtered.sort(func(a : AdTypes.Advertisement, b : AdTypes.Advertisement) : Order.Order {
      switch sortBy {
        case (#newest) {
          if (a.createdAt > b.createdAt) #less
          else if (a.createdAt < b.createdAt) #greater
          else #equal
        };
        case (#oldest) {
          if (a.createdAt < b.createdAt) #less
          else if (a.createdAt > b.createdAt) #greater
          else #equal
        };
        case (#city) {
          let ca = switch (a.city) { case (?c) c; case null "" };
          let cb = switch (b.city) { case (?c) c; case null "" };
          Text.compare(ca, cb);
        };
        case (#eventType) {
          #equal // stable order for event type
        };
      };
    });
    // Paginate
    let total = sorted.size();
    let start = if (offset >= total) total else offset;
    let end_ = if (start + limit > total) total else start + limit;
    let page = sorted.sliceToArray(start, end_);
    page.map<AdTypes.Advertisement, AdTypes.AdvertisementPublic>(func(ad) { toPublic(ad, profiles, dateOfBirths) });
  };

  // Get a single ad by id (published only for anonymous)
  public func getAdById(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
    dateOfBirths : Map.Map<Principal, Int>,
    id : Text,
  ) : ?AdTypes.AdvertisementPublic {
    switch (ads.get(id)) {
      case (?ad) {
        let isPublished = switch (ad.status) { case (#published) true; case _ false };
        let isPaid = switch (ad.paymentStatus) { case (#paid) true; case _ false };
        if (isPublished and isPaid) {
          ?toPublic(ad, profiles, dateOfBirths)
        } else {
          null
        };
      };
      case null { null };
    };
  };

  // Get all ads owned by the caller
  public func getMyAds(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
  ) : [AdTypes.Advertisement] {
    ads.values().toArray().filter(func(ad : AdTypes.Advertisement) : Bool {
      Principal.equal(ad.creatorPrincipal, caller)
    });
  };

  // Create a new ad (saved as draft)
  public func createAd(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    state : { var nextAdId : Nat },
    caller : Principal,
    input : AdTypes.AdInput,
    now : Int,
  ) : Common.Result<AdTypes.Advertisement, Text> {
    switch (validateInput(input)) {
      case (?err) { return #err(err) };
      case null {};
    };
    let id = state.nextAdId.toText();
    state.nextAdId += 1;
    let ad : AdTypes.Advertisement = {
      id;
      creatorPrincipal = caller;
      eventName = input.eventName;
      eventType = input.eventType;
      city = input.city;
      isVirtual = input.isVirtual;
      meetType = input.meetType;
      description = input.description;
      expectedCompanionSex = input.expectedCompanionSex;
      howPaysForEvent = input.howPaysForEvent;
      eventLink = input.eventLink;
      linkPreview = null;
      photos = input.photos;
      status = #draft;
      paymentStatus = #unpaid;
      paymentProvider = null;
      paymentReference = null;
      paid = 0.0;
      createdAt = now;
      updatedAt = now;
      publishedAt = null;
    };
    ads.add(id, ad);
    #ok(ad);
  };

  // Update an existing ad owned by caller
  public func updateAd(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
    id : Text,
    input : AdTypes.AdInput,
    now : Int,
  ) : Common.Result<AdTypes.Advertisement, Text> {
    switch (validateInput(input)) {
      case (?err) { return #err(err) };
      case null {};
    };
    switch (ads.get(id)) {
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        // Can only edit draft or unpaid ads
        let editable = switch (ad.status) {
          case (#draft) true;
          case (#pending_payment) true;
          case _ false;
        };
        if (not editable) {
          return #err("Cannot edit a published or deleted ad");
        };
        let updated : AdTypes.Advertisement = {
          ad with
          eventName = input.eventName;
          eventType = input.eventType;
          city = input.city;
          isVirtual = input.isVirtual;
          meetType = input.meetType;
          description = input.description;
          expectedCompanionSex = input.expectedCompanionSex;
          howPaysForEvent = input.howPaysForEvent;
          eventLink = input.eventLink;
          photos = input.photos;
          updatedAt = now;
        };
        ads.add(id, updated);
        #ok(updated);
      };
      case null { #err("Advertisement not found") };
    };
  };

  // Soft-delete an ad owned by caller
  public func deleteAd(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
    id : Text,
    now : Int,
  ) : Common.Result<(), Text> {
    switch (ads.get(id)) {
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        let deleted : AdTypes.Advertisement = { ad with status = #deleted; updatedAt = now };
        ads.add(id, deleted);
        #ok(());
      };
      case null { #err("Advertisement not found") };
    };
  };

  // Mark ad as pending_payment after session created
  public func markPendingPayment(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
    id : Text,
    sessionId : Text,
    now : Int,
  ) : Common.Result<AdTypes.Advertisement, Text> {
    switch (ads.get(id)) {
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        let updated : AdTypes.Advertisement = {
          ad with
          status = #pending_payment;
          paymentStatus = #pending;
          paymentProvider = ?"stripe";
          paymentReference = ?sessionId;
          updatedAt = now;
        };
        ads.add(id, updated);
        #ok(updated);
      };
      case null { #err("Advertisement not found") };
    };
  };

  // Confirm payment and publish ad
  public func confirmPayment(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
    id : Text,
    sessionId : Text,
    now : Int,
  ) : Common.Result<AdTypes.Advertisement, Text> {
    switch (ads.get(id)) {
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        // Verify that the session id matches
        let storedSession = switch (ad.paymentReference) {
          case (?s) s;
          case null { return #err("No payment session on record") };
        };
        if (not Text.equal(storedSession, sessionId)) {
          return #err("Session ID mismatch");
        };
        let updated : AdTypes.Advertisement = {
          ad with
          status = #published;
          paymentStatus = #paid;
          publishedAt = ?now;
          updatedAt = now;
        };
        ads.add(id, updated);
        #ok(updated);
      };
      case null { #err("Advertisement not found") };
    };
  };

  // Store a fetched link preview on an ad
  public func storeLinkPreview(
    ads : Map.Map<Text, AdTypes.Advertisement>,
    caller : Principal,
    id : Text,
    preview : AdTypes.LinkPreview,
    now : Int,
  ) : Common.Result<AdTypes.LinkPreview, Text> {
    switch (ads.get(id)) {
      case (?ad) {
        if (not Principal.equal(ad.creatorPrincipal, caller)) {
          return #err("Unauthorized: not the owner");
        };
        let updated : AdTypes.Advertisement = { ad with linkPreview = ?preview; updatedAt = now };
        ads.add(id, updated);
        #ok(preview);
      };
      case null { #err("Advertisement not found") };
    };
  };

  // Validate ad input; returns error text if invalid
  public func validateInput(input : AdTypes.AdInput) : ?Text {
    if (input.eventName.size() == 0) {
      return ?("eventName is required");
    };
    if (input.description.size() == 0) {
      return ?("description is required");
    };
    // City required if not virtual
    if (not input.isVirtual) {
      switch (input.city) {
        case (null) { return ?("city is required for non-virtual events") };
        case (?c) {
          if (c.size() == 0) { return ?("city cannot be empty for non-virtual events") };
        };
      };
    };
    // Validate event link if provided
    switch (input.eventLink) {
      case (?url) {
        if (not (url.startsWith(#text "http://") or url.startsWith(#text "https://"))) {
          return ?("eventLink must be a valid URL starting with http:// or https://");
        };
      };
      case null {};
    };
    null;
  };

  // Merge ad with its creator public profile
  public func toPublic(
    ad : AdTypes.Advertisement,
    profiles : Map.Map<Principal, ProfileTypes.UserProfile>,
    dateOfBirths : Map.Map<Principal, Int>,
  ) : AdTypes.AdvertisementPublic {
    let creatorProfile = switch (profiles.get(ad.creatorPrincipal)) {
      case (?p) { ?ProfileLib.toPublic(p, dateOfBirths.get(p.principal)) };
      case null { null };
    };
    {
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
