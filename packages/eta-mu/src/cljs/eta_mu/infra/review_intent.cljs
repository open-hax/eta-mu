;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-intent
  "Bounded Clio-backed publication-intent adapter. The configured partition is
  installation input; admission facts remain caller-port input and are rechecked
  by the existing publisher domain before any child process is started."
  (:require [eta-mu.domain.review-publication :as publication]
            [eta-mu.extern.review-intent :as host]
            [eta-mu.law.review-intent :as law]))

(defn- refused [reason] {:status :refused :reason reason})

(defn- configured-store? [store]
  (and (map? store)
       (string? (:schema-directory store))
       (string? (:ledger-file store))
       (law/file-identity? [(:partition-device store) (:partition-inode store)])
       (law/lock-key? (:expected-lock-key store))))

(defn transition!
  "Re-admit current native facts, then ask one bounded fixed worker to perform
  canonical replay plus Clio slot CAS. `:capability` is an opaque process-local
  Symbol and exists only for the fresh post-started append result."
  [store context command]
  (let [context (assoc context :now-ms (host/clock-ms))
        admission (publication/admit context)
        binding (:binding admission)
        lock-key (:lock-key binding)]
    (cond
      (not= :admitted (:status admission)) (refused [:admission (:reason admission)])
      (not (configured-store? store)) (refused :installation-store)
      (not= (:expected-lock-key store) lock-key) (refused :installation-lock-key)
      (not (contains? #{:reserved :post-started} (:state command))) (refused :transition)
      (and (= :post-started (:state command))
           (not (and (law/natural? (:expected-version command))
                     (law/text? (:owner command))))) (refused :claim)
      :else
      (let [claim-id (when (= :post-started (:state command)) (str (random-uuid)))
            request {:operation :transition
                     :store (select-keys store [:schema-directory :ledger-file
                                                :partition-device :partition-inode
                                                :expected-lock-key])
                     :context context
                     :binding binding
                     :command (cond-> (select-keys command [:state :expected-version :owner])
                                claim-id (assoc :claim-id claim-id))}
            result (host/transition-child! request)]
        result))))

(defn recover!
  "Exact Clio retry is durability repair only. Even a recovery append is
  discovery-only and never mints an effect capability."
  [store recovery]
  (if-not (configured-store? store)
    (refused :recovery)
    (host/recover-child! store recovery)))

(defn consume-capability! [capability binding]
  (host/consume-capability! capability binding))
