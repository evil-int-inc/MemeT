import { ExternalBlob, HowPaysForEvent, MeetType } from "@/backend";
import type { EventType, ExpectedCompanionSex } from "@/backend";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  AD_PUBLISH_PRICE_USD,
  EVENT_TYPES,
  EXPECTED_COMPANION_SEX_OPTIONS,
  HOW_PAYS_OPTIONS,
  type HowPaysOption,
  MAX_PHOTO_SIZE_MB,
  MAX_PROFILE_PHOTOS,
} from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { buildCancelUrl, buildSuccessUrl } from "@/lib/stripe";
import { useBackend } from "@/services/backend";
import { validateImage, validatePhotoCount } from "@/services/imageService";
import type { BlobMetadata } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  CreditCard,
  ExternalLink,
  Info,
  MapPin,
  PenSquare,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AdFormValues {
  eventName: string;
  eventType: EventType;
  meetType: "inPerson" | "online";
  city: string;
  description: string;
  expectedCompanionSex: ExpectedCompanionSex;
  eventLink: string;
  howPaysForEvent: HowPaysOption;
  photos: BlobMetadata[];
}

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_MS = 5 * 60 * 1000; // 5 minutes

export default function CreateAdPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState("");
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [pollingAdId, setPollingAdId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pollSuccess, setPollSuccess] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);
  const [stripeOpened, setStripeOpened] = useState(false);
  const pollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollStartRef = useRef<number>(0);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => stopPolling, [stopPolling]);

  // Read search params — edit mode
  const search =
    typeof window !== "undefined"
      ? Object.fromEntries(new URLSearchParams(window.location.search))
      : {};
  const editAdId = (search as Record<string, string>).edit ?? null;

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  // Load profile
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated && backend.isReady,
  });

  // Load existing ads for edit mode
  const { data: myAds, isLoading: adsLoading } = useQuery({
    queryKey: ["myAds"],
    queryFn: () => backend.getMyAds(),
    enabled: isAuthenticated && backend.isReady && !!editAdId,
  });

  const editAd =
    editAdId && myAds ? myAds.find((a) => a.id === editAdId) : null;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AdFormValues>({
    defaultValues: {
      eventName: "",
      eventType: "restaurant" as EventType,
      meetType: "inPerson" as const,
      city: "",
      description: "",
      expectedCompanionSex: "both" as ExpectedCompanionSex,
      eventLink: "",
      howPaysForEvent: "me" as HowPaysOption,
      photos: [],
    },
  });

  const photos = watch("photos") ?? [];

  // Populate form in edit mode
  useEffect(() => {
    if (editAd) {
      reset({
        eventName: editAd.eventName,
        eventType: editAd.eventType,
        meetType: editAd.meetType === MeetType.online ? "online" : "inPerson",
        city: editAd.city ?? "",
        description: editAd.description,
        expectedCompanionSex: editAd.expectedCompanionSex,
        eventLink: editAd.eventLink ?? "",
        howPaysForEvent: (editAd.howPaysForEvent ??
          HowPaysForEvent.me) as HowPaysOption,
        photos: editAd.photos ?? [],
      });
    }
  }, [editAd, reset]);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!event.target) return;
    (event.target as HTMLInputElement).value = "";
    if (!file) return;

    if (!validatePhotoCount(photos.length)) {
      import("sonner").then(({ toast }) =>
        toast.error(t("errors.tooManyPhotos", { max: MAX_PROFILE_PHOTOS })),
      );
      return;
    }

    const validation = validateImage(file);
    if (!validation.valid) {
      import("sonner").then(({ toast }) =>
        toast.error(
          validation.error === "errors.imageTooBig"
            ? t("errors.imageTooBig", { size: MAX_PHOTO_SIZE_MB })
            : t("errors.unsupportedImageType"),
        ),
      );
      return;
    }

    const newIdx = photos.length;
    setUploadingIndex(newIdx);

    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const externalBlob = ExternalBlob.fromBytes(bytes);
      const meta: BlobMetadata = {
        contentType: file.type,
        blob: externalBlob,
        createdAt: BigInt(Date.now()),
        size: BigInt(file.size),
      };
      setValue("photos", [...photos, meta]);
    } catch {
      import("sonner").then(({ toast }) => toast.error(t("profile.saveError")));
    } finally {
      setUploadingIndex(null);
    }
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index);
    setValue("photos", updated);
  }

  // Mutations
  const createAdMutation = useMutation({
    mutationFn: (data: AdFormValues) =>
      backend.createAd({
        eventName: data.eventName,
        eventType: data.eventType,
        meetType:
          data.meetType === "online" ? MeetType.online : MeetType.inPerson,
        isVirtual: data.meetType === "online",
        city: data.city || undefined,
        description: data.description,
        expectedCompanionSex: data.expectedCompanionSex,
        eventLink: data.eventLink || undefined,
        howPaysForEvent: data.howPaysForEvent as unknown as HowPaysForEvent,
        photos: data.photos,
      }),
  });

  const updateAdMutation = useMutation({
    mutationFn: (data: AdFormValues) =>
      backend.updateAd(editAdId!, {
        eventName: data.eventName,
        eventType: data.eventType,
        meetType:
          data.meetType === "online" ? MeetType.online : MeetType.inPerson,
        isVirtual: data.meetType === "online",
        city: data.city || undefined,
        description: data.description,
        expectedCompanionSex: data.expectedCompanionSex,
        eventLink: data.eventLink || undefined,
        howPaysForEvent: data.howPaysForEvent as unknown as HowPaysForEvent,
        photos: data.photos,
      }),
  });

  const stripeSessionMutation = useMutation({
    mutationFn: (adId: string) =>
      backend.createStripeSession(
        adId,
        buildSuccessUrl(adId),
        buildCancelUrl(adId),
      ),
  });

  const saveSessionMutation = useMutation({
    mutationFn: ({ adId, sessionId }: { adId: string; sessionId: string }) =>
      backend.savePaymentReference(adId, sessionId),
  });

  const promoPublishMutation = useMutation({
    mutationFn: async ({ adId, code }: { adId: string; code: string }) => {
      const result = await backend.publishByPromoCode(adId, code);
      if ("err" in result)
        throw new Error(String((result as { err: unknown }).err));
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAds"] });
      navigate({ to: "/my-ads" });
    },
  });

  const onSubmit = async (data: AdFormValues) => {
    setSubmitError(null);
    try {
      let ad: Awaited<ReturnType<typeof createAdMutation.mutateAsync>>;
      if (editAdId) {
        ad = await updateAdMutation.mutateAsync(data);
      } else {
        ad = await createAdMutation.mutateAsync(data);
      }

      await queryClient.invalidateQueries({ queryKey: ["myAds"] });

      const rawResult = await stripeSessionMutation.mutateAsync(ad.id);
      console.log("[Stripe debug] raw backend result:", rawResult);

      // Parse JSON string returned by backend Stripe extension
      let sessionId: string;
      let checkoutUrl: string;
      try {
        const parsed = JSON.parse(rawResult) as Record<string, unknown>;
        sessionId = typeof parsed.id === "string" ? parsed.id : "";
        checkoutUrl = typeof parsed.url === "string" ? parsed.url : "";
      } catch {
        throw new Error(t("payment.parseError"));
      }

      if (!checkoutUrl) {
        throw new Error(t("payment.missingUrl"));
      }

      // Save sessionId to ad's paymentReference BEFORE opening Stripe
      if (sessionId) {
        try {
          await saveSessionMutation.mutateAsync({ adId: ad.id, sessionId });
        } catch {
          // Non-fatal: log and continue — payment can still be confirmed via webhook
          console.warn("[Stripe] Could not save sessionId to ad:", sessionId);
        }
      }

      // Open Stripe payment page in a new tab (never use window.location.href)
      window.open(checkoutUrl, "_blank");

      setStripeOpened(true);
      setPollingAdId(ad.id);
      pollStartRef.current = Date.now();
      stopPolling();
      pollTimerRef.current = setInterval(async () => {
        if (Date.now() - pollStartRef.current > POLL_MAX_MS) {
          stopPolling();
          setPollError(t("payment.pollTimeout"));
          return;
        }
        try {
          const ads = await backend.getMyAds();
          const target = ads.find((a) => a.id === ad.id);
          if (
            target &&
            (target.status === "published" || target.paymentStatus === "paid")
          ) {
            stopPolling();
            setPollSuccess(true);
            setPollingAdId(null);
            queryClient.invalidateQueries({ queryKey: ["myAds"] });
            setTimeout(() => navigate({ to: `/ad/${target.id}` }), 2000);
          }
        } catch {
          // keep polling silently
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("error.unknown"));
    }
  };

  const isSubmitting =
    createAdMutation.isPending ||
    updateAdMutation.isPending ||
    stripeSessionMutation.isPending ||
    saveSessionMutation.isPending;

  if (!isAuthenticated) return null;

  if (!backend.isReady || profileLoading || (editAdId && adsLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Profile incomplete guard
  const hasContact = !!(
    profile?.phoneNumber?.[0] ||
    profile?.telegram?.[0] ||
    profile?.instagram?.[0]
  );
  const profileIncomplete =
    !profile || !profile.fullName || !hasContact || !profile.bio;

  if (profileIncomplete) {
    return (
      <div className="max-w-lg mx-auto mt-12 px-4">
        <div
          className="alert alert-warning shadow-md"
          data-ocid="create-ad.profile_incomplete"
        >
          <AlertCircle className="w-5 h-5" />
          <div>
            <p className="font-semibold">{t("createAd.profileIncomplete")}</p>
            <p className="text-sm mt-1">
              {t("createAd.profileIncompleteDesc")}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-sm btn-neutral btn-outline"
            onClick={() => navigate({ to: "/profile" })}
            data-ocid="create-ad.go_profile_button"
          >
            {t("nav.profile")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <PenSquare className="w-6 h-6 text-primary" />
        <h1 className="text-2xl font-bold">
          {editAdId ? t("createAd.titleEdit") : t("createAd.title")}
        </h1>
      </div>

      {/* Price info box */}
      <div className="alert alert-info mb-6" data-ocid="create-ad.price_info">
        <Info className="w-5 h-5" />
        <span>{t("createAd.priceInfo", { price: AD_PUBLISH_PRICE_USD })}</span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        data-ocid="create-ad.form"
      >
        {/* Event Name */}
        <div className="form-control">
          <label className="label" htmlFor="ad-event-name">
            <span className="label-text font-medium">
              {t("createAd.eventName")} *
            </span>
          </label>
          <input
            id="ad-event-name"
            type="text"
            placeholder={t("createAd.eventNamePlaceholder")}
            className={`input input-bordered w-full ${
              errors.eventName ? "input-error" : ""
            }`}
            data-ocid="create-ad.event_name_input"
            {...register("eventName", { required: t("validation.required") })}
          />
          {errors.eventName && (
            <p
              className="text-error text-xs mt-1"
              data-ocid="create-ad.event_name_error"
            >
              {errors.eventName.message}
            </p>
          )}
        </div>

        {/* Event Type */}
        <div className="form-control">
          <label className="label" htmlFor="ad-event-type">
            <span className="label-text font-medium">
              {t("createAd.eventType")} *
            </span>
          </label>
          <select
            id="ad-event-type"
            className="select select-bordered w-full"
            data-ocid="create-ad.event_type_select"
            {...register("eventType", { required: t("validation.required") })}
          >
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {t(`eventType.${type.value}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Meet Type */}
        <div className="form-control">
          <div className="label">
            <span className="label-text font-medium">
              {t("meetType.label")} *
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-sm"
                value="inPerson"
                data-ocid="create-ad.meet_type_in_person_radio"
                {...register("meetType", {
                  required: t("validation.required"),
                })}
              />
              <span className="label-text">{t("meetType.inPerson")}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                className="radio radio-sm"
                value="online"
                data-ocid="create-ad.meet_type_online_radio"
                {...register("meetType", {
                  required: t("validation.required"),
                })}
              />
              <span className="label-text">{t("meetType.online")}</span>
            </label>
          </div>
        </div>

        {/* City */}
        <div className="form-control">
          <label className="label" htmlFor="ad-city">
            <span className="label-text font-medium">
              {t("createAd.city")} *
            </span>
          </label>
          <div className="flex gap-2">
            <input
              id="ad-city"
              type="text"
              placeholder={t("createAd.cityPlaceholder")}
              className={`input input-bordered flex-1 ${
                errors.city ? "input-error" : ""
              }`}
              data-ocid="create-ad.city_input"
              {...register("city", {
                required: t("validation.required") as string,
              })}
            />
            <button
              type="button"
              className="btn btn-neutral btn-outline btn-sm self-center"
              data-ocid="create-ad.use_my_city_button"
              onClick={() => {
                if (profile?.city) {
                  setValue("city", profile.city);
                }
              }}
              title={
                profile?.city ? profile.city : t("createAd.noCityInProfile")
              }
            >
              <MapPin className="w-4 h-4" />
              {t("createAd.useMyCity")}
            </button>
          </div>
          {errors.city && (
            <p
              className="text-error text-xs mt-1"
              data-ocid="create-ad.city_error"
            >
              {errors.city.message}
            </p>
          )}
          {!profile?.city && (
            <p className="text-warning text-xs mt-1">
              {t("createAd.noCityInProfile")}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label" htmlFor="ad-description">
            <span className="label-text font-medium">
              {t("createAd.description")} *
            </span>
          </label>
          <textarea
            id="ad-description"
            placeholder={t("createAd.descriptionPlaceholder")}
            rows={4}
            className={`textarea textarea-bordered w-full ${
              errors.description ? "textarea-error" : ""
            }`}
            data-ocid="create-ad.description_textarea"
            {...register("description", { required: t("validation.required") })}
          />
          {errors.description && (
            <p
              className="text-error text-xs mt-1"
              data-ocid="create-ad.description_error"
            >
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Expected Companion Sex */}
        <div className="form-control">
          <label className="label" htmlFor="ad-companion-sex">
            <span className="label-text font-medium">
              {t("createAd.expectedCompanionSex")} *
            </span>
          </label>
          <select
            id="ad-companion-sex"
            className="select select-bordered w-full"
            data-ocid="create-ad.companion_sex_select"
            {...register("expectedCompanionSex", {
              required: t("validation.required"),
            })}
          >
            {EXPECTED_COMPANION_SEX_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(`companionSex.${opt.value}`)}
              </option>
            ))}
          </select>
        </div>

        {/* Who Pays For Event */}
        <div className="form-control">
          <div className="label">
            <span className="label-text font-medium">
              {t("createAd.howPaysForEvent")} *
            </span>
          </div>
          <div className="flex flex-wrap gap-4">
            {HOW_PAYS_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  className="radio radio-sm"
                  value={opt}
                  data-ocid={`create-ad.how_pays_${opt}_radio`}
                  {...register("howPaysForEvent", {
                    required: t("validation.required"),
                  })}
                />
                <span className="label-text">
                  {t(`createAd.howPays.${opt}`)}
                </span>
              </label>
            ))}
          </div>
          {errors.howPaysForEvent && (
            <p
              className="text-error text-xs mt-1"
              data-ocid="create-ad.how_pays_error"
            >
              {errors.howPaysForEvent.message}
            </p>
          )}
        </div>

        {/* Event Link */}
        <div className="form-control">
          <label className="label" htmlFor="ad-event-link">
            <span className="label-text font-medium">
              {t("createAd.eventLink")}
            </span>
            <span className="label-text-alt text-base-content/50">
              {t("common.optional")}
            </span>
          </label>
          <input
            id="ad-event-link"
            type="url"
            placeholder="https://..."
            className={`input input-bordered w-full ${
              errors.eventLink ? "input-error" : ""
            }`}
            data-ocid="create-ad.event_link_input"
            {...register("eventLink", {
              validate: (val) => {
                if (!val) return true;
                try {
                  new URL(val);
                  return true;
                } catch {
                  return t("validation.invalidUrl") as string;
                }
              },
            })}
          />
          {errors.eventLink && (
            <p
              className="text-error text-xs mt-1"
              data-ocid="create-ad.event_link_error"
            >
              {errors.eventLink.message}
            </p>
          )}
        </div>

        {/* Photos */}
        <div className="form-control gap-2">
          <div className="label">
            <span className="label-text font-medium">
              {t("createAd.photos")}{" "}
              <span className="badge badge-ghost badge-sm">
                {t("createAd.photosOptional")}
              </span>
            </span>
          </div>
          <p className="text-sm text-base-content/60">
            {t("createAd.photosHint", {
              max: MAX_PROFILE_PHOTOS,
              size: MAX_PHOTO_SIZE_MB,
            })}
          </p>
          {photos.length < MAX_PROFILE_PHOTOS && (
            <button
              type="button"
              className="border-2 border-dashed border-base-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-base-content/40 transition-colors w-full"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="create-ad.photos_upload_button"
            >
              {uploadingIndex !== null ? (
                <span className="loading loading-infinity loading-md" />
              ) : (
                <>
                  <Camera className="w-8 h-8 text-base-content/40" />
                  <span className="text-sm text-base-content/60">
                    {t("createAd.addPhotos")}
                  </span>
                </>
              )}
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          {photos.length > 0 && (
            <div
              className="grid grid-cols-3 gap-2"
              data-ocid="create-ad.photos_list"
            >
              {photos.map((photo, idx) => (
                <div
                  key={photo.createdAt.toString()}
                  className="relative aspect-square rounded-lg overflow-hidden group"
                  data-ocid={`create-ad.photos.item.${idx + 1}`}
                >
                  <img
                    src={photo.blob.getDirectURL()}
                    alt={`${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <button
                    type="button"
                    className="btn btn-neutral btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(idx)}
                    aria-label={t("createAd.photoDeleteAlt")}
                    data-ocid={`create-ad.photos.delete_button.${idx + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit error */}
        {submitError && (
          <div
            className="alert alert-error"
            data-ocid="create-ad.submit_error_state"
          >
            <AlertCircle className="w-5 h-5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-neutral w-full gap-2"
          disabled={isSubmitting || !!pollingAdId || pollSuccess}
          data-ocid="create-ad.submit_button"
        >
          {isSubmitting ? (
            <span className="loading loading-infinity loading-sm" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          {isSubmitting
            ? t("createAd.processing")
            : editAdId
              ? t("createAd.updateAndPay", { price: AD_PUBLISH_PRICE_USD })
              : t("createAd.submitAndPay", { price: AD_PUBLISH_PRICE_USD })}
        </button>

        {/* Promo code section */}
        <div className="divider text-sm opacity-60">{t("common.or")}</div>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder={t("createAd.promoCodePlaceholder")}
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            disabled={
              isSubmitting || !!pollingAdId || promoPublishMutation.isPending
            }
            autoComplete="off"
            data-ocid="create-ad.promo_code_input"
          />
          <button
            type="button"
            className="btn btn-neutral w-full"
            disabled={
              isSubmitting ||
              !!pollingAdId ||
              promoPublishMutation.isPending ||
              !promoCode.trim()
            }
            onClick={async () => {
              setSubmitError(null);
              await new Promise<void>((resolve, reject) => {
                handleSubmit(
                  async (data) => {
                    try {
                      let ad: Awaited<
                        ReturnType<typeof createAdMutation.mutateAsync>
                      >;
                      if (editAdId) {
                        ad = await updateAdMutation.mutateAsync(data);
                      } else {
                        ad = await createAdMutation.mutateAsync(data);
                      }
                      await queryClient.invalidateQueries({
                        queryKey: ["myAds"],
                      });
                      await promoPublishMutation.mutateAsync({
                        adId: ad.id,
                        code: promoCode,
                      });
                      resolve();
                    } catch (err) {
                      reject(err);
                    }
                  },
                  (errs) => {
                    reject(
                      new Error(
                        Object.values(errs)
                          .map((e) => e?.message)
                          .filter(Boolean)
                          .join(", "),
                      ),
                    );
                  },
                )();
              }).catch((err) => {
                setSubmitError(
                  err instanceof Error ? err.message : t("error.unknown"),
                );
              });
            }}
            data-ocid="create-ad.promo_publish_button"
          >
            {promoPublishMutation.isPending ? (
              <span className="loading loading-infinity" />
            ) : (
              t("createAd.saveByPromoCode")
            )}
          </button>
          {promoPublishMutation.isError && (
            <p
              className="text-error text-sm"
              data-ocid="create-ad.promo_error_state"
            >
              {(promoPublishMutation.error as Error)?.message ||
                t("common.invalidPromoCode")}
            </p>
          )}
        </div>
      </form>

      {/* Stripe opened in new tab — polling banner */}
      {stripeOpened && pollingAdId && !pollSuccess && !pollError && (
        <div
          className="alert alert-info mt-6 flex-col items-start gap-2"
          data-ocid="create-ad.polling_state"
        >
          <div className="flex items-center gap-2">
            <ExternalLink className="w-5 h-5 shrink-0" />
            <span className="font-semibold">{t("payment.newTabOpened")}</span>
          </div>
          <p className="text-sm">{t("payment.newTabDesc")}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="loading loading-infinity loading-sm" />
            <span className="text-sm">{t("payment.polling")}</span>
          </div>
        </div>
      )}

      {/* Poll success */}
      {pollSuccess && (
        <div
          className="alert alert-success mt-6"
          data-ocid="create-ad.payment_success_state"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>{t("payment.pollSuccess")}</span>
        </div>
      )}

      {/* Poll timeout/error */}
      {pollError && (
        <div
          className="alert alert-warning mt-6"
          data-ocid="create-ad.poll_error_state"
        >
          <AlertCircle className="w-5 h-5" />
          <span>{pollError}</span>
        </div>
      )}
    </div>
  );
}
