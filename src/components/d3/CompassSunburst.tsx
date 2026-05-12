import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { compassHierarchy, type CompassAxis, type CompassNode } from "@/data/d3/compassHierarchy";

const AXIS_HSL: Record<CompassAxis, string> = {
  MAGIC: "var(--bloom-magenta)",
  LOVE: "320 70% 70%",
  CALM: "var(--bloom-teal)",
  OPEN: "var(--bloom-amber)",
  FREE: "var(--bloom-violet)",
};

interface ArcDatum extends d3.HierarchyRectangularNode<CompassNode> {
  current?: { x0: number; x1: number; y0: number; y1: number };
  target?: { x0: number; x1: number; y0: number; y1: number };
}

const CompassSunburst = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [label, setLabel] = useState<{ title: string; sub: string }>({
    title: "Compass",
    sub: "5 axes · 64 tiles",
  });

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 480;
    const radius = width / 2;

    const svg = d3.select(svgEl)
      .attr("viewBox", `${-width / 2} ${-width / 2} ${width} ${width}`)
      .attr("preserveAspectRatio", "xMidYMid meet");

    svg.selectAll("*").remove();

    const root = d3.hierarchy<CompassNode>(compassHierarchy)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const partition = d3.partition<CompassNode>().size([2 * Math.PI, root.height + 1]);
    const partitioned = partition(root) as ArcDatum;
    partitioned.each((d) => {
      (d as ArcDatum).current = { x0: d.x0, x1: d.x1, y0: d.y0, y1: d.y1 };
    });

    const arc = d3.arc<ArcDatum>()
      .startAngle((d) => d.current!.x0)
      .endAngle((d) => d.current!.x1)
      .padAngle((d) => Math.min((d.current!.x1 - d.current!.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.current!.y0 * (radius / 4))
      .outerRadius((d) => Math.max(d.current!.y0 * (radius / 4), d.current!.y1 * (radius / 4) - 1));

    const colorFor = (d: ArcDatum) => {
      const a = d.data.axis as CompassAxis | undefined;
      return a ? `hsl(${AXIS_HSL[a]})` : "hsl(var(--bloom-violet))";
    };

    const g = svg.append("g");

    const path = g.append("g")
      .selectAll<SVGPathElement, ArcDatum>("path")
      .data(partitioned.descendants().slice(1) as ArcDatum[])
      .join("path")
      .attr("fill", colorFor)
      .attr("fill-opacity", (d) => 0.45 + d.depth * 0.15)
      .attr("stroke", "hsl(var(--bloom-ink))")
      .attr("stroke-width", 0.6)
      .attr("d", (d) => arc(d) as string)
      .style("cursor", (d) => (d.children ? "pointer" : "default"));

    path.on("mouseenter", (_e, d) => {
      const tileCount = d.leaves().length;
      setLabel({
        title: d.data.name,
        sub: d.data.axis ? `${d.data.axis} · ${tileCount} tile${tileCount > 1 ? "s" : ""}` : `${tileCount} tiles`,
      });
    });

    let focus: ArcDatum = partitioned;

    const clicked = (_event: MouseEvent, p: ArcDatum) => {
      focus = focus === p ? (p.parent as ArcDatum) ?? partitioned : p;

      partitioned.each((d) => {
        const dd = d as ArcDatum;
        dd.target = {
          x0: Math.max(0, Math.min(1, (dd.x0 - focus.x0) / (focus.x1 - focus.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (dd.x1 - focus.x0) / (focus.x1 - focus.x0))) * 2 * Math.PI,
          y0: Math.max(0, dd.y0 - focus.depth),
          y1: Math.max(0, dd.y1 - focus.depth),
        };
      });

      const t = svg.transition().duration(700);
      path.transition(t)
        .tween("data", (d) => {
          const i = d3.interpolate(d.current!, d.target!);
          return (time) => {
            d.current = i(time);
          };
        })
        .attrTween("d", (d) => () => arc(d) as string);
    };

    path.on("click", clicked);

    g.append("circle")
      .attr("r", radius / 4 - 4)
      .attr("fill", "hsl(var(--bloom-ink))")
      .attr("stroke", "hsl(var(--bloom-magenta) / 0.4)")
      .style("cursor", "pointer")
      .on("click", () => clicked(new MouseEvent("click"), partitioned));
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <svg ref={svgRef} className="w-full h-auto" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-32">
        <p className="font-vhs uppercase tracking-[0.18em] text-[10px] text-[hsl(var(--bloom-amber))]">{label.sub}</p>
        <p className="font-vhs text-sm text-[hsl(var(--bloom-magenta))] mt-0.5 truncate">{label.title}</p>
      </div>
      <p className="mt-2 text-[11px] font-vhs uppercase tracking-[0.18em] text-muted-foreground text-center">
        Click an axis to zoom · click center to zoom out
      </p>
    </div>
  );
};

export default CompassSunburst;
