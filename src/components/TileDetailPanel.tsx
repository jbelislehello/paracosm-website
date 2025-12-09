import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, ArrowRight, ArrowDown, Sparkles, Save, Loader2, LogIn, X, BookOpen, Workflow, Gamepad2, Users } from 'lucide-react';
import { useState } from 'react';

type CompassType = 'narrative' | 'workflow' | 'inquiry' | 'playground' | 'human-dynamics';

const COMPASSES: { id: CompassType; name: string; description: string; icon: React.ElementType; color: string }[] = [
  { id: 'narrative', name: 'Narrative', description: 'Story & diegetic framing', icon: BookOpen, color: 'from-rose-500 to-pink-500' },
  { id: 'workflow', name: 'Workflow', description: 'Process & methods', icon: Workflow, color: 'from-blue-500 to-cyan-500' },
  { id: 'inquiry', name: 'Inquiry & Practices', description: 'Contemplative & ritual', icon: Sparkles, color: 'from-amber-500 to-orange-500' },
  { id: 'playground', name: 'Playground', description: 'Experimentation & play', icon: Gamepad2, color: 'from-green-500 to-emerald-500' },
  { id: 'human-dynamics', name: 'Human Dynamics', description: 'Relational & systemic', icon: Users, color: 'from-purple-500 to-indigo-500' },
];

const rowLabels = [
  { letter: 'M', name: 'Mindsets', stage: 'AGENDAS' },
  { letter: 'A', name: 'Agilities', stage: 'AGENDAS' },
  { letter: 'G', name: 'Goals', stage: 'AGENDAS' },
  { letter: 'I', name: 'Intuition', stage: 'LENS' },
  { letter: 'C', name: 'Compasses', stage: 'LENS' },
  { letter: 'N', name: 'Norms', stage: 'ABOVE' },
  { letter: 'S', name: 'Synergies', stage: 'ABOVE' },
  { letter: 'P+A', name: 'Protocols & Architectures', stage: 'ABOVE' },
];

const colLabels = [
  { letter: 'C', name: 'Chances' },
  { letter: 'H', name: 'Heart' },
  { letter: 'O', name: 'Observer' },
  { letter: 'R', name: 'Reversal' },
  { letter: 'D', name: 'Design' },
  { letter: 'S', name: 'Seeds' },
  { letter: 'M', name: 'Methods' },
  { letter: 'S', name: 'Systems' },
];

interface TileDetailPanelProps {
  selectedTile: { row: number; col: number };
  activeCompass: CompassType | null;
  board: string;
  isAuthenticated: boolean;
  saving: boolean;
  onClose: () => void;
  onSavePolen: (content: string, tileId: number) => Promise<void>;
}

const TileDetailPanel = ({
  selectedTile,
  activeCompass,
  board,
  isAuthenticated,
  saving,
  onClose,
  onSavePolen,
}: TileDetailPanelProps) => {
  const [polenContent, setPolenContent] = useState('');
  const [showPolenForm, setShowPolenForm] = useState(false);

  const getBoardColor = (board: string) => {
    switch (board) {
      case 'LOVE': return 'from-rose-500 to-pink-500';
      case 'MAGIC': return 'from-purple-500 to-indigo-500';
      case 'CALM': return 'from-blue-500 to-cyan-500';
      case 'OPEN': return 'from-green-500 to-emerald-500';
      case 'FREE': return 'from-amber-500 to-orange-500';
      default: return 'from-gray-500 to-slate-500';
    }
  };

  const getContextualQuestions = (row: number, col: number, compass: CompassType | null) => {
    const rowInfo = rowLabels[row];
    const colInfo = colLabels[col];
    
    const rowContext = rowInfo.name.toLowerCase();
    const colContext = colInfo.name.toLowerCase();
    
    const compassFraming: Record<CompassType, { glitch: string; drift: string; tune: string }> = {
      narrative: {
        glitch: 'What story feels incomplete or stuck',
        drift: 'What narrative possibilities emerge',
        tune: 'How does this story want to be told'
      },
      workflow: {
        glitch: 'What process friction exists',
        drift: 'What workflow alternatives could we try',
        tune: 'What method best integrates here'
      },
      inquiry: {
        glitch: 'What deeper question is arising',
        drift: 'What practices might illuminate this',
        tune: 'What ritual or reflection crystallizes insight'
      },
      playground: {
        glitch: 'What feels rigid or unfun',
        drift: 'What playful experiments could we try',
        tune: 'What game or experiment yields the most learning'
      },
      'human-dynamics': {
        glitch: 'What relational tension is present',
        drift: 'What systemic patterns might be at play',
        tune: 'How do we integrate individual and collective needs'
      }
    };
    
    const frame = compass ? compassFraming[compass] : {
      glitch: 'What feels off or alive',
      drift: 'What options emerge',
      tune: 'What integration is needed'
    };
    
    return {
      glitch: `${frame.glitch} in your ${rowContext} around ${colContext}?`,
      drift: `${frame.drift} when exploring ${colContext} through ${rowContext}?`,
      tune: `${frame.tune} for ${rowContext} × ${colContext}?`,
      deliverable: getDeliverable(row, col)
    };
  };

  const getDeliverable = (row: number, col: number) => {
    const deliverables: Record<string, string> = {
      '0-0': 'Reframed belief statement',
      '0-1': 'Emotional anchor phrase',
      '0-2': 'Observer stance description',
      '0-3': 'Inverted assumption',
      '0-4': 'Design principle',
      '0-5': 'Seed conversation script',
      '1-0': 'Quick experiment (< 60 min)',
      '1-1': 'Heart-led action step',
      '1-2': 'Observation practice',
      '1-3': 'Opposite test',
      '1-4': 'Prototype sketch',
      '1-5': 'Movement pattern',
      '2-0': 'Risk-aware goal',
      '2-1': 'Heart-aligned outcome',
      '2-2': 'Measurable indicator',
      '2-3': 'Counter-goal exploration',
      '2-4': 'Designed milestone',
      '2-5': 'Goal seed artifact',
      '3-0': 'Landscape scan',
      '3-1': 'Emotional terrain map',
      '3-2': 'Field observation',
      '3-3': 'Hidden pattern',
      '3-4': 'Designed lens',
      '3-5': 'Fertility assessment',
      '4-0': 'Energy reading',
      '4-1': 'Heart compass calibration',
      '4-2': 'Witness stance',
      '4-3': 'Shadow/light flip',
      '4-4': 'Compass design',
      '4-5': 'Energy seed',
      '5-0': 'Chance-taking norm',
      '5-1': 'Care norm',
      '5-2': 'Observation norm',
      '5-3': 'Challenge norm',
      '5-4': 'Design norm',
      '5-5': 'Seeding norm',
      '5-6': 'Method-norm link',
      '6-0': 'Synergy opportunity',
      '6-1': 'Heart connection',
      '6-2': 'Systemic insight',
      '6-3': 'Tension integration',
      '6-4': 'Design synthesis',
      '6-5': 'Cross-pollination',
      '7-0': 'Risk protocol',
      '7-1': 'Care protocol',
      '7-2': 'Observation protocol',
      '7-3': 'Pivot protocol',
      '7-4': 'Design blueprint',
      '7-5': 'Pilot kit',
      '7-6': 'SOP draft',
      '7-7': 'System architecture'
    };
    return deliverables[`${row}-${col}`] || 'Tile insight';
  };

  const handleSavePolen = async () => {
    if (!polenContent.trim()) return;
    const tileId = selectedTile.row * 8 + selectedTile.col + 1;
    await onSavePolen(polenContent, tileId);
    setPolenContent('');
    setShowPolenForm(false);
  };

  const questions = getContextualQuestions(selectedTile.row, selectedTile.col, activeCompass);

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-muted/30">
      {/* Header */}
      <div className="p-4 border-b border-border/50 flex items-start justify-between bg-background/80 backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <Badge className={`bg-gradient-to-r ${getBoardColor(board)} text-white`}>
              {rowLabels[selectedTile.row].letter}{colLabels[selectedTile.col].letter}
            </Badge>
            <h3 className="font-bold text-lg">
              {rowLabels[selectedTile.row].name} × {colLabels[selectedTile.col].name}
            </h3>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Stage: {rowLabels[selectedTile.row].stage} | 
            Lens: {activeCompass ? COMPASSES.find(c => c.id === activeCompass)?.name : 'None selected'}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* GL!TCH Question */}
        <Card className="p-4 bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUp className="w-4 h-4 text-red-500" />
            <span className="font-bold text-red-500">GL!TCH</span>
            <span className="text-xs text-muted-foreground">— What feels off?</span>
          </div>
          <p className="text-sm">{questions.glitch}</p>
        </Card>

        {/* DRIFT Question */}
        <Card className="p-4 bg-blue-500/10 border border-blue-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRight className="w-4 h-4 text-blue-500" />
            <span className="font-bold text-blue-500">DRIFT</span>
            <span className="text-xs text-muted-foreground">— Explore possibilities</span>
          </div>
          <p className="text-sm">{questions.drift}</p>
        </Card>

        {/* TUNE Question */}
        <Card className="p-4 bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-2 mb-2">
            <ArrowDown className="w-4 h-4 text-green-500" />
            <span className="font-bold text-green-500">TUNE</span>
            <span className="text-xs text-muted-foreground">— Integrate & crystallize</span>
          </div>
          <p className="text-sm">{questions.tune}</p>
        </Card>

        {/* Expected Deliverable */}
        <Card className="p-3 bg-primary/10 border border-primary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="font-medium text-sm">Expected Deliverable:</span>
            <Badge variant="outline" className="text-primary border-primary/50">
              {questions.deliverable}
            </Badge>
          </div>
        </Card>

        {/* POLEN Entry Form */}
        <Card className="p-4 border border-amber-500/30 bg-amber-500/5">
          {showPolenForm ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-sm">Capture POLEN (raw fragment)</span>
              </div>
              <Textarea
                placeholder="Write your GL!TCH observation, insight, or fragment..."
                value={polenContent}
                onChange={(e) => setPolenContent(e.target.value)}
                className="min-h-[120px]"
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSavePolen}
                  disabled={!polenContent.trim() || saving || !isAuthenticated}
                >
                  {saving ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Save className="w-3 h-3 mr-1" />}
                  Save Polen
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => { setShowPolenForm(false); setPolenContent(''); }}
                >
                  Cancel
                </Button>
              </div>
              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground">
                  <LogIn className="w-3 h-3 inline mr-1" />
                  Log in to save your polen entries
                </p>
              )}
            </div>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => setShowPolenForm(true)}
              className="w-full border-amber-500/50 hover:bg-amber-500/10"
            >
              <Sparkles className="w-3 h-3 mr-1 text-amber-500" />
              Capture Polen for this tile
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
};

export default TileDetailPanel;
