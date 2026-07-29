(ns eta-mu.fork-tax.handoff-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is]]
            [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.generated.registry :as registry]))

(deftest tag-and-message-test
  (is (= "Π-20260709T121314Z"
         (handoff/make-tag-name "2026-07-09T12:13:14.123Z")))
  (is (= "Π Π-20260709T121314Z"
         (handoff/commit-message "Π-20260709T121314Z"))))

(deftest partition-status-test
  (let [entries [{:path "/repo/src/foo.cljs" :status " M"}
                 {:path "/repo/src-other/no.cljs" :status " M"}
                 {:path "/repo/dist/main.js" :status " M"}]
        result (handoff/partition-status entries ["/repo/src"])]
    (is (= ["/repo/src/foo.cljs"] (mapv :path (:owned result))))
    (is (= ["/repo/src-other/no.cljs"] (mapv :path (:concurrent result))))
    (is (= ["/repo/dist/main.js"] (mapv :path (:blocked result))))))

(deftest porcelain-z-test
  (let [entries (handoff/parse-porcelain-z
                 (str "?? .ημ/\u0000"
                      "R  renamed.cljs\u0000old.cljs\u0000"))]
    (is (= [{:status "??" :path ".ημ/"}
            {:status "R " :path "renamed.cljs" :source-path "old.cljs"}]
           entries))))

(deftest artifacts-test
  (let [plan {:repo-root "/repo"
              :branch "main"
              :sha "abc123"
              :tag-name "Π-1"
              :timestamp "2026-07-29T00:00:00.000Z"
              :owned [{:path "/repo/a.cljs"}]
              :concurrent [{:path "/repo/b.cljs"}]
              :blocked []}]
    (is (str/includes? (handoff/build-state-sexp plan) "Π-state"))
    (is (str/includes? (handoff/build-last-md plan) "b.cljs"))
    (is (= [".ημ/Π_STATE.sexp" ".ημ/Π_LAST.md" ".ημ/Π_EVENT.edn"]
           (handoff/build-manifest)))))

(deftest version-stamped-handoff-test
  (let [plan {:repo-root "/repo"
              :branch "main"
              :sha "abc123"
              :tag-name "Π-1"
              :owned []
              :concurrent []
              :blocked []}
        record (event/build-event
                {:event-id #uuid "00000000-0000-0000-0000-000000000003"
                 :recorded-at #inst "2026-07-29T00:00:00.000Z"
                 :component-manifest {:eta-mu/version "1.1.1"}
                 :command "eta-mu fork-tax"
                 :producer {}
                 :subject {:repository/path "/repo"}
                 :refs [{:event/id
                         #uuid "00000000-0000-0000-0000-000000000001"}]}
                (handoff/event-payload plan))]
    (is (= :fork-tax/handoff-recorded (:event/type record)))
    (is (= registry/package-version
           (get-in record [:event/producer :package/version])))
    (is (= 1 (get-in record [:event/schema :version])))
    (is (= 1 (count (:event/refs record))))))
