#!/usr/bin/env bb

(ns clio.lint-external-boundary
  (:require [clojure.java.io :as io]
            [clojure.string :as str]))

(def package-root
  (-> (io/file *file*) .getAbsoluteFile .getParentFile .getParentFile))

(def source-root
  (io/file package-root "src" "clio"))

(defn source-file?
  [file]
  (and (.isFile file)
       (re-find #"\.(?:clj|cljc|cljs)$" (.getName file))))

(defn external-js-file?
  [file]
  (str/includes? (.getCanonicalPath file)
                 (str io/file-separator "external"
                      io/file-separator "js"
                      io/file-separator)))

(defn read-first-form
  [file]
  (with-open [reader (java.io.PushbackReader. (io/reader file))]
    (read {:eof nil} reader)))

(defn require-clauses
  [ns-form]
  (when (and (seq? ns-form) (= 'ns (first ns-form)))
    (filter #(and (seq? %) (contains? #{:require :require-macros} (first %)))
            (drop 2 ns-form))))

(defn host-requires
  [ns-form]
  (for [clause (require-clauses ns-form)
        libspec (rest clause)
        :let [lib (cond
                    (string? libspec) libspec
                    (vector? libspec) (first libspec)
                    :else nil)]
        :when (string? lib)]
    lib))

(defn raw-js-markers
  [text]
  (cond-> []
    (re-find #"(?<![A-Za-z0-9_-])js/" text) (conj "js/ interop")
    (str/includes? text "#js") (conj "#js literal")))

(defn violations
  [file]
  (when-not (external-js-file? file)
    (let [text (slurp file)
          ns-form (read-first-form file)]
      (concat
       (map #(str "host require " (pr-str %)) (host-requires ns-form))
       (raw-js-markers text)))))

(defn -main []
  (let [files (->> (file-seq source-root) (filter source-file?) sort)
        findings
        (for [file files
              violation (violations file)]
          {:file (.getPath file)
           :violation violation})]
    (if (seq findings)
      (do
        (binding [*out* *err*]
          (println "Clio JS boundary violations:")
          (doseq [{:keys [file violation]} findings]
            (println " -" file ":" violation))
          (println "Move JS/Node access behind clio.external.js.* and return Clojure data."))
        (System/exit 1))
      (println "Clio external.js boundary: clean"))))

(-main)
