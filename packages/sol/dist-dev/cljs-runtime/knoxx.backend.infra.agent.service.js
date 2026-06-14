import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.infra.agent.recovery.js";
import "./knoxx.backend.infra.agent.runner.js";
import "./knoxx.backend.infra.agent.runtime.js";
import "./knoxx.backend.infra.agent.session.js";
import "./knoxx.backend.infra.agent.turn.js";
goog.provide('knoxx.backend.infra.agent.service');

/**
 * @interface
 */
knoxx.backend.infra.agent.service.IAgentService = function(){};

var knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$dyn_30590 = (function (svc,turn_request){
var x__5519__auto__ = (((svc == null))?null:svc);
var m__5520__auto__ = (knoxx.backend.infra.agent.service._start_turn_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(svc,turn_request) : m__5520__auto__.call(null,svc,turn_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.service._start_turn_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(svc,turn_request) : m__5518__auto__.call(null,svc,turn_request));
} else {
throw cljs.core.missing_protocol("IAgentService.-start-turn!",svc);
}
}
});
knoxx.backend.infra.agent.service._start_turn_BANG_ = (function knoxx$backend$infra$agent$service$_start_turn_BANG_(svc,turn_request){
if((((!((svc == null)))) && ((!((svc.knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$arity$2 == null)))))){
return svc.knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$arity$2(svc,turn_request);
} else {
return knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$dyn_30590(svc,turn_request);
}
});

var knoxx$backend$infra$agent$service$IAgentService$_queue_turn_BANG_$dyn_30594 = (function (svc,turn_request){
var x__5519__auto__ = (((svc == null))?null:svc);
var m__5520__auto__ = (knoxx.backend.infra.agent.service._queue_turn_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(svc,turn_request) : m__5520__auto__.call(null,svc,turn_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.service._queue_turn_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(svc,turn_request) : m__5518__auto__.call(null,svc,turn_request));
} else {
throw cljs.core.missing_protocol("IAgentService.-queue-turn!",svc);
}
}
});
knoxx.backend.infra.agent.service._queue_turn_BANG_ = (function knoxx$backend$infra$agent$service$_queue_turn_BANG_(svc,turn_request){
if((((!((svc == null)))) && ((!((svc.knoxx$backend$infra$agent$service$IAgentService$_queue_turn_BANG_$arity$2 == null)))))){
return svc.knoxx$backend$infra$agent$service$IAgentService$_queue_turn_BANG_$arity$2(svc,turn_request);
} else {
return knoxx$backend$infra$agent$service$IAgentService$_queue_turn_BANG_$dyn_30594(svc,turn_request);
}
});

var knoxx$backend$infra$agent$service$IAgentService$_control_turn_BANG_$dyn_30603 = (function (svc,control_request){
var x__5519__auto__ = (((svc == null))?null:svc);
var m__5520__auto__ = (knoxx.backend.infra.agent.service._control_turn_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(svc,control_request) : m__5520__auto__.call(null,svc,control_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.service._control_turn_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(svc,control_request) : m__5518__auto__.call(null,svc,control_request));
} else {
throw cljs.core.missing_protocol("IAgentService.-control-turn!",svc);
}
}
});
knoxx.backend.infra.agent.service._control_turn_BANG_ = (function knoxx$backend$infra$agent$service$_control_turn_BANG_(svc,control_request){
if((((!((svc == null)))) && ((!((svc.knoxx$backend$infra$agent$service$IAgentService$_control_turn_BANG_$arity$2 == null)))))){
return svc.knoxx$backend$infra$agent$service$IAgentService$_control_turn_BANG_$arity$2(svc,control_request);
} else {
return knoxx$backend$infra$agent$service$IAgentService$_control_turn_BANG_$dyn_30603(svc,control_request);
}
});

var knoxx$backend$infra$agent$service$IAgentService$_resume_turn_BANG_$dyn_30616 = (function (svc,recovery_request){
var x__5519__auto__ = (((svc == null))?null:svc);
var m__5520__auto__ = (knoxx.backend.infra.agent.service._resume_turn_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(svc,recovery_request) : m__5520__auto__.call(null,svc,recovery_request));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.service._resume_turn_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(svc,recovery_request) : m__5518__auto__.call(null,svc,recovery_request));
} else {
throw cljs.core.missing_protocol("IAgentService.-resume-turn!",svc);
}
}
});
knoxx.backend.infra.agent.service._resume_turn_BANG_ = (function knoxx$backend$infra$agent$service$_resume_turn_BANG_(svc,recovery_request){
if((((!((svc == null)))) && ((!((svc.knoxx$backend$infra$agent$service$IAgentService$_resume_turn_BANG_$arity$2 == null)))))){
return svc.knoxx$backend$infra$agent$service$IAgentService$_resume_turn_BANG_$arity$2(svc,recovery_request);
} else {
return knoxx$backend$infra$agent$service$IAgentService$_resume_turn_BANG_$dyn_30616(svc,recovery_request);
}
});

var knoxx$backend$infra$agent$service$IAgentService$_active_turn$dyn_30624 = (function (svc,conversation_id){
var x__5519__auto__ = (((svc == null))?null:svc);
var m__5520__auto__ = (knoxx.backend.infra.agent.service._active_turn[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(svc,conversation_id) : m__5520__auto__.call(null,svc,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.service._active_turn["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(svc,conversation_id) : m__5518__auto__.call(null,svc,conversation_id));
} else {
throw cljs.core.missing_protocol("IAgentService.-active-turn",svc);
}
}
});
knoxx.backend.infra.agent.service._active_turn = (function knoxx$backend$infra$agent$service$_active_turn(svc,conversation_id){
if((((!((svc == null)))) && ((!((svc.knoxx$backend$infra$agent$service$IAgentService$_active_turn$arity$2 == null)))))){
return svc.knoxx$backend$infra$agent$service$IAgentService$_active_turn$arity$2(svc,conversation_id);
} else {
return knoxx$backend$infra$agent$service$IAgentService$_active_turn$dyn_30624(svc,conversation_id);
}
});

/**
 * Await a start-turn promise and log/record any spawn error (fire-and-forget).
 */
knoxx.backend.infra.agent.service.record_async_spawn_error_BANG_ = (async function knoxx$backend$infra$agent$service$record_async_spawn_error_BANG_(start_turn_promise,turn_request){
try{return (await start_turn_promise);
}catch (e30148){var err = e30148;
return knoxx.backend.infra.agent.runner.log_and_record_async_spawn_error_BANG_(turn_request,err);
}});
knoxx.backend.infra.agent.service.accepted_response = (function knoxx$backend$infra$agent$service$accepted_response(turn_request){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"sessionId","sessionId",1640410629),new cljs.core.Keyword(null,"run_id","run_id",-556768024),new cljs.core.Keyword(null,"session_id","session_id",1584799627),new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),new cljs.core.Keyword(null,"queued","queued",1701634607),new cljs.core.Keyword(null,"runId","runId",505587730),new cljs.core.Keyword(null,"ok","ok",967785236),new cljs.core.Keyword(null,"conversationId","conversationId",-981028996),new cljs.core.Keyword(null,"model","model",331153215)],[new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(turn_request),new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(turn_request),new cljs.core.Keyword(null,"session-id","session-id",-1147060351).cljs$core$IFn$_invoke$arity$1(turn_request),new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(turn_request),true,new cljs.core.Keyword(null,"run-id","run-id",-1745267908).cljs$core$IFn$_invoke$arity$1(turn_request),true,new cljs.core.Keyword(null,"conversation-id","conversation-id",1220978913).cljs$core$IFn$_invoke$arity$1(turn_request),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"model","model",331153215).cljs$core$IFn$_invoke$arity$1(turn_request);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(turn_request,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"agent-spec","agent-spec",1796895541),new cljs.core.Keyword(null,"model","model",331153215)], null));
}
})()]);
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
 * @implements {knoxx.backend.infra.agent.service.IAgentService}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.infra.agent.service.KnoxxAgentService = (function (runtime,config,delegates,__meta,__extmap,__hash){
this.runtime = runtime;
this.config = config;
this.delegates = delegates;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k30169,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__30197 = k30169;
var G__30197__$1 = (((G__30197 instanceof cljs.core.Keyword))?G__30197.fqn:null);
switch (G__30197__$1) {
case "runtime":
return self__.runtime;

break;
case "config":
return self__.config;

break;
case "delegates":
return self__.delegates;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k30169,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__30208){
var vec__30209 = p__30208;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30209,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30209,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$arity$2 = (function (_,turn_request){
var self__ = this;
var ___$1 = this;
var fexpr__30219 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"start-turn!","start-turn!",1447002892).cljs$core$IFn$_invoke$arity$1(self__.delegates);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.agent.turn.send_agent_turn_BANG_;
}
})();
return (fexpr__30219.cljs$core$IFn$_invoke$arity$3 ? fexpr__30219.cljs$core$IFn$_invoke$arity$3(self__.runtime,self__.config,turn_request) : fexpr__30219.call(null,self__.runtime,self__.config,turn_request));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$_queue_turn_BANG_$arity$2 = (function (this$,turn_request){
var self__ = this;
var this$__$1 = this;
var temp__5823__auto__ = new cljs.core.Keyword(null,"queue-turn!","queue-turn!",2029349768).cljs$core$IFn$_invoke$arity$1(self__.delegates);
if(cljs.core.truth_(temp__5823__auto__)){
var queue_fn = temp__5823__auto__;
return (queue_fn.cljs$core$IFn$_invoke$arity$3 ? queue_fn.cljs$core$IFn$_invoke$arity$3(self__.runtime,self__.config,turn_request) : queue_fn.call(null,self__.runtime,self__.config,turn_request));
} else {
knoxx.backend.infra.agent.service.record_async_spawn_error_BANG_(this$__$1.knoxx$backend$infra$agent$service$IAgentService$_start_turn_BANG_$arity$2(null,turn_request),turn_request);

return Promise.resolve(knoxx.backend.infra.agent.service.accepted_response(turn_request));
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$_control_turn_BANG_$arity$2 = (function (_,control_request){
var self__ = this;
var ___$1 = this;
var fexpr__30258 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"control-turn!","control-turn!",13698763).cljs$core$IFn$_invoke$arity$1(self__.delegates);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.agent.runtime.queue_agent_control_BANG_;
}
})();
return (fexpr__30258.cljs$core$IFn$_invoke$arity$3 ? fexpr__30258.cljs$core$IFn$_invoke$arity$3(self__.runtime,self__.config,control_request) : fexpr__30258.call(null,self__.runtime,self__.config,control_request));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$_resume_turn_BANG_$arity$2 = (function (_,recovery_request){
var self__ = this;
var ___$1 = this;
var resume_fn = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"resume-turn!","resume-turn!",533773154).cljs$core$IFn$_invoke$arity$1(self__.delegates);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.agent.recovery.resume_recovered_session_BANG_;
}
})();
var session = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(recovery_request);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return recovery_request;
}
})();
var opts = new cljs.core.Keyword(null,"opts","opts",155075701).cljs$core$IFn$_invoke$arity$1(recovery_request);
if(cljs.core.truth_(opts)){
return (resume_fn.cljs$core$IFn$_invoke$arity$4 ? resume_fn.cljs$core$IFn$_invoke$arity$4(self__.runtime,self__.config,session,opts) : resume_fn.call(null,self__.runtime,self__.config,session,opts));
} else {
return (resume_fn.cljs$core$IFn$_invoke$arity$3 ? resume_fn.cljs$core$IFn$_invoke$arity$3(self__.runtime,self__.config,session) : resume_fn.call(null,self__.runtime,self__.config,session));
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.knoxx$backend$infra$agent$service$IAgentService$_active_turn$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
var temp__5823__auto__ = new cljs.core.Keyword(null,"active-turn","active-turn",-1932601467).cljs$core$IFn$_invoke$arity$1(self__.delegates);
if(cljs.core.truth_(temp__5823__auto__)){
var active_fn = temp__5823__auto__;
return (active_fn.cljs$core$IFn$_invoke$arity$1 ? active_fn.cljs$core$IFn$_invoke$arity$1(conversation_id) : active_fn.call(null,conversation_id));
} else {
return knoxx.backend.infra.agent.session.active_agent_session(conversation_id);
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.service.KnoxxAgentService{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"delegates","delegates",790332179),self__.delegates],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__30168){
var self__ = this;
var G__30168__$1 = this;
return (new cljs.core.RecordIter((0),G__30168__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"runtime","runtime",-1331573996),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"delegates","delegates",790332179)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,self__.config,self__.delegates,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (990441216 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this30170,other30171){
var self__ = this;
var this30170__$1 = this;
return (((!((other30171 == null)))) && ((((this30170__$1.constructor === other30171.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30170__$1.runtime,other30171.runtime)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30170__$1.config,other30171.config)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30170__$1.delegates,other30171.delegates)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30170__$1.__extmap,other30171.__extmap)))))))))));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"config","config",994861415),null,new cljs.core.Keyword(null,"delegates","delegates",790332179),null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,self__.config,self__.delegates,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k30169){
var self__ = this;
var this__5476__auto____$1 = this;
var G__30354 = k30169;
var G__30354__$1 = (((G__30354 instanceof cljs.core.Keyword))?G__30354.fqn:null);
switch (G__30354__$1) {
case "runtime":
case "config":
case "delegates":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k30169);

}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__30168){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__30365 = cljs.core.keyword_identical_QMARK_;
var expr__30366 = k__5478__auto__;
if(cljs.core.truth_((pred__30365.cljs$core$IFn$_invoke$arity$2 ? pred__30365.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__30366) : pred__30365.call(null,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),expr__30366)))){
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(G__30168,self__.config,self__.delegates,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__30365.cljs$core$IFn$_invoke$arity$2 ? pred__30365.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__30366) : pred__30365.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__30366)))){
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,G__30168,self__.delegates,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__30365.cljs$core$IFn$_invoke$arity$2 ? pred__30365.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"delegates","delegates",790332179),expr__30366) : pred__30365.call(null,new cljs.core.Keyword(null,"delegates","delegates",790332179),expr__30366)))){
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,self__.config,G__30168,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,self__.config,self__.delegates,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__30168),null));
}
}
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"runtime","runtime",-1331573996),self__.runtime,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"delegates","delegates",790332179),self__.delegates,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__30168){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(self__.runtime,self__.config,self__.delegates,G__30168,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"runtime","runtime",308957531,null),new cljs.core.Symbol(null,"config","config",-1659574354,null),new cljs.core.Symbol(null,"delegates","delegates",-1864103590,null)], null);
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.cljs$lang$type = true);

(knoxx.backend.infra.agent.service.KnoxxAgentService.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.service/KnoxxAgentService",null,(1),null));
}));

(knoxx.backend.infra.agent.service.KnoxxAgentService.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.service/KnoxxAgentService");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.service/KnoxxAgentService.
 */
knoxx.backend.infra.agent.service.__GT_KnoxxAgentService = (function knoxx$backend$infra$agent$service$__GT_KnoxxAgentService(runtime,config,delegates){
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(runtime,config,delegates,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.service/KnoxxAgentService, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.service.map__GT_KnoxxAgentService = (function knoxx$backend$infra$agent$service$map__GT_KnoxxAgentService(G__30181){
var extmap__5511__auto__ = (function (){var G__30401 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__30181,new cljs.core.Keyword(null,"runtime","runtime",-1331573996),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"delegates","delegates",790332179)], 0));
if(cljs.core.record_QMARK_(G__30181)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__30401);
} else {
return G__30401;
}
})();
return (new knoxx.backend.infra.agent.service.KnoxxAgentService(new cljs.core.Keyword(null,"runtime","runtime",-1331573996).cljs$core$IFn$_invoke$arity$1(G__30181),new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__30181),new cljs.core.Keyword(null,"delegates","delegates",790332179).cljs$core$IFn$_invoke$arity$1(G__30181),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.service.agent_service = (function knoxx$backend$infra$agent$service$agent_service(var_args){
var G__30406 = arguments.length;
switch (G__30406) {
case 2:
return knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$3(runtime,config,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,delegates){
return knoxx.backend.infra.agent.service.__GT_KnoxxAgentService(runtime,config,(function (){var or__5162__auto__ = delegates;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
}));

(knoxx.backend.infra.agent.service.agent_service.cljs$lang$maxFixedArity = 3);

if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.agent !== 'undefined') && (typeof knoxx.backend.infra.agent.service !== 'undefined') && (typeof knoxx.backend.infra.agent.service.default_service_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.agent.service.default_service_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.agent.service.set_default_service_BANG_ = (function knoxx$backend$infra$agent$service$set_default_service_BANG_(svc){
cljs.core.reset_BANG_(knoxx.backend.infra.agent.service.default_service_STAR_,svc);

return svc;
});
knoxx.backend.infra.agent.service.default_service = (function knoxx$backend$infra$agent$service$default_service(){
var or__5162__auto__ = cljs.core.deref(knoxx.backend.infra.agent.service.default_service_STAR_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw (new Error("No default Knoxx agent service configured"));
}
});
knoxx.backend.infra.agent.service.start_turn_runtime_BANG_ = (function knoxx$backend$infra$agent$service$start_turn_runtime_BANG_(runtime,config,turn_request){
return knoxx.backend.infra.agent.service._start_turn_BANG_(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(runtime,config),turn_request);
});
knoxx.backend.infra.agent.service.queue_turn_runtime_BANG_ = (function knoxx$backend$infra$agent$service$queue_turn_runtime_BANG_(runtime,config,turn_request){
return knoxx.backend.infra.agent.service._queue_turn_BANG_(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(runtime,config),turn_request);
});
knoxx.backend.infra.agent.service.control_turn_runtime_BANG_ = (function knoxx$backend$infra$agent$service$control_turn_runtime_BANG_(runtime,config,control_request){
return knoxx.backend.infra.agent.service._control_turn_BANG_(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(runtime,config),control_request);
});
knoxx.backend.infra.agent.service.resume_turn_runtime_BANG_ = (function knoxx$backend$infra$agent$service$resume_turn_runtime_BANG_(runtime,config,recovery_request){
return knoxx.backend.infra.agent.service._resume_turn_BANG_(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(runtime,config),recovery_request);
});
knoxx.backend.infra.agent.service.start_turn_BANG_ = (function knoxx$backend$infra$agent$service$start_turn_BANG_(var_args){
var G__30469 = arguments.length;
switch (G__30469) {
case 1:
return knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (turn_request){
return knoxx.backend.infra.agent.service._start_turn_BANG_(knoxx.backend.infra.agent.service.default_service(),turn_request);
}));

(knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (svc,turn_request){
return knoxx.backend.infra.agent.service._start_turn_BANG_(svc,turn_request);
}));

(knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,turn_request){
return knoxx.backend.infra.agent.service.start_turn_runtime_BANG_(runtime,config,turn_request);
}));

(knoxx.backend.infra.agent.service.start_turn_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.service.queue_turn_BANG_ = (function knoxx$backend$infra$agent$service$queue_turn_BANG_(var_args){
var G__30490 = arguments.length;
switch (G__30490) {
case 1:
return knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (turn_request){
return knoxx.backend.infra.agent.service._queue_turn_BANG_(knoxx.backend.infra.agent.service.default_service(),turn_request);
}));

(knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (svc,turn_request){
return knoxx.backend.infra.agent.service._queue_turn_BANG_(svc,turn_request);
}));

(knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,turn_request){
return knoxx.backend.infra.agent.service.queue_turn_runtime_BANG_(runtime,config,turn_request);
}));

(knoxx.backend.infra.agent.service.queue_turn_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.service.control_turn_BANG_ = (function knoxx$backend$infra$agent$service$control_turn_BANG_(var_args){
var G__30500 = arguments.length;
switch (G__30500) {
case 1:
return knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (control_request){
return knoxx.backend.infra.agent.service._control_turn_BANG_(knoxx.backend.infra.agent.service.default_service(),control_request);
}));

(knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (svc,control_request){
return knoxx.backend.infra.agent.service._control_turn_BANG_(svc,control_request);
}));

(knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,control_request){
return knoxx.backend.infra.agent.service.control_turn_runtime_BANG_(runtime,config,control_request);
}));

(knoxx.backend.infra.agent.service.control_turn_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.service.resume_turn_BANG_ = (function knoxx$backend$infra$agent$service$resume_turn_BANG_(var_args){
var G__30518 = arguments.length;
switch (G__30518) {
case 1:
return knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$1 = (function (recovery_request){
return knoxx.backend.infra.agent.service._resume_turn_BANG_(knoxx.backend.infra.agent.service.default_service(),recovery_request);
}));

(knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (svc,recovery_request){
return knoxx.backend.infra.agent.service._resume_turn_BANG_(svc,recovery_request);
}));

(knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,recovery_request){
return knoxx.backend.infra.agent.service.resume_turn_runtime_BANG_(runtime,config,recovery_request);
}));

(knoxx.backend.infra.agent.service.resume_turn_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.service.active_turn = (function knoxx$backend$infra$agent$service$active_turn(var_args){
var G__30529 = arguments.length;
switch (G__30529) {
case 1:
return knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$1 = (function (conversation_id){
return knoxx.backend.infra.agent.service._active_turn(knoxx.backend.infra.agent.service.default_service(),conversation_id);
}));

(knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$2 = (function (svc,conversation_id){
return knoxx.backend.infra.agent.service._active_turn(svc,conversation_id);
}));

(knoxx.backend.infra.agent.service.active_turn.cljs$core$IFn$_invoke$arity$3 = (function (_runtime,_config,conversation_id){
return knoxx.backend.infra.agent.service._active_turn(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(_runtime,_config),conversation_id);
}));

(knoxx.backend.infra.agent.service.active_turn.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.agent.service.send_agent_turn_BANG_ = (function knoxx$backend$infra$agent$service$send_agent_turn_BANG_(runtime,config,turn_request){
return knoxx.backend.infra.agent.service.start_turn_runtime_BANG_(runtime,config,turn_request);
});
knoxx.backend.infra.agent.service.queue_agent_control_BANG_ = (function knoxx$backend$infra$agent$service$queue_agent_control_BANG_(runtime,config,control_request){
return knoxx.backend.infra.agent.service.control_turn_runtime_BANG_(runtime,config,control_request);
});
knoxx.backend.infra.agent.service.resume_recovered_session_BANG_ = (function knoxx$backend$infra$agent$service$resume_recovered_session_BANG_(var_args){
var G__30561 = arguments.length;
switch (G__30561) {
case 3:
return knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,recovered_session){
return knoxx.backend.infra.agent.service.resume_turn_runtime_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"session","session",1008279103),recovered_session], null));
}));

(knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,recovered_session,opts){
return knoxx.backend.infra.agent.service.resume_turn_runtime_BANG_(runtime,config,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"session","session",1008279103),recovered_session,new cljs.core.Keyword(null,"opts","opts",155075701),opts], null));
}));

(knoxx.backend.infra.agent.service.resume_recovered_session_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.agent.service.active_agent_session = (function knoxx$backend$infra$agent$service$active_agent_session(conversation_id){
return knoxx.backend.infra.agent.service._active_turn(knoxx.backend.infra.agent.service.agent_service.cljs$core$IFn$_invoke$arity$2(null,null),conversation_id);
});
knoxx.backend.infra.agent.service.spawn_direct_BANG_ = (function knoxx$backend$infra$agent$service$spawn_direct_BANG_(var_args){
var G__30576 = arguments.length;
switch (G__30576) {
case 2:
return knoxx.backend.infra.agent.service.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.agent.service.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.service.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (config,payload){
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$2(config,payload);
}));

(knoxx.backend.infra.agent.service.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,payload){
return knoxx.backend.infra.agent.runner.spawn_direct_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,payload);
}));

(knoxx.backend.infra.agent.service.spawn_direct_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.agent.service.js.map
