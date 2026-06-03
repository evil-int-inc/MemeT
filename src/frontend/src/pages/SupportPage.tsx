import { LifeBuoy } from "lucide-react";
import { useTranslation } from "react-i18next";

const OPENCHAT_COMMUNITY_URL =
  "https://oc.app/community/asd5m-cyaaa-aaaac-bfdla-cai/channel/1918497539";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <div
      className="max-w-xl mx-auto px-4 py-10 space-y-6"
      data-ocid="support.page"
    >
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <LifeBuoy className="w-7 h-7" />
        {t("support.title")}
      </h1>

      <a
        href={OPENCHAT_COMMUNITY_URL}
        target="_blank"
        rel="noreferrer"
        className="btn btn-neutral gap-2"
        data-ocid="support.open_openchat_button"
      >
        <img
          src="/assets/openchat-icon.png"
          alt=""
          className="w-5 h-5 rounded"
        />
        {t("support.openCommunity")}
      </a>
    </div>
  );
}
