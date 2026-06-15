(ns eta-mu.coding.extern.fs-watch-test
  (:require [cljs.test :refer [deftest is async]]
            [eta-mu.coding.extern.fs :as fs]
            [eta-mu.coding.extern.fs-watch :as fw]
            [eta-mu.coding.extern.path :as path]))

(deftest watch-path-events-test
  (async done
    (let [dir (path/path-join "/tmp/opencode" (str "watch-test-" (random-uuid)))
          file (path/path-join dir "watched.txt")
          events (atom [])]
      (fs/ensure-directory! dir)
      (let [watch-res (fw/watch-path dir (fn [e] (swap! events conj e)))]
        (is (:ok watch-res))
        (js/setTimeout (fn []
                         (fs/write-text-file! file "hello")
                         (js/setTimeout (fn []
                                          (fs/delete-file! file)
                                          (js/setTimeout (fn []
                                                           ((:close watch-res))
                                                           (fs/delete-directory! dir)
                                                           (is (pos? (count @events)))
                                                           (done))
                                                         200))
                                        200))
                       100)))))

