;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-intent-worker-entry
  "Production-only fixed entrypoint for the bounded publisher worker."
  (:require [eta-mu.infra.review-intent-worker :as worker]
            [nbb.core :as nbb]))

(nbb/await (worker/entry))
