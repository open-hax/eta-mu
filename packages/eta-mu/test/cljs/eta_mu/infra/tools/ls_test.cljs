(ns eta-mu.infra.tools.ls-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.ls :as ls]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-dir []
  (let [dir (path/join (os/tmpdir) (str "eta-mu-ls-test-" (unique-id)))]
    (fs/mkdir dir)
    dir))

(deftest ^:async ls-tool-lists-entries-test
  (testing "lists files and directories, sorted, with / suffix on dirs"
    (let [dir (tmp-dir)]
      (fs/write-file (path/join dir "b.txt") "b")
      (fs/write-file (path/join dir "a.txt") "a")
      (fs/mkdir (path/join dir "sub"))
      (let [result (await ((:execute ls/tool) "id-1" {:path dir} nil nil))]
        (is (= "a.txt\nb.txt\nsub/" (-> result :content first :text)))))))

(deftest ^:async ls-tool-missing-path-test
  (testing "throws when the directory does not exist"
    (let [missing (path/join (os/tmpdir) (str "eta-mu-ls-missing-" (unique-id)))
          threw? (atom false)]
      (try
        (await ((:execute ls/tool) "id-2" {:path missing} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?))))

(deftest ^:async ls-tool-limit-test
  (testing "caps entries at limit and appends a truncation notice"
    (let [dir (tmp-dir)]
      (doseq [i (range 5)]
        (fs/write-file (path/join dir (str "file" i ".txt")) "x"))
      (let [result (await ((:execute ls/tool) "id-3" {:path dir :limit 2} nil nil))
            text (-> result :content first :text)]
        (is (= 2 (:entry-limit-reached (:details result))))
        (is (re-find #"entries limit reached" text))))))
