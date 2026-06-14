import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.shape.app_shapes.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.clients.proxx.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.routes.models');
knoxx.backend.infra.routes.models.proxx_configured_QMARK_ = (function knoxx$backend$infra$routes$models$proxx_configured_QMARK_(config){
return knoxx.backend.infra.clients.proxx.configured_QMARK_(config);
});
/**
 * Best-effort extraction of a stable Knoxx session key from request headers.
 * 
 * Knoxx frontend always sends x-knoxx-session-id. We map that to Proxx's
 * prompt_cache_key for provider+account session affinity.
 */
knoxx.backend.infra.routes.models.request_session_key = (function knoxx$backend$infra$routes$models$request_session_key(request){
var headers = (function (){var or__5162__auto__ = (request["headers"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var v = (function (){var or__5162__auto__ = (headers["x-knoxx-session-id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (headers["x-session-id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (headers["x-open-hax-session-id"]);
}
}
})();
if(typeof v === 'string'){
var trimmed = clojure.string.trim(v);
if(clojure.string.blank_QMARK_(trimmed)){
return null;
} else {
return trimmed;
}
} else {
return null;
}
});
/**
 * Mutates payload in-place, adding prompt_cache_key when missing.
 * 
 * Proxx uses prompt_cache_key as the affinity key in routing + analytics.
 */
knoxx.backend.infra.routes.models.ensure_prompt_cache_key_BANG_ = (function knoxx$backend$infra$routes$models$ensure_prompt_cache_key_BANG_(request,payload){
var session_key_29610 = knoxx.backend.infra.routes.models.request_session_key(request);
var existing_29611 = (function (){var or__5162__auto__ = (payload["prompt_cache_key"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (payload["promptCacheKey"]);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = session_key_29610;
if(cljs.core.truth_(and__5160__auto__)){
return (((existing_29611 == null)) || (clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(existing_29611)))));
} else {
return and__5160__auto__;
}
})())){
(payload["prompt_cache_key"] = session_key_29610);
} else {
}

return payload;
});
knoxx.backend.infra.routes.models.model_policy_allowed_ids = (function knoxx$backend$infra$routes$models$model_policy_allowed_ids(ctx){
var constraints = knoxx.backend.infra.auth.authz.ctx_tool_constraints(ctx,"agent.chat");
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
return cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (value){
if(typeof value === 'string'){
var trimmed = clojure.string.trim(value);
if(clojure.string.blank_QMARK_(trimmed)){
return null;
} else {
return trimmed;
}
} else {
return null;
}
}),((cljs.core.sequential_QMARK_(raw))?raw:(cljs.core.truth_(cljs.core.array_QMARK_(raw))?cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(raw):cljs.core.PersistentVector.EMPTY
))));
});
knoxx.backend.infra.routes.models.filter_model_items_for_ctx = (function knoxx$backend$infra$routes$models$filter_model_items_for_ctx(ctx,items,config){
var allowed_by_policy = knoxx.backend.infra.routes.models.model_policy_allowed_ids(ctx);
return cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (item){
var model_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(item);
return ((knoxx.backend.domain.models.allowlisted_model_id_QMARK_(config,model_id)) && (((cljs.core.empty_QMARK_(allowed_by_policy)) || (cljs.core.contains_QMARK_(allowed_by_policy,model_id)))));
}),items);
});
knoxx.backend.infra.routes.models.proxx_health_ctx = (function knoxx$backend$infra$routes$models$proxx_health_ctx(config,request,reply){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"request","request",1772954723),request,new cljs.core.Keyword(null,"reply","reply",1144328671),reply,new cljs.core.Keyword(null,"configured","configured",-884777889),knoxx.backend.infra.routes.models.proxx_configured_QMARK_(config),new cljs.core.Keyword(null,"default-model","default-model",-1201018527),new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_)),new cljs.core.Keyword(null,"proxx-client","proxx-client",1407862034),knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)], null);
});
knoxx.backend.infra.routes.models.send_proxx_health_unconfigured_BANG_ = (function knoxx$backend$infra$routes$models$send_proxx_health_unconfigured_BANG_(p__29386){
var map__29387 = p__29386;
var map__29387__$1 = cljs.core.__destructure_map(map__29387);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29387__$1,new cljs.core.Keyword(null,"config","config",994861415));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29387__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var default_model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29387__$1,new cljs.core.Keyword(null,"default-model","default-model",-1201018527));
knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"reachable","reachable",-1495191549),false,new cljs.core.Keyword(null,"configured","configured",-884777889),false,new cljs.core.Keyword(null,"base_url","base_url",-1764155256),new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"status_code","status_code",-572644263),(503),new cljs.core.Keyword(null,"default_model","default_model",516528790),default_model], null));

return reply;
});
knoxx.backend.infra.routes.models.fetch_proxx_health = (function knoxx$backend$infra$routes$models$fetch_proxx_health(p__29393){
var map__29398 = p__29393;
var map__29398__$1 = cljs.core.__destructure_map(map__29398);
var proxx_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29398__$1,new cljs.core.Keyword(null,"proxx-client","proxx-client",1407862034));
return knoxx.backend.infra.clients.proxx.health_BANG_(proxx_client);
});
knoxx.backend.infra.routes.models.send_proxx_health_success_BANG_ = (function knoxx$backend$infra$routes$models$send_proxx_health_success_BANG_(p__29404,resp){
var map__29405 = p__29404;
var map__29405__$1 = cljs.core.__destructure_map(map__29405);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29405__$1,new cljs.core.Keyword(null,"config","config",994861415));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29405__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var default_model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29405__$1,new cljs.core.Keyword(null,"default-model","default-model",-1201018527));
var body = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
var key_pool = new cljs.core.Keyword(null,"keyPool","keyPool",-1406640331).cljs$core$IFn$_invoke$arity$1(body);
knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"reachable","reachable",-1495191549),cljs.core.boolean$(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp)),new cljs.core.Keyword(null,"configured","configured",-884777889),true,new cljs.core.Keyword(null,"base_url","base_url",-1764155256),new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"model_count","model_count",-986279688),((typeof new cljs.core.Keyword(null,"modelCount","modelCount",160555007).cljs$core$IFn$_invoke$arity$1(body) === 'number')?new cljs.core.Keyword(null,"modelCount","modelCount",160555007).cljs$core$IFn$_invoke$arity$1(body):((typeof new cljs.core.Keyword(null,"totalKeys","totalKeys",-1541068090).cljs$core$IFn$_invoke$arity$1(key_pool) === 'number')?new cljs.core.Keyword(null,"totalKeys","totalKeys",-1541068090).cljs$core$IFn$_invoke$arity$1(key_pool):null
)),new cljs.core.Keyword(null,"default_model","default_model",516528790),default_model], null));

return reply;
});
knoxx.backend.infra.routes.models.send_proxx_health_failure_BANG_ = (function knoxx$backend$infra$routes$models$send_proxx_health_failure_BANG_(p__29410){
var map__29412 = p__29410;
var map__29412__$1 = cljs.core.__destructure_map(map__29412);
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29412__$1,new cljs.core.Keyword(null,"config","config",994861415));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29412__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
var default_model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29412__$1,new cljs.core.Keyword(null,"default-model","default-model",-1201018527));
knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"reachable","reachable",-1495191549),false,new cljs.core.Keyword(null,"configured","configured",-884777889),true,new cljs.core.Keyword(null,"base_url","base_url",-1764155256),new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"status_code","status_code",-572644263),(502),new cljs.core.Keyword(null,"default_model","default_model",516528790),default_model], null));

return reply;
});
knoxx.backend.infra.routes.models.send_proxx_health_BANG_ = (async function knoxx$backend$infra$routes$models$send_proxx_health_BANG_(ctx){
if(cljs.core.not(new cljs.core.Keyword(null,"configured","configured",-884777889).cljs$core$IFn$_invoke$arity$1(ctx))){
return knoxx.backend.infra.routes.models.send_proxx_health_unconfigured_BANG_(ctx);
} else {
try{var resp = (await knoxx.backend.infra.routes.models.fetch_proxx_health(ctx));
return knoxx.backend.infra.routes.models.send_proxx_health_success_BANG_(ctx,resp);
}catch (e29423){var _err = e29423;
return knoxx.backend.infra.routes.models.send_proxx_health_failure_BANG_(ctx);
}}
});
knoxx.backend.infra.routes.models.proxx_models_ctx = (function knoxx$backend$infra$routes$models$proxx_models_ctx(config,request,reply,auth_ctx){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"request","request",1772954723),request,new cljs.core.Keyword(null,"reply","reply",1144328671),reply,new cljs.core.Keyword(null,"auth","auth",1389754926),auth_ctx,new cljs.core.Keyword(null,"proxx-client","proxx-client",1407862034),knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)], null);
});
knoxx.backend.infra.routes.models.fetch_proxx_models = (function knoxx$backend$infra$routes$models$fetch_proxx_models(p__29431){
var map__29432 = p__29431;
var map__29432__$1 = cljs.core.__destructure_map(map__29432);
var proxx_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29432__$1,new cljs.core.Keyword(null,"proxx-client","proxx-client",1407862034));
return knoxx.backend.infra.clients.proxx.models_BANG_(proxx_client);
});
knoxx.backend.infra.routes.models.send_proxx_models_success_BANG_ = (function knoxx$backend$infra$routes$models$send_proxx_models_success_BANG_(p__29433,resp){
var map__29434 = p__29433;
var map__29434__$1 = cljs.core.__destructure_map(map__29434);
var auth = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29434__$1,new cljs.core.Keyword(null,"auth","auth",1389754926));
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29434__$1,new cljs.core.Keyword(null,"config","config",994861415));
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29434__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
var items_29613 = (function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resp,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.Keyword(null,"data","data",-232669377)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
var filtered_29614 = cljs.core.vec(knoxx.backend.infra.routes.models.filter_model_items_for_ctx(auth,items_29613,config));
knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"models","models",-1985455662),filtered_29614], null));
} else {
knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"Proxx model list failed",new cljs.core.Keyword(null,"details","details",1956795411),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null));
}

return reply;
});
knoxx.backend.infra.routes.models.send_proxx_models_failure_BANG_ = (function knoxx$backend$infra$routes$models$send_proxx_models_failure_BANG_(p__29444,err){
var map__29446 = p__29444;
var map__29446__$1 = cljs.core.__destructure_map(map__29446);
var reply = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29446__$1,new cljs.core.Keyword(null,"reply","reply",1144328671));
knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));

return reply;
});
knoxx.backend.infra.routes.models.send_proxx_models_BANG_ = (async function knoxx$backend$infra$routes$models$send_proxx_models_BANG_(ctx){
try{var resp = (await knoxx.backend.infra.routes.models.fetch_proxx_models(ctx));
return knoxx.backend.infra.routes.models.send_proxx_models_success_BANG_(ctx,resp);
}catch (e29448){var err = e29448;
return knoxx.backend.infra.routes.models.send_proxx_models_failure_BANG_(ctx,err);
}});
knoxx.backend.infra.routes.models.register_proxx_health_route_BANG_ = (function knoxx$backend$infra$routes$models$register_proxx_health_route_BANG_(app,config){
return knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/api/proxx/health",(function (request,reply){
return knoxx.backend.infra.routes.models.send_proxx_health_BANG_(knoxx.backend.infra.routes.models.proxx_health_ctx(config,request,reply));
}));
});
knoxx.backend.infra.routes.models.handle_proxx_observability_request_BANG_ = (async function knoxx$backend$infra$routes$models$handle_proxx_observability_request_BANG_(handler,error_label,config,request,reply,ctx){
try{knoxx.backend.infra.auth.authz.ensure_permission_BANG_(ctx,"org.proxx.observability.read");

if((!(knoxx.backend.infra.routes.models.proxx_configured_QMARK_(config)))){
return knoxx.backend.infra.http.json_response_BANG_(reply,(503),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"Proxx is not configured"], null));
} else {
try{var resp = (await (await (async function (){var G__29466 = knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config);
var G__29467 = knoxx.backend.infra.http.request_query_string(request);
return (handler.cljs$core$IFn$_invoke$arity$2 ? handler.cljs$core$IFn$_invoke$arity$2(G__29466,G__29467) : handler.call(null,G__29466,G__29467));
})()));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),error_label,new cljs.core.Keyword(null,"details","details",1956795411),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null));
}
}catch (e29463){var err = e29463;
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}}
}catch (e29461){var err = e29461;
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err);
}});
knoxx.backend.infra.routes.models.register_proxx_observability_routes_BANG_ = (function knoxx$backend$infra$routes$models$register_proxx_observability_routes_BANG_(app,runtime,config){
var seq__29474 = cljs.core.seq(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["/api/proxx/observability/request-logs",knoxx.backend.infra.clients.proxx.request_logs_BANG_,"Proxx request logs failed"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["/api/proxx/observability/dashboard/overview",knoxx.backend.infra.clients.proxx.dashboard_overview_BANG_,"Proxx dashboard overview failed"], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["/api/proxx/observability/analytics/provider-model",knoxx.backend.infra.clients.proxx.provider_model_analytics_BANG_,"Proxx provider-model analytics failed"], null)], null));
var chunk__29475 = null;
var count__29476 = (0);
var i__29477 = (0);
while(true){
if((i__29477 < count__29476)){
var vec__29492 = chunk__29475.cljs$core$IIndexed$_nth$arity$2(null,i__29477);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29492,(0),null);
var handler = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29492,(1),null);
var error_label = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29492,(2),null);
knoxx.backend.shape.app_shapes.route_BANG_(app,"GET",path,((function (seq__29474,chunk__29475,count__29476,i__29477,vec__29492,path,handler,error_label){
return (function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.models.handle_proxx_observability_request_BANG_,handler,error_label,config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([request,reply], 0)));
});})(seq__29474,chunk__29475,count__29476,i__29477,vec__29492,path,handler,error_label))
);


var G__29615 = seq__29474;
var G__29616 = chunk__29475;
var G__29617 = count__29476;
var G__29618 = (i__29477 + (1));
seq__29474 = G__29615;
chunk__29475 = G__29616;
count__29476 = G__29617;
i__29477 = G__29618;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__29474);
if(temp__5825__auto__){
var seq__29474__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__29474__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__29474__$1);
var G__29619 = cljs.core.chunk_rest(seq__29474__$1);
var G__29620 = c__5694__auto__;
var G__29621 = cljs.core.count(c__5694__auto__);
var G__29622 = (0);
seq__29474 = G__29619;
chunk__29475 = G__29620;
count__29476 = G__29621;
i__29477 = G__29622;
continue;
} else {
var vec__29496 = cljs.core.first(seq__29474__$1);
var path = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29496,(0),null);
var handler = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29496,(1),null);
var error_label = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29496,(2),null);
knoxx.backend.shape.app_shapes.route_BANG_(app,"GET",path,((function (seq__29474,chunk__29475,count__29476,i__29477,vec__29496,path,handler,error_label,seq__29474__$1,temp__5825__auto__){
return (function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.models.handle_proxx_observability_request_BANG_,handler,error_label,config,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([request,reply], 0)));
});})(seq__29474,chunk__29475,count__29476,i__29477,vec__29496,path,handler,error_label,seq__29474__$1,temp__5825__auto__))
);


var G__29623 = cljs.core.next(seq__29474__$1);
var G__29624 = null;
var G__29625 = (0);
var G__29626 = (0);
seq__29474 = G__29623;
chunk__29475 = G__29624;
count__29476 = G__29625;
i__29477 = G__29626;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.routes.models.handle_proxx_chat_BANG_ = (async function knoxx$backend$infra$routes$models$handle_proxx_chat_BANG_(config,request,reply){
var body = knoxx.backend.infra.http.request_body(request);
var session_key = knoxx.backend.infra.routes.models.request_session_key(request);
var payload = (await (async function (){var G__29509 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"model","model",331153215),(await (async function (){var or__5162__auto__ = (body["model"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"llmModel","llmModel",-1399114982).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
}
})()),new cljs.core.Keyword(null,"messages","messages",345434482),(await (async function (){var or__5162__auto__ = (body["messages"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"temperature","temperature",899018429),(body["temperature"]),new cljs.core.Keyword(null,"top_p","top_p",297346822),(body["top_p"]),new cljs.core.Keyword(null,"max_tokens","max_tokens",319809413),(body["max_tokens"]),new cljs.core.Keyword(null,"stop","stop",-2140911342),(body["stop"]),new cljs.core.Keyword(null,"stream","stream",1534941648),false], null);
if(cljs.core.truth_(session_key)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29509,new cljs.core.Keyword(null,"prompt_cache_key","prompt_cache_key",-2026380749),session_key);
} else {
return G__29509;
}
})());
try{var resp = (await knoxx.backend.infra.clients.proxx.chat_completions_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config),payload));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
var data = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
var first_choice = cljs.core.first((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"choices","choices",1385611597).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var message = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(first_choice);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"answer","answer",-742633163),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(message);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(first_choice);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()),new cljs.core.Keyword(null,"model","model",331153215),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(data);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(payload);
}
})()),new cljs.core.Keyword(null,"rag_context","rag_context",-368956766),null], null));
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"Proxx chat failed",new cljs.core.Keyword(null,"details","details",1956795411),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null));
}
}catch (e29510){var err = e29510;
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}});
knoxx.backend.infra.routes.models.register_proxx_model_and_chat_routes_BANG_ = (function knoxx$backend$infra$routes$models$register_proxx_model_and_chat_routes_BANG_(app,runtime,config){
knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/api/proxx/models",(function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,(function (ctx){
if(cljs.core.truth_(ctx)){
knoxx.backend.infra.auth.authz.ensure_permission_BANG_(ctx,"agent.chat.use");
} else {
}

return knoxx.backend.infra.routes.models.send_proxx_models_BANG_(knoxx.backend.infra.routes.models.proxx_models_ctx(config,request,reply,ctx));
}));
}));

return knoxx.backend.shape.app_shapes.route_BANG_(app,"POST","/api/proxx/chat",(function (request,reply){
return knoxx.backend.infra.routes.models.handle_proxx_chat_BANG_(config,request,reply);
}));
});
knoxx.backend.infra.routes.models.handle_local_models_request_BANG_ = (async function knoxx$backend$infra$routes$models$handle_local_models_request_BANG_(config,_request,reply,ctx){
if(cljs.core.truth_(ctx)){
knoxx.backend.infra.auth.authz.ensure_permission_BANG_(ctx,"agent.chat.use");
} else {
}

try{var resp = (await knoxx.backend.infra.clients.proxx.models_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
var items = (await (async function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(resp,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.Keyword(null,"data","data",-232669377)], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"models","models",-1985455662),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(item);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"name","name",1843675177),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(item);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"path","path",-188191168),"",new cljs.core.Keyword(null,"size_bytes","size_bytes",2073761055),(0),new cljs.core.Keyword(null,"modified_at","modified_at",-1569634080),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"hash16mb","hash16mb",-86345561),"",new cljs.core.Keyword(null,"suggested_ctx","suggested_ctx",-2040144573),(128000)], null);
}),knoxx.backend.infra.routes.models.filter_model_items_for_ctx(ctx,items,config))], null));
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Model list failed"], null));
}
}catch (e29523){var err = e29523;
return knoxx.backend.infra.http.json_response_BANG_(reply,(502),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null));
}});
knoxx.backend.infra.routes.models.register_local_models_route_BANG_ = (function knoxx$backend$infra$routes$models$register_local_models_route_BANG_(app,runtime,config){
return knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/api/models",(function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.routes.models.handle_local_models_request_BANG_,config,request,reply));
}));
});
knoxx.backend.infra.routes.models.handle_openai_models_request_BANG_ = (async function knoxx$backend$infra$routes$models$handle_openai_models_request_BANG_(config,request,reply){
if(knoxx.backend.infra.http.require_openai_key_BANG_(config,request,reply)){
try{var resp = (await knoxx.backend.infra.clients.proxx.models_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config)));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp));
} else {
return knoxx.backend.infra.http.openai_auth_error(reply,(502),"Upstream model list failed","upstream_error");
}
}catch (e29531){var err = e29531;
return knoxx.backend.infra.http.openai_auth_error(reply,(502),(""+"Upstream model list failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),"upstream_error");
}} else {
return null;
}
});
knoxx.backend.infra.routes.models.handle_openai_chat_request_BANG_ = (async function knoxx$backend$infra$routes$models$handle_openai_chat_request_BANG_(config,request,reply){
if(knoxx.backend.infra.http.require_openai_key_BANG_(config,request,reply)){
var payload = knoxx.backend.infra.routes.models.ensure_prompt_cache_key_BANG_(request,knoxx.backend.infra.http.request_body(request));
try{var resp = (await knoxx.backend.infra.clients.proxx.chat_completions_response_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config),payload));
return knoxx.backend.infra.http.send_fetch_response_BANG_(reply,resp);
}catch (e29537){var err = e29537;
return knoxx.backend.infra.http.openai_auth_error(reply,(502),(""+"Upstream chat request failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),"upstream_error");
}} else {
return null;
}
});
knoxx.backend.infra.routes.models.handle_openai_embeddings_request_BANG_ = (async function knoxx$backend$infra$routes$models$handle_openai_embeddings_request_BANG_(config,request,reply){
if(knoxx.backend.infra.http.require_openai_key_BANG_(config,request,reply)){
var body = knoxx.backend.infra.http.request_body(request);
var payload = knoxx.backend.infra.routes.models.ensure_prompt_cache_key_BANG_(request,(await (async function (){var G__29550 = Object.assign((new Object()),body);
(G__29550["model"] = (await (async function (){var or__5162__auto__ = (body["model"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"embedModel","embedModel",1987630417).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(knoxx.backend.infra.agent.hydration.settings_state_STAR_));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"proxx-embed-model","proxx-embed-model",-289269914).cljs$core$IFn$_invoke$arity$1(config);
}
}
})()));

return G__29550;
})()));
try{var resp = (await knoxx.backend.infra.clients.proxx.embeddings_response_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config),payload));
return knoxx.backend.infra.http.send_fetch_response_BANG_(reply,resp);
}catch (e29551){var err = e29551;
return knoxx.backend.infra.http.openai_auth_error(reply,(502),(""+"Embedding generation failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),"upstream_error");
}} else {
return null;
}
});
knoxx.backend.infra.routes.models.event_session_id = (function knoxx$backend$infra$routes$models$event_session_id(events){
return cljs.core.some((function (event){
var G__29553 = new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(event);
var G__29553__$1 = (((G__29553 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29553)));
var G__29553__$2 = (((G__29553__$1 == null))?null:clojure.string.trim(G__29553__$1));
if((G__29553__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__29553__$2);
}
}),events);
});
knoxx.backend.infra.routes.models.run_from_session_and_events = (function knoxx$backend$infra$routes$models$run_from_session_and_events(run_id,session,events){
var messages = cljs.core.vec((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"messages","messages",345434482).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var assistant = cljs.core.last(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29555_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("assistant",(function (){var G__29570 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__29555_SHARP_);
var G__29570__$1 = (((G__29570 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29570)));
if((G__29570__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29570__$1);
}
})());
}),messages));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"total_time_ms","total_time_ms",390390114),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"events","events",1792552201),new cljs.core.Keyword(null,"input_tokens","input_tokens",490797322),new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067),new cljs.core.Keyword(null,"settings","settings",1556144875),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"tokens_per_s","tokens_per_s",1005457231),new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"request_messages","request_messages",-1334174565),new cljs.core.Keyword(null,"resources","resources",1632806811),new cljs.core.Keyword(null,"created_at","created_at",1484050750),new cljs.core.Keyword(null,"output_tokens","output_tokens",-1339146498),new cljs.core.Keyword(null,"model","model",331153215)],[cljs.core.PersistentVector.EMPTY,null,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content-parts","content-parts",684529019).cljs$core$IFn$_invoke$arity$1(assistant);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(assistant);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})(),run_id,events,null,cljs.core.PersistentVector.EMPTY,(function (){var G__29578 = cljs.core.PersistentArrayMap.EMPTY;
if(cljs.core.truth_(new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29578,new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050),new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session));
} else {
return G__29578;
}
})(),new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(session),null,null,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(session),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(session),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"answer","answer",-742633163).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(assistant);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})(),new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(session),cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__29556_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("assistant",(function (){var G__29582 = new cljs.core.Keyword(null,"role","role",-736691072).cljs$core$IFn$_invoke$arity$1(p1__29556_SHARP_);
var G__29582__$1 = (((G__29582 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__29582)));
if((G__29582__$1 == null)){
return null;
} else {
return clojure.string.lower_case(G__29582__$1);
}
})());
}),messages)),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(session),null,new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(session)]);
});
knoxx.backend.infra.routes.models.respond_run_detail_BANG_ = (async function knoxx$backend$infra$routes$models$respond_run_detail_BANG_(reply,ctx,run_id){
var temp__5823__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),run_id);
if(cljs.core.truth_(temp__5823__auto__)){
var run = temp__5823__auto__;
if(knoxx.backend.infra.auth.authz.run_visible_QMARK_(ctx,run)){
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),run);
} else {
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,knoxx.backend.infra.http.http_error((403),"run_scope_denied","Run is outside the current Knoxx scope"));
}
} else {
return knoxx.backend.infra.http.json_response_BANG_(reply,(404),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Run not found"], null));
}
});
knoxx.backend.infra.routes.models.register_run_routes_BANG_ = (function knoxx$backend$infra$routes$models$register_run_routes_BANG_(app,runtime){
knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/api/runs",(function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,(function (ctx){
var limit_raw = (request["query"]["limit"]);
var limit = ((typeof limit_raw === 'string')?parseInt(limit_raw,(10)):(100));
var items = cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.action.run_state.summarize_run,cljs.core.take.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(function (){var or__5162__auto__ = limit;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (100);
}
})()),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29586_SHARP_){
return knoxx.backend.infra.auth.authz.run_visible_QMARK_(ctx,p1__29586_SHARP_);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__29585_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.action.run_state.runs_STAR_),p1__29585_SHARP_);
}),cljs.core.deref(knoxx.backend.domain.action.run_state.run_order_STAR_)))))));
return knoxx.backend.infra.http.json_response_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runs","runs",-1553997798),items], null));
}));
}));

return knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/api/runs/:runId",(function (request,reply){
return knoxx.backend.infra.auth.authz.with_request_context_BANG_(runtime,request,reply,(async function (ctx){
var run_id = (request["params"]["runId"]);
return (await knoxx.backend.infra.routes.models.respond_run_detail_BANG_(reply,ctx,run_id));
}));
}));
});
knoxx.backend.infra.routes.models.register_openai_compatible_routes_BANG_ = (function knoxx$backend$infra$routes$models$register_openai_compatible_routes_BANG_(app,config){
knoxx.backend.shape.app_shapes.route_BANG_(app,"GET","/v1/models",(function (request,reply){
return knoxx.backend.infra.routes.models.handle_openai_models_request_BANG_(config,request,reply);
}));

knoxx.backend.shape.app_shapes.route_BANG_(app,"POST","/v1/chat/completions",(function (request,reply){
return knoxx.backend.infra.routes.models.handle_openai_chat_request_BANG_(config,request,reply);
}));

return knoxx.backend.shape.app_shapes.route_BANG_(app,"POST","/v1/embeddings",(function (request,reply){
return knoxx.backend.infra.routes.models.handle_openai_embeddings_request_BANG_(config,request,reply);
}));
});
knoxx.backend.infra.routes.models.register_model_routes_BANG_ = (function knoxx$backend$infra$routes$models$register_model_routes_BANG_(app,runtime,config){
knoxx.backend.infra.routes.models.register_proxx_health_route_BANG_(app,config);

knoxx.backend.infra.routes.models.register_proxx_observability_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.models.register_proxx_model_and_chat_routes_BANG_(app,runtime,config);

knoxx.backend.infra.routes.models.register_local_models_route_BANG_(app,runtime,config);

knoxx.backend.infra.routes.models.register_run_routes_BANG_(app,runtime);

knoxx.backend.infra.routes.models.register_openai_compatible_routes_BANG_(app,config);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.routes.models.js.map
