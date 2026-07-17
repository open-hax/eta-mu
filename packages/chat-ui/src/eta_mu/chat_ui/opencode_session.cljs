(ns eta-mu.chat-ui.opencode-session
  "IChatSession implementation backed by an OpenAI-compatible chat/completions endpoint.
   Defaults to Sol's opencode-compat surface at /v1/chat/completions."
  (:require [eta-mu.chat-ui.protocol :as proto]))

(defn- default-base-url []
  (or (when (exists? js/window)
        (some-> js/window .-location .-origin))
      "http://127.0.0.1:8001"))

(defn- ^:async post-chat-completions [base-url api-key body]
  (let [headers #js {"Content-Type" "application/json"}
        _ (when (seq api-key) (aset headers "Authorization" (str "Bearer " api-key)))
        res (await (js/fetch (str base-url "/v1/chat/completions")
                             #js {:method "POST"
                                  :headers headers
                                  :body (js/JSON.stringify (clj->js body))}))]
    (if (.-ok res)
      (js->clj (await (.json res)) :keywordize-keys true)
      (throw (js/Error. (str "HTTP " (.-status res) " " (.-statusText res) ": " (pr-str (await (.json res)))))))))

(defn- notify [listeners ev]
  (doseq [f @listeners] (f ev)))

(defn- ^:async emit-chunks! [listeners text chunk-delay-ms aborted]
  (let [chars (if (seq text) (vec text) [""])]
    (loop [i 0]
      (when (and (< i (count chars)) (not @aborted))
        (notify listeners {:type "token" :text (str (get chars i)) :id (str (random-uuid))})
        (when (pos? chunk-delay-ms)
          (await (js/Promise. (fn [resolve _] (js/setTimeout resolve chunk-delay-ms)))))
        (recur (inc i))))))

(defn- ^:async send-message! [config state listeners text]
  (let [messages (conj (:messages @state) {:role "user" :content text})
        body (cond-> {:model (:model config)
                      :messages messages
                      :stream false}
               (:max-tokens config) (assoc :max_tokens (:max-tokens config))
               (:temperature config) (assoc :temperature (:temperature config)))
        data (await (post-chat-completions (:base-url config) (:api-key config) body))
        content (some-> data :choices first :message :content)]
    (swap! state assoc :messages messages)
    (when (seq content)
      (await (emit-chunks! listeners content (:chunk-delay-ms config) (:aborted state))))
    (when-not @(:aborted state)
      (swap! state update :messages conj {:role "assistant" :content content})
      (notify listeners {:type "done"}))
    {:ok true}))

(defn create-opencode-session
  "Create an OpenAI-compatible chat session.
   Options:
     :base-url       - HTTP origin (default: window.location.origin or http://127.0.0.1:8001)
     :api-key        - Authorization Bearer token (optional)
     :model          - model id (default: glm-5)
     :max-tokens     - optional max_tokens
     :temperature    - optional temperature
     :chunk-delay-ms - ms between simulated stream tokens (default: 15)"
  ([] (create-opencode-session {}))
  ([opts]
   (let [base-url (or (:base-url opts) (default-base-url))
         config {:base-url base-url
                 :api-key (or (:api-key opts) "")
                 :model (or (:model opts) "glm-5")
                 :max-tokens (:max-tokens opts)
                 :temperature (:temperature opts)
                 :chunk-delay-ms (or (:chunk-delay-ms opts) 15)}
         state (atom {:messages [] :aborted false})
         listeners (atom [])]
     (reify proto/IChatSession
       (send-message [_ text]
         (swap! state assoc :aborted false)
         (send-message! config state listeners text))
       (subscribe [_ callback]
         (swap! listeners conj callback)
         (fn [] (swap! listeners (fn [ls] (filterv #(not= % callback) ls)))))
       (abort [_]
         (swap! state assoc :aborted true))
       (history [_]
         (js/Promise.resolve (:messages @state)))
       (close [_]
         (swap! state assoc :aborted true)
         (reset! listeners []))))))