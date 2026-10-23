# Lossless review-evidence custody

The PR at `db99b1682c94ecdf9f8b239709dd44cb6101c7da` changed 499 paths
against `7112c36440d180ca183d6a3f89661cee161fdae5`: 90 source, test,
configuration, canonical card/ledger and other non-evidence paths, plus 409
new generated evidence files. CodeRabbit reply 6357020571 skipped review,
reporting 476 files above its 100-file limit. Its exact included path list is
unknown; this consolidation uses the stricter total Git path count.

All 409 original evidence files, including 22 original compressed archives,
and the frozen survey/independent assessment records are losslessly preserved
in the content-addressed outer bundle named by `index.json`. Each member has
its legacy repository-relative path, exact size, SHA-256, Git blob identity,
Git executable mode, origin and bounded canonical base64 chunks. Original archive
filenames address their exact **compressed** bytes. The one original 100755
capture retains that mode in the index and bundle; inspection never executes it.

All current production, law, test, configuration and canonical ledger/card
files remain visible plaintext. Captured historical source/harness copies are
archived data, not replacement runtime inputs. The required `a037f990…json.gz`
verification fixture remains at its live original path, as does the latest
`trusted-publication-readback/checkpoint.json`.

**Binary bundle contents have not been natively reviewed by CodeRabbit.**
Lossless retrieval and checksum verification establish byte preservation only.
They grant no review approval, authenticated publisher identity, activation,
adoption, execution permission or full custody qualification. The prior skip,
failed survey/lint/build attempts and raw provider replies remain retrievable.
`audit.json` records the actual preservation gates and prospective path count.

## Read-only inspection

From the repository root:

```sh
bb .ημ/review-evidence/trusted-publication-review-scope/inspect.bb
bb .ημ/review-evidence/trusted-publication-review-scope/inspect.bb --show .ημ/review-evidence/trusted-publication-review-scope/attempt-20261023/summary.json
bb .ημ/review-evidence/trusted-publication-review-scope/test_inspection.bb
```

Default inspection verifies the fixed local index/bundle and every member.
`--show` verifies the entire bundle before writing the selected exact bytes to
stdout. It never extracts files, writes the checkout, follows archive paths,
executes captures, calls the network, reads authentication or invokes commands.
A caller cannot select another index/bundle. Symlinked script/index/bundle
paths or ancestors are refused. Invalid paths, modes, duplicate members,
base64, sizes, hashes and finite member/aggregate/compressed/decompressed
bounds are refused. The plaintext helper and controls can be reviewed directly.

The original committed bytes remain independently recoverable from Git:

```sh
git show db99b1682c94ecdf9f8b239709dd44cb6101c7da:.ημ/review-evidence/trusted-publication-readback/checkpoint.json
```

The index also covers subsequently generated survey/assessment captures that
were not part of that commit; their honest origin is `current-capture`.
Two failed pre-removal saved bundles remain separate hash-bound `failed.*.json.gz`
files, with their exact bytes/modes/legacy paths in the index. Inspection verifies
them too; explicit legacy-path lookup emits the exact verified byte array without
reopening the external file after verification. Their separate custody
avoids recursive bundle growth. Main bundle limits: 32 MiB compressed, 128 MiB
decompressed, 64 MiB member aggregate, 32 MiB per member. Each of at most two
failed artifacts is limited to 32 MiB and their total to 64 MiB. The index is
limited to 2 MiB, with at most 4096 main members and 1 MiB per base64 chunk.

Survey scripts inside the bundle are historical operational records and are
never invoked by the inspection helper. The helper tests create and remove
tiny generated fixtures; they do not extract the archive.


## Source custody execution

Executed source-custody repairs at source c9fc461f2a14d613e9f1897f5143676378e154c2 under this existing publisher. Tests-only source RED7a798aa3 ran8/175 with six causal failures; GREEN33184ccc passes8/175 and14 actual NBB/Babashka values. The partial source observation now always retains missing :native-execution-custody; invented coordinate strings/verified flags cannot clear it. No admitted signed execution capability or G/caller policy change.

Tests-only verifier RED73b9aa65 ran5/181 with34 causal failures before GREENc9fc461f. The exact strict-inspected manifest byte count/SHA256 reaches reconstruct! after caller metadata, with independent semantic manifest comparison retained. Full original input-proof v1 schema/stage/fields/provenance/name bind actual manifest bytes. The actual producer supports deterministic evidence attempt1 reused by review attempt2: manifest/producer provenance stays1, verification provenance/native review artifact stays2, producer<=review uses portable precision-safe decimal comparison. Actual pinned runtime5/181 passes;33 actual pure NBB/Babashka values match. Independent review passes28 actual pinned-runtime cases and270 independent arbitrary-precision reference cases on both hosts, no narrow finding; old valid canonical hash fails for whitespace-changed actual bytes. Cleanup resources/effects zero. Fixtures remain explicitly inert8-tool/local-source-byte proof, not native authentication.

Full owning CLI194/587 and workflows11/199, lint and release pass at c9fc461f with zero compiler/linter warnings, runtime/path-only environment and empty task npm user config. Existing fixture/carrier diagnostics remain visible. Native F796 Sandbox39909048197/job120267534077 now succeeds at executed e157f704 with exact parents/tree;29 actual suite summaries and92 compiler builds pass,23 diagnostics remain. Artifact12482823428/469643137 bytes has metadata only; no download/restore credit and no hosted proof transfer to c9fc461f.

Actual pinned Musec1369 JVM entrypoint and pure configuration generation produce22 allow permissions matching exact workflow expectations, independently reproduced byte-for-byte. All38 pinned source/build files,69 capture hashes and dependency identities verify. Both actual NBB plugin loads fail at real shadow.esm/JVM-only macro boundaries; actual full adapter remains uncompiled/unobserved. No actor initialization, handler/provider execution, G/caller authentication or adoption credit.

Fresh06:45:43–06:46:02UTC two-pass same442 census:437open/4merged/1closed/6changed open head or reported-base pairs; source/proposal acquisition drift0/0. Axxium3/4 advance by one commit each, adding42-line proposed review workflow and receipt append; complete native diffs retained without acceptance/deployment authority. Root88 native receipt_history2/hygiene0 and missing-App/terminal failures remain; root receiptP1 and paused oracle held. Preserve all309 states/planning/four prefixes,363rd prospective valid child receipt with historical71invalid/118errors, all23 accepted root pins and exact100 review paths. Native review has no exact approval; CodeRabbit cooldown remains after07:04:53UTC, Codex resetUNKNOWN/no retry. Original authenticated G/executed caller/full profile/input custody, native outcome authentication, full publication/composition/protected adoption remain unfinished. CMS/Cephalon paused. No standalone planning, new card, merge/deployment/credential/grant/protection/pin/adoption effect.


Lossless raw captures are retained by the root custody checkpoint. No native authentication or binary-content review credit.
