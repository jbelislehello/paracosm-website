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
    <div className="relative z-40 w-full border-b border-border/60 bg-[hsl(35_45%_96%)] text-foreground">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Brain className="h-4 w-4 flex-none text-[hsl(15_75%_45%)]" />
          <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[hsl(15_75%_45%)] hidden sm:inline">
            {t("hybrid_cognition.tag")}
          </span>
          <span className="truncate opacity-80">{t("hybrid_cognition.message")}</span>
        </div>
        <Link
          to="/cognition-hybride"
          onClick={() =>
            trackEvent("hybrid_cognition_cta_click", { location: "top_banner" })
          }
          className="flex-none rounded-full bg-foreground text-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
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
          className="flex-none rounded-full p-1 hover:bg-current/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
