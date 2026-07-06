import { Mic, Eye, ExternalLink, Lightbulb, Box, Palette, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import FoxRunningSketch from "@/components/tonalli/FoxRunningSketch";
import {
  EditorialSiteHeader,
  EditorialPageHero,
  EditorialSection,
  EditorialCTA,
} from "@/components/editorial";
import { editorialType, editorialTone } from "@/components/editorial/editorialTokens";
import { cn } from "@/lib/utils";
import { usePageSeo } from "@/hooks/usePageSeo";
import { productSchema } from "@/lib/structuredData";
import { useLanguage } from "@/contexts/LanguageContext";

const Tonalli = () => {
  const { language } = useLanguage();
  const isFr = language === 'fr';

  usePageSeo({
    title: isFr
      ? "Tonalli — Un OS créatif avec les branches Voix et Spatiale | Paracosm"
      : "Tonalli — A Creative OS with Voice and Spatial branches | Paracosm",
    description: isFr
      ? "Tonalli est le système d'exploitation créatif de Paracosm — informatique vocale et interfaces spatiales pour des expériences relationnelles conscientes du consentement."
      : "Tonalli is Paracosm's Creative Operating System — voice computing and spatial interfaces for relational, consent-aware experiences.",
    path: "/tonalli",
    jsonLd: [
      productSchema({
        name: "Tonalli",
        description:
          "Paracosm's Creative Operating System — voice computing and spatial interfaces for relational, consent-aware experiences.",
        url: "/tonalli",
        category: "Creative Operating System",
      }),
    ],
  });

  const warm = editorialTone.warm;
  const clay = editorialTone.clay;
  const paper = editorialTone.paper;
  const night = editorialTone.night;

  return (
    <main className="bg-background text-foreground">
      <EditorialSiteHeader />

      <EditorialPageHero
        tone="warm"
        numeral="10"
        kicker={isFr ? "Partie II · Branche R&D de Paracosm" : "Part II · R&D branch of Paracosm"}
        title={isFr
          ? (<><em className="italic font-light">Tonalli</em> — l'expression devient l'interface.</>)
          : (<><em className="italic font-light">Tonalli</em> — expression becomes the interface.</>)}
        subtitle={isFr
          ? "La voix et la présence deviennent le contrôleur pour l'apprentissage, l'idéation et la narration générative."
          : "Voice and presence become the controller for learning, ideation, and generative storytelling."}
        actions={
          <a
            href="https://medium.com/noemtoys"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(editorialType.cta, "inline-flex items-center gap-2 border-b border-current pb-1")}
          >
            <Lightbulb className="w-3.5 h-3.5" /> {isFr ? 'Lire les notes de terrain' : 'Read the field notes'} <ExternalLink className="w-3 h-3 opacity-60" />
          </a>
        }
      />


      {/* Wuxia sketch */}
      <EditorialSection tone="warm">
        <div className="max-w-4xl mx-auto">
          <FoxRunningSketch />
          <p className={cn(editorialType.caption, "text-center mt-4 opacity-70")}>
            {isFr
              ? "Wuxia court dans les champs — une esquisse p5.js vivante. La voix et la présence deviennent le contrôleur."
              : "Wuxia runs the fields — a live p5.js sketch. Voice and presence become the controller."}
          </p>
        </div>
      </EditorialSection>

      {/* Two branches */}
      <EditorialSection tone="paper" id="branches">
        <div className="flex items-baseline gap-6 mb-10">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", paper.numeral)}>01</span>
          <p className={cn(editorialType.kicker, paper.kicker)}>{isFr ? 'Deux branches' : 'Two branches'}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-12")}>
          {isFr
            ? (<>Un seul <em className="italic font-light">système d'exploitation</em>, deux surfaces.</>)
            : (<>One <em className="italic font-light">operating system</em>, two surfaces.</>)}
        </h2>

        <div className="grid md:grid-cols-2 gap-8">
          <article className="border-t-2 border-current/70 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Mic className="w-6 h-6" />
              <h3 className={cn(editorialType.serif, "text-2xl")}>Tonalli Voice</h3>
            </div>
            <p className={cn(editorialType.caption, "opacity-70 mb-4")}>{isFr ? 'Médium interactif axé sur l\'audio' : 'Audio-first interactive medium'}</p>
            <p className="opacity-85 leading-relaxed mb-5">
              {isFr
                ? "Les gens lisent à voix haute, prononcent des invites ou récitent de la poésie — le système répond par des paysages sonores, des scènes et des variations génératives. Voix = agentivité."
                : "People read aloud, speak prompts, or recite poetry — the system responds with soundscapes, scenes, and generative variations. Voice = agency."}
            </p>
            <ul className="space-y-1.5 text-sm opacity-80">
              {(isFr
                ? ["Brainstorming et idéation", "Écriture / prototypage de récit", "Ateliers et créativité de groupe", "Apprendre en parlant (présence + rappel)"]
                : ["Brainstorming & ideation", "Writing / story prototyping", "Workshops & group creativity", "Learning-by-speaking (presence + recall)"]
              ).map((u) => (
                <li key={u}>— {u}</li>
              ))}
            </ul>
          </article>

          <article className="border-t-2 border-current/70 pt-6">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6" />
              <h3 className={cn(editorialType.serif, "text-2xl")}>Tonalli Spatial</h3>
            </div>
            <p className={cn(editorialType.caption, "opacity-70 mb-4")}>{isFr ? 'Vision par caméra + lampe de projection' : 'Camera-vision + projection lamp'}</p>
            <p className="opacity-85 leading-relaxed mb-5">
              {isFr
                ? "Un dispositif physique qui voit l'espace et y reprojette. Le mouvement et la présence deviennent des entrées pour des récits et des installations interactives."
                : "A physical device that sees the space and projects back into it. Movement and presence become inputs for interactive stories and installations."}
            </p>
            <ul className="space-y-1.5 text-sm opacity-80">
              {(isFr
                ? ["Récit interactif dans une pièce", "Environnements d'apprentissage ludiques", "Installations muséales et scolaires", "Scènes « à parcourir » — explorer par le mouvement"]
                : ["Interactive storytelling in a room", "Playful learning environments", "Museum & school installations", '"Walkable" scenes — explore by moving']
              ).map((u) => (
                <li key={u}>— {u}</li>
              ))}
            </ul>
          </article>
        </div>
      </EditorialSection>

      {/* In the wild — field pieces */}
      <EditorialSection tone="warm" id="in-the-wild">
        <div className="flex items-baseline gap-6 mb-10">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", warm.numeral)}>02</span>
          <p className={cn(editorialType.kicker, warm.kicker)}>{isFr ? 'Sur le terrain' : 'In the wild'}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-6")}>
          <em className="italic font-light">La Naissance du Monde</em> — {isFr ? 'la voix comme contrôleur.' : 'voice as controller.'}
        </h2>
        <p className="opacity-80 max-w-2xl leading-relaxed mb-10">
          {isFr
            ? (<>Une pièce fondatrice de Tonalli Voice, coproduite pour <em>Les Divertisseurs</em> de Loto-Québec avec les artistes de spoken word Queen Ka &amp; Ivy. Récitation, souffle et intonation donnent naissance à un monde visuel et sonore en temps réel.</>)
            : (<>A founding field piece of Tonalli Voice, co-produced for Loto-Québec's <em>Les Divertisseurs</em> with spoken-word artists Queen Ka &amp; Ivy. Recitation, breath and intonation give birth to a visual and sonic world in real time.</>)}
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <figure className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-sm bg-black">
              <iframe
                src="https://player.vimeo.com/video/148532449"
                title="La Naissance du Monde — captation Vimeo"
                className="w-full h-full"
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            </div>
            <figcaption className={cn(editorialType.caption, "opacity-70 flex items-center gap-2")}>
              {isFr ? 'Captation Vimeo · ' : 'Captation Vimeo · '}
              <a href="https://vimeo.com/148532449" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-current pb-0.5">
                {isFr ? 'ouvrir' : 'open'} <ExternalLink className="w-3 h-3" />
              </a>
            </figcaption>
          </figure>

          <figure className="space-y-3">
            <div className="aspect-video overflow-hidden rounded-sm bg-black">
              <iframe
                src="https://www.youtube-nocookie.com/embed/bNR2VXOer6A"
                title="Queen Ka & Ivy — La Naissance du Monde"
                className="w-full h-full"
                loading="lazy"
                allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
                allowFullScreen
              />
            </div>
            <figcaption className={cn(editorialType.caption, "opacity-70 flex items-center gap-2")}>
              Queen Ka &amp; Ivy · YouTube ·{" "}
              <a href="https://labibleurbaine.com/litterature/queen-ka-et-ivy-se-pretent-au-jeu-la-naissance-du-monde-de-lesdivertisseurs-de-loto-quebec/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 border-b border-current pb-0.5">
                {isFr ? 'lire La Bible Urbaine' : 'read La Bible Urbaine'} <ExternalLink className="w-3 h-3" />
              </a>
            </figcaption>
          </figure>
        </div>

        <div className="mt-8">
          <Link
            to="/case-studies"
            className={cn(editorialType.cta, "inline-flex items-center gap-2 border-b border-current pb-1")}
          >
            {isFr ? 'Lire l\'étude de cas complète' : 'Read the full case study'} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </EditorialSection>

      {/* Educational design platforms */}
      <EditorialSection tone="clay" id="platforms">
        <div className="flex items-baseline gap-6 mb-10">
          <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", clay.numeral)}>03</span>
          <p className={cn(editorialType.kicker, clay.kicker)}>{isFr ? 'Plateformes de design éducatif' : 'Educational design platforms'}</p>
        </div>
        <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-3xl mb-12")}>
          {isFr
            ? (<>Où la recherche devient <em className="italic font-light">pratique</em>.</>)
            : (<>Where research becomes <em className="italic font-light">practice</em>.</>)}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {(isFr
            ? [
                { icon: Lightbulb, title: "Salles sensorielles", body: "Expériences spatiales immersives pour l'apprentissage sensoriel.", href: "https://medium.com/noemtoys/tagged/sensory-rooms" },
                { icon: Box, title: "Jouets cognitifs", body: "Jouets d'informatique tangible pour la cognition incarnée.", href: "https://medium.com/noemtoys/tagged/tangible-play" },
                { icon: Palette, title: "Expressivité", body: "Wearables et interaction incarnée pour l'expression créative.", href: "https://medium.com/noemtoys/tagged/embodied-cognition" },
              ]
            : [
                { icon: Lightbulb, title: "Sensory Rooms", body: "Immersive spatial experiences for sensory learning.", href: "https://medium.com/noemtoys/tagged/sensory-rooms" },
                { icon: Box, title: "Cognitive Toys", body: "Tangible computing toys for embodied cognition.", href: "https://medium.com/noemtoys/tagged/tangible-play" },
                { icon: Palette, title: "Expressivity", body: "Wearables and embodied interaction for creative expression.", href: "https://medium.com/noemtoys/tagged/embodied-cognition" },
              ]
          ).map(({ icon: Icon, title, body, href }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group border-t-2 border-current/70 pt-6 hover:opacity-80 transition-opacity"
            >
              <Icon className="w-6 h-6 mb-4" />
              <h3 className={cn(editorialType.serif, "text-xl mb-2")}>{title}</h3>
              <p className="text-sm opacity-80 mb-4 leading-relaxed">{body}</p>
              <span className={cn(editorialType.caption, "inline-flex items-center gap-1.5")}>
                {isFr ? 'Lire plus' : 'Read more'} <ExternalLink className="w-3 h-3" />
              </span>
            </a>
          ))}
        </div>
      </EditorialSection>

      {/* CTA */}
      <EditorialSection tone="night" id="contact">
        <div className="grid md:grid-cols-12 gap-8 items-end">
          <div className="md:col-span-8">
            <div className="flex items-baseline gap-6 mb-6">
              <span className={cn(editorialType.serif, "text-4xl md:text-5xl leading-none", night.numeral)}>04</span>
              <p className={cn(editorialType.kicker, night.kicker)}>{isFr ? 'Nous contacter' : 'Get in touch'}</p>
            </div>
            <h2 className={cn(editorialType.serif, "text-3xl md:text-5xl leading-tight tracking-tight max-w-2xl")}>
              {isFr
                ? (<>Intéressé·e par <em className="italic font-light">Tonalli</em> ?</>)
                : (<>Interested in <em className="italic font-light">Tonalli</em>?</>)}
            </h2>
            <p className="mt-5 opacity-80 max-w-xl leading-relaxed">
              {isFr
                ? "Que vous soyez éducateur·rice, conservateur·rice de musée ou technologue créatif·ve — explorons ce que les interfaces axées sur l'expression peuvent faire."
                : "Whether you're an educator, museum curator, or creative technologist — let's explore what expression-first interfaces can do."}
            </p>
          </div>
          <div className="md:col-span-4 md:text-right flex flex-col md:items-end gap-3">
            <EditorialCTA
              href="mailto:jbelisle@helloarchitekt.com?subject=Tonalli%20Initiative"
              tone="night"
            >
              {isFr ? 'Commencer une conversation' : 'Begin a conversation'}
            </EditorialCTA>
            <a
              href="https://medium.com/noemtoys"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(editorialType.cta, "inline-flex items-center gap-1.5 opacity-70 hover:opacity-100")}
            >
              {isFr ? 'Lire la recherche' : 'Read research'} <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </EditorialSection>

      <Footer />
    </main>
  );
};

export default Tonalli;
