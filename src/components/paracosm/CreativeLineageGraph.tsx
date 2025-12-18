import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineageNode, PARACOSM_PRODUCTS, PROTOTYPAL_STAGES, CreativeLineageGraph as LineageGraphType } from '@/types/paracosm';
import { supabase } from '@/integrations/supabase/client';
import { RefreshCw, Sparkles, GitBranch, Circle } from 'lucide-react';

interface CreativeLineageGraphProps {
  userId?: string;
  onNodeClick?: (node: LineageNode) => void;
}

export function CreativeLineageGraph({ userId, onNodeClick }: CreativeLineageGraphProps) {
  const [graph, setGraph] = useState<LineageGraphType | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState<LineageNode | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId) {
      loadLineageGraph();
    }
  }, [userId]);

  async function loadLineageGraph() {
    setLoading(true);
    try {
      // Fetch projects with lineage info
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      // Fetch published software
      const { data: software } = await supabase
        .from('published_software')
        .select('*')
        .eq('user_id', userId);

      // Fetch PRDs
      const { data: prds } = await supabase
        .from('prds')
        .select('id, title, status, prototype_stage, consciousness_geometry')
        .eq('owner_id', userId);

      // Build the graph
      const rootNode: LineageNode = {
        id: 'calm-magic-root',
        type: 'calm_magic',
        name: 'Calm Magic',
        status: 'alive',
        stage: 'E',
        isRecursive: true,
        consciousnessBits: 1.0,
        children: [],
      };

      // Add PRDs as children of root
      const prdNodes: LineageNode[] = (prds || []).map(prd => ({
        id: prd.id,
        type: 'prd' as const,
        name: prd.title,
        status: prd.status,
        stage: mapPrototypeStage(prd.prototype_stage),
        consciousnessBits: (prd.consciousness_geometry as any)?.consciousnessBits || 0,
        children: [],
      }));

      // Add projects as children of their source PRDs or root
      const projectNodes: LineageNode[] = (projects || []).map(project => ({
        id: project.id,
        type: 'project' as const,
        name: project.project_name,
        status: (project as any).product_status || 'incubating',
        stage: ((project as any).prototypal_stage || 'A') as 'A' | 'B' | 'C' | 'D' | 'E',
        platform: (project as any).target_platform,
        consciousnessBits: (project as any).consciousness_bits || 0,
        children: [],
      }));

      // Add software as leaf nodes
      const softwareNodes: LineageNode[] = (software || []).map(sw => ({
        id: sw.id,
        type: 'software' as const,
        name: sw.name,
        status: sw.status,
        stage: getStageFromConsciousness(sw.integration_strength || 0),
        platform: sw.target_platform as any,
        isRecursive: sw.is_recursive,
        consciousnessBits: sw.integration_strength || 0,
        children: [],
      }));

      // Connect nodes based on relationships
      // For now, add all as children of root (simplified tree)
      rootNode.children = [...prdNodes, ...projectNodes.filter(p => !p.consciousnessBits)];
      
      // Add software to projects or directly to root
      projectNodes.forEach(project => {
        const relatedSoftware = softwareNodes.filter(sw => 
          (sw as any).source_project_id === project.id
        );
        project.children = relatedSoftware;
      });

      // Add canonical Paracosm products
      const canonicalProducts: LineageNode[] = [
        {
          id: 'iotheatre',
          type: 'software',
          name: PARACOSM_PRODUCTS.IOTHEATRE.name,
          status: 'alive',
          stage: 'D',
          isRecursive: false,
          consciousnessBits: 0.8,
          children: [],
        },
        {
          id: 'tonalli',
          type: 'software',
          name: PARACOSM_PRODUCTS.TONALLI.name,
          status: 'recursive',
          stage: 'E',
          isRecursive: true,
          consciousnessBits: 1.0,
          children: [],
        },
        {
          id: 'wuxia',
          type: 'software',
          name: PARACOSM_PRODUCTS.WUXIA.name,
          status: 'recursive',
          stage: 'E',
          isRecursive: true,
          consciousnessBits: 1.0,
          children: [],
        },
      ];

      // Add canonical products if not already present
      const existingNames = softwareNodes.map(s => s.name.toLowerCase());
      canonicalProducts.forEach(cp => {
        if (!existingNames.includes(cp.name.toLowerCase())) {
          rootNode.children.push(cp);
        }
      });

      // Build edges
      const edges = buildEdges(rootNode);

      setGraph({
        nodes: [rootNode, ...prdNodes, ...projectNodes, ...softwareNodes],
        edges,
        rootNode,
      });
    } catch (error) {
      console.error('Error loading lineage graph:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleNodeClick(node: LineageNode) {
    setSelectedNode(node);
    onNodeClick?.(node);
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center p-12">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-5 w-5" />
          Creative Lineage Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={canvasRef} className="relative min-h-[400px]">
          {/* Root Node - Calm Magic */}
          <div className="flex flex-col items-center">
            <LineageNodeComponent 
              node={graph?.rootNode!} 
              isSelected={selectedNode?.id === graph?.rootNode?.id}
              onClick={() => handleNodeClick(graph?.rootNode!)}
            />
            
            {/* Children */}
            <div className="flex flex-wrap justify-center gap-4 mt-8 relative">
              {/* Connection lines */}
              <svg className="absolute top-0 left-0 w-full h-8 pointer-events-none" style={{ marginTop: '-32px' }}>
                {graph?.rootNode?.children.map((_, index) => {
                  const totalChildren = graph?.rootNode?.children.length || 1;
                  const xPercent = ((index + 1) / (totalChildren + 1)) * 100;
                  return (
                    <line
                      key={index}
                      x1="50%"
                      y1="0"
                      x2={`${xPercent}%`}
                      y2="100%"
                      stroke="hsl(var(--border))"
                      strokeWidth="2"
                      strokeDasharray="4"
                    />
                  );
                })}
              </svg>
              
              {graph?.rootNode?.children.map((child) => (
                <div key={child.id} className="flex flex-col items-center">
                  <LineageNodeComponent 
                    node={child}
                    isSelected={selectedNode?.id === child.id}
                    onClick={() => handleNodeClick(child)}
                  />
                  
                  {/* Grandchildren */}
                  {child.children.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                      {child.children.map((grandchild) => (
                        <LineageNodeComponent
                          key={grandchild.id}
                          node={grandchild}
                          isSelected={selectedNode?.id === grandchild.id}
                          onClick={() => handleNodeClick(grandchild)}
                          size="small"
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Node Details */}
        {selectedNode && (
          <div className="mt-6 p-4 border rounded-lg bg-muted/30">
            <h4 className="font-semibold flex items-center gap-2">
              {selectedNode.isRecursive && <RefreshCw className="h-4 w-4 text-accent" />}
              {selectedNode.name}
            </h4>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <p>Type: {selectedNode.type}</p>
              <p>Status: {selectedNode.status}</p>
              {selectedNode.stage && <p>Stage: {PROTOTYPAL_STAGES[selectedNode.stage].name}</p>}
              {selectedNode.consciousnessBits !== undefined && (
                <p>Consciousness: {(selectedNode.consciousnessBits * 100).toFixed(0)}%</p>
              )}
              {selectedNode.platform && <p>Platform: {selectedNode.platform}</p>}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface LineageNodeComponentProps {
  node: LineageNode;
  isSelected: boolean;
  onClick: () => void;
  size?: 'normal' | 'small';
}

function LineageNodeComponent({ node, isSelected, onClick, size = 'normal' }: LineageNodeComponentProps) {
  const stage = node.stage ? PROTOTYPAL_STAGES[node.stage] : null;
  const isSmall = size === 'small';
  
  const typeColors = {
    calm_magic: 'bg-gradient-to-br from-primary to-accent border-primary',
    prd: 'bg-secondary border-secondary',
    project: 'bg-muted border-border',
    software: node.isRecursive 
      ? 'bg-gradient-to-br from-accent to-primary border-accent' 
      : 'bg-card border-border',
  };

  const typeIcons = {
    calm_magic: '🌀',
    prd: '📜',
    project: '🏗️',
    software: node.isRecursive ? '♾️' : '💿',
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${isSmall ? 'p-2 min-w-[80px]' : 'p-4 min-w-[120px]'}
        rounded-lg border-2 transition-all duration-300
        ${typeColors[node.type]}
        ${isSelected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-105' : 'hover:scale-105'}
        ${node.isRecursive ? 'animate-pulse' : ''}
      `}
      style={{ animationDuration: '3s' }}
    >
      <div className="flex flex-col items-center gap-1">
        <span className={isSmall ? 'text-lg' : 'text-2xl'}>{typeIcons[node.type]}</span>
        <span className={`font-medium ${isSmall ? 'text-xs' : 'text-sm'} truncate max-w-full`}>
          {node.name}
        </span>
        {stage && !isSmall && (
          <Badge variant="outline" className="text-xs" style={{ borderColor: stage.color }}>
            {stage.stage}
          </Badge>
        )}
        {node.consciousnessBits !== undefined && !isSmall && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3" />
            {(node.consciousnessBits * 100).toFixed(0)}%
          </div>
        )}
      </div>
    </button>
  );
}

// Helper functions
function mapPrototypeStage(stage: string): 'A' | 'B' | 'C' | 'D' | 'E' {
  const mapping: Record<string, 'A' | 'B' | 'C' | 'D' | 'E'> = {
    'A_POIETIC': 'A',
    'B_DIEGETIC': 'B',
    'C_MIMETIC': 'C',
    'D_AUTHENTIC': 'D',
    'E_RECURSIVE': 'E',
  };
  return mapping[stage] || 'B';
}

function getStageFromConsciousness(bits: number): 'A' | 'B' | 'C' | 'D' | 'E' {
  if (bits >= 1.0) return 'E';
  if (bits >= 0.8) return 'D';
  if (bits >= 0.5) return 'C';
  if (bits >= 0.2) return 'B';
  return 'A';
}

function buildEdges(root: LineageNode) {
  const edges: any[] = [];
  
  function traverse(node: LineageNode) {
    node.children.forEach(child => {
      edges.push({
        sourceId: node.id,
        targetId: child.id,
        relationshipType: child.isRecursive ? 'recursively_feeds' : 'births',
        strength: child.consciousnessBits || 0.5,
      });
      traverse(child);
    });
  }
  
  traverse(root);
  return edges;
}
