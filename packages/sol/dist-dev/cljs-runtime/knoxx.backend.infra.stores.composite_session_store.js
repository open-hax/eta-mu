import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.shape.session_persistence.js";
goog.provide('knoxx.backend.infra.stores.composite_session_store');
knoxx.backend.infra.stores.composite_session_store.live_statuses = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null);
knoxx.backend.infra.stores.composite_session_store.put_composite_run_BANG_ = (async function knoxx$backend$infra$stores$composite_session_store$put_composite_run_BANG_(redis_store,op_store,run){
if(cljs.core.contains_QMARK_(knoxx.backend.infra.stores.composite_session_store.live_statuses,new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(run))){
return (await knoxx.backend.shape.session_persistence.put_run_BANG_(redis_store,run));
} else {
(await knoxx.backend.shape.session_persistence.put_run_BANG_(redis_store,run));

(await knoxx.backend.shape.session_persistence.put_run_BANG_(op_store,run));

return run;
}
});
knoxx.backend.infra.stores.composite_session_store.get_composite_run = (async function knoxx$backend$infra$stores$composite_session_store$get_composite_run(redis_store,op_store,run_id){
var or__5162__auto__ = (await knoxx.backend.shape.session_persistence.get_run(redis_store,run_id));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (await knoxx.backend.shape.session_persistence.get_run(op_store,run_id));
}
});
knoxx.backend.infra.stores.composite_session_store.patch_composite_run_BANG_ = (async function knoxx$backend$infra$stores$composite_session_store$patch_composite_run_BANG_(redis_store,op_store,run_id,patch){
var updated = (await knoxx.backend.shape.session_persistence.patch_run_BANG_(redis_store,run_id,patch));
if(cljs.core.contains_QMARK_(knoxx.backend.infra.stores.composite_session_store.live_statuses,new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(updated))){
} else {
(await knoxx.backend.shape.session_persistence.put_run_BANG_(op_store,updated));
}

return updated;
});
knoxx.backend.infra.stores.composite_session_store.complete_composite_run_BANG_ = (async function knoxx$backend$infra$stores$composite_session_store$complete_composite_run_BANG_(redis_store,op_store,run_id,opts){
var redis_final = (await knoxx.backend.shape.session_persistence.complete_run_BANG_(redis_store,run_id,opts));
(await knoxx.backend.shape.session_persistence.put_run_BANG_(op_store,redis_final));

return redis_final;
});
knoxx.backend.infra.stores.composite_session_store.delete_composite_run_BANG_ = (async function knoxx$backend$infra$stores$composite_session_store$delete_composite_run_BANG_(redis_store,op_store,run_id){
(await knoxx.backend.shape.session_persistence.delete_run_BANG_(redis_store,run_id));

(await knoxx.backend.shape.session_persistence.delete_run_BANG_(op_store,run_id));

return true;
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
knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore = (function (redis_store,op_store,__meta,__extmap,__hash){
this.redis_store = redis_store;
this.op_store = op_store;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k37592,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__37612 = k37592;
var G__37612__$1 = (((G__37612 instanceof cljs.core.Keyword))?G__37612.fqn:null);
switch (G__37612__$1) {
case "redis-store":
return self__.redis_store;

break;
case "op-store":
return self__.op_store;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k37592,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__37627){
var vec__37628 = p__37627;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37628,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37628,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.composite-session-store.CompositeSessionStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),self__.redis_store],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"op-store","op-store",-845323358),self__.op_store],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__37591){
var self__ = this;
var G__37591__$1 = this;
return (new cljs.core.RecordIter((0),G__37591__$1,2,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),new cljs.core.Keyword(null,"op-store","op-store",-845323358)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(self__.redis_store,self__.op_store,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (2 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (391086173 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this37593,other37594){
var self__ = this;
var this37593__$1 = this;
return (((!((other37594 == null)))) && ((((this37593__$1.constructor === other37594.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37593__$1.redis_store,other37594.redis_store)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37593__$1.op_store,other37594.op_store)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37593__$1.__extmap,other37594.__extmap)))))))));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2 = (function (_,run){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_session_store.put_composite_run_BANG_(self__.redis_store,self__.op_store,run);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_session_store.get_composite_run(self__.redis_store,self__.op_store,run_id);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3 = (function (_,run_id,patch){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_session_store.patch_composite_run_BANG_(self__.redis_store,self__.op_store,run_id,patch);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2 = (function (_,session_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.shape.session_persistence.list_active_runs(self__.redis_store,session_id);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3 = (function (_,run_id,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_session_store.complete_composite_run_BANG_(self__.redis_store,self__.op_store,run_id,opts);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.composite_session_store.delete_composite_run_BANG_(self__.redis_store,self__.op_store,run_id);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"op-store","op-store",-845323358),null,new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(self__.redis_store,self__.op_store,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k37592){
var self__ = this;
var this__5476__auto____$1 = this;
var G__37695 = k37592;
var G__37695__$1 = (((G__37695 instanceof cljs.core.Keyword))?G__37695.fqn:null);
switch (G__37695__$1) {
case "redis-store":
case "op-store":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k37592);

}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__37591){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__37697 = cljs.core.keyword_identical_QMARK_;
var expr__37698 = k__5478__auto__;
if(cljs.core.truth_((pred__37697.cljs$core$IFn$_invoke$arity$2 ? pred__37697.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),expr__37698) : pred__37697.call(null,new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),expr__37698)))){
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(G__37591,self__.op_store,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__37697.cljs$core$IFn$_invoke$arity$2 ? pred__37697.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"op-store","op-store",-845323358),expr__37698) : pred__37697.call(null,new cljs.core.Keyword(null,"op-store","op-store",-845323358),expr__37698)))){
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(self__.redis_store,G__37591,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(self__.redis_store,self__.op_store,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__37591),null));
}
}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),self__.redis_store,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"op-store","op-store",-845323358),self__.op_store,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__37591){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(self__.redis_store,self__.op_store,G__37591,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"redis-store","redis-store",1302241901,null),new cljs.core.Symbol(null,"op-store","op-store",795208169,null)], null);
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.cljs$lang$type = true);

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.composite-session-store/CompositeSessionStore",null,(1),null));
}));

(knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.composite-session-store/CompositeSessionStore");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.composite-session-store/CompositeSessionStore.
 */
knoxx.backend.infra.stores.composite_session_store.__GT_CompositeSessionStore = (function knoxx$backend$infra$stores$composite_session_store$__GT_CompositeSessionStore(redis_store,op_store){
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(redis_store,op_store,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.composite-session-store/CompositeSessionStore, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.composite_session_store.map__GT_CompositeSessionStore = (function knoxx$backend$infra$stores$composite_session_store$map__GT_CompositeSessionStore(G__37596){
var extmap__5511__auto__ = (function (){var G__37714 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__37596,new cljs.core.Keyword(null,"redis-store","redis-store",-338289626),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"op-store","op-store",-845323358)], 0));
if(cljs.core.record_QMARK_(G__37596)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__37714);
} else {
return G__37714;
}
})();
return (new knoxx.backend.infra.stores.composite_session_store.CompositeSessionStore(new cljs.core.Keyword(null,"redis-store","redis-store",-338289626).cljs$core$IFn$_invoke$arity$1(G__37596),new cljs.core.Keyword(null,"op-store","op-store",-845323358).cljs$core$IFn$_invoke$arity$1(G__37596),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.composite_session_store.js.map
