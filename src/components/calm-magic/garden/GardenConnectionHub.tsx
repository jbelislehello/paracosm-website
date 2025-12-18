import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, ExternalLink, Link2, Unplug, Copy, Sparkles } from 'lucide-react';
import { GARDEN_CONNECTIONS, GardenConnection } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GardenConnectionHubProps {
  activeConnections: string[];
  onConnect: (connectionId: string) => void;
  onDisconnect: (connectionId: string) => void;
  compiledPrompt?: string;
}

const GardenConnectionHub = ({ 
  activeConnections, 
  onConnect, 
  onDisconnect,
  compiledPrompt 
}: GardenConnectionHubProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);

  const handleConnect = async (connection: GardenConnection) => {
    setConnecting(connection.id);
    
    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (activeConnections.includes(connection.id)) {
      onDisconnect(connection.id);
      toast.success(`Disconnected from ${connection.name}`);
    } else {
      onConnect(connection.id);
      toast.success(`Connected to ${connection.name}!`, {
        description: 'Root extended to new system'
      });
    }
    
    setConnecting(null);
  };

  const handleCopyForPlatform = (platform: string) => {
    if (!compiledPrompt) {
      toast.error('No compiled prompt available');
      return;
    }
    
    navigator.clipboard.writeText(compiledPrompt);
    toast.success(`Copied for ${platform}!`, {
      description: 'Paste this into your AI platform'
    });
  };

  const isConnected = (id: string) => activeConnections.includes(id);
  const isConnecting = (id: string) => connecting === id;

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Extend Your Garden's Roots
          </h3>
          <Badge variant="outline" className="gap-1">
            <span className="text-emerald-500">●</span>
            {activeConnections.length} Connected
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {GARDEN_CONNECTIONS.map((connection) => {
            const connected = isConnected(connection.id);
            const loading = isConnecting(connection.id);
            
            return (
              <Tooltip key={connection.id}>
                <TooltipTrigger asChild>
                  <Card
                    className={cn(
                      "relative p-4 cursor-pointer transition-all duration-300",
                      "hover:shadow-lg hover:scale-[1.02]",
                      "border-2",
                      connected 
                        ? "border-emerald-500/50 bg-emerald-500/5" 
                        : "border-transparent hover:border-primary/30"
                    )}
                    onClick={() => handleConnect(connection)}
                  >
                    <div className="flex flex-col items-center gap-2 text-center">
                      {/* Icon */}
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-3xl",
                        "bg-gradient-to-br",
                        connection.gradient,
                        "shadow-md transition-transform",
                        loading && "animate-pulse",
                        connected && "ring-2 ring-emerald-500 ring-offset-2"
                      )}>
                        {connection.icon}
                      </div>
                      
                      {/* Name */}
                      <h4 className="font-semibold text-sm">{connection.name}</h4>
                      
                      {/* Status badge */}
                      <Badge 
                        variant={connected ? "default" : "outline"} 
                        className={cn(
                          "text-[10px]",
                          connected && "bg-emerald-500 hover:bg-emerald-600"
                        )}
                      >
                        {loading ? (
                          <span className="flex items-center gap-1">
                            <span className="animate-spin">⟳</span> Connecting...
                          </span>
                        ) : connected ? (
                          <span className="flex items-center gap-1">
                            <Check className="w-3 h-3" /> Connected
                          </span>
                        ) : (
                          'Ready'
                        )}
                      </Badge>
                    </div>
                    
                    {/* Connection line indicator */}
                    {connected && (
                      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-emerald-500" />
                    )}
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <div className="space-y-2">
                    <p className="font-semibold flex items-center gap-2">
                      {connection.icon} {connection.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{connection.description}</p>
                    {connection.url && (
                      <a 
                        href={connection.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-xs text-primary flex items-center gap-1 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Visit <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Copy Actions */}
        {compiledPrompt && (
          <Card className="p-4 bg-muted/50">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Copy className="w-4 h-4" />
              Copy Foundational Prompt For:
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Lovable', 'Base44', 'Claude', 'Tonalli'].map((platform) => (
                <Button
                  key={platform}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyForPlatform(platform)}
                  className="gap-1"
                >
                  {platform === 'Tonalli' && '🦊'}
                  {platform === 'Lovable' && '💖'}
                  {platform === 'Claude' && '🤖'}
                  {platform === 'Base44' && '🔷'}
                  {platform}
                </Button>
              ))}
            </div>
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
};

export default GardenConnectionHub;
