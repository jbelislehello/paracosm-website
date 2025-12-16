import { 
  Target, 
  Lightbulb, 
  AlertTriangle, 
  PartyPopper,
  Eye,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConcreteInsight {
  dailyQuestion: string;
  viewPurpose: string;
  actionableInsight: string;
  warningSignal: string | null;
  celebrationSignal: string | null;
}

interface ConcreteInsightCardProps {
  insight: ConcreteInsight | null;
  isLoading?: boolean;
}

export function ConcreteInsightCard({ insight, isLoading }: ConcreteInsightCardProps) {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-xl border border-primary/20 overflow-hidden">
        {/* Header skeleton */}
        <div className="bg-primary/20 px-4 py-3 border-b border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded bg-primary/30 animate-pulse" />
            <div className="h-3 w-24 bg-primary/30 rounded animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-5 bg-primary/30 rounded animate-pulse w-full" />
            <div className="h-5 bg-primary/20 rounded animate-pulse w-3/4" />
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="p-4 space-y-3">
          {/* View purpose skeleton */}
          <div className="flex items-start gap-2">
            <div className="w-4 h-4 rounded bg-muted/50 animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted/40 rounded animate-pulse w-full" />
              <div className="h-4 bg-muted/30 rounded animate-pulse w-4/5" />
            </div>
          </div>
          
          {/* Actionable insight skeleton */}
          <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-primary/30 animate-pulse" />
              <div className="h-3 w-20 bg-primary/30 rounded animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted/40 rounded animate-pulse w-full" />
              <div className="h-4 bg-muted/30 rounded animate-pulse w-5/6" />
              <div className="h-4 bg-muted/20 rounded animate-pulse w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!insight) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 via-background to-accent/10 rounded-xl border border-primary/20 overflow-hidden">
      {/* Daily Question - Hero Section */}
      <div className="bg-primary/20 px-4 py-3 border-b border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-4 h-4 text-primary" />
          <span className="text-xs uppercase tracking-wider text-primary/80 font-medium">
            Question du Jour
          </span>
        </div>
        <p className="text-base font-bold text-foreground leading-snug">
          {insight.dailyQuestion}
        </p>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* View Purpose */}
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          <Eye className="w-4 h-4 shrink-0 mt-0.5" />
          <p>{insight.viewPurpose}</p>
        </div>

        {/* Warning Signal - if present */}
        {insight.warningSignal && (
          <div className="flex items-start gap-2 p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {insight.warningSignal}
            </p>
          </div>
        )}

        {/* Celebration Signal - if present */}
        {insight.celebrationSignal && (
          <div className="flex items-start gap-2 p-2.5 bg-green-500/10 border border-green-500/20 rounded-lg">
            <PartyPopper className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {insight.celebrationSignal}
            </p>
          </div>
        )}

        {/* Actionable Insight - Always present */}
        <div className="flex items-start gap-2 p-3 bg-primary/5 border border-primary/10 rounded-lg">
          <Lightbulb className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div>
            <p className="text-xs uppercase tracking-wider text-primary/70 font-medium mb-1">
              Action Suggérée
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {insight.actionableInsight}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
