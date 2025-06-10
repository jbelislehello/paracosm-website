
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, X, Minimize2, Maximize2, Sparkles } from 'lucide-react';
import OverviewTab from './product-development/OverviewTab';
import ProcessTab from './product-development/ProcessTab';
import BridgeTab from './product-development/BridgeTab';

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
                <Lightbulb className="w-5 h-5 text-blue-600" />
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
                <OverviewTab onStartJourney={onStartJourney} />
              </TabsContent>

              <TabsContent value="process" className="space-y-3">
                <ProcessTab />
              </TabsContent>

              <TabsContent value="bridge" className="space-y-3">
                <BridgeTab />
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {isMinimized && (
          <CardContent className="p-2">
            <div className="flex flex-col items-center gap-2">
              <Sparkles className="w-6 h-6 text-blue-600" />
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
