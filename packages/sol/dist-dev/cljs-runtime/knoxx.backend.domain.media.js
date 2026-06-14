import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.document_state.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.actor.credentials.js";
import "./knoxx.backend.domain.media.remote_client.js";
import "./shadow.esm.esm_import$node_child_process.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_os.js";
import "./shadow.esm.esm_import$node_path.js";
import "./shadow.esm.esm_import$node_util.js";
goog.provide('knoxx.backend.domain.media');
knoxx.backend.domain.media.exec_file_async = shadow.esm.esm_import$node_util.promisify(shadow.esm.esm_import$node_child_process.execFile);
knoxx.backend.domain.media.workspace_media_max_bytes = (((20) * (1024)) * (1024));
knoxx.backend.domain.media.multimodal_upload_max_bytes = (((25) * (1024)) * (1024));
knoxx.backend.domain.media.audio_render_max_bytes = (((50) * (1024)) * (1024));
/**
 * Detect Discord CDN attachment URLs that require bot token auth.
 */
knoxx.backend.domain.media.source_discord_cdn_url_QMARK_ = (function knoxx$backend$domain$media$source_discord_cdn_url_QMARK_(value){
var G__27849 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value));
if((G__27849 == null)){
return null;
} else {
return clojure.string.includes_QMARK_(G__27849,"cdn.discordapp.com/attachments");
}
});
/**
 * Get Discord bot token from the current actor credential.
 */
knoxx.backend.domain.media.discord_bot_token_BANG_ = (async function knoxx$backend$domain$media$discord_bot_token_BANG_(runtime){
var credential = (await knoxx.backend.domain.actor.credentials.get_credential_BANG_(runtime,"discord_bot"));
return knoxx.backend.domain.actor.credentials.secret_value.cljs$core$IFn$_invoke$arity$variadic(credential,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"botToken","botToken",1995464313),new cljs.core.Keyword(null,"bot-token","bot-token",-851028031),new cljs.core.Keyword(null,"token","token",-1211463215)], 0));
});
knoxx.backend.domain.media.path_relative = (function knoxx$backend$domain$media$path_relative(node_path,from,to){
return node_path.relative(from,to);
});
knoxx.backend.domain.media.path_basename = (function knoxx$backend$domain$media$path_basename(node_path,path){
return node_path.basename(path);
});
knoxx.backend.domain.media.path_resolve = (function knoxx$backend$domain$media$path_resolve(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27916 = arguments.length;
var i__5898__auto___27917 = (0);
while(true){
if((i__5898__auto___27917 < len__5897__auto___27916)){
args__5903__auto__.push((arguments[i__5898__auto___27917]));

var G__27919 = (i__5898__auto___27917 + (1));
i__5898__auto___27917 = G__27919;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic = (function (node_path,parts){
return (node_path["resolve"]).apply(node_path,cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(parts));
}));

(knoxx.backend.domain.media.path_resolve.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.media.path_resolve.cljs$lang$applyTo = (function (seq27865){
var G__27866 = cljs.core.first(seq27865);
var seq27865__$1 = cljs.core.next(seq27865);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27866,seq27865__$1);
}));

knoxx.backend.domain.media.path_is_absolute_QMARK_ = (function knoxx$backend$domain$media$path_is_absolute_QMARK_(node_path,path){
return node_path.isAbsolute(path);
});
knoxx.backend.domain.media.fs_read_file_BANG_ = (function knoxx$backend$domain$media$fs_read_file_BANG_(var_args){
var G__27878 = arguments.length;
switch (G__27878) {
case 2:
return knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (node_fs,path){
return node_fs.readFile(path);
}));

(knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (node_fs,path,encoding){
return node_fs.readFile(path,encoding);
}));

(knoxx.backend.domain.media.fs_read_file_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.media.fs_write_file_BANG_ = (function knoxx$backend$domain$media$fs_write_file_BANG_(var_args){
var G__27884 = arguments.length;
switch (G__27884) {
case 3:
return knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (node_fs,path,content){
return node_fs.writeFile(path,content);
}));

(knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (node_fs,path,content,encoding){
return node_fs.writeFile(path,content,encoding);
}));

(knoxx.backend.domain.media.fs_write_file_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.domain.media.fs_mkdir_BANG_ = (function knoxx$backend$domain$media$fs_mkdir_BANG_(node_fs,path,opts){
return node_fs.mkdir(path,opts);
});
knoxx.backend.domain.media.fs_stat_BANG_ = (function knoxx$backend$domain$media$fs_stat_BANG_(node_fs,path){
return node_fs.stat(path);
});
knoxx.backend.domain.media.os_tmpdir = (function knoxx$backend$domain$media$os_tmpdir(node_os){
return node_os.tmpdir();
});
knoxx.backend.domain.media.normalize_tool_path_arg = (function knoxx$backend$domain$media$normalize_tool_path_arg(value){
var G__27886 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var G__27886__$1 = (((G__27886 == null))?null:clojure.string.replace(G__27886,/^@/,""));
var G__27886__$2 = (((G__27886__$1 == null))?null:clojure.string.trim(G__27886__$1));
if((G__27886__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27886__$2);
}
});
/**
 * Normalize a user-provided relative path while keeping the media namespace's
 * path helpers qualified for tool call sites. The implementation delegates to
 * document-state/normalize-relative-path, which is imported above.
 */
knoxx.backend.domain.media.normalize_relative_path_arg = (function knoxx$backend$domain$media$normalize_relative_path_arg(value){
return knoxx.backend.infra.document_state.normalize_relative_path(value);
});
knoxx.backend.domain.media.workspace_media_mime_type = (function knoxx$backend$domain$media$workspace_media_mime_type(path){
var lower = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)));
if(((clojure.string.ends_with_QMARK_(lower,".png")) || (clojure.string.ends_with_QMARK_(lower,".apng")))){
return "image/png";
} else {
if(((clojure.string.ends_with_QMARK_(lower,".jpg")) || (clojure.string.ends_with_QMARK_(lower,".jpeg")))){
return "image/jpeg";
} else {
if(clojure.string.ends_with_QMARK_(lower,".gif")){
return "image/gif";
} else {
if(clojure.string.ends_with_QMARK_(lower,".webp")){
return "image/webp";
} else {
if(clojure.string.ends_with_QMARK_(lower,".svg")){
return "image/svg+xml";
} else {
if(((clojure.string.ends_with_QMARK_(lower,".mp3")) || (clojure.string.ends_with_QMARK_(lower,".mpeg")))){
return "audio/mpeg";
} else {
if(clojure.string.ends_with_QMARK_(lower,".wav")){
return "audio/wav";
} else {
if(clojure.string.ends_with_QMARK_(lower,".ogg")){
return "audio/ogg";
} else {
if(clojure.string.ends_with_QMARK_(lower,".m4a")){
return "audio/mp4";
} else {
if(clojure.string.ends_with_QMARK_(lower,".flac")){
return "audio/flac";
} else {
if(clojure.string.ends_with_QMARK_(lower,".aac")){
return "audio/aac";
} else {
if(clojure.string.ends_with_QMARK_(lower,".mp4")){
return "video/mp4";
} else {
if(clojure.string.ends_with_QMARK_(lower,".webm")){
return "video/webm";
} else {
if(((clojure.string.ends_with_QMARK_(lower,".mov")) || (clojure.string.ends_with_QMARK_(lower,".qt")))){
return "video/quicktime";
} else {
if(clojure.string.ends_with_QMARK_(lower,".avi")){
return "video/x-msvideo";
} else {
if(clojure.string.ends_with_QMARK_(lower,".pdf")){
return "application/pdf";
} else {
if(clojure.string.ends_with_QMARK_(lower,".md")){
return "text/markdown";
} else {
if(clojure.string.ends_with_QMARK_(lower,".txt")){
return "text/plain";
} else {
if(clojure.string.ends_with_QMARK_(lower,".csv")){
return "text/csv";
} else {
if(clojure.string.ends_with_QMARK_(lower,".json")){
return "application/json";
} else {
return null;

}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
});
knoxx.backend.domain.media.workspace_media_type = (function knoxx$backend$domain$media$workspace_media_type(mime_type){
if(clojure.string.starts_with_QMARK_(mime_type,"image/")){
return "image";
} else {
if(clojure.string.starts_with_QMARK_(mime_type,"audio/")){
return "audio";
} else {
if(clojure.string.starts_with_QMARK_(mime_type,"video/")){
return "video";
} else {
return "document";

}
}
}
});
knoxx.backend.domain.media.configured_media_root_records = (function knoxx$backend$domain$media$configured_media_root_records(node_path,config){
var music_root = (function (){var G__27889 = new cljs.core.Keyword(null,"music-library-root","music-library-root",1834434652).cljs$core$IFn$_invoke$arity$1(config);
var G__27889__$1 = (((G__27889 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27889)));
var G__27889__$2 = (((G__27889__$1 == null))?null:clojure.string.trim(G__27889__$1));
if((G__27889__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27889__$2);
}
})();
var extra_roots = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (raw){
var G__27890 = raw;
var G__27890__$1 = (((G__27890 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27890)));
var G__27890__$2 = (((G__27890__$1 == null))?null:clojure.string.trim(G__27890__$1));
if((G__27890__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27890__$2);
}
}),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"extra-workspace-roots","extra-workspace-roots",-21056439).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
return cljs.core.vec(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,entry){
if(cljs.core.truth_(cljs.core.some((function (p1__27888_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(p1__27888_SHARP_),new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(entry));
}),acc))){
return acc;
} else {
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(acc,entry);
}
}),cljs.core.PersistentVector.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2((cljs.core.truth_(music_root)?new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),"Music",new cljs.core.Keyword(null,"root","root",-448657453),knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([music_root], 0))], null)], null):null),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (raw_root){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),null,new cljs.core.Keyword(null,"root","root",-448657453),knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([raw_root], 0))], null);
}),extra_roots))));
});
knoxx.backend.domain.media.allowed_media_root_records = (function knoxx$backend$domain$media$allowed_media_root_records(node_path,config){
return cljs.core.vec(cljs.core.cons(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"alias","alias",-2039751630),null,new cljs.core.Keyword(null,"root","root",-448657453),knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config)], 0))], null),knoxx.backend.domain.media.configured_media_root_records(node_path,config)));
});
knoxx.backend.domain.media.media_root_relative_path = (function knoxx$backend$domain$media$media_root_relative_path(node_path,root,absolute){
var rel = knoxx.backend.domain.media.path_relative(node_path,root,absolute);
if(cljs.core.truth_((function (){var or__5162__auto__ = clojure.string.starts_with_QMARK_(rel,"..");
if(or__5162__auto__){
return or__5162__auto__;
} else {
return knoxx.backend.domain.media.path_is_absolute_QMARK_(node_path,rel);
}
})())){
return null;
} else {
return rel;
}
});
knoxx.backend.domain.media.resolve_workspace_media_path = (function knoxx$backend$domain$media$resolve_workspace_media_path(_runtime,config,raw_path){
var node_path = shadow.esm.esm_import$node_path;
var normalized = knoxx.backend.domain.media.normalize_tool_path_arg(raw_path);
var safe_path = (function (){var or__5162__auto__ = normalized;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var roots = knoxx.backend.domain.media.allowed_media_root_records(node_path,config);
var music_root = cljs.core.some((function (p1__27891_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("Music",new cljs.core.Keyword(null,"alias","alias",-2039751630).cljs$core$IFn$_invoke$arity$1(p1__27891_SHARP_))){
return p1__27891_SHARP_;
} else {
return null;
}
}),roots);
var absolute = (cljs.core.truth_(knoxx.backend.domain.media.path_is_absolute_QMARK_(node_path,safe_path))?knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([safe_path], 0)):(cljs.core.truth_((function (){var and__5160__auto__ = normalized;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = music_root;
if(cljs.core.truth_(and__5160__auto____$1)){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(normalized,"Music")) || (clojure.string.starts_with_QMARK_(normalized,"Music/")));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())?(function (){var suffix = cljs.core.subs.cljs$core$IFn$_invoke$arity$2(normalized,cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.count(normalized),(("Music/").length)));
return knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(music_root),suffix], 0));
})():knoxx.backend.domain.media.path_resolve.cljs$core$IFn$_invoke$arity$variadic(node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config),safe_path], 0))
));
var matched_root = cljs.core.some((function (root_record){
var temp__5825__auto__ = knoxx.backend.domain.media.media_root_relative_path(node_path,new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(root_record),absolute);
if(cljs.core.truth_(temp__5825__auto__)){
var rel = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"root-record","root-record",1371343754),root_record,new cljs.core.Keyword(null,"rel","rel",1378823488),rel], null);
} else {
return null;
}
}),roots);
var root_record = new cljs.core.Keyword(null,"root-record","root-record",1371343754).cljs$core$IFn$_invoke$arity$1(matched_root);
var rel_to_root = new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(matched_root);
var relative = (cljs.core.truth_(root_record)?(function (){var temp__5823__auto__ = new cljs.core.Keyword(null,"alias","alias",-2039751630).cljs$core$IFn$_invoke$arity$1(root_record);
if(cljs.core.truth_(temp__5823__auto__)){
var alias = temp__5823__auto__;
if(clojure.string.blank_QMARK_(rel_to_root)){
return alias;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(alias)+"/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(rel_to_root));
}
} else {
return rel_to_root;
}
})():null);
if(((clojure.string.blank_QMARK_(normalized)) || ((((matched_root == null)) || (clojure.string.blank_QMARK_(relative)))))){
throw (new Error("Path escapes allowed workspace roots"));
} else {
}

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547),new cljs.core.Keyword(null,"root","root",-448657453).cljs$core$IFn$_invoke$arity$1(root_record),new cljs.core.Keyword(null,"absolute","absolute",1655386478),absolute,new cljs.core.Keyword(null,"relative","relative",22796862),relative], null);
});
knoxx.backend.domain.media.source_http_url_QMARK_ = (function knoxx$backend$domain$media$source_http_url_QMARK_(value){
return cljs.core.boolean$(cljs.core.re_matches(/https?:\/\/.+/,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
});
knoxx.backend.domain.media.source_data_url_QMARK_ = (function knoxx$backend$domain$media$source_data_url_QMARK_(value){
return clojure.string.starts_with_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),"data:");
});
knoxx.backend.domain.media.source_file_url_QMARK_ = (function knoxx$backend$domain$media$source_file_url_QMARK_(value){
return clojure.string.starts_with_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),"file://");
});
knoxx.backend.domain.media.sanitize_mime_type = (function knoxx$backend$domain$media$sanitize_mime_type(value,fallback){
var raw = (function (){var G__27892 = value;
var G__27892__$1 = (((G__27892 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27892)));
var G__27892__$2 = (((G__27892__$1 == null))?null:clojure.string.trim(G__27892__$1));
if((G__27892__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27892__$2);
}
})();
var trimmed = (cljs.core.truth_(raw)?cljs.core.first(clojure.string.split.cljs$core$IFn$_invoke$arity$2(raw,/;/)):null);
var or__5162__auto__ = trimmed;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = fallback;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "application/octet-stream";
}
}
});
knoxx.backend.domain.media.mime_type__GT_extension = (function knoxx$backend$domain$media$mime_type__GT_extension(mime_type){
var G__27893 = knoxx.backend.domain.media.sanitize_mime_type(mime_type,null);
switch (G__27893) {
case "image/png":
return ".png";

break;
case "image/jpeg":
return ".jpg";

break;
case "image/gif":
return ".gif";

break;
case "image/webp":
return ".webp";

break;
case "image/svg+xml":
return ".svg";

break;
case "audio/mpeg":
return ".mp3";

break;
case "audio/wav":
return ".wav";

break;
case "audio/ogg":
return ".ogg";

break;
case "audio/mp4":
return ".m4a";

break;
case "audio/flac":
return ".flac";

break;
case "audio/aac":
return ".aac";

break;
case "video/mp4":
return ".mp4";

break;
case "video/webm":
return ".webm";

break;
case "video/quicktime":
return ".mov";

break;
case "video/x-msvideo":
return ".avi";

break;
case "application/pdf":
return ".pdf";

break;
case "text/plain":
return ".txt";

break;
case "text/markdown":
return ".md";

break;
case "text/csv":
return ".csv";

break;
case "application/json":
return ".json";

break;
default:
return ".bin";

}
});
knoxx.backend.domain.media.ensure_source_size_BANG_ = (function knoxx$backend$domain$media$ensure_source_size_BANG_(size,max_bytes,label){
if((size > max_bytes)){
throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" exceeds "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(max_bytes)+" bytes. Choose a smaller file or summarize it instead.")));
} else {
return null;
}
});
knoxx.backend.domain.media.buffer__GT_data_url = (function knoxx$backend$domain$media$buffer__GT_data_url(buffer,mime_type){
return (""+"data:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.sanitize_mime_type(mime_type,"application/octet-stream"))+";base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(buffer.toString("base64")));
});
knoxx.backend.domain.media.temp_media_dir_BANG_ = (async function knoxx$backend$domain$media$temp_media_dir_BANG_(_runtime,name){
var dir = shadow.esm.esm_import$node_path.join(knoxx.backend.domain.media.os_tmpdir(shadow.esm.esm_import$node_os),"knoxx-media",name);
(await knoxx.backend.domain.media.fs_mkdir_BANG_(shadow.esm.esm_import$node_fs$promises,dir,({"recursive": true})));

return dir;
});
knoxx.backend.domain.media.temp_file_path_BANG_ = (async function knoxx$backend$domain$media$temp_file_path_BANG_(runtime,name,ext){
var dir = (await knoxx.backend.domain.media.temp_media_dir_BANG_(runtime,name));
return shadow.esm.esm_import$node_path.join(dir,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_crypto.randomUUID())+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = ext;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))));
});
knoxx.backend.domain.media.infer_upload_filename = (function knoxx$backend$domain$media$infer_upload_filename(url,idx){
var pathname = (function (){try{return (new URL((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(url)))).pathname;
}catch (e27894){var _ = e27894;
return "";
}})();
var candidate = (function (){var G__27896 = pathname;
var G__27896__$1 = (((G__27896 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__27896,/\//));
var G__27896__$2 = (((G__27896__$1 == null))?null:cljs.core.last(G__27896__$1));
var G__27896__$3 = (((G__27896__$2 == null))?null:clojure.string.trim(G__27896__$2));
if((G__27896__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__27896__$3);
}
})();
var or__5162__auto__ = candidate;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+"attachment-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(idx)+".bin");
}
});
knoxx.backend.domain.media.load_media_source_BANG_ = (async function knoxx$backend$domain$media$load_media_source_BANG_(runtime,config,raw_source,max_bytes){
var source = (await (async function (){var or__5162__auto__ = knoxx.backend.domain.media.normalize_tool_path_arg(raw_source);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = raw_source;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(source)))){
return Promise.reject((new Error("source is required")));
} else {
if(knoxx.backend.domain.media.source_data_url_QMARK_(source)){
return Promise.resolve(knoxx.backend.domain.media.remote_client.decode_data_url_BANG_(source,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"max-bytes","max-bytes",-552902639),max_bytes,new cljs.core.Keyword(null,"label","label",1718410804),"Source media"], null)));
} else {
if(knoxx.backend.domain.media.source_http_url_QMARK_(source)){
var token_promise = (cljs.core.truth_(knoxx.backend.domain.media.source_discord_cdn_url_QMARK_(source))?knoxx.backend.domain.media.discord_bot_token_BANG_(runtime):Promise.resolve(null));
var token = (await token_promise);
return knoxx.backend.domain.media.remote_client.fetch_bytes_BANG_(knoxx.backend.domain.media.remote_client.client.cljs$core$IFn$_invoke$arity$0(),source,(await (async function (){var G__27899 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"max-bytes","max-bytes",-552902639),max_bytes,new cljs.core.Keyword(null,"label","label",1718410804),"Source media",new cljs.core.Keyword(null,"fallback-mime-type","fallback-mime-type",-717271244),knoxx.backend.domain.media.workspace_media_mime_type(source),new cljs.core.Keyword(null,"filename","filename",-1428840783),knoxx.backend.domain.media.infer_upload_filename(source,(0))], null);
if(cljs.core.truth_(token)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27899,new cljs.core.Keyword(null,"authorization","authorization",-166302136),(""+"Bot "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(token)));
} else {
return G__27899;
}
})()));
} else {
var map__27900 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,source);
var map__27900__$1 = cljs.core.__destructure_map(map__27900);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27900__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27900__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var mime_type = knoxx.backend.domain.media.sanitize_mime_type(knoxx.backend.domain.media.workspace_media_mime_type(relative),knoxx.backend.domain.media.workspace_media_mime_type(absolute));
var stat = (await knoxx.backend.domain.media.fs_stat_BANG_(shadow.esm.esm_import$node_fs$promises,absolute));
var _ = (cljs.core.truth_(stat.isFile())?null:(await (async function (){throw (new Error((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" is not a file")))})()));
var ___$1 = knoxx.backend.domain.media.ensure_source_size_BANG_(stat.size,max_bytes,relative);
var buffer = (await knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2(shadow.esm.esm_import$node_fs$promises,absolute));
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"absolute-path","absolute-path",-1285195449),absolute,new cljs.core.Keyword(null,"relative","relative",22796862),relative,new cljs.core.Keyword(null,"buffer","buffer",617295198),buffer,new cljs.core.Keyword(null,"mime-type","mime-type",1058646439),mime_type,new cljs.core.Keyword(null,"filename","filename",-1428840783),knoxx.backend.domain.media.path_basename(shadow.esm.esm_import$node_path,absolute),new cljs.core.Keyword(null,"size","size",1098693007),buffer.length,new cljs.core.Keyword(null,"source-kind","source-kind",-1955827566),"workspace"], null);

}
}
}
});
knoxx.backend.domain.media.materialize_media_source_BANG_ = (async function knoxx$backend$domain$media$materialize_media_source_BANG_(runtime,config,raw_source,max_bytes){
var source = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,config,raw_source,max_bytes));
if(cljs.core.truth_(new cljs.core.Keyword(null,"absolute-path","absolute-path",-1285195449).cljs$core$IFn$_invoke$arity$1(source))){
return source;
} else {
var absolute_path = (await knoxx.backend.domain.media.temp_file_path_BANG_(runtime,"inputs",knoxx.backend.domain.media.mime_type__GT_extension(new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(source))));
(await knoxx.backend.domain.media.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3(shadow.esm.esm_import$node_fs$promises,absolute_path,new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(source)));

return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(source,new cljs.core.Keyword(null,"absolute-path","absolute-path",-1285195449),absolute_path);
}
});
knoxx.backend.domain.media.media_source__GT_content_part_BANG_ = (async function knoxx$backend$domain$media$media_source__GT_content_part_BANG_(runtime,config,raw_source,max_bytes){
var source = (await knoxx.backend.domain.media.load_media_source_BANG_(runtime,config,raw_source,max_bytes));
var mime_type = knoxx.backend.domain.media.sanitize_mime_type(new cljs.core.Keyword(null,"mime-type","mime-type",1058646439).cljs$core$IFn$_invoke$arity$1(source),"application/octet-stream");
var part_type = knoxx.backend.domain.media.workspace_media_type(mime_type);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"source","source",-433931539),source,new cljs.core.Keyword(null,"part","part",77757738),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),part_type,new cljs.core.Keyword(null,"data","data",-232669377),knoxx.backend.domain.media.buffer__GT_data_url(new cljs.core.Keyword(null,"buffer","buffer",617295198).cljs$core$IFn$_invoke$arity$1(source),mime_type),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),mime_type,new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(source),new cljs.core.Keyword(null,"size","size",1098693007),new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(source)], null)], null);
});
knoxx.backend.domain.media.clamp_dimension = (function knoxx$backend$domain$media$clamp_dimension(value,fallback,min_value,max_value){
var n = ((typeof value === 'number')?value:fallback);
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2(n,min_value),max_value);
});
knoxx.backend.domain.media.audio_visualization_result_BANG_ = (async function knoxx$backend$domain$media$audio_visualization_result_BANG_(runtime,config,raw_source,p__27906){
var map__27907 = p__27906;
var map__27907__$1 = cljs.core.__destructure_map(map__27907);
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27907__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var width = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27907__$1,new cljs.core.Keyword(null,"width","width",-384071477));
var height = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27907__$1,new cljs.core.Keyword(null,"height","height",1025178622));
var title = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27907__$1,new cljs.core.Keyword(null,"title","title",636505583));
var label = (await (async function (){var G__27908 = kind;
var G__27908__$1 = (((G__27908 instanceof cljs.core.Keyword))?G__27908.fqn:null);
switch (G__27908__$1) {
case "waveform":
return "waveform";

break;
default:
return "spectrogram";

}
})());
var out_width = knoxx.backend.domain.media.clamp_dimension(width,((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"waveform","waveform",1355199399)))?(1200):(1024)),(256),(4096));
var out_height = knoxx.backend.domain.media.clamp_dimension(height,((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"waveform","waveform",1355199399)))?(320):(640)),(128),(2048));
var source = (await knoxx.backend.domain.media.materialize_media_source_BANG_(runtime,config,raw_source,knoxx.backend.domain.media.audio_render_max_bytes));
var base_name = (await (async function (){var or__5162__auto__ = title;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (await (async function (){var G__27909 = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(source);
if((G__27909 == null)){
return null;
} else {
return clojure.string.replace(G__27909,/\.[^.]+$/,"");
}
})());
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "audio";
}
}
})());
var output_path = (await knoxx.backend.domain.media.temp_file_path_BANG_(runtime,"renders",".png"));
var filter_expr = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"waveform","waveform",1355199399)))?(""+"showwavespic=s="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(out_width)+"x"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(out_height)+":colors=0x7dd3fc"):(""+"showspectrumpic=s="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(out_width)+"x"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(out_height)+":legend=disabled"));
var args = cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, ["-y","-i",new cljs.core.Keyword(null,"absolute-path","absolute-path",-1285195449).cljs$core$IFn$_invoke$arity$1(source),"-lavfi",filter_expr,"-frames:v","1",output_path], null));
var _ = (await (await (async function (){var G__27910 = "ffmpeg";
var G__27911 = args;
var G__27912 = ({"timeout": (120000), "maxBuffer": (1048576)});
return (knoxx.backend.domain.media.exec_file_async.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.media.exec_file_async.cljs$core$IFn$_invoke$arity$3(G__27910,G__27911,G__27912) : knoxx.backend.domain.media.exec_file_async.call(null,G__27910,G__27911,G__27912));
})()));
var buffer = (await knoxx.backend.domain.media.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2(shadow.esm.esm_import$node_fs$promises,output_path));
var filename = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base_name)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+".png");
var part = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),"image",new cljs.core.Keyword(null,"data","data",-232669377),knoxx.backend.domain.media.buffer__GT_data_url(buffer,"image/png"),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),"image/png",new cljs.core.Keyword(null,"filename","filename",-1428840783),filename,new cljs.core.Keyword(null,"size","size",1098693007),buffer.length], null);
return knoxx.backend.domain.text.tool_text_result((""+"Rendered "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"filename","filename",-1428840783).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"relative","relative",22796862).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return raw_source;
}
}
})()))+"."),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"source","source",-433931539),raw_source,new cljs.core.Keyword(null,"kind","kind",-717265803),label,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [part], null)], null));
});

//# sourceMappingURL=knoxx.backend.domain.media.js.map
