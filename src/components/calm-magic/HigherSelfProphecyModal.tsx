import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { QuadrantPosition, QUADRANT_LABELS } from '@/types/trajectory';
import { TrajectoryVisualization } from './TrajectoryVisualization';
import { Sparkles } from 'lucide-react';

interface HigherSelfProphecyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSetProphecy: (position: QuadrantPosition, reflection?: string) => void;
  currentShadowPosition: QuadrantPosition;
}

const QUADRANT_PRESETS: { id: 'SN' | 'IN' | 'IM' | 'SM'; position: QuadrantPosition }[] = [
  { id: 'SN', position: { x: 0.7, y: 0.7 } },
  { id: 'SM', position: { x: -0.7, y: 0.7 } },
  { id: 'IM', position: { x: -0.7, y: -0.7 } },
  { id: 'IN', position: { x: 0.7, y: -0.7 } },
];

export const HigherSelfProphecyModal: React.FC<HigherSelfProphecyModalProps> = ({
  isOpen,
  onClose,
  onSetProphecy,
  currentShadowPosition,
}) => {
  const [selectedPosition, setSelectedPosition] = useState<QuadrantPosition | null>(null);
  const [reflection, setReflection] = useState('');

  const handleQuadrantClick = (position: QuadrantPosition) => {
    setSelectedPosition(position);
  };

  const handlePresetClick = (preset: typeof QUADRANT_PRESETS[0]) => {
    setSelectedPosition(preset.position);
  };

  const handleConfirm = () => {
    if (selectedPosition) {
      onSetProphecy(selectedPosition, reflection || undefined);
      onClose();
    }
  };

  const getSelectedQuadrant = (): 'SN' | 'IN' | 'IM' | 'SM' | null => {
    if (!selectedPosition) return null;
    if (selectedPosition.x >= 0 && selectedPosition.y >= 0) return 'SN';
    if (selectedPosition.x < 0 && selectedPosition.y >= 0) return 'SM';
    if (selectedPosition.x < 0 && selectedPosition.y < 0) return 'IM';
    return 'IN';
  };

  const selectedQuadrant = getSelectedQuadrant();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            Set Your Higher Self Prophecy
          </DialogTitle>
          <DialogDescription>
            Where do you wish to be at the end of this journey? Click on the quadrant to set your destination.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4">
          {/* Quadrant Visualization */}
          <div className="pb-8">
            <TrajectoryVisualization
              shadowPosition={currentShadowPosition}
              higherSelfPosition={selectedPosition}
              trajectoryLog={[]}
              onQuadrantClick={handleQuadrantClick}
              interactive
            />
          </div>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {QUADRANT_PRESETS.map((preset) => (
              <Button
                key={preset.id}
                variant={selectedQuadrant === preset.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => handlePresetClick(preset)}
                className="text-xs"
              >
                <span className="font-bold mr-1">{preset.id}</span>
                <span className="text-muted-foreground truncate">
                  {QUADRANT_LABELS[preset.id].name}
                </span>
              </Button>
            ))}
          </div>

          {/* Selected Quadrant Info */}
          {selectedQuadrant && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-sm font-medium">{QUADRANT_LABELS[selectedQuadrant].name}</p>
              <p className="text-xs text-muted-foreground">
                {QUADRANT_LABELS[selectedQuadrant].description}
              </p>
            </div>
          )}

          {/* Reflection Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Why this destination? (optional)
            </label>
            <Textarea
              placeholder="What draws you toward this quadrant? What would it mean to arrive there?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={3}
              className="text-sm"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Skip for now
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedPosition}
          >
            Set Prophecy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default HigherSelfProphecyModal;
