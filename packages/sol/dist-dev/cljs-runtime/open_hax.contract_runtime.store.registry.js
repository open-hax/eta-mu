import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contract_runtime.store.memory.js";
goog.provide('open_hax.contract_runtime.store.registry');
if((typeof open_hax !== 'undefined') && (typeof open_hax.contract_runtime !== 'undefined') && (typeof open_hax.contract_runtime.store !== 'undefined') && (typeof open_hax.contract_runtime.store.registry !== 'undefined') && (typeof open_hax.contract_runtime.store.registry.stores_STAR_ !== 'undefined')){
} else {
open_hax.contract_runtime.store.registry.stores_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Register a store instance under its qualified id. Returns the store.
 */
open_hax.contract_runtime.store.registry.register_store_BANG_ = (function open_hax$contract_runtime$store$registry$register_store_BANG_(store_id,store){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(open_hax.contract_runtime.store.registry.stores_STAR_,cljs.core.assoc,store_id,store);

return store;
});
/**
 * Return the registered store instance for an id, or nil.
 */
open_hax.contract_runtime.store.registry.registered_store = (function open_hax$contract_runtime$store$registry$registered_store(store_id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(open_hax.contract_runtime.store.registry.stores_STAR_),store_id);
});
/**
 * Return all registered store ids.
 */
open_hax.contract_runtime.store.registry.store_ids = (function open_hax$contract_runtime$store$registry$store_ids(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.keys(cljs.core.deref(open_hax.contract_runtime.store.registry.stores_STAR_))));
});
/**
 * Drop all registered store instances. Test escape hatch.
 */
open_hax.contract_runtime.store.registry.reset_stores_BANG_ = (function open_hax$contract_runtime$store$registry$reset_stores_BANG_(){
return cljs.core.reset_BANG_(open_hax.contract_runtime.store.registry.stores_STAR_,cljs.core.PersistentArrayMap.EMPTY);
});
open_hax.contract_runtime.store.registry.id_str = (function open_hax$contract_runtime$store$registry$id_str(store_id){
if((store_id instanceof cljs.core.Keyword)){
return cljs.core.subs.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(store_id)),(1));
} else {
if((!((store_id == null)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(store_id));
} else {
return null;
}
}
});
open_hax.contract_runtime.store.registry.store_definition = (function open_hax$contract_runtime$store$registry$store_definition(config,store_id){
var map__22290 = new cljs.core.Keyword("contract-runtime","deps","contract-runtime/deps",1088243236).cljs$core$IFn$_invoke$arity$1(config);
var map__22290__$1 = cljs.core.__destructure_map(map__22290);
var load_resources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22290__$1,new cljs.core.Keyword(null,"load-resources","load-resources",2061423403));
return cljs.core.some((function (definition){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(store_id,new cljs.core.Keyword("resource","qualified-id","resource/qualified-id",341105296).cljs$core$IFn$_invoke$arity$1(definition))) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(store_id,new cljs.core.Keyword("store","id","store/id",-1277972109).cljs$core$IFn$_invoke$arity$1(definition))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.store.registry.id_str(store_id),new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(definition))))))){
return definition;
} else {
return null;
}
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","definition","resource/definition",-1547661004),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__22288_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"store","store",1512230022),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(p1__22288_SHARP_));
}),(load_resources.cljs$core$IFn$_invoke$arity$1 ? load_resources.cljs$core$IFn$_invoke$arity$1(config) : load_resources.call(null,config)))));
});
/**
 * Resolve a store instance by id, instantiating a memory-backed store from
 * its resource definition on first use. Returns nil when no store resource
 * declares the id.
 */
open_hax.contract_runtime.store.registry.get_store_BANG_ = (function open_hax$contract_runtime$store$registry$get_store_BANG_(config,store_id){
var or__5162__auto__ = open_hax.contract_runtime.store.registry.registered_store(store_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var temp__5825__auto__ = open_hax.contract_runtime.store.registry.store_definition(config,store_id);
if(cljs.core.truth_(temp__5825__auto__)){
var definition = temp__5825__auto__;
return open_hax.contract_runtime.store.registry.register_store_BANG_(store_id,open_hax.contract_runtime.store.memory.memory_collection(definition));
} else {
return null;
}
}
});

//# sourceMappingURL=open_hax.contract_runtime.store.registry.js.map
