import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { getTileCosmology, TileCosmology, CASTLES } from '@/data/cosmologicalMapping';
import HexagramDisplay from './HexagramDisplay';
import { Sparkles, Star, ArrowUpRight, ArrowDownRight, ArrowUpLeft, ArrowDownLeft, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useMode } from './context/ModeContext';
import { getTerminology } from '@/data/modeAwareTerminology';

interface CosmologicalContextTabProps {
  tileId: number;
  season: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  onDiagonalMove?: (toRow: number, toCol: number) => void;
  className?: string;
}

const CosmologicalContextTab = ({
  tileId,
  season,
  onDiagonalMove,
  className,
}: CosmologicalContextTabProps) => {
  const [showAffirmation, setShowAffirmation] = useState(false);
  const { mode } = useMode();
  const terms = getTerminology(mode);
  
  const cosmology = getTileCosmology(tileId, season);
  const castle = CASTLES.find(c => c.season === season);

  const getDiagonalIcon = (dr: number, dc: number) => {
    if (dr > 0 && dc > 0) return <ArrowUpRight className="w-4 h-4" />;
    if (dr > 0 && dc < 0) return <ArrowUpLeft className="w-4 h-4" />;
    if (dr < 0 && dc > 0) return <ArrowDownRight className="w-4 h-4" />;
    return <ArrowDownLeft className="w-4 h-4" />;
  };

  const getDiagonalName = (dr: number, dc: number) => {
    if (dr > 0 && dc > 0) return 'NE';
    if (dr > 0 && dc < 0) return 'NW';
    if (dr < 0 && dc > 0) return 'SE';
    return 'SW';
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Tzolkin/Sync Signature */}
      <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{cosmology.seal.glyph}</span>
            <div>
              <h3 className="font-bold text-lg">{terms.tzolkinKin} {cosmology.kin}</h3>
              <p className="text-sm text-muted-foreground">
                {cosmology.tone.name} {cosmology.seal.name}
              </p>
            </div>
          </div>
          
          {cosmology.isPortalDay && (
            <Badge className="bg-purple-500 text-white gap-1">
              <Sparkles className="w-3 h-3" />
              {terms.portalDay}
            </Badge>
          )}
        </div>

        {/* Seal & Tone Details */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-2 bg-background/50 rounded">
            <span className="text-muted-foreground text-xs">{terms.solarSeal}</span>
            <div className="font-medium">{cosmology.seal.name}</div>
            <div className="text-xs text-muted-foreground">{cosmology.seal.meaning}</div>
          </div>
          <div className="p-2 bg-background/50 rounded">
            <span className="text-muted-foreground text-xs">{terms.galacticTone}</span>
            <div className="font-medium">{cosmology.tone.number}. {cosmology.tone.name}</div>
            <div className="text-xs text-muted-foreground">
              {cosmology.tone.power} • {cosmology.tone.action}
            </div>
          </div>
        </div>

        {/* Affirmation */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 text-xs"
          onClick={() => setShowAffirmation(!showAffirmation)}
        >
          <Star className="w-3 h-3 mr-1" />
          {showAffirmation ? 'Hide' : 'Show'} {terms.galacticAffirmation}
        </Button>
        
        {showAffirmation && (
          <div className="mt-2 p-3 bg-background/80 rounded-lg border border-border/50">
            <p className="text-xs italic whitespace-pre-line text-muted-foreground leading-relaxed">
              {cosmology.affirmation}
            </p>
          </div>
        )}
      </Card>

      {/* Castle/Quarter & Wavespell/Sprint Context */}
      <Card className="p-4" style={{ borderColor: castle?.color + '40' }}>
        <div className="flex items-center gap-2 mb-3">
          <Compass className="w-4 h-4 text-muted-foreground" />
          <h4 className="font-medium text-sm">{terms.castle} & {terms.wavespell}</h4>
        </div>
        
        <div className="space-y-2">
          <div 
            className="p-2 rounded-lg flex items-center justify-between"
            style={{ backgroundColor: castle?.color + '15' }}
          >
            <div>
              <span className="font-medium text-sm">{cosmology.castle.name}</span>
              <p className="text-xs text-muted-foreground">{cosmology.castle.theme}</p>
            </div>
            <Badge 
              variant="outline" 
              className="text-[10px]"
              style={{ borderColor: castle?.color, color: castle?.color }}
            >
              {terms.castle} {cosmology.castle.id}
            </Badge>
          </div>
          
          <div className="p-2 bg-muted/30 rounded-lg flex items-center justify-between">
            <div>
              <span className="font-medium text-sm">
                {cosmology.wavespell.seal} {terms.wavespell}
              </span>
              <p className="text-xs text-muted-foreground">{cosmology.wavespell.theme}</p>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {mode === 'professional' ? 'SW' : 'WS'} {cosmology.wavespell.id}
            </Badge>
          </div>
        </div>
      </Card>

      {/* Hexagram / Wild Guess */}
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">☯</span>
          <h4 className="font-medium text-sm">{terms.iChing} {terms.hexagram}</h4>
        </div>
        
        <HexagramDisplay 
          hexagram={cosmology.hexagram} 
          size="md"
          showDetails={true}
        />
      </Card>

      {/* Diagonal Movement Options (if Portal/Sync Day) */}
      {cosmology.isPortalDay && cosmology.diagonalPaths.length > 0 && (
        <Card className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h4 className="font-medium text-sm text-amber-700 dark:text-amber-300">
              {terms.diagonalPaths}
            </h4>
          </div>
          
          <p className="text-xs text-muted-foreground mb-3">
            {mode === 'professional' 
              ? 'As a Sync Day, this tile unlocks cross-functional movement across the matrix.'
              : 'As a Galactic Activation Portal, this tile unlocks diagonal movement across the matrix.'}
          </p>
          
          <div className="grid grid-cols-2 gap-2">
            {cosmology.diagonalPaths.map((path, idx) => {
              const dr = path.to.row - path.from.row;
              const dc = path.to.col - path.from.col;
              
              return (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-amber-500/30 hover:bg-amber-500/10"
                  onClick={() => onDiagonalMove?.(path.to.row, path.to.col)}
                >
                  {getDiagonalIcon(dr, dc)}
                  <span className="text-xs">
                    {getDiagonalName(dr, dc)} to ({path.to.row + 1}, {path.to.col + 1})
                  </span>
                </Button>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};

export default CosmologicalContextTab;
