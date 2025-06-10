
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Code, ArrowRight, Zap, Brain, Compass } from 'lucide-react';

interface OverviewTabProps {
  onStartJourney?: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onStartJourney }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="text-2xl">🚀✨</div>
        <h3 className="font-semibold text-lg">Imagineering to Engineering: 7-Step Product Development Process</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A structured framework that bridges creative ideation with technical implementation. 
          Transform "wouldn't it be cool if..." into "here's the working solution that people actually use."
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg space-y-3">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Two-Phase Development Approach
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="font-semibold text-blue-700 dark:text-blue-300">Phase 1: Imagineering (Understanding)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>Stakeholder Research & Discovery</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                <span>Problem Analysis & Validation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>Prototype Vision Creation</span>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="font-semibold text-purple-700 dark:text-purple-300">Phase 2: Engineering (Implementation)</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>Technical Requirements & Architecture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>Implementation Planning & Documentation</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-slate-500"></div>
                <span>Development & Quality Assurance</span>
              </div>
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Move from creative exploration to technical execution with clear handoff points and preserved vision
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Brain className="w-4 h-4 text-blue-600" />
          <span>Research real user needs and organizational context through structured discovery</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Compass className="w-4 h-4 text-purple-600" />
          <span>Validate problems and opportunities with stakeholder interviews and market analysis</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span>Create working prototypes that demonstrate the solution vision clearly</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-green-600" />
          <span>Generate technical documentation that preserves the original vision context</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Code className="w-4 h-4 text-slate-600" />
          <span>Execute development with quality gates that maintain user-centered design</span>
        </div>
      </div>

      <Button 
        onClick={onStartJourney} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
      >
        Start Product Development Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Why Most Product Development Fails</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
          Ideas get lost in translation between creative vision and technical implementation. Our framework creates bridges:
        </p>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• <strong>Structured Research:</strong> Understanding real user needs, not assumptions</li>
          <li>• <strong>Prototype-First Approach:</strong> Vision preservation through working demonstrations</li>
          <li>• <strong>Quality Gates:</strong> Validation checkpoints, metrics, and traceability throughout</li>
          <li>• <strong>Context-Aware Handoffs:</strong> Technical specs that remember why decisions were made</li>
        </ul>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
          Bottom line: A practical framework that ensures great ideas become great products that people actually use.
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
