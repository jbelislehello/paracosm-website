import type { OntologyContent, OntologyPrdLayer } from './ontologyPipeline';

export type GraphNodeKind = 'vocabulary' | 'concept' | 'class' | 'graph';
export type GraphLinkKind = 'hierarchy' | 'synonym' | 'relation' | 'graph';

export interface GraphNode {
  id: string;
  label: string;
  kind: GraphNodeKind;
  layer: OntologyPrdLayer;
  stageId: string;
}

export interface GraphLink {
  source: string;
  target: string;
  kind: GraphLinkKind;
}

export interface OntologyGraph {
  nodes: GraphNode[];
  links: GraphLink[];
}

const MAX_NODES = 60;
const MAX_LINKS = 120;
const STOPWORDS = new Set([
  'the', 'and', 'for', 'with', 'from', 'into', 'that', 'this', 'these', 'those',
  'a', 'an', 'of', 'to', 'in', 'on', 'at', 'by', 'is', 'are', 'be', 'as', 'or',
  'we', 'our', 'their', 'they', 'it', 'its', 'will', 'can', 'should', 'must',
]);

const slug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const clean = (s: string) => s.replace(/^["'`(\[]+|["'`)\]:.,;]+$/g, '').trim();

class GraphBuilder {
  private nodeMap = new Map<string, GraphNode>();
  private linkSet = new Set<string>();
  links: GraphLink[] = [];

  addNode(label: string, kind: GraphNodeKind, layer: OntologyPrdLayer, stageId: string): GraphNode | null {
    const cleaned = clean(label);
    if (!cleaned || cleaned.length < 2 || cleaned.length > 60) return null;
    if (STOPWORDS.has(cleaned.toLowerCase())) return null;
    const id = slug(cleaned);
    if (!id) return null;
    const existing = this.nodeMap.get(id);
    if (existing) {
      // Upgrade kind toward more specific (graph > class > concept > vocabulary)
      const rank: Record<GraphNodeKind, number> = { vocabulary: 0, concept: 1, class: 2, graph: 3 };
      if (rank[kind] > rank[existing.kind]) existing.kind = kind;
      return existing;
    }
    if (this.nodeMap.size >= MAX_NODES) return null;
    const node: GraphNode = { id, label: cleaned, kind, layer, stageId };
    this.nodeMap.set(id, node);
    return node;
  }

  addLink(a: GraphNode | null, b: GraphNode | null, kind: GraphLinkKind) {
    if (!a || !b || a.id === b.id) return;
    const key = `${a.id}->${b.id}:${kind}`;
    if (this.linkSet.has(key)) return;
    if (this.links.length >= MAX_LINKS) return;
    this.linkSet.add(key);
    this.links.push({ source: a.id, target: b.id, kind });
  }

  build(): OntologyGraph {
    return { nodes: Array.from(this.nodeMap.values()), links: this.links };
  }
}

const splitItems = (text: string): string[] =>
  text
    .split(/[\n;•\u2022]|(?:^|\s)[-*]\s+/g)
    .map((s) => s.trim())
    .filter(Boolean);

const extractTerms = (text: string): string[] => {
  // Quoted strings + capitalized multi-word phrases
  const out: string[] = [];
  const quoted = text.match(/"([^"]{2,40})"|'([^']{2,40})'/g);
  if (quoted) out.push(...quoted.map((q) => q.slice(1, -1)));
  const caps = text.match(/\b([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+){0,3})\b/g);
  if (caps) out.push(...caps);
  return out;
};

export const extractOntologyGraph = (content: OntologyContent): OntologyGraph => {
  const b = new GraphBuilder();

  // Stage 1: Controlled Vocabulary (POLLENS)
  const vocabSrc = `${content.pollens_aspirations ?? ''}\n${content.pollens_cultural_elements ?? ''}`;
  for (const term of extractTerms(vocabSrc).slice(0, 18)) {
    b.addNode(term, 'vocabulary', 'POLLENS', 'controlled-vocabulary');
  }

  // Stage 2 + 3: Metadata + Taxonomy (NOEMS) — items + hierarchy patterns
  const noemsSrc = `${content.noems_concepts ?? ''}\n${content.noems_mental_models ?? ''}\n${content.noems_intuitions ?? ''}`;
  for (const item of splitItems(noemsSrc).slice(0, 24)) {
    // Hierarchy patterns: A > B  |  A → B  |  A: B
    const hier = item.match(/^(.+?)\s*(?:>|→|->|:)\s*(.+)$/);
    if (hier) {
      const parent = b.addNode(hier[1], 'concept', 'NOEMS', 'taxonomy');
      // Children may be comma-separated
      for (const child of hier[2].split(/[,/]/).slice(0, 4)) {
        const c = b.addNode(child, 'concept', 'NOEMS', 'taxonomy');
        b.addLink(parent, c, 'hierarchy');
      }
      continue;
    }
    b.addNode(item, 'concept', 'NOEMS', 'metadata-standards');
  }

  // Stage 4: Thesaurus (POEMS) — synonym patterns
  const poemsSrc = `${content.poems_objects ?? ''}\n${content.poems_systems ?? ''}`;
  for (const item of splitItems(poemsSrc).slice(0, 20)) {
    const syn = item.match(/^(.+?)\s*(?:=|≡|aka|alias)\s*(.+)$/i)
      || item.match(/^(.+?)\s*\((?:alias|aka|synonym):?\s*(.+?)\)\s*$/i)
      || item.match(/^(.+?)\s*\/\s*(.+)$/);
    if (syn) {
      const a = b.addNode(syn[1], 'concept', 'POEMS', 'thesaurus');
      const c = b.addNode(syn[2], 'concept', 'POEMS', 'thesaurus');
      b.addLink(a, c, 'synonym');
    }
  }

  // Stage 5: Ontology (TOTEMS) — class.property + relation patterns
  const totSrc = `${content.totems_data_architecture ?? ''}`;
  for (const item of splitItems(totSrc).slice(0, 24)) {
    // A.property
    const prop = item.match(/^([A-Za-z][\w\s]*?)\.([A-Za-z][\w\s]*)$/);
    if (prop) {
      const cls = b.addNode(prop[1], 'class', 'TOTEMS', 'ontology');
      const p = b.addNode(prop[2], 'concept', 'TOTEMS', 'ontology');
      b.addLink(cls, p, 'relation');
      continue;
    }
    // A has B  |  A relates to B  |  A is-a B
    const rel = item.match(/^(.+?)\s+(?:has|owns|contains|relates to|is-a|isa|extends|references)\s+(.+)$/i);
    if (rel) {
      const a = b.addNode(rel[1], 'class', 'TOTEMS', 'ontology');
      const c = b.addNode(rel[2], 'class', 'TOTEMS', 'ontology');
      b.addLink(a, c, 'relation');
      continue;
    }
  }

  // Stage 6: Knowledge Graph (TOTEMS) — explicit graph syntax
  const graphSrc = `${content.totems_data_architecture ?? ''}\n${content.totems_access_controls ?? ''}`;
  // A -> B, A → B
  const edgeRe = /([A-Za-z][\w\s-]{1,40})\s*(?:->|→)\s*([A-Za-z][\w\s-]{1,40})/g;
  let m: RegExpExecArray | null;
  let matches = 0;
  while ((m = edgeRe.exec(graphSrc)) && matches++ < 30) {
    const a = b.addNode(m[1], 'graph', 'TOTEMS', 'knowledge-graph');
    const c = b.addNode(m[2], 'graph', 'TOTEMS', 'knowledge-graph');
    b.addLink(a, c, 'graph');
  }
  // node: X
  for (const nm of graphSrc.matchAll(/(?:^|\n)\s*node:\s*(.+)/gi)) {
    b.addNode(nm[1], 'graph', 'TOTEMS', 'knowledge-graph');
  }

  return b.build();
};
