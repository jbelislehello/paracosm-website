import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { 
  X, 
  FileText, 
  Flower2,
  Lightbulb,
  PenTool,
  Gem,
  Music,
  Sparkles,
  ExternalLink,
  Loader2,
  Check,
  FileDown,
  Printer,
  Layers,
  Search,
  Hexagon,
  Target,
  Eye,
  Briefcase,
  Zap,
  Lock,
  Copy,
  Edit3,
  ArrowLeft,
  ArrowRight,
  Shield,
  CheckCircle2,
  Circle,
  AlertCircle,
  CloudOff,
  Cloud
} from 'lucide-react';
import { downloadMarkdown, exportPrdAsPdf } from '@/utils/prdExport';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  Season, 
  SEASON_ORDER, 
  SEASON_LABELS, 
  SEASON_PRD_LAYER, 
  PRD_LAYER_FIELDS,
  getLayerReadiness 
} from '@/utils/prdAccessLevel';
import { PrdEducationPanel } from './PrdEducationPanel';
import { PrdDimensionalView } from './PrdDimensionalView';
import CSuiteDashboard from './CSuiteDashboard';
import CompilationTab from '@/components/prd-generator/CompilationTab';
import PrdStageProgress from '@/components/prd-generator/PrdStageProgress';
import StackFormation from '@/components/prd-generator/StackFormation';
import { FeminineSafePRD } from '@/components/journal/FeminineSafePRD';
import { useMode } from './context/ModeContext';
import { useSubscription } from '@/hooks/useSubscription';
import { hasFeatureAccess } from '@/data/subscriptionTiers';
import FeatureGate from '@/components/FeatureGate';
import PremiumBadge from '@/components/PremiumBadge';
import { PrdLayer } from '@/components/prd-generator/PrdStageProgress';
import { detectPatterns, DetectedPattern, getPatternColor } from '@/utils/patternDetection';
import { RING_DEFINITIONS } from '@/utils/ringToleranceSystem';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { PRD_STAGES, PrdStage } from '@/types/journal-expansion';

// Wizard-specific types and constants
interface GeneratedContent {
  // POLLENS Layer - Relational & Cultural Aspirations
  pollens_aspirations?: string;
  pollens_team_dynamics?: string;
  pollens_cultural_elements?: string;
  pollens_relational_patterns?: string;
  pollens_constraints?: string;
  pollens_stakes?: string;
  // NOEMS Layer - Conceptual Ideation
  noems_concepts?: string;
  noems_shared_ideas?: string;
  noems_intuitions?: string;
  noems_mental_models?: string;
  // POEMS Layer - P.O.E.M.S. Experiential Design
  poems_people?: string;
  poems_objects?: string;
  poems_environments?: string;
  poems_messages?: string;
  poems_systems?: string;
  poems_prototypes?: string;
  // TOTEMS Layer - Technical Infrastructure
  totems_data_architecture?: string;
  totems_security_policies?: string;
  totems_access_controls?: string;
  totems_system_requirements?: string;
  totems_integration_points?: string;
  totems_technical_debt?: string;
  // ANTHEMS Layer - Market & Storytelling
  anthems_market_positioning?: string;
  anthems_brand_narrative?: string;
  anthems_go_to_market?: string;
  anthems_audience_segments?: string;
  anthems_success_signals?: string;
  anthems_storytelling_assets?: string;
  // COMPILATION: Stack Implications per layer
  stack_implications_pollens?: string;
  stack_implications_noems?: string;
  stack_implications_poems?: string;
  stack_implications_totems?: string;
  stack_implications_anthems?: string;
  // COMPILATION: Prompt Hooks per layer
  prompt_hooks_pollens?: string;
  prompt_hooks_noems?: string;
  prompt_hooks_poems?: string;
  prompt_hooks_totems?: string;
  prompt_hooks_anthems?: string;
}

const LAYER_FIELDS: Record<PrdLayer, (keyof GeneratedContent)[]> = {
  POLLENS: ['pollens_aspirations', 'pollens_team_dynamics', 'pollens_cultural_elements', 'pollens_relational_patterns', 'pollens_constraints', 'pollens_stakes', 'stack_implications_pollens', 'prompt_hooks_pollens'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'noems_mental_models', 'stack_implications_noems', 'prompt_hooks_noems'],
  POEMS: ['poems_people', 'poems_objects', 'poems_environments', 'poems_messages', 'poems_systems', 'poems_prototypes', 'stack_implications_poems', 'prompt_hooks_poems'],
  TOTEMS: ['totems_data_architecture', 'totems_security_policies', 'totems_access_controls', 'totems_system_requirements', 'totems_integration_points', 'totems_technical_debt', 'stack_implications_totems', 'prompt_hooks_totems'],
  ANTHEMS: ['anthems_market_positioning', 'anthems_brand_narrative', 'anthems_go_to_market', 'anthems_audience_segments', 'anthems_success_signals', 'anthems_storytelling_assets', 'stack_implications_anthems', 'prompt_hooks_anthems']
};

const WIZARD_FIELD_LABELS: Record<string, { label: string; description: string }> = {
  // POLLENS - Relational & Cultural Aspirations
  pollens_aspirations: { label: 'Aspirations', description: 'Individual, team, and organizational aspirations with emotional texture' },
  pollens_team_dynamics: { label: 'Team Dynamics', description: 'Patterns in collaboration, communication, and conflict resolution' },
  pollens_cultural_elements: { label: 'Cultural Elements', description: 'Values, norms, rituals, and unwritten rules at play' },
  pollens_relational_patterns: { label: 'Relational Patterns', description: 'Key relationships and their dynamics' },
  pollens_constraints: { label: 'Constraints', description: 'Cultural, relational, and organizational barriers' },
  pollens_stakes: { label: 'Stakes', description: 'What happens to relationships and culture if nothing changes' },
  // NOEMS - Conceptual Ideation
  noems_concepts: { label: 'Crystallized Concepts', description: 'Emerging concepts with maturity levels (seed/growing/ripe)' },
  noems_shared_ideas: { label: 'Shared Ideas', description: 'Ideas emerging from multiple tensions' },
  noems_intuitions: { label: 'Intuitions', description: 'Gut feelings worth tracking' },
  noems_mental_models: { label: 'Mental Models', description: 'Assumptions and frameworks shaping problem understanding' },
  // POEMS - P.O.E.M.S. Framework
  poems_people: { label: '👤 People', description: 'User personas, stakeholders, needs, behaviors, contexts' },
  poems_objects: { label: '📦 Objects', description: 'Physical/digital artifacts, products, tools, interfaces' },
  poems_environments: { label: '🌍 Environments', description: 'Physical spaces, digital contexts, social settings' },
  poems_messages: { label: '💬 Messages', description: 'Information flows, notifications, feedback, communications' },
  poems_systems: { label: '⚙️ Systems', description: 'Processes, services, technical components' },
  poems_prototypes: { label: '🎨 Prototypes', description: 'UI mockups, interaction flows, ontological design patterns' },
  // TOTEMS - Technical Infrastructure
  totems_data_architecture: { label: 'Data Architecture', description: 'Data models, storage, processing pipelines' },
  totems_security_policies: { label: 'Security Policies', description: 'Security requirements, encryption, compliance' },
  totems_access_controls: { label: 'Access Controls', description: 'Role-based access, authentication, authorization' },
  totems_system_requirements: { label: 'System Requirements', description: 'Performance, scalability, reliability needs' },
  totems_integration_points: { label: 'Integration Points', description: 'APIs, third-party services, data flows' },
  totems_technical_debt: { label: 'Technical Debt', description: 'Legacy systems, technical risks, migration needs' },
  // ANTHEMS - Market & Storytelling
  anthems_market_positioning: { label: 'Market Positioning', description: 'Competitive landscape, unique value proposition' },
  anthems_brand_narrative: { label: 'Brand Narrative', description: 'The story we tell, emotional resonance, brand voice' },
  anthems_go_to_market: { label: 'Go-to-Market', description: 'Channels, timing, launch strategy' },
  anthems_audience_segments: { label: 'Audience Segments', description: 'Target personas and how to reach them' },
  anthems_success_signals: { label: 'Success Signals', description: 'Qualitative and quantitative indicators' },
  anthems_storytelling_assets: { label: 'Storytelling Assets', description: 'Taglines, elevator pitch, anthem/manifesto' },
  // COMPILATION: Stack Implications
  stack_implications_pollens: { label: '🔧 Stack Implications', description: 'Constraints, integrations, latency requirements' },
  stack_implications_noems: { label: '🔧 Stack Implications', description: 'Data types, capabilities, candidate components' },
  stack_implications_poems: { label: '🔧 Stack Implications', description: 'UX surface, adapters, session model' },
  stack_implications_totems: { label: '🔧 Stack Implications', description: 'Logging, access control, monitoring' },
  stack_implications_anthems: { label: '🔧 Stack Implications', description: 'MVP vs V2/V3, cost tradeoffs, licensing' },
  // COMPILATION: Prompt Hooks
  prompt_hooks_pollens: { label: '🤖 Prompt Hooks', description: 'Purpose, vibe, user archetypes' },
  prompt_hooks_noems: { label: '🤖 Prompt Hooks', description: 'Ontology, entities, relationships' },
  prompt_hooks_poems: { label: '🤖 Prompt Hooks', description: 'Canonical flows, error states, guardrails' },
  prompt_hooks_totems: { label: '🤖 Prompt Hooks', description: 'Rules, never/always constraints' },
  prompt_hooks_anthems: { label: '🤖 Prompt Hooks', description: 'Phase capabilities, feature flags' }
};

const LAYER_CHECKLIST: Record<PrdLayer, { label: string; check: (content: GeneratedContent) => boolean }[]> = {
  POLLENS: [
    { label: 'Aspirations captured with emotional texture', check: (c) => (c.pollens_aspirations?.length || 0) > 100 },
    { label: 'Team dynamics and culture explored', check: (c) => !!(c.pollens_team_dynamics || c.pollens_cultural_elements) }
  ],
  NOEMS: [
    { label: 'Concepts crystallized with maturity', check: (c) => (c.noems_concepts?.length || 0) > 50 },
    { label: 'Mental models surfaced', check: (c) => !!(c.noems_mental_models || c.noems_intuitions) }
  ],
  POEMS: [
    { label: 'P.O.E.M.S. framework addressed', check: (c) => !!(c.poems_people && c.poems_objects) },
    { label: 'Systems and environments mapped', check: (c) => !!(c.poems_systems || c.poems_environments) }
  ],
  TOTEMS: [
    { label: 'Data architecture defined', check: (c) => (c.totems_data_architecture?.length || 0) > 50 },
    { label: 'Security and access controls specified', check: (c) => !!(c.totems_security_policies || c.totems_access_controls) }
  ],
  ANTHEMS: [
    { label: 'Market positioning defined', check: (c) => (c.anthems_market_positioning?.length || 0) > 50 },
    { label: 'Brand narrative crafted', check: (c) => (c.anthems_brand_narrative?.length || 0) > 50 },
    { label: 'Storytelling assets created', check: (c) => (c.anthems_storytelling_assets?.length || 0) > 30 }
  ]
};

const LAYERS: PrdLayer[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

const LAYER_ICONS: Record<PrdLayer, React.ElementType> = {
  POLLENS: Flower2,
  NOEMS: Lightbulb,
  POEMS: PenTool,
  TOTEMS: Gem,
  ANTHEMS: Music
};

const getStageForLayer = (layer: PrdLayer): PrdStage => {
  if (layer === 'POLLENS' || layer === 'NOEMS') return 'real-intelligence';
  if (layer === 'POEMS') return 'knowledge-objects';
  return 'understanding';
};

const SEASON_COLORS: Record<Season, string> = {
  POLLENS: 'bg-chart-1/10 border-chart-1/30 text-chart-1',
  NOEMS: 'bg-chart-2/10 border-chart-2/30 text-chart-2',
  POEMS: 'bg-chart-3/10 border-chart-3/30 text-chart-3',
  TOTEMS: 'bg-chart-4/10 border-chart-4/30 text-chart-4',
  ANTHEMS: 'bg-chart-5/10 border-chart-5/30 text-chart-5',
};

const SEASON_ICONS: Record<Season, React.ReactNode> = {
  POLLENS: <Flower2 className="h-4 w-4" />,
  NOEMS: <Lightbulb className="h-4 w-4" />,
  POEMS: <PenTool className="h-4 w-4" />,
  TOTEMS: <Gem className="h-4 w-4" />,
  ANTHEMS: <Music className="h-4 w-4" />,
};

const TILES_THRESHOLD = 32;
const FRAGMENTS_THRESHOLD = 5;

const RING_PATTERN_HINTS: Record<number, { type: string; hint: string }> = {
  1: { type: 'trigram', hint: 'Vertical trigrams form in the inner core' },
  2: { type: 'hexagram', hint: 'Horizontal patterns emerge in the stretch zone' },
  3: { type: 'geometric', hint: 'Geometric shapes crystallize at the edge' },
  4: { type: 'sequence', hint: 'Corner constellations complete the journey' }
};

// Unlock Progress Card Component
interface UnlockProgressCardProps {
  visitedTiles: Set<string>;
  polenCount: number;
  documentName: string;
  currentUnlockedRing: number;
  onPatternDetected?: (patterns: DetectedPattern[]) => void;
}

const UnlockProgressCard: React.FC<UnlockProgressCardProps> = ({
  visitedTiles,
  polenCount,
  documentName,
  currentUnlockedRing,
  onPatternDetected
}) => {
  const [detectedPatterns, setDetectedPatterns] = useState<DetectedPattern[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const { triggerCelebrationHaptic } = useHapticFeedback();
  
  const tilesCount = visitedTiles.size;
  const isUnlocked = tilesCount >= TILES_THRESHOLD && polenCount >= FRAGMENTS_THRESHOLD;
  const tilesProgress = Math.min((tilesCount / TILES_THRESHOLD) * 100, 100);
  const fragmentsProgress = Math.min((polenCount / FRAGMENTS_THRESHOLD) * 100, 100);
  const tilesRemaining = Math.max(TILES_THRESHOLD - tilesCount, 0);
  const fragmentsRemaining = Math.max(FRAGMENTS_THRESHOLD - polenCount, 0);
  
  const ringHint = RING_PATTERN_HINTS[currentUnlockedRing] || RING_PATTERN_HINTS[1];
  
  const handleScanPatterns = useCallback(() => {
    setIsScanning(true);
    
    setTimeout(() => {
      const patterns = detectPatterns(visitedTiles, 0); // No threshold for detection
      setDetectedPatterns(patterns);
      
      if (patterns.length > 0) {
        triggerCelebrationHaptic();
        try {
          const audio = new Audio('/sounds/pattern-discovered.mp3');
          audio.volume = 0.3;
          audio.play().catch(() => {});
        } catch {}
        
        toast.success(`✨ ${patterns.length} pattern${patterns.length > 1 ? 's' : ''} detected!`);
      } else {
        toast.info('No patterns detected yet. Keep exploring!');
      }
      
      onPatternDetected?.(patterns);
      setIsScanning(false);
    }, 500);
  }, [visitedTiles, onPatternDetected, triggerCelebrationHaptic]);
  
  return (
    <Card className="mx-4 mt-3 mb-1 border-dashed">
      <CardContent className="p-3">
        <div className="flex items-center gap-3">
          {isUnlocked ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
          ) : (
            <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
          )}
          
          <div className="flex-1 min-w-0 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">
                {documentName} {isUnlocked ? 'Unlocked' : 'Progress'}
              </span>
              <Badge variant={isUnlocked ? 'default' : 'outline'} className="text-xs shrink-0">
                {tilesCount}/{TILES_THRESHOLD} tiles • {polenCount}/{FRAGMENTS_THRESHOLD} fragments
              </Badge>
            </div>
            
            {!isUnlocked && (
              <>
                <div className="flex gap-2">
                  <Progress value={tilesProgress} className="h-1.5 flex-1" />
                  <Progress value={fragmentsProgress} className="h-1.5 flex-1" />
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {tilesRemaining > 0 && fragmentsRemaining > 0 && (
                    <>Visit {tilesRemaining} more tile{tilesRemaining !== 1 ? 's' : ''} and capture {fragmentsRemaining} more fragment{fragmentsRemaining !== 1 ? 's' : ''}</>
                  )}
                  {tilesRemaining > 0 && fragmentsRemaining === 0 && (
                    <>Visit {tilesRemaining} more tile{tilesRemaining !== 1 ? 's' : ''} to unlock</>
                  )}
                  {tilesRemaining === 0 && fragmentsRemaining > 0 && (
                    <>Capture {fragmentsRemaining} more fragment{fragmentsRemaining !== 1 ? 's' : ''} to unlock</>
                  )}
                </p>
              </>
            )}
          </div>
          
          {/* Pattern Detection - Always visible */}
          <div className="flex items-center gap-2 shrink-0">
            {detectedPatterns.length > 0 && (
              <Badge 
                variant="secondary" 
                className="px-2 py-1 text-xs cursor-pointer hover:opacity-80"
                style={{ 
                  backgroundColor: `${getPatternColor(detectedPatterns[0].type)}20`,
                  borderColor: getPatternColor(detectedPatterns[0].type),
                  color: getPatternColor(detectedPatterns[0].type)
                }}
              >
                {detectedPatterns[0].icon} {detectedPatterns[0].name}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Ring-aware pattern hint */}
        <div className="mt-2 flex items-center gap-2 text-[10px] text-muted-foreground">
          <Hexagon className="w-3 h-3" />
          <span>Ring {currentUnlockedRing}: {ringHint.hint}</span>
        </div>
      </CardContent>
    </Card>
  );
};

interface PrdAssemblyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  prdId: string | null;
  onGenerateLayer: (season: Season) => Promise<void>;
  onPrdCreated?: (prdId: string) => void;
  // New props for unlock progress
  visitedTiles?: Set<string>;
  polenCount?: number;
  userId?: string;
  currentUnlockedRing?: number;
  onPatternDetected?: (patterns: any[]) => void;
}

export const PrdAssemblyPanel: React.FC<PrdAssemblyPanelProps> = ({
  isOpen,
  onClose,
  currentSeason,
  seasonProgress,
  completedSeasons,
  prdId,
  onGenerateLayer,
  onPrdCreated,
  visitedTiles = new Set(),
  polenCount = 0,
  userId,
  currentUnlockedRing = 1,
  onPatternDetected
}) => {
  const navigate = useNavigate();
  const { mode } = useMode();
  const [prdData, setPrdData] = useState<Record<string, any> | null>(null);
  const [polenEntries, setPolenEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'layers' | 'dimensions' | 'csuite' | 'compilation'>('layers');
  const [showFullPreview, setShowFullPreview] = useState(false);
  
  // Wizard state
  const [currentLayer, setCurrentLayer] = useState<PrdLayer>(currentSeason as PrdLayer);
  const [completedLayers, setCompletedLayers] = useState<PrdLayer[]>([]);
  const [generatingLayer, setGeneratingLayer] = useState<PrdLayer | null>(null);
  const [content, setContent] = useState<GeneratedContent>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [showQualityReview, setShowQualityReview] = useState(false);
  const [title, setTitle] = useState(`Calm Magic PRD — ${new Date().toLocaleDateString()}`);
  const [saving, setSaving] = useState(false);
  const [autoSaving, setAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isCreatingPrd, setIsCreatingPrd] = useState(false);
  const [isCompiling, setIsCompiling] = useState(false);
  
  // Refs for auto-save debouncing
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout>();
  const contentRef = useRef(content);
  contentRef.current = content;
  
  const { tier } = useSubscription();
  const canAccessCSuite = hasFeatureAccess(tier, 'csuite_dashboard');
  const canAccessCompilation = hasFeatureAccess(tier, 'compilation_tab');
  const canExportPdf = hasFeatureAccess(tier, 'pdf_export');
  
  const isPersonal = mode === 'personal';
  const documentName = isPersonal ? 'RRD' : 'PRD';

  // Check if there's any content worth saving
  const hasAnyContent = useMemo(() => 
    LAYERS.some(layer => 
      LAYER_FIELDS[layer].some(field => content[field] && String(content[field]).trim().length > 0)
    ) || title.trim().length > 0,
  [content, title]);

  // Track if we've attempted auto-creation to prevent loops
  const autoCreateAttemptedRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      fetchPrdData();
      fetchPolenEntries();
    } else {
      // Reset auto-create flag when panel closes
      autoCreateAttemptedRef.current = false;
    }
  }, [isOpen, prdId]);

  // Auto-create PRD when panel opens with fragments but no prdId
  useEffect(() => {
    const autoCreatePrd = async () => {
      if (!isOpen || prdId || autoCreateAttemptedRef.current || polenEntries.length === 0) return;
      
      autoCreateAttemptedRef.current = true;
      
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: newPrd, error } = await supabase
          .from('prds')
          .insert({
            owner_id: user.id,
            title: `${isPersonal ? 'RRD' : 'PRD'} — ${new Date().toLocaleDateString()}`,
            status: 'draft',
            prototype_stage: 'B_DIEGETIC',
          })
          .select()
          .single();

        if (error) throw error;
        
        onPrdCreated?.(newPrd.id);
        toast.success(`${isPersonal ? 'RRD' : 'PRD'} created from your ${polenEntries.length} fragments`);
      } catch (err) {
        console.error('Failed to auto-create PRD:', err);
      }
    };

    autoCreatePrd();
  }, [isOpen, prdId, polenEntries.length, isPersonal, onPrdCreated]);

  // Update title from prdData
  useEffect(() => {
    if (prdData?.title) {
      setTitle(prdData.title);
    }
  }, [prdData]);

  // Map PRD data to wizard content format
  useEffect(() => {
    if (prdData) {
      // Map PRD data - prefer NEW columns, fallback to OLD columns for backwards compatibility
      const mapped: GeneratedContent = {
        // POLLENS - Relational & Cultural (new columns first, fallback to old)
        pollens_aspirations: prdData.pollens_aspirations || prdData.love_signals_summary || '',
        pollens_team_dynamics: prdData.pollens_team_dynamics || '',
        pollens_cultural_elements: prdData.pollens_cultural_elements || '',
        pollens_relational_patterns: prdData.pollens_relational_patterns || '',
        pollens_constraints: prdData.pollens_constraints || '',
        pollens_stakes: prdData.pollens_stakes || prdData.love_decision_to_exist || '',
        // NOEMS - Conceptual
        noems_concepts: prdData.noems_concepts || prdData.magic_prd_outline || '',
        noems_shared_ideas: prdData.noems_shared_ideas || prdData.magic_hypotheses || '',
        noems_intuitions: prdData.noems_intuitions || prdData.magic_patterns || '',
        noems_mental_models: prdData.noems_mental_models || '',
        // POEMS - P.O.E.M.S. framework
        poems_people: prdData.poems_people || prdData.magic_storyworld || '',
        poems_objects: prdData.poems_objects || '',
        poems_environments: prdData.poems_environments || '',
        poems_messages: prdData.poems_messages || '',
        poems_systems: prdData.poems_systems || prdData.open_real_workflow || '',
        poems_prototypes: prdData.poems_prototypes || '',
        // TOTEMS - Technical Infrastructure
        totems_data_architecture: prdData.totems_data_architecture || prdData.calm_requirements || '',
        totems_security_policies: prdData.totems_security_policies || '',
        totems_access_controls: prdData.totems_access_controls || '',
        totems_system_requirements: prdData.totems_system_requirements || prdData.calm_risks_and_limits || '',
        totems_integration_points: prdData.totems_integration_points || prdData.open_ontology_and_graph || '',
        totems_technical_debt: prdData.totems_technical_debt || '',
        // ANTHEMS - Market & Storytelling
        anthems_market_positioning: prdData.anthems_market_positioning || prdData.free_totem_anthem || '',
        anthems_brand_narrative: prdData.anthems_brand_narrative || prdData.free_next_cycle_hooks || '',
        anthems_go_to_market: prdData.anthems_go_to_market || prdData.free_first_poem_description || '',
        anthems_audience_segments: prdData.anthems_audience_segments || '',
        anthems_success_signals: prdData.anthems_success_signals || prdData.free_success_criteria || '',
        anthems_storytelling_assets: prdData.anthems_storytelling_assets || prdData.open_adjustment_plan || '',
        // Stack implications & prompt hooks
        stack_implications_pollens: prdData.stack_implications_pollens || '',
        stack_implications_noems: prdData.stack_implications_noems || '',
        stack_implications_poems: prdData.stack_implications_poems || '',
        stack_implications_totems: prdData.stack_implications_totems || '',
        stack_implications_anthems: prdData.stack_implications_anthems || '',
        prompt_hooks_pollens: prdData.prompt_hooks_pollens || '',
        prompt_hooks_noems: prdData.prompt_hooks_noems || '',
        prompt_hooks_poems: prdData.prompt_hooks_poems || '',
        prompt_hooks_totems: prdData.prompt_hooks_totems || '',
        prompt_hooks_anthems: prdData.prompt_hooks_anthems || '',
      };
      setContent(mapped);
      
      // Mark layers with content as completed
      const completed: PrdLayer[] = [];
      LAYERS.forEach(layer => {
        const hasContent = LAYER_FIELDS[layer].some(f => mapped[f] && String(mapped[f]).trim().length > 0);
        if (hasContent) completed.push(layer);
      });
      setCompletedLayers(completed);
    }
  }, [prdData]);

  const fetchPrdData = async () => {
    if (!prdId) {
      setPrdData(null);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('prds')
        .select('*')
        .eq('id', prdId)
        .single();

      if (error) throw error;
      setPrdData(data);
    } catch (err) {
      console.error('Failed to fetch PRD:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPolenEntries = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('polen_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPolenEntries(data || []);
    } catch (err) {
      console.error('Failed to fetch polen entries:', err);
    }
  };

  // Wizard navigation helpers
  const currentIndex = LAYERS.indexOf(currentLayer);
  const isFirstLayer = currentIndex === 0;
  const isLastLayer = currentIndex === LAYERS.length - 1;
  const CurrentIcon = LAYER_ICONS[currentLayer];
  const currentStage = getStageForLayer(currentLayer);

  const layerHasContent = () => {
    const fields = LAYER_FIELDS[currentLayer];
    return fields.some(field => content[field] && String(content[field]).trim().length > 0);
  };

  // Auto-save PRD function
  const autoSavePrd = useCallback(async (silent = true): Promise<string | null> => {
    // Check if there's any content to save
    const hasAnyContent = LAYERS.some(layer => 
      LAYER_FIELDS[layer].some(field => contentRef.current[field] && String(contentRef.current[field]).trim().length > 0)
    );
    
    if (!hasAnyContent) return null;
    
    setAutoSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Direct column mapping - each field saves to its own column (no concatenation!)
      const prdPayload = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        // POLLENS - Direct mapping to new columns
        pollens_aspirations: contentRef.current.pollens_aspirations,
        pollens_team_dynamics: contentRef.current.pollens_team_dynamics,
        pollens_cultural_elements: contentRef.current.pollens_cultural_elements,
        pollens_relational_patterns: contentRef.current.pollens_relational_patterns,
        pollens_constraints: contentRef.current.pollens_constraints,
        pollens_stakes: contentRef.current.pollens_stakes,
        // NOEMS - Direct mapping
        noems_concepts: contentRef.current.noems_concepts,
        noems_shared_ideas: contentRef.current.noems_shared_ideas,
        noems_intuitions: contentRef.current.noems_intuitions,
        noems_mental_models: contentRef.current.noems_mental_models,
        // POEMS - P.O.E.M.S. framework (all 6 fields)
        poems_people: contentRef.current.poems_people,
        poems_objects: contentRef.current.poems_objects,
        poems_environments: contentRef.current.poems_environments,
        poems_messages: contentRef.current.poems_messages,
        poems_systems: contentRef.current.poems_systems,
        poems_prototypes: contentRef.current.poems_prototypes,
        // TOTEMS - Technical infrastructure (all 6 fields)
        totems_data_architecture: contentRef.current.totems_data_architecture,
        totems_security_policies: contentRef.current.totems_security_policies,
        totems_access_controls: contentRef.current.totems_access_controls,
        totems_system_requirements: contentRef.current.totems_system_requirements,
        totems_integration_points: contentRef.current.totems_integration_points,
        totems_technical_debt: contentRef.current.totems_technical_debt,
        // ANTHEMS - Market & storytelling (all 6 fields)
        anthems_market_positioning: contentRef.current.anthems_market_positioning,
        anthems_brand_narrative: contentRef.current.anthems_brand_narrative,
        anthems_go_to_market: contentRef.current.anthems_go_to_market,
        anthems_audience_segments: contentRef.current.anthems_audience_segments,
        anthems_success_signals: contentRef.current.anthems_success_signals,
        anthems_storytelling_assets: contentRef.current.anthems_storytelling_assets,
        // Stack implications & prompt hooks
        stack_implications_pollens: contentRef.current.stack_implications_pollens,
        stack_implications_noems: contentRef.current.stack_implications_noems,
        stack_implications_poems: contentRef.current.stack_implications_poems,
        stack_implications_totems: contentRef.current.stack_implications_totems,
        stack_implications_anthems: contentRef.current.stack_implications_anthems,
        prompt_hooks_pollens: contentRef.current.prompt_hooks_pollens,
        prompt_hooks_noems: contentRef.current.prompt_hooks_noems,
        prompt_hooks_poems: contentRef.current.prompt_hooks_poems,
        prompt_hooks_totems: contentRef.current.prompt_hooks_totems,
        prompt_hooks_anthems: contentRef.current.prompt_hooks_anthems,
      };

      let savedId = prdId;

      if (prdId) {
        await supabase.from('prds').update(prdPayload).eq('id', prdId);
      } else {
        const { data: newPrd, error } = await supabase
          .from('prds')
          .insert(prdPayload as any)
          .select()
          .single();
        if (error) throw error;
        savedId = newPrd.id;
        onPrdCreated?.(newPrd.id);
      }
      
      setLastSaved(new Date());
      if (!silent) {
        toast.success(`${documentName} saved`);
      }
      
      return savedId;
    } catch (error) {
      console.error('Auto-save error:', error);
      if (!silent) {
        toast.error('Could not save. Please try again.');
      }
      return null;
    } finally {
      setAutoSaving(false);
    }
  }, [prdId, title, documentName, onPrdCreated]);

  // Debounced auto-save on content changes
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    // Only debounce auto-save if there's content
    const hasAnyContent = LAYERS.some(layer => 
      LAYER_FIELDS[layer].some(field => content[field] && String(content[field]).trim().length > 0)
    );
    
    if (hasAnyContent) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        autoSavePrd(true);
      }, 5000); // 5 second debounce for manual edits
    }
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [content, autoSavePrd]);

  // Generate content for current layer
  const generateLayerContent = async () => {
    setGeneratingLayer(currentLayer);
    try {
      const { data, error } = await supabase.functions.invoke('generate-prd-stage', {
        body: {
          layer: currentLayer,
          polenEntries: polenEntries.map(p => ({
            content: p.content,
            tile_id: p.tile_id,
            tags: p.tags
          })),
          board: currentLayer,
          existingContent: content
        }
      });

      if (error) throw error;

      const newContent = { ...content, ...data.content };
      setContent(newContent);
      
      // Mark layer as completed
      if (!completedLayers.includes(currentLayer)) {
        setCompletedLayers(prev => [...prev, currentLayer]);
      }
      
      // Auto-save immediately after generation
      contentRef.current = newContent;
      await autoSavePrd(true);
      
      toast.success(`${currentLayer} layer generated and saved`);
    } catch (error) {
      console.error('Generation error:', error);
      toast.error('Could not generate content. Please try again.');
    } finally {
      setGeneratingLayer(null);
    }
  };

  // Create a new PRD
  const handleCreatePrd = async () => {
    setIsCreatingPrd(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to create a document');
        return;
      }

      const { data: newPrd, error } = await supabase
        .from('prds')
        .insert({
          owner_id: user.id,
          title: `${documentName} — ${new Date().toLocaleDateString()}`,
          status: 'draft',
          prototype_stage: 'B_DIEGETIC',
        })
        .select()
        .single();

      if (error) throw error;

      onPrdCreated?.(newPrd.id);
      setTitle(newPrd.title);
      toast.success(`${documentName} created`);
    } catch (error) {
      console.error('Failed to create PRD:', error);
      toast.error('Failed to create document');
    } finally {
      setIsCreatingPrd(false);
    }
  };

  // Compile PRD content from POLEN entries
  const handleCompileFromPolen = async () => {
    setIsCompiling(true);
    try {
      // Generate content for all layers sequentially
      for (const layer of LAYERS) {
        const layerPolen = polenEntries.filter(p => 
          p.season_context === layer || p.tags?.includes(layer) || 
          // Default untagged entries to POLLENS
          (!p.season_context && layer === 'POLLENS')
        );
        
        // Only generate if there are relevant POLEN entries
        if (layerPolen.length > 0 || layer === 'POLLENS') {
          const { data, error } = await supabase.functions.invoke('generate-prd-stage', {
            body: {
              layer,
              polenEntries: (layerPolen.length > 0 ? layerPolen : polenEntries).map(p => ({
                content: p.content,
                tile_id: p.tile_id,
                tags: p.tags
              })),
              board: layer,
              existingContent: content
            }
          });

          if (error) {
            console.error(`Failed to generate ${layer}:`, error);
            continue;
          }

          setContent(prev => ({ ...prev, ...data.content }));
          contentRef.current = { ...contentRef.current, ...data.content };
        }
      }
      
      // Save everything
      await autoSavePrd(true);
      setCompletedLayers(LAYERS);
      toast.success(`${documentName} compiled from ${polenEntries.length} fragments`);
    } catch (error) {
      console.error('Compilation error:', error);
      toast.error('Failed to compile content. Please try again.');
    } finally {
      setIsCompiling(false);
    }
  };

  // Layer switch with auto-save
  const handleLayerSwitch = async (targetLayer: PrdLayer) => {
    // Save current layer's content before switching
    if (layerHasContent()) {
      await autoSavePrd(true);
      if (!completedLayers.includes(currentLayer)) {
        setCompletedLayers(prev => [...prev, currentLayer]);
      }
    }
    setCurrentLayer(targetLayer);
  };

  const handleNext = async () => {
    if (!layerHasContent()) {
      toast.error('Please generate or add content before proceeding');
      return;
    }
    if (!isLastLayer) {
      await handleLayerSwitch(LAYERS[currentIndex + 1]);
    }
  };

  const handleBack = async () => {
    if (!isFirstLayer) {
      await handleLayerSwitch(LAYERS[currentIndex - 1]);
    }
  };

  const updateField = (field: keyof GeneratedContent, value: string) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const handleSavePrd = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Direct column mapping - each field saves to its own column (no concatenation!)
      const prdPayload = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        // POLLENS - Direct mapping to new columns
        pollens_aspirations: content.pollens_aspirations,
        pollens_team_dynamics: content.pollens_team_dynamics,
        pollens_cultural_elements: content.pollens_cultural_elements,
        pollens_relational_patterns: content.pollens_relational_patterns,
        pollens_constraints: content.pollens_constraints,
        pollens_stakes: content.pollens_stakes,
        // NOEMS - Direct mapping
        noems_concepts: content.noems_concepts,
        noems_shared_ideas: content.noems_shared_ideas,
        noems_intuitions: content.noems_intuitions,
        noems_mental_models: content.noems_mental_models,
        // POEMS - P.O.E.M.S. framework (all 6 fields)
        poems_people: content.poems_people,
        poems_objects: content.poems_objects,
        poems_environments: content.poems_environments,
        poems_messages: content.poems_messages,
        poems_systems: content.poems_systems,
        poems_prototypes: content.poems_prototypes,
        // TOTEMS - Technical infrastructure (all 6 fields)
        totems_data_architecture: content.totems_data_architecture,
        totems_security_policies: content.totems_security_policies,
        totems_access_controls: content.totems_access_controls,
        totems_system_requirements: content.totems_system_requirements,
        totems_integration_points: content.totems_integration_points,
        totems_technical_debt: content.totems_technical_debt,
        // ANTHEMS - Market & storytelling (all 6 fields)
        anthems_market_positioning: content.anthems_market_positioning,
        anthems_brand_narrative: content.anthems_brand_narrative,
        anthems_go_to_market: content.anthems_go_to_market,
        anthems_audience_segments: content.anthems_audience_segments,
        anthems_success_signals: content.anthems_success_signals,
        anthems_storytelling_assets: content.anthems_storytelling_assets,
        // Stack implications & prompt hooks
        stack_implications_pollens: content.stack_implications_pollens,
        stack_implications_noems: content.stack_implications_noems,
        stack_implications_poems: content.stack_implications_poems,
        stack_implications_totems: content.stack_implications_totems,
        stack_implications_anthems: content.stack_implications_anthems,
        prompt_hooks_pollens: content.prompt_hooks_pollens,
        prompt_hooks_noems: content.prompt_hooks_noems,
        prompt_hooks_poems: content.prompt_hooks_poems,
        prompt_hooks_totems: content.prompt_hooks_totems,
        prompt_hooks_anthems: content.prompt_hooks_anthems,
      };

      if (prdId) {
        await supabase.from('prds').update(prdPayload).eq('id', prdId);
        toast.success('PRD updated successfully');
      } else {
        const { data: newPrd, error } = await supabase
          .from('prds')
          .insert(prdPayload as any)
          .select()
          .single();
        if (error) throw error;
        toast.success('Calm Magic PRD Created!');
      }
      
      await fetchPrdData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Could not save PRD. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Progress calculations
  const contentFields = LAYERS.flatMap(layer => 
    LAYER_FIELDS[layer].filter(f => !f.startsWith('stack_') && !f.startsWith('prompt_'))
  );
  const totalFields = contentFields.length;
  const filledFields = contentFields.filter(field => {
    const value = content[field];
    return typeof value === 'string' && value.trim();
  }).length;
  const progressPercentage = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;

  const checklistItems = LAYER_CHECKLIST[currentLayer];

  const handleCopyPreview = () => {
    const markdown = LAYERS.map(layer => {
      const layerContent = LAYER_FIELDS[layer]
        .filter(field => content[field])
        .map(field => `### ${WIZARD_FIELD_LABELS[field]?.label || field}\n${content[field]}`)
        .join('\n\n');
      
      return layerContent ? `## ${layer}\n\n${layerContent}` : `## ${layer}\n\n*Not generated yet*`;
    }).join('\n\n---\n\n');

    navigator.clipboard.writeText(`# ${title}\n\n${markdown}`);
    toast.success(`${documentName} copied to clipboard`);
  };

  // Get filtered Polen for current layer
  const currentLayerPolen = polenEntries.filter(p => 
    p.season_context === currentLayer || p.tags?.includes(currentLayer)
  );

  if (!isOpen) return null;

  return (
    <div className="h-full flex flex-col bg-background rounded-lg border border-border shadow-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-lg font-semibold">Living {documentName} Assembly</h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{completedLayers.length}/{LAYERS.length} layers • {progressPercentage}% complete</span>
              <Badge 
                variant="secondary" 
                className={cn(
                  "text-xs font-normal",
                  polenEntries.length >= 50 && "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
                  polenEntries.length >= 10 && polenEntries.length < 50 && "bg-amber-500/20 text-amber-600 dark:text-amber-400",
                  polenEntries.length < 10 && "bg-muted text-muted-foreground"
                )}
              >
                <Layers className="h-3 w-3 mr-1" />
                {polenEntries.length} fragments
              </Badge>
              {autoSaving && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {!autoSaving && lastSaved && (
                <span className="flex items-center gap-1 text-emerald-500">
                  <Cloud className="h-3 w-3" />
                  Saved
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Contextual PRD Action Button */}
          {!prdId ? (
            // No PRD exists - show Create button
            <Button
              variant="default"
              size="sm"
              onClick={handleCreatePrd}
              disabled={isCreatingPrd}
              className="h-7 px-3 text-xs"
            >
              {isCreatingPrd ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <FileText className="h-3 w-3 mr-1" />
              )}
              Create {documentName}
            </Button>
          ) : filledFields === 0 && polenEntries.length > 0 ? (
            // PRD exists but empty, has POLEN - show Compile button
            <Button
              variant="default"
              size="sm"
              onClick={handleCompileFromPolen}
              disabled={isCompiling}
              className="h-7 px-3 text-xs bg-amber-500 hover:bg-amber-600"
            >
              {isCompiling ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              Compile from {polenEntries.length} Fragments
            </Button>
          ) : (
            // Has content - show Save button
            <Button
              variant="ghost"
              size="sm"
              onClick={() => autoSavePrd(false)}
              disabled={autoSaving || !hasAnyContent}
              className="h-7 px-2 text-xs"
            >
              {autoSaving ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <>
                  <Cloud className="h-3 w-3 mr-1" />
                  Save Now
                </>
              )}
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFullPreview(true)}
            disabled={filledFields === 0 && polenEntries.length === 0}
            title={filledFields === 0 ? 'Compile content first to preview' : 'Preview document'}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Preview
          </Button>
          {prdId && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate(`/prds/${prdId}`)}
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1" />
              Editor
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="h-full flex flex-col">
          <TabsList className="w-full justify-start px-4 pt-2 shrink-0">
            <TabsTrigger value="layers" className="text-xs">
              <Layers className="h-3.5 w-3.5 mr-1" />
              Wizard
            </TabsTrigger>
            <TabsTrigger value="dimensions" className="text-xs">
              <Eye className="h-3.5 w-3.5 mr-1" />
              Dimensions
            </TabsTrigger>
            <TabsTrigger value="csuite" className="text-xs relative">
              <Briefcase className="h-3.5 w-3.5 mr-1" />
              C-Suite
              {!canAccessCSuite && <Lock className="h-3 w-3 ml-1 text-amber-500" />}
            </TabsTrigger>
            <TabsTrigger value="compilation" className="text-xs relative">
              <Zap className="h-3.5 w-3.5 mr-1" />
              Compilation
              {!canAccessCompilation && <Lock className="h-3 w-3 ml-1 text-amber-500" />}
            </TabsTrigger>
          </TabsList>

          {/* Unlock Progress Card - Always visible */}
          <UnlockProgressCard 
            visitedTiles={visitedTiles}
            polenCount={polenCount}
            documentName={documentName}
            currentUnlockedRing={currentUnlockedRing}
            onPatternDetected={onPatternDetected}
          />

          <TabsContent value="layers" className="flex-1 overflow-hidden p-0 m-0">
            <div className="h-full flex flex-col">
              {/* Wizard Header: Layer Navigation */}
              <div className="p-4 border-b border-border/50 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CurrentIcon className="w-5 h-5 text-primary" />
                    <span className="font-semibold">{currentLayer}</span>
                    <Badge variant="outline" className="text-xs">
                      {currentLayerPolen.length} fragments
                    </Badge>
                  </div>
                  
                  {/* Layer Pills */}
                  <div className="flex items-center gap-1">
                    {LAYERS.map((layer, idx) => {
                      const isCompleted = completedLayers.includes(layer);
                      const isCurrent = layer === currentLayer;
                      const LayerIcon = LAYER_ICONS[layer];
                      const canNavigate = isCompleted || isCurrent || idx <= completedLayers.length;
                      
                      return (
                        <button
                          key={layer}
                          onClick={() => canNavigate && handleLayerSwitch(layer)}
                          disabled={!canNavigate}
                          className={`flex items-center justify-center w-7 h-7 rounded-full transition-all ${
                            isCompleted ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                              : isCurrent ? 'bg-primary text-primary-foreground ring-2 ring-primary/30' 
                              : canNavigate ? 'bg-muted text-muted-foreground hover:bg-muted/80'
                              : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
                          }`}
                          title={layer}
                        >
                          {isCompleted ? <Check className="w-3.5 h-3.5" /> : <LayerIcon className="w-3.5 h-3.5" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
                
                {/* Title Input */}
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="font-medium"
                  placeholder={`${documentName} Title...`}
                />
                
                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Overall Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-1.5" />
                </div>
              </div>
              
              {/* Main Wizard Content */}
              <div className="flex-1 flex min-h-0 overflow-hidden">
                {/* Left: Fields */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4 pr-2">
                    {/* Polen Preview for POLLENS layer */}
                    {currentLayer === 'POLLENS' && !layerHasContent() && currentLayerPolen.length > 0 && (
                      <Card className="p-4 bg-amber-500/10 border-amber-500/30">
                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Raw signals from your journey ({currentLayerPolen.length} entries)
                        </h4>
                        <div className="space-y-2 max-h-32 overflow-y-auto">
                          {currentLayerPolen.slice(0, 5).map(polen => (
                            <div key={polen.id} className="text-xs p-2 bg-background rounded border">
                              {polen.content.slice(0, 100)}...
                            </div>
                          ))}
                          {currentLayerPolen.length > 5 && (
                            <div className="text-xs text-muted-foreground">+{currentLayerPolen.length - 5} more</div>
                          )}
                        </div>
                      </Card>
                    )}

                    {polenEntries.length === 0 && (
                      <Card className="p-3 bg-amber-500/10 border-amber-500/30">
                        <p className="text-sm text-amber-600 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          No fragments captured yet. Visit tiles and capture insights first for richer {documentName} generation.
                        </p>
                      </Card>
                    )}

                    {/* Field Cards */}
                    {LAYER_FIELDS[currentLayer].map(field => {
                      const fieldInfo = WIZARD_FIELD_LABELS[field] || { label: field, description: '' };
                      const value = content[field] || '';
                      const isEditing = editingField === field;

                      return (
                        <Card key={field} className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="font-semibold text-sm">{fieldInfo.label}</h4>
                              <p className="text-xs text-muted-foreground">{fieldInfo.description}</p>
                            </div>
                            {value && (
                              <Button size="sm" variant="ghost" onClick={() => setEditingField(isEditing ? null : field)}>
                                {isEditing ? <Check className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                              </Button>
                            )}
                          </div>
                          
                          {value ? (
                            isEditing ? (
                              <Textarea value={value} onChange={(e) => updateField(field, e.target.value)} className="min-h-[100px]" />
                            ) : (
                              <div className="text-sm whitespace-pre-wrap bg-muted/50 p-3 rounded-lg">{value}</div>
                            )
                          ) : (
                            <div className="text-sm text-muted-foreground italic p-3 bg-muted/30 rounded-lg border-2 border-dashed">
                              Content will be generated...
                            </div>
                          )}
                        </Card>
                      );
                    })}

                    {/* Checklist */}
                    <Card className="p-4 border-dashed">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        {currentLayer} Checklist
                      </h4>
                      <div className="space-y-2">
                        {checklistItems.map((item, idx) => {
                          const isChecked = item.check(content);
                          return (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              {isChecked ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Circle className="w-4 h-4 text-muted-foreground" />}
                              <span className={isChecked ? 'text-foreground' : 'text-muted-foreground'}>{item.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  </div>
                </ScrollArea>
                
                {/* Right: Stack + Quality */}
                <div className="w-64 shrink-0 border-l border-border/50 p-4 space-y-4 overflow-y-auto hidden lg:block">
                  <PrdEducationPanel />
                  <StackFormation completedLayers={completedLayers} currentLayer={currentLayer} />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => setShowQualityReview(!showQualityReview)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    {showQualityReview ? 'Hide' : 'Show'} Quality Review
                  </Button>
                  
                  {showQualityReview && (
                    <FeminineSafePRD reviewMode currentStage={currentStage} showAntiPatterns={false} />
                  )}
                </div>
              </div>
              
              {/* Footer: Navigation */}
              <div className="p-4 border-t border-border shrink-0 flex items-center justify-between">
                <Button variant="outline" onClick={handleBack} disabled={isFirstLayer}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>

                <div className="flex items-center gap-2">
                  <Button 
                    onClick={generateLayerContent} 
                    disabled={generatingLayer !== null} 
                    variant="outline"
                  >
                    {generatingLayer === currentLayer ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Generate {currentLayer}
                  </Button>

                  {isLastLayer && completedLayers.length === LAYERS.length - 1 ? (
                    <Button onClick={handleSavePrd} disabled={saving || !layerHasContent()}>
                      {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save {documentName}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!layerHasContent()}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dimensions" className="flex-1 overflow-auto p-4">
            <PrdDimensionalView
              seasonProgress={seasonProgress as Record<string, Set<string>>}
              completedSeasons={completedSeasons}
              prdData={prdData}
            />
          </TabsContent>

          <TabsContent value="csuite" className="flex-1 overflow-auto p-4">
            <FeatureGate feature="csuite_dashboard">
              <CSuiteDashboard
                seasonProgress={Object.fromEntries(
                  Object.entries(seasonProgress).map(([k, v]) => [k, new Set([...v].map(Number))])
                ) as Record<string, Set<number>>}
                prdData={prdData}
                currentSeason={currentSeason}
              />
            </FeatureGate>
          </TabsContent>

          <TabsContent value="compilation" className="flex-1 overflow-auto p-4">
            <FeatureGate feature="compilation_tab">
              <CompilationTab
                projectName={title}
                stackImplications={{
                  stack_implications_pollens: content.stack_implications_pollens || '',
                  stack_implications_noems: content.stack_implications_noems || '',
                  stack_implications_poems: content.stack_implications_poems || '',
                  stack_implications_totems: content.stack_implications_totems || '',
                  stack_implications_anthems: content.stack_implications_anthems || '',
                }}
                promptHooks={{
                  prompt_hooks_pollens: content.prompt_hooks_pollens || '',
                  prompt_hooks_noems: content.prompt_hooks_noems || '',
                  prompt_hooks_poems: content.prompt_hooks_poems || '',
                  prompt_hooks_totems: content.prompt_hooks_totems || '',
                  prompt_hooks_anthems: content.prompt_hooks_anthems || '',
                }}
                completedLayers={completedLayers as Season[]}
                onNavigateToLayer={(season) => {
                  setActiveTab('layers');
                  setCurrentLayer(season as PrdLayer);
                }}
              />
            </FeatureGate>
          </TabsContent>
        </Tabs>
      </div>

      {/* Full Preview Sheet */}
      <Sheet open={showFullPreview} onOpenChange={setShowFullPreview}>
        <SheetContent side="right" className="w-full max-w-2xl sm:max-w-xl flex flex-col p-0">
          <SheetHeader className="p-4 border-b border-border shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              {title} - Full {documentName}
            </SheetTitle>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {filledFields} of {totalFields} fields • {completedLayers.length} of {LAYERS.length} layers
                </span>
                <Badge 
                  variant="outline" 
                  className={
                    progressPercentage >= 100 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' 
                      : progressPercentage >= 50 
                        ? 'bg-blue-500/10 text-blue-500 border-blue-500/30'
                        : 'bg-amber-500/10 text-amber-500 border-amber-500/30'
                  }
                >
                  {progressPercentage}%
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          </SheetHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {LAYERS.map(layer => {
                const LayerIcon = LAYER_ICONS[layer];
                const isCompleted = completedLayers.includes(layer);
                const layerFields = LAYER_FIELDS[layer].filter(f => !f.startsWith('stack_') && !f.startsWith('prompt_'));
                const hasContent = layerFields.some(f => content[f]);
                
                return (
                  <div key={layer} className="space-y-3">
                    <h3 className="font-semibold flex items-center gap-2 text-lg border-b pb-2">
                      <LayerIcon className="w-5 h-5" />
                      {layer}
                      {isCompleted && <Check className="w-4 h-4 text-emerald-500 ml-auto" />}
                    </h3>
                    
                    {hasContent ? (
                      layerFields.map(field => {
                        const value = content[field];
                        if (!value) return null;
                        return (
                          <div key={field} className="bg-muted/30 p-3 rounded-lg text-sm">
                            <p className="font-medium text-xs text-muted-foreground mb-1">
                              {WIZARD_FIELD_LABELS[field]?.label || field}
                            </p>
                            <p className="whitespace-pre-wrap">{value}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground italic py-2">Not generated yet</p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>

          <SheetFooter className="p-4 border-t border-border shrink-0 bg-muted/30">
            <Button variant="outline" onClick={handleCopyPreview} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy as Markdown
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default PrdAssemblyPanel;
