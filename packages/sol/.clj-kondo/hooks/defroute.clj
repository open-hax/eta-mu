(ns hooks.defroute
  (:require [clj-kondo.hooks-api :as api]
            [clojure.string :as str]))

;; Teaches clj-kondo the shape of:
;;
;;   Classic mode:
;;     (defroute fn-name [extra-dep1 extra-dep2]
;;       "METHOD" "/path"
;;       body...)
;;
;;   Pre-handler mode:
;;     (defroute fn-name [extra-dep1 extra-dep2]
;;       "METHOD" "/path"
;;       [guard-fn1 guard-fn2]
;;       body...)
;;
;; The generated analysis node mirrors the macro's real async handler boundary.
;; Fastify request/reply values are host objects, not functions; they are modeled
;; as indexable arrays so `aget` paths type-check. `await` and injected
;; capabilities remain variadic functions.

(def ^:private deps-syms
  '[runtime config
    route! json-response! error-response! ensure-permission!
    with-request-context! clip-text send-fetch-response!
    bearer-headers fetch-json request-query-string
    session-guard optional-session-guard])

(def ^:private handler-syms
  '[request reply await])

(defn- any-fn-node []
  (api/list-node
   [(api/token-node 'fn)
    (api/vector-node [(api/token-node '&) (api/token-node '_)])
    (api/token-node nil)]))

(defn- host-object-node []
  ;; `aget` is the dominant operation in route bodies. An empty JS array gives
  ;; clj-kondo an indexable host value without claiming a domain map shape.
  (api/list-node [(api/token-node 'array)]))

(defn- async-handler-node
  [ctx-used? body-forms]
  (let [param (if ctx-used? 'ctx '_ctx)]
    (api/list-node
     (concat
      [(api/token-node (with-meta 'fn {:async true}))
       (api/vector-node [(api/token-node param)])]
      body-forms))))

(defn- atom-node []
  (api/list-node
   [(api/token-node 'atom)
    (api/vector-node [])]))

(defn- binding-value-node [sym]
  (cond
    (#{'request 'reply} sym) (host-object-node)
    (str/ends-with? (name sym) "*") (atom-node)
    :else (any-fn-node)))

(defn- collect-body-syms
  [nodes]
  (reduce (fn [acc node]
            (if (api/token-node? node)
              (let [v (try (api/sexpr node) (catch Exception _ nil))]
                (if (symbol? v) (conj acc v) acc))
              (into acc (collect-body-syms (or (:children node) [])))))
          #{}
          nodes))

(defn defroute [{:keys [node]}]
  (let [children          (:children node)
        fn-name           (nth children 1 nil)
        extra-vec         (nth children 2 nil)
        maybe-guards      (nth children 5 nil)
        pre-handler-mode? (and maybe-guards (api/vector-node? maybe-guards))
        body              (if pre-handler-mode?
                            (drop 6 children)
                            (drop 5 children))
        extra-syms        (when (api/vector-node? extra-vec)
                            (map api/sexpr (:children extra-vec)))
        effective-body    (if pre-handler-mode?
                            (cons maybe-guards body)
                            body)
        body-syms         (collect-body-syms effective-body)
        ctx-used?         (contains? body-syms 'ctx)
        needed-std-syms   (filter (fn [s] (contains? body-syms s))
                                  (concat deps-syms handler-syms))
        needed-extra-syms (filter (fn [s] (contains? body-syms s)) extra-syms)
        all-syms          (concat needed-std-syms needed-extra-syms)
        binding-vec       (api/vector-node
                           (mapcat (fn [sym]
                                     [(api/token-node sym)
                                      (binding-value-node sym)])
                                   all-syms))
        new-node          (api/list-node
                           [(api/token-node 'defn)
                            fn-name
                            (api/vector-node
                             (map api/token-node '[_app _runtime _config _deps]))
                            (api/list-node
                             [(api/token-node 'let)
                              binding-vec
                              (async-handler-node ctx-used? effective-body)])])]
    {:node new-node}))
