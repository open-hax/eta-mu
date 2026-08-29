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

- ts: 2026-07-26T01:00:00Z
  session: /home/err/spaces/eta-mu
  task: PR #142 review closeout — 20 threads across two waves, merged to main
  p-efficiency: 0.75
  p-friction: 0.55
  p-skill-candidate: 0.85
  spore: 20260726-010000-review-thread-closeout-verification.md
  receipt-refs: pr-142-review-should-fix-batch
  note: 14 of 15 "open" threads were already fixed in code — the merge was blocked purely by unresolved conversations, not by work. Verify each finding against the branch tip BEFORE planning fixes; the worktree was 6 commits behind, so agents had to read blobs via `git show origin/<branch>:<path>`. Two gates the bots' own fix commits left red (a test stubbing p/process with a delay that cannot satisfy 3-arity deref; 2 promise-chain kondo warnings) were invisible because neither `pnpm lint` nor sol's lint runs in CI — a review-fix commit's evidence test can itself be failing.
- ts: 2026-08-06T19:05:00Z
  session: /home/err/spaces/eta-mu
  task: Second-pass PR sweep — verify 5 PR/card bindings, unblock #158/#169/#170, fix #157 guard, correct roadmap
  p-efficiency: 0.7
  p-friction: 0.55
  p-skill-candidate: 0.85
  spore: 20260806-190500-worktree-cwd-write-targeting.md
  receipt-refs: 2026-08-06T19:05:19.774Z
  note: Persistent shell cwd silently retargeted a build and a board write into another worktree; both reported success, and the misread became a false claim about the primary tree's install state.

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
- ts: 2026-07-30T22:51:28.016759133Z
  session: /home/err/spaces/eta-mu/.claude/worktrees/agent-operating-standard
  task: Split the CLI identity: eta-mu stays published, eta-mu-beta links to the working tree
  p-efficiency: 0.8
  p-friction: 0.45
  p-skill-candidate: 0.8
  spore: none
  receipt-refs: none
  note: pnpm link --global lost the PATH race to volta, so the fix was a second binary name rather than a PATH fight. Found the owner's existing global eta-mu-beta symlink had been dangling since the workspace moved out of ~/devel/orgs — the second absolute-path integration broken by that move after the Rheos systemd unit. AGENTS.md was itself telling agents to run bare 'eta-mu kanban', i.e. the published build; corrected to eta-mu-beta.
- ts: 2026-08-07T01:32:18.677209583Z
  session: /home/err/spaces/eta-mu
  task: P1 drift-verdict card: corrected its diagnosis, fixed the real parse bug, plus a silent comment-CLI data-loss bug (PR #182)
  p-efficiency: 0.8
  p-friction: 0.45
  p-skill-candidate: 0.85
  spore: none
  receipt-refs: 2026-08-07T01:20:08.455Z
  note: Card's 'live confirmation' proved the trigger (git) but not the mechanism (assumed race, actually a quoted-only YAML regex; 68/282 cards unparseable). Proved new tests catch it by restoring pre-fix logic behind the same signatures. Detours: kanban comment --text silently stored the flag name; worktree needed node_modules symlinks; FSM build gate does not scrub provider env vars unlike pnpm gates; pnpm test rewrites checked-in models.generated.ts from live network.
- ts: 2026-08-07T02:32:50.893224312Z
  session: /home/err/spaces/eta-mu
  task: Board walk: closed the FSM status-validation card's remaining DoD with three-layer regression tests (PR #183)
  p-efficiency: 0.75
  p-friction: 0.4
  p-skill-candidate: 0.8
  spore: none
  receipt-refs: none
  note: Falsified most new tests by bypassing the FSM verdict in move-task! and matching the failures to the bug's real signature — but skipped that check on the exit-code test, which is exactly the one that turned out to assert a constant (:refused -> 3) instead of the behaviour that sets it. CodeRabbit caught it. Also: the comment --text fix merged in #182 was not in force because eta-mu-beta symlinks to an unrebuilt dist-cli, so the bug reproduced on main and corrupted a card; the receipt claiming it fixed made it less likely to be doubted. Carded the two out-of-scope defects found (build gate rewrites models.generated.ts; merged != shipped for dist-cli).
- ts: 2026-08-09T23:38:03Z
  session: /home/err/spaces/eta-mu
  task: PR #280 clio review-resolution, two rounds of 16 bot findings; merged, then follow-up PR #282 for two post-merge findings
  p-efficiency: 0.75
  p-friction: 0.5
  p-skill-candidate: 0.85
  spore: 20260809-233803-an-acknowledged-plan-is-a-hypothesis.md
  receipt-refs: 2026-08-09T22:56:48.517Z
  note: Reproduced all 16 findings before acknowledging; one did not reproduce (orn/catn/altn/multi labels never leaked) but the probe exposed the inverse unsound defect, a branch labeled :enum dropping its real child. Two acknowledged plans were falsified by building the artifact — npm bin cannot be a .nbb because npm symlinks bins and nbb walks the unresolved path for nbb.edn; edamame expands syntax-quote into (quote sym) leaves so the quote/syntax-quote distinction does not survive parsing. Both corrected on-thread with evidence rather than silently substituted. Mechanical trap: #280 merged 90s before the last two findings landed, and I committed the receipt onto the deleted branch before cherry-picking it onto #282.
- ts: 2026-08-13T08:01:03Z
  session: /home/err/spaces/eta-mu
  task: Resolve the kanban ledger merge conflict and audit Clio/Rheos integration
  p-efficiency: 0.85
  p-friction: 0.35
  p-skill-candidate: 0.45
  spore: none
  receipt-refs: 2026-08-09T23:36:03.841Z
  note: A lossless append-log merge is base plus both independently appended tails in event-time order; Clio's generic partition kernel is present, but Rheos still writes the monolithic tracked ledger and treats checkout changes as drift.
- ts: 2026-08-13T08:23:49.006500480Z
  session: /home/err/spaces/eta-mu
  task: Resolve PR #181 conflicts after merging main
  p-efficiency: 0.82
  p-friction: 0.58
  p-skill-candidate: 0.82
  spore: 20260813-082341-resolve-generated-artifact-conflicts-at-the-source.md
  receipt-refs: pr-181-main-merge-conflicts
  note: Translated main's direct CI edits into #181's declarative workflow source, then regenerated instead of selecting conflict sides.
- ts: 2026-08-29T15:25:38Z
  session: /workspace/scratch/8d4eacbf051e/worktrees/eta-tranche-evidence-v2
  task: Complete eta-mu PR tranche #281, #284, #285, and #287; supersede invalid closeout proposal #293
  p-efficiency: 0.82
  p-friction: 0.43
  p-skill-candidate: 0.65
  spore: none
  receipt-refs: 2026-08-29T14:58:40Z, 2026-08-29T15:04:50Z, 2026-08-29T15:04:51Z, 2026-08-29T15:23:34Z, 2026-08-29T15:25:14Z, 2026-08-29T15:25:38Z
  note: Exact-head patch verification made implementation merges mechanical, but the first evidence proposal validated only the global skill schema and missed eta-mu's local :repo law. Evidence review caught that plus ambiguous receipt refs. Better path: run the consuming repository's validator before publishing receipts. No new spore; the existing review-thread-closeout-verification spore covers the general review loop and the candidate score remains below promotion threshold.
