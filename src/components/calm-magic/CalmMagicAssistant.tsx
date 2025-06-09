import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  X, 
  Minimize2, 
  Maximize2, 
  Brain, 
  Compass, 
  BookOpen,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Users,
  Search,
  Lightbulb,
  Code,
  Handshake
} from 'lucide-react';

interface CalmMagicAssistantProps {
  onStartJourney?: () => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CalmMagicAssistant: React.FC<CalmMagicAssistantProps> = ({ 
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

  const processSteps = [
    { icon: <Users className="w-4 h-4" />, name: 'Stakeholder Research', phase: 'Understanding' },
    { icon: <Search className="w-4 h-4" />, name: 'Problem Analysis', phase: 'Understanding' },
    { icon: <Lightbulb className="w-4 h-4" />, name: 'Diegetic Prototype', phase: 'Understanding' },
    { icon: <Code className="w-4 h-4" />, name: 'Technical Requirements', phase: 'Implementation' },
    { icon: <Handshake className="w-4 h-4" />, name: 'Handover Ritual', phase: 'Implementation' }
  ];

  const bridgeElements = [
    { name: 'Diegetic Prototype', description: 'Demo that feels real and tells a complete story' },
    { name: 'Systems Intelligence', description: 'Technical specs that preserve the original vision' },
    { name: 'Handover Ritual', description: 'Engineers understand not just what to build, but why' }
  ];

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-r-xl rounded-l-lg shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Product Framework</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    );
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
                    A structured approach to go from "we should build something" 
                    to "here's exactly what to build and why it matters."
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="w-4 h-4 text-blue-600" />
                    <span>Study how people actually work</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Search className="w-4 h-4 text-purple-600" />
                    <span>Map problems and opportunities</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Lightbulb className="w-4 h-4 text-green-600" />
                    <span>Build story-driven prototypes</span>
                  </div>
                </div>

                <Button 
                  onClick={onStartJourney}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
                >
                  Start Development Process
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-medium text-sm">Why Most Projects Fail</h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>• Gap between "good idea" and "working product"</li>
                    <li>• Engineers get vague requirements</li>
                    <li>• Solutions are technically correct but practically useless</li>
                    <li>• Original vision gets lost in translation</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="process" className="space-y-3">
                <h3 className="font-semibold text-center">7-Step Process</h3>
                
                <div className="space-y-3">
                  <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 text-sm mb-2">
                      Phase 1: Understanding (Steps 1-3)
                    </h4>
                    {processSteps.slice(0, 3).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                        {step.icon}
                        <span>{index + 1}. {step.name}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-950/30 p-3 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 text-sm mb-2">
                      Phase 2: Implementation (Steps 4-7)
                    </h4>
                    {processSteps.slice(3, 5).map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-xs text-purple-700 dark:text-purple-300">
                        {step.icon}
                        <span>{index + 4}. {step.name}</span>
                      </div>
                    ))}
                    <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                      + Systems Intelligence & Development Tracking
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-200 text-sm">Output</h4>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Clear technical specs that preserve the original vision, 
                    preventing the "technically correct but practically useless" problem.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="bridge" className="space-y-3">
                <h3 className="font-semibold text-center">The Bridge Elements</h3>
                
                {bridgeElements.map((element, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50"
                  >
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
                    Bottom Line
                  </h4>
                  <p className="text-xs text-amber-700 dark:text-amber-300">
                    This framework prevents the common problem where engineering teams 
                    receive vague requirements and build something that works technically 
                    but doesn't solve the real problem.
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

export default CalmMagicAssistant;
