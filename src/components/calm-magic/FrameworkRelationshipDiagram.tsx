import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { OECD_DIMENSIONS, GOVERNANCE_LAYERS, GOVERNANCE_TO_PRD_MAPPING } from '@/data/oecdFramework';
import { PRD_DIMENSIONS } from '@/data/prdDimensions';
import { cn } from '@/lib/utils';
import * as d3 from 'd3';

// Color scheme for governance layers
const LAYER_COLORS = {
  A: { 
    bg: 'bg-rose-500/10', 
    border: 'border-rose-500/50', 
    text: 'text-rose-400',
    line: '#f43f5e',
    glow: 'shadow-rose-500/20'
  },
  B: { 
    bg: 'bg-amber-500/10', 
    border: 'border-amber-500/50', 
    text: 'text-amber-400',
    line: '#f59e0b',
    glow: 'shadow-amber-500/20'
  },
  C: { 
    bg: 'bg-emerald-500/10', 
    border: 'border-emerald-500/50', 
    text: 'text-emerald-400',
    line: '#10b981',
    glow: 'shadow-emerald-500/20'
  }
} as const;

// Icons for OECD dimensions
const OECD_ICONS: Record<string, string> = {
  'data-input': '📊',
  'economic-context': '💼',
  'people-planet': '🌍',
  'ai-model': '🤖',
  'task-output': '🎯'
};

// Map OECD dimensions to governance layers
const OECD_TO_LAYER: Record<string, 'A' | 'B' | 'C'> = {
  'data-input': 'C',
  'economic-context': 'B',
  'people-planet': 'A',
  'ai-model': 'C',
  'task-output': 'B'
};

// Map PRD dimensions to governance layers based on their lenses
const PRD_TO_LAYER: Record<string, 'A' | 'B' | 'C'> = {
  'ontological': 'C',
  'relational': 'A',
  'temporal': 'B',
  'semantic': 'C',
  'ethical': 'A',
  'ecological': 'B'
};

type NodeType = 'oecd' | 'governance' | 'prd';

interface HoveredNode {
  type: NodeType;
  id: string;
  layer?: 'A' | 'B' | 'C';
}

interface NodePosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface FrameworkRelationshipDiagramProps {
  compact?: boolean;
  highlightLayer?: 'A' | 'B' | 'C';
  className?: string;
}

export function FrameworkRelationshipDiagram({ 
  compact = false, 
  highlightLayer,
  className 
}: FrameworkRelationshipDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<HoveredNode | null>(null);
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Refs for measuring node positions
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setNodeRef = useCallback((id: string) => (el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  }, []);

  // Update positions when nodes change
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newPositions: Record<string, NodePosition> = {};

      Object.entries(nodeRefs.current).forEach(([id, el]) => {
        if (el) {
          const rect = el.getBoundingClientRect();
          newPositions[id] = {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height / 2,
            width: rect.width,
            height: rect.height
          };
        }
      });

      setPositions(newPositions);
    };

    // Initial update
    const timer = setTimeout(updatePositions, 100);
    
    // Update on resize
    const observer = new ResizeObserver(updatePositions);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  // Get connected nodes based on hover
  const getConnectedNodes = (node: HoveredNode | null): Set<string> => {
    if (!node) return new Set();
    
    const connected = new Set<string>();
    connected.add(`${node.type}-${node.id}`);

    if (node.type === 'governance') {
      const layer = node.id as 'A' | 'B' | 'C';
      // Connect to OECD dimensions
      Object.entries(OECD_TO_LAYER).forEach(([oecdId, l]) => {
        if (l === layer) connected.add(`oecd-${oecdId}`);
      });
      // Connect to PRD dimensions
      Object.entries(PRD_TO_LAYER).forEach(([prdId, l]) => {
        if (l === layer) connected.add(`prd-${prdId}`);
      });
    } else if (node.type === 'oecd') {
      const layer = OECD_TO_LAYER[node.id];
      connected.add(`governance-${layer}`);
      // Also connect to PRD dimensions in same layer
      Object.entries(PRD_TO_LAYER).forEach(([prdId, l]) => {
        if (l === layer) connected.add(`prd-${prdId}`);
      });
    } else if (node.type === 'prd') {
      const layer = PRD_TO_LAYER[node.id];
      connected.add(`governance-${layer}`);
      // Also connect to OECD dimensions in same layer
      Object.entries(OECD_TO_LAYER).forEach(([oecdId, l]) => {
        if (l === layer) connected.add(`oecd-${oecdId}`);
      });
    }

    return connected;
  };

  const connectedNodes = getConnectedNodes(hoveredNode);
  const activeLayer = hoveredNode?.layer || 
    (hoveredNode?.type === 'oecd' ? OECD_TO_LAYER[hoveredNode.id] : undefined) ||
    (hoveredNode?.type === 'prd' ? PRD_TO_LAYER[hoveredNode.id] : undefined) ||
    highlightLayer;

  // Generate SVG paths for connections
  const generatePaths = () => {
    const paths: Array<{
      d: string;
      layer: 'A' | 'B' | 'C';
      from: string;
      to: string;
    }> = [];

    // OECD to Governance connections
    Object.entries(OECD_TO_LAYER).forEach(([oecdId, layer]) => {
      const fromPos = positions[`oecd-${oecdId}`];
      const toPos = positions[`governance-${layer}`];
      
      if (fromPos && toPos) {
        const line = d3.line().curve(d3.curveBasis);
        const midX = (fromPos.x + toPos.x) / 2;
        
        paths.push({
          d: line([
            [fromPos.x + fromPos.width / 2 - 10, fromPos.y],
            [midX, fromPos.y],
            [midX, toPos.y],
            [toPos.x - toPos.width / 2 + 10, toPos.y]
          ]) || '',
          layer,
          from: `oecd-${oecdId}`,
          to: `governance-${layer}`
        });
      }
    });

    // Governance to PRD connections
    Object.entries(PRD_TO_LAYER).forEach(([prdId, layer]) => {
      const fromPos = positions[`governance-${layer}`];
      const toPos = positions[`prd-${prdId}`];
      
      if (fromPos && toPos) {
        const line = d3.line().curve(d3.curveBasis);
        const midX = (fromPos.x + toPos.x) / 2;
        
        paths.push({
          d: line([
            [fromPos.x + fromPos.width / 2 - 10, fromPos.y],
            [midX, fromPos.y],
            [midX, toPos.y],
            [toPos.x - toPos.width / 2 + 10, toPos.y]
          ]) || '',
          layer,
          from: `governance-${layer}`,
          to: `prd-${prdId}`
        });
      }
    });

    return paths;
  };

  const paths = generatePaths();

  const isNodeHighlighted = (nodeId: string) => {
    if (!hoveredNode && !highlightLayer) return true;
    return connectedNodes.has(nodeId);
  };

  const isPathHighlighted = (from: string, to: string) => {
    if (!hoveredNode && !highlightLayer) return false;
    return connectedNodes.has(from) && connectedNodes.has(to);
  };

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      {/* SVG Layer for connections */}
      <svg 
        ref={svgRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {(['A', 'B', 'C'] as const).map(layer => (
            <linearGradient key={layer} id={`gradient-${layer}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={LAYER_COLORS[layer].line} stopOpacity="0.3" />
              <stop offset="50%" stopColor={LAYER_COLORS[layer].line} stopOpacity="0.8" />
              <stop offset="100%" stopColor={LAYER_COLORS[layer].line} stopOpacity="0.3" />
            </linearGradient>
          ))}
        </defs>
        
        {paths.map((path, idx) => {
          const highlighted = isPathHighlighted(path.from, path.to);
          const dimmed = (hoveredNode || highlightLayer) && !highlighted;
          
          return (
            <path
              key={idx}
              d={path.d}
              fill="none"
              stroke={highlighted ? LAYER_COLORS[path.layer].line : `url(#gradient-${path.layer})`}
              strokeWidth={highlighted ? 3 : 1.5}
              strokeOpacity={dimmed ? 0.1 : highlighted ? 1 : 0.4}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>

      {/* Three Column Layout */}
      <div className={cn(
        "grid gap-4 relative z-10",
        compact ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 lg:grid-cols-3"
      )}>
        {/* OECD Dimensions Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            OECD Dimensions
          </h3>
          {OECD_DIMENSIONS.map((dim) => {
            const layer = OECD_TO_LAYER[dim.id];
            const nodeId = `oecd-${dim.id}`;
            const highlighted = isNodeHighlighted(nodeId);
            const colors = LAYER_COLORS[layer];

            return (
              <Card
                key={dim.id}
                ref={setNodeRef(nodeId)}
                className={cn(
                  "p-3 border cursor-pointer transition-all duration-300",
                  colors.bg,
                  colors.border,
                  highlighted ? `shadow-lg ${colors.glow}` : "opacity-40",
                  hoveredNode?.id === dim.id && hoveredNode?.type === 'oecd' && "ring-2 ring-offset-2 ring-offset-background"
                )}
                onMouseEnter={() => setHoveredNode({ type: 'oecd', id: dim.id, layer })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{OECD_ICONS[dim.id] || '📋'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-medium text-sm", colors.text)}>
                        {dim.name}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px] px-1", colors.text, colors.border)}>
                        Layer {layer}
                      </Badge>
                    </div>
                    {!compact && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {dim.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Governance Layers Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Governance Layers
          </h3>
          {GOVERNANCE_LAYERS.map((layer) => {
            const layerId = layer.id as 'A' | 'B' | 'C';
            const nodeId = `governance-${layerId}`;
            const highlighted = isNodeHighlighted(nodeId);
            const colors = LAYER_COLORS[layerId];
            const mappedSeasons = GOVERNANCE_TO_PRD_MAPPING[layerId];

            return (
              <Card
                key={layer.id}
                ref={setNodeRef(nodeId)}
                className={cn(
                  "p-4 border cursor-pointer transition-all duration-300",
                  colors.bg,
                  colors.border,
                  highlighted ? `shadow-lg ${colors.glow}` : "opacity-40",
                  hoveredNode?.id === layerId && hoveredNode?.type === 'governance' && "ring-2 ring-offset-2 ring-offset-background"
                )}
                onMouseEnter={() => setHoveredNode({ type: 'governance', id: layerId, layer: layerId })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold",
                    colors.bg,
                    colors.text,
                    "border-2",
                    colors.border
                  )}>
                    {layer.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={cn("font-semibold", colors.text)}>
                      {layer.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {layer.description}
                    </p>
                    {!compact && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {mappedSeasons.map(season => (
                          <Badge 
                            key={season} 
                            variant="secondary" 
                            className="text-[10px] capitalize"
                          >
                            {season}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* PRD Dimensions Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            PRD Dimensions
          </h3>
          {PRD_DIMENSIONS.map((dim) => {
            const layer = PRD_TO_LAYER[dim.id];
            const nodeId = `prd-${dim.id}`;
            const highlighted = isNodeHighlighted(nodeId);
            const colors = LAYER_COLORS[layer];

            return (
              <Card
                key={dim.id}
                ref={setNodeRef(nodeId)}
                className={cn(
                  "p-3 border cursor-pointer transition-all duration-300",
                  colors.bg,
                  colors.border,
                  highlighted ? `shadow-lg ${colors.glow}` : "opacity-40",
                  hoveredNode?.id === dim.id && hoveredNode?.type === 'prd' && "ring-2 ring-offset-2 ring-offset-background"
                )}
                onMouseEnter={() => setHoveredNode({ type: 'prd', id: dim.id, layer })}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-lg">{dim.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-medium text-sm", colors.text)}>
                        {dim.name}
                      </span>
                      <Badge variant="outline" className={cn("text-[10px] px-1", colors.text, colors.border)}>
                        Layer {layer}
                      </Badge>
                    </div>
                    {!compact && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {dim.qualityLenses.slice(0, 3).map(lens => (
                          <Badge 
                            key={lens} 
                            variant="secondary" 
                            className="text-[10px]"
                          >
                            {lens}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border/50">
        <div className="flex flex-wrap gap-4 justify-center text-xs text-muted-foreground">
          {(['A', 'B', 'C'] as const).map(layer => {
            const info = GOVERNANCE_LAYERS.find(l => l.id === layer);
            const colors = LAYER_COLORS[layer];
            return (
              <div key={layer} className="flex items-center gap-2">
                <div className={cn(
                  "w-3 h-3 rounded-full",
                  layer === 'A' ? "bg-rose-500" : layer === 'B' ? "bg-amber-500" : "bg-emerald-500"
                )} />
                <span>
                  Layer {layer}: {info?.focus.slice(0, 2).join(', ')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FrameworkRelationshipDiagram;
