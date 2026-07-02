import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { useGuidedTestRunner } from '@/hooks/useGuidedTestRunner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X, SkipForward, RefreshCw, Play, Copy, Square, Minimize2, Maximize2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const statusStyles: Record<string, string> = {
  pass: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
  fail: 'bg-red-500/15 text-red-600 border-red-500/30',
  running: 'bg-blue-500/15 text-blue-600 border-blue-500/30 animate-pulse',
  pending: 'bg-muted text-muted-foreground border-border',
  skipped: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
};

const statusIcon: Record<string, string> = {
  pass: '✅',
  fail: '❌',
  running: '⏳',
  pending: '·',
  skipped: '⏭',
};

export default function GuidedTestPanel() {
  const [params] = useSearchParams();
  const { isAdmin, isLoading } = useAdminStatus();
  const enabled = params.get('test') === '1';
  const [minimized, setMinimized] = useState(false);
  const runner = useGuidedTestRunner();

  useEffect(() => {
    return () => runner.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!enabled || isLoading || !isAdmin) return null;

  const { steps, results, currentStep, currentIdx, running } = runner;
  const passCount = Object.values(results).filter((r) => r.status === 'pass').length;
  const failCount = Object.values(results).filter((r) => r.status === 'fail').length;

  const copyReport = async () => {
    await navigator.clipboard.writeText(runner.buildReport());
    toast.success('Report copied to clipboard');
  };

  if (minimized) {
    return (
      <button
        onClick={() => setMinimized(false)}
        className="fixed bottom-4 right-4 z-[9999] rounded-full bg-primary text-primary-foreground px-4 py-2 shadow-lg text-xs font-medium flex items-center gap-2"
      >
        <Maximize2 className="w-3 h-3" />
        Guided Test · {passCount}✅ {failCount}❌
      </button>
    );
  }

  return (
    <Card
      className="fixed right-4 top-20 z-[9999] w-[360px] max-h-[calc(100vh-6rem)] flex flex-col shadow-2xl border-2 bg-background/95 backdrop-blur"
      data-testid="guided-test-panel"
    >
      <div className="flex items-center justify-between px-3 py-2 border-b">
        <div className="text-sm font-semibold">Guided Board Test</div>
        <div className="flex items-center gap-1">
          <Badge variant="outline" className="text-[10px]">
            {passCount}✅ {failCount}❌ / {steps.length}
          </Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setMinimized(true)}>
            <Minimize2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div className="p-3 border-b space-y-2">
        {!running ? (
          <Button onClick={runner.start} size="sm" className="w-full">
            <Play className="w-3 h-3 mr-2" /> Start guided test
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Step {currentIdx + 1} / {steps.length} · <span className="uppercase">{currentStep?.group}</span>
            </div>
            <div className="text-sm font-medium">{currentStep?.label}</div>
            <div className="text-xs text-muted-foreground leading-relaxed">{currentStep?.instruction}</div>
            <div className="flex flex-wrap gap-1 pt-1">
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={runner.retryCurrent}>
                <RefreshCw className="w-3 h-3 mr-1" /> Re-check
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs text-emerald-600"
                onClick={() => runner.markManual('pass')}
              >
                <Check className="w-3 h-3 mr-1" /> Pass
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs text-red-600"
                onClick={() => runner.markManual('fail', 'Marked failed manually')}
              >
                <X className="w-3 h-3 mr-1" /> Fail
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-xs"
                onClick={() => runner.markManual('skipped')}
              >
                <SkipForward className="w-3 h-3 mr-1" /> Skip
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {steps.map((step, idx) => {
          const r = results[step.id];
          const isCurrent = idx === currentIdx && running;
          return (
            <div
              key={step.id}
              className={cn(
                'text-xs px-2 py-1.5 rounded border flex items-start gap-2',
                statusStyles[r.status],
                isCurrent && 'ring-2 ring-primary/50',
              )}
            >
              <span className="shrink-0">{statusIcon[r.status]}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{step.label}</div>
                {r.detail && <div className="opacity-75 text-[10px] mt-0.5 break-words">{r.detail}</div>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2 border-t flex gap-2">
        <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={copyReport}>
          <Copy className="w-3 h-3 mr-1" /> Copy report
        </Button>
        {running && (
          <Button size="sm" variant="outline" className="h-8 text-xs" onClick={runner.stop}>
            <Square className="w-3 h-3 mr-1" /> Stop
          </Button>
        )}
      </div>
    </Card>
  );
}
