import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const stages = [
  {
    id: 'discover',
    label: 'Discover',
    color: 'bg-purple-500',
    lightBg: 'bg-purple-50 dark:bg-purple-950/30',
    activities: ['Browse landing page', 'Take onboarding assessment', 'Read case studies'],
    goals: ['Understand the approach', 'Self-assess readiness', 'Find relevant offering'],
    touchpoints: [
      { label: 'Landing Page', route: '/' },
      { label: 'Onboarding Guide', route: '/' },
      { label: 'Case Studies', route: '/case-studies' },
    ],
    experience: 70,
    kpis: ['Onboarding completion rate', 'Time on page', 'CTA click-through'],
    businessGoal: 'Qualify leads by maturity level',
    responsible: 'Marketing + AI',
    techSystems: ['Website', 'Analytics', 'localStorage'],
  },
  {
    id: 'engage',
    label: 'Engage',
    color: 'bg-blue-500',
    lightBg: 'bg-blue-50 dark:bg-blue-950/30',
    activities: ['Book discovery call', 'Choose Spring tier', 'Complete diagnostic'],
    goals: ['Validate fit', 'Commit to intervention', 'Surface core tension'],
    touchpoints: [
      { label: 'Spring Offer', route: '/calm-magic-assistant#spring-offer' },
      { label: 'Discovery Call', route: 'mailto:jbelisle@helloarchitekt.com?subject=Discovery%20Call' },
      { label: 'Diagnostic Session', route: '/calm-magic-assistant' },
    ],
    experience: 55,
    kpis: ['Booking rate', 'Conversion to paid', 'Diagnostic completion'],
    businessGoal: 'Convert leads to paying clients',
    responsible: 'Coach',
    techSystems: ['Reclaim.ai', 'Email', 'Stripe'],
  },
  {
    id: 'build',
    label: 'Build',
    color: 'bg-teal-500',
    lightBg: 'bg-teal-50 dark:bg-teal-950/30',
    activities: ['Capture POLEN signals', 'Co-create PRD', 'Design agent behaviors'],
    goals: ['Map organizational intelligence', 'Create living requirements', 'Define AI strategy'],
    touchpoints: [
      { label: 'Calm Magic Board', route: '/calm-magic-board' },
      { label: 'POLEN Capture', route: '/calm-magic-board' },
      { label: 'PRD Generation', route: '/calm-magic-board' },
    ],
    experience: 80,
    kpis: ['POLEN entries created', 'PRD completeness', 'Board engagement'],
    businessGoal: 'Deliver tangible strategic artifacts',
    responsible: 'Coach + Client',
    techSystems: ['Calm Magic Board', 'Supabase', 'AI APIs'],
  },
  {
    id: 'observe',
    label: 'Observe',
    color: 'bg-amber-500',
    lightBg: 'bg-amber-50 dark:bg-amber-950/30',
    activities: ['Monitor Observatory tiers', 'Track task execution', 'Review de-risking actions'],
    goals: ['Validate alignment', 'Measure progress', 'Adjust strategy'],
    touchpoints: [
      { label: 'AI Observatory', route: '/calm-magic-board' },
      { label: 'Task Tracking', route: '/calm-magic-board' },
      { label: 'Service Blueprint', route: '/calm-magic-board' },
    ],
    experience: 75,
    kpis: ['Observatory score', 'Task completion rate', 'Risk reduction'],
    businessGoal: 'Demonstrate measurable value',
    responsible: 'Coach + Observatory',
    techSystems: ['Observatory', 'Analytics', 'Notifications'],
  },
  {
    id: 'evolve',
    label: 'Evolve',
    color: 'bg-emerald-500',
    lightBg: 'bg-emerald-50 dark:bg-emerald-950/30',
    activities: ['Journal drift patterns', 'Explore pattern encyclopedia', 'Design learning loops'],
    goals: ['Self-sustaining practice', 'Pattern recognition', 'Continuous evolution'],
    touchpoints: [
      { label: 'Drift Journal', route: '/drift' },
      { label: 'Pattern Encyclopedia', route: '/pattern-encyclopedia' },
      { label: 'Learning Loops', route: '/calm-magic-board' },
    ],
    experience: 90,
    kpis: ['Retention rate', 'Referrals generated', 'Pattern maturity'],
    businessGoal: 'Create advocates & long-term clients',
    responsible: 'Client (self-directed)',
    techSystems: ['Drift Journal', 'Knowledge Base', 'Community'],
  },
];

const rowLabels = [
  'Customer Activities',
  'Customer Goals',
  'Touchpoints',
  'Experience',
  'Business Goal',
  'KPIs',
  'Responsible',
  'Technology',
];

const JourneyMapTable = () => {
  const experiencePoints = stages.map((s, i) => ({
    x: (i / (stages.length - 1)) * 100,
    y: 100 - s.experience,
  }));

  const pathD = experiencePoints
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  const areaD = `${pathD} L 100 100 L 0 100 Z`;

  return (
    <div className="overflow-x-auto -mx-4 px-4">
      <div className="min-w-[900px]">
        {/* Header Row */}
        <div className="grid grid-cols-[140px_repeat(5,1fr)] gap-px bg-border rounded-t-xl overflow-hidden">
          <div className="bg-card p-3 font-bold text-sm text-muted-foreground">Stage</div>
          {stages.map((s) => (
            <div key={s.id} className={`${s.lightBg} p-3 text-center`}>
              <div className={`inline-block w-3 h-3 rounded-full ${s.color} mb-1`} />
              <p className="font-bold text-sm">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {rowLabels.map((label, rowIdx) => (
          <div key={label} className="grid grid-cols-[140px_repeat(5,1fr)] gap-px bg-border">
            <div className="bg-card p-3 text-xs font-semibold text-muted-foreground flex items-start">{label}</div>
            {rowIdx === 3 ? (
              /* Experience Curve Row */
              <div className="col-span-5 bg-card p-4">
                <svg viewBox="0 0 100 100" className="w-full h-20" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="expGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>
                  <path d={areaD} fill="url(#expGrad)" />
                  <path d={pathD} fill="none" stroke="hsl(var(--primary))" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                  {experiencePoints.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="3" fill="hsl(var(--primary))" vectorEffect="non-scaling-stroke" />
                  ))}
                </svg>
                <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                  {stages.map((s) => (
                    <span key={s.id}>{s.experience}%</span>
                  ))}
                </div>
              </div>
            ) : (
              stages.map((stage) => {
                let content: React.ReactNode;
                switch (rowIdx) {
                  case 0: content = stage.activities.map((a, i) => <li key={i} className="text-xs text-muted-foreground">• {a}</li>); break;
                  case 1: content = stage.goals.map((g, i) => <li key={i} className="text-xs text-muted-foreground">• {g}</li>); break;
                  case 2: content = stage.touchpoints.map((tp, i) => (
                    <Link key={i} to={tp.route.startsWith('mailto') ? '#' : tp.route}
                      onClick={(e) => { if (tp.route.startsWith('mailto')) { e.preventDefault(); window.location.href = tp.route; } }}
                      className="block text-xs text-primary hover:underline">
                      {tp.label}
                    </Link>
                  )); break;
                  case 4: content = <p className="text-xs text-muted-foreground">{stage.businessGoal}</p>; break;
                  case 5: content = stage.kpis.map((k, i) => <li key={i} className="text-xs text-muted-foreground">• {k}</li>); break;
                  case 6: content = <Badge variant="outline" className="text-xs">{stage.responsible}</Badge>; break;
                  case 7: content = <p className="text-xs text-muted-foreground">{stage.techSystems.join(', ')}</p>; break;
                  default: content = null;
                }
                return (
                  <div key={stage.id} className={`bg-card p-3 ${stage.lightBg}`}>
                    <ul className="space-y-0.5">{content}</ul>
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyMapTable;
