import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.system_instance.js";
goog.provide('knoxx.backend.infra.stores.mongo_policy_actor_credentials');
knoxx.backend.infra.stores.mongo_policy_actor_credentials.ACTOR_CREDENTIALS_COLLECTION = "knoxx_actor_credentials";
knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll = (function knoxx$backend$infra$stores$mongo_policy_actor_credentials$credentials_coll(db){
return db.collection(knoxx.backend.infra.stores.mongo_policy_actor_credentials.ACTOR_CREDENTIALS_COLLECTION);
});
/**
 * Adapt a knoxx_actor_credentials document into a PG-shaped actor_credentials
 * row. The PG query joins memberships + orgs to add :actor_id and :org_slug;
 * those are resolved separately at read time by the calling functions.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row = (function knoxx$backend$infra$stores$mongo_policy_actor_credentials$credential_doc__GT_row(doc){
if(cljs.core.truth_(doc)){
return cljs.core.dissoc.cljs$core$IFn$_invoke$arity$variadic(cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(doc,new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"credential_id","credential_id",-1980385036).cljs$core$IFn$_invoke$arity$1(doc)),new cljs.core.Keyword(null,"credential_id","credential_id",-1980385036),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"_id","_id",-789960287)], 0));
} else {
return null;
}
});
/**
 * Convert a snake_case credential row into the camelCase response shape
 * matching sql-adapter/row->credential. Used by dispatch seams in policy.cljs.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_row__GT_response = (function knoxx$backend$infra$stores$mongo_policy_actor_credentials$credential_row__GT_response(row){
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
knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize = (function knoxx$backend$infra$stores$mongo_policy_actor_credentials$keywordize(doc){
if(cljs.core.truth_(doc)){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(doc,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return null;
}
});
/**
 * Create actor-credential uniqueness + lookup indexes. Idempotent.
 * 
 * Mirrors the PG uniques exactly: actor_credentials UNIQUE (user_id, org_id,
 * provider, kind). Lookup indexes on user_id, org_id, and provider mirror the
 * FK delete/replace access paths and the list-by-provider query.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.setup_indexes_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$setup_indexes_BANG_(db){
var coll = knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db);
(await coll.createIndex(({"user_id": (1), "org_id": (1), "provider": (1), "kind": (1)}),({"unique": true})));

(await coll.createIndex(({"user_id": (1)})));

(await coll.createIndex(({"org_id": (1)})));

(await coll.createIndex(({"provider": (1), "status": (1)})));

return true;
});
/**
 * Resolve the membership + org join for a credential document.
 * Returns the credential row with :actor_id and :org_slug filled in,
 * or nil if the membership is missing.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.resolve_membership_for_credential = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$resolve_membership_for_credential(db,cred){
var memberships = db.collection("knoxx_memberships");
var orgs = db.collection("knoxx_orgs");
var membership = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await memberships.findOne(({"user_id": new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(cred), "org_id": new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(cred)}))));
if(cljs.core.truth_(membership)){
var org = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await orgs.findOne(({"org_id": new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(cred)}))));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row(cred),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(membership),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org)], 0));
} else {
return null;
}
});
/**
 * Active actor credential rows for a provider, joined with memberships + orgs.
 * Mirrors the PG actor-credentials-select-query: SELECT ac.*, m.actor_id,
 * m.user_id, m.org_id, o.slug AS org_slug FROM actor_credentials ac
 * JOIN memberships m ... JOIN orgs o ... WHERE ac.provider = ? AND ac.status = 'active'
 * ORDER BY m.actor_id ASC, ac.updated_at DESC.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$list_actor_credentials_by_provider_BANG_(var_args){
var G__25656 = arguments.length;
switch (G__25656) {
case 1:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$1((arguments[(0)]));

break;
case 2:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$1 = (async function (provider){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.mongo_client.get_db(),provider);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (db,provider){
var coll = knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db);
var cursor = coll.find(({"provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "status": "active"}));
var rows = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await cursor.toArray()));
var resolved = (await Promise.all(cljs.core.clj__GT_js(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__25648_SHARP_){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.resolve_membership_for_credential(db,p1__25648_SHARP_);
}),rows))));
return cljs.core.vec(cljs.core.filterv((function (p1__25649_SHARP_){
return (!(clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(p1__25649_SHARP_))))));
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,cljs.core.vec(cljs.core.array_seq.cljs$core$IFn$_invoke$arity$1(resolved)))));
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$lang$maxFixedArity = 2);

/**
 * Single active credential for an actor + provider, joined with memberships + orgs.
 * Mirrors the PG actor-credential-select-query: ... WHERE m.actor_id = ?
 * AND ac.provider = ? AND ac.status = 'active' ... LIMIT 1.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$get_actor_credential_by_actor_and_provider_BANG_(var_args){
var G__25685 = arguments.length;
switch (G__25685) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (actor_id,provider){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),actor_id,provider);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,actor_id,provider){
var memberships = db.collection("knoxx_memberships");
var membership = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await memberships.findOne(({"actor_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id))}))));
if(cljs.core.truth_(membership)){
var coll = knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db);
var cursor = coll.find(({"user_id": new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(membership), "org_id": new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(membership), "provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "status": "active"}));
var docs = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await cursor.toArray()));
var sorted = cljs.core.sort_by.cljs$core$IFn$_invoke$arity$3(new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),cljs.core._GT_,docs);
var best = cljs.core.first(sorted);
if(cljs.core.truth_(best)){
var orgs = db.collection("knoxx_orgs");
var org = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await orgs.findOne(({"org_id": new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(best)}))));
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row(best),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260),actor_id,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"org_slug","org_slug",-322631770),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org)], 0));
} else {
return null;
}
} else {
return null;
}
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Raw credential rows for a set of user ids within an org, ordered by
 * provider then kind. Mirrors q-users/credentials-for-users (the user-listing
 * credential join); rows keep :user_id + :secret_json for the policy
 * credentials-by-user grouping. Returns PG-shaped rows (no membership join).
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$list_credentials_for_users_org_BANG_(var_args){
var G__25716 = arguments.length;
switch (G__25716) {
case 2:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$2 = (async function (user_ids,org_id){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.mongo_client.get_db(),user_ids,org_id);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (db,user_ids,org_id){
var uids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,user_ids));
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(cljs.core.juxt.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"provider","provider",-302056900),new cljs.core.Keyword(null,"kind","kind",-717265803)),cljs.core.filterv((function (p1__25711_SHARP_){
return cljs.core.contains_QMARK_(uids,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(p1__25711_SHARP_))));
}),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row,knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db).find(({"org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id))})).toArray()))))));
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$lang$maxFixedArity = 3);

/**
 * Single active credential for a (user, org, provider, kind) tuple. Backs the
 * local-password auth path in infra.db.policy/local-password-auth-record!,
 * which reads the active local/password credential for a resolved membership.
 * Returns a PG-shaped row (no membership/org join) or nil.
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$get_credential_by_user_org_provider_kind_BANG_(var_args){
var G__25792 = arguments.length;
switch (G__25792) {
case 4:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (user_id,org_id,provider,kind){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$5(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id,provider,kind);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (db,user_id,org_id,provider,kind){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row(knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db).findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind)), "status": "active"})))));
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$lang$maxFixedArity = 5);

/**
 * Upsert an actor credential by user-id + org-id + provider + kind.
 * Mirrors the PG ON CONFLICT (user_id, org_id, provider, kind) DO UPDATE SET
 * account_identifier = COALESCE(EXCLUDED.account_identifier, ...),
 * secret_json = secret_json || EXCLUDED.secret_json (merge),
 * status = EXCLUDED.status, updated_at = NOW().
 * 
 * Mongo twin: findOneAndUpdate with upsert. secret_json is merged via
 * $set with the new keys overlaid on the existing map (matching PG's
 * jsonb || operator).
 */
knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_ = (async function knoxx$backend$infra$stores$mongo_policy_actor_credentials$upsert_actor_credential_BANG_(var_args){
var G__25808 = arguments.length;
switch (G__25808) {
case 4:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
case 5:
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$5((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]),(arguments[(4)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (user_id,org_id,provider,credential){
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$5(knoxx.backend.infra.mongo_client.get_db(),user_id,org_id,provider,credential);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$5 = (async function (db,user_id,org_id,provider,p__25820){
var map__25822 = p__25820;
var map__25822__$1 = cljs.core.__destructure_map(map__25822);
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25822__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var account_identifier = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25822__$1,new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778));
var secret_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25822__$1,new cljs.core.Keyword(null,"secret-json","secret-json",-436252008));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__25822__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var coll = knoxx.backend.infra.stores.mongo_policy_actor_credentials.credentials_coll(db);
var kind__$1 = (await (async function (){var or__5162__auto__ = kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "credential";
}
})());
var now = (new Date());
var existing = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await coll.findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind__$1))}))));
var existing_secret = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"secret_json","secret_json",-724933577).cljs$core$IFn$_invoke$arity$1(existing);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})());
var merged_secret = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([existing_secret,(await (async function (){var or__5162__auto__ = secret_json;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())], 0));
var resolved_account_id = (await (async function (){var or__5162__auto__ = account_identifier;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161).cljs$core$IFn$_invoke$arity$1(existing);
}
})());
var new_credential_id = (cljs.core.truth_(existing)?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(cljs.core.random_uuid())));
(await coll.updateOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind__$1))}),({"$set": cljs.core.clj__GT_js((await (async function (){var G__25837 = new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161),resolved_account_id,new cljs.core.Keyword(null,"secret_json","secret_json",-724933577),merged_secret,new cljs.core.Keyword(null,"status","status",-1997798413),(await (async function (){var or__5162__auto__ = status;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "active";
}
})()),new cljs.core.Keyword(null,"updated_at","updated_at",-460224592),now,new cljs.core.Keyword(null,"system_instance_id","system_instance_id",-2002906036),knoxx.backend.infra.system_instance.current_id()], null);
if(cljs.core.not(existing)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25837,new cljs.core.Keyword(null,"created_at","created_at",1484050750),now);
} else {
return G__25837;
}
})())), "$setOnInsert": cljs.core.clj__GT_js((await (async function (){var G__25845 = new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"user_id","user_id",993497112),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)),new cljs.core.Keyword(null,"org_id","org_id",1380185385),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)),new cljs.core.Keyword(null,"provider","provider",-302056900),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)),new cljs.core.Keyword(null,"kind","kind",-717265803),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind__$1))], null);
if(cljs.core.truth_(new_credential_id)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__25845,new cljs.core.Keyword(null,"credential_id","credential_id",-1980385036),new_credential_id);
} else {
return G__25845;
}
})()))}),({"upsert": true})));

var doc = knoxx.backend.infra.stores.mongo_policy_actor_credentials.keywordize((await coll.findOne(({"user_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(user_id)), "org_id": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id)), "provider": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(provider)), "kind": (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(kind__$1))}))));
return knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_doc__GT_row(doc);
}));

(knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$lang$maxFixedArity = 5);


//# sourceMappingURL=knoxx.backend.infra.stores.mongo_policy_actor_credentials.js.map
