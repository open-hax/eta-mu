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
- ts: 2026-07-19T00:05:00Z
  session: /home/err/spaces/eta-mu
  task: Board triage — closed sol epic, staged FSM bug card to ready, picked next work
  p-efficiency: 0.8
  p-friction: 0.35
  p-skill-candidate: 0.5
  spore: none
  receipt-refs: board-triage-2026-07-19
  note: eta-mu kanban frontmatter now enforces the rheos FSM — closing a card means walking valid edges (breakdown->ready->todo->in_progress->testing->review->document->done); direct-to-done is rejected. Also `kanban find <uuid>` returns full card JSON, not a matches wrapper.
- ts: 2026-07-19T00:35:00Z
  session: /home/err/spaces/eta-mu
  task: Closed contracts-git-ref-extraction card + epic via gate re-run
  p-efficiency: 0.85
  p-friction: 0.2
  p-skill-candidate: 0.4
  spore: none
  receipt-refs: contracts-git-ref-extraction-eta-mu-consumers
  note: Cards in `testing` may carry stale package names in their gate commands (@open-hax/* -> @eta-mu/* rename); resolve names from package.json before declaring a filter miss a failure. Rheos dropped event-ledger for protocols' EDN event-admission — epic criteria can be satisfied by dep removal, not just git-ref.
- ts: 2026-07-19T01:10:00Z
  session: /home/err/spaces/eta-mu
  task: Grokked katamorph intent across 4 repos; authored katamorph-canonical-cutover epic + 6 cards
  p-efficiency: 0.8
  p-friction: 0.5
  p-skill-candidate: 0.75
  spore: 20260719-011000-extraction-needs-adoption-cards.md
  receipt-refs: katamorph-canonical-cutover
  note: Extraction epics that card only removal (not consumer adoption + enforcement) guarantee schema drift — found 4 parallel copies of katamorph.schema.
- ts: 2026-07-19T02:05:00Z
  session: /home/err/spaces/eta-mu
  task: Executed sol-katamorph-schema-cutover + katamorph-provider-contract (katamorph v0.2.0)
  p-efficiency: 0.85
  p-friction: 0.3
  p-skill-candidate: 0.55
  spore: none
  receipt-refs: sol-katamorph-schema-cutover
  note: Writing the first-ever validation test for a schema kind exposed a latent invalid-ref bug (katamorph :policy children ref never resolved) — canon cutover work should sweep EVERY registry kind with at least one validate test, not just the kinds the consumer uses. Also — cwd drifts across Bash calls after cd; use absolute paths.
- ts: 2026-07-19T04:15:00Z
  session: /home/err/spaces/eta-mu
  task: event-ledger v0.3.0 — fixed wire-format + driver>=6 seq bugs, truth pass
  p-efficiency: 0.8
  p-friction: 0.35
  p-skill-candidate: 0.6
  spore: none
  receipt-refs: event-ledger-envelope-truth
  note: Serialization bugs hide when tests assert on the RETURNED value instead of the WRITTEN artifact — always round-trip through the real boundary (raw insertOne payload, the committed dist). Also — mixing shadow-cljs release+compile builds can leave a stale cache producing phantom 'cljs$core$IFn undefined' test errors; rm -rf .shadow-cljs target and rebuild before diagnosing.
- ts: 2026-07-29T09:58:13.948426354Z
  session: /home/err/spaces/eta-mu
  task: Extract eta-mu ledger protocols into package-owned APIs
  p-efficiency: 0.78
  p-friction: 0.36
  p-skill-candidate: 0.60
  spore: none
  receipt-refs: none
  note: Preserve a colliding legacy leaf command by multiplexing only known protocol subcommands; generated schema registries kept version authority out of skills and the app router.
- ts: 2026-07-26T01:00:00Z
  session: /home/err/spaces/eta-mu
  task: PR #142 review closeout — 20 threads across two waves, merged to main
  p-efficiency: 0.75
  p-friction: 0.55
  p-skill-candidate: 0.85
  spore: 20260726-010000-review-thread-closeout-verification.md
  receipt-refs: pr-142-review-should-fix-batch
  note: 14 of 15 "open" threads were already fixed in code — the merge was blocked purely by unresolved conversations, not by work. Verify each finding against the branch tip BEFORE planning fixes; the worktree was 6 commits behind, so agents had to read blobs via `git show origin/<branch>:<path>`. Two gates the bots' own fix commits left red (a test stubbing p/process with a delay that cannot satisfy 3-arity deref; 2 promise-chain kondo warnings) were invisible because neither `pnpm lint` nor sol's lint runs in CI — a review-fix commit's evidence test can itself be failing.
- ts: 2026-07-30T22:32:19.953475303Z
  session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
  task: Recover stashed board history, prune dead worktrees, record the agent operating standard
  p-efficiency: 0.72
  p-friction: 0.6
  p-skill-candidate: 0.85
  spore: none
  receipt-refs: none
  note: A 'clean' working tree is not evidence the work is safe: git status showed nothing while a GitKraken auto-stash held the only copy of an epic and ten rescope records. Enumerate git stash list BEFORE concluding a repo is clean, and prove landed-ness by comparing blob hashes (git rev-parse stash@{0}:<path>) against main and every open PR branch rather than reading diffs. The ledger union was lossless only because main's log was a literal prefix of the stashed one — verify prefix-extension by byte comparison, do not assume it.
- ts: 2026-07-30T22:44:57.182830641Z
  session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
  task: Verify packages/eta-mu has the receipts subcommands; retract findings made against the published binary
  p-efficiency: 0.45
  p-friction: 0.8
  p-skill-candidate: 0.95
  spore: none
  receipt-refs: none
  note: Produced a page of confident, plausible, false CLI findings because 'eta-mu' on PATH was the published npm build, not the workspace — same version number, different command surface. The binary did not error, it answered incorrectly. Before treating any CLI output as evidence: resolve the binary (readlink -f $(which x)), compare it to the source command registry, and build the tree. Also: a build inside a worktree with no node_modules exits 0 while emitting 163 undeclared-var warnings and producing a broken artifact — exit code 0 is not proof of a good build.
