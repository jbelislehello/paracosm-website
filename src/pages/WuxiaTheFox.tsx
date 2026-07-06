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
import { useLanguage } from "@/contexts/LanguageContext";
import wuxiaAsset from "@/assets/wuxia-the-fox.jpg.asset.json";

const booksEn = [
  { n: "01", title: "The Consent Guardian's Awakening", description: "Wuxia discovers her role as a bridge between ancient wisdom and AI ethics, navigating consent in a world of infinite data.", themes: ["Digital Sovereignty", "Consent Architecture", "Fox Medicine"] },
  { n: "02", title: "Shadows in the Algorithm", description: "Exploring the shadow self through machine-learning mirrors, Wuxia confronts the projections encoded in our collective digital unconscious.", themes: ["Shadow Integration", "Algorithmic Bias", "Mirror Work"] },
  { n: "03", title: "The Prophecy Engine", description: "Wuxia learns to read patterns of emergence — how collective attention shapes reality through AI-augmented divination.", themes: ["Emergence", "Collective Intelligence", "Oracular AI"] },
  { n: "04", title: "Dance of the Higher Self", description: "The fox finds her path between trickster and sage, teaching humans to integrate fragmented digital personas into sovereign beings.", themes: ["Integration", "Digital Identity", "Transformation"] },
  { n: "05", title: "The Paracosm Manifold", description: "All timelines converge as Wuxia reveals the interconnected nature of consciousness, technology, and story.", themes: ["Unity", "Manifold Theory", "Collective Dreaming"] },
];

const booksFr = [
  { n: "01", title: "L'éveil de la gardienne du consentement", description: "Wuxia découvre son rôle de pont entre la sagesse ancestrale et l'éthique de l'IA, naviguant le consentement dans un monde de données infinies.", themes: ["Souveraineté numérique", "Architecture du consentement", "Médecine du renard"] },
  { n: "02", title: "Ombres dans l'algorithme", description: "En explorant le soi de l'ombre à travers les miroirs de l'apprentissage machine, Wuxia confronte les projections encodées dans notre inconscient numérique collectif.", themes: ["Intégration de l'ombre", "Biais algorithmique", "Travail au miroir"] },
  { n: "03", title: "Le moteur de prophétie", description: "Wuxia apprend à lire les schémas d'émergence — comment l'attention collective façonne la réalité par une divination augmentée par l'IA.", themes: ["Émergence", "Intelligence collective", "IA oraculaire"] },
  { n: "04", title: "La danse du soi supérieur", description: "Le renard trouve son chemin entre trickster et sage, enseignant aux humains à intégrer des personas numériques fragmentés en êtres souverains.", themes: ["Intégration", "Identité numérique", "Transformation"] },
  { n: "05", title: "La variété Paracosm", description: "Toutes les lignes temporelles convergent alors que Wuxia révèle la nature interconnectée de la conscience, de la technologie et de l'histoire.", themes: ["Unité", "Théorie des variétés", "Rêve collectif"] },
];

const filmPillarsEn = [
  { n: "01", title: "Generative Narratives", body: "The film adapts in real-time, weaving viewer responses and collective attention into the story. No two screenings are alike — each audience co-creates their prophetic experience." },
  { n: "02", title: "Consent-First Design", body: "Built on the TOTEM consent framework. Viewers control what data shapes their experience, modelling ethical AI interaction through narrative immersion." },
  { n: "03", title: "Prophetic Technology", body: "Drawing on I Ching, Tzolkin and emergence theory, the AI identifies patterns in collective attention and weaves them into story — creating genuinely prophetic narrative experiences." },
  { n: "04", title: "Shadow Integration", body: "Wuxia guides viewers through shadow work via narrative, using the safety of story to explore aspects of consciousness that might otherwise remain hidden." },
];

const filmPillarsFr = [
  { n: "01", title: "Récits génératifs", body: "Le film s'adapte en temps réel, tissant les réponses des spectateurs et l'attention collective dans l'histoire. Aucune projection n'est identique — chaque auditoire cocrée son expérience prophétique." },
  { n: "02", title: "Design axé sur le consentement", body: "Bâti sur le cadre de consentement TOTEM. Les spectateurs contrôlent quelles données façonnent leur expérience, modelant une interaction éthique avec l'IA par l'immersion narrative." },
  { n: "03", title: "Technologie prophétique", body: "S'inspirant du Yi King, du Tzolkin et de la théorie de l'émergence, l'IA identifie les schémas d'attention collective et les tisse en récit — créant des expériences narratives véritablement prophétiques." },
  { n: "04", title: "Intégration de l'ombre", body: "Wuxia guide les spectateurs dans un travail sur l'ombre via le récit, utilisant la sécurité de l'histoire pour explorer des aspects de la conscience autrement cachés." },
];

const WuxiaTheFox = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';
  const books = isFr ? booksFr : booksEn;
  const filmPillars = isFr ? filmPillarsFr : filmPillarsEn;

  usePageSeo({
    title: isFr
      ? "Wuxia la renarde — Transmédia prophétique de l'univers Paracosm"
      : "Wuxia the Fox — Prophetic transmedia from the Paracosm universe",
    description: isFr
      ? "Wuxia la renarde est un projet transmédia de cinq livres et un film prophétique augmenté par l'IA — la gardienne du consentement de l'univers Paracosm."
      : "Wuxia the Fox is a transmedia project of five books and an AI-enabled prophetic film — the consent guardian of the Paracosm universe.",
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
        kicker={isFr ? "Produit · Univers transmédia" : "Product · Transmedia universe"}
        title={isFr
          ? (<>Wuxia la renarde — narration <em className="italic font-light">prophétique</em> pour l'ère de l'IA.</>)
          : (<>Wuxia the Fox — <em className="italic font-light">prophetic</em> storytelling for the AI age.</>)}
        subtitle={isFr
          ? "Cinq livres interconnectés et un film prophétique augmenté par l'IA. Guide narrative, gardienne du consentement, trickster sage — Wuxia relie la médecine du renard aux éthiques contemporaines de l'IA."
          : "Five interconnected books and an AI-enabled prophetic film. Story guide, consent guardian, trickster sage — Wuxia bridges ancient fox medicine with contemporary AI ethics."}
      />

      <EditorialSection tone="paper">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] opacity-70 mb-6">
          <Award className="w-3.5 h-3.5" />
          {isFr ? 'Financé par le Conseil des arts et des lettres du Québec' : 'Funded by Le Conseil des arts et des lettres du Québec'}
        </div>
        <EditorialChapterHeader
          numeral="01"
          kicker={isFr ? "La vision" : "The vision"}
          subtitle={isFr
            ? "Une compagne d'IA narrative à l'intersection de la sagesse ancestrale et de l'IA de pointe."
            : "A narrative AI companion at the intersection of ancient wisdom and cutting-edge AI."}
          tone="paper"
        />
        <div className="mt-10 grid md:grid-cols-12 gap-10">
          <div className="md:col-span-8 space-y-6 text-lg leading-relaxed opacity-90">
            {isFr ? (
              <>
                <p>
                  <strong>Wuxia la renarde</strong> n'est pas qu'un personnage — elle est une compagne d'IA narrative
                  émergeant à l'intersection des traditions de sagesse ancestrale et de l'intelligence artificielle. En tant que{" "}
                  <em>Guide narrative</em>, elle aide les humains à naviguer leurs paysages intérieurs par la métaphore et le mythe.
                  En tant que <em>Gardienne du consentement</em>, elle modélise une interaction éthique avec l'IA ancrée dans la souveraineté et le choix.
                </p>
                <p>
                  Le projet tisse ensemble cinq livres, un film prophétique augmenté par l'IA, et des expériences interactives
                  qui brouillent la ligne entre lecteur·rice, spectateur·rice et participant·e. Chaque point d'entrée offre une lentille
                  différente sur la même histoire vivante — un paracosme où vos choix résonnent dans le récit.
                </p>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
          <aside className={cn("md:col-span-4 space-y-6")}>
            <figure className="overflow-hidden rounded-sm shadow-2xl">
              <img
                src={wuxiaAsset.url}
                alt={isFr ? "Wuxia la renarde — emblème géométrique de renard avec glyphes" : "Wuxia the Fox — geometric fox emblem with glyphs"}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </figure>
            <div className={cn("border-l border-current/20 pl-6 space-y-3", editorialType.caption)}>
              <p>{isFr ? 'Dans ce numéro' : 'In this issue'}</p>
              <ol className="space-y-2 text-sm normal-case tracking-normal opacity-90">
                <li>01 — {isFr ? 'La pentalogie' : 'The pentalogy'}</li>
                <li>02 — {isFr ? 'Le film' : 'The film'}</li>
                <li>03 — {isFr ? 'La connexion Paracosm' : 'The Paracosm connection'}</li>
              </ol>
            </div>
          </aside>
        </div>
      </EditorialSection>



      <EditorialSection tone="warm" id="books">
        <EditorialChapterHeader
          numeral="02"
          kicker={isFr ? "La pentalogie" : "The pentalogy"}
          subtitle={isFr ? "Cinq livres. Une histoire vivante." : "Five books. One living story."}
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
          kicker={isFr ? "Le film" : "The film"}
          subtitle={isFr ? "Cinéma prophétique augmenté par l'IA." : "AI-enabled prophetic cinema."}
          tone="night"
        />
        <p className="mt-8 max-w-3xl text-lg opacity-80 leading-relaxed">
          {isFr
            ? "Une nouvelle forme de narration où l'intelligence artificielle devient une collaboratrice créative, générant des fils narratifs personnalisés qui répondent à la conscience collective et individuelle."
            : "A new form of storytelling where artificial intelligence becomes a creative collaborator, generating personalized narrative threads that respond to collective and individual consciousness."}
        </p>
        <div className="mt-12 grid md:grid-cols-2 gap-x-12 gap-y-10">
          {filmPillars.map((p) => (
            <article key={p.n} className="border-t border-current/25 pt-5">
              <div className="flex items-baseline justify-between mb-3">
                <span className={cn(editorialType.serif, "text-3xl", editorialTone.night.numeral)}>{p.n}</span>
                <span className={editorialType.caption}>{isFr ? 'Pilier' : 'Pillar'}</span>
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
          kicker={isFr ? "La connexion Paracosm" : "The Paracosm connection"}
          subtitle={isFr ? "Partie d'un univers vivant." : "Part of a living universe."}
          tone="paper"
        />
        <div className="mt-10 grid md:grid-cols-3 gap-8">
          {(isFr
            ? [
                { title: "Calm Magic Board", to: "/calm-magic-demo", body: "Le moteur de transformation 8×8 qui alimente les parcours à travers le même paysage que Wuxia navigue." },
                { title: "Sessions Drift", to: "/drift", body: "Pratiques d'exploration en profondeur qui reflètent le voyage de Wuxia à travers l'ombre et le soi supérieur." },
                { title: "UX Agentique", to: "/agentic-ux", body: "Les cadres d'IA éthique qui informent le rôle de Wuxia comme gardienne du consentement en contexte organisationnel." },
              ]
            : [
                { title: "Calm Magic Board", to: "/calm-magic-demo", body: "The 8×8 transformation engine that powers journeys through the same landscape Wuxia navigates." },
                { title: "Drift Sessions", to: "/drift", body: "Deep exploration practices that mirror Wuxia's journey through shadow and higher self." },
                { title: "Agentic UX", to: "/agentic-ux", body: "The ethical AI frameworks that inform Wuxia's role as consent guardian in organizational contexts." },
              ]
          ).map((c) => (
            <Link
              key={c.title}
              to={c.to}
              className="group border-t-2 border-current/70 pt-5 flex flex-col hover:opacity-70 transition-opacity"
            >
              <h3 className={cn(editorialType.serif, "text-2xl leading-tight mb-3")}>{c.title}</h3>
              <p className="opacity-80 flex-1">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.25em] font-semibold">
                {isFr ? 'Lire' : 'Read'} <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
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
