(ns eta-mu.infra.tools.grep-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.grep :as grep]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-dir []
  (let [dir (path/join (os/tmpdir) (str "eta-mu-grep-test-" (unique-id)))]
    (fs/mkdir dir)
    dir))

(deftest ^:async grep-tool-finds-matches-test
  (testing "finds matching lines across files, ignoring node_modules"
    (let [dir (tmp-dir)]
      (fs/write-file (path/join dir "a.txt") "hello needle\nother line")
      (fs/mkdir (path/join dir "node_modules"))
      (fs/write-file (path/join dir "node_modules" "dep.txt") "needle in a haystack")
      (let [result (await ((:execute grep/tool) "id-1" {:pattern "needle" :path dir} nil nil))
            text (-> result :content first :text)]
        (is (= "a.txt:1: hello needle" text))))))

(deftest ^:async grep-tool-missing-path-test
  (testing "throws when the search path does not exist"
    (let [missing (path/join (os/tmpdir) (str "eta-mu-grep-missing-" (unique-id)))
          threw? (atom false)]
      (try
        (await ((:execute grep/tool) "id-2" {:pattern "needle" :path missing} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?))))

(deftest ^:async grep-tool-limit-test
  (testing "caps matches at limit and appends a truncation notice"
    (let [dir (tmp-dir)]
      (fs/write-file (path/join dir "a.txt") "needle\nneedle\nneedle\nneedle\nneedle")
      (let [result (await ((:execute grep/tool) "id-3" {:pattern "needle" :path dir :limit 2} nil nil))
            text (-> result :content first :text)]
        (is (= 2 (:match-limit-reached (:details result))))
        (is (re-find #"matches limit reached" text))))))

(deftest ^:async grep-tool-no-matches-test
  (testing "reports no matches when nothing matches"
    (let [dir (tmp-dir)]
      (fs/write-file (path/join dir "a.txt") "nothing here")
      (let [result (await ((:execute grep/tool) "id-4" {:pattern "needle" :path dir} nil nil))]
        (is (= "No matches found" (-> result :content first :text)))))))

(deftest ^:async grep-tool-single-file-test
  (testing "searching a single file formats the path as its basename"
    (let [dir (tmp-dir)
          target (path/join dir "sample.txt")]
      (fs/write-file target "needle here")
      (let [result (await ((:execute grep/tool) "id-5" {:pattern "needle" :path target} nil nil))]
        (is (= "sample.txt:1: needle here" (-> result :content first :text)))))))
