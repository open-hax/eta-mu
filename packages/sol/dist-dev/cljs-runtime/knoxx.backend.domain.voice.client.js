import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.extern.fetch.js";
import "./promesa.core.js";
goog.provide('knoxx.backend.domain.voice.client');

/**
 * @interface
 */
knoxx.backend.domain.voice.client.ITtsClient = function(){};

var knoxx$backend$domain$voice$client$ITtsClient$synthesize_BANG_$dyn_33331 = (function (client,G__32982){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.voice.client.synthesize_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(client,G__32982) : m__5520__auto__.call(null,client,G__32982));
} else {
var m__5518__auto__ = (knoxx.backend.domain.voice.client.synthesize_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(client,G__32982) : m__5518__auto__.call(null,client,G__32982));
} else {
throw cljs.core.missing_protocol("ITtsClient.synthesize!",client);
}
}
});
knoxx.backend.domain.voice.client.synthesize_BANG_ = (function knoxx$backend$domain$voice$client$synthesize_BANG_(client,G__32984){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$voice$client$ITtsClient$synthesize_BANG_$arity$2 == null)))))){
return client.knoxx$backend$domain$voice$client$ITtsClient$synthesize_BANG_$arity$2(client,G__32984);
} else {
return knoxx$backend$domain$voice$client$ITtsClient$synthesize_BANG_$dyn_33331(client,G__32984);
}
});


/**
 * @interface
 */
knoxx.backend.domain.voice.client.ISttClient = function(){};

var knoxx$backend$domain$voice$client$ISttClient$transcribe_BANG_$dyn_33349 = (function (client,audio_buffer,opts){
var x__5519__auto__ = (((client == null))?null:client);
var m__5520__auto__ = (knoxx.backend.domain.voice.client.transcribe_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(client,audio_buffer,opts) : m__5520__auto__.call(null,client,audio_buffer,opts));
} else {
var m__5518__auto__ = (knoxx.backend.domain.voice.client.transcribe_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(client,audio_buffer,opts) : m__5518__auto__.call(null,client,audio_buffer,opts));
} else {
throw cljs.core.missing_protocol("ISttClient.transcribe!",client);
}
}
});
knoxx.backend.domain.voice.client.transcribe_BANG_ = (function knoxx$backend$domain$voice$client$transcribe_BANG_(client,audio_buffer,opts){
if((((!((client == null)))) && ((!((client.knoxx$backend$domain$voice$client$ISttClient$transcribe_BANG_$arity$3 == null)))))){
return client.knoxx$backend$domain$voice$client$ISttClient$transcribe_BANG_$arity$3(client,audio_buffer,opts);
} else {
return knoxx$backend$domain$voice$client$ISttClient$transcribe_BANG_$dyn_33349(client,audio_buffer,opts);
}
});

knoxx.backend.domain.voice.client.trim_trailing_slashes = (function knoxx$backend$domain$voice$client$trim_trailing_slashes(s){
return clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = s;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())),/\/+$/,"");
});
knoxx.backend.domain.voice.client.blank__GT_nil = (function knoxx$backend$domain$voice$client$blank__GT_nil(v){
var s = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = v;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})())));
if(clojure.string.blank_QMARK_(s)){
return null;
} else {
return s;
}
});
knoxx.backend.domain.voice.client.config_value = (function knoxx$backend$domain$voice$client$config_value(config,keyword_key,js_key,camel_key){
var or__5162__auto__ = ((cljs.core.map_QMARK_(config))?cljs.core.get.cljs$core$IFn$_invoke$arity$2(config,keyword_key):null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.map_QMARK_(config))?null:(config[js_key]));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
if(cljs.core.map_QMARK_(config)){
return null;
} else {
return (config[camel_key]);
}
}
}
});
knoxx.backend.domain.voice.client.resolve_voice_key = (function knoxx$backend$domain$voice$client$resolve_voice_key(config){
var or__5162__auto__ = knoxx.backend.domain.voice.client.blank__GT_nil(knoxx.backend.domain.voice.client.config_value(config,new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716),"voxx-api-key","voxxApiKey"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__32998 = process;
var G__32998__$1 = (((G__32998 == null))?null:G__32998.env);
var G__32998__$2 = (((G__32998__$1 == null))?null:(G__32998__$1["VOICE_GATEWAY_API_KEY"]));
if((G__32998__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__32998__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var G__32999 = process;
var G__32999__$1 = (((G__32999 == null))?null:G__32999.env);
var G__32999__$2 = (((G__32999__$1 == null))?null:(G__32999__$1["KNOXX_VOICE_GATEWAY_API_KEY"]));
if((G__32999__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__32999__$2);
}
}
}
});
knoxx.backend.domain.voice.client.voice_gateway_url = (function knoxx$backend$domain$voice$client$voice_gateway_url(config){
var or__5162__auto__ = knoxx.backend.domain.voice.client.blank__GT_nil(knoxx.backend.domain.voice.client.config_value(config,new cljs.core.Keyword(null,"voxx-url","voxx-url",-1259052170),"voxx-url","voxxUrl"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33003 = process;
var G__33003__$1 = (((G__33003 == null))?null:G__33003.env);
var G__33003__$2 = (((G__33003__$1 == null))?null:(G__33003__$1["VOXX_URL"]));
if((G__33003__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__33003__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "http://127.0.0.1:8787";
}
}
});
knoxx.backend.domain.voice.client.tts_url = (function knoxx$backend$domain$voice$client$tts_url(config){
var base = knoxx.backend.domain.voice.client.trim_trailing_slashes(knoxx.backend.domain.voice.client.voice_gateway_url(config));
if(clojure.string.ends_with_QMARK_(base,"/v1/audio/speech")){
return base;
} else {
if(clojure.string.ends_with_QMARK_(base,"/v1")){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+"/audio/speech");
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(base)+"/v1/audio/speech");

}
}
});
knoxx.backend.domain.voice.client.default_tts_speed = (function knoxx$backend$domain$voice$client$default_tts_speed(config){
var or__5162__auto__ = knoxx.backend.domain.voice.client.blank__GT_nil(knoxx.backend.domain.voice.client.config_value(config,new cljs.core.Keyword(null,"voxx-default-speed","voxx-default-speed",-370827943),"voxx-default-speed","voxxDefaultSpeed"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__33015 = process;
var G__33015__$1 = (((G__33015 == null))?null:G__33015.env);
var G__33015__$2 = (((G__33015__$1 == null))?null:(G__33015__$1["KNOXX_VOXX_DEFAULT_SPEED"]));
if((G__33015__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__33015__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (function (){var G__33017 = process;
var G__33017__$1 = (((G__33017 == null))?null:G__33017.env);
var G__33017__$2 = (((G__33017__$1 == null))?null:(G__33017__$1["VOICE_GATEWAY_TTS_DEFAULT_SPEED"]));
if((G__33017__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__33017__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return "1.15";
}
}
}
});
knoxx.backend.domain.voice.client.stt_url = (function knoxx$backend$domain$voice$client$stt_url(config){
var or__5162__auto__ = ((cljs.core.map_QMARK_(config))?(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(config,new cljs.core.Keyword(null,"stt-url","stt-url",-2119897950));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(config,new cljs.core.Keyword(null,"stt-base-url","stt-base-url",-12292445));
}
})():null);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = ((cljs.core.map_QMARK_(config))?null:(function (){var or__5162__auto____$1 = (config["stt-url"]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (config["sttUrl"]);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (config["stt-base-url"]);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return (config["sttBaseUrl"]);
}
}
}
})());
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (function (){var G__33037 = process;
var G__33037__$1 = (((G__33037 == null))?null:G__33037.env);
var G__33037__$2 = (((G__33037__$1 == null))?null:(G__33037__$1["KNOXX_STT_URL"]));
if((G__33037__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__33037__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = (function (){var G__33041 = process;
var G__33041__$1 = (((G__33041 == null))?null:G__33041.env);
var G__33041__$2 = (((G__33041__$1 == null))?null:(G__33041__$1["KNOXX_STT_BASE_URL"]));
if((G__33041__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.client.blank__GT_nil(G__33041__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return "http://127.0.0.1:8010";
}
}
}
}
});
knoxx.backend.domain.voice.client.tts_body = (function knoxx$backend$domain$voice$client$tts_body(config,p__33049){
var map__33051 = p__33049;
var map__33051__$1 = cljs.core.__destructure_map(map__33051);
var text = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"text","text",-1790561697));
var voice_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"voice-id","voice-id",-823710186));
var model_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"model-id","model-id",-467101728));
var response_format = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"response-format","response-format",1664465322));
var speed = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"speed","speed",1257663751));
var options = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33051__$1,new cljs.core.Keyword(null,"options","options",99638489));
var map__33053 = options;
var map__33053__$1 = cljs.core.__destructure_map(map__33053);
var postprocess_profile = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33053__$1,new cljs.core.Keyword(null,"postprocess-profile","postprocess-profile",-115988175));
var postprocess_enabled = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33053__$1,new cljs.core.Keyword(null,"postprocess-enabled","postprocess-enabled",76184778));
var prompt_aware = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33053__$1,new cljs.core.Keyword(null,"prompt-aware","prompt-aware",464266766));
var prompt_aware_style = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33053__$1,new cljs.core.Keyword(null,"prompt-aware-style","prompt-aware-style",72282946));
var voice_settings = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33053__$1,new cljs.core.Keyword(null,"voice-settings","voice-settings",-504596993));
var G__33061 = new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"input","input",556931961),text,new cljs.core.Keyword(null,"voice","voice",185716428),(function (){var or__5162__auto__ = voice_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "af_jessica";
}
})(),new cljs.core.Keyword(null,"model","model",331153215),(function (){var or__5162__auto__ = model_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "kokoro";
}
})(),new cljs.core.Keyword(null,"response_format","response_format",1229973741),(function (){var or__5162__auto__ = response_format;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mp3";
}
})(),new cljs.core.Keyword(null,"speed","speed",1257663751),(function (){var or__5162__auto__ = speed;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.client.default_tts_speed(config);
}
})(),new cljs.core.Keyword(null,"postprocess_enabled","postprocess_enabled",-648946072),(((!((postprocess_enabled == null))))?postprocess_enabled:false)], null);
var G__33061__$1 = (cljs.core.truth_(postprocess_profile)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33061,new cljs.core.Keyword(null,"postprocess_profile","postprocess_profile",-1254686835),postprocess_profile):G__33061);
var G__33061__$2 = (((!((prompt_aware == null))))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33061__$1,new cljs.core.Keyword(null,"prompt_aware","prompt_aware",1309007496),prompt_aware):G__33061__$1);
var G__33061__$3 = (cljs.core.truth_(prompt_aware_style)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33061__$2,new cljs.core.Keyword(null,"prompt_aware_style","prompt_aware_style",1965441274),prompt_aware_style):G__33061__$2);
if(cljs.core.seq(voice_settings)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__33061__$3,new cljs.core.Keyword(null,"voice_settings","voice_settings",160567748),voice_settings);
} else {
return G__33061__$3;
}
});
knoxx.backend.domain.voice.client.parse_stt_json_text = (function knoxx$backend$domain$voice$client$parse_stt_json_text(raw){
var s = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw)));
if(clojure.string.includes_QMARK_(s,"data:")){
var lines = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (line){
var t = clojure.string.trim(line);
if(clojure.string.starts_with_QMARK_(t,"data:")){
return clojure.string.trim(cljs.core.subs.cljs$core$IFn$_invoke$arity$2(t,(5)));
} else {
return null;
}
}),clojure.string.split_lines(s));
var parsed_lines = cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.fetch.parse_json_object,lines);
var segments = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (j){
var txt = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(j);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"transcription","transcription",622086462).cljs$core$IFn$_invoke$arity$1(j);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
if(cljs.core.seq(txt)){
return txt;
} else {
return null;
}
}),parsed_lines);
var final_segment = cljs.core.last(parsed_lines);
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"text","text",-1790561697),clojure.string.trim(clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",segments)),new cljs.core.Keyword(null,"final","final",1157881357),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"final","final",1157881357).cljs$core$IFn$_invoke$arity$1(final_segment);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return true;
}
})()], null);
} else {
var or__5162__auto__ = knoxx.backend.extern.fetch.parse_json_object(s);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
}
});
/**
 * Detect repetitive/garbage STT output (e.g. NPU KV-cache stuck).
 */
knoxx.backend.domain.voice.client.stt_text_garbage_QMARK_ = (function knoxx$backend$domain$voice$client$stt_text_garbage_QMARK_(text){
if(cljs.core.seq(text)){
var t = clojure.string.trim(text);
var and__5160__auto__ = (((t).length) > (10));
if(and__5160__auto__){
var and__5160__auto____$1 = (function (){var chars = cljs.core.set(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__33087_SHARP_){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__33087_SHARP_," ")) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(p1__33087_SHARP_,"\n")));
}),t));
return (cljs.core.count(chars) <= (2));
})();
if(and__5160__auto____$1){
return cljs.core.not(cljs.core.re_find(/[a-zA-Z0-9]/,t));
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
} else {
return null;
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.domain.voice.client.ITtsClient}
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
knoxx.backend.domain.voice.client.FetchTtsClient = (function (config,http_client,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33101,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33118 = k33101;
var G__33118__$1 = (((G__33118 instanceof cljs.core.Keyword))?G__33118.fqn:null);
switch (G__33118__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33101,else__5472__auto__);

}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33124){
var vec__33125 = p__33124;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33125,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33125,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.voice.client.FetchTtsClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33100){
var self__ = this;
var G__33100__$1 = this;
return (new cljs.core.RecordIter((0),G__33100__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.knoxx$backend$domain$voice$client$ITtsClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.knoxx$backend$domain$voice$client$ITtsClient$synthesize_BANG_$arity$2 = (function (_,request){
var self__ = this;
var ___$1 = this;
var api_key = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.client.resolve_voice_key(self__.config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error("VOICE_GATEWAY_API_KEY not configured"));
}
})();
var body = knoxx.backend.domain.voice.client.tts_body(self__.config,request);
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.array_buffer_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),knoxx.backend.domain.voice.client.tts_url(self__.config),new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 3, ["Authorization",(""+"Bearer "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(api_key)),"Content-Type","application/json","Accept","audio/mpeg"], null),new cljs.core.Keyword(null,"json","json",1279968570),body], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(60000)], null))),(function (resp){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?Buffer.from((new Uint8Array(new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp)))):(function (){throw (new Error((""+"TTS "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp)))))})()));
}));
}));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.voice.client.FetchTtsClient(self__.config,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1414867576 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33102,other33103){
var self__ = this;
var this33102__$1 = this;
return (((!((other33103 == null)))) && ((((this33102__$1.constructor === other33103.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33102__$1.config,other33103.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33102__$1.http_client,other33103.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33102__$1.__extmap,other33103.__extmap)))))))));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.voice.client.FetchTtsClient(self__.config,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33101){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33158 = k33101;
var G__33158__$1 = (((G__33158 instanceof cljs.core.Keyword))?G__33158.fqn:null);
switch (G__33158__$1) {
case "config":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33101);

}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33100){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33161 = cljs.core.keyword_identical_QMARK_;
var expr__33162 = k__5478__auto__;
if(cljs.core.truth_((pred__33161.cljs$core$IFn$_invoke$arity$2 ? pred__33161.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__33162) : pred__33161.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__33162)))){
return (new knoxx.backend.domain.voice.client.FetchTtsClient(G__33100,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33161.cljs$core$IFn$_invoke$arity$2 ? pred__33161.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33162) : pred__33161.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33162)))){
return (new knoxx.backend.domain.voice.client.FetchTtsClient(self__.config,G__33100,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.voice.client.FetchTtsClient(self__.config,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33100),null));
}
}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33100){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.voice.client.FetchTtsClient(self__.config,self__.http_client,G__33100,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.cljs$lang$type = true);

(knoxx.backend.domain.voice.client.FetchTtsClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.voice.client/FetchTtsClient",null,(1),null));
}));

(knoxx.backend.domain.voice.client.FetchTtsClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.voice.client/FetchTtsClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.voice.client/FetchTtsClient.
 */
knoxx.backend.domain.voice.client.__GT_FetchTtsClient = (function knoxx$backend$domain$voice$client$__GT_FetchTtsClient(config,http_client){
return (new knoxx.backend.domain.voice.client.FetchTtsClient(config,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.voice.client/FetchTtsClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.voice.client.map__GT_FetchTtsClient = (function knoxx$backend$domain$voice$client$map__GT_FetchTtsClient(G__33109){
var extmap__5511__auto__ = (function (){var G__33177 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__33109,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__33109)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__33177);
} else {
return G__33177;
}
})();
return (new knoxx.backend.domain.voice.client.FetchTtsClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__33109),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33109),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {knoxx.backend.domain.voice.client.ISttClient}
 * @implements {cljs.core.ICounted}
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
knoxx.backend.domain.voice.client.FetchSttClient = (function (config,http_client,__meta,__extmap,__hash){
this.config = config;
this.http_client = http_client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k33180,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__33186 = k33180;
var G__33186__$1 = (((G__33186 instanceof cljs.core.Keyword))?G__33186.fqn:null);
switch (G__33186__$1) {
case "config":
return self__.config;

break;
case "http-client":
return self__.http_client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k33180,else__5472__auto__);

}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__33189){
var vec__33191 = p__33189;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33191,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__33191,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.voice.client.FetchSttClient{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__33179){
var self__ = this;
var G__33179__$1 = this;
return (new cljs.core.RecordIter((0),G__33179__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.knoxx$backend$domain$voice$client$ISttClient$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.knoxx$backend$domain$voice$client$ISttClient$transcribe_BANG_$arity$3 = (function (_,audio_buffer,_opts){
var self__ = this;
var ___$1 = this;
var url = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.voice.client.trim_trailing_slashes(knoxx.backend.domain.voice.client.stt_url(self__.config)))+"/transcribe");
console.log("[voice:stt] === TRANSCRIBE START ===",audio_buffer.length,"bytes from",knoxx.backend.domain.voice.client.stt_url(self__.config));

console.log("[voice:stt] sending POST to",url);

return promesa.core.catch$.cljs$core$IFn$_invoke$arity$2(promesa.protocols._mcat(promesa.protocols._promise(null),(function (___28476__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.extern.fetch.text_BANG_((function (){var or__5162__auto__ = self__.http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})(),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"url","url",276297046),url,new cljs.core.Keyword(null,"opts","opts",155075701),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"method","method",55703592),"POST",new cljs.core.Keyword(null,"headers","headers",-835030129),new cljs.core.PersistentArrayMap(null, 2, ["Content-Type","audio/wav","Accept","application/json, text/plain, text/event-stream"], null),new cljs.core.Keyword(null,"body","body",-2049205669),audio_buffer], null),new cljs.core.Keyword(null,"timeout-ms","timeout-ms",754221406),(60000)], null))),(function (resp){
return promesa.protocols._mcat(promesa.protocols._promise(console.log("[voice:stt] response received, status:",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp),"ok:",new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))),(function (___28440__auto__){
return promesa.protocols._promise((cljs.core.truth_(new cljs.core.Keyword(null,"ok","ok",967785236).cljs$core$IFn$_invoke$arity$1(resp))?(function (){var raw = new cljs.core.Keyword(null,"body","body",-2049205669).cljs$core$IFn$_invoke$arity$1(resp);
var ___$2 = console.log("[voice:stt] raw body prefix:",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(raw)).slice((0),(80)));
var j = knoxx.backend.domain.voice.client.parse_stt_json_text(raw);
var ___$3 = console.log("[voice:stt] JSON parsed:",cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([j], 0)));
var text = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"text","text",-1790561697).cljs$core$IFn$_invoke$arity$1(j);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"transcription","transcription",622086462).cljs$core$IFn$_invoke$arity$1(j);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})();
if(cljs.core.truth_(knoxx.backend.domain.voice.client.stt_text_garbage_QMARK_(text))){
console.warn("[voice:stt] GARBAGE detected, discarding:",text.slice((0),(60)));

return "";
} else {
console.log("[voice:stt] extracted text:",((clojure.string.blank_QMARK_(text))?"[EMPTY]":text));

return text;
}
})():(function (){
console.error("[voice:stt] HTTP FAILED:",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp));

throw (new Error((""+"STT "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(resp)))));
})()
));
}));
}));
})),(function (err){
console.error("[voice:stt] === TRANSCRIBE ERROR ===",err.message);

throw err;
}));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.voice.client.FetchSttClient(self__.config,self__.http_client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1114222114 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this33181,other33182){
var self__ = this;
var this33181__$1 = this;
return (((!((other33182 == null)))) && ((((this33181__$1.constructor === other33182.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33181__$1.config,other33182.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33181__$1.http_client,other33182.http_client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this33181__$1.__extmap,other33182.__extmap)))))))));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"http-client","http-client",-1812758074),null,new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.voice.client.FetchSttClient(self__.config,self__.http_client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k33180){
var self__ = this;
var this__5476__auto____$1 = this;
var G__33237 = k33180;
var G__33237__$1 = (((G__33237 instanceof cljs.core.Keyword))?G__33237.fqn:null);
switch (G__33237__$1) {
case "config":
case "http-client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k33180);

}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__33179){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__33244 = cljs.core.keyword_identical_QMARK_;
var expr__33245 = k__5478__auto__;
if(cljs.core.truth_((pred__33244.cljs$core$IFn$_invoke$arity$2 ? pred__33244.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__33245) : pred__33244.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__33245)))){
return (new knoxx.backend.domain.voice.client.FetchSttClient(G__33179,self__.http_client,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__33244.cljs$core$IFn$_invoke$arity$2 ? pred__33244.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33245) : pred__33244.call(null,new cljs.core.Keyword(null,"http-client","http-client",-1812758074),expr__33245)))){
return (new knoxx.backend.domain.voice.client.FetchSttClient(self__.config,G__33179,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.voice.client.FetchSttClient(self__.config,self__.http_client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__33179),null));
}
}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"http-client","http-client",-1812758074),self__.http_client,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__33179){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.voice.client.FetchSttClient(self__.config,self__.http_client,G__33179,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.voice.client.FetchSttClient.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"http-client","http-client",-172226547,null)], null);
}));

(knoxx.backend.domain.voice.client.FetchSttClient.cljs$lang$type = true);

(knoxx.backend.domain.voice.client.FetchSttClient.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.voice.client/FetchSttClient",null,(1),null));
}));

(knoxx.backend.domain.voice.client.FetchSttClient.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.voice.client/FetchSttClient");
}));

/**
 * Positional factory function for knoxx.backend.domain.voice.client/FetchSttClient.
 */
knoxx.backend.domain.voice.client.__GT_FetchSttClient = (function knoxx$backend$domain$voice$client$__GT_FetchSttClient(config,http_client){
return (new knoxx.backend.domain.voice.client.FetchSttClient(config,http_client,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.voice.client/FetchSttClient, taking a map of keywords to field values.
 */
knoxx.backend.domain.voice.client.map__GT_FetchSttClient = (function knoxx$backend$domain$voice$client$map__GT_FetchSttClient(G__33184){
var extmap__5511__auto__ = (function (){var G__33259 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__33184,new cljs.core.Keyword(null,"config","config",994861415),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"http-client","http-client",-1812758074)], 0));
if(cljs.core.record_QMARK_(G__33184)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__33259);
} else {
return G__33259;
}
})();
return (new knoxx.backend.domain.voice.client.FetchSttClient(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__33184),new cljs.core.Keyword(null,"http-client","http-client",-1812758074).cljs$core$IFn$_invoke$arity$1(G__33184),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.voice.client.tts_client = (function knoxx$backend$domain$voice$client$tts_client(var_args){
var G__33263 = arguments.length;
switch (G__33263) {
case 1:
return knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__33270){
var map__33271 = p__33270;
var map__33271__$1 = cljs.core.__destructure_map(map__33271);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33271__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.voice.client.__GT_FetchTtsClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.voice.client.tts_client.cljs$lang$maxFixedArity = 2);

knoxx.backend.domain.voice.client.stt_client = (function knoxx$backend$domain$voice$client$stt_client(var_args){
var G__33278 = arguments.length;
switch (G__33278) {
case 1:
return knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$1 = (function (config){
return knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$2(config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.domain.voice.client.stt_client.cljs$core$IFn$_invoke$arity$2 = (function (config,p__33305){
var map__33307 = p__33305;
var map__33307__$1 = cljs.core.__destructure_map(map__33307);
var http_client = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__33307__$1,new cljs.core.Keyword(null,"http-client","http-client",-1812758074));
return knoxx.backend.domain.voice.client.__GT_FetchSttClient(config,(function (){var or__5162__auto__ = http_client;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.extern.fetch.default_client;
}
})());
}));

(knoxx.backend.domain.voice.client.stt_client.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.domain.voice.client.js.map
