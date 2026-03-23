# contract-governance

Meta-governance for contract amendments and evolution.

## Purpose

Defines how the contract itself evolves:
- Constitutional layers (immutable, semi-stable, mutable)
- Amendment proposals and workflow
- Contract versioning
- Rollback mechanism

## Activation

Priority 30, not autoloaded. Only invoked when:
- User requests amendment
- Contract change is proposed
- Governance questions arise

## Protocol

1. Proposals go to `specs/amendments/`
2. Agent can propose, but cannot auto-apply
3. User must approve semi-stable changes
4. Immutable sections cannot be touched