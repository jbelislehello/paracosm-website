import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Skeleton } from '@/components/ui/skeleton';
import { useSubscription } from '@/hooks/useSubscription';
import { getTierDisplayName } from '@/data/subscriptionTiers';
import { cn } from '@/lib/utils';

const SubscriptionStatusIndicator: React.FC = () => {
  const navigate = useNavigate();
  const { 
    tier, 
    isSubscribed, 
    subscriptionEnd, 
    isLoading, 
    checkSubscription, 
    openCustomerPortal 
  } = useSubscription();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await checkSubscription();
      toast.success('Subscription status refreshed');
    } catch {
      // Error already handled in checkSubscription
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleBadgeClick = async () => {
    if (isSubscribed) {
      try {
        await openCustomerPortal();
      } catch (err) {
        toast.error('Failed to open billing portal');
      }
    } else {
      navigate('/pricing');
    }
  };

  // Tier-specific styling
  const getTierStyles = (tierKey: string | null) => {
    switch (tierKey) {
      case 'starter':
        return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-transparent hover:from-blue-600 hover:to-blue-700';
      case 'growth':
        return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent hover:from-purple-600 hover:to-pink-600';
      case 'scale':
        return 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent hover:from-amber-600 hover:to-orange-600';
      default:
        return 'bg-muted text-muted-foreground border-border hover:bg-muted/80';
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="flex items-center gap-1.5">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="flex items-center gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              className={cn(
                "cursor-pointer gap-1 transition-all duration-200",
                getTierStyles(tier)
              )}
              onClick={handleBadgeClick}
            >
              {isSubscribed && <Sparkles className="w-3 h-3" />}
              {getTierDisplayName(tier)}
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {subscriptionEnd 
              ? `Renews ${format(subscriptionEnd, 'MMM d, yyyy')}`
              : 'Click to view pricing plans'
            }
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-foreground"
              onClick={handleRefresh}
              disabled={isLoading || isRefreshing}
            >
              <RefreshCw className={cn(
                "h-3.5 w-3.5 transition-transform", 
                (isLoading || isRefreshing) && "animate-spin"
              )} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Refresh subscription status</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default SubscriptionStatusIndicator;
