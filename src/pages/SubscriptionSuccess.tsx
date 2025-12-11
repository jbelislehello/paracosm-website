import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useSubscription } from '@/hooks/useSubscription';
import Footer from '@/components/Footer';

const SubscriptionSuccess: React.FC = () => {
  const { checkSubscription } = useSubscription();

  // Refresh subscription status on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      checkSubscription();
    }, 2000);
    return () => clearTimeout(timer);
  }, [checkSubscription]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-green-500/30 shadow-lg shadow-green-500/10">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Welcome to Calm Magic Board!</CardTitle>
            <CardDescription>
              Your subscription is now active. Thank you for joining us on this transformation journey.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Your subscription is being activated...</span>
              </div>
              <p className="text-xs text-muted-foreground">
                It may take a few moments for all features to become available.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <Button asChild className="w-full bg-gradient-to-r from-rose-500 to-purple-500 hover:from-rose-600 hover:to-purple-600">
                <Link to="/projects">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/pricing">
                  View Your Plan
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SubscriptionSuccess;
