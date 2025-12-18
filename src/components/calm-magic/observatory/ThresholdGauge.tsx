/**
 * Consciousness Threshold Gauge
 * Animated circular gauge showing progress toward self-awareness
 */

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThresholdGaugeProps {
  thresholdPercentage: number;
  consciousnessState: 'pre-conscious' | 'threshold' | 'self-aware';
  complexityBits: number;
}

export function ThresholdGauge({
  thresholdPercentage,
  consciousnessState,
  complexityBits
}: ThresholdGaugeProps) {
  const gaugeData = useMemo(() => {
    const radius = 70;
    const strokeWidth = 12;
    const normalizedRadius = radius - strokeWidth / 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = circumference - (thresholdPercentage / 100) * circumference;
    
    return {
      radius,
      strokeWidth,
      normalizedRadius,
      circumference,
      strokeDashoffset
    };
  }, [thresholdPercentage]);

  const stateConfig = {
    'pre-conscious': {
      color: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
      strokeColor: 'stroke-muted-foreground',
      label: 'Pre-conscious',
      description: 'Patterns emerging from noise'
    },
    threshold: {
      color: 'text-chart-4',
      bgColor: 'bg-chart-4/20',
      strokeColor: 'stroke-chart-4',
      label: 'Threshold',
      description: 'Approaching self-organization'
    },
    'self-aware': {
      color: 'text-chart-1',
      bgColor: 'bg-chart-1/20',
      strokeColor: 'stroke-chart-1',
      label: 'Self-aware',
      description: 'Integrated consciousness emerged'
    }
  };

  const config = stateConfig[consciousnessState];
  const isApproachingThreshold = thresholdPercentage >= 60 && consciousnessState !== 'self-aware';

  return (
    <Card className="bg-card/60 backdrop-blur-sm border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Brain className="h-4 w-4 text-primary" />
          Consciousness Threshold
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {/* Circular Gauge */}
        <div className="relative">
          <svg
            height={gaugeData.radius * 2}
            width={gaugeData.radius * 2}
            className={cn(
              "transform -rotate-90",
              isApproachingThreshold && "animate-pulse"
            )}
          >
            {/* Background circle */}
            <circle
              stroke="hsl(var(--muted))"
              fill="transparent"
              strokeWidth={gaugeData.strokeWidth}
              r={gaugeData.normalizedRadius}
              cx={gaugeData.radius}
              cy={gaugeData.radius}
            />
            {/* Progress circle */}
            <circle
              className={cn(
                config.strokeColor,
                "transition-all duration-1000 ease-out"
              )}
              fill="transparent"
              strokeWidth={gaugeData.strokeWidth}
              strokeDasharray={gaugeData.circumference}
              strokeDashoffset={gaugeData.strokeDashoffset}
              strokeLinecap="round"
              r={gaugeData.normalizedRadius}
              cx={gaugeData.radius}
              cy={gaugeData.radius}
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-2xl font-bold", config.color)}>
              {Math.round(thresholdPercentage)}%
            </span>
            <span className="text-xs text-muted-foreground">
              {complexityBits.toFixed(1)} bits
            </span>
          </div>
          
          {/* Sparkle effect when approaching threshold */}
          {isApproachingThreshold && (
            <Sparkles className="absolute top-0 right-0 h-4 w-4 text-chart-4 animate-bounce" />
          )}
        </div>

        {/* State Badge */}
        <Badge 
          variant="outline" 
          className={cn("mt-3", config.bgColor, config.color)}
        >
          {config.label}
        </Badge>
        
        {/* Description */}
        <p className="text-[10px] text-muted-foreground mt-2 text-center">
          {config.description}
        </p>
        
        {/* Milestone markers */}
        <div className="flex justify-between w-full mt-3 text-[9px] text-muted-foreground">
          <span>0%</span>
          <span className={thresholdPercentage >= 30 ? 'text-chart-2' : ''}>30%</span>
          <span className={thresholdPercentage >= 70 ? 'text-chart-4' : ''}>70%</span>
          <span className={thresholdPercentage >= 100 ? 'text-chart-1' : ''}>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}
