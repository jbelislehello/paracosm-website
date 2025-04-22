
import React, { createContext, useContext } from 'react';
import { partnerTools, PartnerTool } from '@/data/partnerTools';

type PartnerToolsContextType = {
  tools: PartnerTool[];
  getToolsByCategory: (category: PartnerTool['category']) => PartnerTool[];
  getAllTools: () => PartnerTool[];
};

const PartnerToolsContext = createContext<PartnerToolsContextType | undefined>(undefined);

export function PartnerToolsProvider({ children }: { children: React.ReactNode }) {
  const getToolsByCategory = (category: PartnerTool['category']) => {
    return partnerTools.filter(tool => tool.category === category);
  };

  const getAllTools = () => partnerTools;

  const value = {
    tools: partnerTools,
    getToolsByCategory,
    getAllTools,
  };

  return (
    <PartnerToolsContext.Provider value={value}>
      {children}
    </PartnerToolsContext.Provider>
  );
}

export const usePartnerTools = () => {
  const context = useContext(PartnerToolsContext);
  if (context === undefined) {
    throw new Error('usePartnerTools must be used within a PartnerToolsProvider');
  }
  return context;
};
