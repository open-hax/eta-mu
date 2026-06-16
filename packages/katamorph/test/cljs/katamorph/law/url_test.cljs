(ns katamorph.law.url-test
  (:require [cljs.test :refer [deftest is]]
            [katamorph.law.url :as url]))

(deftest looks-like-url?-test
  (is (url/looks-like-url? "http://x.com"))
  (is (url/looks-like-url? "https://x.com"))
  (is (not (url/looks-like-url? "/local/path")))
  (is (not (url/looks-like-url? "data:image/png;base64,AAAA")))
  (is (not (url/looks-like-url? 42))))

(deftest media-url?-test
  (is (url/media-url? "https://x.com/a.png"))
  (is (url/media-url? "/uploads/a.png") "leading-slash paths count as media")
  (is (not (url/media-url? "a.png")))
  (is (not (url/media-url? nil))))

(deftest data-url?-test
  (is (url/data-url? "data:image/png;base64,AAAA"))
  (is (not (url/data-url? "http://x.com")))
  (is (not (url/data-url? 0))))
