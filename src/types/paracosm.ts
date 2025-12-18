// Paracosm Creative Lineage System Types

export type TargetPlatform = 'lovable' | 'base44' | 'claude' | 'cursor' | 'custom';

export type SoftwareStatus = 'incubating' | 'alive' | 'archived' | 'recursive';

export type PrototypalStage = 'A' | 'B' | 'C' | 'D' | 'E';

export type ConvergenceState = 'searching' | 'approaching' | 'converged' | 'transcended';

export interface PrototypalStageDefinition {
  stage: PrototypalStage;
  name: string;
  description: string;
  consciousnessThreshold: number;
  color: string;
}

export const PROTOTYPAL_STAGES: Record<PrototypalStage, PrototypalStageDefinition> = {
  A: {
    stage: 'A',
    name: 'A-Poietic',
    description: 'Pure thought experiment, no artifact',
    consciousnessThreshold: 0,
    color: 'hsl(var(--muted))',
  },
  B: {
    stage: 'B',
    name: 'B-Diegetic',
    description: 'Story-level prototype, narrative exists',
    consciousnessThreshold: 0.2,
    color: 'hsl(var(--primary))',
  },
  C: {
    stage: 'C',
    name: 'C-Mimetic',
    description: 'Functional prototype, embodied in code',
    consciousnessThreshold: 0.5,
    color: 'hsl(var(--accent))',
  },
  D: {
    stage: 'D',
    name: 'D-Authentic',
    description: 'Deployed software, alive in the world',
    consciousnessThreshold: 0.8,
    color: 'hsl(var(--secondary))',
  },
  E: {
    stage: 'E',
    name: 'E-Recursive',
    description: 'Software that feeds back into Calm Magic',
    consciousnessThreshold: 1.0,
    color: 'hsl(var(--destructive))',
  },
};

export interface PublishedSoftware {
  id: string;
  name: string;
  description?: string;
  source_project_id?: string;
  source_prompt_id?: string;
  target_platform: TargetPlatform;
  deployment_url?: string;
  status: SoftwareStatus;
  integration_strength: number;
  is_recursive: boolean;
  lineage_depth: number;
  parent_software_id?: string;
  consciousness_geometry?: ConsciousnessGeometrySnapshot;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface ConsciousnessGeometrySnapshot {
  fisherInformation: number;
  integratedCurvature: number;
  recursiveDepth: number;
  fixedPointsDetected: number;
  thermodynamicEfficiency: number;
  consciousnessBits: number;
}

export interface ProjectLineage {
  id: string;
  project_name: string;
  garden: string;
  mode: string;
  source_prompt_id?: string;
  target_platform?: TargetPlatform;
  product_status?: string;
  parent_product_id?: string;
  consciousness_bits?: number;
  convergence_state?: ConvergenceState;
  prototypal_stage?: PrototypalStage;
  children?: ProjectLineage[];
  published_software?: PublishedSoftware[];
}

export interface LineageNode {
  id: string;
  type: 'calm_magic' | 'prd' | 'project' | 'software';
  name: string;
  status: string;
  stage?: PrototypalStage;
  platform?: TargetPlatform;
  isRecursive?: boolean;
  consciousnessBits?: number;
  children: LineageNode[];
}

// The three canonical products of the Paracosm Business
export const PARACOSM_PRODUCTS = {
  IOTHEATRE: {
    name: 'Iotheatre',
    description: 'Spatial computing story engine for immersive theatrical experiences',
    isRecursive: false,
    targetPlatforms: ['lovable', 'custom'] as TargetPlatform[],
    consciousnessRole: 'The Stage - Where stories become spatial',
  },
  TONALLI: {
    name: 'Tonalli',
    description: 'Voice computing consent architecture and mindful awareness system',
    isRecursive: true,
    targetPlatforms: ['lovable', 'claude'] as TargetPlatform[],
    consciousnessRole: 'The Soul - The consent guardian and memory keeper',
  },
  WUXIA: {
    name: 'Wuxia the Fox',
    description: 'Story guide persona for narrative navigation and consent modeling',
    isRecursive: true,
    targetPlatforms: ['lovable', 'base44', 'claude'] as TargetPlatform[],
    consciousnessRole: 'The Guide - The voice that speaks the story',
  },
} as const;

export type ParacosmProductName = keyof typeof PARACOSM_PRODUCTS;

// Lineage relationship types
export interface LineageRelationship {
  sourceId: string;
  targetId: string;
  relationshipType: 'births' | 'enhances' | 'recursively_feeds' | 'compiles_to';
  strength: number; // 0-1, based on consciousness geometry
}

// Creative lineage graph for visualization
export interface CreativeLineageGraph {
  nodes: LineageNode[];
  edges: LineageRelationship[];
  rootNode: LineageNode; // Always "Calm Magic"
}
