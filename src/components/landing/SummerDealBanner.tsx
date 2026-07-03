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
    <div className="relative z-40 w-full border-b border-border/60 bg-[hsl(35_45%_96%)] text-foreground">
      <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-2 text-sm">
        <div className="flex flex-1 items-center gap-2 min-w-0">
          <Sparkles className="h-4 w-4 flex-none text-[hsl(15_75%_45%)]" />
          <span className="uppercase tracking-[0.3em] text-[10px] font-semibold text-[hsl(15_75%_45%)] hidden sm:inline">
            {t("summer_deal.banner.tag")}
          </span>
          <span className="truncate opacity-80">{t("summer_deal.banner.message")}</span>
        </div>
        <a
          href="#summer-deal"
          onClick={scrollToOffer}
          className="flex-none rounded-full bg-foreground text-background px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] hover:opacity-90 transition-opacity"
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
          className="flex-none rounded-full p-1 hover:bg-current/10 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
