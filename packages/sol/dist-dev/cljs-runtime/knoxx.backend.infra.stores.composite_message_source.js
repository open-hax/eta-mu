import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.stores.message_source.js";
import "./knoxx.backend.infra.agent.message.js";
goog.provide('knoxx.backend.infra.stores.composite_message_source');
knoxx.backend.infra.stores.composite_message_source.fetch_composite_messages_BANG_ = (async function knoxx$backend$infra$stores$composite_message_source$fetch_composite_messages_BANG_(primary,secondary,conversation_id){
var vec__22008 = (await Promise.all([knoxx.backend.infra.stores.message_source.fetch_messages_BANG_(primary,conversation_id),knoxx.backend.infra.stores.message_source.fetch_messages_BANG_(secondary,conversation_id)]));
var primary_messages = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22008,(0),null);
var secondary_messages = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22008,(1),null);
return knoxx.backend.infra.agent.message.merge_restored_session_messages(cljs.core.vec((await (async function (){var or__5162__auto__ = primary_messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())),cljs.core.vec((await (async function (){var or__5162__auto__ = secondary_messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
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
knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource = (function (primary,secondary,__meta,__extmap,__hash){
this.primary = primary;
this.secondary = secondary;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k22018,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__22028 = k22018;
var G__22028__$1 = (((G__22028 instanceof cljs.core.Keyword))?G__22028.fqn:null);
switch (G__22028__$1) {
case "primary":
return self__.primary;

break;
case "secondary":
return self__.secondary;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k22018,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__22031){
var vec__22032 = p__22031;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22032,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22032,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.composite-message-source.CompositeMessageSource{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"primary","primary",817773892),self__.primary],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"secondary","secondary",-669381460),self__.secondary],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__22017){
var self__ = this;
var G__22017__$1 = this;
return (new cljs.core.RecordIter((0),G__22017__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"primary","primary",817773892),new cljs.core.Keyword(null,"secondary","secondary",-669381460)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(self__.primary,self__.secondary,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1255691402 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this22019,other22020){
var self__ = this;
var this22019__$1 = this;
return (((!((other22020 == null)))) && ((((this22019__$1.constructor === other22020.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22019__$1.primary,other22020.primary)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22019__$1.secondary,other22020.secondary)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22019__$1.__extmap,other22020.__extmap)))))))));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_message_source.fetch_composite_messages_BANG_(self__.primary,self__.secondary,conversation_id);
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"primary","primary",817773892),null,new cljs.core.Keyword(null,"secondary","secondary",-669381460),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(self__.primary,self__.secondary,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k22018){
var self__ = this;
var this__5476__auto____$1 = this;
var G__22053 = k22018;
var G__22053__$1 = (((G__22053 instanceof cljs.core.Keyword))?G__22053.fqn:null);
switch (G__22053__$1) {
case "primary":
case "secondary":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k22018);

}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__22017){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__22058 = cljs.core.keyword_identical_QMARK_;
var expr__22059 = k__5478__auto__;
if(cljs.core.truth_((pred__22058.cljs$core$IFn$_invoke$arity$2 ? pred__22058.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"primary","primary",817773892),expr__22059) : pred__22058.call(null,new cljs.core.Keyword(null,"primary","primary",817773892),expr__22059)))){
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(G__22017,self__.secondary,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__22058.cljs$core$IFn$_invoke$arity$2 ? pred__22058.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"secondary","secondary",-669381460),expr__22059) : pred__22058.call(null,new cljs.core.Keyword(null,"secondary","secondary",-669381460),expr__22059)))){
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(self__.primary,G__22017,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(self__.primary,self__.secondary,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__22017),null));
}
}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"primary","primary",817773892),self__.primary,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"secondary","secondary",-669381460),self__.secondary,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__22017){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(self__.primary,self__.secondary,G__22017,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"primary","primary",-1836661877,null),new cljs.core.Symbol(null,"secondary","secondary",971150067,null)], null);
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.cljs$lang$type = true);

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.composite-message-source/CompositeMessageSource",null,(1),null));
}));

(knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.composite-message-source/CompositeMessageSource");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.composite-message-source/CompositeMessageSource.
 */
knoxx.backend.infra.stores.composite_message_source.__GT_CompositeMessageSource = (function knoxx$backend$infra$stores$composite_message_source$__GT_CompositeMessageSource(primary,secondary){
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(primary,secondary,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.composite-message-source/CompositeMessageSource, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.composite_message_source.map__GT_CompositeMessageSource = (function knoxx$backend$infra$stores$composite_message_source$map__GT_CompositeMessageSource(G__22023){
var extmap__5511__auto__ = (function (){var G__22072 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__22023,new cljs.core.Keyword(null,"primary","primary",817773892),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"secondary","secondary",-669381460)], 0));
if(cljs.core.record_QMARK_(G__22023)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__22072);
} else {
return G__22072;
}
})();
return (new knoxx.backend.infra.stores.composite_message_source.CompositeMessageSource(new cljs.core.Keyword(null,"primary","primary",817773892).cljs$core$IFn$_invoke$arity$1(G__22023),new cljs.core.Keyword(null,"secondary","secondary",-669381460).cljs$core$IFn$_invoke$arity$1(G__22023),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.composite_message_source.js.map
