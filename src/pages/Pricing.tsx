import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Sparkles, Users, FolderOpen, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: number;
  description: string;
  features: string[];
  projects: string;
  users: string;
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    price: 50,
    description: 'Perfect for individual exploration',
    projects: '1 project',
    users: '1 user',
    features: [
      'Full Calm Magic Board access',
      'Personal & Professional modes',
      'Window of Tolerance tracking',
      'Living PRD generation',
      'Fragment Browser',
      'Journey Summary',
      'Email support'
    ]
  },
  {
    name: 'Growth',
    price: 100,
    description: 'For growing teams and multiple projects',
    projects: '5 projects',
    users: '2 users',
    popular: true,
    features: [
      'Everything in Starter',
      'Team collaboration',
      'Shared PRD editing',
      'C-Suite Dashboard',
      'Cross-project insights',
      'Priority support',
      'Monthly check-in call'
    ]
  },
  {
    name: 'Scale',
    price: 250,
    description: 'For organizations embracing transformation',
    projects: 'Unlimited projects',
    users: '5 users',
    features: [
      'Everything in Growth',
      'Unlimited projects',
      'Advanced analytics',
      'Custom integrations',
      'Dedicated success manager',
      'Team training session',
      'API access (coming soon)'
    ]
  }
];

const PricingCard: React.FC<{ tier: PricingTier }> = ({ tier }) => {
  return (
    <Card className={`relative flex flex-col ${tier.popular ? 'border-purple-500 shadow-lg shadow-purple-500/10' : 'border-border'}`}>
      {tier.popular && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-purple-500">
          Most Popular
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
            <span>{tier.projects}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="h-4 w-4 text-rose-500" />
            <span>{tier.users}</span>
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
          className={`w-full ${tier.popular ? 'bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600' : ''}`}
          variant={tier.popular ? 'default' : 'outline'}
          disabled
        >
          Coming Soon
        </Button>
      </CardFooter>
    </Card>
  );
};

const Pricing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-500/5 via-purple-500/5 to-indigo-500/5">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="text-center space-y-4 mb-12">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-500 to-purple-500 bg-clip-text text-transparent">
              Calm Magic Board
            </h1>
          </div>
          <h2 className="text-2xl font-semibold">Choose Your Journey</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start your transformation journey with the plan that fits your needs. 
            All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingTiers.map((tier) => (
            <PricingCard key={tier.name} tier={tier} />
          ))}
        </div>

        <div className="mt-12 text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Need a custom plan for your organization?{' '}
            <a href="mailto:hello@paracosm.io" className="text-primary hover:underline">
              Contact us
            </a>
          </p>
          <Card className="max-w-2xl mx-auto border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-orange-500/5">
            <CardContent className="pt-6">
              <p className="text-sm text-center text-muted-foreground">
                <strong className="text-foreground">🚀 Early Access:</strong> Payment integration coming soon. 
                In the meantime, create an account to start exploring the Calm Magic Board for free!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
