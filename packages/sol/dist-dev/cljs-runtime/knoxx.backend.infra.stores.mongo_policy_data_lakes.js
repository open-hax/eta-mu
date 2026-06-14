import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_data_lakes');
knoxx.backend.infra.stores.mongo_policy_data_lakes.DATA_LAKES_COLLECTION = "knoxx_data_lakes";
knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lakes_coll = (function knoxx$backend$infra$stores$mongo_policy_data_lakes$data_lakes_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_data_lakes.DATA_LAKES_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_data_lakes.keywordize = (function knoxx$backend$infra$stores$mongo_policy_data_lakes$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Adapt a knoxx_data_lakes document into a PG-shaped data_lakes row.
 * :lake_id → :id, drops :_id.
 */
knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lake_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_data_lakes$data_lake_doc__GT_row(doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"lake_id","lake_id",-1078418419).cljs$core$IFn$_invoke$arity$1(doc)),new cljs.core.Keyword(null,"lake_id","lake_id",-1078418419),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
/**
 * Create data-lake indexes. Idempotent.
 * Unique on (org_id, slug) mirrors PG's UNIQUE (org_id, slug).
 */
knoxx.backend.infra.stores.mongo_policy_data_lakes.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_data_lakes$setup_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lakes_coll(db);
(await coll.createIndex(({"org_id": (1), "slug": (1)}),({"unique": true})));

(await coll.createIndex(({"org_id": (1), "name": (1)})));

return true;
});
/**
 * Return all data lakes for an org, ordered by name.
 */
knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_data_lakes$list_data_lakes_by_org_BANG_(var_args){
var G__25643 = arguments.length;
switch (G__25643) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (org_id){
return knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,org_id){
var coll = knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lakes_coll(db);
var cursor = coll.find(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))}));
var docs = knoxx.backend.infra.stores.mongo_policy_data_lakes.keywordize((await cursor.toArray()));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lake_doc__GT_row,cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"name","name",1843675177),docs));
}));

(knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Insert a new data lake. Returns the created row.
 */
knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_data_lakes$create_data_lake_BANG_(var_args){
var G__25668 = arguments.length;
switch (G__25668) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (org_id,lake){
return knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),org_id,lake);
}));

(knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,org_id,p__25680){
var map__25681 = p__25680;
var map__25681__$1 = cljs.core.__destructure_map(map__25681);
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25681__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25681__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25681__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var config_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25681__$1,new cljs.core.Keyword(null,"config-json","config-json",-2135731477));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25681__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var coll = knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lakes_coll(db);
var now = (new Date());
(await coll.insertOne(cljs.core.clj__GT_js(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),new cljs.core.Keyword(null,"lake_id","lake_id",-1078418419),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"config_json","config_json",-1099428580),new cljs.core.Keyword(null,"created_at","created_at",1484050750)],[slug,name,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)),knoxx.backend.infra.system_instance.current_id(),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())),now,(await (async function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()),(await (async function (){var or__5162__auto__ = kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "workspace_docs";
}
})()),(cljs.core.truth_(config_json)?((typeof config_json === 'string')?JSON.parse(config_json):cljs.core.clj__GT_js(config_json)):null),now]))));

var doc = knoxx.backend.infra.stores.mongo_policy_data_lakes.keywordize((await coll.findOne(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "slug": slug}))));
return knoxx.backend.infra.stores.mongo_policy_data_lakes.data_lake_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_data_lakes.js.map
