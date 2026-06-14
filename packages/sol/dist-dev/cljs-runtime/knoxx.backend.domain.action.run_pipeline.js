import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.action.registry.js";
goog.provide('knoxx.backend.domain.action.run_pipeline');
knoxx.backend.domain.action.run_pipeline.nonblank = (function knoxx$backend$domain$action$run_pipeline$nonblank(value){
var G__22712 = value;
var G__22712__$1 = (((G__22712 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22712)));
var G__22712__$2 = (((G__22712__$1 == null))?null:clojure.string.trim(G__22712__$1));
if((G__22712__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__22712__$2);
}
});
knoxx.backend.domain.action.run_pipeline.load_contract_sync = (function knoxx$backend$domain$action$run_pipeline$load_contract_sync(config,contract_class,contract_id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var wanted_id = knoxx.backend.domain.action.run_pipeline.nonblank(contract_id);
return cljs.core.some((function (record){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record))))){
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
} else {
return null;
}
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
knoxx.backend.domain.action.registry.run_action_BANG_.cljs$core$IMultiFn$_add_method$arity$3(null,new cljs.core.Keyword("actions","run-pipeline","actions/run-pipeline",-1671954142),(function (p__22721,action){
var map__22722 = p__22721;
var map__22722__$1 = cljs.core.__destructure_map(map__22722);
var ctx = map__22722__$1;
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22722__$1,new cljs.core.Keyword(null,"config","config",994861415));
console.warn("[knoxx/actions] :actions/run-pipeline is deprecated; use :actions/run-steps");

var pipeline_id = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"pipeline-id","pipeline-id",1007598364)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(action,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.Keyword(null,"pipelineId","pipelineId",908950984)], null));
}
})();
if(cljs.core.not(pipeline_id)){
return Promise.reject((new Error("Action :actions/run-pipeline requires :pipeline-id in :action/with")));
} else {
var temp__5823__auto__ = knoxx.backend.domain.action.run_pipeline.load_contract_sync(config,"pipelines",pipeline_id);
if(cljs.core.truth_(temp__5823__auto__)){
var contract = temp__5823__auto__;
var steps = (function (){var or__5162__auto__ = new cljs.core.Keyword("pipeline","steps","pipeline/steps",313171416).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var run_steps_action = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("action","kind","action/kind",-2113018193),new cljs.core.Keyword("actions","run-steps","actions/run-steps",1352154374),new cljs.core.Keyword("action","with","action/with",-243371526),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"steps","steps",-128433302),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (step){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"action","action",-811238024),cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("step","contract","step/contract",793567485).cljs$core$IFn$_invoke$arity$1(step)),new cljs.core.Keyword(null,"with","with",-1536296876),cljs.core.get_in.cljs$core$IFn$_invoke$arity$3(step,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("step","data","step/data",-237255053),new cljs.core.Keyword(null,"context","context",-830191113)], null),cljs.core.PersistentArrayMap.EMPTY)], null);
}),steps)], null)], null);
return knoxx.backend.domain.action.registry.run_steps_handler(ctx,run_steps_action);
} else {
return Promise.reject((new Error((""+"Pipeline contract not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(pipeline_id)))));
}
}
}));

//# sourceMappingURL=knoxx.backend.domain.action.run_pipeline.js.map
