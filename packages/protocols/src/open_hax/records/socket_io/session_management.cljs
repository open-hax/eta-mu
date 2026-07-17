(ns open-hax.records.socket-io.session-management
  "Socket.IO implementation of SessionManagement protocol."
  (:require [open-hax.openplanner-protocols :as protocols]
            [open-hax.records.socket-io.event-admission :as ea]))

(defrecord SocketIoSessionManagement [socket]
  protocols/SessionManagement
  (create-session [_ opts]
    (ea/emit-and-await socket "session:create" opts nil))

  (get-session [_ session-id]
    (ea/emit-and-await socket "session:get" {:session/id session-id} nil))

  (update-session [_ session-id updates]
    (ea/emit-and-await socket "session:update"
                       {:session/id session-id :updates updates}
                       nil))

  (close-session [_ session-id]
    (ea/emit-and-await socket "session:close"
                       {:session/id session-id}
                       nil)))
