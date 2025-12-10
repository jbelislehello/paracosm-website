import { Garden, GardenType } from "@/types/journal";

export interface ExtendedGarden extends Garden {
  semanticStage: string;
  stageDetails: string[];
}

export const gardens: ExtendedGarden[] = [
  {
    type: 'intelligence',
    name: 'Garden of Intelligence',
    description: 'Data, language, insight. Uncover what the organization knows, consciously and unconsciously—its cognitive architecture, informational flows, and latent knowing.',
    color: '#2563eb',
    icon: '🧠',
    semanticStage: 'Real Intelligence',
    stageDetails: ['Intuitions', 'Shared Ideas', 'Cultural Issues', 'Biases']
  },
  {
    type: 'systems',
    name: 'Garden of Systems',
    description: 'Infrastructure, routines, governance. Trace the living mechanics—how things move, interconnect, and constrain or enable emergence.',
    color: '#7c3aed',
    icon: '⚙️',
    semanticStage: 'Knowledge Objects',
    stageDetails: ['Content Sources', 'Data Nodes', 'API', 'Ontologies']
  },
  {
    type: 'prototypes',
    name: 'Garden of Prototypes',
    description: 'Imagination, embodiment, foresight. Ideas embodied in diegetic artifacts—story-driven interfaces that make stakeholders feel what the future could be.',
    color: '#db2777',
    icon: '🌱',
    semanticStage: 'Understanding',
    stageDetails: ['Processes', 'Maps', 'Three Graph Model', 'RDF/OWL']
  }
];

export const getGardenByType = (type: GardenType): ExtendedGarden | undefined => {
  return gardens.find(g => g.type === type);
};

export const energeticAxes = [
  {
    key: 'love' as const,
    name: 'LOVE',
    subtitle: 'Aliveness',
    description: 'Where vitality and desire ignite',
    color: '#ef4444'
  },
  {
    key: 'magic' as const,
    name: 'MAGIC',
    subtitle: 'Spaciousness',
    description: 'Where intuition and potential emerge',
    color: '#8b5cf6'
  },
  {
    key: 'calm' as const,
    name: 'CALM',
    subtitle: 'Wholeness/Ground',
    description: 'Where systems stabilize and regenerate',
    color: '#06b6d4'
  },
  {
    key: 'open' as const,
    name: 'OPEN',
    subtitle: 'Poiesis/Transformation',
    description: 'Where change, risk, and originality unfold',
    color: '#10b981'
  },
  {
    key: 'free' as const,
    name: 'FREE',
    subtitle: 'Neurogenesis/Integration',
    description: 'A moving arrow reflecting readiness for transformation',
    color: '#f59e0b'
  }
];
