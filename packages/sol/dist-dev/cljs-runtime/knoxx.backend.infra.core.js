import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.agent.hydration.js";
import "./knoxx.backend.infra.agent.turn.js";
import "./knoxx.backend.infra.routes.app.js";
import "./knoxx.backend.infra.routes.resources.js";
import "./knoxx.backend.infra.event_runtime.js";
import "./knoxx.backend.domain.mcp.mcp_bridge.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.infra.agent.resume.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.runtime.state.js";
import "./knoxx.backend.infra.stores.session_titles.js";
import "./knoxx.backend.domain.discord.source.js";
import "./knoxx.backend.domain.driver.builtin.js";
import "./knoxx.backend.domain.source.runtime.js";
import "./knoxx.backend.domain.condition.builtin.js";
import "./knoxx.backend.infra.lifecycle.js";
import "./knoxx.backend.infra.agent.session.js";
import "./shadow.esm.esm_import$fastify.js";
import "./shadow.esm.esm_import$$fastify$cors.js";
import "./shadow.esm.esm_import$$fastify$websocket.js";
import "./shadow.esm.esm_import$$fastify$multipart.js";
goog.provide('knoxx.backend.infra.core');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.core !== 'undefined') && (typeof knoxx.backend.infra.core.server_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.core.server_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.core.app_log_info_BANG_ = (function knoxx$backend$infra$core$app_log_info_BANG_(app,message){
var log = app.log;
return log.info(message);
});
knoxx.backend.infra.core.app_log_error_BANG_ = (function knoxx$backend$infra$core$app_log_error_BANG_(app,message,err){
var log = app.log;
if(cljs.core.truth_(err)){
return log.error(err,message);
} else {
return log.error(message);
}
});
knoxx.backend.infra.core.app_listen_BANG_ = (function knoxx$backend$infra$core$app_listen_BANG_(app,host,port){
return app.listen(({"host": host, "port": port}));
});
knoxx.backend.infra.core.register_ws_routes_BANG_ = (function knoxx$backend$infra$core$register_ws_routes_BANG_(runtime,app){
return knoxx.backend.domain.realtime.register_ws_routes_BANG_(runtime,app,knoxx.backend.domain.action.run_state.active_runs_count,knoxx.backend.infra.agent.turn.lounge_messages_STAR_);
});
knoxx.backend.infra.core.config_js = (function knoxx$backend$infra$core$config_js(){
return cljs.core.clj__GT_js(knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg()));
});
knoxx.backend.infra.core.initialize_mcp_gateway_BANG_ = (async function knoxx$backend$infra$core$initialize_mcp_gateway_BANG_(app,resolved_config){
if(cljs.core.not(new cljs.core.Keyword(null,"mcp-enabled","mcp-enabled",-2146653267).cljs$core$IFn$_invoke$arity$1(resolved_config))){
return null;
} else {
var existing_servers = knoxx.backend.domain.mcp.mcp_bridge.parse_mcp_servers_env((await (async function (){var or__5162__auto__ = (process.env["MCP_SERVERS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var openplanner_url = new cljs.core.Keyword(null,"openplanner-mcp-base-url","openplanner-mcp-base-url",1563571366).cljs$core$IFn$_invoke$arity$1(resolved_config);
var openplanner_name = new cljs.core.Keyword(null,"openplanner-mcp-tool-name","openplanner-mcp-tool-name",1459761280).cljs$core$IFn$_invoke$arity$2(resolved_config,"openplanner");
var shoedelussy_url = new cljs.core.Keyword(null,"shoedelussy-mcp-base-url","shoedelussy-mcp-base-url",1454013907).cljs$core$IFn$_invoke$arity$1(resolved_config);
var shoedelussy_name = new cljs.core.Keyword(null,"shoedelussy-mcp-tool-name","shoedelussy-mcp-tool-name",2046051346).cljs$core$IFn$_invoke$arity$2(resolved_config,"shoedelussy");
var shoedelussy_secret = new cljs.core.Keyword(null,"shoedelussy-mcp-shared-secret","shoedelussy-mcp-shared-secret",386556861).cljs$core$IFn$_invoke$arity$1(resolved_config);
var merged_servers = (await (async function (){var G__32708 = existing_servers;
var G__32708__$1 = (((((!(cljs.core.contains_QMARK_(existing_servers,openplanner_name)))) && ((((!((openplanner_url == null)))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("",openplanner_url))))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32708,openplanner_name,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"url","url",276297046),openplanner_url,new cljs.core.Keyword(null,"transport","transport",-649001056),"http"], null)):G__32708);
if((((!(cljs.core.contains_QMARK_(existing_servers,shoedelussy_name)))) && ((((!((shoedelussy_url == null)))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2("",shoedelussy_url)))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__32708__$1,shoedelussy_name,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),shoedelussy_url,new cljs.core.Keyword(null,"transport","transport",-649001056),"http",new cljs.core.Keyword(null,"shared-secret","shared-secret",284397677),shoedelussy_secret], null));
} else {
return G__32708__$1;
}
})());
try{(await knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"servers","servers",1881102005),merged_servers], null)));

return knoxx.backend.infra.core.app_log_info_BANG_(app,(""+"MCP gateway initialized: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(knoxx.backend.domain.mcp.mcp_bridge.catalog()))+" tools available"));
}catch (e32709){var err = e32709;
return knoxx.backend.infra.core.app_log_error_BANG_(app,"MCP gateway initialization failed",err);
}}
});
knoxx.backend.infra.core.start_background_services_BANG_ = (async function knoxx$backend$infra$core$start_background_services_BANG_(app,resolved_config){
knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

knoxx.backend.domain.condition.builtin.register_builtins_BANG_();

try{knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1(resolved_config);

knoxx.backend.infra.routes.resources.start_resource_watcher_BANG_(resolved_config);

var policy_context_32716 = new cljs.core.Keyword(null,"policy-context","policy-context",-10488283).cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.lifecycle.context());
if(cljs.core.truth_(policy_context_32716)){
(await knoxx.backend.domain.discord.source.bind_gateways_BANG_(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183),policy_context_32716,new cljs.core.Keyword(null,"on-message!","on-message!",-607128138),(function (msg){
return knoxx.backend.domain.source.runtime.dispatch_driver_event_BANG_(resolved_config,new cljs.core.Keyword("driver","discord","driver/discord",-1086021611),new cljs.core.Keyword(null,"gatewayActorId","gatewayActorId",1232391533).cljs$core$IFn$_invoke$arity$1(msg),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("event","type","event/type",1532247862),new cljs.core.Keyword(null,"discord.message","discord.message",345366461),new cljs.core.Keyword("event","payload","event/payload",242016970),msg], null));
}),new cljs.core.Keyword(null,"on-voice-state!","on-voice-state!",2001605581),(function (state){
return knoxx.backend.domain.source.runtime.dispatch_driver_event_BANG_(resolved_config,new cljs.core.Keyword("driver","discord","driver/discord",-1086021611),new cljs.core.Keyword(null,"gatewayActorId","gatewayActorId",1232391533).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword("event","type","event/type",1532247862),new cljs.core.Keyword(null,"discord.voice.state-update","discord.voice.state-update",-1900286247),new cljs.core.Keyword("event","payload","event/payload",242016970),state], null));
})], null)));
} else {
}

return (await knoxx.backend.infra.core.initialize_mcp_gateway_BANG_(app,resolved_config));
}catch (e32710){var err = e32710;
return knoxx.backend.infra.core.app_log_error_BANG_(app,"Background startup services failed",err);
}});
knoxx.backend.infra.core.prewarm_sdk_runtime_BANG_ = (async function knoxx$backend$infra$core$prewarm_sdk_runtime_BANG_(runtime,app,resolved_config){
(await knoxx.backend.infra.agent.session.ensure_eta_mu_runtime_BANG_(runtime,resolved_config));

return knoxx.backend.infra.core.app_log_info_BANG_(app,"Knoxx SDK runtime prewarmed");
});
knoxx.backend.infra.core.register_app_routes_BANG_ = (function knoxx$backend$infra$core$register_app_routes_BANG_(runtime,app,config,lounge_messages_STAR_){
var resolved_config = knoxx.backend.domain.models.enrich_config(((cljs.core.map_QMARK_(config))?config:knoxx.backend.infra.config.cfg()));
knoxx.backend.infra.agent.hydration.ensure_settings_BANG_(resolved_config);

cljs.core.reset_BANG_(knoxx.backend.runtime.state.config_STAR_,resolved_config);

cljs.core.reset_BANG_(knoxx.backend.runtime.state.runtime_STAR_,runtime);

knoxx.backend.infra.routes.app.register_routes_BANG_(runtime,app,resolved_config,lounge_messages_STAR_);

setTimeout((async function (){
try{return (await knoxx.backend.infra.core.prewarm_sdk_runtime_BANG_(runtime,app,resolved_config));
}catch (e32711){var err = e32711;
return knoxx.backend.infra.core.app_log_error_BANG_(app,"Knoxx SDK runtime prewarm failed; startup continuing",err);
}}),(1000));

setTimeout((async function (){
try{return (await knoxx.backend.infra.core.start_background_services_BANG_(app,resolved_config));
}catch (e32712){var err = e32712;
return knoxx.backend.infra.core.app_log_error_BANG_(app,"Background startup services promise failed",err);
}}),(1500));

return Promise.resolve(cljs.core.clj__GT_js(resolved_config));
});
knoxx.backend.infra.core.start_BANG_ = (async function knoxx$backend$infra$core$start_BANG_(runtime){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.core.server_STAR_))){
return null;
} else {
var config = knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg());
var app = shadow.esm.esm_import$fastify.default(({"logger": ({"stream": process.stderr})}));
cljs.core.reset_BANG_(knoxx.backend.runtime.state.config_STAR_,config);

cljs.core.reset_BANG_(knoxx.backend.runtime.state.runtime_STAR_,runtime);

knoxx.backend.domain.driver.builtin.register_built_in_drivers_BANG_();

knoxx.backend.infra.agent.hydration.ensure_settings_BANG_(config);

try{(await knoxx.backend.infra.stores.session_titles.load_session_titles_BANG_(runtime,config));

(await app.register(shadow.esm.esm_import$$fastify$cors.default,({"origin": true})));

(await app.register(shadow.esm.esm_import$$fastify$multipart.default));

(await app.register(shadow.esm.esm_import$$fastify$websocket.default));

(await app.register((function (instance,_opts,done){
knoxx.backend.infra.core.register_ws_routes_BANG_(runtime,instance);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
})));

knoxx.backend.infra.routes.app.register_routes_BANG_(runtime,app,config,knoxx.backend.infra.agent.turn.lounge_messages_STAR_);

try{knoxx.backend.infra.routes.resources.sync_resource_index_BANG_(config);
}catch (e32714){var err_32717 = e32714;
knoxx.backend.infra.core.app_log_error_BANG_(app,"Failed to sync resource index",err_32717);
}
knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1(config);

knoxx.backend.infra.routes.resources.start_resource_watcher_BANG_(config);

(await knoxx.backend.infra.core.app_listen_BANG_(app,new cljs.core.Keyword(null,"host","host",-1558485167).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"port","port",1534937262).cljs$core$IFn$_invoke$arity$1(config)));

cljs.core.reset_BANG_(knoxx.backend.infra.core.server_STAR_,app);

knoxx.backend.infra.core.app_log_info_BANG_(app,(""+"Knoxx backend CLJS listening on "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"host","host",-1558485167).cljs$core$IFn$_invoke$arity$1(config))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"port","port",1534937262).cljs$core$IFn$_invoke$arity$1(config))));

try{return (await knoxx.backend.infra.agent.resume.resume_on_startup_BANG_(runtime,app,config));
}catch (e32715){var err = e32715;
return knoxx.backend.infra.core.app_log_error_BANG_(app,"agent-resume failed",err);
}}catch (e32713){var err = e32713;
console.error("Knoxx backend CLJS failed to start",err);

return process.exit((1));
}}
});

//# sourceMappingURL=knoxx.backend.infra.core.js.map
