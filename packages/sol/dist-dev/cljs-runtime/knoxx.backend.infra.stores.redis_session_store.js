import "./cljs_env.js";
import "./cljs.core.js";
import "./shadow.cljs.modern.js";
import "./knoxx.backend.infra.redis_client.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.domain.time.js";
goog.provide('knoxx.backend.infra.stores.redis_session_store');
knoxx.backend.infra.stores.redis_session_store.RUN_PREFIX = "knoxx:run:";
knoxx.backend.infra.stores.redis_session_store.RUN_TTL = (7200);
knoxx.backend.infra.stores.redis_session_store.SESS_RUNS = "knoxx:session_runs:";
knoxx.backend.infra.stores.redis_session_store.run_key = (function knoxx$backend$infra$stores$redis_session_store$run_key(run_id){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.redis_session_store.RUN_PREFIX)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(run_id));
});
knoxx.backend.infra.stores.redis_session_store.sess_key = (function knoxx$backend$infra$stores$redis_session_store$sess_key(session_id){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.stores.redis_session_store.SESS_RUNS)+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id));
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
knoxx.backend.infra.stores.redis_session_store.RedisSessionStore = (function (client,__meta,__extmap,__hash){
this.client = client;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k37638,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__37663 = k37638;
var G__37663__$1 = (((G__37663 instanceof cljs.core.Keyword))?G__37663.fqn:null);
switch (G__37663__$1) {
case "client":
return self__.client;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k37638,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__37668){
var vec__37669 = p__37668;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37669,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__37669,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.redis-session-store.RedisSessionStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"client","client",-1323448117),self__.client],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__37637){
var self__ = this;
var G__37637__$1 = this;
return (new cljs.core.RecordIter((0),G__37637__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"client","client",-1323448117)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(self__.client,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (1160413320 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this37639,other37640){
var self__ = this;
var this37639__$1 = this;
return (((!((other37640 == null)))) && ((((this37639__$1.constructor === other37640.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37639__$1.client,other37640.client)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this37639__$1.__extmap,other37640.__extmap)))))));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2 = (function (_,run){
var self__ = this;
var ___$1 = this;
knoxx.backend.shape.session_persistence.assert_run_BANG_(run,"RedisSessionStore/put-run!");

return knoxx.backend.infra.redis_client.set_json.cljs$core$IFn$_invoke$arity$4(self__.client,knoxx.backend.infra.stores.redis_session_store.run_key(new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run)),run,knoxx.backend.infra.stores.redis_session_store.RUN_TTL).then((function (___$2){
knoxx.backend.infra.redis_client.sadd(self__.client,knoxx.backend.infra.stores.redis_session_store.sess_key(new cljs.core.Keyword(null,"session_id","session_id",1584799627).cljs$core$IFn$_invoke$arity$1(run)),new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run));

return run;
}));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.redis_client.get_json(self__.client,knoxx.backend.infra.stores.redis_session_store.run_key(run_id));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3 = (function (store,run_id,patch){
var self__ = this;
var store__$1 = this;
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2(null,run_id).then((function (current){
var temp__5825__auto__ = (function (){var or__5162__auto__ = current;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("patch-run! on unknown run",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"patch-keys","patch-keys",-1165029932),cljs.core.keys(patch)], null));
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var base = temp__5825__auto__;
var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([base,patch,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null)], 0));
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2(null,updated);
} else {
return null;
}
}));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2 = (function (store,session_id){
var self__ = this;
var store__$1 = this;
return knoxx.backend.infra.redis_client.smembers(self__.client,knoxx.backend.infra.stores.redis_session_store.sess_key(session_id)).then((function (run_ids){
return Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__37635_SHARP_){
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2(null,p1__37635_SHARP_);
}),run_ids))).then((function (runs){
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__37636_SHARP_){
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__37636_SHARP_));
}),cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(runs,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))));
}));
}));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3 = (function (store,run_id,opts){
var self__ = this;
var store__$1 = this;
return store__$1.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3(null,run_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null),cljs.core.select_keys(opts,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"messages","messages",345434482)], null))], 0)));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.redis_client.del(self__.client,knoxx.backend.infra.stores.redis_session_store.run_key(run_id)).then((function (___$2){
return true;
}));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"client","client",-1323448117),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(self__.client,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k37638){
var self__ = this;
var this__5476__auto____$1 = this;
var G__37759 = k37638;
var G__37759__$1 = (((G__37759 instanceof cljs.core.Keyword))?G__37759.fqn:null);
switch (G__37759__$1) {
case "client":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k37638);

}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__37637){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__37760 = cljs.core.keyword_identical_QMARK_;
var expr__37761 = k__5478__auto__;
if(cljs.core.truth_((pred__37760.cljs$core$IFn$_invoke$arity$2 ? pred__37760.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"client","client",-1323448117),expr__37761) : pred__37760.call(null,new cljs.core.Keyword(null,"client","client",-1323448117),expr__37761)))){
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(G__37637,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(self__.client,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__37637),null));
}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"client","client",-1323448117),self__.client,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__37637){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(self__.client,G__37637,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"client","client",317083410,null)], null);
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.cljs$lang$type = true);

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.redis-session-store/RedisSessionStore",null,(1),null));
}));

(knoxx.backend.infra.stores.redis_session_store.RedisSessionStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.redis-session-store/RedisSessionStore");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.redis-session-store/RedisSessionStore.
 */
knoxx.backend.infra.stores.redis_session_store.__GT_RedisSessionStore = (function knoxx$backend$infra$stores$redis_session_store$__GT_RedisSessionStore(client){
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(client,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.redis-session-store/RedisSessionStore, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.redis_session_store.map__GT_RedisSessionStore = (function knoxx$backend$infra$stores$redis_session_store$map__GT_RedisSessionStore(G__37647){
var extmap__5511__auto__ = (function (){var G__37789 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__37647,new cljs.core.Keyword(null,"client","client",-1323448117));
if(cljs.core.record_QMARK_(G__37647)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__37789);
} else {
return G__37789;
}
})();
return (new knoxx.backend.infra.stores.redis_session_store.RedisSessionStore(new cljs.core.Keyword(null,"client","client",-1323448117).cljs$core$IFn$_invoke$arity$1(G__37647),null,cljs.core.not_empty(extmap__5511__auto__),null));
});


//# sourceMappingURL=knoxx.backend.infra.stores.redis_session_store.js.map
