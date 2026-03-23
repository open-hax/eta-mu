// @ts-nocheck
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { Type } from "@sinclair/typebox";

const HOME = os.homedir();
const STATE_DIR = path.join(HOME, ".pi", "agent", "state", "session-mycology");
const REFLECTIONS_FILE = path.join(STATE_DIR, "turn-reflections.jsonl");
const SPORES_FILE = path.join(STATE_DIR, "skill-spores.jsonl");
const SPORE_DRAFTS_DIR = path.join(STATE_DIR, "spores");
const STATUS_KEY = "session-mycology";
const GLOBAL_KEY = "__pi_session_mycology_state__";
const SPORE_THRESHOLD = 0.72;
const RECEIPT_PI_VERSION = "0.58.0";

function ensureDir(dir: string) {
  fs.mkdirSync(dir, { recursive: true });
}

function nowIso() {
  return new Date().toISOString();
}

function clamp01(value: unknown, fallback = 0.5) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(0, Math.min(1, n));
}

function slugify(value: unknown) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-") || "skill-spore";
}

function appendJsonl(filePath: string, value: any) {
  ensureDir(path.dirname(filePath));
  fs.appendFileSync(filePath, JSON.stringify(value) + "\n", "utf8");
}

function readJsonl(filePath: string, limit = 200) {
  if (!fs.existsSync(filePath)) return [];

  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/).filter(Boolean).slice(-limit);
  const rows: any[] = [];

  for (const line of lines) {
    try {
      rows.push(JSON.parse(line));
    } catch {
      // Ignore malformed historical lines.
    }
  }

  return rows;
}

function sameCwd(a?: string, b?: string) {
  if (!a || !b) return false;
  return path.resolve(a) === path.resolve(b);
}

function normalizeReuseScope(value: unknown) {
  const v = String(value ?? "session").trim().toLowerCase();
  return v === "turn" || v === "session" || v === "multi-session" ? v : "session";
}

function reflectionKind(reflection: any) {
  if (!reflection) return "none";
  if (clamp01(reflection.skillCandidateP, 0) >= SPORE_THRESHOLD) return "sporeworthy";
  if (clamp01(reflection.frictionP, 0) >= 0.68) return "gnarly";
  if (clamp01(reflection.efficiencyP, 0) >= 0.75 && clamp01(reflection.frictionP, 0) <= 0.35) return "smooth";
  return "mixed";
}

function getState() {
  const g = globalThis as any;
  if (g[GLOBAL_KEY]) return g[GLOBAL_KEY];

  const fresh = {
    enabled: true,
    currentTurn: 0,
    lastReflection: undefined as any,
    recentSpores: [] as any[],
  };

  g[GLOBAL_KEY] = fresh;
  return fresh;
}

function loadRecentSpores(cwd?: string, limit = 5) {
  const rows = readJsonl(SPORES_FILE, 400).filter((row) => !cwd || sameCwd(row.cwd, cwd));
  return rows.slice(-limit).reverse();
}

function findLatestSpore(slug: string, cwd?: string) {
  const rows = readJsonl(SPORES_FILE, 400).filter((row) => row.slug === slug && (!cwd || sameCwd(row.cwd, cwd)));
  return rows.at(-1);
}

function summarizeSpores(spores: any[]) {
  if (spores.length === 0) return "- none yet";

  return spores
    .map(
      (spore) =>
        `- ${spore.name} (recurrence ${spore.recurrence}, p_skill ${clamp01(spore.skillCandidateP, 0).toFixed(2)}): ${spore.description}`,
    )
    .join("\n");
}

function formatStatus(state: any) {
  if (!state.enabled) return "myco:off";
  const spores = state.recentSpores?.length ?? 0;
  const last = state.lastReflection
    ? ` last=${reflectionKind(state.lastReflection)} pS=${clamp01(state.lastReflection.skillCandidateP, 0).toFixed(2)}`
    : "";
  return `myco:on spores=${spores}${last}`;
}

function setStatus(ctx: any, state: any) {
  if (!ctx?.hasUI) return;
  ctx.ui.setStatus(STATUS_KEY, formatStatus(state));
}

function modelLabel(ctx: any) {
  const provider = ctx?.model?.provider ?? "unknown";
  const id = ctx?.model?.id ?? "unknown";
  return `${provider}/${id}`;
}

function buildSporeSkillDraft(spore: any) {
  return `---
name: ${spore.slug}
description: ${spore.description}
disable-model-invocation: true
metadata:
  origin: session-mycology-spore
  recurrence: ${spore.recurrence}
---

# ${spore.name}

## Goal
${spore.description}

## Use This Skill When
- The same friction pattern recurs.

## Do Not Use This Skill When
- The pain was only a one-off environment glitch.
`;
}

function buildSporeContractDraft(spore: any) {
  return `(skill-contract
  (name "${spore.slug}")
  (v "ημ.skill/${spore.slug}@0.0.1-spore")
  (intent "${spore.description}")

  (activation
    (priority 35)
    (explicit ["skill:${spore.slug}"])
    (triggers ["${spore.name.toLowerCase()}"]))

  (governance
    (touch-layer :mutable)
    (non-override [:mission :directives :safety :license :output-shape])
    (requires-user-approval false))
)`;
}

function writeSporeDraft(reflection: any, spore: any) {
  ensureDir(SPORE_DRAFTS_DIR);
  const filePath = path.join(SPORE_DRAFTS_DIR, `${spore.slug}.md`);

  const skillDraft = buildSporeSkillDraft(spore);
  const contractDraft = buildSporeContractDraft(spore);

  const content = `# Skill Spore: ${spore.name}

- Generated: ${spore.ts}
- Recurrence: ${spore.recurrence}
- CWD: ${spore.cwd}
- Reuse scope: ${spore.reuseScope}
- Reflection kind: ${spore.reflectionKind}
- p-efficiency: ${clamp01(reflection.efficiencyP, 0).toFixed(2)}
- p-friction: ${clamp01(reflection.frictionP, 0).toFixed(2)}
- p-skill-candidate: ${clamp01(reflection.skillCandidateP, 0).toFixed(2)}

## Lesson
${reflection.lesson || "_none captured_"}

## Better path next time
${reflection.betterPath || "_none captured_"}

## Candidate description
${spore.description}

## Promotion gate
Promote this spore into a live skill after either:
- recurrence >= 2
- explicit user request
- or strong evidence that the pattern generalizes beyond the current task

## Draft SKILL.md

~~~markdown
${skillDraft}
~~~

## Draft CONTRACT.edn

~~~edn
${contractDraft}
~~~

## Suggested live-skill path


- ${path.join(HOME, ".pi", "agent", "skills", spore.slug, "SKILL.md")}
- ${path.join(HOME, ".pi", "agent", "skills", spore.slug, "CONTRACT.edn")}
`;

  fs.writeFileSync(filePath, content, "utf8");

  return filePath;
}

function appendReceiptIfPresent(ctx: any, spore: any) {
  const receiptFile = path.join(ctx.cwd, "receipts.log");
  if (!fs.existsSync(receiptFile)) return;

  const refs = [spore.draftPath, SPORES_FILE].filter(Boolean).join(",");
  const line = `ts=${nowIso()} | kind=:catalog | origin=pi | owner=session-mycology | dod=session-mycology | pi=${RECEIPT_PI_VERSION} | host=local | manifest=none | refs=${refs} | note=incubated skill spore ${spore.name}\n`;
  fs.appendFileSync(receiptFile, line, "utf8");
}

function buildMemoryMessage(cwd: string) {
  const spores = loadRecentSpores(cwd, 3);
  if (spores.length === 0) return undefined;

  return `[SESSION MYCOLOGY MEMORY]
Recent reusable spores in this workspace:
${summarizeSpores(spores)}
Reuse only when directly relevant; otherwise ignore them.`;
}

function pruneMycologyContextMessages(messages: any[], enabled: boolean) {
  let keptOne = false;
  return [...messages].reverse().filter((message) => {
    if (message?.customType !== "session-mycology-context") return true;
    if (!enabled) return false;
    if (keptOne) return false;
    keptOne = true;
    return true;
  }).reverse();
}

export default function sessionMycology(pi: ExtensionAPI) {
  ensureDir(STATE_DIR);

  pi.registerCommand("mycology", {
    description: "Show or toggle the session-mycology loop (/mycology, /mycology on, /mycology off, /mycology spores)",
    handler: async (args, ctx) => {
      const state = getState();
      const command = String(args ?? "").trim().toLowerCase();

      if (command === "on") {
        state.enabled = true;
        ctx.ui.notify("Session mycology enabled", "info");
      } else if (command === "off") {
        state.enabled = false;
        ctx.ui.notify("Session mycology disabled", "info");
      }

      state.recentSpores = loadRecentSpores(ctx.cwd, 5);
      setStatus(ctx, state);

      if (!ctx.hasUI) return;

      if (command === "spores" || command === "" || command === "status" || command === "on" || command === "off") {
        const lines = [
          `session-mycology: ${state.enabled ? "enabled" : "disabled"}`,
          `recent spores (${state.recentSpores.length}):`,
          ...(state.recentSpores.length > 0
            ? state.recentSpores.map((spore: any) => `- ${spore.name} [${spore.reuseScope}] recurrence=${spore.recurrence}`)
            : ["- none yet"]),
        ];
        ctx.ui.setWidget(STATUS_KEY, lines);
      }
    },
  });

  pi.registerTool({
    name: "session_mycology",
    label: "Session Mycology",
    description: "Record a per-turn retrospective with p-scores and incubate reusable skill spores when work felt harder than it should have.",
    promptSnippet: "Record per-turn efficiency/friction/skill-candidate p-scores and incubate reusable skill spores near the end of substantive turns.",
    promptGuidelines: [
      "Use this tool near the end of a substantive turn when you have enough evidence to judge whether the work path was efficient or hard.",
      "Use p scores as scalar confidence values from 0..1, not as fake calibrated probabilities.",
      "Only include candidateName and candidateDescription when the pattern seems reusable beyond the immediate task.",
      "Skip this tool for tiny conversational turns or when there is not enough signal yet.",
    ],
    parameters: Type.Object({
      action: Type.String({ description: 'Action: "reflect" to record a retrospective, or "list_recent" to inspect recent spores.' }),
      efficiencyP: Type.Optional(Type.Number({ description: "Confidence 0..1 that the chosen path was near-minimal." })),
      frictionP: Type.Optional(Type.Number({ description: "Confidence 0..1 that the work was harder than it should have been." })),
      skillCandidateP: Type.Optional(Type.Number({ description: "Confidence 0..1 that a reusable skill or protocol would compress future effort." })),
      lesson: Type.Optional(Type.String({ description: "Short lesson from the turn." })),
      betterPath: Type.Optional(Type.String({ description: "Better path to try next time." })),
      candidateName: Type.Optional(Type.String({ description: "Candidate skill name if a spore should be incubated." })),
      candidateDescription: Type.Optional(Type.String({ description: "One sentence describing the candidate skill." })),
      reuseScope: Type.Optional(Type.String({ description: 'Optional reuse scope: "turn", "session", or "multi-session".' })),
    }),
    async execute(_toolCallId, params, _signal, _onUpdate, ctx) {
      const state = getState();
      const action = String(params.action ?? "reflect").trim().toLowerCase();

      if (action === "list_recent") {
        state.recentSpores = loadRecentSpores(ctx.cwd, 5);
        setStatus(ctx, state);
        return {
          content: [{ type: "text", text: state.recentSpores.length > 0 ? summarizeSpores(state.recentSpores) : "- none yet" }],
          details: { spores: state.recentSpores },
        };
      }

      if (action !== "reflect") {
        throw new Error(`Unknown session_mycology action: ${params.action}`);
      }

      const reflection = {
        ts: nowIso(),
        turn: state.currentTurn,
        cwd: ctx.cwd,
        sessionFile: ctx.sessionManager?.getSessionFile?.(),
        model: modelLabel(ctx),
        efficiencyP: clamp01(params.efficiencyP, 0.5),
        frictionP: clamp01(params.frictionP, 0.5),
        skillCandidateP: clamp01(params.skillCandidateP, 0.5),
        lesson: String(params.lesson ?? "").trim(),
        betterPath: String(params.betterPath ?? "").trim(),
      };

      appendJsonl(REFLECTIONS_FILE, reflection);
      state.lastReflection = reflection;

      let spore: any;
      const name = String(params.candidateName ?? "").trim();
      const description = String(params.candidateDescription ?? "").trim();
      const shouldIncubate =
        name.length > 0 &&
        description.length > 0 &&
        (reflection.skillCandidateP >= SPORE_THRESHOLD || reflection.frictionP >= 0.68);

      if (shouldIncubate) {
        const slug = slugify(name);
        const prior = findLatestSpore(slug, ctx.cwd);

        spore = {
          ts: nowIso(),
          name,
          slug,
          description,
          reuseScope: normalizeReuseScope(params.reuseScope),
          cwd: ctx.cwd,
          sessionFile: ctx.sessionManager?.getSessionFile?.(),
          model: modelLabel(ctx),
          reflectionTs: reflection.ts,
          reflectionKind: reflectionKind(reflection),
          recurrence: Math.max(1, Number(prior?.recurrence ?? 0) + 1),
          efficiencyP: reflection.efficiencyP,
          frictionP: reflection.frictionP,
          skillCandidateP: reflection.skillCandidateP,
        };

        spore.draftPath = prior?.draftPath || path.join(SPORE_DRAFTS_DIR, `${spore.slug}.md`);
        writeSporeDraft(reflection, spore);

        appendJsonl(SPORES_FILE, spore);
        appendReceiptIfPresent(ctx, spore);

        if (ctx.hasUI) {
          ctx.ui.notify(`Session mycology incubated spore: ${spore.name}`, "info");
        }
      }

      state.recentSpores = loadRecentSpores(ctx.cwd, 5);
      setStatus(ctx, state);

      return {
        content: [
          {
            type: "text",
            text: spore
              ? `Recorded reflection (p_eff=${reflection.efficiencyP.toFixed(2)}, p_fric=${reflection.frictionP.toFixed(2)}, p_skill=${reflection.skillCandidateP.toFixed(2)}). Incubated spore: ${spore.name} -> ${spore.draftPath}`
              : `Recorded reflection (p_eff=${reflection.efficiencyP.toFixed(2)}, p_fric=${reflection.frictionP.toFixed(2)}, p_skill=${reflection.skillCandidateP.toFixed(2)}). No spore incubated.`,
          },
        ],
        details: { reflection, spore },
      };
    },
  });

  pi.on("session_start", async (_event, ctx) => {
    const state = getState();
    state.recentSpores = loadRecentSpores(ctx.cwd, 5);
    state.currentTurn = 0;
    setStatus(ctx, state);
  });

  pi.on("session_switch", async (_event, ctx) => {
    const state = getState();
    state.recentSpores = loadRecentSpores(ctx.cwd, 5);
    state.currentTurn = 0;
    setStatus(ctx, state);
  });

  pi.on("context", async (event) => {
    const state = getState();
    return {
      messages: pruneMycologyContextMessages(event.messages, state.enabled),
    };
  });

  pi.on("before_agent_start", async (event, ctx) => {
    const state = getState();
    if (!state.enabled) return;

    const memoryMessage = buildMemoryMessage(ctx.cwd);
    const systemPrompt =
      event.systemPrompt +
      `

[SESSION MYCOLOGY ACTIVE]
At the end of each substantive turn, silently run a tiny retrospective.
- p-efficiency = confidence the path was near-minimal.
- p-friction = confidence the work felt harder than it should have.
- p-skill-candidate = confidence a reusable skill or protocol would compress future effort.
If you have enough evidence, call the session_mycology tool once near the end of the turn with action="reflect".
If p-skill-candidate >= ${SPORE_THRESHOLD.toFixed(2)} and the pattern seems reusable beyond the immediate task, include candidateName and candidateDescription so a draft skill spore can be incubated.
Keep this loop quiet unless the user explicitly asks about it.
Skip the tool for tiny conversational turns or when evidence is too thin.`;

    if (!memoryMessage) {
      return { systemPrompt };
    }

    return {
      systemPrompt,
      message: {
        customType: "session-mycology-context",
        content: memoryMessage,
        display: false,
      },
    };
  });

  pi.on("turn_start", async (event, ctx) => {
    const state = getState();
    state.currentTurn = typeof event.turnIndex === "number" ? event.turnIndex : state.currentTurn + 1;
    setStatus(ctx, state);
  });

  pi.on("session_shutdown", async (_event, ctx) => {
    if (ctx.hasUI) {
      ctx.ui.setStatus(STATUS_KEY, undefined);
    }
  });
}
