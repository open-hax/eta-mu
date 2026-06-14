import "./cljs_env.js";
import "./cljs.core.js";
import "./knoxx.backend.shape.session_persistence.js";
import "./knoxx.backend.domain.time.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_run_store');
knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME = "knoxx_runs";
knoxx.backend.infra.stores.mongo_run_store.DEFAULT_RUN_TTL_SECONDS = (((2) * (60)) * (60));
knoxx.backend.infra.stores.mongo_run_store.MAX_RUN_EVENTS = (1000);
knoxx.backend.infra.stores.mongo_run_store.ACTIVE_STATUSES = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["waiting_input",null,"running",null,"queued",null], null), null);
knoxx.backend.infra.stores.mongo_run_store.find_run = (async function knoxx$backend$infra$stores$mongo_run_store$find_run(db,run_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
var result = (await coll.findOne(({"run_id": run_id})));
if(cljs.core.truth_(result)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(result,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_run_store.insert_run_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$insert_run_BANG_(db,run){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
var doc = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(run,new cljs.core.Keyword(null,"run_events","run_events",593930330),cljs.core.PersistentVector.EMPTY,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (knoxx.backend.infra.stores.mongo_run_store.DEFAULT_RUN_TTL_SECONDS * (1000))))),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),(new Date()),new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),(new Date())], 0));
(await coll.insertOne(cljs.core.clj__GT_js(doc)));

return doc;
});
knoxx.backend.infra.stores.mongo_run_store.update_run_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$update_run_BANG_(db,run_id,patch){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
var set_doc = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(patch,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),(new Date()),new cljs.core.Keyword(null,"expiresAt","expiresAt",1882778246),(new Date((Date.now() + (knoxx.backend.infra.stores.mongo_run_store.DEFAULT_RUN_TTL_SECONDS * (1000)))))], 0));
return (await coll.findOneAndUpdate(({"run_id": run_id}),({"$set": cljs.core.clj__GT_js(set_doc)}),({"returnDocument": "after"})));
});
knoxx.backend.infra.stores.mongo_run_store.delete_run_doc_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$delete_run_doc_BANG_(db,run_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
(await coll.deleteOne(({"run_id": run_id})));

return true;
});
knoxx.backend.infra.stores.mongo_run_store.list_runs_for_session = (async function knoxx$backend$infra$stores$mongo_run_store$list_runs_for_session(db,session_id){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
var cursor = coll.find(({"session_id": session_id, "status": ({"$in": cljs.core.clj__GT_js(cljs.core.vec(knoxx.backend.infra.stores.mongo_run_store.ACTIVE_STATUSES))})}));
var results = (await cursor.toArray());
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(results,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
/**
 * Append a run event to the run_events array. Keeps max 1000 events.
 */
knoxx.backend.infra.stores.mongo_run_store.append_run_event_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$append_run_event_BANG_(db,run_id,event){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
var event_with_ts = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(event,new cljs.core.Keyword(null,"at","at",1476951349),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"at","at",1476951349).cljs$core$IFn$_invoke$arity$1(event);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.time.now_iso();
}
})()));
return (await coll.findOneAndUpdate(({"run_id": run_id}),({"$push": ({"run_events": ({"$each": cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [event_with_ts], null)), "$slice": (- knoxx.backend.infra.stores.mongo_run_store.MAX_RUN_EVENTS)})}), "$set": ({"updatedAt": (new Date()), "expiresAt": (new Date((Date.now() + (knoxx.backend.infra.stores.mongo_run_store.DEFAULT_RUN_TTL_SECONDS * (1000)))))})}),({"returnDocument": "after"})));
});
/**
 * Create required indexes on knoxx_runs collection.
 */
knoxx.backend.infra.stores.mongo_run_store.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$setup_indexes_BANG_(db){
var coll = db.collection(knoxx.backend.infra.stores.mongo_run_store.COLLECTION_NAME);
(await coll.createIndex(({"run_id": (1)}),({"unique": true})));

(await coll.createIndex(({"session_id": (1)})));

(await coll.createIndex(({"status": (1)})));

return (await coll.createIndex(({"expiresAt": (1)}),({"expireAfterSeconds": (0)})));
});
knoxx.backend.infra.stores.mongo_run_store.put_run_impl_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$put_run_impl_BANG_(db,run){
knoxx.backend.shape.session_persistence.assert_run_BANG_(run,"MongoRunStore/put-run!");

var run_id = new cljs.core.Keyword(null,"run_id","run_id",-556768024).cljs$core$IFn$_invoke$arity$1(run);
var existing = (await knoxx.backend.infra.stores.mongo_run_store.find_run(db,run_id));
if(cljs.core.truth_(existing)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.infra.stores.mongo_run_store.update_run_BANG_(db,run_id,run)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await knoxx.backend.infra.stores.mongo_run_store.insert_run_BANG_(db,run)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
}
});
knoxx.backend.infra.stores.mongo_run_store.patch_run_impl_BANG_ = (async function knoxx$backend$infra$stores$mongo_run_store$patch_run_impl_BANG_(db,run_id,patch){
var current = (await knoxx.backend.infra.stores.mongo_run_store.find_run(db,run_id));
if(cljs.core.truth_(current)){
} else {
throw cljs.core.ex_info.cljs$core$IFn$_invoke$arity$2("patch-run! on unknown run",new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"run-id","run-id",-1745267908),run_id,new cljs.core.Keyword(null,"patch-keys","patch-keys",-1165029932),cljs.core.keys(patch)], null));
}

var updated = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([current,patch,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null)], 0));
return (await knoxx.backend.infra.stores.mongo_run_store.put_run_impl_BANG_(db,updated));
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
knoxx.backend.infra.stores.mongo_run_store.MongoRunStore = (function (db,__meta,__extmap,__hash){
this.db = db;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k30356,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__30390 = k30356;
var G__30390__$1 = (((G__30390 instanceof cljs.core.Keyword))?G__30390.fqn:null);
switch (G__30390__$1) {
case "db":
return self__.db;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k30356,else__5472__auto__);

}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__30395){
var vec__30396 = p__30395;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30396,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__30396,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.infra.stores.mongo-run-store.MongoRunStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"db","db",993250759),self__.db],null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__30355){
var self__ = this;
var G__30355__$1 = this;
return (new cljs.core.RecordIter((0),G__30355__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"db","db",993250759)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(self__.db,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (832868590 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this30357,other30358){
var self__ = this;
var this30357__$1 = this;
return (((!((other30358 == null)))) && ((((this30357__$1.constructor === other30358.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30357__$1.db,other30358.db)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this30357__$1.__extmap,other30358.__extmap)))))));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$put_run_BANG_$arity$2 = (function (_,run){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.put_run_impl_BANG_(self__.db,run);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$get_run$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.find_run(self__.db,run_id);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$patch_run_BANG_$arity$3 = (function (_,run_id,patch){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.patch_run_impl_BANG_(self__.db,run_id,patch);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$list_active_runs$arity$2 = (function (_,session_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.list_runs_for_session(self__.db,session_id);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$complete_run_BANG_$arity$3 = (function (_,run_id,opts){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.patch_run_impl_BANG_(self__.db,run_id,cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"status","status",-1997798413),"completed",new cljs.core.Keyword(null,"has_active_stream","has_active_stream",-1354700106),false,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),knoxx.backend.domain.time.now_iso()], null),cljs.core.select_keys(opts,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"answer","answer",-742633163),new cljs.core.Keyword(null,"error","error",-978969032),new cljs.core.Keyword(null,"trace_blocks","trace_blocks",1856523872),new cljs.core.Keyword(null,"messages","messages",345434482)], null))], 0)));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.knoxx$backend$shape$session_persistence$ISessionStore$delete_run_BANG_$arity$2 = (function (_,run_id){
var self__ = this;
var ___$1 = this;
return knoxx.backend.infra.stores.mongo_run_store.delete_run_doc_BANG_(self__.db,run_id);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"db","db",993250759),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(self__.db,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k30356){
var self__ = this;
var this__5476__auto____$1 = this;
var G__30454 = k30356;
var G__30454__$1 = (((G__30454 instanceof cljs.core.Keyword))?G__30454.fqn:null);
switch (G__30454__$1) {
case "db":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k30356);

}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__30355){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__30455 = cljs.core.keyword_identical_QMARK_;
var expr__30456 = k__5478__auto__;
if(cljs.core.truth_((pred__30455.cljs$core$IFn$_invoke$arity$2 ? pred__30455.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"db","db",993250759),expr__30456) : pred__30455.call(null,new cljs.core.Keyword(null,"db","db",993250759),expr__30456)))){
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(G__30355,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(self__.db,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__30355),null));
}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"db","db",993250759),self__.db,null))], null),self__.__extmap));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__30355){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(self__.db,G__30355,self__.__extmap,self__.__hash));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"db","db",-1661185010,null)], null);
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.cljs$lang$type = true);

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.infra.stores.mongo-run-store/MongoRunStore",null,(1),null));
}));

(knoxx.backend.infra.stores.mongo_run_store.MongoRunStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.infra.stores.mongo-run-store/MongoRunStore");
}));

/**
 * Positional factory function for knoxx.backend.infra.stores.mongo-run-store/MongoRunStore.
 */
knoxx.backend.infra.stores.mongo_run_store.__GT_MongoRunStore = (function knoxx$backend$infra$stores$mongo_run_store$__GT_MongoRunStore(db){
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(db,null,null,null));
});

/**
 * Factory function for knoxx.backend.infra.stores.mongo-run-store/MongoRunStore, taking a map of keywords to field values.
 */
knoxx.backend.infra.stores.mongo_run_store.map__GT_MongoRunStore = (function knoxx$backend$infra$stores$mongo_run_store$map__GT_MongoRunStore(G__30363){
var extmap__5511__auto__ = (function (){var G__30484 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__30363,new cljs.core.Keyword(null,"db","db",993250759));
if(cljs.core.record_QMARK_(G__30363)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__30484);
} else {
return G__30484;
}
})();
return (new knoxx.backend.infra.stores.mongo_run_store.MongoRunStore(new cljs.core.Keyword(null,"db","db",993250759).cljs$core$IFn$_invoke$arity$1(G__30363),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

/**
 * Factory for MongoRunStore.
 */
knoxx.backend.infra.stores.mongo_run_store.create_mongo_run_store = (function knoxx$backend$infra$stores$mongo_run_store$create_mongo_run_store(db){
return knoxx.backend.infra.stores.mongo_run_store.__GT_MongoRunStore(db);
});

//# sourceMappingURL=knoxx.backend.infra.stores.mongo_run_store.js.map
