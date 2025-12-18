import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  Copy, 
  ExternalLink, 
  Bot, 
  Database, 
  Workflow,
  FileCode,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

interface IntegrationPathwaysProps {
  compiledPrompt: string;
  onExport: () => void;
  className?: string;
}

const IntegrationPathways = ({ compiledPrompt, onExport, className }: IntegrationPathwaysProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (text: string, id: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    toast.success(`${label} copied to clipboard`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const integrations = [
    {
      id: 'foundational-prompt',
      title: 'Foundational Prompt',
      description: 'Complete system prompt for AI agents',
      icon: Bot,
      action: () => handleCopy(compiledPrompt, 'foundational-prompt', 'Foundational Prompt'),
      actionLabel: 'Copy',
      actionIcon: Copy,
    },
    {
      id: 'export-markdown',
      title: 'Export Documentation',
      description: 'Download as Markdown file',
      icon: FileCode,
      action: onExport,
      actionLabel: 'Download',
      actionIcon: Download,
    },
    {
      id: 'semantic-export',
      title: 'Semantic Ontology',
      description: 'Export as RDF/OWL format',
      icon: Database,
      action: () => toast.info('Semantic export coming soon'),
      actionLabel: 'Export',
      actionIcon: ExternalLink,
      disabled: true,
    },
    {
      id: 'workflow-integration',
      title: 'Workflow Automation',
      description: 'Connect to n8n or Zapier',
      icon: Workflow,
      action: () => toast.info('Workflow integration coming soon'),
      actionLabel: 'Connect',
      actionIcon: ExternalLink,
      disabled: true,
    },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold mb-2">Integration Pathways</h3>
        <p className="text-sm text-muted-foreground">
          Take your living ontology into the world
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const ActionIcon = copiedId === integration.id ? CheckCircle2 : integration.actionIcon;
          
          return (
            <div
              key={integration.id}
              className={cn(
                "group relative flex items-start gap-4 p-4 rounded-xl border",
                "bg-background/50 backdrop-blur-sm",
                "transition-all duration-300",
                integration.disabled 
                  ? "opacity-50 cursor-not-allowed" 
                  : "hover:border-primary/30 hover:bg-background/80"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                "bg-primary/10 text-primary",
                "transition-colors group-hover:bg-primary/20"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1">{integration.title}</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  {integration.description}
                </p>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={integration.action}
                  disabled={integration.disabled}
                  className={cn(
                    "h-8 text-xs",
                    copiedId === integration.id && "text-emerald-500 border-emerald-500/30"
                  )}
                >
                  <ActionIcon className="w-3.5 h-3.5 mr-1.5" />
                  {copiedId === integration.id ? 'Copied!' : integration.actionLabel}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationPathways;
