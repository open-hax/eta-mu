import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
goog.provide('knoxx.backend.infra.clients.proxx');

/**
 * @interface
 */
knoxx.backend.infra.clients.proxx.IProxxClient = function(){};

var knoxx$backend$infra$clients$proxx$IProxxClient$health_BANG_$dyn_29751 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.health_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.health_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IProxxClient.health!",client);
}
}
});
knoxx.backend.infra.clients.proxx.health_BANG_ = (function knoxx$backend$infra$clients$proxx$health_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$health_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$health_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$health_BANG_$dyn_29751(client);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$models_BANG_$dyn_29753 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.models_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.models_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IProxxClient.models!",client);
}
}
});
knoxx.backend.infra.clients.proxx.models_BANG_ = (function knoxx$backend$infra$clients$proxx$models_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$models_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$models_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$models_BANG_$dyn_29753(client);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$request_logs_BANG_$dyn_29756 = (function (client,query_string){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.request_logs_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5520__auto__.call(null,client,query_string));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.request_logs_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5518__auto__.call(null,client,query_string));
} else {
throw cljs.core.missing_protocol("IProxxClient.request-logs!",client);
}
}
});
knoxx.backend.infra.clients.proxx.request_logs_BANG_ = (function knoxx$backend$infra$clients$proxx$request_logs_BANG_(client,query_string){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$request_logs_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$request_logs_BANG_$arity$2(client,query_string);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$request_logs_BANG_$dyn_29756(client,query_string);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$dashboard_overview_BANG_$dyn_29760 = (function (client,query_string){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.dashboard_overview_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5520__auto__.call(null,client,query_string));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.dashboard_overview_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5518__auto__.call(null,client,query_string));
} else {
throw cljs.core.missing_protocol("IProxxClient.dashboard-overview!",client);
}
}
});
knoxx.backend.infra.clients.proxx.dashboard_overview_BANG_ = (function knoxx$backend$infra$clients$proxx$dashboard_overview_BANG_(client,query_string){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$dashboard_overview_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$dashboard_overview_BANG_$arity$2(client,query_string);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$dashboard_overview_BANG_$dyn_29760(client,query_string);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$provider_model_analytics_BANG_$dyn_29764 = (function (client,query_string){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.provider_model_analytics_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5520__auto__.call(null,client,query_string));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.provider_model_analytics_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,query_string) : m__5518__auto__.call(null,client,query_string));
} else {
throw cljs.core.missing_protocol("IProxxClient.provider-model-analytics!",client);
}
}
});
knoxx.backend.infra.clients.proxx.provider_model_analytics_BANG_ = (function knoxx$backend$infra$clients$proxx$provider_model_analytics_BANG_(client,query_string){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$provider_model_analytics_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$provider_model_analytics_BANG_$arity$2(client,query_string);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$provider_model_analytics_BANG_$dyn_29764(client,query_string);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$websearch_BANG_$dyn_29765 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.websearch_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.websearch_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IProxxClient.websearch!",client);
}
}
});
knoxx.backend.infra.clients.proxx.websearch_BANG_ = (function knoxx$backend$infra$clients$proxx$websearch_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$websearch_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$websearch_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$websearch_BANG_$dyn_29765(client,payload);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_BANG_$dyn_29767 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.chat_completions_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.chat_completions_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IProxxClient.chat-completions!",client);
}
}
});
knoxx.backend.infra.clients.proxx.chat_completions_BANG_ = (function knoxx$backend$infra$clients$proxx$chat_completions_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_BANG_$dyn_29767(client,payload);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_response_BANG_$dyn_29769 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.chat_completions_response_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.chat_completions_response_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IProxxClient.chat-completions-response!",client);
}
}
});
knoxx.backend.infra.clients.proxx.chat_completions_response_BANG_ = (function knoxx$backend$infra$clients$proxx$chat_completions_response_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_response_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_response_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_response_BANG_$dyn_29769(client,payload);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_BANG_$dyn_29770 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.embeddings_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.embeddings_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IProxxClient.embeddings!",client);
}
}
});
knoxx.backend.infra.clients.proxx.embeddings_BANG_ = (function knoxx$backend$infra$clients$proxx$embeddings_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_BANG_$dyn_29770(client,payload);
}
});

var knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_response_BANG_$dyn_29771 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.proxx.embeddings_response_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.proxx.embeddings_response_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IProxxClient.embeddings-response!",client);
}
}
});
knoxx.backend.infra.clients.proxx.embeddings_response_BANG_ = (function knoxx$backend$infra$clients$proxx$embeddings_response_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_response_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_response_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_response_BANG_$dyn_29771(client,payload);
}
});

knoxx.backend.infra.clients.proxx.configured_QMARK_ = (function knoxx$backend$infra$clients$proxx$configured_QMARK_(config){
return (((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))))));
});
knoxx.backend.infra.clients.proxx.trim_trailing_slashes = (function knoxx$backend$infra$clients$proxx$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.infra.clients.proxx.url_for = (function knoxx$backend$infra$clients$proxx$url_for(config,suffix){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.proxx.trim_trailing_slashes(new cljs.core.Keyword(null,"proxx-base-url","proxx-base-url",-322145978).cljs$core$IFn$_invoke$arity$1(config)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix));
});
knoxx.backend.infra.clients.proxx.headers_for = (function knoxx$backend$infra$clients$proxx$headers_for(config){
var G__29667 = new cljs.core.PersistentArrayMap(null, 1, ["Content-Type","application/json"], null);
if((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29667,"Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"proxx-auth-token","proxx-auth-token",-621179676).cljs$core$IFn$_invoke$arity$1(config))));
} else {
return G__29667;
}
});
knoxx.backend.infra.clients.proxx.json_request_BANG_ = (function knoxx$backend$infra$clients$proxx$json_request_BANG_(http_client,config,method,suffix,body,timeout_ms){
return knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.infra.clients.proxx.url_for(config,suffix),new cljs.core.Keyword(null,"opts","opts",155075701),(function (){var G__29673 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.proxx.headers_for(config)], null);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29673,new cljs.core.Keyword(null,"json","json",1279968570),body);
} else {
return G__29673;
}
})(),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null));
});
knoxx.backend.infra.clients.proxx.response_request_BANG_ = (function knoxx$backend$infra$clients$proxx$response_request_BANG_(http_client,config,method,suffix,body,timeout_ms){
return knoxx.backend.extern.fetch.response_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.infra.clients.proxx.url_for(config,suffix),new cljs.core.Keyword(null,"opts","opts",155075701),(function (){var G__29679 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.proxx.headers_for(config)], null);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__29679,new cljs.core.Keyword(null,"json","json",1279968570),body);
} else {
return G__29679;
}
})(),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (30000);
}
})()], null));
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
 * @implements {knoxx.backend.infra.clients.proxx.IProxxClient}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.clients.proxx.FetchProxxClient = (function (config,http_client,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k29685,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__29694 = k29685;
var G__29694__$1 = (((G__29694 instanceof cljs.core.Keyword))?G__29694.fqn:null);
switch (G__29694__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k29685,else__5472__auto__);

}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__29695){
var vec__29696 = p__29695;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29696,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__29696,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.clients.proxx.FetchProxxClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__29684){
var self__ = this;
var G__29684__$1 = this;
return (new cljs.core.RecordIter((0),G__29684__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(self__.config,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$provider_model_analytics_BANG_$arity$2 = (function (_,query_string){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"GET",(""+"/api/v1/analytics/provider-model"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = query_string;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),null,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"POST","/v1/chat/completions",payload,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_response_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.response_request_BANG_(self__.http_client,self__.config,"POST","/v1/embeddings",payload,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$request_logs_BANG_$arity$2 = (function (_,query_string){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"GET",(""+"/api/v1/request-logs"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = query_string;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),null,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$chat_completions_response_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.response_request_BANG_(self__.http_client,self__.config,"POST","/v1/chat/completions",payload,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$embeddings_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"POST","/v1/embeddings",payload,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$models_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"GET","/v1/models",null,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$health_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"GET","/health",null,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$dashboard_overview_BANG_$arity$2 = (function (_,query_string){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"GET",(""+"/api/v1/dashboard/overview"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = query_string;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),null,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.knoxx$backend$infra$clients$proxx$IProxxClient$websearch_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.proxx.json_request_BANG_(self__.http_client,self__.config,"POST","/api/tools/websearch",payload,(30000));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1084333773 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this29686,other29687){
var self__ = this;
var this29686__$1 = this;
return (((!((other29687 == null)))) && ((((this29686__$1.constructor === other29687.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29686__$1.config,other29687.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29686__$1.http_client,other29687.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this29686__$1.__extmap,other29687.__extmap)))))))));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(self__.config,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k29685){
var self__ = this;
var this__5476__auto____$1 = this;
var G__29723 = k29685;
var G__29723__$1 = (((G__29723 instanceof cljs.core.Keyword))?G__29723.fqn:null);
switch (G__29723__$1) {
case "config":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k29685);

}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__29684){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__29725 = cljs.core.keyword_identical_QMARK_;
var expr__29726 = k__5478__auto__;
if(cljs.core.truth_((pred__29725.cljs$core$IFn$_invoke$arity$2 ? pred__29725.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__29726) : pred__29725.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__29726)))){
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(G__29684,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__29725.cljs$core$IFn$_invoke$arity$2 ? pred__29725.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__29726) : pred__29725.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__29726)))){
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(self__.config,G__29684,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(self__.config,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__29684),null));
}
}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__29684){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(self__.config,self__.http_client,G__29684,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.cljs$lang$type = true);

(knoxx.backend.infra.clients.proxx.FetchProxxClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.clients.proxx/FetchProxxClient",null,(1),null));
}));

(knoxx.backend.infra.clients.proxx.FetchProxxClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.clients.proxx/FetchProxxClient");
}));

/**
 * Positional factory function for knoxx.backend.infra.clients.proxx/FetchProxxClient.
 */
knoxx.backend.infra.clients.proxx.__GT_FetchProxxClient = (function knoxx$backend$infra$clients$proxx$__GT_FetchProxxClient(config,http_client){
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(config,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.clients.proxx/FetchProxxClient, taking a map of keywords to field values.
 */
knoxx.backend.infra.clients.proxx.map__GT_FetchProxxClient = (function knoxx$backend$infra$clients$proxx$map__GT_FetchProxxClient(G__29691){
var extmap__5511__auto__ = (function (){var G__29738 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__29691,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__29691)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__29738);
} else {
return G__29738;
}
})();
return (new knoxx.backend.infra.clients.proxx.FetchProxxClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__29691),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__29691),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.clients.proxx.client = (function knoxx$backend$infra$clients$proxx$client(var_args){
var G__29744 = arguments.length;
switch (G__29744) {
case 1:
return knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.proxx.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__29745){
var map__29746 = p__29745;
var map__29746__$1 = cljs.core.__destructure_map(map__29746);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29746__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.infra.clients.proxx.__GT_FetchProxxClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.infra.clients.proxx.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.clients.proxx.js.map
