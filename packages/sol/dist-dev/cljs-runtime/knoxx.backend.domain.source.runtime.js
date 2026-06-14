import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.driver.builtin.js";
import "./knoxx.backend.domain.driver.registry.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.domain.event.dispatch.js";
import "./knoxx.backend.domain.resources.loader.js";
goog.provide('knoxx.backend.domain.source.runtime');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.source !== 'undefined') && (typeof knoxx.backend.domain.source.runtime !== 'undefined') && (typeof knoxx.backend.domain.source.runtime.source_status_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.source.runtime.source_status_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.domain.source.runtime.resource_definition = (function knoxx$backend$domain$source$runtime$resource_definition(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","definition","resource/definition",-1547661004).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.domain.source.runtime.source_record_QMARK_ = (function knoxx$backend$domain$source$runtime$source_record_QMARK_(record){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(record))) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sources",new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(record))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sources",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))))));
});
knoxx.backend.domain.source.runtime.enabled_source_QMARK_ = (function knoxx$backend$domain$source$runtime$enabled_source_QMARK_(source){
return (((!(new cljs.core.Keyword(null,"enabled","enabled",1195909756).cljs$core$IFn$_invoke$arity$1(source) === false))) && ((!(new cljs.core.Keyword("source","enabled?","source/enabled?",1619749612).cljs$core$IFn$_invoke$arity$1(source) === false))));
});
knoxx.backend.domain.source.runtime.event_source_QMARK_ = (function knoxx$backend$domain$source$runtime$event_source_QMARK_(source){
return ((knoxx.backend.domain.source.runtime.enabled_source_QMARK_(source)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"event-generator","event-generator",-1376529156),new cljs.core.Keyword("source","type","source/type",-1735501385).cljs$core$IFn$_invoke$arity$1(source))) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event-generator",new cljs.core.Keyword("source","type","source/type",-1735501385).cljs$core$IFn$_invoke$arity$1(source))) || (cljs.core.seq(new cljs.core.Keyword("source","listens","source/listens",-136351302).cljs$core$IFn$_invoke$arity$1(source))))))));
});
/**
 * Load enabled event source resources from EDN.
 */
knoxx.backend.domain.source.runtime.source_resources = (function knoxx$backend$domain$source$runtime$source_resources(config){
knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.source.runtime.event_source_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.source.runtime.resource_definition,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.source.runtime.source_record_QMARK_,knoxx.backend.domain.resources.loader.load_all_resources_sync(config)))));
});
knoxx.backend.domain.source.runtime.event_entry = (function knoxx$backend$domain$source$runtime$event_entry(event){
var or__5162__auto__ = new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"eventType","eventType",-1525570624).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"eventKind","eventKind",2138897648).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"event-kind","event-kind",-191230187).cljs$core$IFn$_invoke$arity$1(event);
}
}
}
});
knoxx.backend.domain.source.runtime.source_listens_to_QMARK_ = (function knoxx$backend$domain$source$runtime$source_listens_to_QMARK_(source,event_type){
return cljs.core.contains_QMARK_(cljs.core.set((knoxx.backend.domain.driver.registry.source_listens.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.source_listens.cljs$core$IFn$_invoke$arity$1(source) : knoxx.backend.domain.driver.registry.source_listens.call(null,source))),(knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1(event_type) : knoxx.backend.domain.driver.registry.event_type.call(null,event_type)));
});
/**
 * Find the source resource that admits driver-id/actor-id/event-type.
 * 
 * This is the multiple-bot seam: several source resources may use the same
 * driver, but actor-owned credentials choose which one receives events.
 */
knoxx.backend.domain.source.runtime.matching_source = (function knoxx$backend$domain$source$runtime$matching_source(config,driver_id,actor_id,event_type){
var wanted_driver = (knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1(driver_id) : knoxx.backend.domain.driver.registry.normalize_driver_id.call(null,driver_id));
var exact_actor_QMARK_ = (function (source){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source))),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)));
});
var listens_QMARK_ = (function (source){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_driver,(function (){var G__30649 = new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(source);
return (knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1(G__30649) : knoxx.backend.domain.driver.registry.normalize_driver_id.call(null,G__30649));
})())) && (knoxx.backend.domain.source.runtime.source_listens_to_QMARK_(source,event_type)));
});
var candidates = cljs.core.filter.cljs$core$IFn$_invoke$arity$2(listens_QMARK_,knoxx.backend.domain.source.runtime.source_resources(config));
var or__5162__auto__ = cljs.core.some((function (p1__30640_SHARP_){
if(exact_actor_QMARK_(p1__30640_SHARP_)){
return p1__30640_SHARP_;
} else {
return null;
}
}),candidates);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core.truth_(actor_id)){
return null;
} else {
return cljs.core.first(candidates);
}
}
});
/**
 * Attach source actor and driver/source provenance to an event.
 */
knoxx.backend.domain.source.runtime.source_event = (function knoxx$backend$domain$source$runtime$source_event(source,event){
var temp__5825__auto__ = (function (){var G__30655 = new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(source);
return (knoxx.backend.domain.driver.registry.driver.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.driver.cljs$core$IFn$_invoke$arity$1(G__30655) : knoxx.backend.domain.driver.registry.driver.call(null,G__30655));
})();
if(cljs.core.truth_(temp__5825__auto__)){
var driver = temp__5825__auto__;
return (knoxx.backend.domain.driver.registry.source_event.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.driver.registry.source_event.cljs$core$IFn$_invoke$arity$3(driver,source,event) : knoxx.backend.domain.driver.registry.source_event.call(null,driver,source,event));
} else {
return null;
}
});
knoxx.backend.domain.source.runtime.skip_result = (function knoxx$backend$domain$source$runtime$skip_result(reason,data){
var result = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"skipped","skipped",-1144887090),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),reason], null),data], 0));
knoxx.backend.domain.error_observatory.log_warning_BANG_(new cljs.core.Keyword("source-runtime","dispatch-skipped","source-runtime/dispatch-skipped",863476118),result);

return result;
});
/**
 * Dispatch one event through a concrete source resource if it selected the event.
 * 
 * Returns a skipped result instead of dispatching when the source's driver is not
 * registered or the event type is outside :source/listens.
 */
knoxx.backend.domain.source.runtime.dispatch_source_event_BANG_ = (async function knoxx$backend$domain$source$runtime$dispatch_source_event_BANG_(config,source,event){
knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

var event_type = knoxx.backend.domain.source.runtime.event_entry(event);
var driver = new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.not((knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.registered_driver_QMARK_.call(null,driver)))){
return knoxx.backend.domain.source.runtime.skip_result(new cljs.core.Keyword(null,"unknown-driver","unknown-driver",-535000893),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"driver","driver",1515263546),driver,new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source)], null));
} else {
if((!(knoxx.backend.domain.source.runtime.source_listens_to_QMARK_(source,event_type)))){
return knoxx.backend.domain.source.runtime.skip_result(new cljs.core.Keyword(null,"source-not-listening","source-not-listening",-2112325796),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"driver","driver",1515263546),driver,new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("event","type","event/type",1532247862),(knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1(event_type) : knoxx.backend.domain.driver.registry.event_type.call(null,event_type))], null));
} else {
return (await knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2(config,knoxx.backend.domain.source.runtime.source_event(source,event)));

}
}
});
/**
 * Dispatch an event emitted by driver-id for actor-id.
 * 
 * The event is admitted only if an enabled source resource for that actor uses
 * the driver and lists the event type in :source/listens.
 */
knoxx.backend.domain.source.runtime.dispatch_driver_event_BANG_ = (async function knoxx$backend$domain$source$runtime$dispatch_driver_event_BANG_(config,driver_id,actor_id,event){
var event_type = knoxx.backend.domain.source.runtime.event_entry(event);
var source = knoxx.backend.domain.source.runtime.matching_source(config,driver_id,actor_id,event_type);
console.log("[source-runtime] dispatch-driver-event:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([driver_id], 0)),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([actor_id], 0)),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([event_type], 0)),(cljs.core.truth_(source)?"found-source":"no-matching-source"),"config-roots=",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.loader.contract_root_paths(config)], 0)));

if(cljs.core.truth_(source)){
return (await knoxx.backend.domain.source.runtime.dispatch_source_event_BANG_(config,source,event));
} else {
return knoxx.backend.domain.source.runtime.skip_result(new cljs.core.Keyword(null,"no-matching-source","no-matching-source",-225147230),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"driver","driver",1515263546),(knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.normalize_driver_id.cljs$core$IFn$_invoke$arity$1(driver_id) : knoxx.backend.domain.driver.registry.normalize_driver_id.call(null,driver_id)),new cljs.core.Keyword("actor","id","actor/id",-1462607809),actor_id,new cljs.core.Keyword("event","type","event/type",1532247862),(await (async function (){var G__30699 = knoxx.backend.domain.source.runtime.event_entry(event);
return (knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.event_type.cljs$core$IFn$_invoke$arity$1(G__30699) : knoxx.backend.domain.driver.registry.event_type.call(null,G__30699));
})())], null));
}
});
knoxx.backend.domain.source.runtime.source_start_context = (function knoxx$backend$domain$source$runtime$source_start_context(config,source){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"source","source",-433931539),source,new cljs.core.Keyword(null,"dispatch!","dispatch!",-1927281664),(function (event){
return knoxx.backend.domain.source.runtime.dispatch_source_event_BANG_(config,source,event);
})], null);
});
knoxx.backend.domain.source.runtime.start_source_BANG_ = (async function knoxx$backend$domain$source$runtime$start_source_BANG_(config,source){
knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

var driver_id = new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(source);
var temp__5823__auto__ = (knoxx.backend.domain.driver.registry.driver.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.driver.cljs$core$IFn$_invoke$arity$1(driver_id) : knoxx.backend.domain.driver.registry.driver.call(null,driver_id));
if(cljs.core.truth_(temp__5823__auto__)){
var driver = temp__5823__auto__;
try{var result = (await (await (async function (){var G__30746 = driver;
var G__30747 = knoxx.backend.domain.source.runtime.source_start_context(config,source);
return (knoxx.backend.domain.driver.registry.start_source_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.driver.registry.start_source_BANG_.cljs$core$IFn$_invoke$arity$2(G__30746,G__30747) : knoxx.backend.domain.driver.registry.start_source_BANG_.call(null,G__30746,G__30747));
})()));
var status = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("driver","id","driver/id",475742764),(knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.driver_id.call(null,driver)),new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("source","actor","source/actor",-1066117892),new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source)], null),((cljs.core.map_QMARK_(result))?result:null)], 0));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.source.runtime.source_status_STAR_,cljs.core.assoc,new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),status);

return status;
}catch (e30734){var err = e30734;
var diagnostic = knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("source-runtime","start-source","source-runtime/start-source",-88752830),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword("driver","id","driver/id",475742764),(knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.driver_id.call(null,driver)),new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("source","actor","source/actor",-1066117892),new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source)], null),err);
var status = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"started?","started?",-1301062863),false,new cljs.core.Keyword(null,"failed","failed",-1397425762),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"source-start-failed","source-start-failed",-1089538585),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(diagnostic),new cljs.core.Keyword("driver","id","driver/id",475742764),(knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.driver_id.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.driver_id.call(null,driver)),new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("source","actor","source/actor",-1066117892),new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source)], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.source.runtime.source_status_STAR_,cljs.core.assoc,new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),status);

return status;
}} else {
var status = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"started?","started?",-1301062863),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"unknown-driver","unknown-driver",-535000893),new cljs.core.Keyword("driver","id","driver/id",475742764),driver_id,new cljs.core.Keyword("source","id","source/id",-271642087),new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword("source","actor","source/actor",-1066117892),new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source)], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.source.runtime.source_status_STAR_,cljs.core.assoc,new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source),status);

return status;
}
});
/**
 * Start/bind all enabled event source resources.
 */
knoxx.backend.domain.source.runtime.start_BANG_ = (async function knoxx$backend$domain$source$runtime$start_BANG_(config){
var results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__30760_SHARP_){
return knoxx.backend.domain.source.runtime.start_source_BANG_(config,p1__30760_SHARP_);
}),knoxx.backend.domain.source.runtime.source_resources(config)))));
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.domain.source.runtime.stop_BANG_ = (function knoxx$backend$domain$source$runtime$stop_BANG_(){
cljs.core.reset_BANG_(knoxx.backend.domain.source.runtime.source_status_STAR_,cljs.core.PersistentArrayMap.EMPTY);

return null;
});
knoxx.backend.domain.source.runtime.status = (function knoxx$backend$domain$source$runtime$status(){
return cljs.core.deref(knoxx.backend.domain.source.runtime.source_status_STAR_);
});

//# sourceMappingURL=knoxx.backend.domain.source.runtime.js.map
