import React, { useState } from 'react';
import { Compass, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { QUADRANT_LABELS } from '@/types/trajectory';

export interface OnticEntity {
  id: string;
  name: string;
  type: 'entity' | 'relation' | 'property';
  quadrant: 'SN' | 'IN' | 'IM' | 'SM';
  description: string;
}

export interface OnticProfile {
  entities: OnticEntity[];
  coreVision: string;
  lastUpdated: string;
}

interface OnticStateFinderProps {
  profile?: OnticProfile;
  onProfileUpdate?: (profile: OnticProfile) => void;
}

const QUADRANT_LENSES = [
  { key: 'IN' as const, prompt: 'What must exist for deep connection through new experiences?', icon: '💫' },
  { key: 'IM' as const, prompt: 'What must exist for deep connection through continuity?', icon: '🌿' },
  { key: 'SN' as const, prompt: 'What must exist for self-direction through exploration?', icon: '🚀' },
  { key: 'SM' as const, prompt: 'What must exist for self-direction through heritage?', icon: '🏛️' },
];

const OnticStateFinder: React.FC<OnticStateFinderProps> = ({ profile, onProfileUpdate }) => {
  const [vision, setVision] = useState(profile?.coreVision || '');
  const [entities, setEntities] = useState<OnticEntity[]>(profile?.entities || []);
  const [activeQuadrant, setActiveQuadrant] = useState<'SN' | 'IN' | 'IM' | 'SM'>('IN');
  const [newEntityName, setNewEntityName] = useState('');
  const [newEntityType, setNewEntityType] = useState<'entity' | 'relation' | 'property'>('entity');

  const addEntity = () => {
    if (!newEntityName.trim()) return;
    const entity: OnticEntity = {
      id: crypto.randomUUID(),
      name: newEntityName.trim(),
      type: newEntityType,
      quadrant: activeQuadrant,
      description: '',
    };
    const updated = [...entities, entity];
    setEntities(updated);
    setNewEntityName('');
    onProfileUpdate?.({
      entities: updated,
      coreVision: vision,
      lastUpdated: new Date().toISOString(),
    });
  };

  const removeEntity = (id: string) => {
    const updated = entities.filter(e => e.id !== id);
    setEntities(updated);
    onProfileUpdate?.({
      entities: updated,
      coreVision: vision,
      lastUpdated: new Date().toISOString(),
    });
  };

  const lens = QUADRANT_LENSES.find(l => l.key === activeQuadrant)!;
  const quadrantEntities = entities.filter(e => e.quadrant === activeQuadrant);

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-4">
      <div className="flex items-center gap-2">
        <Compass className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Ontic State Finder</h3>
      </div>

      <p className="text-xs text-muted-foreground">
        Identify the irreducible states of your vision — what must exist, how things relate, 
        and which qualities persist across all transformations.
      </p>

      {/* Core vision */}
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1 block">Core Vision</label>
        <Textarea
          value={vision}
          onChange={(e) => setVision(e.target.value)}
          placeholder="Describe the essence of what you're building..."
          className="text-sm min-h-[60px] resize-none"
        />
      </div>

      {/* Quadrant selector */}
      <div className="grid grid-cols-2 gap-2">
        {QUADRANT_LENSES.map(q => (
          <button
            key={q.key}
            onClick={() => setActiveQuadrant(q.key)}
            className={`p-2 rounded-lg text-left text-xs transition-colors ${
              activeQuadrant === q.key
                ? 'bg-primary/10 border border-primary/30'
                : 'bg-muted/30 border border-transparent hover:bg-muted/50'
            }`}
          >
            <span className="mr-1">{q.icon}</span>
            <span className="font-medium">{QUADRANT_LABELS[q.key].name}</span>
          </button>
        ))}
      </div>

      {/* Active lens prompt */}
      <div className="bg-primary/5 rounded-lg p-3 border border-primary/10">
        <p className="text-xs italic text-primary/80">{lens.icon} {lens.prompt}</p>
      </div>

      {/* Add entity */}
      <div className="flex gap-2">
        <input
          value={newEntityName}
          onChange={(e) => setNewEntityName(e.target.value)}
          placeholder="Name an ontic element..."
          className="flex-1 text-xs bg-background border rounded-lg px-3 py-2"
          onKeyDown={(e) => e.key === 'Enter' && addEntity()}
        />
        <select
          value={newEntityType}
          onChange={(e) => setNewEntityType(e.target.value as any)}
          className="text-xs bg-background border rounded-lg px-2"
        >
          <option value="entity">Entity</option>
          <option value="relation">Relation</option>
          <option value="property">Property</option>
        </select>
        <Button size="sm" variant="outline" onClick={addEntity}>
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Entity list */}
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {quadrantEntities.map(entity => (
          <div key={entity.id} className="flex items-center justify-between px-2 py-1.5 rounded bg-muted/30 text-xs">
            <div className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${
                entity.type === 'entity' ? 'bg-primary' : 
                entity.type === 'relation' ? 'bg-chart-2' : 'bg-chart-4'
              }`} />
              <span>{entity.name}</span>
              <span className="text-muted-foreground">({entity.type})</span>
            </div>
            <button onClick={() => removeEntity(entity.id)} className="text-muted-foreground hover:text-destructive">
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
        {quadrantEntities.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-2">No elements in this quadrant yet</p>
        )}
      </div>

      {/* Summary */}
      <div className="text-[10px] text-muted-foreground flex gap-3">
        <span>{entities.filter(e => e.type === 'entity').length} entities</span>
        <span>{entities.filter(e => e.type === 'relation').length} relations</span>
        <span>{entities.filter(e => e.type === 'property').length} properties</span>
      </div>
    </div>
  );
};

export default OnticStateFinder;
