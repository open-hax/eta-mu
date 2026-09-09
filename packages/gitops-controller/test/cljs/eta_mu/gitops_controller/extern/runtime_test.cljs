(ns eta-mu.gitops-controller.extern.runtime-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(deftest ^:async serial-executor-keeps-order-and-releases-after-rejection
  (let [run! (runtime/serial-executor)
        events* (atom [])
        release* (atom nil)
        hold (js/Promise. (fn [resolve _reject] (reset! release* resolve)))
        first-result (run! (^:async fn []
                             (swap! events* conj :first-started)
                             (await hold)
                             (swap! events* conj :first-failed)
                             (throw (ex-info "expected failure" {}))))
        second-result (run! (fn []
                              (swap! events* conj :second)
                              :second-result))]
    (await (js/Promise.resolve nil))
    (is (= [:first-started] @events*))
    (@release* nil)
    (let [error (try (await first-result)
                     nil
                     (catch :default value value))]
      (is (= "expected failure" (ex-message error))))
    (is (= :second-result (await second-result)))
    (is (= [:first-started :first-failed :second] @events*))))

(deftest ^:async intervals-never-overlap-and-resume-after-settlement
  (let [callback* (atom nil)
        release* (atom nil)
        hold-first?* (atom true)
        calls* (atom 0)
        fire-interval!
        (fn []
          (js/Promise.
           (fn [resolve _reject]
             (js/setImmediate
              (fn []
                (@callback*)
                (resolve true))))))]
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
      (await (fire-interval!))
      (is (= 1 @calls*))
      (await (fire-interval!))
      (is (= 1 @calls*))
      (@release* true)
      (await (fire-interval!))
      (is (= 2 @calls*)))))

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
