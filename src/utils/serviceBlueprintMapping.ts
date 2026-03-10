
export type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';
export type Tier = 'magic' | 'calm' | 'free';
export type RiskLevel = 'high' | 'medium' | 'low';

interface PrdData {
  [key: string]: string | null | undefined;
}

interface BlueprintCell {
  season: Season;
  tier: Tier;
  label: string;
  readiness: number; // 0-100
  risk: RiskLevel;
  action: string;
  fields: { key: string; label: string; filled: boolean }[];
}

export interface BlueprintMatrix {
  cells: BlueprintCell[];
  overallReadiness: number;
}

interface CrossDependency {
  from: { season: Season; tier: Tier };
  to: { season: Season; tier: Tier };
  label: string;
  color: string;
}

// Which PRD fields map to which tier per season
const SEASON_TIER_MAP: Record<Season, Record<Tier, { label: string; fields: { key: string; label: string }[]; action: string }>> = {
  POLLENS: {
    magic: {
      label: 'Vision Alignment',
      fields: [
        { key: 'pollens_aspirations', label: 'Aspirations' },
        { key: 'pollens_stakes', label: 'Stakes' },
      ],
      action: 'Clarify strategic vision before scoping AI capabilities',
    },
    calm: {
      label: 'Trust Baseline',
      fields: [
        { key: 'pollens_relational_patterns', label: 'Relational Patterns' },
        { key: 'pollens_cultural_elements', label: 'Cultural Elements' },
      ],
      action: 'Map trust signals and cultural readiness for adoption',
    },
    free: {
      label: 'Data Pipeline Readiness',
      fields: [
        { key: 'pollens_constraints', label: 'Constraints' },
        { key: 'pollens_team_dynamics', label: 'Team Dynamics' },
      ],
      action: 'Audit data availability and team capacity for infrastructure',
    },
  },
  NOEMS: {
    magic: {
      label: 'AI Literacy Gaps',
      fields: [
        { key: 'noems_mental_models', label: 'Mental Models' },
        { key: 'noems_shared_ideas', label: 'Shared Ideas' },
      ],
      action: 'Assess AI literacy gaps before designing learning paths',
    },
    calm: {
      label: 'Mental Model Fit',
      fields: [
        { key: 'noems_concepts', label: 'Concepts' },
        { key: 'noems_intuitions', label: 'Intuitions' },
      ],
      action: 'Validate conceptual models match user mental models',
    },
    free: {
      label: 'Model Evaluation Needs',
      fields: [
        { key: 'noems_concepts', label: 'Concepts' },
        { key: 'noems_mental_models', label: 'Mental Models' },
      ],
      action: 'Define evaluation criteria from conceptual frameworks',
    },
  },
  POEMS: {
    magic: {
      label: 'Capability Readiness',
      fields: [
        { key: 'poems_systems', label: 'Systems' },
        { key: 'poems_prototypes', label: 'Prototypes' },
      ],
      action: 'Ensure capability readiness before prototyping begins',
    },
    calm: {
      label: 'UX/IXD Patterns',
      fields: [
        { key: 'poems_people', label: 'People' },
        { key: 'poems_environments', label: 'Environments' },
        { key: 'poems_messages', label: 'Messages' },
      ],
      action: 'Design interaction patterns that reduce cognitive load',
    },
    free: {
      label: 'Deployment Architecture',
      fields: [
        { key: 'poems_objects', label: 'Objects' },
        { key: 'poems_systems', label: 'Systems' },
        { key: 'poems_prototypes', label: 'Prototypes' },
      ],
      action: 'Architect deployment from prototype specifications',
    },
  },
  TOTEMS: {
    magic: {
      label: 'Governance Principles',
      fields: [
        { key: 'totems_security_policies', label: 'Security Policies' },
        { key: 'totems_access_controls', label: 'Access Controls' },
      ],
      action: 'Establish governance principles before scaling access',
    },
    calm: {
      label: 'Explainability Needs',
      fields: [
        { key: 'totems_data_architecture', label: 'Data Architecture' },
        { key: 'totems_system_requirements', label: 'System Requirements' },
      ],
      action: 'Build explainability into system design from the start',
    },
    free: {
      label: 'Monitoring & Drift',
      fields: [
        { key: 'totems_integration_points', label: 'Integration Points' },
        { key: 'totems_technical_debt', label: 'Technical Debt' },
      ],
      action: 'Set up monitoring and drift detection at integration points',
    },
  },
  ANTHEMS: {
    magic: {
      label: 'Org Alignment Score',
      fields: [
        { key: 'anthems_market_positioning', label: 'Market Positioning' },
        { key: 'anthems_brand_narrative', label: 'Brand Narrative' },
      ],
      action: 'Align organizational narrative with market positioning',
    },
    calm: {
      label: 'Adoption Metrics',
      fields: [
        { key: 'anthems_audience_segments', label: 'Audience Segments' },
        { key: 'anthems_success_signals', label: 'Success Signals' },
      ],
      action: 'Define adoption metrics tied to audience segments',
    },
    free: {
      label: 'Release & Uptime',
      fields: [
        { key: 'anthems_go_to_market', label: 'Go-to-Market' },
        { key: 'anthems_storytelling_assets', label: 'Storytelling Assets' },
      ],
      action: 'Plan release cadence and uptime SLAs for go-to-market',
    },
  },
};

const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];
const TIERS: Tier[] = ['magic', 'calm', 'free'];

function hasContent(value: string | null | undefined): boolean {
  return Boolean(value?.trim() && value.trim().length > 0);
}

function computeRisk(readiness: number): RiskLevel {
  if (readiness >= 75) return 'low';
  if (readiness >= 40) return 'medium';
  return 'high';
}

export function getPrdObservatoryMapping(prdData: PrdData | null): BlueprintMatrix {
  if (!prdData) {
    const cells: BlueprintCell[] = SEASONS.flatMap(season =>
      TIERS.map(tier => {
        const mapping = SEASON_TIER_MAP[season][tier];
        return {
          season,
          tier,
          label: mapping.label,
          readiness: 0,
          risk: 'high' as RiskLevel,
          action: mapping.action,
          fields: mapping.fields.map(f => ({ ...f, filled: false })),
        };
      })
    );
    return { cells, overallReadiness: 0 };
  }

  const cells: BlueprintCell[] = SEASONS.flatMap(season =>
    TIERS.map(tier => {
      const mapping = SEASON_TIER_MAP[season][tier];
      const fields = mapping.fields.map(f => ({
        ...f,
        filled: hasContent(prdData[f.key] as string | null | undefined),
      }));
      const filledCount = fields.filter(f => f.filled).length;
      const readiness = fields.length > 0 ? Math.round((filledCount / fields.length) * 100) : 0;

      return {
        season,
        tier,
        label: mapping.label,
        readiness,
        risk: computeRisk(readiness),
        action: mapping.action,
        fields,
      };
    })
  );

  const overallReadiness = cells.length > 0
    ? Math.round(cells.reduce((sum, c) => sum + c.readiness, 0) / cells.length)
    : 0;

  return { cells, overallReadiness };
}

export function getSeasonTierReadiness(prdData: PrdData | null, season: Season): Record<Tier, number> {
  const result: Record<Tier, number> = { magic: 0, calm: 0, free: 0 };
  if (!prdData) return result;

  for (const tier of TIERS) {
    const fields = SEASON_TIER_MAP[season][tier].fields;
    const filled = fields.filter(f => hasContent(prdData[f.key] as string | null | undefined)).length;
    result[tier] = fields.length > 0 ? Math.round((filled / fields.length) * 100) : 0;
  }
  return result;
}

export function getCrossLayerDependencies(): CrossDependency[] {
  return [
    {
      from: { season: 'TOTEMS', tier: 'free' },
      to: { season: 'POEMS', tier: 'calm' },
      label: 'Infrastructure reliability → UX trust',
      color: 'from-slate-400 to-teal-400',
    },
    {
      from: { season: 'POLLENS', tier: 'magic' },
      to: { season: 'POEMS', tier: 'calm' },
      label: 'Strategic vision → Experience design',
      color: 'from-purple-400 to-teal-400',
    },
    {
      from: { season: 'NOEMS', tier: 'magic' },
      to: { season: 'ANTHEMS', tier: 'calm' },
      label: 'AI literacy → Adoption metrics',
      color: 'from-purple-400 to-emerald-400',
    },
    {
      from: { season: 'POEMS', tier: 'free' },
      to: { season: 'TOTEMS', tier: 'free' },
      label: 'Deployment arch → Monitoring setup',
      color: 'from-blue-400 to-slate-400',
    },
  ];
}

export function getDeRiskingActions(season: Season, tier: Tier, readiness: number): string {
  const mapping = SEASON_TIER_MAP[season][tier];
  if (readiness >= 75) return `✅ ${mapping.label} ready — proceed with confidence`;
  if (readiness >= 40) return `⚠️ ${mapping.action}`;
  return `🚨 Critical: ${mapping.action}`;
}

export { SEASONS, TIERS, SEASON_TIER_MAP };
