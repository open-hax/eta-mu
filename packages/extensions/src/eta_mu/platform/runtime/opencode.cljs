(ns eta-mu.platform.runtime.opencode
  "Thin OpenCode runtime entrypoint for the ημ platform.

  This namespace is the only place in the platform layer that may touch
  OpenCode's plugin function shape. It receives a pre-linked ημ registry and
  returns the OpenCode plugin function."
  (:require
   [eta-mu.platform.registry :as registry]
   [eta-mu.platform.target.opencode :as opencode]))

(defn ^:export makePlugin
  "Return an OpenCode plugin function.

  `config` is a normalized ημ registry map (from `eta-mu.platform.registry`).
  `capability-registry` is a map from capability id to capability descriptor
  produced by `defcapability`.

  A thin `.mjs` wrapper is responsible for loading the EDN config, building the
  capability registry, and calling this function."
  [config capability-registry]
  (let [linked (registry/validate!
                (registry/link-capabilities config capability-registry))]
    (fn [_ctx _options]
      (js/Promise.resolve (opencode/compile-plugin linked capability-registry)))))
