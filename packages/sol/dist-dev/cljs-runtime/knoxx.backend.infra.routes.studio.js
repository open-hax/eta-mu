import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.label.audio.js";
import "./knoxx.backend.infra.stores.mongo_policy_studio.js";
import "./knoxx.backend.infra.routes.studio.discord_scan.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.routes.studio');
knoxx.backend.infra.routes.studio.audio_extensions = (function knoxx$backend$infra$routes$studio$audio_extensions(){
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 8, [".flac",null,".mp3",null,".ogg",null,".m4a",null,".wma",null,".wav",null,".aac",null,".opus",null], null), null);
});
knoxx.backend.infra.routes.studio.audio_mime_type = (function knoxx$backend$infra$routes$studio$audio_mime_type(ext){
var G__30078 = ext;
switch (G__30078) {
case ".mp3":
return "audio/mpeg";

break;
case ".wav":
return "audio/wav";

break;
case ".ogg":
return "audio/ogg";

break;
case ".m4a":
return "audio/mp4";

break;
case ".flac":
return "audio/flac";

break;
case ".aac":
return "audio/aac";

break;
case ".opus":
return "audio/opus";

break;
default:
return "audio/mpeg";

}
});
knoxx.backend.infra.routes.studio.process_entry = (async function knoxx$backend$infra$routes$studio$process_entry(node_fs,node_path,root_dir,base_relative,depth,max_depth,entry){
var nm = entry.name;
var abs = node_path.join(root_dir,nm);
var rel = ((clojure.string.blank_QMARK_(base_relative))?nm:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_relative)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(nm)));
if(clojure.string.starts_with_QMARK_(nm,".")){
return cljs.core.PersistentVector.EMPTY;
} else {
if(cljs.core.truth_(entry.isDirectory())){
return (await (await (async function (){var G__30088 = node_fs;
var G__30089 = node_path;
var G__30090 = abs;
var G__30091 = rel;
var G__30092 = (depth + (1));
var G__30093 = max_depth;
return (knoxx.backend.infra.routes.studio.walk_audio_files_BANG_.cljs$core$IFn$_invoke$arity$6 ? knoxx.backend.infra.routes.studio.walk_audio_files_BANG_.cljs$core$IFn$_invoke$arity$6(G__30088,G__30089,G__30090,G__30091,G__30092,G__30093) : knoxx.backend.infra.routes.studio.walk_audio_files_BANG_.call(null,G__30088,G__30089,G__30090,G__30091,G__30092,G__30093));
})()));
} else {
var ext = clojure.string.lower_case((await (async function (){var or__5162__auto__ = (await (async function (){var G__30094 = node_path.extname(nm);
if((G__30094 == null)){
return null;
} else {
return clojure.string.trim(G__30094);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(cljs.core.contains_QMARK_(knoxx.backend.infra.routes.studio.audio_extensions(),ext)){
try{var s = (await node_fs.stat(abs));
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"name","name",1843675177),nm,new cljs.core.Keyword(null,"path","path",-188191168),rel,new cljs.core.Keyword(null,"ext","ext",-996964541),ext,new cljs.core.Keyword(null,"size","size",1098693007),s.size,new cljs.core.Keyword(null,"modified","modified",-2134587826),s.mtime.getTime(),new cljs.core.Keyword(null,"mime","mime",-1846414642),knoxx.backend.infra.routes.studio.audio_mime_type(ext)], null)], null);
}catch (e30098){var _ = e30098;
return cljs.core.PersistentVector.EMPTY;
}} else {
return cljs.core.PersistentVector.EMPTY;
}

}
}
});
knoxx.backend.infra.routes.studio.walk_audio_files_BANG_ = (async function knoxx$backend$infra$routes$studio$walk_audio_files_BANG_(node_fs,node_path,root_dir,base_relative,depth,max_depth){
if((depth > max_depth)){
return cljs.core.PersistentVector.EMPTY;
} else {
try{var entries = (await node_fs.readdir(root_dir,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"withFileTypes","withFileTypes",474788010),true], null))));
var promises = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__30101_SHARP_){
return knoxx.backend.infra.routes.studio.process_entry(node_fs,node_path,root_dir,base_relative,depth,max_depth,p1__30101_SHARP_);
}),cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(entries)));
var r = (await Promise.all(cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(promises)));
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.identity,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([r], 0)));
}catch (e30102){var _ = e30102;
return cljs.core.PersistentVector.EMPTY;
}}
});
knoxx.backend.infra.routes.studio.studio_audio_library_BANG_ = (function knoxx$backend$infra$routes$studio$studio_audio_library_BANG_(app,runtime,config,deps){
var map__30116 = deps;
var map__30116__$1 = cljs.core.__destructure_map(map__30116);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30116__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30118 = app;
var G__30119 = "GET";
var G__30120 = "/api/studio/audio-library";
var G__30121 = (function (request,reply){
var G__30122 = runtime;
var G__30123 = request;
var G__30124 = reply;
var G__30125 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var subpath = (await (async function (){var or__5162__auto__ = (request["query"]["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ".";
}
})());
var max_depth = (await (async function (){var d = parseInt((await (async function (){var or__5162__auto__ = (request["query"]["depth"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "16";
}
})()),(10));
if(cljs.core.truth_(isNaN(d))){
return (16);
} else {
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),cljs.core.min.cljs$core$IFn$_invoke$arity$2(d,(64)));
}
})());
var is_root = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(subpath,".")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(subpath,"")) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(subpath,"/")))));
var absolute = ((is_root)?new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config):(await (async function (){var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(subpath);
var map__30132 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__30132__$1 = cljs.core.__destructure_map(map__30132);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30132__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
return absolute;
})()));
var base_relative = ((is_root)?"":subpath);
try{var files = (await knoxx.backend.infra.routes.studio.walk_audio_files_BANG_(shadow.esm.esm_import$node_fs$promises,shadow.esm.esm_import$node_path,absolute,base_relative,(0),max_depth));
var sorted = cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"modified","modified",-2134587826),cljs.core._GT_,files));
var G__30141 = reply;
var G__30142 = (200);
var G__30143 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"root","root",-448657453),subpath,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(sorted),new cljs.core.Keyword(null,"files","files",-472457450),sorted], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30141,G__30142,G__30143) : json_response_BANG_.call(null,G__30141,G__30142,G__30143));
}catch (e30136){var err = e30136;
var G__30137 = reply;
var G__30138 = (500);
var G__30139 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Scan failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30137,G__30138,G__30139) : json_response_BANG_.call(null,G__30137,G__30138,G__30139));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30122,G__30123,G__30124,G__30125) : with_request_context_BANG_.call(null,G__30122,G__30123,G__30124,G__30125));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30118,G__30119,G__30120,G__30121) : route_BANG_.call(null,G__30118,G__30119,G__30120,G__30121));
});
knoxx.backend.infra.routes.studio.studio_state_get_BANG_ = (function knoxx$backend$infra$routes$studio$studio_state_get_BANG_(app,runtime,config,deps){
var map__30151 = deps;
var map__30151__$1 = cljs.core.__destructure_map(map__30151);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30151__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30154 = app;
var G__30155 = "GET";
var G__30156 = "/api/studio/state";
var G__30157 = (function (request,reply){
var G__30162 = runtime;
var G__30163 = request;
var G__30164 = reply;
var G__30165 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(db)){
var user_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-id","user-id",-206822291).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30172 = ctx;
var G__30172__$1 = (((G__30172 == null))?null:new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(G__30172));
if((G__30172__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30172__$1);
}
}
})());
var org_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30173 = ctx;
var G__30173__$1 = (((G__30173 == null))?null:new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(G__30173));
if((G__30173__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30173__$1);
}
}
})());
var kind = (await (async function (){var or__5162__auto__ = (request["query"]["kind"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "player";
}
})());
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = user_id;
if(cljs.core.truth_(and__5160__auto__)){
return org_id;
} else {
return and__5160__auto__;
}
})()))){
try{var state = (await knoxx.backend.infra.stores.mongo_policy_studio.get_studio_state_BANG_.cljs$core$IFn$_invoke$arity$3(user_id,org_id,kind));
var G__30184 = reply;
var G__30185 = (200);
var G__30186 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"state","state",-1988618099),(await (async function (){var or__5162__auto__ = state;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30184,G__30185,G__30186) : json_response_BANG_.call(null,G__30184,G__30185,G__30186));
}catch (e30176){var err = e30176;
var G__30177 = reply;
var G__30178 = (500);
var G__30179 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Load failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30177,G__30178,G__30179) : json_response_BANG_.call(null,G__30177,G__30178,G__30179));
}} else {
var G__30188 = reply;
var G__30189 = (200);
var G__30190 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"state","state",-1988618099),cljs.core.PersistentArrayMap.EMPTY], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30188,G__30189,G__30190) : json_response_BANG_.call(null,G__30188,G__30189,G__30190));
}
} else {
var G__30191 = reply;
var G__30192 = (200);
var G__30193 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"state","state",-1988618099),cljs.core.PersistentArrayMap.EMPTY], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30191,G__30192,G__30193) : json_response_BANG_.call(null,G__30191,G__30192,G__30193));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30162,G__30163,G__30164,G__30165) : with_request_context_BANG_.call(null,G__30162,G__30163,G__30164,G__30165));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30154,G__30155,G__30156,G__30157) : route_BANG_.call(null,G__30154,G__30155,G__30156,G__30157));
});
knoxx.backend.infra.routes.studio.studio_state_put_BANG_ = (function knoxx$backend$infra$routes$studio$studio_state_put_BANG_(app,runtime,config,deps){
var map__30198 = deps;
var map__30198__$1 = cljs.core.__destructure_map(map__30198);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30198__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30200 = app;
var G__30201 = "PUT";
var G__30202 = "/api/studio/state";
var G__30203 = (function (request,reply){
var G__30204 = runtime;
var G__30205 = request;
var G__30206 = reply;
var G__30207 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(db)){
var user_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-id","user-id",-206822291).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30214 = ctx;
var G__30214__$1 = (((G__30214 == null))?null:new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(G__30214));
if((G__30214__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30214__$1);
}
}
})());
var org_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30218 = ctx;
var G__30218__$1 = (((G__30218 == null))?null:new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(G__30218));
if((G__30218__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30218__$1);
}
}
})());
var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var kind = (await (async function (){var or__5162__auto__ = (body["kind"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "player";
}
})());
var state = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (body["state"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = user_id;
if(cljs.core.truth_(and__5160__auto__)){
return org_id;
} else {
return and__5160__auto__;
}
})()))){
try{(await knoxx.backend.infra.stores.mongo_policy_studio.put_studio_state_BANG_.cljs$core$IFn$_invoke$arity$4(user_id,org_id,kind,state));

var G__30241 = reply;
var G__30242 = (200);
var G__30243 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"saved","saved",288760660),true], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30241,G__30242,G__30243) : json_response_BANG_.call(null,G__30241,G__30242,G__30243));
}catch (e30228){var err = e30228;
var G__30234 = reply;
var G__30235 = (500);
var G__30236 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Save failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30234,G__30235,G__30236) : json_response_BANG_.call(null,G__30234,G__30235,G__30236));
}} else {
var G__30248 = reply;
var G__30249 = (400);
var G__30250 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"User context required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30248,G__30249,G__30250) : json_response_BANG_.call(null,G__30248,G__30249,G__30250));
}
} else {
var G__30253 = reply;
var G__30254 = (503);
var G__30255 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30253,G__30254,G__30255) : json_response_BANG_.call(null,G__30253,G__30254,G__30255));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30204,G__30205,G__30206,G__30207) : with_request_context_BANG_.call(null,G__30204,G__30205,G__30206,G__30207));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30200,G__30201,G__30202,G__30203) : route_BANG_.call(null,G__30200,G__30201,G__30202,G__30203));
});
knoxx.backend.infra.routes.studio.studio_playlist_get_BANG_ = (function knoxx$backend$infra$routes$studio$studio_playlist_get_BANG_(app,runtime,config,deps){
var map__30259 = deps;
var map__30259__$1 = cljs.core.__destructure_map(map__30259);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30259__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30261 = app;
var G__30262 = "GET";
var G__30263 = "/api/studio/playlist";
var G__30264 = (function (request,reply){
var G__30265 = runtime;
var G__30266 = request;
var G__30267 = reply;
var G__30268 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(db)){
var user_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-id","user-id",-206822291).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30274 = ctx;
var G__30274__$1 = (((G__30274 == null))?null:new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(G__30274));
if((G__30274__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30274__$1);
}
}
})());
var org_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30275 = ctx;
var G__30275__$1 = (((G__30275 == null))?null:new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(G__30275));
if((G__30275__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30275__$1);
}
}
})());
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = user_id;
if(cljs.core.truth_(and__5160__auto__)){
return org_id;
} else {
return and__5160__auto__;
}
})()))){
try{var items = (await knoxx.backend.infra.stores.mongo_policy_studio.get_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$2(user_id,org_id));
var G__30286 = reply;
var G__30287 = (200);
var G__30288 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"playlist","playlist",1952276871),(await (async function (){var or__5162__auto__ = items;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30286,G__30287,G__30288) : json_response_BANG_.call(null,G__30286,G__30287,G__30288));
}catch (e30277){var err = e30277;
var G__30278 = reply;
var G__30279 = (500);
var G__30280 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Load failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30278,G__30279,G__30280) : json_response_BANG_.call(null,G__30278,G__30279,G__30280));
}} else {
var G__30290 = reply;
var G__30291 = (200);
var G__30292 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"playlist","playlist",1952276871),cljs.core.PersistentVector.EMPTY], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30290,G__30291,G__30292) : json_response_BANG_.call(null,G__30290,G__30291,G__30292));
}
} else {
var G__30294 = reply;
var G__30295 = (200);
var G__30296 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"playlist","playlist",1952276871),cljs.core.PersistentVector.EMPTY], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30294,G__30295,G__30296) : json_response_BANG_.call(null,G__30294,G__30295,G__30296));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30265,G__30266,G__30267,G__30268) : with_request_context_BANG_.call(null,G__30265,G__30266,G__30267,G__30268));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30261,G__30262,G__30263,G__30264) : route_BANG_.call(null,G__30261,G__30262,G__30263,G__30264));
});
knoxx.backend.infra.routes.studio.studio_playlist_put_BANG_ = (function knoxx$backend$infra$routes$studio$studio_playlist_put_BANG_(app,runtime,config,deps){
var map__30298 = deps;
var map__30298__$1 = cljs.core.__destructure_map(map__30298);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30298__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30300 = app;
var G__30301 = "PUT";
var G__30302 = "/api/studio/playlist";
var G__30303 = (function (request,reply){
var G__30305 = runtime;
var G__30306 = request;
var G__30307 = reply;
var G__30308 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
if(cljs.core.truth_(db)){
var user_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-id","user-id",-206822291).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30311 = ctx;
var G__30311__$1 = (((G__30311 == null))?null:new cljs.core.Keyword(null,"user","user",1532431356).cljs$core$IFn$_invoke$arity$1(G__30311));
if((G__30311__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30311__$1);
}
}
})());
var org_id = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(ctx);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__30312 = ctx;
var G__30312__$1 = (((G__30312 == null))?null:new cljs.core.Keyword(null,"org","org",1495985).cljs$core$IFn$_invoke$arity$1(G__30312));
if((G__30312__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__30312__$1);
}
}
})());
var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var items = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (body["items"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = user_id;
if(cljs.core.truth_(and__5160__auto__)){
return org_id;
} else {
return and__5160__auto__;
}
})()))){
try{(await knoxx.backend.infra.stores.mongo_policy_studio.put_studio_playlist_BANG_.cljs$core$IFn$_invoke$arity$3(user_id,org_id,items));

var G__30345 = reply;
var G__30346 = (200);
var G__30347 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"saved","saved",288760660),true,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(items)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30345,G__30346,G__30347) : json_response_BANG_.call(null,G__30345,G__30346,G__30347));
}catch (e30336){var err = e30336;
var G__30337 = reply;
var G__30338 = (500);
var G__30339 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Save failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30337,G__30338,G__30339) : json_response_BANG_.call(null,G__30337,G__30338,G__30339));
}} else {
var G__30348 = reply;
var G__30349 = (400);
var G__30350 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"User context required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30348,G__30349,G__30350) : json_response_BANG_.call(null,G__30348,G__30349,G__30350));
}
} else {
var G__30351 = reply;
var G__30352 = (503);
var G__30353 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Database not configured"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30351,G__30352,G__30353) : json_response_BANG_.call(null,G__30351,G__30352,G__30353));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30305,G__30306,G__30307,G__30308) : with_request_context_BANG_.call(null,G__30305,G__30306,G__30307,G__30308));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30300,G__30301,G__30302,G__30303) : route_BANG_.call(null,G__30300,G__30301,G__30302,G__30303));
});
knoxx.backend.infra.routes.studio.studio_stream_BANG_ = (function knoxx$backend$infra$routes$studio$studio_stream_BANG_(app,runtime,config,deps){
var map__30364 = deps;
var map__30364__$1 = cljs.core.__destructure_map(map__30364);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30364__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30380 = app;
var G__30381 = "GET";
var G__30382 = "/api/studio/stream";
var G__30383 = (function (request,reply){
var G__30384 = runtime;
var G__30385 = request;
var G__30386 = reply;
var G__30387 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var raw_path = (await (async function (){var or__5162__auto__ = (request["query"]["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(raw_path);
var map__30388 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__30388__$1 = cljs.core.__destructure_map(map__30388);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30388__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30388__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var mime_type = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.media.workspace_media_mime_type(relative);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "audio/mpeg";
}
})());
try{var stat = (await knoxx.backend.domain.media.fs_stat_BANG_(shadow.esm.esm_import$node_fs$promises,absolute));
if(cljs.core.truth_(stat.isFile())){
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" is not a file")));
}

var total_size = stat.size;
var filename = knoxx.backend.domain.media.path_basename(shadow.esm.esm_import$node_path,absolute);
var safe_QMARK_ = cljs.core.every_QMARK_((function (c){
var n = c.charCodeAt((0));
return (((n >= (32))) && ((n <= (126))));
}),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename)));
var disp = ((safe_QMARK_)?(""+"inline; filename=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename)+"\""):(""+"inline; filename*=UTF-8''"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encodeURIComponent(filename))));
reply.header("Content-Type",mime_type);

reply.header("Accept-Ranges","bytes");

reply.header("Cache-Control","private, max-age=0");

reply.header("Content-Disposition",disp);

reply.header("Content-Length",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_size)));

return reply.send(shadow.esm.esm_import$node_fs.createReadStream(absolute));
}catch (e30391){var err = e30391;
var G__30392 = reply;
var G__30393 = (404);
var G__30394 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30392,G__30393,G__30394) : json_response_BANG_.call(null,G__30392,G__30393,G__30394));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30384,G__30385,G__30386,G__30387) : with_request_context_BANG_.call(null,G__30384,G__30385,G__30386,G__30387));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30380,G__30381,G__30382,G__30383) : route_BANG_.call(null,G__30380,G__30381,G__30382,G__30383));
});
knoxx.backend.infra.routes.studio.studio_save_m3u_BANG_ = (function knoxx$backend$infra$routes$studio$studio_save_m3u_BANG_(app,runtime,config,deps){
var map__30407 = deps;
var map__30407__$1 = cljs.core.__destructure_map(map__30407);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30407__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30408 = app;
var G__30410 = "POST";
var G__30411 = "/api/studio/save-m3u";
var G__30412 = (function (request,reply){
var G__30413 = runtime;
var G__30414 = request;
var G__30415 = reply;
var G__30416 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var items = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (body["items"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var name = (await (async function (){var or__5162__auto__ = (body["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"playlist-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((new Date()).toISOString()));
}
})());
var m3u_lines = cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["#EXTM3U"], null),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (item){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+"#EXTINF:-1,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(item))),new cljs.core.Keyword(null,"path","path",-188191168).cljs$core$IFn$_invoke$arity$1(item)], null);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([items], 0)));
var m3u_content = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",m3u_lines);
var normalized = knoxx.backend.domain.media.normalize_tool_path_arg("Music/playlists");
var map__30417 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__30417__$1 = cljs.core.__destructure_map(map__30417);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30417__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var safe_name = clojure.string.replace(name,/[^a-zA-Z0-9_-]/,"_");
var file_path = shadow.esm.esm_import$node_path.join(absolute,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(safe_name)+".m3u"));
try{(await shadow.esm.esm_import$node_fs$promises.mkdir(absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

(await shadow.esm.esm_import$node_fs$promises.writeFile(file_path,m3u_content,"utf8"));

var G__30431 = reply;
var G__30432 = (200);
var G__30433 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),(""+"Music/playlists/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(safe_name)+".m3u"),new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(items)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30431,G__30432,G__30433) : json_response_BANG_.call(null,G__30431,G__30432,G__30433));
}catch (e30427){var err = e30427;
var G__30428 = reply;
var G__30429 = (500);
var G__30430 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to save playlist: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30428,G__30429,G__30430) : json_response_BANG_.call(null,G__30428,G__30429,G__30430));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30413,G__30414,G__30415,G__30416) : with_request_context_BANG_.call(null,G__30413,G__30414,G__30415,G__30416));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30408,G__30410,G__30411,G__30412) : route_BANG_.call(null,G__30408,G__30410,G__30411,G__30412));
});
knoxx.backend.infra.routes.studio.studio_save_m3u_download_BANG_ = (function knoxx$backend$infra$routes$studio$studio_save_m3u_download_BANG_(app,runtime,config,deps){
var map__30437 = deps;
var map__30437__$1 = cljs.core.__destructure_map(map__30437);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30437__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30439 = app;
var G__30440 = "POST";
var G__30441 = "/api/studio/download-m3u";
var G__30442 = (function (request,reply){
var G__30446 = runtime;
var G__30447 = request;
var G__30448 = reply;
var G__30449 = (function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var body = (function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})();
var items = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (body["items"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Array());
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var name = (function (){var or__5162__auto__ = (body["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "playlist";
}
})();
var m3u_lines = cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["#EXTM3U"], null),cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (item){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+"#EXTINF:-1,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(item))),new cljs.core.Keyword(null,"path","path",-188191168).cljs$core$IFn$_invoke$arity$1(item)], null);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([items], 0)));
var m3u_content = clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",m3u_lines);
var safe_name = clojure.string.replace(name,/[^a-zA-Z0-9_-]/,"_");
reply.header("Content-Type","audio/x-mpegurl");

reply.header("Content-Disposition",(""+"attachment; filename=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(safe_name)+".m3u\""));

return reply.send(m3u_content);
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30446,G__30447,G__30448,G__30449) : with_request_context_BANG_.call(null,G__30446,G__30447,G__30448,G__30449));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30439,G__30440,G__30441,G__30442) : route_BANG_.call(null,G__30439,G__30440,G__30441,G__30442));
});
knoxx.backend.infra.routes.studio.studio_load_m3u_BANG_ = (function knoxx$backend$infra$routes$studio$studio_load_m3u_BANG_(app,runtime,config,deps){
var map__30461 = deps;
var map__30461__$1 = cljs.core.__destructure_map(map__30461);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30461__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30465 = app;
var G__30466 = "GET";
var G__30467 = "/api/studio/load-m3u";
var G__30468 = (function (request,reply){
var G__30470 = runtime;
var G__30471 = request;
var G__30472 = reply;
var G__30473 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var file_path = (request["query"]["path"]);
if(cljs.core.not(file_path)){
var G__30476 = reply;
var G__30477 = (400);
var G__30478 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path parameter"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30476,G__30477,G__30478) : json_response_BANG_.call(null,G__30476,G__30477,G__30478));
} else {
try{var content = (await shadow.esm.esm_import$node_fs$promises.readFile(file_path,"utf8"));
var lines = clojure.string.split_lines(content);
var items = (await (async function (){var remaining = lines;
var result = cljs.core.PersistentVector.EMPTY;
var current_name = null;
while(true){
if(cljs.core.empty_QMARK_(remaining)){
return result;
} else {
var line = clojure.string.trim(cljs.core.first(remaining));
var rest_lines = cljs.core.rest(remaining);
if(((clojure.string.blank_QMARK_(line)) || (clojure.string.starts_with_QMARK_(line,"#EXTM3U")))){
var G__31007 = rest_lines;
var G__31008 = result;
var G__31009 = current_name;
remaining = G__31007;
result = G__31008;
current_name = G__31009;
continue;
} else {
if(clojure.string.starts_with_QMARK_(line,"#EXTINF:")){
var name_part = cljs.core.second(clojure.string.split.cljs$core$IFn$_invoke$arity$3(line,/,/,(2)));
var G__31011 = rest_lines;
var G__31012 = result;
var G__31013 = (await (async function (){var or__5162__auto__ = name_part;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Unknown";
}
})());
remaining = G__31011;
result = G__31012;
current_name = G__31013;
continue;
} else {
var G__31014 = rest_lines;
var G__31015 = cljs.core.conj.cljs$core$IFn$_invoke$arity$2(result,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"path","path",-188191168),line,new cljs.core.Keyword(null,"name","name",1843675177),(await (async function (){var or__5162__auto__ = current_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$node_path.basename(line);
}
})())], null));
var G__31016 = null;
remaining = G__31014;
result = G__31015;
current_name = G__31016;
continue;

}
}
}
break;
}
})());
var playlist_name = shadow.esm.esm_import$node_path.basename(file_path);
var clean_name = clojure.string.replace(playlist_name,/\.m3u$/,"");
var G__30493 = reply;
var G__30494 = (200);
var G__30495 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"name","name",1843675177),clean_name,new cljs.core.Keyword(null,"items","items",1031954938),cljs.core.vec(items)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30493,G__30494,G__30495) : json_response_BANG_.call(null,G__30493,G__30494,G__30495));
}catch (e30479){var err = e30479;
var G__30480 = reply;
var G__30481 = (500);
var G__30482 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to load M3U: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30480,G__30481,G__30482) : json_response_BANG_.call(null,G__30480,G__30481,G__30482));
}}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30470,G__30471,G__30472,G__30473) : with_request_context_BANG_.call(null,G__30470,G__30471,G__30472,G__30473));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30465,G__30466,G__30467,G__30468) : route_BANG_.call(null,G__30465,G__30466,G__30467,G__30468));
});
knoxx.backend.infra.routes.studio.studio_list_playlists_BANG_ = (function knoxx$backend$infra$routes$studio$studio_list_playlists_BANG_(app,runtime,config,deps){
var map__30501 = deps;
var map__30501__$1 = cljs.core.__destructure_map(map__30501);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30501__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30504 = app;
var G__30505 = "GET";
var G__30506 = "/api/studio/playlists";
var G__30507 = (function (request,reply){
var G__30508 = runtime;
var G__30509 = request;
var G__30510 = reply;
var G__30511 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var playlists_dir = shadow.esm.esm_import$node_path.join(workspace_root,"Music","playlists");
try{var files = (await shadow.esm.esm_import$node_fs$promises.readdir(playlists_dir));
var m3u_files = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (filename){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),clojure.string.replace(filename,/\.m3u$/,""),new cljs.core.Keyword(null,"path","path",-188191168),shadow.esm.esm_import$node_path.join(playlists_dir,filename),new cljs.core.Keyword(null,"filename","filename",-1428840783),filename], null);
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__30498_SHARP_){
return clojure.string.ends_with_QMARK_(p1__30498_SHARP_,".m3u");
}),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(files)));
var G__30519 = reply;
var G__30520 = (200);
var G__30521 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"playlists","playlists",861847789),cljs.core.vec(m3u_files)], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30519,G__30520,G__30521) : json_response_BANG_.call(null,G__30519,G__30520,G__30521));
}catch (e30514){var _err = e30514;
var G__30515 = reply;
var G__30516 = (200);
var G__30517 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"playlists","playlists",861847789),cljs.core.PersistentVector.EMPTY], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30515,G__30516,G__30517) : json_response_BANG_.call(null,G__30515,G__30516,G__30517));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30508,G__30509,G__30510,G__30511) : with_request_context_BANG_.call(null,G__30508,G__30509,G__30510,G__30511));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30504,G__30505,G__30506,G__30507) : route_BANG_.call(null,G__30504,G__30505,G__30506,G__30507));
});
knoxx.backend.infra.routes.studio.studio_labels_get_BANG_ = (function knoxx$backend$infra$routes$studio$studio_labels_get_BANG_(app,runtime,config,deps){
var map__30530 = deps;
var map__30530__$1 = cljs.core.__destructure_map(map__30530);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30530__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30531 = app;
var G__30532 = "GET";
var G__30533 = "/api/studio/labels";
var G__30534 = (function (request,reply){
var G__30535 = runtime;
var G__30536 = request;
var G__30537 = reply;
var G__30538 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var file_path = (request["query"]["path"]);
var all_QMARK_ = (request["query"]["all"]);
if(cljs.core.truth_(all_QMARK_)){
try{var all_labels = (await knoxx.backend.domain.label.audio.get_all_labels(shadow.esm.esm_import$node_fs$promises,workspace_root));
var G__30546 = reply;
var G__30547 = (200);
var G__30548 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"labels","labels",-626734591),all_labels], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30546,G__30547,G__30548) : json_response_BANG_.call(null,G__30546,G__30547,G__30548));
}catch (e30542){var err = e30542;
var G__30543 = reply;
var G__30544 = (500);
var G__30545 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30543,G__30544,G__30545) : json_response_BANG_.call(null,G__30543,G__30544,G__30545));
}} else {
if(cljs.core.truth_(file_path)){
try{var file_labels = (await knoxx.backend.domain.label.audio.get_labels(shadow.esm.esm_import$node_fs$promises,workspace_root,file_path));
var G__30553 = reply;
var G__30554 = (200);
var G__30555 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),file_path,new cljs.core.Keyword(null,"labels","labels",-626734591),file_labels], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30553,G__30554,G__30555) : json_response_BANG_.call(null,G__30553,G__30554,G__30555));
}catch (e30549){var err = e30549;
var G__30550 = reply;
var G__30551 = (500);
var G__30552 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30550,G__30551,G__30552) : json_response_BANG_.call(null,G__30550,G__30551,G__30552));
}} else {
var G__30556 = reply;
var G__30557 = (400);
var G__30558 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path or all parameter"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30556,G__30557,G__30558) : json_response_BANG_.call(null,G__30556,G__30557,G__30558));

}
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30535,G__30536,G__30537,G__30538) : with_request_context_BANG_.call(null,G__30535,G__30536,G__30537,G__30538));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30531,G__30532,G__30533,G__30534) : route_BANG_.call(null,G__30531,G__30532,G__30533,G__30534));
});
knoxx.backend.infra.routes.studio.studio_labels_add_BANG_ = (function knoxx$backend$infra$routes$studio$studio_labels_add_BANG_(app,runtime,config,deps){
var map__30564 = deps;
var map__30564__$1 = cljs.core.__destructure_map(map__30564);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30564__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30567 = app;
var G__30568 = "POST";
var G__30569 = "/api/studio/labels/add";
var G__30570 = (function (request,reply){
var G__30571 = runtime;
var G__30572 = request;
var G__30573 = reply;
var G__30574 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var file_path = (body["path"]);
var label = (body["label"]);
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = file_path;
if(cljs.core.truth_(and__5160__auto__)){
return label;
} else {
return and__5160__auto__;
}
})()))){
try{var updated = (await knoxx.backend.domain.label.audio.add_label_BANG_(shadow.esm.esm_import$node_fs$promises,workspace_root,file_path,label));
var G__30581 = reply;
var G__30582 = (200);
var G__30583 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),file_path,new cljs.core.Keyword(null,"labels","labels",-626734591),updated], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30581,G__30582,G__30583) : json_response_BANG_.call(null,G__30581,G__30582,G__30583));
}catch (e30577){var err = e30577;
var G__30578 = reply;
var G__30579 = (500);
var G__30580 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30578,G__30579,G__30580) : json_response_BANG_.call(null,G__30578,G__30579,G__30580));
}} else {
var G__30585 = reply;
var G__30586 = (400);
var G__30587 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path or label"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30585,G__30586,G__30587) : json_response_BANG_.call(null,G__30585,G__30586,G__30587));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30571,G__30572,G__30573,G__30574) : with_request_context_BANG_.call(null,G__30571,G__30572,G__30573,G__30574));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30567,G__30568,G__30569,G__30570) : route_BANG_.call(null,G__30567,G__30568,G__30569,G__30570));
});
knoxx.backend.infra.routes.studio.studio_labels_remove_BANG_ = (function knoxx$backend$infra$routes$studio$studio_labels_remove_BANG_(app,runtime,config,deps){
var map__30623 = deps;
var map__30623__$1 = cljs.core.__destructure_map(map__30623);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30623__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30625 = app;
var G__30626 = "POST";
var G__30627 = "/api/studio/labels/remove";
var G__30628 = (function (request,reply){
var G__30630 = runtime;
var G__30631 = request;
var G__30632 = reply;
var G__30633 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var file_path = (body["path"]);
var label = (body["label"]);
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = file_path;
if(cljs.core.truth_(and__5160__auto__)){
return label;
} else {
return and__5160__auto__;
}
})()))){
try{var updated = (await knoxx.backend.domain.label.audio.remove_label_BANG_(shadow.esm.esm_import$node_fs$promises,workspace_root,file_path,label));
var G__30641 = reply;
var G__30642 = (200);
var G__30643 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),file_path,new cljs.core.Keyword(null,"labels","labels",-626734591),updated], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30641,G__30642,G__30643) : json_response_BANG_.call(null,G__30641,G__30642,G__30643));
}catch (e30636){var err = e30636;
var G__30637 = reply;
var G__30638 = (500);
var G__30639 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30637,G__30638,G__30639) : json_response_BANG_.call(null,G__30637,G__30638,G__30639));
}} else {
var G__30646 = reply;
var G__30647 = (400);
var G__30648 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path or label"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30646,G__30647,G__30648) : json_response_BANG_.call(null,G__30646,G__30647,G__30648));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30630,G__30631,G__30632,G__30633) : with_request_context_BANG_.call(null,G__30630,G__30631,G__30632,G__30633));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30625,G__30626,G__30627,G__30628) : route_BANG_.call(null,G__30625,G__30626,G__30627,G__30628));
});
knoxx.backend.infra.routes.studio.studio_labels_by_label_BANG_ = (function knoxx$backend$infra$routes$studio$studio_labels_by_label_BANG_(app,runtime,config,deps){
var map__30654 = deps;
var map__30654__$1 = cljs.core.__destructure_map(map__30654);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30654__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30658 = app;
var G__30659 = "GET";
var G__30660 = "/api/studio/labels/by-label";
var G__30661 = (function (request,reply){
var G__30663 = runtime;
var G__30664 = request;
var G__30665 = reply;
var G__30666 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var label = (request["query"]["label"]);
if(cljs.core.truth_(label)){
try{var files = (await knoxx.backend.domain.label.audio.get_files_by_label(shadow.esm.esm_import$node_fs$promises,workspace_root,label));
var G__30684 = reply;
var G__30685 = (200);
var G__30686 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"files","files",-472457450),files], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30684,G__30685,G__30686) : json_response_BANG_.call(null,G__30684,G__30685,G__30686));
}catch (e30668){var err = e30668;
var G__30669 = reply;
var G__30670 = (500);
var G__30671 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30669,G__30670,G__30671) : json_response_BANG_.call(null,G__30669,G__30670,G__30671));
}} else {
var G__30689 = reply;
var G__30690 = (400);
var G__30691 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing label parameter"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30689,G__30690,G__30691) : json_response_BANG_.call(null,G__30689,G__30690,G__30691));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30663,G__30664,G__30665,G__30666) : with_request_context_BANG_.call(null,G__30663,G__30664,G__30665,G__30666));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30658,G__30659,G__30660,G__30661) : route_BANG_.call(null,G__30658,G__30659,G__30660,G__30661));
});
knoxx.backend.infra.routes.studio.studio_sync_symlinks_BANG_ = (function knoxx$backend$infra$routes$studio$studio_sync_symlinks_BANG_(app,runtime,config,deps){
var map__30695 = deps;
var map__30695__$1 = cljs.core.__destructure_map(map__30695);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30695__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30710 = app;
var G__30711 = "POST";
var G__30712 = "/api/studio/sync-symlinks";
var G__30713 = (function (request,reply){
var G__30720 = runtime;
var G__30721 = request;
var G__30722 = reply;
var G__30723 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
try{var count = (await knoxx.backend.domain.label.audio.sync_symlinks_BANG_(shadow.esm.esm_import$node_fs$promises,shadow.esm.esm_import$node_path,workspace_root));
var G__30735 = reply;
var G__30736 = (200);
var G__30737 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"symlinks","symlinks",2086981352),count], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30735,G__30736,G__30737) : json_response_BANG_.call(null,G__30735,G__30736,G__30737));
}catch (e30727){var err = e30727;
var G__30728 = reply;
var G__30729 = (500);
var G__30730 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to sync symlinks: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30728,G__30729,G__30730) : json_response_BANG_.call(null,G__30728,G__30729,G__30730));
}});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30720,G__30721,G__30722,G__30723) : with_request_context_BANG_.call(null,G__30720,G__30721,G__30722,G__30723));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30710,G__30711,G__30712,G__30713) : route_BANG_.call(null,G__30710,G__30711,G__30712,G__30713));
});
knoxx.backend.infra.routes.studio.studio_audio_asset_get_BANG_ = (function knoxx$backend$infra$routes$studio$studio_audio_asset_get_BANG_(app,runtime,config,deps){
var map__30758 = deps;
var map__30758__$1 = cljs.core.__destructure_map(map__30758);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30758__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30769 = app;
var G__30770 = "GET";
var G__30771 = "/api/studio/audio-asset";
var G__30772 = (function (request,reply){
var G__30778 = runtime;
var G__30779 = request;
var G__30780 = reply;
var G__30781 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var _db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
var audio_path = (request["query"]["path"]);
var asset_type = (request["query"]["type"]);
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = audio_path;
if(cljs.core.truth_(and__5160__auto__)){
return asset_type;
} else {
return and__5160__auto__;
}
})()))){
try{var row = (await knoxx.backend.infra.stores.mongo_policy_studio.get_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$2(audio_path,asset_type));
if(cljs.core.truth_(row)){
reply.header("Content-Type",(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "image/png";
}
})()));

reply.header("Cache-Control","public, max-age=86400");

return reply.send(new cljs.core.Keyword(null,"image-data","image-data",-377483758).cljs$core$IFn$_invoke$arity$1(row));
} else {
var G__30800 = reply;
var G__30801 = (404);
var G__30802 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Asset not found"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30800,G__30801,G__30802) : json_response_BANG_.call(null,G__30800,G__30801,G__30802));
}
}catch (e30793){var err = e30793;
var G__30795 = reply;
var G__30796 = (500);
var G__30797 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30795,G__30796,G__30797) : json_response_BANG_.call(null,G__30795,G__30796,G__30797));
}} else {
var G__30803 = reply;
var G__30804 = (400);
var G__30805 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path or type"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30803,G__30804,G__30805) : json_response_BANG_.call(null,G__30803,G__30804,G__30805));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30778,G__30779,G__30780,G__30781) : with_request_context_BANG_.call(null,G__30778,G__30779,G__30780,G__30781));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30769,G__30770,G__30771,G__30772) : route_BANG_.call(null,G__30769,G__30770,G__30771,G__30772));
});
knoxx.backend.infra.routes.studio.studio_audio_asset_save_BANG_ = (function knoxx$backend$infra$routes$studio$studio_audio_asset_save_BANG_(app,runtime,config,deps){
var map__30867 = deps;
var map__30867__$1 = cljs.core.__destructure_map(map__30867);
var clip_text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"clip-text","clip-text",-1457928615));
var ensure_permission_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"ensure-permission!","ensure-permission!",1816359163));
var fetch_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"fetch-json","fetch-json",245934686));
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var request_query_string = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"request-query-string","request-query-string",-1321342848));
var policy_db = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"policy-db","policy-db",-1771109183));
var session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"session-guard","session-guard",-1338532954));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var send_fetch_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"send-fetch-response!","send-fetch-response!",-1440922000));
var optional_session_guard = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"optional-session-guard","optional-session-guard",-726001966));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var bearer_headers = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__30867__$1,new cljs.core.Keyword(null,"bearer-headers","bearer-headers",79504310));
var G__30870 = app;
var G__30871 = "POST";
var G__30872 = "/api/studio/audio-asset";
var G__30873 = (function (request,reply){
var G__30874 = runtime;
var G__30875 = request;
var G__30876 = reply;
var G__30877 = (async function (ctx){
if(cljs.core.truth_(ctx)){
(ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_permission_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"agent.chat.use") : ensure_permission_BANG_.call(null,ctx,"agent.chat.use"));
} else {
}

var _db = (policy_db.cljs$core$IFn$_invoke$arity$1 ? policy_db.cljs$core$IFn$_invoke$arity$1(runtime) : policy_db.call(null,runtime));
var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var audio_path = (body["path"]);
var asset_type = (body["type"]);
var image_data = (body["imageData"]);
var mime_type = (await (async function (){var or__5162__auto__ = (body["mimeType"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "image/png";
}
})());
var width = (body["width"]);
var height = (body["height"]);
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = audio_path;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = asset_type;
if(cljs.core.truth_(and__5160__auto____$1)){
return image_data;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})()))){
var buffer = Buffer.from(image_data,"base64");
try{(await knoxx.backend.infra.stores.mongo_policy_studio.save_audio_asset_BANG_.cljs$core$IFn$_invoke$arity$6(audio_path,asset_type,buffer,mime_type,width,height));

var G__30888 = reply;
var G__30889 = (200);
var G__30890 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),audio_path,new cljs.core.Keyword(null,"type","type",1174270348),asset_type], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30888,G__30889,G__30890) : json_response_BANG_.call(null,G__30888,G__30889,G__30890));
}catch (e30883){var err = e30883;
var G__30884 = reply;
var G__30885 = (500);
var G__30886 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30884,G__30885,G__30886) : json_response_BANG_.call(null,G__30884,G__30885,G__30886));
}} else {
var G__30896 = reply;
var G__30897 = (400);
var G__30898 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"Missing path, type, or imageData"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__30896,G__30897,G__30898) : json_response_BANG_.call(null,G__30896,G__30897,G__30898));
}
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__30874,G__30875,G__30876,G__30877) : with_request_context_BANG_.call(null,G__30874,G__30875,G__30876,G__30877));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__30870,G__30871,G__30872,G__30873) : route_BANG_.call(null,G__30870,G__30871,G__30872,G__30873));
});
knoxx.backend.infra.routes.studio.register_studio_routes_BANG_ = (function knoxx$backend$infra$routes$studio$register_studio_routes_BANG_(app,runtime,config,deps){
knoxx.backend.infra.routes.studio.studio_audio_library_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_state_get_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_state_put_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_playlist_get_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_playlist_put_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_stream_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_save_m3u_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_save_m3u_download_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_load_m3u_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_list_playlists_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_labels_get_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_labels_add_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_labels_remove_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_labels_by_label_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_sync_symlinks_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_audio_asset_get_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.studio_audio_asset_save_BANG_(app,runtime,config,deps);

knoxx.backend.infra.routes.studio.discord_scan.studio_discord_audio_scan_BANG_(app,runtime,config,deps);

return knoxx.backend.infra.routes.studio.discord_scan.studio_discord_image_scan_BANG_(app,runtime,config,deps);
});

//# sourceMappingURL=knoxx.backend.infra.routes.studio.js.map
