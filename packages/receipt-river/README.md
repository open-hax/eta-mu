# @eta-mu/receipt-river

Receipt River owns receipt event construction, schema metadata, validation,
historical receipt compatibility, local repository discovery, and
receipt-specific archaeology projections.

Schema facts live directly in `eta-mu.receipt-river.law.receipt`; package APIs
and the eta-mu composition manifest consume that CLJS authority without a
prebuild code-generation step.

The canonical application surface is:

```bash
eta-mu receipt ...
```

Historical records without an event envelope remain unversioned. The package
validator reads them for compatibility; it does not assign a schema version
retroactively.
