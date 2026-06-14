import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('open_hax.contract_runtime.agent.turn_guards');
open_hax.contract_runtime.agent.turn_guards.default_death_spiral_streak_limit = (6);
open_hax.contract_runtime.agent.turn_guards.default_death_spiral_total_limit = (12);
open_hax.contract_runtime.agent.turn_guards.empty_tool_loop_state = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"last","last",1105735132),null,new cljs.core.Keyword(null,"streak","streak",1229213332),(0),new cljs.core.Keyword(null,"counts","counts",234305892),cljs.core.PersistentArrayMap.EMPTY], null);
/**
 * Update repeated-tool-call state and return an abort decision.
 * 
 * `guard-state` is a map like {:last signature :streak n :counts {signature n}}.
 * `event` accepts :tool-name, :tool-call-id, :input-preview, :aborting?, and
 * optional :streak-limit/:total-limit overrides.
 */
open_hax.contract_runtime.agent.turn_guards.observe_tool_call = (function open_hax$contract_runtime$agent$turn_guards$observe_tool_call(guard_state,p__22386){
var map__22388 = p__22386;
var map__22388__$1 = cljs.core.__destructure_map(map__22388);
var tool_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"tool-name","tool-name",613742581));
var tool_call_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999));
var input_preview = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"input-preview","input-preview",-811479635));
var aborting_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"aborting?","aborting?",690860697));
var streak_limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"streak-limit","streak-limit",-262517769));
var total_limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22388__$1,new cljs.core.Keyword(null,"total-limit","total-limit",-89070134));
var map__22390 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([open_hax.contract_runtime.agent.turn_guards.empty_tool_loop_state,guard_state], 0));
var map__22390__$1 = cljs.core.__destructure_map(map__22390);
var last = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22390__$1,new cljs.core.Keyword(null,"last","last",1105735132));
var streak = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22390__$1,new cljs.core.Keyword(null,"streak","streak",1229213332));
var counts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22390__$1,new cljs.core.Keyword(null,"counts","counts",234305892));
var streak_limit__$1 = (function (){var or__5162__auto__ = streak_limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return open_hax.contract_runtime.agent.turn_guards.default_death_spiral_streak_limit;
}
})();
var total_limit__$1 = (function (){var or__5162__auto__ = total_limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return open_hax.contract_runtime.agent.turn_guards.default_death_spiral_total_limit;
}
})();
var signature = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name)+"::"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = input_preview;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var next_total = (cljs.core.get.cljs$core$IFn$_invoke$arity$3(counts,signature,(0)) + (1));
var next_counts = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(counts,signature,next_total);
var next_streak = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(signature,last))?(streak + (1)):(1));
var abort_QMARK_ = ((cljs.core.not(aborting_QMARK_)) && ((((next_streak >= streak_limit__$1)) || ((next_total >= total_limit__$1)))));
var reason = ((abort_QMARK_)?(""+"death_spiral_detected: tool '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name)+"' repeated "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(next_total)+"x (streak "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(next_streak)+")"):null);
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"state","state",-1988618099),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"last","last",1105735132),signature,new cljs.core.Keyword(null,"streak","streak",1229213332),next_streak,new cljs.core.Keyword(null,"counts","counts",234305892),next_counts], null),new cljs.core.Keyword(null,"abort?","abort?",2066246355),cljs.core.boolean$(abort_QMARK_),new cljs.core.Keyword(null,"reason","reason",-2070751759),reason,new cljs.core.Keyword(null,"signature","signature",1463754794),signature,new cljs.core.Keyword(null,"tool-name","tool-name",613742581),tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),tool_call_id,new cljs.core.Keyword(null,"count","count",2139924085),next_total,new cljs.core.Keyword(null,"streak","streak",1229213332),next_streak], null);
});

//# sourceMappingURL=open_hax.contract_runtime.agent.turn_guards.js.map
