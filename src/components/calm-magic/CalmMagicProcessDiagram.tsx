
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CalmMagicProcessDiagram: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">🌱 Calm Magic Imagineering Process</CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300 text-center">
          Engineering-grade framework for organizational transformation
        </p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg viewBox="0 0 1200 800" className="w-full h-auto">
            {/* Define patterns, gradients and markers */}
            <defs>
              <pattern id="dottedPattern" patternUnits="userSpaceOnUse" width="4" height="4">
                <circle cx="2" cy="2" r="1" fill="#94a3b8" opacity="0.5"/>
              </pattern>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b"/>
              </marker>
            </defs>

            {/* Garden Selection Phase - Three Column Layout */}
            <g id="garden-phase">
              <rect x="50" y="50" width="350" height="200" rx="10" fill="#f8fafc" stroke="#2563eb" strokeWidth="2"/>
              <text x="225" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 1: Residency Selection</text>
              <text x="225" y="100" textAnchor="middle" className="text-sm fill-slate-600">Choose the residency context</text>
              
              {/* User Intelligences - Column 1 */}
              <g id="intelligence-constellation">
                <circle cx="120" cy="140" r="25" fill="#2563eb"/>
                <text x="120" y="146" textAnchor="middle" className="text-white text-sm">🧠</text>
                <text x="120" y="180" textAnchor="middle" className="text-xs font-semibold fill-slate-700">User</text>
                <text x="120" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Intelligences</text>
              </g>

              {/* Organizational Systems - Column 2 */}
              <g id="systems-constellation">
                <circle cx="225" cy="140" r="25" fill="#7c3aed"/>
                <text x="225" y="146" textAnchor="middle" className="text-white text-sm">⚙️</text>
                <text x="225" y="180" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Organizational</text>
                <text x="225" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Systems</text>
              </g>
              
              {/* Vision Prototypes - Column 3 */}
              <g id="prototypes-constellation">
                <circle cx="330" cy="140" r="25" fill="#db2777"/>
                <text x="330" y="146" textAnchor="middle" className="text-white text-sm">🌱</text>
                <text x="330" y="180" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Vision</text>
                <text x="330" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Prototypes</text>
              </g>
            </g>

            {/* Emotional State Mapping */}
            <g id="compass-phase">
              <rect x="450" y="50" width="350" height="200" rx="10" fill="#f1f5f9" stroke="#7c3aed" strokeWidth="2"/>
              <text x="625" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 2: Emotional State Mapping</text>
              
              {/* 5-Axis Compass */}
              <circle cx="625" cy="150" r="60" fill="none" stroke="#7c3aed" strokeWidth="2"/>
              
              {/* LOVE Axis */}
              <line x1="625" y1="90" x2="625" y2="110" stroke="#ef4444" strokeWidth="3"/>
              <text x="630" y="85" className="text-xs font-bold fill-red-500">LOVE</text>
              
              {/* MAGIC Axis */}
              <line x1="685" y1="150" x2="665" y2="150" stroke="#8b5cf6" strokeWidth="3"/>
              <text x="690" y="155" className="text-xs font-bold fill-purple-500">MAGIC</text>
              
              {/* CALM Axis */}
              <line x1="625" y1="210" x2="625" y2="190" stroke="#06b6d4" strokeWidth="3"/>
              <text x="630" y="225" className="text-xs font-bold fill-cyan-500">CALM</text>
              
              {/* OPEN Axis */}
              <line x1="565" y1="150" x2="585" y2="150" stroke="#10b981" strokeWidth="3"/>
              <text x="520" y="155" className="text-xs font-bold fill-emerald-500">OPEN</text>
              
              {/* FREE Axis */}
              <line x1="595" y1="120" x2="605" y2="130" stroke="#f59e0b" strokeWidth="3"/>
              <text x="570" y="115" className="text-xs font-bold fill-amber-500">FREE</text>
            </g>

            {/* Journal Interface */}
            <g id="journal-phase">
              <rect x="850" y="50" width="300" height="200" rx="10" fill="#fefce8" stroke="#10b981" strokeWidth="2"/>
              <text x="1000" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 3: Reflection & Documentation</text>
              
              <rect x="870" y="100" width="120" height="40" rx="5" fill="white" stroke="#10b981"/>
              <text x="930" y="125" textAnchor="middle" className="text-sm fill-slate-700">Shadow Self</text>
              
              <rect x="1010" y="100" width="120" height="40" rx="5" fill="white" stroke="#10b981"/>
              <text x="1070" y="125" textAnchor="middle" className="text-sm fill-slate-700">Higher Self</text>
              
              <rect x="870" y="160" width="260" height="60" rx="5" fill="white" stroke="#10b981"/>
              <text x="1000" y="185" textAnchor="middle" className="text-sm fill-slate-700">Contextual Insights</text>
              <text x="1000" y="205" textAnchor="middle" className="text-xs fill-slate-500">Garden-specific prompts & reflections</text>
            </g>

            {/* Quality Gates */}
            <g id="quality-gates">
              <rect x="50" y="300" width="1100" height="100" rx="10" fill="#fef2f2" stroke="#ef4444" strokeWidth="2"/>
              <text x="600" y="330" textAnchor="middle" className="text-lg font-bold fill-slate-800">Engineering Quality Gates</text>
              
              <rect x="80" y="350" width="200" height="30" rx="5" fill="white" stroke="#ef4444"/>
              <text x="180" y="370" textAnchor="middle" className="text-sm fill-slate-700">Validation Rules</text>
              
              <rect x="300" y="350" width="200" height="30" rx="5" fill="white" stroke="#ef4444"/>
              <text x="400" y="370" textAnchor="middle" className="text-sm fill-slate-700">Process Metrics</text>
              
              <rect x="520" y="350" width="200" height="30" rx="5" fill="white" stroke="#ef4444"/>
              <text x="620" y="370" textAnchor="middle" className="text-sm fill-slate-700">Traceability</text>
              
              <rect x="740" y="350" width="200" height="30" rx="5" fill="white" stroke="#ef4444"/>
              <text x="840" y="370" textAnchor="middle" className="text-sm fill-slate-700">Reproducibility</text>
              
              <rect x="960" y="350" width="170" height="30" rx="5" fill="white" stroke="#ef4444"/>
              <text x="1045" y="370" textAnchor="middle" className="text-sm fill-slate-700">Team Integration</text>
            </g>

            {/* Output & Analytics */}
            <g id="output-phase">
              <rect x="200" y="450" width="800" height="150" rx="10" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2"/>
              <text x="600" y="480" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 4: Transformation Outputs</text>
              
              <rect x="230" y="500" width="180" height="80" rx="5" fill="white" stroke="#16a34a"/>
              <text x="320" y="520" textAnchor="middle" className="text-sm font-bold fill-slate-700">Insights</text>
              <text x="320" y="540" textAnchor="middle" className="text-xs fill-slate-500">Actionable patterns</text>
              <text x="320" y="555" textAnchor="middle" className="text-xs fill-slate-500">& discoveries</text>
              
              <rect x="430" y="500" width="180" height="80" rx="5" fill="white" stroke="#16a34a"/>
              <text x="520" y="520" textAnchor="middle" className="text-sm font-bold fill-slate-700">Integration</text>
              <text x="520" y="540" textAnchor="middle" className="text-xs fill-slate-500">Team alignment</text>
              <text x="520" y="555" textAnchor="middle" className="text-xs fill-slate-500">& collaboration</text>
              
              <rect x="630" y="500" width="180" height="80" rx="5" fill="white" stroke="#16a34a"/>
              <text x="720" y="520" textAnchor="middle" className="text-sm font-bold fill-slate-700">Prototypes</text>
              <text x="720" y="540" textAnchor="middle" className="text-xs fill-slate-500">Diegetic artifacts</text>
              <text x="720" y="555" textAnchor="middle" className="text-xs fill-slate-500">& future scenarios</text>
              
              <rect x="830" y="500" width="150" height="80" rx="5" fill="white" stroke="#16a34a"/>
              <text x="905" y="520" textAnchor="middle" className="text-sm font-bold fill-slate-700">Metrics</text>
              <text x="905" y="540" textAnchor="middle" className="text-xs fill-slate-500">Transformation</text>
              <text x="905" y="555" textAnchor="middle" className="text-xs fill-slate-500">readiness scores</text>
            </g>

            {/* Flow Arrows */}
            <path d="M 400 125 Q 425 125 450 125" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 800 150 Q 825 150 850 150" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 600 250 Q 600 275 600 300" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 600 400 Q 600 425 600 450" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>

            {/* Feedback Loop */}
            <path d="M 900 450 Q 1050 400 1050 250 Q 1050 100 450 100" stroke="#9333ea" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>
            <text x="1060" y="300" className="text-xs fill-purple-600 font-semibold">Feedback Loop</text>
            
            {/* Process Labels */}
            <text x="600" y="650" textAnchor="middle" className="text-sm font-bold fill-slate-800">Continuous Learning & Adaptation Cycle</text>
            <text x="600" y="670" textAnchor="middle" className="text-xs fill-slate-600">Data-driven insights inform future constellation selections and emotional state calibrations</text>
            
            {/* Engineering Standards Box */}
            <rect x="50" y="700" width="1100" height="80" rx="10" fill="#f8fafc" stroke="#374151" strokeWidth="1" strokeDasharray="3,3"/>
            <text x="600" y="725" textAnchor="middle" className="text-md font-bold fill-slate-800">Engineering Standards Compliance</text>
            <text x="200" y="745" textAnchor="middle" className="text-xs fill-slate-600">• Reproducible processes</text>
            <text x="400" y="745" textAnchor="middle" className="text-xs fill-slate-600">• Measurable outcomes</text>
            <text x="600" y="745" textAnchor="middle" className="text-xs fill-slate-600">• Version control</text>
            <text x="800" y="745" textAnchor="middle" className="text-xs fill-slate-600">• Quality assurance</text>
            <text x="1000" y="745" textAnchor="middle" className="text-xs fill-slate-600">• Team collaboration</text>
            <text x="200" y="765" textAnchor="middle" className="text-xs fill-slate-600">• Validation gates</text>
            <text x="400" y="765" textAnchor="middle" className="text-xs fill-slate-600">• Traceability matrix</text>
            <text x="600" y="765" textAnchor="middle" className="text-xs fill-slate-600">• Analytics dashboard</text>
            <text x="800" y="765" textAnchor="middle" className="text-xs fill-slate-600">• Documentation</text>
            <text x="1000" y="765" textAnchor="middle" className="text-xs fill-slate-600">• Continuous improvement</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalmMagicProcessDiagram;
