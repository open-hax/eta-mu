(ns eta-mu.shape.command-resource-test
  (:require [cljs.test :refer [deftest testing is]]
            [eta-mu.shape.command-resource :as cr]))

(def ^:private ok
  {:contract/kind :command
   :contract/id "workflows"
   :command/name "workflows"
   :command/summary "Project workflow resources"
   :command/runtime :bb
   :command/script "scripts/workflows.bb"})

(deftest a-complete-resource-is-valid
  (is (cr/valid? ok))
  (is (empty? (cr/problems ok))))

(deftest every-problem-is-reported-at-once
  ;; Reporting one problem per run makes an author fix a file three times.
  (let [probs (cr/problems {:contract/kind :command})]
    (is (<= 4 (count probs)))
    (is (some #(re-find #":command/name" %) probs))
    (is (some #(re-find #":command/summary" %) probs))
    (is (some #(re-find #":command/script" %) probs))
    (is (some #(re-find #":command/runtime" %) probs))))

(deftest a-summary-is-required
  (is (not (cr/valid? (dissoc ok :command/summary)))
      "a command nobody can describe is a command nobody will find"))

(deftest only-known-runtimes-are-accepted
  (is (cr/valid? (assoc ok :command/runtime :nbb)))
  (is (not (cr/valid? (assoc ok :command/runtime :python))))
  (is (not (cr/valid? (dissoc ok :command/runtime)))))

(deftest a-non-command-resource-is-refused
  (is (not (cr/valid? (assoc ok :contract/kind :workflow))))
  (is (not (cr/valid? "not a map"))))

(deftest collect-separates-usable-from-rejected
  ;; One malformed file must not stop the others loading, and must not vanish.
  (let [{:keys [commands rejected]}
        (cr/collect [ok
                     (dissoc ok :command/script)
                     (assoc ok :command/name "other")])]
    (is (= ["workflows" "other"] (map :command/name commands)))
    (is (= 1 (count rejected)))
    (is (seq (:problems (first rejected))))))

(deftest built-ins-win-name-conflicts
  (testing "a resource cannot redefine a compiled-in command"
    (let [{:keys [shadowing]} (cr/conflicts ["kanban" "receipt"]
                                            [(assoc ok :command/name "kanban")])]
      (is (= ["kanban"] shadowing))))
  (testing "and precedence does not depend on load order"
    (let [{:keys [shadowing]} (cr/conflicts ["kanban"]
                                            [ok (assoc ok :command/name "kanban")])]
      (is (= ["kanban"] shadowing)))))

(deftest duplicate-resource-names-are-reported
  (let [{:keys [duplicated]} (cr/conflicts [] [ok ok])]
    (is (= ["workflows"] duplicated))))

(deftest dispatch-receives-both-the-resource-and-the-context
  ;; A handler closed over only one of them silently loses the other: the
  ;; context vanished, argv arrived empty, and `workflows bogus` ran `list`
  ;; and exited 0. The arity is the fix, so it is pinned here.
  (let [seen (atom nil)
        cmd (cr/resource->command ok (fn [resource context]
                                       (reset! seen [resource context])))]
    ((:handler cmd) {:args ["bogus"]})
    (is (= ok (first @seen)))
    (is (= {:args ["bogus"]} (second @seen)))))

(deftest a-registry-entry-carries-name-and-summary
  (let [cmd (cr/resource->command ok (fn [_ _] nil))]
    (is (= "workflows" (:name cmd)))
    (is (= "Project workflow resources" (:description cmd)))
    (is (fn? (:handler cmd)))))

(deftest context-is-small-and-is-data
  (let [ctx (cr/context-for {:cwd "/w" :repo-root "/r" :args ["a"] :flags {"x" "1"}
                             :version "1.1.1"})]
    (is (= {:eta-mu/version "1.1.1"
            :command/cwd "/w"
            :command/repo-root "/r"
            :command/args ["a"]
            :command/flags {"x" "1"}}
           ctx))
    (is (every? keyword? (keys ctx))
        "the context is EDN a script reads, not an object it calls")))

(deftest context-tolerates-missing-flags
  (is (= {} (:command/flags (cr/context-for {:args []})))))

(deftest non-string-fields-are-refused
  ;; `42` is not a script path. Accepting one let the resource validate, reach
  ;; path/resolve, and throw there — a crash instead of a reported rejection.
  (doseq [[k v] [[:command/script 42] [:command/name 42] [:command/summary 42]
                 [:command/script true] [:command/name []] [:command/summary {}]]]
    (is (not (cr/valid? (assoc ok k v)))
        (str k " = " (pr-str v) " must be refused")))
  (testing "and the message says why"
    (is (some #(re-find #"non-string" %) (cr/problems (assoc ok :command/script 42))))))
