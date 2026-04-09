(ns eta-mu.extensions.websearch-open-hax
  "Web search via Open Hax proxy service.

  Migrated from: ~/.pi/agent/extensions/websearch-open-hax.ts"
  (:require-macros [eta-mu.core :as em])
  (:require [clojure.string :as str]
            ["node:fs/promises" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]))

(def DEFAULT-PROXY-URL "http://127.0.0.1:8789")
(def DEFAULT-MODEL "openai/gpt-5.3-codex")

(defn proxy-url []
  (or (aget js/process.env "OPEN_HAX_OPENAI_PROXY_URL")
      (aget js/process.env "OPEN_HAX_PROXY_URL")
      DEFAULT-PROXY-URL))

(defn proxy-token []
  (or (aget js/process.env "OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN")
      (aget js/process.env "PROXY_AUTH_TOKEN")))

(defn write-temp [text]
  (let [dir (path/join (os/tmpdir) "pi-websearch")]
    (-> (fs/mkdir dir #js {:recursive true})
        (.then (fn []
                 (let [file (path/join dir (str "websearch-" (js/Date.now) ".md"))]
                   (-> (fs/writeFile file text "utf-8")
                       (.then (fn [] file)))))))))

(defn format-sources [sources]
  (when (and (array? sources) (pos? (alength sources)))
    (str "\n\nSources:\n"
         (->> (js/Array.from sources)
              (filter #(and % (string? (aget % "url"))))
              (map #(if-let [title (aget % "title")]
                      (str "- [" title "](" (aget % "url") ")")
                      (str "- " (aget % "url"))))
              (str/join "\n")))))

(em/defextension websearch-open-hax
  :name "websearch-open-hax"
  :description "Search the web via Open Hax proxy (OAuth-backed)"

  (em/tool "websearch"
    :label "Web Search (Open Hax)"
    :description "Search the web via services/open-hax-openai-proxy using stored OpenAI OAuth logins (no OPENAI_API_KEY needed)."
    :parameters {:query {:type "string" :description "Web search query"}
                 :numResults {:type "integer" :minimum 1 :maximum 20 :description "How many results to return (default: 8)" :optional true}
                 :searchContextSize {:type "string" :enum ["low" "medium" "high"] :description "Search context size (default: medium)" :optional true}
                 :allowedDomains {:type "array" :items {:type "string"} :description "Optional allow-list of domains" :optional true}
                 :model {:type "string" :description "Model ID to use" :optional true}}
    :execute (fn [_tcid params signal onUpdate ctx]
               (let [token (proxy-token)]
                 (if-not token
                   (js/Promise.reject (js/Error. "Missing auth token for Open Hax proxy. Set OPEN_HAX_OPENAI_PROXY_AUTH_TOKEN (or PROXY_AUTH_TOKEN)."))
                   (let [endpoint (str (.replace (proxy-url) #"/+$" "") "/api/tools/websearch")
                         model (or (aget params "model")
                                   (aget js/process.env "OPEN_HAX_WEBSEARCH_MODEL")
                                   DEFAULT-MODEL)]
                     (when onUpdate
                       (onUpdate #js {:content #js [#js {:type "text" :text (str "Calling Open Hax websearch... (" endpoint ")")}]}))
                     (-> (js/fetch endpoint
                                   #js {:method "POST"
                                        :headers #js {"Authorization" (str "Bearer " token)
                                                      "Content-Type" "application/json"}
                                        :body (js/JSON.stringify #js {:query (aget params "query")
                                                                      :numResults (aget params "numResults")
                                                                      :searchContextSize (aget params "searchContextSize")
                                                                      :allowedDomains (aget params "allowedDomains")
                                                                      :model model})
                                        :signal signal})
                         (.then (fn [resp]
                                  (-> (.text resp)
                                      (.then (fn [raw]
                                               (let [json (js/JSON.parse raw)
                                                     text (if (string? (aget json "output")) (aget json "output") "")
                                                     sources (if (array? (aget json "sources")) (aget json "sources") #js [])
                                                     combined (str text (or (format-sources sources) ""))]
                                                 (if (.-ok resp)
                                                   (let [truncated (if (> (count combined) 32000)
                                                                     (subs combined 0 32000)
                                                                     combined)]
                                                     #js {:content #js [#js {:type "text" :text truncated}]
                                                          :details #js {:backend "open-hax-openai-proxy"
                                                                        :endpoint endpoint
                                                                        :model model
                                                                        :sourcesCount (alength sources)}})
                                                   (js/Promise.reject
                                                     (js/Error. (str "Open Hax websearch error (" (.-status resp) "): " (subs raw 0 2000))))))))))))))))
  ))
