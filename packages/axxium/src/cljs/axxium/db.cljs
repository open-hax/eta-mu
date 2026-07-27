(ns axxium.db
  "PostgreSQL database layer for Axxium.
   Uses pg via JS interop — following knoxx/proxx patterns."
  (:require [axxium.config :as cfg]
            ["pg" :refer [Pool]]))

(defonce pool
  (delay
    (let [pool-config #js {:connectionString (cfg/db-url)
                           :max 20
                           :idleTimeoutMillis 30000
                           :connectionTimeoutMillis 2000}]
      (new Pool pool-config))))

(defn query
  "Execute a parameterized SQL query.
   Returns a promise of rows."
  [sql params]
  (.query @pool sql (clj->js params)))

(defn ^:async query-one
  "Execute query and return first row or nil."
  [sql params]
  (let [result (await (query sql params))
        rows (js->clj (.-rows result) :keywordize-keys true)]
    (first rows)))

(defn ^:async query-all
  "Execute query and return all rows."
  [sql params]
  (let [result (await (query sql params))]
    (js->clj (.-rows result) :keywordize-keys true)))

(def schema-sql
  "CREATE TABLE IF NOT EXISTS entities (
     id TEXT PRIMARY KEY,
     kind TEXT NOT NULL,
     email TEXT UNIQUE,
     display_name TEXT,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE IF NOT EXISTS actors (
     id TEXT PRIMARY KEY,
     entity_id TEXT NOT NULL REFERENCES entities(id),
     org_id TEXT,
     email TEXT,
     display_name TEXT,
     password_hash TEXT,
     capabilities JSONB DEFAULT '[]',
     roles JSONB DEFAULT '[]',
     status TEXT DEFAULT 'active',
     created_at TIMESTAMPTZ DEFAULT NOW(),
     updated_at TIMESTAMPTZ DEFAULT NOW()
   );

   ALTER TABLE actors
     ADD COLUMN IF NOT EXISTS org_id TEXT;

   DO $$
   BEGIN
     IF NOT EXISTS (
       SELECT 1
       FROM pg_constraint
       WHERE conname = 'actors_org_id_fkey'
         AND conrelid = 'actors'::regclass
     ) THEN
       ALTER TABLE actors
         ADD CONSTRAINT actors_org_id_fkey
         FOREIGN KEY (org_id) REFERENCES entities(id);
     END IF;
   END
   $$;

   DO $$
   BEGIN
     IF EXISTS (
       SELECT 1
       FROM actors a
       LEFT JOIN entities organization ON organization.id = a.org_id
       WHERE a.org_id IS NOT NULL
         AND (organization.id IS NULL OR organization.kind <> 'org')
     ) THEN
       RAISE EXCEPTION 'actors.org_id contains a non-organization entity reference';
     END IF;
   END
   $$;

   CREATE OR REPLACE FUNCTION axxium_enforce_actor_org_id()
   RETURNS trigger AS $$
   BEGIN
     IF NEW.org_id IS NOT NULL AND NOT EXISTS (
       SELECT 1
       FROM entities organization
       WHERE organization.id = NEW.org_id
         AND organization.kind = 'org'
     ) THEN
       RAISE EXCEPTION 'actors.org_id must reference an entity with kind org'
         USING ERRCODE = '23514';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   DROP TRIGGER IF EXISTS axxium_enforce_actor_org_id ON actors;
   CREATE TRIGGER axxium_enforce_actor_org_id
     BEFORE INSERT OR UPDATE OF org_id ON actors
     FOR EACH ROW EXECUTE FUNCTION axxium_enforce_actor_org_id();

   CREATE OR REPLACE FUNCTION axxium_protect_org_entity_kind()
   RETURNS trigger AS $$
   BEGIN
     IF OLD.kind = 'org'
        AND NEW.kind <> 'org'
        AND EXISTS (SELECT 1 FROM actors WHERE org_id = OLD.id) THEN
       RAISE EXCEPTION 'cannot change kind of an entity used as actor organization scope'
         USING ERRCODE = '23514';
     END IF;
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql;

   DROP TRIGGER IF EXISTS axxium_protect_org_entity_kind ON entities;
   CREATE TRIGGER axxium_protect_org_entity_kind
     BEFORE UPDATE OF kind ON entities
     FOR EACH ROW EXECUTE FUNCTION axxium_protect_org_entity_kind();

   CREATE TABLE IF NOT EXISTS sessions (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     actor_id TEXT NOT NULL REFERENCES actors(id),
     token_hash TEXT NOT NULL,
     expires_at TIMESTAMPTZ NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE TABLE IF NOT EXISTS oauth_clients (
     id TEXT PRIMARY KEY,
     secret_hash TEXT NOT NULL,
     name TEXT NOT NULL,
     redirect_uris JSONB DEFAULT '[]',
     grant_types JSONB DEFAULT '[]',
     scopes JSONB DEFAULT '[]',
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   CREATE INDEX IF NOT EXISTS idx_actors_email ON actors(email);
   CREATE INDEX IF NOT EXISTS idx_actors_org ON actors(org_id);
   CREATE INDEX IF NOT EXISTS idx_sessions_actor ON sessions(actor_id);
   CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);"
  )

(defn init-schema!
  "Initialize database schema. Idempotent."
  []
  (.query @pool schema-sql #js []))
