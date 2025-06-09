
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Target, AlertTriangle, Zap, Lock, Users } from 'lucide-react';

interface ProblemAnalysisState {
  impact_level: number;
  urgency_level: number;
  feasibility_level: number;
  stakeholder_alignment: number;
  resource_availability: number;
  problem_statement: string;
  success_criteria: string;
  assumptions: string;
  risks: string;
}

interface ProblemAnalysisCanvasProps {
  onCompleteAnalysis: (analysis: ProblemAnalysisState) => void;
  stakeholderData?: any;
}

const ProblemAnalysisCanvas: React.FC<ProblemAnalysisCanvasProps> = ({
  onCompleteAnalysis,
  stakeholderData
}) => {
  const [analysis, setAnalysis] = useState<ProblemAnalysisState>({
    impact_level: 50,
    urgency_level: 50,
    feasibility_level: 50,
    stakeholder_alignment: 50,
    resource_availability: 50,
    problem_statement: '',
    success_criteria: '',
    assumptions: '',
    risks: ''
  });

  const dimensions = [
    {
      key: 'impact_level' as keyof ProblemAnalysisState,
      name: 'Impact Level',
      description: 'How significant is the potential positive change?',
      icon: Target,
      color: '#10b981',
      low: 'Minor improvement',
      high: 'Transformational change'
    },
    {
      key: 'urgency_level' as keyof ProblemAnalysisState,
      name: 'Urgency Level', 
      description: 'How pressing is this problem right now?',
      icon: AlertTriangle,
      color: '#ef4444',
      low: 'Can wait',
      high: 'Critical priority'
    },
    {
      key: 'feasibility_level' as keyof ProblemAnalysisState,
      name: 'Technical Feasibility',
      description: 'How achievable is this with current technology?',
      icon: Zap,
      color: '#8b5cf6',
      low: 'Highly complex',
      high: 'Straightforward'
    },
    {
      key: 'stakeholder_alignment' as keyof ProblemAnalysisState,
      name: 'Stakeholder Alignment',
      description: 'How aligned are stakeholders on this problem?',
      icon: Users,
      color: '#06b6d4',
      low: 'Conflicting views',
      high: 'Strong consensus'
    },
    {
      key: 'resource_availability' as keyof ProblemAnalysisState,
      name: 'Resource Availability',
      description: 'What resources are available to solve this?',
      icon: Lock,
      color: '#f59e0b',
      low: 'Limited resources',
      high: 'Well resourced'
    }
  ];

  const getOpportunityScore = () => {
    const scores = dimensions.map(d => analysis[d.key] as number);
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  };

  const getOpportunityLevel = (score: number) => {
    if (score >= 80) return { label: 'High Opportunity', color: 'text-green-600' };
    if (score >= 60) return { label: 'Medium Opportunity', color: 'text-yellow-600' };
    return { label: 'Low Opportunity', color: 'text-red-600' };
  };

  const handleSliderChange = (key: keyof ProblemAnalysisState, value: number[]) => {
    setAnalysis({ ...analysis, [key]: value[0] });
  };

  const handleTextChange = (key: keyof ProblemAnalysisState, value: string) => {
    setAnalysis({ ...analysis, [key]: value });
  };

  const handleComplete = () => {
    onCompleteAnalysis(analysis);
  };

  const opportunityScore = getOpportunityScore();
  const opportunityLevel = getOpportunityLevel(opportunityScore);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Step 2: Problem Analysis Canvas</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Map the problem space across multiple dimensions to validate the opportunity
        </p>
      </div>

      {/* Stakeholder Context Summary */}
      {stakeholderData && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-sm text-blue-800">Research Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong className="text-blue-700">Context:</strong>
                <p className="text-blue-600 capitalize">{stakeholderData.context?.replace('_', ' ')}</p>
              </div>
              <div>
                <strong className="text-blue-700">Key Pain Points:</strong>
                <p className="text-blue-600">{stakeholderData.pain_points?.split('\n')[0] || 'Not specified'}</p>
              </div>
              <div>
                <strong className="text-blue-700">Primary Opportunity:</strong>
                <p className="text-blue-600">{stakeholderData.opportunities?.split('\n')[0] || 'Not specified'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Dimensions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Problem Dimensions</h3>
          
          {dimensions.map((dimension) => {
            const IconComponent = dimension.icon;
            const value = analysis[dimension.key] as number;
            
            return (
              <Card key={dimension.key}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <IconComponent className="w-4 h-4" style={{ color: dimension.color }} />
                    {dimension.name}
                  </CardTitle>
                  <p className="text-xs text-slate-600">{dimension.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Slider
                      value={[value]}
                      onValueChange={(val) => handleSliderChange(dimension.key, val)}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>{dimension.low}</span>
                      <Badge variant="outline" style={{ color: dimension.color }}>
                        {value}%
                      </Badge>
                      <span>{dimension.high}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Opportunity Score */}
          <Card className="bg-slate-50 border-slate-200">
            <CardContent className="pt-4">
              <div className="text-center">
                <div className={`text-3xl font-bold ${opportunityLevel.color}`}>
                  {opportunityScore}%
                </div>
                <div className={`text-sm font-medium ${opportunityLevel.color}`}>
                  {opportunityLevel.label}
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  Overall opportunity assessment based on all dimensions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Problem Definition */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Problem Definition</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Clear Problem Statement</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write a clear, specific problem statement. What exactly needs to be solved?"
                value={analysis.problem_statement}
                onChange={(e) => handleTextChange('problem_statement', e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Success Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="How will you know when this problem is solved? What measurable outcomes define success?"
                value={analysis.success_criteria}
                onChange={(e) => handleTextChange('success_criteria', e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Key Assumptions</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What assumptions are you making about users, technology, or business requirements?"
                value={analysis.assumptions}
                onChange={(e) => handleTextChange('assumptions', e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Potential Risks</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="What could go wrong? What risks should be considered in the solution design?"
                value={analysis.risks}
                onChange={(e) => handleTextChange('risks', e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>

          <Button 
            onClick={handleComplete}
            className="w-full"
            size="lg"
            disabled={!analysis.problem_statement.trim()}
          >
            Complete Problem Analysis
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProblemAnalysisCanvas;
