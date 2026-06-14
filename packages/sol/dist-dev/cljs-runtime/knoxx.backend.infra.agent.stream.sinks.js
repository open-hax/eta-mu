import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.domain.action.run_state.js";
import "./knoxx.backend.domain.realtime.js";
import "./knoxx.backend.infra.stores.mongo_session_store.js";
goog.provide('knoxx.backend.infra.agent.stream.sinks');

/**
 * @interface
 */
knoxx.backend.infra.agent.stream.sinks.IRunEventSink = function(){};

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$dyn_28287 = (function (sink,run_event){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(sink,run_event) : m__5520__auto__.call(null,sink,run_event));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(sink,run_event) : m__5518__auto__.call(null,sink,run_event));
} else {
throw cljs.core.missing_protocol("IRunEventSink.emit-run-event!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.emit_run_event_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$emit_run_event_BANG_(sink,run_event){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$arity$2 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$arity$2(sink,run_event);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$dyn_28287(sink,run_event);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_token_event_BANG_$dyn_28288 = (function (sink,token_event){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.emit_token_event_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(sink,token_event) : m__5520__auto__.call(null,sink,token_event));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.emit_token_event_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(sink,token_event) : m__5518__auto__.call(null,sink,token_event));
} else {
throw cljs.core.missing_protocol("IRunEventSink.emit-token-event!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.emit_token_event_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$emit_token_event_BANG_(sink,token_event){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_token_event_BANG_$arity$2 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_token_event_BANG_$arity$2(sink,token_event);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_token_event_BANG_$dyn_28288(sink,token_event);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_run_state_BANG_$dyn_28289 = (function (sink,run_id,update_fn){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_run_state_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(sink,run_id,update_fn) : m__5520__auto__.call(null,sink,run_id,update_fn));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_run_state_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(sink,run_id,update_fn) : m__5518__auto__.call(null,sink,run_id,update_fn));
} else {
throw cljs.core.missing_protocol("IRunEventSink.update-run-state!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.update_run_state_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$update_run_state_BANG_(sink,run_id,update_fn){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_run_state_BANG_$arity$3 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_run_state_BANG_$arity$3(sink,run_id,update_fn);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_run_state_BANG_$dyn_28289(sink,run_id,update_fn);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_session_record_BANG_$dyn_28292 = (function (sink,session_id,update){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_session_record_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(sink,session_id,update) : m__5520__auto__.call(null,sink,session_id,update));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_session_record_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(sink,session_id,update) : m__5518__auto__.call(null,sink,session_id,update));
} else {
throw cljs.core.missing_protocol("IRunEventSink.update-session-record!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.update_session_record_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$update_session_record_BANG_(sink,session_id,update){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_session_record_BANG_$arity$3 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_session_record_BANG_$arity$3(sink,session_id,update);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_session_record_BANG_$dyn_28292(sink,session_id,update);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$finalize_run_BANG_$dyn_28303 = (function (sink,result){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.finalize_run_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(sink,result) : m__5520__auto__.call(null,sink,result));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.finalize_run_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(sink,result) : m__5518__auto__.call(null,sink,result));
} else {
throw cljs.core.missing_protocol("IRunEventSink.finalize-run!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.finalize_run_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$finalize_run_BANG_(sink,result){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$finalize_run_BANG_$arity$2 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$finalize_run_BANG_$arity$2(sink,result);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$finalize_run_BANG_$dyn_28303(sink,result);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$record_run_error_BANG_$dyn_28305 = (function (sink,error_event){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.record_run_error_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(sink,error_event) : m__5520__auto__.call(null,sink,error_event));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.record_run_error_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(sink,error_event) : m__5518__auto__.call(null,sink,error_event));
} else {
throw cljs.core.missing_protocol("IRunEventSink.record-run-error!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.record_run_error_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$record_run_error_BANG_(sink,error_event){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$record_run_error_BANG_$arity$2 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$record_run_error_BANG_$arity$2(sink,error_event);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$record_run_error_BANG_$dyn_28305(sink,error_event);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$append_trace_text_BANG_$dyn_28307 = (function (sink,run_id,kind,delta,at){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.append_trace_text_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,kind,delta,at) : m__5520__auto__.call(null,sink,run_id,kind,delta,at));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.append_trace_text_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,kind,delta,at) : m__5518__auto__.call(null,sink,run_id,kind,delta,at));
} else {
throw cljs.core.missing_protocol("IRunEventSink.append-trace-text!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.append_trace_text_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$append_trace_text_BANG_(sink,run_id,kind,delta,at){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$append_trace_text_BANG_$arity$5 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$append_trace_text_BANG_$arity$5(sink,run_id,kind,delta,at);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$append_trace_text_BANG_$dyn_28307(sink,run_id,kind,delta,at);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_tool_receipt_BANG_$dyn_28311 = (function (sink,run_id,receipt_id,default_receipt,update_fn){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,receipt_id,default_receipt,update_fn) : m__5520__auto__.call(null,sink,run_id,receipt_id,default_receipt,update_fn));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,receipt_id,default_receipt,update_fn) : m__5518__auto__.call(null,sink,run_id,receipt_id,default_receipt,update_fn));
} else {
throw cljs.core.missing_protocol("IRunEventSink.update-tool-receipt!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.update_tool_receipt_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$update_tool_receipt_BANG_(sink,run_id,receipt_id,default_receipt,update_fn){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_tool_receipt_BANG_$arity$5 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_tool_receipt_BANG_$arity$5(sink,run_id,receipt_id,default_receipt,update_fn);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_tool_receipt_BANG_$dyn_28311(sink,run_id,receipt_id,default_receipt,update_fn);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$apply_tool_trace_event_BANG_$dyn_28314 = (function (sink,run_id,trace_event){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(sink,run_id,trace_event) : m__5520__auto__.call(null,sink,run_id,trace_event));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(sink,run_id,trace_event) : m__5518__auto__.call(null,sink,run_id,trace_event));
} else {
throw cljs.core.missing_protocol("IRunEventSink.apply-tool-trace-event!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.apply_tool_trace_event_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$apply_tool_trace_event_BANG_(sink,run_id,trace_event){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$apply_tool_trace_event_BANG_$arity$3 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$apply_tool_trace_event_BANG_$arity$3(sink,run_id,trace_event);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$apply_tool_trace_event_BANG_$dyn_28314(sink,run_id,trace_event);
}
});

var knoxx$backend$infra$agent$stream$sinks$IRunEventSink$backfill_tool_input_preview_BANG_$dyn_28315 = (function (sink,run_id,receipt_id,tool_name,input_preview){
var x__5519__auto__ = (((sink == null))?null:sink);
var m__5520__auto__ = (knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,receipt_id,tool_name,input_preview) : m__5520__auto__.call(null,sink,run_id,receipt_id,tool_name,input_preview));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$5 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$5(sink,run_id,receipt_id,tool_name,input_preview) : m__5518__auto__.call(null,sink,run_id,receipt_id,tool_name,input_preview));
} else {
throw cljs.core.missing_protocol("IRunEventSink.backfill-tool-input-preview!",sink);
}
}
});
knoxx.backend.infra.agent.stream.sinks.backfill_tool_input_preview_BANG_ = (function knoxx$backend$infra$agent$stream$sinks$backfill_tool_input_preview_BANG_(sink,run_id,receipt_id,tool_name,input_preview){
if((((!((sink == null)))) && ((!((sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$backfill_tool_input_preview_BANG_$arity$5 == null)))))){
return sink.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$backfill_tool_input_preview_BANG_$arity$5(sink,run_id,receipt_id,tool_name,input_preview);
} else {
return knoxx$backend$infra$agent$stream$sinks$IRunEventSink$backfill_tool_input_preview_BANG_$dyn_28315(sink,run_id,receipt_id,tool_name,input_preview);
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
 * @implements {cljs.core.ISeqable}
 * @implements {cljs.core.IMeta}
 * @implements {cljs.core.ICloneable}
 * @implements {knoxx.backend.infra.agent.stream.sinks.IRunEventSink}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink = (function (__meta,__extmap,__hash){
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k28107,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__28136 = k28107;
switch (G__28136) {
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k28107,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__28148){
var vec__28151 = p__28148;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28151,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__28151,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__28106){
var self__ = this;
var G__28106__$1 = this;
return (new cljs.core.RecordIter((0),G__28106__$1,0,cljs.core.PersistentVector.EMPTY,(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (0 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1425176170 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this28108,other28109){
var self__ = this;
var this28108__$1 = this;
return (((!((other28109 == null)))) && ((((this28108__$1.constructor === other28109.constructor)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this28108__$1.__extmap,other28109.__extmap)))));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$finalize_run_BANG_$arity$2 = (function (_,result){
var self__ = this;
var ___$1 = this;
return result;
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$backfill_tool_input_preview_BANG_$arity$5 = (function (_,run_id,receipt_id,tool_name,input_preview){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.action.run_state.backfill_run_tool_input_preview_BANG_(run_id,receipt_id,tool_name,input_preview);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$record_run_error_BANG_$arity$2 = (function (this$,error_event){
var self__ = this;
var this$__$1 = this;
return this$__$1.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$arity$2(null,error_event);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_run_event_BANG_$arity$2 = (function (_,run_event){
var self__ = this;
var ___$1 = this;
knoxx.backend.domain.action.run_state.append_run_event_BANG_(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run_event),run_event);

return knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run_event),"events",run_event);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_run_state_BANG_$arity$3 = (function (_,run_id,update_fn){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.action.run_state.update_run_BANG_(run_id,update_fn);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_tool_receipt_BANG_$arity$5 = (function (_,run_id,receipt_id,default_receipt,update_fn){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.action.run_state.update_run_tool_receipt_BANG_(run_id,receipt_id,default_receipt,update_fn);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$emit_token_event_BANG_$arity$2 = (function (_,token_event){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.realtime.broadcast_ws_session_BANG_(new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(token_event),"tokens",token_event);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$append_trace_text_BANG_$arity$5 = (function (_,run_id,kind,delta,at){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.action.run_state.append_run_trace_text_BANG_(run_id,kind,delta,at);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$apply_tool_trace_event_BANG_$arity$3 = (function (_,run_id,trace_event){
var self__ = this;
var ___$1 = this;
return knoxx.backend.domain.action.run_state.apply_run_tool_trace_event_BANG_(run_id,trace_event);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.knoxx$backend$infra$agent$stream$sinks$IRunEventSink$update_session_record_BANG_$arity$3 = (function (_,session_id,update){
var self__ = this;
var ___$1 = this;
var G__28212 = new cljs.core.Keyword(null,"op","op",-1882987955).cljs$core$IFn$_invoke$arity$1(update);
var G__28212__$1 = (((G__28212 instanceof cljs.core.Keyword))?G__28212.fqn:null);
switch (G__28212__$1) {
case "mark-streaming":
return knoxx.backend.infra.stores.mongo_session_store.mark_session_streaming_BANG_.cljs$core$IFn$_invoke$arity$2(session_id,new cljs.core.Keyword(null,"active?","active?",459499776).cljs$core$IFn$_invoke$arity$1(update));

break;
default:
return null;

}
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(cljs.core.PersistentHashSet.EMPTY,k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k28107){
var self__ = this;
var this__5476__auto____$1 = this;
return cljs.core.contains_QMARK_(self__.__extmap,k28107);
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__28106){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__28231 = cljs.core.keyword_identical_QMARK_;
var expr__28232 = k__5478__auto__;
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__28106),null));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentVector.EMPTY,self__.__extmap));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__28106){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(G__28106,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.getBasis = (function (){
return cljs.core.PersistentVector.EMPTY;
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.cljs$lang$type = true);

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.stream.sinks/LiveRunEventSink",null,(1),null));
}));

(knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.stream.sinks/LiveRunEventSink");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.stream.sinks/LiveRunEventSink.
 */
knoxx.backend.infra.agent.stream.sinks.__GT_LiveRunEventSink = (function knoxx$backend$infra$agent$stream$sinks$__GT_LiveRunEventSink(){
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.stream.sinks/LiveRunEventSink, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.stream.sinks.map__GT_LiveRunEventSink = (function knoxx$backend$infra$agent$stream$sinks$map__GT_LiveRunEventSink(G__28110){
var extmap__5511__auto__ = (function (){var G__28261 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$1(G__28110);
if(cljs.core.record_QMARK_(G__28110)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__28261);
} else {
return G__28261;
}
})();
return (new knoxx.backend.infra.agent.stream.sinks.LiveRunEventSink(null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.stream.sinks.live_run_event_sink = (function knoxx$backend$infra$agent$stream$sinks$live_run_event_sink(){
return knoxx.backend.infra.agent.stream.sinks.__GT_LiveRunEventSink();
});
knoxx.backend.infra.agent.stream.sinks.sink_or_default = (function knoxx$backend$infra$agent$stream$sinks$sink_or_default(state){
var or__5162__auto__ = new cljs.core.Keyword(null,"run-event-sink","run-event-sink",16548043).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.agent.stream.sinks.live_run_event_sink();
}
});

//# sourceMappingURL=knoxx.backend.infra.agent.stream.sinks.js.map
