(ns eta-mu.infra.tools.read-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.read :as read]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-file [content]
  (let [target (path/join (os/tmpdir) (str "eta-mu-read-test-" (unique-id) ".txt"))]
    (fs/write-file target content)
    target))

(deftest ^:async read-tool-reads-file-test
  (testing "reads the full contents of a file"
    (let [target (tmp-file "line1\nline2\nline3")
          result (await ((:execute read/tool) "id-1" {:path target} nil nil))]
      (is (= "line1\nline2\nline3" (-> result :content first :text))))))

(deftest ^:async read-tool-missing-file-test
  (testing "throws when the file does not exist"
    (let [target (path/join (os/tmpdir) (str "eta-mu-read-test-missing-" (unique-id) ".txt"))
          threw? (atom false)]
      (try
        (await ((:execute read/tool) "id-2" {:path target} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?))))
