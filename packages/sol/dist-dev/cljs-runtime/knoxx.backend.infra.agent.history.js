import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.eta_mu.js";
import "./knoxx.backend.infra.agent.message.js";
import "./knoxx.backend.infra.stores.message_source.js";
goog.provide('knoxx.backend.infra.agent.history');

/**
 * @interface
 */
knoxx.backend.infra.agent.history.IMessageHistory = function(){};

var knoxx$backend$infra$agent$history$IMessageHistory$load_history$dyn_26758 = (function (history,request){
var x__5519__auto__ = (((history == null))?null:history);
var m__5520__auto__ = (knoxx.backend.infra.agent.history.load_history[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(history,request) : m__5520__auto__.call(null,history,request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.history.load_history["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(history,request) : m__5518__auto__.call(null,history,request));
} else {
throw cljs.core.missing_protocol("IMessageHistory.load-history",history);
}
}
});
knoxx.backend.infra.agent.history.load_history = (function knoxx$backend$infra$agent$history$load_history(history,request){
if((((!((history == null)))) && ((!((history.knoxx$backend$infra$agent$history$IMessageHistory$load_history$arity$2 == null)))))){
return history.knoxx$backend$infra$agent$history$IMessageHistory$load_history$arity$2(history,request);
} else {
return knoxx$backend$infra$agent$history$IMessageHistory$load_history$dyn_26758(history,request);
}
});

var knoxx$backend$infra$agent$history$IMessageHistory$append_message_BANG_$dyn_26765 = (function (history,message){
var x__5519__auto__ = (((history == null))?null:history);
var m__5520__auto__ = (knoxx.backend.infra.agent.history.append_message_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(history,message) : m__5520__auto__.call(null,history,message));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.history.append_message_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(history,message) : m__5518__auto__.call(null,history,message));
} else {
throw cljs.core.missing_protocol("IMessageHistory.append-message!",history);
}
}
});
knoxx.backend.infra.agent.history.append_message_BANG_ = (function knoxx$backend$infra$agent$history$append_message_BANG_(history,message){
if((((!((history == null)))) && ((!((history.knoxx$backend$infra$agent$history$IMessageHistory$append_message_BANG_$arity$2 == null)))))){
return history.knoxx$backend$infra$agent$history$IMessageHistory$append_message_BANG_$arity$2(history,message);
} else {
return knoxx$backend$infra$agent$history$IMessageHistory$append_message_BANG_$dyn_26765(history,message);
}
});


/**
 * @interface
 */
knoxx.backend.infra.agent.history.ITranscriptCodec = function(){};

var knoxx$backend$infra$agent$history$ITranscriptCodec$stored__GT_provider_messages$dyn_26770 = (function (codec,stored_messages,context_policy){
var x__5519__auto__ = (((codec == null))?null:codec);
var m__5520__auto__ = (knoxx.backend.infra.agent.history.stored__GT_provider_messages[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(codec,stored_messages,context_policy) : m__5520__auto__.call(null,codec,stored_messages,context_policy));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.history.stored__GT_provider_messages["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(codec,stored_messages,context_policy) : m__5518__auto__.call(null,codec,stored_messages,context_policy));
} else {
throw cljs.core.missing_protocol("ITranscriptCodec.stored->provider-messages",codec);
}
}
});
knoxx.backend.infra.agent.history.stored__GT_provider_messages = (function knoxx$backend$infra$agent$history$stored__GT_provider_messages(codec,stored_messages,context_policy){
if((((!((codec == null)))) && ((!((codec.knoxx$backend$infra$agent$history$ITranscriptCodec$stored__GT_provider_messages$arity$3 == null)))))){
return codec.knoxx$backend$infra$agent$history$ITranscriptCodec$stored__GT_provider_messages$arity$3(codec,stored_messages,context_policy);
} else {
return knoxx$backend$infra$agent$history$ITranscriptCodec$stored__GT_provider_messages$dyn_26770(codec,stored_messages,context_policy);
}
});

var knoxx$backend$infra$agent$history$ITranscriptCodec$provider__GT_stored_message$dyn_26772 = (function (codec,provider_message){
var x__5519__auto__ = (((codec == null))?null:codec);
var m__5520__auto__ = (knoxx.backend.infra.agent.history.provider__GT_stored_message[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(codec,provider_message) : m__5520__auto__.call(null,codec,provider_message));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.history.provider__GT_stored_message["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(codec,provider_message) : m__5518__auto__.call(null,codec,provider_message));
} else {
throw cljs.core.missing_protocol("ITranscriptCodec.provider->stored-message",codec);
}
}
});
knoxx.backend.infra.agent.history.provider__GT_stored_message = (function knoxx$backend$infra$agent$history$provider__GT_stored_message(codec,provider_message){
if((((!((codec == null)))) && ((!((codec.knoxx$backend$infra$agent$history$ITranscriptCodec$provider__GT_stored_message$arity$2 == null)))))){
return codec.knoxx$backend$infra$agent$history$ITranscriptCodec$provider__GT_stored_message$arity$2(codec,provider_message);
} else {
return knoxx$backend$infra$agent$history$ITranscriptCodec$provider__GT_stored_message$dyn_26772(codec,provider_message);
}
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {knoxx.backend.infra.agent.history.IMessageHistory}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.history.MessageSourceHistory = (function (message_source,__meta,__extmap,__hash){
this.message_source = message_source;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26473,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26487 = k26473;
var G__26487__$1 = (((G__26487 instanceof cljs.core.Keyword))?G__26487.fqn:null);
switch (G__26487__$1) {
case "message-source":
return self__.message_source;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26473,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26496){
var vec__26498 = p__26496;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26498,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26498,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.history.MessageSourceHistory{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"message-source","message-source",-665795474),self__.message_source],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26472){
var self__ = this;
var G__26472__$1 = this;
return (new cljs.core.RecordIter((0),G__26472__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message-source","message-source",-665795474)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(self__.message_source,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-970170860 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26474,other26475){
var self__ = this;
var this26474__$1 = this;
return (((!((other26475 == null)))) && ((((this26474__$1.constructor === other26475.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26474__$1.message_source,other26475.message_source)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26474__$1.__extmap,other26475.__extmap)))))));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.knoxx$backend$infra$agent$history$IMessageHistory$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.knoxx$backend$infra$agent$history$IMessageHistory$load_history$arity$2 = (function (_,p__26534){
var self__ = this;
var map__26535 = p__26534;
var map__26535__$1 = cljs.core.__destructure_map(map__26535);
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26535__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var ___$1 = this;
return knoxx.backend.infra.stores.message_source.fetch_messages_BANG_(self__.message_source,conversation_id);
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.knoxx$backend$infra$agent$history$IMessageHistory$append_message_BANG_$arity$2 = (function (_,_message){
var self__ = this;
var ___$1 = this;
return Promise.resolve(null);
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"message-source","message-source",-665795474),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(self__.message_source,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26473){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26539 = k26473;
var G__26539__$1 = (((G__26539 instanceof cljs.core.Keyword))?G__26539.fqn:null);
switch (G__26539__$1) {
case "message-source":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26473);

}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26472){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26543 = cljs.core.keyword_identical_QMARK_;
var expr__26544 = k__5478__auto__;
if(cljs.core.truth_((pred__26543.cljs$core$IFn$_invoke$arity$2 ? pred__26543.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"message-source","message-source",-665795474),expr__26544) : pred__26543.call(null,new cljs.core.Keyword(null,"message-source","message-source",-665795474),expr__26544)))){
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(G__26472,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(self__.message_source,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26472),null));
}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"message-source","message-source",-665795474),self__.message_source,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26472){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(self__.message_source,G__26472,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"message-source","message-source",974736053,null)], null);
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.cljs$lang$type = true);

(knoxx.backend.infra.agent.history.MessageSourceHistory.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.history/MessageSourceHistory",null,(1),null));
}));

(knoxx.backend.infra.agent.history.MessageSourceHistory.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.history/MessageSourceHistory");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.history/MessageSourceHistory.
 */
knoxx.backend.infra.agent.history.__GT_MessageSourceHistory = (function knoxx$backend$infra$agent$history$__GT_MessageSourceHistory(message_source){
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(message_source,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.history/MessageSourceHistory, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.history.map__GT_MessageSourceHistory = (function knoxx$backend$infra$agent$history$map__GT_MessageSourceHistory(G__26480){
var extmap__5511__auto__ = (function (){var G__26560 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__26480,new cljs.core.Keyword(null,"message-source","message-source",-665795474));
if(cljs.core.record_QMARK_(G__26480)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26560);
} else {
return G__26560;
}
})();
return (new knoxx.backend.infra.agent.history.MessageSourceHistory(new cljs.core.Keyword(null,"message-source","message-source",-665795474).cljs$core$IFn$_invoke$arity$1(G__26480),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.history.message_source_history = (function knoxx$backend$infra$agent$history$message_source_history(message_source){
return knoxx.backend.infra.agent.history.__GT_MessageSourceHistory(message_source);
});
knoxx.backend.infra.agent.history.positive_int_value = (function knoxx$backend$infra$agent$history$positive_int_value(v){
if(cljs.core.integer_QMARK_(v)){
return cljs.core.max.cljs$core$IFn$_invoke$arity$2(v,(0));
} else {
return null;
}
});
knoxx.backend.infra.agent.history.context_policy = (function knoxx$backend$infra$agent$history$context_policy(agent_spec){
var or__5162__auto__ = new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"contextPolicy","contextPolicy",683316353).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"context","context",-830191113).cljs$core$IFn$_invoke$arity$1(agent_spec);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(agent_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extras","extras",-1110348066),new cljs.core.Keyword(null,"context","context",-830191113)], null));
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(agent_spec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"extras","extras",-1110348066),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557)], null));
}
}
}
}
});
knoxx.backend.infra.agent.history.prune_session_messages = (function knoxx$backend$infra$agent$history$prune_session_messages(agent_spec,messages){
var items = cljs.core.vec((function (){var or__5162__auto__ = messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var policy = knoxx.backend.infra.agent.history.context_policy(agent_spec);
if(cljs.core.not(policy)){
return items;
} else {
var max_messages = knoxx.backend.infra.agent.history.positive_int_value((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"max-messages","max-messages",-1089461657).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"maxMessages","maxMessages",1680581379).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"max_messages","max_messages",-755082145).cljs$core$IFn$_invoke$arity$1(policy);
}
}
})());
var max_chars = knoxx.backend.infra.agent.history.positive_int_value((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"max-chars","max-chars",899663888).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"maxChars","maxChars",-1468489647).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"max_chars","max_chars",667525949).cljs$core$IFn$_invoke$arity$1(policy);
}
}
})());
var preserve_system_QMARK_ = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"preserve-system","preserve-system",1239455246).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"preserveSystem","preserveSystem",-2026748027).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"preserve_system","preserve_system",-966670117).cljs$core$IFn$_invoke$arity$1(policy);
}
}
})());
var system_messages = ((preserve_system_QMARK_)?cljs.core.filterv((function (p1__26566_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("system",(function (){var G__26571 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__26566_SHARP_);
var G__26571__$1 = (((G__26571 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26571)));
if((G__26571__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__26571__$1);
}
})());
}),items):cljs.core.PersistentVector.EMPTY);
var body_messages = ((preserve_system_QMARK_)?cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__26567_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("system",(function (){var G__26574 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__26567_SHARP_);
var G__26574__$1 = (((G__26574 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26574)));
if((G__26574__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__26574__$1);
}
})());
}),items):items);
var by_count = (cljs.core.truth_(max_messages)?cljs.core.take_last(max_messages,cljs.core.vec(body_messages)):cljs.core.vec(body_messages));
var by_chars = (cljs.core.truth_(max_chars)?(function (){var remaining = cljs.core.reverse(by_count);
var total = (0);
var kept = cljs.core.List.EMPTY;
while(true){
var temp__5823__auto__ = cljs.core.first(remaining);
if(cljs.core.truth_(temp__5823__auto__)){
var message = temp__5823__auto__;
var size = knoxx.backend.infra.agent.message.message_text_size(message);
if(((cljs.core.seq(kept)) && (((total + size) > max_chars)))){
return cljs.core.vec(kept);
} else {
var G__26810 = cljs.core.rest(remaining);
var G__26811 = (total + size);
var G__26812 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(kept,message);
remaining = G__26810;
total = G__26811;
kept = G__26812;
continue;
}
} else {
return cljs.core.vec(kept);
}
break;
}
})():cljs.core.vec(by_count));
return cljs.core.vec(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(system_messages,by_chars));
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {knoxx.backend.infra.agent.history.ITranscriptCodec}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.history.DefaultTranscriptCodec = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.knoxx$backend$infra$agent$history$ITranscriptCodec$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.knoxx$backend$infra$agent$history$ITranscriptCodec$stored__GT_provider_messages$arity$3 = (function (_,stored_messages,agent_spec){
var self__ = this;
var ___$1 = this;
return cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.message.stored_session_message__GT_agent_message,knoxx.backend.infra.agent.history.prune_session_messages(agent_spec,stored_messages)));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.knoxx$backend$infra$agent$history$ITranscriptCodec$provider__GT_stored_message$arity$2 = (function (_,provider_message){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.message.planner_row__GT_stored_session_message(provider_message);
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26590,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26623 = k26590;
switch (G__26623) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26590,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26628){
var vec__26630 = p__26628;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26630,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26630,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.history.DefaultTranscriptCodec{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26589){
var self__ = this;
var G__26589__$1 = this;
return (new cljs.core.RecordIter((0),G__26589__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-451013112 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26591,other26592){
var self__ = this;
var this26591__$1 = this;
return (((!((other26592 == null)))) && ((((this26591__$1.constructor === other26592.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26591__$1.__extmap,other26592.__extmap)))));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26590){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k26590);
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26589){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26674 = cljs.core.keyword_identical_QMARK_;
var expr__26675 = k__5478__auto__;
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26589),null));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26589){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(G__26589,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.cljs$lang$type = true);

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.history/DefaultTranscriptCodec",null,(1),null));
}));

(knoxx.backend.infra.agent.history.DefaultTranscriptCodec.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.history/DefaultTranscriptCodec");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.history/DefaultTranscriptCodec.
 */
knoxx.backend.infra.agent.history.__GT_DefaultTranscriptCodec = (function knoxx$backend$infra$agent$history$__GT_DefaultTranscriptCodec(){
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.history/DefaultTranscriptCodec, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.history.map__GT_DefaultTranscriptCodec = (function knoxx$backend$infra$agent$history$map__GT_DefaultTranscriptCodec(G__26608){
var extmap__5511__auto__ = (function (){var G__26709 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__26608);
if(cljs.core.record_QMARK_(G__26608)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26709);
} else {
return G__26709;
}
})();
return (new knoxx.backend.infra.agent.history.DefaultTranscriptCodec(null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.history.default_transcript_codec = knoxx.backend.infra.agent.history.__GT_DefaultTranscriptCodec();
knoxx.backend.infra.agent.history.rehydrate_session_manager_BANG_ = (async function knoxx$backend$infra$agent$history$rehydrate_session_manager_BANG_(message_source,session_manager,conversation_id,agent_spec){
var history__$1 = knoxx.backend.infra.agent.history.message_source_history(message_source);
var messages = (await history__$1.knoxx$backend$infra$agent$history$IMessageHistory$load_history$arity$2(null,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id], null)));
var merged_messages = (function (p1__26711_SHARP_){
return knoxx.backend.infra.agent.history.prune_session_messages(agent_spec,p1__26711_SHARP_);
})(knoxx.backend.infra.agent.message.sync_system_message(cljs.core.vec((await (async function (){var or__5162__auto__ = messages;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(agent_spec)));
var seq__26719_26857 = cljs.core.seq(merged_messages);
var chunk__26720_26858 = null;
var count__26721_26859 = (0);
var i__26722_26860 = (0);
while(true){
if((i__26722_26860 < count__26721_26859)){
var message_26862 = chunk__26720_26858.cljs$core$IIndexed$_nth$arity$2(null,i__26722_26860);
var temp__5825__auto___26863 = knoxx.backend.infra.agent.message.stored_session_message__GT_agent_message(message_26862);
if(cljs.core.truth_(temp__5825__auto___26863)){
var agent_message_26867 = temp__5825__auto___26863;
knoxx.backend.extern.eta_mu.append_message_BANG_(session_manager,agent_message_26867);
} else {
}


var G__26868 = seq__26719_26857;
var G__26869 = chunk__26720_26858;
var G__26870 = count__26721_26859;
var G__26871 = (i__26722_26860 + (1));
seq__26719_26857 = G__26868;
chunk__26720_26858 = G__26869;
count__26721_26859 = G__26870;
i__26722_26860 = G__26871;
continue;
} else {
var temp__5825__auto___26872 = cljs.core.seq(seq__26719_26857);
if(temp__5825__auto___26872){
var seq__26719_26874__$1 = temp__5825__auto___26872;
if(cljs.core.chunked_seq_QMARK_(seq__26719_26874__$1)){
var c__5694__auto___26875 = cljs.core.chunk_first(seq__26719_26874__$1);
var G__26877 = cljs.core.chunk_rest(seq__26719_26874__$1);
var G__26878 = c__5694__auto___26875;
var G__26879 = cljs.core.count(c__5694__auto___26875);
var G__26880 = (0);
seq__26719_26857 = G__26877;
chunk__26720_26858 = G__26878;
count__26721_26859 = G__26879;
i__26722_26860 = G__26880;
continue;
} else {
var message_26883 = cljs.core.first(seq__26719_26874__$1);
var temp__5825__auto___26885__$1 = knoxx.backend.infra.agent.message.stored_session_message__GT_agent_message(message_26883);
if(cljs.core.truth_(temp__5825__auto___26885__$1)){
var agent_message_26886 = temp__5825__auto___26885__$1;
knoxx.backend.extern.eta_mu.append_message_BANG_(session_manager,agent_message_26886);
} else {
}


var G__26888 = cljs.core.next(seq__26719_26874__$1);
var G__26889 = null;
var G__26890 = (0);
var G__26891 = (0);
seq__26719_26857 = G__26888;
chunk__26720_26858 = G__26889;
count__26721_26859 = G__26890;
i__26722_26860 = G__26891;
continue;
}
} else {
}
}
break;
}

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session-manager","session-manager",-1140954467),session_manager,new cljs.core.Keyword(null,"restored","restored",1134950922),cljs.core.boolean$(cljs.core.seq(merged_messages))], null);
});

//# sourceMappingURL=knoxx.backend.infra.agent.history.js.map
