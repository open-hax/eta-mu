(ns rheos.backend.infra.projects
  "Loaded board projects, resolved once at boot. Shared between the HTTP handlers
   and the MCP orchestrator tools so both resolve projects identically.")

(defonce ^:private state (atom nil))

(defn set-projects! [projects] (reset! state projects))
(defn all [] (:projects @state))
(defn default-id [] (:default-project-id @state))

(defn find-project
  "Resolve a project by id, falling back to the default project."
  [project-id]
  (let [pid (or project-id (default-id))]
    (first (filter #(= (:id %) pid) (all)))))
