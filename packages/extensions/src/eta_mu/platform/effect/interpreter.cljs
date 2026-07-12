(ns eta-mu.platform.effect.interpreter
  "Execute ημ effect plans against an injected capability map.

  Capability handlers return either a direct result or a `:plan` description.
  The interpreter resolves plan effects through the capability map, which is the
  only place that may touch asynchronous host operations."
  (:require
   [eta-mu.platform.effect.result :as r]))

(defn ^:async execute-effect!
  "Execute a single effect by looking up its `:effect/id` in `capabilities` and
  awaiting the capability function. Returns a result value."
  [capabilities effect]
  (if-let [cap (get capabilities (:effect/id effect))]
    (try
      (let [result (await (cap (:effect/input effect)))]
        (if (r/result? result)
          result
          (r/ok result)))
      (catch :default cause
        (r/failed :effect/execution-failed (ex-message cause)
                  :cause (ex-message cause)
                  :retryable? true)))
    (r/failed :effect/unknown-capability
              (str "No capability registered for effect " (:effect/id effect)))))

(defn ^:async run-plan!
  "Execute every effect in a plan, stopping on the first non-ok result.
  Returns the last effect's value."
  [capabilities plan]
  (loop [effects (seq (:ημ/effects plan))
         acc []]
    (if (seq effects)
      (let [result (await (execute-effect! capabilities (first effects)))]
        (if (r/ok? result)
          (recur (rest effects) (conj acc (r/value result)))
          result))
      (r/ok (peek acc)))))

(defn ^:async run-output!
  "Run a capability handler output. If it is a plan, execute its effects;
  otherwise return it directly."
  [capabilities output]
  (cond
    (= :plan (:ημ/result output)) (run-plan! capabilities output)
    (r/result? output) output
    :else (r/ok output)))
