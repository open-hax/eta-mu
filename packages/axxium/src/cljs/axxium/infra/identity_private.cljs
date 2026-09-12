(ns axxium.infra.identity-private
  "Reference-aware cleanup after durable private-material admission or refusal."
  (:require [axxium.extern.identity-host :as host]
            [axxium.infra.identity-admission :as admission]
            [axxium.infra.identity-store :as store]))

(defn ^:async cleanup!
  "Retry scoped cleanup without replacing a committed result or original failure."
  [identity-store references]
  (when (some string? references)
    (try
      (await (admission/retry! #(store/discard-unreferenced! identity-store references)))
      (catch :default cause (host/report-private-cleanup! cause)))))

(defn ^:async with-prepared!
  "Reclaim a refused candidate only after current durable state proves it unreferenced."
  [identity-store reference operation]
  (try
    (await (operation))
    (catch :default cause
      (await (cleanup! identity-store [reference]))
      (throw cause))))
