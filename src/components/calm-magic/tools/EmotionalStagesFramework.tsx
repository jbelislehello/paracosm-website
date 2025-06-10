
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { EmotionalState } from '@/types/journal';

interface EmotionalStagesFrameworkProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const EmotionalStagesFramework: React.FC<EmotionalStagesFrameworkProps> = ({
  emotionalState,
  onStateChange
}) => {
  const [selectedSpike, setSelectedSpike] = useState<string | null>(null);
  const [reflectionInput, setReflectionInput] = useState('');

  const stages = [
    {
      stage: 'LOVE',
      need: 'Energy',
      expression: 'Vitality & engagement',
      level: emotionalState.love_level || 50,
      color: 'bg-pink-500',
      stateKey: 'love_level' as keyof EmotionalState
    },
    {
      stage: 'MAGIC',
      need: 'Space',
      expression: 'Creative intuition',
      level: emotionalState.magic_level || 50,
      color: 'bg-purple-500',
      stateKey: 'magic_level' as keyof EmotionalState
    },
    {
      stage: 'CALM',
      need: 'Grounding',
      expression: 'Psychological safety',
      level: emotionalState.calm_level || 50,
      color: 'bg-blue-500',
      stateKey: 'calm_level' as keyof EmotionalState
    },
    {
      stage: 'OPEN',
      need: 'Transformation',
      expression: 'Risk-taking & learning',
      level: emotionalState.open_level || 50,
      color: 'bg-green-500',
      stateKey: 'open_level' as keyof EmotionalState
    },
    {
      stage: 'FREE',
      need: 'Integration',
      expression: 'Purpose & action',
      level: emotionalState.free_level || 50,
      color: 'bg-yellow-500',
      stateKey: 'free_level' as keyof EmotionalState
    }
  ];

  const handleEnergyMeterChange = (stageKey: keyof EmotionalState, value: number[]) => {
    onStateChange({
      ...emotionalState,
      [stageKey]: value[0]
    });
  };

  const handleEmotionalSpike = (stage: string) => {
    setSelectedSpike(stage);
  };

  const generateQuestionPrompt = () => {
    const prompts = [
      "What creative possibility is calling to you right now?",
      "Where do you feel most alive in your work?",
      "What would you create if you knew you couldn't fail?",
      "How might your current challenge become your greatest opportunity?"
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Emotional Stages Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Stage</th>
                  <th className="text-left p-3">Emotional Need</th>
                  <th className="text-left p-3">Org Expression</th>
                  <th className="text-left p-3">Interactive Element</th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage) => (
                  <tr key={stage.stage} className="border-b">
                    <td className="p-3">
                      <div className={`inline-block px-3 py-1 rounded text-white ${stage.color}`}>
                        {stage.stage}
                      </div>
                    </td>
                    <td className="p-3">{stage.need}</td>
                    <td className="p-3">{stage.expression}</td>
                    <td className="p-3">
                      {stage.stage === 'LOVE' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Energy:</span>
                            <Slider
                              value={[stage.level]}
                              onValueChange={(value) => handleEnergyMeterChange(stage.stateKey, value)}
                              max={100}
                              step={1}
                              className="w-20"
                            />
                            <span className="text-sm">{stage.level}%</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEmotionalSpike('LOVE')}
                            className="text-xs"
                          >
                            🔍 Decode Spike
                          </Button>
                        </div>
                      )}
                      {stage.stage === 'MAGIC' && (
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => alert(generateQuestionPrompt())}
                            className="text-xs"
                          >
                            ✨ Get Prompt
                          </Button>
                        </div>
                      )}
                      {stage.stage === 'CALM' && (
                        <div className="space-y-2">
                          <Input
                            placeholder="How are you feeling?"
                            value={reflectionInput}
                            onChange={(e) => setReflectionInput(e.target.value)}
                            className="text-xs"
                          />
                          <Slider
                            value={[stage.level]}
                            onValueChange={(value) => handleEnergyMeterChange(stage.stateKey, value)}
                            max={100}
                            step={1}
                            className="w-20"
                          />
                        </div>
                      )}
                      {stage.stage === 'OPEN' && (
                        <div className="space-y-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs"
                            onClick={() => alert('🎴 Ritual Card: "What boundary needs to dissolve for growth?"')}
                          >
                            🎴 Draw Card
                          </Button>
                        </div>
                      )}
                      {stage.stage === 'FREE' && (
                        <div className="space-y-2">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${stage.color}`}
                              style={{ width: `${stage.level}%` }}
                            />
                          </div>
                          <span className="text-xs">Vision Alignment: {stage.level}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {selectedSpike && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="text-pink-600">Emotional Spike Decoded: {selectedSpike}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              This spike in {selectedSpike} energy indicates a moment of heightened vitality. 
              Consider channeling this energy into creative action or team engagement activities.
              Your nervous system is signaling readiness for meaningful connection and purpose-driven work.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setSelectedSpike(null)}
              className="mt-2"
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmotionalStagesFramework;
