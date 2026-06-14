import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_memory_sessions');
knoxx.backend.infra.stores.mongo_memory_sessions.COLLECTION_NAME = "knoxx_memory_threads";
knoxx.backend.infra.stores.mongo_memory_sessions.DEFAULT_TTL_SECONDS = (10);
knoxx.backend.infra.stores.mongo_memory_sessions.coll = (function knoxx$backend$infra$stores$mongo_memory_sessions$coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_memory_sessions.COLLECTION_NAME);
});
/**
 * Create required indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_memory_sessions.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_memory_sessions$setup_indexes_BANG_(db){
var c = knoxx.backend.infra.stores.mongo_memory_sessions.coll(db);
(await c.createIndex(({"cache_key": (1)}),({"unique": true})));

(await c.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

return true;
});
knoxx.backend.infra.stores.mongo_memory_sessions.keywordize = (function knoxx$backend$infra$stores$mongo_memory_sessions$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Read cached memory sessions entry. Returns keywordized map or nil.
 */
knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_ = (async function knoxx$backend$infra$stores$mongo_memory_sessions$get_cache_entry_BANG_(var_args){
var G__29242 = arguments.length;
switch (G__29242) {
case 1:
return knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (cache_key){
return knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),cache_key);
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,cache_key){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return cache_key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_memory_sessions.coll(db);
var result = (await c.findOne(({"cache_key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cache_key))})));
if(cljs.core.truth_(result)){
var doc = knoxx.backend.infra.stores.mongo_memory_sessions.keywordize(result);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(doc,(0)) > Date.now())){
return doc;
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.get_cache_entry_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Write memory sessions cache entry. Upserts by cache_key, refreshes TTL.
 */
knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_ = (async function knoxx$backend$infra$stores$mongo_memory_sessions$set_cache_entry_BANG_(var_args){
var G__29256 = arguments.length;
switch (G__29256) {
case 2:
return knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (cache_key,entry){
return knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),cache_key,entry);
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,cache_key,entry){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return cache_key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_memory_sessions.coll(db);
var now = (new Date());
var doc = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"cache_key","cache_key",-1476737373),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cache_key)),new cljs.core.Keyword(null,"value","value",305978217),new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$2(entry,now),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(entry,(now + knoxx.backend.infra.stores.mongo_memory_sessions.DEFAULT_TTL_SECONDS)),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (knoxx.backend.infra.stores.mongo_memory_sessions.DEFAULT_TTL_SECONDS * (1000)))))], null);
(await c.updateOne(({"cache_key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cache_key))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"value","value",305978217),new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"cached-at","cached-at",2133976632),new cljs.core.Keyword(null,"cached-at","cached-at",2133976632).cljs$core$IFn$_invoke$arity$2(entry,now),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(entry,(now + knoxx.backend.infra.stores.mongo_memory_sessions.DEFAULT_TTL_SECONDS)),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(doc)], null)), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return doc;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.set_cache_entry_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Remove memory sessions cache entry.
 */
knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_ = (async function knoxx$backend$infra$stores$mongo_memory_sessions$delete_cache_entry_BANG_(var_args){
var G__29279 = arguments.length;
switch (G__29279) {
case 1:
return knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (cache_key){
return knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),cache_key);
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,cache_key){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return cache_key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_memory_sessions.coll(db);
(await c.deleteOne(({"cache_key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cache_key))})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_memory_sessions.delete_cache_entry_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_memory_sessions.js.map
