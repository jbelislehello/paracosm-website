import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  LogIn, 
  LogOut, 
  CreditCard, 
  User as UserIcon,
  Sparkles,
  ChevronDown,
  Cloud,
  Settings,
  Loader2
} from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';
import { useSubscription } from '@/hooks/useSubscription';
import { ProfileEditModal } from '@/components/ProfileEditModal';
import { getTierDisplayName } from '@/data/subscriptionTiers';
import { useToast } from '@/hooks/use-toast';

const UserProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, signOut, updateProfile } = useUserSession();
  const { tier, isSubscribed, isLoading: subLoading, openCustomerPortal } = useSubscription();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPortalLoading, setIsPortalLoading] = useState(false);
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleManageSubscription = async () => {
    setIsPortalLoading(true);
    try {
      await openCustomerPortal();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to open portal",
        variant: "destructive",
      });
    } finally {
      setIsPortalLoading(false);
    }
  };

  // Get display name - prioritize full_name, then username, then email
  const displayName = profile?.full_name || profile?.username || user?.email?.split('@')[0] || 'User';
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-muted animate-pulse" />
    );
  }

  // Not logged in - show enhanced Sign In button
  if (!user) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={() => navigate('/auth')}
              className="gap-2 border-primary/30 hover:border-primary/50 hover:bg-primary/5"
            >
              <Cloud className="w-4 h-4 text-primary" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Sign in to save across devices</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  const tierDisplay = getTierDisplayName(tier);

  // Logged in - show profile dropdown
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2 hover:bg-muted/50">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground text-xs">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:inline-block max-w-[120px] truncate text-sm font-medium">
              {displayName}
            </span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end" className="w-64">
          {/* User Info Header */}
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-primary to-purple-600 text-primary-foreground">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuSeparator />
          
          {/* Mode & Plan Badges */}
          <div className="px-2 py-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Mode</span>
              <Badge variant="outline" className="text-xs capitalize">
                {profile?.mode || 'Solo'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Plan</span>
              {subLoading ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Badge 
                  variant={isSubscribed ? "default" : "secondary"} 
                  className={`text-xs gap-1 ${isSubscribed ? 'bg-gradient-to-r from-rose-500 to-purple-500' : ''}`}
                >
                  <Sparkles className="w-3 h-3" />
                  {tierDisplay}
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenuSeparator />
          
          {/* Menu Items */}
          {isSubscribed && (
            <DropdownMenuItem 
              onClick={handleManageSubscription} 
              className="cursor-pointer"
              disabled={isPortalLoading}
            >
              {isPortalLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Settings className="w-4 h-4 mr-2" />
              )}
              Manage Subscription
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer">
            <CreditCard className="w-4 h-4 mr-2" />
            {isSubscribed ? 'View Plans' : 'View Pricing Plans'}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setIsEditModalOpen(true)} className="cursor-pointer">
            <UserIcon className="w-4 h-4 mr-2" />
            Edit Profile
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
            <Settings className="w-4 h-4 mr-2" />
            Settings & Diagnostics
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Sign Out */}
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        profile={profile}
        userEmail={user.email}
        onUpdateProfile={updateProfile}
      />
    </>
  );
};

export default UserProfileMenu;
