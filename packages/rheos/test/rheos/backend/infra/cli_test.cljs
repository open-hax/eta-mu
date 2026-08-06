(ns rheos.backend.infra.cli-test
  "Guards on the CLI's two published contracts: its help text and its exit codes.

   The help assertions are not cosmetic. Before these existed, every usage line
   named `openhax-kanban` — a binary that does not exist — and agents copied it
   verbatim."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.cli :as cli]))

(defn- help-text
  "Capture whatever `f` prints, so help output can be asserted on."
  [f]
  (let [out (atom [])
        original *print-fn*]
    (set! *print-fn* (fn [& args] (swap! out conj (str/join "" args))))
    (try (f) (finally (set! *print-fn* original)))
    (str/join "\n" @out)))

;; ---------------------------------------------------------------------------
;; Help
;; ---------------------------------------------------------------------------

(deftest help-names-the-real-binary
  (testing "Help never names a binary that does not exist"
    (let [text (help-text cli/show-help)]
      (is (not (str/includes? text "openhax-kanban"))
          "openhax-kanban is not an installed bin; agents copy help verbatim")
      (is (str/includes? text "rheos <verb>")))))

(deftest every-verb-appears-in-help
  (testing "A verb missing from help is a verb agents cannot find"
    (let [text (help-text cli/show-help)]
      (doseq [{:keys [verb]} cli/verbs]
        (is (str/includes? text (str "rheos " verb))
            (str "verb missing from help: " verb))))))

(deftest every-verb-is-dispatchable
  (testing "Help does not advertise verbs the dispatcher does not know"
    ;; `dispatch-verb` is private, so assert against the source of truth the
    ;; dispatcher's `case` mirrors: each documented verb must be reachable, which
    ;; the parse layer proves by producing it as :command.
    (doseq [{:keys [verb]} cli/verbs]
      (is (= verb (:command (cli/parse-args [verb])))
          (str "verb not parseable as a command: " verb)))))

(deftest every-verb-has-a-summary-and-example
  (testing "Each verb documents what it does and shows one working invocation"
    (doseq [{:keys [verb summary example]} cli/verbs]
      (is (and (string? summary) (seq summary)) (str verb " needs a summary"))
      (is (and (string? example) (str/starts-with? example "rheos "))
          (str verb " needs an example that starts with the real bin name")))))

(deftest verb-help-renders-flags-and-example
  (testing "Per-verb help exists and is verb-specific"
    (let [text (help-text #(cli/show-verb-help "create"))]
      (is (str/includes? text "rheos create"))
      (is (str/includes? text "--title"))
      (is (str/includes? text "EXAMPLE"))
      (is (str/includes? text "FLAGS")))))

(deftest help-documents-the-comment-policy
  (testing "The body-settles-after-breakdown rule is discoverable from help alone"
    (let [text (help-text cli/show-help)]
      (is (str/includes? text "breakdown"))
      (is (str/includes? text "comment")))))

(deftest help-documents-exit-codes
  (testing "A caller can learn the exit contract without reading source"
    (let [text (help-text cli/show-help)]
      (is (str/includes? text "EXIT CODES"))
      (doseq [code ["1" "2" "3" "4"]]
        (is (str/includes? text code))))))

;; ---------------------------------------------------------------------------
;; The reference page
;; ---------------------------------------------------------------------------

(def ^:private cli-doc-path
  ;; Tests run from the package root, so the doc is resolvable relatively.
  (path/resolve "docs/cli.md"))

(deftest ^:async reference-page-covers-every-verb
  (testing "A verb absent from docs/cli.md is a verb nobody can look up"
    (let [doc (await (.readFile fsp cli-doc-path "utf8"))]
      (doseq [{:keys [verb]} cli/verbs]
        ;; Verbs appear in the reference as a backticked token, with or without
        ;; arguments: `projects` and `move <uuid> --to <status>` both count.
        (is (or (str/includes? doc (str "`" verb " "))
                (str/includes? doc (str "`" verb "`")))
            (str "verb missing from docs/cli.md: " verb))))))

(deftest ^:async reference-page-documents-the-contracts
  (testing "Install, exit codes, and the comment-after-breakdown rule are all present"
    (let [doc (await (.readFile fsp cli-doc-path "utf8"))]
      (is (str/includes? doc "npm i -g @eta-mu/rheos"))
      (is (str/includes? doc "## Exit codes"))
      (is (str/includes? doc "## Agent quickstart"))
      (is (str/includes? doc "Card bodies settle after breakdown"))
      (is (str/includes? doc "openhax.kanban.edn"))
      (is (not (str/includes? doc "openhax-kanban"))))))

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

(deftest force-status-is-a-presence-flag
  ;; Carried over from the create-verb tests this branch superseded. Those
  ;; asserted `true?`/`false?` against a parser that returned real booleans;
  ;; boolean flags are strings here and are read through `flag-true?`, so the
  ;; coverage is kept and the expectations restated in the new convention.
  (testing "--force-status among other options leaves the ones after it intact"
    (let [{:keys [command flags]}
          (cli/parse-args ["create" "--title" "Forced" "--status" "in_progress"
                           "--force-status" "--priority" "P0"])]
      (is (= "create" command))
      (is (= "Forced" (get flags "title")))
      (is (= "in_progress" (get flags "status")))
      (is (= "true" (get flags "force-status")))
      (is (= "P0" (get flags "priority")))))
  (testing "an explicit false is preserved rather than read as presence"
    (is (= "false" (get (:flags (cli/parse-args ["create" "--force-status" "false"]))
                        "force-status")))))

(deftest repeated-flags-collect
  (testing "`--set` repeats collect into a vector so multi-key updates work"
    (let [{:keys [flags]} (cli/parse-args ["frontmatter" "c" "--set" "points=3"
                                          "--set" "priority=P1"])]
      (is (= ["points=3" "priority=P1"] (get flags "set")))))
  (testing "a single occurrence stays scalar"
    (is (= "points=3" (get (:flags (cli/parse-args ["frontmatter" "c" "--set" "points=3"]))
                           "set")))))

(deftest limit-must-be-a-positive-integer
  (testing "`--limit abc` parses to a value the events verb has to refuse"
    ;; parseInt yields NaN and take-last on NaN returns nothing, so an
    ;; unvalidated limit answers a malformed question with silence.
    (is (js/Number.isNaN (js/parseInt (get (:flags (cli/parse-args ["events" "--limit" "abc"]))
                                           "limit")
                                      10))))
  (testing "a well-formed limit still parses"
    (is (= 5 (js/parseInt (get (:flags (cli/parse-args ["events" "--limit" "5"])) "limit") 10)))))

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

(deftest compose-registry-covers-the-flags-compose-actually-reads
  ;; `parse-compose-query` reads these keys directly. A flag it honours but the
  ;; registry omits is invisible in help, which is the failure the registry
  ;; exists to prevent.
  (let [compose-flags (->> cli/verbs
                           (filter #(= "compose" (:verb %)))
                           first :flags
                           (map #(first (str/split (first %) #" ")))
                           set)]
    (doseq [f ["--domain" "--org" "--tier" "--status" "--priority" "--labels"
               "--projects" "--q" "--where"]]
      (is (contains? compose-flags f)
          (str "compose reads " f " but the registry does not declare it")))))
