import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_rate_limits');
knoxx.backend.infra.stores.mongo_rate_limits.COLLECTION_NAME = "knoxx_rate_limits";
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.stores !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_rate_limits !== 'undefined') && (typeof knoxx.backend.infra.stores.mongo_rate_limits.increment_fn_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.stores.mongo_rate_limits.increment_fn_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
/**
 * Set a custom increment function for testing.
 */
knoxx.backend.infra.stores.mongo_rate_limits.set_increment_fn_BANG_ = (function knoxx$backend$infra$stores$mongo_rate_limits$set_increment_fn_BANG_(f){
return cljs.core.reset_BANG_(knoxx.backend.infra.stores.mongo_rate_limits.increment_fn_STAR_,f);
});
knoxx.backend.infra.stores.mongo_rate_limits.coll = (function knoxx$backend$infra$stores$mongo_rate_limits$coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_rate_limits.COLLECTION_NAME);
});
/**
 * Create required indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_rate_limits.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_rate_limits$setup_indexes_BANG_(db){
var c = knoxx.backend.infra.stores.mongo_rate_limits.coll(db);
(await c.createIndex(({"key": (1)}),({"unique": true})));

(await c.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

return true;
});
/**
 * Atomically increment the rate limit counter for a key.
 * Returns the new count. Creates the document with TTL if it doesn't exist.
 */
knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_ = (async function knoxx$backend$infra$stores$mongo_rate_limits$increment_rate_limit_BANG_(var_args){
var G__27998 = arguments.length;
switch (G__27998) {
case 2:
return knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (key,window_seconds){
return knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),key,window_seconds);
}));

(knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,key,window_seconds){
var temp__5823__auto__ = cljs.core.deref(knoxx.backend.infra.stores.mongo_rate_limits.increment_fn_STAR_);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(key,window_seconds) : f.call(null,key,window_seconds));
} else {
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return key;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_rate_limits.coll(db);
var now = (new Date());
var expires_at = (new Date((Date.now() + (window_seconds * (1000)))));
var update_doc = new cljs.core.PersistentArrayMap(null, 2, ["$inc",({"count": (1)}),"$setOnInsert",({"created_at": now, "system_instance_id": knoxx.backend.infra.system_instance.current_id(), "expiresAt": expires_at})], null);
var opts = ({"upsert": true, "returnDocument": "after"});
var result = (await c.findOneAndUpdate(({"key": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key))}),cljs.core.clj__GT_js(update_doc),opts));
var or__5162__auto__ = (result["count"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
} else {
return null;
}
}
}));

(knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_rate_limits.js.map
