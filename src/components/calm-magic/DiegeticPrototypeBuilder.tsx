
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Play, Users, FileText, Lightbulb, Eye } from 'lucide-react';

interface PrototypeElement {
  type: 'story' | 'interface' | 'workflow' | 'demo';
  title: string;
  description: string;
  content: string;
}

interface DiegeticPrototypeBuilderProps {
  onCompletePrototype: (prototype: any) => void;
  problemAnalysis?: any;
}

const DiegeticPrototypeBuilder: React.FC<DiegeticPrototypeBuilderProps> = ({
  onCompletePrototype,
  problemAnalysis
}) => {
  const [prototype, setPrototype] = useState({
    title: '',
    vision_statement: '',
    user_story: '',
    demo_scenario: '',
    key_interactions: '',
    success_visualization: '',
    stakeholder_reactions: '',
    implementation_approach: ''
  });

  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  const handleComplete = () => {
    onCompletePrototype({
      ...prototype,
      problem_analysis: problemAnalysis
    });
  };

  const demoScenarios = [
    {
      id: 'day_in_life',
      title: 'A Day in the Life',
      description: 'Show how the solution transforms a typical user\'s workflow',
      icon: '📅'
    },
    {
      id: 'problem_solving',
      title: 'Problem Resolution',
      description: 'Demonstrate how the solution addresses the core pain points',
      icon: '🎯'
    },
    {
      id: 'collaboration',
      title: 'Team Collaboration',
      description: 'Show how multiple stakeholders interact with the solution',
      icon: '🤝'
    },
    {
      id: 'transformation',
      title: 'Transformation Journey',
      description: 'Illustrate the before/after organizational change',
      icon: '🚀'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Step 3: Diegetic Prototype</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Build a working demo that tells a story about how things could work better
        </p>
      </div>

      {/* Problem Context */}
      {problemAnalysis && (
        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-sm text-green-800">Problem Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-green-700">Problem Statement:</strong>
                <p className="text-green-600">{problemAnalysis.problem_statement?.substring(0, 100)}...</p>
              </div>
              <div>
                <strong className="text-green-700">Opportunity Score:</strong>
                <Badge className="ml-2 bg-green-100 text-green-800">
                  {Math.round((
                    problemAnalysis.impact_level + 
                    problemAnalysis.urgency_level + 
                    problemAnalysis.feasibility_level + 
                    problemAnalysis.stakeholder_alignment + 
                    problemAnalysis.resource_availability
                  ) / 5)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="vision" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="vision">Vision</TabsTrigger>
          <TabsTrigger value="story">User Story</TabsTrigger>
          <TabsTrigger value="demo">Demo Script</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
        </TabsList>

        <TabsContent value="vision" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Prototype Title & Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Give your prototype a compelling name"
                  value={prototype.title}
                  onChange={(e) => setPrototype({...prototype, title: e.target.value})}
                />
                <Textarea
                  placeholder="Write a clear vision statement. What future state does this prototype demonstrate?"
                  value={prototype.vision_statement}
                  onChange={(e) => setPrototype({...prototype, vision_statement: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Success Visualization
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe what success looks like. How will stakeholders feel when they see this working?"
                  value={prototype.success_visualization}
                  onChange={(e) => setPrototype({...prototype, success_visualization: e.target.value})}
                  rows={6}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-blue-800 mb-2">What Makes a Prototype "Diegetic"?</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Story-driven:</strong> It tells a complete narrative about the solution in action</li>
                <li>• <strong>Feels real:</strong> Stakeholders can imagine themselves using it</li>
                <li>• <strong>Context-aware:</strong> Shows the solution working within actual organizational constraints</li>
                <li>• <strong>Emotionally engaging:</strong> People can feel the transformation, not just see it</li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="story" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                User Story & Narrative
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write the user story. Who is the protagonist? What challenge do they face? How does the solution help them succeed?"
                value={prototype.user_story}
                onChange={(e) => setPrototype({...prototype, user_story: e.target.value})}
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Key Interactions & Features</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Describe the key interactions users will have with the solution. What are the critical features that enable the transformation?"
                value={prototype.key_interactions}
                onChange={(e) => setPrototype({...prototype, key_interactions: e.target.value})}
                rows={5}
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {demoScenarios.map((scenario) => (
              <Card 
                key={scenario.id}
                className={`cursor-pointer transition-all ${
                  activeDemo === scenario.id ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
                }`}
                onClick={() => setActiveDemo(activeDemo === scenario.id ? null : scenario.id)}
              >
                <CardContent className="p-3 text-center">
                  <div className="text-2xl mb-2">{scenario.icon}</div>
                  <h4 className="font-medium text-xs">{scenario.title}</h4>
                  <p className="text-xs text-slate-600 mt-1">{scenario.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="demo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                Demo Scenario Script
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a detailed demo script. What exactly will you show? What will you say? How will you guide stakeholders through the experience?"
                value={prototype.demo_scenario}
                onChange={(e) => setPrototype({...prototype, demo_scenario: e.target.value})}
                rows={8}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Implementation Approach</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How will you build this prototype? What tools, technologies, or methods will you use to make it feel real?"
                value={prototype.implementation_approach}
                onChange={(e) => setPrototype({...prototype, implementation_approach: e.target.value})}
                rows={4}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Stakeholder Reaction Planning
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How do you expect different stakeholders to react? What questions might they ask? How will you address concerns or objections?"
                value={prototype.stakeholder_reactions}
                onChange={(e) => setPrototype({...prototype, stakeholder_reactions: e.target.value})}
                rows={6}
              />
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-4">
              <h4 className="font-medium text-amber-800 mb-2">Prototype Validation Checklist</h4>
              <div className="space-y-2 text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-amber-700">Tells a complete, believable story</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-amber-700">Addresses the core problem identified in analysis</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-amber-700">Shows measurable value to stakeholders</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-amber-700">Feels achievable within known constraints</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-amber-700">Generates emotional engagement from viewers</span>
                </label>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={!prototype.title.trim() || !prototype.demo_scenario.trim()}
          >
            Complete Diegetic Prototype
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiegeticPrototypeBuilder;
