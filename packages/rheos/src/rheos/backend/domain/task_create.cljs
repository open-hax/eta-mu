(ns rheos.backend.domain.task-create
  "The single creation chokepoint for cards.

   Sibling of [[rheos.backend.domain.task-edit]] (frontmatter + comments) and
   [[rheos.backend.domain.transition]] (status moves): all three own one write
   path each, and every one of them records a ledger event. Creation used to be
   the exception — the subtask tool wrote a file and told nobody — which meant a
   card's existence was known only to the filesystem. It is a ledger fact now.

   Root cards and child cards are the same operation; `:parent` is just optional."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.events :as events]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.infra.watcher :as watcher]
            [rheos.backend.law.fsm :as fsm]
            [rheos.backend.shape.content-parser :as content-parser]))

(def card-types #{"task" "epic"})

(def ^:private conventional-dirs {"epic" "epics" "task" "tasks"})

(defn- refuse!
  "Throw a classified failure. `kind` is what the CLI maps to an exit code:
   `:usage`, `:not-found`, or `:refused`."
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

(defn- ^:async dir-exists? [dir-path]
  (try
    (.isDirectory (await (.stat fsp dir-path)))
    (catch :default _ false)))

(defn- within?
  "Is `candidate` inside `root` (or root itself)?"
  [root candidate]
  (or (= root candidate)
      (str/starts-with? candidate (str root path/sep))))

(defn ^:async resolve-card-dir
  "Where a new card of `card-type` belongs, in precedence order:

   1. an explicit `dir` (resolved against the project's tasks-dir, and refused if
      it escapes it);
   2. the project's `:card-dirs` config for this type;
   3. the conventional `<tasks-dir>/epics` or `<tasks-dir>/tasks`, when it exists;
   4. the tasks-dir itself.

   When the project configures `:card-projection {:paths [...]}`, the result must
   fall inside one of those paths — otherwise the card would be written somewhere
   the board never scans, and would silently not exist."
  [project card-type dir]
  (let [tasks-dir (:tasks-dir project)
        configured (get-in project [:card-dirs (keyword card-type)])
        conventional (get conventional-dirs card-type)
        resolved (cond
                   dir (path/resolve tasks-dir dir)
                   configured (path/resolve tasks-dir configured)
                   (and conventional
                        (await (dir-exists? (path/join tasks-dir conventional))))
                   (path/join tasks-dir conventional)
                   :else tasks-dir)]
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

(defn- card-file-path
  "Choose one deterministic path for an exclusive create.

   A card whose uuid is the title slug owns `<slug>.md`. A deliberate or
   collision-derived uuid gets a suffix path. We never probe and then overwrite:
   the write itself decides whether this creation wins."
  [dir slug uuid]
  (if (= slug uuid)
    (path/join dir (str slug ".md"))
    (let [suffix (subs uuid (max 0 (- (count uuid) 8)))]
      (path/join dir (str slug "-" suffix ".md")))))

(defn- ^:async write-card-exclusive!
  [file-path raw]
  (try
    (await (.writeFile fsp file-path raw #js {:encoding "utf8" :flag "wx"}))
    (catch :default e
      (if (= "EEXIST" (.-code e))
        (refuse! :refused
                 (str "a card file already exists at " file-path)
                 {:path file-path :cause :create-conflict})
        (throw e)))))

(defn frontmatter-pairs
  "Frontmatter as an ordered pair sequence, not a map.

   [[rheos.backend.shape.content-parser/serialize-frontmatter]] iterates whatever
   it is handed, and a CLJS map of this size is a hash map with arbitrary
   iteration order. Pairs keep new cards readable and diff-stable."
  [{:keys [uuid title status card-type priority points labels parent
           category write-id created-at]}]
  (cond-> [[:uuid uuid]
           [:title title]
           [:status status]
           [:type card-type]
           [:priority priority]]
    points        (conj [:points (str points)])
    (seq labels)  (conj [:labels (str/join ", " labels)])
    parent        (conj [:parent parent])
    category      (conj [:category category])
    true          (conj [:write-id write-id])
    true          (conj [:created_at created-at])))

(defn ^:async create-task!
  "Create a card and record a `task-created` ledger event.

   Refuses, rather than guessing, when: the title is blank; the card type is
   unknown; the uuid is already taken; a named `:parent` does not exist; or an
   explicit `:status` is not the FSM's initial state (pass `:force-status?` to
   override deliberately).

   Returns `{:ok true :uuid … :title … :status … :source-path … :card-type …}`."
  [{:keys [project title card-type parent status priority points labels body
           dir uuid source force-status?]}]
  (when-not project
    (refuse! :not-found "unknown project" {}))
  (when (str/blank? title)
    (refuse! :usage "a card needs a --title" {}))
  (let [card-type (or card-type "task")]
    (when-not (card-types card-type)
      (refuse! :usage (str "unknown card type: " card-type
                           " (expected one of " (str/join ", " (sort card-types)) ")")
               {:card-type card-type}))
    (let [existing (await (tasks/load-tasks (:tasks-dir project)))
          by-uuid (into {} (map (juxt :uuid identity)) existing)
          slug (slugify title card-type)
          ;; Default the uuid to the title slug. Cards are addressed by uuid on
          ;; every CLI call, so a readable `rheos-cli-create-card` beats a random
          ;; v4 — which is what makes the difference between an agent citing a
          ;; card and an agent pasting a hex blob. A random suffix only appears
          ;; when the slug is taken.
          card-uuid (or (some-> uuid str/trim not-empty)
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
      (let [card-dir (await (resolve-card-dir project card-type dir))
            file-path (card-file-path card-dir slug card-uuid)
            write-id (events/generate-write-id)
            card-body (if (str/blank? body) (body-template title) (str/trim body))
            raw (str (content-parser/serialize-frontmatter
                      (frontmatter-pairs
                       {:uuid card-uuid
                        :title title
                        :status card-status
                        :card-type card-type
                        :priority (or priority "P3")
                        :points points
                        :labels (vec (or labels []))
                        :parent parent
                        :category (path/basename card-dir)
                        :write-id write-id
                        :created-at (.toISOString (new js/Date))}))
                     "\n\n" card-body "\n")]
        (await (.mkdir fsp card-dir #js {:recursive true}))
        (watcher/register-cli-event! write-id card-uuid)
        (await (write-card-exclusive! file-path raw))
        (await (events/emit-task-created!
                (ledger/get-ledger (:tasks-dir project))
                (:id project) card-uuid
                {:title title :card-type card-type :status card-status
                 :parent parent :source-path file-path :body card-body}
                write-id source))
        {:ok true :uuid card-uuid :title title :status card-status
         :card-type card-type :parent parent :source-path file-path}))))
