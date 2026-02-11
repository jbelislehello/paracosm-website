import { Book, Sparkles, Film, ArrowRight, Award, Cpu, Theater, Music, Compass, Heart, Users, Mic, Mountain, Calendar, Lightbulb, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const haLabsBranches = [
  {
    title: "Performance Arts",
    icon: Theater,
    items: ["Satori & Kensho"],
  },
  {
    title: "Innovation Framework",
    icon: Compass,
    items: [
      { label: "Calm Magic: The Board", to: "/calm-magic-board" },
      "Calm Magic: The Book",
    ],
  },
  {
    title: "Interactive Storytelling",
    icon: Book,
    items: [
      { label: "Wuxia the Fox", to: "/wuxia", featured: true },
      "Tout ce qui arrive et advient sous la lune",
      "One Mercury Year",
      "Le cosmographe et l'ordre des marchands",
      "The Manifold",
    ],
  },
  {
    title: "AI & IOT Software",
    icon: Cpu,
    items: [
      "IoTheatre",
      { label: "Tonalli (Voice & Spatial Computer)", to: "/tonalli" },
    ],
  },
  {
    title: "Client Projects",
    icon: Code,
    items: [
      { label: "Case Studies", to: "/case-studies" },
    ],
  },
];

const paracosmBranches = [
  { label: "Relational Intelligence", icon: Heart },
  { label: "Learning Organizations", icon: Lightbulb },
  { label: "Retreats", icon: Mountain },
  {
    label: "Events",
    icon: Calendar,
    children: [
      { label: "Gl!tch Session", to: "/glitch-methodology" },
      { label: "Drift Podcast", to: "/drift" },
      "Paracosm Retreat",
    ],
  },
];

const ParacosmUniverseSection = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-amber-50/40 dark:from-slate-900 dark:via-indigo-950/20 dark:to-amber-950/10 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <Badge variant="outline" className="mb-4 border-indigo-500 text-indigo-700 dark:text-indigo-400">
            <Sparkles className="w-3 h-3 mr-1" />
            The Ecosystem
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-amber-600 bg-clip-text text-transparent mb-4">
            HA Labs + Paracosm
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A creative technology studio and a coaching practice — two entities weaving together innovation, storytelling, and human transformation.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* HA Labs */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-indigo-200 dark:border-indigo-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">HA</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">HA Labs</h3>
                <p className="text-xs text-muted-foreground">Creative Technology Studio</p>
              </div>
            </div>

            <div className="space-y-5">
              {haLabsBranches.map((branch) => (
                <div key={branch.title}>
                  <div className="flex items-center gap-2 mb-2">
                    <branch.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <h4 className="font-semibold text-sm text-foreground">{branch.title}</h4>
                  </div>
                  {branch.items.length > 0 && (
                    <ul className="ml-6 space-y-1">
                      {branch.items.map((item) => {
                        if (typeof item === "string") {
                          return (
                            <li key={item} className="text-sm text-muted-foreground">
                              {item}
                            </li>
                          );
                        }
                        return (
                          <li key={item.label}>
                            <Link
                              to={item.to}
                              className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                            >
                              {item.label}
                              {(item as any).featured && (
                                <Badge className="ml-1 bg-amber-600 text-white text-[10px] px-1.5 py-0">
                                  <Award className="w-2.5 h-2.5 mr-0.5" />
                                  CALQ
                                </Badge>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Paracosm */}
          <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-rose-200 dark:border-rose-800 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Paracosm</h3>
                <p className="text-xs text-muted-foreground">Agentic UX & Coaching</p>
              </div>
            </div>

            <div className="space-y-5">
              {paracosmBranches.map((branch) => (
                <div key={branch.label}>
                  <div className="flex items-center gap-2 mb-2">
                    <branch.icon className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                    <h4 className="font-semibold text-sm text-foreground">{branch.label}</h4>
                  </div>
                  {branch.children && (
                    <ul className="ml-6 space-y-1">
                      {branch.children.map((child) => {
                        if (typeof child === "string") {
                          return (
                            <li key={child} className="text-sm text-muted-foreground">
                              {child}
                            </li>
                          );
                        }
                        return (
                          <li key={child.label}>
                            <Link
                              to={child.to}
                              className="text-sm text-rose-600 dark:text-rose-400 hover:underline"
                            >
                              {child.label}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link to="/calm-magic-assistant">
                <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 text-white">
                  Explore Paracosm Coaching
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Wuxia Featured Announcement — compact */}
        <div className="bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-2xl p-6 md:p-8 border border-amber-300 dark:border-amber-700 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 rounded-xl flex items-center justify-center shadow-xl">
              <span className="text-5xl md:text-6xl">🦊</span>
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                <Badge className="bg-amber-600 text-white">
                  <Film className="w-3 h-3 mr-1" />
                  AI-Enabled Prophetic Movie
                </Badge>
                <Badge variant="outline" className="border-green-500 text-green-700 dark:text-green-400">
                  <Award className="w-3 h-3 mr-1" />
                  CALQ Funded
                </Badge>
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                Wuxia the Fox Returns — 5 New Books
              </h3>
              <p className="text-amber-800 dark:text-amber-200 text-sm mb-4">
                The AI-enabled prophetic movie project is back with five new books funded by the Conseil des arts et des lettres du Québec.
              </p>
              <Link to="/wuxia">
                <Button size="sm" className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white">
                  Explore the Project
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">Stay connected with the HA Labs + Paracosm ecosystem</p>
          <a href="#contact">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-purple-600 hover:to-indigo-600 text-white">
              Join the Journey
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ParacosmUniverseSection;
