(ns axxium.law.identity
  "Portable admission laws for identity credentials and their atomic facts."
  (:require [clio.law.schema :as clio-schema]
            [clojure.string :as str]
            [malli.core :as m]))

(def Principal
  "Stable identity and current grants; never a provider token."
  [:map {:closed true}
   [:principal/id [:string {:min 1 :max 256}]] [:principal/entity-id [:string {:min 1 :max 256}]]
   [:principal/kind [:enum :human :agent :service :automation]]
   [:principal/username :string]
   [:principal/email {:optional true} :string]
   [:principal/display-name :string]
   [:principal/status [:enum :active :suspended :retired]]
   [:principal/roles [:vector :string]]
   [:principal/capabilities [:vector :string]]])

(def Change
  "A single projection change within one accepted identity transaction."
  [:map {:closed true}
   [:collection [:enum :principals :aliases :credentials :identities :sessions :challenges]]
   [:key :string]
   [:value {:optional true} :map]])

(def catalog
  "Content-addressed Clio schema catalog. Secrets live in encrypted blobs."
  {:axxium/identity-changed
   (clio-schema/event-schema
    :axxium/identity-changed
    [:map {:closed true}
     [:operation :keyword]
     [:changes [:vector Change]]])})

(defn require!
  "Refuse an inadmissible identity operation with a stable error code."
  [condition code message]
  (when-not condition (throw (ex-info message {:code code}))))

(defn validate-principal!
  "Validate a principal before exposing or persisting it."
  [principal]
  (require! (m/validate Principal principal) :invalid-principal "Invalid identity principal")
  principal)

(defn normalize-identifier
  "Normalize account lookup identifiers consistently across all clients."
  [value]
  (when (string? value) (-> value str/trim str/lower-case)))

(defn valid-username?
  "Usernames are distinct from email and have a bounded portable alphabet."
  [value]
  (boolean (and (string? value) (re-matches #"[a-z0-9][a-z0-9._-]{2,63}" value))))

(defn valid-email?
  "Conservative email syntax check; it does not assert mailbox ownership."
  [value]
  (boolean (and (string? value) (<= (count value) 254)
                (re-matches #"[^\s@]+@[^\s@]+\.[^\s@]+" value))))

(defn safe-redirect
  "Only local absolute paths can follow authentication."
  [value]
  (if (and (string? value) (str/starts-with? value "/")
           (not (str/starts-with? value "//"))
           (not (re-find #"[\\\r\n]" value)))
    value "/"))

(defn active?
  "Inactive identities cannot authenticate even with an unexpired session."
  [principal]
  (= :active (:principal/status principal)))
