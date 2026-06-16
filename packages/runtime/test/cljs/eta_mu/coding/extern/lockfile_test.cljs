(ns eta-mu.coding.extern.lockfile-test
  (:require [cljs.test :refer [deftest is async]]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.lockfile :as lock]
            [eta-mu.coding.extern.path :as path]))

(defn- temp-target []
  (let [d (path/path-join "/tmp/opencode" (str "lock-test-" (random-uuid)))
        target (path/path-join d "target.txt")]
    (fs/ensure-directory! d)
    (fs/write-text-file! target "x")
    target))

(deftest acquire-release-test
  (async done
    (let [target (temp-target)]
      (let [acquired (lock/acquire-lock! target)]
        (is (:ok acquired))
        (is (= (lock/lockfile-path target) (:lock-path acquired)))
        (is (fs/file-exists? (:lock-path acquired))))
      (let [released (lock/release-lock! target)]
        (is (:ok released))
        (is (not (fs/file-exists? (lock/lockfile-path target)))))
      (fs/delete-directory! (path/path-dirname target))
      (done))))

(deftest with-lock-test
  (async done
    (let [target (temp-target)
          res (lock/with-lock! target #(+ 1 2))]
      (is (:ok res))
      (is (= 3 (:value res)))
      (is (not (fs/file-exists? (lock/lockfile-path target))))
      (fs/delete-directory! (path/path-dirname target))
      (done))))
