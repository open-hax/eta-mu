(ns eta-mu.shape.command-resource
  "Command resources — CLI subcommands declared as data rather than compiled in.

   A command resource says what a subcommand is called, what it does, and which
   script implements it. eta-mu discovers them at startup and dispatches to
   them, so adding a subcommand needs no rebuild of this binary.

   The boundary is deliberately **data in, data out**. eta-mu hands the script a
   context map as EDN in `ETA_MU_CONTEXT` and reads its exit code; argv stays
   exactly what the user typed. The script gets no
   in-process handle on eta-mu's internals. A script that needs eta-mu behaviour
   shells back to `eta-mu ...`, which is already a stable surface with a
   published exit contract.

   That is a real constraint, chosen on purpose: an injected context map would
   become a public interface the moment it shipped, shaped by whichever
   extension happened to exist first. There is nothing to version here.

   This namespace is pure. Discovery and spawning live in infra."
  (:require [clojure.string :as str]))

(def runtimes
  "Script runtimes a command resource may name.

   `bb` is for repository tooling — GraalVM-native, effectively instant, and
   carries clj-yaml. `nbb` is for extensions that need Node or npm interop, at
   roughly 100ms startup. The split is a decision, not an accident: a command
   that reads EDN and writes files wants bb; one that reaches into the JS
   ecosystem wants nbb."
  #{:bb :nbb})

(defn- blank? [s] (or (nil? s) (and (string? s) (str/blank? s))))

(defn problems
  "Why `resource` is not a usable command resource. Empty when it is.

   Returns a vector so a caller can report every problem at once rather than
   making the author fix them one run at a time."
  [resource]
  (cond-> []
    (not (map? resource))
    (conj "not a map")

    (and (map? resource) (not= :command (:contract/kind resource)))
    (conj (str "expected :contract/kind :command, got " (pr-str (:contract/kind resource))))

    (and (map? resource) (blank? (:command/name resource)))
    (conj "missing :command/name")

    (and (map? resource) (blank? (:command/summary resource)))
    (conj "missing :command/summary — a command nobody can describe is a command nobody will find")

    (and (map? resource) (blank? (:command/script resource)))
    (conj "missing :command/script")

    (and (map? resource) (not (contains? runtimes (:command/runtime resource))))
    (conj (str "unknown :command/runtime " (pr-str (:command/runtime resource))
               " — known: " (str/join ", " (sort (map name runtimes)))))

    ;; A resource naming a built-in would shadow it, and the shadowing would be
    ;; silent. Refuse instead; the registry decides precedence, not load order.
    (and (map? resource) (str/starts-with? (str (:command/name resource)) "-"))
    (conj "command name must not start with a dash")))

(defn valid? [resource] (empty? (problems resource)))

(defn resource->command
  "Project a command resource onto a registry entry.

   `dispatch` is the effectful runner, injected so this namespace stays pure and
   the projection stays testable without spawning anything. It is called as
   `(dispatch resource context)` — both arguments, because a handler closed over
   only one of them silently loses the other, which is exactly the bug this
   arity was written to make impossible to reintroduce."
  [resource dispatch]
  {:name (:command/name resource)
   :description (:command/summary resource)
   :resource resource
   :handler (fn [context] (dispatch resource context))})

(defn collect
  "Split a sequence of parsed resources into usable commands and rejections.

   Rejections are returned rather than thrown: one malformed file should not
   stop every other command from loading, but it must also not vanish."
  [resources]
  (reduce (fn [acc r]
            (let [probs (problems r)]
              (if (seq probs)
                (update acc :rejected conj {:resource r :problems probs})
                (update acc :commands conj r))))
          {:commands [] :rejected []}
          resources))

(defn conflicts
  "Names claimed by more than one resource, or already claimed by a built-in.

   Built-ins win. A resource cannot redefine `kanban` or `receipt` by being
   loaded later — precedence is a property of the registry, not of file order."
  [built-in-names resources]
  (let [built-in (set built-in-names)
        names (map :command/name resources)]
    {:shadowing (vec (sort (distinct (filter built-in names))))
     :duplicated (vec (sort (map key (filter #(> (val %) 1) (frequencies names)))))}))

(defn context-for
  "The EDN payload handed to a command script.

   Deliberately small and deliberately data. Everything here is something the
   script could have discovered itself; passing it saves the script from
   guessing, and keeps eta-mu the one deciding what a command may assume."
  [{:keys [cwd repo-root args flags version]}]
  {:eta-mu/version version
   :command/cwd cwd
   :command/repo-root repo-root
   :command/args (vec args)
   :command/flags (or flags {})})
