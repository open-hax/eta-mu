# @eta-mu/session-mycology

Session Mycology owns session reflection, lesson, retrospective, spore
candidate, incubation, and promotion events. These are distinct from Receipt
River receipts and may link to them through explicit event references.

Schema facts live directly in `eta-mu.session-mycology.law.reflection`; package
APIs and eta-mu consume that CLJS authority without generated source files.

The canonical application surface is:

```bash
eta-mu session ...
```
