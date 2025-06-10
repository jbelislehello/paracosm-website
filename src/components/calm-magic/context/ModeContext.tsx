
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type ModeType = 'personal' | 'professional';
export type LeadershipCompetency = 'authentic' | 'creative' | 'systems' | 'collaborative' | 'visionary';

interface ModeContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  competencyFocus: LeadershipCompetency | null;
  setCompetencyFocus: (competency: LeadershipCompetency | null) => void;
  coherenceLevel: number;
  personalToProRatio: number;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ModeType>('personal');
  const [competencyFocus, setCompetencyFocus] = useState<LeadershipCompetency | null>(null);
  const [coherenceLevel, setCoherenceLevel] = useState(50);
  const [personalToProRatio, setPersonalToProRatio] = useState(0.5);
  
  // Calculate coherence level based on emotional states and mode
  // This would be updated based on user interactions
  
  const value = {
    mode,
    setMode,
    competencyFocus,
    setCompetencyFocus,
    coherenceLevel,
    personalToProRatio
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
