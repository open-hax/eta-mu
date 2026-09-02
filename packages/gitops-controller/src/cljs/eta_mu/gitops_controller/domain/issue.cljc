(ns eta-mu.gitops-controller.domain.issue
  "Pure planning for the effect-free, issue-backed deployment probe."
  (:require [eta-mu.gitops-controller.law.webhook :as law]))

(defn plan
  [command current-issue authority-decision
   {:keys [project-id policy-revision]}]
  (cond
    (not= :issue-probe (law/command-type (:command/type command)))
    {:planned? false :reason :invalid-command-type}

    (not (law/current-issue? current-issue))
    {:planned? false :reason :invalid-current-issue}

    (not= (:repository command) (:repository current-issue))
    {:planned? false :reason :repository-changed}

    (not= (:repository-id command) (:repository-id current-issue))
    {:planned? false :reason :repository-identity-changed}

    (not= (:issue-number command) (:number current-issue))
    {:planned? false :reason :issue-changed}

    (not= (:issue-node-id command) (:node-id current-issue))
    {:planned? false :reason :issue-identity-changed}

    (:pull-request? current-issue)
    {:planned? false :reason :pull-request-is-not-an-issue}

    (:repository-archived? current-issue)
    {:planned? false :reason :repository-is-archived}

    (:repository-disabled? current-issue)
    {:planned? false :reason :repository-is-disabled}

    (not= "open" (:state current-issue))
    {:planned? false :reason :issue-not-open}

    (not (contains? (:labels current-issue) (:label command)))
    {:planned? false :reason :command-label-no-longer-present}

    (zero? (:canonical-task-marker-count current-issue))
    {:planned? false :reason :canonical-task-marker-missing}

    (not= 1 (:canonical-task-marker-count current-issue))
    {:planned? false :reason :canonical-task-marker-ambiguous}

    (not (law/task-uuid? (:canonical-task-uuid current-issue)))
    {:planned? false :reason :canonical-task-uuid-invalid}

    (not (law/project-id? project-id))
    {:planned? false :reason :project-identity-unbound}

    (not (law/non-blank-string? policy-revision))
    {:planned? false :reason :project-policy-revision-unbound}

    (not (:authorized? authority-decision))
    {:planned? false :reason :actor-not-authorized}

    (not (and (law/review-permission?
               (get-in authority-decision
                       [:evidence :github/permission]))
              (law/positive-integer?
               (get-in authority-decision
                       [:evidence :github/user-id]))
              (= (:sender-id command)
                 (get-in authority-decision
                         [:evidence :github/user-id]))
              (law/non-blank-string?
               (get-in authority-decision
                       [:evidence :github/user-login]))
              (true? (get-in authority-decision
                             [:evidence :identity-matches?]))))
    {:planned? false :reason :authorization-evidence-unbound}

    :else
    {:planned? true
     :command/type :issue-probe
     :probe
     {:plan/version 1
      :command {:id (:command-id command)
                :type :issue-probe
                :event (:event command)
                :action (:action command)
                :label (:label command)}
      :actor {:id (:sender-id command)
              :login (:sender-login command)}
      :authorization
      {:permission (get-in authority-decision
                           [:evidence :github/permission])
       :user-id (get-in authority-decision
                        [:evidence :github/user-id])
       :user-login (get-in authority-decision
                           [:evidence :github/user-login])
       :identity-matches?
       (true? (get-in authority-decision
                      [:evidence :identity-matches?]))}
      :repository
      {:full-name (:repository current-issue)
       :id (:repository-id current-issue)
       :installation-id (:installation-id command)
       :default-branch (:default-branch current-issue)
       :default-branch-sha (:default-branch-sha current-issue)}
      :issue {:number (:number current-issue)
              :node-id (:node-id current-issue)
              :task-uuid (:canonical-task-uuid current-issue)
              :state (:state current-issue)
              :labels (vec (sort (:labels current-issue)))}
      :project {:id project-id
                :policy-revision policy-revision
                :revision (:default-branch-sha current-issue)}
      :effects []}}))
