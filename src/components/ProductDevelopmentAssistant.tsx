
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, X, Minimize2, Maximize2, Brain, Compass, BookOpen, ArrowRight, Users, Search, Lightbulb, FileText, Code, Handshake, Play } from 'lucide-react';

interface ProductDevelopmentAssistantProps {
  onStartJourney?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ProductDevelopmentAssistant: React.FC<ProductDevelopmentAssistantProps> = ({
  onStartJourney,
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const setIsOpen = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open);
    } else {
      setInternalIsOpen(open);
    }
  };

  const productSteps = [
    {
      icon: <Users className="w-4 h-4" />,
      name: 'Stakeholder Research',
      phase: 'Awareness'
    },
    {
      icon: <Search className="w-4 h-4" />,
      name: 'Problem Analysis',
      phase: 'Awareness'
    },
    {
      icon: <Lightbulb className="w-4 h-4" />,
      name: 'Diegetic Prototype',
      phase: 'Awareness'
    },
    {
      icon: <FileText className="w-4 h-4" />,
      name: 'Technical Requirements',
      phase: 'Transformation'
    },
    {
      icon: <Code className="w-4 h-4" />,
      name: 'Implementation Intelligence',
      phase: 'Transformation'
    },
    {
      icon: <Handshake className="w-4 h-4" />,
      name: 'Handover Ritual',
      phase: 'Transformation'
    },
    {
      icon: <Play className="w-4 h-4" />,
      name: 'Product Launch',
      phase: 'Transformation'
    }
  ];

  const bridgeElements = [
    {
      name: 'Diegetic Prototyping',
      description: 'Bridge creative vision with technical reality through interactive prototypes'
    },
    {
      name: 'Implementation Intelligence',
      description: 'Technical specifications that preserve the original creative vision'
    },
    {
      name: 'Quality Assurance',
      description: 'Ensure engineers understand not just what to build, but why it matters'
    }
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${isMinimized ? 'w-16' : 'w-80'}`}>
      <Card className="h-[600px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r-2 border-gradient-to-b from-blue-500 to-purple-500 shadow-2xl rounded-r-xl rounded-l-none">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Product Development Framework
              </CardTitle>
            )}
            <div className="flex gap-1">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMinimized(!isMinimized)} 
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsOpen(false)} 
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {!isMinimized && (
            <Badge variant="outline" className="w-fit">
              Imagineering to Engineering Framework
            </Badge>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="p-4 overflow-y-auto h-[520px]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="bridge">Bridge</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl">🚀</div>
                  <h3 className="font-semibold">Bridge Ideas to Products</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    A structured approach to move from "good idea" 
                    to "working product" using our framework that prevents the gap between creative vision and technical implementation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Research stakeholders and validate assumptions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>Analyze problems and identify opportunities</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <span>Create interactive diegetic prototypes</span>
                  </div>
                </div>

                <Button 
                  onClick={onStartJourney} 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
                >
                  Start Development Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-medium text-sm">Why Most Projects Fail</h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>• Gap between "creative vision" and "technical implementation"</li>
                    <li>• Requirements that lose the original magic during development</li>
                    <li>• Engineers don't understand why features matter to users</li>
                    <li>• Original product vision gets lost in technical complexity</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="process" className="space-y-3">
                <h3 className="font-semibold text-center">7-Step Development Process</h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">
                      Phase 1: Building Awareness (Steps 1-3)
                    </h4>
                    {productSteps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                        {step.icon}
                        <span>{index + 1}. {step.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-2">
                      Phase 2: Creating Transformation (Steps 4-7)
                    </h4>
                    {productSteps.slice(3, 7).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                        {step.icon}
                        <span>{index + 4}. {step.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">Outcome</h4>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Working products that preserve the original creative vision, 
                    preventing the "lost in translation" problem between design and development.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="bridge" className="space-y-3">
                <h3 className="font-semibold text-center">The Development Bridge Elements</h3>
                
                {bridgeElements.map((element, index) => (
                  <div key={index} className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50">
                    <h4 className="font-medium text-sm text-slate-800 dark:text-slate-200">
                      {element.name}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                      {element.description}
                    </p>
                  </div>
                ))}

                <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200 text-sm">
                    Innovation to Implementation
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    This framework ensures that innovative ideas successfully transition 
                    into working products without losing their essential creative essence 
                    during the technical implementation process.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {isMinimized && (
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div className="text-xs text-center text-slate-600 dark:text-slate-300 writing-mode-vertical">
                Product Framework
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default ProductDevelopmentAssistant;
