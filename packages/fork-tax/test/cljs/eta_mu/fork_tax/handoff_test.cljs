(ns eta-mu.fork-tax.handoff-test
  (:require [clojure.string :as str]
            [cljs.test :refer [deftest is]]
            ["node:fs" :as fs]
            ["node:os" :as os]
            ["node:path" :as path]
            [eta-mu.fork-tax.domain.event :as event]
            [eta-mu.fork-tax.domain.handoff :as handoff]
            [eta-mu.fork-tax.extern.git :as git]
            [eta-mu.fork-tax.law.handoff :as law]))

(deftest tag-and-message-test
  (is (= "Π-20260709T121314Z"
         (handoff/make-tag-name "2026-07-09T12:13:14.123Z")))
  (is (= "Π Π-20260709T121314Z"
         (handoff/commit-message "Π-20260709T121314Z"))))

(deftest partition-status-test
  (let [entries [{:path "/repo/src/foo.cljs" :status " M"}
                 {:path "/repo/src-other/no.cljs" :status " M"}
                 {:path "/repo/dist/main.js" :status " M"}
                 {:path "/repo/checkout/file.cljs" :status " M"}
                 {:path "/repo/layout/file.cljs" :status " M"}
                 {:path "/repo/workout/file.cljs" :status " M"}
                 {:path "/repo/mytarget/file.cljs" :status " M"}]
        result (handoff/partition-status entries ["/repo/src"])]
    (is (= ["/repo/src/foo.cljs"] (mapv :path (:owned result))))
    (is (= ["/repo/src-other/no.cljs"
            "/repo/checkout/file.cljs"
            "/repo/layout/file.cljs"
            "/repo/workout/file.cljs"
            "/repo/mytarget/file.cljs"]
           (mapv :path (:concurrent result))))
    (is (= ["/repo/dist/main.js"] (mapv :path (:blocked result))))))

(deftest porcelain-z-test
  (let [entries (handoff/parse-porcelain-z
                 (str " M tracked.cljs\u0000"
                      "?? .ημ/\u0000"
                      "R  renamed.cljs\u0000old.cljs\u0000"))]
    (is (= [{:status " M" :path "tracked.cljs"}
            {:status "??" :path ".ημ/"}
            {:status "R " :path "renamed.cljs" :source-path "old.cljs"}]
           entries))))

(deftest ^:async porcelain-stdout-preservation-test
  (let [root (.mkdtempSync fs (path/join (.tmpdir os) "eta-mu-fork-tax-"))
        filename "🔧-tracked.txt"
        file (path/join root filename)]
    (try
      (is (zero? (:exit (await (git/exec-at root ["init" "--quiet"])))))
      (.writeFileSync fs file "first\n")
      (is (zero? (:exit (await (git/exec-at root ["add" filename])))))
      (is (zero? (:exit
                  (await
                   (git/exec-at root
                                ["-c" "user.name=Fork Tax Test"
                                 "-c" "user.email=fork-tax@example.invalid"
                                 "commit" "--quiet" "-m" "fixture"])))))
      (.writeFileSync fs file "second\n")
      (let [{:keys [exit stdout]}
            (await (git/exec-at root
                                ["status" "--porcelain=v1" "-z"]
                                {:preserve-stdout? true}))]
        (is (zero? exit))
        (is (str/starts-with? stdout (str " M " filename "\u0000")))
        (is (= [{:status " M" :path filename}]
               (handoff/parse-porcelain-z stdout))))
      (finally
        (.rmSync fs root #js {:recursive true :force true})))))

(deftest artifacts-test
  (let [plan {:repo-root "/repo"
              :branch "main"
              :sha "abc123"
              :tag-name "Π-1"
              :timestamp "2026-07-29T00:00:00.000Z"
              :owned [{:path "/repo/a.cljs"}]
              :concurrent [{:path "/repo/b.cljs"}]
              :blocked []}]
    (is (str/includes? (handoff/build-state-sexp plan) "Π-state"))
    (is (str/includes? (handoff/build-last-md plan) "b.cljs"))
    (is (= [".ημ/Π_STATE.sexp" ".ημ/Π_LAST.md" ".ημ/Π_EVENT.edn"]
           (handoff/build-manifest)))))

(deftest artifact-escaping-test
  (let [plan {:repo-root "/repo/<unsafe>&"
              :branch "feature/\"quoted\"\nnext"
              :sha "abc\\def"
              :tag-name "Π-`tag`"
              :timestamp "2026-07-29T00:00:00.000Z"
              :owned [{:path "src/\"quoted\"\\file\n.cljs"}]
              :concurrent []
              :blocked []}
        sexp (handoff/build-state-sexp plan)
        markdown (handoff/build-last-md plan)]
    (is (str/includes? sexp "feature/\\\"quoted\\\"\\nnext"))
    (is (str/includes? sexp "src/\\\"quoted\\\"\\\\file\\n.cljs"))
    (is (str/includes? markdown "<code>/repo/&lt;unsafe&gt;&amp;</code>"))
    (is (str/includes? markdown "<code>Π-`tag`</code>"))
    (is (str/includes? markdown
                       "src/&quot;quoted&quot;\\\\file\\n.cljs"))
    (is (not (str/includes? markdown "- `src/")))))

(deftest version-stamped-handoff-test
  (let [plan {:repo-root "/repo"
              :branch "main"
              :sha "abc123"
              :tag-name "Π-1"
              :owned []
              :concurrent []
              :blocked []}
        record (event/build-event
                {:event-id #uuid "00000000-0000-0000-0000-000000000003"
                 :recorded-at "2026-07-29T00:00:00.000Z"
                 :component-manifest {:eta-mu/version "1.1.1"}
                 :command "eta-mu fork-tax"
                 :producer {}
                 :subject {:repository/path "/repo"}
                 :refs [{:event/id
                         #uuid "00000000-0000-0000-0000-000000000001"}]}
                (handoff/event-payload plan))]
    (is (= :fork-tax/handoff-recorded (:event/type record)))
    (is (= law/package-version
           (get-in record [:event/producer :package/version])))
    (is (= 1 (get-in record [:event/schema :version])))
    (is (= 1 (count (:event/refs record))))))
