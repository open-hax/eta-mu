# @eta-mu/receipt-river

Receipt River owns receipt event construction, schema metadata, validation,
historical receipt compatibility, local repository discovery, and
receipt-specific archaeology projections.

The canonical application surface is:

```bash
eta-mu receipt ...
```

Historical records without an event envelope remain unversioned. The package
validator reads them for compatibility; it does not assign a schema version
retroactively.
