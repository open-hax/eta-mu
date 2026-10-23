# Independent successor readback review

Frozen source: `6e1f088fcd81dba5e9edaf526e453962875215c6`.
Prior reviewed source: `6fa625cd66658d850241d0d3f762ef5eb6ba8746`.
Tests-only causal RED supplied by parent: `141c11e3bb285c427b2d51c7ea746d09072998cd` (10 tests / 130 assertions, exactly two failures). This review independently ran the successor, not the RED.

## Finding disposition

The previously reproduced P2 is fixed at `packages/eta-mu/src/cljs/eta_mu/domain/review_readback.cljc:16`: the existing identities sequence now includes all inline comment identities as well as review and exact-context status identities. The existing conflict predicate and unsupported authentication semantics are unchanged. No new source finding established in this narrow repair review.

Actual inert runtime probe: inline App42 remains visible in both native.review.comments[0].identity.app-id and raw.performed_via_github_app.id, returns :refused / :publisher-identity, qualification :unsupported, and effects []. Matching inline App3152464 remains visible, returns :observed / :authentication-not-established, qualification :unsupported, and effects []. No App identity is inferred from expected fields.

## Actual verification

- Fixed NBB1.5.212 registered readback suite: 10 tests / 130 assertions, zero failures/errors; stderr empty.
- Independent successor probe: eight controls pass, including conflicting/matching inline App metadata, original-commit limitation, wrong review URL/membership, wrong inline actor, wrong explicit status SHA and invalid unrelated-status timestamp. All eight return unsupported qualification and empty effects. Probe process exits0; stderr empty.
- Frozen repair diff whitespace check exits0.
- Working domain source exactly matches frozen Git source; original6fa report, manifest and every manifest-listed capture remain byte/hash exact. Original manifest SHA256: `0c452e36aca035d5239d6c9cb3de35d3a291ab3a486c15196e9be8ca420560c3`.

## Limits

The existing publication comparison uses current commit_id and typed payload; original_commit_id remains retained raw without independently becoming a rejection criterion. The independent control still returns observed/unsupported for original_commit_id-only change. This repair establishes no original-event custody, protected adoption, installation authorization, native POST/status effect or deployment qualification. All new controls use inert transport; no real native GET or privileged action was issued in this review.

Only the successor evidence directory was written. No production source, board, ledger, Git or original review capture was edited.
