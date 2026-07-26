#!/usr/bin/env node
/**
 * Contract Redefinition Guard — katamorph is canon.
 *
 * Fails when a consumer package (re)defines a contract schema name that
 * katamorph.schema owns. Locally-defined copies are exactly how the contract
 * layer drifted into 4+ parallel incarnations (see kanban epic
 * katamorph-canonical-cutover); this guard makes the canon load-bearing.
 *
 * To extend a contract legitimately: extend katamorph and bump the git-ref
 * in deps.edn. For a deliberate, reviewed local exception, put the marker
 * `contract-guard: allow` in a comment on the offending line.
 *
 * Usage (from a consumer package dir, wired into its lint script):
 *   node ../../scripts/contract-guard.mjs <src-dir> [more-dirs...]
 *
 * The OWNED list mirrors katamorph.schema (v0.2.0). It is divergence-tested:
 * open-hax.sol.law.contract-kinds-test fails whenever katamorph's registry
 * gains a kind this list does not cover.
 */

import { readdirSync, readFileSync, realpathSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

// Every def name katamorph.schema owns (schemas + primitives), v0.2.0.
export const OWNED = [
  "ContractId", "ToolId", "ISODuration", "EvalOp", "PolicyOutcome",
  "Severity", "EvalNode", "PolicyMatch", "FulfillmentMatch", "AgentSpec",
  "ActorCapSpec", "ContextPolicy", "RuntimeSourceRef", "UiAction",
  "SubAgentConfig", "AgentContract", "SubAgentContract", "ActorContract",
  "RoleContract", "UserSurface", "CapabilityContract", "PolicyContract",
  "PolicyGateContract", "FulfillmentContract", "StrategyContract",
  "ActionContract", "StoreContract", "NamespaceFile", "TriggerContract",
  "GeneratorContract", "ScheduleContract", "SourceEmission",
  "SourceListener", "RuntimeSourceContract", "ModelFamilyContract",
  "ModelContract", "McpServerContract", "SourceModeContract",
  "RuntimeFeatureContract", "CmsContract", "ProviderContract",
  "IngestSourceContract",
];

const ALLOW_MARKER = /;.*contract-guard:\s*allow/;
const OWNED_SET = new Set(OWNED);
const OPEN_TO_CLOSE = new Map([["(", ")"], ["[", "]"], ["{", "}"]]);
const CLOSERS = new Set(OPEN_TO_CLOSE.values());
const READER_PREFIXES = new Set(["'", "`", "~", "~@", "@", "#'"]);

function boundary(ch) {
  return ch === undefined || /[\s,()[\]{}";]/.test(ch);
}

/**
 * Tokenize the structural subset needed to recognize Clojure def forms.
 * Strings, regex bodies, comments, and character literals are skipped while
 * line numbers and collection delimiters are preserved.
 */
export function tokenizeClojure(source) {
  const tokens = [];
  let i = 0;
  let line = 1;

  while (i < source.length) {
    const ch = source[i];
    if (ch === "\n") {
      line += 1;
      i += 1;
    } else if (/[\s,]/.test(ch)) {
      i += 1;
    } else if (ch === ";") {
      while (i < source.length && source[i] !== "\n") i += 1;
    } else if (ch === "\"") {
      i += 1;
      while (i < source.length) {
        if (source[i] === "\\") {
          i += Math.min(2, source.length - i);
        } else if (source[i] === "\"") {
          i += 1;
          break;
        } else {
          if (source[i] === "\n") line += 1;
          i += 1;
        }
      }
    } else if (ch === "\\") {
      // Character literal: consume at least the character after the slash,
      // then any remaining named-character token (for example \newline).
      i += 1;
      if (i < source.length) i += 1;
      while (i < source.length && !boundary(source[i])) i += 1;
    } else if (OPEN_TO_CLOSE.has(ch) || CLOSERS.has(ch)) {
      tokens.push({ value: ch, line });
      i += 1;
    } else {
      const start = i;
      while (i < source.length && !boundary(source[i])) i += 1;
      if (i > start) tokens.push({ value: source.slice(start, i), line });
    }
  }

  return tokens;
}

function formEnd(tokens, start) {
  const first = tokens[start]?.value;
  if (READER_PREFIXES.has(first) ||
      (first?.startsWith("^") && first !== "^")) {
    return formEnd(tokens, start + 1);
  }
  if (first === "^") {
    return formEnd(tokens, formEnd(tokens, start + 1));
  }
  const expected = OPEN_TO_CLOSE.get(first);
  if (!expected) return Math.min(start + 1, tokens.length);

  const stack = [expected];
  for (let i = start + 1; i < tokens.length; i += 1) {
    const value = tokens[i].value;
    if (OPEN_TO_CLOSE.has(value)) {
      stack.push(OPEN_TO_CLOSE.get(value));
    } else if (value === stack[stack.length - 1]) {
      stack.pop();
      if (stack.length === 0) return i + 1;
    }
  }
  return tokens.length;
}

function discardedIndexes(tokens) {
  const discarded = new Set();
  for (let i = 0; i < tokens.length; i += 1) {
    const value = tokens[i].value;
    let start;
    if (value === "#_" || value === "'" || value === "`") {
      start = i + 1;
    } else if (value === "(" && tokens[i + 1]?.value === "quote") {
      start = i + 2;
    } else {
      continue;
    }
    const end = formEnd(tokens, start);
    for (let j = start; j < end; j += 1) discarded.add(j);
    if (value !== "(") i = Math.max(i, end - 1);
  }
  return discarded;
}

function definitionNameIndex(tokens, defIndex) {
  let i = defIndex + 1;
  while (i < tokens.length) {
    const value = tokens[i].value;
    if (value === "^") {
      i = formEnd(tokens, i + 1);
    } else if (value.startsWith("^")) {
      i += 1;
    } else {
      return i;
    }
  }
  return -1;
}

export function findContractRedefinitions(source, file) {
  const lines = source.split("\n");
  const tokens = tokenizeClojure(source);
  const discarded = discardedIndexes(tokens);
  const violations = [];

  for (let i = 0; i < tokens.length - 2; i += 1) {
    if (discarded.has(i) || tokens[i].value !== "(") continue;
    const defToken = tokens[i + 1];
    if (discarded.has(i + 1) || !/^def[\w-]*$/.test(defToken.value)) continue;
    const nameIndex = definitionNameIndex(tokens, i + 1);
    if (nameIndex < 0 || discarded.has(nameIndex)) continue;
    const nameToken = tokens[nameIndex];
    if (!OWNED_SET.has(nameToken.value)) continue;
    const lineIndex = nameToken.line - 1;
    const markerStart = Math.max(0, defToken.line - 2);
    const markerLines = lines.slice(markerStart, lineIndex + 1);
    if (markerLines.some((lineText) => ALLOW_MARKER.test(lineText))) continue;
    violations.push(`${file}:${nameToken.line}: (def ${nameToken.value} ...)`);
  }

  return violations;
}

export function* cljFiles(dir, visited = new Set()) {
  const realDir = realpathSync(dir);
  if (visited.has(realDir)) return;
  visited.add(realDir);

  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) yield* cljFiles(p, visited);
    else if (/\.clj[cs]?$/.test(entry)) yield p;
  }
}

export function guardDirectories(dirs) {
  const violations = [];
  const visited = new Set();
  for (const dir of dirs) {
    for (const file of cljFiles(dir, visited)) {
      violations.push(...findContractRedefinitions(readFileSync(file, "utf8"), file));
    }
  }
  return violations;
}

export function main(dirs) {
  if (dirs.length === 0) {
    console.error("contract-guard: no directories given");
    return 2;
  }

  const violations = guardDirectories(dirs);
  if (violations.length > 0) {
    console.error(
      "contract-guard FAILED — katamorph.schema is the canonical owner of " +
        "these contract schemas.\nDo not redefine them locally; extend " +
        "katamorph and bump the deps.edn git-ref instead\n" +
        "(deliberate exception: comment marker `contract-guard: allow`).\n"
    );
    for (const v of violations) console.error("  " + v);
    return 1;
  }
  console.log(`contract-guard OK (${dirs.join(", ")})`);
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  process.exitCode = main(process.argv.slice(2));
}
