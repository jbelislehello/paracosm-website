import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface N extends d3.SimulationNodeDatum {
  id: string;
  group: "tile" | "prd";
  label?: string;
}
interface L extends d3.SimulationLinkDatum<N> {
  source: string | N;
  target: string | N;
}

const ConstellationTeaser = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const w = containerRef.current.clientWidth;
    const h = containerRef.current.clientHeight;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${w} ${h}`);

    const tileIds = Array.from({ length: 18 }, (_, i) => `t${i}`);
    const nodes: N[] = [
      { id: "prd", group: "prd", label: "PRD" },
      ...tileIds.map((id) => ({ id, group: "tile" as const })),
    ];
    const links: L[] = [
      ...tileIds.map((id) => ({ source: id, target: "prd" } as L)),
      // a few inter-tile threads
      { source: "t0", target: "t3" },
      { source: "t1", target: "t5" },
      { source: "t6", target: "t9" },
      { source: "t10", target: "t14" },
      { source: "t12", target: "t17" },
    ];

    const sim = d3
      .forceSimulation<N>(nodes)
      .force(
        "link",
        d3
          .forceLink<N, L>(links)
          .id((d) => d.id)
          .distance((l) => ((l.target as N).group === "prd" ? 90 : 60))
          .strength(0.5)
      )
      .force("charge", d3.forceManyBody().strength(-160))
      .force("center", d3.forceCenter(w / 2, h / 2))
      .force(
        "collision",
        d3.forceCollide<N>().radius((d) => (d.group === "prd" ? 40 : 14))
      );

    const linkSel = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.18)
      .attr("stroke-width", 1);

    const nodeSel = svg.append("g").selectAll("g").data(nodes).join("g");

    nodeSel
      .append("circle")
      .attr("r", (d) => (d.group === "prd" ? 32 : 9))
      .attr("fill", (d) => (d.group === "prd" ? "currentColor" : "hsl(var(--background))"))
      .attr("stroke", "currentColor")
      .attr("stroke-width", (d) => (d.group === "prd" ? 0 : 1.5))
      .attr("opacity", (d) => (d.group === "prd" ? 0.95 : 0.85));

    nodeSel
      .filter((d) => d.group === "prd")
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "hsl(var(--background))")
      .attr("font-size", 12)
      .attr("font-weight", 700)
      .text("PRD");

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as N).x ?? 0)
        .attr("y1", (d) => (d.source as N).y ?? 0)
        .attr("x2", (d) => (d.target as N).x ?? 0)
        .attr("y2", (d) => (d.target as N).y ?? 0);
      nodeSel.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    return () => {
      sim.stop();
    };
  }, []);

  return (
    <section className="relative py-20 md:py-32">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
              05 · Constellation
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
              Tiles weave themselves into a PRD.
            </h2>
            <p className="mt-5 text-lg text-muted-foreground">
              As tiles fill, the constellation view reveals semantic
              connections — clusters become themes, threads become requirements,
              and the whole board compiles into a living product spec.
            </p>
            <p className="mt-4 text-sm italic text-muted-foreground">
              "The conversation IS the ontology."
            </p>
          </div>

          <div
            ref={containerRef}
            className="relative aspect-square w-full overflow-hidden rounded-3xl border border-border bg-card text-primary shadow-xl"
          >
            <svg ref={svgRef} className="h-full w-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConstellationTeaser;
