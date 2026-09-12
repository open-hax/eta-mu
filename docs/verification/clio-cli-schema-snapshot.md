# Clio CLI schema snapshot ordering

Actual CodeRabbit finding `5646503100` on foundation
`cb4bcb4d9d0825bde063bcf9f6cc1c2ed4daa669` identified one remaining caller of
the old read order: `clio canonicalize` loaded schema revisions before capturing
its locked ledger snapshot. A peer could publish a new immutable schema and
append an event before the reader acquired that lock. The command would then
refuse a valid event because its earlier schema inventory lacked the new root.

The command now delegates to `runtime/canonicalize-files` with its schema
directory. That shared operation captures the ledger snapshot first and loads
revisions afterward. Command arguments, relative-path behavior and output keys
remain unchanged; unavailable or corrupt schema evidence is still refused.

## Actual command reproduction

The permanent regression starts the published `bin/clio.mjs` launcher as a real
subprocess. A test-only Node preload pauses its actual ledger `openSync` before
acquiring the read descriptor. The parent process then publishes a new schema
through `runtime/open` and writes its referencing event through ordinary
admission and fsync. Releasing the reader exercises the public command, real
filesystem and real schema loader. No schema, event or command output is mocked.

Before the repair, the command returned exit 1 and
`:clio.schema/unknown-revision`. The full NBB suite reported **71 tests / 302
assertions, 1 failure, 0 errors**. A focused diagnostic captured the exact CLI
output and confirmed that cause. After the repair, assertions verify exit 0,
the new event's exact ID and the complete event payload in command output.

## Harness obstacles and corrections

- The initial asynchronous test declaration, followed by an anonymous wrapper,
  failed NBB analysis with unresolved `await`. These setup failures were not
  counted as the behavioral reproduction. The work now lives in named native
  `^:async` functions, with `cljs.test/async` used only to signal completion.
- Peer review required the completion boundary itself to use native
  async/await; it now waits for the process's `close` event and output closure.
- Preload paths in `NODE_OPTIONS` are quoted as environment-value text. A real
  Node invocation with spaces in both directory and filename passed; this is
  not shell interpolation.
- A leader can exit while a descendant retains inherited output pipes. Cleanup
  therefore tracks actual closure and terminates the owned process group before
  removing fixtures. A second real subprocess regression reproduces that case:
  restoring the old leader-exit check produced **1 failure / 5 assertions**;
  the repaired pair of focused tests passed **2 tests / 5 assertions**. The
  descendant has its own final timeout backstop, so the failing experiment did
  not leave an orphan. Native process-group verification was performed on Linux.

All subprocess output and temporary files are owned by these tests. The
published launcher inherits the caller's runtime configuration, and only the
test-only read barrier adds scoped environment values. Spawn failures cannot
turn an absent child PID into a process-group-0 signal.

## Final gates and self-review

Fresh final package results:

| Gate | Result |
| --- | --- |
| NBB | 72 tests, 306 assertions, 0 failures/errors |
| Shadow CLJS | 72 tests, 306 assertions, 0 failures/errors; 117 files, 3 compiled, 0 warnings, 24.38 s |
| Babashka | 29 tests, 182 assertions, 0 failures/errors |
| JVM Clojure | 75 tests, 329 assertions, 0 failures/errors |
| Package lint and extern boundary | 0 errors, 0 warnings; clean |
| Native preload syntax and spaced-path probe | Passed |
| Diff whitespace check | Clean |

The JVM/Babashka runs verify the unchanged kernel; the Node suites exercise the
new CLI and lifecycle regressions. Explicit test counters were inspected in
addition to process exits. Logs are under the sandbox runtime's
`evidence/clio-cli-schema-*` and `evidence/clio-cli-spaced-preload.log`.

Author and independent bounded source reviews found no confirmed remaining
defect in command ordering, schema refusal, argument/output parity, native
barrier sequencing or cleanup. The independent review was read-only and did
not claim a separate execution of the gates above.

## Mandatory eta-mu CLI gate

The root `AGENTS.md` CLI gate was also run on this exact successor: advertised
eta-mu tests passed 174 tests / 391 assertions plus workflow tests 6 / 78, all
with zero failures/errors. Shadow compiled 200 files with zero warnings.
Advertised `lint:kondo` passed with zero errors/warnings and two existing
information-level diagnostics. Logs are `clio-cli-eta-test.log` and
`clio-cli-eta-lint.log` under runtime evidence. This supplements the Clio gates;
it is not a carried-forward result from an earlier source revision.
