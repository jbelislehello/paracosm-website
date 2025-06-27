
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Compass, Brain, Users, Mountain, Sparkles, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ParacosmRetreatSection = () => {
  const { t } = useLanguage();

  const retreatDays = [
    {
      day: 1,
      title: t("retreat.day_1.title"),
      subtitle: t("retreat.day_1.subtitle"),
      description: t("retreat.day_1.description"),
      icon: Mountain,
      color: "from-green-500 to-emerald-600",
      activities: [
        t("retreat.day_1.activities.0"),
        t("retreat.day_1.activities.1"),
        t("retreat.day_1.activities.2"),
        t("retreat.day_1.activities.3")
      ]
    },
    {
      day: 2,
      title: t("retreat.day_2.title"),
      subtitle: t("retreat.day_2.subtitle"),
      description: t("retreat.day_2.description"),
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      activities: [
        t("retreat.day_2.activities.0"),
        t("retreat.day_2.activities.1"),
        t("retreat.day_2.activities.2"),
        t("retreat.day_2.activities.3")
      ]
    },
    {
      day: 3,
      title: t("retreat.day_3.title"),
      subtitle: t("retreat.day_3.subtitle"),
      description: t("retreat.day_3.description"),
      icon: Users,
      color: "from-purple-500 to-rose-600",
      activities: [
        t("retreat.day_3.activities.0"),
        t("retreat.day_3.activities.1"),
        t("retreat.day_3.activities.2"),
        t("retreat.day_3.activities.3")
      ]
    }
  ];

  return (
    <section id="paracosm-retreat" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h2 className="text-3xl md:text-4xl font-bold">
              {t("retreat.section_title")}
            </h2>
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto mb-8">
            {t("retreat.section_description")}
          </p>
          
          {/* Key Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <Compass className="w-8 h-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t("retreat.highlights.immersive_storytelling")}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t("retreat.highlights.immersive_storytelling_desc")}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <Brain className="w-8 h-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t("retreat.highlights.mathematical_creativity")}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t("retreat.highlights.mathematical_creativity_desc")}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">{t("retreat.highlights.calm_magic_framework")}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">{t("retreat.highlights.calm_magic_framework_desc")}</p>
            </div>
          </div>
        </div>

        {/* 3-Day Program */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {retreatDays.map((day, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800 shadow-xl hover:shadow-2xl transition-all duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${day.color} flex items-center justify-center mb-4 relative`}>
                  <day.icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 bg-white text-slate-800 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {day.day}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold mb-2">
                  {day.title}
                </CardTitle>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {day.subtitle}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {day.description}
                </p>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">{t("retreat.activities_label")}:</h4>
                  <ul className="space-y-1">
                    {day.activities.map((activity, activityIndex) => (
                      <li key={activityIndex} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Audience & Outcomes */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-8 border border-purple-200 dark:border-purple-800 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                {t("retreat.audience.title")}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("retreat.audience.description")}
              </p>
              <ul className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></span>
                    {t(`retreat.audience.points.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                {t("retreat.outcomes.title")}
              </h3>
              <p className="text-slate-700 dark:text-slate-300 mb-4">
                {t("retreat.outcomes.description")}
              </p>
              <ul className="space-y-2">
                {[0, 1, 2].map((i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></span>
                    {t(`retreat.outcomes.points.${i}`)}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">{t("retreat.cta.title")}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            {t("retreat.cta.description")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 px-8 py-3 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {t("retreat.cta.book_consultation")}
              </Button>
            </a>
            <Button variant="outline" className="px-8 py-3">
              {t("retreat.cta.download_program")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParacosmRetreatSection;
