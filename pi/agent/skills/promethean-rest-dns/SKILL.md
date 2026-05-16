---
name: promethean-rest-dns
description: Create or update *.promethean.rest DNS A records through Cloudflare by copying current allowed base-host IPs while preserving unrelated zone records.
license: GPL-3.0
compatibility:
  - opencode
  - codex
---

# Skill: Promethean.rest DNS

## Goal
Create or update `*.promethean.rest` A records safely through Cloudflare without manual dashboard clicking.

## Use This Skill When
- You need a new `*.promethean.rest` subdomain.
- You want a host label to point at one of the allowed base hosts: `ussy`, `ussy2`, `ussy3`, or `big.ussy`.
- You want a dry-run-first operator flow before writing DNS changes.
- The zone is managed in Cloudflare.

## Do Not Use This Skill When
- You are buying or transferring domains.
- You need non-`promethean.rest` registrar automation.
- The zone has not been migrated to Cloudflare yet.
- You do not have a Cloudflare API token for the zone.

## Inputs
- Desired host label, e.g. `battlebussy`, `staging.battlebussy`, or nested label `voxx.ussy`.
- One or more target cores: `ussy`, `ussy2`, `ussy3`, `big.ussy`, or explicit IPs.
- Cloudflare credentials/config via environment:
  - `CLOUDFLARE_API_TOKEN` or `CLOUD_FLARE_PROMETHEAN_DOT_REST_DNS_ZONE_TOKEN`
  - optional `CLOUDFLARE_ZONE_NAME` (defaults to `promethean.rest`)
  - optional `CLOUDFLARE_ZONE_ID` (auto-discovered if omitted)

## Steps
1. Resolve the current allowed base-host IPs:
   - `python tools/promethean_rest_dns.py show-cores`
2. Dry-run the record change first:
   - `python tools/promethean_rest_dns.py ensure battlebussy --core ussy --dry-run`
   - staging example: `python tools/promethean_rest_dns.py ensure staging.battlebussy --core ussy3 --dry-run`
   - nested example: `python tools/promethean_rest_dns.py ensure voxx.ussy --core big.ussy --dry-run`
3. If desired, enable Cloudflare proxying:
   - `python tools/promethean_rest_dns.py ensure battlebussy --core ussy --proxied --dry-run`
4. Apply the change once the plan looks correct:
   - `python tools/promethean_rest_dns.py ensure battlebussy --core ussy`
5. Verify DNS resolution after the update:
   - `python tools/promethean_rest_dns.py show-cores`
   - `python - <<'PY' ... socket.getaddrinfo('battlebussy.promethean.rest', ...) ... PY`

## Output
- A created or updated `*.promethean.rest` A record in Cloudflare.
- JSON output showing desired records, existing records, and the exact create/update/delete plan.

## Safety notes
- The helper updates only the requested host label and preserves unrelated records in the zone.
- For the requested host label, it replaces conflicting routing record types (`A`, `AAAA`, `CNAME`, `HTTPS`, `SVCB`) while preserving non-conflicting records.
- Do a dry run first for non-trivial changes.
- Recommended token scope: zone-scoped DNS edit access, plus zone read access if you want automatic zone lookup by name.
