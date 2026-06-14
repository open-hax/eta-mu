import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_directory');
knoxx.backend.infra.stores.mongo_policy_directory.ORGS_COLLECTION = "knoxx_orgs";
knoxx.backend.infra.stores.mongo_policy_directory.USERS_COLLECTION = "knoxx_users";
knoxx.backend.infra.stores.mongo_policy_directory.MEMBERSHIPS_COLLECTION = "knoxx_memberships";
knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll = (function knoxx$backend$infra$stores$mongo_policy_directory$orgs_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_directory.ORGS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_directory.users_coll = (function knoxx$backend$infra$stores$mongo_policy_directory$users_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_directory.USERS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll = (function knoxx$backend$infra$stores$mongo_policy_directory$memberships_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_directory.MEMBERSHIPS_COLLECTION);
});
/**
 * Generic doc->row: rename the stored id-key to :id, drop Mongo's _id.
 */
knoxx.backend.infra.stores.mongo_policy_directory.doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_directory$doc__GT_row(id_key,doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.get.cljs$core$IFn$_invoke$arity$2(doc,id_key)),id_key,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
/**
 * Adapt a knoxx_orgs document into a PG-shaped orgs row (:id + columns).
 */
knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_directory$org_doc__GT_row(doc){
return knoxx.backend.infra.stores.mongo_policy_directory.doc__GT_row(new cljs.core.Keyword(null,"org_id","org_id",1380185385),doc);
});
/**
 * Adapt a knoxx_users document into a PG-shaped users row (:id + columns).
 */
knoxx.backend.infra.stores.mongo_policy_directory.user_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_directory$user_doc__GT_row(doc){
return knoxx.backend.infra.stores.mongo_policy_directory.doc__GT_row(new cljs.core.Keyword(null,"user_id","user_id",993497112),doc);
});
/**
 * Adapt a knoxx_memberships document into a PG-shaped memberships row.
 */
knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_directory$membership_doc__GT_row(doc){
return knoxx.backend.infra.stores.mongo_policy_directory.doc__GT_row(new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),doc);
});
knoxx.backend.infra.stores.mongo_policy_directory.keywordize = (function knoxx$backend$infra$stores$mongo_policy_directory$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Create directory uniqueness + FK-access lookup indexes. Idempotent.
 * 
 * Unique: orgs.slug, users.email, memberships (user_id+org_id compound) —
 * mirroring the PG UNIQUE constraints that back the ON CONFLICT upserts.
 * Lookup: memberships.org_id and memberships.actor_id mirror the PG FK
 * access patterns (idx_memberships_org_id / idx_memberships_actor_id).
 */
knoxx.backend.infra.stores.mongo_policy_directory.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$setup_indexes_BANG_(db){
var orgs = knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db);
var users = knoxx.backend.infra.stores.mongo_policy_directory.users_coll(db);
var memberships = knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db);
(await orgs.createIndex(({"slug": (1)}),({"unique": true})));

(await users.createIndex(({"email": (1)}),({"unique": true})));

(await memberships.createIndex(({"user_id": (1), "org_id": (1)}),({"unique": true})));

(await memberships.createIndex(({"org_id": (1)})));

(await memberships.createIndex(({"actor_id": (1)})));

return true;
});
/**
 * Case-insensitive slug lookup. Mirrors q-orgs/by-slug; returns a row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_org_by_slug(var_args){
var G__25645 = arguments.length;
switch (G__25645) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$1 = (async function (slug){
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),slug);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2 = (async function (db,slug){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).findOne(({"slug": clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)))})))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$lang$maxFixedArity = 2);

/**
 * Lookup an org by its id (mirrors q-orgs/by-id). Returns a row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_org_by_id_BANG_(var_args){
var G__25672 = arguments.length;
switch (G__25672) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (org_id){
return knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,org_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).findOne(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Upsert the primary org by slug (q-orgs/upsert-primary): on insert sets
 * defaults, on conflict updates name/kind and forces is_primary true.
 * Slug is canonicalised to lower-case so write and read paths agree.
 * The single-primary invariant is enforced with one pipeline updateMany
 * computing is_primary from slug equality — atomic enough that concurrent
 * calls always converge on exactly one primary (stronger than PG's
 * two-statement upsert + clear-primary-except).
 */
knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$ensure_primary_org_BANG_(var_args){
var G__25689 = arguments.length;
switch (G__25689) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25697){
var map__25699 = p__25697;
var map__25699__$1 = cljs.core.__destructure_map(map__25699);
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25699__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25699__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25699__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var now = (new Date());
var lower_slug = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)));
var result = (await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).findOneAndUpdate(({"slug": lower_slug}),({"$set": ({"name": name, "kind": kind, "is_primary": true, "updated_at": now}), "$setOnInsert": ({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())), "status": "active", "system_instance_id": knoxx.backend.infra.system_instance.current_id(), "created_at": now})}),({"upsert": true, "returnDocument": "after"})));
(await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).updateMany(({}),cljs.core.clj__GT_js(new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.PersistentArrayMap(null, 1, ["$set",new cljs.core.PersistentArrayMap(null, 1, ["is_primary",new cljs.core.PersistentArrayMap(null, 1, ["$eq",new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, ["$slug",lower_slug], null)], null)], null)], null)], null))));

return knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize(result));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Insert a non-primary org (q-orgs/insert). Slug is canonicalised to
 * lower-case so find-org-by-slug always agrees. Returns the inserted row.
 */
knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$create_org_BANG_(var_args){
var G__25715 = arguments.length;
switch (G__25715) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25728){
var map__25729 = p__25728;
var map__25729__$1 = cljs.core.__destructure_map(map__25729);
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25729__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25729__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25729__$1,new cljs.core.Keyword(null,"kind","kind",-717265803),"customer");
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25729__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
var now = (new Date());
var doc = cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"created_at","created_at",1484050750)],[clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug))),name,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())),knoxx.backend.infra.system_instance.current_id(),now,false,status,kind,now]);
(await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).insertOne(cljs.core.clj__GT_js(doc)));

return knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * List orgs with denormalised member_count, ordered is_primary desc then
 * name (q-orgs/list-with-counts). role_count/data_lake_count are 0 here:
 * roles + data_lakes are later migration slices, so this twin reports the
 * columns it owns and zeroes the not-yet-migrated joins.
 */
knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$list_orgs_BANG_(var_args){
var G__25750 = arguments.length;
switch (G__25750) {
case 0:
return knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$0();

break;
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$0 = (async function (){
return knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.mongo_client.get_db());
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (db){
var orgs = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).find(({})).toArray())));
var memberships = knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).find(({})).toArray()));
var counts = cljs.core.frequencies(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"org_id","org_id",1380185385),memberships));
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2((function (p1__25742_SHARP_){
if(cljs.core.truth_(new cljs.core.Keyword(null,"is_primary","is_primary",-612440015).cljs$core$IFn$_invoke$arity$1(p1__25742_SHARP_))){
return (0);
} else {
return (1);
}
}),new cljs.core.Keyword(null,"name","name",1843675177)),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (o){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(o,new cljs.core.Keyword(null,"member_count","member_count",-408355091),cljs.core.get.cljs$core$IFn$_invoke$arity$3(counts,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),(0)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"role_count","role_count",-736226926),(0),new cljs.core.Keyword(null,"data_lake_count","data_lake_count",-1372574467),(0)], 0));
}),orgs)));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$lang$maxFixedArity = 1);

/**
 * Upsert a user by email (q-users/upsert): email is lower-cased; on conflict
 * updates display_name/auth_provider/external_subject/status; on insert sets
 * defaults + a fresh user_id. Returns the resulting row.
 */
knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$create_user_BANG_(var_args){
var G__25775 = arguments.length;
switch (G__25775) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25789){
var map__25790 = p__25789;
var map__25790__$1 = cljs.core.__destructure_map(map__25790);
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25790__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25790__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25790__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25790__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25790__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
var now = (new Date());
var lower_email = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)));
var result = (await knoxx.backend.infra.stores.mongo_policy_directory.users_coll(db).findOneAndUpdate(({"email": lower_email}),({"$set": ({"display_name": display_name, "auth_provider": auth_provider, "external_subject": external_subject, "status": status, "updated_at": now}), "$setOnInsert": ({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())), "email": lower_email, "system_instance_id": knoxx.backend.infra.system_instance.current_id(), "created_at": now})}),({"upsert": true, "returnDocument": "after"})));
return knoxx.backend.infra.stores.mongo_policy_directory.user_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize(result));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Case-insensitive active-or-any user lookup by email. Returns a PG-shaped
 * row or nil. Email is lower-cased to match the write path.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_user_by_email_BANG_(var_args){
var G__25800 = arguments.length;
switch (G__25800) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (email){
return knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),email);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,email){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_directory.user_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.users_coll(db).findOne(({"email": clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)))})))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * List users ordered by display_name then email (q-users/list-all). When
 * org-id is given, only users with a membership in that org (q-users/
 * list-by-org). Returns PG-shaped rows.
 */
knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$list_users_BANG_(var_args){
var G__25826 = arguments.length;
switch (G__25826) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25833){
var map__25834 = p__25833;
var map__25834__$1 = cljs.core.__destructure_map(map__25834);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25834__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var users = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.user_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.users_coll(db).find(({})).toArray())));
var scoped = ((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))))?users:(await (async function (){var members = knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).find(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})).toArray()));
var member_ids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"user_id","user_id",993497112),members));
return cljs.core.filterv((function (p1__25811_SHARP_){
return cljs.core.contains_QMARK_(member_ids,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(p1__25811_SHARP_));
}),users);
})()));
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.Keyword(null,"email","email",1415816706)),scoped));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Upsert a membership by (user_id, org_id) (q-memberships/upsert): on
 * conflict updates status/is_default; on insert sets defaults + a fresh
 * membership_id and a null actor_id (PG actor_id is nullable, filled later
 * by set-membership-actor-id!). Returns the resulting row.
 */
knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$upsert_membership_BANG_(var_args){
var G__25867 = arguments.length;
switch (G__25867) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25872){
var map__25877 = p__25872;
var map__25877__$1 = cljs.core.__destructure_map(map__25877);
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25877__$1,new cljs.core.Keyword(null,"user-id","user-id",-206822291));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25877__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25877__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
var is_default = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__25877__$1,new cljs.core.Keyword(null,"is-default","is-default",1401171070),false);
var now = (new Date());
var result = (await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).findOneAndUpdate(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))}),({"$set": ({"status": status, "is_default": is_default, "updated_at": now}), "$setOnInsert": ({"membership_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())), "user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "actor_id": null, "system_instance_id": knoxx.backend.infra.system_instance.current_id(), "created_at": now})}),({"upsert": true, "returnDocument": "after"})));
return knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize(result));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Fetch a single membership by its id (mirrors q-memberships/bare-by-id).
 * Returns a PG-shaped row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$get_membership_BANG_(var_args){
var G__25887 = arguments.length;
switch (G__25887) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_id){
return knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).findOne(({"membership_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id))})))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * List memberships for an org ordered by created_at asc
 * (q-memberships/list-by-org). Returns PG-shaped rows.
 */
knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$list_memberships_BANG_(var_args){
var G__25905 = arguments.length;
switch (G__25905) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25917){
var map__25918 = p__25917;
var map__25918__$1 = cljs.core.__destructure_map(map__25918);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25918__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)))){
throw (new Error("org-id is required"));
} else {
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p1__25893_SHARP_){
var G__25919 = new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(p1__25893_SHARP_);
if((G__25919 == null)){
return null;
} else {
return G__25919.getTime();
}
}),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).find(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Fetch the membership row for a (user_id, org_id) pair (mirrors
 * q-memberships/by-user-and-org). Returns a PG-shaped row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_membership_by_user_and_org_BANG_(var_args){
var G__25928 = arguments.length;
switch (G__25928) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (user_id,org_id){
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,user_id,org_id){
return knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})))));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Set actor_id on a membership (q-memberships/set-actor-id). Defaults a blank
 * actor-id to "workspace_user" like infra.db.policy/set-membership-actor-id!.
 * Returns the resolved actor-id string.
 */
knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$set_membership_actor_id_BANG_(var_args){
var G__25978 = arguments.length;
switch (G__25978) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (membership_id,actor_id){
return knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),membership_id,actor_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,membership_id,actor_id){
var resolved = (await (async function (){var or__5162__auto__ = (await (async function (){var G__25982 = actor_id;
var G__25982__$1 = (((G__25982 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__25982)));
var G__25982__$2 = (((G__25982__$1 == null))?null:clojure.string.trim(G__25982__$1));
if((G__25982__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__25982__$2);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "workspace_user";
}
})());
(await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).updateOne(({"membership_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id))}),({"$set": ({"actor_id": resolved, "updated_at": (new Date())})})));

return resolved;
}));

(knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Attach :org_name + :org_slug to each membership row from the orgs
 * collection, mirroring the PG list-by-org / memberships-for-users joins.
 */
knoxx.backend.infra.stores.mongo_policy_directory.attach_org_columns = (async function knoxx$backend$infra$stores$mongo_policy_directory$attach_org_columns(db,memberships){
var orgs_by_id = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (m,o){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),o);
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).find(({})).toArray()))));
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (m){
var o = cljs.core.get.cljs$core$IFn$_invoke$arity$2(orgs_by_id,new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(m));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(m,new cljs.core.Keyword(null,"org_name","org_name",-1732897410),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(o),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(o)], 0));
}),memberships);
});
/**
 * list-memberships! enriched with the :org_name/:org_slug columns the PG
 * q-memberships/list-by-org join carried (consumed by hydrate-membership-row).
 */
knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$list_memberships_with_org_BANG_(var_args){
var G__26030 = arguments.length;
switch (G__26030) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,opts){
return (await knoxx.backend.infra.stores.mongo_policy_directory.attach_org_columns(db,(await knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(db,opts))));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Membership rows for a set of user ids (optionally org-scoped), enriched with
 * :org_name/:org_slug. Mirrors q-users/memberships-for-users /
 * all-memberships-for-users joins. Ordered by created_at asc.
 */
knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$memberships_for_users_with_org_BANG_(var_args){
var G__26041 = arguments.length;
switch (G__26041) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (user_ids,org_id){
return knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),user_ids,org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,user_ids,org_id){
var uids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,user_ids));
var query = (await (async function (){var G__26063 = cljs.core.PersistentArrayMap.EMPTY;
if((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)))))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26063,"org_id",(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)));
} else {
return G__26063;
}
})());
var members = cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p1__26037_SHARP_){
var G__26065 = new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(p1__26037_SHARP_);
if((G__26065 == null)){
return null;
} else {
return G__26065.getTime();
}
}),cljs.core.filterv((function (p1__26036_SHARP_){
return cljs.core.contains_QMARK_(uids,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(p1__26036_SHARP_))));
}),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).find(cljs.core.clj__GT_js(query)).toArray()))))));
return (await knoxx.backend.infra.stores.mongo_policy_directory.attach_org_columns(db,members));
}));

(knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Flatten a membership row + its user row + its org row into one PG-shaped
 * row with the exact snake_case keys shape.db.memberships/base-query selects:
 * :email :display_name :user_status :org_slug :org_name :org_status
 * :is_primary :org_kind on top of the membership columns. Returns nil if the
 * membership has no resolvable user or org.
 */
knoxx.backend.infra.stores.mongo_policy_directory.merge_membership_user_org = (function knoxx$backend$infra$stores$mongo_policy_directory$merge_membership_user_org(membership,user,org){
if(cljs.core.truth_((function (){var and__5160__auto__ = membership;
if(cljs.core.truth_(and__5160__auto__)){
var and__5160__auto____$1 = user;
if(cljs.core.truth_(and__5160__auto____$1)){
return org;
} else {
return and__5160__auto____$1;
}
} else {
return and__5160__auto__;
}
})())){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(membership,new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(user),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"display_name","display_name",-1494335013),new cljs.core.Keyword(null,"display_name","display_name",-1494335013).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"user_status","user_status",-1364737026),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"org_name","org_name",-1732897410),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"org_status","org_status",-648531199),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"org_kind","org_kind",-101702006),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(org)], 0));
} else {
return null;
}
});
/**
 * Composed lookup by membership-id mirroring q-memberships/by-id over
 * base-query: fetch the membership, its user, and its org, then merge into a
 * single flat row carrying the joined columns. Returns the row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_membership_row_with_user_org_BANG_(var_args){
var G__26131 = arguments.length;
switch (G__26131) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_id){
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_id);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id)))){
return null;
} else {
var temp__5825__auto__ = (await knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$2(db,membership_id));
if(cljs.core.truth_(temp__5825__auto__)){
var membership = temp__5825__auto__;
var user = knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.users_coll(db).findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(membership)))}))));
var org = knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).findOne(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(membership)))}))));
return knoxx.backend.infra.stores.mongo_policy_directory.merge_membership_user_org(membership,knoxx.backend.infra.stores.mongo_policy_directory.user_doc__GT_row(user),knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row(org));
} else {
return null;
}
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Composed lookup by user email (+ optional org scope) mirroring
 * q-memberships/by-email-and-org over base-query. Resolves the user by email,
 * collects active+matching memberships, picks the default-first / primary-org
 * one, and merges into a flat joined row. Returns the row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_directory$find_membership_row_by_email_and_org_BANG_(var_args){
var G__26145 = arguments.length;
switch (G__26145) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__26148){
var map__26149 = p__26148;
var map__26149__$1 = cljs.core.__destructure_map(map__26149);
var user_email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26149__$1,new cljs.core.Keyword(null,"user-email","user-email",2126479881));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26149__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var org_slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26149__$1,new cljs.core.Keyword(null,"org-slug","org-slug",-726595051));
var active_only = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26149__$1,new cljs.core.Keyword(null,"active-only","active-only",2028055565));
var temp__5825__auto__ = (await knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$2(db,user_email));
if(cljs.core.truth_(temp__5825__auto__)){
var user = temp__5825__auto__;
var scoped_org = (((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))))))?(await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$2(db,org_id)):(((!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_slug))))))?(await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2(db,org_slug)):null
));
var members = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.membership_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.memberships_coll(db).find(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user)))})).toArray())));
var orgs_by_id = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (m,o){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),o);
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_directory.org_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_directory.keywordize((await knoxx.backend.infra.stores.mongo_policy_directory.orgs_coll(db).find(({})).toArray()))));
var candidates = (await (async function (){var G__26160 = members;
var G__26160__$1 = (cljs.core.truth_(scoped_org)?cljs.core.filterv((function (p1__26137_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(p1__26137_SHARP_),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_org));
}),G__26160):G__26160);
if(cljs.core.truth_(active_only)){
return cljs.core.filterv((function (p1__26138_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("active",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(p1__26138_SHARP_));
}),G__26160__$1);
} else {
return G__26160__$1;
}
})());
var pick = cljs.core.first(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$3((function (p1__26139_SHARP_){
if(cljs.core.truth_(new cljs.core.Keyword(null,"is_default","is_default",-922813238).cljs$core$IFn$_invoke$arity$1(p1__26139_SHARP_))){
return (0);
} else {
return (1);
}
}),(function (p1__26140_SHARP_){
if(cljs.core.truth_(cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(orgs_by_id,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(p1__26140_SHARP_),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015)], null)))){
return (0);
} else {
return (1);
}
}),(function (p1__26141_SHARP_){
var G__26174 = new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(p1__26141_SHARP_);
if((G__26174 == null)){
return null;
} else {
return G__26174.getTime();
}
})),candidates));
if(cljs.core.truth_(pick)){
return knoxx.backend.infra.stores.mongo_policy_directory.merge_membership_user_org(pick,user,cljs.core.get.cljs$core$IFn$_invoke$arity$2(orgs_by_id,new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(pick)));
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$lang$maxFixedArity = 2);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_directory.js.map
