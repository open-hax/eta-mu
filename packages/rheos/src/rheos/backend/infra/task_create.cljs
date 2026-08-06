(ns rheos.backend.infra.task-create
  "The single creation chokepoint for cards: place the file, write it exclusively,
   and record a `task-created` ledger event.

   Every decision made along the way belongs to
   [[rheos.backend.domain.task-create]] — identity, entry status, placement
   policy, the bytes of the file. What is left here is only effect: the directory
   probe, the exclusive write, the watcher registration that lets the resulting
   file event correlate back to this mutation, and the ledger append."
  (:require ["node:fs/promises" :as fsp]
            ["node:path" :as path]
            [clojure.string :as str]
            [rheos.backend.domain.events :as events]
            [rheos.backend.domain.task-create :as task-create]
            [rheos.backend.infra.ledger :as ledger]
            [rheos.backend.infra.task-store :as tasks]
            [rheos.backend.infra.watcher :as watcher]))

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

   1. an explicit `dir` (resolved against the project's tasks-dir);
   2. the project's `:card-dirs` config for this type;
   3. the conventional `<tasks-dir>/epics` or `<tasks-dir>/tasks`, when it exists;
   4. the tasks-dir itself.

   The result is put to
   [[rheos.backend.domain.task-create/check-card-dir!]], which refuses anything
   that escapes the task root or falls outside the project's card projection."
  [project card-type dir]
  (let [tasks-dir (:tasks-dir project)
        configured (get-in project [:card-dirs (keyword card-type)])
        conventional (get task-create/conventional-dirs card-type)
        resolved (cond
                   dir (path/resolve tasks-dir dir)
                   configured (path/resolve tasks-dir configured)
                   (and conventional
                        (await (dir-exists? (path/join tasks-dir conventional))))
                   (path/join tasks-dir conventional)
                   :else tasks-dir)]
    (task-create/check-card-dir! project resolved dir within?)))

(defn- resolve-card-path
  "The absolute path a new card is written to, refused unless it is a direct
   child of the already-checked `card-dir`.

   [[rheos.backend.domain.task-create/check-uuid!]] is what stops a crafted uuid
   from reaching the file name in the first place; this re-checks the path the
   name actually resolves to, so no future change to naming can quietly reopen
   the escape that `path/join` normalization would otherwise permit."
  [card-dir file-name]
  (let [file-path (path/resolve card-dir file-name)]
    (when-not (= card-dir (path/dirname file-path))
      (task-create/refuse! :refused
                           (str "card file name escapes its directory: " file-name)
                           {:dir card-dir :file-name file-name :path file-path}))
    file-path))

(defn- ^:async write-card-exclusive!
  [file-path raw]
  (try
    (await (.writeFile fsp file-path raw #js {:encoding "utf8" :flag "wx"}))
    (catch :default e
      (if (= "EEXIST" (.-code e))
        (task-create/refuse! :refused
                             (str "a card file already exists at " file-path)
                             {:path file-path :cause :create-conflict})
        (throw e)))))

(defn ^:async create-task!
  "Create a card and record a `task-created` ledger event.

   Refuses, rather than guessing, when: the title is blank; the card type is
   unknown; the uuid is already taken; a named `:parent` does not exist; an
   explicit `:status` is not the FSM's initial state (pass `:force-status?` to
   override deliberately); or the target file already exists.

   Returns `{:ok true :uuid … :title … :status … :source-path … :card-type …}`."
  [{:keys [project title card-type parent status priority points labels body
           dir uuid source force-status?]}]
  (when-not project
    (task-create/refuse! :not-found "unknown project" {}))
  (let [card-type (task-create/check-request! {:title title :card-type card-type})
        existing (await (tasks/load-tasks (:tasks-dir project)))
        decision (task-create/decide-card {:project project :title title
                                           :card-type card-type :parent parent
                                           :status status :uuid uuid
                                           :force-status? force-status?
                                           :existing existing})
        card-uuid (:uuid decision)
        card-status (:status decision)
        card-dir (await (resolve-card-dir project card-type dir))
        file-path (resolve-card-path
                   card-dir (task-create/card-file-name (:slug decision) card-uuid))
        write-id (events/generate-write-id)
        card (task-create/render-card {:uuid card-uuid
                                       :title title
                                       :status card-status
                                       :card-type card-type
                                       :priority priority
                                       :points points
                                       :labels (vec (or labels []))
                                       :parent parent
                                       :category (path/basename card-dir)
                                       :write-id write-id
                                       :created-at (.toISOString (new js/Date))
                                       :body body})]
    (await (.mkdir fsp card-dir #js {:recursive true}))
    (watcher/register-cli-event! write-id card-uuid)
    (await (write-card-exclusive! file-path (:raw card)))
    (await (events/emit-task-created!
            (ledger/get-ledger (:tasks-dir project))
            (:id project) card-uuid
            {:title title :card-type card-type :status card-status
             :parent parent :source-path file-path :body (:body card)}
            write-id source))
    {:ok true :uuid card-uuid :title title :status card-status
     :card-type card-type :parent parent :source-path file-path}))
