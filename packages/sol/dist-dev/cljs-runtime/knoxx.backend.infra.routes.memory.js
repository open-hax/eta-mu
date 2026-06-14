import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.core_memory.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./knoxx.backend.domain.graph.expansion_policy.js";
import "./knoxx.backend.domain.graph.policy_registry.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.infra.stores.mongo_memory_sessions.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.stores.session_titles.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.shape.memory_sessions.js";
import "./knoxx.backend.shape.parse.js";
import "./knoxx.backend.domain.time.js";
import "./shadow.esm.esm_import$node_crypto.js";
goog.provide('knoxx.backend.infra.routes.memory');
knoxx.backend.infra.routes.memory.interactive_session_id_QMARK_ = (function knoxx$backend$infra$routes$memory$interactive_session_id_QMARK_(session_id){
return (!(clojure.string.starts_with_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"translation-")));
});
knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_ = (function knoxx$backend$infra$routes$memory$openplanner_ready_QMARK_(config){
return knoxx.backend.infra.clients.openplanner.enabled_QMARK_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config));
});
knoxx.backend.infra.routes.memory.memory_sessions_cache_ttl_seconds = (10);
knoxx.backend.infra.routes.memory.memory_sessions_cache_ttl_ms = (knoxx.backend.infra.routes.memory.memory_sessions_cache_ttl_seconds * (1000));
knoxx.backend.infra.routes.memory.memory_sessions_cache_max_entries = (256);
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.memory !== 'undefined') && (typeof knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.memory !== 'undefined') && (typeof knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.routes.memory.clear_memory_sessions_cache_BANG_ = (function knoxx$backend$infra$routes$memory$clear_memory_sessions_cache_BANG_(){
cljs.core.reset_BANG_(knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_,cljs.core.PersistentArrayMap.EMPTY);

cljs.core.reset_BANG_(knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_,cljs.core.PersistentArrayMap.EMPTY);

return true;
});
knoxx.backend.infra.routes.memory.now_ms = (function knoxx$backend$infra$routes$memory$now_ms(){
return Date.now();
});
knoxx.backend.infra.routes.memory.sha256 = (function knoxx$backend$infra$routes$memory$sha256(value){
return shadow.esm.esm_import$node_crypto.createHash("sha256").update((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))).digest("hex");
});
knoxx.backend.infra.routes.memory.stable_json = (function knoxx$backend$infra$routes$memory$stable_json(value){
return JSON.stringify(cljs.core.clj__GT_js(value));
});
knoxx.backend.infra.routes.memory.memory_sessions_auth_scope = (function knoxx$backend$infra$routes$memory$memory_sessions_auth_scope(ctx){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"system-admin?","system-admin?",-148862842),cljs.core.boolean$(knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)),new cljs.core.Keyword(null,"cross-session?","cross-session?",-122960164),cljs.core.boolean$(knoxx.backend.infra.auth.authz.ctx_permitted_QMARK_(ctx,"agent.memory.cross_session")),new cljs.core.Keyword(null,"org-id","org-id",1485182668),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.auth.authz.ctx_org_id(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.auth.authz.ctx_membership_id(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"user-id","user-id",-206822291),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.auth.authz.ctx_user_id(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.auth.authz.ctx_actor_id(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))], null);
});
knoxx.backend.infra.routes.memory.memory_sessions_cache_key = (function knoxx$backend$infra$routes$memory$memory_sessions_cache_key(p__29541){
var map__29542 = p__29541;
var map__29542__$1 = cljs.core.__destructure_map(map__29542);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"config","config",994861415));
var ctx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"ctx","ctx",-493610118));
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29542__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
return knoxx.backend.infra.routes.memory.sha256(knoxx.backend.infra.routes.memory.stable_json(new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"v","v",21465059),(1),new cljs.core.Keyword(null,"project","project",1124394579),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"limit","limit",-1355822363),cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (12);
}
})()),new cljs.core.Keyword(null,"offset","offset",296498311),cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(function (){var or__5162__auto__ = offset;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = actor_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(function (){var or__5162__auto__ = exclude_actor_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = contract_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"auth","auth",1389754926),knoxx.backend.infra.routes.memory.memory_sessions_auth_scope(ctx)], null)));
});
knoxx.backend.infra.routes.memory.evict_memory_sessions_cache_BANG_ = (function knoxx$backend$infra$routes$memory$evict_memory_sessions_cache_BANG_(){
var ts = knoxx.backend.infra.routes.memory.now_ms();
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_,(function (entries){
var live = cljs.core.take_last(knoxx.backend.infra.routes.memory.memory_sessions_cache_max_entries,cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p__29565){
var vec__29566 = p__29565;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29566,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29566,(1),null);
return new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$2(entry,(0));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__29571){
var vec__29572 = p__29571;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29572,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29572,(1),null);
return (new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(entry,(0)) > ts);
}),entries)));
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,live);
}));
});
knoxx.backend.infra.routes.memory.memory_sessions_cache_entry = (function knoxx$backend$infra$routes$memory$memory_sessions_cache_entry(value){
var ts = knoxx.backend.infra.routes.memory.now_ms();
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"value","value",305978217),value,new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),ts,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),(ts + knoxx.backend.infra.routes.memory.memory_sessions_cache_ttl_ms)], null);
});
knoxx.backend.infra.routes.memory.memory_sessions_local_hit = (function knoxx$backend$infra$routes$memory$memory_sessions_local_hit(cache_key){
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_),cache_key);
if(cljs.core.truth_(temp__5825__auto__)){
var entry = temp__5825__auto__;
var ts = knoxx.backend.infra.routes.memory.now_ms();
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(entry,(0)) > ts)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"cache","cache",-1237023054),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"hit","hit",1909257382),true,new cljs.core.Keyword(null,"tier","tier",-1071893374),"memory",new cljs.core.Keyword(null,"stale","stale",395586896),false,new cljs.core.Keyword(null,"age_ms","age_ms",-308689560),cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(ts - new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$2(entry,ts)))], null)], null);
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_,cljs.core.dissoc,cache_key);

return null;
}
} else {
return null;
}
});
knoxx.backend.infra.routes.memory.remember_memory_sessions_cache_BANG_ = (function knoxx$backend$infra$routes$memory$remember_memory_sessions_cache_BANG_(cache_key,entry){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.routes.memory.memory_sessions_cache_STAR_,cljs.core.assoc,cache_key,entry);

knoxx.backend.infra.routes.memory.evict_memory_sessions_cache_BANG_();

return entry;
});
knoxx.backend.infra.routes.memory.write_memory_sessions_cache_to_mongo_BANG_ = (async function knoxx$backend$infra$routes$memory$write_memory_sessions_cache_to_mongo_BANG_(cache_key,entry){
try{return (await knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2(cache_key,entry));
}catch (e29598){var _ = e29598;
return null;
}});
knoxx.backend.infra.routes.memory.write_memory_sessions_cache_BANG_ = (function knoxx$backend$infra$routes$memory$write_memory_sessions_cache_BANG_(cache_key,value){
var entry = knoxx.backend.infra.routes.memory.memory_sessions_cache_entry(value);
knoxx.backend.infra.routes.memory.remember_memory_sessions_cache_BANG_(cache_key,entry);

knoxx.backend.infra.routes.memory.write_memory_sessions_cache_to_mongo_BANG_(cache_key,entry);

return entry;
});
knoxx.backend.infra.routes.memory.mongo_memory_sessions_hit_BANG_ = (async function knoxx$backend$infra$routes$memory$mongo_memory_sessions_hit_BANG_(cache_key){
try{var entry = (await knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$1(cache_key));
var ts = knoxx.backend.infra.routes.memory.now_ms();
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = entry;
if(cljs.core.truth_(and__5160__auto__)){
return (new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(entry,(0)) > ts);
} else {
return and__5160__auto__;
}
})()))){
knoxx.backend.infra.routes.memory.remember_memory_sessions_cache_BANG_(cache_key,entry);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"cache","cache",-1237023054),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"hit","hit",1909257382),true,new cljs.core.Keyword(null,"tier","tier",-1071893374),"mongo",new cljs.core.Keyword(null,"stale","stale",395586896),false,new cljs.core.Keyword(null,"age_ms","age_ms",-308689560),cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(ts - new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$2(entry,ts)))], null)], null);
} else {
return null;
}
}catch (e29605){var _ = e29605;
return null;
}});
knoxx.backend.infra.routes.memory.fetch_and_cache_memory_sessions_BANG_ = (async function knoxx$backend$infra$routes$memory$fetch_and_cache_memory_sessions_BANG_(cache_key,fetch_fn){
try{var value = (await (fetch_fn.cljs$core$IFn$_invoke$arity$0 ? fetch_fn.cljs$core$IFn$_invoke$arity$0() : fetch_fn.call(null)));
knoxx.backend.infra.routes.memory.write_memory_sessions_cache_BANG_(cache_key,value);

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),value,new cljs.core.Keyword(null,"cache","cache",-1237023054),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"hit","hit",1909257382),false,new cljs.core.Keyword(null,"tier","tier",-1071893374),"miss",new cljs.core.Keyword(null,"stale","stale",395586896),false,new cljs.core.Keyword(null,"age_ms","age_ms",-308689560),(0)], null)], null);
}finally {cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_,cljs.core.dissoc,cache_key);
}});
knoxx.backend.infra.routes.memory.cached_memory_sessions_source_BANG_ = (async function knoxx$backend$infra$routes$memory$cached_memory_sessions_source_BANG_(cache_key,fetch_fn){
var temp__5823__auto__ = knoxx.backend.infra.routes.memory.memory_sessions_local_hit(cache_key);
if(cljs.core.truth_(temp__5823__auto__)){
var hit = temp__5823__auto__;
return hit;
} else {
var temp__5823__auto____$1 = (await knoxx.backend.infra.routes.memory.mongo_memory_sessions_hit_BANG_(cache_key));
if(cljs.core.truth_(temp__5823__auto____$1)){
var hit = temp__5823__auto____$1;
return hit;
} else {
var temp__5823__auto____$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_),cache_key);
if(cljs.core.truth_(temp__5823__auto____$2)){
var pending = temp__5823__auto____$2;
return (await pending);
} else {
var promise = knoxx.backend.infra.routes.memory.fetch_and_cache_memory_sessions_BANG_(cache_key,fetch_fn);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.routes.memory.memory_sessions_cache_promises_STAR_,cljs.core.assoc,cache_key,promise);

return (await promise);
}
}
}
});
knoxx.backend.infra.routes.memory.fetch_session_filter_rows_BANG_ = (function knoxx$backend$infra$routes$memory$fetch_session_filter_rows_BANG_(fetch_openplanner_session_rows_BANG_,config,session_id){
if((fetch_openplanner_session_rows_BANG_ === knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_)){
return knoxx.backend.infra.core_memory.fetch_openplanner_session_visibility_rows_BANG_(config,session_id);
} else {
return (fetch_openplanner_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2 ? fetch_openplanner_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2(config,session_id) : fetch_openplanner_session_rows_BANG_.call(null,config,session_id));
}
});
knoxx.backend.infra.routes.memory.filter_page_actor_row_BANG_ = (async function knoxx$backend$infra$routes$memory$filter_page_actor_row_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,contract_id,row){
try{var rows = (await knoxx.backend.infra.routes.memory.fetch_session_filter_rows_BANG_(fetch_openplanner_session_rows_BANG_,config,new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(row)));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"row","row",-570139521),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([row,knoxx.backend.infra.core_memory.session_summary_scope_from_rows(rows)], 0)),new cljs.core.Keyword(null,"visible","visible",-1024216805),(await (async function (){var and__5160__auto__ = (session_matches_page_actor_filter_QMARK_.cljs$core$IFn$_invoke$arity$4 ? session_matches_page_actor_filter_QMARK_.cljs$core$IFn$_invoke$arity$4(config,rows,actor_id,exclude_actor_ids) : session_matches_page_actor_filter_QMARK_.call(null,config,rows,actor_id,exclude_actor_ids));
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.infra.core_memory.session_matches_contract_filter_QMARK_(config,rows,contract_id);
} else {
return and__5160__auto__;
}
})())], null);
}catch (e29612){var _ = e29612;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"row","row",-570139521),row,new cljs.core.Keyword(null,"visible","visible",-1024216805),false], null);
}});
knoxx.backend.infra.routes.memory.filter_page_actor_rows_BANG_ = (async function knoxx$backend$infra$routes$memory$filter_page_actor_rows_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,contract_id,page_rows){
if(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = actor_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))) && (((cljs.core.empty_QMARK_(exclude_actor_ids)) && (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = contract_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))))))){
return cljs.core.vec(page_rows);
} else {
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.memory.filter_page_actor_row_BANG_,config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([actor_id,exclude_actor_ids,contract_id], 0)),page_rows))));
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"row","row",-570139521),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"visible","visible",-1024216805),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))));
}
});
knoxx.backend.infra.routes.memory.grouped_session_rows = (function knoxx$backend$infra$routes$memory$grouped_session_rows(rows){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (state,row){
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(row)));
if(((clojure.string.blank_QMARK_(session_id)) || ((!(knoxx.backend.infra.routes.memory.interactive_session_id_QMARK_(session_id)))))){
return state;
} else {
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$6(state,new cljs.core.Keyword(null,"groups","groups",-136896102),cljs.core.update,session_id,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),row),new cljs.core.Keyword(null,"order","order",-1254677256),(function (order){
if(cljs.core.contains_QMARK_(new cljs.core.Keyword(null,"seen","seen",-518999789).cljs$core$IFn$_invoke$arity$1(state),session_id)){
return order;
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(order,session_id);
}
})),new cljs.core.Keyword(null,"seen","seen",-518999789),cljs.core.conj,session_id);
}
}),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"groups","groups",-136896102),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"order","order",-1254677256),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"seen","seen",-518999789),cljs.core.PersistentHashSet.EMPTY], null),rows);
});
knoxx.backend.infra.routes.memory.session_summary_title = (function knoxx$backend$infra$routes$memory$session_summary_title(session_id,scope){
var event_type = new cljs.core.Keyword(null,"event_type","event_type",1569866042).cljs$core$IFn$_invoke$arity$1(scope);
var trigger_id = new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554).cljs$core$IFn$_invoke$arity$1(scope);
if(cljs.core.truth_((function (){var and__5160__auto__ = event_type;
if(cljs.core.truth_(and__5160__auto__)){
return trigger_id;
} else {
return and__5160__auto__;
}
})())){
return (""+"event: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(event_type)+" trigger: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id));
} else {
if(cljs.core.truth_(trigger_id)){
return (""+"trigger: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id));
} else {
if(cljs.core.truth_(event_type)){
return (""+"event: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(event_type));
} else {
return session_id;

}
}
}
});
knoxx.backend.infra.routes.memory.mongo_session_summary = (function knoxx$backend$infra$routes$memory$mongo_session_summary(session_id,rows){
var latest = cljs.core.first(rows);
var scope = knoxx.backend.infra.core_memory.session_summary_scope_from_rows(rows);
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"project","project",1124394579).cljs$core$IFn$_invoke$arity$1(latest),new cljs.core.Keyword(null,"last_ts","last_ts",1415613512),new cljs.core.Keyword(null,"ts","ts",1617209904).cljs$core$IFn$_invoke$arity$1(latest),new cljs.core.Keyword(null,"event_count","event_count",-1889732422),cljs.core.count(rows),new cljs.core.Keyword(null,"title","title",636505583),knoxx.backend.infra.routes.memory.session_summary_title(session_id,scope)], null),scope], 0));
});
knoxx.backend.infra.routes.memory.fetch_contract_session_pages_from_mongo_BANG_ = (async function knoxx$backend$infra$routes$memory$fetch_contract_session_pages_from_mongo_BANG_(config,contract_id,needed_count){
var target = (await (async function (){var G__29632 = contract_id;
var G__29632__$1 = (((G__29632 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29632)));
var G__29632__$2 = (((G__29632__$1 == null))?null:clojure.string.trim(G__29632__$1));
if((G__29632__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29632__$2);
}
})());
var query_limit = (500);
if(cljs.core.truth_(target)){
var body = (await knoxx.backend.infra.clients.openplanner.mongo_query_BANG_((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"openplanner-client","openplanner-client",-1926799348).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
}
})()),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"collection","collection",-683361892),"events",new cljs.core.Keyword(null,"filter","filter",-948537934),new cljs.core.PersistentArrayMap(null, 3, ["project",new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),"session",new cljs.core.PersistentArrayMap(null, 2, ["$type","string","$ne",""], null),"extra.contract_id",target], null),new cljs.core.Keyword(null,"projection","projection",-412523042),new cljs.core.PersistentArrayMap(null, 5, ["_id",(0),"project",(1),"session",(1),"ts",(1),"extra",(1)], null),new cljs.core.Keyword(null,"sort","sort",953465918),new cljs.core.PersistentArrayMap(null, 1, ["ts",(-1)], null),new cljs.core.Keyword(null,"limit","limit",-1355822363),query_limit], null)));
var rows = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var map__29635 = knoxx.backend.infra.routes.memory.grouped_session_rows(rows);
var map__29635__$1 = cljs.core.__destructure_map(map__29635);
var groups = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29635__$1,new cljs.core.Keyword(null,"groups","groups",-136896102));
var order = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29635__$1,new cljs.core.Keyword(null,"order","order",-1254677256));
var summaries = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__29630_SHARP_){
return knoxx.backend.infra.routes.memory.mongo_session_summary(p1__29630_SHARP_,cljs.core.get.cljs$core$IFn$_invoke$arity$2(groups,p1__29630_SHARP_));
}),order);
var wanted_count = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(await (async function (){var or__5162__auto__ = needed_count;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})()));
var selected = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(wanted_count,summaries));
var total_events = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"total","total",1916810418).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var fetched_events = cljs.core.count(rows);
var more_events_QMARK_ = (total_events > fetched_events);
var more_sessions_QMARK_ = (cljs.core.count(summaries) > wanted_count);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"rows","rows",850049680),selected,new cljs.core.Keyword(null,"has_more","has_more",1574898779),((more_sessions_QMARK_) || (more_events_QMARK_))], null);
} else {
return null;
}
});
knoxx.backend.infra.routes.memory.fetch_authorized_session_pages_BANG_ = (async function knoxx$backend$infra$routes$memory$fetch_authorized_session_pages_BANG_(config,ctx,actor_id,exclude_actor_ids,contract_id,authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,upstream_page_size,upstream_offset,acc,needed_count){
var body = (await knoxx.backend.infra.clients.openplanner.sessions_BANG_((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"openplanner-client","openplanner-client",-1926799348).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
}
})()),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"limit","limit",-1355822363),upstream_page_size,new cljs.core.Keyword(null,"offset","offset",296498311),upstream_offset], null)));
var page_rows = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var fetched_count = cljs.core.count(page_rows);
var next_offset = (upstream_offset + fetched_count);
var upstream_has_more = cljs.core.boolean$(new cljs.core.Keyword(null,"has_more","has_more",1574898779).cljs$core$IFn$_invoke$arity$1(body));
var allowed = (await (await (async function (){var G__29641 = config;
var G__29642 = ctx;
var G__29643 = cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session","session",1008279103),page_rows);
return (authorized_session_ids_BANG_.cljs$core$IFn$_invoke$arity$3 ? authorized_session_ids_BANG_.cljs$core$IFn$_invoke$arity$3(G__29641,G__29642,G__29643) : authorized_session_ids_BANG_.call(null,G__29641,G__29642,G__29643));
})()));
var authorized_rows = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29638_SHARP_){
return knoxx.backend.infra.routes.memory.interactive_session_id_QMARK_(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(p1__29638_SHARP_));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29637_SHARP_){
return cljs.core.contains_QMARK_(allowed,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(p1__29637_SHARP_))));
}),page_rows)));
var actor_visible_rows = (await knoxx.backend.infra.routes.memory.filter_page_actor_rows_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,contract_id,authorized_rows));
var next_acc = cljs.core.into.cljs$core$IFn$_invoke$arity$2(acc,actor_visible_rows);
var reached_target_QMARK_ = ((typeof needed_count === 'number') && ((cljs.core.count(next_acc) >= needed_count)));
if(reached_target_QMARK_){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"rows","rows",850049680),cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(needed_count,next_acc)),new cljs.core.Keyword(null,"has_more","has_more",1574898779),true], null);
} else {
if(((upstream_has_more) && ((fetched_count > (0))))){
return (await (knoxx.backend.infra.routes.memory.fetch_authorized_session_pages_BANG_.cljs$core$IFn$_invoke$arity$12 ? knoxx.backend.infra.routes.memory.fetch_authorized_session_pages_BANG_.cljs$core$IFn$_invoke$arity$12(config,ctx,actor_id,exclude_actor_ids,contract_id,authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,upstream_page_size,next_offset,next_acc,needed_count) : knoxx.backend.infra.routes.memory.fetch_authorized_session_pages_BANG_.call(null,config,ctx,actor_id,exclude_actor_ids,contract_id,authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,upstream_page_size,next_offset,next_acc,needed_count)));
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"rows","rows",850049680),next_acc,new cljs.core.Keyword(null,"has_more","has_more",1574898779),false], null);

}
}
});
knoxx.backend.infra.routes.memory.hit_session_id = (function knoxx$backend$infra$routes$memory$hit_session_id(hit){
var or__5162__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(hit,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword(null,"session","session",1008279103)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(hit,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"session","session",1008279103)], null));
}
}
});
knoxx.backend.infra.routes.memory.search_hit_session_visibility_BANG_ = (async function knoxx$backend$infra$routes$memory$search_hit_session_visibility_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,session_id){
try{var rows = (await knoxx.backend.infra.routes.memory.fetch_session_filter_rows_BANG_(fetch_openplanner_session_rows_BANG_,config,session_id));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"visible","visible",-1024216805),(session_matches_page_actor_filter_QMARK_.cljs$core$IFn$_invoke$arity$4 ? session_matches_page_actor_filter_QMARK_.cljs$core$IFn$_invoke$arity$4(config,rows,actor_id,exclude_actor_ids) : session_matches_page_actor_filter_QMARK_.call(null,config,rows,actor_id,exclude_actor_ids))], null);
}catch (e29648){var _ = e29648;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"visible","visible",-1024216805),false], null);
}});
knoxx.backend.infra.routes.memory.filter_search_hits_by_actor_BANG_ = (async function knoxx$backend$infra$routes$memory$filter_search_hits_by_actor_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,hits){
var actor_id__$1 = knoxx.backend.shape.memory_sessions.normalized_actor_id(actor_id);
var exclude_actor_ids__$1 = knoxx.backend.shape.memory_sessions.normalized_actor_ids(exclude_actor_ids);
var hits__$1 = cljs.core.vec(hits);
if(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = actor_id__$1;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))) && (cljs.core.empty_QMARK_(exclude_actor_ids__$1)))){
return hits__$1;
} else {
var visibility_BANG_ = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.memory.search_hit_session_visibility_BANG_,config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([actor_id__$1,exclude_actor_ids__$1], 0));
var session_ids = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.memory.hit_session_id,hits__$1)))));
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(visibility_BANG_,session_ids))));
var allowed_sessions = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.str,new cljs.core.Keyword(null,"session","session",1008279103)),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"visible","visible",-1024216805),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))));
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (hit){
return cljs.core.contains_QMARK_(allowed_sessions,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.infra.routes.memory.hit_session_id(hit);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
}),hits__$1));
}
});
knoxx.backend.infra.routes.memory.run_warm_title_cache_BANG_ = (async function knoxx$backend$infra$routes$memory$run_warm_title_cache_BANG_(session_id,config,runtime){
try{var title_rows = (await knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_(config,session_id));
var seed_text = knoxx.backend.infra.stores.session_titles.session_title_seed_text(title_rows);
var fallback_title = knoxx.backend.infra.stores.session_titles.heuristic_session_title(seed_text);
try{var entry = (await knoxx.backend.infra.stores.session_titles.resolve_session_title_BANG_(config,seed_text));
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,(await (async function (){var or__5162__auto__ = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),fallback_title);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return fallback_title;
}
})()),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry));
}catch (e29657){var _ = e29657;
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,fallback_title,null);
}}catch (e29654){var _ = e29654;
return knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id,"Untitled session",null);
}});
knoxx.backend.infra.routes.memory.warm_title_cache_BANG_ = (function knoxx$backend$infra$routes$memory$warm_title_cache_BANG_(session_id,config,runtime){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if((((!(clojure.string.blank_QMARK_(session_id__$1)))) && ((((!(cljs.core.contains_QMARK_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_),session_id__$1)))) && ((!(cljs.core.contains_QMARK_(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_),session_id__$1)))))))){
var title_promise = knoxx.backend.infra.routes.memory.run_warm_title_cache_BANG_(session_id__$1,config,runtime);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_titles.session_title_promises_STAR_,cljs.core.assoc,session_id__$1,title_promise);

return title_promise;
} else {
return null;
}
});
knoxx.backend.infra.routes.memory.inactive_row = (function knoxx$backend$infra$routes$memory$inactive_row(row){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(row,new cljs.core.Keyword(null,"is_active","is_active",-750859351),false,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"active_status","active_status",1372457012),"inactive",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false], 0));
});
knoxx.backend.infra.routes.memory.agent_spec_value = (function knoxx$backend$infra$routes$memory$agent_spec_value(agent_spec,keys){
return cljs.core.some((function (k){
var G__29664 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(agent_spec,k);
var G__29664__$1 = (((G__29664 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29664)));
var G__29664__$2 = (((G__29664__$1 == null))?null:clojure.string.trim(G__29664__$1));
if((G__29664__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29664__$2);
}
}),keys);
});
knoxx.backend.infra.routes.memory.active_session_actor_claims = (function knoxx$backend$infra$routes$memory$active_session_actor_claims(session){
var agent_spec = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
var contract_actors = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"contractActors","contractActors",47284059).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"contract_actors","contract_actors",-1493360705).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
}
})();
return knoxx.backend.domain.actor.scope.normalize_actor_claims(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(session);
}
}
})(),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null))], null),((cljs.core.set_QMARK_(contract_actors))?contract_actors:((cljs.core.sequential_QMARK_(contract_actors))?contract_actors:(cljs.core.truth_(contract_actors)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [contract_actors], null):cljs.core.PersistentVector.EMPTY
)))));
});
knoxx.backend.infra.routes.memory.active_session_matches_actor_filter_QMARK_ = (function knoxx$backend$infra$routes$memory$active_session_matches_actor_filter_QMARK_(session,actor_id,exclude_actor_ids){
var include_actor_id = (function (){var G__29667 = actor_id;
var G__29667__$1 = (((G__29667 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29667)));
var G__29667__$2 = (((G__29667__$1 == null))?null:clojure.string.trim(G__29667__$1));
if((G__29667__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29667__$2);
}
})();
var exclude_actor_ids__$1 = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__29665_SHARP_){
var G__29668 = p1__29665_SHARP_;
var G__29668__$1 = (((G__29668 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29668)));
var G__29668__$2 = (((G__29668__$1 == null))?null:clojure.string.trim(G__29668__$1));
if((G__29668__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29668__$2);
}
}),(function (){var or__5162__auto__ = exclude_actor_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
var actors = knoxx.backend.infra.routes.memory.active_session_actor_claims(session);
var and__5160__auto__ = (function (){var or__5162__auto__ = clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = include_actor_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(actors,include_actor_id);
}
})();
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_any_QMARK_((function (p1__29666_SHARP_){
return knoxx.backend.domain.actor.scope.actor_allowed_QMARK_(actors,p1__29666_SHARP_);
}),exclude_actor_ids__$1);
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.routes.memory.actor_claim_includes_QMARK_ = (function knoxx$backend$infra$routes$memory$actor_claim_includes_QMARK_(actors,actor_id){
var wanted = knoxx.backend.domain.actor.scope.normalize_actor_claim(actor_id);
var and__5160__auto__ = wanted;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(knoxx.backend.domain.actor.scope.normalize_actor_claims(actors),wanted);
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.routes.memory.active_session_matches_contract_QMARK_ = (function knoxx$backend$infra$routes$memory$active_session_matches_contract_QMARK_(session,contract_id){
var target = (function (){var G__29669 = contract_id;
var G__29669__$1 = (((G__29669 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29669)));
var G__29669__$2 = (((G__29669__$1 == null))?null:clojure.string.trim(G__29669__$1));
if((G__29669__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29669__$2);
}
})();
var agent_spec = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
var or__5162__auto__ = (target == null);
if(or__5162__auto__){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null)));
if(or__5162__auto____$1){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792)], null)));
if(or__5162__auto____$2){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200)], null)));
if(or__5162__auto____$3){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(target,knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null)));
if(or__5162__auto____$4){
return or__5162__auto____$4;
} else {
return knoxx.backend.infra.routes.memory.actor_claim_includes_QMARK_(knoxx.backend.infra.routes.memory.active_session_actor_claims(session),target);
}
}
}
}
}
});
knoxx.backend.infra.routes.memory.active_session_actor_id = (function knoxx$backend$infra$routes$memory$active_session_actor_id(session,agent_spec){
var or__5162__auto__ = knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__29672 = (function (){var or__5162__auto____$1 = new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(session);
}
}
})();
var G__29672__$1 = (((G__29672 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29672)));
var G__29672__$2 = (((G__29672__$1 == null))?null:clojure.string.trim(G__29672__$1));
if((G__29672__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29672__$2);
}
}
});
knoxx.backend.infra.routes.memory.active_session_event_types = (function knoxx$backend$infra$routes$memory$active_session_event_types(agent_spec){
var values = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"event_types","event_types",-752038707).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"event-types","event-types",-81363635).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"eventTypes","eventTypes",-1966249997).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
}
})();
if(cljs.core.sequential_QMARK_(values)){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,values))));
} else {
return null;
}
});
knoxx.backend.infra.routes.memory.active_session_synthetic_scope = (function knoxx$backend$infra$routes$memory$active_session_synthetic_scope(session,agent_spec){
var actor_id = knoxx.backend.infra.routes.memory.active_session_actor_id(session,agent_spec);
var event_types = knoxx.backend.infra.routes.memory.active_session_event_types(agent_spec);
var G__29674 = cljs.core.PersistentArrayMap.EMPTY;
var G__29674__$1 = (cljs.core.truth_(actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id):G__29674);
var G__29674__$2 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$1,new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199)], null))):G__29674__$1);
var G__29674__$3 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$2,new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub_agent_id","sub_agent_id",320149773),new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.Keyword(null,"subAgentId","subAgentId",538139792)], null))):G__29674__$2);
var G__29674__$4 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$3,new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_agent_id","parent_agent_id",-252488900),new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.Keyword(null,"parentAgentId","parentAgentId",1686278200)], null))):G__29674__$3);
var G__29674__$5 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$4,new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent_run_id","parent_run_id",-2071531014),new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),new cljs.core.Keyword(null,"parentRunId","parentRunId",938716271)], null))):G__29674__$4);
var G__29674__$6 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$5,new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"spawn_kind","spawn_kind",1611229473),new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),new cljs.core.Keyword(null,"spawnKind","spawnKind",1648184297)], null))):G__29674__$5);
var G__29674__$7 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"triggerId","triggerId",-684068188)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$6,new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger_id","trigger_id",-1547322554),new cljs.core.Keyword(null,"trigger-id","trigger-id",-599381518),new cljs.core.Keyword(null,"triggerId","triggerId",-684068188)], null))):G__29674__$6);
var G__29674__$8 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_type","event_type",1569866042),new cljs.core.Keyword(null,"event-type","event-type",319722813),new cljs.core.Keyword(null,"eventType","eventType",-1525570624)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$7,new cljs.core.Keyword(null,"event_type","event_type",1569866042),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_type","event_type",1569866042),new cljs.core.Keyword(null,"event-type","event-type",319722813),new cljs.core.Keyword(null,"eventType","eventType",-1525570624)], null))):G__29674__$7);
var G__29674__$9 = ((cljs.core.seq(event_types))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$8,new cljs.core.Keyword(null,"event_types","event_types",-752038707),event_types):G__29674__$8);
var G__29674__$10 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_id","event_id",-767275570),new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"eventId","eventId",378389360)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$9,new cljs.core.Keyword(null,"event_id","event_id",-767275570),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_id","event_id",-767275570),new cljs.core.Keyword(null,"event-id","event-id",2130210178),new cljs.core.Keyword(null,"eventId","eventId",378389360)], null))):G__29674__$9);
var G__29674__$11 = (cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873)], null)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$10,new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event_scope_id","event_scope_id",17168787),new cljs.core.Keyword(null,"event-scope-id","event-scope-id",-2139340009),new cljs.core.Keyword(null,"eventScopeId","eventScopeId",1980523873)], null))):G__29674__$10);
if(cljs.core.truth_(knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193),new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790)], null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29674__$11,new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),knoxx.backend.infra.routes.memory.agent_spec_value(agent_spec,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schedule_id","schedule_id",-339917949),new cljs.core.Keyword(null,"schedule-id","schedule-id",1107183193),new cljs.core.Keyword(null,"scheduleId","scheduleId",-959542790)], null)));
} else {
return G__29674__$11;
}
});
knoxx.backend.infra.routes.memory.active_session_synthetic_row = (function knoxx$backend$infra$routes$memory$active_session_synthetic_row(session){
var agent_spec = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"is_active","is_active",-750859351),true,new cljs.core.Keyword(null,"active_status","active_status",1372457012),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),cljs.core.boolean$(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session)),new cljs.core.Keyword(null,"title","title",636505583),(""+"Running \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
}
})())),new cljs.core.Keyword(null,"event_count","event_count",-1889732422),(0),new cljs.core.Keyword(null,"last_ts","last_ts",1415613512),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session)], null),knoxx.backend.infra.routes.memory.active_session_synthetic_scope(session,agent_spec)], 0));
});
knoxx.backend.infra.routes.memory.enrich_row = (async function knoxx$backend$infra$routes$memory$enrich_row(row){
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(row)));
var titled_row = (await (async function (){var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_),session_id);
if(cljs.core.truth_(temp__5823__auto__)){
var title_entry = temp__5823__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(row,new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(title_entry),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"title_model","title_model",501758950),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(title_entry)], 0));
} else {
return row;
}
})());
try{var active_session_id = (await knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$1(session_id));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(active_session_id)))){
return knoxx.backend.infra.routes.memory.inactive_row(titled_row);
} else {
try{var active_session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(active_session_id));
var status = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(active_session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "inactive";
}
})());
var is_active = cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["waiting_input",null,"running",null], null), null),status);
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(titled_row,new cljs.core.Keyword(null,"active_session_id","active_session_id",1867780677),active_session_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"is_active","is_active",-750859351),is_active,new cljs.core.Keyword(null,"active_status","active_status",1372457012),status,new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),cljs.core.boolean$(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(active_session))], 0));
}catch (e29680){var _ = e29680;
return knoxx.backend.infra.routes.memory.inactive_row(titled_row);
}}
}catch (e29679){var _ = e29679;
return knoxx.backend.infra.routes.memory.inactive_row(titled_row);
}});
knoxx.backend.infra.routes.memory.memory_sessions_request_options = (function knoxx$backend$infra$routes$memory$memory_sessions_request_options(config,ctx,request){
var map__29682 = knoxx.backend.shape.memory_sessions.query_options((request["query"]));
var map__29682__$1 = cljs.core.__destructure_map(map__29682);
var opts = map__29682__$1;
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29682__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29682__$1,new cljs.core.Keyword(null,"offset","offset",296498311));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29682__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29682__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29682__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(opts,new cljs.core.Keyword(null,"cache-key","cache-key",-565448732),knoxx.backend.infra.routes.memory.memory_sessions_cache_key(new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"ctx","ctx",-493610118),ctx,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit,new cljs.core.Keyword(null,"offset","offset",296498311),offset,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733),exclude_actor_ids,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),contract_id], null)));
});
knoxx.backend.infra.routes.memory.contract_only_admin_fetch_QMARK_ = (function knoxx$backend$infra$routes$memory$contract_only_admin_fetch_QMARK_(ctx,p__29684){
var map__29686 = p__29684;
var map__29686__$1 = cljs.core.__destructure_map(map__29686);
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29686__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29686__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29686__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
var and__5160__auto__ = contract_id;
if(cljs.core.truth_(and__5160__auto__)){
return ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = actor_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))) && (((cljs.core.empty_QMARK_(exclude_actor_ids)) && (knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)))));
} else {
return and__5160__auto__;
}
});
knoxx.backend.infra.routes.memory.fetch_memory_sessions_source_BANG_ = (function knoxx$backend$infra$routes$memory$fetch_memory_sessions_source_BANG_(config,ctx,opts,authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_){
return knoxx.backend.infra.routes.memory.cached_memory_sessions_source_BANG_(new cljs.core.Keyword(null,"cache-key","cache-key",-565448732).cljs$core$IFn$_invoke$arity$1(opts),(function (){
if(cljs.core.truth_(knoxx.backend.infra.routes.memory.contract_only_admin_fetch_QMARK_(ctx,opts))){
return knoxx.backend.infra.routes.memory.fetch_contract_session_pages_from_mongo_BANG_(config,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"needed-count","needed-count",-1582276084).cljs$core$IFn$_invoke$arity$1(opts));
} else {
return knoxx.backend.infra.routes.memory.fetch_authorized_session_pages_BANG_(config,ctx,new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733).cljs$core$IFn$_invoke$arity$1(opts),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(opts),authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,new cljs.core.Keyword(null,"upstream-page-size","upstream-page-size",-19639857).cljs$core$IFn$_invoke$arity$1(opts),(0),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"needed-count","needed-count",-1582276084).cljs$core$IFn$_invoke$arity$1(opts));
}
}));
});
knoxx.backend.infra.routes.memory.warm_memory_session_title_rows_BANG_ = (function knoxx$backend$infra$routes$memory$warm_memory_session_title_rows_BANG_(rows,config,runtime){
var seq__29691 = cljs.core.seq(rows);
var chunk__29692 = null;
var count__29693 = (0);
var i__29694 = (0);
while(true){
if((i__29694 < count__29693)){
var row = chunk__29692.cljs$core$IIndexed$_nth$arity$2(null,i__29694);
knoxx.backend.infra.routes.memory.warm_title_cache_BANG_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(row))),config,runtime);


var G__30223 = seq__29691;
var G__30224 = chunk__29692;
var G__30225 = count__29693;
var G__30226 = (i__29694 + (1));
seq__29691 = G__30223;
chunk__29692 = G__30224;
count__29693 = G__30225;
i__29694 = G__30226;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__29691);
if(temp__5825__auto__){
var seq__29691__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__29691__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__29691__$1);
var G__30230 = cljs.core.chunk_rest(seq__29691__$1);
var G__30231 = c__5694__auto__;
var G__30232 = cljs.core.count(c__5694__auto__);
var G__30233 = (0);
seq__29691 = G__30230;
chunk__29692 = G__30231;
count__29693 = G__30232;
i__29694 = G__30233;
continue;
} else {
var row = cljs.core.first(seq__29691__$1);
knoxx.backend.infra.routes.memory.warm_title_cache_BANG_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(row))),config,runtime);


var G__30237 = cljs.core.next(seq__29691__$1);
var G__30238 = null;
var G__30239 = (0);
var G__30240 = (0);
seq__29691 = G__30237;
chunk__29692 = G__30238;
count__29693 = G__30239;
i__29694 = G__30240;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.routes.memory.send_enriched_memory_sessions_BANG_ = (function knoxx$backend$infra$routes$memory$send_enriched_memory_sessions_BANG_(p__29697,page_state,enriched_rows){
var map__29698 = p__29697;
var map__29698__$1 = cljs.core.__destructure_map(map__29698);
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29698__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29698__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var G__29699_30244 = reply;
var G__29700_30245 = (200);
var G__29701_30246 = knoxx.backend.shape.memory_sessions.response_payload(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(page_state,new cljs.core.Keyword(null,"rows","rows",850049680),cljs.core.vec(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(enriched_rows,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))));
(json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29699_30244,G__29700_30245,G__29701_30246) : json_response_BANG_.call(null,G__29699_30244,G__29700_30245,G__29701_30246));

return null;
});
knoxx.backend.infra.routes.memory.send_memory_session_rows_BANG_ = (async function knoxx$backend$infra$routes$memory$send_memory_session_rows_BANG_(p__29711,page_state,rows){
var map__29712 = p__29711;
var map__29712__$1 = cljs.core.__destructure_map(map__29712);
var env = map__29712__$1;
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29712__$1,new cljs.core.Keyword(null,"config","config",994861415));
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29712__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29712__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29712__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
knoxx.backend.infra.routes.memory.warm_memory_session_title_rows_BANG_(rows,config,runtime);

try{var enriched_rows = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.memory.enrich_row,rows))));
return knoxx.backend.infra.routes.memory.send_enriched_memory_sessions_BANG_(env,page_state,enriched_rows);
}catch (e29713){var err = e29713;
(error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));

return null;
}});
knoxx.backend.infra.routes.memory.synthetic_active_session_rows = (function knoxx$backend$infra$routes$memory$synthetic_active_session_rows(live,page_rows,actor_id,exclude_actor_ids,contract_id){
var op_ids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__29714_SHARP_){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(p1__29714_SHARP_)));
}),page_rows));
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.memory.active_session_synthetic_row,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29715_SHARP_){
var and__5160__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(p1__29715_SHARP_);
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = cljs.core.not((function (){var G__29726 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(p1__29715_SHARP_)));
return (op_ids.cljs$core$IFn$_invoke$arity$1 ? op_ids.cljs$core$IFn$_invoke$arity$1(G__29726) : op_ids.call(null,G__29726));
})());
if(and__5160__auto____$1){
var and__5160__auto____$2 = cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["waiting_input",null,"running",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__29715_SHARP_));
if(and__5160__auto____$2){
var and__5160__auto____$3 = knoxx.backend.infra.routes.memory.active_session_matches_actor_filter_QMARK_(p1__29715_SHARP_,actor_id,exclude_actor_ids);
if(cljs.core.truth_(and__5160__auto____$3)){
return knoxx.backend.infra.routes.memory.active_session_matches_contract_QMARK_(p1__29715_SHARP_,contract_id);
} else {
return and__5160__auto____$3;
}
} else {
return and__5160__auto____$2;
}
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
}),live)));
});
knoxx.backend.infra.routes.memory.send_memory_sessions_live_ids_BANG_ = (async function knoxx$backend$infra$routes$memory$send_memory_sessions_live_ids_BANG_(p__29733,p__29734,live_ids){
var map__29737 = p__29733;
var map__29737__$1 = cljs.core.__destructure_map(map__29737);
var env = map__29737__$1;
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29737__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29737__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var map__29738 = p__29734;
var map__29738__$1 = cljs.core.__destructure_map(map__29738);
var page_state = map__29738__$1;
var page_rows = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29738__$1,new cljs.core.Keyword(null,"page-rows","page-rows",-1632298366));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29738__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29738__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var contract_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29738__$1,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
try{var live_js = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__29731_SHARP_){
return knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(p1__29731_SHARP_);
}),cljs.core.vec(live_ids)))));
var live = cljs.core.vec(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(live_js,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
var synthetic = knoxx.backend.infra.routes.memory.synthetic_active_session_rows(live,page_rows,actor_id,exclude_actor_ids,contract_id);
return (await knoxx.backend.infra.routes.memory.send_memory_session_rows_BANG_(env,page_state,cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(synthetic,page_rows))));
}catch (e29740){var err = e29740;
(error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));

return null;
}});
knoxx.backend.infra.routes.memory.send_memory_sessions_result_BANG_ = (async function knoxx$backend$infra$routes$memory$send_memory_sessions_result_BANG_(env,p__29750){
var map__29751 = p__29750;
var map__29751__$1 = cljs.core.__destructure_map(map__29751);
var page_state = map__29751__$1;
var page_rows = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29751__$1,new cljs.core.Keyword(null,"page-rows","page-rows",-1632298366));
try{var live_ids = (await knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$0());
if(cljs.core.seq(live_ids)){
return (await knoxx.backend.infra.routes.memory.send_memory_sessions_live_ids_BANG_(env,page_state,live_ids));
} else {
return (await knoxx.backend.infra.routes.memory.send_memory_session_rows_BANG_(env,page_state,page_rows));
}
}catch (e29752){var _ = e29752;
return (await knoxx.backend.infra.routes.memory.send_memory_session_rows_BANG_(env,page_state,page_rows));
}});
knoxx.backend.infra.routes.memory.memory_sessions_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_sessions_route_BANG_(app,runtime,config,deps){
var map__29755 = deps;
var map__29755__$1 = cljs.core.__destructure_map(map__29755);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_matches_page_actor_filter_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"session-matches-page-actor-filter?","session-matches-page-actor-filter?",2088135972));
var authorized_session_ids_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"authorized-session-ids!","authorized-session-ids!",999199653));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var fetch_openplanner_session_rows_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"fetch-openplanner-session-rows!","fetch-openplanner-session-rows!",1014940648));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29755__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29757 = app;
var G__29758 = "GET";
var G__29759 = "/api/memory/sessions";
var G__29760 = (function (request,reply){
var G__29761 = runtime;
var G__29762 = request;
var G__29763 = reply;
var G__29764 = (async function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29765 = reply;
var G__29766 = (503);
var G__29767 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29765,G__29766,G__29767) : json_response_BANG_.call(null,G__29765,G__29766,G__29767));
} else {
try{var opts = knoxx.backend.infra.routes.memory.memory_sessions_request_options(config,ctx,request);
var env = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime,new cljs.core.Keyword(null,"reply","reply",1144328671),reply,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),error_response_BANG_], null);
var map__29769 = (await knoxx.backend.infra.routes.memory.fetch_memory_sessions_source_BANG_(config,ctx,opts,authorized_session_ids_BANG_,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_));
var map__29769__$1 = cljs.core.__destructure_map(map__29769);
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29769__$1,new cljs.core.Keyword(null,"value","value",305978217));
var cache = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29769__$1,new cljs.core.Keyword(null,"cache","cache",-1237023054));
return (await knoxx.backend.infra.routes.memory.send_memory_sessions_result_BANG_(env,knoxx.backend.shape.memory_sessions.page_state(value,opts,cache)));
}catch (e29768){var err = e29768;
(error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));

return null;
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29761,G__29762,G__29763,G__29764) : with_request_context_BANG_.call(null,G__29761,G__29762,G__29763,G__29764));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29757,G__29758,G__29759,G__29760) : route_BANG_.call(null,G__29757,G__29758,G__29759,G__29760));
});
knoxx.backend.infra.routes.memory.memory_session_titles_status_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_session_titles_status_route_BANG_(app,runtime,config,deps){
var map__29783 = deps;
var map__29783__$1 = cljs.core.__destructure_map(map__29783);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29783__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29792 = app;
var G__29793 = "GET";
var G__29794 = "/api/memory/session-titles/status";
var G__29795 = (function (request,reply){
var G__29799 = runtime;
var G__29800 = request;
var G__29801 = reply;
var G__29802 = (function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29804 = reply;
var G__29805 = (503);
var G__29806 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29804,G__29805,G__29806) : json_response_BANG_.call(null,G__29804,G__29805,G__29806));
} else {
var G__29808 = reply;
var G__29809 = (200);
var G__29810 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"status","status",-1997798413),cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_),new cljs.core.Keyword(null,"cached_count","cached_count",246241445),cljs.core.count(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29808,G__29809,G__29810) : json_response_BANG_.call(null,G__29808,G__29809,G__29810));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29799,G__29800,G__29801,G__29802) : with_request_context_BANG_.call(null,G__29799,G__29800,G__29801,G__29802));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29792,G__29793,G__29794,G__29795) : route_BANG_.call(null,G__29792,G__29793,G__29794,G__29795));
});
knoxx.backend.infra.routes.memory.memory_backfill_titles_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_backfill_titles_route_BANG_(app,runtime,config,deps){
var map__29812 = deps;
var map__29812__$1 = cljs.core.__destructure_map(map__29812);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var fetch_openplanner_session_rows_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"fetch-openplanner-session-rows!","fetch-openplanner-session-rows!",1014940648));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29812__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29825 = app;
var G__29826 = "POST";
var G__29827 = "/api/memory/sessions/backfill-titles";
var G__29828 = (function (request,reply){
var G__29829 = runtime;
var G__29830 = request;
var G__29831 = reply;
var G__29832 = (async function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29833 = reply;
var G__29834 = (503);
var G__29835 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29833,G__29834,G__29835) : json_response_BANG_.call(null,G__29833,G__29834,G__29835));
} else {
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var limit = (await (async function (){var or__5162__auto__ = knoxx.backend.shape.parse.parse_positive_int((body["limit"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.shape.parse.parse_positive_int((request["query"]["limit"]));
}
})());
var force_QMARK_ = ((knoxx.backend.shape.parse.truthy_param_QMARK_((body["force"]))) || (knoxx.backend.shape.parse.truthy_param_QMARK_((request["query"]["force"]))));
var status = (await knoxx.backend.infra.stores.session_titles.start_session_title_backfill_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"force","force",781957286),force_QMARK_,new cljs.core.Keyword(null,"limit","limit",-1355822363),limit], null),fetch_openplanner_session_rows_BANG_));
var G__29846 = reply;
var G__29847 = (202);
var G__29848 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"cached_count","cached_count",246241445),cljs.core.count(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29846,G__29847,G__29848) : json_response_BANG_.call(null,G__29846,G__29847,G__29848));
}catch (e29836){var err = e29836;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29829,G__29830,G__29831,G__29832) : with_request_context_BANG_.call(null,G__29829,G__29830,G__29831,G__29832));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29825,G__29826,G__29827,G__29828) : route_BANG_.call(null,G__29825,G__29826,G__29827,G__29828));
});
knoxx.backend.infra.routes.memory.memory_import_titles_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_import_titles_route_BANG_(app,runtime,config,deps){
var map__29857 = deps;
var map__29857__$1 = cljs.core.__destructure_map(map__29857);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29857__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29860 = app;
var G__29861 = "POST";
var G__29862 = "/api/memory/sessions/import-titles";
var G__29863 = (function (request,reply){
var G__29864 = runtime;
var G__29865 = request;
var G__29866 = reply;
var G__29867 = (function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29868 = reply;
var G__29869 = (503);
var G__29870 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29868,G__29869,G__29870) : json_response_BANG_.call(null,G__29868,G__29869,G__29870));
} else {
var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var titles = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(body,"titles");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var updated = cljs.core.reduce_kv((function (total,session_id,entry){
var session_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id));
var raw_title = ((cljs.core.map_QMARK_(entry))?(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,"title");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,new cljs.core.Keyword(null,"title","title",636505583));
}
})():entry);
var title_model = ((cljs.core.map_QMARK_(entry))?(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,"title_model");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,"title-model");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,"model");
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"title-model","title-model",-531930396).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(entry);
}
}
}
}
}
})():null);
var normalized = knoxx.backend.infra.stores.session_titles.normalize_session_title.cljs$core$IFn$_invoke$arity$1(raw_title);
if(((clojure.string.blank_QMARK_(session_id__$1)) || ((normalized == null)))){
return total;
} else {
knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_(runtime,config,session_id__$1,normalized,(function (){var or__5162__auto__ = title_model;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "retro:heuristic";
}
})());

return (total + (1));
}
}),(0),titles);
var G__29892 = reply;
var G__29893 = (200);
var G__29894 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"updated","updated",-1627192056),updated,new cljs.core.Keyword(null,"cached_count","cached_count",246241445),cljs.core.count(cljs.core.deref(knoxx.backend.infra.stores.session_titles.session_titles_STAR_))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29892,G__29893,G__29894) : json_response_BANG_.call(null,G__29892,G__29893,G__29894));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29864,G__29865,G__29866,G__29867) : with_request_context_BANG_.call(null,G__29864,G__29865,G__29866,G__29867));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29860,G__29861,G__29862,G__29863) : route_BANG_.call(null,G__29860,G__29861,G__29862,G__29863));
});
knoxx.backend.infra.routes.memory.memory_session_by_id_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_session_by_id_route_BANG_(app,runtime,config,deps){
var map__29896 = deps;
var map__29896__$1 = cljs.core.__destructure_map(map__29896);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var fetch_openplanner_session_rows_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"fetch-openplanner-session-rows!","fetch-openplanner-session-rows!",1014940648));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29896__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29897 = app;
var G__29898 = "GET";
var G__29899 = "/api/memory/sessions/:sessionId";
var G__29900 = (function (request,reply){
var G__29901 = runtime;
var G__29902 = request;
var G__29903 = reply;
var G__29904 = (async function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29905 = reply;
var G__29906 = (503);
var G__29907 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29905,G__29906,G__29907) : json_response_BANG_.call(null,G__29905,G__29906,G__29907));
} else {
try{var session_id = (await (async function (){var or__5162__auto__ = (request["params"]["sessionId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var requested_limit = knoxx.backend.shape.parse.parse_positive_int((request["query"]["limit"]));
var preview_limit = (cljs.core.truth_(requested_limit)?new cljs.core.Keyword(null,"limit","limit",-1355822363).cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.graph.expansion_policy.bounded_preview_params(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0(),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),requested_limit], null))):null);
if(clojure.string.blank_QMARK_(session_id)){
var G__29909 = reply;
var G__29910 = (400);
var G__29911 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"sessionId is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29909,G__29910,G__29911) : json_response_BANG_.call(null,G__29909,G__29910,G__29911));
} else {
var rows = (await (fetch_openplanner_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2 ? fetch_openplanner_session_rows_BANG_.cljs$core$IFn$_invoke$arity$2(config,session_id) : fetch_openplanner_session_rows_BANG_.call(null,config,session_id)));
if(knoxx.backend.infra.core_memory.session_visible_QMARK_(ctx,rows)){
var G__29914 = reply;
var G__29915 = (200);
var G__29916 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"session","session",1008279103),session_id,new cljs.core.Keyword(null,"rows","rows",850049680),(cljs.core.truth_(preview_limit)?cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(preview_limit,rows)):rows)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29914,G__29915,G__29916) : json_response_BANG_.call(null,G__29914,G__29915,G__29916));
} else {
var G__29918 = reply;
var G__29919 = knoxx.backend.infra.http.http_error((403),"memory_scope_denied","Session is outside the current Knoxx scope");
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(G__29918,G__29919) : error_response_BANG_.call(null,G__29918,G__29919));
}
}
}catch (e29908){var err = e29908;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29901,G__29902,G__29903,G__29904) : with_request_context_BANG_.call(null,G__29901,G__29902,G__29903,G__29904));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29897,G__29898,G__29899,G__29900) : route_BANG_.call(null,G__29897,G__29898,G__29899,G__29900));
});
knoxx.backend.infra.routes.memory.require_memory_read_BANG_ = (function knoxx$backend$infra$routes$memory$require_memory_read_BANG_(ctx){
return knoxx.backend.infra.auth.authz.ensure_permission_BANG_(ctx,"agent.memory.read");
});
knoxx.backend.infra.routes.memory.send_memory_search_BANG_ = (async function knoxx$backend$infra$routes$memory$send_memory_search_BANG_(p__29922,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,p__29923){
var map__29925 = p__29922;
var map__29925__$1 = cljs.core.__destructure_map(map__29925);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29925__$1,new cljs.core.Keyword(null,"config","config",994861415));
var ctx = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29925__$1,new cljs.core.Keyword(null,"ctx","ctx",-493610118));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29925__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29925__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var map__29928 = p__29923;
var map__29928__$1 = cljs.core.__destructure_map(map__29928);
var query = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29928__$1,new cljs.core.Keyword(null,"query","query",-1288509510));
var bounded_k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29928__$1,new cljs.core.Keyword(null,"bounded-k","bounded-k",1722637485));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29928__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29928__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var exclude_actor_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29928__$1,new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733));
var result = (await knoxx.backend.infra.openplanner.memory.openplanner_memory_search_BANG_(config,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"k","k",-2146297393),bounded_k,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id], null)));
var hits = (await knoxx.backend.infra.core_memory.filter_authorized_memory_hits_BANG_(config,ctx,new cljs.core.Keyword(null,"hits","hits",-2120002930).cljs$core$IFn$_invoke$arity$1(result)));
var filtered_hits = (await knoxx.backend.infra.routes.memory.filter_search_hits_by_actor_BANG_(config,fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,actor_id,exclude_actor_ids,hits));
var G__29935 = reply;
var G__29936 = (200);
var G__29937 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"hits","hits",-2120002930),filtered_hits], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29935,G__29936,G__29937) : json_response_BANG_.call(null,G__29935,G__29936,G__29937));
});
knoxx.backend.infra.routes.memory.memory_search_request_options = (function knoxx$backend$infra$routes$memory$memory_search_request_options(request){
var body = (function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var map__29939 = knoxx.backend.domain.graph.expansion_policy.bounded_search_params(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0(),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"k","k",-2146297393),(body["k"])], null));
var map__29939__$1 = cljs.core.__destructure_map(map__29939);
var bounded_k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29939__$1,new cljs.core.Keyword(null,"k","k",-2146297393));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"query","query",-1288509510),(function (){var or__5162__auto__ = (body["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"bounded-k","bounded-k",1722637485),bounded_k,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),(function (){var or__5162__auto__ = (body["sessionId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["session_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),knoxx.backend.shape.memory_sessions.normalized_actor_id((function (){var or__5162__auto__ = (body["actorId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["actor_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (body["actor"]);
}
}
})()),new cljs.core.Keyword(null,"exclude-actor-ids","exclude-actor-ids",-293827733),knoxx.backend.shape.memory_sessions.normalized_actor_ids((function (){var or__5162__auto__ = (body["excludeActorIds"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["exclude_actor_ids"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (body["excludeActorId"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return (body["exclude_actor_id"]);
}
}
}
})())], null);
});
knoxx.backend.infra.routes.memory.ensure_memory_search_scope_BANG_ = (function knoxx$backend$infra$routes$memory$ensure_memory_search_scope_BANG_(ctx,session_id){
knoxx.backend.infra.routes.memory.require_memory_read_BANG_(ctx);

if(((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))) && ((((!(knoxx.backend.infra.auth.authz.ctx_permitted_QMARK_(ctx,"agent.memory.cross_session")))) && ((!(knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)))))))){
throw knoxx.backend.infra.http.http_error((403),"memory_scope_denied","Cross-session memory search is outside the current Knoxx scope");
} else {
return null;
}
});
knoxx.backend.infra.routes.memory.memory_search_route_BANG_ = (function knoxx$backend$infra$routes$memory$memory_search_route_BANG_(app,runtime,config,deps){
var map__29969 = deps;
var map__29969__$1 = cljs.core.__destructure_map(map__29969);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_matches_page_actor_filter_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"session-matches-page-actor-filter?","session-matches-page-actor-filter?",2088135972));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var fetch_openplanner_session_rows_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"fetch-openplanner-session-rows!","fetch-openplanner-session-rows!",1014940648));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29969__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29976 = app;
var G__29977 = "POST";
var G__29978 = "/api/memory/search";
var G__29979 = (function (request,reply){
var G__29981 = runtime;
var G__29982 = request;
var G__29983 = reply;
var G__29984 = (async function (ctx){
if(cljs.core.not(knoxx.backend.infra.routes.memory.openplanner_ready_QMARK_(config))){
var G__29985 = reply;
var G__29986 = (503);
var G__29987 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29985,G__29986,G__29987) : json_response_BANG_.call(null,G__29985,G__29986,G__29987));
} else {
try{var map__29990 = knoxx.backend.infra.routes.memory.memory_search_request_options(request);
var map__29990__$1 = cljs.core.__destructure_map(map__29990);
var opts = map__29990__$1;
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29990__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
knoxx.backend.infra.routes.memory.ensure_memory_search_scope_BANG_(ctx,session_id);

return (await knoxx.backend.infra.routes.memory.send_memory_search_BANG_(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"ctx","ctx",-493610118),ctx,new cljs.core.Keyword(null,"reply","reply",1144328671),reply,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_], null),fetch_openplanner_session_rows_BANG_,session_matches_page_actor_filter_QMARK_,opts));
}catch (e29988){var err = e29988;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29981,G__29982,G__29983,G__29984) : with_request_context_BANG_.call(null,G__29981,G__29982,G__29983,G__29984));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29976,G__29977,G__29978,G__29979) : route_BANG_.call(null,G__29976,G__29977,G__29978,G__29979));
});
knoxx.backend.infra.routes.memory.lounge_messages_list_route_BANG_ = (function knoxx$backend$infra$routes$memory$lounge_messages_list_route_BANG_(app,runtime,config,deps){
var map__29996 = deps;
var map__29996__$1 = cljs.core.__destructure_map(map__29996);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var lounge_messages_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"lounge-messages*","lounge-messages*",-1382832656));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29996__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30000 = app;
var G__30001 = "GET";
var G__30002 = "/api/lounge/messages";
var G__30003 = (function (request,reply){
var G__30008 = runtime;
var G__30009 = request;
var G__30010 = reply;
var G__30011 = (function (ctx){
var G__30012 = reply;
var G__30013 = (200);
var G__30014 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"messages","messages",345434482),cljs.core.deref(lounge_messages_STAR_)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30012,G__30013,G__30014) : json_response_BANG_.call(null,G__30012,G__30013,G__30014));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30008,G__30009,G__30010,G__30011) : with_request_context_BANG_.call(null,G__30008,G__30009,G__30010,G__30011));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30000,G__30001,G__30002,G__30003) : route_BANG_.call(null,G__30000,G__30001,G__30002,G__30003));
});
knoxx.backend.infra.routes.memory.lounge_messages_create_route_BANG_ = (function knoxx$backend$infra$routes$memory$lounge_messages_create_route_BANG_(app,runtime,config,deps){
var map__30021 = deps;
var map__30021__$1 = cljs.core.__destructure_map(map__30021);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var lounge_messages_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"lounge-messages*","lounge-messages*",-1382832656));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30021__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30024 = app;
var G__30025 = "POST";
var G__30026 = "/api/lounge/messages";
var G__30027 = (function (request,reply){
var G__30030 = runtime;
var G__30031 = request;
var G__30032 = reply;
var G__30033 = (function (ctx){
var body = (function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["session_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var alias = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["alias"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "anonymous";
}
})())));
var text = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["text"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(session_id)){
var G__30045 = reply;
var G__30046 = (400);
var G__30047 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"session_id is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30045,G__30046,G__30047) : json_response_BANG_.call(null,G__30045,G__30046,G__30047));
} else {
if(clojure.string.blank_QMARK_(text)){
var G__30049 = reply;
var G__30050 = (400);
var G__30051 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"text is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30049,G__30050,G__30051) : json_response_BANG_.call(null,G__30049,G__30050,G__30051));
} else {
var msg = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_crypto.randomUUID())),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"alias","alias",-2039751630),((clojure.string.blank_QMARK_(alias))?"anonymous":alias),new cljs.core.Keyword(null,"text","text",-1790561697),text], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(lounge_messages_STAR_,(function (p1__30018_SHARP_){
return cljs.core.vec(cljs.core.take_last((100),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(p1__30018_SHARP_),msg)));
}));

knoxx.backend.domain.realtime.broadcast_ws_BANG_("lounge",msg);

var G__30053 = reply;
var G__30054 = (200);
var G__30055 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"message","message",-406056002),msg], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30053,G__30054,G__30055) : json_response_BANG_.call(null,G__30053,G__30054,G__30055));

}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30030,G__30031,G__30032,G__30033) : with_request_context_BANG_.call(null,G__30030,G__30031,G__30032,G__30033));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30024,G__30025,G__30026,G__30027) : route_BANG_.call(null,G__30024,G__30025,G__30026,G__30027));
});
knoxx.backend.infra.routes.memory.register_memory_routes_BANG_ = (function knoxx$backend$infra$routes$memory$register_memory_routes_BANG_(app,runtime,config,deps){
console.log("memory-sessions-route! =",knoxx.backend.infra.routes.memory.memory_sessions_route_BANG_.name);

knoxx.backend.infra.routes.memory.memory_sessions_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.memory_session_titles_status_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.memory_backfill_titles_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.memory_import_titles_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.memory_session_by_id_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.memory_search_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.memory.lounge_messages_list_route_BANG_(app,runtime,config,deps);

return knoxx.backend.infra.routes.memory.lounge_messages_create_route_BANG_(app,runtime,config,deps);
});

//# sourceMappingURL=knoxx.backend.infra.routes.memory.js.map
