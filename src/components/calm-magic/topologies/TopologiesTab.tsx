import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Maximize2, RotateCcw } from 'lucide-react';
import { TileTorusPosition } from './TileTorusPosition';
import { InformationFluxDiagram } from './InformationFluxDiagram';
import { ToroidalCoordinates } from './ToroidalCoordinates';
import { ManifoldSeason, columnToTheta, rowSeasonToPhi } from '@/utils/torusManifoldMath';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TopologiesTabProps {
  row: number;
  col: number;
  season: ManifoldSeason;
  tileName: string;
  rowLabel: string;
  colLabel: string;
  journeyPath?: Array<{ row: number; col: number }>;
  polenDensity?: number;
}

export function TopologiesTab({
  row,
  col,
  season,
  tileName,
  rowLabel,
  colLabel,
  journeyPath = [],
  polenDensity = 0
}: TopologiesTabProps) {
  const [showFullManifold, setShowFullManifold] = useState(false);
  
  const theta = columnToTheta(col);
  const phi = rowSeasonToPhi(row, season);
  
  // Convert journey path to include seasons
  const journeyWithSeasons = journeyPath.map(p => ({
    ...p,
    season // For now, assume same season - can be enhanced
  }));
  
  return (
    <ScrollArea className="flex-1">
      <div className="p-5 space-y-4">
        {/* 2.5D Torus Position + Coordinates side by side on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TileTorusPosition
            row={row}
            col={col}
            season={season}
            journeyPath={journeyWithSeasons}
            rowLabel={rowLabel}
            colLabel={colLabel}
          />
          
          <ToroidalCoordinates
            row={row}
            col={col}
            season={season}
            tileName={tileName}
            rowLabel={rowLabel}
            colLabel={colLabel}
            polenDensity={polenDensity}
          />
        </div>
        
        {/* Information Flux Diagram */}
        <InformationFluxDiagram
          season={season}
          currentPosition={{ theta, phi }}
        />
        
        {/* Actions */}
        <div className="flex gap-2 justify-center pt-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFullManifold(true)}
            className="text-xs"
          >
            <Maximize2 className="w-3 h-3 mr-1" />
            Full 3D Manifold
          </Button>
        </div>
        
        {/* Legend */}
        <div className="p-3 rounded-lg bg-muted/30 border border-border/30 text-[10px] text-muted-foreground">
          <p className="font-medium mb-1">Torus Mapping:</p>
          <ul className="space-y-0.5 list-disc list-inside">
            <li>θ (toroidal): Column position around the central hole</li>
            <li>φ (poloidal): Row × Season position around the tube</li>
            <li>Positive K: Outer convex edge (expansion)</li>
            <li>Negative K: Inner saddle edge (compression)</li>
          </ul>
        </div>
      </div>
      
      {/* Full Manifold Dialog */}
      <Dialog open={showFullManifold} onOpenChange={setShowFullManifold}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>3D Torus Manifold</DialogTitle>
          </DialogHeader>
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p className="text-sm">
              Full 3D manifold visualization requires WebGL.
              <br />
              Navigate to the dedicated Manifold page for the full experience.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </ScrollArea>
  );
}
