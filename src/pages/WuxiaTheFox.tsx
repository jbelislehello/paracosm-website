import { Link } from "react-router-dom";
import { ArrowRight, Award } from "lucide-react";
import Footer from "@/components/Footer";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { creativeWorkSchema } from "@/lib/structuredData";

const books = [
  {
    n: "01",
    title: "The Consent Guardian's Awakening",
    description:
      "Wuxia discovers her role as a bridge between ancient wisdom and AI ethics, navigating consent in a world of infinite data.",
    themes: ["Digital Sovereignty", "Consent Architecture", "Fox Medicine"],
  },
  {
    n: "02",
    title: "Shadows in the Algorithm",
    description:
      "Exploring the shadow self through machine-learning mirrors, Wuxia confronts the projections encoded in our collective digital unconscious.",
    themes: ["Shadow Integration", "Algorithmic Bias", "Mirror Work"],
  },
  {
    n: "03",
    title: "The Prophecy Engine",
    description:
      "Wuxia learns to read patterns of emergence — how collective attention shapes reality through AI-augmented divination.",
    themes: ["Emergence", "Collective Intelligence", "Oracular AI"],
  },
  {
    n: "04",
    title: "Dance of the Higher Self",
    description:
      "The fox finds her path between trickster and sage, teaching humans to integrate fragmented digital personas into sovereign beings.",
    themes: ["Integration", "Digital Identity", "Transformation"],
  },
  {
    n: "05",
    title: "The Paracosm Manifold",
    description:
      "All timelines converge as Wuxia reveals the interconnected nature of consciousness, technology, and story.",
    themes: ["Unity", "Manifold Theory", "Collective Dreaming"],
  },
];

const filmPillars = [
  {
    n: "01",
    title: "Generative Narratives",
    body:
      "The film adapts in real-time, weaving viewer responses and collective attention into the story. No two screenings are alike — each audience co-creates their prophetic experience.",
  },
  {
    n: "02",
    title: "Consent-First Design",
    body:
      "Built on the TOTEM consent framework. Viewers control what data shapes their experience, modelling ethical AI interaction through narrative immersion.",
  },
  {
    n: "03",
    title: "Prophetic Technology",
    body:
      "Drawing on I Ching, Tzolkin and emergence theory, the AI identifies patterns in collective attention and weaves them into story — creating genuinely prophetic narrative experiences.",
  },
  {
    n: "04",
    title: "Shadow Integration",
    body:
      "Wuxia guides viewers through shadow work via narrative, using the safety of story to explore aspects of consciousness that might otherwise remain hidden.",
  },
];

const WuxiaTheFox = () => {
  usePageSeo({
    title: "Wuxia the Fox — Prophetic transmedia from the Paracosm universe",
    description:
      "Wuxia the Fox is a transmedia project of five books and an AI-enabled prophetic film — the consent guardian of the Paracosm universe.",
    path: "/wuxia",
    jsonLd: [
      creativeWorkSchema({
        name: "Wuxia the Fox",
        description:
          "The consent guardian and story guide of the Paracosm transmedia universe, bridging ancient wisdom and AI ethics.",
        url: "/wuxia",
      }),
    ],
  });

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        tone="warm"
        numeral="00"
        kicker="Product · Transmedia universe"
        title={
          <>
            Wuxia the Fox — <em className="italic font-light">prophetic</em> storytelling for the AI age.
          </>
        }
        subtitle="Five interconnected books and an AI-enabled prophetic film. Story guide, consent guardian, trickster sage — Wuxia bridges ancient fox medicine with contemporary AI ethics."
      />

      <EditorialSection tone="paper">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] opacity-70 mb-6">
          <Award className="w-3.5 h-3.5" />
          Funded by Le Conseil des arts et des lettres du Québec
        </div>
        <EditorialChapterHeader
          numeral="01"
          kicker="The vision"
          subtitle="A narrative AI companion at the intersection of ancient wisdom and cutting-edge AI."
          tone="paper"
        />
        <div className="mt-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed opacity-90">
            <p>
              <strong>Wuxia the Fox</strong> is not just a character — she is a narrative AI companion that emerges at
              the intersection of ancient wisdom traditions and artificial intelligence. As a{" "}
              <em>Story Guide</em>, she helps humans navigate their inner landscapes through metaphor and myth.
              As a <em>Consent Guardian</em>, she models ethical AI interaction rooted in sovereignty and choice.
            </p>
            <p>
              The project weaves together five books, an AI-enabled prophetic film, and interactive experiences
              that blur the line between reader, viewer and participant. Each entry point offers a different lens
              into the same living story — a paracosm where your choices ripple through the narrative.
            </p>
          </div>
          <aside className={cn("md:col-span-4 border-l border-current/20 pl-6 space-y-3", editorialType.caption)}>
            <p>In this issue</p>
            <ol className="space-y-2 text-sm normal-case tracking-normal opacity-90">
              <li>01 — The pentalogy</li>
              <li>02 — The film</li>
              <li>03 — The Paracosm connection</li>
            </ol>
          </aside>
        </div>
      </EditorialSection>

      <EditorialSection tone="warm" id="books">
        <EditorialChapterHeader
          numeral="02"
          kicker="The pentalogy"
          subtitle="Five books. One living story."
          tone="warm"
        />
        <div className="mt-12 divide-y divide-current/15 border-t-2 border-current/70">
          {books.map((b) => (
            <article key={b.n} className="grid grid-cols-[auto_1fr] gap-6 md:gap-10 py-8">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl w-14 md:w-16", editorialTone.warm.numeral)}>
                {b.n}
              </span>
              <div>
                <h3 className={cn(editorialType.serif, "text-2xl md:text-3xl leading-tight tracking-tight mb-2")}>
                  {b.title}
                </h3>
                <p className="italic font-light opacity-80 max-w-3xl leading-relaxed mb-3">
                  {b.description}
                </p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs uppercase tracking-[0.2em] opacity-60">
                  {b.themes.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection tone="night" id="film">
        <EditorialChapterHeader
          numeral="03"
          kicker="The film"
          subtitle="AI-enabled prophetic cinema."
          tone="night"
        />
        <p className="mt-8 max-w-3xl text-lg opacity-80 leading-relaxed">
          A new form of storytelling where artificial intelligence becomes a creative collaborator, generating
          personalized narrative threads that respond to collective and individual consciousness.
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {filmPillars.map((p) => (
            <article key={p.n} className="border-t border-current/25 pt-5">
              <div className="flex items-baseline justify-between mb-3">
                <span className={cn(editorialType.serif, "text-3xl", editorialTone.night.numeral)}>{p.n}</span>
                <span className={editorialType.caption}>Pillar</span>
              </div>
              <h3 className={cn(editorialType.serif, "text-xl md:text-2xl leading-tight mb-3")}>{p.title}</h3>
              <p className="opacity-80 leading-relaxed">{p.body}</p>
            </article>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection tone="paper" id="paracosm-connection">
        <EditorialChapterHeader
          numeral="04"
          kicker="The Paracosm connection"
          subtitle="Part of a living universe."
          tone="paper"
        />
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Calm Magic Board",
              to: "/calm-magic-demo",
              body: "The 8×8 transformation engine that powers journeys through the same landscape Wuxia navigates.",
            },
            {
              title: "Drift Sessions",
              to: "/drift",
              body: "Deep exploration practices that mirror Wuxia's journey through shadow and higher self.",
            },
            {
              title: "Agentic UX",
              to: "/agentic-ux",
              body: "The ethical AI frameworks that inform Wuxia's role as consent guardian in organizational contexts.",
            },
          ].map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group border-t-2 border-current/70 pt-5 flex flex-col hover:opacity-70 transition-opacity"
            >
              <h3 className={cn(editorialType.serif, "text-2xl leading-tight mb-3")}>{c.title}</h3>
              <p className="opacity-80 flex-1">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold">
                Read <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          ))}
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default WuxiaTheFox;
