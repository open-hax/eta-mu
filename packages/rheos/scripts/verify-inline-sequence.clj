(require '[clojure.edn :as edn]
         '[shadow.cljs.devtools.api :as shadow])

(def builds (:builds (edn/read-string (slurp "shadow-cljs.edn"))))

(defn proof-build [build-key output]
  (merge (get builds build-key)
         {:build-id (keyword (str "single-line-" (name build-key)))}
         output))

(defn compile-tests! []
  (shadow/compile*
    (proof-build :test {:output-to "target/single-line-test/test.cjs"}) {}))

(defn release-targets! []
  (doseq [[build-key output]
          [[:server {:output-dir "target/single-line-release/server"}]
           [:cli {:output-to "target/single-line-release/cli.cjs"}]
           [:github-sync {:output-to "target/single-line-release/github-sync.cjs"}]
           [:app {:output-dir "target/single-line-release/web/js"}]]]
    (shadow/release* (proof-build build-key output) {})))

(shadow/with-runtime
  (case (first *command-line-args*)
    "test" (compile-tests!)
    "release" (release-targets!)
    (throw (ex-info "Expected test or release verification mode" {})))
  nil)
