import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.redis_client.js";
goog.provide('knoxx.backend.infra.stores.session_store');
knoxx.backend.infra.stores.session_store.SESSION_TTL_SECONDS = (3600);
knoxx.backend.infra.stores.session_store.SESSION_KEY_PREFIX = "knoxx:session:";
knoxx.backend.infra.stores.session_store.CONVERSATION_SESSION_KEY = "knoxx:conversation_to_session:";
knoxx.backend.infra.stores.session_store.ACTIVE_SESSIONS_SET = "knoxx:active_sessions";
knoxx.backend.infra.stores.session_store.session_key = (function knoxx$backend$infra$stores$session_store$session_key(session_id){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.session_store.SESSION_KEY_PREFIX)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id));
});
knoxx.backend.infra.stores.session_store.conversation_session_key = (function knoxx$backend$infra$stores$session_store$conversation_session_key(conversation_id){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.session_store.CONVERSATION_SESSION_KEY)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(conversation_id));
});
knoxx.backend.infra.stores.session_store.resolved = (function knoxx$backend$infra$stores$session_store$resolved(value){
return Promise.resolve(value);
});
knoxx.backend.infra.stores.session_store.now_iso = (function knoxx$backend$infra$stores$session_store$now_iso(){
return (new Date()).toISOString();
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.session_store !== 'undefined') && (typeof knoxx.backend.infra.stores.session_store.session_cache_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.session_store.session_cache_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.stores.session_store.max_session_cache_size = (1000);
knoxx.backend.infra.stores.session_store.sticky_session_ttl_ms = ((((24) * (60)) * (60)) * (1000));
knoxx.backend.infra.stores.session_store.sticky_session_ttl_seconds = Math.floor((knoxx.backend.infra.stores.session_store.sticky_session_ttl_ms / (1000)));
knoxx.backend.infra.stores.session_store.session_cache_sweep_interval_ms = (300000);
/**
 * Remove the oldest entry when the cache exceeds max size.
 */
knoxx.backend.infra.stores.session_store.evict_oldest_session_cache_entry_BANG_ = (function knoxx$backend$infra$stores$session_store$evict_oldest_session_cache_entry_BANG_(){
if((cljs.core.count(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_)) > knoxx.backend.infra.stores.session_store.max_session_cache_size)){
var oldest = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.min_key,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),cljs.core.val),cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_));
if(cljs.core.truth_(oldest)){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.dissoc,cljs.core.key(oldest));
} else {
return null;
}
} else {
return null;
}
});
/**
 * Periodically evict stale sticky sessions from the cache.
 */
knoxx.backend.infra.stores.session_store.start_session_cache_sweep_BANG_ = (function knoxx$backend$infra$stores$session_store$start_session_cache_sweep_BANG_(){
return setInterval((function (){
var cutoff = (Date.now() - knoxx.backend.infra.stores.session_store.sticky_session_ttl_ms);
var stale = (function (){var iter__5649__auto__ = (function knoxx$backend$infra$stores$session_store$start_session_cache_sweep_BANG__$_iter__33220(s__33221){
return (new cljs.core.LazySeq(null,(function (){
var s__33221__$1 = s__33221;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__33221__$1);
if(temp__5825__auto__){
var s__33221__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__33221__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__33221__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__33223 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__33222 = (0);
while(true){
if((i__33222 < size__5648__auto__)){
var vec__33228 = cljs.core._nth(c__5647__auto__,i__33222);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33228,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33228,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
cljs.core.chunk_append(b__33223,id);

var G__33482 = (i__33222 + (1));
i__33222 = G__33482;
continue;
} else {
var G__33483 = (i__33222 + (1));
i__33222 = G__33483;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__33223),knoxx$backend$infra$stores$session_store$start_session_cache_sweep_BANG__$_iter__33220(cljs.core.chunk_rest(s__33221__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__33223),null);
}
} else {
var vec__33238 = cljs.core.first(s__33221__$2);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33238,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33238,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
return cljs.core.cons(id,knoxx$backend$infra$stores$session_store$start_session_cache_sweep_BANG__$_iter__33220(cljs.core.rest(s__33221__$2)));
} else {
var G__33484 = cljs.core.rest(s__33221__$2);
s__33221__$1 = G__33484;
continue;
}
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_));
})();
if(cljs.core.seq(stale)){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.session_store.session_cache_STAR_,(function (p1__33213_SHARP_){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc,p1__33213_SHARP_,stale);
}));
} else {
return null;
}
}),knoxx.backend.infra.stores.session_store.session_cache_sweep_interval_ms);
});
knoxx.backend.infra.stores.session_store.start_session_cache_sweep_BANG_();
/**
 * Get session state, checking cache first then Redis.
 * Always resolves a promise for call-site consistency.
 */
knoxx.backend.infra.stores.session_store.get_session = (async function knoxx$backend$infra$stores$session_store$get_session(redis_client,session_id){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_),session_id);
if(cljs.core.truth_(temp__5823__auto__)){
var cached = temp__5823__auto__;
return cached;
} else {
if(cljs.core.truth_(redis_client)){
var session = (await knoxx.backend.infra.redis_client.get_json(redis_client,knoxx.backend.infra.stores.session_store.session_key(session_id)));
if(cljs.core.truth_(session)){
knoxx.backend.infra.stores.session_store.evict_oldest_session_cache_entry_BANG_();

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.assoc,session_id,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(session,new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),Date.now()));
} else {
}

return session;
} else {
return null;
}
}
});
/**
 * Synchronous session lookup from cache only. Use get-session for full lookup.
 */
knoxx.backend.infra.stores.session_store.get_session_sync = (function knoxx$backend$infra$stores$session_store$get_session_sync(session_id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_),session_id);
});
/**
 * Get the active session ID for a conversation.
 */
knoxx.backend.infra.stores.session_store.get_conversation_active_session = (async function knoxx$backend$infra$stores$session_store$get_conversation_active_session(redis_client,conversation_id){
if(cljs.core.truth_(redis_client)){
return (await knoxx.backend.infra.redis_client.get_key(redis_client,knoxx.backend.infra.stores.session_store.conversation_session_key(conversation_id)));
} else {
return null;
}
});
knoxx.backend.infra.stores.session_store.session_ttl_seconds = (function knoxx$backend$infra$stores$session_store$session_ttl_seconds(session_id){
if(clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"-sticky")){
return knoxx.backend.infra.stores.session_store.sticky_session_ttl_seconds;
} else {
return knoxx.backend.infra.stores.session_store.SESSION_TTL_SECONDS;
}
});
knoxx.backend.infra.stores.session_store.normalize_session_ids = (function knoxx$backend$infra$stores$session_store$normalize_session_ids(session){
var session_id = (function (){var G__33279 = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
if((G__33279 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33279));
}
})();
var conversation_id = (function (){var G__33286 = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if((G__33286 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__33286));
}
})();
var normalized_session = (function (){var G__33299 = session;
var G__33299__$1 = (cljs.core.truth_(session_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33299,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id):G__33299);
if(cljs.core.truth_(conversation_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33299__$1,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id);
} else {
return G__33299__$1;
}
})();
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session","session",1008279103),normalized_session], null);
});
knoxx.backend.infra.stores.session_store.cache_session_BANG_ = (function knoxx$backend$infra$stores$session_store$cache_session_BANG_(session_id,session){
knoxx.backend.infra.stores.session_store.evict_oldest_session_cache_entry_BANG_();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.assoc,session_id,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(session,new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),Date.now()));
});
knoxx.backend.infra.stores.session_store.persist_session_BANG_ = (async function knoxx$backend$infra$stores$session_store$persist_session_BANG_(redis_client,session_id,conversation_id,session,ttl_seconds){
try{(await knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$4(redis_client,knoxx.backend.infra.stores.session_store.session_key(session_id),session,ttl_seconds));

if(cljs.core.truth_(conversation_id)){
(await knoxx.backend.infra.redis_client.set_key.cljs$core$IFn$_invoke$arity$4(redis_client,knoxx.backend.infra.stores.session_store.conversation_session_key(conversation_id),session_id,ttl_seconds));
} else {
}

if(cljs.core.truth_(session_id)){
return (await knoxx.backend.infra.redis_client.sadd(redis_client,knoxx.backend.infra.stores.session_store.ACTIVE_SESSIONS_SET,session_id));
} else {
return console.error("[session-store] put-session! reached sadd with nil session-id; session keys:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.keys(session)], 0)));
}
}catch (e33324){var err = e33324;
return console.error("Failed to persist session to Redis:",err);
}});
/**
 * Store session state in cache and Redis.
 * Always resolves a promise with the stored session.
 */
knoxx.backend.infra.stores.session_store.put_session_BANG_ = (async function knoxx$backend$infra$stores$session_store$put_session_BANG_(redis_client,session){
var map__33360 = knoxx.backend.infra.stores.session_store.normalize_session_ids(session);
var map__33360__$1 = cljs.core.__destructure_map(map__33360);
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33360__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33360__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33360__$1,new cljs.core.Keyword(null,"session","session",1008279103));
var ttl_seconds = knoxx.backend.infra.stores.session_store.session_ttl_seconds(session_id);
knoxx.backend.infra.stores.session_store.cache_session_BANG_(session_id,session__$1);

if(cljs.core.truth_(redis_client)){
(await knoxx.backend.infra.stores.session_store.persist_session_BANG_(redis_client,session_id,conversation_id,session__$1,ttl_seconds));
} else {
}

return session__$1;
});
/**
 * Update session state, merging with existing. Always resolves the updated session.
 */
knoxx.backend.infra.stores.session_store.update_session_BANG_ = (async function knoxx$backend$infra$stores$session_store$update_session_BANG_(redis_client,session_id,updates){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))){
console.error("[session-store] update-session! called with nil/blank session-id; updates:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([updates], 0)));

return null;
} else {
var raw = (await (async function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_),session_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var current = (cljs.core.truth_(cljs.core.array_QMARK_(raw))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(raw,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):raw);
var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([current,updates,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),Date.now()], null)], 0));
return (await knoxx.backend.infra.stores.session_store.put_session_BANG_(redis_client,updated));
}
});
/**
 * Remove the last N user turns plus everything that followed them.
 * Preserves any leading system messages that predate the removed turn(s).
 */
knoxx.backend.infra.stores.session_store.rewind_messages = (function knoxx$backend$infra$stores$session_store$rewind_messages(messages,turns){
var remaining = cljs.core.vec((function (){var or__5162__auto__ = messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var turns_left = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(function (){var or__5162__auto__ = turns;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})());
while(true){
if((((turns_left === (0))) || (cljs.core.empty_QMARK_(remaining)))){
return remaining;
} else {
var temp__5823__auto__ = cljs.core.last(cljs.core.keep_indexed.cljs$core$IFn$_invoke$arity$2(((function (remaining,turns_left){
return (function (index,message){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(message))){
return index;
} else {
return null;
}
});})(remaining,turns_left))
,remaining));
if(cljs.core.truth_(temp__5823__auto__)){
var last_user_index = temp__5823__auto__;
var G__33500 = cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(remaining,(0),last_user_index);
var G__33501 = (turns_left - (1));
remaining = G__33500;
turns_left = G__33501;
continue;
} else {
return remaining;
}
}
break;
}
});
/**
 * Rewind the session by removing the last N user turns.
 * Resolves nil when no session exists, or the updated session when successful.
 */
knoxx.backend.infra.stores.session_store.undo_session_turns_BANG_ = (async function knoxx$backend$infra$stores$session_store$undo_session_turns_BANG_(redis_client,session_id,turns){
var temp__5825__auto__ = (await knoxx.backend.infra.stores.session_store.get_session(redis_client,session_id));
if(cljs.core.truth_(temp__5825__auto__)){
var session = temp__5825__auto__;
var current_messages = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var rewound_messages = knoxx.backend.infra.stores.session_store.rewind_messages(current_messages,turns);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(rewound_messages,current_messages)){
return session;
} else {
return (await knoxx.backend.infra.stores.session_store.put_session_BANG_(redis_client,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(session,new cljs.core.Keyword(null,"messages","messages",345434482),rewound_messages,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"status","status",-1997798413),"waiting_input",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.infra.stores.session_store.now_iso(),new cljs.core.Keyword(null,"answer","answer",-742633163),null,new cljs.core.Keyword(null,"error","error",-978969032),null], 0))));
}
} else {
return null;
}
});
/**
 * Remove session from cache and Redis.
 */
knoxx.backend.infra.stores.session_store.remove_session_BANG_ = (async function knoxx$backend$infra$stores$session_store$remove_session_BANG_(redis_client,session_id,conversation_id){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.dissoc,session_id);

if(cljs.core.truth_(redis_client)){
try{(await knoxx.backend.infra.redis_client.del(redis_client,knoxx.backend.infra.stores.session_store.session_key(session_id)));

if(cljs.core.truth_(conversation_id)){
(await knoxx.backend.infra.redis_client.del(redis_client,knoxx.backend.infra.stores.session_store.conversation_session_key(conversation_id)));
} else {
}

(await knoxx.backend.infra.redis_client.srem(redis_client,knoxx.backend.infra.stores.session_store.ACTIVE_SESSIONS_SET,session_id));

return true;
}catch (e33397){var err = e33397;
console.error("Failed to remove session from Redis:",err);

return false;
}} else {
return true;
}
});
/**
 * List all active session IDs from Redis.
 */
knoxx.backend.infra.stores.session_store.list_active_sessions = (async function knoxx$backend$infra$stores$session_store$list_active_sessions(redis_client){
if(cljs.core.truth_(redis_client)){
return (await knoxx.backend.infra.redis_client.smembers(redis_client,knoxx.backend.infra.stores.session_store.ACTIVE_SESSIONS_SET));
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.stores.session_store.recovered_session_summary = (function knoxx$backend$infra$stores$session_store$recovered_session_summary(ids,sessions){
var pairs = cljs.core.map.cljs$core$IFn$_invoke$arity$3(cljs.core.vector,ids,sessions);
var stale_ids = cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.first,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__33401){
var vec__33402 = p__33401;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33402,(0),null);
var session = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33402,(1),null);
return (session == null);
}),pairs)));
var cacheable = cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p__33415){
var vec__33416 = p__33415;
var session_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33416,(0),null);
var session = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33416,(1),null);
if(cljs.core.truth_((function (){var and__5160__auto__ = session;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))) || (clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"-sticky")));
} else {
return and__5160__auto__;
}
})())){
return session;
} else {
return null;
}
}),pairs));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"stale-ids","stale-ids",-155987793),stale_ids,new cljs.core.Keyword(null,"cacheable","cacheable",-243907229),cacheable,new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__33400_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__33400_SHARP_));
}),cacheable))], null);
});
knoxx.backend.infra.stores.session_store.remove_stale_session_ids_BANG_ = (async function knoxx$backend$infra$stores$session_store$remove_stale_session_ids_BANG_(redis_client,stale_ids){
if(cljs.core.seq(stale_ids)){
return (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__33427_SHARP_){
return knoxx.backend.infra.redis_client.srem(redis_client,knoxx.backend.infra.stores.session_store.ACTIVE_SESSIONS_SET,p1__33427_SHARP_);
}),stale_ids))));
} else {
return null;
}
});
knoxx.backend.infra.stores.session_store.cache_recovered_sessions_BANG_ = (function knoxx$backend$infra$stores$session_store$cache_recovered_sessions_BANG_(sessions){
var seq__33433 = cljs.core.seq(sessions);
var chunk__33434 = null;
var count__33435 = (0);
var i__33436 = (0);
while(true){
if((i__33436 < count__33435)){
var session = chunk__33434.cljs$core$IIndexed$_nth$arity$2(null,i__33436);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),session);


var G__33504 = seq__33433;
var G__33505 = chunk__33434;
var G__33506 = count__33435;
var G__33507 = (i__33436 + (1));
seq__33433 = G__33504;
chunk__33434 = G__33505;
count__33435 = G__33506;
i__33436 = G__33507;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__33433);
if(temp__5825__auto__){
var seq__33433__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__33433__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__33433__$1);
var G__33508 = cljs.core.chunk_rest(seq__33433__$1);
var G__33509 = c__5694__auto__;
var G__33510 = cljs.core.count(c__5694__auto__);
var G__33511 = (0);
seq__33433 = G__33508;
chunk__33434 = G__33509;
count__33435 = G__33510;
i__33436 = G__33511;
continue;
} else {
var session = cljs.core.first(seq__33433__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),session);


var G__33512 = cljs.core.next(seq__33433__$1);
var G__33513 = null;
var G__33514 = (0);
var G__33515 = (0);
seq__33433 = G__33512;
chunk__33434 = G__33513;
count__33435 = G__33514;
i__33436 = G__33515;
continue;
}
} else {
return null;
}
}
break;
}
});
/**
 * Recover sessions from Redis on startup. Returns the session records that were still running.
 */
knoxx.backend.infra.stores.session_store.recover_sessions_BANG_ = (async function knoxx$backend$infra$stores$session_store$recover_sessions_BANG_(redis_client){
if(cljs.core.not(redis_client)){
return cljs.core.PersistentVector.EMPTY;
} else {
var ids = cljs.core.vec((await knoxx.backend.infra.stores.session_store.list_active_sessions(redis_client)));
if(cljs.core.not(cljs.core.seq(ids))){
return cljs.core.PersistentVector.EMPTY;
} else {
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__33443_SHARP_){
return knoxx.backend.infra.stores.session_store.get_session(redis_client,p1__33443_SHARP_);
}),ids))));
var sessions = cljs.core.vec(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
var map__33444 = knoxx.backend.infra.stores.session_store.recovered_session_summary(ids,sessions);
var map__33444__$1 = cljs.core.__destructure_map(map__33444);
var stale_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33444__$1,new cljs.core.Keyword(null,"stale-ids","stale-ids",-155987793));
var cacheable = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33444__$1,new cljs.core.Keyword(null,"cacheable","cacheable",-243907229));
var running = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33444__$1,new cljs.core.Keyword(null,"running","running",1554969103));
(await knoxx.backend.infra.stores.session_store.remove_stale_session_ids_BANG_(redis_client,stale_ids));

knoxx.backend.infra.stores.session_store.cache_recovered_sessions_BANG_(cacheable);

return running;
}
}
});
/**
 * Mark session as actively streaming.
 */
knoxx.backend.infra.stores.session_store.mark_session_streaming_BANG_ = (function knoxx$backend$infra$stores$session_store$mark_session_streaming_BANG_(redis_client,session_id,is_streaming){
return knoxx.backend.infra.stores.session_store.update_session_BANG_(redis_client,session_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),is_streaming], null));
});
/**
 * Mark session as completed and remove from active set.
 * Optionally archive to OpenPlanner for long-term memory.
 */
knoxx.backend.infra.stores.session_store.complete_session_BANG_ = (async function knoxx$backend$infra$stores$session_store$complete_session_BANG_(redis_client,session_id,_conversation_id,opts){
var map__33450 = opts;
var map__33450__$1 = cljs.core.__destructure_map(map__33450);
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33450__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33450__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33450__$1,new cljs.core.Keyword(null,"error","error",-978969032));
var messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33450__$1,new cljs.core.Keyword(null,"messages","messages",345434482));
var session = (await knoxx.backend.infra.stores.session_store.update_session_BANG_(redis_client,session_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),(await (async function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "completed";
}
})()),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"answer","answer",-742633163),answer,new cljs.core.Keyword(null,"error","error",-978969032),error,new cljs.core.Keyword(null,"messages","messages",345434482),messages], null)));
setTimeout((function (){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.session_store.session_cache_STAR_,cljs.core.dissoc,session_id);
}),((clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"-sticky"))?knoxx.backend.infra.stores.session_store.sticky_session_ttl_ms:(60000)));

return session;
});
/**
 * Check if session can accept new messages.
 * Returns {:can-send true|false :reason <string-or-nil>}.
 */
knoxx.backend.infra.stores.session_store.session_can_send_QMARK_ = (function knoxx$backend$infra$stores$session_store$session_can_send_QMARK_(session){
if((session == null)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"No existing session. Ready for new conversation."], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),(cljs.core.truth_(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session))?"Session is actively streaming. Use steer or wait.":"Session is already processing. Use steer, follow-up, abort, or wait.")], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("waiting_input",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),null], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("completed",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"Previous session completed. Starting new turn."], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("failed",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"Previous session failed. Starting new turn."], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"can-send","can-send",-704220819),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),null], null);

}
}
}
}
}
});
knoxx.backend.infra.stores.session_store.active_session_snapshots = (function knoxx$backend$infra$stores$session_store$active_session_snapshots(){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),(function (p1__33459_SHARP_,p2__33458_SHARP_){
return cljs.core.compare(p2__33458_SHARP_,p1__33459_SHARP_);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__33457_SHARP_){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__33457_SHARP_));
}),cljs.core.vals(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_)))));
});
knoxx.backend.infra.stores.session_store.debug_dump_cache = (function knoxx$backend$infra$stores$session_store$debug_dump_cache(){
return console.log("Session cache:",cljs.core.clj__GT_js(cljs.core.deref(knoxx.backend.infra.stores.session_store.session_cache_STAR_)));
});

//# sourceMappingURL=knoxx.backend.infra.stores.session_store.js.map
