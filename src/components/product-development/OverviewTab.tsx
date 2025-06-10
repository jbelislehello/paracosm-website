
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Code, ArrowRight, Sparkles, Brain, Compass } from 'lucide-react';

interface OverviewTabProps {
  onStartJourney?: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onStartJourney }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="text-2xl">🌱✨</div>
        <h3 className="font-semibold text-lg">Calm Magic: Engineering-Grade Imagineering Process</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A sophisticated transformation framework that bridges spiritual forces with technical implementation. 
          Transform "we should build something" into "here's exactly what to build and why it creates lasting freedom."
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 rounded-lg space-y-3">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          The Calm Magic Foundation
        </h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span><strong>LOVE:</strong> Aliveness & vitality</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span><strong>MAGIC:</strong> Spaciousness & potential</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            <span><strong>CALM:</strong> Wholeness & ground</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span><strong>OPEN:</strong> Transformation & risk</span>
          </div>
        </div>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          Track freedom as you move through the forces: Love→Magic→Calm→Open, with FREE as the integration arrow
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-blue-600" />
          <span>Map user intelligences and organizational systems through Garden selection</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Compass className="w-4 h-4 text-purple-600" />
          <span>Track emotional state across 5 energetic axes with engineering precision</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span>Build diegetic prototypes that preserve vision through technical implementation</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-green-600" />
          <span>Generate systems intelligence documentation with quality gates</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Code className="w-4 h-4 text-slate-600" />
          <span>Execute handover rituals that maintain transformation context</span>
        </div>
      </div>

      <Button 
        onClick={onStartJourney} 
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600"
      >
        Begin Calm Magic Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Why Most Transformation Efforts Fail</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
          Traditional approaches miss the emotional state mapping and spiritual force dynamics. Calm Magic creates a bridge:
        </p>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• <strong>Emotional State Mapping:</strong> Track love, magic, calm, open, free forces with precision</li>
          <li>• <strong>Diegetic Prototypes:</strong> Vision preservation through story-driven artifacts</li>
          <li>• <strong>Engineering Quality Gates:</strong> Validation rules, metrics, traceability matrix</li>
          <li>• <strong>Systems Intelligence:</strong> Technical specs that honor the transformation journey</li>
        </ul>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
          Bottom line: An engineering-grade framework for spiritual-technical integration that creates lasting freedom.
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
