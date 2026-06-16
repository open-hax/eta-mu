(ns rheos.ui.law.url
  "URL law — the mapping between board filters and the location query string.
   Mirrors the backend's [[rheos.backend.law.fsm]] altitude: this is where the
   filters<->URL contract lives, isolated from the components that use it.")

(defn read-filters-from-url []
  (let [params (js/URLSearchParams. (.-search js/window.location))]
    (cond-> {}
      (.get params "domain") (assoc :domain (.get params "domain"))
      (.get params "org") (assoc :org (.get params "org"))
      (.get params "status") (assoc :status (.get params "status"))
      (.get params "priority") (assoc :priority (.get params "priority"))
      (.get params "q") (assoc :q (.get params "q")))))

(defn write-filters-to-url! [filters]
  (let [params (js/URLSearchParams.)]
    (doseq [[k v] filters]
      (when (and v (not= v ""))
        (.set params (name k) v)))
    (let [qs (str (.toString params))
          url (if (seq qs) (str "?" qs) (.-pathname js/window.location))]
      (.pushState js/history nil "" url))))
