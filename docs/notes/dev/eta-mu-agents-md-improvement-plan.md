---
original_name: "2026.06.16.07.13.42.md"
title: "Eta-Mu AGENTS.md Improvement Plan"
summary: "Outlines refactoring PROCESS.md, enforcing kanban FSM transitions, and writing package-specific AGENTS.md files."
category: "dev"
created: "2026-06-16"
---

## Improve Eta-mu's AGENTS.md


## Description

Clone the [eta-mu](https://github.com/open-hax/eta-mu/tree/chore/ts-cljs-rewrite), and [knoxx](https://github.com/open-hax/knoxx) projects,
explore them thoroughly, with special attention to Rheos, sol, katamorph, and runtime packages from eta-mu, and the knoxx/backend
Generate an improved AGENTS.md file grounded in the eta-mu source code.
Acknowledging the lineage between eta-mu, and knoxx.




## Acceptance Criteria
- [ ] @PROCESS.md is Updated 
  - [ ] Should be frame more as a foundational document that delegates specifics to `process/**.md` or `kanban/process/**.md`
	- [ ] They could be elements on the boar's view.
	- [ ] They could be just another card, but instead of being "done", they become "law"
  - [ ] The process documents should be specific
	- [ ] When this was written a very long time ago. It's based on the process I used before AI
- [ ] existing FSM defintions have clear DoDs
- [ ] Coding agents  can't move tasks on the board if it violates a transition.
  - [ ] FSM blocks invalid moves thorough all valid interaction surfaces
	- [ ] file edits
	- [ ] cli 
	- [ ] mcp
	- [ ] Custom Tool Addons
  - [ ] Opencode 
	- [ ] Hooks cause clear rejections when editing files would cause invalid state
	- [ ] MCP server is added to opencode.jsonc
	- [ ] Custom tools plugin that provide failiure feedback
	- [ ] a smoke test shell that runs a opencode/big-pickle testing agent  in a controled environent 
  - [ ] eta-mu 
	- [ ] Hooks cause clear rejections when editing files would cause invalid state
	- [ ] MCP server connected
	- [ ] Custom tools plugin that provide failiure feedback
	- [ ] a smoke test shell that runs a mimo-v2.5-pro testing agent  in a controled environent 
- [ ] An `AGENTS.md` file has been written for all mentioned packages
  - [ ] eta-mu/packages/Rheos
  - [ ] eta-mu/packages/sol
  - [ ] eta-mu/packages/katamorph
  - [ ] eta-mu/packages/runtime.
  - [ ] knoxx/backend

## Tasks
- [ ] Update the @kanban/ FSM to understand `process` as a type of card like
- [ ] Update Process.md
  - [ ] split it into sections
- [ ] Explore essential eta-mu and knoxx packages and generate reports on their internal structure
  - [ ] eta-mu/packages/Rheos
  - [ ] eta-mu/packages/sol
  - [ ] eta-mu/packages/katamorph
  - [ ] eta-mu/packages/runtime.
  - [ ] knoxx/backend


## Behavioral Requirements

Agents *MUST ALWAYS* follow the [The Process](https://raw.githubusercontent.com/open-hax/eta-mu/refs/heads/main/PROCESS.md)
When updating boards state, agents *MUST ALWAYS* be informed of FSM transition violations
If they interact with the board through `eta-mu kanban ...` they'll see the output of the command
We need to expand the capabilities of this cli to do what we need
This shouldn't be that hard. The REST API has the behaviors. It's just a matter isolating the behavior, and serialization
If they interacted with it through the MCP, they get feedback,
that mostly works to my knowledge,
The board UI doesn't expose a task edit, it gives you a open in editor.
large multiline Markdown strings in CLI can give agents a hard time. 
If they only have the option of CLI or a file, they will a signifigant amount of the time try to edit files.

In all cases, the larger it gets, the more likey they are to prefer to use file editing tools.
they can be a lot more precise that way.

## Kanban Board Edit Hooks
Until the kanban built in orchestrator becomes reliable, we are using
existing coding agents like opencode and eta-mu's cli



## Workflow
- Primary Agent Discovery
  - Find tasks and code related to user query
- Sub Agent 
### sol and knoxx

sol is an agent server that implements the same api as  backend.
knoxx and sol are to coexist for the foreseeable future.
knoxx is stable, sol is WIP. Knoxx allows us to write clients
around the api we expect from sol  while it is still in active development.


### Coding Style Rules

that retains the eta-mu-sol house rules.
includes an additional `extern` as a boundary between clj and cljs.
node modules imports should only happen in the extern namespace.
functions in extern take clj and return clj, lifting js runtime functions into idiomatic clj functions.
We need more data structure and algorithms type packages
Most code that is messy now, is legitimately a thing that we *have to do* that is complicated
The more of it we can conceal behind polymorphisim, the better

## Perplexity Spaces
Clojure eta-mu eta-mu-sol-initiative 

