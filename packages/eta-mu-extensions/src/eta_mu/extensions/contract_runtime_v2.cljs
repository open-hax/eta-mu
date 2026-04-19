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
                         :promptBlocks   #js []
                         :principleReady false
                         :lastError      nil}]
          (gobj/set g GLOBAL-KEY fresh)
          fresh))))

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
      (nil? source) {:ok false :reason "agents/mindfuck/CONTRACT.edn not found"}
      (not (file-exists? dest))
      (do (write-text! dest (safe-read-text source)) {:ok true :action :created :source source})
      :else
      (let [src-text  (safe-read-text source)
            dest-text (safe-read-text dest)
            src-sha   (contract-sha src-text)
            dest-sha  (contract-sha dest-text)]
        (if (= src-sha dest-sha)
          {:ok true :action :unchanged}
          (if (str/includes? dest-text ":disabled true")
            {:ok false :action :skipped :reason "PRINCIPLE.edn has :disabled sections — manual merge required"}
            (do (write-text! dest src-text) {:ok true :action :updated :source source})))))))

(defn dispatch-map! [state m raw-text]
  (let [kind (core/contract-kind m)
        prompt (core/prompt-block-for-map m raw-text)]
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
      (gobj/set (gobj/get state "caps") (str (:capability/id m)) (clj->js m))

      (= kind :role)
      (gobj/set (gobj/get state "roles") (str (:role/id m)) (clj->js m)))
    (when (and (string? prompt) (not (str/blank? prompt)))
      (.push (gobj/get state "promptBlocks") prompt))
    nil)

(defn dispatch-contract-file! [state cwd contract-path]
  (let [text   (safe-read-text contract-path)
        sha    (contract-sha text)
        ttl-ms (gobj/get state "ttlMs")
        cache  (read-sha-cache cwd)
        entry  (get cache contract-path)]
    (if (and (= sha (get entry "sha"))
             (core/cache-entry-fresh? (now-ms) entry ttl-ms))
      :cached
      (do
        (doseq [m (core/normalize-contract-forms text)]
          (dispatch-map! state m text))
        (write-sha-cache! cwd
          (assoc cache contract-path {"sha" sha "loaded-at" (now-ms)}))
        (gobj/set (gobj/get state "loaded") contract-path #js {:sha sha :loadedAt (now-ms)})
        :loaded))))

(defn on-path-bearing-tool-call! [params-js ctx]
  (when-let [raw-path (core/path-param-from-tool-call (js->clj params-js :keywordize-keys false))]
    (let [state  (get-state)
          cwd    (or (gobj/get ctx "cwd") HOME)
          abs    (path/resolve raw-path)
          stat   (try (.statSync fs abs) (catch :default _ nil))
          target (if stat
                   (if (.isDirectory stat) abs (path/dirname abs))
                   (path/dirname abs))
          files  (core/walk-up-paths #(path/join %1 %2) #(path/dirname %) target cwd file-exists?)]
      (ensure-hm-dir! cwd)
      (doseq [contract-path files]
        (dispatch-contract-file! state cwd contract-path)))))

(defn build-prompt-append [cwd state]
  (core/build-prompt-append
    (safe-read-text (principle-path cwd))
    (js->clj (gobj/get state "promptBlocks"))))

(defn has-ui? [ctx] (boolean (gobj/get ctx "hasUI")))
(defn ctx-ui  [ctx] (gobj/get ctx "ui"))

(defn set-status! [ctx]
  (when (has-ui? ctx)
    (let [state (get-state)
          n-loaded (count (js-keys (gobj/get state "loaded")))
          n-actors (.-length (gobj/get state "actors"))
          n-pol    (.-length (gobj/get state "policies"))
          n-ful    (.-length (gobj/get state "fulfills"))]
      (.setStatus (ctx-ui ctx) STATUS-KEY
                  (str "crv2 loaded:" n-loaded
                       " actors:" n-actors
                       " pol:" n-pol
                       " ful:" n-ful)))))

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

  (em/on "before_agent_start"
    :handler (fn [event ctx]
               (let [cwd    (or (gobj/get ctx "cwd") HOME)
                     state  (get-state)
                     append (build-prompt-append cwd state)]
                 (when (and (string? append) (not (str/blank? append)))
                   #js {:systemPrompt (str (gobj/get event "systemPrompt") "\n\n" append)}))))

  (em/on "session_shutdown"
    :handler (fn [_event ctx]
               (when (has-ui? ctx)
                 (.setStatus (ctx-ui ctx) STATUS-KEY js/undefined))))

  (em/command "crv2"
    :description "Inspect contract-runtime-v2 state (/crv2 status|loaded|actors|policies|fulfills|prompt)"
    :handler (fn [args ctx]
               (let [state  (get-state)
                     cwd    (or (gobj/get ctx "cwd") HOME)
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
                                   (clj->js (map str (js-keys (gobj/get state "loaded")))))

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
                                   (clj->js (map (fn [f] (str (gobj/get f "contract/id") " mode:" (gobj/get f "fulfillment/mode")))
                                                 (js->clj (gobj/get state "fulfills")))))

                       (= cmd "prompt")
                       (.setWidget ui STATUS-KEY
                                   #js [(or (build-prompt-append cwd state) "(no prompt append loaded)")])

                       :else
                       (.notify ui "Usage: /crv2 status|loaded|actors|policies|fulfills|prompt" "warn"))))))))
