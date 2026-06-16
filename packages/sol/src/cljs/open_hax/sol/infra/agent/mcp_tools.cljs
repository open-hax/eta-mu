;; infra/agent/mcp_tools.cljs
(ns open-hax.sol.infra.agent.mcp-tools
  "MCP client bridge: connect to mcp_server contracts and expose their tools as
   eta-mu custom ToolDefinition objects."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.contracts.mcp-servers :as mcp-contracts]
            ["@modelcontextprotocol/sdk/client/index.js" :as mcp-client]
            ["@modelcontextprotocol/sdk/client/streamableHttp.js" :as mcp-transport]
            ["typebox" :refer [Type]]
            ["@open-hax/eta-mu-cli" :as eta-mu]))

;; ── Client cache ─────────────────────────────────────────────────────────────

(defonce ^:private clients* (atom {}))

(defn- client-key
  [server-id]
  (str server-id))

(defn close-mcp-clients!
  "Close all cached MCP clients."
  []
  (doseq [[_ client] @clients*]
    (try
      (.close client)
      (catch :default _ nil)))
  (reset! clients* {}))

;; ── JS array helpers ─────────────────────────────────────────────────────────

(defn- js-array-seq
  [value]
  (if (array? value)
    (array-seq value)
    []))

;; ── Tool result extraction ───────────────────────────────────────────────────

(defn- content-items->text
  [content]
  (->> (js-array-seq content)
       (map (fn [item]
              (case (some-> (aget item "type") str str/lower-case)
                ("text") (or (aget item "text") "")
                ("resource") (str "[resource: " (some-> (aget item "resource") (aget "uri")) "]")
                ("resource_link") (str "[resource link: " (aget item "name") "]")
                ("image") "[image]"
                ("audio") "[audio]"
                "")))
       (str/join "\n")))

(defn- mcp-result->tool-result
  [^js result]
  (let [content (when result (aget result "content"))
        text (content-items->text content)
        is-error (and result (true? (aget result "isError")))]
    (when is-error
      (throw (js/Error. (or text "MCP tool returned an error"))))
    #js {:content #js [#js {:type "text" :text text}]
         :details #js {}}))

;; ── Client lifecycle ─────────────────────────────────────────────────────────

(defn ^:async ensure-mcp-client!
  "Create and connect an MCP client for a server contract, caching by server-id.
   Returns the connected Client instance."
  [server-record]
  (let [server-id (:server-id server-record)
        key (client-key server-id)]
    (or (get @clients* key)
        (let [Client (.-Client mcp-client)
              Transport (.-StreamableHTTPClientTransport mcp-transport)
              client (Client. #js {:name "sol-mcp-client" :version "0.1.0"})
              transport (Transport. (str (:url server-record)))]
          (await (.connect client transport))
          (swap! clients* assoc key client)
          client))))

(defn ^:async list-mcp-tools!
  "List tools exposed by an MCP server. Returns a JS array of tool definitions."
  [server-record]
  (let [client (await (ensure-mcp-client! server-record))
        result (await (.request client
                                #js {:method "tools/list" :params #js {}}
                                (aget mcp-client "ListToolsResultSchema")))
        tools (when result (aget result "tools"))]
    (or tools #js [])))

(defn ^:async call-mcp-tool!
  "Call an MCP tool by server-id and tool-name with a JS args object."
  [server-id tool-name args]
  (let [client (get @clients* (client-key server-id))]
    (when-not client
      (throw (js/Error. (str "MCP client not connected: " server-id))))
    (let [result (await (.request client
                                  #js {:method "tools/call"
                                       :params #js {:name tool-name
                                                    :arguments (or args #js {})}}
                                  (aget mcp-client "CallToolResultSchema")))]
      (mcp-result->tool-result result))))

;; ── Eta-mu custom tool wrapping ──────────────────────────────────────────────

(defn- unknown-parameters
  "A TypeBox schema that accepts any object. Used for every MCP tool because the
   eta-mu SDK validates against the declared schema before executing."
  []
  (.Object Type #js {} #js {:additionalProperties true}))

(defn- define-tool-fn
  "Access the SDK's defineTool export at runtime."
  []
  (aget eta-mu "defineTool"))

(defn- mcp-tool->custom-tool
  "Wrap one MCP tool definition as an eta-mu custom ToolDefinition.
   The runtime name is the fully-qualified mcp.<server-id>.<tool-name> id."
  [server-id tool-name ^js mcp-tool]
  (let [description (or (some-> mcp-tool (aget "description")) "")
        tool-id (str "mcp." server-id "." tool-name)
        execute (fn [_tool-call-id args _signal _on-update _ctx]
                  (call-mcp-tool! server-id tool-name (clj->js args)))]
    ((define-tool-fn)
     #js {:name tool-id
          :label tool-name
          :description description
          :parameters (unknown-parameters)
          :execute execute})))

(defn ^:async build-mcp-custom-tools!
  "Given a config and a collection of contract tool ids, build eta-mu custom
   tools for every mcp.<server-id>.<tool-name> reference. Returns a JS array."
  [config tool-ids]
  (let [refs (mcp-contracts/mcp-tool-refs tool-ids)]
    (if (seq refs)
      (let [by-server (group-by :server-id refs)
            tools-parts (await (js/Promise.all
                                (mapv (fn [[server-id server-refs]]
                                        (^:async fn []
                                         (let [server (mcp-contracts/find-mcp-server-contract config server-id)]
                                           (if-not server
                                             #js []
                                             (let [mcp-tools (await (list-mcp-tools! server))
                                                   wanted (set (map :tool-name server-refs))]
                                               (->> (js-array-seq mcp-tools)
                                                    (filter (fn [t]
                                                              (let [n (some-> t (aget "name"))]
                                                                (contains? wanted n))))
                                                    (map (fn [t]
                                                           (let [n (some-> t (aget "name"))]
                                                             (mcp-tool->custom-tool server-id n t))))
                                                    clj->js))))))
                                      by-server)))]
        (->> (js-array-seq tools-parts)
             (mapcat js-array-seq)
             vec
             clj->js))
      #js [])))
