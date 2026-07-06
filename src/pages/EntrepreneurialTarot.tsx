import { useState, useCallback } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Footer from "@/components/Footer";
import {
  TarotCard, MajorArcanaCard, MinorArcanaCard,
  majorArcana, minorArcana,
  drawCards,
  suitGradients, suitColors, dimensionColors,
  TarotSuit, ChordsDimension,
} from "@/data/entrepreneurialTarot";
import EnhancedCardDisplay from "@/components/tarot/EnhancedCardDisplay";
import ConstellationView from "@/components/tarot/ConstellationView";
import MatrixLegend from "@/components/tarot/MatrixLegend";
import GenerativeCardArt from "@/components/tarot/GenerativeCardArt";
import { useLanguage } from "@/contexts/LanguageContext";


// ─── Ambient floating particles ───
const AmbientParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-tarot-stars"
        style={{
          width: `${2 + Math.random() * 3}px`,
          height: `${2 + Math.random() * 3}px`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          background: ['#8b5cf6', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6'][i % 5],
          animationDelay: `${i * 0.5}s`,
          animationDuration: `${3 + Math.random() * 4}s`,
        }}
      />
    ))}
  </div>
);

// ─── Mini Card with generative art ───
const MiniCard = ({ card, onClick }: { card: TarotCard; onClick: () => void }) => {
  const isMajor = card.arcana === 'major';
  const glowColor = isMajor
    ? suitColors[(card as MajorArcanaCard).suit]
    : dimensionColors[(card as MinorArcanaCard).dimension];

  return (
    <button
      onClick={onClick}
      className="rounded-lg text-white text-left hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden group aspect-[3/4]"
    >
      {/* Generative background */}
      <div className="absolute inset-0">
        <GenerativeCardArt
          matrixPosition={card.matrixPosition}
          suit={isMajor ? (card as MajorArcanaCard).suit : undefined}
          dimension={!isMajor ? (card as MinorArcanaCard).dimension : undefined}
          breathing={false}
        />
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ boxShadow: `inset 0 0 25px ${glowColor}25` }} />
      {/* Content */}
      <div className="relative z-10 h-full p-3 flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="text-2xl font-black" style={{ textShadow: `0 1px 10px ${glowColor}60` }}>
            {isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}
          </div>
          <span className="text-[7px] font-mono opacity-40 mt-1">{card.matrixPosition.address}</span>
        </div>
        <div>
          <p className="text-xs font-semibold">{card.name}</p>
          <p className="text-[8px] opacity-60 mt-0.5 line-clamp-2">{card.question}</p>
        </div>
      </div>
    </button>
  );
};

// ─── Detail modal ───
const CardDetail = ({ card, onClose, isFr }: { card: TarotCard; onClose: () => void; isFr: boolean }) => {
  const isMajor = card.arcana === 'major';
  const accentColor = isMajor
    ? suitColors[(card as MajorArcanaCard).suit]
    : dimensionColors[(card as MinorArcanaCard).dimension];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in border border-white/10 relative overflow-hidden"
        style={{ boxShadow: `0 0 50px ${accentColor}20` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 opacity-15">
          <GenerativeCardArt
            matrixPosition={card.matrixPosition}
            suit={isMajor ? (card as MajorArcanaCard).suit : undefined}
            dimension={!isMajor ? (card as MinorArcanaCard).dimension : undefined}
            breathing
          />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg"
              style={{ backgroundColor: accentColor, boxShadow: `0 0 20px ${accentColor}50` }}
            >
              {isMajor ? (card as MajorArcanaCard).letter : (card as MinorArcanaCard).dimension}
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">{card.name}</h3>
              <p className="text-xs text-slate-400">
                {isMajor
                  ? `${(card as MajorArcanaCard).suit.toUpperCase()} · ${isFr ? 'Arcane majeur' : 'Major Arcana'}`
                  : `${(card as MinorArcanaCard).dimensionName} · ${(card as MinorArcanaCard).stage}`}
                <span className="ml-2 font-mono opacity-50">{card.matrixPosition.address}</span>
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md rounded-lg p-3 border border-white/10 mb-4">
            <p className="text-sm italic text-slate-300">"{card.question}"</p>
          </div>

          <div className="space-y-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">↑ {isFr ? 'Droite' : 'Upright'}</p>
              <p className="text-sm text-slate-200">{card.upright}</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-xs font-semibold text-red-400 mb-1">↓ {isFr ? 'Renversée' : 'Reversed'}</p>
              <p className="text-sm text-slate-200">{card.reversed}</p>
            </div>
          </div>
          <Button onClick={onClose} variant="outline" className="w-full mt-4 border-white/20 text-white hover:bg-white/10">
            {isFr ? 'Fermer' : 'Close'}
          </Button>
        </div>
      </div>
    </div>
  );
};


// ─── Main Page ───
const EntrepreneurialTarot = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const [drawnCards, setDrawnCards] = useState<TarotCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [reversedCards, setReversedCards] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [spreadMode, setSpreadMode] = useState(false);

  const heroReveal = useScrollReveal();
  const drawReveal = useScrollReveal();
  const tabsReveal = useScrollReveal({ threshold: 0.1 });
  const footerReveal = useScrollReveal({ threshold: 0.2 });

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

  const spreadLabels = isFr
    ? ['Tension passée (GL!TCH)', 'Dérive présente', 'Accord futur']
    : ['Past Tension (GL!TCH)', 'Present Drift', 'Future Tune'];
  const suits: TarotSuit[] = ['love', 'magic', 'calm', 'open', 'free'];
  const dimensions: ChordsDimension[] = ['C', 'H', 'O', 'R', 'D', 'S'];


  return (
    <div className="min-h-screen bg-white text-slate-900 relative">
      <AmbientParticles />

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
      <section ref={heroReveal.ref} className="pt-24 pb-12 px-4 text-center relative overflow-hidden">
        <div className="container max-w-3xl mx-auto relative z-10">
          <div className={`relative inline-block mb-4 ${heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`}>
            <Sparkles className="w-10 h-10 text-amber-400 animate-tarot-float" />
            <div className="absolute inset-0 w-10 h-10 rounded-full animate-tarot-glow" />
          </div>
          <h1 className={`text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-amber-400 to-rose-400 mb-4 ${heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: '150ms' }}>
            The Calm Magic Tarot
          </h1>
          <p className={`text-sm md:text-base text-slate-400 max-w-2xl mx-auto mb-2 ${heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`}
             style={{ animationDelay: '300ms' }}>
            70 entrepreneurial archetypes drawn from the LOVE · MAGIC · CALM · OPEN · FREE quadrants
            and the CHORDS dimensions. A reflective tool for relational intelligence and conscious leadership.
          </p>
          <p className={`text-xs text-slate-500 ${heroReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`}
             style={{ animationDelay: '450ms' }}>
            Every card maps to the 8×8 Calm Magic matrix — your constellation of entrepreneurial consciousness.
          </p>
        </div>
        {/* Sacred geometry background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-[600px] h-[600px] animate-tarot-rotate-slow">
            <circle cx="100" cy="100" r="80" fill="none" stroke="white" strokeWidth="0.3" />
            <circle cx="100" cy="100" r="60" fill="none" stroke="white" strokeWidth="0.2" />
            <circle cx="100" cy="100" r="40" fill="none" stroke="white" strokeWidth="0.2" />
            <polygon points="100,20 176,140 24,140" fill="none" stroke="white" strokeWidth="0.3" />
            <polygon points="100,180 24,60 176,60" fill="none" stroke="white" strokeWidth="0.3" />
          </svg>
        </div>
      </section>

      {/* Draw Section */}
      <section ref={drawReveal.ref} className={`pb-12 px-4 relative z-10 ${drawReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}`}>
        <div className="container max-w-4xl mx-auto text-center">
          <div className="flex flex-wrap gap-3 justify-center mb-8">
            <Button onClick={() => handleDraw(1)} variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-900/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-shadow">
              Draw 1 Card
            </Button>
            <Button onClick={() => handleDraw(3)} variant="outline" className="border-amber-600 text-amber-300 hover:bg-amber-900/30 hover:shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-shadow">
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
                <div key={card.id + idx} className="flex flex-col items-center gap-2 animate-fade-in" style={{ animationDelay: `${idx * 150}ms` }}>
                  {spreadMode && (
                    <p className="text-xs text-slate-500 font-medium">{spreadLabels[idx]}</p>
                  )}
                  <div className={flippedCards.has(idx) ? 'animate-tarot-float' : ''} style={{ animationDelay: `${idx * 300}ms` }}>
                    <EnhancedCardDisplay
                      card={card}
                      flipped={flippedCards.has(idx)}
                      reversed={reversedCards.has(idx)}
                      onClick={() => flipCard(idx)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {drawnCards.length === 0 && (
            <p className="text-xs text-slate-600">Click a button above to draw from the deck. Tap a card to reveal.</p>
          )}
        </div>
      </section>

      {/* Constellation + Browser + Legend */}
      <section ref={tabsReveal.ref} className={`pb-20 px-4 relative z-10 ${tabsReveal.isVisible ? 'animate-scroll-slide-up' : 'opacity-0'}`}>
        <div className="container max-w-5xl mx-auto">
          <Tabs defaultValue="constellation" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-1 bg-transparent mb-8">
              <TabsTrigger value="constellation" className="text-xs uppercase tracking-wider">
                ✦ Constellation
              </TabsTrigger>
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
              <TabsTrigger value="legend" className="text-xs uppercase tracking-wider">
                Legend
              </TabsTrigger>
            </TabsList>

            {/* Constellation View */}
            <TabsContent value="constellation">
              <ConstellationView onCardSelect={setSelectedCard} />
            </TabsContent>

            {/* Suit tabs */}
            {suits.map((s) => (
              <TabsContent key={s} value={s}>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {majorArcana.filter((c) => c.suit === s).map((card) => (
                    <MiniCard key={card.id} card={card} onClick={() => setSelectedCard(card)} />
                  ))}
                </div>
              </TabsContent>
            ))}

            {/* CHORDS tab */}
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

            {/* Matrix Legend */}
            <TabsContent value="legend">
              <MatrixLegend />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {selectedCard && <CardDetail card={selectedCard} onClose={() => setSelectedCard(null)} />}
      <div ref={footerReveal.ref} className={footerReveal.isVisible ? 'animate-scroll-fade-up' : 'opacity-0'}>
        <Footer />
      </div>
    </div>
  );
};

export default EntrepreneurialTarot;
