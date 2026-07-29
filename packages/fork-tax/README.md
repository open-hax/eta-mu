# @eta-mu/fork-tax

Fork Tax owns handoff plans, path classifications, snapshot manifests, payment
outcomes, and verification/failure events. A payment may reference a Receipt
River event, but it is not a receipt subtype.

Schema facts live directly in `eta-mu.fork-tax.law.handoff`; package APIs and
eta-mu consume that CLJS authority without generated source files.

The canonical application surface is:

```bash
eta-mu fork-tax ...
```
