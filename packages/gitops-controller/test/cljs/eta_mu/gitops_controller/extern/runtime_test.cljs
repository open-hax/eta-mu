(ns eta-mu.gitops-controller.extern.runtime-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(deftest ^:async intervals-never-overlap-and-resume-after-settlement
  (let [callback* (atom nil)
        release* (atom nil)
        hold-first?* (atom true)
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
                (if (compare-and-set! hold-first?* true false)
                  (js/Promise.
                   (fn [resolve _reject]
                     (reset! release* resolve)))
                  (js/Promise.resolve true))))))
      (let [first-invocation (@callback*)]
        ;; Let the transformed async invocation acquire its lease, then keep
        ;; that lease explicitly unsettled while the overlapping tick runs.
        (await (js/Promise.resolve))
        (is (= 1 @calls*))
        (@callback*)
        ;; The scheduler ignores an interval callback's return value. Yield
        ;; once so the overlap attempt observes the held lease without making
        ;; the test wait on the invocation that owns it.
        (await (js/Promise.resolve))
        (is (= 1 @calls*))
        (@release* true)
        (await first-invocation)
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
