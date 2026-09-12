(ns open-hax.services.extern.api
  "Plain JavaScript boundary for the service protocols; callers receive data objects."
  (:require [open-hax.openplanner-protocols :as p]))

(def ^:private operations
  {"append-event!" p/append-event! "append-events!" p/append-events!
   "query-events" p/query-events "create-session" p/create-session
   "get-session" p/get-session "update-session" p/update-session
   "close-session" p/close-session "store-document" p/store-document
   "get-document" p/get-document "query-documents" p/query-documents
   "archive-document" p/archive-document "add-node" p/add-node
   "add-edge" p/add-edge "query-neighbors" p/query-neighbors "traverse" p/traverse
   "create-translation" p/create-translation "label-translation" p/label-translation
   "batch-translate" p/batch-translate "create-label" p/create-label
   "apply-label" p/apply-label "query-by-label" p/query-by-label
   "create-user" p/create-user "authenticate" p/authenticate
   "get-user" p/get-user "update-user" p/update-user "emit-to-room" p/emit-to-room})

(defn- decode [value] (js->clj value :keywordize-keys true))
(defn- encode [value]
  (clj->js value :keyword-fn #(subs (str %) 1)))

(def ^:private optional-arity
  {p/create-session 1 p/query-neighbors 2 p/traverse 2 p/query-by-label 2})

(def ^:private void-operations
  #{p/close-session p/archive-document p/apply-label p/emit-to-room})

(defn- optional-arguments [operation args]
  (let [args (vec args)]
    (if-let [arity (get optional-arity operation)]
      (cond
        (= (count args) (dec arity)) (conj args {})
        (and (= (count args) arity) (identical? js/undefined (peek args)))
        (assoc args (dec arity) {})
        :else args)
      args)))

(defn- ^:async invoke [service operation args]
  (let [args (mapv decode (optional-arguments operation args))
        args (if (and (#{p/query-neighbors p/traverse} operation)
                      (string? (get-in args [1 :direction])))
               (update-in args [1 :direction] keyword)
               args)
        result (await (apply operation service args))]
    ;; Promise<void> acknowledges completion without exposing a CLJS nil value.
    (if (contains? void-operations operation) js/undefined (encode result))))

(defn make-envelope [event-type payload]
  (encode (p/make-envelope event-type (decode payload))))

(defn wrap [service]
  (let [api (reduce-kv
             (fn [out name operation]
               (assoc out name (fn [& args] (invoke service operation args))))
             {} operations)]
    (encode
     (assoc api
            "watch-events"
            (fn [filter-spec callback]
              (encode (p/watch-events service (decode filter-spec) #(callback (encode %)))))
            "subscribe"
            (fn [room event-type callback]
              (encode (p/subscribe service room event-type #(callback (encode %)))))
            "unsubscribe"
            (fn [handle] (p/unsubscribe service (decode handle)))))))
