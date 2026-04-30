import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Play,
  Pause,
  StepForward,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Network,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  AGENTS,
  SCENARIOS,
  biasTable,
  pickTransition,
  type AgentDef,
  type ModeBias,
} from "@/components/agentic-demo/scenarios";

/**
 * AgenticEcosystemDemo
 *
 * Three coordinated D3 visualizations driven by a small Markov-style tick:
 *   1. Force-directed agent network (center)
 *   2. Chord diagram of message flow density (right top)
 *   3. Activity log + sparkline (right bottom)
 *
 * Framed as Crewdle's "Dream & Learn" module — Dream agents diverge,
 * Learn agents converge, the Orchestrator routes attention between them.
 *
 * All colors come from design tokens via CSS variables read at runtime,
 * so the visualizations stay on-theme in both light and dark mode.
 */

interface SimNode extends d3.SimulationNodeDatum {
  id: string;
  label: string;
  mode: AgentDef["mode"];
  role: string;
  disabled?: boolean;
}

interface SimLink extends d3.SimulationLinkDatum<SimNode> {
  source: string | SimNode;
  target: string | SimNode;
  weight: number;
}

interface LogEntry {
  id: number;
  from: string;
  to: string;
  payload: string;
  t: number;
}

const TICK_MS = 600;
const LOG_MAX = 14;
const SPARK_WINDOW = 30;

// Read a CSS variable as a usable hsl() string. Falls back to currentColor.
const cssVar = (name: string, fallback = "currentColor") => {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v ? `hsl(${v})` : fallback;
};

const colorFor = (mode: AgentDef["mode"]) => {
  switch (mode) {
    case "orchestrator":
      return cssVar("--foreground");
    case "context":
      return cssVar("--muted-foreground");
    case "dream":
      return cssVar("--accent");
    case "learn":
      return cssVar("--primary");
  }
};

const AgenticEcosystemDemo = () => {
  // ── UI state ─────────────────────────────────────────────────────────────
  const [scenarioId, setScenarioId] = useState(SCENARIOS[0].id);
  const [bias, setBias] = useState<ModeBias>("balanced");
  const [running, setRunning] = useState(true);
  const [disabled, setDisabled] = useState<Set<string>>(new Set());
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [log, setLog] = useState<LogEntry[]>([]);

  // ── Refs ─────────────────────────────────────────────────────────────────
  const graphRef = useRef<SVGSVGElement>(null);
  const chordRef = useRef<SVGSVGElement>(null);
  const sparkRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Persistent simulation state (avoid resetting on every render)
  const activeAgentRef = useRef<string>("orchestrator");
  const matrixRef = useRef<number[][]>([]);
  const throughputRef = useRef<number[]>([]);
  const tickIdRef = useRef(0);

  const scenario = useMemo(
    () => SCENARIOS.find((s) => s.id === scenarioId) ?? SCENARIOS[0],
    [scenarioId],
  );

  // Index agents we expose in the chord matrix (skip context for clarity).
  const chordAgents = useMemo(
    () => AGENTS.filter((a) => a.mode !== "context"),
    [],
  );
  const chordIndex = useMemo(() => {
    const m: Record<string, number> = {};
    chordAgents.forEach((a, i) => (m[a.id] = i));
    return m;
  }, [chordAgents]);

  // Reset matrix + log + active agent when scenario changes
  useEffect(() => {
    matrixRef.current = chordAgents.map(() => chordAgents.map(() => 0));
    throughputRef.current = [];
    activeAgentRef.current = scenario.start;
    setLog([]);
  }, [scenario, chordAgents]);

  // ── Force graph ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!graphRef.current || !containerRef.current) return;
    const svg = d3.select(graphRef.current);
    svg.selectAll("*").remove();

    const width = 560;
    const height = 420;
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    const nodes: SimNode[] = AGENTS.map((a) => ({
      id: a.id,
      label: a.label,
      mode: a.mode,
      role: a.role,
      disabled: disabled.has(a.id),
    }));

    // Edges: orchestrator + context to all agents; dream<->dream, learn<->learn pairs
    const links: SimLink[] = [];
    const allAgents = AGENTS.filter((a) => a.mode !== "orchestrator" && a.mode !== "context");
    for (const a of allAgents) {
      links.push({ source: "orchestrator", target: a.id, weight: 1 });
      links.push({ source: "context", target: a.id, weight: 0.5 });
    }
    // intra-mode webbing
    const dream = allAgents.filter((a) => a.mode === "dream").map((a) => a.id);
    const learn = allAgents.filter((a) => a.mode === "learn").map((a) => a.id);
    for (let i = 0; i < dream.length; i++)
      links.push({ source: dream[i], target: dream[(i + 1) % dream.length], weight: 0.6 });
    for (let i = 0; i < learn.length; i++)
      links.push({ source: learn[i], target: learn[(i + 1) % learn.length], weight: 0.6 });
    // bridge dream<->learn lightly
    links.push({ source: "vision", target: "researcher", weight: 0.4 });
    links.push({ source: "storyteller", target: "tutor", weight: 0.4 });
    links.push({ source: "composer", target: "curator", weight: 0.4 });
    links.push({ source: "speculator", target: "pattern", weight: 0.4 });
    links.push({ source: "mythographer", target: "critic", weight: 0.4 });

    const muted = cssVar("--muted-foreground");

    const linkSel = svg
      .append("g")
      .attr("stroke-opacity", 0.25)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", muted)
      .attr("stroke-width", (d) => Math.max(0.6, d.weight))
      .attr("data-source", (d) => d.source as string)
      .attr("data-target", (d) => d.target as string);

    const nodeG = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .style("cursor", "pointer")
      .on("click", (_, d) => {
        setDisabled((prev) => {
          const next = new Set(prev);
          if (next.has(d.id)) next.delete(d.id);
          else next.add(d.id);
          return next;
        });
      })
      .on("mouseenter", (_, d) => setHoveredNode(d.id))
      .on("mouseleave", () => setHoveredNode(null));

    nodeG
      .append("circle")
      .attr("r", (d) => (d.mode === "orchestrator" ? 22 : d.mode === "context" ? 18 : 14))
      .attr("fill", (d) => colorFor(d.mode))
      .attr("fill-opacity", (d) => (disabled.has(d.id) ? 0.15 : 0.85))
      .attr("stroke", (d) => colorFor(d.mode))
      .attr("stroke-width", 1.5)
      .attr("data-id", (d) => d.id);

    nodeG
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d) =>
        d.mode === "orchestrator" ? 38 : d.mode === "context" ? 32 : 26,
      )
      .attr("font-size", 10)
      .attr("font-weight", 500)
      .attr("fill", cssVar("--foreground"))
      .text((d) => d.label);

    const sim = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink<SimNode, SimLink>(links)
          .id((d) => d.id)
          .distance((l) => 90 / (l.weight || 0.5))
          .strength(0.35),
      )
      .force("charge", d3.forceManyBody().strength(-220))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius(30));

    sim.on("tick", () => {
      linkSel
        .attr("x1", (d) => (d.source as SimNode).x ?? 0)
        .attr("y1", (d) => (d.source as SimNode).y ?? 0)
        .attr("x2", (d) => (d.target as SimNode).x ?? 0)
        .attr("y2", (d) => (d.target as SimNode).y ?? 0);
      nodeG.attr("transform", (d) => `translate(${d.x ?? 0},${d.y ?? 0})`);
    });

    // Expose a "pulse" function on the SVG via a custom dispatcher
    (svg.node() as any).__pulse = (from: string, to: string) => {
      const fromNode = nodes.find((n) => n.id === from);
      const toNode = nodes.find((n) => n.id === to);
      if (!fromNode || !toNode) return;
      const x1 = fromNode.x ?? 0;
      const y1 = fromNode.y ?? 0;
      const x2 = toNode.x ?? 0;
      const y2 = toNode.y ?? 0;
      const pulse = svg
        .append("circle")
        .attr("r", 4)
        .attr("cx", x1)
        .attr("cy", y1)
        .attr("fill", colorFor(fromNode.mode))
        .attr("fill-opacity", 0.95)
        .attr("stroke", colorFor(fromNode.mode))
        .attr("stroke-opacity", 0.4)
        .attr("stroke-width", 6);
      pulse
        .transition()
        .duration(TICK_MS - 50)
        .ease(d3.easeCubicOut)
        .attr("cx", x2)
        .attr("cy", y2)
        .attr("r", 6)
        .attr("fill-opacity", 0.2)
        .remove();
    };

    return () => {
      sim.stop();
    };
  }, [disabled]);

  // Re-tint nodes when disabled set changes (already in effect deps via redraw).
  // Highlight hovered node's neighborhood.
  useEffect(() => {
    if (!graphRef.current) return;
    const svg = d3.select(graphRef.current);
    svg
      .selectAll<SVGLineElement, SimLink>("line")
      .attr("stroke-opacity", (d) => {
        const s = typeof d.source === "string" ? d.source : d.source.id;
        const t = typeof d.target === "string" ? d.target : d.target.id;
        if (!hoveredNode) return 0.25;
        return s === hoveredNode || t === hoveredNode ? 0.85 : 0.08;
      });
    svg
      .selectAll<SVGCircleElement, SimNode>("circle[data-id]")
      .attr("fill-opacity", function () {
        const id = this.getAttribute("data-id") || "";
        if (disabled.has(id)) return 0.15;
        if (!hoveredNode) return 0.85;
        return id === hoveredNode ? 1 : 0.35;
      });
  }, [hoveredNode, disabled]);

  // ── Tick loop ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => {
      const biased = biasTable(scenario.table, bias, disabled);
      const from = activeAgentRef.current;
      const transitions = biased[from] ?? [];
      const next = pickTransition(transitions);
      if (!next) {
        // dead-end: jump back to orchestrator
        activeAgentRef.current = "orchestrator";
        return;
      }
      // pulse on the graph
      const svgEl = graphRef.current as any;
      svgEl?.__pulse?.(from, next.to);

      // update chord matrix
      const fi = chordIndex[from];
      const ti = chordIndex[next.to];
      if (fi !== undefined && ti !== undefined) {
        matrixRef.current[fi][ti] += 1;
      }

      // update throughput
      const arr = throughputRef.current;
      arr.push(1);
      if (arr.length > SPARK_WINDOW) arr.shift();

      // update log
      tickIdRef.current += 1;
      const entry: LogEntry = {
        id: tickIdRef.current,
        from,
        to: next.to,
        payload: next.payload,
        t: Date.now(),
      };
      setLog((prev) => [entry, ...prev].slice(0, LOG_MAX));

      activeAgentRef.current = next.to;
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [running, scenario, bias, disabled, chordIndex]);

  // ── Chord diagram ────────────────────────────────────────────────────────
  // Re-renders on every log change (cheap; matrix is 10x10).
  useEffect(() => {
    if (!chordRef.current) return;
    const size = 260;
    const innerR = size / 2 - 50;
    const outerR = size / 2 - 38;
    const svg = d3.select(chordRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `${-size / 2} ${-size / 2} ${size} ${size}`);

    const matrix = matrixRef.current;
    if (!matrix.length) return;

    const chord = d3.chord().padAngle(0.04).sortSubgroups(d3.descending)(matrix);

    const arc = d3.arc<d3.ChordGroup>().innerRadius(innerR).outerRadius(outerR);
    const ribbon = d3.ribbon<d3.Chord, d3.ChordSubgroup>().radius(innerR);

    svg
      .append("g")
      .selectAll("path")
      .data(chord.groups)
      .join("path")
      .attr("d", arc as any)
      .attr("fill", (d) => colorFor(chordAgents[d.index].mode))
      .attr("fill-opacity", 0.85)
      .attr("stroke", cssVar("--background"))
      .attr("stroke-width", 1)
      .style("cursor", "pointer")
      .on("mouseenter", (_, d) => setHoveredNode(chordAgents[d.index].id))
      .on("mouseleave", () => setHoveredNode(null))
      .append("title")
      .text((d) => chordAgents[d.index].label);

    svg
      .append("g")
      .attr("fill-opacity", 0.55)
      .selectAll("path")
      .data(chord)
      .join("path")
      .attr("d", ribbon as any)
      .attr("fill", (d) => colorFor(chordAgents[d.source.index].mode))
      .attr("stroke", cssVar("--background"))
      .attr("stroke-width", 0.4)
      .on("mouseenter", (_, d) => setHoveredNode(chordAgents[d.source.index].id))
      .on("mouseleave", () => setHoveredNode(null))
      .append("title")
      .text(
        (d) =>
          `${chordAgents[d.source.index].label} → ${chordAgents[d.target.index].label}: ${d.source.value}`,
      );

    // labels
    svg
      .append("g")
      .selectAll("text")
      .data(chord.groups)
      .join("text")
      .attr("transform", (d) => {
        const angle = (d.startAngle + d.endAngle) / 2;
        const r = outerR + 8;
        const x = Math.sin(angle) * r;
        const y = -Math.cos(angle) * r;
        return `translate(${x}, ${y})`;
      })
      .attr("text-anchor", "middle")
      .attr("dy", "0.32em")
      .attr("font-size", 8)
      .attr("fill", cssVar("--muted-foreground"))
      .text((d) => chordAgents[d.index].label);
  }, [log, chordAgents]);

  // ── Sparkline ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!sparkRef.current) return;
    const w = 220;
    const h = 36;
    const svg = d3.select(sparkRef.current);
    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${w} ${h}`);
    const data = throughputRef.current;
    if (!data.length) return;
    // accumulate trailing throughput as a wiggling area
    const points = data.map((v, i) => ({ i, v: v + Math.sin(i * 0.6) * 0.2 }));
    const x = d3
      .scaleLinear()
      .domain([0, SPARK_WINDOW - 1])
      .range([0, w]);
    const y = d3.scaleLinear().domain([0, 1.5]).range([h - 2, 2]);
    const area = d3
      .area<{ i: number; v: number }>()
      .curve(d3.curveCatmullRom)
      .x((d) => x(d.i))
      .y0(h)
      .y1((d) => y(d.v));
    svg
      .append("path")
      .datum(points)
      .attr("d", area as any)
      .attr("fill", colorFor("dream"))
      .attr("fill-opacity", 0.25)
      .attr("stroke", colorFor("dream"))
      .attr("stroke-width", 1.2);
  }, [log]);

  const reset = () => {
    matrixRef.current = chordAgents.map(() => chordAgents.map(() => 0));
    throughputRef.current = [];
    activeAgentRef.current = scenario.start;
    setLog([]);
    setDisabled(new Set());
  };

  const stepOnce = () => {
    setRunning(false);
    // trigger a single tick by briefly enabling
    const biased = biasTable(scenario.table, bias, disabled);
    const from = activeAgentRef.current;
    const next = pickTransition(biased[from] ?? []);
    if (!next) return;
    (graphRef.current as any)?.__pulse?.(from, next.to);
    const fi = chordIndex[from];
    const ti = chordIndex[next.to];
    if (fi !== undefined && ti !== undefined) matrixRef.current[fi][ti] += 1;
    throughputRef.current.push(1);
    if (throughputRef.current.length > SPARK_WINDOW) throughputRef.current.shift();
    tickIdRef.current += 1;
    setLog((prev) =>
      [
        { id: tickIdRef.current, from, to: next.to, payload: next.payload, t: Date.now() },
        ...prev,
      ].slice(0, LOG_MAX),
    );
    activeAgentRef.current = next.to;
  };

  const labelFor = (id: string) => AGENTS.find((a) => a.id === id)?.label ?? id;

  return (
    <section
      id="agentic-demo"
      className="py-16 md:py-24 px-4 bg-gradient-to-br from-background via-muted/20 to-background"
    >
      <div className="container max-w-7xl mx-auto">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-10 space-y-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="gap-1 bg-gradient-to-r from-emerald-600 to-cyan-600 text-white border-0">
              <Sparkles className="h-3 w-3" />
              Powered by Crewdle · Dream &amp; Learn
            </Badge>
            <Badge variant="outline" className="border-primary/40 text-primary">
              Interactive demo
            </Badge>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            See an agentic ecosystem{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              think — live
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground">
            <strong className="text-foreground">Dream &amp; Learn</strong> is the AI
            orchestration &amp; inventivity module Jonathan is building inside{" "}
            <a
              href="https://crewdle.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline-offset-4 hover:underline inline-flex items-center gap-1"
            >
              Crewdle's edge-AI platform <ExternalLink className="h-3 w-3" />
            </a>
            . <em>Dream</em> agents diverge — speculate, story, compose. <em>Learn</em>{" "}
            agents converge — research, critique, curate. The Orchestrator routes
            attention between the two so organizations can{" "}
            <strong className="text-foreground">invent and integrate</strong> in the
            same loop.
          </p>
        </div>

        {/* Demo grid */}
        <div
          ref={containerRef}
          className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6"
        >
          {/* Controls */}
          <div className="lg:col-span-3 space-y-4 rounded-2xl border border-border bg-card p-5">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Scenario
              </Label>
              <Select value={scenarioId} onValueChange={setScenarioId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SCENARIOS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {scenario.description}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Mode bias
              </Label>
              <ToggleGroup
                type="single"
                value={bias}
                onValueChange={(v) => v && setBias(v as ModeBias)}
                className="grid grid-cols-3 gap-1"
              >
                <ToggleGroupItem value="dream" className="text-xs">
                  Dream
                </ToggleGroupItem>
                <ToggleGroupItem value="balanced" className="text-xs">
                  Both
                </ToggleGroupItem>
                <ToggleGroupItem value="learn" className="text-xs">
                  Learn
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <Label htmlFor="run-toggle" className="text-sm">
                {running ? "Running" : "Paused"}
              </Label>
              <Switch
                id="run-toggle"
                checked={running}
                onCheckedChange={setRunning}
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setRunning((r) => !r)}
                className="gap-1"
              >
                {running ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {running ? "Pause" : "Play"}
              </Button>
              <Button size="sm" variant="outline" onClick={stepOnce} className="gap-1">
                <StepForward className="h-3 w-3" />
                Step
              </Button>
              <Button size="sm" variant="outline" onClick={reset} className="gap-1">
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Click an agent in the graph to disable it
              </Label>
              <div className="flex flex-wrap gap-1">
                {AGENTS.filter(
                  (a) => a.mode === "dream" || a.mode === "learn",
                ).map((a) => {
                  const off = disabled.has(a.id);
                  return (
                    <button
                      key={a.id}
                      onClick={() =>
                        setDisabled((prev) => {
                          const n = new Set(prev);
                          if (n.has(a.id)) n.delete(a.id);
                          else n.add(a.id);
                          return n;
                        })
                      }
                      onMouseEnter={() => setHoveredNode(a.id)}
                      onMouseLeave={() => setHoveredNode(null)}
                      className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${
                        off
                          ? "border-border text-muted-foreground line-through opacity-60"
                          : a.mode === "dream"
                            ? "border-accent/40 text-accent bg-accent/5"
                            : "border-primary/40 text-primary bg-primary/5"
                      }`}
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Force graph */}
          <div className="lg:col-span-6 rounded-2xl border border-border bg-card p-3 relative">
            <div className="flex items-center gap-2 px-2 py-1 text-xs text-muted-foreground">
              <Network className="h-3.5 w-3.5" />
              Live message routing
              {hoveredNode && (
                <span className="ml-auto text-foreground">
                  {labelFor(hoveredNode)} · {AGENTS.find((a) => a.id === hoveredNode)?.role}
                </span>
              )}
            </div>
            <svg
              ref={graphRef}
              className="w-full h-[340px] md:h-[420px]"
              role="img"
              aria-label="Agentic ecosystem force-directed graph"
            />
          </div>

          {/* Chord + log */}
          <div className="lg:col-span-3 space-y-4">
            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="text-xs text-muted-foreground px-2 pb-1">
                Message flow density
              </div>
              <svg
                ref={chordRef}
                className="w-full h-[240px]"
                role="img"
                aria-label="Chord diagram of agent message density"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-3">
              <div className="flex items-center justify-between text-xs text-muted-foreground px-2 pb-1">
                <span>Activity log</span>
                <span>{throughputRef.current.length} ticks</span>
              </div>
              <svg ref={sparkRef} className="w-full h-[36px]" aria-hidden />
              <ul className="mt-2 space-y-1 text-[11px] font-mono max-h-[180px] overflow-hidden">
                {log.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center gap-1 text-muted-foreground truncate"
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{
                        background: colorFor(
                          AGENTS.find((a) => a.id === e.from)?.mode ?? "context",
                        ),
                      }}
                    />
                    <span className="text-foreground">{labelFor(e.from)}</span>
                    <ArrowRight className="h-3 w-3 shrink-0" />
                    <span className="text-foreground">{labelFor(e.to)}</span>
                    <span className="ml-1 truncate opacity-80">: {e.payload}</span>
                  </li>
                ))}
                {!log.length && (
                  <li className="text-muted-foreground italic">Press Play to begin…</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 max-w-3xl mx-auto text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            This is a conceptual demo. The production Dream &amp; Learn module runs on
            Crewdle's distributed edge-AI fabric — agents execute close to the data,
            with consent and provenance preserved end-to-end.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://app.reclaim.ai/m/jonathan-helloarchitekt"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                className="gap-2 bg-gradient-to-r from-primary to-accent text-primary-foreground"
              >
                Book a discovery call
                <ArrowRight className="h-4 w-4" />
              </Button>
            </a>
            <Link to="/dream-and-learn">
              <Button size="lg" variant="outline" className="gap-2 border-primary/40">
                <Sparkles className="h-4 w-4" />
                Learn about Dream &amp; Learn
              </Button>
            </Link>
            <Link to="/drift/2026/04">
              <Button size="lg" variant="ghost" className="gap-2">
                Read April Drift — Relationship Model
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgenticEcosystemDemo;
