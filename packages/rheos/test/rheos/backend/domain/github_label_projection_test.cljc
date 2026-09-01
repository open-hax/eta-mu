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

(defn- managed-body [ownership-line labels-line task-content]
  (str "<!-- openhax-kanban-sync uuid=\"a\" -->\n"
       ownership-line "\n"
       "<!-- This section is managed by eta-mu Rheos GitHub sync. -->\n\n"
       "## Kanban metadata\n\n"
       "- Labels: " labels-line "\n\n"
       "---\n\n"
       task-content))

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
    (is (= ["status:incoming"] (:remove delta))
        "ambiguous pre-v1 metadata cannot authorize task-label deletion")
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
        issue {:body (managed-body marker
                                   "`human`context`, `security,review`"
                                   "Task body")
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
      (let [body (managed-body marker "`human`" "Task body")]
        (is (empty? (labels/projected-task-labels body)))
        (is (empty? (:remove (labels/plan-delta
                              (task)
                               {:body body
                                :labels ["kanban" "status:review"
                                        "priority:P1" "human"]})))))))
  (testing "only the first structural marker is authoritative"
    (let [body (managed-body
                "<!-- openhax-kanban-label-ownership-v1 malformed -->"
                "`human`"
                "<!-- openhax-kanban-label-ownership-v1 [\"human\"] -->")]
      (is (empty? (labels/projected-task-labels body)))
      (is (empty? (:remove (labels/plan-delta
                            (task)
                            {:body body
                             :labels ["kanban" "status:review"
                                      "priority:P1" "human"]})))))))
  (testing "delimiter-injected legacy ownership is never authoritative"
    (doseq [metadata ["`foo`"
                      "`foo`, `human`"
                      "`foo`context`"]]
      (let [body (str "- Labels: " metadata "\n")
            delta (labels/plan-delta
                   (task)
                   {:body body
                    :labels ["kanban" "status:review" "priority:P1"
                             "foo" "human"]})]
        (is (empty? (labels/projected-task-labels body)) metadata)
        (is (empty? (:remove delta)) metadata))))

(deftest task-content-cannot-supply-missing-header-ownership
  (let [body (managed-body
              "<!-- This pre-v1 header has no ownership record. -->"
              "none"
              "<!-- openhax-kanban-label-ownership-v1 [\"human\"] -->")
        delta (labels/plan-delta
               (task)
               {:body body
                :labels ["kanban" "status:review" "priority:P1" "human"]})]
    (is (empty? (labels/projected-task-labels body)))
    (is (empty? (:remove delta))
        "a marker copied into task content has no ownership authority")))

(deftest canonical-protected-labels-stay-outside-projection-authority
  (doseq [protected ["deploy" "eta-mu:review" "ETA-MU:repair"]]
    (let [desired (labels/desired-labels (task [protected]))
          delta (labels/plan-delta (task [protected])
                                   {:body (str "- Labels: `" protected "`\n")
                                    :labels (conj desired protected)})]
      (is (not-any? #{protected} desired))
      (is (empty? (:add delta)))
      (is (empty? (:remove delta))))))

(deftest normalized-url-dot-segments-stay-outside-projection-authority
  (doseq [raw-label ["." ".." " 💥.💥 " "💥..💥"]]
    (let [canonical (labels/canonical-task-labels (task [raw-label]))
          marker (labels/ownership-marker (task [raw-label]))]
      (is (empty? canonical) raw-label)
      (is (= "<!-- openhax-kanban-label-ownership-v1 [] -->" marker)
          raw-label))))

(deftest label-comparison-is-case-insensitive-without-rewriting-names
  (let [delta (labels/plan-delta
               (task ["Domain:New" "domain:new"])
               {:body "- Labels: none\n"
                :labels ["KANBAN" "STATUS:REVIEW" "priority:p1"]})]
    (is (= ["kanban" "status:review" "priority:P1" "Domain:New"]
           (:desired delta)))
    (is (= ["Domain:New"] (:add delta)))
    (is (empty? (:remove delta)))))
