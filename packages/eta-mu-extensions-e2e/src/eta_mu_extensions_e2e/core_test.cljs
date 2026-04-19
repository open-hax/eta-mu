(ns eta-mu-extensions-e2e.core-test
  (:require [cljs.test :refer [deftest is async use-fixtures]]
            [eta-mu.extensions.contract-runtime-v2 :as crv2]
            [eta-mu-extensions-e2e.fixture-contracts :as fixtures]))

(defn tool-call-event [tool-name input]
  {:toolName tool-name
   :input input
   :toolCallId (str tool-name "-1")})

(defn tool-result-event [tool-name input content is-error]
  {:toolName tool-name
   :input input
   :content content
   :details nil
   :isError is-error})

(deftest block-contract-e2e
  (let [state (atom {:contracts (:contracts fixtures/block-contract)})
        decision (crv2/on-tool-call! state (tool-call-event "shell" {:cmd "rm -rf /"}))]
    (is (= true (:block decision)))
    (is (= "No shell." (:message decision)))))

(deftest notify-fulfillment-e2e
  (let [state (atom {:contracts (:contracts fixtures/notify-contract)
                     :fulfillment-log []})]
    (crv2/on-tool-result! state (tool-result-event "write_file" {:path "x" :dry-run false} {:ok true} false))
    (let [entry (first (:fulfillment-log @state))]
      (is (= :notify (:action entry)))
      (is (= false (get-in entry [:meta :dry-run])))
      (is (= "tool=write_file dry=false error=false" (:message entry))))))

(deftest error-fulfillment-e2e
  (let [state (atom {:contracts (:contracts fixtures/error-contract)
                     :fulfillment-log []})]
    (crv2/on-tool-result! state (tool-result-event "read_file" {:path "missing.txt"} {:error "ENOENT"} true))
    (is (= 1 (count (:fulfillment-log @state))))
    (is (= "error path for read_file" (:message (first (:fulfillment-log @state)))))))
