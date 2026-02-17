import { TarotCard, MajorArcanaCard, MinorArcanaCard, suitColors, dimensionColors, suitGradients } from '@/data/entrepreneurialTarot';
import GenerativeCardArt from './GenerativeCardArt';

interface EnhancedCardDisplayProps {
  card: TarotCard;
  flipped: boolean;
  reversed?: boolean;
  onClick?: () => void;
}

export default function EnhancedCardDisplay({ card, flipped, reversed, onClick }: EnhancedCardDisplayProps) {
  const isMajor = card.arcana === 'major';
  const majorCard = isMajor ? (card as MajorArcanaCard) : null;
  const minorCard = !isMajor ? (card as MinorArcanaCard) : null;

  const glowColor = isMajor ? suitColors[majorCard!.suit] : dimensionColors[minorCard!.dimension];
  const gradient = isMajor ? suitGradients[majorCard!.suit] : 'from-slate-800 to-slate-950';

  return (
    <div
      className="w-56 h-80 cursor-pointer select-none group"
      style={{ perspective: '1000px' }}
      onClick={onClick}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        }}
      >
        {/* BACK — generative art */}
        <div
          className="absolute inset-0 rounded-xl border border-slate-700/50 overflow-hidden group-hover:border-purple-500/40 transition-colors duration-500"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <GenerativeCardArt
            matrixPosition={card.matrixPosition}
            suit={isMajor ? majorCard!.suit : undefined}
            dimension={!isMajor ? minorCard!.dimension : undefined}
            breathing
          />
          {/* Address tag */}
          <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-[9px] text-white/60 px-1.5 py-0.5 rounded font-mono">
            {card.matrixPosition.address}
          </div>
          {/* Center glyph */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-5xl font-black text-white/10 select-none"
              style={{ textShadow: `0 0 30px ${glowColor}40` }}
            >
              {isMajor ? majorCard!.letter : minorCard!.dimension}
            </span>
          </div>
          {/* Bottom label */}
          <div className="absolute bottom-3 left-0 right-0 text-center">
            <p className="text-[10px] text-white/40 font-medium tracking-[0.2em] uppercase">Calm Magic</p>
          </div>
        </div>

        {/* FRONT — revealed card */}
        <div
          className={`absolute inset-0 rounded-xl overflow-hidden`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: flipped ? `0 0 30px ${glowColor}30, 0 0 60px ${glowColor}10` : undefined,
          }}
        >
          {/* Generative background at reduced opacity */}
          <div className="absolute inset-0 opacity-30">
            <GenerativeCardArt
              matrixPosition={card.matrixPosition}
              suit={isMajor ? majorCard!.suit : undefined}
              dimension={!isMajor ? minorCard!.dimension : undefined}
              breathing={false}
              reversed={reversed}
            />
          </div>
          {/* Gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-80`} />

          {/* Content */}
          <div className="relative z-10 h-full p-4 flex flex-col justify-between text-white">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] uppercase tracking-[0.2em] opacity-70">
                  {isMajor ? majorCard!.suit : minorCard!.dimensionName}
                </span>
                <span className="text-[8px] font-mono opacity-50">{card.matrixPosition.address}</span>
              </div>
              {reversed && (
                <span className="inline-block text-[8px] bg-white/15 backdrop-blur-sm px-1.5 py-0.5 rounded mb-2">
                  ↓ Reversed
                </span>
              )}
              <div
                className="text-4xl font-black mb-1 transition-transform duration-500"
                style={{
                  textShadow: `0 2px 20px ${glowColor}60`,
                  transform: reversed ? 'scale(0.9)' : 'scale(1)',
                }}
              >
                {isMajor ? majorCard!.letter : minorCard!.dimension}
              </div>
              <h3 className="font-bold text-sm">{card.name}</h3>
              {!isMajor && (
                <p className="text-[10px] opacity-60 mt-0.5">{minorCard!.stage}</p>
              )}
            </div>

            {/* Frosted glass question panel */}
            <div className="space-y-2">
              <div className="bg-white/10 backdrop-blur-md rounded-lg p-2.5 border border-white/10">
                <p className="text-[10px] italic leading-relaxed opacity-90">"{card.question}"</p>
              </div>
              <div className="border-t border-white/20 pt-1.5">
                <p className="text-[9px] opacity-80">
                  <span className="font-semibold">{reversed ? '↓ ' : '↑ '}</span>
                  {reversed ? card.reversed : card.upright}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
