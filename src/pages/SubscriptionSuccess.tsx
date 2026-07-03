import React, { useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import Footer from '@/components/Footer';
import EditorialAuthShell from '@/components/editorial/EditorialAuthShell';
import EditorialCTA from '@/components/editorial/EditorialCTA';

const SubscriptionSuccess: React.FC = () => {
  const { checkSubscription } = useSubscription();

  useEffect(() => {
    const timer = setTimeout(() => {
      checkSubscription();
    }, 2000);
    return () => clearTimeout(timer);
  }, [checkSubscription]);

  return (
    <div className="flex flex-col min-h-screen">
      <EditorialAuthShell
        numeral="01"
        kicker="Ledger / Welcome"
        tone="warm"
        title={<>Welcome to Calm Magic Board.</>}
        subtitle="Your subscription is active. Thank you for joining us on this transformation journey — it may take a few moments for all features to become available."
      >
        <div className="flex flex-col gap-3">
          <EditorialCTA to="/projects" tone="warm" variant="primary">
            Start your journey
          </EditorialCTA>
          <EditorialCTA to="/pricing" tone="warm" variant="ghost">
            View your plan
          </EditorialCTA>
        </div>
      </EditorialAuthShell>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;
