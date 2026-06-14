import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.time.js";
import "./shadow.esm.esm_import$node_child_process.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_os.js";
import "./shadow.esm.esm_import$node_util.js";
goog.provide('knoxx.backend.domain.realtime');
knoxx.backend.domain.realtime.exec_file_async = shadow.esm.esm_import$node_util.promisify(shadow.esm.esm_import$node_child_process.execFile);
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.realtime !== 'undefined') && (typeof knoxx.backend.domain.realtime.ws_clients_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.realtime.ws_clients_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.domain !== 'undefined') && (typeof knoxx.backend.domain.realtime !== 'undefined') && (typeof knoxx.backend.domain.realtime.ws_stats_interval_STAR_ !== 'undefined')){
} else {
knoxx.backend.domain.realtime.ws_stats_interval_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.domain.realtime.ws_envelope = (function knoxx$backend$domain$realtime$ws_envelope(channel,payload){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"channel","channel",734187692),channel,new cljs.core.Keyword(null,"timestamp","timestamp",579478971),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"payload","payload",-383036092),payload], null);
});
knoxx.backend.domain.realtime.safe_ws_send_BANG_ = (function knoxx$backend$domain$realtime$safe_ws_send_BANG_(socket,payload){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((socket["readyState"]),(1))){
return socket.send(JSON.stringify(cljs.core.clj__GT_js(payload)));
} else {
return null;
}
});
knoxx.backend.domain.realtime.nvidia_smi_query_args = ["--query-gpu=index,name,utilization.gpu,utilization.memory,memory.used,memory.total,temperature.gpu,power.draw","--format=csv,noheader,nounits"];
knoxx.backend.domain.realtime.parse_float_safe = (function knoxx$backend$domain$realtime$parse_float_safe(value){
var parsed = parseFloat((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(cljs.core.truth_(isNaN(parsed))){
return null;
} else {
return parsed;
}
});
knoxx.backend.domain.realtime.mib__GT_bytes = (function knoxx$backend$domain$realtime$mib__GT_bytes(value){
var temp__5825__auto__ = knoxx.backend.domain.realtime.parse_float_safe(value);
if(cljs.core.truth_(temp__5825__auto__)){
var parsed = temp__5825__auto__;
return ((parsed * (1024)) * (1024));
} else {
return null;
}
});
knoxx.backend.domain.realtime.parse_nvidia_smi_line = (function knoxx$backend$domain$realtime$parse_nvidia_smi_line(line){
var vec__25580 = cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,clojure.string.split.cljs$core$IFn$_invoke$arity$2(line,/,/));
var index = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(0),null);
var name = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(1),null);
var util_gpu = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(2),null);
var util_mem = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(3),null);
var mem_used = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(4),null);
var mem_total = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(5),null);
var temp_c = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(6),null);
var power_w = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25580,(7),null);
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"index","index",-1531685915),(function (){var or__5162__auto__ = (function (){var G__25583 = index;
if((G__25583 == null)){
return null;
} else {
return parseInt(G__25583);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"name","name",1843675177),(function (){var or__5162__auto__ = name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "NVIDIA GPU";
}
})(),new cljs.core.Keyword(null,"util_gpu","util_gpu",1856082322),(function (){var or__5162__auto__ = knoxx.backend.domain.realtime.parse_float_safe(util_gpu);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"util_mem","util_mem",563992700),(function (){var or__5162__auto__ = knoxx.backend.domain.realtime.parse_float_safe(util_mem);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"mem_used_bytes","mem_used_bytes",-1607680465),(function (){var or__5162__auto__ = knoxx.backend.domain.realtime.mib__GT_bytes(mem_used);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"mem_total_bytes","mem_total_bytes",-1633418275),(function (){var or__5162__auto__ = knoxx.backend.domain.realtime.mib__GT_bytes(mem_total);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})(),new cljs.core.Keyword(null,"temp_c","temp_c",-1409598289),knoxx.backend.domain.realtime.parse_float_safe(temp_c),new cljs.core.Keyword(null,"power_w","power_w",1448927329),knoxx.backend.domain.realtime.parse_float_safe(power_w)], null);
});
knoxx.backend.domain.realtime.collect_nvidia_gpu_stats_BANG_ = (async function knoxx$backend$domain$realtime$collect_nvidia_gpu_stats_BANG_(_runtime){
try{var result = (await (await (async function (){var G__25586 = "nvidia-smi";
var G__25587 = knoxx.backend.domain.realtime.nvidia_smi_query_args;
var G__25588 = ({"timeout": (1200)});
return (knoxx.backend.domain.realtime.exec_file_async.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.realtime.exec_file_async.cljs$core$IFn$_invoke$arity$3(G__25586,G__25587,G__25588) : knoxx.backend.domain.realtime.exec_file_async.call(null,G__25586,G__25587,G__25588));
})()));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.realtime.parse_nvidia_smi_line,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,clojure.string.split_lines((await (async function (){var or__5162__auto__ = (result["stdout"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())))));
}catch (e25585){var _ = e25585;
return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.domain.realtime.system_stats_BANG_ = (async function knoxx$backend$domain$realtime$system_stats_BANG_(runtime,active_runs_count){
var cpu_count = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),shadow.esm.esm_import$node_os.availableParallelism());
var load1 = (await (async function (){var or__5162__auto__ = (shadow.esm.esm_import$node_os.loadavg()[(0)]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var total_mem = (await (async function (){var or__5162__auto__ = shadow.esm.esm_import$node_os.totalmem();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (1);
}
})());
var free_mem = (await (async function (){var or__5162__auto__ = shadow.esm.esm_import$node_os.freemem();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})());
var used_mem = cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),(total_mem - free_mem));
var cpu_percent = cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),((100) * (load1 / cpu_count)));
var mem_percent = cljs.core.min.cljs$core$IFn$_invoke$arity$2((100),((100) * ((1) - (free_mem / total_mem))));
var gpu = (await knoxx.backend.domain.realtime.collect_nvidia_gpu_stats_BANG_(runtime));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"memory_used_bytes","memory_used_bytes",-1404301599),new cljs.core.Keyword(null,"memory_total_bytes","memory_total_bytes",-446657821),new cljs.core.Keyword(null,"active_runs","active_runs",-1033118107),new cljs.core.Keyword(null,"gpu","gpu",437691081),new cljs.core.Keyword(null,"cpu_percent","cpu_percent",-932287404),new cljs.core.Keyword(null,"active_clients","active_clients",-1749706924),new cljs.core.Keyword(null,"network","network",2050004697),new cljs.core.Keyword(null,"timestamp","timestamp",579478971),new cljs.core.Keyword(null,"memory_percent","memory_percent",-61905313)],[used_mem,total_mem,(active_runs_count.cljs$core$IFn$_invoke$arity$0 ? active_runs_count.cljs$core$IFn$_invoke$arity$0() : active_runs_count.call(null)),gpu,cpu_percent,cljs.core.count(cljs.core.deref(knoxx.backend.domain.realtime.ws_clients_STAR_)),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"total_bytes_per_sec","total_bytes_per_sec",438678542),(0),new cljs.core.Keyword(null,"rx_bytes_per_sec","rx_bytes_per_sec",-1256495652),(0),new cljs.core.Keyword(null,"tx_bytes_per_sec","tx_bytes_per_sec",-320326868),(0)], null),knoxx.backend.domain.time.now_iso(),mem_percent]);
});
knoxx.backend.domain.realtime.broadcast_ws_BANG_ = (function knoxx$backend$domain$realtime$broadcast_ws_BANG_(channel,payload){
var seq__25589 = cljs.core.seq(cljs.core.deref(knoxx.backend.domain.realtime.ws_clients_STAR_));
var chunk__25590 = null;
var count__25591 = (0);
var i__25592 = (0);
while(true){
if((i__25592 < count__25591)){
var vec__25605 = chunk__25590.cljs$core$IIndexed$_nth$arity$2(null,i__25592);
var client_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25605,(0),null);
var client = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25605,(1),null);
try{knoxx.backend.domain.realtime.safe_ws_send_BANG_((client["socket"]),knoxx.backend.domain.realtime.ws_envelope(channel,payload));
}catch (e25609){var __25900 = e25609;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}

var G__25901 = seq__25589;
var G__25902 = chunk__25590;
var G__25903 = count__25591;
var G__25904 = (i__25592 + (1));
seq__25589 = G__25901;
chunk__25590 = G__25902;
count__25591 = G__25903;
i__25592 = G__25904;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__25589);
if(temp__5825__auto__){
var seq__25589__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25589__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__25589__$1);
var G__25906 = cljs.core.chunk_rest(seq__25589__$1);
var G__25907 = c__5694__auto__;
var G__25908 = cljs.core.count(c__5694__auto__);
var G__25909 = (0);
seq__25589 = G__25906;
chunk__25590 = G__25907;
count__25591 = G__25908;
i__25592 = G__25909;
continue;
} else {
var vec__25613 = cljs.core.first(seq__25589__$1);
var client_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25613,(0),null);
var client = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25613,(1),null);
try{knoxx.backend.domain.realtime.safe_ws_send_BANG_((client["socket"]),knoxx.backend.domain.realtime.ws_envelope(channel,payload));
}catch (e25616){var __25910 = e25616;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}

var G__25911 = cljs.core.next(seq__25589__$1);
var G__25912 = null;
var G__25913 = (0);
var G__25914 = (0);
seq__25589 = G__25911;
chunk__25590 = G__25912;
count__25591 = G__25913;
i__25592 = G__25914;
continue;
}
} else {
return null;
}
}
break;
}
});
/**
 * True when a realtime client should receive a scoped payload.
 * Conversation id is authoritative when the client already knows it. A blank
 * client conversation id may still match by session id so the first async
 * /chat/start response cannot strand the live stream before the frontend learns
 * the server-generated conversation id.
 */
knoxx.backend.domain.realtime.ws_client_matches_payload_QMARK_ = (function knoxx$backend$domain$realtime$ws_client_matches_payload_QMARK_(client,session_id,payload){
var payload_conversation_id = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (payload["conversation_id"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})()));
var client_session_id = (function (){var or__5162__auto__ = (client["sessionId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
var client_conversation_id = (function (){var or__5162__auto__ = (client["conversationId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
if((((!(clojure.string.blank_QMARK_(payload_conversation_id)))) && ((!(clojure.string.blank_QMARK_(client_conversation_id)))))){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(payload_conversation_id,client_conversation_id);
} else {
if((!(clojure.string.blank_QMARK_(session_id)))){
return (((!(clojure.string.blank_QMARK_(client_session_id)))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(session_id,client_session_id)));
} else {
return false;

}
}
});
/**
 * Broadcast to clients scoped by conversation-id for isolation.
 * Falls back to session-id matching for clients that have not learned the
 * conversation-id yet. Never broadcasts to all clients.
 */
knoxx.backend.domain.realtime.broadcast_ws_session_BANG_ = (function knoxx$backend$domain$realtime$broadcast_ws_session_BANG_(session_id,channel,payload){
var seq__25632 = cljs.core.seq(cljs.core.deref(knoxx.backend.domain.realtime.ws_clients_STAR_));
var chunk__25634 = null;
var count__25635 = (0);
var i__25636 = (0);
while(true){
if((i__25636 < count__25635)){
var vec__25673 = chunk__25634.cljs$core$IIndexed$_nth$arity$2(null,i__25636);
var client_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25673,(0),null);
var client = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25673,(1),null);
if(knoxx.backend.domain.realtime.ws_client_matches_payload_QMARK_(client,session_id,payload)){
try{knoxx.backend.domain.realtime.safe_ws_send_BANG_((client["socket"]),knoxx.backend.domain.realtime.ws_envelope(channel,payload));
}catch (e25678){var __25922 = e25678;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}} else {
}


var G__25924 = seq__25632;
var G__25925 = chunk__25634;
var G__25926 = count__25635;
var G__25927 = (i__25636 + (1));
seq__25632 = G__25924;
chunk__25634 = G__25925;
count__25635 = G__25926;
i__25636 = G__25927;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__25632);
if(temp__5825__auto__){
var seq__25632__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25632__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__25632__$1);
var G__25929 = cljs.core.chunk_rest(seq__25632__$1);
var G__25930 = c__5694__auto__;
var G__25931 = cljs.core.count(c__5694__auto__);
var G__25932 = (0);
seq__25632 = G__25929;
chunk__25634 = G__25930;
count__25635 = G__25931;
i__25636 = G__25932;
continue;
} else {
var vec__25693 = cljs.core.first(seq__25632__$1);
var client_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25693,(0),null);
var client = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25693,(1),null);
if(knoxx.backend.domain.realtime.ws_client_matches_payload_QMARK_(client,session_id,payload)){
try{knoxx.backend.domain.realtime.safe_ws_send_BANG_((client["socket"]),knoxx.backend.domain.realtime.ws_envelope(channel,payload));
}catch (e25696){var __25933 = e25696;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}} else {
}


var G__25935 = cljs.core.next(seq__25632__$1);
var G__25936 = null;
var G__25937 = (0);
var G__25938 = (0);
seq__25632 = G__25935;
chunk__25634 = G__25936;
count__25635 = G__25937;
i__25636 = G__25938;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.domain.realtime.ensure_ws_stats_loop_BANG_ = (function knoxx$backend$domain$realtime$ensure_ws_stats_loop_BANG_(runtime,active_runs_count){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.domain.realtime.ws_stats_interval_STAR_))){
return null;
} else {
return cljs.core.reset_BANG_(knoxx.backend.domain.realtime.ws_stats_interval_STAR_,setInterval((async function (){
if(cljs.core.seq(cljs.core.deref(knoxx.backend.domain.realtime.ws_clients_STAR_))){
try{var stats = (await knoxx.backend.domain.realtime.system_stats_BANG_(runtime,active_runs_count));
return knoxx.backend.domain.realtime.broadcast_ws_BANG_("stats",stats);
}catch (e25712){var _ = e25712;
return null;
}} else {
return null;
}
}),(5000)));
}
});
knoxx.backend.domain.realtime.stop_BANG_ = (function knoxx$backend$domain$realtime$stop_BANG_(){
var temp__5825__auto___25939 = cljs.core.deref(knoxx.backend.domain.realtime.ws_stats_interval_STAR_);
if(cljs.core.truth_(temp__5825__auto___25939)){
var interval_id_25941 = temp__5825__auto___25939;
clearInterval(interval_id_25941);

cljs.core.reset_BANG_(knoxx.backend.domain.realtime.ws_stats_interval_STAR_,null);
} else {
}

var seq__25736_25944 = cljs.core.seq(cljs.core.deref(knoxx.backend.domain.realtime.ws_clients_STAR_));
var chunk__25738_25945 = null;
var count__25739_25946 = (0);
var i__25740_25947 = (0);
while(true){
if((i__25740_25947 < count__25739_25946)){
var vec__25763_25949 = chunk__25738_25945.cljs$core$IIndexed$_nth$arity$2(null,i__25740_25947);
var client_id_25950 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25763_25949,(0),null);
var client_25951 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25763_25949,(1),null);
var socket_25952 = (client_25951["socket"]);
try{if(cljs.core.truth_(socket_25952)){
socket_25952.close((1001),"server_shutdown");
} else {
}
}catch (e25771){var __25953 = e25771;
}
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id_25950);


var G__25954 = seq__25736_25944;
var G__25955 = chunk__25738_25945;
var G__25956 = count__25739_25946;
var G__25957 = (i__25740_25947 + (1));
seq__25736_25944 = G__25954;
chunk__25738_25945 = G__25955;
count__25739_25946 = G__25956;
i__25740_25947 = G__25957;
continue;
} else {
var temp__5825__auto___25958 = cljs.core.seq(seq__25736_25944);
if(temp__5825__auto___25958){
var seq__25736_25960__$1 = temp__5825__auto___25958;
if(cljs.core.chunked_seq_QMARK_(seq__25736_25960__$1)){
var c__5694__auto___25961 = cljs.core.chunk_first(seq__25736_25960__$1);
var G__25962 = cljs.core.chunk_rest(seq__25736_25960__$1);
var G__25963 = c__5694__auto___25961;
var G__25964 = cljs.core.count(c__5694__auto___25961);
var G__25965 = (0);
seq__25736_25944 = G__25962;
chunk__25738_25945 = G__25963;
count__25739_25946 = G__25964;
i__25740_25947 = G__25965;
continue;
} else {
var vec__25781_25966 = cljs.core.first(seq__25736_25960__$1);
var client_id_25967 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25781_25966,(0),null);
var client_25968 = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__25781_25966,(1),null);
var socket_25969 = (client_25968["socket"]);
try{if(cljs.core.truth_(socket_25969)){
socket_25969.close((1001),"server_shutdown");
} else {
}
}catch (e25786){var __25972 = e25786;
}
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id_25967);


var G__25974 = cljs.core.next(seq__25736_25960__$1);
var G__25975 = null;
var G__25976 = (0);
var G__25977 = (0);
seq__25736_25944 = G__25974;
chunk__25738_25945 = G__25975;
count__25739_25946 = G__25976;
i__25740_25947 = G__25977;
continue;
}
} else {
}
}
break;
}

return true;
});
knoxx.backend.domain.realtime.register_ws_routes_BANG_ = (function knoxx$backend$domain$realtime$register_ws_routes_BANG_(runtime,app,active_runs_count,lounge_messages_STAR_){
knoxx.backend.domain.realtime.ensure_ws_stats_loop_BANG_(runtime,active_runs_count);

return app.route(({"method": "GET", "url": "/ws/stream", "handler": (function (_request,reply){
return reply.code((426)).type("application/json").send(({"error": "WebSocket upgrade required"}));
}), "wsHandler": (function (socket,request){
var ws = (function (){var or__5162__auto__ = (socket["socket"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return socket;
}
})();
var client_id = shadow.esm.esm_import$node_crypto.randomUUID();
var url_params = (function (){try{return (new URL((""+"http://localhost"+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["url"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "/ws/stream";
}
})()))));
}catch (e25815){var _ = e25815;
return null;
}})();
var session_id = (function (){try{var or__5162__auto__ = url_params.searchParams.get("session_id");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
}catch (e25816){var _ = e25816;
return "";
}})();
var conversation_id = (function (){try{var or__5162__auto__ = url_params.searchParams.get("conversation_id");
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
}catch (e25819){var _ = e25819;
return "";
}})();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.assoc,client_id,({"socket": ws, "sessionId": session_id, "conversationId": conversation_id}));

ws.on("close",(function (){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}));

ws.on("error",(function (){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.dissoc,client_id);
}));

ws.on("message",(function (data){
try{var msg = JSON.parse((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(data)));
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((msg["type"]),"set_conversation")){
var new_cid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (msg["conversation_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.domain.realtime.ws_clients_STAR_,cljs.core.update,client_id,(function (c){
if(cljs.core.truth_(c)){
return Object.assign(({}),c,({"conversationId": new_cid}));
} else {
return null;
}
}));
} else {
return null;
}
}catch (e25832){var _ = e25832;
return null;
}}));

(async function (){
try{var stats = (await knoxx.backend.domain.realtime.system_stats_BANG_(runtime,active_runs_count));
return knoxx.backend.domain.realtime.safe_ws_send_BANG_(ws,knoxx.backend.domain.realtime.ws_envelope("stats",stats));
}catch (e25843){var _ = e25843;
return null;
}})();

var seq__25846 = cljs.core.seq(cljs.core.take_last((20),cljs.core.deref(lounge_messages_STAR_)));
var chunk__25847 = null;
var count__25848 = (0);
var i__25849 = (0);
while(true){
if((i__25849 < count__25848)){
var msg = chunk__25847.cljs$core$IIndexed$_nth$arity$2(null,i__25849);
knoxx.backend.domain.realtime.safe_ws_send_BANG_(ws,knoxx.backend.domain.realtime.ws_envelope("lounge",msg));


var G__25986 = seq__25846;
var G__25987 = chunk__25847;
var G__25988 = count__25848;
var G__25989 = (i__25849 + (1));
seq__25846 = G__25986;
chunk__25847 = G__25987;
count__25848 = G__25988;
i__25849 = G__25989;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__25846);
if(temp__5825__auto__){
var seq__25846__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__25846__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__25846__$1);
var G__25990 = cljs.core.chunk_rest(seq__25846__$1);
var G__25991 = c__5694__auto__;
var G__25992 = cljs.core.count(c__5694__auto__);
var G__25993 = (0);
seq__25846 = G__25990;
chunk__25847 = G__25991;
count__25848 = G__25992;
i__25849 = G__25993;
continue;
} else {
var msg = cljs.core.first(seq__25846__$1);
knoxx.backend.domain.realtime.safe_ws_send_BANG_(ws,knoxx.backend.domain.realtime.ws_envelope("lounge",msg));


var G__25994 = cljs.core.next(seq__25846__$1);
var G__25995 = null;
var G__25996 = (0);
var G__25997 = (0);
seq__25846 = G__25994;
chunk__25847 = G__25995;
count__25848 = G__25996;
i__25849 = G__25997;
continue;
}
} else {
return null;
}
}
break;
}
})}));
});

//# sourceMappingURL=knoxx.backend.domain.realtime.js.map
