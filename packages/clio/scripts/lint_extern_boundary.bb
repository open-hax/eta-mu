#!/usr/bin/env bb

(ns clio.lint-extern-boundary
  (:require [clojure.java.io :as io]
            [clojure.string :as str]))

(def package-root
  (-> (io/file *file*) .getAbsoluteFile .getParentFile .getParentFile))

(def scan-roots
  [(io/file package-root "src" "clio")
   (io/file package-root "test" "clio")
   (io/file package-root "bin")])

(defn source-file?
  [file]
  (and (.isFile file)
       (re-find #"\.(?:clj|cljc|cljs|nbb)$" (.getName file))))

(defn extern-js-file?
  [file]
  (let [separator java.io.File/separator]
    (str/includes? (.getCanonicalPath file)
                   (str separator "extern"
                        separator "js"
                        separator))))

(defn- without-shebang
  "A .nbb entrypoint starts with a `#!/usr/bin/env nbb` line, which the Clojure
   reader cannot parse — drop it before reading the ns form."
  [text]
  (if (str/starts-with? text "#!")
    (if-let [idx (str/index-of text "\n")] (subs text idx) "")
    text))

(defn read-first-form
  [text]
  (with-open [reader (java.io.PushbackReader.
                      (io/reader (java.io.StringReader. text)))]
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
  (when-not (extern-js-file? file)
    (let [text (slurp file)
          ns-form (read-first-form (without-shebang text))]
      (concat
       (map #(str "host require " (pr-str %)) (host-requires ns-form))
       (raw-js-markers text)))))

(defn -main []
  (let [files (->> scan-roots
                   (filter #(.isDirectory %))
                   (mapcat file-seq)
                   (filter source-file?)
                   sort)
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
          (println "Move JS/Node access behind clio.extern.js.* and return Clojure data."))
        (System/exit 1))
      (println "Clio extern.js boundary: clean"))))

(-main)
