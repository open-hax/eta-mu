import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.contracts.loader.js";
goog.provide('knoxx.backend.domain.contracts.sources');
/**
 * Recursively merge maps; later maps win for scalar/vector values.
 */
knoxx.backend.domain.contracts.sources.deep_merge = (function knoxx$backend$domain$contracts$sources$deep_merge(var_args){
var args__5903__auto__ = [];
var len__5897__auto___21280 = arguments.length;
var i__5898__auto___21281 = (0);
while(true){
if((i__5898__auto___21281 < len__5897__auto___21280)){
args__5903__auto__.push((arguments[i__5898__auto___21281]));

var G__21282 = (i__5898__auto___21281 + (1));
i__5898__auto___21281 = G__21282;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((0) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((0)),(0),null)):null);
return knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic = (function (maps){
var merge_entry = (function knoxx$backend$domain$contracts$sources$merge_entry(a,b){
if(((cljs.core.map_QMARK_(a)) && (cljs.core.map_QMARK_(b)))){
return cljs.core.merge_with.cljs$core$IFn$_invoke$arity$variadic(knoxx$backend$domain$contracts$sources$merge_entry,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([a,b], 0));
} else {
return b;
}
});
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(merge_entry,cljs.core.PersistentArrayMap.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.map_QMARK_,maps));
}));

(knoxx.backend.domain.contracts.sources.deep_merge.cljs$lang$maxFixedArity = (0));

/** @this {Function} */
(knoxx.backend.domain.contracts.sources.deep_merge.cljs$lang$applyTo = (function (seq21206){
var self__5883__auto__ = this;
return self__5883__auto__.cljs$core$IFn$_invoke$arity$variadic(cljs.core.seq(seq21206));
}));

knoxx.backend.domain.contracts.sources.nonblank_str = (function knoxx$backend$domain$contracts$sources$nonblank_str(value){
var G__21215 = value;
var G__21215__$1 = (((G__21215 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21215)));
var G__21215__$2 = (((G__21215__$1 == null))?null:clojure.string.trim(G__21215__$1));
if((G__21215__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21215__$2);
}
});
knoxx.backend.domain.contracts.sources.source_slug = (function knoxx$backend$domain$contracts$sources$source_slug(value){
var G__21217 = value;
var G__21217__$1 = (((G__21217 == null))?null:knoxx.backend.domain.contracts.sources.nonblank_str(G__21217));
var G__21217__$2 = (((G__21217__$1 == null))?null:clojure.string.replace(G__21217__$1,/^:/,""));
var G__21217__$3 = (((G__21217__$2 == null))?null:clojure.string.replace(G__21217__$2,/^source\//,""));
var G__21217__$4 = (((G__21217__$3 == null))?null:clojure.string.replace(G__21217__$3,/_/,"-"));
var G__21217__$5 = (((G__21217__$4 == null))?null:clojure.string.trim(G__21217__$4));
if((G__21217__$5 == null)){
return null;
} else {
return cljs.core.not_empty(G__21217__$5);
}
});
/**
 * Normalize source refs to the canonical :source/<slug> keyword.
 */
knoxx.backend.domain.contracts.sources.normalize_source_id = (function knoxx$backend$domain$contracts$sources$normalize_source_id(value){
if((value instanceof cljs.core.Keyword)){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source",cljs.core.namespace(value))){
return value;
} else {
var G__21225 = cljs.core.name(value);
var G__21225__$1 = (((G__21225 == null))?null:knoxx.backend.domain.contracts.sources.source_slug(G__21225));
if((G__21225__$1 == null)){
return null;
} else {
return (function (p1__21222_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("source",p1__21222_SHARP_);
})(G__21225__$1);
}
}
} else {
if(typeof value === 'string'){
var G__21226 = value;
var G__21226__$1 = (((G__21226 == null))?null:knoxx.backend.domain.contracts.sources.source_slug(G__21226));
if((G__21226__$1 == null)){
return null;
} else {
return (function (p1__21223_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("source",p1__21223_SHARP_);
})(G__21226__$1);
}
} else {
if((value == null)){
return null;
} else {
var G__21227 = value;
var G__21227__$1 = (((G__21227 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21227)));
var G__21227__$2 = (((G__21227__$1 == null))?null:knoxx.backend.domain.contracts.sources.source_slug(G__21227__$1));
if((G__21227__$2 == null)){
return null;
} else {
return (function (p1__21224_SHARP_){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("source",p1__21224_SHARP_);
})(G__21227__$2);
}

}
}
}
});
/**
 * Map a canonical source id to its contract id slug.
 */
knoxx.backend.domain.contracts.sources.source_contract_id = (function knoxx$backend$domain$contracts$sources$source_contract_id(source_id){
var G__21254 = knoxx.backend.domain.contracts.sources.normalize_source_id(source_id);
if((G__21254 == null)){
return null;
} else {
return cljs.core.name(G__21254);
}
});
/**
 * Extract the canonical :source/id from a source ref.
 * 
 * Accepts:
 * - :source/openplanner-memory
 * - source/openplanner-memory or openplanner-memory
 * - {:source/ref :source/openplanner-memory ...}
 * - {:source/id :source/openplanner-memory ...}
 */
knoxx.backend.domain.contracts.sources.source_ref_id = (function knoxx$backend$domain$contracts$sources$source_ref_id(source_ref){
if(cljs.core.map_QMARK_(source_ref)){
return knoxx.backend.domain.contracts.sources.normalize_source_id((function (){var or__5162__auto__ = new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source_ref);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("source","ref","source/ref",55749658).cljs$core$IFn$_invoke$arity$1(source_ref);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"source","source",-433931539).cljs$core$IFn$_invoke$arity$1(source_ref);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"ref","ref",1289896967).cljs$core$IFn$_invoke$arity$1(source_ref);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(source_ref);
}
}
}
}
})());
} else {
return knoxx.backend.domain.contracts.sources.normalize_source_id(source_ref);

}
});
knoxx.backend.domain.contracts.sources.source_ref_map = (function knoxx$backend$domain$contracts$sources$source_ref_map(source_ref){
if((source_ref == null)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
if(cljs.core.map_QMARK_(source_ref)){
return source_ref;
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("source","ref","source/ref",55749658),knoxx.backend.domain.contracts.sources.normalize_source_id(source_ref)], null);

}
}
});
knoxx.backend.domain.contracts.sources.alias_overrides = (function knoxx$backend$domain$contracts$sources$alias_overrides(m){
var filters = knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","filters","source/filters",1068056292).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"filters","filters",974726919).cljs$core$IFn$_invoke$arity$1(m)], 0));
var hydration = knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","hydration","source/hydration",-468770210).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"hydration","hydration",765373051).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"hydrate","hydrate",372087953).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword("source","config","source/config",-392505094).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(m)], 0));
var render = knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","render","source/render",-731130595).cljs$core$IFn$_invoke$arity$1(m),new cljs.core.Keyword(null,"render","render",-1408033454).cljs$core$IFn$_invoke$arity$1(m)], 0));
var G__21259 = m;
var G__21259__$1 = ((cljs.core.seq(filters))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21259,new cljs.core.Keyword("source","filters","source/filters",1068056292),filters):G__21259);
var G__21259__$2 = ((cljs.core.seq(hydration))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21259__$1,new cljs.core.Keyword("source","hydration","source/hydration",-468770210),hydration):G__21259__$1);
if(cljs.core.seq(render)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__21259__$2,new cljs.core.Keyword("source","render","source/render",-731130595),render);
} else {
return G__21259__$2;
}
});
knoxx.backend.domain.contracts.sources.contract_source_spec = (function knoxx$backend$domain$contracts$sources$contract_source_spec(contract){
if(cljs.core.map_QMARK_(contract)){
var source_id = knoxx.backend.domain.contracts.sources.normalize_source_id((function (){var or__5162__auto__ = new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(contract);
}
})());
var G__21260 = cljs.core.select_keys(contract,new cljs.core.PersistentVector(null, 14, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("contract","id","contract/id",-872298206),new cljs.core.Keyword("contract","type","contract/type",1673846430),new cljs.core.Keyword("source","name","source/name",596916310),new cljs.core.Keyword("source","type","source/type",-1735501385),new cljs.core.Keyword("source","enabled?","source/enabled?",1619749612),new cljs.core.Keyword("source","driver","source/driver",-1981763997),new cljs.core.Keyword("source","actor","source/actor",-1066117892),new cljs.core.Keyword("source","listens","source/listens",-136351302),new cljs.core.Keyword("source","protocol","source/protocol",494108431),new cljs.core.Keyword("source","provider","source/provider",529490529),new cljs.core.Keyword("source","hydration","source/hydration",-468770210),new cljs.core.Keyword("source","render","source/render",-731130595),new cljs.core.Keyword("source","filters","source/filters",1068056292),new cljs.core.Keyword("source","tools","source/tools",-24374125)], null));
if(cljs.core.truth_(source_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__21260,new cljs.core.Keyword("source","id","source/id",-271642087),source_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","ref","source/ref",55749658),source_id], 0));
} else {
return G__21260;
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.sources.source_contract_by_source_id = (function knoxx$backend$domain$contracts$sources$source_contract_by_source_id(config,source_id){
var wanted = knoxx.backend.domain.contracts.sources.normalize_source_id(source_id);
return cljs.core.some((function (record){
var contract = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sources",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted,knoxx.backend.domain.contracts.sources.normalize_source_id(new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(contract)))))){
return contract;
} else {
return null;
}
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
/**
 * Resolve a runtime source contract by source id or source ref.
 */
knoxx.backend.domain.contracts.sources.source_contract = (function knoxx$backend$domain$contracts$sources$source_contract(config,source_ref){
var temp__5825__auto__ = knoxx.backend.domain.contracts.sources.source_ref_id(source_ref);
if(cljs.core.truth_(temp__5825__auto__)){
var source_id = temp__5825__auto__;
var or__5162__auto__ = knoxx.backend.domain.contracts.loader.contract_sync(config,"sources",knoxx.backend.domain.contracts.sources.source_contract_id(source_id));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.contracts.sources.source_contract_by_source_id(config,source_id);
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.sources.source_ref_overrides = (function knoxx$backend$domain$contracts$sources$source_ref_overrides(source_ref){
var temp__5825__auto__ = knoxx.backend.domain.contracts.sources.source_ref_id(source_ref);
if(cljs.core.truth_(temp__5825__auto__)){
var source_id = temp__5825__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.contracts.sources.alias_overrides(knoxx.backend.domain.contracts.sources.source_ref_map(source_ref)),new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"ref","ref",1289896967),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"filters","filters",974726919),new cljs.core.Keyword(null,"hydration","hydration",765373051),new cljs.core.Keyword(null,"hydrate","hydrate",372087953),new cljs.core.Keyword(null,"render","render",-1408033454),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword("source","config","source/config",-392505094)], 0)),new cljs.core.Keyword("source","id","source/id",-271642087),source_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","ref","source/ref",55749658),source_id], 0));
} else {
return null;
}
});
/**
 * Resolve one source ref into a normalized runtime source spec.
 * 
 * Missing source contracts are tolerated so callers can pass run-local refs
 * before the contract exists, but disabled contracts/refs are omitted.
 */
knoxx.backend.domain.contracts.sources.resolve_source_spec = (function knoxx$backend$domain$contracts$sources$resolve_source_spec(config,source_ref){
var temp__5825__auto__ = knoxx.backend.domain.contracts.sources.source_ref_id(source_ref);
if(cljs.core.truth_(temp__5825__auto__)){
var source_id = temp__5825__auto__;
var base = (function (){var or__5162__auto__ = knoxx.backend.domain.contracts.sources.contract_source_spec(knoxx.backend.domain.contracts.sources.source_contract(config,source_id));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("source","id","source/id",-271642087),source_id,new cljs.core.Keyword("source","ref","source/ref",55749658),source_id], null);
}
})();
var merged = knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([base,knoxx.backend.domain.contracts.sources.source_ref_overrides(source_ref)], 0));
if((((!(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(merged) === false))) && ((!(new cljs.core.Keyword("source","enabled?","source/enabled?",1619749612).cljs$core$IFn$_invoke$arity$1(merged) === false))))){
return merged;
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.domain.contracts.sources.source_group__GT_refs = (function knoxx$backend$domain$contracts$sources$source_group__GT_refs(group){
if((group == null)){
return cljs.core.PersistentVector.EMPTY;
} else {
if(cljs.core.map_QMARK_(group)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [group], null);
} else {
if(((cljs.core.vector_QMARK_(group)) || (((cljs.core.list_QMARK_(group)) || (((cljs.core.set_QMARK_(group)) || (cljs.core.seq_QMARK_(group)))))))){
return cljs.core.seq(group);
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [group], null);

}
}
}
});
/**
 * Compose source refs in deterministic precedence order.
 * 
 * Pass groups in low -> high precedence order (actor, roles, agent, run). Later
 * refs for the same :source/id deep-merge over earlier refs while preserving the
 * first position in the source vector.
 */
knoxx.backend.domain.contracts.sources.compose_source_refs = (function knoxx$backend$domain$contracts$sources$compose_source_refs(var_args){
var args__5903__auto__ = [];
var len__5897__auto___21293 = arguments.length;
var i__5898__auto___21294 = (0);
while(true){
if((i__5898__auto___21294 < len__5897__auto___21293)){
args__5903__auto__.push((arguments[i__5898__auto___21294]));

var G__21295 = (i__5898__auto___21294 + (1));
i__5898__auto___21294 = G__21295;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$core$IFn$_invoke$arity$variadic = (function (config,groups){
var refs = cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.contracts.sources.source_group__GT_refs,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([groups], 0));
var indexed = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p__21270,source_ref){
var map__21271 = p__21270;
var map__21271__$1 = cljs.core.__destructure_map(map__21271);
var acc = map__21271__$1;
var order = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21271__$1,new cljs.core.Keyword(null,"order","order",-1254677256));
var by_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21271__$1,new cljs.core.Keyword(null,"by-id","by-id",-2129473981));
var temp__5823__auto__ = knoxx.backend.domain.contracts.sources.source_ref_id(source_ref);
if(cljs.core.truth_(temp__5823__auto__)){
var source_id = temp__5823__auto__;
var already_QMARK_ = cljs.core.contains_QMARK_(by_id,source_id);
var spec = ((already_QMARK_)?knoxx.backend.domain.contracts.sources.source_ref_overrides(source_ref):knoxx.backend.domain.contracts.sources.resolve_source_spec(config,source_ref));
if(cljs.core.truth_(spec)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(acc,new cljs.core.Keyword(null,"order","order",-1254677256),((already_QMARK_)?order:cljs.core.conj.cljs$core$IFn$_invoke$arity$2(order,source_id)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"by-id","by-id",-2129473981),cljs.core.update.cljs$core$IFn$_invoke$arity$3(by_id,source_id,(function (p1__21266_SHARP_){
if(cljs.core.truth_(p1__21266_SHARP_)){
return knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([p1__21266_SHARP_,spec], 0));
} else {
return spec;
}
}))], 0));
} else {
return acc;
}
} else {
return acc;
}
}),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"order","order",-1254677256),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"by-id","by-id",-2129473981),cljs.core.PersistentArrayMap.EMPTY], null),refs);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21267_SHARP_){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(indexed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"by-id","by-id",-2129473981),p1__21267_SHARP_], null));
}),new cljs.core.Keyword(null,"order","order",-1254677256).cljs$core$IFn$_invoke$arity$1(indexed));
}));

(knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$lang$applyTo = (function (seq21268){
var G__21269 = cljs.core.first(seq21268);
var seq21268__$1 = cljs.core.next(seq21268);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__21269,seq21268__$1);
}));

knoxx.backend.domain.contracts.sources.agent_source_refs = (function knoxx$backend$domain$contracts$sources$agent_source_refs(agent_spec){
var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"runtime-sources","runtime-sources",1613079145).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"runtimeSources","runtimeSources",919462928).cljs$core$IFn$_invoke$arity$1(agent_spec);
}
}
});
knoxx.backend.domain.contracts.sources.source_specs_for_agent = (function knoxx$backend$domain$contracts$sources$source_specs_for_agent(config,agent_spec){
return knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$core$IFn$_invoke$arity$variadic(config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.sources.agent_source_refs(agent_spec)], 0));
});
knoxx.backend.domain.contracts.sources.find_source = (function knoxx$backend$domain$contracts$sources$find_source(source_specs,source_id){
var wanted = knoxx.backend.domain.contracts.sources.normalize_source_id(source_id);
return cljs.core.some((function (source){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted,knoxx.backend.domain.contracts.sources.source_ref_id(source))){
return source;
} else {
return null;
}
}),knoxx.backend.domain.contracts.sources.source_group__GT_refs(source_specs));
});
knoxx.backend.domain.contracts.sources.source_hydration_options = (function knoxx$backend$domain$contracts$sources$source_hydration_options(source){
return knoxx.backend.domain.contracts.sources.deep_merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("source","hydration","source/hydration",-468770210).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"hydration","hydration",765373051).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"hydrate","hydrate",372087953).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("source","config","source/config",-392505094).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(source)], 0));
});

//# sourceMappingURL=knoxx.backend.domain.contracts.sources.js.map
