import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Mail, Check, X, Clock, Users } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useUserSession } from '@/hooks/useUserSession';

interface Invitation {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
  project_id: string;
  invited_by: string;
  project?: {
    id: string;
    project_name: string;
    garden: string;
  };
  inviter?: {
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
  };
}

export const MyInvitations: React.FC = () => {
  const { user } = useUserSession();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    if (user?.email) {
      fetchInvitations();
    }
  }, [user?.email]);

  const fetchInvitations = async () => {
    if (!user?.email) return;

    try {
      // Fetch pending invitations for this user's email
      const { data: invitationsData, error } = await supabase
        .from('project_invitations')
        .select('*')
        .eq('status', 'pending')
        .ilike('email', user.email);

      if (error) throw error;

      if (!invitationsData || invitationsData.length === 0) {
        setInvitations([]);
        setLoading(false);
        return;
      }

      // Fetch project details
      const projectIds = invitationsData.map(inv => inv.project_id);
      const { data: projects } = await supabase
        .from('projects')
        .select('id, project_name, garden')
        .in('id', projectIds);

      // Fetch inviter profiles
      const inviterIds = invitationsData.map(inv => inv.invited_by);
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, username, avatar_url')
        .in('id', inviterIds);

      // Combine data
      const enrichedInvitations = invitationsData.map(inv => ({
        ...inv,
        project: projects?.find(p => p.id === inv.project_id),
        inviter: profiles?.find(p => p.id === inv.invited_by),
      }));

      setInvitations(enrichedInvitations);
    } catch (error) {
      console.error('Error fetching invitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitation: Invitation) => {
    if (!user) return;
    setProcessing(invitation.id);

    try {
      // Add as collaborator
      const { error: collabError } = await supabase
        .from('project_collaborators')
        .insert({
          project_id: invitation.project_id,
          user_id: user.id,
          role: invitation.role,
        });

      if (collabError) throw collabError;

      // Update invitation status
      const { error: updateError } = await supabase
        .from('project_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      if (updateError) throw updateError;

      toast.success(`You are now a ${invitation.role} on "${invitation.project?.project_name}"`);
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    } catch (error: any) {
      console.error('Error accepting invitation:', error);
      toast.error(error.message || 'Failed to accept invitation');
    } finally {
      setProcessing(null);
    }
  };

  const handleDecline = async (invitation: Invitation) => {
    setProcessing(invitation.id);

    try {
      const { error } = await supabase
        .from('project_invitations')
        .update({ status: 'declined' })
        .eq('id', invitation.id);

      if (error) throw error;

      toast.success('Invitation declined');
      setInvitations(prev => prev.filter(inv => inv.id !== invitation.id));
    } catch (error: any) {
      console.error('Error declining invitation:', error);
      toast.error(error.message || 'Failed to decline invitation');
    } finally {
      setProcessing(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string | null, email?: string) => {
    if (name) {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return email?.charAt(0).toUpperCase() || '?';
  };

  if (loading || !user || invitations.length === 0) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 pb-4">
      <div className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-pink-500/5 rounded-xl border border-primary/20 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Mail className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold text-sm">
            Pending Invitations
          </h3>
          <Badge variant="secondary" className="ml-auto">
            {invitations.length}
          </Badge>
        </div>

        <div className="space-y-2">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="bg-background/50 border-border/50">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm truncate">
                        {invitation.project?.project_name || 'Unknown Project'}
                      </span>
                      <Badge variant="outline" className="text-xs capitalize">
                        {invitation.role}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Avatar className="w-4 h-4">
                          <AvatarImage src={invitation.inviter?.avatar_url || undefined} />
                          <AvatarFallback className="text-[8px]">
                            {getInitials(invitation.inviter?.full_name || invitation.inviter?.username)}
                          </AvatarFallback>
                        </Avatar>
                        <span>
                          {invitation.inviter?.full_name || invitation.inviter?.username || 'Someone'}
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(invitation.created_at)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8"
                      onClick={() => handleDecline(invitation)}
                      disabled={processing === invitation.id}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline ml-1">Decline</span>
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 bg-gradient-to-r from-primary to-purple-600"
                      onClick={() => handleAccept(invitation)}
                      disabled={processing === invitation.id}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline ml-1">Accept</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
