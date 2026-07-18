(ns open-hax.sol.infra.agent.mcp-tools-test
  "MCP tools on the new tool shape: descriptors are turn-processor tool maps
   built against a fake MCP server and executed through the (id args signal
   on-update) protocol the session adapter's run-loop uses."
  (:require [cljs.test :refer [deftest testing is use-fixtures]]
            [open-hax.sol.infra.agent.mcp-tools :as mcp-tools]))

(defn- fake-mcp-client
  "A fake MCP server client: records every request and replies with
   call-result."
  [requests* call-result]
  #js {:request (fn [req _schema]
                  (swap! requests* conj (js->clj req :keywordize-keys true))
                  (js/Promise.resolve call-result))})

(use-fixtures :each
  {:before (fn [] (reset! mcp-tools/clients* {}))
   :after  (fn [] (reset! mcp-tools/clients* {}))})

(deftest mcp-tool-descriptor-carries-the-new-tool-shape
  (testing "runtime id, label, and description passthrough"
    (let [tool (mcp-tools/mcp-tool->custom-tool "weather" "forecast"
                 #js {:name "forecast" :description "Get the forecast"})]
      (is (= "mcp.weather.forecast" (:name tool)))
      (is (= "forecast" (:label tool)))
      (is (= "Get the forecast" (:description tool)))
      (is (fn? (:execute tool)))))
  (testing "parameters accept any object, the additionalProperties: true stance"
    (is (= {:type "object" :additionalProperties true}
           (:parameters (mcp-tools/mcp-tool->custom-tool "s" "t" #js {:name "t"})))))
  (testing "a missing description collapses to the empty string"
    (is (= "" (:description (mcp-tools/mcp-tool->custom-tool "s" "t" #js {:name "t"}))))))

(deftest ^:async mcp-tool-execute-collapses-content-to-text
  (testing "execute folds the MCP result content into one text block"
    (let [requests* (atom [])
          client (fake-mcp-client requests*
                   #js {:content #js [#js {:type "text" :text "line one"}
                                       #js {:type "image"}
                                       #js {:type "resource" :resource #js {:uri "file:///x"}}
                                       #js {:type "text" :text "line two"}]
                        :isError false})
          _ (reset! mcp-tools/clients* {"weather" client})
          tool (mcp-tools/mcp-tool->custom-tool "weather" "forecast" #js {:name "forecast"})
          result (await ((:execute tool) "call-1" {:city "berlin"} nil nil))]
      (is (= {:content [{:type :text
                         :text "line one\n[image]\n[resource: file:///x]\nline two"}]
              :details {:content-parts [{:type "image" :url nil :data nil :mimeType nil}]}}
             result))
      (is (= [{:method "tools/call"
               :params {:name "forecast" :arguments {:city "berlin"}}}]
             @requests*)
          "CLJS args cross the MCP boundary as a plain JS object"))))

(deftest ^:async mcp-tool-is-error-becomes-a-tool-error
  (testing "an isError result throws the collapsed text as the tool error"
    (reset! mcp-tools/clients*
            {"weather" (fake-mcp-client (atom [])
                         #js {:content #js [#js {:type "text" :text "boom"}]
                              :isError true})})
    (let [tool (mcp-tools/mcp-tool->custom-tool "weather" "explode" #js {:name "explode"})
          err (try
                (await ((:execute tool) "call-2" {} nil nil))
                (catch :default e e))]
      (is (instance? js/Error err))
      (is (= "boom" (.-message ^js err))))))
