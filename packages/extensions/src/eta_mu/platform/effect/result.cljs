(ns eta-mu.platform.effect.result
  "Result algebra for ημ effects.

  Every boundary crossing, capability invocation, and effect produces a value
  in this algebra. Domain code is never exposed to host exceptions or Promise
  rejections directly.")

(defn ok
  "Construct an `:ok` result. Optional `meta` is a map of trace/effect metadata."
  ([value] {:ημ/result :ok :ημ/value value})
  ([value meta] {:ημ/result :ok :ημ/value value :ημ/meta meta}))

(defn rejected
  "Construct a `:rejected` result. A rejection is a policy or contract decision
  that the operation is not allowed."
  ([kind] (rejected kind nil))
  ([kind reason]
   {:ημ/result :rejected
    :ημ/error  {:kind kind :reason reason}}))

(defn failed
  "Construct a `:failed` result. A failure is an unexpected runtime error that
  may include retry or operational metadata."
  ([kind] (failed kind nil))
  ([kind reason & {:as opts}]
   {:ημ/result :failed
    :ημ/error  (merge {:kind kind :reason reason} opts)}))

(defn result?
  "Return true if `x` is a valid ημ result."
  [x]
  (and (map? x)
       (contains? #{:ok :rejected :failed} (:ημ/result x))))

(defn ok? [x] (= :ok (:ημ/result x)))
(defn rejected? [x] (= :rejected (:ημ/result x)))
(defn failed? [x] (= :failed (:ημ/result x)))

(defn value
  "Return the value of an `:ok` result, nil otherwise."
  [x]
  (:ημ/value x))

(defn error
  "Return the error map of a `:rejected` or `:failed` result, nil otherwise."
  [x]
  (:ημ/error x))

(defn kind
  "Return the error kind of a non-ok result, nil otherwise."
  [x]
  (get-in x [:ημ/error :kind]))
