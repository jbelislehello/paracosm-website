import { Link } from "react-router-dom";
import { ArrowRight, Linkedin } from "lucide-react";
import { cn } from "@/lib/utils";
import EditorialSection from "./EditorialSection";
import EditorialChapterHeader from "./EditorialChapterHeader";
import { editorialTone, editorialType, type EditorialTone } from "./editorialTokens";
import { trackEvent } from "@/lib/analytics";

import atelier from "@/assets/retreats/atelier-circle.jpg";
import forest from "@/assets/retreats/forest-circle.jpg";
import lake from "@/assets/retreats/lake-portrait.jpg";
import storm from "@/assets/retreats/storm-keynote.jpg";

// Swap this URL when the user provides the real LinkedIn newsletter link.
const LINKEDIN_NEWSLETTER_URL =
  "https://www.linkedin.com/newsletters/paracosm-dispatches-7000000000000000000/";

type Dispatch = {
  id: "tonalli" | "glitch" | "yutori" | "forest";
  kicker: string;
  headline: string;
  dek: string;
  meta?: string;
  image: string;
  alt: string;
  to: string;
  tone: EditorialTone;
  cta: string;
};

const dispatches: Dispatch[] = [
  {
    id: "tonalli",
    kicker: "Now shipping",
    headline: "Tonalli — a creative OS for voice & spatial work.",
    dek: "Two branches of a single instrument: voice computing and spatial cognition, both tuned to the Calm Magic framework.",
    image: lake,
    alt: "Tonalli — creative operating system",
    to: "/tonalli",
    tone: "clay",
    cta: "Enter Tonalli",
  },
  {
    id: "glitch",
    kicker: "Next live session",
    headline: "GL!TCH Session — 25 minutes to break the pattern.",
    dek: "A live cycle to interrupt inherited scripts and widen the window of tolerance. Small room, real practice.",
    meta: "Next date & city — TBA",
    image: storm,
    alt: "GL!TCH live session",
    to: "/glitch-events",
    tone: "night",
    cta: "Reserve a seat",
  },
  {
    id: "yutori",
    kicker: "Evening series",
    headline: "Yutori Nights — the intentional pause.",
    dek: "Intimate evenings for founders and creatives. Space, tea, and slow conversation about what wants to happen next.",
    meta: "Next date & city — TBA",
    image: atelier,
    alt: "Yutori Nights — evening gathering",
    to: "/events-and-retreats#yutori",
    tone: "warm",
    cta: "Save my chair",
  },
  {
    id: "forest",
    kicker: "Flagship retreat",
    headline: "Think Like a Forest.",
    dek: "A multi-day retreat for leaders learning to sense the whole system before intervening in it. Root, canopy, understory.",
    meta: "Dates & location — TBA",
    image: forest,
    alt: "Think Like a Forest retreat",
    to: "/events-and-retreats#think-like-a-forest",
    tone: "clay",
    cta: "Read the invitation",
  },
];

function DispatchCard({ d }: { d: Dispatch }) {
  const t = editorialTone[d.tone];
  return (
    <Link
      to={d.to}
      onClick={() =>
        trackEvent("editorial_dispatch_click", { dispatch: d.id })
      }
      className={cn(
        "group flex flex-col overflow-hidden rounded-sm border transition-transform hover:-translate-y-1",
        t.section,
        t.calloutBox,
      )}
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={d.image}
          alt={d.alt}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/80">
            {d.kicker}
          </p>
        </div>
      </div>
      <div className="flex-1 p-6 md:p-8 flex flex-col gap-4">
        <p className={cn(editorialType.kicker, t.kicker)}>{d.kicker}</p>
        <h3 className={cn("font-serif text-2xl md:text-3xl leading-tight")}>
          {d.headline}
        </h3>
        <p className="text-sm md:text-base opacity-80 leading-relaxed">{d.dek}</p>
        {d.meta && (
          <p className={cn(editorialType.caption)}>{d.meta}</p>
        )}
        <span
          className={cn(
            "mt-auto inline-flex items-center gap-2 pt-2",
            editorialType.cta,
            t.kicker,
          )}
        >
          {d.cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}

export default function EditorialDispatchesSection() {
  return (
    <EditorialSection tone="warm" id="dispatches">
      <EditorialChapterHeader
        numeral="04"
        kicker="Dispatches"
        subtitle="What's opening this season — in the studio, in the field, on the page."
        tone="warm"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {dispatches.map((d) => (
          <DispatchCard key={d.id} d={d} />
        ))}
      </div>

      {/* LinkedIn newsletter colophon */}
      <div className="mt-16 md:mt-24 border-t border-current/15 pt-10 md:pt-14 grid md:grid-cols-[1fr_auto] gap-8 md:gap-12 items-center">
        <div className="space-y-3">
          <p className={editorialType.kicker}>The Newsletter</p>
          <p className="font-serif text-2xl md:text-4xl leading-tight italic">
            &ldquo;Field notes from the edge of imagination and AI — delivered
            straight to your feed.&rdquo;
          </p>
          <p className="text-sm opacity-70">
            Monthly dispatches on Calm Magic, agentic practice, and the
            innovation plays our partners are running.
          </p>
        </div>
        <a
          href={LINKEDIN_NEWSLETTER_URL}
          target="_blank"
          rel="noreferrer noopener"
          onClick={() =>
            trackEvent("editorial_dispatch_click", { dispatch: "linkedin" })
          }
          className={cn(
            "inline-flex items-center gap-3 px-6 py-4 rounded-full transition-transform hover:-translate-y-0.5 whitespace-nowrap",
            editorialType.cta,
            "bg-foreground text-background",
          )}
        >
          <Linkedin className="w-4 h-4" />
          Subscribe on LinkedIn
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </EditorialSection>
  );
}
