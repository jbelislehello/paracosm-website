// Shared Ontology Pipeline definition
// Mirrors the 6-stage pipeline (Controlled Vocabulary → Knowledge Graph)
// from Modern Data 101's "Ontology Pipeline", mapped onto Calm Magic PRD layers.

export type OntologyPrdLayer = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS';

export interface OntologyContent {
  pollens_aspirations?: string;
  pollens_cultural_elements?: string;
  noems_concepts?: string;
  noems_mental_models?: string;
  noems_intuitions?: string;
  poems_objects?: string;
  poems_systems?: string;
  totems_data_architecture?: string;
  totems_access_controls?: string;
  [key: string]: string | undefined;
}

export interface OntologyStage {
  id: string;
  index: number;
  label: string;
  description: string;
  layer: OntologyPrdLayer;
  check: (c: OntologyContent) => boolean;
}

const j = (...parts: (string | undefined)[]) => parts.map((p) => p ?? '').join(' ');

export const ONTOLOGY_PIPELINE_STAGES: OntologyStage[] = [
  {
    id: 'controlled-vocabulary',
    index: 1,
    label: 'Controlled Vocabulary',
    description: 'Foundation of semantic knowledge systems; reconciles synonyms, clarifies terms.',
    layer: 'POLLENS',
    check: (c) => /(vocabulary|glossary|terminology|naming|term)/i.test(j(c.pollens_aspirations, c.pollens_cultural_elements)),
  },
  {
    id: 'metadata-standards',
    index: 2,
    label: 'Metadata Standards',
    description: 'Schema-based control; structural, descriptive, and administrative elements.',
    layer: 'NOEMS',
    check: (c) => /(metadata|schema|descriptor|attribute|tag)/i.test(j(c.noems_concepts, c.noems_mental_models)),
  },
  {
    id: 'taxonomy',
    index: 3,
    label: 'Taxonomy',
    description: 'Structures the controlled vocabulary into a hierarchy with parent-child relations.',
    layer: 'NOEMS',
    check: (c) => /(taxonomy|hierarchy|parent.?child|categor|classif)/i.test(j(c.noems_concepts, c.noems_intuitions)),
  },
  {
    id: 'thesaurus',
    index: 4,
    label: 'Thesaurus',
    description: 'Reconciles synonyms, extending the taxonomy beyond parent-child relations.',
    layer: 'POEMS',
    check: (c) => /(thesaurus|synonym|alias|related term|equivalent)/i.test(j(c.poems_objects, c.poems_systems)),
  },
  {
    id: 'ontology',
    index: 5,
    label: 'Ontology',
    description: 'Introduces logical reasoning; defines classes, relations, properties, and attributes.',
    layer: 'TOTEMS',
    check: (c) => /(ontolog|class|relation|property|properties|entit)/i.test(j(c.totems_data_architecture)),
  },
  {
    id: 'knowledge-graph',
    index: 6,
    label: 'Knowledge Graph',
    description: 'Includes all stages of the pipeline and lends a visual representation of semantic relations.',
    layer: 'TOTEMS',
    check: (c) => /(knowledge graph|graph|node|edge|triple|rdf|sparql)/i.test(j(c.totems_data_architecture, c.totems_access_controls)),
  },
];

export interface PipelineProgress {
  results: { stage: OntologyStage; satisfied: boolean }[];
  completed: number;
  total: number;
  percent: number;
}

export const getPipelineProgress = (content: OntologyContent): PipelineProgress => {
  const results = ONTOLOGY_PIPELINE_STAGES.map((stage) => ({
    stage,
    satisfied: stage.check(content),
  }));
  const completed = results.filter((r) => r.satisfied).length;
  const total = results.length;
  return { results, completed, total, percent: Math.round((completed / total) * 100) };
};
