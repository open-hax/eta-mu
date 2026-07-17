(ns open-hax.records.rest.graph-operations
  "REST API implementation of GraphOperations protocol."
  (:require [open-hax.openplanner-protocols :as protocols]
            [open-hax.records.rest.http :as http]))

(defrecord RestGraphOperations [base-url auth-token]
  protocols/GraphOperations
  (add-node [_ node]
    (http/http-post base-url "/graph/nodes" node auth-token))

  (add-edge [_ edge]
    (http/http-post base-url "/graph/edges" edge auth-token))

  (query-neighbors [_ node-id opts]
    (http/http-get base-url
                   (str "/graph/nodes/" node-id "/neighbors"
                        (when-let [params (clj->js opts)]
                          (str "?" (js/URLSearchParams. params))))
                   auth-token))

  (traverse [_ start opts]
    (http/http-get base-url
                   (str "/graph/traverse/" start
                        (when-let [params (clj->js opts)]
                          (str "?" (js/URLSearchParams. params))))
                   auth-token)))
