(ns rheos.backend.domain.github-label-projection-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.domain.github-label-projection :as labels])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.domain.github-label-projection :as labels])))

(defn- task
  ([] (task []))
  ([task-labels]
   {:status "review"
    :priority "P1"
    :labels task-labels}))

(deftest partitions-projector-owned-and-protected-labels
  (let [issue {:body (str "<!-- openhax-kanban-sync uuid=\"a\" -->\n"
                          "- Labels: `domain:old`\n")
               :labels ["kanban"
                        "status:incoming"
                        "priority:P1"
                        "domain:old"
                        "human-context"
                        "eta-mu:review"
                        "deploy"]}
        delta (labels/plan-delta (task ["domain:new"]) issue)]
    (is (= ["kanban" "status:review" "priority:P1" "domain:new"]
           (:desired delta)))
    (is (= ["status:review" "domain:new"] (:add delta)))
    (is (= ["status:incoming" "domain:old"] (:remove delta)))
    (testing "unmanaged, command, and reserved labels are outside projector ownership"
      (is (empty? (filter #{"human-context" "eta-mu:review" "deploy"}
                          (:remove delta)))))))

(deftest legacy-issues-preserve-arbitrary-labels-without-an-ownership-record
  (let [delta (labels/plan-delta
               (task)
               {:body "Legacy body without managed label metadata"
                :labels ["kanban" "status:incoming" "priority:P1" "human-context"]})]
    (is (= ["status:review"] (:add delta)))
    (is (= ["status:incoming"] (:remove delta)))))

(deftest structural-ownership-marker-cannot-be-truncated-by-label-backticks
  (let [previous (task ["human`context" "security,review"])
        marker (labels/ownership-marker previous)
        issue {:body (str marker "\n"
                          "- Labels: `human`context`, `security,review`\n")
               :labels ["kanban" "status:review" "priority:P1"
                        "human" "human-context" "security-review"]}
        delta (labels/plan-delta (task) issue)]
    (is (= "<!-- openhax-kanban-label-ownership-v1 [\"human-context\" \"security-review\"] -->"
           marker))
    (is (= ["human-context" "security-review"]
           (labels/projected-task-labels (:body issue))))
    (is (= ["human-context" "security-review"] (:remove delta)))
    (is (not-any? #{"human"} (:remove delta))
        "the raw backtick prefix never becomes a wrongful ownership claim")))

(deftest malformed-ownership-records-fail-closed
  (testing "an old backtick line with an embedded backtick claims nothing"
    (let [body "- Labels: `human`context`\n"]
      (is (empty? (labels/projected-task-labels body)))
      (is (empty? (:remove (labels/plan-delta
                            (task)
                            {:body body
                             :labels ["kanban" "status:review"
                                      "priority:P1" "human"]}))))))
  (testing "a present but invalid structural marker cannot downgrade to legacy"
    (doseq [marker ["<!-- openhax-kanban-label-ownership-v1 [\"human\" 42] -->"
                    "<!-- openhax-kanban-label-ownership-v1 [\"human\"] [\"trailing\"] -->"
                    "<!-- openhax-kanban-label-ownership-v1 malformed -->"]]
      (let [body (str marker "\n"
                      "- Labels: `human`\n")]
        (is (empty? (labels/projected-task-labels body)))
        (is (empty? (:remove (labels/plan-delta
                              (task)
                               {:body body
                                :labels ["kanban" "status:review"
                                        "priority:P1" "human"]})))))))
  (testing "only the first structural marker is authoritative"
    (let [body (str "<!-- openhax-kanban-label-ownership-v1 malformed -->\n"
                    "- Labels: `human`\n"
                    "<!-- openhax-kanban-label-ownership-v1 [\"human\"] -->\n")]
      (is (empty? (labels/projected-task-labels body)))
      (is (empty? (:remove (labels/plan-delta
                            (task)
                            {:body body
                             :labels ["kanban" "status:review"
                                      "priority:P1" "human"]})))))))

(deftest canonical-protected-labels-stay-outside-projection-authority
  (doseq [protected ["deploy" "eta-mu:review" "ETA-MU:repair"]]
    (let [desired (labels/desired-labels (task [protected]))
          delta (labels/plan-delta (task [protected])
                                   {:body (str "- Labels: `" protected "`\n")
                                    :labels (conj desired protected)})]
      (is (not-any? #{protected} desired))
      (is (empty? (:add delta)))
      (is (empty? (:remove delta))))))

(deftest label-comparison-is-case-insensitive-without-rewriting-names
  (let [delta (labels/plan-delta
               (task ["Domain:New" "domain:new"])
               {:body "- Labels: none\n"
                :labels ["KANBAN" "STATUS:REVIEW" "priority:p1"]})]
    (is (= ["kanban" "status:review" "priority:P1" "Domain:New"]
           (:desired delta)))
    (is (= ["Domain:New"] (:add delta)))
    (is (empty? (:remove delta)))))
