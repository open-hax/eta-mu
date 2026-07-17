(ns open-hax.records.socket-io.user-management
  "Socket.IO implementation of UserManagement protocol."
  (:require [open-hax.openplanner-protocols :as protocols]
            [open-hax.records.socket-io.event-admission :as ea]))

(defrecord SocketIoUserManagement [socket]
  protocols/UserManagement
  (create-user [_ user-data]
    (ea/emit-and-await socket "user:create" user-data nil))

  (authenticate [_ credentials]
    (ea/emit-and-await socket "user:login" credentials nil))

  (get-user [_ user-id]
    (ea/emit-and-await socket "user:get" {:userId user-id} nil))

  (update-user [_ user-id updates]
    (ea/emit-and-await socket "user:update"
                       {:userId user-id :updates updates}
                       nil)))
