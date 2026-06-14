import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.infra.clients.openplanner');

/**
 * @interface
 */
knoxx.backend.infra.clients.openplanner.IOpenPlannerClient = function(){};

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$dyn_26824 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.enabled_QMARK_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.enabled_QMARK_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.enabled?",client);
}
}
});
/**
 * True when the client has enough configuration to call OpenPlanner.
 */
knoxx.backend.infra.clients.openplanner.enabled_QMARK_ = (function knoxx$backend$infra$clients$openplanner$enabled_QMARK_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$dyn_26824(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$health_BANG_$dyn_26825 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.health_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.health_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.health!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.health_BANG_ = (function knoxx$backend$infra$clients$openplanner$health_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$health_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$health_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$health_BANG_$dyn_26825(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$events_BANG_$dyn_26828 = (function (client,events){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.events_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,events) : m__5520__auto__.call(null,client,events));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.events_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,events) : m__5518__auto__.call(null,client,events));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.events!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.events_BANG_ = (function knoxx$backend$infra$clients$openplanner$events_BANG_(client,events){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$events_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$events_BANG_$arity$2(client,events);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$events_BANG_$dyn_26828(client,events);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$session_BANG_$dyn_26829 = (function (client,session_id,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,session_id,opts) : m__5520__auto__.call(null,client,session_id,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,session_id,opts) : m__5518__auto__.call(null,client,session_id,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.session!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.session_BANG_ = (function knoxx$backend$infra$clients$openplanner$session_BANG_(client,session_id,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$session_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$session_BANG_$arity$3(client,session_id,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$session_BANG_$dyn_26829(client,session_id,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$sessions_BANG_$dyn_26830 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.sessions_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.sessions_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.sessions!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.sessions_BANG_ = (function knoxx$backend$infra$clients$openplanner$sessions_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$sessions_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$sessions_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$sessions_BANG_$dyn_26830(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$vector_search_BANG_$dyn_26832 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.vector_search_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.vector_search_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.vector-search!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.vector_search_BANG_ = (function knoxx$backend$infra$clients$openplanner$vector_search_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$vector_search_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$vector_search_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$vector_search_BANG_$dyn_26832(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_memory_BANG_$dyn_26833 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.graph_memory_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.graph_memory_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.graph-memory!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.graph_memory_BANG_ = (function knoxx$backend$infra$clients$openplanner$graph_memory_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_memory_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_memory_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_memory_BANG_$dyn_26833(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_export_BANG_$dyn_26837 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.graph_export_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.graph_export_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.graph-export!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.graph_export_BANG_ = (function knoxx$backend$infra$clients$openplanner$graph_export_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_export_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_export_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_export_BANG_$dyn_26837(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$upsert_document_BANG_$dyn_26841 = (function (client,document){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.upsert_document_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,document) : m__5520__auto__.call(null,client,document));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.upsert_document_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,document) : m__5518__auto__.call(null,client,document));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.upsert-document!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.upsert_document_BANG_ = (function knoxx$backend$infra$clients$openplanner$upsert_document_BANG_(client,document){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$upsert_document_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$upsert_document_BANG_$arity$2(client,document);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$upsert_document_BANG_$dyn_26841(client,document);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$documents_stats_BANG_$dyn_26842 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.documents_stats_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.documents_stats_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.documents-stats!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.documents_stats_BANG_ = (function knoxx$backend$infra$clients$openplanner$documents_stats_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$documents_stats_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$documents_stats_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$documents_stats_BANG_$dyn_26842(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_monitoring_BANG_$dyn_26843 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.graph_monitoring_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.graph_monitoring_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.graph-monitoring!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.graph_monitoring_BANG_ = (function knoxx$backend$infra$clients$openplanner$graph_monitoring_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_monitoring_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_monitoring_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_monitoring_BANG_$dyn_26843(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_collections_BANG_$dyn_26845 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.mongo_collections_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.mongo_collections_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.mongo-collections!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.mongo_collections_BANG_ = (function knoxx$backend$infra$clients$openplanner$mongo_collections_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_collections_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_collections_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_collections_BANG_$dyn_26845(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_query_BANG_$dyn_26848 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.mongo_query_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.mongo_query_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.mongo-query!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.mongo_query_BANG_ = (function knoxx$backend$infra$clients$openplanner$mongo_query_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_query_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_query_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_query_BANG_$dyn_26848(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$build_semantic_edges_BANG_$dyn_26851 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.build_semantic_edges_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.build_semantic_edges_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.build-semantic-edges!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.build_semantic_edges_BANG_ = (function knoxx$backend$infra$clients$openplanner$build_semantic_edges_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$build_semantic_edges_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$build_semantic_edges_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$build_semantic_edges_BANG_$dyn_26851(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_labels_BANG_$dyn_26852 = (function (client,record_ids){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.record_labels_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,record_ids) : m__5520__auto__.call(null,client,record_ids));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.record_labels_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,record_ids) : m__5518__auto__.call(null,client,record_ids));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.record-labels!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.record_labels_BANG_ = (function knoxx$backend$infra$clients$openplanner$record_labels_BANG_(client,record_ids){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_labels_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_labels_BANG_$arity$2(client,record_ids);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_labels_BANG_$dyn_26852(client,record_ids);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_reaction_BANG_$dyn_26854 = (function (client,record_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.record_reaction_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,record_id,payload) : m__5520__auto__.call(null,client,record_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.record_reaction_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,record_id,payload) : m__5518__auto__.call(null,client,record_id,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.record-reaction!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.record_reaction_BANG_ = (function knoxx$backend$infra$clients$openplanner$record_reaction_BANG_(client,record_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_reaction_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_reaction_BANG_$arity$3(client,record_id,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_reaction_BANG_$dyn_26854(client,record_id,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segments_BANG_$dyn_26856 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_segments_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_segments_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-segments!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_segments_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_segments_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segments_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segments_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segments_BANG_$dyn_26856(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segment_BANG_$dyn_26861 = (function (client,segment_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_segment_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,segment_id) : m__5520__auto__.call(null,client,segment_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_segment_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,segment_id) : m__5518__auto__.call(null,client,segment_id));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-segment!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_segment_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_segment_BANG_(client,segment_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segment_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segment_BANG_$arity$2(client,segment_id);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segment_BANG_$dyn_26861(client,segment_id);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segment_BANG_$dyn_26866 = (function (client,segment){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_segment_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,segment) : m__5520__auto__.call(null,client,segment));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_segment_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,segment) : m__5518__auto__.call(null,client,segment));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.create-translation-segment!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.create_translation_segment_BANG_ = (function knoxx$backend$infra$clients$openplanner$create_translation_segment_BANG_(client,segment){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segment_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segment_BANG_$arity$2(client,segment);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segment_BANG_$dyn_26866(client,segment);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$label_translation_segment_BANG_$dyn_26873 = (function (client,segment_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.label_translation_segment_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,segment_id,payload) : m__5520__auto__.call(null,client,segment_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.label_translation_segment_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,segment_id,payload) : m__5518__auto__.call(null,client,segment_id,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.label-translation-segment!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.label_translation_segment_BANG_ = (function knoxx$backend$infra$clients$openplanner$label_translation_segment_BANG_(client,segment_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$label_translation_segment_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$label_translation_segment_BANG_$arity$3(client,segment_id,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$label_translation_segment_BANG_$dyn_26873(client,segment_id,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_manifest_BANG_$dyn_26882 = (function (client,project){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_export_manifest_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,project) : m__5520__auto__.call(null,client,project));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_export_manifest_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,project) : m__5518__auto__.call(null,client,project));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-export-manifest!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_export_manifest_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_export_manifest_BANG_(client,project){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_manifest_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_manifest_BANG_$arity$2(client,project);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_manifest_BANG_$dyn_26882(client,project);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_sft_BANG_$dyn_26887 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_export_sft_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_export_sft_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-export-sft!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_export_sft_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_export_sft_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_sft_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_sft_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_sft_BANG_$dyn_26887(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segments_batch_BANG_$dyn_26893 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_segments_batch_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_segments_batch_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.create-translation-segments-batch!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.create_translation_segments_batch_BANG_ = (function knoxx$backend$infra$clients$openplanner$create_translation_segments_batch_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segments_batch_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segments_batch_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segments_batch_BANG_$dyn_26893(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_documents_BANG_$dyn_26894 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_documents_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_documents_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-documents!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_documents_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_documents_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_documents_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_documents_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_documents_BANG_$dyn_26894(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_document_BANG_$dyn_26896 = (function (client,document_id,target_lang){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_document_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,document_id,target_lang) : m__5520__auto__.call(null,client,document_id,target_lang));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_document_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,document_id,target_lang) : m__5518__auto__.call(null,client,document_id,target_lang));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-document!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_document_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_document_BANG_(client,document_id,target_lang){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_document_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_document_BANG_$arity$3(client,document_id,target_lang);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_document_BANG_$dyn_26896(client,document_id,target_lang);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$review_translation_document_BANG_$dyn_26898 = (function (client,document_id,target_lang,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.review_translation_document_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,document_id,target_lang,payload) : m__5520__auto__.call(null,client,document_id,target_lang,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.review_translation_document_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,document_id,target_lang,payload) : m__5518__auto__.call(null,client,document_id,target_lang,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.review-translation-document!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.review_translation_document_BANG_ = (function knoxx$backend$infra$clients$openplanner$review_translation_document_BANG_(client,document_id,target_lang,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$review_translation_document_BANG_$arity$4 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$review_translation_document_BANG_$arity$4(client,document_id,target_lang,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$review_translation_document_BANG_$dyn_26898(client,document_id,target_lang,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_batch_BANG_$dyn_26900 = (function (client,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_batch_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5520__auto__.call(null,client,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.create_translation_batch_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,payload) : m__5518__auto__.call(null,client,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.create-translation-batch!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.create_translation_batch_BANG_ = (function knoxx$backend$infra$clients$openplanner$create_translation_batch_BANG_(client,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_batch_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_batch_BANG_$arity$2(client,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_batch_BANG_$dyn_26900(client,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batches_BANG_$dyn_26902 = (function (client,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_batches_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5520__auto__.call(null,client,opts));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_batches_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,opts) : m__5518__auto__.call(null,client,opts));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-batches!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_batches_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_batches_BANG_(client,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batches_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batches_BANG_$arity$2(client,opts);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batches_BANG_$dyn_26902(client,opts);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$next_translation_batch_BANG_$dyn_26906 = (function (client){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.next_translation_batch_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5520__auto__.call(null,client));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.next_translation_batch_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(client) : m__5518__auto__.call(null,client));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.next-translation-batch!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.next_translation_batch_BANG_ = (function knoxx$backend$infra$clients$openplanner$next_translation_batch_BANG_(client){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$next_translation_batch_BANG_$arity$1 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$next_translation_batch_BANG_$arity$1(client);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$next_translation_batch_BANG_$dyn_26906(client);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batch_BANG_$dyn_26908 = (function (client,batch_id){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.translation_batch_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,batch_id) : m__5520__auto__.call(null,client,batch_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.translation_batch_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,batch_id) : m__5518__auto__.call(null,client,batch_id));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.translation-batch!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.translation_batch_BANG_ = (function knoxx$backend$infra$clients$openplanner$translation_batch_BANG_(client,batch_id){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batch_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batch_BANG_$arity$2(client,batch_id);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batch_BANG_$dyn_26908(client,batch_id);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$update_translation_batch_status_BANG_$dyn_26909 = (function (client,batch_id,payload){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.update_translation_batch_status_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,batch_id,payload) : m__5520__auto__.call(null,client,batch_id,payload));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.update_translation_batch_status_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,batch_id,payload) : m__5518__auto__.call(null,client,batch_id,payload));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.update-translation-batch-status!",client);
}
}
});
knoxx.backend.infra.clients.openplanner.update_translation_batch_status_BANG_ = (function knoxx$backend$infra$clients$openplanner$update_translation_batch_status_BANG_(client,batch_id,payload){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$update_translation_batch_status_BANG_$arity$3 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$update_translation_batch_status_BANG_$arity$3(client,batch_id,payload);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$update_translation_batch_status_BANG_$dyn_26909(client,batch_id,payload);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$v1_json_BANG_$dyn_26910 = (function (client,method,path,body){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.v1_json_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$4(client,method,path,body) : m__5520__auto__.call(null,client,method,path,body));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.v1_json_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$4 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$4(client,method,path,body) : m__5518__auto__.call(null,client,method,path,body));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.v1-json!",client);
}
}
});
/**
 * Compatibility for explicit admin/data proxy routes; prefer named methods.
 */
knoxx.backend.infra.clients.openplanner.v1_json_BANG_ = (function knoxx$backend$infra$clients$openplanner$v1_json_BANG_(client,method,path,body){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$v1_json_BANG_$arity$4 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$v1_json_BANG_$arity$4(client,method,path,body);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$v1_json_BANG_$dyn_26910(client,method,path,body);
}
});

var knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$forward_v1_BANG_$dyn_26912 = (function (client,request){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.infra.clients.openplanner.forward_v1_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5520__auto__.call(null,client,request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.clients.openplanner.forward_v1_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,request) : m__5518__auto__.call(null,client,request));
} else {
throw cljs.core.missing_protocol("IOpenPlannerClient.forward-v1!",client);
}
}
});
/**
 * Proxy compatibility for the frontend /api/openplanner/v1/* route.
 */
knoxx.backend.infra.clients.openplanner.forward_v1_BANG_ = (function knoxx$backend$infra$clients$openplanner$forward_v1_BANG_(client,request){
if((((!((client == null)))) && ((!((client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$forward_v1_BANG_$arity$2 == null)))))){
return client.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$forward_v1_BANG_$arity$2(client,request);
} else {
return knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$forward_v1_BANG_$dyn_26912(client,request);
}
});

knoxx.backend.infra.clients.openplanner.trim_trailing_slashes = (function knoxx$backend$infra$clients$openplanner$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.infra.clients.openplanner.headers_for = (function knoxx$backend$infra$clients$openplanner$headers_for(config){
return new cljs.core.PersistentArrayMap(null, 3, ["Content-Type","application/json","Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"openplanner-api-key","openplanner-api-key",5324020).cljs$core$IFn$_invoke$arity$1(config))),"X-Tenant-ID",(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "knoxx-session";
}
})()], null);
});
knoxx.backend.infra.clients.openplanner.configured_QMARK_ = (function knoxx$backend$infra$clients$openplanner$configured_QMARK_(config){
return (((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103).cljs$core$IFn$_invoke$arity$1(config))))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"openplanner-api-key","openplanner-api-key",5324020).cljs$core$IFn$_invoke$arity$1(config))))));
});
knoxx.backend.infra.clients.openplanner.encode = (function knoxx$backend$infra$clients$openplanner$encode(value){
return encodeURIComponent((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)));
});
knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_ = (function knoxx$backend$infra$clients$openplanner$present_query_value_QMARK_(value){
return (!((value == null)));
});
knoxx.backend.infra.clients.openplanner.query_key = (function knoxx$backend$infra$clients$openplanner$query_key(k){
if((k instanceof cljs.core.Keyword)){
return cljs.core.name(k);
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(k));
}
});
knoxx.backend.infra.clients.openplanner.query_string = (function knoxx$backend$infra$clients$openplanner$query_string(params){
var search = (new URLSearchParams());
var seq__26491_26920 = cljs.core.seq((function (){var or__5162__auto__ = params;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var chunk__26492_26921 = null;
var count__26493_26922 = (0);
var i__26494_26923 = (0);
while(true){
if((i__26494_26923 < count__26493_26922)){
var vec__26575_26924 = chunk__26492_26921.cljs$core$IIndexed$_nth$arity$2(null,i__26494_26923);
var k_26925 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26575_26924,(0),null);
var value_26926 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26575_26924,(1),null);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(value_26926)){
if(cljs.core.sequential_QMARK_(value_26926)){
var seq__26580_26929 = cljs.core.seq(value_26926);
var chunk__26581_26930 = null;
var count__26582_26931 = (0);
var i__26583_26932 = (0);
while(true){
if((i__26583_26932 < count__26582_26931)){
var item_26933 = chunk__26581_26930.cljs$core$IIndexed$_nth$arity$2(null,i__26583_26932);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(item_26933)){
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26925),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_26933)));
} else {
}


var G__26935 = seq__26580_26929;
var G__26936 = chunk__26581_26930;
var G__26937 = count__26582_26931;
var G__26938 = (i__26583_26932 + (1));
seq__26580_26929 = G__26935;
chunk__26581_26930 = G__26936;
count__26582_26931 = G__26937;
i__26583_26932 = G__26938;
continue;
} else {
var temp__5825__auto___26939 = cljs.core.seq(seq__26580_26929);
if(temp__5825__auto___26939){
var seq__26580_26940__$1 = temp__5825__auto___26939;
if(cljs.core.chunked_seq_QMARK_(seq__26580_26940__$1)){
var c__5694__auto___26941 = cljs.core.chunk_first(seq__26580_26940__$1);
var G__26942 = cljs.core.chunk_rest(seq__26580_26940__$1);
var G__26943 = c__5694__auto___26941;
var G__26944 = cljs.core.count(c__5694__auto___26941);
var G__26945 = (0);
seq__26580_26929 = G__26942;
chunk__26581_26930 = G__26943;
count__26582_26931 = G__26944;
i__26583_26932 = G__26945;
continue;
} else {
var item_26946 = cljs.core.first(seq__26580_26940__$1);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(item_26946)){
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26925),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_26946)));
} else {
}


var G__26947 = cljs.core.next(seq__26580_26940__$1);
var G__26948 = null;
var G__26949 = (0);
var G__26950 = (0);
seq__26580_26929 = G__26947;
chunk__26581_26930 = G__26948;
count__26582_26931 = G__26949;
i__26583_26932 = G__26950;
continue;
}
} else {
}
}
break;
}
} else {
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26925),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_26926)));
}
} else {
}


var G__26951 = seq__26491_26920;
var G__26952 = chunk__26492_26921;
var G__26953 = count__26493_26922;
var G__26954 = (i__26494_26923 + (1));
seq__26491_26920 = G__26951;
chunk__26492_26921 = G__26952;
count__26493_26922 = G__26953;
i__26494_26923 = G__26954;
continue;
} else {
var temp__5825__auto___26955 = cljs.core.seq(seq__26491_26920);
if(temp__5825__auto___26955){
var seq__26491_26956__$1 = temp__5825__auto___26955;
if(cljs.core.chunked_seq_QMARK_(seq__26491_26956__$1)){
var c__5694__auto___26957 = cljs.core.chunk_first(seq__26491_26956__$1);
var G__26958 = cljs.core.chunk_rest(seq__26491_26956__$1);
var G__26959 = c__5694__auto___26957;
var G__26960 = cljs.core.count(c__5694__auto___26957);
var G__26961 = (0);
seq__26491_26920 = G__26958;
chunk__26492_26921 = G__26959;
count__26493_26922 = G__26960;
i__26494_26923 = G__26961;
continue;
} else {
var vec__26599_26962 = cljs.core.first(seq__26491_26956__$1);
var k_26963 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26599_26962,(0),null);
var value_26964 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26599_26962,(1),null);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(value_26964)){
if(cljs.core.sequential_QMARK_(value_26964)){
var seq__26603_26965 = cljs.core.seq(value_26964);
var chunk__26604_26966 = null;
var count__26605_26967 = (0);
var i__26606_26968 = (0);
while(true){
if((i__26606_26968 < count__26605_26967)){
var item_26969 = chunk__26604_26966.cljs$core$IIndexed$_nth$arity$2(null,i__26606_26968);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(item_26969)){
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26963),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_26969)));
} else {
}


var G__26971 = seq__26603_26965;
var G__26972 = chunk__26604_26966;
var G__26973 = count__26605_26967;
var G__26974 = (i__26606_26968 + (1));
seq__26603_26965 = G__26971;
chunk__26604_26966 = G__26972;
count__26605_26967 = G__26973;
i__26606_26968 = G__26974;
continue;
} else {
var temp__5825__auto___26977__$1 = cljs.core.seq(seq__26603_26965);
if(temp__5825__auto___26977__$1){
var seq__26603_26980__$1 = temp__5825__auto___26977__$1;
if(cljs.core.chunked_seq_QMARK_(seq__26603_26980__$1)){
var c__5694__auto___26982 = cljs.core.chunk_first(seq__26603_26980__$1);
var G__26983 = cljs.core.chunk_rest(seq__26603_26980__$1);
var G__26984 = c__5694__auto___26982;
var G__26985 = cljs.core.count(c__5694__auto___26982);
var G__26986 = (0);
seq__26603_26965 = G__26983;
chunk__26604_26966 = G__26984;
count__26605_26967 = G__26985;
i__26606_26968 = G__26986;
continue;
} else {
var item_26989 = cljs.core.first(seq__26603_26980__$1);
if(knoxx.backend.infra.clients.openplanner.present_query_value_QMARK_(item_26989)){
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26963),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(item_26989)));
} else {
}


var G__26990 = cljs.core.next(seq__26603_26980__$1);
var G__26991 = null;
var G__26992 = (0);
var G__26993 = (0);
seq__26603_26965 = G__26990;
chunk__26604_26966 = G__26991;
count__26605_26967 = G__26992;
i__26606_26968 = G__26993;
continue;
}
} else {
}
}
break;
}
} else {
search.append(knoxx.backend.infra.clients.openplanner.query_key(k_26963),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value_26964)));
}
} else {
}


var G__26994 = cljs.core.next(seq__26491_26956__$1);
var G__26995 = null;
var G__26996 = (0);
var G__26997 = (0);
seq__26491_26920 = G__26994;
chunk__26492_26921 = G__26995;
count__26493_26922 = G__26996;
i__26494_26923 = G__26997;
continue;
}
} else {
}
}
break;
}

var encoded = search.toString();
if(clojure.string.blank_QMARK_(encoded)){
return "";
} else {
return (""+"?"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encoded));
}
});
knoxx.backend.infra.clients.openplanner.body_opts = (function knoxx$backend$infra$clients$openplanner$body_opts(method,headers,body){
var G__26620 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"headers","headers",-835030129),headers], null);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26620,new cljs.core.Keyword(null,"json","json",1279968570),body);
} else {
return G__26620;
}
});
knoxx.backend.infra.clients.openplanner.ensure_enabled_BANG_ = (function knoxx$backend$infra$clients$openplanner$ensure_enabled_BANG_(client){
if(cljs.core.truth_(knoxx.backend.infra.clients.openplanner.enabled_QMARK_(client))){
return null;
} else {
throw (new Error("OpenPlanner is not configured"));
}
});
knoxx.backend.infra.clients.openplanner.ensure_configured_BANG_ = (function knoxx$backend$infra$clients$openplanner$ensure_configured_BANG_(config){
if(knoxx.backend.infra.clients.openplanner.configured_QMARK_(config)){
return null;
} else {
throw (new Error("OpenPlanner is not configured"));
}
});
knoxx.backend.infra.clients.openplanner.error_message = (function knoxx$backend$infra$clients$openplanner$error_message(err){
var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
});
knoxx.backend.infra.clients.openplanner.log_openplanner_down_BANG_ = (function knoxx$backend$infra$clients$openplanner$log_openplanner_down_BANG_(label,err){
if(cljs.core.truth_((err["__knoxxOpenPlannerDownLogged"]))){
return null;
} else {
(err["__knoxxOpenPlannerDownLogged"] = true);

return console.error("openplanner is down",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+": "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.error_message(err))));
}
});
knoxx.backend.infra.clients.openplanner.openplanner_down_error = (function knoxx$backend$infra$clients$openplanner$openplanner_down_error(label,message){
var err = (new Error(message));
knoxx.backend.infra.clients.openplanner.log_openplanner_down_BANG_(label,err);

return err;
});
knoxx.backend.infra.clients.openplanner.checked_body_BANG_ = (function knoxx$backend$infra$clients$openplanner$checked_body_BANG_(resp,label){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
} else {
throw knoxx.backend.infra.clients.openplanner.openplanner_down_error(label,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)], 0)))));
}
});
knoxx.backend.infra.clients.openplanner.checked_text_BANG_ = (function knoxx$backend$infra$clients$openplanner$checked_text_BANG_(resp,label){
if(cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))){
return new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
} else {
throw knoxx.backend.infra.clients.openplanner.openplanner_down_error(label,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" failed ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp))+"): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp))));
}
});
knoxx.backend.infra.clients.openplanner.request_json_BANG_ = (function knoxx$backend$infra$clients$openplanner$request_json_BANG_(http_client,config,timeout_ms,method,suffix,body){
knoxx.backend.infra.clients.openplanner.ensure_configured_BANG_(config);

return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.trim_trailing_slashes(new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103).cljs$core$IFn$_invoke$arity$1(config)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix)),new cljs.core.Keyword(null,"opts","opts",155075701),knoxx.backend.infra.clients.openplanner.body_opts(method,knoxx.backend.infra.clients.openplanner.headers_for(config),body),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.infra.clients.openplanner.checked_body_BANG_(resp,"OpenPlanner request"));
}));
})),(function (err){
knoxx.backend.infra.clients.openplanner.log_openplanner_down_BANG_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(method)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix)),err);

throw err;
}));
});
knoxx.backend.infra.clients.openplanner.request_response_BANG_ = (function knoxx$backend$infra$clients$openplanner$request_response_BANG_(http_client,config,timeout_ms,p__26669){
var map__26670 = p__26669;
var map__26670__$1 = cljs.core.__destructure_map(map__26670);
var method = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"method","method",55703592));
var path = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"path","path",-188191168));
var query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"query-string","query-string",-1018845061));
var body = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"body","body",-2049205669));
var headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"headers","headers",-835030129));
knoxx.backend.infra.clients.openplanner.ensure_configured_BANG_(config);

var method__$1 = (function (){var or__5162__auto__ = method;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "GET";
}
})();
var suffix = (""+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/^\/+/,""))+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = query_string;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.fetch.response_BANG_((function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.trim_trailing_slashes(new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103).cljs$core$IFn$_invoke$arity$1(config)))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix)),new cljs.core.Keyword(null,"opts","opts",155075701),(function (){var G__26678 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),method__$1,new cljs.core.Keyword(null,"headers","headers",-835030129),cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.clients.openplanner.headers_for(config),(function (){var or__5162__auto__ = headers;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], 0))], null);
if((!((body == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26678,new cljs.core.Keyword(null,"body","body",-2049205669),body);
} else {
return G__26678;
}
})(),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null)),(function (err){
knoxx.backend.infra.clients.openplanner.log_openplanner_down_BANG_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(method__$1)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(suffix)),err);

throw err;
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
 * @implements {knoxx.backend.infra.clients.openplanner.IOpenPlannerClient}
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
knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient = (function (config,http_client,timeout_ms,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.timeout_ms = timeout_ms;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26684,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26730 = k26684;
var G__26730__$1 = (((G__26730 instanceof cljs.core.Keyword))?G__26730.fqn:null);
switch (G__26730__$1) {
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
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26684,else__5472__auto__);

}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26735){
var vec__26736 = p__26735;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26736,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26736,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26683){
var self__ = this;
var G__26683__$1 = this;
return (new cljs.core.RecordIter((0),G__26683__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-397249015 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26685,other26686){
var self__ = this;
var this26685__$1 = this;
return (((!((other26686 == null)))) && ((((this26685__$1.constructor === other26686.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26685__$1.config,other26686.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26685__$1.http_client,other26686.http_client)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26685__$1.timeout_ms,other26686.timeout_ms)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26685__$1.__extmap,other26686.__extmap)))))))))));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26684){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26760 = k26684;
var G__26760__$1 = (((G__26760 instanceof cljs.core.Keyword))?G__26760.fqn:null);
switch (G__26760__$1) {
case "config":
case "http-client":
case "timeout-ms":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26684);

}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26683){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26762 = cljs.core.keyword_identical_QMARK_;
var expr__26763 = k__5478__auto__;
if(cljs.core.truth_((pred__26762.cljs$core$IFn$_invoke$arity$2 ? pred__26762.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__26763) : pred__26762.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__26763)))){
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(G__26683,self__.http_client,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26762.cljs$core$IFn$_invoke$arity$2 ? pred__26762.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__26763) : pred__26762.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__26763)))){
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,G__26683,self__.timeout_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26762.cljs$core$IFn$_invoke$arity$2 ? pred__26762.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__26763) : pred__26762.call(null,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),expr__26763)))){
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,self__.http_client,G__26683,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,self__.http_client,self__.timeout_ms,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26683),null));
}
}
}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),self__.timeout_ms,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$sessions_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/sessions"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batch_BANG_$arity$2 = (function (_,batch_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/batches/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(batch_id))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_documents_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/documents"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_sft_BANG_$arity$2 = (function (client,opts){
var self__ = this;
var client__$1 = this;
knoxx.backend.infra.clients.openplanner.ensure_enabled_BANG_(client__$1);

return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.text_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.trim_trailing_slashes(new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103).cljs$core$IFn$_invoke$arity$1(self__.config)))+"/v1/translations/export/sft"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.openplanner.headers_for(self__.config)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null))),(function (resp){
return promesa.protocols._promise(knoxx.backend.infra.clients.openplanner.checked_text_BANG_(resp,"OpenPlanner translation SFT export"));
}));
})),(function (err){
knoxx.backend.infra.clients.openplanner.log_openplanner_down_BANG_("GET /v1/translations/export/sft",err);

throw err;
}));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segment_BANG_$arity$2 = (function (_,segment_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/segments/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(segment_id))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$update_translation_batch_status_BANG_$arity$3 = (function (_,batch_id,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST",(""+"/v1/translations/batches/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(batch_id))+"/status"),payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$forward_v1_BANG_$arity$2 = (function (_,request){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_response_BANG_(self__.http_client,self__.config,self__.timeout_ms,request);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_query_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/mongo/query",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_export_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/graph/export"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_batch_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/translations/batches",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$label_translation_segment_BANG_$arity$3 = (function (_,segment_id,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST",(""+"/v1/translations/segments/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(segment_id))+"/labels"),payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_document_BANG_$arity$3 = (function (_,document_id,target_lang){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/documents/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(document_id))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(target_lang))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_reaction_BANG_$arity$3 = (function (_,record_id,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST",(""+"/v1/labels/records/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(record_id))+"/reaction"),payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$record_labels_BANG_$arity$2 = (function (_,record_ids){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/labels/records/lookup",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ids","ids",-998535796),cljs.core.vec(record_ids)], null));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$review_translation_document_BANG_$arity$4 = (function (_,document_id,target_lang,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST",(""+"/v1/translations/documents/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(document_id))+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(target_lang))+"/review"),payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segments_batch_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/translations/segments/batch",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$next_translation_batch_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET","/v1/translations/batches/next",null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$session_BANG_$arity$3 = (function (_,session_id,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/sessions/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.encode(session_id))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$v1_json_BANG_$arity$4 = (function (_,method,path,body){
var self__ = this;
var ___$1 = this;
var suffix = (""+"/v1/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = path;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/^\/+/,"")));
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,method,suffix,body);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$mongo_collections_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET","/v1/mongo/collections",null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_monitoring_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET","/v1/graph/monitoring",null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_export_manifest_BANG_$arity$2 = (function (_,project){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/export/manifest"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"project","project",1124394579),project], null)))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$health_BANG_$arity$1 = (function (client){
var self__ = this;
var client__$1 = this;
if(cljs.core.not(client__$1.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$arity$1(null))){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"status","status",-1997798413),(503),new cljs.core.Keyword(null,"body","body",-2049205669),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"OpenPlanner is not configured"], null)], null));
} else {
return knoxx.backend.extern.fetch.json_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.trim_trailing_slashes(new cljs.core.Keyword(null,"openplanner-base-url","openplanner-base-url",2028278103).cljs$core$IFn$_invoke$arity$1(self__.config)))+"/v1/health"),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"method","method",55703592),"GET",new cljs.core.Keyword(null,"headers","headers",-835030129),knoxx.backend.infra.clients.openplanner.headers_for(self__.config)], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(function (){var or__5162__auto__ = self__.timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})()], null));
}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_batches_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/batches"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$enabled_QMARK_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.configured_QMARK_(self__.config);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$translation_segments_BANG_$arity$2 = (function (_,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET",(""+"/v1/translations/segments"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.clients.openplanner.query_string(opts))),null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$vector_search_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/search/vector",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$upsert_document_BANG_$arity$2 = (function (_,document){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/documents",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"document","document",-1329188687),document], null));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$documents_stats_BANG_$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"GET","/v1/documents/stats",null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$graph_memory_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/graph/memory",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$events_BANG_$arity$2 = (function (_,events){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/events",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"events","events",1792552201),events], null));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$build_semantic_edges_BANG_$arity$2 = (function (_,payload){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/jobs/build-semantic-edges",payload);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.knoxx$backend$infra$clients$openplanner$IOpenPlannerClient$create_translation_segment_BANG_$arity$2 = (function (_,segment){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.request_json_BANG_(self__.http_client,self__.config,self__.timeout_ms,"POST","/v1/translations/segments",segment);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26683){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(self__.config,self__.http_client,self__.timeout_ms,G__26683,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null),new cljs.core.Symbol(null,"timeout-ms","timeout-ms",-1900214363,null)], null);
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.cljs$lang$type = true);

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.clients.openplanner/FetchOpenPlannerClient",null,(1),null));
}));

(knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.clients.openplanner/FetchOpenPlannerClient");
}));

/**
 * Positional factory function for knoxx.backend.infra.clients.openplanner/FetchOpenPlannerClient.
 */
knoxx.backend.infra.clients.openplanner.__GT_FetchOpenPlannerClient = (function knoxx$backend$infra$clients$openplanner$__GT_FetchOpenPlannerClient(config,http_client,timeout_ms){
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(config,http_client,timeout_ms,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.clients.openplanner/FetchOpenPlannerClient, taking a map of keywords to field values.
 */
knoxx.backend.infra.clients.openplanner.map__GT_FetchOpenPlannerClient = (function knoxx$backend$infra$clients$openplanner$map__GT_FetchOpenPlannerClient(G__26708){
var extmap__5511__auto__ = (function (){var G__26799 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__26708,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406)], 0));
if(cljs.core.record_QMARK_(G__26708)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26799);
} else {
return G__26799;
}
})();
return (new knoxx.backend.infra.clients.openplanner.FetchOpenPlannerClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__26708),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__26708),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406).cljs$core$IFn$_invoke$arity$1(G__26708),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.clients.openplanner.client = (function knoxx$backend$infra$clients$openplanner$client(var_args){
var G__26803 = arguments.length;
switch (G__26803) {
case 1:
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__26808){
var map__26809 = p__26808;
var map__26809__$1 = cljs.core.__destructure_map(map__26809);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26809__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
var timeout_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26809__$1,new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406));
return knoxx.backend.infra.clients.openplanner.__GT_FetchOpenPlannerClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),(function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (60000);
}
})());
}));

(knoxx.backend.infra.clients.openplanner.client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.clients.openplanner.js.map
