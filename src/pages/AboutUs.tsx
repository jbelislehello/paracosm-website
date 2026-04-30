import React from 'react';
import logoParacosm from "@/assets/logo-paracosm.jpeg";
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Footer';
import { usePageSeo } from '@/hooks/usePageSeo';

const AboutUs = () => {
  const { t } = useLanguage();

  usePageSeo({
    title: t("page_titles.about_us"),
    description: "Meet Paracosm — a coaching practice for executives and innovators building Learning Organizations through AI systems mastery and relational intelligence.",
    path: "/about-us",
  });

  const timelineEvents = [
    {
      year: '1997-2003',
      titleKey: 'about.timeline.1997_2003.title',
      descriptionKey: 'about.timeline.1997_2003.description',
      caseStudy: null,
      color: 'bg-blue-500'
    },
    {
      year: '2004-2010',
      titleKey: 'about.timeline.2004_2010.title',
      descriptionKey: 'about.timeline.2004_2010.description',
      caseStudy: null,
      color: 'bg-indigo-500'
    },
    {
      year: '2010-2015',
      titleKey: 'about.timeline.2010_2015.title',
      descriptionKey: 'about.timeline.2010_2015.description',
      caseStudy: { id: 'wuxia-the-fox', title: 'Wuxia the Fox' },
      color: 'bg-violet-500'
    },
    {
      year: '2012-2017',
      titleKey: 'about.timeline.2012_2017.title',
      descriptionKey: 'about.timeline.2012_2017.description',
      caseStudy: { id: 'banff-residence', title: 'Banff Emergence Lab' },
      color: 'bg-purple-500'
    },
    {
      year: '2014-2016',
      titleKey: 'about.timeline.2014_2016.title',
      descriptionKey: 'about.timeline.2014_2016.description',
      caseStudy: { id: 'simulateur-genial', title: 'Simulateur Génial!' },
      color: 'bg-fuchsia-500'
    },
    {
      year: '2017-2019',
      titleKey: 'about.timeline.2017_2019.title',
      descriptionKey: 'about.timeline.2017_2019.description',
      caseStudy: { id: 'machine-bienveillance', title: 'La Machine à bienveillance' },
      color: 'bg-pink-500'
    },
    {
      year: '2019-2021',
      titleKey: 'about.timeline.2019_2021.title',
      descriptionKey: 'about.timeline.2019_2021.description',
      caseStudy: null,
      color: 'bg-rose-500'
    },
    {
      year: '2021-2024',
      titleKey: 'about.timeline.2021_2024.title',
      descriptionKey: 'about.timeline.2021_2024.description',
      caseStudy: { id: 'oaciq-elise', title: 'Élise - Assistant virtuel OACIQ' },
      color: 'bg-amber-500'
    },
    {
      year: '2024-Present',
      titleKey: 'about.timeline.2024_present.title',
      descriptionKey: 'about.timeline.2024_present.description',
      caseStudy: { id: 'codemagic-methodology', title: 'CodeMagic Methodology' },
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoParacosm} alt="Paracosm" className="bg-white rounded-lg p-1 w-8 h-8 object-contain" />
              <span className="font-bold text-slate-900 dark:text-white text-sm">Paracosm</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link to="/agentic-ux#ai-leadership" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.ai_leadership")}</Link>
            <Link to="/calm-magic-assistant" className="text-sm font-medium hover:text-purple-600 transition-colors">{t("navigation.relational_innovation")}</Link>
            <LanguageSwitcher />
          </nav>
          <Link to="/agentic-ux">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300">
              {t("navigation.ai_leadership")}
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            {t("about.page_title")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {t("about.subtitle")}
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p1")}
            </p>

            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p2")}
            </p>

            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p3")}
            </p>

            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p4")}
            </p>

            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p5")}
            </p>

            <p className="text-lg leading-relaxed mb-6">
              {t("about.intro_p6")}
            </p>

            <p className="text-lg leading-relaxed mb-8">
              {t("about.intro_p7")}
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800 mb-12">
              <p className="text-xl font-medium text-center italic">
                {t("about.conclusion")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Timeline */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t("about.journey_title")}</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              {t("about.journey_subtitle")}
            </p>
          </div>
          
          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex items-start gap-6 group">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-4 h-4 rounded-full ${event.color} group-hover:scale-110 transition-transform duration-200`}></div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-0.5 h-16 bg-gradient-to-b from-slate-300 to-transparent dark:from-slate-600 mt-2"></div>
                  )}
                </div>

                {/* Event content */}
                <div className="flex-1 pb-8">
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-lg border border-slate-200 dark:border-slate-700 group-hover:shadow-xl transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full">
                        {event.year}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-slate-100">
                      {t(event.titleKey)}
                    </h3>
                    
                    <p className="text-slate-600 dark:text-slate-300 mb-4">
                      {t(event.descriptionKey)}
                    </p>
                    
                    {event.caseStudy && (
                      <Link 
                        to={`/case-studies#${event.caseStudy.id}`} 
                        className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors"
                      >
                        {t("case_studies.view_details")}: {event.caseStudy.title}
                        <ExternalLink size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">{t("about.cta_title")}</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            {t("about.cta_description")}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/agentic-ux#contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
                {t("about.cta_professional")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/calm-magic-assistant">
              <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
                {t("about.cta_calm_magic")}
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
