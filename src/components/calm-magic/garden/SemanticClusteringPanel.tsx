import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, Loader2, Network, AlertCircle } from 'lucide-react';
import { useSemanticClustering } from '@/hooks/useSemanticClustering';
import { ClusterVisualization } from './ClusterVisualization';
import { NoemSuggestionCard } from './NoemSuggestionCard';

interface SemanticClusteringPanelProps {
  userId: string | null;
  projectId?: string | null;
  onNoemCreated?: () => void;
}

export function SemanticClusteringPanel({ userId, projectId, onNoemCreated }: SemanticClusteringPanelProps) {
  const {
    clusters,
    fragments,
    isAnalyzing,
    error,
    analyzeClusters,
    crystallizeNoem,
    crystallizedIds
  } = useSemanticClustering(userId, projectId);

  const [selectedClusterId, setSelectedClusterId] = useState<string | null>(null);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    await analyzeClusters();
    setHasAnalyzed(true);
  };

  const handleCrystallize = async (cluster: any) => {
    const success = await crystallizeNoem(cluster);
    if (success) {
      onNoemCreated?.();
    }
    return success;
  };

  // Filter to show selected cluster first if one is selected
  const sortedClusters = selectedClusterId
    ? [...clusters].sort((a, b) => {
        if (a.id === selectedClusterId) return -1;
        if (b.id === selectedClusterId) return 1;
        return 0;
      })
    : clusters;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Semantic Clustering</CardTitle>
            {clusters.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {clusters.length} clusters
              </Badge>
            )}
          </div>
          <Button
            variant={hasAnalyzed ? "outline" : "default"}
            size="sm"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !userId}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : hasAnalyzed ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-analyze
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Analyze Clusters
              </>
            )}
          </Button>
        </div>
        <CardDescription>
          AI-powered analysis groups similar fragments and suggests NOEM crystallizations
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error State */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!hasAnalyzed && !isAnalyzing && clusters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              Click "Analyze Clusters" to discover semantic patterns in your fragments
            </p>
            <p className="text-xs mt-1 opacity-70">
              Requires at least 3 saved fragments
            </p>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Analyzing {fragments.length} fragments for semantic clusters...
            </p>
          </div>
        )}

        {/* Results */}
        {!isAnalyzing && clusters.length > 0 && (
          <>
            {/* Visualization */}
            <ClusterVisualization
              clusters={clusters}
              fragments={fragments}
              selectedClusterId={selectedClusterId}
              onClusterSelect={setSelectedClusterId}
            />

            {/* Cluster Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {sortedClusters.map((cluster) => (
                <NoemSuggestionCard
                  key={cluster.id}
                  cluster={cluster}
                  fragments={fragments}
                  onCrystallize={handleCrystallize}
                  isCrystallized={crystallizedIds.has(cluster.id)}
                />
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 pt-2 text-xs text-muted-foreground">
              <span>{fragments.length} fragments analyzed</span>
              <span>•</span>
              <span>{clusters.length} clusters found</span>
              <span>•</span>
              <span>{crystallizedIds.size} crystallized</span>
            </div>
          </>
        )}

        {/* No Clusters Found */}
        {hasAnalyzed && !isAnalyzing && clusters.length === 0 && !error && (
          <div className="text-center py-8 text-muted-foreground">
            <Network className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No distinct clusters found</p>
            <p className="text-xs mt-1 opacity-70">
              Try adding more diverse fragments to discover patterns
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
