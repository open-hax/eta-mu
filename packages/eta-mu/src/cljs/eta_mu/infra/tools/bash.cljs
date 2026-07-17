(ns eta-mu.infra.tools.bash
  "The `bash` agent tool: runs a shell command with an optional timeout and
  truncates combined stdout/stderr output."
  (:require [eta-mu.domain.tools.truncate :as truncate]
            [eta-mu.extern.child-process :as cp]
            [eta-mu.law.tools :as law]))

(defn- ^:async execute [_id args _signal _on-update]
  (let [command (:command args)
        timeout-s (:timeout args)]
    (when-not (string? command)
      (throw (js/Error. "bash: command is required")))
    (let [timeout-ms (when (and (number? timeout-s) (pos? timeout-s)) (* timeout-s 1000))
          {:keys [exit stdout stderr timed-out?]} (await (cp/exec-shell-capture command timeout-ms))
          combined (str stdout stderr)
          trunc (truncate/truncate-tail combined)
          suffix (cond
                   timed-out? "\n[Command timed out]"
                   (not (zero? exit)) (str "\n[Exit code " exit "]")
                   :else nil)
          text (cond-> (:content trunc) suffix (str suffix))]
      {:content [{:type :text :text (if (seq text) text "(no output)")}]
       :details {:exit exit :truncated (:truncated trunc) :timed-out? (boolean timed-out?)}})))

(def tool
  {:name "bash"
   :label "bash"
   :description "Execute a bash command and return its combined stdout/stderr. Optional timeout in seconds; output is truncated for long-running commands."
   :parameters law/bash-parameters
   :execute execute})
