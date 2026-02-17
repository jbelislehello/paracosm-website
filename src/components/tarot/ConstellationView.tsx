import { useState } from 'react';
import { fullDeck, TarotCard, MajorArcanaCard, MinorArcanaCard, suitColors, dimensionColors } from '@/data/entrepreneurialTarot';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ConstellationViewProps {
  onCardSelect: (card: TarotCard) => void;
}

export default function ConstellationView({ onCardSelect }: ConstellationViewProps) {
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  // Build 8x8 grid lookup
  const gridMap = new Map<string, TarotCard[]>();
  fullDeck.forEach((card) => {
    const key = `${card.matrixPosition.row}-${card.matrixPosition.col}`;
    if (!gridMap.has(key)) gridMap.set(key, []);
    gridMap.get(key)!.push(card);
  });

  const rowLabels = ['Agendas', 'Lens', 'Maps', 'Glitch', 'Drift', 'Tune', 'Shadow', 'Higher Self'];
  const colLabels = ['C', 'H', 'O', 'R', 'D', 'S', 'P', 'S'];

  function getCellColor(cards: TarotCard[]): string {
    if (!cards.length) return 'transparent';
    const card = cards[0];
    if (card.arcana === 'major') return suitColors[(card as MajorArcanaCard).suit];
    return dimensionColors[(card as MinorArcanaCard).dimension];
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h3 className="text-lg font-bold text-center mb-2 text-white/90">Constellation View</h3>
      <p className="text-xs text-center text-slate-400 mb-6">
        The 8×8 matrix mapping every card to its CHORDS × AGENDAS position
      </p>

      <div className="relative">
        {/* Window of Tolerance concentric rings (SVG overlay) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
          {/* Inner ring */}
          <ellipse cx="50" cy="50" rx="20" ry="20" fill="none" stroke="rgba(139,92,246,0.15)" strokeWidth="0.3" strokeDasharray="2 2" />
          {/* Stretch ring */}
          <ellipse cx="50" cy="50" rx="35" ry="35" fill="none" stroke="rgba(245,158,11,0.12)" strokeWidth="0.3" strokeDasharray="3 3" />
          {/* Outer ring */}
          <ellipse cx="50" cy="50" rx="48" ry="48" fill="none" stroke="rgba(239,68,68,0.08)" strokeWidth="0.2" strokeDasharray="4 4" />
          {/* Diagonal fan lines */}
          <line x1="0" y1="0" x2="100" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
          <line x1="100" y1="0" x2="0" y2="100" stroke="rgba(255,255,255,0.04)" strokeWidth="0.2" />
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.03)" strokeWidth="0.15" />
        </svg>

        {/* Column headers */}
        <div className="grid grid-cols-[60px_repeat(8,1fr)] gap-1 mb-1">
          <div />
          {colLabels.map((label, i) => (
            <div key={i} className="text-[9px] text-center text-slate-500 font-mono">{label}</div>
          ))}
        </div>

        {/* Grid */}
        <TooltipProvider delayDuration={100}>
          <div className="grid grid-cols-[60px_repeat(8,1fr)] gap-1 relative z-10">
            {Array.from({ length: 8 }, (_, rowIdx) => {
              const row = rowIdx + 1;
              return (
                <div key={row} className="contents">
                  {/* Row label */}
                  <div className="flex items-center justify-end pr-2 text-[8px] text-slate-500 font-mono leading-tight text-right">
                    {rowLabels[rowIdx]}
                  </div>
                  {/* Cells */}
                  {Array.from({ length: 8 }, (_, colIdx) => {
                    const col = colIdx + 1;
                    const key = `${row}-${col}`;
                    const cards = gridMap.get(key) || [];
                    const color = getCellColor(cards);
                    const isCenter = row === 4 && col === 4;
                    const isHovered = hoveredCell === key;
                    const hasCards = cards.length > 0;

                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <button
                            className={`aspect-square rounded-md transition-all duration-300 relative overflow-hidden border ${
                              hasCards
                                ? 'border-white/10 hover:border-white/30 cursor-pointer'
                                : 'border-white/5 cursor-default'
                            } ${isCenter ? 'ring-1 ring-fuchsia-500/30' : ''}`}
                            style={{
                              background: hasCards
                                ? `radial-gradient(circle, ${color}20, ${color}08)`
                                : 'rgba(255,255,255,0.02)',
                              boxShadow: isHovered && hasCards ? `0 0 20px ${color}30` : undefined,
                            }}
                            onMouseEnter={() => setHoveredCell(key)}
                            onMouseLeave={() => setHoveredCell(null)}
                            onClick={() => cards.length === 1 && onCardSelect(cards[0])}
                          >
                            {/* Glowing node */}
                            {hasCards && (
                              <div
                                className="absolute inset-0 flex items-center justify-center"
                              >
                                <div
                                  className={`w-2 h-2 rounded-full animate-constellation-glow`}
                                  style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}60` }}
                                />
                              </div>
                            )}
                            {/* Card count badge */}
                            {cards.length > 1 && (
                              <div className="absolute top-0.5 right-0.5 text-[7px] text-white/50 font-mono">
                                {cards.length}
                              </div>
                            )}
                          </button>
                        </TooltipTrigger>
                        {hasCards && (
                          <TooltipContent
                            side="top"
                            className="max-w-[220px] bg-slate-900/95 border-slate-700 backdrop-blur-xl"
                          >
                            {cards.map((c) => (
                              <div key={c.id} className="mb-1 last:mb-0">
                                <p className="text-[10px] font-bold text-white">{c.name}</p>
                                <p className="text-[9px] text-slate-400 italic">"{c.question}"</p>
                              </div>
                            ))}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </TooltipProvider>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 justify-center mt-6">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-purple-500/30" />
          <span className="text-[9px] text-slate-500">Inner</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-amber-500/30" />
          <span className="text-[9px] text-slate-500">Stretch</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full border border-red-500/20" />
          <span className="text-[9px] text-slate-500">Outer</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-fuchsia-500/50" />
          <span className="text-[9px] text-slate-500">The Weaver (center)</span>
        </div>
      </div>
    </div>
  );
}
