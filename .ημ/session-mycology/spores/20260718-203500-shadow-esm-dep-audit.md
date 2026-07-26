---
status: incubating
created: 2026-07-18T20:35:00Z
source-session: /home/err/spaces/eta-mu (claude-code)
source-task: Publish eta-mu 1.1.1; sol 0.1.0 crashed on missing @fastify/websocket
p-efficiency: 0.7
p-friction: 0.45
p-skill-candidate: 0.7
promoted-to: ""
rejected-reason: ""
---

## Problem
Pruning a shadow-cljs package's npm dependencies to "what the dist actually
requires" by grepping for `require("...")` shipped a broken package: dev-mode
(:esm/compile) builds express npm imports as separate
`shadow.esm.esm_import$<pkg>.js` shim files, not inline require calls. The
first published @eta-mu/sol only declared fastify and crashed at import time.

## Pattern
1. shadow-cljs *release* bundles inline their imports (grep works);
   *dev/compile* builds split them into esm_import shims (grep misses them).
2. cljs-runtime accumulates stale shims across builds — a dropped dependency
   (@open-hax/eta-mu-cli) still had a shim file until `rm -rf dist` + rebuild.

## Candidate skill outline
- Name suggestion: shadow-cljs-dep-audit
- Trigger phrases: "prune dependencies", "publish a shadow-cljs package",
  "ERR_MODULE_NOT_FOUND from cljs-runtime"
- Key steps: clean rebuild first; derive the dep set from BOTH
  `grep -oE 'require\("[^"]+"\)'` AND `ls cljs-runtime | grep esm_import`
  (decode $ → /); cross-check against what the entry file actually references.
- Anti-patterns: trusting an incremental dist; trusting require()-grep alone
  for ESM targets; declaring deps from package.json history.

## Better path
Before publishing any shadow-cljs artifact: clean rebuild, enumerate imports
from the build output (both encodings), then install the packed tarball in a
bare temp dir and boot it once before pushing to the registry.

## Receipt refs
- 2026-07-18T20:32:00Z eta-mu-1.1.1-publish
