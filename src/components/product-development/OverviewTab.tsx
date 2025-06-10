
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Code, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  onStartJourney?: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onStartJourney }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="text-2xl">🚀</div>
        <h3 className="font-semibold">Bridge Ideas to Products</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A product development framework that bridges creative ideation with technical implementation. 
          Transform "we should build something" into "here's exactly what to build and why it matters."
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span>Study how people work and what frustrates them</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Build demos that show the vision in action</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Code className="w-4 h-4 text-green-600" />
          <span>Turn demos into clear technical requirements</span>
        </div>
      </div>

      <Button 
        onClick={onStartJourney} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
      >
        Start Product Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Why Most Projects Fail</h4>
        <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">
          Most projects fail because there's a gap between "good idea" and "working product." This process creates a bridge:
        </p>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• <strong>Diegetic prototype:</strong> A demo that feels real and tells a complete story</li>
          <li>• <strong>Systems intelligence:</strong> Technical specs that preserve the original vision</li>
          <li>• <strong>Handover ritual:</strong> Engineers understand not just what to build, but why</li>
        </ul>
        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium">
          Bottom line: A structured way to go from "we should build something" to "here's exactly what to build and why it matters."
        </p>
      </div>
    </div>
  );
};

export default OverviewTab;
