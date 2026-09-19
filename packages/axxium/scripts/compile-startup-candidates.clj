(require '[clojure.edn :as edn]
         '[shadow.cljs.devtools.api :as shadow])
(shadow/with-runtime
  (let [build (-> (get-in (edn/read-string (slurp "shadow-cljs.edn")) [:builds :test])
                  (assoc :build-id :startup-candidates
                         :output-to "target/startup-candidates.cjs"
                         :ns-regexp "axxium\\.extern\\.identity-startup-candidates-test$"))]
    (shadow/compile* build {}))
  nil)
