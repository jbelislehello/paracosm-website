// Framework Validation Access Utility
// Controls access to OECD and governance framework validation based on journey progress

import { Season, PrdAccessLevel, getPrdAccessLevel } from './prdAccessLevel';
import { isFrameworkEligibleGarden } from '@/data/oecdFramework';

export type FrameworkValidationLevel = 'locked' | 'preview' | 'partial' | 'full';

export interface FrameworkValidationInput {
  prdAccessLevel: PrdAccessLevel;
  garden: string;
  completedSeasons: Season[];
  fragmentsByLayer: Record<Season, number>;
  wasForced: boolean;
  totalTilesExplored: number;
}

export interface FrameworkValidationResult {
  level: FrameworkValidationLevel;
  canAccessOECD: boolean;
  canAccessGovernanceLayers: boolean;
  canGeneratePlaybooks: boolean;
  unlockReason: string | null;
  lockReason: string | null;
  progressToNextLevel: number; // 0-100
}

/**
 * Calculate the framework validation access level based on journey progress
 */
export function getFrameworkValidationAccess(input: FrameworkValidationInput): FrameworkValidationResult {
  const { prdAccessLevel, garden, completedSeasons, fragmentsByLayer, wasForced, totalTilesExplored } = input;

  // Base check: Garden eligibility
  if (!isFrameworkEligibleGarden(garden)) {
    return {
      level: 'locked',
      canAccessOECD: false,
      canAccessGovernanceLayers: false,
      canGeneratePlaybooks: false,
      unlockReason: null,
      lockReason: `Framework validation is only available in the Garden of Systems. You are currently in the Garden of ${garden.charAt(0).toUpperCase() + garden.slice(1)}.`,
      progressToNextLevel: 0
    };
  }

  // Check if PRD was force-generated
  if (wasForced) {
    return {
      level: 'locked',
      canAccessOECD: false,
      canAccessGovernanceLayers: false,
      canGeneratePlaybooks: false,
      unlockReason: null,
      lockReason: 'Framework validation is not available for force-generated PRDs. Complete the journey organically to unlock validation.',
      progressToNextLevel: 0
    };
  }

  // Check PRD access level
  if (prdAccessLevel === 'hidden') {
    return {
      level: 'locked',
      canAccessOECD: false,
      canAccessGovernanceLayers: false,
      canGeneratePlaybooks: false,
      unlockReason: null,
      lockReason: 'Start exploring tiles and collecting fragments to unlock framework validation.',
      progressToNextLevel: Math.min((totalTilesExplored / 4) * 100, 100)
    };
  }

  // Preview level: prdAccessLevel is 'preview' and some progress
  if (prdAccessLevel === 'preview') {
    const totalFragments = Object.values(fragmentsByLayer).reduce((a, b) => a + b, 0);
    return {
      level: 'preview',
      canAccessOECD: true,
      canAccessGovernanceLayers: false,
      canGeneratePlaybooks: false,
      unlockReason: 'You can now preview the OECD framework dimensions.',
      lockReason: 'Complete at least one season to unlock Governance Layers.',
      progressToNextLevel: Math.min((totalFragments / 10) * 100, 100)
    };
  }

  // Partial level: At least 1 season complete, not forced
  if (prdAccessLevel === 'draft' && completedSeasons.length >= 1) {
    const layersWithEnoughFragments = Object.values(fragmentsByLayer).filter(count => count >= 5).length;
    return {
      level: 'partial',
      canAccessOECD: true,
      canAccessGovernanceLayers: true,
      canGeneratePlaybooks: false,
      unlockReason: 'OECD dimensions and Governance Layers are now available.',
      lockReason: 'Complete 2+ seasons with 5+ fragments each to generate playbooks.',
      progressToNextLevel: Math.min((layersWithEnoughFragments / 3) * 100, 100)
    };
  }

  // Check for full access: 2+ seasons complete with sufficient fragments
  if (prdAccessLevel === 'ready' || prdAccessLevel === 'complete') {
    const seasonsWithEnoughFragments = Object.entries(fragmentsByLayer)
      .filter(([_, count]) => count >= 5).length;
    
    if (completedSeasons.length >= 2 && seasonsWithEnoughFragments >= 2) {
      return {
        level: 'full',
        canAccessOECD: true,
        canAccessGovernanceLayers: true,
        canGeneratePlaybooks: true,
        unlockReason: 'Full framework validation is unlocked! You can generate governance playbooks.',
        lockReason: null,
        progressToNextLevel: 100
      };
    }
  }

  // Default to partial if we have some progress but not full
  if (completedSeasons.length >= 1) {
    return {
      level: 'partial',
      canAccessOECD: true,
      canAccessGovernanceLayers: true,
      canGeneratePlaybooks: false,
      unlockReason: 'OECD dimensions and Governance Layers are available.',
      lockReason: 'Complete more seasons with sufficient fragments to unlock playbook generation.',
      progressToNextLevel: Math.min((completedSeasons.length / 2) * 100, 100)
    };
  }

  // Fallback to preview
  return {
    level: 'preview',
    canAccessOECD: true,
    canAccessGovernanceLayers: false,
    canGeneratePlaybooks: false,
    unlockReason: 'Preview mode active.',
    lockReason: 'Complete at least one season to unlock more features.',
    progressToNextLevel: 50
  };
}

/**
 * Quick check if OECD framework is accessible
 */
export function canAccessOECDFramework(input: FrameworkValidationInput): boolean {
  const result = getFrameworkValidationAccess(input);
  return result.canAccessOECD;
}

/**
 * Quick check if governance playbooks can be generated
 */
export function canGenerateGovernancePlaybooks(input: FrameworkValidationInput): boolean {
  const result = getFrameworkValidationAccess(input);
  return result.canGeneratePlaybooks;
}

/**
 * Get a human-readable description of the current access level
 */
export function getAccessLevelDescription(level: FrameworkValidationLevel): string {
  switch (level) {
    case 'locked':
      return 'Framework validation is currently locked. Continue your journey to unlock.';
    case 'preview':
      return 'You can preview the OECD framework dimensions. Complete more of your journey to unlock full features.';
    case 'partial':
      return 'OECD dimensions and Governance Layers are available. Keep progressing to unlock playbook generation.';
    case 'full':
      return 'Full framework validation is unlocked. You can map insights and generate governance playbooks.';
  }
}
