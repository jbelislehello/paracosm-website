import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { PartyPopper, Sparkles, FileText, ArrowRight, Library, Clock, Target } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CycleCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartPrdGenerator: () => void;
  cycleNumber: number;
  tilesVisited: number;
  polenCount: number;
  board: string;
  startedAt: string;
}

const CycleCompletionModal = ({
  isOpen,
  onClose,
  onStartPrdGenerator,
  cycleNumber,
  tilesVisited,
  polenCount,
  board,
  startedAt
}: CycleCompletionModalProps) => {
  const duration = formatDistanceToNow(new Date(startedAt), { addSuffix: false });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center animate-bounce">
              <PartyPopper className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Cycle Complete!</DialogTitle>
              <DialogDescription>
                You've journeyed through all 64 tiles
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Celebration Banner */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-rose-500 via-purple-500 to-cyan-500 p-6 text-white">
            <div className="relative z-10">
              <h3 className="text-xl font-bold">Window of Tolerance Expanded</h3>
              <p className="text-sm opacity-90 mt-1">
                You've completed cycle {cycleNumber} on the {board} board
              </p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <Sparkles className="absolute top-4 right-4 w-8 h-8 opacity-30" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center bg-muted/50">
              <Target className="w-5 h-5 mx-auto text-green-500 mb-1" />
              <div className="text-2xl font-bold">{tilesVisited}</div>
              <div className="text-xs text-muted-foreground">Tiles Explored</div>
            </Card>
            <Card className="p-4 text-center bg-muted/50">
              <Library className="w-5 h-5 mx-auto text-amber-500 mb-1" />
              <div className="text-2xl font-bold">{polenCount}</div>
              <div className="text-xs text-muted-foreground">POLEN Captured</div>
            </Card>
            <Card className="p-4 text-center bg-muted/50">
              <Clock className="w-5 h-5 mx-auto text-blue-500 mb-1" />
              <div className="text-2xl font-bold text-sm">{duration}</div>
              <div className="text-xs text-muted-foreground">Journey Time</div>
            </Card>
          </div>

          {/* PRD Generator CTA */}
          <Card className="p-4 border-2 border-primary/30 bg-gradient-to-r from-background to-primary/5">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold">Ready to Generate Your PRD</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Transform your POLEN into a structured Product Requirements Document through our 4-stage generator:
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-rose-500 border-rose-500/30">A: Poietic</Badge>
                  <Badge variant="outline" className="text-purple-500 border-purple-500/30">B: Diegetic</Badge>
                  <Badge variant="outline" className="text-blue-500 border-blue-500/30">C: Operational</Badge>
                  <Badge variant="outline" className="text-amber-500 border-amber-500/30">D: MVP</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Continue Exploring
            </Button>
            <Button 
              onClick={onStartPrdGenerator} 
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            >
              Start PRD Generator
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CycleCompletionModal;
