---
uuid: "the-no-api-key-test-passes-only-because-ci-s-environment-is-empty"
title: "The no-API-key test passes only because CI's environment is empty"
status: "incoming"
type: "task"
priority: "P2"
points: "3"
labels: "testing, eta-mu, test-isolation"
category: "tasks"
write-id: "1786044954599-0.aopd6lqt0pwndmo9q4o"
created_at: "2026-08-06T19:35:54.599Z"
---

# The no-API-key test passes only because CI's environment is empty

## Outcome

`stream-chat-no-provider-configured-test` verifies the behaviour it names,
regardless of what the developer running it has exported.

## The evidence

`packages/eta-mu/test/cljs/eta_mu/extern/openai_test.cljs:318` asserts that
`stream-chat` short-circuits when nothing is configured:

```clojure
(deftest ^:async stream-chat-no-provider-configured-test
  (set! js/fetch (fn [_url _opts] (throw (js/Error. "fetch should not be called"))))
  (let [stream (await (openai/stream-chat
                        {:id "gpt-4o-mini" :provider "openai"}
                        {:system-prompt "sys" :messages [] :tools []}
                        {}))          ; <- empty config
        final (await (.result stream))]
    (is (re-find #"No API key configured" (:error-message final)))))
```

The config is `{}`, but the implementation falls back to the ambient
`OPENAI_API_KEY`. On a workspace where that is exported, the guard never fires,
`fetch` is called, and the test fails with:

```
FAIL in (stream-chat-no-provider-configured-test)
expected: (re-find #"No API key configured" (:error-message final))
  actual: (not (re-find #"No API key configured" "fetch should not be called"))
```

`env -u OPENAI_API_KEY pnpm --dir packages/eta-mu test` → **156 tests, 351
assertions, 0 failures**. Same commit, same code, opposite result.

## Why it matters

The test is green in CI for the wrong reason — not because the short-circuit is
correct, but because CI happens to run with an empty environment. That makes it
a poor guard for the thing it exists to guard: if the fallback broke such that
it *always* read the ambient key, CI would still be green.

It also makes any local pre-push check unreliable, which is how this surfaced.
The `pnpm gates` runner now scrubs provider variables to reproduce CI's
environment, but that is a workaround at the runner level — the test itself
still depends on ambient state.

## Scope

- Make the no-provider case explicit rather than ambient: inject the environment
  lookup (pass a resolver, or take the env map as an argument) so the test can
  state "no key, from anywhere" instead of relying on the absence of one.
- Audit the sibling cases in the same file that pass `:api-key` explicitly —
  those are fine; the gap is specifically the empty-config path.
- Check whether other packages have tests reading ambient provider config;
  `turn-processor` and `sol` are the likely candidates.

## Acceptance criteria

- The test passes with `OPENAI_API_KEY` exported **and** unset.
- A test asserts the ambient fallback still works when it is supposed to — the
  fix must not simply delete the fallback path from coverage.
- Running the package suite with a fully populated provider environment gives
  the same result as running it with an empty one.

## Notes

Found on 2026-08-06 by `pnpm gates` (`scripts/ci-gates.bb`) on its first real
run, during the GitHub Actions outage. The workspace has 35 provider-ish
variables exported, of which `OPENAI_API_KEY` is the one this test reads.
