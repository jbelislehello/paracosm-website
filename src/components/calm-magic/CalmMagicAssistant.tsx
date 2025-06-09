
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
  ChevronRight
} from 'lucide-react';

interface CalmMagicAssistantProps {
  onStartJourney?: () => void;
}

const CalmMagicAssistant: React.FC<CalmMagicAssistantProps> = ({ onStartJourney }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const gardens = [
    { icon: '🧠', name: 'Intelligence Garden', color: '#2563eb' },
    { icon: '⚙️', name: 'Systems Garden', color: '#7c3aed' },
    { icon: '🌱', name: 'Prototypes Garden', color: '#db2777' }
  ];

  const compassAxes = [
    { name: 'LOVE', color: '#ef4444', description: 'Connection & empathy' },
    { name: 'MAGIC', color: '#8b5cf6', description: 'Wonder & possibility' },
    { name: 'CALM', color: '#06b6d4', description: 'Peace & clarity' },
    { name: 'OPEN', color: '#10b981', description: 'Receptivity & growth' },
    { name: 'FREE', color: '#f59e0b', description: 'Liberation & flow' }
  ];

  if (!isOpen) {
    return (
      <div className="fixed left-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white p-3 rounded-r-xl rounded-l-lg shadow-lg transition-all duration-300 hover:shadow-xl"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          <span className="text-sm font-medium">Calm Magic</span>
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
                Calm Magic Assistant
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
                <TabsTrigger value="gardens">Gardens</TabsTrigger>
                <TabsTrigger value="compass">Compass</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="text-center space-y-3">
                  <div className="text-2xl">🌱</div>
                  <h3 className="font-semibold">Transform Your Organization</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    Navigate the three gardens of exploration using our engineering-grade 
                    framework for organizational transformation.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Brain className="w-4 h-4 text-blue-600" />
                    <span>Select your exploration context</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Compass className="w-4 h-4 text-purple-600" />
                    <span>Map your emotional territory</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="w-4 h-4 text-green-600" />
                    <span>Capture insights & patterns</span>
                  </div>
                </div>

                <Button 
                  onClick={onStartJourney}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600"
                >
                  Start Your Journey
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>

                <div className="border-t pt-3 space-y-2">
                  <h4 className="font-medium text-sm">Process Benefits</h4>
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>• Structured emotional intelligence mapping</li>
                    <li>• Reproducible transformation processes</li>
                    <li>• Team collaboration frameworks</li>
                    <li>• Quality-assured insight generation</li>
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="gardens" className="space-y-3">
                <h3 className="font-semibold text-center">Exploration Gardens</h3>
                {gardens.map((garden, index) => (
                  <div 
                    key={index}
                    className="p-3 rounded-lg border bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                        style={{ backgroundColor: `${garden.color}20` }}
                      >
                        {garden.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-sm">{garden.name}</h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300">
                          {garden.name === 'Intelligence Garden' && 'Cognitive frameworks & mental models'}
                          {garden.name === 'Systems Garden' && 'Organizational dynamics & processes'}
                          {garden.name === 'Prototypes Garden' && 'Future scenarios & innovations'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="compass" className="space-y-3">
                <h3 className="font-semibold text-center">5-Axis Compass</h3>
                <div className="text-center mb-4">
                  <div className="w-20 h-20 mx-auto relative">
                    <svg viewBox="0 0 80 80" className="w-full h-full">
                      <circle cx="40" cy="40" r="30" fill="none" stroke="#7c3aed" strokeWidth="2"/>
                      <line x1="40" y1="10" x2="40" y2="20" stroke="#ef4444" strokeWidth="2"/>
                      <line x1="70" y1="40" x2="60" y2="40" stroke="#8b5cf6" strokeWidth="2"/>
                      <line x1="40" y1="70" x2="40" y2="60" stroke="#06b6d4" strokeWidth="2"/>
                      <line x1="10" y1="40" x2="20" y2="40" stroke="#10b981" strokeWidth="2"/>
                      <line x1="25" y1="25" x2="30" y2="30" stroke="#f59e0b" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                
                {compassAxes.map((axis, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 rounded">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: axis.color }}
                    />
                    <div>
                      <span className="font-medium text-sm">{axis.name}</span>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {axis.description}
                      </p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {isMinimized && (
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              <div className="text-xs text-center text-slate-600 dark:text-slate-300 writing-mode-vertical">
                Calm Magic
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default CalmMagicAssistant;
