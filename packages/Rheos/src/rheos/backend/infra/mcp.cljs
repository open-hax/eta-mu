(ns rheos.backend.infra.mcp
  "MCP over Streamable HTTP — mounts the orchestrator toolbox
   ([[rheos.backend.infra.agent-tools]]) on the Rheos server (POST /mcp) so
   knoxx's MCP client can reach it. Stateless: a fresh Server + transport per
   POST (knoxx posts initialize / tools/list / tools/call as independent
   requests). A thin wrapper — all behaviour lives in agent-tools + the domain."
  (:require ["@modelcontextprotocol/sdk/server/index.js" :refer [Server]]
            ["@modelcontextprotocol/sdk/server/streamableHttp.js" :refer [StreamableHTTPServerTransport]]
            ["@modelcontextprotocol/sdk/types.js" :refer [ListToolsRequestSchema CallToolRequestSchema]]
            [clojure.string :as str]
            [rheos.backend.infra.agent-tools :as tools]))

(defn- tools-list-result []
  (clj->js {:tools (mapv (fn [t] {:name (:name t)
                                  :description (:description t)
                                  :inputSchema (:input-schema t)})
                         tools/tools)}))

(defn- ^:async handle-call [^js req]
  (let [params (.-params req)
        name (.-name params)
        args (js->clj (or (.-arguments params) #js {}) :keywordize-keys true)]
    (try
      (let [r (await (tools/dispatch name args))]
        #js {:content #js [#js {:type "text" :text (js/JSON.stringify (clj->js r) nil 2)}]})
      (catch :default e
        #js {:content #js [#js {:type "text" :text (str "Error: " (.-message e))}]
             :isError true}))))

(defn- build-server []
  (let [server (Server. #js {:name "rheos-kanban" :version "0.1.0"}
                        #js {:capabilities #js {:tools #js {}}})]
    (.setRequestHandler server ListToolsRequestSchema (fn [_req] (tools-list-result)))
    (.setRequestHandler server CallToolRequestSchema handle-call)
    server))

(defn- ensure-accept!
  "The transport requires Accept to include both application/json and
   text/event-stream; patch it if a client sent something narrower."
  [^js req]
  (let [raw (.-raw req)
        headers (or (.-headers raw) #js {})
        accept (str/lower-case (str (or (aget headers "accept") "")))]
    (when-not (and (str/includes? accept "application/json")
                   (str/includes? accept "text/event-stream"))
      (aset headers "accept" "application/json, text/event-stream")
      (set! (.-headers raw) headers))
    req))

(defn ^:async handle-post!
  "Fastify handler for POST /mcp. Stateless one-shot: build a server + transport,
   hand it the raw node req/res plus the already-parsed body, let it reply."
  [^js req ^js reply]
  (ensure-accept! req)
  (.hijack reply)
  (let [server (build-server)
        transport (StreamableHTTPServerTransport. #js {:sessionIdGenerator js/undefined})]
    (await (.connect server transport))
    (await (.handleRequest transport (.-raw req) (.-raw reply) (.-body req)))))
