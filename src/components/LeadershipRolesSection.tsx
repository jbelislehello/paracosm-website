
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Dna, Bot } from 'lucide-react';
import { Link } from "react-router-dom";
import { useLanguage } from '@/contexts/LanguageContext';

const LeadershipRolesSection = () => {
  const { t } = useLanguage();

  const residenceLevels = [
    {
      icon: Sprout,
      emoji: "🌱",
      title: t("leadership_roles.level_1.title"),
      subtitle: t("leadership_roles.level_1.subtitle"),
      description: t("leadership_roles.level_1.description"),
      details: [
        t("leadership_roles.level_1.details.0"),
        t("leadership_roles.level_1.details.1"),
        t("leadership_roles.level_1.details.2"),
        t("leadership_roles.level_1.details.3")
      ],
      color: "from-green-500 to-emerald-600",
      link: "/agentic-ux"
    },
    {
      icon: Dna,
      emoji: "🧬",
      title: t("leadership_roles.level_2.title"),
      subtitle: t("leadership_roles.level_2.subtitle"),
      description: t("leadership_roles.level_2.description"),
      details: [
        t("leadership_roles.level_2.details.0"),
        t("leadership_roles.level_2.details.1"),
        t("leadership_roles.level_2.details.2"),
        t("leadership_roles.level_2.details.3")
      ],
      color: "from-rose-500 to-purple-600",
      link: "/calm-magic-assistant"
    },
    {
      icon: Bot,
      emoji: "🤖",
      title: t("leadership_roles.level_3.title"),
      subtitle: t("leadership_roles.level_3.subtitle"),
      description: t("leadership_roles.level_3.description"),
      details: [
        t("leadership_roles.level_3.details.0"),
        t("leadership_roles.level_3.details.1"),
        t("leadership_roles.level_3.details.2"),
        t("leadership_roles.level_3.details.3")
      ],
      color: "from-blue-500 to-purple-600",
      link: "/agentic-ux"
    }
  ];

  return (
    <section id="leadership-roles" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("leadership_roles.section_title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            {t("leadership_roles.section_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {residenceLevels.map((level, index) => (
            <Link key={index} to={level.link} className="block group">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl transition-all duration-300 h-full group-hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-4 relative`}>
                    <level.icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-2 -right-2 text-2xl">{level.emoji}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {level.title}
                  </CardTitle>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {level.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {level.description}
                  </p>
                  <ul className="space-y-2">
                    {level.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold text-center mb-4">{t("leadership_roles.integral_journey.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🌱</span>
                {t("leadership_roles.integral_journey.foundations")}
              </h4>
              <p className="text-sm">{t("leadership_roles.integral_journey.foundations_description")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🧬</span>
                {t("leadership_roles.integral_journey.ecosystems")}
              </h4>
              <p className="text-sm">{t("leadership_roles.integral_journey.ecosystems_description")}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🤖</span>
                {t("leadership_roles.integral_journey.systems")}
              </h4>
              <p className="text-sm">{t("leadership_roles.integral_journey.systems_description")}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipRolesSection;
