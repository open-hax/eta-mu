import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.stores.message_source.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.agent.message.js";
goog.provide('knoxx.backend.infra.stores.openplanner_message_source');
knoxx.backend.infra.stores.openplanner_message_source.fetch_openplanner_messages_BANG_ = (async function knoxx$backend$infra$stores$openplanner_message_source$fetch_openplanner_messages_BANG_(config,conversation_id){
var client = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"openplanner-client","openplanner-client",-1926799348).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
}
})());
if(((clojure.string.blank_QMARK_(conversation_id)) || (cljs.core.not(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))))){
return cljs.core.PersistentVector.EMPTY;
} else {
var response = (await knoxx.backend.infra.clients.openplanner.session_BANG_(client,conversation_id,null));
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.message.planner_row__GT_stored_session_message,(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(response);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {knoxx.backend.infra.stores.message_source.IMessageSource}
 * @implements {cljs.core.ICounted}
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
knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource = (function (config,__meta,__extmap,__hash){
this.config = config;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k27689,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__27699 = k27689;
var G__27699__$1 = (((G__27699 instanceof cljs.core.Keyword))?G__27699.fqn:null);
switch (G__27699__$1) {
case "config":
return self__.config;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k27689,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__27704){
var vec__27705 = p__27704;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27705,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27705,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.openplanner-message-source.OpenPlannerMessageSource{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__27688){
var self__ = this;
var G__27688__$1 = this;
return (new cljs.core.RecordIter((0),G__27688__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(self__.config,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (31121962 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this27690,other27691){
var self__ = this;
var this27690__$1 = this;
return (((!((other27691 == null)))) && ((((this27690__$1.constructor === other27691.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27690__$1.config,other27691.config)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27690__$1.__extmap,other27691.__extmap)))))));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.openplanner_message_source.fetch_openplanner_messages_BANG_(self__.config,conversation_id);
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(self__.config,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k27689){
var self__ = this;
var this__5476__auto____$1 = this;
var G__27720 = k27689;
var G__27720__$1 = (((G__27720 instanceof cljs.core.Keyword))?G__27720.fqn:null);
switch (G__27720__$1) {
case "config":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k27689);

}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__27688){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__27721 = cljs.core.keyword_identical_QMARK_;
var expr__27722 = k__5478__auto__;
if(cljs.core.truth_((pred__27721.cljs$core$IFn$_invoke$arity$2 ? pred__27721.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__27722) : pred__27721.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__27722)))){
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(G__27688,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(self__.config,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__27688),null));
}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__27688){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(self__.config,G__27688,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null)], null);
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.cljs$lang$type = true);

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.openplanner-message-source/OpenPlannerMessageSource",null,(1),null));
}));

(knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.openplanner-message-source/OpenPlannerMessageSource");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.openplanner-message-source/OpenPlannerMessageSource.
 */
knoxx.backend.infra.stores.openplanner_message_source.__GT_OpenPlannerMessageSource = (function knoxx$backend$infra$stores$openplanner_message_source$__GT_OpenPlannerMessageSource(config){
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(config,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.openplanner-message-source/OpenPlannerMessageSource, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.openplanner_message_source.map__GT_OpenPlannerMessageSource = (function knoxx$backend$infra$stores$openplanner_message_source$map__GT_OpenPlannerMessageSource(G__27692){
var extmap__5511__auto__ = (function (){var G__27733 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__27692,new cljs.core.Keyword(null,"config","config",994861415));
if(cljs.core.record_QMARK_(G__27692)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__27733);
} else {
return G__27733;
}
})();
return (new knoxx.backend.infra.stores.openplanner_message_source.OpenPlannerMessageSource(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__27692),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.openplanner_message_source.js.map
