# shadow-async

`ημ.skill/shadow-async@0.1.0` — async/await macro semantics for shadow-cljs ClojureScript.

## What it does

Provides `defn-async` and `await` as a macro pair that gives JavaScript-style async/await
semantics inside shadow-cljs CLJS projects, without requiring core.async or any additional
runtime beyond what shadow-cljs ships with (`shadow.cljs.modern/js-await`).

Every function defined with `defn-async` returns a JS Promise.

## Quick start

```clojure
;; src/my/async.clj  (JVM — macros run here)
(ns my.async)

(defn await-form? [x]
  (and (seq? x) (= 'await (first x)) (= 2 (count x))))

(defn lower-awaits [body]
  (letfn [(step [forms]
            (if (empty? forms) nil
              (let [f (first forms) more (next forms)]
                (cond
                  (and (seq? f) (= 'let (first f)))
                  (let [[_ bindings & let-body] f
                        pairs (partition 2 bindings)]
                    (reduce
                     (fn [acc [sym expr]]
                       (if (await-form? expr)
                         `(shadow.cljs.modern/js-await [~sym ~(second expr)]
                            ~(or acc `(do ~@let-body ~@more)))
                         `(let [~sym ~expr]
                            ~(or acc `(do ~@let-body ~@more)))))
                     nil (reverse pairs)))
                  (await-form? f)
                  `(shadow.cljs.modern/js-await [_# ~(second f)]
                     ~(or (step more) '_#))
                  :else (if more `(do ~f ~(step more)) f))))]
    (step body)))

(defmacro defn-async [name args & body]
  `(defn ~name ~args ~(lower-awaits body)))
```

```clojure
;; src/my/async.cljs  (expose macro to CLJS)
(ns my.async
  (:require [shadow.cljs.modern])
  (:require-macros [my.async :refer [defn-async]]))
```

```clojure
;; Usage
(ns app.core
  (:require-macros [my.async :refer [defn-async]]))

(defn-async load-json [url]
  (let [resp (await (js/fetch url))
        json (await (.json resp))]
    json))

(defn-async save-user [payload]
  (let [resp (await (js/fetch "/api/user"
                      #js {:method "POST"
                           :body (js/JSON.stringify (clj->js payload))}))]
    (if (.-ok resp)
      (await (.json resp))
      (throw (js/Error. "Save failed")))))
```

## Caveats

- `await` lowering only works in `let`-binding position and top-level body forms. Nested
  `await` inside `cond` branches or callbacks needs explicit `js-await`.
- No `try/catch` lowering — wrap `.catch` on the Promise or use
  `shadow.cljs.modern/js-await` with a `(catch ...)` tail directly.
- For richer semantics (full nested lowering, error propagation), see
  [promesa](https://github.com/funcool/promesa).

## See also

- `shadow.cljs.modern/js-await` — the primitive this macro wraps
- `ημ.skill/work-cycle` — cognitive loop that governs when async work is committed
- `packages/skills/skill-registry.edn` — registry entry at priority 68, group `:domain`
