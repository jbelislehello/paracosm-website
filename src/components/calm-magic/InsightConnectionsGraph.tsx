import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { X, Loader2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface InsightConnectionsGraphProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GraphNode {
  id: string;
  content: string;
  tile_id: number | null;
  group: number;
  importance: number;
}

interface GraphLink {
  source: string;
  target: string;
  strength: number;
  relationship: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

export const InsightConnectionsGraph: React.FC<InsightConnectionsGraphProps> = ({
  isOpen,
  onClose
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchAndAnalyze();
    }
  }, [isOpen]);

  useEffect(() => {
    if (graphData && svgRef.current) {
      renderGraph();
    }
  }, [graphData]);

  const fetchAndAnalyze = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: entries, error: fetchError } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (!entries || entries.length < 2) {
        toast.info('Need at least 2 entries to show connections');
        setGraphData({ nodes: [], links: [] });
        return;
      }

      const { data, error } = await supabase.functions.invoke('analyze-insights', {
        body: { 
          entries: entries.map(e => ({
            id: e.id,
            content: e.content,
            tags: e.tags,
            tile_id: e.tile_id
          }))
        }
      });

      if (error) throw error;
      setGraphData(data);
    } catch (err) {
      console.error('Failed to analyze insights:', err);
      toast.error('Failed to analyze connections');
    } finally {
      setIsLoading(false);
    }
  };

  const renderGraph = () => {
    if (!svgRef.current || !graphData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;

    const g = svg.append('g');

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom);

    // Create simulation
    const simulation = d3.forceSimulation(graphData.nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(graphData.links)
        .id((d: any) => d.id)
        .distance(100)
        .strength((d: any) => d.strength * 0.5))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(graphData.links)
      .join('line')
      .attr('stroke', 'hsl(var(--muted-foreground))')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', (d) => d.strength * 2);

    // Draw nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(graphData.nodes)
      .join('circle')
      .attr('r', (d) => 10 + d.importance * 10)
      .attr('fill', (d) => d3.schemeTableau10[d.group % 10])
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedNode(d);
      })
      .call(d3.drag<SVGCircleElement, GraphNode>()
        .on('start', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Add labels
    const labels = g.append('g')
      .selectAll('text')
      .data(graphData.nodes)
      .join('text')
      .text((d) => d.content.slice(0, 20) + (d.content.length > 20 ? '...' : ''))
      .attr('font-size', '10px')
      .attr('fill', 'hsl(var(--foreground))')
      .attr('text-anchor', 'middle')
      .attr('dy', 25);

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y);

      labels
        .attr('x', (d: any) => d.x)
        .attr('y', (d: any) => d.y);
    });

    // Click outside to deselect
    svg.on('click', () => setSelectedNode(null));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed inset-4 bg-background border border-border rounded-lg shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Insight Connections</h2>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchAndAnalyze} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Graph */}
        <div className="flex-1 relative">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : graphData && graphData.nodes.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No insights to connect yet. Start exploring tiles!
            </div>
          ) : (
            <svg ref={svgRef} className="w-full h-full" />
          )}

          {/* Selected node detail */}
          {selectedNode && (
            <div className="absolute bottom-4 left-4 right-4 bg-card border border-border rounded-lg p-4 shadow-lg">
              <p className="text-sm">{selectedNode.content}</p>
              {selectedNode.tile_id && (
                <span className="text-xs text-muted-foreground mt-2 block">
                  From Tile {selectedNode.tile_id}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
