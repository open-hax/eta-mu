import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.policy.protocol.js";
import "./knoxx.backend.infra.registry.tools.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.domain.policy.edn_adapter');

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
 * @implements {cljs.core.IPrintWithWriter}
 * @implements {cljs.core.IIterable}
 * @implements {cljs.core.IWithMeta}
 * @implements {cljs.core.IAssociative}
 * @implements {cljs.core.IMap}
 * @implements {cljs.core.ILookup}
*/
knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore = (function (contracts_dir,__meta,__extmap,__hash){
this.contracts_dir = contracts_dir;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k26320,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__26329 = k26320;
var G__26329__$1 = (((G__26329 instanceof cljs.core.Keyword))?G__26329.fqn:null);
switch (G__26329__$1) {
case "contracts-dir":
return self__.contracts_dir;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k26320,else__5472__auto__);

}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__26340){
var vec__26341 = p__26340;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26341,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__26341,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.policy.edn-adapter.EdnPolicyStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),self__.contracts_dir],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__26319){
var self__ = this;
var G__26319__$1 = this;
return (new cljs.core.RecordIter((0),G__26319__$1,1,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(self__.contracts_dir,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (1 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (489243227 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this26321,other26322){
var self__ = this;
var this26321__$1 = this;
return (((!((other26322 == null)))) && ((((this26321__$1.constructor === other26322.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26321__$1.contracts_dir,other26322.contracts_dir)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this26321__$1.__extmap,other26322.__extmap)))))));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(self__.contracts_dir,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k26320){
var self__ = this;
var this__5476__auto____$1 = this;
var G__26372 = k26320;
var G__26372__$1 = (((G__26372 instanceof cljs.core.Keyword))?G__26372.fqn:null);
switch (G__26372__$1) {
case "contracts-dir":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k26320);

}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__26319){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__26376 = cljs.core.keyword_identical_QMARK_;
var expr__26377 = k__5478__auto__;
if(cljs.core.truth_((pred__26376.cljs$core$IFn$_invoke$arity$2 ? pred__26376.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),expr__26377) : pred__26376.call(null,new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),expr__26377)))){
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(G__26319,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(self__.contracts_dir,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__26319),null));
}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),self__.contracts_dir,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__26319){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(self__.contracts_dir,G__26319,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"contracts-dir","contracts-dir",1861267262,null)], null);
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.cljs$lang$type = true);

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.policy.edn-adapter/EdnPolicyStore",null,(1),null));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.policy.edn-adapter/EdnPolicyStore");
}));

/**
 * Positional factory function for knoxx.backend.domain.policy.edn-adapter/EdnPolicyStore.
 */
knoxx.backend.domain.policy.edn_adapter.__GT_EdnPolicyStore = (function knoxx$backend$domain$policy$edn_adapter$__GT_EdnPolicyStore(contracts_dir){
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(contracts_dir,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.policy.edn-adapter/EdnPolicyStore, taking a map of keywords to field values.
 */
knoxx.backend.domain.policy.edn_adapter.map__GT_EdnPolicyStore = (function knoxx$backend$domain$policy$edn_adapter$map__GT_EdnPolicyStore(G__26327){
var extmap__5511__auto__ = (function (){var G__26387 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(G__26327,new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735));
if(cljs.core.record_QMARK_(G__26327)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__26387);
} else {
return G__26387;
}
})();
return (new knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore(new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735).cljs$core$IFn$_invoke$arity$1(G__26327),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.policy.edn_adapter.create_store = (function knoxx$backend$domain$policy$edn_adapter$create_store(contracts_dir){
return knoxx.backend.domain.policy.edn_adapter.__GT_EdnPolicyStore(contracts_dir);
});
knoxx.backend.domain.policy.edn_adapter.safe_path_segment_BANG_ = (function knoxx$backend$domain$policy$edn_adapter$safe_path_segment_BANG_(segment,kind){
var s = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(segment));
if(((clojure.string.blank_QMARK_(s)) || (cljs.core.not(cljs.core.re_matches(/[A-Za-z0-9._-]+/,s))))){
throw (new Error((""+"Invalid "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)+" segment: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(segment))));
} else {
}

return s;
});
knoxx.backend.domain.policy.edn_adapter.loader_config = (function knoxx$backend$domain$policy$edn_adapter$loader_config(store){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735).cljs$core$IFn$_invoke$arity$1(store)], null);
});
knoxx.backend.domain.policy.edn_adapter.normalized_class = (function knoxx$backend$domain$policy$edn_adapter$normalized_class(contract_class){
return knoxx.backend.domain.contracts.loader.normalize_contract_class(contract_class);
});
knoxx.backend.domain.policy.edn_adapter.contract_path = (function knoxx$backend$domain$policy$edn_adapter$contract_path(store,contract_class,contract_id){
return knoxx.backend.domain.contracts.loader.contract_file_path.cljs$core$IFn$_invoke$arity$3(knoxx.backend.domain.policy.edn_adapter.loader_config(store),knoxx.backend.domain.policy.edn_adapter.normalized_class(contract_class),knoxx.backend.domain.policy.edn_adapter.safe_path_segment_BANG_(contract_id,"contract id"));
});
knoxx.backend.domain.policy.edn_adapter.contract_id = (function knoxx$backend$domain$policy$edn_adapter$contract_id(contract_class,contract){
var G__26446 = contract_class;
var G__26446__$1 = (((G__26446 instanceof cljs.core.Keyword))?G__26446.fqn:null);
switch (G__26446__$1) {
case "actors":
return new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(contract);

break;
case "actor":
return new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(contract);

break;
default:
var or__5162__auto__ = new cljs.core.Keyword("contract","id","contract/id",-872298206).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword("role","id","role/id",-1375589954).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword("cap","id","cap/id",-1388434846).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
var or__5162__auto____$4 = new cljs.core.Keyword("model","id","model/id",-1274892501).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$4)){
return or__5162__auto____$4;
} else {
return new cljs.core.Keyword("model-family","id","model-family/id",969625548).cljs$core$IFn$_invoke$arity$1(contract);
}
}
}
}
}

}
});
knoxx.backend.domain.policy.edn_adapter.actor_contract_file_path = (function knoxx$backend$domain$policy$edn_adapter$actor_contract_file_path(store,actor_id){
return knoxx.backend.domain.policy.edn_adapter.contract_path(store,new cljs.core.Keyword(null,"actors","actors",-1845636398),actor_id);
});
knoxx.backend.domain.policy.edn_adapter.normalize_actor_contract = (function knoxx$backend$domain$policy$edn_adapter$normalize_actor_contract(actor){
var G__26459 = actor;
if(((cljs.core.map_QMARK_(actor)) && (cljs.core.not(new cljs.core.Keyword("actor","kind","actor/kind",-1410102686).cljs$core$IFn$_invoke$arity$1(actor))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26459,new cljs.core.Keyword("actor","kind","actor/kind",-1410102686),new cljs.core.Keyword(null,"agent","agent",-766455027));
} else {
return G__26459;
}
});
knoxx.backend.domain.policy.edn_adapter.edn_file_paths_under_root = (function knoxx$backend$domain$policy$edn_adapter$edn_file_paths_under_root(root){
try{return cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (ent){
if(cljs.core.truth_((function (){var and__5160__auto__ = ent.isFile();
if(cljs.core.truth_(and__5160__auto__)){
return ((typeof ent.name === 'string') && (((clojure.string.ends_with_QMARK_(ent.name,".edn")) && ((!(clojure.string.starts_with_QMARK_(ent.name,".")))))));
} else {
return and__5160__auto__;
}
})())){
return shadow.esm.esm_import$node_path.join(ent.parentPath,ent.name);
} else {
return null;
}
}),cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_fs.readdirSync(root,({"withFileTypes": true, "recursive": true}))));
}catch (e26464){var _ = e26464;
return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.domain.policy.edn_adapter.load_all_contract_records_sync = (function knoxx$backend$domain$policy$edn_adapter$load_all_contract_records_sync(store){
return knoxx.backend.domain.contracts.loader.dedup_contracts(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (file_path){
try{return knoxx.backend.domain.contracts.loader.parse_contract_file_records_BANG_(file_path,shadow.esm.esm_import$node_fs.readFileSync(file_path,"utf8"));
}catch (e26482){var _ = e26482;
return cljs.core.PersistentVector.EMPTY;
}}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.domain.policy.edn_adapter.edn_file_paths_under_root,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.loader.contract_root_paths(knoxx.backend.domain.policy.edn_adapter.loader_config(store))], 0)))], 0)));
});
knoxx.backend.domain.policy.edn_adapter.validate_contract_for_class_BANG_ = (function knoxx$backend$domain$policy$edn_adapter$validate_contract_for_class_BANG_(contract_class,contract){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(contract_class,new cljs.core.Keyword(null,"actors","actors",-1845636398))){
return knoxx.backend.domain.policy.protocol.validate_actor_BANG_(knoxx.backend.domain.policy.edn_adapter.normalize_actor_contract(contract));
} else {
return knoxx.backend.domain.policy.protocol.validate_contract_BANG_(contract_class,contract);
}
});
knoxx.backend.domain.policy.edn_adapter.contract_tool_ids = (function knoxx$backend$domain$policy$edn_adapter$contract_tool_ids(store){
return cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__26497_SHARP_){
var or__5162__auto__ = new cljs.core.Keyword("cap","tools","cap/tools",-1241568196).cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(p1__26497_SHARP_));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26495_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("capabilities",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26495_SHARP_));
}),knoxx.backend.domain.policy.edn_adapter.load_all_contract_records_sync(store))], 0))));
});
(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$arity$2 = (function (store,contract_class){
var store__$1 = this;
var klass = knoxx.backend.domain.policy.edn_adapter.normalized_class(contract_class);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__26520_SHARP_){
return knoxx.backend.domain.policy.edn_adapter.validate_contract_for_class_BANG_(contract_class,new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(p1__26520_SHARP_));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26519_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26519_SHARP_));
}),knoxx.backend.domain.policy.edn_adapter.load_all_contract_records_sync(store__$1)));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$arity$3 = (function (store,contract_class,contract_id){
var store__$1 = this;
var klass = knoxx.backend.domain.policy.edn_adapter.normalized_class(contract_class);
var wanted_id = (function (){var G__26536 = contract_id;
var G__26536__$1 = (((G__26536 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26536)));
var G__26536__$2 = (((G__26536__$1 == null))?null:clojure.string.trim(G__26536__$1));
if((G__26536__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26536__$2);
}
})();
var G__26538 = knoxx.backend.domain.policy.edn_adapter.load_all_contract_records_sync(store__$1);
var G__26538__$1 = (((G__26538 == null))?null:cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26521_SHARP_){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(klass,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__26521_SHARP_))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(wanted_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(p1__26521_SHARP_))));
}),G__26538));
var G__26538__$2 = (((G__26538__$1 == null))?null:cljs.core.first(G__26538__$1));
var G__26538__$3 = (((G__26538__$2 == null))?null:new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(G__26538__$2));
if((G__26538__$3 == null)){
return null;
} else {
return knoxx.backend.domain.policy.edn_adapter.validate_contract_for_class_BANG_(contract_class,G__26538__$3);
}
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$arity$3 = (function (store,contract_class,contract){
var store__$1 = this;
var validated = knoxx.backend.domain.policy.edn_adapter.validate_contract_for_class_BANG_(contract_class,contract);
var id = knoxx.backend.domain.policy.edn_adapter.contract_id(contract_class,validated);
var file_path = knoxx.backend.domain.policy.edn_adapter.contract_path(store__$1,contract_class,id);
shadow.esm.esm_import$node_fs.mkdirSync(shadow.esm.esm_import$node_path.dirname(file_path),({"recursive": true}));

shadow.esm.esm_import$node_fs.writeFileSync(file_path,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.pr_str.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([validated], 0)))+"\n"),"utf8");

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"contract","contract",798152745),validated,new cljs.core.Keyword(null,"path","path",-188191168),file_path], null));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$arity$1 = (function (store){
var store__$1 = this;
return knoxx.backend.domain.policy.protocol.list_contracts(store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398));
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$arity$2 = (function (store,actor_id){
var store__$1 = this;
return knoxx.backend.domain.policy.protocol.get_contract(store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398),actor_id);
}));

(knoxx.backend.domain.policy.edn_adapter.EdnPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$arity$2 = (function (store,actor){
var store__$1 = this;
return knoxx.backend.domain.policy.protocol.upsert_contract_BANG_(store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398),actor);
}));

//# sourceMappingURL=knoxx.backend.domain.policy.edn_adapter.js.map
