import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  CASTLES, 
  WAVESPELLS, 
  getSealForKin, 
  getToneForKin, 
  generateAffirmation,
  isPortalDay,
  Castle,
  Wavespell 
} from '@/data/cosmologicalMapping';
import { cn } from '@/lib/utils';
import { Sparkles, ChevronRight, Star } from 'lucide-react';

interface CastleWavespellNavigatorProps {
  currentSeason: 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
  currentKin?: number;
  onKinSelect?: (kin: number) => void;
  onWavespellSelect?: (wavespell: Wavespell) => void;
  className?: string;
}

const CastleWavespellNavigator = ({
  currentSeason,
  currentKin,
  onKinSelect,
  onWavespellSelect,
  className,
}: CastleWavespellNavigatorProps) => {
  const [selectedCastle, setSelectedCastle] = useState<Castle | null>(
    CASTLES.find(c => c.season === currentSeason) || null
  );
  const [selectedWavespell, setSelectedWavespell] = useState<Wavespell | null>(null);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const castleWavespells = selectedCastle 
    ? WAVESPELLS.filter(ws => selectedCastle.wavespells.includes(ws.id))
    : [];

  const getKinsForWavespell = (ws: Wavespell) => {
    const kins = [];
    for (let kin = ws.kinRange[0]; kin <= ws.kinRange[1]; kin++) {
      kins.push(kin);
    }
    return kins;
  };

  const handleCastleClick = (castle: Castle) => {
    setSelectedCastle(castle);
    setSelectedWavespell(null);
  };

  const handleWavespellClick = (wavespell: Wavespell) => {
    setSelectedWavespell(wavespell);
    onWavespellSelect?.(wavespell);
  };

  const handleKinClick = (kin: number) => {
    onKinSelect?.(kin);
    setShowAffirmation(true);
  };

  return (
    <Card className={cn('p-4 bg-background/80 backdrop-blur-sm', className)}>
      {/* Castle Tabs */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
        {CASTLES.map(castle => (
          <Button
            key={castle.id}
            variant={selectedCastle?.id === castle.id ? 'default' : 'ghost'}
            size="sm"
            onClick={() => handleCastleClick(castle)}
            className="shrink-0 gap-1"
            style={{
              backgroundColor: selectedCastle?.id === castle.id ? castle.color : undefined,
              color: selectedCastle?.id === castle.id ? 
                (castle.id === 2 ? '#000' : '#fff') : undefined,
            }}
          >
            <span className="text-xs">{castle.name.split(' ')[0]}</span>
            {castle.season === currentSeason && (
              <Star className="w-3 h-3 fill-current" />
            )}
          </Button>
        ))}
      </div>

      {/* Selected Castle Info */}
      {selectedCastle && (
        <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: selectedCastle.color + '15' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">{selectedCastle.name}</h3>
            <Badge variant="outline" className="text-[10px]">
              Kin {selectedCastle.kinRange[0]}-{selectedCastle.kinRange[1]}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{selectedCastle.theme}</p>
          <div className="flex gap-2 mt-2">
            <Badge className="text-[10px]" style={{ backgroundColor: selectedCastle.color }}>
              {selectedCastle.season}
            </Badge>
            <Badge variant="secondary" className="text-[10px]">
              {selectedCastle.uncurlingPattern}
            </Badge>
          </div>
        </div>
      )}

      {/* Wavespell Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {castleWavespells.map(ws => {
          const seal = getSealForKin(ws.kinRange[0]);
          const isActive = selectedWavespell?.id === ws.id;
          
          return (
            <Button
              key={ws.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={cn(
                'h-auto p-2 flex flex-col items-start justify-start text-left',
                isActive && 'ring-2 ring-primary'
              )}
              onClick={() => handleWavespellClick(ws)}
            >
              <div className="flex items-center gap-1 w-full">
                <span className="text-lg">{seal.glyph}</span>
                <span className="text-xs font-medium truncate">{ws.seal}</span>
                <ChevronRight className="w-3 h-3 ml-auto opacity-50" />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1">{ws.theme}</span>
              <span className="text-[10px] text-muted-foreground">
                Kin {ws.kinRange[0]}-{ws.kinRange[1]}
              </span>
            </Button>
          );
        })}
      </div>

      {/* Kin Grid for Selected Wavespell */}
      {selectedWavespell && (
        <div className="border-t border-border/50 pt-4">
          <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
            <span className="text-lg">{getSealForKin(selectedWavespell.kinRange[0]).glyph}</span>
            {selectedWavespell.seal} Wavespell
          </h4>
          
          <ScrollArea className="h-32">
            <div className="grid grid-cols-13 gap-1">
              {getKinsForWavespell(selectedWavespell).map(kin => {
                const tone = getToneForKin(kin);
                const portal = isPortalDay(kin);
                const isCurrent = kin === currentKin;
                
                return (
                  <Button
                    key={kin}
                    variant={isCurrent ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      'h-8 w-8 p-0 text-xs relative',
                      portal && 'ring-1 ring-purple-500',
                      isCurrent && 'ring-2 ring-primary'
                    )}
                    onClick={() => handleKinClick(kin)}
                    title={`Kin ${kin}: ${tone.name} Tone`}
                  >
                    {tone.number}
                    {portal && (
                      <Sparkles className="w-2 h-2 absolute -top-0.5 -right-0.5 text-purple-500" />
                    )}
                  </Button>
                );
              })}
            </div>
          </ScrollArea>
          
          {/* Tone Legend */}
          <div className="mt-2 text-[10px] text-muted-foreground">
            1-Magnetic → 13-Cosmic
          </div>
        </div>
      )}

      {/* Affirmation Display */}
      {showAffirmation && currentKin && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span className="text-xs font-medium">Kin {currentKin} Affirmation</span>
          </div>
          <p className="text-xs italic whitespace-pre-line text-muted-foreground">
            {generateAffirmation(currentKin)}
          </p>
        </div>
      )}
    </Card>
  );
};

export default CastleWavespellNavigator;
