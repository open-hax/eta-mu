import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.event.dispatch.js";
import "./knoxx.backend.domain.resources.loader.js";
goog.provide('knoxx.backend.domain.schedule.runtime');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.schedule !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.schedule !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime.schedule_id__GT_interval_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.schedule.runtime.schedule_id__GT_interval_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.schedule !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime !== 'undefined') && (typeof knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Naive temporal rule-to-ms: supports cron-like '* /N * * * *' and
 * 'N * * * *' forms. Falls back to 5 minutes and never returns < 1 minute.
 */
knoxx.backend.domain.schedule.runtime.rule__GT_ms = (function knoxx$backend$domain$schedule$runtime$rule__GT_ms(rule){
var rule_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(rule));
var ms = (cljs.core.truth_(cljs.core.re_find(/\/(\d+)/,rule_text))?(function (){var n = parseInt(cljs.core.second(cljs.core.re_find(/\/(\d+)/,rule_text)));
return (((60) * (1000)) * cljs.core.max.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = n;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (5);
}
})(),(1)));
})():(cljs.core.truth_(cljs.core.re_find(/^\d+\s+\d+\s+\*\s+\*\s+\*$/,rule_text))?((((24) * (60)) * (60)) * (1000)):(cljs.core.truth_(cljs.core.re_find(/^(\d+)\s+\*/,rule_text))?(function (){var n = parseInt(cljs.core.second(cljs.core.re_find(/^(\d+)\s+\*/,rule_text)));
return (((60) * (1000)) * cljs.core.max.cljs$core$IFn$_invoke$arity$2(n,(1)));
})():(((5) * (60)) * (1000))
)));
return cljs.core.max.cljs$core$IFn$_invoke$arity$2(ms,((60) * (1000)));
});
knoxx.backend.domain.schedule.runtime.schedule_resource_id = (function knoxx$backend$domain$schedule$runtime$schedule_resource_id(schedule){
var or__5162__auto__ = new cljs.core.Keyword("schedule","id","schedule/id",-1003403363).cljs$core$IFn$_invoke$arity$1(schedule);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(schedule);
}
});
knoxx.backend.domain.schedule.runtime.schedule__GT_event = (function knoxx$backend$domain$schedule$runtime$schedule__GT_event(schedule){
var event = (function (){var or__5162__auto__ = new cljs.core.Keyword("schedule","event","schedule/event",-1500446599).cljs$core$IFn$_invoke$arity$1(schedule);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var schedule_id = knoxx.backend.domain.schedule.runtime.schedule_resource_id(schedule);
var generator = (function (){var or__5162__auto__ = new cljs.core.Keyword("schedule","generator","schedule/generator",-2088781648).cljs$core$IFn$_invoke$arity$1(schedule);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(schedule,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("schedule","generator","schedule/generator",-2088781648),new cljs.core.Keyword(null,"kind","kind",-717265803)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"schedule","schedule",349275266);
}
}
})();
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(event,new cljs.core.Keyword("event","generator","event/generator",-736110419),(function (){var G__30635 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"kind","kind",-717265803),generator], null);
if(cljs.core.truth_(schedule_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__30635,new cljs.core.Keyword("schedule","id","schedule/id",-1003403363),schedule_id);
} else {
return G__30635;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("event","payload","event/payload",242016970),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("schedule","id","schedule/id",-1003403363),schedule_id], null),new cljs.core.Keyword("event","payload","event/payload",242016970).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword(null,"payload","payload",-383036092).cljs$core$IFn$_invoke$arity$1(event)], 0))], 0));
});
knoxx.backend.domain.schedule.runtime.load_schedule_sync = (function knoxx$backend$domain$schedule$runtime$load_schedule_sync(config,schedule_id){
return knoxx.backend.domain.resources.loader.resource_sync(config,new cljs.core.Keyword(null,"schedule","schedule",349275266),schedule_id);
});
knoxx.backend.domain.schedule.runtime.schedule_rule = (function knoxx$backend$domain$schedule$runtime$schedule_rule(schedule){
var or__5162__auto__ = new cljs.core.Keyword("schedule","rule","schedule/rule",369760610).cljs$core$IFn$_invoke$arity$1(schedule);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword("schedule","cron","schedule/cron",1472284154).cljs$core$IFn$_invoke$arity$1(schedule);
}
});
knoxx.backend.domain.schedule.runtime.emit_BANG_ = (async function knoxx$backend$domain$schedule$runtime$emit_BANG_(config,schedule_id,schedule){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_,cljs.core.assoc,schedule_id,true);

try{var result = (await knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2(config,knoxx.backend.domain.schedule.runtime.schedule__GT_event(schedule)));
return console.log("[schedule-domain] emitted",schedule_id,"matched",cljs.core.count(new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767).cljs$core$IFn$_invoke$arity$1(result)),"triggers");
}catch (e30651){var err = e30651;
return console.error("[schedule-domain] emission failed",schedule_id,err);
}finally {cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_,cljs.core.dissoc,schedule_id);
}});
knoxx.backend.domain.schedule.runtime.arm_rule_BANG_ = (function knoxx$backend$domain$schedule$runtime$arm_rule_BANG_(config,schedule_id,rule){
var ms = knoxx.backend.domain.schedule.runtime.rule__GT_ms(rule);
var tick_BANG_ = (async function knoxx$backend$domain$schedule$runtime$arm_rule_BANG__$_schedule_tick(){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_))){
if(cljs.core.truth_(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_),schedule_id))){
return null;
} else {
var temp__5825__auto__ = knoxx.backend.domain.schedule.runtime.load_schedule_sync(config,schedule_id);
if(cljs.core.truth_(temp__5825__auto__)){
var schedule = temp__5825__auto__;
if(cljs.core.truth_(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(schedule))){
return (await knoxx.backend.domain.schedule.runtime.emit_BANG_(config,schedule_id,schedule));
} else {
return null;
}
} else {
return null;
}
}
} else {
return null;
}
});
var interval_id = setInterval(tick_BANG_,ms);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.schedule.runtime.schedule_id__GT_interval_STAR_,cljs.core.assoc,schedule_id,interval_id);

return console.log("[schedule-domain] armed",schedule_id,"every",ms,"ms");
});
knoxx.backend.domain.schedule.runtime.start_BANG_ = (function knoxx$backend$domain$schedule$runtime$start_BANG_(config){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_))){
return null;
} else {
cljs.core.reset_BANG_(knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_,true);

var seq__30672 = cljs.core.seq(knoxx.backend.domain.resources.loader.list_resource_ids_sync(config,new cljs.core.Keyword(null,"schedule","schedule",349275266)));
var chunk__30673 = null;
var count__30674 = (0);
var i__30675 = (0);
while(true){
if((i__30675 < count__30674)){
var schedule_id = chunk__30673.cljs$core$IIndexed$_nth$arity$2(null,i__30675);
var temp__5825__auto___30817 = knoxx.backend.domain.schedule.runtime.load_schedule_sync(config,schedule_id);
if(cljs.core.truth_(temp__5825__auto___30817)){
var schedule_30818 = temp__5825__auto___30817;
if(cljs.core.truth_(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(schedule_30818))){
var temp__5823__auto___30819 = knoxx.backend.domain.schedule.runtime.schedule_rule(schedule_30818);
if(cljs.core.truth_(temp__5823__auto___30819)){
var rule_30820 = temp__5823__auto___30819;
knoxx.backend.domain.schedule.runtime.arm_rule_BANG_(config,schedule_id,rule_30820);
} else {
console.warn("[schedule-domain] ignored missing rule",schedule_id);
}
} else {
}
} else {
}


var G__30821 = seq__30672;
var G__30822 = chunk__30673;
var G__30823 = count__30674;
var G__30824 = (i__30675 + (1));
seq__30672 = G__30821;
chunk__30673 = G__30822;
count__30674 = G__30823;
i__30675 = G__30824;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__30672);
if(temp__5825__auto__){
var seq__30672__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__30672__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__30672__$1);
var G__30825 = cljs.core.chunk_rest(seq__30672__$1);
var G__30826 = c__5694__auto__;
var G__30827 = cljs.core.count(c__5694__auto__);
var G__30828 = (0);
seq__30672 = G__30825;
chunk__30673 = G__30826;
count__30674 = G__30827;
i__30675 = G__30828;
continue;
} else {
var schedule_id = cljs.core.first(seq__30672__$1);
var temp__5825__auto___30829__$1 = knoxx.backend.domain.schedule.runtime.load_schedule_sync(config,schedule_id);
if(cljs.core.truth_(temp__5825__auto___30829__$1)){
var schedule_30831 = temp__5825__auto___30829__$1;
if(cljs.core.truth_(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(schedule_30831))){
var temp__5823__auto___30834 = knoxx.backend.domain.schedule.runtime.schedule_rule(schedule_30831);
if(cljs.core.truth_(temp__5823__auto___30834)){
var rule_30836 = temp__5823__auto___30834;
knoxx.backend.domain.schedule.runtime.arm_rule_BANG_(config,schedule_id,rule_30836);
} else {
console.warn("[schedule-domain] ignored missing rule",schedule_id);
}
} else {
}
} else {
}


var G__30837 = cljs.core.next(seq__30672__$1);
var G__30838 = null;
var G__30839 = (0);
var G__30840 = (0);
seq__30672 = G__30837;
chunk__30673 = G__30838;
count__30674 = G__30839;
i__30675 = G__30840;
continue;
}
} else {
return null;
}
}
break;
}
}
});
knoxx.backend.domain.schedule.runtime.stop_BANG_ = (function knoxx$backend$domain$schedule$runtime$stop_BANG_(){
var seq__30738_30841 = cljs.core.seq(cljs.core.deref(knoxx.backend.domain.schedule.runtime.schedule_id__GT_interval_STAR_));
var chunk__30739_30842 = null;
var count__30740_30843 = (0);
var i__30741_30844 = (0);
while(true){
if((i__30741_30844 < count__30740_30843)){
var vec__30765_30846 = chunk__30739_30842.cljs$core$IIndexed$_nth$arity$2(null,i__30741_30844);
var schedule_id_30847 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30765_30846,(0),null);
var interval_id_30848 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30765_30846,(1),null);
clearInterval(interval_id_30848);

console.log("[schedule-domain] stopped",schedule_id_30847);


var G__30849 = seq__30738_30841;
var G__30850 = chunk__30739_30842;
var G__30851 = count__30740_30843;
var G__30852 = (i__30741_30844 + (1));
seq__30738_30841 = G__30849;
chunk__30739_30842 = G__30850;
count__30740_30843 = G__30851;
i__30741_30844 = G__30852;
continue;
} else {
var temp__5825__auto___30853 = cljs.core.seq(seq__30738_30841);
if(temp__5825__auto___30853){
var seq__30738_30854__$1 = temp__5825__auto___30853;
if(cljs.core.chunked_seq_QMARK_(seq__30738_30854__$1)){
var c__5694__auto___30855 = cljs.core.chunk_first(seq__30738_30854__$1);
var G__30856 = cljs.core.chunk_rest(seq__30738_30854__$1);
var G__30857 = c__5694__auto___30855;
var G__30858 = cljs.core.count(c__5694__auto___30855);
var G__30859 = (0);
seq__30738_30841 = G__30856;
chunk__30739_30842 = G__30857;
count__30740_30843 = G__30858;
i__30741_30844 = G__30859;
continue;
} else {
var vec__30774_30860 = cljs.core.first(seq__30738_30854__$1);
var schedule_id_30861 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30774_30860,(0),null);
var interval_id_30862 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30774_30860,(1),null);
clearInterval(interval_id_30862);

console.log("[schedule-domain] stopped",schedule_id_30861);


var G__30863 = cljs.core.next(seq__30738_30854__$1);
var G__30864 = null;
var G__30865 = (0);
var G__30866 = (0);
seq__30738_30841 = G__30863;
chunk__30739_30842 = G__30864;
count__30740_30843 = G__30865;
i__30741_30844 = G__30866;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(knoxx.backend.domain.schedule.runtime.schedule_id__GT_interval_STAR_,cljs.core.PersistentArrayMap.EMPTY);

cljs.core.reset_BANG_(knoxx.backend.domain.schedule.runtime.schedule_id__GT_inflight_STAR_,cljs.core.PersistentArrayMap.EMPTY);

return cljs.core.reset_BANG_(knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_,false);
});
knoxx.backend.domain.schedule.runtime.status = (function knoxx$backend$domain$schedule$runtime$status(config){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.deref(knoxx.backend.domain.schedule.runtime.running_QMARK__STAR_),new cljs.core.Keyword(null,"schedules","schedules",2099585369),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (id){
var temp__5825__auto__ = knoxx.backend.domain.schedule.runtime.load_schedule_sync(config,id);
if(cljs.core.truth_(temp__5825__auto__)){
var schedule = temp__5825__auto__;
return cljs.core.select_keys(schedule,new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("contract","id","contract/id",-872298206),new cljs.core.Keyword("schedule","id","schedule/id",-1003403363),new cljs.core.Keyword("schedule","rule","schedule/rule",369760610),new cljs.core.Keyword("schedule","cron","schedule/cron",1472284154),new cljs.core.Keyword("schedule","event","schedule/event",-1500446599),new cljs.core.Keyword(null,"enabled","enabled",1195909756)], null));
} else {
return null;
}
}),knoxx.backend.domain.resources.loader.list_resource_ids_sync(config,new cljs.core.Keyword(null,"schedule","schedule",349275266)))], null);
});

//# sourceMappingURL=knoxx.backend.domain.schedule.runtime.js.map
