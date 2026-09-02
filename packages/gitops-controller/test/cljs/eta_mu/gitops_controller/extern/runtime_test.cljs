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
                (js/Promise.
                 (fn [resolve _reject]
                   (js/setImmediate #(resolve true))))))))
      (let [first-invocation (@callback*)]
        ;; Promesa starts an async function on the next microtask. A real
        ;; interval cannot fire again before that turn begins, so let the
        ;; first invocation acquire its lease before simulating overlap.
        (await (js/Promise.resolve))
        (is (= 1 @calls*))
        (let [overlapping-invocation (@callback*)]
          (await overlapping-invocation))
        (await first-invocation)
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
