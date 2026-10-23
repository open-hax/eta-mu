;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.infra.review-verification
  "Local byte-verification composition. Trusted native reconstruction remains
  an executable port; this adapter supplies no native authentication or writes.
  Operation budgets bound each verifier worker. The trusted reconstruction
  callback must enforce its own cancellable I/O/process budget; it is not
  preempted by these workers."
  (:require [eta-mu.law.review-verification :as law]
            [eta-mu.domain.review-verification :as domain]
            [eta-mu.infra.review-archive :as archive]
            [eta-mu.extern.review-verification :as host]))
(defn open-runtime! [installation descriptor] (host/open-runtime! installation descriptor))
(defn close-runtime! [runtime] (host/close-runtime! runtime))
(defn resources [] (host/resources))
(defn ^:async verify! [runtime request]
  (try
    (if-not (law/request? request)
      (domain/refuse :verification-request)
      (let [physical (await (archive/admit! (:archive request)))]
        (if-not (= :verified (:status physical))
          (domain/refuse (:code physical))
          (let [inspected (await (host/invoke! runtime :inspect {:physical physical} (:bounds request)))]
            (if-not (= :inspected (:status inspected))
              inspected
              (let [expected (await ((:reconstruct! request)
                                     (merge (:reconstruction-input request)
                                            (select-keys inspected [:manifest :manifest-identity :archive-diff :archive-preview]))))
                    error (domain/reconstruction-error expected (:artifact physical) (host/wall-ms) (:bounds request))]
                (if error
                  (domain/refuse error)
                  (let [result (await (host/invoke! runtime :verify {:physical physical :expected expected} (:bounds request)))
                        late (domain/reconstruction-error expected (:artifact physical) (host/wall-ms) (:bounds request))]
                    (if late (domain/refuse late) result)))))))))
    (catch :default _ (domain/refuse :verification-port))))
