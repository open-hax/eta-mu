# Bounded reusable review-job budget — local preparation

Base: `09a4454480baa67f6fdc40f6f73f5e48ef0457d1` (remote main verified before
creating the isolated worktree). Owner: `opencode-mimo-evidence-review-agent`,
In Progress, five points; status and estimate remain unchanged.

The implementation retains a 45-minute default and admits an explicit
`review_timeout_minutes: 120`. Unsupported supplied values fail in the first
review-job step. The 120-minute option is a prospective budget experiment, not
proof that the complete review will finish. Truth PR54's actual 45-minute
cancellation assessed 401 of 807 chunks without submission or publication:
[failed run](https://github.com/octave-commons/Truth/actions/runs/37605835577).
Complete immutable input, every coverage/submission gate, provider/model,
MAX_ATTEMPTS=2 and other job deadlines are unchanged.

## Local evidence

- RED `e222afbf`: three expected failures for missing input/guard on unchanged
  production; `red.json` and both streams preserve the command and output.
- GREEN: 77 tests passed, zero failures/skips. `green.json` pins the actual
  source and existing Node 22.20.0 / yaml 2.8.3 runtime. This is the complete
  repository `review-workflow` suite, not a full monorepo run.
- `preservation.json` records parsed workflow equality after removing only the
  three intended budget changes, exact old test bodies and recovery source.
- Node syntax and whitespace pass. `static.json` retains the original actionlint
  SIGTERM outcome; the DEVNULL/debug/process attempts also remain unsuccessful.
  `actionlint-transport.json` records the existing isolated transport repair's
  successful standard actionlint/ShellCheck run without rule exclusions.
  `lint-transport-source.json` compares 97 official Go files: only the subprocess
  stdin transport in `process.go` differs. The global tool was not changed.
- `scope-proof.json` preserves the initial proof assertion correction: canonical
  Rheos combines comments in one section, so existing content is checked as an
  exact prefix. The comment was not retried. Canonical before/scoped/verified
  reads and two ordinary comment outcomes remain inspectable.
- `closure.json` pins the final source, append-only prefixes, two new canonical
  events and the independent local source review. That review is not native
  approval or hosted qualification.

No provider call, native/JVM run, paid credit, CI retry, push, PR, caller update,
status transition or external review request occurred in this preparation.
No old failed run becomes passing evidence. A future caller must select a
qualified immutable workflow revision and obtain a complete native outcome.

`CLOSED-FILES.txt` lists every file in this diagnostic bundle. `SHA256SUMS`
hashes every listed file except itself. Failed attempts are retained literally.
