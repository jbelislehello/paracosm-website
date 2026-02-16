import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, RotateCcw, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import {
  TarotCard, MajorArcanaCard, MinorArcanaCard,
  majorArcana, minorArcana, fullDeck,
  drawCards, drawSpread,
  suitGradients, suitColors, dimensionColors,
  TarotSuit, ChordsDimension,
} from "@/data/entrepreneurialTarot";

// ─── Card Component ───
const TarotCardDisplay = ({
  card, flipped, onClick, reversed,
}: {
  card: TarotCard; flipped: boolean; onClick?: () => void; reversed?: boolean;
}) => {
  const isMajor = card.arcana === 'major';
  const gradient = isMajor
    ? suitGradients[(card as MajorArcanaCard).suit]
    : 'from-slate-600 to-slate-800';
  const accentColor = isMajor
    ? suitColors[(card as MajorArcanaCard).suit]
    : dimensionColors[(card as MinorArcanaCard).dimension];

  return (
    <div
      className="w-56 h-80 cursor-pointer select-none"
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
        {/* Back */}
        <div
          className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border-2 border-slate-600 flex items-center justify-center"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="text-center space-y-2">
            <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
            <p className="text-xs font-medium text-slate-400 tracking-widest uppercase">Calm Magic</p>
            <p className="text-[10px] text-slate-500">Entrepreneurial Tarot</p>
          </div>
        </div>

        {/* Front */}
        <div
          className={`absolute inset-0 rounded-xl bg-gradient-to-br ${gradient} p-4 flex flex-col justify-between text-white shadow-xl`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest opacity-80">
                {isMajor ? (card as MajorArcanaCard).suit : (card as MinorArcanaCard).dimensionName}
              </span>
              {reversed && (
                <span className="text-[9px] bg-white/20 px-1.5 py-0.5 rounded">Reversed</span>
              )}
            </div>
            <div className="text-4xl font-bold mb-1" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
              {isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}
            </div>
            <h3 className="font-bold text-sm">{card.name}</h3>
            {!isMajor && (
              <p className="text-[10px] opacity-70 mt-0.5">{(card as MinorArcanaCard).stage}</p>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[10px] italic opacity-90 leading-relaxed">"{card.question}"</p>
            <div className="border-t border-white/30 pt-2">
              <p className="text-[9px]">
                <span className="font-semibold">{reversed ? '↓ ' : '↑ '}</span>
                {reversed ? card.reversed : card.upright}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Mini Card for browser ───
const MiniCard = ({ card, onClick }: { card: TarotCard; onClick: () => void }) => {
  const isMajor = card.arcana === 'major';
  const gradient = isMajor
    ? suitGradients[(card as MajorArcanaCard).suit]
    : 'from-slate-600 to-slate-700';

  return (
    <button
      onClick={onClick}
      className={`rounded-lg bg-gradient-to-br ${gradient} p-3 text-white text-left hover:scale-105 transition-transform shadow-md`}
    >
      <div className="text-2xl font-bold">
        {isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}
      </div>
      <p className="text-xs font-semibold mt-1">{card.name}</p>
      <p className="text-[9px] opacity-70 mt-0.5 line-clamp-2">{card.question}</p>
    </button>
  );
};

// ─── Detail modal ───
const CardDetail = ({ card, onClose }: { card: TarotCard; onClose: () => void }) => {
  const isMajor = card.arcana === 'major';
  const accentColor = isMajor
    ? suitColors[(card as MajorArcanaCard).suit]
    : dimensionColors[(card as MinorArcanaCard).dimension];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: accentColor }}
          >
            {isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}
          </div>
          <div>
            <h3 className="font-bold text-lg">{card.name}</h3>
            <p className="text-xs text-muted-foreground">
              {isMajor
                ? `${(card as MajorArcanaCard).suit.toUpperCase()} · Major Arcana`
                : `${(card as MinorArcanaCard).dimensionName} · ${(card as MinorArcanaCard).stage}`}
            </p>
          </div>
        </div>
        <p className="text-sm italic text-muted-foreground mb-4">"{card.question}"</p>
        <div className="space-y-3">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">↑ Upright</p>
            <p className="text-sm">{card.upright}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
            <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">↓ Reversed</p>
            <p className="text-sm">{card.reversed}</p>
          </div>
        </div>
        <Button onClick={onClose} variant="outline" className="w-full mt-4">Close</Button>
      </div>
    </div>
  );
};

// ─── Main Page ───
const EntrepreneurialTarot = () => {
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [reversedCards, setReversedCards] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [spreadMode, setSpreadMode] = useState(false);

  const handleDraw = useCallback((count: number) => {
    const cards = drawCards(count);
    setDrawnCards(cards);
    setFlippedCards(new Set());
    const reversed = new Set<number>();
    cards.forEach((_, i) => { if (Math.random() > 0.5) reversed.add(i); });
    setReversedCards(reversed);
    setSpreadMode(count === 3);
  }, []);

  const flipCard = (idx: number) => {
    setFlippedCards((prev) => {
      const next = new Set(prev);
      next.has(idx) ? next.delete(idx) : next.add(idx);
      return next;
    });
  };

  const spreadLabels = ['Past Tension (GL!TCH)', 'Present Drift', 'Future Tune'];
  const suits: TarotSuit[] = ['love', 'magic', 'calm', 'open', 'free'];
  const dimensions: ChordsDimension[] = ['C', 'H', 'O', 'R', 'D', 'S'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 text-white">
      {/* Nav */}
      <header className="fixed w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-purple-900/30">
        <div className="container flex items-center justify-between py-3 px-4">
          <Link to="/" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-purple-400 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </Link>
          <Link to="/paracosm-retreat" className="text-xs text-purple-400 hover:text-purple-300 transition-colors">
            Summer Retreat →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-24 pb-12 px-4 text-center">
        <div className="container max-w-3xl mx-auto">
          <Sparkles className="w-10 h-10 text-amber-400 mx-auto mb-4" />
          <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-400 to-rose-400 mb-4">
            The Calm Magic Tarot
          </h1>
          <p className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto">
            70 entrepreneurial archetypes drawn from the LOVE · MAGIC · CALM · OPEN · FREE quadrants
            and the CHORDS dimensions. A reflective tool for relational intelligence and conscious leadership.
          </p>
        </div>
      </section>

      {/* Draw Section */}
      <section className="pb-12 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button onClick={() => handleDraw(1)} variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/30">
              Draw 1 Card
            </Button>
            <Button onClick={() => handleDraw(3)} variant="outline" className="border-amber-600 text-amber-300 hover:bg-amber-900/30">
              3-Card Spread
            </Button>
            {drawnCards.length > 0 && (
              <Button onClick={() => { setDrawnCards([]); setFlippedCards(new Set()); }} variant="ghost" className="text-slate-400">
                <RotateCcw className="w-4 h-4 mr-1" /> Reset
              </Button>
            )}
          </div>

          {drawnCards.length > 0 && (
            <div className="flex flex-wrap gap-6 justify-center">
              {drawnCards.map((card, idx) => (
                <div key={card.id + idx} className="flex flex-col items-center gap-2">
                  {spreadMode && (
                    <p className="text-xs text-slate-500 font-medium">{spreadLabels[idx]}</p>
                  )}
                  <TarotCardDisplay
                    card={card}
                    flipped={flippedCards.has(idx)}
                    reversed={reversedCards.has(idx)}
                    onClick={() => flipCard(idx)}
                  />
                </div>
              ))}
            </div>
          )}

          {drawnCards.length === 0 && (
            <p className="text-xs text-slate-600">Click a button above to draw from the deck. Tap a card to reveal.</p>
          )}
        </div>
      </section>

      {/* Deck Browser */}
      <section className="pb-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <h2 className="text-xl font-bold text-center mb-6">Browse the Full Deck</h2>
          <Tabs defaultValue="magic" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-1 bg-transparent mb-6">
              {suits.map((s) => (
                <TabsTrigger
                  key={s}
                  value={s}
                  className="text-xs uppercase tracking-wider data-[state=active]:text-white"
                  style={{ '--accent': suitColors[s] } as React.CSSProperties}
                >
                  {s}
                </TabsTrigger>
              ))}
              <TabsTrigger value="chords" className="text-xs uppercase tracking-wider">
                CHORDS
              </TabsTrigger>
            </TabsList>

            {suits.map((s) => (
              <TabsContent key={s} value={s}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {majorArcana.filter((c) => c.suit === s).map((card) => (
                    <MiniCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                  ))}
                </div>
              </TabsContent>
            ))}

            <TabsContent value="chords">
              {dimensions.map((dim) => (
                <div key={dim} className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-400 mb-3 uppercase tracking-wider">
                    {dim} — {minorArcana.find((c) => c.dimension === dim)?.dimensionName}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {minorArcana.filter((c) => c.dimension === dim).map((card) => (
                      <MiniCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {selectedCard && <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
      <Footer />
    </div>
  );
};

export default EntrepreneurialTarot;
