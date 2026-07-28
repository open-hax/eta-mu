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

(defn find-project-by-tasks-dir
  "Resolve the configured project for an absolute task root.

   This keeps legacy callers that still pass only a tasks-dir compatible while
   card-projection configuration migrates toward passing the whole project map."
  [tasks-dir]
  (first (filter #(= (:tasks-dir %) tasks-dir) (all))))
