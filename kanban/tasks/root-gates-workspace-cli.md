---
uuid: "root-gates-workspace-cli"
title: "Run root pnpm gates with workspace tooling"
status: "incoming"
type: "task"
priority: "P2"
labels: "ci, cli"
---

## Outcome

A workspace install provides everything the root `pnpm gates` entry point needs to load the repository's projected gate plan.

## Acceptance criteria

- `pnpm gates --all --list` succeeds with no global eta-mu and no compiled CLI.
- Gate selection and execution use the shipped gates command.
- The root test runner exercises the package script.
