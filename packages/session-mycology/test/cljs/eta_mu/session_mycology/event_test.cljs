(ns eta-mu.session-mycology.event-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.session-mycology.domain.event :as event]
            [eta-mu.session-mycology.domain.reflection :as reflection]
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
                   :recorded-at #inst "2026-07-29T00:00:00.000Z"
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
