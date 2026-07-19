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

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

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

const ALLOW_MARKER = /contract-guard:\s*allow/;
// (def NAME ...), tolerating defonce/def- etc. and ^:meta between def and name
const DEF_RE = new RegExp(
  String.raw`\(def[\w-]*\s+(?:\^[^\s]+\s+)*(${OWNED.join("|")})\b`
);

function* cljFiles(dir) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) yield* cljFiles(p);
    else if (/\.clj[cs]?$/.test(entry)) yield p;
  }
}

const dirs = process.argv.slice(2);
if (dirs.length === 0) {
  console.error("contract-guard: no directories given");
  process.exit(2);
}

const violations = [];
for (const dir of dirs) {
  for (const file of cljFiles(dir)) {
    const lines = readFileSync(file, "utf8").split("\n");
    lines.forEach((line, i) => {
      const m = DEF_RE.exec(line);
      if (m && !ALLOW_MARKER.test(line) && !ALLOW_MARKER.test(lines[i - 1] ?? "")) {
        violations.push(`${file}:${i + 1}: (def ${m[1]} ...)`);
      }
    });
  }
}

if (violations.length > 0) {
  console.error(
    "contract-guard FAILED — katamorph.schema is the canonical owner of " +
      "these contract schemas.\nDo not redefine them locally; extend " +
      "katamorph and bump the deps.edn git-ref instead\n" +
      "(deliberate exception: comment marker `contract-guard: allow`).\n"
  );
  for (const v of violations) console.error("  " + v);
  process.exit(1);
}
console.log(`contract-guard OK (${dirs.join(", ")})`);
