(ns rheos.backend.domain.task-create
  "Every decision a card creation makes: its identity, the status it enters at,
   where it is allowed to land, and the bytes of its file.

   Sibling of [[rheos.backend.domain.task-edit]] (frontmatter + comments) and
   [[rheos.backend.domain.transition]] (status moves): all three decide one write
   path each, and [[rheos.backend.infra.task-create]] performs this one — the
   single creation chokepoint — recording a ledger event for it. Creation used to
   be the exception — the subtask tool wrote a file and told nobody — which meant
   a card's existence was known only to the filesystem. It is a ledger fact now.

   Root cards and child cards are the same operation; `:parent` is just optional."
  (:require [clojure.string :as str]
            [rheos.backend.law.fsm :as fsm]
            [rheos.backend.law.frontmatter :as frontmatter-law]
            [rheos.backend.shape.content-parser :as content-parser]))

(def legacy-card-types
  "Creation vocabulary for boards that have not declared `:card-dirs`."
  #{"task" "epic"})

(defn card-types
  "The project's closed creation vocabulary. `:card-dirs` already maps card
   types to repository-valid locations, so its keys are the declaration. Legacy
   boards without that declaration retain task/epic compatibility."
  [project]
  (if-let [configured (seq (:card-dirs project))]
    (set (map (comp name key) configured))
    legacy-card-types))

(def conventional-dirs
  "Where each card type lives by convention, relative to the task root. Whether
   the directory is actually there is the orchestration's probe to make."
  {"epic" "epics" "task" "tasks"})

(defn refuse!
  "Throw a classified failure. `kind` is what the CLI maps to an exit code:
   `:usage`, `:not-found`, or `:refused`. Public because the orchestration in
   [[rheos.backend.infra.task-create]] refuses in the same vocabulary."
  [kind message data]
  (throw (ex-info message (assoc data :kind kind))))

(defn slugify
  "Filename-safe slug for a card title. Falls back to the card type so a title of
   only punctuation still produces a usable name."
  [title fallback]
  (let [slug (-> (str title)
                 str/lower-case
                 (str/replace #"[^a-z0-9]+" "-")
                 (str/replace #"^-+|-+$" ""))]
    (if (str/blank? slug) fallback slug)))

(defn initial-status
  "The status a new card must enter at: the project FSM's `:initial-state`.
   Creation does not get to pick an arbitrary starting status — that would let a
   card appear mid-workflow without ever passing a gate."
  [project]
  (or (:initial-state (fsm/resolve-fsm {:fsm (:fsm project)})) "incoming"))

(defn body-template
  "A skeleton body, so a created card is never empty. An empty card cannot pass a
   markdown-score gate, and a card that cannot pass its first gate is a trap."
  [title]
  (str "# " title "\n\n"
       "## Outcome\n\n"
       "_What is true when this is done._\n\n"
       "## Scope\n\n"
       "- _TODO_\n\n"
       "## Acceptance criteria\n\n"
       "- _TODO_"))

(defn check-request!
  "Validate what can be judged without looking at the board, and return the
   effective card type. Refuses a blank title, malformed dependencies, or a type
   outside the project's [[card-types]]."
  [{:keys [project title card-type dependency]}]
  (when (str/blank? title)
    (refuse! :usage "a card needs a --title" {}))
  (when-let [errors (seq (frontmatter-law/planning-value-errors
                          {:dependency (or dependency [])}))]
    (refuse! :usage (frontmatter-law/planning-value-errors-message errors)
             {:errors errors}))
  (let [allowed (card-types project)
        requested (some-> card-type str str/trim not-empty)
        card-type (or requested (when (contains? allowed "task") "task"))]
    (when-not card-type
      (refuse! :usage
               (str "this project declares card types "
                    (str/join ", " (sort allowed)) "; pass --type")
               {:card-types (sort allowed)}))
    (when-not (contains? allowed card-type)
      (refuse! :usage (str "unknown card type: " card-type
                           " (expected one of " (str/join ", " (sort allowed)) ")")
               {:card-type card-type :card-types (sort allowed)}))
    card-type))

(def uuid-pattern
  "The characters a card uuid may be spelled with.

   A uuid is not just an identifier: [[card-file-name]] puts its last eight
   characters into a file name, so it is also a path component. Anchoring the
   first character to alphanumeric rules out both a leading dot and a bare `..`,
   and omitting the separators rules out escaping the card directory."
  frontmatter-law/card-id-pattern)

(defn check-uuid!
  "Refuse a uuid that cannot safely become part of a file name, and return it
   trimmed. `nil` or blank means \"derive one from the title\" and is allowed
   through — [[slugify]] produces the derived form and is safe by construction.

   Only an explicitly requested uuid reaches this check, and only a caller who
   passed `--uuid` can fail it."
  [uuid]
  (when-let [requested (some-> uuid str/trim not-empty)]
    (when-not (re-matches uuid-pattern requested)
      (refuse! :usage
               (str "invalid uuid '" requested "': a uuid becomes part of the card's "
                    "file name, so it must start with a letter or digit and contain "
                    "only letters, digits, '.', '-' and '_'")
               {:uuid requested}))
    requested))

(defn check-card-dir!
  "Refuse a card directory the board would never scan, and return it otherwise.

   `resolved` is the already-resolved absolute directory and `dir` the request as
   written (for the message); `within?` is the caller's containment predicate,
   because what it means for one path to be inside another is a host question.
   The policy is this namespace's: a card must land inside the project's task
   root, and — when the project configures `:card-projection {:paths [...]}` —
   inside one of those paths, otherwise the card would be written somewhere the
   board never scans and would silently not exist."
  [project resolved dir within?]
  (let [tasks-dir (:tasks-dir project)]
    (when-not (within? tasks-dir resolved)
      (refuse! :refused (str "card directory escapes the project task root: " dir)
               {:tasks-dir tasks-dir :dir resolved}))
    (when-let [paths (seq (get-in project [:card-projection :paths]))]
      (when-not (some #(within? % resolved) paths)
        (refuse! :refused
                 (str "card directory " resolved " is outside this project's card projection; "
                      "the board would not discover the card. Configured paths: "
                      (str/join ", " paths))
                 {:dir resolved :paths (vec paths)})))
    resolved))

(defn decide-card
  "Decide a new card's identity and entry status against `existing`, every card
   already on the board.

   Refuses, rather than guessing, when: an explicit uuid is not spellable as a
   file name; the uuid is already taken; a named `:parent` does not exist; or an
   explicit `:status` is not the FSM's initial state (pass `:force-status?` to
   override deliberately).

   Returns `{:slug … :uuid … :status …}`."
  [{:keys [project title card-type parent status uuid force-status? existing]}]
  (let [by-uuid (into {} (map (juxt :uuid identity)) existing)
        slug (slugify title card-type)
        ;; Default the uuid to the title slug. Cards are addressed by uuid on
        ;; every CLI call, so a readable `rheos-cli-create-card` beats a random
        ;; v4 — which is what makes the difference between an agent citing a
        ;; card and an agent pasting a hex blob. A random suffix only appears
        ;; when the slug is taken.
        card-uuid (or (check-uuid! uuid)
                      (if (get by-uuid slug)
                        (str slug "-" (subs (str (random-uuid)) 0 8))
                        slug))
        expected-status (initial-status project)
        card-status (or (some-> status str/trim not-empty) expected-status)]
    (when (get by-uuid card-uuid)
      (refuse! :refused (str "a card with uuid '" card-uuid "' already exists")
               {:uuid card-uuid}))
    (when (and parent (not (get by-uuid parent)))
      (refuse! :not-found (str "unknown parent task: " parent) {:parent parent}))
    (when (and (not= card-status expected-status) (not force-status?))
      (refuse! :refused
               (str "a new card must start at the FSM initial state '" expected-status
                    "', not '" card-status "'. Create it and then `rheos move`, "
                    "or pass --force-status if you mean it.")
               {:status card-status :initial-state expected-status}))
    {:slug slug :uuid card-uuid :status card-status}))

(defn card-file-name
  "One deterministic file name for an exclusive create.

   A card whose uuid is the title slug owns `<slug>.md`. A deliberate or
   collision-derived uuid gets a suffix name. We never probe and then overwrite:
   the write itself decides whether this creation wins."
  [slug uuid]
  (if (= slug uuid)
    (str slug ".md")
    (str slug "-" (subs uuid (max 0 (- (count uuid) 8))) ".md")))

(defn frontmatter-pairs
  "Frontmatter as an ordered pair sequence, not a map.

   [[rheos.backend.shape.content-parser/serialize-frontmatter]] iterates whatever
   it is handed, and a CLJS map of this size is a hash map with arbitrary
   iteration order. Pairs keep new cards readable and diff-stable."
  [{:keys [uuid title status card-type priority points labels parent dependency
           category write-id created-at] :as card}]
  (cond-> [[:uuid uuid]
           [:title title]
           [:status status]
           [:type card-type]
           [:priority priority]]
    points        (conj [:points (str points)])
    (seq labels)  (conj [:labels (str/join ", " labels)])
    parent        (conj [:parent parent])
    (contains? card :dependency) (conj [:dependency (vec (or dependency []))])
    category      (conj [:category category])
    true          (conj [:write-id write-id])
    true          (conj [:created_at created-at])))

(defn render-card
  "The bytes of a new card file, plus the body they contain — the `task-created`
   event carries the body, so a fold can rebuild a card that has no file yet.

   Returns `{:raw … :body …}`."
  [{:keys [title body] :as card}]
  (let [card-body (if (str/blank? body) (body-template title) (str/trim body))]
    {:body card-body
     :raw (str (content-parser/serialize-frontmatter
                (frontmatter-pairs (update card :priority #(or % "P3"))))
               "\n\n" card-body "\n")}))
