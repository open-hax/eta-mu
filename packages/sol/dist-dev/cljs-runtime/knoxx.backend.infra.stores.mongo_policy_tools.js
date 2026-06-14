import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.registry.tools.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_tools');
knoxx.backend.infra.stores.mongo_policy_tools.TOOL_DEFINITIONS_COLLECTION = "knoxx_tool_definitions";
knoxx.backend.infra.stores.mongo_policy_tools.ROLE_TOOL_POLICIES_COLLECTION = "knoxx_role_tool_policies";
knoxx.backend.infra.stores.mongo_policy_tools.USER_TOOL_POLICIES_COLLECTION = "knoxx_user_tool_policies";
knoxx.backend.infra.stores.mongo_policy_tools.tool_definitions_coll = (function knoxx$backend$infra$stores$mongo_policy_tools$tool_definitions_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_tools.TOOL_DEFINITIONS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_tools.role_tool_policies_coll = (function knoxx$backend$infra$stores$mongo_policy_tools$role_tool_policies_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_tools.ROLE_TOOL_POLICIES_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_tools.user_tool_policies_coll = (function knoxx$backend$infra$stores$mongo_policy_tools$user_tool_policies_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_tools.USER_TOOL_POLICIES_COLLECTION);
});
/**
 * Adapt a knoxx_tool_definitions document into a PG-shaped tool_definitions
 * row: present the natural :tool_id as :id, drop Mongo's _id. Mirrors the
 * columns infra.db.policy/tool_row->map reads (id/label/description/
 * risk_level).
 */
knoxx.backend.infra.stores.mongo_policy_tools.tool_def_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_tools$tool_def_doc__GT_row(doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.get.cljs$core$IFn$_invoke$arity$2(doc,new cljs.core.Keyword(null,"tool_id","tool_id",1550520216))),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_policy_tools.keywordize = (function knoxx$backend$infra$stores$mongo_policy_tools$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Create tool-definition uniqueness + tool-policy uniqueness/lookup indexes.
 * Idempotent.
 * 
 * Mirrors the PG uniques exactly: tool_definitions PRIMARY KEY (id) -> unique
 * on :tool_id; role_tool_policies PRIMARY KEY (role_id, tool_id) -> compound
 * unique; user_tool_policies PRIMARY KEY (membership_id, tool_id) -> compound
 * unique. Lookup indexes on role_tool_policies.role_id and
 * user_tool_policies.membership_id mirror the FK delete/replace access paths
 * (tool-policies-for-roles / tool-policies-for-ids / delete-tool-policies).
 * 
 * partialFilterExpression is deliberately avoided everywhere — it rejects
 * {$exists false} (server error 67, observed live 2026-06-06) and crash-loops
 * the live backend at bootstrap. None of these uniques need it: tool_id,
 * role_id and membership_id are all NOT NULL in PG, so plain compound uniques
 * are exact mirrors.
 */
knoxx.backend.infra.stores.mongo_policy_tools.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$setup_indexes_BANG_(db){
var tool_definitions = knoxx.backend.infra.stores.mongo_policy_tools.tool_definitions_coll(db);
var role_tool_policies = knoxx.backend.infra.stores.mongo_policy_tools.role_tool_policies_coll(db);
var user_tool_policies = knoxx.backend.infra.stores.mongo_policy_tools.user_tool_policies_coll(db);
(await tool_definitions.createIndex(({"tool_id": (1)}),({"unique": true})));

(await role_tool_policies.createIndex(({"role_id": (1), "tool_id": (1)}),({"unique": true})));

(await role_tool_policies.createIndex(({"role_id": (1)})));

(await user_tool_policies.createIndex(({"membership_id": (1), "tool_id": (1)}),({"unique": true})));

(await user_tool_policies.createIndex(({"membership_id": (1)})));

return true;
});
/**
 * Build the upsert $set body for a tool id, resolved through the registry
 * exactly like the PG path: label defaults to the id, description to "",
 * risk_level to "low".
 */
knoxx.backend.infra.stores.mongo_policy_tools.tool_definition_doc = (function knoxx$backend$infra$stores$mongo_policy_tools$tool_definition_doc(tool_id){
var map__25706 = knoxx.backend.infra.registry.tools.get_tool(tool_id);
var map__25706__$1 = cljs.core.__destructure_map(map__25706);
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25706__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25706__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
var risk_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25706__$1,new cljs.core.Keyword(null,"risk-level","risk-level",658496607));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"label","label",1718410804),(function (){var or__5162__auto__ = label;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})(),new cljs.core.Keyword(null,"description","description",-1428560544),(function (){var or__5162__auto__ = description;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"risk_level","risk_level",1950920554),(function (){var or__5162__auto__ = risk_level;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "low";
}
})(),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
});
/**
 * Idempotent upsert of tool definitions by tool id (infra.db.policy/
 * ensure-tool-definitions!: INSERT ... ON CONFLICT (id) DO UPDATE SET label,
 * description, risk_level). Tool ids are normalized through the registry and
 * deduped, matching the PG path; empty in is a no-op. Mongo twin: updateOne
 * with upsert per id, $set on the registry-resolved attrs so re-running
 * refreshes label/description/risk_level just like EXCLUDED.* does.
 */
knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$ensure_tool_definitions_BANG_(var_args){
var G__25722 = arguments.length;
switch (G__25722) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (tool_ids){
return knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),tool_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,tool_ids){
var ids = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,tool_ids)));
var coll = knoxx.backend.infra.stores.mongo_policy_tools.tool_definitions_coll(db);
var seq__25732_25998 = cljs.core.seq(ids);
var chunk__25733_25999 = null;
var count__25734_26000 = (0);
var i__25735_26001 = (0);
while(true){
if((i__25735_26001 < count__25734_26000)){
var tid_26005 = chunk__25733_25999.cljs$core$IIndexed$_nth$arity$2(null,i__25735_26001);
(await coll.updateOne(({"tool_id": tid_26005}),({"$set": cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.mongo_policy_tools.tool_definition_doc(tid_26005),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),tid_26005))}),({"upsert": true})));


var G__26006 = seq__25732_25998;
var G__26007 = chunk__25733_25999;
var G__26008 = count__25734_26000;
var G__26009 = (i__25735_26001 + (1));
seq__25732_25998 = G__26006;
chunk__25733_25999 = G__26007;
count__25734_26000 = G__26008;
i__25735_26001 = G__26009;
continue;
} else {
var temp__5825__auto___26010 = cljs.core.seq(seq__25732_25998);
if(temp__5825__auto___26010){
var seq__25732_26011__$1 = temp__5825__auto___26010;
if(cljs.core.chunked_seq_QMARK_(seq__25732_26011__$1)){
var c__5694__auto___26012 = cljs.core.chunk_first(seq__25732_26011__$1);
var G__26015 = cljs.core.chunk_rest(seq__25732_26011__$1);
var G__26016 = c__5694__auto___26012;
var G__26017 = cljs.core.count(c__5694__auto___26012);
var G__26018 = (0);
seq__25732_25998 = G__26015;
chunk__25733_25999 = G__26016;
count__25734_26000 = G__26017;
i__25735_26001 = G__26018;
continue;
} else {
var tid_26021 = cljs.core.first(seq__25732_26011__$1);
(await coll.updateOne(({"tool_id": tid_26021}),({"$set": cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.stores.mongo_policy_tools.tool_definition_doc(tid_26021),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),tid_26021))}),({"upsert": true})));


var G__26023 = cljs.core.next(seq__25732_26011__$1);
var G__26024 = null;
var G__26025 = (0);
var G__26026 = (0);
seq__25732_25998 = G__26023;
chunk__25733_25999 = G__26024;
count__25734_26000 = G__26025;
i__25735_26001 = G__26026;
continue;
}
} else {
}
}
break;
}

return null;
}));

(knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * All tool definitions ordered by id asc (infra.db.policy/list-tools! SELECT
 * id, label, description, risk_level FROM tool_definitions ORDER BY id ASC).
 * Returns PG-shaped rows; the policy layer maps these via tool_row->map.
 */
knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$list_tools_BANG_(var_args){
var G__25770 = arguments.length;
switch (G__25770) {
case 0:
return knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (db){
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_tools.tool_def_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_tools.keywordize((await knoxx.backend.infra.stores.mongo_policy_tools.tool_definitions_coll(db).find(({})).toArray())))));
}));

(knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * role_tool_policies rows for a set of role ids, ordered by tool_id
 * (q-roles/tool-policies-for-roles). Returns rows shaped
 * {:role_id .. :tool_id .. :effect .. :constraints_json ..} matching the
 * exact columns the PG builder selects, so the policy
 * grouped-role-tool-policies reducer hydrates identically. constraints_json
 * is the stored JSON string, re-parsed by constraints-json->clj at hydrate.
 */
knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$tool_policies_for_roles_BANG_(var_args){
var G__25796 = arguments.length;
switch (G__25796) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (role_ids){
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),role_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,role_ids){
var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,role_ids);
if(cljs.core.empty_QMARK_(ids)){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"role_id","role_id",1603615897),new cljs.core.Keyword(null,"role_id","role_id",1603615897).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"effect","effect",347343289),new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864),new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864).cljs$core$IFn$_invoke$arity$1(p)], null);
}),knoxx.backend.infra.stores.mongo_policy_tools.keywordize((await knoxx.backend.infra.stores.mongo_policy_tools.role_tool_policies_coll(db).find(({"role_id": ({"$in": cljs.core.clj__GT_js(ids)})})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Replace-set a role's tool policies (infra.db.policy/set-role-tool-policies-tx!:
 * unconditional delete-tool-policies then, after ensure-tool-definitions!,
 * insert-tool-policy per normalized policy inside a PG transaction). Mongo
 * twin: deleteMany then insertMany. Each policy carries the already-computed
 * :constraints-json STRING (policy-with-constraints-json upstream), persisted
 * verbatim so tool-policies-for-roles! returns the identical string. An empty
 * policy set therefore CLEARS all tool policies for the role.
 * 
 * PG TRANSACTION SEMANTICS: PG is atomic (delete+inserts in one tx); this twin
 * is NON-ATOMIC — a window exists after deleteMany and before insertMany where
 * the role has no tool policies. Acceptable under the single-writer-per-
 * system-instance assumption. No converge single statement applies (set
 * replacement, not a computed field). Definition pre-condition matches PG
 * (callers ensure-tool-definitions! first); this fn writes policy rows only.
 */
knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$set_role_tool_policies_BANG_(var_args){
var G__25844 = arguments.length;
switch (G__25844) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (role_id,normalized){
return knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),role_id,normalized);
}));

(knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,role_id,normalized){
var rid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role_id));
(await knoxx.backend.infra.stores.mongo_policy_tools.role_tool_policies_coll(db).deleteMany(({"role_id": rid})));

if(cljs.core.seq(normalized)){
var docs_26049 = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__25853){
var map__25854 = p__25853;
var map__25854__$1 = cljs.core.__destructure_map(map__25854);
var tool_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25854__$1,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894));
var effect = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25854__$1,new cljs.core.Keyword(null,"effect","effect",347343289));
var constraints_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25854__$1,new cljs.core.Keyword(null,"constraints-json","constraints-json",-1677970568));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"role_id","role_id",1603615897),rid,new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),effect,new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864),constraints_json,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
}),normalized);
(await knoxx.backend.infra.stores.mongo_policy_tools.role_tool_policies_coll(db).insertMany(cljs.core.clj__GT_js(docs_26049)));
} else {
}

return null;
}));

(knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * user_tool_policies rows for a set of membership ids, ordered by tool_id
 * (q-memberships/tool-policies-for-ids). Returns rows shaped
 * {:membership_id .. :tool_id .. :effect .. :constraints_json ..} matching the
 * exact columns the PG builder selects, so the policy
 * grouped-membership-tool-policies reducer hydrates identically.
 * constraints_json is the stored JSON string, re-parsed at hydrate.
 */
knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$tool_policies_for_memberships_BANG_(var_args){
var G__25868 = arguments.length;
switch (G__25868) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_ids){
return knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_ids){
var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,membership_ids);
if(cljs.core.empty_QMARK_(ids)){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),new cljs.core.Keyword(null,"membership_id","membership_id",-171302674).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),new cljs.core.Keyword(null,"tool_id","tool_id",1550520216).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"effect","effect",347343289),new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864),new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864).cljs$core$IFn$_invoke$arity$1(p)], null);
}),knoxx.backend.infra.stores.mongo_policy_tools.keywordize((await knoxx.backend.infra.stores.mongo_policy_tools.user_tool_policies_coll(db).find(({"membership_id": ({"$in": cljs.core.clj__GT_js(ids)})})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Replace-set a membership's tool policies (infra.db.policy/
 * set-membership-tool-policies-tx!: delete-tool-policies then, after
 * ensure-tool-definitions!, insert-tool-policy per normalized policy inside a
 * PG transaction). Mongo twin: deleteMany then insertMany. Each policy carries
 * the already-computed :constraints-json STRING; it is persisted verbatim so
 * tool-policies-for-memberships! returns the identical string. An empty policy
 * set therefore CLEARS all tool policies for the membership.
 * 
 * PG TRANSACTION SEMANTICS: the PG path is atomic; this twin is NON-ATOMIC —
 * a window exists after deleteMany and before insertMany. Acceptable under the
 * single-writer-per-system-instance assumption. No converge single statement
 * applies (set replacement, not a computed field).
 * 
 * Definition pre-condition matches PG (ensure-tool-definitions! first); this
 * fn writes the policy rows only.
 */
knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_tools$set_membership_tool_policies_BANG_(var_args){
var G__25888 = arguments.length;
switch (G__25888) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (membership_id,normalized){
return knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),membership_id,normalized);
}));

(knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,membership_id,normalized){
var mid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id));
(await knoxx.backend.infra.stores.mongo_policy_tools.user_tool_policies_coll(db).deleteMany(({"membership_id": mid})));

if(cljs.core.seq(normalized)){
var docs_26066 = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p__25897){
var map__25898 = p__25897;
var map__25898__$1 = cljs.core.__destructure_map(map__25898);
var tool_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25898__$1,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894));
var effect = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25898__$1,new cljs.core.Keyword(null,"effect","effect",347343289));
var constraints_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25898__$1,new cljs.core.Keyword(null,"constraints-json","constraints-json",-1677970568));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),mid,new cljs.core.Keyword(null,"tool_id","tool_id",1550520216),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),effect,new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864),constraints_json,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
}),normalized);
(await knoxx.backend.infra.stores.mongo_policy_tools.user_tool_policies_coll(db).insertMany(cljs.core.clj__GT_js(docs_26066)));
} else {
}

return null;
}));

(knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_tools.js.map
