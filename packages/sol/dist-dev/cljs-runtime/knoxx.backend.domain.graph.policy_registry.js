import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.graph.expansion_policy.js";
goog.provide('knoxx.backend.domain.graph.policy_registry');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.graph !== 'undefined') && (typeof knoxx.backend.domain.graph.policy_registry !== 'undefined') && (typeof knoxx.backend.domain.graph.policy_registry.registry_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.graph.policy_registry.registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.domain.graph.policy_registry.default_policy_id = new cljs.core.Keyword(null,"default","default",-1987822328);
/**
 * Register a graph expansion policy under a keyword id.
 * 
 * The policy must satisfy IGraphExpansionPolicy. Returns the id.
 */
knoxx.backend.domain.graph.policy_registry.register_policy_BANG_ = (function knoxx$backend$domain$graph$policy_registry$register_policy_BANG_(id,policy){
var pid = knoxx.backend.domain.graph.expansion_policy.normalize_policy_id(id);
if(cljs.core.truth_(pid)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Invalid graph expansion policy id",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),id], null));
}

if(knoxx.backend.domain.graph.expansion_policy.expansion_policy_QMARK_(policy)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Value does not satisfy IGraphExpansionPolicy",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),pid], null));
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.graph.policy_registry.registry_STAR_,cljs.core.assoc,pid,policy);

return pid;
});
/**
 * Look up a registered policy by id, falling back to the default policy.
 * 
 * Always returns a policy satisfying IGraphExpansionPolicy: when neither
 * the requested id nor `:default` is registered, a fresh default policy
 * is returned so callers never need a nil guard.
 */
knoxx.backend.domain.graph.policy_registry.get_policy = (function knoxx$backend$domain$graph$policy_registry$get_policy(var_args){
var G__32120 = arguments.length;
switch (G__32120) {
case 0:
return knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.graph.policy_registry.default_policy_id);
}));

(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$core$IFn$_invoke$arity$1 = (function (id){
var reg = cljs.core.deref(knoxx.backend.domain.graph.policy_registry.registry_STAR_);
var pid = knoxx.backend.domain.graph.expansion_policy.normalize_policy_id(id);
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(reg,pid);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(reg,knoxx.backend.domain.graph.policy_registry.default_policy_id);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.graph.expansion_policy.default_expansion_policy();
}
}
}));

(knoxx.backend.domain.graph.policy_registry.get_policy.cljs$lang$maxFixedArity = 1);

/**
 * Return all registered policy ids.
 */
knoxx.backend.domain.graph.policy_registry.policy_ids = (function knoxx$backend$domain$graph$policy_registry$policy_ids(){
return cljs.core.keys(cljs.core.deref(knoxx.backend.domain.graph.policy_registry.registry_STAR_));
});
/**
 * Initialize the registry with the default expansion policy.
 * 
 * Idempotent and safe to call at every startup / hot reload. Returns the
 * default policy id so callers (and the load-time guard) have a value.
 */
knoxx.backend.domain.graph.policy_registry.init_BANG_ = (function knoxx$backend$domain$graph$policy_registry$init_BANG_(){
return knoxx.backend.domain.graph.policy_registry.register_policy_BANG_(knoxx.backend.domain.graph.policy_registry.default_policy_id,knoxx.backend.domain.graph.expansion_policy.default_expansion_policy());
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.graph !== 'undefined') && (typeof knoxx.backend.domain.graph.policy_registry !== 'undefined') && (typeof knoxx.backend.domain.graph.policy_registry.load_time_default_policy_id !== 'undefined')){
} else {
knoxx.backend.domain.graph.policy_registry.load_time_default_policy_id = knoxx.backend.domain.graph.policy_registry.init_BANG_();
}

//# sourceMappingURL=knoxx.backend.domain.graph.policy_registry.js.map
