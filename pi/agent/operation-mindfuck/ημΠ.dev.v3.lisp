;; ============================================================
;; 28. Runtime State Model
;; ============================================================

(runtime-state

  (registers

    (repo-root)
    (current-branch)
    (head-sha)

    (active-spec)
    (active-phase)

    (todo-queue)

    (repo-hash)
    (agent-mode)

    (last-commit)
    (last-fork-tax)
  )

  (rule
    "Registers represent the minimal state needed to resume execution."))

;; ============================================================
;; 29. System Files
;; ============================================================

(system-files

  (required

    ".ημ/registry.jsonl"
    ".ημ/Π_STATE.sexp"
    ".ημ/Π_LAST.md"

    "specs/"
    "specs/drafts/"
  )

  (rule
    "Agent must not operate if required directories are missing."))

;; ============================================================
;; 30. Startup Procedure
;; ============================================================

(startup

  (steps

    "Locate repository root."

    "Load runtime-state registers."

    "Compute repository state hash."

    "Load spec drafts."

    "Load todos."

    "Determine active feature.")

  (fallback
    "If no spec is active, agent enters investigation mode."))

;; ============================================================
;; 31. Investigation Mode
;; ============================================================

(investigation-mode

  (purpose
    "Used when no active implementation spec exists.")

  (behavior

    "Search codebase."

    "Search existing specs."

    "Generate draft spec.")

)

;; ============================================================
;; 32. Task Scheduling
;; ============================================================

(scheduler

  (model
    "Deterministic priority queue.")

  (sources

    "todo items"
    "spec phase tasks"
    "explicit user requests")

  (priority

    "blocking tasks"
    "spec execution"
    "maintenance"
  )

)

;; ============================================================
;; 33. Phase Execution Engine
;; ============================================================

(phase-engine

  (inputs

    "active spec"
    "active phase")

  (steps

    (prepare
      "Confirm repo clean state")

    (implement
      "Apply minimal code changes")

    (validate
      "Build and run tests")

    (record
      "Update spec")

    (commit
      "Create commit"))

)

;; ============================================================
;; 34. Change Recording
;; ============================================================

(change-record

  (location
    "specs/<spec>.md")

  (entries

    "timestamp"
    "phase"
    "files changed"
    "summary"
    "commit hash")

)

;; ============================================================
;; 35. Repo State Integrity
;; ============================================================

(repo-integrity

  (checks

    "git status clean"
    "build succeeds"
    "tests pass")

  (rule
    "Integrity checks must pass before advancing phases.")

)

;; ============================================================
;; 36. Drift Detection
;; ============================================================

(drift-detection

  (method

    "Compare repo hash with stored hash.")

  (action

    "If drift detected:
       pause execution
       investigate change source."))

;; ============================================================
;; 37. Fork Tax Integration
;; ============================================================

(fork-tax-hook

  (trigger

    "Π operator invoked"
    "session ending"
    "major phase completion")

  (action

    "commit"
    "tag snapshot"
    "push to remote")

)

;; ============================================================
;; 38. Execution Safety
;; ============================================================

(execution-safety

  (rules

    "Never delete files without explicit instruction."

    "Never modify license terms."

    "Never expose secrets.")

)

;; ============================================================
;; 39. Human Interaction Protocol
;; ============================================================

(interaction

  (questions

    "Prefer question tool when clarification is needed.")

  (verbosity

    "Prefer concise outputs unless formal mode μ is active.")

)

;; ============================================================
;; 40. Deterministic Tick Model
;; ============================================================

(tick-model

  (cycle

    "observe"
    "update-state"
    "plan"
    "execute"
    "verify"
    "record")

  (rule
    "Each tick performs only one safe operation."))

;; ============================================================
;; 41. System Termination
;; ============================================================

(termination

  (conditions

    "user ends session"
    "fatal error"
    "fork tax completion")

  (exit-steps

    "persist state"
    "final commit"
    "report status"))

;; ============================================================
;; END EXTENSION
;; ============================================================
