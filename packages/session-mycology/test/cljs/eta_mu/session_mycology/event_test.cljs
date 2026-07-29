(ns eta-mu.session-mycology.event-test
  (:require [cljs.test :refer [deftest is testing]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.domain.reflection :as reflection]
            [eta-mu.session-mycology.extern.git :as git]
            [eta-mu.session-mycology.generated.registry :as registry]))

(deftest version-stamped-reflection-test
  (testing "session reflection is its own event family"
    (let [payload (reflection/build-payload
                   {:repo "/repo"
                    :lesson "Separate protocol intent."
                    :session-id "s1"
                    :receipt-refs ["r1"]})
          record (event/build-event
                  {:event-id #uuid "00000000-0000-0000-0000-000000000002"
                   :recorded-at "2026-07-29T00:00:00.000Z"
                   :component-manifest {:eta-mu/version "1.1.1"}
                   :command "eta-mu session reflect"
                   :producer {}
                   :subject {:repository/path "/repo"}
                   :caused-by [#uuid "00000000-0000-0000-0000-000000000001"]}
                  payload)]
      (is (= :session-mycology/reflection-recorded (:event/type record)))
      (is (= "0.1.0" (get-in record [:event/producer :package/version])))
      (is (= 1 (get-in record [:event/schema :version])))
      (is (= "s1" (get-in record [:event/payload :session/id])))
      (is (= 1 (count (:event/caused-by record)))))))

(deftest registry-test
  (is (= 1 (get registry/current-versions
                :eta-mu.session-mycology/reflection-recorded))))

(deftest reflection-payload-law-test
  (is (thrown-with-msg? js/Error #"Invalid session reflection payload"
                        (reflection/build-payload
                         {:repo "/repo" :lesson " \n "})))
  (is (thrown-with-msg? js/Error #"Invalid session reflection payload"
                        (reflection/build-payload
                         {:repo 42 :lesson "A lesson."}))))

(deftest ^:async typed-git-failure-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-session-git-"))]
    (try
      (let [{:keys [exit status stderr]}
            (await (git/exec-at root ["rev-parse" "--show-toplevel"]))]
        (is (not (zero? exit)))
        (is (= :not-a-repository status))
        (is (re-find #"not a git repository" stderr)))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))

(deftest ^:async git-timeout-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-session-timeout-"))]
    (try
      (is (= :ok
             (:status
              (await (git/exec-at root ["init" "--quiet"]
                                  {:timeout-ms 5000})))))
      (let [result (await (git/exec-at root
                                       ["hash-object" "--stdin"]
                                       {:timeout-ms 25}))]
        (is (= :timeout (:status result)))
        (is (= 25 (:timeout-ms result)))
        (is (= "SIGKILL" (:signal result))))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))
