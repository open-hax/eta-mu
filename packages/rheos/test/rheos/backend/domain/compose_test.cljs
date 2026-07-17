(ns rheos.backend.domain.compose-test
  (:require [cljs.test :refer [deftest testing is]]
            ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.compose :as compose]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]))

(deftest parse-where-clause-eq
  (is (= ["meta.domain" := "infra"] (compose/parse-where-clause "meta.domain = infra"))))

(deftest parse-where-clause-in
  (is (= ["meta.org" :in ["open-hax" "octave-commons"]] (compose/parse-where-clause "meta.org in open-hax,octave-commons"))))

(deftest parse-where-clause-contains
  (is (= ["meta.tags" :contains "proxy"] (compose/parse-where-clause "meta.tags contains proxy"))))

(deftest parse-where-clause-regex
  (is (= ["title" :regex "infra.*"] (compose/parse-where-clause "title ~ infra.*")))
  (is (= ["title" :regex "infra.*"] (compose/parse-where-clause "title ~ /infra.*/")))
  (is (= ["title" :regex ".*in progress.*"] (compose/parse-where-clause "title ~ .*in progress.*")))
  (is (= ["title" :regex ".*contains.*"] (compose/parse-where-clause "title ~ /.*contains.*/"))))

(deftest parse-compose-query-basic
  (let [flags {:status "todo,in_progress" :priority "P0,P1" :projects "proxx,eta-mu"}
        query (compose/parse-compose-query flags)]
    (is (= ["todo" "in_progress"] (:status query)))
    (is (= ["proxx" "eta-mu"] (:across query)))))

(defn- ^:async write-task [dir uuid title status priority labels]
  (let [file-path (path/join dir (str uuid ".md"))
        labels-str (str/join ", " labels)
        frontmatter (str "---\n"
                         "uuid: \"" uuid "\"\n"
                         "title: \"" title "\"\n"
                         "status: \"" status "\"\n"
                         "priority: \"" priority "\"\n"
                         "labels: \"" labels-str "\"\n"
                         "---\n\n# " title)]
    (await (.writeFile fsp file-path frontmatter "utf8"))))

(deftest ^:async compose-snapshot-contains-matches-label
  (let [tmp-dir (path/join (js/process.cwd) "target" "compose-test-contains")
        _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
        projects [{:id "p" :title "P" :tasks-dir tmp-dir :meta {}}]
        query {:status [] :priority [] :labels [] :across [] :where-clauses [[:labels :contains "proxy"]]}]
    (await (write-task tmp-dir "a" "Proxy task" "todo" "P1" ["proxy"]))
    (await (write-task tmp-dir "b" "Other task" "todo" "P1" ["ui"]))
    (let [snapshot (await (compose/compose-snapshot projects query))]
      (is (= 1 (:total-tasks snapshot)))
      (is (= "a" (:uuid (first (:tasks (first (filter #(= "todo" (:status %)) (:columns snapshot)))))))))
    (await (.rm fsp tmp-dir #js {:recursive true :force true}))))

(deftest ^:async compose-snapshot-regex-matches-title
  (let [tmp-dir (path/join (js/process.cwd) "target" "compose-test-regex")
        _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
        projects [{:id "p" :title "P" :tasks-dir tmp-dir :meta {}}]
        query {:status [] :priority [] :labels [] :across [] :where-clauses [[:title :regex "infra-.*"]]}]
    (await (write-task tmp-dir "a" "infra-proxy" "todo" "P1" []))
    (await (write-task tmp-dir "b" "frontend-ui" "todo" "P1" []))
    (let [snapshot (await (compose/compose-snapshot projects query))]
      (is (= 1 (:total-tasks snapshot)))
      (is (= "a" (:uuid (first (:tasks (first (filter #(= "todo" (:status %)) (:columns snapshot)))))))))
    (await (.rm fsp tmp-dir #js {:recursive true :force true}))))

(deftest ^:async compose-snapshot-includes-domain-and-org-from-meta
  (testing "Tasks inherit domain and org from project meta"
    (let [tmp-dir (path/join (js/process.cwd) "target" "compose-test-meta-enrichment")
          _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
          projects [{:id "p" :title "P" :tasks-dir tmp-dir :meta {:domain "proxx" :org "open-hax"}}]
          query {:status [] :priority [] :labels [] :across [] :where-clauses []}]
      (await (write-task tmp-dir "a" "Task A" "todo" "P1" []))
      (let [snapshot (await (compose/compose-snapshot projects query))
            tasks (->> snapshot :columns (filter #(= "todo" (:status %))) first :tasks)]
        (is (= 1 (count tasks)))
        (is (= "proxx" (:domain (first tasks))))
        (is (= "open-hax" (:org (first tasks)))))
      (await (.rm fsp tmp-dir #js {:recursive true :force true})))))

(deftest ^:async compose-snapshot-includes-drift-flag
  (testing "Tasks with a drift-detected ledger event are marked drift=true"
    (let [tmp-dir (path/join (js/process.cwd) "target" "compose-test-drift")
          _ (await (.mkdir fsp tmp-dir #js {:recursive true}))
          projects [{:id "p" :title "P" :tasks-dir tmp-dir :meta {}}]
          query {:status [] :priority [] :labels [] :across [] :where-clauses []}
          ledger (ledger/get-ledger tmp-dir)]
      (await (write-task tmp-dir "drifty" "Drifty task" "todo" "P1" []))
      (await (write-task tmp-dir "clean" "Clean task" "todo" "P1" []))
      (await (events/emit-drift-detected! ledger "p" "drifty" (events/generate-write-id)))
      (let [snapshot (await (compose/compose-snapshot projects query))
            tasks (->> snapshot :columns (filter #(= "todo" (:status %))) first :tasks)
            by-uuid (into {} (map (juxt :uuid identity) tasks))]
        (is (= true (:drift (get by-uuid "drifty"))))
        (is (= false (:drift (get by-uuid "clean")))))
      (await (.rm fsp tmp-dir #js {:recursive true :force true})))))
