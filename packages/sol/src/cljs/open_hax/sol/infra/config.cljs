(ns open-hax.sol.infra.config
  (:require [clojure.string :as str]))

(defn- env
  [k default]
  (or (aget js/process.env k) default))

(defn- env-first
  [keys default]
  (or (some (fn [k]
              (let [value (aget js/process.env k)]
                (when-not (str/blank? (or value ""))
                  value)))
            keys)
      default))

(defn- env-int
  [k default]
  (let [raw (aget js/process.env k)
        parsed (js/parseInt (str (or raw "")) 10)]
    (if (js/Number.isFinite parsed)
      parsed
      default)))

(defn- env-kv-map
  [k]
  (let [raw (some-> (aget js/process.env k) str str/trim)]
    (if (str/blank? (or raw ""))
      {}
      (->> (str/split raw #",")
           (map (fn [entry]
                  (let [[left right] (str/split (str entry) #"=" 2)
                        key (some-> left str str/trim not-empty)
                        value (some-> right str str/trim not-empty)]
                    (when (and key value)
                      [key value]))))
           (remove nil?)
           (into {})))))

(defn cfg
  "Read Sol runtime configuration from environment variables."
  []
  {:app-name (env "APP_NAME" "Sol CLJS")
   ;; Prefer Sol-scoped vars so a leaked ambient HOST/PORT (e.g. PORT=8000 from a
   ;; knoxx shell, which collides with knoxx-backend) can't re-point Sol. Default
   ;; port is 8001 — Sol's own port, not knoxx's 8000.
    :host (env "SOL_HOST" (env "HOST" "0.0.0.0"))
    :port (js/parseInt (env "SOL_PORT" (env "PORT" "8001")) 10)
    :public-base-url (env "SOL_PUBLIC_BASE_URL" "")
    :knoxx-base-url (env "KNOXX_BASE_URL" "http://localhost:8000")
   :knoxx-api-key (env "KNOXX_API_KEY" "")
   :knoxx-default-role (env "KNOXX_DEFAULT_ROLE" "knowledge_worker")
   :knoxx-default-actor-id (env "KNOXX_DEFAULT_ACTOR_ID" "chat_primary")
   :knoxx-default-agent-contract (env "KNOXX_DEFAULT_AGENT_CONTRACT" "knoxx_default")
   :contracts-dir (env "CONTRACTS_DIR" "contracts")
   :shutdown-grace-ms (env-int "KNOXX_SHUTDOWN_GRACE_MS" 25000)
   :shutdown-poll-ms (env-int "KNOXX_SHUTDOWN_POLL_MS" 250)
   :workspace-root (env-first ["WORKSPACE_ROOT" "WORKSPACE_PATH" "KNOXX_WORKSPACE_ROOT"] "/app/workspace")
   :proxx-base-url (env "PROXX_BASE_URL" "http://proxx:8789")
   :proxx-auth-token (env "PROXX_AUTH_TOKEN" "")
   :proxx-default-model (let [value (aget js/process.env "PROXX_DEFAULT_MODEL")]
                          (when (and (string? value) (not (str/blank? value)))
                            value))
   :proxx-embed-model (env "PROXX_EMBED_MODEL" "nomic-embed-text:latest")
   :provider-base-urls (env-kv-map "KNOXX_PROVIDER_BASE_URLS")
   :provider-auth-tokens (env-kv-map "KNOXX_PROVIDER_AUTH_TOKENS")
   :provider-auth-headers (env-kv-map "KNOXX_PROVIDER_AUTH_HEADERS")
   :model-lab-openai-api-key (env "MODEL_LAB_OPENAI_API_KEY" "")
   :agent-dir (env "KNOXX_AGENT_DIR" "/tmp/knoxx-agent")
   :agent-compaction-enabled? (not= "false" (str/lower-case (env "KNOXX_AGENT_COMPACTION_ENABLED" "true")))
   :agent-compaction-reserve-tokens (env-int "KNOXX_AGENT_COMPACTION_RESERVE_TOKENS" 16384)
   :agent-compaction-keep-recent-tokens (env-int "KNOXX_AGENT_COMPACTION_KEEP_RECENT_TOKENS" 20000)
   :agent-turn-timeout-ms (env-int "KNOXX_AGENT_TURN_TIMEOUT_MS" 0)
   :agent-system-prompt (env
                         "KNOXX_AGENT_SYSTEM_PROMPT"
                         "You are Sol, a minimal agent runtime for the active workspace.")})
