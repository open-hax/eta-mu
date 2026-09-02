(ns eta-mu.gitops-controller.extern.uri-test
  (:require [cljs.test :refer [deftest is]]
            [eta-mu.gitops-controller.extern.uri :as uri]))

(deftest components-are-encoded-at-the-host-boundary
  (is (= "heads%2Ffeature%20branch"
         (uri/encode-component "heads/feature branch"))))
