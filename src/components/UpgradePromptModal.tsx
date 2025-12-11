import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  ArrowRight, 
  Rocket,
  Check
} from 'lucide-react';
import { 
  SUBSCRIPTION_TIERS, 
  getTierDisplayName, 
  getProjectLimit,
  getNextUpgradeTier 
} from '@/data/subscriptionTiers';
import { useSubscription } from '@/hooks/useSubscription';

interface UpgradePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProjectCount: number;
  reason?: 'project_limit' | 'feature_locked';
}

const UpgradePromptModal: React.FC<UpgradePromptModalProps> = ({
  isOpen,
  onClose,
  currentProjectCount,
  reason = 'project_limit'
}) => {
  const navigate = useNavigate();
  const { tier, createCheckout, isLoading } = useSubscription();
  const [isCheckoutLoading, setIsCheckoutLoading] = React.useState(false);

  const currentTierName = getTierDisplayName(tier);
  const currentLimit = getProjectLimit(tier);
  const nextTierKey = getNextUpgradeTier(tier);
  const nextTier = nextTierKey ? SUBSCRIPTION_TIERS[nextTierKey] : null;

  const handleUpgrade = async () => {
    if (!nextTier) {
      navigate('/pricing');
      onClose();
      return;
    }

    setIsCheckoutLoading(true);
    try {
      await createCheckout(nextTier.priceId);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  const handleViewPricing = () => {
    onClose();
    navigate('/pricing');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Rocket className="w-6 h-6 text-primary" />
            Upgrade to Create More
          </DialogTitle>
          <DialogDescription>
            You've reached your project limit on the {currentTierName} plan
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Usage */}
          <div className="p-4 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Current Plan</span>
              <Badge variant="outline">{currentTierName}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Projects Used</span>
              <span className="font-semibold">
                {currentProjectCount} / {currentLimit === -1 ? '∞' : currentLimit}
              </span>
            </div>
            {/* Progress bar */}
            {currentLimit !== -1 && (
              <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-purple-500 transition-all"
                  style={{ width: `${Math.min((currentProjectCount / currentLimit) * 100, 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* Upgrade Option */}
          {nextTier ? (
            <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary to-purple-600 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{nextTier.name}</h3>
                    <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white border-0">
                      ${nextTier.price}/mo
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {nextTier.description}
                  </p>
                  <ul className="space-y-1">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>
                        {nextTier.projects === -1 ? 'Unlimited projects' : `${nextTier.projects} projects`}
                      </span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{nextTier.users} user{nextTier.users !== 1 ? 's' : ''}</span>
                    </li>
                    {nextTier.features.slice(0, 2).map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-muted/50 border border-border text-center">
              <p className="text-sm text-muted-foreground">
                You're on the highest tier. Contact us for enterprise options.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {nextTier && (
              <Button
                onClick={handleUpgrade}
                disabled={isCheckoutLoading || isLoading}
                className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                {isCheckoutLoading ? (
                  'Opening checkout...'
                ) : (
                  <>
                    Upgrade to {nextTier.name}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={handleViewPricing}
              className="w-full"
            >
              View All Plans
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UpgradePromptModal;