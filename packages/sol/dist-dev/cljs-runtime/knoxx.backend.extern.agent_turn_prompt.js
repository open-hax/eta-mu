import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.extern.agent_turn_prompt');
knoxx.backend.extern.agent_turn_prompt.prompt_content = (function knoxx$backend$extern$agent_turn_prompt$prompt_content(media_parts,final_text){
if(cljs.core.seq(media_parts)){
return cljs.core.clj__GT_js(cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(media_parts),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"type","type",1174270348),"text",new cljs.core.Keyword(null,"text","text",-1790561697),final_text], null)));
} else {
return final_text;
}
});
knoxx.backend.extern.agent_turn_prompt.multipart_QMARK_ = (function knoxx$backend$extern$agent_turn_prompt$multipart_QMARK_(content){
return cljs.core.array_QMARK_(content);
});
knoxx.backend.extern.agent_turn_prompt.content_type = (function knoxx$backend$extern$agent_turn_prompt$content_type(content){
if(cljs.core.truth_(knoxx.backend.extern.agent_turn_prompt.multipart_QMARK_(content))){
return "multipart";
} else {
return "text";
}
});
knoxx.backend.extern.agent_turn_prompt.redact_data = (function knoxx$backend$extern$agent_turn_prompt$redact_data(data){
var data__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(data));
return (""+"[img:sha="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(Buffer.from(data__$1,"base64").toString("hex").slice((0),(12)))+" len="+cljs.core.str.cljs$core$IFn$_invoke$arity$1(((data__$1).length))+"]");
});
knoxx.backend.extern.agent_turn_prompt.safe_part = (function knoxx$backend$extern$agent_turn_prompt$safe_part(part){
var part_map = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(part,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
var data = new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(part_map);
if(((typeof data === 'string') && ((cljs.core.count(data) > (64))))){
return cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(part_map,new cljs.core.Keyword(null,"data","data",-232669377),knoxx.backend.extern.agent_turn_prompt.redact_data(data)));
} else {
return part;
}
});
knoxx.backend.extern.agent_turn_prompt.safe_content = (function knoxx$backend$extern$agent_turn_prompt$safe_content(content){
if(cljs.core.truth_(knoxx.backend.extern.agent_turn_prompt.multipart_QMARK_(content))){
return cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.extern.agent_turn_prompt.safe_part,cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(content)));
} else {
return content;
}
});
knoxx.backend.extern.agent_turn_prompt.log_payload = (function knoxx$backend$extern$agent_turn_prompt$log_payload(p__34648){
var map__34649 = p__34648;
var map__34649__$1 = cljs.core.__destructure_map(map__34649);
var media_parts_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"media-parts-count","media-parts-count",1959616188));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var model_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"model-id","model-id",-467101728));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var parts_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"parts-count","parts-count",342585412));
var content = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"content","content",15833224));
var mode = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"mode","mode",654403691));
var omitted_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__34649__$1,new cljs.core.Keyword(null,"omitted-count","omitted-count",961717846));
return ({"parts_count": parts_count, "content": knoxx.backend.extern.agent_turn_prompt.safe_content(content), "run_id": run_id, "mode": mode, "session_id": session_id, "media_parts_count": media_parts_count, "conversation_id": conversation_id, "content_type": knoxx.backend.extern.agent_turn_prompt.content_type(content), "omitted_count": omitted_count, "model_id": model_id});
});
knoxx.backend.extern.agent_turn_prompt.log_prompt_BANG_ = (function knoxx$backend$extern$agent_turn_prompt$log_prompt_BANG_(opts){
return console.log("[prompt-and-await!]",JSON.stringify(knoxx.backend.extern.agent_turn_prompt.log_payload(opts)));
});
knoxx.backend.extern.agent_turn_prompt.send_user_message_BANG_ = (function knoxx$backend$extern$agent_turn_prompt$send_user_message_BANG_(session,content){
return session.sendUserMessage(content);
});

//# sourceMappingURL=knoxx.backend.extern.agent_turn_prompt.js.map
