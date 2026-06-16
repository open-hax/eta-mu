(ns katamorph.policy.fulfillment-test
  (:require [cljs.test :refer [deftest testing is]]
            [katamorph.policy.fulfillment :as fulfill]))

(deftest fulfillment-matches?-by-tool-name
  (let [fulfill {:fulfillment/match {:tool/name "write-file"}}
        result {:tool/name "write-file" :tool/output "ok"}]
    (is (true? (fulfill/fulfillment-matches? fulfill result))))
  (let [fulfill {:fulfillment/match {:tool/name "write-file"}}
        result {:tool/name "read-file" :tool/output "ok"}]
    (is (false? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-by-tool-params
  (let [fulfill {:fulfillment/match {:tool/params {:path "/tmp/test.txt"}}}
        result {:tool/name "write" :tool/params {:path "/tmp/test.txt" :content "x"}}]
    (is (true? (fulfill/fulfillment-matches? fulfill result))))
  (let [fulfill {:fulfillment/match {:tool/params {:path "/tmp/test.txt"}}}
        result {:tool/name "write" :tool/params {:path "/other.txt"}}]
    (is (false? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-with-predicate
  (let [fulfill {:fulfillment/match {:tool/params {:path (fn [v] (re-find #"\.txt$" v))}}}
        result {:tool/params {:path "/tmp/test.txt"}}]
    (is (true? (fulfill/fulfillment-matches? fulfill result))))
  (let [fulfill {:fulfillment/match {:tool/params {:path (fn [v] (re-find #"\.txt$" v))}}}
        result {:tool/params {:path "/tmp/test.md"}}]
    (is (false? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-by-tool-output
  (let [fulfill {:fulfillment/match {:tool/output "success"}}
        result {:tool/output "success"}]
    (is (true? (fulfill/fulfillment-matches? fulfill result))))
  (let [fulfill {:fulfillment/match {:tool/output (fn [v] (and (string? v) (> (count v) 10)))}}
        result {:tool/output "this is a long string"}]
    (is (true? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-by-error?
  (let [fulfill {:fulfillment/match {:tool/error? true}}
        result {:tool/error "something went wrong"}]
    (is (true? (fulfill/fulfillment-matches? fulfill result))))
  (let [fulfill {:fulfillment/match {:tool/error? true}}
        result {:tool/output "ok"}]
    (is (false? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-empty-match
  (let [fulfill {:fulfillment/match {}}
        result {:tool/name "anything"}]
    (is (true? (fulfill/fulfillment-matches? fulfill result)))))

(deftest fulfillment-matches?-combined
  (let [fulfill {:fulfillment/match {:tool/name "exec" :tool/params {:cmd "build"}}}
        result {:tool/name "exec" :tool/params {:cmd "build" :timeout 30}}]
    (is (true? (fulfill/fulfillment-matches? fulfill result)))))

(deftest interpolate-message-basic
  (is (= "File /tmp/test.txt written"
         (fulfill/interpolate-message "File {path} written" {:tool/params {:path "/tmp/test.txt"}})))
  (is (= "Tool exec completed"
         (fulfill/interpolate-message "Tool {name} completed" {:tool/name "exec"}))))

(deftest interpolate-message-missing-key
  (is (= "File {missing} written"
         (fulfill/interpolate-message "File {missing} written" {:tool/params {}}))))

(deftest interpolate-message-blank-template
  (is (nil? (fulfill/interpolate-message nil {:tool/params {}})))
  (is (= "" (fulfill/interpolate-message "" {:tool/params {}}))))

(deftest interpolate-message-lookup-order
  (testing "params keyword takes precedence"
    (is (= "from-params"
           (fulfill/interpolate-message "{key}" {:tool/params {:key "from-params"} :key "from-top"})))))

(deftest evaluate-fulfillments-basic
  (let [fulfills [{:fulfillment/match {:tool/name "write"}
                   :fulfillment/mode :notify
                   :fulfillment/message "Wrote {path}"
                   :fulfillment/level :info}]
        result {:tool/name "write" :tool/params {:path "/f.txt"}}]
    (is (= [{:mode :notify
             :message "Wrote /f.txt"
             :level :info
            :fulfill (first fulfills)}]
           (fulfill/evaluate-fulfillments fulfills result)))))

(deftest evaluate-fulfillments-no-match
  (let [fulfills [{:fulfillment/match {:tool/name "read"}
                   :fulfillment/message "Read done"}]
        result {:tool/name "write"}]
    (is (= [] (fulfill/evaluate-fulfillments fulfills result)))))

(deftest evaluate-fulfillments-defaults
  (let [fulfills [{:fulfillment/match {:tool/name "x"}
                   :fulfillment/message nil}]
        result {:tool/name "x"}]
    (is (= :notify (:mode (first (fulfill/evaluate-fulfillments fulfills result)))))
    (is (= :info (:level (first (fulfill/evaluate-fulfillments fulfills result)))))))

(deftest evaluate-fulfillments-all-match-fire
  (let [fulfills [{:fulfillment/match {:tool/name "x"} :fulfillment/message "a"}
                  {:fulfillment/match {:tool/name "x"} :fulfillment/message "b"}]
        result {:tool/name "x"}]
    (is (= 2 (count (fulfill/evaluate-fulfillments fulfills result))))))
