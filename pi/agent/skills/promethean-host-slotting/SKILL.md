---
name: promethean-host-slotting
description: Choose staging and production Promethean host slots, subdomains, runtime paths, and compose-project names from the allowed base-host pool.
license: GPL-3.0
compatibility:
  - opencode
  - codex
---

# Skill: Promethean Host Slotting

## Goal
Pick predictable staging/production placement for a Promethean service without inventing hostnames or hiding transport/runtime constraints.

## Use This Skill When
- A service needs `staging.<service>.promethean.rest` and `<service>.promethean.rest` placement.
- You need to choose among the allowed base hosts.
- You need deploy paths, compose-project names, and GitHub env-var values before wiring CI/CD.
- SSH transport may need to use direct IPs while public traffic still uses DNS hostnames.

## Do Not Use This Skill When
- The service is not deploying into the Promethean host fleet.
- The host choice is already fixed and documented in the repo or task context.
- The task is only to edit unrelated CI checks with no deployment placement changes.

## Inputs
- Service slug/name.
- Optional explicit staging/prod host overrides.
- Allowed base hosts:
  - `ussy.promethean.rest`
  - `ussy2.promethean.rest`
  - `ussy3.promethean.rest`
  - `big.ussy.promethean.rest`
- SSH reachability, DNS reachability, and any discovered existing live placement.

## Steps
1. Normalize the service slug.
   - Use a lowercase hyphenated service name for paths, compose projects, and subdomains.
2. Derive the public hostnames.
   - Staging: `staging.<slug>.promethean.rest`
   - Production: `<slug>.promethean.rest`
3. Prefer existing truth over new guesses.
   - If the service already has a live host, compose project, or runtime root, preserve it unless the user explicitly wants migration.
4. Probe the allowed base hosts.
   - Check public DNS resolution.
   - Check SSH reachability.
   - Note any transport-vs-public-host differences.
5. Use this default host preference when no stronger signal exists.
   - Production: `ussy.promethean.rest`, then `big.ussy.promethean.rest`, then `ussy2.promethean.rest`, then `ussy3.promethean.rest`.
   - Staging: `ussy3.promethean.rest`, then `ussy2.promethean.rest`, then `big.ussy.promethean.rest`, then `ussy.promethean.rest`.
6. Prefer separate staging and production hosts when a safe reachable pair exists.
   - If separation is not practical, reuse one host but isolate by path, compose project, and public hostname.
7. Emit deterministic runtime conventions.
   - Production path: `~/devel/services/<slug>`
   - Staging path: `~/devel/services/<slug>-staging`
   - Production compose project: `<slug>` unless an existing stack proves otherwise.
   - Staging compose project: `<slug>-staging` unless an existing stack proves otherwise.
8. Emit GitHub environment-variable values.
   - `STAGING_SSH_HOST`, `STAGING_PUBLIC_HOST`, `STAGING_DEPLOY_PATH`, `STAGING_COMPOSE_PROJECT_NAME`, `STAGING_BASE_URL`
   - `PRODUCTION_SSH_HOST`, `PRODUCTION_PUBLIC_HOST`, `PRODUCTION_DEPLOY_PATH`, `PRODUCTION_COMPOSE_PROJECT_NAME`, `PRODUCTION_BASE_URL`
   - include `*_VERIFY_RESOLVE_ADDRESS` when HTTPS validation must preserve the public hostname but runner DNS is flaky.

## Output
- Selected staging and production base hosts.
- Public staging and production hostnames.
- Runtime paths and compose-project names.
- A GitHub vars checklist future deploy workflows can consume directly.

## Notes
- Keep SSH transport address and public hostname separate when necessary.
- Do not invent hosts outside the allowed base-host pool.
- If multiple safe options remain, state the default heuristic and any uncertainty explicitly.
