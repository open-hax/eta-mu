(ns eta-mu.contracts.output.extern.http
  "Raw HTTP boundary for the output contract package.
   No domain policy; only an OpenAI-compatible chat/completions wrapper over
   the native `fetch` API.")

(defn ^:async chat-completions
  "POST to `base-url`/chat/completions with `body` and optional `api-key`.
   Returns the parsed JSON response or throws on failure."
  [base-url api-key body]
  (let [headers #js {"content-type" "application/json"}
        _ (when api-key (.set headers "authorization" (str "Bearer " api-key)))
        url (str base-url "/chat/completions")
        response (await (js/fetch url
                                  #js {:method "POST"
                                       :headers headers
                                       :body (js/JSON.stringify (clj->js body))}))]
    (when-not (.-ok response)
      (let [body (await (.text response))]
        (throw (ex-info (str "LLM error " (.-status response) ": " body)
                        {:status (.-status response) :body body :url url}))))
    (js->clj (await (.json response)) :keywordize-keys true)))
