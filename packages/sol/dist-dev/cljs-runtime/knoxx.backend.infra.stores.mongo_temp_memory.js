import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_temp_memory');
knoxx.backend.infra.stores.mongo_temp_memory.COLLECTION_NAME = "knoxx_temp_memory";
knoxx.backend.infra.stores.mongo_temp_memory.DEFAULT_TTL_SECONDS = ((60) * (60));
knoxx.backend.infra.stores.mongo_temp_memory.coll = (function knoxx$backend$infra$stores$mongo_temp_memory$coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_temp_memory.COLLECTION_NAME);
});
/**
 * Create required indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_temp_memory.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_temp_memory$setup_indexes_BANG_(db){
var c = knoxx.backend.infra.stores.mongo_temp_memory.coll(db);
(await c.createIndex(({"key": (1)}),({"unique": true})));

(await c.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

return true;
});
knoxx.backend.infra.stores.mongo_temp_memory.keywordize = (function knoxx$backend$infra$stores$mongo_temp_memory$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Read temp memory value. Returns keywordized map or nil.
 */
knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_ = (async function knoxx$backend$infra$stores$mongo_temp_memory$get_memory_BANG_(var_args){
var G__27914 = arguments.length;
switch (G__27914) {
case 1:
return knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (key){
return knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),key);
}));

(knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,key){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_temp_memory.coll(db);
var result = (await c.findOne(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))})));
if(cljs.core.truth_(result)){
var doc = knoxx.backend.infra.stores.mongo_temp_memory.keywordize(result);
if((new cljs.core.Keyword(null,"expires-at","expires-at",1654982210).cljs$core$IFn$_invoke$arity$2(doc,(0)) > Date.now())){
return new cljs.core.Keyword(null,"value","value",305978217).cljs$core$IFn$_invoke$arity$1(doc);
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

(knoxx.backend.infra.stores.mongo_temp_memory.get_memory_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Write temp memory value with TTL. Upserts by key, refreshes TTL.
 */
knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_ = (async function knoxx$backend$infra$stores$mongo_temp_memory$set_memory_BANG_(var_args){
var G__27932 = arguments.length;
switch (G__27932) {
case 3:
return knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (key,value,ttl_seconds){
return knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.mongo_client.get_db(),key,value,ttl_seconds);
}));

(knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,key,value,ttl_seconds){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_temp_memory.coll(db);
var now = (new Date());
var ttl = (await (async function (){var or__5162__auto__ = ttl_seconds;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.stores.mongo_temp_memory.DEFAULT_TTL_SECONDS;
}
})());
var set_doc = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"value","value",305978217),value,new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (ttl * (1000)))))], null);
var insert_doc = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
(await c.updateOne(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))}),({"$set": cljs.core.clj__GT_js(set_doc), "$setOnInsert": cljs.core.clj__GT_js(insert_doc)}),({"upsert": true})));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"written","written",-1069705267),true], null);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_temp_memory.set_memory_BANG_.cljs$lang$maxFixedArity = 4);

/**
 * Remove temp memory entry.
 */
knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_ = (async function knoxx$backend$infra$stores$mongo_temp_memory$delete_memory_BANG_(var_args){
var G__27953 = arguments.length;
switch (G__27953) {
case 1:
return knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (key){
return knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),key);
}));

(knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,key){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_temp_memory.coll(db);
(await c.deleteOne(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))})));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"key","key",-1516042587),key,new cljs.core.Keyword(null,"deleted","deleted",-510100639),true], null);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_temp_memory.delete_memory_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_temp_memory.js.map
