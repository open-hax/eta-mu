(ns eta-mu.extensions.receipt-river
  "Append-only receipts.log ledger for multi-step work.

  Migrated from: ~/.pi/agent/extensions/receipt-river.ts"
  (:require-macros [eta-mu.core :as em])
  (:require ["os" :as os]
            ["fs" :as fs]
            ["path" :as path]
            [clojure.string :as str]))

(def ^:const HOME (.homedir os))
(def ^:const ETA-MU-STATE-ROOT (path/join HOME ".ημ" "state"))
(def ^:const LEGACY-STATE-ROOT (str HOME "/.pi/agent/state"))
(defn resolve-state-dir [name]
  (let [eta-mu-dir (path/join ETA-MU-STATE-ROOT name)
        legacy-dir (path/join LEGACY-STATE-ROOT name)]
    (if (.existsSync fs eta-mu-dir)
      eta-mu-dir
      (if (.existsSync fs legacy-dir)
        legacy-dir
        eta-mu-dir))))
(def ^:const STATE-DIR (resolve-state-dir "receipt-river"))
(def ^:const EVENTS-FILE (path/join STATE-DIR "events.jsonl"))
(def ^:const STATUS-KEY "receipt-river")
(def ^:const GLOBAL-KEY "__pi_receipt_river_state__")
(def ^:const DELIMITER " | ")
(def ^:const PI-VERSION "0.63.1")

(def ^:const REQUIRED-KEYS
  #js ["ts" "kind" "origin" "owner" "dod" "pi" "host" "manifest" "refs"])

(def ^:const OPTIONAL-KEYS
  #js ["note" "tests" "decisions" "drift"])

(def ^:const KNOWN-KINDS
  #js [":push-truth" ":artifact-hash" ":test-run" ":build" ":decision"
       ":drift" ":catalog" ":observation" ":field-impact" ":truth"
       ":refutation" ":adjudication"])

(def ^:const SUBSTANTIVE-TOOLS
  #js ["edit" "write" "apply_patch"])

(defn now-iso []
  (.toISOString (js/Date.)))

(defn ensure-dir [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn clamp-int [value fallback min max]
  (let [n (js/Number value)]
    (if (js/Number.isFinite n)
      (js/Math.max min (js/Math.min max (js/Math.trunc n)))
      fallback)))

(defn clean-field
  ([value] (clean-field value "none"))
  ([value fallback]
   (let [s (-> (str (or value ""))
               (.replace #"\r?\n+" " ")
               (.replace #"\s+" " ")
               (.trim)
               (.replace #"\s*\|\s*" "/"))]
     (if (pos? (.-length s)) s fallback))))

(defn normalize-kind [value fallback]
  (let [raw (clean-field value fallback)
        kind (if (.startsWith raw ":") raw (str ":" raw))]
    (if (not (neg? (.indexOf KNOWN-KINDS kind)))
      kind
      (throw (js/Error. (str "Unknown receipt kind: " kind))))))

(defn expand-path [cwd target]
  (let [raw (str (or target "receipts.log"))]
    (cond
      (str/blank? raw) (str cwd "/receipts.log")
      (.startsWith raw "~/") (str HOME "/" (.slice raw 2))
      (path/isAbsolute raw) raw
      :else (path/join cwd raw))))

(defn append-jsonl [file-path value]
  (ensure-dir (path/dirname file-path))
  (.appendFileSync fs file-path (str (js/JSON.stringify value) "\n") "utf8"))

(defn read-lines [file-path]
  (if-not (.existsSync fs file-path)
    #js []
    (-> (.readFileSync fs file-path "utf8")
        (.split #"\r?\n")
        (.filter (fn [x] x)))))

(defn tail-lines [file-path lines]
  (let [all (read-lines file-path)]
    (.slice all (- (.-length all) lines))))

(defn parse-receipt-line [line]
  (let [fields #js {}]
    (.forEach (.split (str line) DELIMITER)
              (fn [chunk]
                (let [idx (.indexOf chunk "=")]
                  (when (pos? idx)
                    (let [key (.trim (.slice chunk 0 idx))
                          value (.trim (.slice chunk (inc idx)))]
                      (when (not (str/blank? key))
                        (aset fields key value)))))))
    fields))

(defn validate-receipt-line [line line-number]
  (let [fields (parse-receipt-line line)
        missing (js/Array.from
                 (filter (fn [key] (not (aget fields key)))
                         (js/Array.from REQUIRED-KEYS)))
        errors #js []]
    (when (pos? (.-length missing))
      (.push errors (str "missing required keys: " (.join missing ", "))))
    (when-not (.includes line DELIMITER)
      (.push errors (str "missing delimiter " (js/JSON.stringify DELIMITER))))
    (when-let [kind (aget fields "kind")]
      (when (neg? (.indexOf KNOWN-KINDS kind))
        (.push errors (str "unknown kind: " kind))))
    (when-let [ts (aget fields "ts")]
      (when (js/Number.isNaN (js/Date.parse ts))
        (.push errors (str "invalid ts: " ts))))
    #js {:ok (zero? (.-length errors))
         :lineNumber line-number
         :fields fields
         :errors errors
         :line line}))

(defn validate-receipt-file [file-path lines]
  (if-not (.existsSync fs file-path)
    #js {:ok false
         :file file-path
         :count 0
         :failures #js [#js {:lineNumber 0
                             :errors #js ["file does not exist"]}]}
    (let [rows (js/Array.from (.map (tail-lines file-path lines) validate-receipt-line))
          failures (js/Array.from (.filter rows (fn [row] (not (aget row "ok")))))]
      #js {:ok (zero? (.-length failures))
           :file file-path
           :count (.-length rows)
           :failures failures
           :last (.at rows -1)})))

(defn serialize-receipt [record]
  (let [ordered #js []]
    (.forEach REQUIRED-KEYS
              (fn [key]
                (.push ordered (str key "=" (clean-field (aget record key)
                                                         (if (= key "refs") "none" "unknown"))))))
    (.forEach OPTIONAL-KEYS
              (fn [key]
                (when (aget record key)
                  (.push ordered (str key "=" (clean-field (aget record key) ""))))))
    (str (.join ordered DELIMITER) "\n")))

(defn build-record [params fallback-kind]
  (let [record #js {:ts (clean-field (aget params "ts") (now-iso))
                    :kind (normalize-kind (aget params "kind") fallback-kind)
                    :origin (clean-field (aget params "origin") "pi")
                    :owner (clean-field (aget params "owner") "receipt-river")
                    :dod (clean-field (aget params "dod") (or (aget params "owner") "receipt-river"))
                    :pi (clean-field (aget params "pi") PI-VERSION)
                    :host (clean-field (aget params "host") "local")
                    :manifest (clean-field (aget params "manifest") "none")
                    :refs (clean-field (aget params "refs") "none")}]
    (.forEach OPTIONAL-KEYS
              (fn [key]
                (let [value (clean-field (aget params key) "")]
                  (when (not (str/blank? value))
                    (aset record key value)))))
    record))

(defn model-label [ctx]
  (let [model (aget ctx "model")
        provider (or (and model (aget model "provider")) "unknown")
        id (or (and model (aget model "id")) "unknown")]
    (str provider "/" id)))

(defn summarize-last-line [file-path]
  (let [last (.at (tail-lines file-path 1) 0)]
    (if last (clean-field last "") "none")))

(defn get-state []
  (if-let [existing (aget js/globalThis GLOBAL-KEY)]
    existing
    (let [fresh #js {:enabled true
                     :currentTurn 0
                     :turnToolNames #js []
                     :turnHadSubstantiveWork false
                     :turnHadReceipt false
                     :pendingReminder false
                     :lastReceiptPath nil
                     :lastReceiptLine nil
                     :lastValidation nil}]
      (aset js/globalThis GLOBAL-KEY fresh)
      fresh)))

(defn format-status [state]
  (let [mode (if (aget state "enabled") "rr:on" "rr:off")
        pending (if (aget state "pendingReminder") " pending" "")
        last (when-let [line (aget state "lastReceiptLine")]
               (str " last=" (.slice line 0 72)))]
    (str mode pending (or last ""))))

(defn set-status [ctx state]
  (let [ui (when (aget ctx "hasUI") (aget ctx "ui"))
        set-status-fn (and ui (aget ui "setStatus"))]
    (when set-status-fn
      (.call set-status-fn ui STATUS-KEY (if state (format-status state) "")))))

(defn make-result [text details]
  #js {:content #js [#js {:type "text" :text text}]
       :details details})

(defn log-event [ctx state action extra]
  (append-jsonl EVENTS-FILE
                (js/Object.assign #js {:ts (now-iso)
                                       :turn (aget state "currentTurn")
                                       :cwd (aget ctx "cwd")
                                       :sessionFile (let [sm (aget ctx "sessionManager")
                                                          get-session-file-fn (and sm (aget sm "getSessionFile"))]
                                                      (when get-session-file-fn
                                                        (.call get-session-file-fn sm)))
                                       :model (model-label ctx)
                                       :action action}
                                 extra)))

(defn build-memory-message [cwd]
  (let [file-path (str cwd "/receipts.log")]
    (when (.existsSync fs file-path)
      (let [lines (tail-lines file-path 3)]
        (when (pos? (.-length lines))
          (str "[RECEIPT RIVER MEMORY]\nRecent receipts in this workspace:\n"
               (.join (.map lines (fn [line] (str "- " line))) "\n")
               "\nTail receipts before major decisions; never edit past lines."))))))

(defn prune-context-messages [messages enabled]
  (let [kept-one (volatile! false)]
    (-> (js/Array.from messages)
        (.reverse)
        (.filter (fn [message]
                   (if (not= (aget message "customType") "receipt-river-context")
                     true
                     (if (not enabled)
                       false
                       (if @kept-one
                         false
                         (do (vreset! kept-one true) true))))))
        (.reverse))))

(defn mark-tool-usage [state tool-name args]
  (.push (aget state "turnToolNames") tool-name)
  (cond
    (= tool-name "receipt_river")
    (do (aset state "turnHadReceipt" true)
        (aset state "pendingReminder" false))

    (not (neg? (.indexOf SUBSTANTIVE-TOOLS tool-name)))
    (aset state "turnHadSubstantiveWork" true)

    (and (= tool-name "bash")
         (let [cmd (str (or (aget args "command") ""))]
           (re-find #"(?:git\s+(?:commit|push|merge|rebase|cherry-pick)|\b(?:test|pytest|jest|vitest|cargo test|cargo build|go test|npm test|pnpm test|pnpm build|yarn test|yarn build|make\b|just\b|docker build|docker compose up)\b)" cmd)))
    (aset state "turnHadSubstantiveWork" true)

    :else nil))

(defn ui-notify [ctx message level]
  (let [ui (when (aget ctx "hasUI") (aget ctx "ui"))
        notify-fn (and ui (aget ui "notify"))]
    (when notify-fn
      (.call notify-fn ui message level))))

(defn ui-set-widget [ctx key value]
  (let [ui (when (aget ctx "hasUI") (aget ctx "ui"))
        set-widget-fn (and ui (aget ui "setWidget"))]
    (when set-widget-fn
      (.call set-widget-fn ui key value))))

(defn handle-receipt-river-command [args ctx]
  (let [state (get-state)
        tokens (-> (str (or args ""))
                   (.trim)
                   (.split #"\s+")
                   (.filter (fn [x] x)))
        cmd (.toLowerCase (or (.at tokens 0) "status"))
        file-path (expand-path (aget ctx "cwd") "receipts.log")]
    (cond
      (= cmd "on")
      (do (aset state "enabled" true)
          (set-status ctx state)
          (ui-notify ctx "Receipt River enabled" "info"))

      (= cmd "off")
      (do (aset state "enabled" false)
          (set-status ctx state)
          (ui-notify ctx "Receipt River disabled" "info"))

      (= cmd "tail")
      (let [lines (clamp-int (.at tokens 1) 20 1 200)
            tail (tail-lines file-path lines)]
        (ui-set-widget ctx STATUS-KEY
                       (if (pos? (.-length tail)) tail #js ["- no receipts yet"])))

      (= cmd "validate")
      (let [lines (clamp-int (.at tokens 1) 200 1 2000)
            result (validate-receipt-file file-path lines)]
        (aset state "lastValidation" result)
        (set-status ctx state)
        (ui-set-widget ctx STATUS-KEY
                       (if (aget result "ok")
                         #js [(str "receipts ok: " (aget result "count") " line"
                                   (when (not= (aget result "count") 1) "s"))
                              (str "file: " file-path)]
                         (.concat
                          #js [(str "receipts invalid: " (.-length (aget result "failures")) " failure"
                                    (when (not= (.-length (aget result "failures")) 1) "s"))
                               (str "file: " file-path)]
                          (.map (.slice (aget result "failures") 0 10)
                                (fn [row]
                                  (str "- line " (aget row "lineNumber") ": "
                                       (.join (aget row "errors") "; "))))))))

      :else
      (ui-set-widget ctx STATUS-KEY
                     #js [(str "receipt-river: " (if (aget state "enabled") "enabled" "disabled"))
                          (str "file: " file-path)
                          (str "exists: " (if (.existsSync fs file-path) "yes" "no"))
                          (str "last: " (if (.existsSync fs file-path)
                                           (summarize-last-line file-path)
                                           "none"))]))))

(defn execute-receipt-river-tool [_toolCallId params _signal _onUpdate ctx]
  (let [state (get-state)
        file-path (expand-path (aget ctx "cwd") (aget params "path"))]
    (ensure-dir (path/dirname file-path))
    (cond
      (= (aget params "action") "status")
      (let [exists (.existsSync fs file-path)
            lines (if exists (read-lines file-path) #js [])
            result #js {:ok true
                        :exists exists
                        :file file-path
                        :count (.-length lines)
                        :last (.at lines -1)}]
        (log-event ctx state "status" result)
        (make-result (if exists
                       (str "receipts: " (.-length lines) " line"
                            (when (not= (.-length lines) 1) "s")
                            "\nlast: " (.at lines -1))
                       (str "receipts missing: " file-path))
                     result))

      (= (aget params "action") "tail")
      (let [lines (clamp-int (aget params "lines") 20 1 2000)
            tail (tail-lines file-path lines)]
        (log-event ctx state "tail" #js {:file file-path
                                          :lines lines
                                          :returned (.-length tail)})
        (make-result (if (pos? (.-length tail))
                       (.join tail "\n")
                       "- no receipts yet")
                     #js {:ok true
                          :file file-path
                          :requested lines
                          :returned (.-length tail)
                          :tail tail}))

      (= (aget params "action") "validate")
      (let [lines (clamp-int (aget params "lines") 200 1 2000)
            result (validate-receipt-file file-path lines)]
        (aset state "lastValidation" result)
        (log-event ctx state "validate" #js {:file file-path
                                             :ok (aget result "ok")
                                             :count (aget result "count")
                                             :failures (.-length (aget result "failures"))})
        (set-status ctx state)
        (make-result (if (aget result "ok")
                       (str "receipts valid: " (aget result "count") " line"
                            (when (not= (aget result "count") 1) "s"))
                       (.join (.map (.slice (aget result "failures") 0 20)
                                    (fn [row]
                                      (str "line " (aget row "lineNumber") ": "
                                           (.join (aget row "errors") "; "))))
                              "\n"))
                     result))

      :else
      (let [fallback-kind ":observation"
            record (build-record params fallback-kind)
            line (serialize-receipt record)]
        (.appendFileSync fs file-path line "utf8")
        (aset state "turnHadReceipt" true)
        (aset state "pendingReminder" false)
        (aset state "lastReceiptPath" file-path)
        (aset state "lastReceiptLine" (.trim line))
        (set-status ctx state)
        (log-event ctx state (aget params "action")
                   #js {:file file-path
                        :kind (aget record "kind")
                        :line (.trim line)})
        (make-result (str (if (= (aget params "action") "bootstrap")
                            "Bootstrapped"
                            "Appended")
                          " receipt at " file-path
                          "\n" (.trim line))
                     #js {:ok true
                          :file file-path
                          :record record
                           :line (.trim line)})))))

(em/defextension receipt-river
  :name "receipt-river"
  :description "Append-only receipts.log ledger for multi-step work."

  (em/command "receipt-river"
    :description "Show, toggle, tail, or validate Receipt River state (/receipt-river, /receipt-river on, /receipt-river off, /receipt-river tail [n], /receipt-river validate [n])"
    :handler handle-receipt-river-command)

  (em/tool "receipt_river"
    :label "Receipt River"
    :description "Maintain an append-only receipts.log ledger: bootstrap, tail, append, validate, and inspect receipt state."
    :parameters {:action {:type "string"
                          :enum ["status" "bootstrap" "append" "tail" "validate"]
                          :description "Receipt River action: status, bootstrap, append, tail, or validate."}
                 :path {:type "string" :description "Receipt file path; defaults to ./receipts.log" :optional true}
                 :kind {:type "string" :description "Receipt kind, e.g. :observation, :decision, :test-run, :build" :optional true}
                 :lines {:type "integer" :description "How many trailing lines to return or validate" :min 1 :max 2000 :optional true}
                 :origin {:type "string" :description "Receipt origin; default pi" :optional true}
                 :owner {:type "string" :description "Owner/protocol responsible for the receipt" :optional true}
                 :dod {:type "string" :description "Definition-of-done label" :optional true}
                 :pi {:type "string" :description "Pi version label" :optional true}
                 :host {:type "string" :description "Host label" :optional true}
                 :manifest {:type "string" :description "Manifest ref" :optional true}
                 :refs {:type "string" :description "Comma-separated refs such as paths, SHAs, report files" :optional true}
                 :note {:type "string" :description "Short note; never include secrets" :optional true}
                 :tests {:type "string" :description "Test summary for :test-run receipts" :optional true}
                 :decisions {:type "string" :description "Decision summary for :decision receipts" :optional true}
                 :drift {:type "string" :description "Drift summary for :drift receipts" :optional true}}
    :execute execute-receipt-river-tool)

  (em/on "session_start"
    :handler (fn [_event ctx]
               (let [state (get-state)]
                 (aset state "currentTurn" 0)
                 (aset state "turnToolNames" #js [])
                 (aset state "turnHadSubstantiveWork" false)
                 (aset state "turnHadReceipt" false)
                 (aset state "pendingReminder" false)
                 (aset state "lastReceiptPath" nil)
                 (aset state "lastReceiptLine" nil)
                 (aset state "lastValidation" nil)
                 (set-status ctx state))))

  (em/on "session_switch"
    :handler (fn [_event ctx]
               (let [state (get-state)]
                 (aset state "currentTurn" 0)
                 (aset state "turnToolNames" #js [])
                 (aset state "turnHadSubstantiveWork" false)
                 (aset state "turnHadReceipt" false)
                 (set-status ctx state))))

  (em/on "turn_start"
    :handler (fn [event ctx]
               (let [state (get-state)
                     turn-index (aget event "turnIndex")]
                 (aset state "currentTurn"
                       (if (number? turn-index)
                         turn-index
                         (inc (aget state "currentTurn"))))
                 (aset state "turnToolNames" #js [])
                 (aset state "turnHadSubstantiveWork" false)
                 (aset state "turnHadReceipt" false)
                 (set-status ctx state))))

  (em/on "message_end"
    :handler (fn [event ctx]
               (let [msg (aget event "message")]
                 (when (and msg (= (aget msg "role") "assistant"))
                   (let [state (get-state)
                         blocks (if (js/Array.isArray (aget msg "content"))
                                  (aget msg "content")
                                  #js [])]
                     (.forEach blocks
                               (fn [block]
                                 (when (= (aget block "type") "toolCall")
                                   (mark-tool-usage state
                                                    (str (or (aget block "name") ""))
                                                    (or (aget block "arguments") #js {})))))
                     (set-status ctx state))))))

  (em/on "agent_end"
    :handler (fn [_event ctx]
               (let [state (get-state)]
                 (when (aget state "enabled")
                   (when (and (aget state "turnHadSubstantiveWork")
                              (not (aget state "turnHadReceipt")))
                     (aset state "pendingReminder" true)
                     (ui-notify ctx
                                "receipt-river: substantive turn ended without a receipt_river call"
                                "warn")))
                 (set-status ctx state))))

  (em/on "context"
    :handler (fn [event]
               (let [state (get-state)]
                 #js {:messages (prune-context-messages (aget event "messages")
                                                        (aget state "enabled"))})))

  (em/on "before_agent_start"
    :handler (fn [event ctx]
               (let [state (get-state)]
                 (when (aget state "enabled")
                   (let [reminder (when (aget state "pendingReminder")
                                    "\nPrevious substantive work ended without a receipt. Compensate early in this turn if the work continues.")
                         memory-message (build-memory-message (aget ctx "cwd"))
                         system-prompt (str (aget event "systemPrompt")
                                            "\n\n[RECEIPT RIVER ACTIVE]\nFor substantive multi-step work in a writable workspace, use the receipt_river tool to maintain append-only receipts.log.\n- At the start of non-trivial work, call receipt_river action=\"bootstrap\" with kind=\":observation\" and a bounded note.\n- Before major decisions or when resuming prior work, call receipt_river action=\"tail\" lines=20.\n- After tests/builds, call receipt_river action=\"append\" with kind=\":test-run\" or kind=\":build\".\n- After commits/pushes/handoffs, call receipt_river action=\"append\" with kind=\":catalog\" or kind=\":push-truth\".\n- Never edit past lines. Never log secrets.\n- Skip this for tiny conversational turns or read-only tasks with no durable workspace effect."
                                            (or reminder ""))]
                     (if memory-message
                       #js {:systemPrompt system-prompt
                            :message #js {:customType "receipt-river-context"
                                          :content memory-message
                                          :display false}}
                       #js {:systemPrompt system-prompt}))))))

  (em/on "session_shutdown"
    :handler (fn [_event ctx]
               (set-status ctx nil))))
