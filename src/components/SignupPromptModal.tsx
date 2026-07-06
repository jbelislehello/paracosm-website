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
import { useLanguage } from '@/contexts/LanguageContext';

interface SignupPromptModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  context?: 'second-project' | 'season-complete' | 'save-progress' | 'rehearsal-download';
}

const CONTEXT_KEYS: Record<NonNullable<SignupPromptModalProps['context']>, string> = {
  'second-project': 'second_project',
  'season-complete': 'season_complete',
  'save-progress': 'save_progress',
  'rehearsal-download': 'rehearsal_download',
};

const SignupPromptModal: React.FC<SignupPromptModalProps> = ({
  open,
  onOpenChange,
  context = 'save-progress',
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const ctxKey = CONTEXT_KEYS[context];
  const title = t(`auth_modal.contexts.${ctxKey}.title`);
  const description = t(`auth_modal.contexts.${ctxKey}.description`);

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
            {t('auth_modal.create_account')}
          </Button>

          <Button
            variant="outline"
            onClick={handleSignIn}
            className="w-full"
          >
            {t('auth_modal.sign_in')}
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
            {t('auth_modal.continue_guest')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SignupPromptModal;
