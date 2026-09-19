(ns open-hax.sol.law.retired-dependency-test
  "The deprecated ledger cannot quietly return through a runtime dependency."
  (:require [cljs.test :refer [deftest is]]
            [clojure.string :as str]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(defn- source-files [directory]
  (mapcat (fn [^js entry]
            (let [file (path/join directory (.-name entry))]
              (if (.isDirectory entry)
                (source-files file)
                (when (or (str/ends-with? file ".cljs")
                          (str/ends-with? file ".cljc"))
                  [file]))))
          (array-seq (fs/readdirSync directory #js {:withFileTypes true}))))

(deftest retired-ledger-dependency-guard
  (is (not (str/includes? (fs/readFileSync "deps.edn" "utf8")
                          "io.github.open-hax/event-ledger")))
  (doseq [file (source-files "src/cljs")]
    (is (not (str/includes? (fs/readFileSync file "utf8") "open-hax.event-ledger"))
        (str "Retired ledger namespace in " file))))
