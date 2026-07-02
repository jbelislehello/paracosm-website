import { useCallback, useEffect, useRef, useState } from 'react';
import { GUIDED_STEPS, GuidedStep, StepStatus, CheckResult } from '@/components/board/guidedTestSteps';

interface StepResult {
  status: StepStatus;
  detail?: string;
  startedAt?: number;
  finishedAt?: number;
}

interface CapturedCall {
  url: string;
  method: string;
  status: number;
  ts: number;
}

interface CapturedError {
  message: string;
  ts: number;
}

export function useGuidedTestRunner() {
  const [running, setRunning] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [results, setResults] = useState<Record<string, StepResult>>(() =>
    Object.fromEntries(GUIDED_STEPS.map((s) => [s.id, { status: 'pending' as StepStatus }])),
  );

  const callsRef = useRef<CapturedCall[]>([]);
  const errorsRef = useRef<CapturedError[]>([]);
  const originalFetchRef = useRef<typeof fetch | null>(null);
  const originalErrorRef = useRef<typeof console.error | null>(null);
  const pollRef = useRef<number | null>(null);

  const installInterceptors = useCallback(() => {
    if (originalFetchRef.current) return;
    originalFetchRef.current = window.fetch.bind(window);
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
      const method = (init?.method || (input instanceof Request ? input.method : 'GET')).toUpperCase();
      try {
        const res = await originalFetchRef.current!(...args);
        callsRef.current.push({ url, method, status: res.status, ts: Date.now() });
        return res;
      } catch (e) {
        callsRef.current.push({ url, method, status: 0, ts: Date.now() });
        throw e;
      }
    };

    originalErrorRef.current = console.error.bind(console);
    console.error = (...args: unknown[]) => {
      errorsRef.current.push({ message: args.map(String).join(' '), ts: Date.now() });
      originalErrorRef.current?.(...args);
    };
  }, []);

  const removeInterceptors = useCallback(() => {
    if (originalFetchRef.current) {
      window.fetch = originalFetchRef.current;
      originalFetchRef.current = null;
    }
    if (originalErrorRef.current) {
      console.error = originalErrorRef.current;
      originalErrorRef.current = null;
    }
  }, []);

  useEffect(() => () => removeInterceptors(), [removeInterceptors]);

  const runStepCheck = useCallback(async (step: GuidedStep, startedAt: number) => {
    const ctx = {
      calls: callsRef.current,
      errors: errorsRef.current,
      startedAt,
    };
    try {
      const result = await Promise.resolve(step.autoCheck(ctx));
      return result;
    } catch (e) {
      return { status: 'fail', detail: `Check threw: ${String(e)}` } as CheckResult;
    }
  }, []);

  const stopPolling = () => {
    if (pollRef.current) {
      window.clearInterval(pollRef.current);
      pollRef.current = null;
    }
  };

  const beginPolling = useCallback(
    (step: GuidedStep, startedAt: number) => {
      stopPolling();
      const timeout = step.timeoutMs ?? 45_000;
      pollRef.current = window.setInterval(async () => {
        const result = await runStepCheck(step, startedAt);
        if (result) {
          stopPolling();
          setResults((prev) => ({
            ...prev,
            [step.id]: {
              status: result.status,
              detail: result.detail,
              startedAt,
              finishedAt: Date.now(),
            },
          }));
        } else if (Date.now() - startedAt > timeout) {
          stopPolling();
          setResults((prev) => ({
            ...prev,
            [step.id]: {
              status: 'pending',
              detail: 'Timed out — mark manually',
              startedAt,
            },
          }));
        }
      }, 700);
    },
    [runStepCheck],
  );

  const start = useCallback(() => {
    callsRef.current = [];
    errorsRef.current = [];
    setResults(Object.fromEntries(GUIDED_STEPS.map((s) => [s.id, { status: 'pending' as StepStatus }])));
    setCurrentIdx(0);
    setRunning(true);
    installInterceptors();
    const first = GUIDED_STEPS[0];
    const now = Date.now();
    setResults((prev) => ({ ...prev, [first.id]: { status: 'running', startedAt: now } }));
    beginPolling(first, now);
  }, [beginPolling, installInterceptors]);

  const advance = useCallback(() => {
    stopPolling();
    setCurrentIdx((idx) => {
      const next = idx + 1;
      if (next >= GUIDED_STEPS.length) {
        setRunning(false);
        return idx;
      }
      const step = GUIDED_STEPS[next];
      const now = Date.now();
      setResults((prev) => ({ ...prev, [step.id]: { status: 'running', startedAt: now } }));
      beginPolling(step, now);
      return next;
    });
  }, [beginPolling]);

  const markManual = useCallback(
    (status: 'pass' | 'fail' | 'skipped', detail = 'Marked manually') => {
      stopPolling();
      const step = GUIDED_STEPS[currentIdx];
      if (!step) return;
      setResults((prev) => ({
        ...prev,
        [step.id]: {
          ...prev[step.id],
          status,
          detail,
          finishedAt: Date.now(),
        },
      }));
      advance();
    },
    [advance, currentIdx],
  );

  const retryCurrent = useCallback(() => {
    const step = GUIDED_STEPS[currentIdx];
    if (!step) return;
    const now = Date.now();
    setResults((prev) => ({ ...prev, [step.id]: { status: 'running', startedAt: now } }));
    beginPolling(step, now);
  }, [beginPolling, currentIdx]);

  const stop = useCallback(() => {
    stopPolling();
    setRunning(false);
    removeInterceptors();
  }, [removeInterceptors]);

  // Auto-advance when the current step resolves to pass/fail
  useEffect(() => {
    const step = GUIDED_STEPS[currentIdx];
    if (!step || !running) return;
    const r = results[step.id];
    if (r?.status === 'pass' || r?.status === 'fail') {
      const t = window.setTimeout(() => advance(), 400);
      return () => window.clearTimeout(t);
    }
  }, [advance, currentIdx, results, running]);

  const buildReport = useCallback(() => {
    const lines: string[] = ['# Calm Magic Board — Guided Test Report', ''];
    const counts = { pass: 0, fail: 0, skipped: 0, pending: 0, running: 0 };
    for (const step of GUIDED_STEPS) {
      const r = results[step.id];
      counts[r.status] = (counts[r.status] || 0) + 1;
      const icon =
        r.status === 'pass' ? '✅' : r.status === 'fail' ? '❌' : r.status === 'skipped' ? '⏭' : '⏳';
      lines.push(`- ${icon} **${step.label}** — ${r.detail ?? r.status}`);
    }
    lines.push('', `Totals: ${counts.pass} pass · ${counts.fail} fail · ${counts.skipped} skipped · ${counts.pending + counts.running} unresolved`);
    if (errorsRef.current.length) {
      lines.push('', '## Console errors captured');
      errorsRef.current.slice(0, 20).forEach((e) => lines.push(`- ${e.message.slice(0, 200)}`));
    }
    return lines.join('\n');
  }, [results]);

  return {
    running,
    steps: GUIDED_STEPS,
    currentStep: GUIDED_STEPS[currentIdx],
    currentIdx,
    results,
    start,
    stop,
    advance,
    retryCurrent,
    markManual,
    buildReport,
    capturedCalls: callsRef.current,
    capturedErrors: errorsRef.current,
  };
}
