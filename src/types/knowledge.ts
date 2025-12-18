// Knowledge Object Types for Prodago

export interface ExtractedEntity {
  name: string;
  type: 'concept' | 'term' | 'category' | 'relationship' | 'property';
  description?: string;
}

export interface ExtractedRelation {
  from: string;
  to: string;
  type: 'parent_of' | 'child_of' | 'associated_with' | 'simpler_than' | 'richer_than' | 'part_of' | 'scope';
}

export type KnowledgeSystemType = 'pick-list' | 'taxonomy' | 'thesaurus' | 'ontology';

export type GovernanceLayer = 'A' | 'B' | 'C'; // A: Environmental, B: Governance, C: AI Systems

export interface PlaybookSeed {
  title: string;
  description: string;
  targetLayer?: GovernanceLayer;
  complexity: 'low' | 'medium' | 'high';
}

export interface KnowledgeExtraction {
  entities: ExtractedEntity[];
  relations: ExtractedRelation[];
  knowledgeType: KnowledgeSystemType;
  governanceLayer?: GovernanceLayer;
  properties: Record<string, string[]>;
  playbookSeeds: PlaybookSeed[];
  summary: string;
  rawAnalysis?: string;
}

export interface ProdagoKnowledgeObject {
  id: string;
  entity: string;
  type: 'class' | 'property' | 'relationship' | 'scope_note' | 'instance';
  parent?: string;
  children?: string[];
  synonyms?: string[];
  scopeNotes?: string[];
  governanceLayer?: GovernanceLayer;
  playbookRelevance?: string;
  knowledgeSystemType: KnowledgeSystemType;
  createdFrom: 'image' | 'manual' | 'ai-generated';
  sourceImageUrl?: string;
}

export interface GovernanceLayerDetails {
  name: string;
  external?: string[];
  internal?: string[];
  components?: string[];
  domains?: string[];
}

export interface AIGovernanceModel {
  layers: Record<GovernanceLayer, GovernanceLayerDetails>;
  playbookSeeds: PlaybookSeed[];
}

export interface KnowledgeExtractionRequest {
  imageBase64: string;
  projectId?: string;
  context?: string;
}

export interface KnowledgeExtractionResponse {
  success: boolean;
  extraction?: KnowledgeExtraction;
  knowledgeObjects?: ProdagoKnowledgeObject[];
  error?: string;
}
