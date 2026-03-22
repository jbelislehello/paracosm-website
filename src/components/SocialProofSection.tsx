import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const clients = [
  "Behaviour Interactive", "Canadian Museum for Human Rights", "OACIQ", "INIS",
  "NFB / ONF", "Prodago", "Sid Lee", "FoST", "Loto-Québec", "Quartier de l'Innovation"
];

const venues = [
  "NFB", "Annenberg", "Banff Centre", "Infopresse", "Phi Centre",
  "SXSW", "TEDx", "TIFF", "Telefilm", "Creative Mornings"
];

const BadgeItem: React.FC<{ name: string }> = ({ name }) => (
  <div className="px-4 py-2 bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
    {name}
  </div>
);

const SocialProofSection: React.FC = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 to-purple-50/30 dark:from-slate-900 dark:to-purple-950/20">
      <div className="container mx-auto max-w-5xl text-center">
        <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-rose-600 bg-clip-text text-transparent mb-10 italic">
          {t('landing.social_tagline')}
        </p>

        <div className="mb-8">
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">{t('landing.social_trusted')}</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {clients.map((c) => <BadgeItem key={c} name={c} />)}
          </div>
        </div>

        <div>
          <h3 className="text-xs uppercase tracking-widest text-muted-foreground mb-4 font-semibold">{t('landing.social_keynotes')}</h3>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {venues.map((v) => <BadgeItem key={v} name={v} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialProofSection;
