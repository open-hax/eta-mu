# Π Snapshot — 2026-07-12T033921Z

**Branch:** device/yoga  
**Tag:** Π/device/yoga/2026-07-12T033921

## Summary
- Renamed `packages/extensions-e2e/` → `packages/e2e/` (namespace cleanup: `eta_mu_extensions_e2e` → `eta_mu_e2e`)
- Added new CLJS coding layers: `domain/auth`, `domain/settings`, `infra/auth`, `infra/extension`, `infra/settings`, `law/settings`, `shape/settings`
- Added new e2e tests: `coding_session_lifecycle_test`, `coding_settings_auth_test`, `coding_tool_dispatch_test`, `cross_package_extension_coding_test`
- Added new CLJS tests: `domain/auth_test`, `domain/settings_test`, `infra/auth_test`, `infra/extension_test`, `infra/settings_test`
- Updated kanban tasks and ledger
- Updated GitHub workflows (e2e.yml rename)
- Updated README
- Updated `pnpm-lock.yaml`

## Verification
- `pnpm -C packages/runtime test` — 6/6 passed
- `pnpm -C packages/e2e lint:kondo` — 0 errors, 0 warnings
