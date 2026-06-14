import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contract_runtime.action.anonymous.js";
goog.provide('open_hax.contract_runtime.action.interpreter');
/**
 * Extract contract-runtime dependency functions from config.
 */
open_hax.contract_runtime.action.interpreter.deps = (function open_hax$contract_runtime$action$interpreter$deps(config){
return new cljs.core.Keyword("contract-runtime","deps","contract-runtime/deps",1088243236).cljs$core$IFn$_invoke$arity$1(config);
});
/**
 * Resolve an :action/scope declaration {:actions [...] :filters [...]
 * :stores [...]} into a flat scope map keyed by the declared ids.
 */
open_hax.contract_runtime.action.interpreter.resolve_scope_decl = (function open_hax$contract_runtime$action$interpreter$resolve_scope_decl(config,scope_decl){
var map__22904 = open_hax.contract_runtime.action.interpreter.deps(config);
var map__22904__$1 = cljs.core.__destructure_map(map__22904);
var run_action_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22904__$1,new cljs.core.Keyword(null,"run-action!","run-action!",-814564479));
var filter_fn = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22904__$1,new cljs.core.Keyword(null,"filter-fn","filter-fn",1689475675));
var get_store = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22904__$1,new cljs.core.Keyword(null,"get-store","get-store",-1957650510));
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (action_key){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [action_key,(function (ctx,action){
return (run_action_BANG_.cljs$core$IFn$_invoke$arity$2 ? run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action) : run_action_BANG_.call(null,ctx,action));
})], null);
})),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actions","actions",-812656882).cljs$core$IFn$_invoke$arity$1(scope_decl);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (filter_id){
var temp__5825__auto__ = (filter_fn.cljs$core$IFn$_invoke$arity$1 ? filter_fn.cljs$core$IFn$_invoke$arity$1(filter_id) : filter_fn.call(null,filter_id));
if(cljs.core.truth_(temp__5825__auto__)){
var f = temp__5825__auto__;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [filter_id,f], null);
} else {
return null;
}
})),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filters","filters",974726919).cljs$core$IFn$_invoke$arity$1(scope_decl);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (store_id){
var temp__5825__auto__ = (get_store.cljs$core$IFn$_invoke$arity$2 ? get_store.cljs$core$IFn$_invoke$arity$2(config,store_id) : get_store.call(null,config,store_id));
if(cljs.core.truth_(temp__5825__auto__)){
var store = temp__5825__auto__;
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [store_id,store], null);
} else {
return null;
}
})),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"stores","stores",1203804823).cljs$core$IFn$_invoke$arity$1(scope_decl);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], 0));
});
open_hax.contract_runtime.action.interpreter.with_scope = (function open_hax$contract_runtime$action$interpreter$with_scope(ctx,action){
var map__22921 = open_hax.contract_runtime.action.interpreter.deps(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(ctx));
var map__22921__$1 = cljs.core.__destructure_map(map__22921);
var get_scope_declaration = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22921__$1,new cljs.core.Keyword(null,"get-scope-declaration","get-scope-declaration",1952167348));
var scope_decl = (function (){var or__5162__auto__ = new cljs.core.Keyword("action","scope","action/scope",-1964545544).cljs$core$IFn$_invoke$arity$1(action);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__22923 = new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(action);
return (get_scope_declaration.cljs$core$IFn$_invoke$arity$1 ? get_scope_declaration.cljs$core$IFn$_invoke$arity$1(G__22923) : get_scope_declaration.call(null,G__22923));
}
})();
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(ctx,new cljs.core.Keyword(null,"scope","scope",-439358418),open_hax.contract_runtime.action.interpreter.resolve_scope_decl(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(ctx),scope_decl));
});
open_hax.contract_runtime.action.interpreter.known_kind_QMARK_ = (function open_hax$contract_runtime$action$interpreter$known_kind_QMARK_(config,kind){
var map__22933 = open_hax.contract_runtime.action.interpreter.deps(config);
var map__22933__$1 = cljs.core.__destructure_map(map__22933);
var get_action = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22933__$1,new cljs.core.Keyword(null,"get-action","get-action",2039230544));
var run_action_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22933__$1,new cljs.core.Keyword(null,"run-action!","run-action!",-814564479));
return cljs.core.boolean$((function (){var or__5162__auto__ = (get_action.cljs$core$IFn$_invoke$arity$1 ? get_action.cljs$core$IFn$_invoke$arity$1(kind) : get_action.call(null,kind));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return false;
}
})());
});
/**
 * Find an enabled action resource definition whose id matches an action kind.
 */
open_hax.contract_runtime.action.interpreter.action_resource = (function open_hax$contract_runtime$action$interpreter$action_resource(config,kind){
if(cljs.core.truth_((function (){var and__5160__auto__ = config;
if(cljs.core.truth_(and__5160__auto__)){
return (kind instanceof cljs.core.Keyword);
} else {
return and__5160__auto__;
}
})())){
var map__22940 = open_hax.contract_runtime.action.interpreter.deps(config);
var map__22940__$1 = cljs.core.__destructure_map(map__22940);
var load_resources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22940__$1,new cljs.core.Keyword(null,"load-resources","load-resources",2061423403));
return cljs.core.some((function (definition){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword("action","id","action/id",241708030).cljs$core$IFn$_invoke$arity$1(definition))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword("resource","qualified-id","resource/qualified-id",341105296).cljs$core$IFn$_invoke$arity$1(definition))))){
return definition;
} else {
return null;
}
}),cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__22939_SHARP_){
return new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(p1__22939_SHARP_) === false;
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","definition","resource/definition",-1547661004),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__22938_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(p1__22938_SHARP_));
}),(load_resources.cljs$core$IFn$_invoke$arity$1 ? load_resources.cljs$core$IFn$_invoke$arity$1(config) : load_resources.call(null,config))))));
} else {
return null;
}
});
open_hax.contract_runtime.action.interpreter.expand_action_resource = (function open_hax$contract_runtime$action$interpreter$expand_action_resource(action,definition){
var G__22942 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(action,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(definition),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("action","with","action/with",-243371526),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("action","with","action/with",-243371526).cljs$core$IFn$_invoke$arity$1(definition),new cljs.core.Keyword("action","with","action/with",-243371526).cljs$core$IFn$_invoke$arity$1(action)], 0))], 0));
var G__22942__$1 = (cljs.core.truth_(new cljs.core.Keyword("action","scope","action/scope",-1964545544).cljs$core$IFn$_invoke$arity$1(definition))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22942,new cljs.core.Keyword("action","scope","action/scope",-1964545544),new cljs.core.Keyword("action","scope","action/scope",-1964545544).cljs$core$IFn$_invoke$arity$1(definition)):G__22942);
if(cljs.core.truth_(new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(definition))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__22942__$1,new cljs.core.Keyword("action","fn","action/fn",1260609098),new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(definition));
} else {
return G__22942__$1;
}
});
/**
 * Execute the action facet of a resource with scope injected into ctx.
 * Returns a Promise of the action result.
 */
open_hax.contract_runtime.action.interpreter.execute_BANG_ = (function open_hax$contract_runtime$action$interpreter$execute_BANG_(var_args){
var G__22944 = arguments.length;
switch (G__22944) {
case 2:
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (ctx,action){
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,action,(1));
}));

(open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (ctx,action,redirects){
var temp__5823__auto__ = (function (){var G__22948 = new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(action);
if((G__22948 == null)){
return null;
} else {
return open_hax.contract_runtime.action.anonymous.compile_action_fn(G__22948);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var inline = temp__5823__auto__;
return Promise.resolve((function (){var G__22949 = open_hax.contract_runtime.action.interpreter.with_scope(ctx,action);
var G__22950 = action;
return (inline.cljs$core$IFn$_invoke$arity$2 ? inline.cljs$core$IFn$_invoke$arity$2(G__22949,G__22950) : inline.call(null,G__22949,G__22950));
})());
} else {
var map__22951 = open_hax.contract_runtime.action.interpreter.deps(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(ctx));
var map__22951__$1 = cljs.core.__destructure_map(map__22951);
var run_action_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22951__$1,new cljs.core.Keyword(null,"run-action!","run-action!",-814564479));
var get_action = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22951__$1,new cljs.core.Keyword(null,"get-action","get-action",2039230544));
var kind = new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(action);
if(cljs.core.truth_((get_action.cljs$core$IFn$_invoke$arity$1 ? get_action.cljs$core$IFn$_invoke$arity$1(kind) : get_action.call(null,kind)))){
var G__22952 = open_hax.contract_runtime.action.interpreter.with_scope(ctx,action);
var G__22953 = action;
return (run_action_BANG_.cljs$core$IFn$_invoke$arity$2 ? run_action_BANG_.cljs$core$IFn$_invoke$arity$2(G__22952,G__22953) : run_action_BANG_.call(null,G__22952,G__22953));
} else {
if((redirects > (0))){
var temp__5823__auto____$1 = open_hax.contract_runtime.action.interpreter.action_resource(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(ctx),kind);
if(cljs.core.truth_(temp__5823__auto____$1)){
var definition = temp__5823__auto____$1;
return open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$core$IFn$_invoke$arity$3(ctx,open_hax.contract_runtime.action.interpreter.expand_action_resource(action,definition),(redirects - (1)));
} else {
return (run_action_BANG_.cljs$core$IFn$_invoke$arity$2 ? run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action) : run_action_BANG_.call(null,ctx,action));
}
} else {
return (run_action_BANG_.cljs$core$IFn$_invoke$arity$2 ? run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action) : run_action_BANG_.call(null,ctx,action));

}
}
}
}));

(open_hax.contract_runtime.action.interpreter.execute_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=open_hax.contract_runtime.action.interpreter.js.map
