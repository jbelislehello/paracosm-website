/**
 * Development-only warning utility for data isolation issues.
 * Warns when project-scoped data is saved without a project_id.
 */

const isDev = import.meta.env.DEV;

type ProjectScopedTable = 
  | 'polen_entries' 
  | 'prds' 
  | 'noems' 
  | 'poems'
  | 'project_season_progress'
  | 'journal_entries';

/**
 * Warns in development mode when project-scoped data is saved without a project_id
 * by an authenticated user. This helps catch data isolation issues early.
 */
export function warnIfMissingProjectId(
  table: ProjectScopedTable,
  projectId: string | null | undefined,
  userId: string | null | undefined,
  context?: string
): void {
  if (!isDev) return; // Only warn in development
  if (!userId) return; // Not authenticated, no warning needed
  
  if (!projectId) {
    console.warn(
      `⚠️ [Data Isolation Warning] Saving to "${table}" without project_id\n` +
      `   User: ${userId}\n` +
      `   Context: ${context || 'Unknown'}\n` +
      `   This may cause data to leak across projects.\n` +
      `   Consider passing a projectId to properly scope this data.`
    );
    
    // Also log stack trace for easier debugging
    console.trace('Stack trace for missing project_id:');
  }
}

/**
 * Validates that project_id is present for project-scoped operations.
 * Returns true if valid, false otherwise.
 * Can optionally throw in strict mode for testing.
 */
export function validateProjectScope(
  projectId: string | null | undefined,
  userId: string | null | undefined,
  operation: string,
  strict: boolean = false
): boolean {
  if (!isDev) return true;
  if (!userId) return true;
  
  const isValid = !!projectId;
  
  if (!isValid) {
    const message = `[Data Isolation] Operation "${operation}" attempted without project_id for authenticated user`;
    if (strict) {
      throw new Error(message);
    }
  }
  
  return isValid;
}
