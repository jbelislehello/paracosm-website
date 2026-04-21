import React, { useState, useMemo } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FIFTY_THREE_SENSES, SENSE_CATEGORIES, getRandomSense, getSensesBySeason, type NaturalSense } from '@/data/fiftythreeSenses';
import type { Season } from '@/types/trajectory';

interface AutopoiesisGuideProps {
  season?: Season;
  onSenseResponse?: (senseId: number, response: string) => void;
}

const AutopoiesisGuide: React.FC<AutopoiesisGuideProps> = ({ season, onSenseResponse }) => {
  const [currentSense, setCurrentSense] = useState<NaturalSense>(() => 
    season ? getSensesBySeason(season)[0] || getRandomSense() : getRandomSense()
  );
  const [response, setResponse] = useState('');
  const [responses, setResponses] = useState<Map<number, string>>(new Map());

  const seasonSenses = useMemo(() => 
    season ? getSensesBySeason(season) : FIFTY_THREE_SENSES.slice(0, 10),
    [season]
  );

  const categoryInfo = SENSE_CATEGORIES[currentSense.category];

  const handleSubmitResponse = () => {
    if (!response.trim()) return;
    const updated = new Map(responses);
    updated.set(currentSense.id, response.trim());
    setResponses(updated);
    onSenseResponse?.(currentSense.id, response.trim());
    setResponse('');
  };

  const nextSense = () => {
    const unanswered = seasonSenses.filter(s => !responses.has(s.id));
    if (unanswered.length > 0) {
      setCurrentSense(unanswered[Math.floor(Math.random() * unanswered.length)]);
    } else {
      setCurrentSense(getRandomSense());
    }
    setResponse('');
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-semibold">Autopoiesis Guide</h3>
        </div>
        <span className="text-[10px] text-muted-foreground">
          {responses.size} / 53 senses explored
        </span>
      </div>

      <p className="text-xs text-muted-foreground">
        Nature speaks through 53 senses. Focus attention on what is most alive — 
        the Nahual, the attractive quality that drives creation.
      </p>

      {/* Current sense card */}
      <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{categoryInfo.icon}</span>
          <div>
            <h4 className="text-sm font-semibold">{currentSense.name}</h4>
            <p className="text-[10px] text-muted-foreground">
              {categoryInfo.label} · Sense #{currentSense.id}
            </p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{currentSense.description}</p>
        <p className="text-sm italic text-primary/80 border-l-2 border-primary/30 pl-3">
          {currentSense.reflectionPrompt}
        </p>
      </div>

      {/* Response area */}
      <div className="space-y-2">
        <Textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder="Let this sense speak through your project..."
          className="text-sm min-h-[60px] resize-none"
        />
        <div className="flex gap-2">
          <Button size="sm" onClick={handleSubmitResponse} disabled={!response.trim()} className="flex-1">
            Respond
          </Button>
          <Button size="sm" variant="outline" onClick={nextSense}>
            <RefreshCw className="w-3 h-3 mr-1" />
            Next Sense
          </Button>
        </div>
      </div>

      {/* Category overview */}
      <div className="flex flex-wrap gap-1">
        {Object.entries(SENSE_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => {
              const senses = FIFTY_THREE_SENSES.filter(s => s.category === key);
              if (senses.length) setCurrentSense(senses[Math.floor(Math.random() * senses.length)]);
            }}
            className="text-[10px] px-2 py-1 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
            title={cat.label}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AutopoiesisGuide;
