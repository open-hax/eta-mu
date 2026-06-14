import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('open_hax.contract_runtime.filter.registry');
if((typeof open_hax !== 'undefined') && (typeof open_hax.contract_runtime !== 'undefined') && (typeof open_hax.contract_runtime.filter !== 'undefined') && (typeof open_hax.contract_runtime.filter.registry !== 'undefined') && (typeof open_hax.contract_runtime.filter.registry.registry_STAR_ !== 'undefined')){
} else {
open_hax.contract_runtime.filter.registry.registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Register a pure filter function under a namespaced keyword id.
 */
open_hax.contract_runtime.filter.registry.register_filter_BANG_ = (function open_hax$contract_runtime$filter$registry$register_filter_BANG_(id,f){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(open_hax.contract_runtime.filter.registry.registry_STAR_,cljs.core.assoc,id,f);
});
/**
 * Look up a filter function by id. Returns nil if not found.
 */
open_hax.contract_runtime.filter.registry.filter_fn = (function open_hax$contract_runtime$filter$registry$filter_fn(id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(open_hax.contract_runtime.filter.registry.registry_STAR_),id);
});
/**
 * Return all registered filter ids.
 */
open_hax.contract_runtime.filter.registry.filter_ids = (function open_hax$contract_runtime$filter$registry$filter_ids(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.keys(cljs.core.deref(open_hax.contract_runtime.filter.registry.registry_STAR_))));
});
open_hax.contract_runtime.filter.registry.register_filter_BANG_(new cljs.core.Keyword("vector","exclude-shared","vector/exclude-shared",1709253946),(function() {
var open_hax$contract_runtime$filter$registry$exclude_shared = null;
var open_hax$contract_runtime$filter$registry$exclude_shared__2 = (function (candidates,seen){
return open_hax$contract_runtime$filter$registry$exclude_shared.cljs$core$IFn$_invoke$arity$3(candidates,seen,new cljs.core.Keyword(null,"id","id",-1388402092));
});
var open_hax$contract_runtime$filter$registry$exclude_shared__3 = (function (candidates,seen,identity_key){
var seen_ids = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(identity_key),seen);
return cljs.core.filterv((function (p1__22215_SHARP_){
return (!(cljs.core.contains_QMARK_(seen_ids,(identity_key.cljs$core$IFn$_invoke$arity$1 ? identity_key.cljs$core$IFn$_invoke$arity$1(p1__22215_SHARP_) : identity_key.call(null,p1__22215_SHARP_)))));
}),candidates);
});
open_hax$contract_runtime$filter$registry$exclude_shared = function(candidates,seen,identity_key){
switch(arguments.length){
case 2:
return open_hax$contract_runtime$filter$registry$exclude_shared__2.call(this,candidates,seen);
case 3:
return open_hax$contract_runtime$filter$registry$exclude_shared__3.call(this,candidates,seen,identity_key);
}
throw(new Error('Invalid arity: ' + arguments.length));
};
open_hax$contract_runtime$filter$registry$exclude_shared.cljs$core$IFn$_invoke$arity$2 = open_hax$contract_runtime$filter$registry$exclude_shared__2;
open_hax$contract_runtime$filter$registry$exclude_shared.cljs$core$IFn$_invoke$arity$3 = open_hax$contract_runtime$filter$registry$exclude_shared__3;
return open_hax$contract_runtime$filter$registry$exclude_shared;
})()
);

//# sourceMappingURL=open_hax.contract_runtime.filter.registry.js.map
