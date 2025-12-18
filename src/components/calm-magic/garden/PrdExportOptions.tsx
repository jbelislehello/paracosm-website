import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, FileJson, FileCode, FileText, Copy, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { generatePrdYaml, downloadYaml } from '@/utils/yamlExport';
import { generatePrdMarkdown, downloadMarkdown } from '@/utils/prdExport';

interface PrdExportOptionsProps {
  prdData: any;
  projectName: string;
  compiledPrompt?: string;
}

const PrdExportOptions: React.FC<PrdExportOptionsProps> = ({
  prdData,
  projectName,
  compiledPrompt
}) => {
  const [copied, setCopied] = React.useState(false);
  
  const sanitizedName = projectName.toLowerCase().replace(/\s+/g, '-');

  const handleJsonExport = () => {
    if (!prdData) {
      toast.error('No PRD data to export');
      return;
    }
    
    const json = JSON.stringify(prdData, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${sanitizedName}-prd.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('JSON exported');
  };

  const handleYamlExport = () => {
    if (!prdData) {
      toast.error('No PRD data to export');
      return;
    }
    
    const yaml = generatePrdYaml(prdData);
    downloadYaml(yaml, `${sanitizedName}-prd.yaml`);
    toast.success('YAML exported');
  };

  const handleMarkdownExport = () => {
    if (!prdData) {
      toast.error('No PRD data to export');
      return;
    }
    
    downloadMarkdown(prdData);
    toast.success('Markdown exported');
  };

  const handleCopyJson = async () => {
    if (!prdData) {
      toast.error('No PRD data to copy');
      return;
    }
    
    await navigator.clipboard.writeText(JSON.stringify(prdData, null, 2));
    setCopied(true);
    toast.success('JSON copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyYaml = async () => {
    if (!prdData) {
      toast.error('No PRD data to copy');
      return;
    }
    
    const yaml = generatePrdYaml(prdData);
    await navigator.clipboard.writeText(yaml);
    setCopied(true);
    toast.success('YAML copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={handleJsonExport}>
          <FileJson className="w-4 h-4 mr-2 text-blue-500" />
          Download JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleYamlExport}>
          <FileCode className="w-4 h-4 mr-2 text-amber-500" />
          Download YAML
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleMarkdownExport}>
          <FileText className="w-4 h-4 mr-2 text-purple-500" />
          Download Markdown
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={handleCopyJson}>
          {copied ? (
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          Copy JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyYaml}>
          {copied ? (
            <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
          ) : (
            <Copy className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          Copy YAML
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PrdExportOptions;
