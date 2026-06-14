import "./cljs_env.js";
import "./cljs.core.js";
import "./honey.sql.helpers.js";
goog.provide('knoxx.backend.shape.db.audit');
knoxx.backend.shape.db.audit.insert_event = (function knoxx$backend$shape$db$audit$insert_event(p__31194){
var map__31195 = p__31194;
var map__31195__$1 = cljs.core.__destructure_map(map__31195);
var actor_user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995));
var actor_membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var action = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"action","action",-811238024));
var resource_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299));
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
var before_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"before-json","before-json",1894162958));
var after_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31195__$1,new cljs.core.Keyword(null,"after-json","after-json",2142150900));
return honey.sql.helpers.values.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([honey.sql.helpers.insert_into.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"audit_events","audit_events",-995844763)], 0)),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"actor_user_id","actor_user_id",2024026945),(cljs.core.truth_(actor_user_id)?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),actor_user_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null):null),new cljs.core.Keyword(null,"actor_membership_id","actor_membership_id",804228749),(cljs.core.truth_(actor_membership_id)?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),actor_membership_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null):null),new cljs.core.Keyword(null,"org_id","org_id",1380185385),(cljs.core.truth_(org_id)?new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),org_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null):null),new cljs.core.Keyword(null,"action","action",-811238024),action,new cljs.core.Keyword(null,"resource_kind","resource_kind",847661086),resource_kind,new cljs.core.Keyword(null,"resource_id","resource_id",470526046),resource_id,new cljs.core.Keyword(null,"before_json","before_json",-1877071763),(cljs.core.truth_(before_json)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),before_json], null):null),new cljs.core.Keyword(null,"after_json","after_json",652319382),(cljs.core.truth_(after_json)?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),after_json], null):null)], null)], null)], 0));
});

//# sourceMappingURL=knoxx.backend.shape.db.audit.js.map
