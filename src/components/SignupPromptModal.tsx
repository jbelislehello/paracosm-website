import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Cloud, UserPlus, X } from 'lucide-react';

interface SignupPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: 'second-project' | 'season-complete' | 'save-progress' | 'rehearsal-download';
}

const contextMessages = {
  'second-project': {
    title: 'Save Your Projects',
    description: 'You have multiple projects now! Sign in to sync them across all your devices and never lose your work.',
  },
  'season-complete': {
    title: 'Congratulations on Completing a Season!',
    description: 'Great progress! Sign in to save your journey and continue from any device.',
  },
  'save-progress': {
    title: 'Your Progress is Saved Locally',
    description: 'Sign in to sync your work across devices and ensure you never lose your progress.',
  },
  'rehearsal-download': {
    title: 'Create a Free Account to Download',
    description: 'The facilitator deck and workbook are free — the same account unlocks the Calm Magic Board and your personal Rehearsal Arc dashboard.',
  },
};

const SignupPromptModal: React.FC<SignupPromptModalProps> = ({
  open,
  onOpenChange,
  context = 'save-progress',
}) => {
  const navigate = useNavigate();
  const { title, description } = contextMessages[context];

  const handleSignIn = () => {
    onOpenChange(false);
    navigate('/auth?mode=signin');
  };

  const handleCreateAccount = () => {
    onOpenChange(false);
    navigate('/auth?mode=signup');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center sm:text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center">
            <Cloud className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-base">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 pt-4">
          <Button
            onClick={handleCreateAccount}
            className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Create Free Account
          </Button>
          
          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full"
          >
            Sign In to Existing Account
          </Button>
        </div>

        <DialogFooter className="sm:justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupPromptModal;