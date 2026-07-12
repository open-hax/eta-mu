(ns eta-mu.platform.registry
  "Registry normalization, linking, and validation for the ημ platform DSL.

  The registry is a plain data structure. It contains no JS interop and no
  host-target knowledge.")

(defn normalize
  "Flatten a plugin or capability spec into a sequence of entries.

  Nested plugins are recursively flattened. Unknown kinds are rejected."
  [spec]
  (case (:ημ/kind spec)
    :plugin (mapcat normalize (:ημ/entries spec))
    :tool [spec]
    :hook [spec]
    :capability [spec]
    (throw (ex-info "Unknown ημ spec kind"
                    {:spec spec
                     :kind (:ημ/kind spec)}))))

(defn normalize-plugin
  "Normalize a plugin spec into a registry map with tools and hooks grouped."
  [spec]
  (let [entries (normalize spec)
        by-kind (group-by :ημ/kind entries)]
    {:tools (vec (by-kind :tool))
     :hooks (vec (by-kind :hook))}))

(defn link-capabilities
  "Link each tool in the registry to its capability handler.

  `capability-map` is a map from `:ημ/id` keyword to the capability descriptor
  (which includes `:ημ/handler`). Throws if a tool references a missing capability."
  [registry capability-map]
  (update registry :tools
          (fn [tools]
            (mapv (fn [tool]
                    (let [cap-id (:ημ/capability tool)]
                      (if-let [cap (get capability-map cap-id)]
                        (assoc tool :ημ/handler (:ημ/handler cap))
                        (throw (ex-info "Tool references unknown capability"
                                        {:tool         (:ημ/id tool)
                                         :capability   cap-id
                                         :known-ids    (sort (keys capability-map))})))))
                  tools))))

(defn- duplicate-ids
  [definitions]
  (->> definitions
       (map :ημ/id)
       (frequencies)
       (filter #(> (val %) 1))
       (map key)))

(defn validate!
  "Validate a registry. Rejects duplicate ids within each kind."
  [registry]
  (doseq [[kind key] {:capability :capabilities
                      :tool       :tools
                      :hook       :hooks}]
    (when-let [dupes (seq (duplicate-ids (get registry key [])))]
      (throw (ex-info (str "Duplicate " (name kind) " ids in registry")
                      {:kind       kind
                       :duplicates (vec dupes)}))))
  registry)

(defn compose-plugins
  "Compose multiple plugin specs into a single registry."
  [& specs]
  (-> {:ημ/kind :plugin
       :ημ/id :eta-mu.platform.registry/composed
       :ημ/entries (vec specs)}
      normalize-plugin
      validate!))
