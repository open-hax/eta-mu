(ns eta-mu.extensions.opmf-contract-gate
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            [goog.object :as gobj]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            ["@workspace/output-contract-gate" :as gate]))

(def HOME (.homedir os))
(def STATE-DIR (path/join HOME ".pi" "agent" "state" "output-contract-gate"))
(def RUNS-DIR (path/join STATE-DIR "runs"))
(def VALIDATIONS-FILE (path/join STATE-DIR "validations.jsonl"))
(def CONFIG-FILE (path/join STATE-DIR "config.json"))
(def STATUS-KEY "output-gate")
(def GLOBAL-KEY "__eta_mu_output_contract_gate_state__")
(def REPAIR-SENTINEL "[[output-contract-gate repair ")
(def CONTRACT-MARKER "## Active Output Contract")
(def DEFAULT-CONTRACT
  (or (gobj/get js/process.env "PI_OUTPUT_CONTRACT_FILE")
      (path/join HOME
                 "devel"
                 "specs"
                 "drafts"
                 "contract-enforced-agent-output-pipeline.example.edn")))

(defn ensure-dir [dir]
  (.mkdirSync fs dir #js {:recursive true}))

(defn append-jsonl [file-path value]
  (ensure-dir (.dirname path file-path))
  (.appendFileSync fs file-path (str (.stringify js/JSON (clj->js value)) "\n") "utf8"))

(defn write-config [config]
  (ensure-dir STATE-DIR)
  (.writeFileSync fs CONFIG-FILE (str (.stringify js/JSON config nil 2) "\n") "utf8"))

(defn extract-text [content]
  (cond
    (string? content) content
    (array? content)
    (->> (js/Array.from content)
         (filter #(and (some? %) (= "text" (aget % "type")) (string? (aget % "text"))))
         (map #(aget % "text"))
         (str/join ""))
    :else ""))

(defn extract-messages [ctx]
  (->> (.call (aget (aget ctx "sessionManager") "getBranch") (aget ctx "sessionManager"))
       (js/Array.from)
       (filter #(and (= "message" (aget % "type")) (aget % "message")))
       (map #(aget % "message"))))

(defn last-message-by-role [ctx role]
  (last (filter #(= role (aget % "role")) (extract-messages ctx))))

(defn read-config []
  (try
    (if-not (.existsSync fs CONFIG-FILE)
      #js {:enabled true
           :autoRepair true
           :contractPath DEFAULT-CONTRACT
           :enableGptReview false
           :gptReviewModel "gpt-5.4"
           :maxSessionTurns 10}
      (let [parsed (.parse js/JSON (.readFileSync fs CONFIG-FILE "utf8"))]
        #js {:enabled (not= false (aget parsed "enabled"))
             :autoRepair (not= false (aget parsed "autoRepair"))
             :contractPath (if (and (string? (aget parsed "contractPath")) (not (str/blank? (aget parsed "contractPath"))))
                             (aget parsed "contractPath")
                             DEFAULT-CONTRACT)
             :enableGptReview (not= false (aget parsed "enableGptReview"))
             :gptReviewModel (or (aget parsed "gptReviewModel") "gpt-5.4")
             :gptReviewBaseUrl (aget parsed "gptReviewBaseUrl")
             :gptReviewApiKey (aget parsed "gptReviewApiKey")
             :maxSessionTurns (or (aget parsed "maxSessionTurns") 10)}))
    (catch :default _
      #js {:enabled true
           :autoRepair true
           :contractPath DEFAULT-CONTRACT
           :enableGptReview false
           :gptReviewModel "gpt-5.4"
           :maxSessionTurns 10})))

(defn get-state []
  (let [g js/globalThis]
    (if-let [state (aget g GLOBAL-KEY)]
      state
      (let [fresh #js {:config (read-config)
                       :contractCache nil
                       :lastResult nil
                       :contractError nil}]
        (aset g GLOBAL-KEY fresh)
        fresh))))

(defn load-contract [state]
  (let [contract-path (.resolve path (aget (aget state "config") "contractPath"))]
    (if-not (.existsSync fs contract-path)
      (js/Promise.reject (js/Error. (str "contract file not found: " contract-path)))
      (let [stat (.statSync fs contract-path)
            cache (aget state "contractCache")]
        (if (and cache
                 (= contract-path (aget cache "path"))
                 (= (aget stat "mtimeMs") (aget cache "mtimeMs")))
          (js/Promise.resolve cache)
          (let [source (.readFileSync fs contract-path "utf8")
                contract (gate/compileAgentOutputContract source)
                fresh #js {:path contract-path
                           :mtimeMs (aget stat "mtimeMs")
                           :source source
                           :contract contract}]
            (aset state "contractCache" fresh)
            (js/Promise.resolve fresh)))))))

(defn parse-repair-attempt [text]
  (when (and (string? text) (.startsWith text REPAIR-SENTINEL))
    (let [match (re-find #"^\[\[output-contract-gate repair (\d+)/(\d+)\]\]" text)]
      (when match
        {:attempt (js/parseInt (nth match 1))
         :max (js/parseInt (nth match 2))}))))

(defn build-repair-turn-message [repair-prompt attempt max-retries]
  (str "[[output-contract-gate repair " attempt "/" max-retries "]]\n"
       "Repair your last response to satisfy the active output contract.\n"
       "Preserve all passing content and return the full corrected Markdown response only.\n\n"
       repair-prompt))

(defn build-prompt-append [contract]
  (let [headings (->> (js/Array.from (aget contract "sections"))
                      (map #(aget % "heading"))
                      (str/join ", "))
        rules (js/Array.from (aget contract "rules"))
        next-rule (first (filter #(= "rule/next-exactly-one-action" (aget % "id")) rules))
        frames-rule (first (filter #(= "rule/frames-cardinality" (aget % "id")) rules))]
    (->> [(str "## Active Output Contract")
          (str "- Return Markdown with these exact level-2 headings in order: " headings)
          (when (some? (aget next-rule "exactly"))
            (str "- Next must contain exactly " (aget next-rule "exactly") " concrete next action."))
          (when (and (some? (aget frames-rule "min")) (some? (aget frames-rule "max")))
            (str "- Frames must contain " (aget frames-rule "min") "-" (aget frames-rule "max") " plausible interpretations."))
          "- If your response fails the structure gate, you will be asked to repair it."]
         (filter some?)
         (str/join "\n"))))

(defn inject-contract-prompt [system-prompt contract]
  (if (and (string? system-prompt)
           (not= -1 (.indexOf system-prompt CONTRACT-MARKER)))
    system-prompt
    (str system-prompt "\n\n" (build-prompt-append contract))))

(defn format-status [state]
  (if-let [err (aget state "contractError")]
    "gate:error"
    (let [mode (if (aget (aget state "config") "enabled") "on" "off")
          repair (if (aget (aget state "config") "autoRepair") "repair:on" "repair:off")
          last-result (aget state "lastResult")
          suffix (if last-result
                   (str " last:" (if (aget last-result "ok") "pass" "fail") "/" (or (aget last-result "failureCount") 0))
                   "")]
      (str "gate:" mode " " repair suffix))))

(defn set-status [ctx state]
  (when (aget ctx "hasUI")
    (.call (aget (aget ctx "ui") "setStatus")
           (aget ctx "ui")
           STATUS-KEY
           (format-status state))))

(defn notify [ctx message level]
  (when (aget ctx "hasUI")
    (.call (aget (aget ctx "ui") "notify")
           (aget ctx "ui")
           message
           level)))

(defn sender-for [pi ctx state]
  (or (aget ctx "pi")
      (aget state "pi")
      (when (aget pi "sendUserMessage") pi)))

(defn validate-latest-assistant [ctx state]
  (-> (load-contract state)
      (.then
       (fn [cached]
         (let [assistant (last-message-by-role ctx "assistant")
               user (last-message-by-role ctx "user")]
           (if-not assistant
             (js/Promise.resolve #js {:ok false :error "no assistant message found"})
             (let [assistant-text (extract-text (aget assistant "content"))]
               (if (str/blank? assistant-text)
                 (js/Promise.resolve #js {:ok false :error "assistant message has no text content"})
                 (let [document (gate/extractMarkdownSections assistant-text)
                       validation (gate/validateMarkdownResponse (aget cached "contract") assistant-text)
                       report (gate/toFailureReport (aget cached "contract") validation)
                       repair-prompt (when-not (aget validation "ok") (gate/compileRepairPrompt (aget cached "contract") validation))]
                   (-> (gate/writeRunArtifacts
                        #js {:artifactsRoot RUNS-DIR
                             :contractPath (aget cached "path")
                             :responsePath (str "session:"
                                                (or (when-let [sm (aget ctx "sessionManager")]
                                                      (let [getter (aget sm "getSessionFile")]
                                                        (when getter
                                                          (.call getter sm))))
                                                    "ephemeral")
                                                ":assistant:"
                                                (or (aget assistant "id") "unknown"))
                             :contractSource (aget cached "source")
                             :responseMarkdown assistant-text
                             :contract (aget cached "contract")
                             :document document
                             :report report
                             :repairPrompt repair-prompt
                             :exitCode (if (aget validation "ok") 0 1)})
                       (.then
                        (fn [bundle]
                          (let [repair-info (parse-repair-attempt (extract-text (aget user "content")))
                                summary #js {:ts (.toISOString (js/Date.))
                                             :ok (aget validation "ok")
                                             :failureCount (.-length (or (aget report "failures") #js []))
                                             :assistantMessageId (aget assistant "id")
                                             :userMessageId (aget user "id")
                                             :repairAttempt (or (:attempt repair-info) 0)
                                             :bundleDir (aget bundle "dir")
                                             :contract #js {:name (aget (aget cached "contract") "name")
                                                            :version (aget (aget cached "contract") "version")
                                                            :path (aget cached "path")}}]
                            (append-jsonl VALIDATIONS-FILE (js->clj summary :keywordize-keys true))
                            (aset state "lastResult" summary)
                            (aset state "contractError" nil)
                            #js {:ok (aget validation "ok")
                                 :report report
                                 :repairPrompt repair-prompt
                                 :repairInfo (clj->js repair-info)
                                 :assistant assistant
                                 :user user
                                 :contract (aget cached "contract")
                                 :bundle bundle})))))))))))))

(defn handle-validation-result [pi ctx state result]
  (set-status ctx state)
  (if (aget result "ok")
    (when-let [attempt (:attempt (js->clj (aget result "repairInfo") :keywordize-keys true))]
      (notify ctx
              (str "output-contract-gate repaired output in " attempt " attempt" (when (not= attempt 1) "s"))
              "success"))
    (let [repair-info (js->clj (aget result "repairInfo") :keywordize-keys true)
          current-attempt (or (:attempt repair-info) 0)
          max-retries (or (aget (aget result "contract") "repairMaxRetries") 0)]
      (if (and (aget (aget state "config") "autoRepair")
               (aget result "repairPrompt")
               (< current-attempt max-retries))
        (let [next-attempt (inc current-attempt)
              msg (build-repair-turn-message (aget result "repairPrompt") next-attempt max-retries)
              sender (sender-for pi ctx state)]
          (if sender
            (-> (.call (aget sender "sendUserMessage") sender msg)
                (.then (fn [_]
                         (notify ctx
                                 (str "output-contract-gate queued repair " next-attempt "/" max-retries)
                                 "warn"))))
            (notify ctx "output-contract-gate repair sender unavailable" "warn")))
        (notify ctx
                (str "output-contract-gate failed ("
                     (.-length (or (some-> result (aget "report") (aget "failures")) #js []))
                     " structural violations)")
                "warn")))))

(defn handle-agent-end-error [ctx state error]
  (aset state "contractError" (or (aget error "message") (str error)))
  (set-status ctx state)
  (notify ctx
          (str "output-contract-gate error: " (aget state "contractError"))
          "warn"))

(defn handle-agent-end [pi ctx]
  (let [state (get-state)]
    (if-not (aget (aget state "config") "enabled")
      (set-status ctx state)
      (-> (validate-latest-assistant ctx state)
          (.then (fn [result]
                   (handle-validation-result pi ctx state result)))
          (.catch (fn [error]
                    (handle-agent-end-error ctx state error)))))))

(defn handle-command [args ctx]
  (let [state (get-state)
        tokens (if (str/blank? args) [] (str/split (str/trim args) #"\s+"))
        cmd (or (first tokens) "status")]
    (cond
      (= cmd "status")
      (when (aget ctx "hasUI")
        (.call (aget (aget ctx "ui") "setWidget")
               (aget ctx "ui")
               "output-gate"
               #js [(str "enabled: " (aget (aget state "config") "enabled"))
                    (str "autoRepair: " (aget (aget state "config") "autoRepair"))
                    (str "contract: " (aget (aget state "config") "contractPath"))
                    (str "last ok: " (or (some-> (aget state "lastResult") (aget "ok")) "n/a"))]))

      (#{"on" "enable"} cmd)
      (do
        (aset (aget state "config") "enabled" true)
        (write-config (aget state "config"))
        (set-status ctx state)
        (notify ctx "output-contract-gate enabled" "success"))

      (#{"off" "disable"} cmd)
      (do
        (aset (aget state "config") "enabled" false)
        (write-config (aget state "config"))
        (set-status ctx state)
        (notify ctx "output-contract-gate disabled" "warn"))

      (= cmd "validate-last")
      (-> (validate-latest-assistant ctx state)
          (.then (fn [result]
                   (set-status ctx state)
                   (notify ctx
                           (str "validation ok: " (aget result "ok"))
                           (if (aget result "ok") "success" "warn")))))

      :else
      (notify ctx "Unknown /output-gate command. Use: status|on|off|validate-last" "warn"))))

(defn handle-session-start [pi ctx]
  (let [state (get-state)]
    (aset state "config" (read-config))
    (aset state "pi" (sender-for pi ctx state))
    (-> (load-contract state)
        (.then (fn [_]
                 (aset state "contractError" nil)
                 (set-status ctx state)))
        (.catch (fn [error]
                  (aset state "contractError" (or (aget error "message") (str error)))
                  (notify ctx (str "output-contract-gate: " (aget state "contractError")) "warn")
                  (set-status ctx state))))))

(defn handle-before-agent-start [event]
  (let [state (get-state)]
    (when (aget (aget state "config") "enabled")
      (-> (load-contract state)
          (.then (fn [cached]
                   (aset state "contractError" nil)
                   #js {:systemPrompt
                        (inject-contract-prompt (aget event "systemPrompt")
                                                (aget cached "contract"))}))
          (.catch (fn [error]
                    (aset state "contractError" (or (aget error "message") (str error)))))))))

(defn handle-session-shutdown [ctx]
  (when (aget ctx "hasUI")
    (.call (aget (aget ctx "ui") "setStatus")
           (aget ctx "ui")
           STATUS-KEY
           nil)))

(defn register-output-contract-gate! [pi]
  (.call (aget pi "registerCommand")
         pi
         "output-gate"
         #js {:description "Manage the output contract gate (status|on|off|validate-last)"
              :handler handle-command})
  (.call (aget pi "on") pi "session_start" (fn [_event ctx] (handle-session-start pi ctx)))
  (.call (aget pi "on") pi "before_agent_start" (fn [event _ctx] (handle-before-agent-start event)))
  (.call (aget pi "on") pi "agent_end" (fn [_event ctx] (handle-agent-end pi ctx)))
  (.call (aget pi "on") pi "session_shutdown" (fn [_event ctx] (handle-session-shutdown ctx))))

(em/defextension opmf-contract-gate
  :name "opmf-contract-gate"
  :description "Canonical output contract gate backed by @workspace/output-contract-gate"
  :init register-output-contract-gate!)
