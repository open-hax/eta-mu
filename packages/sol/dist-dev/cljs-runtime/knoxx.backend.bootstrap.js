import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.contract_runtime_deps.js";
import "./knoxx.backend.infra.agent.resume.js";
import "./knoxx.backend.infra.auth.session.js";
import "./knoxx.backend.infra.core.js";
import "./knoxx.backend.domain.discord.gateway.js";
import "./knoxx.backend.domain.discord.discord_reaction_labels.js";
import "./knoxx.backend.domain.graph.policy_registry.js";
import "./knoxx.backend.infra.graceful_shutdown.js";
import "./knoxx.backend.infra.http_server.js";
import "./knoxx.backend.infra.lifecycle.js";
import "./knoxx.backend.infra.db.policy.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.stores.mongo_policy_store.js";
import "./knoxx.backend.infra.stores.mongo_run_store.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.infra.stores.mongo_session_titles.js";
import "./knoxx.backend.infra.stores.mongo_temp_memory.js";
import "./knoxx.backend.infra.stores.mongo_memory_sessions.js";
import "./knoxx.backend.infra.stores.mongo_mcp_oauth.js";
import "./knoxx.backend.infra.stores.mongo_rate_limits.js";
import "./knoxx.backend.infra.stores.session_store_registry.js";
import "./knoxx.backend.infra.stores.session_flush.js";
import "./knoxx.backend.infra.routes.auth.js";
import "./knoxx.backend.infra.routes.mcp.js";
import "./knoxx.backend.infra.routes.tools.proxy.js";
import "./knoxx.backend.infra.config.js";
import "./knoxx.backend.domain.models.js";
import "./knoxx.backend.runtime.state.js";
import "./knoxx.backend.infra.agent.turn.js";
goog.provide('knoxx.backend.bootstrap');
knoxx.backend.bootstrap.env = (function knoxx$backend$bootstrap$env(k,default$){
var or__5162__auto__ = (process.env[k]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default$;
}
});
knoxx.backend.bootstrap.truthy_QMARK_ = (function knoxx$backend$bootstrap$truthy_QMARK_(v){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["yes",null,"true",null,"on",null,"y",null,"1",null], null), null),clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = v;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
});
knoxx.backend.bootstrap.hmr_probe_token = "hmr-probe-2026-05-09-stability-b";
knoxx.backend.bootstrap.process_uptime_ms = (function knoxx$backend$bootstrap$process_uptime_ms(){
return Math.round(((1000) * process.uptime()));
});
knoxx.backend.bootstrap.notify_ready_BANG_ = (function knoxx$backend$bootstrap$notify_ready_BANG_(){
var send_fn = (process["send"]);
var connected_QMARK_ = (process["connected"]);
if(cljs.core.fn_QMARK_(send_fn)){
try{send_fn.call(process,"ready");

console.log((""+"[knoxx-bootstrap] sent pm2 ready signal"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(connected_QMARK_)?null:" (process.connected was false)"))));

return true;
}catch (e32718){var err = e32718;
console.warn("[knoxx-bootstrap] failed to send pm2 ready signal",err);

return false;
}} else {
console.log("[knoxx-bootstrap] process.send unavailable; skipping pm2 ready signal");

return false;

}
});
knoxx.backend.bootstrap.policy_options = (function knoxx$backend$bootstrap$policy_options(){
return ({"primaryOrgSlug": knoxx.backend.bootstrap.env("KNOXX_PRIMARY_ORG_SLUG","open-hax"), "primaryOrgName": knoxx.backend.bootstrap.env("KNOXX_PRIMARY_ORG_NAME","Open Hax"), "primaryOrgKind": knoxx.backend.bootstrap.env("KNOXX_PRIMARY_ORG_KIND","platform_owner"), "bootstrapSystemAdminEmail": knoxx.backend.bootstrap.env("KNOXX_BOOTSTRAP_SYSTEM_ADMIN_EMAIL","system-admin@open-hax.local"), "bootstrapSystemAdminName": knoxx.backend.bootstrap.env("KNOXX_BOOTSTRAP_SYSTEM_ADMIN_NAME","Knoxx System Admin"), "bootstrapAllowlistEmails": knoxx.backend.bootstrap.env("KNOXX_BOOTSTRAP_ALLOWLIST_EMAILS",""), "bootstrapAllowlistRoleSlugs": knoxx.backend.bootstrap.env("KNOXX_BOOTSTRAP_ALLOWLIST_ROLE_SLUGS","")});
});
knoxx.backend.bootstrap.log_hmr_probe_BANG_ = (function knoxx$backend$bootstrap$log_hmr_probe_BANG_(req,reply){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(req.url,"/api/dev/hmr")){
reply.header("x-knoxx-hmr-probe",knoxx.backend.bootstrap.hmr_probe_token);

return console.log("[knoxx-hot-reload-probe]",knoxx.backend.bootstrap.hmr_probe_token,({"pid": process.pid, "uptimeMs": knoxx.backend.bootstrap.process_uptime_ms()}));
} else {
return null;
}
});
knoxx.backend.bootstrap.log_large_request_BANG_ = (function knoxx$backend$bootstrap$log_large_request_BANG_(req){
var temp__5825__auto__ = (req.headers["content-length"]);
if(cljs.core.truth_(temp__5825__auto__)){
var len = temp__5825__auto__;
if((parseInt(len,(10)) > ((900) * (1024)))){
return console.warn("[knoxx] large request",req.url,len,"bytes");
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.bootstrap.add_request_debug_hook_BANG_ = (function knoxx$backend$bootstrap$add_request_debug_hook_BANG_(app){
return knoxx.backend.infra.http_server.add_hook_BANG_(app,"onRequest",(function (req,reply,done){
knoxx.backend.bootstrap.log_hmr_probe_BANG_(req,reply);

knoxx.backend.bootstrap.log_large_request_BANG_(req);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}));
});
knoxx.backend.bootstrap.register_ws_routes_plugin_BANG_ = (function knoxx$backend$bootstrap$register_ws_routes_plugin_BANG_(runtime,app){
return app.register((function (instance,_opts,done){
knoxx.backend.infra.core.register_ws_routes_BANG_(runtime,instance);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}));
});
knoxx.backend.bootstrap.add_session_hook_BANG_ = (function knoxx$backend$bootstrap$add_session_hook_BANG_(app,policy_context,cookie_hook_QMARK_){
if(cljs.core.truth_(cookie_hook_QMARK_)){
return knoxx.backend.infra.http_server.add_hook_BANG_(app,"onRequest",knoxx.backend.infra.auth.session.create_session_hook(policy_context));
} else {
return null;
}
});
knoxx.backend.bootstrap.register_http_routes_BANG_ = (function knoxx$backend$bootstrap$register_http_routes_BANG_(runtime,app,cfg,policy_context){
knoxx.backend.infra.routes.auth.register_auth_routes(app,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"policy-context","policy-context",-10488283),policy_context,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null));

knoxx.backend.infra.core.register_app_routes_BANG_(runtime,app,cfg,knoxx.backend.infra.agent.turn.lounge_messages_STAR_);

knoxx.backend.infra.routes.tools.proxy.register_proxy_routes_BANG_(app,cfg);

return knoxx.backend.infra.routes.mcp.register_mcp_http_routes_BANG_(app,runtime,cfg);
});
knoxx.backend.bootstrap.start_mongo_persistence_BANG_ = (async function knoxx$backend$bootstrap$start_mongo_persistence_BANG_(runtime,app,cfg,log){
try{var db = (await knoxx.backend.infra.mongo_client.init_mongo_BANG_());
if(cljs.core.truth_(db)){
log.info("MongoDB connected for session persistence");

knoxx.backend.infra.stores.mongo_session_store.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_run_store.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_session_titles.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_temp_memory.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_memory_sessions.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_mcp_oauth.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_rate_limits.setup_indexes_BANG_(db);

knoxx.backend.infra.stores.mongo_policy_store.ensure_indexes_BANG_(db);

cljs.core.reset_BANG_(knoxx.backend.infra.stores.session_store_registry.session_store_STAR_,knoxx.backend.infra.stores.mongo_run_store.create_mongo_run_store(db));

knoxx.backend.infra.agent.resume.resume_on_process_startup_BANG_(runtime,app,cfg);

knoxx.backend.infra.agent.resume.start_periodic_recovery_BANG_(runtime,app,cfg);

return knoxx.backend.infra.stores.session_flush.start_periodic_flush_BANG_.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"run-stale-flush-ms","run-stale-flush-ms",1133804815).cljs$core$IFn$_invoke$arity$1(cfg));
} else {
return null;
}
}catch (e32719){var err = e32719;
return log.warn("MongoDB initialization failed",err);
}});
knoxx.backend.bootstrap.start_session_persistence_BANG_ = (function knoxx$backend$bootstrap$start_session_persistence_BANG_(runtime,app,cfg,log){
return knoxx.backend.bootstrap.start_mongo_persistence_BANG_(runtime,app,cfg,log);
});
knoxx.backend.bootstrap.handle_app_listening_BANG_ = (function knoxx$backend$bootstrap$handle_app_listening_BANG_(runtime,app,cfg){
knoxx.backend.infra.lifecycle.remember_app_BANG_(app);

knoxx.backend.infra.graceful_shutdown.install_BANG_(app,cfg);

knoxx.backend.bootstrap.notify_ready_BANG_();

var log = app.log;
log.info((""+"Knoxx backend CLJS listening on "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"host","host",-1558485167).cljs$core$IFn$_invoke$arity$1(cfg))+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"port","port",1534937262).cljs$core$IFn$_invoke$arity$1(cfg))));

knoxx.backend.bootstrap.start_session_persistence_BANG_(runtime,app,cfg,log);

return app;
});
/**
 * Create a fresh Fastify app and bind HTTP routes around durable runtime state.
 */
knoxx.backend.bootstrap.start_http_BANG_ = (async function knoxx$backend$bootstrap$start_http_BANG_(runtime,cfg,policy_context,cookie_hook_QMARK_){
knoxx.backend.runtime.state.remember_context_BANG_(runtime,cfg,policy_context);

var app = knoxx.backend.infra.http_server.create_app_BANG_();
knoxx.backend.infra.http_server.ensure_json_empty_body_parser_BANG_(app);

knoxx.backend.bootstrap.add_request_debug_hook_BANG_(app);

(await knoxx.backend.infra.http_server.register_default_plugins_BANG_(app));

(await knoxx.backend.bootstrap.register_ws_routes_plugin_BANG_(runtime,app));

(await knoxx.backend.bootstrap.add_session_hook_BANG_(app,policy_context,cookie_hook_QMARK_));

(await knoxx.backend.bootstrap.register_http_routes_BANG_(runtime,app,cfg,policy_context));

(await knoxx.backend.infra.http_server.listen_BANG_(app,new cljs.core.Keyword(null,"host","host",-1558485167).cljs$core$IFn$_invoke$arity$1(cfg),new cljs.core.Keyword(null,"port","port",1534937262).cljs$core$IFn$_invoke$arity$1(cfg)));

return knoxx.backend.bootstrap.handle_app_listening_BANG_(runtime,app,cfg);
});
/**
 * Main entrypoint called by shadow-cljs.
 */
knoxx.backend.bootstrap.bootstrap_BANG_ = (async function knoxx$backend$bootstrap$bootstrap_BANG_(){
var cfg = knoxx.backend.contract_runtime_deps.inject_deps_BANG_(knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg()));
var cookie_hook_QMARK_ = knoxx.backend.bootstrap.truthy_QMARK_((process.env["KNOXX_ENABLE_SESSION_HOOK"]));
knoxx.backend.domain.discord.gateway.createDiscordGatewayManager(({"log": console}));

knoxx.backend.domain.discord.discord_reaction_labels.bind_BANG_(cfg);

knoxx.backend.domain.graph.policy_registry.init_BANG_();

try{var policy_context = (await knoxx.backend.infra.db.policy.create_policy_db(knoxx.backend.bootstrap.policy_options()));
var runtime = ({});
knoxx.backend.infra.lifecycle.remember_context_BANG_(runtime,cfg,policy_context,cookie_hook_QMARK_);

return (await knoxx.backend.bootstrap.start_http_BANG_(runtime,cfg,policy_context,cookie_hook_QMARK_));
}catch (e32720){var err = e32720;
console.error("Knoxx policy DB failed to initialize",err);

return process.exit((1));
}});
knoxx.backend.bootstrap.stop_http_before_load_BANG_ = (async function knoxx$backend$bootstrap$stop_http_before_load_BANG_(done){
console.log("[knoxx-hot-reload] before-load: closing HTTP server",({"pid": process.pid, "uptimeMs": knoxx.backend.bootstrap.process_uptime_ms()}));

knoxx.backend.infra.stores.session_flush.stop_periodic_flush_BANG_();

try{(await knoxx.backend.infra.lifecycle.close_current_http_BANG_());

return console.log("[knoxx-hot-reload] before-load: HTTP server closed",({"pid": process.pid, "uptimeMs": knoxx.backend.bootstrap.process_uptime_ms()}));
}catch (e32721){var err = e32721;
return console.error("[knoxx-hot-reload] failed to close HTTP server",err);
}finally {(done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}});
knoxx.backend.bootstrap.start_http_after_load_BANG_ = (async function knoxx$backend$bootstrap$start_http_after_load_BANG_(done){
console.log("[knoxx-hot-reload] after-load: starting HTTP server",({"pid": process.pid, "uptimeMs": knoxx.backend.bootstrap.process_uptime_ms()}));

var map__32722 = knoxx.backend.infra.lifecycle.context();
var map__32722__$1 = cljs.core.__destructure_map(map__32722);
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32722__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var policy_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32722__$1,new cljs.core.Keyword(null,"policy-context","policy-context",-10488283));
var cookie_hook_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__32722__$1,new cljs.core.Keyword(null,"cookie-hook?","cookie-hook?",1025238582));
var config = knoxx.backend.contract_runtime_deps.inject_deps_BANG_(knoxx.backend.domain.models.enrich_config(knoxx.backend.infra.config.cfg()));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = runtime;
if(cljs.core.truth_(and__5160__auto__)){
return policy_context;
} else {
return and__5160__auto__;
}
})()))){
knoxx.backend.infra.lifecycle.remember_context_BANG_(runtime,config,policy_context,cookie_hook_QMARK_);

try{(await knoxx.backend.bootstrap.start_http_BANG_(runtime,config,policy_context,cookie_hook_QMARK_));

return console.log("[knoxx-hot-reload] after-load: HTTP server started",({"pid": process.pid, "uptimeMs": knoxx.backend.bootstrap.process_uptime_ms()}));
}catch (e32723){var err = e32723;
return console.error("[knoxx-hot-reload] failed to restart HTTP server",err);
}finally {(done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}} else {
console.warn("[knoxx-hot-reload] no lifecycle context; skipping HTTP restart");

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}
});

//# sourceMappingURL=knoxx.backend.bootstrap.js.map
