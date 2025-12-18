import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ClusterSuggestion, Fragment } from '@/hooks/useSemanticClustering';

interface ClusterVisualizationProps {
  clusters: ClusterSuggestion[];
  fragments: Fragment[];
  onClusterSelect?: (clusterId: string | null) => void;
  selectedClusterId?: string | null;
}

interface GraphNode {
  id: string;
  content: string;
  clusterId: string;
  x?: number;
  y?: number;
  fx?: number | null;
  fy?: number | null;
}

interface GraphLink {
  source: string | GraphNode;
  target: string | GraphNode;
  clusterId: string;
}

const CLUSTER_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  'hsl(210, 70%, 50%)',
  'hsl(270, 60%, 50%)',
  'hsl(45, 93%, 47%)',
];

export function ClusterVisualization({ 
  clusters, 
  fragments, 
  onClusterSelect,
  selectedClusterId 
}: ClusterVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 400, height: 300 });
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width: width || 400, height: height || 300 });
      }
    };

    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || clusters.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const { width, height } = dimensions;
    const clusterColorMap = new Map<string, string>();
    clusters.forEach((c, i) => clusterColorMap.set(c.id, CLUSTER_COLORS[i % CLUSTER_COLORS.length]));

    // Build nodes from fragments that belong to clusters
    const clusterFragmentIds = new Set(clusters.flatMap(c => c.fragmentIds));
    const nodes: GraphNode[] = fragments
      .filter(f => clusterFragmentIds.has(f.id))
      .map(f => {
        const cluster = clusters.find(c => c.fragmentIds.includes(f.id));
        return {
          id: f.id,
          content: f.content,
          clusterId: cluster?.id || 'unknown'
        };
      });

    // Build links within each cluster
    const links: GraphLink[] = [];
    clusters.forEach(cluster => {
      const clusterNodes = cluster.fragmentIds;
      for (let i = 0; i < clusterNodes.length - 1; i++) {
        links.push({
          source: clusterNodes[i],
          target: clusterNodes[i + 1],
          clusterId: cluster.id
        });
      }
    });

    // Create container group with zoom
    const g = svg.append('g');
    
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 3])
      .on('zoom', (event) => g.attr('transform', event.transform));
    
    svg.call(zoom);

    // Force simulation
    const simulation = d3.forceSimulation(nodes as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(40)
        .strength(0.8))
      .force('charge', d3.forceManyBody().strength(-80))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(20))
      .force('cluster', forceCluster(clusters, nodes, 0.3));

    // Draw links
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', d => clusterColorMap.get(d.clusterId) || 'hsl(var(--muted))')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 1.5);

    // Draw nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 6)
      .attr('fill', d => clusterColorMap.get(d.clusterId) || 'hsl(var(--muted))')
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 1.5)
      .style('cursor', 'pointer')
      .on('mouseenter', (event, d) => {
        setHoveredNode(d.id);
        d3.select(event.currentTarget).attr('r', 10);
      })
      .on('mouseleave', (event) => {
        setHoveredNode(null);
        d3.select(event.currentTarget).attr('r', 6);
      })
      .on('click', (event, d) => {
        onClusterSelect?.(d.clusterId === selectedClusterId ? null : d.clusterId);
      })
      .call(drag(simulation) as any);

    // Highlight selected cluster
    if (selectedClusterId) {
      node.attr('opacity', d => d.clusterId === selectedClusterId ? 1 : 0.3);
      link.attr('opacity', d => d.clusterId === selectedClusterId ? 1 : 0.1);
    }

    // Tick update
    simulation.on('tick', () => {
      link
        .attr('x1', d => (d.source as GraphNode).x || 0)
        .attr('y1', d => (d.source as GraphNode).y || 0)
        .attr('x2', d => (d.target as GraphNode).x || 0)
        .attr('y2', d => (d.target as GraphNode).y || 0);

      node
        .attr('cx', d => d.x || 0)
        .attr('cy', d => d.y || 0);
    });

    return () => {
      simulation.stop();
    };
  }, [clusters, fragments, dimensions, selectedClusterId, onClusterSelect]);

  // Find hovered fragment for tooltip
  const hoveredFragment = hoveredNode ? fragments.find(f => f.id === hoveredNode) : null;

  return (
    <div ref={containerRef} className="relative w-full h-[300px] bg-muted/20 rounded-lg overflow-hidden">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height} />
      
      {/* Tooltip */}
      {hoveredFragment && (
        <div className="absolute bottom-2 left-2 right-2 p-2 bg-popover border border-border rounded-md shadow-lg text-xs max-w-xs">
          <p className="line-clamp-2 text-foreground/80">
            {hoveredFragment.content}
          </p>
        </div>
      )}

      {/* Legend */}
      {clusters.length > 0 && (
        <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm p-2 rounded border border-border text-xs space-y-1">
          {clusters.slice(0, 5).map((cluster, i) => (
            <div 
              key={cluster.id} 
              className="flex items-center gap-2 cursor-pointer hover:opacity-80"
              onClick={() => onClusterSelect?.(cluster.id === selectedClusterId ? null : cluster.id)}
            >
              <div 
                className="w-2.5 h-2.5 rounded-full" 
                style={{ backgroundColor: CLUSTER_COLORS[i % CLUSTER_COLORS.length] }}
              />
              <span className="truncate max-w-[100px]">{cluster.theme}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Custom force to cluster nodes by their cluster assignment
function forceCluster(
  clusters: ClusterSuggestion[], 
  nodes: GraphNode[], 
  strength: number
) {
  const clusterCenters = new Map<string, { x: number; y: number }>();
  const angleStep = (2 * Math.PI) / clusters.length;
  
  clusters.forEach((cluster, i) => {
    const angle = i * angleStep;
    clusterCenters.set(cluster.id, {
      x: 200 + Math.cos(angle) * 100,
      y: 150 + Math.sin(angle) * 80
    });
  });

  return (alpha: number) => {
    nodes.forEach((node) => {
      const center = clusterCenters.get(node.clusterId);
      if (center && node.x !== undefined && node.y !== undefined) {
        node.x += (center.x - node.x) * strength * alpha;
        node.y += (center.y - node.y) * strength * alpha;
      }
    });
  };
}

// Drag behavior
function drag(simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) {
  function dragstarted(event: any) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event: any) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event: any) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }

  return d3.drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);
}
