import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_audit_events');
knoxx.backend.infra.stores.mongo_policy_audit_events.AUDIT_EVENTS_COLLECTION = "knoxx_audit_events";
knoxx.backend.infra.stores.mongo_policy_audit_events.audit_coll = (function knoxx$backend$infra$stores$mongo_policy_audit_events$audit_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_audit_events.AUDIT_EVENTS_COLLECTION);
});
/**
 * Create indexes for audit event lookups. Idempotent.
 * Indexes on org_id and actor_user_id support future audit queries
 * even though the backend currently has none.
 */
knoxx.backend.infra.stores.mongo_policy_audit_events.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_audit_events$setup_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_audit_events.audit_coll(db);
(await coll.createIndex(({"org_id": (1), "created_at": (-1)})));

(await coll.createIndex(({"actor_user_id": (1), "created_at": (-1)})));

(await coll.createIndex(({"action": (1), "created_at": (-1)})));

return true;
});
/**
 * Insert an audit event. Mirrors PG shape.db.audit/insert-event.
 * before-json and after-json are already serialized strings from policy/append-audit!.
 */
knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_audit_events$insert_event_BANG_(var_args){
var G__25627 = arguments.length;
switch (G__25627) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (event){
return knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),event);
}));

(knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25629){
var map__25630 = p__25629;
var map__25630__$1 = cljs.core.__destructure_map(map__25630);
var actor_user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995));
var actor_membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var action = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"action","action",-811238024));
var resource_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299));
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var before_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"before-json","before-json",1894162958));
var after_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25630__$1,new cljs.core.Keyword(null,"after-json","after-json",2142150900));
var coll = knoxx.backend.infra.stores.mongo_policy_audit_events.audit_coll(db);
var now = (new Date());
return (await coll.insertOne(cljs.core.clj__GT_js(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"actor_user_id","actor_user_id",2024026945),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),new cljs.core.Keyword(null,"before_json","before_json",-1877071763),new cljs.core.Keyword(null,"actor_membership_id","actor_membership_id",804228749),new cljs.core.Keyword(null,"after_json","after_json",652319382),new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword(null,"resource_kind","resource_kind",847661086),new cljs.core.Keyword(null,"resource_id","resource_id",470526046),new cljs.core.Keyword(null,"created_at","created_at",1484050750)],[actor_user_id,org_id,knoxx.backend.infra.system_instance.current_id(),before_json,actor_membership_id,after_json,action,resource_kind,resource_id,now]))));
}));

(knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_audit_events.js.map
