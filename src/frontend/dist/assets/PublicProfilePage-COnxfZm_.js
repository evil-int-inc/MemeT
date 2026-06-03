import { u as useTranslation, b as useNavigate, i as useParams, c as useBackend, e as useQuery, a as useAuth, d as useQueryClient, f as useMutation, j as jsxRuntimeExports, g as getProfileAvatarUrl, H as Heart, p as MapPin, G as Globe } from "./index-Dw-TU7ma.js";
import { A as ArrowLeft } from "./arrow-left-CFvIavVV.js";
function calcAge(dob) {
  if (dob == null) return null;
  return Math.floor(
    (Date.now() - Number(dob)) / (365.25 * 24 * 60 * 60 * 1e3)
  );
}
function PublicProfilePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { principal } = useParams({ strict: false });
  const backend = useBackend();
  const {
    data: profile,
    isLoading,
    isError
  } = useQuery({
    queryKey: ["publicProfile", principal],
    queryFn: () => backend.getPublicProfile(principal),
    enabled: !!principal
  });
  const { isAuthenticated, identity } = useAuth();
  const queryClient = useQueryClient();
  const profilePrincipal = profile == null ? void 0 : profile.principal;
  const { data: isProfileLiked } = useQuery({
    queryKey: [
      "profileLike",
      (profilePrincipal == null ? void 0 : profilePrincipal.toText()) ?? "",
      isAuthenticated
    ],
    queryFn: () => backend.isProfileLikedByMe(profilePrincipal),
    enabled: isAuthenticated && !!profilePrincipal
  });
  const { data: profileLikeCount = 0 } = useQuery({
    queryKey: ["profileLikeCount", (profilePrincipal == null ? void 0 : profilePrincipal.toText()) ?? ""],
    queryFn: () => backend.getProfileLikeCount(profilePrincipal),
    enabled: !!profilePrincipal
  });
  const { data: hasJoinRelationship } = useQuery({
    queryKey: [
      "hasJoinRequestRelationship",
      (identity == null ? void 0 : identity.getPrincipal().toText()) ?? "",
      (profilePrincipal == null ? void 0 : profilePrincipal.toText()) ?? ""
    ],
    queryFn: () => backend.hasJoinRequestRelationship(
      identity.getPrincipal(),
      profilePrincipal
    ),
    enabled: isAuthenticated && !!identity && !!profilePrincipal
  });
  const showContactsDueToJoinRequest = hasJoinRelationship === true;
  const { data: contactProfile } = useQuery({
    queryKey: [
      "publicProfileWithContact",
      principal,
      showContactsDueToJoinRequest
    ],
    queryFn: () => backend.getPublicProfileWithContact(principal),
    enabled: showContactsDueToJoinRequest
  });
  const profileLikeMutation = useMutation({
    mutationFn: async () => {
      if (!profilePrincipal) return;
      if (isProfileLiked) {
        await backend.removeProfileLike(profilePrincipal);
      } else {
        await backend.addProfileLike(profilePrincipal);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["profileLike", profilePrincipal == null ? void 0 : profilePrincipal.toText()]
      });
      queryClient.invalidateQueries({
        queryKey: ["profileLikeCount", profilePrincipal == null ? void 0 : profilePrincipal.toText()]
      });
    }
  });
  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate({ to: "/" });
    }
  };
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "flex items-center justify-center min-h-[60vh]",
        "data-ocid": "public_profile.loading_state",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "loading loading-infinity loading-lg" })
      }
    );
  }
  if (isError || !profile) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center justify-center min-h-[60vh] gap-4",
        "data-ocid": "public_profile.not_found_state",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-6xl", children: "😕" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-2xl font-bold", children: t("profile.publicNotFound") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/60", children: t("profile.publicNotFoundHint") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "btn btn-neutral",
              onClick: handleBack,
              "data-ocid": "public_profile.back_button",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
                t("common.back")
              ]
            }
          )
        ]
      }
    );
  }
  const avatarUrl = getProfileAvatarUrl(profile);
  const age = calcAge(profile.dateOfBirth);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl mx-auto px-4 py-6 space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        className: "btn btn-neutral btn-sm gap-2",
        onClick: handleBack,
        "data-ocid": "public_profile.back_button",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 16 }),
          t("common.back")
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-lg",
        "data-ocid": "public_profile.card",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-bold", children: t("profile.publicTitle") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-5 items-start", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "avatar flex-shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-24 h-24 rounded-full bg-base-300 overflow-hidden ring ring-primary ring-offset-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "img",
              {
                src: avatarUrl,
                alt: profile.fullName,
                className: "w-full h-full object-cover",
                loading: "lazy"
              }
            ) }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0 space-y-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-2xl break-words", children: profile.fullName }),
              profile.username && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-base-content/60 text-sm", children: [
                "@",
                profile.username
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-1", children: profile.sex && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline", children: t(`sex.${profile.sex}`) }) }),
              profile.bio && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pt-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-base-content/80 whitespace-pre-wrap text-sm", children: profile.bio }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    className: `btn btn-neutral btn-sm btn-square${!isAuthenticated ? " opacity-50" : ""}`,
                    onClick: () => {
                      if (isAuthenticated) profileLikeMutation.mutate();
                    },
                    disabled: !isAuthenticated || profileLikeMutation.isPending,
                    title: isProfileLiked ? t("likes.unlikeButton") : t("likes.likeButton"),
                    "data-ocid": "public_profile.like_button",
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
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2 pt-1", children: [
                age !== null && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline", children: [
                  age,
                  " ",
                  t("common.yearsOld")
                ] }),
                profile.city && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-outline gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(MapPin, { size: 10 }),
                  profile.city
                ] }),
                profile.hideContactsInAds && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "badge badge-accent gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Globe, { size: 10 }),
                  t("profile.hideContactsInAds")
                ] }),
                profile.language && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "badge badge-outline", children: profile.language })
              ] })
            ] })
          ] }),
          showContactsDueToJoinRequest && contactProfile && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "pt-2 space-y-1",
              "data-ocid": "public_profile.contacts_section",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold text-base-content/70", children: t("profile.contacts") }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1 text-sm", children: [
                  contactProfile.phoneNumber && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "📞 ",
                    contactProfile.phoneNumber
                  ] }),
                  contactProfile.telegram && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "✈️ ",
                    contactProfile.telegram
                  ] }),
                  contactProfile.instagram && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                    "📸 ",
                    contactProfile.instagram
                  ] })
                ] })
              ]
            }
          ),
          profile.photos && profile.photos.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: profile.photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "w-14 h-14 rounded-lg overflow-hidden shrink-0",
              "data-ocid": `public_profile.thumbnail.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: photo.blob.getDirectURL(),
                  alt: `${profile.fullName} ${idx + 1}`,
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              )
            },
            `${String(photo.size)}-${photo.contentType}-${String(photo.createdAt)}`
          )) })
        ] })
      }
    ),
    profile.photos && profile.photos.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "card bg-base-100 shadow-sm",
        "data-ocid": "public_profile.photos_section",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-body gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "card-title text-base", children: t("profile.photos") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: profile.photos.map((photo, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "aspect-square rounded-lg overflow-hidden",
              "data-ocid": `public_profile.photo.${idx + 1}`,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: photo.blob.getDirectURL(),
                  alt: `${profile.fullName} ${idx + 1}`,
                  className: "w-full h-full object-cover",
                  loading: "lazy"
                }
              )
            },
            `${String(photo.size)}-${photo.contentType}-${String(photo.createdAt)}`
          )) })
        ] })
      }
    )
  ] });
}
export {
  PublicProfilePage as default
};
