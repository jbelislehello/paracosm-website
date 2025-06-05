
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { energeticAxes } from '@/data/gardens';
import { EmotionalState } from '@/types/journal';

interface CalmMagicCompassProps {
  emotionalState: Partial<EmotionalState>;
  onStateChange: (state: Partial<EmotionalState>) => void;
}

const CalmMagicCompass: React.FC<CalmMagicCompassProps> = ({ emotionalState, onStateChange }) => {
  const handleAxisChange = (axis: string, value: number[]) => {
    onStateChange({
      ...emotionalState,
      [`${axis}_level`]: value[0]
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧭 The Calm Magic Compass
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Map your internal territory through the five energetic axes
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {energeticAxes.map((axis) => {
          const currentValue = emotionalState[`${axis.key}_level` as keyof EmotionalState] as number || 50;
          
          return (
            <div key={axis.key} className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold" style={{ color: axis.color }}>
                    {axis.name}
                  </h4>
                  <p className="text-sm text-slate-500">{axis.subtitle}</p>
                  <p className="text-xs text-slate-400 mt-1">{axis.description}</p>
                </div>
                <span className="text-lg font-bold" style={{ color: axis.color }}>
                  {currentValue}
                </span>
              </div>
              
              <Slider
                value={[currentValue]}
                onValueChange={(value) => handleAxisChange(axis.key, value)}
                max={100}
                step={1}
                className="w-full"
                style={{
                  '--slider-track': axis.color,
                  '--slider-range': axis.color,
                  '--slider-thumb': axis.color,
                } as React.CSSProperties}
              />
              
              <div className="flex justify-between text-xs text-slate-400">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          );
        })}
        
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
          <h5 className="font-semibold mb-2">Current State Reading</h5>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Vitality Score:</strong> {Math.round((
                (emotionalState.love_level || 50) + 
                (emotionalState.magic_level || 50)
              ) / 2)}
            </div>
            <div>
              <strong>Stability Score:</strong> {Math.round((
                (emotionalState.calm_level || 50) + 
                (emotionalState.open_level || 50)
              ) / 2)}
            </div>
          </div>
          <div className="mt-2">
            <strong>Integration Level:</strong> {emotionalState.free_level || 50}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalmMagicCompass;
