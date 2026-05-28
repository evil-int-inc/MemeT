const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/index-BFTCPkdC.js","assets/index-D7MUCY14.css"])))=>i.map(i=>d[i]);
import { o as createLucideIcon, u as useTranslation, b as useNavigate, a as useAuth, c as useBackend, d as useQueryClient, r as reactExports, e as useQuery, W as HowPaysForEvent, v as MeetType, f as useMutation, j as jsxRuntimeExports, L as LoadingSpinner, Y as AD_PUBLISH_PRICE_USD, E as EVENT_TYPES, p as MapPin, q as EXPECTED_COMPANION_SEX_OPTIONS, Z as HOW_PAYS_OPTIONS, J as MAX_PHOTO_SIZE_MB, K as MAX_PROFILE_PHOTOS, I as CircleCheck, _ as __vitePreload, T as ExternalBlob } from "./index-BFTCPkdC.js";
import { C as CircleAlert, b as buildSuccessUrl, a as buildCancelUrl } from "./stripe-DoKxJiD6.js";
import { u as useForm, a as Camera, v as validatePhotoCount, b as validateImage } from "./index.esm-DG-alfJS.js";
import { S as SquarePen } from "./square-pen-DafQjD_i.js";
import { C as CreditCard } from "./credit-card-DdGt8NeC.js";
import { E as ExternalLink } from "./external-link-Brrc1cp_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 16v-4", key: "1dtifu" }],
  ["path", { d: "M12 8h.01", key: "e9boi3" }]
];
const Info = createLucideIcon("info", __iconNode);
const POLL_INTERVAL_MS = 3e3;
const POLL_MAX_MS = 5 * 60 * 1e3;
function CreateAdPage() {
  var _a, _b, _c, _d;
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const backend = useBackend();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = reactExports.useState(null);
  const [promoCode, setPromoCode] = reactExports.useState("");
  const [uploadingIndex, setUploadingIndex] = reactExports.useState(null);
  const [pollingAdId, setPollingAdId] = reactExports.useState(null);
  const fileInputRef = reactExports.useRef(null);
  const [pollSuccess, setPollSuccess] = reactExports.useState(false);
  const [pollError, setPollError] = reactExports.useState(null);
  const [stripeOpened, setStripeOpened] = reactExports.useState(false);
  const pollTimerRef = reactExports.useRef(null);
  const pollStartRef = reactExports.useRef(0);
  const stopPolling = reactExports.useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  }, []);
  reactExports.useEffect(() => stopPolling, [stopPolling]);
  const search = typeof window !== "undefined" ? Object.fromEntries(new URLSearchParams(window.location.search)) : {};
  const editAdId = search.edit ?? null;
  reactExports.useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["myProfile"],
    queryFn: () => backend.getMyProfile(),
    enabled: isAuthenticated && backend.isReady
  });
  const { data: myAds, isLoading: adsLoading } = useQuery({
    queryKey: ["myAds"],
    queryFn: () => backend.getMyAds(),
    enabled: isAuthenticated && backend.isReady && !!editAdId
  });
  const editAd = editAdId && myAds ? myAds.find((a) => a.id === editAdId) : null;
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      eventName: "",
      eventType: "restaurant",
      meetType: "inPerson",
      city: "",
      description: "",
      expectedCompanionSex: "both",
      eventLink: "",
      howPaysForEvent: "me",
      photos: []
    }
  });
  const photos = watch("photos") ?? [];
  reactExports.useEffect(() => {
    if (editAd) {
      reset({
        eventName: editAd.eventName,
        eventType: editAd.eventType,
        meetType: editAd.meetType === MeetType.online ? "online" : "inPerson",
        city: editAd.city ?? "",
        description: editAd.description,
        expectedCompanionSex: editAd.expectedCompanionSex,
        eventLink: editAd.eventLink ?? "",
        howPaysForEvent: editAd.howPaysForEvent ?? HowPaysForEvent.me,
        photos: editAd.photos ?? []
      });
    }
  }, [editAd, reset]);
  async function handleFileSelect(event) {
    var _a2;
    const file = (_a2 = event.target.files) == null ? void 0 : _a2[0];
    if (!event.target) return;
    event.target.value = "";
    if (!file) return;
    if (!validatePhotoCount(photos.length)) {
      __vitePreload(async () => {
        const { toast } = await import("./index-BFTCPkdC.js").then((n) => n.a6);
        return { toast };
      }, true ? __vite__mapDeps([0,1]) : void 0).then(
        ({ toast }) => toast.error(t("errors.tooManyPhotos", { max: MAX_PROFILE_PHOTOS }))
      );
      return;
    }
    const validation = validateImage(file);
    if (!validation.valid) {
      __vitePreload(async () => {
        const { toast } = await import("./index-BFTCPkdC.js").then((n) => n.a6);
        return { toast };
      }, true ? __vite__mapDeps([0,1]) : void 0).then(
        ({ toast }) => toast.error(
          validation.error === "errors.imageTooBig" ? t("errors.imageTooBig", { size: MAX_PHOTO_SIZE_MB }) : t("errors.unsupportedImageType")
        )
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
      __vitePreload(async () => {
        const { toast } = await import("./index-BFTCPkdC.js").then((n) => n.a6);
        return { toast };
      }, true ? __vite__mapDeps([0,1]) : void 0).then(({ toast }) => toast.error(t("profile.saveError")));
    } finally {
      setUploadingIndex(null);
    }
  }
  function removePhoto(index) {
    const updated = photos.filter((_, i) => i !== index);
    setValue("photos", updated);
  }
  const createAdMutation = useMutation({
    mutationFn: (data) => backend.createAd({
      eventName: data.eventName,
      eventType: data.eventType,
      meetType: data.meetType === "online" ? MeetType.online : MeetType.inPerson,
      isVirtual: data.meetType === "online",
      city: data.city || void 0,
      description: data.description,
      expectedCompanionSex: data.expectedCompanionSex,
      eventLink: data.eventLink || void 0,
      howPaysForEvent: data.howPaysForEvent,
      photos: data.photos
    })
  });
  const updateAdMutation = useMutation({
    mutationFn: (data) => backend.updateAd(editAdId, {
      eventName: data.eventName,
      eventType: data.eventType,
      meetType: data.meetType === "online" ? MeetType.online : MeetType.inPerson,
      isVirtual: data.meetType === "online",
      city: data.city || void 0,
      description: data.description,
      expectedCompanionSex: data.expectedCompanionSex,
      eventLink: data.eventLink || void 0,
      howPaysForEvent: data.howPaysForEvent,
      photos: data.photos
    })
  });
  const stripeSessionMutation = useMutation({
    mutationFn: (adId) => backend.createStripeSession(
      adId,
      buildSuccessUrl(adId),
      buildCancelUrl(adId)
    )
  });
  const saveSessionMutation = useMutation({
    mutationFn: ({ adId, sessionId }) => backend.savePaymentReference(adId, sessionId)
  });
  const promoPublishMutation = useMutation({
    mutationFn: async ({ adId, code }) => {
      const result = await backend.publishByPromoCode(adId, code);
      if ("err" in result)
        throw new Error(String(result.err));
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myAds"] });
      navigate({ to: "/my-ads" });
    }
  });
  const onSubmit = async (data) => {
    setSubmitError(null);
    try {
      let ad;
      if (editAdId) {
        ad = await updateAdMutation.mutateAsync(data);
      } else {
        ad = await createAdMutation.mutateAsync(data);
      }
      await queryClient.invalidateQueries({ queryKey: ["myAds"] });
      const rawResult = await stripeSessionMutation.mutateAsync(ad.id);
      console.log("[Stripe debug] raw backend result:", rawResult);
      let sessionId;
      let checkoutUrl;
      try {
        const parsed = JSON.parse(rawResult);
        sessionId = typeof parsed.id === "string" ? parsed.id : "";
        checkoutUrl = typeof parsed.url === "string" ? parsed.url : "";
      } catch {
        throw new Error(t("payment.parseError"));
      }
      if (!checkoutUrl) {
        throw new Error(t("payment.missingUrl"));
      }
      if (sessionId) {
        try {
          await saveSessionMutation.mutateAsync({ adId: ad.id, sessionId });
        } catch {
          console.warn("[Stripe] Could not save sessionId to ad:", sessionId);
        }
      }
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
          if (target && (target.status === "published" || target.paymentStatus === "paid")) {
            stopPolling();
            setPollSuccess(true);
            setPollingAdId(null);
            queryClient.invalidateQueries({ queryKey: ["myAds"] });
            setTimeout(() => navigate({ to: `/ad/${target.id}` }), 2e3);
          }
        } catch {
        }
      }, POLL_INTERVAL_MS);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("error.unknown"));
    }
  };
  const isSubmitting = createAdMutation.isPending || updateAdMutation.isPending || stripeSessionMutation.isPending || saveSessionMutation.isPending;
  if (!isAuthenticated) return null;
  if (!backend.isReady || profileLoading || editAdId && adsLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center min-h-[60vh]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, { size: "lg" }) });
  }
  const hasContact = !!(((_a = profile == null ? void 0 : profile.phoneNumber) == null ? void 0 : _a[0]) || ((_b = profile == null ? void 0 : profile.telegram) == null ? void 0 : _b[0]) || ((_c = profile == null ? void 0 : profile.instagram) == null ? void 0 : _c[0]));
  const profileIncomplete = !profile || !profile.fullName || !hasContact || !profile.bio;
  if (profileIncomplete) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-lg mx-auto mt-12 px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-warning shadow-md",
        "data-ocid": "create-ad.profile_incomplete",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: t("createAd.profileIncomplete") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm mt-1", children: t("createAd.profileIncompleteDesc") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: "btn btn-sm btn-neutral btn-outline",
              onClick: () => navigate({ to: "/profile" }),
              "data-ocid": "create-ad.go_profile_button",
              children: t("nav.profile")
            }
          )
        ]
      }
    ) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto py-8 px-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { className: "w-6 h-6 text-primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold", children: editAdId ? t("createAd.titleEdit") : t("createAd.title") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "alert alert-info mb-6", "data-ocid": "create-ad.price_info", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "w-5 h-5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("createAd.priceInfo", { price: AD_PUBLISH_PRICE_USD }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "form",
      {
        onSubmit: handleSubmit(onSubmit),
        className: "space-y-5",
        "data-ocid": "create-ad.form",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", htmlFor: "ad-event-name", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.eventName"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ad-event-name",
                type: "text",
                placeholder: t("createAd.eventNamePlaceholder"),
                className: `input input-bordered w-full ${errors.eventName ? "input-error" : ""}`,
                "data-ocid": "create-ad.event_name_input",
                ...register("eventName", { required: t("validation.required") })
              }
            ),
            errors.eventName && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-xs mt-1",
                "data-ocid": "create-ad.event_name_error",
                children: errors.eventName.message
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", htmlFor: "ad-event-type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.eventType"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "ad-event-type",
                className: "select select-bordered w-full",
                "data-ocid": "create-ad.event_type_select",
                ...register("eventType", { required: t("validation.required") }),
                children: EVENT_TYPES.map((type) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: type.value, children: t(`eventType.${type.value}`) }, type.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("meetType.label"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    className: "radio radio-sm",
                    value: "inPerson",
                    "data-ocid": "create-ad.meet_type_in_person_radio",
                    ...register("meetType", {
                      required: t("validation.required")
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text", children: t("meetType.inPerson") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "input",
                  {
                    type: "radio",
                    className: "radio radio-sm",
                    value: "online",
                    "data-ocid": "create-ad.meet_type_online_radio",
                    ...register("meetType", {
                      required: t("validation.required")
                    })
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text", children: t("meetType.online") })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", htmlFor: "ad-city", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.city"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "input",
                {
                  id: "ad-city",
                  type: "text",
                  placeholder: t("createAd.cityPlaceholder"),
                  className: `input input-bordered flex-1 ${errors.city ? "input-error" : ""}`,
                  "data-ocid": "create-ad.city_input",
                  ...register("city", {
                    required: t("validation.required")
                  })
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-neutral btn-outline btn-sm self-center",
                  "data-ocid": "create-ad.use_my_city_button",
                  onClick: () => {
                    if (profile == null ? void 0 : profile.city) {
                      setValue("city", profile.city);
                    }
                  },
                  title: (profile == null ? void 0 : profile.city) ? profile.city : t("createAd.noCityInProfile"),
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { className: "w-4 h-4" }),
                    t("createAd.useMyCity")
                  ]
                }
              )
            ] }),
            errors.city && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-xs mt-1",
                "data-ocid": "create-ad.city_error",
                children: errors.city.message
              }
            ),
            !(profile == null ? void 0 : profile.city) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-warning text-xs mt-1", children: t("createAd.noCityInProfile") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", htmlFor: "ad-description", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.description"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "textarea",
              {
                id: "ad-description",
                placeholder: t("createAd.descriptionPlaceholder"),
                rows: 4,
                className: `textarea textarea-bordered w-full ${errors.description ? "textarea-error" : ""}`,
                "data-ocid": "create-ad.description_textarea",
                ...register("description", { required: t("validation.required") })
              }
            ),
            errors.description && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-xs mt-1",
                "data-ocid": "create-ad.description_error",
                children: errors.description.message
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "label", htmlFor: "ad-companion-sex", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.expectedCompanionSex"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                id: "ad-companion-sex",
                className: "select select-bordered w-full",
                "data-ocid": "create-ad.companion_sex_select",
                ...register("expectedCompanionSex", {
                  required: t("validation.required")
                }),
                children: EXPECTED_COMPANION_SEX_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: opt.value, children: t(`companionSex.${opt.value}`) }, opt.value))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.howPaysForEvent"),
              " *"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-4", children: HOW_PAYS_OPTIONS.map((opt) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "label",
              {
                className: "flex items-center gap-2 cursor-pointer",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "input",
                    {
                      type: "radio",
                      className: "radio radio-sm",
                      value: opt,
                      "data-ocid": `create-ad.how_pays_${opt}_radio`,
                      ...register("howPaysForEvent", {
                        required: t("validation.required")
                      })
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text", children: t(`createAd.howPays.${opt}`) })
                ]
              },
              opt
            )) }),
            errors.howPaysForEvent && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-xs mt-1",
                "data-ocid": "create-ad.how_pays_error",
                children: errors.howPaysForEvent.message
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "label", htmlFor: "ad-event-link", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text font-medium", children: t("createAd.eventLink") }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "label-text-alt text-base-content/50", children: t("common.optional") })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                id: "ad-event-link",
                type: "url",
                placeholder: "https://...",
                className: `input input-bordered w-full ${errors.eventLink ? "input-error" : ""}`,
                "data-ocid": "create-ad.event_link_input",
                ...register("eventLink", {
                  validate: (val) => {
                    if (!val) return true;
                    try {
                      new URL(val);
                      return true;
                    } catch {
                      return t("validation.invalidUrl");
                    }
                  }
                })
              }
            ),
            errors.eventLink && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-xs mt-1",
                "data-ocid": "create-ad.event_link_error",
                children: errors.eventLink.message
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "form-control gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "label", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "label-text font-medium", children: [
              t("createAd.photos"),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-ghost badge-sm", children: t("createAd.photosOptional") })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/60", children: t("createAd.photosHint", {
              max: MAX_PROFILE_PHOTOS,
              size: MAX_PHOTO_SIZE_MB
            }) }),
            photos.length < MAX_PROFILE_PHOTOS && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "border-2 border-dashed border-base-300 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-base-content/40 transition-colors w-full",
                onClick: () => {
                  var _a2;
                  return (_a2 = fileInputRef.current) == null ? void 0 : _a2.click();
                },
                "data-ocid": "create-ad.photos_upload_button",
                children: uploadingIndex !== null ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-md" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-8 h-8 text-base-content/40" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm text-base-content/60", children: t("createAd.addPhotos") })
                ] })
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                ref: fileInputRef,
                type: "file",
                accept: "image/*",
                className: "hidden",
                onChange: handleFileSelect
              }
            ),
            photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "grid grid-cols-3 gap-2",
                "data-ocid": "create-ad.photos_list",
                children: photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "relative aspect-square rounded-lg overflow-hidden group",
                    "data-ocid": `create-ad.photos.item.${idx + 1}`,
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
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          className: "btn btn-neutral btn-xs absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity",
                          onClick: () => removePhoto(idx),
                          "aria-label": t("createAd.photoDeleteAlt"),
                          "data-ocid": `create-ad.photos.delete_button.${idx + 1}`,
                          children: "×"
                        }
                      )
                    ]
                  },
                  photo.createdAt.toString()
                ))
              }
            )
          ] }),
          submitError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "alert alert-error",
              "data-ocid": "create-ad.submit_error_state",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: submitError })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "submit",
              className: "btn btn-neutral w-full gap-2",
              disabled: isSubmitting || !!pollingAdId || pollSuccess,
              "data-ocid": "create-ad.submit_button",
              children: [
                isSubmitting ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "w-5 h-5" }),
                isSubmitting ? t("createAd.processing") : editAdId ? t("createAd.updateAndPay", { price: AD_PUBLISH_PRICE_USD }) : t("createAd.submitAndPay", { price: AD_PUBLISH_PRICE_USD })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider text-sm opacity-60", children: t("common.or") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "input",
              {
                type: "text",
                className: "input input-bordered w-full",
                placeholder: t("createAd.promoCodePlaceholder"),
                value: promoCode,
                onChange: (e) => setPromoCode(e.target.value),
                disabled: isSubmitting || !!pollingAdId || promoPublishMutation.isPending,
                autoComplete: "off",
                "data-ocid": "create-ad.promo_code_input"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-neutral w-full",
                disabled: isSubmitting || !!pollingAdId || promoPublishMutation.isPending || !promoCode.trim(),
                onClick: async () => {
                  setSubmitError(null);
                  await new Promise((resolve, reject) => {
                    handleSubmit(
                      async (data) => {
                        try {
                          let ad;
                          if (editAdId) {
                            ad = await updateAdMutation.mutateAsync(data);
                          } else {
                            ad = await createAdMutation.mutateAsync(data);
                          }
                          await queryClient.invalidateQueries({
                            queryKey: ["myAds"]
                          });
                          await promoPublishMutation.mutateAsync({
                            adId: ad.id,
                            code: promoCode
                          });
                          resolve();
                        } catch (err) {
                          reject(err);
                        }
                      },
                      (errs) => {
                        reject(
                          new Error(
                            Object.values(errs).map((e) => e == null ? void 0 : e.message).filter(Boolean).join(", ")
                          )
                        );
                      }
                    )();
                  }).catch((err) => {
                    setSubmitError(
                      err instanceof Error ? err.message : t("error.unknown")
                    );
                  });
                },
                "data-ocid": "create-ad.promo_publish_button",
                children: promoPublishMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity" }) : t("createAd.saveByPromoCode")
              }
            ),
            promoPublishMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx(
              "p",
              {
                className: "text-error text-sm",
                "data-ocid": "create-ad.promo_error_state",
                children: ((_d = promoPublishMutation.error) == null ? void 0 : _d.message) || t("common.invalidPromoCode")
              }
            )
          ] })
        ]
      }
    ),
    stripeOpened && pollingAdId && !pollSuccess && !pollError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-info mt-6 flex-col items-start gap-2",
        "data-ocid": "create-ad.polling_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "w-5 h-5 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: t("payment.newTabOpened") })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm", children: t("payment.newTabDesc") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-sm" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: t("payment.polling") })
          ] })
        ]
      }
    ),
    pollSuccess && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-success mt-6",
        "data-ocid": "create-ad.payment_success_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("payment.pollSuccess") })
        ]
      }
    ),
    pollError && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "alert alert-warning mt-6",
        "data-ocid": "create-ad.poll_error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: pollError })
        ]
      }
    )
  ] });
}
export {
  CreateAdPage as default
};
