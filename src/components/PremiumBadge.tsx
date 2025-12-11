import React from 'react';
import { Lock, Crown, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  PremiumFeature, 
  getFeatureDisplayName, 
  getRequiredTierForFeature,
  SUBSCRIPTION_TIERS 
} from '@/data/subscriptionTiers';
import { useSubscription } from '@/hooks/useSubscription';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  feature: PremiumFeature;
  className?: string;
  showLabel?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

const PremiumBadge: React.FC<PremiumBadgeProps> = ({
  feature,
  className,
  showLabel = false,
  size = 'sm',
  onClick,
}) => {
  const { createCheckout } = useSubscription();
  const requiredTier = getRequiredTierForFeature(feature);
  const tierData = SUBSCRIPTION_TIERS[requiredTier];
  const featureName = getFeatureDisplayName(feature);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClick) {
      onClick();
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

  const Icon = requiredTier === 'scale' ? Crown : Sparkles;
  const iconSize = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4';

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'cursor-pointer transition-colors border-amber-500/50 bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
              size === 'sm' && 'px-1.5 py-0.5 text-xs',
              size === 'md' && 'px-2 py-1 text-sm',
              className
            )}
            onClick={handleClick}
          >
            <Icon className={cn(iconSize, showLabel && 'mr-1')} />
            {showLabel && tierData?.name}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{featureName}</p>
          <p className="text-xs text-muted-foreground">
            Available on {tierData?.name} plan (${tierData?.price}/mo)
          </p>
          <p className="text-xs text-primary mt-1">Click to upgrade</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PremiumBadge;