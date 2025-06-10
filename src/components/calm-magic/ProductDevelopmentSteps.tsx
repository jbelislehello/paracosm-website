
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Users, Search, Lightbulb, FileText, Code, Handshake, Play, Heart, Sparkles } from 'lucide-react';

interface Step {
  id: number;
  phase: 'awareness' | 'transformation';
  title: string;
  description: string;
  icon: React.ElementType;
  output: string;
  completed?: boolean;
}

interface ProductDevelopmentStepsProps {
  currentStep?: number;
  completedSteps?: number[];
}

const ProductDevelopmentSteps: React.FC<ProductDevelopmentStepsProps> = ({
  currentStep = 1,
  completedSteps = []
}) => {
  const steps: Step[] = [
    {
      id: 1,
      phase: 'awareness',
      title: 'Healing Assessment & Emotional Mapping',
      description: 'Explore emotional patterns and what blocks healing in your relationships',
      icon: Heart,
      output: 'Emotional landscape map & relationship pattern analysis'
    },
    {
      id: 2,
      phase: 'awareness',
      title: 'Relationship Pattern Analysis',
      description: 'Understand the dynamics, triggers, and communication patterns in your relationships',
      icon: Search,
      output: 'Validated healing needs & relationship dynamics matrix'
    },
    {
      id: 3,
      phase: 'awareness',
      title: 'Healing Visualization & Practice Design',
      description: 'Create a living vision of healed relationships and design practices to get there',
      icon: Lightbulb,
      output: 'Interactive healing vision that demonstrates transformation in action'
    },
    {
      id: 4,
      phase: 'transformation',
      title: 'Healing Practice Framework',
      description: 'Turn your healing vision into clear, actionable healing practices',
      icon: FileText,
      output: 'Detailed healing practices with preserved emotional context'
    },
    {
      id: 5,
      phase: 'transformation',
      title: 'Transformation Intelligence',
      description: 'Document exactly what needs to shift and how healing will unfold',
      icon: Sparkles,
      output: 'Healing roadmap with relational transformation milestones'
    },
    {
      id: 6,
      phase: 'transformation',
      title: 'Community Integration Ritual',
      description: 'Share your healing journey with community support and accountability',
      icon: Handshake,
      output: 'Community-supported healing practice with shared accountability'
    },
    {
      id: 7,
      phase: 'transformation',
      title: 'Healing Progress Tracking',
      description: 'Monitor emotional shifts to ensure relationship transformation stays on track',
      icon: Play,
      output: 'Emotionally-aligned, healed relationships'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Relational Healing Framework</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Bridge the gap from "I need healing" to "transformed relationships"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase 1: Building Awareness */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-600" />
              Phase 1: Building Awareness
            </CardTitle>
            <Badge variant="outline">Steps 1-3</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.slice(0, 3).map((step) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex gap-3 p-3 rounded-lg border">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isCurrent
                      ? 'bg-pink-100 text-pink-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${isCurrent ? 'text-pink-600' : ''}`}>
                      {step.id}. {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-1">{step.description}</p>
                    <p className="text-xs text-slate-500 italic">Output: {step.output}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Phase 2: Creating Transformation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-600" />
              Phase 2: Creating Transformation
            </CardTitle>
            <Badge variant="outline">Steps 4-7</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            {steps.slice(3, 7).map((step) => {
              const StepIcon = step.icon;
              const isCompleted = completedSteps.includes(step.id);
              const isCurrent = currentStep === step.id;
              
              return (
                <div key={step.id} className="flex gap-3 p-3 rounded-lg border">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted 
                      ? 'bg-green-100 text-green-600' 
                      : isCurrent
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${isCurrent ? 'text-purple-600' : ''}`}>
                      {step.id}. {step.title}
                    </h4>
                    <p className="text-xs text-slate-600 mb-1">{step.description}</p>
                    <p className="text-xs text-slate-500 italic">Output: {step.output}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-rose-50 border-rose-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-rose-800 mb-2">Why This Framework Prevents Healing Stagnation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-rose-700">Healing Visualization</h4>
              <p className="text-rose-600">A vision that feels real and tells a complete story of transformation</p>
            </div>
            <div>
              <h4 className="font-medium text-rose-700">Transformation Intelligence</h4>
              <p className="text-rose-600">Healing practices that preserve the original emotional vision</p>
            </div>
            <div>
              <h4 className="font-medium text-rose-700">Community Integration</h4>
              <p className="text-rose-600">Healers understand not just what to heal, but why it matters deeply</p>
            </div>
          </div>
          <p className="text-xs text-rose-600 mt-3 italic">
            Most healing attempts fail because there's a gap between "I need healing" and "transformed relationships." 
            This process creates a bridge that prevents surface-level changes that don't create lasting relational transformation.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDevelopmentSteps;
