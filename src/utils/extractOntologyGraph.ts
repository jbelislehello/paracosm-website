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
  label?: string;
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
  'also', 'etc', 'eg', 'ie', 'aka',
]);

const RANK: Record<GraphNodeKind, number> = { vocabulary: 0, concept: 1, class: 2, graph: 3 };

const normalizeLabel = (s: string): string => {
  let t = s.replace(/\s+/g, ' ').trim();
  t = t.replace(/^["'`(\[{<]+|["'`)\]}>:.,;!?]+$/g, '').trim();
  if (t === t.toUpperCase() && t.length > 3) {
    t = t.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return t;
};

const slug = (s: string): string => {
  let id = s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  // collapse trivial plural
  if (id.length > 5 && id.endsWith('s') && !id.endsWith('ss') && !id.endsWith('us')) {
    id = id.replace(/s$/, '');
  }
  return id;
};

const isUrl = (s: string) => /^https?:\/\//i.test(s) || /^www\./i.test(s);
const isNumeric = (s: string) => /^[\d.,%$€£-]+$/.test(s);

class GraphBuilder {
  private nodeMap = new Map<string, GraphNode>();
  private linkSet = new Set<string>();
  links: GraphLink[] = [];

  addNode(label: string, kind: GraphNodeKind, layer: OntologyPrdLayer, stageId: string): GraphNode | null {
    const cleaned = normalizeLabel(label);
    if (!cleaned || cleaned.length < 2 || cleaned.length > 60) return null;
    if (STOPWORDS.has(cleaned.toLowerCase())) return null;
    if (isUrl(cleaned) || isNumeric(cleaned)) return null;
    const id = slug(cleaned);
    if (!id || id.length < 2) return null;
    const existing = this.nodeMap.get(id);
    if (existing) {
      if (RANK[kind] > RANK[existing.kind]) existing.kind = kind;
      return existing;
    }
    if (this.nodeMap.size >= MAX_NODES) return null;
    const node: GraphNode = { id, label: cleaned, kind, layer, stageId };
    this.nodeMap.set(id, node);
    return node;
  }

  addLink(a: GraphNode | null, b: GraphNode | null, kind: GraphLinkKind, label?: string) {
    if (!a || !b || a.id === b.id) return;
    // For symmetric links (synonym), dedupe regardless of direction
    const pair = kind === 'synonym'
      ? [a.id, b.id].sort().join('::')
      : `${a.id}->${b.id}`;
    const key = `${pair}:${kind}`;
    if (this.linkSet.has(key)) return;
    if (this.links.length >= MAX_LINKS) return;
    this.linkSet.add(key);
    this.links.push({ source: a.id, target: b.id, kind, ...(label ? { label } : {}) });
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

const splitChildren = (text: string): string[] =>
  text
    .split(/\s*(?:,|\/|;|\s+and\s+|\s+&\s+)\s*/i)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 6);

const extractTerms = (text: string): string[] => {
  const out: string[] = [];
  const quoted = text.match(/"([^"]{2,40})"|'([^']{2,40})'/g);
  if (quoted) out.push(...quoted.map((q) => q.slice(1, -1)));
  const caps = text.match(/\b([A-Z][a-z0-9]+(?:\s+[A-Z][a-z0-9]+){0,3})\b/g);
  if (caps) out.push(...caps);
  return out;
};

const looksLikePhrase = (s: string) =>
  s.length >= 2 && s.length <= 40 && !/[.!?]$/.test(s) && s.split(/\s+/).length <= 4;

// Indented line parsing for hierarchy
const parseIndentedHierarchy = (
  text: string,
  b: GraphBuilder,
  layer: OntologyPrdLayer,
  stageId: string,
) => {
  const lines = text.split('\n');
  const stack: { depth: number; node: GraphNode | null }[] = [];
  for (const raw of lines) {
    if (!raw.trim()) continue;
    const m = raw.match(/^(\s*)(?:[-*•]\s+)?(.+?)\s*$/);
    if (!m) continue;
    const depth = Math.floor(m[1].replace(/\t/g, '  ').length / 2);
    const label = m[2];
    if (!looksLikePhrase(label) && !/^[A-Z]/.test(label)) continue;
    const node = b.addNode(label, 'concept', layer, stageId);
    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();
    const parent = stack.length ? stack[stack.length - 1].node : null;
    if (parent && node) b.addLink(parent, node, 'hierarchy');
    stack.push({ depth, node });
  }
};

export const extractOntologyGraph = (content: OntologyContent): OntologyGraph => {
  const b = new GraphBuilder();

  // ───── Stage 1: Controlled Vocabulary (POLLENS) ─────
  const vocabSrc = `${content.pollens_aspirations ?? ''}\n${content.pollens_cultural_elements ?? ''}`;
  for (const term of extractTerms(vocabSrc).slice(0, 18)) {
    b.addNode(term, 'vocabulary', 'POLLENS', 'controlled-vocabulary');
  }
  // Short bullet items as vocabulary
  for (const item of splitItems(vocabSrc).slice(0, 20)) {
    if (looksLikePhrase(item) && !/\s(is|are|has|uses)\s/i.test(item)) {
      b.addNode(item, 'vocabulary', 'POLLENS', 'controlled-vocabulary');
    }
  }

  // ───── Stage 2 + 3: Metadata + Taxonomy (NOEMS) ─────
  const noemsSrc = `${content.noems_concepts ?? ''}\n${content.noems_mental_models ?? ''}\n${content.noems_intuitions ?? ''}`;

  // Indentation-based nesting
  parseIndentedHierarchy(content.noems_concepts ?? '', b, 'NOEMS', 'taxonomy');
  parseIndentedHierarchy(content.noems_intuitions ?? '', b, 'NOEMS', 'taxonomy');

  for (const item of splitItems(noemsSrc).slice(0, 30)) {
    // Multi-level chain: A > B > C
    if (/(?:>|→|->)/.test(item) && (item.match(/(?:>|→|->)/g)?.length ?? 0) >= 1) {
      const parts = item.split(/\s*(?:>|→|->)\s*/).map((s) => s.trim()).filter(Boolean);
      if (parts.length >= 2) {
        let prev: GraphNode | null = null;
        for (const p of parts) {
          // last segment may contain comma-separated children
          if (p === parts[parts.length - 1] && /[,&]/.test(p)) {
            for (const child of splitChildren(p)) {
              const c = b.addNode(child, 'concept', 'NOEMS', 'taxonomy');
              if (prev) b.addLink(prev, c, 'hierarchy');
            }
          } else {
            const n = b.addNode(p, 'concept', 'NOEMS', 'taxonomy');
            if (prev) b.addLink(prev, n, 'hierarchy');
            prev = n;
          }
        }
        continue;
      }
    }

    // Verb-based hierarchy patterns
    const includes = item.match(/^(.+?)\s+(?:includes?|consists? of|contains?|comprises?|composed of)\s+(.+)$/i);
    if (includes) {
      const parent = b.addNode(includes[1], 'concept', 'NOEMS', 'taxonomy');
      for (const child of splitChildren(includes[2])) {
        const c = b.addNode(child, 'concept', 'NOEMS', 'taxonomy');
        b.addLink(parent, c, 'hierarchy');
      }
      continue;
    }
    const isKindOf = item.match(/^(.+?)\s+(?:is\s+(?:a\s+)?(?:kind|type|sort|subclass)\s+of|subclass of|extends|inherits from)\s+(.+)$/i);
    if (isKindOf) {
      const child = b.addNode(isKindOf[1], 'concept', 'NOEMS', 'taxonomy');
      const parent = b.addNode(isKindOf[2], 'concept', 'NOEMS', 'taxonomy');
      b.addLink(parent, child, 'hierarchy');
      continue;
    }
    const isPartOf = item.match(/^(.+?)\s+is\s+part\s+of\s+(.+)$/i);
    if (isPartOf) {
      const child = b.addNode(isPartOf[1], 'concept', 'NOEMS', 'taxonomy');
      const parent = b.addNode(isPartOf[2], 'concept', 'NOEMS', 'taxonomy');
      b.addLink(parent, child, 'hierarchy');
      continue;
    }

    // Colon-separated single hierarchy
    const colon = item.match(/^([A-Za-z][\w\s-]{1,40}):\s*(.+)$/);
    if (colon && !/^https?$/i.test(colon[1])) {
      const parent = b.addNode(colon[1], 'concept', 'NOEMS', 'taxonomy');
      for (const child of splitChildren(colon[2])) {
        const c = b.addNode(child, 'concept', 'NOEMS', 'taxonomy');
        b.addLink(parent, c, 'hierarchy');
      }
      continue;
    }

    if (looksLikePhrase(item)) {
      b.addNode(item, 'concept', 'NOEMS', 'metadata-standards');
    }
  }

  // ───── Stage 4: Thesaurus (POEMS) ─────
  const poemsSrc = `${content.poems_objects ?? ''}\n${content.poems_systems ?? ''}`;
  for (const item of splitItems(poemsSrc).slice(0, 25)) {
    // synonyms: A, B, C  (with optional head before colon)
    const synList = item.match(/^(?:(.+?)\s+)?synonyms?:\s*(.+)$/i);
    if (synList) {
      const head = synList[1] ? b.addNode(synList[1], 'concept', 'POEMS', 'thesaurus') : null;
      const terms = splitChildren(synList[2]).map((t) => b.addNode(t, 'concept', 'POEMS', 'thesaurus'));
      if (head) {
        for (const t of terms) b.addLink(head, t, 'synonym');
      } else {
        for (let i = 0; i < terms.length - 1; i++) {
          b.addLink(terms[i], terms[i + 1], 'synonym');
        }
      }
      continue;
    }

    const syn =
      item.match(/^(.+?)\s*(?::=|==|=|≡)\s*(.+)$/) ||
      item.match(/^(.+?)\s+(?:aka|a\.k\.a\.|also known as|also called|also)\s+(.+)$/i) ||
      item.match(/^(.+?)\s*\((?:alias|aka|also called|synonym|also)[:]?\s*(.+?)\)\s*$/i) ||
      item.match(/^(.+?)\s*\/\s*(.+)$/) ||
      item.match(/^(.+?)\s+—\s*also\s+(.+)$/i);
    if (syn) {
      const a = b.addNode(syn[1], 'concept', 'POEMS', 'thesaurus');
      const c = b.addNode(syn[2], 'concept', 'POEMS', 'thesaurus');
      b.addLink(a, c, 'synonym');
      continue;
    }

    // "A or B" — only when both sides look like short noun phrases
    const orMatch = item.match(/^([A-Z][\w\s-]{1,30})\s+or\s+([A-Z][\w\s-]{1,30})$/);
    if (orMatch) {
      const a = b.addNode(orMatch[1], 'concept', 'POEMS', 'thesaurus');
      const c = b.addNode(orMatch[2], 'concept', 'POEMS', 'thesaurus');
      b.addLink(a, c, 'synonym');
    }
  }

  // ───── Stage 5: Ontology (TOTEMS) ─────
  const totSrc = `${content.totems_data_architecture ?? ''}`;

  // Class { propA, propB } pattern
  for (const m of totSrc.matchAll(/([A-Z][\w\s]{0,30})\s*\{\s*([^}]{1,200})\s*\}/g)) {
    const cls = b.addNode(m[1], 'class', 'TOTEMS', 'ontology');
    for (const prop of splitChildren(m[2])) {
      const p = b.addNode(prop, 'concept', 'TOTEMS', 'ontology');
      b.addLink(cls, p, 'relation', 'has');
    }
  }

  for (const item of splitItems(totSrc).slice(0, 30)) {
    // A.property
    const prop = item.match(/^([A-Za-z][\w\s]*?)\.([A-Za-z][\w\s]*)$/);
    if (prop) {
      const cls = b.addNode(prop[1], 'class', 'TOTEMS', 'ontology');
      const p = b.addNode(prop[2], 'concept', 'TOTEMS', 'ontology');
      b.addLink(cls, p, 'relation');
      continue;
    }
    // A -[verb]-> B
    const labeled = item.match(/^(.+?)\s*-\[([^\]]+)\]->\s*(.+)$/);
    if (labeled) {
      const a = b.addNode(labeled[1], 'class', 'TOTEMS', 'ontology');
      const c = b.addNode(labeled[3], 'class', 'TOTEMS', 'ontology');
      b.addLink(a, c, 'relation', labeled[2].trim());
      continue;
    }
    // A — verb → B
    const dashVerb = item.match(/^(.+?)\s*[—–-]\s*([a-z][\w\s]{1,20})\s*(?:→|->)\s*(.+)$/i);
    if (dashVerb) {
      const a = b.addNode(dashVerb[1], 'class', 'TOTEMS', 'ontology');
      const c = b.addNode(dashVerb[3], 'class', 'TOTEMS', 'ontology');
      b.addLink(a, c, 'relation', dashVerb[2].trim());
      continue;
    }
    // Verb-based relations
    const rel = item.match(
      /^(.+?)\s+(has|owns|contains|relates to|is-a|isa|extends|references|uses|depends on|consumes|produces|belongs to|manages|governs|triggers|requires|provides|maps to|derived from|composed of|linked to|associated with)\s+(.+)$/i,
    );
    if (rel) {
      const a = b.addNode(rel[1], 'class', 'TOTEMS', 'ontology');
      const c = b.addNode(rel[3], 'class', 'TOTEMS', 'ontology');
      b.addLink(a, c, 'relation', rel[2].toLowerCase());
      continue;
    }
  }

  // ───── Stage 6: Knowledge Graph (TOTEMS) ─────
  const graphSrc = `${content.totems_data_architecture ?? ''}\n${content.totems_access_controls ?? ''}`;

  // Cypher-ish: (A)-[rel]->(B)
  for (const m of graphSrc.matchAll(/\(([A-Za-z][\w\s.\-_]{0,40})\)\s*-\[([^\]]+)\]->\s*\(([A-Za-z][\w\s.\-_]{0,40})\)/g)) {
    const a = b.addNode(m[1], 'graph', 'TOTEMS', 'knowledge-graph');
    const c = b.addNode(m[3], 'graph', 'TOTEMS', 'knowledge-graph');
    b.addLink(a, c, 'graph', m[2].trim());
  }

  // edge: A -> B [label]
  for (const m of graphSrc.matchAll(/(?:^|\n)\s*edge:\s*([^->\n]+?)\s*(?:->|→)\s*([^\[\n]+?)(?:\s*\[([^\]]+)\])?\s*(?=\n|$)/gi)) {
    const a = b.addNode(m[1], 'graph', 'TOTEMS', 'knowledge-graph');
    const c = b.addNode(m[2], 'graph', 'TOTEMS', 'knowledge-graph');
    b.addLink(a, c, 'graph', m[3]?.trim());
  }

  // Bidirectional A <-> B
  const biRe = /([A-Za-z][\w\s.\-_]{1,40})\s*<->\s*([A-Za-z][\w\s.\-_]{1,40})/g;
  let bm: RegExpExecArray | null;
  let biCount = 0;
  while ((bm = biRe.exec(graphSrc)) && biCount++ < 20) {
    const a = b.addNode(bm[1], 'graph', 'TOTEMS', 'knowledge-graph');
    const c = b.addNode(bm[2], 'graph', 'TOTEMS', 'knowledge-graph');
    b.addLink(a, c, 'graph');
    b.addLink(c, a, 'graph');
  }

  // Directed: A -> B  |  A → B
  const edgeRe = /([A-Za-z][\w\s.\-_]{1,40})\s*(?:->|→)\s*([A-Za-z][\w\s.\-_]{1,40})/g;
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
