import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.event.normalize.js";
goog.provide('knoxx.backend.domain.trigger.normalize');
knoxx.backend.domain.trigger.normalize.nonblank = (function knoxx$backend$domain$trigger$normalize$nonblank(value){
var G__28467 = value;
var G__28467__$1 = (((G__28467 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28467)));
var G__28467__$2 = (((G__28467__$1 == null))?null:clojure.string.trim(G__28467__$1));
if((G__28467__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__28467__$2);
}
});
knoxx.backend.domain.trigger.normalize.trigger_event_types = (function knoxx$backend$domain$trigger$normalize$trigger_event_types(trigger){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.event.normalize.event_type,(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("trigger","event-types","trigger/event-types",-1141746811).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("trigger","event-kinds","trigger/event-kinds",708701518).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword(null,"eventKinds","eventKinds",360827289)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}
}
})())));
});
knoxx.backend.domain.trigger.normalize.trigger_participants = (function knoxx$backend$domain$trigger$normalize$trigger_participants(trigger){
var explicit_actor = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","actor","trigger/actor",-902386057).cljs$core$IFn$_invoke$arity$1(trigger));
var contract_actors = ((cljs.core.sequential_QMARK_(new cljs.core.Keyword("contract","actors","contract/actors",-1138019932).cljs$core$IFn$_invoke$arity$1(trigger)))?cljs.core.first(new cljs.core.Keyword("contract","actors","contract/actors",-1138019932).cljs$core$IFn$_invoke$arity$1(trigger)):null);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"actor","actor",-1830560481),explicit_actor,new cljs.core.Keyword(null,"emitter","emitter",-374320583),(function (){var or__5162__auto__ = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","emitter","trigger/emitter",709036161).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return explicit_actor;
}
})(),new cljs.core.Keyword(null,"listener","listener",882147248),(function (){var or__5162__auto__ = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","listener","trigger/listener",1977170184).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = explicit_actor;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return contract_actors;
}
}
})()], null);
});
knoxx.backend.domain.trigger.normalize.legacy_trigger_task = (function knoxx$backend$domain$trigger$normalize$legacy_trigger_task(trigger){
var or__5162__auto__ = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","task","trigger/task",1696692031).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","task-prompt","trigger/task-prompt",710537852).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","message-template","trigger/message-template",-1000547).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = knoxx.backend.domain.trigger.normalize.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"task","task",-1476607993)], null)));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = knoxx.backend.domain.trigger.normalize.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"message-template","message-template",-989719339)], null)));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return knoxx.backend.domain.trigger.normalize.nonblank(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113),new cljs.core.Keyword(null,"task","task",-1476607993)], null)));
}
}
}
}
}
});
/**
 * Build the trigger argument map: explicit :trigger/with keys over folded
 * legacy :trigger/agent and :trigger/task fields.
 */
knoxx.backend.domain.trigger.normalize.trigger_with = (function knoxx$backend$domain$trigger$normalize$trigger_with(trigger,target){
var agent_id = (function (){var or__5162__auto__ = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","agent","trigger/agent",319106277).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return target;
}
})();
var task = knoxx.backend.domain.trigger.normalize.legacy_trigger_task(trigger);
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(cljs.core.truth_(agent_id)?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"agent-id","agent-id",1570348870),agent_id], null):null),(cljs.core.truth_(task)?new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"task","task",-1476607993),task], null):null),new cljs.core.Keyword("trigger","with","trigger/with",-450753924).cljs$core$IFn$_invoke$arity$1(trigger)], 0));
});
knoxx.backend.domain.trigger.normalize.normalize_trigger = (function knoxx$backend$domain$trigger$normalize$normalize_trigger(trigger){
var target = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","target","trigger/target",-834253503).cljs$core$IFn$_invoke$arity$1(trigger));
var map__28499 = knoxx.backend.domain.trigger.normalize.trigger_participants(trigger);
var map__28499__$1 = cljs.core.__destructure_map(map__28499);
var actor = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28499__$1,new cljs.core.Keyword(null,"actor","actor",-1830560481));
var emitter = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28499__$1,new cljs.core.Keyword(null,"emitter","emitter",-374320583));
var listener = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28499__$1,new cljs.core.Keyword(null,"listener","listener",882147248));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword("trigger","action","trigger/action",-326545728),new cljs.core.Keyword("trigger","emitter","trigger/emitter",709036161),new cljs.core.Keyword("trigger","events","trigger/events",-1416397087),new cljs.core.Keyword("trigger","listener","trigger/listener",1977170184),new cljs.core.Keyword("trigger","condition","trigger/condition",-1567761332),new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347),new cljs.core.Keyword("trigger","context","trigger/context",357087151),new cljs.core.Keyword("trigger","raw","trigger/raw",510155600),new cljs.core.Keyword("trigger","enabled?","trigger/enabled?",1716230423),new cljs.core.Keyword("trigger","actor","trigger/actor",-902386057),new cljs.core.Keyword("trigger","id","trigger/id",-326368132),new cljs.core.Keyword("trigger","with","trigger/with",-450753924)],[(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","action","trigger/action",-326545728).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.truth_(target)){
return new cljs.core.Keyword("actions","start-agent-session","actions/start-agent-session",-1377218838);
} else {
return null;
}
}
})(),emitter,knoxx.backend.domain.trigger.normalize.trigger_event_types(trigger),listener,(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","condition","trigger/condition",-1567761332).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"condition","condition",1668437652)], null));
}
})(),new cljs.core.Keyword(null,"event","event",301435442),(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","context","trigger/context",357087151).cljs$core$IFn$_invoke$arity$1(trigger);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
})(),trigger,(!(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(trigger) === false)),actor,(function (){var or__5162__auto__ = knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(trigger));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.trigger.normalize.nonblank(new cljs.core.Keyword("trigger","id","trigger/id",-326368132).cljs$core$IFn$_invoke$arity$1(trigger));
}
})(),knoxx.backend.domain.trigger.normalize.trigger_with(trigger,target)]);
});

//# sourceMappingURL=knoxx.backend.domain.trigger.normalize.js.map
