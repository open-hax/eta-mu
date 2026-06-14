import "./cljs_env.js";
import "./cljs.core.js";
import "./promesa.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.temp_memory.js";
import "./knoxx.backend.shape.pipeline.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.discord.discord_io.js";
goog.provide('knoxx.backend.infra.pipeline_runner');
knoxx.backend.infra.pipeline_runner.load_contract_sync = (function knoxx$backend$infra$pipeline_runner$load_contract_sync(config,contract_class,contract_id){
var klass = knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
var wanted_id = (function (){var G__69956 = contract_id;
var G__69956__$1 = (((G__69956 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__69956)));
var G__69956__$2 = (((G__69956__$1 == null))?null:clojure.string.trim(G__69956__$1));
if((G__69956__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__69956__$2);
}
})();
return cljs.core.some((function (record){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(record))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(record))))){
return new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(record);
} else {
return null;
}
}),knoxx.backend.domain.contracts.loader.load_all_contracts_sync(config));
});
/**
 * Given a map m, find all {{memory.temp:k}} keys and resolve them.
 * Returns Promise<{k value}>.
 */
knoxx.backend.infra.pipeline_runner.resolve_temps = (function knoxx$backend$infra$pipeline_runner$resolve_temps(m){
var re = /\{\{memory\.temp:([^}]+)\}\}/;
var all_keys = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.concat,cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (v){
if(typeof v === 'string'){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.second,cljs.core.re_seq(re,v));
} else {
return null;
}
}),cljs.core.vals(m)))));
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20961__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(promesa.core.all(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (k){
return promesa.core.then.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.temp_memory.mem_get(k),(function (v){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,v], null);
}));
}),all_keys))),(function (resolved){
return promesa.protocols._promise(promesa.core.then.cljs$core$IFn$_invoke$arity$2(resolved,(function (pairs){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,pairs);
})));
}));
}));
});
knoxx.backend.infra.pipeline_runner.interpolate_map = (function knoxx$backend$infra$pipeline_runner$interpolate_map(m,k__GT_v){
return knoxx.backend.shape.pipeline.interpolate_map(m,k__GT_v);
});
/**
 * Execute an :action step.
 */
knoxx.backend.infra.pipeline_runner.run_action_step_BANG_ = (function knoxx$backend$infra$pipeline_runner$run_action_step_BANG_(_step){
console.log("[pipeline]",new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(_step),"action step");

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20961__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.temp_memory.mem_set_BANG_((""+"step:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(_step))),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"done","done",-889844188),true,new cljs.core.Keyword(null,"step","step",1288888124),new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(_step)], null))),(function (_){
return promesa.protocols._promise(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"step-id","step-id",712954044),new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(_step),new cljs.core.Keyword(null,"status","status",-1997798413),"ok"], null));
}));
}));
});
/**
 * Execute an :agent step by starting a Knoxx agent session.
 */
knoxx.backend.infra.pipeline_runner.run_agent_step_BANG_ = (function knoxx$backend$infra$pipeline_runner$run_agent_step_BANG_(config,step,contract,pipeline_ctx,k__GT_v){
var output = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(step,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("step","data","step/data",-237255053),new cljs.core.Keyword(null,"output","output",-1105869043)], null));
console.log("[pipeline]",new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(step),"agent step",new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(contract));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20961__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.pipeline_runner.interpolate_map(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([pipeline_ctx,new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(contract),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(step,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword("step","data","step/data",-237255053),new cljs.core.Keyword(null,"context","context",-830191113)], null))], 0)),k__GT_v)),(function (ctx){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.discord.discord_io.start_agent_session_BANG_(config,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(contract,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(contract,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompts","prompts",15471501),new cljs.core.Keyword(null,"task","task",-1476607993)], null))),cljs.core.select_keys(ctx,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),new cljs.core.Keyword(null,"channelName","channelName",327631603),new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"reason","reason",-2070751759)], null)))),(function (result){
return promesa.protocols._mcat(promesa.protocols._promise((cljs.core.truth_(output)?knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(output),result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ttl","ttl",-1115275118),new cljs.core.Keyword(null,"ttl","ttl",-1115275118).cljs$core$IFn$_invoke$arity$1(output)], null)], 0)):null)),(function (___20929__auto__){
return promesa.protocols._promise(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"step-id","step-id",712954044),new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(step),new cljs.core.Keyword(null,"status","status",-1997798413),"ok",new cljs.core.Keyword(null,"result","result",1415092211),result], null));
}));
}));
}));
}));
});
/**
 * Execute one pipeline step. Returns Promise.
 */
knoxx.backend.infra.pipeline_runner.run_step_BANG_ = (function knoxx$backend$infra$pipeline_runner$run_step_BANG_(config,step,pipeline_ctx,k__GT_v){
var contract_id = new cljs.core.Keyword("step","contract","step/contract",793567485).cljs$core$IFn$_invoke$arity$1(step);
var temp__5823__auto__ = (function (){var or__5162__auto__ = knoxx.backend.infra.pipeline_runner.load_contract_sync(config,"actions",contract_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.pipeline_runner.load_contract_sync(config,"agents",contract_id);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var contract = temp__5823__auto__;
var G__69995 = new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(contract);
var G__69995__$1 = (((G__69995 instanceof cljs.core.Keyword))?G__69995.fqn:null);
switch (G__69995__$1) {
case "action":
return knoxx.backend.infra.pipeline_runner.run_action_step_BANG_(step);

break;
case "agent":
return knoxx.backend.infra.pipeline_runner.run_agent_step_BANG_(config,step,contract,pipeline_ctx,k__GT_v);

break;
default:
console.warn("[pipeline] unknown step kind",new cljs.core.Keyword("contract","kind","contract/kind",1929672067).cljs$core$IFn$_invoke$arity$1(contract));

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"step-id","step-id",712954044),new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(step),new cljs.core.Keyword(null,"status","status",-1997798413),"skip"], null));

}
} else {
console.warn("[pipeline] step contract not found:",contract_id);

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"step-id","step-id",712954044),new cljs.core.Keyword("step","id","step/id",-1375685784).cljs$core$IFn$_invoke$arity$1(step),new cljs.core.Keyword(null,"status","status",-1997798413),"not-found"], null));
}
});
knoxx.backend.infra.pipeline_runner.dependency_order = (function knoxx$backend$infra$pipeline_runner$dependency_order(steps){
return knoxx.backend.shape.pipeline.dependency_order(steps);
});
/**
 * Execute a :pipeline contract.
 */
knoxx.backend.infra.pipeline_runner.run_pipeline_BANG_ = (function knoxx$backend$infra$pipeline_runner$run_pipeline_BANG_(config,pipeline_contract){
var steps = new cljs.core.Keyword("pipeline","steps","pipeline/steps",313171416).cljs$core$IFn$_invoke$arity$1(pipeline_contract);
var pipeline_ctx = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(pipeline_contract),new cljs.core.Keyword(null,"trigger-ctx","trigger-ctx",33067902).cljs$core$IFn$_invoke$arity$1(pipeline_contract)], 0));
var ordered = knoxx.backend.infra.pipeline_runner.dependency_order(steps);
console.log("[pipeline] running",new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(pipeline_contract),"steps:",cljs.core.count(ordered));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20961__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.pipeline_runner.resolve_temps(pipeline_ctx)),(function (k__GT_v){
return promesa.protocols._promise(promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20961__auto____$1){
return promesa.protocols._mcat(promesa.protocols._promise(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (p,step){
return promesa.core.then.cljs$core$IFn$_invoke$arity$2(p,(function (_){
return knoxx.backend.infra.pipeline_runner.run_step_BANG_(config,step,pipeline_ctx,k__GT_v);
}));
}),Promise.resolve(null),ordered)),(function (_){
return promesa.protocols._mcat(promesa.protocols._promise(new cljs.core.Keyword(null,"output","output",-1105869043).cljs$core$IFn$_invoke$arity$1(pipeline_contract)),(function (output){
return promesa.protocols._mcat(promesa.protocols._promise((cljs.core.truth_(output)?knoxx.backend.infra.temp_memory.mem_set_BANG_.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"key","key",-1516042587).cljs$core$IFn$_invoke$arity$1(output),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"done","done",-889844188),true,new cljs.core.Keyword(null,"steps","steps",-128433302),cljs.core.count(ordered)], null),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ttl","ttl",-1115275118),new cljs.core.Keyword(null,"ttl","ttl",-1115275118).cljs$core$IFn$_invoke$arity$1(output)], null)], 0)):null)),(function (___20929__auto__){
return promesa.protocols._promise(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"pipeline-id","pipeline-id",1007598364),new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(pipeline_contract),new cljs.core.Keyword(null,"steps-run","steps-run",1066029943),cljs.core.count(ordered),new cljs.core.Keyword(null,"status","status",-1997798413),"ok"], null));
}));
}));
}));
})));
}));
}));
});

//# sourceMappingURL=knoxx.backend.infra.pipeline_runner.js.map
