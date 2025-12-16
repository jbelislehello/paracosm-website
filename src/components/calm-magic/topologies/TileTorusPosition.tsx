import { useEffect, useRef, useMemo } from 'react';
import { 
  columnToTheta, 
  rowSeasonToPhi, 
  tileToTorusPoint,
  ManifoldSeason, 
  SEASON_COLORS,
  SEASON_INDEX
} from '@/utils/torusManifoldMath';

interface TileTorusPositionProps {
  row: number;
  col: number;
  season: ManifoldSeason;
  journeyPath?: Array<{ row: number; col: number; season: ManifoldSeason }>;
  rowLabel: string;
  colLabel: string;
}

export function TileTorusPosition({
  row,
  col,
  season,
  journeyPath = [],
  rowLabel,
  colLabel
}: TileTorusPositionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate 3D position
  const position3D = useMemo(() => {
    return tileToTorusPoint(row, col, season, 0);
  }, [row, col, season]);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Clear
    ctx.clearRect(0, 0, width, height);
    
    // Isometric projection parameters
    const scale = 35;
    const isoAngle = Math.PI / 6; // 30 degrees
    
    // Project 3D point to 2D isometric view
    const project = (x: number, y: number, z: number): [number, number] => {
      const px = centerX + (x - y) * Math.cos(isoAngle) * scale;
      const py = centerY - z * scale + (x + y) * Math.sin(isoAngle) * scale * 0.5;
      return [px, py];
    };
    
    // Draw torus wireframe (simplified)
    ctx.strokeStyle = 'hsla(var(--muted-foreground), 0.2)';
    ctx.lineWidth = 0.5;
    
    // Draw major circles (around the hole)
    const R = 3.0;
    const r = 1.0;
    
    for (let phiStep = 0; phiStep < 5; phiStep++) {
      const phi = (phiStep / 5) * Math.PI * 2;
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
        const x = (R + r * Math.cos(phi)) * Math.cos(theta);
        const y = (R + r * Math.cos(phi)) * Math.sin(theta);
        const z = r * Math.sin(phi);
        const [px, py] = project(x, y, z);
        if (theta === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw minor circles (around the tube)
    for (let thetaStep = 0; thetaStep < 8; thetaStep++) {
      const theta = (thetaStep / 8) * Math.PI * 2;
      ctx.beginPath();
      for (let phi = 0; phi <= Math.PI * 2; phi += 0.1) {
        const x = (R + r * Math.cos(phi)) * Math.cos(theta);
        const y = (R + r * Math.cos(phi)) * Math.sin(theta);
        const z = r * Math.sin(phi);
        const [px, py] = project(x, y, z);
        if (phi === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
    
    // Draw journey path
    if (journeyPath.length > 1) {
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'hsl(var(--primary) / 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      
      journeyPath.forEach((tile, idx) => {
        const pos = tileToTorusPoint(tile.row, tile.col, tile.season, 0);
        const [px, py] = project(pos[0], pos[1], pos[2]);
        if (idx === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Draw 5 season bands with colors
    const seasons: ManifoldSeason[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
    seasons.forEach((s, sIdx) => {
      const phi = rowSeasonToPhi(4, s); // Middle of each season band
      ctx.strokeStyle = SEASON_COLORS[s];
      ctx.lineWidth = 2;
      ctx.globalAlpha = s === season ? 1 : 0.3;
      
      ctx.beginPath();
      for (let theta = 0; theta <= Math.PI * 2; theta += 0.1) {
        const x = (R + r * Math.cos(phi)) * Math.cos(theta);
        const y = (R + r * Math.cos(phi)) * Math.sin(theta);
        const z = r * Math.sin(phi);
        const [px, py] = project(x, y, z);
        if (theta === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    
    // Draw current tile position
    const [px, py] = project(position3D[0], position3D[1], position3D[2]);
    
    // Glow effect
    const gradient = ctx.createRadialGradient(px, py, 0, px, py, 16);
    gradient.addColorStop(0, SEASON_COLORS[season]);
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(px, py, 16, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner dot
    ctx.fillStyle = SEASON_COLORS[season];
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, Math.PI * 2);
    ctx.fill();
    
    // White center
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(px, py, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Label
    ctx.fillStyle = 'hsl(var(--foreground))';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${rowLabel[0]}×${colLabel[0]}`, px, py + 20);
    
  }, [row, col, season, journeyPath, position3D, rowLabel, colLabel]);
  
  return (
    <div className="p-4 rounded-lg bg-card/50 border border-border/50">
      <h4 className="text-sm font-semibold mb-2">2.5D Torus View</h4>
      <canvas 
        ref={canvasRef} 
        width={260} 
        height={200}
        className="w-full h-auto rounded"
      />
      <div className="flex gap-1 flex-wrap mt-2 justify-center">
        {(['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'] as ManifoldSeason[]).map(s => (
          <span 
            key={s}
            className={`text-[9px] px-1.5 py-0.5 rounded ${s === season ? 'font-bold' : 'opacity-50'}`}
            style={{ 
              backgroundColor: `${SEASON_COLORS[s]}20`,
              color: SEASON_COLORS[s]
            }}
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
