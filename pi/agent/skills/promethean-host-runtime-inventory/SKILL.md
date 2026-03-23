---
name: promethean-host-runtime-inventory
description: SSH into Promethean hosts, inventory active Docker/Podman/systemd/Proxmox runtimes, map public subdomains to live services, and write both JSON records and a markdown report.
license: GPL-3.0
compatibility:
  - opencode
  - codex
---

# Skill: Promethean Host Runtime Inventory

## Goal
Produce an honest Promethean fleet snapshot that distinguishes container-backed routes, host-process-backed routes, and unreachable or ambiguous hosts.

## Use This Skill When
- The user asks to inventory `*.promethean.rest` hosts, containers, subdomains, or live runtime placement.
- You need to answer questions like "what is running on ussy/ussy2/ussy3/big.ussy?"
- You need durable host inventory artifacts, not just an in-chat summary.
- You need a repeatable report that maps public hostnames to Docker containers versus host processes.

## Do Not Use This Skill When
- The task is only to check a single service health endpoint with no host-level inventory.
- The target systems are not Promethean hosts or the user only wants DNS records without runtime inspection.
- You cannot use SSH and no other runtime evidence source is available.

## Inputs
- A host list, defaulting to the Promethean fleet when relevant:
  - `ussy.promethean.rest`
  - `ussy2.promethean.rest`
  - `ussy3.promethean.rest`
  - `big.ussy.promethean.rest`
- Likely SSH usernames from prior evidence; prefer repository/spec truth before guessing.
- Reverse-proxy/runtime config paths when known, especially Caddy files under deployed service roots.
- A target artifact date or timestamp for deterministic output filenames.

## Steps
1. Reuse prior evidence first.
   - Search repo specs, receipts, and deployment notes for working SSH usernames, runtime roots, and known route files.
2. Probe SSH honestly.
   - Verify the actual reachable SSH user/host combination before assuming `docker` exists.
3. Inventory active runtimes on each reachable host.
   - Prefer `docker ps` when Docker exists.
   - Fall back to Podman, systemd services, and Proxmox/LXC/QEMU evidence when the host is not Docker-backed.
4. Inspect active public-routing config.
   - Read live Caddy/nginx/proxy config on the remote host.
   - Distinguish hostname declarations from actual upstream targets.
5. Classify routes carefully.
   - `publicContainerRoutes`: hostname/path backed by currently running containers.
   - `hostProcessRoutes`: hostname/path backed by host processes or localhost services instead of containers.
   - `referencesOnly`: env/config references to hostnames that the current host does not actually serve.
6. Write durable artifacts.
   - JSON records: `docs/reports/inventory/promethean-host-runtime-inventory-<date>.json`
   - Markdown report: `docs/reports/inventory/promethean-host-runtime-inventory-<date>.md`
7. Preserve caveats.
   - Record unreachable hosts, TLS failures, 404s, or ambiguous routes instead of smoothing them over.
8. Update receipts for non-trivial runs.
   - Log the start, completion, and verification in `receipts.log` without exposing secrets.

## Output
- A JSON inventory file with one record per host.
- A markdown report summarizing runtime type, running services, public hostnames, and ambiguities.
- A concise chat summary that separates facts from interpretation.

## JSON Record Shape
```json
{
  "generatedAt": "ISO-8601",
  "records": [
    {
      "host": "ussy.promethean.rest",
      "sshTarget": "error@ussy.promethean.rest",
      "runtime": {
        "docker": { "available": true, "runningCount": 30 },
        "podman": { "available": false, "runningCount": 0 },
        "systemd": { "available": true },
        "proxmox": { "available": false }
      },
      "publicContainerRoutes": [],
      "hostProcessRoutes": [],
      "referencesOnly": [],
      "containers": [],
      "notes": []
    }
  ]
}
```

## Notes
- A hostname appearing in config is not enough; tie it to a live upstream and say whether that upstream is a container or a host process.
- A running container is not enough; say whether it has a public hostname, only an internal port, or merely references another host.
- For Proxmox hosts like `big.ussy`, inventory systemd and `/etc/pve` state even when Docker is absent.
