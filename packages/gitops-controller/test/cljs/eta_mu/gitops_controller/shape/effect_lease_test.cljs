(ns eta-mu.gitops-controller.shape.effect-lease-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.law.webhook :as law]
            [eta-mu.gitops-controller.shape.effect-lease :as shape]))

(deftest marker-decoding-preserves-the-exact-lf-wire-contract
  (is (true? (law/active-marker? "100-1\n")))
  (is (= "100-1" (shape/active-marker-deployment "100-1\n")))
  (doseq [marker [nil 101 "" "\n" "100-1" "100-1\r\n"
                  "100-1\nextra\n" "100-1\n\n" "100-1 \n"
                  " 100-1\n" "0-1\n" "100-0\n" "0100-1\n"]]
    (is (false? (law/active-marker? marker)))
    (is (nil? (shape/active-marker-deployment marker)))))
