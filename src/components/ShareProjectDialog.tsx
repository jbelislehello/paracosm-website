import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Share2, UserPlus, Trash2, Loader2, Users } from 'lucide-react';
import { z } from 'zod';

interface Collaborator {
  id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'admin';
  email?: string;
}

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

const emailSchema = z.string().email('Please enter a valid email address');

export const ShareProjectDialog: React.FC<ShareProjectDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
}) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('editor');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Fetch existing collaborators
  useEffect(() => {
    if (open && projectId) {
      fetchCollaborators();
    }
  }, [open, projectId]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('project_collaborators')
        .select('id, user_id, role')
        .eq('project_id', projectId);

      if (error) throw error;
      setCollaborators((data || []) as Collaborator[]);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast.error('Failed to load collaborators');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCollaborator = async () => {
    // Validate email
    const validation = emailSchema.safeParse(email.trim());
    if (!validation.success) {
      setEmailError(validation.error.errors[0].message);
      return;
    }
    setEmailError('');

    setIsAdding(true);
    try {
      // First, find the user by email in auth.users (via profiles or a lookup)
      // Since we can't query auth.users directly, we need to check if user exists
      // For now, we'll store the email and let the system resolve it
      
      // Check if user exists by looking up their profile
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', email.trim())
        .maybeSingle();

      // Try to find user by checking if there's a profile with matching email
      // Since profiles don't have email, we need a different approach
      // We'll use a workaround: store the invite and let the user claim it

      // For simplicity, we'll check if the email matches a known user pattern
      // In production, you'd want an invitations table or edge function
      
      // Let's try to add by user_id if it's a UUID, otherwise show error
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      let userId = email.trim();
      
      // If it's not a UUID, we need to look up the user
      if (!uuidRegex.test(email.trim())) {
        // Call an edge function or RPC to find user by email
        // For now, show a helpful message
        toast.error('User not found. They need to create an account first, then share their user ID with you.');
        setIsAdding(false);
        return;
      }

      // Check if already a collaborator
      const existing = collaborators.find(c => c.user_id === userId);
      if (existing) {
        toast.error('This user is already a collaborator');
        setIsAdding(false);
        return;
      }

      // Add collaborator
      const { error } = await supabase
        .from('project_collaborators')
        .insert({
          project_id: projectId,
          user_id: userId,
          role: role,
        });

      if (error) throw error;

      toast.success('Collaborator added successfully');
      setEmail('');
      fetchCollaborators();
    } catch (error: any) {
      console.error('Error adding collaborator:', error);
      toast.error(error.message || 'Failed to add collaborator');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string) => {
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .delete()
        .eq('id', collaboratorId);

      if (error) throw error;

      toast.success('Collaborator removed');
      setCollaborators(prev => prev.filter(c => c.id !== collaboratorId));
    } catch (error) {
      console.error('Error removing collaborator:', error);
      toast.error('Failed to remove collaborator');
    }
  };

  const handleUpdateRole = async (collaboratorId: string, newRole: 'viewer' | 'editor' | 'admin') => {
    try {
      const { error } = await supabase
        .from('project_collaborators')
        .update({ role: newRole })
        .eq('id', collaboratorId);

      if (error) throw error;

      setCollaborators(prev => 
        prev.map(c => c.id === collaboratorId ? { ...c, role: newRole } : c)
      );
      toast.success('Role updated');
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Failed to update role');
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'editor': return 'default';
      default: return 'secondary';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Project
          </DialogTitle>
          <DialogDescription>
            Invite collaborators to "{projectName}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Add collaborator form */}
          <div className="space-y-3">
            <Label>Add collaborator by User ID</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="Enter user ID (UUID)"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  className={emailError ? 'border-destructive' : ''}
                />
                {emailError && (
                  <p className="text-xs text-destructive">{emailError}</p>
                )}
              </div>
              <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">Viewer</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleAddCollaborator} 
              disabled={!email.trim() || isAdding}
              className="w-full"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add Collaborator
            </Button>
            <p className="text-xs text-muted-foreground">
              Ask collaborators for their User ID from their profile settings.
            </p>
          </div>

          {/* Current collaborators */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Current Collaborators ({collaborators.length})
            </Label>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              </div>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No collaborators yet
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {collaborators.map((collab) => (
                  <div 
                    key={collab.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {collab.user_id.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm truncate max-w-[120px]" title={collab.user_id}>
                        {collab.user_id.slice(0, 8)}...
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select 
                        value={collab.role} 
                        onValueChange={(v) => handleUpdateRole(collab.id, v as typeof collab.role)}
                      >
                        <SelectTrigger className="h-7 w-20 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="viewer">Viewer</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveCollaborator(collab.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProjectDialog;
