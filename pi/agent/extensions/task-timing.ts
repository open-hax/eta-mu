import type {
  ExtensionAPI,
  ExtensionContext,
  ExtensionCommandContext,
} from "@mariozechner/pi-coding-agent";

import { performance } from "node:perf_hooks";

const STATUS_KEY = "task-timing";
const GLOBAL_KEY = "__pi_task_timing_state__";

type TimingState = {
  enabled: boolean;

  // Current run (one agent loop)
  running: boolean;
  agentStartMs: number;

  // Tool wall-time accounting (interval union where activeTools > 0)
  toolActiveCount: number;
  toolSegmentStartMs?: number;
  toolWaitTotalMs: number;

  // UI update loop
  interval?: NodeJS.Timeout;
  ctx?: ExtensionContext;
};

function getState(): TimingState {
  const g = globalThis as any;
  const existing = g[GLOBAL_KEY] as TimingState | undefined;
  if (existing) return existing;

  const fresh: TimingState = {
    enabled: true,
    running: false,
    agentStartMs: 0,
    toolActiveCount: 0,
    toolWaitTotalMs: 0,
  };

  g[GLOBAL_KEY] = fresh;
  return fresh;
}

function clearIntervalSafe(state: TimingState) {
  if (state.interval) {
    clearInterval(state.interval);
    state.interval = undefined;
  }
}

function fmtMs(ms: number): string {
  if (!Number.isFinite(ms) || ms < 0) ms = 0;
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const s = ms / 1000;
  if (s < 60) return `${s.toFixed(1)}s`;
  const m = Math.floor(s / 60);
  const rs = Math.floor(s % 60);
  return `${m}m${String(rs).padStart(2, "0")}s`;
}

function pct(n: number, d: number): number {
  if (d <= 0) return 0;
  return Math.max(0, Math.min(1, n / d));
}

function computeStats(state: TimingState, nowMs: number) {
  const totalMs = nowMs - state.agentStartMs;

  const toolWaitMs =
    state.toolWaitTotalMs +
    (state.toolActiveCount > 0 && state.toolSegmentStartMs != null
      ? nowMs - state.toolSegmentStartMs
      : 0);

  const inferenceMs = totalMs - toolWaitMs;

  const toolP = pct(toolWaitMs, totalMs);
  const infP = 1 - toolP;

  return {
    totalMs,
    toolWaitMs,
    inferenceMs,
    toolP,
    infP,
  };
}

function renderStatus(state: TimingState, nowMs: number): string {
  const { totalMs, toolWaitMs, inferenceMs, toolP, infP } = computeStats(state, nowMs);

  // NOTE: "inference" here is an approximation: total wall time minus tool-wait wall time.
  // It includes provider latency + streaming + any harness overhead.
  const infPct = Math.round(infP * 100);
  const toolPct = Math.round(toolP * 100);

  return `t=${fmtMs(totalMs)} | inference=${fmtMs(inferenceMs)} (${infPct}%) | tools=${fmtMs(toolWaitMs)} (${toolPct}%)`;
}

function refreshUI(state: TimingState) {
  if (!state.enabled) return;
  if (!state.ctx?.hasUI) return;
  if (!state.running) return;

  const now = performance.now();
  state.ctx.ui.setStatus(STATUS_KEY, renderStatus(state, now));
}

function stopAndFinalizeUI(state: TimingState) {
  if (!state.ctx?.hasUI) return;

  if (!state.enabled) {
    state.ctx.ui.setStatus(STATUS_KEY, undefined);
    return;
  }

  if (!state.running) return;

  const now = performance.now();
  state.ctx.ui.setStatus(STATUS_KEY, renderStatus(state, now));
}

function startTicker(state: TimingState) {
  clearIntervalSafe(state);
  state.interval = setInterval(() => refreshUI(state), 250);
}

function endToolSegmentIfNeeded(state: TimingState, nowMs: number) {
  if (state.toolActiveCount === 0 && state.toolSegmentStartMs != null) {
    state.toolWaitTotalMs += nowMs - state.toolSegmentStartMs;
    state.toolSegmentStartMs = undefined;
  }
}

export default function (pi: ExtensionAPI) {
  // Hot reload safety: if this module is reloaded, clear any prior ticker.
  // (jiti reload doesn’t necessarily tear down timers created by the old module instance)
  const state = getState();
  clearIntervalSafe(state);

  pi.registerCommand("timing", {
    description: "Toggle live task timing (runtime + inference vs tool wait split)",
    handler: async (_args: string | undefined, ctx: ExtensionCommandContext) => {
      state.enabled = !state.enabled;

      if (!state.enabled) {
        clearIntervalSafe(state);
        ctx.ui.setStatus(STATUS_KEY, undefined);
        ctx.ui.notify("Task timing: disabled", "info");
        return;
      }

      ctx.ui.notify("Task timing: enabled", "info");
      // If currently running, restart ticker and refresh immediately.
      if (state.running) {
        state.ctx = ctx;
        startTicker(state);
        refreshUI(state);
      }
    },
  });

  pi.on("agent_start", async (_event, ctx) => {
    state.ctx = ctx;

    state.running = true;
    state.agentStartMs = performance.now();
    state.toolActiveCount = 0;
    state.toolSegmentStartMs = undefined;
    state.toolWaitTotalMs = 0;

    if (!state.enabled) {
      if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, undefined);
      return;
    }

    if (ctx.hasUI) {
      ctx.ui.setStatus(STATUS_KEY, renderStatus(state, performance.now()));
      startTicker(state);
    }
  });

  pi.on("tool_execution_start", async (_event, ctx) => {
    if (!state.running) return;

    const now = performance.now();

    if (state.toolActiveCount === 0) {
      state.toolSegmentStartMs = now;
    }
    state.toolActiveCount++;

    state.ctx = ctx;
    refreshUI(state);
  });

  pi.on("tool_execution_end", async (_event, ctx) => {
    if (!state.running) return;

    const now = performance.now();
    state.toolActiveCount = Math.max(0, state.toolActiveCount - 1);
    endToolSegmentIfNeeded(state, now);

    state.ctx = ctx;
    refreshUI(state);
  });

  pi.on("agent_end", async (_event, ctx) => {
    if (!state.running) return;

    const now = performance.now();

    // If pi ends the agent loop while tools are still “active” (should be rare),
    // close the segment so totals remain consistent.
    if (state.toolActiveCount > 0 && state.toolSegmentStartMs != null) {
      state.toolWaitTotalMs += now - state.toolSegmentStartMs;
      state.toolSegmentStartMs = undefined;
      state.toolActiveCount = 0;
    }

    clearIntervalSafe(state);

    state.ctx = ctx;
    stopAndFinalizeUI(state);

    // Keep the final status visible until next agent_start.
    state.running = false;
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    clearIntervalSafe(state);
    state.running = false;
    state.toolActiveCount = 0;
    state.toolSegmentStartMs = undefined;
    state.toolWaitTotalMs = 0;

    if (ctx.hasUI) ctx.ui.setStatus(STATUS_KEY, undefined);
  });
}
