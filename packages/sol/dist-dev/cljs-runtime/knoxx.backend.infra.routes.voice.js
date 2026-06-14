import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fastify.js";
import "./knoxx.backend.extern.multipart.js";
import "./knoxx.backend.extern.websocket.js";
import "./knoxx.backend.infra.http.js";
goog.provide('knoxx.backend.infra.routes.voice');
knoxx.backend.infra.routes.voice.default_voxx_voice_id = "af_jessica";
knoxx.backend.infra.routes.voice.default_voxx_model_id = "kokoro";
knoxx.backend.infra.routes.voice.default_voxx_speed = "1.15";
knoxx.backend.infra.routes.voice.default_voxx_output_format = "mp3";
knoxx.backend.infra.routes.voice.default_voxx_postprocess_profile = "sports-commentator-v1";
knoxx.backend.infra.routes.voice.trim_trailing_slashes = (function knoxx$backend$infra$routes$voice$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.infra.routes.voice.stt_base_url = (function knoxx$backend$infra$routes$voice$stt_base_url(config){
return knoxx.backend.infra.routes.voice.trim_trailing_slashes(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
});
knoxx.backend.infra.routes.voice.fetch_stt_json = (function knoxx$backend$infra$routes$voice$fetch_stt_json(base_url,suffix,opts){
return knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_url)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix)),opts);
});
knoxx.backend.infra.routes.voice.trim_or_empty = (function knoxx$backend$infra$routes$voice$trim_or_empty(value){
return clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
});
knoxx.backend.infra.routes.voice.false_like_QMARK_ = (function knoxx$backend$infra$routes$voice$false_like_QMARK_(value){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(false,value)) || (cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 7, ["none",null,"off",null,"false",null,"disable",null,"0",null,"no",null,"disabled",null], null), null),clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto____$1 = value;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
})())))))));
});
knoxx.backend.infra.routes.voice.bool_value = (function knoxx$backend$infra$routes$voice$bool_value(value,default$){
if((value == null)){
return default$;
} else {
return (!(knoxx.backend.infra.routes.voice.false_like_QMARK_(value)));
}
});
knoxx.backend.infra.routes.voice.first_body_value = (function knoxx$backend$infra$routes$voice$first_body_value(body,names){
return cljs.core.some((function (name){
var value = cljs.core.get.cljs$core$IFn$_invoke$arity$2(body,cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(name));
if((value == null)){
return null;
} else {
return value;
}
}),names);
});
knoxx.backend.infra.routes.voice.voice_gateway_url = (function knoxx$backend$infra$routes$voice$voice_gateway_url(config){
var configured = knoxx.backend.infra.routes.voice.trim_or_empty(new cljs.core.Keyword(null,"voxx-url","voxx-url",-1259052170).cljs$core$IFn$_invoke$arity$1(config));
if(clojure.string.blank_QMARK_(configured)){
return "http://127.0.0.1:8787";
} else {
return knoxx.backend.infra.routes.voice.trim_trailing_slashes(configured);
}
});
knoxx.backend.infra.routes.voice.voxx_v1_url = (function knoxx$backend$infra$routes$voice$voxx_v1_url(config,suffix){
var base = knoxx.backend.infra.routes.voice.voice_gateway_url(config);
if(clojure.string.ends_with_QMARK_(base,"/v1/audio/speech")){
return clojure.string.replace(base,/\/audio\/speech$/,suffix);
} else {
if(clojure.string.ends_with_QMARK_(base,"/v1")){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix));
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+"/v1"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix));

}
}
});
knoxx.backend.infra.routes.voice.voice_gateway_api_key = (function knoxx$backend$infra$routes$voice$voice_gateway_api_key(config){
return knoxx.backend.infra.routes.voice.trim_or_empty(new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716).cljs$core$IFn$_invoke$arity$1(config));
});
knoxx.backend.infra.routes.voice.voxx_default_voice_id = (function knoxx$backend$infra$routes$voice$voxx_default_voice_id(config){
var configured = knoxx.backend.infra.routes.voice.trim_or_empty(new cljs.core.Keyword(null,"voxx-voice-id","voxx-voice-id",-652120125).cljs$core$IFn$_invoke$arity$1(config));
if(clojure.string.blank_QMARK_(configured)){
return knoxx.backend.infra.routes.voice.default_voxx_voice_id;
} else {
return configured;
}
});
knoxx.backend.infra.routes.voice.voxx_default_model_id = (function knoxx$backend$infra$routes$voice$voxx_default_model_id(config){
var configured = knoxx.backend.infra.routes.voice.trim_or_empty(new cljs.core.Keyword(null,"voxx-model-id","voxx-model-id",2106305693).cljs$core$IFn$_invoke$arity$1(config));
if(clojure.string.blank_QMARK_(configured)){
return knoxx.backend.infra.routes.voice.default_voxx_model_id;
} else {
return configured;
}
});
knoxx.backend.infra.routes.voice.voxx_default_speed = (function knoxx$backend$infra$routes$voice$voxx_default_speed(config){
var configured = knoxx.backend.infra.routes.voice.trim_or_empty(new cljs.core.Keyword(null,"voxx-default-speed","voxx-default-speed",-370827943).cljs$core$IFn$_invoke$arity$1(config));
if(clojure.string.blank_QMARK_(configured)){
return knoxx.backend.infra.routes.voice.default_voxx_speed;
} else {
return configured;
}
});
knoxx.backend.infra.routes.voice.voxx_headers = (function knoxx$backend$infra$routes$voice$voxx_headers(api_key){
return new cljs.core.PersistentArrayMap(null, 3, ["Content-Type","application/json","Accept","audio/mpeg","Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(api_key))], null);
});
knoxx.backend.infra.routes.voice.voxx_health_headers = (function knoxx$backend$infra$routes$voice$voxx_health_headers(api_key){
return new cljs.core.PersistentArrayMap(null, 2, ["Content-Type","application/json","Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(api_key))], null);
});
knoxx.backend.infra.routes.voice.voxx_tts_url = (function knoxx$backend$infra$routes$voice$voxx_tts_url(config){
return knoxx.backend.infra.routes.voice.voxx_v1_url(config,"/audio/speech");
});
knoxx.backend.infra.routes.voice.ws_send_json_BANG_ = (function knoxx$backend$infra$routes$voice$ws_send_json_BANG_(socket,payload){
return knoxx.backend.extern.websocket.send_json_BANG_(socket,payload);
});
knoxx.backend.infra.routes.voice.ws_close_BANG_ = (function knoxx$backend$infra$routes$voice$ws_close_BANG_(var_args){
var G__29685 = arguments.length;
switch (G__29685) {
case 1:
return knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 3:
return knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (socket){
return knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$3(socket,(1000),"");
}));

(knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (socket,code,reason){
return knoxx.backend.extern.websocket.close_BANG_.cljs$core$IFn$_invoke$arity$3(socket,code,reason);
}));

(knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.routes.voice.register_voice_ws_route_BANG_ = (function knoxx$backend$infra$routes$voice$register_voice_ws_route_BANG_(app,_config){
var G__29695 = app;
var G__29696 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"url","url",276297046),"/ws/voice/tts",new cljs.core.Keyword(null,"handler","handler",-195596612),(function (_request,reply){
return knoxx.backend.extern.fastify.send_json_BANG_(reply,(426),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),"WebSocket upgrade required"], null));
}),new cljs.core.Keyword(null,"wsHandler","wsHandler",-2146439207),(function (socket,_request){
var client = knoxx.backend.extern.websocket.client_socket(socket);
knoxx.backend.infra.routes.voice.ws_send_json_BANG_(client,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"error",new cljs.core.Keyword(null,"detail","detail",-1545345025),"Voxx streaming TTS is not exposed by this Knoxx bridge yet. Use voice.tts or POST /api/voice/tts for Voxx /v1/audio/speech."], null));

return knoxx.backend.infra.routes.voice.ws_close_BANG_.cljs$core$IFn$_invoke$arity$3(client,(1000),"voxx_streaming_tts_unavailable");
})], null);
return (knoxx.backend.infra.routes.voice.app_route_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.routes.voice.app_route_BANG_.cljs$core$IFn$_invoke$arity$2(G__29695,G__29696) : knoxx.backend.infra.routes.voice.app_route_BANG_.call(null,G__29695,G__29696));
});
knoxx.backend.infra.routes.voice.request_parts_promise = (function knoxx$backend$infra$routes$voice$request_parts_promise(request){
return knoxx.backend.extern.multipart.parts_BANG_(request);
});
knoxx.backend.infra.routes.voice.reply_header_BANG_ = (function knoxx$backend$infra$routes$voice$reply_header_BANG_(reply,name,value){
return knoxx.backend.extern.fastify.reply_header_BANG_(reply,name,value);
});
knoxx.backend.infra.routes.voice.app_route_BANG_ = (function knoxx$backend$infra$routes$voice$app_route_BANG_(app,opts){
return knoxx.backend.extern.fastify.route_BANG_(app,opts);
});
knoxx.backend.infra.routes.voice.handle_stt_health_BANG_ = (async function knoxx$backend$infra$routes$voice$handle_stt_health_BANG_(config,reply,ctx,json_response_BANG_,ensure_tool_BANG_){
if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"multimodal.upload") : ensure_tool_BANG_.call(null,ctx,"multimodal.upload"));
} else {
}

var base = knoxx.backend.infra.routes.voice.stt_base_url(config);
if(clojure.string.blank_QMARK_(base)){
var G__29718 = reply;
var G__29719 = (503);
var G__29720 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"KNOXX_STT_BASE_URL is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29718,G__29719,G__29720) : json_response_BANG_.call(null,G__29718,G__29719,G__29720));
} else {
try{var resp = (await knoxx.backend.infra.routes.voice.fetch_stt_json(base,"/health",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"method","method",55703592),"GET"], null)));
var G__29728 = reply;
var G__29729 = (cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?(200):(502));
var G__29730 = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29728,G__29729,G__29730) : json_response_BANG_.call(null,G__29728,G__29729,G__29730));
}catch (e29721){var err = e29721;
var G__29722 = reply;
var G__29723 = (502);
var G__29724 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"STT health failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29722,G__29723,G__29724) : json_response_BANG_.call(null,G__29722,G__29723,G__29724));
}}
});
knoxx.backend.infra.routes.voice.register_stt_health_route_BANG_ = (function knoxx$backend$infra$routes$voice$register_stt_health_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_){
var G__29742 = app;
var G__29743 = "GET";
var G__29744 = "/api/voice/stt/health";
var G__29745 = (function (request,reply){
var G__29746 = runtime;
var G__29747 = request;
var G__29748 = reply;
var G__29749 = (function (ctx){
return knoxx.backend.infra.routes.voice.handle_stt_health_BANG_(config,reply,ctx,json_response_BANG_,ensure_tool_BANG_);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29746,G__29747,G__29748,G__29749) : with_request_context_BANG_.call(null,G__29746,G__29747,G__29748,G__29749));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29742,G__29743,G__29744,G__29745) : route_BANG_.call(null,G__29742,G__29743,G__29744,G__29745));
});
knoxx.backend.infra.routes.voice.transcribe_file_part_BANG_ = (async function knoxx$backend$infra$routes$voice$transcribe_file_part_BANG_(base,file_part){
var body = (await knoxx.backend.extern.multipart.part_buffer_BANG_(file_part));
var mime = knoxx.backend.extern.multipart.part_mime_type(file_part);
return (await knoxx.backend.infra.routes.voice.fetch_stt_json(base,"/transcribe",new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 1, ["Content-Type",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(mime))], null),new cljs.core.Keyword(null,"body","body",-2049205669),body], null)));
});
knoxx.backend.infra.routes.voice.stt_transcription_response_BANG_ = (async function knoxx$backend$infra$routes$voice$stt_transcription_response_BANG_(base,request){
var parts = (await knoxx.backend.infra.routes.voice.request_parts_promise(request));
var file_part = cljs.core.first(knoxx.backend.extern.multipart.file_parts(parts));
if(cljs.core.not(file_part)){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),(400),new cljs.core.Keyword(null,"detail","detail",-1545345025),"No file uploaded. Send multipart/form-data with a file part."], null)], null);
} else {
return (await knoxx.backend.infra.routes.voice.transcribe_file_part_BANG_(base,file_part));
}
});
knoxx.backend.infra.routes.voice.send_stt_response_BANG_ = (function knoxx$backend$infra$routes$voice$send_stt_response_BANG_(reply,json_response_BANG_,resp){
if(cljs.core.truth_((function (){var and__5160__auto__ = resp;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(resp);
} else {
return and__5160__auto__;
}
})())){
var err = new cljs.core.Keyword(null,"error","error",-978969032).cljs$core$IFn$_invoke$arity$1(resp);
var G__29780 = reply;
var G__29781 = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(err);
var G__29782 = err;
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29780,G__29781,G__29782) : json_response_BANG_.call(null,G__29780,G__29781,G__29782));
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = resp;
if(cljs.core.truth_(and__5160__auto__)){
return new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp);
} else {
return and__5160__auto__;
}
})())){
var G__29789 = reply;
var G__29790 = (200);
var G__29791 = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29789,G__29790,G__29791) : json_response_BANG_.call(null,G__29789,G__29790,G__29791));
} else {
var G__29796 = reply;
var G__29797 = (502);
var G__29798 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"STT service error",new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29796,G__29797,G__29798) : json_response_BANG_.call(null,G__29796,G__29797,G__29798));

}
}
});
knoxx.backend.infra.routes.voice.handle_stt_transcribe_BANG_ = (async function knoxx$backend$infra$routes$voice$handle_stt_transcribe_BANG_(config,request,reply,ctx,json_response_BANG_,ensure_tool_BANG_){
if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"multimodal.upload") : ensure_tool_BANG_.call(null,ctx,"multimodal.upload"));
} else {
}

var base = knoxx.backend.infra.routes.voice.stt_base_url(config);
if(clojure.string.blank_QMARK_(base)){
var G__29813 = reply;
var G__29814 = (503);
var G__29815 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"KNOXX_STT_BASE_URL is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29813,G__29814,G__29815) : json_response_BANG_.call(null,G__29813,G__29814,G__29815));
} else {
try{return knoxx.backend.infra.routes.voice.send_stt_response_BANG_(reply,json_response_BANG_,(await knoxx.backend.infra.routes.voice.stt_transcription_response_BANG_(base,request)));
}catch (e29821){var err = e29821;
var G__29822 = reply;
var G__29823 = (500);
var G__29824 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"STT request failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29822,G__29823,G__29824) : json_response_BANG_.call(null,G__29822,G__29823,G__29824));
}}
});
knoxx.backend.infra.routes.voice.register_stt_transcribe_route_BANG_ = (function knoxx$backend$infra$routes$voice$register_stt_transcribe_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_){
var G__29842 = app;
var G__29843 = "POST";
var G__29844 = "/api/voice/stt";
var G__29845 = (function (request,reply){
var G__29849 = runtime;
var G__29850 = request;
var G__29851 = reply;
var G__29852 = (function (ctx){
return knoxx.backend.infra.routes.voice.handle_stt_transcribe_BANG_(config,request,reply,ctx,json_response_BANG_,ensure_tool_BANG_);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29849,G__29850,G__29851,G__29852) : with_request_context_BANG_.call(null,G__29849,G__29850,G__29851,G__29852));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29842,G__29843,G__29844,G__29845) : route_BANG_.call(null,G__29842,G__29843,G__29844,G__29845));
});
knoxx.backend.infra.routes.voice.voxx_health_body = (function knoxx$backend$infra$routes$voice$voxx_health_body(config,resp){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"reachable","reachable",-1495191549),new cljs.core.Keyword(null,"default_speed","default_speed",-854483932),new cljs.core.Keyword(null,"default_postprocess_enabled","default_postprocess_enabled",526743684),new cljs.core.Keyword(null,"default_prompt_aware","default_prompt_aware",-1135936336),new cljs.core.Keyword(null,"default_voice_id","default_voice_id",-896667018),new cljs.core.Keyword(null,"status_code","status_code",-572644263),new cljs.core.Keyword(null,"default_model_id","default_model_id",631932827),new cljs.core.Keyword(null,"provider","provider",-302056900),new cljs.core.Keyword(null,"default_postprocess_profile","default_postprocess_profile",1969594013),new cljs.core.Keyword(null,"configured","configured",-884777889)],[cljs.core.boolean$(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp)),knoxx.backend.infra.routes.voice.voxx_default_speed(config),true,true,knoxx.backend.infra.routes.voice.voxx_default_voice_id(config),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),knoxx.backend.infra.routes.voice.voxx_default_model_id(config),"voxx",knoxx.backend.infra.routes.voice.default_voxx_postprocess_profile,true]);
});
knoxx.backend.infra.routes.voice.handle_tts_health_BANG_ = (async function knoxx$backend$infra$routes$voice$handle_tts_health_BANG_(config,reply,ctx,json_response_BANG_,ensure_tool_BANG_){
if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"multimodal.upload") : ensure_tool_BANG_.call(null,ctx,"multimodal.upload"));
} else {
}

var api_key = knoxx.backend.infra.routes.voice.voice_gateway_api_key(config);
if(clojure.string.blank_QMARK_(api_key)){
var G__29871 = reply;
var G__29872 = (503);
var G__29873 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"VOICE_GATEWAY_API_KEY is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29871,G__29872,G__29873) : json_response_BANG_.call(null,G__29871,G__29872,G__29873));
} else {
try{var resp = (await knoxx.backend.infra.http.fetch_json.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.routes.voice.voxx_v1_url(config,"/voices"),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.routes.voice.voxx_health_headers(api_key)], null)));
var G__29880 = reply;
var G__29881 = (cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?(200):(502));
var G__29882 = knoxx.backend.infra.routes.voice.voxx_health_body(config,resp);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29880,G__29881,G__29882) : json_response_BANG_.call(null,G__29880,G__29881,G__29882));
}catch (e29874){var err = e29874;
var G__29875 = reply;
var G__29876 = (502);
var G__29877 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Voice Gateway health failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29875,G__29876,G__29877) : json_response_BANG_.call(null,G__29875,G__29876,G__29877));
}}
});
knoxx.backend.infra.routes.voice.register_tts_health_route_BANG_ = (function knoxx$backend$infra$routes$voice$register_tts_health_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_){
var G__29883 = app;
var G__29884 = "GET";
var G__29885 = "/api/voice/tts/health";
var G__29886 = (function (request,reply){
var G__29887 = runtime;
var G__29888 = request;
var G__29889 = reply;
var G__29890 = (function (ctx){
return knoxx.backend.infra.routes.voice.handle_tts_health_BANG_(config,reply,ctx,json_response_BANG_,ensure_tool_BANG_);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29887,G__29888,G__29889,G__29890) : with_request_context_BANG_.call(null,G__29887,G__29888,G__29889,G__29890));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29883,G__29884,G__29885,G__29886) : route_BANG_.call(null,G__29883,G__29884,G__29885,G__29886));
});
knoxx.backend.infra.routes.voice.configured_or_default = (function knoxx$backend$infra$routes$voice$configured_or_default(value,default$){
var configured = knoxx.backend.infra.routes.voice.trim_or_empty(value);
if(clojure.string.blank_QMARK_(configured)){
return default$;
} else {
return configured;
}
});
knoxx.backend.infra.routes.voice.tts_base_payload = (function knoxx$backend$infra$routes$voice$tts_base_payload(config,body,text){
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"input","input",556931961),text,new cljs.core.Keyword(null,"voice","voice",185716428),knoxx.backend.infra.routes.voice.configured_or_default((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"voice_id","voice_id",-725801774).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"voiceId","voiceId",-683686835).cljs$core$IFn$_invoke$arity$1(body);
}
})(),knoxx.backend.infra.routes.voice.voxx_default_voice_id(config)),new cljs.core.Keyword(null,"model","model",331153215),knoxx.backend.infra.routes.voice.configured_or_default((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model_id","model_id",-2010580717).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"modelId","modelId",-2032502006).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(body);
}
}
})(),knoxx.backend.infra.routes.voice.voxx_default_model_id(config)),new cljs.core.Keyword(null,"response_format","response_format",1229973741),knoxx.backend.infra.routes.voice.configured_or_default((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"output_format","output_format",1390326421).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"outputFormat","outputFormat",-1266165202).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"response_format","response_format",1229973741).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return new cljs.core.Keyword(null,"responseFormat","responseFormat",-2101246226).cljs$core$IFn$_invoke$arity$1(body);
}
}
}
})(),knoxx.backend.infra.routes.voice.default_voxx_output_format),new cljs.core.Keyword(null,"speed","speed",1257663751),knoxx.backend.infra.routes.voice.configured_or_default(knoxx.backend.infra.routes.voice.first_body_value(body,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["speed"], null)),knoxx.backend.infra.routes.voice.voxx_default_speed(config)),new cljs.core.Keyword(null,"postprocess_enabled","postprocess_enabled",-648946072),knoxx.backend.infra.routes.voice.bool_value(knoxx.backend.infra.routes.voice.first_body_value(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["postprocess_enabled","postprocessEnabled"], null)),true),new cljs.core.Keyword(null,"prompt_aware","prompt_aware",1309007496),knoxx.backend.infra.routes.voice.bool_value(knoxx.backend.infra.routes.voice.first_body_value(body,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["prompt_aware","promptAware","prompt-aware"], null)),true)], null);
});
knoxx.backend.infra.routes.voice.tts_extra_payload = (function knoxx$backend$infra$routes$voice$tts_extra_payload(body){
var postprocess_profile = knoxx.backend.infra.routes.voice.configured_or_default(knoxx.backend.infra.routes.voice.first_body_value(body,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["postprocess_profile","postprocessProfile","postprocess"], null)),knoxx.backend.infra.routes.voice.default_voxx_postprocess_profile);
var prompt_aware_style = knoxx.backend.infra.routes.voice.trim_or_empty(knoxx.backend.infra.routes.voice.first_body_value(body,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["prompt_aware_style","promptAwareStyle"], null)));
var G__29913 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"postprocess_profile","postprocess_profile",-1254686835),postprocess_profile], null);
var G__29913__$1 = (((!(clojure.string.blank_QMARK_(prompt_aware_style))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29913,new cljs.core.Keyword(null,"prompt_aware_style","prompt_aware_style",1965441274),prompt_aware_style):G__29913);
if((!((new cljs.core.Keyword(null,"voice_settings","voice_settings",160567748).cljs$core$IFn$_invoke$arity$1(body) == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29913__$1,new cljs.core.Keyword(null,"voice_settings","voice_settings",160567748),new cljs.core.Keyword(null,"voice_settings","voice_settings",160567748).cljs$core$IFn$_invoke$arity$1(body));
} else {
return G__29913__$1;
}
});
/**
 * Build the TTS request payload from the request body and config.
 */
knoxx.backend.infra.routes.voice.tts_request_payload = (function knoxx$backend$infra$routes$voice$tts_request_payload(config,body){
var text = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),text,new cljs.core.Keyword(null,"payload","payload",-383036092),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.routes.voice.tts_base_payload(config,body,text),knoxx.backend.infra.routes.voice.tts_extra_payload(body)], 0))], null);
});
knoxx.backend.infra.routes.voice.send_tts_response_BANG_ = (async function knoxx$backend$infra$routes$voice$send_tts_response_BANG_(reply,json_response_BANG_,resp){
if(cljs.core.truth_(resp.ok)){
knoxx.backend.infra.routes.voice.reply_header_BANG_(reply,"Cache-Control","no-store");

return knoxx.backend.infra.http.send_fetch_response_BANG_(reply,resp);
} else {
var detail = (await resp.text());
var G__29931 = reply;
var G__29932 = resp.status;
var G__29933 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Voice Gateway TTS failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(detail)),new cljs.core.Keyword(null,"status_code","status_code",-572644263),resp.status], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29931,G__29932,G__29933) : json_response_BANG_.call(null,G__29931,G__29932,G__29933));
}
});
knoxx.backend.infra.routes.voice.handle_tts_BANG_ = (async function knoxx$backend$infra$routes$voice$handle_tts_BANG_(config,request,reply,ctx,json_response_BANG_,ensure_tool_BANG_){
if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"multimodal.upload") : ensure_tool_BANG_.call(null,ctx,"multimodal.upload"));
} else {
}

var api_key = knoxx.backend.infra.routes.voice.voice_gateway_api_key(config);
var body = knoxx.backend.infra.http.request_body(request);
var map__29938 = knoxx.backend.infra.routes.voice.tts_request_payload(config,body);
var map__29938__$1 = cljs.core.__destructure_map(map__29938);
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29938__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var payload = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29938__$1,new cljs.core.Keyword(null,"payload","payload",-383036092));
if(clojure.string.blank_QMARK_(api_key)){
var G__29940 = reply;
var G__29941 = (503);
var G__29942 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"VOICE_GATEWAY_API_KEY is not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29940,G__29941,G__29942) : json_response_BANG_.call(null,G__29940,G__29941,G__29942));
} else {
if(clojure.string.blank_QMARK_(clojure.string.trim(text))){
var G__29943 = reply;
var G__29944 = (400);
var G__29945 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing required field: text"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29943,G__29944,G__29945) : json_response_BANG_.call(null,G__29943,G__29944,G__29945));
} else {
try{var url = knoxx.backend.infra.routes.voice.voxx_tts_url(config);
var opts = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.routes.voice.voxx_headers(api_key),new cljs.core.Keyword(null,"json","json",1279968570),payload], null);
return knoxx.backend.infra.routes.voice.send_tts_response_BANG_(reply,json_response_BANG_,(await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3(url,opts,(30000))));
}catch (e29947){var err = e29947;
var G__29948 = reply;
var G__29949 = (502);
var G__29950 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Voice Gateway TTS request failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29948,G__29949,G__29950) : json_response_BANG_.call(null,G__29948,G__29949,G__29950));
}
}
}
});
knoxx.backend.infra.routes.voice.register_tts_route_BANG_ = (function knoxx$backend$infra$routes$voice$register_tts_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_){
var G__29954 = app;
var G__29955 = "POST";
var G__29956 = "/api/voice/tts";
var G__29957 = (function (request,reply){
var G__29958 = runtime;
var G__29959 = request;
var G__29960 = reply;
var G__29961 = (function (ctx){
return knoxx.backend.infra.routes.voice.handle_tts_BANG_(config,request,reply,ctx,json_response_BANG_,ensure_tool_BANG_);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29958,G__29959,G__29960,G__29961) : with_request_context_BANG_.call(null,G__29958,G__29959,G__29960,G__29961));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29954,G__29955,G__29956,G__29957) : route_BANG_.call(null,G__29954,G__29955,G__29956,G__29957));
});
knoxx.backend.infra.routes.voice.register_voice_routes_BANG_ = (function knoxx$backend$infra$routes$voice$register_voice_routes_BANG_(app,runtime,config,handlers){
var map__29965 = handlers;
var map__29965__$1 = cljs.core.__destructure_map(map__29965);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29965__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29965__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29965__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29965__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
knoxx.backend.infra.routes.voice.register_voice_ws_route_BANG_(app,config);

knoxx.backend.infra.routes.voice.register_stt_health_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_);

knoxx.backend.infra.routes.voice.register_stt_transcribe_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_);

knoxx.backend.infra.routes.voice.register_tts_health_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_);

knoxx.backend.infra.routes.voice.register_tts_route_BANG_(app,runtime,config,route_BANG_,json_response_BANG_,with_request_context_BANG_,ensure_tool_BANG_);

return null;
});
knoxx.backend.infra.routes.voice.register_voice_routes = (function knoxx$backend$infra$routes$voice$register_voice_routes(app,runtime,config,handlers){
return knoxx.backend.infra.routes.voice.register_voice_routes_BANG_(app,runtime,config,handlers);
});

//# sourceMappingURL=knoxx.backend.infra.routes.voice.js.map
