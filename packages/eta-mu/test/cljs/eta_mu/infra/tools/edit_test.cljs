(ns eta-mu.infra.tools.edit-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.extern.fs :as fs]
            [eta-mu.infra.tools.edit :as edit]
            ["node:os" :as os]
            ["node:path" :as path]))

(defn- unique-id []
  (str (js/Date.now) "-" (.floor js/Math (* (.random js/Math) 1000000))))

(defn- tmp-file [content]
  (let [target (path/join (os/tmpdir) (str "eta-mu-edit-test-" (unique-id) ".txt"))]
    (fs/write-file target content)
    target))

(deftest ^:async edit-tool-replaces-unique-match-test
  (testing "replaces the unique match and rewrites the file"
    (let [target (tmp-file "hello world")
          result (await ((:execute edit/tool) "id-1" {:path target :old_text "world" :new_text "there"} nil nil))]
      (is (= "hello there" (fs/read-file target)))
      (is (= :text (-> result :content first :type))))))

(deftest ^:async edit-tool-not-unique-test
  (testing "throws when old_text matches more than once"
    (let [target (tmp-file "aa bb aa")
          threw? (atom false)]
      (try
        (await ((:execute edit/tool) "id-2" {:path target :old_text "aa" :new_text "cc"} nil nil))
        (catch :default _e (reset! threw? true)))
      (is @threw?)
      (is (= "aa bb aa" (fs/read-file target))))))
