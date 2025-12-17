import { MysteryZone } from '@/hooks/useMysteryZones';
import { MysteryZoneCard } from './MysteryZoneCard';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Sparkles } from 'lucide-react';
import { TopologyViewMode } from './ViewModeSelector';

interface MysteryZonesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  zones: MysteryZone[];
  viewMode: TopologyViewMode;
  loadingZoneId: string | null;
  savedZoneIds: Set<string>;
  onRevealZone: (zoneId: string) => void;
  onSaveZone: (zone: MysteryZone) => void;
}

const viewModeLabels: Record<TopologyViewMode, string> = {
  isometric: 'Isometric View',
  diamond: 'Double Diamond',
  spiral: 'Spiral Layout',
  charts: 'Chart View',
  coordinates: 'Coordinate Reference',
  gravity: 'Gravity Well',
  cycles: 'Fundamental Cycles',
  flow: 'Flow Field',
  projection: 'Unfolded Projection'
};

export function MysteryZonesPanel({
  open,
  onOpenChange,
  zones,
  viewMode,
  loadingZoneId,
  savedZoneIds,
  onRevealZone,
  onSaveZone
}: MysteryZonesPanelProps) {
  const revealedZones = zones.filter(z => z.isRevealed);
  const unrevealedZones = zones.filter(z => !z.isRevealed);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[380px] sm:w-[420px] flex flex-col overflow-hidden">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Mystery Zones
          </SheetTitle>
          <SheetDescription>
            {viewModeLabels[viewMode]} • {zones.length} mysteries available
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 mt-6 pr-4 min-h-0" showScrollIndicators>
          <div className="space-y-6">
            {/* Unrevealed Zones */}
            {unrevealedZones.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Awaiting Discovery ({unrevealedZones.length})
                </h3>
                <div className="space-y-3">
                  {unrevealedZones.map(zone => (
                    <MysteryZoneCard
                      key={zone.id}
                      zone={zone}
                      isLoading={loadingZoneId === zone.id}
                      isSaved={savedZoneIds.has(zone.id)}
                      onReveal={() => onRevealZone(zone.id)}
                      onSave={() => onSaveZone(zone)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Separator if both sections exist */}
            {unrevealedZones.length > 0 && revealedZones.length > 0 && (
              <Separator />
            )}

            {/* Revealed Zones - Discovered Mysteries */}
            {revealedZones.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Discovered Mysteries ({revealedZones.length})
                </h3>
                <div className="space-y-3">
                  {revealedZones.map(zone => (
                    <MysteryZoneCard
                      key={zone.id}
                      zone={zone}
                      isLoading={loadingZoneId === zone.id}
                      isSaved={savedZoneIds.has(zone.id)}
                      onReveal={() => onRevealZone(zone.id)}
                      onSave={() => onSaveZone(zone)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {zones.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Sparkles className="w-8 h-8 mx-auto mb-3 opacity-50" />
                <p className="text-sm">No mystery zones in this view</p>
                <p className="text-xs mt-1">Try a different topology view</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
