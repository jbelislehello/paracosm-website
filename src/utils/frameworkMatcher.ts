// Framework Matcher Utility
// Compiles PRD content and provides matching utilities

import { OECD_PRINCIPLES, OECD_DIMENSIONS, type OECDPrinciple } from '@/data/oecdFramework';
import { AI_GOVERNANCE_FRAMEWORKS, type AIGovernanceFramework } from '@/data/aiGovernanceFrameworks';

export interface CompiledPrdContent {
  pollens: {
    aspirations?: string;
    constraints?: string;
    stakes?: string;
    culturalElements?: string;
    relationalPatterns?: string;
    teamDynamics?: string;
  };
  noems: {
    concepts?: string;
    intuitions?: string;
    mentalModels?: string;
    sharedIdeas?: string;
  };
  poems: {
    people?: string;
    objects?: string;
    environments?: string;
    messages?: string;
    systems?: string;
    prototypes?: string;
  };
  totems: {
    dataArchitecture?: string;
    systemRequirements?: string;
    integrationPoints?: string;
    securityPolicies?: string;
    accessControls?: string;
    technicalDebt?: string;
  };
  anthems: {
    brandNarrative?: string;
    audienceSegments?: string;
    marketPositioning?: string;
    goToMarket?: string;
    storytellingAssets?: string;
    successSignals?: string;
  };
  metadata?: {
    title?: string;
    status?: string;
    prototypeStage?: string;
  };
}

export interface PrincipleMatch {
  principleId: string;
  principle: OECDPrinciple;
  score: number; // 0-100
  reasoning: string;
  matchedConcepts: string[];
  suggestedLayers: ('A' | 'B' | 'C')[];
  relatedFrameworks: {
    framework: AIGovernanceFramework;
    relevantPrinciples: string[];
  }[];
}

export interface GapAnalysis {
  principleId: string;
  principle: OECDPrinciple;
  severity: 'low' | 'medium' | 'high';
  recommendation: string;
  suggestedContent: string;
}

export interface FrameworkAlignment {
  framework: AIGovernanceFramework;
  alignment: 'high' | 'medium' | 'low' | 'none';
  score: number;
  relevantArticles: string[];
  matchedPrinciples: string[];
}

export interface OECDAnalysisResult {
  matches: PrincipleMatch[];
  gaps: GapAnalysis[];
  frameworkAlignment: FrameworkAlignment[];
  overallScore: number;
  insights: string[];
  analysisMode: 'quick' | 'ai';
  analyzedAt: string;
}

// Compile PRD data into structured content for analysis
export function compilePrdContent(prdData: Record<string, unknown>): CompiledPrdContent {
  return {
    pollens: {
      aspirations: prdData.pollens_aspirations as string | undefined,
      constraints: prdData.pollens_constraints as string | undefined,
      stakes: prdData.pollens_stakes as string | undefined,
      culturalElements: prdData.pollens_cultural_elements as string | undefined,
      relationalPatterns: prdData.pollens_relational_patterns as string | undefined,
      teamDynamics: prdData.pollens_team_dynamics as string | undefined,
    },
    noems: {
      concepts: prdData.noems_concepts as string | undefined,
      intuitions: prdData.noems_intuitions as string | undefined,
      mentalModels: prdData.noems_mental_models as string | undefined,
      sharedIdeas: prdData.noems_shared_ideas as string | undefined,
    },
    poems: {
      people: prdData.poems_people as string | undefined,
      objects: prdData.poems_objects as string | undefined,
      environments: prdData.poems_environments as string | undefined,
      messages: prdData.poems_messages as string | undefined,
      systems: prdData.poems_systems as string | undefined,
      prototypes: prdData.poems_prototypes as string | undefined,
    },
    totems: {
      dataArchitecture: prdData.totems_data_architecture as string | undefined,
      systemRequirements: prdData.totems_system_requirements as string | undefined,
      integrationPoints: prdData.totems_integration_points as string | undefined,
      securityPolicies: prdData.totems_security_policies as string | undefined,
      accessControls: prdData.totems_access_controls as string | undefined,
      technicalDebt: prdData.totems_technical_debt as string | undefined,
    },
    anthems: {
      brandNarrative: prdData.anthems_brand_narrative as string | undefined,
      audienceSegments: prdData.anthems_audience_segments as string | undefined,
      marketPositioning: prdData.anthems_market_positioning as string | undefined,
      goToMarket: prdData.anthems_go_to_market as string | undefined,
      storytellingAssets: prdData.anthems_storytelling_assets as string | undefined,
      successSignals: prdData.anthems_success_signals as string | undefined,
    },
    metadata: {
      title: prdData.title as string | undefined,
      status: prdData.status as string | undefined,
      prototypeStage: prdData.prototype_stage as string | undefined,
    }
  };
}

// Flatten compiled content into a single text blob for analysis
export function flattenPrdContent(content: CompiledPrdContent): string {
  const sections: string[] = [];
  
  const addSection = (label: string, obj: Record<string, string | undefined>) => {
    const values = Object.entries(obj)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join('\n');
    if (values) {
      sections.push(`## ${label}\n${values}`);
    }
  };
  
  addSection('POLLENS (Context & Signals)', content.pollens);
  addSection('NOEMS (Concepts & Ideas)', content.noems);
  addSection('POEMS (Design Elements)', content.poems);
  addSection('TOTEMS (Technical Architecture)', content.totems);
  addSection('ANTHEMS (Market & Narrative)', content.anthems);
  
  return sections.join('\n\n');
}

// Keyword-based quick matching (no AI)
export function quickMatchPrinciples(content: CompiledPrdContent): OECDAnalysisResult {
  const flatContent = flattenPrdContent(content).toLowerCase();
  const matches: PrincipleMatch[] = [];
  const gaps: GapAnalysis[] = [];
  
  // Keywords for each OECD principle
  const principleKeywords: Record<string, string[]> = {
    'inclusive-growth': ['inclusive', 'growth', 'sustainable', 'development', 'wellbeing', 'benefit', 'society', 'community', 'equity'],
    'human-centered': ['human', 'user', 'people', 'agency', 'autonomy', 'control', 'consent', 'dignity', 'rights', 'centered'],
    'transparency': ['transparent', 'explainable', 'interpretable', 'understandable', 'disclosure', 'clear', 'open', 'documented'],
    'safety': ['safe', 'secure', 'robust', 'reliable', 'risk', 'mitigation', 'protection', 'resilient', 'tested'],
    'accountability': ['accountable', 'responsible', 'oversight', 'governance', 'audit', 'compliance', 'liable', 'traceable'],
    'fairness': ['fair', 'unbiased', 'equitable', 'non-discriminatory', 'just', 'impartial', 'balanced'],
    'security': ['security', 'privacy', 'encryption', 'protected', 'confidential', 'authentication', 'authorization'],
    'innovation': ['innovation', 'research', 'development', 'ecosystem', 'investment', 'advancement', 'progress'],
    'international': ['international', 'global', 'cooperation', 'standards', 'interoperability', 'cross-border'],
    'stewardship': ['stewardship', 'trustworthy', 'ethical', 'responsible', 'sustainable', 'long-term']
  };
  
  OECD_PRINCIPLES.forEach(principle => {
    const keywords = principleKeywords[principle.id] || [];
    const foundKeywords = keywords.filter(kw => flatContent.includes(kw));
    const score = Math.min(100, Math.round((foundKeywords.length / keywords.length) * 100));
    
    const relatedFrameworks = AI_GOVERNANCE_FRAMEWORKS
      .filter(f => f.principles.some(p => p.oecdPrincipleIds.includes(principle.id)))
      .map(f => ({
        framework: f,
        relevantPrinciples: f.principles
          .filter(p => p.oecdPrincipleIds.includes(principle.id))
          .map(p => p.name)
      }));
    
    if (score >= 30) {
      matches.push({
        principleId: principle.id,
        principle,
        score,
        reasoning: `Found ${foundKeywords.length} matching concepts: ${foundKeywords.join(', ')}`,
        matchedConcepts: foundKeywords,
        suggestedLayers: score >= 70 ? ['A', 'B', 'C'] : score >= 50 ? ['B', 'C'] : ['C'],
        relatedFrameworks
      });
    } else {
      gaps.push({
        principleId: principle.id,
        principle,
        severity: score < 10 ? 'high' : score < 20 ? 'medium' : 'low',
        recommendation: `Consider addressing ${principle.name} by incorporating concepts like: ${keywords.slice(0, 3).join(', ')}`,
        suggestedContent: `Add content related to ${principle.name.toLowerCase()} in your PRD layers.`
      });
    }
  });
  
  // Sort matches by score
  matches.sort((a, b) => b.score - a.score);
  
  // Calculate framework alignment
  const frameworkAlignment = calculateFrameworkAlignment(matches);
  
  // Calculate overall score
  const overallScore = matches.length > 0
    ? Math.round(matches.reduce((sum, m) => sum + m.score, 0) / OECD_PRINCIPLES.length)
    : 0;
  
  return {
    matches,
    gaps,
    frameworkAlignment,
    overallScore,
    insights: generateQuickInsights(matches, gaps),
    analysisMode: 'quick',
    analyzedAt: new Date().toISOString()
  };
}

function calculateFrameworkAlignment(matches: PrincipleMatch[]): FrameworkAlignment[] {
  return AI_GOVERNANCE_FRAMEWORKS.map(framework => {
    const relevantMatches = matches.filter(m => 
      framework.principles.some(p => p.oecdPrincipleIds.includes(m.principleId))
    );
    
    const avgScore = relevantMatches.length > 0
      ? relevantMatches.reduce((sum, m) => sum + m.score, 0) / relevantMatches.length
      : 0;
    
    const alignment: FrameworkAlignment['alignment'] = 
      avgScore >= 75 ? 'high' : avgScore >= 50 ? 'medium' : avgScore >= 25 ? 'low' : 'none';
    
    return {
      framework,
      alignment,
      score: Math.round(avgScore),
      relevantArticles: framework.principles
        .filter(p => relevantMatches.some(m => p.oecdPrincipleIds.includes(m.principleId)))
        .map(p => p.name),
      matchedPrinciples: relevantMatches.map(m => m.principle.name)
    };
  });
}

function generateQuickInsights(matches: PrincipleMatch[], gaps: GapAnalysis[]): string[] {
  const insights: string[] = [];
  
  if (matches.length >= 7) {
    insights.push('Strong OECD alignment detected across most principles.');
  } else if (matches.length >= 4) {
    insights.push('Moderate OECD alignment with room for improvement.');
  } else {
    insights.push('Limited OECD alignment - consider expanding governance coverage.');
  }
  
  const highGaps = gaps.filter(g => g.severity === 'high');
  if (highGaps.length > 0) {
    insights.push(`Critical gaps in: ${highGaps.map(g => g.principle.name).join(', ')}`);
  }
  
  const topMatch = matches[0];
  if (topMatch && topMatch.score >= 80) {
    insights.push(`Strongest alignment with "${topMatch.principle.name}" (${topMatch.score}%)`);
  }
  
  return insights;
}

// Get OECD context for AI prompt
export function getOECDContextForAI(): string {
  const dimensions = OECD_DIMENSIONS.map(d => 
    `- ${d.name}: ${d.description}`
  ).join('\n');
  
  const principles = OECD_PRINCIPLES.map(p => 
    `- ${p.name} (${p.id}): ${p.description} [Category: ${p.category}]`
  ).join('\n');
  
  return `
## OECD Framework for Classification of AI Systems

### Five Dimensions:
${dimensions}

### Ten Principles:
${principles}

### Governance Layers:
- Layer A (Context): Societal, organizational, and individual factors
- Layer B (Data & Input): Data sources, collection methods, preprocessing
- Layer C (Model): Algorithm types, training approaches, decision logic
`;
}

// Get frameworks context for AI prompt
export function getFrameworksContextForAI(): string {
  return AI_GOVERNANCE_FRAMEWORKS.map(f => 
    `### ${f.emoji} ${f.name} (${f.shortName})
- Status: ${f.status} (${f.effectiveDate || 'N/A'})
- Type: ${f.type} | Region: ${f.region}
- Key Principles: ${f.principles.map(p => p.name).join(', ')}`
  ).join('\n\n');
}
