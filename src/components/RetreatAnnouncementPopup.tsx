
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Calendar, Sparkles, Mountain, Brain, Users } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RetreatAnnouncementPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const RetreatAnnouncementPopup: React.FC<RetreatAnnouncementPopupProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const retreatHighlights = [
    {
      icon: Mountain,
      title: t("retreat.highlights.immersive_storytelling"),
      description: t("retreat.highlights.immersive_storytelling_desc"),
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Brain,
      title: t("retreat.highlights.mathematical_creativity"),
      description: t("retreat.highlights.mathematical_creativity_desc"),
      color: "from-blue-500 to-purple-600"
    },
    {
      icon: Users,
      title: t("retreat.highlights.calm_magic_framework"),
      description: t("retreat.highlights.calm_magic_framework_desc"),
      color: "from-purple-500 to-rose-600"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{t("retreat.section_title")}</DialogTitle>
        </DialogHeader>
        <div className="relative bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="p-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-600" />
              <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                {t("retreat.section_title")}
              </h2>
              <Sparkles className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              {t("retreat.section_description")}
            </p>
          </div>

          {/* Highlights Grid */}
          <div className="px-8 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {retreatHighlights.map((highlight, index) => (
                <Card key={index} className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader className="text-center pb-3">
                    <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${highlight.color} flex items-center justify-center mb-2`}>
                      <highlight.icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick 3-Day Overview */}
            <div className="bg-white/50 dark:bg-slate-800/50 rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold text-center mb-4">3-Day Journey</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <h4 className="font-semibold text-sm">{t("retreat.day_1.title")}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t("retreat.day_1.subtitle")}</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <h4 className="font-semibold text-sm">{t("retreat.day_2.title")}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t("retreat.day_2.subtitle")}</p>
                </div>
                <div>
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <h4 className="font-semibold text-sm">{t("retreat.day_3.title")}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t("retreat.day_3.subtitle")}</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 px-6 py-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {t("retreat.cta.book_consultation")}
                  </Button>
                </a>
                <Button variant="outline" className="px-6 py-2" onClick={onClose}>
                  Learn More Later
                </Button>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {t("retreat.cta.description")}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RetreatAnnouncementPopup;
