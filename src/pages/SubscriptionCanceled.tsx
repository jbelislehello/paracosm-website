import React from 'react';
import Footer from '@/components/Footer';
import EditorialAuthShell from '@/components/editorial/EditorialAuthShell';
import EditorialCTA from '@/components/editorial/EditorialCTA';

const SubscriptionCanceled: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <EditorialAuthShell
        numeral="02"
        kicker="Ledger / Canceled"
        tone="warm"
        title={<>Checkout closed — no charge.</>}
        subtitle={
          <>
            No worries. If you have any questions about our plans or need help deciding, write to{' '}
            <a
              href="mailto:jbelisle@helloarchitekt.com"
              className="underline underline-offset-4 hover:opacity-100 opacity-90"
            >
              jbelisle@helloarchitekt.com
            </a>
            .
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <EditorialCTA to="/pricing" tone="warm" variant="primary">
            Back to pricing
          </EditorialCTA>
          <EditorialCTA to="/projects" tone="warm" variant="ghost">
            Continue exploring
          </EditorialCTA>
        </div>
      </EditorialAuthShell>
      <Footer />
    </div>
  );
};

export default SubscriptionCanceled;
