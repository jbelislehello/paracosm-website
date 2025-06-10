
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Eye, Sparkles, ArrowRight } from 'lucide-react';

interface OverviewTabProps {
  onStartJourney?: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ onStartJourney }) => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-3">
        <div className="text-2xl">💜</div>
        <h3 className="font-semibold">Bridge "I Need Healing" to "Transformed Relationships"</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A structured approach that bridges emotional awareness with relational transformation. Transform "I need healing" into "here's exactly how to heal and why it matters."
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-pink-600" />
          <span>Explore emotional patterns and relationship blocks</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Eye className="w-4 h-4 text-purple-600" />
          <span>Create living visions of healed relationships</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Track transformation through community support</span>
        </div>
      </div>

      <Button 
        onClick={onStartJourney} 
        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-purple-600 hover:to-pink-600"
      >
        Start Healing Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Why This Framework Prevents Healing Stagnation</h4>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• Gap between "I need healing" and "transformed relationships"</li>
          <li>• Surface-level changes that don't create lasting transformation</li>
          <li>• Healers don't understand emotional motivations</li>
          <li>• Original healing vision gets lost in practice</li>
          <li>• No clear bridge between awareness and transformation</li>
        </ul>
      </div>
    </div>
  );
};

export default OverviewTab;
