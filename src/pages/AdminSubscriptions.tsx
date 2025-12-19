import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Shield,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  Check,
  X,
  CalendarIcon,
  Search,
  AlertTriangle,
  Crown,
} from 'lucide-react';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useUserSession } from '@/hooks/useUserSession';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { SUBSCRIPTION_TIERS } from '@/data/subscriptionTiers';

interface SubscriptionOverride {
  id: string;
  user_id: string;
  tier: string;
  reason: string | null;
  granted_by: string | null;
  expires_at: string | null;
  created_at: string;
  email?: string;
  granted_by_email?: string;
}

interface LookedUpUser {
  id: string;
  email: string;
  full_name?: string;
}

const AdminSubscriptions: React.FC = () => {
  const navigate = useNavigate();
  const { user, session } = useUserSession();
  const { isAdmin, isLoading: adminLoading } = useAdminStatus();
  
  const [overrides, setOverrides] = useState<SubscriptionOverride[]>([]);
  const [isLoadingOverrides, setIsLoadingOverrides] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOverride, setEditingOverride] = useState<SubscriptionOverride | null>(null);
  
  // Add form state
  const [searchEmail, setSearchEmail] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [lookedUpUser, setLookedUpUser] = useState<LookedUpUser | null>(null);
  const [selectedTier, setSelectedTier] = useState('scale');
  const [reason, setReason] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | undefined>(undefined);
  const [isPermanent, setIsPermanent] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOverrides = useCallback(async () => {
    if (!session?.access_token) return;
    
    setIsLoadingOverrides(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-list-override-users', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        console.error('Error fetching overrides:', error);
        toast.error('Failed to fetch subscription overrides');
        return;
      }

      setOverrides(data.overrides || []);
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to fetch subscription overrides');
    } finally {
      setIsLoadingOverrides(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (isAdmin && session) {
      fetchOverrides();
    }
  }, [isAdmin, session, fetchOverrides]);

  const handleSearchUser = async () => {
    if (!searchEmail.trim() || !session?.access_token) return;
    
    setIsSearching(true);
    setLookedUpUser(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('lookup-user-by-email', {
        body: { email: searchEmail.trim() },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error || !data?.user) {
        toast.error('User not found');
        return;
      }

      // Check if user already has an override
      const existingOverride = overrides.find(o => o.user_id === data.user.id);
      if (existingOverride) {
        toast.error('This user already has a subscription override');
        return;
      }

      setLookedUpUser({
        id: data.user.id,
        email: data.user.email,
        full_name: data.user.full_name,
      });
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to lookup user');
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateOverride = async () => {
    if (!lookedUpUser || !session?.access_token) return;
    
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-manage-override', {
        body: {
          action: 'create',
          user_id: lookedUpUser.id,
          tier: selectedTier,
          reason: reason.trim() || null,
          expires_at: isPermanent ? null : expiresAt?.toISOString() || null,
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        toast.error('Failed to create override');
        return;
      }

      toast.success('Subscription override created successfully');
      setIsAddDialogOpen(false);
      resetForm();
      fetchOverrides();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to create override');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateOverride = async () => {
    if (!editingOverride || !session?.access_token) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('admin-manage-override', {
        body: {
          action: 'update',
          override_id: editingOverride.id,
          tier: selectedTier,
          reason: reason.trim() || null,
          expires_at: isPermanent ? null : expiresAt?.toISOString() || null,
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        toast.error('Failed to update override');
        return;
      }

      toast.success('Subscription override updated successfully');
      setIsEditDialogOpen(false);
      setEditingOverride(null);
      resetForm();
      fetchOverrides();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to update override');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteOverride = async (overrideId: string) => {
    if (!session?.access_token) return;
    
    try {
      const { error } = await supabase.functions.invoke('admin-manage-override', {
        body: {
          action: 'delete',
          override_id: overrideId,
        },
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (error) {
        toast.error('Failed to delete override');
        return;
      }

      toast.success('Subscription override removed');
      fetchOverrides();
    } catch (err) {
      console.error('Error:', err);
      toast.error('Failed to delete override');
    }
  };

  const resetForm = () => {
    setSearchEmail('');
    setLookedUpUser(null);
    setSelectedTier('scale');
    setReason('');
    setExpiresAt(undefined);
    setIsPermanent(true);
  };

  const openEditDialog = (override: SubscriptionOverride) => {
    setEditingOverride(override);
    setSelectedTier(override.tier);
    setReason(override.reason || '');
    setIsPermanent(!override.expires_at);
    setExpiresAt(override.expires_at ? new Date(override.expires_at) : undefined);
    setIsEditDialogOpen(true);
  };

  const getTierBadgeVariant = (tier: string) => {
    switch (tier) {
      case 'scale': return 'default';
      case 'growth': return 'secondary';
      case 'starter': return 'outline';
      default: return 'outline';
    }
  };

  // Stats
  const tierCounts = overrides.reduce((acc, o) => {
    acc[o.tier] = (acc[o.tier] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (adminLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/settings')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8 px-4">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold flex items-center gap-2">
              <Shield className="w-6 h-6" />
              Admin: Subscription Overrides
            </h1>
            <p className="text-muted-foreground text-sm">Grant free tier access to users</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(open) => { setIsAddDialogOpen(open); if (!open) resetForm(); }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Override
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5" />
                  Grant Free Tier Access
                </DialogTitle>
                <DialogDescription>
                  Grant subscription access to a user without payment
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Email Lookup */}
                <div className="space-y-2">
                  <Label>User Email</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="user@example.com"
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearchUser()}
                    />
                    <Button
                      variant="outline"
                      onClick={handleSearchUser}
                      disabled={isSearching || !searchEmail.trim()}
                    >
                      {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    </Button>
                  </div>
                  {lookedUpUser && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                      <Check className="w-4 h-4 text-green-600" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{lookedUpUser.full_name || 'User'}</p>
                        <p className="text-xs text-muted-foreground">{lookedUpUser.email}</p>
                      </div>
                    </div>
                  )}
                </div>

                {lookedUpUser && (
                  <>
                    {/* Tier Selection */}
                    <div className="space-y-2">
                      <Label>Subscription Tier</Label>
                      <RadioGroup value={selectedTier} onValueChange={setSelectedTier}>
                        {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
                          <div key={key} className="flex items-center space-x-2 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                            <RadioGroupItem value={key} id={key} />
                            <Label htmlFor={key} className="flex-1 cursor-pointer">
                              <span className="font-medium">{tier.name}</span>
                              <span className="text-muted-foreground ml-2">(${tier.price}/mo value)</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Reason */}
                    <div className="space-y-2">
                      <Label>Reason</Label>
                      <Input
                        placeholder="e.g., inventor, beta_tester, team_member"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </div>

                    {/* Expiration */}
                    <div className="space-y-2">
                      <Label>Expiration</Label>
                      <RadioGroup
                        value={isPermanent ? 'permanent' : 'expires'}
                        onValueChange={(v) => setIsPermanent(v === 'permanent')}
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="permanent" id="permanent" />
                          <Label htmlFor="permanent">Permanent</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="expires" id="expires" />
                          <Label htmlFor="expires">Expires on date</Label>
                        </div>
                      </RadioGroup>
                      
                      {!isPermanent && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {expiresAt ? format(expiresAt, 'PPP') : 'Select date'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={expiresAt}
                              onSelect={setExpiresAt}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={handleCreateOverride}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Crown className="w-4 h-4 mr-2" />}
                      Grant Access
                    </Button>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{overrides.length}</div>
              <div className="text-xs text-muted-foreground">Total Overrides</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{tierCounts['scale'] || 0}</div>
              <div className="text-xs text-muted-foreground">Scale Tier</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{tierCounts['growth'] || 0}</div>
              <div className="text-xs text-muted-foreground">Growth Tier</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{tierCounts['starter'] || 0}</div>
              <div className="text-xs text-muted-foreground">Starter Tier</div>
            </CardContent>
          </Card>
        </div>

        {/* Overrides Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Active Overrides</CardTitle>
              <CardDescription>Users with free subscription access</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchOverrides} disabled={isLoadingOverrides}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingOverrides ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingOverrides ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : overrides.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No subscription overrides found
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Tier</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Granted By</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {overrides.map((override) => (
                    <TableRow key={override.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{override.email || 'Unknown'}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{override.user_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getTierBadgeVariant(override.tier)} className="capitalize">
                          {override.tier}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{override.reason || '-'}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {override.granted_by_email || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        {override.expires_at ? (
                          <span className="text-sm">{format(new Date(override.expires_at), 'PP')}</span>
                        ) : (
                          <Badge variant="outline">Permanent</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(override)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleDeleteOverride(override.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={(open) => { setIsEditDialogOpen(open); if (!open) { setEditingOverride(null); resetForm(); } }}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Override</DialogTitle>
              <DialogDescription>
                Update subscription override for {editingOverride?.email}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              {/* Tier Selection */}
              <div className="space-y-2">
                <Label>Subscription Tier</Label>
                <Select value={selectedTier} onValueChange={setSelectedTier}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SUBSCRIPTION_TIERS).map(([key, tier]) => (
                      <SelectItem key={key} value={key}>
                        {tier.name} (${tier.price}/mo)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Reason */}
              <div className="space-y-2">
                <Label>Reason</Label>
                <Input
                  placeholder="e.g., inventor, beta_tester"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              {/* Expiration */}
              <div className="space-y-2">
                <Label>Expiration</Label>
                <RadioGroup
                  value={isPermanent ? 'permanent' : 'expires'}
                  onValueChange={(v) => setIsPermanent(v === 'permanent')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="permanent" id="edit-permanent" />
                    <Label htmlFor="edit-permanent">Permanent</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="expires" id="edit-expires" />
                    <Label htmlFor="edit-expires">Expires on date</Label>
                  </div>
                </RadioGroup>
                
                {!isPermanent && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {expiresAt ? format(expiresAt, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={expiresAt}
                        onSelect={setExpiresAt}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => { setIsEditDialogOpen(false); setEditingOverride(null); resetForm(); }}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleUpdateOverride}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Check className="w-4 h-4 mr-2" />}
                  Save Changes
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminSubscriptions;
