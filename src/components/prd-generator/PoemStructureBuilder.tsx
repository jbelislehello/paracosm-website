import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Users, Package, MapPin, MessageSquare, Settings } from 'lucide-react';

export interface PoemStructure {
  people: string;
  objects: string;
  environments: string;
  messages: string;
  systems: string;
}

interface PoemStructureBuilderProps {
  poem: PoemStructure;
  onUpdate: (poem: PoemStructure) => void;
  readOnly?: boolean;
}

const POEM_ITEMS = [
  { 
    key: 'people', 
    label: 'People', 
    icon: Users,
    color: 'text-rose-500',
    bgColor: 'bg-rose-500/10',
    desc: 'Who is involved, affected, served? What roles, relationships, stakeholders?' 
  },
  { 
    key: 'objects', 
    label: 'Objects', 
    icon: Package,
    color: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    desc: 'What artifacts, tools, deliverables? Physical and digital objects?' 
  },
  { 
    key: 'environments', 
    label: 'Environments', 
    icon: MapPin,
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    desc: 'Where and when? Spaces, contexts, channels, temporal patterns?' 
  },
  { 
    key: 'messages', 
    label: 'Messages', 
    icon: MessageSquare,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-500/10',
    desc: 'What communications, signals, feedback loops? Information flows?' 
  },
  { 
    key: 'systems', 
    label: 'Systems', 
    icon: Settings,
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
    desc: 'What rules, workflows, integrations? Technical and social systems?' 
  },
];

const PoemStructureBuilder = ({ poem, onUpdate, readOnly = false }: PoemStructureBuilderProps) => {
  return (
    <Card className="p-4 bg-gradient-to-br from-amber-500/5 to-orange-500/5 border-amber-500/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex -space-x-1">
          {POEM_ITEMS.map(item => {
            const Icon = item.icon;
            return (
              <div key={item.key} className={`w-6 h-6 rounded-full ${item.bgColor} flex items-center justify-center`}>
                <Icon className={`w-3 h-3 ${item.color}`} />
              </div>
            );
          })}
        </div>
        <h4 className="font-semibold text-sm">P.O.E.M.S Structure</h4>
        <Badge variant="outline" className="text-xs ml-auto">Window of Tolerance 3</Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        The first POEM in production — a complete system description covering all dimensions of the solution.
      </p>

      <div className="space-y-4">
        {POEM_ITEMS.map(item => {
          const Icon = item.icon;
          return (
            <div key={item.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg ${item.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${item.color}`}>{item.label}</span>
                    <span className="text-xs text-muted-foreground">({item.key.charAt(0).toUpperCase()})</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
              <Textarea
                value={poem[item.key as keyof PoemStructure] || ''}
                onChange={(e) => onUpdate({ ...poem, [item.key]: e.target.value })}
                placeholder={`Describe the ${item.label.toLowerCase()} dimension...`}
                className="min-h-[80px] text-sm"
                disabled={readOnly}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-amber-500/20 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-amber-500" />
          POEM → TOTEM → ANTHEM
        </div>
        <div>System becomes reference, then culture</div>
      </div>
    </Card>
  );
};

export default PoemStructureBuilder;
