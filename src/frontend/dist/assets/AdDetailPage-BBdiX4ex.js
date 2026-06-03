import { o as createLucideIcon, u as useTranslation, i as useParams, b as useNavigate, d as useQueryClient, a as useAuth, c as useBackend, r as reactExports, e as useQuery, f as useMutation, j as jsxRuntimeExports, g as getProfileAvatarUrl, E as EventTypeIcon, G as Globe, p as MapPin, U as Users, y as User, H as Heart } from "./index-Dw-TU7ma.js";
import { A as ArrowLeft } from "./arrow-left-CFvIavVV.js";
import { S as SquarePen } from "./square-pen-On1MlLRp.js";
import { T as Trash2 } from "./trash-2--qCftX8Q.js";
import { W as Wallet } from "./wallet-DQ0xT4tp.js";
import { C as Calendar } from "./calendar-ChtU-sxm.js";
import { E as ExternalLink } from "./external-link-BzQYtRft.js";
import { E as Eye } from "./eye-BKw6TpT0.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  ["circle", { cx: "12", cy: "12", r: "4", key: "4exip2" }],
  ["path", { d: "M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8", key: "7n84p3" }]
];
const AtSign = createLucideIcon("at-sign", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  [
    "path",
    {
      d: "M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49",
      key: "ct8e1f"
    }
  ],
  ["path", { d: "M14.084 14.158a3 3 0 0 1-4.242-4.242", key: "151rxh" }],
  [
    "path",
    {
      d: "M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143",
      key: "13bj9a"
    }
  ],
  ["path", { d: "m2 2 20 20", key: "1ooewy" }]
];
const EyeOff = createLucideIcon("eye-off", __iconNode$2);
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
      d: "M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384",
      key: "9njp5v"
    }
  ]
];
const Phone = createLucideIcon("phone", __iconNode$1);
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
      d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
      key: "1ffxy3"
    }
  ],
  ["path", { d: "m21.854 2.147-10.94 10.939", key: "12cjpa" }]
];
const Send = createLucideIcon("send", __iconNode);
function enumLabel(val) {
  return val;
}
function formatDate(ns) {
  return new Date(Number(ns / 1000000n)).toLocaleDateString();
}
function extractDomain(url) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}
function AdDetailSkeleton() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "animate-pulse space-y-4 p-6",
      "data-ocid": "ad_detail.loading_state",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-8 bg-base-300 rounded w-2/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 bg-base-300 rounded w-1/3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-32 bg-base-300 rounded" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-24 bg-base-300 rounded" })
      ]
    }
  );
}
function AdDetailPage() {
  var _a, _b, _c, _d;
  const { t } = useTranslation();
  const { id } = useParams({ strict: false });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, principal, login } = useAuth();
  const backend = useBackend();
  const [contactVisible, setContactVisible] = reactExports.useState(false);
  const [contactValue, setContactValue] = reactExports.useState(null);
  const [contactLoading, setContactLoading] = reactExports.useState(false);
  const [contactError, setContactError] = reactExports.useState(null);
  const [showDeleteModal, setShowDeleteModal] = reactExports.useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = reactExports.useState(0);
  const [activeAdPhotoIdx, setActiveAdPhotoIdx] = reactExports.useState(0);
  const {
    data: ad,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["ad", id],
    queryFn: () => backend.getAdById(id),
    enabled: !!id
  });
  const deleteMutation = useMutation({
    mutationFn: () => backend.deleteAd(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ads"] });
      navigate({ to: "/my-ads" });
    }
  });
  const { data: joinRequests, isLoading: joinRequestsLoading } = useQuery({
    queryKey: ["joinRequestsForAdWithContacts", id],
    queryFn: () => backend.getJoinRequestsForAdWithContacts(id),
    enabled: isAuthenticated && !!ad && principal === ad.creatorPrincipal.toText()
  });
  const { data: isProfileLiked } = useQuery({
    queryKey: [
      "profileLike",
      ((_a = ad == null ? void 0 : ad.creatorPrincipal) == null ? void 0 : _a.toText()) ?? "",
      isAuthenticated
    ],
    queryFn: () => backend.isProfileLikedByMe(ad.creatorPrincipal),
    enabled: isAuthenticated && !!(ad == null ? void 0 : ad.creatorPrincipal)
  });
  const { data: profileLikeCount = 0 } = useQuery({
    queryKey: ["profileLikeCount", ((_b = ad == null ? void 0 : ad.creatorPrincipal) == null ? void 0 : _b.toText()) ?? ""],
    queryFn: () => backend.getProfileLikeCount(ad.creatorPrincipal),
    enabled: !!(ad == null ? void 0 : ad.creatorPrincipal)
  });
  const profileLikeMutation = useMutation({
    mutationFn: async () => {
      if (!(ad == null ? void 0 : ad.creatorPrincipal)) return;
      if (isProfileLiked) {
        await backend.removeProfileLike(ad.creatorPrincipal);
      } else {
        await backend.addProfileLike(ad.creatorPrincipal);
      }
    },
    onSuccess: () => {
      var _a2, _b2;
      queryClient.invalidateQueries({
        queryKey: ["profileLike", (_a2 = ad == null ? void 0 : ad.creatorPrincipal) == null ? void 0 : _a2.toText()]
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", (_b2 = ad == null ? void 0 : ad.creatorPrincipal) == null ? void 0 : _b2.toText()]
      });
    }
  });
  const handleRevealContact = async () => {
    var _a2, _b2, _c2;
    if (!isAuthenticated) {
      login();
      return;
    }
    if (contactVisible) {
      setContactVisible(false);
      return;
    }
    if (contactValue) {
      setContactVisible(true);
      return;
    }
    setContactLoading(true);
    setContactError(null);
    try {
      const profileWithContact = await backend.getPublicProfileWithContact(
        ad.creatorPrincipal.toText()
      );
      setContactValue({
        phoneNumber: (_a2 = profileWithContact.phoneNumber) == null ? void 0 : _a2[0],
        telegram: (_b2 = profileWithContact.telegram) == null ? void 0 : _b2[0],
        instagram: (_c2 = profileWithContact.instagram) == null ? void 0 : _c2[0]
      });
      setContactVisible(true);
    } catch {
      setContactError(t("adDetail.contactFetchError"));
    } finally {
      setContactLoading(false);
    }
  };
  if (isLoading) return /* @__PURE__ */ jsxRuntimeExports.jsx(AdDetailSkeleton, {});
  if (isError || !ad) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "ad_detail.error_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "😕" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: t("adDetail.notFound") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-neutral",
              onClick: () => navigate({ to: "/" }),
              "data-ocid": "ad_detail.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
                t("adDetail.backToFeed")
              ]
            }
          )
        ]
      }
    );
  }
  if (enumLabel(ad.status) !== "published") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "ad_detail.not_published_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "🔒" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: t("adDetail.notPublished") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-neutral",
              onClick: () => navigate({ to: "/" }),
              "data-ocid": "ad_detail.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
                t("adDetail.backToFeed")
              ]
            }
          )
        ]
      }
    );
  }
  const isOwner = isAuthenticated && principal === ad.creatorPrincipal.toText();
  const creator = ad.creatorProfile;
  const creatorPhotos = (creator == null ? void 0 : creator.photos) ?? [];
  const avatarUrl = getProfileAvatarUrl(creator);
  const city = (_c = ad.city) == null ? void 0 : _c.trim();
  const address = (_d = ad.address) == null ? void 0 : _d.trim();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-3xl mx-auto px-4 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "btn btn-ghost btn-sm gap-2",
        onClick: () => navigate({ to: "/" }),
        "data-ocid": "ad_detail.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
          t("adDetail.backToFeed")
        ]
      }
    ),
    ad.photos && ad.photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "ad_detail.photos_gallery",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
          ad.photos.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-2", children: ad.photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              className: `aspect-square rounded-lg overflow-hidden ring-2 transition-all ${activeAdPhotoIdx === idx ? "ring-primary" : "ring-transparent hover:ring-primary/50"}`,
              onClick: () => setActiveAdPhotoIdx(idx),
              "data-ocid": `ad_detail.ad_photo.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: photo.blob.getDirectURL(),
                  alt: `${ad.eventName} ${idx + 1}`,
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              )
            },
            idx
          )) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "img",
            {
              src: ad.photos[activeAdPhotoIdx].blob.getDirectURL(),
              alt: `${ad.eventName} - ${activeAdPhotoIdx + 1}`,
              className: "w-full max-h-80 object-contain bg-base-200",
              loading: "lazy"
            }
          ) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-base-100 shadow-lg", "data-ocid": "ad_detail.card", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold break-words flex-1", children: ad.eventName }),
        isOwner && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-sm btn-neutral btn-outline gap-1",
              onClick: () => navigate({ to: "/create-ad", search: { edit: id } }),
              "data-ocid": "ad_detail.edit_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SquarePen, { size: 14 }),
                t("common.edit")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-sm btn-outline btn-error gap-1",
              onClick: () => setShowDeleteModal(true),
              "data-ocid": "ad_detail.delete_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                t("common.delete")
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-primary badge-lg gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(EventTypeIcon, { eventType: ad.eventType, className: "w-3.5 h-3.5" }),
          t(`eventType.${enumLabel(ad.eventType)}`)
        ] }),
        ad.meetType === "online" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-accent badge-lg gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 12 }),
          t("meetType.online")
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          ad.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-secondary badge-lg gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
            ad.city
          ] }),
          ad.address && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-secondary badge-lg gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 12 }),
            ad.address
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-lg gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 12 }),
          t(`companionSex.${enumLabel(ad.expectedCompanionSex)}`)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-lg gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Wallet, { size: 12 }),
          t(`createAd.howPays.${ad.howPaysForEvent}`)
        ] })
      ] }),
      ad.publishedAt && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-sm text-base-content/60 flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 14 }),
        t("adDetail.publishedAt"),
        ": ",
        formatDate(ad.publishedAt)
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "ad_detail.location_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "card-title text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 16 }),
            t("adDetail.location")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                t("meetType.label"),
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: ad.meetType === "online" ? t("meetType.online") : t("meetType.inPerson") })
            ] }),
            city && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                t("createAd.city"),
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: city })
            ] }),
            address && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-x-2 gap-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", children: [
                t("adDetail.address"),
                ":"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: address })
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card bg-base-100 shadow-sm", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title text-lg", children: t("adDetail.description") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "whitespace-pre-wrap text-base-content/80", children: ad.description })
    ] }) }),
    ad.eventLink && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "ad_detail.link_preview",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "card-title text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 16 }),
            t("adDetail.eventLink")
          ] }),
          ad.linkPreview ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: ad.eventLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex gap-3 rounded-xl border border-base-300 hover:border-primary transition-colors overflow-hidden",
              children: [
                ad.linkPreview.image && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: ad.linkPreview.image,
                    alt: ad.linkPreview.title ?? "",
                    className: "w-24 h-24 object-cover shrink-0",
                    loading: "lazy",
                    referrerPolicy: "no-referrer",
                    onError: (e) => {
                      e.target.style.display = "none";
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-3 min-w-0", children: [
                  ad.linkPreview.title && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold truncate", children: ad.linkPreview.title }),
                  ad.linkPreview.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/60 line-clamp-2", children: ad.linkPreview.description }),
                  ad.linkPreview.domain && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-base-content/40 mt-1", children: ad.linkPreview.domain })
                ] })
              ]
            }
          ) : /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "a",
            {
              href: ad.eventLink,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "flex items-center gap-2 text-primary hover:underline break-all",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 14 }),
                extractDomain(ad.eventLink)
              ]
            }
          )
        ] })
      }
    ),
    creator && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "ad_detail.creator_card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "card-title text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 16 }),
            t("adDetail.aboutCreator")
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: avatarUrl,
                alt: creator.fullName,
                className: "w-20 h-20 rounded-full object-cover shrink-0 ring ring-primary ring-offset-2",
                loading: "lazy"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg break-words", children: creator.fullName }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline", children: t(`sex.${enumLabel(creator.sex)}`) }) }),
              creator.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/70 text-sm whitespace-pre-wrap", children: creator.bio }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: `btn btn-neutral btn-sm btn-square${!isAuthenticated ? " opacity-50 cursor-not-allowed" : ""}`,
                    onClick: () => {
                      if (isAuthenticated) profileLikeMutation.mutate();
                    },
                    disabled: !isAuthenticated || profileLikeMutation.isPending,
                    title: isProfileLiked ? t("likes.unlikeButton") : t("likes.likeButton"),
                    "data-ocid": "ad_detail.creator_like_button",
                    children: profileLikeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Heart,
                      {
                        size: 16,
                        style: isProfileLiked ? { fill: "currentColor" } : {}
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: Number(profileLikeCount) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                creator.age !== void 0 && creator.age !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline", children: [
                  Number(creator.age),
                  " ",
                  t("common.yearsOld")
                ] }),
                creator.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                  creator.city
                ] }),
                creator.language && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline", children: creator.language })
              ] })
            ] })
          ] }),
          creatorPhotos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: creatorPhotos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-lg overflow-hidden shrink-0",
              "data-ocid": `ad_detail.creator_thumbnail.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: photo.blob.getDirectURL(),
                  alt: `${creator.fullName} ${idx + 1}`,
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              )
            },
            idx
          )) }),
          creatorPhotos.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-2", children: t("adDetail.photos") }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: creatorPhotos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: `aspect-square rounded-lg overflow-hidden ring-2 transition-all ${activePhotoIdx === idx ? "ring-primary" : "ring-transparent hover:ring-primary/50"}`,
                onClick: () => setActivePhotoIdx(idx),
                "data-ocid": `ad_detail.photo.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "img",
                  {
                    src: photo.blob.getDirectURL(),
                    alt: `${creator.fullName} ${idx + 1}`,
                    className: "w-full h-full object-cover",
                    loading: "lazy"
                  }
                )
              },
              idx
            )) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-3 rounded-xl overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: creatorPhotos[activePhotoIdx].blob.getDirectURL(),
                alt: `${creator.fullName} - ${activePhotoIdx + 1}`,
                className: "w-full max-h-80 object-contain bg-base-200",
                loading: "lazy"
              }
            ) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "divider" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", "data-ocid": "ad_detail.contact_section", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Heart, { size: 14, className: "text-primary" }),
              t("adDetail.contact")
            ] }),
            (creator == null ? void 0 : creator.hideContactsInAds) === true ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-70", children: t("adDetail.contactHidden") }) : contactVisible && contactValue ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                contactValue.phoneNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { className: "w-4 h-4 opacity-60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: contactValue.phoneNumber })
                ] }),
                contactValue.telegram && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "w-4 h-4 opacity-60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: contactValue.telegram })
                ] }),
                contactValue.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { className: "w-4 h-4 opacity-60" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-sm", children: contactValue.instagram })
                ] }),
                !contactValue.phoneNumber && !contactValue.telegram && !contactValue.instagram && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm opacity-70", children: t("adDetail.contactUnavailable") })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-ghost btn-xs gap-1",
                  onClick: () => setContactVisible(false),
                  "data-ocid": "ad_detail.hide_contact_button",
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(EyeOff, { size: 14 }),
                    t("adDetail.hide")
                  ]
                }
              )
            ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
              !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/60", children: t("adDetail.loginToSeeContact") }),
              contactError && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  className: "text-sm text-error",
                  "data-ocid": "ad_detail.contact_error",
                  children: contactError
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  className: "btn btn-neutral btn-sm gap-2 w-fit",
                  onClick: handleRevealContact,
                  disabled: contactLoading,
                  "data-ocid": "ad_detail.show_contact_button",
                  children: [
                    contactLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 14 }),
                    isAuthenticated ? t("adDetail.showContact") : t("adDetail.loginToContact")
                  ]
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    isOwner && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "ad_detail.interested_users_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "card-title text-lg", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { size: 16 }),
            t("joinRequests.interestedUsers")
          ] }),
          joinRequestsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-md" }) }) : !joinRequests || joinRequests.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center py-6 text-base-content/50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: t("joinRequests.noInterestedUsers") }) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: joinRequests.map((item, idx) => {
            const req = item.request;
            const profile = item.profile;
            const reqAvatarUrl = getProfileAvatarUrl(profile);
            const reqAge = (profile == null ? void 0 : profile.dateOfBirth) != null ? Math.floor(
              (Date.now() - Number(profile.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1e3)
            ) : null;
            const reqDate = req.createdAt ? new Date(
              Number(req.createdAt) / 1e6
            ).toLocaleDateString() : null;
            const requesterPrincipal = req.requesterPrincipal.toText();
            const viewRequesterProfile = () => navigate({
              to: "/user/$principal",
              params: { principal: requesterPrincipal }
            });
            return /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "card bg-base-200 shadow-md",
                "data-ocid": `ad_detail.interested_user.${idx + 1}`,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-body p-4 gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 items-start", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      className: "w-14 h-14 rounded-full bg-base-300 overflow-hidden cursor-pointer border-0 p-0",
                      onClick: viewRequesterProfile,
                      "aria-label": t("feed.viewUser"),
                      "data-ocid": `ad_detail.interested_user.${idx + 1}.avatar_button`,
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "img",
                        {
                          src: reqAvatarUrl,
                          alt: (profile == null ? void 0 : profile.fullName) ?? "",
                          className: "w-full h-full object-cover hover:opacity-80 transition-opacity",
                          loading: "lazy"
                        }
                      )
                    }
                  ) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold text-lg break-words", children: (profile == null ? void 0 : profile.fullName) ?? t("common.unknown") }),
                    (profile == null ? void 0 : profile.bio) && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-base-content/70 line-clamp-2", children: profile.bio }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
                      (profile == null ? void 0 : profile.sex) && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline badge-sm", children: t(`sex.${profile.sex}`) }),
                      reqAge != null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-sm", children: [
                        reqAge,
                        " ",
                        t("common.yearsOld")
                      ] }),
                      (profile == null ? void 0 : profile.city) && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline badge-sm gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                        profile.city
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-0.5 text-sm text-base-content/70", children: [
                      (profile == null ? void 0 : profile.phoneNumber) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Phone, { size: 12 }),
                        profile.phoneNumber
                      ] }),
                      (profile == null ? void 0 : profile.telegram) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { size: 12 }),
                        profile.telegram
                      ] }),
                      (profile == null ? void 0 : profile.instagram) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(AtSign, { size: 12 }),
                        profile.instagram
                      ] })
                    ] }),
                    reqDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 text-xs text-base-content/50", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { size: 12 }),
                      t("joinRequests.joinedOn"),
                      ": ",
                      reqDate
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "button",
                      {
                        type: "button",
                        className: "btn btn-neutral btn-sm gap-2",
                        onClick: viewRequesterProfile,
                        "data-ocid": `ad_detail.interested_user.${idx + 1}.view_user_button`,
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 14 }),
                          t("feed.viewUser")
                        ]
                      }
                    ) })
                  ] })
                ] }) })
              },
              req.id
            );
          }) })
        ] })
      }
    ),
    showDeleteModal && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "dialog",
      {
        className: "modal modal-open",
        "data-ocid": "ad_detail.dialog",
        onClick: (e) => {
          if (e.target === e.currentTarget) setShowDeleteModal(false);
        },
        onKeyDown: (e) => {
          if (e.key === "Escape") setShowDeleteModal(false);
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-box", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-bold text-lg", children: t("adDetail.deleteConfirmTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-base-content/70", children: t("adDetail.deleteConfirmBody") }),
          deleteMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-error text-sm mb-2", children: t("adDetail.deleteFailed") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "modal-action", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                className: "btn btn-ghost",
                onClick: () => setShowDeleteModal(false),
                "data-ocid": "ad_detail.cancel_button",
                children: t("common.cancel")
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                className: "btn btn-error gap-2",
                onClick: () => deleteMutation.mutate(),
                disabled: deleteMutation.isPending,
                "data-ocid": "ad_detail.confirm_button",
                children: [
                  deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-xs" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { size: 14 }),
                  t("common.delete")
                ]
              }
            )
          ] })
        ] })
      }
    )
  ] });
}
export {
  AdDetailPage as default
};
