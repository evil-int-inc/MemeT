import { ExternalBlob } from "@/backend";
import { Sex } from "@/backend";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  MAX_PHOTO_SIZE_MB,
  MAX_PROFILE_PHOTOS,
  SEX_OPTIONS,
  SUPPORTED_LOCALES,
} from "@/constants";
import { useAuth } from "@/hooks/useAuth";
import { useCityDetection } from "@/hooks/useCityDetection";
import { useLanguageDetection } from "@/hooks/useLanguageDetection";
import { useBackend } from "@/services/backend";
import { validateImage, validatePhotoCount } from "@/services/imageService";
import type { BlobMetadata, UserProfile } from "@/types";
import { getDefaultAvatarId, getDefaultAvatarUrl } from "@/utils/avatar";
import { calcProfileCompleteness } from "@/utils/profileCompleteness";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Globe,
  LogIn,
  MapPin,
  Plus,
  Save,
  Share2,
  Trash2,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface ProfileFormValues {
  fullName: string;
  username: string;
  phoneNumber?: string;
  telegram?: string;
  instagram?: string;
  bio: string;
  sex: Sex;
  city: string;
  language: string;
  hideContactsInAds: boolean;
  dateOfBirth?: string;
  photos: BlobMetadata[];
}

const inputLabelClassName = "label py-2 flex-wrap items-start gap-x-2 gap-y-1";
const inputLabelTextClassName =
  "label-text min-w-0 max-w-full whitespace-normal break-words leading-snug font-medium";
const inputLabelAltClassName =
  "label-text-alt max-w-full whitespace-normal break-words text-right leading-snug text-base-content/50";

function buildDefaultValues(profile: UserProfile | null): ProfileFormValues {
  return {
    fullName: profile?.fullName ?? "",
    username: profile?.username ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
    telegram: profile?.telegram ?? "",
    instagram: profile?.instagram ?? "",
    bio: profile?.bio ?? "",
    sex: profile?.sex ?? Sex.other,
    city: profile?.city ?? "",
    language: profile?.language ?? "en",
    hideContactsInAds: profile?.hideContactsInAds ?? false,
    dateOfBirth:
      profile?.dateOfBirth != null
        ? new Date(Number(profile.dateOfBirth)).toISOString().split("T")[0]
        : "",
    photos: profile?.photos ?? [],
  };
}

export default function ProfilePage() {
  const { t } = useTranslation();
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);

  const {
    detectCity,
    city: detectedCity,
    isDetecting,
    error: cityError,
  } = useCityDetection();
  const { detectLanguage, error: langError } = useLanguageDetection();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated,
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<ProfileFormValues>({
    defaultValues: buildDefaultValues(null),
  });

  // Populate form once profile is loaded
  useEffect(() => {
    if (profile !== undefined) {
      reset(buildDefaultValues(profile));
    }
  }, [profile, reset]);

  // Sync detected city into form
  useEffect(() => {
    if (detectedCity) {
      setValue("city", detectedCity);
    }
  }, [detectedCity, setValue]);

  const photos = watch("photos");
  const watchPhoneNumber = watch("phoneNumber");
  const watchTelegram = watch("telegram");
  const watchInstagram = watch("instagram");
  const selectedDefaultAvatar = getDefaultAvatarId(profile?.defaultAvatar);
  const referralCode = profile?.referralCode ?? null;
  const referralLink = useMemo(() => {
    if (!referralCode || typeof window === "undefined") return null;
    return `${window.location.origin}/referral/${referralCode}`;
  }, [referralCode]);

  async function handleCopyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success(t("referral.copied"));
    } catch {
      // Fallback: prompt
      prompt(t("referral.copied"), referralLink);
    }
  }

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      // Read backend.upsertProfile through the live backend object at call
      // time — never destructure the function out of the hook return value,
      // because that would capture a stale closure.
      if (!backend.isReady) throw new Error("Not authenticated");
      const input: Parameters<typeof backend.upsertProfile>[0] = {
        fullName: values.fullName,
        username: values.username.trim() || undefined,
        phoneNumber: values.phoneNumber || undefined,
        telegram: values.telegram || undefined,
        instagram: values.instagram || undefined,
        bio: values.bio,
        sex: values.sex,
        city: values.city.trim() || undefined,
        language: values.language,
        hideContactsInAds: values.hideContactsInAds,
        dateOfBirth: values.dateOfBirth
          ? BigInt(new Date(values.dateOfBirth).getTime())
          : undefined,
        photos: values.photos,
      };
      return backend.upsertProfile(input);
    },
    onSuccess: () => {
      const wasCreating = !profile;
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (wasCreating) {
        toast.success(t("profile.referralLinkReady"));
      } else {
        toast.success(t("profile.saveSuccess"));
      }
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err: Error) => {
      toast.error(err.message || t("profile.saveError"));
    },
  });

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!event.target) return;
    // Reset the input so same file can be re-selected
    (event.target as HTMLInputElement).value = "";
    if (!file) return;

    if (!validatePhotoCount(photos.length)) {
      toast.error(t("errors.tooManyPhotos", { max: MAX_PROFILE_PHOTOS }));
      return;
    }

    const validation = validateImage(file);
    if (!validation.valid) {
      toast.error(
        validation.error === "errors.imageTooBig"
          ? t("errors.imageTooBig", { size: MAX_PHOTO_SIZE_MB })
          : t("errors.unsupportedImageType"),
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
      toast.error(t("profile.saveError"));
    } finally {
      setUploadingIndex(null);
    }
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index);
    setValue("photos", updated);
  }

  function handleDetectLanguage() {
    const locale = detectLanguage();
    if (locale) {
      setValue("language", locale);
    } else {
      toast.error(t("profile.detectLanguageError"));
    }
  }

  const onSubmit = handleSubmit((values) => {
    if (!values.phoneNumber && !values.telegram && !values.instagram) {
      setError("phoneNumber", { message: t("profile.contactRequired") });
      return;
    }
    mutation.mutate(values);
  });
  const isSaving = isSubmitting || mutation.isPending || authLoading;

  // Auth guard
  if (authLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="profile.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] gap-4"
        data-ocid="profile.page"
      >
        <User size={48} className="text-base-content/30" />
        <p className="text-lg font-medium">{t("auth.loginRequired")}</p>
        <button
          type="button"
          className="btn btn-neutral gap-2"
          onClick={login}
          data-ocid="profile.login_button"
        >
          <LogIn size={18} />
          {t("nav.login")}
        </button>
      </div>
    );
  }

  if (profileLoading) {
    return (
      <div
        className="flex items-center justify-center min-h-[60vh]"
        data-ocid="profile.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // profile is null when not yet created — treat it as empty for completeness
  const completeness = calcProfileCompleteness(profile ?? null);
  const isComplete = completeness.percent === 100;

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-2xl"
      data-ocid="profile.page"
    >
      <h1 className="text-3xl font-bold mb-6">{t("profile.title")}</h1>

      {/* ── Referral Balance ───────────────────────────── */}
      {profile != null && (
        <div
          className="form-control w-full mb-8"
          data-ocid="profile.referral_balance.section"
        >
          <div className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.referralBalance")}
            </span>
          </div>
          <div className="input input-bordered w-full px-4 py-3 bg-base-200 text-base-content/70 flex items-center">
            ${(profile.balance ?? 0).toFixed(2)} USD
          </div>
          {referralLink && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 p-2">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-medium text-base-content/60">
                  {t("profile.yourReferralLink")}
                </div>
                <a
                  href={referralLink}
                  className="link link-hover block truncate text-sm"
                >
                  {referralLink}
                </a>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-square btn-sm shrink-0"
                onClick={handleCopyReferralLink}
                aria-label={t("referral.copied")}
                title={t("referral.copied")}
                data-ocid="profile.referral_copy_button"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          )}
          <div
            className="alert alert-info mt-2"
            data-ocid="profile.referral_balance_info"
          >
            <div className="text-sm space-y-1">
              <p>{t("profile.referralBalanceInfo")}</p>
              <p>{t("profile.referralBalanceComingSoon")}</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Profile Completeness Banner ──────────────────── */}
      <div
        className={`rounded-xl border p-4 mb-8 ${
          isComplete
            ? "border-success/40 bg-success/10"
            : "border-warning/40 bg-warning/10"
        }`}
        data-ocid="profile.completeness_banner"
      >
        <div className="flex items-center gap-3 mb-2">
          {isComplete ? (
            <CheckCircle2 className="w-5 h-5 text-success shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          )}
          <span className="font-semibold text-sm">
            {isComplete
              ? t("profile.completenessComplete")
              : t("profile.completeness", { percent: completeness.percent })}
          </span>
          <span className="ml-auto text-sm font-bold">
            {completeness.filled}/{completeness.total}
          </span>
        </div>
        {!isComplete && (
          <>
            <progress
              className="progress progress-warning w-full h-2 mb-2"
              value={completeness.percent}
              max={100}
              aria-label={`Profile ${completeness.percent}% complete`}
            />
            <ul className="text-xs text-base-content/60 space-y-0.5 mt-1">
              {completeness.missingKeys.map((key) => (
                <li key={key} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-warning inline-block shrink-0" />
                  {t(key)}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* ── Full Name ──────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="fullName" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.fullName")} *
            </span>
          </label>
          <input
            id="fullName"
            className={`input input-bordered w-full px-4 py-3 ${
              errors.fullName ? "input-error" : ""
            }`}
            placeholder={t("profile.fullName")}
            data-ocid="profile.fullName.input"
            {...register("fullName", { required: t("common.required") })}
          />
          {errors.fullName && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.fullName.field_error"
                role="alert"
              >
                {errors.fullName.message}
              </span>
            </div>
          )}
        </div>

        {/* ── Username ───────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="username" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.username")}
            </span>
            <span className={inputLabelAltClassName}>
              {t("common.optional")}
            </span>
          </label>
          <input
            id="username"
            className="input input-bordered w-full px-4 py-3"
            placeholder={t("profile.usernameHint")}
            data-ocid="profile.username.input"
            {...register("username")}
          />
        </div>

        {/* ── Phone number ───────────────────────────────── */}
        <fieldset className="fieldset">
          <label
            className="label whitespace-normal break-words leading-snug"
            htmlFor="profile-phoneNumber"
          >
            {t("profile.phoneNumber")}
          </label>
          <input
            id="profile-phoneNumber"
            type="tel"
            className={`input input-bordered w-full ${errors.phoneNumber ? "input-error" : ""}`}
            placeholder={t("profile.phoneNumberHint")}
            data-ocid="profile.phoneNumber.input"
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <span className="text-error text-sm">
              {errors.phoneNumber.message}
            </span>
          )}
        </fieldset>

        {/* ── Telegram ───────────────────────────────────── */}
        <fieldset className="fieldset">
          <label
            className="label whitespace-normal break-words leading-snug"
            htmlFor="profile-telegram"
          >
            {t("profile.telegram")}
          </label>
          <input
            id="profile-telegram"
            type="text"
            className={`input input-bordered w-full ${errors.telegram ? "input-error" : ""}`}
            placeholder="@username"
            data-ocid="profile.telegram.input"
            {...register("telegram", {
              validate: (v) => !v || v.startsWith("@") || "Must start with @",
            })}
          />
          {errors.telegram && (
            <span className="text-error text-sm">
              {errors.telegram.message}
            </span>
          )}
        </fieldset>

        {/* ── Instagram ──────────────────────────────────── */}
        <fieldset className="fieldset">
          <label
            className="label whitespace-normal break-words leading-snug"
            htmlFor="profile-instagram"
          >
            {t("profile.instagram")}
          </label>
          <input
            id="profile-instagram"
            type="text"
            className={`input input-bordered w-full ${errors.instagram ? "input-error" : ""}`}
            placeholder="@username"
            data-ocid="profile.instagram.input"
            {...register("instagram", {
              validate: (v) => !v || v.startsWith("@") || "Must start with @",
            })}
          />
          {errors.instagram && (
            <span className="text-error text-sm">
              {errors.instagram.message}
            </span>
          )}
        </fieldset>

        {/* Group-level error: at least one required */}
        {!watchPhoneNumber &&
          !watchTelegram &&
          !watchInstagram &&
          isSubmitted && (
            <p
              className="text-error text-sm"
              data-ocid="profile.contact_required.error_state"
            >
              {t("profile.contactRequired")}
            </p>
          )}

        {/* ── Bio ────────────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="bio" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.bio")} *
            </span>
          </label>
          <textarea
            id="bio"
            className={`textarea textarea-bordered w-full min-h-[100px] px-4 py-3 ${
              errors.bio ? "textarea-error" : ""
            }`}
            placeholder={t("profile.bioHint")}
            data-ocid="profile.bio.textarea"
            {...register("bio", { required: t("common.required") })}
          />
          {errors.bio && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.bio.field_error"
                role="alert"
              >
                {errors.bio.message}
              </span>
            </div>
          )}
        </div>

        {/* ── Sex ────────────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="sex" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.sex")} *
            </span>
          </label>
          <select
            id="sex"
            className={`select select-bordered w-full px-4 py-3 ${
              errors.sex ? "select-error" : ""
            }`}
            data-ocid="profile.sex.select"
            {...register("sex", { required: t("common.required") })}
          >
            {SEX_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.value === "male"
                  ? t("profile.sexMale")
                  : s.value === "female"
                    ? t("profile.sexFemale")
                    : t("profile.sexOther")}
              </option>
            ))}
          </select>
          {errors.sex && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.sex.field_error"
                role="alert"
              >
                {errors.sex.message}
              </span>
            </div>
          )}
        </div>

        {/* ── City ───────────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="city" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>{t("profile.city")}</span>
          </label>
          <div className="join w-full">
            <input
              id="city"
              className="input input-bordered join-item flex-1"
              placeholder={t("profile.cityHint")}
              data-ocid="profile.city.input"
              {...register("city")}
            />
            <button
              type="button"
              className="btn btn-outline join-item gap-1"
              onClick={detectCity}
              disabled={isDetecting}
              data-ocid="profile.detect_city.button"
            >
              {isDetecting ? (
                <span className="loading loading-infinity loading-xs" />
              ) : (
                <MapPin size={16} />
              )}
              {t("profile.detectCity")}
            </button>
          </div>
          {cityError && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.city.error_state"
                role="alert"
              >
                {cityError}
              </span>
            </div>
          )}
        </div>

        {/* ── Language ───────────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="language" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.language")} *
            </span>
          </label>
          <div className="join w-full">
            <select
              id="language"
              className="select select-bordered join-item flex-1"
              data-ocid="profile.language.select"
              {...register("language", { required: t("common.required") })}
            >
              {SUPPORTED_LOCALES.map((locale) => (
                <option key={locale.code} value={locale.code}>
                  {locale.nativeName} — {locale.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn btn-outline join-item gap-1"
              onClick={handleDetectLanguage}
              data-ocid="profile.detect_language.button"
            >
              <Globe size={16} />
              {t("profile.detectLanguage")}
            </button>
          </div>
          {langError && (
            <div className="label">
              <span
                className="label-text-alt text-warning"
                data-ocid="profile.language.error_state"
                role="alert"
              >
                {langError}
              </span>
            </div>
          )}
          {errors.language && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.language.field_error"
                role="alert"
              >
                {errors.language.message}
              </span>
            </div>
          )}
        </div>

        {/* ── Hide Contacts in Ads ─────────────────────── */}
        <div className="form-control">
          <label
            htmlFor="hideContactsInAds"
            className="label cursor-pointer justify-start gap-4"
          >
            <Controller
              name="hideContactsInAds"
              control={control}
              render={({ field }) => (
                <input
                  id="hideContactsInAds"
                  type="checkbox"
                  className="toggle toggle-primary"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                  data-ocid="profile.hide_contacts.toggle"
                />
              )}
            />
            <span className="label-text min-w-0 whitespace-normal break-words leading-snug">
              {t("profile.hideContactsInAds")}
            </span>
          </label>
        </div>

        {/* ── Date of Birth ─────────────────────────────── */}
        <div className="form-control w-full">
          <label htmlFor="dateOfBirth" className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.dateOfBirth")}
            </span>
            <span className={inputLabelAltClassName}>
              {t("profile.dateOfBirthHelp")}
            </span>
          </label>
          <input
            id="dateOfBirth"
            type="date"
            className={`input input-bordered w-full px-4 py-3 ${
              errors.dateOfBirth ? "input-error" : ""
            }`}
            data-ocid="profile.date_of_birth.input"
            {...register("dateOfBirth", {
              validate: (v) => {
                if (!v) return true;
                const ms = new Date(v).getTime();
                if (Number.isNaN(ms)) return t("errors.invalidDate");
                const age = (Date.now() - ms) / (365.25 * 24 * 60 * 60 * 1000);
                if (age < 13 || age > 120) return t("errors.ageRange");
                return true;
              },
            })}
          />
          {errors.dateOfBirth && (
            <div className="label">
              <span
                className="label-text-alt text-error"
                data-ocid="profile.date_of_birth.field_error"
                role="alert"
              >
                {errors.dateOfBirth.message}
              </span>
            </div>
          )}
        </div>

        {/* ── Photos ─────────────────────────────────────── */}
        <div className="form-control w-full">
          <div className={inputLabelClassName}>
            <span className={inputLabelTextClassName}>
              {t("profile.photos")}
            </span>
            <span className={inputLabelAltClassName}>
              {t("profile.photosHint", {
                max: MAX_PROFILE_PHOTOS,
                size: MAX_PHOTO_SIZE_MB,
              })}
            </span>
          </div>

          {/* Photo count indicator */}
          <div className="text-sm text-base-content/60 mb-2">
            {photos.length} / {MAX_PROFILE_PHOTOS}
          </div>

          {/* No photos → show default avatar */}
          {photos.length === 0 && (
            <button
              type="button"
              className="flex flex-col items-center gap-2 p-6 border-2 border-dashed border-base-300 rounded-xl mb-3 cursor-pointer hover:opacity-80 hover:border-primary transition-all w-full"
              data-ocid="profile.photos.empty_state"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="avatar">
                <div className="w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img
                    src={getDefaultAvatarUrl(selectedDefaultAvatar)}
                    alt={t("profile.defaultAvatar")}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        getDefaultAvatarUrl();
                    }}
                    loading="lazy"
                  />
                </div>
              </div>
              <span className="badge badge-ghost">
                {t("profile.defaultAvatar")}: {selectedDefaultAvatar}
              </span>
              <p className="text-sm text-base-content/50">
                {t("profile.noPhotos")}
              </p>
            </button>
          )}

          {/* Existing photos grid */}
          {photos.length > 0 && (
            <div
              className="grid grid-cols-3 gap-3 mb-3"
              data-ocid="profile.photos.list"
            >
              {photos.map((photo, idx) => (
                <div
                  key={photo.createdAt.toString()}
                  className={`relative group aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${
                    idx === 0
                      ? "border-2 border-primary ring-2 ring-primary/30 shadow-md"
                      : "border border-base-300"
                  }`}
                  data-ocid={`profile.photos.item.${idx + 1}`}
                >
                  <img
                    src={photo.blob.getDirectURL()}
                    alt={`${idx + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Current avatar badge on first photo */}
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-content text-xs text-center py-0.5 font-medium">
                      {t("profile.currentAvatar")}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none" />
                  <button
                    type="button"
                    className="absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removePhoto(idx)}
                    aria-label={t("common.delete")}
                    data-ocid={`profile.photos.delete_button.${idx + 1}`}
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}

              {/* Uploading placeholder */}
              {uploadingIndex !== null && (
                <div className="aspect-square rounded-xl border-2 border-dashed border-primary flex items-center justify-center bg-base-200">
                  <LoadingSpinner size="md" />
                </div>
              )}
            </div>
          )}

          {/* Add photo button */}
          {photos.length < MAX_PROFILE_PHOTOS && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
                data-ocid="profile.photos.upload_button"
              />
              <button
                type="button"
                className="btn btn-neutral btn-outline gap-2 w-full"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingIndex !== null}
                data-ocid="profile.photos.add_button"
              >
                {uploadingIndex !== null ? (
                  <span className="loading loading-infinity loading-sm" />
                ) : (
                  <Plus size={16} />
                )}
                <Camera size={16} />
                {t("profile.uploadPhoto")}
              </button>
            </>
          )}
        </div>

        {/* ── Submit ─────────────────────────────────────── */}
        <div className="pt-4">
          <button
            type="submit"
            className="btn btn-neutral w-full gap-2"
            disabled={isSaving}
            data-ocid="profile.save_button"
          >
            {isSaving ? (
              <>
                <span className="loading loading-infinity loading-sm" />
                {t("profile.saving")}
              </>
            ) : (
              <>
                <Save size={18} />
                {t("profile.saveChanges")}
              </>
            )}
          </button>

          {mutation.isSuccess && (
            <div
              className="alert alert-success mt-4"
              data-ocid="profile.success_state"
            >
              <span>{t("profile.saveSuccess")}</span>
            </div>
          )}

          {mutation.isError && (
            <div
              className="alert alert-error mt-4"
              data-ocid="profile.error_state"
            >
              <span>
                {(mutation.error as Error)?.message || t("profile.saveError")}
              </span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
