import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.agent_context.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.discord.gateway.js";
import "./knoxx.backend.domain.voice.client.js";
import "./knoxx.backend.infra.clients.knoxx_control.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.tools.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.discord.voice_tools');
knoxx.backend.domain.discord.voice_tools.gw = (function knoxx$backend$domain$discord$voice_tools$gw(){
return knoxx.backend.domain.discord.gateway.gateway_manager.cljs$core$IFn$_invoke$arity$0();
});
knoxx.backend.domain.discord.voice_tools.knoxx_control_client = (function knoxx$backend$domain$discord$voice_tools$knoxx_control_client(config){
return knoxx.backend.infra.clients.knoxx_control.client.cljs$core$IFn$_invoke$arity$1(config);
});
knoxx.backend.domain.discord.voice_tools.param_int = (function knoxx$backend$domain$discord$voice_tools$param_int(params,key,camel,default$){
var raw = (function (){var or__5162__auto__ = (params[key]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params[camel]);
}
})();
var n = Number(raw);
if(cljs.core.truth_((function (){var or__5162__auto__ = (raw == null);
if(or__5162__auto__){
return or__5162__auto__;
} else {
return isNaN(n);
}
})())){
return default$;
} else {
return n;
}
});
knoxx.backend.domain.discord.voice_tools.fetch_tts_BANG_ = (function knoxx$backend$domain$discord$voice_tools$fetch_tts_BANG_(config,text,voice_id,model_id){
return knoxx.backend.domain.voice.client.synthesize_BANG_(knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"text","text",-1790561697),text,new cljs.core.Keyword(null,"voice-id","voice-id",-823710186),voice_id,new cljs.core.Keyword(null,"model-id","model-id",-467101728),model_id,new cljs.core.Keyword(null,"response-format","response-format",1664465322),"mp3"], null));
});
knoxx.backend.domain.discord.voice_tools.transcribe_BANG_ = (function knoxx$backend$domain$discord$voice_tools$transcribe_BANG_(config,audio_buffer){
return knoxx.backend.domain.voice.client.transcribe_BANG_(knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$1(config),audio_buffer,null);
});
knoxx.backend.domain.discord.voice_tools.steer_BANG_ = (function knoxx$backend$domain$discord$voice_tools$steer_BANG_(config,session_id,conversation_id,text){
console.log("[voice:steer] injecting into session:",session_id,"conv:",conversation_id,"text:",text.slice((0),(60)));

var body = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"message","message",-406056002),(""+"[Voice] "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id], null);
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.clients.knoxx_control.steer_BANG_(knoxx.backend.domain.discord.voice_tools.knoxx_control_client(config),body)),(function (result){
return promesa.protocols._mcat(promesa.protocols._promise(console.log("[voice:steer] ok")),(function (___20890__auto__){
return promesa.protocols._promise(result);
}));
}));
}));
});
knoxx.backend.domain.discord.voice_tools.session_agent_spec = (function knoxx$backend$domain$discord$voice_tools$session_agent_spec(session){
var or__5162__auto__ = new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365).cljs$core$IFn$_invoke$arity$1(session);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agentSpec","agentSpec",933621050).cljs$core$IFn$_invoke$arity$1(session);
}
});
knoxx.backend.domain.discord.voice_tools.direct_start_voice_turn_BANG_ = (function knoxx$backend$domain$discord$voice_tools$direct_start_voice_turn_BANG_(config,body){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.clients.knoxx_control.direct_start_BANG_(knoxx.backend.domain.discord.voice_tools.knoxx_control_client(config),body)),(function (result){
return promesa.protocols._mcat(promesa.protocols._promise(console.log("[voice:direct-start] ok")),(function (___20890__auto__){
return promesa.protocols._promise(result);
}));
}));
}));
});
knoxx.backend.domain.discord.voice_tools.start_voice_turn_BANG_ = (function knoxx$backend$domain$discord$voice_tools$start_voice_turn_BANG_(config,session_id,conversation_id,text){
console.log("[voice:direct-start] starting idle session:",session_id,"conv:",conversation_id);

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.infra.stores.mongo_session_store.get_session.cljs$core$IFn$_invoke$arity$1(session_id)),(function (session){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.discord.voice_tools.session_agent_spec(session)),(function (agent_spec){
return promesa.protocols._mcat(promesa.protocols._promise((function (){var G__27522 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"message","message",-406056002),(""+"[Voice] "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text)),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id], null);
if(cljs.core.truth_(agent_spec)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27522,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),agent_spec);
} else {
return G__27522;
}
})()),(function (body){
return promesa.protocols._mcat(promesa.protocols._promise((cljs.core.truth_(agent_spec)?console.log("[voice:direct-start] resuming agent spec:",JSON.stringify(cljs.core.clj__GT_js(cljs.core.select_keys(agent_spec,new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contractId","contractId",710260199),new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"model","model",331153215)], null))))):null)),(function (___20890__auto__){
return promesa.protocols._promise(knoxx.backend.domain.discord.voice_tools.direct_start_voice_turn_BANG_(config,body));
}));
}));
}));
}));
}));
});
knoxx.backend.domain.discord.voice_tools.inactive_steer_error_QMARK_ = (function knoxx$backend$domain$discord$voice_tools$inactive_steer_error_QMARK_(err){
var message = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message)));
return ((clojure.string.includes_QMARK_(message,"no active running turn")) || (((clojure.string.includes_QMARK_(message,"conversation is not active")) || (clojure.string.includes_QMARK_(message,"not active in the agent runtime")))));
});
knoxx.backend.domain.discord.voice_tools.deliver_voice_text_BANG_ = (function knoxx$backend$domain$discord$voice_tools$deliver_voice_text_BANG_(config,sid,cid,text){
return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.discord.voice_tools.steer_BANG_(config,sid,cid,text),(function (err){
if(knoxx.backend.domain.discord.voice_tools.inactive_steer_error_QMARK_(err)){
console.log("[voice:deliver] steer target idle; starting a normal voice turn");

return knoxx.backend.domain.discord.voice_tools.start_voice_turn_BANG_(config,sid,cid,text);
} else {
throw err;
}
}));
});

knoxx.backend.domain.discord.voice_tools.voice_join_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord voice channel ID to join."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_join_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_join_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var ch = (await (async function (){var or__5162__auto__ = (params["channel_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["channelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var map__27554 = (knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_.cljs$core$IFn$_invoke$arity$1(params) : knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_.call(null,params));
var map__27554__$1 = cljs.core.__destructure_map(map__27554);
var sid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27554__$1,new cljs.core.Keyword(null,"sid","sid",1815016414));
var cid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27554__$1,new cljs.core.Keyword(null,"cid","cid",-1940591320));
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(ch)){
throw (new Error("channel_id required"));
} else {
}

console.log("[voice:tool] discord.voice.join channel:",ch);

if(cljs.core.truth_((await (async function (){var and__5160__auto__ = m;
if(cljs.core.truth_(and__5160__auto__)){
return ((cljs.core.seq(sid)) && (cljs.core.seq(cid)));
} else {
return and__5160__auto__;
}
})()))){
(m["__voiceSessionContext"] = ({"sessionId": sid, "conversationId": cid}));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Joining voice "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+"\u2026"));

var r = (await m.joinVoice(ch));
console.log("[voice:tool] joined voice, result:",JSON.stringify(r));

return knoxx.backend.domain.text.tool_text_result((""+"Joined voice "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+" in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((r["guildId"]))),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(r,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
});
knoxx.backend.domain.discord.voice_tools.voice_join_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.join","Join Voice","Join a Discord voice channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Join a voice channel to enable voice features.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.join to connect to a voice channel.","Provide channel_id from discord.list.channels."], null)),knoxx.backend.domain.discord.voice_tools.voice_join_params,knoxx.backend.domain.discord.voice_tools.voice_join_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_leave_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_leave_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_leave_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (await (async function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(g)){
throw (new Error("guild_id required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Leaving voice "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+"\u2026"));

if(cljs.core.truth_(m)){
(knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_.cljs$core$IFn$_invoke$arity$1(m) : knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_.call(null,m));

var temp__5825__auto___27824 = (m["__voiceListener"]);
if(cljs.core.truth_(temp__5825__auto___27824)){
var sf_27825 = temp__5825__auto___27824;
try{(sf_27825.cljs$core$IFn$_invoke$arity$0 ? sf_27825.cljs$core$IFn$_invoke$arity$0() : sf_27825.call(null));
}catch (e27572){if((e27572 instanceof Error)){
var __27826 = e27572;
} else {
throw e27572;

}
}} else {
}

(m["__voiceListener"] = null);

(m["__voiceSessionContext"] = null);
} else {
}

var r = (await m.leaveVoice(g));
return knoxx.backend.domain.text.tool_text_result((""+"Left voice in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(r,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
});
knoxx.backend.domain.discord.voice_tools.voice_leave_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.leave","Leave Voice","Leave a Discord voice channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Disconnect from a voice channel.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.leave to disconnect from a voice channel.","Provide the guild_id of the active connection."], null)),knoxx.backend.domain.discord.voice_tools.voice_leave_params,knoxx.backend.domain.discord.voice_tools.voice_leave_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_say_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Text to synthesize and play in the voice channel."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"voice_id","voice_id",-725801774),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx/Kokoro voice ID. Default: af_jessica."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model_id","model_id",-2010580717),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx model ID. Default: kokoro."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_say_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_say_execute(_runtime,config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (await (async function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var text = (await (async function (){var or__5162__auto__ = (params["text"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
var vi = (params["voice_id"]);
var mi = (params["model_id"]);
var listening_QMARK_ = cljs.core.boolean$((cljs.core.truth_(m)?(m["__voiceListener"]):null));
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(g)){
throw (new Error("guild_id required"));
} else {
}

if(clojure.string.blank_QMARK_(text)){
throw (new Error("text required"));
} else {
}

if(listening_QMARK_){
} else {
throw (new Error("Voice listener is not running. Use discord.voice.connect (preferred) before discord.voice.say."));
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"TTS: \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text.slice((0),(40)))+"\"\u2026"));

var buf = (await knoxx.backend.domain.discord.voice_tools.fetch_tts_BANG_(config,text,vi,mi));
(await m.playAudio(g,buf));

return knoxx.backend.domain.text.tool_text_result((""+"Playing in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+": \""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text.slice((0),(60)))+"\""),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"guildId","guildId",-559818490),g,new cljs.core.Keyword(null,"text","text",-1790561697),text,new cljs.core.Keyword(null,"played","played",-1713723590),true,new cljs.core.Keyword(null,"listening","listening",1028216980),true], null));
});
knoxx.backend.domain.discord.voice_tools.voice_say_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.say","Voice Say","Synthesize speech and play in a voice channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Speak text aloud in a connected voice channel.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.say to speak in a voice channel.","Must be connected via discord.voice.join first.","Provide guild_id and text. Optionally set voice_id and model_id."], null)),knoxx.backend.domain.discord.voice_tools.voice_say_params,knoxx.backend.domain.discord.voice_tools.voice_say_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_status_params = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461)], null);
knoxx.backend.domain.discord.voice_tools.voice_status_execute = (function knoxx$backend$domain$discord$voice_tools$voice_status_execute(_runtime,_config,_tool_call_id,_params,a,b,c){
var on_update = (function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})();
var m = knoxx.backend.domain.discord.voice_tools.gw();
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"Checking voice\u2026");

var c__$1 = m.getVoiceConnection();
var agent_loop = (m["__voiceAgentEventLoop"]);
return knoxx.backend.domain.text.tool_text_result((cljs.core.truth_(c__$1)?(""+"Connected to guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = c__$1.__guildId;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return c__$1.guildId;
}
})())):"Not connected"),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"connected","connected",-169833045),(!((c__$1 == null))),new cljs.core.Keyword(null,"agentEventLoop","agentEventLoop",985359234),(!((agent_loop == null))),new cljs.core.Keyword(null,"queuedAudioWindows","queuedAudioWindows",-367314727),(cljs.core.truth_(agent_loop)?(function (){var or__5162__auto__ = (agent_loop["audioWindows"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})().length:null)], null));
});
knoxx.backend.domain.discord.voice_tools.voice_status_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.status","Voice Status","Check voice connection status.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Check whether the bot is connected to a voice channel.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.status to check if the bot is in a voice channel.","No parameters required."], null)),knoxx.backend.domain.discord.voice_tools.voice_status_params,knoxx.backend.domain.discord.voice_tools.voice_status_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_connect_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord voice channel ID to join."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Agent session ID to inject transcriptions into. Auto-detected if omitted."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Agent conversation ID for the session. Auto-detected if omitted."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_listen_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Agent session ID to inject transcriptions into. Auto-detected if omitted."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Agent conversation ID for the session. Auto-detected if omitted."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
/**
 * Resolve (session-id, conversation-id) either from explicit params, the current agent context,
 * or the last known voice session context stored on the gateway manager.
 */
knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_ = (function knoxx$backend$domain$discord$voice_tools$resolve_session_context_BANG_(params){
var explicit_sid = (function (){var or__5162__auto__ = ((clojure.string.blank_QMARK_((params["session_id"])))?null:(params["session_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(clojure.string.blank_QMARK_((params["sessionId"]))){
return null;
} else {
return (params["sessionId"]);
}
}
})();
var explicit_cid = (function (){var or__5162__auto__ = ((clojure.string.blank_QMARK_((params["conversation_id"])))?null:(params["conversation_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(clojure.string.blank_QMARK_((params["conversationId"]))){
return null;
} else {
return (params["conversationId"]);
}
}
})();
var agent_context = (knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.domain.agent.agent_context.get_context.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.domain.agent.agent_context.get_context.call(null));
var stored_ctx = (function (){var G__27631 = knoxx.backend.domain.discord.voice_tools.gw();
if((G__27631 == null)){
return null;
} else {
return (G__27631["__voiceSessionContext"]);
}
})();
var sid = (function (){var or__5162__auto__ = explicit_sid;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(agent_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (cljs.core.truth_(stored_ctx)?(stored_ctx["sessionId"]):null);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})();
var cid = (function (){var or__5162__auto__ = explicit_cid;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(agent_context);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (cljs.core.truth_(stored_ctx)?(stored_ctx["conversationId"]):null);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "";
}
}
}
})();
console.log("[voice:tool] resolve-session-context explicit-sid:",explicit_sid,"agent-context:",(cljs.core.truth_(agent_context)?JSON.stringify(cljs.core.clj__GT_js(agent_context)):null),"stored-sid:",(cljs.core.truth_(stored_ctx)?(stored_ctx["sessionId"]):null),"resolved-sid:",sid);

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"sid","sid",1815016414),sid,new cljs.core.Keyword(null,"cid","cid",-1940591320),cid,new cljs.core.Keyword(null,"auto?","auto?",1295579150),((clojure.string.blank_QMARK_(explicit_sid)) && (clojure.string.blank_QMARK_(explicit_cid)))], null);
});
knoxx.backend.domain.discord.voice_tools.ensure_session_context_BANG_ = (function knoxx$backend$domain$discord$voice_tools$ensure_session_context_BANG_(sid,cid){
if(clojure.string.blank_QMARK_(sid)){
throw (new Error((""+"session_id required (auto-detect failed; no active agent turn context). "+"If calling manually, provide session_id and conversation_id explicitly.")));
} else {
}

if(clojure.string.blank_QMARK_(cid)){
throw (new Error((""+"conversation_id required (auto-detect failed; no active agent turn context). "+"If calling manually, provide session_id and conversation_id explicitly.")));
} else {
return null;
}
});
/**
 * Send accumulated transcription text for a user as a single steer.
 */
knoxx.backend.domain.discord.voice_tools.flush_voice_buffer_BANG_ = (async function knoxx$backend$domain$discord$voice_tools$flush_voice_buffer_BANG_(config,sid,cid,uid){
var m = knoxx.backend.domain.discord.voice_tools.gw();
var buf_obj = (cljs.core.truth_(m)?(m["__voiceTranscriptionBuffer"]):null);
var user_buf = (cljs.core.truth_(buf_obj)?(buf_obj[uid]):null);
if(cljs.core.truth_(user_buf)){
var texts = (user_buf["texts"]);
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = texts;
if(cljs.core.truth_(and__5160__auto__)){
return texts.length;
} else {
return and__5160__auto__;
}
})()))){
var merged_27834 = clojure.string.trim(clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",Array.from(texts)));
console.log("[voice:tool] >>> FLUSHING buffer for",uid,"concatenated:",((clojure.string.blank_QMARK_(merged_27834))?"[EMPTY]":merged_27834));

if(clojure.string.blank_QMARK_(merged_27834)){
} else {
try{(await knoxx.backend.domain.discord.voice_tools.deliver_voice_text_BANG_(config,sid,cid,merged_27834));
}catch (e27643){var e_27835 = e27643;
console.error("[voice:tool] voice delivery FAILED for",uid,":",e_27835.message);
}}
} else {
}

(user_buf["texts"] = []);

return (user_buf["timer"] = null);
} else {
return null;
}
});
knoxx.backend.domain.discord.voice_tools.audio_window_content_part = (function knoxx$backend$domain$discord$voice_tools$audio_window_content_part(uid,audio_buffer){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"type","type",1174270348),"audio",new cljs.core.Keyword(null,"data","data",-232669377),audio_buffer.toString("base64"),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),"audio/wav",new cljs.core.Keyword(null,"filename","filename",-1428840783),(""+"discord-voice-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(uid)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Date.now())+".wav"),new cljs.core.Keyword(null,"bytes","bytes",1175866680),audio_buffer.length], null);
});
knoxx.backend.domain.discord.voice_tools.requeue_front_BANG_ = (function knoxx$backend$domain$discord$voice_tools$requeue_front_BANG_(queue,windows){
var seq__27663 = cljs.core.seq(cljs.core.reverse(windows));
var chunk__27664 = null;
var count__27665 = (0);
var i__27666 = (0);
while(true){
if((i__27666 < count__27665)){
var window__$1 = chunk__27664.cljs$core$IIndexed$_nth$arity$2(null,i__27666);
queue.unshift(window__$1);


var G__27836 = seq__27663;
var G__27837 = chunk__27664;
var G__27838 = count__27665;
var G__27839 = (i__27666 + (1));
seq__27663 = G__27836;
chunk__27664 = G__27837;
count__27665 = G__27838;
i__27666 = G__27839;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__27663);
if(temp__5825__auto__){
var seq__27663__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__27663__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__27663__$1);
var G__27840 = cljs.core.chunk_rest(seq__27663__$1);
var G__27841 = c__5694__auto__;
var G__27842 = cljs.core.count(c__5694__auto__);
var G__27843 = (0);
seq__27663 = G__27840;
chunk__27664 = G__27841;
count__27665 = G__27842;
i__27666 = G__27843;
continue;
} else {
var window__$1 = cljs.core.first(seq__27663__$1);
queue.unshift(window__$1);


var G__27844 = cljs.core.next(seq__27663__$1);
var G__27845 = null;
var G__27846 = (0);
var G__27847 = (0);
seq__27663 = G__27844;
chunk__27664 = G__27845;
count__27665 = G__27846;
i__27666 = G__27847;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.domain.discord.voice_tools.trigger_agent_voice_event_BANG_ = (async function knoxx$backend$domain$discord$voice_tools$trigger_agent_voice_event_BANG_(config,loop_state,windows){
var guild_id = (loop_state["guildId"]);
var channel_id = (loop_state["channelId"]);
var event_id = (""+"discord-voice-audio-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(guild_id)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Date.now()));
var body = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),event_id,new cljs.core.Keyword(null,"sourceKind","sourceKind",-1570414889),"discord",new cljs.core.Keyword(null,"eventKind","eventKind",2138897648),"discord.voice.audio.window",new cljs.core.Keyword(null,"eventKinds","eventKinds",360827289),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["discord.voice.audio.window"], null),new cljs.core.Keyword(null,"payload","payload",-383036092),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"guildId","guildId",-559818490),guild_id,new cljs.core.Keyword(null,"channelId","channelId",2082229448),channel_id,new cljs.core.Keyword(null,"authorId","authorId",-1664154012),"discord-voice-room",new cljs.core.Keyword(null,"content","content",15833224),"Raw Discord voice audio window(s) are attached. Do not require ASR; perceive the audio directly if the model supports it.",new cljs.core.Keyword(null,"summary","summary",380847952),(""+"Discord voice audio event with "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(windows))+" window(s)."),new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),windows], null)], null);
(await knoxx.backend.infra.clients.knoxx_control.dispatch_event_BANG_(knoxx.backend.domain.discord.voice_tools.knoxx_control_client(config),body));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"event_id","event_id",-767275570),event_id,new cljs.core.Keyword(null,"windows","windows",2068861701),cljs.core.count(windows)], null);
});
knoxx.backend.domain.discord.voice_tools.run_agent_event_loop_step_BANG_ = (async function knoxx$backend$domain$discord$voice_tools$run_agent_event_loop_step_BANG_(config,loop_state){
var queue = (await (async function (){var or__5162__auto__ = (loop_state["audioWindows"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})());
if(cljs.core.truth_((await (async function (){var or__5162__auto__ = (loop_state["running"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (queue.length === (0));
}
})()))){
return Promise.resolve(null);
} else {
var max_windows = (loop_state["maxWindowsPerTurn"]);
var n = cljs.core.min.cljs$core$IFn$_invoke$arity$2(queue.length,max_windows);
var windows = cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(queue.splice((0),n)));
(loop_state["running"] = true);

try{return (await knoxx.backend.domain.discord.voice_tools.trigger_agent_voice_event_BANG_(config,loop_state,windows));
}catch (e27708){var err = e27708;
var message = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message));
var busy_QMARK_ = ((clojure.string.includes_QMARK_(message,"agent_already_processing")) || (clojure.string.includes_QMARK_(message,"already processing")));
if(busy_QMARK_){
knoxx.backend.domain.discord.voice_tools.requeue_front_BANG_(queue,windows);
} else {
}

return console.log("[voice:agent-event] trigger not accepted:",message);
}finally {(loop_state["running"] = false);
}}
});
knoxx.backend.domain.discord.voice_tools.schedule_agent_event_loop_BANG_ = (function knoxx$backend$domain$discord$voice_tools$schedule_agent_event_loop_BANG_(config,m,loop_state){
if(cljs.core.truth_((loop_state["stopped"]))){
return null;
} else {
return (loop_state["timer"] = setTimeout((async function (){
try{return (await knoxx.backend.domain.discord.voice_tools.run_agent_event_loop_step_BANG_(config,loop_state));
}finally {(knoxx.backend.domain.discord.voice_tools.schedule_agent_event_loop_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.discord.voice_tools.schedule_agent_event_loop_BANG_.cljs$core$IFn$_invoke$arity$3(config,m,loop_state) : knoxx.backend.domain.discord.voice_tools.schedule_agent_event_loop_BANG_.call(null,config,m,loop_state));
}}),(loop_state["tickMs"])));
}
});
knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_ = (function knoxx$backend$domain$discord$voice_tools$stop_agent_event_loop_BANG_(m){
var temp__5825__auto__ = (cljs.core.truth_(m)?(m["__voiceAgentEventLoop"]):null);
if(cljs.core.truth_(temp__5825__auto__)){
var loop_state = temp__5825__auto__;
(loop_state["stopped"] = true);

var temp__5825__auto___27851__$1 = (loop_state["timer"]);
if(cljs.core.truth_(temp__5825__auto___27851__$1)){
var timer_27852 = temp__5825__auto___27851__$1;
clearTimeout(timer_27852);
} else {
}

var temp__5825__auto___27853__$1 = (loop_state["listenerStop"]);
if(cljs.core.truth_(temp__5825__auto___27853__$1)){
var stop_27854 = temp__5825__auto___27853__$1;
try{(stop_27854.cljs$core$IFn$_invoke$arity$0 ? stop_27854.cljs$core$IFn$_invoke$arity$0() : stop_27854.call(null));
}catch (e27714){if((e27714 instanceof Error)){
var __27855 = e27714;
} else {
throw e27714;

}
}} else {
}

(m["__voiceAgentEventLoop"] = null);

return (m["__voiceListener"] = null);
} else {
return null;
}
});
knoxx.backend.domain.discord.voice_tools.start_agent_event_voice_listener_BANG_ = (async function knoxx$backend$domain$discord$voice_tools$start_agent_event_voice_listener_BANG_(config,m,g,ch,sid,cid,auto_QMARK_,params,on_update){
var tick_ms = cljs.core.max.cljs$core$IFn$_invoke$arity$2((250),knoxx.backend.domain.discord.voice_tools.param_int(params,"tick_ms","tickMs",(1000)));
var max_windows = cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(await (async function (){var or__5162__auto__ = knoxx.backend.domain.discord.voice_tools.param_int(params,"max_windows_per_event","maxWindowsPerEvent",null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.discord.voice_tools.param_int(params,"max_windows_per_turn","maxWindowsPerTurn",(3));
}
})()));
var model_id = (await (async function (){var or__5162__auto__ = (params["model_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["modelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_(m);

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Listening in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+" as agent-event voice trigger\u2026"));

console.log("[voice:tool] discord.voice.listen agent-event guild:",g,"session:",sid,"conv:",cid,"auto-detect?",auto_QMARK_);

var stop = (await m.startVoiceListener(g,(function (uid){
return console.log("[voice:agent-event] speaker start:",uid);
}),(function (uid,buf){
console.log("[voice:agent-event] audio window:",uid,"bytes:",buf.length);

var temp__5825__auto__ = (m["__voiceAgentEventLoop"]);
if(cljs.core.truth_(temp__5825__auto__)){
var loop_state = temp__5825__auto__;
return (loop_state["audioWindows"]).push(knoxx.backend.domain.discord.voice_tools.audio_window_content_part(uid,buf));
} else {
return null;
}
})));
var loop_state = ({"listenerStop": stop, "sessionId": sid, "guildId": g, "channelId": ch, "modelId": model_id, "audioWindows": [], "running": false, "stopped": false, "tickMs": tick_ms, "maxWindowsPerTurn": max_windows, "conversationId": cid});
(m["__voiceAgentEventLoop"] = loop_state);

(m["__voiceListener"] = stop);

knoxx.backend.domain.discord.voice_tools.schedule_agent_event_loop_BANG_(config,m,loop_state);

return knoxx.backend.domain.text.tool_text_result((""+"Listening in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+" as agent-event trigger for session "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sid)),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"guildId","guildId",-559818490),g,new cljs.core.Keyword(null,"listening","listening",1028216980),true,new cljs.core.Keyword(null,"mode","mode",654403691),"agent_event",new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),sid,new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),cid,new cljs.core.Keyword(null,"tickMs","tickMs",-947024718),tick_ms], null));
});
knoxx.backend.domain.discord.voice_tools.start_asr_steer_voice_listener_BANG_ = (async function knoxx$backend$domain$discord$voice_tools$start_asr_steer_voice_listener_BANG_(config,m,g,sid,auto_QMARK_,steer_debounce_ms,on_update){
knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_(m);

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Listening in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+"\u2026"));

console.log("[voice:tool] discord.voice.listen guild:",g,"session:",sid,"auto-detect?",auto_QMARK_);

var stop = (await m.startVoiceListener(g,(function (uid){
console.log("[voice:tool] >>> on-start callback fired for user:",uid);

var buf_obj = (cljs.core.truth_(m)?(m["__voiceTranscriptionBuffer"]):null);
var user_buf = (cljs.core.truth_(buf_obj)?(buf_obj[uid]):null);
if(cljs.core.truth_(user_buf)){
var temp__5825__auto__ = (user_buf["timer"]);
if(cljs.core.truth_(temp__5825__auto__)){
var t = temp__5825__auto__;
clearTimeout(t);

return (user_buf["timer"] = null);
} else {
return null;
}
} else {
return null;
}
}),(async function (uid,buf){
console.log("[voice:tool] >>> on-audio callback fired for user:",uid,"buffer length:",buf.length,"bytes");

try{var t = (await knoxx.backend.domain.discord.voice_tools.transcribe_BANG_(config,buf));
console.log("[voice:tool] transcription result for",uid,":",((clojure.string.blank_QMARK_(t))?"[EMPTY]":t));

if(clojure.string.blank_QMARK_(t)){
return null;
} else {
var buf_obj = (cljs.core.truth_(m)?(m["__voiceTranscriptionBuffer"]):null);
var _ = (cljs.core.truth_((await (async function (){var and__5160__auto__ = m;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.not(buf_obj);
} else {
return and__5160__auto__;
}
})()))?(m["__voiceTranscriptionBuffer"] = ({})):null);
var buf_obj__$1 = (await (async function (){var or__5162__auto__ = buf_obj;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (m["__voiceTranscriptionBuffer"]);
}
})());
var user_buf = (await (async function (){var or__5162__auto__ = (buf_obj__$1[uid]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({"texts": [], "timer": null});
}
})());
(user_buf["texts"]).push(t);

(buf_obj__$1[uid] = user_buf);

var temp__5825__auto___27857 = (user_buf["timer"]);
if(cljs.core.truth_(temp__5825__auto___27857)){
var old_timer_27858 = temp__5825__auto___27857;
clearTimeout(old_timer_27858);
} else {
}

var new_timer = setTimeout((function (){
return knoxx.backend.domain.discord.voice_tools.flush_voice_buffer_BANG_(config,sid,((m["__voiceSessionContext"])["conversationId"]),uid);
}),steer_debounce_ms);
return (user_buf["timer"] = new_timer);
}
}catch (e27724){var e = e27724;
return console.error("[voice:tool] transcription/steering pipeline FAILED for",uid,":",e.message);
}})));
(m["__voiceListener"] = stop);

return knoxx.backend.domain.text.tool_text_result((""+"Listening in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)+". Transcriptions \u2192 session "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(sid)),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"guildId","guildId",-559818490),g,new cljs.core.Keyword(null,"listening","listening",1028216980),true,new cljs.core.Keyword(null,"mode","mode",654403691),"asr_steer"], null));
});
knoxx.backend.domain.discord.voice_tools.voice_listen_execute = (function knoxx$backend$domain$discord$voice_tools$voice_listen_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})();
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var map__27739 = knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_(params);
var map__27739__$1 = cljs.core.__destructure_map(map__27739);
var sid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27739__$1,new cljs.core.Keyword(null,"sid","sid",1815016414));
var cid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27739__$1,new cljs.core.Keyword(null,"cid","cid",-1940591320));
var auto_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27739__$1,new cljs.core.Keyword(null,"auto?","auto?",1295579150));
var steer_debounce_ms = (1500);
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(g)){
throw (new Error("guild_id required"));
} else {
}

knoxx.backend.domain.discord.voice_tools.ensure_session_context_BANG_(sid,cid);

(m["__voiceSessionContext"] = ({"sessionId": sid, "conversationId": cid}));

if(cljs.core.truth_((m["__voiceTranscriptionBuffer"]))){
} else {
(m["__voiceTranscriptionBuffer"] = ({}));
}

return knoxx.backend.domain.discord.voice_tools.start_asr_steer_voice_listener_BANG_(config,m,g,sid,auto_QMARK_,steer_debounce_ms,on_update);
});
knoxx.backend.domain.discord.voice_tools.voice_connect_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_connect_execute(runtime,config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var ch = (await (async function (){var or__5162__auto__ = (params["channel_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["channelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var map__27744 = knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_(params);
var map__27744__$1 = cljs.core.__destructure_map(map__27744);
var sid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27744__$1,new cljs.core.Keyword(null,"sid","sid",1815016414));
var cid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27744__$1,new cljs.core.Keyword(null,"cid","cid",-1940591320));
var auto_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27744__$1,new cljs.core.Keyword(null,"auto?","auto?",1295579150));
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(ch)){
throw (new Error("channel_id required"));
} else {
}

knoxx.backend.domain.discord.voice_tools.ensure_session_context_BANG_(sid,cid);

if(cljs.core.truth_(m)){
(m["__voiceSessionContext"] = ({"sessionId": sid, "conversationId": cid}));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Connecting voice + listener for channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+"\u2026"));

var r = (await m.joinVoice(ch));
var guild_id = (await (async function (){var or__5162__auto__ = (r["guildId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(guild_id)){
throw (new Error("joinVoice did not return guildId"));
} else {
}

console.log("[voice:tool] discord.voice.connect joined",ch,"guild",guild_id,"auto-detect?",auto_QMARK_);

(await knoxx.backend.domain.discord.voice_tools.voice_listen_execute(runtime,config,_tool_call_id,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),guild_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),sid,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),cid], null)),a,b,c));

return knoxx.backend.domain.text.tool_text_result((""+"Connected to voice "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+" and listening"),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),ch,new cljs.core.Keyword(null,"listening","listening",1028216980),true,new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),sid,new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),cid], null));
});
knoxx.backend.domain.discord.voice_tools.voice_connect_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.connect","Voice Connect","Join a Discord voice channel and start listening/transcription.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Join voice + enable voice-to-text transcription in one operation.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.connect as the default voice entrypoint.","Provide channel_id. session_id and conversation_id are auto-detected when called during an agent run.","This will join the channel, then start listening in the resulting guild."], null)),knoxx.backend.domain.discord.voice_tools.voice_connect_params,knoxx.backend.domain.discord.voice_tools.voice_connect_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_listen_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.listen","Voice Listen","Listen for user speech and transcribe into agent session.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Start listening for voice input and transcribe speech to text.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.listen only when already connected via discord.voice.join.","Provide guild_id. session_id and conversation_id are auto-detected.","Transcriptions are steered into the agent session automatically."], null)),knoxx.backend.domain.discord.voice_tools.voice_listen_params,knoxx.backend.domain.discord.voice_tools.voice_listen_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_params = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Discord voice channel ID to join and emit raw-audio events from."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tick_ms","tick_ms",999628236),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Mechanical event-dispatch cadence in ms. Default 1000."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"max_windows_per_event","max_windows_per_event",-947356916),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum queued WAV windows per emitted event. Default 3."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_params = new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voice channel ID used as the event owner/filter key."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tick_ms","tick_ms",999628236),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Mechanical event-dispatch cadence in ms. Default 1000."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"max_windows_per_event","max_windows_per_event",-947356916),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Maximum queued WAV windows per emitted event. Default 3."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_execute = (function knoxx$backend$domain$discord$voice_tools$voice_agent_event_listen_execute(_runtime,config,_tool_call_id,params,a,b,c){
var on_update = (function (){var or__5162__auto__ = ((cljs.core.fn_QMARK_(a))?a:null);
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
})();
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var ch = (function (){var or__5162__auto__ = (params["channel_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["channelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
var map__27771 = knoxx.backend.domain.discord.voice_tools.resolve_session_context_BANG_(params);
var map__27771__$1 = cljs.core.__destructure_map(map__27771);
var sid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27771__$1,new cljs.core.Keyword(null,"sid","sid",1815016414));
var cid = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27771__$1,new cljs.core.Keyword(null,"cid","cid",-1940591320));
var auto_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27771__$1,new cljs.core.Keyword(null,"auto?","auto?",1295579150));
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(g)){
throw (new Error("guild_id required"));
} else {
}

return knoxx.backend.domain.discord.voice_tools.start_agent_event_voice_listener_BANG_(config,m,g,ch,sid,cid,auto_QMARK_,params,on_update);
});
knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_agent_event_connect_execute(runtime,config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var ch = (await (async function (){var or__5162__auto__ = (params["channel_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["channelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(ch)){
throw (new Error("channel_id required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Connecting voice event source for channel "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+"\u2026"));

var r = (await m.joinVoice(ch));
var guild_id = (await (async function (){var or__5162__auto__ = (r["guildId"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})());
if(clojure.string.blank_QMARK_(guild_id)){
throw (new Error("joinVoice did not return guildId"));
} else {
}

return (await knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_execute(runtime,config,_tool_call_id,cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),guild_id,new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),ch,new cljs.core.Keyword(null,"tick_ms","tick_ms",999628236),(await (async function (){var or__5162__auto__ = (params["tick_ms"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["tickMs"]);
}
})()),new cljs.core.Keyword(null,"max_windows_per_event","max_windows_per_event",-947356916),(await (async function (){var or__5162__auto__ = (params["max_windows_per_event"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (params["maxWindowsPerEvent"]);
}
})())], null)),a,b,c));
});
knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.agent_event.connect","Voice Event Connect","Join voice and emit raw Discord audio as real Knoxx dispatch events.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Contract-only voice event generator for agents that perceive raw audio through event-triggered runs; no ASR and no direct provider loop.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["This is for contracts that explicitly grant :cap/voice-audio-event.","It emits discord.voice.audio.window events; matching trigger resources decide what to do.","Do not use this as a general replacement for discord.voice.connect."], null)),knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_params,knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.agent_event.listen","Voice Event Listen","Emit raw Discord audio as real Knoxx dispatch events for an existing voice connection.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Contract-only voice event generator; no ASR and no direct provider loop.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use only after joining voice.","Emits discord.voice.audio.window events for matching trigger resources."], null)),knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_params,knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_stop_listen_params = new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_stop_listen_execute = (function knoxx$backend$domain$discord$voice_tools$voice_stop_listen_execute(_runtime,_config,_tool_call_id,params,_a,_b,_c){
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
if(cljs.core.truth_(m)){
knoxx.backend.domain.discord.voice_tools.stop_agent_event_loop_BANG_(m);

var temp__5825__auto___27869 = (m["__voiceListener"]);
if(cljs.core.truth_(temp__5825__auto___27869)){
var sf_27870 = temp__5825__auto___27869;
(sf_27870.cljs$core$IFn$_invoke$arity$0 ? sf_27870.cljs$core$IFn$_invoke$arity$0() : sf_27870.call(null));
} else {
}

(m["__voiceListener"] = null);

(m["__voiceSessionContext"] = null);
} else {
}

return knoxx.backend.domain.text.tool_text_result((""+"Stopped listening in guild "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(g)),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"guildId","guildId",-559818490),g,new cljs.core.Keyword(null,"listening","listening",1028216980),false], null));
});
knoxx.backend.domain.discord.voice_tools.voice_stop_listen_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.stop_listen","Stop Voice Listen","Stop listening for voice input.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Stop the active voice listener in a guild.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.stop_listen to stop voice transcription.","Provide the guild_id of the active listener."], null)),knoxx.backend.domain.discord.voice_tools.voice_stop_listen_params,knoxx.backend.domain.discord.voice_tools.voice_stop_listen_execute], 0));
knoxx.backend.domain.discord.voice_tools.voice_list_members_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"guild_id","guild_id",-2139504959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Guild ID with an active voice connection."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"channel_id","channel_id",1180018383),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Voice channel ID to list members of."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.discord.voice_tools.voice_list_members_execute = (async function knoxx$backend$domain$discord$voice_tools$voice_list_members_execute(_runtime,_config,_tool_call_id,params,a,b,c){
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
var m = knoxx.backend.domain.discord.voice_tools.gw();
var g = (await (async function (){var or__5162__auto__ = (params["guild_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["guildId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
var ch = (await (async function (){var or__5162__auto__ = (params["channel_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (params["channelId"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(cljs.core.truth_(m)){
} else {
throw (new Error("Gateway not started"));
}

if(clojure.string.blank_QMARK_(g)){
throw (new Error("guild_id required"));
} else {
}

if(clojure.string.blank_QMARK_(ch)){
throw (new Error("channel_id required"));
} else {
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Listing voice members in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+"\u2026"));

var members = (await m.listVoiceMembers(g,ch));
var ms = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(members,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var lines = cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (m__$1){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(new cljs.core.Keyword(null,"isBot","isBot",-56412981).cljs$core$IFn$_invoke$arity$1(m__$1))?"[bot] ":""))+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"displayName","displayName",-809144601).cljs$core$IFn$_invoke$arity$1(m__$1))+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(m__$1))+")");
}),ms);
return knoxx.backend.domain.text.tool_text_result((""+"Voice members in "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ch)+":\n"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2("\n",lines))),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"channelId","channelId",2082229448),ch,new cljs.core.Keyword(null,"members","members",159001018),ms,new cljs.core.Keyword(null,"count","count",2139924085),cljs.core.count(ms)], null));
});
knoxx.backend.domain.discord.voice_tools.voice_list_members_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"discord.voice.list_members","List Voice Members","List members currently in a voice channel.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["List who is in a voice channel.",cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Use discord.voice.list_members to see who is in a voice channel.","Provide guild_id and channel_id."], null)),knoxx.backend.domain.discord.voice_tools.voice_list_members_params,knoxx.backend.domain.discord.voice_tools.voice_list_members_execute], 0));
knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools = (function knoxx$backend$domain$discord$voice_tools$create_discord_voice_custom_tools(var_args){
var G__27807 = arguments.length;
switch (G__27807) {
case 2:
return knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var ok_QMARK_ = (function (id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 10, 5, cljs.core.PersistentVector.EMPTY_NODE, [((ok_QMARK_("discord.voice.join"))?knoxx.backend.domain.discord.voice_tools.voice_join_tool(runtime,config):null),((ok_QMARK_("discord.voice.leave"))?knoxx.backend.domain.discord.voice_tools.voice_leave_tool(runtime,config):null),((ok_QMARK_("discord.voice.say"))?knoxx.backend.domain.discord.voice_tools.voice_say_tool(runtime,config):null),((ok_QMARK_("discord.voice.status"))?knoxx.backend.domain.discord.voice_tools.voice_status_tool(runtime,config):null),((ok_QMARK_("discord.voice.connect"))?knoxx.backend.domain.discord.voice_tools.voice_connect_tool(runtime,config):null),((ok_QMARK_("discord.voice.listen"))?knoxx.backend.domain.discord.voice_tools.voice_listen_tool(runtime,config):null),((ok_QMARK_("discord.voice.agent_event.connect"))?knoxx.backend.domain.discord.voice_tools.voice_agent_event_connect_tool(runtime,config):null),((ok_QMARK_("discord.voice.agent_event.listen"))?knoxx.backend.domain.discord.voice_tools.voice_agent_event_listen_tool(runtime,config):null),((ok_QMARK_("discord.voice.stop_listen"))?knoxx.backend.domain.discord.voice_tools.voice_stop_listen_tool(runtime,config):null),((ok_QMARK_("discord.voice.list_members"))?knoxx.backend.domain.discord.voice_tools.voice_list_members_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.discord.voice_tools.create_discord_voice_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.discord.voice_tools.js.map
