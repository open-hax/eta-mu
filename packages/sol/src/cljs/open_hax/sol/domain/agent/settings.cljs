(ns open-hax.sol.domain.agent.settings
  "Sol's agent runtime settings as plain data.

   Replaces the legacy SDK's SettingsManager (compaction/retry policy) and
   AuthStorage (per-provider runtime keys): policy derives from sol's own
   config map, and provider credentials resolve to per-call
   {:api-key :base-url} maps for the openai extern. Pure decisions only —
   environment access is injected as env-lookup."
  (:require [clojure.string :as str]
            [open-hax.sol.domain.models :as models]))

(def default-retry-settings
  "The legacy SettingsManager retry policy; no config knobs ever existed."
  {:enabled true :max-retries 1})

(defn- non-blank
  [value]
  (some-> value str str/trim not-empty))

(defn- provider-id-str
  [value]
  (cond
    (keyword? value) (non-blank (name value))
    :else (non-blank value)))

(defn compaction-settings
  "Compaction policy from sol config, keeping the legacy SettingsManager
   defaults (enabled, reserveTokens 16384, keepRecentTokens 20000) as
   kebab-case CLJS data for the session adapter's context management."
  [config]
  {:enabled (not= false (:agent-compaction-enabled? config))
   :reserve-tokens (or (:agent-compaction-reserve-tokens config) 16384)
   :keep-recent-tokens (or (:agent-compaction-keep-recent-tokens config) 20000)})

(defn context-policy
  "Compaction + retry policy consumed by the session adapter's context
   management."
  [config]
  {:compaction (compaction-settings config)
   :retry default-retry-settings})

(defn provider-auth
  "Resolve per-provider auth into plain {:api-key :base-url} maps keyed by
   provider id string. :proxx-auth-token comes from config directly; each
   :provider-auth-tokens entry names an env var resolved through env-lookup
   (fn [env-var-name] -> raw value or nil). Blank tokens are omitted, and
   :base-url is the full chat-completions endpoint the openai extern takes."
  [config env-lookup]
  (let [tokens (or (:provider-auth-tokens config) {})
        base-urls (or (:provider-base-urls config) {})
        provider-ids (->> (concat (keys tokens) (keys base-urls))
                          (keep provider-id-str)
                          distinct)
        entry (fn [token base-url]
                (cond-> {}
                  token (assoc :api-key token)
                  base-url (assoc :base-url (models/chat-completions-url base-url))))
        configured (reduce (fn [acc provider-id]
                             (let [env-var (or (get tokens provider-id)
                                               (get tokens (keyword provider-id)))
                                   token (some-> env-var non-blank env-lookup non-blank)
                                   base-url (models/provider-openai-base-url
                                             (or (get base-urls provider-id)
                                                 (get base-urls (keyword provider-id))))]
                               (assoc acc provider-id (entry token base-url))))
                           {}
                           provider-ids)]
    (assoc configured "proxx"
           (entry (non-blank (:proxx-auth-token config))
                  (models/provider-openai-base-url (:proxx-base-url config))))))
