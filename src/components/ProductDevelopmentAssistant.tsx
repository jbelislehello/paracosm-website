
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, X, Minimize2, Maximize2, Sparkles, FileText, ArrowRight } from 'lucide-react';
import OverviewTab from './product-development/OverviewTab';
import ProcessTab from './product-development/ProcessTab';
import BridgeTab from './product-development/BridgeTab';
import { useLanguage } from '@/contexts/LanguageContext';
import BoardEntryGate from './calm-magic/BoardEntryGate';

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
  const [showBoardGate, setShowBoardGate] = useState(false);
  const { t } = useLanguage();
  
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
    <div className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 ${isMinimized ? 'w-16' : 'w-[430px]'}`}>
      <Card className="h-[650px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-r-2 border-gradient-to-b from-blue-500 to-purple-500 shadow-2xl rounded-r-xl rounded-l-none">
        <CardHeader className="pb-3 px-6">
          <div className="flex items-center justify-between">
            {!isMinimized && (
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                {t("framework.imagineering_to_engineering")}
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
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="w-fit">
                {t("framework.product_development_framework")}
              </Badge>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {t("framework.extensible_process")}
              </div>
            </div>
          )}
        </CardHeader>

        {!isMinimized && (
          <CardContent className="px-6 pb-4 overflow-y-auto h-[570px]">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
                <TabsTrigger value="innovation" className="text-sm">Innovation</TabsTrigger>
                <TabsTrigger value="quality" className="text-sm">Quality</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <OverviewTab onStartJourney={onStartJourney} />
                  
                  {/* Living PRD CTA */}
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-lg border border-primary/20 mt-4">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-primary mt-0.5" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">Transform Vision into Living PRD</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Use the Calm Magic Board to generate a Living PRD that preserves your creative vision through technical implementation.
                        </p>
                        <Button
                          onClick={() => setShowBoardGate(true)}
                          className="mt-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                          size="sm"
                        >
                          Generate Living PRD
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="innovation" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <ProcessTab />
                </div>
              </TabsContent>

              <TabsContent value="quality" className="space-y-6 mt-0">
                <div className="space-y-4">
                  <BridgeTab />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        )}

        {isMinimized && (
          <CardContent className="p-3">
            <div className="flex flex-col items-center gap-3">
              <Sparkles className="w-6 h-6 text-blue-600" />
              <div className="text-xs text-center text-slate-600 dark:text-slate-300 writing-mode-vertical transform -rotate-90 origin-center">
                Product Framework
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Board Entry Gate Modal */}
      <BoardEntryGate
        isOpen={showBoardGate}
        onClose={() => setShowBoardGate(false)}
        sourceContext="agentic"
        preselectedMode="professional"
      />
    </div>
  );
};

export default ProductDevelopmentAssistant;
