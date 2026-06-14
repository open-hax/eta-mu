import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.infra.document_state.js";
import "./knoxx.backend.domain.time.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.routes.documents');
knoxx.backend.infra.routes.documents.path_is_absolute_QMARK_ = (function knoxx$backend$infra$routes$documents$path_is_absolute_QMARK_(node_path,value){
return node_path.isAbsolute(value);
});
knoxx.backend.infra.routes.documents.path_relative = (function knoxx$backend$infra$routes$documents$path_relative(node_path,from,to){
return node_path.relative(from,to);
});
knoxx.backend.infra.routes.documents.fs_rm_BANG_ = (function knoxx$backend$infra$routes$documents$fs_rm_BANG_(node_fs,path,opts){
return node_fs.rm(path,opts);
});
knoxx.backend.infra.routes.documents.fs_write_buffer_BANG_ = (function knoxx$backend$infra$routes$documents$fs_write_buffer_BANG_(node_fs,path,content){
return node_fs.writeFile(path,content);
});
knoxx.backend.infra.routes.documents.fs_read_file_BANG_ = (function knoxx$backend$infra$routes$documents$fs_read_file_BANG_(node_fs,path,encoding){
return node_fs.readFile(path,encoding);
});
knoxx.backend.infra.routes.documents.process_file_part = (async function knoxx$backend$infra$routes$documents$process_file_part(docs_path,part){
var safe_name = knoxx.backend.infra.document_state.sanitize_upload_name((await (async function (){var or__5162__auto__ = (part["filename"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "upload.bin";
}
})()));
var abs_path = shadow.esm.esm_import$node_path.join(docs_path,safe_name);
var rel_path = knoxx.backend.infra.document_state.normalize_relative_path(knoxx.backend.infra.routes.documents.path_relative(shadow.esm.esm_import$node_path,docs_path,abs_path));
var buf = (await (new Response((part["file"]))).arrayBuffer());
knoxx.backend.infra.routes.documents.fs_write_buffer_BANG_(shadow.esm.esm_import$node_fs$promises,abs_path,Buffer.from(buf));

return rel_path;
});
knoxx.backend.infra.routes.documents.api_documents_list_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_list_BANG_(app,runtime,config,deps){
var map__29222 = deps;
var map__29222__$1 = cljs.core.__destructure_map(map__29222);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29222__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29223 = app;
var G__29224 = "GET";
var G__29225 = "/api/documents";
var G__29226 = (function (request,reply){
var G__29227 = runtime;
var G__29228 = request;
var G__29229 = reply;
var G__29230 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.read") : ensure_permission_BANG_.call(null,ctx,"datalake.read"));
} else {
}

var resp = (await knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),resp) : json_response_BANG_.call(null,reply,(200),resp));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29227,G__29228,G__29229,G__29230) : with_request_context_BANG_.call(null,G__29227,G__29228,G__29229,G__29230));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29223,G__29224,G__29225,G__29226) : route_BANG_.call(null,G__29223,G__29224,G__29225,G__29226));
});
knoxx.backend.infra.routes.documents.api_documents_content_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_content_BANG_(app,runtime,config,deps){
var map__29235 = deps;
var map__29235__$1 = cljs.core.__destructure_map(map__29235);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29235__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29238 = app;
var G__29239 = "GET";
var G__29240 = "/api/documents/content/*";
var G__29241 = (function (request,reply){
var G__29243 = runtime;
var G__29244 = request;
var G__29245 = reply;
var G__29246 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.read") : ensure_permission_BANG_.call(null,ctx,"datalake.read"));
} else {
}

var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var rel_path = knoxx.backend.infra.document_state.normalize_relative_path((request["params"]["*"]));
var abs_path = shadow.esm.esm_import$node_path.resolve(new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile),rel_path);
var rel_to_root = shadow.esm.esm_import$node_path.relative(new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile),abs_path);
if(cljs.core.truth_((await (async function (){var or__5162__auto__ = clojure.string.starts_with_QMARK_(rel_to_root,"..");
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.infra.routes.documents.path_is_absolute_QMARK_(shadow.esm.esm_import$node_path,rel_to_root);
}
})()))){
var G__29248 = reply;
var G__29249 = (403);
var G__29250 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Path escapes active docs root"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29248,G__29249,G__29250) : json_response_BANG_.call(null,G__29248,G__29249,G__29250));
} else {
var content = (await knoxx.backend.infra.routes.documents.fs_read_file_BANG_(shadow.esm.esm_import$node_fs$promises,abs_path,"utf8"));
var G__29252 = reply;
var G__29253 = (200);
var G__29254 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"path","path",-188191168),rel_path,new cljs.core.Keyword(null,"content","content",15833224),content], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29252,G__29253,G__29254) : json_response_BANG_.call(null,G__29252,G__29253,G__29254));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29243,G__29244,G__29245,G__29246) : with_request_context_BANG_.call(null,G__29243,G__29244,G__29245,G__29246));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29238,G__29239,G__29240,G__29241) : route_BANG_.call(null,G__29238,G__29239,G__29240,G__29241));
});
knoxx.backend.infra.routes.documents.api_documents_delete_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_delete_BANG_(app,runtime,config,deps){
var map__29257 = deps;
var map__29257__$1 = cljs.core.__destructure_map(map__29257);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var openplanner_graph_export_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"openplanner-graph-export!","openplanner-graph-export!",-1726254887));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29257__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29258 = app;
var G__29259 = "DELETE";
var G__29260 = "/api/documents/*";
var G__29261 = (function (request,reply){
var G__29262 = runtime;
var G__29263 = request;
var G__29264 = reply;
var G__29265 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.write") : ensure_permission_BANG_.call(null,ctx,"datalake.write"));
} else {
}

var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var rel_path = knoxx.backend.infra.document_state.normalize_relative_path((request["params"]["*"]));
var abs_path = shadow.esm.esm_import$node_path.resolve(new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile),rel_path);
var rel_to_root = knoxx.backend.infra.routes.documents.path_relative(shadow.esm.esm_import$node_path,new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile),abs_path);
var db_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(profile);
if(cljs.core.truth_((await (async function (){var or__5162__auto__ = clojure.string.starts_with_QMARK_(rel_to_root,"..");
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.infra.routes.documents.path_is_absolute_QMARK_(shadow.esm.esm_import$node_path,rel_to_root);
}
})()))){
var G__29268 = reply;
var G__29269 = (403);
var G__29270 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Path escapes active docs root"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29268,G__29269,G__29270) : json_response_BANG_.call(null,G__29268,G__29269,G__29270));
} else {
try{(await knoxx.backend.infra.routes.documents.fs_rm_BANG_(shadow.esm.esm_import$node_fs$promises,abs_path,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"force","force",781957286),true], null))));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.document_state.database_state_STAR_,cljs.core.update_in,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"indexed","indexed",390758624)], null),cljs.core.dissoc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([rel_path], 0));

var G__29276 = reply;
var G__29277 = (200);
var G__29278 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),rel_path], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29276,G__29277,G__29278) : json_response_BANG_.call(null,G__29276,G__29277,G__29278));
}catch (e29271){var err = e29271;
var G__29272 = reply;
var G__29273 = (500);
var G__29274 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Delete failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29272,G__29273,G__29274) : json_response_BANG_.call(null,G__29272,G__29273,G__29274));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29262,G__29263,G__29264,G__29265) : with_request_context_BANG_.call(null,G__29262,G__29263,G__29264,G__29265));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29258,G__29259,G__29260,G__29261) : route_BANG_.call(null,G__29258,G__29259,G__29260,G__29261));
});
knoxx.backend.infra.routes.documents.api_documents_ingest_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingest_BANG_(app,runtime,config,deps){
var map__29280 = deps;
var map__29280__$1 = cljs.core.__destructure_map(map__29280);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29280__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29281 = app;
var G__29282 = "POST";
var G__29283 = "/api/documents/ingest";
var G__29284 = (function (request,reply){
var G__29285 = runtime;
var G__29286 = request;
var G__29287 = reply;
var G__29288 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.ingest") : ensure_permission_BANG_.call(null,ctx,"datalake.ingest"));
} else {
}

var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
try{var resp = (await knoxx.backend.infra.document_state.start_document_ingestion_BANG_(runtime,config,profile,body));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),resp) : json_response_BANG_.call(null,reply,(200),resp));
}catch (e29290){var err = e29290;
var G__29291 = reply;
var G__29292 = (500);
var G__29293 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Ingestion failed to start: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29291,G__29292,G__29293) : json_response_BANG_.call(null,G__29291,G__29292,G__29293));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29285,G__29286,G__29287,G__29288) : with_request_context_BANG_.call(null,G__29285,G__29286,G__29287,G__29288));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29281,G__29282,G__29283,G__29284) : route_BANG_.call(null,G__29281,G__29282,G__29283,G__29284));
});
knoxx.backend.infra.routes.documents.api_documents_ingest_priority_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingest_priority_BANG_(app,runtime,config,deps){
var map__29295 = deps;
var map__29295__$1 = cljs.core.__destructure_map(map__29295);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29295__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29296 = app;
var G__29297 = "POST";
var G__29298 = "/api/documents/ingest/priority";
var G__29299 = (function (request,reply){
var G__29300 = runtime;
var G__29301 = request;
var G__29302 = reply;
var G__29303 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.ingest") : ensure_permission_BANG_.call(null,ctx,"datalake.ingest"));
} else {
}

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var paths = cljs.core.vec((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"paths","paths",-1807389588).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"files","files",-472457450).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
})()));
var project = new cljs.core.Keyword(null,"project","project",1124394579).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.empty_QMARK_(paths)){
var G__29304 = reply;
var G__29305 = (400);
var G__29306 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"paths (array of workspace-relative file paths) is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29304,G__29305,G__29306) : json_response_BANG_.call(null,G__29304,G__29305,G__29306));
} else {
try{var resp = (await knoxx.backend.infra.document_state.priority_ingest_workspace_files_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"paths","paths",-1807389588),paths,new cljs.core.Keyword(null,"project","project",1124394579),project], null)));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),resp) : json_response_BANG_.call(null,reply,(200),resp));
}catch (e29307){var err = e29307;
var G__29308 = reply;
var G__29309 = (500);
var G__29310 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Priority ingestion failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29308,G__29309,G__29310) : json_response_BANG_.call(null,G__29308,G__29309,G__29310));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29300,G__29301,G__29302,G__29303) : with_request_context_BANG_.call(null,G__29300,G__29301,G__29302,G__29303));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29296,G__29297,G__29298,G__29299) : route_BANG_.call(null,G__29296,G__29297,G__29298,G__29299));
});
knoxx.backend.infra.routes.documents.api_documents_ingest_restart_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingest_restart_BANG_(app,runtime,config,deps){
var map__29312 = deps;
var map__29312__$1 = cljs.core.__destructure_map(map__29312);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29312__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29313 = app;
var G__29314 = "POST";
var G__29315 = "/api/documents/ingest/restart";
var G__29316 = (function (request,reply){
var G__29317 = runtime;
var G__29318 = request;
var G__29319 = reply;
var G__29320 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.ingest") : ensure_permission_BANG_.call(null,ctx,"datalake.ingest"));
} else {
}

var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var db_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(profile);
var last_request = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,ctx),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"lastRequest","lastRequest",-738015741)], null));
if((last_request == null)){
var G__29321 = reply;
var G__29322 = (400);
var G__29323 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"No active ingestion to restart",new cljs.core.Keyword(null,"resumed","resumed",897761340),false], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29321,G__29322,G__29323) : json_response_BANG_.call(null,G__29321,G__29322,G__29323));
} else {
try{var resp = (await knoxx.backend.infra.document_state.start_document_ingestion_BANG_(runtime,config,profile,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"full","full",436801220),new cljs.core.Keyword(null,"full","full",436801220).cljs$core$IFn$_invoke$arity$1(last_request),new cljs.core.Keyword(null,"selected-files","selected-files",1045525459),new cljs.core.Keyword(null,"selectedFiles","selectedFiles",-2058493306).cljs$core$IFn$_invoke$arity$1(last_request)], null)));
var G__29328 = reply;
var G__29329 = (200);
var G__29330 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(resp,new cljs.core.Keyword(null,"resumed","resumed",897761340),true);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29328,G__29329,G__29330) : json_response_BANG_.call(null,G__29328,G__29329,G__29330));
}catch (e29324){var err = e29324;
var G__29325 = reply;
var G__29326 = (500);
var G__29327 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Restart failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err)),new cljs.core.Keyword(null,"resumed","resumed",897761340),false], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29325,G__29326,G__29327) : json_response_BANG_.call(null,G__29325,G__29326,G__29327));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29317,G__29318,G__29319,G__29320) : with_request_context_BANG_.call(null,G__29317,G__29318,G__29319,G__29320));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29313,G__29314,G__29315,G__29316) : route_BANG_.call(null,G__29313,G__29314,G__29315,G__29316));
});
knoxx.backend.infra.routes.documents.api_documents_ingestion_status_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingestion_status_BANG_(app,runtime,config,deps){
var map__29334 = deps;
var map__29334__$1 = cljs.core.__destructure_map(map__29334);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29334__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29341 = app;
var G__29342 = "GET";
var G__29343 = "/api/documents/ingestion-status";
var G__29344 = (function (request,reply){
var G__29346 = runtime;
var G__29347 = request;
var G__29348 = reply;
var G__29349 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.read") : ensure_permission_BANG_.call(null,ctx,"datalake.read"));
} else {
}

var record = knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var progress = new cljs.core.Keyword(null,"progress","progress",244323547).cljs$core$IFn$_invoke$arity$1(record);
var G__29367 = reply;
var G__29368 = (200);
var G__29369 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"active","active",1895962068),cljs.core.boolean$(new cljs.core.Keyword(null,"active","active",1895962068).cljs$core$IFn$_invoke$arity$1(progress)),new cljs.core.Keyword(null,"progress","progress",244323547),progress,new cljs.core.Keyword(null,"canResumeForum","canResumeForum",-218600603),false,new cljs.core.Keyword(null,"stale","stale",395586896),false], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29367,G__29368,G__29369) : json_response_BANG_.call(null,G__29367,G__29368,G__29369));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29346,G__29347,G__29348,G__29349) : with_request_context_BANG_.call(null,G__29346,G__29347,G__29348,G__29349));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29341,G__29342,G__29343,G__29344) : route_BANG_.call(null,G__29341,G__29342,G__29343,G__29344));
});
knoxx.backend.infra.routes.documents.api_documents_ingestion_progress_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingestion_progress_BANG_(app,runtime,config,deps){
var map__29373 = deps;
var map__29373__$1 = cljs.core.__destructure_map(map__29373);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29373__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29374 = app;
var G__29375 = "GET";
var G__29376 = "/api/documents/ingestion-progress";
var G__29377 = (function (request,reply){
var G__29378 = runtime;
var G__29379 = request;
var G__29380 = reply;
var G__29381 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.read") : ensure_permission_BANG_.call(null,ctx,"datalake.read"));
} else {
}

var record = knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var progress = new cljs.core.Keyword(null,"progress","progress",244323547).cljs$core$IFn$_invoke$arity$1(record);
var G__29383 = reply;
var G__29384 = (200);
var G__29385 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"active","active",1895962068),cljs.core.boolean$(new cljs.core.Keyword(null,"active","active",1895962068).cljs$core$IFn$_invoke$arity$1(progress)),new cljs.core.Keyword(null,"progress","progress",244323547),progress,new cljs.core.Keyword(null,"canResumeForum","canResumeForum",-218600603),false,new cljs.core.Keyword(null,"stale","stale",395586896),false], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29383,G__29384,G__29385) : json_response_BANG_.call(null,G__29383,G__29384,G__29385));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29378,G__29379,G__29380,G__29381) : with_request_context_BANG_.call(null,G__29378,G__29379,G__29380,G__29381));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29374,G__29375,G__29376,G__29377) : route_BANG_.call(null,G__29374,G__29375,G__29376,G__29377));
});
knoxx.backend.infra.routes.documents.api_documents_ingestion_history_BANG_ = (function knoxx$backend$infra$routes$documents$api_documents_ingestion_history_BANG_(app,runtime,config,deps){
var map__29388 = deps;
var map__29388__$1 = cljs.core.__destructure_map(map__29388);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29388__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29389 = app;
var G__29390 = "GET";
var G__29391 = "/api/documents/ingestion-history";
var G__29392 = (function (request,reply){
var G__29394 = runtime;
var G__29395 = request;
var G__29396 = reply;
var G__29397 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.read") : ensure_permission_BANG_.call(null,ctx,"datalake.read"));
} else {
}

var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var record = knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var G__29400 = reply;
var G__29401 = (200);
var G__29402 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"collection","collection",-683361892),new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371).cljs$core$IFn$_invoke$arity$1(profile),new cljs.core.Keyword(null,"items","items",1031954938),new cljs.core.Keyword(null,"history","history",-247395220).cljs$core$IFn$_invoke$arity$1(record)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29400,G__29401,G__29402) : json_response_BANG_.call(null,G__29400,G__29401,G__29402));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29394,G__29395,G__29396,G__29397) : with_request_context_BANG_.call(null,G__29394,G__29395,G__29396,G__29397));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29389,G__29390,G__29391,G__29392) : route_BANG_.call(null,G__29389,G__29390,G__29391,G__29392));
});
knoxx.backend.infra.routes.documents.api_chat_retrieval_debug_BANG_ = (function knoxx$backend$infra$routes$documents$api_chat_retrieval_debug_BANG_(app,runtime,config,deps){
var map__29409 = deps;
var map__29409__$1 = cljs.core.__destructure_map(map__29409);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29409__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29414 = app;
var G__29415 = "POST";
var G__29416 = "/api/chat/retrieval-debug";
var G__29417 = (function (request,reply){
var G__29418 = runtime;
var G__29419 = request;
var G__29420 = reply;
var G__29421 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.query") : ensure_permission_BANG_.call(null,ctx,"datalake.query"));
} else {
}

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var query = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(body))));
var top_k = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"topK","topK",939681881).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (5);
}
})());
if(clojure.string.blank_QMARK_(query)){
var G__29424 = reply;
var G__29425 = (400);
var G__29426 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"message is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29424,G__29425,G__29426) : json_response_BANG_.call(null,G__29424,G__29425,G__29426));
} else {
try{var resp = (await knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx));
var documents = new cljs.core.Keyword(null,"documents","documents",-1582333455).cljs$core$IFn$_invoke$arity$1(resp);
var lowered = clojure.string.lower_case(query);
var results = cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(top_k,cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"score","score",-1963588780),cljs.core._GT_,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29407_SHARP_){
return (new cljs.core.Keyword(null,"score","score",-1963588780).cljs$core$IFn$_invoke$arity$1(p1__29407_SHARP_) > (0));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (doc){
var path = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"relativePath","relativePath",-608773918).cljs$core$IFn$_invoke$arity$1(doc)));
var name = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(doc)));
var hay = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)));
var score = ((clojure.string.includes_QMARK_(hay,lowered))?(1):((clojure.string.includes_QMARK_(lowered,clojure.string.lower_case(name)))?0.5:(0)
));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"score","score",-1963588780),score);
}),documents)))));
var G__29440 = reply;
var G__29441 = (200);
var G__29442 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"query","query",-1288509510),query,new cljs.core.Keyword(null,"topK","topK",939681881),top_k,new cljs.core.Keyword(null,"results","results",-1134170113),results], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29440,G__29441,G__29442) : json_response_BANG_.call(null,G__29440,G__29441,G__29442));
}catch (e29427){var err = e29427;
var G__29428 = reply;
var G__29429 = (500);
var G__29430 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Retrieval debug failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29428,G__29429,G__29430) : json_response_BANG_.call(null,G__29428,G__29429,G__29430));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29418,G__29419,G__29420,G__29421) : with_request_context_BANG_.call(null,G__29418,G__29419,G__29420,G__29421));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29414,G__29415,G__29416,G__29417) : route_BANG_.call(null,G__29414,G__29415,G__29416,G__29417));
});
knoxx.backend.infra.routes.documents.api_graph_export_BANG_ = (function knoxx$backend$infra$routes$documents$api_graph_export_BANG_(app,runtime,config,deps){
var map__29447 = deps;
var map__29447__$1 = cljs.core.__destructure_map(map__29447);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var openplanner_graph_export_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"openplanner-graph-export!","openplanner-graph-export!",-1726254887));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29447__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29451 = app;
var G__29452 = "GET";
var G__29453 = "/api/graph/export";
var G__29454 = (function (request,reply){
var G__29456 = runtime;
var G__29457 = request;
var G__29458 = reply;
var G__29459 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"datalake.query") : ensure_permission_BANG_.call(null,ctx,"datalake.query"));
} else {
}

try{var resp = (await (openplanner_graph_export_BANG_.cljs$core$IFn$_invoke$arity$2 ? openplanner_graph_export_BANG_.cljs$core$IFn$_invoke$arity$2(config,request) : openplanner_graph_export_BANG_.call(null,config,request)));
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),resp) : json_response_BANG_.call(null,reply,(200),resp));
}catch (e29460){var err = e29460;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,err,(502)) : error_response_BANG_.call(null,reply,err,(502)));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29456,G__29457,G__29458,G__29459) : with_request_context_BANG_.call(null,G__29456,G__29457,G__29458,G__29459));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29451,G__29452,G__29453,G__29454) : route_BANG_.call(null,G__29451,G__29452,G__29453,G__29454));
});
knoxx.backend.infra.routes.documents.api_settings_databases_list_BANG_ = (function knoxx$backend$infra$routes$documents$api_settings_databases_list_BANG_(app,runtime,config,deps){
var map__29468 = deps;
var map__29468__$1 = cljs.core.__destructure_map(map__29468);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29468__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29470 = app;
var G__29471 = "GET";
var G__29472 = "/api/settings/databases";
var G__29473 = (function (request,reply){
var G__29478 = runtime;
var G__29479 = request;
var G__29480 = reply;
var G__29481 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.datalakes.read") : ensure_permission_BANG_.call(null,ctx,"org.datalakes.read"));
} else {
}

var state = knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,ctx);
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
var active_id = knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4(runtime,config,request,ctx);
var active_profile = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),active_id], null));
var profiles = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (profile){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(profile,new cljs.core.Keyword(null,"canAccess","canAccess",-1259964654),knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,ctx,session_id));
}),cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"createdAt","createdAt",-936788),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__29462_SHARP_){
return knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(p1__29462_SHARP_,ctx,session_id);
}),cljs.core.vals(new cljs.core.Keyword(null,"profiles","profiles",507634713).cljs$core$IFn$_invoke$arity$1(state)))));
var G__29485 = reply;
var G__29486 = (200);
var G__29487 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"activeDatabaseId","activeDatabaseId",-1115597611),active_id,new cljs.core.Keyword(null,"databases","databases",2040134125),profiles,new cljs.core.Keyword(null,"activeRuntime","activeRuntime",438512110),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"projectName","projectName",295421548),new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config),new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882),new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(active_profile),new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371),new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371).cljs$core$IFn$_invoke$arity$1(active_profile)], null)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29485,G__29486,G__29487) : json_response_BANG_.call(null,G__29485,G__29486,G__29487));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29478,G__29479,G__29480,G__29481) : with_request_context_BANG_.call(null,G__29478,G__29479,G__29480,G__29481));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29470,G__29471,G__29472,G__29473) : route_BANG_.call(null,G__29470,G__29471,G__29472,G__29473));
});
knoxx.backend.infra.routes.documents.api_settings_databases_create_BANG_ = (function knoxx$backend$infra$routes$documents$api_settings_databases_create_BANG_(app,runtime,config,deps){
var map__29495 = deps;
var map__29495__$1 = cljs.core.__destructure_map(map__29495);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29495__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29499 = app;
var G__29500 = "POST";
var G__29501 = "/api/settings/databases";
var G__29502 = (function (request,reply){
var G__29504 = runtime;
var G__29505 = request;
var G__29506 = reply;
var G__29507 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.datalakes.create") : ensure_permission_BANG_.call(null,ctx,"org.datalakes.create"));
} else {
}

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var name = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(body))));
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
if(clojure.string.blank_QMARK_(name)){
var G__29511 = reply;
var G__29512 = (400);
var G__29513 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"name is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29511,G__29512,G__29513) : json_response_BANG_.call(null,G__29511,G__29512,G__29513));
} else {
var db_id = knoxx.backend.infra.document_state.create_db_id(runtime,name);
var docs_path = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.document_state.database_docs_dir(runtime,config,db_id);
}
})());
var profile = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"privateToSession","privateToSession",-73446717),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"forumMode","forumMode",2078997894),new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882),new cljs.core.Keyword(null,"ownerSessionId","ownerSessionId",1073095462),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"useLocalDocsBaseUrl","useLocalDocsBaseUrl",-1109521974),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"ownerUserId","ownerUserId",-1250504308),new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371),new cljs.core.Keyword(null,"ownerMembershipId","ownerMembershipId",2136804692),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"publicDocsBaseUrl","publicDocsBaseUrl",-1708554755)],[cljs.core.boolean$(new cljs.core.Keyword(null,"privateToSession","privateToSession",-73446717).cljs$core$IFn$_invoke$arity$1(body)),knoxx.backend.infra.auth.authz.ctx_org_id(ctx),cljs.core.boolean$(new cljs.core.Keyword(null,"forumMode","forumMode",2078997894).cljs$core$IFn$_invoke$arity$1(body)),docs_path,(cljs.core.truth_(new cljs.core.Keyword(null,"privateToSession","privateToSession",-73446717).cljs$core$IFn$_invoke$arity$1(body))?session_id:null),name,knoxx.backend.infra.auth.authz.ctx_org_slug(ctx),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,new cljs.core.Keyword(null,"useLocalDocsBaseUrl","useLocalDocsBaseUrl",-1109521974).cljs$core$IFn$_invoke$arity$1(body)),knoxx.backend.domain.time.now_iso(),knoxx.backend.infra.auth.authz.ctx_user_id(ctx),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"collection-name","collection-name",600435477).cljs$core$IFn$_invoke$arity$1(config))+"_"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(db_id));
}
})()),knoxx.backend.infra.auth.authz.ctx_membership_id(ctx),db_id,(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"publicDocsBaseUrl","publicDocsBaseUrl",-1708554755).cljs$core$IFn$_invoke$arity$1(body);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())]);
try{(await knoxx.backend.infra.document_state.ensure_dir_BANG_(runtime,docs_path));

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.database_state_STAR_,(function (state){
var owner_key = knoxx.backend.infra.document_state.database_owner_key(ctx);
return (function (s){
if(cljs.core.truth_(new cljs.core.Keyword(null,"activate","activate",441219614).cljs$core$IFn$_invoke$arity$1(body))){
return cljs.core.assoc_in(s,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),owner_key], null),db_id);
} else {
return s;
}
})(cljs.core.assoc_in(cljs.core.assoc_in(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null),profile),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id], null),knoxx.backend.infra.document_state.default_database_record()));
}));

return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),profile) : json_response_BANG_.call(null,reply,(200),profile));
}catch (e29519){var err = e29519;
var G__29520 = reply;
var G__29521 = (500);
var G__29522 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to create database profile: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29520,G__29521,G__29522) : json_response_BANG_.call(null,G__29520,G__29521,G__29522));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29504,G__29505,G__29506,G__29507) : with_request_context_BANG_.call(null,G__29504,G__29505,G__29506,G__29507));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29499,G__29500,G__29501,G__29502) : route_BANG_.call(null,G__29499,G__29500,G__29501,G__29502));
});
knoxx.backend.infra.routes.documents.api_settings_databases_activate_BANG_ = (function knoxx$backend$infra$routes$documents$api_settings_databases_activate_BANG_(app,runtime,config,deps){
var map__29526 = deps;
var map__29526__$1 = cljs.core.__destructure_map(map__29526);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29526__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29527 = app;
var G__29528 = "POST";
var G__29529 = "/api/settings/databases/activate";
var G__29530 = (function (request,reply){
var G__29532 = runtime;
var G__29533 = request;
var G__29534 = reply;
var G__29535 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.datalakes.read") : ensure_permission_BANG_.call(null,ctx,"org.datalakes.read"));
} else {
}

var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var db_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(body)));
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
var profile = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,ctx),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null));
if((profile == null)){
var G__29538 = reply;
var G__29539 = (404);
var G__29540 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile not found"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29538,G__29539,G__29540) : json_response_BANG_.call(null,G__29538,G__29539,G__29540));
} else {
if((!(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,ctx,session_id)))){
var G__29543 = reply;
var G__29544 = (403);
var G__29545 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile is outside the current Knoxx scope"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29543,G__29544,G__29545) : json_response_BANG_.call(null,G__29543,G__29544,G__29545));
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.document_state.database_state_STAR_,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),knoxx.backend.infra.document_state.database_owner_key(ctx)], null),db_id);

var G__29547 = reply;
var G__29548 = (200);
var G__29549 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"activeDatabaseId","activeDatabaseId",-1115597611),db_id], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29547,G__29548,G__29549) : json_response_BANG_.call(null,G__29547,G__29548,G__29549));

}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29532,G__29533,G__29534,G__29535) : with_request_context_BANG_.call(null,G__29532,G__29533,G__29534,G__29535));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29527,G__29528,G__29529,G__29530) : route_BANG_.call(null,G__29527,G__29528,G__29529,G__29530));
});
knoxx.backend.infra.routes.documents.api_settings_databases_update_BANG_ = (function knoxx$backend$infra$routes$documents$api_settings_databases_update_BANG_(app,runtime,config,deps){
var map__29552 = deps;
var map__29552__$1 = cljs.core.__destructure_map(map__29552);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29552__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29557 = app;
var G__29558 = "PATCH";
var G__29559 = "/api/settings/databases/:id";
var G__29560 = (function (request,reply){
var G__29561 = runtime;
var G__29562 = request;
var G__29563 = reply;
var G__29564 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.datalakes.update") : ensure_permission_BANG_.call(null,ctx,"org.datalakes.update"));
} else {
}

var db_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((request["params"]["id"])));
var body = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
var profile = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,ctx),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null));
if((profile == null)){
var G__29575 = reply;
var G__29576 = (404);
var G__29577 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile not found"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29575,G__29576,G__29577) : json_response_BANG_.call(null,G__29575,G__29576,G__29577));
} else {
if((!(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,ctx,session_id)))){
var G__29579 = reply;
var G__29580 = (403);
var G__29581 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile is outside the current Knoxx scope"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29579,G__29580,G__29581) : json_response_BANG_.call(null,G__29579,G__29580,G__29581));
} else {
var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([profile,cljs.core.select_keys(body,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"publicDocsBaseUrl","publicDocsBaseUrl",-1708554755),new cljs.core.Keyword(null,"useLocalDocsBaseUrl","useLocalDocsBaseUrl",-1109521974),new cljs.core.Keyword(null,"forumMode","forumMode",2078997894)], null))], 0));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.document_state.database_state_STAR_,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null),updated);

return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(reply,(200),updated) : json_response_BANG_.call(null,reply,(200),updated));

}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29561,G__29562,G__29563,G__29564) : with_request_context_BANG_.call(null,G__29561,G__29562,G__29563,G__29564));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29557,G__29558,G__29559,G__29560) : route_BANG_.call(null,G__29557,G__29558,G__29559,G__29560));
});
knoxx.backend.infra.routes.documents.api_settings_databases_delete_BANG_ = (function knoxx$backend$infra$routes$documents$api_settings_databases_delete_BANG_(app,runtime,config,deps){
var map__29584 = deps;
var map__29584__$1 = cljs.core.__destructure_map(map__29584);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__29584__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__29587 = app;
var G__29588 = "DELETE";
var G__29589 = "/api/settings/databases/:id";
var G__29590 = (function (request,reply){
var G__29591 = runtime;
var G__29592 = request;
var G__29593 = reply;
var G__29594 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"org.datalakes.delete") : ensure_permission_BANG_.call(null,ctx,"org.datalakes.delete"));
} else {
}

var db_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((request["params"]["id"])));
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
var profile = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,ctx),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null));
if((profile == null)){
var G__29595 = reply;
var G__29596 = (404);
var G__29597 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile not found"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29595,G__29596,G__29597) : json_response_BANG_.call(null,G__29595,G__29596,G__29597));
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(db_id,knoxx.backend.infra.document_state.default_database_id(ctx))){
var G__29599 = reply;
var G__29600 = (400);
var G__29601 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Default database cannot be deleted"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29599,G__29600,G__29601) : json_response_BANG_.call(null,G__29599,G__29600,G__29601));
} else {
if((!(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,ctx,session_id)))){
var G__29602 = reply;
var G__29603 = (403);
var G__29604 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database profile is outside the current Knoxx scope"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29602,G__29603,G__29604) : json_response_BANG_.call(null,G__29602,G__29603,G__29604));
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.database_state_STAR_,(function (state){
var owner_key = knoxx.backend.infra.document_state.database_owner_key(ctx);
return (function (s){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(s,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),owner_key], null)),db_id)){
return cljs.core.assoc_in(s,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),owner_key], null),knoxx.backend.infra.document_state.default_database_id(ctx));
} else {
return s;
}
})(cljs.core.update.cljs$core$IFn$_invoke$arity$4(cljs.core.update.cljs$core$IFn$_invoke$arity$4(state,new cljs.core.Keyword(null,"profiles","profiles",507634713),cljs.core.dissoc,db_id),new cljs.core.Keyword(null,"records","records",1326822832),cljs.core.dissoc,db_id));
}));

var G__29606 = reply;
var G__29607 = (200);
var G__29608 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"deleted","deleted",-510100639),db_id], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__29606,G__29607,G__29608) : json_response_BANG_.call(null,G__29606,G__29607,G__29608));

}
}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__29591,G__29592,G__29593,G__29594) : with_request_context_BANG_.call(null,G__29591,G__29592,G__29593,G__29594));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__29587,G__29588,G__29589,G__29590) : route_BANG_.call(null,G__29587,G__29588,G__29589,G__29590));
});
knoxx.backend.infra.routes.documents.register_document_routes_BANG_ = (function knoxx$backend$infra$routes$documents$register_document_routes_BANG_(app,runtime,config,deps){
knoxx.backend.infra.routes.documents.api_documents_list_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_content_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_delete_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_ingest_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_ingest_priority_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_ingest_restart_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_ingestion_progress_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_documents_ingestion_history_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_chat_retrieval_debug_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_graph_export_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_settings_databases_list_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_settings_databases_create_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_settings_databases_activate_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.documents.api_settings_databases_update_BANG_(app,runtime,config,deps);

return knoxx.backend.infra.routes.documents.api_settings_databases_delete_BANG_(app,runtime,config,deps);
});

//# sourceMappingURL=knoxx.backend.infra.routes.documents.js.map
