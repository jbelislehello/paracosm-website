import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Compass, Sparkles, Users, Clock, Video, Calendar, BookOpen, Eye, Layers, Target, Repeat, Zap, Mail, ArrowRight } from 'lucide-react';

const CoachingServices: React.FC = () => {
  const phases = [
    { icon: Eye, label: "Entry", desc: "I see something you don't", step: "30-45 min diagnostic" },
    { icon: Layers, label: "Deconstruction", desc: "Facts, assumptions, emotions, systems", step: "AI-augmented analysis" },
    { icon: Target, label: "Rebuild", desc: "1-3 decisions, clear path", step: "Reframed narrative" },
    { icon: Repeat, label: "Execution Loop", desc: "Accountability & adjustment", step: "7-14 days of support" },
  ];

  const springOffers = [
    {
      name: "Clarity Reset",
      duration: "7 days",
      price: "$800",
      description: "From confusion to a clear, executable decision.",
      features: [
        "45-min diagnostic call",
        "Situation deconstruction (facts / assumptions / emotions / systems)",
        "1-3 clear decisions delivered",
        "Async support + 1 follow-up call",
      ],
      color: "from-rose-500 to-orange-500",
      subject: "Spring 2026 — Clarity Reset",
    },
    {
      name: "Decision Sprint",
      duration: "14 days",
      price: "$1,500",
      description: "AI-augmented pattern analysis with full accountability.",
      features: [
        "Everything in Clarity Reset",
        "AI-augmented pattern analysis & scenario generation",
        "2 additional coaching calls",
        "Execution accountability loop",
      ],
      color: "from-purple-500 to-indigo-500",
      popular: true,
      subject: "Spring 2026 — Decision Sprint",
    },
    {
      name: "Strategic Intervention",
      duration: "30 days",
      price: "$2,800",
      description: "Full Calm Magic Board access with Living PRD prototype.",
      features: [
        "Everything in Decision Sprint",
        "Full Calm Magic Board access",
        "Living PRD prototype",
        "Ongoing async + 4 calls",
        "Narrative reframing & strategic alignment",
      ],
      color: "from-blue-500 to-cyan-500",
      subject: "Spring 2026 — Strategic Intervention",
    },
  ];

  const coachingPackages = [
    {
      title: "Inner Life Exploration",
      subtitle: "6-Week Individual Coaching",
      description: "Deep dive into your emotional patterns using the Calm Magic framework to uncover your authentic self and relationship dynamics.",
      icon: Heart,
      color: "from-rose-500 to-pink-600",
      features: [
        "Weekly 90-minute 1:1 sessions",
        "Calm Magic quadrant assessment",
        "Personal freedom compass tracking",
        "Journaling exercises & prompts",
        "Email support between sessions"
      ],
      price: "$1,200",
      duration: "6 weeks"
    },
    {
      title: "Creative Relationship Design",
      subtitle: "8-Week Transformation Program",
      description: "Design innovative and playful relationships using creative expression and the Calm Magic forces to build deeper connections.",
      icon: Sparkles,
      color: "from-purple-500 to-indigo-600",
      features: [
        "Bi-weekly 2-hour creative sessions",
        "Relationship pattern mapping",
        "Creative expression exercises",
        "Freedom arrow progression tracking",
        "Custom relationship rituals design"
      ],
      price: "$1,800",
      duration: "8 weeks"
    },
    {
      title: "Calm Magic Intensive",
      subtitle: "3-Month Deep Transformation",
      description: "Comprehensive coaching journey through all four forces with ongoing support for lasting change in your inner life and relationships.",
      icon: Compass,
      color: "from-blue-500 to-cyan-600",
      features: [
        "12 weekly coaching sessions",
        "Monthly progress assessments",
        "Access to group practice sessions",
        "Personalized meditation practices",
        "Ongoing email & text support"
      ],
      price: "$3,200",
      duration: "12 weeks",
      popular: true
    }
  ];

  const coachingFeatures = [
    { icon: Video, title: "Virtual Sessions", description: "Connect from anywhere with secure video coaching sessions" },
    { icon: BookOpen, title: "Calm Magic Journaling", description: "Structured journaling using the four forces framework" },
    { icon: Calendar, title: "Flexible Scheduling", description: "Sessions that fit your schedule and time zone" },
    { icon: Users, title: "Community Access", description: "Connect with other Calm Magic practitioners" }
  ];

  return (
    <div className="space-y-16">
      {/* ── Spring 2026 Offer ── */}
      <div>
        <div className="text-center mb-10">
          <Badge className="bg-gradient-to-r from-rose-600 to-purple-600 text-white mb-4">
            Limited to 5 slots per month
          </Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-3">
            Spring 2026 — From Idea to Software
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-2">
            I help people make the decisions they're avoiding when things get complex.
          </p>
          <p className="text-2xl font-semibold italic text-foreground">
            "When you're stuck, I cut through it fast."
          </p>
        </div>

        {/* 4-Phase Method */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-4xl mx-auto">
          {phases.map((phase, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-rose-600 to-purple-600 flex items-center justify-center">
                <phase.icon className="w-7 h-7 text-white" />
              </div>
              <h4 className="font-bold text-sm">{phase.label}</h4>
              <p className="text-xs text-muted-foreground">{phase.desc}</p>
              <p className="text-[11px] font-medium text-purple-600">{phase.step}</p>
              {i < phases.length - 1 && (
                <ArrowRight className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Core Engine */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 text-sm font-semibold">
          {["Clarity", "Decision", "Alignment", "Action"].map((step, i) => (
            <React.Fragment key={step}>
              <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground">{step}</span>
              {i < 3 && <ArrowRight className="w-4 h-4 text-muted-foreground" />}
            </React.Fragment>
          ))}
        </div>

        {/* 3 Offer Tiers */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {springOffers.map((offer, index) => (
            <Card key={index} className={`relative ${offer.popular ? 'ring-2 ring-purple-600' : ''}`}>
              {offer.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
                  Recommended
                </Badge>
              )}
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${offer.color} flex items-center justify-center mb-4`}>
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{offer.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{offer.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{offer.price}</span>
                  <span className="text-muted-foreground">/ {offer.duration}</span>
                </div>
                <ul className="space-y-3">
                  {offer.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href={`mailto:jbelisle@helloarchitekt.com?subject=${encodeURIComponent(offer.subject)}&body=${encodeURIComponent("Hi Jonathan,\n\nI'm interested in the " + offer.name + " offer.\n\n")}`}>
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Get Started
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Spring Offer FAQ ── */}
      <div className="max-w-3xl mx-auto space-y-4">
        <h3 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h3>
        {[
          {
            q: "How does the process start?",
            a: "It starts with a diagnostic call where I map where you're stuck, what decision you're avoiding, and what's emotionally blocking you. You leave with one sharp insight before we even begin the formal engagement.",
          },
          {
            q: "What's the difference between the three tiers?",
            a: "Clarity Reset (7 days) is a focused sprint for one specific decision. Decision Sprint (14 days) adds AI-augmented pattern analysis and an accountability loop. Strategic Intervention is an ongoing monthly retainer with full Board access, PRD prototyping, and weekly calls.",
          },
          {
            q: "Do I need to know anything about AI?",
            a: "No. The AI-augmented layer works behind the scenes — I use it as a pattern recognition and scenario generation tool. You interact with me, not with tools.",
          },
          {
            q: "What kind of outcomes can I expect?",
            a: "You'll walk away with 1-3 clear, executable decisions, a reframed narrative of your situation, and (for Sprint and Intervention tiers) an accountability structure to prevent drift.",
          },
          {
            q: "Can I upgrade mid-engagement?",
            a: "Yes. If a Clarity Reset reveals deeper complexity, we can upgrade to a Decision Sprint or Strategic Intervention. The initial investment applies toward the upgrade.",
          },
          {
            q: "How do I pay?",
            a: "Payment is upfront via e-transfer, credit card, or invoice. For enterprise engagements, custom billing arrangements are available.",
          },
        ].map((faq, i) => (
          <details key={i} className="group border rounded-lg">
            <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-sm hover:bg-accent/50 transition-colors">
              {faq.q}
              <ArrowRight className="w-4 h-4 text-muted-foreground transition-transform group-open:rotate-90" />
            </summary>
            <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
          </details>
        ))}
      </div>

      {/* ── Social Proof ── */}
      <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
        <h3 className="text-xl font-bold text-center mb-8">What Clients Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Jonathan helped me see the structural pattern I'd been blind to for months. One session completely reframed how I approached my product strategy.",
              name: "Marie-Ève L.",
              role: "Product Director, SaaS startup",
            },
            {
              quote: "I came in overwhelmed by competing priorities. I left with three clear decisions and the confidence to execute. The AI-augmented analysis was unlike anything I've experienced.",
              name: "Sébastien D.",
              role: "Founder & CEO",
            },
            {
              quote: "What sets Jonathan apart is his ability to hold both the emotional and strategic layers simultaneously. He doesn't just coach — he architects clarity.",
              name: "Annika R.",
              role: "VP of Innovation",
            },
          ].map((t, i) => (
            <div key={i} className="space-y-4">
              <p className="text-sm italic text-muted-foreground leading-relaxed">"{t.quote}"</p>
              <div>
                <p className="font-semibold text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Deep Transformation Programs ── */}
      <div>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Deep Transformation Programs</h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Personalized coaching journeys using the Calm Magic framework to explore your inner life 
            and develop innovative, creative relationships that bring you freedom and joy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {coachingPackages.map((pkg, index) => (
            <Card key={index} className={`relative ${pkg.popular ? 'ring-2 ring-purple-600' : ''}`}>
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${pkg.color} flex items-center justify-center mb-4`}>
                  <pkg.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">{pkg.title}</CardTitle>
                <p className="text-purple-600 font-medium">{pkg.subtitle}</p>
                <p className="text-sm text-muted-foreground">{pkg.description}</p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold">{pkg.price}</span>
                  <span className="text-muted-foreground">/ {pkg.duration}</span>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <div className="w-2 h-2 rounded-full bg-purple-600 mt-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a href="https://app.reclaim.ai/m/jonathan-helloarchitekt" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-purple-600 hover:to-rose-600">
                    Book Discovery Call
                  </Button>
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Coaching Features */}
      <div className="bg-muted/50 rounded-xl p-8">
        <h3 className="text-2xl font-bold text-center mb-8">Why Choose Calm Magic Coaching?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coachingFeatures.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-3">
                <feature.icon className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoachingServices;
