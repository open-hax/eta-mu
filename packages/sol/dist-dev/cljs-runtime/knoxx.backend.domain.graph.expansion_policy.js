import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('knoxx.backend.domain.graph.expansion_policy');

/**
 * Bounds the parameters of graph expansion access shapes.
 * 
 * Implementations clamp caller-supplied parameters into the lawful
 * range for each shape and return a plain map of bounded values.
 * @interface
 */
knoxx.backend.domain.graph.expansion_policy.IGraphExpansionPolicy = function(){};

var knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_search_params$dyn_32090 = (function (policy,params){
var x__5519__auto__ = (((policy == null))?null:policy);
var m__5520__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_search_params[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5520__auto__.call(null,policy,params));
} else {
var m__5518__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_search_params["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5518__auto__.call(null,policy,params));
} else {
throw cljs.core.missing_protocol("IGraphExpansionPolicy.bounded-search-params",policy);
}
}
});
/**
 * Bound vector memory search params. Returns {:k :fetch-k}.
 */
knoxx.backend.domain.graph.expansion_policy.bounded_search_params = (function knoxx$backend$domain$graph$expansion_policy$bounded_search_params(policy,params){
if((((!((policy == null)))) && ((!((policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_search_params$arity$2 == null)))))){
return policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_search_params$arity$2(policy,params);
} else {
return knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_search_params$dyn_32090(policy,params);
}
});

var knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_expand_params$dyn_32092 = (function (policy,params){
var x__5519__auto__ = (((policy == null))?null:policy);
var m__5520__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_expand_params[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5520__auto__.call(null,policy,params));
} else {
var m__5518__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_expand_params["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5518__auto__.call(null,policy,params));
} else {
throw cljs.core.missing_protocol("IGraphExpansionPolicy.bounded-expand-params",policy);
}
}
});
/**
 * Bound graph traversal params. Returns {:limit :edge-limit :max-cost}.
 */
knoxx.backend.domain.graph.expansion_policy.bounded_expand_params = (function knoxx$backend$domain$graph$expansion_policy$bounded_expand_params(policy,params){
if((((!((policy == null)))) && ((!((policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_expand_params$arity$2 == null)))))){
return policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_expand_params$arity$2(policy,params);
} else {
return knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_expand_params$dyn_32092(policy,params);
}
});

var knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_preview_params$dyn_32094 = (function (policy,params){
var x__5519__auto__ = (((policy == null))?null:policy);
var m__5520__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_preview_params[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5520__auto__.call(null,policy,params));
} else {
var m__5518__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_preview_params["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5518__auto__.call(null,policy,params));
} else {
throw cljs.core.missing_protocol("IGraphExpansionPolicy.bounded-preview-params",policy);
}
}
});
/**
 * Bound read-only preview/row-fetch params. Returns {:limit}.
 */
knoxx.backend.domain.graph.expansion_policy.bounded_preview_params = (function knoxx$backend$domain$graph$expansion_policy$bounded_preview_params(policy,params){
if((((!((policy == null)))) && ((!((policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_preview_params$arity$2 == null)))))){
return policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_preview_params$arity$2(policy,params);
} else {
return knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_preview_params$dyn_32094(policy,params);
}
});

var knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_writeback_params$dyn_32096 = (function (policy,params){
var x__5519__auto__ = (((policy == null))?null:policy);
var m__5520__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_writeback_params[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5520__auto__.call(null,policy,params));
} else {
var m__5518__auto__ = (knoxx.backend.domain.graph.expansion_policy.bounded_writeback_params["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(policy,params) : m__5518__auto__.call(null,policy,params));
} else {
throw cljs.core.missing_protocol("IGraphExpansionPolicy.bounded-writeback-params",policy);
}
}
});
/**
 * Bound indexing/writeback fan-out params. Returns {:batch-size}.
 */
knoxx.backend.domain.graph.expansion_policy.bounded_writeback_params = (function knoxx$backend$domain$graph$expansion_policy$bounded_writeback_params(policy,params){
if((((!((policy == null)))) && ((!((policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_writeback_params$arity$2 == null)))))){
return policy.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_writeback_params$arity$2(policy,params);
} else {
return knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_writeback_params$dyn_32096(policy,params);
}
});

/**
 * Clamp n into [lo hi], falling back to fallback when n is not a number.
 */
knoxx.backend.domain.graph.expansion_policy.clamp = (function knoxx$backend$domain$graph$expansion_policy$clamp(n,lo,hi,fallback){
var v = ((typeof n === 'number')?n:fallback);
return cljs.core.max.cljs$core$IFn$_invoke$arity$2(lo,cljs.core.min.cljs$core$IFn$_invoke$arity$2(hi,v));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.domain.graph.expansion_policy.IGraphExpansionPolicy}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k31980,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__31997 = k31980;
switch (G__31997) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k31980,else__5472__auto__);

}
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__32001){
var vec__32002 = p__32001;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32002,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32002,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.graph.expansion-policy.DefaultGraphExpansionPolicy{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__31979){
var self__ = this;
var G__31979__$1 = this;
return (new cljs.core.RecordIter((0),G__31979__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-696585111 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this31982,other31983){
var self__ = this;
var this31982__$1 = this;
return (((!((other31983 == null)))) && ((((this31982__$1.constructor === other31983.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this31982__$1.__extmap,other31983.__extmap)))));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k31980){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k31980);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__31979){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__32016 = cljs.core.keyword_identical_QMARK_;
var expr__32017 = k__5478__auto__;
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__31979),null));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_search_params$arity$2 = (function (_,p__32022){
var self__ = this;
var map__32023 = p__32022;
var map__32023__$1 = cljs.core.__destructure_map(map__32023);
var k = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32023__$1,new cljs.core.Keyword(null,"k","k",-2146297393));
var ___$1 = this;
var k__$1 = knoxx.backend.domain.graph.expansion_policy.clamp(k,(1),(12),(7));
var fetch_k = cljs.core.max.cljs$core$IFn$_invoke$arity$2(k__$1,cljs.core.min.cljs$core$IFn$_invoke$arity$2((36),(k__$1 * (3))));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"k","k",-2146297393),k__$1,new cljs.core.Keyword(null,"fetch-k","fetch-k",1709948293),fetch_k], null);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_expand_params$arity$2 = (function (_,p__32024){
var self__ = this;
var map__32025 = p__32024;
var map__32025__$1 = cljs.core.__destructure_map(map__32025);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32025__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var edge_limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32025__$1,new cljs.core.Keyword(null,"edge-limit","edge-limit",4816756));
var ___$1 = this;
var limit__$1 = knoxx.backend.domain.graph.expansion_policy.clamp(limit,(1),(60),(15));
var edge_limit__$1 = (((!((edge_limit == null))))?edge_limit:null);
var max_cost = (cljs.core.truth_(edge_limit__$1)?(1.0 / cljs.core.max.cljs$core$IFn$_invoke$arity$2(0.01,edge_limit__$1)):null);
var G__32032 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"limit","limit",-1355822363),limit__$1,new cljs.core.Keyword(null,"edge-limit","edge-limit",4816756),edge_limit__$1], null);
if(cljs.core.truth_(max_cost)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32032,new cljs.core.Keyword(null,"max-cost","max-cost",-2074270100),max_cost);
} else {
return G__32032;
}
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_preview_params$arity$2 = (function (_,p__32035){
var self__ = this;
var map__32036 = p__32035;
var map__32036__$1 = cljs.core.__destructure_map(map__32036);
var limit = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32036__$1,new cljs.core.Keyword(null,"limit","limit",-1355822363));
var ___$1 = this;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"limit","limit",-1355822363),knoxx.backend.domain.graph.expansion_policy.clamp(limit,(1),(12),(12))], null);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$bounded_writeback_params$arity$2 = (function (_,p__32037){
var self__ = this;
var map__32039 = p__32037;
var map__32039__$1 = cljs.core.__destructure_map(map__32039);
var batch_size = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32039__$1,new cljs.core.Keyword(null,"batch-size","batch-size",1203640735));
var ___$1 = this;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"batch-size","batch-size",1203640735),knoxx.backend.domain.graph.expansion_policy.clamp(batch_size,(1),(16),(3))], null);
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__31979){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(G__31979,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.cljs$lang$type = true);

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.graph.expansion-policy/DefaultGraphExpansionPolicy",null,(1),null));
}));

(knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.graph.expansion-policy/DefaultGraphExpansionPolicy");
}));

/**
 * Positional factory function for knoxx.backend.domain.graph.expansion-policy/DefaultGraphExpansionPolicy.
 */
knoxx.backend.domain.graph.expansion_policy.__GT_DefaultGraphExpansionPolicy = (function knoxx$backend$domain$graph$expansion_policy$__GT_DefaultGraphExpansionPolicy(){
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.graph.expansion-policy/DefaultGraphExpansionPolicy, taking a map of keywords to field values.
 */
knoxx.backend.domain.graph.expansion_policy.map__GT_DefaultGraphExpansionPolicy = (function knoxx$backend$domain$graph$expansion_policy$map__GT_DefaultGraphExpansionPolicy(G__31988){
var extmap__5511__auto__ = (function (){var G__32068 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__31988);
if(cljs.core.record_QMARK_(G__31988)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__32068);
} else {
return G__32068;
}
})();
return (new knoxx.backend.domain.graph.expansion_policy.DefaultGraphExpansionPolicy(null,cljs.core.not_empty(extmap__5511__auto__),null));
});

/**
 * Construct the default graph expansion policy.
 * 
 * Matches the legacy in-handler bounds: search `k` in 1..12 (default 7)
 * with `fetch-k` up to 3x capped at 36; expand `limit` in 1..60
 * (default 15) with edge cost derived as 1/edge-limit; preview `limit`
 * in 1..12; writeback `batch-size` in 1..16 (default 3).
 */
knoxx.backend.domain.graph.expansion_policy.default_expansion_policy = (function knoxx$backend$domain$graph$expansion_policy$default_expansion_policy(){
return knoxx.backend.domain.graph.expansion_policy.__GT_DefaultGraphExpansionPolicy();
});
/**
 * Return true if x satisfies the graph expansion policy protocol.
 */
knoxx.backend.domain.graph.expansion_policy.expansion_policy_QMARK_ = (function knoxx$backend$domain$graph$expansion_policy$expansion_policy_QMARK_(x){
if((!((x == null)))){
if(((false) || ((cljs.core.PROTOCOL_SENTINEL === x.knoxx$backend$domain$graph$expansion_policy$IGraphExpansionPolicy$)))){
return true;
} else {
if((!x.cljs$lang$protocol_mask$partition$)){
return cljs.core.native_satisfies_QMARK_(knoxx.backend.domain.graph.expansion_policy.IGraphExpansionPolicy,x);
} else {
return false;
}
}
} else {
return cljs.core.native_satisfies_QMARK_(knoxx.backend.domain.graph.expansion_policy.IGraphExpansionPolicy,x);
}
});
/**
 * Normalize a policy id into a non-blank keyword, or nil.
 */
knoxx.backend.domain.graph.expansion_policy.normalize_policy_id = (function knoxx$backend$domain$graph$expansion_policy$normalize_policy_id(id){
if((id instanceof cljs.core.Keyword)){
return id;
} else {
if(((typeof id === 'string') && ((!(clojure.string.blank_QMARK_(id)))))){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(clojure.string.trim(id));
} else {
return null;

}
}
});

//# sourceMappingURL=knoxx.backend.domain.graph.expansion_policy.js.map
