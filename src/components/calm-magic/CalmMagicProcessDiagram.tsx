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
              <marker id="clockwiseArrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto">
                <polygon points="0 0, 12 4, 0 8" fill="#f59e0b"/>
              </marker>
              
              {/* Constellation glow effects */}
              <filter id="starGlow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              
              {/* Twinkle animation */}
              <animate id="twinkle" attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite"/>
              
              {/* Constellation gradients */}
              <radialGradient id="intelligenceStarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#2563eb" stopOpacity="0.2"/>
              </radialGradient>
              <radialGradient id="systemsStarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2"/>
              </radialGradient>
              <radialGradient id="prototypesStarGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#db2777" stopOpacity="0.8"/>
                <stop offset="100%" stopColor="#db2777" stopOpacity="0.2"/>
              </radialGradient>
            </defs>

            {/* Garden Selection Phase - Enhanced as Constellations */}
            <g id="garden-phase">
              <rect x="50" y="50" width="300" height="220" rx="10" fill="#f8fafc" stroke="#2563eb" strokeWidth="2"/>
              <text x="200" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 1: Residency Selection</text>
              <text x="200" y="100" textAnchor="middle" className="text-sm fill-slate-600">Choose the residency context</text>
              
              {/* Intelligence Constellation - User Intelligences */}
              <g id="intelligence-constellation">
                {/* Main constellation circle */}
                <circle cx="120" cy="140" r="25" fill="#2563eb"/>
                <circle cx="120" cy="140" r="15" fill="url(#dottedPattern)"/>
                <text x="120" y="146" textAnchor="middle" className="text-white text-sm">🧠</text>
                
                {/* Constellation stars forming brain-like pattern */}
                <g className="constellation-stars">
                  {/* Left hemisphere stars */}
                  <circle cx="100" cy="125" r="1.5" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="95" cy="135" r="1" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.5s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="100" cy="150" r="1.5" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="105" cy="160" r="1" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3.5s" repeatCount="indefinite"/>
                  </circle>
                  
                  {/* Right hemisphere stars */}
                  <circle cx="140" cy="125" r="1.5" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="145" cy="135" r="1" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="140" cy="150" r="1.5" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.7s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="135" cy="160" r="1" fill="url(#intelligenceStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="4.2s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Constellation connecting lines */}
                <g className="constellation-lines" stroke="#2563eb" strokeWidth="0.5" opacity="0.4">
                  <line x1="100" y1="125" x2="95" y2="135"/>
                  <line x1="95" y1="135" x2="100" y2="150"/>
                  <line x1="100" y1="150" x2="105" y2="160"/>
                  <line x1="140" y1="125" x2="145" y2="135"/>
                  <line x1="145" y1="135" x2="140" y2="150"/>
                  <line x1="140" y1="150" x2="135" y2="160"/>
                  <line x1="120" y1="115" x2="100" y2="125"/>
                  <line x1="120" y1="115" x2="140" y2="125"/>
                </g>
                
                {/* Energetic Axes */}
                <text x="120" y="108" textAnchor="middle" className="text-xs font-bold" fill="#ef4444">LOVE</text>
                <text x="152" y="145" textAnchor="middle" className="text-xs font-bold" fill="#8b5cf6">MAGIC</text>
                <text x="120" y="178" textAnchor="middle" className="text-xs font-bold" fill="#06b6d4">CALM</text>
                <text x="88" y="145" textAnchor="middle" className="text-xs font-bold" fill="#10b981">OPEN</text>
                
                {/* FREE arrow with continuous rotation */}
                <g>
                  <path d="M 120 130 A 10 10 0 0 1 130 140" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#clockwiseArrow)">
                    <animateTransform attributeName="transform" type="rotate" values="0 120 140;360 120 140" dur="8s" repeatCount="indefinite"/>
                  </path>
                  <text x="135" y="135" className="text-xs font-bold" fill="#f59e0b">FREE</text>
                </g>
                
                {/* Updated constellation name */}
                <text x="120" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">User Intelligences</text>
              </g>

              {/* Systems Constellation - Organizational Systems */}
              <g id="systems-constellation">
                {/* Main constellation circle */}
                <circle cx="200" cy="140" r="25" fill="#7c3aed"/>
                <circle cx="200" cy="140" r="15" fill="url(#dottedPattern)"/>
                <text x="200" y="146" textAnchor="middle" className="text-white text-sm">⚙️</text>
                
                {/* Constellation stars forming interconnected pattern */}
                <g className="constellation-stars">
                  {/* Gear-like pattern */}
                  <circle cx="200" cy="115" r="1.5" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3.1s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="215" cy="125" r="1" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="220" cy="140" r="1.5" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4.1s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="215" cy="155" r="1" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3.6s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="200" cy="165" r="1.5" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="2.9s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="185" cy="155" r="1" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.3s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="180" cy="140" r="1.5" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.8s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="185" cy="125" r="1" fill="url(#systemsStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="4.3s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Constellation connecting lines - gear pattern */}
                <g className="constellation-lines" stroke="#7c3aed" strokeWidth="0.5" opacity="0.4">
                  <line x1="200" y1="115" x2="215" y2="125"/>
                  <line x1="215" y1="125" x2="220" y2="140"/>
                  <line x1="220" y1="140" x2="215" y2="155"/>
                  <line x1="215" y1="155" x2="200" y2="165"/>
                  <line x1="200" y1="165" x2="185" y2="155"/>
                  <line x1="185" y1="155" x2="180" y2="140"/>
                  <line x1="180" y1="140" x2="185" y2="125"/>
                  <line x1="185" y1="125" x2="200" y2="115"/>
                </g>
                
                {/* Energetic Axes */}
                <text x="200" y="108" textAnchor="middle" className="text-xs font-bold" fill="#ef4444">LOVE</text>
                <text x="232" y="145" textAnchor="middle" className="text-xs font-bold" fill="#8b5cf6">MAGIC</text>
                <text x="200" y="178" textAnchor="middle" className="text-xs font-bold" fill="#06b6d4">CALM</text>
                <text x="168" y="145" textAnchor="middle" className="text-xs font-bold" fill="#10b981">OPEN</text>
                
                {/* FREE arrow with continuous rotation */}
                <g>
                  <path d="M 200 130 A 10 10 0 0 1 210 140" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#clockwiseArrow)">
                    <animateTransform attributeName="transform" type="rotate" values="0 200 140;360 200 140" dur="8s" repeatCount="indefinite"/>
                  </path>
                  <text x="215" y="135" className="text-xs font-bold" fill="#f59e0b">FREE</text>
                </g>
                
                {/* Updated constellation name */}
                <text x="200" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Organizational Systems</text>
              </g>
              
              {/* Prototypes Constellation - Vision Prototypes */}
              <g id="prototypes-constellation">
                {/* Main constellation circle */}
                <circle cx="280" cy="140" r="25" fill="#db2777"/>
                <circle cx="280" cy="140" r="15" fill="url(#dottedPattern)"/>
                <text x="280" y="146" textAnchor="middle" className="text-white text-sm">🌱</text>
                
                {/* Constellation stars forming growth/flowering pattern */}
                <g className="constellation-stars">
                  {/* Flowering pattern */}
                  <circle cx="280" cy="115" r="1.5" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3.2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="295" cy="120" r="1" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="2.7s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="300" cy="135" r="1.5" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="4.2s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="295" cy="150" r="1" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="3.7s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="285" cy="165" r="1.5" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.4;1;0.4" dur="3.0s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="275" cy="165" r="1" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.6;1;0.6" dur="3.4s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="265" cy="150" r="1.5" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2.9s" repeatCount="indefinite"/>
                  </circle>
                  <circle cx="265" cy="120" r="1" fill="url(#prototypesStarGrad)" filter="url(#starGlow)">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="4.4s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Constellation connecting lines - flowering pattern */}
                <g className="constellation-lines" stroke="#db2777" strokeWidth="0.5" opacity="0.4">
                  <line x1="280" y1="115" x2="295" y2="120"/>
                  <line x1="295" y1="120" x2="300" y2="135"/>
                  <line x1="300" y1="135" x2="295" y2="150"/>
                  <line x1="295" y1="150" x2="285" y2="165"/>
                  <line x1="285" y1="165" x2="275" y2="165"/>
                  <line x1="275" y1="165" x2="265" y2="150"/>
                  <line x1="265" y1="150" x2="265" y2="120"/>
                  <line x1="265" y1="120" x2="280" y2="115"/>
                  <line x1="280" y1="140" x2="280" y2="115"/>
                </g>
                
                {/* Energetic Axes */}
                <text x="280" y="108" textAnchor="middle" className="text-xs font-bold" fill="#ef4444">LOVE</text>
                <text x="312" y="145" textAnchor="middle" className="text-xs font-bold" fill="#8b5cf6">MAGIC</text>
                <text x="280" y="178" textAnchor="middle" className="text-xs font-bold" fill="#06b6d4">CALM</text>
                <text x="248" y="145" textAnchor="middle" className="text-xs font-bold" fill="#10b981">OPEN</text>
                
                {/* FREE arrow with continuous rotation */}
                <g>
                  <path d="M 280 130 A 10 10 0 0 1 290 140" stroke="#f59e0b" strokeWidth="2" fill="none" markerEnd="url(#clockwiseArrow)">
                    <animateTransform attributeName="transform" type="rotate" values="0 280 140;360 280 140" dur="8s" repeatCount="indefinite"/>
                  </path>
                  <text x="295" y="135" className="text-xs font-bold" fill="#f59e0b">FREE</text>
                </g>
                
                {/* Updated constellation name */}
                <text x="280" y="195" textAnchor="middle" className="text-xs font-semibold fill-slate-700">Vision Prototypes</text>
              </g>
              
              {/* Cosmic connection lines between constellations */}
              <g className="cosmic-connections" stroke="#e2e8f0" strokeWidth="1" opacity="0.3" strokeDasharray="2,3">
                <line x1="145" y1="140" x2="175" y2="140"/>
                <line x1="225" y1="140" x2="255" y2="140"/>
                {/* Flowing energy particles along connections */}
                <circle r="1" fill="#fbbf24" opacity="0.6">
                  <animateMotion dur="6s" repeatCount="indefinite">
                    <path d="M 145 140 L 175 140"/>
                  </animateMotion>
                </circle>
                <circle r="1" fill="#fbbf24" opacity="0.6">
                  <animateMotion dur="6s" repeatCount="indefinite" begin="3s">
                    <path d="M 225 140 L 255 140"/>
                  </animateMotion>
                </circle>
              </g>
            </g>

            {/* Emotional State Mapping */}
            <g id="compass-phase">
              <rect x="400" y="50" width="350" height="200" rx="10" fill="#f1f5f9" stroke="#7c3aed" strokeWidth="2"/>
              <text x="575" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 2: Emotional State Mapping</text>
              
              {/* 5-Axis Compass */}
              <circle cx="575" cy="150" r="60" fill="none" stroke="#7c3aed" strokeWidth="2"/>
              
              {/* LOVE Axis */}
              <line x1="575" y1="90" x2="575" y2="110" stroke="#ef4444" strokeWidth="3"/>
              <text x="580" y="85" className="text-xs font-bold fill-red-500">LOVE</text>
              
              {/* MAGIC Axis */}
              <line x1="635" y1="150" x2="615" y2="150" stroke="#8b5cf6" strokeWidth="3"/>
              <text x="640" y="155" className="text-xs font-bold fill-purple-500">MAGIC</text>
              
              {/* CALM Axis */}
              <line x1="575" y1="210" x2="575" y2="190" stroke="#06b6d4" strokeWidth="3"/>
              <text x="580" y="225" className="text-xs font-bold fill-cyan-500">CALM</text>
              
              {/* OPEN Axis */}
              <line x1="515" y1="150" x2="535" y2="150" stroke="#10b981" strokeWidth="3"/>
              <text x="470" y="155" className="text-xs font-bold fill-emerald-500">OPEN</text>
              
              {/* FREE Axis */}
              <line x1="545" y1="120" x2="555" y2="130" stroke="#f59e0b" strokeWidth="3"/>
              <text x="520" y="115" className="text-xs font-bold fill-amber-500">FREE</text>
            </g>

            {/* Journal Interface */}
            <g id="journal-phase">
              <rect x="800" y="50" width="350" height="200" rx="10" fill="#fefce8" stroke="#10b981" strokeWidth="2"/>
              <text x="975" y="80" textAnchor="middle" className="text-lg font-bold fill-slate-800">Phase 3: Reflection & Documentation</text>
              
              <rect x="820" y="100" width="150" height="40" rx="5" fill="white" stroke="#10b981"/>
              <text x="895" y="125" textAnchor="middle" className="text-sm fill-slate-700">Shadow Self</text>
              
              <rect x="980" y="100" width="150" height="40" rx="5" fill="white" stroke="#10b981"/>
              <text x="1055" y="125" textAnchor="middle" className="text-sm fill-slate-700">Higher Self</text>
              
              <rect x="820" y="160" width="310" height="60" rx="5" fill="white" stroke="#10b981"/>
              <text x="975" y="185" textAnchor="middle" className="text-sm fill-slate-700">Contextual Insights</text>
              <text x="975" y="205" textAnchor="middle" className="text-xs fill-slate-500">Garden-specific prompts & reflections</text>
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
            <path d="M 350 125 Q 375 125 400 125" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 750 150 Q 775 150 800 150" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 600 250 Q 600 275 600 300" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>
            <path d="M 600 400 Q 600 425 600 450" stroke="#64748b" strokeWidth="2" fill="none" markerEnd="url(#arrowhead)"/>

            {/* Feedback Loop */}
            <path d="M 900 450 Q 1050 400 1050 250 Q 1050 100 400 100" stroke="#9333ea" strokeWidth="2" fill="none" strokeDasharray="5,5" markerEnd="url(#arrowhead)"/>
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
