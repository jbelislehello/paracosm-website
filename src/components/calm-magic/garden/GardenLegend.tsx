import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface LegendItem {
  label: string;
  color: string;
  description?: string;
}

interface GardenLegendProps {
  className?: string;
}

// Ring colors matching the tolerance system
const RING_LEGEND: LegendItem[] = [
  { 
    label: 'Inner Core', 
    color: 'hsl(210, 70%, 50%)', 
    description: 'Calmness - Foundation tiles' 
  },
  { 
    label: 'Stretch', 
    color: 'hsl(270, 60%, 50%)', 
    description: 'Spaciousness - Growth zone' 
  },
  { 
    label: 'Edge', 
    color: 'hsl(142, 71%, 45%)', 
    description: 'Openness - Exploration frontier' 
  },
  { 
    label: 'Integrator', 
    color: 'hsl(45, 93%, 47%)', 
    description: 'Freedom - Corner anchors' 
  },
];

// Vegetation types
const VEGETATION_LEGEND: LegendItem[] = [
  { label: 'Dense Canopy', color: 'hsl(142, 50%, 35%)', description: '8+ fragments' },
  { label: 'Ancient Trees', color: 'hsl(142, 45%, 40%)', description: '6+ fragments, quotes' },
  { label: 'Bamboo', color: 'hsl(100, 50%, 45%)', description: 'Recent activity' },
  { label: 'Wildflowers', color: 'hsl(340, 60%, 60%)', description: 'Varied content' },
  { label: 'Grassland', color: 'hsl(80, 40%, 50%)', description: 'Light exploration' },
  { label: 'Sandy Clearing', color: 'hsl(40, 30%, 70%)', description: 'Unvisited' },
];

// Rock formations
const ROCK_LEGEND: LegendItem[] = [
  { label: 'Boulder', color: 'hsl(30, 20%, 45%)', description: 'Foundational wisdom' },
  { label: 'Standing Stone', color: 'hsl(220, 15%, 55%)', description: 'Pivotal insights' },
  { label: 'Monolith', color: 'hsl(260, 20%, 40%)', description: 'Defining statements' },
  { label: 'Cairn', color: 'hsl(35, 25%, 50%)', description: 'Stacked observations' },
  { label: 'Pebbles', color: 'hsl(20, 15%, 60%)', description: 'Small notes' },
];

// Water features
const WATER_LEGEND: LegendItem[] = [
  { label: 'Stream', color: 'hsl(200, 70%, 55%)', description: 'MAGIC-aligned flow' },
  { label: 'Pool', color: 'hsl(210, 60%, 50%)', description: 'CALM reflection' },
];

export function GardenLegend({ className }: GardenLegendProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<'rings' | 'vegetation' | 'rocks' | 'water'>('rings');

  const renderLegendSection = (items: LegendItem[], title: string) => (
    <div className="space-y-1.5">
      <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        {title}
      </h4>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1">
        {items.map((item) => (
          <TooltipProvider key={item.label} delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1.5 cursor-help">
                  <div 
                    className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-[10px] text-foreground/80 truncate">
                    {item.label}
                  </span>
                </div>
              </TooltipTrigger>
              {item.description && (
                <TooltipContent side="top" className="text-xs">
                  {item.description}
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
    </div>
  );

  const SECTIONS = {
    rings: { title: 'Tolerance Rings', items: RING_LEGEND },
    vegetation: { title: 'Vegetation', items: VEGETATION_LEGEND },
    rocks: { title: 'Rock Formations', items: ROCK_LEGEND },
    water: { title: 'Water Features', items: WATER_LEGEND },
  };

  return (
    <div className={cn(
      "bg-background/80 backdrop-blur-xl border border-border/30 rounded-lg overflow-hidden",
      "transition-all duration-300",
      className
    )}>
      {/* Header - always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-medium">Legend</span>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="px-3 pb-3 space-y-3">
          {/* Section tabs */}
          <div className="flex gap-1 border-b border-border/30 pb-2">
            {(Object.keys(SECTIONS) as Array<keyof typeof SECTIONS>).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={cn(
                  "px-2 py-1 text-[10px] rounded transition-colors",
                  activeSection === key 
                    ? "bg-primary/20 text-primary font-medium" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>

          {/* Active section content */}
          {renderLegendSection(SECTIONS[activeSection].items, SECTIONS[activeSection].title)}
        </div>
      )}

      {/* Compact legend when collapsed - show ring colors inline */}
      {!isExpanded && (
        <div className="px-3 pb-2 flex items-center gap-2">
          {RING_LEGEND.map((item, i) => (
            <div 
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: item.color }}
              title={item.label}
            />
          ))}
          <span className="text-[9px] text-muted-foreground ml-1">Rings 1-4</span>
        </div>
      )}
    </div>
  );
}
