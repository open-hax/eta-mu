import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_roles');
knoxx.backend.infra.stores.mongo_policy_roles.ROLES_COLLECTION = "knoxx_roles";
knoxx.backend.infra.stores.mongo_policy_roles.ROLE_PERMISSIONS_COLLECTION = "knoxx_role_permissions";
knoxx.backend.infra.stores.mongo_policy_roles.MEMBERSHIP_ROLES_COLLECTION = "knoxx_membership_roles";
knoxx.backend.infra.stores.mongo_policy_roles.roles_coll = (function knoxx$backend$infra$stores$mongo_policy_roles$roles_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_roles.ROLES_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_roles.role_permissions_coll = (function knoxx$backend$infra$stores$mongo_policy_roles$role_permissions_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_roles.ROLE_PERMISSIONS_COLLECTION);
});
knoxx.backend.infra.stores.mongo_policy_roles.membership_roles_coll = (function knoxx$backend$infra$stores$mongo_policy_roles$membership_roles_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_roles.MEMBERSHIP_ROLES_COLLECTION);
});
/**
 * Adapt a knoxx_roles document into a PG-shaped roles row: rename role_id to
 * :id, drop Mongo's _id. Link tables have no synthetic id and need no adapter.
 */
knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_roles$role_doc__GT_row(doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),cljs.core.get.cljs$core$IFn$_invoke$arity$2(doc,new cljs.core.Keyword(null,"role_id","role_id",1603615897))),new cljs.core.Keyword(null,"role_id","role_id",1603615897),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_policy_roles.keywordize = (function knoxx$backend$infra$stores$mongo_policy_roles$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
knoxx.backend.infra.stores.mongo_policy_roles.lower = (function knoxx$backend$infra$stores$mongo_policy_roles$lower(v){
return clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(v)));
});
/**
 * One compound unique index {org_id, slug} mirrors BOTH PG constraints:
 * Mongo indexes a missing org_id as null and unique treats nulls as equal,
 * so (null, slug) enforces roles_platform_slug_uniq and (org, slug)
 * enforces roles_org_slug_uniq. partialFilterExpression is deliberately
 * avoided — it rejects {$exists false} (server error 67, observed live),
 * and the compound index also makes absent-vs-explicit-null org_id collide
 * at the uniqueness layer instead of dodging it. Plus idx_roles_org_id.
 */
knoxx.backend.infra.stores.mongo_policy_roles.setup_role_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$setup_role_indexes_BANG_(roles){
(await roles.createIndex(({"org_id": (1), "slug": (1)}),({"unique": true})));

return (await roles.createIndex(({"org_id": (1)})));
});
/**
 * Create roles uniqueness + role/link FK lookup indexes. Idempotent.
 * 
 * Mirrors the PG uniques exactly: roles via setup-role-indexes!;
 * role_permissions unique on (role_id, permission_code)
 * (role_permissions_role_code_uniq / PRIMARY KEY); membership_roles unique on
 * (membership_id, role_id) (PRIMARY KEY). Lookup indexes on
 * role_permissions.role_id and membership_roles.membership_id mirror the FK
 * delete/replace access paths.
 */
knoxx.backend.infra.stores.mongo_policy_roles.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$setup_indexes_BANG_(db){
var role_permissions = knoxx.backend.infra.stores.mongo_policy_roles.role_permissions_coll(db);
var membership_roles = knoxx.backend.infra.stores.mongo_policy_roles.membership_roles_coll(db);
(await knoxx.backend.infra.stores.mongo_policy_roles.setup_role_indexes_BANG_(knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db)));

(await role_permissions.createIndex(({"role_id": (1), "permission_code": (1)}),({"unique": true})));

(await role_permissions.createIndex(({"role_id": (1)})));

(await membership_roles.createIndex(({"membership_id": (1), "role_id": (1)}),({"unique": true})));

(await membership_roles.createIndex(({"membership_id": (1)})));

(await membership_roles.createIndex(({"role_id": (1)})));

return true;
});
/**
 * Mongo filter for q-roles/by-slug scope semantics: a nil org-id targets the
 * platform scope (org_id absent or null), otherwise the org-scoped row. Slug is
 * lower-cased to match the write path.
 */
knoxx.backend.infra.stores.mongo_policy_roles.role_scope_query = (function knoxx$backend$infra$stores$mongo_policy_roles$role_scope_query(p__25723){
var map__25725 = p__25723;
var map__25725__$1 = cljs.core.__destructure_map(map__25725);
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25725__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25725__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
if((org_id == null)){
return ({"slug": knoxx.backend.infra.stores.mongo_policy_roles.lower(slug), "org_id": null});
} else {
return ({"slug": knoxx.backend.infra.stores.mongo_policy_roles.lower(slug), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))});
}
});
/**
 * Scope-aware slug lookup (q-roles/by-slug). Returns a PG-shaped row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_roles.find_role = (async function knoxx$backend$infra$stores$mongo_policy_roles$find_role(var_args){
var G__25747 = arguments.length;
switch (G__25747) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25761){
var map__25766 = p__25761;
var map__25766__$1 = cljs.core.__destructure_map(map__25766);
var opts = map__25766__$1;
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25766__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).findOne(knoxx.backend.infra.stores.mongo_policy_roles.role_scope_query(opts)))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$lang$maxFixedArity = 2);

/**
 * Fetch a single role by its id (q-roles/by-id). Returns a row or nil.
 */
knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$get_role_by_id_BANG_(var_args){
var G__25794 = arguments.length;
switch (G__25794) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (role_id){
return knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),role_id);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,role_id){
if(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role_id)))){
return null;
} else {
return knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).findOne(({"role_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role_id))})))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Roles for a seq of ids, ordered by name (q-roles/by-ids). Backs the
 * detailed-membership-roles seam: the policy fn collects role-ids from a
 * membership then re-fetches the full rows in name order before hydrating.
 */
knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$list_roles_by_ids_BANG_(var_args){
var G__25809 = arguments.length;
switch (G__25809) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (role_ids){
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),role_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,role_ids){
var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,role_ids);
if(cljs.core.empty_QMARK_(ids)){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).find(({"role_id": ({"$in": cljs.core.clj__GT_js(ids)})})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * List roles ordered by built_in desc then name (q-roles/list-all). When
 * org-id is given, scope to that org (q-roles/list-by-org). Returns rows.
 */
knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$list_roles_BANG_(var_args){
var G__25852 = arguments.length;
switch (G__25852) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25856){
var map__25857 = p__25856;
var map__25857__$1 = cljs.core.__destructure_map(map__25857);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25857__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var query = (cljs.core.truth_(org_id)?({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))}):({}));
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2((function (p1__25821_SHARP_){
if(cljs.core.truth_(new cljs.core.Keyword(null,"built_in","built_in",-655972882).cljs$core$IFn$_invoke$arity$1(p1__25821_SHARP_))){
return (0);
} else {
return (1);
}
}),new cljs.core.Keyword(null,"name","name",1843675177)),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).find(query).toArray())))));
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Return id + slug rows for a seq of slugs across platform OR the given org
 * scope (q-roles/by-slugs-and-org). Backs resolve-role-ids: the policy fn
 * builds alias slug variants, looks them up here, then maps slug -> id.
 * Slugs are lower-cased to match the write path.
 */
knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$list_roles_by_slugs_BANG_(var_args){
var G__25886 = arguments.length;
switch (G__25886) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (slugs,org_id){
return knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),slugs,org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,slugs,org_id){
var wanted = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_roles.lower,slugs));
if(cljs.core.empty_QMARK_(wanted)){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (r){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"role_id","role_id",1603615897).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(r)], null);
}),cljs.core.filterv((function (p1__25880_SHARP_){
return cljs.core.contains_QMARK_(wanted,knoxx.backend.infra.stores.mongo_policy_roles.lower(new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(p1__25880_SHARP_)));
}),knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).find(({"$or": [({"org_id": null}),({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})]})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Find-or-write a role by scope+slug (infra.db.policy/ensure-role!, which
 * fuses q-roles/by-slug + insert/update-role). On hit, update the mutable
 * attrs (name/scope_kind/built_in/system_managed) + updated_at; on miss,
 * insert with a fresh role_id. Slug is lower-cased so find-role agrees.
 * Returns the resulting PG-shaped row.
 */
knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$ensure_role_BANG_(var_args){
var G__25973 = arguments.length;
switch (G__25973) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (opts){
return knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),opts);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,p__25981){
var map__25983 = p__25981;
var map__25983__$1 = cljs.core.__destructure_map(map__25983);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var scope_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465));
var built_in = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"built-in","built-in",1245067766));
var system_managed = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25983__$1,new cljs.core.Keyword(null,"system-managed","system-managed",-191362489));
var now = (new Date());
var lower_slug = knoxx.backend.infra.stores.mongo_policy_roles.lower(slug);
var existing = (await knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"slug","slug",2029314850),lower_slug], null)));
var attrs = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188),scope_kind,new cljs.core.Keyword(null,"built_in","built_in",-655972882),cljs.core.boolean$(built_in),new cljs.core.Keyword(null,"system_managed","system_managed",-1147228921),cljs.core.boolean$(system_managed)], null);
if(cljs.core.truth_(existing)){
(await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).updateOne(({"role_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(existing)))}),({"$set": cljs.core.clj__GT_js(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(attrs,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),now))})));

return (await knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(existing)));
} else {
var doc = (await (async function (){var G__26014 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(attrs,new cljs.core.Keyword(null,"role_id","role_id",1603615897),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"slug","slug",2029314850),lower_slug,new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188),(await (async function (){var or__5162__auto__ = scope_kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "org";
}
})()),new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id(),new cljs.core.Keyword(null,"created_at","created_at",1484050750),now,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),now], 0));
if((!((org_id == null)))){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26014,new cljs.core.Keyword(null,"org_id","org_id",1380185385),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)));
} else {
return G__26014;
}
})());
(await knoxx.backend.infra.stores.mongo_policy_roles.roles_coll(db).insertOne(cljs.core.clj__GT_js(doc)));

return knoxx.backend.infra.stores.mongo_policy_roles.role_doc__GT_row(doc);
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * permission_code rows for a set of role ids, ordered by permission_code
 * (q-roles/permissions-for-roles, modern schema). Returns rows shaped
 * {:role_id .. :code ..} matching the alias the PG builder selects, so the
 * policy grouped-role-permissions reducer hydrates identically. The legacy
 * permission_id join (permissions-for-roles-legacy) has no Mongo twin: the
 * twins are born on the modern permission_code schema.
 */
knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$permissions_for_roles_BANG_(var_args){
var G__26034 = arguments.length;
switch (G__26034) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (role_ids){
return knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),role_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,role_ids){
var ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,role_ids);
if(cljs.core.empty_QMARK_(ids)){
return cljs.core.PersistentVector.EMPTY;
} else {
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"code","code",1586293142),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p){
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"role_id","role_id",1603615897),new cljs.core.Keyword(null,"role_id","role_id",1603615897).cljs$core$IFn$_invoke$arity$1(p),new cljs.core.Keyword(null,"code","code",1586293142),new cljs.core.Keyword(null,"permission_code","permission_code",-2022293866).cljs$core$IFn$_invoke$arity$1(p)], null);
}),knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.role_permissions_coll(db).find(({"role_id": ({"$in": cljs.core.clj__GT_js(ids)})})).toArray())))));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Replace-set a role's permission codes (infra.db.policy/set-role-permissions-tx!:
 * delete-permissions then insert-permission-modern per code, inside a PG
 * transaction). Mongo twin: deleteMany then insertMany (effect always
 * 'allow', matching the modern builder). An empty code set therefore CLEARS
 * all permissions for the role.
 * 
 * PG TRANSACTION SEMANTICS: the PG path is atomic (delete+insert in one tx);
 * this twin is NON-ATOMIC — there is a window after the deleteMany and before
 * the insertMany where the role has no permissions. Acceptable under the
 * single-writer-per-system-instance assumption (no concurrent writer races a
 * reader through that window). No converge-style single statement exists
 * here because the replacement is a SET of rows, not one computed field, so
 * the directory slice's pipeline updateMany trick does not apply.
 */
knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$set_role_permissions_BANG_(var_args){
var G__26057 = arguments.length;
switch (G__26057) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (role_id,codes){
return knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),role_id,codes);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,role_id,codes){
var rid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(role_id));
var unique_codes = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,codes)));
(await knoxx.backend.infra.stores.mongo_policy_roles.role_permissions_coll(db).deleteMany(({"role_id": rid})));

if(cljs.core.seq(unique_codes)){
var docs_26240 = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (c){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"role_id","role_id",1603615897),rid,new cljs.core.Keyword(null,"permission_code","permission_code",-2022293866),c,new cljs.core.Keyword(null,"effect","effect",347343289),"allow",new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
}),unique_codes);
(await knoxx.backend.infra.stores.mongo_policy_roles.role_permissions_coll(db).insertMany(cljs.core.clj__GT_js(docs_26240)));
} else {
}

return null;
}));

(knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Role ids linked to a membership. Backs the membership read paths; ordering
 * is unspecified at this layer (callers re-fetch + order roles via
 * list-roles-by-ids!).
 */
knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$role_ids_for_membership_BANG_(var_args){
var G__26075 = arguments.length;
switch (G__26075) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_id){
return knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_id);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_id){
return cljs.core.vec(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"role_id","role_id",1603615897),knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.membership_roles_coll(db).find(({"membership_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id))})).toArray()))));
}));

(knoxx.backend.infra.stores.mongo_policy_roles.role_ids_for_membership_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Role rows joined via membership_roles for a set of membership ids, ordered
 * by role name (q-roles/roles-for-memberships). Expressed as an app-level
 * aggregation over the twins: load the link rows, load the referenced roles,
 * then emit one row per (membership_id, role) carrying the join projection
 * :membership_id + role :role_id/:slug/:name/:scope_kind/:org_id. Backs the
 * policy grouped-membership-roles reducer (hydrate-memberships seam).
 */
knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$roles_for_memberships_BANG_(var_args){
var G__26082 = arguments.length;
switch (G__26082) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (membership_ids){
return knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),membership_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,membership_ids){
var mids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.str,membership_ids);
if(cljs.core.empty_QMARK_(mids)){
return cljs.core.PersistentVector.EMPTY;
} else {
var links = knoxx.backend.infra.stores.mongo_policy_roles.keywordize((await knoxx.backend.infra.stores.mongo_policy_roles.membership_roles_coll(db).find(({"membership_id": ({"$in": cljs.core.clj__GT_js(mids)})})).toArray()));
var role_ids = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"role_id","role_id",1603615897),links)));
var roles_by_id = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (m,r){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(m,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(r),r);
}),cljs.core.PersistentArrayMap.EMPTY,(await knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$2(db,role_ids)));
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"name","name",1843675177),cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p__26099){
var map__26100 = p__26099;
var map__26100__$1 = cljs.core.__destructure_map(map__26100);
var membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26100__$1,new cljs.core.Keyword(null,"membership_id","membership_id",-171302674));
var role_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26100__$1,new cljs.core.Keyword(null,"role_id","role_id",1603615897));
var temp__5825__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(roles_by_id,role_id);
if(cljs.core.truth_(temp__5825__auto__)){
var r = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),membership_id,new cljs.core.Keyword(null,"role_id","role_id",1603615897),role_id,new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188),new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"org_id","org_id",1380185385),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(r)], null);
} else {
return null;
}
}),links)));
}
}));

(knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Replace-set a membership's role ids (infra.db.policy/set-membership-roles-tx!:
 * when replace, delete-roles then insert-role per id inside a PG transaction;
 * insert-role is ON CONFLICT DO NOTHING). Mongo twin: optional deleteMany
 * (only when replace? is true, matching the PG guard) then insertMany of the
 * distinct ids. Returns the resolved id vector like the PG fn.
 * 
 * PG TRANSACTION SEMANTICS: the PG path is atomic; this twin is NON-ATOMIC —
 * a window exists after deleteMany and before the inserts. Acceptable under
 * the single-writer-per-system-instance assumption. ON CONFLICT DO NOTHING is
 * reproduced with per-id upserts ($setOnInsert) so re-adding an existing
 * (membership_id, role_id) pair — e.g. the bootstrap allowlist re-running on
 * every startup with replace? false — is a no-op instead of an E11000.
 */
knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_roles$set_membership_roles_BANG_(var_args){
var G__26108 = arguments.length;
switch (G__26108) {
case 3:
return knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (membership_id,replace_QMARK_,role_ids){
return knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.mongo_client.get_db(),membership_id,replace_QMARK_,role_ids);
}));

(knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (db,membership_id,replace_QMARK_,role_ids){
var mid = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(membership_id));
var ids = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,role_ids)));
var coll = knoxx.backend.infra.stores.mongo_policy_roles.membership_roles_coll(db);
if(cljs.core.truth_(replace_QMARK_)){
(await coll.deleteMany(({"membership_id": mid})));
} else {
}

var seq__26117_26272 = cljs.core.seq(ids);
var chunk__26118_26273 = null;
var count__26119_26274 = (0);
var i__26120_26275 = (0);
while(true){
if((i__26120_26275 < count__26119_26274)){
var r_26277 = chunk__26118_26273.cljs$core$IIndexed$_nth$arity$2(null,i__26120_26275);
(await coll.updateOne(({"membership_id": mid, "role_id": r_26277}),({"$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),mid,new cljs.core.Keyword(null,"role_id","role_id",1603615897),r_26277,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));


var G__26280 = seq__26117_26272;
var G__26281 = chunk__26118_26273;
var G__26282 = count__26119_26274;
var G__26283 = (i__26120_26275 + (1));
seq__26117_26272 = G__26280;
chunk__26118_26273 = G__26281;
count__26119_26274 = G__26282;
i__26120_26275 = G__26283;
continue;
} else {
var temp__5825__auto___26284 = cljs.core.seq(seq__26117_26272);
if(temp__5825__auto___26284){
var seq__26117_26285__$1 = temp__5825__auto___26284;
if(cljs.core.chunked_seq_QMARK_(seq__26117_26285__$1)){
var c__5694__auto___26286 = cljs.core.chunk_first(seq__26117_26285__$1);
var G__26288 = cljs.core.chunk_rest(seq__26117_26285__$1);
var G__26289 = c__5694__auto___26286;
var G__26290 = cljs.core.count(c__5694__auto___26286);
var G__26291 = (0);
seq__26117_26272 = G__26288;
chunk__26118_26273 = G__26289;
count__26119_26274 = G__26290;
i__26120_26275 = G__26291;
continue;
} else {
var r_26293 = cljs.core.first(seq__26117_26285__$1);
(await coll.updateOne(({"membership_id": mid, "role_id": r_26293}),({"$setOnInsert": cljs.core.clj__GT_js(new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"membership_id","membership_id",-171302674),mid,new cljs.core.Keyword(null,"role_id","role_id",1603615897),r_26293,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null))}),({"upsert": true})));


var G__26295 = cljs.core.next(seq__26117_26285__$1);
var G__26296 = null;
var G__26297 = (0);
var G__26298 = (0);
seq__26117_26272 = G__26295;
chunk__26118_26273 = G__26296;
count__26119_26274 = G__26297;
i__26120_26275 = G__26298;
continue;
}
} else {
}
}
break;
}

return ids;
}));

(knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$lang$maxFixedArity = 4);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_roles.js.map
