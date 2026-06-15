(ns eta-mu.coding.extern.path-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.coding.extern.path :as path]))

(deftest path-roundtrip-test
  (testing "path helpers round-trip through Node path"
    (is (= "/a/b/c" (path/path-join "/a" "b" "c")))
    (is (= "/a/b/c" (path/path-resolve ["/a" "b" "c"])))
    (is (= "/a/b/c" (path/path-resolve "/a" "b/c")))
    (is (= "c" (path/path-basename "/a/b/c")))
    (is (= "c" (path/path-basename "/a/b/c.txt" ".txt")))
    (is (= "/a/b" (path/path-dirname "/a/b/c")))
    (is (= ".txt" (path/path-extname "/a/b/c.txt")))
    (is (path/absolute? "/a/b"))
    (is (string? (path/sep)))
    (is (string? (path/delimiter)))))

(deftest relative-path-test
  (is (= "b/c" (path/relative-path "/a" "/a/b/c"))))
