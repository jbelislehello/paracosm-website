
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, Lightbulb, Code, ArrowRight } from 'lucide-react';

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
          A structured approach to bridge creative ideation with technical implementation. Transform "we should build something" into "here's exactly what to build and why it matters."
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="w-4 h-4 text-blue-600" />
          <span>Understand stakeholders and their real needs</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-purple-600" />
          <span>Create interactive prototypes that demonstrate solutions</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Code className="w-4 h-4 text-green-600" />
          <span>Preserve vision through technical implementation</span>
        </div>
      </div>

      <Button 
        onClick={onStartJourney} 
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
      >
        Start Development Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Why Most Projects Fail</h4>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• Gap between "good idea" and "working product"</li>
          <li>• Vague requirements lead to technically correct but useless solutions</li>
          <li>• Developers don't understand user motivations</li>
          <li>• Original vision gets lost in technical implementation</li>
          <li>• No clear bridge between creative and technical phases</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
