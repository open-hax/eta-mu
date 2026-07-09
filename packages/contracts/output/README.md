# @eta-mu/contracts-output

Output contract validation and review for eta-mu responses.

This package ports the legacy TypeScript `output-contract-gate` into
ClojureScript, organized under the `eta-mu.contracts.output.*` namespace:

- `law.contract` — Malli schemas for normalized contracts, markdown ASTs,
  validation reports, review reports, and generation reports.
- `shape.edn` (planned) — EDN parsing and contract normalization.
- `shape.markdown` — Pure markdown parsing and section extraction.
- `domain.validate` — Deterministic validation of markdown responses against a
  contract.
- `domain.review` — Stub review scoring and GPT review message building.
- `domain.repair` — Repair-prompt compilation from validation failures.
- `infra.cli` (planned) — Thin CLI facade over the pure layers.
- `extern.js` — Small JS interop helpers (datetime, parsing).

## Build

```bash
pnpm build
```

## Test

```bash
pnpm test
```

## License

GPL-3.0-or-later
