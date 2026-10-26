;; SPDX-License-Identifier: GPL-3.0-or-later
(ns eta-mu.extern.assessment-timeout-expression-fixture
  (:require [clojure.string :as str]
            ["@actions/expressions" :as expressions]
            ["node:assert/strict" :as assertion]))

;; The official evaluator owns expression semantics. This fixture only builds
;; its foreign context and checks the actual authored workflow's numeric result.
(defn evaluate-timeout [expression requested]
  (assertion/ok (and (str/starts-with? expression "${{")
                    (str/ends-with? expression "}}")))
  (let [dictionary (.-Dictionary expressions/data)
        input (new dictionary)]
    (when (some? requested)
      (.add input "review_timeout_minutes"
            (if (number? requested)
              (expressions/data.NumberData. requested)
              (expressions/data.StringData. requested))))
    (let [context (new dictionary #js {:key "inputs" :value input})
          lexer (expressions/Lexer. (str/trim (subs expression 3 (- (count expression) 2))))
          parsed (expressions/Parser. (.-tokens (.lex lexer)) #js ["inputs"] #js [])
          evaluator (expressions/Evaluator. (.parse parsed) context)]
      (.-value (.evaluate evaluator)))))

(defn assert-numeric-timeout [foreign-workflow requested expected]
  (let [workflow (js->clj foreign-workflow :keywordize-keys true)
        steps (get-in workflow [:jobs :assess :steps])
        model (some #(when (= "assess" (:id %)) %) steps)
        actual (evaluate-timeout (:timeout-minutes model) requested)]
    (assertion/equal (number? actual) true
                     (str "native model-step timeout for " (pr-str requested)
                          " must evaluate to a number"))
    (assertion/ok (integer? actual))
    (assertion/equal actual expected)
    actual))

(defn assert-native-budget-fixture [foreign-workflow run-prepare]
  (let [workflow (js->clj foreign-workflow :keywordize-keys true)]
    (assertion/equal (get-in workflow [:jobs :assess :needs]) "prepare"
                     "malformed prepare inputs cannot reach the model job")
    (doseq [requested [60 "60" 120 "120" 180 "180"]]
      (assertion/equal (.-status (run-prepare requested)) 0)
      (assert-numeric-timeout foreign-workflow requested (js/Number requested)))
    (doseq [event [:workflow_call :workflow_dispatch]]
      (let [enrolled-default (get-in workflow [:on event :inputs :review_timeout_minutes :default])]
        (assertion/equal enrolled-default 60)
        (assertion/equal (.-status (run-prepare enrolled-default)) 0)
        (assert-numeric-timeout foreign-workflow enrolled-default 60)))
    (doseq [invalid ["" "not-a-number" "null" "true" "60.5" 60.5 "59" 59 "181" 181 "1e2"]]
      (let [refused (run-prepare invalid)]
        (assertion/notEqual (.-status refused) 0)
        (assertion/match (.-stdout refused)
                         #"review_timeout_minutes must be a whole number from 60 through 180")))))

#js {:evaluateTimeout evaluate-timeout
     :assertNumericTimeout assert-numeric-timeout
     :assertNativeBudgetFixture assert-native-budget-fixture}
