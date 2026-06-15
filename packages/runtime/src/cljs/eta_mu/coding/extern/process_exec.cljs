(ns eta-mu.coding.extern.process-exec
  (:require [clojure.string :as str]))

(def ^:private child-process (js/require "node:child_process"))

(def ^:private default-max-output-bytes
  (* 10 1024 1024))

(defn- collect-stream
  "Collect chunks from a Readable stream up to `max-bytes`. Returns {:chunks atom :truncated atom}."
  [stream max-bytes]
  (let [chunks (atom [])
        total (atom 0)
        truncated (atom false)]
    (.on ^js stream "data" (fn [chunk]
                         (let [len (.-length chunk)]
                           (if (>= @total max-bytes)
                             (reset! truncated true)
                             (let [take-bytes (min len (- max-bytes @total))
                                   slice (if (< take-bytes len) (.slice chunk 0 take-bytes) chunk)]
                               (when (< (.-length slice) len)
                                 (reset! truncated true))
                               (swap! total + (.-length slice))
                               (swap! chunks conj slice))))))
    {:chunks chunks :truncated truncated}))

(defn- chunks->string
  "Convert collected Buffer chunks to a UTF-8 string."
  [chunks]
  (str/join "" (mapv #(.toString % "utf8") chunks)))

(defn spawn-command
  "Spawn `command` with `args`.
   Returns {:process child-process :promise Promise<result-map>}.
   Result map keys: :ok, :stdout, :stderr, :exit-code, :killed, :truncated."
  [{:keys [command args cwd env timeout-ms max-output-bytes]}]
  (let [max-bytes (or max-output-bytes default-max-output-bytes)
        timeout (or timeout-ms 0)
        spawn-options #js {:stdio #js ["ignore" "pipe" "pipe"]}
        _ (when cwd (js/Object.assign spawn-options #js {:cwd cwd}))
        _ (when env (js/Object.assign spawn-options #js {:env (clj->js env)}))
        child (.spawn child-process command (clj->js (vec args)) spawn-options)
        stdout-collector (collect-stream (.-stdout child) max-bytes)
        stderr-collector (collect-stream (.-stderr child) max-bytes)
        killed (atom false)
        timeout-id (atom nil)
        result (atom nil)
        settle (fn []
                 (when @timeout-id
                   (js/clearTimeout @timeout-id)
                   (reset! timeout-id nil)))
        finalize (fn [code]
                   (when (nil? @result)
                     (reset! result
                             {:ok true
                              :stdout (chunks->string @(:chunks stdout-collector))
                              :stderr (chunks->string @(:chunks stderr-collector))
                              :exit-code code
                              :killed @killed
                              :truncated (or @(:truncated stdout-collector)
                                             @(:truncated stderr-collector))})))
        on-error (fn [err]
                   (settle)
                   (when (nil? @result)
                     (reset! result
                             {:ok false
                              :error (.-message err)
                              :code (.-code err)
                              :stdout ""
                              :stderr ""
                              :exit-code nil
                              :killed false
                              :truncated false})))
        on-close (fn [code _signal]
                   (settle)
                   (finalize code))]
    (when (pos? timeout)
      (reset! timeout-id
              (js/setTimeout (fn []
                               (reset! killed true)
                               (try
                                 (.kill child "SIGTERM")
                                 (catch js/Error _)))
                             timeout)))
    (.once child "error" on-error)
    (.once child "close" on-close)
    {:process child
     :promise (js/Promise. (fn [resolve _]
                             (let [check (fn check []
                                           (if @result
                                             (resolve @result)
                                             (js/setTimeout check 10)))]
                               (check))))}))

(defn execute-command
  "Convenience wrapper around `spawn-command` that returns a Promise<result-map>."
  [opts]
  (:promise (spawn-command opts)))

