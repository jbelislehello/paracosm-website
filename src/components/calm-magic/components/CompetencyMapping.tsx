
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useMode, LeadershipCompetency } from '../context/ModeContext';

interface CompetencyMappingProps {
  landscapeType: 'tree' | 'river' | 'lake' | 'forest' | 'mountain';
}

const CompetencyMapping: React.FC<CompetencyMappingProps> = ({ landscapeType }) => {
  const { mode, competencyFocus, setCompetencyFocus } = useMode();
  
  if (mode !== 'professional') return null;
  
  const competencyMap: Record<string, {
    competency: LeadershipCompetency;
    name: string;
    description: string;
  }> = {
    tree: {
      competency: 'authentic',
      name: 'Authentic Leadership',
      description: 'Building trust through vulnerability and genuine connection'
    },
    river: {
      competency: 'creative',
      name: 'Creative Flow',
      description: 'Intuitive decision-making and generative thinking'
    },
    lake: {
      competency: 'systems',
      name: 'Systems Thinking',
      description: 'Emotional regulation and seeing interconnections'
    },
    forest: {
      competency: 'collaborative',
      name: 'Collaborative Innovation',
      description: 'Co-creation and ecosystem development'
    },
    mountain: {
      competency: 'visionary',
      name: 'Visionary Integration',
      description: 'Transcendent problem-solving and strategic foresight'
    }
  };
  
  const current = competencyMap[landscapeType];
  
  const handleCompetencyFocus = () => {
    if (competencyFocus === current.competency) {
      setCompetencyFocus(null);
    } else {
      setCompetencyFocus(current.competency);
    }
  };
  
  const isActive = competencyFocus === current.competency;
  
  return (
    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg cursor-pointer" onClick={handleCompetencyFocus}>
      <div className="flex items-center justify-between mb-1">
        <Badge variant={isActive ? 'default' : 'outline'} className="bg-blue-600">
          {current.name}
        </Badge>
        {isActive && <span className="text-xs text-blue-600">Active</span>}
      </div>
      <p className="text-xs text-slate-600 dark:text-slate-300">
        {current.description}
      </p>
    </div>
  );
};

export default CompetencyMapping;
