import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useUserSession } from '@/hooks/useUserSession';
import { getTierByProductId } from '@/data/subscriptionTiers';

interface SubscriptionState {
  isSubscribed: boolean;
  tier: string | null;
  productId: string | null;
  subscriptionEnd: Date | null;
  isLoading: boolean;
}

export const useSubscription = () => {
  const { user, session } = useUserSession();
  const [state, setState] = useState<SubscriptionState>({
    isSubscribed: false,
    tier: null,
    productId: null,
    subscriptionEnd: null,
    isLoading: true,
  });

  const checkSubscription = useCallback(async () => {
    if (!session?.access_token) {
      setState(prev => ({ ...prev, isLoading: false, isSubscribed: false, tier: null }));
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error checking subscription:', error);
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const tier = getTierByProductId(data.productId);
      setState({
        isSubscribed: data.subscribed,
        tier,
        productId: data.productId,
        subscriptionEnd: data.subscriptionEnd ? new Date(data.subscriptionEnd) : null,
        isLoading: false,
      });
    } catch (err) {
      console.error('Error in checkSubscription:', err);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [session?.access_token]);

  const createCheckout = useCallback(async (priceId: string) => {
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-checkout', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      body: { priceId },
    });

    if (error) {
      throw new Error(error.message || 'Failed to create checkout session');
    }

    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, [session?.access_token]);

  const openCustomerPortal = useCallback(async () => {
    if (!session?.access_token) {
      throw new Error('Not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('customer-portal', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw new Error(error.message || 'Failed to open customer portal');
    }

    if (data?.url) {
      window.open(data.url, '_blank');
    }
  }, [session?.access_token]);

  // Check subscription on mount and when user changes
  useEffect(() => {
    checkSubscription();
  }, [checkSubscription]);

  // Auto-refresh every 60 seconds
  useEffect(() => {
    if (!user) return;
    
    const interval = setInterval(() => {
      checkSubscription();
    }, 60000);

    return () => clearInterval(interval);
  }, [user, checkSubscription]);

  return {
    ...state,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
  };
};
