import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.stores.mongo_rate_limits.js";
goog.provide('knoxx.backend.infra.agent.policy');
knoxx.backend.infra.agent.policy.chat_policy_constraints = (function knoxx$backend$infra$agent$policy$chat_policy_constraints(auth_context){
var constraints = knoxx.backend.infra.auth.authz.ctx_tool_constraints(auth_context,"agent.chat");
if(cljs.core.map_QMARK_(constraints)){
return constraints;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = constraints;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("object",goog.typeOf(constraints));
} else {
return and__5160__auto__;
}
})())){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(constraints,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return cljs.core.PersistentArrayMap.EMPTY;

}
}
});
knoxx.backend.infra.agent.policy.allowed_models = (function knoxx$backend$infra$agent$policy$allowed_models(constraints){
var raw = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"allowedModels","allowedModels",-660080636).cljs$core$IFn$_invoke$arity$1(constraints);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"allowed-models","allowed-models",2019027926).cljs$core$IFn$_invoke$arity$1(constraints);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"models","models",-1985455662).cljs$core$IFn$_invoke$arity$1(constraints);
}
}
})();
return cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__28049_SHARP_){
if(typeof p1__28049_SHARP_ === 'string'){
var t = clojure.string.trim(p1__28049_SHARP_);
if(clojure.string.blank_QMARK_(t)){
return null;
} else {
return t;
}
} else {
return null;
}
}),((cljs.core.sequential_QMARK_(raw))?raw:(cljs.core.truth_(cljs.core.array_QMARK_(raw))?cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(raw):cljs.core.PersistentVector.EMPTY
))));
});
knoxx.backend.infra.agent.policy.chat_rate_limit_principal = (function knoxx$backend$infra$agent$policy$chat_rate_limit_principal(auth_context){
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"membershipId","membershipId",2026001076).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null));
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(auth_context);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(auth_context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null));
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618).cljs$core$IFn$_invoke$arity$1(auth_context);
}
}
}
}
}
});
knoxx.backend.infra.agent.policy.positive_int = (function knoxx$backend$infra$agent$policy$positive_int(value){
var parsed = parseInt(value,(10));
if(((typeof parsed === 'number') && (((cljs.core.not(isNaN(parsed))) && ((parsed > (0))))))){
return parsed;
} else {
return null;
}
});
knoxx.backend.infra.agent.policy.rate_limit_error = (function knoxx$backend$infra$agent$policy$rate_limit_error(max_requests,window_seconds){
var G__28083 = (new Error((""+"Chat rate limit exceeded: more than "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_requests)+" requests in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(window_seconds)+" seconds")));
(G__28083["statusCode"] = (429));

(G__28083["code"] = "chat_rate_limited");

return G__28083;
});
knoxx.backend.infra.agent.policy.model_policy_error = (function knoxx$backend$infra$agent$policy$model_policy_error(model_id,allowed){
var G__28087 = (new Error((""+"Model '"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+"' is not allowed for this account. Allowed models: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cljs.core.sort.cljs$core$IFn$_invoke$arity$1(allowed))))));
(G__28087["statusCode"] = (403));

(G__28087["code"] = "model_not_allowed");

return G__28087;
});
/**
 * Throw if model-id is not in the allow-list.
 */
knoxx.backend.infra.agent.policy.check_model_policy_BANG_ = (function knoxx$backend$infra$agent$policy$check_model_policy_BANG_(model_id,permitted_models){
if(((cljs.core.seq(permitted_models)) && ((!(cljs.core.contains_QMARK_(permitted_models,model_id)))))){
throw knoxx.backend.infra.agent.policy.model_policy_error(model_id,permitted_models);
} else {
return null;
}
});
/**
 * Check and enforce the chat rate limit via Mongo $inc + TTL.
 */
knoxx.backend.infra.agent.policy.check_rate_limit_BANG_ = (async function knoxx$backend$infra$agent$policy$check_rate_limit_BANG_(principal,max_requests,window_seconds){
var key = (""+"knoxx:chat-rate:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(principal)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(window_seconds));
try{var count = (await knoxx.backend.infra.stores.mongo_rate_limits.increment_rate_limit_BANG_.cljs$core$IFn$_invoke$arity$2(key,window_seconds));
if((count > max_requests)){
throw knoxx.backend.infra.agent.policy.rate_limit_error(max_requests,window_seconds);
} else {
return null;
}
}catch (e28118){var err = e28118;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((err["code"]),"chat_rate_limited")){
throw err;
} else {
return null;
}
}});
/**
 * Enforce model allow-list and rate-limit constraints for a chat turn.
 * Returns a Promise that resolves to nil on success or rejects on policy violation.
 */
knoxx.backend.infra.agent.policy.enforce_chat_policy_BANG_ = (function knoxx$backend$infra$agent$policy$enforce_chat_policy_BANG_(auth_context,model_id){
var constraints = knoxx.backend.infra.agent.policy.chat_policy_constraints(auth_context);
var permitted_models = knoxx.backend.infra.agent.policy.allowed_models(constraints);
var max_requests = knoxx.backend.infra.agent.policy.positive_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"maxRequests","maxRequests",967196018).cljs$core$IFn$_invoke$arity$1(constraints);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"max-requests","max-requests",229153272).cljs$core$IFn$_invoke$arity$1(constraints);
}
})());
var window_seconds = knoxx.backend.infra.agent.policy.positive_int((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"windowSeconds","windowSeconds",-573461410).cljs$core$IFn$_invoke$arity$1(constraints);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"window-seconds","window-seconds",1922216946).cljs$core$IFn$_invoke$arity$1(constraints);
}
})());
var principal = (function (){var G__28135 = knoxx.backend.infra.agent.policy.chat_rate_limit_principal(auth_context);
var G__28135__$1 = (((G__28135 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28135)));
if((G__28135__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__28135__$1);
}
})();
knoxx.backend.infra.agent.policy.check_model_policy_BANG_(model_id,permitted_models);

if(cljs.core.truth_((function (){var and__5160__auto__ = principal;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = max_requests;
if(cljs.core.truth_(and__5160__auto____$1)){
return window_seconds;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.infra.agent.policy.check_rate_limit_BANG_(principal,max_requests,window_seconds);
} else {
return Promise.resolve(null);
}
});
knoxx.backend.infra.agent.policy.resolve_model_policy_impl_BANG_ = (async function knoxx$backend$infra$agent$policy$resolve_model_policy_impl_BANG_(auth_context,requested_model){
(await knoxx.backend.infra.agent.policy.enforce_chat_policy_BANG_(auth_context,requested_model));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"model","model",331153215),requested_model,new cljs.core.Keyword(null,"allowed","allowed",1436019743),true], null);
});

/**
 * @interface
 */
knoxx.backend.infra.agent.policy.IPolicyEngine = function(){};

var knoxx$backend$infra$agent$policy$IPolicyEngine$authorize_turn$dyn_28291 = (function (engine,turn_request){
var x__5519__auto__ = (((engine == null))?null:engine);
var m__5520__auto__ = (knoxx.backend.infra.agent.policy.authorize_turn[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(engine,turn_request) : m__5520__auto__.call(null,engine,turn_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.policy.authorize_turn["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(engine,turn_request) : m__5518__auto__.call(null,engine,turn_request));
} else {
throw cljs.core.missing_protocol("IPolicyEngine.authorize-turn",engine);
}
}
});
knoxx.backend.infra.agent.policy.authorize_turn = (function knoxx$backend$infra$agent$policy$authorize_turn(engine,turn_request){
if((((!((engine == null)))) && ((!((engine.knoxx$backend$infra$agent$policy$IPolicyEngine$authorize_turn$arity$2 == null)))))){
return engine.knoxx$backend$infra$agent$policy$IPolicyEngine$authorize_turn$arity$2(engine,turn_request);
} else {
return knoxx$backend$infra$agent$policy$IPolicyEngine$authorize_turn$dyn_28291(engine,turn_request);
}
});

var knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$dyn_28302 = (function (engine,auth_context,requested_model){
var x__5519__auto__ = (((engine == null))?null:engine);
var m__5520__auto__ = (knoxx.backend.infra.agent.policy.resolve_model_policy[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,requested_model) : m__5520__auto__.call(null,engine,auth_context,requested_model));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.policy.resolve_model_policy["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,requested_model) : m__5518__auto__.call(null,engine,auth_context,requested_model));
} else {
throw cljs.core.missing_protocol("IPolicyEngine.resolve-model-policy",engine);
}
}
});
knoxx.backend.infra.agent.policy.resolve_model_policy = (function knoxx$backend$infra$agent$policy$resolve_model_policy(engine,auth_context,requested_model){
if((((!((engine == null)))) && ((!((engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$arity$3 == null)))))){
return engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$arity$3(engine,auth_context,requested_model);
} else {
return knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$dyn_28302(engine,auth_context,requested_model);
}
});

var knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_tool_policy$dyn_28304 = (function (engine,auth_context,agent_spec){
var x__5519__auto__ = (((engine == null))?null:engine);
var m__5520__auto__ = (knoxx.backend.infra.agent.policy.resolve_tool_policy[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,agent_spec) : m__5520__auto__.call(null,engine,auth_context,agent_spec));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.policy.resolve_tool_policy["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,agent_spec) : m__5518__auto__.call(null,engine,auth_context,agent_spec));
} else {
throw cljs.core.missing_protocol("IPolicyEngine.resolve-tool-policy",engine);
}
}
});
knoxx.backend.infra.agent.policy.resolve_tool_policy = (function knoxx$backend$infra$agent$policy$resolve_tool_policy(engine,auth_context,agent_spec){
if((((!((engine == null)))) && ((!((engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_tool_policy$arity$3 == null)))))){
return engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_tool_policy$arity$3(engine,auth_context,agent_spec);
} else {
return knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_tool_policy$dyn_28304(engine,auth_context,agent_spec);
}
});

var knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_resource_policy$dyn_28306 = (function (engine,auth_context,agent_spec){
var x__5519__auto__ = (((engine == null))?null:engine);
var m__5520__auto__ = (knoxx.backend.infra.agent.policy.resolve_resource_policy[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,agent_spec) : m__5520__auto__.call(null,engine,auth_context,agent_spec));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.policy.resolve_resource_policy["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(engine,auth_context,agent_spec) : m__5518__auto__.call(null,engine,auth_context,agent_spec));
} else {
throw cljs.core.missing_protocol("IPolicyEngine.resolve-resource-policy",engine);
}
}
});
knoxx.backend.infra.agent.policy.resolve_resource_policy = (function knoxx$backend$infra$agent$policy$resolve_resource_policy(engine,auth_context,agent_spec){
if((((!((engine == null)))) && ((!((engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_resource_policy$arity$3 == null)))))){
return engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_resource_policy$arity$3(engine,auth_context,agent_spec);
} else {
return knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_resource_policy$dyn_28306(engine,auth_context,agent_spec);
}
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {knoxx.backend.infra.agent.policy.IPolicyEngine}
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
knoxx.backend.infra.agent.policy.ChatPolicyEngine = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k28185,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__28197 = k28185;
switch (G__28197) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k28185,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__28201){
var vec__28202 = p__28201;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28202,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28202,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.policy.ChatPolicyEngine{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__28184){
var self__ = this;
var G__28184__$1 = this;
return (new cljs.core.RecordIter((0),G__28184__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-616732663 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this28186,other28187){
var self__ = this;
var this28186__$1 = this;
return (((!((other28187 == null)))) && ((((this28186__$1.constructor === other28187.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28186__$1.__extmap,other28187.__extmap)))));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k28185){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k28185);
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__28184){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__28224 = cljs.core.keyword_identical_QMARK_;
var expr__28225 = k__5478__auto__;
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__28184),null));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__28184){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(G__28184,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.knoxx$backend$infra$agent$policy$IPolicyEngine$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.knoxx$backend$infra$agent$policy$IPolicyEngine$authorize_turn$arity$2 = (function (_,turn_request){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.policy.enforce_chat_policy_BANG_(new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(turn_request),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(turn_request);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(turn_request,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
}
})());
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$arity$3 = (function (_,auth_context,requested_model){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.policy.resolve_model_policy_impl_BANG_(auth_context,requested_model);
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_tool_policy$arity$3 = (function (_,auth_context,agent_spec){
var self__ = this;
var ___$1 = this;
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),auth_context,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),agent_spec], null));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.prototype.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_resource_policy$arity$3 = (function (_,auth_context,agent_spec){
var self__ = this;
var ___$1 = this;
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),auth_context,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),agent_spec], null));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.cljs$lang$type = true);

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.policy/ChatPolicyEngine",null,(1),null));
}));

(knoxx.backend.infra.agent.policy.ChatPolicyEngine.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.policy/ChatPolicyEngine");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.policy/ChatPolicyEngine.
 */
knoxx.backend.infra.agent.policy.__GT_ChatPolicyEngine = (function knoxx$backend$infra$agent$policy$__GT_ChatPolicyEngine(){
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.policy/ChatPolicyEngine, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.policy.map__GT_ChatPolicyEngine = (function knoxx$backend$infra$agent$policy$map__GT_ChatPolicyEngine(G__28192){
var extmap__5511__auto__ = (function (){var G__28267 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__28192);
if(cljs.core.record_QMARK_(G__28192)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__28267);
} else {
return G__28267;
}
})();
return (new knoxx.backend.infra.agent.policy.ChatPolicyEngine(null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.policy.default_policy_engine = knoxx.backend.infra.agent.policy.__GT_ChatPolicyEngine();
knoxx.backend.infra.agent.policy.validate_chat_policy_BANG_ = (function knoxx$backend$infra$agent$policy$validate_chat_policy_BANG_(auth_context,model_id){
return knoxx.backend.infra.agent.policy.default_policy_engine.knoxx$backend$infra$agent$policy$IPolicyEngine$resolve_model_policy$arity$3(null,auth_context,model_id);
});

//# sourceMappingURL=knoxx.backend.infra.agent.policy.js.map
