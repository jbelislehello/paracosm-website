
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Users, Search, Lightbulb, FileText, Code, Handshake, Play } from 'lucide-react';

interface Step {
  id: number;
  phase: 'understanding' | 'implementation';
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
      phase: 'understanding',
      title: 'Stakeholder Research',
      description: 'Study how people actually work and what frustrates them',
      icon: Users,
      output: 'Pain point analysis & user journey maps'
    },
    {
      id: 2,
      phase: 'understanding',
      title: 'Problem Analysis',
      description: 'Talk to stakeholders about their real needs and constraints',
      icon: Search,
      output: 'Validated problem statements & opportunity matrix'
    },
    {
      id: 3,
      phase: 'understanding',
      title: 'Diegetic Prototype',
      description: 'Build a working demo that tells a story about how things could work better',
      icon: Lightbulb,
      output: 'Interactive prototype that demonstrates the vision in action'
    },
    {
      id: 4,
      phase: 'implementation',
      title: 'Technical Requirements',
      description: 'Turn the demo into clear technical specifications',
      icon: FileText,
      output: 'Detailed technical specs with preserved context'
    },
    {
      id: 5,
      phase: 'implementation',
      title: 'Systems Intelligence',
      description: 'Document exactly what needs to be built and how it should work',
      icon: Code,
      output: 'Implementation roadmap with architectural decisions'
    },
    {
      id: 6,
      phase: 'implementation',
      title: 'Handover Ritual',
      description: 'Transfer everything to engineers with complete context intact',
      icon: Handshake,
      output: 'Context-preserving handoff documentation'
    },
    {
      id: 7,
      phase: 'implementation',
      title: 'Development Tracking',
      description: 'Monitor development to ensure vision alignment',
      icon: Play,
      output: 'Vision-aligned working product'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Product Development Framework</h2>
        <p className="text-slate-600 dark:text-slate-300">
          Bridge the gap from "good idea" to "working product"
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phase 1: Understanding the Problem */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-600" />
              Phase 1: Understanding the Problem
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
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <StepIcon className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className={`font-medium text-sm ${isCurrent ? 'text-blue-600' : ''}`}>
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

        {/* Phase 2: Making It Real */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-600" />
              Phase 2: Making It Real
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

      <Card className="bg-amber-50 border-amber-200">
        <CardContent className="p-4">
          <h3 className="font-semibold text-amber-800 mb-2">Why This Framework Prevents Project Failure</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-amber-700">Diegetic Prototype</h4>
              <p className="text-amber-600">A demo that feels real and tells a complete story</p>
            </div>
            <div>
              <h4 className="font-medium text-amber-700">Systems Intelligence</h4>
              <p className="text-amber-600">Technical specs that preserve the original vision</p>
            </div>
            <div>
              <h4 className="font-medium text-amber-700">Handover Ritual</h4>
              <p className="text-amber-600">Engineers understand not just what to build, but why</p>
            </div>
          </div>
          <p className="text-xs text-amber-600 mt-3 italic">
            Most projects fail because there's a gap between "good idea" and "working product." 
            This process creates a bridge that prevents building something technically correct but practically useless.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDevelopmentSteps;
