import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.domain.schedule.runtime.js";
import "./knoxx.backend.domain.source.runtime.js";
import "./knoxx.backend.domain.trigger.runtime.js";
import "./knoxx.backend.infra.config.js";
goog.provide('knoxx.backend.infra.event_runtime');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.event_runtime !== 'undefined') && (typeof knoxx.backend.infra.event_runtime.running_QMARK__STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.event_runtime.running_QMARK__STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.event_runtime !== 'undefined') && (typeof knoxx.backend.infra.event_runtime.reload_timer_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.event_runtime.reload_timer_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.event_runtime.cfg = (function knoxx$backend$infra$event_runtime$cfg(){
return knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg());
});
knoxx.backend.infra.event_runtime.start_BANG_ = (function knoxx$backend$infra$event_runtime$start_BANG_(var_args){
var G__30881 = arguments.length;
switch (G__30881) {
case 0:
return knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.event_runtime.cfg());
}));

(knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (config){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.event_runtime.running_QMARK__STAR_))){
return null;
} else {
cljs.core.reset_BANG_(knoxx.backend.infra.event_runtime.running_QMARK__STAR_,true);

knoxx.backend.domain.trigger.runtime.start_BANG_(config);

knoxx.backend.domain.schedule.runtime.start_BANG_(config);

return knoxx.backend.domain.error_observatory.observe_promise_BANG_(new cljs.core.Keyword("event-runtime","source-start","event-runtime/source-start",-1530458274),cljs.core.PersistentArrayMap.EMPTY,knoxx.backend.domain.source.runtime.start_BANG_(config));
}
}));

(knoxx.backend.infra.event_runtime.start_BANG_.cljs$lang$maxFixedArity = 1);

knoxx.backend.infra.event_runtime.stop_BANG_ = (function knoxx$backend$infra$event_runtime$stop_BANG_(){
knoxx.backend.domain.source.runtime.stop_BANG_();

knoxx.backend.domain.schedule.runtime.stop_BANG_();

knoxx.backend.domain.trigger.runtime.stop_BANG_();

return cljs.core.reset_BANG_(knoxx.backend.infra.event_runtime.running_QMARK__STAR_,false);
});
knoxx.backend.infra.event_runtime.reload_BANG_ = (function knoxx$backend$infra$event_runtime$reload_BANG_(var_args){
var G__30925 = arguments.length;
switch (G__30925) {
case 0:
return knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.event_runtime.cfg());
}));

(knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (config){
knoxx.backend.infra.event_runtime.stop_BANG_();

knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1(config);

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"action","action",-811238024),"reload"], null));
}));

(knoxx.backend.infra.event_runtime.reload_BANG_.cljs$lang$maxFixedArity = 1);

knoxx.backend.infra.event_runtime.debounced_reload_BANG_ = (function knoxx$backend$infra$event_runtime$debounced_reload_BANG_(){
var temp__5825__auto___31018 = cljs.core.deref(knoxx.backend.infra.event_runtime.reload_timer_STAR_);
if(cljs.core.truth_(temp__5825__auto___31018)){
var timer_31019 = temp__5825__auto___31018;
clearTimeout(timer_31019);
} else {
}

return cljs.core.reset_BANG_(knoxx.backend.infra.event_runtime.reload_timer_STAR_,setTimeout((function (){
cljs.core.reset_BANG_(knoxx.backend.infra.event_runtime.reload_timer_STAR_,null);

return knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$0();
}),(350)));
});
knoxx.backend.infra.event_runtime.reset_runtime_BANG_ = (function knoxx$backend$infra$event_runtime$reset_runtime_BANG_(var_args){
var G__30962 = arguments.length;
switch (G__30962) {
case 0:
return knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.event_runtime.cfg());
}));

(knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$1(config);
}));

(knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$lang$maxFixedArity = 1);

knoxx.backend.infra.event_runtime.fire_trigger_BANG_ = (function knoxx$backend$infra$event_runtime$fire_trigger_BANG_(var_args){
var G__30970 = arguments.length;
switch (G__30970) {
case 1:
return knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (trigger_id){
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.event_runtime.cfg(),trigger_id);
}));

(knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (config,trigger_id){
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2(config,trigger_id);
}));

(knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$lang$maxFixedArity = 2);

knoxx.backend.infra.event_runtime.fire_BANG_ = (function knoxx$backend$infra$event_runtime$fire_BANG_(var_args){
var G__30980 = arguments.length;
switch (G__30980) {
case 1:
return knoxx.backend.infra.event_runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.event_runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (trigger_id){
return knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$1(trigger_id);
}));

(knoxx.backend.infra.event_runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (trigger_id,payload){
return knoxx.backend.domain.trigger.runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.event_runtime.cfg(),trigger_id,payload);
}));

(knoxx.backend.infra.event_runtime.fire_BANG_.cljs$lang$maxFixedArity = 2);

knoxx.backend.infra.event_runtime.status = (function knoxx$backend$infra$event_runtime$status(var_args){
var G__30990 = arguments.length;
switch (G__30990) {
case 0:
return knoxx.backend.infra.event_runtime.status.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.event_runtime.status.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.event_runtime.status.cljs$core$IFn$_invoke$arity$0 = (function (){
return knoxx.backend.infra.event_runtime.status.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.event_runtime.cfg());
}));

(knoxx.backend.infra.event_runtime.status.cljs$core$IFn$_invoke$arity$1 = (function (config){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"running","running",1554969103),cljs.core.deref(knoxx.backend.infra.event_runtime.running_QMARK__STAR_),new cljs.core.Keyword(null,"triggers","triggers",-1443678770),knoxx.backend.domain.trigger.runtime.status(config),new cljs.core.Keyword(null,"schedules","schedules",2099585369),knoxx.backend.domain.schedule.runtime.status(config),new cljs.core.Keyword(null,"sources","sources",-321166424),knoxx.backend.domain.source.runtime.status()], null);
}));

(knoxx.backend.infra.event_runtime.status.cljs$lang$maxFixedArity = 1);


//# sourceMappingURL=knoxx.backend.infra.event_runtime.js.map
