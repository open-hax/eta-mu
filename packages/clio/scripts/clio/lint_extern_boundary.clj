(ns clio.lint-extern-boundary
  "Refuse raw host interop outside `clio.extern.js.*`.

   The boundary is a property of the *forms* a file contains, not of its text:
   a `js/` sequence inside a docstring, comment, or string literal performs no
   interop and must not fail the package lint. Every check here therefore runs
   over parsed source."
  (:require [clojure.java.io :as io]
            [clojure.string :as str]
            [edamame.core :as edamame]))

(defn package-root
  "The package directory containing `file`, found by walking up to the nearest
   ancestor holding a package.json."
  [file]
  (loop [dir (.getParentFile (.getAbsoluteFile (io/file file)))]
    (cond
      (nil? dir) nil
      (.isFile (io/file dir "package.json")) dir
      :else (recur (.getParentFile dir)))))

(defn scan-roots
  [root]
  [(io/file root "src" "clio")
   (io/file root "test" "clio")
   (io/file root "bin")])

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

(def parse-options
  "Read source as data rather than text. Reader conditionals are preserved so
   both branches of a `.cljc` form are inspected, and every unknown tag —
   `#js` included — survives as a tagged literal instead of being evaluated."
  {:all true
   :read-cond :preserve
   :features #{:clj :cljs}
   :auto-resolve (fn [alias] (if (= :current alias) "clio" (name alias)))
   :readers (fn [tag] (fn [value] (tagged-literal tag value)))})

(defn parse-forms
  [text]
  (edamame/parse-string-all (without-shebang text) parse-options))

(defn js-marker
  "The boundary violation this single node is, if any. Only reader-level
   positions count: a symbol in the `js` namespace, the `js*` special form, or
   a `#js` literal."
  [node]
  (cond
    (symbol? node) (cond
                     (= "js" (namespace node)) (str "js/ interop " (pr-str node))
                     (= "js*" (name node)) "js* interop"
                     :else nil)
    (tagged-literal? node) (when (= 'js (:tag node)) "#js literal")
    :else nil))

(defn js-markers
  "Every boundary violation reachable from form, walking collections, metadata,
   tagged-literal payloads, and both branches of preserved reader conditionals."
  [form]
  (concat
   (when-let [marker (js-marker form)] [marker])
   (when-let [m (meta form)] (js-markers m))
   (cond
     (tagged-literal? form) (js-markers (:form form))
     (reader-conditional? form) (js-markers (:form form))
     (map? form) (mapcat js-markers (mapcat identity form))
     (coll? form) (mapcat js-markers form)
     :else nil)))

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

(defn source-violations
  "Every boundary violation in already-read source text."
  [text]
  (let [forms (parse-forms text)]
    (concat
     (map #(str "host require " (pr-str %)) (host-requires (first forms)))
     (distinct (mapcat js-markers forms)))))

(defn violations
  [file]
  (when-not (extern-js-file? file)
    (source-violations (slurp file))))

(defn findings
  [roots]
  (let [files (->> roots
                   (filter #(.isDirectory %))
                   (mapcat file-seq)
                   (filter source-file?)
                   sort)]
    (for [file files
          violation (violations file)]
      {:file (.getPath file)
       :violation violation})))

(def ^:private this-file
  "`*file*` is only bound while this namespace is being loaded, so the path has
   to be captured here rather than read inside -main."
  *file*)

(defn -main
  [& _args]
  (let [found (findings (scan-roots (package-root this-file)))]
    (if (seq found)
      (do
        (binding [*out* *err*]
          (println "Clio JS boundary violations:")
          (doseq [{:keys [file violation]} found]
            (println " -" file ":" violation))
          (println "Move JS/Node access behind clio.extern.js.* and return Clojure data."))
        (System/exit 1))
      (println "Clio extern.js boundary: clean"))))
