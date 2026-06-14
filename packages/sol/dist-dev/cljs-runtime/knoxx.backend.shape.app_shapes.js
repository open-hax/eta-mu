import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.shape.app_shapes');
knoxx.backend.shape.app_shapes.media_extension_pattern = /.*\.(?:png|jpg|jpeg|gif|webp|mp4|webm|mp3|wav|ogg|m4a|flac|pdf)(?:\?.*)?$/;
knoxx.backend.shape.app_shapes.body_value = (function knoxx$backend$shape$app_shapes$body_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___36197 = arguments.length;
var i__5898__auto___36198 = (0);
while(true){
if((i__5898__auto___36198 < len__5897__auto___36197)){
args__5903__auto__.push((arguments[i__5898__auto___36198]));

var G__36200 = (i__5898__auto___36198 + (1));
i__5898__auto___36198 = G__36200;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic = (function (body,names){
return cljs.core.some((function (field_name){
if(cljs.core.map_QMARK_(body)){
var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(body,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(field_name));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(body,field_name);
}
} else {
return (body[field_name]);
}
}),names);
}));

(knoxx.backend.shape.app_shapes.body_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.shape.app_shapes.body_value.cljs$lang$applyTo = (function (seq36100){
var G__36101 = cljs.core.first(seq36100);
var seq36100__$1 = cljs.core.next(seq36100);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__36101,seq36100__$1);
}));

knoxx.backend.shape.app_shapes.maybe_cljs = (function knoxx$backend$shape$app_shapes$maybe_cljs(value){
if((value == null)){
return null;
} else {
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(cljs.core.vector_QMARK_(value)){
return value;
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
}
});
knoxx.backend.shape.app_shapes.maybe_cljs_map = (function knoxx$backend$shape$app_shapes$maybe_cljs_map(value){
var temp__5825__auto__ = knoxx.backend.shape.app_shapes.maybe_cljs(value);
if(cljs.core.truth_(temp__5825__auto__)){
var value__$1 = temp__5825__auto__;
if(cljs.core.map_QMARK_(value__$1)){
return value__$1;
} else {
return null;
}
} else {
return null;
}
});
/**
 * Extract media URLs from text content.
 */
knoxx.backend.shape.app_shapes.extract_media_urls = (function knoxx$backend$shape$app_shapes$extract_media_urls(text){
if(typeof text === 'string'){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (token){
var lower = clojure.string.lower_case(token);
if(cljs.core.truth_((function (){var or__5162__auto__ = cljs.core.re_matches(knoxx.backend.shape.app_shapes.media_extension_pattern,lower);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.some((function (p1__36106_SHARP_){
return clojure.string.includes_QMARK_(lower,p1__36106_SHARP_);
}),new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [".png",".jpg",".jpeg",".gif",".webp",".mp4",".webm",".mp3",".wav",".ogg",".m4a",".flac",".pdf"], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return clojure.string.includes_QMARK_(token,"cdn.discordapp.com");
}
}
})())){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"url","url",276297046),token,new cljs.core.Keyword(null,"type","type",1174270348),(cljs.core.truth_(cljs.core.some((function (p1__36107_SHARP_){
return clojure.string.includes_QMARK_(lower,p1__36107_SHARP_);
}),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [".png",".jpg",".jpeg",".gif",".webp"], null)))?"image":(cljs.core.truth_(cljs.core.some((function (p1__36108_SHARP_){
return clojure.string.includes_QMARK_(lower,p1__36108_SHARP_);
}),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [".mp4",".webm",".mov"], null)))?"video":(cljs.core.truth_(cljs.core.some((function (p1__36109_SHARP_){
return clojure.string.includes_QMARK_(lower,p1__36109_SHARP_);
}),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [".mp3",".wav",".ogg",".m4a",".flac"], null)))?"audio":(cljs.core.truth_(cljs.core.some((function (p1__36110_SHARP_){
return clojure.string.includes_QMARK_(lower,p1__36110_SHARP_);
}),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [".pdf"], null)))?"document":"image"
))))], null);
} else {
return null;
}
}),clojure.string.split.cljs$core$IFn$_invoke$arity$2(text,/\s+/)));
} else {
return null;
}
});
knoxx.backend.shape.app_shapes.normalize_tool_policy = (function knoxx$backend$shape$app_shapes$normalize_tool_policy(policy){
var tool_id = (function (){var G__36116 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"toolId","toolId",-1935596543).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"tool_id","tool_id",1550520216).cljs$core$IFn$_invoke$arity$1(policy);
}
}
})();
var G__36116__$1 = (((G__36116 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36116)));
var G__36116__$2 = (((G__36116__$1 == null))?null:clojure.string.trim(G__36116__$1));
if((G__36116__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__36116__$2);
}
})();
var effect = (function (){var G__36117 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "allow";
}
})();
var G__36117__$1 = (((G__36117 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36117)));
var G__36117__$2 = (((G__36117__$1 == null))?null:clojure.string.trim(G__36117__$1));
var G__36117__$3 = (((G__36117__$2 == null))?null:clojure.string.lower_case(G__36117__$2));
if((G__36117__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__36117__$3);
}
})();
if(cljs.core.truth_(tool_id)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),(cljs.core.truth_((function (){var fexpr__36119 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["allow",null,"deny",null], null), null);
return (fexpr__36119.cljs$core$IFn$_invoke$arity$1 ? fexpr__36119.cljs$core$IFn$_invoke$arity$1(effect) : fexpr__36119.call(null,effect));
})())?effect:"allow")], null);
} else {
return null;
}
});
knoxx.backend.shape.app_shapes.normalize_tool_policies = (function knoxx$backend$shape$app_shapes$normalize_tool_policies(policies){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.app_shapes.normalize_tool_policy,(function (){var or__5162__auto__ = policies;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
});
knoxx.backend.shape.app_shapes.memory_hydration_spec = (function knoxx$backend$shape$app_shapes$memory_hydration_spec(spec){
var or__5162__auto__ = new cljs.core.Keyword(null,"memory_hydration","memory_hydration",-1458677455).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"memoryHydration","memoryHydration",-226352759).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memory","memory",-1449401430),new cljs.core.Keyword(null,"passive-hydration","passive-hydration",-1337823895)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memory","memory",-1449401430),new cljs.core.Keyword(null,"passiveHydration","passiveHydration",-884994907)], null));
}
}
}
}
});
knoxx.backend.shape.app_shapes.context_policy_spec = (function knoxx$backend$shape$app_shapes$context_policy_spec(spec){
var or__5162__auto__ = new cljs.core.Keyword(null,"context_policy","context_policy",1230169154).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(spec);
}
}
}
});
/**
 * Extract a normalized string value from a spec map given keyword alternatives.
 */
knoxx.backend.shape.app_shapes.spec_value = (function knoxx$backend$shape$app_shapes$spec_value(var_args){
var args__5903__auto__ = [];
var len__5897__auto___36211 = arguments.length;
var i__5898__auto___36212 = (0);
while(true){
if((i__5898__auto___36212 < len__5897__auto___36211)){
args__5903__auto__.push((arguments[i__5898__auto___36212]));

var G__36213 = (i__5898__auto___36212 + (1));
i__5898__auto___36212 = G__36213;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic = (function (spec,keys){
var G__36126 = cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(spec,k);
}),keys);
var G__36126__$1 = (((G__36126 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36126)));
var G__36126__$2 = (((G__36126__$1 == null))?null:clojure.string.trim(G__36126__$1));
if((G__36126__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__36126__$2);
}
}));

(knoxx.backend.shape.app_shapes.spec_value.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.shape.app_shapes.spec_value.cljs$lang$applyTo = (function (seq36122){
var G__36123 = cljs.core.first(seq36122);
var seq36122__$1 = cljs.core.next(seq36122);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__36123,seq36122__$1);
}));

/**
 * Extract a normalized string value without trimming, for prompt fields.
 */
knoxx.backend.shape.app_shapes.spec_value_raw = (function knoxx$backend$shape$app_shapes$spec_value_raw(var_args){
var args__5903__auto__ = [];
var len__5897__auto___36216 = arguments.length;
var i__5898__auto___36218 = (0);
while(true){
if((i__5898__auto___36218 < len__5897__auto___36216)){
args__5903__auto__.push((arguments[i__5898__auto___36218]));

var G__36219 = (i__5898__auto___36218 + (1));
i__5898__auto___36218 = G__36219;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.shape.app_shapes.spec_value_raw.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.shape.app_shapes.spec_value_raw.cljs$core$IFn$_invoke$arity$variadic = (function (spec,keys){
var G__36139 = cljs.core.some((function (k){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(spec,k);
}),keys);
var G__36139__$1 = (((G__36139 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36139)));
if((G__36139__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__36139__$1);
}
}));

(knoxx.backend.shape.app_shapes.spec_value_raw.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.shape.app_shapes.spec_value_raw.cljs$lang$applyTo = (function (seq36132){
var G__36133 = cljs.core.first(seq36132);
var seq36132__$1 = cljs.core.next(seq36132);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__36133,seq36132__$1);
}));

knoxx.backend.shape.app_shapes.normalize_agent_spec = (function knoxx$backend$shape$app_shapes$normalize_agent_spec(value){
var spec = knoxx.backend.shape.app_shapes.maybe_cljs_map(value);
var contract_id = knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"contract_id","contract_id",-1829507193),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"agent_id","agent_id",-1820880197),new cljs.core.Keyword(null,"agent-id","agent-id",1570348870),new cljs.core.Keyword(null,"agentId","agentId",2025355078)], 0));
var actor_id = knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actorId","actorId",989542370)], 0));
var role = knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"role_slug","role_slug",219656703),new cljs.core.Keyword(null,"role-slug","role-slug",-617706766)], 0));
var system_prompt = knoxx.backend.shape.app_shapes.spec_value_raw.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.Keyword(null,"systemPrompt","systemPrompt",-590399886)], 0));
var task_prompt = knoxx.backend.shape.app_shapes.spec_value_raw.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"task_prompt","task_prompt",1276696196),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.Keyword(null,"taskPrompt","taskPrompt",944614720)], 0));
var model = knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"model","model",331153215)], 0));
var thinking_level = knoxx.backend.shape.app_shapes.spec_value.cljs$core$IFn$_invoke$arity$variadic(spec,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"thinking_level","thinking_level",165057069),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"thinkingLevel","thinkingLevel",1530898429),new cljs.core.Keyword(null,"reasoning_effort","reasoning_effort",-375529027),new cljs.core.Keyword(null,"reasoning-effort","reasoning-effort",-1891634506),new cljs.core.Keyword(null,"reasoningEffort","reasoningEffort",1501429170)], 0));
var tool_policies = knoxx.backend.shape.app_shapes.normalize_tool_policies((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_policies","tool_policies",24080177).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})());
var resource_policies = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"resource_policies","resource_policies",-1190579829).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364).cljs$core$IFn$_invoke$arity$1(spec);
}
}
})();
var sources = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"runtime_sources","runtime_sources",1950634872).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"runtime-sources","runtime-sources",1613079145).cljs$core$IFn$_invoke$arity$1(spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"runtimeSources","runtimeSources",919462928).cljs$core$IFn$_invoke$arity$1(spec);
}
}
}
})();
var memory_hydration = knoxx.backend.shape.app_shapes.memory_hydration_spec(spec);
var context_policy = knoxx.backend.shape.app_shapes.context_policy_spec(spec);
if(cljs.core.truth_((function (){var or__5162__auto__ = contract_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = actor_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = role;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = system_prompt;
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = task_prompt;
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
var or__5162__auto____$5 = model;
if(cljs.core.truth_(or__5162__auto____$5)){
return or__5162__auto____$5;
} else {
var or__5162__auto____$6 = thinking_level;
if(cljs.core.truth_(or__5162__auto____$6)){
return or__5162__auto____$6;
} else {
var or__5162__auto____$7 = cljs.core.seq(tool_policies);
if(or__5162__auto____$7){
return or__5162__auto____$7;
} else {
var or__5162__auto____$8 = resource_policies;
if(cljs.core.truth_(or__5162__auto____$8)){
return or__5162__auto____$8;
} else {
var or__5162__auto____$9 = cljs.core.seq(sources);
if(or__5162__auto____$9){
return or__5162__auto____$9;
} else {
var or__5162__auto____$10 = memory_hydration;
if(cljs.core.truth_(or__5162__auto____$10)){
return or__5162__auto____$10;
} else {
return context_policy;
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
})())){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.Keyword(null,"model","model",331153215)],[role,memory_hydration,task_prompt,sources,context_policy,actor_id,thinking_level,contract_id,system_prompt,resource_policies,tool_policies,model]);
} else {
return null;
}
});
knoxx.backend.shape.app_shapes.normalize_content_part_type = (function knoxx$backend$shape$app_shapes$normalize_content_part_type(value){
var G__36159 = (function (){var G__36160 = value;
var G__36160__$1 = (((G__36160 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36160)));
var G__36160__$2 = (((G__36160__$1 == null))?null:clojure.string.trim(G__36160__$1));
if((G__36160__$2 == null)){
return null;
} else {
return clojure.string.lower_case(G__36160__$2);
}
})();
switch (G__36159) {
case "text":
case "input_text":
case "output_text":
case "refusal":
return new cljs.core.Keyword(null,"text","text",-1790561697);

break;
case "image":
case "image_url":
case "input_image":
case "output_image":
return new cljs.core.Keyword(null,"image","image",-58725096);

break;
case "audio":
case "audio_url":
case "input_audio":
case "output_audio":
return new cljs.core.Keyword(null,"audio","audio",1819127321);

break;
case "video":
case "video_url":
case "input_video":
case "output_video":
return new cljs.core.Keyword(null,"video","video",156888130);

break;
case "document":
case "file":
case "input_file":
case "output_file":
return new cljs.core.Keyword(null,"document","document",-1329188687);

break;
default:
return null;

}
});
knoxx.backend.shape.app_shapes.normalize_content_part = (function knoxx$backend$shape$app_shapes$normalize_content_part(part){
if(typeof part === 'string'){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"text","text",-1790561697),part], null);
} else {
if(cljs.core.map_QMARK_(part)){
var type = knoxx.backend.shape.app_shapes.normalize_content_part_type((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"partType","partType",-2014749732).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"part-type","part-type",631022337).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"part_type","part_type",129170086).cljs$core$IFn$_invoke$arity$1(part);
}
}
}
})());
var text = (function (){var G__36167 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"refusal","refusal",-44985842).cljs$core$IFn$_invoke$arity$1(part);
}
})();
if((G__36167 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36167));
}
})();
var url = (function (){var G__36168 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"file_url","file_url",314758761).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"file-url","file-url",-863738963).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"fileUrl","fileUrl",1401098371).cljs$core$IFn$_invoke$arity$1(part);
}
}
}
})();
if((G__36168 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36168));
}
})();
var data = (function (){var G__36174 = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part);
if((G__36174 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36174));
}
})();
var mime_type = (function (){var G__36175 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"mime_type","mime_type",1613436611).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"mediaType","mediaType",272273903).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword(null,"media_type","media_type",-696536767).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"media-type","media-type",-764436129).cljs$core$IFn$_invoke$arity$1(part);
}
}
}
}
}
})();
if((G__36175 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36175));
}
})();
var filename = (function (){var G__36176 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(part);
if((G__36176 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36176));
}
})();
var size = (function (){var value = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"bytes","bytes",1175866680).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"byteSize","byteSize",737211841).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"byte_size","byte_size",626949575).cljs$core$IFn$_invoke$arity$1(part);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return new cljs.core.Keyword(null,"byte-size","byte-size",452288254).cljs$core$IFn$_invoke$arity$1(part);
}
}
}
}
})();
if(typeof value === 'number'){
return value;
} else {
return null;
}
})();
if(cljs.core.truth_((function (){var or__5162__auto__ = type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = text;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = url;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = data;
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return filename;
}
}
}
}
})())){
var G__36177 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"type","type",1174270348),(function (){var or__5162__auto__ = type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"text","text",-1790561697);
}
})()], null);
var G__36177__$1 = ((((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = type;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"text","text",-1790561697);
}
})(),new cljs.core.Keyword(null,"text","text",-1790561697))) && ((!((text == null))))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177,new cljs.core.Keyword(null,"text","text",-1790561697),text):G__36177);
var G__36177__$2 = (cljs.core.truth_(url)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177__$1,new cljs.core.Keyword(null,"url","url",276297046),url):G__36177__$1);
var G__36177__$3 = (cljs.core.truth_(data)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177__$2,new cljs.core.Keyword(null,"data","data",-232669377),data):G__36177__$2);
var G__36177__$4 = (cljs.core.truth_(mime_type)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177__$3,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type):G__36177__$3);
var G__36177__$5 = (cljs.core.truth_(filename)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177__$4,new cljs.core.Keyword(null,"filename","filename",-1428840783),filename):G__36177__$4);
if(cljs.core.truth_(size)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__36177__$5,new cljs.core.Keyword(null,"size","size",1098693007),size);
} else {
return G__36177__$5;
}
} else {
return null;
}
} else {
return null;

}
}
});
knoxx.backend.shape.app_shapes.normalize_content_parts = (function knoxx$backend$shape$app_shapes$normalize_content_parts(value){
var parts = knoxx.backend.shape.app_shapes.maybe_cljs(value);
if(cljs.core.sequential_QMARK_(parts)){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.app_shapes.normalize_content_part,parts));
} else {
if(cljs.core.map_QMARK_(parts)){
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.app_shapes.normalize_content_part,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [parts], null)));
} else {
return cljs.core.PersistentVector.EMPTY;

}
}
});
knoxx.backend.shape.app_shapes.normalize_chat_body = (function knoxx$backend$shape$app_shapes$normalize_chat_body(body){
var message = (function (){var or__5162__auto__ = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["message"], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var raw_content_parts = knoxx.backend.shape.app_shapes.normalize_content_parts(knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["contentParts","content_parts","content-parts"], 0)));
var content_parts = raw_content_parts;
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"template-context","template-context",-946500342),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"content-parts","content-parts",684529019),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"model","model",331153215)],[knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["conversationId","conversation_id","conversation-id"], 0)),knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["sessionId","session_id","session-id"], 0)),knoxx.backend.shape.app_shapes.maybe_cljs_map(knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["authContext","auth_context","auth-context"], 0))),knoxx.backend.shape.app_shapes.maybe_cljs_map(knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["templateContext","template_context","template-context"], 0))),(function (){var or__5162__auto__ = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["mode"], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "direct";
}
})(),knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["thinkingLevel","thinking_level","thinking-level","reasoningEffort","reasoning_effort","reasoning-effort"], 0)),knoxx.backend.shape.app_shapes.normalize_agent_spec(knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["agentSpec","agent_spec","agent-spec"], 0))),content_parts,knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["runId","run_id","run-id"], 0)),message,knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["model"], 0))]);
});
knoxx.backend.shape.app_shapes.normalize_control_body = (function knoxx$backend$shape$app_shapes$normalize_control_body(body){
var metadata = (function (){var or__5162__auto__ = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["metadata"], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["lineage"], 0));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
})();
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"message","message",-406056002),(function (){var or__5162__auto__ = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["message"], 0));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["conversationId","conversation_id","conversation-id"], 0)),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["sessionId","session_id","session-id"], 0)),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["runId","run_id","run-id"], 0)),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),(function (){var G__36191 = knoxx.backend.shape.app_shapes.body_value.cljs$core$IFn$_invoke$arity$variadic(body,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["actorId","actor_id","actor-id"], 0));
var G__36191__$1 = (((G__36191 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__36191)));
var G__36191__$2 = (((G__36191__$1 == null))?null:clojure.string.trim(G__36191__$1));
if((G__36191__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__36191__$2);
}
})(),new cljs.core.Keyword(null,"metadata","metadata",1799301597),(function (){var or__5162__auto__ = knoxx.backend.shape.app_shapes.maybe_cljs_map(metadata);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
});
/**
 * Register a Fastify route. handler-or-opts may be either:
 * - a plain function  → classic-mode (no preHandlers)
 * - a JS options obj  → preHandler-mode from defroute macro;
 *   its keys are merged into the base route options so that
 *   @fastify/websocket receives a proper :handler fn, not a
 *   nested object (which causes `handler.call is not a function`).
 */
knoxx.backend.shape.app_shapes.route_BANG_ = (function knoxx$backend$shape$app_shapes$route_BANG_(app,method,url,handler_or_opts){
if(cljs.core.fn_QMARK_(handler_or_opts)){
return app.route(({"method": method, "url": url, "handler": handler_or_opts}));
} else {
return app.route(Object.assign(({"method": method, "url": url}),handler_or_opts));
}
});

//# sourceMappingURL=knoxx.backend.shape.app_shapes.js.map
