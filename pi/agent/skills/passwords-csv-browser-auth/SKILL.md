---
name: passwords-csv-browser-auth
description: "Safely source website credentials from the local ignored passwords.csv export for browser automation without printing or committing secrets."
metadata:
  owner: local
  version: 1
---

# Skill: Passwords CSV Browser Auth

## Goal
Use the local ignored `passwords.csv` export to authenticate browser automation tasks safely, without leaking credentials into chat output, tracked files, receipts, or screenshots.

## Use This Skill When
- A browser task needs login credentials for a website or admin panel.
- The user explicitly authorizes using locally stored credentials.
- A matching credential is likely present in `./passwords.csv` or `~/Documents/passwords.csv`.
- You need to complete web actions after login, such as dashboard setup, OAuth app creation, or settings changes.

## Do Not Use This Skill When
- An API token, existing authenticated browser state, or another non-password flow is sufficient.
- The user has not authorized credential use.
- `passwords.csv` is missing, malformed, or has no unambiguous match.
- The task would require revealing raw credentials to the user or storing them in tracked files.

## Inputs
- Target URL, origin, or hostname.
- Optional explicit path to `passwords.csv`.
- Browser automation target and expected post-login action.

## Expected CSV Shape
Observed local header shape:
- `url`
- `username`
- `password`
- `httpRealm`
- `formActionOrigin`
- `guid`
- `timeCreated`
- `timeLastUsed`
- `timePasswordChanged`

Treat `username` and `password` as secrets. Never print them in final responses.

## Credential Source Rules
1. Prefer an explicit user-provided CSV path.
2. Otherwise check, in order:
   - `./passwords.csv`
   - `~/Documents/passwords.csv`
3. Verify the file is outside version control or gitignored before using it.
4. Only inspect headers, row counts, and masked metadata unless you are extracting a specific matching credential for immediate use.

## Matching Protocol
1. Normalize the target into origin + hostname.
2. Parse the CSV locally.
3. Match rows in this order:
   - exact `formActionOrigin` origin match
   - exact origin match from `url`
   - exact hostname match from `url`
   - parent-domain/suffix hostname match as a last resort
4. If multiple rows remain, prefer the most recently used entry (`timeLastUsed`) when present.
5. If the match is still ambiguous, stop and surface only masked candidates, such as host + masked username.

## Safe Extraction Protocol
- Never run commands that echo credential values to stdout.
- Prefer command substitution so secrets become shell variables without appearing in tool output.
- Unset the variables immediately after the login step.

Example pattern:

```bash
eval "$(${PYTHON:-python3} - <<'PY'
import csv, shlex
from pathlib import Path
from urllib.parse import urlparse

TARGET = 'https://github.com/settings/applications/new'
CANDIDATES = [Path('passwords.csv'), Path.home() / 'Documents' / 'passwords.csv']

def host(value: str) -> str:
    try:
        return (urlparse(value).hostname or '').lower()
    except Exception:
        return ''

target_host = host(TARGET)
for csv_path in CANDIDATES:
    if not csv_path.exists():
        continue
    with csv_path.open(newline='', encoding='utf-8-sig') as handle:
        rows = list(csv.DictReader(handle))
    matches = [row for row in rows if host(row.get('formActionOrigin', '')) == target_host or host(row.get('url', '')) == target_host]
    if matches:
        row = matches[0]
        print(f"LOGIN_USER={shlex.quote(row['username'])}")
        print(f"LOGIN_PASS={shlex.quote(row['password'])}")
        break
else:
    raise SystemExit('No matching credential row found')
PY
)"
```

## Browser Automation Protocol
1. Load the `agent-browser` skill workflow.
2. Open the target URL.
3. Snapshot interactive elements.
4. Fill username/email first, then password.
5. Submit the login form.
6. Re-snapshot after navigation or DOM changes.
7. Finish the user’s requested post-login action.
8. `unset LOGIN_USER LOGIN_PASS` when done.

## Safety Rules
- Never include raw credentials in chat responses, specs, receipts, commits, screenshots, or copied console output.
- Avoid screenshots while the password field is visibly filled.
- Do not write credentials into tracked repo files or long-lived temp artifacts.
- If a site presents 2FA, passkey, or captcha that cannot be completed safely, pause and ask for the minimum required human step.
- If login fails, do not brute-force retries; verify the match and stop after a small number of attempts.

## Output
- Authenticated browser state or a precise blocker.
- Masked evidence only, for example the matched host and a redacted username.
- Confirmation that credentials were used transiently and not persisted.

## References
- `~/.pi/agent/skills/agent-browser/SKILL.md`
- `orgs/open-hax/proxx/scripts/bulk-oauth-import.ts`
