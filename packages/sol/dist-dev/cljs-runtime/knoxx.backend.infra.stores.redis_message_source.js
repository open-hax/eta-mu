import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.stores.message_source.js";
import "./knoxx.backend.infra.redis_client.js";
import "./knoxx.backend.infra.stores.session_store.js";
goog.provide('knoxx.backend.infra.stores.redis_message_source');
knoxx.backend.infra.stores.redis_message_source.messages_from_session_BANG_ = (async function knoxx$backend$infra$stores$redis_message_source$messages_from_session_BANG_(client,session_id){
if((((client == null)) || (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto____$1 = session_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
})()))))))){
return cljs.core.PersistentVector.EMPTY;
} else {
var session = (await knoxx.backend.infra.stores.session_store.get_session(client,session_id));
return cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
}
});
knoxx.backend.infra.stores.redis_message_source.fetch_redis_messages_BANG_ = (async function knoxx$backend$infra$stores$redis_message_source$fetch_redis_messages_BANG_(preferred_session_id,conversation_id){
var client = knoxx.backend.infra.redis_client.get_client();
if(cljs.core.truth_(preferred_session_id)){
return (await knoxx.backend.infra.stores.redis_message_source.messages_from_session_BANG_(client,preferred_session_id));
} else {
if(((clojure.string.blank_QMARK_(conversation_id)) || ((client == null)))){
return cljs.core.PersistentVector.EMPTY;
} else {
var session_id = (await knoxx.backend.infra.stores.session_store.get_conversation_active_session(client,conversation_id));
return (await knoxx.backend.infra.stores.redis_message_source.messages_from_session_BANG_(client,session_id));

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
knoxx.backend.infra.stores.redis_message_source.RedisMessageSource = (function (preferred_session_id,__meta,__extmap,__hash){
this.preferred_session_id = preferred_session_id;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k22896,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__22906 = k22896;
var G__22906__$1 = (((G__22906 instanceof cljs.core.Keyword))?G__22906.fqn:null);
switch (G__22906__$1) {
case "preferred-session-id":
return self__.preferred_session_id;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k22896,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__22909){
var vec__22911 = p__22909;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22911,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22911,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.redis-message-source.RedisMessageSource{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),self__.preferred_session_id],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__22895){
var self__ = this;
var G__22895__$1 = this;
return (new cljs.core.RecordIter((0),G__22895__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(self__.preferred_session_id,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-43095150 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this22897,other22898){
var self__ = this;
var this22897__$1 = this;
return (((!((other22898 == null)))) && ((((this22897__$1.constructor === other22898.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22897__$1.preferred_session_id,other22898.preferred_session_id)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22897__$1.__extmap,other22898.__extmap)))))));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.knoxx$backend$infra$stores$message_source$IMessageSource$fetch_messages_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.redis_message_source.fetch_redis_messages_BANG_(self__.preferred_session_id,conversation_id);
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(self__.preferred_session_id,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k22896){
var self__ = this;
var this__5476__auto____$1 = this;
var G__22926 = k22896;
var G__22926__$1 = (((G__22926 instanceof cljs.core.Keyword))?G__22926.fqn:null);
switch (G__22926__$1) {
case "preferred-session-id":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k22896);

}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__22895){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__22930 = cljs.core.keyword_identical_QMARK_;
var expr__22931 = k__5478__auto__;
if(cljs.core.truth_((pred__22930.cljs$core$IFn$_invoke$arity$2 ? pred__22930.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),expr__22931) : pred__22930.call(null,new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),expr__22931)))){
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(G__22895,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(self__.preferred_session_id,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__22895),null));
}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623),self__.preferred_session_id,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__22895){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(self__.preferred_session_id,G__22895,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"preferred-session-id","preferred-session-id",-1051391146,null)], null);
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.cljs$lang$type = true);

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.redis-message-source/RedisMessageSource",null,(1),null));
}));

(knoxx.backend.infra.stores.redis_message_source.RedisMessageSource.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.redis-message-source/RedisMessageSource");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.redis-message-source/RedisMessageSource.
 */
knoxx.backend.infra.stores.redis_message_source.__GT_RedisMessageSource = (function knoxx$backend$infra$stores$redis_message_source$__GT_RedisMessageSource(preferred_session_id){
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(preferred_session_id,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.redis-message-source/RedisMessageSource, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.redis_message_source.map__GT_RedisMessageSource = (function knoxx$backend$infra$stores$redis_message_source$map__GT_RedisMessageSource(G__22901){
var extmap__5511__auto__ = (function (){var G__22946 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__22901,new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623));
if(cljs.core.record_QMARK_(G__22901)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__22946);
} else {
return G__22946;
}
})();
return (new knoxx.backend.infra.stores.redis_message_source.RedisMessageSource(new cljs.core.Keyword(null,"preferred-session-id","preferred-session-id",1603044623).cljs$core$IFn$_invoke$arity$1(G__22901),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.redis_message_source.js.map
