import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Package } from 'lucide-react';
import { JourneyMode } from '@/types/journal-expansion';

interface JourneyModeSelectorProps {
  mode: JourneyMode;
  onModeChange: (mode: JourneyMode) => void;
  disabled?: boolean;
}

export const JourneyModeSelector: React.FC<JourneyModeSelectorProps> = ({
  mode,
  onModeChange,
  disabled = false
}) => {
  return (
    <Card className="bg-background/50 backdrop-blur">
      <CardContent className="p-3">
        <p className="text-xs text-muted-foreground mb-2">Expansive Leadership Journey</p>
        <div className="flex gap-2">
          <Button
            variant={mode === 'relational' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('relational')}
            disabled={disabled}
            className="flex-1"
          >
            <Heart className="h-3 w-3 mr-1" />
            Relational
          </Button>
          <Button
            variant={mode === 'product' ? 'default' : 'outline'}
            size="sm"
            onClick={() => onModeChange('product')}
            disabled={disabled}
            className="flex-1"
          >
            <Package className="h-3 w-3 mr-1" />
            Product
          </Button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          {mode === 'relational' 
            ? 'Focus on relationship patterns & dynamics' 
            : 'Focus on product development & design'}
        </p>
      </CardContent>
    </Card>
  );
};

export default JourneyModeSelector;
