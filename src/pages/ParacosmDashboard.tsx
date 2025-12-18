import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Plus, RefreshCw, GitBranch, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useCreativeLineage } from '@/hooks/useCreativeLineage';
import { CreativeLineageGraph } from '@/components/paracosm/CreativeLineageGraph';
import { PublishedSoftwareCard } from '@/components/paracosm/PublishedSoftwareCard';
import { CreateSoftwareForm } from '@/components/paracosm/CreateSoftwareForm';
import { ParacosmMetrics } from '@/components/paracosm/ParacosmMetrics';
import { CanonicalProductsSection } from '@/components/paracosm/CanonicalProductsSection';
import { PARACOSM_PRODUCTS, PublishedSoftware, TargetPlatform, SoftwareStatus } from '@/types/paracosm';

const ParacosmDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  
  const {
    publishedSoftware,
    loading,
    refresh,
    createPublishedSoftware,
    updateSoftwareStatus,
    markAsRecursive,
    calculateTotalConsciousnessBits,
    getRecursiveProducts,
  } = useCreativeLineage(userId);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  const handleCreateSoftware = async (data: {
    name: string;
    description: string;
    target_platform: TargetPlatform;
    deployment_url: string;
    status: SoftwareStatus;
    is_recursive: boolean;
  }) => {
    if (!user) return;
    
    const success = await createPublishedSoftware({
      name: data.name,
      description: data.description,
      target_platform: data.target_platform,
      deployment_url: data.deployment_url || undefined,
      status: data.status,
      is_recursive: data.is_recursive,
    });

    if (success) {
      setShowCreateDialog(false);
      toast.success('Software has been born into your lineage!');
    }
  };

  const handleActivateCanonical = async (productKey: string) => {
    if (!user) return;
    
    const product = PARACOSM_PRODUCTS[productKey as keyof typeof PARACOSM_PRODUCTS];
    if (!product) return;

    // Check if already exists
    const exists = publishedSoftware.some(
      s => s.name.toLowerCase() === product.name.toLowerCase()
    );
    
    if (exists) {
      toast.info(`${product.name} is already in your lineage`);
      return;
    }

    const success = await createPublishedSoftware({
      name: product.name,
      description: product.description,
      target_platform: product.targetPlatforms[0],
      status: 'alive',
      is_recursive: product.isRecursive,
    });

    if (success) {
      toast.success(`${product.name} activated in your lineage!`);
    }
  };

  const handleRefresh = () => {
    refresh();
    toast.success('Lineage refreshed');
  };

  const filteredSoftware = publishedSoftware.filter(software => {
    if (statusFilter !== 'all' && software.status !== statusFilter) return false;
    if (platformFilter !== 'all' && software.target_platform !== platformFilter) return false;
    return true;
  });

  const recursiveProducts = getRecursiveProducts();
  const totalBits = calculateTotalConsciousnessBits();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/calm-magic-board')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <GitBranch className="h-6 w-6 text-primary" />
                  Paracosm Creative Lineage
                </h1>
                <p className="text-sm text-muted-foreground">
                  {publishedSoftware.length} products · {recursiveProducts.length} recursive · {totalBits.toFixed(1)} consciousness bits
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Birth Software
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Metrics Summary */}
        <ParacosmMetrics
          totalSoftware={publishedSoftware.length}
          recursiveCount={recursiveProducts.length}
          consciousnessBits={totalBits}
          platforms={[...new Set(publishedSoftware.map(s => s.target_platform))]}
        />

        {/* Creative Lineage Graph */}
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Creative Lineage Graph
          </h2>
          <CreativeLineageGraph
            userId={user?.id}
            onNodeClick={setSelectedNode}
          />
        </section>

        {/* Canonical Products */}
        <CanonicalProductsSection
          activatedProducts={publishedSoftware.map(s => s.name.toLowerCase())}
          onActivate={handleActivateCanonical}
        />

        {/* Published Software Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Your Software</h2>
            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-sm border border-border rounded-md px-3 py-1.5 bg-background"
              >
                <option value="all">All Status</option>
                <option value="incubating">Incubating</option>
                <option value="alive">Alive</option>
                <option value="archived">Archived</option>
                <option value="recursive">Recursive</option>
              </select>
              <select
                value={platformFilter}
                onChange={(e) => setPlatformFilter(e.target.value)}
                className="text-sm border border-border rounded-md px-3 py-1.5 bg-background"
              >
                <option value="all">All Platforms</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="api">API</option>
                <option value="embedded">Embedded</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredSoftware.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-border rounded-xl">
              <GitBranch className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No software yet</h3>
              <p className="text-muted-foreground mb-4">
                Birth your first software or activate a canonical product
              </p>
              <Button onClick={() => setShowCreateDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Birth Software
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredSoftware.map((software) => (
                <PublishedSoftwareCard
                  key={software.id}
                  software={software}
                  onClick={() => setSelectedNode(software)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Create Software Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Birth New Software</DialogTitle>
          </DialogHeader>
          <CreateSoftwareForm
            onSubmit={handleCreateSoftware}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParacosmDashboard;
