(ns open-hax.sol.infra.agent.runtime
  "Minimal Sol agent runtime controls."
  (:require [clojure.string :as str]
            [open-hax.sol.infra.agent.session :refer [active-agent-session]]
            [open-hax.sol.shape.agent :refer [streaming? follow-up! steer!]]
            ["node:path" :as path]))

(defn resolve-workspace-path
  [_runtime config raw-path]
  (let [requested (some-> raw-path str str/trim not-empty)]
    (if requested
      (.resolve path (:workspace-root config) requested)
      (:workspace-root config))))

(defn ^:async queue-agent-control!
  "Sol stub for live turn controls."
  [_runtime _config {:keys [conversation-id message kind]}]
  (cond
    (str/blank? conversation-id)
    (js/Promise.reject (js/Error. "conversation_id is required for live controls"))

    (str/blank? message)
    (js/Promise.reject (js/Error. "message is required for live controls"))

    :else
    (if-let [session (active-agent-session conversation-id)]
      (if-not (streaming? session)
        (js/Promise.reject (js/Error. "No active running turn is available for live controls"))
        (let [invoke (if (= kind "follow_up") #(follow-up! session message) #(steer! session message))]
          (try
            (await (invoke))
            {:ok true
             :conversation_id conversation-id
             :kind kind}
            (catch :default err
              (throw err)))))
      (js/Promise.reject (js/Error. "Conversation is not active in the agent runtime")))))
