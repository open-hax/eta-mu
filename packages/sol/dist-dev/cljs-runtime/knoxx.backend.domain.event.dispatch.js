import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.set.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.action.interpreter.js";
import "./knoxx.backend.domain.action.registry.js";
import "./knoxx.backend.domain.action.start_agent_session.js";
import "./knoxx.backend.domain.action.run_pipeline.js";
import "./knoxx.backend.domain.condition.registry.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.domain.event.normalize.js";
import "./knoxx.backend.domain.resources.loader.js";
import "./knoxx.backend.domain.trigger.normalize.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.domain.models.js";
goog.provide('knoxx.backend.domain.event.dispatch');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.event !== 'undefined') && (typeof knoxx.backend.domain.event.dispatch !== 'undefined') && (typeof knoxx.backend.domain.event.dispatch.dispatched_event_ids_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.event.dispatch.dispatched_event_ids_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.event !== 'undefined') && (typeof knoxx.backend.domain.event.dispatch !== 'undefined') && (typeof knoxx.backend.domain.event.dispatch.recent_events_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.event.dispatch.recent_events_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
knoxx.backend.domain.event.dispatch.cfg = (function knoxx$backend$domain$event$dispatch$cfg(){
return knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg());
});
knoxx.backend.domain.event.dispatch.nonblank = (function knoxx$backend$domain$event$dispatch$nonblank(value){
var G__30434 = value;
var G__30434__$1 = (((G__30434 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__30434)));
var G__30434__$2 = (((G__30434__$1 == null))?null:clojure.string.trim(G__30434__$1));
if((G__30434__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__30434__$2);
}
});
knoxx.backend.domain.event.dispatch.append_recent_event_BANG_ = (function knoxx$backend$domain$event$dispatch$append_recent_event_BANG_(event){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.event.dispatch.recent_events_STAR_,(function (events){
return cljs.core.vec(cljs.core.take_last((30),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(events),event)));
}));
});
knoxx.backend.domain.event.dispatch.mark_event_dispatched_BANG_ = (function knoxx$backend$domain$event$dispatch$mark_event_dispatched_BANG_(event_id){
var vec__30443 = cljs.core.swap_vals_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.event.dispatch.dispatched_event_ids_STAR_,cljs.core.conj,event_id);
var before = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30443,(0),null);
return (!(cljs.core.contains_QMARK_(before,event_id)));
});
knoxx.backend.domain.event.dispatch.load_trigger_resources = (function knoxx$backend$domain$event$dispatch$load_trigger_resources(config){
var all_resources = knoxx.backend.domain.resources.loader.load_all_resources_sync(config);
var trigger_resources = cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30453_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(p1__30453_SHARP_));
}),all_resources);
var trigger_defs = cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","definition","resource/definition",-1547661004),trigger_resources);
console.log("[event-dispatch] load-trigger-resources: all=",cljs.core.count(all_resources)," triggers=",cljs.core.count(trigger_resources)," defs=",cljs.core.count(trigger_defs)," kinds=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.take.cljs$core$IFn$_invoke$arity$2((5),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),all_resources))], 0))," sample=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.take.cljs$core$IFn$_invoke$arity$2((1),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","id","resource/id",-822839770),trigger_resources))], 0)));

return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,trigger_defs));
});
/**
 * True if the trigger's emitter matches the event's actor.
 */
knoxx.backend.domain.event.dispatch.emitter_matches_QMARK_ = (function knoxx$backend$domain$event$dispatch$emitter_matches_QMARK_(trigger,event){
var trigger_emitter = knoxx.backend.domain.event.dispatch.nonblank(new cljs.core.Keyword("trigger","emitter","trigger/emitter",709036161).cljs$core$IFn$_invoke$arity$1(trigger));
var event_actor = knoxx.backend.domain.event.dispatch.nonblank(new cljs.core.Keyword("event","actor","event/actor",-1927656555).cljs$core$IFn$_invoke$arity$1(event));
return (((trigger_emitter == null)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(trigger_emitter,event_actor)));
});
knoxx.backend.domain.event.dispatch.event_type_matches_QMARK_ = (function knoxx$backend$domain$event$dispatch$event_type_matches_QMARK_(trigger,event){
var trigger_types = cljs.core.set(new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(trigger));
return ((cljs.core.seq(trigger_types)) && (cljs.core.seq(clojure.set.intersection.cljs$core$IFn$_invoke$arity$2(trigger_types,cljs.core.set(new cljs.core.Keyword("event","types","event/types",753963593).cljs$core$IFn$_invoke$arity$1(event))))));
});
/**
 * Evaluate the trigger's condition expression against the event.
 *   If no condition, then true.
 *   
 */
knoxx.backend.domain.event.dispatch.condition_matches_QMARK_ = (function knoxx$backend$domain$event$dispatch$condition_matches_QMARK_(trigger,event){
var temp__5823__auto__ = new cljs.core.Keyword("trigger","condition","trigger/condition",-1567761332).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(temp__5823__auto__)){
var expr = temp__5823__auto__;
return (knoxx.backend.domain.condition.registry.evaluate.cljs$core$IFn$_invoke$arity$5 ? knoxx.backend.domain.condition.registry.evaluate.cljs$core$IFn$_invoke$arity$5(expr,event,null,trigger,null) : knoxx.backend.domain.condition.registry.evaluate.call(null,expr,event,null,trigger,null));
} else {
return true;
}
});
knoxx.backend.domain.event.dispatch.trigger_matches_QMARK_ = (function knoxx$backend$domain$event$dispatch$trigger_matches_QMARK_(trigger,event){
var and__5160__auto__ = new cljs.core.Keyword("trigger","enabled?","trigger/enabled?",1716230423).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(trigger));
if(and__5160__auto____$1){
var and__5160__auto____$2 = knoxx.backend.domain.event.dispatch.event_type_matches_QMARK_(trigger,event);
if(and__5160__auto____$2){
var and__5160__auto____$3 = knoxx.backend.domain.event.dispatch.emitter_matches_QMARK_(trigger,event);
if(and__5160__auto____$3){
return knoxx.backend.domain.event.dispatch.condition_matches_QMARK_(trigger,event);
} else {
return and__5160__auto____$3;
}
} else {
return and__5160__auto____$2;
}
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
knoxx.backend.domain.event.dispatch.actor_context = (function knoxx$backend$domain$event$dispatch$actor_context(config,trigger,event){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"event","event",301435442),event,new cljs.core.Keyword(null,"trigger","trigger",103466139),trigger,new cljs.core.Keyword("actor","id","actor/id",-1462607809),(function (){var or__5162__auto__ = knoxx.backend.domain.event.dispatch.nonblank(new cljs.core.Keyword("trigger","actor","trigger/actor",-902386057).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.event.dispatch.nonblank(new cljs.core.Keyword("trigger","listener","trigger/listener",1977170184).cljs$core$IFn$_invoke$arity$1(trigger));
}
})(),new cljs.core.Keyword("agent","id","agent/id",-1462765745),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","with","trigger/with",-450753924),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870)], null)),new cljs.core.Keyword(null,"trigger-ctx","trigger-ctx",33067902),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113)], null)),cljs.core.PersistentArrayMap.EMPTY,cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(event,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("event","payload","event/payload",242016970)], null)),cljs.core.PersistentArrayMap.EMPTY], 0))], null);
});
knoxx.backend.domain.event.dispatch.trigger_failure_result = (function knoxx$backend$domain$event$dispatch$trigger_failure_result(trigger,event,err){
var diagnostic = knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("event-dispatch","trigger-action","event-dispatch/trigger-action",-610963595),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("trigger","id","trigger/id",-326368132),new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword("event","id","event/id",-1282332774),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword("event","types","event/types",753963593),new cljs.core.Keyword("event","types","event/types",753963593).cljs$core$IFn$_invoke$arity$1(event)], null),err);
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"failed","failed",-1397425762),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"code","code",1586293142).cljs$core$IFn$_invoke$arity$1(diagnostic);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "action_error";
}
})(),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(diagnostic),new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword("event","id","event/id",-1282332774),new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event)], null);
});
knoxx.backend.domain.event.dispatch.dispatch_BANG_ = (async function knoxx$backend$domain$event$dispatch$dispatch_BANG_(var_args){
var G__30497 = arguments.length;
switch (G__30497) {
case 1:
return knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (event){
return knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.event.dispatch.cfg(),event);
}));

(knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (config,event){
var event_SINGLEQUOTE_ = knoxx.backend.domain.event.normalize.normalize_event(event);
var event_id = new cljs.core.Keyword("event","id","event/id",-1282332774).cljs$core$IFn$_invoke$arity$1(event_SINGLEQUOTE_);
knoxx.backend.domain.event.dispatch.append_recent_event_BANG_(event_SINGLEQUOTE_);

if((!(knoxx.backend.domain.event.dispatch.mark_event_dispatched_BANG_(event_id)))){
console.log("[event-dispatch] event deduplicated:",event_id);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"event","event",301435442),event_SINGLEQUOTE_,new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true], null);
} else {
var all_triggers = knoxx.backend.domain.event.dispatch.load_trigger_resources(config);
var _ = console.log("[event-dispatch] loaded triggers:",cljs.core.count(all_triggers));
var matching_triggers = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30492_SHARP_){
return knoxx.backend.domain.event.dispatch.trigger_matches_QMARK_(p1__30492_SHARP_,event_SINGLEQUOTE_);
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.trigger.normalize.normalize_trigger,all_triggers)));
var ___$1 = console.log("[event-dispatch] matching triggers:",cljs.core.count(matching_triggers),"for event",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event_SINGLEQUOTE_)], 0)));
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((async function (trigger){
try{return (await knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.event.dispatch.actor_context(config,trigger,event_SINGLEQUOTE_),knoxx.backend.domain.action.registry.action_map(trigger)));
}catch (e30512){var err = e30512;
console.error("[event-dispatch] action failed for trigger",new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger),":",err.message);

throw err;
}}),matching_triggers))));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("trigger","id","trigger/id",-326368132),matching_triggers),new cljs.core.Keyword(null,"event","event",301435442),event_SINGLEQUOTE_,new cljs.core.Keyword(null,"results","results",-1134170113),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);
}
}));

(knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.event.dispatch.status_snapshot = (function knoxx$backend$domain$event$dispatch$status_snapshot(config){
var triggers = cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.trigger.normalize.normalize_trigger,knoxx.backend.domain.event.dispatch.load_trigger_resources(config)));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"running","running",1554969103),true,new cljs.core.Keyword(null,"configured","configured",-884777889),true,new cljs.core.Keyword(null,"events","events",1792552201),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recentEvents","recentEvents",-866210172),cljs.core.deref(knoxx.backend.domain.event.dispatch.recent_events_STAR_)], null),new cljs.core.Keyword(null,"triggers","triggers",-1443678770),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (trigger){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword(null,"enabled","enabled",1195909756),new cljs.core.Keyword("trigger","enabled?","trigger/enabled?",1716230423).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword(null,"events","events",1792552201),new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword("trigger","action","trigger/action",-326545728).cljs$core$IFn$_invoke$arity$1(trigger),new cljs.core.Keyword(null,"agent","agent",-766455027),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","with","trigger/with",-450753924),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870)], null)),new cljs.core.Keyword(null,"listener","listener",882147248),new cljs.core.Keyword("trigger","listener","trigger/listener",1977170184).cljs$core$IFn$_invoke$arity$1(trigger)], null);
}),triggers)], null);
});
knoxx.backend.domain.event.dispatch.reset_dedup_BANG_ = (function knoxx$backend$domain$event$dispatch$reset_dedup_BANG_(){
cljs.core.reset_BANG_(knoxx.backend.domain.event.dispatch.dispatched_event_ids_STAR_,cljs.core.PersistentHashSet.EMPTY);

return cljs.core.reset_BANG_(knoxx.backend.domain.event.dispatch.recent_events_STAR_,cljs.core.PersistentVector.EMPTY);
});

//# sourceMappingURL=knoxx.backend.domain.event.dispatch.js.map
