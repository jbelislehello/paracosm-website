import React, { useState, useEffect, useRef } from 'react';
import mermaid from 'mermaid';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Wand2, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface DiagramBuilderProps {
  onSave?: (svg: string, source: string, type: string) => void;
}

type DiagramType = 'flowchart' | 'sequence' | 'mindmap' | 'er' | 'journey';

const DIAGRAM_TEMPLATES: Record<DiagramType, { label: string; template: string }> = {
  flowchart: {
    label: 'Flowchart',
    template: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`
  },
  sequence: {
    label: 'Sequence',
    template: `sequenceDiagram
    participant User
    participant System
    User->>System: Request
    System-->>User: Response`
  },
  mindmap: {
    label: 'Mind Map',
    template: `mindmap
  root((Central Idea))
    Branch 1
      Leaf 1.1
      Leaf 1.2
    Branch 2
      Leaf 2.1`
  },
  er: {
    label: 'Entity Relationship',
    template: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ ITEM : contains
    USER {
        string name
        string email
    }`
  },
  journey: {
    label: 'User Journey',
    template: `journey
    title User Journey
    section Discovery
      Find product: 5: User
      Read reviews: 4: User
    section Purchase
      Add to cart: 5: User
      Checkout: 3: User`
  }
};

export const DiagramBuilder: React.FC<DiagramBuilderProps> = ({ onSave }) => {
  const [diagramType, setDiagramType] = useState<DiagramType>('flowchart');
  const [source, setSource] = useState(DIAGRAM_TEMPLATES.flowchart.template);
  const [renderedSvg, setRenderedSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    mermaid.initialize({
      startOnLoad: false,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'system-ui, sans-serif',
    });
  }, []);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!source.trim()) {
        setRenderedSvg('');
        setError(null);
        return;
      }

      setIsRendering(true);
      setError(null);
      renderIdRef.current += 1;
      const currentRenderId = renderIdRef.current;

      try {
        const id = `mermaid-${Date.now()}`;
        const { svg } = await mermaid.render(id, source);
        
        if (currentRenderId === renderIdRef.current) {
          setRenderedSvg(svg);
          setError(null);
        }
      } catch (err) {
        if (currentRenderId === renderIdRef.current) {
          setError(err instanceof Error ? err.message : 'Failed to render diagram');
          setRenderedSvg('');
        }
      } finally {
        if (currentRenderId === renderIdRef.current) {
          setIsRendering(false);
        }
      }
    };

    const debounce = setTimeout(renderDiagram, 500);
    return () => clearTimeout(debounce);
  }, [source]);

  const handleTypeChange = (type: DiagramType) => {
    setDiagramType(type);
    setSource(DIAGRAM_TEMPLATES[type].template);
  };

  const handleExport = () => {
    if (renderedSvg) {
      onSave?.(renderedSvg, source, diagramType);
      toast.success('Diagram saved as POLEN entry');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(source);
    toast.success('Diagram source copied');
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
            {Object.entries(DIAGRAM_TEMPLATES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
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
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleExport} disabled={!renderedSvg}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Editor and Preview */}
      <div className="grid grid-cols-2 gap-3">
        {/* Source Editor */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">Mermaid Source</span>
          <Textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="min-h-[200px] font-mono text-xs resize-none"
            placeholder="Enter Mermaid diagram syntax..."
          />
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">
            Preview {isRendering && <span className="text-primary">(rendering...)</span>}
          </span>
          <div 
            ref={containerRef}
            className="min-h-[200px] bg-background rounded-md border border-border p-2 overflow-auto flex items-center justify-center"
          >
            {error ? (
              <div className="text-destructive text-xs text-center p-4">
                {error}
              </div>
            ) : renderedSvg ? (
              <div 
                dangerouslySetInnerHTML={{ __html: renderedSvg }} 
                className="[&_svg]:max-w-full [&_svg]:h-auto"
              />
            ) : (
              <span className="text-muted-foreground text-sm">
                Start typing to see preview
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
