import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.shape.agent.message.js";
import "./malli.core.js";
import "./malli.error.js";
goog.provide('knoxx.backend.shape.agent');
knoxx.backend.shape.agent.ToolPolicy = new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"toolId","toolId",-1935596543),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"effect","effect",347343289),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"enum","enum",1679018432),"allow","deny"], null)], null)], null);
knoxx.backend.shape.agent.AgentRequestSpec = new cljs.core.PersistentVector(null, 19, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract-id","contract-id",-855048622),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract-actors","contract-actors",-173888049),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null)], null)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"system-prompt","system-prompt",362593429),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"task-prompt","task-prompt",-349302716),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),knoxx.backend.shape.agent.ToolPolicy], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"resource-policies","resource-policies",-1726016874),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),cljs.core.any_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sources","sources",-321166424),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),cljs.core.any_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memory-hydration","memory-hydration",1956326082),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),cljs.core.any_QMARK_], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"context-policy","context-policy",-1770881557),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null)], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sub-agent-id","sub-agent-id",1379404479),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent-agent-id","parent-agent-id",1884761925),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"parent-run-id","parent-run-id",662820367),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"spawn-kind","spawn-kind",-1330963959),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null)], null);
/**
 * Canonical agent specification shape used by agent runtime requests. Kept as
 * an alias during migration so older call sites can continue to refer to
 * AgentRequestSpec.
 */
knoxx.backend.shape.agent.AgentSpec = knoxx.backend.shape.agent.AgentRequestSpec;
knoxx.backend.shape.agent.ChatBody = new cljs.core.PersistentVector(null, 13, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"model","model",331153215),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"thinking-level","thinking-level",2081595953),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"content-parts","content-parts",684529019),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"vector","vector",1902966158),knoxx.backend.shape.agent.message.ContentPart], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"template-context","template-context",-946500342),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),knoxx.backend.shape.agent.message.TemplateContext], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),knoxx.backend.shape.agent.AgentRequestSpec], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"auth-context","auth-context",320032325),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null)], null)], null)], null)], null);
knoxx.backend.shape.agent.ControlBody = new cljs.core.PersistentVector(null, 8, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"string","string",-1989541586)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"maybe","maybe",-314397560),new cljs.core.Keyword(null,"string","string",-1989541586)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"metadata","metadata",1799301597),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"optional","optional",2053951509),true], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"map","map",1371690461),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"closed","closed",-919675359),false], null)], null)], null)], null);
knoxx.backend.shape.agent.valid_agent_request_spec_QMARK_ = (function knoxx$backend$shape$agent$valid_agent_request_spec_QMARK_(value){
return malli.core.validate.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.agent.AgentRequestSpec,value);
});
knoxx.backend.shape.agent.valid_chat_body_QMARK_ = (function knoxx$backend$shape$agent$valid_chat_body_QMARK_(value){
return malli.core.validate.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.agent.ChatBody,value);
});
knoxx.backend.shape.agent.valid_control_body_QMARK_ = (function knoxx$backend$shape$agent$valid_control_body_QMARK_(value){
return malli.core.validate.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.agent.ControlBody,value);
});
knoxx.backend.shape.agent.explain_agent_request_spec = (function knoxx$backend$shape$agent$explain_agent_request_spec(value){
return malli.error.humanize.cljs$core$IFn$_invoke$arity$1(malli.core.explain.cljs$core$IFn$_invoke$arity$2(knoxx.backend.shape.agent.AgentRequestSpec,value));
});

/**
 * @interface
 */
knoxx.backend.shape.agent.IAgentSession = function(){};

var knoxx$backend$shape$agent$IAgentSession$streaming_QMARK_$dyn_25721 = (function (s){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.streaming_QMARK_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5520__auto__.call(null,s));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.streaming_QMARK_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5518__auto__.call(null,s));
} else {
throw cljs.core.missing_protocol("IAgentSession.streaming?",s);
}
}
});
/**
 * True when the session has an active streaming turn.
 */
knoxx.backend.shape.agent.streaming_QMARK_ = (function knoxx$backend$shape$agent$streaming_QMARK_(s){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$streaming_QMARK_$arity$1 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$streaming_QMARK_$arity$1(s);
} else {
return knoxx$backend$shape$agent$IAgentSession$streaming_QMARK_$dyn_25721(s);
}
});

var knoxx$backend$shape$agent$IAgentSession$current_turn$dyn_25726 = (function (s){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.current_turn[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5520__auto__.call(null,s));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.current_turn["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5518__auto__.call(null,s));
} else {
throw cljs.core.missing_protocol("IAgentSession.current-turn",s);
}
}
});
/**
 * The current running turn object (opaque), or nil if idle.
 */
knoxx.backend.shape.agent.current_turn = (function knoxx$backend$shape$agent$current_turn(s){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$current_turn$arity$1 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$current_turn$arity$1(s);
} else {
return knoxx$backend$shape$agent$IAgentSession$current_turn$dyn_25726(s);
}
});

var knoxx$backend$shape$agent$IAgentSession$messages$dyn_25737 = (function (s){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.messages[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5520__auto__.call(null,s));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.messages["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5518__auto__.call(null,s));
} else {
throw cljs.core.missing_protocol("IAgentSession.messages",s);
}
}
});
/**
 * A seq of the session's message history as JS objects.
 *   Individual message structure is eta-mu's internal format;
 *   use infra.agent.transcript functions to convert.
 */
knoxx.backend.shape.agent.messages = (function knoxx$backend$shape$agent$messages(s){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$messages$arity$1 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$messages$arity$1(s);
} else {
return knoxx$backend$shape$agent$IAgentSession$messages$dyn_25737(s);
}
});

var knoxx$backend$shape$agent$IAgentSession$subscribe_BANG_$dyn_25755 = (function (s,handler){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.subscribe_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(s,handler) : m__5520__auto__.call(null,s,handler));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.subscribe_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(s,handler) : m__5518__auto__.call(null,s,handler));
} else {
throw cljs.core.missing_protocol("IAgentSession.subscribe!",s);
}
}
});
/**
 * Subscribe to provider stream events. Returns an unsubscribe function.
 */
knoxx.backend.shape.agent.subscribe_BANG_ = (function knoxx$backend$shape$agent$subscribe_BANG_(s,handler){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$subscribe_BANG_$arity$2 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$subscribe_BANG_$arity$2(s,handler);
} else {
return knoxx$backend$shape$agent$IAgentSession$subscribe_BANG_$dyn_25755(s,handler);
}
});

var knoxx$backend$shape$agent$IAgentSession$send_user_message_BANG_$dyn_25776 = (function (s,content){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.send_user_message_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(s,content) : m__5520__auto__.call(null,s,content));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.send_user_message_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(s,content) : m__5518__auto__.call(null,s,content));
} else {
throw cljs.core.missing_protocol("IAgentSession.send-user-message!",s);
}
}
});
/**
 * Send a user prompt/content payload to the provider session. Returns a Promise.
 */
knoxx.backend.shape.agent.send_user_message_BANG_ = (function knoxx$backend$shape$agent$send_user_message_BANG_(s,content){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$send_user_message_BANG_$arity$2 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$send_user_message_BANG_$arity$2(s,content);
} else {
return knoxx$backend$shape$agent$IAgentSession$send_user_message_BANG_$dyn_25776(s,content);
}
});

var knoxx$backend$shape$agent$IAgentSession$follow_up_BANG_$dyn_25784 = (function (s,message){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.follow_up_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(s,message) : m__5520__auto__.call(null,s,message));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.follow_up_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(s,message) : m__5518__auto__.call(null,s,message));
} else {
throw cljs.core.missing_protocol("IAgentSession.follow-up!",s);
}
}
});
/**
 * Queue a follow-up message into the running turn. Returns a Promise.
 */
knoxx.backend.shape.agent.follow_up_BANG_ = (function knoxx$backend$shape$agent$follow_up_BANG_(s,message){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$follow_up_BANG_$arity$2 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$follow_up_BANG_$arity$2(s,message);
} else {
return knoxx$backend$shape$agent$IAgentSession$follow_up_BANG_$dyn_25784(s,message);
}
});

var knoxx$backend$shape$agent$IAgentSession$steer_BANG_$dyn_25793 = (function (s,message){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.steer_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(s,message) : m__5520__auto__.call(null,s,message));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.steer_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(s,message) : m__5518__auto__.call(null,s,message));
} else {
throw cljs.core.missing_protocol("IAgentSession.steer!",s);
}
}
});
/**
 * Steer the current generation. Returns a Promise.
 */
knoxx.backend.shape.agent.steer_BANG_ = (function knoxx$backend$shape$agent$steer_BANG_(s,message){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$steer_BANG_$arity$2 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$steer_BANG_$arity$2(s,message);
} else {
return knoxx$backend$shape$agent$IAgentSession$steer_BANG_$dyn_25793(s,message);
}
});

var knoxx$backend$shape$agent$IAgentSession$set_thinking_level_BANG_$dyn_25797 = (function (s,level){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.set_thinking_level_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(s,level) : m__5520__auto__.call(null,s,level));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.set_thinking_level_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(s,level) : m__5518__auto__.call(null,s,level));
} else {
throw cljs.core.missing_protocol("IAgentSession.set-thinking-level!",s);
}
}
});
/**
 * Set the thinking/reasoning level on the session.
 */
knoxx.backend.shape.agent.set_thinking_level_BANG_ = (function knoxx$backend$shape$agent$set_thinking_level_BANG_(s,level){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$set_thinking_level_BANG_$arity$2 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$set_thinking_level_BANG_$arity$2(s,level);
} else {
return knoxx$backend$shape$agent$IAgentSession$set_thinking_level_BANG_$dyn_25797(s,level);
}
});

var knoxx$backend$shape$agent$IAgentSession$abort_BANG_$dyn_25798 = (function (s){
var x__5519__auto__ = (((s == null))?null:s);
var m__5520__auto__ = (knoxx.backend.shape.agent.abort_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5520__auto__.call(null,s));
} else {
var m__5518__auto__ = (knoxx.backend.shape.agent.abort_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(s) : m__5518__auto__.call(null,s));
} else {
throw cljs.core.missing_protocol("IAgentSession.abort!",s);
}
}
});
/**
 * Abort the in-flight agent turn at the provider, stopping the tool/generation
 *   loop. Returns a Promise. Used by the death-spiral guard and explicit aborts;
 *   this is the only mechanism that halts a runaway turn now that turns may run
 *   unbounded.
 */
knoxx.backend.shape.agent.abort_BANG_ = (function knoxx$backend$shape$agent$abort_BANG_(s){
if((((!((s == null)))) && ((!((s.knoxx$backend$shape$agent$IAgentSession$abort_BANG_$arity$1 == null)))))){
return s.knoxx$backend$shape$agent$IAgentSession$abort_BANG_$arity$1(s);
} else {
return knoxx$backend$shape$agent$IAgentSession$abort_BANG_$dyn_25798(s);
}
});


//# sourceMappingURL=knoxx.backend.shape.agent.js.map
