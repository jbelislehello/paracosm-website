import { Badge } from '@/components/ui/badge';
import { 
  columnToTheta, 
  rowSeasonToPhi, 
  calculateLocalRadius, 
  gaussianCurvature,
  TORUS_MAJOR_RADIUS,
  ManifoldSeason,
  SEASON_COLORS
} from '@/utils/torusManifoldMath';

interface ToroidalCoordinatesProps {
  row: number;
  col: number;
  season: ManifoldSeason;
  tileName: string;
  rowLabel: string;
  colLabel: string;
  polenDensity?: number;
}

export function ToroidalCoordinates({
  row,
  col,
  season,
  tileName,
  rowLabel,
  colLabel,
  polenDensity = 0
}: ToroidalCoordinatesProps) {
  const theta = columnToTheta(col);
  const phi = rowSeasonToPhi(row, season);
  const r = calculateLocalRadius(polenDensity);
  const K = gaussianCurvature(phi, r);
  
  // Determine curvature type
  const curvatureType = K > 0.01 ? 'convex' : K < -0.01 ? 'saddle' : 'flat';
  const curvatureColor = K > 0 ? 'text-blue-400' : 'text-rose-400';
  
  return (
    <div className="p-4 rounded-lg bg-card/50 border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">Toroidal Position</h4>
        <Badge 
          variant="outline" 
          className="text-[10px]"
          style={{ borderColor: SEASON_COLORS[season], color: SEASON_COLORS[season] }}
        >
          {season}
        </Badge>
      </div>
      
      <p className="text-xs text-muted-foreground">
        {tileName} ({rowLabel} × {colLabel})
      </p>
      
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">θ (toroidal)</span>
            <span>{theta.toFixed(3)} rad</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">φ (poloidal)</span>
            <span>{phi.toFixed(3)} rad</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between">
            <span className="text-muted-foreground">R (major)</span>
            <span>{TORUS_MAJOR_RADIUS.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">r (minor)</span>
            <span>{r.toFixed(3)}</span>
          </div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-border/30">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Gaussian Curvature K</span>
          <span className={curvatureColor}>
            {K.toFixed(4)} ({curvatureType})
          </span>
        </div>
      </div>
    </div>
  );
}
