import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { SeasonQualities, QuadrantPosition, TrajectoryEvent, QUADRANT_LABELS, ShadowFactors, FeltState } from '@/types/trajectory';
import { GapInfo } from '@/utils/coherenceAnalysis';
import { TrajectoryVisualization } from './TrajectoryVisualization';
import { SeasonQualityBars } from './SeasonQualityBars';
import { TrajectoryLog } from './TrajectoryLog';
import { HigherSelfProphecyModal } from './HigherSelfProphecyModal';
import { ShadowFactorsDisplay } from './ShadowFactorsDisplay';
import { ShadowNudgePanel } from './ShadowNudgePanel';
import { Target, RotateCcw, Sparkles, ChevronDown, Sliders } from 'lucide-react';

interface QuadrantDynamicsPanelProps {
  seasonQualities: SeasonQualities;
  shadowPosition: QuadrantPosition;
  shadowQuadrant: 'SN' | 'IN' | 'IM' | 'SM';
  higherSelfPosition: QuadrantPosition | null;
  higherSelfQuadrant: 'SN' | 'IN' | 'IM' | 'SM' | null;
  prophecyReflection: string | null;
  trajectoryLog: TrajectoryEvent[];
  shadowFactors?: ShadowFactors;
  gaps?: GapInfo[];
  shadowNudge?: { position: QuadrantPosition; felt_state: FeltState; note: string | null } | null;
  onSetProphecy: (position: QuadrantPosition, reflection?: string) => void;
  onResetTrajectory: () => void;
  onApplyShadowNudge?: (position: QuadrantPosition, feltState: FeltState, note: string | null) => void;
  onResetShadowNudge?: () => void;
}

export const QuadrantDynamicsPanel: React.FC<QuadrantDynamicsPanelProps> = ({
  seasonQualities,
  shadowPosition,
  shadowQuadrant,
  higherSelfPosition,
  higherSelfQuadrant,
  prophecyReflection,
  trajectoryLog,
  shadowFactors,
  gaps = [],
  shadowNudge,
  onSetProphecy,
  onResetTrajectory,
  onApplyShadowNudge,
  onResetShadowNudge,
}) => {
  const [showProphecyModal, setShowProphecyModal] = useState(false);
  const [showNudgePanel, setShowNudgePanel] = useState(false);

  return (
    <div className="h-full overflow-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quadrant Dynamics</h2>
          <p className="text-sm text-muted-foreground">
            Readiness & Trajectory Assessment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowProphecyModal(true)}
          >
            <Target className="w-4 h-4 mr-1" />
            {higherSelfPosition ? 'Update' : 'Set'} Prophecy
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetTrajectory}
            title="Reset Trajectory"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            <span>Position Map</span>
            <div className="flex items-center gap-2 text-xs font-normal">
              <Badge variant="secondary" className="font-mono">
                Shadow: {shadowQuadrant}
              </Badge>
              {higherSelfQuadrant && (
                <Badge variant="outline" className="font-mono text-primary">
                  Target: {higherSelfQuadrant}
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="pb-6">
            <TrajectoryVisualization
              shadowPosition={shadowPosition}
              higherSelfPosition={higherSelfPosition}
              trajectoryLog={trajectoryLog}
            />
          </div>

          {/* Current State */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-foreground" />
                <span className="text-xs font-medium">Current (Shadow)</span>
              </div>
              <p className="text-sm font-semibold">{QUADRANT_LABELS[shadowQuadrant].name}</p>
              <p className="text-[10px] text-muted-foreground">
                {QUADRANT_LABELS[shadowQuadrant].description}
              </p>
              {shadowNudge && (
                <Badge variant="outline" className="mt-2 text-[10px]">
                  Nudged • {shadowNudge.felt_state || 'neutral'}
                </Badge>
              )}
            </div>
            
            {higherSelfQuadrant ? (
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs font-medium">Destination (Higher Self)</span>
                </div>
                <p className="text-sm font-semibold text-primary">
                  {QUADRANT_LABELS[higherSelfQuadrant].name}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {QUADRANT_LABELS[higherSelfQuadrant].description}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowProphecyModal(true)}
                className="p-3 rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs font-medium text-muted-foreground">
                    Set Destination
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  Click to set your Higher Self prophecy
                </p>
              </button>
            )}
          </div>

          {/* Prophecy Reflection */}
          {prophecyReflection && (
            <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="text-xs font-medium mb-1 text-primary">Prophecy Reflection</p>
              <p className="text-sm text-muted-foreground italic">
                "{prophecyReflection}"
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Shadow Factors */}
      {shadowFactors && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center justify-between">
              <span>Shadow Analysis</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2"
                onClick={() => setShowNudgePanel(!showNudgePanel)}
              >
                <Sliders className="w-3 h-3 mr-1" />
                Nudge
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ShadowFactorsDisplay 
              factors={shadowFactors} 
              gaps={gaps}
              showGaps={true}
            />
            
            {/* Nudge Panel */}
            {showNudgePanel && onApplyShadowNudge && onResetShadowNudge && (
              <ShadowNudgePanel
                currentPosition={shadowPosition}
                onApplyNudge={onApplyShadowNudge}
                onReset={onResetShadowNudge}
                hasExistingNudge={!!shadowNudge}
              />
            )}
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Season Qualities */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Season Qualities</CardTitle>
        </CardHeader>
        <CardContent>
          <SeasonQualityBars qualities={seasonQualities} />
        </CardContent>
      </Card>

      <Separator />

      {/* Trajectory Log */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Trajectory Log</CardTitle>
        </CardHeader>
        <CardContent>
          <TrajectoryLog events={trajectoryLog} maxHeight="250px" />
        </CardContent>
      </Card>

      {/* Prophecy Modal */}
      <HigherSelfProphecyModal
        isOpen={showProphecyModal}
        onClose={() => setShowProphecyModal(false)}
        onSetProphecy={onSetProphecy}
        currentShadowPosition={shadowPosition}
      />
    </div>
  );
};

export default QuadrantDynamicsPanel;
