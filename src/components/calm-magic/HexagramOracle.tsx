import React, { useState, useCallback } from 'react';
import { Sparkles, RefreshCw, BookOpen, Compass, Heart, Brain, Zap, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import HexagramDisplay from './HexagramDisplay';
import { getHexagramByNumber, Hexagram } from '@/data/cosmologicalMapping';
import { useHexagramJournal } from '@/hooks/useHexagramJournal';
import { useMode } from './context/ModeContext';
import { getTerminology } from '@/data/modeAwareTerminology';
interface HexagramOracleProps {
  currentTileId: number | null;
  visitedTiles: Set<number>;
  emotionalState?: {
    feltState: 'stuck' | 'flowing' | 'breakthrough';
    vitality: number;
    spaciousness: number;
    wholeness: number;
    openness: number;
    expansion: number;
  };
}

// I Ching hexagram meanings (supplementary data)
const HEXAGRAM_JUDGMENTS: Record<number, {
  judgment: string;
  image: string;
}> = {
  1: { judgment: 'The Creative works sublime success, furthering through perseverance.', image: 'Heaven above, heaven below. The movement of heaven is full of power.' },
  2: { judgment: 'The Receptive brings about sublime success, furthering through the perseverance of a mare.', image: 'Earth above, earth below. The earth carries all things.' },
  3: { judgment: 'Difficulty at the beginning works supreme success through perseverance.', image: 'Thunder and rain arise. The noble one brings order out of confusion.' },
  4: { judgment: 'Youthful folly has success. I do not seek the young fool; the young fool seeks me.', image: 'A spring wells up at the foot of the mountain.' },
  5: { judgment: 'Waiting. If you are sincere, you have light and success.', image: 'Clouds rise up to heaven. The noble one eats, drinks, and is joyous.' },
  11: { judgment: 'Peace. The small departs, the great approaches.', image: 'Heaven and earth unite. The ruler divides the course of heaven and earth.' },
  12: { judgment: 'Standstill. Evil people do not further the perseverance of the superior person.', image: 'Heaven and earth do not unite.' },
  15: { judgment: 'Modesty creates success.', image: 'Within the earth, a mountain.' },
  24: { judgment: 'Return. Success. Going out and coming in without error.', image: 'Thunder within the earth.' },
  29: { judgment: 'The Abysmal repeated. If you are sincere, you have success in your heart.', image: 'Water flows on and reaches the goal.' },
  30: { judgment: 'The Clinging. Perseverance furthers.', image: 'That which is bright rises twice.' },
  42: { judgment: 'Increase. It furthers one to undertake something.', image: 'Wind and thunder increase.' },
  49: { judgment: 'Revolution. On your own day you are believed.', image: 'Fire in the lake. The noble one sets the calendar in order.' },
  52: { judgment: 'Keeping Still. Keep your back still so you no longer feel your body.', image: 'Mountains standing close together.' },
  61: { judgment: 'Inner Truth. Pigs and fishes bring good fortune.', image: 'Wind over lake. The noble one discusses criminal cases.' },
  63: { judgment: 'After Completion. Success in small matters.', image: 'Water over fire.' },
  64: { judgment: 'Before Completion. Success approaches.', image: 'Fire over water.' },
};

// Fill in defaults for missing hexagrams
const getJudgment = (num: number) => 
  HEXAGRAM_JUDGMENTS[num] || { 
    judgment: 'This hexagram speaks to the current moment and its possibilities.', 
    image: 'The image reveals patterns of transformation.' 
  };

export const HexagramOracle: React.FC<HexagramOracleProps> = ({
  currentTileId,
  visitedTiles,
  emotionalState,
}) => {
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<{
    primary: Hexagram;
    relating?: Hexagram;
    changingLines: number[];
    interpretation: string;
  } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { saveReading } = useHexagramJournal();
  const { mode } = useMode();
  const terms = getTerminology(mode);
  const generateReading = useCallback(async () => {
    setIsGenerating(true);
    setShowAnimation(true);
    
    // Simulate coin tosses with journey context influence
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Calculate hexagram based on journey position and emotional state
    const journeyProgress = visitedTiles.size / 64;
    const emotionalInfluence = emotionalState ? (
      (emotionalState.vitality + emotionalState.spaciousness + 
       emotionalState.wholeness + emotionalState.openness + 
       emotionalState.expansion) / 500
    ) : 0.5;
    
    // Use question hash for deterministic but seemingly random selection
    const questionHash = question.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const timeEntropy = Date.now() % 1000;
    
    // Generate primary hexagram (1-64)
    const primarySeed = (questionHash + timeEntropy + (currentTileId || 0) + Math.floor(journeyProgress * 64)) % 64;
    const primaryNum = primarySeed + 1;
    const primary = getHexagramByNumber(primaryNum);
    
    // Determine changing lines based on emotional state
    const changingLines: number[] = [];
    const changeThreshold = emotionalState?.feltState === 'breakthrough' ? 0.6 :
                            emotionalState?.feltState === 'stuck' ? 0.3 : 0.45;
    
    for (let i = 0; i < 6; i++) {
      const lineChance = (Math.sin(questionHash * (i + 1)) + 1) / 2;
      if (lineChance > changeThreshold && changingLines.length < 3) {
        changingLines.push(i + 1);
      }
    }
    
    // Calculate relating hexagram if there are changing lines
    let relating: Hexagram | undefined;
    if (changingLines.length > 0) {
      const relatingSeed = (primaryNum + changingLines.reduce((a, b) => a + b, 0) + 
                           Math.floor(emotionalInfluence * 32)) % 64;
      relating = getHexagramByNumber(relatingSeed + 1);
    }
    
    // Generate interpretation based on context
    const primaryJudgment = getJudgment(primaryNum);
    
    let interpretation = `**${primary.name}** (${primary.chineseName}) speaks to your question.\n\n`;
    interpretation += `*${primaryJudgment.judgment}*\n\n`;
    
    if (emotionalState) {
      const stateContext = emotionalState.feltState === 'stuck' 
        ? 'Given your current sense of stuckness, this hexagram suggests patience and inner cultivation.'
        : emotionalState.feltState === 'breakthrough'
        ? 'Your breakthrough energy aligns with this hexagram\'s transformative potential.'
        : 'In your flowing state, this hexagram offers guidance for maintaining momentum.';
      interpretation += `${stateContext}\n\n`;
    }
    
    if (currentTileId) {
      interpretation += `At tile ${currentTileId}, with ${visitedTiles.size} tiles explored, `;
      interpretation += `the oracle suggests focusing on: ${primary.keywords.join(', ')}.\n\n`;
    }
    
    if (changingLines.length > 0 && relating) {
      interpretation += `**Changing lines** (${changingLines.join(', ')}) point toward **${relating.name}**. `;
      interpretation += `This transition suggests: ${relating.keywords.join(', ')}.`;
    }
    
    setReading({ primary, relating, changingLines, interpretation });
    setIsGenerating(false);
    setTimeout(() => setShowAnimation(false), 500);
  }, [question, currentTileId, visitedTiles, emotionalState]);

  const clearReading = () => {
    setReading(null);
    setQuestion('');
    setIsSaved(false);
  };

  const handleSaveReading = async () => {
    if (!reading) return;
    
    const saved = await saveReading({
      question: question || 'No question specified',
      primary_hexagram: reading.primary.number,
      relating_hexagram: reading.relating?.number || null,
      changing_lines: reading.changingLines,
      interpretation: reading.interpretation,
      tile_id: currentTileId,
      cycle_id: null,
      emotional_state: emotionalState || null,
      tags: reading.primary.keywords,
      reflection: null
    });
    
    if (saved) {
      setIsSaved(true);
    }
  };
  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <BookOpen className="w-5 h-5 text-primary" />
          {terms.hexagramOracle}
          <Badge variant="outline" className="ml-auto text-xs">
            {terms.iChing}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Context indicators */}
        <div className="flex flex-wrap gap-2 text-xs">
          {currentTileId && (
            <Badge variant="secondary" className="gap-1">
              <Compass className="w-3 h-3" />
              {terms.positionLabel} {currentTileId}
            </Badge>
          )}
          <Badge variant="secondary" className="gap-1">
            <Zap className="w-3 h-3" />
            {visitedTiles.size}/64 {terms.tilesExplored}
          </Badge>
          {emotionalState && (
            <Badge variant="secondary" className="gap-1">
              <Heart className="w-3 h-3" />
              {emotionalState.feltState}
            </Badge>
          )}
        </div>

        {!reading ? (
          <>
            {/* Question input */}
            <div className="space-y-2">
              <Textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder={terms.oracleQuestionPlaceholder}
                className="min-h-[80px] resize-none"
              />
            </div>

            {/* Cast button */}
            <Button 
              onClick={generateReading} 
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  {terms.consultingTheOracle}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  {terms.castTheOracle}
                </>
              )}
            </Button>
          </>
        ) : (
          <>
            {/* Reading display */}
            <div className="flex items-start gap-4">
              {/* Primary hexagram */}
              <div className={`text-primary ${showAnimation ? 'animate-pulse' : ''}`}>
                <HexagramDisplay 
                  hexagram={reading.primary} 
                  size="lg"
                  showDetails={false}
                  changingLines={reading.changingLines}
                />
              </div>

              {/* Arrow and relating hexagram */}
              {reading.relating && (
                <>
                  <div className="flex flex-col items-center justify-center h-24">
                    <span className="text-muted-foreground">→</span>
                    <span className="text-xs text-muted-foreground">
                      {terms.changingLines} {reading.changingLines.join(',')}
                    </span>
                  </div>
                  <div className="text-muted-foreground">
                    <HexagramDisplay 
                      hexagram={reading.relating} 
                      size="md"
                      showDetails={false}
                    />
                  </div>
                </>
              )}
            </div>

            {/* Primary hexagram name */}
            <div className="text-center">
              <h3 className="font-semibold">{reading.primary.name}</h3>
              <p className="text-xs text-muted-foreground">{reading.primary.meaning}</p>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap gap-1">
              {reading.primary.keywords.map((kw) => (
                <Badge key={kw} variant="outline" className="text-xs">
                  {kw}
                </Badge>
              ))}
            </div>

            {/* Interpretation */}
            <ScrollArea className="h-40">
              <div className="prose prose-sm dark:prose-invert">
                {reading.interpretation.split('\n\n').map((para, idx) => {
                  // Safely render bold (**text**) and italic (*text*) without
                  // dangerouslySetInnerHTML to prevent XSS from AI-generated content.
                  const tokens = para.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
                  return (
                    <p key={idx} className="text-sm text-muted-foreground mb-2">
                      {tokens.map((tok, i) => {
                        if (/^\*\*[^*]+\*\*$/.test(tok)) {
                          return <strong key={i}>{tok.slice(2, -2)}</strong>;
                        }
                        if (/^\*[^*]+\*$/.test(tok)) {
                          return <em key={i}>{tok.slice(1, -1)}</em>;
                        }
                        return <span key={i}>{tok}</span>;
                      })}
                    </p>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearReading} className="flex-1">
                <RefreshCw className="w-4 h-4 mr-2" />
                {terms.newReading}
              </Button>
              <Button 
                variant={isSaved ? "secondary" : "default"}
                onClick={handleSaveReading}
                disabled={isSaved}
                className="gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
            </div>
          </>
        )}

        {/* Image text */}
        {reading && (
          <p className="text-xs italic text-muted-foreground border-l-2 border-primary/30 pl-3">
            {getJudgment(reading.primary.number).image}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default HexagramOracle;
