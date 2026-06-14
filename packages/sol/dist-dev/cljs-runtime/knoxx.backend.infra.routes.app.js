import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.routes.admin.js";
import "./knoxx.backend.infra.routes.actors.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.infra.agent.runtime.js";
import "./knoxx.backend.infra.agent.runner.js";
import "./knoxx.backend.infra.agent.service.js";
import "./knoxx.backend.shape.agent.js";
import "./knoxx.backend.infra.agent.policy.js";
import "./knoxx.backend.infra.agent.turn.js";
import "./knoxx.backend.shape.app_shapes.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.core_memory.js";
import "./knoxx.backend.infra.routes.resources.js";
import "./knoxx.backend.domain.contracts.sources.js";
import "./knoxx.backend.infra.document_state.js";
import "./knoxx.backend.infra.routes.documents.js";
import "./knoxx.backend.law.guards.js";
import "./knoxx.backend.infra.clients.proxx.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.infra.routes.memory.js";
import "./knoxx.backend.infra.routes.models.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.shape.parse.js";
import "./knoxx.backend.domain.time.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.stores.session_titles.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.infra.routes.tools.js";
import "./knoxx.backend.infra.tooling.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.infra.routes.voice.js";
import "./knoxx.backend.infra.routes.workspace_media.js";
import "./knoxx.backend.infra.routes.studio.js";
import "./knoxx.backend.infra.routes.translation.js";
import "./knoxx.backend.extern.promise.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.routes.app');
knoxx.backend.infra.routes.app.send_agent_turn_best_effort_BANG_ = (async function knoxx$backend$infra$routes$app$send_agent_turn_best_effort_BANG_(runtime,config,body,log_label){
try{return (await knoxx.backend.infra.agent.service.send_agent_turn_BANG_(runtime,config,body));
}catch (e32026){var err = e32026;
console.error(log_label,err);

return knoxx.backend.infra.agent.runner.log_and_record_async_spawn_error_BANG_(body,err);
}});
knoxx.backend.infra.routes.app.queue_chat_start_BANG_ = (async function knoxx$backend$infra$routes$app$queue_chat_start_BANG_(runtime,config,reply,agent_ctx,policy_model,body,accepted_response){
try{(await knoxx.backend.infra.agent.policy.validate_chat_policy_BANG_(agent_ctx,policy_model));

knoxx.backend.infra.routes.app.send_agent_turn_best_effort_BANG_(runtime,config,body,"Async agent chat failed");

return knoxx.backend.infra.http.json_response_BANG_(reply,(202),accepted_response);
}catch (e32027){var err = e32027;
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(429));
}});
knoxx.backend.infra.routes.app.queue_direct_start_BANG_ = (async function knoxx$backend$infra$routes$app$queue_direct_start_BANG_(runtime,config,reply,agent_ctx,policy_model,body,accepted_response,log_label){
try{(await knoxx.backend.infra.agent.policy.validate_chat_policy_BANG_(agent_ctx,policy_model));

knoxx.backend.infra.routes.app.send_agent_turn_best_effort_BANG_(runtime,config,body,log_label);

return knoxx.backend.infra.http.json_response_BANG_(reply,(202),accepted_response);
}catch (e32029){var err = e32029;
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(429));
}});
knoxx.backend.infra.routes.app.compact_agent_spec_overrides = (function knoxx$backend$infra$routes$app$compact_agent_spec_overrides(agent_spec){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.remove.cljs$core$IFn$_invoke$arity$1((function (p__32040){
var vec__32049 = p__32040;
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32049,(0),null);
var value = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32049,(1),null);
return (((value == null)) || (((((typeof value === 'string') && (clojure.string.blank_QMARK_(value)))) || (((cljs.core.sequential_QMARK_(value)) && (cljs.core.empty_QMARK_(value)))))));
})),agent_spec);
});
knoxx.backend.infra.routes.app.merged_agent_spec = (function knoxx$backend$infra$routes$app$merged_agent_spec(config,parsed){
var requested = knoxx.backend.infra.routes.app.compact_agent_spec_overrides((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var requested_actor_id = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(requested,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.tooling.default_actor_id(config);
}
})();
var requested_contract_id = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(requested,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.tooling.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,requested_actor_id);
}
})();
var resolved = knoxx.backend.infra.tooling.effective_agent_contract.cljs$core$IFn$_invoke$arity$3(config,requested_contract_id,requested_actor_id);
var resolved_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(resolved);
var merged = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.select_keys(resolved,new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.Keyword(null,"contract-actor-ids","contract-actor-ids",1506474817),new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082),new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557),new cljs.core.Keyword(null,"sources","sources",-321166424)], null)),requested], 0));
var runtime_sources = knoxx.backend.domain.contracts.sources.compose_source_refs.cljs$core$IFn$_invoke$arity$variadic(config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(resolved),new cljs.core.Keyword(null,"sources","sources",-321166424).cljs$core$IFn$_invoke$arity$1(requested)], 0));
var G__32057 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(merged,new cljs.core.Keyword(null,"sources","sources",-321166424),runtime_sources);
var G__32057__$1 = (cljs.core.truth_(requested_actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32057,new cljs.core.Keyword(null,"actor-id","actor-id",897721067),requested_actor_id):G__32057);
var G__32057__$2 = ((cljs.core.seq(new cljs.core.Keyword(null,"contract-actor-ids","contract-actor-ids",1506474817).cljs$core$IFn$_invoke$arity$1(resolved)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32057__$1,new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049),new cljs.core.Keyword(null,"contract-actor-ids","contract-actor-ids",1506474817).cljs$core$IFn$_invoke$arity$1(resolved)):G__32057__$1);
if(cljs.core.truth_(resolved_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32057__$2,new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),resolved_id);
} else {
return G__32057__$2;
}
});
knoxx.backend.infra.routes.app.requested_role = (function knoxx$backend$infra$routes$app$requested_role(parsed){
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"role","role",-736691072)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__32058 = new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(parsed);
var G__32058__$1 = (((G__32058 == null))?null:new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(G__32058));
var G__32058__$2 = (((G__32058__$1 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32058__$1)));
var G__32058__$3 = (((G__32058__$2 == null))?null:clojure.string.trim(G__32058__$2));
if((G__32058__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__32058__$3);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var G__32059 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270)], null));
var G__32059__$1 = (((G__32059 == null))?null:cljs.core.seq(G__32059));
var G__32059__$2 = (((G__32059__$1 == null))?null:cljs.core.first(G__32059__$1));
var G__32059__$3 = (((G__32059__$2 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32059__$2)));
var G__32059__$4 = (((G__32059__$3 == null))?null:clojure.string.trim(G__32059__$3));
if((G__32059__$4 == null)){
return null;
} else {
return cljs.core.not_empty(G__32059__$4);
}
}
}
});
knoxx.backend.infra.routes.app.allow_policy_QMARK_ = (function knoxx$backend$infra$routes$app$allow_policy_QMARK_(policy){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("allow",(function (){var G__32060 = new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(policy);
var G__32060__$1 = (((G__32060 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32060)));
if((G__32060__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__32060__$1);
}
})());
});
knoxx.backend.infra.routes.app.tool_policy_id = (function knoxx$backend$infra$routes$app$tool_policy_id(policy){
var G__32061 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"toolId","toolId",-1935596543).cljs$core$IFn$_invoke$arity$1(policy);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(policy);
}
})();
var G__32061__$1 = (((G__32061 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32061)));
var G__32061__$2 = (((G__32061__$1 == null))?null:clojure.string.trim(G__32061__$1));
if((G__32061__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__32061__$2);
}
});
knoxx.backend.infra.routes.app.ctx_tool_policies = (function knoxx$backend$infra$routes$app$ctx_tool_policies(ctx){
return cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})());
});
knoxx.backend.infra.routes.app.parsed_auth_tool_policies = (function knoxx$backend$infra$routes$app$parsed_auth_tool_policies(parsed){
return cljs.core.vec((function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})());
});
knoxx.backend.infra.routes.app.requested_tool_policies = (function knoxx$backend$infra$routes$app$requested_tool_policies(parsed){
var from_spec = cljs.core.vec((function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var from_auth = knoxx.backend.infra.routes.app.parsed_auth_tool_policies(parsed);
if(cljs.core.seq(from_spec)){
return from_spec;
} else {
if(cljs.core.seq(from_auth)){
return from_auth;
} else {
return cljs.core.PersistentVector.EMPTY;

}
}
});
knoxx.backend.infra.routes.app.effective_tool_policies = (function knoxx$backend$infra$routes$app$effective_tool_policies(ctx,parsed){
var requested = knoxx.backend.infra.routes.app.requested_tool_policies(parsed);
var context_policies = knoxx.backend.infra.routes.app.ctx_tool_policies(ctx);
if((((ctx == null)) && (cljs.core.seq(requested)))){
return requested;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = (ctx == null);
if(and__5160__auto__){
return new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(parsed);
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.infra.routes.app.parsed_auth_tool_policies(parsed);
} else {
if(cljs.core.empty_QMARK_(requested)){
return context_policies;
} else {
if(knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)){
return requested;
} else {
var allowed = cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.app.tool_policy_id,cljs.core.filter.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.app.allow_policy_QMARK_,context_policies)));
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__32064_SHARP_){
return cljs.core.contains_QMARK_(allowed,knoxx.backend.infra.routes.app.tool_policy_id(p1__32064_SHARP_));
}),requested));

}
}
}
}
});
knoxx.backend.infra.routes.app.effective_auth_context = (function knoxx$backend$infra$routes$app$effective_auth_context(ctx,parsed){
var base = (function (){var or__5162__auto__ = ctx;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"auth-context","auth-context",320032325).cljs$core$IFn$_invoke$arity$1(parsed);
}
})();
var requested_actor_id = (function (){var G__32081 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"actor-id","actor-id",897721067)], null));
var G__32081__$1 = (((G__32081 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32081)));
var G__32081__$2 = (((G__32081__$1 == null))?null:clojure.string.trim(G__32081__$1));
if((G__32081__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__32081__$2);
}
})();
var requested_role_slug = knoxx.backend.infra.routes.app.requested_role(parsed);
var role_slugs = (cljs.core.truth_((function (){var and__5160__auto__ = (base == null);
if(and__5160__auto__){
return requested_role_slug;
} else {
return and__5160__auto__;
}
})())?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [requested_role_slug], null):(cljs.core.truth_((function (){var and__5160__auto__ = requested_role_slug;
if(cljs.core.truth_(and__5160__auto__)){
return ((knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx)) || (cljs.core.contains_QMARK_(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentHashSet.EMPTY,(function (){var or__5162__auto____$1 = new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270).cljs$core$IFn$_invoke$arity$1(base);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),requested_role_slug)));
} else {
return and__5160__auto__;
}
})())?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [requested_role_slug], null):cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270).cljs$core$IFn$_invoke$arity$1(base);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())
));
var tool_policies = knoxx.backend.infra.routes.app.effective_tool_policies(ctx,parsed);
var resource_policies = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364).cljs$core$IFn$_invoke$arity$1(base);
}
}
})();
if(cljs.core.truth_((function (){var or__5162__auto__ = base;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = requested_actor_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = requested_role_slug;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = cljs.core.seq(tool_policies);
if(or__5162__auto____$3){
return or__5162__auto____$3;
} else {
return resource_policies;
}
}
}
}
})())){
var G__32082 = (function (){var or__5162__auto__ = base;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var G__32082__$1 = (cljs.core.truth_(requested_actor_id)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32082,new cljs.core.Keyword(null,"actorId","actorId",989542370),requested_actor_id):G__32082);
var G__32082__$2 = ((cljs.core.seq(role_slugs))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32082__$1,new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270),role_slugs):G__32082__$1);
var G__32082__$3 = ((((cljs.core.seq(tool_policies)) || ((!((base == null))))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32082__$2,new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),tool_policies):G__32082__$2);
if(cljs.core.truth_(resource_policies)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32082__$3,new cljs.core.Keyword(null,"resourcePolicies","resourcePolicies",-1399026364),resource_policies);
} else {
return G__32082__$3;
}
} else {
return null;
}
});
knoxx.backend.infra.routes.app.auth_context_with_actor = (function knoxx$backend$infra$routes$app$auth_context_with_actor(ctx,actor_id){
var temp__5823__auto__ = (function (){var G__32083 = actor_id;
var G__32083__$1 = (((G__32083 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32083)));
var G__32083__$2 = (((G__32083__$1 == null))?null:clojure.string.trim(G__32083__$1));
if((G__32083__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__32083__$2);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var actor_id_STAR_ = temp__5823__auto__;
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var or__5162__auto__ = ctx;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),new cljs.core.Keyword(null,"actorId","actorId",989542370),actor_id_STAR_);
} else {
return ctx;
}
});
knoxx.backend.infra.routes.app.active_run_summary = (function knoxx$backend$infra$routes$app$active_run_summary(run,session){
var messages = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"request_messages","request_messages",-1334174565).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var user_msg = cljs.core.some((function (p1__32112_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",(function (){var G__32117 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__32112_SHARP_);
if((G__32117 == null)){
return null;
} else {
return clojure.string.lower_case(G__32117);
}
})())){
return p1__32112_SHARP_;
} else {
return null;
}
}),cljs.core.reverse(messages));
var conversation_id = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(run);
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"input_tokens","input_tokens",490797322),new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067),new cljs.core.Keyword(null,"resource_policies","resource_policies",-1190579829),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"latest_user_message","latest_user_message",278994764),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),new cljs.core.Keyword(null,"tokens_per_s","tokens_per_s",1005457231),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"event_count","event_count",-1889732422),new cljs.core.Keyword(null,"latest_event","latest_event",-573333605),new cljs.core.Keyword(null,"active_turn_registered","active_turn_registered",-892675300),new cljs.core.Keyword(null,"tool_receipt_count","tool_receipt_count",-628689028),new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"output_tokens","output_tokens",-1339146498),new cljs.core.Keyword(null,"model","model",331153215)],[cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (b){
return cljs.core.select_keys(b,new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"toolName","toolName",869440778),new cljs.core.Keyword(null,"toolCallId","toolCallId",58445580),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"at","at",1476951349),new cljs.core.Keyword(null,"inputPreview","inputPreview",-809122474),new cljs.core.Keyword(null,"outputPreview","outputPreview",-747507208),new cljs.core.Keyword(null,"isError","isError",-1727958473)], null));
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114).cljs$core$IFn$_invoke$arity$1(run),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
return cljs.core.select_keys(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(p,new cljs.core.Keyword(null,"data","data",-232669377)),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"url","url",276297046),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(user_msg);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"input_tokens","input_tokens",490797322).cljs$core$IFn$_invoke$arity$1(run),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (r){
return cljs.core.select_keys(r,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"input_preview","input_preview",2048529734),new cljs.core.Keyword(null,"result_preview","result_preview",215554859),new cljs.core.Keyword(null,"started_at","started_at",856896776),new cljs.core.Keyword(null,"ended_at","ended_at",1150683059)], null));
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(run,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"resources","resources",1632806811),new cljs.core.Keyword(null,"agentResourcePolicies","agentResourcePolicies",-1357376229)], null)),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(user_msg),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(run),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(run,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050)], null)),new cljs.core.Keyword(null,"tokens_per_s","tokens_per_s",1005457231).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run),cljs.core.boolean$(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session)),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(run),cljs.core.count((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"events","events",1792552201).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),(function (){var G__32118 = new cljs.core.Keyword(null,"events","events",1792552201).cljs$core$IFn$_invoke$arity$1(run);
var G__32118__$1 = (((G__32118 == null))?null:cljs.core.last(G__32118));
if((G__32118__$1 == null)){
return null;
} else {
return cljs.core.select_keys(G__32118__$1,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),new cljs.core.Keyword(null,"preview","preview",451279890),new cljs.core.Keyword(null,"at","at",1476951349)], null));
}
})(),cljs.core.boolean$((function (){var and__5160__auto__ = conversation_id;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.voice.turn_control.active_turn(conversation_id);
} else {
return and__5160__auto__;
}
})()),cljs.core.count((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"output_tokens","output_tokens",-1339146498).cljs$core$IFn$_invoke$arity$1(run),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(run)]);
});
knoxx.backend.infra.routes.app.active_session_summary = (function knoxx$backend$infra$routes$app$active_session_summary(session){
var messages = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var user_msg = cljs.core.some((function (p1__32119_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("user",(function (){var G__32120 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__32119_SHARP_);
if((G__32120 == null)){
return null;
} else {
return clojure.string.lower_case(G__32120);
}
})())){
return p1__32119_SHARP_;
} else {
return null;
}
}),cljs.core.reverse(messages));
var conversation_id = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"resource_policies","resource_policies",-1190579829),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"latest_user_message","latest_user_message",278994764),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"event_count","event_count",-1889732422),new cljs.core.Keyword(null,"latest_event","latest_event",-573333605),new cljs.core.Keyword(null,"active_turn_registered","active_turn_registered",-892675300),new cljs.core.Keyword(null,"tool_receipt_count","tool_receipt_count",-628689028),new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"resource_policies","resource_policies",-1190579829).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(user_msg),conversation_id,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050).cljs$core$IFn$_invoke$arity$1(session);
}
})(),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session),cljs.core.boolean$(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session)),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(session),(0),null,cljs.core.boolean$((function (){var and__5160__auto__ = conversation_id;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.domain.voice.turn_control.active_turn(conversation_id);
} else {
return and__5160__auto__;
}
})()),(0),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(session)]);
});
knoxx.backend.infra.routes.app.live_session_items = (function knoxx$backend$infra$routes$app$live_session_items(run_items,include_all_QMARK_,sessions){
var run_session_ids = cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"session_id","session_id",1584799627),run_items));
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.app.active_session_summary,cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__32122_SHARP_){
return cljs.core.contains_QMARK_(run_session_ids,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(p1__32122_SHARP_));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__32121_SHARP_){
var or__5162__auto__ = include_all_QMARK_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__32121_SHARP_));
}
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,sessions)))));
});
knoxx.backend.infra.routes.app.active_item_time_ms = (function knoxx$backend$infra$routes$app$active_item_time_ms(item){
var value = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(item);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(item);
}
})();
if(typeof value === 'number'){
return value;
} else {
if(typeof value === 'string'){
var parsed = Date.parse(value);
if(cljs.core.truth_(isNaN(parsed))){
return (0);
} else {
return parsed;
}
} else {
return (0);

}
}
});
knoxx.backend.infra.routes.app.sort_active_items = (function knoxx$backend$infra$routes$app$sort_active_items(limit,items){
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.app.active_item_time_ms,(function (p1__32124_SHARP_,p2__32123_SHARP_){
return cljs.core.compare(p2__32123_SHARP_,p1__32124_SHARP_);
}),items)));
});
knoxx.backend.infra.routes.app.live_active_agent_summaries_BANG_ = (async function knoxx$backend$infra$routes$app$live_active_agent_summaries_BANG_(limit,include_all_QMARK_){
var limit__$1 = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(await (async function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (25);
}
})()));
var sessions_by_id = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (session){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),session], null);
})),knoxx.backend.infra.stores.mongo_session_store.active_session_snapshots());
var run_items = cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (run){
return knoxx.backend.infra.routes.app.active_run_summary(run,cljs.core.get.cljs$core$IFn$_invoke$arity$2(sessions_by_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run)));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__32126_SHARP_){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__32126_SHARP_));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32125_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),p1__32125_SHARP_);
}),cljs.core.deref(knoxx.backend.domain.action.run_state.run_order_STAR_))))));
return knoxx.backend.infra.routes.app.sort_active_items(limit__$1,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(run_items,knoxx.backend.infra.routes.app.live_session_items(run_items,include_all_QMARK_,(await knoxx.backend.infra.stores.mongo_session_store.list_active_sessions.cljs$core$IFn$_invoke$arity$0()))));
});
knoxx.backend.infra.routes.app.SESSION_RECOVERY_STALE_MS = (60000);
/**
 * If turn-control has an entry for conversation-id but the underlying Proxx
 * session shows no active streaming or current turn, the entry is a ghost
 * from a previous hung run. Unregister it so zombie recovery can proceed.
 */
knoxx.backend.infra.routes.app.clear_ghost_turn_BANG_ = (function knoxx$backend$infra$routes$app$clear_ghost_turn_BANG_(conversation_id){
var agent_session = knoxx.backend.infra.agent.service.active_agent_session(conversation_id);
var active_streaming_QMARK_ = (function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})();
var active_turn_QMARK_ = (function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
try{return (!((knoxx.backend.shape.agent.current_turn(agent_session) == null)));
}catch (e32127){if((e32127 instanceof Error)){
var _ = e32127;
return false;
} else {
throw e32127;

}
}} else {
return and__5160__auto__;
}
})();
if(((cljs.core.not(active_streaming_QMARK_)) && (cljs.core.not(active_turn_QMARK_)))){
return knoxx.backend.domain.voice.turn_control.unregister_active_turn_BANG_.cljs$core$IFn$_invoke$arity$1(conversation_id);
} else {
return null;
}
});
knoxx.backend.infra.routes.app.runtime_processing_session_QMARK_ = (function knoxx$backend$infra$routes$app$runtime_processing_session_QMARK_(conversation_id){
var agent_session = knoxx.backend.infra.agent.service.active_agent_session(conversation_id);
var active_streaming_QMARK_ = (function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})();
var active_turn_QMARK_ = (function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
try{return (!((knoxx.backend.shape.agent.current_turn(agent_session) == null)));
}catch (e32128){if((e32128 instanceof Error)){
var _ = e32128;
return false;
} else {
throw e32128;

}
}} else {
return and__5160__auto__;
}
})();
var registered_turn_QMARK_ = (!((knoxx.backend.domain.voice.turn_control.active_turn(conversation_id) == null)));
var or__5162__auto__ = active_streaming_QMARK_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = active_turn_QMARK_;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return registered_turn_QMARK_;
}
}
});
knoxx.backend.infra.routes.app.parse_iso_ms = (function knoxx$backend$infra$routes$app$parse_iso_ms(value){
var parsed = Date.parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(cljs.core.truth_(isNaN(parsed))){
return null;
} else {
return parsed;
}
});
knoxx.backend.infra.routes.app.latest_run_event_BANG_ = (async function knoxx$backend$infra$routes$app$latest_run_event_BANG_(run_id){
var run_id__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(run_id__$1)){
return null;
} else {
if(cljs.core.seq(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [run_id__$1,new cljs.core.Keyword(null,"events","events",1792552201)], null)))){
return cljs.core.last(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [run_id__$1,new cljs.core.Keyword(null,"events","events",1792552201)], null)));
} else {
return null;

}
}
});
knoxx.backend.infra.routes.app.stale_running_session_QMARK_ = (function knoxx$backend$infra$routes$app$stale_running_session_QMARK_(session,latest_event){
var stamp = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"at","at",1476951349).cljs$core$IFn$_invoke$arity$1(latest_event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(session);
}
}
})();
var stamp_ms = knoxx.backend.infra.routes.app.parse_iso_ms(stamp);
return (((stamp_ms == null)) || (((Date.now() - stamp_ms) > knoxx.backend.infra.routes.app.SESSION_RECOVERY_STALE_MS)));
});
knoxx.backend.infra.routes.app.dev_hmr_response = (function knoxx$backend$infra$routes$app$dev_hmr_response(){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"version","version",425292698),"v2",new cljs.core.Keyword(null,"at","at",1476951349),knoxx.backend.domain.time.now_iso()], null);
});
knoxx.backend.infra.routes.app.proxy_err = (function knoxx$backend$infra$routes$app$proxy_err(reply,prefix,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.fetch_json_ok = (function knoxx$backend$infra$routes$app$fetch_json_ok(reply,resp){
return knoxx.backend.infra.http.json_response_BANG_(reply,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (200);
}
})(),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
});
knoxx.backend.infra.routes.app.fetch_json_err = (function knoxx$backend$infra$routes$app$fetch_json_err(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),err.message], null));
});
knoxx.backend.infra.routes.app.fetch_json_err_detail = (function knoxx$backend$infra$routes$app$fetch_json_err_detail(reply,prefix,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.health_deps_ok = (function knoxx$backend$infra$routes$app$health_deps_ok(reply,proxx_configured,openplanner_configured,p__32129){
var vec__32130 = p__32129;
var proxx_res = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32130,(0),null);
var openplanner_res = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32130,(1),null);
var proxx_ok = (function (){var and__5160__auto__ = proxx_configured;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(proxx_res);
} else {
return and__5160__auto__;
}
})();
var openplanner_ok = (function (){var and__5160__auto__ = openplanner_configured;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(openplanner_res);
} else {
return and__5160__auto__;
}
})();
var healthy = (function (){var and__5160__auto__ = proxx_ok;
if(cljs.core.truth_(and__5160__auto__)){
return openplanner_ok;
} else {
return and__5160__auto__;
}
})();
return knoxx.backend.infra.http.json_response_BANG_(reply,(cljs.core.truth_(healthy)?(200):(503)),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),(cljs.core.truth_(healthy)?"ok":"unhealthy"),new cljs.core.Keyword(null,"service","service",-1963054559),"knoxx-backend-cljs",new cljs.core.Keyword(null,"dependencies","dependencies",1108064605),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"proxx","proxx",289303663),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"configured","configured",-884777889),proxx_configured,new cljs.core.Keyword(null,"reachable","reachable",-1495191549),cljs.core.boolean$(proxx_ok),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(proxx_res),new cljs.core.Keyword(null,"detail","detail",-1545345025),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(proxx_res)], null),new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"configured","configured",-884777889),openplanner_configured,new cljs.core.Keyword(null,"reachable","reachable",-1495191549),cljs.core.boolean$(openplanner_ok),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(openplanner_res),new cljs.core.Keyword(null,"detail","detail",-1545345025),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(openplanner_res)], null)], null)], null));
});
knoxx.backend.infra.routes.app.health_deps_err = (function knoxx$backend$infra$routes$app$health_deps_err(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(503),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"unhealthy",new cljs.core.Keyword(null,"service","service",-1963054559),"knoxx-backend-cljs",new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.knoxx_health_ok = (function knoxx$backend$infra$routes$app$knoxx_health_ok(reply,config,proxx_configured,openplanner_configured,p__32133){
var vec__32134 = p__32133;
var proxx_res = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32134,(0),null);
var openplanner_res = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32134,(1),null);
var proxx_ok = (function (){var and__5160__auto__ = proxx_configured;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(proxx_res);
} else {
return and__5160__auto__;
}
})();
var openplanner_ok = (function (){var and__5160__auto__ = openplanner_configured;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(openplanner_res);
} else {
return and__5160__auto__;
}
})();
var healthy = (function (){var and__5160__auto__ = (function (){var or__5162__auto__ = cljs.core.not(proxx_configured);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return proxx_ok;
}
})();
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = (function (){var or__5162__auto__ = cljs.core.not(openplanner_configured);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return openplanner_ok;
}
})();
if(cljs.core.truth_(and__5160__auto____$1)){
var or__5162__auto__ = proxx_configured;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return openplanner_configured;
}
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})();
return knoxx.backend.infra.http.json_response_BANG_(reply,(cljs.core.truth_(healthy)?(200):(503)),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"reachable","reachable",-1495191549),healthy,new cljs.core.Keyword(null,"configured","configured",-884777889),cljs.core.boolean$((function (){var or__5162__auto__ = proxx_configured;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return openplanner_configured;
}
})()),new cljs.core.Keyword(null,"base_url","base_url",-1764155256),new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"status_code","status_code",-572644263),(cljs.core.truth_(healthy)?(200):(503)),new cljs.core.Keyword(null,"status","status",-1997798413),(cljs.core.truth_(healthy)?"ok":"unhealthy"),new cljs.core.Keyword(null,"details","details",1956795411),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"mode","mode",654403691),"shadow-cljs-eta-mu-sdk",new cljs.core.Keyword(null,"status","status",-1997798413),(cljs.core.truth_(healthy)?"ok":"unhealthy"),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"collection","collection",-683361892),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"collection-name","collection-name",600435477).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"pointsCount","pointsCount",363767063),null], null),new cljs.core.Keyword(null,"dependencies","dependencies",1108064605),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"proxx","proxx",289303663),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"configured","configured",-884777889),proxx_configured,new cljs.core.Keyword(null,"reachable","reachable",-1495191549),cljs.core.boolean$(proxx_ok),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(proxx_res),new cljs.core.Keyword(null,"detail","detail",-1545345025),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(proxx_res)], null),new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"configured","configured",-884777889),openplanner_configured,new cljs.core.Keyword(null,"reachable","reachable",-1495191549),cljs.core.boolean$(openplanner_ok),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(openplanner_res),new cljs.core.Keyword(null,"detail","detail",-1545345025),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(openplanner_res)], null)], null)], null)], null));
});
knoxx.backend.infra.routes.app.knoxx_health_err = (function knoxx$backend$infra$routes$app$knoxx_health_err(reply,config,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(503),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"reachable","reachable",-1495191549),false,new cljs.core.Keyword(null,"configured","configured",-884777889),true,new cljs.core.Keyword(null,"base_url","base_url",-1764155256),new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"status_code","status_code",-572644263),(503),new cljs.core.Keyword(null,"status","status",-1997798413),"unhealthy",new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.data_health_ok = (function knoxx$backend$infra$routes$app$data_health_ok(reply,results){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"services","services",970478783),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(0)),new cljs.core.Keyword(null,"proxx","proxx",289303663),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(1)),new cljs.core.Keyword(null,"ingestion","ingestion",1555117680),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(2)),new cljs.core.Keyword(null,"graph-weaver","graph-weaver",1931242055),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(3)),new cljs.core.Keyword(null,"shuvcrawl","shuvcrawl",1133487479),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(4)),new cljs.core.Keyword(null,"vexx","vexx",1931567209),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(5)),new cljs.core.Keyword(null,"eros-eris-field-app","eros-eris-field-app",-55973265),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(6)),new cljs.core.Keyword(null,"myrmex","myrmex",-95374765),cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(7))], null)], null));
});
knoxx.backend.infra.routes.app.data_health_err = (function knoxx$backend$infra$routes$app$data_health_err(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),err.message], null));
});
knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_ = (async function knoxx$backend$infra$routes$app$send_knoxx_proxy_BANG_(config,request,reply,method,path){
try{return knoxx.backend.infra.http.send_fetch_response_BANG_(reply,(await knoxx.backend.infra.http.forward_knoxx_request_BANG_(config,request,method,path,null)));
}catch (e32137){var err = e32137;
return knoxx.backend.infra.routes.app.proxy_err(reply,"Proxy request failed: ",err);
}});
knoxx.backend.infra.routes.app.send_fetch_json_BANG_ = (async function knoxx$backend$infra$routes$app$send_fetch_json_BANG_(reply,target_url,opts,error_handler){
try{return knoxx.backend.infra.routes.app.fetch_json_ok(reply,(await knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2(target_url,opts)));
}catch (e32138){var err = e32138;
return (error_handler.cljs$core$IFn$_invoke$arity$2 ? error_handler.cljs$core$IFn$_invoke$arity$2(reply,err) : error_handler.call(null,reply,err));
}});
knoxx.backend.infra.routes.app.send_fetch_json_detail_BANG_ = (async function knoxx$backend$infra$routes$app$send_fetch_json_detail_BANG_(reply,target_url,opts,prefix){
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,target_url,opts,(function (p1__32139_SHARP_,p2__32140_SHARP_){
return knoxx.backend.infra.routes.app.fetch_json_err_detail(p1__32139_SHARP_,prefix,p2__32140_SHARP_);
}));
});
knoxx.backend.infra.routes.app.send_openplanner_v1_json_BANG_ = (async function knoxx$backend$infra$routes$app$send_openplanner_v1_json_BANG_(config,reply,method,path,body){
try{return knoxx.backend.infra.http.json_response_BANG_(reply,(200),(await knoxx.backend.infra.clients.openplanner.v1_json_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),method,path,body)));
}catch (e32141){var err = e32141;
return knoxx.backend.infra.routes.app.fetch_json_err(reply,err);
}});
knoxx.backend.infra.routes.app.send_json_promise_BANG_ = (async function knoxx$backend$infra$routes$app$send_json_promise_BANG_(reply,request_promise){
try{return knoxx.backend.infra.http.json_response_BANG_(reply,(200),(await request_promise));
}catch (e32142){var err = e32142;
return knoxx.backend.infra.routes.app.fetch_json_err(reply,err);
}});
knoxx.backend.infra.routes.app.send_mongo_collections_BANG_ = (async function knoxx$backend$infra$routes$app$send_mongo_collections_BANG_(config,reply){
var client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
try{var vec__32144 = (await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.clients.openplanner.documents_stats_BANG_(client),knoxx.backend.infra.clients.openplanner.graph_monitoring_BANG_(client)], null)));
var docs = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32144,(0),null);
var graph = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__32144,(1),null);
var G__32147 = reply;
var G__32148 = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"body","body",-2049205669),docs], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"body","body",-2049205669),graph], null)], null);
return (knoxx.backend.infra.routes.app.mongo_collections_ok.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.routes.app.mongo_collections_ok.cljs$core$IFn$_invoke$arity$2(G__32147,G__32148) : knoxx.backend.infra.routes.app.mongo_collections_ok.call(null,G__32147,G__32148));
}catch (e32143){var err = e32143;
return knoxx.backend.infra.routes.app.fetch_json_err(reply,err);
}});
knoxx.backend.infra.routes.app.send_data_browse_BANG_ = (async function knoxx$backend$infra$routes$app$send_data_browse_BANG_(reply,target_url){
try{var resp = (await knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2(target_url,null));
return knoxx.backend.infra.http.json_response_BANG_(reply,(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (resp["status"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (200);
}
}
})()),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (resp["body"]);
}
})()));
}catch (e32149){var err = e32149;
return knoxx.backend.infra.routes.app.fetch_json_err(reply,err);
}});
knoxx.backend.infra.routes.app.write_ingestion_file_BANG_ = (async function knoxx$backend$infra$routes$app$write_ingestion_file_BANG_(reply,absolute_path,content,safe_path){
try{(await shadow.esm.esm_import$node_fs$promises.mkdir(shadow.esm.esm_import$node_path.dirname(absolute_path),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

(await shadow.esm.esm_import$node_fs$promises.writeFile(absolute_path,content,"utf8"));

return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),safe_path], null));
}catch (e32150){var err = e32150;
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Write failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}});
knoxx.backend.infra.routes.app.health_result = (function knoxx$backend$infra$routes$app$health_result(url,resp){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"detail","detail",-1545345025),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null);
});
knoxx.backend.infra.routes.app.health_error_result = (function knoxx$backend$infra$routes$app$health_error_result(url,err){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),err.message,new cljs.core.Keyword(null,"url","url",276297046),url], null);
});
knoxx.backend.infra.routes.app.service_health_check_BANG_ = (async function knoxx$backend$infra$routes$app$service_health_check_BANG_(url,headers){
try{return knoxx.backend.infra.routes.app.health_result(url,(await knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2(url,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"headers","headers",-835030129),(await (async function (){var or__5162__auto__ = headers;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()),new cljs.core.Keyword(null,"method","method",55703592),"GET"], null))));
}catch (e32151){var err = e32151;
return knoxx.backend.infra.routes.app.health_error_result(url,err);
}});
knoxx.backend.infra.routes.app.openplanner_health_check_BANG_ = (async function knoxx$backend$infra$routes$app$openplanner_health_check_BANG_(config){
try{return knoxx.backend.infra.routes.app.health_result("openplanner:/v1/health",(await knoxx.backend.infra.clients.openplanner.health_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config))));
}catch (e32152){var err = e32152;
return knoxx.backend.infra.routes.app.health_error_result("openplanner:/v1/health",err);
}});
knoxx.backend.infra.routes.app.proxx_health_check_BANG_ = (async function knoxx$backend$infra$routes$app$proxx_health_check_BANG_(config){
var url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))+"/health");
try{return knoxx.backend.infra.routes.app.health_result(url,(await knoxx.backend.infra.clients.proxx.health_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config))));
}catch (e32153){var err = e32153;
return knoxx.backend.infra.routes.app.health_error_result(url,err);
}});
knoxx.backend.infra.routes.app.send_data_health_BANG_ = (async function knoxx$backend$infra$routes$app$send_data_health_BANG_(config,reply){
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
try{return knoxx.backend.infra.routes.app.data_health_ok(reply,(await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.routes.app.openplanner_health_check_BANG_(config),knoxx.backend.infra.routes.app.proxx_health_check_BANG_(config),knoxx.backend.infra.routes.app.service_health_check_BANG_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/health"),null),knoxx.backend.infra.routes.app.service_health_check_BANG_("http://127.0.0.1:8796/api/status",null),knoxx.backend.infra.routes.app.service_health_check_BANG_("http://127.0.0.1:3777/health",null),knoxx.backend.infra.routes.app.service_health_check_BANG_("http://127.0.0.1:8787/v1/health",null),knoxx.backend.infra.routes.app.service_health_check_BANG_("http://127.0.0.1:8786/health",null),knoxx.backend.infra.routes.app.service_health_check_BANG_("http://127.0.0.1:8801/health",null)], null))));
}catch (e32154){var err = e32154;
return knoxx.backend.infra.routes.app.data_health_err(reply,err);
}});
knoxx.backend.infra.routes.app.send_knoxx_health_BANG_ = (async function knoxx$backend$infra$routes$app$send_knoxx_health_BANG_(config,reply){
var proxx_configured = (((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))))));
var openplanner_client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
var openplanner_configured = knoxx.backend.infra.clients.openplanner.enabled_QMARK_(openplanner_client);
var proxx_promise = ((proxx_configured)?knoxx.backend.infra.clients.proxx.health_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)):Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"status","status",-1997798413),(503),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Proxx is not configured"], null)], null)));
var openplanner_promise = (cljs.core.truth_(openplanner_configured)?knoxx.backend.infra.clients.openplanner.health_BANG_(openplanner_client):Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"status","status",-1997798413),(503),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null)], null)));
try{return knoxx.backend.infra.routes.app.knoxx_health_ok(reply,config,proxx_configured,openplanner_configured,(await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [proxx_promise,openplanner_promise], null))));
}catch (e32155){var err = e32155;
return knoxx.backend.infra.routes.app.knoxx_health_err(reply,config,err);
}});
knoxx.backend.infra.routes.app.deps = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848),new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954),new cljs.core.Keyword(null,"json-response!","json-response!",103570476),new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000),new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966),new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310),new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615),new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686)],[knoxx.backend.infra.http.request_query_string,knoxx.backend.shape.app_shapes.route_BANG_,null,knoxx.backend.infra.http.json_response_BANG_,knoxx.backend.infra.auth.authz.with_request_context_BANG_,knoxx.backend.infra.http.send_fetch_response_BANG_,null,knoxx.backend.infra.http.error_response_BANG_,knoxx.backend.infra.http.bearer_headers,knoxx.backend.domain.text.clip_text,knoxx.backend.infra.auth.authz.ensure_permission_BANG_,knoxx.backend.infra.http.fetch_json]);
knoxx.backend.infra.routes.app.response_body = (function knoxx$backend$infra$routes$app$response_body(resp){
var or__5162__auto__ = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (resp["body"]);
}
});
knoxx.backend.infra.routes.app.mongo_collections_ok = (function knoxx$backend$infra$routes$app$mongo_collections_ok(reply,results){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"documents","documents",-1582333455),knoxx.backend.infra.routes.app.response_body(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(0))),new cljs.core.Keyword(null,"graph","graph",1558099509),knoxx.backend.infra.routes.app.response_body(cljs.core.nth.cljs$core$IFn$_invoke$arity$2(results,(1)))], null));
});
knoxx.backend.infra.routes.app.undo_session_err = (function knoxx$backend$infra$routes$app$undo_session_err(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.agents_active_ok = (function knoxx$backend$infra$routes$app$agents_active_ok(reply,items){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"runs","runs",-1553997798),items,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(items)], null));
});
knoxx.backend.infra.routes.app.agents_active_err = (function knoxx$backend$infra$routes$app$agents_active_err(reply,err){
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502));
});
knoxx.backend.infra.routes.app.run_events_ok = (function knoxx$backend$infra$routes$app$run_events_ok(reply,run_id,events){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"events","events",1792552201),events,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(events)], null));
});
knoxx.backend.infra.routes.app.run_events_err = (function knoxx$backend$infra$routes$app$run_events_err(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.shibboleth_ok = (function knoxx$backend$infra$routes$app$shibboleth_ok(config,reply,request,body,data){
var session = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var ui_url = (((((!(clojure.string.blank_QMARK_(session_id)))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658).cljs$core$IFn$_invoke$arity$1(config)))))))?knoxx.backend.infra.http.with_query_param(knoxx.backend.infra.http.rewrite_localhost_url(new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658).cljs$core$IFn$_invoke$arity$1(config),request),"session",session_id):"");
if(clojure.string.blank_QMARK_(session_id)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Shibboleth import did not return a session id"], null));
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"ui_url","ui_url",1034204910),ui_url,new cljs.core.Keyword(null,"imported_item_count","imported_item_count",1631884122),cljs.core.count((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null));
}
});
knoxx.backend.infra.routes.app.shibboleth_import_failed = (function knoxx$backend$infra$routes$app$shibboleth_import_failed(reply,resp){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Shibboleth import failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"raw","raw",1604651272).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)));
}
})()))], null));
});
knoxx.backend.infra.routes.app.shibboleth_unreachable = (function knoxx$backend$infra$routes$app$shibboleth_unreachable(reply,err){
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Shibboleth is unreachable: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
});
knoxx.backend.infra.routes.app.detect_zombies = (async function knoxx$backend$infra$routes$app$detect_zombies(conversation_id,session,session_id,queue_turn_BANG_,can_send_result,reply,latest_event){
knoxx.backend.infra.routes.app.clear_ghost_turn_BANG_(conversation_id);

var stalled_QMARK_ = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))) && (((cljs.core.not(knoxx.backend.infra.routes.app.runtime_processing_session_QMARK_(conversation_id))) && (knoxx.backend.infra.routes.app.stale_running_session_QMARK_(session,latest_event)))));
if(stalled_QMARK_){
try{(await knoxx.backend.infra.stores.mongo_session_store.complete_session_BANG_.cljs$core$IFn$_invoke$arity$3(session_id,conversation_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"failed",new cljs.core.Keyword(null,"error","error",-978969032),"Session was stale/zombie; auto-aborted before new turn.",new cljs.core.Keyword(null,"messages","messages",345434482),new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session)], null)));

return (await (queue_turn_BANG_.cljs$core$IFn$_invoke$arity$1 ? queue_turn_BANG_.cljs$core$IFn$_invoke$arity$1("Async direct agent chat failed (recovered from zombie)") : queue_turn_BANG_.call(null,"Async direct agent chat failed (recovered from zombie)")));
}catch (e32156){var err = e32156;
console.error("Failed to abort zombie session",err);

return knoxx.backend.infra.http.json_response_BANG_(reply,(409),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+"Agent is already processing. Zombie recovery failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),new cljs.core.Keyword(null,"code","code",1586293142),"agent_already_processing",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"can_send","can_send",534936371),false], null));
}} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(409),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),(""+"Agent is already processing. "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(can_send_result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"code","code",1586293142),"agent_already_processing",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),cljs.core.boolean$(new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session)),new cljs.core.Keyword(null,"can_send","can_send",534936371),false], null));
}
});
knoxx.backend.infra.routes.app.handle_chat_start = (async function knoxx$backend$infra$routes$app$handle_chat_start(runtime,config,reply,ctx,request){
var node_crypto = shadow.esm.esm_import$node_crypto;
var parsed0 = knoxx.backend.shape.app_shapes.normalize_chat_body(knoxx.backend.infra.http.request_body(request));
var parsed = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parsed0,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),knoxx.backend.infra.routes.app.merged_agent_spec(config,parsed0));
var agent_ctx = knoxx.backend.infra.routes.app.effective_auth_context(ctx,parsed);
var policy_model = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
}
}
})());
var provided_session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(parsed);
var session_id = knoxx.backend.infra.agent.turn.ensure_session_id(provided_session_id);
var conversation_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return node_crypto.randomUUID();
}
})());
var run_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return node_crypto.randomUUID();
}
})());
var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(parsed,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"mode","mode",654403691),"rag",new cljs.core.Keyword(null,"auth-context","auth-context",320032325),agent_ctx], 0));
var accepted_response = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"queued","queued",1701634607),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"model","model",331153215)],[session_id,run_id,session_id,conversation_id,true,run_id,true,conversation_id,(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
}
}
})())]);
var queue_turn_BANG_ = (function (_log_label){
return knoxx.backend.infra.routes.app.queue_chat_start_BANG_(runtime,config,reply,agent_ctx,policy_model,body,accepted_response);
});
if(cljs.core.not(provided_session_id)){
return (await queue_turn_BANG_("Async agent chat failed"));
} else {
try{var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
var can_send_result = knoxx.backend.infra.stores.mongo_session_store.session_can_send_QMARK_(session);
if(cljs.core.truth_(new cljs.core.Keyword(null,"can-send","can-send",-704220819).cljs$core$IFn$_invoke$arity$1(can_send_result))){
var agent_session = knoxx.backend.infra.agent.service.active_agent_session(conversation_id);
var actively_streaming_QMARK_ = (await (async function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})());
if(cljs.core.truth_(actively_streaming_QMARK_)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(409),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Agent is already processing. Specify streamingBehavior steer or followUp to queue the message.",new cljs.core.Keyword(null,"code","code",1586293142),"agent-already-processing",new cljs.core.Keyword(null,"has-active-stream","has-active-stream",1912435974),true,new cljs.core.Keyword(null,"can-send","can-send",-704220819),false], null));
} else {
return (await queue_turn_BANG_("Async agent chat failed"));
}
} else {
var latest_event = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session)))?(await knoxx.backend.infra.routes.app.latest_run_event_BANG_(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session))):null);
return (await knoxx.backend.infra.routes.app.detect_zombies(conversation_id,session,session_id,queue_turn_BANG_,can_send_result,reply,latest_event));
}
}catch (e32157){var err = e32157;
console.error("Session status check failed",err);

return (await queue_turn_BANG_("Async agent chat failed"));
}}
});
knoxx.backend.infra.routes.app.handle_direct_start = (async function knoxx$backend$infra$routes$app$handle_direct_start(runtime,config,reply,ctx,request){
var node_crypto = shadow.esm.esm_import$node_crypto;
var parsed0 = knoxx.backend.shape.app_shapes.normalize_chat_body(knoxx.backend.infra.http.request_body(request));
var parsed = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parsed0,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),knoxx.backend.infra.routes.app.merged_agent_spec(config,parsed0));
var agent_ctx = knoxx.backend.infra.routes.app.effective_auth_context(ctx,parsed);
var policy_model = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(parsed,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
}
}
})());
var provided_session_id = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(parsed);
var session_id = knoxx.backend.infra.agent.turn.ensure_session_id(provided_session_id);
var conversation_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return node_crypto.randomUUID();
}
})());
var run_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(parsed);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return node_crypto.randomUUID();
}
})());
var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(parsed,new cljs.core.Keyword(null,"session-id","session-id",-1147060351),session_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),conversation_id,new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"mode","mode",654403691),"direct",new cljs.core.Keyword(null,"auth-context","auth-context",320032325),agent_ctx], 0));
var accepted_response = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"queued","queued",1701634607),true,new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"model","model",331153215),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
}
}
})())], null);
var queue_turn_BANG_ = (function (log_label){
return knoxx.backend.infra.routes.app.queue_direct_start_BANG_(runtime,config,reply,agent_ctx,policy_model,body,accepted_response,log_label);
});
if(cljs.core.not(provided_session_id)){
return (await queue_turn_BANG_("Async direct agent chat failed"));
} else {
try{var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
var can_send_result = knoxx.backend.infra.stores.mongo_session_store.session_can_send_QMARK_(session);
if(cljs.core.truth_(new cljs.core.Keyword(null,"can-send","can-send",-704220819).cljs$core$IFn$_invoke$arity$1(can_send_result))){
var agent_session = knoxx.backend.infra.agent.service.active_agent_session(conversation_id);
var actively_streaming_QMARK_ = (await (async function (){var and__5160__auto__ = agent_session;
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.shape.agent.streaming_QMARK_(agent_session);
} else {
return and__5160__auto__;
}
})());
if(cljs.core.truth_(actively_streaming_QMARK_)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(409),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Agent is already processing. Specify streamingBehavior ('steer' or 'followUp') to queue the message.",new cljs.core.Keyword(null,"code","code",1586293142),"agent_already_processing",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),true,new cljs.core.Keyword(null,"can_send","can_send",534936371),false], null));
} else {
return (await queue_turn_BANG_("Async direct agent chat failed"));
}
} else {
var latest_event = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session)))?(await knoxx.backend.infra.routes.app.latest_run_event_BANG_(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session))):null);
return (await knoxx.backend.infra.routes.app.detect_zombies(conversation_id,session,session_id,queue_turn_BANG_,can_send_result,reply,latest_event));
}
}catch (e32158){var err = e32158;
console.error("Session status check failed",err);

return (await queue_turn_BANG_("Async direct agent chat failed"));
}}
});
knoxx.backend.infra.routes.app.handle_admin_abort = (async function knoxx$backend$infra$routes$app$handle_admin_abort(reply,_ctx,request){
var raw = knoxx.backend.infra.http.request_body(request);
var requested_conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["conversationId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var requested_session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["session_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["sessionId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var requested_run_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["run_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["runId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var reason = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["reason"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "operator_abort";
}
})())));
var run = ((clojure.string.blank_QMARK_(requested_run_id))?null:cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),requested_run_id));
var session_id = (await (async function (){var or__5162__auto__ = (await (async function (){var G__32159 = requested_session_id;
if((G__32159 == null)){
return null;
} else {
return cljs.core.not_empty(G__32159);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run);
}
})());
try{var session = (await (((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id))))))?knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id):Promise.resolve(null)));
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (await (async function (){var G__32161 = requested_conversation_id;
if((G__32161 == null)){
return null;
} else {
return cljs.core.not_empty(G__32161);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})())));
var resolved_session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = session_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var resolved_run_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = requested_run_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})())));
if(clojure.string.blank_QMARK_(conversation_id)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(400),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"conversation_id, session_id, or run_id is required"], null));
} else {
var abort_result = (await knoxx.backend.domain.voice.turn_control.abort_active_turn_BANG_(conversation_id,reason));
if(clojure.string.blank_QMARK_(resolved_run_id)){
} else {
knoxx.backend.domain.action.run_state.update_run_BANG_(resolved_run_id,(function (r){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(r,new cljs.core.Keyword(null,"status","status",-1997798413),"aborted",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"error","error",-978969032),reason,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], 0));
}));
}

(await (((!(clojure.string.blank_QMARK_(resolved_session_id))))?knoxx.backend.infra.stores.mongo_session_store.update_session_BANG_.cljs$core$IFn$_invoke$arity$2(resolved_session_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"aborted",new cljs.core.Keyword(null,"error","error",-978969032),reason,new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false], null)):Promise.resolve(null)));

return knoxx.backend.infra.http.json_response_BANG_(reply,(200),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(abort_result,new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),resolved_session_id,new cljs.core.Keyword(null,"run_id","run_id",-556768024),resolved_run_id,new cljs.core.Keyword(null,"marked_aborted","marked_aborted",-489318151),true], 0)));
}
}catch (e32160){var err = e32160;
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(409));
}});
knoxx.backend.infra.routes.app.session_status_running_response = (function knoxx$backend$infra$routes$app$session_status_running_response(session_id,session,runtime_active_QMARK_,can_send,stalled_QMARK_,latest_event){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"can_send","can_send",534936371),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"recovery_requested","recovery_requested",-1570831052),new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),new cljs.core.Keyword(null,"latest_event_at","latest_event_at",1047694684),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session),(cljs.core.truth_(stalled_QMARK_)?"Session looked stalled after restart; recovery requested.":(cljs.core.truth_(runtime_active_QMARK_)?"Session is already processing. Use steer, follow-up, abort, or wait.":new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(can_send)
)),(cljs.core.truth_(stalled_QMARK_)?false:new cljs.core.Keyword(null,"can-send","can-send",-704220819).cljs$core$IFn$_invoke$arity$1(can_send)),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session),stalled_QMARK_,cljs.core.boolean$((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return runtime_active_QMARK_;
}
})()),new cljs.core.Keyword(null,"at","at",1476951349).cljs$core$IFn$_invoke$arity$1(latest_event),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(session)]);
});
knoxx.backend.infra.routes.app.handle_session_status = (async function knoxx$backend$infra$routes$app$handle_session_status(runtime,config,reply,request){
var session_id = (await (async function (){var or__5162__auto__ = (request["query"]["session_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["sessionId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var conversation_id = (await (async function (){var or__5162__auto__ = (request["query"]["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["conversationId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(clojure.string.blank_QMARK_(session_id)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(400),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"session_id is required"], null));
} else {
try{var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
if(cljs.core.truth_(session)){
var conversation_id_SINGLEQUOTE_ = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = conversation_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var runtime_active_QMARK_ = knoxx.backend.infra.routes.app.runtime_processing_session_QMARK_(conversation_id_SINGLEQUOTE_);
var can_send = knoxx.backend.infra.stores.mongo_session_store.session_can_send_QMARK_(session);
var latest_event = (await ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session)))?knoxx.backend.infra.routes.app.latest_run_event_BANG_(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(session)):Promise.resolve(null)));
var stalled_QMARK_ = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))) && (((cljs.core.not(runtime_active_QMARK_)) && (knoxx.backend.infra.routes.app.stale_running_session_QMARK_(session,latest_event)))));
if(stalled_QMARK_){
(async function (){
try{return (await knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,session));
}catch (e32163){var err = e32163;
return console.error("On-demand session recovery failed",err);
}})();
} else {
}

return knoxx.backend.infra.http.json_response_BANG_(reply,(200),knoxx.backend.infra.routes.app.session_status_running_response(session_id,session,runtime_active_QMARK_,can_send,stalled_QMARK_,latest_event));
} else {
if(cljs.core.truth_(knoxx.backend.infra.routes.app.runtime_processing_session_QMARK_(conversation_id))){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"status","status",-1997798413),"running",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),true,new cljs.core.Keyword(null,"can_send","can_send",534936371),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),"Session is already processing. Use steer, follow-up, abort, or wait."], null));
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"status","status",-1997798413),"not_found",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"can_send","can_send",534936371),true,new cljs.core.Keyword(null,"reason","reason",-2070751759),"No session state found. Ready for new turn."], null));
}
}
}catch (e32162){var err = e32162;
console.error("Session status check failed",err);

return knoxx.backend.infra.http.json_response_BANG_(reply,(500),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}
}
});
knoxx.backend.infra.routes.app.health_BANG_ = (function knoxx$backend$infra$routes$app$health_BANG_(app,runtime,config,deps){
var map__32164 = deps;
var map__32164__$1 = cljs.core.__destructure_map(map__32164);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32164__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32165 = app;
var G__32166 = "GET";
var G__32167 = "/health";
var G__32168 = (function (request,reply){
var G__32169 = runtime;
var G__32170 = request;
var G__32171 = reply;
var G__32172 = (async function (ctx){
var proxx_configured = (((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))))));
var openplanner_client = knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config);
var openplanner_configured = knoxx.backend.infra.clients.openplanner.enabled_QMARK_(openplanner_client);
var proxx_promise = ((proxx_configured)?knoxx.backend.infra.clients.proxx.health_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)):Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"status","status",-1997798413),(503),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Proxx is not configured"], null)], null)));
var openplanner_promise = knoxx.backend.infra.clients.openplanner.health_BANG_(openplanner_client);
try{return knoxx.backend.infra.routes.app.health_deps_ok(reply,proxx_configured,openplanner_configured,(await knoxx.backend.extern.promise.all_vec(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [proxx_promise,openplanner_promise], null))));
}catch (e32173){var err = e32173;
return knoxx.backend.infra.routes.app.health_deps_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32169,G__32170,G__32171,G__32172) : with_request_context_BANG_.call(null,G__32169,G__32170,G__32171,G__32172));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32165,G__32166,G__32167,G__32168) : route_BANG_.call(null,G__32165,G__32166,G__32167,G__32168));
});
knoxx.backend.infra.routes.app.dev_hmr_BANG_ = (function knoxx$backend$infra$routes$app$dev_hmr_BANG_(app,runtime,config,deps){
var map__32174 = deps;
var map__32174__$1 = cljs.core.__destructure_map(map__32174);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32174__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32175 = app;
var G__32176 = "GET";
var G__32177 = "/api/dev/hmr";
var G__32178 = (function (){var obj32180 = ({"preHandler":(function (request,reply,done){
var guards = cljs.core.PersistentVector.EMPTY;
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
var G__32181 = reply;
var G__32182 = (200);
var G__32183 = knoxx.backend.infra.routes.app.dev_hmr_response();
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32181,G__32182,G__32183) : json_response_BANG_.call(null,G__32181,G__32182,G__32183));
})});
return obj32180;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32175,G__32176,G__32177,G__32178) : route_BANG_.call(null,G__32175,G__32176,G__32177,G__32178));
});
knoxx.backend.infra.routes.app.config_BANG_ = (function knoxx$backend$infra$routes$app$config_BANG_(app,runtime,config,deps){
var map__32184 = deps;
var map__32184__$1 = cljs.core.__destructure_map(map__32184);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32184__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32185 = app;
var G__32186 = "GET";
var G__32187 = "/api/config";
var G__32188 = (function (request,reply){
var G__32189 = runtime;
var G__32190 = request;
var G__32191 = reply;
var G__32192 = (function (ctx){
var G__32193 = reply;
var G__32194 = (200);
var G__32195 = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"tts_provider","tts_provider",1848673731),new cljs.core.Keyword(null,"default_actor_id","default_actor_id",-1072651996),new cljs.core.Keyword(null,"knoxx_enabled","knoxx_enabled",786305029),new cljs.core.Keyword(null,"email_enabled","email_enabled",-1965651127),new cljs.core.Keyword(null,"shibboleth_ui_url","shibboleth_ui_url",-1682504182),new cljs.core.Keyword(null,"default_role","default_role",-536700245),new cljs.core.Keyword(null,"tts_default_speed","tts_default_speed",-1897181429),new cljs.core.Keyword(null,"knoxx_base_url","knoxx_base_url",-804222133),new cljs.core.Keyword(null,"tts_default_postprocess_enabled","tts_default_postprocess_enabled",-353300629),new cljs.core.Keyword(null,"tts_default_voice_id","tts_default_voice_id",138593804),new cljs.core.Keyword(null,"tts_default_model_id","tts_default_model_id",-141776244),new cljs.core.Keyword(null,"shibboleth_enabled","shibboleth_enabled",-1795847955),new cljs.core.Keyword(null,"stt_enabled","stt_enabled",-1918729424),new cljs.core.Keyword(null,"proxx_default_model","proxx_default_model",-1345936300),new cljs.core.Keyword(null,"tts_enabled","tts_enabled",-895456908),new cljs.core.Keyword(null,"proxx_enabled","proxx_enabled",-344912362),new cljs.core.Keyword(null,"default_agent_contract","default_agent_contract",1944367159),new cljs.core.Keyword(null,"stt_base_url","stt_base_url",-364531688),new cljs.core.Keyword(null,"rbac_enabled","rbac_enabled",1179348187),new cljs.core.Keyword(null,"tts_default_postprocess_profile","tts_default_postprocess_profile",497692541),new cljs.core.Keyword(null,"knoxx_admin_url","knoxx_admin_url",457353310)],[(((!(clojure.string.blank_QMARK_(clojure.string.trim((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))))?"voxx":""),knoxx.backend.infra.tooling.default_actor_id(config),true,knoxx.backend.infra.tooling.email_enabled_QMARK_(config),((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658).cljs$core$IFn$_invoke$arity$1(config)))?"":knoxx.backend.infra.http.rewrite_localhost_url(new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658).cljs$core$IFn$_invoke$arity$1(config),request)),new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voxx-default-speed","voxx-default-speed",-370827943).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "1.15";
}
})(),knoxx.backend.infra.http.rewrite_localhost_url(new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config),request),true,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voxx-voice-id","voxx-voice-id",-652120125).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "af_jessica";
}
})(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voxx-model-id","voxx-model-id",2106305693).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "kokoro";
}
})(),(((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"shibboleth-base-url","shibboleth-base-url",-351013125).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"shibboleth-ui-url","shibboleth-ui-url",358926658).cljs$core$IFn$_invoke$arity$1(config)))))),(!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445).cljs$core$IFn$_invoke$arity$1(config)))),new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_)),(!(clojure.string.blank_QMARK_(clojure.string.trim((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))),(((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config)))))),knoxx.backend.infra.tooling.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,knoxx.backend.infra.tooling.default_actor_id(config)),((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445).cljs$core$IFn$_invoke$arity$1(config)))?"":knoxx.backend.infra.http.rewrite_localhost_url(new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445).cljs$core$IFn$_invoke$arity$1(config),request)),knoxx.backend.infra.auth.authz.policy_db_enabled_QMARK_(runtime),"sports-commentator-v1",knoxx.backend.infra.http.rewrite_localhost_url(new cljs.core.Keyword(null,"knoxx-admin-url","knoxx-admin-url",238625622).cljs$core$IFn$_invoke$arity$1(config),request)]);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32193,G__32194,G__32195) : json_response_BANG_.call(null,G__32193,G__32194,G__32195));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32189,G__32190,G__32191,G__32192) : with_request_context_BANG_.call(null,G__32189,G__32190,G__32191,G__32192));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32185,G__32186,G__32187,G__32188) : route_BANG_.call(null,G__32185,G__32186,G__32187,G__32188));
});
knoxx.backend.infra.routes.app.api_knoxx_agents_catalog_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_agents_catalog_BANG_(app,runtime,config,deps){
var map__32197 = deps;
var map__32197__$1 = cljs.core.__destructure_map(map__32197);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32197__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32198 = app;
var G__32199 = "GET";
var G__32200 = "/api/knoxx/agents/catalog";
var G__32201 = (function (request,reply){
var G__32202 = runtime;
var G__32203 = request;
var G__32204 = reply;
var G__32205 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var actor_id = (function (){var G__32206 = (function (){var or__5162__auto__ = (request["query"]["actorId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (request["query"]["actor"]);
}
})();
var G__32206__$1 = (((G__32206 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__32206)));
var G__32206__$2 = (((G__32206__$1 == null))?null:clojure.string.trim(G__32206__$1));
if((G__32206__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__32206__$2);
}
})();
var effective_actor_id = (function (){var or__5162__auto__ = actor_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.tooling.default_actor_id(config);
}
})();
var agents = knoxx.backend.infra.tooling.agent_contract_catalog.cljs$core$IFn$_invoke$arity$2(config,effective_actor_id);
var default_agent_id = knoxx.backend.infra.tooling.default_agent_contract_id.cljs$core$IFn$_invoke$arity$2(config,effective_actor_id);
var default_agent = (cljs.core.truth_(default_agent_id)?knoxx.backend.infra.tooling.effective_agent_contract.cljs$core$IFn$_invoke$arity$3(config,default_agent_id,effective_actor_id):null);
var catalog = (function (){var G__32207 = agents;
if(cljs.core.truth_((function (){var and__5160__auto__ = default_agent;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not(cljs.core.some((function (p1__32196_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(p1__32196_SHARP_),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(default_agent));
}),agents));
} else {
return and__5160__auto__;
}
})())){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__32207,default_agent);
} else {
return G__32207;
}
})();
var G__32208 = reply;
var G__32209 = (200);
var G__32210 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),effective_actor_id,new cljs.core.Keyword(null,"actors","actors",-1845636398),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (actor){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(actor),new cljs.core.Keyword(null,"defaultAgent","defaultAgent",-2024015469),new cljs.core.Keyword(null,"default-agent","default-agent",279723152).cljs$core$IFn$_invoke$arity$1(actor),new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null);
}),knoxx.backend.infra.tooling.actor_catalog(config)),new cljs.core.Keyword(null,"agents","agents",-1112413700),cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),catalog)),new cljs.core.Keyword(null,"default_actor_id","default_actor_id",-1072651996),knoxx.backend.infra.tooling.default_actor_id(config),new cljs.core.Keyword(null,"default_agent_contract","default_agent_contract",1944367159),default_agent_id], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32208,G__32209,G__32210) : json_response_BANG_.call(null,G__32208,G__32209,G__32210));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32202,G__32203,G__32204,G__32205) : with_request_context_BANG_.call(null,G__32202,G__32203,G__32204,G__32205));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32198,G__32199,G__32200,G__32201) : route_BANG_.call(null,G__32198,G__32199,G__32200,G__32201));
});
knoxx.backend.infra.routes.app.api_auth_context_BANG_ = (function knoxx$backend$infra$routes$app$api_auth_context_BANG_(app,runtime,config,deps){
var map__32211 = deps;
var map__32211__$1 = cljs.core.__destructure_map(map__32211);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32211__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32212 = app;
var G__32213 = "GET";
var G__32214 = "/api/auth/context";
var G__32215 = (function (request,reply){
var G__32216 = runtime;
var G__32217 = request;
var G__32218 = reply;
var G__32219 = (function (ctx){
if((!(knoxx.backend.infra.auth.authz.policy_db_enabled_QMARK_(runtime)))){
var G__32220 = reply;
var G__32221 = (503);
var G__32222 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Knoxx policy database is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32220,G__32221,G__32222) : json_response_BANG_.call(null,G__32220,G__32221,G__32222));
} else {
var G__32223 = reply;
var G__32224 = (200);
var G__32225 = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"permissions","permissions",67803075),new cljs.core.Keyword(null,"isSystemAdmin","isSystemAdmin",679314438),new cljs.core.Keyword(null,"roles","roles",143379530),new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"membershipToolPolicies","membershipToolPolicies",-954353456),new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"primaryRole","primaryRole",-1016391334),new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"roleSlugs","roleSlugs",988302270),new cljs.core.Keyword(null,"actor","actor",-1830560481)],[cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"permissions","permissions",67803075).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),knoxx.backend.infra.auth.authz.system_admin_QMARK_(ctx),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"roles","roles",143379530).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"membership","membership",254556333).cljs$core$IFn$_invoke$arity$1(ctx),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"membership-tool-policies","membership-tool-policies",-646011419).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"membershipToolPolicies","membershipToolPolicies",-954353456).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})()),cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})()),new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(ctx),knoxx.backend.infra.auth.authz.primary_context_role(ctx),new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(ctx),cljs.core.vec(knoxx.backend.infra.auth.authz.ctx_role_slugs(ctx)),new cljs.core.Keyword(null,"actor","actor",-1830560481).cljs$core$IFn$_invoke$arity$1(ctx)]);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32223,G__32224,G__32225) : json_response_BANG_.call(null,G__32223,G__32224,G__32225));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32216,G__32217,G__32218,G__32219) : with_request_context_BANG_.call(null,G__32216,G__32217,G__32218,G__32219));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32212,G__32213,G__32214,G__32215) : route_BANG_.call(null,G__32212,G__32213,G__32214,G__32215));
});
knoxx.backend.infra.routes.app.api_knoxx_proxy_get_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_proxy_get_BANG_(app,runtime,config,deps){
var map__32226 = deps;
var map__32226__$1 = cljs.core.__destructure_map(map__32226);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32226__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32227 = app;
var G__32228 = "GET";
var G__32229 = "/api/knoxx/proxy/*";
var G__32230 = (function (request,reply){
var G__32231 = runtime;
var G__32232 = request;
var G__32233 = reply;
var G__32234 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_(config,request,reply,"GET",(request["params"]["*"]));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32231,G__32232,G__32233,G__32234) : with_request_context_BANG_.call(null,G__32231,G__32232,G__32233,G__32234));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32227,G__32228,G__32229,G__32230) : route_BANG_.call(null,G__32227,G__32228,G__32229,G__32230));
});
knoxx.backend.infra.routes.app.api_knoxx_proxy_post_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_proxy_post_BANG_(app,runtime,config,deps){
var map__32235 = deps;
var map__32235__$1 = cljs.core.__destructure_map(map__32235);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32235__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32236 = app;
var G__32237 = "POST";
var G__32238 = "/api/knoxx/proxy/*";
var G__32239 = (function (request,reply){
var G__32240 = runtime;
var G__32241 = request;
var G__32242 = reply;
var G__32243 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_(config,request,reply,"POST",(request["params"]["*"]));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32240,G__32241,G__32242,G__32243) : with_request_context_BANG_.call(null,G__32240,G__32241,G__32242,G__32243));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32236,G__32237,G__32238,G__32239) : route_BANG_.call(null,G__32236,G__32237,G__32238,G__32239));
});
knoxx.backend.infra.routes.app.api_knoxx_proxy_put_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_proxy_put_BANG_(app,runtime,config,deps){
var map__32244 = deps;
var map__32244__$1 = cljs.core.__destructure_map(map__32244);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32244__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32245 = app;
var G__32246 = "PUT";
var G__32247 = "/api/knoxx/proxy/*";
var G__32248 = (function (request,reply){
var G__32249 = runtime;
var G__32250 = request;
var G__32251 = reply;
var G__32252 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_(config,request,reply,"PUT",(request["params"]["*"]));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32249,G__32250,G__32251,G__32252) : with_request_context_BANG_.call(null,G__32249,G__32250,G__32251,G__32252));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32245,G__32246,G__32247,G__32248) : route_BANG_.call(null,G__32245,G__32246,G__32247,G__32248));
});
knoxx.backend.infra.routes.app.api_knoxx_proxy_patch_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_proxy_patch_BANG_(app,runtime,config,deps){
var map__32253 = deps;
var map__32253__$1 = cljs.core.__destructure_map(map__32253);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32253__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32254 = app;
var G__32255 = "PATCH";
var G__32256 = "/api/knoxx/proxy/*";
var G__32257 = (function (request,reply){
var G__32258 = runtime;
var G__32259 = request;
var G__32260 = reply;
var G__32261 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_(config,request,reply,"PATCH",(request["params"]["*"]));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32258,G__32259,G__32260,G__32261) : with_request_context_BANG_.call(null,G__32258,G__32259,G__32260,G__32261));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32254,G__32255,G__32256,G__32257) : route_BANG_.call(null,G__32254,G__32255,G__32256,G__32257));
});
knoxx.backend.infra.routes.app.api_knoxx_proxy_delete_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_proxy_delete_BANG_(app,runtime,config,deps){
var map__32262 = deps;
var map__32262__$1 = cljs.core.__destructure_map(map__32262);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32262__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32263 = app;
var G__32264 = "DELETE";
var G__32265 = "/api/knoxx/proxy/*";
var G__32266 = (function (request,reply){
var G__32267 = runtime;
var G__32268 = request;
var G__32269 = reply;
var G__32270 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_proxy_BANG_(config,request,reply,"DELETE",(request["params"]["*"]));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32267,G__32268,G__32269,G__32270) : with_request_context_BANG_.call(null,G__32267,G__32268,G__32269,G__32270));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32263,G__32264,G__32265,G__32266) : route_BANG_.call(null,G__32263,G__32264,G__32265,G__32266));
});
knoxx.backend.infra.routes.app.api_ingestion_browse_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_browse_BANG_(app,runtime,config,deps){
var map__32271 = deps;
var map__32271__$1 = cljs.core.__destructure_map(map__32271);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32271__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32272 = app;
var G__32273 = "GET";
var G__32274 = "/api/ingestion/browse";
var G__32275 = (function (request,reply){
var G__32276 = runtime;
var G__32277 = request;
var G__32278 = reply;
var G__32279 = (function (ctx){
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config))+"/api/ingestion/browse"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((request_query_string.cljs$core$IFn$_invoke$arity$1 ? request_query_string.cljs$core$IFn$_invoke$arity$1(request) : request_query_string.call(null,request))));
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32276,G__32277,G__32278,G__32279) : with_request_context_BANG_.call(null,G__32276,G__32277,G__32278,G__32279));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32272,G__32273,G__32274,G__32275) : route_BANG_.call(null,G__32272,G__32273,G__32274,G__32275));
});
knoxx.backend.infra.routes.app.api_ingestion_file_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_file_BANG_(app,runtime,config,deps){
var map__32280 = deps;
var map__32280__$1 = cljs.core.__destructure_map(map__32280);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32280__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32281 = app;
var G__32282 = "GET";
var G__32283 = "/api/ingestion/file";
var G__32284 = (function (request,reply){
var G__32285 = runtime;
var G__32286 = request;
var G__32287 = reply;
var G__32288 = (function (ctx){
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config))+"/api/ingestion/file"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((request_query_string.cljs$core$IFn$_invoke$arity$1 ? request_query_string.cljs$core$IFn$_invoke$arity$1(request) : request_query_string.call(null,request))));
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32285,G__32286,G__32287,G__32288) : with_request_context_BANG_.call(null,G__32285,G__32286,G__32287,G__32288));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32281,G__32282,G__32283,G__32284) : route_BANG_.call(null,G__32281,G__32282,G__32283,G__32284));
});
knoxx.backend.infra.routes.app.api_ingestion_file_put_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_file_put_BANG_(app,runtime,config,deps){
var map__32289 = deps;
var map__32289__$1 = cljs.core.__destructure_map(map__32289);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32289__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32290 = app;
var G__32291 = "PUT";
var G__32292 = "/api/ingestion/file";
var G__32293 = (function (request,reply){
var G__32294 = runtime;
var G__32295 = request;
var G__32296 = reply;
var G__32297 = (function (ctx){
var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var body = knoxx.backend.infra.http.request_body(request);
var file_path = (function (){var or__5162__auto__ = (body["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var content = (function (){var or__5162__auto__ = (body["content"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var safe_path = knoxx.backend.infra.document_state.normalize_relative_path(file_path);
if(((clojure.string.blank_QMARK_(safe_path)) || (clojure.string.starts_with_QMARK_(safe_path,"..")))){
var G__32298 = reply;
var G__32299 = (400);
var G__32300 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Invalid or unsafe file path"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32298,G__32299,G__32300) : json_response_BANG_.call(null,G__32298,G__32299,G__32300));
} else {
var absolute_path = shadow.esm.esm_import$node_path.resolve(workspace_root,safe_path);
if((!(clojure.string.starts_with_QMARK_(absolute_path,workspace_root)))){
var G__32301 = reply;
var G__32302 = (400);
var G__32303 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Path escapes workspace"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32301,G__32302,G__32303) : json_response_BANG_.call(null,G__32301,G__32302,G__32303));
} else {
return knoxx.backend.infra.routes.app.write_ingestion_file_BANG_(reply,absolute_path,content,safe_path);
}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32294,G__32295,G__32296,G__32297) : with_request_context_BANG_.call(null,G__32294,G__32295,G__32296,G__32297));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32290,G__32291,G__32292,G__32293) : route_BANG_.call(null,G__32290,G__32291,G__32292,G__32293));
});
knoxx.backend.infra.routes.app.api_ingestion_sources_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_sources_BANG_(app,runtime,config,deps){
var map__32304 = deps;
var map__32304__$1 = cljs.core.__destructure_map(map__32304);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32304__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32305 = app;
var G__32306 = "GET";
var G__32307 = "/api/ingestion/sources";
var G__32308 = (function (request,reply){
var G__32309 = runtime;
var G__32310 = request;
var G__32311 = reply;
var G__32312 = (function (ctx){
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config))+"/api/ingestion/sources"),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32309,G__32310,G__32311,G__32312) : with_request_context_BANG_.call(null,G__32309,G__32310,G__32311,G__32312));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32305,G__32306,G__32307,G__32308) : route_BANG_.call(null,G__32305,G__32306,G__32307,G__32308));
});
knoxx.backend.infra.routes.app.api_ingestion_jobs_get_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_jobs_get_BANG_(app,runtime,config,deps){
var map__32313 = deps;
var map__32313__$1 = cljs.core.__destructure_map(map__32313);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32313__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32314 = app;
var G__32315 = "GET";
var G__32316 = "/api/ingestion/jobs";
var G__32317 = (function (request,reply){
var G__32318 = runtime;
var G__32319 = request;
var G__32320 = reply;
var G__32321 = (function (ctx){
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config))+"/api/ingestion/jobs"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((request_query_string.cljs$core$IFn$_invoke$arity$1 ? request_query_string.cljs$core$IFn$_invoke$arity$1(request) : request_query_string.call(null,request))));
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32318,G__32319,G__32320,G__32321) : with_request_context_BANG_.call(null,G__32318,G__32319,G__32320,G__32321));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32314,G__32315,G__32316,G__32317) : route_BANG_.call(null,G__32314,G__32315,G__32316,G__32317));
});
knoxx.backend.infra.routes.app.api_ingestion_jobs_post_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_jobs_post_BANG_(app,runtime,config,deps){
var map__32322 = deps;
var map__32322__$1 = cljs.core.__destructure_map(map__32322);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32322__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32323 = app;
var G__32324 = "POST";
var G__32325 = "/api/ingestion/jobs";
var G__32326 = (function (request,reply){
var G__32327 = runtime;
var G__32328 = request;
var G__32329 = reply;
var G__32330 = (function (ctx){
var body = (request["body"]);
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config))+"/api/ingestion/jobs"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"body","body",-2049205669),(function (){var or__5162__auto__ = (function (){var G__32331 = body;
if((G__32331 == null)){
return null;
} else {
return JSON.stringify(G__32331);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "{}";
}
})()], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32327,G__32328,G__32329,G__32330) : with_request_context_BANG_.call(null,G__32327,G__32328,G__32329,G__32330));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32323,G__32324,G__32325,G__32326) : route_BANG_.call(null,G__32323,G__32324,G__32325,G__32326));
});
knoxx.backend.infra.routes.app.api_ingestion_proxy_get_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_proxy_get_BANG_(app,runtime,config,deps){
var map__32332 = deps;
var map__32332__$1 = cljs.core.__destructure_map(map__32332);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32332__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32333 = app;
var G__32334 = "GET";
var G__32335 = "/api/ingestion-proxy/*";
var G__32336 = (function (request,reply){
var G__32337 = runtime;
var G__32338 = request;
var G__32339 = reply;
var G__32340 = (function (ctx){
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
var path = (request["params"]["*"]);
var qs = (request_query_string.cljs$core$IFn$_invoke$arity$1 ? request_query_string.cljs$core$IFn$_invoke$arity$1(request) : request_query_string.call(null,request));
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/api/ingestion/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(qs));
return knoxx.backend.infra.routes.app.send_fetch_json_detail_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),"Ingestion proxy failed: ");
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32337,G__32338,G__32339,G__32340) : with_request_context_BANG_.call(null,G__32337,G__32338,G__32339,G__32340));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32333,G__32334,G__32335,G__32336) : route_BANG_.call(null,G__32333,G__32334,G__32335,G__32336));
});
knoxx.backend.infra.routes.app.api_ingestion_proxy_post_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_proxy_post_BANG_(app,runtime,config,deps){
var map__32341 = deps;
var map__32341__$1 = cljs.core.__destructure_map(map__32341);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32341__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32342 = app;
var G__32343 = "POST";
var G__32344 = "/api/ingestion-proxy/*";
var G__32345 = (function (request,reply){
var G__32346 = runtime;
var G__32347 = request;
var G__32348 = reply;
var G__32349 = (function (ctx){
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
var path = (request["params"]["*"]);
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/api/ingestion/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path));
var body = (request["body"]);
return knoxx.backend.infra.routes.app.send_fetch_json_detail_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"body","body",-2049205669),(function (){var or__5162__auto__ = (function (){var G__32350 = body;
if((G__32350 == null)){
return null;
} else {
return JSON.stringify(G__32350);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "{}";
}
})()], null),"Ingestion proxy failed: ");
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32346,G__32347,G__32348,G__32349) : with_request_context_BANG_.call(null,G__32346,G__32347,G__32348,G__32349));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32342,G__32343,G__32344,G__32345) : route_BANG_.call(null,G__32342,G__32343,G__32344,G__32345));
});
knoxx.backend.infra.routes.app.api_ingestion_proxy_delete_BANG_ = (function knoxx$backend$infra$routes$app$api_ingestion_proxy_delete_BANG_(app,runtime,config,deps){
var map__32351 = deps;
var map__32351__$1 = cljs.core.__destructure_map(map__32351);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32351__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32352 = app;
var G__32353 = "DELETE";
var G__32354 = "/api/ingestion-proxy/*";
var G__32355 = (function (request,reply){
var G__32356 = runtime;
var G__32357 = request;
var G__32358 = reply;
var G__32359 = (function (ctx){
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
var path = (request["params"]["*"]);
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/api/ingestion/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path));
return knoxx.backend.infra.routes.app.send_fetch_json_detail_BANG_(reply,target_url,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"DELETE"], null),"Ingestion proxy failed: ");
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32356,G__32357,G__32358,G__32359) : with_request_context_BANG_.call(null,G__32356,G__32357,G__32358,G__32359));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32352,G__32353,G__32354,G__32355) : route_BANG_.call(null,G__32352,G__32353,G__32354,G__32355));
});
knoxx.backend.infra.routes.app.api_data_op_get_BANG_ = (function knoxx$backend$infra$routes$app$api_data_op_get_BANG_(app,runtime,config,deps){
var map__32360 = deps;
var map__32360__$1 = cljs.core.__destructure_map(map__32360);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32360__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32361 = app;
var G__32362 = "GET";
var G__32363 = "/api/data/op/*";
var G__32364 = (function (request,reply){
var G__32365 = runtime;
var G__32366 = request;
var G__32367 = reply;
var G__32368 = (function (ctx){
var path = (request["params"]["*"]);
var raw_url = (request["raw"]["url"]);
var query_idx = raw_url.indexOf("?");
var qs = (((query_idx >= (0)))?cljs.core.subs.cljs$core$IFn$_invoke$arity$2(raw_url,query_idx):"");
return knoxx.backend.infra.routes.app.send_openplanner_v1_json_BANG_(config,reply,"GET",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(qs)),null);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32365,G__32366,G__32367,G__32368) : with_request_context_BANG_.call(null,G__32365,G__32366,G__32367,G__32368));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32361,G__32362,G__32363,G__32364) : route_BANG_.call(null,G__32361,G__32362,G__32363,G__32364));
});
knoxx.backend.infra.routes.app.api_data_op_post_BANG_ = (function knoxx$backend$infra$routes$app$api_data_op_post_BANG_(app,runtime,config,deps){
var map__32369 = deps;
var map__32369__$1 = cljs.core.__destructure_map(map__32369);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32369__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32370 = app;
var G__32371 = "POST";
var G__32372 = "/api/data/op/*";
var G__32373 = (function (request,reply){
var G__32374 = runtime;
var G__32375 = request;
var G__32376 = reply;
var G__32377 = (function (ctx){
var path = (request["params"]["*"]);
var body = (request["body"]);
return knoxx.backend.infra.routes.app.send_openplanner_v1_json_BANG_(config,reply,"POST",path,body);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32374,G__32375,G__32376,G__32377) : with_request_context_BANG_.call(null,G__32374,G__32375,G__32376,G__32377));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32370,G__32371,G__32372,G__32373) : route_BANG_.call(null,G__32370,G__32371,G__32372,G__32373));
});
knoxx.backend.infra.routes.app.api_data_op_delete_BANG_ = (function knoxx$backend$infra$routes$app$api_data_op_delete_BANG_(app,runtime,config,deps){
var map__32378 = deps;
var map__32378__$1 = cljs.core.__destructure_map(map__32378);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32378__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32379 = app;
var G__32380 = "DELETE";
var G__32381 = "/api/data/op/*";
var G__32382 = (function (request,reply){
var G__32383 = runtime;
var G__32384 = request;
var G__32385 = reply;
var G__32386 = (function (ctx){
var path = (request["params"]["*"]);
return knoxx.backend.infra.routes.app.send_openplanner_v1_json_BANG_(config,reply,"DELETE",path,null);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32383,G__32384,G__32385,G__32386) : with_request_context_BANG_.call(null,G__32383,G__32384,G__32385,G__32386));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32379,G__32380,G__32381,G__32382) : route_BANG_.call(null,G__32379,G__32380,G__32381,G__32382));
});
knoxx.backend.infra.routes.app.api_data_op_patch_BANG_ = (function knoxx$backend$infra$routes$app$api_data_op_patch_BANG_(app,runtime,config,deps){
var map__32387 = deps;
var map__32387__$1 = cljs.core.__destructure_map(map__32387);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32387__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32388 = app;
var G__32389 = "PATCH";
var G__32390 = "/api/data/op/*";
var G__32391 = (function (request,reply){
var G__32392 = runtime;
var G__32393 = request;
var G__32394 = reply;
var G__32395 = (function (ctx){
var path = (request["params"]["*"]);
var body = (request["body"]);
return knoxx.backend.infra.routes.app.send_openplanner_v1_json_BANG_(config,reply,"PATCH",path,body);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32392,G__32393,G__32394,G__32395) : with_request_context_BANG_.call(null,G__32392,G__32393,G__32394,G__32395));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32388,G__32389,G__32390,G__32391) : route_BANG_.call(null,G__32388,G__32389,G__32390,G__32391));
});
knoxx.backend.infra.routes.app.api_data_health_BANG_ = (function knoxx$backend$infra$routes$app$api_data_health_BANG_(app,runtime,config,deps){
var map__32396 = deps;
var map__32396__$1 = cljs.core.__destructure_map(map__32396);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32396__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32397 = app;
var G__32398 = "GET";
var G__32399 = "/api/data/health";
var G__32400 = (function (request,reply){
var G__32401 = runtime;
var G__32402 = request;
var G__32403 = reply;
var G__32404 = (function (ctx){
return knoxx.backend.infra.routes.app.send_data_health_BANG_(config,reply);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32401,G__32402,G__32403,G__32404) : with_request_context_BANG_.call(null,G__32401,G__32402,G__32403,G__32404));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32397,G__32398,G__32399,G__32400) : route_BANG_.call(null,G__32397,G__32398,G__32399,G__32400));
});
knoxx.backend.infra.routes.app.api_data_mongo_collections_BANG_ = (function knoxx$backend$infra$routes$app$api_data_mongo_collections_BANG_(app,runtime,config,deps){
var map__32405 = deps;
var map__32405__$1 = cljs.core.__destructure_map(map__32405);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32405__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32406 = app;
var G__32407 = "GET";
var G__32408 = "/api/data/mongo/collections";
var G__32409 = (function (request,reply){
var G__32410 = runtime;
var G__32411 = request;
var G__32412 = reply;
var G__32413 = (function (ctx){
return knoxx.backend.infra.routes.app.send_mongo_collections_BANG_(config,reply);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32410,G__32411,G__32412,G__32413) : with_request_context_BANG_.call(null,G__32410,G__32411,G__32412,G__32413));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32406,G__32407,G__32408,G__32409) : route_BANG_.call(null,G__32406,G__32407,G__32408,G__32409));
});
knoxx.backend.infra.routes.app.api_data_mongo_list_BANG_ = (function knoxx$backend$infra$routes$app$api_data_mongo_list_BANG_(app,runtime,config,deps){
var map__32414 = deps;
var map__32414__$1 = cljs.core.__destructure_map(map__32414);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32414__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32415 = app;
var G__32416 = "GET";
var G__32417 = "/api/data/mongo/list";
var G__32418 = (function (request,reply){
var G__32419 = runtime;
var G__32420 = request;
var G__32421 = reply;
var G__32422 = (function (ctx){
return knoxx.backend.infra.routes.app.send_json_promise_BANG_(reply,knoxx.backend.infra.clients.openplanner.mongo_collections_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config)));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32419,G__32420,G__32421,G__32422) : with_request_context_BANG_.call(null,G__32419,G__32420,G__32421,G__32422));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32415,G__32416,G__32417,G__32418) : route_BANG_.call(null,G__32415,G__32416,G__32417,G__32418));
});
knoxx.backend.infra.routes.app.api_data_mongo_query_BANG_ = (function knoxx$backend$infra$routes$app$api_data_mongo_query_BANG_(app,runtime,config,deps){
var map__32423 = deps;
var map__32423__$1 = cljs.core.__destructure_map(map__32423);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32423__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32424 = app;
var G__32425 = "POST";
var G__32426 = "/api/data/mongo/query";
var G__32427 = (function (request,reply){
var G__32428 = runtime;
var G__32429 = request;
var G__32430 = reply;
var G__32431 = (function (ctx){
var body = knoxx.backend.infra.http.request_body(request);
return knoxx.backend.infra.routes.app.send_json_promise_BANG_(reply,knoxx.backend.infra.clients.openplanner.mongo_query_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),body));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32428,G__32429,G__32430,G__32431) : with_request_context_BANG_.call(null,G__32428,G__32429,G__32430,G__32431));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32424,G__32425,G__32426,G__32427) : route_BANG_.call(null,G__32424,G__32425,G__32426,G__32427));
});
knoxx.backend.infra.routes.app.api_data_pg_tables_BANG_ = (function knoxx$backend$infra$routes$app$api_data_pg_tables_BANG_(app,runtime,config,deps){
var map__32432 = deps;
var map__32432__$1 = cljs.core.__destructure_map(map__32432);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32432__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32433 = app;
var G__32434 = "GET";
var G__32435 = "/api/data/pg/tables";
var G__32436 = (function (request,reply){
var G__32437 = runtime;
var G__32438 = request;
var G__32439 = reply;
var G__32440 = (function (ctx){
var G__32441 = reply;
var G__32442 = (410);
var G__32443 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"pg_removed",new cljs.core.Keyword(null,"detail","detail",-1545345025),"PostgreSQL backend removed; use /api/data/mongo/collections"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32441,G__32442,G__32443) : json_response_BANG_.call(null,G__32441,G__32442,G__32443));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32437,G__32438,G__32439,G__32440) : with_request_context_BANG_.call(null,G__32437,G__32438,G__32439,G__32440));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32433,G__32434,G__32435,G__32436) : route_BANG_.call(null,G__32433,G__32434,G__32435,G__32436));
});
knoxx.backend.infra.routes.app.api_data_jobs_build_semantic_edges_BANG_ = (function knoxx$backend$infra$routes$app$api_data_jobs_build_semantic_edges_BANG_(app,runtime,config,deps){
var map__32444 = deps;
var map__32444__$1 = cljs.core.__destructure_map(map__32444);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32444__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32445 = app;
var G__32446 = "POST";
var G__32447 = "/api/data/jobs/build-semantic-edges";
var G__32448 = (function (request,reply){
var G__32449 = runtime;
var G__32450 = request;
var G__32451 = reply;
var G__32452 = (function (ctx){
var body = knoxx.backend.infra.http.request_body(request);
var k = (function (){var or__5162__auto__ = (body["k"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (8);
}
})();
var min_sim = (function (){var or__5162__auto__ = (body["minSimilarity"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return 0.3;
}
})();
return knoxx.backend.infra.routes.app.send_json_promise_BANG_(reply,knoxx.backend.infra.clients.openplanner.build_semantic_edges_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"k","k",-2146297393),k,new cljs.core.Keyword(null,"minSimilarity","minSimilarity",1887522484),min_sim], null)));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32449,G__32450,G__32451,G__32452) : with_request_context_BANG_.call(null,G__32449,G__32450,G__32451,G__32452));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32445,G__32446,G__32447,G__32448) : route_BANG_.call(null,G__32445,G__32446,G__32447,G__32448));
});
knoxx.backend.infra.routes.app.api_data_pg_query_BANG_ = (function knoxx$backend$infra$routes$app$api_data_pg_query_BANG_(app,runtime,config,deps){
var map__32453 = deps;
var map__32453__$1 = cljs.core.__destructure_map(map__32453);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32453__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32454 = app;
var G__32455 = "POST";
var G__32456 = "/api/data/pg/query";
var G__32457 = (function (request,reply){
var G__32458 = runtime;
var G__32459 = request;
var G__32460 = reply;
var G__32461 = (function (ctx){
var G__32462 = reply;
var G__32463 = (410);
var G__32464 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"pg_removed",new cljs.core.Keyword(null,"detail","detail",-1545345025),"PostgreSQL backend removed; use /api/data/mongo/collections"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32462,G__32463,G__32464) : json_response_BANG_.call(null,G__32462,G__32463,G__32464));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32458,G__32459,G__32460,G__32461) : with_request_context_BANG_.call(null,G__32458,G__32459,G__32460,G__32461));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32454,G__32455,G__32456,G__32457) : route_BANG_.call(null,G__32454,G__32455,G__32456,G__32457));
});
knoxx.backend.infra.routes.app.api_data_browse_BANG_ = (function knoxx$backend$infra$routes$app$api_data_browse_BANG_(app,runtime,config,deps){
var map__32465 = deps;
var map__32465__$1 = cljs.core.__destructure_map(map__32465);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32465__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32466 = app;
var G__32467 = "GET";
var G__32468 = "/api/data/browse";
var G__32469 = (function (request,reply){
var G__32470 = runtime;
var G__32471 = request;
var G__32472 = reply;
var G__32473 = (function (ctx){
var qs = (request["query"]);
var path = (function (){var or__5162__auto__ = (qs["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/api/ingestion/browse"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(path))?"":(""+"?path="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(path))))));
return knoxx.backend.infra.routes.app.send_data_browse_BANG_(reply,target_url);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32470,G__32471,G__32472,G__32473) : with_request_context_BANG_.call(null,G__32470,G__32471,G__32472,G__32473));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32466,G__32467,G__32468,G__32469) : route_BANG_.call(null,G__32466,G__32467,G__32468,G__32469));
});
knoxx.backend.infra.routes.app.api_data_file_BANG_ = (function knoxx$backend$infra$routes$app$api_data_file_BANG_(app,runtime,config,deps){
var map__32474 = deps;
var map__32474__$1 = cljs.core.__destructure_map(map__32474);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32474__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32475 = app;
var G__32476 = "GET";
var G__32477 = "/api/data/file";
var G__32478 = (function (request,reply){
var G__32479 = runtime;
var G__32480 = request;
var G__32481 = reply;
var G__32482 = (function (ctx){
var qs = (request["query"]);
var path = (function (){var or__5162__auto__ = (qs["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var ingestion_base = new cljs.core.Keyword(null,"ingestion-base-url","ingestion-base-url",-1760674811).cljs$core$IFn$_invoke$arity$1(config);
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ingestion_base)+"/api/ingestion/file?path="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(path))),null,knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32479,G__32480,G__32481,G__32482) : with_request_context_BANG_.call(null,G__32479,G__32480,G__32481,G__32482));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32475,G__32476,G__32477,G__32478) : route_BANG_.call(null,G__32475,G__32476,G__32477,G__32478));
});
knoxx.backend.infra.routes.app.api_data_graphql_BANG_ = (function knoxx$backend$infra$routes$app$api_data_graphql_BANG_(app,runtime,config,deps){
var map__32483 = deps;
var map__32483__$1 = cljs.core.__destructure_map(map__32483);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32483__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32484 = app;
var G__32485 = "POST";
var G__32486 = "/api/data/graphql";
var G__32487 = (function (request,reply){
var G__32488 = runtime;
var G__32489 = request;
var G__32490 = reply;
var G__32491 = (function (ctx){
var body = knoxx.backend.infra.http.request_body(request);
var gw_url = "http://127.0.0.1:8796/graphql";
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,gw_url,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null),new cljs.core.Keyword(null,"body","body",-2049205669),(function (){var or__5162__auto__ = (function (){var G__32492 = body;
if((G__32492 == null)){
return null;
} else {
return JSON.stringify(G__32492);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "{}";
}
})()], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32488,G__32489,G__32490,G__32491) : with_request_context_BANG_.call(null,G__32488,G__32489,G__32490,G__32491));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32484,G__32485,G__32486,G__32487) : route_BANG_.call(null,G__32484,G__32485,G__32486,G__32487));
});
knoxx.backend.infra.routes.app.api_data_graph_status_BANG_ = (function knoxx$backend$infra$routes$app$api_data_graph_status_BANG_(app,runtime,config,deps){
var map__32493 = deps;
var map__32493__$1 = cljs.core.__destructure_map(map__32493);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32493__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32494 = app;
var G__32495 = "GET";
var G__32496 = "/api/data/graph/status";
var G__32497 = (function (request,reply){
var G__32498 = runtime;
var G__32499 = request;
var G__32500 = reply;
var G__32501 = (function (ctx){
return knoxx.backend.infra.routes.app.send_fetch_json_BANG_(reply,"http://127.0.0.1:8796/api/status",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null),knoxx.backend.infra.routes.app.fetch_json_err);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32498,G__32499,G__32500,G__32501) : with_request_context_BANG_.call(null,G__32498,G__32499,G__32500,G__32501));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32494,G__32495,G__32496,G__32497) : route_BANG_.call(null,G__32494,G__32495,G__32496,G__32497));
});
knoxx.backend.infra.routes.app.api_data_graph_view_url_BANG_ = (function knoxx$backend$infra$routes$app$api_data_graph_view_url_BANG_(app,runtime,config,deps){
var map__32502 = deps;
var map__32502__$1 = cljs.core.__destructure_map(map__32502);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32502__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32503 = app;
var G__32504 = "GET";
var G__32505 = "/api/data/graph/view-url";
var G__32506 = (function (request,reply){
var G__32507 = runtime;
var G__32508 = request;
var G__32509 = reply;
var G__32510 = (function (ctx){
var G__32511 = reply;
var G__32512 = (200);
var G__32513 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"url","url",276297046),"http://127.0.0.1:8796"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32511,G__32512,G__32513) : json_response_BANG_.call(null,G__32511,G__32512,G__32513));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32507,G__32508,G__32509,G__32510) : with_request_context_BANG_.call(null,G__32507,G__32508,G__32509,G__32510));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32503,G__32504,G__32505,G__32506) : route_BANG_.call(null,G__32503,G__32504,G__32505,G__32506));
});
knoxx.backend.infra.routes.app.api_knoxx_health_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_health_BANG_(app,runtime,config,deps){
var map__32514 = deps;
var map__32514__$1 = cljs.core.__destructure_map(map__32514);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32514__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32515 = app;
var G__32516 = "GET";
var G__32517 = "/api/knoxx/health";
var G__32518 = (function (request,reply){
var G__32519 = runtime;
var G__32520 = request;
var G__32521 = reply;
var G__32522 = (function (ctx){
return knoxx.backend.infra.routes.app.send_knoxx_health_BANG_(config,reply);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32519,G__32520,G__32521,G__32522) : with_request_context_BANG_.call(null,G__32519,G__32520,G__32521,G__32522));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32515,G__32516,G__32517,G__32518) : route_BANG_.call(null,G__32515,G__32516,G__32517,G__32518));
});
knoxx.backend.infra.routes.app.chat_turn_ok = (function knoxx$backend$infra$routes$app$chat_turn_ok(reply,resp){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),resp);
});
knoxx.backend.infra.routes.app.chat_turn_err = (function knoxx$backend$infra$routes$app$chat_turn_err(reply,err){
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502));
});
knoxx.backend.infra.routes.app.api_knoxx_chat_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_chat_BANG_(app,runtime,config,deps){
var map__32523 = deps;
var map__32523__$1 = cljs.core.__destructure_map(map__32523);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32523__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32524 = app;
var G__32525 = "POST";
var G__32526 = "/api/knoxx/chat";
var G__32527 = (function (request,reply){
var G__32528 = runtime;
var G__32529 = request;
var G__32530 = reply;
var G__32531 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var parsed0 = knoxx.backend.shape.app_shapes.normalize_chat_body(knoxx.backend.infra.http.request_body(request));
var parsed = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parsed0,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),knoxx.backend.infra.routes.app.merged_agent_spec(config,parsed0));
var agent_ctx = knoxx.backend.infra.routes.app.effective_auth_context(ctx,parsed);
var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(parsed,new cljs.core.Keyword(null,"mode","mode",654403691),"rag",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"auth-context","auth-context",320032325),agent_ctx], 0));
try{return knoxx.backend.infra.routes.app.chat_turn_ok(reply,(await knoxx.backend.infra.agent.service.send_agent_turn_BANG_(runtime,config,body)));
}catch (e32532){var err = e32532;
return knoxx.backend.infra.routes.app.chat_turn_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32528,G__32529,G__32530,G__32531) : with_request_context_BANG_.call(null,G__32528,G__32529,G__32530,G__32531));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32524,G__32525,G__32526,G__32527) : route_BANG_.call(null,G__32524,G__32525,G__32526,G__32527));
});
knoxx.backend.infra.routes.app.api_knoxx_chat_start_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_chat_start_BANG_(app,runtime,config,deps){
var map__32533 = deps;
var map__32533__$1 = cljs.core.__destructure_map(map__32533);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32533__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32534 = app;
var G__32535 = "POST";
var G__32536 = "/api/knoxx/chat/start";
var G__32537 = (function (request,reply){
var G__32538 = runtime;
var G__32539 = request;
var G__32540 = reply;
var G__32541 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

return knoxx.backend.infra.routes.app.handle_chat_start(runtime,config,reply,ctx,request);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32538,G__32539,G__32540,G__32541) : with_request_context_BANG_.call(null,G__32538,G__32539,G__32540,G__32541));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32534,G__32535,G__32536,G__32537) : route_BANG_.call(null,G__32534,G__32535,G__32536,G__32537));
});
knoxx.backend.infra.routes.app.api_knoxx_direct_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_direct_BANG_(app,runtime,config,deps){
var map__32542 = deps;
var map__32542__$1 = cljs.core.__destructure_map(map__32542);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32542__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32543 = app;
var G__32544 = "POST";
var G__32545 = "/api/knoxx/direct";
var G__32546 = (function (request,reply){
var G__32547 = runtime;
var G__32548 = request;
var G__32549 = reply;
var G__32550 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var parsed0 = knoxx.backend.shape.app_shapes.normalize_chat_body(knoxx.backend.infra.http.request_body(request));
var parsed = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(parsed0,new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),knoxx.backend.infra.routes.app.merged_agent_spec(config,parsed0));
var agent_ctx = knoxx.backend.infra.routes.app.effective_auth_context(ctx,parsed);
var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(parsed,new cljs.core.Keyword(null,"mode","mode",654403691),"direct",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"auth-context","auth-context",320032325),agent_ctx], 0));
try{return knoxx.backend.infra.routes.app.chat_turn_ok(reply,(await knoxx.backend.infra.agent.service.send_agent_turn_BANG_(runtime,config,body)));
}catch (e32551){var err = e32551;
return knoxx.backend.infra.routes.app.chat_turn_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32547,G__32548,G__32549,G__32550) : with_request_context_BANG_.call(null,G__32547,G__32548,G__32549,G__32550));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32543,G__32544,G__32545,G__32546) : route_BANG_.call(null,G__32543,G__32544,G__32545,G__32546));
});
knoxx.backend.infra.routes.app.api_knoxx_direct_start_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_direct_start_BANG_(app,runtime,config,deps){
var map__32552 = deps;
var map__32552__$1 = cljs.core.__destructure_map(map__32552);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32552__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32553 = app;
var G__32554 = "POST";
var G__32555 = "/api/knoxx/direct/start";
var G__32556 = (function (request,reply){
var G__32557 = runtime;
var G__32558 = request;
var G__32559 = reply;
var G__32560 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

return knoxx.backend.infra.routes.app.handle_direct_start(runtime,config,reply,ctx,request);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32557,G__32558,G__32559,G__32560) : with_request_context_BANG_.call(null,G__32557,G__32558,G__32559,G__32560));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32553,G__32554,G__32555,G__32556) : route_BANG_.call(null,G__32553,G__32554,G__32555,G__32556));
});
knoxx.backend.infra.routes.app.steer_ok = (function knoxx$backend$infra$routes$app$steer_ok(reply,resp){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),resp);
});
knoxx.backend.infra.routes.app.steer_err = (function knoxx$backend$infra$routes$app$steer_err(reply,err){
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(409));
});
knoxx.backend.infra.routes.app.api_knoxx_steer_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_steer_BANG_(app,runtime,config,deps){
var map__32561 = deps;
var map__32561__$1 = cljs.core.__destructure_map(map__32561);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32561__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32562 = app;
var G__32563 = "POST";
var G__32564 = "/api/knoxx/steer";
var G__32565 = (function (request,reply){
var G__32566 = runtime;
var G__32567 = request;
var G__32568 = reply;
var G__32569 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.controls.steer") : ensure_permission_BANG_.call(null,ctx,"agent.controls.steer"));
} else {
}

var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.shape.app_shapes.normalize_control_body(knoxx.backend.infra.http.request_body(request)),new cljs.core.Keyword(null,"kind","kind",-717265803),"steer");
var actor_ctx = knoxx.backend.infra.routes.app.auth_context_with_actor(ctx,new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(body));
knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_(actor_ctx,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body));

try{return knoxx.backend.infra.routes.app.steer_ok(reply,(await knoxx.backend.infra.agent.service.queue_agent_control_BANG_(runtime,config,body)));
}catch (e32570){var err = e32570;
return knoxx.backend.infra.routes.app.steer_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32566,G__32567,G__32568,G__32569) : with_request_context_BANG_.call(null,G__32566,G__32567,G__32568,G__32569));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32562,G__32563,G__32564,G__32565) : route_BANG_.call(null,G__32562,G__32563,G__32564,G__32565));
});
knoxx.backend.infra.routes.app.api_knoxx_follow_up_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_follow_up_BANG_(app,runtime,config,deps){
var map__32571 = deps;
var map__32571__$1 = cljs.core.__destructure_map(map__32571);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32571__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32572 = app;
var G__32573 = "POST";
var G__32574 = "/api/knoxx/follow-up";
var G__32575 = (function (request,reply){
var G__32576 = runtime;
var G__32577 = request;
var G__32578 = reply;
var G__32579 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.controls.follow_up") : ensure_permission_BANG_.call(null,ctx,"agent.controls.follow_up"));
} else {
}

var body = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.shape.app_shapes.normalize_control_body(knoxx.backend.infra.http.request_body(request)),new cljs.core.Keyword(null,"kind","kind",-717265803),"follow_up");
var actor_ctx = knoxx.backend.infra.routes.app.auth_context_with_actor(ctx,new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(body));
knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_(actor_ctx,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(body));

try{return knoxx.backend.infra.routes.app.steer_ok(reply,(await knoxx.backend.infra.agent.service.queue_agent_control_BANG_(runtime,config,body)));
}catch (e32580){var err = e32580;
return knoxx.backend.infra.routes.app.steer_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32576,G__32577,G__32578,G__32579) : with_request_context_BANG_.call(null,G__32576,G__32577,G__32578,G__32579));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32572,G__32573,G__32574,G__32575) : route_BANG_.call(null,G__32572,G__32573,G__32574,G__32575));
});
knoxx.backend.infra.routes.app.abort_ok = (function knoxx$backend$infra$routes$app$abort_ok(reply,resp){
return knoxx.backend.infra.http.json_response_BANG_(reply,(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?(200):(409)),resp);
});
knoxx.backend.infra.routes.app.api_knoxx_abort_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_abort_BANG_(app,runtime,config,deps){
var map__32581 = deps;
var map__32581__$1 = cljs.core.__destructure_map(map__32581);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32581__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32582 = app;
var G__32583 = "POST";
var G__32584 = "/api/knoxx/abort";
var G__32585 = (function (request,reply){
var G__32586 = runtime;
var G__32587 = request;
var G__32588 = reply;
var G__32589 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.controls.steer") : ensure_permission_BANG_.call(null,ctx,"agent.controls.steer"));
} else {
}

var raw = knoxx.backend.infra.http.request_body(request);
var conversation_id = (await (async function (){var or__5162__auto__ = (raw["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["conversationId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var actor_id = (await (async function (){var or__5162__auto__ = (raw["actor_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["actorId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (raw["actor-id"]);
}
}
})());
var actor_ctx = knoxx.backend.infra.routes.app.auth_context_with_actor(ctx,actor_id);
var reason = (await (async function (){var or__5162__auto__ = (raw["reason"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "aborted_by_user";
}
})());
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(conversation_id)))){
var G__32590 = reply;
var G__32591 = (400);
var G__32592 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"conversation_id is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32590,G__32591,G__32592) : json_response_BANG_.call(null,G__32590,G__32591,G__32592));
} else {
knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_(actor_ctx,conversation_id);

try{return knoxx.backend.infra.routes.app.abort_ok(reply,(await knoxx.backend.domain.voice.turn_control.abort_active_turn_BANG_(conversation_id,reason)));
}catch (e32593){var err = e32593;
return knoxx.backend.infra.routes.app.steer_err(reply,err);
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32586,G__32587,G__32588,G__32589) : with_request_context_BANG_.call(null,G__32586,G__32587,G__32588,G__32589));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32582,G__32583,G__32584,G__32585) : route_BANG_.call(null,G__32582,G__32583,G__32584,G__32585));
});
knoxx.backend.infra.routes.app.api_knoxx_session_undo_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_session_undo_BANG_(app,runtime,config,deps){
var map__32594 = deps;
var map__32594__$1 = cljs.core.__destructure_map(map__32594);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32594__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32595 = app;
var G__32596 = "POST";
var G__32597 = "/api/knoxx/session/undo";
var G__32598 = (function (request,reply){
var G__32599 = runtime;
var G__32600 = request;
var G__32601 = reply;
var G__32602 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var raw = knoxx.backend.infra.http.request_body(request);
var session_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["session_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["sessionId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var provided_conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (raw["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["conversationId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var actor_id = (await (async function (){var or__5162__auto__ = (raw["actor_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (raw["actorId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (raw["actor-id"]);
}
}
})());
var actor_ctx = knoxx.backend.infra.routes.app.auth_context_with_actor(ctx,actor_id);
var turns_raw = (await (async function (){var or__5162__auto__ = (raw["turns"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})());
var turns = (await (async function (){var parsed = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(turns_raw)),(10));
if(cljs.core.truth_(isNaN(parsed))){
return (1);
} else {
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),parsed);
}
})());
if(clojure.string.blank_QMARK_(session_id)){
var G__32603 = reply;
var G__32604 = (400);
var G__32605 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"session_id is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32603,G__32604,G__32605) : json_response_BANG_.call(null,G__32603,G__32604,G__32605));
} else {
try{var session = (await knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id));
if((session == null)){
var G__32607 = reply;
var G__32608 = (404);
var G__32609 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Session not found or expired"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32607,G__32608,G__32609) : json_response_BANG_.call(null,G__32607,G__32608,G__32609));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("running",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session))){
var G__32610 = reply;
var G__32611 = (409);
var G__32612 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Cannot undo while a turn is still running"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32610,G__32611,G__32612) : json_response_BANG_.call(null,G__32610,G__32611,G__32612));
} else {
var conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = provided_conversation_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var current_messages = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var rewound_messages = knoxx.backend.infra.stores.mongo_session_store.rewind_messages(current_messages,turns);
var removed_count = (cljs.core.count(current_messages) - cljs.core.count(rewound_messages));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = actor_ctx;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_(conversation_id)));
} else {
return and__5160__auto__;
}
})()))){
knoxx.backend.infra.agent.turn.ensure_conversation_access_BANG_(actor_ctx,conversation_id);
} else {
}

if((removed_count === (0))){
var G__32613 = reply;
var G__32614 = (409);
var G__32615 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"No user turns available to undo"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32613,G__32614,G__32615) : json_response_BANG_.call(null,G__32613,G__32614,G__32615));
} else {
(await knoxx.backend.infra.stores.mongo_session_store.undo_session_turns_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,turns));

var G__32616 = reply;
var G__32617 = (200);
var G__32618 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"removed_count","removed_count",-1925224714),removed_count,new cljs.core.Keyword(null,"remaining_messages","remaining_messages",134744241),cljs.core.count(rewound_messages)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32616,G__32617,G__32618) : json_response_BANG_.call(null,G__32616,G__32617,G__32618));
}

}
}
}catch (e32606){var err = e32606;
return knoxx.backend.infra.routes.app.undo_session_err(reply,err);
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32599,G__32600,G__32601,G__32602) : with_request_context_BANG_.call(null,G__32599,G__32600,G__32601,G__32602));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32595,G__32596,G__32597,G__32598) : route_BANG_.call(null,G__32595,G__32596,G__32597,G__32598));
});
knoxx.backend.infra.routes.app.build_active_runs = (function knoxx$backend$infra$routes$app$build_active_runs(ctx,limit){
var sessions_by_id = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (session){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),session], null);
})),knoxx.backend.infra.stores.mongo_session_store.active_session_snapshots());
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (run){
return knoxx.backend.infra.routes.app.active_run_summary(run,cljs.core.get.cljs$core$IFn$_invoke$arity$2(sessions_by_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run)));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__32621_SHARP_){
return knoxx.backend.infra.auth.authz.run_visible_QMARK_(ctx,p1__32621_SHARP_);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__32620_SHARP_){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__32620_SHARP_));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__32619_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),p1__32619_SHARP_);
}),cljs.core.deref(knoxx.backend.domain.action.run_state.run_order_STAR_))))))));
});
knoxx.backend.infra.routes.app.api_knoxx_agents_active_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_agents_active_BANG_(app,runtime,config,deps){
var map__32622 = deps;
var map__32622__$1 = cljs.core.__destructure_map(map__32622);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32622__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32623 = app;
var G__32624 = "GET";
var G__32625 = "/api/knoxx/agents/active";
var G__32626 = (function (request,reply){
var G__32627 = runtime;
var G__32628 = request;
var G__32629 = reply;
var G__32630 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var limit_raw = (request["query"]["limit"]);
var limit = ((typeof limit_raw === 'string')?cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),parseInt(limit_raw,(10))):(25));
var items = knoxx.backend.infra.routes.app.build_active_runs(ctx,limit);
return knoxx.backend.infra.routes.app.agents_active_ok(reply,items);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32627,G__32628,G__32629,G__32630) : with_request_context_BANG_.call(null,G__32627,G__32628,G__32629,G__32630));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32623,G__32624,G__32625,G__32626) : route_BANG_.call(null,G__32623,G__32624,G__32625,G__32626));
});
knoxx.backend.infra.routes.app.api_admin_agents_active_BANG_ = (function knoxx$backend$infra$routes$app$api_admin_agents_active_BANG_(app,runtime,config,deps){
var map__32631 = deps;
var map__32631__$1 = cljs.core.__destructure_map(map__32631);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32631__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32632 = app;
var G__32633 = "GET";
var G__32634 = "/api/admin/agents/active";
var G__32635 = (function (request,reply){
var G__32636 = runtime;
var G__32637 = request;
var G__32638 = reply;
var G__32639 = (async function (ctx){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var limit_raw = (request["query"]["limit"]);
var limit = (await (async function (){var or__5162__auto__ = knoxx.backend.shape.parse.parse_positive_int(limit_raw);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (200);
}
})());
try{return knoxx.backend.infra.routes.app.agents_active_ok(reply,(await knoxx.backend.infra.routes.app.live_active_agent_summaries_BANG_(limit,false)));
}catch (e32640){var err = e32640;
return knoxx.backend.infra.routes.app.agents_active_err(reply,err);
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32636,G__32637,G__32638,G__32639) : with_request_context_BANG_.call(null,G__32636,G__32637,G__32638,G__32639));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32632,G__32633,G__32634,G__32635) : route_BANG_.call(null,G__32632,G__32633,G__32634,G__32635));
});
knoxx.backend.infra.routes.app.api_admin_agents_abort_BANG_ = (function knoxx$backend$infra$routes$app$api_admin_agents_abort_BANG_(app,runtime,config,deps){
var map__32641 = deps;
var map__32641__$1 = cljs.core.__destructure_map(map__32641);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32641__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32642 = app;
var G__32643 = "POST";
var G__32644 = "/api/admin/agents/abort";
var G__32645 = (function (request,reply){
var G__32646 = runtime;
var G__32647 = request;
var G__32648 = reply;
var G__32649 = (function (ctx){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

return knoxx.backend.infra.routes.app.handle_admin_abort(reply,ctx,request);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32646,G__32647,G__32648,G__32649) : with_request_context_BANG_.call(null,G__32646,G__32647,G__32648,G__32649));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32642,G__32643,G__32644,G__32645) : route_BANG_.call(null,G__32642,G__32643,G__32644,G__32645));
});
knoxx.backend.infra.routes.app.api_knoxx_session_status_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_session_status_BANG_(app,runtime,config,deps){
var map__32650 = deps;
var map__32650__$1 = cljs.core.__destructure_map(map__32650);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32650__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32651 = app;
var G__32652 = "GET";
var G__32653 = "/api/knoxx/session/status";
var G__32654 = (function (request,reply){
var G__32655 = runtime;
var G__32656 = request;
var G__32657 = reply;
var G__32658 = (function (ctx){
return knoxx.backend.infra.routes.app.handle_session_status(runtime,config,reply,request);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32655,G__32656,G__32657,G__32658) : with_request_context_BANG_.call(null,G__32655,G__32656,G__32657,G__32658));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32651,G__32652,G__32653,G__32654) : route_BANG_.call(null,G__32651,G__32652,G__32653,G__32654));
});
knoxx.backend.infra.routes.app.api_knoxx_run_events_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_run_events_BANG_(app,runtime,config,deps){
var map__32659 = deps;
var map__32659__$1 = cljs.core.__destructure_map(map__32659);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32659__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32660 = app;
var G__32661 = "GET";
var G__32662 = "/api/knoxx/run/:runId/events";
var G__32663 = (function (request,reply){
var G__32664 = runtime;
var G__32665 = request;
var G__32666 = reply;
var G__32667 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var run_id = (request["params"]["runId"]);
var since = (await (async function (){var or__5162__auto__ = (request["query"]["since"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(run_id)){
var G__32668 = reply;
var G__32669 = (400);
var G__32670 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"runId is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32668,G__32669,G__32670) : json_response_BANG_.call(null,G__32668,G__32669,G__32670));
} else {
try{return knoxx.backend.infra.routes.app.run_events_ok(reply,run_id,(await knoxx.backend.domain.action.run_state.get_run_events_since(run_id,since)));
}catch (e32671){var err = e32671;
return knoxx.backend.infra.routes.app.run_events_err(reply,err);
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32664,G__32665,G__32666,G__32667) : with_request_context_BANG_.call(null,G__32664,G__32665,G__32666,G__32667));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32660,G__32661,G__32662,G__32663) : route_BANG_.call(null,G__32660,G__32661,G__32662,G__32663));
});
knoxx.backend.infra.routes.app.api_knoxx_run_get_BANG_ = (function knoxx$backend$infra$routes$app$api_knoxx_run_get_BANG_(app,runtime,config,deps){
var map__32672 = deps;
var map__32672__$1 = cljs.core.__destructure_map(map__32672);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32672__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32673 = app;
var G__32674 = "GET";
var G__32675 = "/api/knoxx/runs/:runId";
var G__32676 = (function (request,reply){
var G__32677 = runtime;
var G__32678 = request;
var G__32679 = reply;
var G__32680 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var run_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["params"]["runId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(clojure.string.blank_QMARK_(run_id)){
var G__32681 = reply;
var G__32682 = (400);
var G__32683 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"runId required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32681,G__32682,G__32683) : json_response_BANG_.call(null,G__32681,G__32682,G__32683));
} else {
if((!((cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),run_id) == null)))){
var temp__5823__auto__ = knoxx.backend.infra.auth.authz.run_visible_QMARK_(ctx,cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),run_id));
if(temp__5823__auto__){
var filtered = temp__5823__auto__;
var G__32684 = reply;
var G__32685 = (200);
var G__32686 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"source","source",-433931539),"memory",new cljs.core.Keyword(null,"run","run",-1821166653),filtered], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32684,G__32685,G__32686) : json_response_BANG_.call(null,G__32684,G__32685,G__32686));
} else {
var G__32687 = reply;
var G__32688 = (403);
var G__32689 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Access denied"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32687,G__32688,G__32689) : json_response_BANG_.call(null,G__32687,G__32688,G__32689));
}
} else {
var G__32690 = reply;
var G__32691 = (404);
var G__32692 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"error","error",-978969032),"Run not found",new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32690,G__32691,G__32692) : json_response_BANG_.call(null,G__32690,G__32691,G__32692));

}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32677,G__32678,G__32679,G__32680) : with_request_context_BANG_.call(null,G__32677,G__32678,G__32679,G__32680));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32673,G__32674,G__32675,G__32676) : route_BANG_.call(null,G__32673,G__32674,G__32675,G__32676));
});
knoxx.backend.infra.routes.app.api_shibboleth_handoff_BANG_ = (function knoxx$backend$infra$routes$app$api_shibboleth_handoff_BANG_(app,runtime,config,deps){
var map__32693 = deps;
var map__32693__$1 = cljs.core.__destructure_map(map__32693);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32693__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__32694 = app;
var G__32695 = "POST";
var G__32696 = "/api/shibboleth/handoff";
var G__32697 = (function (request,reply){
var G__32698 = runtime;
var G__32699 = request;
var G__32700 = reply;
var G__32701 = (async function (ctx){
var body = knoxx.backend.infra.http.request_body(request);
if(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"shibboleth-base-url","shibboleth-base-url",-351013125).cljs$core$IFn$_invoke$arity$1(config))){
var G__32702 = reply;
var G__32703 = (503);
var G__32704 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"SHIBBOLETH_BASE_URL is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__32702,G__32703,G__32704) : json_response_BANG_.call(null,G__32702,G__32703,G__32704));
} else {
var payload = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"source_app","source_app",950857148),"knoxx",new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954),new cljs.core.Keyword(null,"system_prompt","system_prompt",-655033954).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"provider","provider",-302056900),new cljs.core.Keyword(null,"provider","provider",-302056900).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(body),new cljs.core.Keyword(null,"fake_tools_enabled","fake_tools_enabled",422735166),cljs.core.boolean$(new cljs.core.Keyword(null,"fake_tools_enabled","fake_tools_enabled",422735166).cljs$core$IFn$_invoke$arity$1(body)),new cljs.core.Keyword(null,"items","items",1031954938),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"items","items",1031954938).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null);
try{var resp = (await (await (async function (){var G__32706 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"shibboleth-base-url","shibboleth-base-url",-351013125).cljs$core$IFn$_invoke$arity$1(config))+"/api/chat/import");
var G__32707 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"json","json",1279968570),payload], null);
return (fetch_json.cljs$core$IFn$_invoke$arity$2 ? fetch_json.cljs$core$IFn$_invoke$arity$2(G__32706,G__32707) : fetch_json.call(null,G__32706,G__32707));
})()));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return knoxx.backend.infra.routes.app.shibboleth_ok(config,reply,request,body,new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
} else {
return knoxx.backend.infra.routes.app.shibboleth_import_failed(reply,resp);
}
}catch (e32705){var err = e32705;
return knoxx.backend.infra.routes.app.shibboleth_unreachable(reply,err);
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__32698,G__32699,G__32700,G__32701) : with_request_context_BANG_.call(null,G__32698,G__32699,G__32700,G__32701));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__32694,G__32695,G__32696,G__32697) : route_BANG_.call(null,G__32694,G__32695,G__32696,G__32697));
});
knoxx.backend.infra.routes.app.register_core_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_core_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.app.health_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.dev_hmr_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.config_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_agents_catalog_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

return knoxx.backend.infra.routes.app.api_auth_context_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);
});
knoxx.backend.infra.routes.app.register_admin_and_memory_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_admin_and_memory_routes_BANG_(app,runtime,config,lounge_messages_STAR_){
knoxx.backend.infra.routes.admin.register_admin_routes_BANG_(app,runtime,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183),new cljs.core.Keyword(null,"ensure-any-permission!","ensure-any-permission!",1999271593),new cljs.core.Keyword(null,"json-response!","json-response!",103570476),new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),new cljs.core.Keyword(null,"http-error","http-error",-1040049553),new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935),new cljs.core.Keyword(null,"ensure-org-scope!","ensure-org-scope!",-1115734566),new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163)],[knoxx.backend.shape.app_shapes.route_BANG_,knoxx.backend.infra.auth.authz.policy_db,knoxx.backend.infra.auth.authz.ensure_any_permission_BANG_,knoxx.backend.infra.http.json_response_BANG_,knoxx.backend.infra.auth.authz.with_request_context_BANG_,knoxx.backend.infra.http.http_error,knoxx.backend.infra.auth.authz.policy_db_promise,knoxx.backend.infra.auth.authz.ensure_org_scope_BANG_,knoxx.backend.infra.auth.authz.ensure_permission_BANG_]));

return knoxx.backend.infra.routes.memory.register_memory_routes_BANG_(app,runtime,config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"openplanner-memory-search!","openplanner-memory-search!",1781688896),new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"ctx-permitted?","ctx-permitted?",-1842773024),new cljs.core.Keyword(null,"filter-authorized-memory-hits!","filter-authorized-memory-hits!",-1951695933),new cljs.core.Keyword(null,"session-matches-page-actor-filter?","session-matches-page-actor-filter?",2088135972),new cljs.core.Keyword(null,"cache-session-title-entry!","cache-session-title-entry!",-1970978492),new cljs.core.Keyword(null,"heuristic-session-title","heuristic-session-title",1513408292),new cljs.core.Keyword(null,"authorized-session-ids!","authorized-session-ids!",999199653),new cljs.core.Keyword(null,"system-admin?","system-admin?",-148862842),new cljs.core.Keyword(null,"fetch-openplanner-session-rows!","fetch-openplanner-session-rows!",1014940648),new cljs.core.Keyword(null,"now-iso","now-iso",74414857),new cljs.core.Keyword(null,"get-cached-session-title!","get-cached-session-title!",1808522986),new cljs.core.Keyword(null,"parse-positive-int","parse-positive-int",728793034),new cljs.core.Keyword(null,"json-response!","json-response!",103570476),new cljs.core.Keyword(null,"session-title-backfill*","session-title-backfill*",-1810746770),new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),new cljs.core.Keyword(null,"normalize-session-title","normalize-session-title",-1159928850),new cljs.core.Keyword(null,"http-error","http-error",-1040049553),new cljs.core.Keyword(null,"lounge-messages*","lounge-messages*",-1382832656),new cljs.core.Keyword(null,"session-titles*","session-titles*",1985458162),new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),new cljs.core.Keyword(null,"truthy-param?","truthy-param?",-219040013),new cljs.core.Keyword(null,"stored-session-title-entry","stored-session-title-entry",803389171),new cljs.core.Keyword(null,"cache-session-title!","cache-session-title!",1861418325),new cljs.core.Keyword(null,"session-visible?","session-visible?",-1647736199),new cljs.core.Keyword(null,"session-title-seed-text","session-title-seed-text",1029264443),new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),new cljs.core.Keyword(null,"broadcast-ws!","broadcast-ws!",-1433906309),new cljs.core.Keyword(null,"start-session-title-backfill!","start-session-title-backfill!",1417456380),new cljs.core.Keyword(null,"resolve-session-title!","resolve-session-title!",-281505699)],[knoxx.backend.infra.openplanner.memory.openplanner_memory_search_BANG_,knoxx.backend.shape.app_shapes.route_BANG_,knoxx.backend.infra.auth.authz.ctx_permitted_QMARK_,knoxx.backend.infra.core_memory.filter_authorized_memory_hits_BANG_,knoxx.backend.infra.core_memory.session_matches_page_actor_filter_QMARK_,knoxx.backend.infra.stores.session_titles.cache_session_title_entry_BANG_,knoxx.backend.infra.stores.session_titles.heuristic_session_title,knoxx.backend.infra.core_memory.authorized_session_ids_BANG_,knoxx.backend.infra.auth.authz.system_admin_QMARK_,knoxx.backend.infra.core_memory.fetch_openplanner_session_rows_BANG_,knoxx.backend.domain.time.now_iso,knoxx.backend.infra.stores.session_titles.get_cached_session_title_BANG_,knoxx.backend.shape.parse.parse_positive_int,knoxx.backend.infra.http.json_response_BANG_,knoxx.backend.infra.stores.session_titles.session_title_backfill_STAR_,knoxx.backend.infra.auth.authz.with_request_context_BANG_,knoxx.backend.infra.stores.session_titles.normalize_session_title,knoxx.backend.infra.http.http_error,lounge_messages_STAR_,knoxx.backend.infra.stores.session_titles.session_titles_STAR_,knoxx.backend.infra.http.error_response_BANG_,knoxx.backend.shape.parse.truthy_param_QMARK_,knoxx.backend.infra.stores.session_titles.stored_session_title_entry,knoxx.backend.infra.stores.session_titles.cache_session_title_BANG_,knoxx.backend.infra.core_memory.session_visible_QMARK_,knoxx.backend.infra.stores.session_titles.session_title_seed_text,knoxx.backend.infra.auth.authz.ensure_permission_BANG_,knoxx.backend.domain.realtime.broadcast_ws_BANG_,knoxx.backend.infra.stores.session_titles.start_session_title_backfill_BANG_,knoxx.backend.infra.stores.session_titles.resolve_session_title_BANG_]));
});
knoxx.backend.infra.routes.app.register_tooling_route_groups_BANG_ = (function knoxx$backend$infra$routes$app$register_tooling_route_groups_BANG_(app,runtime,config){
var session_guard = knoxx.backend.law.guards.make_session_guard(runtime);
var optional_session_guard = knoxx.backend.law.guards.make_optional_session_guard(runtime);
knoxx.backend.infra.routes.tools.register_tool_routes_BANG_(app,runtime,config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"resolve-workspace-path","resolve-workspace-path",-1439207488),new cljs.core.Keyword(null,"tool-catalog","tool-catalog",899421286),new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954),new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577),new cljs.core.Keyword(null,"count-occurrences","count-occurrences",1068095177),new cljs.core.Keyword(null,"json-response!","json-response!",103570476),new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966),new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615),new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),new cljs.core.Keyword(null,"replace-first","replace-first",1710901438)],[knoxx.backend.shape.app_shapes.route_BANG_,knoxx.backend.infra.agent.runtime.resolve_workspace_path,knoxx.backend.infra.tooling.tool_catalog,session_guard,knoxx.backend.infra.tooling.ensure_role_can_use_BANG_,knoxx.backend.domain.text.count_occurrences,knoxx.backend.infra.http.json_response_BANG_,knoxx.backend.infra.auth.authz.with_request_context_BANG_,optional_session_guard,knoxx.backend.infra.http.error_response_BANG_,knoxx.backend.domain.text.clip_text,knoxx.backend.infra.auth.authz.ensure_permission_BANG_,knoxx.backend.domain.text.replace_first]));

return knoxx.backend.infra.routes.actors.register_actor_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"route!","route!",-1286958144),knoxx.backend.shape.app_shapes.route_BANG_,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),knoxx.backend.infra.http.error_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),knoxx.backend.infra.auth.authz.ensure_permission_BANG_,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954),session_guard], null));
});
knoxx.backend.infra.routes.app.register_resource_and_media_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_resource_and_media_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.resources.register_resource_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"route!","route!",-1286958144),knoxx.backend.shape.app_shapes.route_BANG_,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),knoxx.backend.infra.http.error_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),knoxx.backend.infra.auth.authz.ensure_permission_BANG_], null));

knoxx.backend.infra.routes.models.register_model_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.voice.register_voice_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"route!","route!",-1286958144),knoxx.backend.shape.app_shapes.route_BANG_,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),knoxx.backend.infra.auth.authz.ensure_tool_BANG_], null));

knoxx.backend.infra.routes.documents.register_document_routes_BANG_(app,runtime,config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848),new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"openai-auth-error","openai-auth-error",-466046941),new cljs.core.Keyword(null,"json-response!","json-response!",103570476),new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000),new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310),new cljs.core.Keyword(null,"openplanner-graph-export!","openplanner-graph-export!",-1726254887),new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615),new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686)],[knoxx.backend.infra.http.request_query_string,knoxx.backend.shape.app_shapes.route_BANG_,knoxx.backend.infra.http.openai_auth_error,knoxx.backend.infra.http.json_response_BANG_,knoxx.backend.infra.auth.authz.with_request_context_BANG_,knoxx.backend.infra.http.send_fetch_response_BANG_,knoxx.backend.infra.http.error_response_BANG_,knoxx.backend.infra.http.bearer_headers,knoxx.backend.infra.openplanner.memory.openplanner_graph_export_BANG_,knoxx.backend.domain.text.clip_text,knoxx.backend.infra.auth.authz.ensure_permission_BANG_,knoxx.backend.infra.http.fetch_json]));

knoxx.backend.infra.routes.workspace_media.register_workspace_media_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"route!","route!",-1286958144),knoxx.backend.shape.app_shapes.route_BANG_,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),knoxx.backend.infra.http.error_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),knoxx.backend.infra.auth.authz.ensure_tool_BANG_], null));

return knoxx.backend.infra.routes.studio.register_studio_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"route!","route!",-1286958144),knoxx.backend.shape.app_shapes.route_BANG_,new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),knoxx.backend.infra.http.error_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),knoxx.backend.infra.auth.authz.ensure_tool_BANG_,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),knoxx.backend.infra.auth.authz.ensure_permission_BANG_,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183),knoxx.backend.infra.auth.authz.policy_db,new cljs.core.Keyword(null,"policy-db-promise","policy-db-promise",-584929935),knoxx.backend.infra.auth.authz.policy_db_promise], null));
});
knoxx.backend.infra.routes.app.register_ingestion_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_ingestion_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.app.api_knoxx_proxy_get_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_proxy_post_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_proxy_put_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_proxy_patch_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_proxy_delete_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_browse_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_file_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_sources_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_jobs_get_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_jobs_post_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_proxy_get_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_ingestion_proxy_post_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

return knoxx.backend.infra.routes.app.api_ingestion_proxy_delete_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);
});
knoxx.backend.infra.routes.app.register_data_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_data_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.app.api_data_op_get_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_op_post_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_op_patch_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_op_delete_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_health_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_mongo_collections_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_mongo_list_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_mongo_query_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_pg_tables_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_jobs_build_semantic_edges_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_pg_query_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_browse_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_file_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_graphql_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_data_graph_status_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

return knoxx.backend.infra.routes.app.api_data_graph_view_url_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);
});
knoxx.backend.infra.routes.app.register_knoxx_run_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_knoxx_run_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.app.api_knoxx_health_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_chat_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_chat_start_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_direct_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_direct_start_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_steer_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_follow_up_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_abort_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_session_undo_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_agents_active_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_admin_agents_active_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_admin_agents_abort_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_session_status_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_run_events_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

knoxx.backend.infra.routes.app.api_knoxx_run_get_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);

return knoxx.backend.infra.routes.app.api_shibboleth_handoff_BANG_(app,runtime,config,knoxx.backend.infra.routes.app.deps);
});
knoxx.backend.infra.routes.app.register_translation_route_group_BANG_ = (function knoxx$backend$infra$routes$app$register_translation_route_group_BANG_(app,runtime,config){
return knoxx.backend.infra.routes.translation.register_translation_routes_BANG_(app,runtime,config,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"json-response!","json-response!",103570476),knoxx.backend.infra.http.json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),knoxx.backend.infra.http.error_response_BANG_,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046),knoxx.backend.infra.auth.authz.with_request_context_BANG_,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163),knoxx.backend.infra.auth.authz.ensure_permission_BANG_,new cljs.core.Keyword(null,"ctx-user-id","ctx-user-id",-259951088),knoxx.backend.infra.auth.authz.ctx_user_id,new cljs.core.Keyword(null,"ctx-user-email","ctx-user-email",-64148717),knoxx.backend.infra.auth.authz.ctx_user_email,new cljs.core.Keyword(null,"ctx-org-id","ctx-org-id",949922116),knoxx.backend.infra.auth.authz.ctx_org_id], null));
});
knoxx.backend.infra.routes.app.register_routes_BANG_ = (function knoxx$backend$infra$routes$app$register_routes_BANG_(runtime,app,config,lounge_messages_STAR_){
knoxx.backend.infra.agent.hydration.ensure_settings_BANG_(config);

knoxx.backend.infra.routes.app.register_core_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.app.register_admin_and_memory_routes_BANG_(app,runtime,config,lounge_messages_STAR_);

knoxx.backend.infra.routes.app.register_tooling_route_groups_BANG_(app,runtime,config);

knoxx.backend.infra.routes.app.register_resource_and_media_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.app.register_ingestion_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.app.register_data_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.app.register_knoxx_run_routes_BANG_(app,runtime,config);

return knoxx.backend.infra.routes.app.register_translation_route_group_BANG_(app,runtime,config);
});

//# sourceMappingURL=knoxx.backend.infra.routes.app.js.map
