// Pattern Encyclopedia - Educational page explaining all patterns

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Volume2, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TRIGRAMS, HEXAGRAMS } from '@/data/cosmologicalMapping';
import { getAllPatternDefinitions, getPatternColor } from '@/utils/patternDetection';
import MiniMatrixPreview from '@/components/calm-magic/encyclopedia/MiniMatrixPreview';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

const PatternEncyclopedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trigrams');
  const { playTrigramSound, playHexagramSound, playGeometricPatternSound } = useCosmologicalAudio();
  const { triggerTrigramHaptic, triggerGeometricHaptic } = useHapticFeedback();
  const { geometric } = getAllPatternDefinitions();

  // Generate example tile patterns for trigrams
  const getTrigramExampleTiles = (lines: boolean[]): string[] => {
    return lines.map((isYang, i) => isYang ? `${i}-0` : '').filter(Boolean);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to="/calm-magic-board">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5" /> Pattern Encyclopedia
              </h1>
              <p className="text-sm text-muted-foreground">
                Discover patterns hidden within the Calm Magic matrix
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="trigrams">☰ Trigrams (8)</TabsTrigger>
            <TabsTrigger value="geometric">◇ Geometric ({geometric.length})</TabsTrigger>
            <TabsTrigger value="hexagrams">䷀ Hexagrams (64)</TabsTrigger>
          </TabsList>

          {/* Trigrams Section */}
          <TabsContent value="trigrams">
            <div className="mb-4">
              <p className="text-muted-foreground">
                The 8 I Ching trigrams are 3-line patterns representing fundamental forces. 
                They appear when you visit 3 consecutive tiles matching a yin/yang pattern.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {TRIGRAMS.map(trigram => (
                <Card key={trigram.name} className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-4xl">{trigram.symbol}</span>
                    <div>
                      <h3 className="font-bold">{trigram.name}</h3>
                      <p className="text-sm text-muted-foreground">{trigram.chinese}</p>
                    </div>
                  </div>
                  <Separator className="my-3" />
                  <div className="text-sm space-y-1 mb-3">
                    <p><span className="text-muted-foreground">Element:</span> {trigram.element}</p>
                    <p><span className="text-muted-foreground">Quality:</span> {trigram.quality}</p>
                    <p><span className="text-muted-foreground">Direction:</span> {trigram.direction}</p>
                    <p><span className="text-muted-foreground">Season:</span> {trigram.season}</p>
                  </div>
                  <Separator className="my-3" />
                  <div className="mb-3">
                    <p className="text-xs font-medium mb-2">How to Create:</p>
                    <p className="text-xs text-muted-foreground">
                      Visit 3 consecutive tiles: {trigram.lines.map(l => l ? '▬' : '- -').join(' ')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      playTrigramSound(trigram.name);
                      triggerTrigramHaptic(trigram.name);
                    }}
                  >
                    <Volume2 className="w-3 h-3 mr-1" /> Play Sound
                  </Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Geometric Section */}
          <TabsContent value="geometric">
            <div className="mb-4">
              <p className="text-muted-foreground">
                Geometric patterns emerge from the spatial arrangement of your visited tiles.
                They require at least 40 tiles visited to detect.
              </p>
            </div>
            <div className="space-y-4">
              {geometric.map(pattern => (
                <Card key={pattern.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="text-center min-w-[80px]">
                      <span className="text-4xl" style={{ color: getPatternColor('geometric') }}>
                        {pattern.icon}
                      </span>
                      <h3 className="font-bold mt-1">{pattern.name}</h3>
                      <Badge variant="outline" className="mt-1">{pattern.minTiles}+ tiles</Badge>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{pattern.description}</p>
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs font-medium mb-1">How to Create:</p>
                        <p className="text-xs text-muted-foreground">{pattern.howToCreate}</p>
                      </div>
                      <div className="mt-3">
                        <p className="text-xs font-medium mb-1">Meaning:</p>
                        <p className="text-xs text-muted-foreground">{pattern.meaning}</p>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {pattern.keywords.map(kw => (
                          <Badge key={kw} variant="secondary" className="text-xs">{kw}</Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        playGeometricPatternSound(pattern.id);
                        triggerGeometricHaptic(pattern.id);
                      }}
                    >
                      <Volume2 className="w-3 h-3 mr-1" /> Sound
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Hexagrams Section */}
          <TabsContent value="hexagrams">
            <div className="mb-4">
              <p className="text-muted-foreground">
                The 64 I Ching hexagrams are 6-line patterns. They form when you visit 6 tiles 
                in a column matching the hexagram's line pattern.
              </p>
            </div>
            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {HEXAGRAMS.map(hex => (
                  <Card key={hex.number} className="p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{hex.number}</Badge>
                      <span className="font-medium text-sm">{hex.name}</span>
                      <span className="text-muted-foreground text-xs">{hex.chineseName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{hex.meaning}</p>
                    <div className="flex gap-1 text-xs">
                      <span className="text-muted-foreground">Lines:</span>
                      {hex.lines.map((l, i) => (
                        <span key={i}>{l ? '▬' : '- -'}</span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PatternEncyclopedia;
