
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Zap, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const CoachingApproachSection = () => {
  const { t } = useLanguage();

  const approaches = [
    {
      icon: Users,
      title: t("coaching_approach.approaches.individual.title"),
      description: t("coaching_approach.approaches.individual.description"),
      focus: t("coaching_approach.approaches.individual.focus")
    },
    {
      icon: Target,
      title: t("coaching_approach.approaches.systems.title"),
      description: t("coaching_approach.approaches.systems.description"),
      focus: t("coaching_approach.approaches.systems.focus")
    },
    {
      icon: Zap,
      title: t("coaching_approach.approaches.alignment.title"),
      description: t("coaching_approach.approaches.alignment.description"),
      focus: t("coaching_approach.approaches.alignment.focus")
    },
    {
      icon: Heart,
      title: t("coaching_approach.approaches.embodied.title"),
      description: t("coaching_approach.approaches.embodied.description"),
      focus: t("coaching_approach.approaches.embodied.focus")
    }
  ];

  return (
    <section id="coaching-approach" className="py-20 px-4 bg-slate-100 dark:bg-slate-800/50">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("coaching_approach.section_title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            {t("coaching_approach.section_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {approaches.map((approach, index) => (
            <Card key={index} className="bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <approach.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{approach.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-slate-600 dark:text-slate-300">
                  {approach.description}
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                    {t("coaching_approach.focus_label")}: {approach.focus}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Coaching Philosophy */}
        <div className="bg-white dark:bg-slate-800 rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-center mb-6">{t("coaching_approach.philosophy.title")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">{t("coaching_approach.philosophy.emergence.title")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("coaching_approach.philosophy.emergence.description")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">{t("coaching_approach.philosophy.coherence.title")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("coaching_approach.philosophy.coherence.description")}
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-rose-600 dark:text-rose-400 mb-2">{t("coaching_approach.philosophy.learning.title")}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                {t("coaching_approach.philosophy.learning.description")}
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <h3 className="text-xl font-bold mb-4">{t("coaching_approach.cta.title")}</h3>
          <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
            {t("coaching_approach.cta.description")}
          </p>
          <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 px-8 py-3">
              {t("coaching_approach.cta.button")}
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CoachingApproachSection;
