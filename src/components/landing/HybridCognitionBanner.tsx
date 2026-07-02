import { useEffect, useState } from "react";
import { X, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";

const DISMISS_KEY = "hybrid_cognition_banner_dismissed_v1";
const EVENT_URL =
  "https://prisme.one/inscription-evenement-ia?utm_source=meta&utm_medium=paid&utm_campaign=event2607&utm_content=Batch+1+%7C+H4+%7C+B1&utm_term=CreaTest++(B1)+%7C+Prosumer+IA+%7C+Broad+%7C+Sign-up&fbclid=IwZnRzaASzYs9wZG9mA2ZkaWQWUJwIBbA_CG_VSa-LTA5tgrfpkUCb6GV4dG4DYWVtATAAYWRpZAGrNU5ecO6cc3J0YwZhcHBfaWQKNjYyODU2ODM3OQABHr93dd8IgN3JdGK-4Ykiq6CrP-ZEZQippMWhuuPWp6L42__yGatw5d4Tiz6G_aem_m3DQB79EpLQK3KYMw-xNNA&utm_id=120248415918550748";

export default function HybridCognitionBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== "1");
  }, []);

  if (!visible) return null;

  return (
    <div className="relative z-40 w-full bg-gradient-to-r from-indigo-900 via-violet-800 to-cyan-700 text-white">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Brain className="h-4 w-4 flex-none" />
          <span className="font-vhs uppercase tracking-wider text-[11px] hidden sm:inline">
            {t("hybrid_cognition.tag")}
          </span>
          <span className="truncate">{t("hybrid_cognition.message")}</span>
        </div>
        <a
          href={EVENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("hybrid_cognition_cta_click", { location: "top_banner" })
          }
          className="flex-none rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-white transition-colors"
        >
          {t("hybrid_cognition.cta")}
        </a>
        <button
          type="button"
          aria-label={t("hybrid_cognition.dismiss")}
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
            trackEvent("hybrid_cognition_banner_dismiss", {});
            setVisible(false);
          }}
          className="flex-none rounded-full p-1 hover:bg-white/20 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
