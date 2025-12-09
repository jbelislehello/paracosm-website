import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { ArrowUp, ArrowRight, ArrowDown, BookOpen, Workflow, Sparkles, Gamepad2, Users } from 'lucide-react';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';

const COMPASSES: { id: CompassType; name: string; description: string; icon: React.ElementType; color: string }[] = [
  { id: 'narrative', name: 'Narrative', description: 'Story & diegetic framing', icon: BookOpen, color: 'from-rose-500 to-pink-500' },
  { id: 'workflow', name: 'Workflow', description: 'Process & methods', icon: Workflow, color: 'from-blue-500 to-cyan-500' },
  { id: 'inquiry', name: 'Inquiry & Practices', description: 'Contemplative & ritual', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
  { id: 'playground', name: 'Playground', description: 'Experimentation & play', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  { id: 'human-dynamics', name: 'Human Dynamics', description: 'Relational & systemic', icon: Users, color: 'from-purple-500 to-indigo-500' },
];

interface TileMatrixProps {
  board?: 'LOVE' | 'MAGIC' | 'CALM' | 'OPEN' | 'FREE';
  onTileClick?: (row: number, col: number) => void;
}

const TileMatrix = ({ board = 'LOVE', onTileClick }: TileMatrixProps) => {
  const [selectedTile, setSelectedTile] = useState<{ row: number; col: number } | null>(null);
  const [activeCompass, setActiveCompass] = useState<CompassType | null>(null);
  
  // Corrected row labels: MAGIC integration (M/A/G/I/C) + N/S/P+A
  const rowLabels = [
    { letter: 'M', name: 'Mindsets', stage: 'AGENDAS', magic: true },
    { letter: 'A', name: 'Agilities', stage: 'AGENDAS', magic: true },
    { letter: 'G', name: 'Goals', stage: 'AGENDAS', magic: true },
    { letter: 'I', name: 'Intuition', stage: 'LENS', magic: true },
    { letter: 'C', name: 'Compasses', stage: 'LENS', magic: true },
    { letter: 'N', name: 'Norms', stage: 'ABOVE', connectsTo: 'Methods' },
    { letter: 'S', name: 'Synergies', stage: 'ABOVE' },
    { letter: 'P+A', name: 'Protocols & Architectures', stage: 'ABOVE', connectsTo: 'Systems' },
  ];
  
  // Corrected column labels: CHORDS + MAPS (Methods & Systems)
  const colLabels = [
    { letter: 'C', name: 'Chances' },
    { letter: 'H', name: 'Heart' },
    { letter: 'O', name: 'Observer' },
    { letter: 'R', name: 'Reversal' },
    { letter: 'D', name: 'Design' },
    { letter: 'S', name: 'Seeds' },
    { letter: 'M', name: 'Methods' },
    { letter: 'S', name: 'Systems' },
  ];
  
  const rowStages = [
    { name: 'AGENDAS', subtitle: 'M/A/G from MAGIC', rows: [0, 1, 2], color: 'from-amber-500/20 to-orange-500/20' },
    { name: 'LENS', subtitle: 'I/C from MAGIC', rows: [3, 4], color: 'from-blue-500/20 to-cyan-500/20' },
    { name: 'ABOVE MAGIC', subtitle: 'N/S/P+A', rows: [5, 6, 7], color: 'from-purple-500/20 to-indigo-500/20' },
  ];

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'from-rose-500 to-pink-500';
      case 'MAGIC': return 'from-purple-500 to-indigo-500';
      case 'CALM': return 'from-blue-500 to-cyan-500';
      case 'OPEN': return 'from-green-500 to-emerald-500';
      case 'FREE': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const isMapsBoundary = (row: number, col: number) => {
    return row >= 5 || col >= 6;
  };

  const hasCrossConnection = (row: number, col: number) => {
    // Norms (row 5) connects to Methods (col 6)
    if (row === 5 && col === 6) return 'norms-methods';
    // P+A (row 7) connects to Systems (col 7)
    if (row === 7 && col === 7) return 'pa-systems';
    return null;
  };

  const handleTileClick = (row: number, col: number) => {
    setSelectedTile({ row, col });
    onTileClick?.(row, col);
  };

  // GL!TCH→DRIFT→TUNE movement pattern from selected tile
  const getMovementTiles = () => {
    if (!selectedTile) return null;
    const { row, col } = selectedTile;
    return {
      glitch: row > 0 ? { row: row - 1, col } : null, // UP
      drift: col < 7 ? { row, col: col + 1 } : null,   // RIGHT
      tune: row < 7 ? { row: row + 1, col } : null,    // DOWN (integration)
    };
  };

  const movementTiles = getMovementTiles();

  const isMovementTile = (row: number, col: number) => {
    if (!movementTiles) return null;
    if (movementTiles.glitch?.row === row && movementTiles.glitch?.col === col) return 'glitch';
    if (movementTiles.drift?.row === row && movementTiles.drift?.col === col) return 'drift';
    if (movementTiles.tune?.row === row && movementTiles.tune?.col === col) return 'tune';
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Board Header */}
      <div className="text-center space-y-2">
        <div className={`inline-block px-6 py-3 rounded-full bg-gradient-to-r ${getBoardColor(board)} text-white font-bold text-xl`}>
          {board} Board
        </div>
        <p className="text-muted-foreground text-sm">8×8 Tile Matrix • MAGIC Integration • Click a tile to see movement pattern</p>
      </div>

      {/* 5 Compasses Selector */}
      <Card className="p-4 bg-gradient-to-r from-background to-muted/20">
        <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          5 Compasses (Row C - Lens Layer)
        </h4>
        <div className="flex flex-wrap gap-2">
          {COMPASSES.map((compass) => {
            const Icon = compass.icon;
            const isActive = activeCompass === compass.id;
            return (
              <button
                key={compass.id}
                onClick={() => setActiveCompass(isActive ? null : compass.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-r ${compass.color} text-white border-transparent shadow-lg`
                    : 'bg-background border-border hover:border-primary/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <div className="text-left">
                  <div className="text-xs font-medium">{compass.name}</div>
                  <div className={`text-[10px] ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                    {compass.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {activeCompass && (
          <p className="text-xs text-muted-foreground mt-2">
            Active lens: <span className="font-medium text-primary">{COMPASSES.find(c => c.id === activeCompass)?.name}</span> — 
            Row C (Compasses) tiles will use this interpretive frame
          </p>
        )}
      </Card>

      {/* Matrix Container */}
      <div className="relative overflow-x-auto">
        <div className="min-w-[900px] space-y-4">
          {/* Column Labels */}
          <div className="flex items-center justify-start ml-28 gap-1">
            {colLabels.map((col, idx) => (
              <div
                key={`col-${idx}`}
                className={`w-16 h-14 flex flex-col items-center justify-center font-bold text-xs ${
                  idx >= 6 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-green-500/10 border-green-500/30'
                } border-2 rounded`}
                title={col.name}
              >
                <span className="text-sm">{col.letter}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full text-center">{col.name}</span>
              </div>
            ))}
          </div>

          {/* CHORDS/MAPS Dimension Labels */}
          <div className="flex items-center justify-start ml-28 gap-1 mb-2">
            <div className="w-[384px] h-8 flex items-center justify-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/30 rounded text-xs font-semibold">
              CHORDS (Chances • Heart • Observer • Reversal • Design • Seeds)
            </div>
            <div className="w-[132px] h-8 flex items-center justify-center bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border-2 border-purple-500/30 rounded text-xs font-semibold">
              MAPS (M • S)
            </div>
          </div>

          {/* Matrix Grid */}
          {rowStages.map((stage) => (
            <div key={stage.name} className="space-y-1">
              {/* Stage Label */}
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className={`w-32 justify-center bg-gradient-to-r ${stage.color} text-xs`}>
                  <div className="flex flex-col items-center leading-tight">
                    <span className="font-bold">{stage.name}</span>
                    <span className="text-[9px] opacity-70">{stage.subtitle}</span>
                  </div>
                </Badge>
              </div>

              {/* Rows in this stage */}
              {stage.rows.map((rowIdx) => {
                const rowInfo = rowLabels[rowIdx];
                return (
                  <div key={`row-${rowIdx}`} className="flex items-center gap-1">
                    {/* Row Label */}
                    <div 
                      className={`w-24 h-16 flex flex-col items-center justify-center font-bold border-2 rounded text-xs transition-all ${
                        rowInfo.magic 
                          ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30' 
                          : 'bg-amber-500/10 border-amber-500/30'
                      } ${rowIdx === 4 && activeCompass ? 'ring-2 ring-primary ring-offset-1 animate-pulse' : ''}`}
                      title={rowInfo.connectsTo ? `Connects to ${rowInfo.connectsTo}` : undefined}
                    >
                      <span className="text-lg">{rowInfo.letter}</span>
                      <span className="text-[9px] text-muted-foreground text-center leading-tight">{rowInfo.name}</span>
                      {rowInfo.connectsTo && (
                        <span className="text-[8px] text-purple-400">↔ {rowInfo.connectsTo}</span>
                      )}
                      {rowIdx === 4 && activeCompass && (
                        <span className="text-[8px] text-primary font-bold">
                          {COMPASSES.find(c => c.id === activeCompass)?.name}
                        </span>
                      )}
                    </div>

                    {/* Tiles */}
                    {colLabels.map((_, colIdx) => {
                      const isMaps = isMapsBoundary(rowIdx, colIdx);
                      const crossConnection = hasCrossConnection(rowIdx, colIdx);
                      const isSelected = selectedTile?.row === rowIdx && selectedTile?.col === colIdx;
                      const movement = isMovementTile(rowIdx, colIdx);
                      
                      return (
                        <button
                          key={`tile-${rowIdx}-${colIdx}`}
                          onClick={() => handleTileClick(rowIdx, colIdx)}
                          className={`w-16 h-16 border-2 rounded transition-all hover:scale-105 hover:shadow-lg relative ${
                            isSelected
                              ? 'ring-2 ring-primary ring-offset-2 bg-primary/20 border-primary'
                              : crossConnection
                                ? 'bg-gradient-to-br from-yellow-500/30 to-orange-500/30 border-yellow-500/50'
                                : isMaps
                                  ? 'bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/40 hover:border-purple-500'
                                  : `bg-gradient-to-br ${getBoardColor(board)}/10 border-primary/20 hover:border-primary`
                          } ${movement ? 'ring-2 ring-offset-1' : ''} ${
                            movement === 'glitch' ? 'ring-red-500' :
                            movement === 'drift' ? 'ring-blue-500' :
                            movement === 'tune' ? 'ring-green-500' : ''
                          }`}
                        >
                          <div className="text-xs text-muted-foreground">
                            {rowInfo.letter}{colLabels[colIdx].letter}
                          </div>
                          {crossConnection && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="text-[8px] text-yellow-600 font-bold">↔</span>
                            </div>
                          )}
                          {movement === 'glitch' && (
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2">
                              <ArrowUp className="w-3 h-3 text-red-500" />
                            </div>
                          )}
                          {movement === 'drift' && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1">
                              <ArrowRight className="w-3 h-3 text-blue-500" />
                            </div>
                          )}
                          {movement === 'tune' && (
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                              <ArrowDown className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Movement Legend */}
      <Card className="p-4 bg-gradient-to-r from-background to-muted/20">
        <h4 className="font-semibold text-sm mb-3">GL!TCH → DRIFT → TUNE Movement Pattern</h4>
        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-red-500 bg-red-500/20 flex items-center justify-center">
              <ArrowUp className="w-3 h-3 text-red-500" />
            </div>
            <span><strong>GL!TCH</strong> - Move UP (what feels off?)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-blue-500 bg-blue-500/20 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 text-blue-500" />
            </div>
            <span><strong>DRIFT</strong> - Move RIGHT (explore options)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded border-2 border-green-500 bg-green-500/20 flex items-center justify-center">
              <ArrowDown className="w-3 h-3 text-green-500" />
            </div>
            <span><strong>TUNE</strong> - Move DOWN (integrate)</span>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">Click any tile to see its movement pattern (inverted L shape)</p>
      </Card>

      {/* Legend */}
      <Card className="p-6 space-y-4">
        <h3 className="font-semibold text-lg">Matrix Structure - MAGIC Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Vertical (Rows) - MAGIC Deployed</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong className="text-purple-400">AGENDAS (1-3):</strong> M/A/G → Mindsets, Agilities, Goals</p>
              <p><strong className="text-purple-400">LENS (4-5):</strong> I/C → Intuition, Compasses (5 families)</p>
              <p className="text-xs italic pl-4 text-purple-300">↳ MAGIC fully deployed by row 5</p>
              <p><strong>ABOVE MAGIC (6-8):</strong> N/S/P+A → Norms, Synergies, Protocols & Architectures</p>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-primary">Horizontal (Columns)</h4>
            <div className="space-y-1 text-muted-foreground">
              <p><strong>CHORDS (1-6):</strong> C/H/O/R/D/S → Chances, Heart, Observer, Reversal, Design, Seeds</p>
              <p><strong>MAPS (7-8):</strong> M/S → Methods, Systems</p>
            </div>
          </div>
        </div>
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-primary">Cross-Connections (Row ↔ Column Resonance)</h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p><strong className="text-yellow-500">Norms (Row 6) ↔ Methods (Col 7):</strong> Ways of behaving connected to ways of doing</p>
            <p><strong className="text-yellow-500">P+A (Row 8) ↔ Systems (Col 8):</strong> Protocols/Architectures connected to system structures</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TileMatrix;
