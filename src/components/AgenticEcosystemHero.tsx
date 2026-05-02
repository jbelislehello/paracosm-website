import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as d3 from "d3";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, Network, Zap, Brain, FileText } from "lucide-react";
import GetDemoDialog from "@/components/GetDemoDialog";
import { trackEvent } from "@/lib/analytics";

const DECK_DRAFT_KEY = "agentic-deck-draft";
const HERO_DECK_PREFILL = {
  selectedUrls: [],
  audience: "founder",
  tone: "visionary",
  length: "standard" as const,
  intent:
    "Introduce our Agentic Ecosystems service: orchestrator + shared context + specialized agents, with observable, human-aligned coordination.",
  outline: null,
  currentSlideIdx: 0,
};

/**
 * AgenticEcosystemHero
 *
 * A polished hero that visually explains the "Agentic Ecosystems" service:
 * a small, interactive D3 force-directed graph where a central Orchestrator
 * coordinates specialized agents around a shared Context. Users can click
 * agents to "activate" them — pulses travel along the edges, illustrating
 * how an agentic ecosystem routes intent through coordinated specialists.
 *
 * Design tokens only — no hard-coded colors. All visuals derive from
 * --primary / --accent / --foreground via the design system.
 */

type NodeKind = "orchestrator" | "context" | "agent";

interface AgentNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  kind: NodeKind;
  radius: number;
  active?: boolean;
}

interface AgentLink extends d3.SimulationLinkDatum<AgentNode> {
  source: string | AgentNode;
  target: string | AgentNode;
}

const NODES: AgentNode[] = [
  { id: "orchestrator", label: "Orchestrator", kind: "orchestrator", radius: 28 },
  { id: "context", label: "Shared Context", kind: "context", radius: 22 },
  { id: "research", label: "Research", kind: "agent", radius: 18 },
  { id: "design", label: "Design", kind: "agent", radius: 18 },
  { id: "ops", label: "Ops", kind: "agent", radius: 18 },
  { id: "ethics", label: "Ethics", kind: "agent", radius: 18 },
  { id: "delivery", label: "Delivery", kind: "agent", radius: 18 },
  { id: "insight", label: "Insight", kind: "agent", radius: 18 },
];

const LINKS: AgentLink[] = [
  { source: "orchestrator", target: "context" },
  ...["research", "design", "ops", "ethics", "delivery", "insight"].flatMap(
    (id) => [
      { source: "orchestrator", target: id } as AgentLink,
      { source: "context", target: id } as AgentLink,
    ],
  ),
];

const AgenticEcosystemHero = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [demoOpen, setDemoOpen] = useState(false);
  const navigate = useNavigate();

  const handleGenerateDeck = (source: "primary_button" | "text_link" = "primary_button") => {
    let prefilled = false;
    try {
      const raw = localStorage.getItem(DECK_DRAFT_KEY);
      const existing = raw ? JSON.parse(raw) : null;
      const hasWork = existing && (existing.outline || (existing.intent && existing.intent.trim().length > 0));
      if (!hasWork) {
        localStorage.setItem(DECK_DRAFT_KEY, JSON.stringify(HERO_DECK_PREFILL));
        prefilled = true;
      }
    } catch {
      /* ignore */
    }
    void trackEvent("hero_generate_deck_clicked", { source, prefilled });
    navigate("/agentic-ecosystem-deck?prefill=hero");
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    // Defs: subtle glow filter using currentColor — themed by parent
    const defs = svg.append("defs");
    const glow = defs
      .append("filter")
      .attr("id", "agent-glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");
    glow.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const merge = glow.append("feMerge");
    merge.append("feMergeNode").attr("in", "blur");
    merge.append("feMergeNode").attr("in", "SourceGraphic");

    // Deep-clone so the simulation can mutate
    const nodes: AgentNode[] = NODES.map((n) => ({ ...n }));
    const links: AgentLink[] = LINKS.map((l) => ({ ...l }));

    const simulation = d3
      .forceSimulation<AgentNode>(nodes)
      .force(
        "link",
        d3
          .forceLink<AgentNode, AgentLink>(links)
          .id((d) => d.id)
          .distance((l) => {
            const t = (l.target as AgentNode).kind;
            if (t === "context") return 70;
            return 110;
          })
          .strength(0.6),
      )
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<AgentNode>().radius((d) => d.radius + 6),
      );

    const linkGroup = svg.append("g").attr("class", "links");
    const nodeGroup = svg.append("g").attr("class", "nodes");

    const linkSel = linkGroup
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "currentColor")
      .attr("stroke-opacity", 0.18)
      .attr("stroke-width", 1.25);

    const nodeSel = nodeGroup
      .selectAll<SVGGElement, AgentNode>("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer")
      .style("transition", "transform 200ms ease")
      .on("mouseenter", function () {
        d3.select(this).attr("transform", function (d: any) {
          return `translate(${d.x},${d.y}) scale(1.08)`;
        });
      })
      .on("mouseleave", function () {
        d3.select(this).attr("transform", function (d: any) {
          return `translate(${d.x},${d.y}) scale(1)`;
        });
      })
      .on("click", (_e, d) => {
        if (d.kind !== "agent") return;
        setActiveAgent(d.id);
        pulseFromAgent(d.id);
      });

    // Inner halo (themed)
    nodeSel
      .append("circle")
      .attr("r", (d) => d.radius + 6)
      .attr("fill", "currentColor")
      .attr("fill-opacity", (d) =>
        d.kind === "orchestrator" ? 0.18 : d.kind === "context" ? 0.12 : 0.06,
      );

    // Core circle
    nodeSel
      .append("circle")
      .attr("r", (d) => d.radius)
      .attr("fill", "hsl(var(--background))")
      .attr("stroke", "currentColor")
      .attr("stroke-width", (d) => (d.kind === "orchestrator" ? 2.25 : 1.5))
      .attr("filter", (d) => (d.kind === "orchestrator" ? "url(#agent-glow)" : null));

    // Label
    nodeSel
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("fill", "currentColor")
      .attr("font-size", (d) => (d.kind === "orchestrator" ? 11 : 10))
      .attr("font-weight", (d) => (d.kind === "orchestrator" ? 600 : 500))
      .attr("pointer-events", "none")
      .text((d) => d.label);

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as AgentNode).x ?? 0)
        .attr("y1", (d) => (d.source as AgentNode).y ?? 0)
        .attr("x2", (d) => (d.target as AgentNode).x ?? 0)
        .attr("y2", (d) => (d.target as AgentNode).y ?? 0);

      nodeSel.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Pulse animation: travels orchestrator → agent → context → other agents
    function pulseFromAgent(agentId: string) {
      const agent = nodes.find((n) => n.id === agentId);
      const orchestrator = nodes.find((n) => n.id === "orchestrator");
      const context = nodes.find((n) => n.id === "context");
      if (!agent || !orchestrator || !context) return;

      const path = [orchestrator, agent, context, ...nodes.filter((n) => n.kind === "agent" && n.id !== agentId)];

      path.forEach((target, i) => {
        const from = i === 0 ? agent : path[i - 1];
        const pulse = svg
          .append("circle")
          .attr("r", 4)
          .attr("fill", "currentColor")
          .attr("opacity", 0.9)
          .attr("cx", from.x ?? 0)
          .attr("cy", from.y ?? 0);

        pulse
          .transition()
          .delay(i * 220)
          .duration(420)
          .ease(d3.easeCubicInOut)
          .attr("cx", target.x ?? 0)
          .attr("cy", target.y ?? 0)
          .attr("opacity", 0)
          .attr("r", 1.5)
          .remove();
      });
    }

    // Auto-pulse on mount so the system feels alive
    const intro = setTimeout(() => pulseFromAgent("research"), 1100);

    // Resize handling
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      svg.attr("viewBox", `0 0 ${w} ${h}`);
      simulation.force("center", d3.forceCenter(w / 2, h / 2));
      simulation.alpha(0.3).restart();
    });
    ro.observe(container);

    return () => {
      clearTimeout(intro);
      ro.disconnect();
      simulation.stop();
    };
  }, []);


  return (
    <section className="relative overflow-hidden border-y border-border bg-gradient-to-b from-background via-background to-muted/30">
      {/* Ambient backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto grid max-w-7xl gap-10 px-6 py-16 md:py-24 lg:grid-cols-2 lg:gap-14">
        {/* Left: copy */}
        <div className="flex flex-col justify-center">
          <Badge className="w-fit gap-1 border-primary/30 bg-primary/10 text-primary hover:bg-primary/15">
            <Sparkles className="h-3 w-3" />
            Service · Agentic Ecosystems
          </Badge>

          <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Design ecosystems of agents that{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              think together
            </span>
            .
          </h1>

          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            We architect multi-agent systems where specialized AI co-workers
            coordinate around a shared context — orchestrated, observable,
            and aligned with how your organization actually decides.
          </p>

          <ul className="mt-6 space-y-3 text-sm text-foreground/90 md:text-base">
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Network className="h-4 w-4" />
              </span>
              <span>
                <strong>Orchestrated coordination</strong> — one conductor
                routes intent across role-specialized agents.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </span>
              <span>
                <strong>Shared context</strong> — a living memory layer keeps
                every agent grounded in the same reality.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Zap className="h-4 w-4" />
              </span>
              <span>
                <strong>Observable behavior</strong> — every decision pulse is
                traceable, governable, and human-aligned.
              </span>
            </li>
          </ul>

          <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <Button
              size="lg"
              onClick={() => setDemoOpen(true)}
              className="group gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-95"
            >
              Get a demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => handleGenerateDeck("primary_button")}
              className="group gap-2"
            >
              <FileText className="h-4 w-4" />
              Generate a deck
            </Button>
            <a href="/calm-magic-demo">
              <Button size="lg" variant="outline" className="gap-2">
                See Calm Magic in action
              </Button>
            </a>
          </div>

          <button
            type="button"
            onClick={() => handleGenerateDeck("text_link")}
            className="mt-3 text-left text-sm text-primary underline-offset-4 hover:underline"
          >
            Or generate a tailored deck from paracosm.helloarchitekt.com →
          </button>

          <p className="mt-3 text-xs text-muted-foreground">
            Click any agent in the visualization to watch the orchestrator
            route intent through the ecosystem.
            {activeAgent && (
              <span className="ml-1 text-primary">
                · Last activated: <strong>{activeAgent}</strong>
              </span>
            )}
          </p>
        </div>

        {/* Right: D3 visualization */}
        <div className="relative">
          <div
            ref={containerRef}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-card/60 text-primary shadow-xl backdrop-blur-sm"
          >
            <svg ref={svgRef} className="h-full w-full" role="img" aria-label="Interactive diagram of an agentic ecosystem">
              <title>Agentic ecosystem: orchestrator, shared context, specialized agents</title>
            </svg>

            {/* Legend */}
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-primary" /> Orchestrator
              </span>
              <span className="flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-accent" /> Context
              </span>
              <span className="flex items-center gap-1 rounded-md border border-border bg-background/80 px-2 py-1">
                <span className="h-2 w-2 rounded-full bg-foreground/40" /> Agent
              </span>
            </div>
          </div>
        </div>
      </div>

      <GetDemoDialog open={demoOpen} onOpenChange={setDemoOpen} />
    </section>
  );
};

export default AgenticEcosystemHero;
