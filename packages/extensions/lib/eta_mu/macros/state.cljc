(ns eta-mu.macros.state
  "State management macros for eta-mu extensions.

   Provides:
   - defstate: define extension state with auto-generated boilerplate
   - with-state-dir: create state directory constants
   - with-state-files: create state file path constants
   - with-global-state: create global state accessors"
  (:require-macros [eta-mu.macros.state])
  (:require [clojure.string :as str]))

(defn- normalize-name
  "Convert extension name to normalized form for state keys.
   receipt-river -> receipt_river
   session-mycology -> session_mycology"
  [raw-name]
  (let [s (str (or raw-name "extension"))]
    (-> s
        (str/replace #"-" "_")
        (str/lower-case))))

(defn- state-key
  "Generate global state key: __eta_mu_<ext_name>_state__
   Falls back to __pi_<ext_name>_state__ for backward compat."
  [ext-name]
  (str "__eta_mu_" (normalize-name ext-name) "_state__"))

(defn- status-key
  "Generate UI status key: <ext-name>"
  [ext-name]
  (normalize-name ext-name))

(defn- state-dir-path
  "Resolve state directory: ~/.ημ/state/<name> with fallback to ~/.pi/agent/state/<name>.

   Resolution order:
   1. PI_STATE_DIR env var (if set, use directly)
   2. ~/.ημ/state/<name> (if exists)
   3. ~/.pi/agent/state/<name> (if exists, backward compat)
   4. ~/.ημ/state/<name> (default for new state)"
  [ext-name]
  #_{:clj-kondo/ignore [:unresolved-namespace]}
  (let [name (normalize-name ext-name)
        home (aget (js/require "os") "homedir")
        env-dir (aget js/process.env "PI_STATE_DIR")]
    (if (and env-dir (not= env-dir ""))
      (str env-dir "/" name)
      (let [path-obj (js/require "path")
            fs (js/require "fs")
            eta-mu-dir (.join path-obj home ".ημ" "state" name)
            legacy-dir (.join path-obj home ".pi" "agent" "state" name)]
        (if (.existsSync fs eta-mu-dir)
          eta-mu-dir
          (if (.existsSync fs legacy-dir)
            legacy-dir
            eta-mu-dir))))))

(defmacro defstate
  "Define extension state with auto-generated boilerplate.

   Usage:
     (defstate receipt-river
       :initial-state {:enabled true :currentTurn 0}
       :events-file \"events.jsonl\"
       :status-format (fn [state] (str \"rr:\" (if (aget state \"enabled\") \"on\" \"off\"))))

   Expands to:
     - STATE-DIR constant
     - EVENTS-FILE constant (optional)
     - STATUS-KEY constant
     - GLOBAL-KEY constant
     - get-state function
     - set-status! function
     - reset-state! function (optional)"
  [ext-name & opts]
  (let [opts (apply hash-map opts)
        name (normalize-name ext-name)
        sk (status-key ext-name)
        gk (state-key ext-name)
        sdp (state-dir-path ext-name)
        init-state (:initial-state opts)
        events-file (:events-file opts)
        status-fmt (:status-format opts)
        has-reset? (contains? opts :on-reset)]
    `(do
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'HOME (.homedir (js/require "os")))
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'STATE-DIR ~sdp)
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'STATUS-KEY ~sk)
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'GLOBAL-KEY ~gk)
       ~@(when events-file
           `#_{:clj-kondo/ignore [:inline-def]}
           ((def ~'EVENTS-FILE (str ~sdp "/" ~events-file))))

       (defn ~'get-state []
         (if-let [existing# (aget js/globalThis ~gk)]
           existing#
           (let [fresh# (clj->js ~init-state)]
             (aset js/globalThis ~gk fresh#)
             fresh#)))

       (defn ~'set-status! [~'ctx ~'state]
         (when-let [ui# (when (aget ~'ctx "hasUI") (aget ~'ctx "ui"))]
           (when-let [set-status-fn# (aget ui# "setStatus")]
             (.call set-status-fn# ui# ~sk
                    ~(if status-fmt
                       (list status-fmt 'state)
                       `(str (if (aget ~'state "enabled")
                               ~(str name ": on")
                               ~(str name ": off"))))))))

       ~@(when has-reset?
           `#_{:clj-kondo/ignore [:inline-def]}
           ((def ~'reset-state!
              (fn []
                (let [fresh# (clj->js ~init-state)]
                  (aset js/globalThis ~gk fresh#)
                  fresh#))))))))

(defmacro with-state-dir
  "Create state directory and constants without full defstate.
   Use when you need more control over the generated code."
  [ext-name & body]
  (let [_name (normalize-name ext-name)
        sdp (state-dir-path ext-name)]
    `(do
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'HOME (.homedir (js/require "os")))
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'STATE-DIR ~sdp)
       ~@body)))

(defmacro with-state-files
  "Create state file path constants.
   Usage: (with-state-files receipt-river
            events.jsonl
            spores.jsonl)"
  [ext-name & filenames]
  (let [_name (normalize-name ext-name)
        sdp (state-dir-path ext-name)]
    `(do
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'HOME (.homedir (js/require "os")))
       #_{:clj-kondo/ignore [:inline-def]}
       (def ~'STATE-DIR ~sdp)
       ~@(for [fname# filenames]
           `#_{:clj-kondo/ignore [:inline-def]}
            ((def ~(symbol (str/replace fname# #".jsonl$" "-FILE"))
               (str ~sdp "/" fname#)))))))
