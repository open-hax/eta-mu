import "./cljs_env.js";
import "./cljs.core.js";
goog.provide('knoxx.backend.infra.agent.session_registry');

/**
 * @interface
 */
knoxx.backend.infra.agent.session_registry.IActiveSessionRegistry = function(){};

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$dyn_26672 = (function (registry,conversation_id){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.get_active_session_entry[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5520__auto__.call(null,registry,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.get_active_session_entry["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5518__auto__.call(null,registry,conversation_id));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.get-active-session-entry",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.get_active_session_entry = (function knoxx$backend$infra$agent$session_registry$get_active_session_entry(registry,conversation_id){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$arity$2 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$arity$2(registry,conversation_id);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$dyn_26672(registry,conversation_id);
}
});

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$dyn_26673 = (function (registry,conversation_id){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.get_active_session[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5520__auto__.call(null,registry,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.get_active_session["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5518__auto__.call(null,registry,conversation_id));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.get-active-session",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.get_active_session = (function knoxx$backend$infra$agent$session_registry$get_active_session(registry,conversation_id){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$arity$2 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$arity$2(registry,conversation_id);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$dyn_26673(registry,conversation_id);
}
});

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$dyn_26675 = (function (registry,conversation_id,entry){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.put_active_session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$3(registry,conversation_id,entry) : m__5520__auto__.call(null,registry,conversation_id,entry));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.put_active_session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$3 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$3(registry,conversation_id,entry) : m__5518__auto__.call(null,registry,conversation_id,entry));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.put-active-session!",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.put_active_session_BANG_ = (function knoxx$backend$infra$agent$session_registry$put_active_session_BANG_(registry,conversation_id,entry){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$arity$3 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$arity$3(registry,conversation_id,entry);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$dyn_26675(registry,conversation_id,entry);
}
});

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$touch_active_session_BANG_$dyn_26679 = (function (registry,conversation_id){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.touch_active_session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5520__auto__.call(null,registry,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.touch_active_session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5518__auto__.call(null,registry,conversation_id));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.touch-active-session!",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.touch_active_session_BANG_ = (function knoxx$backend$infra$agent$session_registry$touch_active_session_BANG_(registry,conversation_id){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$touch_active_session_BANG_$arity$2 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$touch_active_session_BANG_$arity$2(registry,conversation_id);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$touch_active_session_BANG_$dyn_26679(registry,conversation_id);
}
});

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$dyn_26682 = (function (registry,conversation_id){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.remove_active_session_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5520__auto__.call(null,registry,conversation_id));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.remove_active_session_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(registry,conversation_id) : m__5518__auto__.call(null,registry,conversation_id));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.remove-active-session!",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.remove_active_session_BANG_ = (function knoxx$backend$infra$agent$session_registry$remove_active_session_BANG_(registry,conversation_id){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$arity$2 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$arity$2(registry,conversation_id);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$dyn_26682(registry,conversation_id);
}
});

var knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$dyn_26683 = (function (registry,now_ms){
var x__5519__auto__ = (((registry == null))?null:registry);
var m__5520__auto__ = (knoxx.backend.infra.agent.session_registry.sweep_expired_sessions_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(registry,now_ms) : m__5520__auto__.call(null,registry,now_ms));
} else {
var m__5518__auto__ = (knoxx.backend.infra.agent.session_registry.sweep_expired_sessions_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(registry,now_ms) : m__5518__auto__.call(null,registry,now_ms));
} else {
throw cljs.core.missing_protocol("IActiveSessionRegistry.sweep-expired-sessions!",registry);
}
}
});
knoxx.backend.infra.agent.session_registry.sweep_expired_sessions_BANG_ = (function knoxx$backend$infra$agent$session_registry$sweep_expired_sessions_BANG_(registry,now_ms){
if((((!((registry == null)))) && ((!((registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$arity$2 == null)))))){
return registry.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$arity$2(registry,now_ms);
} else {
return knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$dyn_26683(registry,now_ms);
}
});

knoxx.backend.infra.agent.session_registry.default_max_sessions = (500);
knoxx.backend.infra.agent.session_registry.default_inactive_ttl_ms = ((((4) * (60)) * (60)) * (1000));
knoxx.backend.infra.agent.session_registry.evict_oldest_entry = (function knoxx$backend$infra$agent$session_registry$evict_oldest_entry(entries,max_sessions){
if((((max_sessions > (0))) && ((cljs.core.count(entries) > max_sessions)))){
var oldest = cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.min_key,cljs.core.comp.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549),cljs.core.val),entries);
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(entries,cljs.core.key(oldest));
} else {
return entries;
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {knoxx.backend.infra.agent.session_registry.IActiveSessionRegistry}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
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
knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry = (function (sessions_STAR_,max_sessions,inactive_ttl_ms,now_ms,__meta,__extmap,__hash){
this.sessions_STAR_ = sessions_STAR_;
this.max_sessions = max_sessions;
this.inactive_ttl_ms = inactive_ttl_ms;
this.now_ms = now_ms;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26544,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26558 = k26544;
var G__26558__$1 = (((G__26558 instanceof cljs.core.Keyword))?G__26558.fqn:null);
switch (G__26558__$1) {
case "sessions*":
return self__.sessions_STAR_;

break;
case "max-sessions":
return self__.max_sessions;

break;
case "inactive-ttl-ms":
return self__.inactive_ttl_ms;

break;
case "now-ms":
return self__.now_ms;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26544,else__5472__auto__);

}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26560){
var vec__26564 = p__26560;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26564,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26564,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.agent.session-registry.AtomActiveSessionRegistry{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"sessions*","sessions*",104615854),self__.sessions_STAR_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),self__.max_sessions],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),self__.inactive_ttl_ms],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"now-ms","now-ms",-641991870),self__.now_ms],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26543){
var self__ = this;
var G__26543__$1 = this;
return (new cljs.core.RecordIter((0),G__26543__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"sessions*","sessions*",104615854),new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),new cljs.core.Keyword(null,"now-ms","now-ms",-641991870)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,self__.inactive_ttl_ms,self__.now_ms,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (4 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (2111125609 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26545,other26546){
var self__ = this;
var this26545__$1 = this;
return (((!((other26546 == null)))) && ((((this26545__$1.constructor === other26546.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26545__$1.sessions_STAR_,other26546.sessions_STAR_)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26545__$1.max_sessions,other26546.max_sessions)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26545__$1.inactive_ttl_ms,other26546.inactive_ttl_ms)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26545__$1.now_ms,other26546.now_ms)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26545__$1.__extmap,other26546.__extmap)))))))))))));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(self__.sessions_STAR_),conversation_id);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session$arity$2 = (function (this$,conversation_id){
var self__ = this;
var this$__$1 = this;
return new cljs.core.Keyword(null,"session","session",1008279103).cljs$core$IFn$_invoke$arity$1(this$__$1.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$get_active_session_entry$arity$2(null,conversation_id));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$put_active_session_BANG_$arity$3 = (function (_,conversation_id,entry){
var self__ = this;
var ___$1 = this;
var timestamp = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (self__.now_ms.cljs$core$IFn$_invoke$arity$0 ? self__.now_ms.cljs$core$IFn$_invoke$arity$0() : self__.now_ms.call(null));
}
})();
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.sessions_STAR_,(function (entries){
return knoxx.backend.infra.agent.session_registry.evict_oldest_entry(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entries,conversation_id,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(entry,new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549),timestamp)),self__.max_sessions);
}));

return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(self__.sessions_STAR_),conversation_id);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$touch_active_session_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
var timestamp = (self__.now_ms.cljs$core$IFn$_invoke$arity$0 ? self__.now_ms.cljs$core$IFn$_invoke$arity$0() : self__.now_ms.call(null));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.sessions_STAR_,(function (entries){
if(cljs.core.contains_QMARK_(entries,conversation_id)){
return cljs.core.assoc_in(entries,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [conversation_id,new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549)], null),timestamp);
} else {
return entries;
}
}));

return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(self__.sessions_STAR_),conversation_id);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$remove_active_session_BANG_$arity$2 = (function (_,conversation_id){
var self__ = this;
var ___$1 = this;
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.sessions_STAR_,cljs.core.dissoc,conversation_id);

return null;
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.knoxx$backend$infra$agent$session_registry$IActiveSessionRegistry$sweep_expired_sessions_BANG_$arity$2 = (function (_,now_ms_value){
var self__ = this;
var ___$1 = this;
var cutoff = (now_ms_value - self__.inactive_ttl_ms);
var stale = (function (){var iter__5649__auto__ = (function knoxx$backend$infra$agent$session_registry$iter__26591(s__26592){
return (new cljs.core.LazySeq(null,(function (){
var s__26592__$1 = s__26592;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__26592__$1);
if(temp__5825__auto__){
var s__26592__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__26592__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__26592__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__26594 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__26593 = (0);
while(true){
if((i__26593 < size__5648__auto__)){
var vec__26607 = cljs.core._nth(c__5647__auto__,i__26593);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26607,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26607,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
cljs.core.chunk_append(b__26594,id);

var G__26695 = (i__26593 + (1));
i__26593 = G__26695;
continue;
} else {
var G__26696 = (i__26593 + (1));
i__26593 = G__26696;
continue;
}
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__26594),knoxx$backend$infra$agent$session_registry$iter__26591(cljs.core.chunk_rest(s__26592__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__26594),null);
}
} else {
var vec__26628 = cljs.core.first(s__26592__$2);
var id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26628,(0),null);
var entry = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26628,(1),null);
if(((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"last-accessed","last-accessed",-400877549).cljs$core$IFn$_invoke$arity$1(entry);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})() < cutoff)){
return cljs.core.cons(id,knoxx$backend$infra$agent$session_registry$iter__26591(cljs.core.rest(s__26592__$2)));
} else {
var G__26700 = cljs.core.rest(s__26592__$2);
s__26592__$1 = G__26700;
continue;
}
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.deref(self__.sessions_STAR_));
})();
if(cljs.core.seq(stale)){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(self__.sessions_STAR_,(function (p1__26542_SHARP_){
return cljs.core.apply.cljs$core$IFn$_invoke$arity$3(cljs.core.dissoc,p1__26542_SHARP_,stale);
}));
} else {
}

return cljs.core.vec(stale);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),null,new cljs.core.Keyword(null,"now-ms","now-ms",-641991870),null,new cljs.core.Keyword(null,"sessions*","sessions*",104615854),null,new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,self__.inactive_ttl_ms,self__.now_ms,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26544){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26639 = k26544;
var G__26639__$1 = (((G__26639 instanceof cljs.core.Keyword))?G__26639.fqn:null);
switch (G__26639__$1) {
case "sessions*":
case "max-sessions":
case "inactive-ttl-ms":
case "now-ms":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26544);

}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26543){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26644 = cljs.core.keyword_identical_QMARK_;
var expr__26645 = k__5478__auto__;
if(cljs.core.truth_((pred__26644.cljs$core$IFn$_invoke$arity$2 ? pred__26644.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"sessions*","sessions*",104615854),expr__26645) : pred__26644.call(null,new cljs.core.Keyword(null,"sessions*","sessions*",104615854),expr__26645)))){
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(G__26543,self__.max_sessions,self__.inactive_ttl_ms,self__.now_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26644.cljs$core$IFn$_invoke$arity$2 ? pred__26644.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),expr__26645) : pred__26644.call(null,new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),expr__26645)))){
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,G__26543,self__.inactive_ttl_ms,self__.now_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26644.cljs$core$IFn$_invoke$arity$2 ? pred__26644.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),expr__26645) : pred__26644.call(null,new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),expr__26645)))){
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,G__26543,self__.now_ms,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__26644.cljs$core$IFn$_invoke$arity$2 ? pred__26644.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"now-ms","now-ms",-641991870),expr__26645) : pred__26644.call(null,new cljs.core.Keyword(null,"now-ms","now-ms",-641991870),expr__26645)))){
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,self__.inactive_ttl_ms,G__26543,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,self__.inactive_ttl_ms,self__.now_ms,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26543),null));
}
}
}
}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"sessions*","sessions*",104615854),self__.sessions_STAR_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),self__.max_sessions,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),self__.inactive_ttl_ms,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"now-ms","now-ms",-641991870),self__.now_ms,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26543){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(self__.sessions_STAR_,self__.max_sessions,self__.inactive_ttl_ms,self__.now_ms,G__26543,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"sessions*","sessions*",1745147381,null),new cljs.core.Symbol(null,"max-sessions","max-sessions",-1514524951,null),new cljs.core.Symbol(null,"inactive-ttl-ms","inactive-ttl-ms",844449829,null),new cljs.core.Symbol(null,"now-ms","now-ms",998539657,null)], null);
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.cljs$lang$type = true);

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.agent.session-registry/AtomActiveSessionRegistry",null,(1),null));
}));

(knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.agent.session-registry/AtomActiveSessionRegistry");
}));

/**
 * Positional factory function for knoxx.backend.infra.agent.session-registry/AtomActiveSessionRegistry.
 */
knoxx.backend.infra.agent.session_registry.__GT_AtomActiveSessionRegistry = (function knoxx$backend$infra$agent$session_registry$__GT_AtomActiveSessionRegistry(sessions_STAR_,max_sessions,inactive_ttl_ms,now_ms){
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(sessions_STAR_,max_sessions,inactive_ttl_ms,now_ms,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.agent.session-registry/AtomActiveSessionRegistry, taking a map of keywords to field values.
 */
knoxx.backend.infra.agent.session_registry.map__GT_AtomActiveSessionRegistry = (function knoxx$backend$infra$agent$session_registry$map__GT_AtomActiveSessionRegistry(G__26548){
var extmap__5511__auto__ = (function (){var G__26665 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__26548,new cljs.core.Keyword(null,"sessions*","sessions*",104615854),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),new cljs.core.Keyword(null,"now-ms","now-ms",-641991870)], 0));
if(cljs.core.record_QMARK_(G__26548)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26665);
} else {
return G__26665;
}
})();
return (new knoxx.backend.infra.agent.session_registry.AtomActiveSessionRegistry(new cljs.core.Keyword(null,"sessions*","sessions*",104615854).cljs$core$IFn$_invoke$arity$1(G__26548),new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818).cljs$core$IFn$_invoke$arity$1(G__26548),new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698).cljs$core$IFn$_invoke$arity$1(G__26548),new cljs.core.Keyword(null,"now-ms","now-ms",-641991870).cljs$core$IFn$_invoke$arity$1(G__26548),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.infra.agent.session_registry.atom_registry = (function knoxx$backend$infra$agent$session_registry$atom_registry(var_args){
var G__26667 = arguments.length;
switch (G__26667) {
case 1:
return knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$1 = (function (sessions_STAR_){
return knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$2(sessions_STAR_,cljs.core.PersistentArrayMap.EMPTY);
}));

(knoxx.backend.infra.agent.session_registry.atom_registry.cljs$core$IFn$_invoke$arity$2 = (function (sessions_STAR_,p__26669){
var map__26670 = p__26669;
var map__26670__$1 = cljs.core.__destructure_map(map__26670);
var max_sessions = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__26670__$1,new cljs.core.Keyword(null,"max-sessions","max-sessions",1139910818),knoxx.backend.infra.agent.session_registry.default_max_sessions);
var inactive_ttl_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__26670__$1,new cljs.core.Keyword(null,"inactive-ttl-ms","inactive-ttl-ms",-796081698),knoxx.backend.infra.agent.session_registry.default_inactive_ttl_ms);
var now_ms = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26670__$1,new cljs.core.Keyword(null,"now-ms","now-ms",-641991870));
return knoxx.backend.infra.agent.session_registry.__GT_AtomActiveSessionRegistry(sessions_STAR_,max_sessions,inactive_ttl_ms,(function (){var or__5162__auto__ = now_ms;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (function (){
return Date.now();
});
}
})());
}));

(knoxx.backend.infra.agent.session_registry.atom_registry.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.agent.session_registry.js.map
