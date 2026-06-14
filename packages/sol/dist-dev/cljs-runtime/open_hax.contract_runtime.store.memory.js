import "./cljs_env.js";
import "./cljs.core.js";
import "./open_hax.contract_runtime.store.protocol.js";
import "./open_hax.contract_runtime.store.law.js";
goog.provide('open_hax.contract_runtime.store.memory');
open_hax.contract_runtime.store.memory.matches_query_QMARK_ = (function open_hax$contract_runtime$store$memory$matches_query_QMARK_(doc,query){
return cljs.core.every_QMARK_((function (p__22222){
var vec__22223 = p__22222;
var field = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22223,(0),null);
var expected = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22223,(1),null);
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(expected,cljs.core.get.cljs$core$IFn$_invoke$arity$2(doc,field));
}),cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(query,new cljs.core.Keyword(null,"limit","limit",-1355822363)));
});
open_hax.contract_runtime.store.memory.find_in_docs = (function open_hax$contract_runtime$store$memory$find_in_docs(docs,query){
var matched = cljs.core.filterv((function (p1__22226_SHARP_){
return open_hax.contract_runtime.store.memory.matches_query_QMARK_(p1__22226_SHARP_,query);
}),docs);
var temp__5823__auto__ = new cljs.core.Keyword(null,"limit","limit",-1355822363).cljs$core$IFn$_invoke$arity$1(query);
if(cljs.core.truth_(temp__5823__auto__)){
var limit = temp__5823__auto__;
return cljs.core.vec(cljs.core.take.cljs$core$IFn$_invoke$arity$2(limit,matched));
} else {
return matched;
}
});

/**
* @constructor
 * @implements {cljs.core.IRecord}
 * @implements {cljs.core.IKVReduce}
 * @implements {cljs.core.IEquiv}
 * @implements {cljs.core.IHash}
 * @implements {cljs.core.IFn}
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
 * @implements {open_hax.contract_runtime.store.protocol.IStore}
*/
open_hax.contract_runtime.store.memory.MemoryCollection = (function (store_id,guard,docs_STAR_,__meta,__extmap,__hash){
this.store_id = store_id;
this.guard = guard;
this.docs_STAR_ = docs_STAR_;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716171;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k22228,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__22241 = k22228;
var G__22241__$1 = (((G__22241 instanceof cljs.core.Keyword))?G__22241.fqn:null);
switch (G__22241__$1) {
case "store-id":
return self__.store_id;

break;
case "guard":
return self__.guard;

break;
case "docs*":
return self__.docs_STAR_;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k22228,else__5472__auto__);

}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__22243){
var vec__22245 = p__22243;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22245,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__22245,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#open-hax.contract-runtime.store.memory.MemoryCollection{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"store-id","store-id",-869340477),self__.store_id],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"guard","guard",-873147811),self__.guard],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"docs*","docs*",1574074937),self__.docs_STAR_],null))], null),self__.__extmap));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__22227){
var self__ = this;
var G__22227__$1 = this;
return (new cljs.core.RecordIter((0),G__22227__$1,3,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"store-id","store-id",-869340477),new cljs.core.Keyword(null,"guard","guard",-873147811),new cljs.core.Keyword(null,"docs*","docs*",1574074937)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,self__.guard,self__.docs_STAR_,self__.__meta,self__.__extmap,self__.__hash));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (3 + cljs.core.count(self__.__extmap));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-520997527 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this22229,other22230){
var self__ = this;
var this22229__$1 = this;
return (((!((other22230 == null)))) && ((((this22229__$1.constructor === other22230.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22229__$1.store_id,other22230.store_id)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22229__$1.guard,other22230.guard)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22229__$1.docs_STAR_,other22230.docs_STAR_)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this22229__$1.__extmap,other22230.__extmap)))))))))));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.open_hax$contract_runtime$store$protocol$IStore$ = cljs.core.PROTOCOL_SENTINEL);

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.open_hax$contract_runtime$store$protocol$IStore$_insert$arity$2 = (function (_,doc){
var self__ = this;
var ___$1 = this;
try{var guarded = (self__.guard.cljs$core$IFn$_invoke$arity$1 ? self__.guard.cljs$core$IFn$_invoke$arity$1(doc) : self__.guard.call(null,doc));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$3(self__.docs_STAR_,cljs.core.conj,guarded);

return Promise.resolve(guarded);
}catch (e22263){var err = e22263;
return Promise.reject(err);
}}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.open_hax$contract_runtime$store$protocol$IStore$_find$arity$2 = (function (_,query){
var self__ = this;
var ___$1 = this;
return Promise.resolve(open_hax.contract_runtime.store.memory.find_in_docs(cljs.core.deref(self__.docs_STAR_),(function (){var or__5162__auto__ = query;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"store-id","store-id",-869340477),null,new cljs.core.Keyword(null,"docs*","docs*",1574074937),null,new cljs.core.Keyword(null,"guard","guard",-873147811),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,self__.guard,self__.docs_STAR_,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k22228){
var self__ = this;
var this__5476__auto____$1 = this;
var G__22271 = k22228;
var G__22271__$1 = (((G__22271 instanceof cljs.core.Keyword))?G__22271.fqn:null);
switch (G__22271__$1) {
case "store-id":
case "guard":
case "docs*":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k22228);

}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__22227){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__22272 = cljs.core.keyword_identical_QMARK_;
var expr__22273 = k__5478__auto__;
if(cljs.core.truth_((pred__22272.cljs$core$IFn$_invoke$arity$2 ? pred__22272.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"store-id","store-id",-869340477),expr__22273) : pred__22272.call(null,new cljs.core.Keyword(null,"store-id","store-id",-869340477),expr__22273)))){
return (new open_hax.contract_runtime.store.memory.MemoryCollection(G__22227,self__.guard,self__.docs_STAR_,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__22272.cljs$core$IFn$_invoke$arity$2 ? pred__22272.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"guard","guard",-873147811),expr__22273) : pred__22272.call(null,new cljs.core.Keyword(null,"guard","guard",-873147811),expr__22273)))){
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,G__22227,self__.docs_STAR_,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__22272.cljs$core$IFn$_invoke$arity$2 ? pred__22272.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"docs*","docs*",1574074937),expr__22273) : pred__22272.call(null,new cljs.core.Keyword(null,"docs*","docs*",1574074937),expr__22273)))){
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,self__.guard,G__22227,self__.__meta,self__.__extmap,null));
} else {
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,self__.guard,self__.docs_STAR_,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__22227),null));
}
}
}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"store-id","store-id",-869340477),self__.store_id,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"guard","guard",-873147811),self__.guard,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"docs*","docs*",1574074937),self__.docs_STAR_,null))], null),self__.__extmap));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__22227){
var self__ = this;
var this__5468__auto____$1 = this;
return (new open_hax.contract_runtime.store.memory.MemoryCollection(self__.store_id,self__.guard,self__.docs_STAR_,G__22227,self__.__extmap,self__.__hash));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.call = (function (unused__2342__auto__){
var self__ = this;
var self__ = this;
var G__22277 = (arguments.length - (1));
switch (G__22277) {
case (1):
return self__.cljs$core$IFn$_invoke$arity$1((arguments[(1)]));

break;
default:
throw (new Error((""+"Invalid arity: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1((arguments.length - (1))))));

}
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.apply = (function (self__,args22237){
var self__ = this;
var self____$1 = this;
return self____$1.call.apply(self____$1,[self____$1].concat(cljs.core.aclone(args22237)));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.prototype.cljs$core$IFn$_invoke$arity$1 = (function (query){
var self__ = this;
var this$ = this;
return this$.open_hax$contract_runtime$store$protocol$IStore$_find$arity$2(null,query);
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.getBasis = (function (){
return new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"store-id","store-id",771191050,null),new cljs.core.Symbol(null,"guard","guard",767383716,null),new cljs.core.Symbol(null,"docs*","docs*",-1080360832,null)], null);
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.cljs$lang$type = true);

(open_hax.contract_runtime.store.memory.MemoryCollection.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"open-hax.contract-runtime.store.memory/MemoryCollection",null,(1),null));
}));

(open_hax.contract_runtime.store.memory.MemoryCollection.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"open-hax.contract-runtime.store.memory/MemoryCollection");
}));

/**
 * Positional factory function for open-hax.contract-runtime.store.memory/MemoryCollection.
 */
open_hax.contract_runtime.store.memory.__GT_MemoryCollection = (function open_hax$contract_runtime$store$memory$__GT_MemoryCollection(store_id,guard,docs_STAR_){
return (new open_hax.contract_runtime.store.memory.MemoryCollection(store_id,guard,docs_STAR_,null,null,null));
});

/**
 * Factory function for open-hax.contract-runtime.store.memory/MemoryCollection, taking a map of keywords to field values.
 */
open_hax.contract_runtime.store.memory.map__GT_MemoryCollection = (function open_hax$contract_runtime$store$memory$map__GT_MemoryCollection(G__22234){
var extmap__5511__auto__ = (function (){var G__22280 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__22234,new cljs.core.Keyword(null,"store-id","store-id",-869340477),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"guard","guard",-873147811),new cljs.core.Keyword(null,"docs*","docs*",1574074937)], 0));
if(cljs.core.record_QMARK_(G__22234)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__22280);
} else {
return G__22280;
}
})();
return (new open_hax.contract_runtime.store.memory.MemoryCollection(new cljs.core.Keyword(null,"store-id","store-id",-869340477).cljs$core$IFn$_invoke$arity$1(G__22234),new cljs.core.Keyword(null,"guard","guard",-873147811).cljs$core$IFn$_invoke$arity$1(G__22234),new cljs.core.Keyword(null,"docs*","docs*",1574074937).cljs$core$IFn$_invoke$arity$1(G__22234),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

/**
 * Build a MemoryCollection store from a store resource definition.
 */
open_hax.contract_runtime.store.memory.memory_collection = (function open_hax$contract_runtime$store$memory$memory_collection(p__22282){
var map__22283 = p__22282;
var map__22283__$1 = cljs.core.__destructure_map(map__22283);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22283__$1,new cljs.core.Keyword("store","id","store/id",-1277972109));
var schema = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__22283__$1,new cljs.core.Keyword("store","schema","store/schema",-1774348828));
return open_hax.contract_runtime.store.memory.__GT_MemoryCollection(id,open_hax.contract_runtime.store.law.compile_schema_guard(schema),cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentVector.EMPTY));
});

//# sourceMappingURL=open_hax.contract_runtime.store.memory.js.map
