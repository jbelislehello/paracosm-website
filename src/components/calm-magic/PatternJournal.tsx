// Pattern Journal - Logs all detected patterns throughout the journey

import React, { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { TRIGRAMS } from '@/data/cosmologicalMapping';
import { DetectedPattern, PatternHistoryEntry, getPatternColor } from '@/utils/patternDetection';
import { Clock, Sparkles, Eye, Volume2 } from 'lucide-react';
import { format } from 'date-fns';
import { useCosmologicalAudio } from '@/hooks/useCosmologicalAudio';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface PatternJournalProps {
  patterns: DetectedPattern[];
  patternHistory: PatternHistoryEntry[];
  onPatternClick?: (pattern: DetectedPattern) => void;
}

const PatternJournal: React.FC<PatternJournalProps> = ({
  patterns,
  patternHistory,
  onPatternClick,
}) => {
  const [activeTab, setActiveTab] = useState('active');
  const { playTrigramSound, playHexagramSound, playGeometricPatternSound } = useCosmologicalAudio();
  const { triggerTrigramHaptic, triggerHexagramHaptic, triggerGeometricHaptic } = useHapticFeedback();

  const handlePatternSound = (pattern: DetectedPattern) => {
    if (pattern.type === 'trigram' && pattern.trigramData) {
      playTrigramSound(pattern.trigramData.trigram.name);
      triggerTrigramHaptic(pattern.trigramData.trigram.name);
    } else if (pattern.type === 'hexagram' && pattern.hexagramData) {
      playHexagramSound(pattern.hexagramData.hexagram);
      triggerHexagramHaptic(pattern.hexagramData.hexagram.lines);
    } else if (pattern.type === 'geometric') {
      playGeometricPatternSound(pattern.id.replace('geometric-', ''));
      triggerGeometricHaptic(pattern.id.replace('geometric-', ''));
    }
  };

  // Count discovered trigrams
  const discoveredTrigrams = new Set(
    patternHistory
      .filter(h => h.pattern.type === 'trigram' && h.pattern.trigramData)
      .map(h => h.pattern.trigramData!.trigram.name)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Pattern Journal
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          {patternHistory.length} patterns discovered
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2">
          <TabsTrigger value="active" className="text-xs">Active ({patterns.length})</TabsTrigger>
          <TabsTrigger value="timeline" className="text-xs">Timeline</TabsTrigger>
          <TabsTrigger value="trigrams" className="text-xs">Trigrams</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {patterns.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No active patterns yet</p>
                  <p className="text-xs">Visit 40+ tiles to start detecting</p>
                </div>
              ) : (
                patterns.map(pattern => (
                  <Card 
                    key={pattern.id} 
                    className="p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => onPatternClick?.(pattern)}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="text-2xl"
                        style={{ color: getPatternColor(pattern.type) }}
                      >
                        {pattern.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{pattern.name}</span>
                          <Badge variant="outline" className="text-[10px]">
                            {pattern.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {pattern.meaning}
                        </p>
                        <div className="flex gap-1 mt-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePatternSound(pattern);
                            }}
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Sound
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPatternClick?.(pattern);
                            }}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="timeline" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4 space-y-3">
              {patternHistory.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No patterns discovered yet</p>
                </div>
              ) : (
                patternHistory.map((entry, idx) => (
                  <div key={idx} className="relative pl-6 pb-4">
                    {/* Timeline line */}
                    {idx < patternHistory.length - 1 && (
                      <div className="absolute left-2 top-6 bottom-0 w-px bg-border" />
                    )}
                    {/* Timeline dot */}
                    <div 
                      className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-background"
                      style={{ backgroundColor: getPatternColor(entry.pattern.type) }}
                    />
                    
                    <Card className="p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-lg">{entry.pattern.icon}</span>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{entry.pattern.name}</span>
                          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {format(new Date(entry.discoveredAt), 'MMM d, h:mm a')}
                          </div>
                          <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                            <span>Tiles: {entry.tilesAtDiscovery}</span>
                            <span>•</span>
                            <span>{entry.seasonAtDiscovery}</span>
                          </div>
                          {entry.pattern.insight && (
                            <p className="text-xs text-muted-foreground mt-2 italic line-clamp-2">
                              {entry.pattern.insight}
                            </p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="trigrams" className="flex-1 p-0 m-0">
          <ScrollArea className="h-[400px]">
            <div className="p-4">
              <p className="text-xs text-muted-foreground mb-3">
                {discoveredTrigrams.size}/8 trigrams discovered
              </p>
              <div className="grid grid-cols-2 gap-2">
                {TRIGRAMS.map(trigram => {
                  const isDiscovered = discoveredTrigrams.has(trigram.name);
                  return (
                    <Card 
                      key={trigram.name} 
                      className={`p-3 transition-all ${isDiscovered ? '' : 'opacity-40'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{trigram.symbol}</span>
                        <div>
                          <div className="font-medium text-sm">{trigram.name}</div>
                          <div className="text-xs text-muted-foreground">{trigram.chinese}</div>
                        </div>
                      </div>
                      {isDiscovered && (
                        <>
                          <Separator className="my-2" />
                          <div className="text-xs space-y-1">
                            <p><span className="text-muted-foreground">Element:</span> {trigram.element}</p>
                            <p><span className="text-muted-foreground">Quality:</span> {trigram.quality}</p>
                            <p><span className="text-muted-foreground">Direction:</span> {trigram.direction}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs mt-2 w-full"
                            onClick={() => {
                              playTrigramSound(trigram.name);
                              triggerTrigramHaptic(trigram.name);
                            }}
                          >
                            <Volume2 className="w-3 h-3 mr-1" />
                            Play Sound
                          </Button>
                        </>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatternJournal;
