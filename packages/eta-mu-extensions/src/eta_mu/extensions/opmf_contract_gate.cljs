(ns eta-mu.extensions.opmf-contract-gate
  "Output contract gate enforcement with auto-repair.
   Pure CLJS implementation - no TypeScript dependencies."
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            [goog.object :as gobj]
            [eta-mu.contracts.core :as contracts]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(def HOME (.homedir os))
(def ETA-MU-STATE-ROOT (path/join HOME ".ημ" "state"))
(def LEGACY-STATE-ROOT (path/join HOME ".pi" "agent" "state"))

(defn resolve-state-dir [name]
  (let [eta-mu-dir (path/join ETA-MU-STATE-ROOT name)
        legacy-dir (path/join LEGACY-STATE-ROOT name)]
    (if (.existsSync fs eta-mu-dir)
      eta-mu-dir
      (if (.existsSync fs legacy-dir)
        legacy-dir
        eta-mu-dir))))

(def STATE-DIR (resolve-state-dir "output-contract-gate"))
(def RUNS-DIR (path/join STATE-DIR "runs"))
(def VALIDATIONS-FILE (path/join STATE-DIR "validations.jsonl"))
(def CONFIG-FILE (path/join STATE-DIR "config.json"))
(def STATUS-KEY "output-gate")
(def GLOBAL-KEY "__eta_mu_output_contract_gate_state__")
(def REPAIR-SENTINEL "[[eta-mu-opmf-contract-gate repair ")
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

(defn looks-like-agent-error? [text]
  "Returns true if the text appears to be an error message from the
   upstream provider or runtime rather than a real agent response."
  (and (string? text)
       (or (str/blank? text)
           (re-find #"^(Error|ERR)\s*:" text)
           (re-find #"^\d{3}\s" text)
           (re-find #"(?i)rate.?limit|quota.?exhaust|no upstream account|outstanding balance" text))))

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
                contract (contracts/compile-contract source)
                fresh #js {:path contract-path
                           :mtimeMs (aget stat "mtimeMs")
                           :source source
                           :contract contract}]
            (aset state "contractCache" fresh)
            (js/Promise.resolve fresh)))))))

(defn parse-repair-attempt [text]
  (when (and (string? text) (or (.startsWith text REPAIR-SENTINEL)
                                  (.startsWith text "[[output-contract-gate repair ")))
    (let [match (re-find #"^\[\[(?:eta-mu-opmf-)?output-contract-gate repair (\d+)/(\d+)\]\]" text)]
      (when match
        {:attempt (js/parseInt (nth match 1))
         :max (js/parseInt (nth match 2))}))))

(defn build-repair-turn-message [repair-prompt attempt max-retries original-user-prompt]
  (str "[[eta-mu-opmf-contract-gate repair " attempt "/" max-retries "]]\n"
       "Your work is not complete — the output contract was not satisfied.\n"
       "Continue your work, ensuring the response uses `## Section` level-2 markdown headers (not bold or emphasis).\n"
       (when-not (str/blank? original-user-prompt)
         (str "\nOriginal task: " original-user-prompt "\n"))
       "\nContract violations to fix:\n"
       repair-prompt "\n\n"
       "Return the full corrected Markdown response with `## Signal`, `## Evidence`, `## Frames`, `## Countermoves`, `## Next` as level-2 headers."))

(defn build-prompt-append [contract]
  (let [headings (->> (:sections contract)
                      (map :heading)
                      (str/join ", "))
        next-rule (first (filter #(= "rule/next-exactly-one-action" (:id %)) (:rules contract)))
        frames-rule (first (filter #(= "rule/frames-cardinality" (:id %)) (:rules contract)))]
    (->> [(str "## Active Output Contract")
          (str "- Return Markdown with these exact level-2 headings in order: " headings)
          "- Use `## Heading` level-2 markdown headers for each section. Do NOT use bold (`**Heading**`), emphasis, or deeper headings (`###`, `####`) in place of section headers."
          (when (some? (:exactly next-rule))
            (str "- Next must contain exactly " (:exactly next-rule) " concrete next action."))
          (when (and (some? (:min frames-rule)) (some? (:max frames-rule)))
            (str "- Frames must contain " (:min frames-rule) "-" (:max frames-rule) " plausible interpretations."))
          "- If your response fails the structure gate, you will be asked to continue your work until it passes."]
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

(defn write-run-artifacts
  "Write validation artifacts to disk."
  [opts]
  (let [artifacts-root (aget opts "artifactsRoot")
        contract-path (aget opts "contractPath")
        response-path (aget opts "responsePath")
        contract-source (aget opts "contractSource")
        response-markdown (aget opts "responseMarkdown")
        report (aget opts "report")
        repair-prompt (aget opts "repairPrompt")
        exit-code (aget opts "exitCode")
        ts (.toISOString (js/Date.))
        rand-str (.toString (js/Math.random))
        run-id (str ts "_" (subs rand-str 2 (min 8 (.-length rand-str))))
        run-dir (path/join artifacts-root run-id)]
    (ensure-dir run-dir)
    (.writeFileSync fs (path/join run-dir "contract.edn") contract-source "utf8")
    (.writeFileSync fs (path/join run-dir "response.md") response-markdown "utf8")
    (.writeFileSync fs (path/join run-dir "report.json") (.stringify js/JSON (clj->js report) nil 2) "utf8")
    (when repair-prompt
      (.writeFileSync fs (path/join run-dir "repair.txt") repair-prompt "utf8"))
    (.writeFileSync fs (path/join run-dir "meta.json")
                    (.stringify js/JSON #js {:ts ts
                                              :contractPath contract-path
                                              :responsePath response-path
                                              :exitCode exit-code} nil 2)
                    "utf8")
    #js {:dir run-dir :runId run-id}))

(defn validate-latest-assistant [ctx state]
  (.then (load-contract state)
    (fn [cached]
      (let [assistant (last-message-by-role ctx "assistant")
            user (last-message-by-role ctx "user")]
        (if-not assistant
          (js/Promise.resolve #js {:ok true :skip true :reason "no assistant message — agent likely ended with error"})
          (let [assistant-text (extract-text (aget assistant "content"))]
            (if (str/blank? assistant-text)
              (js/Promise.resolve #js {:ok true :skip true :reason "assistant message has no text content"})
              (if (looks-like-agent-error? assistant-text)
                (js/Promise.resolve #js {:ok true :skip true :reason "assistant message is an error, not a real response"})
                (let [contract (aget cached "contract")
                      validation (contracts/validate-markdown-response contract assistant-text)
                      report (contracts/to-failure-report contract validation)
                      repair-prompt (when-not (:ok validation) (contracts/compile-repair-prompt contract validation))]
                  (let [bundle (write-run-artifacts
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
                                      :report report
                                      :repairPrompt repair-prompt
                                      :exitCode (if (:ok validation) 0 1)})]
                    (let [repair-info (parse-repair-attempt (extract-text (aget user "content")))
                          summary #js {:ts (.toISOString (js/Date.))
                                       :ok (:ok validation)
                                       :failureCount (count (:failures validation))
                                       :assistantMessageId (aget assistant "id")
                                       :userMessageId (aget user "id")
                                       :repairAttempt (or (:attempt repair-info) 0)
                                       :bundleDir (aget bundle "dir")
                                       :contract #js {:name (:name contract)
                                                      :version (:version contract)
                                                      :path (aget cached "path")}}]
                      (append-jsonl VALIDATIONS-FILE (js->clj summary :keywordize-keys true))
                      (aset state "lastResult" summary)
                      (aset state "contractError" nil)
                      #js {:ok (:ok validation)
                           :report report
                           :repairPrompt repair-prompt
                           :repairInfo (clj->js repair-info)
                           :assistant assistant
                           :user user
                           :contract contract
                           :bundle bundle})))))))))))

(defn extract-original-user-prompt [ctx]
  (try
    (let [messages (extract-messages ctx)
          user-msgs (filter #(= "user" (aget % "role")) messages)]
      (reduce (fn [_ msg]
                (let [text (extract-text (aget msg "content"))]
                  (when (and (not (str/blank? text))
                             (not (.startsWith text REPAIR-SENTINEL))
                             (not (.includes text "eta-mu-opmf-contract-gate repair")))
                    (reduced (subs text 0 (min 500 (.-length text)))))))
              nil
              (reverse user-msgs)))
    (catch :default _ nil)))

(defn handle-validation-result [pi ctx state result]
  (set-status ctx state)
  (cond
    (aget result "skip")
    (notify ctx
            (str "output-contract-gate: skipped — "
                 (or (aget result "reason") "agent error or no response"))
            "info")

    (aget result "ok")
    (when-let [attempt (:attempt (js->clj (aget result "repairInfo") :keywordize-keys true))]
      (notify ctx
              (str "eta-mu-opmf-contract-gate repaired output in " attempt " attempt" (when (not= attempt 1) "s"))
              "success"))

    :else
    (let [repair-info (js->clj (aget result "repairInfo") :keywordize-keys true)
          current-attempt (or (:attempt repair-info) 0)
          max-retries (or (some-> result (aget "contract") :repair-max-retries) 0)
          assistant-msg (aget result "assistant")
          assistant-id (when assistant-msg (aget assistant-msg "id"))]
      (if (nil? assistant-msg)
        (notify ctx "eta-mu-opmf-contract-gate: skipping repair (no complete assistant message — likely user-initiated stop)" "info")
        (if (and (aget (aget state "config") "autoRepair")
                 (aget result "repairPrompt")
                 (< current-attempt max-retries))
          (let [next-attempt (inc current-attempt)
                original-prompt (extract-original-user-prompt ctx)
                msg (build-repair-turn-message (aget result "repairPrompt") next-attempt max-retries original-prompt)
                sender (sender-for pi ctx state)]
            (if sender
              (-> (.call (aget sender "sendUserMessage") sender msg)
                  (.then (fn [_]
                           (notify ctx
                                   (str "eta-mu-opmf-contract-gate queued repair " next-attempt "/" max-retries)
                                   "warn"))))
              (notify ctx "eta-mu-opmf-contract-gate repair sender unavailable" "warn")))
          (notify ctx
                  (str "eta-mu-opmf-contract-gate failed ("
                       (count (or (some-> result (aget "report") :failures) []))
                       " structural violations)")
                  "warn"))))))

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
  :description "Canonical output contract gate - pure CLJS implementation"
  :init register-output-contract-gate!)
