import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.infra.defaults.js";
goog.provide('knoxx.backend.domain.agent.agent_templates');
knoxx.backend.domain.agent.agent_templates.lookup_missing = ({});
knoxx.backend.domain.agent.agent_templates.symbol_name = (function knoxx$backend$domain$agent$agent_templates$symbol_name(value){
if((value instanceof cljs.core.Symbol)){
return cljs.core.name(value);
} else {
if((value instanceof cljs.core.Keyword)){
return cljs.core.name(value);
} else {
if(typeof value === 'string'){
return value;
} else {
return null;

}
}
}
});
/**
 * True when value is an EDN form whose head is the trusted template operator.
 */
knoxx.backend.domain.agent.agent_templates.template_form_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$template_form_QMARK_(value){
return ((cljs.core.sequential_QMARK_(value)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("template",knoxx.backend.domain.agent.agent_templates.symbol_name(cljs.core.first(value)))));
});
knoxx.backend.domain.agent.agent_templates.key_candidates = (function knoxx$backend$domain$agent$agent_templates$key_candidates(k){
var raw = (((k instanceof cljs.core.Keyword))?cljs.core.name(k):(((k instanceof cljs.core.Symbol))?cljs.core.name(k):((typeof k === 'string')?k:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k))
)));
return cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,(cljs.core.truth_(raw)?cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw):null),(cljs.core.truth_(raw)?raw:null),(cljs.core.truth_((function (){var and__5160__auto__ = (k instanceof cljs.core.Keyword);
if(and__5160__auto__){
return cljs.core.namespace(k);
} else {
return and__5160__auto__;
}
})())?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.namespace(k))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(k))):null)], null)));
});
knoxx.backend.domain.agent.agent_templates.lookup_one = (function knoxx$backend$domain$agent$agent_templates$lookup_one(var_args){
var G__25862 = arguments.length;
switch (G__25862) {
case 2:
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$2 = (function (m,k){
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3(m,k,null);
}));

(knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3 = (function (m,k,not_found){
if((m == null)){
return not_found;
} else {
if(cljs.core.map_QMARK_(m)){
var found = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (_,candidate){
if(cljs.core.contains_QMARK_(m,candidate)){
return cljs.core.reduced(cljs.core.get.cljs$core$IFn$_invoke$arity$2(m,candidate));
} else {
return knoxx.backend.domain.agent.agent_templates.lookup_missing;
}
}),knoxx.backend.domain.agent.agent_templates.lookup_missing,knoxx.backend.domain.agent.agent_templates.key_candidates(k));
if((knoxx.backend.domain.agent.agent_templates.lookup_missing === found)){
return not_found;
} else {
return found;
}
} else {
if(((cljs.core.vector_QMARK_(m)) && (typeof k === 'number'))){
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(m,k,not_found);
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = cljs.core.array_QMARK_(m);
if(cljs.core.truth_(and__5160__auto__)){
return typeof k === 'number';
} else {
return and__5160__auto__;
}
})())){
var v = (m[k]);
if((void 0 === v)){
return not_found;
} else {
return v;
}
} else {
if(cljs.core.object_QMARK_(m)){
var raw = (((k instanceof cljs.core.Keyword))?cljs.core.name(k):(((k instanceof cljs.core.Symbol))?cljs.core.name(k):(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k))
));
var v = (m[raw]);
if((void 0 === v)){
return not_found;
} else {
return v;
}
} else {
return not_found;

}
}
}
}
}
}));

(knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.agent.agent_templates.lookup_path = (function knoxx$backend$domain$agent$agent_templates$lookup_path(m,ks){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,k){
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3(acc,k,null);
}),m,ks);
});
knoxx.backend.domain.agent.agent_templates.known_template_op_names = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 31, ["map",null,"vec",null,"=",null,"keys",null,"keep",null,"not",null,"str",null,"second",null,"get-in",null,"fn",null,"rest",null,"count",null,"sort",null,"distinct",null,"name",null,"if",null,"let",null,"vals",null,"or",null,"pr-str",null,"filter",null,"when",null,"and",null,"do",null,"fn*",null,"last",null,"template",null,"join",null,"quote",null,"get",null,"first",null], null), null);
knoxx.backend.domain.agent.agent_templates.env_missing = ({});
knoxx.backend.domain.agent.agent_templates.env_candidates = (function knoxx$backend$domain$agent$agent_templates$env_candidates(value){
var raw = knoxx.backend.domain.agent.agent_templates.symbol_name(value);
return cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [value,(cljs.core.truth_(raw)?raw:null),(cljs.core.truth_(raw)?cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(raw):null)], null)));
});
knoxx.backend.domain.agent.agent_templates.lookup_env = (function knoxx$backend$domain$agent$agent_templates$lookup_env(env,value){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (_,candidate){
if(cljs.core.contains_QMARK_(env,candidate)){
return cljs.core.reduced(cljs.core.get.cljs$core$IFn$_invoke$arity$2(env,candidate));
} else {
return knoxx.backend.domain.agent.agent_templates.env_missing;
}
}),knoxx.backend.domain.agent.agent_templates.env_missing,knoxx.backend.domain.agent.agent_templates.env_candidates(value));
});
knoxx.backend.domain.agent.agent_templates.env_ref_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$env_ref_QMARK_(env,value){
return (!((knoxx.backend.domain.agent.agent_templates.env_missing === knoxx.backend.domain.agent.agent_templates.lookup_env(env,value))));
});
knoxx.backend.domain.agent.agent_templates.eval_env_ref_or_form = (function knoxx$backend$domain$agent$agent_templates$eval_env_ref_or_form(form,env){
var found = knoxx.backend.domain.agent.agent_templates.lookup_env(env,form);
if((knoxx.backend.domain.agent.agent_templates.env_missing === found)){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(form,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,form,env));
} else {
return found;
}
});
knoxx.backend.domain.agent.agent_templates.keylike_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$keylike_QMARK_(value){
return (((value instanceof cljs.core.Keyword)) || ((((value instanceof cljs.core.Symbol)) || (typeof value === 'string'))));
});
knoxx.backend.domain.agent.agent_templates.keyword_call_vector_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$keyword_call_vector_QMARK_(value,env){
return ((cljs.core.vector_QMARK_(value)) && ((((cljs.core.count(value) > (1))) && (((typeof cljs.core.first(value) === 'string') && ((((!(cljs.core.contains_QMARK_(knoxx.backend.domain.agent.agent_templates.known_template_op_names,cljs.core.first(value))))) && (knoxx.backend.domain.agent.agent_templates.env_ref_QMARK_(env,cljs.core.last(value))))))))));
});
knoxx.backend.domain.agent.agent_templates.executable_vector_form_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$executable_vector_form_QMARK_(value,env){
var and__5160__auto__ = cljs.core.vector_QMARK_(value);
if(and__5160__auto__){
var and__5160__auto____$1 = cljs.core.seq(value);
if(and__5160__auto____$1){
var op = cljs.core.first(value);
var op_name = knoxx.backend.domain.agent.agent_templates.symbol_name(op);
return (((op instanceof cljs.core.Keyword)) || ((((op instanceof cljs.core.Symbol)) || (((cljs.core.contains_QMARK_(knoxx.backend.domain.agent.agent_templates.known_template_op_names,op_name)) || (knoxx.backend.domain.agent.agent_templates.keyword_call_vector_QMARK_(value,env)))))));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
});
knoxx.backend.domain.agent.agent_templates.eval_body = (function knoxx$backend$domain$agent$agent_templates$eval_body(forms,env){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (_,form){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(form,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,form,env));
}),null,forms);
});
knoxx.backend.domain.agent.agent_templates.bind_params = (function knoxx$backend$domain$agent$agent_templates$bind_params(env,params,args){
return cljs.core.reduce_kv((function (acc,idx,param){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,param,cljs.core.nth.cljs$core$IFn$_invoke$arity$3(args,idx,null));
}),env,cljs.core.vec(params));
});
knoxx.backend.domain.agent.agent_templates.make_fn = (function knoxx$backend$domain$agent$agent_templates$make_fn(params,body,env){
return (function() { 
var G__26453__delegate = function (args){
return knoxx.backend.domain.agent.agent_templates.eval_body(body,knoxx.backend.domain.agent.agent_templates.bind_params(env,params,args));
};
var G__26453 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__26454__i = 0, G__26454__a = new Array(arguments.length -  0);
while (G__26454__i < G__26454__a.length) {G__26454__a[G__26454__i] = arguments[G__26454__i + 0]; ++G__26454__i;}
  args = new cljs.core.IndexedSeq(G__26454__a,0,null);
} 
return G__26453__delegate.call(this,args);};
G__26453.cljs$lang$maxFixedArity = 0;
G__26453.cljs$lang$applyTo = (function (arglist__26455){
var args = cljs.core.seq(arglist__26455);
return G__26453__delegate(args);
});
G__26453.cljs$core$IFn$_invoke$arity$variadic = G__26453__delegate;
return G__26453;
})()
;
});
knoxx.backend.domain.agent.agent_templates.truthy_QMARK_ = (function knoxx$backend$domain$agent$agent_templates$truthy_QMARK_(value){
return (!((((value == null)) || (value === false))));
});
knoxx.backend.domain.agent.agent_templates.render_segments = (function knoxx$backend$domain$agent$agent_templates$render_segments(value){
if((value == null)){
return cljs.core.PersistentVector.EMPTY;
} else {
if(typeof value === 'string'){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [value], null);
} else {
if(cljs.core.sequential_QMARK_(value)){
return cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.agent.agent_templates.render_segments,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([value], 0));
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value))], null);

}
}
}
});
knoxx.backend.domain.agent.agent_templates.template_separator = (function knoxx$backend$domain$agent$agent_templates$template_separator(opts){
var or__5162__auto__ = new cljs.core.Keyword(null,"separator","separator",-1628749125).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"seperator","seperator",1521603306).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(opts,"separator");
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(opts,"seperator");
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return " ";
}
}
}
}
});
knoxx.backend.domain.agent.agent_templates.render_template_call = (function knoxx$backend$domain$agent$agent_templates$render_template_call(args,env){
var vec__26084 = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.count(args))) && (cljs.core.map_QMARK_(cljs.core.first(args)))))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(args),cljs.core.second(args)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.PersistentArrayMap.EMPTY,cljs.core.first(args)], null));
var opts_form = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26084,(0),null);
var parts_form = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26084,(1),null);
var opts = (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(opts_form,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,opts_form,env));
var separator = knoxx.backend.domain.agent.agent_templates.template_separator(opts);
var parts = (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(parts_form,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,parts_form,env));
return clojure.string.join.cljs$core$IFn$_invoke$arity$2(separator,knoxx.backend.domain.agent.agent_templates.render_segments(parts));
});
knoxx.backend.domain.agent.agent_templates.eval_keyword_call = (function knoxx$backend$domain$agent$agent_templates$eval_keyword_call(k,args,env){
var evaluated = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26090_SHARP_){
return knoxx.backend.domain.agent.agent_templates.eval_env_ref_or_form(p1__26090_SHARP_,env);
}),args);
var last_value = cljs.core.last(evaluated);
var leading = cljs.core.butlast(evaluated);
if(((cljs.core.seq(leading)) && (((cljs.core.every_QMARK_(knoxx.backend.domain.agent.agent_templates.keylike_QMARK_,leading)) && (((cljs.core.map_QMARK_(last_value)) || (cljs.core.object_QMARK_(last_value)))))))){
return knoxx.backend.domain.agent.agent_templates.lookup_path(last_value,cljs.core.cons(k,leading));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((1),cljs.core.count(evaluated))){
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3(cljs.core.first(evaluated),k,null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((2),cljs.core.count(evaluated))){
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3(cljs.core.first(evaluated),k,cljs.core.second(evaluated));
} else {
return null;

}
}
}
});
knoxx.backend.domain.agent.agent_templates.eval_map_call = (function knoxx$backend$domain$agent$agent_templates$eval_map_call(args,env){
var evaluated = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26095_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26095_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26095_SHARP_,env));
}),args);
var vec__26096 = ((cljs.core.fn_QMARK_(cljs.core.first(evaluated)))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(evaluated),cljs.core.second(evaluated)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second(evaluated),cljs.core.first(evaluated)], null));
var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26096,(0),null);
var coll = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26096,(1),null);
if(((cljs.core.fn_QMARK_(f)) && (cljs.core.sequential_QMARK_(coll)))){
return cljs.core.map.cljs$core$IFn$_invoke$arity$2(f,coll);
} else {
return null;
}
});
knoxx.backend.domain.agent.agent_templates.eval_filter_call = (function knoxx$backend$domain$agent$agent_templates$eval_filter_call(args,env){
var evaluated = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26102_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26102_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26102_SHARP_,env));
}),args);
var vec__26103 = ((cljs.core.fn_QMARK_(cljs.core.first(evaluated)))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(evaluated),cljs.core.second(evaluated)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second(evaluated),cljs.core.first(evaluated)], null));
var pred = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26103,(0),null);
var coll = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26103,(1),null);
if(((cljs.core.fn_QMARK_(pred)) && (cljs.core.sequential_QMARK_(coll)))){
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2(pred,coll);
} else {
return null;
}
});
knoxx.backend.domain.agent.agent_templates.eval_keep_call = (function knoxx$backend$domain$agent$agent_templates$eval_keep_call(args,env){
var evaluated = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26110_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26110_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26110_SHARP_,env));
}),args);
var vec__26113 = ((cljs.core.fn_QMARK_(cljs.core.first(evaluated)))?new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.first(evaluated),cljs.core.second(evaluated)], null):new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.second(evaluated),cljs.core.first(evaluated)], null));
var f = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26113,(0),null);
var coll = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26113,(1),null);
if(((cljs.core.fn_QMARK_(f)) && (cljs.core.sequential_QMARK_(coll)))){
return cljs.core.keep.cljs$core$IFn$_invoke$arity$2(f,coll);
} else {
return null;
}
});
knoxx.backend.domain.agent.agent_templates.eval_let_call = (function knoxx$backend$domain$agent$agent_templates$eval_let_call(args,env){
var bindings = cljs.core.first(args);
var body = cljs.core.rest(args);
var env_STAR_ = (function (){var pairs = cljs.core.partition.cljs$core$IFn$_invoke$arity$2((2),bindings);
var acc = env;
while(true){
var temp__5823__auto__ = cljs.core.first(pairs);
if(cljs.core.truth_(temp__5823__auto__)){
var vec__26123 = temp__5823__auto__;
var sym = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26123,(0),null);
var form = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26123,(1),null);
var G__26467 = cljs.core.rest(pairs);
var G__26468 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,sym,(knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(form,acc) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,form,acc)));
pairs = G__26467;
acc = G__26468;
continue;
} else {
return acc;
}
break;
}
})();
return knoxx.backend.domain.agent.agent_templates.eval_body(body,env_STAR_);
});
knoxx.backend.domain.agent.agent_templates.eval_and_call = (function knoxx$backend$domain$agent$agent_templates$eval_and_call(args,env){
var remaining = args;
var result = true;
while(true){
if(cljs.core.seq(remaining)){
var next_result = (function (){var G__26134 = cljs.core.first(remaining);
var G__26135 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26134,G__26135) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26134,G__26135));
})();
if(knoxx.backend.domain.agent.agent_templates.truthy_QMARK_(next_result)){
var G__26469 = cljs.core.rest(remaining);
var G__26470 = next_result;
remaining = G__26469;
result = G__26470;
continue;
} else {
return next_result;
}
} else {
return result;
}
break;
}
});
knoxx.backend.domain.agent.agent_templates.eval_or_call = (function knoxx$backend$domain$agent$agent_templates$eval_or_call(args,env){
return cljs.core.some((function (arg){
var result = (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(arg,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,arg,env));
if(knoxx.backend.domain.agent.agent_templates.truthy_QMARK_(result)){
return result;
} else {
return null;
}
}),args);
});
knoxx.backend.domain.agent.agent_templates.eval_list_call = (function knoxx$backend$domain$agent$agent_templates$eval_list_call(form,env){
var op = cljs.core.first(form);
var args = cljs.core.rest(form);
var op_name = knoxx.backend.domain.agent.agent_templates.symbol_name(op);
if((((op instanceof cljs.core.Keyword)) || (((typeof op === 'string') && ((((!(cljs.core.contains_QMARK_(knoxx.backend.domain.agent.agent_templates.known_template_op_names,op_name)))) && (((cljs.core.seq(args)) && (knoxx.backend.domain.agent.agent_templates.env_ref_QMARK_(env,cljs.core.last(args))))))))))){
return knoxx.backend.domain.agent.agent_templates.eval_keyword_call(op,args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("template",op_name)){
return knoxx.backend.domain.agent.agent_templates.render_template_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("quote",op_name)){
return cljs.core.first(args);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("do",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_body(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("let",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_let_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("if",op_name)){
if(knoxx.backend.domain.agent.agent_templates.truthy_QMARK_((function (){var G__26150 = cljs.core.first(args);
var G__26151 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26150,G__26151) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26150,G__26151));
})())){
var G__26154 = cljs.core.second(args);
var G__26155 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26154,G__26155) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26154,G__26155));
} else {
var G__26156 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(args,(2),null);
var G__26157 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26156,G__26157) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26156,G__26157));
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("when",op_name)){
if(knoxx.backend.domain.agent.agent_templates.truthy_QMARK_((function (){var G__26158 = cljs.core.first(args);
var G__26159 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26158,G__26159) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26158,G__26159));
})())){
return knoxx.backend.domain.agent.agent_templates.eval_body(cljs.core.rest(args),env);
} else {
return null;
}
} else {
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("fn",op_name)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("fn*",op_name)))){
return knoxx.backend.domain.agent.agent_templates.make_fn(cljs.core.first(args),cljs.core.rest(args),env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("str",op_name)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26136_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26136_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26136_SHARP_,env));
}),args));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("pr-str",op_name)){
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var G__26161 = cljs.core.first(args);
var G__26162 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26161,G__26162) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26161,G__26162));
})()], 0));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("name",op_name)){
var G__26164 = (function (){var G__26165 = cljs.core.first(args);
var G__26166 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26165,G__26166) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26165,G__26166));
})();
if((G__26164 == null)){
return null;
} else {
return cljs.core.name(G__26164);
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("count",op_name)){
return cljs.core.count((function (){var G__26169 = cljs.core.first(args);
var G__26170 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26169,G__26170) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26169,G__26170));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("first",op_name)){
return cljs.core.first((function (){var G__26171 = cljs.core.first(args);
var G__26172 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26171,G__26172) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26171,G__26172));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("second",op_name)){
return cljs.core.second((function (){var G__26175 = cljs.core.first(args);
var G__26176 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26175,G__26176) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26175,G__26176));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("last",op_name)){
return cljs.core.last((function (){var G__26178 = cljs.core.first(args);
var G__26179 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26178,G__26179) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26178,G__26179));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("rest",op_name)){
return cljs.core.rest((function (){var G__26181 = cljs.core.first(args);
var G__26182 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26181,G__26182) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26181,G__26182));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("vec",op_name)){
return cljs.core.vec((function (){var G__26186 = cljs.core.first(args);
var G__26187 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26186,G__26187) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26186,G__26187));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("distinct",op_name)){
return cljs.core.distinct.cljs$core$IFn$_invoke$arity$1((function (){var G__26190 = cljs.core.first(args);
var G__26191 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26190,G__26191) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26190,G__26191));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("sort",op_name)){
return cljs.core.sort.cljs$core$IFn$_invoke$arity$1((function (){var G__26198 = cljs.core.first(args);
var G__26199 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26198,G__26199) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26198,G__26199));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("keys",op_name)){
return cljs.core.keys((function (){var G__26201 = cljs.core.first(args);
var G__26202 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26201,G__26202) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26201,G__26202));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("vals",op_name)){
return cljs.core.vals((function (){var G__26205 = cljs.core.first(args);
var G__26206 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26205,G__26206) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26205,G__26206));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("get",op_name)){
return knoxx.backend.domain.agent.agent_templates.lookup_one.cljs$core$IFn$_invoke$arity$3((function (){var G__26210 = cljs.core.first(args);
var G__26211 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26210,G__26211) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26210,G__26211));
})(),(function (){var G__26212 = cljs.core.second(args);
var G__26213 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26212,G__26213) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26212,G__26213));
})(),(function (){var G__26215 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(args,(2),null);
var G__26216 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26215,G__26216) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26215,G__26216));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("get-in",op_name)){
return knoxx.backend.domain.agent.agent_templates.lookup_path((function (){var G__26217 = cljs.core.first(args);
var G__26218 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26217,G__26218) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26217,G__26218));
})(),(function (){var G__26219 = cljs.core.second(args);
var G__26220 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26219,G__26220) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26219,G__26220));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("map",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_map_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("filter",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_filter_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("keep",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_keep_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("join",op_name)){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2((function (){var G__26222 = cljs.core.first(args);
var G__26223 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26222,G__26223) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26222,G__26223));
})(),(function (){var G__26226 = cljs.core.second(args);
var G__26227 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26226,G__26227) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26226,G__26227));
})());
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("not",op_name)){
return (!(knoxx.backend.domain.agent.agent_templates.truthy_QMARK_((function (){var G__26229 = cljs.core.first(args);
var G__26230 = env;
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(G__26229,G__26230) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,G__26229,G__26230));
})())));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("and",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_and_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("or",op_name)){
return knoxx.backend.domain.agent.agent_templates.eval_or_call(args,env);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("=",op_name)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(cljs.core._EQ_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26142_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26142_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26142_SHARP_,env));
}),args));
} else {
throw (new Error((""+"Unsupported contract template form: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(op_name))));

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
/**
 * Evaluate a trusted contract template form against env.
 */
knoxx.backend.domain.agent.agent_templates.eval_template_form = (function knoxx$backend$domain$agent$agent_templates$eval_template_form(form,env){
if(knoxx.backend.domain.agent.agent_templates.template_form_QMARK_(form)){
return knoxx.backend.domain.agent.agent_templates.eval_list_call(form,env);
} else {
if(knoxx.backend.domain.agent.agent_templates.executable_vector_form_QMARK_(form,env)){
return knoxx.backend.domain.agent.agent_templates.eval_list_call(form,env);
} else {
if((form instanceof cljs.core.Symbol)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(env,form);
} else {
if((form instanceof cljs.core.Keyword)){
return form;
} else {
if(cljs.core.vector_QMARK_(form)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26236_SHARP_){
return (knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(p1__26236_SHARP_,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,p1__26236_SHARP_,env));
}),form);
} else {
if(cljs.core.map_QMARK_(form)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__26242){
var vec__26245 = p__26242;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26245,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26245,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [k,(knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.agent_templates.eval_template_form.cljs$core$IFn$_invoke$arity$2(v,env) : knoxx.backend.domain.agent.agent_templates.eval_template_form.call(null,v,env))], null);
}),form));
} else {
if(cljs.core.seq_QMARK_(form)){
return knoxx.backend.domain.agent.agent_templates.eval_list_call(form,env);
} else {
return form;

}
}
}
}
}
}
}
});
knoxx.backend.domain.agent.agent_templates.flatten_template_values = (function knoxx$backend$domain$agent$agent_templates$flatten_template_values(var_args){
var G__26259 = arguments.length;
switch (G__26259) {
case 1:
return knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$1 = (function (value){
return knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$2(null,value);
}));

(knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$2 = (function (prefix,value){
if(cljs.core.map_QMARK_(value)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$1((function (p__26265){
var vec__26266 = p__26265;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26266,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26266,(1),null);
var key_name = (((k instanceof cljs.core.Keyword))?cljs.core.name(k):((typeof k === 'string')?k:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k))
));
var next_prefix = (cljs.core.truth_(prefix)?(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+"."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key_name)):key_name);
return knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$2(next_prefix,v);
})),value);
} else {
if(cljs.core.sequential_QMARK_(value)){
if(cljs.core.truth_(prefix)){
return cljs.core.PersistentArrayMap.createAsIfByAssoc([prefix,clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,value))]);
} else {
return null;
}
} else {
if((!((value == null)))){
if(cljs.core.truth_(prefix)){
return cljs.core.PersistentArrayMap.createAsIfByAssoc([prefix,value]);
} else {
return null;
}
} else {
return cljs.core.PersistentArrayMap.EMPTY;

}
}
}
}));

(knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.agent.agent_templates.auth_context_template_values = (function knoxx$backend$domain$agent$agent_templates$auth_context_template_values(auth_context){
var user = new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(auth_context);
var org = new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(auth_context);
var membership = new cljs.core.Keyword(null,"membership","membership",254556333).cljs$core$IFn$_invoke$arity$1(auth_context);
var email = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"user-email","user-email",2126479881).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(user);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"user-email","user-email",2126479881).cljs$core$IFn$_invoke$arity$1(user);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618).cljs$core$IFn$_invoke$arity$1(user);
}
}
}
}
}
})();
var display_name = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"display-name","display-name",694513143).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(user);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"display-name","display-name",694513143).cljs$core$IFn$_invoke$arity$1(user);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(user);
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
return email;
}
}
}
}
}
}
})();
var org_slug = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"org-slug","org-slug",-726595051).cljs$core$IFn$_invoke$arity$1(org);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998).cljs$core$IFn$_invoke$arity$1(org);
}
}
}
}
})();
return new cljs.core.PersistentArrayMap(null, 6, ["name",display_name,"email",email,"user.email",email,"user.name",display_name,"org.slug",org_slug,"membership.id",(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"membership-id","membership-id",-723542492).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"membershipId","membershipId",2026001076).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership);
}
}
})()], null);
});
/**
 * Build the ctx map visible to contract forms.
 */
knoxx.backend.domain.agent.agent_templates.contract_template_context = (function knoxx$backend$domain$agent$agent_templates$contract_template_context(agent_spec,auth_context,template_context){
var agent_spec__$1 = (function (){var or__5162__auto__ = agent_spec;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
return cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"agent","agent",-766455027),agent_spec__$1,new cljs.core.Keyword(null,"auth","auth",1389754926),auth_context,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec__$1),new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec__$1),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec__$1),new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec__$1),new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec__$1),new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(agent_spec__$1)], null),(function (){var or__5162__auto__ = template_context;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], 0));
});
knoxx.backend.domain.agent.agent_templates.render_legacy_placeholders = (function knoxx$backend$domain$agent$agent_templates$render_legacy_placeholders(template,auth_context,template_context){
var values = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.agent.agent_templates.auth_context_template_values(auth_context),knoxx.backend.domain.agent.agent_templates.flatten_template_values.cljs$core$IFn$_invoke$arity$1(template_context)], 0));
return clojure.string.replace(template,/\{ctx\.([A-Za-z0-9_.-]+)\}/,(function (match){
var parts = ((cljs.core.vector_QMARK_(match))?match:new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [match], null));
var full = cljs.core.first(parts);
var key = cljs.core.second(parts);
var or__5162__auto__ = (function (){var G__26315 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(values,key);
if((G__26315 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26315));
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return full;
}
}));
});
/**
 * Render a prompt value. Strings use legacy {ctx.foo}; list forms use the
 * trusted contract template evaluator.
 */
knoxx.backend.domain.agent.agent_templates.render_prompt = (function knoxx$backend$domain$agent$agent_templates$render_prompt(var_args){
var G__26323 = arguments.length;
switch (G__26323) {
case 3:
return knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$3 = (function (prompt,agent_spec,auth_context){
return knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$4(prompt,agent_spec,auth_context,null);
}));

(knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$4 = (function (prompt,agent_spec,auth_context,template_context){
var ctx = knoxx.backend.domain.agent.agent_templates.contract_template_context(agent_spec,auth_context,template_context);
if(typeof prompt === 'string'){
return knoxx.backend.domain.agent.agent_templates.render_legacy_placeholders(prompt,auth_context,ctx);
} else {
if(knoxx.backend.domain.agent.agent_templates.template_form_QMARK_(prompt)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.agent_templates.eval_template_form(prompt,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Symbol(null,"ctx","ctx",1146921409,null),ctx], null))));
} else {
if(cljs.core.seq_QMARK_(prompt)){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.agent_templates.eval_template_form(prompt,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Symbol(null,"ctx","ctx",1146921409,null),ctx], null))));
} else {
if((!((prompt == null)))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prompt));
} else {
return null;

}
}
}
}
}));

(knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$lang$maxFixedArity = 4);

/**
 * Return a stored prompt value when it is non-empty. Forms are preserved.
 */
knoxx.backend.domain.agent.agent_templates.prompt_value = (function knoxx$backend$domain$agent$agent_templates$prompt_value(value){
if(typeof value === 'string'){
var G__26332 = value;
var G__26332__$1 = (((G__26332 == null))?null:clojure.string.trim(G__26332));
if((G__26332__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__26332__$1);
}
} else {
if((!((value == null)))){
return value;
} else {
return null;

}
}
});
knoxx.backend.domain.agent.agent_templates.prompt_preview = (function knoxx$backend$domain$agent$agent_templates$prompt_preview(value){
if(typeof value === 'string'){
var G__26344 = value;
var G__26344__$1 = (((G__26344 == null))?null:clojure.string.trim(G__26344));
if((G__26344__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__26344__$1);
}
} else {
if(knoxx.backend.domain.agent.agent_templates.template_form_QMARK_(value)){
return "(template \u2026)";
} else {
if((!((value == null)))){
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([value], 0));
} else {
return null;

}
}
}
});
/**
 * Render :system-prompt/:task-prompt (and camel/snake aliases) in agent-spec.
 */
knoxx.backend.domain.agent.agent_templates.render_agent_prompts = (function knoxx$backend$domain$agent$agent_templates$render_agent_prompts(var_args){
var G__26351 = arguments.length;
switch (G__26351) {
case 2:
return knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$2 = (function (agent_spec,auth_context){
return knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$3(agent_spec,auth_context,null);
}));

(knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$core$IFn$_invoke$arity$3 = (function (agent_spec,auth_context,template_context){
var agent_spec__$1 = (function (){var or__5162__auto__ = agent_spec;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var raw_system = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
}
}
})();
var raw_task = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"task_prompt","task_prompt",1276696196).cljs$core$IFn$_invoke$arity$1(agent_spec__$1);
}
}
})();
var system = knoxx.backend.domain.agent.agent_templates.prompt_value(knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$4(raw_system,agent_spec__$1,auth_context,template_context));
var task = knoxx.backend.domain.agent.agent_templates.prompt_value(knoxx.backend.domain.agent.agent_templates.render_prompt.cljs$core$IFn$_invoke$arity$4(raw_task,agent_spec__$1,auth_context,template_context));
var G__26357 = agent_spec__$1;
var G__26357__$1 = (cljs.core.truth_(system)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__26357,new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),system,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886),system], 0)):G__26357);
if(cljs.core.truth_(task)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__26357__$1,new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),task,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720),task], 0));
} else {
return G__26357__$1;
}
}));

(knoxx.backend.domain.agent.agent_templates.render_agent_prompts.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.agent.agent_templates.discord_message_template_context = (function knoxx$backend$domain$agent$agent_templates$discord_message_template_context(payload,event){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"message-id","message-id",-1564847547),new cljs.core.Keyword(null,"user-name","user-name",1302913545),new cljs.core.Keyword(null,"channel","channel",734187692),new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"guild-id","guild-id",292252911),new cljs.core.Keyword(null,"guild","guild",2098854354),new cljs.core.Keyword(null,"channel-id","channel-id",138191095),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"text","text",-1790561697)],[new cljs.core.Keyword(null,"messageId","messageId",-260575736).cljs$core$IFn$_invoke$arity$1(payload),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"authorUsername","authorUsername",177189965).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"username","username",1605666410).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"authorName","authorName",458688192).cljs$core$IFn$_invoke$arity$1(payload);
}
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"channelName","channelName",327631603).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(payload);
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"authorId","authorId",-1664154012).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(payload);
}
})(),new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(payload),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"guildName","guildName",119399715).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"guildId","guildId",-559818490).cljs$core$IFn$_invoke$arity$1(payload);
}
})(),new cljs.core.Keyword(null,"channelId","channelId",2082229448).cljs$core$IFn$_invoke$arity$1(payload),new cljs.core.Keyword(null,"timestamp","timestamp",579478971).cljs$core$IFn$_invoke$arity$1(event),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"summary","summary",380847952).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"payloadPreview","payloadPreview",874931409).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return "";
}
}
}
}
})()]);
});
/**
 * Context shape used by event/jobs/hooks.  :source/:messages matches the DSL
 * example while :event and :payload preserve the raw event surface.
 */
knoxx.backend.domain.agent.agent_templates.event_template_context = (function knoxx$backend$domain$agent$agent_templates$event_template_context(var_args){
var G__26367 = arguments.length;
switch (G__26367) {
case 2:
return knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$core$IFn$_invoke$arity$2 = (function (job,event){
return knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$core$IFn$_invoke$arity$3(job,event,null);
}));

(knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$core$IFn$_invoke$arity$3 = (function (job,event,summary){
var payload = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"payload","payload",-383036092).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var messages = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("source","messages","source/messages",705036603).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.truth_((function (){var or__5162__auto____$2 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"summary","summary",380847952).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return new cljs.core.Keyword(null,"payloadPreview","payloadPreview",874931409).cljs$core$IFn$_invoke$arity$1(payload);
}
}
})())){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.domain.agent.agent_templates.discord_message_template_context(payload,event)], null);
} else {
return null;
}
}
}
})());
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"job","job",850873087),job,new cljs.core.Keyword(null,"event","event",301435442),event,new cljs.core.Keyword(null,"payload","payload",-383036092),payload,new cljs.core.Keyword(null,"summary","summary",380847952),summary,new cljs.core.Keyword(null,"source","source",-433931539),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"source","source",-433931539).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"sourceKind","sourceKind",-1570414889).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword(null,"event-kind","event-kind",-191230187),new cljs.core.Keyword(null,"eventKind","eventKind",2138897648).cljs$core$IFn$_invoke$arity$1(event),new cljs.core.Keyword(null,"event","event",301435442),event,new cljs.core.Keyword(null,"payload","payload",-383036092),payload,new cljs.core.Keyword(null,"messages","messages",345434482),messages], null)], 0))], null);
}));

(knoxx.backend.domain.agent.agent_templates.event_template_context.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.agent.agent_templates.model_profiles = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"local-fast","local-fast",-1899378251),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"gemma4:e4b",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"off"], null),new cljs.core.Keyword(null,"local-mid","local-mid",1783247256),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"gemma4:31b",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"off"], null),new cljs.core.Keyword(null,"local-heavy","local-heavy",-855646526),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"gemma4:31b",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"minimal"], null),new cljs.core.Keyword(null,"cloud-heavy","cloud-heavy",507323846),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"glm-5",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"high"], null),new cljs.core.Keyword(null,"cloud-fast","cloud-fast",-1978516418),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"glm-5-fast",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"off"], null),new cljs.core.Keyword(null,"cloud-balanced","cloud-balanced",179139458),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),"glm-5",new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"minimal"], null)], null);
/**
 * Deprecated compatibility registry. Contract prompts are the source of truth.
 */
knoxx.backend.domain.agent.agent_templates.templates = cljs.core.PersistentArrayMap.EMPTY;
knoxx.backend.domain.agent.agent_templates.resolve_model_profile = (function knoxx$backend$domain$agent$agent_templates$resolve_model_profile(profile_id){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.agent.agent_templates.model_profiles,profile_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),knoxx.backend.infra.defaults.default_model(knoxx.backend.infra.config.cfg()),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),"off"], null);
}
});
knoxx.backend.domain.agent.agent_templates.all_model_profiles = (function knoxx$backend$domain$agent$agent_templates$all_model_profiles(){
return cljs.core.vec(cljs.core.keys(knoxx.backend.domain.agent.agent_templates.model_profiles));
});
knoxx.backend.domain.agent.agent_templates.get_template = (function knoxx$backend$domain$agent$agent_templates$get_template(template_id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.agent.agent_templates.templates,template_id);
});
knoxx.backend.domain.agent.agent_templates.all_templates = (function knoxx$backend$domain$agent$agent_templates$all_templates(){
return cljs.core.vec(cljs.core.keys(knoxx.backend.domain.agent.agent_templates.templates));
});
/**
 * Resolve a legacy template id into an agent spec. Prefer contract ids instead.
 */
knoxx.backend.domain.agent.agent_templates.resolve_template_spec = (function knoxx$backend$domain$agent$agent_templates$resolve_template_spec(template_id,overrides){
var template = knoxx.backend.domain.agent.agent_templates.get_template(template_id);
if(cljs.core.not(template)){
throw (new Error((""+"Unknown legacy agent template: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(template_id)+". Agent behavior now belongs in contracts.")));
} else {
var model_cfg = knoxx.backend.domain.agent.agent_templates.resolve_model_profile(new cljs.core.Keyword(null,"model-profile","model-profile",-1997108992).cljs$core$IFn$_invoke$arity$1(template));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([template,model_cfg], 0)),overrides], 0)),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(overrides);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(template);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(model_cfg);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "off";
}
}
}
})());
}
});
knoxx.backend.domain.agent.agent_templates.default_tool_policies = (function knoxx$backend$domain$agent$agent_templates$default_tool_policies(){
return new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.read",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.channel.messages",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.channel.scroll",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.dm.messages",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.search",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.publish",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"discord.send",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"websearch",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"memory_search",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),"graph_query",new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null)], null);
});
/**
 * Create a concrete legacy runtime job from a legacy template. Prefer explicit
 * agent, trigger, schedule, action, and generator resources instead.
 */
knoxx.backend.domain.agent.agent_templates.instantiate_job = (function knoxx$backend$domain$agent$agent_templates$instantiate_job(var_args){
var args__5903__auto__ = [];
var len__5897__auto___26558 = arguments.length;
var i__5898__auto___26559 = (0);
while(true){
if((i__5898__auto___26559 < len__5897__auto___26558)){
args__5903__auto__.push((arguments[i__5898__auto___26559]));

var G__26565 = (i__5898__auto___26559 + (1));
i__5898__auto___26559 = G__26565;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((5) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((5)),(0),null)):null);
return knoxx.backend.domain.agent.agent_templates.instantiate_job.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),argseq__5904__auto__);
});

(knoxx.backend.domain.agent.agent_templates.instantiate_job.cljs$core$IFn$_invoke$arity$variadic = (function (template_id,job_id,trigger,source,filters,p__26389){
var vec__26390 = p__26389;
var overrides = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26390,(0),null);
var agent_spec = knoxx.backend.domain.agent.agent_templates.resolve_template_spec(template_id,overrides);
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"description","description",-1428560544),new cljs.core.Keyword(null,"filters","filters",974726919),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"templateId","templateId",613248985),new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),new cljs.core.Keyword(null,"trigger","trigger",103466139),new cljs.core.Keyword(null,"enabled","enabled",1195909756)],[(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(overrides);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"Instance of "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.name(template_id))+" template");
}
})(),filters,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(overrides);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return job_id;
}
})(),source,job_id,cljs.core.name(template_id),agent_spec,trigger,true]);
}));

(knoxx.backend.domain.agent.agent_templates.instantiate_job.cljs$lang$maxFixedArity = (5));

/** @this {Function} */
(knoxx.backend.domain.agent.agent_templates.instantiate_job.cljs$lang$applyTo = (function (seq26380){
var G__26381 = cljs.core.first(seq26380);
var seq26380__$1 = cljs.core.next(seq26380);
var G__26382 = cljs.core.first(seq26380__$1);
var seq26380__$2 = cljs.core.next(seq26380__$1);
var G__26383 = cljs.core.first(seq26380__$2);
var seq26380__$3 = cljs.core.next(seq26380__$2);
var G__26384 = cljs.core.first(seq26380__$3);
var seq26380__$4 = cljs.core.next(seq26380__$3);
var G__26385 = cljs.core.first(seq26380__$4);
var seq26380__$5 = cljs.core.next(seq26380__$4);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__26381,G__26382,G__26383,G__26384,G__26385,seq26380__$5);
}));

/**
 * Ensure a job spec has all required fields for durable storage.
 */
knoxx.backend.domain.agent.agent_templates.normalize_job_for_persistence = (function knoxx$backend$domain$agent$agent_templates$normalize_job_for_persistence(job){
var now = (new Date()).toISOString();
return cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc_in(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(job,new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(job);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return now;
}
})()),new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),now),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429)], null),(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(job,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(job,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "off";
}
}
})()),new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),(function (p1__26412_SHARP_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p1__26412_SHARP_,new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953)),new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429).cljs$core$IFn$_invoke$arity$1(p1__26412_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953).cljs$core$IFn$_invoke$arity$1(p1__26412_SHARP_);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "off";
}
}
})());
}));
});

//# sourceMappingURL=knoxx.backend.domain.agent.agent_templates.js.map
