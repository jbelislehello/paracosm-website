import { useEffect, useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const DISMISS_KEY = "summer_deal_banner_dismissed_v1";

export default function SummerDealBanner() {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(localStorage.getItem(DISMISS_KEY) !== "1");
  }, []);

  if (!visible) return null;

  const scrollToOffer = (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById("summer-deal")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative z-40 w-full bg-gradient-to-r from-[hsl(var(--bloom-magenta))] via-fuchsia-600 to-[hsl(var(--bloom-amber))] text-white">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 flex-none" />
          <span className="font-vhs uppercase tracking-wider text-[11px] hidden sm:inline">
            {t("summer_deal.banner.tag")}
          </span>
          <span className="truncate">{t("summer_deal.banner.message")}</span>
        </div>
        <a
          href="#summer-deal"
          onClick={scrollToOffer}
          className="flex-none rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-white transition-colors"
        >
          {t("summer_deal.banner.cta")}
        </a>
        <button
          type="button"
          aria-label={t("summer_deal.banner.dismiss")}
          onClick={() => {
            localStorage.setItem(DISMISS_KEY, "1");
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
