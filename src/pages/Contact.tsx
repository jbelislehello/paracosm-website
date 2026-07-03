import { useState } from "react";
import { Zap, Compass, Settings } from "lucide-react";
import Footer from "@/components/Footer";
import { usePageSeo } from "@/hooks/usePageSeo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  EditorialPageHero,
  EditorialSection,
  EditorialChapterHeader,
  EditorialSiteHeader,
  EditorialPullQuote,
  EditorialCTA,
  editorialTone,
  editorialType,
} from "@/components/editorial";
import { cn } from "@/lib/utils";

const SESSIONS = [
  {
    name: "Gl!tch",
    icon: Zap,
    duration: "45–60 min",
    purpose: "Initial discovery & deep exploration",
    bestFor:
      "First contact, strategic consultation, exploring what feels 'off' or alive in your organization.",
  },
  {
    name: "Drift",
    icon: Compass,
    duration: "30 min",
    purpose: "Relational exploration & flexible discovery",
    bestFor:
      "Ongoing transformation work, relational coaching, brainstorming possibilities.",
  },
  {
    name: "Tune",
    icon: Settings,
    duration: "15–20 min",
    purpose: "Focused action & tactical check-ins",
    bestFor:
      "Quick implementation questions, specific deliverable review, workshop scheduling.",
  },
];

const BOOKING_URL = "https://app.reclaim.ai/m/jonathan-helloarchitekt";
const CONTACT_EMAIL = "jbelisle@helloarchitekt.com";

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const paperTone = editorialTone.paper;
  const nightTone = editorialTone.night;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const name = fd.get("name") as string;
    const email = fd.get("email") as string;
    const focus = fd.get("focus") as string;
    const message = fd.get("message") as string;
    const subject = encodeURIComponent(`Contact — ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nFocus: ${focus}\n\n${message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    toast({
      title: "Opening email client",
      description: `If nothing opens, write directly to ${CONTACT_EMAIL}.`,
    });
    (e.target as HTMLFormElement).reset();
    setSending(false);
  };

  usePageSeo({
    title: "Contact — Paracosm",
    description:
      "Meet Jonathan Belisle and book a Gl!tch, Drift, or Tune session with Paracosm. Relational intelligence, agentic UX, organizational transformation.",
    path: "/contact",
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <EditorialSiteHeader />

      <main>
        <EditorialPageHero
          tone="warm"
          numeral="00"
          kicker="Contact · Open a session"
          title={
            <>
              Start a <em className="italic font-light">conversation</em> with Paracosm.
            </>
          }
          subtitle="Three doors in: Gl!tch for deep discovery, Drift for relational exploration, Tune for focused action. Pick one, or write and we'll route you."
        />

        {/* Chapter 01 — About Jonathan Belisle */}
        <EditorialSection tone="paper">
          <EditorialChapterHeader
            numeral="01"
            kicker="About · Jonathan Belisle"
            subtitle="Guide, architect, and companion for organizations learning to think together."
            tone="paper"
          />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
            <div className="md:col-span-4">
              <p className={editorialType.kicker}>Practitioner</p>
              <p className={cn(editorialType.serif, "italic text-2xl mt-3 leading-snug")}>
                Twenty years designing living systems at the edge of story,
                technology, and consciousness.
              </p>
              <div className="mt-6 text-sm opacity-80 space-y-2">
                <p>Founder — Paracosm & HA Labs</p>
                <p>Based in Montréal · working worldwide</p>
                <p>Languages — English · Français</p>
              </div>
            </div>

            <div className="md:col-span-8 space-y-5 text-base md:text-lg leading-relaxed">
              <p>
                Jonathan Belisle is a transmedia designer and organizational
                architect. His practice sits at the intersection of relational
                intelligence, agentic UX, and the design of preferable futures.
                He works with founders, executives, and teams who suspect that
                the machine they are running is no longer the one they want to
                inhabit.
              </p>
              <p>
                He is the author of the Calm Magic methodology, the GL!TCH →
                DRIFT → TUNE breath cycle, and the Paracosm operating system —
                a body of work that treats the conversation itself as the
                ontology, and language as the first interface.
              </p>
              <p>
                His clients range from independent operators to research labs,
                cultural institutions, and Fortune 500 leadership teams. Every
                engagement begins with the same question:{" "}
                <em className="italic">
                  what is trying to emerge here that no one has yet named?
                </em>
              </p>
            </div>
          </div>

          <div className="mt-16">
            <EditorialPullQuote tone="paper">
              The conversation is the ontology. The room is the interface.
              Everything else is just plumbing.
            </EditorialPullQuote>
          </div>
        </EditorialSection>

        {/* Chapter 02 — Get in touch */}
        <EditorialSection tone="night" id="contact">
          <EditorialChapterHeader
            numeral="02"
            kicker="Get in touch"
            subtitle="Pick a door. Everything routes to a single inbox."
            tone="night"
          />

          {/* Session doors */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {SESSIONS.map((s, i) => (
              <a
                key={s.name}
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group block p-8 border transition-colors",
                  nightTone.calloutBox,
                  "hover:bg-white/10",
                )}
              >
                <div className="flex items-baseline justify-between mb-6">
                  <span
                    className={cn(
                      editorialType.serif,
                      "text-5xl leading-none",
                      nightTone.numeral,
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <s.icon className="w-5 h-5 opacity-70" />
                </div>
                <p className={editorialType.kicker}>Session · {s.duration}</p>
                <h3
                  className={cn(
                    editorialType.serif,
                    "italic text-3xl mt-2 mb-3",
                  )}
                >
                  {s.name}
                </h3>
                <p className="text-sm opacity-80 mb-4">{s.purpose}</p>
                <p className="text-xs opacity-60 leading-relaxed border-t border-white/15 pt-4">
                  {s.bestFor}
                </p>
                <p
                  className={cn(
                    editorialType.cta,
                    "mt-6 inline-flex items-center gap-2",
                    nightTone.kicker,
                  )}
                >
                  Book →
                </p>
              </a>
            ))}
          </div>

          {/* Form + Direct */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <form
              onSubmit={handleSubmit}
              className={cn(
                "lg:col-span-7 p-8 md:p-10 border",
                nightTone.calloutBox,
              )}
            >
              <p className={editorialType.kicker}>Send a note</p>
              <h3
                className={cn(
                  editorialType.serif,
                  "italic text-3xl md:text-4xl mt-2 mb-8",
                )}
              >
                Write and we'll route you.
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    htmlFor="name"
                    className={cn(editorialType.caption, "block mb-2")}
                  >
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    required
                    className="bg-transparent border-white/25 text-current placeholder:text-current/40"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className={cn(editorialType.caption, "block mb-2")}
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="bg-transparent border-white/25 text-current placeholder:text-current/40"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="focus"
                  className={cn(editorialType.caption, "block mb-2")}
                >
                  Focus
                </label>
                <select
                  id="focus"
                  name="focus"
                  required
                  defaultValue=""
                  className="w-full px-3 py-2 bg-transparent border border-white/25 rounded-md text-current text-sm"
                >
                  <option value="" disabled className="bg-[hsl(230_35%_10%)]">
                    Select a focus area
                  </option>
                  {[
                    "AI leadership & strategic implementation",
                    "Team coaching & culture transformation",
                    "Executive development & leadership",
                    "Organizational transformation",
                    "Innovation frameworks & methodologies",
                    "Something else",
                  ].map((o) => (
                    <option key={o} value={o} className="bg-[hsl(230_35%_10%)]">
                      {o}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label
                  htmlFor="message"
                  className={cn(editorialType.caption, "block mb-2")}
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  placeholder="What is trying to emerge?"
                  className="bg-transparent border-white/25 text-current placeholder:text-current/40"
                />
              </div>

              <EditorialCTA
                tone="night"
                variant="primary"
                href="#"
                onClick={() => {
                  /* form submit handles it */
                }}
              >
                {sending ? "Sending…" : "Send message"}
              </EditorialCTA>
            </form>

            <aside className="lg:col-span-5 space-y-10">
              <div>
                <p className={editorialType.kicker}>Direct</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className={cn(
                    editorialType.serif,
                    "italic text-2xl md:text-3xl mt-2 block hover:opacity-80 break-all",
                  )}
                >
                  {CONTACT_EMAIL}
                </a>
                <p className="text-sm opacity-70 mt-3">
                  Every message reaches Jonathan directly. Typical response
                  window is 24 hours on weekdays.
                </p>
              </div>

              <div className="border-t border-white/15 pt-8">
                <p className={editorialType.kicker}>Discovery call</p>
                <p
                  className={cn(
                    editorialType.serif,
                    "italic text-2xl mt-2 mb-3",
                  )}
                >
                  30 minutes, no pitch.
                </p>
                <p className="text-sm opacity-70 mb-5">
                  A first conversation to sense the shape of your question and
                  whether Paracosm is the right room for it.
                </p>
                <EditorialCTA
                  tone="night"
                  variant="ghost"
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book discovery
                </EditorialCTA>
              </div>

              <div className="border-t border-white/15 pt-8 text-xs uppercase tracking-[0.3em] opacity-60 space-y-2">
                <p>Montréal · Worldwide</p>
                <p>EN · FR</p>
              </div>
            </aside>
          </div>
        </EditorialSection>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
