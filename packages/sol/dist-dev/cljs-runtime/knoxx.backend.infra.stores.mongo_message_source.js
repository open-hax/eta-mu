import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.stores.message_source.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
goog.provide('knoxx.backend.infra.stores.mongo_message_source');
knoxx.backend.infra.stores.mongo_message_source.messages_from_session_BANG_ = (async function knoxx$backend$infra$stores$mongo_message_source$messages_from_session_BANG_(session_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))))){
return cljs.core.PersistentVector.EMPTY;
} else {
var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
return cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
}
});
knoxx.backend.infra.stores.mongo_message_source.fetch_session_messages_BANG_ = (async function knoxx$backend$infra$stores$mongo_message_source$fetch_session_messages_BANG_(preferred_session_id,conversation_id){
if(cljs.core.truth_(preferred_session_id)){
return (await knoxx.backend.infra.stores.mongo_message_source.messages_from_session_BANG_(preferred_session_id));
} else {
if(clojure.string.blank_QMARK_(conversation_id)){
return cljs.core.PersistentVector.EMPTY;
} else {
var session_id = (await knoxx.backend.infra.stores.mongo_session_store.get_conversation_active_session.cljs$core$IFn$_invoke$arity$1(conversation_id));
return (await knoxx.backend.infra.stores.mongo_message_source.messages_from_session_BANG_(session_id));

}
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
knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource = (function (preferred_session_id,__meta,__extmap,__hash){
this.preferred_session_id = preferred_session_id;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k27726,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__27743 = k27726;
var G__27743__$1 = (((G__27743 instanceof cljs.core.Keyword))?G__27743.fqn:null);
switch (G__27743__$1) {
case "preferred-session-id":
return self__.preferred_session_id;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k27726,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__27750){
var vec__27751 = p__27750;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27751,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27751,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.mongo-message-source.MongoMessageSource{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),self__.preferred_session_id],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__27725){
var self__ = this;
var G__27725__$1 = this;
return (new cljs.core.RecordIter((0),G__27725__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(self__.preferred_session_id,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-815493472 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this27727,other27728){
var self__ = this;
var this27727__$1 = this;
return (((!((other27728 == null)))) && ((((this27727__$1.constructor === other27728.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27727__$1.preferred_session_id,other27728.preferred_session_id)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this27727__$1.__extmap,other27728.__extmap)))))));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_message_source.fetch_session_messages_BANG_(self__.preferred_session_id,conversation_id);
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(self__.preferred_session_id,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k27726){
var self__ = this;
var this__5476__auto____$1 = this;
var G__27775 = k27726;
var G__27775__$1 = (((G__27775 instanceof cljs.core.Keyword))?G__27775.fqn:null);
switch (G__27775__$1) {
case "preferred-session-id":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k27726);

}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__27725){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__27776 = cljs.core.keyword_identical_QMARK_;
var expr__27777 = k__5478__auto__;
if(cljs.core.truth_((pred__27776.cljs$core$IFn$_invoke$arity$2 ? pred__27776.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),expr__27777) : pred__27776.call(null,new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),expr__27777)))){
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(G__27725,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(self__.preferred_session_id,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__27725),null));
}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),self__.preferred_session_id,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__27725){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(self__.preferred_session_id,G__27725,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"preferred-session-id","preferred-session-id",-1051391146,null)], null);
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.cljs$lang$type = true);

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.mongo-message-source/MongoMessageSource",null,(1),null));
}));

(knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.mongo-message-source/MongoMessageSource");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.mongo-message-source/MongoMessageSource.
 */
knoxx.backend.infra.stores.mongo_message_source.__GT_MongoMessageSource = (function knoxx$backend$infra$stores$mongo_message_source$__GT_MongoMessageSource(preferred_session_id){
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(preferred_session_id,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.mongo-message-source/MongoMessageSource, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.mongo_message_source.map__GT_MongoMessageSource = (function knoxx$backend$infra$stores$mongo_message_source$map__GT_MongoMessageSource(G__27736){
var extmap__5511__auto__ = (function (){var G__27783 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__27736,new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623));
if(cljs.core.record_QMARK_(G__27736)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__27783);
} else {
return G__27783;
}
})();
return (new knoxx.backend.infra.stores.mongo_message_source.MongoMessageSource(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623).cljs$core$IFn$_invoke$arity$1(G__27736),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_message_source.js.map
