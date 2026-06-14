import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.runtime.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.temp_memory.js";
import "./knoxx.backend.shape.agent.js";
import "./knoxx.backend.shape.pipeline.js";
goog.provide('knoxx.backend.domain.action.registry');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.action !== 'undefined') && (typeof knoxx.backend.domain.action.registry !== 'undefined') && (typeof knoxx.backend.domain.action.registry.action_registry_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.action.registry.action_registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Register an action with metadata and handler. Overwrites if already registered.
 * Metadata map keys:
 *   :action/tool        — {:name :description :parameters :risk-level}
 *   :action/events      — {:input :event/type :output :event/type}
 *   :action/scope       — {:actions [:actions/... :actions/...]}
 *   :action/description — human-readable description string
 */
knoxx.backend.domain.action.registry.register_action_BANG_ = (function knoxx$backend$domain$action$registry$register_action_BANG_(action_key,metadata,handler){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.action.registry.action_registry_STAR_,cljs.core.assoc,action_key,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("action","key","action/key",275940467),action_key,new cljs.core.Keyword(null,"metadata","metadata",1799301597),metadata,new cljs.core.Keyword(null,"handler","handler",-195596612),handler], null));
});
/**
 * Return the full action record {:action/key :metadata :handler} for an action key, or nil.
 */
knoxx.backend.domain.action.registry.get_action = (function knoxx$backend$domain$action$registry$get_action(action_key){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.registry.action_registry_STAR_),action_key);
});
/**
 * Return the handler function for an action key, or nil.
 */
knoxx.backend.domain.action.registry.action_handler = (function knoxx$backend$domain$action$registry$action_handler(action_key){
return new cljs.core.Keyword(null,"handler","handler",-195596612).cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.action.registry.get_action(action_key));
});
/**
 * Return the metadata map for an action key, or nil.
 */
knoxx.backend.domain.action.registry.action_metadata = (function knoxx$backend$domain$action$registry$action_metadata(action_key){
return new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.action.registry.get_action(action_key));
});
/**
 * Return the tool metadata map for an action key, or nil.
 * Returns the :action/tool value from the action's metadata.
 */
knoxx.backend.domain.action.registry.get_tool = (function knoxx$backend$domain$action$registry$get_tool(action_key){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.action.registry.get_action(action_key),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword("action","tool","action/tool",-1922631264)], null));
});
/**
 * Return the scope data {:actions [...]} for an action key, or nil.
 */
knoxx.backend.domain.action.registry.get_scope_declaration = (function knoxx$backend$domain$action$registry$get_scope_declaration(action_key){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.action.registry.get_action(action_key),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword("action","scope","action/scope",-1964545544)], null));
});
/**
 * Return the event contract {:input :output} for an action key, or nil.
 */
knoxx.backend.domain.action.registry.get_event_contract = (function knoxx$backend$domain$action$registry$get_event_contract(action_key){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.action.registry.get_action(action_key),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword("action","events","action/events",-634934173)], null));
});
/**
 * Return all registered action keys.
 */
knoxx.backend.domain.action.registry.list_actions = (function knoxx$backend$domain$action$registry$list_actions(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.keys(cljs.core.deref(knoxx.backend.domain.action.registry.action_registry_STAR_))));
});
/**
 * Return action keys that have :action/tool metadata.
 */
knoxx.backend.domain.action.registry.list_tools = (function knoxx$backend$domain$action$registry$list_tools(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.key,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__29514){
var vec__29515 = p__29514;
var _k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29515,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29515,(1),null);
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(v,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.Keyword("action","tool","action/tool",-1922631264)], null));
}),cljs.core.deref(knoxx.backend.domain.action.registry.action_registry_STAR_)))));
});
/**
 * Return the number of registered tools.
 */
knoxx.backend.domain.action.registry.tool_count = (function knoxx$backend$domain$action$registry$tool_count(){
return cljs.core.count(knoxx.backend.domain.action.registry.list_tools());
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.action !== 'undefined') && (typeof knoxx.backend.domain.action.registry !== 'undefined') && (typeof knoxx.backend.domain.action.registry.run_action_BANG_ !== 'undefined')){
} else {
/**
 * Dispatch an action map by :action/kind.
 * 
 * This multimethod is the backward-compatible dispatch path. New actions
 * should prefer `register-action!` with metadata instead of `defmethod`.
 * The multimethod dispatches to registered handlers when available.
 * 
 * Context shape: {:event :scope :actor} plus action-specific keys.
 */
knoxx.backend.domain.action.registry.run_action_BANG_ = (function (){var method_table__5768__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var prefer_table__5769__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var method_cache__5770__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var cached_hierarchy__5771__auto__ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var hierarchy__5772__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"hierarchy","hierarchy",-1053470341),(function (){var fexpr__29524 = cljs.core.get_global_hierarchy;
return (fexpr__29524.cljs$core$IFn$_invoke$arity$0 ? fexpr__29524.cljs$core$IFn$_invoke$arity$0() : fexpr__29524.call(null));
})());
return (new cljs.core.MultiFn(cljs.core.symbol.cljs$core$IFn$_invoke$arity$2("knoxx.backend.domain.action.registry","run-action!"),(function (_ctx,action){
return new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(action);
}),new cljs.core.Keyword(null,"default","default",-1987822328),hierarchy__5772__auto__,method_table__5768__auto__,prefer_table__5769__auto__,method_cache__5770__auto__,cached_hierarchy__5771__auto__));
})();
}
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword(null,"default","default",-1987822328),(function (ctx,action){
var kind = new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(action);
var temp__5823__auto__ = new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(action);
if(cljs.core.truth_(temp__5823__auto__)){
var anon_fn = temp__5823__auto__;
return (anon_fn.cljs$core$IFn$_invoke$arity$2 ? anon_fn.cljs$core$IFn$_invoke$arity$2(ctx,action) : anon_fn.call(null,ctx,action));
} else {
var temp__5823__auto____$1 = knoxx.backend.domain.action.registry.action_handler(kind);
if(cljs.core.truth_(temp__5823__auto____$1)){
var handler = temp__5823__auto____$1;
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(ctx,action) : handler.call(null,ctx,action));
} else {
if(typeof kind === 'string'){
console.warn("[knoxx/actions] string actions are not supported; use a keyword from the action registry. Got:",kind);
} else {
console.warn("[knoxx/actions] unknown action/kind",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([kind], 0)));
}

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"unknown action/kind",new cljs.core.Keyword("action","kind","action/kind",-2113018193),kind], null));
}
}
}));
/**
 * Resolve an action's scope declaration into a map of action-key -> bound-fn.
 * Phase 1: flat resolution only (direct references, no transitive walk).
 */
knoxx.backend.domain.action.registry.resolve_scope = (function knoxx$backend$domain$action$registry$resolve_scope(action_key){
var scope_decl = knoxx.backend.domain.action.registry.get_scope_declaration(action_key);
var action_keys = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actions","actions",-812656882).cljs$core$IFn$_invoke$arity$1(scope_decl);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (k){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,(function (ctx,action){
return knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,action);
})], null);
})),action_keys);
});
/**
 * Build an action map from a normalized trigger contract.
 * :trigger/with is the sole argument mechanism — it becomes :action/with.
 * Composite resources may carry an inline :action/fn and an :action/scope;
 * the action interpreter reads those keys from the raw resource entry.
 */
knoxx.backend.domain.action.registry.action_map = (function knoxx$backend$domain$action$registry$action_map(trigger){
var kind = new cljs.core.Keyword("trigger","action","trigger/action",-326545728).cljs$core$IFn$_invoke$arity$1(trigger);
var raw = new cljs.core.Keyword("trigger","raw","trigger/raw",510155600).cljs$core$IFn$_invoke$arity$1(trigger);
var G__29554 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("action","id","action/id",241708030),(((kind instanceof cljs.core.Keyword))?cljs.core.name(kind):null),new cljs.core.Keyword("action","kind","action/kind",-2113018193),kind,new cljs.core.Keyword("action","with","action/with",-243371526),(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","with","trigger/with",-450753924).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
var G__29554__$1 = (((!((new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(raw) == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29554,new cljs.core.Keyword("action","fn","action/fn",1260609098),new cljs.core.Keyword("action","fn","action/fn",1260609098).cljs$core$IFn$_invoke$arity$1(raw)):G__29554);
if((!((new cljs.core.Keyword("action","scope","action/scope",-1964545544).cljs$core$IFn$_invoke$arity$1(raw) == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29554__$1,new cljs.core.Keyword("action","scope","action/scope",-1964545544),new cljs.core.Keyword("action","scope","action/scope",-1964545544).cljs$core$IFn$_invoke$arity$1(raw));
} else {
return G__29554__$1;
}
});
knoxx.backend.domain.action.registry.nonblank = (function knoxx$backend$domain$action$registry$nonblank(value){
var G__29583 = value;
var G__29583__$1 = (((G__29583 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29583)));
var G__29583__$2 = (((G__29583__$1 == null))?null:clojure.string.trim(G__29583__$1));
if((G__29583__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29583__$2);
}
});
knoxx.backend.domain.action.registry.payload_value = (function knoxx$backend$domain$action$registry$payload_value(event,k){
var payload = new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event);
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,k);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(cljs.core.name(k)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(payload,cljs.core.name(k));
}
}
});
knoxx.backend.domain.action.registry.hello_world_message = (function knoxx$backend$domain$action$registry$hello_world_message(ctx,action){
var event = new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(ctx);
var name = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"name","name",1843675177)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"sender","sender",1557303285)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "world";
}
}
})();
var time_of_day = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"time-of-day","time-of-day",818028748)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"timeOfDay","timeOfDay",1431214623)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.action.registry.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"time-of-day","time-of-day",818028748)], null)));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "day";
}
}
}
})();
var actor_name = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"actor-name","actor-name",1773998268)], null)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.registry.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Knoxx";
}
}
})();
return (""+"Hello, "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)+"! "+"I hope you are having a good "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(time_of_day)+". "+"My name is "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_name)+".");
});
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("invoke","noop","invoke/noop",-2130054978),(function (_,___$1){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("invoke","noop","invoke/noop",-2130054978)], null));
}));
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("actions","noop","actions/noop",-2103970749),(function (_,___$1){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","noop","actions/noop",-2103970749)], null));
}));
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("actions","hello-world","actions/hello-world",641811614),(function (ctx,action){
var event = new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(ctx);
var recipient = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"recipient","recipient",1650072234)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"sender","sender",1557303285)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.action.registry.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
}
}
})();
var sender = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "knoxx";
}
})();
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","id","action/id",241708030),new cljs.core.Keyword("action","id","action/id",241708030).cljs$core$IFn$_invoke$arity$1(action),new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","hello-world","actions/hello-world",641811614),new cljs.core.Keyword("action","result","action/result",-1146218855),new cljs.core.Keyword("message","send.expectation","message/send.expectation",-1842294963),new cljs.core.Keyword("event","id","event/id",-1282332774),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword("event","type","event/type",1532247862),new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword("message","send","message/send",-2110392641),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sender","sender",1557303285),sender,new cljs.core.Keyword(null,"recipient","recipient",1650072234),recipient,new cljs.core.Keyword(null,"text","text",-1790561697),knoxx.backend.domain.action.registry.hello_world_message(ctx,action)], null)], null));
}));
/**
 * Execute a sequence of actions from scope. Steps are pre-ordered.
 * Each step is {:action :actions/... :with {...}}.
 * Stops on first error, resolves with {:ok false :error ... :failed-step ...}.
 */
knoxx.backend.domain.action.registry.run_steps_handler = (async function knoxx$backend$domain$action$registry$run_steps_handler(ctx,action){
var steps = (await (async function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"steps","steps",-128433302)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var output_cfg = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"output","output",-1105869043)], null));
var remaining = steps;
var idx = (0);
var last_result = null;
while(true){
if(cljs.core.empty_QMARK_(remaining)){
if(cljs.core.truth_(output_cfg)){
(await knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(output_cfg),last_result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ttl","ttl",-1115275118),new cljs.core.Keyword(null,"ttl","ttl",-1115275118).cljs$core$IFn$_invoke$arity$1(output_cfg)], null)], 0)));
} else {
}

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","run-steps","actions/run-steps",1352154374),new cljs.core.Keyword(null,"steps-run","steps-run",1066029943),idx,new cljs.core.Keyword(null,"result","result",1415092211),last_result], null);
} else {
var step = cljs.core.first(remaining);
var step_action_key = new cljs.core.Keyword(null,"action","action",-811238024).cljs$core$IFn$_invoke$arity$1(step);
var step_with = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"with","with",-1536296876).cljs$core$IFn$_invoke$arity$1(step);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var handler = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scope","scope",-439358418),step_action_key], null));
if(cljs.core.not(handler)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+"Action "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(step_action_key)+" not found in scope"),new cljs.core.Keyword(null,"failed-step","failed-step",-1169689252),idx,new cljs.core.Keyword(null,"failed-action","failed-action",1213068758),step_action_key], null);
} else {
var resolved_temps = (await knoxx.backend.infra.temp_memory.resolve_temps(step_with));
var interpolated = knoxx.backend.shape.pipeline.interpolate_map(step_with,resolved_temps);
var step_action = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("action","kind","action/kind",-2113018193),step_action_key,new cljs.core.Keyword("action","with","action/with",-243371526),interpolated], null);
var result = (await (async function (){try{return (await (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(ctx,step_action) : handler.call(null,ctx,step_action)));
}catch (e29631){var err = e29631;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null);
}})());
if(((cljs.core.map_QMARK_(result)) && (new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(result) === false))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"failed-step","failed-step",-1169689252),idx,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"failed-action","failed-action",1213068758),step_action_key], 0));
} else {
var G__29675 = cljs.core.rest(remaining);
var G__29676 = (idx + (1));
var G__29677 = result;
remaining = G__29675;
idx = G__29676;
last_result = G__29677;
continue;
}
}
}
break;
}
});
/**
 * Steer or follow-up an active agent session. Parameterized by :kind.
 */
knoxx.backend.domain.action.registry.agent_control_handler = (async function knoxx$backend$domain$action$registry$agent_control_handler(ctx,action){
var kind = (await (async function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"kind","kind",-717265803)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "steer";
}
})());
var conversation_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("event","payload","event/payload",242016970),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("event","payload","event/payload",242016970),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980)], null));
}
}
})());
var message = (await (async function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"message","message",-406056002)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("event","payload","event/payload",242016970),new cljs.core.Keyword(null,"content","content",15833224)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("event","payload","event/payload",242016970),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})());
var session = knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
if(cljs.core.truth_(session)){
} else {
throw (new Error("No active session for conversation"));
}

if(cljs.core.truth_(knoxx.backend.shape.agent.streaming_QMARK_(session))){
} else {
throw (new Error("No active running turn is available for live controls"));
}

var session_id = (await (async function (){var G__29644 = session;
if((G__29644 == null)){
return null;
} else {
return G__29644.sessionId;
}
})());
var run_id = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(ctx,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("event","id","event/id",-1282332774)], null));
return (await knoxx.backend.infra.agent.runtime.queue_agent_control_BANG_(null,null,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"message","message",-406056002),message,new cljs.core.Keyword(null,"kind","kind",-717265803),kind], null)));
});
knoxx.backend.domain.action.registry.register_action_BANG_(new cljs.core.Keyword("actions","noop","actions/noop",-2103970749),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("action","description","action/description",-1748671578),"No-op action. Succeeds immediately."], null),(function (_ctx,_action){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","noop","actions/noop",-2103970749)], null));
}));
knoxx.backend.domain.action.registry.register_action_BANG_(new cljs.core.Keyword("invoke","noop","invoke/noop",-2130054978),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("action","description","action/description",-1748671578),"Legacy no-op action. Succeeds immediately."], null),(function (_ctx,_action){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("invoke","noop","invoke/noop",-2130054978)], null));
}));
knoxx.backend.domain.action.registry.register_action_BANG_(new cljs.core.Keyword("actions","hello-world","actions/hello-world",641811614),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("action","description","action/description",-1748671578),"Produce a greeting message. Used for testing and demos.",new cljs.core.Keyword("action","tool","action/tool",-1922631264),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"hello.world",new cljs.core.Keyword(null,"description","description",-1428560544),"Produce a greeting message",new cljs.core.Keyword(null,"parameters","parameters",-1229919748),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time-of-day","time-of-day",818028748),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.Keyword(null,"risk-level","risk-level",658496607),"low"], null),new cljs.core.Keyword("action","events","action/events",-634934173),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"input","input",556931961),new cljs.core.Keyword("message","greeting","message/greeting",-497552588),new cljs.core.Keyword(null,"output","output",-1105869043),new cljs.core.Keyword("message","send.expectation","message/send.expectation",-1842294963)], null),new cljs.core.Keyword("action","scope","action/scope",-1964545544),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"actions","actions",-812656882),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("actions","noop","actions/noop",-2103970749)], null)], null)], null),(function (ctx,action){
var event = new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(ctx);
var recipient = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"recipient","recipient",1650072234)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.action.registry.nonblank(knoxx.backend.domain.action.registry.payload_value(event,new cljs.core.Keyword(null,"sender","sender",1557303285)));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.action.registry.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
}
}
})();
var sender = (function (){var or__5162__auto__ = knoxx.backend.domain.action.registry.nonblank(new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(ctx));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "knoxx";
}
})();
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword("action","id","action/id",241708030),new cljs.core.Keyword("action","id","action/id",241708030).cljs$core$IFn$_invoke$arity$1(action),new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","hello-world","actions/hello-world",641811614),new cljs.core.Keyword("action","result","action/result",-1146218855),new cljs.core.Keyword("message","send.expectation","message/send.expectation",-1842294963),new cljs.core.Keyword("event","id","event/id",-1282332774),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword("event","type","event/type",1532247862),new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword("message","send","message/send",-2110392641),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sender","sender",1557303285),sender,new cljs.core.Keyword(null,"recipient","recipient",1650072234),recipient,new cljs.core.Keyword(null,"text","text",-1790561697),knoxx.backend.domain.action.registry.hello_world_message(ctx,action)], null)], null));
}));
knoxx.backend.domain.action.registry.register_action_BANG_(new cljs.core.Keyword("actions","run-steps","actions/run-steps",1352154374),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("action","description","action/description",-1748671578),"Execute a sequence of actions from scope.",new cljs.core.Keyword("action","tool","action/tool",-1922631264),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"run.steps",new cljs.core.Keyword(null,"description","description",-1428560544),"Execute a sequence of actions",new cljs.core.Keyword(null,"parameters","parameters",-1229919748),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"steps","steps",-128433302),new cljs.core.Keyword(null,"vector","vector",1902966158)], null)], null),new cljs.core.Keyword(null,"risk-level","risk-level",658496607),"medium"], null),new cljs.core.Keyword("action","events","action/events",-634934173),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"input","input",556931961),new cljs.core.Keyword("actions.run-steps","request","actions.run-steps/request",-1605528033),new cljs.core.Keyword(null,"output","output",-1105869043),new cljs.core.Keyword("actions.run-steps","complete","actions.run-steps/complete",684595853)], null),new cljs.core.Keyword("action","scope","action/scope",-1964545544),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"actions","actions",-812656882),cljs.core.PersistentVector.EMPTY], null)], null),knoxx.backend.domain.action.registry.run_steps_handler);
knoxx.backend.domain.action.registry.register_action_BANG_(new cljs.core.Keyword("actions","agent-control","actions/agent-control",478497127),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword("action","description","action/description",-1748671578),"Steer or follow-up on an active agent session. Parameterized by :kind (\"steer\" or \"follow_up\").",new cljs.core.Keyword("action","tool","action/tool",-1922631264),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),"agent.control",new cljs.core.Keyword(null,"description","description",-1428560544),"Steer or follow-up an active agent session",new cljs.core.Keyword(null,"parameters","parameters",-1229919748),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"steer","follow_up"], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.Keyword(null,"risk-level","risk-level",658496607),"medium"], null),new cljs.core.Keyword("action","events","action/events",-634934173),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"input","input",556931961),new cljs.core.Keyword("agent.control","request","agent.control/request",-1448785953),new cljs.core.Keyword(null,"output","output",-1105869043),new cljs.core.Keyword("agent.control","complete","agent.control/complete",570724557)], null),new cljs.core.Keyword("action","scope","action/scope",-1964545544),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"actions","actions",-812656882),cljs.core.PersistentVector.EMPTY], null)], null),knoxx.backend.domain.action.registry.agent_control_handler);

//# sourceMappingURL=knoxx.backend.domain.action.registry.js.map
