(ns rheos.backend.law.fsm
  "Config-driven FSM engine.

   Transitions carry a `:check` keyword resolved against the FSM's `:checks` map.
   Structural validity (does an edge exist?) and WIP limits are decided purely by
   [[evaluate-transition]]. Side-effecting gates — checks whose spec is
   `{:type :command ...}` — run their shell commands via [[run-gate]] only after the
   structural check passes, so a move into a gated state (e.g. `in_progress` ->
   `review`) is rejected unless the project's build/lint/test commands all succeed."
  (:require ["node:child_process" :as cp]))

(def default-fsm
  {:enabled true
   :enforcement :supportive
   :states ["incoming" "breakdown" "ready" "in_progress" "review" "done"]
   :initial-state "incoming"
   :transitions
   [{:from ["incoming"] :to ["breakdown"] :check :markdown-score}
    {:from ["breakdown"] :to ["ready" "incoming"] :check :agent-review}
    {:from ["ready"] :to ["in_progress" "breakdown"] :check :wip-available}
    {:from ["in_progress"] :to ["review" "todo" "breakdown"] :check :build-gate}
    {:from ["review"] :to ["done" "in_progress"] :check :code-review}
    {:from ["done"] :to ["incoming"] :check :always-allow}]
   :checks
   {:markdown-score {:type :built-in} :agent-review {:type :built-in}
    :wip-available {:type :built-in} :build-gate {:type :built-in}
    :code-review {:type :built-in} :always-allow {:type :built-in}}
   :wip-limits {"in_progress" 10 "review" 5 "review_backlog_threshold" 5}})

(def promethean-fsm
  {:enabled true
   :enforcement :supportive
   :states ["icebox" "incoming" "accepted" "breakdown" "blocked" "ready"
            "todo" "in_progress" "testing" "review" "document" "done"
            "rejected" "archived"]
   :initial-state "incoming"
   :transitions
   [{:from ["icebox"] :to ["incoming"] :check :always-allow}
    {:from ["incoming"] :to ["icebox" "accepted"] :check :always-allow}
    {:from ["accepted"] :to ["breakdown" "incoming"] :check :always-allow}
    {:from ["breakdown"] :to ["ready" "accepted" "blocked"] :check :always-allow}
    {:from ["blocked"] :to ["breakdown" "ready"] :check :always-allow}
    {:from ["ready"] :to ["todo" "breakdown"] :check :always-allow}
    {:from ["todo"] :to ["in_progress"] :check :wip-available}
    ;; Sending work back (todo/breakdown) or into testing is free, but promoting
    ;; straight to `review` is gated: the project must build, lint, and test clean.
    {:from ["in_progress"] :to ["testing" "todo" "breakdown"] :check :always-allow}
    {:from ["in_progress"] :to ["review"] :check :build-gate}
    {:from ["testing"] :to ["review" "in_progress" "todo"] :check :always-allow}
    {:from ["review"] :to ["document" "in_progress" "todo"] :check :always-allow}
    {:from ["document"] :to ["done" "review"] :check :always-allow}
    ;; `done` may be reopened straight back to `review` (re-review) as well as iceboxed.
    {:from ["done"] :to ["icebox" "review"] :check :always-allow}
    {:from ["accepted" "breakdown" "blocked" "ready" "todo" "in_progress" "review" "document"]
     :to ["rejected"] :check :always-allow}
    {:from ["icebox" "incoming" "accepted" "breakdown" "blocked" "ready"
            "todo" "in_progress" "testing" "review" "document" "done" "rejected"]
     :to ["archived"] :check :always-allow}]
   :checks {:always-allow {:type :built-in}
            :wip-available {:type :built-in}
            :build-gate {:type :command
                         :commands ["pnpm build" "pnpm lint" "pnpm test"]}}
   :wip-limits
   {"accepted" 40 "breakdown" 50 "blocked" 15 "ready" 100 "todo" 75
    "in_progress" 50 "testing" 40 "review" 40 "document" 40
    "done" 500 "rejected" 9999 "icebox" 9999 "incoming" 9999 "archived" 9999}})

(defn resolve-fsm
  "Resolve a project's `:fsm` config into a concrete FSM map.

   A map with `:extends \"promethean\"` overlays just the build-gate command
   list (and optional :cwd) onto promethean-fsm, so a non-JS project can swap
   in its own build/lint/test commands without redefining the whole FSM
   in JSON (whose string values can't become the :command keyword the
   built-in checks match on)."
  [board-config]
  (let [fsm-cfg (:fsm board-config)]
    (cond (nil? fsm-cfg) default-fsm
          (= "promethean" fsm-cfg) promethean-fsm
          (and (map? fsm-cfg) (= "promethean" (:extends fsm-cfg)))
          (cond-> promethean-fsm
            (:buildGateCommands fsm-cfg)
            (assoc-in [:checks :build-gate]
                      {:type :command
                       :commands (:buildGateCommands fsm-cfg)
                       :cwd (:cwd fsm-cfg)}))
          (map? fsm-cfg) fsm-cfg
          :else default-fsm)))

(defn- check-wip-limit [fsm to-status current-counts]
  (let [limit (get-in fsm [:wip-limits to-status] 9999)
        current (get current-counts to-status 0)]
    {:ok? (< current limit) :current current :limit limit}))

(defn evaluate-transition
  "Pure structural + WIP decision for `from-status` -> `to-status`. Does NOT run
   command gates — those are side-effecting and handled by [[run-gate]], which keys
   off the `:check` / `:check-spec` returned here. A truthy `:allowed?` means the edge
   exists and any WIP limit is satisfied; the caller must still clear the gate."
  [fsm from-status to-status current-counts]
  (let [transitions (:transitions fsm)
        matching (first (filter (fn [t] (and (some #(= from-status %) (:from t))
                                             (some #(= to-status %) (:to t))))
                                transitions))
        check-id (:check matching)
        check-spec (get-in fsm [:checks check-id])]
    (cond
      (nil? matching) {:allowed? false :reason (str "No transition from '" from-status "' to '" to-status "'")}
      (= :wip-available check-id)
      (let [wip (check-wip-limit fsm to-status current-counts)]
        (if (:ok? wip) {:allowed? true :reason "WIP available" :check check-id :check-spec check-spec}
            {:allowed? false :reason (str "WIP limit reached: " (:current wip) "/" (:limit wip))}))
      :else {:allowed? true :reason "Allowed" :check check-id :check-spec check-spec})))

(defn- run-command
  "Run shell command string `cmd` in `cwd`, streaming its output. Resolves to the
   numeric exit code (1 if the process fails to spawn)."
  [cmd cwd]
  (js/Promise.
   (fn [resolve _reject]
     (let [child (.spawn cp cmd #js [] #js {:cwd cwd :shell true :stdio "inherit"})]
       (.on child "error" (fn [_] (resolve 1)))
       (.on child "close" (fn [code] (resolve (if (number? code) code 1))))))))

(defn ^:async run-command-gate
  "Run each command in `check-spec` sequentially in `cwd`. The first non-zero exit
   short-circuits to a rejection; all-clear allows the transition."
  [check-spec cwd]
  (let [commands (vec (:commands check-spec))]
    (loop [i 0]
      (if (>= i (count commands))
        {:allowed? true :reason "Build gate passed"}
        (let [cmd (nth commands i)]
          (js/console.error (str "▶ build-gate: " cmd))
          (let [code (await (run-command cmd cwd))]
            (if (zero? code)
              (recur (inc i))
              {:allowed? false
               :reason (str "Build gate failed: `" cmd "` exited with code " code)})))))))

(defn ^:async run-gate
  "Execute any side-effecting gate for an already structurally-allowed `decision`.
   Command-type checks run their commands (in `(:cwd check-spec)` or `default-cwd`);
   every other check passes through unchanged."
  [decision default-cwd]
  (let [spec (:check-spec decision)]
    (if (= :command (:type spec))
      (await (run-command-gate spec (or (:cwd spec) default-cwd)))
      {:allowed? true :reason (:reason decision)})))

(defn valid-targets [fsm from-status]
  (vec (mapcat :to (filter #(some (fn [s] (= from-status s)) (:from %)) (:transitions fsm)))))
