import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_session_titles');
knoxx.backend.infra.stores.mongo_session_titles.COLLECTION_NAME = "knoxx_thread_titles";
knoxx.backend.infra.stores.mongo_session_titles.DEFAULT_TTL_SECONDS = ((((60) * (60)) * (24)) * (7));
knoxx.backend.infra.stores.mongo_session_titles.coll = (function knoxx$backend$infra$stores$mongo_session_titles$coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_session_titles.COLLECTION_NAME);
});
/**
 * Create required indexes. Idempotent.
 */
knoxx.backend.infra.stores.mongo_session_titles.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_titles$setup_indexes_BANG_(db){
var c = knoxx.backend.infra.stores.mongo_session_titles.coll(db);
(await c.createIndex(({"session_id": (1)}),({"unique": true})));

(await c.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));

return true;
});
knoxx.backend.infra.stores.mongo_session_titles.keywordize = (function knoxx$backend$infra$stores$mongo_session_titles$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Read cached session title. Returns keywordized map or nil.
 */
knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_titles$get_title_BANG_(var_args){
var G__28158 = arguments.length;
switch (G__28158) {
case 1:
return knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (session_id){
return knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),session_id);
}));

(knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,session_id){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return session_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_session_titles.coll(db);
var result = (await c.findOne(({"session_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))})));
return knoxx.backend.infra.stores.mongo_session_titles.keywordize(result);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_session_titles.get_title_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Write session title cache entry. Upserts by session_id, refreshes TTL.
 */
knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_titles$upsert_title_BANG_(var_args){
var G__28162 = arguments.length;
switch (G__28162) {
case 2:
return knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (session_id,entry){
return knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),session_id,entry);
}));

(knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,session_id,entry){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return session_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_session_titles.coll(db);
var now = (new Date());
var doc = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)),new cljs.core.Keyword(null,"title","title",636505583),new cljs.core.Keyword(null,"title","title",636505583).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"title_model","title_model",501758950),new cljs.core.Keyword(null,"title_model","title_model",501758950).cljs$core$IFn$_invoke$arity$1(entry),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$2(entry,now),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (knoxx.backend.infra.stores.mongo_session_titles.DEFAULT_TTL_SECONDS * (1000)))))], null);
(await c.updateOne(({"session_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))}),({"$set": cljs.core.clj__GT_js(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(doc,new cljs.core.Keyword(null,"created_at","created_at",1484050750),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036)], 0))), "$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));

return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entry,new cljs.core.Keyword(null,"session","session",1008279103),session_id);
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_session_titles.upsert_title_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Remove cached session title.
 */
knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_ = (async function knoxx$backend$infra$stores$mongo_session_titles$delete_title_BANG_(var_args){
var G__28169 = arguments.length;
switch (G__28169) {
case 1:
return knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (session_id){
return knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),session_id);
}));

(knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,session_id){
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = db;
if(cljs.core.truth_(and__5160__auto__)){
return session_id;
} else {
return and__5160__auto__;
}
})()))){
var c = knoxx.backend.infra.stores.mongo_session_titles.coll(db);
(await c.deleteOne(({"session_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))})));

return true;
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_session_titles.delete_title_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_session_titles.js.map
