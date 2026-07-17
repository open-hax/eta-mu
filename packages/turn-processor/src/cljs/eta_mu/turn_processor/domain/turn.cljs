(ns eta-mu.turn-processor.domain.turn
  "Pure decisions for a single agent turn.

  This namespace knows nothing about streaming, LLM calls, or tool execution.
  It decides what to do next given the current context and shapes tool results.")

(defn tool-calls-in-message
  "Return the tool-call content blocks from an assistant message, or []."
  [assistant-message]
  (when (= (:role assistant-message) :assistant)
    (filterv #(= (:type %) :tool-call) (:content assistant-message))))

(defn tool-by-name
  "Find a tool by name in the tools vector, or nil if not found."
  [tools name]
  (some #(when (= (:name %) name) %) tools))

(defn execution-mode
  "Return :sequential or :parallel for a set of tool calls and tools.

  If the config requests sequential, or any tool's execution-mode is
  :sequential, return :sequential. Otherwise :parallel."
  [tool-calls tools config-mode]
  (if (or (= config-mode :sequential)
          (some (fn [tc]
                  (when-let [tool (tool-by-name tools (:name tc))]
                    (= (:execution-mode tool) :sequential)))
                tool-calls))
    :sequential
    :parallel))

(defn missing-tool-result
  "Build a tool result map for a tool that is not registered."
  [tool-call]
  {:tool-call tool-call
   :result {:content [{:type :text
                       :text (str "Tool " (:name tool-call) " not found")}]
            :details {}}
   :is-error true})

(defn- merge-after-tool-call
  "Apply an afterToolCall override map to a result."
  [result override]
  (cond-> result
    (contains? override :content) (assoc :content (:content override))
    (contains? override :details) (assoc :details (:details override))
    (contains? override :terminate) (assoc :terminate (:terminate override))
    (contains? override :is-error) (assoc :is-error (:is-error override))))

(defn finalize-tool-result
  "Finalize an executed tool result.

  Accepts an optional after-tool-call hook (a pure function from context to
  override map). Returns a finalized result map with :tool-call, :result, and
  :is-error."
  [executed tool-call context after-tool-call]
  (let [base {:tool-call tool-call
              :result (:result executed)
              :is-error (:is-error executed)}]
    (if after-tool-call
      (try
        (let [override (after-tool-call context base)]
          (if override
            (assoc base :result (merge-after-tool-call (:result base) override)
                   :is-error (or (:is-error override) (:is-error base)))
            base))
        (catch :default e
          (assoc base :result {:content [{:type :text
                                          :text (str "afterToolCall error: " (.-message e))}]
                               :details {}}
                 :is-error true)))
      base)))

(defn build-tool-result-message
  "Create a tool-result message from a finalized tool result."
  [{:keys [tool-call result is-error]}]
  {:role :tool-result
   :tool-call-id (:id tool-call)
   :tool-name (:name tool-call)
   :content (:content result)
   :details (:details result)
   :is-error is-error
   :timestamp (.now js/Date)})

(defn should-terminate-batch
  "True if every finalized result has :terminate true."
  [finalized-results]
  (and (seq finalized-results)
       (every? #(= true (get-in % [:result :terminate])) finalized-results)))

(defn next-action
  "Given an agent context, decide the next pure action.

  Returns one of:
    {:action :stream}                         — context is ready for an LLM call.
    {:action :execute-tools :tool-calls [...]} — last assistant message has tool calls.
    {:action :stop}                           — context ends with an assistant that has no tool calls."
  [context]
  (let [messages (:messages context)
        last-message (last messages)]
    (cond
      (nil? last-message)
      {:action :stop}

      (= (:role last-message) :assistant)
      (let [tcs (tool-calls-in-message last-message)]
        (if (seq tcs)
          {:action :execute-tools :tool-calls tcs}
          {:action :stop}))

      :else
      {:action :stream})))
