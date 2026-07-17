(ns eta-mu.infra.tools.write-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.write :as write]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-path [name]
  (path/join (os/tmpdir) (str "eta-mu-write-test-" (unique-id) "-" name)))

(deftest ^:async write-tool-creates-file-test
  (testing "writes content and creates parent directories"
    (let [dir (tmp-path "dir")
          target (path/join dir "out.txt")
          result (await ((:execute write/tool) "id-1" {:path target :content "hello"} nil nil))]
      (is (= "hello" (fs/read-file target)))
      (is (= :text (-> result :content first :type))))))

(deftest ^:async write-tool-missing-content-test
  (testing "throws when content is missing"
    (let [target (tmp-path "missing-content.txt")
          threw? (atom false)]
      (try
        (await ((:execute write/tool) "id-2" {:path target} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?))))
