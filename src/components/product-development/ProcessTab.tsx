
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import CalmMagicProcessDiagram from '@/components/calm-magic/CalmMagicProcessDiagram';

const ProcessTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="font-semibold text-xl">🌱 Calm Magic: 4-Phase Engineering Process</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Engineering-grade framework for organizational transformation through spiritual force dynamics
        </p>
      </div>

      {/* The sophisticated process diagram */}
      <CalmMagicProcessDiagram />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm mb-3">
            Phase 1-2: Understanding Forces & Mapping State
          </h4>
          <div className="space-y-2 text-xs text-blue-700 dark:text-blue-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <span><strong>Residency Selection:</strong> Choose Intelligence, Systems, or Prototypes garden</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-purple-600"></div>
              <span><strong>Emotional State Mapping:</strong> Track Love→Magic→Calm→Open→Free dynamics</span>
            </div>
          </div>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-3 font-medium">
            <strong>Key Output:</strong> Precise emotional territory mapping with force constellation awareness
          </p>
        </div>

        <div className="bg-green-50 dark:bg-green-950/30 p-4 rounded-lg">
          <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm mb-3">
            Phase 3-4: Documentation & Transformation
          </h4>
          <div className="space-y-2 text-xs text-green-700 dark:text-green-300">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-600"></div>
              <span><strong>Reflection & Documentation:</strong> Shadow/Higher self integration with context</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-600"></div>
              <span><strong>Transformation Outputs:</strong> Insights, integration, prototypes, metrics</span>
            </div>
          </div>
          <p className="text-xs text-green-800 dark:text-green-200 mt-3 font-medium">
            <strong>Key Output:</strong> Transformation readiness scores with engineering quality gates
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm mb-3">
            Engineering Standards Compliance
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Validation Rules</div>
              <div className="text-slate-500">Process gates</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Process Metrics</div>
              <div className="text-slate-500">Force tracking</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Traceability</div>
              <div className="text-slate-500">State history</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Reproducibility</div>
              <div className="text-slate-500">Standard flows</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-slate-700 dark:text-slate-300">Integration</div>
              <div className="text-slate-500">Team alignment</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-lg">
        <h4 className="font-semibold text-purple-800 dark:text-purple-200 text-sm">
          Continuous Learning & Adaptation Cycle
        </h4>
        <p className="text-xs text-purple-700 dark:text-purple-300">
          Data-driven insights inform future constellation selections and emotional state calibrations. 
          The feedback loop ensures each transformation deepens rather than repeats surface patterns.
        </p>
      </div>
    </div>
  );
};

export default ProcessTab;
