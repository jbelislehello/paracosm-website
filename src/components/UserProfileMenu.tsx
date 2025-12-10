import React from 'react';
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
  LogIn, 
  LogOut, 
  CreditCard, 
  User as UserIcon,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useUserSession } from '@/hooks/useUserSession';

const UserProfileMenu: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, isLoading, signOut } = useUserSession();

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
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

  // Not logged in - show Sign In button
  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => navigate('/auth')}
        className="gap-2"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
    );
  }

  // Logged in - show profile dropdown
  return (
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
            <Badge variant="secondary" className="text-xs gap-1">
              <Sparkles className="w-3 h-3" />
              Free Plan
            </Badge>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        {/* Menu Items */}
        <DropdownMenuItem onClick={() => navigate('/pricing')} className="cursor-pointer">
          <CreditCard className="w-4 h-4 mr-2" />
          View Pricing Plans
        </DropdownMenuItem>
        
        <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
          <UserIcon className="w-4 h-4 mr-2" />
          Edit Profile
          <Badge variant="outline" className="ml-auto text-[10px]">Soon</Badge>
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
  );
};

export default UserProfileMenu;
