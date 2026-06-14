import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.error_observatory.js";
import "./knoxx.backend.extern.fastify.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.infra.http');
knoxx.backend.infra.http.reply_already_sent_QMARK_ = (function knoxx$backend$infra$http$reply_already_sent_QMARK_(reply){
return knoxx.backend.extern.fastify.reply_already_sent_QMARK_(reply);
});
knoxx.backend.infra.http.json_response_BANG_ = (function knoxx$backend$infra$http$json_response_BANG_(reply,status,body){
return knoxx.backend.extern.fastify.send_json_BANG_(reply,status,body);
});
knoxx.backend.infra.http.request_hostname = (function knoxx$backend$infra$http$request_hostname(request){
var forwarded = (function (){var G__26060 = knoxx.backend.extern.fastify.request_header(request,new cljs.core.Keyword(null,"x-forwarded-host","x-forwarded-host",-1569486603));
var G__26060__$1 = (((G__26060 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__26060,/,/));
var G__26060__$2 = (((G__26060__$1 == null))?null:cljs.core.first(G__26060__$1));
if((G__26060__$2 == null)){
return null;
} else {
return clojure.string.trim(G__26060__$2);
}
})();
var raw_host = (function (){var or__5162__auto__ = forwarded;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.extern.fastify.request_header(request,new cljs.core.Keyword(null,"host","host",-1558485167));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
if(clojure.string.blank_QMARK_(raw_host)){
return knoxx.backend.extern.fastify.request_hostname(request);
} else {
return clojure.string.replace(raw_host,/:.*$/,"");
}
});
knoxx.backend.infra.http.request_scheme = (function knoxx$backend$infra$http$request_scheme(request){
var forwarded = (function (){var G__26068 = knoxx.backend.extern.fastify.request_header(request,new cljs.core.Keyword(null,"x-forwarded-proto","x-forwarded-proto",-76593117));
var G__26068__$1 = (((G__26068 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__26068,/,/));
var G__26068__$2 = (((G__26068__$1 == null))?null:cljs.core.first(G__26068__$1));
if((G__26068__$2 == null)){
return null;
} else {
return clojure.string.trim(G__26068__$2);
}
})();
if(clojure.string.blank_QMARK_(forwarded)){
return "http";
} else {
return forwarded;
}
});
knoxx.backend.infra.http.rewrite_localhost_url = (function knoxx$backend$infra$http$rewrite_localhost_url(url,request){
try{var parsed = (new URL(url));
var host = parsed.hostname;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["127.0.0.1",null,"localhost",null,"::1",null], null), null),host)){
var req_host = knoxx.backend.infra.http.request_hostname(request);
var scheme = knoxx.backend.infra.http.request_scheme(request);
(parsed.protocol = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(scheme)+":"));

(parsed.hostname = req_host);

(parsed.port = "");

return parsed.toString();
} else {
return url;
}
}catch (e26073){var _ = e26073;
return url;
}});
knoxx.backend.infra.http.with_query_param = (function knoxx$backend$infra$http$with_query_param(url,key,value){
try{var parsed = (new URL(url));
parsed.searchParams.set(key,value);

return parsed.toString();
}catch (e26077){var _ = e26077;
return url;
}});
knoxx.backend.infra.http.bearer_headers = (function knoxx$backend$infra$http$bearer_headers(token){
var G__26080 = new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null);
if((!(clojure.string.blank_QMARK_(token)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26080,"Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)));
} else {
return G__26080;
}
});
knoxx.backend.infra.http.openai_auth_error = (function knoxx$backend$infra$http$openai_auth_error(reply,status_code,message,code){
return knoxx.backend.infra.http.json_response_BANG_(reply,status_code,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"message","message",-406056002),message,new cljs.core.Keyword(null,"type","type",1174270348),"invalid_request_error",new cljs.core.Keyword(null,"param","param",2013631823),null,new cljs.core.Keyword(null,"code","code",1586293142),code], null)], null));
});
knoxx.backend.infra.http.require_openai_key_BANG_ = (function knoxx$backend$infra$http$require_openai_key_BANG_(config,request,reply){
var expected = new cljs.core.Keyword(null,"model-lab-openai-api-key","model-lab-openai-api-key",1371814107).cljs$core$IFn$_invoke$arity$1(config);
var auth_header = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = knoxx.backend.extern.fastify.request_header(request,new cljs.core.Keyword(null,"authorization","authorization",-166302136));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(clojure.string.blank_QMARK_(expected)){
knoxx.backend.infra.http.openai_auth_error(reply,(503),"MODEL_LAB_OPENAI_API_KEY is not configured","service_unavailable");

return false;
} else {
if((!(clojure.string.starts_with_QMARK_(clojure.string.lower_case(auth_header),"bearer ")))){
knoxx.backend.infra.http.openai_auth_error(reply,(401),"Invalid API key","invalid_api_key");

return false;
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.subs.cljs$core$IFn$_invoke$arity$2(auth_header,(7)),expected)){
knoxx.backend.infra.http.openai_auth_error(reply,(401),"Invalid API key","invalid_api_key");

return false;
} else {
return true;

}
}
}
});
/**
 * Compatibility wrapper around the extern fetch client. Accepts a CLJS map or
 * JS object for opts and returns Promise<Response>. New call sites should
 * prefer protocol clients that call `knoxx.backend.extern.fetch/json!`,
 * `text!`, or `array-buffer!`.
 */
knoxx.backend.infra.http.fetch_with_timeout = (function knoxx$backend$infra$http$fetch_with_timeout(var_args){
var G__26089 = arguments.length;
switch (G__26089) {
case 2:
return knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$2 = (function (url,opts){
return knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3(url,opts,(30000));
}));

(knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3 = (function (url,opts,timeout_ms){
return knoxx.backend.extern.fetch.default_client.knoxx$backend$extern$fetch$IHttpClient$response_BANG_$arity$2(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),opts,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),timeout_ms], null));
}));

(knoxx.backend.infra.http.fetch_with_timeout.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.http.default_fetch_timeout_ms = (30000);
/**
 * Compatibility wrapper around the extern fetch client. Fetch url with optional
 * CLJS map or JS object opts. Returns Promise<{:ok :status :body :headers}>
 * where :body and :headers are CLJS data.
 */
knoxx.backend.infra.http.fetch_json = (function knoxx$backend$infra$http$fetch_json(var_args){
var G__26093 = arguments.length;
switch (G__26093) {
case 2:
return knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2 = (function (url,opts){
return knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$3(url,opts,knoxx.backend.infra.http.default_fetch_timeout_ms);
}));

(knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$3 = (function (url,opts,timeout_ms){
return knoxx.backend.extern.fetch.default_client.knoxx$backend$extern$fetch$IHttpClient$json_BANG_$arity$2(null,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),opts,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),timeout_ms], null));
}));

(knoxx.backend.infra.http.fetch_json.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.http.http_error = (function knoxx$backend$infra$http$http_error(status,code,message){
var G__26101 = cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(message)),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"code","code",1586293142),code], null));
(G__26101["statusCode"] = status);

(G__26101["code"] = code);

return G__26101;
});
knoxx.backend.infra.http.error_status = (function knoxx$backend$infra$http$error_status(err,default_status){
return knoxx.backend.extern.fastify.error_status(err,default_status);
});
knoxx.backend.infra.http.error_message = (function knoxx$backend$infra$http$error_message(err){
return knoxx.backend.extern.fastify.error_message(err);
});
knoxx.backend.infra.http.error_response_BANG_ = (function knoxx$backend$infra$http$error_response_BANG_(var_args){
var G__26111 = arguments.length;
switch (G__26111) {
case 2:
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (reply,err){
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(500));
}));

(knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (reply,err,default_status){
return knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$4(reply,err,default_status,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.http.error_response_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (reply,err,default_status,context){
var status = knoxx.backend.infra.http.error_status(err,default_status);
var code = knoxx.backend.extern.fastify.error_code(err);
var payload = (function (){var G__26121 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),knoxx.backend.infra.http.error_message(err)], null);
if(cljs.core.truth_(code)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26121,new cljs.core.Keyword(null,"error_code","error_code",1077063696),code);
} else {
return G__26121;
}
})();
if((status >= (500))){
knoxx.backend.domain.error_observatory.log_error_BANG_(new cljs.core.Keyword("http","error-response","http/error-response",-2114104341),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword("error","code","error/code",-1740032098),code], null),context], 0)),err);
} else {
}

return knoxx.backend.infra.http.json_response_BANG_(reply,status,payload);
}));

(knoxx.backend.infra.http.error_response_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.http.no_content_QMARK_ = (function knoxx$backend$infra$http$no_content_QMARK_(x){
return knoxx.backend.extern.fastify.no_content_QMARK_(x);
});
knoxx.backend.infra.http.copy_response_headers_BANG_ = (function knoxx$backend$infra$http$copy_response_headers_BANG_(reply,headers){
return knoxx.backend.extern.fastify.copy_response_headers_BANG_(reply,headers);
});
knoxx.backend.infra.http.send_fetch_response_BANG_ = (function knoxx$backend$infra$http$send_fetch_response_BANG_(reply,resp){
knoxx.backend.infra.http.copy_response_headers_BANG_(reply,resp.headers);

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(resp.arrayBuffer()),(function (buf){
return promesa.protocols._promise(knoxx.backend.extern.fastify.send_buffer_response_BANG_(reply,resp,buf));
}));
}));
});
/**
 * Return the parsed Fastify request body as a CLJS map.
 */
knoxx.backend.infra.http.request_body = (function knoxx$backend$infra$http$request_body(request){
return knoxx.backend.extern.fastify.request_body(request);
});
knoxx.backend.infra.http.request_query_string = (function knoxx$backend$infra$http$request_query_string(request){
return knoxx.backend.extern.fastify.query_string(request);
});
knoxx.backend.infra.http.request_forward_headers = (function knoxx$backend$infra$http$request_forward_headers(request,extra){
return knoxx.backend.extern.fastify.forward_headers(request,extra);
});
knoxx.backend.infra.http.request_forward_body = (function knoxx$backend$infra$http$request_forward_body(request){
return knoxx.backend.extern.fastify.forward_body(request);
});
knoxx.backend.infra.http.request_stream_body = (function knoxx$backend$infra$http$request_stream_body(request){
return knoxx.backend.extern.fastify.stream_body_options(request);
});
knoxx.backend.infra.http.forward_knoxx_request_BANG_ = (function knoxx$backend$infra$http$forward_knoxx_request_BANG_(config,request,method,path,extra){
var target_url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config))+"/api/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.http.request_query_string(request)));
return knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$2(target_url,knoxx.backend.extern.fastify.forward_request_init(request,method,new cljs.core.PersistentArrayMap(null, 1, ["x-api-key",((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"knoxx-api-key","knoxx-api-key",-1142749154).cljs$core$IFn$_invoke$arity$1(config)))?null:new cljs.core.Keyword(null,"knoxx-api-key","knoxx-api-key",-1142749154).cljs$core$IFn$_invoke$arity$1(config))], null),extra));
});

//# sourceMappingURL=knoxx.backend.infra.http.js.map
