import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.infra.clients.knoxx_control');

/**
 * @interface
 */
knoxx.backend.infra.clients.knoxx_control.IKnoxxControlClient = function(){};

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$dyn_33261 = (function (client,method,path,body){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.request_json_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,method,path,body) : m__5520__auto__.call(null,client,method,path,body));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.request_json_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,method,path,body) : m__5518__auto__.call(null,client,method,path,body));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.request-json!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.request_json_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$request_json_BANG_(client,method,path,body){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(client,method,path,body);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$dyn_33261(client,method,path,body);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$steer_BANG_$dyn_33265 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.steer_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.steer_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.steer!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.steer_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$steer_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$steer_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$steer_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$steer_BANG_$dyn_33265(client,payload);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$direct_start_BANG_$dyn_33269 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.direct_start_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.direct_start_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.direct-start!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.direct_start_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$direct_start_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$direct_start_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$direct_start_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$direct_start_BANG_$dyn_33269(client,payload);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$event_config_BANG_$dyn_33273 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.event_config_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.event_config_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.event-config!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.event_config_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$event_config_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$event_config_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$event_config_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$event_config_BANG_$dyn_33273(client);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$save_event_config_BANG_$dyn_33275 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.save_event_config_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.save_event_config_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.save-event-config!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.save_event_config_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$save_event_config_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$save_event_config_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$save_event_config_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$save_event_config_BANG_$dyn_33275(client,payload);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$dispatch_event_BANG_$dyn_33285 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.dispatch_event_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.dispatch_event_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.dispatch-event!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.dispatch_event_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$dispatch_event_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$dispatch_event_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$dispatch_event_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$dispatch_event_BANG_$dyn_33285(client,payload);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$run_event_job_BANG_$dyn_33300 = (function (client,job_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.run_event_job_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,job_id) : m__5520__auto__.call(null,client,job_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.run_event_job_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,job_id) : m__5518__auto__.call(null,client,job_id));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.run-event-job!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.run_event_job_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$run_event_job_BANG_(client,job_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$run_event_job_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$run_event_job_BANG_$arity$2(client,job_id);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$run_event_job_BANG_$dyn_33300(client,job_id);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$forward_api_BANG_$dyn_33306 = (function (client,request,method,path,extra){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.forward_api_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(client,request,method,path,extra) : m__5520__auto__.call(null,client,request,method,path,extra));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.forward_api_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(client,request,method,path,extra) : m__5518__auto__.call(null,client,request,method,path,extra));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.forward-api!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.forward_api_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$forward_api_BANG_(client,request,method,path,extra){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$forward_api_BANG_$arity$5 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$forward_api_BANG_$arity$5(client,request,method,path,extra);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$forward_api_BANG_$dyn_33306(client,request,method,path,extra);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_sources_BANG_$dyn_33314 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_sources_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_sources_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.ingestion-sources!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.ingestion_sources_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$ingestion_sources_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_sources_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_sources_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_sources_BANG_$dyn_33314(client);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_file_BANG_$dyn_33316 = (function (client,path){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_file_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,path) : m__5520__auto__.call(null,client,path));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_file_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,path) : m__5518__auto__.call(null,client,path));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.ingestion-file!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.ingestion_file_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$ingestion_file_BANG_(client,path){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_file_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_file_BANG_$arity$2(client,path);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_file_BANG_$dyn_33316(client,path);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_jobs_BANG_$dyn_33320 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_jobs_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_jobs_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.ingestion-jobs!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.ingestion_jobs_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$ingestion_jobs_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_jobs_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_jobs_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_jobs_BANG_$dyn_33320(client);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_BANG_$dyn_33326 = (function (client,job_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_job_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,job_id) : m__5520__auto__.call(null,client,job_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_job_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,job_id) : m__5518__auto__.call(null,client,job_id));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.ingestion-job!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.ingestion_job_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$ingestion_job_BANG_(client,job_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_BANG_$arity$2(client,job_id);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_BANG_$dyn_33326(client,job_id);
}
});

var knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_actions_BANG_$dyn_33334 = (function (client,job_id,method,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_job_actions_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,job_id,method,payload) : m__5520__auto__.call(null,client,job_id,method,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.knoxx_control.ingestion_job_actions_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,job_id,method,payload) : m__5518__auto__.call(null,client,job_id,method,payload));
} else {
throw cljs.core.missing_protocol("IKnoxxControlClient.ingestion-job-actions!",client);
}
}
});
knoxx.backend.infra.clients.knoxx_control.ingestion_job_actions_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$ingestion_job_actions_BANG_(client,job_id,method,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_actions_BANG_$arity$4 == null)))))){
return client.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_actions_BANG_$arity$4(client,job_id,method,payload);
} else {
return knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_actions_BANG_$dyn_33334(client,job_id,method,payload);
}
});

knoxx.backend.infra.clients.knoxx_control.trim_trailing_slashes = (function knoxx$backend$infra$clients$knoxx_control$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.infra.clients.knoxx_control.env = (function knoxx$backend$infra$clients$knoxx_control$env(k){
var G__33110 = process;
var G__33110__$1 = (((G__33110 == null))?null:G__33110.env);
if((G__33110__$1 == null)){
return null;
} else {
return (G__33110__$1[k]);
}
});
knoxx.backend.infra.clients.knoxx_control.base_url = (function knoxx$backend$infra$clients$knoxx_control$base_url(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"knoxx-base-url","knoxx-base-url",-158933143).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.clients.knoxx_control.env("KNOXX_BASE_URL");
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "http://127.0.0.1:8000";
}
}
});
knoxx.backend.infra.clients.knoxx_control.api_key = (function knoxx$backend$infra$clients$knoxx_control$api_key(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"knoxx-api-key","knoxx-api-key",-1142749154).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.clients.knoxx_control.env("KNOXX_API_KEY");
}
});
knoxx.backend.infra.clients.knoxx_control.headers_for = (function knoxx$backend$infra$clients$knoxx_control$headers_for(config){
var key = knoxx.backend.infra.clients.knoxx_control.api_key(config);
var G__33129 = new cljs.core.PersistentArrayMap(null, 2, ["Content-Type","application/json","x-knoxx-user-email","system-admin@open-hax.local"], null);
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(key)))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33129,"X-API-Key",key);
} else {
return G__33129;
}
});
knoxx.backend.infra.clients.knoxx_control.json_request_BANG_ = (function knoxx$backend$infra$clients$knoxx_control$json_request_BANG_(http_client,config,method,path,body,timeout_ms){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_(http_client,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.knoxx_control.trim_trailing_slashes(knoxx.backend.infra.clients.knoxx_control.base_url(config)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)),new cljs.core.Keyword(null,"opts","opts",155075701),(function (){var G__33149 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.knoxx_control.headers_for(config)], null);
if(cljs.core.truth_(body)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33149,new cljs.core.Keyword(null,"json","json",1279968570),body);
} else {
return G__33149;
}
})(),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),timeout_ms], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp):(function (){throw (new Error((""+"Knoxx control request failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0))))))})()));
}));
}));
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.infra.clients.knoxx_control.IKnoxxControlClient}
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
knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient = (function (config,http_client,timeout_ms,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.timeout_ms = timeout_ms;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33155,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33167 = k33155;
var G__33167__$1 = (((G__33167 instanceof cljs.core.Keyword))?G__33167.fqn:null);
switch (G__33167__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
case "timeout-ms":
return self__.timeout_ms;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33155,else__5472__auto__);

}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33171){
var vec__33172 = p__33171;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33172,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33172,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.clients.knoxx-control.FetchKnoxxControlClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33154){
var self__ = this;
var G__33154__$1 = this;
return (new cljs.core.RecordIter((0),G__33154__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1216814117 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33156,other33157){
var self__ = this;
var this33156__$1 = this;
return (((!((other33157 == null)))) && ((((this33156__$1.constructor === other33157.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33156__$1.config,other33157.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33156__$1.http_client,other33157.http_client)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33156__$1.timeout_ms,other33157.timeout_ms)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33156__$1.__extmap,other33157.__extmap)))))))))));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$dispatch_event_BANG_$arity$2 = (function (client,payload){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"POST","/api/admin/config/events/dispatch",payload);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$save_event_config_BANG_$arity$2 = (function (client,payload){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"PUT","/api/admin/config/events",payload);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$forward_api_BANG_$arity$5 = (function (_,_request,_method,_path,_extra){
var self__ = this;
var ___$1 = this;
return Promise.reject((new Error("forward-api! requires Fastify request streaming adapter; not implemented in FetchKnoxxControlClient yet")));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$run_event_job_BANG_$arity$2 = (function (client,job_id){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"POST",(""+"/api/admin/config/events/jobs/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(job_id))+"/run"),null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_file_BANG_$arity$2 = (function (client,path){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"GET",(""+"/api/ingestion/file?path="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(path))),null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_jobs_BANG_$arity$1 = (function (client){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"GET","/api/ingestion/jobs",null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$event_config_BANG_$arity$1 = (function (client){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"GET","/api/admin/config/events",null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_actions_BANG_$arity$4 = (function (client,job_id,method,payload){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,method,(""+"/api/ingestion/jobs/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(job_id))),payload);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$direct_start_BANG_$arity$2 = (function (client,payload){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"POST","/api/knoxx/direct/start",payload);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_job_BANG_$arity$2 = (function (client,job_id){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"GET",(""+"/api/ingestion/jobs/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(job_id))),null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$steer_BANG_$arity$2 = (function (client,payload){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"POST","/api/knoxx/steer",payload);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$ingestion_sources_BANG_$arity$1 = (function (client){
var self__ = this;
var client__$1 = this;
return client__$1.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4(null,"GET","/api/ingestion/sources",null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.knoxx$backend$infra$clients$knoxx_control$IKnoxxControlClient$request_json_BANG_$arity$4 = (function (_,method,path,body){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.knoxx_control.json_request_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),self__.config,method,path,body,(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})());
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33155){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33212 = k33155;
var G__33212__$1 = (((G__33212 instanceof cljs.core.Keyword))?G__33212.fqn:null);
switch (G__33212__$1) {
case "config":
case "http-client":
case "timeout-ms":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33155);

}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33154){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33217 = cljs.core.keyword_identical_QMARK_;
var expr__33218 = k__5478__auto__;
if(cljs.core.truth_((pred__33217.cljs$core$IFn$_invoke$arity$2 ? pred__33217.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__33218) : pred__33217.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__33218)))){
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(G__33154,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33217.cljs$core$IFn$_invoke$arity$2 ? pred__33217.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33218) : pred__33217.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33218)))){
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,G__33154,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33217.cljs$core$IFn$_invoke$arity$2 ? pred__33217.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__33218) : pred__33217.call(null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__33218)))){
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,self__.http_client,G__33154,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33154),null));
}
}
}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33154){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(self__.config,self__.http_client,self__.timeout_ms,G__33154,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null),new cljs.core.Symbol(null,"timeout-ms","timeout-ms",-1900214363,null)], null);
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.cljs$lang$type = true);

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.clients.knoxx-control/FetchKnoxxControlClient",null,(1),null));
}));

(knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.clients.knoxx-control/FetchKnoxxControlClient");
}));

/**
 * Positional factory function for knoxx.backend.infra.clients.knoxx-control/FetchKnoxxControlClient.
 */
knoxx.backend.infra.clients.knoxx_control.__GT_FetchKnoxxControlClient = (function knoxx$backend$infra$clients$knoxx_control$__GT_FetchKnoxxControlClient(config,http_client,timeout_ms){
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(config,http_client,timeout_ms,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.clients.knoxx-control/FetchKnoxxControlClient, taking a map of keywords to field values.
 */
knoxx.backend.infra.clients.knoxx_control.map__GT_FetchKnoxxControlClient = (function knoxx$backend$infra$clients$knoxx_control$map__GT_FetchKnoxxControlClient(G__33160){
var extmap__5511__auto__ = (function (){var G__33241 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__33160,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], 0));
if(cljs.core.record_QMARK_(G__33160)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__33241);
} else {
return G__33241;
}
})();
return (new knoxx.backend.infra.clients.knoxx_control.FetchKnoxxControlClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__33160),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33160),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(G__33160),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.clients.knoxx_control.client = (function knoxx$backend$infra$clients$knoxx_control$client(var_args){
var G__33251 = arguments.length;
switch (G__33251) {
case 1:
return knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__33253){
var map__33254 = p__33253;
var map__33254__$1 = cljs.core.__destructure_map(map__33254);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33254__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33254__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
return knoxx.backend.infra.clients.knoxx_control.__GT_FetchKnoxxControlClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})());
}));

(knoxx.backend.infra.clients.knoxx_control.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.clients.knoxx_control.js.map
