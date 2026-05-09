import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Network, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { extractOntologyGraph, type GraphLinkKind, type GraphNodeKind } from '@/utils/extractOntologyGraph';
import type { OntologyContent } from '@/utils/ontologyPipeline';

interface Props {
  content: OntologyContent;
  height?: number;
  className?: string;
}

const KIND_VAR: Record<GraphNodeKind, string> = {
  vocabulary: '--chart-1',
  concept: '--chart-2',
  class: '--chart-3',
  graph: '--chart-4',
};

const LINK_STYLE: Record<GraphLinkKind, { width: number; dash: string | null; opacity: number }> = {
  hierarchy: { width: 1.5, dash: null, opacity: 0.7 },
  synonym: { width: 1.25, dash: '4 3', opacity: 0.7 },
  relation: { width: 2, dash: null, opacity: 0.85 },
  graph: { width: 2.25, dash: '1 0', opacity: 0.95 },
};

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  kind: GraphNodeKind;
}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  kind: GraphLinkKind;
}

const OntologyGraphPreview: React.FC<Props> = ({ content, height = 320, className }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(480);
  const [tick, setTick] = useState(0);

  const graph = useMemo(() => extractOntologyGraph(content), [content]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width ?? el.clientWidth;
      if (w > 0) setWidth(Math.floor(w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    if (graph.nodes.length === 0) return;

    const nodes: SimNode[] = graph.nodes.map((n) => ({ id: n.id, label: n.label, kind: n.kind }));
    const links: SimLink[] = graph.links.map((l) => ({ source: l.source, target: l.target, kind: l.kind }));

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    const sim = d3
      .forceSimulation<SimNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance(60)
          .strength(0.6)
      )
      .force('charge', d3.forceManyBody().strength(-180))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide<SimNode>(18))
      .alpha(reduced ? 0 : 1)
      .alphaDecay(reduced ? 1 : 0.04);

    const linkSel = svg
      .append('g')
      .attr('stroke', 'hsl(var(--muted-foreground))')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke-width', (d) => LINK_STYLE[d.kind].width)
      .attr('stroke-opacity', (d) => LINK_STYLE[d.kind].opacity)
      .attr('stroke-dasharray', (d) => LINK_STYLE[d.kind].dash);

    const nodeG = svg
      .append('g')
      .selectAll<SVGGElement, SimNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer');

    nodeG
      .append('circle')
      .attr('r', (d) => (d.kind === 'graph' ? 8 : d.kind === 'class' ? 7 : 5.5))
      .attr('fill', (d) => `hsl(var(${KIND_VAR[d.kind]}))`)
      .attr('stroke', 'hsl(var(--background))')
      .attr('stroke-width', 1.5);

    nodeG
      .append('title')
      .text((d) => `${d.label} — ${d.kind}`);

    nodeG
      .append('text')
      .attr('x', 10)
      .attr('y', 3)
      .attr('font-size', 10)
      .attr('fill', 'hsl(var(--foreground))')
      .text((d) => (d.label.length > 22 ? d.label.slice(0, 21) + '…' : d.label));

    // Hover highlight
    const neighbors = new Map<string, Set<string>>();
    links.forEach((l) => {
      const s = (l.source as SimNode).id ?? (l.source as unknown as string);
      const t = (l.target as SimNode).id ?? (l.target as unknown as string);
      if (!neighbors.has(s)) neighbors.set(s, new Set());
      if (!neighbors.has(t)) neighbors.set(t, new Set());
      neighbors.get(s)!.add(t);
      neighbors.get(t)!.add(s);
    });

    nodeG
      .on('mouseenter', (_, d) => {
        const nb = neighbors.get(d.id) ?? new Set();
        nodeG.style('opacity', (n) => (n.id === d.id || nb.has(n.id) ? 1 : 0.25));
        linkSel.style('opacity', (l) => {
          const s = (l.source as SimNode).id;
          const t = (l.target as SimNode).id;
          return s === d.id || t === d.id ? 1 : 0.1;
        });
      })
      .on('mouseleave', () => {
        nodeG.style('opacity', 1);
        linkSel.style('opacity', (l) => LINK_STYLE[l.kind].opacity);
      });

    sim.on('tick', () => {
      linkSel
        .attr('x1', (d) => (d.source as SimNode).x ?? 0)
        .attr('y1', (d) => (d.source as SimNode).y ?? 0)
        .attr('x2', (d) => (d.target as SimNode).x ?? 0)
        .attr('y2', (d) => (d.target as SimNode).y ?? 0);
      nodeG.attr('transform', (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    if (reduced) sim.tick(120).stop();

    return () => {
      sim.stop();
    };
  }, [graph, width, height, tick]);

  const isEmpty = graph.nodes.length === 0;

  return (
    <Card className={cn('border-border/60', className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Network className="h-4 w-4 text-primary" />
            Knowledge Graph Preview
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px]">
              {graph.nodes.length} nodes · {graph.links.length} edges
            </Badge>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setTick((t) => t + 1)}
              aria-label="Re-layout graph"
              disabled={isEmpty}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div ref={wrapRef} className="w-full">
          {isEmpty ? (
            <div
              className="flex items-center justify-center rounded-md border border-dashed border-border/60 bg-muted/20 text-center text-xs text-muted-foreground"
              style={{ height }}
            >
              <p className="max-w-xs px-4 leading-relaxed">
                Fill the ontology fields (vocabulary, taxonomy, classes, graph edges)
                in your PRD layers to preview the knowledge graph here.
              </p>
            </div>
          ) : (
            <svg
              ref={svgRef}
              width={width}
              height={height}
              className="rounded-md bg-muted/10"
              role="img"
              aria-label="Ontology knowledge graph preview"
            />
          )}
        </div>
        {!isEmpty && (
          <div className="mt-2 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
            {(['vocabulary', 'concept', 'class', 'graph'] as GraphNodeKind[]).map((k) => (
              <span key={k} className="inline-flex items-center gap-1">
                <span
                  className="inline-block h-2 w-2 rounded-full"
                  style={{ background: `hsl(var(${KIND_VAR[k]}))` }}
                />
                {k}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OntologyGraphPreview;
