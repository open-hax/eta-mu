import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.token_hash.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.stores.mongo_policy_directory.js";
import "./knoxx.backend.infra.stores.mongo_policy_roles.js";
import "./knoxx.backend.infra.stores.mongo_policy_tools.js";
import "./knoxx.backend.infra.stores.mongo_policy_actor_credentials.js";
import "./knoxx.backend.infra.stores.mongo_policy_audit_events.js";
import "./knoxx.backend.infra.stores.mongo_policy_data_lakes.js";
import "./knoxx.backend.infra.stores.mongo_policy_invites.js";
import "./knoxx.backend.infra.stores.mongo_policy_studio.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_store');
knoxx.backend.infra.stores.mongo_policy_store.SESSIONS_COLLECTION = "knoxx_policy_sessions";
knoxx.backend.infra.stores.mongo_policy_store.CONFIG_COLLECTION = "knoxx_config";
knoxx.backend.infra.stores.mongo_policy_store.session_ttl_seconds = (function knoxx$backend$infra$stores$mongo_policy_store$session_ttl_seconds(){
return parseInt((function (){var or__5162__auto__ = (process.env["KNOXX_SESSION_TTL_SECONDS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "86400";
}
})(),(10));
});
knoxx.backend.infra.stores.mongo_policy_store.sessions_coll = (function knoxx$backend$infra$stores$mongo_policy_store$sessions_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_store.SESSIONS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_store.config_coll = (function knoxx$backend$infra$stores$mongo_policy_store$config_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_store.CONFIG_COLLECTION);
});
/**
 * Same public shape as infra.db.policy/session-row-response.
 */
knoxx.backend.infra.stores.mongo_policy_store.session_row_response = (function knoxx$backend$infra$stores$mongo_policy_store$session_row_response(row){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"session","session",1008279103),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"expires_at","expires_at",-423028958).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"display_name","display_name",-1494335013).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(row)])], null);
});
/**
 * Create session lookup + TTL and config uniqueness indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_policy_store.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$setup_indexes_BANG_(db){
var sessions = knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db);
var config = knoxx.backend.infra.stores.mongo_policy_store.config_coll(db);
(await sessions.createIndex(({"session_id": (1)}),({"unique": true})));

(await sessions.createIndex(({"token_prefix": (1)})));

(await sessions.createIndex(({"expires_at": (1)}),({"expireAfterSeconds": (0)})));

(await config.createIndex(({"key": (1)}),({"unique": true})));

(await knoxx.backend.infra.stores.mongo_policy_directory.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_roles.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_tools.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_actor_credentials.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_audit_events.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_data_lakes.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_invites.setup_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_studio.setup_state_indexes_BANG_(db));

(await knoxx.backend.infra.stores.mongo_policy_studio.setup_assets_indexes_BANG_(db));

return true;
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_policy_store !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Single-flight setup-indexes! per process. Called from the policy-flag
 * dispatch path so the TTL and uniqueness indexes exist even when the
 * composite-store flag (which gates bootstrap's mongo path) is off.
 */
knoxx.backend.infra.stores.mongo_policy_store.ensure_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$ensure_indexes_BANG_(db){
if(cljs.core.truth_(db)){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_))){
} else {
cljs.core.reset_BANG_(knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_,knoxx.backend.infra.stores.mongo_policy_store.setup_indexes_BANG_(db));
}

try{return (await cljs.core.deref(knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_));
}catch (e26271){var err = e26271;
cljs.core.reset_BANG_(knoxx.backend.infra.stores.mongo_policy_store.indexes_init_promise_STAR_,null);

return console.warn("[mongo-policy-store] index setup failed:",err);
}} else {
return null;
}
});
/**
 * Persist a new auth session. Mirrors infra.db.policy/create-session!.
 */
knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$create_session_BANG_(var_args){
var G__26294 = arguments.length;
switch (G__26294) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__26304){
var map__26305 = p__26304;
var map__26305__$1 = cljs.core.__destructure_map(map__26305);
var ip_address = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"ip-address","ip-address",719840734));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var user_agent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"user-agent","user-agent",1220426212));
var membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"membership-id","membership-id",-723542492));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"token","token",-1211463215));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26305__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231));
if(clojure.string.blank_QMARK_(token)){
throw (new Error("token is required"));
} else {
var salt = knoxx.backend.infra.auth.token_hash.generate_salt();
var now = (new Date());
var doc = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"salt","salt",-587171712),new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"expires_at","expires_at",-423028958),new cljs.core.Keyword(null,"token_prefix","token_prefix",1512029030),new cljs.core.Keyword(null,"token_hash","token_hash",422358056),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"ip_address","ip_address",-170091063),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),new cljs.core.Keyword(null,"last_seen_at","last_seen_at",89142124),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609),new cljs.core.Keyword(null,"user_agent","user_agent",985821103),new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135),new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.Keyword(null,"created_at","created_at",1484050750)],[salt,email,(new Date((Date.now() + (knoxx.backend.infra.stores.mongo_policy_store.session_ttl_seconds() * (1000))))),knoxx.backend.infra.auth.token_hash.token_prefix(token),knoxx.backend.infra.auth.token_hash.hash_token(token,salt),org_id,ip_address,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())),knoxx.backend.infra.system_instance.current_id(),now,membership_id,(await (async function (){var or__5162__auto__ = auth_provider;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "github";
}
})()),user_agent,user_id,external_subject,display_name,now]);
(await knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db).insertOne(cljs.core.clj__GT_js(doc)));

return knoxx.backend.infra.stores.mongo_policy_store.session_row_response(doc);
}
}));

(knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Update last_seen_at; failures are swallowed like the PG variant.
 */
knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$touch_session_best_effort_BANG_(var_args){
var G__26308 = arguments.length;
switch (G__26308) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (session_id){
return knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),session_id);
}));

(knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,session_id){
try{(await knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db).updateOne(({"session_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))}),({"$set": ({"last_seen_at": (new Date())})})));

return null;
}catch (e26310){var _ = e26310;
return null;
}}));

(knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Find the candidate row whose salted hash matches the presented token.
 */
knoxx.backend.infra.stores.mongo_policy_store.find_session_by_token = (async function knoxx$backend$infra$stores$mongo_policy_store$find_session_by_token(db,token){
var cursor = knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db).find(({"token_prefix": knoxx.backend.infra.auth.token_hash.token_prefix(token), "expires_at": ({"$gt": (new Date())})}));
var rows = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await cursor.toArray()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26311_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"token_hash","token_hash",422358056).cljs$core$IFn$_invoke$arity$1(p1__26311_SHARP_),knoxx.backend.infra.auth.token_hash.hash_token(token,new cljs.core.Keyword(null,"salt","salt",-587171712).cljs$core$IFn$_invoke$arity$1(p1__26311_SHARP_)));
}),rows));
});
/**
 * Resolve a session by bearer token, touching last_seen_at on hit.
 */
knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$get_session_by_token_BANG_(var_args){
var G__26314 = arguments.length;
switch (G__26314) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (token){
return knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),token);
}));

(knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,token){
if(clojure.string.blank_QMARK_(token)){
return null;
} else {
try{var temp__5825__auto__ = (await knoxx.backend.infra.stores.mongo_policy_store.find_session_by_token(db,token));
if(cljs.core.truth_(temp__5825__auto__)){
var row = temp__5825__auto__;
knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(row));

return knoxx.backend.infra.stores.mongo_policy_store.session_row_response(row);
} else {
return null;
}
}catch (e26317){var _ = e26317;
return null;
}}
}));

(knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Delete the session matching token; returns the deleted session response.
 */
knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$delete_session_by_token_BANG_(var_args){
var G__26326 = arguments.length;
switch (G__26326) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (token){
return knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),token);
}));

(knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,token){
var result = (await knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2(db,token));
var temp__5825__auto___26399 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
if(cljs.core.truth_(temp__5825__auto___26399)){
var sid_26401 = temp__5825__auto___26399;
try{(await knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db).deleteOne(({"session_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sid_26401))})));
}catch (e26328){var __26406 = e26328;
}} else {
}

return result;
}));

(knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Delete expired sessions. The TTL index already reaps server-side; this
 * keeps API parity with the PG layer and returns the deleted count.
 */
knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$cleanup_expired_sessions_BANG_(var_args){
var G__26347 = arguments.length;
switch (G__26347) {
case 0:
return knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (db){
try{var result = (await knoxx.backend.infra.stores.mongo_policy_store.sessions_coll(db).deleteMany(({"expires_at": ({"$lt": (new Date())})})));
var n = (await (async function (){var or__5162__auto__ = result.deletedCount;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
if((n > (0))){
console.log("[mongo-policy-store] Cleaned up",n,"expired sessions");
} else {
}

return n;
}catch (e26349){var _ = e26349;
return (0);
}}));

(knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Read a singleton config value by key, or nil.
 */
knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$get_config_value_BANG_(var_args){
var G__26354 = arguments.length;
switch (G__26354) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (key){
return knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),key);
}));

(knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,key){
var row = (await knoxx.backend.infra.stores.mongo_policy_store.config_coll(db).findOne(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))})));
if(cljs.core.truth_(row)){
return (row["value"]);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Upsert a singleton config value by key. Returns the value.
 */
knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$set_config_value_BANG_(var_args){
var G__26359 = arguments.length;
switch (G__26359) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (key,value){
return knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),key,value);
}));

(knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,key,value){
(await knoxx.backend.infra.stores.mongo_policy_store.config_coll(db).updateOne(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))}),({"$set": ({"value": value, "updated_at": (new Date())})}),({"upsert": true})));

return value;
}));

(knoxx.backend.infra.stores.mongo_policy_store.set_config_value_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Atomically set key to value only if absent ($setOnInsert), returning the
 * stored (winning) value. First writer wins: concurrent initializers all
 * observe the same value, unlike set-config-value! which clobbers.
 */
knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$init_config_value_BANG_(var_args){
var G__26366 = arguments.length;
switch (G__26366) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (key,value){
return knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),key,value);
}));

(knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,key,value){
var result = (await knoxx.backend.infra.stores.mongo_policy_store.config_coll(db).findOneAndUpdate(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))}),({"$setOnInsert": ({"value": value, "updated_at": (new Date())})}),({"upsert": true, "returnDocument": "after"})));
var or__5162__auto__ = (cljs.core.truth_(result)?(result["value"]):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return value;
}
}));

(knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Load the session secret from knoxx_config, generating and persisting one
 * if absent. An optional fallback-secret (e.g. read from the PG config
 * table during cutover) is adopted before generating a fresh one, so
 * existing cookies survive the storage migration. The write is
 * first-writer-wins, so concurrent recovery converges on one secret.
 */
knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_store$recover_session_secret_BANG_(var_args){
var G__26375 = arguments.length;
switch (G__26375) {
case 0:
return knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),null);
}));

(knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (fallback_secret){
return knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),fallback_secret);
}));

(knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,fallback_secret){
var temp__5823__auto__ = (await knoxx.backend.infra.stores.mongo_policy_store.get_config_value_BANG_.cljs$core$IFn$_invoke$arity$2(db,"session_secret"));
if(cljs.core.truth_(temp__5823__auto__)){
var stored = temp__5823__auto__;
console.log("[mongo-policy-store] Recovered session secret from Mongo");

return stored;
} else {
var adopted_QMARK_ = (!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = fallback_secret;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))));
var candidate = ((adopted_QMARK_)?fallback_secret:knoxx.backend.infra.auth.token_hash.generate_secret());
var secret = (await knoxx.backend.infra.stores.mongo_policy_store.init_config_value_BANG_.cljs$core$IFn$_invoke$arity$3(db,"session_secret",candidate));
console.log(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(secret,candidate))?"[mongo-policy-store] Session secret already initialized by a concurrent writer":((adopted_QMARK_)?"[mongo-policy-store] Adopted session secret from fallback store":"[mongo-policy-store] Generated and persisted session secret"
)));

return secret;
}
}));

(knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_store.js.map
