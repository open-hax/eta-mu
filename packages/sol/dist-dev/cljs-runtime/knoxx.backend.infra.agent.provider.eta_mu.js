import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.extern.eta_mu.js";
import "./knoxx.backend.infra.agent.provider.js";
goog.provide('knoxx.backend.infra.agent.provider.eta_mu');

/**
 * @interface
 */
knoxx.backend.infra.agent.provider.eta_mu.IAgentProviderAdapter = function(){};

var knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$dyn_26624 = (function (provider){
var x__5519__auto__ = (((provider == null))?null:provider);
var m__5520__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.ensure_runtime_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(provider) : m__5520__auto__.call(null,provider));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.ensure_runtime_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(provider) : m__5518__auto__.call(null,provider));
} else {
throw cljs.core.missing_protocol("IAgentProviderAdapter.ensure-runtime!",provider);
}
}
});
knoxx.backend.infra.agent.provider.eta_mu.ensure_runtime_BANG_ = (function knoxx$backend$infra$agent$provider$eta_mu$ensure_runtime_BANG_(provider){
if((((!((provider == null)))) && ((!((provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$arity$1 == null)))))){
return provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$arity$1(provider);
} else {
return knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$dyn_26624(provider);
}
});

var knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$dyn_26627 = (function (provider,model_registry,model_provider_id,model_id,fallback_model_id){
var x__5519__auto__ = (((provider == null))?null:provider);
var m__5520__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.resolve_model[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(provider,model_registry,model_provider_id,model_id,fallback_model_id) : m__5520__auto__.call(null,provider,model_registry,model_provider_id,model_id,fallback_model_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.resolve_model["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(provider,model_registry,model_provider_id,model_id,fallback_model_id) : m__5518__auto__.call(null,provider,model_registry,model_provider_id,model_id,fallback_model_id));
} else {
throw cljs.core.missing_protocol("IAgentProviderAdapter.resolve-model",provider);
}
}
});
knoxx.backend.infra.agent.provider.eta_mu.resolve_model = (function knoxx$backend$infra$agent$provider$eta_mu$resolve_model(provider,model_registry,model_provider_id,model_id,fallback_model_id){
if((((!((provider == null)))) && ((!((provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$arity$5 == null)))))){
return provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$arity$5(provider,model_registry,model_provider_id,model_id,fallback_model_id);
} else {
return knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$dyn_26627(provider,model_registry,model_provider_id,model_id,fallback_model_id);
}
});

var knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$dyn_26629 = (function (provider,session_request){
var x__5519__auto__ = (((provider == null))?null:provider);
var m__5520__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.create_session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(provider,session_request) : m__5520__auto__.call(null,provider,session_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.create_session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(provider,session_request) : m__5518__auto__.call(null,provider,session_request));
} else {
throw cljs.core.missing_protocol("IAgentProviderAdapter.create-session!",provider);
}
}
});
knoxx.backend.infra.agent.provider.eta_mu.create_session_BANG_ = (function knoxx$backend$infra$agent$provider$eta_mu$create_session_BANG_(provider,session_request){
if((((!((provider == null)))) && ((!((provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$arity$2 == null)))))){
return provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$arity$2(provider,session_request);
} else {
return knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$dyn_26629(provider,session_request);
}
});

var knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$send_message_BANG_$dyn_26635 = (function (provider,provider_session,message_request){
var x__5519__auto__ = (((provider == null))?null:provider);
var m__5520__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.send_message_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(provider,provider_session,message_request) : m__5520__auto__.call(null,provider,provider_session,message_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.send_message_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(provider,provider_session,message_request) : m__5518__auto__.call(null,provider,provider_session,message_request));
} else {
throw cljs.core.missing_protocol("IAgentProviderAdapter.send-message!",provider);
}
}
});
knoxx.backend.infra.agent.provider.eta_mu.send_message_BANG_ = (function knoxx$backend$infra$agent$provider$eta_mu$send_message_BANG_(provider,provider_session,message_request){
if((((!((provider == null)))) && ((!((provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$send_message_BANG_$arity$3 == null)))))){
return provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$send_message_BANG_$arity$3(provider,provider_session,message_request);
} else {
return knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$send_message_BANG_$dyn_26635(provider,provider_session,message_request);
}
});

var knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$subscribe_stream_BANG_$dyn_26636 = (function (provider,provider_session,handlers){
var x__5519__auto__ = (((provider == null))?null:provider);
var m__5520__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.subscribe_stream_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(provider,provider_session,handlers) : m__5520__auto__.call(null,provider,provider_session,handlers));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.provider.eta_mu.subscribe_stream_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(provider,provider_session,handlers) : m__5518__auto__.call(null,provider,provider_session,handlers));
} else {
throw cljs.core.missing_protocol("IAgentProviderAdapter.subscribe-stream!",provider);
}
}
});
knoxx.backend.infra.agent.provider.eta_mu.subscribe_stream_BANG_ = (function knoxx$backend$infra$agent$provider$eta_mu$subscribe_stream_BANG_(provider,provider_session,handlers){
if((((!((provider == null)))) && ((!((provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$subscribe_stream_BANG_$arity$3 == null)))))){
return provider.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$subscribe_stream_BANG_$arity$3(provider,provider_session,handlers);
} else {
return knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$subscribe_stream_BANG_$dyn_26636(provider,provider_session,handlers);
}
});

knoxx.backend.infra.agent.provider.eta_mu.ensure_runtime_impl_BANG_ = (async function knoxx$backend$infra$agent$provider$eta_mu$ensure_runtime_impl_BANG_(config){
var model_ids = (await knoxx.backend.infra.agent.provider.fetch_proxx_model_ids_BANG_(config));
return knoxx.backend.extern.eta_mu.setup_runtime_BANG_(config,knoxx.backend.domain.models.models_config.cljs$core$IFn$_invoke$arity$2(config,model_ids),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"enabled","enabled",1195909756),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,new cljs.core.Keyword(null,"agent-compaction-enabled?","agent-compaction-enabled?",2081520583).cljs$core$IFn$_invoke$arity$1(config)),new cljs.core.Keyword(null,"reserveTokens","reserveTokens",58364174),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agent-compaction-reserve-tokens","agent-compaction-reserve-tokens",-1610115454).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (16384);
}
})()),new cljs.core.Keyword(null,"keepRecentTokens","keepRecentTokens",-1189162039),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agent-compaction-keep-recent-tokens","agent-compaction-keep-recent-tokens",-1603219081).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (20000);
}
})())], null));
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
 * @implements {knoxx.backend.infra.agent.provider.eta_mu.IAgentProviderAdapter}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter = (function (runtime,config,__meta,__extmap,__hash){
this.runtime = runtime;
this.config = config;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26525,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26542 = k26525;
var G__26542__$1 = (((G__26542 instanceof cljs.core.Keyword))?G__26542.fqn:null);
switch (G__26542__$1) {
case "runtime":
return self__.runtime;

break;
case "config":
return self__.config;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26525,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26551){
var vec__26552 = p__26551;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26552,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26552,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.provider.eta-mu.EtaMuProviderAdapter{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26524){
var self__ = this;
var G__26524__$1 = this;
return (new cljs.core.RecordIter((0),G__26524__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.Keyword(null,"config","config",994861415)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(self__.runtime,self__.config,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1865897802 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26526,other26527){
var self__ = this;
var this26526__$1 = this;
return (((!((other26527 == null)))) && ((((this26526__$1.constructor === other26527.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26526__$1.runtime,other26527.runtime)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26526__$1.config,other26527.config)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26526__$1.__extmap,other26527.__extmap)))))))));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(self__.runtime,self__.config,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26525){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26584 = k26525;
var G__26584__$1 = (((G__26584 instanceof cljs.core.Keyword))?G__26584.fqn:null);
switch (G__26584__$1) {
case "runtime":
case "config":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26525);

}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26524){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26586 = cljs.core.keyword_identical_QMARK_;
var expr__26587 = k__5478__auto__;
if(cljs.core.truth_((pred__26586.cljs$core$IFn$_invoke$arity$2 ? pred__26586.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__26587) : pred__26586.call(null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__26587)))){
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(G__26524,self__.config,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26586.cljs$core$IFn$_invoke$arity$2 ? pred__26586.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__26587) : pred__26586.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__26587)))){
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(self__.runtime,G__26524,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(self__.runtime,self__.config,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26524),null));
}
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26524){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(self__.runtime,self__.config,G__26524,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$ensure_runtime_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.provider.eta_mu.ensure_runtime_impl_BANG_(self__.config);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$resolve_model$arity$5 = (function (_,model_registry,model_provider_id,model_id,fallback_model_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.extern.eta_mu.find_model(model_registry,model_provider_id,model_id,fallback_model_id);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$create_session_BANG_$arity$2 = (function (_,session_request){
var self__ = this;
var ___$1 = this;
return knoxx.backend.extern.eta_mu.create_session_BANG_(session_request);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$send_message_BANG_$arity$3 = (function (_,provider_session,message_request){
var self__ = this;
var ___$1 = this;
var temp__5823__auto__ = new cljs.core.Keyword(null,"send-message!","send-message!",-1595731731).cljs$core$IFn$_invoke$arity$1(message_request);
if(cljs.core.truth_(temp__5823__auto__)){
var send_BANG_ = temp__5823__auto__;
return (send_BANG_.cljs$core$IFn$_invoke$arity$2 ? send_BANG_.cljs$core$IFn$_invoke$arity$2(provider_session,message_request) : send_BANG_.call(null,provider_session,message_request));
} else {
return Promise.reject((new Error("EtaMuProviderAdapter send-message! requires :send-message! in message-request")));
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.prototype.knoxx$backend$infra$agent$provider$eta_mu$IAgentProviderAdapter$subscribe_stream_BANG_$arity$3 = (function (_,provider_session,handlers){
var self__ = this;
var ___$1 = this;
var temp__5823__auto__ = new cljs.core.Keyword(null,"subscribe!","subscribe!",1617113594).cljs$core$IFn$_invoke$arity$1(handlers);
if(cljs.core.truth_(temp__5823__auto__)){
var subscribe_BANG_ = temp__5823__auto__;
return (subscribe_BANG_.cljs$core$IFn$_invoke$arity$2 ? subscribe_BANG_.cljs$core$IFn$_invoke$arity$2(provider_session,handlers) : subscribe_BANG_.call(null,provider_session,handlers));
} else {
return Promise.reject((new Error("EtaMuProviderAdapter subscribe-stream! requires :subscribe! in handlers")));
}
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"runtime","runtime",308957531,null),new cljs.core.Symbol(null,"config","config",-1659574354,null)], null);
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.cljs$lang$type = true);

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.provider.eta-mu/EtaMuProviderAdapter",null,(1),null));
}));

(knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.provider.eta-mu/EtaMuProviderAdapter");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.provider.eta-mu/EtaMuProviderAdapter.
 */
knoxx.backend.infra.agent.provider.eta_mu.__GT_EtaMuProviderAdapter = (function knoxx$backend$infra$agent$provider$eta_mu$__GT_EtaMuProviderAdapter(runtime,config){
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(runtime,config,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.provider.eta-mu/EtaMuProviderAdapter, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.provider.eta_mu.map__GT_EtaMuProviderAdapter = (function knoxx$backend$infra$agent$provider$eta_mu$map__GT_EtaMuProviderAdapter(G__26529){
var extmap__5511__auto__ = (function (){var G__26617 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__26529,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"config","config",994861415)], 0));
if(cljs.core.record_QMARK_(G__26529)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26617);
} else {
return G__26617;
}
})();
return (new knoxx.backend.infra.agent.provider.eta_mu.EtaMuProviderAdapter(new cljs.core.Keyword(null,"runtime","runtime",-1331573996).cljs$core$IFn$_invoke$arity$1(G__26529),new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__26529),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.provider.eta_mu.eta_mu_provider = (function knoxx$backend$infra$agent$provider$eta_mu$eta_mu_provider(runtime,config){
return knoxx.backend.infra.agent.provider.eta_mu.__GT_EtaMuProviderAdapter(runtime,config);
});

//# sourceMappingURL=knoxx.backend.infra.agent.provider.eta_mu.js.map
