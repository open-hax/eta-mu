(ns eta-mu.coding.extern.fs-test
  (:require [cljs.test :refer [deftest is async]]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.path :as path]))

(defn- temp-dir []
  (path/path-join "/tmp/opencode" (str "fs-test-" (random-uuid))))

(deftest read-write-roundtrip-test
  (async done
    (let [dir (temp-dir)
          file (path/path-join dir "hello.txt")]
      (fs/ensure-directory! dir)
      (let [write-res (fs/write-text-file! file "hello world")]
        (is (:ok write-res))
        (let [read-res (fs/read-text-file file)]
          (is (:ok read-res))
          (is (= "hello world" (:content read-res)))))
      (fs/delete-directory! dir)
      (done))))

(deftest append-test
  (async done
    (let [dir (temp-dir)
          file (path/path-join dir "append.txt")]
      (fs/ensure-directory! dir)
      (is (:ok (fs/write-text-file! file "a")))
      (is (:ok (fs/append-text-file! file "b")))
      (is (= "ab" (:content (fs/read-text-file file))))
      (fs/delete-directory! dir)
      (done))))

(deftest exists-test
  (async done
    (let [dir (temp-dir)
          file (path/path-join dir "exists.txt")]
      (fs/ensure-directory! dir)
      (is (fs/directory-exists? dir))
      (is (not (fs/file-exists? file)))
      (is (:ok (fs/write-text-file! file "x")))
      (is (fs/file-exists? file))
      (fs/delete-directory! dir)
      (done))))

(deftest list-delete-copy-test
  (async done
    (let [dir (temp-dir)
          src (path/path-join dir "src.txt")
          dest (path/path-join dir "dest.txt")]
      (fs/ensure-directory! dir)
      (is (:ok (fs/write-text-file! src "copy me")))
      (let [copy-res (fs/copy-file! src dest)]
        (is (:ok copy-res))
        (is (= "copy me" (:content (fs/read-text-file dest)))))
      (let [list-res (fs/list-directory dir)]
        (is (:ok list-res))
        (is (= 2 (count (:entries list-res)))))
      (is (:ok (fs/delete-file! src)))
      (is (not (fs/file-exists? src)))
      (fs/delete-directory! dir)
      (done))))

(deftest sha256-test
  (async done
    (let [expected "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
          dir (temp-dir)
          file (path/path-join dir "hash.txt")]
      (is (= expected (fs/sha256-hex "Hello World")))
      (fs/ensure-directory! dir)
      (fs/write-text-file! file "Hello World")
      (is (= expected (fs/sha256-hex file)))
      (fs/delete-directory! dir)
      (done))))

(deftest error-test
  (async done
    (let [res (fs/read-text-file "/tmp/opencode/does-not-exist-xyz.txt")]
      (is (false? (:ok res)))
      (is (some? (:error res)))
      (is (some? (:code res)))
      (done))))
