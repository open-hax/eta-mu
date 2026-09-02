(ns eta-mu.gitops-controller.extern.runtime-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(deftest ^:async intervals-never-overlap-and-resume-after-settlement
  (let [callback* (atom nil)
        calls* (atom 0)]
    (with-redefs
      [runtime/start-interval!
       (fn [callback _interval-ms]
         (reset! callback* callback)
         123)]
      (is (= 123
             (runtime/every!
              5000
              (fn []
                (swap! calls* inc)
                (js/Promise.resolve true)))))
      (let [first-invocation (@callback*)
            overlapping-invocation (@callback*)]
        (is (= 1 @calls*))
        (await first-invocation)
        (await overlapping-invocation)
        (is (= 1 @calls*))
        (await (@callback*))
        (is (= 2 @calls*))))))

(deftest ^:async rejected-interval-invocation-releases-the-serial-lease
  (let [callback* (atom nil)
        calls* (atom 0)]
    (with-redefs
      [runtime/start-interval!
       (fn [callback _interval-ms]
         (reset! callback* callback)
         456)]
      (runtime/every!
       5000
       (fn []
         (swap! calls* inc)
         (js/Promise.reject (js/Error. "expected test rejection"))))
      (await (@callback*))
      (await (@callback*))
      (is (= 2 @calls*)))))
