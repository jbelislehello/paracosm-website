import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpiralTimeline from '@/components/SpiralTimeline';

const AboutUs = () => {
  const timelineEvents = [
    {
      year: '1997-2003',
      title: 'Les Origines Numériques',
      description: 'Cofondateur d\'Inconet et StratSite, architecte de solutions web au Québec',
      caseStudy: null,
      color: '#3b82f6',
      importance: 3
    },
    {
      year: '2004-2010',
      title: 'Transformation des Agences',
      description: 'Stratège UX chez Sid Lee, VDL2, Loft8, BlueSponge et Phéromone',
      caseStudy: null,
      color: '#6366f1',
      importance: 4
    },
    {
      year: '2010-2015',
      title: 'Hello, Architekt! & Wuxia',
      description: 'Studio de narration prospective et livre interactif primé',
      caseStudy: { id: 'wuxia-the-fox', title: 'Wuxia the Fox' },
      color: '#7c3aed',
      importance: 5
    },
    {
      year: '2012-2017',
      title: 'Enseignement & Communauté',
      description: 'INIS, UXMTL, Emergence Lab au Banff Centre',
      caseStudy: { id: 'banff-residence', title: 'Banff Emergence Lab' },
      color: '#8b5cf6',
      importance: 4
    },
    {
      year: '2014-2016',
      title: 'Innovation Muséale',
      description: 'Installations interactives et projets d\'art public',
      caseStudy: { id: 'simulateur-genial', title: 'Simulateur Génial!' },
      color: '#a855f7',
      importance: 4
    },
    {
      year: '2017-2019',
      title: 'Ensemble Ensemble',
      description: 'Art public critique et The Compassion Machine',
      caseStudy: { id: 'machine-bienveillance', title: 'La Machine à bienveillance' },
      color: '#c084fc',
      importance: 5
    },
    {
      year: '2019-2021',
      title: 'DesignOps & Narration Spéculative',
      description: 'Behaviour Interactive et The Greenhouse @ Deloitte',
      caseStudy: null,
      color: '#d8b4fe',
      importance: 3
    },
    {
      year: '2021-2024',
      title: 'IA Éthique',
      description: 'Head of Design chez Prodago, gouvernance de l\'IA',
      caseStudy: { id: 'oaciq-elise', title: 'Élise - Assistant virtuel OACIQ' },
      color: '#fbbf24',
      importance: 5
    },
    {
      year: '2024-Present',
      title: 'Paracosm & Calm Magic',
      description: 'Laboratoire vivant et école de leadership somatique',
      caseStudy: { id: 'codemagic-methodology', title: 'CodeMagic Methodology' },
      color: '#f59e0b',
      importance: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Navigation */}
      <header className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
        <div className="container flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold">P</span>
            </div>
            <span className="font-bold text-lg">Paracosm</span>
          </Link>
          <Link to="/">
            <Button variant="outline">Retour à l'accueil</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            À Propos de Nous
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Jonathan Bélisle & la Spirale de Paracosm
          </p>
        </div>
      </section>

      {/* Main Story */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6">
              Depuis plus de 25 ans, Jonathan Bélisle explore les lisières entre narration, design d'expérience et technologie vivante. 
              Son parcours commence en 1997, dans les marges du cinéma expérimental et de l'Internet naissant. Très tôt, il cofonde 
              Inconet et StratSite, où il devient l'un des premiers architectes de solutions web au Québec. À cette époque, il comprend 
              que chaque système, même numérique, est un récit en puissance.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              De 2004 à 2010, il agit en stratège UX et architecte d'information pour des agences comme Sid Lee, VDL2, Loft8, 
              BlueSponge et Phéromone. Il y implante des pratiques centrées sur l'humain, le sens, et la profondeur de l'expérience. 
              Ce sont des années de transformation culturelle des agences elles-mêmes, où il agit en tant que « conteur organisationnel ».
            </p>

            <p className="text-lg leading-relaxed mb-6">
              En parallèle, il fonde Hello, Architekt!, un studio dédié à la narration prospective, à l'accompagnement des mutations 
              créatives et à la pédagogie par le design. Il y accompagne villes, musées, écoles et entreprises à reconfigurer leur 
              identité à travers des récits incarnés. C'est à cette époque qu'il imagine le projet Wuxia le renard : une série de 
              livres interactifs qui fusionnent poésie, voix, et technologie. Le projet sera primé, traduit en plusieurs langues, 
              et déployé dans plus de 1 500 écoles.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              De 2012 à 2017, Jonathan enseigne le design d'interaction à l'INIS, cofonde la communauté UXMTL, dirige l'Emergence 
              Lab au Banff Centre et collabore avec le Musée canadien des droits de la personne. Il devient une figure mentorale 
              dans les écosystèmes créatifs franco-canadiens.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              En 2017, il cofonde Ensemble Ensemble, un collectif d'art public et critique technologique. Ils créent notamment 
              The Compassion Machine, une installation provocante qui prédit vos futurs gestes de bonté. Entre 2019 et 2021, 
              il devient DesignOps Director chez Behaviour Interactive, puis consultant en narration spéculative chez The Greenhouse 
              @ Deloitte, où il guide dirigeants et stratèges dans la cartographie des futurs.
            </p>

            <p className="text-lg leading-relaxed mb-6">
              Depuis 2021, il agit comme Head of Design chez Prodago, où il façonne des systèmes de gouvernance de l'intelligence 
              artificielle éthiques et sensibles à l'expérience humaine.
            </p>

            <p className="text-lg leading-relaxed mb-8">
              Aujourd'hui, il fonde Paracosm — un laboratoire vivant où convergent narration spéculative, coaching somatique, 
              ontologies poétiques, agents IA et retraite de prototypage. C'est aussi là que naît Calm Magic, une école de 
              leadership basé sur le corps, le souffle et le sens.
            </p>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800 mb-12">
              <p className="text-xl font-medium text-center italic">
                Paracosm est une spirale. Une carte intérieure et collective pour traverser l'incertitude avec grâce.<br/>
                Ce n'est pas un site. C'est un champ d'intelligence vivante. Tu es invité à entrer.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 3D Timeline */}
      <section className="py-16 px-4 bg-white dark:bg-slate-800/50">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Parcours & Réalisations</h2>
            <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Explorez le voyage de Jonathan à travers une spirale interactive de projets et d'innovations. 
              Chaque point représente une étape clé dans l'évolution de sa pratique.
            </p>
          </div>
          
          <SpiralTimeline events={timelineEvents} />
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Explorer Ensemble?</h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Que vous soyez un professionnel en quête de développement stratégique ou une organisation 
            poursuivant l'innovation, nous sommes là pour combler l'écart entre vision et réalité.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#contact">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
                Consultation Professionnelle
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link to="/calm-magic-assistant">
              <Button className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
                Accompagnement Calm Magic
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
