
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import BoardEntryGate from '../BoardEntryGate';

type ViewMode = 'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools' | 'dream';

interface ViewModeNavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeNavigation: React.FC<ViewModeNavigationProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const [showBoardGate, setShowBoardGate] = useState(false);

  const viewModes = [
    { key: 'journey' as const, label: '🌊 Journey', desc: 'Living Landscapes' },
    { key: 'spiral' as const, label: '🌀 Spiral', desc: 'Navigation' },
    { key: 'tests' as const, label: '🧪 Tests', desc: 'Cultural' },
    { key: 'learning' as const, label: '📊 Learning', desc: 'Organization' },
    { key: 'overview' as const, label: '🎯 Overview', desc: 'Framework' },
    { key: 'tools' as const, label: '🛠️ Tools', desc: 'Interactive' },
    { key: 'dream' as const, label: '✨ Dream', desc: 'Board self-answers' }
  ];

  return (
    <>
      <div className="flex gap-2 mb-4 flex-wrap">
        {viewModes.map(({ key, label, desc }) => (
          <Button
            key={key}
            onClick={() => onViewModeChange(key)}
            variant={viewMode === key ? 'default' : 'outline'}
            size="sm"
            className="flex flex-col h-auto py-2"
          >
            <div className="text-xs">{label}</div>
            <div className="text-xs opacity-70">{desc}</div>
          </Button>
        ))}
        
        {/* Calm Magic Board Entry */}
        <Button
          onClick={() => setShowBoardGate(true)}
          variant="outline"
          size="sm"
          className="flex flex-col h-auto py-2 border-primary/50 bg-gradient-to-r from-rose-50 to-purple-50 dark:from-rose-950/20 dark:to-purple-950/20 hover:from-rose-100 hover:to-purple-100"
        >
          <div className="text-xs">🎯 Board</div>
          <div className="text-xs opacity-70">Calm Magic</div>
        </Button>
      </div>

      <BoardEntryGate
        isOpen={showBoardGate}
        onClose={() => setShowBoardGate(false)}
        sourceContext="relational"
        preselectedMode="personal"
      />
    </>
  );
};

export default ViewModeNavigation;
