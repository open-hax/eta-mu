# @eta-mu/terminal-ui

ClojureScript terminal UI components and host for the eta-mu agent.

This package is the migration target for the legacy TypeScript terminal UI in
`packages/legacy/tui`. It owns terminal boundaries, reusable components, and
the host application that renders the agent conversation.

## Status

Early port. The first slice covers the terminal extern boundary (`write`,
dimensions, cursor, clear). Components and host integration will follow.
