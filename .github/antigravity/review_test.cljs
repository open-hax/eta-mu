;; SPDX-License-Identifier: GPL-3.0-or-later
(ns review-test
  (:require [antigravity.extern.host :as host]
            [antigravity.law.review :as law]
            [antigravity.shape.diff :as diff]
            [antigravity.shape.finish :as finish]
            [cljs.test :as t :refer [deftest is run-tests]]))

(def input {:base (apply str (repeat 40 "a")) :head (apply str (repeat 40 "b"))
            :diff_digest (apply str (repeat 64 "c"))
            :paths ["src/a.cljc"]
            :files [{:path "src/a.cljc" :base-mode "100644" :head-mode "100644"
                     :base-bytes 20 :head-bytes 30 :binary? false}]
            :diff-bytes 50 :input-bytes 100 :prompt-bytes 200})
(def finding {:path "src/a.cljc" :line 2 :title "Wrong result" :body "Fails for zero input."
              :confidence 0.95 :evidence ["The changed branch returns one."]
              :failure_trace ["zero" "branch returns one" "contract requires zero"]})
(def result {:schema law/schema :status "findings" :diff_digest (:diff_digest input)
             :base (:base input) :head (:head input) :model law/model
             :scope_complete true :reviewed_paths (:paths input) :summary "One confirmed defect."
             :findings [finding] :questions []})

(deftest complete-bounded-input
  (is (= [] (law/input-errors input)))
  (doseq [invalid [(assoc input :head "HEAD") (assoc input :head (:base input))
                   (assoc input :paths ["../escape"]) (assoc input :paths ["src/a.cljc" "src/a.cljc"])
                   (assoc-in input [:files 0 :binary?] true) (assoc-in input [:files 0 :head-mode] "160000")
                   (assoc-in input [:files 0 :head-mode] "120000")
                   (assoc-in input [:files 0 :head-bytes] 262145) (assoc input :diff-bytes 1048577)
                   (assoc input :prompt-bytes 65537)]]
    (is (seq (law/input-errors invalid)))))

(deftest grounded-and-complete-output
  (is (= [] (law/result-errors input {"src/a.cljc" #{2}} result)))
  (is (= [] (law/result-errors input {} (assoc result :status "clean" :summary "No confirmed defects." :findings []))))
  (doseq [invalid [(assoc result :model "gemini-3-flash") (assoc result :head (:base input))
                   (assoc result :scope_complete false) (assoc result :reviewed_paths [])
                   (assoc result :status "clean") (assoc result :diff_digest (apply str (repeat 64 "d")))
                   (assoc result :reviewed_paths ["src/a.cljc" "src/a.cljc"])
                   (assoc result :summary " ") (assoc-in result [:findings 0 :confidence] 0.84)
                   (assoc-in result [:findings 0 :line] 3) (assoc-in result [:findings 0 :path] "/etc/passwd")
                   (assoc-in result [:findings 0 :evidence] [])
                   (assoc result :findings [finding finding]) (assoc result :native_approval true)]]
    (is (seq (law/result-errors input {"src/a.cljc" #{2}} invalid)))))

(deftest real-added-coordinates
  (is (= #{2 3 10} (diff/added-lines "diff --git a/a b/a\n--- a/a\n+++ b/a\n@@ -2 +2,2 @@\n-old\n+new\n+next\n@@ -9,0 +10 @@\n+tail\n\\ No newline at end of file\n")))
  (is (= #{} (diff/added-lines "@@ -1 +0,0 @@\n-deleted\n"))))

(def native-init {:event "init" :conversation_id "fixture-conversation"
                  :init {:cwd "/fixture" :model law/model :agent "antigravity-reviewer"
                         :permission_mode "plan" :tools []}})
(def native-result {:event "result" :result {:conversation_id "fixture-conversation"
                                             :status "SUCCESS" :structured_output result}})
(deftest native-invocation-boundaries
  (is (= [] (law/envelope-errors {:cwd "/fixture"} [native-init native-result])))
  (doseq [invalid [[native-init {:event "tool_call"} native-result]
                   [native-init {:event "new_mutating_event"} native-result]
                   [native-init (assoc-in native-result [:result :conversation_id] "other")]
                   [(assoc-in native-init [:init :tools] ["run_command"]) native-result]
                   [(assoc-in native-init [:init :model] "other") native-result]
                   [native-result] [native-init native-result native-result]
                   [native-init (assoc-in native-result [:result :status] "ERROR")]]]
    (is (seq (law/envelope-errors {:cwd "/fixture"} invalid)))))

(deftest native-json-is-structured-and-schema-bound
  (let [schema {:type "object" :properties {}}
        native {:conversation_id "fixture" :status "SUCCESS" :num_turns 2 :duration_seconds 1.0
                :structured_output result :json_schema schema}]
    (is (= [] (law/native-json-errors schema native)))
    (doseq [invalid [(dissoc native :structured_output) (assoc native :status "ERROR")
                     (assoc native :json_schema {}) (assoc native :tool_calls [])
                     (assoc native :num_turns 0) (assoc native :response "partial" :structured_output nil)]]
      (is (seq (law/native-json-errors schema invalid))))))

(deftest native-finish-has-an-exact-narrow-transport-shape
  (let [decorated (assoc result :toolAction "Submit review" :toolSummary "Review complete")
        shaped (finish/split-output decorated)]
    (is (= :shaped (:status (finish/split-output result))))
    (is (= :shaped (:status shaped)))
    (is (= result (:review shaped)))
    (is (= {:toolAction "Submit review" :toolSummary "Review complete"} (:metadata shaped)))
    (is (= [] (law/result-errors input {"src/a.cljc" #{2}} (:review shaped))))
    (doseq [invalid [(assoc result :toolAction "Partial metadata")
                     (assoc decorated :toolSummary nil) (assoc decorated :toolSummary " ")
                     (assoc decorated :toolAction (apply str (repeat 4097 "x")))
                     (assoc decorated :native_approval true) (assoc result :unknown "extra")]]
      (is (= :refused (:status (finish/split-output invalid)))))))

(defmethod t/report [:cljs.test/default :end-run-tests] [summary]
  (host/exit-code! (if (t/successful? summary) 0 1)))

(run-tests)
