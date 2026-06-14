import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.driver.registry.js";
goog.provide('knoxx.backend.domain.control.catalog');
knoxx.backend.domain.control.catalog.class__GT_kind = cljs.core.PersistentHashMap.fromArrays(["sources","capabilities","workflows","agents","users","actors","triggers","generators","schedules","roles","actions"],[new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"capability","capability",-223324340),new cljs.core.Keyword(null,"workflow","workflow",-640694607),new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword(null,"schedule","schedule",349275266),new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"action","action",-811238024)]);
knoxx.backend.domain.control.catalog.catalog_resource_kinds = new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword(null,"schedule","schedule",349275266),new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword(null,"source","source",-433931539)], null);
knoxx.backend.domain.control.catalog.agent_runtime_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 11, [new cljs.core.Keyword("trigger","action","trigger/action",-326545728),null,new cljs.core.Keyword("trigger","events","trigger/events",-1416397087),null,new cljs.core.Keyword("trigger","agent","trigger/agent",319106277),null,new cljs.core.Keyword(null,"source-mode","source-mode",725702471),null,new cljs.core.Keyword(null,"sources","sources",-321166424),null,new cljs.core.Keyword(null,"events","events",1792552201),null,new cljs.core.Keyword("trigger","schedule","trigger/schedule",-941544854),null,new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347),null,new cljs.core.Keyword(null,"trigger-kind","trigger-kind",1773988783),null,new cljs.core.Keyword(null,"source-kind","source-kind",-1955827566),null,new cljs.core.Keyword("trigger","source","trigger/source",622208693),null], null), null);
knoxx.backend.domain.control.catalog.trigger_schedule_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"schedule","schedule",349275266),null,new cljs.core.Keyword("schedule","rule","schedule/rule",369760610),null,new cljs.core.Keyword("trigger","schedule","trigger/schedule",-941544854),null], null), null);
knoxx.backend.domain.control.catalog.trigger_source_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"source-mode","source-mode",725702471),null,new cljs.core.Keyword(null,"source-kind","source-kind",-1955827566),null,new cljs.core.Keyword("trigger","source","trigger/source",622208693),null], null), null);
knoxx.backend.domain.control.catalog.nonblank = (function knoxx$backend$domain$control$catalog$nonblank(value){
var G__23961 = value;
var G__23961__$1 = (((G__23961 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23961)));
var G__23961__$2 = (((G__23961__$1 == null))?null:clojure.string.trim(G__23961__$1));
if((G__23961__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__23961__$2);
}
});
knoxx.backend.domain.control.catalog.resource_class = (function knoxx$backend$domain$control$catalog$resource_class(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.domain.control.catalog.resource_kind = (function knoxx$backend$domain$control$catalog$resource_kind(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.control.catalog.class__GT_kind,knoxx.backend.domain.control.catalog.resource_class(record));
}
});
knoxx.backend.domain.control.catalog.resource_id = (function knoxx$backend$domain$control$catalog$resource_id(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.domain.control.catalog.resource_definition = (function knoxx$backend$domain$control$catalog$resource_definition(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","definition","resource/definition",-1547661004).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.domain.control.catalog.resource_row = (function knoxx$backend$domain$control$catalog$resource_row(record){
var id = knoxx.backend.domain.control.catalog.resource_id(record);
var kind = knoxx.backend.domain.control.catalog.resource_kind(record);
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword("resource","id","resource/id",-822839770),id,new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),kind,new cljs.core.Keyword(null,"class","class",-2030961996),knoxx.backend.domain.control.catalog.resource_class(record),new cljs.core.Keyword(null,"resource","resource",251898836),knoxx.backend.domain.control.catalog.resource_definition(record)], null);
});
knoxx.backend.domain.control.catalog.resources_of_kind = (function knoxx$backend$domain$control$catalog$resources_of_kind(records,kind){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.control.catalog.resource_row,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__23987_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,knoxx.backend.domain.control.catalog.resource_kind(p1__23987_SHARP_));
}),records));
});
knoxx.backend.domain.control.catalog.resource_ids_of_kind = (function knoxx$backend$domain$control$catalog$resource_ids_of_kind(records,kind){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),knoxx.backend.domain.control.catalog.resources_of_kind(records,kind));
});
knoxx.backend.domain.control.catalog.forbidden_present = (function knoxx$backend$domain$control$catalog$forbidden_present(resource,forbidden_keys){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__23998_SHARP_){
return cljs.core.contains_QMARK_(resource,p1__23998_SHARP_);
}),forbidden_keys)));
});
knoxx.backend.domain.control.catalog.violation = (function knoxx$backend$domain$control$catalog$violation(record,kind,severity,message,data){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword("resource","id","resource/id",-822839770),knoxx.backend.domain.control.catalog.resource_id(record),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),knoxx.backend.domain.control.catalog.resource_kind(record),new cljs.core.Keyword("violation","kind","violation/kind",887244178),kind,new cljs.core.Keyword(null,"severity","severity",175684886),severity,new cljs.core.Keyword(null,"message","message",-406056002),message,new cljs.core.Keyword(null,"data","data",-232669377),data], null);
});
knoxx.backend.domain.control.catalog.agent_violations = (function knoxx$backend$domain$control$catalog$agent_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
var forbidden = knoxx.backend.domain.control.catalog.forbidden_present(resource,knoxx.backend.domain.control.catalog.agent_runtime_keys);
if(cljs.core.seq(forbidden)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("agent","contains-runtime-agreement","agent/contains-runtime-agreement",78476613),new cljs.core.Keyword(null,"block","block",664686210),"Agent resources must not define triggers, schedules, generators, or source declarations. Agents define prompting, roles, capabilities, ownership, and policy only.",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"keys","keys",1068423698),forbidden], null))], null);
} else {
return null;
}
});
knoxx.backend.domain.control.catalog.missing_trigger_field_violations = (function knoxx$backend$domain$control$catalog$missing_trigger_field_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
var G__24031 = cljs.core.PersistentVector.EMPTY;
var G__24031__$1 = ((cljs.core.not(new cljs.core.Keyword("trigger","action","trigger/action",-326545728).cljs$core$IFn$_invoke$arity$1(resource)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24031,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("trigger","missing-action","trigger/missing-action",-125814102),new cljs.core.Keyword(null,"block","block",664686210),"Trigger resources must reference an action resource or registered action key.",cljs.core.PersistentArrayMap.EMPTY)):G__24031);
if(cljs.core.empty_QMARK_(new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(resource))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24031__$1,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("trigger","missing-events","trigger/missing-events",-1294166205),new cljs.core.Keyword(null,"block","block",664686210),"Trigger resources must declare observed event types; schedules generate events separately.",cljs.core.PersistentArrayMap.EMPTY));
} else {
return G__24031__$1;
}
});
knoxx.backend.domain.control.catalog.misplaced_trigger_field_violations = (function knoxx$backend$domain$control$catalog$misplaced_trigger_field_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
var schedule_keys = knoxx.backend.domain.control.catalog.forbidden_present(resource,knoxx.backend.domain.control.catalog.trigger_schedule_keys);
var source_keys = knoxx.backend.domain.control.catalog.forbidden_present(resource,knoxx.backend.domain.control.catalog.trigger_source_keys);
var G__24048 = cljs.core.PersistentVector.EMPTY;
var G__24048__$1 = ((cljs.core.seq(schedule_keys))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24048,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("trigger","contains-schedule","trigger/contains-schedule",-966166068),new cljs.core.Keyword(null,"block","block",664686210),"Schedule rules belong in schedule resources. Triggers only agree to act after observing an event that meets a condition.",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"keys","keys",1068423698),schedule_keys], null))):G__24048);
if(cljs.core.seq(source_keys)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24048__$1,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("trigger","contains-source","trigger/contains-source",-2010188420),new cljs.core.Keyword(null,"block","block",664686210),"Source declarations belong in source resources. Triggers observe event types and do not bind directly to source implementations.",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"keys","keys",1068423698),source_keys], null)));
} else {
return G__24048__$1;
}
});
knoxx.backend.domain.control.catalog.trigger_violations = (function knoxx$backend$domain$control$catalog$trigger_violations(record){
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.control.catalog.missing_trigger_field_violations(record),knoxx.backend.domain.control.catalog.misplaced_trigger_field_violations(record)));
});
knoxx.backend.domain.control.catalog.action_violations = (function knoxx$backend$domain$control$catalog$action_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
if(cljs.core.truth_((function (){var or__5162__auto__ = new cljs.core.Keyword("action","kind","action/kind",-2113018193).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword("action","handler","action/handler",-645534418).cljs$core$IFn$_invoke$arity$1(resource);
}
})())){
return null;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("action","missing-handler","action/missing-handler",1899530604),new cljs.core.Keyword(null,"block","block",664686210),"Action resources must identify the registered behavior they expose.",cljs.core.PersistentArrayMap.EMPTY)], null);
}
});
knoxx.backend.domain.control.catalog.schedule_violations = (function knoxx$backend$domain$control$catalog$schedule_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
var G__24078 = cljs.core.PersistentVector.EMPTY;
var G__24078__$1 = ((cljs.core.not((function (){var or__5162__auto__ = new cljs.core.Keyword("schedule","rule","schedule/rule",369760610).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("schedule","cron","schedule/cron",1472284154).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword("schedule","at","schedule/at",833824208).cljs$core$IFn$_invoke$arity$1(resource);
}
}
})()))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24078,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("schedule","missing-temporal-rule","schedule/missing-temporal-rule",205642485),new cljs.core.Keyword(null,"block","block",664686210),"Schedule resources must define a temporal rule for emitting a synthetic event.",cljs.core.PersistentArrayMap.EMPTY)):G__24078);
if(cljs.core.not(new cljs.core.Keyword("schedule","event","schedule/event",-1500446599).cljs$core$IFn$_invoke$arity$1(resource))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24078__$1,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("schedule","missing-event","schedule/missing-event",-529491787),new cljs.core.Keyword(null,"block","block",664686210),"Schedule resources must define the synthetic event they will emit.",cljs.core.PersistentArrayMap.EMPTY));
} else {
return G__24078__$1;
}
});
knoxx.backend.domain.control.catalog.generator_violations = (function knoxx$backend$domain$control$catalog$generator_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
if(cljs.core.truth_((function (){var or__5162__auto__ = new cljs.core.Keyword("generator","kind","generator/kind",-1537705148).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("generator","driver","generator/driver",1266086795).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword("generator","emits","generator/emits",-2102136484).cljs$core$IFn$_invoke$arity$1(resource);
}
}
})())){
return null;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("generator","missing-event-production-resource","generator/missing-event-production-resource",-1405610833),new cljs.core.Keyword(null,"block","block",664686210),"Generator resources must declare how they produce events.",cljs.core.PersistentArrayMap.EMPTY)], null);
}
});
knoxx.backend.domain.control.catalog.event_source_QMARK_ = (function knoxx$backend$domain$control$catalog$event_source_QMARK_(resource){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"event-generator","event-generator",-1376529156),new cljs.core.Keyword("source","type","source/type",-1735501385).cljs$core$IFn$_invoke$arity$1(resource))) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("event-generator",new cljs.core.Keyword("source","type","source/type",-1735501385).cljs$core$IFn$_invoke$arity$1(resource))) || (((cljs.core.seq(new cljs.core.Keyword("source","listens","source/listens",-136351302).cljs$core$IFn$_invoke$arity$1(resource))) || (cljs.core.seq(new cljs.core.Keyword("source","emits","source/emits",-45927756).cljs$core$IFn$_invoke$arity$1(resource))))))));
});
knoxx.backend.domain.control.catalog.missing_source_declaration_violations = (function knoxx$backend$domain$control$catalog$missing_source_declaration_violations(record,resource,source_listens,driver){
var G__24098 = cljs.core.PersistentVector.EMPTY;
var G__24098__$1 = ((((knoxx.backend.domain.control.catalog.event_source_QMARK_(resource)) && (cljs.core.not(driver))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24098,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","missing-driver","source/missing-driver",924304143),new cljs.core.Keyword(null,"block","block",664686210),"Event source resources must declare the ClojureScript driver implementation they use.",cljs.core.PersistentArrayMap.EMPTY)):G__24098);
var G__24098__$2 = ((((knoxx.backend.domain.control.catalog.event_source_QMARK_(resource)) && (cljs.core.not(new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(resource)))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24098__$1,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","missing-actor","source/missing-actor",-1486125830),new cljs.core.Keyword(null,"block","block",664686210),"Event source resources must declare the actor identity that owns credentials and dispatches selected events.",cljs.core.PersistentArrayMap.EMPTY)):G__24098__$1);
var G__24098__$3 = ((((knoxx.backend.domain.control.catalog.event_source_QMARK_(resource)) && (cljs.core.empty_QMARK_(source_listens))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24098__$2,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","missing-listens","source/missing-listens",1884067276),new cljs.core.Keyword(null,"block","block",664686210),"Event source resources must declare :source/listens, the driver event types this source cares about.",cljs.core.PersistentArrayMap.EMPTY)):G__24098__$2);
if(cljs.core.seq(new cljs.core.Keyword("source","emits","source/emits",-45927756).cljs$core$IFn$_invoke$arity$1(resource))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24098__$3,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","declares-emits","source/declares-emits",-1541869174),new cljs.core.Keyword(null,"block","block",664686210),"Source resources must not define emitted event shapes. Driver code owns event specs; sources select events with :source/listens.",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"declared","declared",92336021),new cljs.core.Keyword("source","emits","source/emits",-45927756).cljs$core$IFn$_invoke$arity$1(resource)], null)));
} else {
return G__24098__$3;
}
});
knoxx.backend.domain.control.catalog.source_driver_violations = (function knoxx$backend$domain$control$catalog$source_driver_violations(record,resource,source_listens,driver){
var G__24115 = cljs.core.PersistentVector.EMPTY;
var G__24115__$1 = (cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.domain.control.catalog.event_source_QMARK_(resource);
if(and__5160__auto__){
var and__5160__auto____$1 = driver;
if(cljs.core.truth_(and__5160__auto____$1)){
return cljs.core.not((knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.registered_driver_QMARK_.call(null,driver)));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24115,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","unknown-driver","source/unknown-driver",1388450000),new cljs.core.Keyword(null,"block","block",664686210),"Source resources must reference a registered ClojureScript driver implementation.",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"driver","driver",1515263546),driver,new cljs.core.Keyword(null,"registered","registered",-388600037),(knoxx.backend.domain.driver.registry.registered_driver_ids.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.driver.registry.registered_driver_ids.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.driver.registry.registered_driver_ids.call(null))], null))):G__24115);
if(cljs.core.truth_((function (){var and__5160__auto__ = knoxx.backend.domain.control.catalog.event_source_QMARK_(resource);
if(and__5160__auto__){
var and__5160__auto____$1 = driver;
if(cljs.core.truth_(and__5160__auto____$1)){
var and__5160__auto____$2 = (knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.registered_driver_QMARK_.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.registered_driver_QMARK_.call(null,driver));
if(cljs.core.truth_(and__5160__auto____$2)){
return cljs.core.not((knoxx.backend.domain.driver.registry.listened_by_driver_QMARK_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.listened_by_driver_QMARK_.cljs$core$IFn$_invoke$arity$1(resource) : knoxx.backend.domain.driver.registry.listened_by_driver_QMARK_.call(null,resource)));
} else {
return and__5160__auto____$2;
}
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__24115__$1,knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("source","listens-unemitted-event","source/listens-unemitted-event",16271957),new cljs.core.Keyword(null,"block","block",664686210),"Source resources may only listen to event types emitted by their selected driver implementation.",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"driver","driver",1515263546),driver,new cljs.core.Keyword(null,"listens","listens",-1584670221),source_listens,new cljs.core.Keyword(null,"driver-emits","driver-emits",1042637703),(knoxx.backend.domain.driver.registry.emitted_event_types.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.emitted_event_types.cljs$core$IFn$_invoke$arity$1(driver) : knoxx.backend.domain.driver.registry.emitted_event_types.call(null,driver))], null)));
} else {
return G__24115__$1;
}
});
knoxx.backend.domain.control.catalog.source_violations = (function knoxx$backend$domain$control$catalog$source_violations(record){
var resource = knoxx.backend.domain.control.catalog.resource_definition(record);
var source_listens = (knoxx.backend.domain.driver.registry.source_listens.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.driver.registry.source_listens.cljs$core$IFn$_invoke$arity$1(resource) : knoxx.backend.domain.driver.registry.source_listens.call(null,resource));
var driver = new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(resource);
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.control.catalog.missing_source_declaration_violations(record,resource,source_listens,driver),knoxx.backend.domain.control.catalog.source_driver_violations(record,resource,source_listens,driver)));
});
knoxx.backend.domain.control.catalog.legacy_source_mode_violations = (function knoxx$backend$domain$control$catalog$legacy_source_mode_violations(records){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (record){
return knoxx.backend.domain.control.catalog.violation(record,new cljs.core.Keyword("legacy","source-mode-resource","legacy/source-mode-resource",217451077),new cljs.core.Keyword(null,"warn","warn",-436710552),"Source-mode resources are legacy prompt-context adapters. Event producers should be declared as source resources that select registered driver events.",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"class","class",-2030961996),"source_modes"], null));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24133_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source_modes",knoxx.backend.domain.control.catalog.resource_class(p1__24133_SHARP_));
}),records));
});
knoxx.backend.domain.control.catalog.violations = (function knoxx$backend$domain$control$catalog$violations(records){
var rows = cljs.core.vec((function (){var or__5162__auto__ = records;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.agent_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24138_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"agent","agent",-766455027),knoxx.backend.domain.control.catalog.resource_kind(p1__24138_SHARP_));
}),rows)], 0)),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.trigger_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24139_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"trigger","trigger",103466139),knoxx.backend.domain.control.catalog.resource_kind(p1__24139_SHARP_));
}),rows)], 0)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.action_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24140_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"action","action",-811238024),knoxx.backend.domain.control.catalog.resource_kind(p1__24140_SHARP_));
}),rows)], 0)),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.schedule_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24141_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"schedule","schedule",349275266),knoxx.backend.domain.control.catalog.resource_kind(p1__24141_SHARP_));
}),rows)], 0)),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.generator_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24142_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"generator","generator",-572962281),knoxx.backend.domain.control.catalog.resource_kind(p1__24142_SHARP_));
}),rows)], 0)),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.control.catalog.source_violations,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__24143_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"source","source",-433931539),knoxx.backend.domain.control.catalog.resource_kind(p1__24143_SHARP_));
}),rows)], 0)),knoxx.backend.domain.control.catalog.legacy_source_mode_violations(rows)], 0)));
});
knoxx.backend.domain.control.catalog.catalog = (function knoxx$backend$domain$control$catalog$catalog(records){
var rows = cljs.core.vec((function (){var or__5162__auto__ = records;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var current_violations = knoxx.backend.domain.control.catalog.violations(rows);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"resources","resources",1632806811),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (kind){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [kind,knoxx.backend.domain.control.catalog.resources_of_kind(rows,kind)], null);
}),knoxx.backend.domain.control.catalog.catalog_resource_kinds)),new cljs.core.Keyword(null,"catalog","catalog",-439057154),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword("catalog","resources","catalog/resources",1077151556),cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (kind){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [kind,knoxx.backend.domain.control.catalog.resource_ids_of_kind(rows,kind)], null);
}),knoxx.backend.domain.control.catalog.catalog_resource_kinds))], null),new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"agents-are-executables","agents-are-executables",1898183326),true,new cljs.core.Keyword(null,"triggers-are-event-action-agreements","triggers-are-event-action-agreements",2003904919),true,new cljs.core.Keyword(null,"schedules-emit-synthetic-events","schedules-emit-synthetic-events",-1546718728),true,new cljs.core.Keyword(null,"drivers-are-code","drivers-are-code",833700727),true,new cljs.core.Keyword(null,"sources-listen-to-driver-events","sources-listen-to-driver-events",33897780),true], null),new cljs.core.Keyword(null,"admissibility","admissibility",-725285004),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok?","ok?",447310304),cljs.core.empty_QMARK_(current_violations),new cljs.core.Keyword(null,"violations","violations",835165468),current_violations], null)], null);
});
knoxx.backend.domain.control.catalog.option_name = (function knoxx$backend$domain$control$catalog$option_name(value){
if((value instanceof cljs.core.Keyword)){
return knoxx.backend.domain.control.catalog.nonblank(cljs.core.name(value));
} else {
return knoxx.backend.domain.control.catalog.nonblank(value);
}
});
knoxx.backend.domain.control.catalog.generator_option = (function knoxx$backend$domain$control$catalog$generator_option(resource){
return knoxx.backend.domain.control.catalog.option_name((function (){var or__5162__auto__ = new cljs.core.Keyword("generator","kind","generator/kind",-1537705148).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("generator","driver","generator/driver",1266086795).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("source","type","source/type",-1735501385).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(resource);
}
}
}
})());
});
knoxx.backend.domain.control.catalog.generator_kind_options = (function knoxx$backend$domain$control$catalog$generator_kind_options(records){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p__24165){
var map__24169 = p__24165;
var map__24169__$1 = cljs.core.__destructure_map(map__24169);
var resource = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__24169__$1,new cljs.core.Keyword(null,"resource","resource",251898836));
return knoxx.backend.domain.control.catalog.generator_option(resource);
}),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__24161_SHARP_){
return knoxx.backend.domain.control.catalog.resources_of_kind(cljs.core.vec((function (){var or__5162__auto__ = records;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),p1__24161_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword(null,"source","source",-433931539)], null)], 0))))));
});
knoxx.backend.domain.control.catalog.trigger_kind_options = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["event"], null);

//# sourceMappingURL=knoxx.backend.domain.control.catalog.js.map
