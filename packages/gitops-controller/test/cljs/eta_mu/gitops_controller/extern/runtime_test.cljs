(ns eta-mu.gitops-controller.extern.runtime-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.runtime :as runtime]))

(deftest ^:async intervals-never-overlap-and-resume-after-settlement
  (let [original-set-interval (.-setInterval js/globalThis)
        callback* (atom nil)
        release* (atom nil)
        calls* (atom 0)]
    (set! (.-setInterval js/globalThis)
          (fn [callback _interval-ms]
            (reset! callback* callback)
            123))
    (try
      (is (= 123
             (runtime/every!
              5000
              (fn []
                (swap! calls* inc)
                (js/Promise.
                 (fn [resolve _]
                   (reset! release* resolve)))))))
      (let [first-invocation (@callback*)]
        (await (@callback*))
        (is (= 1 @calls*))
        (@release* true)
        (await first-invocation)
        (let [third-invocation (@callback*)]
          (is (= 2 @calls*))
          (@release* true)
          (await third-invocation)))
      (finally
        (set! (.-setInterval js/globalThis) original-set-interval)))))

(deftest ^:async rejected-interval-invocation-releases-the-serial-lease
  (let [original-set-interval (.-setInterval js/globalThis)
        original-error (.-error js/console)
        callback* (atom nil)
        calls* (atom 0)]
    (set! (.-setInterval js/globalThis)
          (fn [callback _interval-ms]
            (reset! callback* callback)
            456))
    (set! (.-error js/console) (fn [_message] nil))
    (try
      (runtime/every!
       5000
       (fn []
         (swap! calls* inc)
         (js/Promise.reject (js/Error. "expected test rejection"))))
      (await (@callback*))
      (await (@callback*))
      (is (= 2 @calls*))
      (finally
        (set! (.-error js/console) original-error)
        (set! (.-setInterval js/globalThis) original-set-interval)))))
