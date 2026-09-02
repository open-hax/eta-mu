(ns eta-mu.gitops-controller.extern.runtime-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(deftest ^:async intervals-never-overlap-and-resume-after-settlement
  (let [callback* (atom nil)
        release* (atom nil)
        started-resolve* (atom nil)
        started (js/Promise.
                 (fn [resolve _reject]
                   (reset! started-resolve* resolve)))
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
                     (reset! release* resolve)
                     (@started-resolve* true)))
                  (js/Promise.resolve true))))))
      (let [first-invocation (@callback*)]
        ;; Wait for the scheduled operation itself to prove that it acquired
        ;; the lease; a fixed number of microtask yields is not that proof.
        (await started)
        (is (= 1 @calls*))
        ;; Await the overlapping tick itself: with the first operation proven
        ;; active, this invocation must lose the lease and settle immediately.
        (await (@callback*))
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
