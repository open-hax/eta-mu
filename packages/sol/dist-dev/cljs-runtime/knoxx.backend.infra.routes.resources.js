import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.set.js";
import "./clojure.string.js";
import "./cljs.reader.js";
import "./knoxx.backend.domain.contracts.resolve.js";
import "./knoxx.backend.infra.event_runtime.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.domain.resources.loader.js";
import "./knoxx.backend.law.contracts.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
goog.provide('knoxx.backend.infra.routes.resources');
knoxx.backend.infra.routes.resources.resource_watch_debounce_ms = (350);
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.resources !== 'undefined') && (typeof knoxx.backend.infra.routes.resources.resource_watchers_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.resources.resource_watchers_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.resources !== 'undefined') && (typeof knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.resources !== 'undefined') && (typeof knoxx.backend.infra.routes.resources.resource_watch_running_QMARK__STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.resources.resource_watch_running_QMARK__STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false);
}
knoxx.backend.infra.routes.resources.normalize_resource_class = (function knoxx$backend$infra$routes$resources$normalize_resource_class(raw){
return knoxx.backend.domain.resources.loader.resource_class(raw);
});
/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.normalize_contract_class = (function knoxx$backend$infra$routes$resources$normalize_contract_class(raw){
return knoxx.backend.infra.routes.resources.normalize_resource_class(raw);
});
knoxx.backend.infra.routes.resources.resource_id__GT_index_key = (function knoxx$backend$infra$routes$resources$resource_id__GT_index_key(resource_class,resource_id){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.resources.normalize_resource_class(resource_class))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_id));
});
knoxx.backend.infra.routes.resources.model_id__GT_slug = (function knoxx$backend$infra$routes$resources$model_id__GT_slug(model_id){
var G__31040 = model_id;
var G__31040__$1 = (((G__31040 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31040)));
var G__31040__$2 = (((G__31040__$1 == null))?null:clojure.string.replace(G__31040__$1,/[^A-Za-z0-9._-]+/,"_"));
if((G__31040__$2 == null)){
return null;
} else {
return clojure.string.replace(G__31040__$2,/_+/,"_");
}
});
knoxx.backend.infra.routes.resources.parsed_resource_id = (function knoxx$backend$infra$routes$resources$parsed_resource_id(resource_class,value){
var G__31048 = knoxx.backend.infra.routes.resources.normalize_resource_class(resource_class);
switch (G__31048) {
case "agents":
var G__31063 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31063 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31063));
}

break;
case "policies":
var G__31067 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31067 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31067));
}

break;
case "sources":
var G__31068 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31068 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31068));
}

break;
case "actions":
var G__31073 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31073 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31073));
}

break;
case "triggers":
var G__31074 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31074 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31074));
}

break;
case "sub_agents":
var G__31075 = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(value);
if((G__31075 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31075));
}

break;
case "actors":
var G__31077 = new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(value);
if((G__31077 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31077));
}

break;
case "roles":
var G__31082 = new cljs.core.Keyword("role","id","role/id",-1375589954).cljs$core$IFn$_invoke$arity$1(value);
if((G__31082 == null)){
return null;
} else {
return cljs.core.name(G__31082);
}

break;
case "capabilities":
var G__31092 = new cljs.core.Keyword("cap","id","cap/id",-1388434846).cljs$core$IFn$_invoke$arity$1(value);
if((G__31092 == null)){
return null;
} else {
return cljs.core.name(G__31092);
}

break;
case "model_families":
var G__31114 = new cljs.core.Keyword("model-family","id","model-family/id",969625548).cljs$core$IFn$_invoke$arity$1(value);
if((G__31114 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31114));
}

break;
case "models":
var G__31117 = new cljs.core.Keyword("model","id","model/id",-1274892501).cljs$core$IFn$_invoke$arity$1(value);
if((G__31117 == null)){
return null;
} else {
return knoxx.backend.infra.routes.resources.model_id__GT_slug(G__31117);
}

break;
default:
return null;

}
});
knoxx.backend.infra.routes.resources.wire_key = (function knoxx$backend$infra$routes$resources$wire_key(key){
if((key instanceof cljs.core.Keyword)){
var temp__5823__auto__ = cljs.core.namespace(key);
if(cljs.core.truth_(temp__5823__auto__)){
var key_ns = temp__5823__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key_ns)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(key)));
} else {
return cljs.core.name(key);
}
} else {
return key;
}
});
knoxx.backend.infra.routes.resources.wire_value = (function knoxx$backend$infra$routes$resources$wire_value(value){
if((value instanceof cljs.core.Keyword)){
return knoxx.backend.infra.routes.resources.wire_key(value);
} else {
if((value instanceof cljs.core.Symbol)){
return knoxx.backend.infra.routes.resources.wire_key(value);
} else {
if(cljs.core.map_QMARK_(value)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p__31141){
var vec__31148 = p__31141;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31148,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31148,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.routes.resources.wire_key(k),(knoxx.backend.infra.routes.resources.wire_value.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.infra.routes.resources.wire_value.cljs$core$IFn$_invoke$arity$1(v) : knoxx.backend.infra.routes.resources.wire_value.call(null,v))], null);
})),value);
} else {
if(cljs.core.set_QMARK_(value)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.wire_value,value);
} else {
if(cljs.core.sequential_QMARK_(value)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.wire_value,value);
} else {
return value;

}
}
}
}
}
});
knoxx.backend.infra.routes.resources.keywordish_name = (function knoxx$backend$infra$routes$resources$keywordish_name(value){
if((value instanceof cljs.core.Keyword)){
return knoxx.backend.infra.routes.resources.wire_key(value);
} else {
if((value instanceof cljs.core.Symbol)){
return knoxx.backend.infra.routes.resources.wire_key(value);
} else {
if((!((value == null)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
} else {
return null;

}
}
}
});
knoxx.backend.infra.routes.resources.record_definition = (function knoxx$backend$infra$routes$resources$record_definition(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","definition","resource/definition",-1547661004).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.infra.routes.resources.record_class = (function knoxx$backend$infra$routes$resources$record_class(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record);
}
});
knoxx.backend.infra.routes.resources.record_kind = (function knoxx$backend$infra$routes$resources$record_kind(record){
var or__5162__auto__ = new cljs.core.Keyword("resource","kind","resource/kind",-1047940985).cljs$core$IFn$_invoke$arity$1(record);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__31193 = knoxx.backend.infra.routes.resources.record_class(record);
if((G__31193 == null)){
return null;
} else {
return knoxx.backend.domain.resources.loader.normalize_resource_kind(G__31193);
}
}
});
knoxx.backend.infra.routes.resources.trigger_summary = (function knoxx$backend$infra$routes$resources$trigger_summary(record){
var resource = knoxx.backend.infra.routes.resources.record_definition(record);
var events = knoxx.backend.infra.routes.resources.wire_value(new cljs.core.Keyword("trigger","events","trigger/events",-1416397087).cljs$core$IFn$_invoke$arity$1(resource));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"kind","kind",-717265803),knoxx.backend.infra.routes.resources.keywordish_name(new cljs.core.Keyword("trigger","kind","trigger/kind",-1801339347).cljs$core$IFn$_invoke$arity$1(resource)),new cljs.core.Keyword(null,"target","target",253001721),(function (){var or__5162__auto__ = new cljs.core.Keyword("trigger","target","trigger/target",-834253503).cljs$core$IFn$_invoke$arity$1(resource);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("trigger","with","trigger/with",-450753924),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword("trigger","agent","trigger/agent",319106277).cljs$core$IFn$_invoke$arity$1(resource);
}
}
})(),new cljs.core.Keyword(null,"events","events",1792552201),events,new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"events","events",1792552201),events], null),new cljs.core.Keyword(null,"filters","filters",974726919),knoxx.backend.infra.routes.resources.wire_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"filters","filters",974726919)], null))),new cljs.core.Keyword(null,"context","context",-830191113),knoxx.backend.infra.routes.resources.wire_value(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"context","context",-830191113)], null)))], null);
});
knoxx.backend.infra.routes.resources.action_summary = (function knoxx$backend$infra$routes$resources$action_summary(record){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"handler","handler",-195596612),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.record_definition(record),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","handler","action/handler",-645534418)], null))], null);
});
knoxx.backend.infra.routes.resources.resource_list_summary = (function knoxx$backend$infra$routes$resources$resource_list_summary(record){
var resource_class = knoxx.backend.infra.routes.resources.record_class(record);
var resource_kind = knoxx.backend.infra.routes.resources.record_kind(record);
var summary = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword("resource","id","resource/id",-822839770),new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),resource_kind,new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831),resource_class,new cljs.core.Keyword(null,"kind","kind",-717265803),(function (){var G__31224 = resource_kind;
if((G__31224 == null)){
return null;
} else {
return cljs.core.name(G__31224);
}
})(),new cljs.core.Keyword(null,"path","path",-188191168),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_class)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record))+".edn")], null);
var G__31227 = summary;
var G__31227__$1 = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"trigger","trigger",103466139),resource_kind))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31227,new cljs.core.Keyword(null,"trigger","trigger",103466139),knoxx.backend.infra.routes.resources.trigger_summary(record)):G__31227);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"action","action",-811238024),resource_kind)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31227__$1,new cljs.core.Keyword(null,"action","action",-811238024),knoxx.backend.infra.routes.resources.action_summary(record));
} else {
return G__31227__$1;
}
});
/**
 * Compatibility summary for old /contracts clients.
 */
knoxx.backend.infra.routes.resources.contract_list_summary = (function knoxx$backend$infra$routes$resources$contract_list_summary(record){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.resources.resource_list_summary(record),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),knoxx.backend.infra.routes.resources.record_class(record));
});
knoxx.backend.infra.routes.resources.wire_validation = (function knoxx$backend$infra$routes$resources$wire_validation(validation){
var G__31243 = validation;
if(cljs.core.truth_(new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation))){
return cljs.core.update.cljs$core$IFn$_invoke$arity$3(G__31243,new cljs.core.Keyword(null,"contract","contract",798152745),knoxx.backend.infra.routes.resources.wire_value);
} else {
return G__31243;
}
});
knoxx.backend.infra.routes.resources.validation_warning = (function knoxx$backend$infra$routes$resources$validation_warning(path,message){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"path","path",-188191168),path,new cljs.core.Keyword(null,"message","message",-406056002),message,new cljs.core.Keyword(null,"severity","severity",175684886),"warn"], null);
});
knoxx.backend.infra.routes.resources.mutable_agent_data_keys = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 10, [new cljs.core.Keyword(null,"world_state","world_state",529599040),null,new cljs.core.Keyword(null,"plot-log","plot-log",-694242173),null,new cljs.core.Keyword(null,"composition_log","composition_log",-2025208376),null,new cljs.core.Keyword(null,"composition_count","composition_count",-1424343955),null,new cljs.core.Keyword(null,"composition-count","composition-count",1854681261),null,new cljs.core.Keyword(null,"plot_log","plot_log",-1697696176),null,new cljs.core.Keyword(null,"last_tick_timestamp","last_tick_timestamp",-1196930473),null,new cljs.core.Keyword(null,"last-tick-timestamp","last-tick-timestamp",1448757689),null,new cljs.core.Keyword(null,"composition-log","composition-log",-150702535),null,new cljs.core.Keyword(null,"world-state","world-state",1712647065),null], null), null);
knoxx.backend.infra.routes.resources.positive_int = (function knoxx$backend$infra$routes$resources$positive_int(value){
var n = parseInt(value,(10));
if(((typeof n === 'number') && (((cljs.core.not(isNaN(n))) && ((n > (0))))))){
return n;
} else {
return null;
}
});
knoxx.backend.infra.routes.resources.role_ref_warnings = (function knoxx$backend$infra$routes$resources$role_ref_warnings(path,value){
var warn_bare = knoxx.backend.infra.routes.resources.validation_warning(path,"Role refs should use :role/<kebab-slug>; bare or snake_case role refs are tolerated but cause drift.");
var warn_snake = knoxx.backend.infra.routes.resources.validation_warning(path,"Role refs should use kebab-case, e.g. :role/contract-librarian, not underscores.");
if((value instanceof cljs.core.Keyword)){
var G__31273 = cljs.core.PersistentVector.EMPTY;
var G__31273__$1 = ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("role",cljs.core.namespace(value)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31273,warn_bare):G__31273);
if(clojure.string.includes_QMARK_(cljs.core.name(value),"_")){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31273__$1,warn_snake);
} else {
return G__31273__$1;
}
} else {
if(typeof value === 'string'){
var G__31277 = cljs.core.PersistentVector.EMPTY;
if(clojure.string.includes_QMARK_(value,"_")){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31277,warn_snake);
} else {
return G__31277;
}
} else {
return cljs.core.PersistentVector.EMPTY;

}
}
});
knoxx.backend.infra.routes.resources.prompt_state_path_warnings = (function knoxx$backend$infra$routes$resources$prompt_state_path_warnings(resource){
var prompts = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"system","system",-29381724)], null)),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null))], null);
var stale_ref_QMARK_ = cljs.core.some((function (prompt){
var and__5160__auto__ = typeof prompt === 'string';
if(and__5160__auto__){
return cljs.core.re_find(/(:data\/|\/world_state|\/plot_log|:data\/world_state|:data\/plot_log)/,prompt);
} else {
return and__5160__auto__;
}
}),prompts);
if(cljs.core.truth_(stale_ref_QMARK_)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["prompts"], null),"Prompt references mutable :data paths (for example :data/world_state or :data/plot_log). Agent resource :data is static config; use a real state store or durable files instead.")], null);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.routes.resources.agent_resource_warnings = (function knoxx$backend$infra$routes$resources$agent_resource_warnings(resource){
var data = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(resource);
var source_config = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"source","source",-433931539)], null));
var max_messages = knoxx.backend.infra.routes.resources.positive_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"max-messages","max-messages",-1089461657).cljs$core$IFn$_invoke$arity$1(source_config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"maxMessages","maxMessages",1680581379).cljs$core$IFn$_invoke$arity$1(source_config);
}
})());
var role = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"role","role",-736691072)], null));
var roles = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"roles","roles",143379530)], null));
var source_mode = new cljs.core.Keyword(null,"source-mode","source-mode",725702471).cljs$core$IFn$_invoke$arity$1(resource);
var filters = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resource,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"data","data",-232669377),new cljs.core.Keyword(null,"filters","filters",974726919)], null));
var channels = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channels","channels",1132759174).cljs$core$IFn$_invoke$arity$1(filters);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var publish_channels = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"publishChannels","publishChannels",45677262).cljs$core$IFn$_invoke$arity$1(filters);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"publish_channels","publish_channels",2144419461).cljs$core$IFn$_invoke$arity$1(filters);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})();
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic((function (){var G__31336 = cljs.core.PersistentVector.EMPTY;
var G__31336__$1 = ((cljs.core.contains_QMARK_(data,new cljs.core.Keyword(null,"filter","filter",-948537934)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["data","filter"], null),"Runtime ignores :data/:filter. Use :data/:filters.")):G__31336);
var G__31336__$2 = ((cljs.core.contains_QMARK_(resource,new cljs.core.Keyword(null,"source","source",-433931539)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336__$1,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["source"], null),"Event-agent runtime ignores top-level :source. Use :data {:source ...}.")):G__31336__$1);
var G__31336__$3 = ((cljs.core.contains_QMARK_(resource,new cljs.core.Keyword(null,"capabilities","capabilities",212739361)))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336__$2,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["capabilities"], null),"Top-level :capabilities is legacy/inert in resource resolution. Put capability refs under :actor {:capabilities [...]}, or grant them through roles.")):G__31336__$2);
var G__31336__$4 = (cljs.core.truth_((function (){var and__5160__auto__ = max_messages;
if(cljs.core.truth_(and__5160__auto__)){
return (max_messages > (100));
} else {
return and__5160__auto__;
}
})())?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336__$3,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["data","source","max-messages"], null),"Event-agent source max-messages is clamped to 100 at runtime.")):G__31336__$3);
var G__31336__$5 = (((((source_mode instanceof cljs.core.Keyword)) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("source-mode",cljs.core.namespace(source_mode))) && (cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"template-synthesize","template-synthesize",-173205919),null,new cljs.core.Keyword(null,"synthesize","synthesize",-226517101),null], null), null),source_mode))))))?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336__$4,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["source-mode"], null),"Use :source-mode/discord-synthesis instead of opaque bare synthesis modes.")):G__31336__$4);
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("source-mode","discord-synthesis","source-mode/discord-synthesis",-1910904203),source_mode)) && (((cljs.core.empty_QMARK_(channels)) && (cljs.core.seq(publish_channels)))))){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__31336__$5,knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["data","filters","publishChannels"], null),":publishChannels are output sinks only. Add explicit :channels or :guildIds for Discord source reads."));
} else {
return G__31336__$5;
}
})(),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (k){
if(cljs.core.contains_QMARK_(data,k)){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.routes.resources.validation_warning(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["data",cljs.core.name(k)], null),"This looks like mutable runtime state inside a static resource. Prefer Mongo/OpenPlanner/durable files, not resource :data mutation.")], null);
} else {
return null;
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.routes.resources.mutable_agent_data_keys], 0)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.routes.resources.role_ref_warnings(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["agent","role"], null),role),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p__31389){
var vec__31391 = p__31389;
var idx = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31391,(0),null);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31391,(1),null);
return knoxx.backend.infra.routes.resources.role_ref_warnings(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["agent","roles",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx))], null),value);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,(function (){var or__5162__auto__ = roles;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], 0)),knoxx.backend.infra.routes.resources.prompt_state_path_warnings(resource)], 0)));
});
knoxx.backend.infra.routes.resources.resource_warnings = (function knoxx$backend$infra$routes$resources$resource_warnings(resource_class,resource){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.normalize_resource_class(resource_class),"agents")) && (cljs.core.map_QMARK_(resource)))){
return knoxx.backend.infra.routes.resources.agent_resource_warnings(resource);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
knoxx.backend.infra.routes.resources.validate_resource_edn = (function knoxx$backend$infra$routes$resources$validate_resource_edn(resource_class,edn_text){
var trimmed = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text)));
if(clojure.string.blank_QMARK_(trimmed)){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"contract","contract",798152745),null,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"path","path",-188191168),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"message","message",-406056002),"EDN text is empty"], null)], null),new cljs.core.Keyword(null,"warnings","warnings",-735437651),cljs.core.PersistentVector.EMPTY], null);
} else {
try{var raw_resource = cljs.reader.read_string.cljs$core$IFn$_invoke$arity$1(trimmed);
var resource = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.normalize_resource_class(resource_class),"agents"))?knoxx.backend.domain.actor.scope.normalize_agent_contract(raw_resource):raw_resource);
var base = knoxx.backend.law.contracts.validate.cljs$core$IFn$_invoke$arity$2(resource_class,resource);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(base),new cljs.core.Keyword(null,"contract","contract",798152745),resource,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(base),new cljs.core.Keyword(null,"warnings","warnings",-735437651),knoxx.backend.infra.routes.resources.resource_warnings(resource_class,resource)], null);
}catch (e31409){var err = e31409;
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"contract","contract",798152745),null,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"path","path",-188191168),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"message","message",-406056002),(""+"EDN parse error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null)], null),new cljs.core.Keyword(null,"warnings","warnings",-735437651),cljs.core.PersistentVector.EMPTY], null);
}}
});
/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.validate_contract_edn = (function knoxx$backend$infra$routes$resources$validate_contract_edn(contract_class,edn_text){
return knoxx.backend.infra.routes.resources.validate_resource_edn(contract_class,edn_text);
});
knoxx.backend.infra.routes.resources.safe_resource_id = (function knoxx$backend$infra$routes$resources$safe_resource_id(raw_id){
try{return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"id","id",-1388402092),knoxx.backend.domain.resources.loader.safe_resource_id_BANG_(raw_id)], null);
}catch (e31422){var err = e31422;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})()], null);
}});
/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.safe_contract_id = (function knoxx$backend$infra$routes$resources$safe_contract_id(raw_id){
return knoxx.backend.infra.routes.resources.safe_resource_id(raw_id);
});
knoxx.backend.infra.routes.resources.safe_resource_class = (function knoxx$backend$infra$routes$resources$safe_resource_class(raw_class){
try{return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"class","class",-2030961996),knoxx.backend.infra.routes.resources.normalize_resource_class(raw_class)], null);
}catch (e31438){var err = e31438;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})()], null);
}});
/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.safe_contract_class = (function knoxx$backend$infra$routes$resources$safe_contract_class(raw_class){
return knoxx.backend.infra.routes.resources.safe_resource_class(raw_class);
});
knoxx.backend.infra.routes.resources.update_resource_id_in_edn_text = (function knoxx$backend$infra$routes$resources$update_resource_id_in_edn_text(resource_class,edn_text,new_id){
var G__31455 = knoxx.backend.infra.routes.resources.normalize_resource_class(resource_class);
switch (G__31455) {
case "agents":
if(clojure.string.includes_QMARK_(edn_text,":contract/id")){
return clojure.string.replace(edn_text,/:contract\/id\s+\"[^\"]+\"/,(""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\""));
} else {
return (""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "policies":
if(clojure.string.includes_QMARK_(edn_text,":contract/id")){
return clojure.string.replace(edn_text,/:contract\/id\s+\"[^\"]+\"/,(""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\""));
} else {
return (""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "sources":
var source_id = (""+":source/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)),/_/,"-")));
var G__31465 = ((clojure.string.includes_QMARK_(edn_text,":contract/id"))?clojure.string.replace(edn_text,/:contract\/id\s+\"[^\"]+\"/,(""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"")):(""+":contract/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text)));
if(clojure.string.includes_QMARK_(edn_text,":source/id")){
return clojure.string.replace(G__31465,/:source\/id\s+:[^\s\]}]+/,(""+":source/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(source_id)));
} else {
return G__31465;
}

break;
case "actors":
if(clojure.string.includes_QMARK_(edn_text,":actor/id")){
return clojure.string.replace(edn_text,/:actor\/id\s+\"[^\"]+\"/,(""+":actor/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\""));
} else {
return (""+":actor/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "roles":
var keyword_id = (""+":role/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace(new_id,/_/,"-")));
if(clojure.string.includes_QMARK_(edn_text,":role/id")){
return clojure.string.replace(edn_text,/:role\/id\s+:[^\s\]}]+/,(""+":role/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(keyword_id)));
} else {
return (""+":role/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(keyword_id)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "capabilities":
var slug = clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)),/^cap_/,"");
var keyword_id = (""+":cap/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace(slug,/_/,"-")));
if(clojure.string.includes_QMARK_(edn_text,":cap/id")){
return clojure.string.replace(edn_text,/:cap\/id\s+:[^\s\]}]+/,(""+":cap/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(keyword_id)));
} else {
return (""+":cap/id "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(keyword_id)+"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "model_families":
if(clojure.string.includes_QMARK_(edn_text,":model-family/id")){
return clojure.string.replace(edn_text,/:model-family\/id\s+\"[^\"]+\"/,(""+":model-family/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\""));
} else {
return (""+":model-family/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
case "models":
var model_id = clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new_id)),/_/,":");
if(clojure.string.includes_QMARK_(edn_text,":model/id")){
return clojure.string.replace(edn_text,/:model\/id\s+\"[^\"]+\"/,(""+":model/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+"\""));
} else {
return (""+":model/id \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+"\"\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
}

break;
default:
return edn_text;

}
});
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.resources !== 'undefined') && (typeof knoxx.backend.infra.routes.resources.resource_index_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.resources.resource_index_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY);
}
/**
 * Sync resource EDN files → in-memory resource index set.
 * 
 * The index is a fast in-process cache; disk is canonical. Invalid resource
 * files are omitted by the loader and must not block backend startup or the
 * repair UI.
 */
knoxx.backend.infra.routes.resources.sync_resource_index_BANG_ = (async function knoxx$backend$infra$routes$resources$sync_resource_index_BANG_(config){
try{var records = (await knoxx.backend.domain.resources.loader.load_all_resources_BANG_(config));
var ids = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (record){
return knoxx.backend.infra.routes.resources.resource_id__GT_index_key(new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record));
}),records))));
var existing_set = cljs.core.deref(knoxx.backend.infra.routes.resources.resource_index_STAR_);
var desired_set = cljs.core.set(ids);
var to_add = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(clojure.set.difference.cljs$core$IFn$_invoke$arity$2(desired_set,existing_set)));
var to_remove = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(clojure.set.difference.cljs$core$IFn$_invoke$arity$2(existing_set,desired_set)));
cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_index_STAR_,desired_set);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] synced resource index; add=",cljs.core.count(to_add),"remove=",cljs.core.count(to_remove)], 0));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"added","added",2057651688),to_add,new cljs.core.Keyword(null,"removed","removed",609626430),to_remove,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(ids)], null);
}catch (e31498){var err = e31498;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] sync-resource-index! failed; startup continuing:",err.message], 0));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message], null);
}});
/**
 * Compatibility alias for old contract route callers.
 */
knoxx.backend.infra.routes.resources.sync_contract_index_BANG_ = (function knoxx$backend$infra$routes$resources$sync_contract_index_BANG_(config){
return knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config);
});
knoxx.backend.infra.routes.resources.clear_resource_watch_timer_BANG_ = (function knoxx$backend$infra$routes$resources$clear_resource_watch_timer_BANG_(){
var temp__5825__auto__ = cljs.core.deref(knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_);
if(cljs.core.truth_(temp__5825__auto__)){
var timer = temp__5825__auto__;
clearTimeout(timer);

return cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_,null);
} else {
return null;
}
});
knoxx.backend.infra.routes.resources.stop_resource_watcher_BANG_ = (function knoxx$backend$infra$routes$resources$stop_resource_watcher_BANG_(){
knoxx.backend.infra.routes.resources.clear_resource_watch_timer_BANG_();

var seq__31514_32030 = cljs.core.seq(cljs.core.deref(knoxx.backend.infra.routes.resources.resource_watchers_STAR_));
var chunk__31515_32031 = null;
var count__31516_32032 = (0);
var i__31517_32033 = (0);
while(true){
if((i__31517_32033 < count__31516_32032)){
var watcher_32034 = chunk__31515_32031.cljs$core$IIndexed$_nth$arity$2(null,i__31517_32033);
if(cljs.core.truth_(watcher_32034)){
try{watcher_32034.close();
}catch (e31526){var __32035 = e31526;
}} else {
}


var G__32036 = seq__31514_32030;
var G__32037 = chunk__31515_32031;
var G__32038 = count__31516_32032;
var G__32039 = (i__31517_32033 + (1));
seq__31514_32030 = G__32036;
chunk__31515_32031 = G__32037;
count__31516_32032 = G__32038;
i__31517_32033 = G__32039;
continue;
} else {
var temp__5825__auto___32041 = cljs.core.seq(seq__31514_32030);
if(temp__5825__auto___32041){
var seq__31514_32042__$1 = temp__5825__auto___32041;
if(cljs.core.chunked_seq_QMARK_(seq__31514_32042__$1)){
var c__5694__auto___32043 = cljs.core.chunk_first(seq__31514_32042__$1);
var G__32044 = cljs.core.chunk_rest(seq__31514_32042__$1);
var G__32045 = c__5694__auto___32043;
var G__32046 = cljs.core.count(c__5694__auto___32043);
var G__32047 = (0);
seq__31514_32030 = G__32044;
chunk__31515_32031 = G__32045;
count__31516_32032 = G__32046;
i__31517_32033 = G__32047;
continue;
} else {
var watcher_32048 = cljs.core.first(seq__31514_32042__$1);
if(cljs.core.truth_(watcher_32048)){
try{watcher_32048.close();
}catch (e31534){var __32052 = e31534;
}} else {
}


var G__32053 = cljs.core.next(seq__31514_32042__$1);
var G__32054 = null;
var G__32055 = (0);
var G__32056 = (0);
seq__31514_32030 = G__32053;
chunk__31515_32031 = G__32054;
count__31516_32032 = G__32055;
i__31517_32033 = G__32056;
continue;
}
} else {
}
}
break;
}

cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watchers_STAR_,cljs.core.PersistentVector.EMPTY);

cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watch_running_QMARK__STAR_,false);

return null;
});
/**
 * Compatibility alias for old contract route callers.
 */
knoxx.backend.infra.routes.resources.stop_contract_watcher_BANG_ = (function knoxx$backend$infra$routes$resources$stop_contract_watcher_BANG_(){
return knoxx.backend.infra.routes.resources.stop_resource_watcher_BANG_();
});
knoxx.backend.infra.routes.resources.watchable_resource_change_QMARK_ = (function knoxx$backend$infra$routes$resources$watchable_resource_change_QMARK_(filename){
return (((filename == null)) || (clojure.string.ends_with_QMARK_(clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename))),".edn")));
});
knoxx.backend.infra.routes.resources.resource_refresh_BANG_ = (async function knoxx$backend$infra$routes$resources$resource_refresh_BANG_(config){
try{(await knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config));

knoxx.backend.infra.event_runtime.debounced_reload_BANG_();

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] event runtime reload queued after resource change"], 0));
}catch (e31541){var err = e31541;
return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] watcher refresh failed:",err.message], 0));
}});
knoxx.backend.infra.routes.resources.schedule_resource_refresh_BANG_ = (function knoxx$backend$infra$routes$resources$schedule_resource_refresh_BANG_(config,reason){
knoxx.backend.infra.routes.resources.clear_resource_watch_timer_BANG_();

return cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_,setTimeout((function (){
cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watch_timer_STAR_,null);

cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] watcher refresh triggered by",reason], 0));

return knoxx.backend.infra.routes.resources.resource_refresh_BANG_(config);
}),knoxx.backend.infra.routes.resources.resource_watch_debounce_ms));
});
knoxx.backend.infra.routes.resources.start_resource_watcher_BANG_ = (function knoxx$backend$infra$routes$resources$start_resource_watcher_BANG_(config){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.routes.resources.resource_watch_running_QMARK__STAR_))){
return null;
} else {
var roots = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__31549_SHARP_){
return shadow.esm.esm_import$node_fs.existsSync(p1__31549_SHARP_);
}),knoxx.backend.domain.resources.loader.resource_root_paths(config))));
var watch_root = (function (root){
try{return shadow.esm.esm_import$node_fs.watch(root,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null)),(function (event_type,filename){
var filename_str = (function (){var G__31564 = filename;
if((G__31564 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31564));
}
})();
if(knoxx.backend.infra.routes.resources.watchable_resource_change_QMARK_(filename_str)){
return knoxx.backend.infra.routes.resources.schedule_resource_refresh_BANG_(config,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(root)+" :: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(event_type)+" :: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = filename_str;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "<unknown>";
}
})())));
} else {
return null;
}
}));
}catch (e31559){var err = e31559;
cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] failed to watch",root,":",err.message], 0));

return null;
}});
var watchers = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(watch_root,roots)));
if(cljs.core.seq(watchers)){
cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watchers_STAR_,watchers);

cljs.core.reset_BANG_(knoxx.backend.infra.routes.resources.resource_watch_running_QMARK__STAR_,true);

return cljs.core.println.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["[resources] watching",cljs.core.count(watchers),"resource roots for live reload"], 0));
} else {
return null;
}
}
});
/**
 * Compatibility alias for old contract route callers.
 */
knoxx.backend.infra.routes.resources.start_contract_watcher_BANG_ = (function knoxx$backend$infra$routes$resources$start_contract_watcher_BANG_(config){
return knoxx.backend.infra.routes.resources.start_resource_watcher_BANG_(config);
});
/**
 * List all resources, optionally filtered by resource kind/class.
 * Public so tests can call it directly.
 */
knoxx.backend.infra.routes.resources.handle_list_resources = (async function knoxx$backend$infra$routes$resources$handle_list_resources(do_json,config,resource_kind){
try{var all = (await knoxx.backend.domain.resources.loader.load_all_resources_BANG_(config));
var resource_class = (cljs.core.truth_(resource_kind)?knoxx.backend.infra.routes.resources.normalize_resource_class(resource_kind):null);
var selected = (await (async function (){var G__31586 = all;
var G__31586__$1 = (cljs.core.truth_(resource_class)?cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__31571_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(p1__31571_SHARP_),resource_class);
}),G__31586):G__31586);
var G__31586__$2 = cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","class","resource/class",-1836136798),new cljs.core.Keyword("resource","id","resource/id",-822839770)),G__31586__$1)
;
return cljs.core.vec(G__31586__$2);

})());
var G__31588 = (200);
var G__31589 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"resources","resources",1632806811),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.resource_list_summary,selected)], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31588,G__31589) : do_json.call(null,G__31588,G__31589));
}catch (e31577){var err = e31577;
var G__31578 = (500);
var G__31579 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to list resources: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31578,G__31579) : do_json.call(null,G__31578,G__31579));
}});
/**
 * Compatibility alias for old /contracts clients.
 */
knoxx.backend.infra.routes.resources.handle_list_contracts = (async function knoxx$backend$infra$routes$resources$handle_list_contracts(do_json,config,contract_class){
try{var all = (await knoxx.backend.domain.resources.loader.load_all_resources_BANG_(config));
var resource_class = (cljs.core.truth_(contract_class)?knoxx.backend.infra.routes.resources.normalize_resource_class(contract_class):null);
var selected = (await (async function (){var G__31601 = all;
var G__31601__$1 = (cljs.core.truth_(resource_class)?cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__31595_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(p1__31595_SHARP_),resource_class);
}),G__31601):G__31601);
var G__31601__$2 = cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","class","resource/class",-1836136798),new cljs.core.Keyword("resource","id","resource/id",-822839770)),G__31601__$1)
;
return cljs.core.vec(G__31601__$2);

})());
var G__31609 = (200);
var G__31610 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"contracts","contracts",905357673),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.contract_list_summary,selected)], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31609,G__31610) : do_json.call(null,G__31609,G__31610));
}catch (e31598){var err = e31598;
var G__31599 = (500);
var G__31600 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to list contracts: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31599,G__31600) : do_json.call(null,G__31599,G__31600));
}});
knoxx.backend.infra.routes.resources.handle_get_resource = (async function knoxx$backend$infra$routes$resources$handle_get_resource(do_json,config,resource_kind,resource_id){
try{var edn_text = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,resource_kind,resource_id),"utf8"));
var resource_class = knoxx.backend.infra.routes.resources.normalize_resource_class(resource_kind);
var validation = knoxx.backend.infra.routes.resources.validate_resource_edn(resource_class,(await (async function (){var or__5162__auto__ = edn_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var G__31627 = (200);
var G__31628 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831),resource_class,new cljs.core.Keyword("resource","id","resource/id",-822839770),resource_id,new cljs.core.Keyword(null,"ednText","ednText",-1371174003),(await (async function (){var or__5162__auto__ = edn_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"resource","resource",251898836),knoxx.backend.infra.routes.resources.wire_value(new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation)),new cljs.core.Keyword(null,"validation","validation",-2141396518),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(validation,new cljs.core.Keyword(null,"contract","contract",798152745))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31627,G__31628) : do_json.call(null,G__31627,G__31628));
}catch (e31615){var err = e31615;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ENOENT",err.code)){
var G__31621 = (404);
var G__31622 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Resource not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_id))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31621,G__31622) : do_json.call(null,G__31621,G__31622));
} else {
var G__31625 = (500);
var G__31626 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to read resource: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31625,G__31626) : do_json.call(null,G__31625,G__31626));
}
}});
knoxx.backend.infra.routes.resources.handle_get_contract = (async function knoxx$backend$infra$routes$resources$handle_get_contract(do_json,config,contract_class,contract_id){
try{var edn_text = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,contract_class,contract_id),"utf8"));
var validation = knoxx.backend.infra.routes.resources.validate_contract_edn(contract_class,(await (async function (){var or__5162__auto__ = edn_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var G__31652 = (200);
var G__31653 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),knoxx.backend.infra.routes.resources.normalize_contract_class(contract_class),new cljs.core.Keyword(null,"ednText","ednText",-1371174003),(await (async function (){var or__5162__auto__ = edn_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),new cljs.core.Keyword(null,"contract","contract",798152745),knoxx.backend.infra.routes.resources.wire_value(new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation)),new cljs.core.Keyword(null,"validation","validation",-2141396518),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(validation,new cljs.core.Keyword(null,"contract","contract",798152745))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31652,G__31653) : do_json.call(null,G__31652,G__31653));
}catch (e31635){var err = e31635;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ENOENT",err.code)){
var G__31637 = (404);
var G__31638 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Contract not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31637,G__31638) : do_json.call(null,G__31637,G__31638));
} else {
var G__31640 = (500);
var G__31641 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to read contract: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31640,G__31641) : do_json.call(null,G__31640,G__31641));
}
}});
knoxx.backend.infra.routes.resources.handle_save_resource = (async function knoxx$backend$infra$routes$resources$handle_save_resource(do_json,config,resource_kind,resource_id,edn_text){
var resource_class = knoxx.backend.infra.routes.resources.normalize_resource_class(resource_kind);
var validation = knoxx.backend.infra.routes.resources.validate_resource_edn(resource_class,edn_text);
var validation_out = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(validation,new cljs.core.Keyword(null,"contract","contract",798152745));
var parsed = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation);
var parsed_id = knoxx.backend.infra.routes.resources.parsed_resource_id(resource_class,parsed);
var route_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(resource_id));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(validation))){
var G__31703 = (400);
var G__31704 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"Resource EDN failed validation",new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31703,G__31704) : do_json.call(null,G__31703,G__31704));
} else {
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = parsed_id;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(route_id,parsed_id);
} else {
return and__5160__auto__;
}
})()))){
var G__31719 = (400);
var G__31720 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"Refusing to save resource: record id does not match route resourceId",new cljs.core.Keyword(null,"routeResourceId","routeResourceId",1145042887),route_id,new cljs.core.Keyword(null,"ednResourceId","ednResourceId",-1482919329),parsed_id,new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31719,G__31720) : do_json.call(null,G__31719,G__31720));
} else {
try{var file_path = knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,resource_class,route_id);
(await knoxx.backend.domain.resources.loader.write_edn_file_BANG_(file_path,edn_text));

(await knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config));

var G__31741 = (200);
var G__31742 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831),resource_class,new cljs.core.Keyword("resource","id","resource/id",-822839770),route_id,new cljs.core.Keyword(null,"ednText","ednText",-1371174003),edn_text,new cljs.core.Keyword(null,"resource","resource",251898836),knoxx.backend.infra.routes.resources.wire_value(parsed),new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31741,G__31742) : do_json.call(null,G__31741,G__31742));
}catch (e31733){var err = e31733;
var G__31737 = (500);
var G__31738 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to save resource: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31737,G__31738) : do_json.call(null,G__31737,G__31738));
}
}
}
});
knoxx.backend.infra.routes.resources.handle_save_contract = (async function knoxx$backend$infra$routes$resources$handle_save_contract(do_json,config,contract_class,contract_id,edn_text){
var klass = knoxx.backend.infra.routes.resources.normalize_contract_class(contract_class);
var validation = knoxx.backend.infra.routes.resources.validate_contract_edn(klass,edn_text);
var validation_out = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(validation,new cljs.core.Keyword(null,"contract","contract",798152745));
var parsed = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation);
var parsed_id = knoxx.backend.infra.routes.resources.parsed_resource_id(klass,parsed);
var route_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(validation))){
var G__31756 = (400);
var G__31757 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"Contract EDN failed validation",new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31756,G__31757) : do_json.call(null,G__31756,G__31757));
} else {
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = parsed_id;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(route_id,parsed_id);
} else {
return and__5160__auto__;
}
})()))){
var G__31758 = (400);
var G__31759 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"Refusing to save contract: record id does not match route contractId",new cljs.core.Keyword(null,"routeContractId","routeContractId",-2079828927),route_id,new cljs.core.Keyword(null,"ednContractId","ednContractId",1462680876),parsed_id,new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31758,G__31759) : do_json.call(null,G__31758,G__31759));
} else {
try{var file_path = knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,klass,route_id);
(await knoxx.backend.domain.resources.loader.write_edn_file_BANG_(file_path,edn_text));

(await knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config));

var G__31767 = (200);
var G__31768 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),klass,new cljs.core.Keyword(null,"ednText","ednText",-1371174003),edn_text,new cljs.core.Keyword(null,"contract","contract",798152745),knoxx.backend.infra.routes.resources.wire_value(parsed),new cljs.core.Keyword(null,"validation","validation",-2141396518),validation_out], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31767,G__31768) : do_json.call(null,G__31767,G__31768));
}catch (e31763){var err = e31763;
var G__31764 = (500);
var G__31765 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to save contract: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31764,G__31765) : do_json.call(null,G__31764,G__31765));
}
}
}
});
knoxx.backend.infra.routes.resources.handle_copy_resource = (async function knoxx$backend$infra$routes$resources$handle_copy_resource(do_json,config,resource_kind,source_id,new_id){
try{var source_edn = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,resource_kind,source_id),"utf8"));
var text = (await (async function (){var or__5162__auto__ = source_edn;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var cloned = knoxx.backend.infra.routes.resources.update_resource_id_in_edn_text(resource_kind,text,new_id);
return (await knoxx.backend.infra.routes.resources.handle_save_resource(do_json,config,resource_kind,new_id,cloned));
}catch (e31778){var err = e31778;
var G__31779 = (500);
var G__31780 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to copy resource: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31779,G__31780) : do_json.call(null,G__31779,G__31780));
}});
knoxx.backend.infra.routes.resources.handle_copy_contract = (async function knoxx$backend$infra$routes$resources$handle_copy_contract(do_json,config,contract_class,source_id,new_id){
try{var source_edn = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,contract_class,source_id),"utf8"));
var text = (await (async function (){var or__5162__auto__ = source_edn;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var cloned = knoxx.backend.infra.routes.resources.update_resource_id_in_edn_text(contract_class,text,new_id);
return (await knoxx.backend.infra.routes.resources.handle_save_contract(do_json,config,contract_class,new_id,cloned));
}catch (e31789){var err = e31789;
var G__31790 = (500);
var G__31791 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to copy contract: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31790,G__31791) : do_json.call(null,G__31790,G__31791));
}});
knoxx.backend.infra.routes.resources.handle_validate_resource = (function knoxx$backend$infra$routes$resources$handle_validate_resource(do_json,resource_kind,edn_text){
var resource_class = knoxx.backend.infra.routes.resources.normalize_resource_class(resource_kind);
var G__31802 = (200);
var G__31803 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.resources.wire_validation(knoxx.backend.infra.routes.resources.validate_resource_edn(resource_class,edn_text)),new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831),resource_class);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31802,G__31803) : do_json.call(null,G__31802,G__31803));
});
knoxx.backend.infra.routes.resources.handle_validate_contract = (function knoxx$backend$infra$routes$resources$handle_validate_contract(do_json,contract_class,edn_text){
var G__31804 = (200);
var G__31805 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.resources.wire_validation(knoxx.backend.infra.routes.resources.validate_contract_edn(contract_class,edn_text)),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),knoxx.backend.infra.routes.resources.normalize_contract_class(contract_class));
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31804,G__31805) : do_json.call(null,G__31804,G__31805));
});
knoxx.backend.infra.routes.resources.handle_agent_list_contracts = (async function knoxx$backend$infra$routes$resources$handle_agent_list_contracts(do_text,config,contract_class){
try{var ids = (await knoxx.backend.domain.resources.loader.list_resource_ids_BANG_(config,contract_class));
var G__31809 = (200);
var G__31810 = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([ids], 0));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31809,G__31810) : do_text.call(null,G__31809,G__31810));
}catch (e31806){var err = e31806;
var G__31807 = (500);
var G__31808 = (""+";; Failed to list contracts: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31807,G__31808) : do_text.call(null,G__31807,G__31808));
}});
knoxx.backend.infra.routes.resources.handle_agent_get_contract_edn = (async function knoxx$backend$infra$routes$resources$handle_agent_get_contract_edn(do_text,config,contract_class,contract_id){
try{var edn_text = (await shadow.esm.esm_import$node_fs$promises.readFile(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,contract_class,contract_id),"utf8"));
var G__31816 = (200);
var G__31817 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(edn_text));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31816,G__31817) : do_text.call(null,G__31816,G__31817));
}catch (e31811){var err = e31811;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ENOENT",err.code)){
var G__31812 = (404);
var G__31813 = (""+";; Contract not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31812,G__31813) : do_text.call(null,G__31812,G__31813));
} else {
var G__31814 = (500);
var G__31815 = (""+";; Failed to read contract: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31814,G__31815) : do_text.call(null,G__31814,G__31815));
}
}});
knoxx.backend.infra.routes.resources.handle_agent_validate_contract_edn = (function knoxx$backend$infra$routes$resources$handle_agent_validate_contract_edn(do_json,contract_class,edn_text){
var G__31819 = (200);
var G__31820 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.resources.wire_validation(knoxx.backend.infra.routes.resources.validate_contract_edn(contract_class,edn_text)),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),knoxx.backend.infra.routes.resources.normalize_contract_class(contract_class));
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31819,G__31820) : do_json.call(null,G__31819,G__31820));
});
knoxx.backend.infra.routes.resources.handle_agent_put_contract_edn = (async function knoxx$backend$infra$routes$resources$handle_agent_put_contract_edn(do_text,config,contract_class,contract_id,edn_text){
var klass = knoxx.backend.infra.routes.resources.normalize_contract_class(contract_class);
var validation = knoxx.backend.infra.routes.resources.validate_contract_edn(klass,edn_text);
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(validation))){
var G__31821 = (422);
var G__31822 = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.Keyword(null,"errors","errors",-908790718).cljs$core$IFn$_invoke$arity$1(validation),new cljs.core.Keyword(null,"warnings","warnings",-735437651),new cljs.core.Keyword(null,"warnings","warnings",-735437651).cljs$core$IFn$_invoke$arity$1(validation)], null)], 0));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31821,G__31822) : do_text.call(null,G__31821,G__31822));
} else {
var parsed = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(validation);
var parsed_id = knoxx.backend.infra.routes.resources.parsed_resource_id(klass,parsed);
var route_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(contract_id));
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(route_id,parsed_id)){
var G__31823 = (400);
var G__31824 = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"contract_id_mismatch",new cljs.core.Keyword(null,"routeContractId","routeContractId",-2079828927),route_id,new cljs.core.Keyword(null,"ednContractId","ednContractId",1462680876),parsed_id], null)], 0));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31823,G__31824) : do_text.call(null,G__31823,G__31824));
} else {
try{(await knoxx.backend.domain.resources.loader.write_edn_file_BANG_(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,klass,route_id),edn_text));

(await knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config));

var G__31828 = (200);
var G__31829 = cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),klass,new cljs.core.Keyword("contract","id","contract/id",-872298206),route_id,new cljs.core.Keyword(null,"contract","contract",798152745),parsed,new cljs.core.Keyword(null,"warnings","warnings",-735437651),new cljs.core.Keyword(null,"warnings","warnings",-735437651).cljs$core$IFn$_invoke$arity$1(validation)], null)], 0));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31828,G__31829) : do_text.call(null,G__31828,G__31829));
}catch (e31825){var err = e31825;
var G__31826 = (500);
var G__31827 = (""+";; Failed to save contract: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message));
return (do_text.cljs$core$IFn$_invoke$arity$2 ? do_text.cljs$core$IFn$_invoke$arity$2(G__31826,G__31827) : do_text.call(null,G__31826,G__31827));
}}
}
});
knoxx.backend.infra.routes.resources.handle_ui_actions = (function knoxx$backend$infra$routes$resources$handle_ui_actions(do_json,config,actor_id,surface){
var resolved = knoxx.backend.domain.contracts.resolve.ui_actions_for_actor(config,actor_id,surface);
var G__31833 = (200);
var G__31834 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"surface","surface",699915646),new cljs.core.Keyword(null,"surface","surface",699915646).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"default_agent_id","default_agent_id",-1139401460),new cljs.core.Keyword(null,"default-agent-id","default-agent-id",-2135472358).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"actions","actions",-812656882),new cljs.core.Keyword(null,"actions","actions",-812656882).cljs$core$IFn$_invoke$arity$1(resolved)], null);
return (do_json.cljs$core$IFn$_invoke$arity$2 ? do_json.cljs$core$IFn$_invoke$arity$2(G__31833,G__31834) : do_json.call(null,G__31833,G__31834));
});
knoxx.backend.infra.routes.resources.text_response_BANG_ = (function knoxx$backend$infra$routes$resources$text_response_BANG_(reply,status,text){
return reply.end(reply.status(status),text,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","text/plain; charset=utf-8"], null)));
});
knoxx.backend.infra.routes.resources.body_map = (function knoxx$backend$infra$routes$resources$body_map(request){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.routes.resources.request_resource_kind = (function knoxx$backend$infra$routes$resources$request_resource_kind(request,default$){
var or__5162__auto__ = (request["query"]["kind"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["class"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return default$;
}
}
});
/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.request_contract_class = (function knoxx$backend$infra$routes$resources$request_contract_class(request,default$){
return knoxx.backend.infra.routes.resources.request_resource_kind(request,default$);
});
knoxx.backend.infra.routes.resources.body_resource_kind = (function knoxx$backend$infra$routes$resources$body_resource_kind(var_args){
var G__31837 = arguments.length;
switch (G__31837) {
case 2:
return knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$2 = (function (body,default$){
return knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$3(body,null,default$);
}));

(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$3 = (function (body,request,default$){
var or__5162__auto__ = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"resource_kind","resource_kind",847661086).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = new cljs.core.Keyword(null,"resource-class","resource-class",2041510648).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = new cljs.core.Keyword(null,"contract_class","contract_class",490905262).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var or__5162__auto____$7 = new cljs.core.Keyword(null,"contract-class","contract-class",-393992188).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$7)){
return or__5162__auto____$7;
} else {
var or__5162__auto____$8 = (function (){var G__31838 = request;
if((G__31838 == null)){
return null;
} else {
return (G__31838["query"]["kind"]);
}
})();
if(cljs.core.truth_(or__5162__auto____$8)){
return or__5162__auto____$8;
} else {
var or__5162__auto____$9 = (function (){var G__31839 = request;
if((G__31839 == null)){
return null;
} else {
return (G__31839["query"]["class"]);
}
})();
if(cljs.core.truth_(or__5162__auto____$9)){
return or__5162__auto____$9;
} else {
return default$;
}
}
}
}
}
}
}
}
}
}
}));

(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$lang$maxFixedArity = 3);

/**
 * Compatibility alias for old contract route clients.
 */
knoxx.backend.infra.routes.resources.body_contract_class = (function knoxx$backend$infra$routes$resources$body_contract_class(var_args){
var G__31845 = arguments.length;
switch (G__31845) {
case 2:
return knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$2 = (function (body,default$){
return knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$2(body,default$);
}));

(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$3 = (function (body,request,default$){
return knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$3(body,request,default$);
}));

(knoxx.backend.infra.routes.resources.body_contract_class.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.routes.resources.body_edn_text = (function knoxx$backend$infra$routes$resources$body_edn_text(body){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"ednText","ednText",-1371174003).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"edn_text","edn_text",258296122).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})()));
});
knoxx.backend.infra.routes.resources.with_route_context = (function knoxx$backend$infra$routes$resources$with_route_context(runtime,do_ctx,do_err,f){
return (function (request,reply){
var G__31874 = runtime;
var G__31875 = request;
var G__31876 = reply;
var G__31877 = (function (ctx){
try{return (f.cljs$core$IFn$_invoke$arity$3 ? f.cljs$core$IFn$_invoke$arity$3(ctx,request,reply) : f.call(null,ctx,request,reply));
}catch (e31879){var err = e31879;
return (do_err.cljs$core$IFn$_invoke$arity$2 ? do_err.cljs$core$IFn$_invoke$arity$2(reply,err) : do_err.call(null,reply,err));
}});
return (do_ctx.cljs$core$IFn$_invoke$arity$4 ? do_ctx.cljs$core$IFn$_invoke$arity$4(G__31874,G__31875,G__31876,G__31877) : do_ctx.call(null,G__31874,G__31875,G__31876,G__31877));
});
});
knoxx.backend.infra.routes.resources.agent_ui_actions_route = (function knoxx$backend$infra$routes$resources$agent_ui_actions_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var actor_id = (function (){var or__5162__auto__ = (request["query"]["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["actor_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (request["query"]["actorId"]);
}
}
})();
var surface = (function (){var or__5162__auto__ = (request["query"]["surface"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["surface_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (request["query"]["surfaceId"]);
}
}
})();
return knoxx.backend.infra.routes.resources.handle_ui_actions(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,actor_id,surface);
}));
});
knoxx.backend.infra.routes.resources.agent_list_contracts_route = (function knoxx$backend$infra$routes$resources$agent_list_contracts_route(runtime,config,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.request_contract_class(request,"agents"));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),(""+";; Invalid contract class: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind))));
} else {
return knoxx.backend.infra.routes.resources.handle_agent_list_contracts(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.text_response_BANG_,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind));
}
}));
});
knoxx.backend.infra.routes.resources.agent_validate_contract_route = (function knoxx$backend$infra$routes$resources$agent_validate_contract_route(runtime,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var body = knoxx.backend.infra.routes.resources.body_map(request);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$3(body,request,"agents"));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31890 = reply;
var G__31891 = (400);
var G__31892 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31890,G__31891,G__31892) : do_json.call(null,G__31890,G__31891,G__31892));
} else {
return knoxx.backend.infra.routes.resources.handle_agent_validate_contract_edn(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),knoxx.backend.infra.routes.resources.body_edn_text(body));
}
}));
});
knoxx.backend.infra.routes.resources.agent_get_contract_route = (function knoxx$backend$infra$routes$resources$agent_get_contract_route(runtime,config,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var contract_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe = knoxx.backend.infra.routes.resources.safe_contract_id(contract_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.request_contract_class(request,"agents"));
if(clojure.string.blank_QMARK_(contract_id)){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),";; contractId is required");
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),(""+";; Invalid contract class: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind))));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),(""+";; Invalid contractId: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe))));
} else {
return knoxx.backend.infra.routes.resources.handle_agent_get_contract_edn(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.text_response_BANG_,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe));

}
}
}
}));
});
knoxx.backend.infra.routes.resources.agent_put_contract_route = (function knoxx$backend$infra$routes$resources$agent_put_contract_route(runtime,config,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var contract_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe = knoxx.backend.infra.routes.resources.safe_contract_id(contract_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.request_contract_class(request,"agents"));
var edn_text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(clojure.string.blank_QMARK_(contract_id)){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),";; contractId is required");
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),(""+";; Invalid contract class: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind))));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
return knoxx.backend.infra.routes.resources.text_response_BANG_(reply,(400),(""+";; Invalid contractId: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe))));
} else {
return knoxx.backend.infra.routes.resources.handle_agent_put_contract_edn(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.resources.text_response_BANG_,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe),edn_text);

}
}
}
}));
});
knoxx.backend.infra.routes.resources.register_agent_contract_routes_BANG_ = (function knoxx$backend$infra$routes$resources$register_agent_contract_routes_BANG_(app,runtime,config,helpers){
var do_route = new cljs.core.Keyword(null,"route!","route!",-1286958144).cljs$core$IFn$_invoke$arity$1(helpers);
var do_json = new cljs.core.Keyword(null,"json-response!","json-response!",103570476).cljs$core$IFn$_invoke$arity$1(helpers);
var do_err = new cljs.core.Keyword(null,"error-response!","error-response!",-856339341).cljs$core$IFn$_invoke$arity$1(helpers);
var do_ctx = new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046).cljs$core$IFn$_invoke$arity$1(helpers);
var do_perm = new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163).cljs$core$IFn$_invoke$arity$1(helpers);
var G__31893_32065 = app;
var G__31894_32066 = "GET";
var G__31895_32067 = "/api/contracts/ui-actions";
var G__31896_32068 = knoxx.backend.infra.routes.resources.agent_ui_actions_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31893_32065,G__31894_32066,G__31895_32067,G__31896_32068) : do_route.call(null,G__31893_32065,G__31894_32066,G__31895_32067,G__31896_32068));

var G__31897_32069 = app;
var G__31898_32070 = "GET";
var G__31899_32071 = "/api/agent/contracts";
var G__31900_32072 = knoxx.backend.infra.routes.resources.agent_list_contracts_route(runtime,config,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31897_32069,G__31898_32070,G__31899_32071,G__31900_32072) : do_route.call(null,G__31897_32069,G__31898_32070,G__31899_32071,G__31900_32072));

var G__31901_32073 = app;
var G__31902_32074 = "POST";
var G__31903_32075 = "/api/agent/contracts/validate";
var G__31904_32076 = knoxx.backend.infra.routes.resources.agent_validate_contract_route(runtime,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31901_32073,G__31902_32074,G__31903_32075,G__31904_32076) : do_route.call(null,G__31901_32073,G__31902_32074,G__31903_32075,G__31904_32076));

var G__31905_32077 = app;
var G__31906_32078 = "GET";
var G__31907_32079 = "/api/agent/contracts/:contractId";
var G__31908_32080 = knoxx.backend.infra.routes.resources.agent_get_contract_route(runtime,config,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31905_32077,G__31906_32078,G__31907_32079,G__31908_32080) : do_route.call(null,G__31905_32077,G__31906_32078,G__31907_32079,G__31908_32080));

var G__31909 = app;
var G__31910 = "PUT";
var G__31911 = "/api/agent/contracts/:contractId";
var G__31912 = knoxx.backend.infra.routes.resources.agent_put_contract_route(runtime,config,do_err,do_ctx,do_perm);
return (do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31909,G__31910,G__31911,G__31912) : do_route.call(null,G__31909,G__31910,G__31911,G__31912));
});
knoxx.backend.infra.routes.resources.admin_list_resources_route = (function knoxx$backend$infra$routes$resources$admin_list_resources_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var kind = knoxx.backend.infra.routes.resources.request_resource_kind(request,null);
var safe_kind = (cljs.core.truth_(kind)?knoxx.backend.infra.routes.resources.safe_resource_class(kind):new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"class","class",-2030961996),null], null));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31913 = reply;
var G__31914 = (400);
var G__31915 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resource kind",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31913,G__31914,G__31915) : do_json.call(null,G__31913,G__31914,G__31915));
} else {
return knoxx.backend.infra.routes.resources.handle_list_resources(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind));
}
}));
});
knoxx.backend.infra.routes.resources.admin_get_resource_route = (function knoxx$backend$infra$routes$resources$admin_get_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var resource_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["resourceId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe = knoxx.backend.infra.routes.resources.safe_resource_id(resource_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_resource_class(knoxx.backend.infra.routes.resources.request_resource_kind(request,"agents"));
if(clojure.string.blank_QMARK_(resource_id)){
var G__31916 = reply;
var G__31917 = (400);
var G__31918 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"resourceId is required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31916,G__31917,G__31918) : do_json.call(null,G__31916,G__31917,G__31918));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31919 = reply;
var G__31920 = (400);
var G__31921 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resource kind",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31919,G__31920,G__31921) : do_json.call(null,G__31919,G__31920,G__31921));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
var G__31922 = reply;
var G__31923 = (400);
var G__31924 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resourceId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31922,G__31923,G__31924) : do_json.call(null,G__31922,G__31923,G__31924));
} else {
return knoxx.backend.infra.routes.resources.handle_get_resource(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe));

}
}
}
}));
});
knoxx.backend.infra.routes.resources.admin_save_resource_route = (function knoxx$backend$infra$routes$resources$admin_save_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var resource_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["resourceId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var body = knoxx.backend.infra.routes.resources.body_map(request);
var safe = knoxx.backend.infra.routes.resources.safe_resource_id(resource_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_resource_class(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$3(body,request,"agents"));
if(clojure.string.blank_QMARK_(resource_id)){
var G__31925 = reply;
var G__31926 = (400);
var G__31927 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"resourceId is required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31925,G__31926,G__31927) : do_json.call(null,G__31925,G__31926,G__31927));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31928 = reply;
var G__31929 = (400);
var G__31930 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resource kind",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31928,G__31929,G__31930) : do_json.call(null,G__31928,G__31929,G__31930));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
var G__31931 = reply;
var G__31932 = (400);
var G__31933 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resourceId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31931,G__31932,G__31933) : do_json.call(null,G__31931,G__31932,G__31933));
} else {
return knoxx.backend.infra.routes.resources.handle_save_resource(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe),knoxx.backend.infra.routes.resources.body_edn_text(body));

}
}
}
}));
});
knoxx.backend.infra.routes.resources.admin_validate_resource_route = (function knoxx$backend$infra$routes$resources$admin_validate_resource_route(runtime,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var body = knoxx.backend.infra.routes.resources.body_map(request);
var safe_kind = knoxx.backend.infra.routes.resources.safe_resource_class(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$2(body,"agents"));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31934 = reply;
var G__31935 = (400);
var G__31936 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resource kind",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31934,G__31935,G__31936) : do_json.call(null,G__31934,G__31935,G__31936));
} else {
return knoxx.backend.infra.routes.resources.handle_validate_resource(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),knoxx.backend.infra.routes.resources.body_edn_text(body));
}
}));
});
knoxx.backend.infra.routes.resources.admin_copy_resource_route = (function knoxx$backend$infra$routes$resources$admin_copy_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var source_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["resourceId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var body = knoxx.backend.infra.routes.resources.body_map(request);
var new_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"newId","newId",1699050104).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe_kind = knoxx.backend.infra.routes.resources.safe_resource_class(knoxx.backend.infra.routes.resources.body_resource_kind.cljs$core$IFn$_invoke$arity$2(body,"agents"));
var safe_source = knoxx.backend.infra.routes.resources.safe_resource_id(source_id);
var safe_new = knoxx.backend.infra.routes.resources.safe_resource_id(new_id);
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31937 = reply;
var G__31938 = (400);
var G__31939 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid resource kind",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31937,G__31938,G__31939) : do_json.call(null,G__31937,G__31938,G__31939));
} else {
if(((clojure.string.blank_QMARK_(source_id)) || (clojure.string.blank_QMARK_(new_id)))){
var G__31940 = reply;
var G__31941 = (400);
var G__31942 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"source resourceId and newId are required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31940,G__31941,G__31942) : do_json.call(null,G__31940,G__31941,G__31942));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_source))){
var G__31943 = reply;
var G__31944 = (400);
var G__31945 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid source resourceId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_source)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31943,G__31944,G__31945) : do_json.call(null,G__31943,G__31944,G__31945));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_new))){
var G__31946 = reply;
var G__31947 = (400);
var G__31948 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid newId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_new)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31946,G__31947,G__31948) : do_json.call(null,G__31946,G__31947,G__31948));
} else {
return knoxx.backend.infra.routes.resources.handle_copy_resource(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe_source),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe_new));

}
}
}
}
}));
});
knoxx.backend.infra.routes.resources.admin_list_contracts_route = (function knoxx$backend$infra$routes$resources$admin_list_contracts_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var kind = knoxx.backend.infra.routes.resources.request_contract_class(request,null);
var safe_kind = (cljs.core.truth_(kind)?knoxx.backend.infra.routes.resources.safe_contract_class(kind):new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"class","class",-2030961996),null], null));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31949 = reply;
var G__31950 = (400);
var G__31951 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31949,G__31950,G__31951) : do_json.call(null,G__31949,G__31950,G__31951));
} else {
return knoxx.backend.infra.routes.resources.handle_list_contracts(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind));
}
}));
});
knoxx.backend.infra.routes.resources.admin_get_contract_route = (function knoxx$backend$infra$routes$resources$admin_get_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
if(cljs.core.truth_(ctx)){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : do_perm.call(null,ctx,"agent.chat.use"));
} else {
}

var contract_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe = knoxx.backend.infra.routes.resources.safe_contract_id(contract_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.request_contract_class(request,"agents"));
if(clojure.string.blank_QMARK_(contract_id)){
var G__31952 = reply;
var G__31953 = (400);
var G__31954 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"contractId is required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31952,G__31953,G__31954) : do_json.call(null,G__31952,G__31953,G__31954));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31955 = reply;
var G__31956 = (400);
var G__31957 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31955,G__31956,G__31957) : do_json.call(null,G__31955,G__31956,G__31957));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
var G__31958 = reply;
var G__31959 = (400);
var G__31960 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contractId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31958,G__31959,G__31960) : do_json.call(null,G__31958,G__31959,G__31960));
} else {
return knoxx.backend.infra.routes.resources.handle_get_contract(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe));

}
}
}
}));
});
knoxx.backend.infra.routes.resources.admin_save_contract_route = (function knoxx$backend$infra$routes$resources$admin_save_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var contract_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var body = knoxx.backend.infra.routes.resources.body_map(request);
var safe = knoxx.backend.infra.routes.resources.safe_contract_id(contract_id);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$3(body,request,"agents"));
if(clojure.string.blank_QMARK_(contract_id)){
var G__31961 = reply;
var G__31962 = (400);
var G__31963 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"contractId is required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31961,G__31962,G__31963) : do_json.call(null,G__31961,G__31962,G__31963));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31964 = reply;
var G__31965 = (400);
var G__31966 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31964,G__31965,G__31966) : do_json.call(null,G__31964,G__31965,G__31966));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe))){
var G__31967 = reply;
var G__31968 = (400);
var G__31969 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contractId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31967,G__31968,G__31969) : do_json.call(null,G__31967,G__31968,G__31969));
} else {
return knoxx.backend.infra.routes.resources.handle_save_contract(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe),knoxx.backend.infra.routes.resources.body_edn_text(body));

}
}
}
}));
});
knoxx.backend.infra.routes.resources.admin_validate_contract_route = (function knoxx$backend$infra$routes$resources$admin_validate_contract_route(runtime,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var body = knoxx.backend.infra.routes.resources.body_map(request);
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$2(body,"agents"));
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31970 = reply;
var G__31971 = (400);
var G__31972 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31970,G__31971,G__31972) : do_json.call(null,G__31970,G__31971,G__31972));
} else {
return knoxx.backend.infra.routes.resources.handle_validate_contract(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),knoxx.backend.infra.routes.resources.body_edn_text(body));
}
}));
});
knoxx.backend.infra.routes.resources.admin_copy_contract_route = (function knoxx$backend$infra$routes$resources$admin_copy_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm){
return knoxx.backend.infra.routes.resources.with_route_context(runtime,do_ctx,do_err,(function (ctx,request,reply){
(do_perm.cljs$core$IFn$_invoke$arity$2 ? do_perm.cljs$core$IFn$_invoke$arity$2(ctx,"platform.org.create") : do_perm.call(null,ctx,"platform.org.create"));

var source_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["contractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var body = knoxx.backend.infra.routes.resources.body_map(request);
var new_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"newId","newId",1699050104).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var safe_kind = knoxx.backend.infra.routes.resources.safe_contract_class(knoxx.backend.infra.routes.resources.body_contract_class.cljs$core$IFn$_invoke$arity$2(body,"agents"));
var safe_source = knoxx.backend.infra.routes.resources.safe_contract_id(source_id);
var safe_new = knoxx.backend.infra.routes.resources.safe_contract_id(new_id);
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_kind))){
var G__31973 = reply;
var G__31974 = (400);
var G__31975 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid contract class",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_kind)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31973,G__31974,G__31975) : do_json.call(null,G__31973,G__31974,G__31975));
} else {
if(((clojure.string.blank_QMARK_(source_id)) || (clojure.string.blank_QMARK_(new_id)))){
var G__31976 = reply;
var G__31977 = (400);
var G__31978 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"source contractId and newId are required"], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31976,G__31977,G__31978) : do_json.call(null,G__31976,G__31977,G__31978));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_source))){
var G__31979 = reply;
var G__31980 = (400);
var G__31981 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid source contractId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_source)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31979,G__31980,G__31981) : do_json.call(null,G__31979,G__31980,G__31981));
} else {
if(cljs.core.not(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(safe_new))){
var G__31982 = reply;
var G__31983 = (400);
var G__31984 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid newId",new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(safe_new)], null);
return (do_json.cljs$core$IFn$_invoke$arity$3 ? do_json.cljs$core$IFn$_invoke$arity$3(G__31982,G__31983,G__31984) : do_json.call(null,G__31982,G__31983,G__31984));
} else {
return knoxx.backend.infra.routes.resources.handle_copy_contract(cljs.core.partial.cljs$core$IFn$_invoke$arity$2(do_json,reply),config,new cljs.core.Keyword(null,"class","class",-2030961996).cljs$core$IFn$_invoke$arity$1(safe_kind),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe_source),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(safe_new));

}
}
}
}
}));
});
knoxx.backend.infra.routes.resources.register_admin_resource_routes_BANG_ = (function knoxx$backend$infra$routes$resources$register_admin_resource_routes_BANG_(app,runtime,config,helpers){
var do_route = new cljs.core.Keyword(null,"route!","route!",-1286958144).cljs$core$IFn$_invoke$arity$1(helpers);
var do_json = new cljs.core.Keyword(null,"json-response!","json-response!",103570476).cljs$core$IFn$_invoke$arity$1(helpers);
var do_err = new cljs.core.Keyword(null,"error-response!","error-response!",-856339341).cljs$core$IFn$_invoke$arity$1(helpers);
var do_ctx = new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046).cljs$core$IFn$_invoke$arity$1(helpers);
var do_perm = new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163).cljs$core$IFn$_invoke$arity$1(helpers);
var G__31985_32084 = app;
var G__31986_32085 = "GET";
var G__31987_32086 = "/api/admin/resources";
var G__31988_32087 = knoxx.backend.infra.routes.resources.admin_list_resources_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31985_32084,G__31986_32085,G__31987_32086,G__31988_32087) : do_route.call(null,G__31985_32084,G__31986_32085,G__31987_32086,G__31988_32087));

var G__31989_32088 = app;
var G__31990_32089 = "GET";
var G__31991_32090 = "/api/admin/resources/:resourceId";
var G__31992_32091 = knoxx.backend.infra.routes.resources.admin_get_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31989_32088,G__31990_32089,G__31991_32090,G__31992_32091) : do_route.call(null,G__31989_32088,G__31990_32089,G__31991_32090,G__31992_32091));

var G__31993_32092 = app;
var G__31994_32093 = "PUT";
var G__31995_32094 = "/api/admin/resources/:resourceId";
var G__31996_32095 = knoxx.backend.infra.routes.resources.admin_save_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31993_32092,G__31994_32093,G__31995_32094,G__31996_32095) : do_route.call(null,G__31993_32092,G__31994_32093,G__31995_32094,G__31996_32095));

var G__31997_32096 = app;
var G__31998_32097 = "POST";
var G__31999_32098 = "/api/admin/resources/validate";
var G__32000_32099 = knoxx.backend.infra.routes.resources.admin_validate_resource_route(runtime,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__31997_32096,G__31998_32097,G__31999_32098,G__32000_32099) : do_route.call(null,G__31997_32096,G__31998_32097,G__31999_32098,G__32000_32099));

var G__32001 = app;
var G__32002 = "POST";
var G__32003 = "/api/admin/resources/:resourceId/copy";
var G__32004 = knoxx.backend.infra.routes.resources.admin_copy_resource_route(runtime,config,do_json,do_err,do_ctx,do_perm);
return (do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32001,G__32002,G__32003,G__32004) : do_route.call(null,G__32001,G__32002,G__32003,G__32004));
});
knoxx.backend.infra.routes.resources.register_admin_contract_routes_BANG_ = (function knoxx$backend$infra$routes$resources$register_admin_contract_routes_BANG_(app,runtime,config,helpers){
var do_route = new cljs.core.Keyword(null,"route!","route!",-1286958144).cljs$core$IFn$_invoke$arity$1(helpers);
var do_json = new cljs.core.Keyword(null,"json-response!","json-response!",103570476).cljs$core$IFn$_invoke$arity$1(helpers);
var do_err = new cljs.core.Keyword(null,"error-response!","error-response!",-856339341).cljs$core$IFn$_invoke$arity$1(helpers);
var do_ctx = new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046).cljs$core$IFn$_invoke$arity$1(helpers);
var do_perm = new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163).cljs$core$IFn$_invoke$arity$1(helpers);
var G__32005_32100 = app;
var G__32006_32101 = "GET";
var G__32007_32102 = "/api/admin/contracts";
var G__32008_32103 = knoxx.backend.infra.routes.resources.admin_list_contracts_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32005_32100,G__32006_32101,G__32007_32102,G__32008_32103) : do_route.call(null,G__32005_32100,G__32006_32101,G__32007_32102,G__32008_32103));

var G__32009_32104 = app;
var G__32010_32105 = "GET";
var G__32011_32106 = "/api/admin/contracts/:contractId";
var G__32012_32107 = knoxx.backend.infra.routes.resources.admin_get_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32009_32104,G__32010_32105,G__32011_32106,G__32012_32107) : do_route.call(null,G__32009_32104,G__32010_32105,G__32011_32106,G__32012_32107));

var G__32013_32108 = app;
var G__32014_32109 = "PUT";
var G__32015_32110 = "/api/admin/contracts/:contractId";
var G__32016_32111 = knoxx.backend.infra.routes.resources.admin_save_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32013_32108,G__32014_32109,G__32015_32110,G__32016_32111) : do_route.call(null,G__32013_32108,G__32014_32109,G__32015_32110,G__32016_32111));

var G__32017_32113 = app;
var G__32018_32114 = "POST";
var G__32019_32115 = "/api/admin/contracts/validate";
var G__32020_32116 = knoxx.backend.infra.routes.resources.admin_validate_contract_route(runtime,do_json,do_err,do_ctx,do_perm);
(do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32017_32113,G__32018_32114,G__32019_32115,G__32020_32116) : do_route.call(null,G__32017_32113,G__32018_32114,G__32019_32115,G__32020_32116));

var G__32021 = app;
var G__32022 = "POST";
var G__32023 = "/api/admin/contracts/:contractId/copy";
var G__32024 = knoxx.backend.infra.routes.resources.admin_copy_contract_route(runtime,config,do_json,do_err,do_ctx,do_perm);
return (do_route.cljs$core$IFn$_invoke$arity$4 ? do_route.cljs$core$IFn$_invoke$arity$4(G__32021,G__32022,G__32023,G__32024) : do_route.call(null,G__32021,G__32022,G__32023,G__32024));
});
knoxx.backend.infra.routes.resources.register_resource_routes_BANG_ = (function knoxx$backend$infra$routes$resources$register_resource_routes_BANG_(app,runtime,config,helpers){
knoxx.backend.infra.routes.resources.register_agent_contract_routes_BANG_(app,runtime,config,helpers);

knoxx.backend.infra.routes.resources.register_admin_resource_routes_BANG_(app,runtime,config,helpers);

knoxx.backend.infra.routes.resources.register_admin_contract_routes_BANG_(app,runtime,config,helpers);

return null;
});
/**
 * Compatibility alias for old route registration.
 */
knoxx.backend.infra.routes.resources.register_contracts_routes_BANG_ = (function knoxx$backend$infra$routes$resources$register_contracts_routes_BANG_(app,runtime,config,helpers){
return knoxx.backend.infra.routes.resources.register_resource_routes_BANG_(app,runtime,config,helpers);
});

//# sourceMappingURL=knoxx.backend.infra.routes.resources.js.map
