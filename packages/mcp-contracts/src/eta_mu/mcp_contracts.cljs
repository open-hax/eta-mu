(ns eta-mu.mcp-contracts
  "Teach a knoxx-style agent runtime to accept `:mcp-server` contracts — generic,
   not tied to any particular MCP server.

   knoxx's MCP gateway only ever built its server list from the MCP_SERVERS env
   plus a couple of hardcoded entries; it never read the `:mcp-server` contract
   kind. This library closes that gap: read every enabled `:mcp-server` contract
   under the given contract roots and return the
   `{server-id {:url :transport [:shared-secret]}}` map that
   `mcp-bridge/initialize!` already understands.

   The consuming runtime (knoxx today, sol later) requires this and merges the
   result into its gateway init — so any MCP server is declared as DATA (a
   contract) instead of code or env. The contract instances themselves live with
   whatever owns them (e.g. the kanban-orchestrator package ships the
   rheos-kanban contract); this namespace knows nothing about them."
  (:require ["node:fs" :as fs]
            ["node:path" :as path]
            [clojure.edn :as edn]))

(defn- read-edn [file]
  (try (edn/read-string (.readFileSync fs file "utf8"))
       (catch :default _ nil)))

(defn- mcp-server-files [root]
  (let [dir (path/join root "mcp_servers")]
    (if (and root (.existsSync fs dir))
      (->> (.readdirSync fs dir)
           (filter #(.endsWith % ".edn"))
           (mapv #(path/join dir %)))
      [])))

(defn contract->server
  "Map one parsed `:mcp-server` contract to a `[id config]` bridge entry, or nil
   if it's not an enabled mcp-server. `:mcp-server/auth-token-env` names an env var
   holding the shared secret (the token is never written into the contract)."
  [c]
  (when (and (map? c)
             (= :mcp-server (:contract/kind c))
             (:enabled c)
             (:mcp-server/url c))
    (let [id (or (:mcp-server/id c) (:contract/id c))
          token-env (:mcp-server/auth-token-env c)
          secret (some-> token-env (->> (aget js/process.env)))]
      [(str id) (cond-> {:url (:mcp-server/url c)
                         :transport (name (or (:mcp-server/transport c) :http))}
                  (and secret (not= "" secret)) (assoc :shared-secret secret))])))

(defn gateway-servers
  "Given a seq of contract root paths, return the gateway server-config map for
   every enabled `:mcp-server` contract found under `<root>/mcp_servers/*.edn`."
  [roots]
  (into {}
        (comp (mapcat mcp-server-files)
              (keep read-edn)
              (keep contract->server))
        (or roots [])))
