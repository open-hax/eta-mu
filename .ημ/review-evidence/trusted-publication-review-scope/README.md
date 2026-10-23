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
