import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface AdLike {
    id: string;
    adId: string;
    createdAt: bigint;
    userPrincipal: Principal;
}
export type Result_2 = {
    __kind__: "ok";
    ok: Advertisement;
} | {
    __kind__: "err";
    err: string;
};
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AdvertisementPublic {
    id: string;
    status: AdStatus;
    expectedCompanionSex: ExpectedCompanionSex;
    paymentStatus: PaymentStatus;
    isVirtual: boolean;
    meetType: MeetType;
    city?: string;
    createdAt: bigint;
    paid: number;
    publishedAt?: bigint;
    description: string;
    updatedAt: bigint;
    creatorPrincipal: Principal;
    howPaysForEvent: HowPaysForEvent;
    paymentReference?: string;
    linkPreview?: LinkPreview;
    creatorProfile?: UserProfilePublic;
    paymentProvider?: string;
    photos: Array<BlobMetadata>;
    eventLink?: string;
    eventName: string;
    eventType: EventType;
}
export type Result_5 = {
    __kind__: "ok";
    ok: boolean;
} | {
    __kind__: "err";
    err: string;
};
export interface Advertisement {
    id: string;
    status: AdStatus;
    expectedCompanionSex: ExpectedCompanionSex;
    paymentStatus: PaymentStatus;
    isVirtual: boolean;
    meetType: MeetType;
    city?: string;
    createdAt: bigint;
    paid: number;
    publishedAt?: bigint;
    description: string;
    updatedAt: bigint;
    creatorPrincipal: Principal;
    howPaysForEvent: HowPaysForEvent;
    paymentReference?: string;
    linkPreview?: LinkPreview;
    paymentProvider?: string;
    photos: Array<BlobMetadata>;
    eventLink?: string;
    eventName: string;
    eventType: EventType;
}
export type Result_1 = {
    __kind__: "ok";
    ok: LinkPreview;
} | {
    __kind__: "err";
    err: string;
};
export type Result_4 = {
    __kind__: "ok";
    ok: JoinRequestPublic;
} | {
    __kind__: "err";
    err: string;
};
export type Result_11 = {
    __kind__: "ok";
    ok: Array<{
        request: JoinRequestPublic;
        profile?: UserProfilePublic;
    }>;
} | {
    __kind__: "err";
    err: string;
};
export interface LinkPreview {
    url: string;
    title?: string;
    domain?: string;
    description?: string;
    image?: string;
}
export interface BlobMetadata {
    contentType: string;
    blob: ExternalBlob;
    createdAt: bigint;
    size: bigint;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type Result_7 = {
    __kind__: "ok";
    ok: Array<ReferralEntry>;
} | {
    __kind__: "err";
    err: string;
};
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface FeedFilter {
    expectedCompanionSex?: ExpectedCompanionSex;
    offlineOnly?: boolean;
    meetType?: MeetType;
    sortBy?: SortBy;
    creatorSex?: Sex;
    city?: string;
    virtualOnly?: boolean;
    ageMax?: bigint;
    ageMin?: bigint;
    language?: string;
    searchText?: string;
    eventType?: EventType;
}
export interface AdInput {
    expectedCompanionSex: ExpectedCompanionSex;
    isVirtual: boolean;
    meetType: MeetType;
    city?: string;
    description: string;
    howPaysForEvent: HowPaysForEvent;
    photos: Array<BlobMetadata>;
    eventLink?: string;
    eventName: string;
    eventType: EventType;
}
export interface AdLikeWithAd {
    ad?: AdvertisementPublic;
    like: AdLike;
}
export interface FavouriteWithAd {
    ad?: AdvertisementPublic;
    favourite: FavouritePublic;
}
export type Result_6 = {
    __kind__: "ok";
    ok: string;
} | {
    __kind__: "err";
    err: string;
};
export type Result_12 = {
    __kind__: "ok";
    ok: FavouritePublic;
} | {
    __kind__: "err";
    err: string;
};
export type Result_9 = {
    __kind__: "ok";
    ok: Array<FavouriteWithAd>;
} | {
    __kind__: "err";
    err: string;
};
export interface http_header {
    value: string;
    name: string;
}
export interface UserProfilePublic {
    age?: bigint;
    bio: string;
    sex: Sex;
    principal: Principal;
    username?: string;
    dateOfBirth?: bigint;
    city?: string;
    createdAt: bigint;
    hideContactsInAds: boolean;
    fullName: string;
    language: string;
    updatedAt: bigint;
    photos: Array<BlobMetadata>;
    defaultAvatar: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface ReferralEntry {
    referredPrincipal: Principal;
    totalEarned: number;
    referredAt: bigint;
    adsPublished: bigint;
}
export interface JoinRequestPublic {
    id: string;
    status: JoinRequestStatus;
    adId: string;
    createdAt: bigint;
    requesterPrincipal: Principal;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export type Result_3 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Result_10 = {
    __kind__: "ok";
    ok: Array<AdLikeWithAd>;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: UserProfile;
} | {
    __kind__: "err";
    err: string;
};
export type Result_8 = {
    __kind__: "ok";
    ok: Array<{
        ad?: AdvertisementPublic;
        request: JoinRequestPublic;
    }>;
} | {
    __kind__: "err";
    err: string;
};
export interface FavouritePublic {
    id: string;
    adId: string;
    createdAt: bigint;
    userPrincipal: Principal;
}
export interface ProfileInput {
    bio: string;
    sex: Sex;
    username?: string;
    dateOfBirth?: bigint;
    city?: string;
    instagram?: string;
    hideContactsInAds: boolean;
    fullName: string;
    language: string;
    phoneNumber?: string;
    telegram?: string;
    photos: Array<BlobMetadata>;
}
export interface UserProfile {
    age?: bigint;
    bio: string;
    sex: Sex;
    principal: Principal;
    referralCode?: string;
    username?: string;
    balance: number;
    city?: string;
    instagram?: string;
    createdAt: bigint;
    hideContactsInAds: boolean;
    fullName: string;
    language: string;
    updatedAt: bigint;
    referredBy?: Principal;
    phoneNumber?: string;
    telegram?: string;
    photos: Array<BlobMetadata>;
    defaultAvatar: string;
}
export enum AdStatus {
    deleted = "deleted",
    pending_payment = "pending_payment",
    published = "published",
    rejected = "rejected",
    draft = "draft"
}
export enum EventType {
    concert = "concert",
    virtual = "virtual",
    other = "other",
    travel = "travel",
    gaming = "gaming",
    cinema = "cinema",
    sport = "sport",
    study = "study",
    walking = "walking",
    coffee = "coffee",
    restaurant = "restaurant"
}
export enum ExpectedCompanionSex {
    female = "female",
    both = "both",
    male = "male"
}
export enum HowPaysForEvent {
    me = "me",
    you = "you",
    free = "free",
    split = "split"
}
export enum JoinRequestStatus {
    active = "active",
    cancelled = "cancelled"
}
export enum MeetType {
    inPerson = "inPerson",
    online = "online"
}
export enum PaymentStatus {
    pending = "pending",
    paid = "paid",
    unpaid = "unpaid",
    failed = "failed"
}
export enum Sex {
    other = "other",
    female = "female",
    male = "male"
}
export enum SortBy {
    city = "city",
    newest = "newest",
    oldest = "oldest",
    eventType = "eventType"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addAdLike(adId: string): Promise<Result_3>;
    addProfileLike(profilePrincipal: Principal): Promise<Result_3>;
    addToFavourites(adId: string): Promise<Result_12>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelJoinRequest(requestId: string): Promise<Result_3>;
    confirmPayment(adId: string, sessionId: string): Promise<Result_2>;
    createAd(input: AdInput): Promise<Result_2>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createStripeSession(adId: string, successUrl: string, cancelUrl: string): Promise<Result_6>;
    creditReferralCommission(publisherPrincipal: Principal, adPaymentAmount: number): Promise<void>;
    deleteAd(id: string): Promise<Result_3>;
    getAdById(id: string): Promise<AdvertisementPublic | null>;
    getAdLikeCount(adId: string): Promise<bigint>;
    getCallerUserRole(): Promise<UserRole>;
    getFavouriteCount(adId: string): Promise<bigint>;
    getFeed(filter: FeedFilter, offset: bigint, limit: bigint): Promise<Array<AdvertisementPublic>>;
    getJoinRequestsForAd(adId: string): Promise<Result_11>;
    getMyAdLikes(): Promise<Result_10>;
    getMyAds(): Promise<Array<Advertisement>>;
    getMyFavourites(): Promise<Result_9>;
    getMyJoinRequests(): Promise<Result_8>;
    getMyProfile(): Promise<UserProfile | null>;
    getMyProfileLikes(): Promise<Array<Principal>>;
    getMyReferrals(): Promise<Result_7>;
    getProfileLikeCount(profilePrincipal: Principal): Promise<bigint>;
    getPublicProfile(principalText: string): Promise<UserProfilePublic | null>;
    getPublicProfileWithContact(principalText: string): Promise<Result>;
    getReferralCode(): Promise<Result_6>;
    getStripePublishableKey(): Promise<string>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    handleStripeWebhook(_payload: string, _signature: string): Promise<{
        __kind__: "ok";
        ok: string;
    } | {
        __kind__: "err";
        err: string;
    }>;
    hasJoinRequest(adId: string): Promise<Result_5>;
    isAdLikedByMe(adId: string): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isFavourited(adId: string): Promise<boolean>;
    isProfileLikedByMe(profilePrincipal: Principal): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    publishByPromoCode(adId: string, code: string): Promise<Result_3>;
    removeAdLike(adId: string): Promise<Result_3>;
    removeFromFavourites(adId: string): Promise<Result_3>;
    removeProfileLike(profilePrincipal: Principal): Promise<Result_3>;
    savePaymentReference(adId: string, sessionId: string): Promise<Result_3>;
    sendJoinRequest(adId: string): Promise<Result_4>;
    setReferredBy(code: string): Promise<Result_3>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateAd(id: string, input: AdInput): Promise<Result_2>;
    updateLinkPreview(adId: string): Promise<Result_1>;
    upsertProfile(input: ProfileInput): Promise<Result>;
}
