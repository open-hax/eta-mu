import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.js.shim.module$ws$default.js";
import "./cljs.reader.js";
import "./clojure.string.js";
import "./goog.object.object.js";
import "./shadow.remote.runtime.shared.js";
import "./shadow.esm.js";
import "./shadow.cljs.devtools.client.shared.js";
import "./shadow.cljs.devtools.client.env.js";
import "./shadow.remote.runtime.api.js";
goog.provide('shadow.cljs.devtools.client.node_esm');
goog.scope(function(){
  shadow.cljs.devtools.client.node_esm.goog$module$goog$object = goog.module.get('goog.object');
});
SHADOW_ENV.setLoaded("goog.base.js");
shadow.cljs.devtools.client.node_esm.is_loaded_QMARK_ = (function shadow$cljs$devtools$client$node_esm$is_loaded_QMARK_(src){
return SHADOW_ENV.isLoaded(src);
});
shadow.cljs.devtools.client.node_esm.load_sources = (function shadow$cljs$devtools$client$node_esm$load_sources(files_to_load,finished,error){
var src = cljs.core.first(files_to_load);
if(cljs.core.not(src)){
return (finished.cljs$core$IFn$_invoke$arity$0 ? finished.cljs$core$IFn$_invoke$arity$0() : finished.call(null));
} else {
var map__28645 = src;
var map__28645__$1 = cljs.core.__destructure_map(map__28645);
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28645__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var path = (""+"./cljs-runtime/"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_name)+"?rand="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.rand.cljs$core$IFn$_invoke$arity$0()));
console.log("loading",output_name);

shadow.cljs.devtools.client.env.before_load_src(src);

return shadow.esm.dynamic_import(path).then((function (_){
var G__28648 = cljs.core.rest(files_to_load);
var G__28649 = finished;
var G__28650 = error;
return (shadow.cljs.devtools.client.node_esm.load_sources.cljs$core$IFn$_invoke$arity$3 ? shadow.cljs.devtools.client.node_esm.load_sources.cljs$core$IFn$_invoke$arity$3(G__28648,G__28649,G__28650) : shadow.cljs.devtools.client.node_esm.load_sources.call(null,G__28648,G__28649,G__28650));
})).catch((function (e){
return (error.cljs$core$IFn$_invoke$arity$2 ? error.cljs$core$IFn$_invoke$arity$2(e,src) : error.call(null,e,src));
}));
}
});
shadow.cljs.devtools.client.node_esm.handle_build_complete = (function shadow$cljs$devtools$client$node_esm$handle_build_complete(runtime,p__28653){
var map__28654 = p__28653;
var map__28654__$1 = cljs.core.__destructure_map(map__28654);
var msg = map__28654__$1;
var info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28654__$1,new cljs.core.Keyword(null,"info","info",-317069002));
var reload_info = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28654__$1,new cljs.core.Keyword(null,"reload-info","reload-info",1648088086));
var map__28655 = info;
var map__28655__$1 = cljs.core.__destructure_map(map__28655);
var sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28655__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
var compiled = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28655__$1,new cljs.core.Keyword(null,"compiled","compiled",850043082));
var warnings = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28655__$1,new cljs.core.Keyword(null,"warnings","warnings",-735437651));
if(((shadow.cljs.devtools.client.env.autoload) && (((cljs.core.empty_QMARK_(warnings)) || (shadow.cljs.devtools.client.env.ignore_warnings))))){
var files_to_require = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__28661){
var map__28664 = p__28661;
var map__28664__$1 = cljs.core.__destructure_map(map__28664);
var ns = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28664__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
var resource_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28664__$1,new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582));
return ((cljs.core.contains_QMARK_(compiled,resource_id)) || (cljs.core.contains_QMARK_(new cljs.core.Keyword(null,"always-load","always-load",66405637).cljs$core$IFn$_invoke$arity$1(reload_info),ns)));
}),cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__28667){
var map__28668 = p__28667;
var map__28668__$1 = cljs.core.__destructure_map(map__28668);
var ns = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28668__$1,new cljs.core.Keyword(null,"ns","ns",441598760));
return cljs.core.contains_QMARK_(new cljs.core.Keyword(null,"never-load","never-load",1300896819).cljs$core$IFn$_invoke$arity$1(reload_info),ns);
}),sources)));
if(cljs.core.seq(files_to_require)){
return shadow.cljs.devtools.client.env.do_js_reload.cljs$core$IFn$_invoke$arity$2(msg,(function (continue$){
return shadow.cljs.devtools.client.node_esm.load_sources(files_to_require,continue$,(function (e,src){
return console.error("failed to load",new cljs.core.Keyword(null,"output-name","output-name",-1769107767).cljs$core$IFn$_invoke$arity$1(src),e);
}));
}));
} else {
return null;
}
} else {
return null;
}
});
shadow.cljs.devtools.client.node_esm.client_info = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"host","host",-1558485167),new cljs.core.Keyword(null,"node-esm","node-esm",1549887711),new cljs.core.Keyword(null,"desc","desc",2093485764),(""+"Node "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(process.version))], null);
shadow.cljs.devtools.client.node_esm.start = (function shadow$cljs$devtools$client$node_esm$start(runtime){
var ws_url = shadow.cljs.devtools.client.env.get_ws_relay_url();
var socket = (new shadow.js.shim.module$ws$default(ws_url,({"rejectUnauthorized": false})));
var ws_active_ref = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(true);
socket.on("message",(function (data){
if(cljs.core.truth_(cljs.core.deref(ws_active_ref))){
return shadow.cljs.devtools.client.shared.remote_msg(runtime,data);
} else {
return null;
}
}));

socket.on("open",(function (e){
if(cljs.core.truth_(cljs.core.deref(ws_active_ref))){
return shadow.cljs.devtools.client.shared.remote_open(runtime,e);
} else {
return null;
}
}));

socket.on("close",(function (e){
if(cljs.core.truth_(cljs.core.deref(ws_active_ref))){
return shadow.cljs.devtools.client.shared.remote_close(runtime,e,ws_url);
} else {
return null;
}
}));

socket.on("error",(function (e){
if(cljs.core.truth_(cljs.core.deref(ws_active_ref))){
return shadow.cljs.devtools.client.shared.remote_error(runtime,e);
} else {
return null;
}
}));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"socket","socket",59137063),socket,new cljs.core.Keyword(null,"ws-active-ref","ws-active-ref",804496391),ws_active_ref], null);
});
shadow.cljs.devtools.client.node_esm.send = (function shadow$cljs$devtools$client$node_esm$send(p__28686,msg){
var map__28687 = p__28686;
var map__28687__$1 = cljs.core.__destructure_map(map__28687);
var socket = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28687__$1,new cljs.core.Keyword(null,"socket","socket",59137063));
return socket.send(msg);
});
shadow.cljs.devtools.client.node_esm.stop = (function shadow$cljs$devtools$client$node_esm$stop(p__28690){
var map__28694 = p__28690;
var map__28694__$1 = cljs.core.__destructure_map(map__28694);
var socket = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28694__$1,new cljs.core.Keyword(null,"socket","socket",59137063));
var ws_active_ref = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28694__$1,new cljs.core.Keyword(null,"ws-active-ref","ws-active-ref",804496391));
cljs.core.reset_BANG_(ws_active_ref,false);

return socket.close();
});
shadow.cljs.devtools.client.node_esm.eval_js = (function shadow$cljs$devtools$client$node_esm$eval_js(js){
return (0,eval)(js);;
});
if((shadow.cljs.devtools.client.env.worker_client_id > (0))){
(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$remote$runtime$api$IEvalJS$ = cljs.core.PROTOCOL_SENTINEL);

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$remote$runtime$api$IEvalJS$_js_eval$arity$4 = (function (this$,code,success,fail){
var this$__$1 = this;
try{var G__28705 = shadow.cljs.devtools.client.node_esm.eval_js(code);
return (success.cljs$core$IFn$_invoke$arity$1 ? success.cljs$core$IFn$_invoke$arity$1(G__28705) : success.call(null,G__28705));
}catch (e28703){var e = e28703;
return (fail.cljs$core$IFn$_invoke$arity$2 ? fail.cljs$core$IFn$_invoke$arity$2(e,code) : fail.call(null,e,code));
}}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$ = cljs.core.PROTOCOL_SENTINEL);

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_invoke$arity$5 = (function (this$,ns,p__28706,success,fail){
var map__28707 = p__28706;
var map__28707__$1 = cljs.core.__destructure_map(map__28707);
var msg = map__28707__$1;
var js = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28707__$1,new cljs.core.Keyword(null,"js","js",1768080579));
var this$__$1 = this;
try{var G__28709 = shadow.cljs.devtools.client.node_esm.eval_js(js);
return (success.cljs$core$IFn$_invoke$arity$1 ? success.cljs$core$IFn$_invoke$arity$1(G__28709) : success.call(null,G__28709));
}catch (e28708){var e = e28708;
return (fail.cljs$core$IFn$_invoke$arity$2 ? fail.cljs$core$IFn$_invoke$arity$2(e,msg) : fail.call(null,e,msg));
}}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_init$arity$4 = (function (runtime,p__28711,done,error){
var map__28712 = p__28711;
var map__28712__$1 = cljs.core.__destructure_map(map__28712);
var repl_sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28712__$1,new cljs.core.Keyword(null,"repl-sources","repl-sources",723867535));
var runtime__$1 = this;
return shadow.cljs.devtools.client.node_esm.load_sources(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p__28713){
var map__28714 = p__28713;
var map__28714__$1 = cljs.core.__destructure_map(map__28714);
var src = map__28714__$1;
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28714__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
return shadow.cljs.devtools.client.node_esm.is_loaded_QMARK_(output_name);
}),repl_sources)),done,error);
}));

(shadow.cljs.devtools.client.shared.Runtime.prototype.shadow$cljs$devtools$client$shared$IHostSpecific$do_repl_require$arity$4 = (function (this$,p__28716,done,error){
var map__28717 = p__28716;
var map__28717__$1 = cljs.core.__destructure_map(map__28717);
var msg = map__28717__$1;
var sources = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28717__$1,new cljs.core.Keyword(null,"sources","sources",-321166424));
var reload_namespaces = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28717__$1,new cljs.core.Keyword(null,"reload-namespaces","reload-namespaces",250210134));
var this$__$1 = this;
return shadow.cljs.devtools.client.node_esm.load_sources(cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__28719){
var map__28720 = p__28719;
var map__28720__$1 = cljs.core.__destructure_map(map__28720);
var src = map__28720__$1;
var provides = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28720__$1,new cljs.core.Keyword(null,"provides","provides",-1634397992));
var output_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28720__$1,new cljs.core.Keyword(null,"output-name","output-name",-1769107767));
var or__5162__auto__ = cljs.core.not(shadow.cljs.devtools.client.node_esm.is_loaded_QMARK_(output_name));
if(or__5162__auto__){
return or__5162__auto__;
} else {
return cljs.core.some(reload_namespaces,provides);
}
}),sources)),done,error);
}));

shadow.cljs.devtools.client.shared.add_plugin_BANG_(new cljs.core.Keyword("shadow.cljs.devtools.client.node-esm","client","shadow.cljs.devtools.client.node-esm/client",47984),cljs.core.PersistentHashSet.EMPTY,(function (p__28721){
var map__28722 = p__28721;
var map__28722__$1 = cljs.core.__destructure_map(map__28722);
var env = map__28722__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28722__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
var svc = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),runtime], null);
shadow.remote.runtime.api.add_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.node-esm","client","shadow.cljs.devtools.client.node-esm/client",47984),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"on-welcome","on-welcome",1895317125),(function (){
shadow.cljs.devtools.client.env.patch_goog_BANG_();

if(shadow.cljs.devtools.client.env.log){
return console.log((""+"shadow-cljs - #"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"client-id","client-id",-464622140).cljs$core$IFn$_invoke$arity$1(cljs.core.deref(new cljs.core.Keyword(null,"state-ref","state-ref",2127874952).cljs$core$IFn$_invoke$arity$1(runtime))))+" ready!"));
} else {
return null;
}
}),new cljs.core.Keyword(null,"on-disconnect","on-disconnect",-809021814),(function (){
return console.warn("The shadow-cljs Websocket was disconnected.");
}),new cljs.core.Keyword(null,"ops","ops",1237330063),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"access-denied","access-denied",959449406),(function (msg){
return console.error((""+"Stale Output! Your loaded JS was not produced by the running shadow-cljs instance."+" Is the watch for this build running?"));
}),new cljs.core.Keyword(null,"cljs-build-configure","cljs-build-configure",-2089891268),(function (msg){
return null;
}),new cljs.core.Keyword(null,"cljs-build-start","cljs-build-start",-725781241),(function (msg){
return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-start","build-start",-959649480)));
}),new cljs.core.Keyword(null,"cljs-build-complete","cljs-build-complete",273626153),(function (msg){
var msg__$1 = shadow.cljs.devtools.client.env.add_warnings_to_info(msg);
shadow.cljs.devtools.client.node_esm.handle_build_complete(runtime,msg__$1);

return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg__$1,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-complete","build-complete",-501868472)));
}),new cljs.core.Keyword(null,"cljs-build-failure","cljs-build-failure",1718154990),(function (msg){
return shadow.cljs.devtools.client.env.run_custom_notify_BANG_(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(msg,new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"build-failure","build-failure",-2107487466)));
}),new cljs.core.Keyword("shadow.cljs.devtools.client.env","worker-notify","shadow.cljs.devtools.client.env/worker-notify",-1456820670),(function (p__28731){
var map__28732 = p__28731;
var map__28732__$1 = cljs.core.__destructure_map(map__28732);
var event_op = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28732__$1,new cljs.core.Keyword(null,"event-op","event-op",200358057));
var client_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28732__$1,new cljs.core.Keyword(null,"client-id","client-id",-464622140));
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-disconnect","client-disconnect",640227957),event_op)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(client_id,shadow.cljs.devtools.client.env.worker_client_id)))){
return console.warn("shadow-cljs - The watch for this build was stopped!");
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client-connect","client-connect",-1113973888),event_op)){
return console.warn("shadow-cljs - A new watch for this build was started, restart of this process required!");
} else {
return null;

}
}
})], null)], null));

return svc;
}),(function (p__28737){
var map__28738 = p__28737;
var map__28738__$1 = cljs.core.__destructure_map(map__28738);
var svc = map__28738__$1;
var runtime = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28738__$1,new cljs.core.Keyword(null,"runtime","runtime",-1331573996));
return shadow.remote.runtime.api.del_extension(runtime,new cljs.core.Keyword("shadow.cljs.devtools.client.node-esm","client","shadow.cljs.devtools.client.node-esm/client",47984));
}));

shadow.cljs.devtools.client.shared.init_runtime_BANG_(shadow.cljs.devtools.client.node_esm.client_info,shadow.cljs.devtools.client.node_esm.start,shadow.cljs.devtools.client.node_esm.send,shadow.cljs.devtools.client.node_esm.stop);
} else {
}

//# sourceMappingURL=shadow.cljs.devtools.client.node_esm.js.map
