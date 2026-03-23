# work-cycle

Foundational cognitive loop for the agent.

## Purpose

Defines the core work cycle:
- **Agent Loop**: Observe → Model → Plan → Execute → Verify → Record
- **PRNPA Loop**: Perception → Research → Narrative → Persistence → Action

## Activation

This skill is autoloaded at priority 100 and provides the foundational cognitive framework for all agent work.

## Protocol

1. Never execute without passing through Observe → Model → Plan
2. Each phase must leave the system in a stable, buildable state
3. After each phase: code compiles, tests pass, specs updated