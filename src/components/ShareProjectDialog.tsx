import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Share2, UserPlus, Trash2, Loader2, Users, Mail, Clock } from 'lucide-react';
import { z } from 'zod';

interface CollaboratorProfile {
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
}

interface Collaborator {
  id: string;
  user_id: string;
  role: 'viewer' | 'editor' | 'admin';
  profiles: CollaboratorProfile | null;
}

interface PendingInvitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

interface ShareProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
}

const emailSchema = z.string().email();
const uuidSchema = z.string().uuid();

export const ShareProjectDialog: React.FC<ShareProjectDialogProps> = ({
  open,
  onOpenChange,
  projectId,
  projectName,
}) => {
  const [input, setInput] = useState('');
  const [role, setRole] = useState<'viewer' | 'editor' | 'admin'>('editor');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<PendingInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inputError, setInputError] = useState('');

  // Fetch existing collaborators and pending invitations
  useEffect(() => {
    if (open && projectId) {
      fetchCollaborators();
      fetchPendingInvitations();
    }
  }, [open, projectId]);

  const fetchCollaborators = async () => {
    setIsLoading(true);
    try {
      // First fetch collaborators
      const { data: collabData, error: collabError } = await supabase
        .from('project_collaborators')
        .select('id, user_id, role')
        .eq('project_id', projectId);

      if (collabError) throw collabError;

      if (!collabData || collabData.length === 0) {
        setCollaborators([]);
        return;
      }

      // Then fetch profiles for all collaborators
      const userIds = collabData.map(c => c.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, full_name, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Merge collaborators with their profiles
      const collaboratorsWithProfiles: Collaborator[] = collabData.map(collab => {
        const profile = profilesData?.find(p => p.id === collab.user_id);
        return {
          id: collab.id,
          user_id: collab.user_id,
          role: collab.role as 'viewer' | 'editor' | 'admin',
          profiles: profile ? {
            username: profile.username,
            full_name: profile.full_name,
            avatar_url: profile.avatar_url,
          } : null,
        };
      });

      setCollaborators(collaboratorsWithProfiles);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      toast.error('Failed to load collaborators');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPendingInvitations = async () => {
    try {
      const { data, error } = await supabase
        .from('project_invitations')
        .select('id, email, role, status, created_at')
        .eq('project_id', projectId)
        .eq('status', 'pending');

      if (error) throw error;
      setPendingInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    }
  };

  const handleAddCollaborator = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setInputError('');
    setIsAdding(true);

    try {
      const isEmail = emailSchema.safeParse(trimmedInput).success;
      const isUUID = uuidSchema.safeParse(trimmedInput).success;

      if (isEmail) {
        // Check if already invited
        const existingInvite = pendingInvitations.find(
          inv => inv.email.toLowerCase() === trimmedInput.toLowerCase()
        );
        if (existingInvite) {
          toast.error('This email already has a pending invitation');
          setIsAdding(false);
          return;
        }

        // Call edge function to check if user exists
        const { data: lookupData, error: lookupError } = await supabase.functions.invoke(
          'lookup-user-by-email',
          { body: { email: trimmedInput } }
        );

        if (lookupError) throw lookupError;

        if (lookupData?.exists && lookupData?.userId) {
          // User exists - add as collaborator directly
          await addCollaboratorById(lookupData.userId);
        } else {
          // User doesn't exist - create pending invitation
          await createPendingInvitation(trimmedInput);
        }
      } else if (isUUID) {
        // Direct UUID entry
        await addCollaboratorById(trimmedInput);
      } else {
        setInputError('Please enter a valid email address or user ID');
        setIsAdding(false);
        return;
      }

      setInput('');
      fetchCollaborators();
      fetchPendingInvitations();
    } catch (error: any) {
      console.error('Error adding collaborator:', error);
      toast.error(error.message || 'Failed to add collaborator');
    } finally {
      setIsAdding(false);
    }
  };

  const addCollaboratorById = async (userId: string) => {
    // Check if already a collaborator
    const existing = collaborators.find(c => c.user_id === userId);
    if (existing) {
      toast.error('This user is already a collaborator');
      return;
    }

    const { error } = await supabase
      .from('project_collaborators')
      .insert({
        project_id: projectId,
        user_id: userId,
        role: role,
      });

    if (error) throw error;
    toast.success('Collaborator added successfully');
  };

  const createPendingInvitation = async (email: string) => {
    const { data: userData } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from('project_invitations')
      .insert({
        project_id: projectId,
        email: email.toLowerCase(),
        role: role,
        invited_by: userData.user?.id,
      });

    if (error) {
      if (error.code === '23505') {
        toast.error('An invitation already exists for this email');
        return;
      }
      throw error;
    }
    
    toast.success('Invitation created! They will be added when they sign up.');
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

  const handleCancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('project_invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast.success('Invitation cancelled');
      setPendingInvitations(prev => prev.filter(i => i.id !== invitationId));
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
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

  const getDisplayName = (collab: Collaborator): string => {
    if (collab.profiles?.full_name) return collab.profiles.full_name;
    if (collab.profiles?.username) return collab.profiles.username;
    return collab.user_id.slice(0, 8) + '...';
  };

  const getInitials = (collab: Collaborator): string => {
    if (collab.profiles?.full_name) {
      return collab.profiles.full_name
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();
    }
    if (collab.profiles?.username) {
      return collab.profiles.username.slice(0, 2).toUpperCase();
    }
    return collab.user_id.slice(0, 2).toUpperCase();
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
            <Label>Add collaborator</Label>
            <div className="flex gap-2">
              <div className="flex-1 space-y-1">
                <Input
                  placeholder="Enter email address or user ID"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    setInputError('');
                  }}
                  className={inputError ? 'border-destructive' : ''}
                />
                {inputError && (
                  <p className="text-xs text-destructive">{inputError}</p>
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
              disabled={!input.trim() || isAdding}
              className="w-full"
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <UserPlus className="w-4 h-4 mr-2" />
              )}
              Add Collaborator
            </Button>
          </div>

          {/* Pending Invitations */}
          {pendingInvitations.length > 0 && (
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Invitations ({pendingInvitations.length})
              </Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {pendingInvitations.map((invitation) => (
                  <div 
                    key={invitation.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-amber-500/10 border border-amber-500/20"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-sm truncate block" title={invitation.email}>
                          {invitation.email}
                        </span>
                        <Badge variant="outline" className="text-xs mt-0.5">
                          {invitation.role}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => handleCancelInvitation(invitation.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

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
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={collab.profiles?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {getInitials(collab)}
                        </AvatarFallback>
                      </Avatar>
                      <span 
                        className="text-sm truncate max-w-[140px]" 
                        title={collab.profiles?.full_name || collab.profiles?.username || collab.user_id}
                      >
                        {getDisplayName(collab)}
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
