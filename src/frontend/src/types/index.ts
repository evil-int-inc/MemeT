import type { FavouritePublic } from "@/backend";
// Re-export backend types from generated bindings for use throughout the app

// Extend generated backend types with dateOfBirth field.
// dateOfBirth is stored as a millisecond timestamp (bigint).
// This augmentation bridges the UI (which uses dateOfBirth) with the
// generated bindings (which still expose `age`) until the backend is redeployed.
declare module "@/backend" {
  interface UserProfile {
    dateOfBirth?: bigint;
  }
  interface UserProfilePublic {
    dateOfBirth?: bigint;
  }
  interface ProfileInput {
    dateOfBirth?: bigint;
  }
}
// email is already present in the generated bindings (UserProfile.email and ProfileInput.email)
export type {
  UserProfile,
  UserProfilePublic,
  Advertisement,
  AdvertisementPublic,
  AdInput,
  ProfileInput,
  FeedFilter,
  BlobMetadata,
  LinkPreview,
  StripeSessionStatus,
  JoinRequestPublic,
  FavouritePublic,
} from "@/backend";

export {
  AdStatus,
  EventType,
  ExpectedCompanionSex,
  PaymentStatus,
  Sex,
  SortBy,
  JoinRequestStatus,
} from "@/backend";

// Feed filters (mirrors FeedFilter from backend but uses plain strings for optional fields)
export interface FeedFilterUI {
  searchText?: string;
  eventType?: string;
  creatorSex?: string;
  city?: string;
  expectedCompanionSex?: string;
  ageMin?: number;
  ageMax?: number;
  virtualOnly?: boolean;
  offlineOnly?: boolean;
  language?: string;
  sortBy?: string;
}

// Stripe checkout session response shape
export interface StripeSessionResponse {
  sessionId: string;
  url: string;
}

export interface JoinRequestWithProfile {
  request: import("@/backend").JoinRequestPublic;
  profile: import("@/backend").UserProfilePublic | null;
}

export interface JoinRequestWithAd {
  request: import("@/backend").JoinRequestPublic;
  ad: import("@/backend").AdvertisementPublic | null;
}

// Toast notification
export interface FavouriteWithAd {
  favourite: FavouritePublic;
  ad: import("@/backend").AdvertisementPublic | null;
}

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
}
