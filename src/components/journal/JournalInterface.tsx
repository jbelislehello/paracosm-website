
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { JournalEntry, EmotionalState, GardenType } from '@/types/journal';
import { gardens } from '@/data/gardens';

interface JournalInterfaceProps {
  garden: GardenType;
  emotionalState: EmotionalState | null;
  onSaveEntry: (entry: Omit<JournalEntry, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => void;
  loading: boolean;
}

const JournalInterface: React.FC<JournalInterfaceProps> = ({ 
  garden, 
  emotionalState, 
  onSaveEntry, 
  loading 
}) => {
  const [entry, setEntry] = useState<Partial<JournalEntry>>({
    garden,
    title: '',
    content: '',
    situation_context: '',
    rising_question: '',
    insights: ''
  });

  const [shadowSelfNotes, setShadowSelfNotes] = useState('');
  const [higherSelfNotes, setHigherSelfNotes] = useState('');

  const currentGarden = gardens.find(g => g.type === garden);

  const handleSave = () => {
    if (!entry.title || !entry.content) return;

    onSaveEntry({
      garden: entry.garden!,
      title: entry.title,
      content: entry.content,
      situation_context: entry.situation_context,
      rising_question: entry.rising_question,
      insights: entry.insights,
      emotional_state_id: emotionalState?.id
    });

    // Reset form
    setEntry({
      garden,
      title: '',
      content: '',
      situation_context: '',
      rising_question: '',
      insights: ''
    });
    setShadowSelfNotes('');
    setHigherSelfNotes('');
  };

  const getGardenPrompts = (gardenType: GardenType) => {
    switch (gardenType) {
      case 'intelligence':
        return {
          situation: "What information or knowledge is seeking to emerge?",
          rising: "What question is the data asking us?",
          reflection: "What patterns or insights are becoming visible?"
        };
      case 'systems':
        return {
          situation: "What system dynamics are you observing?",
          rising: "What wants to change or transform?",
          reflection: "How might this system evolve?"
        };
      case 'prototypes':
        return {
          situation: "What future is trying to emerge?",
          rising: "What story wants to be told?",
          reflection: "What would this look like if it were real?"
        };
      default:
        return {
          situation: "What situation are you exploring?",
          rising: "What question is arising?",
          reflection: "What insights are emerging?"
        };
    }
  };

  const prompts = getGardenPrompts(garden);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div 
              className="p-2 rounded-full text-2xl"
              style={{ backgroundColor: `${currentGarden?.color}20` }}
            >
              {currentGarden?.icon}
            </div>
            Reflection in the {currentGarden?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="journal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="journal">Journal Entry</TabsTrigger>
              <TabsTrigger value="shadow">Shadow & Higher Self</TabsTrigger>
            </TabsList>
            
            <TabsContent value="journal" className="space-y-4">
              <div>
                <Label htmlFor="title">Entry Title</Label>
                <Input
                  id="title"
                  placeholder="Give your reflection a title..."
                  value={entry.title || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="situation">{prompts.situation}</Label>
                <Textarea
                  id="situation"
                  placeholder="Describe the context or situation..."
                  value={entry.situation_context || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, situation_context: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="question">{prompts.rising}</Label>
                <Textarea
                  id="question"
                  placeholder="What question is emerging for you?"
                  value={entry.rising_question || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, rising_question: e.target.value }))}
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="content">Your Reflection</Label>
                <Textarea
                  id="content"
                  placeholder="Share your thoughts, observations, and reflections..."
                  value={entry.content || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, content: e.target.value }))}
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="insights">{prompts.reflection}</Label>
                <Textarea
                  id="insights"
                  placeholder="What insights are crystallizing?"
                  value={entry.insights || ''}
                  onChange={(e) => setEntry(prev => ({ ...prev, insights: e.target.value }))}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="shadow" className="space-y-4">
              <div>
                <Label htmlFor="shadow">Shadow Self - Fears & Blockages</Label>
                <Textarea
                  id="shadow"
                  placeholder="What fears, resistances, or blockages are present?"
                  value={shadowSelfNotes}
                  onChange={(e) => setShadowSelfNotes(e.target.value)}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="higher">Higher Self - Potential & Clarity</Label>
                <Textarea
                  id="higher"
                  placeholder="What potential, wisdom, or clarity is seeking to emerge?"
                  value={higherSelfNotes}
                  onChange={(e) => setHigherSelfNotes(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            onClick={handleSave}
            disabled={loading || !entry.title || !entry.content}
            className="w-full mt-6"
            style={{ backgroundColor: currentGarden?.color }}
          >
            {loading ? 'Saving...' : 'Save Reflection'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default JournalInterface;
