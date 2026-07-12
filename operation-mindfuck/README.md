# Operation Mindfuck (OPMF) — contract precedence

**Authoritative contract = the two files in this directory:**

- `ημΠ.dev.v1.edn` — the CORE constitution: mission, directives, operators
  (η / μ / Π / A), context symbols, uncertainty operators, output shape,
  safety, license, model architecture, and the skill delegation block.
- `ημΠ.dev.v5.skill-graph.edn` — the companion skill registry the v1
  delegation block resolves against. Skill root is `~/.agents/skills`
  (benched skills live in `~/.agents/skills.disabled`).

**Version numbers do not imply precedence.** The files in `../opmf-drafts/`
(`v2.mission`, `v3.operators`) are decomposition *fragments* of v1 — strict
subsets extracted for drafting, not successors. There is no v4. A higher
version number in `opmf-drafts/` never overrides this directory.

Known drift (2026-07-10): v1's delegation block still describes fork-tax /
receipt-river / session-mycology as external skill modules; the `eta-mu` CLI
has since absorbed them as native subcommands (`eta-mu git fork-tax`,
`eta-mu git receipt`, `eta-mu git session` — see
`packages/eta-mu/src/cljs/eta_mu/infra/cli/commands/`). The skill files remain
valid for other harnesses; the CLI is the preferred surface inside eta-mu.
