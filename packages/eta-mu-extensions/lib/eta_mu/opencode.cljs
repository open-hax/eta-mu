(ns eta-mu.opencode
  "Runtime helpers for building OpenCode plugins from eta-mu extension specs.

  Used by opencode build wrappers to convert pi-style specs to OpenCode's
  modern plugin API without giant TypeScript adapters.  The adapter exposes
  both tools and prompt/event hooks: pi's before_agent_start/context/agent_end
  lifecycle is translated onto OpenCode's chat system/messages/text hooks."
  (:require [clojure.string :as str]))

;; ── Zod schema helpers ─────────────────────────────────────────────────────

(defn- ->zod [z schema]
  "Convert a JSON Schema map to a Zod schema object at runtime."
  (let [type* (aget schema "type")
        enum* (aget schema "enum")
        desc* (aget schema "description")
        min* (aget schema "min")
        max* (aget schema "max")]
    (cond
      (and enum* (pos? (alength enum*)))
      (let [base (.apply (.-enum z) z enum*)]
        (if desc* (.describe base desc*) base))

      (= type* "string")
      (let [base (.string z)]
        (if desc* (.describe base desc*) base))

      (= type* "number")
      (let [base (.number z)]
        (if desc* (.describe base desc*) base))

      (= type* "integer")
      (let [base (.number z)]
        (if desc* (.describe base desc*) base))

      (= type* "boolean")
      (let [base (.boolean z)]
        (if desc* (.describe base desc*) base))

      (= type* "array")
      (let [base (.array z (.any z))]
        (if desc* (.describe base desc*) base))

      :else
      (let [base (.any z)]
        (if desc* (.describe base desc*) base)))))

(defn- build-args-schema [z params]
  "Build an OpenCode tool args shape from eta-mu parameter specs.
   @opencode-ai/plugin/tool expects a raw Zod shape object, not z.object(...)."
  (let [shape (js-obj)]
    (doseq [[k spec] params]
      (let [field (->zod z (clj->js (dissoc spec :optional)))]
        (aset shape (name k) (if (:optional spec) (.optional field) field))))
    shape))

;; ── Context adaptation ─────────────────────────────────────────────────────

(defn- adapt-ctx [ctx]
  "Convert OpenCode hook/tool context to pi-style context."
  (let [dir (or (aget ctx "directory") (aget ctx "cwd") (js/process.cwd))]
    #js {:cwd dir
         :directory dir
         :worktree (aget ctx "worktree")
         :sessionID (aget ctx "sessionID")
         :messageID (aget ctx "messageID")
         :agent (aget ctx "agent")
         :hasUI false
         :ui nil
         :model (aget ctx "model")
         :sessionManager (aget ctx "sessionManager")
         :metadata (fn [])}))

(defn- hook-ctx [input hook-input]
  (let [dir (or (aget input "directory") (js/process.cwd))]
    #js {:cwd dir
         :directory dir
         :worktree (or (aget input "worktree") dir)
         :sessionID (aget hook-input "sessionID")
         :messageID (aget hook-input "messageID")
         :agent (aget hook-input "agent")
         :model (aget hook-input "model")
         :sessionManager nil}))

;; ── Async helpers ──────────────────────────────────────────────────────────

(defn- promise-like? [x]
  (and x (fn? (aget x "then"))))

(defn- ->promise [x]
  (if (promise-like? x)
    x
    (js/Promise.resolve x)))

(defn- run-handlers
  "Run pi event handlers in order, threading accumulator state through async
  return values. step returns the next accumulator."
  [handlers initial step]
  (reduce (fn [p handler]
            (.then p (fn [acc]
                       (->promise (step acc handler)))))
          (js/Promise.resolve initial)
          handlers))

(defn- event-handlers [events event-name]
  (->> events
       (filter #(= event-name (:event %)))
       (map :handler)
       vec))

(defn- output-system-string [output]
  (let [system (aget output "system")]
    (cond
      (array? system) (str/join "\n\n" (array-seq system))
      (string? system) system
      :else "")))

(defn- set-output-system! [output system-prompt]
  (aset output "system" #js [system-prompt]))

;; ── Plugin builders ────────────────────────────────────────────────────────

(defn build-tool [tool-helper spec]
  "Create an OpenCode tool definition from an eta-mu tool spec."
  (let [z (.-schema tool-helper)
        params (:parameters spec)
        exec (:execute spec)]
    (tool-helper
      #js {:description (or (:description spec) (:label spec) (:name spec))
           :args (build-args-schema z params)
           :execute (fn [args ctx]
                      (exec nil args (aget ctx "abort") nil (adapt-ctx ctx)))})))

(defn build-event-handler [events]
  "Create a generic OpenCode event handler from eta-mu event specs.
  This preserves direct OpenCode SDK events while dedicated hook translators
  below handle pi lifecycle events with return-value propagation."
  (fn [ev]
    (let [event-type (.. ev -event -type)
          handlers (event-handlers events event-type)]
      (when (seq handlers)
        (doseq [handler handlers]
          (handler (.. ev -event) #js {}))))))

(defn- build-system-transform-hook [input events]
  (let [turn-start-handlers (event-handlers events "turn_start")
        before-handlers (event-handlers events "before_agent_start")]
    (when (or (seq turn-start-handlers) (seq before-handlers))
      (fn [hook-input output]
        (let [ctx (hook-ctx input hook-input)
              pi-ctx (adapt-ctx ctx)
              start-event #js {:turnIndex nil
                               :sessionID (aget hook-input "sessionID")
                               :model (aget hook-input "model")}
              before-event (fn [system-prompt]
                             #js {:systemPrompt system-prompt
                                  :sessionID (aget hook-input "sessionID")
                                  :model (aget hook-input "model")})]
          (-> (run-handlers turn-start-handlers nil
                            (fn [_ handler]
                              (handler start-event pi-ctx)
                              nil))
              (.then (fn [_]
                       (run-handlers before-handlers (output-system-string output)
                                     (fn [system-prompt handler]
                                       ;; Keep return-value propagation local to the handler while
                                       ;; allowing nil/no-op handlers.
                                       (.then (->promise (handler (before-event system-prompt) pi-ctx))
                                              (fn [result]
                                                (or (when result
                                                      (aget result "systemPrompt"))
                                                    system-prompt)))))))
              (.then (fn [system-prompt]
                       (set-output-system! output system-prompt)))))))))

(defn- build-messages-transform-hook [input events]
  (let [handlers (event-handlers events "context")]
    (when (seq handlers)
      (fn [_hook-input output]
        (let [ctx (hook-ctx input #js {})
              pi-ctx (adapt-ctx ctx)]
          (.then (run-handlers handlers (aget output "messages")
                               (fn [messages handler]
                                 (.then (->promise (handler #js {:messages messages} pi-ctx))
                                        (fn [result]
                                          (or (when result
                                                (aget result "messages"))
                                              messages)))))
                 (fn [messages]
                   (aset output "messages" messages))))))))

(defn- build-tool-before-hook [input events]
  (let [handlers (event-handlers events "message_end")]
    (when (seq handlers)
      (fn [hook-input output]
        (let [ctx (hook-ctx input hook-input)
              pi-ctx (adapt-ctx ctx)
              event #js {:message #js {:role "assistant"
                                       :content #js [#js {:type "toolCall"
                                                          :name (aget hook-input "tool")
                                                          :arguments (aget output "args")}]} }]
          (run-handlers handlers nil
                        (fn [_ handler]
                          (handler event pi-ctx)
                          nil)))))))

(defn- build-text-complete-hook [input events]
  (let [handlers (event-handlers events "agent_end")]
    (when (seq handlers)
      (fn [hook-input output]
        (let [ctx (hook-ctx input hook-input)
              pi-ctx (adapt-ctx ctx)
              event #js {:text (aget output "text")
                         :sessionID (aget hook-input "sessionID")
                         :messageID (aget hook-input "messageID")
                         :partID (aget hook-input "partID")}]
          (run-handlers handlers nil
                        (fn [_ handler]
                          (handler event pi-ctx)
                          nil)))))))

(defn build-plugin [spec tool-helper]
  "Build an OpenCode plugin function from an eta-mu extension spec.

  Returns: async (input, options) => Hooks"
  (let [tools (:tools spec)
        events (:events spec)
        tool-map (reduce (fn [acc tool]
                           (aset acc (:name tool) (build-tool tool-helper tool))
                           acc)
                         #js {} tools)]
    (fn [input _options]
      (let [hooks #js {}
            system-transform (build-system-transform-hook input events)
            messages-transform (build-messages-transform-hook input events)
            tool-before (build-tool-before-hook input events)
            text-complete (build-text-complete-hook input events)]
        (when (seq tools)
          (aset hooks "tool" tool-map))
        (when (seq events)
          (aset hooks "event" (build-event-handler events)))
        (when system-transform
          (aset hooks "experimental.chat.system.transform" system-transform))
        (when messages-transform
          (aset hooks "experimental.chat.messages.transform" messages-transform))
        (when tool-before
          (aset hooks "tool.execute.before" tool-before))
        (when text-complete
          (aset hooks "experimental.text.complete" text-complete))
        (js/Promise.resolve hooks)))))

(defn ^:export makePlugin [spec-js tool-helper]
  "Entry point for thin .mjs wrappers."
  (build-plugin (js->clj spec-js :keywordize-keys true) tool-helper))
