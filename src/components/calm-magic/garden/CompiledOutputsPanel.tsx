import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { 
  Copy, 
  Check, 
  Download, 
  Code, 
  FileText, 
  Bot,
  Layers,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { PrdSeasonData, SEASONS, SEASON_CONFIG } from './AgenticPrdRenderer';
import { AGENTIC_LAYERS, LAYER_ORDER } from '@/data/agenticLayers';
import { compileStackImplications, compileFoundationalPrompt } from '@/data/prdCompilation';

interface CompiledOutputsPanelProps {
  prdData: PrdSeasonData | null;
  projectName: string;
}

const CompiledOutputsPanel: React.FC<CompiledOutputsPanelProps> = ({ prdData, projectName }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('prompt');

  // Generate Tech Stack JSON
  const techStackJson = useMemo(() => {
    if (!prdData) return null;
    
    // Extract stack implications from all layers
    const stackImplications = {
      pollens: prdData.stack_implications_pollens || '',
      noems: prdData.stack_implications_noems || '',
      poems: prdData.stack_implications_poems || '',
      totems: prdData.stack_implications_totems || '',
      anthems: prdData.stack_implications_anthems || ''
    };
    
    // Build tech stack structure
    const techStack = {
      project: projectName,
      version: '1.0.0',
      generatedAt: new Date().toISOString(),
      agenticArchitecture: {
        layers: LAYER_ORDER.reduce((acc, key, index) => {
          const layer = AGENTIC_LAYERS[key];
          acc[key] = {
            level: `L${8 - index}`,
            name: layer.name,
            status: 'configured',
            components: layer.stackComponents,
            prdSources: SEASON_CONFIG[SEASONS[Math.min(index, 4)]].fields.slice(0, 2)
          };
          return acc;
        }, {} as Record<string, any>)
      },
      constraints: {
        dataResidency: prdData.totems_security_policies ? 'compliant' : 'undefined',
        sensitivityLevel: prdData.totems_access_controls ? 'defined' : 'undefined',
        hostingRequirements: prdData.totems_system_requirements || 'not specified'
      },
      stackImplications,
      maturityLevels: {
        documentation: prdData.anthems_brand_narrative ? 'complete' : 'in_progress',
        automation: prdData.totems_integration_points ? 'configured' : 'planning',
        orchestration: prdData.poems_systems ? 'defined' : 'not_started'
      }
    };
    
    return JSON.stringify(techStack, null, 2);
  }, [prdData, projectName]);

  // Generate Foundational Prompt
  const foundationalPrompt = useMemo(() => {
    if (!prdData) return '';
    
    let prompt = `# ${projectName} — Foundational Vibing Prompt
## Agentic Era System Configuration

Generated: ${new Date().toISOString()}
Version: 1.0.0

---

## 🎯 Agent Identity & Purpose

`;

    // POLLENS → Purpose & Context
    if (prdData.pollens_aspirations) {
      prompt += `### Core Aspirations
${prdData.pollens_aspirations}

`;
    }
    
    if (prdData.pollens_stakes) {
      prompt += `### Stakes & Impact
${prdData.pollens_stakes}

`;
    }

    // NOEMS → Cognitive Framework
    prompt += `## 🧠 Cognitive Framework

`;
    
    if (prdData.noems_concepts) {
      prompt += `### Core Concepts
${prdData.noems_concepts}

`;
    }
    
    if (prdData.noems_mental_models) {
      prompt += `### Mental Models
${prdData.noems_mental_models}

`;
    }

    // POEMS → Interaction Patterns
    prompt += `## 🎭 Interaction Patterns (P.O.E.M.S.)

`;
    
    if (prdData.poems_people) {
      prompt += `### 👤 People (Users & Stakeholders)
${prdData.poems_people}

`;
    }
    
    if (prdData.poems_objects) {
      prompt += `### 📦 Objects (Artifacts & Interfaces)
${prdData.poems_objects}

`;
    }
    
    if (prdData.poems_environments) {
      prompt += `### 🌍 Environments (Contexts)
${prdData.poems_environments}

`;
    }
    
    if (prdData.poems_messages) {
      prompt += `### 💬 Messages (Communications)
${prdData.poems_messages}

`;
    }
    
    if (prdData.poems_systems) {
      prompt += `### ⚙️ Systems (Processes)
${prdData.poems_systems}

`;
    }

    // TOTEMS → Technical Constraints
    prompt += `## 🔧 Technical Architecture

`;
    
    if (prdData.totems_data_architecture) {
      prompt += `### Data Architecture
${prdData.totems_data_architecture}

`;
    }
    
    if (prdData.totems_security_policies) {
      prompt += `### Security & Governance
${prdData.totems_security_policies}

`;
    }
    
    if (prdData.totems_integration_points) {
      prompt += `### Integration Points
${prdData.totems_integration_points}

`;
    }

    // ANTHEMS → Brand & Voice
    prompt += `## 🎵 Brand Voice & Storytelling

`;
    
    if (prdData.anthems_brand_narrative) {
      prompt += `### Brand Narrative
${prdData.anthems_brand_narrative}

`;
    }
    
    if (prdData.anthems_market_positioning) {
      prompt += `### Market Positioning
${prdData.anthems_market_positioning}

`;
    }
    
    if (prdData.anthems_storytelling_assets) {
      prompt += `### Storytelling Assets
${prdData.anthems_storytelling_assets}

`;
    }

    // Prompt Hooks
    prompt += `## 🤖 Agentic Configuration Hooks

`;
    
    const promptHooks = [
      { key: 'prompt_hooks_pollens', label: 'POLLENS Hooks' },
      { key: 'prompt_hooks_noems', label: 'NOEMS Hooks' },
      { key: 'prompt_hooks_poems', label: 'POEMS Hooks' },
      { key: 'prompt_hooks_totems', label: 'TOTEMS Hooks' },
      { key: 'prompt_hooks_anthems', label: 'ANTHEMS Hooks' }
    ];
    
    promptHooks.forEach(({ key, label }) => {
      const value = prdData[key as keyof PrdSeasonData];
      if (value && typeof value === 'string' && value.trim()) {
        prompt += `### ${label}
\`\`\`
${value}
\`\`\`

`;
      }
    });

    // 8-Layer Architecture Reference
    prompt += `## 📐 8-Layer Agentic Architecture Reference

| Layer | Name | Status |
|-------|------|--------|
`;
    
    LAYER_ORDER.forEach((key, index) => {
      const layer = AGENTIC_LAYERS[key];
      prompt += `| L${8 - index} | ${layer.name} | Configured |\n`;
    });

    prompt += `
---

## 🚀 Success Signals

`;
    
    if (prdData.anthems_success_signals) {
      prompt += `${prdData.anthems_success_signals}

`;
    }

    prompt += `---

*This foundational prompt was generated by the Calm Magic Board Holy Grail PRD system.*
*It is designed to be compilable into agentic AI system configurations.*
`;

    return prompt;
  }, [prdData, projectName]);

  const copyToClipboard = async (content: string, section: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedSection(section);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedSection(null), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${filename}`);
  };

  if (!prdData) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <Sparkles className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
          <p className="text-muted-foreground">No PRD data to compile</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border-emerald-500/20">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Compiled Outputs</h3>
                <p className="text-sm text-muted-foreground">
                  Machine-readable Tech Stack & Foundational Prompt
                </p>
              </div>
            </div>
            <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30">
              Ready for Export
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Outputs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="prompt" className="gap-2">
            <Bot className="w-4 h-4" />
            Foundational Prompt
          </TabsTrigger>
          <TabsTrigger value="techstack" className="gap-2">
            <Layers className="w-4 h-4" />
            Tech Stack JSON
          </TabsTrigger>
        </TabsList>

        {/* Foundational Prompt Tab */}
        <TabsContent value="prompt" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Foundational Vibing Prompt
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(foundationalPrompt, 'prompt')}
                  >
                    {copiedSection === 'prompt' ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => downloadFile(
                      foundationalPrompt,
                      `${projectName.replace(/\s+/g, '-').toLowerCase()}-foundational-prompt.md`,
                      'text/markdown'
                    )}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download .md
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-lg border bg-muted/20 p-4">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {foundationalPrompt}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tech Stack JSON Tab */}
        <TabsContent value="techstack" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  Tech Stack Structure (JSON)
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(techStackJson || '', 'techstack')}
                  >
                    {copiedSection === 'techstack' ? (
                      <Check className="w-4 h-4 mr-1" />
                    ) : (
                      <Copy className="w-4 h-4 mr-1" />
                    )}
                    Copy
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => downloadFile(
                      techStackJson || '',
                      `${projectName.replace(/\s+/g, '-').toLowerCase()}-tech-stack.json`,
                      'application/json'
                    )}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download .json
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] rounded-lg border bg-muted/20 p-4">
                <pre className="text-xs whitespace-pre-wrap font-mono text-emerald-600 dark:text-emerald-400">
                  {techStackJson}
                </pre>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Options Summary */}
      <Card className="bg-muted/20">
        <CardContent className="py-4">
          <h5 className="text-xs font-medium text-muted-foreground mb-3">Available Exports</h5>
          <div className="grid sm:grid-cols-4 gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => copyToClipboard(foundationalPrompt, 'prompt')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy Prompt
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => copyToClipboard(techStackJson || '', 'techstack')}
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy JSON
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => downloadFile(
                foundationalPrompt,
                `${projectName.replace(/\s+/g, '-').toLowerCase()}-foundational-prompt.md`,
                'text/markdown'
              )}
            >
              <Download className="w-4 h-4 mr-2" />
              .md File
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="justify-start"
              onClick={() => downloadFile(
                techStackJson || '',
                `${projectName.replace(/\s+/g, '-').toLowerCase()}-tech-stack.json`,
                'application/json'
              )}
            >
              <Download className="w-4 h-4 mr-2" />
              .json File
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompiledOutputsPanel;
