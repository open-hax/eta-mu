import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
goog.provide('open_hax.contract_runtime.driver.registry');

/**
 * @interface
 */
open_hax.contract_runtime.driver.registry.EventDriver = function(){};

var open_hax$contract_runtime$driver$registry$EventDriver$driver_id$dyn_23504 = (function (driver){
var x__5519__auto__ = (((driver == null))?null:driver);
var m__5520__auto__ = (open_hax.contract_runtime.driver.registry.driver_id[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5520__auto__.call(null,driver));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.driver.registry.driver_id["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5518__auto__.call(null,driver));
} else {
throw cljs.core.missing_protocol("EventDriver.driver-id",driver);
}
}
});
/**
 * Stable keyword id for the driver implementation, e.g. :driver/discord.
 */
open_hax.contract_runtime.driver.registry.driver_id = (function open_hax$contract_runtime$driver$registry$driver_id(driver){
if((((!((driver == null)))) && ((!((driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_id$arity$1 == null)))))){
return driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_id$arity$1(driver);
} else {
return open_hax$contract_runtime$driver$registry$EventDriver$driver_id$dyn_23504(driver);
}
});

var open_hax$contract_runtime$driver$registry$EventDriver$driver_kind$dyn_23506 = (function (driver){
var x__5519__auto__ = (((driver == null))?null:driver);
var m__5520__auto__ = (open_hax.contract_runtime.driver.registry.driver_kind[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5520__auto__.call(null,driver));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.driver.registry.driver_kind["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5518__auto__.call(null,driver));
} else {
throw cljs.core.missing_protocol("EventDriver.driver-kind",driver);
}
}
});
/**
 * Coarse event system, e.g. :discord or :sessions.
 */
open_hax.contract_runtime.driver.registry.driver_kind = (function open_hax$contract_runtime$driver$registry$driver_kind(driver){
if((((!((driver == null)))) && ((!((driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_kind$arity$1 == null)))))){
return driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_kind$arity$1(driver);
} else {
return open_hax$contract_runtime$driver$registry$EventDriver$driver_kind$dyn_23506(driver);
}
});

var open_hax$contract_runtime$driver$registry$EventDriver$driver_event_specs$dyn_23507 = (function (driver){
var x__5519__auto__ = (((driver == null))?null:driver);
var m__5520__auto__ = (open_hax.contract_runtime.driver.registry.driver_event_specs[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5520__auto__.call(null,driver));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.driver.registry.driver_event_specs["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$1 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$1(driver) : m__5518__auto__.call(null,driver));
} else {
throw cljs.core.missing_protocol("EventDriver.driver-event-specs",driver);
}
}
});
/**
 * Event specs this driver implementation may emit.
 */
open_hax.contract_runtime.driver.registry.driver_event_specs = (function open_hax$contract_runtime$driver$registry$driver_event_specs(driver){
if((((!((driver == null)))) && ((!((driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_event_specs$arity$1 == null)))))){
return driver.open_hax$contract_runtime$driver$registry$EventDriver$driver_event_specs$arity$1(driver);
} else {
return open_hax$contract_runtime$driver$registry$EventDriver$driver_event_specs$dyn_23507(driver);
}
});

var open_hax$contract_runtime$driver$registry$EventDriver$start_source_BANG_$dyn_23508 = (function (driver,context){
var x__5519__auto__ = (((driver == null))?null:driver);
var m__5520__auto__ = (open_hax.contract_runtime.driver.registry.start_source_BANG_[goog.typeOf(x__5519__auto__)]);
if((!((m__5520__auto__ == null)))){
return (m__5520__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5520__auto__.cljs$core$IFn$_invoke$arity$2(driver,context) : m__5520__auto__.call(null,driver,context));
} else {
var m__5518__auto__ = (open_hax.contract_runtime.driver.registry.start_source_BANG_["_"]);
if((!((m__5518__auto__ == null)))){
return (m__5518__auto__.cljs$core$IFn$_invoke$arity$2 ? m__5518__auto__.cljs$core$IFn$_invoke$arity$2(driver,context) : m__5518__auto__.call(null,driver,context));
} else {
throw cljs.core.missing_protocol("EventDriver.start-source!",driver);
}
}
});
/**
 * Start or bind one source instance for this driver.
 * 
 *   context contains at least:
 *   - :config runtime config
 *   - :source source resource map
 *   - :dispatch! fn that accepts a normalized event map
 */
open_hax.contract_runtime.driver.registry.start_source_BANG_ = (function open_hax$contract_runtime$driver$registry$start_source_BANG_(driver,context){
if((((!((driver == null)))) && ((!((driver.open_hax$contract_runtime$driver$registry$EventDriver$start_source_BANG_$arity$2 == null)))))){
return driver.open_hax$contract_runtime$driver$registry$EventDriver$start_source_BANG_$arity$2(driver,context);
} else {
return open_hax$contract_runtime$driver$registry$EventDriver$start_source_BANG_$dyn_23508(driver,context);
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
 * @implements {open_hax.contract_runtime.driver.registry.EventDriver}
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
open_hax.contract_runtime.driver.registry.StaticEventDriver = (function (id,kind,event_specs,start_fn,__meta,__extmap,__hash){
this.id = id;
this.kind = kind;
this.event_specs = event_specs;
this.start_fn = start_fn;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k23302,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__23359 = k23302;
var G__23359__$1 = (((G__23359 instanceof cljs.core.Keyword))?G__23359.fqn:null);
switch (G__23359__$1) {
case "id":
return self__.id;

break;
case "kind":
return self__.kind;

break;
case "event-specs":
return self__.event_specs;

break;
case "start-fn":
return self__.start_fn;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k23302,else__5472__auto__);

}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__23365){
var vec__23366 = p__23365;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23366,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__23366,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#open-hax.contract-runtime.driver.registry.StaticEventDriver{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"id","id",-1388402092),self__.id],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"kind","kind",-717265803),self__.kind],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),self__.event_specs],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"start-fn","start-fn",1037074910),self__.start_fn],null))], null),self__.__extmap));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__23301){
var self__ = this;
var G__23301__$1 = this;
return (new cljs.core.RecordIter((0),G__23301__$1,4,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),new cljs.core.Keyword(null,"start-fn","start-fn",1037074910)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,self__.event_specs,self__.start_fn,self__.__meta,self__.__extmap,self__.__hash));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (4 + cljs.core.count(self__.__extmap));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1988251454 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this23303,other23304){
var self__ = this;
var this23303__$1 = this;
return (((!((other23304 == null)))) && ((((this23303__$1.constructor === other23304.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this23303__$1.id,other23304.id)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this23303__$1.kind,other23304.kind)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this23303__$1.event_specs,other23304.event_specs)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this23303__$1.start_fn,other23304.start_fn)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this23303__$1.__extmap,other23304.__extmap)))))))))))));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.open_hax$contract_runtime$driver$registry$EventDriver$ = cljs.core.PROTOCOL_SENTINEL);

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.open_hax$contract_runtime$driver$registry$EventDriver$driver_id$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.id;
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.open_hax$contract_runtime$driver$registry$EventDriver$driver_kind$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.kind;
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.open_hax$contract_runtime$driver$registry$EventDriver$driver_event_specs$arity$1 = (function (_){
var self__ = this;
var ___$1 = this;
return self__.event_specs;
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.open_hax$contract_runtime$driver$registry$EventDriver$start_source_BANG_$arity$2 = (function (_,context){
var self__ = this;
var ___$1 = this;
if(cljs.core.truth_(self__.start_fn)){
return (self__.start_fn.cljs$core$IFn$_invoke$arity$1 ? self__.start_fn.cljs$core$IFn$_invoke$arity$1(context) : self__.start_fn.call(null,context));
} else {
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"started?","started?",-1301062863),false,new cljs.core.Keyword(null,"reason","reason",-2070751759),new cljs.core.Keyword(null,"no-start-hook","no-start-hook",-1701080100),new cljs.core.Keyword("driver","id","driver/id",475742764),self__.id,new cljs.core.Keyword("source","id","source/id",-271642087),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(context,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword("source","id","source/id",-271642087)], null))], null));
}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),null,new cljs.core.Keyword(null,"id","id",-1388402092),null,new cljs.core.Keyword(null,"kind","kind",-717265803),null,new cljs.core.Keyword(null,"start-fn","start-fn",1037074910),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,self__.event_specs,self__.start_fn,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k23302){
var self__ = this;
var this__5476__auto____$1 = this;
var G__23442 = k23302;
var G__23442__$1 = (((G__23442 instanceof cljs.core.Keyword))?G__23442.fqn:null);
switch (G__23442__$1) {
case "id":
case "kind":
case "event-specs":
case "start-fn":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k23302);

}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__23301){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__23456 = cljs.core.keyword_identical_QMARK_;
var expr__23457 = k__5478__auto__;
if(cljs.core.truth_((pred__23456.cljs$core$IFn$_invoke$arity$2 ? pred__23456.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),expr__23457) : pred__23456.call(null,new cljs.core.Keyword(null,"id","id",-1388402092),expr__23457)))){
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(G__23301,self__.kind,self__.event_specs,self__.start_fn,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__23456.cljs$core$IFn$_invoke$arity$2 ? pred__23456.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"kind","kind",-717265803),expr__23457) : pred__23456.call(null,new cljs.core.Keyword(null,"kind","kind",-717265803),expr__23457)))){
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,G__23301,self__.event_specs,self__.start_fn,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__23456.cljs$core$IFn$_invoke$arity$2 ? pred__23456.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),expr__23457) : pred__23456.call(null,new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),expr__23457)))){
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,G__23301,self__.start_fn,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__23456.cljs$core$IFn$_invoke$arity$2 ? pred__23456.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"start-fn","start-fn",1037074910),expr__23457) : pred__23456.call(null,new cljs.core.Keyword(null,"start-fn","start-fn",1037074910),expr__23457)))){
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,self__.event_specs,G__23301,self__.__meta,self__.__extmap,null));
} else {
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,self__.event_specs,self__.start_fn,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__23301),null));
}
}
}
}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"id","id",-1388402092),self__.id,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"kind","kind",-717265803),self__.kind,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),self__.event_specs,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"start-fn","start-fn",1037074910),self__.start_fn,null))], null),self__.__extmap));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__23301){
var self__ = this;
var this__5468__auto____$1 = this;
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(self__.id,self__.kind,self__.event_specs,self__.start_fn,G__23301,self__.__extmap,self__.__hash));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.getBasis = (function (){
return new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"id","id",252129435,null),new cljs.core.Symbol(null,"kind","kind",923265724,null),new cljs.core.Symbol(null,"event-specs","event-specs",1225501685,null),new cljs.core.Symbol(null,"start-fn","start-fn",-1617360859,null)], null);
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.cljs$lang$type = true);

(open_hax.contract_runtime.driver.registry.StaticEventDriver.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"open-hax.contract-runtime.driver.registry/StaticEventDriver",null,(1),null));
}));

(open_hax.contract_runtime.driver.registry.StaticEventDriver.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"open-hax.contract-runtime.driver.registry/StaticEventDriver");
}));

/**
 * Positional factory function for open-hax.contract-runtime.driver.registry/StaticEventDriver.
 */
open_hax.contract_runtime.driver.registry.__GT_StaticEventDriver = (function open_hax$contract_runtime$driver$registry$__GT_StaticEventDriver(id,kind,event_specs,start_fn){
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(id,kind,event_specs,start_fn,null,null,null));
});

/**
 * Factory function for open-hax.contract-runtime.driver.registry/StaticEventDriver, taking a map of keywords to field values.
 */
open_hax.contract_runtime.driver.registry.map__GT_StaticEventDriver = (function open_hax$contract_runtime$driver$registry$map__GT_StaticEventDriver(G__23313){
var extmap__5511__auto__ = (function (){var G__23468 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__23313,new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"event-specs","event-specs",-415029842),new cljs.core.Keyword(null,"start-fn","start-fn",1037074910)], 0));
if(cljs.core.record_QMARK_(G__23313)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__23468);
} else {
return G__23468;
}
})();
return (new open_hax.contract_runtime.driver.registry.StaticEventDriver(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(G__23313),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(G__23313),new cljs.core.Keyword(null,"event-specs","event-specs",-415029842).cljs$core$IFn$_invoke$arity$1(G__23313),new cljs.core.Keyword(null,"start-fn","start-fn",1037074910).cljs$core$IFn$_invoke$arity$1(G__23313),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

if((typeof open_hax !== 'undefined') && (typeof open_hax.contract_runtime !== 'undefined') && (typeof open_hax.contract_runtime.driver !== 'undefined') && (typeof open_hax.contract_runtime.driver.registry !== 'undefined') && (typeof open_hax.contract_runtime.driver.registry.drivers_STAR_ !== 'undefined')){
} else {
open_hax.contract_runtime.driver.registry.drivers_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
}
/**
 * Normalize driver ids to namespaced :driver/* keywords when possible.
 */
open_hax.contract_runtime.driver.registry.normalize_driver_id = (function open_hax$contract_runtime$driver$registry$normalize_driver_id(value){
var raw = (function (){var G__23469 = value;
var G__23469__$1 = (((G__23469 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23469)));
var G__23469__$2 = (((G__23469__$1 == null))?null:clojure.string.replace(G__23469__$1,/^:/,""));
var G__23469__$3 = (((G__23469__$2 == null))?null:clojure.string.trim(G__23469__$2));
if((G__23469__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__23469__$3);
}
})();
if((value instanceof cljs.core.Keyword)){
return value;
} else {
if((raw == null)){
return null;
} else {
if(clojure.string.includes_QMARK_(raw,"/")){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw);
} else {
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("driver",raw);

}
}
}
});
/**
 * Extract an event type keyword from a driver/listener event entry.
 */
open_hax.contract_runtime.driver.registry.event_type = (function open_hax$contract_runtime$driver$registry$event_type(entry){
var value = ((cljs.core.map_QMARK_(entry))?new cljs.core.Keyword("event","type","event/type",1532247862).cljs$core$IFn$_invoke$arity$1(entry):entry);
var raw = (function (){var G__23474 = value;
var G__23474__$1 = (((G__23474 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__23474)));
var G__23474__$2 = (((G__23474__$1 == null))?null:clojure.string.replace(G__23474__$1,/^:/,""));
var G__23474__$3 = (((G__23474__$2 == null))?null:clojure.string.trim(G__23474__$2));
if((G__23474__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__23474__$3);
}
})();
if((value instanceof cljs.core.Keyword)){
return value;
} else {
if((raw == null)){
return null;
} else {
if(clojure.string.includes_QMARK_(raw,"/")){
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw);
} else {
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$1(raw);

}
}
}
});
/**
 * Return event type keywords emitted by a driver implementation.
 */
open_hax.contract_runtime.driver.registry.driver_event_types = (function open_hax$contract_runtime$driver$registry$driver_event_types(driver){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.driver.registry.event_type,open_hax.contract_runtime.driver.registry.driver_event_specs(driver))));
});
/**
 * Construct a data-backed driver implementation for systems whose startup hook
 * is supplied elsewhere or not wired yet.
 */
open_hax.contract_runtime.driver.registry.make_static_driver = (function open_hax$contract_runtime$driver$registry$make_static_driver(p__23481){
var map__23482 = p__23481;
var map__23482__$1 = cljs.core.__destructure_map(map__23482);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23482__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23482__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var emits = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23482__$1,new cljs.core.Keyword(null,"emits","emits",-1328379255));
var start_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__23482__$1,new cljs.core.Keyword(null,"start!","start!",-68601056));
return open_hax.contract_runtime.driver.registry.__GT_StaticEventDriver(open_hax.contract_runtime.driver.registry.normalize_driver_id(id),kind,cljs.core.vec(emits),start_BANG_);
});
/**
 * Register one code-level driver implementation.
 */
open_hax.contract_runtime.driver.registry.register_driver_BANG_ = (function open_hax$contract_runtime$driver$registry$register_driver_BANG_(driver){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(open_hax.contract_runtime.driver.registry.drivers_STAR_,cljs.core.assoc,open_hax.contract_runtime.driver.registry.driver_id(driver),driver);

return driver;
});
/**
 * Register multiple code-level driver implementations.
 */
open_hax.contract_runtime.driver.registry.register_drivers_BANG_ = (function open_hax$contract_runtime$driver$registry$register_drivers_BANG_(drivers){
var seq__23488_23519 = cljs.core.seq(drivers);
var chunk__23489_23520 = null;
var count__23490_23521 = (0);
var i__23491_23522 = (0);
while(true){
if((i__23491_23522 < count__23490_23521)){
var driver_23523 = chunk__23489_23520.cljs$core$IIndexed$_nth$arity$2(null,i__23491_23522);
open_hax.contract_runtime.driver.registry.register_driver_BANG_(driver_23523);


var G__23524 = seq__23488_23519;
var G__23525 = chunk__23489_23520;
var G__23526 = count__23490_23521;
var G__23527 = (i__23491_23522 + (1));
seq__23488_23519 = G__23524;
chunk__23489_23520 = G__23525;
count__23490_23521 = G__23526;
i__23491_23522 = G__23527;
continue;
} else {
var temp__5825__auto___23528 = cljs.core.seq(seq__23488_23519);
if(temp__5825__auto___23528){
var seq__23488_23529__$1 = temp__5825__auto___23528;
if(cljs.core.chunked_seq_QMARK_(seq__23488_23529__$1)){
var c__5694__auto___23530 = cljs.core.chunk_first(seq__23488_23529__$1);
var G__23531 = cljs.core.chunk_rest(seq__23488_23529__$1);
var G__23532 = c__5694__auto___23530;
var G__23533 = cljs.core.count(c__5694__auto___23530);
var G__23534 = (0);
seq__23488_23519 = G__23531;
chunk__23489_23520 = G__23532;
count__23490_23521 = G__23533;
i__23491_23522 = G__23534;
continue;
} else {
var driver_23535 = cljs.core.first(seq__23488_23529__$1);
open_hax.contract_runtime.driver.registry.register_driver_BANG_(driver_23535);


var G__23537 = cljs.core.next(seq__23488_23529__$1);
var G__23538 = null;
var G__23539 = (0);
var G__23540 = (0);
seq__23488_23519 = G__23537;
chunk__23489_23520 = G__23538;
count__23490_23521 = G__23539;
i__23491_23522 = G__23540;
continue;
}
} else {
}
}
break;
}

return cljs.core.deref(open_hax.contract_runtime.driver.registry.drivers_STAR_);
});
open_hax.contract_runtime.driver.registry.unregister_driver_BANG_ = (function open_hax$contract_runtime$driver$registry$unregister_driver_BANG_(driver_id){
return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(open_hax.contract_runtime.driver.registry.drivers_STAR_,cljs.core.dissoc,open_hax.contract_runtime.driver.registry.normalize_driver_id(driver_id));
});
/**
 * Test helper: clear the process-local driver registry.
 */
open_hax.contract_runtime.driver.registry.clear_drivers_BANG_ = (function open_hax$contract_runtime$driver$registry$clear_drivers_BANG_(){
return cljs.core.reset_BANG_(open_hax.contract_runtime.driver.registry.drivers_STAR_,cljs.core.PersistentArrayMap.EMPTY);
});
/**
 * Return a registered driver implementation by id, or nil.
 */
open_hax.contract_runtime.driver.registry.driver = (function open_hax$contract_runtime$driver$registry$driver(driver_id){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(open_hax.contract_runtime.driver.registry.drivers_STAR_),open_hax.contract_runtime.driver.registry.normalize_driver_id(driver_id));
});
/**
 * True when driver-id names a registered code-level driver implementation.
 */
open_hax.contract_runtime.driver.registry.registered_driver_QMARK_ = (function open_hax$contract_runtime$driver$registry$registered_driver_QMARK_(driver_id){
return cljs.core.contains_QMARK_(cljs.core.deref(open_hax.contract_runtime.driver.registry.drivers_STAR_),open_hax.contract_runtime.driver.registry.normalize_driver_id(driver_id));
});
open_hax.contract_runtime.driver.registry.registered_driver_ids = (function open_hax$contract_runtime$driver$registry$registered_driver_ids(){
return cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.keys(cljs.core.deref(open_hax.contract_runtime.driver.registry.drivers_STAR_))));
});
/**
 * Return event types emitted by the registered driver id.
 */
open_hax.contract_runtime.driver.registry.emitted_event_types = (function open_hax$contract_runtime$driver$registry$emitted_event_types(driver_id){
var temp__5823__auto__ = open_hax.contract_runtime.driver.registry.driver(driver_id);
if(cljs.core.truth_(temp__5823__auto__)){
var registered = temp__5823__auto__;
return open_hax.contract_runtime.driver.registry.driver_event_types(registered);
} else {
return cljs.core.PersistentVector.EMPTY;
}
});
/**
 * Return event type keywords selected by a source resource.
 */
open_hax.contract_runtime.driver.registry.source_listens = (function open_hax$contract_runtime$driver$registry$source_listens(source){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(open_hax.contract_runtime.driver.registry.event_type,new cljs.core.Keyword("source","listens","source/listens",-136351302).cljs$core$IFn$_invoke$arity$1(source))));
});
/**
 * True when every source/listens event is emitted by its selected driver.
 */
open_hax.contract_runtime.driver.registry.listened_by_driver_QMARK_ = (function open_hax$contract_runtime$driver$registry$listened_by_driver_QMARK_(source){
var driver_types = cljs.core.set(open_hax.contract_runtime.driver.registry.emitted_event_types(new cljs.core.Keyword("source","driver","source/driver",-1981763997).cljs$core$IFn$_invoke$arity$1(source)));
return cljs.core.every_QMARK_(driver_types,open_hax.contract_runtime.driver.registry.source_listens(source));
});
/**
 * Attach driver/source provenance to an event before dispatch.
 * 
 * This is how a source instance gives us an event: the driver implementation
 * observes a system signal, calls this helper with its source resource, then
 * passes the resulting map to the runtime dispatcher.
 */
open_hax.contract_runtime.driver.registry.source_event = (function open_hax$contract_runtime$driver$registry$source_event(driver,source,event){
var driver_key = open_hax.contract_runtime.driver.registry.driver_id(driver);
var generator = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"kind","kind",-717265803),open_hax.contract_runtime.driver.registry.driver_kind(driver),new cljs.core.Keyword(null,"driver","driver",1515263546),driver_key], null),(function (){var temp__5825__auto__ = new cljs.core.Keyword("source","id","source/id",-271642087).cljs$core$IFn$_invoke$arity$1(source);
if(cljs.core.truth_(temp__5825__auto__)){
var source_id = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"source","source",-433931539),source_id], null);
} else {
return null;
}
})()], 0));
var G__23501 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(event,new cljs.core.Keyword("event","generator","event/generator",-736110419),generator);
if(cljs.core.truth_(new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__23501,new cljs.core.Keyword("event","actor","event/actor",-1927656555),new cljs.core.Keyword("source","actor","source/actor",-1066117892).cljs$core$IFn$_invoke$arity$1(source));
} else {
return G__23501;
}
});

//# sourceMappingURL=open_hax.contract_runtime.driver.registry.js.map
