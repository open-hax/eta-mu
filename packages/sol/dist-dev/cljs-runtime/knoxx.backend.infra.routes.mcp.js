import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./malli.core.js";
import "./malli.error.js";
import "./knoxx.backend.shape.app_shapes.js";
import "./knoxx.backend.infra.auth.session.js";
import "./knoxx.backend.infra.db.policy.js";
import "./knoxx.backend.domain.mcp.mcp_expose.js";
import "./knoxx.backend.infra.stores.mongo_mcp_oauth.js";
import "./knoxx.backend.runtime.state.js";
import "./shadow.esm.esm_import$$modelcontextprotocol$sdk$server$mcp.js";
import "./shadow.esm.esm_import$$modelcontextprotocol$sdk$server$streamableHttp.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$zod.js";
goog.provide('knoxx.backend.infra.routes.mcp');

if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.routes !== 'undefined') && (typeof knoxx.backend.infra.routes.mcp !== 'undefined') && (typeof knoxx.backend.infra.routes.mcp.mcp_sessions_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.routes.mcp.mcp_sessions_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
knoxx.backend.infra.routes.mcp.RegisterClientBody = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"redirect-uris","redirect-uris",778927369),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),cljs.core.string_QMARK_], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"client-name","client-name",1843891115),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),cljs.core.string_QMARK_], null)], null);
knoxx.backend.infra.routes.mcp.AuthorizeQuery = new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"state","state",-1988618099),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),cljs.core.string_QMARK_], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scope","scope",-439358418),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),cljs.core.string_QMARK_], null)], null)], null);
knoxx.backend.infra.routes.mcp.AuthorizeConfirmQuery = new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"state","state",-1988618099),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),cljs.core.string_QMARK_], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"scope","scope",-439358418),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),cljs.core.string_QMARK_], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"selected-tools","selected-tools",700501530),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),cljs.core.string_QMARK_], null)], null)], null);
knoxx.backend.infra.routes.mcp.TokenExchangeBody = new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"grant-type","grant-type",-1751533246),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code","code",1586293142),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"code-verifier","code-verifier",-848846001),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),cljs.core.string_QMARK_], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),cljs.core.string_QMARK_], null)], null);
knoxx.backend.infra.routes.mcp.RevokeTokenParams = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"token-id","token-id",-764089526),cljs.core.string_QMARK_], null)], null);
knoxx.backend.infra.routes.mcp.env = (function knoxx$backend$infra$routes$mcp$env(k,default$){
var or__5162__auto__ = (process.env[k]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default$;
}
});
knoxx.backend.infra.routes.mcp.public_base_url = (function knoxx$backend$infra$routes$mcp$public_base_url(config){
try{return (new URL((function (){var or__5162__auto__ = (process.env["KNOXX_PUBLIC_BASE_URL"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (process.env["RENDER_EXTERNAL_URL"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "http://localhost";
}
}
}
})()));
}catch (e30880){var _ = e30880;
return (new URL("http://localhost"));
}});
knoxx.backend.infra.routes.mcp.base64url = (function knoxx$backend$infra$routes$mcp$base64url(buf){
return Buffer.from(buf).toString("base64url");
});
knoxx.backend.infra.routes.mcp.pkce_challenge = (function knoxx$backend$infra$routes$mcp$pkce_challenge(crypto,verifier){
return knoxx.backend.infra.routes.mcp.base64url(crypto.createHash("sha256").update((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(verifier))).digest());
});
knoxx.backend.infra.routes.mcp.bearer_token = (function knoxx$backend$infra$routes$mcp$bearer_token(req){
var raw = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (function (){var G__30906 = req;
var G__30906__$1 = (((G__30906 == null))?null:(G__30906["headers"]));
if((G__30906__$1 == null)){
return null;
} else {
return (G__30906__$1["authorization"]);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var m = raw.match((new RegExp("^Bearer\\s+(.+)$","i")));
if(cljs.core.truth_(m)){
return clojure.string.trim((m[(1)]));
} else {
return null;
}
});
knoxx.backend.infra.routes.mcp.resolve_session_id = (function knoxx$backend$infra$routes$mcp$resolve_session_id(req){
var headers = (function (){var or__5162__auto__ = (req["headers"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var header_id = (headers["mcp-session-id"]);
var q = (function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var query_id = (q["sessionId"]);
if(((typeof header_id === 'string') && ((!(clojure.string.blank_QMARK_(header_id)))))){
return header_id;
} else {
if(((typeof query_id === 'string') && ((!(clojure.string.blank_QMARK_(query_id)))))){
return query_id;
} else {
return null;

}
}
});
knoxx.backend.infra.routes.mcp.safe = (function knoxx$backend$infra$routes$mcp$safe(s){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll("\"","&quot;");
});
knoxx.backend.infra.routes.mcp.normalize_tool_selection = (function knoxx$backend$infra$routes$mcp$normalize_tool_selection(raw){
if((raw == null)){
return cljs.core.PersistentVector.EMPTY;
} else {
if(cljs.core.truth_(cljs.core.array_QMARK_(raw))){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(raw));
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw))], null);

}
}
});
knoxx.backend.infra.routes.mcp.json_send_BANG_ = (function knoxx$backend$infra$routes$mcp$json_send_BANG_(reply,status,payload){
return reply.code(status).send(cljs.core.clj__GT_js(payload));
});
knoxx.backend.infra.routes.mcp.text_send_BANG_ = (function knoxx$backend$infra$routes$mcp$text_send_BANG_(reply,status,body){
return reply.code(status).send(body);
});
knoxx.backend.infra.routes.mcp.protected_resource_metadata_url = (function knoxx$backend$infra$routes$mcp$protected_resource_metadata_url(base){
return (new URL("/.well-known/oauth-protected-resource",base)).toString();
});
knoxx.backend.infra.routes.mcp.www_authenticate_challenge = (function knoxx$backend$infra$routes$mcp$www_authenticate_challenge(base){
return (""+"Bearer realm=\"mcp\", resource_metadata=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.protected_resource_metadata_url(base))+"\"");
});
knoxx.backend.infra.routes.mcp.challenge_unauthorized_BANG_ = (function knoxx$backend$infra$routes$mcp$challenge_unauthorized_BANG_(reply,base){
return (function (){var G__30950 = reply;
var G__30951 = "WWW-Authenticate";
var G__30952 = knoxx.backend.infra.routes.mcp.www_authenticate_challenge(base);
return (knoxx.backend.infra.routes.mcp.reply_header_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.routes.mcp.reply_header_BANG_.cljs$core$IFn$_invoke$arity$3(G__30950,G__30951,G__30952) : knoxx.backend.infra.routes.mcp.reply_header_BANG_.call(null,G__30950,G__30951,G__30952));
})().code((401)).send("Unauthorized");
});
knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_ = (function knoxx$backend$infra$routes$mcp$transport_handle_request_BANG_(var_args){
var G__30956 = arguments.length;
switch (G__30956) {
case 3:
return knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (t,req,reply){
return t.handleRequest(req,reply);
}));

(knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (t,req,reply,body){
return t.handleRequest(req,reply,body);
}));

(knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.routes.mcp.tool_execute_BANG_ = (function knoxx$backend$infra$routes$mcp$tool_execute_BANG_(tool,params){
return tool.execute("mcp",params,null,null,null);
});
knoxx.backend.infra.routes.mcp.reply_header_BANG_ = (function knoxx$backend$infra$routes$mcp$reply_header_BANG_(reply,name,value){
return reply.header(name,value);
});
knoxx.backend.infra.routes.mcp.ensure_streamable_accept_BANG_ = (function knoxx$backend$infra$routes$mcp$ensure_streamable_accept_BANG_(req){
var raw = (req["raw"]);
var headers = (function (){var or__5162__auto__ = (raw["headers"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var raw_headers = (function (){var or__5162__auto__ = (raw["rawHeaders"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})();
var accept_value = "application/json, text/event-stream";
var accept = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (headers["accept"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var has_json_QMARK_ = clojure.string.includes_QMARK_(accept,"application/json");
var has_sse_QMARK_ = clojure.string.includes_QMARK_(accept,"text/event-stream");
if(((clojure.string.blank_QMARK_(accept)) || ((((!(has_json_QMARK_))) || ((!(has_sse_QMARK_))))))){
(headers["accept"] = accept_value);

(raw["headers"] = headers);

var filtered_31800 = cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.identity,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__30976){
var vec__30977 = p__30976;
var k = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30977,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30977,(1),null);
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("accept",clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k))));
}),cljs.core.partition.cljs$core$IFn$_invoke$arity$2((2),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(raw_headers)))], 0)));
(raw["rawHeaders"] = cljs.core.clj__GT_js(cljs.core.conj.cljs$core$IFn$_invoke$arity$variadic(filtered_31800,"accept",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([accept_value], 0))));
} else {
}

return req;
});
knoxx.backend.infra.routes.mcp.http_error = (function knoxx$backend$infra$routes$mcp$http_error(var_args){
var G__30988 = arguments.length;
switch (G__30988) {
case 3:
return knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3 = (function (status,error,detail){
return cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(detail,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"error","error",-978969032),error,new cljs.core.Keyword(null,"detail","detail",-1545345025),detail], null));
}));

(knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$4 = (function (status,error,detail,data){
return cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2(detail,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"error","error",-978969032),error,new cljs.core.Keyword(null,"detail","detail",-1545345025),detail], null),data], 0)));
}));

(knoxx.backend.infra.routes.mcp.http_error.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.routes.mcp.validation_detail = (function knoxx$backend$infra$routes$mcp$validation_detail(schema,value){
var G__30995 = malli.core.explain.cljs$core$IFn$_invoke$arity$2(schema,value);
var G__30995__$1 = (((G__30995 == null))?null:malli.error.humanize.cljs$core$IFn$_invoke$arity$1(G__30995));
if((G__30995__$1 == null)){
return null;
} else {
return cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([G__30995__$1], 0));
}
});
knoxx.backend.infra.routes.mcp.validate_BANG_ = (function knoxx$backend$infra$routes$mcp$validate_BANG_(schema,value,p__31000){
var map__31001 = p__31000;
var map__31001__$1 = cljs.core.__destructure_map(map__31001);
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31001__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31001__$1,new cljs.core.Keyword(null,"error","error",-978969032));
var detail = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31001__$1,new cljs.core.Keyword(null,"detail","detail",-1545345025));
if(cljs.core.truth_(malli.core.validate.cljs$core$IFn$_invoke$arity$2(schema,value))){
return value;
} else {
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (400);
}
})(),(function (){var or__5162__auto__ = error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "invalid_request";
}
})(),(function (){var or__5162__auto__ = detail;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.routes.mcp.validation_detail(schema,value);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Invalid request";
}
}
})());
}
});
knoxx.backend.infra.routes.mcp.browser_auth_ctx_BANG_ = (async function knoxx$backend$infra$routes$mcp$browser_auth_ctx_BANG_(req,policy_db,config){
try{var auth_ctx = (await knoxx.backend.infra.auth.session.resolve_auth_context(req,policy_db));
(req["authContext"] = auth_ctx);

return null;
}catch (e31017){var _ = e31017;
var base = knoxx.backend.infra.routes.mcp.public_base_url(config);
var current_path = (await (async function (){var or__5162__auto__ = (await (async function (){var G__31020 = req;
var G__31020__$1 = (((G__31020 == null))?null:(G__31020["raw"]));
if((G__31020__$1 == null)){
return null;
} else {
return (G__31020__$1["url"]);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/api/mcp/oauth/authorize";
}
})());
var login_url = (new URL("/api/auth/login",base));
login_url.searchParams.set("redirect",current_path);

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"redirect","redirect",-1975673286),login_url.toString()], null);
}});
/**
 * Returns a Fastify preHandler hook that resolves browser auth context onto request.authContext.
 */
knoxx.backend.infra.routes.mcp.require_browser_auth_BANG_ = (function knoxx$backend$infra$routes$mcp$require_browser_auth_BANG_(policy_db,config){
return (async function (req,reply){
var result = (await knoxx.backend.infra.routes.mcp.browser_auth_ctx_BANG_(req,policy_db,config));
if(cljs.core.truth_(result)){
return reply.redirect(new cljs.core.Keyword(null,"redirect","redirect",-1975673286).cljs$core$IFn$_invoke$arity$1(result),(302));
} else {
return null;
}
});
});
/**
 * Returns a Fastify preHandler hook that extracts bearer token onto request.bearerToken.
 */
knoxx.backend.infra.routes.mcp.require_bearer_token_BANG_ = (function knoxx$backend$infra$routes$mcp$require_bearer_token_BANG_(base){
return (function (req,reply,done){
var token = knoxx.backend.infra.routes.mcp.bearer_token(req);
if(clojure.string.blank_QMARK_(token)){
return knoxx.backend.infra.routes.mcp.challenge_unauthorized_BANG_(reply,base);
} else {
(req["bearerToken"] = token);

return (done.cljs$core$IFn$_invoke$arity$0 ? done.cljs$core$IFn$_invoke$arity$0() : done.call(null));
}
});
});
knoxx.backend.infra.routes.mcp.parse_register_client_body = (function knoxx$backend$infra$routes$mcp$parse_register_client_body(req){
var body = (function (){var or__5162__auto__ = (req["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var value = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"redirect-uris","redirect-uris",778927369),(cljs.core.truth_(cljs.core.array_QMARK_((body["redirect_uris"])))?cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((body["redirect_uris"]))):cljs.core.PersistentVector.EMPTY),new cljs.core.Keyword(null,"client-name","client-name",1843891115),(function (){var G__31027 = (body["client_name"]);
if((G__31027 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31027));
}
})()], null);
var parsed = knoxx.backend.infra.routes.mcp.validate_BANG_(knoxx.backend.infra.routes.mcp.RegisterClientBody,value,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"error","error",-978969032),"invalid_client_metadata",new cljs.core.Keyword(null,"detail","detail",-1545345025),"redirect_uris is required"], null));
if(cljs.core.empty_QMARK_(new cljs.core.Keyword(null,"redirect-uris","redirect-uris",778927369).cljs$core$IFn$_invoke$arity$1(parsed))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_client_metadata","redirect_uris is required");
} else {
}

return parsed;
});
knoxx.backend.infra.routes.mcp.parse_authorize_query = (function knoxx$backend$infra$routes$mcp$parse_authorize_query(req){
var q = (function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
return knoxx.backend.infra.routes.mcp.validate_BANG_(knoxx.backend.infra.routes.mcp.AuthorizeQuery,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["client_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["redirect_uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"state","state",-1988618099),(function (){var temp__5825__auto__ = (q["state"]);
if(cljs.core.truth_(temp__5825__auto__)){
var s = temp__5825__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(s));
} else {
return null;
}
})(),new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["code_challenge"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["code_challenge_method"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "S256";
}
})())),new cljs.core.Keyword(null,"scope","scope",-439358418),(function (){var temp__5825__auto__ = (q["scope"]);
if(cljs.core.truth_(temp__5825__auto__)){
var scope = temp__5825__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope));
} else {
return null;
}
})()], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"error","error",-978969032),"invalid_request"], null));
});
knoxx.backend.infra.routes.mcp.parse_authorize_confirm_query = (function knoxx$backend$infra$routes$mcp$parse_authorize_confirm_query(req){
var q = (function (){var or__5162__auto__ = (req["query"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
return knoxx.backend.infra.routes.mcp.validate_BANG_(knoxx.backend.infra.routes.mcp.AuthorizeConfirmQuery,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"client-id","client-id",-464622140),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["client_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["redirect_uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"state","state",-1988618099),(function (){var temp__5825__auto__ = (q["state"]);
if(cljs.core.truth_(temp__5825__auto__)){
var s = temp__5825__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(s));
} else {
return null;
}
})(),new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["code_challenge"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (q["code_challenge_method"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "S256";
}
})())),new cljs.core.Keyword(null,"scope","scope",-439358418),(function (){var temp__5825__auto__ = (q["scope"]);
if(cljs.core.truth_(temp__5825__auto__)){
var scope = temp__5825__auto__;
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scope));
} else {
return null;
}
})(),new cljs.core.Keyword(null,"selected-tools","selected-tools",700501530),knoxx.backend.infra.routes.mcp.normalize_tool_selection((q["tool"]))], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"error","error",-978969032),"invalid_request"], null));
});
knoxx.backend.infra.routes.mcp.parse_token_exchange_body = (function knoxx$backend$infra$routes$mcp$parse_token_exchange_body(req){
var body = (function (){var or__5162__auto__ = (req["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
return knoxx.backend.infra.routes.mcp.validate_BANG_(knoxx.backend.infra.routes.mcp.TokenExchangeBody,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"grant-type","grant-type",-1751533246),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["grant_type"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["grantType"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())),new cljs.core.Keyword(null,"code","code",1586293142),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["code"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),new cljs.core.Keyword(null,"code-verifier","code-verifier",-848846001),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["code_verifier"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["codeVerifier"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())),new cljs.core.Keyword(null,"client-id","client-id",-464622140),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["client_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["clientId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())),new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (body["redirect_uri"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (body["redirectUri"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()))], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"error","error",-978969032),"invalid_request"], null));
});
knoxx.backend.infra.routes.mcp.parse_revoke_token_params = (function knoxx$backend$infra$routes$mcp$parse_revoke_token_params(req){
var params = (function (){var or__5162__auto__ = (req["params"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
return knoxx.backend.infra.routes.mcp.validate_BANG_(knoxx.backend.infra.routes.mcp.RevokeTokenParams,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"token-id","token-id",-764089526),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (params["tokenId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"error","error",-978969032),"invalid_request"], null));
});
knoxx.backend.infra.routes.mcp.ensure_oauth_request_BANG_ = (function knoxx$backend$infra$routes$mcp$ensure_oauth_request_BANG_(p__31121){
var map__31122 = p__31121;
var map__31122__$1 = cljs.core.__destructure_map(map__31122);
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31122__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31122__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
var code_challenge = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31122__$1,new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507));
var code_challenge_method = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31122__$1,new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712));
if(((clojure.string.blank_QMARK_(client_id)) || (((clojure.string.blank_QMARK_(redirect_uri)) || (((clojure.string.blank_QMARK_(code_challenge)) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(code_challenge_method,"S256")))))))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_request","Missing required OAuth parameters (client_id, redirect_uri, code_challenge, S256)");
} else {
return null;
}
});
knoxx.backend.infra.routes.mcp.ensure_oauth_confirm_request_BANG_ = (function knoxx$backend$infra$routes$mcp$ensure_oauth_confirm_request_BANG_(p__31129){
var map__31135 = p__31129;
var map__31135__$1 = cljs.core.__destructure_map(map__31135);
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31135__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31135__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
var code_challenge = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31135__$1,new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507));
var code_challenge_method = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31135__$1,new cljs.core.Keyword(null,"code-challenge-method","code-challenge-method",-705359712));
if(((clojure.string.blank_QMARK_(client_id)) || (((clojure.string.blank_QMARK_(redirect_uri)) || (((clojure.string.blank_QMARK_(code_challenge)) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(code_challenge_method,"S256")))))))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_request","Missing required OAuth parameters");
} else {
return null;
}
});
knoxx.backend.infra.routes.mcp.get_registered_client = (async function knoxx$backend$infra$routes$mcp$get_registered_client(client_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(client_id)))){
return null;
} else {
try{var raw = (await knoxx.backend.infra.stores.mongo_mcp_oauth.get_client_BANG_.cljs$core$IFn$_invoke$arity$1(client_id));
if(cljs.core.truth_(raw)){
try{return JSON.parse(raw);
}catch (e31168){var _ = e31168;
return null;
}} else {
return null;
}
}catch (e31167){var _ = e31167;
return null;
}}
});
knoxx.backend.infra.routes.mcp.redirect_uri_allowed_QMARK_ = (function knoxx$backend$infra$routes$mcp$redirect_uri_allowed_QMARK_(client,redirect_uri){
if(cljs.core.not(client)){
return true;
} else {
return cljs.core.boolean$(Array.from((function (){var or__5162__auto__ = (client["redirect_uris"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()).includes(redirect_uri));
}
});
knoxx.backend.infra.routes.mcp.ensure_redirect_uri_allowed_BANG_ = (function knoxx$backend$infra$routes$mcp$ensure_redirect_uri_allowed_BANG_(client,redirect_uri,error_code){
if(cljs.core.truth_((function (){var and__5160__auto__ = client;
if(cljs.core.truth_(and__5160__auto__)){
return (!(knoxx.backend.infra.routes.mcp.redirect_uri_allowed_QMARK_(client,redirect_uri)));
} else {
return and__5160__auto__;
}
})())){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),error_code,"redirect_uri not allowed for registered client");
} else {
return null;
}
});
knoxx.backend.infra.routes.mcp.available_tools = (function knoxx$backend$infra$routes$mcp$available_tools(runtime,config,auth_context){
var or__5162__auto__ = knoxx.backend.domain.mcp.mcp_expose.create_knoxx_custom_tools_js(runtime,config,auth_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
});
knoxx.backend.infra.routes.mcp.tool_name_set = (function knoxx$backend$infra$routes$mcp$tool_name_set(tools){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (t){
var G__31201 = (t["name"]);
var G__31201__$1 = (((G__31201 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31201)));
var G__31201__$2 = (((G__31201__$1 == null))?null:clojure.string.trim(G__31201__$1));
if((G__31201__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31201__$2);
}
})),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(tools));
});
knoxx.backend.infra.routes.mcp.selected_tools_from_scope = (function knoxx$backend$infra$routes$mcp$selected_tools_from_scope(tools,requested_scope){
var requested = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(cljs.core.map.cljs$core$IFn$_invoke$arity$1(clojure.string.trim),cljs.core.remove.cljs$core$IFn$_invoke$arity$1(clojure.string.blank_QMARK_)),clojure.string.split.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = requested_scope;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\s+/));
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (t){
var n = (function (){var G__31215 = (t["name"]);
var G__31215__$1 = (((G__31215 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31215)));
var G__31215__$2 = (((G__31215__$1 == null))?null:clojure.string.trim(G__31215__$1));
if((G__31215__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31215__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = n;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core.contains_QMARK_(requested,"all")) || (cljs.core.contains_QMARK_(requested,n)));
} else {
return and__5160__auto__;
}
})())){
return n;
} else {
return null;
}
})),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(tools));
});
knoxx.backend.infra.routes.mcp.default_selected_tools = (function knoxx$backend$infra$routes$mcp$default_selected_tools(tool_names){
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$1((function (p1__31220_SHARP_){
return cljs.core.contains_QMARK_(tool_names,p1__31220_SHARP_);
})),new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, ["semantic_query","semantic_read","memory_search","memory_session","graph_query","websearch","read"], null));
});
knoxx.backend.infra.routes.mcp.requested_tools = (function knoxx$backend$infra$routes$mcp$requested_tools(runtime,config,auth_context,selected_tools){
var tools = knoxx.backend.infra.routes.mcp.available_tools(runtime,config,auth_context);
var available = knoxx.backend.infra.routes.mcp.tool_name_set(tools);
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__31225_SHARP_){
return cljs.core.contains_QMARK_(available,p1__31225_SHARP_);
}),cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,cljs.core.str),selected_tools)))));
});
knoxx.backend.infra.routes.mcp.tool_checkbox_html = (function knoxx$backend$infra$routes$mcp$tool_checkbox_html(tools,selected){
return clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (tool){
var n = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (tool["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var label = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (tool["label"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (tool["name"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (tool["description"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return n;
}
}
}
})()));
var desc = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (tool["description"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var checked = ((cljs.core.contains_QMARK_(selected,n))?"checked":"");
return (""+"\n        <label style=\"display:block; margin: 6px 0;\">\n"+"          <input type=\"checkbox\" name=\"tool\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(n))+"\" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(checked)+" />\n"+"          <span style=\"font-weight:600;\">"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(label))+"</span>\n"+"          <span style=\"color:#666;\">("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(n))+")</span>\n"+"          <div style=\"color:#444; margin-left: 22px;\">"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(desc))+"</div>\n"+"        </label>\n");
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(tools)));
});
knoxx.backend.infra.routes.mcp.authorization_consent_html = (function knoxx$backend$infra$routes$mcp$authorization_consent_html(p__31251){
var map__31256 = p__31251;
var map__31256__$1 = cljs.core.__destructure_map(map__31256);
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"base","base",185279322));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var selected = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"selected","selected",574897764));
var code_challenge = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507));
var auth_context = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"auth-context","auth-context",320032325));
var tools = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"tools","tools",-1241731990));
var requested_scope = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"requested-scope","requested-scope",-712807637));
var state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31256__$1,new cljs.core.Keyword(null,"state","state",-1988618099));
var confirm_url = (new URL("/api/mcp/oauth/authorize/confirm",base));
var user_email = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (auth_context["user"]["email"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["userEmail"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var org_slug = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (auth_context["org"]["slug"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["orgSlug"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
confirm_url.searchParams.set("client_id",client_id);

confirm_url.searchParams.set("redirect_uri",redirect_uri);

if(cljs.core.truth_(state)){
confirm_url.searchParams.set("state",state);
} else {
}

confirm_url.searchParams.set("code_challenge",code_challenge);

confirm_url.searchParams.set("code_challenge_method","S256");

if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = requested_scope;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))){
} else {
confirm_url.searchParams.set("scope",requested_scope);
}

return (""+"<!doctype html>\n<html><head><meta charset=\"utf-8\" />\n"+"<title>Authorize MCP Client</title>\n"+"<style>body{font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;margin:24px;}"+".box{max-width:920px;} .meta{color:#555;margin-bottom:12px;}"+".tools{border:1px solid #ddd;border-radius:8px;padding:12px 16px;}"+".actions{margin-top:18px;display:flex;gap:12px;}"+"button{padding:8px 14px;border-radius:8px;border:1px solid #333;background:#111;color:#fff;cursor:pointer;}"+"a{color:#0b67d0;}"+"</style></head><body><div class=\"box\">\n"+"<h1>Authorize MCP Client</h1>\n"+"<div class=\"meta\">\n"+"<div><strong>Client:</strong> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(client_id))+"</div>\n"+"<div><strong>Redirect URI:</strong> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(redirect_uri))+"</div>\n"+"<div><strong>User:</strong> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(user_email))+"</div>\n"+"<div><strong>Org:</strong> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(org_slug))+"</div>\n"+"</div>\n"+"<form method=\"GET\" action=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(confirm_url.pathname))+"\">\n"+"<input type=\"hidden\" name=\"client_id\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(client_id))+"\" />\n"+"<input type=\"hidden\" name=\"redirect_uri\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(redirect_uri))+"\" />\n"+"<input type=\"hidden\" name=\"state\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe((function (){var or__5162__auto__ = state;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))+"\" />\n"+"<input type=\"hidden\" name=\"code_challenge\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(code_challenge))+"\" />\n"+"<input type=\"hidden\" name=\"code_challenge_method\" value=\"S256\" />\n"+"<input type=\"hidden\" name=\"scope\" value=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.safe(requested_scope))+"\" />\n"+"<h2>Capabilities</h2>\n"+"<p>Select exactly which Knoxx tools this client can call. You can always revoke tokens later.</p>\n"+"<div class=\"tools\">\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.routes.mcp.tool_checkbox_html(tools,selected))+"</div>\n"+"<div class=\"actions\">\n"+"<button type=\"submit\">Authorize</button>\n"+"<a href=\"/\">Cancel</a>\n"+"</div></form></div></body></html>");
});
knoxx.backend.infra.routes.mcp.load_token_record_BANG_ = (async function knoxx$backend$infra$routes$mcp$load_token_record_BANG_(access_token){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(access_token)))){
return null;
} else {
try{var raw = (await knoxx.backend.infra.stores.mongo_mcp_oauth.get_token_BANG_.cljs$core$IFn$_invoke$arity$1(access_token));
if(cljs.core.truth_(raw)){
try{return JSON.parse(raw);
}catch (e31272){var _ = e31272;
return null;
}} else {
return null;
}
}catch (e31265){var _ = e31265;
return null;
}}
});
knoxx.backend.infra.routes.mcp.resolve_token_context_BANG_ = (function knoxx$backend$infra$routes$mcp$resolve_token_context_BANG_(policy_context,token_record){
var headers_like = (function (){var G__31275 = cljs.core.PersistentArrayMap.EMPTY;
var G__31275__$1 = (cljs.core.truth_((token_record["membershipId"]))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31275,"x-knoxx-membership-id",(token_record["membershipId"])):G__31275);
var G__31275__$2 = (cljs.core.truth_((token_record["userEmail"]))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31275__$1,"x-knoxx-user-email",(token_record["userEmail"])):G__31275__$1);
if(cljs.core.truth_((token_record["orgSlug"]))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__31275__$2,"x-knoxx-org-slug",(token_record["orgSlug"]));
} else {
return G__31275__$2;
}
})();
return knoxx.backend.infra.db.policy.resolve_context_BANG_(policy_context,headers_like);
});
knoxx.backend.infra.routes.mcp.apply_zod_description = (function knoxx$backend$infra$routes$mcp$apply_zod_description(schema_node,schema_json){
var description = (function (){var G__31287 = (schema_json["description"]);
var G__31287__$1 = (((G__31287 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31287)));
var G__31287__$2 = (((G__31287__$1 == null))?null:clojure.string.trim(G__31287__$1));
if((G__31287__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31287__$2);
}
})();
if(cljs.core.truth_(description)){
return schema_node.describe(description);
} else {
return schema_node;
}
});
knoxx.backend.infra.routes.mcp.typebox__GT_zod_node = (function knoxx$backend$infra$routes$mcp$typebox__GT_zod_node(z,schema_json){
var schema_type = (schema_json["type"]);
var node = (function (){var G__31294 = schema_type;
switch (G__31294) {
case "string":
return z.string();

break;
case "number":
return z.number();

break;
case "integer":
return z.number().int();

break;
case "boolean":
return z.boolean();

break;
case "array":
return z.array((function (){var or__5162__auto__ = (function (){var G__31296 = z;
var G__31297 = (schema_json["items"]);
return (knoxx.backend.infra.routes.mcp.typebox__GT_zod_node.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.routes.mcp.typebox__GT_zod_node.cljs$core$IFn$_invoke$arity$2(G__31296,G__31297) : knoxx.backend.infra.routes.mcp.typebox__GT_zod_node.call(null,G__31296,G__31297));
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return z.any();
}
})());

break;
case "object":
var or__5162__auto__ = (knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape.cljs$core$IFn$_invoke$arity$2(z,schema_json) : knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape.call(null,z,schema_json));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return z.object(({}));
}

break;
default:
return z.any();

}
})();
return (function (n){
var temp__5823__auto__ = (schema_json["maximum"]);
if(cljs.core.truth_(temp__5823__auto__)){
var max = temp__5823__auto__;
return n.max(max);
} else {
return n;
}
})((function (n){
var temp__5823__auto__ = (schema_json["minimum"]);
if(cljs.core.truth_(temp__5823__auto__)){
var min = temp__5823__auto__;
return n.min(min);
} else {
return n;
}
})(knoxx.backend.infra.routes.mcp.apply_zod_description(node,schema_json)));
});
knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape = (function knoxx$backend$infra$routes$mcp$typebox__GT_zod_shape(z,schema_json){
var properties = (function (){var or__5162__auto__ = (schema_json["properties"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var required_set = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(cljs.core.str),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (schema_json["required"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()));
var entries = Object.entries(properties);
if(cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(entries))){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (shape,entry){
var fname = (entry[(0)]);
var fschema = knoxx.backend.infra.routes.mcp.typebox__GT_zod_node(z,(entry[(1)]));
var final$ = ((cljs.core.contains_QMARK_(required_set,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(fname))))?fschema:fschema.optional());
(shape[fname] = final$);

return shape;
}),({}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(entries));
} else {
return null;
}
});
knoxx.backend.infra.routes.mcp.mcp_discovery_metadata_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_discovery_metadata_BANG_(app,runtime,config,deps){
var map__31324 = deps;
var map__31324__$1 = cljs.core.__destructure_map(map__31324);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31324__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31328 = app;
var G__31329 = "GET";
var G__31330 = "/.well-known/oauth-authorization-server";
var G__31331 = (function (request,reply){
var G__31332 = runtime;
var G__31333 = request;
var G__31334 = reply;
var G__31335 = (function (ctx){
var issuer = (new URL(base.toString()));
return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"issuer","issuer",-1199257898),issuer.toString().replace((new RegExp("/$")),""),new cljs.core.Keyword(null,"authorization_endpoint","authorization_endpoint",-2036477134),(new URL("/api/mcp/oauth/authorize",issuer)).toString(),new cljs.core.Keyword(null,"token_endpoint","token_endpoint",-1672123622),(new URL("/api/mcp/oauth/token",issuer)).toString(),new cljs.core.Keyword(null,"registration_endpoint","registration_endpoint",-973490992),(new URL("/api/mcp/oauth/register",issuer)).toString(),new cljs.core.Keyword(null,"response_types_supported","response_types_supported",1088116663),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["code"], null),new cljs.core.Keyword(null,"grant_types_supported","grant_types_supported",11042084),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["authorization_code"], null),new cljs.core.Keyword(null,"code_challenge_methods_supported","code_challenge_methods_supported",1040986006),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["S256"], null),new cljs.core.Keyword(null,"token_endpoint_auth_methods_supported","token_endpoint_auth_methods_supported",1859028329),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["none"], null)], null));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__31332,G__31333,G__31334,G__31335) : with_request_context_BANG_.call(null,G__31332,G__31333,G__31334,G__31335));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31328,G__31329,G__31330,G__31331) : route_BANG_.call(null,G__31328,G__31329,G__31330,G__31331));
});
knoxx.backend.infra.routes.mcp.mcp_protected_resource_metadata_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_protected_resource_metadata_BANG_(app,runtime,config,deps){
var map__31352 = deps;
var map__31352__$1 = cljs.core.__destructure_map(map__31352);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31352__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31353 = app;
var G__31354 = "GET";
var G__31355 = "/.well-known/oauth-protected-resource";
var G__31356 = (function (request,reply){
var G__31357 = runtime;
var G__31358 = request;
var G__31359 = reply;
var G__31360 = (function (ctx){
var issuer = (new URL(base.toString())).toString().replace((new RegExp("/$")),"");
return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"resource","resource",251898836),(new URL("/mcp",base)).toString(),new cljs.core.Keyword(null,"authorization_servers","authorization_servers",-90385165),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [issuer], null),new cljs.core.Keyword(null,"scopes_supported","scopes_supported",1028368821),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["mcp:tools"], null),new cljs.core.Keyword(null,"bearer_methods_supported","bearer_methods_supported",995340034),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["header"], null)], null));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__31357,G__31358,G__31359,G__31360) : with_request_context_BANG_.call(null,G__31357,G__31358,G__31359,G__31360));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31353,G__31354,G__31355,G__31356) : route_BANG_.call(null,G__31353,G__31354,G__31355,G__31356));
});
knoxx.backend.infra.routes.mcp.mcp_register_client_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_register_client_BANG_(app,runtime,config,deps){
var map__31378 = deps;
var map__31378__$1 = cljs.core.__destructure_map(map__31378);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var crypto = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31378__$1,new cljs.core.Keyword(null,"crypto","crypto",1772582615));
var G__31379 = app;
var G__31380 = "POST";
var G__31381 = "/api/mcp/oauth/register";
var G__31382 = (function (){var obj31384 = ({"preHandler":(function (request,reply,done){
var guards = cljs.core.PersistentVector.EMPTY;
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var map__31395 = knoxx.backend.infra.routes.mcp.parse_register_client_body(request);
var map__31395__$1 = cljs.core.__destructure_map(map__31395);
var redirect_uris = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31395__$1,new cljs.core.Keyword(null,"redirect-uris","redirect-uris",778927369));
var client_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31395__$1,new cljs.core.Keyword(null,"client-name","client-name",1843891115));
var client_id = crypto.randomUUID();
var client = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"client_id","client_id",48809273),client_id,new cljs.core.Keyword(null,"client_name","client_name",1164448310),(await (async function (){var or__5162__auto__ = client_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mcp-client";
}
})()),new cljs.core.Keyword(null,"redirect_uris","redirect_uris",-955057149),redirect_uris,new cljs.core.Keyword(null,"token_endpoint_auth_method","token_endpoint_auth_method",1991573974),"none",new cljs.core.Keyword(null,"grant_types","grant_types",1730435852),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["authorization_code"], null),new cljs.core.Keyword(null,"response_types","response_types",-1359568790),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["code"], null),new cljs.core.Keyword(null,"created_at","created_at",1484050750),(new Date()).toISOString()], null);
try{(await knoxx.backend.infra.stores.mongo_mcp_oauth.set_client_BANG_.cljs$core$IFn$_invoke$arity$2(client_id,JSON.stringify(cljs.core.clj__GT_js(client))));

return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(201),client);
}catch (e31400){var err = e31400;
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((500),"registration_failed",(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})()));
}})});
return obj31384;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31379,G__31380,G__31381,G__31382) : route_BANG_.call(null,G__31379,G__31380,G__31381,G__31382));
});
knoxx.backend.infra.routes.mcp.mcp_authorize_client_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_authorize_client_BANG_(app,runtime,config,deps){
var map__31404 = deps;
var map__31404__$1 = cljs.core.__destructure_map(map__31404);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var config__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"config","config",994861415));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var browser_auth_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"browser-auth-guard","browser-auth-guard",-1183678191));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var runtime__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31404__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31410 = app;
var G__31411 = "GET";
var G__31412 = "/api/mcp/oauth/authorize";
var G__31413 = (function (){var obj31415 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [browser_auth_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var auth_context = (request["authContext"]);
var map__31420 = knoxx.backend.infra.routes.mcp.parse_authorize_query(request);
var map__31420__$1 = cljs.core.__destructure_map(map__31420);
var params = map__31420__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31420__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31420__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
var state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31420__$1,new cljs.core.Keyword(null,"state","state",-1988618099));
var code_challenge = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31420__$1,new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507));
var scope = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31420__$1,new cljs.core.Keyword(null,"scope","scope",-439358418));
knoxx.backend.infra.routes.mcp.ensure_oauth_request_BANG_(params);

var client = (await knoxx.backend.infra.routes.mcp.get_registered_client(client_id));
knoxx.backend.infra.routes.mcp.ensure_redirect_uri_allowed_BANG_(client,redirect_uri,"invalid_request");

var tools = knoxx.backend.infra.routes.mcp.available_tools(runtime__$1,config__$1,auth_context);
var selected = (await (async function (){var explicit = knoxx.backend.infra.routes.mcp.selected_tools_from_scope(tools,scope);
if(cljs.core.seq(explicit)){
return explicit;
} else {
return knoxx.backend.infra.routes.mcp.default_selected_tools(knoxx.backend.infra.routes.mcp.tool_name_set(tools));
}
})());
var html = knoxx.backend.infra.routes.mcp.authorization_consent_html(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842),new cljs.core.Keyword(null,"client-id","client-id",-464622140),new cljs.core.Keyword(null,"selected","selected",574897764),new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507),new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.Keyword(null,"tools","tools",-1241731990),new cljs.core.Keyword(null,"requested-scope","requested-scope",-712807637),new cljs.core.Keyword(null,"state","state",-1988618099),new cljs.core.Keyword(null,"base","base",185279322)],[redirect_uri,client_id,selected,code_challenge,auth_context,tools,(await (async function (){var or__5162__auto__ = scope;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),state,base]));
return knoxx.backend.infra.routes.mcp.reply_header_BANG_(reply,"content-type","text/html; charset=utf-8").send(html);
})});
return obj31415;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31410,G__31411,G__31412,G__31413) : route_BANG_.call(null,G__31410,G__31411,G__31412,G__31413));
});
knoxx.backend.infra.routes.mcp.mcp_authorize_confirm_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_authorize_confirm_BANG_(app,runtime,config,deps){
var map__31428 = deps;
var map__31428__$1 = cljs.core.__destructure_map(map__31428);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var code_ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"code-ttl","code-ttl",-1627471037));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var config__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"config","config",994861415));
var token_ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"token-ttl","token-ttl",-103977687));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var browser_auth_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"browser-auth-guard","browser-auth-guard",-1183678191));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var runtime__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var crypto = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31428__$1,new cljs.core.Keyword(null,"crypto","crypto",1772582615));
var G__31431 = app;
var G__31432 = "GET";
var G__31433 = "/api/mcp/oauth/authorize/confirm";
var G__31434 = (function (){var obj31436 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [browser_auth_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var auth_context = (request["authContext"]);
var map__31446 = knoxx.backend.infra.routes.mcp.parse_authorize_confirm_query(request);
var map__31446__$1 = cljs.core.__destructure_map(map__31446);
var params = map__31446__$1;
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31446__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31446__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
var state = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31446__$1,new cljs.core.Keyword(null,"state","state",-1988618099));
var code_challenge = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31446__$1,new cljs.core.Keyword(null,"code-challenge","code-challenge",-46720507));
var selected_tools = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31446__$1,new cljs.core.Keyword(null,"selected-tools","selected-tools",700501530));
knoxx.backend.infra.routes.mcp.ensure_oauth_confirm_request_BANG_(params);

var client = (await knoxx.backend.infra.routes.mcp.get_registered_client(client_id));
knoxx.backend.infra.routes.mcp.ensure_redirect_uri_allowed_BANG_(client,redirect_uri,"invalid_request");

var requested = knoxx.backend.infra.routes.mcp.requested_tools(runtime__$1,config__$1,auth_context,selected_tools);
if(cljs.core.empty_QMARK_(requested)){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_scope","No valid tools selected");
} else {
}

var membership_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (auth_context["membership"]["id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["membershipId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var user_email = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (auth_context["user"]["email"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["userEmail"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var org_slug = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (auth_context["org"]["slug"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["orgSlug"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
var code = crypto.randomUUID();
var payload = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"redirectUri","redirectUri",-530835168),new cljs.core.Keyword(null,"clientId","clientId",1767253728),new cljs.core.Keyword(null,"codeChallengeMethod","codeChallengeMethod",-578026045),new cljs.core.Keyword(null,"tools","tools",-1241731990),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"codeChallenge","codeChallenge",-1628276982),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"membershipId","membershipId",2026001076),new cljs.core.Keyword(null,"code","code",1586293142),new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618)],[redirect_uri,client_id,"S256",requested,org_slug,code_challenge,(new Date()).toISOString(),membership_id,code,user_email]);
(await knoxx.backend.infra.stores.mongo_mcp_oauth.set_code_BANG_.cljs$core$IFn$_invoke$arity$3(code,JSON.stringify(cljs.core.clj__GT_js(payload)),code_ttl));

var redir = (new URL(redirect_uri));
redir.searchParams.set("code",code);

if(cljs.core.truth_(state)){
redir.searchParams.set("state",state);
} else {
}

return reply.redirect(redir.toString(),(302));
})});
return obj31436;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31431,G__31432,G__31433,G__31434) : route_BANG_.call(null,G__31431,G__31432,G__31433,G__31434));
});
knoxx.backend.infra.routes.mcp.persist_access_token_BANG_ = (async function knoxx$backend$infra$routes$mcp$persist_access_token_BANG_(crypto,token_ttl,client_id,record){
var access_token = crypto.randomUUID();
var token_value = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"accessToken","accessToken",1833707055),access_token,new cljs.core.Keyword(null,"clientId","clientId",1767253728),client_id,new cljs.core.Keyword(null,"membershipId","membershipId",2026001076),(record["membershipId"]),new cljs.core.Keyword(null,"userEmail","userEmail",-1838879618),(record["userEmail"]),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),(record["orgSlug"]),new cljs.core.Keyword(null,"tools","tools",-1241731990),(record["tools"]),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (token_ttl * (1000))))).toISOString()], null);
(await knoxx.backend.infra.stores.mongo_mcp_oauth.set_token_BANG_.cljs$core$IFn$_invoke$arity$4(access_token,JSON.stringify(cljs.core.clj__GT_js(token_value)),token_ttl,(record["membershipId"])));

return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"access_token","access_token",1591156073),access_token,new cljs.core.Keyword(null,"token_type","token_type",-524227634),"Bearer",new cljs.core.Keyword(null,"scope","scope",-439358418),clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (record["tools"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()))),new cljs.core.Keyword(null,"expires_in","expires_in",453935095),token_ttl], null);
});
knoxx.backend.infra.routes.mcp.mcp_exchange_token_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_exchange_token_BANG_(app,runtime,config,deps){
var map__31467 = deps;
var map__31467__$1 = cljs.core.__destructure_map(map__31467);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var token_ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"token-ttl","token-ttl",-103977687));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var crypto = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31467__$1,new cljs.core.Keyword(null,"crypto","crypto",1772582615));
var G__31470 = app;
var G__31471 = "POST";
var G__31472 = "/api/mcp/oauth/token";
var G__31473 = (function (){var obj31475 = ({"preHandler":(function (request,reply,done){
var guards = cljs.core.PersistentVector.EMPTY;
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var map__31476 = knoxx.backend.infra.routes.mcp.parse_token_exchange_body(request);
var map__31476__$1 = cljs.core.__destructure_map(map__31476);
var grant_type = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31476__$1,new cljs.core.Keyword(null,"grant-type","grant-type",-1751533246));
var code = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31476__$1,new cljs.core.Keyword(null,"code","code",1586293142));
var code_verifier = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31476__$1,new cljs.core.Keyword(null,"code-verifier","code-verifier",-848846001));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31476__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
var redirect_uri = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31476__$1,new cljs.core.Keyword(null,"redirect-uri","redirect-uri",374475842));
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(grant_type,"authorization_code")) || (((clojure.string.blank_QMARK_(code)) || (((clojure.string.blank_QMARK_(code_verifier)) || (((clojure.string.blank_QMARK_(client_id)) || (clojure.string.blank_QMARK_(redirect_uri)))))))))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_request","Missing required token exchange parameters");
} else {
}

var client = (await knoxx.backend.infra.routes.mcp.get_registered_client(client_id));
knoxx.backend.infra.routes.mcp.ensure_redirect_uri_allowed_BANG_(client,redirect_uri,"invalid_grant");

var raw = (await knoxx.backend.infra.stores.mongo_mcp_oauth.get_code_BANG_.cljs$core$IFn$_invoke$arity$1(code));
if(cljs.core.truth_(raw)){
} else {
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_grant","Unknown or expired code");
}

var record = JSON.parse(raw);
var expected = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (record["codeChallenge"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
var actual = knoxx.backend.infra.routes.mcp.pkce_challenge(crypto,code_verifier);
if(((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((record["clientId"]),client_id)) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((record["redirectUri"]),redirect_uri)))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_grant","Client/redirect mismatch");
} else {
}

if(((clojure.string.blank_QMARK_(expected)) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(expected,actual)))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_grant","PKCE verification failed");
} else {
}

(await knoxx.backend.infra.stores.mongo_mcp_oauth.delete_code_BANG_.cljs$core$IFn$_invoke$arity$1(code));

var token_response = (await knoxx.backend.infra.routes.mcp.persist_access_token_BANG_(crypto,token_ttl,client_id,record));
return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(200),token_response);
})});
return obj31475;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31470,G__31471,G__31472,G__31473) : route_BANG_.call(null,G__31470,G__31471,G__31472,G__31473));
});
knoxx.backend.infra.routes.mcp.mcp_list_user_tokens_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_list_user_tokens_BANG_(app,runtime,config,deps){
var map__31488 = deps;
var map__31488__$1 = cljs.core.__destructure_map(map__31488);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var browser_auth_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"browser-auth-guard","browser-auth-guard",-1183678191));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31488__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31489 = app;
var G__31490 = "GET";
var G__31491 = "/api/mcp/tokens";
var G__31492 = (function (){var obj31494 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [browser_auth_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var auth_context = (request["authContext"]);
var membership_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (auth_context["membership"]["id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["membershipId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
if(clojure.string.blank_QMARK_(membership_id)){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"missing_membership","No membership available for this session");
} else {
}

var records = (await knoxx.backend.infra.stores.mongo_mcp_oauth.list_tokens_for_membership_BANG_.cljs$core$IFn$_invoke$arity$1(membership_id));
return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"tokens","tokens",-818939304),cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,records))], null));
})});
return obj31494;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31489,G__31490,G__31491,G__31492) : route_BANG_.call(null,G__31489,G__31490,G__31491,G__31492));
});
knoxx.backend.infra.routes.mcp.mcp_revoke_user_token_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_revoke_user_token_BANG_(app,runtime,config,deps){
var map__31506 = deps;
var map__31506__$1 = cljs.core.__destructure_map(map__31506);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var browser_auth_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"browser-auth-guard","browser-auth-guard",-1183678191));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31506__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31507 = app;
var G__31508 = "DELETE";
var G__31509 = "/api/mcp/tokens/:tokenId";
var G__31510 = (function (){var obj31512 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [browser_auth_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var auth_context = (request["authContext"]);
var map__31519 = knoxx.backend.infra.routes.mcp.parse_revoke_token_params(request);
var map__31519__$1 = cljs.core.__destructure_map(map__31519);
var token_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31519__$1,new cljs.core.Keyword(null,"token-id","token-id",-764089526));
var membership_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (auth_context["membership"]["id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (auth_context["membershipId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
if(((clojure.string.blank_QMARK_(membership_id)) || (clojure.string.blank_QMARK_(token_id)))){
throw knoxx.backend.infra.routes.mcp.http_error.cljs$core$IFn$_invoke$arity$3((400),"invalid_request","membership and tokenId are required");
} else {
}

(await knoxx.backend.infra.stores.mongo_mcp_oauth.delete_token_BANG_.cljs$core$IFn$_invoke$arity$1(token_id));

return knoxx.backend.infra.routes.mcp.json_send_BANG_(reply,(200),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ok","ok",967785236),true], null));
})});
return obj31512;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31507,G__31508,G__31509,G__31510) : route_BANG_.call(null,G__31507,G__31508,G__31509,G__31510));
});
knoxx.backend.infra.routes.mcp.mcp_handle_session_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_handle_session_BANG_(app,runtime,config,deps){
var map__31525 = deps;
var map__31525__$1 = cljs.core.__destructure_map(map__31525);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_token_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"bearer-token-guard","bearer-token-guard",1833348950));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31525__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31527 = app;
var G__31528 = "GET";
var G__31529 = "/mcp";
var G__31530 = (function (){var obj31532 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [bearer_token_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
var bearer = (request["bearerToken"]);
var session_id = knoxx.backend.infra.routes.mcp.resolve_session_id(request);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))){
return knoxx.backend.infra.routes.mcp.text_send_BANG_(reply,(400),"Missing mcp-session-id");
} else {
var map__31542 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.routes.mcp.mcp_sessions_STAR_),session_id);
var map__31542__$1 = cljs.core.__destructure_map(map__31542);
var transport = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31542__$1,new cljs.core.Keyword(null,"transport","transport",-649001056));
var token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31542__$1,new cljs.core.Keyword(null,"token","token",-1211463215));
if((transport == null)){
return knoxx.backend.infra.routes.mcp.text_send_BANG_(reply,(404),(""+"Invalid mcp-session-id: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)));
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bearer)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)))){
return knoxx.backend.infra.routes.mcp.challenge_unauthorized_BANG_(reply,base);
} else {
knoxx.backend.infra.routes.mcp.ensure_streamable_accept_BANG_(request);

return knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$3(transport,(request["raw"]),(reply["raw"]));

}
}

}
})});
return obj31532;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31527,G__31528,G__31529,G__31530) : route_BANG_.call(null,G__31527,G__31528,G__31529,G__31530));
});
knoxx.backend.infra.routes.mcp.mcp_handle_delete_session_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_handle_delete_session_BANG_(app,runtime,config,deps){
var map__31550 = deps;
var map__31550__$1 = cljs.core.__destructure_map(map__31550);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_token_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"bearer-token-guard","bearer-token-guard",1833348950));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31550__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31551 = app;
var G__31552 = "DELETE";
var G__31553 = "/mcp";
var G__31554 = (function (){var obj31556 = ({"preHandler":(function (request,reply,done){
var guards = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [bearer_token_guard], null);
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(function (request,reply){
var ctx = (request["ctx"]);
var bearer = (request["bearerToken"]);
var session_id = knoxx.backend.infra.routes.mcp.resolve_session_id(request);
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))){
return knoxx.backend.infra.routes.mcp.text_send_BANG_(reply,(400),"Missing mcp-session-id");
} else {
var map__31567 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.infra.routes.mcp.mcp_sessions_STAR_),session_id);
var map__31567__$1 = cljs.core.__destructure_map(map__31567);
var transport = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31567__$1,new cljs.core.Keyword(null,"transport","transport",-649001056));
var token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31567__$1,new cljs.core.Keyword(null,"token","token",-1211463215));
if((transport == null)){
return knoxx.backend.infra.routes.mcp.text_send_BANG_(reply,(404),(""+"Invalid mcp-session-id: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)));
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(bearer)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)))){
return knoxx.backend.infra.routes.mcp.challenge_unauthorized_BANG_(reply,base);
} else {
knoxx.backend.infra.routes.mcp.ensure_streamable_accept_BANG_(request);

return knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$3(transport,(request["raw"]),(reply["raw"]));

}
}

}
})});
return obj31556;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31551,G__31552,G__31553,G__31554) : route_BANG_.call(null,G__31551,G__31552,G__31553,G__31554));
});
knoxx.backend.infra.routes.mcp.mcp_handle_post_BANG_ = (function knoxx$backend$infra$routes$mcp$mcp_handle_post_BANG_(app,runtime,config,deps){
var map__31572 = deps;
var map__31572__$1 = cljs.core.__destructure_map(map__31572);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var base = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"base","base",185279322));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var StreamableHTTPServerTransport = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"StreamableHTTPServerTransport","StreamableHTTPServerTransport",1299523549));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var McpServer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"McpServer","McpServer",251219330));
var code_ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"code-ttl","code-ttl",-1627471037));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var config__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"config","config",994861415));
var token_ttl = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"token-ttl","token-ttl",-103977687));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var z = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"z","z",-789527183));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var runtime__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__31572__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__31580 = app;
var G__31581 = "POST";
var G__31582 = "/mcp";
var G__31583 = (function (){var obj31585 = ({"preHandler":(function (request,reply,done){
var guards = cljs.core.PersistentVector.EMPTY;
var chain = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (next,guard){
return (function (){
return (guard.cljs$core$IFn$_invoke$arity$3 ? guard.cljs$core$IFn$_invoke$arity$3(request,reply,next) : guard.call(null,request,reply,next));
});
}),done,cljs.core.reverse(guards));
return (chain.cljs$core$IFn$_invoke$arity$0 ? chain.cljs$core$IFn$_invoke$arity$0() : chain.call(null));
}),"handler":(async function (request,reply){
var ctx = (request["ctx"]);
var request__$1 = request;
var reply__$1 = reply;
reply__$1.hijack();

var raw_req = (request__$1["raw"]);
var raw_res = (reply__$1["raw"]);
var bearer = knoxx.backend.infra.routes.mcp.bearer_token(request__$1);
if(clojure.string.blank_QMARK_(bearer)){
raw_res.writeHead((401),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, ["WWW-Authenticate",knoxx.backend.infra.routes.mcp.www_authenticate_challenge(base),"Content-Type","text/plain"], null)));

return raw_res.end("Unauthorized");
} else {
try{var token_record = (await knoxx.backend.infra.routes.mcp.load_token_record_BANG_(bearer));
if(cljs.core.not(token_record)){
raw_res.writeHead((401),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, ["WWW-Authenticate",knoxx.backend.infra.routes.mcp.www_authenticate_challenge(base),"Content-Type","text/plain"], null)));

return raw_res.end("Unauthorized");
} else {
var token_ctx = (await knoxx.backend.infra.routes.mcp.resolve_token_context_BANG_(policy_db,token_record));
var all_tools = knoxx.backend.infra.routes.mcp.available_tools(runtime__$1,config__$1,token_ctx);
var allowed = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(cljs.core.str),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (token_record["tools"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})())));
var effective = cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (t){
return cljs.core.contains_QMARK_(allowed,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((t["name"]))));
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(all_tools)));
var server = (new McpServer(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"name","name",1843675177),"knoxx",new cljs.core.Keyword(null,"version","version",425292698),"0.1.0"], null))));
var transport = (new StreamableHTTPServerTransport(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"sessionIdGenerator","sessionIdGenerator",95258568),undefined], null))));
var seq__31605_31846 = cljs.core.seq(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(effective));
var chunk__31606_31847 = null;
var count__31607_31848 = (0);
var i__31608_31849 = (0);
while(true){
if((i__31608_31849 < count__31607_31848)){
var tool_31850 = chunk__31606_31847.cljs$core$IIndexed$_nth$arity$2(null,i__31608_31849);
var n_31851 = (await (async function (){var G__31661 = (tool_31850["name"]);
var G__31661__$1 = (((G__31661 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31661)));
var G__31661__$2 = (((G__31661__$1 == null))?null:clojure.string.trim(G__31661__$1));
if((G__31661__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31661__$2);
}
})());
var s_31852 = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(z)?knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape(z,(await (async function (){var or__5162__auto__ = (tool_31850["parameters"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})())):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})());
if(cljs.core.truth_(n_31851)){
var tool_config_31853 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"description","description",-1428560544),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (tool_31850["description"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (tool_31850["label"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return n_31851;
}
}
})()))),new cljs.core.Keyword(null,"inputSchema","inputSchema",659207905),s_31852], null));
var temp__5825__auto___31854 = (await (async function (){var G__31696 = (await (async function (){var or__5162__auto__ = (tool_31850["label"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (tool_31850["title"]);
}
})());
var G__31696__$1 = (((G__31696 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31696)));
var G__31696__$2 = (((G__31696__$1 == null))?null:clojure.string.trim(G__31696__$1));
if((G__31696__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31696__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto___31854)){
var title_31855 = temp__5825__auto___31854;
(tool_config_31853["title"] = title_31855);
} else {
}

var temp__5825__auto___31856 = (tool_31850["annotations"]);
if(cljs.core.truth_(temp__5825__auto___31856)){
var annotations_31857 = temp__5825__auto___31856;
(tool_config_31853["annotations"] = annotations_31857);
} else {
}

var temp__5825__auto___31858 = (tool_31850["_meta"]);
if(cljs.core.truth_(temp__5825__auto___31858)){
var meta_31859 = temp__5825__auto___31858;
(tool_config_31853["_meta"] = meta_31859);
} else {
}

server.registerTool(n_31851,tool_config_31853,((function (seq__31605_31846,chunk__31606_31847,count__31607_31848,i__31608_31849,tool_config_31853,n_31851,s_31852,tool_31850,token_ctx,all_tools,allowed,effective,server,transport,token_record,raw_req,raw_res,bearer,request__$1,reply__$1,ctx,G__31580,G__31581,G__31582,map__31572,map__31572__$1,clip_text,base,ensure_permission_BANG_,StreamableHTTPServerTransport,fetch_json,route_BANG_,request_query_string,policy_db,McpServer,code_ttl,session_guard,config__$1,token_ttl,json_response_BANG_,with_request_context_BANG_,send_fetch_response_BANG_,z,optional_session_guard,error_response_BANG_,runtime__$1,bearer_headers){
return (function (params){
return knoxx.backend.infra.routes.mcp.tool_execute_BANG_(tool_31850,params);
});})(seq__31605_31846,chunk__31606_31847,count__31607_31848,i__31608_31849,tool_config_31853,n_31851,s_31852,tool_31850,token_ctx,all_tools,allowed,effective,server,transport,token_record,raw_req,raw_res,bearer,request__$1,reply__$1,ctx,G__31580,G__31581,G__31582,map__31572,map__31572__$1,clip_text,base,ensure_permission_BANG_,StreamableHTTPServerTransport,fetch_json,route_BANG_,request_query_string,policy_db,McpServer,code_ttl,session_guard,config__$1,token_ttl,json_response_BANG_,with_request_context_BANG_,send_fetch_response_BANG_,z,optional_session_guard,error_response_BANG_,runtime__$1,bearer_headers))
);
} else {
}


var G__31860 = seq__31605_31846;
var G__31861 = chunk__31606_31847;
var G__31862 = count__31607_31848;
var G__31863 = (i__31608_31849 + (1));
seq__31605_31846 = G__31860;
chunk__31606_31847 = G__31861;
count__31607_31848 = G__31862;
i__31608_31849 = G__31863;
continue;
} else {
var temp__5825__auto___31864 = cljs.core.seq(seq__31605_31846);
if(temp__5825__auto___31864){
var seq__31605_31865__$1 = temp__5825__auto___31864;
if(cljs.core.chunked_seq_QMARK_(seq__31605_31865__$1)){
var c__5694__auto___31866 = cljs.core.chunk_first(seq__31605_31865__$1);
var G__31867 = cljs.core.chunk_rest(seq__31605_31865__$1);
var G__31868 = c__5694__auto___31866;
var G__31869 = cljs.core.count(c__5694__auto___31866);
var G__31870 = (0);
seq__31605_31846 = G__31867;
chunk__31606_31847 = G__31868;
count__31607_31848 = G__31869;
i__31608_31849 = G__31870;
continue;
} else {
var tool_31871 = cljs.core.first(seq__31605_31865__$1);
var n_31872 = (await (async function (){var G__31734 = (tool_31871["name"]);
var G__31734__$1 = (((G__31734 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31734)));
var G__31734__$2 = (((G__31734__$1 == null))?null:clojure.string.trim(G__31734__$1));
if((G__31734__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31734__$2);
}
})());
var s_31873 = (await (async function (){var or__5162__auto__ = (cljs.core.truth_(z)?knoxx.backend.infra.routes.mcp.typebox__GT_zod_shape(z,(await (async function (){var or__5162__auto__ = (tool_31871["parameters"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})())):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})());
if(cljs.core.truth_(n_31872)){
var tool_config_31878 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"description","description",-1428560544),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (tool_31871["description"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (tool_31871["label"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return n_31872;
}
}
})()))),new cljs.core.Keyword(null,"inputSchema","inputSchema",659207905),s_31873], null));
var temp__5825__auto___31880__$1 = (await (async function (){var G__31744 = (await (async function (){var or__5162__auto__ = (tool_31871["label"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (tool_31871["title"]);
}
})());
var G__31744__$1 = (((G__31744 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__31744)));
var G__31744__$2 = (((G__31744__$1 == null))?null:clojure.string.trim(G__31744__$1));
if((G__31744__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__31744__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto___31880__$1)){
var title_31881 = temp__5825__auto___31880__$1;
(tool_config_31878["title"] = title_31881);
} else {
}

var temp__5825__auto___31882__$1 = (tool_31871["annotations"]);
if(cljs.core.truth_(temp__5825__auto___31882__$1)){
var annotations_31883 = temp__5825__auto___31882__$1;
(tool_config_31878["annotations"] = annotations_31883);
} else {
}

var temp__5825__auto___31884__$1 = (tool_31871["_meta"]);
if(cljs.core.truth_(temp__5825__auto___31884__$1)){
var meta_31885 = temp__5825__auto___31884__$1;
(tool_config_31878["_meta"] = meta_31885);
} else {
}

server.registerTool(n_31872,tool_config_31878,((function (seq__31605_31846,chunk__31606_31847,count__31607_31848,i__31608_31849,tool_config_31878,n_31872,s_31873,tool_31871,seq__31605_31865__$1,temp__5825__auto___31864,token_ctx,all_tools,allowed,effective,server,transport,token_record,raw_req,raw_res,bearer,request__$1,reply__$1,ctx,G__31580,G__31581,G__31582,map__31572,map__31572__$1,clip_text,base,ensure_permission_BANG_,StreamableHTTPServerTransport,fetch_json,route_BANG_,request_query_string,policy_db,McpServer,code_ttl,session_guard,config__$1,token_ttl,json_response_BANG_,with_request_context_BANG_,send_fetch_response_BANG_,z,optional_session_guard,error_response_BANG_,runtime__$1,bearer_headers){
return (function (params){
return knoxx.backend.infra.routes.mcp.tool_execute_BANG_(tool_31871,params);
});})(seq__31605_31846,chunk__31606_31847,count__31607_31848,i__31608_31849,tool_config_31878,n_31872,s_31873,tool_31871,seq__31605_31865__$1,temp__5825__auto___31864,token_ctx,all_tools,allowed,effective,server,transport,token_record,raw_req,raw_res,bearer,request__$1,reply__$1,ctx,G__31580,G__31581,G__31582,map__31572,map__31572__$1,clip_text,base,ensure_permission_BANG_,StreamableHTTPServerTransport,fetch_json,route_BANG_,request_query_string,policy_db,McpServer,code_ttl,session_guard,config__$1,token_ttl,json_response_BANG_,with_request_context_BANG_,send_fetch_response_BANG_,z,optional_session_guard,error_response_BANG_,runtime__$1,bearer_headers))
);
} else {
}


var G__31886 = cljs.core.next(seq__31605_31865__$1);
var G__31887 = null;
var G__31888 = (0);
var G__31889 = (0);
seq__31605_31846 = G__31886;
chunk__31606_31847 = G__31887;
count__31607_31848 = G__31888;
i__31608_31849 = G__31889;
continue;
}
} else {
}
}
break;
}

(await server.connect(transport));

knoxx.backend.infra.routes.mcp.ensure_streamable_accept_BANG_(request__$1);

return knoxx.backend.infra.routes.mcp.transport_handle_request_BANG_.cljs$core$IFn$_invoke$arity$4(transport,raw_req,raw_res,(request__$1["body"]));
}
}catch (e31594){var err = e31594;
console.error("[knoxx-mcp] post failed",err);

if(cljs.core.truth_(raw_res.headersSent)){
return null;
} else {
raw_res.writeHead((500),cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null)));

return raw_res.end(JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"error","error",-978969032),"mcp_post_failed",new cljs.core.Keyword(null,"detail","detail",-1545345025),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})())], null))));
}
}}
})});
return obj31585;
})();
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__31580,G__31581,G__31582,G__31583) : route_BANG_.call(null,G__31580,G__31581,G__31582,G__31583));
});
knoxx.backend.infra.routes.mcp.register_mcp_http_routes_BANG_ = (function knoxx$backend$infra$routes$mcp$register_mcp_http_routes_BANG_(app,runtime,config){
var base = knoxx.backend.infra.routes.mcp.public_base_url(config);
var policy_db = knoxx.backend.runtime.state.current_policy_db();
var code_ttl = parseInt(knoxx.backend.infra.routes.mcp.env("KNOXX_MCP_CODE_TTL_SECONDS","300"),(10));
var token_ttl = parseInt(knoxx.backend.infra.routes.mcp.env("KNOXX_MCP_TOKEN_TTL_SECONDS",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((((60) * (60)) * (24)) * (30))))),(10));
var deps = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"route!","route!",-1286958144),new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183),new cljs.core.Keyword(null,"McpServer","McpServer",251219330),new cljs.core.Keyword(null,"code-ttl","code-ttl",-1627471037),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"token-ttl","token-ttl",-103977687),new cljs.core.Keyword(null,"browser-auth-guard","browser-auth-guard",-1183678191),new cljs.core.Keyword(null,"z","z",-789527183),new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.Keyword(null,"bearer-token-guard","bearer-token-guard",1833348950),new cljs.core.Keyword(null,"crypto","crypto",1772582615),new cljs.core.Keyword(null,"base","base",185279322),new cljs.core.Keyword(null,"StreamableHTTPServerTransport","StreamableHTTPServerTransport",1299523549)],[knoxx.backend.shape.app_shapes.route_BANG_,policy_db,shadow.esm.esm_import$$modelcontextprotocol$sdk$server$mcp.McpServer,code_ttl,config,token_ttl,knoxx.backend.infra.routes.mcp.require_browser_auth_BANG_(policy_db,config),shadow.esm.esm_import$zod.z,runtime,knoxx.backend.infra.routes.mcp.require_bearer_token_BANG_(base),shadow.esm.esm_import$node_crypto,base,shadow.esm.esm_import$$modelcontextprotocol$sdk$server$streamableHttp.StreamableHTTPServerTransport]);
knoxx.backend.infra.routes.mcp.mcp_discovery_metadata_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_protected_resource_metadata_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_register_client_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_authorize_client_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_authorize_confirm_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_exchange_token_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_list_user_tokens_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_revoke_user_token_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_handle_post_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.mcp.mcp_handle_session_BANG_(app,runtime,config,deps);

return knoxx.backend.infra.routes.mcp.mcp_handle_delete_session_BANG_(app,runtime,config,deps);
});

//# sourceMappingURL=knoxx.backend.infra.routes.mcp.js.map
