import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.event.dispatch.js";
import "./knoxx.backend.domain.resources.loader.js";
goog.provide('knoxx.backend.domain.trigger.runtime');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.trigger !== 'undefined') && (typeof knoxx.backend.domain.trigger.runtime !== 'undefined') && (typeof knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
knoxx.backend.domain.trigger.runtime.load_trigger_sync = (function knoxx$backend$domain$trigger$runtime$load_trigger_sync(config,trigger_id){
return knoxx.backend.domain.resources.loader.resource_sync(config,new cljs.core.Keyword(null,"trigger","trigger",103466139),trigger_id);
});
knoxx.backend.domain.trigger.runtime.event_trigger_QMARK_ = (function knoxx$backend$domain$trigger$runtime$event_trigger_QMARK_(trigger){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(trigger));
});
knoxx.backend.domain.trigger.runtime.start_BANG_ = (function knoxx$backend$domain$trigger$runtime$start_BANG_(config){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_))){
return null;
} else {
cljs.core.reset_BANG_(knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_,true);

var seq__30597 = cljs.core.seq(knoxx.backend.domain.resources.loader.list_resource_ids_sync(config,new cljs.core.Keyword(null,"trigger","trigger",103466139)));
var chunk__30598 = null;
var count__30599 = (0);
var i__30600 = (0);
while(true){
if((i__30600 < count__30599)){
var trigger_id = chunk__30598.cljs$core$IIndexed$_nth$arity$2(null,i__30600);
var temp__5825__auto___30700 = knoxx.backend.domain.trigger.runtime.load_trigger_sync(config,trigger_id);
if(cljs.core.truth_(temp__5825__auto___30700)){
var trigger_30701 = temp__5825__auto___30700;
if(knoxx.backend.domain.trigger.runtime.event_trigger_QMARK_(trigger_30701)){
console.log("[trigger-domain] registered",trigger_id);
} else {
console.warn("[trigger-domain] ignored non-event trigger",trigger_id,new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(trigger_30701));
}
} else {
}


var G__30702 = seq__30597;
var G__30703 = chunk__30598;
var G__30704 = count__30599;
var G__30705 = (i__30600 + (1));
seq__30597 = G__30702;
chunk__30598 = G__30703;
count__30599 = G__30704;
i__30600 = G__30705;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__30597);
if(temp__5825__auto__){
var seq__30597__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__30597__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__30597__$1);
var G__30706 = cljs.core.chunk_rest(seq__30597__$1);
var G__30707 = c__5694__auto__;
var G__30708 = cljs.core.count(c__5694__auto__);
var G__30709 = (0);
seq__30597 = G__30706;
chunk__30598 = G__30707;
count__30599 = G__30708;
i__30600 = G__30709;
continue;
} else {
var trigger_id = cljs.core.first(seq__30597__$1);
var temp__5825__auto___30714__$1 = knoxx.backend.domain.trigger.runtime.load_trigger_sync(config,trigger_id);
if(cljs.core.truth_(temp__5825__auto___30714__$1)){
var trigger_30715 = temp__5825__auto___30714__$1;
if(knoxx.backend.domain.trigger.runtime.event_trigger_QMARK_(trigger_30715)){
console.log("[trigger-domain] registered",trigger_id);
} else {
console.warn("[trigger-domain] ignored non-event trigger",trigger_id,new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(trigger_30715));
}
} else {
}


var G__30716 = cljs.core.next(seq__30597__$1);
var G__30717 = null;
var G__30718 = (0);
var G__30719 = (0);
seq__30597 = G__30716;
chunk__30598 = G__30717;
count__30599 = G__30718;
i__30600 = G__30719;
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
knoxx.backend.domain.trigger.runtime.stop_BANG_ = (function knoxx$backend$domain$trigger$runtime$stop_BANG_(){
return cljs.core.reset_BANG_(knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_,false);
});
/**
 * Dispatch one of a trigger's observed events for manual testing.
 */
knoxx.backend.domain.trigger.runtime.fire_BANG_ = (async function knoxx$backend$domain$trigger$runtime$fire_BANG_(var_args){
var G__30652 = arguments.length;
switch (G__30652) {
case 2:
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (config,trigger_id){
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$3(config,trigger_id,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (config,trigger_id,payload){
var trigger = knoxx.backend.domain.trigger.runtime.load_trigger_sync(config,trigger_id);
if(cljs.core.truth_(trigger)){
var event_type = cljs.core.first(new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(trigger));
if(knoxx.backend.domain.trigger.runtime.event_trigger_QMARK_(trigger)){
} else {
throw (new Error((""+"Trigger is not an event trigger: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id))));
}

if(cljs.core.truth_(event_type)){
} else {
throw (new Error((""+"Trigger has no observed events: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id))));
}

return (await knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2(config,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("event","type","event/type",1532247862),event_type,new cljs.core.Keyword("event","generator","event/generator",-736110419),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"manual","manual",-237370608),new cljs.core.Keyword("trigger","id","trigger/id",-326368132),trigger_id], null),new cljs.core.Keyword("event","payload","event/payload",242016970),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(trigger,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113)], null)),payload], 0))], null)));
} else {
throw (new Error((""+"Unknown trigger: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(trigger_id))));
}
}));

(knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.trigger.runtime.status = (function knoxx$backend$domain$trigger$runtime$status(config){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.deref(knoxx.backend.domain.trigger.runtime.running_QMARK__STAR_),new cljs.core.Keyword(null,"triggers","triggers",-1443678770),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (id){
var temp__5825__auto__ = knoxx.backend.domain.trigger.runtime.load_trigger_sync(config,id);
if(cljs.core.truth_(temp__5825__auto__)){
var trigger = temp__5825__auto__;
return cljs.core.select_keys(trigger,new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("contract","id","contract/id",-872298206),new cljs.core.Keyword("trigger","id","trigger/id",-326368132),new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347),new cljs.core.Keyword("trigger","events","trigger/events",-1416397087),new cljs.core.Keyword("trigger","action","trigger/action",-326545728),new cljs.core.Keyword(null,"enabled","enabled",1195909756)], null));
} else {
return null;
}
}),knoxx.backend.domain.resources.loader.list_resource_ids_sync(config,new cljs.core.Keyword(null,"trigger","trigger",103466139)))], null);
});

//# sourceMappingURL=knoxx.backend.domain.trigger.runtime.js.map
