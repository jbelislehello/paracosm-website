// C-Suite Health Calculation Utilities

import { CSuiteRole } from '@/data/cSuiteRoles';
import { PRD_DIMENSIONS, PrdDimension } from '@/data/prdDimensions';

export interface HealthMetricResult {
  id: string;
  name: string;
  score: number;
  status: 'strong' | 'moderate' | 'needs-attention';
  insight: string;
}

export interface RoleHealthResult {
  overallScore: number;
  overallStatus: 'strong' | 'moderate' | 'needs-attention';
  metrics: HealthMetricResult[];
  recommendations: string[];
  dimensionScores: { dimension: PrdDimension; score: number; relevance: 'primary' | 'secondary' }[];
}

const getMetricStatus = (score: number): 'strong' | 'moderate' | 'needs-attention' => {
  if (score >= 70) return 'strong';
  if (score >= 40) return 'moderate';
  return 'needs-attention';
};

const generateMetricInsight = (metricId: string, score: number, roleId: string): string => {
  const insights: Record<string, Record<string, string>> = {
    ceo: {
      vision_coherence: score >= 70 
        ? "Strong alignment between strategic vision and operational reality"
        : score >= 40 
        ? "Vision exists but gaps in execution alignment"
        : "Critical disconnect between vision and reality needs attention",
      cultural_vitality: score >= 70
        ? "Organization demonstrates healthy learning culture"
        : score >= 40
        ? "Cultural elements present but not fully activated"
        : "Cultural vitality needs nurturing for transformation",
      transformation_capacity: score >= 70
        ? "Organization shows strong adaptive capability"
        : score >= 40
        ? "Transformation potential exists but needs focus"
        : "Building transformation capacity should be priority"
    },
    cfo: {
      investment_traceability: score >= 70
        ? "Clear line of sight from investment to value delivery"
        : score >= 40
        ? "Investment tracking exists but needs refinement"
        : "Investment traceability gaps create governance risk",
      risk_visibility: score >= 70
        ? "Risks are surfaced and actively managed"
        : score >= 40
        ? "Some risks visible but blind spots may exist"
        : "Risk visibility insufficient for confident governance",
      value_flow: score >= 70
        ? "Value creation pathways are clear and measurable"
        : score >= 40
        ? "Value flow partially mapped but needs clarity"
        : "Value flow unclear, making ROI difficult to assess"
    },
    cto: {
      architectural_coherence: score >= 70
        ? "Architecture demonstrates strong structural integrity"
        : score >= 40
        ? "Architecture functional but technical debt accumulating"
        : "Architectural coherence needs immediate attention",
      semantic_clarity: score >= 70
        ? "Data models and APIs have clear semantic foundations"
        : score >= 40
        ? "Semantic structures exist but inconsistencies present"
        : "Semantic clarity insufficient for reliable integration",
      adaptive_capacity: score >= 70
        ? "System demonstrates self-regulation capability"
        : score >= 40
        ? "Some adaptive patterns but rigidity in places"
        : "System adaptability limited, evolution will be costly"
    }
  };

  return insights[roleId]?.[metricId] || "Assessment pending more data";
};

export const calculateDimensionReadiness = (
  dimensionId: string,
  seasonProgress: Record<string, Set<number>>,
  prdData: Record<string, any> | null
): number => {
  const dimension = PRD_DIMENSIONS.find(d => d.id === dimensionId);
  if (!dimension) return 0;

  let score = 0;
  const relatedLayers = dimension.relatedLayers;

  // Calculate based on season progress for related layers
  const layerToSeason: Record<string, string> = {
    'POLLEN': 'POLLENS',
    'NOEM': 'NOEMS', 
    'POEM': 'POEMS',
    'TOTEM': 'TOTEMS',
    'ANTHEM': 'ANTHEMS'
  };

  relatedLayers.forEach(layer => {
    const season = layerToSeason[layer];
    if (season && seasonProgress[season]) {
      const progress = (seasonProgress[season].size / 64) * 100;
      score += progress / relatedLayers.length;
    }
  });

  // Boost if PRD data exists for this dimension
  if (prdData) {
    const hasContent = relatedLayers.some(layer => {
      const layerKey = layer.toLowerCase();
      return Object.keys(prdData).some(key => 
        key.toLowerCase().includes(layerKey) && prdData[key]
      );
    });
    if (hasContent) score = Math.min(100, score + 15);
  }

  return Math.round(score);
};

export const calculateRoleHealth = (
  role: CSuiteRole,
  seasonProgress: Record<string, Set<number>>,
  prdData: Record<string, any> | null
): RoleHealthResult => {
  // Calculate dimension scores for this role
  const dimensionScores: { dimension: PrdDimension; score: number; relevance: 'primary' | 'secondary' }[] = PRD_DIMENSIONS.map(dimension => {
    const score = calculateDimensionReadiness(dimension.id, seasonProgress, prdData);
    const relevance: 'primary' | 'secondary' = role.relevantDimensions.includes(dimension.id) ? 'primary' : 'secondary';
    return { dimension, score, relevance };
  }).sort((a, b) => {
    // Sort by relevance first, then score
    if (a.relevance !== b.relevance) return a.relevance === 'primary' ? -1 : 1;
    return b.score - a.score;
  });

  // Calculate primary dimension average
  const primaryDimensions = dimensionScores.filter(d => d.relevance === 'primary');
  const primaryAvg = primaryDimensions.length > 0
    ? primaryDimensions.reduce((sum, d) => sum + d.score, 0) / primaryDimensions.length
    : 0;

  // Calculate metrics based on dimension scores and layer content
  const metrics: HealthMetricResult[] = role.healthMetrics.map(metric => {
    // Base score from relevant dimensions
    let score = primaryAvg;

    // Adjust based on specific layer content
    if (prdData) {
      role.relevantLayers.forEach(layer => {
        const hasContent = Object.keys(prdData).some(key => 
          key.toLowerCase().includes(layer.toLowerCase()) && prdData[key]
        );
        if (hasContent) score = Math.min(100, score + 5);
      });
    }

    // Add some variance based on metric weights
    score = Math.round(score * (0.85 + metric.weight * 0.3));
    score = Math.min(100, Math.max(0, score));

    return {
      id: metric.id,
      name: metric.name,
      score,
      status: getMetricStatus(score),
      insight: generateMetricInsight(metric.id, score, role.id)
    };
  });

  // Calculate overall score as weighted average
  const overallScore = Math.round(
    metrics.reduce((sum, m) => {
      const metric = role.healthMetrics.find(hm => hm.id === m.id);
      return sum + m.score * (metric?.weight || 0.33);
    }, 0)
  );

  // Generate recommendations
  const recommendations: string[] = [];
  const lowMetrics = metrics.filter(m => m.status === 'needs-attention');
  const moderateMetrics = metrics.filter(m => m.status === 'moderate');

  lowMetrics.forEach(m => {
    recommendations.push(`⚠️ ${m.name} needs immediate attention (${m.score}%)`);
  });

  moderateMetrics.slice(0, 2).forEach(m => {
    recommendations.push(`→ Focus on improving ${m.name} (${m.score}%)`);
  });

  const strongMetrics = metrics.filter(m => m.status === 'strong');
  if (strongMetrics.length > 0) {
    recommendations.push(`✓ ${strongMetrics[0].name} is a strength to leverage`);
  }

  return {
    overallScore,
    overallStatus: getMetricStatus(overallScore),
    metrics,
    recommendations,
    dimensionScores
  };
};

export const generateCSuiteExportSummary = (
  seasonProgress: Record<string, Set<number>>,
  prdData: Record<string, any> | null
): string => {
  const { C_SUITE_ROLES } = require('@/data/cSuiteRoles');
  
  let summary = `## 👔 C-Suite Executive Summary\n\n`;
  summary += `*"Bridge Intelligence with Empathy"*\n\n`;

  C_SUITE_ROLES.forEach((role: CSuiteRole) => {
    const health = calculateRoleHealth(role, seasonProgress, prdData);
    
    summary += `### ${role.emoji} For the ${role.title}\n\n`;
    summary += `**Overall Health:** ${health.overallScore}% (${health.overallStatus})\n\n`;
    summary += `**Key Question:** "${role.keyQuestion}"\n\n`;
    summary += `**Focus:** ${role.focus}\n\n`;
    
    summary += `**Health Metrics:**\n`;
    health.metrics.forEach(m => {
      const bar = '█'.repeat(Math.floor(m.score / 10)) + '░'.repeat(10 - Math.floor(m.score / 10));
      summary += `- ${m.name}: ${bar} ${m.score}%\n`;
      summary += `  *${m.insight}*\n`;
    });
    
    summary += `\n**Recommendations:**\n`;
    health.recommendations.forEach(r => {
      summary += `- ${r}\n`;
    });
    
    summary += `\n---\n\n`;
  });

  return summary;
};
