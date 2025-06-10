
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const EmotiveCompassWidget: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<string>('');
  const [compassAngle, setCompassAngle] = useState(0);
  const [identifiedStage, setIdentifiedStage] = useState<string>('');

  const emotions = [
    'overwhelmed', 'curious', 'numb', 'excited', 'frustrated', 'hopeful',
    'anxious', 'creative', 'stuck', 'inspired', 'tired', 'energized'
  ];

  const stages = [
    { name: 'LOVE', angle: 0, element: '🔥', practice: 'Energy Alignment Ritual' },
    { name: 'MAGIC', angle: 72, element: '🌙', practice: 'Creative Flow Session' },
    { name: 'CALM', angle: 144, element: '🌊', practice: 'Grounding Meditation' },
    { name: 'OPEN', angle: 216, element: '🌱', practice: 'Boundary Dissolution Practice' },
    { name: 'FREE', angle: 288, element: '🦋', practice: 'Integration Ceremony' }
  ];

  const archetypes = {
    overwhelmed: { creature: '🐢 Turtle', guidance: 'Slow down, seek shelter in CALM' },
    curious: { creature: '🦝 Raccoon', guidance: 'Explore with MAGIC energy' },
    numb: { creature: '🐻 Bear', guidance: 'Hibernate and restore in LOVE' },
    excited: { creature: '🦅 Eagle', guidance: 'Soar with OPEN possibilities' },
    frustrated: { creature: '🐺 Wolf', guidance: 'Channel intensity into FREE action' },
    hopeful: { creature: '🦋 Butterfly', guidance: 'Transform through all stages' }
  };

  const identifyStage = (emotion: string) => {
    const stageMap: { [key: string]: number } = {
      'overwhelmed': 2, 'numb': 0, 'tired': 0, // LOVE/CALM
      'curious': 1, 'creative': 1, 'inspired': 1, // MAGIC
      'anxious': 2, 'stuck': 2, // CALM
      'excited': 3, 'hopeful': 3, // OPEN
      'frustrated': 4, 'energized': 4 // FREE
    };
    
    const stageIndex = stageMap[emotion] || 0;
    const stage = stages[stageIndex];
    setIdentifiedStage(stage.name);
    setCompassAngle(stage.angle);
    return stage;
  };

  const handleEmotionDrag = (emotion: string) => {
    setCurrentEmotion(emotion);
    const stage = identifyStage(emotion);
  };

  const getArchetype = (emotion: string) => {
    return archetypes[emotion as keyof typeof archetypes] || 
           { creature: '🦊 Fox', guidance: 'Adapt and find your path' };
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Emotive Compass Widget</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Compass Visualization */}
          <div className="relative w-64 h-64 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-gray-300 rounded-full">
              {stages.map((stage, index) => (
                <div
                  key={stage.name}
                  className="absolute w-12 h-12 flex items-center justify-center rounded-full bg-white border-2 border-gray-400"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${stage.angle}deg) translateY(-120px) rotate(-${stage.angle}deg)`
                  }}
                >
                  <div className="text-center">
                    <div className="text-lg">{stage.element}</div>
                    <div className="text-xs font-bold">{stage.name}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Compass Needle */}
            <div
              className="absolute top-1/2 left-1/2 w-1 h-24 bg-red-500 origin-bottom transition-transform duration-500"
              style={{
                transform: `translate(-50%, -100%) rotate(${compassAngle}deg)`
              }}
            />
            
            {/* Center Point */}
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Emotion Selection */}
          <div className="space-y-4">
            <h4 className="font-semibold">Drag your current emotional state:</h4>
            <div className="grid grid-cols-3 gap-2">
              {emotions.map((emotion) => (
                <Button
                  key={emotion}
                  variant={currentEmotion === emotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleEmotionDrag(emotion)}
                  className="text-xs"
                >
                  {emotion}
                </Button>
              ))}
            </div>
          </div>

          {/* Results */}
          {currentEmotion && (
            <div className="mt-6 p-4 bg-gray-50 rounded space-y-3">
              <div>
                <strong>Current Stage:</strong> {identifiedStage}
              </div>
              <div>
                <strong>Spirit Guide:</strong> {getArchetype(currentEmotion).creature}
              </div>
              <div>
                <strong>Guidance:</strong> {getArchetype(currentEmotion).guidance}
              </div>
              <div>
                <strong>Micro-Practice:</strong> {stages.find(s => s.name === identifiedStage)?.practice}
              </div>
              <Button size="sm" className="w-full">
                Start {stages.find(s => s.name === identifiedStage)?.practice}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmotiveCompassWidget;
