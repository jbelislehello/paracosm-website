import React, { useState } from 'react';
import { Sparkles, Loader2, Music, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTzolkinResonance, ResonanceMatch } from '@/hooks/useTzolkinResonance';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface TzolkinResonancePanelProps {
  season: Season;
  onTileSelect?: (tileId: number) => void;
}

const SEAL_COLORS: Record<string, string> = {
  Dragon: 'bg-red-500',
  Wind: 'bg-white border border-gray-300',
  Night: 'bg-blue-600',
  Seed: 'bg-yellow-500',
  Serpent: 'bg-red-500',
  Worldbridger: 'bg-white border border-gray-300',
  Hand: 'bg-blue-600',
  Star: 'bg-yellow-500',
  Moon: 'bg-red-500',
  Dog: 'bg-white border border-gray-300',
  Monkey: 'bg-blue-600',
  Human: 'bg-yellow-500',
  Skywalker: 'bg-red-500',
  Wizard: 'bg-white border border-gray-300',
  Eagle: 'bg-blue-600',
  Warrior: 'bg-yellow-500',
  Earth: 'bg-red-500',
  Mirror: 'bg-white border border-gray-300',
  Storm: 'bg-blue-600',
  Sun: 'bg-yellow-500',
};

const TzolkinResonancePanel: React.FC<TzolkinResonancePanelProps> = ({
  season,
  onTileSelect
}) => {
  const [inputText, setInputText] = useState('');
  const { analyzeResonance, isAnalyzing, result, error, clearResult } = useTzolkinResonance();
  const { playTileSound, playResonanceChord } = useCosmologicalAudio();

  const handleAnalyze = async () => {
    const res = await analyzeResonance(inputText, season);
    if (res && res.topMatches.length > 0) {
      // Play resonance chord for top matches
      const tileIds = res.topMatches.slice(0, 3).map(m => m.tileId);
      playResonanceChord(tileIds, season);
    }
  };

  const handleMatchClick = (match: ResonanceMatch) => {
    playTileSound(match.tileId, season);
    onTileSelect?.(match.tileId);
  };

  return (
    <div className="space-y-4">
      <Card className="bg-card/80 backdrop-blur-sm border-primary/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Tzolkin Resonance Detection
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Enter your thoughts, intentions, or questions to discover which solar seals and galactic tones resonate with your energy.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Share your current intention, challenge, or reflection... What's alive in you right now?"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[100px] bg-background/50"
          />
          
          <div className="flex gap-2">
            <Button 
              onClick={handleAnalyze} 
              disabled={isAnalyzing || !inputText.trim()}
              className="flex-1"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Detect Resonance
                </>
              )}
            </Button>
            {result && (
              <Button variant="outline" onClick={clearResult}>
                Clear
              </Button>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </CardContent>
      </Card>

      {result && (
        <>
          {/* Insights Card */}
          <Card className="bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10 border-primary/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground leading-relaxed">
                    {result.insights}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <Badge variant="outline" className="bg-background/50">
                      {result.dominantSeal}
                    </Badge>
                    <Badge variant="outline" className="bg-background/50">
                      {result.dominantTone} Tone
                    </Badge>
                    <Badge 
                      variant="secondary"
                      className="ml-auto"
                    >
                      {Math.round(result.overallResonance)}% resonance
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Matches */}
          <Card className="bg-card/80 backdrop-blur-sm border-border/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Music className="w-4 h-4" />
                Resonating Tiles
                <span className="text-xs text-muted-foreground font-normal ml-1">
                  (click to play tone)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {result.topMatches.map((match, index) => (
                <div
                  key={match.tileId}
                  className="p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors cursor-pointer group"
                  onClick={() => handleMatchClick(match)}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground w-5">
                        #{match.tileId}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${SEAL_COLORS[match.sealName] || 'bg-gray-400'}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{match.sealName}</span>
                        <span className="text-xs text-muted-foreground">
                          {match.toneName}
                        </span>
                        <Volume2 className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity ml-auto" />
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {match.sealMeaning}
                      </p>
                    </div>
                    
                    <div className="w-16 text-right">
                      <Progress 
                        value={match.resonanceScore} 
                        className="h-1.5 mb-1"
                      />
                      <span className="text-xs text-muted-foreground">
                        {Math.round(match.resonanceScore)}%
                      </span>
                    </div>
                  </div>
                  
                  {match.matchedKeywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {match.matchedKeywords.slice(0, 4).map((kw, i) => (
                        <Badge key={i} variant="outline" className="text-xs py-0 h-5">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default TzolkinResonancePanel;
