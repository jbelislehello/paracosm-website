
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { useMode, ModeType } from '../context/ModeContext';

interface ModeSwitcherProps {
  onChange?: (mode: ModeType) => void;
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ onChange }) => {
  const { mode, setMode } = useMode();
  
  const handleModeChange = () => {
    const newMode = mode === 'personal' ? 'professional' : 'personal';
    setMode(newMode);
    if (onChange) {
      onChange(newMode);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
      <div className="flex items-center gap-2">
        <Badge variant={mode === 'personal' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setMode('personal')}>
          Personal
        </Badge>
        <Switch 
          checked={mode === 'professional'}
          onCheckedChange={handleModeChange}
        />
        <Badge variant={mode === 'professional' ? 'default' : 'outline'} className="cursor-pointer" onClick={() => setMode('professional')}>
          Professional
        </Badge>
      </div>
    </div>
  );
};

export default ModeSwitcher;
