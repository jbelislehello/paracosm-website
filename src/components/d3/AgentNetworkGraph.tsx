import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { agentNodes, agentLinks, type AgentNode, type AgentRole } from "@/data/d3/agentNetwork";

const ROLE_TOKEN: Record<AgentRole, string> = {
  voice: "var(--bloom-magenta)",
  knowledge: "var(--bloom-amber)",
  regulation: "var(--bloom-teal)",
  product: "var(--bloom-violet)",
};

interface SimNode extends AgentNode, d3.SimulationNodeDatum {}
interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  kind: "handoff" | "feedback" | "compile";
}

const AgentNetworkGraph = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hovered, setHovered] = useState<AgentNode | null>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 760;
    const height = 480;

    const svg = d3.select(svgEl)
      .attr("viewBox", `0 0 ${width} ${height}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.selectAll("*").remove();

    const root = svg.append("g");

    const nodes: SimNode[] = agentNodes.map((n) => ({ ...n }));
    const links: SimLink[] = agentLinks.map((l) => ({ ...l }));

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force("link", d3.forceLink<SimNode, SimLink>(links).id((d) => d.id).distance(120).strength(0.6))
      .force("charge", d3.forceManyBody().strength(-380))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide(38));

    const link = root.append("g")
      .attr("stroke-opacity", 0.45)
      .selectAll<SVGLineElement, SimLink>("line")
      .data(links)
      .join("line")
      .attr("stroke", (d) =>
        d.kind === "compile"
          ? "hsl(var(--bloom-amber))"
          : d.kind === "feedback"
            ? "hsl(var(--bloom-teal))"
            : "hsl(var(--bloom-magenta))",
      )
      .attr("stroke-width", 1.5);

    const node = root.append("g")
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .join("g")
      .style("cursor", "grab")
      .on("mouseenter", (_e, d) => setHovered(d))
      .on("mouseleave", () => setHovered(null));

    node.append("circle")
      .attr("r", 22)
      .attr("fill", (d) => `hsl(${ROLE_TOKEN[d.role]})`)
      .attr("fill-opacity", 0.85)
      .attr("stroke", "hsl(var(--bloom-ink))")
      .attr("stroke-width", 2);

    node.append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", 38)
      .attr("font-family", "VT323, IBM Plex Mono, monospace")
      .attr("font-size", 13)
      .attr("letter-spacing", "0.08em")
      .attr("fill", "hsl(var(--foreground))");

    const drag = d3.drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    node.call(drag);

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 3])
      .on("zoom", (event) => root.attr("transform", event.transform.toString()));
    svg.call(zoom);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      node.attr("transform", (d) => `translate(${d.x ?? 0}, ${d.y ?? 0})`);
    });

    return () => {
      simulation.stop();
    };
  }, []);

  return (
    <div className="relative w-full">
      <svg ref={svgRef} className="w-full h-auto rounded-lg border border-[hsl(var(--bloom-magenta)/0.3)] bg-[hsl(var(--bloom-ink)/0.4)]" />
      {hovered && (
        <div className="absolute top-3 left-3 max-w-xs rounded-md border border-[hsl(var(--bloom-magenta)/0.4)] bg-[hsl(var(--bloom-ink))] p-3 shadow-lg pointer-events-none">
          <p className="font-vhs uppercase tracking-[0.18em] text-xs text-[hsl(var(--bloom-amber))]">
            {hovered.role} · {hovered.axis}
          </p>
          <p className="font-vhs text-sm text-[hsl(var(--bloom-magenta))] mt-0.5">{hovered.label}</p>
          <p className="font-redacted italic text-xs text-foreground/80 mt-1">{hovered.description}</p>
        </div>
      )}
      <p className="mt-2 text-[11px] font-vhs uppercase tracking-[0.18em] text-muted-foreground">
        Drag nodes · scroll to zoom · hover for context
      </p>
    </div>
  );
};

export default AgentNetworkGraph;
