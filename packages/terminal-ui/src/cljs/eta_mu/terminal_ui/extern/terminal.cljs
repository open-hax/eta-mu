(ns eta-mu.terminal-ui.extern.terminal
  "Terminal boundary for the terminal-ui package.

  Provides a `Terminal` protocol and a `process-terminal` implementation backed
  by Node's `process.stdin` / `process.stdout`. This is the lowest-level extern
  layer; no component or domain logic lives here.")

(defprotocol Terminal
  (write [this data] "Write a string to the terminal output.")
  (columns [this] "Return the terminal column count.")
  (rows [this] "Return the terminal row count.")
  (hide-cursor [this] "Hide the cursor.")
  (show-cursor [this] "Show the cursor.")
  (clear-line [this] "Clear the current line.")
  (clear-from-cursor [this] "Clear from cursor to end of screen.")
  (clear-screen [this] "Clear entire screen and move cursor to home.")
  (move-by [this lines] "Move cursor up (negative) or down (positive) by N lines.")
  (set-title [this title] "Set the terminal window title.")
  (start [this on-input on-resize] "Enable raw mode and attach input/resize handlers.")
  (stop [this] "Restore terminal state and detach handlers.")
  (drain-input [this max-ms idle-ms] "Drain stdin before exiting."))

(deftype ProcessTerminal [stdin stdout]
  Terminal
  (write [_ data]
    (.write ^js stdout data))

  (columns [_]
    (let [c (.-columns ^js stdout)]
      (if (pos? c) c 80)))

  (rows [_]
    (let [r (.-rows ^js stdout)]
      (if (pos? r) r 24)))

  (hide-cursor [_]
    (.write ^js stdout "\u001b[?25l"))

  (show-cursor [_]
    (.write ^js stdout "\u001b[?25h"))

  (clear-line [_]
    (.write ^js stdout "\u001b[K"))

  (clear-from-cursor [_]
    (.write ^js stdout "\u001b[J"))

  (clear-screen [_]
    (.write ^js stdout "\u001b[2J\u001b[H"))

  (move-by [_ lines]
    (cond
      (pos? lines) (.write ^js stdout (str "\u001b[" lines "B"))
      (neg? lines) (.write ^js stdout (str "\u001b[" (- lines) "A"))))

  (set-title [_ title]
    (.write ^js stdout (str "\u001b]0;" title "\u0007")))

  (start [_ on-input on-resize]
    (when (and (.-setRawMode ^js stdin) (.-isTTY ^js stdin))
      (.setRawMode ^js stdin true))
    (when (.-setEncoding ^js stdin)
      (.setEncoding ^js stdin "utf8"))
    (when (.-resume ^js stdin)
      (.resume ^js stdin))
    (.write ^js stdout "\u001b[?2004h")
    (when on-resize
      (set! (.-onresize ^js stdout) on-resize)
      (.on ^js stdout "resize" on-resize))
    (when on-input
      (set! (.-ondata ^js stdin) on-input)
      (.on ^js stdin "data" on-input)))

  (stop [_]
    (.write ^js stdout "\u001b[?2004l")
    (when (.-ondata ^js stdin)
      (.removeListener ^js stdin "data" (.-ondata ^js stdin))
      (set! (.-ondata ^js stdin) nil))
    (when (.-onresize ^js stdout)
      (.removeListener ^js stdout "resize" (.-onresize ^js stdout))
      (set! (.-onresize ^js stdout) nil))
    (when (.-pause ^js stdin)
      (.pause ^js stdin))
    (when (and (.-setRawMode ^js stdin) (.-isTTY ^js stdin))
      (.setRawMode ^js stdin false)))

  (drain-input [_ max-ms idle-ms]
    (let [max-ms (or max-ms 1000)
          idle-ms (or idle-ms 50)
          last-data (atom (js/Date.now))
          handler (fn [] (reset! last-data (js/Date.now)))]
      (.on ^js stdin "data" handler)
      (js/Promise.
       (fn [resolve _reject]
         (let [end-time (+ (js/Date.now) max-ms)]
           (letfn [(check []
                     (let [now (js/Date.now)]
                       (cond
                         (>= now end-time) (done)
                         (>= (- now @last-data) idle-ms) (done)
                         :else (js/setTimeout check (min idle-ms (- end-time now))))))
                   (done []
                     (.removeListener ^js stdin "data" handler)
                     (resolve nil))]
             (check))))))))

(defn process-terminal
  "Return a Terminal backed by the current process stdin/stdout."  
  []
  (->ProcessTerminal js/process.stdin js/process.stdout))
