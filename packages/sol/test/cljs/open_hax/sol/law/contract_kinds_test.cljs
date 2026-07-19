(ns open-hax.sol.law.contract-kinds-test
  "Regression net for the katamorph cutover: every valid on-disk fixture
   contract must validate through the canonical katamorph schemas exactly as
   it did through the deleted sol-local open-hax.sol.law.contracts."
  (:require [cljs.test :refer [deftest is testing]]
            [cljs.reader :as reader]
            [clojure.string :as str]
            [open-hax.sol.law.contract-kinds :as ck]
            ["node:fs" :as fs]
            ["node:path" :as path]))

(def ^:private fixture-roots
  ["test/fixtures/contracts"
   "test/fixtures/hello-world-contracts"
   "test/fixtures/model-contracts"])

(def ^:private invalid-by-design
  ;; broken.edn is not EDN; no_identity.edn lacks :contract/id on purpose.
  #{"broken.edn" "no_identity.edn"})

(defn- edn-files
  [root]
  (when (fs/existsSync root)
    (for [klass (fs/readdirSync root)
          :let [dir (path/join root klass)]
          :when (.isDirectory (fs/statSync dir))
          file (fs/readdirSync dir)
          :when (and (str/ends-with? file ".edn")
                     (not (contains? invalid-by-design file)))]
      [klass (path/join dir file)])))

(deftest all-valid-fixtures-validate-through-katamorph
  (let [checked (atom 0)]
    (doseq [root fixture-roots
            [klass file] (edn-files root)]
      (testing file
        (let [value (reader/read-string (fs/readFileSync file "utf8"))
              result (ck/validate klass value)]
          (swap! checked inc)
          (is (:ok result)
              (str file " failed: " (pr-str (:errors result)))))))
    (is (pos? @checked) "fixture sweep found no contracts — paths broken?")))

(deftest lenient-fallback-preserved
  ;; unknown kinds historically validated against the open agent contract
  (is (:ok (ck/validate nil {:contract/id "mystery" :contract/kind :whatever})))
  (is (:ok (ck/validate nil {:contract/id "just-an-id"}))))

(deftest invalid-contracts-still-fail
  (is (not (:ok (ck/validate "actors" {:actor/kind :user}))))
  (is (not (:ok (ck/validate "models" {:model/label "no id"})))))

(deftest deprecated-pipeline-dialect
  (is (:ok (ck/validate "pipelines"
                        {:contract/kind :pipeline
                         :contract/id "legacy"
                         :pipeline/steps [{:step/id "a" :step/contract "x"}]})))
  (is (not (:ok (ck/validate "pipelines" {:contract/kind :pipeline
                                          :contract/id "no-steps"})))))
