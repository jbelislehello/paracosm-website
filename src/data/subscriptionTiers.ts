export interface SubscriptionTier {
  name: string;
  priceId: string;
  productId: string;
  price: number;
  description: string;
  projects: number; // -1 for unlimited
  users: number;
  features: string[];
  popular?: boolean;
}

export const SUBSCRIPTION_TIERS: Record<string, SubscriptionTier> = {
  starter: {
    name: 'Starter',
    priceId: 'price_1Sczz9L7ep0Gtw96UuAg1ytG',
    productId: 'prod_TaAJMpFlkbMYfX',
    price: 50,
    description: 'Perfect for individual exploration',
    projects: 1,
    users: 1,
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
  growth: {
    name: 'Growth',
    priceId: 'price_1Sd05hL7ep0Gtw963sXbEvPg',
    productId: 'prod_TaAQ9CwD5qvxuk',
    price: 100,
    description: 'For growing teams and multiple projects',
    projects: 5,
    users: 2,
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
  scale: {
    name: 'Scale',
    priceId: 'price_1Sd0ApL7ep0Gtw96bq4GwrQj',
    productId: 'prod_TaVtrYEo3xOhQ',
    price: 250,
    description: 'For organizations embracing transformation',
    projects: -1, // unlimited
    users: 5,
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
};

export const getTierByProductId = (productId: string | null): string | null => {
  if (!productId) return null;
  for (const [key, tier] of Object.entries(SUBSCRIPTION_TIERS)) {
    if (tier.productId === productId) return key;
  }
  return null;
};

export const getTierDisplayName = (tierKey: string | null): string => {
  if (!tierKey) return 'Free';
  return SUBSCRIPTION_TIERS[tierKey]?.name || 'Free';
};
