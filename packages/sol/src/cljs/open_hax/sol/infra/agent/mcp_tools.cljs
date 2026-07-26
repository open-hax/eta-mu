;; infra/agent/mcp_tools.cljs
(ns open-hax.sol.infra.agent.mcp-tools
  "MCP client bridge: connect to mcp_server contracts and expose their tools as
   turn-processor tool descriptors — the `eta-mu.infra.tools` registry shape
   (:name/:label/:description/:parameters plus a runtime :execute invoked as
   (id args signal on-update))."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.contracts.mcp-servers :as mcp-contracts]
            ["@modelcontextprotocol/sdk/client/index.js" :as mcp-client]
            ["@modelcontextprotocol/sdk/client/streamableHttp.js" :as mcp-transport]))

;; ── Client cache ─────────────────────────────────────────────────────────────

(defonce clients* (atom {}))

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

(defn- content-item->media-part
  "Preserve an MCP image/audio content item as a CLJS media part map (the
   :details :content-parts contract the media materialization hook scans)."
  [item]
  (let [part-type (some-> (aget item "type") str str/lower-case)]
    (when (contains? #{"image" "audio"} part-type)
      {:type part-type
       :url (some-> (aget item "url") str not-empty)
       :data (some-> (aget item "data") str not-empty)
       :mimeType (some-> (aget item "mimeType") str not-empty)})))

(defn- mcp-result->tool-result
  [^js result]
  (let [content (when result (aget result "content"))
        text (content-items->text content)
        media-parts (->> (js-array-seq content)
                         (keep content-item->media-part)
                         vec)
        is-error (and result (true? (aget result "isError")))]
    (when is-error
      (throw (js/Error. (or text "MCP tool returned an error"))))
    {:content [{:type :text :text text}]
     :details (if (seq media-parts)
                {:content-parts media-parts}
                {})}))

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

;; ── Tool descriptors on the new tool shape ───────────────────────────────────

(def any-object-parameters
  "OpenAI-style parameter map accepting any object — the JSON-schema projection
   of the Malli form [:map-of :any :any] (Malli maps are open by default).
   Preserves the previous additionalProperties: true stance: MCP tool argument
   shapes are unknowable at describe-time, so every MCP tool carries it."
  {:type "object"
   :additionalProperties true})

(defn- ->js-args
  "Normalize tool-call arguments for the MCP client. The turn-processor
   run-loop hands :execute CLJS data; the MCP wire wants a JS object."
  [args]
  (cond
    (nil? args) #js {}
    (object? args) args
    :else (clj->js args)))

(defn mcp-tool->custom-tool
  "Wrap one MCP tool definition as a turn-processor tool descriptor (the
   eta-mu.infra.tools registry shape). The runtime name is the fully-qualified
   mcp.<server-id>.<tool-name> id; :execute follows the run-loop protocol
   (id args signal on-update) and resolves to {:content [{:type :text ...}]
   :details {}}, throwing on an isError result."
  [server-id tool-name ^js mcp-tool]
  (let [description (or (some-> mcp-tool (aget "description")) "")
        tool-id (str "mcp." server-id "." tool-name)
        execute (fn [_tool-call-id args _signal _on-update]
                  (call-mcp-tool! server-id tool-name (->js-args args)))]
    {:name tool-id
     :label tool-name
     :description description
     :parameters any-object-parameters
     :execute execute}))

(defn ^:async build-mcp-custom-tools!
  "Given a config and a collection of contract tool ids, build turn-processor
   tool descriptors for every mcp.<server-id>.<tool-name> reference. Returns a
   CLJS vector of tool maps."
  [config tool-ids]
  (let [refs (mcp-contracts/mcp-tool-refs tool-ids)]
    (if (seq refs)
      (let [by-server (group-by :server-id refs)
            tools-parts (await (js/Promise.all
                                (mapv (fn [[server-id server-refs]]
                                        (^:async fn []
                                         (let [server (mcp-contracts/find-mcp-server-contract config server-id)]
                                           (if-not server
                                             []
                                             (let [mcp-tools (await (list-mcp-tools! server))
                                                   wanted (set (map :tool-name server-refs))]
                                               (->> (js-array-seq mcp-tools)
                                                    (filter (fn [t]
                                                              (let [n (some-> t (aget "name"))]
                                                                (contains? wanted n))))
                                                    (map (fn [t]
                                                           (let [n (some-> t (aget "name"))]
                                                             (mcp-tool->custom-tool server-id n t))))
                                                    vec))))))
                                      by-server)))]
        (into [] cat (js-array-seq tools-parts)))
      [])))
