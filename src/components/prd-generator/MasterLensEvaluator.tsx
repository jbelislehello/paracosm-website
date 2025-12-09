import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Compass, Map, Calendar } from 'lucide-react';

interface MasterLensEvaluatorProps {
  lens: LensEvaluation;
  maps: MapsEvaluation;
  agendas: AgendasEvaluation;
  onUpdate: (type: 'lens' | 'maps' | 'agendas', data: any) => void;
  readOnly?: boolean;
}

export interface LensEvaluation {
  landscape: string;
  energy: string;
  norms: string;
  synergies: string;
}

export interface MapsEvaluation {
  methods: string;
  architecture: string;
  protocols: string;
  systems: string;
}

export interface AgendasEvaluation {
  analysis: string;
  guidelines: string;
  elaboration: string;
  normalization: string;
  development: string;
  adaptation: string;
  secrets: string;
}

export interface ChordsEvaluation {
  chances: string;
  heart: string;
  observer: string;
  reversal: string;
  design: string;
  seeds: string;
}

const LENS_ITEMS = [
  { key: 'landscape', label: 'Landscape', desc: 'The terrain and context' },
  { key: 'energy', label: 'Energy', desc: 'The vital force and momentum' },
  { key: 'norms', label: 'Norms', desc: 'Established patterns and rules' },
  { key: 'synergies', label: 'Synergies', desc: 'Connections and amplifications' },
];

const MAPS_ITEMS = [
  { key: 'methods', label: 'Methods', desc: 'Ways of doing' },
  { key: 'architecture', label: 'Architecture', desc: 'Ways of structuring' },
  { key: 'protocols', label: 'Protocols', desc: 'Social agreements' },
  { key: 'systems', label: 'Systems', desc: 'Technical integrations' },
];

const AGENDAS_ITEMS = [
  { key: 'analysis', label: 'Analysis', desc: 'Understanding the situation' },
  { key: 'guidelines', label: 'Guidelines', desc: 'Directing principles' },
  { key: 'elaboration', label: 'Elaboration', desc: 'Developing details' },
  { key: 'normalization', label: 'Normalization', desc: 'Making it standard' },
  { key: 'development', label: 'Development', desc: 'Building capacity' },
  { key: 'adaptation', label: 'Adaptation', desc: 'Adjusting to reality' },
  { key: 'secrets', label: 'Secrets', desc: 'Hidden wisdom' },
];


const MasterLensEvaluator = ({ 
  lens, 
  maps, 
  agendas, 
  onUpdate,
  readOnly = false 
}: MasterLensEvaluatorProps) => {
  return (
    <Card className="p-4 bg-muted/30">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm">Master Lens Evaluation</h4>
      </div>

      <Tabs defaultValue="lens" className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-auto">
          <TabsTrigger value="lens" className="text-xs py-1.5">
            <Compass className="w-3 h-3 mr-1" />
            LENS
          </TabsTrigger>
          <TabsTrigger value="maps" className="text-xs py-1.5">
            <Map className="w-3 h-3 mr-1" />
            MAPS
          </TabsTrigger>
          <TabsTrigger value="agendas" className="text-xs py-1.5">
            <Calendar className="w-3 h-3 mr-1" />
            AGENDAS
          </TabsTrigger>
        </TabsList>

        <TabsContent value="lens" className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Evaluate through: Landscape, Energy, Norms, Synergies
          </p>
          {LENS_ITEMS.map(item => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{item.label}</Badge>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
              <Textarea
                value={lens[item.key as keyof LensEvaluation] || ''}
                onChange={(e) => onUpdate('lens', { ...lens, [item.key]: e.target.value })}
                placeholder={`Describe the ${item.label.toLowerCase()}...`}
                className="min-h-[60px] text-sm"
                disabled={readOnly}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="maps" className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Structure through: Methods, Architecture, Protocols, Systems
          </p>
          {MAPS_ITEMS.map(item => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{item.label}</Badge>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
              <Textarea
                value={maps[item.key as keyof MapsEvaluation] || ''}
                onChange={(e) => onUpdate('maps', { ...maps, [item.key]: e.target.value })}
                placeholder={`Define the ${item.label.toLowerCase()}...`}
                className="min-h-[60px] text-sm"
                disabled={readOnly}
              />
            </div>
          ))}
        </TabsContent>

        <TabsContent value="agendas" className="mt-4 space-y-3">
          <p className="text-xs text-muted-foreground mb-2">
            Progress through: Analysis → Guidelines → Elaboration → Normalization → Development → Adaptation → Secrets
          </p>
          {AGENDAS_ITEMS.map(item => (
            <div key={item.key} className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">{item.label}</Badge>
                <span className="text-xs text-muted-foreground">{item.desc}</span>
              </div>
              <Textarea
                value={agendas[item.key as keyof AgendasEvaluation] || ''}
                onChange={(e) => onUpdate('agendas', { ...agendas, [item.key]: e.target.value })}
                placeholder={`Describe ${item.label.toLowerCase()}...`}
                className="min-h-[60px] text-sm"
                disabled={readOnly}
              />
            </div>
          ))}
        </TabsContent>

      </Tabs>
    </Card>
  );
};

export default MasterLensEvaluator;
