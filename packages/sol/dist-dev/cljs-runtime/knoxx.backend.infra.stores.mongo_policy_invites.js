import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_invites');
knoxx.backend.infra.stores.mongo_policy_invites.INVITES_COLLECTION = "knoxx_invites";
knoxx.backend.infra.stores.mongo_policy_invites.invites_coll = (function knoxx$backend$infra$stores$mongo_policy_invites$invites_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_invites.INVITES_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_invites.keywordize = (function knoxx$backend$infra$stores$mongo_policy_invites$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Adapt a knoxx_invites document into a PG-shaped invites row.
 * :invite_id → :id, drops :_id.
 */
knoxx.backend.infra.stores.mongo_policy_invites.invite_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_invites$invite_doc__GT_row(doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"invite_id","invite_id",2130096996).cljs$core$IFn$_invoke$arity$1(doc)),new cljs.core.Keyword(null,"invite_id","invite_id",2130096996),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
/**
 * Create invite indexes. Idempotent.
 * Unique on code mirrors PG's UNIQUE (code).
 * Lookup indexes on (org_id, status) and (org_id) support list queries.
 */
knoxx.backend.infra.stores.mongo_policy_invites.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_invites$setup_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_invites.invites_coll(db);
(await coll.createIndex(({"code": (1)}),({"unique": true})));

(await coll.createIndex(({"org_id": (1), "status": (1), "created_at": (-1)})));

(await coll.createIndex(({"org_id": (1), "created_at": (-1)})));

return true;
});
/**
 * Insert a new invite. Returns the created row.
 * Mirrors PG shape.db.invites/insert.
 */
knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_invites$insert_invite_BANG_(var_args){
var G__25658 = arguments.length;
switch (G__25658) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (invite){
return knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),invite);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25670){
var map__25671 = p__25670;
var map__25671__$1 = cljs.core.__destructure_map(map__25671);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var code = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"code","code",1586293142));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var inviter_membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"inviter-membership-id","inviter-membership-id",294607735));
var role_slugs_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"role-slugs-json","role-slugs-json",-1985294108));
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25671__$1,new cljs.core.Keyword(null,"expires-at","expires-at",1654982210));
var coll = knoxx.backend.infra.stores.mongo_policy_invites.invites_coll(db);
var now = (new Date());
var role_slugs = (cljs.core.truth_(role_slugs_json)?((typeof role_slugs_json === 'string')?JSON.parse(role_slugs_json):cljs.core.clj__GT_js(role_slugs_json)):null);
(await coll.insertOne(cljs.core.clj__GT_js(cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"expires_at","expires_at",-423028958),new cljs.core.Keyword(null,"invite_id","invite_id",2130096996),new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"code","code",1586293142),new cljs.core.Keyword(null,"inviter_membership_id","inviter_membership_id",1772406330),new cljs.core.Keyword(null,"created_at","created_at",1484050750)],[clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email))),expires_at,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())),role_slugs,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)),knoxx.backend.infra.system_instance.current_id(),"pending",code,inviter_membership_id,now]))));

var doc = knoxx.backend.infra.stores.mongo_policy_invites.keywordize((await coll.findOne(({"code": code}))));
return knoxx.backend.infra.stores.mongo_policy_invites.invite_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Find a pending, non-expired invite by code. Returns the row or nil.
 * Mirrors PG shape.db.invites/pending-by-code.
 */
knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_invites$pending_by_code_BANG_(var_args){
var G__25690 = arguments.length;
switch (G__25690) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (code){
return knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),code);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,code){
var coll = knoxx.backend.infra.stores.mongo_policy_invites.invites_coll(db);
var now = (new Date());
var doc = knoxx.backend.infra.stores.mongo_policy_invites.keywordize((await coll.findOne(({"code": code, "status": "pending", "expires_at": ({"$gt": now})}))));
return knoxx.backend.infra.stores.mongo_policy_invites.invite_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Mark an invite as redeemed. Returns the updated row.
 * Mirrors PG shape.db.invites/redeem.
 */
knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_invites$redeem_invite_BANG_(var_args){
var G__25731 = arguments.length;
switch (G__25731) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (invite_id){
return knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),invite_id);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,invite_id){
var coll = knoxx.backend.infra.stores.mongo_policy_invites.invites_coll(db);
var now = (new Date());
(await coll.updateOne(({"invite_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(invite_id))}),({"$set": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"status","status",-1997798413),"redeemed",new cljs.core.Keyword(null,"redeemed_at","redeemed_at",-1486030703),now], null))})));

var doc = knoxx.backend.infra.stores.mongo_policy_invites.keywordize((await coll.findOne(({"invite_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(invite_id))}))));
return knoxx.backend.infra.stores.mongo_policy_invites.invite_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Return invites for an org, optionally filtered by status, ordered by created_at desc.
 * Mirrors PG shape.db.invites/list-by-org and list-by-org-and-status.
 */
knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_invites$list_invites_by_org_BANG_(var_args){
var G__25774 = arguments.length;
switch (G__25774) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (org_id){
return knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),org_id,null);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (org_id,status){
return knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),org_id,status);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,org_id,status){
var coll = knoxx.backend.infra.stores.mongo_policy_invites.invites_coll(db);
var query = (await (async function (){var G__25802 = new cljs.core.PersistentArrayMap(null, 1, ["org_id",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))], null);
if(cljs.core.truth_(status)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25802,"status",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(status)));
} else {
return G__25802;
}
})());
var cursor = coll.find(cljs.core.clj__GT_js(query),({"sort": ({"created_at": (-1)})}));
var docs = knoxx.backend.infra.stores.mongo_policy_invites.keywordize((await cursor.toArray()));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_invites.invite_doc__GT_row,docs);
}));

(knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$lang$maxFixedArity = 3);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_invites.js.map
