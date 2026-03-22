

# Fix Security Warnings

## Database Migration

A single migration to add the missing RLS policies for 3 tables:

### 1. Journal entries — add DELETE policy
```sql
CREATE POLICY "Users can delete their own journal entries"
ON public.journal_entries FOR DELETE
USING (auth.uid() = user_id);
```

### 2. Team collaborations — add UPDATE and DELETE policies
```sql
CREATE POLICY "Users can update their own collaborations"
ON public.team_collaborations FOR UPDATE
USING (auth.uid() = collaborator_user_id);

CREATE POLICY "Users can delete their own collaborations"
ON public.team_collaborations FOR DELETE
USING (auth.uid() = collaborator_user_id);
```

### 3. Tolerance expansion events — add UPDATE and DELETE policies
```sql
CREATE POLICY "Users can update their own expansion events"
ON public.tolerance_expansion_events FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own expansion events"
ON public.tolerance_expansion_events FOR DELETE
USING (auth.uid() = user_id);
```

### 4. "Users can assign themselves admin role" — No action needed
The scan itself notes "No actionable escalation path found." The `user_roles` table correctly has no INSERT policy for non-admins, and `has_role` is always called with `auth.uid()`. This is a false positive.

### 5. Fabric vulnerability — No action needed in this migration
This is a supply chain issue with the `fabric` npm package. Would require upgrading or replacing it, which is a separate concern.

