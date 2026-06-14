import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.media.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.routes.workspace_media');



knoxx.backend.infra.routes.workspace_media.reply_header_BANG_ = (function knoxx$backend$infra$routes$workspace_media$reply_header_BANG_(reply,name,value){
return reply.header(name,value);
});
knoxx.backend.infra.routes.workspace_media.request_header = (function knoxx$backend$infra$routes$workspace_media$request_header(request,name){
var headers = (request["headers"]);
if(cljs.core.truth_(headers)){
return (headers[name]);
} else {
return null;
}
});
/**
 * Build a Content-Disposition header value that handles non-ASCII filenames.
 * Uses RFC 5987 encoding for filenames with special characters.
 */
knoxx.backend.infra.routes.workspace_media.safe_content_disposition = (function knoxx$backend$infra$routes$workspace_media$safe_content_disposition(filename){
var ascii_safe_QMARK_ = cljs.core.every_QMARK_((function (p1__22706_SHARP_){
var c = p1__22706_SHARP_.charCodeAt((0));
return (((c >= (32))) && ((((c <= (126))) && (((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,(34))) && (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(c,(92))))))));
}),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename)));
if(ascii_safe_QMARK_){
return (""+"inline; filename=\""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(filename)+"\"");
} else {
var encoded = encodeURIComponent(filename);
return (""+"inline; filename*=UTF-8''"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(encoded));
}
});
knoxx.backend.infra.routes.workspace_media.mime_type_for_path = (function knoxx$backend$infra$routes$workspace_media$mime_type_for_path(relative,absolute){
var or__5162__auto__ = knoxx.backend.domain.media.workspace_media_mime_type(relative);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.media.workspace_media_mime_type(absolute);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "application/octet-stream";
}
}
});
/**
 * Parse a Range header of the form: bytes=start-end.
 * Returns {:start n :end n :length n} or nil when invalid/unsupported.
 */
knoxx.backend.infra.routes.workspace_media.parse_range_header = (function knoxx$backend$infra$routes$workspace_media$parse_range_header(range_header,total_size){
var raw = (function (){var G__22713 = range_header;
var G__22713__$1 = (((G__22713 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__22713)));
if((G__22713__$1 == null)){
return null;
} else {
return clojure.string.trim(G__22713__$1);
}
})();
var match = (cljs.core.truth_((function (){var and__5160__auto__ = raw;
if(cljs.core.truth_(and__5160__auto__)){
return clojure.string.starts_with_QMARK_(raw,"bytes=");
} else {
return and__5160__auto__;
}
})())?raw.match(/^bytes=(\\d*)-(\\d*)$/):null);
if(cljs.core.truth_(match)){
var start_str = (match[(1)]);
var end_str = (match[(2)]);
var start = (cljs.core.truth_((function (){var and__5160__auto__ = start_str;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_(start_str)));
} else {
return and__5160__auto__;
}
})())?parseInt(start_str,(10)):null);
var end = (cljs.core.truth_((function (){var and__5160__auto__ = end_str;
if(cljs.core.truth_(and__5160__auto__)){
return (!(clojure.string.blank_QMARK_(end_str)));
} else {
return and__5160__auto__;
}
})())?parseInt(end_str,(10)):null);
var start_STAR_ = ((((typeof start === 'number') && (cljs.core.not(isNaN(start)))))?start:(((((start == null)) && (((typeof end === 'number') && (cljs.core.not(isNaN(end)))))))?cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(total_size - end)):null
));
var end_STAR_ = ((((typeof end === 'number') && (cljs.core.not(isNaN(end)))))?cljs.core.min.cljs$core$IFn$_invoke$arity$2((total_size - (1)),end):(total_size - (1))
);
if(((typeof start_STAR_ === 'number') && (((((0) <= start_STAR_)) && ((((start_STAR_ < total_size)) && ((start_STAR_ <= end_STAR_)))))))){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"start","start",-355208981),start_STAR_,new cljs.core.Keyword(null,"end","end",-268185958),end_STAR_,new cljs.core.Keyword(null,"length","length",588987862),((end_STAR_ - start_STAR_) + (1))], null);
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.routes.workspace_media.send_media_stream_BANG_ = (function knoxx$backend$infra$routes$workspace_media$send_media_stream_BANG_(reply,absolute,total_size,range){
if(cljs.core.truth_(range)){
var map__22724 = range;
var map__22724__$1 = cljs.core.__destructure_map(map__22724);
var start = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22724__$1,new cljs.core.Keyword(null,"start","start",-355208981));
var end = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22724__$1,new cljs.core.Keyword(null,"end","end",-268185958));
var length = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22724__$1,new cljs.core.Keyword(null,"length","length",588987862));
var stream = shadow.esm.esm_import$node_fs.createReadStream(absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"start","start",-355208981),start,new cljs.core.Keyword(null,"end","end",-268185958),end], null)));
knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Content-Range",(""+"bytes "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(start)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(end)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_size)));

knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Content-Length",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(length)));

reply.code((206));

return reply.send(stream);
} else {
var stream = shadow.esm.esm_import$node_fs.createReadStream(absolute);
knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Content-Length",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(total_size)));

reply.code((200));

return reply.send(stream);
}
});
knoxx.backend.infra.routes.workspace_media.serve_workspace_media_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$serve_workspace_media_BANG_(runtime,config,request,reply,ctx,p__22726){
var map__22728 = p__22726;
var map__22728__$1 = cljs.core.__destructure_map(map__22728);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22728__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22728__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22728__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
try{if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"read") : ensure_tool_BANG_.call(null,ctx,"read"));
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
var map__22731 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__22731__$1 = cljs.core.__destructure_map(map__22731);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22731__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22731__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var mime_type = knoxx.backend.infra.routes.workspace_media.mime_type_for_path(relative,absolute);
var range_header = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.routes.workspace_media.request_header(request,"range");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.routes.workspace_media.request_header(request,"Range");
}
})());
try{var stat = (await knoxx.backend.domain.media.fs_stat_BANG_(shadow.esm.esm_import$node_fs$promises,absolute));
if(cljs.core.truth_(stat.isFile())){
} else {
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" is not a file")));
}

var total_size = stat.size;
var range = (cljs.core.truth_((await (async function (){var and__5160__auto__ = range_header;
if(cljs.core.truth_(and__5160__auto__)){
return (total_size > (0));
} else {
return and__5160__auto__;
}
})()))?knoxx.backend.infra.routes.workspace_media.parse_range_header(range_header,total_size):null);
var filename = knoxx.backend.domain.media.path_basename(shadow.esm.esm_import$node_path,absolute);
knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Content-Type",mime_type);

knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Accept-Ranges","bytes");

knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Cache-Control","private, max-age=0");

knoxx.backend.infra.routes.workspace_media.reply_header_BANG_(reply,"Content-Disposition",knoxx.backend.infra.routes.workspace_media.safe_content_disposition(filename));

return knoxx.backend.infra.routes.workspace_media.send_media_stream_BANG_(reply,absolute,total_size,range);
}catch (e22736){var err = e22736;
var G__22737 = reply;
var G__22739 = (404);
var G__22740 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22737,G__22739,G__22740) : json_response_BANG_.call(null,G__22737,G__22739,G__22740));
}}catch (e22730){var err = e22730;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}});
knoxx.backend.infra.routes.workspace_media.register_workspace_media_routes_BANG_ = (function knoxx$backend$infra$routes$workspace_media$register_workspace_media_routes_BANG_(app,runtime,config,p__22752){
var map__22753 = p__22752;
var map__22753__$1 = cljs.core.__destructure_map(map__22753);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22753__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22753__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22753__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22753__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22753__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
var G__22755 = app;
var G__22756 = "GET";
var G__22757 = "/api/workspace-media/raw";
var G__22758 = (function (request,reply){
var G__22763 = runtime;
var G__22764 = request;
var G__22765 = reply;
var G__22766 = (function (ctx){
return knoxx.backend.infra.routes.workspace_media.serve_workspace_media_BANG_(runtime,config,request,reply,ctx,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),error_response_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),ensure_tool_BANG_], null));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__22763,G__22764,G__22765,G__22766) : with_request_context_BANG_.call(null,G__22763,G__22764,G__22765,G__22766));
});
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__22755,G__22756,G__22757,G__22758) : route_BANG_.call(null,G__22755,G__22756,G__22757,G__22758));
});
/**
 * Set of recognized audio file extensions.
 */
knoxx.backend.infra.routes.workspace_media.audio_extensions = (function knoxx$backend$infra$routes$workspace_media$audio_extensions(){
return new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 8, [".flac",null,".mp3",null,".ogg",null,".m4a",null,".wma",null,".wav",null,".aac",null,".opus",null], null), null);
});
knoxx.backend.infra.routes.workspace_media.audio_mime_type = (function knoxx$backend$infra$routes$workspace_media$audio_mime_type(ext){
var G__22792 = ext;
switch (G__22792) {
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
knoxx.backend.infra.routes.workspace_media.audio_file_entry_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$audio_file_entry_BANG_(entry,root_dir,base_relative,depth,max_depth){
var name = entry.name;
var abs_path = shadow.esm.esm_import$node_path.join(root_dir,name);
var rel_path = ((clojure.string.blank_QMARK_(base_relative))?name:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_relative)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)));
if(clojure.string.starts_with_QMARK_(name,".")){
return cljs.core.PersistentVector.EMPTY;
} else {
if(cljs.core.truth_(entry.isDirectory())){
return (await (await (async function (){var G__22807 = abs_path;
var G__22808 = rel_path;
var G__22809 = (depth + (1));
var G__22810 = max_depth;
return (knoxx.backend.infra.routes.workspace_media.walk_audio_files_BANG_.cljs$core$IFn$_invoke$arity$4 ? knoxx.backend.infra.routes.workspace_media.walk_audio_files_BANG_.cljs$core$IFn$_invoke$arity$4(G__22807,G__22808,G__22809,G__22810) : knoxx.backend.infra.routes.workspace_media.walk_audio_files_BANG_.call(null,G__22807,G__22808,G__22809,G__22810));
})()));
} else {
var ext = clojure.string.lower_case((await (async function (){var or__5162__auto__ = (await (async function (){var G__22815 = shadow.esm.esm_import$node_path.extname(name);
if((G__22815 == null)){
return null;
} else {
return clojure.string.trim(G__22815);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
if(cljs.core.contains_QMARK_(knoxx.backend.infra.routes.workspace_media.audio_extensions(),ext)){
try{var stat = (await shadow.esm.esm_import$node_fs$promises.stat(abs_path));
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"path","path",-188191168),rel_path,new cljs.core.Keyword(null,"ext","ext",-996964541),ext,new cljs.core.Keyword(null,"size","size",1098693007),stat.size,new cljs.core.Keyword(null,"modified","modified",-2134587826),stat.mtime.getTime(),new cljs.core.Keyword(null,"mime","mime",-1846414642),knoxx.backend.infra.routes.workspace_media.audio_mime_type(ext)], null)], null);
}catch (e22816){var _ = e22816;
return cljs.core.PersistentVector.EMPTY;
}} else {
return cljs.core.PersistentVector.EMPTY;
}

}
}
});
/**
 * Recursively walk a directory and collect audio file metadata.
 */
knoxx.backend.infra.routes.workspace_media.walk_audio_files_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$walk_audio_files_BANG_(root_dir,base_relative,depth,max_depth){
if((depth > max_depth)){
return cljs.core.PersistentVector.EMPTY;
} else {
try{var entries = cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1((await shadow.esm.esm_import$node_fs$promises.readdir(root_dir,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"withFileTypes","withFileTypes",474788010),true], null))))));
return cljs.core.vec(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.identity,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__22817_SHARP_){
return knoxx.backend.infra.routes.workspace_media.audio_file_entry_BANG_(p1__22817_SHARP_,root_dir,base_relative,depth,max_depth);
}),entries))))], 0)));
}catch (e22821){var _ = e22821;
return cljs.core.PersistentVector.EMPTY;
}}
});
knoxx.backend.infra.routes.workspace_media.register_workspace_media_routes = (function knoxx$backend$infra$routes$workspace_media$register_workspace_media_routes(app,runtime,config,handlers){
return knoxx.backend.infra.routes.workspace_media.register_workspace_media_routes_BANG_(app,runtime,config,handlers);
});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_list = (function knoxx$backend$infra$routes$workspace_media$handle_audio_library_list(runtime,config,p__22832){
var map__22834 = p__22832;
var map__22834__$1 = cljs.core.__destructure_map(map__22834);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22834__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22834__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22834__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22834__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
return (function (request,reply){
var G__22835 = runtime;
var G__22836 = request;
var G__22837 = reply;
var G__22838 = (function (ctx){
var G__22839 = runtime;
var G__22840 = config;
var G__22841 = request;
var G__22842 = reply;
var G__22843 = ctx;
var G__22844 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),error_response_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),ensure_tool_BANG_], null);
return (knoxx.backend.infra.routes.workspace_media.handle_audio_library_list_BANG_.cljs$core$IFn$_invoke$arity$6 ? knoxx.backend.infra.routes.workspace_media.handle_audio_library_list_BANG_.cljs$core$IFn$_invoke$arity$6(G__22839,G__22840,G__22841,G__22842,G__22843,G__22844) : knoxx.backend.infra.routes.workspace_media.handle_audio_library_list_BANG_.call(null,G__22839,G__22840,G__22841,G__22842,G__22843,G__22844));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__22835,G__22836,G__22837,G__22838) : with_request_context_BANG_.call(null,G__22835,G__22836,G__22837,G__22838));
});
});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_list_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$handle_audio_library_list_BANG_(runtime,config,request,reply,ctx,p__22860){
var map__22861 = p__22860;
var map__22861__$1 = cljs.core.__destructure_map(map__22861);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22861__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22861__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22861__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
try{if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"read") : ensure_tool_BANG_.call(null,ctx,"read"));
} else {
}

var subpath = (await (async function (){var or__5162__auto__ = (request["query"]["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var max_depth = (await (async function (){var d = parseInt((await (async function (){var or__5162__auto__ = (request["query"]["depth"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "3";
}
})()),(10));
if(cljs.core.truth_(isNaN(d))){
return (3);
} else {
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(d,(8));
}
})());
var scan_root = ((clojure.string.blank_QMARK_(subpath))?new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config):(await (async function (){var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(subpath);
var map__22881 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__22881__$1 = cljs.core.__destructure_map(map__22881);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22881__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
return absolute;
})()));
var rel_base = clojure.string.trim((await (async function (){var or__5162__auto__ = subpath;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var files = (await knoxx.backend.infra.routes.workspace_media.walk_audio_files_BANG_(scan_root,rel_base,(0),max_depth));
var sorted = cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"modified","modified",-2134587826),cljs.core._GT_,files));
var G__22882 = reply;
var G__22883 = (200);
var G__22884 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"root","root",-448657453),rel_base,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(sorted),new cljs.core.Keyword(null,"files","files",-472457450),sorted], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22882,G__22883,G__22884) : json_response_BANG_.call(null,G__22882,G__22883,G__22884));
}catch (e22868){var err = e22868;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("Error",err.name)){
var G__22869 = reply;
var G__22870 = (500);
var G__22871 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to scan audio library: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22869,G__22870,G__22871) : json_response_BANG_.call(null,G__22869,G__22870,G__22871));
} else {
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}
}});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir = (function knoxx$backend$infra$routes$workspace_media$handle_audio_library_ensure_dir(runtime,config,p__22885){
var map__22886 = p__22885;
var map__22886__$1 = cljs.core.__destructure_map(map__22886);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22886__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22886__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22886__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22886__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
return (function (request,reply){
var G__22887 = runtime;
var G__22888 = request;
var G__22889 = reply;
var G__22890 = (function (ctx){
var G__22891 = runtime;
var G__22892 = config;
var G__22893 = request;
var G__22894 = reply;
var G__22895 = ctx;
var G__22896 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),error_response_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),ensure_tool_BANG_], null);
return (knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir_BANG_.cljs$core$IFn$_invoke$arity$6 ? knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir_BANG_.cljs$core$IFn$_invoke$arity$6(G__22891,G__22892,G__22893,G__22894,G__22895,G__22896) : knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir_BANG_.call(null,G__22891,G__22892,G__22893,G__22894,G__22895,G__22896));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__22887,G__22888,G__22889,G__22890) : with_request_context_BANG_.call(null,G__22887,G__22888,G__22889,G__22890));
});
});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$handle_audio_library_ensure_dir_BANG_(runtime,config,request,reply,ctx,p__22905){
var map__22906 = p__22905;
var map__22906__$1 = cljs.core.__destructure_map(map__22906);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22906__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22906__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22906__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
try{if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"write") : ensure_tool_BANG_.call(null,ctx,"write"));
} else {
}

var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var dir_path = (await (async function (){var or__5162__auto__ = (body["path"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(dir_path)){
var G__22916 = reply;
var G__22917 = (400);
var G__22918 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"path is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22916,G__22917,G__22918) : json_response_BANG_.call(null,G__22916,G__22917,G__22918));
} else {
var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(dir_path);
var map__22920 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,normalized);
var map__22920__$1 = cljs.core.__destructure_map(map__22920);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22920__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22920__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
try{(await shadow.esm.esm_import$node_fs$promises.mkdir(absolute,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"recursive","recursive",718885872),true], null))));

var G__22925 = reply;
var G__22926 = (200);
var G__22927 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"path","path",-188191168),relative], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22925,G__22926,G__22927) : json_response_BANG_.call(null,G__22925,G__22926,G__22927));
}catch (e22921){var err = e22921;
var G__22922 = reply;
var G__22923 = (500);
var G__22924 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Failed to create directory: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22922,G__22923,G__22924) : json_response_BANG_.call(null,G__22922,G__22923,G__22924));
}}
}catch (e22911){var err = e22911;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename = (function knoxx$backend$infra$routes$workspace_media$handle_audio_library_rename(runtime,config,p__22944){
var map__22948 = p__22944;
var map__22948__$1 = cljs.core.__destructure_map(map__22948);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22948__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22948__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var with_request_context_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22948__$1,new cljs.core.Keyword(null,"with-request-context!","with-request-context!",1089168046));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22948__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
return (function (request,reply){
var G__22950 = runtime;
var G__22951 = request;
var G__22952 = reply;
var G__22953 = (function (ctx){
var G__22954 = runtime;
var G__22955 = config;
var G__22956 = request;
var G__22957 = reply;
var G__22958 = ctx;
var G__22959 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"json-response!","json-response!",103570476),json_response_BANG_,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341),error_response_BANG_,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334),ensure_tool_BANG_], null);
return (knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename_BANG_.cljs$core$IFn$_invoke$arity$6 ? knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename_BANG_.cljs$core$IFn$_invoke$arity$6(G__22954,G__22955,G__22956,G__22957,G__22958,G__22959) : knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename_BANG_.call(null,G__22954,G__22955,G__22956,G__22957,G__22958,G__22959));
});
return (with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4 ? with_request_context_BANG_.cljs$core$IFn$_invoke$arity$4(G__22950,G__22951,G__22952,G__22953) : with_request_context_BANG_.call(null,G__22950,G__22951,G__22952,G__22953));
});
});
knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename_BANG_ = (async function knoxx$backend$infra$routes$workspace_media$handle_audio_library_rename_BANG_(runtime,config,request,reply,ctx,p__22966){
var map__22969 = p__22966;
var map__22969__$1 = cljs.core.__destructure_map(map__22969);
var json_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22969__$1,new cljs.core.Keyword(null,"json-response!","json-response!",103570476));
var error_response_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22969__$1,new cljs.core.Keyword(null,"error-response!","error-response!",-856339341));
var ensure_tool_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22969__$1,new cljs.core.Keyword(null,"ensure-tool!","ensure-tool!",-869161334));
try{if(cljs.core.truth_(ctx)){
(ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2 ? ensure_tool_BANG_.cljs$core$IFn$_invoke$arity$2(ctx,"write") : ensure_tool_BANG_.call(null,ctx,"write"));
} else {
}

var body = (await (async function (){var or__5162__auto__ = (request["body"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (new Object());
}
})());
var from_path = (await (async function (){var or__5162__auto__ = (body["from"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var to_path = (await (async function (){var or__5162__auto__ = (body["to"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(from_path)){
var G__22971 = reply;
var G__22972 = (400);
var G__22973 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"from is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22971,G__22972,G__22973) : json_response_BANG_.call(null,G__22971,G__22972,G__22973));
} else {
if(clojure.string.blank_QMARK_(to_path)){
var G__22975 = reply;
var G__22976 = (400);
var G__22977 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),"to is required"], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22975,G__22976,G__22977) : json_response_BANG_.call(null,G__22975,G__22976,G__22977));
} else {
var from_norm = knoxx.backend.domain.media.normalize_tool_path_arg(from_path);
var to_norm = knoxx.backend.domain.media.normalize_tool_path_arg(to_path);
var map__22980 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,from_norm);
var map__22980__$1 = cljs.core.__destructure_map(map__22980);
var from_abs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22980__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var map__22981 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,to_norm);
var map__22981__$1 = cljs.core.__destructure_map(map__22981);
var to_abs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22981__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
try{(await shadow.esm.esm_import$node_fs$promises.rename(from_abs,to_abs));

var G__22991 = reply;
var G__22992 = (200);
var G__22993 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"from","from",1815293044),from_norm,new cljs.core.Keyword(null,"to","to",192099007),to_norm], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22991,G__22992,G__22993) : json_response_BANG_.call(null,G__22991,G__22992,G__22993));
}catch (e22986){var err = e22986;
var G__22987 = reply;
var G__22988 = (500);
var G__22989 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+"Rename failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
return (json_response_BANG_.cljs$core$IFn$_invoke$arity$3 ? json_response_BANG_.cljs$core$IFn$_invoke$arity$3(G__22987,G__22988,G__22989) : json_response_BANG_.call(null,G__22987,G__22988,G__22989));
}
}
}
}catch (e22970){var err = e22970;
return (error_response_BANG_.cljs$core$IFn$_invoke$arity$2 ? error_response_BANG_.cljs$core$IFn$_invoke$arity$2(reply,err) : error_response_BANG_.call(null,reply,err));
}});
/**
 * Routes for the broadcast studio audio library.
 */
knoxx.backend.infra.routes.workspace_media.register_audio_library_routes_BANG_ = (function knoxx$backend$infra$routes$workspace_media$register_audio_library_routes_BANG_(app,runtime,config,helpers){
var map__22997 = helpers;
var map__22997__$1 = cljs.core.__destructure_map(map__22997);
var route_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22997__$1,new cljs.core.Keyword(null,"route!","route!",-1286958144));
var G__22999_23078 = app;
var G__23000_23079 = "GET";
var G__23001_23080 = "/api/workspace-media/audio-library";
var G__23002_23081 = knoxx.backend.infra.routes.workspace_media.handle_audio_library_list(runtime,config,helpers);
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__22999_23078,G__23000_23079,G__23001_23080,G__23002_23081) : route_BANG_.call(null,G__22999_23078,G__23000_23079,G__23001_23080,G__23002_23081));

var G__23004_23083 = app;
var G__23005_23084 = "POST";
var G__23006_23085 = "/api/workspace-media/audio-library/ensure-dir";
var G__23007_23086 = knoxx.backend.infra.routes.workspace_media.handle_audio_library_ensure_dir(runtime,config,helpers);
(route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__23004_23083,G__23005_23084,G__23006_23085,G__23007_23086) : route_BANG_.call(null,G__23004_23083,G__23005_23084,G__23006_23085,G__23007_23086));

var G__23008 = app;
var G__23009 = "POST";
var G__23010 = "/api/workspace-media/audio-library/rename";
var G__23011 = knoxx.backend.infra.routes.workspace_media.handle_audio_library_rename(runtime,config,helpers);
return (route_BANG_.cljs$core$IFn$_invoke$arity$4 ? route_BANG_.cljs$core$IFn$_invoke$arity$4(G__23008,G__23009,G__23010,G__23011) : route_BANG_.call(null,G__23008,G__23009,G__23010,G__23011));
});

//# sourceMappingURL=knoxx.backend.infra.routes.workspace_media.js.map
