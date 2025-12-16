import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ManifoldEntry } from '@/hooks/useManifoldData';

export interface SemanticConnection {
  sourceId: string;
  targetId: string;
  strength: number; // 0-1
  relationshipType: 'tag_overlap' | 'semantic_similarity' | 'temporal_proximity' | 'tile_adjacency';
  sharedTags?: string[];
}

export interface SemanticNode {
  id: string;
  entry: ManifoldEntry;
  cluster?: number;
  importance: number;
}

export interface SemanticGraph {
  nodes: SemanticNode[];
  links: SemanticConnection[];
}

interface UseSemanticConnectionsReturn {
  connections: SemanticConnection[];
  graph: SemanticGraph | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Calculate tag overlap between two entries
function calculateTagOverlap(entry1: ManifoldEntry, entry2: ManifoldEntry): number {
  if (entry1.tags.length === 0 || entry2.tags.length === 0) return 0;
  
  const tags1 = new Set(entry1.tags.map(t => t.toLowerCase()));
  const tags2 = new Set(entry2.tags.map(t => t.toLowerCase()));
  
  let overlap = 0;
  tags1.forEach(tag => {
    if (tags2.has(tag)) overlap++;
  });
  
  const union = new Set([...tags1, ...tags2]).size;
  return overlap / union; // Jaccard similarity
}

// Calculate temporal proximity (entries close in time are related)
function calculateTemporalProximity(entry1: ManifoldEntry, entry2: ManifoldEntry): number {
  const time1 = new Date(entry1.createdAt).getTime();
  const time2 = new Date(entry2.createdAt).getTime();
  const diffHours = Math.abs(time1 - time2) / (1000 * 60 * 60);
  
  // Exponential decay: entries within 24 hours are closely related
  return Math.exp(-diffHours / 24);
}

// Calculate tile adjacency (entries on nearby tiles)
function calculateTileAdjacency(entry1: ManifoldEntry, entry2: ManifoldEntry): number {
  const rowDiff = Math.abs(entry1.row - entry2.row);
  const colDiff = Math.abs(entry1.col - entry2.col);
  
  // Manhattan distance, normalized
  const distance = rowDiff + colDiff;
  if (distance === 0) return 1;
  if (distance === 1) return 0.8;
  if (distance === 2) return 0.5;
  return Math.max(0, 1 - distance * 0.1);
}

// Simple word overlap for basic semantic similarity
function calculateWordOverlap(entry1: ManifoldEntry, entry2: ManifoldEntry): number {
  const words1 = new Set(
    entry1.content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  const words2 = new Set(
    entry2.content.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 3)
  );
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  let overlap = 0;
  words1.forEach(word => {
    if (words2.has(word)) overlap++;
  });
  
  const minSize = Math.min(words1.size, words2.size);
  return overlap / minSize;
}

export function useSemanticConnections(
  entries: ManifoldEntry[],
  minStrength: number = 0.3,
  maxConnections: number = 100
): UseSemanticConnectionsReturn {
  const [aiConnections, setAiConnections] = useState<SemanticConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate local connections (tag overlap, temporal, adjacency)
  const localConnections = useMemo(() => {
    const connections: SemanticConnection[] = [];
    
    for (let i = 0; i < entries.length; i++) {
      for (let j = i + 1; j < entries.length; j++) {
        const entry1 = entries[i];
        const entry2 = entries[j];
        
        // Tag overlap
        const tagStrength = calculateTagOverlap(entry1, entry2);
        if (tagStrength >= minStrength) {
          const sharedTags = entry1.tags.filter(t => 
            entry2.tags.map(t2 => t2.toLowerCase()).includes(t.toLowerCase())
          );
          connections.push({
            sourceId: entry1.id,
            targetId: entry2.id,
            strength: tagStrength,
            relationshipType: 'tag_overlap',
            sharedTags
          });
        }
        
        // Word overlap (basic semantic)
        const wordStrength = calculateWordOverlap(entry1, entry2);
        if (wordStrength >= minStrength && tagStrength < minStrength) {
          connections.push({
            sourceId: entry1.id,
            targetId: entry2.id,
            strength: wordStrength * 0.8, // Slightly lower weight than tags
            relationshipType: 'semantic_similarity'
          });
        }
        
        // Temporal proximity (only for entries without other connections)
        const temporalStrength = calculateTemporalProximity(entry1, entry2);
        if (temporalStrength >= 0.5 && tagStrength < minStrength && wordStrength < minStrength) {
          connections.push({
            sourceId: entry1.id,
            targetId: entry2.id,
            strength: temporalStrength * 0.6,
            relationshipType: 'temporal_proximity'
          });
        }
      }
    }
    
    // Sort by strength and limit
    return connections
      .sort((a, b) => b.strength - a.strength)
      .slice(0, maxConnections);
  }, [entries, minStrength, maxConnections]);

  // Fetch AI-powered semantic analysis
  const fetchAiConnections = async () => {
    if (entries.length < 2) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('analyze-insights', {
        body: {
          entries: entries.map(e => ({
            id: e.id,
            content: e.content,
            tags: e.tags,
            tile_id: e.tileId
          }))
        }
      });
      
      if (fnError) throw fnError;
      
      if (data?.links) {
        const aiConns: SemanticConnection[] = data.links.map((link: any) => ({
          sourceId: link.source,
          targetId: link.target,
          strength: link.strength || 0.5,
          relationshipType: 'semantic_similarity' as const
        }));
        setAiConnections(aiConns);
      }
    } catch (err) {
      console.error('Failed to fetch AI connections:', err);
      setError(err instanceof Error ? err.message : 'Failed to analyze connections');
    } finally {
      setIsLoading(false);
    }
  };

  // Combine local and AI connections
  const allConnections = useMemo(() => {
    const combined = [...localConnections];
    
    // Add AI connections that don't duplicate local ones
    aiConnections.forEach(aiConn => {
      const exists = combined.some(
        c => (c.sourceId === aiConn.sourceId && c.targetId === aiConn.targetId) ||
             (c.sourceId === aiConn.targetId && c.targetId === aiConn.sourceId)
      );
      if (!exists) {
        combined.push(aiConn);
      }
    });
    
    return combined
      .sort((a, b) => b.strength - a.strength)
      .slice(0, maxConnections);
  }, [localConnections, aiConnections, maxConnections]);

  // Build graph structure
  const graph = useMemo((): SemanticGraph | null => {
    if (entries.length === 0) return null;
    
    // Calculate node importance based on connections
    const connectionCounts = new Map<string, number>();
    allConnections.forEach(conn => {
      connectionCounts.set(conn.sourceId, (connectionCounts.get(conn.sourceId) || 0) + conn.strength);
      connectionCounts.set(conn.targetId, (connectionCounts.get(conn.targetId) || 0) + conn.strength);
    });
    
    const maxImportance = Math.max(...connectionCounts.values(), 1);
    
    const nodes: SemanticNode[] = entries.map(entry => ({
      id: entry.id,
      entry,
      importance: (connectionCounts.get(entry.id) || 0) / maxImportance
    }));
    
    return {
      nodes,
      links: allConnections
    };
  }, [entries, allConnections]);

  return {
    connections: allConnections,
    graph,
    isLoading,
    error,
    refetch: fetchAiConnections
  };
}
