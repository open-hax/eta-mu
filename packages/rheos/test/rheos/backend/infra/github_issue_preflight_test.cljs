(ns rheos.backend.infra.github-issue-preflight-test
  (:require [cljs.test :refer [deftest is]]
            [rheos.backend.infra.github-issue-preflight :as preflight]))

(defn- issue [number uuid]
  {:number number
   :body (str "<!-- openhax-kanban-sync uuid=\"" uuid "\" -->")})

(deftest reports-every-duplicate-uuid-claim
  (let [duplicates (preflight/duplicate-uuid-claims
                    [(issue 9 "zeta")
                     (issue 3 "alpha")
                     (issue 2 "alpha")
                     (issue 8 "zeta")
                     (issue 7 "unique")])]
    (is (= [{:uuid "alpha" :issue-numbers [2 3]}
            {:uuid "zeta" :issue-numbers [8 9]}]
           duplicates)))
  (is (thrown-with-msg?
       js/Error
       #"(?s)alpha on issues #2, #3.*zeta on issues #8, #9"
       (preflight/assert-no-duplicate-uuid-claims!
        [(issue 3 "alpha")
         (issue 2 "alpha")
         (issue 9 "zeta")
         (issue 8 "zeta")]))))
