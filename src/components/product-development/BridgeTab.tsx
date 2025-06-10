
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Target, BarChart3 } from 'lucide-react';

const BridgeTab: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <h3 className="font-semibold">🌉 Calm Magic Bridge Elements</h3>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Engineering-grade quality assurance for spiritual-technical integration
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-sm">Emotional State Precision</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              5-axis tracking (Love, Magic, Calm, Open, Free) with numerical precision. 
              Maps your movement through spiritual forces with engineering accuracy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-sm">Diegetic Prototypes</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Story-driven artifacts that preserve transformation vision through technical implementation. 
              Stakeholders feel the future rather than just understand it.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-sm">Systems Intelligence</h4>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Technical documentation that honors the spiritual journey. 
              Requirements that maintain transformation context through development.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Garden Intelligence Mapping
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Intelligence Garden (🧠), Systems Garden (⚙️), Prototypes Garden (🌱) - 
            each provides different lenses for understanding organizational transformation needs.
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Freedom Arrow Integration
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            The FREE axis acts as a moving arrow, reflecting readiness for transformation. 
            Tracks neurogenesis and integration patterns across the four base forces.
          </p>
        </div>

        <div className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
          <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
            Quality Gate Validation
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
            Engineering standards: validation rules, process metrics, traceability matrix, 
            reproducibility protocols, and team integration benchmarks.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 p-4 rounded-lg">
        <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm">
          Bridging Spiritual Forces to Technical Reality
        </h4>
        <p className="text-xs text-purple-700 dark:text-purple-300 mb-2">
          Most transformation efforts fail because there's a gap between "spiritual insight" and "integrated change." 
          Calm Magic creates a precise bridge that prevents the common problem where teams receive vague 
          transformation mandates and build something technically correct but spiritually disconnected.
        </p>
        <p className="text-xs text-purple-800 dark:text-purple-200 font-medium">
          Bottom line: A structured way to go from "we should transform" to 
          "here's exactly how to evolve and why it creates lasting freedom."
        </p>
      </div>
    </div>
  );
};

export default BridgeTab;
