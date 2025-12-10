import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DiagramBuilderProps {
  onSave?: (svg: string, source: string, type: string) => void;
}

type DiagramType = 'flowchart' | 'mindmap' | 'list' | 'process';

const DIAGRAM_TEMPLATES: Record<DiagramType, { label: string; template: string; description: string }> = {
  flowchart: {
    label: 'Flowchart',
    description: 'Decision flow with arrows',
    template: `Start
  ↓
Decision?
  ├─ Yes → Action A → End
  └─ No → Action B → End`
  },
  mindmap: {
    label: 'Mind Map',
    description: 'Hierarchical ideas',
    template: `Central Idea
├── Branch 1
│   ├── Leaf 1.1
│   └── Leaf 1.2
├── Branch 2
│   └── Leaf 2.1
└── Branch 3`
  },
  list: {
    label: 'Structured List',
    description: 'Organized items',
    template: `# Main Topic

## Section 1
- Item A
- Item B
  - Sub-item B.1
  - Sub-item B.2

## Section 2
- Item C
- Item D`
  },
  process: {
    label: 'Process Steps',
    description: 'Sequential workflow',
    template: `[1] Discovery
    ↓
[2] Analysis
    ↓
[3] Design
    ↓
[4] Implementation
    ↓
[5] Review`
  }
};

export const DiagramBuilder: React.FC<DiagramBuilderProps> = ({ onSave }) => {
  const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
  const [source, setSource] = useState(DIAGRAM_TEMPLATES.flowchart.template);

  const handleTypeChange = (type: DiagramType) => {
    setDiagramType(type);
    setSource(DIAGRAM_TEMPLATES[type].template);
  };

  const handleExport = () => {
    if (source.trim()) {
      onSave?.(source, source, diagramType);
      toast.success('Diagram saved as POLEN entry');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    toast.success('Diagram copied to clipboard');
  };

  const handleReset = () => {
    setSource(DIAGRAM_TEMPLATES[diagramType].template);
  };

  return (
    <div className="flex flex-col gap-3 p-3 bg-muted/30 rounded-lg border border-border/50">
      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={diagramType} onValueChange={(v) => handleTypeChange(v as DiagramType)}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DIAGRAM_TEMPLATES).map(([key, { label, description }]) => (
              <SelectItem key={key} value={key}>
                <div className="flex flex-col">
                  <span>{label}</span>
                  <span className="text-xs text-muted-foreground">{description}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-1 ml-auto">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopy}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport} disabled={!source.trim()}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="grid grid-cols-2 gap-3">
        {/* Source Editor */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Edit Diagram</span>
          <Textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="min-h-[200px] font-mono text-xs resize-none"
            placeholder="Create your diagram..."
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Preview</span>
          <div className="min-h-[200px] bg-background rounded-md border border-border p-3 overflow-auto">
            <pre className="text-xs font-mono whitespace-pre-wrap text-foreground leading-relaxed">
              {source || 'Start typing to see preview'}
            </pre>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="text-[10px] text-muted-foreground">
        Use arrows (→ ↓ ← ↑), tree chars (├── └── │), and indentation to create visual structure
      </div>
    </div>
  );
};
