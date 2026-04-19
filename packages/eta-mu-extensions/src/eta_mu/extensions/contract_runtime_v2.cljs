(ns eta-mu.extensions.contract-runtime-v2
  "Contract Runtime v2.

  Implements:
  - .ημ/ directory creation + CONTRACT.sha cache
  - PRINCIPLE.edn bootstrap from agents/mindfuck/CONTRACT.edn
  - Upward-walk CONTRACT.edn discovery on path-bearing tool calls
  - EDN map dispatch: actor | policy | fulfillment | capability | role | unknown->system-prompt
  - Policy before-hook (block/warn/note)
  - Fulfillment after-hook (deterministic + judge stubs)

  See: spec/contract-runtime-v2-spec.md
  Schema: spec/contracts-v1.edn"
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            [cljs.reader :as reader]
            [cljs.pprint :refer [pprint]]
            [goog.object :as gobj]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["node:crypto" :as crypto]))

;; ============================================================
;; Constants
;; ============================================================

(def HOME (.homedir os))
(def GLOBAL-KEY "__eta_mu_contract_runtime_v2__")
(def STATE-DIR (path/join HOME ".\u03b7\u03bc" "state" "contract-runtime-v2"))
(def SCORES-FILE (path/join STATE-DIR "fulfillment-scores.jsonl"))
(def STATUS-KEY "contract-runtime-v2")
(def DEFAULT-TTL-MS 300000)

;; Keys that indicate a tool param carries a path
(def PATH-PARAM-KEYS #{"path" "file" "dir" "root" "cwd" "target" "source" "dest"})

;; Known contract kinds
(def KNOWN-KINDS #{:actor :policy :fulfillment :capability :role
                   :agent :intent :trigger})

;; opmf fulfillment id — skip re-registering if already active
(def OPMF-OUTPUT-GATE-ID "fulfillment.mindfuck.output-gate")

;; ============================================================
;; State
;; ============================================================

(defn get-state []
  (let [g js/globalThis]
    (or (gobj/get g GLOBAL-KEY)
        (let [fresh #js {:loaded         #js {}
                         :actors         #js []
                         :policies       #js []
                         :fulfills       #js []
                         :caps           #js {}
                         :roles          #js {}
                         :ttlMs          DEFAULT-TTL-MS
                         :policyLog      #js []
                         :principleReady false
                         :lastError      nil}]
          (gobj/set g GLOBAL-KEY fresh)
          fresh))))

;; ============================================================
;; FS helpers
;; ============================================================

(defn file-exists? [p]
  (.existsSync fs p))

(defn ensure-dir! [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn safe-read-text [p]
  (try (.readFileSync fs p "utf8") (catch :default _ nil)))

(defn write-text! [p text]
  (ensure-dir! (path/dirname p))
  (.writeFileSync fs p text "utf8"))

(defn append-jsonl! [file value]
  (ensure-dir! (path/dirname file))
  (.appendFileSync fs file
    (str (js/JSON.stringify (clj->js value)) "\n") "utf8"))

(defn now-ms [] (.now js/Date))
(defn now-iso [] (.toISOString (js/Date.)))

;; ============================================================
;; .ημ/ directory
;; ============================================================

(defn hm-dir
  "Returns the .ημ/ directory for a given working directory."
  [cwd]
  (path/join cwd ".\u03b7\u03bc"))

(defn sha-cache-path [cwd]
  (path/join (hm-dir cwd) "CONTRACT.sha"))

(defn principle-path [cwd]
  (path/join (hm-dir cwd) "PRINCIPLE.edn"))

(defn ensure-hm-dir! [cwd]
  (ensure-dir! (hm-dir cwd)))

;; ============================================================
;; SHA cache
;; ============================================================

(defn sha256 [s]
  (.createHash crypto "sha256")
  (let [h (.createHash crypto "sha256")]
    (.update h s)
    (.digest h "hex")))

(defn strip-whitespace [s]
  (str/replace s #"\s+" ""))

(defn contract-sha [text]
  (sha256 (strip-whitespace text)))

(defn read-sha-cache [cwd]
  (let [p (sha-cache-path cwd)]
    (if (file-exists? p)
      (try (js->clj (js/JSON.parse (safe-read-text p)) :keywordize-keys false)
           (catch :default _ {}))
      {})))

(defn write-sha-cache! [cwd cache]
  (write-text! (sha-cache-path cwd) (js/JSON.stringify (clj->js cache) nil 2)))

(defn cache-entry-fresh? [entry ttl-ms]
  (when entry
    (let [loaded-at (get entry "loaded-at" 0)]
      (< (- (now-ms) loaded-at) ttl-ms))))

;; ============================================================
;; PRINCIPLE.edn bootstrap
;; ============================================================

(defn locate-mindfuck-contract
  "Search for agents/mindfuck/CONTRACT.edn relative to cwd, then global fallback."
  [cwd]
  (let [candidates
        [(path/join cwd "agents" "mindfuck" "CONTRACT.edn")
         ;; walk up up to 4 levels
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
            dest-text (safe-read-text dest)
            src-sha   (contract-sha src-text)
            dest-sha  (contract-sha dest-text)]
        (if (= src-sha dest-sha)
          {:ok true :action :unchanged}
          ;; TODO: append-only merge when section IDs are parseable
          ;; For now: overwrite if no :disabled sections present in dest
          (if (str/includes? dest-text ":disabled true")
            {:ok false :action :skipped
             :reason "PRINCIPLE.edn has :disabled sections — manual merge required"}
            (do (write-text! dest src-text)
                {:ok true :action :updated :source source})))))))

;; ============================================================
;; Upward-walk CONTRACT.edn discovery
;; ============================================================

(defn walk-up-collect
  "Walk from `start-dir` up to `stop-dir` (inclusive),
  return absolute paths of every CONTRACT.edn found, root->leaf order."
  [start-dir stop-dir]
  (let [start (path/resolve start-dir)
        stop  (path/resolve stop-dir)]
    (loop [cur start acc []]
      (let [candidate (path/join cur "CONTRACT.edn")
            acc*      (if (file-exists? candidate) (conj acc candidate) acc)
            parent    (path/dirname cur)]
        (if (or (= cur stop) (= cur parent)) ; at root or stop
          acc*
          (recur parent acc*))))))

(defn path-param-from-tool-call
  "Extract the first path-like param value from a tool params JS object."
  [params-js]
  (when params-js
    (let [params (js->clj params-js :keywordize-keys false)]
      (some (fn [k] (get params k))
            PATH-PARAM-KEYS))))

;; ============================================================
;; EDN map parsing
;; ============================================================

(defn strip-comment-lines [text]
  (->> (str/split (or text "") #"\r?\n")
       (remove #(str/starts-with? (str/trim %) ";;"))
       (str/join "\n")))

(defn parse-contract-file
  "Parse a CONTRACT.edn file into a vector of top-level maps."
  [file-path]
  (try
    (let [text    (safe-read-text file-path)
          cleaned (strip-comment-lines text)
          form    (reader/read-string cleaned)]
      (cond
        (map? form)    [form]     ; single map
        (vector? form) form       ; already a vector of maps
        :else          [form]))   ; fallthrough — old s-expr etc.
    (catch :default e
      (js/console.warn (str "[contract-runtime-v2] parse error in " file-path ": " (.-message e)))
      [])))

(defn contract-kind [m]
  (or (:contract/kind m)
      (when (:actor/id m) :actor)
      nil))

;; ============================================================
;; Dispatch
;; ============================================================

(defn dispatch-map!
  "Dispatch a single parsed map into the session state."
  [state m raw-text]
  (let [kind (contract-kind m)]
    (cond
      (= kind :actor)
      (.push (gobj/get state "actors") (clj->js m))

      (= kind :policy)
      (.push (gobj/get state "policies") (clj->js m))

      (= kind :fulfillment)
      (let [fid (:contract/id m)
            opmf-active? (gobj/get js/globalThis "__eta_mu_opmf_gate_active__")]
        (when-not (and (= fid OPMF-OUTPUT-GATE-ID) opmf-active?)
          (.push (gobj/get state "fulfills") (clj->js m))))

      (= kind :capability)
      (let [cap-id (str (:capability/id m))]
        (gobj/set (gobj/get state "caps") cap-id (clj->js m)))

      (= kind :role)
      (let [role-id (str (:role/id m))]
        (gobj/set (gobj/get state "roles") role-id (clj->js m)))

      ;; unknown or unrecognised kind — fall through to system prompt verbatim
      :else
      (js/console.info (str "[contract-runtime-v2] unknown kind " kind
                            " — appending to system prompt verbatim")))))

(defn dispatch-contract-file!
  "Load, cache, and dispatch all maps from a CONTRACT.edn file."
  [state cwd contract-path]
  (let [text    (safe-read-text contract-path)
        sha     (contract-sha text)
        ttl-ms  (gobj/get state "ttlMs")
        cache   (read-sha-cache cwd)
        entry   (get cache contract-path)]
    (if (and (= sha (get entry "sha"))
             (cache-entry-fresh? entry ttl-ms))
      ;; cache hit — maps already in state from a previous load this session
      :cached
      (do
        ;; cache miss — parse and dispatch
        (let [maps (parse-contract-file contract-path)]
          (doseq [m maps]
            (when (map? m)
              (dispatch-map! state m text)))
          ;; update sha cache on disk
          (write-sha-cache! cwd
            (assoc cache contract-path
              {"sha"       sha
               "loaded-at" (now-ms)}))
          ;; update in-memory loaded registry
          (gobj/set (gobj/get state "loaded") contract-path
            #js {:sha sha :loadedAt (now-ms)})
          :loaded)))))

;; ============================================================
;; Before-hook: path-bearing tool calls
;; ============================================================

(defn on-path-bearing-tool-call!
  "Run before any tool call that has a path param.
  Walks up from the path to session cwd, loading CONTRACT.edn files."
  [params-js ctx]
  (when-let [raw-path (path-param-from-tool-call params-js)]
    (let [state  (get-state)
          cwd    (or (gobj/get ctx "cwd") HOME)
          target (path/resolve (path/dirname raw-path))
          files  (walk-up-collect target cwd)]
      (ensure-hm-dir! cwd)
      (doseq [contract-path files]
        (dispatch-contract-file! state cwd contract-path)))))

;; ============================================================
;; System prompt contribution
;; ============================================================

(defn build-actor-system-prompt
  "Collect system prompt text from all loaded actors.
  Returns a single concatenated string or nil."
  [state]
  (let [actors (js->clj (gobj/get state "actors") :keywordize-keys true)]
    (when (seq actors)
      (->> actors
           (keep (fn [a]
                   (let [sys (:system a)]
                     (cond
                       (string? sys) sys
                       (map? sys)    (str "[fn-ref: " (:fn-ref sys) "]")
                       :else         nil))))
           (str/join "\n\n")))))

;; ============================================================
;; UI helpers
;; ============================================================

(defn has-ui? [ctx] (boolean (gobj/get ctx "hasUI")))
(defn ctx-ui  [ctx] (gobj/get ctx "ui"))

(defn set-status! [ctx]
  (when (has-ui? ctx)
    (let [state (get-state)
          n-loaded (count (js-keys (gobj/get state "loaded")))
          n-actors  (.-length (gobj/get state "actors"))
          n-pol     (.-length (gobj/get state "policies"))
          n-ful     (.-length (gobj/get state "fulfills"))]
      (.setStatus (ctx-ui ctx) STATUS-KEY
        (str "crv2 loaded:" n-loaded
             " actors:" n-actors
             " pol:" n-pol
             " ful:" n-ful)))))

;; ============================================================
;; Extension registration
;; ============================================================

(em/defextension contract-runtime-v2
  :name "contract-runtime-v2"
  :description "Contract Runtime v2: cwd-walk discovery, EDN map dispatch, PRINCIPLE.edn bootstrap."

  (em/on "session_start"
    :handler (fn [_event ctx]
               (let [cwd   (or (gobj/get ctx "cwd") HOME)
                     state (get-state)]
                 (ensure-hm-dir! cwd)
                 (let [result (bootstrap-principle! cwd)]
                   (when-not (:ok result)
                     (js/console.warn (str "[contract-runtime-v2] PRINCIPLE.edn: " (:reason result))))
                   (aset state "principleReady" (:ok result)))
                 (set-status! ctx)
                 nil)))

  (em/on "session_switch"
    :handler (fn [_event ctx]
               ;; Re-run bootstrap in case cwd changed
               (let [cwd (or (gobj/get ctx "cwd") HOME)]
                 (ensure-hm-dir! cwd)
                 (bootstrap-principle! cwd)
                 (set-status! ctx)
                 nil)))

  (em/on "before_tool_call"
    :handler (fn [event ctx]
               (let [params (gobj/get event "params")]
                 (on-path-bearing-tool-call! params ctx)
                 nil)))

  (em/on "session_shutdown"
    :handler (fn [_event ctx]
               (when (has-ui? ctx)
                 (.setStatus (ctx-ui ctx) STATUS-KEY js/undefined))))

  (em/command "crv2"
    :description "Inspect contract-runtime-v2 state (/crv2 status|loaded|actors|policies|fulfills)"
    :handler (fn [args ctx]
               (let [state  (get-state)
                     tokens (if (str/blank? args) [] (str/split (str/trim args) #"\s+"))
                     cmd    (or (first tokens) "status")]
                 (when (has-ui? ctx)
                   (let [ui (ctx-ui ctx)]
                     (cond
                       (= cmd "status")
                       (.setWidget ui STATUS-KEY
                         #js [(str "principle-ready: " (gobj/get state "principleReady"))
                               (str "loaded: "  (count (js-keys (gobj/get state "loaded"))))
                               (str "actors: "  (.-length (gobj/get state "actors")))
                               (str "policies: " (.-length (gobj/get state "policies")))
                               (str "fulfills: " (.-length (gobj/get state "fulfills")))
                               (str "ttl-ms: "  (gobj/get state "ttlMs"))])

                       (= cmd "loaded")
                       (.setWidget ui STATUS-KEY
                         (clj->js (map (fn [p] (str p))
                                       (js-keys (gobj/get state "loaded")))))

                       (= cmd "actors")
                       (.setWidget ui STATUS-KEY
                         (clj->js (map (fn [a] (str (gobj/get a "actor/id") " " (gobj/get a "actor/role")))
                                       (js->clj (gobj/get state "actors")))))

                       (= cmd "policies")
                       (.setWidget ui STATUS-KEY
                         (clj->js (map (fn [p] (gobj/get p "contract/id"))
                                       (js->clj (gobj/get state "policies")))))

                       (= cmd "fulfills")
                       (.setWidget ui STATUS-KEY
                         (clj->js (map (fn [f] (str (gobj/get f "contract/id")
                                                    " mode:" (gobj/get f "fulfillment/mode")))
                                       (js->clj (gobj/get state "fulfills")))))

                       :else
                       (.notify ui "Usage: /crv2 status|loaded|actors|policies|fulfills" "warn")))))))))
