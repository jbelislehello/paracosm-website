import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, ExternalLink, Link2, Copy, Sparkles } from 'lucide-react';
import { GARDEN_CONNECTIONS, GardenConnection } from '@/data/gardenConnections';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface GardenConnectionHubProps {
  activeConnections: string[];
  onConnect: (connectionId: string) => void;
  onDisconnect: (connectionId: string) => void;
  compiledPrompt?: string;
}

// Root growth animation component
const RootGrowth = ({ active, color }: { active: boolean; color: string }) => {
  if (!active) return null;
  
  return (
    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
      <svg width="40" height="40" viewBox="0 0 40 40" className="overflow-visible">
        <path
          d="M20 0 Q10 15 5 40 M20 0 Q25 12 30 35 M20 0 Q20 20 20 40"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-draw-root"
          style={{
            strokeDasharray: 100,
            strokeDashoffset: 100,
            animation: 'draw-root 0.8s ease-out forwards',
          }}
        />
      </svg>
      <style>{`
        @keyframes draw-root {
          to { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
};

const GardenConnectionHub = ({ 
  activeConnections, 
  onConnect, 
  onDisconnect,
  compiledPrompt 
}: GardenConnectionHubProps) => {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [recentlyConnected, setRecentlyConnected] = useState<string | null>(null);

  const handleConnect = async (connection: GardenConnection) => {
    setConnecting(connection.id);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (activeConnections.includes(connection.id)) {
      onDisconnect(connection.id);
      toast.success(`Disconnected from ${connection.name}`);
    } else {
      onConnect(connection.id);
      setRecentlyConnected(connection.id);
      setTimeout(() => setRecentlyConnected(null), 2000);
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

  const connectionColors: Record<string, string> = {
    tonalli: '#f59e0b',
    n8n: '#10b981',
    'owl-rdf': '#8b5cf6',
    notion: '#64748b',
    lovable: '#f43f5e',
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Extend Your Garden's Roots
          </h3>
          <Badge variant="outline" className="gap-1.5 px-3 py-1 backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            {activeConnections.length} Connected
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {GARDEN_CONNECTIONS.map((connection, index) => {
            const connected = isConnected(connection.id);
            const loading = isConnecting(connection.id);
            const justConnected = recentlyConnected === connection.id;
            
            return (
              <Tooltip key={connection.id}>
                <TooltipTrigger asChild>
                  <Card
                    className={cn(
                      "relative p-5 cursor-pointer transition-all duration-300 overflow-visible",
                      "hover:shadow-xl hover:-translate-y-1",
                      "bg-gradient-to-br from-background/80 to-muted/30",
                      "backdrop-blur-sm",
                      "border-2 transition-colors",
                      connected 
                        ? "border-emerald-500/50 shadow-emerald-500/20 shadow-lg" 
                        : "border-white/10 hover:border-primary/30"
                    )}
                    style={{
                      animationDelay: `${index * 80}ms`,
                      animation: 'fade-in 0.4s ease-out forwards',
                      opacity: 0,
                    }}
                    onClick={() => handleConnect(connection)}
                  >
                    {/* Root growth animation */}
                    <RootGrowth 
                      active={justConnected} 
                      color={connectionColors[connection.id] || '#888'}
                    />
                    
                    {/* Pulsing glow for connected */}
                    {connected && (
                      <div 
                        className="absolute inset-0 rounded-lg animate-pulse"
                        style={{
                          boxShadow: `0 0 30px ${connectionColors[connection.id]}30`,
                        }}
                      />
                    )}
                    
                    <div className="flex flex-col items-center gap-3 text-center relative z-10">
                      {/* Icon with glow */}
                      <div className="relative">
                        <div className={cn(
                          "w-16 h-16 rounded-2xl flex items-center justify-center text-3xl",
                          "bg-gradient-to-br shadow-lg",
                          connection.gradient,
                          "transition-all duration-300",
                          loading && "animate-pulse scale-95",
                          connected && "ring-2 ring-emerald-500 ring-offset-2 ring-offset-background"
                        )}>
                          {connection.icon}
                        </div>
                        
                        {/* Connection beam effect */}
                        {justConnected && (
                          <div className="absolute inset-0 rounded-2xl">
                            <div 
                              className="absolute inset-0 rounded-2xl animate-ping"
                              style={{ 
                                backgroundColor: connectionColors[connection.id],
                                opacity: 0.3,
                              }}
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Name */}
                      <h4 className="font-semibold text-sm">{connection.name}</h4>
                      
                      {/* Status badge */}
                      <Badge 
                        variant={connected ? "default" : "outline"} 
                        className={cn(
                          "text-[10px] transition-all duration-300",
                          connected && "bg-emerald-500 hover:bg-emerald-600 shadow-lg"
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
                    
                    {/* Connection indicator line */}
                    {connected && (
                      <div 
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 rounded-full"
                        style={{ backgroundColor: connectionColors[connection.id] }}
                      />
                    )}
                  </Card>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs backdrop-blur-xl bg-background/90">
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
          <Card className={cn(
            "p-5 relative overflow-hidden",
            "bg-gradient-to-br from-background/60 to-muted/30",
            "backdrop-blur-xl border-white/10"
          )}>
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent pointer-events-none" />
            
            <h4 className="font-semibold mb-4 flex items-center gap-2 relative z-10">
              <Copy className="w-4 h-4" />
              Copy Foundational Prompt For:
            </h4>
            <div className="flex flex-wrap gap-3 relative z-10">
              {[
                { name: 'Lovable', icon: '💖', gradient: 'from-rose-500 to-pink-500' },
                { name: 'Base44', icon: '🔷', gradient: 'from-blue-500 to-indigo-500' },
                { name: 'Claude', icon: '🤖', gradient: 'from-amber-500 to-orange-500' },
                { name: 'Tonalli', icon: '🦊', gradient: 'from-amber-400 to-yellow-500' },
              ].map((platform) => (
                <Button
                  key={platform.name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopyForPlatform(platform.name)}
                  className={cn(
                    "gap-2 backdrop-blur-sm bg-background/50",
                    "hover:shadow-lg transition-all duration-300",
                    "hover:-translate-y-0.5"
                  )}
                >
                  <span className="text-lg">{platform.icon}</span>
                  {platform.name}
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
