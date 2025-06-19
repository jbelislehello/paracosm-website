
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Dna, Bot } from 'lucide-react';
import { Link } from "react-router-dom";

const LeadershipRolesSection = () => {
  const residenceLevels = [
    {
      icon: Sprout,
      emoji: "🌱",
      title: "Niveau 1 – Résidence de Leadership Intégral",
      subtitle: "Cultiver la présence exécutive et la vision stratégique",
      description: "Pour les dirigeant·es et équipes de direction en quête d'un alignement profond entre identité, décision et transformation. Cette résidence explore les dynamiques de pouvoir, de clarté et de courage à travers un accompagnement sur mesure.",
      details: [
        "Développer la présence existentielle et l'intelligence émotionnelle nécessaires pour diriger dans l'incertitude",
        "Créer la sécurité psychologique pour l'émergence de l'innovation",
        "Transformer la prise de décision basée sur la peur en vision courageuse",
        "Aligner l'identité personnelle avec la vision organisationnelle"
      ],
      color: "from-green-500 to-emerald-600",
      link: "/agentic-ux"
    },
    {
      icon: Dna,
      emoji: "🧬",
      title: "Niveau 2 – Résidence d'Intelligence Relationnelle et Culturelle",
      subtitle: "Déployer une organisation apprenante et consciente",
      description: "Une immersion dans les systèmes vivants de communication, de rituels collectifs et d'innovation sensible. On y installe les fondations d'une culture collaborative, expressive et durable. L'accent est mis sur la guérison, la symbolisation, et l'activation d'un climat fertile pour l'émergence de nouveaux récits organisationnels.",
      details: [
        "Installer des systèmes de communication vivants et conscients",
        "Créer des rituels collectifs qui nourrissent l'innovation sensible",
        "Développer une culture collaborative et expressive durable",
        "Activer un climat fertile pour l'émergence de nouveaux récits"
      ],
      color: "from-rose-500 to-purple-600",
      link: "/calm-magic-assistant"
    },
    {
      icon: Bot,
      emoji: "🤖",
      title: "Niveau 3 – Résidence Architecturale en IA et Systèmes Augmentés",
      subtitle: "Prototyper, intégrer et gouverner des systèmes intelligents et éthiques",
      description: "Pour les organisations prêtes à explorer l'implémentation concrète de l'intelligence artificielle, avec un focus sur l'alignement ontologique, les assistants cognitifs, les workflows augmentés et la gouvernance adaptative. Ici, l'AI devient un partenaire stratégique, somatique et opérationnel.",
      details: [
        "Implémenter l'intelligence artificielle avec alignement ontologique",
        "Développer des assistants cognitifs et workflows augmentés",
        "Établir une gouvernance adaptative pour les systèmes intelligents",
        "Intégrer l'IA comme partenaire stratégique et opérationnel"
      ],
      color: "from-blue-500 to-purple-600",
      link: "/agentic-ux"
    }
  ];

  return (
    <section id="leadership-roles" className="py-20 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nos Trois Niveaux de Résidence
          </h2>
          <p className="text-slate-600 dark:text-slate-300 max-w-3xl mx-auto text-lg">
            Un accompagnement progressif et intégré qui cultive l'excellence du leadership à travers trois dimensions complémentaires : 
            la présence exécutive, l'intelligence relationnelle, et la maîtrise technologique.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {residenceLevels.map((level, index) => (
            <Link key={index} to={level.link} className="block group">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-xl transition-all duration-300 h-full group-hover:scale-105">
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center mb-4 relative`}>
                    <level.icon className="w-6 h-6 text-white" />
                    <span className="absolute -top-2 -right-2 text-2xl">{level.emoji}</span>
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-2">
                    {level.title}
                  </CardTitle>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {level.subtitle}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
                    {level.description}
                  </p>
                  <ul className="space-y-2">
                    {level.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                        <span className="w-1.5 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-8 border border-blue-200 dark:border-blue-800">
          <h3 className="text-2xl font-bold text-center mb-4">Un Parcours Intégral de Transformation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-700 dark:text-slate-300">
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🌱</span>
                Fondations Personnelles
              </h4>
              <p className="text-sm">Développer la présence et la clarté nécessaires pour diriger avec authenticité et courage.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🧬</span>
                Écosystèmes Relationnels
              </h4>
              <p className="text-sm">Créer des cultures d'apprentissage qui favorisent l'innovation et la collaboration consciente.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <span className="text-lg">🤖</span>
                Systèmes Augmentés
              </h4>
              <p className="text-sm">Intégrer l'intelligence artificielle comme partenaire stratégique pour l'innovation organisationnelle.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadershipRolesSection;
