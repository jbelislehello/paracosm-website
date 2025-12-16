import { useState } from 'react';
import { MysteryZone as MysteryZoneType } from '@/hooks/useMysteryZones';
import { HelpCircle, Sparkles, Loader2 } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MysteryZoneProps {
  zone: MysteryZoneType;
  isLoading: boolean;
  onReveal: () => void;
}

export function MysteryZone({ zone, isLoading, onReveal }: MysteryZoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (!zone.isRevealed && !isLoading) {
      onReveal();
    }
    setIsOpen(true);
  };

  const getZoneColor = () => {
    switch (zone.zoneType) {
      case 'gap': return 'hsl(var(--chart-1))';
      case 'cluster': return 'hsl(var(--chart-2))';
      case 'boundary': return 'hsl(var(--chart-3))';
      case 'attractor': return 'hsl(var(--chart-4))';
      case 'connection': return 'hsl(var(--chart-5))';
      case 'transition': return 'hsl(var(--primary))';
      default: return 'hsl(var(--primary))';
    }
  };

  const color = getZoneColor();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <g
          className="cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleClick}
        >
          {/* Outer pulse ring - only for unrevealed */}
          {!zone.isRevealed && (
            <circle
              cx={zone.x}
              cy={zone.y}
              r={zone.radius}
              fill="none"
              stroke={color}
              strokeWidth={2}
              opacity={0.4}
              className="animate-ping"
              style={{ 
                transformOrigin: `${zone.x}px ${zone.y}px`,
                animationDuration: '2s'
              }}
            />
          )}
          
          {/* Main circle */}
          <circle
            cx={zone.x}
            cy={zone.y}
            r={isHovered ? zone.radius * 1.1 : zone.radius}
            fill={zone.isRevealed ? color : `${color}20`}
            stroke={color}
            strokeWidth={zone.isRevealed ? 3 : 2}
            opacity={zone.isRevealed ? 0.9 : 0.6}
            style={{ transition: 'all 0.3s ease' }}
          />
          
          {/* Inner glow */}
          <circle
            cx={zone.x}
            cy={zone.y}
            r={zone.radius * 0.6}
            fill={color}
            opacity={isHovered ? 0.4 : 0.2}
            style={{ transition: 'opacity 0.3s ease' }}
          />
          
          {/* Icon */}
          <g transform={`translate(${zone.x - 10}, ${zone.y - 10})`}>
            {isLoading ? (
              <Loader2 
                className="w-5 h-5 animate-spin" 
                style={{ color: zone.isRevealed ? 'white' : color }}
              />
            ) : zone.isRevealed ? (
              <Sparkles 
                className="w-5 h-5" 
                style={{ color: 'white' }}
              />
            ) : (
              <HelpCircle 
                className="w-5 h-5" 
                style={{ color }}
              />
            )}
          </g>
          
          {/* Label on hover */}
          {isHovered && !isOpen && (
            <text
              x={zone.x}
              y={zone.y + zone.radius + 18}
              textAnchor="middle"
              fill="currentColor"
              fontSize={11}
              fontWeight={500}
              className="pointer-events-none"
            >
              {zone.label}
            </text>
          )}
        </g>
      </PopoverTrigger>
      
      <PopoverContent 
        className={cn(
          "w-72 p-4 shadow-lg",
          zone.isRevealed 
            ? "bg-card border-border" 
            : "bg-muted/80 backdrop-blur-sm border-primary/20"
        )}
        sideOffset={10}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {zone.isRevealed ? (
              <Sparkles className="w-4 h-4 text-primary" />
            ) : (
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            )}
            <span className="font-medium text-sm">{zone.label}</span>
          </div>
          
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Revealing mystery...</span>
            </div>
          ) : zone.isRevealed && zone.fragment ? (
            <p className="text-sm leading-relaxed text-foreground/90 italic">
              "{zone.fragment}"
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click to reveal what this region holds...
            </p>
          )}
          
          <div className="flex items-center gap-1.5 pt-1">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-muted-foreground capitalize">
              {zone.zoneType} zone
            </span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
