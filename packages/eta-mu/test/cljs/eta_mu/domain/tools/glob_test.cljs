(ns eta-mu.domain.tools.glob-test
  (:require [cljs.test :refer [deftest is testing]]
            [eta-mu.domain.tools.glob :as glob]))

(deftest match-star-test
  (testing "* matches any chars except /"
    (is (glob/match? "*.ts" "index.ts"))
    (is (not (glob/match? "*.ts" "src/index.ts")))))

(deftest match-globstar-test
  (testing "** matches across directory separators"
    (is (glob/match? "**/*.ts" "src/deep/index.ts"))
    (is (glob/match? "src/**/*.spec.ts" "src/a/b/foo.spec.ts"))
    (is (not (glob/match? "src/**/*.spec.ts" "lib/a/foo.spec.ts")))))

(deftest match-question-mark-test
  (testing "? matches exactly one char, not /"
    (is (glob/match? "a?c" "abc"))
    (is (not (glob/match? "a?c" "a/c")))))

(deftest ignored-basename-pattern-test
  (testing "a slash-free ignore pattern matches by basename anywhere"
    (is (glob/ignored? ["*.log"] "deep/nested/debug.log"))
    (is (not (glob/ignored? ["*.log"] "deep/nested/debug.txt")))))

(deftest ignored-rooted-pattern-test
  (testing "a pattern containing / matches the full relative path"
    (is (glob/ignored? ["dist/output.js"] "dist/output.js"))
    (is (not (glob/ignored? ["dist/output.js"] "other/dist/output.js")))))

(deftest parse-gitignore-test
  (testing "parses lines, skipping blanks, comments, and negations"
    (is (= ["node_modules" "*.log"]
           (glob/parse-gitignore "# comment\n\nnode_modules\n*.log\n!keep.log\n")))))
