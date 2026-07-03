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
  
  const isCurrentPlan = currentTier === tierKey;
  const projectsDisplay = tier.projects === -1 ? 'Unlimited projects' : `${tier.projects} project${tier.projects > 1 ? 's' : ''}`;
  const usersDisplay = `${tier.users} user${tier.users > 1 ? 's' : ''}`;

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
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to open portal",
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
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to open portal",
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
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to start checkout",
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
      return 'Sign in to Subscribe';
    }
    if (isCurrentPlan) {
      return (
        <>
          <Settings className="h-4 w-4 mr-2" />
          Manage Plan
        </>
      );
    }
    if (currentTier) {
      return 'Change Plan';
    }
    return 'Subscribe';
  };

  return (
    <Card className={`relative flex flex-col ${tier.popular ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-border'} ${isCurrentPlan ? 'ring-2 ring-green-500' : ''}`}>
      {tier.popular && !isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-500">
          Most Popular
        </Badge>
      )}
      {isCurrentPlan && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500">
          Your Plan
        </Badge>
      )}
      <CardHeader className="text-center pb-2">
        <CardTitle className="text-xl">{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 space-y-6">
        <div className="text-center">
          <span className="text-4xl font-bold">${tier.price}</span>
          <span className="text-muted-foreground">/month</span>
          <p className="text-xs text-muted-foreground mt-1">Billed annually</p>
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
          {tier.features.map((feature, idx) => (
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

  usePageSeo({
    title: "Pricing — Coaching, Calm Magic & PRD plans | Paracosm",
    description: "Choose your Paracosm pathway: Calm Magic methodology, PRD compiler, executive coaching, and team subscriptions.",
    path: "/pricing",
    jsonLd: [
      webPageSchema({
        title: "Pricing — Coaching, Calm Magic & PRD plans | Paracosm",
        description:
          "Choose your Paracosm pathway: Calm Magic methodology, PRD compiler, executive coaching, and team subscriptions.",
        url: "/pricing",
      }),
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
            Back to home
          </Link>
        </div>

        <div className="flex items-baseline gap-8 border-b border-current/10 pb-10 mb-12">
          <span className="font-serif text-6xl md:text-7xl text-[hsl(15_75%_55%)] leading-none">11</span>
          <div>
            <p className="text-[10px] uppercase tracking-[0.4em] font-semibold opacity-60 flex items-center gap-2">
              <Sparkles className="h-3 w-3" /> The Ledger · Pricing
            </p>
            <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-[1.05]">
              Choose your <em className="italic font-light">journey</em>.
            </h1>
            <p className="mt-4 text-base opacity-70 max-w-2xl font-serif italic">
              Start your transformation with the plan that fits your season. All plans include a 14-day free trial.
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
            Need a custom plan for your organization?{' '}
            <Link to="/contact" className="text-primary hover:underline">
              Contact us
            </Link>
            {' '}or email{' '}
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
