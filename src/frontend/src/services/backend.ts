import { ReferralEntry, createActor } from "@/backend";
import type { AdLikeWithAd } from "@/backend";
import { FavouritePublic, FavouriteWithAd } from "@/types";
import type { Principal } from "@icp-sdk/core/principal";
import type { 
  AdInput,
  Advertisement,
  AdvertisementPublic,
  FeedFilter,
  JoinRequestPublic,
  LinkPreview,
  ProfileInput,
  StripeSessionStatus,
  UserProfile,
  UserProfilePublic,
 } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useCallback, useRef } from "react";

type OkResult<T> = { __kind__: "ok"; ok: T };
type ErrResult = { __kind__: "err"; err: string };
type BackendResult<T> = OkResult<T> | ErrResult;

function extractResult<T>(r: BackendResult<T>): T {
  if (r.__kind__ === "err") throw new Error(r.err);
  return r.ok;
}

export function useBackend() {
  const { actor } = useActor(createActor);

  // Keep a ref that always points to the latest actor value.
  // Assignment is synchronous in the render body — NOT in a useEffect —
  // so the ref is current before any useCallback closure fires.
  const actorRef = useRef(actor);
  actorRef.current = actor;

  // Derive isReady synchronously from the ref so it is ALWAYS accurate at
  // the moment a mutation fires. A useState/useEffect approach causes a
  // one-render lag where isReady is still false even though actorRef.current
  // already holds the authenticated actor — that lag is the root cause of
  // the "Not authenticated" error on profile save.
  const isReady = actor != null;

  const getFeed = useCallback(
    async (filter: FeedFilter, offset: number, limit: number): Promise<AdvertisementPublic[]> => {
      if (!actorRef.current) return [];
      return actorRef.current.getFeed(filter, BigInt(offset), BigInt(limit));
    },
    [],
  );

  const getAdById = useCallback(
    async (id: string): Promise<AdvertisementPublic | null> => {
      if (!actorRef.current) return null;
      return actorRef.current.getAdById(id);
    },
    [],
  );

  const getMyAds = useCallback(
    async (): Promise<Advertisement[]> => {
      if (!actorRef.current) return [];
      return actorRef.current.getMyAds();
    },
    [],
  );

  const getMyProfile = useCallback(
    async (): Promise<UserProfile | null> => {
      if (!actorRef.current) return null;
      return actorRef.current.getMyProfile();
    },
    [],
  );

  const upsertProfile = useCallback(
    async (input: ProfileInput): Promise<UserProfile> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.upsertProfile(input);
      return extractResult(result);
    },
    [],
  );

  const getPublicProfile = useCallback(
    async (principalText: string): Promise<UserProfilePublic | null> => {
      if (!actorRef.current) return null;
      return actorRef.current.getPublicProfile(principalText);
    },
    [],
  );

  const getPublicProfileWithContact = useCallback(
    async (principalText: string): Promise<UserProfile> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.getPublicProfileWithContact(principalText);
      return extractResult(result);
    },
    [],
  );

  const createAd = useCallback(
    async (input: AdInput): Promise<Advertisement> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.createAd(input);
      return extractResult(result);
    },
    [],
  );

  const updateAd = useCallback(
    async (id: string, input: AdInput): Promise<Advertisement> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.updateAd(id, input);
      return extractResult(result);
    },
    [],
  );

  const deleteAd = useCallback(
    async (id: string): Promise<void> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.deleteAd(id);
      extractResult(result);
    },
    [],
  );

  const createStripeSession = useCallback(
    async (adId: string, successUrl: string, cancelUrl: string): Promise<string> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.createStripeSession(adId, successUrl, cancelUrl);
      return extractResult(result);
    },
    [],
  );

  const confirmPayment = useCallback(
    async (adId: string, sessionId: string): Promise<Advertisement> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.confirmPayment(adId, sessionId);
      return extractResult(result);
    },
    [],
  );

  const savePaymentReference = useCallback(
    async (adId: string, sessionId: string): Promise<void> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.savePaymentReference(adId, sessionId);
      extractResult(result);
    },
    [],
  );

  const updateLinkPreview = useCallback(
    async (adId: string): Promise<LinkPreview> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.updateLinkPreview(adId);
      return extractResult(result);
    },
    [],
  );

  const getStripeSessionStatus = useCallback(
    async (sessionId: string): Promise<StripeSessionStatus> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      return a.getStripeSessionStatus(sessionId);
    },
    [],
  );

  const sendJoinRequest = useCallback(
    async (adId: string): Promise<JoinRequestPublic> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.sendJoinRequest(adId);
      return extractResult(result);
    },
    [],
  );

  const cancelJoinRequest = useCallback(
    async (requestId: string): Promise<void> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.cancelJoinRequest(requestId);
      extractResult(result);
    },
    [],
  );

  const getJoinRequestsForAd = useCallback(
    async (adId: string): Promise<Array<{ request: JoinRequestPublic; profile: UserProfilePublic | null }>> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.getJoinRequestsForAd(adId);
      const data = extractResult(result);
      return data.map((item) => ({
        request: item.request,
        profile: item.profile ?? null,
      }));
    },
    [],
  );

  const getMyJoinRequests = useCallback(
    async (): Promise<Array<{ request: JoinRequestPublic; ad: AdvertisementPublic | null }>> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.getMyJoinRequests();
      const data = extractResult(result);
      return data.map((item) => ({
        request: item.request,
        ad: item.ad ?? null,
      }));
    },
    [],
  );

  const addToFavourites = useCallback(
    async (adId: string): Promise<FavouritePublic> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.addToFavourites(adId);
      return extractResult(result);
    },
    [],
  );

  const removeFromFavourites = useCallback(
    async (adId: string): Promise<void> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.removeFromFavourites(adId);
      extractResult(result);
    },
    [],
  );

  const getMyFavourites = useCallback(
    async (): Promise<FavouriteWithAd[]> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.getMyFavourites();
      const data = extractResult(result);
      return data.map((item) => ({
        favourite: item.favourite,
        ad: item.ad ?? null,
      }));
    },
    [],
  );

  const isFavourited = useCallback(
    async (adId: string): Promise<boolean> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      return a.isFavourited(adId);
    },
    [],
  );

  const hasJoinRequest = useCallback(
    async (adId: string): Promise<boolean> => {
      const a = actorRef.current;
      if (!a) throw new Error("Not authenticated");
      const result = await a.hasJoinRequest(adId);
      return extractResult(result);
    },
    [],
  );

  const getFavouriteCount = useCallback(
    async (adId: string): Promise<number> => {
      if (!actorRef.current) return 0;
      const count = await actorRef.current.getFavouriteCount(adId);
      return Number(count);
    },
    [],
  );

  const addAdLike = useCallback(async (adId: string) => {
    const a = actorRef.current;
    if (!a) throw new Error("Not authenticated");
    return extractResult(await a.addAdLike(adId));
  }, []);

  const removeAdLike = useCallback(async (adId: string) => {
    const a = actorRef.current;
    if (!a) throw new Error("Not authenticated");
    return extractResult(await a.removeAdLike(adId));
  }, []);

  const isAdLikedByMe = useCallback(async (adId: string): Promise<boolean> => {
    const a = actorRef.current;
    if (!a) return false;
    return a.isAdLikedByMe(adId);
  }, []);

  const getAdLikeCount = useCallback(async (adId: string): Promise<number> => {
    const a = actorRef.current;
    if (!a) return 0;
    return Number(await a.getAdLikeCount(adId));
  }, []);

  const getMyAdLikes = useCallback(async (): Promise<AdLikeWithAd[]> => {
    const a = actorRef.current;
    if (!a) return [];
    const result = await a.getMyAdLikes();
    return extractResult(result);
  }, []);

  const addProfileLike = useCallback(async (profilePrincipal: Principal) => {
    const a = actorRef.current;
    if (!a) throw new Error("Not authenticated");
    return extractResult(await a.addProfileLike(profilePrincipal));
  }, []);

  const removeProfileLike = useCallback(async (profilePrincipal: Principal) => {
    const a = actorRef.current;
    if (!a) throw new Error("Not authenticated");
    return extractResult(await a.removeProfileLike(profilePrincipal));
  }, []);

  const isProfileLikedByMe = useCallback(async (profilePrincipal: Principal): Promise<boolean> => {
    const a = actorRef.current;
    if (!a) return false;
    return a.isProfileLikedByMe(profilePrincipal);
  }, []);

  const getProfileLikeCount = useCallback(async (profilePrincipal: Principal): Promise<number> => {
    const a = actorRef.current;
    if (!a) return 0;
    return Number(await a.getProfileLikeCount(profilePrincipal));
  }, []);

  const getMyProfileLikes = useCallback(async (): Promise<string[]> => {
    const a = actorRef.current;
    if (!a) return [];
    const result = await a.getMyProfileLikes();
    return result.map((p) => p.toText());
  }, []);

  const getReferralCode = useCallback(async (): Promise<string | null> => {
    const a = actorRef.current;
    if (!a) return null;
    const result = await a.getReferralCode();
    if (result.__kind__ === "ok") return result.ok;
    return null;
  }, []);

  const setReferredBy = useCallback(async (code: string): Promise<void> => {
    const a = actorRef.current;
    if (!a) throw new Error("Not authenticated");
    const result = await a.setReferredBy(code);
    extractResult(result);
  }, []);

  const getMyReferrals = useCallback(async (): Promise<ReferralEntry[]> => {
    const a = actorRef.current;
    if (!a) return [];
    const result = await a.getMyReferrals();
    return extractResult(result);
  }, []);

  const hasJoinRequestRelationship = useCallback(
    async (viewerPrincipal: Principal, targetPrincipal: Principal): Promise<boolean> => {
      const a = actorRef.current;
      if (!a) return false;
      return a.hasJoinRequestRelationship(viewerPrincipal, targetPrincipal);
    },
    [],
  );

  const publishByPromoCode = useCallback(async (adId: string, code: string) => {
    const a = actorRef.current;
    if (!a) throw new Error('Not authenticated');
    return a.publishByPromoCode(adId, code);
  }, []);

  return {
    actor,
    isReady,
    getFeed,
    getAdById,
    getMyAds,
    getMyProfile,
    upsertProfile,
    getPublicProfile,
    getPublicProfileWithContact,
    createAd,
    updateAd,
    deleteAd,
    createStripeSession,
    confirmPayment,
    savePaymentReference,
    updateLinkPreview,
    getStripeSessionStatus,
    sendJoinRequest,
    cancelJoinRequest,
    getJoinRequestsForAd,
    getMyJoinRequests,
    addToFavourites,
    removeFromFavourites,
    getMyFavourites,
    isFavourited,
    hasJoinRequest,
    getFavouriteCount,
    addAdLike,
    removeAdLike,
    isAdLikedByMe,
    getAdLikeCount,
    getMyAdLikes,
    addProfileLike,
    removeProfileLike,
    isProfileLikedByMe,
    getProfileLikeCount,
    getMyProfileLikes,
    getReferralCode,
    setReferredBy,
    getMyReferrals,
    hasJoinRequestRelationship,
    publishByPromoCode,
  };
}
