import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.cljs.modern.js";
import "./clojure.string.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./knoxx.backend.infra.clients.openplanner.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.stores.openplanner_session_store');
knoxx.backend.infra.stores.openplanner_session_store.normalize_content_part_for_event = (function knoxx$backend$infra$stores$openplanner_session_store$normalize_content_part_for_event(p){
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("image",new cljs.core.Keyword(null,"type","type",1174270348).cljs$core$IFn$_invoke$arity$1(p))) && (((clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"url","url",276297046).cljs$core$IFn$_invoke$arity$1(p))) && ((!(clojure.string.blank_QMARK_(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p))))))))){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"type","type",1174270348),"image",new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"data","data",-232669377),cljs.core.subs.cljs$core$IFn$_invoke$arity$3((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p))),(0),cljs.core.min.cljs$core$IFn$_invoke$arity$2((2048),(((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"data","data",-232669377).cljs$core$IFn$_invoke$arity$1(p)))).length))),new cljs.core.Keyword(null,"truncated","truncated",298102102),true], null);
} else {
return cljs.core.select_keys(p,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"type","type",1174270348),new cljs.core.Keyword(null,"url","url",276297046),new cljs.core.Keyword(null,"mimeType","mimeType",-995071690),new cljs.core.Keyword(null,"filename","filename",-1428840783),new cljs.core.Keyword(null,"text","text",-1790561697)], null));
}
});
knoxx.backend.infra.stores.openplanner_session_store.user_event_extra = (function knoxx$backend$infra$stores$openplanner_session_store$user_event_extra(scope,content_parts){
var G__37566 = scope;
if(cljs.core.seq(content_parts)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__37566,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.openplanner_session_store.normalize_content_part_for_event,content_parts));
} else {
return G__37566;
}
});
knoxx.backend.infra.stores.openplanner_session_store.user_message_event = (function knoxx$backend$infra$stores$openplanner_session_store$user_message_event(mk_fn,scope,request_text,run){
if(clojure.string.blank_QMARK_(request_text)){
return null;
} else {
var G__37574 = "knoxx.message";
var G__37575 = "user";
var G__37576 = request_text;
var G__37577 = knoxx.backend.infra.stores.openplanner_session_store.user_event_extra(scope,new cljs.core.Keyword(null,"content_parts","content_parts",-2046424667).cljs$core$IFn$_invoke$arity$1(run));
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37574,G__37575,G__37576,G__37577) : mk_fn.call(null,G__37574,G__37575,G__37576,G__37577));
}
});
knoxx.backend.infra.stores.openplanner_session_store.assistant_message_event = (function knoxx$backend$infra$stores$openplanner_session_store$assistant_message_event(mk_fn,answer,status){
if(clojure.string.blank_QMARK_(answer)){
return null;
} else {
var G__37579 = "knoxx.message";
var G__37580 = "assistant";
var G__37581 = answer;
var G__37582 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"status","status",-1997798413),status], null),knoxx.backend.infra.openplanner.memory.output_quality_extra(answer)], 0));
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37579,G__37580,G__37581,G__37582) : mk_fn.call(null,G__37579,G__37580,G__37581,G__37582));
}
});
knoxx.backend.infra.stores.openplanner_session_store.reasoning_event = (function knoxx$backend$infra$stores$openplanner_session_store$reasoning_event(mk_fn,reasoning,status){
if(clojure.string.blank_QMARK_(reasoning)){
return null;
} else {
var G__37597 = "knoxx.reasoning";
var G__37598 = "system";
var G__37599 = reasoning;
var G__37600 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"status","status",-1997798413),status], null);
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37597,G__37598,G__37599,G__37600) : mk_fn.call(null,G__37597,G__37598,G__37599,G__37600));
}
});
knoxx.backend.infra.stores.openplanner_session_store.error_event = (function knoxx$backend$infra$stores$openplanner_session_store$error_event(mk_fn,error,status){
if(clojure.string.blank_QMARK_(error)){
return null;
} else {
var G__37604 = "knoxx.error";
var G__37605 = "system";
var G__37606 = error;
var G__37607 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"status","status",-1997798413),status], null),knoxx.backend.infra.openplanner.memory.output_quality_extra(error)], 0));
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37604,G__37605,G__37606,G__37607) : mk_fn.call(null,G__37604,G__37605,G__37606,G__37607));
}
});
knoxx.backend.infra.stores.openplanner_session_store.tool_receipt_events = (function knoxx$backend$infra$stores$openplanner_session_store$tool_receipt_events(mk_fn,tool_receipts){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (r){
var G__37616 = "knoxx.tool_receipt";
var G__37617 = "system";
var G__37618 = knoxx.backend.infra.openplanner.memory.tool_receipt_summary_text(r);
var G__37619 = new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"receipt","receipt",1871350913),r], null);
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37616,G__37617,G__37618,G__37619) : mk_fn.call(null,G__37616,G__37617,G__37618,G__37619));
}),tool_receipts);
});
knoxx.backend.infra.stores.openplanner_session_store.run_event_list = (function knoxx$backend$infra$stores$openplanner_session_store$run_event_list(run,scope,mk_fn){
var map__37632 = run;
var map__37632__$1 = cljs.core.__destructure_map(map__37632);
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"run_id","run_id",-556768024));
var answer = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"answer","answer",-742633163));
var reasoning = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"reasoning","reasoning",1956143595));
var error = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"error","error",-978969032));
var messages = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"messages","messages",345434482));
var tool_receipts = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"tool_receipts","tool_receipts",1763489067));
var trace_blocks = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37632__$1,new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872));
var request_text = (function (){var or__5162__auto__ = (function (){var G__37641 = messages;
var G__37641__$1 = (((G__37641 == null))?null:cljs.core.first(G__37641));
if((G__37641__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(G__37641__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})();
return (function (p1__37626_SHARP_){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(p1__37626_SHARP_,knoxx.backend.infra.stores.openplanner_session_store.tool_receipt_events(mk_fn,tool_receipts));
})(cljs.core.vec(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [knoxx.backend.infra.stores.openplanner_session_store.user_message_event(mk_fn,scope,request_text,run),(function (){var G__37652 = "knoxx.run";
var G__37653 = "system";
var G__37654 = (""+"Run "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+" \u00B7 "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run)));
var G__37655 = new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),trace_blocks,new cljs.core.Keyword(null,"message_count","message_count",1614961575),cljs.core.count(messages)], null);
return (mk_fn.cljs$core$IFn$_invoke$arity$4 ? mk_fn.cljs$core$IFn$_invoke$arity$4(G__37652,G__37653,G__37654,G__37655) : mk_fn.call(null,G__37652,G__37653,G__37654,G__37655));
})(),knoxx.backend.infra.stores.openplanner_session_store.assistant_message_event(mk_fn,answer,new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run)),knoxx.backend.infra.stores.openplanner_session_store.reasoning_event(mk_fn,reasoning,new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run)),knoxx.backend.infra.stores.openplanner_session_store.error_event(mk_fn,error,new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run))], null))));
});
/**
 * Translate a KnoxxRun into the openplanner.event.v1 wire format.
 */
knoxx.backend.infra.stores.openplanner_session_store.run__GT_events = (function knoxx$backend$infra$stores$openplanner_session_store$run__GT_events(config,run){
var map__37667 = run;
var map__37667__$1 = cljs.core.__destructure_map(map__37667);
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var model = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"model","model",331153215));
var run_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"run_id","run_id",-556768024));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
var session_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"session_id","session_id",1584799627));
var conversation_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__37667__$1,new cljs.core.Keyword(null,"user_id","user_id",993497112));
var session_project = new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(config);
var scope = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.infra.openplanner.memory.run_scope_extra(run),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id,new cljs.core.Keyword(null,"session_id","session_id",1584799627),session_id,new cljs.core.Keyword(null,"conversation_id","conversation_id",-172324980),conversation_id,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"org_id","org_id",1380185385),org_id,new cljs.core.Keyword(null,"user_id","user_id",993497112),user_id], null)], 0));
var mk = (function (kind,role,text,extra){
return knoxx.backend.infra.openplanner.memory.openplanner_event(config,cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"role","role",-736691072),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"ts","ts",1617209904),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"message","message",-406056002),new cljs.core.Keyword(null,"session","session",1008279103),new cljs.core.Keyword(null,"text","text",-1790561697),new cljs.core.Keyword(null,"model","model",331153215)],[role,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([scope,extra], 0)),(function (){var or__5162__auto__ = updated_at;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = created_at;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.domain.time.now_iso();
}
}
})(),session_project,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role)),kind,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role)),conversation_id,text,model]));
});
return knoxx.backend.infra.stores.openplanner_session_store.run_event_list(run,scope,mk);
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.ICollection}
 * @implements {cljs.core.ICounted}
 * @implements {knoxx.backend.shape.session_persistence.ISessionStore}
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
knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore = (function (config,__meta,__extmap,__hash){
this.config = config;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k37673,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__37693 = k37673;
var G__37693__$1 = (((G__37693 instanceof cljs.core.Keyword))?G__37693.fqn:null);
switch (G__37693__$1) {
case "config":
return self__.config;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k37673,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__37704){
var vec__37706 = p__37704;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37706,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37706,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.openplanner-session-store.OpenPlannerSessionStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"config","config",994861415),self__.config],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__37672){
var self__ = this;
var G__37672__$1 = this;
return (new cljs.core.RecordIter((0),G__37672__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"config","config",994861415)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(self__.config,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-1625437314 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this37674,other37675){
var self__ = this;
var this37674__$1 = this;
return (((!((other37675 == null)))) && ((((this37674__$1.constructor === other37675.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37674__$1.config,other37675.config)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37674__$1.__extmap,other37675.__extmap)))))));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2 = (function (_,run){
var self__ = this;
var ___$1 = this;
knoxx.backend.shape.session_persistence.assert_run_BANG_(run,"OpenPlannerSessionStore/put-run!");

var events = knoxx.backend.infra.stores.openplanner_session_store.run__GT_events(self__.config,run);
return knoxx.backend.infra.clients.openplanner.events_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(self__.config),events).then((function (___$2){
return run;
}));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.clients.openplanner.vector_search_BANG_(knoxx.backend.infra.clients.openplanner.client.cljs$core$IFn$_invoke$arity$1(self__.config),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"q","q",689001697),run_id,new cljs.core.Keyword(null,"k","k",-2146297393),(1),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"session-project-name","session-project-name",-275048900).cljs$core$IFn$_invoke$arity$1(self__.config),new cljs.core.Keyword(null,"kind","kind",-717265803),"knoxx.run"], null)).then((function (result){
var temp__5825__auto__ = cljs.core.first(new cljs.core.Keyword(null,"hits","hits",-2120002930).cljs$core$IFn$_invoke$arity$1(result));
if(cljs.core.truth_(temp__5825__auto__)){
var hit = temp__5825__auto__;
var G__37745 = hit;
var G__37745__$1 = (((G__37745 == null))?null:new cljs.core.Keyword(null,"metadata","metadata",1799301597).cljs$core$IFn$_invoke$arity$1(G__37745));
if((G__37745__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"run_payload","run_payload",1272737557).cljs$core$IFn$_invoke$arity$1(G__37745__$1);
}
} else {
return null;
}
}));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3 = (function (store,run_id,patch){
var self__ = this;
var store__$1 = this;
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2(null,run_id).then((function (current){
var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([(function (){var or__5162__auto__ = current;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"run_id","run_id",-556768024),run_id], null);
}
})(),patch,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null)], 0));
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2(null,updated);
}));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2 = (function (_,_session_id){
var self__ = this;
var ___$1 = this;
return Promise.resolve(cljs.core.PersistentVector.EMPTY);
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3 = (function (store,run_id,opts){
var self__ = this;
var store__$1 = this;
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3(null,run_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false], null),cljs.core.select_keys(opts,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"messages","messages",345434482)], null))], 0)));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2 = (function (_,_run_id){
var self__ = this;
var ___$1 = this;
return Promise.resolve(true);
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"config","config",994861415),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(self__.config,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k37673){
var self__ = this;
var this__5476__auto____$1 = this;
var G__37766 = k37673;
var G__37766__$1 = (((G__37766 instanceof cljs.core.Keyword))?G__37766.fqn:null);
switch (G__37766__$1) {
case "config":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k37673);

}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__37672){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__37769 = cljs.core.keyword_identical_QMARK_;
var expr__37770 = k__5478__auto__;
if(cljs.core.truth_((pred__37769.cljs$core$IFn$_invoke$arity$2 ? pred__37769.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"config","config",994861415),expr__37770) : pred__37769.call(null,new cljs.core.Keyword(null,"config","config",994861415),expr__37770)))){
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(G__37672,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(self__.config,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__37672),null));
}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"config","config",994861415),self__.config,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__37672){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(self__.config,G__37672,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"config","config",-1659574354,null)], null);
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.cljs$lang$type = true);

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.openplanner-session-store/OpenPlannerSessionStore",null,(1),null));
}));

(knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.openplanner-session-store/OpenPlannerSessionStore");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.openplanner-session-store/OpenPlannerSessionStore.
 */
knoxx.backend.infra.stores.openplanner_session_store.__GT_OpenPlannerSessionStore = (function knoxx$backend$infra$stores$openplanner_session_store$__GT_OpenPlannerSessionStore(config){
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(config,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.openplanner-session-store/OpenPlannerSessionStore, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.openplanner_session_store.map__GT_OpenPlannerSessionStore = (function knoxx$backend$infra$stores$openplanner_session_store$map__GT_OpenPlannerSessionStore(G__37678){
var extmap__5511__auto__ = (function (){var G__37797 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__37678,new cljs.core.Keyword(null,"config","config",994861415));
if(cljs.core.record_QMARK_(G__37678)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__37797);
} else {
return G__37797;
}
})();
return (new knoxx.backend.infra.stores.openplanner_session_store.OpenPlannerSessionStore(new cljs.core.Keyword(null,"config","config",994861415).cljs$core$IFn$_invoke$arity$1(G__37678),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.openplanner_session_store.js.map
