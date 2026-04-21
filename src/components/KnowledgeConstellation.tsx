import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { useNavigate } from 'react-router-dom';

interface KnowledgeNode {
  id: string;
  label: string;
  group: string;
  radius: number;
}

interface KnowledgeLink {
  source: string;
  target: string;
  strength: number;
}

const NODES: KnowledgeNode[] = [
  { id: 'ontology', label: 'Ontology', group: 'governance', radius: 28 },
  { id: 'taxonomy', label: 'Taxonomy', group: 'governance', radius: 22 },
  { id: 'thesaurus', label: 'Thesaurus', group: 'governance', radius: 20 },
  { id: 'picklist', label: 'Pick-list', group: 'governance', radius: 16 },
  { id: 'pollens', label: 'POLLENS', group: 'season', radius: 24 },
  { id: 'noems', label: 'NOEMS', group: 'season', radius: 24 },
  { id: 'poems', label: 'POEMS', group: 'season', radius: 24 },
  { id: 'totems', label: 'TOTEMS', group: 'season', radius: 24 },
  { id: 'anthems', label: 'ANTHEMS', group: 'season', radius: 24 },
  { id: 'prd', label: 'Living PRD', group: 'output', radius: 26 },
  { id: 'manifold', label: 'Manifold', group: 'topology', radius: 22 },
  { id: 'quadrant', label: 'Quadrant', group: 'topology', radius: 20 },
];

const LINKS: KnowledgeLink[] = [
  { source: 'ontology', target: 'taxonomy', strength: 0.8 },
  { source: 'taxonomy', target: 'thesaurus', strength: 0.6 },
  { source: 'thesaurus', target: 'picklist', strength: 0.5 },
  { source: 'ontology', target: 'pollens', strength: 0.7 },
  { source: 'ontology', target: 'noems', strength: 0.7 },
  { source: 'ontology', target: 'poems', strength: 0.6 },
  { source: 'taxonomy', target: 'totems', strength: 0.6 },
  { source: 'taxonomy', target: 'anthems', strength: 0.5 },
  { source: 'pollens', target: 'noems', strength: 0.4 },
  { source: 'noems', target: 'poems', strength: 0.4 },
  { source: 'poems', target: 'totems', strength: 0.4 },
  { source: 'totems', target: 'anthems', strength: 0.4 },
  { source: 'anthems', target: 'prd', strength: 0.8 },
  { source: 'pollens', target: 'prd', strength: 0.6 },
  { source: 'prd', target: 'manifold', strength: 0.7 },
  { source: 'manifold', target: 'quadrant', strength: 0.6 },
  { source: 'quadrant', target: 'ontology', strength: 0.5 },
];

const GROUP_COLORS: Record<string, string> = {
  governance: '#6366f1',
  season: '#a855f7',
  output: '#3b82f6',
  topology: '#22c55e',
};

const KnowledgeConstellation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = svgRef.current.clientWidth || 600;
    const height = 400;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const simulation = d3.forceSimulation(NODES as d3.SimulationNodeDatum[])
      .force('link', d3.forceLink(LINKS).id((d: any) => d.id).distance(80).strength((d: any) => d.strength * 0.3))
      .force('charge', d3.forceManyBody().strength(-200))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 8));

    // Links
    const link = svg.append('g')
      .selectAll('line')
      .data(LINKS)
      .join('line')
      .attr('stroke', '#6366f180')
      .attr('stroke-width', (d) => d.strength * 2)
      .attr('stroke-dasharray', '4 2');

    // Node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(NODES)
      .join('g')
      .style('cursor', 'pointer')
      .on('click', () => navigate('/calm-magic-board'));

    // Node circles
    node.append('circle')
      .attr('r', (d) => d.radius)
      .attr('fill', (d) => `${GROUP_COLORS[d.group]}20`)
      .attr('stroke', (d) => GROUP_COLORS[d.group])
      .attr('stroke-width', 1.5)
      .on('mouseenter', function () {
        d3.select(this)
          .transition().duration(200)
          .attr('fill', (d: any) => `${GROUP_COLORS[d.group]}40`)
          .attr('stroke-width', 3);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition().duration(200)
          .attr('fill', (d: any) => `${GROUP_COLORS[d.group]}20`)
          .attr('stroke-width', 1.5);
      });

    // Labels
    node.append('text')
      .text((d) => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .attr('fill', 'currentColor')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .attr('pointer-events', 'none')
      .attr('class', 'text-foreground');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    return () => { simulation.stop(); };
  }, [navigate]);

  return (
    <div className="w-full rounded-xl overflow-hidden bg-card/50 border border-border p-4">
      <h4 className="text-sm font-semibold text-muted-foreground mb-3 text-center">Knowledge Object Constellation</h4>
      <svg ref={svgRef} className="w-full" style={{ height: 400 }} />
    </div>
  );
};

export default KnowledgeConstellation;
