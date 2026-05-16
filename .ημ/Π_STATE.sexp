(fork-tax-state
  (repo "eta-mu")
  (branch "pi/fork-tax/20260516-eta-mu-recursive")
  (base "927b4321bf4e")
  (timestamp "20260516T185547Z")
  (scope "metadata runtime-events opmf-contract-gate self-contained-pi")
  (verification
    "git diff --cached --check passed after whitespace normalization"
    "pnpm --dir packages/eta-mu-extensions test passed"
    "pnpm --dir packages/coding-agent test test/agent-session-runtime-events.test.ts passed")
  (residual "none"))
