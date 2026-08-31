# Typed document-process conformance fixture

`translation-review.md` is the human editing surface. Its flat frontmatter
references Katamorph identities and the named Malli schema in
`translation-review.edn`. Rheos's integration suite proves that an add/change
produces `rheos.document.file-change-proposed` with the assembled value and
reference provenance.

This pair is the stable fixture boundary for later Sol and Knoxx consumers.
Those runtimes may interpret the proposal, but they must not redefine its
Katamorph identities or treat the Markdown change as accepted workflow state.
