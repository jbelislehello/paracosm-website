import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AICompassPromptProps {
  prompt: string | null;
  isLoading: boolean;
  onGenerate: () => void;
  compassName: string;
  className?: string;
}

export const AICompassPrompt: React.FC<AICompassPromptProps> = ({
  prompt,
  isLoading,
  onGenerate,
  compassName,
  className,
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
          <Sparkles className="h-3 w-3" />
          AI Guide ({compassName} Lens)
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onGenerate}
          disabled={isLoading}
          className="h-6 px-2 text-xs"
        >
          {isLoading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : prompt ? (
            <RefreshCw className="h-3 w-3" />
          ) : (
            <>
              <Sparkles className="h-3 w-3 mr-1" />
              Generate
            </>
          )}
        </Button>
      </div>

      {isLoading && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 animate-pulse">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Consulting the {compassName} compass...
          </div>
        </div>
      )}

      {prompt && !isLoading && (
        <div className="p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {prompt}
          </p>
        </div>
      )}
    </div>
  );
};

export default AICompassPrompt;
