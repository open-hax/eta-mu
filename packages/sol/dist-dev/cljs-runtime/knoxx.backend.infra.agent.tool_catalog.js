import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.eta_mu.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.infra.tooling.js";
goog.provide('knoxx.backend.infra.agent.tool_catalog');

/**
 * @interface
 */
knoxx.backend.infra.agent.tool_catalog.IToolCatalog = function(){};

var knoxx$backend$infra$agent$tool_catalog$IToolCatalog$available_tools$dyn_29204 = (function (catalog,context){
var x__5519__auto__ = (((catalog == null))?null:catalog);
var m__5520__auto__ = (knoxx.backend.infra.agent.tool_catalog.available_tools[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(catalog,context) : m__5520__auto__.call(null,catalog,context));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.tool_catalog.available_tools["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(catalog,context) : m__5518__auto__.call(null,catalog,context));
} else {
throw cljs.core.missing_protocol("IToolCatalog.available-tools",catalog);
}
}
});
knoxx.backend.infra.agent.tool_catalog.available_tools = (function knoxx$backend$infra$agent$tool_catalog$available_tools(catalog,context){
if((((!((catalog == null)))) && ((!((catalog.knoxx$backend$infra$agent$tool_catalog$IToolCatalog$available_tools$arity$2 == null)))))){
return catalog.knoxx$backend$infra$agent$tool_catalog$IToolCatalog$available_tools$arity$2(catalog,context);
} else {
return knoxx$backend$infra$agent$tool_catalog$IToolCatalog$available_tools$dyn_29204(catalog,context);
}
});


/**
 * @interface
 */
knoxx.backend.infra.agent.tool_catalog.IToolPolicyResolver = function(){};

var knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$allowed_tools$dyn_29205 = (function (resolver,auth_context,agent_spec,requested_tools){
var x__5519__auto__ = (((resolver == null))?null:resolver);
var m__5520__auto__ = (knoxx.backend.infra.agent.tool_catalog.allowed_tools[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(resolver,auth_context,agent_spec,requested_tools) : m__5520__auto__.call(null,resolver,auth_context,agent_spec,requested_tools));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.tool_catalog.allowed_tools["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(resolver,auth_context,agent_spec,requested_tools) : m__5518__auto__.call(null,resolver,auth_context,agent_spec,requested_tools));
} else {
throw cljs.core.missing_protocol("IToolPolicyResolver.allowed-tools",resolver);
}
}
});
knoxx.backend.infra.agent.tool_catalog.allowed_tools = (function knoxx$backend$infra$agent$tool_catalog$allowed_tools(resolver,auth_context,agent_spec,requested_tools){
if((((!((resolver == null)))) && ((!((resolver.knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$allowed_tools$arity$4 == null)))))){
return resolver.knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$allowed_tools$arity$4(resolver,auth_context,agent_spec,requested_tools);
} else {
return knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$allowed_tools$dyn_29205(resolver,auth_context,agent_spec,requested_tools);
}
});

knoxx.backend.infra.agent.tool_catalog.effective_tool_auth_context = (function knoxx$backend$infra$agent$tool_catalog$effective_tool_auth_context(auth_context,allowed_tool_ids){
if(cljs.core.not(auth_context)){
return null;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(auth_context,new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (tool_id){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),"allow"], null);
}),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.vec(allowed_tool_ids))));
}
});
knoxx.backend.infra.agent.tool_catalog.allowed_tool_ids = (function knoxx$backend$infra$agent$tool_catalog$allowed_tool_ids(config,auth_context,agent_spec){
return knoxx.backend.infra.tooling.allowed_tool_id_set.cljs$core$IFn$_invoke$arity$5(config,new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec),auth_context,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec));
});
knoxx.backend.infra.agent.tool_catalog.builtin_tools = (function knoxx$backend$infra$agent$tool_catalog$builtin_tools(runtime,config,tool_auth_context,agent_spec){
return knoxx.backend.infra.tooling.create_runtime_tools.cljs$core$IFn$_invoke$arity$6(runtime,config,tool_auth_context,new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec),new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec));
});
knoxx.backend.infra.agent.tool_catalog.custom_tools = (function knoxx$backend$infra$agent$tool_catalog$custom_tools(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids){
return knoxx.backend.infra.agent.hydration.create_agent_custom_tools.cljs$core$IFn$_invoke$arity$5(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids);
});
/**
 * True when a runtime tool name is safe to send as an OpenAI-style function name.
 */
knoxx.backend.infra.agent.tool_catalog.provider_safe_tool_name_QMARK_ = (function knoxx$backend$infra$agent$tool_catalog$provider_safe_tool_name_QMARK_(tool_name){
return cljs.core.boolean$((function (){var and__5160__auto__ = typeof tool_name === 'string';
if(and__5160__auto__){
return cljs.core.re_matches(/^[A-Za-z0-9_-]{1,64}$/,tool_name);
} else {
return and__5160__auto__;
}
})());
});
knoxx.backend.infra.agent.tool_catalog.tool_runtime_names = (function knoxx$backend$infra$agent$tool_catalog$tool_runtime_names(builtin_tools,custom_tools){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.tool_catalog.provider_safe_tool_name_QMARK_,cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.eta_mu.tool_runtime_name,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((function (){var or__5162__auto__ = builtin_tools;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),knoxx.backend.extern.eta_mu.tool_seq(custom_tools))))));
});
knoxx.backend.infra.agent.tool_catalog.visible_session_signature = (function knoxx$backend$infra$agent$tool_catalog$visible_session_signature(runtime,config,auth_context,agent_spec){
var allowed_tool_ids = knoxx.backend.infra.agent.tool_catalog.allowed_tool_ids(config,auth_context,agent_spec);
var tool_auth_context = knoxx.backend.infra.agent.tool_catalog.effective_tool_auth_context(auth_context,allowed_tool_ids);
var builtin = (function (){var or__5162__auto__ = knoxx.backend.infra.agent.tool_catalog.builtin_tools(runtime,config,tool_auth_context,agent_spec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var custom = (function (){var temp__5823__auto__ = knoxx.backend.infra.agent.tool_catalog.custom_tools(runtime,config,tool_auth_context,agent_spec,allowed_tool_ids);
if(cljs.core.truth_(temp__5823__auto__)){
var tools = temp__5823__auto__;
return knoxx.backend.extern.eta_mu.tool_seq(tools);
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.agent.tool_catalog.provider_safe_tool_name_QMARK_,cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.eta_mu.tool_runtime_name,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(builtin,custom)))))),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),(function (){var G__29047 = new cljs.core.Keyword(null,"contract-id","contract-id",-855048622).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29047__$1 = (((G__29047 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29047)));
var G__29047__$2 = (((G__29047__$1 == null))?null:clojure.string.trim(G__29047__$1));
if((G__29047__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29047__$2);
}
})(),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),(function (){var G__29063 = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29063__$1 = (((G__29063 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29063)));
var G__29063__$2 = (((G__29063__$1 == null))?null:clojure.string.trim(G__29063__$1));
if((G__29063__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29063__$2);
}
})(),new cljs.core.Keyword(null,"role","role",-736691072),(function (){var G__29080 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29080__$1 = (((G__29080 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29080)));
var G__29080__$2 = (((G__29080__$1 == null))?null:clojure.string.trim(G__29080__$1));
if((G__29080__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29080__$2);
}
})(),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),(function (){var G__29089 = new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29089__$1 = (((G__29089 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29089)));
var G__29089__$2 = (((G__29089__$1 == null))?null:clojure.string.trim(G__29089__$1));
if((G__29089__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29089__$2);
}
})(),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),(function (){var G__29094 = new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716).cljs$core$IFn$_invoke$arity$1(agent_spec);
var G__29094__$1 = (((G__29094 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29094)));
var G__29094__$2 = (((G__29094__$1 == null))?null:clojure.string.trim(G__29094__$1));
if((G__29094__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29094__$2);
}
})()], null)], 0));
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
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {knoxx.backend.infra.agent.tool_catalog.IToolPolicyResolver}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver = (function (config,__meta,__extmap,__hash){
this.config = config;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29106,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29142 = k29106;
var G__29142__$1 = (((G__29142 instanceof cljs.core.Keyword))?G__29142.fqn:null);
switch (G__29142__$1) {
case "config":
return self__.config;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29106,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29151){
var vec__29156 = p__29151;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29156,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29156,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.tool-catalog.DefaultToolPolicyResolver{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29105){
var self__ = this;
var G__29105__$1 = this;
return (new cljs.core.RecordIter((0),G__29105__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(self__.config,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1791800584 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29107,other29108){
var self__ = this;
var this29107__$1 = this;
return (((!((other29108 == null)))) && ((((this29107__$1.constructor === other29108.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29107__$1.config,other29108.config)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29107__$1.__extmap,other29108.__extmap)))))));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(self__.config,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.knoxx$backend$infra$agent$tool_catalog$IToolPolicyResolver$allowed_tools$arity$4 = (function (_,auth_context,agent_spec,_requested_tools){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.agent.tool_catalog.allowed_tool_ids(self__.config,auth_context,agent_spec);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29106){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29175 = k29106;
var G__29175__$1 = (((G__29175 instanceof cljs.core.Keyword))?G__29175.fqn:null);
switch (G__29175__$1) {
case "config":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29106);

}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29105){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29179 = cljs.core.keyword_identical_QMARK_;
var expr__29180 = k__5478__auto__;
if(cljs.core.truth_((pred__29179.cljs$core$IFn$_invoke$arity$2 ? pred__29179.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__29180) : pred__29179.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__29180)))){
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(G__29105,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(self__.config,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29105),null));
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29105){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(self__.config,G__29105,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null)], null);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.cljs$lang$type = true);

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.tool-catalog/DefaultToolPolicyResolver",null,(1),null));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.tool-catalog/DefaultToolPolicyResolver");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.tool-catalog/DefaultToolPolicyResolver.
 */
knoxx.backend.infra.agent.tool_catalog.__GT_DefaultToolPolicyResolver = (function knoxx$backend$infra$agent$tool_catalog$__GT_DefaultToolPolicyResolver(config){
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(config,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.tool-catalog/DefaultToolPolicyResolver, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.tool_catalog.map__GT_DefaultToolPolicyResolver = (function knoxx$backend$infra$agent$tool_catalog$map__GT_DefaultToolPolicyResolver(G__29127){
var extmap__5511__auto__ = (function (){var G__29186 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__29127,new cljs.core.Keyword(null,"config","config",994861415));
if(cljs.core.record_QMARK_(G__29127)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29186);
} else {
return G__29186;
}
})();
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolPolicyResolver(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__29127),null,cljs.core.not_empty(extmap__5511__auto__),null));
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
 * @implements {knoxx.backend.infra.agent.tool_catalog.IToolCatalog}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog = (function (runtime,config,__meta,__extmap,__hash){
this.runtime = runtime;
this.config = config;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29188,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29192 = k29188;
var G__29192__$1 = (((G__29192 instanceof cljs.core.Keyword))?G__29192.fqn:null);
switch (G__29192__$1) {
case "runtime":
return self__.runtime;

break;
case "config":
return self__.config;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29188,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29193){
var vec__29194 = p__29193;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29194,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29194,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.tool-catalog.DefaultToolCatalog{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29187){
var self__ = this;
var G__29187__$1 = this;
return (new cljs.core.RecordIter((0),G__29187__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.Keyword(null,"config","config",994861415)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(self__.runtime,self__.config,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1646686634 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29189,other29190){
var self__ = this;
var this29189__$1 = this;
return (((!((other29190 == null)))) && ((((this29189__$1.constructor === other29190.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29189__$1.runtime,other29190.runtime)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29189__$1.config,other29190.config)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29189__$1.__extmap,other29190.__extmap)))))))));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(self__.runtime,self__.config,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29188){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29197 = k29188;
var G__29197__$1 = (((G__29197 instanceof cljs.core.Keyword))?G__29197.fqn:null);
switch (G__29197__$1) {
case "runtime":
case "config":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29188);

}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29187){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29198 = cljs.core.keyword_identical_QMARK_;
var expr__29199 = k__5478__auto__;
if(cljs.core.truth_((pred__29198.cljs$core$IFn$_invoke$arity$2 ? pred__29198.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__29199) : pred__29198.call(null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__29199)))){
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(G__29187,self__.config,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__29198.cljs$core$IFn$_invoke$arity$2 ? pred__29198.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__29199) : pred__29198.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__29199)))){
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(self__.runtime,G__29187,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(self__.runtime,self__.config,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29187),null));
}
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29187){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(self__.runtime,self__.config,G__29187,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.knoxx$backend$infra$agent$tool_catalog$IToolCatalog$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.prototype.knoxx$backend$infra$agent$tool_catalog$IToolCatalog$available_tools$arity$2 = (function (_,p__29201){
var self__ = this;
var map__29202 = p__29201;
var map__29202__$1 = cljs.core.__destructure_map(map__29202);
var auth_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29202__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325));
var agent_spec = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29202__$1,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541));
var ___$1 = this;
var allowed = knoxx.backend.infra.agent.tool_catalog.allowed_tool_ids(self__.config,auth_context,agent_spec);
var tool_auth_context = knoxx.backend.infra.agent.tool_catalog.effective_tool_auth_context(auth_context,allowed);
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"allowed-tool-ids","allowed-tool-ids",1814920623),allowed,new cljs.core.Keyword(null,"tool-auth-context","tool-auth-context",1446601620),tool_auth_context,new cljs.core.Keyword(null,"builtin-tools","builtin-tools",-436520367),knoxx.backend.infra.agent.tool_catalog.builtin_tools(self__.runtime,self__.config,tool_auth_context,agent_spec),new cljs.core.Keyword(null,"custom-tools","custom-tools",-1003562280),knoxx.backend.infra.agent.tool_catalog.custom_tools(self__.runtime,self__.config,tool_auth_context,agent_spec,allowed)], null);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"runtime","runtime",308957531,null),new cljs.core.Symbol(null,"config","config",-1659574354,null)], null);
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.cljs$lang$type = true);

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.tool-catalog/DefaultToolCatalog",null,(1),null));
}));

(knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.tool-catalog/DefaultToolCatalog");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.tool-catalog/DefaultToolCatalog.
 */
knoxx.backend.infra.agent.tool_catalog.__GT_DefaultToolCatalog = (function knoxx$backend$infra$agent$tool_catalog$__GT_DefaultToolCatalog(runtime,config){
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(runtime,config,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.tool-catalog/DefaultToolCatalog, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.tool_catalog.map__GT_DefaultToolCatalog = (function knoxx$backend$infra$agent$tool_catalog$map__GT_DefaultToolCatalog(G__29191){
var extmap__5511__auto__ = (function (){var G__29203 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__29191,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"config","config",994861415)], 0));
if(cljs.core.record_QMARK_(G__29191)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29203);
} else {
return G__29203;
}
})();
return (new knoxx.backend.infra.agent.tool_catalog.DefaultToolCatalog(new cljs.core.Keyword(null,"runtime","runtime",-1331573996).cljs$core$IFn$_invoke$arity$1(G__29191),new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__29191),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.tool_catalog.tool_policy_resolver = (function knoxx$backend$infra$agent$tool_catalog$tool_policy_resolver(config){
return knoxx.backend.infra.agent.tool_catalog.__GT_DefaultToolPolicyResolver(config);
});
knoxx.backend.infra.agent.tool_catalog.tool_catalog = (function knoxx$backend$infra$agent$tool_catalog$tool_catalog(runtime,config){
return knoxx.backend.infra.agent.tool_catalog.__GT_DefaultToolCatalog(runtime,config);
});

//# sourceMappingURL=knoxx.backend.infra.agent.tool_catalog.js.map
