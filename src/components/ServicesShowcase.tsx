import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Brain, Mountain, Cpu, Compass, UserCog, Wrench, Mic, GraduationCap,
  Bot, Shield, BookOpen, Search, BarChart3, Palette, Briefcase, FileCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ServiceItem {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
}

const services: ServiceItem[] = [
  { icon: Compass, title: "Ontological Maps", description: "Navigate complexity through structured meaning-making frameworks that reveal hidden patterns in your organization.", color: "from-blue-500 to-indigo-500" },
  { icon: Mountain, title: "Poetry Retreats", description: "Immersive experiences where creative expression meets strategic clarity — reconnect with purpose through poiesis.", color: "from-rose-500 to-pink-500" },
  { icon: Cpu, title: "AI Residencies", description: "Embedded AI transformation programs that build internal capability while delivering immediate results.", color: "from-purple-500 to-violet-500" },
  { icon: Brain, title: "Expansive Leadership", description: "Develop the somatic and relational intelligence needed to lead through uncertainty and rapid change.", color: "from-amber-500 to-orange-500" },
  { icon: UserCog, title: "Chief AI Officer on Demand", description: "Fractional CAIO services — strategic AI governance, roadmapping, and team alignment without full-time overhead.", color: "from-teal-500 to-cyan-500" },
  { icon: Wrench, title: "Prototypes to Think", description: "Rapid prototyping as a thinking tool — build to learn, iterate to understand, ship to discover.", color: "from-green-500 to-emerald-500" },
  { icon: Mic, title: "Keynotes & Speaking", description: "Provocative talks on AI futures, learning organizations, and the poetics of innovation at global stages.", color: "from-fuchsia-500 to-pink-500" },
];

const aiAssistants: ServiceItem[] = [
  { icon: Briefcase, title: "Personal Consigliere", description: "Your always-on strategic advisor that synthesizes context across all your projects and priorities.", color: "from-blue-500 to-indigo-500" },
  { icon: Bot, title: "Executive AI", description: "C-suite intelligence layer — board prep, decision frameworks, and stakeholder communication.", color: "from-purple-500 to-violet-500" },
  { icon: FileCheck, title: "Documentation AI", description: "Living documentation that evolves with your organization — never stale, always contextual.", color: "from-teal-500 to-cyan-500" },
  { icon: GraduationCap, title: "Learning AI", description: "Personalized learning pathways that adapt to your team's pace and knowledge gaps.", color: "from-amber-500 to-orange-500" },
  { icon: Shield, title: "Risk AI", description: "Proactive risk identification across technical, operational, and relational dimensions.", color: "from-red-500 to-rose-500" },
  { icon: BarChart3, title: "Data Quality AI", description: "Continuous data health monitoring with automated anomaly detection and remediation suggestions.", color: "from-green-500 to-emerald-500" },
  { icon: Search, title: "Research AI", description: "Deep research synthesis — connects academic insights with practical application for your context.", color: "from-indigo-500 to-blue-500" },
  { icon: Palette, title: "Experience Design AI", description: "UX intelligence that bridges user needs with business outcomes through empathetic design thinking.", color: "from-fuchsia-500 to-pink-500" },
];

const ServiceCard: React.FC<ServiceItem> = ({ icon: Icon, title, description, color }) => (
  <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm rounded-2xl p-5 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3`}>
      <Icon className="w-5 h-5 text-white" />
    </div>
    <h3 className="font-bold text-sm mb-1 text-slate-900 dark:text-white">{title}</h3>
    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{description}</p>
  </div>
);

const ServicesShowcase: React.FC = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            What We Do
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Connecting ideas and helping humans feel the future — through services, tools, and AI assistants designed for expansive organizations.
          </p>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="services" className="text-xs sm:text-sm">Services</TabsTrigger>
            <TabsTrigger value="assistants" className="text-xs sm:text-sm">AI Assistants We Build</TabsTrigger>
          </TabsList>

          <TabsContent value="services">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {services.map((s) => <ServiceCard key={s.title} {...s} />)}
            </div>
          </TabsContent>

          <TabsContent value="assistants">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {aiAssistants.map((a) => <ServiceCard key={a.title} {...a} />)}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <a href="#contact">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
              Let's Talk About Your Needs
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesShowcase;
