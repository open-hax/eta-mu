(ns rheos.backend.law.github-label-projection-test
  #?(:clj (:require [clojure.test :refer [deftest is testing]]
                    [rheos.backend.law.github-label-projection :as law])
     :cljs (:require [cljs.test :refer-macros [deftest is testing]]
                     [rheos.backend.law.github-label-projection :as law])))

(defn- body-with [marker-line]
  (str "<!-- openhax-kanban-sync uuid=\"task-a\" -->\n"
       marker-line "\n"
       "<!-- This section is managed by eta-mu Rheos GitHub sync. -->\n"))

(deftest label-policy-admission-is-owned-by-law
  (testing "operator authority stays protected case-insensitively"
    (is (law/protected-label? "deploy"))
    (is (law/protected-label? "ETA-MU:review"))
    (is (not (law/projector-owned-label? "eta-mu:review"))))
  (testing "only configured structural families are projector-owned"
    (is (law/projector-owned-label? "KANBAN"))
    (is (law/projector-owned-label? "Status:review"))
    (is (law/projector-owned-label? "priority:P1"))
    (is (not (law/projector-owned-label? "human")))))

(deftest structural-ownership-admission-is-position-bound-and-fail-closed
  (let [canonical-label (fn [label] label)]
    (is (= {:present? true :labels ["domain:old"]}
           (law/structured-ownership
            (body-with
             "<!-- openhax-kanban-label-ownership-v1 [\"domain:old\"] -->")
            law/default-policy
            canonical-label)))
    (doseq [marker ["<!-- openhax-kanban-label-ownership-v1 [\"human\" 42] -->"
                    "<!-- openhax-kanban-label-ownership-v1 [\"human\"] [\"later\"] -->"
                    "<!-- openhax-kanban-label-ownership-v1 [\"deploy\"] -->"]]
      (is (= {:present? true :labels []}
             (law/structured-ownership (body-with marker)
                                       law/default-policy
                                       canonical-label))
          marker))
    (is (= {:present? false :labels []}
           (law/structured-ownership
            (str "<!-- openhax-kanban-sync uuid=\"task-a\" -->\n"
                 "<!-- managed pre-v1 header -->\n"
                 "<!-- openhax-kanban-label-ownership-v1 [\"human\"] -->")
            law/default-policy
            canonical-label))
        "a task-content marker cannot become ownership evidence")))
