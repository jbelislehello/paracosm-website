import React from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, FileText, Code, ArrowRight, Zap, Brain, Compass, Target, Cog, Users } from 'lucide-react';
interface OverviewTabProps {
  onStartJourney?: () => void;
}
const OverviewTab: React.FC<OverviewTabProps> = ({
  onStartJourney
}) => {
  return <div className="space-y-6">
      <div className="text-center space-y-3">
        
        
        
      </div>

      {/* Two-Phase Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2 mb-3">
            <Target className="w-4 h-4" />
            Phase 1: Understanding the Problem (Steps 1-3)
          </h4>
          <div className="space-y-2 text-blue-700 dark:text-blue-300">
            <p className="font-medium">What you do:</p>
            <div className="space-y-1 text-xs ml-2">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <span>Study how people actually work and what frustrates them</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <span>Talk to stakeholders about their real needs and pain points</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></div>
                <span>Build a working demo that tells a story about how things could work better</span>
              </div>
            </div>
          </div>
          <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded mt-3">
            <p className="text-xs font-medium text-blue-800 dark:text-blue-200">
              <strong>Key output:</strong> A prototype that shows the vision in action, not just describes it
            </p>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
          <h4 className="font-semibold text-purple-800 dark:text-purple-200 flex items-center gap-2 mb-3">
            <Cog className="w-4 h-4" />
            Phase 2: Making It Real (Steps 4-7)
          </h4>
          <div className="space-y-2 text-purple-700 dark:text-purple-300">
            <p className="font-medium">What you do:</p>
            <div className="space-y-1 text-xs ml-2">
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span>Turn the demo into clear technical requirements</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span>Document exactly what needs to be built and how it should work</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span>Hand everything over to engineers with context intact</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1 h-1 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                <span>Begin actual development</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why This Matters */}
      <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg space-y-4">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Why This Matters
        </h4>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Most projects fail because there's a gap between "good idea" and "working product." This process creates a bridge:
        </p>
        
        <div className="grid grid-cols-1 gap-3 text-xs">
          <div className="flex items-start gap-3">
            <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-green-700 dark:text-green-300">Diegetic Prototype:</span>
              <span className="text-slate-600 dark:text-slate-400"> A demo that feels real and tells a complete story</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Brain className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-blue-700 dark:text-blue-300">Systems Intelligence:</span>
              <span className="text-slate-600 dark:text-slate-400"> Technical specs that preserve the original vision</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-purple-700 dark:text-purple-300">Handover Ritual:</span>
              <span className="text-slate-600 dark:text-slate-400"> Engineers understand not just what to build, but why</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400">
          The framework prevents the common problem where engineering teams receive vague requirements and build something technically correct but practically useless.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 p-3 rounded">
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
            <strong>Bottom line:</strong> It's a structured way to go from "we should build something" to "here's exactly what to build and why it matters."
          </p>
        </div>
      </div>

      <Button onClick={onStartJourney} className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600">
        Start Product Development Journey
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>

      <div className="border-t pt-3 space-y-2">
        <h4 className="font-medium text-sm">Common Development Problems This Solves</h4>
        <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
          <li>• <strong>Vague Requirements:</strong> Engineers get clear, context-rich specifications</li>
          <li>• <strong>Lost Vision:</strong> Original intent is preserved through the handover process</li>
          <li>• <strong>Assumption-Based Building:</strong> Real user research drives every decision</li>
          <li>• <strong>Technical vs. Practical Mismatch:</strong> Working prototypes validate the approach first</li>
        </ul>
      </div>
    </div>;
};
export default OverviewTab;