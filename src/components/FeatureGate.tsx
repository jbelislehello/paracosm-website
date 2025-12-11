import React from 'react';
import { Lock } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PremiumFeature, 
  hasFeatureAccess, 
  getFeatureDisplayName,
  getRequiredTierForFeature,
  SUBSCRIPTION_TIERS 
} from '@/data/subscriptionTiers';
import { useSubscription } from '@/hooks/useSubscription';
import PremiumBadge from './PremiumBadge';

interface FeatureGateProps {
  feature: PremiumFeature;
  children: React.ReactNode;
  mode?: 'inline' | 'overlay' | 'disable';
  fallback?: React.ReactNode;
  onUpgradeClick?: () => void;
}

const FeatureGate: React.FC<FeatureGateProps> = ({
  feature,
  children,
  mode = 'overlay',
  fallback,
  onUpgradeClick,
}) => {
  const { tier, createCheckout, isLoading } = useSubscription();
  const hasAccess = hasFeatureAccess(tier, feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  const featureName = getFeatureDisplayName(feature);
  const requiredTier = getRequiredTierForFeature(feature);
  const tierData = SUBSCRIPTION_TIERS[requiredTier];

  const handleUpgrade = async () => {
    if (onUpgradeClick) {
      onUpgradeClick();
      return;
    }
    
    if (tierData) {
      try {
        await createCheckout(tierData.priceId);
      } catch (error) {
        console.error('Checkout error:', error);
      }
    }
  };

  // Inline mode: just show badge next to disabled element
  if (mode === 'inline') {
    return (
      <div className="relative inline-flex items-center gap-2 opacity-60">
        {children}
        <PremiumBadge feature={feature} />
      </div>
    );
  }

  // Disable mode: render children but disabled with badge
  if (mode === 'disable') {
    return (
      <div className="relative">
        <div className="pointer-events-none opacity-50">
          {children}
        </div>
        <PremiumBadge feature={feature} className="absolute top-1 right-1" />
      </div>
    );
  }

  // Fallback render if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Overlay mode: show locked state with upgrade CTA
  return (
    <Card className="relative overflow-hidden p-6 border-dashed border-muted-foreground/30 bg-muted/20">
      <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
        <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
          <Lock className="w-6 h-6 text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">{featureName}</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Upgrade to {tierData?.name || 'a higher plan'} to unlock this feature
          </p>
        </div>
        <Button 
          onClick={handleUpgrade}
          disabled={isLoading}
          className="bg-gradient-to-r from-primary to-purple-600"
        >
          Upgrade to {tierData?.name}
        </Button>
      </div>
    </Card>
  );
};

export default FeatureGate;