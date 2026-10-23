# Independent frozen native readback review

Source: `6fa625cd66658d850241d0d3f762ef5eb6ba8746`; comparison base: `cd9751d01a2b93123281d032f42a83fb4b9d42cb`.

One concrete consistency finding established in the reviewed read-only slice: conflicting native App metadata on inline comments is omitted from publisher-conflict aggregation. This does not establish an authentication or effect bypass: the result remains unsupported with no effects. This is not publication acceptance, authenticated installation proof, or a reviewer approval for an updated remote head.

Reviewed all nine changed files, applicable root AGENTS.md, existing collection transport/tuple/pagination laws, publication admission and content predicates, and registered runtime test. No source, board, ledger or Git mutation was performed. Only this delegated evidence directory was written.

## Actual checks

- Fixed NBB 1.5.212 registered readback suite: exit 0, 9 tests / 119 assertions, zero failures/errors; stderr empty.
- Additional inert runtime controls: exit 0, seven controls, all returned unsupported qualification and no effects. Wrong native review URL, wrong PR membership, wrong inline actor, wrong explicit status SHA and invalid timestamp on an unrelated status all refuse. The latter verifies validation precedes context filtering.
- Current inline original-commit and conflicting inline App metadata remain raw evidence without creating authentication or effects. These are explicit comparison limits, below.
- Frozen diff whitespace check: exit 0.

## Supported conclusions

The production entry replaces caller registry claims with the existing fixed registry reader before any GET. Absent production registry and disabled/unproved fixture enrollment refuse without transport calls in the registered suite. One shared request/page/byte/time budget covers tuple reads and both complete observation passes. All HTTP effects use the existing GET-only fixed-host edge.

Array pagination validates response row identities across pages, validates but never follows Link URLs, reconstructs next routes locally, and requests an additional local page when a full terminal page omits Link. All native statuses are traversed and retained before exact-context selection; unexpected writers in the exact context are retained and cause mismatch. Stable raw observation passes are bracketed by live tuples and followed by re-admission.

Native review identity, review id, H, event, body, receipt URL and every inline current typed payload/actor/H/review-id are compared using the factored existing publication semantics. App ID comes only from raw native metadata; absence never becomes the configured App ID. Even matching App metadata remains unsupported installation association. Portable new law/shape/domain namespaces contain no I/O or host interop; infra uses the existing extern edge.

## Finding: inline App conflict omitted from aggregation (P2)

At `packages/eta-mu/src/cljs/eta_mu/domain/review_readback.cljc:17`, `identities` is built only from the review and exact-context status rows. The same native-identity shape is retained on every inline comment, but those identities are excluded. Reproducer: change only each inline raw `performed_via_github_app` to `{:id 42}` while the review actor, expected publisher App3152464 and exact payload remain unchanged. The frozen runtime returns `:observed`, `:authentication-not-established`, and `:matched` review-content instead of the `:publisher-identity` refusal produced for an equivalent review-level native App conflict. The `:inline-app-conflict` control in probe.cljs reproduces it; probe.stdout retains the conflicting shaped identity.

Include inline identities in the existing conflict aggregation without inferring App metadata from expected publisher fields. This is a concrete completeness/consistency defect in native conflict evaluation. Unsupported qualification and empty effects prevent this slice from authorizing publication or installation; it is not demonstrated privilege escalation. Parent has delegated a narrow causal RED/GREEN repair separately; this report and probes remain frozen to6fa625c only.

## Limits retained

- `shape/review_readback.cljc` inline-comment retains original_commit_id and position metadata raw; comparison uses the existing publication law's current commit_id and typed payload. A changed original_commit_id alone remains observed, unsupported.
- `domain/review_readback.cljc:17` builds publisher-conflict identities from the review and exact-context statuses, excluding inline-comment identities. A conflicting inline performed_via_github_app is preserved at native.review.comments[].identity and raw, but does not itself change :observed to :refused. The probe confirms qualification remains :unsupported, reason :authentication-not-established, effects []. A future authenticated publication composer must not reinterpret this observer result as authenticated content or installation evidence.
- The observer does not prove original G/event custody, a protected registry installation/default adoption, a POST or status write, repository grants, or deployment. Tests use inert transport fixtures. No independent real native GET or privileged action was issued in this review. The parent owns broader owning tests/lint, actual public/native probes, metadata and publication.

The seven-case probe initially used an overly broad route selector for two review-only controls; that selector was narrowed before the retained final run. Final source and output are retained together; the initial scratch output was replaced and supplies no review evidence.
