import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./promesa.core.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.text.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
import "./knoxx.backend.domain.media.js";
import "./knoxx.backend.domain.openutau.tools.js";
import "./knoxx.backend.domain.tools.js";
import "./knoxx.backend.domain.voice.client.js";
import "./knoxx.backend.infra.document_state.js";
goog.provide('knoxx.backend.domain.voice.tools');
knoxx.backend.domain.voice.tools.blank__GT_nil = (function knoxx$backend$domain$voice$tools$blank__GT_nil(v){
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
knoxx.backend.domain.voice.tools.config_value = (function knoxx$backend$domain$voice$tools$config_value(config,keyword_key,js_key,camel_key){
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
knoxx.backend.domain.voice.tools.false_like_QMARK_ = (function knoxx$backend$domain$voice$tools$false_like_QMARK_(v){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(false,v)) || (cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, ["off",null,"false",null,"0",null,"no",null], null), null),clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)))))));
});
knoxx.backend.domain.voice.tools.bool_value = (function knoxx$backend$domain$voice$tools$bool_value(v,default$){
if((v == null)){
return default$;
} else {
return (!(knoxx.backend.domain.voice.tools.false_like_QMARK_(v)));
}
});
knoxx.backend.domain.voice.tools.config_bool_value = (function knoxx$backend$domain$voice$tools$config_bool_value(config,keyword_key,js_key,camel_key,default$){
var v = ((cljs.core.map_QMARK_(config))?cljs.core.get.cljs$core$IFn$_invoke$arity$3(config,keyword_key,new cljs.core.Keyword("knoxx.backend.domain.voice.tools","missing","knoxx.backend.domain.voice.tools/missing",500536522)):(function (){var kebab = (config[js_key]);
var camel = (config[camel_key]);
if((!((kebab == null)))){
return kebab;
} else {
if((!((camel == null)))){
return camel;
} else {
return new cljs.core.Keyword("knoxx.backend.domain.voice.tools","missing","knoxx.backend.domain.voice.tools/missing",500536522);

}
}
})());
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword("knoxx.backend.domain.voice.tools","missing","knoxx.backend.domain.voice.tools/missing",500536522),v)){
return default$;
} else {
return knoxx.backend.domain.voice.tools.bool_value(v,default$);
}
});
knoxx.backend.domain.voice.tools.default_tts_speed = (function knoxx$backend$domain$voice$tools$default_tts_speed(config){
var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-default-speed","voxx-default-speed",-370827943),"voxx-default-speed","voxxDefaultSpeed"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__27938 = process;
var G__27938__$1 = (((G__27938 == null))?null:G__27938.env);
var G__27938__$2 = (((G__27938__$1 == null))?null:(G__27938__$1["KNOXX_VOXX_DEFAULT_SPEED"]));
if((G__27938__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(G__27938__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = (function (){var G__27940 = process;
var G__27940__$1 = (((G__27940 == null))?null:G__27940.env);
var G__27940__$2 = (((G__27940__$1 == null))?null:(G__27940__$1["VOICE_GATEWAY_TTS_DEFAULT_SPEED"]));
if((G__27940__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(G__27940__$2);
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
knoxx.backend.domain.voice.tools.resolve_voice_key = (function knoxx$backend$domain$voice$tools$resolve_voice_key(config){
var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-api-key","voxx-api-key",2053708716),"voxx-api-key","voxxApiKey"));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__27944 = process;
var G__27944__$1 = (((G__27944 == null))?null:G__27944.env);
var G__27944__$2 = (((G__27944__$1 == null))?null:(G__27944__$1["VOICE_GATEWAY_API_KEY"]));
if((G__27944__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(G__27944__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var G__27946 = process;
var G__27946__$1 = (((G__27946 == null))?null:G__27946.env);
var G__27946__$2 = (((G__27946__$1 == null))?null:(G__27946__$1["KNOXX_VOICE_GATEWAY_API_KEY"]));
if((G__27946__$2 == null)){
return null;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(G__27946__$2);
}
}
}
});
knoxx.backend.domain.voice.tools.voice_settings_payload = (function knoxx$backend$domain$voice$tools$voice_settings_payload(params){
var G__27949 = cljs.core.PersistentArrayMap.EMPTY;
var G__27949__$1 = (cljs.core.truth_((params["stability"]))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27949,new cljs.core.Keyword(null,"stability","stability",1733225509),(params["stability"])):G__27949);
if(cljs.core.truth_((params["similarity_boost"]))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27949__$1,new cljs.core.Keyword(null,"similarity_boost","similarity_boost",866821960),(params["similarity_boost"]));
} else {
return G__27949__$1;
}
});
/**
 * Generate a default output path in Voice/ when none is provided.
 */
knoxx.backend.domain.voice.tools.tts_default_output_path = (function knoxx$backend$domain$voice$tools$tts_default_output_path(){
var ts = (new Date()).toISOString();
var safe_ts = clojure.string.replace(ts,/[:.]/,"-");
return (""+"Voice/tts-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(safe_ts)+".mp3");
});
knoxx.backend.domain.voice.tools.tts_rest_params = new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Plain text. Strip markdown first."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Workspace-relative output path. Defaults to Voice/tts-<timestamp>.mp3. Use Voice/ for spoken output, Audio/ for clips and effects, Music/ for musical content."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"voice_id","voice_id",-725801774),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx/Kokoro voice ID. Default: af_jessica."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model_id","model_id",-2010580717),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx backend hint/model. Default: kokoro. Voxx may fall back by VOICE_GATEWAY_TTS_BACKEND_ORDER: xiaomi_mimo, kokoro; eSpeak is opt-in only."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_format","output_format",1390326421),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Audio format. Default mp3."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"speed","speed",1257663751),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Speech speed multiplier. Default 1.15 for the af_jessica workspace voice."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),0.25,new cljs.core.Keyword(null,"max","max",61366548),4.0], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"postprocess_profile","postprocess_profile",-1254686835),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Final Voxx mastering profile. Default sports-commentator-v1. Aliases: sports/commentator, broadcast/warm, narrator/polish, radio/crisp, soft/studio; off/none disables."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"postprocess_enabled","postprocess_enabled",-648946072),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Enable final Voxx postprocess. Default true; set false for dry capture."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt_aware","prompt_aware",1309007496),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Prompt-aware performance mode. Default true. Voxx consumes tags like [excited], [whisper], [pause], [dramatic], [laugh], and <break time=\"500ms\" /> as segment-level postprocessing directions, not spoken words."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt_aware_style","prompt_aware_style",1965441274),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional custom instruction for how Voxx should interpret performance tags."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"stability","stability",1733225509),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Stability 0-1 for compatible providers."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(1)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"similarity_boost","similarity_boost",866821960),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Similarity boost 0-1 for compatible providers."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),(0),new cljs.core.Keyword(null,"max","max",61366548),(1)], null)], null)], null)], null);
knoxx.backend.domain.voice.tools.synthesize_tts_audio_BANG_ = (function knoxx$backend$domain$voice$tools$synthesize_tts_audio_BANG_(config,text,voice_id,model_id,output_format,params,options){
return knoxx.backend.domain.voice.client.synthesize_BANG_(knoxx.backend.domain.voice.client.tts_client.cljs$core$IFn$_invoke$arity$1(config),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"text","text",-1790561697),text,new cljs.core.Keyword(null,"voice-id","voice-id",-823710186),voice_id,new cljs.core.Keyword(null,"model-id","model-id",-467101728),model_id,new cljs.core.Keyword(null,"response-format","response-format",1664465322),output_format,new cljs.core.Keyword(null,"speed","speed",1257663751),new cljs.core.Keyword(null,"speed","speed",1257663751).cljs$core$IFn$_invoke$arity$1(options),new cljs.core.Keyword(null,"options","options",99638489),cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(options,new cljs.core.Keyword(null,"voice-settings","voice-settings",-504596993),knoxx.backend.domain.voice.tools.voice_settings_payload(params))], null));
});
knoxx.backend.domain.voice.tools.write_audio_file_BANG_ = (function knoxx$backend$domain$voice$tools$write_audio_file_BANG_(node_path,buf,absolute,relative,voice_id,model_id,fmt){
return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20900__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.mkdir(node_path.dirname(absolute),({"recursive": true}))),(function (___20890__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.writeFile(absolute,buf)),(function (___20890__auto____$1){
return promesa.protocols._promise(knoxx.backend.domain.text.tool_text_result((""+"Wrote "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" ("+cljs.core.str.cljs$core$IFn$_invoke$arity$1(buf.length)+" bytes). Use workspace_media.attach to embed."),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"path","path",-188191168),relative,new cljs.core.Keyword(null,"bytes","bytes",1175866680),buf.length,new cljs.core.Keyword(null,"voice_id","voice_id",-725801774),voice_id,new cljs.core.Keyword(null,"model_id","model_id",-2010580717),model_id,new cljs.core.Keyword(null,"format","format",-1306924766),fmt], null)));
}));
}));
}));
});
knoxx.backend.domain.voice.tools.tts_rest_execute = (function knoxx$backend$domain$voice$tools$tts_rest_execute(runtime,config){
return (function() { 
var G__28384__delegate = function (_call_id,params,on_update,_){
var text = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["text"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error("voice.tts: text required"));
}
})();
var voice_id = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["voice_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-voice-id","voxx-voice-id",-652120125),"voxx-voice-id","voxxVoiceId"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "af_jessica";
}
}
})();
var model_id = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["model_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-model-id","voxx-model-id",2106305693),"voxx-model-id","voxxModelId"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "kokoro";
}
}
})();
var speed = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["speed"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.tools.default_tts_speed(config);
}
})();
var out_fmt = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["output_format"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mp3";
}
})();
var postprocess_profile = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["postprocess_profile"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-postprocess-profile","voxx-postprocess-profile",-1094633966),"voxx-postprocess-profile","voxxPostprocessProfile"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "sports-commentator-v1";
}
}
})();
var postprocess_enabled = (((!(((params["postprocess_enabled"]) == null))))?knoxx.backend.domain.voice.tools.bool_value((params["postprocess_enabled"]),true):knoxx.backend.domain.voice.tools.config_bool_value(config,new cljs.core.Keyword(null,"voxx-postprocess-enabled","voxx-postprocess-enabled",-1494110237),"voxx-postprocess-enabled","voxxPostprocessEnabled",true));
var prompt_aware = (((!(((params["prompt_aware"]) == null))))?knoxx.backend.domain.voice.tools.bool_value((params["prompt_aware"]),true):knoxx.backend.domain.voice.tools.config_bool_value(config,new cljs.core.Keyword(null,"voxx-prompt-aware","voxx-prompt-aware",-648801777),"voxx-prompt-aware","voxxPromptAware",true));
var prompt_aware_style = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["prompt_aware_style"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-prompt-aware-style","voxx-prompt-aware-style",-1200845338),"voxx-prompt-aware-style","voxxPromptAwareStyle"));
}
})();
var out_path = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["output_path"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.tools.tts_default_output_path();
}
})();
var map__27962 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,out_path);
var map__27962__$1 = cljs.core.__destructure_map(map__27962);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27962__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27962__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var options = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"speed","speed",1257663751),speed,new cljs.core.Keyword(null,"postprocess-profile","postprocess-profile",-115988175),postprocess_profile,new cljs.core.Keyword(null,"postprocess-enabled","postprocess-enabled",76184778),postprocess_enabled,new cljs.core.Keyword(null,"prompt-aware","prompt-aware",464266766),prompt_aware,new cljs.core.Keyword(null,"prompt-aware-style","prompt-aware-style",72282946),prompt_aware_style], null);
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"TTS: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((text).length))+" chars -> "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" via "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(model_id)+", voice="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(voice_id)+", speed="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(speed)+", postprocess="+cljs.core.str.cljs$core$IFn$_invoke$arity$1((cljs.core.truth_(postprocess_enabled)?postprocess_profile:"off"))+", prompt-aware="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prompt_aware)+"..."));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20922__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(knoxx.backend.domain.voice.tools.synthesize_tts_audio_BANG_(config,text,voice_id,model_id,out_fmt,params,options)),(function (buf){
return promesa.protocols._promise(knoxx.backend.domain.voice.tools.write_audio_file_BANG_(shadow.esm.esm_import$node_path,buf,absolute,relative,voice_id,model_id,out_fmt));
}));
}));
};
var G__28384 = function (_call_id,params,on_update,var_args){
var _ = null;
if (arguments.length > 3) {
var G__28409__i = 0, G__28409__a = new Array(arguments.length -  3);
while (G__28409__i < G__28409__a.length) {G__28409__a[G__28409__i] = arguments[G__28409__i + 3]; ++G__28409__i;}
  _ = new cljs.core.IndexedSeq(G__28409__a,0,null);
} 
return G__28384__delegate.call(this,_call_id,params,on_update,_);};
G__28384.cljs$lang$maxFixedArity = 3;
G__28384.cljs$lang$applyTo = (function (arglist__28414){
var _call_id = cljs.core.first(arglist__28414);
arglist__28414 = cljs.core.next(arglist__28414);
var params = cljs.core.first(arglist__28414);
arglist__28414 = cljs.core.next(arglist__28414);
var on_update = cljs.core.first(arglist__28414);
var _ = cljs.core.rest(arglist__28414);
return G__28384__delegate(_call_id,params,on_update,_);
});
G__28384.cljs$core$IFn$_invoke$arity$variadic = G__28384__delegate;
return G__28384;
})()
;
});
knoxx.backend.domain.voice.tools.tts_stream_params = new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Text to synthesize via /ws/voice/tts."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"voice_id","voice_id",-725801774),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx/Kokoro voice ID. Default: af_jessica."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model_id","model_id",-2010580717),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voxx backend hint/model. Default: kokoro; fallback order is controlled by Voxx. eSpeak is opt-in only in the workspace default."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_format","output_format",1390326421),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Format. Default: mp3."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"speed","speed",1257663751),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Speech speed multiplier. Default 1.15."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"double","double",884886883),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"min","min",444991522),0.25,new cljs.core.Keyword(null,"max","max",61366548),4.0], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"postprocess_profile","postprocess_profile",-1254686835),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Final Voxx mastering profile. Default sports-commentator-v1. Aliases: sports, broadcast, narrator, radio, soft; off disables."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"postprocess_enabled","postprocess_enabled",-648946072),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Enable final Voxx postprocess. Default true."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt_aware","prompt_aware",1309007496),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Prompt-aware tag mode. Default true; Voxx consumes tags as segment-level postprocessing directions."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"prompt_aware_style","prompt_aware_style",1965441274),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Optional custom instruction for tag interpretation."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auto_mode","auto_mode",-1224005487),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"auto_mode. Default true."], null),new cljs.core.Keyword(null,"boolean","boolean",-1919418404)], null)], null);
knoxx.backend.domain.voice.tools.openutau_project_params = new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"project_name","project_name",-1535411620),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Project name."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"notes","notes",-1039600523),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Ordered note plan."], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.PersistentVector(null, 6, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"lyric","lyric",164436415),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Lyric. Use + or +~ for slurs."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"phonetic_hint","phonetic_hint",1425882362),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Phonetic hint without brackets."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tone","tone",-1422788785),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"MIDI note number. C4 = 60."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"duration","duration",1444101068),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Duration in ticks. 480 = 1 quarter note."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"position","position",-2011731912),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Start tick. Sequential if omitted."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tempo","tempo",-1555208453),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"BPM. Default 120."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"beat_per_bar","beat_per_bar",-752938484),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Numerator."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"beat_unit","beat_unit",1360431781),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Denominator."], null),new cljs.core.Keyword(null,"int","int",-1741416922)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"singer_id","singer_id",1456162645),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Singer ID. Options: teto (Kasane Teto JA), ritsu (Namine Ritsu JA), teto-en (Kasane Teto EN). Default: teto."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Phonemizer class. Usually auto-selected by singer."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"track_name","track_name",1331132230),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Vocal track name."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"part_name","part_name",-334556537),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Voice part name."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Output .ustx path."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"comment","comment",532206069),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Project comment."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.voice.tools.tts_stream_execute = (function knoxx$backend$domain$voice$tools$tts_stream_execute(config){
return (function() { 
var G__28429__delegate = function (_call_id,params,on_update,_){
var voice_id = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["voice_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-voice-id","voxx-voice-id",-652120125),"voxx-voice-id","voxxVoiceId"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "af_jessica";
}
}
})();
var model_id = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["model_id"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-model-id","voxx-model-id",2106305693),"voxx-model-id","voxxModelId"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "kokoro";
}
}
})();
var speed = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["speed"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.tools.default_tts_speed(config);
}
})();
var out_fmt = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["output_format"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "mp3";
}
})();
var postprocess_profile = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["postprocess_profile"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-postprocess-profile","voxx-postprocess-profile",-1094633966),"voxx-postprocess-profile","voxxPostprocessProfile"));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "sports-commentator-v1";
}
}
})();
var postprocess_enabled = (((!(((params["postprocess_enabled"]) == null))))?knoxx.backend.domain.voice.tools.bool_value((params["postprocess_enabled"]),true):knoxx.backend.domain.voice.tools.config_bool_value(config,new cljs.core.Keyword(null,"voxx-postprocess-enabled","voxx-postprocess-enabled",-1494110237),"voxx-postprocess-enabled","voxxPostprocessEnabled",true));
var prompt_aware = (((!(((params["prompt_aware"]) == null))))?knoxx.backend.domain.voice.tools.bool_value((params["prompt_aware"]),true):knoxx.backend.domain.voice.tools.config_bool_value(config,new cljs.core.Keyword(null,"voxx-prompt-aware","voxx-prompt-aware",-648801777),"voxx-prompt-aware","voxxPromptAware",true));
var prompt_aware_style = (function (){var or__5162__auto__ = knoxx.backend.domain.voice.tools.blank__GT_nil((params["prompt_aware_style"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.voice.tools.blank__GT_nil(knoxx.backend.domain.voice.tools.config_value(config,new cljs.core.Keyword(null,"voxx-prompt-aware-style","voxx-prompt-aware-style",-1200845338),"voxx-prompt-aware-style","voxxPromptAwareStyle"));
}
})();
var auto_mode = cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(false,(params["auto_mode"]));
var key_ok_QMARK_ = cljs.core.boolean$(knoxx.backend.domain.voice.tools.resolve_voice_key(config));
knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,"voice.tts_stream: returning WS params...");

return promesa.core.resolved(knoxx.backend.domain.text.tool_text_result((function (){var G__27997 = "Connect to /ws/voice/tts. Send {type:start,...}, then {type:text,text:...} chunks, then {type:flush}. Include postprocess_profile/postprocess_enabled/prompt_aware in the start message or query. Receive {type:audio,audio:<base64>} chunks.";
if((!(key_ok_QMARK_))){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27997)+" WARNING: VOICE_GATEWAY_API_KEY is not configured.");
} else {
return G__27997;
}
})(),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"speed","speed",1257663751),new cljs.core.Keyword(null,"postprocess_enabled","postprocess_enabled",-648946072),new cljs.core.Keyword(null,"prompt_aware","prompt_aware",1309007496),new cljs.core.Keyword(null,"postprocess_profile","postprocess_profile",-1254686835),new cljs.core.Keyword(null,"auto-mode","auto-mode",-692726543),new cljs.core.Keyword(null,"voice_id","voice_id",-725801774),new cljs.core.Keyword(null,"model_id","model_id",-2010580717),new cljs.core.Keyword(null,"output_format","output_format",1390326421),new cljs.core.Keyword(null,"prompt_aware_style","prompt_aware_style",1965441274),new cljs.core.Keyword(null,"api_key_configured","api_key_configured",437685374),new cljs.core.Keyword(null,"ws_endpoint","ws_endpoint",-365315745)],[speed,postprocess_enabled,prompt_aware,(cljs.core.truth_(postprocess_enabled)?postprocess_profile:"none"),auto_mode,voice_id,model_id,out_fmt,prompt_aware_style,key_ok_QMARK_,"/ws/voice/tts"])));
};
var G__28429 = function (_call_id,params,on_update,var_args){
var _ = null;
if (arguments.length > 3) {
var G__28438__i = 0, G__28438__a = new Array(arguments.length -  3);
while (G__28438__i < G__28438__a.length) {G__28438__a[G__28438__i] = arguments[G__28438__i + 3]; ++G__28438__i;}
  _ = new cljs.core.IndexedSeq(G__28438__a,0,null);
} 
return G__28429__delegate.call(this,_call_id,params,on_update,_);};
G__28429.cljs$lang$maxFixedArity = 3;
G__28429.cljs$lang$applyTo = (function (arglist__28439){
var _call_id = cljs.core.first(arglist__28439);
arglist__28439 = cljs.core.next(arglist__28439);
var params = cljs.core.first(arglist__28439);
arglist__28439 = cljs.core.next(arglist__28439);
var on_update = cljs.core.first(arglist__28439);
var _ = cljs.core.rest(arglist__28439);
return G__28429__delegate(_call_id,params,on_update,_);
});
G__28429.cljs$core$IFn$_invoke$arity$variadic = G__28429__delegate;
return G__28429;
})()
;
});
knoxx.backend.domain.voice.tools.openutau_project_execute = (function knoxx$backend$domain$voice$tools$openutau_project_execute(var_args){
var args__5903__auto__ = [];
var len__5897__auto___28440 = arguments.length;
var i__5898__auto___28441 = (0);
while(true){
if((i__5898__auto___28441 < len__5897__auto___28440)){
args__5903__auto__.push((arguments[i__5898__auto___28441]));

var G__28446 = (i__5898__auto___28441 + (1));
i__5898__auto___28441 = G__28446;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((5) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((5)),(0),null)):null);
return knoxx.backend.domain.voice.tools.openutau_project_execute.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]),argseq__5904__auto__);
});

(knoxx.backend.domain.voice.tools.openutau_project_execute.cljs$core$IFn$_invoke$arity$variadic = (function (runtime,config,_call_id,params,on_update,_){
var project_name = (function (){var or__5162__auto__ = knoxx.backend.domain.media.normalize_tool_path_arg((params["project_name"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "Knoxx OpenUtau Project";
}
})();
var out_path = (function (){var or__5162__auto__ = knoxx.backend.domain.media.normalize_tool_path_arg((params["output_path"]));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (knoxx.backend.domain.openutau.tools.default_project_relative_path.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.tools.default_project_relative_path.cljs$core$IFn$_invoke$arity$1(project_name) : knoxx.backend.domain.openutau.tools.default_project_relative_path.call(null,project_name));
}
})();
var map__28025 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,out_path);
var map__28025__$1 = cljs.core.__destructure_map(map__28025);
var workspace_root = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28025__$1,new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547));
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28025__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
var relative = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28025__$1,new cljs.core.Keyword(null,"relative","relative",22796862));
var output_dir = shadow.esm.esm_import$node_path.dirname(absolute);
var filename = knoxx.backend.domain.media.path_basename(shadow.esm.esm_import$node_path,absolute);
var readme_abs = shadow.esm.esm_import$node_path.join(output_dir,"README.md");
var readme_rel = knoxx.backend.infra.document_state.normalize_relative_path(knoxx.backend.domain.media.path_relative(shadow.esm.esm_import$node_path,workspace_root,readme_abs));
var notes = (function (){var G__28027 = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (params["notes"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return [];
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
return (knoxx.backend.domain.openutau.tools.normalize_notes.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.tools.normalize_notes.cljs$core$IFn$_invoke$arity$1(G__28027) : knoxx.backend.domain.openutau.tools.normalize_notes.call(null,G__28027));
})();
var project = (function (){var G__28032 = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"project_name","project_name",-1535411620),(params["project_name"]),new cljs.core.Keyword(null,"tempo","tempo",-1555208453),(params["tempo"]),new cljs.core.Keyword(null,"time_signature","time_signature",-98519217),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = (params["time_signature"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"singer_id","singer_id",1456162645),(params["singer_id"]),new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),(params["phonemizer"]),new cljs.core.Keyword(null,"track_name","track_name",1331132230),(params["track_name"]),new cljs.core.Keyword(null,"part_name","part_name",-334556537),(params["part_name"]),new cljs.core.Keyword(null,"comment","comment",532206069),(params["comment"])], null);
var G__28033 = notes;
return (knoxx.backend.domain.openutau.tools.build_project.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.openutau.tools.build_project.cljs$core$IFn$_invoke$arity$2(G__28032,G__28033) : knoxx.backend.domain.openutau.tools.build_project.call(null,G__28032,G__28033));
})();
var ustx_yaml = (knoxx.backend.domain.openutau.tools.project__GT_ustx_yaml.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.tools.project__GT_ustx_yaml.cljs$core$IFn$_invoke$arity$1(project) : knoxx.backend.domain.openutau.tools.project__GT_ustx_yaml.call(null,project));
var readme_text = (function (){var G__28035 = new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"project-name","project-name",1486861539),project_name,new cljs.core.Keyword(null,"ustx-path","ustx-path",242803323),relative,new cljs.core.Keyword(null,"readme-path","readme-path",205242972),readme_rel,new cljs.core.Keyword(null,"note-count","note-count",-2010784834),cljs.core.count(notes),new cljs.core.Keyword(null,"tempo","tempo",-1555208453),(function (){var or__5162__auto__ = (params["tempo"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (120);
}
})(),new cljs.core.Keyword(null,"singer-id","singer-id",705189264),(function (){var or__5162__auto__ = (params["singer_id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})(),new cljs.core.Keyword(null,"phonemizer","phonemizer",-1364007211),(function (){var or__5162__auto__ = (params["phonemizer"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()], null);
return (knoxx.backend.domain.openutau.tools.readme_markdown.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.openutau.tools.readme_markdown.cljs$core$IFn$_invoke$arity$1(G__28035) : knoxx.backend.domain.openutau.tools.readme_markdown.call(null,G__28035));
})();
var data_url = (""+"data:text/yaml;base64,"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Buffer.from(ustx_yaml,"utf8").toString("base64")));
if(cljs.core.seq(notes)){
} else {
throw (new Error("notes must contain at least one note"));
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Writing OpenUtau project "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+"..."));

return promesa.protocols._mcat(promesa.protocols._promise(null),(function (___20900__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.mkdir(output_dir,({"recursive": true}))),(function (___20890__auto__){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.writeFile(absolute,ustx_yaml,"utf8")),(function (___20890__auto____$1){
return promesa.protocols._mcat(promesa.protocols._promise(shadow.esm.esm_import$node_fs$promises.writeFile(readme_abs,readme_text,"utf8")),(function (___20890__auto____$2){
return promesa.protocols._promise(knoxx.backend.domain.text.tool_text_result((""+"Created OpenUtau project at "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(relative)+" with "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.count(notes))+" notes."),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"path","path",-188191168),relative,new cljs.core.Keyword(null,"readme_path","readme_path",501154428),readme_rel,new cljs.core.Keyword(null,"project_name","project_name",-1535411620),project_name,new cljs.core.Keyword(null,"note_count","note_count",693479986),cljs.core.count(notes),new cljs.core.Keyword(null,"tempo","tempo",-1555208453),(function (){var or__5162__auto__ = (params["tempo"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (120);
}
})(),new cljs.core.Keyword(null,"renderer","renderer",336841071),knoxx.backend.domain.openutau.tools.default_renderer,new cljs.core.Keyword(null,"headless_render_supported","headless_render_supported",1252467375),true,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"document",new cljs.core.Keyword(null,"data","data",-232669377),data_url,new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),"text/yaml",new cljs.core.Keyword(null,"filename","filename",-1428840783),filename], null)], null)], null)));
}));
}));
}));
}));
}));

(knoxx.backend.domain.voice.tools.openutau_project_execute.cljs$lang$maxFixedArity = (5));

/** @this {Function} */
(knoxx.backend.domain.voice.tools.openutau_project_execute.cljs$lang$applyTo = (function (seq28000){
var G__28001 = cljs.core.first(seq28000);
var seq28000__$1 = cljs.core.next(seq28000);
var G__28002 = cljs.core.first(seq28000__$1);
var seq28000__$2 = cljs.core.next(seq28000__$1);
var G__28003 = cljs.core.first(seq28000__$2);
var seq28000__$3 = cljs.core.next(seq28000__$2);
var G__28004 = cljs.core.first(seq28000__$3);
var seq28000__$4 = cljs.core.next(seq28000__$3);
var G__28005 = cljs.core.first(seq28000__$4);
var seq28000__$5 = cljs.core.next(seq28000__$4);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28001,G__28002,G__28003,G__28004,G__28005,seq28000__$5);
}));

knoxx.backend.domain.voice.tools.voice_openutau_project_execute = (function knoxx$backend$domain$voice$tools$voice_openutau_project_execute(runtime,config,call_id,params,a,b,c){
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
return knoxx.backend.domain.voice.tools.openutau_project_execute(runtime,config,call_id,params,on_update);
});
knoxx.backend.domain.voice.tools.voice_tts_execute = (function knoxx$backend$domain$voice$tools$voice_tts_execute(var_args){
var args__5903__auto__ = [];
var len__5897__auto___28474 = arguments.length;
var i__5898__auto___28475 = (0);
while(true){
if((i__5898__auto___28475 < len__5897__auto___28474)){
args__5903__auto__.push((arguments[i__5898__auto___28475]));

var G__28479 = (i__5898__auto___28475 + (1));
i__5898__auto___28475 = G__28479;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.domain.voice.tools.voice_tts_execute.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.domain.voice.tools.voice_tts_execute.cljs$core$IFn$_invoke$arity$variadic = (function (runtime,config,args){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.voice.tools.tts_rest_execute(runtime,config),args);
}));

(knoxx.backend.domain.voice.tools.voice_tts_execute.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.domain.voice.tools.voice_tts_execute.cljs$lang$applyTo = (function (seq28072){
var G__28073 = cljs.core.first(seq28072);
var seq28072__$1 = cljs.core.next(seq28072);
var G__28074 = cljs.core.first(seq28072__$1);
var seq28072__$2 = cljs.core.next(seq28072__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28073,G__28074,seq28072__$2);
}));

knoxx.backend.domain.voice.tools.voice_tts_stream_execute = (function knoxx$backend$domain$voice$tools$voice_tts_stream_execute(var_args){
var args__5903__auto__ = [];
var len__5897__auto___28485 = arguments.length;
var i__5898__auto___28486 = (0);
while(true){
if((i__5898__auto___28486 < len__5897__auto___28485)){
args__5903__auto__.push((arguments[i__5898__auto___28486]));

var G__28491 = (i__5898__auto___28486 + (1));
i__5898__auto___28486 = G__28491;
continue;
} else {
}
break;
}

var argseq__5904__auto__ = ((((2) < args__5903__auto__.length))?(new cljs.core.IndexedSeq(args__5903__auto__.slice((2)),(0),null)):null);
return knoxx.backend.domain.voice.tools.voice_tts_stream_execute.cljs$core$IFn$_invoke$arity$variadic((arguments[(0)]),(arguments[(1)]),argseq__5904__auto__);
});

(knoxx.backend.domain.voice.tools.voice_tts_stream_execute.cljs$core$IFn$_invoke$arity$variadic = (function (_runtime,config,args){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.voice.tools.tts_stream_execute(config),args);
}));

(knoxx.backend.domain.voice.tools.voice_tts_stream_execute.cljs$lang$maxFixedArity = (2));

/** @this {Function} */
(knoxx.backend.domain.voice.tools.voice_tts_stream_execute.cljs$lang$applyTo = (function (seq28091){
var G__28092 = cljs.core.first(seq28091);
var seq28091__$1 = cljs.core.next(seq28091);
var G__28093 = cljs.core.first(seq28091__$1);
var seq28091__$2 = cljs.core.next(seq28091__$1);
var self__5882__auto__ = this;
return self__5882__auto__.cljs$core$IFn$_invoke$arity$variadic(G__28092,G__28093,seq28091__$2);
}));

knoxx.backend.domain.voice.tools.voice_openutau_project_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"voice.openutau_project","OpenUtau Project","Create an OpenUtau .ustx singing project.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use for lyric-timed vocal synthesis via OpenUtau.",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Provide notes with lyric, tone, duration.","Default singer: Kasane Teto (\u91CD\u97F3\u30C6\u30C8). Default phonemizer: JapaneseCV.","Use voice.openutau_render to headlessly render .ustx to .wav."], null),knoxx.backend.domain.voice.tools.openutau_project_params,knoxx.backend.domain.voice.tools.voice_openutau_project_execute], 0));
knoxx.backend.domain.voice.tools.openutau_render_params = new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ustx_path","ustx_path",-1632700546),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"description","description",-1428560544),"Path to the .ustx file to render."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"output_path","output_path",-1715585288),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"optional","optional",2053951509),true,new cljs.core.Keyword(null,"description","description",-1428560544),"Output .wav path. Defaults to same dir as .ustx."], null),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null);
knoxx.backend.domain.voice.tools.voice_openutau_render_execute = (async function knoxx$backend$domain$voice$tools$voice_openutau_render_execute(runtime,config,_call_id,params,a,b,c){
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
var ustx_path = knoxx.backend.domain.media.normalize_tool_path_arg((params["ustx_path"]));
var output_path = (await (async function (){var or__5162__auto__ = (await (async function (){var temp__5825__auto__ = (params["output_path"]);
if(cljs.core.truth_(temp__5825__auto__)){
var p = temp__5825__auto__;
return knoxx.backend.domain.media.normalize_tool_path_arg(p);
} else {
return null;
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.media.path_basename(shadow.esm.esm_import$node_path,ustx_path))+".wav");
}
})());
var map__28137 = knoxx.backend.domain.media.resolve_workspace_media_path(runtime,config,output_path);
var map__28137__$1 = cljs.core.__destructure_map(map__28137);
var absolute = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28137__$1,new cljs.core.Keyword(null,"absolute","absolute",1655386478));
if(cljs.core.truth_(ustx_path)){
} else {
throw (new Error("ustx_path is required"));
}

knoxx.backend.domain.tools.maybe_tool_update_BANG_(on_update,(""+"Rendering "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(ustx_path)+" to WAV..."));

try{var result = (await knoxx.backend.domain.openutau.tools.render_ustx_to_wav(ustx_path,absolute));
return knoxx.backend.domain.text.tool_text_result((""+"Rendered OpenUTAU project to "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(output_path)),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"wav_path","wav_path",-1821986741),output_path,new cljs.core.Keyword(null,"stdout","stdout",-531490018),new cljs.core.Keyword(null,"stdout","stdout",-531490018).cljs$core$IFn$_invoke$arity$1(result)], null));
}catch (e28160){var err = e28160;
throw (new Error((""+"Render failed: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err.message))));
}});
knoxx.backend.domain.voice.tools.voice_openutau_render_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"voice.openutau_render","OpenUtau Render","Headlessly render an OpenUtau .ustx project to WAV.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Requires the OpenUTAU headless pipeline (Xvfb + WORLDLINE-R + voicebank).",new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Pass the path to a .ustx file generated by voice.openutau_project.","Renders using the singer and phonemizer configured in the project.","Outputs 16-bit mono 44100Hz PCM WAV."], null),knoxx.backend.domain.voice.tools.openutau_render_params,knoxx.backend.domain.voice.tools.voice_openutau_render_execute], 0));
knoxx.backend.domain.voice.tools.voice_tts_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"voice.tts","Text-to-Speech","Synthesize spoken audio via Voxx Gateway. Defaults to prompt-aware mode plus lively final postprocess, then writes MP3 to workspace.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use voice.tts for spoken audio. Default: prompt_aware=true, postprocess_profile=sports-commentator-v1, model_id=kokoro, voice_id=af_jessica, speed=1.15.",new cljs.core.PersistentVector(null, 11, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Pass clean spoken copy; strip markdown formatting, but keep intentional performance tags.","Default mode is prompt-aware: [excited], [whisper], [laugh], [pause], [dramatic], and <break time=\"500ms\" /> are Voxx-owned performance directions, not words to speak and not markup to pass through to the provider.","Use tags sparingly at phrase boundaries. Bracket tags set Voxx segment-level emotion/energy filters, [pause] and <break time=\"...ms\" /> insert silence, and [laugh] inserts a short nonverbal effect.","Voxx consumes known performance tags, sends clean segment text to the chosen backend, stitches the segments together, then applies tag-driven inflection postprocessing plus the final mastering profile.","Use postprocess_profile to choose Voxx's final mastering: sports/commentator (default high energy), broadcast/warm, narrator/polish, radio/crisp, soft/studio, or off/none for dry capture.","eSpeak is not in the default Voxx backend order; if a voice sounds robotic, inspect x-openhax-tts-backend before assuming postprocess is the cause.","Use model_id as a backend hint: kokoro, xiaomi_mimo, requesty, openai, melo, or espeak; Voxx may fall back by VOICE_GATEWAY_TTS_BACKEND_ORDER.","Default output_format is mp3. When output_path is omitted, files save to Voice/tts-<timestamp>.mp3 automatically.","Use Voice/ for spoken TTS output, Audio/ for sound clips and effects, Music/ for musical or sung content.","Follow with workspace_media.attach to embed audio.","If debugging, inspect Voxx headers/logs: x-openhax-tts-backend, x-openhax-tts-postprocess-profile, and x-openhax-tts-prompt-aware."], null),knoxx.backend.domain.voice.tools.tts_rest_params,knoxx.backend.domain.voice.tools.voice_tts_execute], 0));
knoxx.backend.domain.voice.tools.voice_tts_stream_tool = cljs.core.partial.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.tools.create_tool_obj,"voice.tts_stream","TTS Stream","WS streaming TTS session params for /ws/voice/tts with Voxx prompt-aware and postprocess defaults.",cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2(["Use voice.tts_stream for WS TTS connection params. Default: prompt_aware=true, postprocess_profile=sports-commentator-v1, model_id=kokoro, voice_id=af_jessica, speed=1.15.",new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, ["Returns WS protocol spec, default postprocess/prompt-aware settings, and API key status.","Send prompt_aware, prompt_aware_style, postprocess_profile, and postprocess_enabled in the start message or query when overriding defaults.","Use the same tag rules as voice.tts: bracket/XML-like tags are Voxx-owned postprocessing directions, not spoken text.","Use voice.tts when you need a persisted MP3 file."], null),knoxx.backend.domain.voice.tools.tts_stream_params,knoxx.backend.domain.voice.tools.voice_tts_stream_execute], 0));
knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools = (function knoxx$backend$domain$voice$tools$create_voice_synth_custom_tools(var_args){
var G__28164 = arguments.length;
switch (G__28164) {
case 2:
return knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var allowed_QMARK_ = (function (id){
return (((auth_context == null)) || (knoxx.backend.infra.auth.authz.ctx_tool_allowed_QMARK_(auth_context,id)));
});
return cljs.core.clj__GT_js(cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [((allowed_QMARK_("voice.openutau_project"))?knoxx.backend.domain.voice.tools.voice_openutau_project_tool(runtime,config):null),((allowed_QMARK_("voice.openutau_render"))?knoxx.backend.domain.voice.tools.voice_openutau_render_tool(runtime,config):null),((allowed_QMARK_("voice.tts"))?knoxx.backend.domain.voice.tools.voice_tts_tool(runtime,config):null),((allowed_QMARK_("voice.tts_stream"))?knoxx.backend.domain.voice.tools.voice_tts_stream_tool(runtime,config):null)], null))));
}));

(knoxx.backend.domain.voice.tools.create_voice_synth_custom_tools.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.domain.voice.tools.js.map
