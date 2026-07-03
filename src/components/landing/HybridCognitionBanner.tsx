import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Brain } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trackEvent } from "@/lib/analytics";

const DISMISS_KEY = "hybrid_cognition_banner_dismissed_v1";

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
        <Link
          to="/cognition-hybride"
          onClick={() =>
            trackEvent("hybrid_cognition_cta_click", { location: "top_banner" })
          }
          className="flex-none rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-white transition-colors"
        >
          {t("hybrid_cognition.cta")}
        </Link>
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
