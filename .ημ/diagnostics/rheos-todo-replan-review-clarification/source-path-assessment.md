# Independent assessment of the historical source-path request

Scope: [PR344](https://github.com/open-hax/eta-mu/pull/344), reviewed head
`e8060a6b418ff7640a6cdd3b7ee716dd63c036b5`, CodeRabbit review `5436829621`,
thread `PRRT_kwDORu27H86puseZ`,
[root comment 4202360870](https://github.com/open-hax/eta-mu/pull/344#discussion_r4202360870),
item `cr-comment:v1:4e43011fe8715065a147d9b8`.
Reviewer for this assessment: local Codex subagent `/root/board_scout`,
independent of the original planning author `/root/runtime_scout` and CodeRabbit.

## Observed implementation and evidence

(己, p=1.0) The review correctly identifies an absolute local checkout path.
It was emitted by the canonical Rheos `create` command; it was not manually
inserted into the event. The original
[authoring record](../rheos-todo-replan-plan/authoring.json) binds the actual
command, source commit, built CLI hash, exit, and old-ledger prefix check.

At Rheos `ab6b227becd8585742b5130df9ae624d8744928e`:

- [Task creation, lines 54–64](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/infra/task_create.cljs#L54)
  explicitly resolves an absolute destination path.
- [Task creation, lines 122–129](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/infra/task_create.cljs#L122)
  passes that same `file-path` into the event's `:source-path` and the creation
  result.
- [Event emission, lines 121–136](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/domain/events.cljs#L121)
  records the supplied path as part of the task-created fact.
- [Existing creation test, lines 142–160](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/test/rheos/backend/infra/task_create_test.cljs#L142)
  checks that event and creation-result `:source-path` values are equal.
  These tests were read, not rerun in this assessment.
- [Task loading, lines 55–77](https://github.com/open-hax/rheos/blob/ab6b227becd8585742b5130df9ae624d8744928e/src/rheos/backend/infra/task_store.cljs#L55)
  derives each live task's source path from the file currently being loaded.
  This supports distinguishing a historical creation location from a current
  checkout location; it is not proof that every future replay consumer is
  independent of historical paths.

## Recommended disposition

(己, p=0.99) Reject **rewriting or deleting the historical event field in this
planning PR**. The user's standing ledger instructions require that recorded
events remain append-only and that Rheos owns board semantics; missing behavior
must be repaired upstream rather than by a consumer-side edit. The requested
rewrite would contradict the recorded command output and the preserved evidence
hashes, and it would claim a fact different from the one the canonical runtime
actually emitted.

(己, p=0.99) A repository-relative event-path policy could be useful, but it is
a separate design question. It must specify the path's reference root, the
creation-result/event relationship, compatibility with existing events and any
replay/import consumers, and canonical production/test changes in Rheos.
Nothing here establishes that policy, creates a follow-up card, or claims that
portable replay has been implemented. It is outside this single FSM-edge plan.

(己, p=1.0) Leaving the field unchanged retains the published checkout name
and historical absolute path; this assessment does not claim the path is
secret-free by construction, that portability concerns are imaginary, or that
append-only policy universally overrides a separately authorized redaction.
No such redaction or history-rewrite authorization exists for this task.

## Review boundary

(己, p=1.0) This is an independent **local** assessment, not an authenticated
native rejection agreement and not a merge approval. The coordinator must use
the canonical PR settlement process: publish a proposal bound to the actual
successor head and the two native finding IDs, obtain the required independent
native assessment, then settle only if supported. No `Fixed`, `Handled`, or
`Deferred` claim is made for the source-path finding by this artifact.
