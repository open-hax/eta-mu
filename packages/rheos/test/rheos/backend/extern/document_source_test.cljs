(ns rheos.backend.extern.document-source-test
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [cljs.test :refer [deftest is testing]]
            [rheos.backend.extern.document-source :as source]))

(defn- tmp-dir []
  (path/join (.tmpdir os)
             (str "rheos-document-source-" (.now js/Date) "-" (rand-int 100000))))

(deftest ^:async sidecar-must-resolve-inside-document-root
  (let [root (tmp-dir)
        docs (path/join root "docs")
        markdown-path (path/join docs "translation.md")
        sidecar-path (path/join docs "translation.edn")]
    (await (.mkdir fsp docs #js {:recursive true}))
    (await (.writeFile fsp markdown-path "body" "utf8"))
    (await (.writeFile fsp sidecar-path "{}" "utf8"))
    (try
      (testing "contained relative EDN sidecar"
        (let [result (await (source/resolve-contained-sidecar!
                             root markdown-path "translation.edn"))]
          (is (:ok result))
          (is (= sidecar-path (:path result)))))
      (testing "absolute path"
        (is (= :sidecar/absolute-path
               (get-in (await (source/resolve-contained-sidecar!
                               root markdown-path sidecar-path))
                       [:errors 0 :error/code]))))
      (testing "lexical escape"
        (is (= :sidecar/path-escape
               (get-in (await (source/resolve-contained-sidecar!
                               root markdown-path "../../../escape.edn"))
                       [:errors 0 :error/code]))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest content-digest-binds-markdown-and-sidecar
  (let [first-digest (source/content-sha256 "markdown" "{:a 1}")]
    (is (= 64 (count first-digest)))
    (is (= first-digest (source/content-sha256 "markdown" "{:a 1}")))
    (is (not= first-digest (source/content-sha256 "markdown!" "{:a 1}")))
    (is (not= first-digest (source/content-sha256 "markdown" "{:a 2}")))))
