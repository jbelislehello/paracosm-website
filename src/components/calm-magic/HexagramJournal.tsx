import React, { useState } from 'react';
import { useHexagramJournal, HexagramReading } from '@/hooks/useHexagramJournal';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  MessageSquare,
  BarChart3,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { getHexagramByNumber } from '@/data/cosmologicalMapping';

interface HexagramJournalProps {
  onSelectReading?: (reading: HexagramReading) => void;
}

export const HexagramJournal: React.FC<HexagramJournalProps> = ({ onSelectReading }) => {
  const { readings, loading, analysis, updateReflection, deleteReading } = useHexagramJournal();
  const [expandedReading, setExpandedReading] = useState<string | null>(null);
  const [editingReflection, setEditingReflection] = useState<string | null>(null);
  const [reflectionText, setReflectionText] = useState('');

  const handleSaveReflection = async (id: string) => {
    await updateReflection(id, reflectionText);
    setEditingReflection(null);
    setReflectionText('');
  };

  const startEditReflection = (reading: HexagramReading) => {
    setEditingReflection(reading.id);
    setReflectionText(reading.reflection || '');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="readings" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="readings" className="gap-2">
            <BookOpen className="h-4 w-4" />
            Readings ({readings.length})
          </TabsTrigger>
          <TabsTrigger value="patterns" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Patterns
          </TabsTrigger>
        </TabsList>

        <TabsContent value="readings" className="mt-4">
          {readings.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No oracle readings yet.</p>
                <p className="text-sm text-muted-foreground">
                  Cast your first reading in the Oracle tab.
                </p>
              </CardContent>
            </Card>
          ) : (
            <ScrollArea className="h-[400px]">
              <div className="space-y-3 pr-4">
                {readings.map((reading) => {
                  const hexagram = getHexagramByNumber(reading.primary_hexagram);
                  const isExpanded = expandedReading === reading.id;
                  
                  return (
                    <Card 
                      key={reading.id} 
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setExpandedReading(isExpanded ? null : reading.id)}
                    >
                      <CardHeader className="p-4 pb-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center text-xl font-bold text-primary">
                              {reading.primary_hexagram}
                            </div>
                            <div>
                            </div>
                            <div>
                              <CardTitle className="text-sm font-medium">
                                #{reading.primary_hexagram} {hexagram?.name || 'Unknown'}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {format(new Date(reading.created_at), 'MMM d, yyyy h:mm a')}
                              </p>
                            </div>
                          </div>
                          {reading.relating_hexagram && (
                            <Badge variant="outline" className="text-xs">
                              → #{reading.relating_hexagram}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          "{reading.question}"
                        </p>

                        {isExpanded && (
                          <div className="mt-4 space-y-4 border-t pt-4" onClick={e => e.stopPropagation()}>
                            {reading.interpretation && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">Interpretation</h4>
                                <p className="text-sm">{reading.interpretation}</p>
                              </div>
                            )}

                            {reading.changing_lines && reading.changing_lines.length > 0 && (
                              <div>
                                <h4 className="text-xs font-medium text-muted-foreground mb-1">Changing Lines</h4>
                                <div className="flex gap-1">
                                  {reading.changing_lines.map(line => (
                                    <Badge key={line} variant="secondary" className="text-xs">
                                      Line {line}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {reading.tile_id && (
                              <Badge variant="outline" className="text-xs">
                                Tile #{reading.tile_id}
                              </Badge>
                            )}

                            <div className="space-y-2">
                              <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Personal Reflection
                              </h4>
                              
                              {editingReflection === reading.id ? (
                                <div className="space-y-2">
                                  <Textarea
                                    value={reflectionText}
                                    onChange={(e) => setReflectionText(e.target.value)}
                                    placeholder="What insights arose from this reading?"
                                    className="min-h-[80px] text-sm"
                                  />
                                  <div className="flex gap-2">
                                    <Button size="sm" onClick={() => handleSaveReflection(reading.id)}>
                                      Save
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setEditingReflection(null)}>
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div 
                                  className="text-sm p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted"
                                  onClick={() => startEditReflection(reading)}
                                >
                                  {reading.reflection || (
                                    <span className="text-muted-foreground italic">
                                      Click to add a reflection...
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>

                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-destructive hover:text-destructive"
                              onClick={() => deleteReading(reading.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        <TabsContent value="patterns" className="mt-4">
          {!analysis ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Not enough readings for pattern analysis.</p>
                <p className="text-sm text-muted-foreground">
                  Cast more readings to see patterns emerge.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Most Frequent Hexagrams
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-3">
                    {analysis.mostFrequentHexagrams.map(({ hexagram, count, contexts }) => {
                      const hex = getHexagramByNumber(hexagram);
                      return (
                        <div key={hexagram} className="flex items-center gap-3">
                          <div className="w-8 h-8 flex items-center justify-center text-lg font-bold text-primary">
                            {hexagram}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium">
                                #{hexagram} {hex?.name || 'Unknown'}
                              </span>
                              <Badge variant="secondary">{count}x</Badge>
                            </div>
                            {contexts.length > 0 && (
                              <p className="text-xs text-muted-foreground truncate">
                                "{contexts[0]}..."
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {analysis.changingLinePatterns.length > 0 && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Changing Line Patterns</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-2">
                      {analysis.changingLinePatterns.map(({ line, count }) => (
                        <div key={line} className="flex items-center gap-1">
                          <Badge variant="outline">
                            Line {line}: {count}x
                          </Badge>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {analysis.changingLinePatterns[0]?.line && (
                        <>Line {analysis.changingLinePatterns[0].line} appears most frequently in your readings.</>
                      )}
                    </p>
                  </CardContent>
                </Card>
              )}

              {analysis.hexagramPairs.length > 0 && (
                <Card>
                  <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm">Recurring Transformations</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="space-y-2">
                      {analysis.hexagramPairs.map(({ primary, relating, count }) => {
                        const primaryHex = getHexagramByNumber(primary);
                        const relatingHex = getHexagramByNumber(relating);
                        return (
                          <div key={`${primary}-${relating}`} className="flex items-center gap-2 text-sm">
                            <span>#{primary} {primaryHex?.name}</span>
                            <span className="text-muted-foreground">→</span>
                            <span>#{relating} {relatingHex?.name}</span>
                            <Badge variant="secondary" className="ml-auto">{count}x</Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-sm text-muted-foreground">
                  <p>
                    You have cast <strong className="text-foreground">{analysis.totalReadings}</strong> oracle readings.
                    {analysis.mostFrequentHexagrams[0] && (
                      <> Hexagram #{analysis.mostFrequentHexagrams[0].hexagram} appears most often, 
                      suggesting themes of {getHexagramByNumber(analysis.mostFrequentHexagrams[0].hexagram)?.keywords?.join(', ') || 'transformation'}.</>
                    )}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
