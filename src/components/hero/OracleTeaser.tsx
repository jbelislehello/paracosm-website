import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { drawCards, suitColors } from '@/data/entrepreneurialTarot';
import type { TarotCard } from '@/data/entrepreneurialTarot';
import GenerativeCardArt from '@/components/tarot/GenerativeCardArt';

export default function OracleTeaser() {
  const [card, setCard] = useState<TarotCard | null>(null);
  const [revealed, setRevealed] = useState(false);

  const handleDraw = () => {
    const [drawn] = drawCards(1);
    setCard(drawn);
    setRevealed(false);
    // trigger fade-in on next frame
    requestAnimationFrame(() => setRevealed(true));
  };

  const suit = card?.arcana === 'major' ? card.suit : undefined;
  const dimension = card?.arcana === 'minor' ? card.dimension : undefined;
  const accentColor = suit ? suitColors[suit] : '#8b5cf6';
  const coordLabel = card
    ? `${card.arcana === 'major' ? card.suit[0].toUpperCase() : card.dimension}${card.matrixPosition.row}.${card.matrixPosition.col}`
    : '';

  return (
    <div className="mt-6 flex flex-col items-center gap-4">
      <Button
        onClick={handleDraw}
        variant="outline"
        className="group border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 text-foreground gap-2 px-5 py-2.5 rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
      >
        <Sparkles className="w-4 h-4 text-purple-400 group-hover:text-purple-300 transition-colors" />
        <span className="font-medium">Draw from the Oracle</span>
      </Button>

      {card && (
        <div
          className="w-full max-w-md transition-all duration-500 ease-out"
          style={{
            opacity: revealed ? 1 : 0,
            transform: revealed ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <div className="flex items-stretch gap-4 p-4 rounded-xl backdrop-blur-md bg-white/5 dark:bg-slate-900/30 border border-white/10">
            {/* Generative art thumbnail */}
            <div className="w-24 h-32 flex-shrink-0 rounded-lg overflow-hidden border border-white/10">
              <GenerativeCardArt
                matrixPosition={card.matrixPosition}
                suit={suit}
                dimension={dimension}
                breathing
              />
            </div>

            {/* Card info */}
            <div className="flex flex-col justify-center gap-1.5 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: `${accentColor}33`, color: accentColor }}
                >
                  {coordLabel}
                </span>
                {suit && (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {suit}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-foreground truncate">{card.name}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {card.question}
              </p>
            </div>
          </div>

          {/* Link to full deck */}
          <Link
            to="/tarot"
            className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors group/link"
          >
            <span>Explore the Full Deck</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      )}
    </div>
  );
}
