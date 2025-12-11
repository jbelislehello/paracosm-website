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

export const getProjectLimit = (tier: string | null): number => {
  if (!tier) return 1; // Free tier: 1 project
  return SUBSCRIPTION_TIERS[tier]?.projects ?? 1;
};

export const canCreateProject = (tier: string | null, currentProjectCount: number): boolean => {
  const limit = getProjectLimit(tier);
  if (limit === -1) return true; // Unlimited
  return currentProjectCount < limit;
};

export const getProjectLimitDisplay = (tier: string | null, currentCount: number): string => {
  const limit = getProjectLimit(tier);
  if (limit === -1) return `${currentCount} projects (Unlimited)`;
  return `${currentCount} of ${limit} project${limit !== 1 ? 's' : ''}`;
};

export const getNextUpgradeTier = (currentTier: string | null): string | null => {
  if (!currentTier || currentTier === 'starter') return 'growth';
  if (currentTier === 'growth') return 'scale';
  return null; // Already at scale
};

// Premium feature definitions
export type PremiumFeature = 
  | 'csuite_dashboard'
  | 'compilation_tab'
  | 'ai_journey_summary'
  | 'insight_connections'
  | 'pdf_export';

export const FEATURE_TIERS: Record<PremiumFeature, string> = {
  csuite_dashboard: 'growth',
  ai_journey_summary: 'growth',
  pdf_export: 'growth',
  insight_connections: 'scale',
  compilation_tab: 'scale',
};

export const FEATURE_DISPLAY_NAMES: Record<PremiumFeature, string> = {
  csuite_dashboard: 'C-Suite Dashboard',
  ai_journey_summary: 'AI Journey Summary',
  pdf_export: 'PDF Export',
  insight_connections: 'Insight Connections Graph',
  compilation_tab: 'AI Compilation Tools',
};

const TIER_HIERARCHY = ['starter', 'growth', 'scale'];

export const hasFeatureAccess = (tier: string | null, feature: PremiumFeature): boolean => {
  const requiredTier = FEATURE_TIERS[feature];
  if (!tier) return false; // Free users have no premium features
  
  const userTierIndex = TIER_HIERARCHY.indexOf(tier);
  const requiredTierIndex = TIER_HIERARCHY.indexOf(requiredTier);
  
  return userTierIndex >= requiredTierIndex;
};

export const getRequiredTierForFeature = (feature: PremiumFeature): string => {
  return FEATURE_TIERS[feature];
};

export const getFeatureDisplayName = (feature: PremiumFeature): string => {
  return FEATURE_DISPLAY_NAMES[feature];
};
