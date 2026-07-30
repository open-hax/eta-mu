(ns rheos.backend.infra.cli-test
  "Guards on the CLI's exit contract and argument parsing.

   Help-output and reference-page coverage arrive with the verb registry in the
   next card; this namespace covers the behaviour a scripted caller depends on."
  (:require [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.cli :as cli]))

;; ---------------------------------------------------------------------------
;; Exit contract
;; ---------------------------------------------------------------------------

(deftest exit-codes-are-stable
  (testing "The published mapping — changes here are breaking for every caller"
    (is (= {:ok 0 :usage 1 :not-found 2 :refused 3 :internal 4} cli/exit-codes))))

;; ---------------------------------------------------------------------------
;; Argument parsing
;; ---------------------------------------------------------------------------

(deftest parses-verb-positional-and-flags
  (testing "verb, positional, and valued flags"
    (let [{:keys [command subcommand flags]}
          (cli/parse-args ["move" "my-card" "--to" "review" "--project" "kanban"])]
      (is (= "move" command))
      (is (= "my-card" subcommand))
      (is (= "review" (get flags "to")))
      (is (= "kanban" (get flags "project"))))))

(deftest boolean-flags-do-not-swallow-the-next-flag
  (testing "`--json --project x` parses both, rather than --json eating --project"
    (let [{:keys [flags]} (cli/parse-args ["read-board" "--json" "--project" "kanban"])]
      (is (= "true" (get flags "json")))
      (is (= "kanban" (get flags "project")))))
  (testing "an explicit true/false is still honoured"
    (is (= "false" (get (:flags (cli/parse-args ["board" "list" "--verbose" "false"]))
                        "verbose")))))

(deftest repeated-flags-collect
  (testing "`--set` repeats collect into a vector so multi-key updates work"
    (let [{:keys [flags]} (cli/parse-args ["frontmatter" "c" "--set" "points=3"
                                          "--set" "priority=P1"])]
      (is (= ["points=3" "priority=P1"] (get flags "set")))))
  (testing "a single occurrence stays scalar"
    (is (= "points=3" (get (:flags (cli/parse-args ["frontmatter" "c" "--set" "points=3"]))
                           "set")))))

(deftest values-may-start-with-dashes
  (testing "A non-boolean flag consumes its next token even if it looks like a flag"
    (is (= "--not-a-flag"
           (get (:flags (cli/parse-args ["comment" "c" "--text" "--not-a-flag"])) "text")))))

(deftest bare-flags-parse-without-a-verb
  (testing "`rheos --help` yields no command, so help works with no board present"
    (let [{:keys [command flags]} (cli/parse-args ["--help"])]
      (is (nil? command))
      (is (= "true" (get flags "help"))))))

(deftest verb-help-flag-is-recognised
  (testing "`rheos move --help` keeps the verb and sets the help flag"
    (let [{:keys [command flags]} (cli/parse-args ["move" "--help"])]
      (is (= "move" command))
      (is (= "true" (get flags "help"))))))
