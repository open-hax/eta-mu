(require '[nbb.core :as nbb])
(nbb/await (nbb/load-file "/home/err/.local/share/foresight-worktrees/eta-publisher-intent-20261022/.github/scripts/opencode_review_intent_test.cljs"))
(require '[eta-mu.extern.review-intent :as host]
         '[eta-mu.infra.review-intent :as intent]
         '[cljs.reader :as reader]
         '["node:child_process" :as child]
         '["node:fs" :as fs])
(def context @(resolve 'opencode-review-intent-test/context-a))
(def binding @(resolve 'opencode-review-intent-test/binding-a))
(def install @(resolve 'opencode-review-intent-test/installation))
(defn check [label actual] (assert (true? actual) label) (println "PASS" label))
(let [vault (host/new-opaque-vault)
      fake ((:put! vault) {:kind :post-capability :binding binding})]
  (check "independent opaque factory cannot grant infra authority"
         (false? (intent/consume-capability! fake binding))))
(let [store (install)
      reserve (intent/transition! store context {:state :reserved})
      started (intent/transition! store context {:state :post-started :expected-version 0 :owner "independent-probe"})]
  (check "actual fixed launcher appends reservation" (= :appended (:status reserve)))
  (check "actual fixed launcher mints post-started capability" (true? (:capability-issued? started)))
  (check "private capability consumes once" (true? (intent/consume-capability! (:capability started) binding)))
  (check "private capability refuses second use" (false? (intent/consume-capability! (:capability started) binding))))
(let [store (install)
      reserve (intent/transition! store context {:state :reserved})
      uncertain (with-redefs [host/run-fixed-worker!
                             (fn [request]
                               (let [r (.spawnSync child (.-execPath js/process)
                                                  #js ["/home/err/.local/share/foresight-worktrees/eta-publisher-intent-20261022/.github/scripts/opencode_review_intent_uncertain_test.mjs"]
                                                  #js {:input (js/JSON.stringify #js {:root "/home/err/.local/share/foresight-worktrees/eta-publisher-intent-20261022"
                                                                                     :ledgerDirectory (:test-root store)
                                                                                     :workerRequest (pr-str request)})
                                                       :encoding "utf8" :timeout 12000 :maxBuffer 2097152})
                                     parsed (js/JSON.parse (.-stdout r))]
                                 (assert (= 0 (.-status r)))
                                 (assert (= 0 (.-status parsed)))
                                 (reader/read-string (.-stdout parsed))))]
                  (intent/transition! store context {:state :post-started :expected-version 0 :owner "independent-uncertain"}))
      token (:recovery-receipt uncertain)
      recovered (intent/recover! store token)
      repeated (intent/recover! store token)]
  (check "real post-started directory-fsync failure is unknown" (= :unknown (:status uncertain)))
  (check "public adapter hides recovery map" (and (nil? (:recovery uncertain)) (some? token)))
  (check "uncertainty mints no capability" (false? (:capability-issued? uncertain)))
  (check "opaque receipt replays already-visible exact event" (and (= :replayed (:status recovered)) (= :already-present (:append-result recovered))))
  (check "recovery mints no capability" (false? (:capability-issued? recovered)))
  (check "opaque receipt second use refuses" (= :refused (:status repeated)))
  (check "uncertainty/recovery preserves exactly two real events" (= 2 (count (.split (.trim (.readFileSync fs (:ledger-file store) "utf8")) "\n")))))
(let [store (install)
      reserve (intent/transition! store context {:state :reserved})
      calls (atom 0)
      result (with-redefs [host/clock-ms (fn [] (if (= 1 (swap! calls inc)) (.now js/Date) (throw (ex-info "inert second-clock failure" {}))))]
               (intent/transition! store context {:state :post-started :expected-version 0 :owner "independent-clock"}))]
  (check "fresh acknowledgment clock failure refuses authority" (and (= :unknown (:status result)) (= :ack-recheck (:reason result)) (false? (:capability-issued? result)))))
(println "PASS independent actual public adapter probe; inert fixtures only; no custody or native publication credit")
