
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export type ModeType = 'personal' | 'professional';
export type LeadershipCompetency = 'authentic' | 'creative' | 'systems' | 'collaborative' | 'visionary';

interface ModeContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  competencyFocus: LeadershipCompetency | null;
  setCompetencyFocus: (competency: LeadershipCompetency | null) => void;
  coherenceLevel: number;
  personalToProRatio: number;
  // Sanctuary Mode
  sanctuaryMode: boolean;
  setSanctuaryMode: (enabled: boolean) => void;
  toggleSanctuary: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ModeType>('personal');
  const [competencyFocus, setCompetencyFocus] = useState<LeadershipCompetency | null>(null);
  const [coherenceLevel, setCoherenceLevel] = useState(50);
  const [personalToProRatio, setPersonalToProRatio] = useState(0.5);
  const [sanctuaryMode, setSanctuaryMode] = useState(false);
  
  const toggleSanctuary = useCallback(() => {
    setSanctuaryMode(prev => !prev);
  }, []);

  // Keyboard shortcut for sanctuary mode: Cmd/Ctrl + Shift + S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        toggleSanctuary();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleSanctuary]);
  
  const value = {
    mode,
    setMode,
    competencyFocus,
    setCompetencyFocus,
    coherenceLevel,
    personalToProRatio,
    sanctuaryMode,
    setSanctuaryMode,
    toggleSanctuary,
  };
  
  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = (): ModeContextType => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};
