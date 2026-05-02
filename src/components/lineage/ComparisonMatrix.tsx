import React from "react";
import { Card } from "@/components/ui/card";

type RowKey =
  | "unit"
  | "bottleneck"
  | "ai"
  | "output"
  | "shines"
  | "extends";

const ROW_LABELS: Record<RowKey, string> = {
  unit: "Core unit of work",
  bottleneck: "Primary bottleneck addressed",
  ai: "Stance toward agents & AI",
  output: "Output",
  shines: "Where it shines",
  extends: "Where Calm Magic extends it",
};

interface FrameworkColumn {
  id: string;
  name: string;
  tagline: string;
  accent: string; // tailwind class for top border
  rows: Record<RowKey, string>;
}

const COLUMNS: FrameworkColumn[] = [
  {
    id: "calm-magic",
    name: "Calm Magic",
    tagline: "Paracosm · Jonathan Belisle",
    accent: "border-t-primary",
    rows: {
      unit: "A breath cycle: GL!TCH → DRIFT → TUNE → LOVE → MAGIC → CALM → FREE.",
      bottleneck: "Intention, framing, and relational capacity in the agentic era.",
      ai: "Agents-as-given. Humans become the framers and worldbuilders.",
      output: "Preferable futures shipped through a maturity-matched system (Crewdle.ai).",
      shines: "When execution is cheap and meaning is the bottleneck.",
      extends: "—",
    },
  },
  {
    id: "design-thinking",
    name: "Design Thinking",
    tagline: "IDEO · Stanford d.school",
    accent: "border-t-blue-500",
    rows: {
      unit: "Empathize → Define → Ideate → Prototype → Test.",
      bottleneck: "User empathy and problem framing.",
      ai: "Mostly silent. Treats AI as a tool, not a co-author.",
      output: "Validated prototype.",
      shines: "Discovery, alignment, and human-centered product work.",
      extends: "Adds existential design and worldbuilding above empathy; treats agents as collaborators, not tools.",
    },
  },
  {
    id: "theory-u",
    name: "Theory U",
    tagline: "Otto Scharmer · Presencing Institute",
    accent: "border-t-violet-500",
    rows: {
      unit: "Co-initiating → sensing → presencing → crystallizing → prototyping → performing.",
      bottleneck: "Inner shift required to perceive emerging futures.",
      ai: "Silent. Predates the agentic era.",
      output: "Personal and systemic shift toward a future that wants to emerge.",
      shines: "Leadership development and deep change work.",
      extends: "Operationalizes presencing into playbooks, a maturity model, and shipped product systems.",
    },
  },
  {
    id: "cynefin",
    name: "Cynefin",
    tagline: "Dave Snowden · Cognitive Edge",
    accent: "border-t-emerald-500",
    rows: {
      unit: "Sense-making across clear, complicated, complex, chaotic, and confused domains.",
      bottleneck: "Complexity literacy and refusing premature resolution.",
      ai: "Agnostic. A typology, not an AI stance.",
      output: "A decision frame matched to the domain.",
      shines: "Naming what kind of problem you actually have.",
      extends: "Adds a practice — rituals, board, and ontology — for inhabiting complex and chaotic domains over time.",
    },
  },
  {
    id: "speculative-design",
    name: "Speculative Design",
    tagline: "Dunne & Raby · Critical Design",
    accent: "border-t-amber-500",
    rows: {
      unit: "Provocation through diegetic prototypes and design fiction.",
      bottleneck: "Cultural imagination — what futures are even thinkable.",
      ai: "Critical-speculative. Often interrogates AI rather than uses it.",
      output: "Artifacts that reframe the conversation about the future.",
      shines: "Expanding the cone of preferable futures.",
      extends: "Lands speculation inside organizations — turns provocation into a maturity-aware roadmap teams can inhabit.",
    },
  },
  {
    id: "vibe",
    name: '"Vibe coding" stacks',
    tagline: "Generic AI-first playbooks",
    accent: "border-t-rose-500",
    rows: {
      unit: "Prompt → artifact → ship.",
      bottleneck: "Speed of execution.",
      ai: "Maximalist. Agents do everything; framing is optional.",
      output: "Fast artifacts, shallow adoption.",
      shines: "Demos and one-off output theatre.",
      extends: "Replaces speed-for-speed with informed velocity: speed × direction toward a preferable future.",
    },
  },
];

const ROW_ORDER: RowKey[] = ["unit", "bottleneck", "ai", "output", "shines", "extends"];

const ComparisonMatrix: React.FC = () => {
  return (
    <div className="w-full">
      {/* Desktop / tablet: scrollable matrix */}
      <div className="hidden md:block">
        <div className="overflow-x-auto rounded-2xl border border-border bg-card/40 backdrop-blur-sm">
          <table className="w-full min-w-[960px] text-left text-sm">
            <thead>
              <tr>
                <th className="sticky left-0 z-10 bg-card/80 p-4 align-bottom text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm">
                  Dimension
                </th>
                {COLUMNS.map((col) => (
                  <th
                    key={col.id}
                    className={`border-t-4 ${col.accent} p-4 align-bottom`}
                  >
                    <div className="text-base font-semibold text-foreground">
                      {col.name}
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {col.tagline}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROW_ORDER.map((rowKey, idx) => (
                <tr
                  key={rowKey}
                  className={idx % 2 === 0 ? "bg-background/30" : ""}
                >
                  <th
                    scope="row"
                    className="sticky left-0 z-10 bg-card/80 p-4 align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
                  >
                    {ROW_LABELS[rowKey]}
                  </th>
                  {COLUMNS.map((col) => (
                    <td
                      key={col.id}
                      className={`p-4 align-top text-sm leading-relaxed ${
                        col.id === "calm-magic"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {col.rows[rowKey]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Scroll horizontally to compare all six framings.
        </p>
      </div>

      {/* Mobile: stacked cards */}
      <div className="space-y-4 md:hidden">
        {COLUMNS.map((col) => (
          <Card
            key={col.id}
            className={`border-t-4 ${col.accent} bg-card/60 p-5 backdrop-blur-sm`}
          >
            <div className="mb-1 text-base font-semibold text-foreground">
              {col.name}
            </div>
            <div className="mb-4 text-xs text-muted-foreground">
              {col.tagline}
            </div>
            <dl className="space-y-3">
              {ROW_ORDER.map((rowKey) => (
                <div key={rowKey}>
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {ROW_LABELS[rowKey]}
                  </dt>
                  <dd
                    className={`mt-1 text-sm leading-relaxed ${
                      col.id === "calm-magic"
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {col.rows[rowKey]}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ComparisonMatrix;
