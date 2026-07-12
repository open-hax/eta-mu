(ns eta-mu.platform.dsl-test
  "Tests for the ημ platform DSL macros and constructors."
  (:require-macros [eta-mu.platform.dsl :as platform])
  (:require
   [cljs.test :refer [deftest is]]
   [eta-mu.platform.dsl :as platform]))

;; ── Data definitions via macros ──────────────────────────────────────────────

(platform/defschema query-schema
  [:map
   [:query :string]
   [:limit {:optional true} :int]])

(platform/defcapability research-search
  {:id :research/search
   :input query-schema
   :output [:map [:findings [:vector :map]]]
   :effects #{:network/search}
   :errors #{:input/invalid :network/unavailable}}
  [{:keys [query]}]
  {:ημ/result :plan
   :ημ/effects [{:effect/id :network/search :query query}]})

(platform/defhook audit-tool
  {:id :policy/audit
   :event :tool.execute.after
   :priority 10}
  [event _ctx]
  {:ημ/result :log :level :info :event event})

(platform/deftool research-search-tool
  {:id :tool/research-search
   :capability :research/search
   :expose {:opencode {:name "research_search"
                       :description "Search configured sources."}}})

(platform/defplugin test-plugin
  research-search-tool
  audit-tool)

;; ── Constructor function tests ───────────────────────────────────────────────

(deftest plugin-constructor
  (let [p (platform/plugin :plugin/manual
            (platform/tool :tool/t1 {:capability :capability/c1})
            (platform/hook :hook/h1 {:event :tool.execute.before}))]
    (is (= :plugin (:ημ/kind p)))
    (is (= :plugin/manual (:ημ/id p)))
    (is (= 2 (count (:ημ/entries p))))))

(deftest defschema-macro
  (is (= [:map [:query :string] [:limit {:optional true} :int]]
         query-schema)))

(deftest defcapability-macro
  (is (= :capability (:ημ/kind research-search)))
  (is (= :research/search (:ημ/id research-search)))
  (is (= query-schema (:ημ/input research-search)))
  (is (= #{:network/search} (:ημ/effects research-search)))
  (is (fn? (:ημ/handler research-search)))
  (is (= {:ημ/result :plan
          :ημ/effects [{:effect/id :network/search :query "ClojureScript"}]}
         ((:ημ/handler research-search) {:query "ClojureScript"}))))

(deftest defhook-macro
  (is (= :hook (:ημ/kind audit-tool)))
  (is (= :policy/audit (:ημ/id audit-tool)))
  (is (= :tool.execute.after (:ημ/event audit-tool)))
  (is (= 10 (:ημ/priority audit-tool)))
  (is (fn? (:ημ/handler audit-tool))))

(deftest deftool-macro
  (is (= :tool (:ημ/kind research-search-tool)))
  (is (= :tool/research-search (:ημ/id research-search-tool)))
  (is (= :research/search (:ημ/capability research-search-tool)))
  (is (= "research_search"
         (get-in research-search-tool [:ημ/expose :opencode :name]))))

(deftest defplugin-macro
  (is (= :plugin (:ημ/kind test-plugin)))
  (is (= :eta-mu.platform.dsl-test/test-plugin (:ημ/id test-plugin)))
  (is (= 2 (count (:ημ/entries test-plugin)))))
