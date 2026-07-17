;; domain/contracts/mcp_servers.cljs
(ns open-hax.sol.domain.contracts.mcp-servers
  (:require [clojure.string :as str]
            [open-hax.sol.domain.contracts.loader :as loader]))

(defn- server-id
  [contract]
  (or (:mcp-server/id contract)
      (:mcp_server/id contract)
      (:contract/id contract)))

(defn- server-url
  [contract]
  (or (:mcp-server/url contract)
      (:mcp_server/url contract)))

(defn- server-transport
  [contract]
  (or (:mcp-server/transport contract)
      (:mcp_server/transport contract)
      :http))

(defn list-mcp-server-contracts
  "Return all enabled mcp_server contract records."
  [config]
  (->> (loader/load-all-contracts-sync config)
       (filter #(= "mcp_servers" (:contractClass %)))
       (filter #(not (false? (:enabled (:contract %)))))
       (map (fn [record]
              (let [contract (:contract record)]
                {:id (:id record)
                 :server-id (server-id contract)
                 :url (server-url contract)
                 :transport (server-transport contract)
                 :contract contract})))
       vec))

(defn find-mcp-server-contract
  "Find an enabled mcp_server contract by server-id or contract id."
  [config server-id-or-contract-id]
  (let [wanted (some-> server-id-or-contract-id str str/trim not-empty)]
    (some (fn [{:keys [id server-id] :as record}]
            (when (or (= id wanted) (= server-id wanted))
              record))
          (list-mcp-server-contracts config))))

(defn mcp-tool-refs
  "Extract [:server-id :tool-name] pairs from a collection of tool ids.
   Tool ids prefixed with 'mcp.<server-id>.' are treated as MCP tools."
  [tool-ids]
  (->> tool-ids
       (map #(some-> % str str/trim not-empty))
       (remove str/blank?)
       (keep (fn [tool-id]
               (when-let [m (re-matches #"^mcp\.([^.]+)\.(.+)$" tool-id)]
                 {:tool-id tool-id
                  :server-id (nth m 1)
                  :tool-name (nth m 2)})))
       vec))

(defn tools-by-server
  "Group MCP tool refs by server-id."
  [tool-ids]
  (->> (mcp-tool-refs tool-ids)
       (group-by :server-id)))
