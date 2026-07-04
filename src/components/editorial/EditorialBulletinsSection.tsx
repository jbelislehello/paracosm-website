import { Link } from "react-router-dom";
import { ArrowUpRight, Calendar, MapPin, Music, Sparkles, Film } from "lucide-react";
import { cn } from "@/lib/utils";
import EditorialSection from "./EditorialSection";
import EditorialChapterHeader from "./EditorialChapterHeader";
import { editorialTone, editorialType } from "./editorialTokens";

type Bulletin = {
  kicker: string;
  headline: string;
  dek: string;
  meta?: string;
  cta: string;
  to?: string;
  href?: string;
};

const workshop: Bulletin = {
  kicker: "Upcoming workshop",
  headline: "GL!TCH Workshop — break the pattern, on purpose.",
  dek: "A hands-on cycle to interrupt inherited scripts, widen the window of tolerance, and rehearse a new move before the stakes get real.",
  meta: "Next cohort — dates TBA",
  cta: "Reserve a seat",
  to: "/glitch-events",
};

const drift = {
  kicker: "The Drift — Latest edition",
  currentTitle: "Queer AI",
  currentTag: "July 2026 · Now reading",
  nextTitle: "In the works",
  nextTag: "Next edition · TBA",
  dek: "Field notes tracking what wants to think next — a monthly pulse across the five Calm Magic axes.",
  cta: "Enter The Drift",
  to: "/drift",
};

const releases: {
  title: string;
  status: string;
  dek: string;
  icon: typeof Music;
}[] = [
  {
    title: "Satori & Kensho — Album Launch",
    status: "Releasing",
    dek: "Two records, one arc: sudden seeing (Satori) and the deepening after (Kensho). Listening rooms opening this season.",
    icon: Music,
  },
  {
    title: "The Relational Manifold",
    status: "Published",
    dek: "A field guide to the geometry of relation — how care, attention and difference curve the space we build together.",
    icon: Sparkles,
  },
  {
    title: "Wuxia the Fox — Animated Film",
    status: "Pre-production",
    dek: "Our transmedia story guide steps onto the screen. Development begins with the writers' room and a first pass at the visual language.",
    icon: Film,
  },
];

const sanctum: Bulletin = {
  kicker: "New live event",
  headline: "The Tuner's Sanctum — off the street, into the workshop.",
  dek: "A community-driven sanctuary for AI & philosophy enthusiasts, artists, mathematicians and engineers to build, learn, and wrench on their projects together.",
  meta: "Recurring · invitation only",
  cta: "Request an invitation",
  to: "/events-and-retreats",
};

function BulletinCard({ b, tone }: { b: Bulletin; tone: "warm" | "night" | "clay" | "paper" }) {
  const t = editorialTone[tone];
  const Inner = (
    <article className={cn("h-full flex flex-col p-8 md:p-10 border rounded-sm transition-transform hover:-translate-y-1", t.calloutBox)}>
      <p className={cn(editorialType.kicker, t.kicker)}>{b.kicker}</p>
      <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight mt-3")}>{b.headline}</h3>
      <p className="mt-4 text-[15px] leading-relaxed opacity-85">{b.dek}</p>
      {b.meta && (
        <p className={cn("mt-4 flex items-center gap-2", editorialType.caption)}>
          <Calendar className="w-3 h-3" />
          {b.meta}
        </p>
      )}
      <span className={cn("mt-auto pt-6 inline-flex items-center gap-1.5 border-b self-start pb-1", editorialType.cta, t.accentBorder, t.kicker)}>
        {b.cta}
        <ArrowUpRight className="w-3.5 h-3.5" />
      </span>
    </article>
  );
  if (b.to) return <Link to={b.to} className="group block h-full">{Inner}</Link>;
  return <a href={b.href} target="_blank" rel="noreferrer noopener" className="group block h-full">{Inner}</a>;
}

export default function EditorialBulletinsSection() {
  const clay = editorialTone.clay;
  return (
    <EditorialSection tone="paper" id="bulletins">
      <EditorialChapterHeader
        numeral="04"
        kicker="Bulletins"
        subtitle="What's opening, what's shipping, what's being made."
        tone="paper"
      />

      {/* Row 1 — Workshop + The Drift */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        <BulletinCard b={workshop} tone="warm" />

        <Link to={drift.to} className="group block h-full">
          <article className={cn("h-full flex flex-col p-8 md:p-10 border rounded-sm transition-transform hover:-translate-y-1", editorialTone.night.section, editorialTone.night.calloutBox)}>
            <p className={cn(editorialType.kicker, editorialTone.night.kicker)}>{drift.kicker}</p>
            <div className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 items-baseline">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", editorialTone.night.numeral)}>06</span>
              <div>
                <p className={cn(editorialType.caption, editorialTone.night.kicker)}>{drift.currentTag}</p>
                <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight italic")}>{drift.currentTitle}</h3>
              </div>
              <span className={cn(editorialType.serif, "text-3xl md:text-4xl leading-none opacity-60")}>07</span>
              <div className="opacity-80">
                <p className={cn(editorialType.caption)}>{drift.nextTag}</p>
                <h4 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight italic")}>{drift.nextTitle}</h4>
              </div>
            </div>
            <p className="mt-6 text-[15px] leading-relaxed opacity-85">{drift.dek}</p>
            <span className={cn("mt-auto pt-6 inline-flex items-center gap-1.5 border-b self-start pb-1", editorialType.cta, editorialTone.night.accentBorder, editorialTone.night.kicker)}>
              {drift.cta}
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          </article>
        </Link>
      </div>

      {/* Row 2 — HA Labs Creative Releases */}
      <div className="mt-16 md:mt-20">
        <div className={cn("flex items-baseline justify-between border-b border-current/15 pb-4 mb-10")}>
          <div>
            <p className={cn(editorialType.kicker, clay.kicker)}>HA Labs — Creative Releases</p>
            <h3 className={cn(editorialType.serif, "text-3xl md:text-4xl italic mt-2")}>From the studio floor.</h3>
          </div>
          <span className={cn(editorialType.caption, "tabular-nums opacity-60")}>03 / 03</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {releases.map((r, i) => {
            const Icon = r.icon;
            return (
              <article key={r.title} className={cn("flex flex-col p-8 border rounded-sm", clay.calloutBox)}>
                <div className="flex items-center justify-between mb-6">
                  <Icon className={cn("w-5 h-5", clay.kicker)} />
                  <span className={cn(editorialType.caption, "tabular-nums opacity-50")}>{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className={cn(editorialType.kicker, clay.kicker)}>{r.status}</p>
                <h4 className={cn(editorialType.serif, "text-2xl leading-tight mt-2")}>{r.title}</h4>
                <p className="mt-3 text-sm leading-relaxed opacity-80">{r.dek}</p>
              </article>
            );
          })}
        </div>
      </div>

      {/* Row 3 — Tuner's Sanctum, full-bleed feature */}
      <div className="mt-16 md:mt-20">
        <Link to={sanctum.to!} className="group block">
          <article className={cn("grid md:grid-cols-[1fr_2fr] gap-8 md:gap-12 p-8 md:p-12 border rounded-sm transition-transform hover:-translate-y-1", editorialTone.clay.section, editorialTone.clay.calloutBox)}>
            <div className="border-r-0 md:border-r border-current/15 md:pr-8">
              <p className={cn(editorialType.kicker, editorialTone.clay.kicker)}>{sanctum.kicker}</p>
              <p className={cn(editorialType.serif, "text-6xl md:text-7xl italic leading-none mt-4", editorialTone.clay.numeral)}>07</p>
              <p className={cn("mt-4 flex items-center gap-2", editorialType.caption)}>
                <MapPin className="w-3 h-3" />
                {sanctum.meta}
              </p>
            </div>
            <div className="flex flex-col">
              <h3 className={cn(editorialType.serif, "text-3xl md:text-4xl leading-tight")}>{sanctum.headline}</h3>
              <p className="mt-4 text-base leading-relaxed opacity-85 max-w-2xl">{sanctum.dek}</p>
              <span className={cn("mt-6 inline-flex items-center gap-1.5 border-b self-start pb-1", editorialType.cta, editorialTone.clay.accentBorder, editorialTone.clay.kicker)}>
                {sanctum.cta}
                <ArrowUpRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </article>
        </Link>
      </div>
    </EditorialSection>
  );
}
