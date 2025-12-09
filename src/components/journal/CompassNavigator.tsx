import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BookOpen, GitBranch, HelpCircle, Sparkles, Users } from 'lucide-react';
import { CompassType, JourneyMode } from '@/types/journal-expansion';
import { COMPASS_CONTENT, MAGIC_COMPASS_ORDER, getCompassPrompt } from '@/data/compassContent';

interface CompassNavigatorProps {
  activeCompass: CompassType;
  journeyMode: JourneyMode;
  onCompassChange: (compass: CompassType) => void;
}

const iconMap = {
  BookOpen,
  GitBranch,
  HelpCircle,
  Sparkles,
  Users
};

export const CompassNavigator: React.FC<CompassNavigatorProps> = ({
  activeCompass,
  journeyMode,
  onCompassChange
}) => {
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon ? <Icon className="h-4 w-4" /> : null;
  };

  return (
    <Card className="bg-background/50 backdrop-blur border-primary/20">
      <CardContent className="p-4">
        {/* MAGIC Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            {['M', 'A', 'G', 'I', 'C'].map((letter, idx) => (
              <span
                key={letter}
                className={`text-lg font-bold ${
                  MAGIC_COMPASS_ORDER[idx] === activeCompass
                    ? 'text-primary'
                    : 'text-muted-foreground/50'
                }`}
              >
                {letter}
              </span>
            ))}
          </div>
          <Badge variant="outline" className="text-xs">
            {journeyMode === 'relational' ? 'Relational Design' : 'Product Design'}
          </Badge>
        </div>

        {/* Compass Buttons */}
        <div className="flex gap-2">
          <TooltipProvider>
            {MAGIC_COMPASS_ORDER.map((compassId) => {
              const compass = COMPASS_CONTENT[compassId];
              const isActive = activeCompass === compassId;

              return (
                <Tooltip key={compassId}>
                  <TooltipTrigger asChild>
                    <Button
                      variant={isActive ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => onCompassChange(compassId)}
                      className={`flex-1 flex flex-col h-auto py-2 ${
                        isActive ? '' : 'hover:bg-primary/10'
                      }`}
                    >
                      {getIcon(compass.icon)}
                      <span className="text-[10px] mt-1">{compass.magicLetter}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-semibold">{compass.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {compass.description}
                    </p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </TooltipProvider>
        </div>

        {/* Active Compass Prompt */}
        <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs font-medium text-primary mb-1">
            {COMPASS_CONTENT[activeCompass].name}
          </p>
          <p className="text-sm text-muted-foreground italic">
            "{getCompassPrompt(activeCompass, journeyMode)}"
          </p>
        </div>

        {/* Practices */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">Practices:</p>
          <div className="space-y-1">
            {COMPASS_CONTENT[activeCompass].practices.slice(0, 2).map((practice, idx) => (
              <p key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                <span className="text-primary">•</span>
                {practice}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompassNavigator;
