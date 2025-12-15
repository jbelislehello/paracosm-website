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
import { PRD_STAGES, PrdStage } from '@/types/journal-expansion';

// Wizard-specific types and constants
interface GeneratedContent {
  pollens_observations?: string;
  pollens_biases?: string;
  pollens_cultural_issues?: string;
  pollens_prd_shadows?: string;
  pollens_constraints?: string;
  pollens_stakes?: string;
  noems_concepts?: string;
  noems_shared_ideas?: string;
  noems_intuitions?: string;
  poems_narratives?: string;
  poems_content_sources?: string;
  poems_data_nodes?: string;
  totems_processes?: string;
  totems_maps?: string;
  totems_three_graph?: string;
  totems_semantic_notes?: string;
  anthems_alignment?: string;
  anthems_success_signals?: string;
  anthems_guardrails?: string;
  anthems_roadmap?: string;
  anthems_feminine_quality?: string;
  anthems_learning_cadence?: string;
  stack_implications_pollens?: string;
  stack_implications_noems?: string;
  stack_implications_poems?: string;
  stack_implications_totems?: string;
  stack_implications_anthems?: string;
  prompt_hooks_pollens?: string;
  prompt_hooks_noems?: string;
  prompt_hooks_poems?: string;
  prompt_hooks_totems?: string;
  prompt_hooks_anthems?: string;
}

const LAYER_FIELDS: Record<PrdLayer, (keyof GeneratedContent)[]> = {
  POLLENS: ['pollens_observations', 'pollens_biases', 'pollens_cultural_issues', 'pollens_prd_shadows', 'pollens_constraints', 'pollens_stakes', 'stack_implications_pollens', 'prompt_hooks_pollens'],
  NOEMS: ['noems_concepts', 'noems_shared_ideas', 'noems_intuitions', 'stack_implications_noems', 'prompt_hooks_noems'],
  POEMS: ['poems_narratives', 'poems_content_sources', 'poems_data_nodes', 'stack_implications_poems', 'prompt_hooks_poems'],
  TOTEMS: ['totems_processes', 'totems_maps', 'totems_three_graph', 'totems_semantic_notes', 'stack_implications_totems', 'prompt_hooks_totems'],
  ANTHEMS: ['anthems_alignment', 'anthems_success_signals', 'anthems_guardrails', 'anthems_roadmap', 'anthems_feminine_quality', 'anthems_learning_cadence', 'stack_implications_anthems', 'prompt_hooks_anthems']
};

const WIZARD_FIELD_LABELS: Record<string, { label: string; description: string }> = {
  pollens_observations: { label: 'Raw Observations & Glitches', description: 'Tensions, complaints, weird use cases, emotional texture' },
  pollens_biases: { label: 'Biases Surfaced', description: 'Cognitive, cultural, institutional biases noticed' },
  pollens_cultural_issues: { label: 'Cultural Issues', description: 'Systemic and cultural patterns' },
  pollens_prd_shadows: { label: 'PRD Shadows', description: 'What the PRD might be hiding or avoiding' },
  pollens_constraints: { label: 'Constraints', description: 'Legal, ethical, financial, technical barriers' },
  pollens_stakes: { label: 'Stakes', description: 'What happens if nothing changes' },
  noems_concepts: { label: 'Crystallized Concepts', description: 'Emerging concepts with maturity levels' },
  noems_shared_ideas: { label: 'Shared Ideas', description: 'Ideas emerging from multiple tensions' },
  noems_intuitions: { label: 'Intuitions', description: 'Gut feelings worth tracking' },
  poems_narratives: { label: 'User Narratives', description: 'Before → during → after journeys' },
  poems_content_sources: { label: 'Content Sources', description: 'What content/data powers narratives' },
  poems_data_nodes: { label: 'Data Nodes', description: 'Key entities and relationships' },
  totems_processes: { label: 'Processes & Flows', description: 'Service blueprints, what people touch' },
  totems_maps: { label: 'Relationship Maps', description: 'Conceptual architecture, boundaries' },
  totems_three_graph: { label: 'Three Graph Model', description: 'Subject, Lexical, Domain graphs' },
  totems_semantic_notes: { label: 'Semantic Notes', description: 'RDF/OWL patterns emerging' },
  anthems_alignment: { label: 'Strategic Alignment', description: 'How this supports the larger story' },
  anthems_success_signals: { label: 'Success Signals', description: 'Qualitative and quantitative indicators' },
  anthems_guardrails: { label: 'Guardrails', description: 'Ethics, compliance, social impact' },
  anthems_roadmap: { label: 'Roadmap', description: 'Now/next/later with owners' },
  anthems_feminine_quality: { label: 'Feminine Quality Review', description: 'Which principles honored/at risk' },
  anthems_learning_cadence: { label: 'Learning Cadence', description: 'How we build in Drift time' },
  stack_implications_pollens: { label: '🔧 Stack Implications', description: 'Constraints, integrations, latency requirements' },
  stack_implications_noems: { label: '🔧 Stack Implications', description: 'Data types, capabilities, candidate components' },
  stack_implications_poems: { label: '🔧 Stack Implications', description: 'UX surface, adapters, session model' },
  stack_implications_totems: { label: '🔧 Stack Implications', description: 'Logging, access control, monitoring' },
  stack_implications_anthems: { label: '🔧 Stack Implications', description: 'MVP vs V2/V3, cost tradeoffs, licensing' },
  prompt_hooks_pollens: { label: '🤖 Prompt Hooks', description: 'Purpose, vibe, user archetypes' },
  prompt_hooks_noems: { label: '🤖 Prompt Hooks', description: 'Ontology, entities, relationships' },
  prompt_hooks_poems: { label: '🤖 Prompt Hooks', description: 'Canonical flows, error states, guardrails' },
  prompt_hooks_totems: { label: '🤖 Prompt Hooks', description: 'Rules, never/always constraints' },
  prompt_hooks_anthems: { label: '🤖 Prompt Hooks', description: 'Phase capabilities, feature flags' }
};

const LAYER_CHECKLIST: Record<PrdLayer, { label: string; check: (content: GeneratedContent) => boolean }[]> = {
  POLLENS: [
    { label: '5–15 tensions/glitches captured', check: (c) => (c.pollens_observations?.length || 0) > 100 },
    { label: 'Biases and shadows surfaced', check: (c) => !!(c.pollens_biases || c.pollens_prd_shadows) }
  ],
  NOEMS: [
    { label: 'Concepts crystallized with maturity', check: (c) => (c.noems_concepts?.length || 0) > 50 },
    { label: 'Intuitions captured', check: (c) => !!(c.noems_intuitions) }
  ],
  POEMS: [
    { label: '1–3 narrative arcs described', check: (c) => (c.poems_narratives?.length || 0) > 100 },
    { label: 'Data nodes identified', check: (c) => !!(c.poems_data_nodes) }
  ],
  TOTEMS: [
    { label: 'Processes mapped', check: (c) => (c.totems_processes?.length || 0) > 50 },
    { label: 'Three Graph Model hints', check: (c) => (c.totems_three_graph?.length || 0) > 30 }
  ],
  ANTHEMS: [
    { label: 'Success signals defined', check: (c) => (c.anthems_success_signals?.length || 0) > 50 },
    { label: 'Guardrails defined', check: (c) => (c.anthems_guardrails?.length || 0) > 50 },
    { label: 'Feminine quality reviewed', check: (c) => (c.anthems_feminine_quality?.length || 0) > 30 }
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

interface PrdAssemblyPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentSeason: Season;
  seasonProgress: Record<Season, Set<string>>;
  completedSeasons: Season[];
  prdId: string | null;
  onGenerateLayer: (season: Season) => Promise<void>;
  onPrdCreated?: (prdId: string) => void;
}

export const PrdAssemblyPanel: React.FC<PrdAssemblyPanelProps> = ({
  isOpen,
  onClose,
  currentSeason,
  seasonProgress,
  completedSeasons,
  prdId,
  onGenerateLayer,
  onPrdCreated
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

  useEffect(() => {
    if (isOpen) {
      fetchPrdData();
      fetchPolenEntries();
    }
  }, [isOpen, prdId]);

  // Update title from prdData
  useEffect(() => {
    if (prdData?.title) {
      setTitle(prdData.title);
    }
  }, [prdData]);

  // Map PRD data to wizard content format
  useEffect(() => {
    if (prdData) {
      const mapped: GeneratedContent = {
        pollens_observations: prdData.love_signals_summary || '',
        pollens_biases: '',
        pollens_prd_shadows: '',
        pollens_stakes: prdData.love_decision_to_exist || '',
        noems_concepts: prdData.magic_prd_outline || '',
        noems_shared_ideas: prdData.magic_hypotheses || '',
        noems_intuitions: prdData.magic_patterns || '',
        poems_narratives: prdData.magic_storyworld || '',
        poems_content_sources: prdData.open_real_workflow || '',
        poems_data_nodes: '',
        totems_processes: prdData.calm_requirements || '',
        totems_maps: prdData.open_ontology_and_graph || '',
        totems_three_graph: '',
        totems_semantic_notes: prdData.calm_risks_and_limits || '',
        anthems_alignment: prdData.free_totem_anthem || '',
        anthems_success_signals: prdData.free_success_criteria || '',
        anthems_guardrails: prdData.open_adjustment_plan || '',
        anthems_roadmap: prdData.free_first_poem_description || '',
        anthems_learning_cadence: prdData.free_next_cycle_hooks || '',
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

      const prdPayload = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        love_signals_summary: contentRef.current.pollens_observations,
        love_decision_to_exist: `Biases: ${contentRef.current.pollens_biases || ''}\n\nShadows: ${contentRef.current.pollens_prd_shadows || ''}\n\nStakes: ${contentRef.current.pollens_stakes || ''}`,
        magic_storyworld: contentRef.current.poems_narratives,
        magic_prd_outline: contentRef.current.noems_concepts,
        magic_hypotheses: contentRef.current.noems_shared_ideas,
        magic_patterns: contentRef.current.noems_intuitions,
        calm_requirements: contentRef.current.totems_processes,
        calm_risks_and_limits: `Three Graph: ${contentRef.current.totems_three_graph || ''}\n\nSemantic: ${contentRef.current.totems_semantic_notes || ''}`,
        open_ontology_and_graph: contentRef.current.totems_maps,
        open_real_workflow: contentRef.current.poems_content_sources,
        open_adjustment_plan: contentRef.current.anthems_guardrails,
        free_first_poem_description: contentRef.current.anthems_roadmap,
        free_totem_anthem: contentRef.current.anthems_alignment,
        free_success_criteria: contentRef.current.anthems_success_signals,
        free_next_cycle_hooks: contentRef.current.anthems_learning_cadence,
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

      const prdPayload = {
        owner_id: user.id,
        title,
        status: 'draft',
        prototype_stage: 'B_DIEGETIC',
        love_signals_summary: content.pollens_observations,
        love_decision_to_exist: `Biases: ${content.pollens_biases || ''}\n\nShadows: ${content.pollens_prd_shadows || ''}\n\nStakes: ${content.pollens_stakes || ''}`,
        magic_storyworld: content.poems_narratives,
        magic_prd_outline: content.noems_concepts,
        magic_hypotheses: content.noems_shared_ideas,
        magic_patterns: content.noems_intuitions,
        calm_requirements: content.totems_processes,
        calm_risks_and_limits: `Three Graph: ${content.totems_three_graph || ''}\n\nSemantic: ${content.totems_semantic_notes || ''}`,
        open_ontology_and_graph: content.totems_maps,
        open_real_workflow: content.poems_content_sources,
        open_adjustment_plan: content.anthems_guardrails,
        free_first_poem_description: content.anthems_roadmap,
        free_totem_anthem: content.anthems_alignment,
        free_success_criteria: content.anthems_success_signals,
        free_next_cycle_hooks: content.anthems_learning_cadence,
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
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFullPreview(true)}
            disabled={filledFields === 0}
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
