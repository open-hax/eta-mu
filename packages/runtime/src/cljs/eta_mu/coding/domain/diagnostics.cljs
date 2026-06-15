(ns eta-mu.coding.domain.diagnostics
  (:require [eta-mu.coding.law.session :as session-law]
            [eta-mu.runtime.law.core :as law]))

(defn resource-collision
  "Create a pure ResourceCollision map."
  ([resource-type name winner-path loser-path]
   (resource-collision resource-type name winner-path loser-path nil nil))
  ([resource-type name winner-path loser-path winner-source loser-source]
   (law/validate! session-law/resource-collision-schema
                  (cond-> {:resource-type resource-type
                             :name name
                             :winner-path winner-path
                             :loser-path loser-path}
                    winner-source (assoc :winner-source winner-source)
                    loser-source (assoc :loser-source loser-source))
                  "resource collision")))

(defn resource-diagnostic
  "Create a pure ResourceDiagnostic map."
  ([type message]
   (resource-diagnostic type message nil nil))
  ([type message path]
   (resource-diagnostic type message path nil))
  ([type message path collision]
   (law/validate! session-law/resource-diagnostic-schema
                  (cond-> {:type type
                             :message message}
                    path (assoc :path path)
                    collision (assoc :collision collision))
                  "resource diagnostic")))

(defn stdout-takeover-state
  "Create a pure representation of an stdout takeover state.
   The actual monkey-patching of process.stdout belongs in an extern namespace."
  [raw-stdout-write raw-stderr-write original-stdout-write]
  {:raw-stdout-write raw-stdout-write
   :raw-stderr-write raw-stderr-write
   :original-stdout-write original-stdout-write
   :active true})

(defn stdout-taken-over?
  "Return true when the takeover state indicates stdout is captured."
  [state]
  (boolean (:active state)))

(defn raw-stdout-write-payload
  "Return the target stream and text for a raw stdout write decision.
   Result is {:target :stdout|:stderr :text string}."
  [state text]
  (if (stdout-taken-over? state)
    {:target :stderr :text text}
    {:target :stdout :text text}))

(defn flush-stdout-payload
  "Return the target stream for a raw stdout flush decision.
   Result is {:target :stdout|:stderr}."
  [state]
  (if (stdout-taken-over? state)
    {:target :stderr}
    {:target :stdout}))

(defn provider-login-help
  "Return a pure login help string. docs-path is injected by the caller."
  [docs-path]
  (str "Use /login to log into a provider via OAuth or API key. See:\n"
       "  " docs-path "/providers.md\n"
       "  " docs-path "/models.md"))

(defn format-no-api-key-found-message
  "Format the missing API key guidance message."
  [provider login-help]
  (let [provider-display (if (= provider "unknown") "the selected model" provider)]
    (str "No API key found for " provider-display ".\n\n" login-help)))

(defn format-no-model-selected-message
  "Format the no model selected guidance message."
  [login-help]
  (str "No model selected.\n\n" login-help "\n\nThen use /model to select a model."))

(defn format-no-models-available-message
  "Format the no models available guidance message."
  [login-help]
  (str "No models available. " login-help))
