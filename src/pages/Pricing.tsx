import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Users, FolderOpen, ArrowLeft, Loader2, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useUserSession } from '@/hooks/useUserSession';
import { useSubscription } from '@/hooks/useSubscription';
import { SUBSCRIPTION_TIERS, SubscriptionTier } from '@/data/subscriptionTiers';
import { useToast } from '@/hooks/use-toast';
import Footer from '@/components/Footer';
import { usePageSeo } from '@/hooks/usePageSeo';
import { webPageSchema, offerCatalogSchema } from '@/lib/structuredData';
import { useLanguage } from '@/contexts/LanguageContext';

// FR translations for the tier catalog (parallel to subscriptionTiers.ts)
const TIER_FR: Record<string, { name: string; description: string; features: string[] }> = {
  starter: {
    name: 'Découverte',
    description: 'Parfait pour l\'exploration individuelle',
    features: [
      'Accès complet au Calm Magic Board',
      'Modes Personnel et Professionnel',
      'Suivi de la fenêtre de tolérance',
      'Génération de PRD vivant',
      'Navigateur de fragments',
      'Résumé de parcours',
      'Support par courriel',
    ],
  },
  growth: {
    name: 'Croissance',
    description: 'Pour les équipes en croissance et plusieurs projets',
    features: [
      'Tout ce qui est inclus dans Découverte',
      'Collaboration d\'équipe',
      'Édition partagée de PRD',
      'Tableau de bord C-Suite',
      'Insights inter-projets',
      'Support prioritaire',
      'Appel mensuel de suivi',
    ],
  },
  scale: {
    name: 'Échelle',
    description: 'Pour les organisations qui embrassent la transformation',
    features: [
      'Tout ce qui est inclus dans Croissance',
      'Projets illimités',
      'Analytique avancée',
      'Intégrations personnalisées',
      'Gestionnaire de succès dédié',
      'Session de formation d\'équipe',
      'Accès API (à venir)',
    ],
  },
};

const PricingCard: React.FC<{ 
  tierKey: string;
  tier: SubscriptionTier;
  currentTier: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  onSubscribe: (priceId: string) => Promise<void>;
  onManage: () => Promise<void>;
}> = ({ tierKey, tier, currentTier, isLoggedIn, isLoading, onSubscribe, onManage }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const localized = isFr && TIER_FR[tierKey] ? TIER_FR[tierKey] : { name: tier.name, description: tier.description, features: tier.features };

  const isCurrentPlan = currentTier === tierKey;
  const projectsDisplay = tier.projects === -1
    ? (isFr ? 'Projets illimités' : 'Unlimited projects')
    : (isFr ? `${tier.projects} projet${tier.projects > 1 ? 's' : ''}` : `${tier.projects} project${tier.projects > 1 ? 's' : ''}`);
  const usersDisplay = isFr
    ? `${tier.users} utilisateur${tier.users > 1 ? 's' : ''}`
    : `${tier.users} user${tier.users > 1 ? 's' : ''}`;

  const handleClick = async () => {
    if (!isLoggedIn) {
      navigate('/auth');
      return;
    }

    if (isCurrentPlan) {
      setIsProcessing(true);
      try {
        await onManage();
      } catch (error) {
        toast({
          title: isFr ? 'Erreur' : 'Error',
          description: error instanceof Error ? error.message : (isFr ? 'Impossible d\'ouvrir le portail' : 'Failed to open portal'),
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (currentTier) {
      // Has a different subscription - open portal to change
      setIsProcessing(true);
      try {
        await onManage();
      } catch (error) {
        toast({
          title: isFr ? 'Erreur' : 'Error',
          description: error instanceof Error ? error.message : (isFr ? 'Impossible d\'ouvrir le portail' : 'Failed to open portal'),
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    // Not subscribed - create checkout
    setIsProcessing(true);
    try {
      await onSubscribe(tier.priceId);
    } catch (error) {
      toast({
        title: isFr ? 'Erreur' : 'Error',
        description: error instanceof Error ? error.message : (isFr ? 'Impossible de démarrer le paiement' : 'Failed to start checkout'),
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getButtonContent = () => {
    if (isProcessing || isLoading) {
      return <Loader2 className="h-4 w-4 animate-spin" />;
    }
    if (!isLoggedIn) {
      return isFr ? 'Se connecter pour s\'abonner' : 'Sign in to Subscribe';
    }
    if (isCurrentPlan) {
      return (
        <>
          <Settings className="h-4 w-4 mr-2" />
          {isFr ? 'Gérer l\'abonnement' : 'Manage Plan'}
        </>
      );
    }
    if (currentTier) {
      return isFr ? 'Changer de plan' : 'Change Plan';
    }
    return isFr ? 'S\'abonner' : 'Subscribe';
  };

  return (
    <Card className={`relative flex flex-col ${tier.popular ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-border'} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {tier.popular && !isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-500">
          {isFr ? 'Le plus populaire' : 'Most Popular'}
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
          {isFr ? 'Votre plan' : 'Your Plan'}
        </Badge>
      )}
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{localized.name}</CardTitle>
        <CardDescription>{localized.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="text-center">
          <span className="text-4xl font-bold">${tier.price}</span>
          <span className="text-muted-foreground">{isFr ? '/mois' : '/month'}</span>
          <p className="text-xs text-muted-foreground mt-1">{isFr ? 'Facturé annuellement' : 'Billed annually'}</p>
        </div>

        <div className="flex justify-center gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4 text-purple-500" />
            <span>{projectsDisplay}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-rose-500" />
            <span>{usersDisplay}</span>
          </div>
        </div>

        <ul className="space-y-2">
          {localized.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button 
          className={`w-full ${tier.popular && !isCurrentPlan ? 'bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600' : ''}`}
          variant={tier.popular && !isCurrentPlan ? 'default' : 'outline'}
          onClick={handleClick}
          disabled={isProcessing || isLoading}
        >
          {getButtonContent()}
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing: React.FC = () => {
  const { user } = useUserSession();
  const { tier: currentTier, isLoading, createCheckout, openCustomerPortal } = useSubscription();
  const { language } = useLanguage();
  const isFr = language === 'fr';

  const seoTitle = isFr
    ? 'Tarifs — Coaching, Calm Magic et plans PRD | Paracosm'
    : 'Pricing — Coaching, Calm Magic & PRD plans | Paracosm';
  const seoDescription = isFr
    ? 'Choisissez votre parcours Paracosm : méthodologie Calm Magic, compilateur PRD, coaching exécutif et abonnements d\'équipe.'
    : 'Choose your Paracosm pathway: Calm Magic methodology, PRD compiler, executive coaching, and team subscriptions.';

  usePageSeo({
    title: seoTitle,
    description: seoDescription,
    path: "/pricing",
    jsonLd: [
      webPageSchema({ title: seoTitle, description: seoDescription, url: "/pricing" }),
      offerCatalogSchema({
        name: "Paracosm Plans",
        url: "/pricing",
        offers: [
          { name: "Calm Magic", description: "Relational intelligence methodology and board access." },
          { name: "PRD Compiler", description: "Compile organizational PRDs from conversation." },
          { name: "Executive Coaching", description: "1:1 leadership coaching pathways." },
          { name: "Team Subscriptions", description: "Multi-seat team plans." },
        ],
      }),
    ],
  });

  return (
    <div className="min-h-screen bg-[hsl(35_45%_96%)] dark:bg-[hsl(25_15%_12%)] text-foreground">
      <div className="container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            {isFr ? 'Retour à l\'accueil' : 'Back to home'}
          </Link>
        </div>

        <div className="flex items-baseline gap-8 border-b border-current/10 pb-10 mb-12">
          <span className="font-serif text-6xl md:text-7xl text-[hsl(15_75%_55%)] leading-none">11</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-semibold opacity-60 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> {isFr ? 'Le grand livre · Tarifs' : 'The Ledger · Pricing'}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-[1.05]">
              {isFr ? (<>Choisissez votre <em className="italic font-light">parcours</em>.</>) : (<>Choose your <em className="italic font-light">journey</em>.</>)}
            </h1>
            <p className="mt-4 text-base opacity-70 max-w-2xl font-serif italic">
              {isFr
                ? 'Amorcez votre transformation avec le plan qui correspond à votre saison. Tous les plans incluent un essai gratuit de 14 jours.'
                : 'Start your transformation with the plan that fits your season. All plans include a 14-day free trial.'}
            </p>
          </div>
        </div>


        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
            <PricingCard 
              key={key}
              tierKey={key}
              tier={tier}
              currentTier={currentTier}
              isLoggedIn={!!user}
              isLoading={isLoading}
              onSubscribe={createCheckout}
              onManage={openCustomerPortal}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            {isFr ? 'Besoin d\'un plan personnalisé pour votre organisation ? ' : 'Need a custom plan for your organization? '}
            <Link to="/contact" className="text-primary hover:underline">
              {isFr ? 'Contactez-nous' : 'Contact us'}
            </Link>
            {isFr ? ' ou écrivez à ' : ' or email '}
            <a href="mailto:jbelisle@helloarchitekt.com" className="text-primary hover:underline">
              jbelisle@helloarchitekt.com
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Pricing;
