import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CalmMagicProcessDiagram from '@/components/calm-magic/CalmMagicProcessDiagram';
const ProcessTab: React.FC = () => {
  return <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-xl my-[30px]">🚀 Imagineering to Engineering: 7-Step Process</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Structured framework for transforming creative ideas into working products
        </p>
      </div>

      {/* The process diagram */}
      <CalmMagicProcessDiagram />
      
      

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            Product Development Quality Standards
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">User Validation</div>
              <div className="text-slate-500">Research gates</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Progress Metrics</div>
              <div className="text-slate-500">Phase tracking</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Decision History</div>
              <div className="text-slate-500">Context preservation</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Reproducibility</div>
              <div className="text-slate-500">Standard processes</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Team Alignment</div>
              <div className="text-slate-500">Clear handoffs</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
        <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">
          Continuous Learning & Iteration Cycle
        </h4>
        <p className="text-xs text-green-700 dark:text-green-300">
          User feedback and performance data inform future product iterations and improvements. 
          The feedback loop ensures each development cycle builds on validated learnings rather than assumptions.
        </p>
      </div>
    </div>;
};
export default ProcessTab;