import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.contracts.loader.js";
goog.provide('knoxx.backend.domain.resources.loader');
knoxx.backend.domain.resources.loader.resource_kind__GT_class = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"schedule","schedule",349275266),new cljs.core.Keyword(null,"model-family","model-family",-373740636),new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275),new cljs.core.Keyword(null,"store","store",1512230022),new cljs.core.Keyword(null,"source-mode","source-mode",725702471),new cljs.core.Keyword(null,"rule","rule",729973257),new cljs.core.Keyword(null,"cms","cms",-160759541),new cljs.core.Keyword(null,"capability","capability",-223324340),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"agent","agent",-766455027),new cljs.core.Keyword(null,"policy","policy",902736495),new cljs.core.Keyword(null,"workflow","workflow",-640694607),new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721),new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131),new cljs.core.Keyword(null,"generator","generator",-572962281),new cljs.core.Keyword(null,"action","action",-811238024),new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"actor","actor",-1830560481),new cljs.core.Keyword(null,"model","model",331153215)],["roles","schedules","model_families","ingest_sources","stores","source_modes","rules","cms","capabilities","sources","agents","policies","workflows","runtime_features","sub_agents","generators","actions","triggers","users","actors","models"]);
knoxx.backend.domain.resources.loader.class__GT_resource_kind = cljs.core.reduce_kv((function (acc,kind,class_name){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,class_name,kind);
}),cljs.core.PersistentArrayMap.EMPTY,knoxx.backend.domain.resources.loader.resource_kind__GT_class);
knoxx.backend.domain.resources.loader.token = (function knoxx$backend$domain$resources$loader$token(value){
var G__27925 = value;
var G__27925__$1 = (((G__27925 == null))?null:(function (){var G__27926 = G__27925;
var G__27926__$1 = (((value instanceof cljs.core.Keyword))?cljs.core.name(G__27926):G__27926);
if((!((value instanceof cljs.core.Keyword)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27926__$1));
} else {
return G__27926__$1;
}
})());
var G__27925__$2 = (((G__27925__$1 == null))?null:clojure.string.trim(G__27925__$1));
if((G__27925__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__27925__$2);
}
});
knoxx.backend.domain.resources.loader.normalize_resource_kind = (function knoxx$backend$domain$resources$loader$normalize_resource_kind(value){
var G__27927 = knoxx.backend.domain.resources.loader.token(value);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(null,G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sources",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pipelines",G__27927)){
return new cljs.core.Keyword(null,"pipeline","pipeline",-401746042);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("capabilities",G__27927)){
return new cljs.core.Keyword(null,"capability","capability",-223324340);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("role",G__27927)){
return new cljs.core.Keyword(null,"role","role",-736691072);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub_agents",G__27927)){
return new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source_modes",G__27927)){
return new cljs.core.Keyword(null,"source-mode","source-mode",725702471);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model-families",G__27927)){
return new cljs.core.Keyword(null,"model-family","model-family",-373740636);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("rule",G__27927)){
return new cljs.core.Keyword(null,"rule","rule",729973257);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agent",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model",G__27927)){
return new cljs.core.Keyword(null,"model","model",331153215);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agent-spec",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub-agent",G__27927)){
return new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest-source",G__27927)){
return new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest_source",G__27927)){
return new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-configs",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("caps",G__27927)){
return new cljs.core.Keyword(null,"capability","capability",-223324340);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest-sources",G__27927)){
return new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime",G__27927)){
return new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-feature",G__27927)){
return new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-features",G__27927)){
return new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",G__27927)){
return new cljs.core.Keyword(null,"user","user",1532431356);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("capability",G__27927)){
return new cljs.core.Keyword(null,"capability","capability",-223324340);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-block-registry",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("workflows",G__27927)){
return new cljs.core.Keyword(null,"workflow","workflow",-640694607);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_feature",G__27927)){
return new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agents",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("schedule",G__27927)){
return new cljs.core.Keyword(null,"schedule","schedule",349275266);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub_agent",G__27927)){
return new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("agent-specs",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("rules",G__27927)){
return new cljs.core.Keyword(null,"rule","rule",729973257);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("users",G__27927)){
return new cljs.core.Keyword(null,"user","user",1532431356);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("workflow",G__27927)){
return new cljs.core.Keyword(null,"workflow","workflow",-640694607);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model-family",G__27927)){
return new cljs.core.Keyword(null,"model-family","model-family",-373740636);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-sources",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_source",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("action",G__27927)){
return new cljs.core.Keyword(null,"action","action",-811238024);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sub-agents",G__27927)){
return new cljs.core.Keyword(null,"sub-agent","sub-agent",-111773131);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_sources",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("policies",G__27927)){
return new cljs.core.Keyword(null,"policy","policy",902736495);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("policy",G__27927)){
return new cljs.core.Keyword(null,"policy","policy",902736495);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actors",G__27927)){
return new cljs.core.Keyword(null,"actor","actor",-1830560481);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pipeline",G__27927)){
return new cljs.core.Keyword(null,"pipeline","pipeline",-401746042);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model_family",G__27927)){
return new cljs.core.Keyword(null,"model-family","model-family",-373740636);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("stores",G__27927)){
return new cljs.core.Keyword(null,"store","store",1512230022);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source-modes",G__27927)){
return new cljs.core.Keyword(null,"source-mode","source-mode",725702471);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("triggers",G__27927)){
return new cljs.core.Keyword(null,"trigger","trigger",103466139);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime-source",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("contracts",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source",G__27927)){
return new cljs.core.Keyword(null,"source","source",-433931539);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("contract",G__27927)){
return new cljs.core.Keyword(null,"agent","agent",-766455027);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("generators",G__27927)){
return new cljs.core.Keyword(null,"generator","generator",-572962281);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-templates",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source_mode",G__27927)){
return new cljs.core.Keyword(null,"source-mode","source-mode",725702471);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("generator",G__27927)){
return new cljs.core.Keyword(null,"generator","generator",-572962281);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("model_families",G__27927)){
return new cljs.core.Keyword(null,"model-family","model-family",-373740636);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("ingest_sources",G__27927)){
return new cljs.core.Keyword(null,"ingest-source","ingest-source",-932949275);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cap",G__27927)){
return new cljs.core.Keyword(null,"capability","capability",-223324340);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("models",G__27927)){
return new cljs.core.Keyword(null,"model","model",331153215);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("human",G__27927)){
return new cljs.core.Keyword(null,"user","user",1532431356);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("trigger",G__27927)){
return new cljs.core.Keyword(null,"trigger","trigger",103466139);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("humans",G__27927)){
return new cljs.core.Keyword(null,"user","user",1532431356);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("source-mode",G__27927)){
return new cljs.core.Keyword(null,"source-mode","source-mode",725702471);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-config",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("schedules",G__27927)){
return new cljs.core.Keyword(null,"schedule","schedule",349275266);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("store",G__27927)){
return new cljs.core.Keyword(null,"store","store",1512230022);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("roles",G__27927)){
return new cljs.core.Keyword(null,"role","role",-736691072);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actor",G__27927)){
return new cljs.core.Keyword(null,"actor","actor",-1830560481);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("runtime_features",G__27927)){
return new cljs.core.Keyword(null,"runtime-feature","runtime-feature",1714804721);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("actions",G__27927)){
return new cljs.core.Keyword(null,"action","action",-811238024);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("cms-template-registry",G__27927)){
return new cljs.core.Keyword(null,"cms","cms",-160759541);
} else {
throw (new Error((""+"Unknown resource kind: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))));

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
}
}
}
});
knoxx.backend.domain.resources.loader.resource_class = (function knoxx$backend$domain$resources$loader$resource_class(resource_kind){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.resources.loader.resource_kind__GT_class,knoxx.backend.domain.resources.loader.normalize_resource_kind(resource_kind));
});
knoxx.backend.domain.resources.loader.resource_kind_from_class = (function knoxx$backend$domain$resources$loader$resource_kind_from_class(class_name){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.resources.loader.class__GT_resource_kind,class_name);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(class_name)),/_/,"-"));
}
});
knoxx.backend.domain.resources.loader.resource_record = (function knoxx$backend$domain$resources$loader$resource_record(record){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"ok?","ok?",447310304),new cljs.core.Keyword("resource","class","resource/class",-1836136798),new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458),new cljs.core.Keyword("resource","id","resource/id",-822839770),new cljs.core.Keyword("resource","kind","resource/kind",-1047940985),new cljs.core.Keyword("resource","file-path","resource/file-path",-1803356408),new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword(null,"resourceClass","resourceClass",-976535831),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694),new cljs.core.Keyword("resource","definition","resource/definition",-1547661004),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"file-path","file-path",-2005501162),new cljs.core.Keyword("resource","edn-text","resource/edn-text",2025613624)],[new cljs.core.Keyword(null,"ok?","ok?",447310304).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record),knoxx.backend.domain.resources.loader.resource_kind_from_class(new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record)),new cljs.core.Keyword(null,"file-path","file-path",-2005501162).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"file-path","file-path",-2005501162).cljs$core$IFn$_invoke$arity$1(record),new cljs.core.Keyword(null,"edn-text","edn-text",-2069322458).cljs$core$IFn$_invoke$arity$1(record)]);
});
knoxx.backend.domain.resources.loader.load_all_resources_sync = (function knoxx$backend$domain$resources$loader$load_all_resources_sync(config){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.resources.loader.resource_record,knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
knoxx.backend.domain.resources.loader.load_all_resources_BANG_ = (async function knoxx$backend$domain$resources$loader$load_all_resources_BANG_(config){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.resources.loader.resource_record,(await knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_(config)));
});
knoxx.backend.domain.resources.loader.resource_record_sync = (function knoxx$backend$domain$resources$loader$resource_record_sync(config,resource_kind,resource_id){
var class_name = knoxx.backend.domain.resources.loader.resource_class(resource_kind);
var wanted_id = (function (){var G__27939 = resource_id;
var G__27939__$1 = (((G__27939 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27939)));
var G__27939__$2 = (((G__27939__$1 == null))?null:clojure.string.trim(G__27939__$1));
if((G__27939__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27939__$2);
}
})();
return cljs.core.some((function (record){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(class_name,new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword("resource","id","resource/id",-822839770).cljs$core$IFn$_invoke$arity$1(record))))){
return record;
} else {
return null;
}
}),knoxx.backend.domain.resources.loader.load_all_resources_sync(config));
});
knoxx.backend.domain.resources.loader.resource_sync = (function knoxx$backend$domain$resources$loader$resource_sync(config,resource_kind,resource_id){
var G__27943 = knoxx.backend.domain.resources.loader.resource_record_sync(config,resource_kind,resource_id);
if((G__27943 == null)){
return null;
} else {
return new cljs.core.Keyword("resource","definition","resource/definition",-1547661004).cljs$core$IFn$_invoke$arity$1(G__27943);
}
});
knoxx.backend.domain.resources.loader.list_resource_ids_sync = (function knoxx$backend$domain$resources$loader$list_resource_ids_sync(config,resource_kind){
var class_name = knoxx.backend.domain.resources.loader.resource_class(resource_kind);
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","id","resource/id",-822839770),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27945_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(class_name,new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(p1__27945_SHARP_));
}),knoxx.backend.domain.resources.loader.load_all_resources_sync(config))))));
});
knoxx.backend.domain.resources.loader.list_resource_ids_BANG_ = (async function knoxx$backend$domain$resources$loader$list_resource_ids_BANG_(config,resource_kind){
var class_name = knoxx.backend.domain.resources.loader.resource_class(resource_kind);
var records = (await knoxx.backend.domain.resources.loader.load_all_resources_BANG_(config));
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("resource","id","resource/id",-822839770),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27950_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(class_name,new cljs.core.Keyword("resource","class","resource/class",-1836136798).cljs$core$IFn$_invoke$arity$1(p1__27950_SHARP_));
}),records)))));
});
knoxx.backend.domain.resources.loader.safe_resource_id_BANG_ = (function knoxx$backend$domain$resources$loader$safe_resource_id_BANG_(resource_id){
return knoxx.backend.domain.contracts.loader.safe_path_segment_BANG_(resource_id,"resource-id");
});
knoxx.backend.domain.resources.loader.resource_root_paths = (function knoxx$backend$domain$resources$loader$resource_root_paths(config){
return knoxx.backend.domain.contracts.loader.contract_root_paths(config);
});
knoxx.backend.domain.resources.loader.resource_file_path = (function knoxx$backend$domain$resources$loader$resource_file_path(var_args){
var G__27956 = arguments.length;
switch (G__27956) {
case 2:
return knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$2 = (function (config,resource_id){
return knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3(config,new cljs.core.Keyword(null,"agent","agent",-766455027),resource_id);
}));

(knoxx.backend.domain.resources.loader.resource_file_path.cljs$core$IFn$_invoke$arity$3 = (function (config,resource_kind,resource_id){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(config,knoxx.backend.domain.resources.loader.resource_class(resource_kind),resource_id);
}));

(knoxx.backend.domain.resources.loader.resource_file_path.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.resources.loader.write_edn_file_BANG_ = (function knoxx$backend$domain$resources$loader$write_edn_file_BANG_(file_path,edn_text){
return knoxx.backend.domain.contracts.loader.write_edn_file_BANG_(file_path,edn_text);
});
knoxx.backend.domain.resources.loader.read_edn_file_BANG_ = (function knoxx$backend$domain$resources$loader$read_edn_file_BANG_(file_path){
return knoxx.backend.domain.contracts.loader.read_edn_file_BANG_(file_path);
});
knoxx.backend.domain.resources.loader.invalidate_sync_resource_cache_BANG_ = (function knoxx$backend$domain$resources$loader$invalidate_sync_resource_cache_BANG_(){
return knoxx.backend.domain.contracts.loader.invalidate_sync_contract_cache_BANG_();
});

//# sourceMappingURL=knoxx.backend.domain.resources.loader.js.map
