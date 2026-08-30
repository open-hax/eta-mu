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
- ts: 2026-08-29T18:35:28Z
  session: /workspace/scratch/8d4eacbf051e/worktrees/eta-mu-review-gate-truth
  task: Make the reusable OpenCode evidence-review workflow truth-preserving
  p-efficiency: 0.86
  p-friction: 0.78
  p-skill-candidate: 0.94
  spore: 20260829-183528-separate-evidence-retention-from-terminal-truth.md
  receipt-refs: 2026-08-29T17:55:47Z, 2026-08-29T18:13:52Z, 2026-08-29T18:18:48Z, 2026-08-29T18:22:25Z, 2026-08-29T18:24:16Z, 2026-08-29T18:26:30Z, 2026-08-29T18:35:28Z
  note: The old wrapper proved that artifact retention and caller truth can diverge; exact-head evidence likewise needs an observed HEAD, not a copied expected value. The repair separates command collection, deterministic summary, review publication, and one terminal verdict, while preserving a known tracked generator side effect only after proving and restoring its clean baseline. Executable tests run the workflow's embedded scripts and are falsified with targeted mutations. One incubating spore recorded; no promotion in this session.
- ts: 2026-08-29T20:54:59Z
  session: /workspace/scratch/b068bebfe603/eta-mu-pr299
  task: Close every exact-head review finding on eta-mu PR #299 before it becomes constellation review authority
  p-efficiency: 0.88
  p-friction: 0.56
  p-skill-candidate: 0.62
  spore: none
  receipt-refs: 2026-08-29T20:31:12Z, 2026-08-29T20:34:02Z, 2026-08-29T20:46:52Z
  note: Executable tests reproduced the undefined default helper, caller/event head mismatch, and missing pull-request-context paths before repair. Fresh exact-head review caught the non-PR neutrality hole after the first patch, so the better path is to enumerate eligible, intentionally unsupported, and malformed event classes in the terminal contract. No new spore; the existing separate-evidence-retention-from-terminal-truth and review-thread-closeout-verification spores cover the reusable pattern.
- ts: 2026-08-29T22:00:12Z
  session: /workspace/scratch/8d4eacbf051e/eta-mu-issue-drain
  task: Lawfully reconcile the audited eta-mu issues #199, #268, #271, #272, #274, and #276
  p-efficiency: 0.84
  p-friction: 0.64
  p-skill-candidate: 0.48
  spore: none
  receipt-refs: 2026-08-29T21:59:55.923Z
  note: Rehydrating from the exact merged main after scratch loss preserved canonical ledger history. The current-tree Rheos source, exact pinned Katamorph dependency, and live GitHub planner proved 23 lawful board events, 287 valid cards, no duplicate issue markers, and six scoped updates before publication. The full projector also exposed 69 unrelated stale updates, so the safe boundary is to apply only the six audited operations after merge and rerun the planner. No new spore; the existing worktree-cwd-write-targeting, review-thread-closeout-verification, and separate-evidence-retention-from-terminal-truth spores already cover the reusable lessons.
- ts: 2026-08-29T23:10:41Z
  session: /workspace/scratch/8d4eacbf051e/eta-sc2129
  task: Repair ShellCheck SC2129 in the reusable review-resolution gate
  p-efficiency: 0.88
  p-friction: 0.46
  p-skill-candidate: 0.58
  spore: none
  receipt-refs: 2026-08-29T23:10:27.371Z
  note: The one-file grouped redirect was proven by the same pinned actionlint/ShellCheck command before and after the change. A connector create request can succeed even when its response cannot be serialized, while the public listing remains briefly stale; duplicate preflight after convergence caught the retry-created issue and allowed #302 to be deprojected and closed without corrupting canonical #301. No new spore; the existing review closeout and worktree targeting spores already cover the broader verification discipline.
- ts: 2026-08-29T23:48:49Z
  session: /workspace/scratch/8d4eacbf051e/eta-mu-post300
  task: Preserve review prerequisites and recover one omitted review submission
  p-efficiency: 0.84
  p-friction: 0.67
  p-skill-candidate: 0.76
  spore: none
  receipt-refs: 2026-08-29T23:48:49Z
  note: A failed-job rerun is not a fresh upstream attempt: names recomputed from github.run_attempt can strand immutable successful evidence. Passing the uploaded names through needs outputs preserves that causality. The provider omission path is distinct and receives exactly one in-job retry only for an absent tool artifact; malformed or repeated omissions remain red. The existing separate-evidence-retention-from-terminal-truth spore already covers this reusable pattern, so no duplicate spore was incubated.
- ts: 2026-08-30T00:01:04Z
  session: /workspace/scratch/8d4eacbf051e/eta-mu-post300
  task: Make the bounded recovery runner available inside reusable caller workspaces
  p-efficiency: 0.82
  p-friction: 0.61
  p-skill-candidate: 0.71
  spore: none
  receipt-refs: 2026-08-30T00:01:04Z
  note: Direct-repository hosted checks can conceal a reusable-workflow path defect because the implementation file exists only in the provider checkout. Packaging the exact source bytes into the already checksummed context artifact preserves the single revision-bound transport boundary; a byte-parity regression makes the otherwise encoded carrier auditable. The existing separate-evidence-retention-from-terminal-truth spore covers this boundary, so no duplicate spore was incubated.
- ts: 2026-08-30T00:40:13Z
  session: /workspace/scratch/8d4eacbf051e/eta-mu-post300
  task: Close rejected-invocation durability findings on eta-mu PR #304
  p-efficiency: 0.86
  p-friction: 0.58
  p-skill-candidate: 0.68
  spore: none
  receipt-refs: 2026-08-30T00:40:13Z
  note: Exact-head review exposed that an invocation can fail before the omission classifier and leave neither durable metadata nor finalized streams. The repair records rejected and non-zero attempts before classification, finalizes both streams on every child-process path, and locks original-error/no-retry semantics in the packaged runner. Rheos's closing comment delimiter was independently proven canonical rather than rewritten. The existing separate-evidence-retention-from-terminal-truth spore covers this boundary, so no duplicate spore was incubated.
- ts: 2026-08-30T01:09:23Z
  session: /workspace/scratch/8d4eacbf051e/eta-mu-post304
  task: Reconcile eta-mu PR #304 and issue #296 from the exact landed tree
  p-efficiency: 0.91
  p-friction: 0.31
  p-skill-candidate: 0.42
  spore: none
  receipt-refs: 2026-08-30T01:09:23Z
  note: The guarded merge preserved the reviewed tree, so closeout was a small causal projection: append landed evidence, walk review through document to done, then refresh GitHub only after those bytes land. CodeRabbit's exact-head quota stop remains explicit evidence rather than being promoted into a review result. No new spore; the existing review-thread-closeout-verification and separate-evidence-retention-from-terminal-truth spores cover the reusable boundary.
- ts: 2026-08-30T01:25:24Z
  session: /workspace/scratch/8d4eacbf051e/eta-terminal-pr
  task: Stop ensure-prs from recreating unchanged terminal pull requests
  p-efficiency: 0.88
  p-friction: 0.39
  p-skill-candidate: 0.63
  spore: none
  receipt-refs: 2026-08-30T01:25:24Z
  note: Open-only inventory erased terminal history and turned a stable branch into perpetual intake. Binding terminal evidence to both ref and SHA handles the cheap unchanged case; a serial base comparison handles incorporated or newly divergent heads without an API burst. One accidental root-scoped Vitest invocation demonstrated why package-root commands are the authority in this linked worktree; the correct package suite is 20/20. No new spore; the existing exact-head and worktree-command-scope lessons cover the reusable failure mode.
- ts: 2026-08-30T02:21:12Z
  session: /workspace/scratch/8d4eacbf051e/eta-compare-isolation
  task: Isolate terminal-PR base comparison failures before activation
  p-efficiency: 0.84
  p-friction: 0.53
  p-skill-candidate: 0.62
  spore: none
  receipt-refs: 2026-08-30T02:21:12Z
  note: Post-merge activation review caught an orchestration gap before the unsafe pin landed: a repository-wide comparison rejection could discard unrelated valid work. Separating discovery from per-branch divergence preserves whole-repository progress and records the failed branch without weakening terminal-head or zero-ahead suppression; the CLJS migration inventory now names the extracted boundary and its actual consumers. No new spore; the existing review-thread exact-head and separate-evidence-retention lessons cover the reusable pattern.
- ts: 2026-08-30T03:32:45Z
  session: /workspace/scratch/0d23a6d476fc/worktrees/rheos-roundtrip
  task: Restore Rheos dependency round-trip safety and lawful planning metadata
  p-efficiency: 0.78
  p-friction: 0.64
  p-skill-candidate: 0.72
  spore: none
  receipt-refs: 2026-08-30T03:32:39.640Z
  note: The empty-array parser defect was one boundary line, but proving the repair required following the whole-file comment rewrite and every create/update adapter. Kondo exposed a nested deftest that the green compiler run had not executed, and a tracked NUL fixture made its diff binary, so the new cases were isolated in a reviewable text namespace. The repository-wide review hook remains blocked before package builds by managed ignored-build policy; scoped Rheos and eta-mu gates are green and no supply-chain policy was relaxed. No new spore: falsify-every-new-test, worktree-cwd-write-targeting, and verify-the-binary-not-the-source already cover the reusable lessons.
