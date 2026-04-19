(ns eta-mu.extensions.contract-runtime-v2
  "Contract Runtime v2.

  Implements:
  - .ημ/ directory creation + CONTRACT.sha cache
  - PRINCIPLE.edn bootstrap from agents/mindfuck/CONTRACT.edn
  - Upward-walk CONTRACT.edn discovery on path-bearing tool calls
  - EDN map dispatch: actor | policy | fulfillment | capability | role | unknown->system-prompt
  - before_agent_start system prompt injection from PRINCIPLE.edn + actors + unknown blocks
  - Policy before-hook (stub)
  - Fulfillment after-hook (stub)

  State is a CLJS atom per cwd, stored in a map-of-atoms under a single globalThis key.
  dispatch-map! is a pure swap! on the atom. dispatch-contract-file! is idempotent.

  See: spec/contract-runtime-v2-spec.md
  Schema: spec/contracts-v1.edn"
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            [goog.object :as gobj]
            [eta-mu.extensions.contract-runtime-v2.core :as core]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:crypto" :as crypto]))

(def HOME (.homedir os))
(def GLOBAL-KEY "__eta_mu_contract_runtime_v2__")
(def STATUS-KEY "contract-runtime-v2")
(def DEFAULT-TTL-MS 300000)
(def OPMF-OUTPUT-GATE-ID "fulfillment.mindfuck.output-gate")

;; ── State: atom-per-cwd ──────────────────────────────────────
;; globalThis[GLOBAL-KEY] = { "<cwd>" : atom({...}) }

(defn fresh-state []
  {:loaded         {}   ; { contract-path -> {:sha str :loaded-at ms :maps []} }
   :actors         []
   :policies       []
   :fulfills       []
   :caps           {}   ; { cap-id-str -> map }
   :roles          {}   ; { role-id-str -> map }
   :ttl-ms         DEFAULT-TTL-MS
   :policy-log     []
   :prompt-blocks  []
   :principle-ready false
   :last-error     nil})

(defn registry []
  (let [g js/globalThis]
    (or (gobj/get g GLOBAL-KEY)
        (let [r #js {}]
          (gobj/set g GLOBAL-KEY r)
          r))))

(defn get-state-atom
  "Returns the atom for the given cwd, creating it if absent."
  [cwd]
  (let [reg (registry)
        k   (str cwd)]
    (or (gobj/get reg k)
        (let [a (atom (fresh-state))]
          (gobj/set reg k a)
          a))))

(defn reset-state! [cwd]
  (reset! (get-state-atom cwd) (fresh-state)))

;; ── FS helpers ───────────────────────────────────────────────

(defn file-exists? [p] (.existsSync fs p))
(defn ensure-dir! [dir] (.mkdirSync fs dir #js {:recursive true}))
(defn safe-read-text [p] (try (.readFileSync fs p "utf8") (catch :default _ nil)))
(defn write-text! [p text] (ensure-dir! (path/dirname p)) (.writeFileSync fs p text "utf8"))
(defn now-ms [] (.now js/Date))
(defn hm-dir [cwd] (path/join cwd ".ημ"))
(defn sha-cache-path [cwd] (path/join (hm-dir cwd) "CONTRACT.sha"))
(defn principle-path [cwd] (path/join (hm-dir cwd) "PRINCIPLE.edn"))
(defn ensure-hm-dir! [cwd] (ensure-dir! (hm-dir cwd)))

(defn sha256 [s]
  (let [h (.createHash crypto "sha256")]
    (.update h s)
    (.digest h "hex")))
(defn contract-sha [text] (sha256 (core/strip-whitespace text)))

(defn read-sha-cache [cwd]
  (let [p (sha-cache-path cwd)]
    (if (file-exists? p)
      (try (js->clj (js/JSON.parse (safe-read-text p)) :keywordize-keys false)
           (catch :default _ {}))
      {})))

(defn write-sha-cache! [cwd cache]
  (write-text! (sha-cache-path cwd) (js/JSON.stringify (clj->js cache) nil 2)))

;; ── PRINCIPLE.edn bootstrap ──────────────────────────────────

(defn locate-mindfuck-contract [cwd]
  (let [candidates [(path/join cwd "agents" "mindfuck" "CONTRACT.edn")
                    (path/join cwd ".." "agents" "mindfuck" "CONTRACT.edn")
                    (path/join cwd ".." ".." "agents" "mindfuck" "CONTRACT.edn")
                    (path/join cwd ".." ".." ".." "agents" "mindfuck" "CONTRACT.edn")
                    (path/join HOME ".pi" "agent" "skills" "mindfuck" "CONTRACT.edn")]]
    (first (filter file-exists? (map path/resolve candidates)))))

(defn bootstrap-principle! [cwd]
  (let [source (locate-mindfuck-contract cwd)
        dest   (principle-path cwd)]
    (cond
      (nil? source)
      {:ok false :reason "agents/mindfuck/CONTRACT.edn not found"}

      (not (file-exists? dest))
      (do (write-text! dest (safe-read-text source))
          {:ok true :action :created :source source})

      :else
      (let [src-text  (safe-read-text source)
            dest-text (safe-read-text dest)]
        (if (= (contract-sha src-text) (contract-sha dest-text))
          {:ok true :action :unchanged}
          (if (str/includes? dest-text ":disabled true")
            {:ok false :action :skipped
             :reason "PRINCIPLE.edn has :disabled sections — manual merge required"}
            (do (write-text! dest src-text)
                {:ok true :action :updated :source source})))))))

;; ── Dispatch ─────────────────────────────────────────────────
;; All state mutations are pure swap! on a CLJS atom.

(defn remove-entries-for-path
  "Remove all entries previously dispatched from contract-path.
  Each loaded entry is tagged with :source so we can evict on reload."
  [state contract-path]
  (let [evict (fn [coll] (vec (remove #(= contract-path (:source %)) coll)))
        evict-map (fn [m] (into {} (remove (fn [[_ v]] (= contract-path (:source v))) m)))]
    (-> state
        (update :actors   evict)
        (update :policies evict)
        (update :fulfills evict)
        (update :caps     evict-map)
        (update :roles    evict-map)
        (update :prompt-blocks evict))))

(defn apply-dispatch
  "Pure reducer: integrate one parsed map m (tagged with :source) into state."
  [state m]
  (let [kind   (core/contract-kind m)
        tagged (assoc m :source (:source m))
        prompt (core/prompt-block-for-map m nil)
        opmf-active? (gobj/get js/globalThis "__eta_mu_opmf_gate_active__")
        state* (cond
                 (= kind :actor)
                 (update state :actors conj tagged)

                 (= kind :policy)
                 (update state :policies conj tagged)

                 (= kind :fulfillment)
                 (if (and (= (:contract/id m) OPMF-OUTPUT-GATE-ID) opmf-active?)
                   state
                   (update state :fulfills conj tagged))

                 (= kind :capability)
                 (assoc-in state [:caps (str (:capability/id m))] tagged)

                 (= kind :role)
                 (assoc-in state [:roles (str (:role/id m))] tagged)

                 :else state)]
    (if (and (string? prompt) (not (str/blank? prompt)))
      (update state* :prompt-blocks conj prompt)
      state*)))

(defn dispatch-contract-file!
  "Load, cache, and dispatch all maps from a CONTRACT.edn file.
  Idempotent: evicts previous entries for this path before re-dispatching.
  Cache hit is only valid if the contract is already in :loaded registry."
  [state-atom cwd contract-path]
  (let [text   (safe-read-text contract-path)
        sha    (contract-sha text)
        ttl-ms (:ttl-ms @state-atom)
        cache  (read-sha-cache cwd)
        entry  (get cache contract-path)
        in-mem (get-in @state-atom [:loaded contract-path])]
    (if (and (= sha (get entry "sha"))
             (core/cache-entry-fresh? (now-ms) entry ttl-ms)
             (some? in-mem))
      :cached
      (let [maps    (core/normalize-contract-forms text)
            tagged  (map #(assoc % :source contract-path) maps)
            now     (now-ms)]
        ;; evict then re-dispatch atomically
        (swap! state-atom
               (fn [s]
                 (let [evicted (remove-entries-for-path s contract-path)]
                   (reduce apply-dispatch
                           (assoc-in evicted [:loaded contract-path]
                                     {:sha sha :loaded-at now})
                           tagged))))
        (write-sha-cache! cwd
          (assoc cache contract-path {"sha" sha "loaded-at" now}))
        :loaded))))

;; ── Path-bearing tool call hook ──────────────────────────────

(defn on-path-bearing-tool-call! [params-js ctx]
  (when-let [raw-path (core/path-param-from-tool-call
                        (js->clj params-js :keywordize-keys false))]
    (let [cwd    (or (gobj/get ctx "cwd") HOME)
          sa     (get-state-atom cwd)
          abs    (path/resolve raw-path)
          stat   (try (.statSync fs abs) (catch :default _ nil))
          target (if stat
                   (if (.isDirectory stat) abs (path/dirname abs))
                   (path/dirname abs))
          files  (core/walk-up-paths
                   #(path/join %1 %2) #(path/dirname %)
                   target cwd file-exists?)]
      (ensure-hm-dir! cwd)
      (doseq [contract-path files]
        (dispatch-contract-file! sa cwd contract-path)))))

;; ── Prompt assembly ──────────────────────────────────────────

(defn build-prompt-append [cwd state-atom]
  (core/build-prompt-append
    (safe-read-text (principle-path cwd))
    (:prompt-blocks @state-atom)))

;; ── UI helpers ───────────────────────────────────────────────

(defn has-ui? [ctx] (boolean (gobj/get ctx "hasUI")))
(defn ctx-ui  [ctx] (gobj/get ctx "ui"))

(defn set-status! [ctx cwd]
  (when (has-ui? ctx)
    (let [s @(get-state-atom cwd)]
      (.setStatus (ctx-ui ctx) STATUS-KEY
                  (str "crv2 loaded:" (count (:loaded s))
                       " actors:"    (count (:actors s))
                       " pol:"       (count (:policies s))
                       " ful:"       (count (:fulfills s)))))))

;; ── Extension ────────────────────────────────────────────────

(em/defextension contract-runtime-v2
  :name "contract-runtime-v2"
  :description "Contract Runtime v2: cwd-walk discovery, EDN map dispatch, PRINCIPLE.edn bootstrap."

  (em/on "session_start"
    :handler (fn [_event ctx]
               (let [cwd (or (gobj/get ctx "cwd") HOME)
                     sa  (get-state-atom cwd)]
                 (reset! sa (fresh-state))
                 (ensure-hm-dir! cwd)
                 (let [result (bootstrap-principle! cwd)]
                   (when-not (:ok result)
                     (js/console.warn (str "[contract-runtime-v2] PRINCIPLE.edn: " (:reason result))))
                   (swap! sa assoc :principle-ready (:ok result)))
                 (set-status! ctx cwd)
                 nil)))

  (em/on "session_switch"
    :handler (fn [_event ctx]
               (let [cwd (or (gobj/get ctx "cwd") HOME)
                     sa  (get-state-atom cwd)]
                 (reset! sa (fresh-state))
                 (ensure-hm-dir! cwd)
                 (let [result (bootstrap-principle! cwd)]
                   (swap! sa assoc :principle-ready (:ok result)))
                 (set-status! ctx cwd)
                 nil)))

  (em/on "before_tool_call"
    :handler (fn [event ctx]
               (on-path-bearing-tool-call! (gobj/get event "params") ctx)
               nil))

  (em/on "before_agent_start"
    :handler (fn [event ctx]
               (let [cwd    (or (gobj/get ctx "cwd") HOME)
                     sa     (get-state-atom cwd)
                     append (build-prompt-append cwd sa)]
                 (when (and (string? append) (not (str/blank? append)))
                   #js {:systemPrompt (str (gobj/get event "systemPrompt") "\n\n" append)}))))

  (em/on "session_shutdown"
    :handler (fn [_event ctx]
               (when (has-ui? ctx)
                 (.setStatus (ctx-ui ctx) STATUS-KEY js/undefined))))

  (em/command "crv2"
    :description "Inspect contract-runtime-v2 state (/crv2 status|loaded|actors|policies|fulfills|prompt)"
    :handler (fn [args ctx]
               (let [cwd    (or (gobj/get ctx "cwd") HOME)
                     s      @(get-state-atom cwd)
                     tokens (if (str/blank? args) [] (str/split (str/trim args) #"\s+"))
                     cmd    (or (first tokens) "status")]
                 (when (has-ui? ctx)
                   (let [ui (ctx-ui ctx)]
                     (cond
                       (= cmd "status")
                       (.setWidget ui STATUS-KEY
                                   (clj->js
                                     [(str "principle-ready: " (:principle-ready s))
                                      (str "loaded: "          (count (:loaded s)))
                                      (str "actors: "          (count (:actors s)))
                                      (str "policies: "        (count (:policies s)))
                                      (str "fulfills: "        (count (:fulfills s)))
                                      (str "ttl-ms: "          (:ttl-ms s))]))

                       (= cmd "loaded")
                       (.setWidget ui STATUS-KEY
                                   (clj->js (keys (:loaded s))))

                       (= cmd "actors")
                       (.setWidget ui STATUS-KEY
                                   (clj->js (map #(str (:actor/id %) " " (:actor/role %)) (:actors s))))

                       (= cmd "policies")
                       (.setWidget ui STATUS-KEY
                                   (clj->js (map :contract/id (:policies s))))

                       (= cmd "fulfills")
                       (.setWidget ui STATUS-KEY
                                   (clj->js (map #(str (:contract/id %) " mode:" (:fulfillment/mode %)) (:fulfills s))))

                       (= cmd "prompt")
                       (.setWidget ui STATUS-KEY
                                   (clj->js [(or (build-prompt-append cwd (get-state-atom cwd))
                                                 "(no prompt append loaded)")]))

                       :else
                       (.notify ui "Usage: /crv2 status|loaded|actors|policies|fulfills|prompt" "warn"))))))))))
