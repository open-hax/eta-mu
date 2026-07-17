(ns ^{:clj-kondo/ignore [:unresolved-symbol]} open-hax.sol.infra.routes.app
  (:require-macros [open-hax.sol.macros :refer [defroute]])
  (:require [clojure.string :as str]
            [open-hax.sol.domain.models :as models]
            [open-hax.sol.domain.time :refer [now-iso]]
            [open-hax.sol.infra.agent.policy :as agent-policy]
            [open-hax.sol.infra.agent.runtime :as agent-runtime]
            [open-hax.sol.infra.agent.service :as agent-service]
            [open-hax.sol.infra.agent.session-store :as session-store]
            [open-hax.sol.infra.agent.run-state :as run-state]
            [open-hax.sol.infra.http :refer [json-response! error-response! request-body]]
            [open-hax.sol.shape.agent :refer [streaming? current-turn]]
            [open-hax.sol.shape.app-shapes :refer [normalize-chat-body route!]]
            ["node:crypto" :as crypto]))

(defn- with-request-context!
  "No-op auth context for Sol. Passes nil ctx to the handler."
  [_runtime _request _reply handler]
  (handler nil))

(defn- ensure-session-id
  [provided]
  (or (some-> provided str str/trim not-empty)
      (.randomUUID crypto)))

(defn- active-agent-session
  [conversation-id]
  (agent-service/active-agent-session conversation-id))

(defn- runtime-processing-session?
  [conversation-id]
  (let [agent-session (active-agent-session conversation-id)
        active-streaming? (and agent-session (streaming? agent-session))
        active-turn? (and agent-session
                          (try
                            (some? (current-turn agent-session))
                            (catch js/Error _ false)))]
    (or active-streaming? active-turn?)))

(defn- session-status-running-response
  [session-id session runtime-active? can-send]
  {:session_id session-id
   :conversation_id (:conversation_id session)
   :run_id (:run_id session)
   :status (:status session)
   :has_active_stream (boolean (or (:has_active_stream session) runtime-active?))
   :can_send (:can-send can-send)
   :reason (:reason can-send)
   :model (:model session)
   :updated_at (:updated_at session)})

(def deps
  {:route! route!
   :json-response! json-response!
   :error-response! error-response!
   :ensure-permission! (fn [_ctx _perm] nil)
   :clip-text (fn ([text] text) ([text _limit] text))
   :with-request-context! with-request-context!
   :send-fetch-response! (fn [_reply _resp] nil)
   :bearer-headers (fn [token] {"Content-Type" "application/json"
                               "Authorization" (str "Bearer " token)})
   :fetch-json (fn [_url _opts] (js/Promise.resolve {:ok false :status 503 :body {}}))
   :request-query-string (fn [_request] "")
   :session-guard nil
   :optional-session-guard nil})

(defroute health! []
  "GET" "/health"
  (json-response! reply 200 {:status "ok"
                             :service "open-hax-sol-cljs"
                             :at (now-iso)}))

(defroute v1-models! []
  "GET" "/v1/models"
  (let [model-config (models/models-config config)]
    (json-response! reply 200 {:object "list"
                               :data (mapv                                               (fn [[provider-id _provider]]
                                             {:id (name provider-id)
                                              :object "model"
                                              :owned_by (name provider-id)
                                              :permission []
                                              :root (name provider-id)})
                                           (:providers model-config))})))

(defroute v1-chat-completions! []
  "POST" "/v1/chat/completions"
  (let [body (request-body request)
        stream? (boolean (:stream body))
        model (or (:model body) "glm-5")
        id (str "solchatcmpl-" (.randomUUID crypto))
        created (js/Math.floor (/ (.now js/Date) 1000))]
    (if stream?
      (json-response! reply 501 {:error {:message "Streaming chat completions not yet implemented in Sol"
                                         :type "not_implemented"
                                         :param nil
                                         :code "not_implemented"}})
      (try
        (let [messages (vec (or (:messages body) []))
              system-prompt (some->> messages
                                     (filter #(= "system" (:role %)))
                                     (map :content)
                                     (str/join "\n\n")
                                     str/trim
                                     not-empty)
              user-messages (filter #(= "user" (:role %)) messages)
              last-user (last user-messages)
              user-content (when last-user (:content last-user))
              user-text (cond
                          (string? user-content) user-content
                          (vector? user-content) (->> user-content
                                                      (filter #(= "text" (:type %)))
                                                      (map :text)
                                                      (str/join "\n\n"))
                          :else "")
              agent-spec (when system-prompt
                           {:system-prompt system-prompt})
              turn-result (await (agent-service/send-agent-turn!
                                  runtime config
                                  {:message user-text
                                   :model model
                                   :mode "direct"
                                   :agent-spec agent-spec}))
              answer (str (:answer turn-result))]
          (json-response! reply 200 {:id id
                                     :object "chat.completion"
                                     :created created
                                     :model (:model turn-result model)
                                     :choices [{:index 0
                                                :message {:role "assistant"
                                                          :content answer}
                                                :finish_reason "stop"}]
                                     :usage {:prompt_tokens 0
                                             :completion_tokens 0
                                             :total_tokens 0}}))
        (catch :default err
          (error-response! reply err 500))))))

;; ── Agent turn routes ────────────────────────────────────────────────
;; These mirror knoxx's /api/knoxx/* surface 1:1 — only the prefix differs
;; (/api/agent here vs /api/knoxx there). Each has a synchronous variant (runs
;; to completion, returns the turn result) and an async `…/start` variant
;; (queues a run, returns 202; reply tokens stream over /ws/stream).
;;
;; NOTE: in knoxx, /chat vs /direct selects RAG vs no-RAG. Sol has no retrieval
;; layer — RAG is not a harness concern here — so the chat/* and direct/* routes
;; are wire-compatible aliases that run the same plain turn. If retrieval is
;; added, it belongs in front of the turn (context injection / a tool), not as a
;; mode threaded through the agent loop.

(defn- async-start-response
  "knoxx-compatible accepted-response (both snake_case and camelCase keys)."
  [run-id conversation-id session-id model]
  {:ok true
   :queued true
   :run_id run-id
   :runId run-id
   :conversation_id conversation-id
   :conversationId conversation-id
   :session_id session-id
   :sessionId session-id
   :model model})

(defn- ^:async queue-agent-run!
  "Shared async-start handler: queue a run and reply 202."
  [runtime config reply request]
  (let [parsed (normalize-chat-body (request-body request))
        session-id (ensure-session-id (:session-id parsed))
        conversation-id (or (:conversation-id parsed) (.randomUUID crypto))
        run-id (or (:run-id parsed) (.randomUUID crypto))
        model (or (:model parsed) "gemma4:31b")
        body (assoc parsed
                    :session-id session-id
                    :conversation-id conversation-id
                    :run-id run-id)]
    (try
      (await (agent-policy/validate-chat-policy! nil model))
      (agent-service/spawn-direct! runtime config body)
      (json-response! reply 202 (async-start-response run-id conversation-id session-id model))
      (catch :default err
        (error-response! reply err 429)))))

(defn- ^:async run-agent-turn!
  "Shared synchronous handler: run a turn to completion and reply 200."
  [runtime config reply request]
  (let [parsed (normalize-chat-body (request-body request))
        model (or (:model parsed) "gemma4:31b")]
    (try
      (await (agent-policy/validate-chat-policy! nil model))
      (json-response! reply 200 (await (agent-service/send-agent-turn! runtime config parsed)))
      (catch :default err
        (error-response! reply err 502)))))

;; Async start. Mirrors knoxx POST /api/knoxx/chat/start and /api/knoxx/direct/start.
(defroute api-agent-chat-start! []
  "POST" "/api/agent/chat/start"
  (await (queue-agent-run! runtime config reply request)))

(defroute api-agent-direct-start! []
  "POST" "/api/agent/direct/start"
  (await (queue-agent-run! runtime config reply request)))

;; Synchronous turn. Mirrors knoxx POST /api/knoxx/chat and /api/knoxx/direct.
(defroute api-agent-chat! []
  "POST" "/api/agent/chat"
  (await (run-agent-turn! runtime config reply request)))

(defroute api-agent-direct! []
  "POST" "/api/agent/direct"
  (await (run-agent-turn! runtime config reply request)))

(defroute api-agent-session-status! []
  "GET" "/api/agent/sessions/:id"
  (let [session-id (or (aget request "params" "id") "")
        conversation-id (or (aget request "query" "conversation_id") "")]
    (if (str/blank? session-id)
      (json-response! reply 400 {:error "session id is required"})
      (try
        (let [session (await (session-store/session-get session-id))
              runtime-active? (runtime-processing-session? (or (:conversation_id session) conversation-id))
              can-send (session-store/session-can-send? session)]
          (if session
            (json-response! reply 200 (session-status-running-response session-id session runtime-active? can-send))
            (json-response! reply 200 {:session_id session-id
                                       :conversation_id conversation-id
                                       :status "not_found"
                                       :has_active_stream false
                                       :can_send true
                                       :reason "No session state found. Ready for new turn."})))
        (catch :default err
          (json-response! reply 500 {:error (str err)}))))))

(defroute api-agent-session-abort! []
  "POST" "/api/agent/sessions/:id/abort"
  (let [session-id (or (aget request "params" "id") "")
        raw (request-body request)
        reason (str (or (aget raw "reason") "operator_abort"))]
    (if (str/blank? session-id)
      (json-response! reply 400 {:error "session id is required"})
      (try
        (let [session (await (session-store/session-get session-id))
              conversation-id (or (:conversation_id session) "")]
          (when-not (str/blank? conversation-id)
            (agent-runtime/queue-agent-control! runtime config
                                                {:conversation-id conversation-id
                                                 :session-id session-id
                                                 :run-id (:run_id session)
                                                 :message "abort"
                                                 :kind "abort"
                                                 :metadata {:reason reason}}))
          (await (session-store/session-complete! session-id conversation-id
                                                  {:status "aborted"
                                                   :error reason
                                                   :has_active_stream false}))
          (json-response! reply 200 {:ok true
                                     :session_id session-id
                                     :conversation_id conversation-id
                                     :reason reason
                                     :marked_aborted true}))
        (catch :default err
          (error-response! reply err 409))))))

(defroute api-agent-run-get! []
  "GET" "/api/agent/run/:run_id"
  (let [run-id (or (aget request "params" "run_id") "")]
    (if (str/blank? run-id)
      (json-response! reply 400 {:error "run_id is required"})
      (try
        (let [run (await (run-state/run-get run-id))]
          (if run
            (json-response! reply 200 run)
            (json-response! reply 404 {:error "run not found" :run_id run-id})))
        (catch :default err
          (error-response! reply err 500))))))

(defroute api-agent-run-events! []
  "GET" "/api/agent/run/:run_id/events"
  (let [run-id (or (aget request "params" "run_id") "")]
    (if (str/blank? run-id)
      (json-response! reply 400 {:error "run_id is required"})
      (try
        (let [events (await (run-state/run-events run-id))]
          (json-response! reply 200 {:run_id run-id :events events}))
        (catch :default err
          (error-response! reply err 500))))))

(defn register-routes!
  [runtime app config]
  (health! app runtime config deps)
  (v1-models! app runtime config deps)
  (v1-chat-completions! app runtime config deps)
  (api-agent-chat! app runtime config deps)
  (api-agent-chat-start! app runtime config deps)
  (api-agent-direct! app runtime config deps)
  (api-agent-direct-start! app runtime config deps)
  (api-agent-session-status! app runtime config deps)
  (api-agent-session-abort! app runtime config deps)
  (api-agent-run-get! app runtime config deps)
  (api-agent-run-events! app runtime config deps))
