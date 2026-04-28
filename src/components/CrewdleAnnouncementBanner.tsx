import { useEffect, useState } from "react";
import { Sparkles, X, ArrowRight } from "lucide-react";

const STORAGE_KEY = "crewdle-cdo-banner-dismissed-v1";

const CrewdleAnnouncementBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) setVisible(true);
  }, []);

  const handleDismiss = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="relative w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white animate-gradient-shift">
      <a
        href="https://crewdle.com"
        target="_blank"
        rel="noopener noreferrer"
        className="container max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 px-10 py-2 text-xs sm:text-sm font-medium hover:opacity-95 transition-opacity"
      >
        <Sparkles className="w-4 h-4 flex-shrink-0 animate-pulse" />
        <span className="hidden sm:inline font-semibold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded">
          New Role · May 2026
        </span>
        <span className="truncate">
          Jonathan Bélisle joins <strong>Crewdle</strong> as Fractional Chief Design Officer
        </span>
        <span className="hidden md:inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
          Learn more <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </a>
      <button
        onClick={handleDismiss}
        aria-label="Dismiss announcement"
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default CrewdleAnnouncementBanner;
