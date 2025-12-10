import { Button } from '@/components/ui/button';
import { Sparkles, Flame, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssistantChatButtonProps {
  onClick: () => void;
  isOpen: boolean;
  mode: 'glitch' | 'drift' | 'idle';
  hasNewMessage?: boolean;
}

export default function AssistantChatButton({
  onClick,
  isOpen,
  mode,
  hasNewMessage,
}: AssistantChatButtonProps) {
  const getModeStyles = () => {
    switch (mode) {
      case 'glitch':
        return 'bg-destructive hover:bg-destructive/90 text-destructive-foreground';
      case 'drift':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      default:
        return 'bg-primary hover:bg-primary/90 text-primary-foreground';
    }
  };

  const getIcon = () => {
    switch (mode) {
      case 'glitch':
        return <Flame className="h-5 w-5" />;
      case 'drift':
        return <Waves className="h-5 w-5" />;
      default:
        return <Sparkles className="h-5 w-5" />;
    }
  };

  if (isOpen) return null;

  return (
    <Button
      size="lg"
      className={cn(
        "rounded-full h-14 w-14 shadow-lg transition-all duration-300",
        getModeStyles(),
        hasNewMessage && "animate-pulse"
      )}
      onClick={onClick}
    >
      {getIcon()}
      {hasNewMessage && (
        <span className="absolute -top-1 -right-1 h-3 w-3 bg-amber-500 rounded-full animate-ping" />
      )}
    </Button>
  );
}
