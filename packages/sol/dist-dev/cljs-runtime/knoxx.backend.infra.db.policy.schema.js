import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.extern.pg.js";
import "./knoxx.backend.infra.registry.tools.js";
goog.provide('knoxx.backend.infra.db.policy.schema');
knoxx.backend.infra.db.policy.schema.schema_ddl = "\n    CREATE EXTENSION IF NOT EXISTS pgcrypto;\n\n    CREATE TABLE IF NOT EXISTS orgs (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      slug TEXT NOT NULL UNIQUE,\n      name TEXT NOT NULL,\n      kind TEXT NOT NULL DEFAULT 'customer',\n      is_primary BOOLEAN NOT NULL DEFAULT FALSE,\n      status TEXT NOT NULL DEFAULT 'active',\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS users (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      email TEXT NOT NULL UNIQUE,\n      display_name TEXT NOT NULL,\n      auth_provider TEXT NOT NULL DEFAULT 'bootstrap',\n      external_subject TEXT,\n      status TEXT NOT NULL DEFAULT 'active',\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS memberships (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      actor_id TEXT,\n      status TEXT NOT NULL DEFAULT 'active',\n      is_default BOOLEAN NOT NULL DEFAULT FALSE,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      UNIQUE (user_id, org_id)\n    );\n\n    CREATE INDEX IF NOT EXISTS idx_memberships_user_id ON memberships (user_id);\n    CREATE INDEX IF NOT EXISTS idx_memberships_org_id ON memberships (org_id);\n    CREATE INDEX IF NOT EXISTS idx_memberships_actor_id ON memberships (actor_id);\n\n    CREATE TABLE IF NOT EXISTS roles (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,\n      name TEXT NOT NULL,\n      slug TEXT NOT NULL,\n      scope_kind TEXT NOT NULL DEFAULT 'org',\n      built_in BOOLEAN NOT NULL DEFAULT FALSE,\n      system_managed BOOLEAN NOT NULL DEFAULT FALSE,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      CHECK (scope_kind IN ('platform', 'org'))\n    );\n\n    CREATE UNIQUE INDEX IF NOT EXISTS roles_platform_slug_uniq\n      ON roles (slug) WHERE org_id IS NULL;\n\n    CREATE UNIQUE INDEX IF NOT EXISTS roles_org_slug_uniq\n      ON roles (org_id, slug) WHERE org_id IS NOT NULL;\n\n    CREATE INDEX IF NOT EXISTS idx_roles_org_id ON roles (org_id);\n\n    CREATE TABLE IF NOT EXISTS role_permissions (\n      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,\n      permission_code TEXT NOT NULL,\n      effect TEXT NOT NULL DEFAULT 'allow',\n      PRIMARY KEY (role_id, permission_code),\n      CHECK (effect IN ('allow', 'deny'))\n    );\n\n    ALTER TABLE role_permissions ADD COLUMN IF NOT EXISTS permission_code TEXT;\n\n    DO $$\n    BEGIN\n      IF EXISTS (\n        SELECT 1 FROM information_schema.tables\n        WHERE table_schema = 'public' AND table_name = 'permissions'\n      ) AND EXISTS (\n        SELECT 1 FROM information_schema.columns\n        WHERE table_schema = 'public' AND table_name = 'role_permissions'\n          AND column_name = 'permission_id'\n      ) THEN\n        UPDATE role_permissions rp\n        SET permission_code = p.code\n        FROM permissions p\n        WHERE rp.permission_code IS NULL AND rp.permission_id = p.id;\n      END IF;\n    END $$;\n\n    CREATE UNIQUE INDEX IF NOT EXISTS role_permissions_role_code_uniq\n      ON role_permissions (role_id, permission_code)\n      WHERE permission_code IS NOT NULL;\n\n    CREATE TABLE IF NOT EXISTS membership_roles (\n      membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,\n      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,\n      PRIMARY KEY (membership_id, role_id)\n    );\n\n    CREATE TABLE IF NOT EXISTS tool_definitions (\n      id TEXT PRIMARY KEY,\n      label TEXT NOT NULL,\n      description TEXT NOT NULL,\n      risk_level TEXT NOT NULL DEFAULT 'medium'\n    );\n\n    CREATE TABLE IF NOT EXISTS role_tool_policies (\n      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,\n      tool_id TEXT NOT NULL REFERENCES tool_definitions(id) ON DELETE CASCADE,\n      effect TEXT NOT NULL DEFAULT 'allow',\n      constraints_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      PRIMARY KEY (role_id, tool_id),\n      CHECK (effect IN ('allow', 'deny'))\n    );\n\n    CREATE TABLE IF NOT EXISTS user_tool_policies (\n      membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,\n      tool_id TEXT NOT NULL REFERENCES tool_definitions(id) ON DELETE CASCADE,\n      effect TEXT NOT NULL DEFAULT 'allow',\n      constraints_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      PRIMARY KEY (membership_id, tool_id),\n      CHECK (effect IN ('allow', 'deny'))\n    );\n\n    CREATE TABLE IF NOT EXISTS actor_credentials (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      provider TEXT NOT NULL,\n      kind TEXT NOT NULL DEFAULT 'credential',\n      account_identifier TEXT,\n      secret_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      status TEXT NOT NULL DEFAULT 'active',\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      UNIQUE (user_id, org_id, provider, kind)\n    );\n\n    CREATE INDEX IF NOT EXISTS actor_credentials_user_org_idx\n      ON actor_credentials (user_id, org_id, provider);\n\n    CREATE TABLE IF NOT EXISTS data_lakes (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      name TEXT NOT NULL,\n      slug TEXT NOT NULL,\n      kind TEXT NOT NULL DEFAULT 'workspace_docs',\n      config_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      status TEXT NOT NULL DEFAULT 'active',\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      UNIQUE (org_id, slug)\n    );\n\n    CREATE INDEX IF NOT EXISTS idx_data_lakes_org_id ON data_lakes (org_id);\n\n    CREATE TABLE IF NOT EXISTS audit_events (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,\n      actor_membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,\n      org_id UUID REFERENCES orgs(id) ON DELETE SET NULL,\n      action TEXT NOT NULL,\n      resource_kind TEXT NOT NULL,\n      resource_id TEXT,\n      before_json JSONB,\n      after_json JSONB,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    CREATE INDEX IF NOT EXISTS idx_audit_events_org_created ON audit_events (org_id, created_at);\n    CREATE INDEX IF NOT EXISTS idx_audit_events_action_resource ON audit_events (action, resource_kind, created_at);\n\n    CREATE TABLE IF NOT EXISTS sessions (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n      membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      token_hash TEXT NOT NULL,\n      token_prefix TEXT NOT NULL DEFAULT '',\n      salt TEXT NOT NULL,\n      email TEXT NOT NULL,\n      display_name TEXT NOT NULL,\n      auth_provider TEXT NOT NULL DEFAULT 'github',\n      external_subject TEXT,\n      ip_address TEXT,\n      user_agent TEXT,\n      expires_at TIMESTAMPTZ NOT NULL,\n      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    ALTER TABLE sessions ADD COLUMN IF NOT EXISTS token_prefix TEXT NOT NULL DEFAULT '';\n    ALTER TABLE memberships ADD COLUMN IF NOT EXISTS actor_id TEXT;\n\n    CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions (user_id);\n    CREATE INDEX IF NOT EXISTS sessions_membership_idx ON sessions (membership_id);\n    CREATE INDEX IF NOT EXISTS sessions_token_prefix_idx ON sessions (token_prefix);\n    CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at);\n\n    CREATE TABLE IF NOT EXISTS invites (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      code TEXT NOT NULL UNIQUE,\n      email TEXT NOT NULL,\n      inviter_membership_id UUID REFERENCES memberships(id) ON DELETE SET NULL,\n      role_slugs JSONB NOT NULL DEFAULT '[]'::jsonb,\n      status TEXT NOT NULL DEFAULT 'pending',\n      redeemed_by UUID REFERENCES users(id) ON DELETE SET NULL,\n      redeemed_at TIMESTAMPTZ,\n      expires_at TIMESTAMPTZ NOT NULL,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    CREATE INDEX IF NOT EXISTS invites_org_idx ON invites (org_id);\n    CREATE INDEX IF NOT EXISTS invites_code_idx ON invites (code);\n    CREATE INDEX IF NOT EXISTS invites_status_idx ON invites (status);\n\n    CREATE TABLE IF NOT EXISTS knoxx_config (\n      key TEXT PRIMARY KEY,\n      value TEXT NOT NULL,\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()\n    );\n\n    CREATE TABLE IF NOT EXISTS actor_mailbox_entries (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      kind TEXT NOT NULL DEFAULT 'actor-message',\n      status TEXT NOT NULL DEFAULT 'pending',\n      source_actor_id TEXT, source_session_id TEXT, source_conversation_id TEXT,\n      source_run_id TEXT, source_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      target_kind TEXT NOT NULL DEFAULT 'unknown',\n      target_actor_id TEXT, target_session_id TEXT, target_conversation_id TEXT,\n      target_run_id TEXT, target_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      delivery_mode TEXT NOT NULL DEFAULT 'follow-up',\n      attempts INT NOT NULL DEFAULT 0,\n      next_at TIMESTAMPTZ, expires_at TIMESTAMPTZ, delivered_at TIMESTAMPTZ,\n      acknowledged_at TIMESTAMPTZ,\n      content_ref_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      metadata_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      preview TEXT, last_error TEXT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      CHECK (status IN ('pending','delivered','failed','expired','superseded','acknowledged')),\n      CHECK (delivery_mode IN ('steer','follow-up','event','inbox-only','direct-run'))\n    );\n\n    CREATE INDEX IF NOT EXISTS actor_mailbox_status_next_idx ON actor_mailbox_entries (status, next_at);\n    CREATE INDEX IF NOT EXISTS actor_mailbox_target_actor_idx ON actor_mailbox_entries (target_actor_id, status, created_at DESC);\n    CREATE INDEX IF NOT EXISTS actor_mailbox_target_session_idx ON actor_mailbox_entries (target_session_id, status, created_at DESC);\n    CREATE INDEX IF NOT EXISTS actor_mailbox_source_run_idx ON actor_mailbox_entries (source_run_id, created_at DESC);\n\n    CREATE TABLE IF NOT EXISTS actor_mailbox_routes (\n      actor_id TEXT PRIMARY KEY,\n      conversation_id TEXT, session_id TEXT, run_id TEXT, contract_id TEXT,\n      status TEXT NOT NULL DEFAULT 'active',\n      source_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      expires_at TIMESTAMPTZ,\n      last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      CHECK (status IN ('active','inactive'))\n    );\n\n    CREATE INDEX IF NOT EXISTS actor_mailbox_routes_session_idx ON actor_mailbox_routes (session_id);\n    CREATE INDEX IF NOT EXISTS actor_mailbox_routes_conversation_idx ON actor_mailbox_routes (conversation_id);\n    CREATE INDEX IF NOT EXISTS actor_mailbox_routes_status_seen_idx ON actor_mailbox_routes (status, last_seen_at DESC);\n\n    CREATE TABLE IF NOT EXISTS studio_state (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,\n      org_id UUID NOT NULL REFERENCES orgs(id) ON DELETE CASCADE,\n      kind TEXT NOT NULL DEFAULT 'player',\n      state_json JSONB NOT NULL DEFAULT '{}'::jsonb,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      UNIQUE (user_id, org_id, kind)\n    );\n\n    CREATE INDEX IF NOT EXISTS studio_state_user_idx ON studio_state (user_id);\n    CREATE INDEX IF NOT EXISTS studio_state_org_idx ON studio_state (org_id);\n\n    CREATE TABLE IF NOT EXISTS studio_audio_assets (\n      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n      audio_path TEXT NOT NULL,\n      asset_type TEXT NOT NULL CHECK (asset_type IN ('waveform','spectrogram')),\n      image_data BYTEA NOT NULL,\n      mime_type TEXT NOT NULL DEFAULT 'image/png',\n      width INT, height INT,\n      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),\n      UNIQUE (audio_path, asset_type)\n    );\n\n    CREATE INDEX IF NOT EXISTS studio_audio_assets_path_idx ON studio_audio_assets (audio_path);\n    CREATE INDEX IF NOT EXISTS studio_audio_assets_type_idx ON studio_audio_assets (asset_type);\n  ";
knoxx.backend.infra.db.policy.schema.ensure_schema_BANG_ = (function knoxx$backend$infra$db$policy$schema$ensure_schema_BANG_(pool){
return knoxx.backend.extern.pg.query_BANG_(pool,knoxx.backend.infra.db.policy.schema.schema_ddl,null);
});
knoxx.backend.infra.db.policy.schema.seed_tool_ids = (function knoxx$backend$infra$db$policy$schema$seed_tool_ids(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.known_tool_ids(),cljs.core.seq(knoxx.backend.infra.registry.tools.known_tool_ids()))))));
});
knoxx.backend.infra.db.policy.schema.insert_tool_seeds_BANG_ = (function knoxx$backend$infra$db$policy$schema$insert_tool_seeds_BANG_(pool){
var ids = knoxx.backend.infra.db.policy.schema.seed_tool_ids();
if(cljs.core.empty_QMARK_(ids)){
return Promise.resolve(null);
} else {
return Promise.all(cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((function (){var iter__5649__auto__ = (function knoxx$backend$infra$db$policy$schema$insert_tool_seeds_BANG__$_iter__72010(s__72011){
return (new cljs.core.LazySeq(null,(function (){
var s__72011__$1 = s__72011;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__72011__$1);
if(temp__5825__auto__){
var s__72011__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__72011__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__72011__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__72013 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__72012 = (0);
while(true){
if((i__72012 < size__5648__auto__)){
var tool_id = cljs.core._nth(c__5647__auto__,i__72012);
cljs.core.chunk_append(b__72013,(function (){var map__72019 = knoxx.backend.infra.registry.tools.get_tool(tool_id);
var map__72019__$1 = cljs.core.__destructure_map(map__72019);
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72019__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72019__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
var risk_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72019__$1,new cljs.core.Keyword(null,"risk-level","risk-level",658496607));
return knoxx.backend.extern.pg.query_BANG_(pool,"INSERT INTO tool_definitions (id, label, description, risk_level)\n                   VALUES ($1, $2, $3, $4)\n                   ON CONFLICT (id) DO UPDATE\n                   SET label = EXCLUDED.label,\n                       description = EXCLUDED.description,\n                       risk_level = EXCLUDED.risk_level",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [tool_id,(function (){var or__5162__auto__ = label;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})(),(function (){var or__5162__auto__ = description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = risk_level;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "low";
}
})()], null));
})());

var G__72056 = (i__72012 + (1));
i__72012 = G__72056;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__72013),knoxx$backend$infra$db$policy$schema$insert_tool_seeds_BANG__$_iter__72010(cljs.core.chunk_rest(s__72011__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__72013),null);
}
} else {
var tool_id = cljs.core.first(s__72011__$2);
return cljs.core.cons((function (){var map__72032 = knoxx.backend.infra.registry.tools.get_tool(tool_id);
var map__72032__$1 = cljs.core.__destructure_map(map__72032);
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72032__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72032__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
var risk_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__72032__$1,new cljs.core.Keyword(null,"risk-level","risk-level",658496607));
return knoxx.backend.extern.pg.query_BANG_(pool,"INSERT INTO tool_definitions (id, label, description, risk_level)\n                   VALUES ($1, $2, $3, $4)\n                   ON CONFLICT (id) DO UPDATE\n                   SET label = EXCLUDED.label,\n                       description = EXCLUDED.description,\n                       risk_level = EXCLUDED.risk_level",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [tool_id,(function (){var or__5162__auto__ = label;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})(),(function (){var or__5162__auto__ = description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),(function (){var or__5162__auto__ = risk_level;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "low";
}
})()], null));
})(),knoxx$backend$infra$db$policy$schema$insert_tool_seeds_BANG__$_iter__72010(cljs.core.rest(s__72011__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(ids);
})())).then((function (_){
return null;
}));
}
});
/**
 * No-op — permissions are contract-driven.
 */
knoxx.backend.infra.db.policy.schema.insert_permission_seeds_BANG_ = (function knoxx$backend$infra$db$policy$schema$insert_permission_seeds_BANG_(_pool){
return Promise.resolve(null);
});

//# sourceMappingURL=knoxx.backend.infra.db.policy.schema.js.map
