#!/usr/bin/env bb

;; Executable entrypoint only. The boundary rules live in
;; scripts/clio/lint_extern_boundary.clj so the test suite can exercise them.

(require '[clio.lint-extern-boundary :as boundary])

(boundary/-main)
