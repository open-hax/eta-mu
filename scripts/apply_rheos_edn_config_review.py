from pathlib import Path


def replace_once(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    count = text.count(old)
    if count != 1:
        raise SystemExit(f"{path}: expected one match, found {count}")
    path.write_text(text.replace(old, new), encoding="utf-8")


replace_once(
    Path("packages/rheos/src/rheos/backend/infra/agent_tools.cljs"),
    """(defn- project->wip-limits [project]\n  (when-let [fsm (or (:fsm project) {})]\n    (if (map? fsm)\n      (:wip-limits fsm {})\n      {})))""",
    """(defn- project->wip-limits [project]\n  (let [fsm (:fsm project)]\n    (if (map? fsm)\n      (:wip-limits fsm {})\n      {})))""",
)

replace_once(
    Path("packages/rheos/src/rheos/backend/infra/task_store.cljs"),
    """        roots (or (seq (get-in project [:card-projection :paths]))\n                  [tasks-dir])""",
    """        projection (:card-projection project)\n        roots (if (and projection (contains? projection :paths))\n                (:paths projection)\n                [tasks-dir])""",
)

test_path = Path("packages/rheos/test/rheos/backend/infra/task_store_test.cljs")
test_text = test_path.read_text(encoding="utf-8")
marker = "explicit-empty-projection-scans-nothing"
if marker in test_text:
    raise SystemExit(f"{test_path}: regression test already present")

test_text += """

(deftest ^:async explicit-empty-projection-scans-nothing
  (let [root (await (.mkdtemp fsp (path/join (os/tmpdir) \"rheos-empty-projection-\")))
        card-path (path/join root \"would-be-legacy-card.md\")]
    (try
      (await (.writeFile fsp card-path card-markdown \"utf8\"))
      (let [tasks (await (task-store/load-tasks
                          {:tasks-dir root
                           :card-projection {:paths []}}))]
        (is (empty? tasks)))
      (finally
        (await (.rm fsp root #js {:recursive true :force true}))))))
"""
test_path.write_text(test_text, encoding="utf-8")
