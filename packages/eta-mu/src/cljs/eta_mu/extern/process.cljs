(ns eta-mu.extern.process
  "Node process boundary. All direct access to `process` is isolated here.")

(defn argv
  "Return process.argv as a vector of strings."
  []
  (vec (js->clj js/process.argv)))

(defn cwd
  "Return the current working directory."
  []
  (js/process.cwd))

(defn env
  "Return an environment variable value, or nil if unset."
  [key]
  (when-let [v (aget js/process.env key)]
    v))

(defn exit!
  "Exit the process with the given code."
  [code]
  (js/process.exit code))

(defn exit-code!
  "Set process.exitCode without terminating."
  [code]
  (set! js/process.exitCode code))

(defn platform
  "Return the Node platform identifier."
  []
  (js/process.platform))

(defn stdin-tty?
  "True if stdin is connected to a TTY."
  []
  (boolean (.-isTTY js/process.stdin)))
