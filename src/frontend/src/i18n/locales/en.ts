const en = {
  translation: {
    // App
    appName: "Memet",
    tagline: "Find your perfect event companion",

    // Nav
    nav: {
      feed: "Feed",
      profile: "My Profile",
      createAd: "Create Ad",
      myAds: "My Ads",
      myJoinRequests: "My Join Requests",
      myFavourites: "My Favourites",
      myLikes: "My Likes",
      myReferrals: "My Referrals",
      login: "Login",
      logout: "Logout",
    },

    // Auth
    auth: {
      loginRequired: "Please log in to continue",
      profileRequired: "Please complete your profile first",
      loggedInAs: "Logged in as",
    },

    // Feed
    feed: {
      title: "Browse Events",
      noAds: "No advertisements found",
      viewAd: "View",
      viewUser: "View User",
      noAdsHint: "Try adjusting your filters or check back later",
      loadMore: "Load More",
      refresh: "Refresh",
      scrollToTop: "Scroll to top",
      clearFilters: "Clear Filters",
      search: "Search events...",
      sortBy: "Sort by",
      sortNewest: "Newest first",
      sortOldest: "Oldest first",
      sortCity: "City relevance",
      sortEventType: "Event type",
      filterEventType: "Event type",
      filterCreatorSex: "Host gender",
      filterCity: "City",
      filterCompanionSex: "Looking for",
      filterAgeMin: "Min age",
      filterAgeMax: "Max age",
      filterVirtual: "Virtual only",
      filterOffline: "Offline only",
      filterLanguage: "Language",
      virtual: "Virtual",
      filters: {
        searchText: "Search events...",
        title: "Filters",
        apply: "Apply",
        clearAll: "Clear All",
        eventType: "Event Type",
        creatorSex: "Creator Gender",
        companionSex: "Looking For",
        city: "City",
        cityPlaceholder: "Filter by city...",
        language: "Language",
        any: "Any",
        ageRange: "Age Range",
        ageMin: "Min Age",
        ageMax: "Max Age",
        sort: "Sort By",
        defaultSort: "Newest First",
        allTypes: "All Types",
        saveFilters: "Save filters",
        byMyCity: "By my city",
      },
      sortOptions: {
        newest: "Newest First",
        oldest: "Oldest First",
        cityRelevance: "City Relevance",
        eventType: "By Event Type",
      },
    },

    // Ad card
    adCard: {
      by: "by",
      lookingFor: "Looking for",
      published: "Published",
      visitLink: "Visit Link",
      viewDetails: "View Details",
    },

    // Ad detail
    adDetail: {
      title: "Event Details",
      description: "Description",
      creatorInfo: "About the Host",
      contact: "Contact",
      contactHidden: "The host has chosen to keep their contact private.",
      showContact: "Show Contact",
      editAd: "Edit Ad",
      deleteAd: "Delete Ad",
      confirmDelete: "Are you sure you want to delete this ad?",
      backToFeed: "Back to Feed",
      eventLink: "Event Link",
      notFound: "Advertisement not found",
    },

    // Profile
    profile: {
      title: "My Profile",
      fullName: "Full Name",
      username: "Username",
      usernameHint: "Optional. Used for your public URL.",
      phoneNumber: "Phone number",
      phoneNumberHint: "e.g. +1234567890",
      telegram: "Telegram",
      telegramHint: "e.g. @username",
      instagram: "Instagram",
      instagramHint: "e.g. @username",
      contactRequired: "At least one contact method is required",
      bio: "About Me",
      bioHint: "Tell others about yourself",
      sex: "Gender",
      sexMale: "Male",
      sexFemale: "Female",
      sexOther: "Other / Prefer not to say",
      city: "City",
      cityHint: "Your city for offline events",
      detectCity: "Detect my city",
      detectCityError: "Could not detect your city. Please enter it manually.",
      language: "Preferred Language",
      detectLanguage: "Detect my language",
      detectLanguageError:
        "Could not detect your language. Please select it manually.",
      hideContactsInAds: "Hide my contacts in ads",
      age: "Age",
      ageHint: "Optional",
      dateOfBirth: "Date of Birth",
      dateOfBirthHelp: "Optional. Used to show your age on your profile.",
      photos: "Photos",
      photosHint: "Upload up to {{max}} photos (max {{size}} MB each)",
      uploadPhoto: "Upload Photo",
      defaultAvatar: "Default avatar",
      currentAvatar: "Current avatar",
      noPhotos: "No photos yet",
      saveChanges: "Save Changes",
      saving: "Saving...",
      saveSuccess: "Profile saved successfully!",
      saveError: "Failed to save profile. Please try again.",
      profileIncomplete:
        "Please complete your profile before creating an advertisement.",
      completeness: "Profile {{percent}}% complete",
      completenessComplete: "Profile complete!",
      publicTitle: "User Profile",
      publicNotFound: "User not found",
      publicNotFoundHint: "This profile does not exist or has been removed",
      referralBalance: "Referral Balance",
      yourReferralLink: "Your referral link",
      referralBalanceInfo: "33% of all referral spending goes to your balance.",
      referralBalanceComingSoon: "Withdrawal coming soon",
      referralLinkReady:
        "Your profile is ready! Copy your referral link from the header to invite friends.",
    },

    // Create Ad
    createAd: {
      title: "Create Advertisement",
      eventName: "Event Name",
      eventNameHint: "e.g. Cinema tonight, Coffee in Rome",
      eventType: "Event Type",
      city: "City",
      useMyCityButton: "Use my city",
      noCityInProfile: "No city in your profile. Please enter manually.",
      isVirtual: "This is a virtual event",
      description: "Description",
      descriptionHint: "What are you looking for in an event companion?",
      expectedCompanionSex: "Looking for",
      eventLink: "Event Link",
      eventLinkHint:
        "Optional link to the event page (cinema, restaurant, game)",
      submit: "Save & Pay",
      submitting: "Saving...",
      createSuccess: "Advertisement created!",
      createError: "Failed to create advertisement. Please try again.",
      paymentRedirect: "Redirecting to payment...",
      titleEdit: "Edit Advertisement",
      eventNamePlaceholder: "e.g. Cinema tonight, Coffee in Rome",
      cityPlaceholder: "Enter city...",
      descriptionPlaceholder: "What are you looking for in an event companion?",
      priceInfo:
        "Publishing costs ${{price}} USD. You will be redirected to Stripe after saving.",
      processing: "Processing...",
      submitAndPay: "Save & Pay ${{price}}",
      updateAndPay: "Update & Pay ${{price}}",
      useMyCity: "Use my city",
      profileIncomplete: "Profile incomplete",
      profileIncompleteDesc:
        "Please complete your profile before creating an advertisement.",
      howPaysForEvent: "Who pays?",
      howPays: {
        me: "I pay",
        you: "You pay",
        split: "We split",
        free: "Free",
      },
      photos: "Photos",
      photosOptional: "optional",
      addPhotos: "Add photos",
      photosHint: "Up to {{max}} photos, {{size}}MB each",
      photoDeleteAlt: "Delete photo",
      promoCodePlaceholder: "Enter promo code",
      saveByPromoCode: "Save & Publish by Promo Code",
    },

    // My Ads
    myAds: {
      title: "My Advertisements",
      subtitle: "Manage and track your advertisements",
      noAds: "You have no advertisements yet",
      noAdsHint: "Create your first advertisement",
      status: "Status",
      paymentStatus: "Payment",
      actions: "Actions",
      edit: "Edit",
      delete: "Delete",
      retryPayment: "Retry Payment",
      retryPaymentError: "Failed to initiate payment. Please try again.",
      confirmDelete: "Delete this advertisement?",
      deleteSuccess: "Advertisement deleted",
      deleteError: "Failed to delete advertisement",
      createdAt: "Posted on {{date}}",
      stats: {
        total: "Total",
        published: "Published",
        pending: "Pending",
      },
      empty: {
        title: "No advertisements yet",
        message:
          "Create your first advertisement and find a companion for your next event",
        cta: "Create Advertisement",
      },
      deleteModal: {
        title: "Delete Advertisement",
        message:
          'Are you sure you want to delete "{{name}}"? This action cannot be undone.',
      },
    },

    // Ad statuses
    adStatus: {
      draft: "Draft",
      pending_payment: "Pending Payment",
      published: "Published",
      rejected: "Rejected",
      deleted: "Deleted",
    },

    // Payment statuses
    paymentStatus: {
      unpaid: "Unpaid",
      pending: "Pending",
      paid: "Paid",
      failed: "Failed",
    },

    // Meet type
    meetType: {
      label: "Meet Type",
      inPerson: "In Person",
      online: "Online",
      all: "All",
    },

    // Event types
    eventType: {
      restaurant: "Restaurant",
      cinema: "Cinema",
      coffee: "Coffee",
      walking: "Walking",
      sport: "Sport",
      gaming: "Gaming",
      study: "Study",
      concert: "Concert",
      travel: "Travel",
      other: "Other",
    },

    // Sex
    sex: {
      male: "Male",
      female: "Female",
      other: "Other",
      both: "Both",
    },

    // Payment
    payment: {
      title: "Payment",
      price: "${{amount}} USD",
      description: "Publish your advertisement for ${{amount}}",
      successTitle: "Payment Successful!",
      successMessage: "Your advertisement has been published.",
      cancelTitle: "Payment Cancelled",
      cancelMessage:
        "Your payment was cancelled. Your advertisement is saved as a draft.",
      retryPayment: "Retry Payment",
      viewMyAds: "View My Ads",
      viewFeed: "View Feed",
      checking: "Checking payment status...",
      // New-tab Stripe flow
      success: "Payment Successful!",
      successDesc: "Your advertisement has been published and is now live.",
      successRedirect: "Redirecting you to the feed in a moment\u2026",
      cancel: "Payment Cancelled",
      cancelDesc:
        "Your payment was cancelled. Your advertisement is saved and you can retry payment at any time.",
      retry: "Retry Payment",
      retrying: "Opening payment\u2026",
      confirming: "Confirming your payment\u2026",
      confirmError: "Could not confirm payment",
      missingParams:
        "Missing payment confirmation parameters. Please check My Ads.",
      viewAd: "View Published Ad",
      newTabOpened: "Payment page opened in a new tab",
      newTabDesc:
        "Complete your payment there \u2014 this page will update automatically once payment is confirmed.",
      polling: "Waiting for payment confirmation\u2026",
      pollSuccess:
        "Payment confirmed! Your ad is now published. Redirecting\u2026",
      pollTimeout:
        "Payment confirmation timed out. Please check My Ads for your ad status.",
      tabBlocked:
        "Popup was blocked by your browser. Redirecting in the same tab instead.",
      invalidCheckoutUrl: "Invalid payment URL received. Please try again.",
      parseError: "Failed to parse payment session. Please try again.",
      missingUrl: "Payment URL not received. Please try again.",
    },

    // Companion sex
    companionSex: {
      male: "Male",
      female: "Female",
      both: "Both",
    },

    likes: {
      pageTitle: "My Likes",
      likeButton: "Like",
      unlikeButton: "Unlike",
      empty: "No liked users yet",
      count: "{{count}} likes",
      add: "Add like",
      remove: "Remove like",
      emptySubtext: "Users you like will appear here",
      error: "Failed to update like",
      viewProfile: "View profile",
      likedUsers: "Liked users",
    },

    favourites: {
      title: "My Favourites",
      empty: "No favourites yet",
      emptySubtext: "Star an ad to save it here",
      removeButton: "Remove",
      addButton: "Add to favourites",
      removeTooltip: "Remove from favourites",
      loading: "Loading your favourites...",
      error: "Failed to load favourites",
    },

    referral: {
      copied: "Referral link copied to clipboard!",
    },

    referrals: {
      title: "My Referrals",
      adsPublished: "Ads published",
      earned: "Earned",
      referredAt: "Referred on",
      empty:
        "You haven't referred anyone yet. Share your referral link to get started!",
    },

    joinRequests: {
      title: "Join Requests",
      requestToJoin: "Request to Join",
      cancelRequest: "Cancel Request",
      myJoinRequests: "My Join Requests",
      noJoinRequests: "No join requests yet",
      noMyJoinRequests: "You haven't requested to join any ads yet",
      requestSent: "Request sent successfully",
      requestCancelled: "Request cancelled",
      requestError: "Failed to send request",
      cancelError: "Failed to cancel request",
      joinedOn: "Requested on",
      interestedUsers: "Interested Users",
      noInterestedUsers: "No one has requested to join this ad yet",
      viewProfile: "View Profile",
    },

    // Common
    common: {
      loading: "Loading...",
      error: "An error occurred",
      retry: "Try Again",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      confirm: "Confirm",
      close: "Close",
      yes: "Yes",
      no: "No",
      all: "All",
      optional: "Optional",
      required: "Required",
      back: "Back",
      next: "Next",
      submit: "Submit",
      unknown: "Unknown",
      virtualEvent: "Virtual",
      yearsOld: "years old",
      or: "or",
      invalidPromoCode: "Invalid promo code",
    },

    // Validation
    validation: {
      required: "This field is required",
      invalidUrl: "Please enter a valid URL",
    },

    // Error (singular namespace)
    error: {
      unknown: "An unknown error occurred",
    },

    // Errors
    errors: {
      notFound: "Page not found",
      unauthorized: "You must be logged in",
      serverError: "Server error. Please try again later.",
      imageTooBig: "Image exceeds {{size}} MB limit",
      unsupportedImageType:
        "Unsupported file type. Allowed types: JPEG, PNG, WebP, GIF.",
      tooManyPhotos: "Maximum {{max}} photos allowed",
      invalidUrl: "Please enter a valid URL",
      invalidPhone:
        "Please enter a valid phone number or Telegram username starting with @",
      ageRange: "Age must be between 13 and 120",
      invalidDate: "Please enter a valid date",
      geolocationNotSupported: "Geolocation is not supported by your browser.",
      locationDenied:
        "Location access was denied. Please enter your city manually.",
      locationUnavailable:
        "Your location is currently unavailable. Please enter your city manually.",
      locationTimeout:
        "Could not detect your location. Please enter your city manually.",
      geocodingFailed:
        "Could not determine city from your location. Please enter manually.",
    },
  },
};

export default en;
