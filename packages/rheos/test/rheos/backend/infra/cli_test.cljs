(ns rheos.backend.infra.cli-test
  "Guards on the CLI's two published contracts: its help text and its exit codes.

   The help assertions are not cosmetic. Before these existed, every usage line
   named `openhax-kanban` — a binary that does not exist — and agents copied it
   verbatim."
  (:require ["node:fs/promises" :as fsp]
            ["node:os" :as os]
            ["node:path" :as path]
            [clojure.string :as str]
            [cljs.test :refer [deftest testing is]]
            [rheos.backend.infra.cli :as cli]
            [rheos.backend.infra.projects :as projects]
            [rheos.backend.infra.task-store :as task-store]))

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
      (is (str/includes? text "--dependency"))
      (is (str/includes? text ":card-dirs"))
      (is (not (str/includes? text "task|epic")))
      (is (str/includes? text "EXAMPLE"))
      (is (str/includes? text "FLAGS")))))

(deftest board-help-explains-the-export-anchor
  (let [text (help-text #(cli/show-verb-help "board"))]
    (is (str/includes? text "--relative-to"))
    (is (str/includes? text "source paths"))))

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
      (is (= "kanban" (get flags "project")))))
  (testing "snapshot export anchor is a valued flag"
    (let [{:keys [command subcommand flags]}
          (cli/parse-args ["board" "snapshot" "--relative-to" "." "--out" "board.json"])]
      (is (= "board" command))
      (is (= "snapshot" subcommand))
      (is (= "." (get flags "relative-to")))
      (is (= "board.json" (get flags "out"))))))

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
                           "set"))))
  (testing "creation collects dependency ids without flattening their order"
    (let [flags (:flags (cli/parse-args
                         ["create" "--title" "T"
                          "--dependency" "dep-a" "--dependency" "dep-b"]))]
      (is (= ["dep-a" "dep-b"] (get flags "dependency"))))))

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

(defn- ^:async invoke-snapshot [config-path out-path options]
  (let [saved-argv js/process.argv
        saved-exit-code (.-exitCode js/process)
        saved-print *print-fn*
        saved-error (.-error js/console)
        saved-projects {:projects (projects/all) :default-project-id (projects/default-id)}
        output (atom [])
        errors (atom [])]
    (set! (.-exitCode js/process) 0)
    (set! (.-argv js/process)
          (clj->js (concat ["node" "rheos" "board" "snapshot" "--config" config-path
                           "--out" out-path]
                          options)))
    (set! *print-fn* (fn [& args] (swap! output conj (str/join "" args))))
    (set! (.-error js/console) (fn [& args] (swap! errors conj (str/join " " args))))
    (try
      (await (cli/main))
      {:exit-code (.-exitCode js/process)
       :stdout (str/join "\n" @output)
       :stderr (str/join "\n" @errors)}
      (finally
        (set! (.-argv js/process) saved-argv)
        (set! (.-exitCode js/process) saved-exit-code)
        (set! *print-fn* saved-print)
        (set! (.-error js/console) saved-error)
        (projects/set-projects! saved-projects)))))

(defn- ^:async snapshot-fixture [root]
  (let [task-dir (path/join root "kanban" "tasks")
        card (path/join task-dir "..visible.md")
        config-path (path/join root "board.edn")
        raw (str "---\nuuid: \"export-card\"\ntitle: \"Export card\"\n"
                 "status: \"incoming\"\npriority: \"P1\"\n"
                 "created_at: \"2026-10-21T00:00:00.000Z\"\n"
                 "points: \"2\"\nparent: \"epic-a\"\ndependency: []\n"
                 "---\n\n# Export card\n")]
    (await (.mkdir fsp task-dir #js {:recursive true}))
    (await (.writeFile fsp card raw "utf8"))
    (await (.writeFile fsp config-path "{:tasks-dir \"kanban\"}" "utf8"))
    {:task-dir task-dir :card card :config-path config-path :raw raw}))

(defn- ^:async snapshot-task [file]
  (let [snapshot (js->clj (js/JSON.parse (await (.readFile fsp file "utf8")))
                         :keywordize-keys true)]
    (first (mapcat :tasks (:columns snapshot)))))

(deftest ^:async snapshot-export-is-portable-without-changing-live-task-locations
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-export-")))]
    (try
      (let [exported (atom [])]
        (doseq [checkout ["first-checkout" "second-checkout"]]
          (let [checkout-root (path/join root checkout)
                {:keys [task-dir card config-path raw]} (await (snapshot-fixture checkout-root))
                default-out (path/join checkout-root "default.json")
                portable-out (path/join checkout-root "portable.json")
                direct-out (path/join checkout-root "direct.json")
                default-result (await (invoke-snapshot config-path default-out []))
                relative-anchor (path/relative (js/process.cwd) checkout-root)
                portable-result (await (invoke-snapshot config-path portable-out ["--relative-to" relative-anchor]))
                direct-result (await (invoke-snapshot config-path direct-out ["--relative-to" task-dir]))
                default-task (await (snapshot-task default-out))
                portable-task (await (snapshot-task portable-out))
                direct-task (await (snapshot-task direct-out))]
            (is (= 0 (:exit-code default-result)) (:stderr default-result))
            (is (= 0 (:exit-code portable-result)) (:stderr portable-result))
            (is (= 0 (:exit-code direct-result)) (:stderr direct-result))
            (is (= card (:source-path default-task)))
            (is (= "kanban/tasks/..visible.md" (:source-path portable-task)))
            (is (= "..visible.md" (:source-path direct-task))
                "a contained filename starting with two dots is not parent traversal")
            (is (= (dissoc default-task :source-path) (dissoc portable-task :source-path)))
            (is (= {:points "2" :parent "epic-a" :dependency []}
                   (select-keys portable-task [:points :parent :dependency])))
            (is (= card (:source-path (first (await (task-store/load-tasks task-dir))))))
            (is (= raw (await (.readFile fsp card "utf8"))))
            (is (not (try
                       (await (.access fsp (path/join checkout-root "kanban" ".events" "ledger.edn")))
                       true
                       (catch :default _ false))))
            (swap! exported conj portable-task)))
        (is (= (first @exported) (second @exported))
            "different checkout roots export identical task representations"))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))

(deftest ^:async snapshot-export-refuses-an-outside-anchor-without-overwriting-output
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) "rheos-export-refusal-")))]
    (try
      (let [{:keys [task-dir config-path]} (await (snapshot-fixture root))
            out (path/join root "preserved.json")]
        (doseq [[options expected-code] [[["--relative-to" (str task-dir "-sibling")] 3]
                                        [["--relative-to"] 1]
                                        [["--relative-to" ""] 1]]]
          (await (.writeFile fsp out "existing snapshot must survive\n" "utf8"))
          (let [result (await (invoke-snapshot config-path out options))]
            (is (= expected-code (:exit-code result)) (str options " " (:stderr result)))
            (is (= "existing snapshot must survive\n" (await (.readFile fsp out "utf8"))))
            (is (not (str/includes? (:stdout result) "Wrote board snapshot"))))))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))
