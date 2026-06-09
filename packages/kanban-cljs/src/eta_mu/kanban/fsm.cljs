(ns eta-mu.kanban.fsm
  "Config-driven FSM engine.")

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
    {:from ["in_progress"] :to ["testing" "todo" "breakdown"] :check :always-allow}
    {:from ["testing"] :to ["review" "in_progress" "todo"] :check :always-allow}
    {:from ["review"] :to ["document" "in_progress" "todo"] :check :always-allow}
    {:from ["document"] :to ["done" "review"] :check :always-allow}
    {:from ["done"] :to ["icebox"] :check :always-allow}
    {:from ["accepted" "breakdown" "blocked" "ready" "todo" "in_progress" "review" "document"]
     :to ["rejected"] :check :always-allow}
    {:from ["icebox" "incoming" "accepted" "breakdown" "blocked" "ready"
            "todo" "in_progress" "testing" "review" "document" "done" "rejected"]
     :to ["archived"] :check :always-allow}]
   :checks {:always-allow {:type :built-in} :wip-available {:type :built-in}}
   :wip-limits
   {"accepted" 40 "breakdown" 50 "blocked" 15 "ready" 100 "todo" 75
    "in_progress" 50 "testing" 40 "review" 40 "document" 40
    "done" 500 "rejected" 9999 "icebox" 9999 "incoming" 9999 "archived" 9999}})

(defn resolve-fsm [board-config]
  (let [fsm-cfg (:fsm board-config)]
    (cond (nil? fsm-cfg) default-fsm
          (= "promethean" fsm-cfg) promethean-fsm
          (map? fsm-cfg) fsm-cfg
          :else default-fsm)))

(defn- check-wip-limit [fsm to-status current-counts]
  (let [limit (get-in fsm [:wip-limits to-status] 9999)
        current (get current-counts to-status 0)]
    {:ok? (< current limit) :current current :limit limit}))

(defn evaluate-transition [fsm from-status to-status current-counts]
  (let [transitions (:transitions fsm)
        matching (first (filter (fn [t] (and (some #(= from-status %) (:from t))
                                             (some #(= to-status %) (:to t))))
                                transitions))]
    (cond
      (nil? matching) {:allowed? false :reason (str "No transition from '" from-status "' to '" to-status "'")}
      (= :wip-available (:check matching))
      (let [wip (check-wip-limit fsm to-status current-counts)]
        (if (:ok? wip) {:allowed? true :reason "WIP available"}
            {:allowed? false :reason (str "WIP limit reached: " (:current wip) "/" (:limit wip))}))
      :else {:allowed? true :reason "Allowed"})))

(defn valid-targets [fsm from-status]
  (vec (mapcat :to (filter #(some (fn [s] (= from-status s)) (:from %)) (:transitions fsm)))))
