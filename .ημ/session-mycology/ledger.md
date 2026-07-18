- ts: 2026-07-10T21:02:59.880974712Z
  session: ses_0b22d17e2ffewi9rOZYs1A9G0w
  task: Organized timestamped notes in docs/notes/
  p-efficiency: 0.8
  p-friction: 0.2
  p-skill-candidate: 0.3
  spore: none
  receipt-refs: 2026-07-10T21:01:46.065Z
  note: Bulk note organization is safely scriptable once categories and slugs are decided; embedding metadata in the script keeps the operation reproducible.
- ts: 2026-07-12T04:42:27.432267638Z
  session: ses_0ab7f4f77ffe5FPx616BgensZf
  task: Fixed bracket mismatches, CLJS interop idioms, and test assertions in terminal-ui-cljs
  p-efficiency: 0.5
  p-friction: 0.7
  p-skill-candidate: 0.8
  spore: none
  receipt-refs: none
  note: Many bracket errors from AI-generated code. CLJS interop gotchas: Map.size is property not method, Segmenter returns iterable not iterator, StringBuffer doesn't exist in Node.js. Pattern: systematic bracket audit + CLJS JS interop idiom checklist.
- ts: 2026-07-12T05:08:31.328988047Z
  session: ses_0ab7f4f77ffe5FPx616BgensZf
  task: Fixed OpenCode extension runtime errors — build-tool return type mismatch
  p-efficiency: 0.7
  p-friction: 0.5
  p-skill-candidate: 0.6
  spore: none
  receipt-refs: none
  note: Extensions returned #js {:content ...} but OpenCode expects Promise<string>. Fix was small (result->string + wrap-execute) but required tracing the full loading chain. Pattern: OpenCode plugin API contract mismatch.
- ts: 2026-07-15T20:23:51.446131751Z
  session: /home/err/spaces/eta-mu
  task: Board triage: verify 6 review cards vs code, close umbrella epic, cut 3 follow-up cards
  p-efficiency: 0.8
  p-friction: 0.35
  p-skill-candidate: 0.7
  spore: none
  receipt-refs: none
  note: Pattern: review-card triage = re-run each card's own verification gate + grep the claimed namespaces before promoting; kanban comment CLI absorbs trailing flags into comment text
- ts: 2026-07-16T17:31:26.702349889Z
  session: /home/err/spaces/eta-mu
  task: Board triage: walk kanban, verify review gates, accept incoming, promote breakdown card, record dispatch order on epic
  p-efficiency: 0.85
  p-friction: 0.15
  p-skill-candidate: 0.4
  spore: none
  receipt-refs: none
  note: Epic card comment history is the real triage index — read it before individual cards; gates-first verification made review recommendation cheap
- ts: 2026-07-18T15:12:00Z
  session: /home/err/spaces/eta-mu (claude-code)
  task: Fix global eta-mu kanban rheos resolution + router flag swallowing
  p-efficiency: 0.75
  p-friction: 0.5
  p-skill-candidate: 0.75
  spore: 20260718-151200-spawn-bridge-raw-argv.md
  receipt-refs: 2026-07-18T15:10:00Z
  note: Two stacked bugs hid behind one symptom; verifying passthrough with a flagged command exposed the second.
- ts: 2026-07-18T20:35:00Z
  session: /home/err/spaces/eta-mu (claude-code)
  task: Publish eta-mu 1.1.1 + @eta-mu/{rheos,sol} with working kanban/sol from registry install
  p-efficiency: 0.7
  p-friction: 0.45
  p-skill-candidate: 0.7
  spore: 20260718-203500-shadow-esm-dep-audit.md
  receipt-refs: 2026-07-18T20:32:00Z
  note: grep for require() missed shadow-cljs ESM import shims; stale cljs-runtime files also lied about deps until a clean rebuild.
