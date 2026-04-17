import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, X, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const STORAGE_KEY = "paracosm-book-banner-dismissed";

const BookAnnouncementBanner = () => {
  const { t } = useLanguage();
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
    <div className="relative w-full bg-gradient-to-r from-primary via-purple-600 to-pink-600 text-white">
      <Link
        to="/book"
        className="container max-w-7xl mx-auto flex items-center justify-center gap-2 sm:gap-3 px-10 py-2 text-xs sm:text-sm font-medium hover:opacity-95 transition-opacity"
      >
        <BookOpen className="w-4 h-4 flex-shrink-0" />
        <span className="hidden sm:inline font-semibold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded">
          {t("book.banner_label")}
        </span>
        <span className="truncate">{t("book.banner_text")}</span>
        <span className="hidden md:inline-flex items-center gap-1 font-semibold underline-offset-2 hover:underline">
          {t("book.banner_cta")} <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </Link>
      <button
        onClick={handleDismiss}
        aria-label={t("book.banner_dismiss")}
        className="absolute top-1/2 right-2 sm:right-4 -translate-y-1/2 p-1 rounded hover:bg-white/20 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default BookAnnouncementBanner;
