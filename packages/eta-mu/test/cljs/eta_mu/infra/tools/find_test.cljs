(ns eta-mu.infra.tools.find-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.find :as find]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-dir []
  (let [dir (path/join (os/tmpdir) (str "eta-mu-find-test-" (unique-id)))]
    (fs/mkdir dir)
    dir))

(deftest ^:async find-tool-matches-glob-test
  (testing "finds files by glob pattern, ignoring node_modules"
    (let [dir (tmp-dir)]
      (fs/write-file (path/join dir "a.ts") "a")
      (fs/write-file (path/join dir "b.txt") "b")
      (fs/mkdir (path/join dir "src"))
      (fs/write-file (path/join dir "src" "c.ts") "c")
      (fs/mkdir (path/join dir "node_modules"))
      (fs/write-file (path/join dir "node_modules" "dep.ts") "dep")
      (let [result (await ((:execute find/tool) "id-1" {:pattern "*.ts" :path dir} nil nil))
            text (-> result :content first :text)]
        (is (= "a.ts\nsrc/c.ts" text))))))

(deftest ^:async find-tool-missing-path-test
  (testing "throws when the search path does not exist"
    (let [missing (path/join (os/tmpdir) (str "eta-mu-find-missing-" (unique-id)))
          threw? (atom false)]
      (try
        (await ((:execute find/tool) "id-2" {:pattern "*.ts" :path missing} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?))))

(deftest ^:async find-tool-limit-test
  (testing "caps results at limit and appends a truncation notice"
    (let [dir (tmp-dir)]
      (doseq [i (range 5)]
        (fs/write-file (path/join dir (str "file" i ".ts")) "x"))
      (let [result (await ((:execute find/tool) "id-3" {:pattern "*.ts" :path dir :limit 2} nil nil))
            text (-> result :content first :text)]
        (is (= 2 (:result-limit-reached (:details result))))
        (is (re-find #"results limit reached" text))))))

(deftest ^:async find-tool-no-matches-test
  (testing "reports no files found when nothing matches"
    (let [dir (tmp-dir)
          result (await ((:execute find/tool) "id-4" {:pattern "*.md" :path dir} nil nil))]
      (is (= "No files found matching pattern" (-> result :content first :text))))))
