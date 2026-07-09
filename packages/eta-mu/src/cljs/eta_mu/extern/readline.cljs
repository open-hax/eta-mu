(ns eta-mu.extern.readline
  "Node readline boundary for the interactive agent REPL.

  Provides a function that prompts the user and returns a promise of the next
  line, or nil when the input stream closes."
  (:require ["node:readline" :as readline]))

(defn ^:async read-line
  "Read a single line from stdin, printing the prompt first.

  Returns a promise that resolves to the input string, or nil when stdin ends."
  [prompt]
  (let [rl (.createInterface readline
                             #js {:input js/process.stdin
                                  :output js/process.stdout
                                  :prompt prompt})]
    (js/Promise.
     (fn [resolve _reject]
       (.on rl "line"
            (fn [line]
              (.close rl)
              (resolve line)))
       (.on rl "close"
            (fn []
              (resolve nil)))))))
