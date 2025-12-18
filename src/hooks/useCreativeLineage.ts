import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PublishedSoftware, ProjectLineage, TargetPlatform, SoftwareStatus, ConsciousnessGeometrySnapshot } from '@/types/paracosm';
import { toast } from 'sonner';

// Helper to map database response to typed PublishedSoftware
function mapToPublishedSoftware(data: any): PublishedSoftware {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    source_project_id: data.source_project_id,
    source_prompt_id: data.source_prompt_id,
    target_platform: data.target_platform as TargetPlatform,
    deployment_url: data.deployment_url,
    status: data.status as SoftwareStatus,
    integration_strength: data.integration_strength || 0,
    is_recursive: data.is_recursive || false,
    lineage_depth: data.lineage_depth || 0,
    parent_software_id: data.parent_software_id,
    consciousness_geometry: data.consciousness_geometry as ConsciousnessGeometrySnapshot | undefined,
    created_at: data.created_at,
    updated_at: data.updated_at,
    user_id: data.user_id,
  };
}

export function useCreativeLineage(userId: string | null) {
  const [publishedSoftware, setPublishedSoftware] = useState<PublishedSoftware[]>([]);
  const [projectLineages, setProjectLineages] = useState<ProjectLineage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadLineageData = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    try {
      // Fetch published software
      const { data: softwareData, error: softwareError } = await supabase
        .from('published_software')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (softwareError) throw softwareError;
      setPublishedSoftware((softwareData || []).map(mapToPublishedSoftware));

      // Fetch projects with lineage columns
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', userId);

      if (projectsError) throw projectsError;
      
      // Map to ProjectLineage type
      const lineages: ProjectLineage[] = (projectsData || []).map((p: any) => ({
        id: p.id,
        project_name: p.project_name,
        garden: p.garden,
        mode: p.mode,
        source_prompt_id: p.source_prompt_id,
        target_platform: p.target_platform,
        product_status: p.product_status,
        parent_product_id: p.parent_product_id,
        consciousness_bits: p.consciousness_bits,
        convergence_state: p.convergence_state,
        prototypal_stage: p.prototypal_stage,
      }));

      setProjectLineages(lineages);
    } catch (error) {
      console.error('Error loading lineage data:', error);
      toast.error('Failed to load creative lineage');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadLineageData();
  }, [loadLineageData]);

  const createPublishedSoftware = useCallback(async (software: {
    name: string;
    description?: string;
    target_platform: TargetPlatform;
    deployment_url?: string;
    status: SoftwareStatus;
    is_recursive: boolean;
    integration_strength?: number;
    lineage_depth?: number;
    source_project_id?: string;
    source_prompt_id?: string;
    parent_software_id?: string;
  }) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from('published_software')
        .insert({
          name: software.name,
          description: software.description,
          target_platform: software.target_platform,
          deployment_url: software.deployment_url,
          status: software.status,
          is_recursive: software.is_recursive,
          integration_strength: software.integration_strength || 0,
          lineage_depth: software.lineage_depth || 0,
          source_project_id: software.source_project_id,
          source_prompt_id: software.source_prompt_id,
          parent_software_id: software.parent_software_id,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;
      
      const mapped = mapToPublishedSoftware(data);
      setPublishedSoftware(prev => [mapped, ...prev]);
      toast.success(`${software.name} has been born into the Paracosm!`);
      return mapped;
    } catch (error) {
      console.error('Error creating published software:', error);
      toast.error('Failed to create published software');
      return null;
    }
  }, [userId]);

  const updateSoftwareStatus = useCallback(async (id: string, status: SoftwareStatus, isRecursive?: boolean) => {
    try {
      const updates: any = { status };
      if (isRecursive !== undefined) {
        updates.is_recursive = isRecursive;
      }

      const { error } = await supabase
        .from('published_software')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      
      setPublishedSoftware(prev => 
        prev.map(sw => sw.id === id ? { ...sw, ...updates } : sw)
      );
      
      toast.success('Software status updated');
    } catch (error) {
      console.error('Error updating software status:', error);
      toast.error('Failed to update status');
    }
  }, []);

  const updateProjectLineage = useCallback(async (
    projectId: string, 
    updates: Partial<Pick<ProjectLineage, 'source_prompt_id' | 'target_platform' | 'product_status' | 'parent_product_id' | 'consciousness_bits' | 'convergence_state' | 'prototypal_stage'>>
  ) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId);

      if (error) throw error;
      
      setProjectLineages(prev => 
        prev.map(p => p.id === projectId ? { ...p, ...updates } : p)
      );
      
      toast.success('Project lineage updated');
    } catch (error) {
      console.error('Error updating project lineage:', error);
      toast.error('Failed to update project lineage');
    }
  }, []);

  const markAsRecursive = useCallback(async (softwareId: string) => {
    await updateSoftwareStatus(softwareId, 'recursive', true);
  }, [updateSoftwareStatus]);

  const getLineageTree = useCallback(() => {
    // Build a tree structure from projects and software
    const tree: ProjectLineage[] = [];
    
    // Get root projects (no parent)
    const rootProjects = projectLineages.filter(p => !p.parent_product_id);
    
    rootProjects.forEach(root => {
      const children = projectLineages.filter(p => p.parent_product_id === root.id);
      const software = publishedSoftware.filter(s => s.source_project_id === root.id);
      
      tree.push({
        ...root,
        children,
        published_software: software,
      });
    });

    return tree;
  }, [projectLineages, publishedSoftware]);

  const getRecursiveProducts = useCallback(() => {
    return publishedSoftware.filter(sw => sw.is_recursive);
  }, [publishedSoftware]);

  const calculateTotalConsciousnessBits = useCallback(() => {
    const projectBits = projectLineages.reduce((sum, p) => sum + (p.consciousness_bits || 0), 0);
    const softwareBits = publishedSoftware.reduce((sum, s) => sum + (s.integration_strength || 0), 0);
    return projectBits + softwareBits;
  }, [projectLineages, publishedSoftware]);

  return {
    publishedSoftware,
    projectLineages,
    loading,
    createPublishedSoftware,
    updateSoftwareStatus,
    updateProjectLineage,
    markAsRecursive,
    getLineageTree,
    getRecursiveProducts,
    calculateTotalConsciousnessBits,
    refresh: loadLineageData,
  };
}
