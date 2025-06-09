
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Building, Lightbulb, Plus, ArrowRight } from 'lucide-react';

interface ResearchContext {
  type: 'user_research' | 'organizational_analysis' | 'vision_exploration';
  name: string;
  description: string;
  icon: string;
  color: string;
  prompts: string[];
}

interface StakeholderResearchInterfaceProps {
  selectedContext: string | null;
  onContextSelect: (context: string) => void;
  onCompleteResearch: (data: any) => void;
}

const StakeholderResearchInterface: React.FC<StakeholderResearchInterfaceProps> = ({
  selectedContext,
  onContextSelect,
  onCompleteResearch
}) => {
  const [researchData, setResearchData] = useState({
    stakeholders: '',
    pain_points: '',
    current_workflow: '',
    frustrations: '',
    opportunities: '',
    constraints: ''
  });

  const researchContexts: ResearchContext[] = [
    {
      type: 'user_research',
      name: 'User Research Context',
      description: 'Study how people actually work and what frustrates them in their daily tasks',
      icon: '👥',
      color: '#2563eb',
      prompts: [
        'Who are the primary users affected by this problem?',
        'What specific tasks do they struggle with?',
        'What workarounds have they created?',
        'What would make their day significantly better?'
      ]
    },
    {
      type: 'organizational_analysis',
      name: 'Organizational Analysis',
      description: 'Understand system dynamics, processes, and structural constraints',
      icon: '🏢',
      color: '#7c3aed',
      prompts: [
        'What organizational processes are involved?',
        'Where do bottlenecks typically occur?',
        'What systems need to integrate or communicate?',
        'What compliance or governance requirements exist?'
      ]
    },
    {
      type: 'vision_exploration',
      name: 'Vision Exploration',
      description: 'Imagine future scenarios and breakthrough possibilities',
      icon: '🚀',
      color: '#db2777',
      prompts: [
        'What would the ideal future state look like?',
        'What new capabilities could be unlocked?',
        'How might this transform the industry?',
        'What story would users tell about this solution?'
      ]
    }
  ];

  const currentContext = researchContexts.find(ctx => ctx.type === selectedContext);

  const handleSave = () => {
    onCompleteResearch({
      context: selectedContext,
      ...researchData
    });
  };

  if (!selectedContext) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">Step 1: Stakeholder Research</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Choose your research context to begin understanding the problem space
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {researchContexts.map((context) => (
            <Card 
              key={context.type}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => onContextSelect(context.type)}
            >
              <CardHeader className="text-center">
                <div 
                  className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-2"
                  style={{ backgroundColor: `${context.color}20` }}
                >
                  {context.icon}
                </div>
                <CardTitle className="text-lg">{context.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 dark:text-slate-300 text-center mb-4">
                  {context.description}
                </p>
                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">Key Questions:</Badge>
                  <ul className="text-xs text-slate-500 space-y-1">
                    {context.prompts.slice(0, 2).map((prompt, idx) => (
                      <li key={idx}>• {prompt}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div 
          className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
          style={{ backgroundColor: `${currentContext?.color}20` }}
        >
          {currentContext?.icon}
        </div>
        <div>
          <h2 className="text-xl font-bold">{currentContext?.name}</h2>
          <p className="text-sm text-slate-600">{currentContext?.description}</p>
        </div>
      </div>

      <Tabs defaultValue="research" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="research">Research & Analysis</TabsTrigger>
          <TabsTrigger value="synthesis">Problem Synthesis</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Stakeholder Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Who are the key stakeholders? What are their roles, needs, and influence levels?"
                  value={researchData.stakeholders}
                  onChange={(e) => setResearchData({...researchData, stakeholders: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Current Workflow Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How do people currently handle this process? What steps are involved?"
                  value={researchData.current_workflow}
                  onChange={(e) => setResearchData({...researchData, current_workflow: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  ⚠️ Pain Points & Frustrations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What specific problems do people face? What causes delays, errors, or frustration?"
                  value={researchData.pain_points}
                  onChange={(e) => setResearchData({...researchData, pain_points: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  🔒 Constraints & Limitations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What technical, regulatory, or business constraints must be considered?"
                  value={researchData.constraints}
                  onChange={(e) => setResearchData({...researchData, constraints: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-blue-800">Guided Research Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentContext?.prompts.map((prompt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-blue-700">{prompt}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="synthesis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Lightbulb className="w-4 h-4" />
                Opportunity Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Based on your research, what opportunities for improvement have emerged? What would make the biggest impact?"
                value={researchData.opportunities}
                onChange={(e) => setResearchData({...researchData, opportunities: e.target.value})}
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Research Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {researchData.stakeholders.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Stakeholder Groups</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {researchData.pain_points.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Pain Points</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {researchData.opportunities.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Opportunities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {researchData.constraints.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Constraints</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave}
            className="w-full"
            size="lg"
          >
            Complete Stakeholder Research
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakeholderResearchInterface;
