import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
import "./shadow.esm.esm_import$node_child_process.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
import "./shadow.esm.esm_import$node_util.js";
goog.provide('knoxx.backend.domain.sandbox_container');
knoxx.backend.domain.sandbox_container.exec_file_async = shadow.esm.esm_import$node_util.promisify(shadow.esm.esm_import$node_child_process.execFile);
knoxx.backend.domain.sandbox_container.sandbox_label_prefix = "openhax.knoxx.sandbox";
knoxx.backend.domain.sandbox_container.sandbox_max_buffer_bytes = (((2) * (1024)) * (1024));
knoxx.backend.domain.sandbox_container.create_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ttl_seconds","ttl_seconds",-1187241031),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Requested sandbox lifetime in seconds."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(60),new cljs.core.Keyword(null,"max","max",61366548),(86400)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"image","image",-58725096),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional container image override."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.sandbox_container.id_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sandbox_id","sandbox_id",244665261),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Sandbox id returned by sandbox_container.create."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.sandbox_container.exec_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sandbox_id","sandbox_id",244665261),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Sandbox id returned by sandbox_container.create."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"command","command",-894540724),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Shell command to execute inside the sandbox workdir."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"timeout_ms","timeout_ms",70221217),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Command timeout in milliseconds."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(1000),new cljs.core.Keyword(null,"max","max",61366548),(300000)], null)], null)], null)], null);
knoxx.backend.domain.sandbox_container.read_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sandbox_id","sandbox_id",244665261),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Sandbox id returned by sandbox_container.create."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"path","path",-188191168),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Relative path inside the sandbox workdir."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"max_chars","max_chars",667525949),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum characters to return."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"int","int",-1741416922),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(200),new cljs.core.Keyword(null,"max","max",61366548),(20000)], null)], null)], null)], null);
knoxx.backend.domain.sandbox_container.write_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sandbox_id","sandbox_id",244665261),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Sandbox id returned by sandbox_container.create."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"path","path",-188191168),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Relative path inside the sandbox workdir."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"UTF-8 text content to write."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.sandbox_container.commit_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sandbox_id","sandbox_id",244665261),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Sandbox id returned by sandbox_container.create."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Git commit message."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.sandbox_container.shell_single_quote = (function knoxx$backend$domain$sandbox_container$shell_single_quote(value){
return (""+"'"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/'/,"'\"'\"'"))+"'");
});
knoxx.backend.domain.sandbox_container.base64_utf8 = (function knoxx$backend$domain$sandbox_container$base64_utf8(text){
return Buffer.from((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),"utf8").toString("base64");
});
knoxx.backend.domain.sandbox_container.path_resolve = (function knoxx$backend$domain$sandbox_container$path_resolve(var_args){
var args__5903__auto__ = [];
var len__5897__auto___27827 = arguments.length;
var i__5898__auto___27828 = (0);
while(true){
if((i__5898__auto___27828 < len__5897__auto___27827)){
args__5903__auto__.push((arguments[i__5898__auto___27828]));

var G__27829 = (i__5898__auto___27828 + (1));
i__5898__auto___27828 = G__27829;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((1) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((1)),(0),null)):null);
return knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),argseq__5904__auto__);
});

(knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic = (function (node_path,parts){
return (node_path["resolve"]).apply(node_path,cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(parts));
}));

(knoxx.backend.domain.sandbox_container.path_resolve.cljs$lang$maxFixedArity = (1));

/** @this {Function} */
(knoxx.backend.domain.sandbox_container.path_resolve.cljs$lang$applyTo = (function (seq27515){
var G__27516 = cljs.core.first(seq27515);
var seq27515__$1 = cljs.core.next(seq27515);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__27516,seq27515__$1);
}));

knoxx.backend.domain.sandbox_container.fs_mkdir_BANG_ = (function knoxx$backend$domain$sandbox_container$fs_mkdir_BANG_(node_fs,path,opts){
return node_fs.mkdir(path,opts);
});
knoxx.backend.domain.sandbox_container.fs_read_file_BANG_ = (function knoxx$backend$domain$sandbox_container$fs_read_file_BANG_(var_args){
var G__27529 = arguments.length;
switch (G__27529) {
case 2:
return knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (node_fs,path){
return node_fs.readFile(path);
}));

(knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (node_fs,path,encoding){
return node_fs.readFile(path,encoding);
}));

(knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.domain.sandbox_container.fs_write_file_BANG_ = (function knoxx$backend$domain$sandbox_container$fs_write_file_BANG_(var_args){
var G__27536 = arguments.length;
switch (G__27536) {
case 3:
return knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (node_fs,path,content){
return node_fs.writeFile(path,content);
}));

(knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (node_fs,path,content,encoding){
return node_fs.writeFile(path,content,encoding);
}));

(knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.domain.sandbox_container.docker_bin = (function knoxx$backend$domain$sandbox_container$docker_bin(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-docker-bin","sandbox-docker-bin",1250465191).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "docker";
}
});
knoxx.backend.domain.sandbox_container.sandbox_container_name = (function knoxx$backend$domain$sandbox_container$sandbox_container_name(sandbox_id){
return (""+"knoxx-sandbox-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id));
});
knoxx.backend.domain.sandbox_container.sandbox_metadata_path = (function knoxx$backend$domain$sandbox_container$sandbox_metadata_path(runtime,config,sandbox_id){
return knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic(shadow.esm.esm_import$node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(knoxx.backend.domain.sandbox_container.sandbox_host_dir.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.sandbox_container.sandbox_host_dir.cljs$core$IFn$_invoke$arity$3(runtime,config,sandbox_id) : knoxx.backend.domain.sandbox_container.sandbox_host_dir.call(null,runtime,config,sandbox_id)),".knoxx-sandbox.json"], 0));
});
knoxx.backend.domain.sandbox_container.sandbox_build_context = (function knoxx$backend$domain$sandbox_container$sandbox_build_context(_runtime,config){
return knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic(shadow.esm.esm_import$node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([process.cwd(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-build-context","sandbox-build-context",-1046564842).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ".";
}
})()], 0));
});
knoxx.backend.domain.sandbox_container.sandbox_dockerfile = (function knoxx$backend$domain$sandbox_container$sandbox_dockerfile(_runtime,config){
return knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic(shadow.esm.esm_import$node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([process.cwd(),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-dockerfile","sandbox-dockerfile",-1861024314).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "docker/sandbox/Dockerfile";
}
})()], 0));
});
knoxx.backend.domain.sandbox_container.sandbox_host_dir = (function knoxx$backend$domain$sandbox_container$sandbox_host_dir(_runtime,config,sandbox_id){
return knoxx.backend.domain.sandbox_container.path_resolve.cljs$core$IFn$_invoke$arity$variadic(shadow.esm.esm_import$node_path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"sandbox-root-dir","sandbox-root-dir",-246015478).cljs$core$IFn$_invoke$arity$1(config),sandbox_id], 0));
});
knoxx.backend.domain.sandbox_container.sandbox_workdir = (function knoxx$backend$domain$sandbox_container$sandbox_workdir(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-workdir","sandbox-workdir",-1309321735).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/workspace";
}
});
knoxx.backend.domain.sandbox_container.sandbox_user = (function knoxx$backend$domain$sandbox_container$sandbox_user(config){
var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-user","sandbox-user",-1538943230).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "1000:1000";
}
});
knoxx.backend.domain.sandbox_container.clamp_ttl_seconds = (function knoxx$backend$domain$sandbox_container$clamp_ttl_seconds(config,ttl_seconds){
var default_ttl = cljs.core.max.cljs$core$IFn$_invoke$arity$2((60),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-default-ttl-seconds","sandbox-default-ttl-seconds",496927585).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1800);
}
})());
var max_ttl = cljs.core.max.cljs$core$IFn$_invoke$arity$2(default_ttl,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"sandbox-max-ttl-seconds","sandbox-max-ttl-seconds",-1582249113).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (86400);
}
})());
var requested = ((typeof ttl_seconds === 'number')?ttl_seconds:default_ttl);
return cljs.core.min.cljs$core$IFn$_invoke$arity$2(cljs.core.max.cljs$core$IFn$_invoke$arity$2((requested | 0),(60)),max_ttl);
});
knoxx.backend.domain.sandbox_container.normalize_sandbox_path = (function knoxx$backend$domain$sandbox_container$normalize_sandbox_path(raw_path){
var path = (function (){var G__27573 = raw_path;
var G__27573__$1 = (((G__27573 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27573)));
var G__27573__$2 = (((G__27573__$1 == null))?null:clojure.string.trim(G__27573__$1));
if((G__27573__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27573__$2);
}
})();
if(cljs.core.truth_(path)){
} else {
throw (new Error("path is required"));
}

if(((clojure.string.starts_with_QMARK_(path,"/")) || (((clojure.string.includes_QMARK_(path,"../")) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(path,"..")) || (clojure.string.starts_with_QMARK_(path,"../")))))))){
throw (new Error("sandbox paths must stay relative to the sandbox workdir"));
} else {
}

return path;
});
knoxx.backend.domain.sandbox_container.exec_file_result_BANG_ = (async function knoxx$backend$domain$sandbox_container$exec_file_result_BANG_(exec_file_async,bin,args,opts){
try{var result = (await (await (async function (){var G__27587 = bin;
var G__27588 = cljs.core.clj__GT_js(args);
var G__27589 = cljs.core.clj__GT_js(cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"maxBuffer","maxBuffer",-260753686),knoxx.backend.domain.sandbox_container.sandbox_max_buffer_bytes], null),opts], 0)));
return (exec_file_async.cljs$core$IFn$_invoke$arity$3 ? exec_file_async.cljs$core$IFn$_invoke$arity$3(G__27587,G__27588,G__27589) : exec_file_async.call(null,G__27587,G__27588,G__27589));
})()));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"exitCode","exitCode",-2041193215),(0),new cljs.core.Keyword(null,"stdout","stdout",-531490018),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (result["stdout"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"stderr","stderr",-1571650309),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (result["stderr"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))], null);
}catch (e27579){var err = e27579;
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"ok","ok",967785236),false,new cljs.core.Keyword(null,"exitCode","exitCode",-2041193215),(await (async function (){var or__5162__auto__ = (err["code"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})()),new cljs.core.Keyword(null,"stdout","stdout",-531490018),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (err["stdout"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"stderr","stderr",-1571650309),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (err["stderr"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()))),new cljs.core.Keyword(null,"error","error",-978969032),(await (async function (){var or__5162__auto__ = err.message;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})())], null);
}});
knoxx.backend.domain.sandbox_container.docker_command_BANG_ = (function knoxx$backend$domain$sandbox_container$docker_command_BANG_(_runtime,config,args,opts){
return knoxx.backend.domain.sandbox_container.exec_file_result_BANG_(knoxx.backend.domain.sandbox_container.exec_file_async,knoxx.backend.domain.sandbox_container.docker_bin(config),args,opts);
});
knoxx.backend.domain.sandbox_container.sandbox_metadata_BANG_ = (async function knoxx$backend$domain$sandbox_container$sandbox_metadata_BANG_(runtime,config,sandbox_id){
var metadata_path = knoxx.backend.domain.sandbox_container.sandbox_metadata_path(runtime,config,sandbox_id);
try{var text = (await knoxx.backend.domain.sandbox_container.fs_read_file_BANG_.cljs$core$IFn$_invoke$arity$3(shadow.esm.esm_import$node_fs$promises,metadata_path,"utf8"));
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}catch (e27605){var _ = e27605;
return null;
}});
knoxx.backend.domain.sandbox_container.write_sandbox_metadata_BANG_ = (async function knoxx$backend$domain$sandbox_container$write_sandbox_metadata_BANG_(runtime,config,sandbox_id,metadata){
var metadata_path = knoxx.backend.domain.sandbox_container.sandbox_metadata_path(runtime,config,sandbox_id);
(await knoxx.backend.domain.sandbox_container.fs_write_file_BANG_.cljs$core$IFn$_invoke$arity$4(shadow.esm.esm_import$node_fs$promises,metadata_path,JSON.stringify(cljs.core.clj__GT_js(metadata),null,(2)),"utf8"));

return metadata;
});
knoxx.backend.domain.sandbox_container.refresh_sandbox_ttl_BANG_ = (async function knoxx$backend$domain$sandbox_container$refresh_sandbox_ttl_BANG_(runtime,config,sandbox_id){
var metadata = (await knoxx.backend.domain.sandbox_container.sandbox_metadata_BANG_(runtime,config,sandbox_id));
var created_at_ms = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAtMs","createdAtMs",10557286).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (await (async function (){var temp__5825__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(temp__5825__auto__)){
var created_at = temp__5825__auto__;
return Date.parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(created_at)));
} else {
return null;
}
})());
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return Date.now();
}
}
})());
var max_ttl_seconds = knoxx.backend.domain.sandbox_container.clamp_ttl_seconds(config,new cljs.core.Keyword(null,"sandbox-max-ttl-seconds","sandbox-max-ttl-seconds",-1582249113).cljs$core$IFn$_invoke$arity$1(config));
var max_expires_at = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"maxExpiresAt","maxExpiresAt",1371441108).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (created_at_ms + ((1000) * max_ttl_seconds));
}
})());
var ttl_seconds = knoxx.backend.domain.sandbox_container.clamp_ttl_seconds(config,new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723).cljs$core$IFn$_invoke$arity$1(metadata));
var requested_expires_at = (Date.now() + ((1000) * ttl_seconds));
var expires_at = cljs.core.min.cljs$core$IFn$_invoke$arity$2(requested_expires_at,max_expires_at);
return (await knoxx.backend.domain.sandbox_container.write_sandbox_metadata_BANG_(runtime,config,sandbox_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([metadata,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"createdAtMs","createdAtMs",10557286),created_at_ms,new cljs.core.Keyword(null,"maxExpiresAt","maxExpiresAt",1371441108),max_expires_at,new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723),ttl_seconds,new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),expires_at], null)], 0))));
});
knoxx.backend.domain.sandbox_container.ensure_sandbox_image_BANG_ = (async function knoxx$backend$domain$sandbox_container$ensure_sandbox_image_BANG_(runtime,config,image){
var map__27630 = (await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["image","inspect",image], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(30000)], null)));
var map__27630__$1 = cljs.core.__destructure_map(map__27630);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27630__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var stderr = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27630__$1,new cljs.core.Keyword(null,"stderr","stderr",-1571650309));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27630__$1,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.truth_(ok)){
return true;
} else {
var dockerfile = knoxx.backend.domain.sandbox_container.sandbox_dockerfile(runtime,config);
var build_context = knoxx.backend.domain.sandbox_container.sandbox_build_context(runtime,config);
if(((clojure.string.includes_QMARK_(stderr,"No such image")) || (((clojure.string.includes_QMARK_(stderr,"No such object")) || (clojure.string.includes_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(error)),"No such image")))))){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(image)),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sandbox-image","sandbox-image",-212790096).cljs$core$IFn$_invoke$arity$1(config))))){
var map__27633 = (await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, ["build","-t",image,"-f",dockerfile,build_context], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(1800000)], null)));
var map__27633__$1 = cljs.core.__destructure_map(map__27633);
var build_ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27633__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var build_stderr = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27633__$1,new cljs.core.Keyword(null,"stderr","stderr",-1571650309));
var build_error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27633__$1,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.truth_(build_ok)){
} else {
throw (new Error((""+"docker build failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = build_error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return build_stderr;
}
})())))));
}

return true;
} else {
return true;
}
} else {
throw (new Error((""+"docker image inspect failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return stderr;
}
})())))));
}
}
});
knoxx.backend.domain.sandbox_container.sandbox_inspect_BANG_ = (async function knoxx$backend$domain$sandbox_container$sandbox_inspect_BANG_(runtime,config,sandbox_id){
var container_name = knoxx.backend.domain.sandbox_container.sandbox_container_name(sandbox_id);
var map__27644 = (await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["inspect",container_name], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(30000)], null)));
var map__27644__$1 = cljs.core.__destructure_map(map__27644);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27644__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var stdout = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27644__$1,new cljs.core.Keyword(null,"stdout","stdout",-531490018));
var stderr = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27644__$1,new cljs.core.Keyword(null,"stderr","stderr",-1571650309));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27644__$1,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.not(ok)){
if(((clojure.string.includes_QMARK_(stderr,"No such object")) || (clojure.string.includes_QMARK_(stderr,"No such container")))){
return null;
} else {
throw (new Error((""+"docker inspect failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return stderr;
}
})())))));
}
} else {
var items = JSON.parse(stdout);
var item = (items[(0)]);
var labels = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (item["Config"]["Labels"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),false], 0));
var state = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (item["State"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var mounts = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = (item["Mounts"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var label_expires_at = parseInt((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(labels,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.sandbox_label_prefix)+".expiresAt"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "0";
}
})()))),(10));
var metadata = (await knoxx.backend.domain.sandbox_container.sandbox_metadata_BANG_(runtime,config,sandbox_id));
var expires_at = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = label_expires_at;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return (0);
}
}
})());
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"exitCode","exitCode",-2041193215),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"running","running",1554969103),new cljs.core.Keyword(null,"hostDir","hostDir",1501629811),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"image","image",-58725096),new cljs.core.Keyword(null,"workdir","workdir",212273434),new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101),new cljs.core.Keyword(null,"containerName","containerName",680835103)],[(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"ExitCode","ExitCode",-1322516790).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),expires_at,(((expires_at > (0)))?cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(((expires_at - Date.now()) / (1000)) | 0)):(0)),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"createdAt","createdAt",-936788).cljs$core$IFn$_invoke$arity$1(metadata);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (item["Created"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()),cljs.core.boolean$(new cljs.core.Keyword(null,"Running","Running",823284910).cljs$core$IFn$_invoke$arity$1(state)),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"Source","Source",1074771738).cljs$core$IFn$_invoke$arity$1(cljs.core.first(mounts));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"Status","Status",-1212030049).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()),(await (async function (){var or__5162__auto__ = (item["Config"]["Image"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()),(await (async function (){var or__5162__auto__ = (item["Config"]["WorkingDir"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.sandbox_container.sandbox_workdir(config);
}
})()),sandbox_id,container_name]);
}
});
knoxx.backend.domain.sandbox_container.sandbox_destroy_BANG_ = (async function knoxx$backend$domain$sandbox_container$sandbox_destroy_BANG_(runtime,config,sandbox_id){
var host_dir = knoxx.backend.domain.sandbox_container.sandbox_host_dir(runtime,config,sandbox_id);
var container_name = knoxx.backend.domain.sandbox_container.sandbox_container_name(sandbox_id);
try{(await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["rm","-f",container_name], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(30000)], null)));
}catch (e27711){var __27861 = e27711;
}
try{(await shadow.esm.esm_import$node_fs$promises.rm(host_dir,({"recursive": true, "force": true})));
}catch (e27712){var __27862 = e27712;
}
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101),sandbox_id,new cljs.core.Keyword(null,"containerName","containerName",680835103),container_name,new cljs.core.Keyword(null,"destroyed","destroyed",-427566535),true,new cljs.core.Keyword(null,"hostDir","hostDir",1501629811),host_dir], null);
});
knoxx.backend.domain.sandbox_container.ensure_live_sandbox_BANG_ = (async function knoxx$backend$domain$sandbox_container$ensure_live_sandbox_BANG_(runtime,config,sandbox_id){
var info = (await knoxx.backend.domain.sandbox_container.sandbox_inspect_BANG_(runtime,config,sandbox_id));
if(cljs.core.truth_(info)){
} else {
throw (new Error((""+"Sandbox not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id))));
}

if((((new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(info) > (0))) && ((Date.now() > new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(info))))){
(await knoxx.backend.domain.sandbox_container.sandbox_destroy_BANG_(runtime,config,sandbox_id));

throw (new Error((""+"Sandbox expired and was destroyed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id))));
} else {
var metadata = (await knoxx.backend.domain.sandbox_container.refresh_sandbox_ttl_BANG_(runtime,config,sandbox_id));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(info,new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(metadata),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723),cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(((new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246).cljs$core$IFn$_invoke$arity$1(metadata) - Date.now()) / (1000)) | 0))], 0));
}
});
knoxx.backend.domain.sandbox_container.sandbox_create_BANG_ = (async function knoxx$backend$domain$sandbox_container$sandbox_create_BANG_(runtime,config,p__27734){
var map__27735 = p__27734;
var map__27735__$1 = cljs.core.__destructure_map(map__27735);
var ttl_seconds = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27735__$1,new cljs.core.Keyword(null,"ttl-seconds","ttl-seconds",-1695652674));
var image = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27735__$1,new cljs.core.Keyword(null,"image","image",-58725096));
var sandbox_id = shadow.esm.esm_import$node_crypto.randomUUID();
var ttl = knoxx.backend.domain.sandbox_container.clamp_ttl_seconds(config,ttl_seconds);
var created_at_ms = Date.now();
var max_ttl_seconds = knoxx.backend.domain.sandbox_container.clamp_ttl_seconds(config,new cljs.core.Keyword(null,"sandbox-max-ttl-seconds","sandbox-max-ttl-seconds",-1582249113).cljs$core$IFn$_invoke$arity$1(config));
var max_expires_at = (created_at_ms + ((1000) * max_ttl_seconds));
var expires_at = cljs.core.min.cljs$core$IFn$_invoke$arity$2((created_at_ms + (ttl * (1000))),max_expires_at);
var host_dir = knoxx.backend.domain.sandbox_container.sandbox_host_dir(runtime,config,sandbox_id);
var container_name = knoxx.backend.domain.sandbox_container.sandbox_container_name(sandbox_id);
var workdir = knoxx.backend.domain.sandbox_container.sandbox_workdir(config);
var image__$1 = (await (async function (){var or__5162__auto__ = (await (async function (){var G__27740 = image;
var G__27740__$1 = (((G__27740 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27740)));
var G__27740__$2 = (((G__27740__$1 == null))?null:clojure.string.trim(G__27740__$1));
if((G__27740__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27740__$2);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"sandbox-image","sandbox-image",-212790096).cljs$core$IFn$_invoke$arity$1(config);
}
})());
var keepalive_cmd = "trap 'exit 0' TERM INT; while true; do sleep 3600; done";
(await knoxx.backend.domain.sandbox_container.ensure_sandbox_image_BANG_(runtime,config,image__$1));

(await knoxx.backend.domain.sandbox_container.fs_mkdir_BANG_(shadow.esm.esm_import$node_fs$promises,host_dir,({"recursive": true})));

var map__27741 = (await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 23, 5, cljs.core.PersistentVector.EMPTY_NODE, ["run","-d","--rm","--name",container_name,"--user",knoxx.backend.domain.sandbox_container.sandbox_user(config),"--workdir",workdir,"-e",(""+"HOME="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workdir)),"--label",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.sandbox_label_prefix)+"=true"),"--label",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.sandbox_label_prefix)+".id="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)),"--label",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.sandbox_label_prefix)+".expiresAt="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(expires_at)),"-v",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(host_dir)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(workdir)),image__$1,"sh","-lc",keepalive_cmd], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(180000)], null)));
var map__27741__$1 = cljs.core.__destructure_map(map__27741);
var ok = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27741__$1,new cljs.core.Keyword(null,"ok","ok",967785236));
var stderr = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27741__$1,new cljs.core.Keyword(null,"stderr","stderr",-1571650309));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27741__$1,new cljs.core.Keyword(null,"error","error",-978969032));
if(cljs.core.truth_(ok)){
} else {
throw (new Error((""+"docker run failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = error;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return stderr;
}
})())))));
}

(await knoxx.backend.domain.sandbox_container.write_sandbox_metadata_BANG_(runtime,config,sandbox_id,new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101),sandbox_id,new cljs.core.Keyword(null,"image","image",-58725096),image__$1,new cljs.core.Keyword(null,"createdAtMs","createdAtMs",10557286),created_at_ms,new cljs.core.Keyword(null,"maxExpiresAt","maxExpiresAt",1371441108),max_expires_at,new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723),ttl,new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()).toISOString(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),expires_at], null)));

return (await knoxx.backend.domain.sandbox_container.ensure_live_sandbox_BANG_(runtime,config,sandbox_id));
});
knoxx.backend.domain.sandbox_container.sandbox_exec_BANG_ = (async function knoxx$backend$domain$sandbox_container$sandbox_exec_BANG_(runtime,config,sandbox_id,command,timeout_ms){
var info = (await knoxx.backend.domain.sandbox_container.ensure_live_sandbox_BANG_(runtime,config,sandbox_id));
var result = (await knoxx.backend.domain.sandbox_container.docker_command_BANG_(runtime,config,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, ["exec","-w",new cljs.core.Keyword(null,"workdir","workdir",212273434).cljs$core$IFn$_invoke$arity$1(info),new cljs.core.Keyword(null,"containerName","containerName",680835103).cljs$core$IFn$_invoke$arity$1(info),"sh","-lc",command], null),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"timeout","timeout",-318625318),(await (async function (){var or__5162__auto__ = timeout_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (120000);
}
})())], null)));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101),sandbox_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"containerName","containerName",680835103),new cljs.core.Keyword(null,"containerName","containerName",680835103).cljs$core$IFn$_invoke$arity$1(info),new cljs.core.Keyword(null,"workdir","workdir",212273434),new cljs.core.Keyword(null,"workdir","workdir",212273434).cljs$core$IFn$_invoke$arity$1(info),new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723),new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723).cljs$core$IFn$_invoke$arity$1(info)], 0));
});
knoxx.backend.domain.sandbox_container.sandbox_create_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_create_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Creating sandbox container\u2026");

var result = (await knoxx.backend.domain.sandbox_container.sandbox_create_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"ttl-seconds","ttl-seconds",-1695652674),(params["ttl_seconds"]),new cljs.core.Keyword(null,"image","image",-58725096),(params["image"])], null)));
return knoxx.backend.domain.text.tool_text_result((""+"Created sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101).cljs$core$IFn$_invoke$arity$1(result))+" using "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"image","image",-58725096).cljs$core$IFn$_invoke$arity$1(result))+" with ~"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723).cljs$core$IFn$_invoke$arity$1(result))+"s remaining."),result);
});
knoxx.backend.domain.sandbox_container.sandbox_status_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_status_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Inspecting sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.ensure_live_sandbox_BANG_(runtime,config,sandbox_id));
if(cljs.core.truth_(result)){
return knoxx.backend.domain.text.tool_text_result((""+"Sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+" status="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(result))+", ttl="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ttlSeconds","ttlSeconds",1198851723).cljs$core$IFn$_invoke$arity$1(result))+"s"),result);
} else {
return knoxx.backend.domain.text.tool_text_result((""+"Sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+" not found."),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"sandboxId","sandboxId",-318732101),sandbox_id,new cljs.core.Keyword(null,"exists","exists",1312597120),false], null));
}
});
knoxx.backend.domain.sandbox_container.sandbox_exec_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_exec_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var command = (await (async function (){var or__5162__auto__ = (params["command"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var timeout_ms = (params["timeout_ms"]);
if(clojure.string.blank_QMARK_(sandbox_id)){
throw (new Error("sandbox_id is required"));
} else {
}

if(clojure.string.blank_QMARK_(clojure.string.trim(command))){
throw (new Error("command is required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Executing in sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.sandbox_exec_BANG_(runtime,config,sandbox_id,command,timeout_ms));
return knoxx.backend.domain.text.tool_text_result((""+"Sandbox exec exit="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"exitCode","exitCode",-2041193215).cljs$core$IFn$_invoke$arity$1(result))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result)))?null:(""+"\n\nstdout:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result),(8000)))))))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"stderr","stderr",-1571650309).cljs$core$IFn$_invoke$arity$1(result)))?null:(""+"\n\nstderr:\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"stderr","stderr",-1571650309).cljs$core$IFn$_invoke$arity$1(result),(8000)))))))),result);
});
knoxx.backend.domain.sandbox_container.sandbox_read_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_read_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var path = knoxx.backend.domain.sandbox_container.normalize_sandbox_path((params["path"]));
var max_chars = cljs.core.max.cljs$core$IFn$_invoke$arity$2((200),cljs.core.min.cljs$core$IFn$_invoke$arity$2((20000),(await (async function (){var or__5162__auto__ = (params["max_chars"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (6000);
}
})())));
var command = (""+"cat "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.shell_single_quote(path)));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Reading sandbox file "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.sandbox_exec_BANG_(runtime,config,sandbox_id,command,(60000)));
var vec__27798 = knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result),max_chars);
var content = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27798,(0),null);
var _ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27798,(1),null);
return knoxx.backend.domain.text.tool_text_result((""+"Sandbox file "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(content)),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"path","path",-188191168),path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"content","content",15833224),content], 0)));
});
knoxx.backend.domain.sandbox_container.sandbox_write_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_write_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var path = knoxx.backend.domain.sandbox_container.normalize_sandbox_path((params["path"]));
var content = (await (async function (){var or__5162__auto__ = (params["content"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var encoded = knoxx.backend.domain.sandbox_container.base64_utf8(content);
var command = (""+"mkdir -p $(dirname -- "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.shell_single_quote(path))+") && printf %s "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.shell_single_quote(encoded))+" | base64 -d > "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.shell_single_quote(path)));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Writing sandbox file "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.sandbox_exec_BANG_(runtime,config,sandbox_id,command,(60000)));
return knoxx.backend.domain.text.tool_text_result((""+"Wrote sandbox file "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path)),cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(result,new cljs.core.Keyword(null,"path","path",-188191168),path,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"bytes","bytes",1175866680),cljs.core.count(content)], 0)));
});
knoxx.backend.domain.sandbox_container.sandbox_commit_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_commit_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var message = (await (async function (){var or__5162__auto__ = (params["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "sandbox update";
}
})());
var command = (""+"if [ ! -d .git ]; then git init -q .; fi && "+"git config user.email sandbox@knoxx.local && "+"git config user.name 'Knoxx Sandbox' && "+"git add -A && "+"if git diff --cached --quiet; then echo 'No staged changes to commit'; "+"else git commit -m "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.sandbox_container.shell_single_quote(message))+"; fi && "+"git status --short --branch");
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Committing sandbox workspace for "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.sandbox_exec_BANG_(runtime,config,sandbox_id,command,(120000)));
return knoxx.backend.domain.text.tool_text_result((""+"Sandbox commit exit="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"exitCode","exitCode",-2041193215).cljs$core$IFn$_invoke$arity$1(result))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result)))?null:(""+"\n\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.first(knoxx.backend.domain.text.clip_text.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result),(8000)))))))),result);
});
knoxx.backend.domain.sandbox_container.sandbox_destroy_execute = (async function knoxx$backend$domain$sandbox_container$sandbox_destroy_execute(runtime,config,_tool_call_id,params,a,b,c){
var on_update = (await (async function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.fn_QMARK_(b))?b:null);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.fn_QMARK_(c)){
return c;
} else {
return null;
}
}
}
})());
var sandbox_id = (await (async function (){var or__5162__auto__ = (params["sandbox_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["sandboxId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Destroying sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)+"\u2026"));

var result = (await knoxx.backend.domain.sandbox_container.sandbox_destroy_BANG_(runtime,config,sandbox_id));
return knoxx.backend.domain.text.tool_text_result((""+"Destroyed sandbox "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sandbox_id)),result);
});
knoxx.backend.domain.sandbox_container.sandbox_create_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.create","Sandbox Create","Create a TTL-bound sandbox container for isolated development work.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Create a temporary docker-backed sandbox when you need coding or shell access without touching the live Knoxx source tree.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.create_params,knoxx.backend.domain.sandbox_container.sandbox_create_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_status_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.status","Sandbox Status","Inspect sandbox container runtime status and remaining TTL.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Inspect sandbox container runtime status and remaining TTL.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.id_params,knoxx.backend.domain.sandbox_container.sandbox_status_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_exec_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.exec","Sandbox Exec","Execute a shell command inside the sandbox workdir using docker exec.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Execute a shell command inside the sandbox workdir using docker exec.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.exec_params,knoxx.backend.domain.sandbox_container.sandbox_exec_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_read_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.read","Sandbox Read","Read a UTF-8 text file from the sandbox workdir.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Read a UTF-8 text file from the sandbox workdir.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.read_params,knoxx.backend.domain.sandbox_container.sandbox_read_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_write_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.write","Sandbox Write","Write a UTF-8 text file into the sandbox workdir.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Write a UTF-8 text file into the sandbox workdir.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.write_params,knoxx.backend.domain.sandbox_container.sandbox_write_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_commit_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.commit","Sandbox Commit","Create a git commit inside the sandbox workdir.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Create a git commit inside the sandbox workdir.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.commit_params,knoxx.backend.domain.sandbox_container.sandbox_commit_execute], 0));
knoxx.backend.domain.sandbox_container.sandbox_destroy_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"sandbox_container.destroy","Sandbox Destroy","Destroy a sandbox container and remove its temporary workspace.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Destroy a sandbox container and remove its temporary workspace.",cljs.core.PersistentVector.EMPTY,knoxx.backend.domain.sandbox_container.id_params,knoxx.backend.domain.sandbox_container.sandbox_destroy_execute], 0));
knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools = (function knoxx$backend$domain$sandbox_container$create_sandbox_custom_tools(var_args){
var G__27815 = arguments.length;
switch (G__27815) {
case 2:
return knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (tool_id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,tool_id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("sandbox_container.create"))?knoxx.backend.domain.sandbox_container.sandbox_create_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.status"))?knoxx.backend.domain.sandbox_container.sandbox_status_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.exec"))?knoxx.backend.domain.sandbox_container.sandbox_exec_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.read"))?knoxx.backend.domain.sandbox_container.sandbox_read_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.write"))?knoxx.backend.domain.sandbox_container.sandbox_write_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.commit"))?knoxx.backend.domain.sandbox_container.sandbox_commit_tool(runtime,config):null),((allowed_QMARK_("sandbox_container.destroy"))?knoxx.backend.domain.sandbox_container.sandbox_destroy_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.sandbox_container.create_sandbox_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.sandbox_container.js.map
