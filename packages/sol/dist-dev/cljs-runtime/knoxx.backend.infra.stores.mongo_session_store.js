import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_session_store');
knoxx.backend.infra.stores.mongo_session_store.SESSION_TTL_SECONDS = (3600);
knoxx.backend.infra.stores.mongo_session_store.STICKY_SESSION_TTL_SECONDS = (((24) * (60)) * (60));
knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME = "knoxx_threads";
knoxx.backend.infra.stores.mongo_session_store.ACTIVE_STATUS = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null);
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_session_store !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.stores.mongo_session_store.max_session_cache_size = (1000);
knoxx.backend.infra.stores.mongo_session_store.sticky_session_ttl_ms = ((((24) * (60)) * (60)) * (1000));
knoxx.backend.infra.stores.mongo_session_store.session_cache_sweep_interval_ms = (300000);
/**
 * Remove the oldest entry when the cache exceeds max size.
 */
knoxx.backend.infra.stores.mongo_session_store.evict_oldest_session_cache_entry_BANG_ = (function knoxx$backend$infra$stores$mongo_session_store$evict_oldest_session_cache_entry_BANG_(){
if((cljs.core.count(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_)) > knoxx.backend.infra.stores.mongo_session_store.max_session_cache_size)){
var oldest = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.min_key,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),cljs.core.val),cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_));
if(cljs.core.truth_(oldest)){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.dissoc,cljs.core.key(oldest));
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
knoxx.backend.infra.stores.mongo_session_store.start_session_cache_sweep_BANG_ = (function knoxx$backend$infra$stores$mongo_session_store$start_session_cache_sweep_BANG_(){
return setInterval((function (){
var cutoff = (Date.now() - knoxx.backend.infra.stores.mongo_session_store.sticky_session_ttl_ms);
var stale = (function (){var iter__5649__auto__ = (function knoxx$backend$infra$stores$mongo_session_store$start_session_cache_sweep_BANG__$_iter__26739(s__26740){
return (new cljs.core.LazySeq(null,(function (){
var s__26740__$1 = s__26740;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26740__$1);
if(temp__5825__auto__){
var s__26740__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26740__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26740__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26742 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26741 = (0);
while(true){
if((i__26741 < size__5648__auto__)){
var vec__26744 = cljs.core._nth(c__5647__auto__,i__26741);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26744,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26744,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
cljs.core.chunk_append(b__26742,id);

var G__27106 = (i__26741 + (1));
i__26741 = G__27106;
continue;
} else {
var G__27107 = (i__26741 + (1));
i__26741 = G__27107;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26742),knoxx$backend$infra$stores$mongo_session_store$start_session_cache_sweep_BANG__$_iter__26739(cljs.core.chunk_rest(s__26740__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26742),null);
}
} else {
var vec__26750 = cljs.core.first(s__26740__$2);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26750,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26750,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
return cljs.core.cons(id,knoxx$backend$infra$stores$mongo_session_store$start_session_cache_sweep_BANG__$_iter__26739(cljs.core.rest(s__26740__$2)));
} else {
var G__27110 = cljs.core.rest(s__26740__$2);
s__26740__$1 = G__27110;
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
return iter__5649__auto__(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_));
})();
if(cljs.core.seq(stale)){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,(function (p1__26734_SHARP_){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc,p1__26734_SHARP_,stale);
}));
} else {
return null;
}
}),knoxx.backend.infra.stores.mongo_session_store.session_cache_sweep_interval_ms);
});
knoxx.backend.infra.stores.mongo_session_store.start_session_cache_sweep_BANG_();
knoxx.backend.infra.stores.mongo_session_store.cache_session_BANG_ = (function knoxx$backend$infra$stores$mongo_session_store$cache_session_BANG_(session_id,session){
knoxx.backend.infra.stores.mongo_session_store.evict_oldest_session_cache_entry_BANG_();

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.assoc,session_id,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(session,new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),Date.now()));
});
knoxx.backend.infra.stores.mongo_session_store.session_ttl_seconds = (function knoxx$backend$infra$stores$mongo_session_store$session_ttl_seconds(session_id){
if(clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"-sticky")){
return knoxx.backend.infra.stores.mongo_session_store.STICKY_SESSION_TTL_SECONDS;
} else {
return knoxx.backend.infra.stores.mongo_session_store.SESSION_TTL_SECONDS;
}
});
knoxx.backend.infra.stores.mongo_session_store.find_session = (async function knoxx$backend$infra$stores$mongo_session_store$find_session(db,session_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
var result = (await coll.findOne(({"session_id": session_id})));
if(cljs.core.truth_(result)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_session_store.find_session_by_conversation = (async function knoxx$backend$infra$stores$mongo_session_store$find_session_by_conversation(db,conversation_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
var result = (await coll.findOne(({"conversation_id": conversation_id})));
if(cljs.core.truth_(result)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_session_store.upsert_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$upsert_session_BANG_(db,session){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
var ttl = knoxx.backend.infra.stores.mongo_session_store.session_ttl_seconds(new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session));
var now = (new Date());
var doc = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(session,new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (ttl * (1000))))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),now], 0)),new cljs.core.Keyword(null,"createdAt","createdAt",-936788));
return (await coll.findOneAndUpdate(({"session_id": new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session)}),({"$set": cljs.core.clj__GT_js(doc), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"createdAt","createdAt",-936788),now], null))}),({"upsert": true, "returnDocument": "after"})));
});
knoxx.backend.infra.stores.mongo_session_store.update_session_doc_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$update_session_doc_BANG_(db,session_id,updates){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
var ttl = knoxx.backend.infra.stores.mongo_session_store.session_ttl_seconds(session_id);
var set_doc = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([updates,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),(new Date()),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (ttl * (1000)))))], null)], 0));
return (await coll.findOneAndUpdate(({"session_id": session_id}),({"$set": cljs.core.clj__GT_js(set_doc)}),({"returnDocument": "after"})));
});
knoxx.backend.infra.stores.mongo_session_store.delete_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$delete_session_BANG_(db,session_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
(await coll.deleteOne(({"session_id": session_id})));

return true;
});
knoxx.backend.infra.stores.mongo_session_store.fetch_active_sessions = (async function knoxx$backend$infra$stores$mongo_session_store$fetch_active_sessions(db){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
var cursor = coll.find(({"status": ({"$in": cljs.core.clj__GT_js(cljs.core.vec(knoxx.backend.infra.stores.mongo_session_store.ACTIVE_STATUS))})}));
var results = (await cursor.toArray());
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
/**
 * Get session state, checking cache first then MongoDB.
 */
knoxx.backend.infra.stores.mongo_session_store.get_session = (async function knoxx$backend$infra$stores$mongo_session_store$get_session(var_args){
var G__26789 = arguments.length;
switch (G__26789) {
case 1:
return knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1 = (async function (session_id){
return knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),session_id);
}));

(knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$2 = (async function (db,session_id){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_),session_id);
if(cljs.core.truth_(temp__5823__auto__)){
var cached = temp__5823__auto__;
return cached;
} else {
if(cljs.core.truth_(db)){
var session = (await knoxx.backend.infra.stores.mongo_session_store.find_session(db,session_id));
if(cljs.core.truth_(session)){
knoxx.backend.infra.stores.mongo_session_store.evict_oldest_session_cache_entry_BANG_();

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.assoc,session_id,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(session,new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),Date.now()));
} else {
}

return session;
} else {
return null;
}
}
}));

(knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$lang$maxFixedArity = 2);

/**
 * Synchronous session lookup from cache only.
 */
knoxx.backend.infra.stores.mongo_session_store.get_session_sync = (function knoxx$backend$infra$stores$mongo_session_store$get_session_sync(session_id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_),session_id);
});
/**
 * Get the active session for a conversation.
 */
knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session = (async function knoxx$backend$infra$stores$mongo_session_store$get_conversation_active_session(var_args){
var G__26795 = arguments.length;
switch (G__26795) {
case 1:
return knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$1 = (async function (conversation_id){
return knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),conversation_id);
}));

(knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$2 = (async function (db,conversation_id){
if(cljs.core.truth_(db)){
var session = (await knoxx.backend.infra.stores.mongo_session_store.find_session_by_conversation(db,conversation_id));
return new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$lang$maxFixedArity = 2);

/**
 * Store session state in cache and MongoDB.
 * Stamps :system_instance_id so readers can detect documents orphaned by a
 * previous system instance (see knoxx.backend.infra.system-instance).
 */
knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$put_session_BANG_(var_args){
var G__26805 = arguments.length;
switch (G__26805) {
case 1:
return knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (session){
return knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),session);
}));

(knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,session){
var session__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(session,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id());
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session__$1)));
knoxx.backend.infra.stores.mongo_session_store.cache_session_BANG_(session_id,session__$1);

if(cljs.core.truth_(db)){
(await knoxx.backend.infra.stores.mongo_session_store.upsert_session_BANG_(db,session__$1));
} else {
}

return session__$1;
}));

(knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Update session state, merging with existing.
 */
knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$update_session_BANG_(var_args){
var G__26823 = arguments.length;
switch (G__26823) {
case 2:
return knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (session_id,updates){
return knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),session_id,updates);
}));

(knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,session_id,updates){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))){
console.error("[mongo-session-store] update-session! called with nil/blank session-id");

return null;
} else {
var raw = (await (async function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_),session_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var current = (cljs.core.truth_(cljs.core.array_QMARK_(raw))?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(raw,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)):raw);
var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([current,updates,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),Date.now()], null)], 0));
return (await knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$2(db,updated));
}
}));

(knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Remove session from cache and MongoDB.
 */
knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$remove_session_BANG_(var_args){
var G__26847 = arguments.length;
switch (G__26847) {
case 2:
return knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (session_id,conversation_id){
return knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),session_id,conversation_id);
}));

(knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,session_id,_conversation_id){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.dissoc,session_id);

if(cljs.core.truth_(db)){
try{(await knoxx.backend.infra.stores.mongo_session_store.delete_session_BANG_(db,session_id));

return true;
}catch (e26864){var err = e26864;
console.error("Failed to remove session from MongoDB:",err);

return false;
}} else {
return true;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.remove_session_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * List all active sessions from MongoDB.
 */
knoxx.backend.infra.stores.mongo_session_store.list_active_sessions = (async function knoxx$backend$infra$stores$mongo_session_store$list_active_sessions(var_args){
var G__26892 = arguments.length;
switch (G__26892) {
case 0:
return knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$1 = (async function (db){
if(cljs.core.truth_(db)){
return knoxx.backend.infra.stores.mongo_session_store.fetch_active_sessions(db);
} else {
return cljs.core.PersistentVector.EMPTY;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$lang$maxFixedArity = 1);

/**
 * List all active session IDs from MongoDB.
 */
knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids = (async function knoxx$backend$infra$stores$mongo_session_store$list_active_session_ids(var_args){
var G__26904 = arguments.length;
switch (G__26904) {
case 0:
return knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$core$IFn$_invoke$arity$1 = (async function (db){
if(cljs.core.truth_(db)){
var sessions = (await knoxx.backend.infra.stores.mongo_session_store.fetch_active_sessions(db));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session_id","session_id",1584799627),sessions);
} else {
return cljs.core.PersistentVector.EMPTY;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.list_active_session_ids.cljs$lang$maxFixedArity = 1);

/**
 * Recover active sessions from MongoDB on startup.
 */
knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$recover_sessions_BANG_(var_args){
var G__26918 = arguments.length;
switch (G__26918) {
case 0:
return knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (db){
if(cljs.core.not(db)){
return cljs.core.PersistentVector.EMPTY;
} else {
var sessions = (await knoxx.backend.infra.stores.mongo_session_store.fetch_active_sessions(db));
var running = cljs.core.filterv((function (p1__26913_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__26913_SHARP_));
}),sessions);
var seq__26975_27136 = cljs.core.seq(sessions);
var chunk__26976_27137 = null;
var count__26978_27138 = (0);
var i__26979_27139 = (0);
while(true){
if((i__26979_27139 < count__26978_27138)){
var session_27140 = chunk__26976_27137.cljs$core$IIndexed$_nth$arity$2(null,i__26979_27139);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session_27140),session_27140);


var G__27141 = seq__26975_27136;
var G__27142 = chunk__26976_27137;
var G__27143 = count__26978_27138;
var G__27144 = (i__26979_27139 + (1));
seq__26975_27136 = G__27141;
chunk__26976_27137 = G__27142;
count__26978_27138 = G__27143;
i__26979_27139 = G__27144;
continue;
} else {
var temp__5825__auto___27145 = cljs.core.seq(seq__26975_27136);
if(temp__5825__auto___27145){
var seq__26975_27146__$1 = temp__5825__auto___27145;
if(cljs.core.chunked_seq_QMARK_(seq__26975_27146__$1)){
var c__5694__auto___27147 = cljs.core.chunk_first(seq__26975_27146__$1);
var G__27148 = cljs.core.chunk_rest(seq__26975_27146__$1);
var G__27149 = c__5694__auto___27147;
var G__27150 = cljs.core.count(c__5694__auto___27147);
var G__27151 = (0);
seq__26975_27136 = G__27148;
chunk__26976_27137 = G__27149;
count__26978_27138 = G__27150;
i__26979_27139 = G__27151;
continue;
} else {
var session_27152 = cljs.core.first(seq__26975_27146__$1);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.assoc,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session_27152),session_27152);


var G__27153 = cljs.core.next(seq__26975_27146__$1);
var G__27154 = null;
var G__27155 = (0);
var G__27156 = (0);
seq__26975_27136 = G__27153;
chunk__26976_27137 = G__27154;
count__26978_27138 = G__27155;
i__26979_27139 = G__27156;
continue;
}
} else {
}
}
break;
}

return running;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.recover_sessions_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Mark session as actively streaming.
 */
knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_ = (function knoxx$backend$infra$stores$mongo_session_store$mark_session_streaming_BANG_(var_args){
var G__27016 = arguments.length;
switch (G__27016) {
case 2:
return knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (session_id,is_streaming){
return knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),session_id,is_streaming);
}));

(knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (db,session_id,is_streaming){
return knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$3(db,session_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),is_streaming], null));
}));

(knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Mark session as completed.
 */
knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$complete_session_BANG_(var_args){
var G__27030 = arguments.length;
switch (G__27030) {
case 3:
return knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (session_id,conversation_id,opts){
return knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.mongo_client.get_db(),session_id,conversation_id,opts);
}));

(knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,session_id,_conversation_id,opts){
var map__27032 = opts;
var map__27032__$1 = cljs.core.__destructure_map(map__27032);
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27032__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27032__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27032__$1,new cljs.core.Keyword(null,"error","error",-978969032));
var messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27032__$1,new cljs.core.Keyword(null,"messages","messages",345434482));
var session = (await knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$3(db,session_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"status","status",-1997798413),(await (async function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "completed";
}
})()),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"answer","answer",-742633163),answer,new cljs.core.Keyword(null,"error","error",-978969032),error,new cljs.core.Keyword(null,"messages","messages",345434482),messages], null)));
setTimeout((function (){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_,cljs.core.dissoc,session_id);
}),((clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),"-sticky"))?knoxx.backend.infra.stores.mongo_session_store.sticky_session_ttl_ms:(60000)));

return session;
}));

(knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Check if session can accept new messages.
 */
knoxx.backend.infra.stores.mongo_session_store.session_can_send_QMARK_ = (function knoxx$backend$infra$stores$mongo_session_store$session_can_send_QMARK_(session){
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
/**
 * Remove the last N user turns plus everything that followed them.
 * Preserves any leading system messages that predate the removed turn(s).
 */
knoxx.backend.infra.stores.mongo_session_store.rewind_messages = (function knoxx$backend$infra$stores$mongo_session_store$rewind_messages(messages,turns){
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
var G__27170 = cljs.core.subvec.cljs$core$IFn$_invoke$arity$3(remaining,(0),last_user_index);
var G__27171 = (turns_left - (1));
remaining = G__27170;
turns_left = G__27171;
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
knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$undo_session_turns_BANG_(var_args){
var G__27055 = arguments.length;
switch (G__27055) {
case 2:
return knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (session_id,turns){
return knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),session_id,turns);
}));

(knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,session_id,turns){
var temp__5825__auto__ = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$2(db,session_id));
if(cljs.core.truth_(temp__5825__auto__)){
var session = temp__5825__auto__;
var current_messages = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var rewound_messages = knoxx.backend.infra.stores.mongo_session_store.rewind_messages(current_messages,turns);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(rewound_messages,current_messages)){
return session;
} else {
return (await knoxx.backend.infra.stores.mongo_session_store.put_session_BANG_.cljs$core$IFn$_invoke$arity$2(db,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(session,new cljs.core.Keyword(null,"messages","messages",345434482),rewound_messages,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"status","status",-1997798413),"waiting_input",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),Date.now(),new cljs.core.Keyword(null,"answer","answer",-742633163),null,new cljs.core.Keyword(null,"error","error",-978969032),null], 0))));
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Return active sessions from the in-memory cache for monitoring.
 */
knoxx.backend.infra.stores.mongo_session_store.active_session_snapshots = (function knoxx$backend$infra$stores$mongo_session_store$active_session_snapshots(){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3((function (p1__27063_SHARP_){
var v = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(p1__27063_SHARP_);
if(typeof v === 'number'){
return v;
} else {
if((v instanceof Date)){
return v.getTime();
} else {
if(typeof v === 'string'){
return (new Date(v)).getTime();
} else {
return (0);

}
}
}
}),cljs.core._GT_,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27062_SHARP_){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__27062_SHARP_));
}),cljs.core.vals(cljs.core.deref(knoxx.backend.infra.stores.mongo_session_store.session_cache_STAR_)))));
});
/**
 * Create required indexes on knoxx_threads collection.
 */
knoxx.backend.infra.stores.mongo_session_store.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_store$setup_indexes_BANG_(db){
var coll = db.collection(knoxx.backend.infra.stores.mongo_session_store.COLLECTION_NAME);
(await coll.createIndex(({"session_id": (1)}),({"unique": true})));

(await coll.createIndex(({"conversation_id": (1)}),({"unique": true, "sparse": true})));

(await coll.createIndex(({"user_id": (1)})));

(await coll.createIndex(({"org_id": (1)})));

(await coll.createIndex(({"status": (1)})));

return (await coll.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));
});

//# sourceMappingURL=knoxx.backend.infra.stores.mongo_session_store.js.map
