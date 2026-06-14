import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.action.anonymous');
open_hax.contract_runtime.action.anonymous.max_eval_depth = (64);
/**
 * Whitelisted pure functions callable from :action/fn bodies.
 */
open_hax.contract_runtime.action.anonymous.safe_fns = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Symbol(null,"true?","true?",-1600332395,null),new cljs.core.Symbol(null,"sort-by","sort-by",1317932224,null),new cljs.core.Symbol(null,"keys","keys",-1586012071,null),new cljs.core.Symbol(null,"first","first",996428481,null),new cljs.core.Symbol(null,"rest","rest",398835108,null),new cljs.core.Symbol(null,"seq","seq",-177272256,null),new cljs.core.Symbol("str","trim","str/trim",-1880231187,null),new cljs.core.Symbol(null,"odd?","odd?",-1458588199,null),new cljs.core.Symbol(null,"partition","partition",-1479695018,null),new cljs.core.Symbol(null,">=",">=",1016916022,null),new cljs.core.Symbol(null,"select-keys","select-keys",-708556589,null),new cljs.core.Symbol(null,"reverse","reverse",752076261,null),new cljs.core.Symbol(null,"merge","merge",-163787882,null),new cljs.core.Symbol(null,">",">",1085014381,null),new cljs.core.Symbol(null,"count","count",-514511684,null),new cljs.core.Symbol(null,"last","last",-1548700637,null),new cljs.core.Symbol(null,"int?","int?",1799729645,null),new cljs.core.Symbol(null,"vals","vals",-1886377036,null),new cljs.core.Symbol(null,"nil?","nil?",1612038930,null),new cljs.core.Symbol(null,"second","second",1195829517,null),new cljs.core.Symbol(null,"inc","inc",324505433,null),new cljs.core.Symbol(null,"/","/",-1371932971,null),new cljs.core.Symbol(null,"map?","map?",-1780568534,null),new cljs.core.Symbol(null,"vector?","vector?",-61367869,null),new cljs.core.Symbol("str","starts-with?","str/starts-with?",1014321448,null),new cljs.core.Symbol(null,"abs","abs",1394505050,null),new cljs.core.Symbol(null,"sort","sort",-1700969851,null),new cljs.core.Symbol(null,"false?","false?",-1522377573,null),new cljs.core.Symbol(null,"drop","drop",2005013138,null),new cljs.core.Symbol(null,"keep","keep",-492807003,null),new cljs.core.Symbol(null,"cons","cons",755448454,null),new cljs.core.Symbol("str","includes?","str/includes?",-2049398758,null),new cljs.core.Symbol(null,"identity","identity",-1007039734,null),new cljs.core.Symbol(null,"concat","concat",-467652465,null),new cljs.core.Symbol(null,"group-by","group-by",1261391725,null),new cljs.core.Symbol(null,"<=","<=",1244895369,null),new cljs.core.Symbol(null,"=","=",-1501502141,null),new cljs.core.Symbol(null,"every?","every?",2083724064,null),new cljs.core.Symbol(null,"comp","comp",-1462482139,null),new cljs.core.Symbol(null,"dissoc","dissoc",1039760994,null),new cljs.core.Symbol(null,"min","min",2085523049,null),new cljs.core.Symbol(null,"mapv","mapv",-241595241,null),new cljs.core.Symbol(null,"drop-last","drop-last",-1123611530,null),new cljs.core.Symbol(null,"fnil","fnil",-187395162,null),new cljs.core.Symbol(null,"next","next",1522830042,null),new cljs.core.Symbol(null,"+","+",-740910886,null),new cljs.core.Symbol(null,"name","name",-810760592,null),new cljs.core.Symbol(null,"zipmap","zipmap",-690049687,null),new cljs.core.Symbol(null,"coll?","coll?",-1874821441,null),new cljs.core.Symbol(null,"apply","apply",-1334050276,null),new cljs.core.Symbol(null,"keyword?","keyword?",1917797069,null),new cljs.core.Symbol(null,"frequencies","frequencies",1757430425,null),new cljs.core.Symbol(null,"max","max",1701898075,null),new cljs.core.Symbol(null,"empty?","empty?",76408555,null),new cljs.core.Symbol(null,"into","into",1489695498,null),new cljs.core.Symbol(null,"*","*",345799209,null),new cljs.core.Symbol(null,"pr-str","pr-str",-2066912145,null),new cljs.core.Symbol(null,"distinct","distinct",-148347594,null),new cljs.core.Symbol(null,"juxt","juxt",671085604,null),new cljs.core.Symbol(null,"some","some",-310548046,null),new cljs.core.Symbol(null,"interpose","interpose",-2078295140,null),new cljs.core.Symbol(null,"get-in","get-in",-1965644065,null),new cljs.core.Symbol(null,"assoc-in","assoc-in",-113585743,null),new cljs.core.Symbol(null,"zero?","zero?",325758897,null),new cljs.core.Symbol("str","lower-case","str/lower-case",1428157153,null),new cljs.core.Symbol("str","split","str/split",1040947342,null),new cljs.core.Symbol(null,"dec","dec",-766002333,null),new cljs.core.Symbol(null,"take-last","take-last",-41013151,null),new cljs.core.Symbol(null,"string?","string?",-1129175764,null),new cljs.core.Symbol(null,"map","map",-1282745308,null),new cljs.core.Symbol(null,"reduce","reduce",1358839360,null),new cljs.core.Symbol(null,"vector","vector",-751469611,null),new cljs.core.Symbol(null,"not=","not=",1466536204,null),new cljs.core.Symbol("str","upper-case","str/upper-case",1427171112,null),new cljs.core.Symbol(null,"constantly","constantly",-271143939,null),new cljs.core.Symbol(null,"get","get",-971253014,null),new cljs.core.Symbol(null,"str","str",-1564826950,null),new cljs.core.Symbol(null,"filterv","filterv",1977739179,null),new cljs.core.Symbol(null,"<","<",993667236,null),new cljs.core.Symbol(null,"namespace","namespace",1263021155,null),new cljs.core.Symbol(null,"keyword","keyword",-1843046022,null),new cljs.core.Symbol(null,"-","-",-471816912,null),new cljs.core.Symbol(null,"assoc","assoc",2071440380,null),new cljs.core.Symbol(null,"partition-all","partition-all",-1985005385,null),new cljs.core.Symbol(null,"some?","some?",234752293,null),new cljs.core.Symbol(null,"pos?","pos?",-244377722,null),new cljs.core.Symbol(null,"boolean?","boolean?",1790940868,null),new cljs.core.Symbol(null,"fn?","fn?",1820990818,null),new cljs.core.Symbol(null,"sequential?","sequential?",1102351463,null),new cljs.core.Symbol(null,"list","list",-1889078086,null),new cljs.core.Symbol(null,"partial","partial",1881673272,null),new cljs.core.Symbol(null,"contains?","contains?",-1676812576,null),new cljs.core.Symbol(null,"take","take",871646627,null),new cljs.core.Symbol("str","ends-with?","str/ends-with?",-346979887,null),new cljs.core.Symbol(null,"vec","vec",982683596,null),new cljs.core.Symbol(null,"nth","nth",1529209554,null),new cljs.core.Symbol(null,"subs","subs",1453849536,null),new cljs.core.Symbol(null,"number?","number?",-1747282210,null),new cljs.core.Symbol(null,"conj","conj",-1127293942,null),new cljs.core.Symbol(null,"update","update",-1608859373,null),new cljs.core.Symbol(null,"filter","filter",691993593,null),new cljs.core.Symbol(null,"flatten","flatten",-1441633353,null),new cljs.core.Symbol("str","replace","str/replace",854058908,null),new cljs.core.Symbol(null,"even?","even?",-1827825394,null),new cljs.core.Symbol(null,"neg?","neg?",-1902175577,null),new cljs.core.Symbol("str","join","str/join",881653206,null),new cljs.core.Symbol(null,"set","set",1945134081,null),new cljs.core.Symbol(null,"remove","remove",1509103113,null)],[cljs.core.true_QMARK_,cljs.core.sort_by,cljs.core.keys,cljs.core.first,cljs.core.rest,cljs.core.seq,clojure.string.trim,cljs.core.odd_QMARK_,cljs.core.partition,cljs.core._GT__EQ_,cljs.core.select_keys,cljs.core.reverse,cljs.core.merge,cljs.core._GT_,cljs.core.count,cljs.core.last,cljs.core.int_QMARK_,cljs.core.vals,cljs.core.nil_QMARK_,cljs.core.second,cljs.core.inc,cljs.core._SLASH_,cljs.core.map_QMARK_,cljs.core.vector_QMARK_,clojure.string.starts_with_QMARK_,cljs.core.abs,cljs.core.sort,cljs.core.false_QMARK_,cljs.core.drop,cljs.core.keep,cljs.core.cons,clojure.string.includes_QMARK_,cljs.core.identity,cljs.core.concat,cljs.core.group_by,cljs.core._LT__EQ_,cljs.core._EQ_,cljs.core.every_QMARK_,cljs.core.comp,cljs.core.dissoc,cljs.core.min,cljs.core.mapv,cljs.core.drop_last,cljs.core.fnil,cljs.core.next,cljs.core._PLUS_,cljs.core.name,cljs.core.zipmap,cljs.core.coll_QMARK_,cljs.core.apply,cljs.core.keyword_QMARK_,cljs.core.frequencies,cljs.core.max,cljs.core.empty_QMARK_,cljs.core.into,cljs.core._STAR_,cljs.core.pr_str,cljs.core.distinct,cljs.core.juxt,cljs.core.some,cljs.core.interpose,cljs.core.get_in,cljs.core.assoc_in,cljs.core.zero_QMARK_,clojure.string.lower_case,clojure.string.split,cljs.core.dec,cljs.core.take_last,cljs.core.string_QMARK_,cljs.core.map,cljs.core.reduce,cljs.core.vector,cljs.core.not_EQ_,clojure.string.upper_case,cljs.core.constantly,cljs.core.get,cljs.core.str,cljs.core.filterv,cljs.core._LT_,cljs.core.namespace,cljs.core.keyword,cljs.core._,cljs.core.assoc,cljs.core.partition_all,cljs.core.some_QMARK_,cljs.core.pos_QMARK_,cljs.core.boolean_QMARK_,cljs.core.fn_QMARK_,cljs.core.sequential_QMARK_,cljs.core.list,cljs.core.partial,cljs.core.contains_QMARK_,cljs.core.take,clojure.string.ends_with_QMARK_,cljs.core.vec,cljs.core.nth,cljs.core.subs,cljs.core.number_QMARK_,cljs.core.conj,cljs.core.update,cljs.core.filter,cljs.core.flatten,clojure.string.replace,cljs.core.even_QMARK_,cljs.core.neg_QMARK_,clojure.string.join,cljs.core.set,cljs.core.remove]);
/**
 * Extend env with one binding form bound to value. Supports plain symbols,
 * {:keys [...] :as sym} map destructuring, and positional vector destructuring.
 */
open_hax.contract_runtime.action.anonymous.bind_one = (function open_hax$contract_runtime$action$anonymous$bind_one(env,binding,value){
if((binding instanceof cljs.core.Symbol)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(env,binding,value);
} else {
if(cljs.core.map_QMARK_(binding)){
var env__$1 = (function (){var temp__5823__auto__ = new cljs.core.Keyword(null,"as","as",1148689641).cljs$core$IFn$_invoke$arity$1(binding);
if(cljs.core.truth_(temp__5823__auto__)){
var as_sym = temp__5823__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(env,as_sym,value);
} else {
return env;
}
})();
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,key_sym){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,cljs.core.symbol.cljs$core$IFn$_invoke$arity$1(cljs.core.name(key_sym)),cljs.core.get.cljs$core$IFn$_invoke$arity$2(value,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(key_sym)));
}),env__$1,new cljs.core.Keyword(null,"keys","keys",1068423698).cljs$core$IFn$_invoke$arity$2(binding,cljs.core.PersistentVector.EMPTY));
} else {
if(cljs.core.vector_QMARK_(binding)){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__22726){
var vec__22727 = p__22726;
var idx = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22727,(0),null);
var inner = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22727,(1),null);
var G__22730 = acc;
var G__22731 = inner;
var G__22732 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(value,idx,null);
return (open_hax.contract_runtime.action.anonymous.bind_one.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.bind_one.cljs$core$IFn$_invoke$arity$3(G__22730,G__22731,G__22732) : open_hax.contract_runtime.action.anonymous.bind_one.call(null,G__22730,G__22731,G__22732));
}),env,cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2(cljs.core.vector,binding));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unsupported binding form in :action/fn",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"binding","binding",539932593),binding], null));

}
}
}
});
open_hax.contract_runtime.action.anonymous.eval_body = (function open_hax$contract_runtime$action$anonymous$eval_body(forms,env,depth){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (_,form){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(form,env,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,form,env,depth));
}),null,forms);
});
/**
 * Build a callable closure from interpreted (fn [params] body) parts.
 */
open_hax.contract_runtime.action.anonymous.make_fn = (function open_hax$contract_runtime$action$anonymous$make_fn(params,body,env,depth){
return (function() { 
var G__22922__delegate = function (args){
return open_hax.contract_runtime.action.anonymous.eval_body(body,cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__22737){
var vec__22758 = p__22737;
var binding = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22758,(0),null);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22758,(1),null);
return open_hax.contract_runtime.action.anonymous.bind_one(acc,binding,value);
}),env,cljs.core.map.cljs$core$IFn$_invoke$arity$3(cljs.core.vector,params,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(args,cljs.core.repeat.cljs$core$IFn$_invoke$arity$1(null)))),depth);
};
var G__22922 = function (var_args){
var args = null;
if (arguments.length > 0) {
var G__22926__i = 0, G__22926__a = new Array(arguments.length -  0);
while (G__22926__i < G__22926__a.length) {G__22926__a[G__22926__i] = arguments[G__22926__i + 0]; ++G__22926__i;}
  args = new cljs.core.IndexedSeq(G__22926__a,0,null);
} 
return G__22922__delegate.call(this,args);};
G__22922.cljs$lang$maxFixedArity = 0;
G__22922.cljs$lang$applyTo = (function (arglist__22928){
var args = cljs.core.seq(arglist__22928);
return G__22922__delegate(args);
});
G__22922.cljs$core$IFn$_invoke$arity$variadic = G__22922__delegate;
return G__22922;
})()
;
});
open_hax.contract_runtime.action.anonymous.eval_let = (function open_hax$contract_runtime$action$anonymous$eval_let(bindings,body,env,depth){
if(((cljs.core.vector_QMARK_(bindings)) && (cljs.core.even_QMARK_(cljs.core.count(bindings))))){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("let in :action/fn requires an even binding vector",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"bindings","bindings",1271397192),bindings], null));
}

return open_hax.contract_runtime.action.anonymous.eval_body(body,cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__22764){
var vec__22765 = p__22764;
var binding = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22765,(0),null);
var value_form = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22765,(1),null);
return open_hax.contract_runtime.action.anonymous.bind_one(acc,binding,(open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(value_form,acc,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,value_form,acc,depth)));
}),env,cljs.core.partition.cljs$core$IFn$_invoke$arity$2((2),bindings)),depth);
});
open_hax.contract_runtime.action.anonymous.eval_call = (function open_hax$contract_runtime$action$anonymous$eval_call(head,tail,env,depth){
var f = (((head instanceof cljs.core.Symbol))?(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(env,head);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.action.anonymous.safe_fns,head);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unknown function in :action/fn",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sym","sym",-1444860305),head], null));
}
}
})():(open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(head,env,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,head,env,depth)));
if(cljs.core.fn_QMARK_(f)){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(f,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__22768_SHARP_){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(p1__22768_SHARP_,env,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,p1__22768_SHARP_,env,depth));
}),tail));
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Non-callable head in :action/fn",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"head","head",-771383919),head], null));
}
});
open_hax.contract_runtime.action.anonymous.eval_list = (function open_hax$contract_runtime$action$anonymous$eval_list(expr,env,depth){
var head = cljs.core.first(expr);
var tail = cljs.core.rest(expr);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"quote","quote",1377916282,null),head)){
return cljs.core.first(tail);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"fn","fn",465265323,null),head)){
return open_hax.contract_runtime.action.anonymous.make_fn(cljs.core.first(tail),cljs.core.rest(tail),env,depth);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"let","let",358118826,null),head)){
return open_hax.contract_runtime.action.anonymous.eval_let(cljs.core.first(tail),cljs.core.rest(tail),env,depth);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"do","do",1686842252,null),head)){
return open_hax.contract_runtime.action.anonymous.eval_body(tail,env,depth);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"if","if",1181717262,null),head)){
if(cljs.core.truth_((function (){var G__22792 = cljs.core.first(tail);
var G__22793 = env;
var G__22794 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22792,G__22793,G__22794) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22792,G__22793,G__22794));
})())){
var G__22795 = cljs.core.second(tail);
var G__22796 = env;
var G__22797 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22795,G__22796,G__22797) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22795,G__22796,G__22797));
} else {
var G__22798 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(cljs.core.vec(tail),(2),null);
var G__22799 = env;
var G__22800 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22798,G__22799,G__22800) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22798,G__22799,G__22800));
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"when","when",1064114221,null),head)){
if(cljs.core.truth_((function (){var G__22802 = cljs.core.first(tail);
var G__22803 = env;
var G__22804 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22802,G__22803,G__22804) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22802,G__22803,G__22804));
})())){
return open_hax.contract_runtime.action.anonymous.eval_body(cljs.core.rest(tail),env,depth);
} else {
return null;
}
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"and","and",668631710,null),head)){
return cljs.core.every_QMARK_((function (p1__22790_SHARP_){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(p1__22790_SHARP_,env,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,p1__22790_SHARP_,env,depth));
}),tail);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"or","or",1876275696,null),head)){
return cljs.core.some((function (p1__22791_SHARP_){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(p1__22791_SHARP_,env,depth) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,p1__22791_SHARP_,env,depth));
}),tail);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"not","not",1044554643,null),head)){
return cljs.core.not((function (){var G__22807 = cljs.core.first(tail);
var G__22808 = env;
var G__22809 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22807,G__22808,G__22809) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22807,G__22808,G__22809));
})());
} else {
if((head instanceof cljs.core.Keyword)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$3((function (){var G__22810 = cljs.core.first(tail);
var G__22811 = env;
var G__22812 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22810,G__22811,G__22812) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22810,G__22811,G__22812));
})(),head,(function (){var G__22815 = cljs.core.second(tail);
var G__22816 = env;
var G__22817 = depth;
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(G__22815,G__22816,G__22817) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,G__22815,G__22816,G__22817));
})());
} else {
return open_hax.contract_runtime.action.anonymous.eval_call(head,tail,env,depth);

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
open_hax.contract_runtime.action.anonymous.eval_form = (function open_hax$contract_runtime$action$anonymous$eval_form(expr,env,depth){
if((depth < (0))){
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(":action/fn expression too deeply nested",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"expr","expr",745722291),expr], null));
} else {
}

var depth__$1 = (depth - (1));
if((expr instanceof cljs.core.Symbol)){
if(cljs.core.contains_QMARK_(env,expr)){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(env,expr);
} else {
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.action.anonymous.safe_fns,expr);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("Unbound symbol in :action/fn",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sym","sym",-1444860305),expr,new cljs.core.Keyword(null,"available","available",-1470697127),cljs.core.keys(env)], null));
}
}
} else {
if(cljs.core.seq_QMARK_(expr)){
if(cljs.core.seq(expr)){
return open_hax.contract_runtime.action.anonymous.eval_list(expr,env,depth__$1);
} else {
return expr;
}
} else {
if(cljs.core.vector_QMARK_(expr)){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__22819_SHARP_){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(p1__22819_SHARP_,env,depth__$1) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,p1__22819_SHARP_,env,depth__$1));
}),expr);
} else {
if(cljs.core.map_QMARK_(expr)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p__22835){
var vec__22840 = p__22835;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22840,(0),null);
var v = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22840,(1),null);
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(k,env,depth__$1) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,k,env,depth__$1)),(open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(v,env,depth__$1) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,v,env,depth__$1))], null);
})),expr);
} else {
if(cljs.core.set_QMARK_(expr)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (p1__22820_SHARP_){
return (open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3 ? open_hax.contract_runtime.action.anonymous.eval_form.cljs$core$IFn$_invoke$arity$3(p1__22820_SHARP_,env,depth__$1) : open_hax.contract_runtime.action.anonymous.eval_form.call(null,p1__22820_SHARP_,env,depth__$1));
})),expr);
} else {
return expr;

}
}
}
}
}
});
/**
 * Return a callable (fn [ctx action] ...) for an :action/fn value, or nil.
 * Function values pass through; (fn [params] body) list forms are interpreted.
 */
open_hax.contract_runtime.action.anonymous.compile_action_fn = (function open_hax$contract_runtime$action$anonymous$compile_action_fn(form){
if(cljs.core.fn_QMARK_(form)){
return form;
} else {
if(((cljs.core.seq_QMARK_(form)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Symbol(null,"fn","fn",465265323,null),cljs.core.first(form))) && (cljs.core.vector_QMARK_(cljs.core.second(form))))))){
return open_hax.contract_runtime.action.anonymous.make_fn(cljs.core.second(form),cljs.core.drop.cljs$core$IFn$_invoke$arity$2((2),form),cljs.core.PersistentArrayMap.EMPTY,open_hax.contract_runtime.action.anonymous.max_eval_depth);
} else {
return null;

}
}
});

//# sourceMappingURL=open_hax.contract_runtime.action.anonymous.js.map
