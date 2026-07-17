(ns rheos.ui.infra.api
  "HTTP client for the kanban server — the frontend's I/O boundary.
   Components never call js/fetch directly; they go through these functions."
  (:require [clojure.string :as str]))

(defn ^:async fetch-json [url]
  (let [res (await (js/fetch url))
        data (await (.json res))]
    (js->clj data)))

(defn fetch-boards []
  (fetch-json "/api/boards"))

(defn fetch-compose [params]
  (let [entries (js/Object.entries (clj->js params))
        qs (->> (js->clj entries)
                (filter (fn [[_ v]] (and v (not= v ""))))
                (map (fn [[k v]] (str (name k) "=" (js/encodeURIComponent (str v)))))
                (str/join "&"))
        url (if (seq qs) (str "/api/board/compose?" qs) "/api/board/compose")]
    (fetch-json url)))

(defn fetch-task-content [task-uuid project-id]
  (fetch-json (str "/api/task/" task-uuid "/content?project=" project-id)))

(defn post-status
  "POST an FSM-enforced status change. Returns the raw fetch Promise<Response> so
   callers can branch on `.ok` (200) vs the FSM's 409 rejection body."
  [uuid project status]
  (js/fetch (str "/api/task/" (js/encodeURIComponent uuid)
                 "/status?project=" (js/encodeURIComponent (or project "")))
            #js {:method "POST"
                 :headers #js {"Content-Type" "application/json"}
                 :body (js/JSON.stringify #js {:status status})}))
