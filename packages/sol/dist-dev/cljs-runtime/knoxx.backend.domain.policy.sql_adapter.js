import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./honey.sql.js";
import "./knoxx.backend.domain.policy.protocol.js";
goog.provide('knoxx.backend.domain.policy.sql_adapter');

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
knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore = (function (query_one_BANG_,query_BANG_,find_org_by_slug_BANG_,set_membership_roles_BANG_,primary_org,__meta,__extmap,__hash){
this.query_one_BANG_ = query_one_BANG_;
this.query_BANG_ = query_BANG_;
this.find_org_by_slug_BANG_ = find_org_by_slug_BANG_;
this.set_membership_roles_BANG_ = set_membership_roles_BANG_;
this.primary_org = primary_org;
this.__meta = __meta;
this.__extmap = __extmap;
this.__hash = __hash;
this.cljs$lang$protocol_mask$partition0$ = 2230716170;
this.cljs$lang$protocol_mask$partition1$ = 139264;
});
(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ILookup$_lookup$arity$2 = (function (this__5469__auto__,k__5470__auto__){
var self__ = this;
var this__5469__auto____$1 = this;
return this__5469__auto____$1.cljs$core$ILookup$_lookup$arity$3(null,k__5470__auto__,null);
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ILookup$_lookup$arity$3 = (function (this__5471__auto__,k21049,else__5472__auto__){
var self__ = this;
var this__5471__auto____$1 = this;
var G__21066 = k21049;
var G__21066__$1 = (((G__21066 instanceof cljs.core.Keyword))?G__21066.fqn:null);
switch (G__21066__$1) {
case "query-one!":
return self__.query_one_BANG_;

break;
case "query!":
return self__.query_BANG_;

break;
case "find-org-by-slug!":
return self__.find_org_by_slug_BANG_;

break;
case "set-membership-roles!":
return self__.set_membership_roles_BANG_;

break;
case "primary-org":
return self__.primary_org;

break;
default:
return cljs.core.get.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k21049,else__5472__auto__);

}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IKVReduce$_kv_reduce$arity$3 = (function (this__5489__auto__,f__5490__auto__,init__5491__auto__){
var self__ = this;
var this__5489__auto____$1 = this;
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (ret__5492__auto__,p__21091){
var vec__21116 = p__21091;
var k__5493__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21116,(0),null);
var v__5494__auto__ = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__21116,(1),null);
return (f__5490__auto__.cljs$core$IFn$_invoke$arity$3 ? f__5490__auto__.cljs$core$IFn$_invoke$arity$3(ret__5492__auto__,k__5493__auto__,v__5494__auto__) : f__5490__auto__.call(null,ret__5492__auto__,k__5493__auto__,v__5494__auto__));
}),init__5491__auto__,this__5489__auto____$1);
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IPrintWithWriter$_pr_writer$arity$3 = (function (this__5484__auto__,writer__5485__auto__,opts__5486__auto__){
var self__ = this;
var this__5484__auto____$1 = this;
var pr_pair__5487__auto__ = (function (keyval__5488__auto__){
return cljs.core.pr_sequential_writer(writer__5485__auto__,cljs.core.pr_writer,""," ","",opts__5486__auto__,keyval__5488__auto__);
});
return cljs.core.pr_sequential_writer(writer__5485__auto__,pr_pair__5487__auto__,"#knoxx.backend.domain.policy.sql-adapter.SqlPolicyStore{",", ","}",opts__5486__auto__,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"query-one!","query-one!",373666417),self__.query_one_BANG_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"query!","query!",1326722454),self__.query_BANG_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),self__.find_org_by_slug_BANG_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),self__.set_membership_roles_BANG_],null)),(new cljs.core.PersistentVector(null,2,(5),cljs.core.PersistentVector.EMPTY_NODE,[new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),self__.primary_org],null))], null),self__.__extmap));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IIterable$_iterator$arity$1 = (function (G__21048){
var self__ = this;
var G__21048__$1 = this;
return (new cljs.core.RecordIter((0),G__21048__$1,5,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"query-one!","query-one!",373666417),new cljs.core.Keyword(null,"query!","query!",1326722454),new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),new cljs.core.Keyword(null,"primary-org","primary-org",-717687488)], null),(cljs.core.truth_(self__.__extmap)?cljs.core._iterator(self__.__extmap):cljs.core.nil_iter())));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IMeta$_meta$arity$1 = (function (this__5467__auto__){
var self__ = this;
var this__5467__auto____$1 = this;
return self__.__meta;
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ICloneable$_clone$arity$1 = (function (this__5464__auto__){
var self__ = this;
var this__5464__auto____$1 = this;
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ICounted$_count$arity$1 = (function (this__5473__auto__){
var self__ = this;
var this__5473__auto____$1 = this;
return (5 + cljs.core.count(self__.__extmap));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IHash$_hash$arity$1 = (function (this__5465__auto__){
var self__ = this;
var this__5465__auto____$1 = this;
var h__5272__auto__ = self__.__hash;
if((!((h__5272__auto__ == null)))){
return h__5272__auto__;
} else {
var h__5272__auto____$1 = (function (coll__5466__auto__){
return (-2050048929 ^ cljs.core.hash_unordered_coll(coll__5466__auto__));
})(this__5465__auto____$1);
(self__.__hash = h__5272__auto____$1);

return h__5272__auto____$1;
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IEquiv$_equiv$arity$2 = (function (this21051,other21052){
var self__ = this;
var this21051__$1 = this;
return (((!((other21052 == null)))) && ((((this21051__$1.constructor === other21052.constructor)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.query_one_BANG_,other21052.query_one_BANG_)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.query_BANG_,other21052.query_BANG_)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.find_org_by_slug_BANG_,other21052.find_org_by_slug_BANG_)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.set_membership_roles_BANG_,other21052.set_membership_roles_BANG_)) && (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.primary_org,other21052.primary_org)) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(this21051__$1.__extmap,other21052.__extmap)))))))))))))));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IMap$_dissoc$arity$2 = (function (this__5479__auto__,k__5480__auto__){
var self__ = this;
var this__5479__auto____$1 = this;
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),null,new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),null,new cljs.core.Keyword(null,"query-one!","query-one!",373666417),null,new cljs.core.Keyword(null,"query!","query!",1326722454),null,new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),null], null), null),k__5480__auto__)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(cljs.core._with_meta(cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,this__5479__auto____$1),self__.__meta),k__5480__auto__);
} else {
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,cljs.core.not_empty(cljs.core.dissoc.cljs$core$IFn$_invoke$arity$2(self__.__extmap,k__5480__auto__)),null));
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IAssociative$_contains_key_QMARK_$arity$2 = (function (this__5476__auto__,k21049){
var self__ = this;
var this__5476__auto____$1 = this;
var G__21170 = k21049;
var G__21170__$1 = (((G__21170 instanceof cljs.core.Keyword))?G__21170.fqn:null);
switch (G__21170__$1) {
case "query-one!":
case "query!":
case "find-org-by-slug!":
case "set-membership-roles!":
case "primary-org":
return true;

break;
default:
return cljs.core.contains_QMARK_(self__.__extmap,k21049);

}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IAssociative$_assoc$arity$3 = (function (this__5477__auto__,k__5478__auto__,G__21048){
var self__ = this;
var this__5477__auto____$1 = this;
var pred__21177 = cljs.core.keyword_identical_QMARK_;
var expr__21178 = k__5478__auto__;
if(cljs.core.truth_((pred__21177.cljs$core$IFn$_invoke$arity$2 ? pred__21177.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"query-one!","query-one!",373666417),expr__21178) : pred__21177.call(null,new cljs.core.Keyword(null,"query-one!","query-one!",373666417),expr__21178)))){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(G__21048,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21177.cljs$core$IFn$_invoke$arity$2 ? pred__21177.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"query!","query!",1326722454),expr__21178) : pred__21177.call(null,new cljs.core.Keyword(null,"query!","query!",1326722454),expr__21178)))){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,G__21048,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21177.cljs$core$IFn$_invoke$arity$2 ? pred__21177.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),expr__21178) : pred__21177.call(null,new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),expr__21178)))){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,G__21048,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21177.cljs$core$IFn$_invoke$arity$2 ? pred__21177.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),expr__21178) : pred__21177.call(null,new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),expr__21178)))){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,G__21048,self__.primary_org,self__.__meta,self__.__extmap,null));
} else {
if(cljs.core.truth_((pred__21177.cljs$core$IFn$_invoke$arity$2 ? pred__21177.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),expr__21178) : pred__21177.call(null,new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),expr__21178)))){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,G__21048,self__.__meta,self__.__extmap,null));
} else {
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,self__.__meta,cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(self__.__extmap,k__5478__auto__,G__21048),null));
}
}
}
}
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ISeqable$_seq$arity$1 = (function (this__5482__auto__){
var self__ = this;
var this__5482__auto____$1 = this;
return cljs.core.seq(cljs.core.concat.cljs$core$IFn$_invoke$arity$2(new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [(new cljs.core.MapEntry(new cljs.core.Keyword(null,"query-one!","query-one!",373666417),self__.query_one_BANG_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"query!","query!",1326722454),self__.query_BANG_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),self__.find_org_by_slug_BANG_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),self__.set_membership_roles_BANG_,null)),(new cljs.core.MapEntry(new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),self__.primary_org,null))], null),self__.__extmap));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$IWithMeta$_with_meta$arity$2 = (function (this__5468__auto__,G__21048){
var self__ = this;
var this__5468__auto____$1 = this;
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(self__.query_one_BANG_,self__.query_BANG_,self__.find_org_by_slug_BANG_,self__.set_membership_roles_BANG_,self__.primary_org,G__21048,self__.__extmap,self__.__hash));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.cljs$core$ICollection$_conj$arity$2 = (function (this__5474__auto__,entry__5475__auto__){
var self__ = this;
var this__5474__auto____$1 = this;
if(cljs.core.vector_QMARK_(entry__5475__auto__)){
return this__5474__auto____$1.cljs$core$IAssociative$_assoc$arity$3(null,cljs.core._nth(entry__5475__auto__,(0)),cljs.core._nth(entry__5475__auto__,(1)));
} else {
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._conj,this__5474__auto____$1,entry__5475__auto__);
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.getBasis = (function (){
return new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Symbol(null,"query-one!","query-one!",2014197944,null),new cljs.core.Symbol(null,"query!","query!",-1327713315,null),new cljs.core.Symbol(null,"find-org-by-slug!","find-org-by-slug!",-531941440,null),new cljs.core.Symbol(null,"set-membership-roles!","set-membership-roles!",-1986158352,null),new cljs.core.Symbol(null,"primary-org","primary-org",922844039,null)], null);
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.cljs$lang$type = true);

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.cljs$lang$ctorPrSeq = (function (this__5515__auto__){
return (new cljs.core.List(null,"knoxx.backend.domain.policy.sql-adapter/SqlPolicyStore",null,(1),null));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.cljs$lang$ctorPrWriter = (function (this__5515__auto__,writer__5516__auto__){
return cljs.core._write(writer__5516__auto__,"knoxx.backend.domain.policy.sql-adapter/SqlPolicyStore");
}));

/**
 * Positional factory function for knoxx.backend.domain.policy.sql-adapter/SqlPolicyStore.
 */
knoxx.backend.domain.policy.sql_adapter.__GT_SqlPolicyStore = (function knoxx$backend$domain$policy$sql_adapter$__GT_SqlPolicyStore(query_one_BANG_,query_BANG_,find_org_by_slug_BANG_,set_membership_roles_BANG_,primary_org){
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(query_one_BANG_,query_BANG_,find_org_by_slug_BANG_,set_membership_roles_BANG_,primary_org,null,null,null));
});

/**
 * Factory function for knoxx.backend.domain.policy.sql-adapter/SqlPolicyStore, taking a map of keywords to field values.
 */
knoxx.backend.domain.policy.sql_adapter.map__GT_SqlPolicyStore = (function knoxx$backend$domain$policy$sql_adapter$map__GT_SqlPolicyStore(G__21057){
var extmap__5511__auto__ = (function (){var G__21204 = cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(G__21057,new cljs.core.Keyword(null,"query-one!","query-one!",373666417),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"query!","query!",1326722454),new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329),new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417),new cljs.core.Keyword(null,"primary-org","primary-org",-717687488)], 0));
if(cljs.core.record_QMARK_(G__21057)){
return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,G__21204);
} else {
return G__21204;
}
})();
return (new knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore(new cljs.core.Keyword(null,"query-one!","query-one!",373666417).cljs$core$IFn$_invoke$arity$1(G__21057),new cljs.core.Keyword(null,"query!","query!",1326722454).cljs$core$IFn$_invoke$arity$1(G__21057),new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329).cljs$core$IFn$_invoke$arity$1(G__21057),new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417).cljs$core$IFn$_invoke$arity$1(G__21057),new cljs.core.Keyword(null,"primary-org","primary-org",-717687488).cljs$core$IFn$_invoke$arity$1(G__21057),null,cljs.core.not_empty(extmap__5511__auto__),null));
});

knoxx.backend.domain.policy.sql_adapter.create_store = (function knoxx$backend$domain$policy$sql_adapter$create_store(p__21211){
var map__21212 = p__21211;
var map__21212__$1 = cljs.core.__destructure_map(map__21212);
var query_one_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21212__$1,new cljs.core.Keyword(null,"query-one!","query-one!",373666417));
var query_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21212__$1,new cljs.core.Keyword(null,"query!","query!",1326722454));
var find_org_by_slug_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21212__$1,new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329));
var set_membership_roles_BANG_ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21212__$1,new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417));
var primary_org = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21212__$1,new cljs.core.Keyword(null,"primary-org","primary-org",-717687488));
return knoxx.backend.domain.policy.sql_adapter.__GT_SqlPolicyStore(query_one_BANG_,query_BANG_,find_org_by_slug_BANG_,set_membership_roles_BANG_,primary_org);
});
knoxx.backend.domain.policy.sql_adapter.format_sql = (function knoxx$backend$domain$policy$sql_adapter$format_sql(query_map){
return honey.sql.format.cljs$core$IFn$_invoke$arity$2(query_map,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"numbered","numbered",-2119856269),true], null));
});
knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_ = (function knoxx$backend$domain$policy$sql_adapter$execute_one_BANG_(store,query_map){
var vec__21232 = knoxx.backend.domain.policy.sql_adapter.format_sql(query_map);
var seq__21233 = cljs.core.seq(vec__21232);
var first__21234 = cljs.core.first(seq__21233);
var seq__21233__$1 = cljs.core.next(seq__21233);
var sql_str = first__21234;
var params = seq__21233__$1;
var fexpr__21236 = new cljs.core.Keyword(null,"query-one!","query-one!",373666417).cljs$core$IFn$_invoke$arity$1(store);
return (fexpr__21236.cljs$core$IFn$_invoke$arity$2 ? fexpr__21236.cljs$core$IFn$_invoke$arity$2(sql_str,params) : fexpr__21236.call(null,sql_str,params));
});
knoxx.backend.domain.policy.sql_adapter.normalize_email = (function knoxx$backend$domain$policy$sql_adapter$normalize_email(value){
var G__21238 = value;
var G__21238__$1 = (((G__21238 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21238)));
var G__21238__$2 = (((G__21238__$1 == null))?null:clojure.string.trim(G__21238__$1));
var G__21238__$3 = (((G__21238__$2 == null))?null:clojure.string.lower_case(G__21238__$2));
if((G__21238__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__21238__$3);
}
});
knoxx.backend.domain.policy.sql_adapter.actor_email_from_id = (function knoxx$backend$domain$policy$sql_adapter$actor_email_from_id(actor_id){
var slug = clojure.string.replace(clojure.string.replace(clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)))),/[^a-z0-9._+-]+/,"-"),/^[-.]+|[-.]+$/,"");
if(clojure.string.blank_QMARK_(slug)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)+"@actors.local");
}
});
knoxx.backend.domain.policy.sql_adapter.actor_credentials_select_query = (function knoxx$backend$domain$policy$sql_adapter$actor_credentials_select_query(provider){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"select","select",1147833503),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ac.*","ac.*",-1072937509),new cljs.core.Keyword(null,"m.actor_id","m.actor_id",2025150514),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.slug","o.slug",-675756042),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770)], null)], null),new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_credentials","actor_credentials",774592373),new cljs.core.Keyword(null,"ac","ac",-1891632475)], null)], null),new cljs.core.Keyword(null,"join","join",-758861890),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"m","m",1632677161)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.Keyword(null,"ac.user_id","ac.user_id",231890635)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.Keyword(null,"ac.org_id","ac.org_id",342159231)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"orgs","orgs",155776628),new cljs.core.Keyword(null,"o","o",-1350007228)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"o.id","o.id",-1100310568),new cljs.core.Keyword(null,"ac.org_id","ac.org_id",342159231)], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"ac.provider","ac.provider",-422592119),provider], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"ac.status","ac.status",1463122517),"active"], null)], null),new cljs.core.Keyword(null,"order-by","order-by",1527318070),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.actor_id","m.actor_id",2025150514),new cljs.core.Keyword(null,"asc","asc",356854569)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ac.updated_at","ac.updated_at",-1204564901),new cljs.core.Keyword(null,"desc","desc",2093485764)], null)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_credential_select_query = (function knoxx$backend$domain$policy$sql_adapter$actor_credential_select_query(actor_id,provider){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"select","select",1147833503),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ac.*","ac.*",-1072937509),new cljs.core.Keyword(null,"m.actor_id","m.actor_id",2025150514),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.slug","o.slug",-675756042),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770)], null)], null),new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor_credentials","actor_credentials",774592373),new cljs.core.Keyword(null,"ac","ac",-1891632475)], null)], null),new cljs.core.Keyword(null,"join","join",-758861890),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"m","m",1632677161)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.Keyword(null,"ac.user_id","ac.user_id",231890635)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.Keyword(null,"ac.org_id","ac.org_id",342159231)], null)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"orgs","orgs",155776628),new cljs.core.Keyword(null,"o","o",-1350007228)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"o.id","o.id",-1100310568),new cljs.core.Keyword(null,"ac.org_id","ac.org_id",342159231)], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.actor_id","m.actor_id",2025150514),actor_id], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"ac.provider","ac.provider",-422592119),provider], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"ac.status","ac.status",1463122517),"active"], null)], null),new cljs.core.Keyword(null,"order-by","order-by",1527318070),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.is_default","m.is_default",-1592367580),new cljs.core.Keyword(null,"desc","desc",2093485764)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"ac.updated_at","ac.updated_at",-1204564901),new cljs.core.Keyword(null,"desc","desc",2093485764)], null)], null),new cljs.core.Keyword(null,"limit","limit",-1355822363),(1)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_membership_select_query = (function knoxx$backend$domain$policy$sql_adapter$actor_membership_select_query(p__21263){
var map__21264 = p__21263;
var map__21264__$1 = cljs.core.__destructure_map(map__21264);
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21264__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21264__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21264__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"select","select",1147833503),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.*","m.*",-1225802390),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.slug","o.slug",-675756042),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770)], null)], null),new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"m","m",1632677161)], null)], null),new cljs.core.Keyword(null,"join","join",-758861890),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"orgs","orgs",155776628),new cljs.core.Keyword(null,"o","o",-1350007228)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"o.id","o.id",-1100310568),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842)], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),(function (){var G__21269 = new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817)], null);
var G__21269__$1 = (cljs.core.truth_(actor_id)?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__21269,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.actor_id","m.actor_id",2025150514),actor_id], null)):G__21269);
var G__21269__$2 = (cljs.core.truth_(user_id)?cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__21269__$1,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),user_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null)], null)):G__21269__$1);
if(cljs.core.truth_(org_id)){
return cljs.core.conj.cljs$core$IFn$_invoke$arity$2(G__21269__$2,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),org_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null)], null));
} else {
return G__21269__$2;
}
})(),new cljs.core.Keyword(null,"order-by","order-by",1527318070),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.is_default","m.is_default",-1592367580),new cljs.core.Keyword(null,"desc","desc",2093485764)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.updated_at","m.updated_at",-204467831),new cljs.core.Keyword(null,"desc","desc",2093485764)], null)], null),new cljs.core.Keyword(null,"limit","limit",-1355822363),(1)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_user_upsert_query = (function knoxx$backend$domain$policy$sql_adapter$actor_user_upsert_query(p__21277){
var map__21278 = p__21277;
var map__21278__$1 = cljs.core.__destructure_map(map__21278);
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21278__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21278__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21278__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21278__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21278__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"insert-into","insert-into",382212789),new cljs.core.Keyword(null,"users","users",-713552705),new cljs.core.Keyword(null,"columns","columns",1998437288),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609),new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135),new cljs.core.Keyword(null,"status","status",-1997798413)], null),new cljs.core.Keyword(null,"values","values",372645556),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [email,display_name,auth_provider,external_subject,(function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()], null)], null),new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"email","email",1415816706)], null),new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.display_name"], null),new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.auth_provider"], null),new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.external_subject"], null),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.status"], null),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"NOW()"], null)], null),new cljs.core.Keyword(null,"returning","returning",-387623629),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"*","*",-1294732318)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_user_update_query = (function knoxx$backend$domain$policy$sql_adapter$actor_user_update_query(user_id,p__21290){
var map__21291 = p__21290;
var map__21291__$1 = cljs.core.__destructure_map(map__21291);
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21291__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21291__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21291__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21291__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21291__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"update","update",1045576396),new cljs.core.Keyword(null,"users","users",-713552705),new cljs.core.Keyword(null,"set","set",304602554),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),email,new cljs.core.Keyword(null,"email","email",1415816706)], null),new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),display_name,new cljs.core.Keyword(null,"display_name","display_name",-1494335013)], null),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),status,new cljs.core.Keyword(null,"status","status",-1997798413)], null),new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),auth_provider,new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609)], null),new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),external_subject,new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135)], null),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"NOW()"], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),user_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null)], null),new cljs.core.Keyword(null,"returning","returning",-387623629),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"*","*",-1294732318)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_membership_upsert_query = (function knoxx$backend$domain$policy$sql_adapter$actor_membership_upsert_query(p__21293){
var map__21294 = p__21293;
var map__21294__$1 = cljs.core.__destructure_map(map__21294);
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var is_default = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21294__$1,new cljs.core.Keyword(null,"is-default","is-default",1401171070));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"insert-into","insert-into",382212789),new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"columns","columns",1998437288),new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"is_default","is_default",-922813238)], null),new cljs.core.Keyword(null,"values","values",372645556),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),user_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),org_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null),actor_id,(function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})(),cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(is_default,false)], null)], null),new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"org_id","org_id",1380185385)], null),new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.actor_id"], null),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.status"], null),new cljs.core.Keyword(null,"is_default","is_default",-922813238),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.is_default"], null),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"NOW()"], null)], null),new cljs.core.Keyword(null,"returning","returning",-387623629),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"*","*",-1294732318)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_membership_actor_update_query = (function knoxx$backend$domain$policy$sql_adapter$actor_membership_actor_update_query(membership_id,actor_id){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"update","update",1045576396),new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"set","set",304602554),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"NOW()"], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),membership_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null)], null),new cljs.core.Keyword(null,"returning","returning",-387623629),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"*","*",-1294732318)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.actor_credential_upsert_query = (function knoxx$backend$domain$policy$sql_adapter$actor_credential_upsert_query(p__21297){
var map__21299 = p__21297;
var map__21299__$1 = cljs.core.__destructure_map(map__21299);
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"provider","provider",-302056900));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var account_identifier = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778));
var secret_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"secret-json","secret-json",-436252008));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__21299__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"insert-into","insert-into",382212789),new cljs.core.Keyword(null,"actor_credentials","actor_credentials",774592373),new cljs.core.Keyword(null,"columns","columns",1998437288),new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"provider","provider",-302056900),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161),new cljs.core.Keyword(null,"secret_json","secret_json",-724933577),new cljs.core.Keyword(null,"status","status",-1997798413)], null),new cljs.core.Keyword(null,"values","values",372645556),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 7, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),user_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),org_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null),provider,(function (){var or__5162__auto__ = kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "credential";
}
})(),account_identifier,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),secret_json,new cljs.core.Keyword(null,"jsonb","jsonb",-826402072)], null),(function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()], null)], null),new cljs.core.Keyword(null,"on-conflict","on-conflict",1595391642),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user_id","user_id",993497112),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"provider","provider",-302056900),new cljs.core.Keyword(null,"kind","kind",-717265803)], null),new cljs.core.Keyword(null,"do-update-set","do-update-set",-2028298967),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"coalesce","coalesce",654622029),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.account_identifier"], null),new cljs.core.Keyword(null,"actor_credentials.account_identifier","actor_credentials.account_identifier",1753404584)], null),new cljs.core.Keyword(null,"secret_json","secret_json",-724933577),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"||","||",-207700737),new cljs.core.Keyword(null,"actor_credentials.secret_json","actor_credentials.secret_json",2030768516),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.secret_json"], null)], null),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"EXCLUDED.status"], null),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"raw","raw",1604651272),"NOW()"], null)], null),new cljs.core.Keyword(null,"returning","returning",-387623629),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"*","*",-1294732318)], null)], null);
});
knoxx.backend.domain.policy.sql_adapter.user_memberships_query = (function knoxx$backend$domain$policy$sql_adapter$user_memberships_query(user_ids,org_id){
var G__21302 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"select","select",1147833503),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.*","m.*",-1225802390),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.name","o.name",83564940),new cljs.core.Keyword(null,"org_name","org_name",-1732897410)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.slug","o.slug",-675756042),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770)], null)], null),new cljs.core.Keyword(null,"from","from",1815293044),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"m","m",1632677161)], null)], null),new cljs.core.Keyword(null,"join","join",-758861890),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"orgs","orgs",155776628),new cljs.core.Keyword(null,"o","o",-1350007228)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"o.id","o.id",-1100310568),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842)], null)], null),new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"any","any",1705907423),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(user_ids),new cljs.core.Keyword(null,"uuid","uuid",-2145095719),cljs.core.PersistentVector.EMPTY], null)], null)], null),new cljs.core.Keyword(null,"order-by","order-by",1527318070),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"o.name","o.name",83564940),new cljs.core.Keyword(null,"asc","asc",356854569)], null),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.created_at","m.created_at",1807502461),new cljs.core.Keyword(null,"asc","asc",356854569)], null)], null)], null);
if(cljs.core.truth_(org_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__21302,new cljs.core.Keyword(null,"where","where",-2044795965),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"and","and",-971899817),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.user_id","m.user_id",-1368963548),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"any","any",1705907423),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(user_ids),new cljs.core.Keyword(null,"uuid","uuid",-2145095719),cljs.core.PersistentVector.EMPTY], null)], null)], null),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"=","=",1152933628),new cljs.core.Keyword(null,"m.org_id","m.org_id",-1666616842),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"cast","cast",-1761029143),org_id,new cljs.core.Keyword(null,"uuid","uuid",-2145095719)], null)], null)], null),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"order-by","order-by",1527318070),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"m.created_at","m.created_at",1807502461),new cljs.core.Keyword(null,"asc","asc",356854569)], null)], null)], 0));
} else {
return G__21302;
}
});
knoxx.backend.domain.policy.sql_adapter.row__GT_credential = (function knoxx$backend$domain$policy$sql_adapter$row__GT_credential(row){
if(cljs.core.truth_(row)){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613),new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"userId","userId",575594135),new cljs.core.Keyword(null,"secretJson","secretJson",1807839704),new cljs.core.Keyword(null,"provider","provider",-302056900)],[new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(row),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"secret_json","secret_json",-724933577).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"provider","provider",-302056900).cljs$core$IFn$_invoke$arity$1(row)]);
} else {
return null;
}
});
knoxx.backend.domain.policy.sql_adapter.actor_role_slugs = (function knoxx$backend$domain$policy$sql_adapter$actor_role_slugs(actor){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (role){
if((role instanceof cljs.core.Keyword)){
return clojure.string.replace(cljs.core.name(role),/_/,"-");
} else {
if(typeof role === 'string'){
return clojure.string.replace(clojure.string.trim(role),/_/,"-");
} else {
return null;

}
}
}),(function (){var or__5162__auto__ = new cljs.core.Keyword("actor","roles","actor/roles",186081855).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
});
knoxx.backend.domain.policy.sql_adapter.project_actor_BANG_ = (function knoxx$backend$domain$policy$sql_adapter$project_actor_BANG_(store,actor){
var validated = knoxx.backend.domain.policy.protocol.validate_actor_BANG_(actor);
var actor_id = new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(validated);
var email = (function (){var or__5162__auto__ = knoxx.backend.domain.policy.sql_adapter.normalize_email(new cljs.core.Keyword("actor","email","actor/email",1189986301).cljs$core$IFn$_invoke$arity$1(validated));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.domain.policy.sql_adapter.actor_email_from_id(actor_id);
}
})();
var display_name = (function (){var or__5162__auto__ = (function (){var G__21309 = new cljs.core.Keyword("actor","label","actor/label",-1796720603).cljs$core$IFn$_invoke$arity$1(validated);
var G__21309__$1 = (((G__21309 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21309)));
var G__21309__$2 = (((G__21309__$1 == null))?null:clojure.string.trim(G__21309__$1));
if((G__21309__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21309__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = actor_id;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return email;
}
}
})();
var auth_provider = "actor-contract";
var role_slugs = knoxx.backend.domain.policy.sql_adapter.actor_role_slugs(validated);
return knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_(store,knoxx.backend.domain.policy.sql_adapter.actor_user_upsert_query(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),display_name,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),auth_provider,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),null,new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null))).then((function (user){
var org_promise = (function (){var temp__5823__auto__ = (function (){var G__21311 = new cljs.core.Keyword("actor","org","actor/org",175993262).cljs$core$IFn$_invoke$arity$1(validated);
var G__21311__$1 = (((G__21311 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21311)));
var G__21311__$2 = (((G__21311__$1 == null))?null:clojure.string.trim(G__21311__$1));
if((G__21311__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21311__$2);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var org_slug = temp__5823__auto__;
var fexpr__21313 = new cljs.core.Keyword(null,"find-org-by-slug!","find-org-by-slug!",2122494329).cljs$core$IFn$_invoke$arity$1(store);
return (fexpr__21313.cljs$core$IFn$_invoke$arity$1 ? fexpr__21313.cljs$core$IFn$_invoke$arity$1(org_slug) : fexpr__21313.call(null,org_slug));
} else {
return Promise.resolve(null);
}
})();
return org_promise.then((function (org){
var target_org = (function (){var or__5162__auto__ = org;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"primary-org","primary-org",-717687488).cljs$core$IFn$_invoke$arity$1(store);
}
})();
if(cljs.core.truth_(target_org)){
} else {
throw (new Error("primary org is required for actor projection sync"));
}

return knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_(store,knoxx.backend.domain.policy.sql_adapter.actor_membership_upsert_query(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(target_org),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id,new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"is-default","is-default",1401171070),true], null)));
})).then((function (membership){
var temp__5823__auto__ = new cljs.core.Keyword(null,"set-membership-roles!","set-membership-roles!",668277417).cljs$core$IFn$_invoke$arity$1(store);
if(cljs.core.truth_(temp__5823__auto__)){
var set_roles_BANG_ = temp__5823__auto__;
return (function (){var G__21314 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership);
var G__21315 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"role-ids","role-ids",652985101),[],new cljs.core.Keyword(null,"replace","replace",-786587770),true,new cljs.core.Keyword(null,"contract-projection","contract-projection",-1495437365),true], null);
return (set_roles_BANG_.cljs$core$IFn$_invoke$arity$2 ? set_roles_BANG_.cljs$core$IFn$_invoke$arity$2(G__21314,G__21315) : set_roles_BANG_.call(null,G__21314,G__21315));
})().then((function (_){
return membership;
})).catch((function (err){
console.warn("[policy-sql] actor role projection failed; keeping actor membership",actor_id,err.message);

return membership;
}));
} else {
return membership;
}
}));
}));
});
(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$list_contracts$arity$2 = (function (_store,_contract_class){
var _store__$1 = this;
throw (new Error("SQL policy adapter is projection-only; read canonical contracts through the EDN adapter."));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$get_contract$arity$3 = (function (_store,_contract_class,_contract_id){
var _store__$1 = this;
throw (new Error("SQL policy adapter is projection-only; read canonical contracts through the EDN adapter."));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_contract_BANG_$arity$3 = (function (_store,_contract_class,_contract){
var _store__$1 = this;
throw (new Error("SQL policy adapter is projection-only; write canonical contracts through the EDN adapter."));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$list_actors$arity$1 = (function (_store){
var _store__$1 = this;
return knoxx.backend.domain.policy.protocol.list_contracts(_store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398));
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$get_actor$arity$2 = (function (_store,actor_id){
var _store__$1 = this;
return knoxx.backend.domain.policy.protocol.get_contract(_store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398),actor_id);
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$PolicyStore$upsert_actor_BANG_$arity$2 = (function (_store,actor){
var _store__$1 = this;
return knoxx.backend.domain.policy.protocol.upsert_contract_BANG_(_store__$1,new cljs.core.Keyword(null,"actors","actors",-1845636398),actor);
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorCredentialStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorCredentialStore$list_actor_credentials$arity$2 = (function (store,provider){
var store__$1 = this;
var provider__$1 = (function (){var G__21321 = provider;
var G__21321__$1 = (((G__21321 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21321)));
var G__21321__$2 = (((G__21321__$1 == null))?null:clojure.string.trim(G__21321__$1));
if((G__21321__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21321__$2);
}
})();
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider__$1)))){
return Promise.reject((new Error("provider is required")));
} else {
var vec__21322 = knoxx.backend.domain.policy.sql_adapter.format_sql(knoxx.backend.domain.policy.sql_adapter.actor_credentials_select_query(provider__$1));
var seq__21323 = cljs.core.seq(vec__21322);
var first__21324 = cljs.core.first(seq__21323);
var seq__21323__$1 = cljs.core.next(seq__21323);
var sql_str = first__21324;
var params = seq__21323__$1;
return (function (){var fexpr__21325 = store__$1.query_BANG_;
return (fexpr__21325.cljs$core$IFn$_invoke$arity$2 ? fexpr__21325.cljs$core$IFn$_invoke$arity$2(sql_str,params) : fexpr__21325.call(null,sql_str,params));
})().then((function (result){
return cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2((function (p1__21318_SHARP_){
return clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"actorId","actorId",989542370).cljs$core$IFn$_invoke$arity$1(p1__21318_SHARP_))));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.domain.policy.sql_adapter.row__GT_credential,new cljs.core.Keyword(null,"rows","rows",850049680).cljs$core$IFn$_invoke$arity$1(result))));
}));
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorCredentialStore$get_actor_credential$arity$3 = (function (store,actor_id,provider){
var store__$1 = this;
var actor_id__$1 = (function (){var G__21327 = actor_id;
var G__21327__$1 = (((G__21327 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21327)));
var G__21327__$2 = (((G__21327__$1 == null))?null:clojure.string.trim(G__21327__$1));
if((G__21327__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21327__$2);
}
})();
var provider__$1 = (function (){var G__21328 = provider;
var G__21328__$1 = (((G__21328 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21328)));
var G__21328__$2 = (((G__21328__$1 == null))?null:clojure.string.trim(G__21328__$1));
if((G__21328__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21328__$2);
}
})();
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id__$1)))){
return Promise.reject((new Error("actorId is required")));
} else {
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider__$1)))){
return Promise.reject((new Error("provider is required")));
} else {
return knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_(store__$1,knoxx.backend.domain.policy.sql_adapter.actor_credential_select_query(actor_id__$1,provider__$1)).then(knoxx.backend.domain.policy.sql_adapter.row__GT_credential);

}
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorCredentialStore$upsert_actor_credential_BANG_$arity$4 = (function (store,actor_id,provider,credential){
var store__$1 = this;
var actor_id__$1 = (function (){var G__21330 = actor_id;
var G__21330__$1 = (((G__21330 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21330)));
var G__21330__$2 = (((G__21330__$1 == null))?null:clojure.string.trim(G__21330__$1));
if((G__21330__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21330__$2);
}
})();
var provider__$1 = (function (){var G__21331 = provider;
var G__21331__$1 = (((G__21331 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21331)));
var G__21331__$2 = (((G__21331__$1 == null))?null:clojure.string.trim(G__21331__$1));
if((G__21331__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21331__$2);
}
})();
var user_id = (function (){var G__21332 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"user-id","user-id",-206822291).cljs$core$IFn$_invoke$arity$1(credential);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(credential);
}
})();
var G__21332__$1 = (((G__21332 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21332)));
var G__21332__$2 = (((G__21332__$1 == null))?null:clojure.string.trim(G__21332__$1));
if((G__21332__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21332__$2);
}
})();
var org_id = (function (){var G__21334 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"org-id","org-id",1485182668).cljs$core$IFn$_invoke$arity$1(credential);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(credential);
}
})();
var G__21334__$1 = (((G__21334 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__21334)));
var G__21334__$2 = (((G__21334__$1 == null))?null:clojure.string.trim(G__21334__$1));
if((G__21334__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__21334__$2);
}
})();
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id__$1)))){
return Promise.reject((new Error("actorId is required")));
} else {
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider__$1)))){
return Promise.reject((new Error("provider is required")));
} else {
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)))){
return Promise.reject((new Error("userId is required")));
} else {
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)))){
return Promise.reject((new Error("orgId is required")));
} else {
return knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_(store__$1,knoxx.backend.domain.policy.sql_adapter.actor_membership_select_query(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291),user_id,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null))).then((function (membership){
if(cljs.core.not(membership)){
return Promise.reject((new Error("actor membership not found")));
} else {
return knoxx.backend.domain.policy.sql_adapter.execute_one_BANG_(store__$1,knoxx.backend.domain.policy.sql_adapter.actor_credential_upsert_query(new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),user_id,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"provider","provider",-302056900),provider__$1,new cljs.core.Keyword(null,"kind","kind",-717265803),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(credential);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "credential";
}
})(),new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778),new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613).cljs$core$IFn$_invoke$arity$1(credential),new cljs.core.Keyword(null,"secret-json","secret-json",-436252008),JSON.stringify(cljs.core.clj__GT_js((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"secretJson","secretJson",1807839704).cljs$core$IFn$_invoke$arity$1(credential);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())),new cljs.core.Keyword(null,"status","status",-1997798413),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(credential);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()], null)));
}
})).then(knoxx.backend.domain.policy.sql_adapter.row__GT_credential);

}
}
}
}
}));

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorProjectionStore$ = cljs.core.PROTOCOL_SENTINEL);

(knoxx.backend.domain.policy.sql_adapter.SqlPolicyStore.prototype.knoxx$backend$domain$policy$protocol$ActorProjectionStore$sync_actor_projections_BANG_$arity$2 = (function (store,actors){
var store__$1 = this;
return Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__21319_SHARP_){
return knoxx.backend.domain.policy.sql_adapter.project_actor_BANG_(store__$1,p1__21319_SHARP_);
}),actors))).then((function (_){
return null;
}));
}));

//# sourceMappingURL=knoxx.backend.domain.policy.sql_adapter.js.map
