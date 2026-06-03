import { u as useTranslation, j as jsxRuntimeExports, a7 as LifeBuoy } from "./index-Dw-TU7ma.js";
const OPENCHAT_COMMUNITY_URL = "https://oc.app/community/asd5m-cyaaa-aaaac-bfdla-cai/channel/1918497539";
function SupportPage() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "max-w-xl mx-auto px-4 py-10 space-y-6",
      "data-ocid": "support.page",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-3xl font-bold flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(LifeBuoy, { className: "w-7 h-7" }),
          t("support.title")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "a",
          {
            href: OPENCHAT_COMMUNITY_URL,
            className: "btn btn-neutral gap-2",
            "data-ocid": "support.open_openchat_button",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/assets/openchat-icon.png",
                  alt: "",
                  className: "w-5 h-5 rounded"
                }
              ),
              t("support.openCommunity")
            ]
          }
        )
      ]
    }
  );
}
export {
  SupportPage as default
};
