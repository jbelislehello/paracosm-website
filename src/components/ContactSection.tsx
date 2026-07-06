import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Mail, MessageSquare, Phone, Users, Building2, Zap, Compass, Settings } from 'lucide-react';
import CaseStudyRecommendation from './CaseStudyRecommendation';
import { useLanguage } from '@/contexts/LanguageContext';

const SESSION_KEYS = [
  {
    key: 'glitch',
    icon: Zap,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt',
    gradient: 'from-rose-500 to-red-600',
    bgColor: 'bg-rose-100 dark:bg-rose-900/30',
    textColor: 'text-rose-600',
  },
  {
    key: 'drift',
    icon: Compass,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt',
    gradient: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600',
  },
  {
    key: 'tune',
    icon: Settings,
    link: 'https://app.reclaim.ai/m/jonathan-helloarchitekt',
    gradient: 'from-blue-500 to-cyan-600',
    bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600',
  },
] as const;

const ContactSection = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [selectedClientType, setSelectedClientType] = useState('');

  const getRelevantCaseStudies = (clientType: string) => {
    switch (clientType) {
      case 'ai-leadership':
        return [
          {
            title: 'AI Leadership Framework',
            description: 'Strategic framework for AI governance and implementation',
            caseStudyId: 'ai-framework',
            caseStudyTitle: 'AI Leadership Excellence',
          },
        ];
      case 'team-coaching':
        return [
          {
            title: 'Team Transformation',
            description: 'Building learning-oriented cultures for innovation',
            caseStudyId: 'team-transformation',
            caseStudyTitle: 'Relational Intelligence in Action',
          },
        ];
      case 'executive-coaching':
        return [
          {
            title: 'Executive Development',
            description: 'Building learning organizations for executives',
            caseStudyId: 'executive-coaching',
            caseStudyTitle: 'Executive Transformation Program',
          },
        ];
      default:
        return [];
    }
  };

  const createMailtoLink = (formData: FormData) => {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const clientType = formData.get('clientType') as string;
    const message = formData.get('message') as string;

    const subject = t('contact.form.mail_subject').replace('{name}', name);
    const body = `
Hello,

You have received a new contact form submission:

Name: ${name}
Email: ${email}
Interest: ${clientType}

Message:
${message}

Best regards,
Contact Form System
    `.trim();

    return `mailto:jbelisle@helloarchitekt.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const mailtoLink = createMailtoLink(formData);
    window.location.href = mailtoLink;

    toast({
      title: t('contact.form.toast_title'),
      description: t('contact.form.toast_description'),
      duration: 7000,
    });

    (e.target as HTMLFormElement).reset();
    setSelectedClientType('');
  };

  const handleClientTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedClientType(e.target.value);
  };

  const relevantCaseStudies = getRelevantCaseStudies(selectedClientType);

  const individualList = [
    t('contact.audience.individual_item_1'),
    t('contact.audience.individual_item_2'),
    t('contact.audience.individual_item_3'),
  ];
  const orgList = [
    t('contact.audience.org_item_1'),
    t('contact.audience.org_item_2'),
    t('contact.audience.org_item_3'),
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">{t('contact.heading')}</h2>
        <p className="text-slate-600 dark:text-slate-300 text-center max-w-3xl mx-auto mb-8">
          {t('contact.subheading')}
        </p>

        <div className="mb-16">
          <h3 className="text-xl font-semibold text-center mb-2">{t('contact.sessions.title')}</h3>
          <p className="text-sm text-muted-foreground text-center mb-6">
            {t('contact.sessions.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SESSION_KEYS.map((session) => (
              <div
                key={session.key}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-md p-5 border border-border hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg ${session.bgColor} flex items-center justify-center`}>
                    <session.icon className={`w-6 h-6 ${session.textColor}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold">{t(`contact.sessions.${session.key}.name`)}</h4>
                    <span className="text-xs text-muted-foreground">{t(`contact.sessions.${session.key}.duration`)}</span>
                  </div>
                </div>
                <p className="text-sm font-medium text-foreground mb-1">{t(`contact.sessions.${session.key}.purpose`)}</p>
                <p className="text-xs text-muted-foreground mb-4">{t(`contact.sessions.${session.key}.best_for`)}</p>
                <a href={session.link} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="sm"
                    className={`w-full bg-gradient-to-r ${session.gradient} hover:opacity-90`}
                  >
                    {t('contact.sessions.book_now')}
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold mb-6">{t('contact.form.title')}</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">{t('contact.form.name')}</label>
                  <Input id="name" name="name" required />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">{t('contact.form.email')}</label>
                  <Input id="email" name="email" type="email" required />
                </div>
              </div>

              <div>
                <label htmlFor="clientType" className="block text-sm font-medium mb-1">{t('contact.form.interest_label')}</label>
                <select
                  id="clientType"
                  name="clientType"
                  value={selectedClientType}
                  onChange={handleClientTypeChange}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  required
                >
                  <option value="">{t('contact.form.interest_placeholder')}</option>
                  <option value="ai-leadership">{t('contact.form.options.ai_leadership')}</option>
                  <option value="team-coaching">{t('contact.form.options.team_coaching')}</option>
                  <option value="executive-coaching">{t('contact.form.options.executive_coaching')}</option>
                  <option value="organizational-transformation">{t('contact.form.options.org_transformation')}</option>
                  <option value="innovation-frameworks">{t('contact.form.options.innovation_frameworks')}</option>
                  <option value="other">{t('contact.form.options.other')}</option>
                </select>
              </div>

              {relevantCaseStudies.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">{t('contact.form.related_work')}</h4>
                  {relevantCaseStudies.map((study, index) => (
                    <CaseStudyRecommendation
                      key={index}
                      title={study.title}
                      description={study.description}
                      caseStudyId={study.caseStudyId}
                      caseStudyTitle={study.caseStudyTitle}
                    />
                  ))}
                </div>
              )}

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-1">{t('contact.form.message')}</label>
                <Textarea id="message" name="message" rows={6} placeholder={t('contact.form.message_placeholder')} required />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 transition-all duration-300"
              >
                {t('contact.form.submit')}
              </Button>
            </form>
          </div>

          <div className="flex flex-col gap-8">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-6">{t('contact.info.title')}</h3>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('contact.info.discovery_title')}</h4>
                    <p className="text-slate-600 dark:text-slate-300">{t('contact.info.discovery_desc')}</p>
                    <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      {t('contact.sessions.book_now')}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('contact.info.response_title')}</h4>
                    <p className="text-slate-600 dark:text-slate-300">{t('contact.info.response_desc')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{t('contact.info.direct_title')}</h4>
                    <p className="text-slate-600 dark:text-slate-300">jbelisle@helloarchitekt.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <h4 className="font-bold text-blue-800 dark:text-blue-200">{t('contact.audience.individual_title')}</h4>
                </div>
                <ul className="space-y-1 text-xs text-blue-700 dark:text-blue-300">
                  {individualList.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <h4 className="font-bold text-purple-800 dark:text-purple-200">{t('contact.audience.org_title')}</h4>
                </div>
                <ul className="space-y-1 text-xs text-purple-700 dark:text-purple-300">
                  {orgList.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
