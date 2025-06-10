
import React from 'react';
import { Button } from '@/components/ui/button';

type ViewMode = 'journey' | 'spiral' | 'tests' | 'learning' | 'overview' | 'tools';

interface ViewModeNavigationProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ViewModeNavigation: React.FC<ViewModeNavigationProps> = ({
  viewMode,
  onViewModeChange
}) => {
  const viewModes = [
    { key: 'journey' as const, label: '🌊 Journey', desc: 'Living Landscapes' },
    { key: 'spiral' as const, label: '🌀 Spiral', desc: 'Navigation' },
    { key: 'tests' as const, label: '🧪 Tests', desc: 'Cultural' },
    { key: 'learning' as const, label: '📊 Learning', desc: 'Organization' },
    { key: 'overview' as const, label: '🎯 Overview', desc: 'Framework' },
    { key: 'tools' as const, label: '🛠️ Tools', desc: 'Interactive' }
  ];

  return (
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
    </div>
  );
};

export default ViewModeNavigation;
