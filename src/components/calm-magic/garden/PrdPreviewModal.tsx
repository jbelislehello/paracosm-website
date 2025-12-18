import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, Download, ArrowRight, Sparkles, Clock, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

type Season = 'POLLENS' | 'NOEMS' | 'POEMS' | 'TOTEMS' | 'ANTHEMS';

interface CompilationStats {
  layersCompiled: Season[];
  totalFragments: number;
  compilationTime: number;
}

interface PrdPreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prdData: any;
  compilationStats: CompilationStats | null;
  onNavigateToPrd: () => void;
  onDownload?: () => void;
}

const SEASON_CONFIG: Record<Season, { label: string; icon: string; primaryField: string }> = {
  POLLENS: { label: 'Pollens', icon: '🌸', primaryField: 'pollens_aspirations' },
  NOEMS: { label: 'Noems', icon: '💡', primaryField: 'noems_concepts' },
  POEMS: { label: 'Poems', icon: '📖', primaryField: 'poems_people' },
  TOTEMS: { label: 'Totems', icon: '💎', primaryField: 'totems_data_architecture' },
  ANTHEMS: { label: 'Anthems', icon: '🎵', primaryField: 'anthems_market_positioning' },
};

const SEASONS: Season[] = ['POLLENS', 'NOEMS', 'POEMS', 'TOTEMS', 'ANTHEMS'];

export const PrdPreviewModal: React.FC<PrdPreviewModalProps> = ({
  open,
  onOpenChange,
  prdData,
  compilationStats,
  onNavigateToPrd,
  onDownload,
}) => {
  const hasContent = (season: Season): boolean => {
    if (!prdData) return false;
    const field = SEASON_CONFIG[season].primaryField;
    const value = prdData[field];
    return value && typeof value === 'string' && value.trim().length > 0;
  };

  const getPreview = (season: Season): string => {
    if (!prdData) return '';
    const field = SEASON_CONFIG[season].primaryField;
    const value = prdData[field];
    if (!value || typeof value !== 'string') return '';
    return value.length > 120 ? value.substring(0, 120) + '...' : value;
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const completedCount = SEASONS.filter(s => hasContent(s)).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-xl">PRD Compilation Complete!</DialogTitle>
              <DialogDescription className="text-sm">
                Your living ontology has been crystallized
              </DialogDescription>
            </div>
          </div>

          {/* Stats Bar */}
          {compilationStats && (
            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>{compilationStats.layersCompiled.length} layers compiled</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{compilationStats.totalFragments} fragments processed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatTime(compilationStats.compilationTime)}</span>
              </div>
            </div>
          )}
        </DialogHeader>

        {/* Layer Previews */}
        <ScrollArea className="max-h-80 pr-4">
          <div className="space-y-2">
            {SEASONS.map(season => {
              const filled = hasContent(season);
              const preview = getPreview(season);
              const justCompiled = compilationStats?.layersCompiled.includes(season);

              return (
                <div
                  key={season}
                  className={cn(
                    "rounded-lg border p-3 transition-all",
                    filled ? "bg-card border-border" : "bg-muted/30 border-border/50",
                    justCompiled && "ring-1 ring-amber-500/30 bg-amber-500/5"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{SEASON_CONFIG[season].icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{SEASON_CONFIG[season].label}</span>
                        {filled && (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                        )}
                        {justCompiled && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 font-medium">
                            NEW
                          </span>
                        )}
                      </div>
                      {preview ? (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          "{preview}"
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground/50 mt-1 italic">
                          No content yet
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="text-center text-sm text-muted-foreground py-2">
          {completedCount}/5 layers complete
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {onDownload && (
            <Button variant="outline" onClick={onDownload} size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          <Button
            onClick={() => {
              onOpenChange(false);
              onNavigateToPrd();
            }}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
          >
            View Full PRD
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrdPreviewModal;
