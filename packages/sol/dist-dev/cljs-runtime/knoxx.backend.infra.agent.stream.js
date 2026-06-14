import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.agent.reasoning.js";
import "./knoxx.backend.domain.agent.text_delta.js";
import "./knoxx.backend.domain.agent.tool_lifecycle.js";
import "./knoxx.backend.domain.agent.turn_guards.js";
import "./knoxx.backend.infra.agent.stream.provider_events.js";
import "./knoxx.backend.infra.agent.stream.sinks.js";
import "./knoxx.backend.infra.agent.tools.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.domain.text.js";
import "./knoxx.backend.domain.voice.turn_control.js";
import "./knoxx.backend.shape.agent.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.agent.stream');
knoxx.backend.infra.agent.stream.make_stream_state = (function knoxx$backend$infra$agent$stream$make_stream_state(run_id,conversation_id,session_id,started_at,started_ms,random_uuid_BANG_){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913),new cljs.core.Keyword(null,"session-id","session-id",-1147060351),new cljs.core.Keyword(null,"tool-loop*","tool-loop*",1394428066),new cljs.core.Keyword(null,"think-tag-mode*","think-tag-mode*",1825166790),new cljs.core.Keyword(null,"abort-reason*","abort-reason*",-962330650),new cljs.core.Keyword(null,"started-at","started-at",1318767912),new cljs.core.Keyword(null,"started-ms","started-ms",1106122505),new cljs.core.Keyword(null,"seen-tool-lifecycle-events*","seen-tool-lifecycle-events*",83846058),new cljs.core.Keyword(null,"run-event-sink","run-event-sink",16548043),new cljs.core.Keyword(null,"chunks","chunks",83720431),new cljs.core.Keyword(null,"replay-suppression*","replay-suppression*",192344501),new cljs.core.Keyword(null,"reasoning-chunks","reasoning-chunks",-526618091),new cljs.core.Keyword(null,"random-uuid!","random-uuid!",794889238),new cljs.core.Keyword(null,"aborting?","aborting?",690860697),new cljs.core.Keyword(null,"ttft-recorded?","ttft-recorded?",-1916399622),new cljs.core.Keyword(null,"tool-call-ids*","tool-call-ids*",826723932),new cljs.core.Keyword(null,"run-id","run-id",-1745267908),new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770),new cljs.core.Keyword(null,"last-reasoning-text*","last-reasoning-text*",-1619356993)],[conversation_id,session_id,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"last","last",1105735132),null,new cljs.core.Keyword(null,"streak","streak",1229213332),(0),new cljs.core.Keyword(null,"counts","counts",234305892),cljs.core.PersistentArrayMap.EMPTY], null)),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"off","off",606440789)),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null),started_at,started_ms,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentHashSet.EMPTY),knoxx.backend.infra.agent.stream.sinks.live_run_event_sink(),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY),random_uuid_BANG_,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(false),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(knoxx.backend.domain.agent.tool_lifecycle.empty_tool_call_id_state),run_id,cljs.core.atom.cljs$core$IFn$_invoke$arity$1(""),cljs.core.atom.cljs$core$IFn$_invoke$arity$1("")]);
});
/**
 * Reserve a per-occurrence unique id for a starting tool call so reused
 * provider ids (call_0 every round) stop collapsing receipts and events.
 */
knoxx.backend.infra.agent.stream.register_tool_call_start_BANG_ = (function knoxx$backend$infra$agent$stream$register_tool_call_start_BANG_(state,tool_name,raw_tool_call_id){
var resolved = (function (){var G__28312 = cljs.core.deref(new cljs.core.Keyword(null,"tool-call-ids*","tool-call-ids*",826723932).cljs$core$IFn$_invoke$arity$1(state));
var G__28313 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tool-name","tool-name",613742581),tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),raw_tool_call_id], null);
return (knoxx.backend.domain.agent.tool_lifecycle.resolve_tool_call_start_id.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.resolve_tool_call_start_id.cljs$core$IFn$_invoke$arity$2(G__28312,G__28313) : knoxx.backend.domain.agent.tool_lifecycle.resolve_tool_call_start_id.call(null,G__28312,G__28313));
})();
cljs.core.reset_BANG_(new cljs.core.Keyword(null,"tool-call-ids*","tool-call-ids*",826723932).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"state","state",-1988618099).cljs$core$IFn$_invoke$arity$1(resolved));

return new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999).cljs$core$IFn$_invoke$arity$1(resolved);
});
/**
 * Resolve a raw provider tool-call id to the unique id of its latest start,
 * falling back to the trimmed raw id when no start was observed.
 */
knoxx.backend.infra.agent.stream.active_tool_call_id = (function knoxx$backend$infra$agent$stream$active_tool_call_id(state,tool_name,raw_tool_call_id){
var or__5162__auto__ = (function (){var G__28316 = cljs.core.deref(new cljs.core.Keyword(null,"tool-call-ids*","tool-call-ids*",826723932).cljs$core$IFn$_invoke$arity$1(state));
var G__28317 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"tool-name","tool-name",613742581),tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),raw_tool_call_id], null);
return (knoxx.backend.domain.agent.tool_lifecycle.active_tool_call_id.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.active_tool_call_id.cljs$core$IFn$_invoke$arity$2(G__28316,G__28317) : knoxx.backend.domain.agent.tool_lifecycle.active_tool_call_id.call(null,G__28316,G__28317));
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var G__28318 = raw_tool_call_id;
var G__28318__$1 = (((G__28318 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__28318)));
var G__28318__$2 = (((G__28318__$1 == null))?null:clojure.string.trim(G__28318__$1));
if((G__28318__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__28318__$2);
}
}
});
/**
 * Emit appended delta for a *cumulative* text value.
 * 
 * Some providers misuse `*_delta` to carry the full message-so-far (cumulative)
 * instead of an incremental token. If we treat that as an incremental delta we
 * get duplicated leading tokens. This helper diffs against our last seen text,
 * emits only the appended portion, and then resets our last-text atom to the
 * provided cumulative value.
 */
knoxx.backend.infra.agent.stream.emit_progress_text_BANG_ = (function knoxx$backend$infra$agent$stream$emit_progress_text_BANG_(state,kind,full_text){
var full_text__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = full_text;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var last_STAR_ = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201)))?new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770).cljs$core$IFn$_invoke$arity$1(state):new cljs.core.Keyword(null,"last-reasoning-text*","last-reasoning-text*",-1619356993).cljs$core$IFn$_invoke$arity$1(state));
var delta = (function (){var G__28321 = cljs.core.deref(last_STAR_);
var G__28322 = full_text__$1;
return (knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2(G__28321,G__28322) : knoxx.backend.domain.agent.text_delta.diff_appended_text.call(null,G__28321,G__28322));
})();
if(cljs.core.seq(delta)){
(knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3(state,kind,delta) : knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.call(null,state,kind,delta));
} else {
}

return cljs.core.reset_BANG_(last_STAR_,full_text__$1);
});
/**
 * Routes text deltas that contain <think>...</think> blocks into the reasoning
 * stream, leaving the assistant message stream clean.
 */
knoxx.backend.infra.agent.stream.emit_text_delta_with_think_tags_BANG_ = (function knoxx$backend$infra$agent$stream$emit_text_delta_with_think_tags_BANG_(state,delta){
var mode_STAR_ = new cljs.core.Keyword(null,"think-tag-mode*","think-tag-mode*",1825166790).cljs$core$IFn$_invoke$arity$1(state);
var routed = (function (){var G__28324 = new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"mode","mode",654403691),cljs.core.deref(mode_STAR_),new cljs.core.Keyword(null,"last-assistant-text","last-assistant-text",-109059266),cljs.core.deref(new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770).cljs$core$IFn$_invoke$arity$1(state)),new cljs.core.Keyword(null,"delta","delta",108939957),delta], null);
return (knoxx.backend.domain.agent.reasoning.route_think_delta.cljs$core$IFn$_invoke$arity$1 ? knoxx.backend.domain.agent.reasoning.route_think_delta.cljs$core$IFn$_invoke$arity$1(G__28324) : knoxx.backend.domain.agent.reasoning.route_think_delta.call(null,G__28324));
})();
cljs.core.reset_BANG_(mode_STAR_,new cljs.core.Keyword(null,"mode","mode",654403691).cljs$core$IFn$_invoke$arity$1(routed));

var seq__28325 = cljs.core.seq(new cljs.core.Keyword(null,"emissions","emissions",925663162).cljs$core$IFn$_invoke$arity$1(routed));
var chunk__28326 = null;
var count__28327 = (0);
var i__28328 = (0);
while(true){
if((i__28328 < count__28327)){
var map__28335 = chunk__28326.cljs$core$IIndexed$_nth$arity$2(null,i__28328);
var map__28335__$1 = cljs.core.__destructure_map(map__28335);
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28335__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var delta__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28335__$1,new cljs.core.Keyword(null,"delta","delta",108939957));
(knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3(state,kind,delta__$1) : knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.call(null,state,kind,delta__$1));


var G__28596 = seq__28325;
var G__28597 = chunk__28326;
var G__28598 = count__28327;
var G__28599 = (i__28328 + (1));
seq__28325 = G__28596;
chunk__28326 = G__28597;
count__28327 = G__28598;
i__28328 = G__28599;
continue;
} else {
var temp__5825__auto__ = cljs.core.seq(seq__28325);
if(temp__5825__auto__){
var seq__28325__$1 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(seq__28325__$1)){
var c__5694__auto__ = cljs.core.chunk_first(seq__28325__$1);
var G__28601 = cljs.core.chunk_rest(seq__28325__$1);
var G__28602 = c__5694__auto__;
var G__28603 = cljs.core.count(c__5694__auto__);
var G__28604 = (0);
seq__28325 = G__28601;
chunk__28326 = G__28602;
count__28327 = G__28603;
i__28328 = G__28604;
continue;
} else {
var map__28337 = cljs.core.first(seq__28325__$1);
var map__28337__$1 = cljs.core.__destructure_map(map__28337);
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28337__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var delta__$1 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28337__$1,new cljs.core.Keyword(null,"delta","delta",108939957));
(knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.cljs$core$IFn$_invoke$arity$3(state,kind,delta__$1) : knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_.call(null,state,kind,delta__$1));


var G__28606 = cljs.core.next(seq__28325__$1);
var G__28607 = null;
var G__28608 = (0);
var G__28609 = (0);
seq__28325 = G__28606;
chunk__28326 = G__28607;
count__28327 = G__28608;
i__28328 = G__28609;
continue;
}
} else {
return null;
}
}
break;
}
});
knoxx.backend.infra.agent.stream.first_lifecycle_event_QMARK_ = (function knoxx$backend$infra$agent$stream$first_lifecycle_event_QMARK_(state,type,tool_call_id){
if((!(((typeof tool_call_id === 'string') && (cljs.core.seq(tool_call_id)))))){
return true;
} else {
var event_key = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(type)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_call_id));
var seen_QMARK_ = cljs.core.contains_QMARK_(cljs.core.deref(new cljs.core.Keyword(null,"seen-tool-lifecycle-events*","seen-tool-lifecycle-events*",83846058).cljs$core$IFn$_invoke$arity$1(state)),event_key);
if(seen_QMARK_){
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"seen-tool-lifecycle-events*","seen-tool-lifecycle-events*",83846058).cljs$core$IFn$_invoke$arity$1(state),cljs.core.conj,event_key);
}

return (!(seen_QMARK_));
}
});
knoxx.backend.infra.agent.stream.suppress_replayed_prefix_delta_BANG_ = (function knoxx$backend$infra$agent$stream$suppress_replayed_prefix_delta_BANG_(p__28355,kind,delta){
var map__28356 = p__28355;
var map__28356__$1 = cljs.core.__destructure_map(map__28356);
var last_assistant_text_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28356__$1,new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770));
var last_reasoning_text_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28356__$1,new cljs.core.Keyword(null,"last-reasoning-text*","last-reasoning-text*",-1619356993));
var replay_suppression_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28356__$1,new cljs.core.Keyword(null,"replay-suppression*","replay-suppression*",192344501));
var previous = cljs.core.deref(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201)))?last_assistant_text_STAR_:last_reasoning_text_STAR_));
var offset = cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(replay_suppression_STAR_),kind);
var result = (knoxx.backend.domain.agent.text_delta.suppress_replayed_prefix_delta.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.domain.agent.text_delta.suppress_replayed_prefix_delta.cljs$core$IFn$_invoke$arity$3(previous,offset,delta) : knoxx.backend.domain.agent.text_delta.suppress_replayed_prefix_delta.call(null,previous,offset,delta));
var temp__5823__auto___28614 = new cljs.core.Keyword(null,"replay-offset","replay-offset",675853601).cljs$core$IFn$_invoke$arity$1(result);
if(cljs.core.truth_(temp__5823__auto___28614)){
var next_offset_28615 = temp__5823__auto___28614;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(replay_suppression_STAR_,cljs.core.assoc,kind,next_offset_28615);
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(replay_suppression_STAR_,cljs.core.dissoc,kind);
}

return new cljs.core.Keyword(null,"delta","delta",108939957).cljs$core$IFn$_invoke$arity$1(result);
});
knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_ = (function knoxx$backend$infra$agent$stream$emit_streaming_delta_BANG_(p__28359,kind,delta){
var map__28360 = p__28359;
var map__28360__$1 = cljs.core.__destructure_map(map__28360);
var state = map__28360__$1;
var ttft_recorded_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"ttft-recorded?","ttft-recorded?",-1916399622));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var last_assistant_text_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770));
var last_reasoning_text_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"last-reasoning-text*","last-reasoning-text*",-1619356993));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var started_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"started-ms","started-ms",1106122505));
var chunks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"chunks","chunks",83720431));
var reasoning_chunks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28360__$1,new cljs.core.Keyword(null,"reasoning-chunks","reasoning-chunks",-526618091));
var delta__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = delta;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var delta__$2 = knoxx.backend.infra.agent.stream.suppress_replayed_prefix_delta_BANG_(state,kind,delta__$1);
var last_STAR_ = ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201)))?last_assistant_text_STAR_:last_reasoning_text_STAR_);
var delta__$3 = (function (){var G__28361 = cljs.core.deref(last_STAR_);
var G__28362 = delta__$2;
return (knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.text_delta.diff_appended_text.cljs$core$IFn$_invoke$arity$2(G__28361,G__28362) : knoxx.backend.domain.agent.text_delta.diff_appended_text.call(null,G__28361,G__28362));
})();
if(cljs.core.seq(delta__$3)){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201))) && (cljs.core.not(cljs.core.deref(ttft_recorded_QMARK_))))){
cljs.core.reset_BANG_(ttft_recorded_QMARK_,true);

var ttft_ms_28620 = (Date.now() - started_ms);
var ttft_event_28621 = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"assistant_first_token",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"streaming",new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),ttft_ms_28620], null));
knoxx.backend.infra.agent.stream.sinks.update_run_state_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),run_id,(function (p1__28358_SHARP_){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__28358_SHARP_,new cljs.core.Keyword(null,"ttft_ms","ttft_ms",-630990832),ttft_ms_28620);
}));

knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),ttft_event_28621);

knoxx.backend.infra.agent.stream.sinks.update_session_record_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),session_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"mark-streaming","mark-streaming",-584985254),new cljs.core.Keyword(null,"active?","active?",459499776),true], null));
} else {
}

if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(chunks,cljs.core.conj,delta__$3);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(last_assistant_text_STAR_,cljs.core.str,delta__$3);
} else {
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(reasoning_chunks,cljs.core.conj,delta__$3);

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(last_reasoning_text_STAR_,cljs.core.str,delta__$3);
}

knoxx.backend.infra.agent.stream.sinks.append_trace_text_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),run_id,kind,delta__$3,knoxx.backend.domain.time.now_iso());

return knoxx.backend.infra.agent.stream.sinks.emit_token_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"kind","kind",-717265803),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(kind,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201)))?"assistant_message":"reasoning"),new cljs.core.Keyword(null,"token","token",-1211463215),delta__$3], null));
} else {
return null;
}
});
knoxx.backend.infra.agent.stream.sync_assistant_message_BANG_ = (function knoxx$backend$infra$agent$stream$sync_assistant_message_BANG_(state,assistant_message){
if(cljs.core.truth_((function (){var and__5160__auto__ = assistant_message;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((assistant_message["role"]),"assistant");
} else {
return and__5160__auto__;
}
})())){
var full_text = knoxx.backend.domain.text.assistant_message_text(assistant_message);
var full_reasoning = knoxx.backend.domain.text.assistant_message_reasoning_text(assistant_message);
var tool_previews = knoxx.backend.infra.agent.tools.assistant_tool_call_previews(assistant_message);
var seq__28373_28630 = cljs.core.seq(tool_previews);
var chunk__28374_28631 = null;
var count__28375_28632 = (0);
var i__28376_28633 = (0);
while(true){
if((i__28376_28633 < count__28375_28632)){
var map__28382_28635 = chunk__28374_28631.cljs$core$IIndexed$_nth$arity$2(null,i__28376_28633);
var map__28382_28636__$1 = cljs.core.__destructure_map(map__28382_28635);
var tool_call_id_28637 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28382_28636__$1,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517));
var tool_name_28638 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28382_28636__$1,new cljs.core.Keyword(null,"tool_name","tool_name",-42168484));
var input_preview_28639 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28382_28636__$1,new cljs.core.Keyword(null,"input_preview","input_preview",2048529734));
knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),knoxx.backend.infra.agent.stream.active_tool_call_id(state,tool_name_28638,tool_call_id_28637),tool_name_28638,input_preview_28639);


var G__28640 = seq__28373_28630;
var G__28641 = chunk__28374_28631;
var G__28642 = count__28375_28632;
var G__28643 = (i__28376_28633 + (1));
seq__28373_28630 = G__28640;
chunk__28374_28631 = G__28641;
count__28375_28632 = G__28642;
i__28376_28633 = G__28643;
continue;
} else {
var temp__5825__auto___28644 = cljs.core.seq(seq__28373_28630);
if(temp__5825__auto___28644){
var seq__28373_28645__$1 = temp__5825__auto___28644;
if(cljs.core.chunked_seq_QMARK_(seq__28373_28645__$1)){
var c__5694__auto___28646 = cljs.core.chunk_first(seq__28373_28645__$1);
var G__28647 = cljs.core.chunk_rest(seq__28373_28645__$1);
var G__28648 = c__5694__auto___28646;
var G__28649 = cljs.core.count(c__5694__auto___28646);
var G__28650 = (0);
seq__28373_28630 = G__28647;
chunk__28374_28631 = G__28648;
count__28375_28632 = G__28649;
i__28376_28633 = G__28650;
continue;
} else {
var map__28388_28651 = cljs.core.first(seq__28373_28645__$1);
var map__28388_28652__$1 = cljs.core.__destructure_map(map__28388_28651);
var tool_call_id_28653 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28388_28652__$1,new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517));
var tool_name_28654 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28388_28652__$1,new cljs.core.Keyword(null,"tool_name","tool_name",-42168484));
var input_preview_28655 = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28388_28652__$1,new cljs.core.Keyword(null,"input_preview","input_preview",2048529734));
knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),knoxx.backend.infra.agent.stream.active_tool_call_id(state,tool_name_28654,tool_call_id_28653),tool_name_28654,input_preview_28655);


var G__28656 = cljs.core.next(seq__28373_28645__$1);
var G__28657 = null;
var G__28658 = (0);
var G__28659 = (0);
seq__28373_28630 = G__28656;
chunk__28374_28631 = G__28657;
count__28375_28632 = G__28658;
i__28376_28633 = G__28659;
continue;
}
} else {
}
}
break;
}

knoxx.backend.infra.agent.stream.emit_progress_text_BANG_(state,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),full_text);

return knoxx.backend.infra.agent.stream.emit_progress_text_BANG_(state,new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),full_reasoning);
} else {
return null;
}
});
knoxx.backend.infra.agent.stream.request_abort_BANG_ = (function knoxx$backend$infra$agent$stream$request_abort_BANG_(p__28391,session,reason){
var map__28392 = p__28391;
var map__28392__$1 = cljs.core.__destructure_map(map__28392);
var state = map__28392__$1;
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28392__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28392__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28392__$1,new cljs.core.Keyword(null,"session-id","session-id",-1147060351));
var aborting_QMARK_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28392__$1,new cljs.core.Keyword(null,"aborting?","aborting?",690860697));
var abort_reason_STAR_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28392__$1,new cljs.core.Keyword(null,"abort-reason*","abort-reason*",-962330650));
var reason__$1 = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = reason;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "aborted";
}
})()));
if(cljs.core.truth_(cljs.core.deref(aborting_QMARK_))){
return Promise.resolve(null);
} else {
cljs.core.reset_BANG_(aborting_QMARK_,true);

cljs.core.reset_BANG_(abort_reason_STAR_,reason__$1);

var sink_28667 = knoxx.backend.infra.agent.stream.sinks.sink_or_default(state);
knoxx.backend.infra.agent.stream.sinks.update_session_record_BANG_(sink_28667,session_id,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op","op",-1882987955),new cljs.core.Keyword(null,"mark-streaming","mark-streaming",-584985254),new cljs.core.Keyword(null,"active?","active?",459499776),false], null));

var abort_event_28668 = knoxx.backend.domain.action.run_state.tool_event_payload(run_id,conversation_id,session_id,"abort_requested",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"aborting",new cljs.core.Keyword(null,"reason","reason",-2070751759),reason__$1], null));
knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(sink_28667,abort_event_28668);

return knoxx.backend.shape.agent.abort_BANG_(session);
}
});
knoxx.backend.infra.agent.stream.register_active_turn_BANG_ = (function knoxx$backend$infra$agent$stream$register_active_turn_BANG_(var_args){
var G__28408 = arguments.length;
switch (G__28408) {
case 2:
return knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (state,abort_BANG_){
return knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$3(state,abort_BANG_,null);
}));

(knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (p__28417,abort_BANG_,agent_spec){
var map__28422 = p__28417;
var map__28422__$1 = cljs.core.__destructure_map(map__28422);
var state = map__28422__$1;
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28422__$1,new cljs.core.Keyword(null,"run-id","run-id",-1745267908));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28422__$1,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913));
var started_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__28422__$1,new cljs.core.Keyword(null,"started-at","started-at",1318767912));
return knoxx.backend.domain.voice.turn_control.register_active_turn_BANG_(conversation_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"started_at","started_at",856896776),started_at,new cljs.core.Keyword(null,"agent_spec","agent_spec",788920365),agent_spec,new cljs.core.Keyword(null,"abort!","abort!",-220883953),abort_BANG_], null));
}));

(knoxx.backend.infra.agent.stream.register_active_turn_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.stream.handle_message_update_BANG_ = (function knoxx$backend$infra$agent$stream$handle_message_update_BANG_(state,event){
var assistant_event_type = new cljs.core.Keyword(null,"assistant-event-type","assistant-event-type",1217286506).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(assistant_event_type,"text_delta")){
var delta = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"delta","delta",108939957).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var last_text = cljs.core.deref(new cljs.core.Keyword(null,"last-assistant-text*","last-assistant-text*",-872016770).cljs$core$IFn$_invoke$arity$1(state));
if((((!(clojure.string.blank_QMARK_(last_text)))) && (clojure.string.starts_with_QMARK_(delta,last_text)))){
return knoxx.backend.infra.agent.stream.emit_progress_text_BANG_(state,new cljs.core.Keyword(null,"agent_message","agent_message",-522809201),delta);
} else {
return knoxx.backend.infra.agent.stream.emit_text_delta_with_think_tags_BANG_(state,delta);
}
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, ["reasoning",null,"thinking_delta",null,"reasoning_content_delta",null,"reasoning_delta",null,"thinking",null], null), null),assistant_event_type)){
var delta = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"delta","delta",108939957).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
var last_reasoning = cljs.core.deref(new cljs.core.Keyword(null,"last-reasoning-text*","last-reasoning-text*",-1619356993).cljs$core$IFn$_invoke$arity$1(state));
if((((!(clojure.string.blank_QMARK_(last_reasoning)))) && (clojure.string.starts_with_QMARK_(delta,last_reasoning)))){
return knoxx.backend.infra.agent.stream.emit_progress_text_BANG_(state,new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),delta);
} else {
return knoxx.backend.infra.agent.stream.emit_streaming_delta_BANG_(state,new cljs.core.Keyword(null,"reasoning","reasoning",1956143595),delta);
}
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["toolcall_delta",null,"tool_call_delta",null], null), null),assistant_event_type)){
return knoxx.backend.infra.agent.stream.sync_assistant_message_BANG_(state,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"partial-message","partial-message",-1433009206).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(event);
}
})());
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["tool_call_end",null,"toolcall_end",null], null), null),assistant_event_type)){
var temp__5825__auto___28679 = knoxx.backend.infra.agent.tools.tool_call_preview_from_part(new cljs.core.Keyword(null,"tool-call","tool-call",-770496172).cljs$core$IFn$_invoke$arity$1(event));
if(cljs.core.truth_(temp__5825__auto___28679)){
var preview_28680 = temp__5825__auto___28679;
knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),knoxx.backend.infra.agent.stream.active_tool_call_id(state,new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(preview_28680),new cljs.core.Keyword(null,"tool_call_id","tool_call_id",-1531015517).cljs$core$IFn$_invoke$arity$1(preview_28680)),new cljs.core.Keyword(null,"tool_name","tool_name",-42168484).cljs$core$IFn$_invoke$arity$1(preview_28680),new cljs.core.Keyword(null,"input_preview","input_preview",2048529734).cljs$core$IFn$_invoke$arity$1(preview_28680));
} else {
}

return knoxx.backend.infra.agent.stream.sync_assistant_message_BANG_(state,(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"partial-message","partial-message",-1433009206).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(event);
}
})());
} else {
return knoxx.backend.infra.agent.stream.sync_assistant_message_BANG_(state,new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(event));

}
}
}
}
});
knoxx.backend.infra.agent.stream.handle_message_end_BANG_ = (function knoxx$backend$infra$agent$stream$handle_message_end_BANG_(state,event){
return knoxx.backend.infra.agent.stream.sync_assistant_message_BANG_(state,new cljs.core.Keyword(null,"message","message",-406056002).cljs$core$IFn$_invoke$arity$1(event));
});
knoxx.backend.infra.agent.stream.handle_tool_execution_start_BANG_ = (function knoxx$backend$infra$agent$stream$handle_tool_execution_start_BANG_(state,_session,event){
var tool_name = new cljs.core.Keyword(null,"tool-name","tool-name",613742581).cljs$core$IFn$_invoke$arity$1(event);
var tool_call_id = knoxx.backend.infra.agent.stream.register_tool_call_start_BANG_(state,tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999).cljs$core$IFn$_invoke$arity$1(event));
var event__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(event,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),tool_call_id);
var guard = (function (){var G__28507 = cljs.core.deref(new cljs.core.Keyword(null,"tool-loop*","tool-loop*",1394428066).cljs$core$IFn$_invoke$arity$1(state));
var G__28509 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"tool-name","tool-name",613742581),tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),tool_call_id,new cljs.core.Keyword(null,"input-preview","input-preview",-811479635),new cljs.core.Keyword(null,"input-preview","input-preview",-811479635).cljs$core$IFn$_invoke$arity$1(event__$1),new cljs.core.Keyword(null,"aborting?","aborting?",690860697),cljs.core.deref(new cljs.core.Keyword(null,"aborting?","aborting?",690860697).cljs$core$IFn$_invoke$arity$1(state))], null);
return (knoxx.backend.domain.agent.turn_guards.observe_tool_call.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.turn_guards.observe_tool_call.cljs$core$IFn$_invoke$arity$2(G__28507,G__28509) : knoxx.backend.domain.agent.turn_guards.observe_tool_call.call(null,G__28507,G__28509));
})();
cljs.core.reset_BANG_(new cljs.core.Keyword(null,"tool-loop*","tool-loop*",1394428066).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"state","state",-1988618099).cljs$core$IFn$_invoke$arity$1(guard));

if(cljs.core.truth_(new cljs.core.Keyword(null,"abort?","abort?",2066246355).cljs$core$IFn$_invoke$arity$1(guard))){
var spiral_event_28681 = knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"death_spiral_detected",(function (){var G__28510 = new cljs.core.Keyword(null,"death-spiral","death-spiral",-1629510641);
var G__28511 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([event__$1,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"count","count",2139924085),new cljs.core.Keyword(null,"count","count",2139924085).cljs$core$IFn$_invoke$arity$1(guard),new cljs.core.Keyword(null,"streak","streak",1229213332),new cljs.core.Keyword(null,"streak","streak",1229213332).cljs$core$IFn$_invoke$arity$1(guard)], null)], 0));
return (knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2(G__28510,G__28511) : knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.call(null,G__28510,G__28511));
})());
knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),spiral_event_28681);

var G__28519_28685 = new cljs.core.Keyword(null,"reason","reason",-2070751759).cljs$core$IFn$_invoke$arity$1(guard);
var fexpr__28518_28686 = new cljs.core.Keyword(null,"abort!","abort!",-220883953).cljs$core$IFn$_invoke$arity$1(state);
(fexpr__28518_28686.cljs$core$IFn$_invoke$arity$1 ? fexpr__28518_28686.cljs$core$IFn$_invoke$arity$1(G__28519_28685) : fexpr__28518_28686.call(null,G__28519_28685));
} else {
}

var at = knoxx.backend.domain.time.now_iso();
var event__$2 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(event__$1,new cljs.core.Keyword(null,"at","at",1476951349),at);
var first_event_QMARK_ = knoxx.backend.infra.agent.stream.first_lifecycle_event_QMARK_(state,"tool_start",tool_call_id);
var tool_event = knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"tool_start",(knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"start","start",-355208981),event__$2) : knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.call(null,new cljs.core.Keyword(null,"start","start",-355208981),event__$2)));
knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),tool_call_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name], null),(function (p1__28498_SHARP_){
return (knoxx.backend.domain.agent.tool_lifecycle.start_receipt.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.start_receipt.cljs$core$IFn$_invoke$arity$2(p1__28498_SHARP_,event__$2) : knoxx.backend.domain.agent.tool_lifecycle.start_receipt.call(null,p1__28498_SHARP_,event__$2));
}));

if(first_event_QMARK_){
knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),(knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"start","start",-355208981),event__$2) : knoxx.backend.domain.agent.tool_lifecycle.trace_event.call(null,new cljs.core.Keyword(null,"start","start",-355208981),event__$2)));

return knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),tool_event);
} else {
return null;
}
});
knoxx.backend.infra.agent.stream.handle_tool_execution_update_BANG_ = (function knoxx$backend$infra$agent$stream$handle_tool_execution_update_BANG_(state,event){
var tool_name = new cljs.core.Keyword(null,"tool-name","tool-name",613742581).cljs$core$IFn$_invoke$arity$1(event);
var tool_call_id = (function (){var or__5162__auto__ = knoxx.backend.infra.agent.stream.active_tool_call_id(state,tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999).cljs$core$IFn$_invoke$arity$1(event));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(tool_name)+"-update");
}
})();
var preview = new cljs.core.Keyword(null,"preview","preview",451279890).cljs$core$IFn$_invoke$arity$1(event);
var at = knoxx.backend.domain.time.now_iso();
var event__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(event,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),tool_call_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"at","at",1476951349),at,new cljs.core.Keyword(null,"append-preview","append-preview",-448270901),(function (p1__28524_SHARP_,p2__28525_SHARP_){
return knoxx.backend.domain.action.run_state.append_limited(p1__28524_SHARP_,p2__28525_SHARP_,(8));
})], 0));
knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),tool_call_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name], null),(function (p1__28526_SHARP_){
return (knoxx.backend.domain.agent.tool_lifecycle.update_receipt.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.update_receipt.cljs$core$IFn$_invoke$arity$2(p1__28526_SHARP_,event__$1) : knoxx.backend.domain.agent.tool_lifecycle.update_receipt.call(null,p1__28526_SHARP_,event__$1));
}));

knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),(knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"update","update",1045576396),event__$1) : knoxx.backend.domain.agent.tool_lifecycle.trace_event.call(null,new cljs.core.Keyword(null,"update","update",1045576396),event__$1)));

if(cljs.core.truth_(preview)){
var tool_event = knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"tool_update",(knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"update","update",1045576396),event__$1) : knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.call(null,new cljs.core.Keyword(null,"update","update",1045576396),event__$1)));
return knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),tool_event);
} else {
return null;
}
});
knoxx.backend.infra.agent.stream.handle_tool_execution_end_BANG_ = (function knoxx$backend$infra$agent$stream$handle_tool_execution_end_BANG_(state,event){
var tool_name = new cljs.core.Keyword(null,"tool-name","tool-name",613742581).cljs$core$IFn$_invoke$arity$1(event);
var tool_call_id = (function (){var or__5162__auto__ = knoxx.backend.infra.agent.stream.active_tool_call_id(state,tool_name,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999).cljs$core$IFn$_invoke$arity$1(event));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var fexpr__28547 = new cljs.core.Keyword(null,"random-uuid!","random-uuid!",794889238).cljs$core$IFn$_invoke$arity$1(state);
return (fexpr__28547.cljs$core$IFn$_invoke$arity$0 ? fexpr__28547.cljs$core$IFn$_invoke$arity$0() : fexpr__28547.call(null));
}
})();
var at = knoxx.backend.domain.time.now_iso();
var event__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(event,new cljs.core.Keyword(null,"tool-call-id","tool-call-id",448649999),tool_call_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"at","at",1476951349),at], 0));
var first_event_QMARK_ = knoxx.backend.infra.agent.stream.first_lifecycle_event_QMARK_(state,"tool_end",tool_call_id);
var tool_event = knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"tool_end",(knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"end","end",-268185958),event__$1) : knoxx.backend.domain.agent.tool_lifecycle.run_event_extra.call(null,new cljs.core.Keyword(null,"end","end",-268185958),event__$1)));
knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),tool_call_id,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tool_name","tool_name",-42168484),tool_name], null),(function (p1__28546_SHARP_){
return (knoxx.backend.domain.agent.tool_lifecycle.end_receipt.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.end_receipt.cljs$core$IFn$_invoke$arity$2(p1__28546_SHARP_,event__$1) : knoxx.backend.domain.agent.tool_lifecycle.end_receipt.call(null,p1__28546_SHARP_,event__$1));
}));

if(first_event_QMARK_){
knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),(knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.domain.agent.tool_lifecycle.trace_event.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"end","end",-268185958),event__$1) : knoxx.backend.domain.agent.tool_lifecycle.trace_event.call(null,new cljs.core.Keyword(null,"end","end",-268185958),event__$1)));

return knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),tool_event);
} else {
return null;
}
});
knoxx.backend.infra.agent.stream.handle_turn_end_BANG_ = (function knoxx$backend$infra$agent$stream$handle_turn_end_BANG_(state,event){
var turn_event = knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"turn_end",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"tool_result_count","tool_result_count",-1860451143),new cljs.core.Keyword(null,"tool-result-count","tool-result-count",1416542362).cljs$core$IFn$_invoke$arity$1(event)], null));
return knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),turn_event);
});
knoxx.backend.infra.agent.stream.handle_agent_end_BANG_ = (function knoxx$backend$infra$agent$stream$handle_agent_end_BANG_(state,_event){
return knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_(knoxx.backend.infra.agent.stream.sinks.sink_or_default(state),knoxx.backend.domain.action.run_state.tool_event_payload(new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(state),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(state),"agent_end",new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed"], null)));
});
knoxx.backend.infra.agent.stream.build_subscribe_handler = (function knoxx$backend$infra$agent$stream$build_subscribe_handler(state,session){
var abort_BANG_ = (function (reason){
return knoxx.backend.infra.agent.stream.request_abort_BANG_(state,session,reason);
});
var state__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(state,new cljs.core.Keyword(null,"abort!","abort!",-220883953),abort_BANG_);
return (function (provider_event){
var event = knoxx.backend.infra.agent.stream.provider_events.normalize(provider_event);
var event_type = new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"message_update")){
return knoxx.backend.infra.agent.stream.handle_message_update_BANG_(state__$1,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"message_end")){
return knoxx.backend.infra.agent.stream.handle_message_end_BANG_(state__$1,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"tool_execution_start")){
return knoxx.backend.infra.agent.stream.handle_tool_execution_start_BANG_(state__$1,session,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"tool_execution_update")){
return knoxx.backend.infra.agent.stream.handle_tool_execution_update_BANG_(state__$1,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"tool_execution_end")){
return knoxx.backend.infra.agent.stream.handle_tool_execution_end_BANG_(state__$1,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"turn_end")){
return knoxx.backend.infra.agent.stream.handle_turn_end_BANG_(state__$1,event);
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(event_type,"agent_end")){
return knoxx.backend.infra.agent.stream.handle_agent_end_BANG_(state__$1,event);
} else {
return null;
}
}
}
}
}
}
}
});
});

//# sourceMappingURL=knoxx.backend.infra.agent.stream.js.map
