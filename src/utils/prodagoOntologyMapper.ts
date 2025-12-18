// Prodago Ontology Mapper - Transforms extracted knowledge into Prodago structure

import { 
  KnowledgeExtraction, 
  ProdagoKnowledgeObject, 
  ExtractedEntity,
  ExtractedRelation,
  GovernanceLayer,
  KnowledgeSystemType
} from '@/types/knowledge';

const generateId = () => Math.random().toString(36).substring(2, 15);

export function mapToProdagoKnowledgeObjects(
  extraction: KnowledgeExtraction,
  sourceImageUrl?: string
): ProdagoKnowledgeObject[] {
  const objects: ProdagoKnowledgeObject[] = [];
  const entityToId = new Map<string, string>();
  
  // First pass: Create all entities
  extraction.entities.forEach(entity => {
    const id = generateId();
    entityToId.set(entity.name, id);
    
    const obj: ProdagoKnowledgeObject = {
      id,
      entity: entity.name,
      type: mapEntityType(entity.type),
      knowledgeSystemType: extraction.knowledgeType,
      governanceLayer: extraction.governanceLayer,
      createdFrom: 'image',
      sourceImageUrl
    };
    
    // Add scope notes from description
    if (entity.description) {
      obj.scopeNotes = [entity.description];
    }
    
    // Add properties if available
    const props = extraction.properties[entity.name];
    if (props && props.length > 0) {
      obj.scopeNotes = [...(obj.scopeNotes || []), ...props];
    }
    
    objects.push(obj);
  });
  
  // Second pass: Establish relationships
  extraction.relations.forEach(relation => {
    const fromId = entityToId.get(relation.from);
    const toId = entityToId.get(relation.to);
    
    if (fromId && toId) {
      const fromObj = objects.find(o => o.id === fromId);
      const toObj = objects.find(o => o.id === toId);
      
      if (fromObj && toObj) {
        switch (relation.type) {
          case 'parent_of':
            fromObj.children = [...(fromObj.children || []), toId];
            toObj.parent = fromId;
            break;
          case 'child_of':
            toObj.children = [...(toObj.children || []), fromId];
            fromObj.parent = toId;
            break;
          case 'simpler_than':
          case 'richer_than':
            // Create implicit hierarchy
            if (relation.type === 'simpler_than') {
              toObj.scopeNotes = [...(toObj.scopeNotes || []), `Richer than: ${relation.from}`];
            } else {
              toObj.scopeNotes = [...(toObj.scopeNotes || []), `Simpler than: ${relation.from}`];
            }
            break;
          case 'associated_with':
          case 'part_of':
          case 'scope':
            toObj.scopeNotes = [...(toObj.scopeNotes || []), `${relation.type}: ${relation.from}`];
            break;
        }
      }
    }
  });
  
  // Third pass: Add playbook relevance
  extraction.playbookSeeds.forEach(seed => {
    // Find most relevant object for this playbook
    const relevantObj = objects.find(o => 
      o.governanceLayer === seed.targetLayer ||
      seed.title.toLowerCase().includes(o.entity.toLowerCase())
    );
    
    if (relevantObj) {
      relevantObj.playbookRelevance = `${seed.title}: ${seed.description}`;
    }
  });
  
  return objects;
}

function mapEntityType(type: ExtractedEntity['type']): ProdagoKnowledgeObject['type'] {
  switch (type) {
    case 'concept':
    case 'category':
      return 'class';
    case 'property':
      return 'property';
    case 'relationship':
      return 'relationship';
    case 'term':
    default:
      return 'instance';
  }
}

export function inferKnowledgeSystemType(extraction: KnowledgeExtraction): KnowledgeSystemType {
  const hasProperties = Object.keys(extraction.properties).length > 0;
  const hasRelations = extraction.relations.length > 0;
  const hasInference = extraction.entities.some(e => 
    e.description?.toLowerCase().includes('inference') ||
    e.description?.toLowerCase().includes('reasoning')
  );
  const hasScopeNotes = extraction.entities.some(e => 
    e.description && e.description.length > 50
  );
  
  if (hasInference && hasProperties && hasRelations && hasScopeNotes) {
    return 'ontology';
  } else if (hasRelations && (hasProperties || hasScopeNotes)) {
    return 'thesaurus';
  } else if (hasRelations) {
    return 'taxonomy';
  } else {
    return 'pick-list';
  }
}

export function inferGovernanceLayer(extraction: KnowledgeExtraction): GovernanceLayer | undefined {
  const allText = [
    extraction.summary,
    ...extraction.entities.map(e => e.name + ' ' + (e.description || '')),
    ...extraction.playbookSeeds.map(p => p.title + ' ' + p.description)
  ].join(' ').toLowerCase();
  
  // Layer C indicators (AI Systems)
  const layerCIndicators = ['ai', 'machine learning', 'model', 'algorithm', 'data operations', 'cyber', 'privacy', 'ethics'];
  if (layerCIndicators.some(i => allText.includes(i))) {
    return 'C';
  }
  
  // Layer B indicators (Governance)
  const layerBIndicators = ['governance', 'policy', 'compliance', 'readiness', 'operations', 'oversight'];
  if (layerBIndicators.some(i => allText.includes(i))) {
    return 'B';
  }
  
  // Layer A indicators (Environmental)
  const layerAIndicators = ['law', 'regulation', 'standard', 'external', 'principle', 'value', 'risk tolerance', 'business objective'];
  if (layerAIndicators.some(i => allText.includes(i))) {
    return 'A';
  }
  
  return undefined;
}

export function generatePolenContent(extraction: KnowledgeExtraction): string {
  const lines: string[] = [];
  
  lines.push(`## Knowledge Extraction Summary`);
  lines.push(extraction.summary);
  lines.push('');
  
  lines.push(`### Knowledge System Type: ${extraction.knowledgeType.toUpperCase()}`);
  if (extraction.governanceLayer) {
    lines.push(`### Governance Layer: ${getLayerName(extraction.governanceLayer)}`);
  }
  lines.push('');
  
  lines.push(`### Entities (${extraction.entities.length})`);
  extraction.entities.forEach(e => {
    lines.push(`- **${e.name}** (${e.type})${e.description ? `: ${e.description}` : ''}`);
  });
  lines.push('');
  
  if (extraction.relations.length > 0) {
    lines.push(`### Relations (${extraction.relations.length})`);
    extraction.relations.forEach(r => {
      lines.push(`- ${r.from} → ${r.type.replace(/_/g, ' ')} → ${r.to}`);
    });
    lines.push('');
  }
  
  if (extraction.playbookSeeds.length > 0) {
    lines.push(`### Playbook Seeds`);
    extraction.playbookSeeds.forEach(p => {
      lines.push(`- **${p.title}**: ${p.description}`);
    });
  }
  
  return lines.join('\n');
}

function getLayerName(layer: GovernanceLayer): string {
  switch (layer) {
    case 'A': return 'A - Environmental';
    case 'B': return 'B - Governance';
    case 'C': return 'C - AI Systems';
  }
}

export function generateTagsFromExtraction(extraction: KnowledgeExtraction): string[] {
  const tags: string[] = [];
  
  tags.push(extraction.knowledgeType);
  
  if (extraction.governanceLayer) {
    tags.push(`layer-${extraction.governanceLayer.toLowerCase()}`);
  }
  
  // Add top entities as tags
  extraction.entities.slice(0, 5).forEach(e => {
    tags.push(e.name.toLowerCase().replace(/\s+/g, '-'));
  });
  
  // Add playbook tags
  if (extraction.playbookSeeds.length > 0) {
    tags.push('playbook-seed');
  }
  
  return [...new Set(tags)];
}
