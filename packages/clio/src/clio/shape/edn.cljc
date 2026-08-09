(ns clio.shape.edn
  (:require #?(:clj [clojure.edn :as reader]
               :cljs [cljs.reader :as reader])))

(defn read-one
  "Read exactly one EDN form. Wrapping the input in a vector makes trailing
   forms observable instead of letting read-string silently ignore them."
  [text]
  (let [forms (reader/read-string (str "[\n" text "\n]"))]
    (when-not (= 1 (count forms))
      (throw
       (ex-info "Expected exactly one EDN form"
                {:clio/error :clio.edn/expected-one-form
                 :form-count (count forms)})))
    (first forms)))
