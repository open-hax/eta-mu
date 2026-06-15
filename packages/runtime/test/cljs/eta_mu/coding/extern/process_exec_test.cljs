(ns eta-mu.coding.extern.process-exec-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.coding.extern.process-exec :as proc]))

(deftest ^:async echo-test
  (let [res (await (proc/execute-command {:command "echo" :args ["hello"]}))]
    (is (:ok res))
    (is (= 0 (:exit-code res)))
    (is (re-find #"hello" (:stdout res)))))

(deftest ^:async exit-code-test
  (let [res (await (proc/execute-command {:command "false"}))]
    (is (:ok res))
    (is (not= 0 (:exit-code res)))))

(deftest ^:async timeout-test
  (let [res (await (proc/execute-command {:command "sleep" :args ["2"] :timeout-ms 100}))]
    (is (:ok res))
    (is (true? (:killed res)))))

(deftest ^:async max-output-test
  (let [res (await (proc/execute-command {:command "seq" :args ["1" "100"] :max-output-bytes 10}))]
    (is (:ok res))
    (is (true? (:truncated res)))))
