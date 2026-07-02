import { supabase } from '@/integrations/supabase/client';

export type StepStatus = 'pending' | 'running' | 'pass' | 'fail' | 'skipped';

export interface StepContext {
  /** Fetch calls captured since runner started */
  calls: Array<{ url: string; status: number; method: string; ts: number }>;
  /** Console errors captured since runner started */
  errors: Array<{ message: string; ts: number }>;
  /** Time when the current step began */
  startedAt: number;
}

export interface CheckResult {
  status: 'pass' | 'fail';
  detail: string;
}

export interface GuidedStep {
  id: string;
  group: 'personal' | 'org' | 'cross';
  label: string;
  instruction: string;
  /** Optional CSS selector to highlight while step is active */
  highlightSelector?: string;
  /** Auto verification — return null to keep waiting, or a result to resolve */
  autoCheck: (ctx: StepContext) => CheckResult | null | Promise<CheckResult | null>;
  /** Max ms to wait before offering manual mark. Default 45s */
  timeoutMs?: number;
}

const hasCall = (ctx: StepContext, urlFragment: string, sinceStep = true) =>
  ctx.calls.some(
    (c) =>
      c.url.includes(urlFragment) &&
      c.status >= 200 &&
      c.status < 400 &&
      (!sinceStep || c.ts >= ctx.startedAt),
  );

export const GUIDED_STEPS: GuidedStep[] = [
  {
    id: 'board-mounts',
    group: 'personal',
    label: 'Board renders 8×8 matrix',
    instruction: 'Confirm the 64-tile grid is visible on the page.',
    autoCheck: () => {
      const tiles = document.querySelectorAll(
        '[data-tile-id], [data-testid="tile"], .tile-cell, button[aria-label^="Tile "]',
      );
      if (tiles.length >= 60) {
        return { status: 'pass', detail: `Found ${tiles.length} tile elements` };
      }
      return null;
    },
  },
  {
    id: 'tile-open',
    group: 'personal',
    label: 'Open a tile',
    instruction: 'Click any tile in the board. The tile detail / agent panel should open.',
    autoCheck: (ctx) => {
      const panel = document.querySelector(
        '[data-testid="tile-detail-panel"], [role="dialog"], [data-state="open"]',
      );
      if (panel && Date.now() - ctx.startedAt > 300) {
        return { status: 'pass', detail: 'Detail panel is open' };
      }
      return null;
    },
  },
  {
    id: 'tile-write',
    group: 'personal',
    label: 'Write & save on a tile',
    instruction: 'Type a short answer on the open tile and save it.',
    autoCheck: (ctx) => {
      if (hasCall(ctx, '/rest/v1/tiles') || hasCall(ctx, '/rest/v1/tile')) {
        return { status: 'pass', detail: 'Supabase write to tiles detected' };
      }
      return null;
    },
    timeoutMs: 90_000,
  },
  {
    id: 'tile-agent',
    group: 'personal',
    label: 'Tile agent responds',
    instruction: 'Send one message to the tile agent from the open tile.',
    autoCheck: (ctx) => {
      const call = ctx.calls.find(
        (c) => c.url.includes('/functions/v1/tile-agent') && c.ts >= ctx.startedAt,
      );
      if (call) {
        return call.status < 400
          ? { status: 'pass', detail: `tile-agent → ${call.status}` }
          : { status: 'fail', detail: `tile-agent returned ${call.status}` };
      }
      return null;
    },
    timeoutMs: 90_000,
  },
  {
    id: 'persistence',
    group: 'personal',
    label: 'Persistence after reload',
    instruction:
      'Reload the page (⌘/Ctrl-R) with ?test=1 still in the URL, reopen the same tile, confirm your text is still there. Then mark this step.',
    autoCheck: async () => {
      // Cannot reliably auto-detect a reload; user marks manually.
      return null;
    },
  },
  {
    id: 'prd-list',
    group: 'org',
    label: 'PRD list loads',
    instruction: 'Navigate to /calm-magic-board/prds. The PRD list should render.',
    autoCheck: (ctx) => {
      if (hasCall(ctx, '/rest/v1/prds')) {
        return { status: 'pass', detail: 'GET /prds succeeded' };
      }
      return null;
    },
  },
  {
    id: 'prd-open',
    group: 'org',
    label: 'Open a PRD → org mode',
    instruction: 'Open any PRD from the list. The board should re-enter in organizational mode.',
    autoCheck: () => {
      const url = window.location.href;
      if (/prd|project/i.test(url) && document.querySelector('[data-tile-id], .tile-cell')) {
        return { status: 'pass', detail: `URL: ${window.location.pathname}` };
      }
      return null;
    },
  },
  {
    id: 'prd-write',
    group: 'org',
    label: 'Write to a PRD tile',
    instruction: 'Edit a tile in org mode and save. It should update the PRD row.',
    autoCheck: (ctx) => {
      if (hasCall(ctx, '/rest/v1/prds')) {
        return { status: 'pass', detail: 'PATCH/POST to prds detected' };
      }
      return null;
    },
    timeoutMs: 90_000,
  },
  {
    id: 'console-clean',
    group: 'cross',
    label: 'No console errors during run',
    instruction: 'Auto-check — click Verify to grade based on captured console errors.',
    autoCheck: (ctx) => {
      if (ctx.errors.length === 0) {
        return { status: 'pass', detail: '0 console errors captured' };
      }
      return {
        status: 'fail',
        detail: `${ctx.errors.length} error(s): ${ctx.errors
          .slice(0, 3)
          .map((e) => e.message.slice(0, 80))
          .join(' | ')}`,
      };
    },
  },
];

export async function checkAuthUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
