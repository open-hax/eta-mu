import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.event.dispatch.js";
import "./knoxx.backend.infra.clients.proxx.js";
import "./knoxx.backend.infra.http.js";
import "./knoxx.backend.macros.js";
import "./knoxx.backend.domain.mcp.mcp_bridge.js";
import "./knoxx.backend.runtime.state.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.infra.control_config.js";
import "./knoxx.backend.infra.event_runtime.js";
import "./shadow.esm.esm_import$node_child_process.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
import "./shadow.esm.esm_import$node_util.js";
import "./shadow.esm.esm_import$nodemailer.js";
goog.provide('knoxx.backend.infra.routes.tools');
knoxx.backend.infra.routes.tools.exec_file_async = shadow.esm.esm_import$node_util.promisify(shadow.esm.esm_import$node_child_process.execFile);
/**
 * Send an email via Gmail SMTP using nodemailer.
 */
knoxx.backend.infra.routes.tools.send_email_BANG_ = (function knoxx$backend$infra$routes$tools$send_email_BANG_(_runtime,config,to,subject,text_body,cc,bcc){
var email = new cljs.core.Keyword(null,"gmail-app-email","gmail-app-email",-654288582).cljs$core$IFn$_invoke$arity$1(config);
var password = new cljs.core.Keyword(null,"gmail-app-password","gmail-app-password",-1448333374).cljs$core$IFn$_invoke$arity$1(config);
if(((clojure.string.blank_QMARK_(email)) || (clojure.string.blank_QMARK_(password)))){
return Promise.reject((new Error("Gmail credentials not configured")));
} else {
var transporter = shadow.esm.esm_import$nodemailer.default.createTransport(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"host","host",-1558485167),"smtp.gmail.com",new cljs.core.Keyword(null,"port","port",1534937262),(587),new cljs.core.Keyword(null,"secure","secure",176883900),false,new cljs.core.Keyword(null,"auth","auth",1389754926),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"user","user",1532431356),email,new cljs.core.Keyword(null,"pass","pass",1574159993),password], null)], null)));
return transporter.sendMail(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"from","from",1815293044),email,new cljs.core.Keyword(null,"to","to",192099007),clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",to),new cljs.core.Keyword(null,"cc","cc",301258124),((cljs.core.seq(cc))?clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",cc):null),new cljs.core.Keyword(null,"bcc","bcc",2144467535),((cljs.core.seq(bcc))?clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",bcc):null),new cljs.core.Keyword(null,"subject","subject",-1411880451),subject,new cljs.core.Keyword(null,"text","text",-1790561697),text_body], null)));
}
});
knoxx.backend.infra.routes.tools.events_control_response = (function knoxx$backend$infra$routes$tools$events_control_response(config){
var live_config = (function (){var or__5162__auto__ = cljs.core.deref(knoxx.backend.runtime.state.config_STAR_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return config;
}
})();
var control = knoxx.backend.infra.control_config.event_control_config(live_config);
var runtime = knoxx.backend.domain.event.dispatch.status_snapshot(live_config);
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"configured","configured",-884777889),true,new cljs.core.Keyword(null,"availableRoles","availableRoles",-1960366406),knoxx.backend.infra.control_config.event_role_options(live_config),new cljs.core.Keyword(null,"availableGeneratorKinds","availableGeneratorKinds",1207387774),knoxx.backend.infra.control_config.event_generator_kind_options(live_config),new cljs.core.Keyword(null,"availableTriggerKinds","availableTriggerKinds",-192509548),knoxx.backend.infra.control_config.event_trigger_kind_options(),new cljs.core.Keyword(null,"control","control",1892578036),control,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null);
});
knoxx.backend.infra.routes.tools.failed_trigger_results = (function knoxx$backend$infra$routes$tools$failed_trigger_results(result){
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"failed","failed",-1397425762),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)));
});
knoxx.backend.infra.routes.tools.trigger_fire_response_BANG_ = (function knoxx$backend$infra$routes$tools$trigger_fire_response_BANG_(reply,trigger_id,result){
var failures = knoxx.backend.infra.routes.tools.failed_trigger_results(result);
var failed_QMARK_ = cljs.core.seq(failures);
return knoxx.backend.infra.http.json_response_BANG_(reply,((failed_QMARK_)?(500):(202)),(function (){var G__31029 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),cljs.core.not(failed_QMARK_),new cljs.core.Keyword(null,"triggerId","triggerId",-684068188),trigger_id,new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767),new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"results","results",-1134170113),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)], null);
if(failed_QMARK_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__31029,new cljs.core.Keyword(null,"detail","detail",-1545345025),"One or more trigger actions failed",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"failures","failures",-912916356),failures], 0));
} else {
return G__31029;
}
})());
});
knoxx.backend.infra.routes.tools.register_tool_catalog_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_tool_catalog_route_BANG_(app,runtime,config,deps){
var map__31031 = deps;
var map__31031__$1 = cljs.core.__destructure_map(map__31031);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var tool_catalog = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"tool-catalog","tool-catalog",899421286));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31031__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31033 = app;
var G__31034 = "GET";
var G__31035 = "/api/tools/catalog";
var G__31036 = (function (){var obj31038 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [optional_session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
var role = (function (){var or__5162__auto__ = (request["query"]["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})();
var agent_contract_id = (function (){var or__5162__auto__ = (request["query"]["agent"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (request["query"]["agentId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (request["query"]["agentContractId"]);
}
}
})();
var actor_id = (function (){var or__5162__auto__ = (request["query"]["actor"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (request["query"]["actorId"]);
}
})();
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var G__31056 = reply;
var G__31057 = (200);
var G__31058 = (tool_catalog.cljs$core$IFn$_invoke$arity$5 ? tool_catalog.cljs$core$IFn$_invoke$arity$5(config,role,ctx,agent_contract_id,actor_id) : tool_catalog.call(null,config,role,ctx,agent_contract_id,actor_id));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31056,G__31057,G__31058) : json_response_BANG_.call(null,G__31056,G__31057,G__31058));
})});
return obj31038;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31033,G__31034,G__31035,G__31036) : route_BANG_.call(null,G__31033,G__31034,G__31035,G__31036));
});
knoxx.backend.infra.routes.tools.register_email_send_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_email_send_route_BANG_(app,runtime,config,deps){
var map__31076 = deps;
var map__31076__$1 = cljs.core.__destructure_map(map__31076);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31076__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31085 = app;
var G__31086 = "POST";
var G__31087 = "/api/tools/email/send";
var G__31088 = (function (){var obj31091 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31124 = ctx;
var G__31125 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31126 = "email.send";
var G__31127 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31124,G__31125,G__31126,G__31127) : ensure_role_can_use_BANG_.call(null,G__31124,G__31125,G__31126,G__31127));
})());
var to = (await (async function (){var or__5162__auto__ = (body["to"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})());
var cc = (await (async function (){var or__5162__auto__ = (body["cc"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})());
var bcc = (await (async function (){var or__5162__auto__ = (body["bcc"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})());
var subject = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["subject"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "(no subject)";
}
})())));
var markdown = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["markdown"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(cljs.core.empty_QMARK_(to)){
var G__31142 = reply;
var G__31143 = (400);
var G__31144 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing required field: to array"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31142,G__31143,G__31144) : json_response_BANG_.call(null,G__31142,G__31143,G__31144));
} else {
try{var result = (await knoxx.backend.infra.routes.tools.send_email_BANG_(runtime,config,to,subject,markdown,cc,bcc));
var G__31164 = reply;
var G__31165 = (200);
var G__31166 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"message_id","message_id",663757010),(result["messageId"])], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31164,G__31165,G__31166) : json_response_BANG_.call(null,G__31164,G__31165,G__31166));
}catch (e31155){var err = e31155;
var G__31156 = reply;
var G__31157 = (502);
var G__31158 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to send email: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})())))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31156,G__31157,G__31158) : json_response_BANG_.call(null,G__31156,G__31157,G__31158));
}}
}catch (e31123){var err = e31123;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31091;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31085,G__31086,G__31087,G__31088) : route_BANG_.call(null,G__31085,G__31086,G__31087,G__31088));
});
knoxx.backend.infra.routes.tools.register_websearch_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_websearch_route_BANG_(app,runtime,config,deps){
var map__31173 = deps;
var map__31173__$1 = cljs.core.__destructure_map(map__31173);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31173__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31176 = app;
var G__31177 = "POST";
var G__31178 = "/api/tools/websearch";
var G__31179 = (function (){var obj31181 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31189 = ctx;
var G__31190 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31191 = "websearch";
var G__31192 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31189,G__31190,G__31191,G__31192) : ensure_role_can_use_BANG_.call(null,G__31189,G__31190,G__31191,G__31192));
})());
var query = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
var num_results = (await (async function (){var or__5162__auto__ = (body["numResults"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (8);
}
})());
var search_context_size = (body["searchContextSize"]);
var allowed_domains = (await (async function (){var or__5162__auto__ = (body["allowedDomains"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})());
var model = (body["model"]);
if(clojure.string.blank_QMARK_(query)){
var G__31194 = reply;
var G__31195 = (400);
var G__31196 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"query is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31194,G__31195,G__31196) : json_response_BANG_.call(null,G__31194,G__31195,G__31196));
} else {
try{var resp = (await knoxx.backend.infra.clients.proxx.websearch_BANG_(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"numResults","numResults",-2106407448),num_results,new cljs.core.Keyword(null,"searchContextSize","searchContextSize",1024145239),search_context_size,new cljs.core.Keyword(null,"allowedDomains","allowedDomains",975388721),allowed_domains,new cljs.core.Keyword(null,"model","model",331153215),model], null)));
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
var G__31202 = reply;
var G__31203 = (200);
var G__31204 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"role","role",-736691072),role);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31202,G__31203,G__31204) : json_response_BANG_.call(null,G__31202,G__31203,G__31204));
} else {
var G__31205 = reply;
var G__31206 = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (502);
}
})());
var G__31207 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31205,G__31206,G__31207) : json_response_BANG_.call(null,G__31205,G__31206,G__31207));
}
}catch (e31197){var err = e31197;
var G__31198 = reply;
var G__31199 = (502);
var G__31200 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31198,G__31199,G__31200) : json_response_BANG_.call(null,G__31198,G__31199,G__31200));
}}
}catch (e31188){var err = e31188;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31181;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31176,G__31177,G__31178,G__31179) : route_BANG_.call(null,G__31176,G__31177,G__31178,G__31179));
});
knoxx.backend.infra.routes.tools.read_directory_response_BANG_ = (async function knoxx$backend$infra$routes$tools$read_directory_response_BANG_(json_response_BANG_,reply,role,path_str,clip_text){
var entries = (await shadow.esm.esm_import$node_fs$promises.readdir(path_str,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"withFileTypes","withFileTypes",474788010),true], null))));
var content_lines = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (e){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((e["name"]))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(e.isDirectory())?"/":null)));
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(entries));
var vec__31212 = (await (async function (){var G__31216 = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",content_lines);
return (clip_text.cljs$core$IFn$_invoke$arity$1 ? clip_text.cljs$core$IFn$_invoke$arity$1(G__31216) : clip_text.call(null,G__31216));
})());
var content = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31212,(0),null);
var truncated = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31212,(1),null);
var G__31217 = reply;
var G__31218 = (200);
var G__31219 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"path","path",-188191168),path_str,new cljs.core.Keyword(null,"content","content",15833224),content,new cljs.core.Keyword(null,"truncated","truncated",298102102),truncated], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31217,G__31218,G__31219) : json_response_BANG_.call(null,G__31217,G__31218,G__31219));
});
knoxx.backend.infra.routes.tools.read_file_response_BANG_ = (async function knoxx$backend$infra$routes$tools$read_file_response_BANG_(json_response_BANG_,reply,role,path_str,offset,limit,clip_text){
var text = (await shadow.esm.esm_import$node_fs$promises.readFile(path_str,"utf8"));
var lines = clojure.string.split_lines(text);
var start = (offset - (1));
var stop = (start + limit);
var numbered = cljs.core.map_indexed.cljs$core$IFn$_invoke$arity$2((function (idx,line){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((start + idx) + (1)))+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(line));
}),cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,cljs.core.drop.cljs$core$IFn$_invoke$arity$2(start,lines)));
var vec__31221 = (await (async function (){var G__31226 = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",numbered);
return (clip_text.cljs$core$IFn$_invoke$arity$1 ? clip_text.cljs$core$IFn$_invoke$arity$1(G__31226) : clip_text.call(null,G__31226));
})());
var content = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31221,(0),null);
var clipped_QMARK_ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31221,(1),null);
var G__31228 = reply;
var G__31229 = (200);
var G__31230 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"path","path",-188191168),path_str,new cljs.core.Keyword(null,"content","content",15833224),content,new cljs.core.Keyword(null,"truncated","truncated",298102102),(await (async function (){var or__5162__auto__ = clipped_QMARK_;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (stop < cljs.core.count(lines));
}
})())], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31228,G__31229,G__31230) : json_response_BANG_.call(null,G__31228,G__31229,G__31230));
});
knoxx.backend.infra.routes.tools.register_read_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_read_route_BANG_(app,runtime,config,deps){
var map__31231 = deps;
var map__31231__$1 = cljs.core.__destructure_map(map__31231);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var resolve_workspace_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"resolve-workspace-path","resolve-workspace-path",-1439207488));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31231__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31236 = app;
var G__31237 = "POST";
var G__31238 = "/api/tools/read";
var G__31239 = (function (){var obj31241 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31244 = ctx;
var G__31245 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31246 = "read";
var G__31247 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31244,G__31245,G__31246,G__31247) : ensure_role_can_use_BANG_.call(null,G__31244,G__31245,G__31246,G__31247));
})());
var path_str = (await (async function (){var G__31248 = runtime;
var G__31249 = config;
var G__31250 = (await (async function (){var or__5162__auto__ = (body["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
return (resolve_workspace_path.cljs$core$IFn$_invoke$arity$3 ? resolve_workspace_path.cljs$core$IFn$_invoke$arity$3(G__31248,G__31249,G__31250) : resolve_workspace_path.call(null,G__31248,G__31249,G__31250));
})());
var offset = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(await (async function (){var or__5162__auto__ = (body["offset"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})()));
var limit = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(await (async function (){var or__5162__auto__ = (body["limit"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (400);
}
})()));
try{var stat = (await shadow.esm.esm_import$node_fs$promises.stat(path_str));
if(cljs.core.truth_(stat.isDirectory())){
return knoxx.backend.infra.routes.tools.read_directory_response_BANG_(json_response_BANG_,reply,role,path_str,clip_text);
} else {
return knoxx.backend.infra.routes.tools.read_file_response_BANG_(json_response_BANG_,reply,role,path_str,offset,limit,clip_text);
}
}catch (e31252){var err = e31252;
var G__31253 = reply;
var G__31254 = (404);
var G__31255 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31253,G__31254,G__31255) : json_response_BANG_.call(null,G__31253,G__31254,G__31255));
}}catch (e31242){var err = e31242;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31241;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31236,G__31237,G__31238,G__31239) : route_BANG_.call(null,G__31236,G__31237,G__31238,G__31239));
});
knoxx.backend.infra.routes.tools.write_body_params = (function knoxx$backend$infra$routes$tools$write_body_params(body,resolve_workspace_path,runtime,config){
var path_str = (function (){var G__31257 = runtime;
var G__31258 = config;
var G__31259 = (function (){var or__5162__auto__ = (body["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return (resolve_workspace_path.cljs$core$IFn$_invoke$arity$3 ? resolve_workspace_path.cljs$core$IFn$_invoke$arity$3(G__31257,G__31258,G__31259) : resolve_workspace_path.call(null,G__31257,G__31258,G__31259));
})();
var raw_content = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["content"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var content = (cljs.core.truth_(cljs.core.re_find(/\.svg$/i,path_str))?knoxx.backend.domain.text.sanitize_svg_content(raw_content):raw_content);
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"path-str","path-str",259306316),path_str,new cljs.core.Keyword(null,"content","content",15833224),content,new cljs.core.Keyword(null,"overwrite","overwrite",1291442417),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,(body["overwrite"])),new cljs.core.Keyword(null,"create-parents","create-parents",-742674381),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,(body["create_parents"])),new cljs.core.Keyword(null,"parent","parent",-878878779),shadow.esm.esm_import$node_path.dirname(path_str)], null);
});
knoxx.backend.infra.routes.tools.register_write_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_write_route_BANG_(app,runtime,config,deps){
var map__31264 = deps;
var map__31264__$1 = cljs.core.__destructure_map(map__31264);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var resolve_workspace_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"resolve-workspace-path","resolve-workspace-path",-1439207488));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31264__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31266 = app;
var G__31267 = "POST";
var G__31268 = "/api/tools/write";
var G__31269 = (function (){var obj31271 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31278 = ctx;
var G__31279 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31280 = "write";
var G__31281 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31278,G__31279,G__31280,G__31281) : ensure_role_can_use_BANG_.call(null,G__31278,G__31279,G__31280,G__31281));
})());
var map__31276 = knoxx.backend.infra.routes.tools.write_body_params(body,resolve_workspace_path,runtime,config);
var map__31276__$1 = cljs.core.__destructure_map(map__31276);
var path_str = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31276__$1,new cljs.core.Keyword(null,"path-str","path-str",259306316));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31276__$1,new cljs.core.Keyword(null,"content","content",15833224));
var overwrite = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31276__$1,new cljs.core.Keyword(null,"overwrite","overwrite",1291442417));
var create_parents = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31276__$1,new cljs.core.Keyword(null,"create-parents","create-parents",-742674381));
var parent = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31276__$1,new cljs.core.Keyword(null,"parent","parent",-878878779));
try{if(cljs.core.truth_(overwrite)){
} else {
try{(await shadow.esm.esm_import$node_fs$promises.stat(path_str));

var G__31288_31830 = reply;
var G__31289_31831 = (409);
var G__31290_31832 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"File exists and overwrite is false: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_str))], null);
(json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31288_31830,G__31289_31831,G__31290_31832) : json_response_BANG_.call(null,G__31288_31830,G__31289_31831,G__31290_31832));
}catch (e31286){var __31835 = e31286;
}}

if(cljs.core.truth_(create_parents)){
(await shadow.esm.esm_import$node_fs$promises.mkdir(parent,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));
} else {
}

(await shadow.esm.esm_import$node_fs$promises.writeFile(path_str,content,"utf8"));

var G__31291 = reply;
var G__31292 = (200);
var G__31293 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"path","path",-188191168),path_str,new cljs.core.Keyword(null,"bytes_written","bytes_written",-1316873497),Buffer.from(content,"utf8").length], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31291,G__31292,G__31293) : json_response_BANG_.call(null,G__31291,G__31292,G__31293));
}catch (e31282){var err = e31282;
var G__31283 = reply;
var G__31284 = (409);
var G__31285 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31283,G__31284,G__31285) : json_response_BANG_.call(null,G__31283,G__31284,G__31285));
}}catch (e31274){var err = e31274;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31271;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31266,G__31267,G__31268,G__31269) : route_BANG_.call(null,G__31266,G__31267,G__31268,G__31269));
});
knoxx.backend.infra.routes.tools.register_edit_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_edit_route_BANG_(app,runtime,config,deps){
var map__31295 = deps;
var map__31295__$1 = cljs.core.__destructure_map(map__31295);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var replace_first = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"replace-first","replace-first",1710901438));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var resolve_workspace_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"resolve-workspace-path","resolve-workspace-path",-1439207488));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var count_occurrences = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"count-occurrences","count-occurrences",1068095177));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31295__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31300 = app;
var G__31301 = "POST";
var G__31302 = "/api/tools/edit";
var G__31303 = (function (){var obj31305 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31308 = ctx;
var G__31309 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31310 = "edit";
var G__31311 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31308,G__31309,G__31310,G__31311) : ensure_role_can_use_BANG_.call(null,G__31308,G__31309,G__31310,G__31311));
})());
var path_str = (await (async function (){var G__31312 = runtime;
var G__31313 = config;
var G__31314 = (await (async function (){var or__5162__auto__ = (body["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
return (resolve_workspace_path.cljs$core$IFn$_invoke$arity$3 ? resolve_workspace_path.cljs$core$IFn$_invoke$arity$3(G__31312,G__31313,G__31314) : resolve_workspace_path.call(null,G__31312,G__31313,G__31314));
})());
var old_string = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["old_string"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var new_string = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["new_string"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var replace_all = (body["replace_all"]) === true;
try{var current = (await shadow.esm.esm_import$node_fs$promises.readFile(path_str,"utf8"));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(current.indexOf(old_string),(-1))){
var G__31321 = reply;
var G__31322 = (409);
var G__31323 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"old_string not found in file"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31321,G__31322,G__31323) : json_response_BANG_.call(null,G__31321,G__31322,G__31323));
} else {
var replacements = ((replace_all)?(count_occurrences.cljs$core$IFn$_invoke$arity$2 ? count_occurrences.cljs$core$IFn$_invoke$arity$2(current,old_string) : count_occurrences.call(null,current,old_string)):(1));
var updated = ((replace_all)?clojure.string.replace(current,old_string,new_string):(replace_first.cljs$core$IFn$_invoke$arity$3 ? replace_first.cljs$core$IFn$_invoke$arity$3(current,old_string,new_string) : replace_first.call(null,current,old_string,new_string)));
(await shadow.esm.esm_import$node_fs$promises.writeFile(path_str,updated,"utf8"));

var G__31325 = reply;
var G__31326 = (200);
var G__31327 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"path","path",-188191168),path_str,new cljs.core.Keyword(null,"replacements","replacements",1917839659),replacements], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31325,G__31326,G__31327) : json_response_BANG_.call(null,G__31325,G__31326,G__31327));
}
}catch (e31315){var err = e31315;
var G__31318 = reply;
var G__31319 = (409);
var G__31320 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31318,G__31319,G__31320) : json_response_BANG_.call(null,G__31318,G__31319,G__31320));
}}catch (e31306){var err = e31306;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31305;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31300,G__31301,G__31302,G__31303) : route_BANG_.call(null,G__31300,G__31301,G__31302,G__31303));
});
knoxx.backend.infra.routes.tools.bash_success_response_BANG_ = (function knoxx$backend$infra$routes$tools$bash_success_response_BANG_(json_response_BANG_,reply,role,body,result,clip_text){
var vec__31337 = (function (){var G__31343 = (function (){var or__5162__auto__ = (result["stdout"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__31344 = (24000);
return (clip_text.cljs$core$IFn$_invoke$arity$2 ? clip_text.cljs$core$IFn$_invoke$arity$2(G__31343,G__31344) : clip_text.call(null,G__31343,G__31344));
})();
var stdout = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31337,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31337,(1),null);
var vec__31340 = (function (){var G__31346 = (function (){var or__5162__auto__ = (result["stderr"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__31347 = (12000);
return (clip_text.cljs$core$IFn$_invoke$arity$2 ? clip_text.cljs$core$IFn$_invoke$arity$2(G__31346,G__31347) : clip_text.call(null,G__31346,G__31347));
})();
var stderr = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31340,(0),null);
var __ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31340,(1),null);
var G__31349 = reply;
var G__31350 = (200);
var G__31351 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"command","command",-894540724),(function (){var or__5162__auto__ = (body["command"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"exit_code","exit_code",85578367),(0),new cljs.core.Keyword(null,"stdout","stdout",-531490018),stdout,new cljs.core.Keyword(null,"stderr","stderr",-1571650309),stderr], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31349,G__31350,G__31351) : json_response_BANG_.call(null,G__31349,G__31350,G__31351));
});
knoxx.backend.infra.routes.tools.bash_error_response_BANG_ = (function knoxx$backend$infra$routes$tools$bash_error_response_BANG_(json_response_BANG_,reply,role,body,timeout_ms,err,clip_text){
if(cljs.core.truth_((function (){var and__5160__auto__ = (err["killed"]);
if(cljs.core.truth_(and__5160__auto__)){
return (!(typeof (err["code"]) === 'number'));
} else {
return and__5160__auto__;
}
})())){
var G__31361 = reply;
var G__31362 = (408);
var G__31363 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Command timed out after "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((timeout_ms / (1000)))+"s")], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31361,G__31362,G__31363) : json_response_BANG_.call(null,G__31361,G__31362,G__31363));
} else {
var vec__31365 = (function (){var G__31371 = (function (){var or__5162__auto__ = (err["stdout"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__31372 = (24000);
return (clip_text.cljs$core$IFn$_invoke$arity$2 ? clip_text.cljs$core$IFn$_invoke$arity$2(G__31371,G__31372) : clip_text.call(null,G__31371,G__31372));
})();
var stdout = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31365,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31365,(1),null);
var vec__31368 = (function (){var G__31373 = (function (){var or__5162__auto__ = (err["stderr"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var G__31374 = (12000);
return (clip_text.cljs$core$IFn$_invoke$arity$2 ? clip_text.cljs$core$IFn$_invoke$arity$2(G__31373,G__31374) : clip_text.call(null,G__31373,G__31374));
})();
var stderr = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31368,(0),null);
var __ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__31368,(1),null);
var G__31375 = reply;
var G__31376 = (200);
var G__31377 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"role","role",-736691072),role,new cljs.core.Keyword(null,"command","command",-894540724),(function (){var or__5162__auto__ = (body["command"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"exit_code","exit_code",85578367),((typeof (err["code"]) === 'number')?(err["code"]):(1)),new cljs.core.Keyword(null,"stdout","stdout",-531490018),stdout,new cljs.core.Keyword(null,"stderr","stderr",-1571650309),stderr], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31375,G__31376,G__31377) : json_response_BANG_.call(null,G__31375,G__31376,G__31377));
}
});
knoxx.backend.infra.routes.tools.register_bash_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_bash_route_BANG_(app,runtime,config,deps){
var map__31390 = deps;
var map__31390__$1 = cljs.core.__destructure_map(map__31390);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var resolve_workspace_path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"resolve-workspace-path","resolve-workspace-path",-1439207488));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31390__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31396 = app;
var G__31397 = "POST";
var G__31398 = "/api/tools/bash";
var G__31399 = (function (){var obj31402 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var agent_contract_id = (await (async function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})());
var role = (await (async function (){var G__31405 = ctx;
var G__31406 = (await (async function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var G__31407 = "bash";
var G__31408 = agent_contract_id;
return (ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31405,G__31406,G__31407,G__31408) : ensure_role_can_use_BANG_.call(null,G__31405,G__31406,G__31407,G__31408));
})());
var timeout_ms = cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2((await (async function (){var or__5162__auto__ = (body["timeout_ms"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()),(1000)),(120000));
var workdir = (await (async function (){var temp__5823__auto__ = (body["workdir"]);
if(cljs.core.truth_(temp__5823__auto__)){
var raw_wd = temp__5823__auto__;
return (resolve_workspace_path.cljs$core$IFn$_invoke$arity$3 ? resolve_workspace_path.cljs$core$IFn$_invoke$arity$3(runtime,config,raw_wd) : resolve_workspace_path.call(null,runtime,config,raw_wd));
} else {
return shadow.esm.esm_import$node_path.resolve(new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config));
}
})());
try{var result = (await (await (async function (){var G__31417 = "/bin/bash";
var G__31418 = cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["-lc",(await (async function (){var or__5162__auto__ = (body["command"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())], null));
var G__31419 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"cwd","cwd",14056523),workdir,new cljs.core.Keyword(null,"timeout","timeout",-318625318),timeout_ms,new cljs.core.Keyword(null,"killSignal","killSignal",-810841257),"SIGKILL",new cljs.core.Keyword(null,"maxBuffer","maxBuffer",-260753686),(1048576)], null));
return (knoxx.backend.infra.routes.tools.exec_file_async.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.routes.tools.exec_file_async.cljs$core$IFn$_invoke$arity$3(G__31417,G__31418,G__31419) : knoxx.backend.infra.routes.tools.exec_file_async.call(null,G__31417,G__31418,G__31419));
})()));
return knoxx.backend.infra.routes.tools.bash_success_response_BANG_(json_response_BANG_,reply,role,body,result,clip_text);
}catch (e31416){var err = e31416;
return knoxx.backend.infra.routes.tools.bash_error_response_BANG_(json_response_BANG_,reply,role,body,timeout_ms,err,clip_text);
}}catch (e31403){var err = e31403;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31402;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31396,G__31397,G__31398,G__31399) : route_BANG_.call(null,G__31396,G__31397,G__31398,G__31399));
});
knoxx.backend.infra.routes.tools.register_discord_publish_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_discord_publish_route_BANG_(app,runtime,config,deps){
var map__31421 = deps;
var map__31421__$1 = cljs.core.__destructure_map(map__31421);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var ensure_role_can_use_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"ensure-role-can-use!","ensure-role-can-use!",-210679577));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31421__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31423 = app;
var G__31424 = "POST";
var G__31425 = "/api/tools/discord/publish";
var G__31426 = (function (){var obj31430 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
try{var body = (function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var agent_contract_id = (function (){var or__5162__auto__ = (body["agentContractId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (body["agent_contract_id"]);
}
})();
var G__31439_31840 = ctx;
var G__31440_31841 = (function (){var or__5162__auto__ = (body["role"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"knoxx-default-role","knoxx-default-role",1668482524).cljs$core$IFn$_invoke$arity$1(config);
}
})();
var G__31441_31842 = "discord.publish";
var G__31442_31843 = agent_contract_id;
(ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4 ? ensure_role_can_use_BANG_.cljs$core$IFn$_invoke$arity$4(G__31439_31840,G__31440_31841,G__31441_31842,G__31442_31843) : ensure_role_can_use_BANG_.call(null,G__31439_31840,G__31440_31841,G__31441_31842,G__31442_31843));

var G__31443 = reply;
var G__31444 = (410);
var G__31445 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"detail","detail",-1545345025),"Global Discord publish is disabled. Use actor-owned Discord credentials via Admin \u2192 Actors and the discord.send tool."], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31443,G__31444,G__31445) : json_response_BANG_.call(null,G__31443,G__31444,G__31445));
}catch (e31437){var err = e31437;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31430;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31423,G__31424,G__31425,G__31426) : route_BANG_.call(null,G__31423,G__31424,G__31425,G__31426));
});
knoxx.backend.infra.routes.tools.register_discord_token_get_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_discord_token_get_route_BANG_(app,runtime,config,deps){
var map__31447 = deps;
var map__31447__$1 = cljs.core.__destructure_map(map__31447);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31447__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31448 = app;
var G__31449 = "GET";
var G__31450 = "/api/admin/config/discord";
var G__31451 = (function (){var obj31453 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var G__31456 = reply;
var G__31457 = (200);
var G__31458 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"configured","configured",-884777889),false,new cljs.core.Keyword(null,"tokenPreview","tokenPreview",-2066034955),"",new cljs.core.Keyword(null,"credentialSource","credentialSource",-355856243),"actor_credentials",new cljs.core.Keyword(null,"detail","detail",-1545345025),"Discord bot keys are configured per actor in Admin \u2192 Actors."], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31456,G__31457,G__31458) : json_response_BANG_.call(null,G__31456,G__31457,G__31458));
})});
return obj31453;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31448,G__31449,G__31450,G__31451) : route_BANG_.call(null,G__31448,G__31449,G__31450,G__31451));
});
knoxx.backend.infra.routes.tools.register_discord_token_put_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_discord_token_put_route_BANG_(app,runtime,config,deps){
var map__31460 = deps;
var map__31460__$1 = cljs.core.__destructure_map(map__31460);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31460__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31461 = app;
var G__31462 = "PUT";
var G__31463 = "/api/admin/config/discord";
var G__31464 = (function (){var obj31469 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var G__31478 = reply;
var G__31479 = (410);
var G__31480 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"configured","configured",-884777889),false,new cljs.core.Keyword(null,"credentialSource","credentialSource",-355856243),"actor_credentials",new cljs.core.Keyword(null,"detail","detail",-1545345025),"Global Discord token configuration has been migrated. Store Discord bot credentials on an actor in Admin \u2192 Actors."], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31478,G__31479,G__31480) : json_response_BANG_.call(null,G__31478,G__31479,G__31480));
}catch (e31477){var err = e31477;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31469;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31461,G__31462,G__31463,G__31464) : route_BANG_.call(null,G__31461,G__31462,G__31463,G__31464));
});
knoxx.backend.infra.routes.tools.register_events_get_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_get_route_BANG_(app,runtime,config,deps){
var map__31481 = deps;
var map__31481__$1 = cljs.core.__destructure_map(map__31481);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31481__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31482 = app;
var G__31483 = "GET";
var G__31484 = "/api/admin/config/events";
var G__31485 = (function (){var obj31487 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var G__31495 = reply;
var G__31496 = (200);
var G__31497 = knoxx.backend.infra.routes.tools.events_control_response(config);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31495,G__31496,G__31497) : json_response_BANG_.call(null,G__31495,G__31496,G__31497));
})});
return obj31487;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31482,G__31483,G__31484,G__31485) : route_BANG_.call(null,G__31482,G__31483,G__31484,G__31485));
});
knoxx.backend.infra.routes.tools.register_events_put_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_put_route_BANG_(app,runtime,config,deps){
var map__31499 = deps;
var map__31499__$1 = cljs.core.__destructure_map(map__31499);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31499__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31500 = app;
var G__31501 = "PUT";
var G__31502 = "/api/admin/config/events";
var G__31503 = (function (){var obj31505 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var live_config = (function (){var or__5162__auto__ = cljs.core.deref(knoxx.backend.runtime.state.config_STAR_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return config;
}
})();
var next_control = knoxx.backend.infra.control_config.event_control_config(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(live_config,new cljs.core.Keyword(null,"event-control","event-control",1716291468),body));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.runtime.state.config_STAR_,(function (c){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3((function (){var or__5162__auto__ = c;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return config;
}
})(),new cljs.core.Keyword(null,"event-control","event-control",1716291468),next_control);
}));

knoxx.backend.infra.control_config.persist_event_control_BANG_(next_control);

knoxx.backend.infra.event_runtime.reload_BANG_.cljs$core$IFn$_invoke$arity$1(live_config);

var G__31521 = reply;
var G__31522 = (200);
var G__31523 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.routes.tools.events_control_response(config),new cljs.core.Keyword(null,"ok","ok",967785236),true);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31521,G__31522,G__31523) : json_response_BANG_.call(null,G__31521,G__31522,G__31523));
}catch (e31513){var err = e31513;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31505;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31500,G__31501,G__31502,G__31503) : route_BANG_.call(null,G__31500,G__31501,G__31502,G__31503));
});
knoxx.backend.infra.routes.tools.register_events_trigger_fire_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_trigger_fire_route_BANG_(app,runtime,config,deps){
var map__31533 = deps;
var map__31533__$1 = cljs.core.__destructure_map(map__31533);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31533__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31535 = app;
var G__31536 = "POST";
var G__31537 = "/api/admin/config/events/triggers/:triggerId/fire";
var G__31538 = (function (){var obj31540 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var trigger_id = (await (async function (){var or__5162__auto__ = (request["params"]["triggerId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(trigger_id)){
var G__31544 = reply;
var G__31545 = (400);
var G__31546 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"triggerId is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31544,G__31545,G__31546) : json_response_BANG_.call(null,G__31544,G__31545,G__31546));
} else {
try{var result = (await knoxx.backend.infra.event_runtime.fire_trigger_BANG_.cljs$core$IFn$_invoke$arity$2(config,trigger_id));
return knoxx.backend.infra.routes.tools.trigger_fire_response_BANG_(reply,trigger_id,result);
}catch (e31547){var err = e31547;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}}
}catch (e31543){var err = e31543;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31540;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31535,G__31536,G__31537,G__31538) : route_BANG_.call(null,G__31535,G__31536,G__31537,G__31538));
});
knoxx.backend.infra.routes.tools.register_events_dispatch_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_dispatch_route_BANG_(app,runtime,config,deps){
var map__31557 = deps;
var map__31557__$1 = cljs.core.__destructure_map(map__31557);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31557__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31560 = app;
var G__31561 = "POST";
var G__31562 = "/api/admin/config/events/dispatch";
var G__31563 = (function (){var obj31566 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
try{var result = (await knoxx.backend.domain.event.dispatch.dispatch_BANG_.cljs$core$IFn$_invoke$arity$2(config,body));
var failures = knoxx.backend.infra.routes.tools.failed_trigger_results(result);
var failed_QMARK_ = cljs.core.seq(failures);
var G__31573 = reply;
var G__31574 = ((failed_QMARK_)?(500):(202));
var G__31575 = (await (async function (){var G__31576 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),cljs.core.not(failed_QMARK_),new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767),new cljs.core.Keyword(null,"matchedTriggers","matchedTriggers",467215767).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"event","event",301435442),new cljs.core.Keyword(null,"event","event",301435442).cljs$core$IFn$_invoke$arity$1(result),new cljs.core.Keyword(null,"results","results",-1134170113),new cljs.core.Keyword(null,"results","results",-1134170113).cljs$core$IFn$_invoke$arity$1(result)], null);
if(failed_QMARK_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__31576,new cljs.core.Keyword(null,"detail","detail",-1545345025),"One or more trigger actions failed",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"failures","failures",-912916356),failures], 0));
} else {
return G__31576;
}
})());
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31573,G__31574,G__31575) : json_response_BANG_.call(null,G__31573,G__31574,G__31575));
}catch (e31570){var err = e31570;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}}catch (e31569){var err = e31569;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31566;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31560,G__31561,G__31562,G__31563) : route_BANG_.call(null,G__31560,G__31561,G__31562,G__31563));
});
knoxx.backend.infra.routes.tools.register_events_runtime_stop_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_runtime_stop_route_BANG_(app,runtime,config,deps){
var map__31587 = deps;
var map__31587__$1 = cljs.core.__destructure_map(map__31587);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31587__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31590 = app;
var G__31591 = "POST";
var G__31592 = "/api/admin/config/events/runtime/stop";
var G__31593 = (function (){var obj31597 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

knoxx.backend.infra.event_runtime.stop_BANG_();

var G__31602 = reply;
var G__31603 = (200);
var G__31604 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.tools.events_control_response(config),new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"action","action",-811238024),"stopped"], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31602,G__31603,G__31604) : json_response_BANG_.call(null,G__31602,G__31603,G__31604));
})});
return obj31597;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31590,G__31591,G__31592,G__31593) : route_BANG_.call(null,G__31590,G__31591,G__31592,G__31593));
});
knoxx.backend.infra.routes.tools.register_events_runtime_start_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_runtime_start_route_BANG_(app,runtime,config,deps){
var map__31612 = deps;
var map__31612__$1 = cljs.core.__destructure_map(map__31612);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31612__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31616 = app;
var G__31617 = "POST";
var G__31618 = "/api/admin/config/events/runtime/start";
var G__31619 = (function (){var obj31624 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

knoxx.backend.infra.event_runtime.start_BANG_.cljs$core$IFn$_invoke$arity$1(config);

var G__31629 = reply;
var G__31630 = (200);
var G__31631 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.routes.tools.events_control_response(config),new cljs.core.Keyword(null,"ok","ok",967785236),true,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"action","action",-811238024),"started"], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31629,G__31630,G__31631) : json_response_BANG_.call(null,G__31629,G__31630,G__31631));
})});
return obj31624;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31616,G__31617,G__31618,G__31619) : route_BANG_.call(null,G__31616,G__31617,G__31618,G__31619));
});
knoxx.backend.infra.routes.tools.register_events_runtime_reset_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_events_runtime_reset_route_BANG_(app,runtime,config,deps){
var map__31636 = deps;
var map__31636__$1 = cljs.core.__destructure_map(map__31636);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31636__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31642 = app;
var G__31643 = "POST";
var G__31644 = "/api/admin/config/events/runtime/reset";
var G__31645 = (function (){var obj31647 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

try{var summary = (await knoxx.backend.infra.event_runtime.reset_runtime_BANG_.cljs$core$IFn$_invoke$arity$1(config));
var G__31682 = reply;
var G__31683 = (200);
var G__31684 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.routes.tools.events_control_response(config),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"action","action",-811238024),"reset",new cljs.core.Keyword(null,"reset","reset",-800929946),summary], null)], 0));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31682,G__31683,G__31684) : json_response_BANG_.call(null,G__31682,G__31683,G__31684));
}catch (e31674){var err = e31674;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}}catch (e31667){var err = e31667;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31647;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31642,G__31643,G__31644,G__31645) : route_BANG_.call(null,G__31642,G__31643,G__31644,G__31645));
});
knoxx.backend.infra.routes.tools.register_trigger_fire_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_trigger_fire_route_BANG_(app,runtime,config,deps){
var map__31712 = deps;
var map__31712__$1 = cljs.core.__destructure_map(map__31712);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31712__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31729 = app;
var G__31730 = "POST";
var G__31731 = "/api/admin/triggers/:triggerId/fire";
var G__31732 = (function (){var obj31736 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.events.control") : ensure_permission_BANG_.call(null,ctx,"org.events.control"));

var trigger_id = (await (async function (){var or__5162__auto__ = (request["params"]["triggerId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(trigger_id)){
var G__31745 = reply;
var G__31746 = (400);
var G__31747 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"triggerId is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31745,G__31746,G__31747) : json_response_BANG_.call(null,G__31745,G__31746,G__31747));
} else {
try{var result = (await knoxx.backend.infra.event_runtime.fire_BANG_.cljs$core$IFn$_invoke$arity$1(trigger_id));
return knoxx.backend.infra.routes.tools.trigger_fire_response_BANG_(reply,trigger_id,result);
}catch (e31748){var err = e31748;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}}
}catch (e31743){var err = e31743;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31736;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31729,G__31730,G__31731,G__31732) : route_BANG_.call(null,G__31729,G__31730,G__31731,G__31732));
});
knoxx.backend.infra.routes.tools.register_mcp_status_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_mcp_status_route_BANG_(app,runtime,config,deps){
var map__31749 = deps;
var map__31749__$1 = cljs.core.__destructure_map(map__31749);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31749__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31750 = app;
var G__31751 = "GET";
var G__31752 = "/api/mcp/status";
var G__31753 = (function (){var obj31755 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [optional_session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var G__31760 = reply;
var G__31761 = (200);
var G__31762 = knoxx.backend.domain.mcp.mcp_bridge.status();
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31760,G__31761,G__31762) : json_response_BANG_.call(null,G__31760,G__31761,G__31762));
})});
return obj31755;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31750,G__31751,G__31752,G__31753) : route_BANG_.call(null,G__31750,G__31751,G__31752,G__31753));
});
knoxx.backend.infra.routes.tools.register_mcp_catalog_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_mcp_catalog_route_BANG_(app,runtime,config,deps){
var map__31766 = deps;
var map__31766__$1 = cljs.core.__destructure_map(map__31766);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31766__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31769 = app;
var G__31770 = "GET";
var G__31771 = "/api/mcp/catalog";
var G__31772 = (function (){var obj31774 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [optional_session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var G__31775 = reply;
var G__31776 = (200);
var G__31777 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tools","tools",-1241731990),knoxx.backend.domain.mcp.mcp_bridge.catalog(),new cljs.core.Keyword(null,"enabled","enabled",1195909756),knoxx.backend.domain.mcp.mcp_bridge.enabled_QMARK_()], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31775,G__31776,G__31777) : json_response_BANG_.call(null,G__31775,G__31776,G__31777));
})});
return obj31774;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31769,G__31770,G__31771,G__31772) : route_BANG_.call(null,G__31769,G__31770,G__31771,G__31772));
});
knoxx.backend.infra.routes.tools.register_mcp_call_route_BANG_ = (function knoxx$backend$infra$routes$tools$register_mcp_call_route_BANG_(app,runtime,config,deps){
var map__31781 = deps;
var map__31781__$1 = cljs.core.__destructure_map(map__31781);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31781__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31782 = app;
var G__31783 = "POST";
var G__31784 = "/api/mcp/call";
var G__31785 = (function (){var obj31787 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [session_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
try{(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));

var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var tool_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (body["toolId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var args = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (body["arguments"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(clojure.string.blank_QMARK_(tool_id)){
var G__31792 = reply;
var G__31793 = (400);
var G__31794 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"toolId is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31792,G__31793,G__31794) : json_response_BANG_.call(null,G__31792,G__31793,G__31794));
} else {
try{var result = (await knoxx.backend.domain.mcp.mcp_bridge.call_tool_BANG_(tool_id,args));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),result) : json_response_BANG_.call(null,reply,(200),result));
}catch (e31795){var err = e31795;
var G__31796 = reply;
var G__31797 = (502);
var G__31798 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"MCP tool call failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})())))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__31796,G__31797,G__31798) : json_response_BANG_.call(null,G__31796,G__31797,G__31798));
}}
}catch (e31788){var err = e31788;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}})});
return obj31787;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31782,G__31783,G__31784,G__31785) : route_BANG_.call(null,G__31782,G__31783,G__31784,G__31785));
});
knoxx.backend.infra.routes.tools.register_tool_routes_BANG_ = (function knoxx$backend$infra$routes$tools$register_tool_routes_BANG_(app,runtime,config,deps){
knoxx.backend.infra.routes.tools.register_tool_catalog_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_email_send_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_websearch_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_read_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_write_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_edit_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_bash_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_discord_publish_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_discord_token_get_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_discord_token_put_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_get_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_put_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_trigger_fire_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_dispatch_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_runtime_stop_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_runtime_start_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_events_runtime_reset_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_trigger_fire_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_mcp_status_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_mcp_catalog_route_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.tools.register_mcp_call_route_BANG_(app,runtime,config,deps);

return null;
});

//# sourceMappingURL=knoxx.backend.infra.routes.tools.js.map
