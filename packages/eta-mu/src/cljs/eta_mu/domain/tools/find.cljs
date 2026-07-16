(ns eta-mu.domain.tools.find
  "Pure decision logic for the `find` tool: filter, sort, and limit a flat
  list of walked filesystem entries."
  (:require [clojure.string :as str]
            [eta-mu.domain.tools.glob :as glob]))

(defn- basename [relative-path]
  (last (str/split relative-path #"/")))

(defn- pattern-matches?
  "A slash-free pattern (e.g. `*.ts`) matches the basename only; a pattern
  containing `/` (e.g. `src/**/*.spec.ts`) matches the full relative path."
  [pattern relative-path]
  (if (str/includes? pattern "/")
    (glob/match? pattern relative-path)
    (glob/match? pattern (basename relative-path))))

(defn select-matches
  "`entries` is `[{:path relative-posix-path :dir? bool} ...]`. Returns files
  (not directories) matching `pattern` and not excluded by `ignore-patterns`,
  sorted alphabetically and capped at `limit`.

  Returns `{:matches [...] :limit-reached? bool}`."
  [entries pattern ignore-patterns limit]
  (let [matches (->> entries
                     (remove :dir?)
                     (map :path)
                     (remove #(glob/ignored? ignore-patterns %))
                     (filter #(pattern-matches? pattern %))
                     sort)]
    {:matches (vec (take limit matches))
     :limit-reached? (> (count matches) limit)}))
