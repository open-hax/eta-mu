(ns eta-mu.receipt-river.event-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is testing]]
            [eta-mu.receipt-river.api :as api]
            [eta-mu.receipt-river.domain.event :as event]
            [eta-mu.receipt-river.domain.receipt :as receipt]
            [eta-mu.receipt-river.extern.bus :as bus]
            [eta-mu.receipt-river.generated.registry :as registry]
            [eta-mu.receipt-river.law.receipt :as law]
            [eta-mu.receipt-river.shape.edn :as edn]))

(def component-manifest
  {:eta-mu/version "1.1.1"
   :components {"@eta-mu/receipt-river" "0.1.0"}})

(def metadata
  {:event-id #uuid "00000000-0000-0000-0000-000000000001"
   :recorded-at "2026-07-29T00:00:00.000Z"
   :component-manifest component-manifest
   :command "eta-mu receipt append"
   :producer {:session/id "session-1" :actor/id "actor-1"}
   :subject {:repository/id "repo-1" :repository/path "/repo"}})

(deftest version-stamped-event-test
  (testing "the package, application composition, and schema versions are distinct"
    (let [payload (receipt/build-payload {:kind "test-run" :note "green"}
                                         "/repo"
                                         "2026-07-29T00:00:00.000Z"
                                         :observation)
          record (event/build-event metadata payload)]
      (is (= "1.1.1" (get-in record [:event/producer :eta-mu/version])))
      (is (= "@eta-mu/receipt-river"
             (get-in record [:event/producer :package/name])))
      (is (= "0.1.0" (get-in record [:event/producer :package/version])))
      (is (= {:id :eta-mu.receipt-river/receipt-recorded :version 1}
             (:event/schema record)))
      (is (= "green" (get-in record [:event/payload :note])))
      (is (:ok (api/validate-line (edn/format-line record) 1))))))

(deftest implementation-version-is-not-schema-version-test
  (testing "a supported payload schema is valid across emitting package releases"
    (let [payload (receipt/build-payload {:kind "observation"}
                                         "/repo"
                                         "2026-07-29T00:00:00.000Z"
                                         :observation)
          record (-> (event/build-event metadata payload)
                     (assoc-in [:event/producer :package/version] "0.0.9"))]
      (is (:ok (api/validate-line (edn/format-line record) 1))))))

(deftest payload-normalization-test
  (let [payload (receipt/build-payload {:kind "observation"
                                        :owner "  ledger\nkeeper  "}
                                       "/repo"
                                       "2026-07-29T00:00:00.000Z"
                                       :observation)]
    (is (= "ledger keeper" (:owner payload)))
    (is (= (:owner payload) (:dod payload)))))

(deftest invalid-date-object-test
  (let [legacy {:ts (js/Date. "invalid")
                :kind :observation
                :repo "/repo"
                :origin "pi"
                :owner "receipt-river"
                :dod "observe"
                :pi "0.1.0"
                :host "local"
                :manifest "none"
                :refs "none"}]
    (is (seq (law/record-errors legacy)))))

(deftest timestamp-representation-test
  (testing "ISO strings and historical EDN instants remain valid"
    (let [payload (receipt/build-payload {:kind "observation"}
                                         "/repo"
                                         "2026-07-29T00:00:00.000Z"
                                         :observation)]
      (is (empty? (law/record-errors
                   (event/build-event metadata payload))))
      (is (empty? (law/record-errors
                   (event/build-event
                    (assoc metadata
                           :recorded-at
                           #inst "2026-07-29T00:00:00.000Z")
                    payload))))
      (is (seq (law/record-errors
                (event/build-event
                 (assoc metadata :recorded-at "2026-99-99T00:00:00.000Z")
                 payload)))))))

(deftest invalid-edn-emits-sanitized-bus-error-test
  (let [emitted (atom nil)
        secret-line "{definitely not edn SECRET-CONTENT"]
    (with-redefs [bus/emit-error! #(reset! emitted [%1 %2])]
      (is (false? (:ok (api/validate-line secret-line 17)))))
    (is (= :receipt-river/invalid-edn (first @emitted)))
    (is (= 17 (get-in @emitted [1 :line-number])))
    (is (string? (get-in @emitted [1 :exception/message])))
    (is (not (str/includes? (pr-str @emitted) "SECRET-CONTENT")))))

(deftest historical-record-stays-unversioned-test
  (testing "shape compatibility does not retroactively assign a schema"
    (let [legacy {:ts "2026-07-01T00:00:00.000Z"
                  :kind :observation
                  :repo "/repo"
                  :origin "pi"
                  :owner "receipt-river"
                  :dod "observe"
                  :pi "0.1.0"
                  :host "local"
                  :manifest "none"
                  :refs "none"}
          result (api/validate-line (pr-str legacy) 1)]
      (is (:ok result))
      (is (= {:status :unversioned} (:source/schema result))))))

(deftest registry-is-generated-from-package-resource-test
  (is (= "0.1.0" registry/package-version))
  (is (= 1 (get registry/current-versions
                :eta-mu.receipt-river/receipt-recorded)))
  (is (= :current
         (get-in registry/schemas
                 [[:eta-mu.receipt-river/receipt-recorded 1]
                  :schema/status]))))

(deftest law-owns-receipt-contract-constants-test
  (is (= law/known-kinds receipt/known-kinds))
  (is (= law/legacy-required-keys receipt/legacy-required-keys))
  (is (= law/receipt-recorded-schema event/receipt-recorded-schema)))
