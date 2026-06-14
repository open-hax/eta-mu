import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.http.js";
goog.provide('knoxx.backend.domain.mcp.mcp_bridge');
knoxx.backend.domain.mcp.mcp_bridge.PROTOCOL_VERSION = "2024-11-05";
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.mcp !== 'undefined') && (typeof knoxx.backend.domain.mcp.mcp_bridge !== 'undefined') && (typeof knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.mcp !== 'undefined') && (typeof knoxx.backend.domain.mcp.mcp_bridge !== 'undefined') && (typeof knoxx.backend.domain.mcp.mcp_bridge.request_counter_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.mcp.mcp_bridge.request_counter_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1((0));
}
/**
 * Parse MCP_SERVERS env: "id:url:transport,id:command:args:transport"
 */
knoxx.backend.domain.mcp.mcp_bridge.parse_mcp_servers_env = (function knoxx$backend$domain$mcp$mcp_bridge$parse_mcp_servers_env(env_value){
if(clojure.string.blank_QMARK_(env_value)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
var entries = cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,clojure.string.split.cljs$core$IFn$_invoke$arity$2(env_value,/,/)));
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.keep.cljs$core$IFn$_invoke$arity$1((function (entry){
var parts = clojure.string.split.cljs$core$IFn$_invoke$arity$2(entry,/:/);
if((cljs.core.count(parts) >= (3))){
var id = cljs.core.first(parts);
var rest_parts = cljs.core.rest(parts);
var transport = cljs.core.last(rest_parts);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(transport,"http")){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"url","url",276297046),clojure.string.join.cljs$core$IFn$_invoke$arity$2(":",cljs.core.butlast(rest_parts)),new cljs.core.Keyword(null,"transport","transport",-649001056),"http"], null)], null);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(transport,"stdio")){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"command","command",-894540724),cljs.core.first(rest_parts),new cljs.core.Keyword(null,"args","args",1315556576),cljs.core.vec(cljs.core.rest(cljs.core.butlast(rest_parts))),new cljs.core.Keyword(null,"transport","transport",-649001056),"stdio"], null)], null);
} else {
return null;

}
}
} else {
return null;
}
})),entries);
}
});
knoxx.backend.domain.mcp.mcp_bridge.get_mcp_servers_from_env = (function knoxx$backend$domain$mcp$mcp_bridge$get_mcp_servers_from_env(){
return knoxx.backend.domain.mcp.mcp_bridge.parse_mcp_servers_env((function (){var or__5162__auto__ = (process.env["MCP_SERVERS"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
});
knoxx.backend.domain.mcp.mcp_bridge.parse_sse_response = (function knoxx$backend$domain$mcp$mcp_bridge$parse_sse_response(text,_expected_id){
var lines = clojure.string.split.cljs$core$IFn$_invoke$arity$2(text,/\n/);
var data_line = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (_,line){
if(clojure.string.starts_with_QMARK_(clojure.string.trim(line),"data:")){
return cljs.core.reduced(clojure.string.trim(cljs.core.subs.cljs$core$IFn$_invoke$arity$2(clojure.string.trim(line),(5))));
} else {
return null;
}
}),null,lines);
if(cljs.core.truth_(data_line)){
var result = JSON.parse(data_line);
if(cljs.core.truth_((result["error"]))){
throw (new Error((""+"MCP error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((result["error"])["message"])))));
} else {
return (result["result"]);
}
} else {
try{var result = JSON.parse(text);
if(cljs.core.truth_((result["error"]))){
throw (new Error((""+"MCP error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((result["error"])["message"])))));
} else {
return (result["result"]);
}
}catch (e26345){var _ = e26345;
throw (new Error((""+"Failed to parse MCP response: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.subs.cljs$core$IFn$_invoke$arity$3(text,(0),(200))))));
}}
});
knoxx.backend.domain.mcp.mcp_bridge.create_http_client = (function knoxx$backend$domain$mcp$mcp_bridge$create_http_client(config){
var base_url = clojure.string.replace((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),/\/$/,"");
return (async function (method,params){
var id = cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.mcp.mcp_bridge.request_counter_STAR_,cljs.core.inc);
var body = JSON.stringify(cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"jsonrpc","jsonrpc",1483657187),"2.0",new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"method","method",55703592),method,new cljs.core.Keyword(null,"params","params",710516235),(await (async function (){var or__5162__auto__ = params;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], null)));
var headers = (await (async function (){var G__26355 = (new Object());
(G__26355["Content-Type"] = "application/json");

(G__26355["Accept"] = "application/json, text/event-stream");

return G__26355;
})());
if(cljs.core.truth_(new cljs.core.Keyword(null,"shared-secret","shared-secret",284397677).cljs$core$IFn$_invoke$arity$1(config))){
(headers["Authorization"] = (""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"shared-secret","shared-secret",284397677).cljs$core$IFn$_invoke$arity$1(config))));
} else {
}

var response = (await knoxx.backend.infra.http.fetch_with_timeout.cljs$core$IFn$_invoke$arity$3(base_url,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),Object.entries(headers),new cljs.core.Keyword(null,"body","body",-2049205669),body], null)),(30000)));
if(cljs.core.not(response.ok)){
throw (new Error((""+"MCP HTTP error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(response.status)+" "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(response.statusText))));
} else {
var text = (await response.text());
return knoxx.backend.domain.mcp.mcp_bridge.parse_sse_response(text,id);
}
});
});
knoxx.backend.domain.mcp.mcp_bridge.initialize_http_server_BANG_ = (async function knoxx$backend$domain$mcp$mcp_bridge$initialize_http_server_BANG_(server){
var client_fn = new cljs.core.Keyword(null,"client","client",-1323448117).cljs$core$IFn$_invoke$arity$1(server);
var init_result = (await (await (async function (){var G__26361 = "initialize";
var G__26362 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"protocolVersion","protocolVersion",370363372),knoxx.backend.domain.mcp.mcp_bridge.PROTOCOL_VERSION,new cljs.core.Keyword(null,"capabilities","capabilities",212739361),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"clientInfo","clientInfo",-802887449),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"name","name",1843675177),"knoxx",new cljs.core.Keyword(null,"version","version",425292698),"1.0.0"], null)], null));
return (client_fn.cljs$core$IFn$_invoke$arity$2 ? client_fn.cljs$core$IFn$_invoke$arity$2(G__26361,G__26362) : client_fn.call(null,G__26361,G__26362));
})()));
console.log("[mcp-gateway]",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(server),"initialized:",(await (async function (){var or__5162__auto__ = (init_result["serverInfo"]["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "unknown";
}
})()));

var tools_result = (await (client_fn.cljs$core$IFn$_invoke$arity$2 ? client_fn.cljs$core$IFn$_invoke$arity$2("tools/list",null) : client_fn.call(null,"tools/list",null)));
var js_tools = (await (async function (){var or__5162__auto__ = (tools_result["tools"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})());
var tools = cljs.core.vec((await (async function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$initialize_http_server_BANG__$_iter__26368(s__26369){
return (new cljs.core.LazySeq(null,(function (){
var s__26369__$1 = s__26369;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26369__$1);
if(temp__5825__auto__){
var s__26369__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26369__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26369__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26371 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26370 = (0);
while(true){
if((i__26370 < size__5648__auto__)){
var i = cljs.core._nth(c__5647__auto__,i__26370);
cljs.core.chunk_append(b__26371,(function (){var tool = (js_tools[i]);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = (tool["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"description","description",-1428560544),(function (){var or__5162__auto__ = (tool["description"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"input-schema","input-schema",-266884346),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (tool["inputSchema"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);
})());

var G__26625 = (i__26370 + (1));
i__26370 = G__26625;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26371),knoxx$backend$domain$mcp$mcp_bridge$initialize_http_server_BANG__$_iter__26368(cljs.core.chunk_rest(s__26369__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26371),null);
}
} else {
var i = cljs.core.first(s__26369__$2);
return cljs.core.cons((function (){var tool = (js_tools[i]);
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = (tool["name"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"description","description",-1428560544),(function (){var or__5162__auto__ = (tool["description"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"input-schema","input-schema",-266884346),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (tool["inputSchema"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0))], null);
})(),knoxx$backend$domain$mcp$mcp_bridge$initialize_http_server_BANG__$_iter__26368(cljs.core.rest(s__26369__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(js_tools.length));
})()));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(server),new cljs.core.Keyword(null,"tools","tools",-1241731990)], null),tools);

return console.log("[mcp-gateway] Connected to",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(server),", found",cljs.core.count(tools),"tools");
});
knoxx.backend.domain.mcp.mcp_bridge.connect_server_BANG_ = (function knoxx$backend$domain$mcp$mcp_bridge$connect_server_BANG_(id,config){
console.log("[mcp-gateway] Connecting to",id,"(",new cljs.core.Keyword(null,"transport","transport",-649001056).cljs$core$IFn$_invoke$arity$1(config),")...");

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"transport","transport",-649001056).cljs$core$IFn$_invoke$arity$1(config),"http")){
var client_fn = knoxx.backend.domain.mcp.mcp_bridge.create_http_client(config);
var server = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"connected","connected",-169833045),true,new cljs.core.Keyword(null,"client","client",-1323448117),client_fn], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_,cljs.core.assoc,id,server);

return knoxx.backend.domain.mcp.mcp_bridge.initialize_http_server_BANG_(server);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"transport","transport",-649001056).cljs$core$IFn$_invoke$arity$1(config),"stdio")){
console.log("[mcp-gateway] stdio transport not yet implemented");

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_,cljs.core.assoc,id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"config","config",994861415),config,new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"connected","connected",-169833045),false,new cljs.core.Keyword(null,"client","client",-1323448117),null], null));
} else {
return Promise.reject((new Error((""+"Unknown transport: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"transport","transport",-649001056).cljs$core$IFn$_invoke$arity$1(config))))));

}
}
});
/**
 * Returns true if any MCP servers are connected.
 */
knoxx.backend.domain.mcp.mcp_bridge.available_QMARK_ = (function knoxx$backend$domain$mcp$mcp_bridge$available_QMARK_(){
return (!((cljs.core.seq(cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_)) == null)));
});
/**
 * Initialize the MCP gateway with configured servers.
 * Returns a Promise that resolves when all servers are connected.
 */
knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_ = (async function knoxx$backend$domain$mcp$mcp_bridge$initialize_BANG_(var_args){
var G__26443 = arguments.length;
switch (G__26443) {
case 0:
return knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (config){
var server_configs = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"servers","servers",1881102005).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.mcp.mcp_bridge.get_mcp_servers_from_env();
}
})());
(await Promise.all(cljs.core.into_array.cljs$core$IFn$_invoke$arity$1((await (async function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$iter__26448(s__26449){
return (new cljs.core.LazySeq(null,(function (){
var s__26449__$1 = s__26449;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26449__$1);
if(temp__5825__auto__){
var s__26449__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26449__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26449__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26451 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26450 = (0);
while(true){
if((i__26450 < size__5648__auto__)){
var vec__26456 = cljs.core._nth(c__5647__auto__,i__26450);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26456,(0),null);
var server_config = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26456,(1),null);
cljs.core.chunk_append(b__26451,((function (i__26450,vec__26456,id,server_config,c__5647__auto__,size__5648__auto__,b__26451,s__26449__$2,temp__5825__auto__,server_configs){
return (async function (){
try{return (await Promise.resolve(knoxx.backend.domain.mcp.mcp_bridge.connect_server_BANG_(id,server_config)));
}catch (e26460){var err = e26460;
return console.error("[mcp-gateway] Failed to connect to",id,":",(err["message"]));
}});})(i__26450,vec__26456,id,server_config,c__5647__auto__,size__5648__auto__,b__26451,s__26449__$2,temp__5825__auto__,server_configs))
());

var G__26637 = (i__26450 + (1));
i__26450 = G__26637;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26451),knoxx$backend$domain$mcp$mcp_bridge$iter__26448(cljs.core.chunk_rest(s__26449__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26451),null);
}
} else {
var vec__26461 = cljs.core.first(s__26449__$2);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26461,(0),null);
var server_config = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26461,(1),null);
return cljs.core.cons(((function (vec__26461,id,server_config,s__26449__$2,temp__5825__auto__,server_configs){
return (async function (){
try{return (await Promise.resolve(knoxx.backend.domain.mcp.mcp_bridge.connect_server_BANG_(id,server_config)));
}catch (e26465){var err = e26465;
return console.error("[mcp-gateway] Failed to connect to",id,":",(err["message"]));
}});})(vec__26461,id,server_config,s__26449__$2,temp__5825__auto__,server_configs))
(),knoxx$backend$domain$mcp$mcp_bridge$iter__26448(cljs.core.rest(s__26449__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(server_configs);
})()))));

return cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_);
}));

(knoxx.backend.domain.mcp.mcp_bridge.initialize_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Check if MCP is enabled and has connected servers.
 */
knoxx.backend.domain.mcp.mcp_bridge.enabled_QMARK_ = (function knoxx$backend$domain$mcp$mcp_bridge$enabled_QMARK_(){
return ((cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2((process.env["MCP_ENABLED"]),"false")) && ((!((cljs.core.seq(cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_)) == null)))));
});
/**
 * Get MCP gateway status as a CLJS map.
 */
knoxx.backend.domain.mcp.mcp_bridge.status = (function knoxx$backend$domain$mcp$mcp_bridge$status(){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"enabled","enabled",1195909756),knoxx.backend.domain.mcp.mcp_bridge.enabled_QMARK_(),new cljs.core.Keyword(null,"servers","servers",1881102005),(function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$status_$_iter__26476(s__26477){
return (new cljs.core.LazySeq(null,(function (){
var s__26477__$1 = s__26477;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26477__$1);
if(temp__5825__auto__){
var s__26477__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26477__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26477__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26479 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26478 = (0);
while(true){
if((i__26478 < size__5648__auto__)){
var vec__26483 = cljs.core._nth(c__5647__auto__,i__26478);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26483,(0),null);
var server = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26483,(1),null);
cljs.core.chunk_append(b__26479,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"transport","transport",-649001056),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(server,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"transport","transport",-649001056)], null)),new cljs.core.Keyword(null,"connected","connected",-169833045),new cljs.core.Keyword(null,"connected","connected",-169833045).cljs$core$IFn$_invoke$arity$1(server),new cljs.core.Keyword(null,"tool-count","tool-count",600749873),cljs.core.count(new cljs.core.Keyword(null,"tools","tools",-1241731990).cljs$core$IFn$_invoke$arity$1(server)),new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"tools","tools",-1241731990).cljs$core$IFn$_invoke$arity$1(server))], null));

var G__26639 = (i__26478 + (1));
i__26478 = G__26639;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26479),knoxx$backend$domain$mcp$mcp_bridge$status_$_iter__26476(cljs.core.chunk_rest(s__26477__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26479),null);
}
} else {
var vec__26488 = cljs.core.first(s__26477__$2);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26488,(0),null);
var server = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26488,(1),null);
return cljs.core.cons(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"transport","transport",-649001056),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(server,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"transport","transport",-649001056)], null)),new cljs.core.Keyword(null,"connected","connected",-169833045),new cljs.core.Keyword(null,"connected","connected",-169833045).cljs$core$IFn$_invoke$arity$1(server),new cljs.core.Keyword(null,"tool-count","tool-count",600749873),cljs.core.count(new cljs.core.Keyword(null,"tools","tools",-1241731990).cljs$core$IFn$_invoke$arity$1(server)),new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"tools","tools",-1241731990).cljs$core$IFn$_invoke$arity$1(server))], null),knoxx$backend$domain$mcp$mcp_bridge$status_$_iter__26476(cljs.core.rest(s__26477__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_));
})()], null);
});
/**
 * Get the MCP tool catalog as a vector of tool maps.
 */
knoxx.backend.domain.mcp.mcp_bridge.catalog = (function knoxx$backend$domain$mcp$mcp_bridge$catalog(){
return cljs.core.vec((function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$catalog_$_iter__26504(s__26505){
return (new cljs.core.LazySeq(null,(function (){
var s__26505__$1 = s__26505;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26505__$1);
if(temp__5825__auto__){
var xs__6385__auto__ = temp__5825__auto__;
var vec__26512 = cljs.core.first(xs__6385__auto__);
var server_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26512,(0),null);
var server = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26512,(1),null);
var iterys__5645__auto__ = ((function (s__26505__$1,vec__26512,server_id,server,xs__6385__auto__,temp__5825__auto__){
return (function knoxx$backend$domain$mcp$mcp_bridge$catalog_$_iter__26504_$_iter__26506(s__26507){
return (new cljs.core.LazySeq(null,((function (s__26505__$1,vec__26512,server_id,server,xs__6385__auto__,temp__5825__auto__){
return (function (){
var s__26507__$1 = s__26507;
while(true){
var temp__5825__auto____$1 = cljs.core.seq(s__26507__$1);
if(temp__5825__auto____$1){
var s__26507__$2 = temp__5825__auto____$1;
if(cljs.core.chunked_seq_QMARK_(s__26507__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26507__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26509 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26508 = (0);
while(true){
if((i__26508 < size__5648__auto__)){
var tool = cljs.core._nth(c__5647__auto__,i__26508);
cljs.core.chunk_append(b__26509,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(tool,new cljs.core.Keyword(null,"id","id",-1388402092),(""+"mcp."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id)+"."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(tool))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"serverId","serverId",-264111159),server_id,new cljs.core.Keyword(null,"toolId","toolId",-1935596543),(""+"mcp."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id)+"."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(tool)))], 0)));

var G__26640 = (i__26508 + (1));
i__26508 = G__26640;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26509),knoxx$backend$domain$mcp$mcp_bridge$catalog_$_iter__26504_$_iter__26506(cljs.core.chunk_rest(s__26507__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26509),null);
}
} else {
var tool = cljs.core.first(s__26507__$2);
return cljs.core.cons(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(tool,new cljs.core.Keyword(null,"id","id",-1388402092),(""+"mcp."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id)+"."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(tool))),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"serverId","serverId",-264111159),server_id,new cljs.core.Keyword(null,"toolId","toolId",-1935596543),(""+"mcp."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id)+"."+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(tool)))], 0)),knoxx$backend$domain$mcp$mcp_bridge$catalog_$_iter__26504_$_iter__26506(cljs.core.rest(s__26507__$2)));
}
} else {
return null;
}
break;
}
});})(s__26505__$1,vec__26512,server_id,server,xs__6385__auto__,temp__5825__auto__))
,null,null));
});})(s__26505__$1,vec__26512,server_id,server,xs__6385__auto__,temp__5825__auto__))
;
var fs__5646__auto__ = cljs.core.seq(iterys__5645__auto__(new cljs.core.Keyword(null,"tools","tools",-1241731990).cljs$core$IFn$_invoke$arity$1(server)));
if(fs__5646__auto__){
return cljs.core.concat.cljs$core$IFn$_invoke$arity$2(fs__5646__auto__,knoxx$backend$domain$mcp$mcp_bridge$catalog_$_iter__26504(cljs.core.rest(s__26505__$1)));
} else {
var G__26641 = cljs.core.rest(s__26505__$1);
s__26505__$1 = G__26641;
continue;
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_));
})());
});
/**
 * Get all MCP tools as a map keyed by tool ID.
 */
knoxx.backend.domain.mcp.mcp_bridge.tools_map = (function knoxx$backend$domain$mcp$mcp_bridge$tools_map(){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,(function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$tools_map_$_iter__26530(s__26531){
return (new cljs.core.LazySeq(null,(function (){
var s__26531__$1 = s__26531;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26531__$1);
if(temp__5825__auto__){
var s__26531__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26531__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26531__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26533 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26532 = (0);
while(true){
if((i__26532 < size__5648__auto__)){
var tool = cljs.core._nth(c__5647__auto__,i__26532);
cljs.core.chunk_append(b__26533,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(tool)),tool], null));

var G__26643 = (i__26532 + (1));
i__26532 = G__26643;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26533),knoxx$backend$domain$mcp$mcp_bridge$tools_map_$_iter__26530(cljs.core.chunk_rest(s__26531__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26533),null);
}
} else {
var tool = cljs.core.first(s__26531__$2);
return cljs.core.cons(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(tool)),tool], null),knoxx$backend$domain$mcp$mcp_bridge$tools_map_$_iter__26530(cljs.core.rest(s__26531__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(knoxx.backend.domain.mcp.mcp_bridge.catalog());
})());
});
knoxx.backend.domain.mcp.mcp_bridge.format_mcp_result = (function knoxx$backend$domain$mcp$mcp_bridge$format_mcp_result(result){
if(cljs.core.not(result)){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"content","content",15833224),"",new cljs.core.Keyword(null,"isError","isError",-1727958473),false], null);
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = (result["content"]);
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.array_QMARK_((result["content"]));
} else {
return and__5160__auto__;
}
})())){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"content","content",15833224),clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,(function (){var iter__5649__auto__ = (function knoxx$backend$domain$mcp$mcp_bridge$format_mcp_result_$_iter__26547(s__26548){
return (new cljs.core.LazySeq(null,(function (){
var s__26548__$1 = s__26548;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26548__$1);
if(temp__5825__auto__){
var s__26548__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26548__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26548__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26550 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26549 = (0);
while(true){
if((i__26549 < size__5648__auto__)){
var i = cljs.core._nth(c__5647__auto__,i__26549);
cljs.core.chunk_append(b__26550,(function (){var block = ((result["content"])[i]);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((block["type"]),"text")){
return (block["text"]);
} else {
return null;
}
})());

var G__26646 = (i__26549 + (1));
i__26549 = G__26646;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26550),knoxx$backend$domain$mcp$mcp_bridge$format_mcp_result_$_iter__26547(cljs.core.chunk_rest(s__26548__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26550),null);
}
} else {
var i = cljs.core.first(s__26548__$2);
return cljs.core.cons((function (){var block = ((result["content"])[i]);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((block["type"]),"text")){
return (block["text"]);
} else {
return null;
}
})(),knoxx$backend$domain$mcp$mcp_bridge$format_mcp_result_$_iter__26547(cljs.core.rest(s__26548__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1((result["content"]).length));
})())),new cljs.core.Keyword(null,"isError","isError",-1727958473),cljs.core.boolean$((result["isError"]))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"content","content",15833224),JSON.stringify(result,null,(2)),new cljs.core.Keyword(null,"isError","isError",-1727958473),false], null);
}
}
});
/**
 * Call an MCP tool by its full ID (e.g. "mcp.grep.searchGitHub").
 * Returns a Promise that resolves with {:content "..." :isError bool}.
 */
knoxx.backend.domain.mcp.mcp_bridge.call_tool_BANG_ = (async function knoxx$backend$domain$mcp$mcp_bridge$call_tool_BANG_(tool_id,args){
var match = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)).match(/^mcp\.([^.]+)\.(.+)$/);
if(cljs.core.truth_(match)){
} else {
throw (new Error((""+"Invalid MCP tool ID: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id))));
}

var server_id = (match[(1)]);
var tool_name = (match[(2)]);
var server = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(knoxx.backend.domain.mcp.mcp_bridge.servers_STAR_),server_id);
if(cljs.core.truth_(server)){
} else {
throw (new Error((""+"MCP server not found: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id))));
}

if(cljs.core.truth_(new cljs.core.Keyword(null,"connected","connected",-169833045).cljs$core$IFn$_invoke$arity$1(server))){
} else {
throw (new Error((""+"MCP server not connected: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(server_id))));
}

console.log("[mcp-gateway] Calling",server_id,".",tool_name,"with args:",cljs.core.subs.cljs$core$IFn$_invoke$arity$3(JSON.stringify(cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = args;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()))),(0),(200)));

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(server,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"transport","transport",-649001056)], null)),"http")){
var client_fn = new cljs.core.Keyword(null,"client","client",-1323448117).cljs$core$IFn$_invoke$arity$1(server);
return knoxx.backend.domain.mcp.mcp_bridge.format_mcp_result((await (await (async function (){var G__26572 = "tools/call";
var G__26573 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"name","name",1843675177),tool_name,new cljs.core.Keyword(null,"arguments","arguments",-1182834456),(await (async function (){var or__5162__auto__ = args;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], null));
return (client_fn.cljs$core$IFn$_invoke$arity$2 ? client_fn.cljs$core$IFn$_invoke$arity$2(G__26572,G__26573) : client_fn.call(null,G__26572,G__26573));
})())));
} else {
throw (new Error((""+"Transport not supported: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(server,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"transport","transport",-649001056)], null))))));
}
});
/**
 * Return MCP tools formatted as agent SDK custom tools (JavaScript array).
 */
knoxx.backend.domain.mcp.mcp_bridge.mcp_tools_for_agent = (function knoxx$backend$domain$mcp$mcp_bridge$mcp_tools_for_agent(){
if(knoxx.backend.domain.mcp.mcp_bridge.enabled_QMARK_()){
var tools = knoxx.backend.domain.mcp.mcp_bridge.catalog();
return cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (tool){
var tool_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(tool);
var input_schema = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"input-schema","input-schema",-266884346).cljs$core$IFn$_invoke$arity$1(tool);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var execute_fn = (async function (_tool_call_id,tool_args,a,b,c){
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
var args = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(tool_args,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
if(cljs.core.fn_QMARK_(on_update)){
var G__26594_26657 = cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"text",new cljs.core.Keyword(null,"text","text",-1790561697),(""+"Calling MCP tool "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)+"...")], null)], null)], null));
(on_update.cljs$core$IFn$_invoke$arity$1 ? on_update.cljs$core$IFn$_invoke$arity$1(G__26594_26657) : on_update.call(null,G__26594_26657));
} else {
}

try{var result = (await knoxx.backend.domain.mcp.mcp_bridge.call_tool_BANG_(tool_id,args));
return cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"text",new cljs.core.Keyword(null,"text","text",-1790561697),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())], null)], null)], null));
}catch (e26607){var err = e26607;
return cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"text",new cljs.core.Keyword(null,"text","text",-1790561697),(""+"MCP tool error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = (err["message"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err));
}
})())))], null)], null)], null));
}});
return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"name","name",1843675177),tool_id,new cljs.core.Keyword(null,"label","label",1718410804),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(tool);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return tool_id;
}
})(),new cljs.core.Keyword(null,"description","description",-1428560544),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"description","description",-1428560544).cljs$core$IFn$_invoke$arity$1(tool);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"promptSnippet","promptSnippet",-592322820),(""+"Call MCP tool "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)),new cljs.core.Keyword(null,"promptGuidelines","promptGuidelines",2131626915),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(""+"Use "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_id)+" when the task requires capabilities from the "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"serverId","serverId",-264111159).cljs$core$IFn$_invoke$arity$1(tool))+" MCP server.")], null),new cljs.core.Keyword(null,"parameters","parameters",-1229919748),cljs.core.clj__GT_js((function (){var or__5162__auto__ = input_schema;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()),new cljs.core.Keyword(null,"execute","execute",-129499188),execute_fn], null);
}),tools));
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.domain.mcp.mcp_bridge.js.map
