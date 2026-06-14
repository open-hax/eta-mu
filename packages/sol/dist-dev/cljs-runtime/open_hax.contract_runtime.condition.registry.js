import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.condition.registry');
if((typeof open_hax !== 'undefined') && (typeof open_hax.contract_runtime !== 'undefined') && (typeof open_hax.contract_runtime.condition !== 'undefined') && (typeof open_hax.contract_runtime.condition.registry !== 'undefined') && (typeof open_hax.contract_runtime.condition.registry.registry_STAR_ !== 'undefined')){
} else {
open_hax.contract_runtime.condition.registry.registry_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Register a condition function under a namespaced keyword id.
 * Signature: (fn [event actor trigger config] -> boolean)
 */
open_hax.contract_runtime.condition.registry.register_condition_BANG_ = (function open_hax$contract_runtime$condition$registry$register_condition_BANG_(id,f){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(open_hax.contract_runtime.condition.registry.registry_STAR_,cljs.core.assoc,id,f);
});
/**
 * Look up a condition function by id. Returns nil if not found.
 */
open_hax.contract_runtime.condition.registry.condition_fn = (function open_hax$contract_runtime$condition$registry$condition_fn(id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(open_hax.contract_runtime.condition.registry.registry_STAR_),id);
});
/**
 * Return all registered condition ids.
 */
open_hax.contract_runtime.condition.registry.condition_ids = (function open_hax$contract_runtime$condition$registry$condition_ids(){
return cljs.core.keys(cljs.core.deref(open_hax.contract_runtime.condition.registry.registry_STAR_));
});
/**
 * Map of whitelisted symbols to their function values for condition evaluation.
 */
open_hax.contract_runtime.condition.registry.safe_fns = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Symbol(null,"true?","true?",-1600332395,null),new cljs.core.Symbol(null,"first","first",996428481,null),new cljs.core.Symbol(null,"rest","rest",398835108,null),new cljs.core.Symbol(null,"seq","seq",-177272256,null),new cljs.core.Symbol(null,">=",">=",1016916022,null),new cljs.core.Symbol(null,">",">",1085014381,null),new cljs.core.Symbol(null,"count","count",-514511684,null),new cljs.core.Symbol(null,"nil?","nil?",1612038930,null),new cljs.core.Symbol("str","starts-with?","str/starts-with?",1014321448,null),new cljs.core.Symbol(null,"false?","false?",-1522377573,null),new cljs.core.Symbol(null,"not","not",1044554643,null),new cljs.core.Symbol("str","includes?","str/includes?",-2049398758,null),new cljs.core.Symbol(null,"<=","<=",1244895369,null),new cljs.core.Symbol(null,"=","=",-1501502141,null),new cljs.core.Symbol(null,"every?","every?",2083724064,null),new cljs.core.Symbol(null,"name","name",-810760592,null),new cljs.core.Symbol(null,"keyword?","keyword?",1917797069,null),new cljs.core.Symbol(null,"empty?","empty?",76408555,null),new cljs.core.Symbol(null,"some","some",-310548046,null),new cljs.core.Symbol(null,"get-in","get-in",-1965644065,null),new cljs.core.Symbol("str","lower-case","str/lower-case",1428157153,null),new cljs.core.Symbol(null,"string?","string?",-1129175764,null),new cljs.core.Symbol(null,"map","map",-1282745308,null),new cljs.core.Symbol(null,"not=","not=",1466536204,null),new cljs.core.Symbol(null,"get","get",-971253014,null),new cljs.core.Symbol(null,"str","str",-1564826950,null),new cljs.core.Symbol(null,"<","<",993667236,null),new cljs.core.Symbol(null,"keyword","keyword",-1843046022,null),new cljs.core.Symbol(null,"some?","some?",234752293,null),new cljs.core.Symbol(null,"boolean?","boolean?",1790940868,null),new cljs.core.Symbol(null,"contains?","contains?",-1676812576,null),new cljs.core.Symbol("str","ends-with?","str/ends-with?",-346979887,null),new cljs.core.Symbol(null,"number?","number?",-1747282210,null),new cljs.core.Symbol(null,"filter","filter",691993593,null),new cljs.core.Symbol(null,"remove","remove",1509103113,null)],[cljs.core.true_QMARK_,cljs.core.first,cljs.core.rest,cljs.core.seq,cljs.core._GT__EQ_,cljs.core._GT_,cljs.core.count,cljs.core.nil_QMARK_,clojure.string.starts_with_QMARK_,cljs.core.false_QMARK_,cljs.core.not,clojure.string.includes_QMARK_,cljs.core._LT__EQ_,cljs.core._EQ_,cljs.core.every_QMARK_,cljs.core.name,cljs.core.keyword_QMARK_,cljs.core.empty_QMARK_,cljs.core.some,cljs.core.get_in,clojure.string.lower_case,cljs.core.string_QMARK_,cljs.core.map,cljs.core.not_EQ_,cljs.core.get,cljs.core.str,cljs.core._LT_,cljs.core.keyword,cljs.core.some_QMARK_,cljs.core.boolean_QMARK_,cljs.core.contains_QMARK_,clojure.string.ends_with_QMARK_,cljs.core.number_QMARK_,cljs.core.filter,cljs.core.remove]);
/**
 * Return true if the symbol is a known safe function for conditions.
 */
open_hax.contract_runtime.condition.registry.safe_fn_QMARK_ = (function open_hax$contract_runtime$condition$registry$safe_fn_QMARK_(sym){
return cljs.core.contains_QMARK_(open_hax.contract_runtime.condition.registry.safe_fns,sym);
});
/**
 * Evaluate a list expression safely.
 */
open_hax.contract_runtime.condition.registry.eval_list = (function open_hax$contract_runtime$condition$registry$eval_list(expr,bindings){
if(cljs.core.seq(expr)){
var head = cljs.core.first(expr);
var tail = cljs.core.rest(expr);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"and","and",668631710,null),head)){
return cljs.core.every_QMARK_((function (p1__23010_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23010_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23010_SHARP_,bindings));
}),tail);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"or","or",1876275696,null),head)){
return cljs.core.some((function (p1__23011_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23011_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23011_SHARP_,bindings));
}),tail);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"not","not",1044554643,null),head)){
return cljs.core.not((function (){var G__23026 = cljs.core.first(tail);
var G__23027 = bindings;
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(G__23026,G__23027) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,G__23026,G__23027));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"=","=",-1501502141,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._EQ_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23012_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23012_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23012_SHARP_,bindings));
}),tail));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"not=","not=",1466536204,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.not_EQ_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23013_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23013_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23013_SHARP_,bindings));
}),tail));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"<","<",993667236,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._LT_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23014_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23014_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23014_SHARP_,bindings));
}),tail));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,">",">",1085014381,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._GT_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23016_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23016_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23016_SHARP_,bindings));
}),tail));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"<=","<=",1244895369,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._LT__EQ_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23017_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23017_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23017_SHARP_,bindings));
}),tail));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,">=",">=",1016916022,null),head)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._GT__EQ_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23018_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23018_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23018_SHARP_,bindings));
}),tail));
} else {
if((head instanceof cljs.core.Keyword)){
var temp__5823__auto__ = open_hax.contract_runtime.condition.registry.condition_fn(head);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23019_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23019_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23019_SHARP_,bindings));
}),tail));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unknown condition keyword",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ref","ref",1289896967),head], null));
}
} else {
if((head instanceof cljs.core.Symbol)){
var temp__5823__auto__ = (function (){var or__5162__auto__ = open_hax.contract_runtime.condition.registry.condition_fn(cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(head));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.condition.registry.safe_fns,head);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23020_SHARP_){
return (open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 ? open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(p1__23020_SHARP_,bindings) : open_hax.contract_runtime.condition.registry.safe_eval.call(null,p1__23020_SHARP_,bindings));
}),tail));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unknown function in condition expression",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sym","sym",-1444860305),head,new cljs.core.Keyword(null,"allowed","allowed",1436019743),open_hax.contract_runtime.condition.registry.safe_fn_QMARK_(head)], null));
}
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Invalid condition expression head",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"head","head",-771383919),head,new cljs.core.Keyword(null,"expr","expr",745722291),expr], null));

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
} else {
return null;
}
});
/**
 * Safely evaluate a condition expression with bindings.
 * Bindings map symbols to values (e.g. {'event evt 'actor act}).
 * Only condition registry fns and whitelisted core fns are callable.
 */
open_hax.contract_runtime.condition.registry.safe_eval = (function open_hax$contract_runtime$condition$registry$safe_eval(var_args){
var G__23060 = arguments.length;
switch (G__23060) {
case 2:
return open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2 = (function (expr,bindings){
return open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3(expr,bindings,(8));
}));

(open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3 = (function (expr,bindings,max_depth){
if((max_depth < (0))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Condition expression too deeply nested",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"expr","expr",745722291),expr], null));
} else {
}

if((expr instanceof cljs.core.Symbol)){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(bindings,expr);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unbound symbol in condition",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sym","sym",-1444860305),expr,new cljs.core.Keyword(null,"available","available",-1470697127),cljs.core.keys(bindings)], null));
}
} else {
if(cljs.core.seq_QMARK_(expr)){
return open_hax.contract_runtime.condition.registry.eval_list(expr,bindings);
} else {
if(cljs.core.vector_QMARK_(expr)){
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23049_SHARP_){
return open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3(p1__23049_SHARP_,bindings,(max_depth - (1)));
}),expr));
} else {
if(cljs.core.map_QMARK_(expr)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p__23076){
var vec__23077 = p__23076;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23077,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23077,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3(k,bindings,(max_depth - (1))),open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3(v,bindings,(max_depth - (1)))], null);
})),expr);
} else {
if(cljs.core.set_QMARK_(expr)){
return cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__23054_SHARP_){
return open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$3(p1__23054_SHARP_,bindings,(max_depth - (1)));
}),expr));
} else {
return expr;

}
}
}
}
}
}));

(open_hax.contract_runtime.condition.registry.safe_eval.cljs$lang$maxFixedArity = 3);

/**
 * Evaluate a trigger condition expression against an event, actor, trigger, and config.
 * Returns boolean. Any exception becomes false (condition fails closed).
 */
open_hax.contract_runtime.condition.registry.evaluate = (function open_hax$contract_runtime$condition$registry$evaluate(expr,event,actor,trigger,config){
if((expr == null)){
return true;
} else {
return cljs.core.boolean$(open_hax.contract_runtime.condition.registry.safe_eval.cljs$core$IFn$_invoke$arity$2(expr,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Symbol(null,"event","event",1941966969,null),event,new cljs.core.Symbol(null,"actor","actor",-190028954,null),actor,new cljs.core.Symbol(null,"trigger","trigger",1743997666,null),trigger,new cljs.core.Symbol(null,"config","config",-1659574354,null),config], null)));
}
});

//# sourceMappingURL=open_hax.contract_runtime.condition.registry.js.map
