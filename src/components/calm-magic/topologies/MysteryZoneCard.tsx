import { MysteryZone } from '@/hooks/useMysteryZones';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, Sparkles, Loader2, Save, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MysteryZoneCardProps {
  zone: MysteryZone;
  isLoading: boolean;
  isSaved: boolean;
  onReveal: () => void;
  onSave: () => void;
}

export function MysteryZoneCard({ 
  zone, 
  isLoading, 
  isSaved,
  onReveal, 
  onSave 
}: MysteryZoneCardProps) {
  const getZoneColor = () => {
    switch (zone.zoneType) {
      case 'gap': return 'text-chart-1';
      case 'cluster': return 'text-chart-2';
      case 'boundary': return 'text-chart-3';
      case 'attractor': return 'text-chart-4';
      case 'connection': return 'text-chart-5';
      case 'transition': return 'text-primary';
      default: return 'text-primary';
    }
  };

  const getZoneBgColor = () => {
    switch (zone.zoneType) {
      case 'gap': return 'bg-chart-1/10';
      case 'cluster': return 'bg-chart-2/10';
      case 'boundary': return 'bg-chart-3/10';
      case 'attractor': return 'bg-chart-4/10';
      case 'connection': return 'bg-chart-5/10';
      case 'transition': return 'bg-primary/10';
      default: return 'bg-primary/10';
    }
  };

  return (
    <Card className={cn(
      "transition-all duration-200",
      zone.isRevealed ? "bg-card" : getZoneBgColor()
    )}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {zone.isRevealed ? (
              <Sparkles className={cn("w-4 h-4", getZoneColor())} />
            ) : (
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-medium text-sm">{zone.label}</span>
          </div>
          <div className={cn(
            "text-xs px-2 py-0.5 rounded-full capitalize",
            getZoneBgColor(),
            getZoneColor()
          )}>
            {zone.zoneType}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm py-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Revealing mystery...</span>
          </div>
        ) : zone.isRevealed && zone.fragment ? (
          <p className="text-sm leading-relaxed text-foreground/90 italic py-1">
            "{zone.fragment}"
          </p>
        ) : (
          <p className="text-sm text-muted-foreground py-1">
            A mystery awaits discovery...
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          {!zone.isRevealed ? (
            <Button
              size="sm"
              variant="outline"
              onClick={onReveal}
              disabled={isLoading}
              className="w-full"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Reveal Mystery
            </Button>
          ) : (
            <Button
              size="sm"
              variant={isSaved ? "ghost" : "outline"}
              onClick={onSave}
              disabled={isSaved}
              className="w-full"
            >
              {isSaved ? (
                <>
                  <Check className="w-3 h-3 mr-1 text-green-500" />
                  Saved to Journey
                </>
              ) : (
                <>
                  <Save className="w-3 h-3 mr-1" />
                  Save to Journey
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
