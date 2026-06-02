import type { AdLikeWithAd, Result_3, Result_6, Result_7, Result_10, backendInterface } from "../backend.d";
import type { Principal } from "@icp-sdk/core/principal";
import {
  AdStatus,
  EventType,
  ExpectedCompanionSex,
  HowPaysForEvent,
  MeetType,
  PaymentStatus,
  Sex,
  SortBy,
  UserRole,
} from "../backend.d";

// Mock ExternalBlob that satisfies the interface for photo URLs
class MockExternalBlob {
  getBytes(): Promise<Uint8Array<ArrayBuffer>> {
    return Promise.resolve(new Uint8Array());
  }
  getDirectURL(): string {
    return "https://picsum.photos/seed/avatar1/200/200";
  }
  static fromURL(url: string): MockExternalBlob {
    return new MockExternalBlob();
  }
  static fromBytes(blob: Uint8Array<ArrayBuffer>): MockExternalBlob {
    return new MockExternalBlob();
  }
  withUploadProgress(onProgress: (percentage: number) => void): MockExternalBlob {
    return this;
  }
}

const mockPrincipal = { toText: () => "aaaaa-aa", _isPrincipal: true } as any;

const sampleProfile1 = {
  age: BigInt(28),
  bio: "Love trying new restaurants and discovering hidden gems in the city.",
  sex: Sex.female,
  principal: mockPrincipal,
  username: "sophie_adventures",
  city: "Paris",
  createdAt: BigInt(Date.now() * 1_000_000),
  fullName: "Sophie Martin",
  language: "fr",
  updatedAt: BigInt(Date.now() * 1_000_000),
  hideContactsInAds: false,
  photos: [],
  defaultAvatar: "pepe",
};

const sampleProfile2 = {
  age: BigInt(32),
  bio: "Gamer and tech enthusiast. Always up for a Dota 2 match or a virtual coffee.",
  sex: Sex.male,
  principal: mockPrincipal,
  username: "techguy_alex",
  city: "Berlin",
  createdAt: BigInt(Date.now() * 1_000_000),
  fullName: "Alex Schmidt",
  language: "de",
  updatedAt: BigInt(Date.now() * 1_000_000),
  hideContactsInAds: false,
  photos: [],
  defaultAvatar: "doge",
};

const sampleAds = [
  {
    id: "ad-001",
    status: AdStatus.published,
    expectedCompanionSex: ExpectedCompanionSex.female,
    paymentStatus: PaymentStatus.paid,
    isVirtual: false,
    meetType: MeetType.inPerson,
    city: "Paris",
    createdAt: BigInt(Date.now() * 1_000_000 - 86400e9),
    publishedAt: BigInt(Date.now() * 1_000_000 - 86400e9),
    description: "Looking for a companion to try this amazing new fusion restaurant in Montmartre. The menu is fantastic and it would be great to share the experience with someone new!",
    updatedAt: BigInt(Date.now() * 1_000_000),
    creatorPrincipal: mockPrincipal,
    eventName: "Dinner at Le Fusion Montmartre",
    eventType: EventType.restaurant,
    creatorProfile: sampleProfile1,
    howPaysForEvent: HowPaysForEvent.me,
    paid: 4.99,
    photos: [],
    linkPreview: {
      url: "https://example.com/restaurant",
      title: "Le Fusion Montmartre",
      domain: "example.com",
      description: "Award-winning fusion cuisine in the heart of Paris",
      image: undefined,
    },
  },
  {
    id: "ad-002",
    status: AdStatus.published,
    expectedCompanionSex: ExpectedCompanionSex.both,
    paymentStatus: PaymentStatus.paid,
    isVirtual: true,
    meetType: MeetType.online,
    city: undefined,
    createdAt: BigInt(Date.now() * 1_000_000 - 172800e9),
    publishedAt: BigInt(Date.now() * 1_000_000 - 172800e9),
    description: "Want to play Dota 2 together! Looking for a chill teammate for ranked matches. Mic optional.",
    updatedAt: BigInt(Date.now() * 1_000_000),
    creatorPrincipal: mockPrincipal,
    eventName: "Dota 2 Duo Queue",
    eventType: EventType.gaming,
    creatorProfile: sampleProfile2,
    howPaysForEvent: HowPaysForEvent.split,
    paid: 4.99,
    photos: [],
    linkPreview: undefined,
  },
  {
    id: "ad-003",
    status: AdStatus.published,
    expectedCompanionSex: ExpectedCompanionSex.male,
    paymentStatus: PaymentStatus.paid,
    isVirtual: false,
    meetType: MeetType.inPerson,
    city: "Rome",
    createdAt: BigInt(Date.now() * 1_000_000 - 259200e9),
    publishedAt: BigInt(Date.now() * 1_000_000 - 259200e9),
    description: "Heading to the cinema this Friday to see the new action film. Would love some company! Popcorn is on me.",
    updatedAt: BigInt(Date.now() * 1_000_000),
    creatorPrincipal: mockPrincipal,
    eventName: "Cinema Friday Night",
    eventType: EventType.cinema,
    creatorProfile: {
      ...sampleProfile1,
      fullName: "Giulia Romano",
      city: "Rome",
      language: "it",
      sex: Sex.female,
      username: "giulia_roma",
    },
    howPaysForEvent: HowPaysForEvent.you,
    paid: 4.99,
    photos: [],
    linkPreview: undefined,
  },
  {
    id: "ad-004",
    status: AdStatus.published,
    expectedCompanionSex: ExpectedCompanionSex.both,
    paymentStatus: PaymentStatus.paid,
    isVirtual: false,
    meetType: MeetType.inPerson,
    city: "Berlin",
    createdAt: BigInt(Date.now() * 1_000_000 - 345600e9),
    publishedAt: BigInt(Date.now() * 1_000_000 - 345600e9),
    description: "Looking for a study buddy for weekend library sessions. I am preparing for AWS certification. Quiet and focused environment.",
    updatedAt: BigInt(Date.now() * 1_000_000),
    creatorPrincipal: mockPrincipal,
    eventName: "Study Session — AWS Cert Prep",
    eventType: EventType.study,
    creatorProfile: sampleProfile2,
    howPaysForEvent: HowPaysForEvent.free,
    paid: 0,
    photos: [],
    linkPreview: undefined,
  },
];

export const mockBackend: backendInterface = {
  assignCallerUserRole: async () => {},
  confirmPayment: async () => ({ __kind__: "err", err: "Mock: payment not available" }),
  createAd: async () => ({ __kind__: "err", err: "Mock: create not available" }),
  createCheckoutSession: async () => "mock-session-id",
  createStripeSession: async () => ({ __kind__: "err", err: "Mock: Stripe not available" }),
  deleteAd: async () => ({ __kind__: "ok", ok: null }),
  getAdById: async (id) => sampleAds.find((a) => a.id === id) ?? null,
  getCallerUserRole: async () => UserRole.guest,
  getFeed: async (_filter, offset, limit) => {
    const start = Number(offset);
    const end = start + Number(limit);
    return sampleAds.slice(start, end);
  },
  getMyAds: async () => [],
  getMyProfile: async () => null,
  getPublicProfile: async () => null,
  getPublicProfileWithContact: async () => ({ __kind__: "err", err: "Not found" }),
  getStripeSessionStatus: async () => ({ __kind__: "failed", failed: { error: "Mock" } }),
  getStripePublishableKey: async () => "pk_test_51SfIyIK1zfEn4rUHn8nsT4Rn0sxtxtWndV9opLom3ZtwmrtOHsoqw96htRftrBy18XGux4lLhObAXomGFM2SCkz200FnmBopE1",
  handleStripeWebhook: async (_payload: string, _signature: string) => ({ __kind__: "err" as const, err: "Webhooks not supported in ICP environment - use confirmPayment instead" }),
  isCallerAdmin: async () => false,
  isStripeConfigured: async () => false,
  setStripeConfiguration: async () => {},
  transform: async (input) => ({ status: BigInt(200), body: new Uint8Array(), headers: [] }),
  updateAd: async () => ({ __kind__: "err", err: "Mock: update not available" }),
  updateLinkPreview: async () => ({ __kind__: "err", err: "Mock: link preview not available" }),
  upsertProfile: async () => ({ __kind__: "err", err: "Mock: upsert not available" }),
  savePaymentReference: async () => ({ __kind__: "err", err: "Mock: savePaymentReference not available" }),
  sendJoinRequest: async () => ({ __kind__: "err", err: "Mock: join requests not available" }),
  cancelJoinRequest: async () => ({ __kind__: "err", err: "Mock: join requests not available" }),
  getJoinRequestsForAd: async () => ({ __kind__: "ok", ok: [] }),
  getMyJoinRequests: async () => ({ __kind__: "ok", ok: [] }),
  hasJoinRequest: async () => ({ __kind__: "ok", ok: false }),
  addToFavourites: async () => ({ __kind__: "err", err: "Mock: favourites not available" }),
  removeFromFavourites: async () => ({ __kind__: "err", err: "Mock: favourites not available" }),
  getMyFavourites: async () => ({ __kind__: "ok", ok: [] }),
  isFavourited: async () => false,
  getFavouriteCount: async () => BigInt(0),
  addAdLike: async (_adId: string): Promise<Result_3> => ({ __kind__: "ok", ok: null }),
  removeAdLike: async (_adId: string): Promise<Result_3> => ({ __kind__: "ok", ok: null }),
  isAdLikedByMe: async (_adId: string): Promise<boolean> => false,
  getAdLikeCount: async (_adId: string): Promise<bigint> => BigInt(0),
  getMyAdLikes: async (): Promise<Result_10> => ({ __kind__: "ok", ok: [] }),
  addProfileLike: async (_profilePrincipal: Principal): Promise<Result_3> => ({ __kind__: "ok", ok: null }),
  removeProfileLike: async (_profilePrincipal: Principal): Promise<Result_3> => ({ __kind__: "ok", ok: null }),
  isProfileLikedByMe: async (_profilePrincipal: Principal): Promise<boolean> => false,
  getProfileLikeCount: async (_profilePrincipal: Principal): Promise<bigint> => BigInt(0),
  getMyProfileLikes: async (): Promise<Array<Principal>> => [],
  creditReferralCommission: async (_publisherPrincipal: Principal, _adPaymentAmount: number): Promise<void> => {},
  getReferralCode: async (): Promise<Result_6> => ({ __kind__: "err", err: "Mock: referral not available" }),
  setReferredBy: async (_code: string): Promise<Result_3> => ({ __kind__: "err", err: "Mock: referral not available" }),
  getMyReferrals: async (): Promise<Result_7> => ({ __kind__: "ok", ok: [] }),
  publishByPromoCode: async (_adId: string, _code: string): Promise<Result_3> => ({ __kind__: "err", err: "Mock: promo code not available" }),
  hasJoinRequestRelationship: async (_viewerPrincipal: Principal, _targetPrincipal: Principal): Promise<boolean> => false,
  getJoinRequestsForAdWithContacts: async (_adId: string) => ({ __kind__: "ok" as const, ok: [] }),
};
