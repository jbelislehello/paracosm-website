
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Search, Building, Lightbulb, Plus, ArrowRight, Heart } from 'lucide-react';

interface ResearchContext {
  type: 'healing_assessment' | 'relationship_dynamics' | 'healing_vision';
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
    relationships: '',
    emotional_patterns: '',
    current_dynamics: '',
    healing_blocks: '',
    opportunities: '',
    support_needs: ''
  });

  const healingContexts: ResearchContext[] = [
    {
      type: 'healing_assessment',
      name: 'Healing Assessment Context',
      description: 'Explore your emotional patterns and what blocks healing in your relationships',
      icon: '💜',
      color: '#db2777',
      prompts: [
        'What emotional patterns keep repeating in your relationships?',
        'What healing do you most need in your connections with others?',
        'What triggers cause the most emotional reactivity for you?',
        'What would feeling truly safe in relationships look like?'
      ]
    },
    {
      type: 'relationship_dynamics',
      name: 'Relationship Dynamics Analysis',
      description: 'Understand the dynamics, triggers, and communication patterns in your relationships',
      icon: '🤝',
      color: '#7c3aed',
      prompts: [
        'What relationship dynamics cause the most stress or conflict?',
        'Where do you feel disconnected or misunderstood?',
        'What communication patterns need healing or transformation?',
        'What support structures could strengthen your relationships?'
      ]
    },
    {
      type: 'healing_vision',
      name: 'Healing Vision Exploration',
      description: 'Imagine transformed relationships and breakthrough emotional possibilities',
      icon: '✨',
      color: '#2563eb',
      prompts: [
        'What would your ideal healed relationships look like?',
        'What new ways of being could emerge from this healing?',
        'How might this transformation ripple out to your community?',
        'What story would you tell about your healing journey?'
      ]
    }
  ];

  const currentContext = healingContexts.find(ctx => ctx.type === selectedContext);

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
          <h2 className="text-2xl font-bold">Step 1: Healing Assessment & Emotional Mapping</h2>
          <p className="text-slate-600 dark:text-slate-300">
            Choose your healing context to begin understanding your emotional and relational landscape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healingContexts.map((context) => (
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
          <TabsTrigger value="research">Healing Exploration</TabsTrigger>
          <TabsTrigger value="synthesis">Healing Synthesis</TabsTrigger>
        </TabsList>

        <TabsContent value="research" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Relationship Mapping
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Who are the key people in your life? What are their roles, needs, and how do they affect your emotional well-being?"
                  value={researchData.relationships}
                  onChange={(e) => setResearchData({...researchData, relationships: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Current Relationship Dynamics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="How do you currently navigate relationships? What patterns show up repeatedly?"
                  value={researchData.current_dynamics}
                  onChange={(e) => setResearchData({...researchData, current_dynamics: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  💔 Emotional Patterns & Healing Blocks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What emotional patterns keep repeating? What blocks you from deeper connection and healing?"
                  value={researchData.emotional_patterns}
                  onChange={(e) => setResearchData({...researchData, emotional_patterns: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  🛡️ Support Needs & Boundaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="What support do you need for healing? What boundaries would create more safety in relationships?"
                  value={researchData.support_needs}
                  onChange={(e) => setResearchData({...researchData, support_needs: e.target.value})}
                  rows={4}
                />
              </CardContent>
            </Card>
          </div>

          <Card className="bg-pink-50 border-pink-200">
            <CardHeader>
              <CardTitle className="text-sm text-pink-800">Guided Healing Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentContext?.prompts.map((prompt, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-pink-700">{prompt}</p>
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
                Healing Opportunity Identification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Based on your exploration, what opportunities for healing and transformation have emerged? What would create the most meaningful shift in your relationships?"
                value={researchData.opportunities}
                onChange={(e) => setResearchData({...researchData, opportunities: e.target.value})}
                rows={6}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Healing Assessment Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-pink-600">
                    {researchData.relationships.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Key Relationships</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">
                    {researchData.emotional_patterns.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Patterns to Heal</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {researchData.opportunities.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Healing Opportunities</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {researchData.support_needs.split('\n').filter(line => line.trim()).length}
                  </div>
                  <div className="text-xs text-slate-600">Support Needs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={handleSave}
            className="w-full"
            size="lg"
          >
            Complete Healing Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StakeholderResearchInterface;
