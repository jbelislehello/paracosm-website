
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Lightbulb, Users, CheckSquare, BarChart3 } from 'lucide-react';

const CalmMagicDocumentation: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Calm Magic Framework Documentation
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Comprehensive guide to the engineering-grade Imagineering process
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="gardens">Gardens</TabsTrigger>
            <TabsTrigger value="compass">Compass</TabsTrigger>
            <TabsTrigger value="quality">Quality</TabsTrigger>
            <TabsTrigger value="collaboration">Teams</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Framework Overview</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                The Calm Magic Framework is an engineering-grade approach to organizational transformation 
                that bridges subjective experience with measurable outcomes. It provides a structured 
                methodology for navigating complex change through three distinct exploration contexts 
                (Gardens) while maintaining rigorous quality standards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 text-sm">🧠</span>
                    </div>
                    <h4 className="font-medium">Intelligence</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Data, language, and insight discovery through cognitive architecture analysis
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 text-sm">⚙️</span>
                    </div>
                    <h4 className="font-medium">Systems</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Infrastructure and governance mechanisms that enable or constrain emergence
                  </p>
                </Card>
                
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                      <span className="text-pink-600 text-sm">🌱</span>
                    </div>
                    <h4 className="font-medium">Prototypes</h4>
                  </div>
                  <p className="text-xs text-slate-600">
                    Diegetic artifacts that make future scenarios tangible and experiential
                  </p>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="gardens" className="space-y-4">
            <h3 className="text-lg font-semibold">Garden Selection Guide</h3>
            
            <div className="space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-blue-700">Garden of Intelligence 🧠</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Focus on organizational knowing, data flows, and cognitive patterns.
                </p>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Key Questions</Badge>
                    <ul className="text-xs text-slate-600 space-y-1 ml-4">
                      <li>• What information is seeking to emerge?</li>
                      <li>• What does the organization know unconsciously?</li>
                      <li>• How do insights flow through the system?</li>
                    </ul>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Best For</Badge>
                    <p className="text-xs text-slate-600">Knowledge management, decision-making processes, information architecture</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-purple-700">Garden of Systems ⚙️</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Explore infrastructure, routines, and governance mechanisms.
                </p>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Key Questions</Badge>
                    <ul className="text-xs text-slate-600 space-y-1 ml-4">
                      <li>• What system dynamics are you observing?</li>
                      <li>• What wants to change or transform?</li>
                      <li>• How might this system evolve?</li>
                    </ul>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Best For</Badge>
                    <p className="text-xs text-slate-600">Process optimization, organizational design, structural changes</p>
                  </div>
                </div>
              </div>

              <div className="border-l-4 border-pink-500 pl-4">
                <h4 className="font-medium text-pink-700">Garden of Prototypes 🌱</h4>
                <p className="text-sm text-slate-600 mb-2">
                  Create tangible artifacts that embody future possibilities.
                </p>
                <div className="space-y-2">
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Key Questions</Badge>
                    <ul className="text-xs text-slate-600 space-y-1 ml-4">
                      <li>• What future is trying to emerge?</li>
                      <li>• What story wants to be told?</li>
                      <li>• What would this look like if it were real?</li>
                    </ul>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-1">Best For</Badge>
                    <p className="text-xs text-slate-600">Innovation initiatives, future scenario planning, cultural transformation</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="compass" className="space-y-4">
            <h3 className="text-lg font-semibold">5-Axis Emotional Compass</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-red-600 mb-2">LOVE - Aliveness</h4>
                  <p className="text-sm text-slate-600 mb-2">Where vitality and desire ignite</p>
                  <div className="text-xs text-slate-500">
                    <p><strong>High:</strong> Energy, passion, engagement</p>
                    <p><strong>Low:</strong> Disconnection, apathy, depletion</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-purple-600 mb-2">MAGIC - Spaciousness</h4>
                  <p className="text-sm text-slate-600 mb-2">Where intuition and potential emerge</p>
                  <div className="text-xs text-slate-500">
                    <p><strong>High:</strong> Openness, creativity, possibility</p>
                    <p><strong>Low:</strong> Rigidity, limitation, constraint</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-cyan-600 mb-2">CALM - Wholeness/Ground</h4>
                  <p className="text-sm text-slate-600 mb-2">Where systems stabilize and regenerate</p>
                  <div className="text-xs text-slate-500">
                    <p><strong>High:</strong> Stability, peace, integration</p>
                    <p><strong>Low:</strong> Chaos, fragmentation, overwhelm</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-emerald-600 mb-2">OPEN - Poiesis/Transformation</h4>
                  <p className="text-sm text-slate-600 mb-2">Where change, risk, and originality unfold</p>
                  <div className="text-xs text-slate-500">
                    <p><strong>High:</strong> Adaptability, innovation, risk-taking</p>
                    <p><strong>Low:</strong> Resistance, stagnation, fear of change</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-amber-600 mb-2">FREE - Neurogenesis/Integration</h4>
                  <p className="text-sm text-slate-600 mb-2">Moving arrow reflecting readiness for transformation</p>
                  <div className="text-xs text-slate-500">
                    <p><strong>High:</strong> Liberation, flow, synthesis</p>
                    <p><strong>Low:</strong> Constraint, blockage, separation</p>
                  </div>
                </div>

                <div className="border rounded-lg p-4 bg-slate-50">
                  <h4 className="font-medium mb-2">Interpretation Guide</h4>
                  <div className="text-xs text-slate-600 space-y-1">
                    <p><strong>Vitality Score:</strong> (Love + Magic) / 2</p>
                    <p><strong>Stability Score:</strong> (Calm + Open) / 2</p>
                    <p><strong>Integration Level:</strong> Free value</p>
                    <p><strong>Transformation Readiness:</strong> Overall balance across all axes</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="space-y-4">
            <h3 className="text-lg font-semibold">Engineering Quality Standards</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <CheckSquare className="w-4 h-4" />
                    Validation Rules
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Complete emotional state mapping (all 5 axes)</li>
                    <li>• Minimum content length requirements</li>
                    <li>• Garden-context alignment verification</li>
                    <li>• Shadow/Higher self integration check</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <BarChart3 className="w-4 h-4" />
                    Process Metrics
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Completion rate tracking</li>
                    <li>• Quality score calculation</li>
                    <li>• Transformation readiness assessment</li>
                    <li>• Integration level measurement</li>
                  </ul>
                </Card>
              </div>

              <div className="space-y-4">
                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Lightbulb className="w-4 h-4" />
                    Traceability Matrix
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Garden selection rationale</li>
                    <li>• Emotional state progression tracking</li>
                    <li>• Insight evolution documentation</li>
                    <li>• Decision point audit trail</li>
                  </ul>
                </Card>

                <Card className="p-4">
                  <h4 className="font-medium flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4" />
                    Reproducibility Standards
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Standardized process documentation</li>
                    <li>• Version control for all artifacts</li>
                    <li>• Peer review and validation</li>
                    <li>• Continuous improvement feedback loops</li>
                  </ul>
                </Card>
              </div>
            </div>

            <Card className="p-4 bg-blue-50 border-blue-200">
              <h4 className="font-medium text-blue-800 mb-2">Quality Thresholds</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Excellent:</span>
                  <p className="text-blue-600">80-100%</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Good:</span>
                  <p className="text-blue-600">60-79%</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Needs Work:</span>
                  <p className="text-blue-600">40-59%</p>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Critical:</span>
                  <p className="text-blue-600">0-39%</p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="collaboration" className="space-y-4">
            <h3 className="text-lg font-semibold">Team Collaboration Framework</h3>
            
            <div className="space-y-6">
              <Card className="p-4">
                <h4 className="font-medium mb-3">Facilitation Guidelines</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Pre-Session Setup</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Define session objectives</li>
                      <li>• Select appropriate garden context</li>
                      <li>• Prepare quality validation checklist</li>
                      <li>• Set up documentation templates</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">During Session</h5>
                    <ul className="text-xs text-slate-600 space-y-1">
                      <li>• Guide emotional state mapping</li>
                      <li>• Facilitate shadow/higher self work</li>
                      <li>• Ensure quality standards compliance</li>
                      <li>• Document insights and decisions</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Team Integration Patterns</h4>
                <div className="space-y-3">
                  <div className="border-l-4 border-green-500 pl-3">
                    <h5 className="font-medium text-sm text-green-700">Individual → Team</h5>
                    <p className="text-xs text-slate-600">Personal insights shared and validated collectively</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-3">
                    <h5 className="font-medium text-sm text-blue-700">Team → Organization</h5>
                    <p className="text-xs text-slate-600">Team patterns scaled to organizational transformation</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-3">
                    <h5 className="font-medium text-sm text-purple-700">Cross-Garden Synthesis</h5>
                    <p className="text-xs text-slate-600">Insights integrated across all three garden contexts</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h4 className="font-medium mb-3">Collaboration Tools</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-sm mb-2">Shared Mapping</h5>
                    <p className="text-xs text-slate-600">Collective emotional state visualization</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Insight Synthesis</h5>
                    <p className="text-xs text-slate-600">Collaborative pattern recognition</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm mb-2">Action Planning</h5>
                    <p className="text-xs text-slate-600">Transformation roadmap creation</p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CalmMagicDocumentation;
