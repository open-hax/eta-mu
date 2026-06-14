import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.manifest');
/**
 * Ordered [kind id-key] pairs: the id key whose presence registers an entry
 * as that kind. Order fixes the expansion order of composite entries.
 */
open_hax.contract_runtime.manifest.kind_id_keys = new cljs.core.PersistentVector(null, 17, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword("trigger","id","trigger/id",-326368132)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword("action","id","action/id",241708030)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"store","store",1512230022),new cljs.core.Keyword("store","id","store/id",-1277972109)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword("agent","id","agent/id",-1462765745)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword("actor","id","actor/id",-1462607809)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword("role","id","role/id",-1375589954)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"capability","capability",-223324340),new cljs.core.Keyword("cap","id","cap/id",-1388434846)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"policy","policy",902736495),new cljs.core.Keyword("policy","id","policy/id",-383101694)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"schedule","schedule",349275266),new cljs.core.Keyword("schedule","id","schedule/id",-1003403363)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword("generator","id","generator/id",-1134211231)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword("source","id","source/id",-271642087)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"source-mode","source-mode",725702471),new cljs.core.Keyword("source-mode","id","source-mode/id",-1519550945)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275),new cljs.core.Keyword("ingest-source","id","ingest-source/id",-1701314896)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword("model","id","model/id",-1274892501)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model-family","model-family",-373740636),new cljs.core.Keyword("model-family","id","model-family/id",969625548)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721),new cljs.core.Keyword("runtime-feature","id","runtime-feature/id",-160005037)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131),new cljs.core.Keyword("sub-agent","id","sub-agent/id",308548860)], null)], null);
open_hax.contract_runtime.manifest.kind__GT_id_key = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,open_hax.contract_runtime.manifest.kind_id_keys);
/**
 * Key namespace string -> resource kind (e.g. "cap" -> :capability).
 */
open_hax.contract_runtime.manifest.key_ns__GT_kind = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p__15404){
var vec__15406 = p__15404;
var kind = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15406,(0),null);
var id_key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15406,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.namespace(id_key),kind], null);
})),open_hax.contract_runtime.manifest.kind_id_keys);
open_hax.contract_runtime.manifest.id_name = (function open_hax$contract_runtime$manifest$id_name(value){
if((value instanceof cljs.core.Keyword)){
return cljs.core.name(value);
} else {
if((value == null)){
return null;
} else {
var G__15431 = value;
var G__15431__$1 = (((G__15431 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__15431)));
var G__15431__$2 = (((G__15431__$1 == null))?null:clojure.string.trim(G__15431__$1));
if((G__15431__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__15431__$2);
}

}
}
});
/**
 * True when a parsed EDN map is a namespace resource file.
 */
open_hax.contract_runtime.manifest.namespace_file_QMARK_ = (function open_hax$contract_runtime$manifest$namespace_file_QMARK_(raw){
return ((cljs.core.map_QMARK_(raw)) && ((((!((new cljs.core.Keyword(null,"namespace","namespace",-377510372).cljs$core$IFn$_invoke$arity$1(raw) == null)))) && (cljs.core.sequential_QMARK_(new cljs.core.Keyword(null,"resources","resources",1632806811).cljs$core$IFn$_invoke$arity$1(raw))))));
});
/**
 * Qualified keyword identity for a namespace-local resource id.
 */
open_hax.contract_runtime.manifest.qualified_id = (function open_hax$contract_runtime$manifest$qualified_id(namespace_value,local_id){
var temp__5825__auto__ = open_hax.contract_runtime.manifest.id_name(local_id);
if(cljs.core.truth_(temp__5825__auto__)){
var local = temp__5825__auto__;
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.manifest.id_name(namespace_value),local);
} else {
return null;
}
});
/**
 * Qualified id as the "namespace/local-id" string used for record indexing.
 */
open_hax.contract_runtime.manifest.qualified_id_str = (function open_hax$contract_runtime$manifest$qualified_id_str(namespace_value,local_id){
var G__15457 = open_hax.contract_runtime.manifest.qualified_id(namespace_value,local_id);
var G__15457__$1 = (((G__15457 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__15457)));
if((G__15457__$1 == null)){
return null;
} else {
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2(G__15457__$1,(1));
}
});
/**
 * Kinds an entry REGISTERS, by presence of their id keys, in grammar order.
 */
open_hax.contract_runtime.manifest.entry_kinds = (function open_hax$contract_runtime$manifest$entry_kinds(entry){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p__15468){
var vec__15470 = p__15468;
var kind = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15470,(0),null);
var id_key = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__15470,(1),null);
if((!((cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,id_key) == null)))){
return kind;
} else {
return null;
}
}),open_hax.contract_runtime.manifest.kind_id_keys));
});
/**
 * All kinds an entry speaks about: kinds with any key in their namespace.
 */
open_hax.contract_runtime.manifest.facet_kinds = (function open_hax$contract_runtime$manifest$facet_kinds(entry){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (k){
if((k instanceof cljs.core.Keyword)){
var G__15481 = cljs.core.namespace(k);
return (open_hax.contract_runtime.manifest.key_ns__GT_kind.cljs$core$IFn$_invoke$arity$1 ? open_hax.contract_runtime.manifest.key_ns__GT_kind.cljs$core$IFn$_invoke$arity$1(G__15481) : open_hax.contract_runtime.manifest.key_ns__GT_kind.call(null,G__15481));
} else {
return null;
}
}),cljs.core.keys(entry))));
});
/**
 * Facet kinds the entry does NOT register: anonymous resources owned by the
 * entry's registered kinds (e.g. :action for a trigger carrying :action/fn).
 */
open_hax.contract_runtime.manifest.anonymous_facets = (function open_hax$contract_runtime$manifest$anonymous_facets(entry){
var registered = cljs.core.set(open_hax.contract_runtime.manifest.entry_kinds(entry));
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(registered,open_hax.contract_runtime.manifest.facet_kinds(entry)));
});
/**
 * Project one registered kind of a composite entry into a full resource
 * definition carrying legacy contract identity keys.
 */
open_hax.contract_runtime.manifest.entry_definition = (function open_hax$contract_runtime$manifest$entry_definition(namespace_value,entry,kind){
var local_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(entry,(open_hax.contract_runtime.manifest.kind__GT_id_key.cljs$core$IFn$_invoke$arity$1 ? open_hax.contract_runtime.manifest.kind__GT_id_key.cljs$core$IFn$_invoke$arity$1(kind) : open_hax.contract_runtime.manifest.kind__GT_id_key.call(null,kind)));
var qid = open_hax.contract_runtime.manifest.qualified_id(namespace_value,local_id);
var anonymous = open_hax.contract_runtime.manifest.anonymous_facets(entry);
var G__15606 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(entry,new cljs.core.Keyword(null,"namespace","namespace",-377510372),cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(open_hax.contract_runtime.manifest.id_name(namespace_value)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("resource","qualified-id","resource/qualified-id",341105296),qid,new cljs.core.Keyword("contract","kind","contract/kind",1929672067),kind,new cljs.core.Keyword("contract","id","contract/id",-872298206),open_hax.contract_runtime.manifest.qualified_id_str(namespace_value,local_id)], 0));
var G__15606__$1 = ((cljs.core.seq(anonymous))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__15606,new cljs.core.Keyword("resource","anonymous-facets","resource/anonymous-facets",-253230065),anonymous):G__15606);
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"trigger","trigger",103466139))) && ((new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(entry) == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__15606__$1,new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347),new cljs.core.Keyword(null,"event","event",301435442));
} else {
return G__15606__$1;
}
});
/**
 * Expand a namespace file into resource definitions, one per registered kind
 * per entry. Returns [{:resource/kind kind :resource/definition map} ...].
 * Anonymous facets stay on every projected definition — interpreters read
 * their own keys in place.
 */
open_hax.contract_runtime.manifest.namespace_file_definitions = (function open_hax$contract_runtime$manifest$namespace_file_definitions(raw){
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (entry){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (kind){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),kind,new cljs.core.Keyword("resource","definition","resource/definition",-1547661004),open_hax.contract_runtime.manifest.entry_definition(new cljs.core.Keyword(null,"namespace","namespace",-377510372).cljs$core$IFn$_invoke$arity$1(raw),entry,kind)], null);
}),open_hax.contract_runtime.manifest.entry_kinds(entry));
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.map_QMARK_,new cljs.core.Keyword(null,"resources","resources",1632806811).cljs$core$IFn$_invoke$arity$1(raw))], 0)));
});

//# sourceMappingURL=open_hax.contract_runtime.manifest.js.map
