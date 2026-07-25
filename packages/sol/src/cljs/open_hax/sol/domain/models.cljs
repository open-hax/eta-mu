(ns open-hax.sol.domain.models
  (:require [clojure.string :as str]
            [open-hax.sol.domain.contracts.loader :as contract-loader]))

(def ^:private default-model-prefix-allowlist
  ["glm-5" "gpt-5" "qwen3" "gemma4:" "gemma3:" "deepseek" "kimi-k2" "nemotron" "cogito" "devstral" "minimax" "ministral" "mistral-large" "mimo-v2.5"])

(def ^:private thinking-levels
  #{"off" "minimal" "low" "medium" "high" "xhigh"})

(def ^:private input-kinds
  #{"text" "image" "audio" "video" "document"})

(def ^:private eta-mu-registry-input-kinds
  #{"text" "image" "audio"})

(defn- parse-prefix-allowlist
  [raw]
  (-> (str (or raw ""))
      (str/split #",")
      (->> (map (fn [v] (some-> v str str/trim not-empty)))
           (remove nil?)
           vec)))

(defn normalize-thinking-level
  [value]
  (let [normalized (some-> value str str/trim str/lower-case not-empty)]
    (when (contains? thinking-levels normalized)
      normalized)))

(defn normalize-input-kind
  [value]
  (let [normalized (cond
                     (keyword? value) (some-> value name str/trim str/lower-case not-empty)
                     :else (some-> value str str/trim str/lower-case not-empty))]
    (when (contains? input-kinds normalized)
      normalized)))

(defn- normalize-boolean
  [value]
  (cond
    (true? value) true
    (false? value) false
    :else nil))

(defn- normalize-string-seq
  [values]
  (->> (or values [])
       (map (fn [value]
              (cond
                (keyword? value) (some-> value name str/trim not-empty)
                :else (some-> value str str/trim not-empty))))
       (remove nil?)
       distinct
       vec))

(defn- normalize-thinking-level-seq
  [values]
  (->> (or values [])
       (map normalize-thinking-level)
       (remove nil?)
       distinct
       vec))

(defn- normalize-input-kind-seq
  [values]
  (->> (or values [])
       (map normalize-input-kind)
       (remove nil?)
       distinct
       vec))

(defn- normalize-provider-id
  [value]
  (cond
    (keyword? value) (some-> value name str/trim not-empty)
    :else (some-> value str str/trim not-empty)))

(declare normalize-model-api)

(defn- normalize-model-family-contract
  [contract]
  (when-let [family-id (some-> (:model-family/id contract) str str/trim not-empty)]
    {:id family-id
     :provider (normalize-provider-id (:model-family/provider contract))
     :api (normalize-model-api (:model-family/api contract))
     :compat (when (map? (:model-family/compat contract)) (:model-family/compat contract))
     :prefixes (normalize-string-seq (:model-family/prefixes contract))
     :allowlisted (normalize-boolean (:model-family/allowlisted contract))
     :reasoning (normalize-boolean (:model-family/reasoning contract))
     :default-thinking (normalize-thinking-level (:model-family/default-thinking contract))
     :thinking-levels (normalize-thinking-level-seq (:model-family/thinking-levels contract))
     :context-window (when (number? (:model-family/context-window contract)) (:model-family/context-window contract))
     :max-tokens (when (number? (:model-family/max-tokens contract)) (:model-family/max-tokens contract))
     :input (normalize-input-kind-seq (:model-family/input contract))}))

(defn- normalize-model-contract
  [contract]
  (when-let [model-id (some-> (:model/id contract) str str/trim not-empty)]
    {:id model-id
     :family-id (some-> (:model-family/id contract) str str/trim not-empty)
     :provider (normalize-provider-id (:model/provider contract))
     :api (normalize-model-api (:model/api contract))
     :compat (when (map? (:model/compat contract)) (:model/compat contract))
     :default (normalize-boolean (:model/default contract))
     :allowlisted (normalize-boolean (:model/allowlisted contract))
     :reasoning (normalize-boolean (:model/reasoning contract))
     :default-thinking (normalize-thinking-level (:model/default-thinking contract))
     :thinking-levels (normalize-thinking-level-seq (:model/thinking-levels contract))
     :context-window (when (number? (:model/context-window contract)) (:model/context-window contract))
     :max-tokens (when (number? (:model/max-tokens contract)) (:model/max-tokens contract))
     :input (normalize-input-kind-seq (:model/input contract))
     :label (some-> (:model/label contract) str str/trim not-empty)}))

(defn- normalize-provider-contract
  [contract]
  (when-let [provider-id (normalize-provider-id (:provider/id contract))]
    {:id provider-id
     :label (some-> (:provider/label contract) str str/trim not-empty)
     :base-url (some-> (:provider/base-url contract) str str/trim not-empty)
     :api-shape (some-> (:provider/api-shape contract) name str/trim not-empty)
     :auth-mode (some-> (get-in contract [:provider/auth :auth/mode]) name)
     :auth-env (some-> (get-in contract [:provider/auth :auth/env]) str str/trim not-empty)
     :models-endpoint (some-> (:provider/models-endpoint contract) str str/trim not-empty)
     :prefix-allowlist (normalize-string-seq (:provider/model-prefix-allowlist contract))}))

(defn provider-contracts
  [config]
  (->> (contract-loader/load-all-contracts-sync config)
       (filter #(= "providers" (:contractClass %)))
       (map :contract)
       (map normalize-provider-contract)
       (remove nil?)
       vec))

(defn resolve-provider-contract
  [config provider-id]
  (let [wanted (normalize-provider-id provider-id)]
    (when wanted
      (some (fn [contract]
              (when (= wanted (:id contract))
                contract))
            (provider-contracts config)))))

(defn model-family-contracts
  [config]
  (->> (contract-loader/load-all-contracts-sync config)
       (filter #(= "model_families" (:contractClass %)))
       (map :contract)
       (map normalize-model-family-contract)
       (remove nil?)
       vec))

(defn model-contracts
  [config]
  (->> (contract-loader/load-all-contracts-sync config)
       (filter #(= "models" (:contractClass %)))
       (map :contract)
       (map normalize-model-contract)
       (remove nil?)
       vec))

(defn resolve-model-family
  [config model-id]
  (let [id (some-> model-id str str/trim not-empty)]
    (when id
      (->> (model-family-contracts config)
           (filter (fn [family]
                     (some (fn [prefix]
                             (str/starts-with? id prefix))
                           (:prefixes family))))
           (sort-by (fn [family]
                      (- (apply max 0 (map count (:prefixes family))))))
           first))))

(defn resolve-model-contract
  [config model-id]
  (let [id (some-> model-id str str/trim not-empty)
        exact (when id
                (some (fn [contract]
                        (when (= id (:id contract))
                          contract))
                      (model-contracts config)))
        family (or (when-let [family-id (:family-id exact)]
                     (some (fn [contract]
                             (when (= family-id (:id contract))
                               contract))
                           (model-family-contracts config)))
                   (resolve-model-family config id))]
    (merge family exact)))

(defn- fallback-prefix-allowlisted?
  [config model-id]
  (let [prefixes (let [configured (seq (:model-prefix-allowlist config))]
                   (or configured default-model-prefix-allowlist))
        id (str (or model-id ""))]
    (boolean
     (some (fn [prefix]
             (str/starts-with? id (str prefix)))
           prefixes))))

(defn allowlisted-model-id?
  "Returns true if model-id should be visible/selectable in Knoxx.

   Contract model overrides win. Fallback is env-configured prefix allowlist."
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)]
    (if (some? (:allowlisted model-spec))
      (boolean (:allowlisted model-spec))
      (fallback-prefix-allowlisted? config model-id))))

(defn model-supports-reasoning?
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)]
    (if (some? (:reasoning model-spec))
      (boolean (:reasoning model-spec))
      (let [normalized-model (some-> model-id str str/trim str/lower-case)
            prefixes (->> (str/split (or (:reasoning-model-prefixes config) "") #",")
                          (map str/trim)
                          (remove str/blank?))]
        (boolean
         (and normalized-model
              (some (fn [prefix]
                      (let [normalized-prefix (-> prefix
                                                  str/lower-case
                                                  (str/replace #"\\*$" ""))]
                        (str/starts-with? normalized-model normalized-prefix)))
                    prefixes)))))))

(defn- normalize-model-api
  [value]
  (let [normalized (some-> value name str/trim str/lower-case not-empty)]
    (case normalized
      "openai-responses" "openai-responses"
      "openai/completions" "openai-completions"
      "openai-completions" "openai-completions"
      nil)))

(defn model-prefers-responses?
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)
        explicit-api (normalize-model-api (:api model-spec))]
    (cond
      explicit-api (= explicit-api "openai-responses")
      :else
      (let [normalized-model (some-> model-id str str/trim str/lower-case)
            prefixes (->> (str/split (or (:responses-model-prefixes config) "") #",")
                          (map str/trim)
                          (remove str/blank?))]
        (boolean
         (and normalized-model
              (some (fn [prefix]
                      (let [normalized-prefix (-> prefix
                                                  str/lower-case
                                                  (str/replace #"\\*$" ""))]
                        (str/starts-with? normalized-model normalized-prefix)))
                    prefixes)))))))

(defn effective-thinking-level
  [config model-id requested-thinking-level]
  (let [requested (normalize-thinking-level requested-thinking-level)
        model-spec (resolve-model-contract config model-id)
        allowed-levels (let [contract-levels (seq (:thinking-levels model-spec))]
                         (cond
                           contract-levels (set contract-levels)
                           (false? (:reasoning model-spec)) #{"off"}
                           :else thinking-levels))
        default-level (or (:default-thinking model-spec)
                          (:agent-thinking-level config)
                          "off")]
    (if (and requested (contains? allowed-levels requested))
      requested
      default-level)))

(defn model-thinking-format
  [model-id]
  (let [normalized-model (some-> model-id str str/trim str/lower-case)]
    (cond
      (and normalized-model (str/starts-with? normalized-model "glm-")) "zai"
      :else nil)))

(defn model-input-modes
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)
        inputs (->> (or (:input model-spec) [])
                    (map normalize-input-kind)
                    (remove nil?)
                    distinct
                    vec)]
    (if (seq inputs)
      inputs
      ["text"])))

(defn model-supports-input?
  [config model-id input-kind]
  (let [wanted (or (normalize-input-kind input-kind) "text")]
    (boolean
     (some #(= wanted %)
           (model-input-modes config model-id)))))

(defn tool-cost
  []
  {:input 0 :output 0 :cacheRead 0 :cacheWrite 0})

(defn provider-model-config
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)
        reasoning? (model-supports-reasoning? config model-id)
        api (or (normalize-model-api (:api model-spec))
                (if (model-prefers-responses? config model-id)
                  "openai-responses"
                  "openai-completions"))
        ;; Eta-mu model registry accepts text/image/audio input kinds.
        ;; Keep Knoxx's richer contract input metadata for request validation, but
        ;; down-project unsupported inputs (for example video/document) so models.json stays loadable.
        registry-inputs (->> (model-input-modes config model-id)
                             (filter eta-mu-registry-input-kinds)
                             distinct
                             vec)]
    {:id model-id
     :name (or (:label model-spec) model-id)
     :api api
     :reasoning reasoning?
     :input (if (seq registry-inputs) registry-inputs ["text"])
     :contextWindow (or (:context-window model-spec) 128000)
     :maxTokens (or (:max-tokens model-spec) 8192)
     :cost (tool-cost)}))

(defn provider-openai-base-url
  [base-url]
  (let [base (or base-url "")]
    (cond
      (str/blank? base) nil
      (str/ends-with? base "/v1") base
      (str/ends-with? base "/") (str base "v1")
      :else (str base "/v1"))))

(def ^:private proxx-affinity-compat
  {:sendSessionAffinityHeaders true
   :supportsLongCacheRetention true})

(defn- provider-settings-map
  [config]
  (let [proxx-contract (resolve-provider-contract config "proxx")
        configured-base-urls (or (:provider-base-urls config) {})
        configured-auth-tokens (or (:provider-auth-tokens config) {})
        configured-auth-headers (or (:provider-auth-headers config) {})
        configured-provider-ids (->> (concat (keys configured-base-urls)
                                             (keys configured-auth-tokens)
                                             (keys configured-auth-headers))
                                     (map normalize-provider-id)
                                     (remove nil?)
                                     distinct)
        configured-providers (reduce (fn [acc provider-id]
                                       (let [base-url (provider-openai-base-url (get configured-base-urls provider-id))
                                             api-key (get configured-auth-tokens provider-id)
                                             auth-header-raw (some-> (get configured-auth-headers provider-id) str str/trim str/lower-case)
                                             auth-header? (if (some? auth-header-raw)
                                                            (not (#{"false" "0" "no" "off"} auth-header-raw))
                                                            true)]
                                         (if base-url
                                           (assoc acc provider-id {:baseUrl base-url
                                                                   :apiKey api-key
                                                                   :authHeader auth-header?})
                                           acc)))
                                     {}
                                     configured-provider-ids)]
    (merge
     {"proxx" {:baseUrl (provider-openai-base-url (:proxx-base-url config))
                ;; env-var NAME the runtime reads the key from — the contract
                ;; may rename it (:provider/auth :auth/env); never a secret value
                :apiKey (or (:auth-env proxx-contract) "PROXX_AUTH_TOKEN")
                :authHeader true
                :compat proxx-affinity-compat}}
     configured-providers)))

(defn per-model-compat
  "Compute per-model compat so reasoning/thinking settings aren't
   incorrectly shared across models that don't support them. Contract-declared
   compat keys win over inferred defaults."
  [config model-id]
  (let [model-spec (resolve-model-contract config model-id)
        inferred (cond-> {:supportsDeveloperRole false}
                   (model-supports-reasoning? config model-id)
                   (assoc :supportsReasoningEffort true)
                   (some? (model-thinking-format model-id))
                   (assoc :thinkingFormat (model-thinking-format model-id)))]
    (merge inferred (or (:compat model-spec) {}))))

(defn- configured-model-ids
  "Model ids Knoxx may select from contracts/config even when Proxx /v1/models
   is unavailable or omits a contract-backed local model. Eta-mu requires every
   selected model to exist in models.json before a session can be created."
  [config]
  (->> (concat [(:proxx-default-model config)]
               (keep (fn [contract]
                       (when (not= false (:allowlisted contract))
                         (:id contract)))
                     (model-contracts config)))
       (map (fn [m] (some-> m str str/trim not-empty)))
       (remove nil?)
       distinct
       vec))

(defn models-config
  ([config]
   (models-config config nil))
  ([config model-ids]
   (let [normalized-models (->> (concat model-ids (configured-model-ids config))
                                (map (fn [m] (some-> m str str/trim not-empty)))
                                (remove nil?)
                                distinct
                                vec)
         models (if (seq normalized-models)
                  normalized-models
                  ["glm-5"])
         base-compat {:supportsDeveloperRole false}
         provider-settings (provider-settings-map config)
         models-by-provider (reduce (fn [acc model-id]
                                      (let [provider-id (or (some-> (resolve-model-contract config model-id) :provider normalize-provider-id)
                                                            "proxx")]
                                        (update acc provider-id (fnil conj []) model-id)))
                                    {}
                                    models)
         providers (reduce-kv (fn [acc provider-id provider-model-ids]
                                (if-let [settings (get provider-settings provider-id)]
                                  (let [provider-compat (merge base-compat (:compat settings))]
                                    (assoc acc (keyword provider-id)
                                           (merge (dissoc settings :compat)
                                                  {:compat provider-compat
                                                   :models (mapv (fn [model-id]
                                                                   (merge (provider-model-config config model-id)
                                                                          {:compat (per-model-compat config model-id)}))
                                                                 provider-model-ids)})))
                                  acc))
                              {}
                              models-by-provider)]
     {:providers providers})))

(defn chat-completions-url
  "Compose the full OpenAI chat-completions endpoint from a normalized /v1
   base URL (see provider-openai-base-url). Returns nil for a blank base."
  [base-url]
  (let [base (some-> base-url str str/trim not-empty)]
    (when base
      (str base "/chat/completions"))))

(defn- provider-model-entry
  [models-data provider-id model-id]
  (let [provider-name (normalize-provider-id provider-id)
        wanted (some-> model-id str str/trim not-empty)]
    (when (and provider-name wanted)
      (when-let [entry (some (fn [model]
                               (when (= wanted (:id model))
                                 model))
                             (get-in models-data [:providers (keyword provider-name) :models]))]
        (assoc entry :provider provider-name)))))

(defn find-model
  "Plain lookup over models.json data with the legacy ModelRegistry fallback
   chain: explicit provider, then proxx, then the proxx fallback id. Returns
   the model entry with its :provider attached, or nil when nothing matches."
  [models-data provider-id model-id fallback-model-id]
  (or (provider-model-entry models-data provider-id model-id)
      (provider-model-entry models-data "proxx" model-id)
      (provider-model-entry models-data "proxx" fallback-model-id)))

(defn- default-model-from-contracts
  [config]
  (or (some->> (model-contracts config)
               (some (fn [contract]
                       (when (:default contract)
                         (:id contract)))))
      (some-> (model-contracts config) first :id)))

(defn- env-var-set?
  [env-lookup env-name]
  (some? (env-lookup env-name)))

(declare enrich-config*)

(defn enrich-config
  "Augment an env-only config map with derived model/provider config fields.

   Provider fields resolve contract-first: an explicitly SET env var wins,
   then the :provider contract (katamorph ProviderContract, loaded from the
   contract tree), then the built-in default — so env-only deployments keep
   working unchanged when no provider contract is present.

   Keeps open-hax.sol.infra.config strictly env-only, while ensuring legacy
   call sites continue to find these keys. Environment access is injected so
   this domain namespace stays deterministic and host-independent."
  ([config]
   (enrich-config config (constantly nil)))
  ([config env-lookup]
   (let [proxx-contract (resolve-provider-contract config "proxx")]
     (cond-> (enrich-config* config proxx-contract env-lookup)
       (and (:base-url proxx-contract)
            (not (env-var-set? env-lookup "PROXX_BASE_URL")))
       (assoc :proxx-base-url (:base-url proxx-contract))

       (and (:auth-env proxx-contract)
            (not (env-var-set? env-lookup "PROXX_AUTH_TOKEN")))
       (assoc :proxx-auth-token
              (or (some-> (env-lookup (:auth-env proxx-contract))
                          str str/trim not-empty)
                  (:proxx-auth-token config)))

       (and (:models-endpoint proxx-contract)
            (not (:proxx-models-endpoint config)))
       (assoc :proxx-models-endpoint (:models-endpoint proxx-contract))))))

(defn- enrich-config*
  [config proxx-contract env-lookup]
  (merge
   {:model-prefix-allowlist
    (or (some-> (or (:model-prefix-allowlist config)
                    (env-lookup "KNOXX_MODEL_PREFIX_ALLOWLIST"))
                parse-prefix-allowlist
                not-empty)
        (not-empty (:prefix-allowlist proxx-contract))
        (parse-prefix-allowlist
         "glm-5,gpt-5,qwen3,gemma4:,gemma3:,deepseek,kimi-k2,nemotron,cogito,devstral,minimax,ministral,mistral-large"))

    :proxx-default-model
    (or (:proxx-default-model config)
        (default-model-from-contracts config)
        "glm-5")

    :agent-thinking-level
    (or (normalize-thinking-level
         (or (:agent-thinking-level config)
             (env-lookup "KNOXX_THINKING_LEVEL")
             "off"))
        "off")

    :reasoning-model-prefixes
    (or (:reasoning-model-prefixes config)
        (env-lookup "KNOXX_REASONING_MODEL_PREFIXES")
        "glm-")

    :responses-model-prefixes
    (or (:responses-model-prefixes config)
        (env-lookup "KNOXX_RESPONSES_MODEL_PREFIXES")
        "gpt-")}
   config))
