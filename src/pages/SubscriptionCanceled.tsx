import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft } from 'lucide-react';

const SubscriptionCanceled: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-rose-500/5 flex items-center justify-center p-4">
      <Card className="max-w-md w-full border-amber-500/30 shadow-lg shadow-amber-500/10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-amber-500" />
          </div>
          <CardTitle className="text-2xl">Checkout Canceled</CardTitle>
          <CardDescription>
            No worries! Your checkout was canceled and you haven't been charged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              If you have any questions about our plans or need help deciding, feel free to reach out to us at{' '}
              <a href="mailto:jbelisle@helloarchitekt.com" className="text-primary hover:underline">
                jbelisle@helloarchitekt.com
              </a>
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link to="/pricing">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pricing
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/projects">
                Continue Exploring
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionCanceled;
