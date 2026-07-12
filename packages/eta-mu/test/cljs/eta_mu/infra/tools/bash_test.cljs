(ns eta-mu.infra.tools.bash-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.infra.tools.bash :as bash]))

(deftest ^:async bash-tool-runs-command-test
  (testing "captures stdout from a shell command"
    (let [result (await ((:execute bash/tool) "id-1" {:command "echo hello"} nil nil))]
      (is (= "hello\n" (-> result :content first :text)))
      (is (zero? (-> result :details :exit))))))

(deftest ^:async bash-tool-nonzero-exit-test
  (testing "reports a non-zero exit code without throwing"
    (let [result (await ((:execute bash/tool) "id-2" {:command "exit 3"} nil nil))]
      (is (= 3 (-> result :details :exit)))
      (is (re-find #"Exit code 3" (-> result :content first :text))))))
