import { o as createLucideIcon, u as useTranslation, r as reactExports, N as NOMINATIM_URL, D as DEFAULT_LOCALE, y as SUPPORTED_LOCALE_CODES, a as useAuth, c as useBackend, d as useQueryClient, e as useQuery, z as getDefaultAvatarId, f as useMutation, j as jsxRuntimeExports, L as LoadingSpinner, x as User, A as LogIn, B as calcProfileCompleteness, F as Share2, I as CircleCheck, S as SEX_OPTIONS, p as MapPin, s as SUPPORTED_LOCALES, G as Globe, J as MAX_PHOTO_SIZE_MB, K as MAX_PROFILE_PHOTOS, O as getDefaultAvatarUrl, R as Plus, h as ue, T as ExternalBlob, V as Sex } from "./index-BFTCPkdC.js";
import { u as useForm, C as Controller, a as Camera, v as validatePhotoCount, b as validateImage } from "./index.esm-DG-alfJS.js";
import { T as Trash2 } from "./trash-2-CUY6f-1h.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  [
    "path",
    {
      d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
      key: "1c8476"
    }
  ],
  ["path", { d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7", key: "1ydtos" }],
  ["path", { d: "M7 3v4a1 1 0 0 0 1 1h7", key: "t51u73" }]
];
const Save = createLucideIcon("save", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function useCityDetection() {
  const { t } = useTranslation();
  const [city, setCity] = reactExports.useState(null);
  const [isDetecting, setIsDetecting] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const detectCity = reactExports.useCallback(() => {
    if (!navigator.geolocation) {
      setError(t("errors.geolocationNotSupported"));
      return;
    }
    setIsDetecting(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const url = `${NOMINATIM_URL}/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
          const res = await fetch(url, {
            headers: { "Accept-Language": "en" }
          });
          if (!res.ok) throw new Error("Geocoding request failed");
          const data = await res.json();
          const detected = data.address.city || data.address.town || data.address.village || data.address.county || null;
          if (detected) {
            setCity(detected);
          } else {
            setError(t("errors.geocodingFailed"));
          }
        } catch {
          setError(t("errors.geocodingFailed"));
        } finally {
          setIsDetecting(false);
        }
      },
      (geoError) => {
        setIsDetecting(false);
        if (geoError.code === geoError.PERMISSION_DENIED) {
          setError(t("errors.locationDenied"));
        } else if (geoError.code === geoError.POSITION_UNAVAILABLE) {
          setError(t("errors.locationUnavailable"));
        } else {
          setError(t("errors.locationTimeout"));
        }
      },
      { timeout: 1e4, maximumAge: 3e5 }
    );
  }, [t]);
  return { detectCity, city, isDetecting, error };
}
function mapLocaleToSupported(rawLocale) {
  const base = rawLocale.split("-")[0].toLowerCase();
  if (SUPPORTED_LOCALE_CODES.includes(base)) return base;
  return null;
}
function detectFromNavigator() {
  var _a;
  const langs = ((_a = navigator.languages) == null ? void 0 : _a.length) ? navigator.languages : [navigator.language];
  for (const lang of langs) {
    const mapped = mapLocaleToSupported(lang);
    if (mapped) return mapped;
  }
  return null;
}
function useLanguageDetection() {
  const [detectedLocale, setDetectedLocale] = reactExports.useState(null);
  const [error, setError] = reactExports.useState(null);
  const detectLanguage = reactExports.useCallback(() => {
    setError(null);
    const locale = detectFromNavigator();
    if (locale) {
      setDetectedLocale(locale);
      return locale;
    }
    setDetectedLocale(DEFAULT_LOCALE);
    setError("Could not detect your language. Please select it manually.");
    return null;
  }, []);
  return { detectedLocale, error, detectLanguage };
}
const inputLabelClassName = "label py-2 flex-wrap items-start gap-x-2 gap-y-1";
const inputLabelTextClassName = "label-text min-w-0 max-w-full whitespace-normal break-words leading-snug font-medium";
const inputLabelAltClassName = "label-text-alt max-w-full whitespace-normal break-words text-right leading-snug text-base-content/50";
function buildDefaultValues(profile) {
  return {
    fullName: (profile == null ? void 0 : profile.fullName) ?? "",
    username: (profile == null ? void 0 : profile.username) ?? "",
    phoneNumber: (profile == null ? void 0 : profile.phoneNumber) ?? "",
    telegram: (profile == null ? void 0 : profile.telegram) ?? "",
    instagram: (profile == null ? void 0 : profile.instagram) ?? "",
    bio: (profile == null ? void 0 : profile.bio) ?? "",
    sex: (profile == null ? void 0 : profile.sex) ?? Sex.other,
    city: (profile == null ? void 0 : profile.city) ?? "",
    language: (profile == null ? void 0 : profile.language) ?? "en",
    hideContactsInAds: (profile == null ? void 0 : profile.hideContactsInAds) ?? false,
    dateOfBirth: (profile == null ? void 0 : profile.dateOfBirth) != null ? new Date(Number(profile.dateOfBirth)).toISOString().split("T")[0] : "",
    photos: (profile == null ? void 0 : profile.photos) ?? []
  };
}
function ProfilePage() {
  var _a;
  const { t } = useTranslation();
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const fileInputRef = reactExports.useRef(null);
  const [uploadingIndex, setUploadingIndex] = reactExports.useState(null);
  const {
    detectCity,
    city: detectedCity,
    isDetecting,
    error: cityError
  } = useCityDetection();
  const { detectLanguage, error: langError } = useLanguageDetection();
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated
  });
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    reset,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm({
    defaultValues: buildDefaultValues(null)
  });
  reactExports.useEffect(() => {
    if (profile !== void 0) {
      reset(buildDefaultValues(profile));
    }
  }, [profile, reset]);
  reactExports.useEffect(() => {
    if (detectedCity) {
      setValue("city", detectedCity);
    }
  }, [detectedCity, setValue]);
  const photos = watch("photos");
  const watchPhoneNumber = watch("phoneNumber");
  const watchTelegram = watch("telegram");
  const watchInstagram = watch("instagram");
  const selectedDefaultAvatar = getDefaultAvatarId(profile == null ? void 0 : profile.defaultAvatar);
  const referralCode = (profile == null ? void 0 : profile.referralCode) ?? null;
  const referralLink = reactExports.useMemo(() => {
    if (!referralCode || typeof window === "undefined") return null;
    return `${window.location.origin}/referral/${referralCode}`;
  }, [referralCode]);
  async function handleCopyReferralLink() {
    if (!referralLink) return;
    try {
      await navigator.clipboard.writeText(referralLink);
      ue.success(t("referral.copied"));
    } catch {
      prompt(t("referral.copied"), referralLink);
    }
  }
  const mutation = useMutation({
    mutationFn: async (values) => {
      if (!backend.isReady) throw new Error("Not authenticated");
      const input = {
        fullName: values.fullName,
        username: values.username.trim() || void 0,
        phoneNumber: values.phoneNumber || void 0,
        telegram: values.telegram || void 0,
        instagram: values.instagram || void 0,
        bio: values.bio,
        sex: values.sex,
        city: values.city.trim() || void 0,
        language: values.language,
        hideContactsInAds: values.hideContactsInAds,
        dateOfBirth: values.dateOfBirth ? BigInt(new Date(values.dateOfBirth).getTime()) : void 0,
        photos: values.photos
      };
      return backend.upsertProfile(input);
    },
    onSuccess: () => {
      const wasCreating = !profile;
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (wasCreating) {
        ue.success(t("profile.referralLinkReady"));
      } else {
        ue.success(t("profile.saveSuccess"));
      }
      queryClient.invalidateQueries({ queryKey: ["myProfile"] });
    },
    onError: (err) => {
      ue.error(err.message || t("profile.saveError"));
    }
  });
  async function handleFileSelect(event) {
    var _a2;
    const file = (_a2 = event.target.files) == null ? void 0 : _a2[0];
    if (!event.target) return;
    event.target.value = "";
    if (!file) return;
    if (!validatePhotoCount(photos.length)) {
      ue.error(t("errors.tooManyPhotos", { max: MAX_PROFILE_PHOTOS }));
      return;
    }
    const validation = validateImage(file);
    if (!validation.valid) {
      ue.error(
        validation.error === "errors.imageTooBig" ? t("errors.imageTooBig", { size: MAX_PHOTO_SIZE_MB }) : t("errors.unsupportedImageType")
      );
      return;
    }
    const newIdx = photos.length;
    setUploadingIndex(newIdx);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const externalBlob = ExternalBlob.fromBytes(bytes);
      const meta = {
        contentType: file.type,
        blob: externalBlob,
        createdAt: BigInt(Date.now()),
        size: BigInt(file.size)
      };
      setValue("photos", [...photos, meta]);
    } catch {
      ue.error(t("profile.saveError"));
    } finally {
      setUploadingIndex(null);
    }
  }
  function removePhoto(index) {
    const updated = photos.filter((_, i) => i !== index);
    setValue("photos", updated);
  }
  function handleDetectLanguage() {
    const locale = detectLanguage();
    if (locale) {
      setValue("language", locale);
    } else {
      ue.error(t("profile.detectLanguageError"));
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
  if (authLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "profile.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    );
  }
  if (!isAuthenticated) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "profile.page",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 48, className: "text-base-content/30" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-medium", children: t("auth.loginRequired") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-neutral gap-2",
              onClick: login,
              "data-ocid": "profile.login_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { size: 18 }),
                t("nav.login")
              ]
            }
          )
        ]
      }
    );
  }
  if (profileLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "profile.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" })
      }
    );
  }
  const completeness = calcProfileCompleteness(profile ?? null);
  const isComplete = completeness.percent === 100;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "container mx-auto px-4 py-8 max-w-2xl",
      "data-ocid": "profile.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-3xl font-bold mb-6", children: t("profile.title") }),
        profile != null && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "form-control w-full mb-8",
            "data-ocid": "profile.referral_balance.section",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelTextClassName, children: t("profile.referralBalance") }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "input input-bordered w-full px-4 py-3 bg-base-200 text-base-content/70 flex items-center", children: [
                "$",
                (profile.balance ?? 0).toFixed(2),
                " USD"
              ] }),
              referralLink && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-2 rounded-lg border border-base-300 bg-base-100 p-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs font-medium text-base-content/60", children: t("profile.yourReferralLink") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "a",
                    {
                      href: referralLink,
                      className: "link link-hover block truncate text-sm",
                      children: referralLink
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: "btn btn-ghost btn-square btn-sm shrink-0",
                    onClick: handleCopyReferralLink,
                    "aria-label": t("referral.copied"),
                    title: t("referral.copied"),
                    "data-ocid": "profile.referral_copy_button",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Share2, { className: "w-4 h-4" })
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "alert alert-info mt-2",
                  "data-ocid": "profile.referral_balance_info",
                  children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("profile.referralBalanceInfo") }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("profile.referralBalanceComingSoon") })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `rounded-xl border p-4 mb-8 ${isComplete ? "border-success/40 bg-success/10" : "border-warning/40 bg-warning/10"}`,
            "data-ocid": "profile.completeness_banner",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-2", children: [
                isComplete ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5 text-success shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "w-5 h-5 text-warning shrink-0" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold text-sm", children: isComplete ? t("profile.completenessComplete") : t("profile.completeness", { percent: completeness.percent }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-sm font-bold", children: [
                  completeness.filled,
                  "/",
                  completeness.total
                ] })
              ] }),
              !isComplete && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "progress",
                  {
                    className: "progress progress-warning w-full h-2 mb-2",
                    value: completeness.percent,
                    max: 100,
                    "aria-label": `Profile ${completeness.percent}% complete`
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "text-xs text-base-content/60 space-y-0.5 mt-1", children: completeness.missingKeys.map((key) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-1.5 h-1.5 rounded-full bg-warning inline-block shrink-0" }),
                  t(key)
                ] }, key)) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit, className: "space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "fullName", className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: inputLabelTextClassName, children: [
              t("profile.fullName"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "fullName",
                className: `input input-bordered w-full px-4 py-3 ${errors.fullName ? "input-error" : ""}`,
                placeholder: t("profile.fullName"),
                "data-ocid": "profile.fullName.input",
                ...register("fullName", { required: t("common.required") })
              }
            ),
            errors.fullName && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.fullName.field_error",
                role: "alert",
                children: errors.fullName.message
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "username", className: inputLabelClassName, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelTextClassName, children: t("profile.username") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelAltClassName, children: t("common.optional") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "username",
                className: "input input-bordered w-full px-4 py-3",
                placeholder: t("profile.usernameHint"),
                "data-ocid": "profile.username.input",
                ...register("username")
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "fieldset", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "label whitespace-normal break-words leading-snug",
                htmlFor: "profile-phoneNumber",
                children: t("profile.phoneNumber")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "profile-phoneNumber",
                type: "tel",
                className: `input input-bordered w-full ${errors.phoneNumber ? "input-error" : ""}`,
                placeholder: t("profile.phoneNumberHint"),
                "data-ocid": "profile.phoneNumber.input",
                ...register("phoneNumber")
              }
            ),
            errors.phoneNumber && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-error text-sm", children: errors.phoneNumber.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "fieldset", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "label whitespace-normal break-words leading-snug",
                htmlFor: "profile-telegram",
                children: t("profile.telegram")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "profile-telegram",
                type: "text",
                className: `input input-bordered w-full ${errors.telegram ? "input-error" : ""}`,
                placeholder: "@username",
                "data-ocid": "profile.telegram.input",
                ...register("telegram", {
                  validate: (v) => !v || v.startsWith("@") || "Must start with @"
                })
              }
            ),
            errors.telegram && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-error text-sm", children: errors.telegram.message })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("fieldset", { className: "fieldset", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "label",
              {
                className: "label whitespace-normal break-words leading-snug",
                htmlFor: "profile-instagram",
                children: t("profile.instagram")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "profile-instagram",
                type: "text",
                className: `input input-bordered w-full ${errors.instagram ? "input-error" : ""}`,
                placeholder: "@username",
                "data-ocid": "profile.instagram.input",
                ...register("instagram", {
                  validate: (v) => !v || v.startsWith("@") || "Must start with @"
                })
              }
            ),
            errors.instagram && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-error text-sm", children: errors.instagram.message })
          ] }),
          !watchPhoneNumber && !watchTelegram && !watchInstagram && isSubmitted && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              className: "text-error text-sm",
              "data-ocid": "profile.contact_required.error_state",
              children: t("profile.contactRequired")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "bio", className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: inputLabelTextClassName, children: [
              t("profile.bio"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "bio",
                className: `textarea textarea-bordered w-full min-h-[100px] px-4 py-3 ${errors.bio ? "textarea-error" : ""}`,
                placeholder: t("profile.bioHint"),
                "data-ocid": "profile.bio.textarea",
                ...register("bio", { required: t("common.required") })
              }
            ),
            errors.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.bio.field_error",
                role: "alert",
                children: errors.bio.message
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sex", className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: inputLabelTextClassName, children: [
              t("profile.sex"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "sex",
                className: `select select-bordered w-full px-4 py-3 ${errors.sex ? "select-error" : ""}`,
                "data-ocid": "profile.sex.select",
                ...register("sex", { required: t("common.required") }),
                children: SEX_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: s.value, children: s.value === "male" ? t("profile.sexMale") : s.value === "female" ? t("profile.sexFemale") : t("profile.sexOther") }, s.value))
              }
            ),
            errors.sex && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.sex.field_error",
                role: "alert",
                children: errors.sex.message
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "city", className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelTextClassName, children: t("profile.city") }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "join w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "city",
                  className: "input input-bordered join-item flex-1",
                  placeholder: t("profile.cityHint"),
                  "data-ocid": "profile.city.input",
                  ...register("city")
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline join-item gap-1",
                  onClick: detectCity,
                  disabled: isDetecting,
                  "data-ocid": "profile.detect_city.button",
                  children: [
                    isDetecting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
                    t("profile.detectCity")
                  ]
                }
              )
            ] }),
            cityError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.city.error_state",
                role: "alert",
                children: cityError
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "language", className: inputLabelClassName, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: inputLabelTextClassName, children: [
              t("profile.language"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "join w-full", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "select",
                {
                  id: "language",
                  className: "select select-bordered join-item flex-1",
                  "data-ocid": "profile.language.select",
                  ...register("language", { required: t("common.required") }),
                  children: SUPPORTED_LOCALES.map((locale) => /* @__PURE__ */ jsxRuntimeExports.jsxs("option", { value: locale.code, children: [
                    locale.nativeName,
                    " — ",
                    locale.name
                  ] }, locale.code))
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-outline join-item gap-1",
                  onClick: handleDetectLanguage,
                  "data-ocid": "profile.detect_language.button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 16 }),
                    t("profile.detectLanguage")
                  ]
                }
              )
            ] }),
            langError && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-warning",
                "data-ocid": "profile.language.error_state",
                role: "alert",
                children: langError
              }
            ) }),
            errors.language && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.language.field_error",
                role: "alert",
                children: errors.language.message
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "form-control", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "label",
            {
              htmlFor: "hideContactsInAds",
              className: "label cursor-pointer justify-start gap-4",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Controller,
                  {
                    name: "hideContactsInAds",
                    control,
                    render: ({ field }) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        id: "hideContactsInAds",
                        type: "checkbox",
                        className: "toggle toggle-primary",
                        checked: field.value,
                        onChange: (e) => field.onChange(e.target.checked),
                        "data-ocid": "profile.hide_contacts.toggle"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text min-w-0 whitespace-normal break-words leading-snug", children: t("profile.hideContactsInAds") })
              ]
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { htmlFor: "dateOfBirth", className: inputLabelClassName, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelTextClassName, children: t("profile.dateOfBirth") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelAltClassName, children: t("profile.dateOfBirthHelp") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "dateOfBirth",
                type: "date",
                className: `input input-bordered w-full px-4 py-3 ${errors.dateOfBirth ? "input-error" : ""}`,
                "data-ocid": "profile.date_of_birth.input",
                ...register("dateOfBirth", {
                  validate: (v) => {
                    if (!v) return true;
                    const ms = new Date(v).getTime();
                    if (Number.isNaN(ms)) return t("errors.invalidDate");
                    const age = (Date.now() - ms) / (365.25 * 24 * 60 * 60 * 1e3);
                    if (age < 13 || age > 120) return t("errors.ageRange");
                    return true;
                  }
                })
              }
            ),
            errors.dateOfBirth && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "label-text-alt text-error",
                "data-ocid": "profile.date_of_birth.field_error",
                role: "alert",
                children: errors.dateOfBirth.message
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: inputLabelClassName, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelTextClassName, children: t("profile.photos") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: inputLabelAltClassName, children: t("profile.photosHint", {
                max: MAX_PROFILE_PHOTOS,
                size: MAX_PHOTO_SIZE_MB
              }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-base-content/60 mb-2", children: [
              photos.length,
              " / ",
              MAX_PROFILE_PHOTOS
            ] }),
            photos.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "flex flex-col items-center gap-2 p-6 border-2 border-dashed border-base-300 rounded-xl mb-3 cursor-pointer hover:opacity-80 hover:border-primary transition-all w-full",
                "data-ocid": "profile.photos.empty_state",
                onClick: () => {
                  var _a2;
                  return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-20 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "img",
                    {
                      src: getDefaultAvatarUrl(selectedDefaultAvatar),
                      alt: t("profile.defaultAvatar"),
                      onError: (e) => {
                        e.currentTarget.src = getDefaultAvatarUrl();
                      },
                      loading: "lazy"
                    }
                  ) }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-ghost", children: [
                    t("profile.defaultAvatar"),
                    ": ",
                    selectedDefaultAvatar
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/50", children: t("profile.noPhotos") })
                ]
              }
            ),
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "grid grid-cols-3 gap-3 mb-3",
                "data-ocid": "profile.photos.list",
                children: [
                  photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: `relative group aspect-square rounded-xl overflow-hidden cursor-pointer transition-all ${idx === 0 ? "border-2 border-primary ring-2 ring-primary/30 shadow-md" : "border border-base-300"}`,
                      "data-ocid": `profile.photos.item.${idx + 1}`,
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "img",
                          {
                            src: photo.blob.getDirectURL(),
                            alt: `${idx + 1}`,
                            className: "w-full h-full object-cover",
                            loading: "lazy"
                          }
                        ),
                        idx === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute bottom-0 left-0 right-0 bg-primary/80 text-primary-content text-xs text-center py-0.5 font-medium", children: t("profile.currentAvatar") }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center pointer-events-none" }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            className: "absolute top-1 right-1 btn btn-circle btn-xs btn-error opacity-0 group-hover:opacity-100 transition-opacity",
                            onClick: () => removePhoto(idx),
                            "aria-label": t("common.delete"),
                            "data-ocid": `profile.photos.delete_button.${idx + 1}`,
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 12 })
                          }
                        )
                      ]
                    },
                    photo.createdAt.toString()
                  )),
                  uploadingIndex !== null && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-square rounded-xl border-2 border-dashed border-primary flex items-center justify-center bg-base-200", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "md" }) })
                ]
              }
            ),
            photos.length < MAX_PROFILE_PHOTOS && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  ref: fileInputRef,
                  type: "file",
                  accept: "image/*",
                  className: "hidden",
                  onChange: handleFileSelect,
                  "data-ocid": "profile.photos.upload_button"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-neutral btn-outline gap-2 w-full",
                  onClick: () => {
                    var _a2;
                    return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                  },
                  disabled: uploadingIndex !== null,
                  "data-ocid": "profile.photos.add_button",
                  children: [
                    uploadingIndex !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { size: 16 }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { size: 16 }),
                    t("profile.uploadPhoto")
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "submit",
                className: "btn btn-neutral w-full gap-2",
                disabled: isSaving,
                "data-ocid": "profile.save_button",
                children: isSaving ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }),
                  t("profile.saving")
                ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { size: 18 }),
                  t("profile.saveChanges")
                ] })
              }
            ),
            mutation.isSuccess && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "alert alert-success mt-4",
                "data-ocid": "profile.success_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("profile.saveSuccess") })
              }
            ),
            mutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "alert alert-error mt-4",
                "data-ocid": "profile.error_state",
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ((_a = mutation.error) == null ? void 0 : _a.message) || t("profile.saveError") })
              }
            )
          ] })
        ] })
      ]
    }
  );
}
export {
  ProfilePage as default
};
