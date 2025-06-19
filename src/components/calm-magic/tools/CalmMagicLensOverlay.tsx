import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { EmotionalState } from '@/types/journal';

interface CalmMagicLensOverlayProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const CalmMagicLensOverlay: React.FC<CalmMagicLensOverlayProps> = ({
  emotionalState,
  onStateChange
}) => {
  const [lensActive, setLensActive] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'balance' | 'stuck' | 'flow'>('balance');

  const elements = [
    { name: 'LOVE', value: emotionalState.love_level || 50, color: 'pink', key: 'love_level' as keyof EmotionalState },
    { name: 'MAGIC', value: emotionalState.magic_level || 50, color: 'purple', key: 'magic_level' as keyof EmotionalState },
    { name: 'CALM', value: emotionalState.calm_level || 50, color: 'blue', key: 'calm_level' as keyof EmotionalState },
    { name: 'OPEN', value: emotionalState.open_level || 50, color: 'green', key: 'open_level' as keyof EmotionalState },
    { name: 'FREE', value: emotionalState.free_level || 50, color: 'yellow', key: 'free_level' as keyof EmotionalState }
  ];

  const handleSliderChange = (key: keyof EmotionalState, value: number[]) => {
    onStateChange({
      ...emotionalState,
      [key]: value[0]
    });
  };

  const analyzeConfiguration = () => {
    const total = elements.reduce((sum, el) => sum + el.value, 0);
    const average = total / elements.length;
    const imbalanced = elements.filter(el => Math.abs(el.value - average) > 20);
    
    if (imbalanced.length === 0) return "🌟 Excellent balance across all elements!";
    
    const lowest = elements.reduce((min, el) => el.value < min.value ? el : min);
    const highest = elements.reduce((max, el) => el.value > max.value ? el : max);
    
    return `⚖️ Focus needed: Low ${lowest.name} (${lowest.value}%), High ${highest.name} (${highest.value}%)`;
  };

  const getSuggestion = () => {
    const config = elements.map(el => ({ name: el.name, value: el.value }));
    const lowest = config.reduce((min, el) => el.value < min.value ? el : min);
    
    const suggestions = {
      LOVE: "💝 Try team vitality exercises or energy alignment workshops",
      MAGIC: "✨ Engage in creative brainstorming or innovation retreats", 
      CALM: "🧘 Focus on psychological safety practices or mindfulness sessions",
      OPEN: "🌱 Explore risk-taking workshops or learning experimentation",
      FREE: "🕊️ Work on purpose alignment or vision integration sessions"
    };
    
    return suggestions[lowest.name as keyof typeof suggestions] || "🎯 Continue your balanced growth journey";
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Calm Magic Lens Overlay
            <div className="flex items-center gap-2">
              <span className="text-sm">X-Ray Mode</span>
              <Switch checked={lensActive} onCheckedChange={setLensActive} />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`transition-all duration-500 ${lensActive ? 'filter contrast-125 saturate-150' : ''}`}>
            <div className="grid gap-4">
              {elements.map((element) => (
                <div key={element.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`font-medium text-${element.color}-600`}>
                      {element.name}
                    </span>
                    <span className="text-sm text-gray-500">{element.value}%</span>
                  </div>
                  <Slider
                    value={[element.value]}
                    onValueChange={(value) => handleSliderChange(element.key, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  {lensActive && element.value < 30 && (
                    <div className="text-xs text-red-600 animate-pulse">
                      ⚠️ Energy blockage detected
                    </div>
                  )}
                  {lensActive && element.value > 80 && (
                    <div className="text-xs text-green-600 animate-pulse">
                      ✨ High flow state
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-600">Organizational Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm">
            <strong>Current State:</strong> {analyzeConfiguration()}
          </div>
          <div className="text-sm">
            <strong>Recommendation:</strong> {getSuggestion()}
          </div>
          <div className="flex gap-2">
            <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt/high-priority-meeting" target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline">Schedule Workshop</Button>
            </a>
            <Button size="sm" variant="outline">AI Assistant Session</Button>
            <Button size="sm" variant="outline">Team Retreat</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CalmMagicLensOverlay;
