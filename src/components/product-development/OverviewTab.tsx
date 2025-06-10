
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
          A structured approach that bridges creative ideation with technical implementation. Transform "we should build something" into "here's exactly what to build and why it matters."
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-yellow-600" />
          <span>Discover and validate real user problems</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <FileText className="w-4 h-4 text-blue-600" />
          <span>Create living prototypes that demonstrate value</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Code className="w-4 h-4 text-green-600" />
          <span>Build products with preserved vision and purpose</span>
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
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• Gap between "we should build something" and "exactly what to build"</li>
          <li>• Features built without understanding real user needs</li>
          <li>• Developers don't understand the why behind requirements</li>
          <li>• Original product vision gets lost during implementation</li>
          <li>• No clear bridge between creative ideas and technical execution</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
