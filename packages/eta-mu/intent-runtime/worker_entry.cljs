;; SPDX-License-Identifier: GPL-3.0-or-later
(ns worker-entry
  "Production-only entrypoint under the fixed publisher NBB config."
  (:require [eta-mu.infra.review-intent-worker :as worker]
            [nbb.core :as nbb]))

(nbb/await (worker/entry))
