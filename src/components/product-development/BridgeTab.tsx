
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Target, BarChart3 } from 'lucide-react';

const BridgeTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">🌉 Imagineering to Engineering Bridge Elements</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Key components that preserve creative vision through technical implementation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Stakeholder Research</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Structured discovery interviews, user journey mapping, and needs assessment. 
              Understand real problems before jumping to solutions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-sm">Working Prototypes</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Functional demonstrations that show the solution in action. 
              Stakeholders experience the vision rather than just understand it conceptually.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-sm">Context Documentation</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Technical specifications that preserve the "why" behind decisions. 
              Requirements that maintain user context through development cycles.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Research-Driven Discovery
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Start with stakeholder interviews, user journey mapping, and problem validation 
            before building anything. Understand the real needs and constraints.
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Prototype-First Development
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Build working demonstrations that show the solution in action. 
            Prototypes preserve the vision and allow stakeholders to experience the future state.
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Quality Gate Validation
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Development standards: user validation checkpoints, progress metrics, decision history, 
            reproducible processes, and clear team handoff protocols.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 p-4 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm">
          Bridging Creative Vision to Working Product
        </h4>
        <p className="text-xs text-blue-700 dark:text-blue-300 mb-2">
          Most product development fails because there's a gap between "great idea" and "working solution." 
          Our framework creates structured bridges that prevent the common problem where teams receive vague 
          requirements and build something technically correct but user-disconnected.
        </p>
        <p className="text-xs text-blue-800 dark:text-blue-200 font-medium">
          Bottom line: A structured way to go from "wouldn't it be cool if..." to 
          "here's exactly what to build and why it solves real problems."
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
