import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.mongo_client.js";
import "./knoxx.backend.infra.stores.mongo_policy_store.js";
import "./knoxx.backend.infra.stores.mongo_policy_directory.js";
import "./knoxx.backend.infra.stores.mongo_policy_roles.js";
import "./knoxx.backend.infra.stores.mongo_policy_tools.js";
import "./knoxx.backend.infra.stores.mongo_policy_actor_credentials.js";
import "./knoxx.backend.infra.stores.mongo_policy_audit_events.js";
import "./knoxx.backend.infra.stores.mongo_policy_data_lakes.js";
import "./knoxx.backend.infra.stores.mongo_policy_invites.js";
import "./knoxx.backend.domain.actor.scope.js";
import "./knoxx.backend.domain.contracts.loader.js";
import "./knoxx.backend.domain.contracts.roles.js";
import "./knoxx.backend.infra.db.actors.js";
import "./knoxx.backend.domain.policy.protocol.js";
import "./knoxx.backend.infra.registry.tools.js";
import "./shadow.esm.esm_import$node_path.js";
import "./shadow.esm.esm_import$node_fs.js";
import "./shadow.esm.esm_import$node_crypto.js";
goog.provide('knoxx.backend.infra.db.policy');



knoxx.backend.infra.db.policy.promise_each = (async function knoxx$backend$infra$db$policy$promise_each(items,f){
var seq__26715_27332 = cljs.core.seq((await (async function (){var or__5162__auto__ = items;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
var chunk__26716_27333 = null;
var count__26717_27334 = (0);
var i__26718_27335 = (0);
while(true){
if((i__26718_27335 < count__26717_27334)){
var item_27336 = chunk__26716_27333.cljs$core$IIndexed$_nth$arity$2(null,i__26718_27335);
(await (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(item_27336) : f.call(null,item_27336)));


var G__27337 = seq__26715_27332;
var G__27338 = chunk__26716_27333;
var G__27339 = count__26717_27334;
var G__27340 = (i__26718_27335 + (1));
seq__26715_27332 = G__27337;
chunk__26716_27333 = G__27338;
count__26717_27334 = G__27339;
i__26718_27335 = G__27340;
continue;
} else {
var temp__5825__auto___27341 = cljs.core.seq(seq__26715_27332);
if(temp__5825__auto___27341){
var seq__26715_27342__$1 = temp__5825__auto___27341;
if(cljs.core.chunked_seq_QMARK_(seq__26715_27342__$1)){
var c__5694__auto___27343 = cljs.core.chunk_first(seq__26715_27342__$1);
var G__27344 = cljs.core.chunk_rest(seq__26715_27342__$1);
var G__27345 = c__5694__auto___27343;
var G__27346 = cljs.core.count(c__5694__auto___27343);
var G__27347 = (0);
seq__26715_27332 = G__27344;
chunk__26716_27333 = G__27345;
count__26717_27334 = G__27346;
i__26718_27335 = G__27347;
continue;
} else {
var item_27348 = cljs.core.first(seq__26715_27342__$1);
(await (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(item_27348) : f.call(null,item_27348)));


var G__27349 = cljs.core.next(seq__26715_27342__$1);
var G__27350 = null;
var G__27351 = (0);
var G__27352 = (0);
seq__26715_27332 = G__27349;
chunk__26716_27333 = G__27350;
count__26717_27334 = G__27351;
i__26718_27335 = G__27352;
continue;
}
} else {
}
}
break;
}

return null;
});
knoxx.backend.infra.db.policy.slugify = (function knoxx$backend$infra$db$policy$slugify(value,fallback){
var s = clojure.string.replace(clojure.string.replace(clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)+""))),/[^a-z0-9]+/,"-"),/^[-]+|[-]+$/,"");
if(clojure.string.blank_QMARK_(s)){
return fallback;
} else {
return s;
}
});
knoxx.backend.infra.db.policy.normalize_email = (function knoxx$backend$infra$db$policy$normalize_email(v){
var G__26748 = v;
var G__26748__$1 = (((G__26748 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26748)));
var G__26748__$2 = (((G__26748__$1 == null))?null:clojure.string.trim(G__26748__$1));
var G__26748__$3 = (((G__26748__$2 == null))?null:clojure.string.lower_case(G__26748__$2));
if((G__26748__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26748__$3);
}
});
knoxx.backend.infra.db.policy.normalize_actor_id = (function knoxx$backend$infra$db$policy$normalize_actor_id(v){
var G__26753 = v;
var G__26753__$1 = (((G__26753 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26753)));
var G__26753__$2 = (((G__26753__$1 == null))?null:clojure.string.trim(G__26753__$1));
if((G__26753__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26753__$2);
}
});
knoxx.backend.infra.db.policy.unique = (function knoxx$backend$infra$db$policy$unique(vs){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(cljs.core.some_QMARK_,vs)));
});
knoxx.backend.infra.db.policy.http_error = (function knoxx$backend$infra$db$policy$http_error(status,message,code){
var G__26756 = (new Error(message));
(G__26756["statusCode"] = status);

(G__26756["code"] = code);

return G__26756;
});
knoxx.backend.infra.db.policy.default_contracts_dir = (function knoxx$backend$infra$db$policy$default_contracts_dir(){
var configured = (function (){var G__26761 = (process.env["CONTRACTS_DIR"]);
var G__26761__$1 = (((G__26761 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26761)));
var G__26761__$2 = (((G__26761__$1 == null))?null:clojure.string.trim(G__26761__$1));
if((G__26761__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26761__$2);
}
})();
var cwd = process.cwd();
var or__5162__auto__ = cljs.core.some((function (c){
if(cljs.core.truth_(shadow.esm.esm_import$node_fs.existsSync(c))){
return c;
} else {
return null;
}
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26759_SHARP_){
return shadow.esm.esm_import$node_path.resolve(cwd,p1__26759_SHARP_);
}),cljs.core.keep.cljs$core$IFn$_invoke$arity$2(cljs.core.identity,new cljs.core.PersistentVector(null, 5, 5, cljs.core.PersistentVector.EMPTY_NODE, [configured,"contracts","../contracts","packages/agents/knoxx/contracts","orgs/open-hax/openplanner/packages/agents/knoxx/contracts"], null))));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return shadow.esm.esm_import$node_path.resolve(cwd,(function (){var or__5162__auto____$1 = configured;
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "contracts";
}
})());
}
});
knoxx.backend.infra.db.policy.contracts_dir = (function knoxx$backend$infra$db$policy$contracts_dir(){
return knoxx.backend.infra.db.policy.default_contracts_dir();
});
knoxx.backend.infra.db.policy.contracts_config = (function knoxx$backend$infra$db$policy$contracts_config(){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"contracts-dir","contracts-dir",220735735),knoxx.backend.infra.db.policy.default_contracts_dir()], null);
});
knoxx.backend.infra.db.policy.upsert_actor_contract_BANG_ = (function knoxx$backend$infra$db$policy$upsert_actor_contract_BANG_(payload){
return knoxx.backend.infra.db.actors.upsert_actor_contract_BANG_(knoxx.backend.infra.db.policy.contracts_dir(),payload);
});
knoxx.backend.infra.db.policy.read_only_contract_write_error_QMARK_ = (function knoxx$backend$infra$db$policy$read_only_contract_write_error_QMARK_(err){
var code = (function (){var G__26778 = err.code;
var G__26778__$1 = (((G__26778 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26778)));
if((G__26778__$1 == null)){
return null;
} else {
return clojure.string.trim(G__26778__$1);
}
})();
var message = (function (){var G__26781 = err.message;
if((G__26781 == null)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26781));
}
})();
var or__5162__auto__ = (function (){var fexpr__26783 = new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 3, ["EROFS",null,"EACCES",null,"EPERM",null], null), null);
return (fexpr__26783.cljs$core$IFn$_invoke$arity$1 ? fexpr__26783.cljs$core$IFn$_invoke$arity$1(code) : fexpr__26783.call(null,code));
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var and__5160__auto__ = message;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.boolean$(cljs.core.re_find(/read-only file system|permission denied|operation not permitted/,message));
} else {
return and__5160__auto__;
}
}
});
knoxx.backend.infra.db.policy.handle_read_only_actor_contract_error_BANG_ = (function knoxx$backend$infra$db$policy$handle_read_only_actor_contract_error_BANG_(err){
if(cljs.core.truth_(knoxx.backend.infra.db.policy.read_only_contract_write_error_QMARK_(err))){
console.warn("[knoxx-policy] actor contract write skipped; contracts dir is read-only/unwritable",err.message);

return null;
} else {
throw err;
}
});
knoxx.backend.infra.db.policy.upsert_actor_contract_best_effort_BANG_ = (async function knoxx$backend$infra$db$policy$upsert_actor_contract_best_effort_BANG_(payload){
try{return (await knoxx.backend.infra.db.policy.upsert_actor_contract_BANG_(payload));
}catch (e26786){var err = e26786;
return knoxx.backend.infra.db.policy.handle_read_only_actor_contract_error_BANG_(err);
}});
knoxx.backend.infra.db.policy.find_actor_contract_by_id = (function knoxx$backend$infra$db$policy$find_actor_contract_by_id(actor_id){
return knoxx.backend.infra.db.actors.find_actor_contract_by_id(knoxx.backend.infra.db.policy.contracts_dir(),actor_id);
});
knoxx.backend.infra.db.policy.find_user_actor_contract_by_email = (function knoxx$backend$infra$db$policy$find_user_actor_contract_by_email(email){
return knoxx.backend.infra.db.actors.find_user_actor_contract_by_email(knoxx.backend.infra.db.policy.contracts_dir(),email);
});
knoxx.backend.infra.db.policy.list_actor_contracts = (function knoxx$backend$infra$db$policy$list_actor_contracts(){
return knoxx.backend.infra.db.actors.list_actor_contracts(knoxx.backend.infra.db.policy.contracts_dir());
});
knoxx.backend.infra.db.policy.user_actor_id_from_email = (function knoxx$backend$infra$db$policy$user_actor_id_from_email(email){
return knoxx.backend.infra.db.actors.user_actor_id_from_email(email);
});
/**
 * Resolve the connected Mongo db, ensuring twin indexes once. Throws when
 * Mongo is unavailable so write paths surface the failure rather than
 * silently no-op.
 */
knoxx.backend.infra.db.policy.db_BANG_ = (async function knoxx$backend$infra$db$policy$db_BANG_(){
var temp__5823__auto__ = (await (knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_.cljs$core$IFn$_invoke$arity$0 ? knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_.cljs$core$IFn$_invoke$arity$0() : knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_.call(null)));
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
return db;
} else {
throw (new Error("Mongo policy store unavailable"));
}
});
knoxx.backend.infra.db.policy.find_org_by_id = (async function knoxx$backend$infra$db$policy$find_org_by_id(_pool,org_id){
return (await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_id_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),org_id));
});
knoxx.backend.infra.db.policy.find_org_by_slug = (async function knoxx$backend$infra$db$policy$find_org_by_slug(_pool,slug){
return (await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),slug));
});
knoxx.backend.infra.db.policy.find_role = (async function knoxx$backend$infra$db$policy$find_role(_pool,p__26797){
var map__26798 = p__26797;
var map__26798__$1 = cljs.core.__destructure_map(map__26798);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26798__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26798__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
return (await knoxx.backend.infra.stores.mongo_policy_roles.find_role.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"slug","slug",2029314850),slug], null)));
});
knoxx.backend.infra.db.policy.ensure_role_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_role_BANG_(_pool,p__26800){
var map__26802 = p__26800;
var map__26802__$1 = cljs.core.__destructure_map(map__26802);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var scope_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465));
var built_in = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"built-in","built-in",1245067766));
var system_managed = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26802__$1,new cljs.core.Keyword(null,"system-managed","system-managed",-191362489));
return (await knoxx.backend.infra.stores.mongo_policy_roles.ensure_role_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465),scope_kind,new cljs.core.Keyword(null,"built-in","built-in",1245067766),built_in,new cljs.core.Keyword(null,"system-managed","system-managed",-191362489),system_managed], null)));
});
knoxx.backend.infra.db.policy.set_role_permissions_BANG_ = (async function knoxx$backend$infra$db$policy$set_role_permissions_BANG_(_pool,role_id,permission_codes){
return (await knoxx.backend.infra.stores.mongo_policy_roles.set_role_permissions_BANG_.cljs$core$IFn$_invoke$arity$3((await knoxx.backend.infra.db.policy.db_BANG_()),role_id,knoxx.backend.infra.db.policy.unique(permission_codes)));
});
knoxx.backend.infra.db.policy.normalize_tool_policy = (function knoxx$backend$infra$db$policy$normalize_tool_policy(p){
if(typeof p === 'string'){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),p,new cljs.core.Keyword(null,"effect","effect",347343289),"allow",new cljs.core.Keyword(null,"constraints","constraints",422775616),cljs.core.PersistentArrayMap.EMPTY], null);
} else {
var tool_id = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"tool_id","tool_id",1550520216).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(p);
}
}
})();
if(cljs.core.truth_(tool_id)){
} else {
throw (new Error("toolId is required for tool policy"));
}

return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),knoxx.backend.infra.registry.tools.normalize_tool_id(tool_id),new cljs.core.Keyword(null,"effect","effect",347343289),((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(p),"deny"))?"deny":"allow"),new cljs.core.Keyword(null,"constraints","constraints",422775616),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"constraints","constraints",422775616).cljs$core$IFn$_invoke$arity$1(p);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()], null);
}
});
knoxx.backend.infra.db.policy.keywordish_id = (function knoxx$backend$infra$db$policy$keywordish_id(value){
if((value instanceof cljs.core.Keyword)){
var G__26826 = value;
var G__26826__$1 = (((G__26826 == null))?null:cljs.core.name(G__26826));
var G__26826__$2 = (((G__26826__$1 == null))?null:clojure.string.trim(G__26826__$1));
if((G__26826__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26826__$2);
}
} else {
if(typeof value === 'string'){
var G__26831 = value;
var G__26831__$1 = (((G__26831 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26831)));
var G__26831__$2 = (((G__26831__$1 == null))?null:clojure.string.trim(G__26831__$1));
if((G__26831__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26831__$2);
}
} else {
if((value == null)){
return null;
} else {
var G__26835 = value;
var G__26835__$1 = (((G__26835 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26835)));
var G__26835__$2 = (((G__26835__$1 == null))?null:clojure.string.trim(G__26835__$1));
if((G__26835__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26835__$2);
}

}
}
}
});
knoxx.backend.infra.db.policy.role_slug_aliases = (function knoxx$backend$infra$db$policy$role_slug_aliases(slug){
var s = (function (){var G__26846 = slug;
var G__26846__$1 = (((G__26846 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26846)));
var G__26846__$2 = (((G__26846__$1 == null))?null:clojure.string.trim(G__26846__$1));
if((G__26846__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26846__$2);
}
})();
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [s,(function (){var G__26853 = s;
if((G__26853 == null)){
return null;
} else {
return clojure.string.replace(G__26853,/_/,"-");
}
})(),(function (){var G__26855 = s;
if((G__26855 == null)){
return null;
} else {
return clojure.string.replace(G__26855,/-/,"_");
}
})(),(cljs.core.truth_(s)?knoxx.backend.infra.db.policy.slugify(s,s):null)], null))));
});
knoxx.backend.infra.db.policy.role_tool_policies = (function knoxx$backend$infra$db$policy$role_tool_policies(caps_by_id,contract){
var cap_tool_policies = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (tid){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),tid,new cljs.core.Keyword(null,"effect","effect",347343289),"allow",new cljs.core.Keyword(null,"constraints","constraints",422775616),cljs.core.PersistentArrayMap.EMPTY], null);
}),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.registry.tools.normalize_tool_id,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__26865_SHARP_){
var or__5162__auto__ = new cljs.core.Keyword("cap","tools","cap/tools",-1241568196).cljs$core$IFn$_invoke$arity$1(p1__26865_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.keep.cljs$core$IFn$_invoke$arity$2(caps_by_id,cljs.core.keep.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.keywordish_id,(function (){var or__5162__auto__ = new cljs.core.Keyword("role","capabilities","role/capabilities",208971087).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))], 0))))));
var declared_tool_policies = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.normalize_tool_policy,(function (){var or__5162__auto__ = new cljs.core.Keyword("role","tool-policies","role/tool-policies",-240996435).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword("role","tool_policies","role/tool_policies",36761499).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
var or__5162__auto____$3 = new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976).cljs$core$IFn$_invoke$arity$1(contract);
if(cljs.core.truth_(or__5162__auto____$3)){
return or__5162__auto____$3;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
}
}
})());
return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),cljs.core.vals(cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,policy){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(acc,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(policy),policy);
}),cljs.core.PersistentArrayMap.EMPTY,cljs.core.concat.cljs$core$IFn$_invoke$arity$2(cap_tool_policies,declared_tool_policies)))));
});
knoxx.backend.infra.db.policy.policy_with_constraints_json = (function knoxx$backend$infra$db$policy$policy_with_constraints_json(p){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p,new cljs.core.Keyword(null,"constraints-json","constraints-json",-1677970568),JSON.stringify(cljs.core.clj__GT_js(new cljs.core.Keyword(null,"constraints","constraints",422775616).cljs$core$IFn$_invoke$arity$1(p))));
});
knoxx.backend.infra.db.policy.set_role_tool_policies_BANG_ = (async function knoxx$backend$infra$db$policy$set_role_tool_policies_BANG_(_pool,role_id,tool_policies){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var normalized = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.policy_with_constraints_json,knoxx.backend.infra.db.policy.normalize_tool_policy),tool_policies);
(await knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$2(db,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),normalized)));

return (await knoxx.backend.infra.stores.mongo_policy_tools.set_role_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3(db,role_id,normalized));
});
knoxx.backend.infra.db.policy.requested_role_slugs = (function knoxx$backend$infra$db$policy$requested_role_slugs(role_slugs){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(cljs.core.nil_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__26919_SHARP_){
var G__26934 = p1__26919_SHARP_;
var G__26934__$1 = (((G__26934 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26934)));
var G__26934__$2 = (((G__26934__$1 == null))?null:clojure.string.trim(G__26934__$1));
if((G__26934__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26934__$2);
}
}),role_slugs))));
});
knoxx.backend.infra.db.policy.resolve_role_slugs = (function knoxx$backend$infra$db$policy$resolve_role_slugs(base_ids,requested,rows,alias_map){
var found = cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (r){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(r),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(r)))], null);
}),rows));
var resolved = cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (slug){
return cljs.core.some((function (p1__26981_SHARP_){
return cljs.core.get.cljs$core$IFn$_invoke$arity$2(found,p1__26981_SHARP_);
}),cljs.core.get.cljs$core$IFn$_invoke$arity$2(alias_map,slug));
}),requested);
var missing = cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (slug){
return cljs.core.not_any_QMARK_((function (p1__26988_SHARP_){
return cljs.core.contains_QMARK_(found,p1__26988_SHARP_);
}),cljs.core.get.cljs$core$IFn$_invoke$arity$2(alias_map,slug));
}),requested);
if(cljs.core.seq(missing)){
throw (new Error((""+"Role not found for slug(s): "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.join.cljs$core$IFn$_invoke$arity$2(", ",missing)))));
} else {
}

return cljs.core.into.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(base_ids),resolved);
});
knoxx.backend.infra.db.policy.resolve_role_ids = (async function knoxx$backend$infra$db$policy$resolve_role_ids(_pool,p__27012){
var map__27013 = p__27012;
var map__27013__$1 = cljs.core.__destructure_map(map__27013);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27013__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var role_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27013__$1,new cljs.core.Keyword(null,"role-ids","role-ids",652985101));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27013__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var base_ids = cljs.core.set(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(await (async function (){var or__5162__auto__ = role_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));
if(cljs.core.empty_QMARK_(role_slugs)){
return cljs.core.vec(base_ids);
} else {
var requested = knoxx.backend.infra.db.policy.requested_role_slugs(role_slugs);
var alias_map = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (slug){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [slug,knoxx.backend.infra.db.policy.role_slug_aliases(slug)], null);
})),requested);
var query_slugs = cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(cljs.core.identity,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.vals(alias_map)], 0))));
var rows = (await knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_slugs_BANG_.cljs$core$IFn$_invoke$arity$3((await knoxx.backend.infra.db.policy.db_BANG_()),query_slugs,org_id));
return knoxx.backend.infra.db.policy.resolve_role_slugs(base_ids,requested,rows,alias_map);
}
});
knoxx.backend.infra.db.policy.known_contract_role_slugs = (function knoxx$backend$infra$db$policy$known_contract_role_slugs(records){
return cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27024_SHARP_){
var G__27026 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(p1__27024_SHARP_);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(p1__27024_SHARP_,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword("role","id","role/id",-1375589954)], null));
}
})();
var G__27026__$1 = (((G__27026 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27026)));
var G__27026__$2 = (((G__27026__$1 == null))?null:clojure.string.trim(G__27026__$1));
if((G__27026__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27026__$2);
}
}),cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27023_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("roles",new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__27023_SHARP_));
}),records)));
});
knoxx.backend.infra.db.policy.canonical_contract_role_slug = (function knoxx$backend$infra$db$policy$canonical_contract_role_slug(known,raw){
var s = (function (){var G__27031 = raw;
var G__27031__$1 = (((G__27031 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27031)));
var G__27031__$2 = (((G__27031__$1 == null))?null:clojure.string.trim(G__27031__$1));
if((G__27031__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27031__$2);
}
})();
if(cljs.core.truth_((function (){var and__5160__auto__ = s;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(known,s);
} else {
return and__5160__auto__;
}
})())){
return s;
} else {
if(cljs.core.truth_((function (){var and__5160__auto__ = s;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core.contains_QMARK_(known,knoxx.backend.infra.db.policy.slugify(s,s));
} else {
return and__5160__auto__;
}
})())){
return knoxx.backend.infra.db.policy.slugify(s,s);
} else {
if(cljs.core.truth_(s)){
console.warn("[policy-db] unknown role slug, skipping:",s);

return null;
} else {
return null;

}
}
}
});
knoxx.backend.infra.db.policy.canonicalize_contract_role_slugs_BANG_ = (async function knoxx$backend$infra$db$policy$canonicalize_contract_role_slugs_BANG_(role_slugs){
var records = (await knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_(knoxx.backend.infra.db.policy.contracts_config()));
var known = knoxx.backend.infra.db.policy.known_contract_role_slugs(records);
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (p1__27040_SHARP_){
return knoxx.backend.infra.db.policy.canonical_contract_role_slug(known,p1__27040_SHARP_);
}),(await (async function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()))));
});
knoxx.backend.infra.db.policy.resolved_membership_role_slugs_BANG_ = (async function knoxx$backend$infra$db$policy$resolved_membership_role_slugs_BANG_(role_slugs,contract_projection){
if(cljs.core.truth_(contract_projection)){
return (await knoxx.backend.infra.db.policy.canonicalize_contract_role_slugs_BANG_(role_slugs));
} else {
var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
}
});
knoxx.backend.infra.db.policy.set_membership_roles_BANG_ = (async function knoxx$backend$infra$db$policy$set_membership_roles_BANG_(pool,membership_id,p__27051){
var map__27052 = p__27051;
var map__27052__$1 = cljs.core.__destructure_map(map__27052);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27052__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var role_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27052__$1,new cljs.core.Keyword(null,"role-ids","role-ids",652985101));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27052__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var replace = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27052__$1,new cljs.core.Keyword(null,"replace","replace",-786587770));
var contract_projection = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27052__$1,new cljs.core.Keyword(null,"contract-projection","contract-projection",-1495437365));
var resolved_slugs = (await knoxx.backend.infra.db.policy.resolved_membership_role_slugs_BANG_(role_slugs,contract_projection));
var resolved_ids = (await knoxx.backend.infra.db.policy.resolve_role_ids(pool,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"role-ids","role-ids",652985101),(await (async function (){var or__5162__auto__ = role_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),resolved_slugs], null)));
return (await knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$4((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id,cljs.core.boolean$(replace),resolved_ids));
});
knoxx.backend.infra.db.policy.set_membership_tool_policies_BANG_ = (async function knoxx$backend$infra$db$policy$set_membership_tool_policies_BANG_(_pool,membership_id,tool_policies){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var normalized = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.policy_with_constraints_json,knoxx.backend.infra.db.policy.normalize_tool_policy),tool_policies);
(await knoxx.backend.infra.stores.mongo_policy_tools.ensure_tool_definitions_BANG_.cljs$core$IFn$_invoke$arity$2(db,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),normalized)));

return (await knoxx.backend.infra.stores.mongo_policy_tools.set_membership_tool_policies_BANG_.cljs$core$IFn$_invoke$arity$3(db,membership_id,normalized));
});
knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_ = (async function knoxx$backend$infra$db$policy$set_membership_actor_id_BANG_(_pool,membership_id,actor_id){
return (await knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$3((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id,actor_id));
});
knoxx.backend.infra.db.policy.default_membership_actor_id = (function knoxx$backend$infra$db$policy$default_membership_actor_id(role_slugs){
return knoxx.backend.domain.actor.scope.default_membership_actor_id(role_slugs);
});
knoxx.backend.infra.db.policy.constraints_json__GT_clj = (function knoxx$backend$infra$db$policy$constraints_json__GT_clj(value){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = value;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return ({});
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
});
knoxx.backend.infra.db.policy.grouped_role_permissions = (function knoxx$backend$infra$db$policy$grouped_role_permissions(rows){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__27059){
var map__27060 = p__27059;
var map__27060__$1 = cljs.core.__destructure_map(map__27060);
var role_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27060__$1,new cljs.core.Keyword(null,"role_id","role_id",1603615897));
var code = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27060__$1,new cljs.core.Keyword(null,"code","code",1586293142));
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,role_id,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),code);
}),cljs.core.PersistentArrayMap.EMPTY,rows);
});
knoxx.backend.infra.db.policy.grouped_role_tool_policies = (function knoxx$backend$infra$db$policy$grouped_role_tool_policies(rows){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__27061){
var map__27064 = p__27061;
var map__27064__$1 = cljs.core.__destructure_map(map__27064);
var role_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27064__$1,new cljs.core.Keyword(null,"role_id","role_id",1603615897));
var tool_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27064__$1,new cljs.core.Keyword(null,"tool_id","tool_id",1550520216));
var effect = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27064__$1,new cljs.core.Keyword(null,"effect","effect",347343289));
var constraints_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27064__$1,new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864));
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,role_id,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),effect,new cljs.core.Keyword(null,"constraints","constraints",422775616),knoxx.backend.infra.db.policy.constraints_json__GT_clj(constraints_json)], null));
}),cljs.core.PersistentArrayMap.EMPTY,rows);
});
knoxx.backend.infra.db.policy.hydrate_role_row = (function knoxx$backend$infra$db$policy$hydrate_role_row(perm_map,tool_map,p__27080){
var map__27084 = p__27080;
var map__27084__$1 = cljs.core.__destructure_map(map__27084);
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var system_managed = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"system_managed","system_managed",-1147228921));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
var scope_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188));
var built_in = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"built_in","built_in",-655972882));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27084__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"updated-at","updated-at",-1592622336),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"permissions","permissions",67803075),new cljs.core.Keyword(null,"system-managed","system-managed",-191362489),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"built-in","built-in",1245067766),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[updated_at,slug,(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(perm_map,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),system_managed,name,org_id,scope_kind,id,built_in,(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(tool_map,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),created_at]);
});
knoxx.backend.infra.db.policy.hydrate_role_maps = (async function knoxx$backend$infra$db$policy$hydrate_role_maps(_pool,roles){
if(cljs.core.empty_QMARK_(roles)){
return cljs.core.PersistentVector.EMPTY;
} else {
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var role_ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),roles);
var perm_rows = (await knoxx.backend.infra.stores.mongo_policy_roles.permissions_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2(db,role_ids));
var tool_rows = (await knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_roles_BANG_.cljs$core$IFn$_invoke$arity$2(db,role_ids));
var perm_map = knoxx.backend.infra.db.policy.grouped_role_permissions(perm_rows);
var tool_map = knoxx.backend.infra.db.policy.grouped_role_tool_policies(tool_rows);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27088_SHARP_){
return knoxx.backend.infra.db.policy.hydrate_role_row(perm_map,tool_map,p1__27088_SHARP_);
}),roles);
}
});
knoxx.backend.infra.db.policy.grouped_membership_roles = (function knoxx$backend$infra$db$policy$grouped_membership_roles(rows){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__27097){
var map__27098 = p__27097;
var map__27098__$1 = cljs.core.__destructure_map(map__27098);
var membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"membership_id","membership_id",-171302674));
var role_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"role_id","role_id",1603615897));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var scope_kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"scope_kind","scope_kind",-491935188));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27098__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,membership_id,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),role_id,new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465),scope_kind,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null));
}),cljs.core.PersistentArrayMap.EMPTY,rows);
});
knoxx.backend.infra.db.policy.grouped_membership_tool_policies = (function knoxx$backend$infra$db$policy$grouped_membership_tool_policies(rows){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,p__27103){
var map__27105 = p__27103;
var map__27105__$1 = cljs.core.__destructure_map(map__27105);
var membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27105__$1,new cljs.core.Keyword(null,"membership_id","membership_id",-171302674));
var tool_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27105__$1,new cljs.core.Keyword(null,"tool_id","tool_id",1550520216));
var effect = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27105__$1,new cljs.core.Keyword(null,"effect","effect",347343289));
var constraints_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27105__$1,new cljs.core.Keyword(null,"constraints_json","constraints_json",1549946864));
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,membership_id,cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),tool_id,new cljs.core.Keyword(null,"effect","effect",347343289),effect,new cljs.core.Keyword(null,"constraints","constraints",422775616),knoxx.backend.infra.db.policy.constraints_json__GT_clj(constraints_json)], null));
}),cljs.core.PersistentArrayMap.EMPTY,rows);
});
knoxx.backend.infra.db.policy.hydrate_membership_row = (function knoxx$backend$infra$db$policy$hydrate_membership_row(roles_by_m,tools_by_m,p__27111){
var map__27112 = p__27111;
var map__27112__$1 = cljs.core.__destructure_map(map__27112);
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var org_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"org_name","org_name",-1732897410));
var org_slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"org_slug","org_slug",-322631770));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
var is_default = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"is_default","is_default",-922813238));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"actor_id","actor_id",2086217260));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var user_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27112__$1,new cljs.core.Keyword(null,"user_id","user_id",993497112));
var roles = (function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(roles_by_m,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"actorId","actorId",989542370),new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),new cljs.core.Keyword(null,"isDefault","isDefault",809666532),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"orgName","orgName",-751297303),new cljs.core.Keyword(null,"roles","roles",143379530),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"toolPolicies","toolPolicies",-136088976),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"userId","userId",575594135)],[(function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_actor_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.db.policy.default_membership_actor_id(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"slug","slug",2029314850),roles));
}
})(),updated_at,is_default,org_id,org_name,roles,org_slug,created_at,(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(tools_by_m,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),status,id,user_id]);
});
knoxx.backend.infra.db.policy.hydrate_memberships = (async function knoxx$backend$infra$db$policy$hydrate_memberships(_pool,memberships){
if(cljs.core.empty_QMARK_(memberships)){
return cljs.core.PersistentVector.EMPTY;
} else {
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var membership_ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),memberships);
var role_rows = (await knoxx.backend.infra.stores.mongo_policy_roles.roles_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(db,membership_ids));
var tool_rows = (await knoxx.backend.infra.stores.mongo_policy_tools.tool_policies_for_memberships_BANG_.cljs$core$IFn$_invoke$arity$2(db,membership_ids));
var roles_by_m = knoxx.backend.infra.db.policy.grouped_membership_roles(role_rows);
var tools_by_m = knoxx.backend.infra.db.policy.grouped_membership_tool_policies(tool_rows);
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27119_SHARP_){
return knoxx.backend.infra.db.policy.hydrate_membership_row(roles_by_m,tools_by_m,p1__27119_SHARP_);
}),memberships);
}
});
knoxx.backend.infra.db.policy.header_value = (function knoxx$backend$infra$db$policy$header_value(headers_like,name){
if(cljs.core.truth_(headers_like)){
if(cljs.core.fn_QMARK_((headers_like["get"]))){
return clojure.string.trim((function (){var or__5162__auto__ = headers_like.get(name);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = headers_like.get(clojure.string.lower_case(name));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
} else {
return clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (headers_like[name]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (headers_like[clojure.string.lower_case(name)]);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
}
} else {
return null;
}
});
knoxx.backend.infra.db.policy.find_request_membership_row = (async function knoxx$backend$infra$db$policy$find_request_membership_row(_pool,headers_like){
var membership_id = knoxx.backend.infra.db.policy.header_value(headers_like,"x-knoxx-membership-id");
var user_email = (await (async function (){var G__27128 = knoxx.backend.infra.db.policy.header_value(headers_like,"x-knoxx-user-email");
if((G__27128 == null)){
return null;
} else {
return clojure.string.lower_case(G__27128);
}
})());
var org_id = knoxx.backend.infra.db.policy.header_value(headers_like,"x-knoxx-org-id");
var org_slug = (await (async function (){var G__27130 = knoxx.backend.infra.db.policy.header_value(headers_like,"x-knoxx-org-slug");
if((G__27130 == null)){
return null;
} else {
return clojure.string.lower_case(G__27130);
}
})());
if(((clojure.string.blank_QMARK_(membership_id)) && (clojure.string.blank_QMARK_(user_email)))){
throw knoxx.backend.infra.db.policy.http_error((401),"Missing x-knoxx-user-email or x-knoxx-membership-id","request_context_missing");
} else {
if((!(clojure.string.blank_QMARK_(membership_id)))){
return (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id));
} else {
return (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"user-email","user-email",2126479881),user_email,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),org_slug], null)));

}
}
});
knoxx.backend.infra.db.policy.rolePriority = (function knoxx$backend$infra$db$policy$rolePriority(slug){
var G__27134 = slug;
switch (G__27134) {
case "system_admin":
return (100);

break;
case "system-admin":
return (100);

break;
case "org_admin":
return (90);

break;
case "org-admin":
return (90);

break;
case "developer":
return (80);

break;
case "data_analyst":
return (70);

break;
case "data-analyst":
return (70);

break;
case "knowledge_worker":
return (60);

break;
case "knowledge-worker":
return (60);

break;
default:
return (0);

}
});
knoxx.backend.infra.db.policy.merge_tool_policies = (function knoxx$backend$infra$db$policy$merge_tool_policies(role_policies,membership_policies){
var merged = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
var seq__27157_27362 = cljs.core.seq(role_policies);
var chunk__27158_27363 = null;
var count__27159_27364 = (0);
var i__27160_27365 = (0);
while(true){
if((i__27160_27365 < count__27159_27364)){
var p_27366 = chunk__27158_27363.cljs$core$IIndexed$_nth$arity$2(null,i__27160_27365);
var n_27367 = knoxx.backend.infra.db.policy.normalize_tool_policy(p_27366);
var tid_27368 = new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(n_27367);
if((((cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(merged),tid_27368) == null)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(n_27367),"deny")) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(merged),tid_27368)),"deny")))))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(merged,cljs.core.assoc,tid_27368,n_27367);
} else {
}


var G__27370 = seq__27157_27362;
var G__27371 = chunk__27158_27363;
var G__27372 = count__27159_27364;
var G__27373 = (i__27160_27365 + (1));
seq__27157_27362 = G__27370;
chunk__27158_27363 = G__27371;
count__27159_27364 = G__27372;
i__27160_27365 = G__27373;
continue;
} else {
var temp__5825__auto___27374 = cljs.core.seq(seq__27157_27362);
if(temp__5825__auto___27374){
var seq__27157_27375__$1 = temp__5825__auto___27374;
if(cljs.core.chunked_seq_QMARK_(seq__27157_27375__$1)){
var c__5694__auto___27376 = cljs.core.chunk_first(seq__27157_27375__$1);
var G__27377 = cljs.core.chunk_rest(seq__27157_27375__$1);
var G__27378 = c__5694__auto___27376;
var G__27379 = cljs.core.count(c__5694__auto___27376);
var G__27380 = (0);
seq__27157_27362 = G__27377;
chunk__27158_27363 = G__27378;
count__27159_27364 = G__27379;
i__27160_27365 = G__27380;
continue;
} else {
var p_27381 = cljs.core.first(seq__27157_27375__$1);
var n_27382 = knoxx.backend.infra.db.policy.normalize_tool_policy(p_27381);
var tid_27383 = new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(n_27382);
if((((cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(merged),tid_27383) == null)) || (((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(n_27382),"deny")) || (cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(cljs.core.get.cljs$core$IFn$_invoke$arity$2(cljs.core.deref(merged),tid_27383)),"deny")))))){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(merged,cljs.core.assoc,tid_27383,n_27382);
} else {
}


var G__27384 = cljs.core.next(seq__27157_27375__$1);
var G__27385 = null;
var G__27386 = (0);
var G__27387 = (0);
seq__27157_27362 = G__27384;
chunk__27158_27363 = G__27385;
count__27159_27364 = G__27386;
i__27160_27365 = G__27387;
continue;
}
} else {
}
}
break;
}

var seq__27183_27388 = cljs.core.seq(membership_policies);
var chunk__27184_27389 = null;
var count__27185_27390 = (0);
var i__27186_27391 = (0);
while(true){
if((i__27186_27391 < count__27185_27390)){
var p_27392 = chunk__27184_27389.cljs$core$IIndexed$_nth$arity$2(null,i__27186_27391);
var n_27393 = knoxx.backend.infra.db.policy.normalize_tool_policy(p_27392);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(merged,cljs.core.assoc,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(n_27393),n_27393);


var G__27394 = seq__27183_27388;
var G__27395 = chunk__27184_27389;
var G__27396 = count__27185_27390;
var G__27397 = (i__27186_27391 + (1));
seq__27183_27388 = G__27394;
chunk__27184_27389 = G__27395;
count__27185_27390 = G__27396;
i__27186_27391 = G__27397;
continue;
} else {
var temp__5825__auto___27398 = cljs.core.seq(seq__27183_27388);
if(temp__5825__auto___27398){
var seq__27183_27399__$1 = temp__5825__auto___27398;
if(cljs.core.chunked_seq_QMARK_(seq__27183_27399__$1)){
var c__5694__auto___27400 = cljs.core.chunk_first(seq__27183_27399__$1);
var G__27401 = cljs.core.chunk_rest(seq__27183_27399__$1);
var G__27402 = c__5694__auto___27400;
var G__27403 = cljs.core.count(c__5694__auto___27400);
var G__27404 = (0);
seq__27183_27388 = G__27401;
chunk__27184_27389 = G__27402;
count__27185_27390 = G__27403;
i__27186_27391 = G__27404;
continue;
} else {
var p_27405 = cljs.core.first(seq__27183_27399__$1);
var n_27406 = knoxx.backend.infra.db.policy.normalize_tool_policy(p_27405);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(merged,cljs.core.assoc,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(n_27406),n_27406);


var G__27407 = cljs.core.next(seq__27183_27399__$1);
var G__27408 = null;
var G__27409 = (0);
var G__27410 = (0);
seq__27183_27388 = G__27407;
chunk__27184_27389 = G__27408;
count__27185_27390 = G__27409;
i__27186_27391 = G__27410;
continue;
}
} else {
}
}
break;
}

return cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),cljs.core.vals(cljs.core.deref(merged))));
});
knoxx.backend.infra.db.policy.validate_membership_row_BANG_ = (function knoxx$backend$infra$db$policy$validate_membership_row_BANG_(membership_row){
if(cljs.core.not(membership_row)){
throw knoxx.backend.infra.db.policy.http_error((401),"Request context did not resolve to a membership","request_context_unresolved");
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"user_status","user_status",-1364737026).cljs$core$IFn$_invoke$arity$1(membership_row),"active")){
throw knoxx.backend.infra.db.policy.http_error((403),"User is not active","user_inactive");
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(membership_row),"active")){
throw knoxx.backend.infra.db.policy.http_error((403),"Membership is not active","membership_inactive");
} else {
if(cljs.core.not_EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"org_status","org_status",-648531199).cljs$core$IFn$_invoke$arity$1(membership_row),"active")){
throw knoxx.backend.infra.db.policy.http_error((403),"Org is not active","org_inactive");
} else {
return null;
}
}
}
}
});
knoxx.backend.infra.db.policy.detailed_membership_roles = (async function knoxx$backend$infra$db$policy$detailed_membership_roles(pool,membership){
var role_ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"roles","roles",143379530).cljs$core$IFn$_invoke$arity$1(membership));
if(cljs.core.empty_QMARK_(role_ids)){
return cljs.core.PersistentVector.EMPTY;
} else {
var rows = (await knoxx.backend.infra.stores.mongo_policy_roles.list_roles_by_ids_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),role_ids));
return (await knoxx.backend.infra.db.policy.hydrate_role_maps(pool,rows));
}
});
knoxx.backend.infra.db.policy.request_user_map = (function knoxx$backend$infra$db$policy$request_user_map(membership_row){
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"username","username",1605666410),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"display_name","display_name",-1494335013).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"user_status","user_status",-1364737026).cljs$core$IFn$_invoke$arity$1(membership_row)], null);
});
knoxx.backend.infra.db.policy.request_org_map = (function knoxx$backend$infra$db$policy$request_org_map(membership_row){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"org_name","org_name",-1732897410).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"org_status","org_status",-648531199).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"is-primary","is-primary",-1769000197),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015).cljs$core$IFn$_invoke$arity$1(membership_row),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"org_kind","org_kind",-101702006).cljs$core$IFn$_invoke$arity$1(membership_row)], null);
});
knoxx.backend.infra.db.policy.request_membership_map = (function knoxx$backend$infra$db$policy$request_membership_map(membership,actor_id){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),actor_id,new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"is-default","is-default",1401171070),new cljs.core.Keyword(null,"is-default","is-default",1401171070).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"created-at","created-at",-89248644),new cljs.core.Keyword(null,"created-at","created-at",-89248644).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"updated-at","updated-at",-1592622336),new cljs.core.Keyword(null,"updated-at","updated-at",-1592622336).cljs$core$IFn$_invoke$arity$1(membership)], null);
});
knoxx.backend.infra.db.policy.request_policy_summary = (function knoxx$backend$infra$db$policy$request_policy_summary(membership,detailed_roles){
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"permissions","permissions",67803075),cljs.core.sort.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.db.policy.unique(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"permissions","permissions",67803075),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([detailed_roles], 0)))),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),knoxx.backend.infra.db.policy.merge_tool_policies(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic(new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([detailed_roles], 0)),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(membership)),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2((function (p1__27192_SHARP_){
return (- knoxx.backend.infra.db.policy.rolePriority(p1__27192_SHARP_));
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"slug","slug",2029314850),detailed_roles))], null);
});
knoxx.backend.infra.db.policy.request_context_map = (function knoxx$backend$infra$db$policy$request_context_map(membership_row,membership,detailed_roles){
var map__27194 = knoxx.backend.infra.db.policy.request_policy_summary(membership,detailed_roles);
var map__27194__$1 = cljs.core.__destructure_map(map__27194);
var permissions = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27194__$1,new cljs.core.Keyword(null,"permissions","permissions",67803075));
var tool_policies = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27194__$1,new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27194__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var actor_id = (function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_actor_id(new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(membership_row));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.db.policy.default_membership_actor_id(role_slugs);
}
})();
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"permissions","permissions",67803075),new cljs.core.Keyword(null,"is-system-admin","is-system-admin",850873732),new cljs.core.Keyword(null,"membership-tool-policies","membership-tool-policies",-646011419),new cljs.core.Keyword(null,"roles","roles",143379530),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557),new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"actor","actor",-1830560481)],[permissions,cljs.core.boolean$(cljs.core.some(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 2, ["system_admin",null,"system-admin",null], null), null),role_slugs)),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(membership),detailed_roles,role_slugs,knoxx.backend.infra.db.policy.request_membership_map(membership,actor_id),knoxx.backend.infra.db.policy.request_org_map(membership_row),tool_policies,knoxx.backend.infra.db.policy.request_user_map(membership_row),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"id","id",-1388402092),actor_id], null)]);
});
knoxx.backend.infra.db.policy.build_request_context = (async function knoxx$backend$infra$db$policy$build_request_context(pool,membership_row){
knoxx.backend.infra.db.policy.validate_membership_row_BANG_(membership_row);

var membership = cljs.core.first((await knoxx.backend.infra.db.policy.hydrate_memberships(pool,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [membership_row], null))));
var detailed_roles = (await knoxx.backend.infra.db.policy.detailed_membership_roles(pool,membership));
return knoxx.backend.infra.db.policy.request_context_map(membership_row,membership,detailed_roles);
});
knoxx.backend.infra.db.policy.actor_projection_role_slugs = (function knoxx$backend$infra$db$policy$actor_projection_role_slugs(actor){
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
/**
 * Best-effort set the projected membership's roles, keeping the membership
 * when role projection fails (mirrors sql-adapter's .catch behavior).
 */
knoxx.backend.infra.db.policy.project_actor_role_slugs_BANG_ = (async function knoxx$backend$infra$db$policy$project_actor_role_slugs_BANG_(membership,actor_id,role_slugs){
try{return (await knoxx.backend.infra.db.policy.set_membership_roles_BANG_(null,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"role-ids","role-ids",652985101),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"replace","replace",-786587770),true,new cljs.core.Keyword(null,"contract-projection","contract-projection",-1495437365),true], null)));
}catch (e27197){var err = e27197;
return console.warn("[policy-mongo] actor role projection failed; keeping actor membership",actor_id,err.message);
}});
/**
 * Upsert the user/membership/roles projection for one actor contract against
 * the Mongo twins. Returns the membership row.
 */
knoxx.backend.infra.db.policy.project_actor_via_store_BANG_ = (async function knoxx$backend$infra$db$policy$project_actor_via_store_BANG_(_pool,primary_org,actor){
var validated = knoxx.backend.domain.policy.protocol.validate_actor_BANG_(actor);
var actor_id = new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(validated);
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var email = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_email(new cljs.core.Keyword("actor","email","actor/email",1189986301).cljs$core$IFn$_invoke$arity$1(validated));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.db.actors.actor_email_from_id(actor_id);
}
})());
var display_name = (await (async function (){var or__5162__auto__ = (await (async function (){var G__27199 = new cljs.core.Keyword("actor","label","actor/label",-1796720603).cljs$core$IFn$_invoke$arity$1(validated);
var G__27199__$1 = (((G__27199 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27199)));
var G__27199__$2 = (((G__27199__$1 == null))?null:clojure.string.trim(G__27199__$1));
if((G__27199__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27199__$2);
}
})());
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
})());
var role_slugs = knoxx.backend.infra.db.policy.actor_projection_role_slugs(validated);
var user = (await knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),display_name,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"actor-contract",new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),null,new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null)));
var org = (await (async function (){var or__5162__auto__ = (await (async function (){var temp__5825__auto__ = (await (async function (){var G__27200 = new cljs.core.Keyword("actor","org","actor/org",175993262).cljs$core$IFn$_invoke$arity$1(validated);
var G__27200__$1 = (((G__27200 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27200)));
var G__27200__$2 = (((G__27200__$1 == null))?null:clojure.string.trim(G__27200__$1));
if((G__27200__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27200__$2);
}
})());
if(cljs.core.truth_(temp__5825__auto__)){
var org_slug = temp__5825__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2(db,org_slug));
} else {
return null;
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return primary_org;
}
})());
if(cljs.core.truth_(org)){
} else {
throw (new Error("primary org is required for actor projection sync"));
}

var membership = (await knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"is-default","is-default",1401171070),true], null)));
(await knoxx.backend.infra.stores.mongo_policy_directory.set_membership_actor_id_BANG_.cljs$core$IFn$_invoke$arity$3(db,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership),actor_id));

(await knoxx.backend.infra.db.policy.project_actor_role_slugs_BANG_(membership,actor_id,role_slugs));

return membership;
});
knoxx.backend.infra.db.policy.sync_actor_projections_BANG_ = (async function knoxx$backend$infra$db$policy$sync_actor_projections_BANG_(pool,primary_org,actors){
(await knoxx.backend.infra.db.policy.promise_each(actors,(function (p1__27201_SHARP_){
return knoxx.backend.infra.db.policy.project_actor_via_store_BANG_(pool,primary_org,p1__27201_SHARP_);
})));

return null;
});
knoxx.backend.infra.db.policy.sync_user_from_actor_contract_BANG__STAR_ = (function knoxx$backend$infra$db$policy$sync_user_from_actor_contract_BANG__STAR_(pool,primary_org,payload){
var actor_id = knoxx.backend.infra.db.policy.normalize_actor_id((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"actor-id","actor-id",897721067).cljs$core$IFn$_invoke$arity$1(payload);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(payload);
}
})());
var email = knoxx.backend.infra.db.policy.normalize_email(new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(payload));
if(cljs.core.not((function (){var or__5162__auto__ = email;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return actor_id;
}
})())){
return Promise.resolve(null);
} else {
var temp__5823__auto__ = (function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.find_actor_contract_by_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.db.policy.find_user_actor_contract_by_email(email);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var contract = temp__5823__auto__;
return knoxx.backend.infra.db.policy.sync_actor_projections_BANG_(pool,primary_org,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"actor","actor",-1830560481).cljs$core$IFn$_invoke$arity$1(contract)], null));
} else {
return Promise.resolve(null);
}
}
});
knoxx.backend.infra.db.policy.contract_records_by_class = (function knoxx$backend$infra$db$policy$contract_records_by_class(records,contract_class){
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__27202_SHARP_){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(contract_class,new cljs.core.Keyword(null,"contractClass","contractClass",-918904694).cljs$core$IFn$_invoke$arity$1(p1__27202_SHARP_));
}),records));
});
knoxx.backend.infra.db.policy.role_record_slug = (function knoxx$backend$infra$db$policy$role_record_slug(rec){
var G__27203 = (function (){var or__5162__auto__ = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(rec);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(rec,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"contract","contract",798152745),new cljs.core.Keyword("role","id","role/id",-1375589954)], null));
}
})();
var G__27203__$1 = (((G__27203 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27203)));
var G__27203__$2 = (((G__27203__$1 == null))?null:clojure.string.trim(G__27203__$1));
if((G__27203__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27203__$2);
}
});
knoxx.backend.infra.db.policy.role_display_name = (function knoxx$backend$infra$db$policy$role_display_name(slug,contract){
var or__5162__auto__ = (function (){var G__27213 = new cljs.core.Keyword("role","label","role/label",1746427558).cljs$core$IFn$_invoke$arity$1(contract);
var G__27213__$1 = (((G__27213 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27213)));
var G__27213__$2 = (((G__27213__$1 == null))?null:clojure.string.trim(G__27213__$1));
if((G__27213__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27213__$2);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = (function (){var G__27230 = new cljs.core.Keyword("role","name","role/name",1848754355).cljs$core$IFn$_invoke$arity$1(contract);
var G__27230__$1 = (((G__27230 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27230)));
var G__27230__$2 = (((G__27230__$1 == null))?null:clojure.string.trim(G__27230__$1));
if((G__27230__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27230__$2);
}
})();
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return clojure.string.join.cljs$core$IFn$_invoke$arity$2(" ",cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.capitalize,cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,clojure.string.split.cljs$core$IFn$_invoke$arity$2(slug,/[-_]+/))));
}
}
});
knoxx.backend.infra.db.policy.sync_contract_role_record_BANG_ = (async function knoxx$backend$infra$db$policy$sync_contract_role_record_BANG_(pool,caps_by_id,rec){
var temp__5825__auto___27415 = knoxx.backend.infra.db.policy.role_record_slug(rec);
if(cljs.core.truth_(temp__5825__auto___27415)){
var slug_27416 = temp__5825__auto___27415;
var contract_27417 = new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(rec);
var perms_27418 = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,(await (async function (){var or__5162__auto__ = new cljs.core.Keyword("role","permissions","role/permissions",54401385).cljs$core$IFn$_invoke$arity$1(contract_27417);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())))));
var role_27419 = (await knoxx.backend.infra.db.policy.ensure_role_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),null,new cljs.core.Keyword(null,"name","name",1843675177),knoxx.backend.infra.db.policy.role_display_name(slug_27416,contract_27417),new cljs.core.Keyword(null,"slug","slug",2029314850),slug_27416,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465),"platform",new cljs.core.Keyword(null,"built-in","built-in",1245067766),false,new cljs.core.Keyword(null,"system-managed","system-managed",-191362489),true], null)));
(await knoxx.backend.infra.db.policy.set_role_permissions_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role_27419),perms_27418));

(await knoxx.backend.infra.db.policy.set_role_tool_policies_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role_27419),knoxx.backend.infra.db.policy.role_tool_policies(caps_by_id,contract_27417)));
} else {
}

return null;
});
knoxx.backend.infra.db.policy.sync_contract_role_projections_BANG_ = (async function knoxx$backend$infra$db$policy$sync_contract_role_projections_BANG_(pool){
var records_27420 = (await knoxx.backend.domain.contracts.loader.load_all_contracts_BANG_(knoxx.backend.infra.db.policy.contracts_config()));
var caps_by_id_27421 = cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentArrayMap.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1((function (r){
return new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(r),new cljs.core.Keyword(null,"contract","contract",798152745).cljs$core$IFn$_invoke$arity$1(r)], null);
})),knoxx.backend.infra.db.policy.contract_records_by_class(records_27420,"capabilities"));
(await knoxx.backend.infra.db.policy.promise_each(knoxx.backend.infra.db.policy.contract_records_by_class(records_27420,"roles"),(function (p1__27248_SHARP_){
return knoxx.backend.infra.db.policy.sync_contract_role_record_BANG_(pool,caps_by_id_27421,p1__27248_SHARP_);
})));

return null;
});
knoxx.backend.infra.db.policy.ensure_primary_org_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_primary_org_BANG_(_pool,opts){
var primary_org_slug = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"primaryOrgSlug","primaryOrgSlug",-1593178745).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"primary-org-slug","primary-org-slug",1641883255).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "open-hax";
}
}
})());
var primary_org_name = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"primaryOrgName","primaryOrgName",-778206708).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"primary-org-name","primary-org-name",326101244).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Open Hax";
}
}
})());
var primary_org_kind = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"primaryOrgKind","primaryOrgKind",1238921763).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"primary-org-kind","primary-org-kind",-1155417716).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "platform_owner";
}
}
})());
var slug = knoxx.backend.infra.db.policy.slugify(primary_org_slug,"open-hax");
return (await knoxx.backend.infra.stores.mongo_policy_directory.ensure_primary_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"name","name",1843675177),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(primary_org_name)),new cljs.core.Keyword(null,"kind","kind",-717265803),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(primary_org_kind))], null)));
});
knoxx.backend.infra.db.policy.ensure_bootstrap_user_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_bootstrap_user_BANG_(pool,primary_org,opts){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var email = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"bootstrapSystemAdminEmail","bootstrapSystemAdminEmail",-461724198).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"bootstrap-system-admin-email","bootstrap-system-admin-email",1670894805).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "system-admin@open-hax.local";
}
}
})()))));
var dn = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"bootstrapSystemAdminName","bootstrapSystemAdminName",-2104021931).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"bootstrap-system-admin-name","bootstrap-system-admin-name",-1818565676).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "Knoxx System Admin";
}
}
})())));
var user = (await knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),dn,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"bootstrap",new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),null,new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null)));
var membership = (await knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(primary_org),new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"is-default","is-default",1401171070),true], null)));
(await knoxx.backend.infra.db.policy.set_membership_roles_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(primary_org),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["system-admin"], null),new cljs.core.Keyword(null,"replace","replace",-786587770),true], null)));

(await knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(membership),"system_admin"));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"user","user",1532431356),user,new cljs.core.Keyword(null,"membership","membership",254556333),membership], null);
});
knoxx.backend.infra.db.policy.append_audit_BANG_ = (async function knoxx$backend$infra$db$policy$append_audit_BANG_(_pool,p__27274){
var map__27275 = p__27274;
var map__27275__$1 = cljs.core.__destructure_map(map__27275);
var opts = map__27275__$1;
var before = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27275__$1,new cljs.core.Keyword(null,"before","before",-1633692388));
var after = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27275__$1,new cljs.core.Keyword(null,"after","after",594996914));
var temp__5825__auto__ = (await knoxx.backend.infra.mongo_client.init_mongo_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_audit_events.insert_event_BANG_.cljs$core$IFn$_invoke$arity$2(db,cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(opts,new cljs.core.Keyword(null,"before-json","before-json",1894162958),(cljs.core.truth_(before)?JSON.stringify(cljs.core.clj__GT_js(before)):null),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"after-json","after-json",2142150900),(cljs.core.truth_(after)?JSON.stringify(cljs.core.clj__GT_js(after)):null)], 0))));
} else {
return null;
}
});
/**
 * Connect to Mongo (idempotent) and ensure the policy-store indexes exist.
 * Returns the db, or nil when Mongo is unavailable. Index setup is guarded by
 * ensure-indexes! so a bad spec never crash-loops startup.
 */
knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_mongo_policy_db_BANG_(){
var db = (await knoxx.backend.infra.mongo_client.init_mongo_BANG_());
if(cljs.core.truth_(db)){
(await knoxx.backend.infra.stores.mongo_policy_store.ensure_indexes_BANG_(db));
} else {
}

return db;
});
knoxx.backend.infra.db.policy.touch_session_best_effort_BANG_ = (async function knoxx$backend$infra$db$policy$touch_session_best_effort_BANG_(_pool,session_id){
return (await knoxx.backend.infra.stores.mongo_policy_store.touch_session_best_effort_BANG_.cljs$core$IFn$_invoke$arity$1(session_id));
});
/**
 * Resolve a Knoxx auth context from headers-like (Fastify headers or CLJS map).
 * Returns Promise<CLJS ctx map>.
 */
knoxx.backend.infra.db.policy.resolve_request_context_BANG_ = (async function knoxx$backend$infra$db$policy$resolve_request_context_BANG_(pool,headers_like){
return (await knoxx.backend.infra.db.policy.build_request_context(pool,(await knoxx.backend.infra.db.policy.find_request_membership_row(pool,headers_like))));
});
knoxx.backend.infra.db.policy.evaluate_tool_access_BANG_ = (async function knoxx$backend$infra$db$policy$evaluate_tool_access_BANG_(pool,headers_like,tool_id){
var ctx = (await knoxx.backend.infra.db.policy.resolve_request_context_BANG_(pool,headers_like));
var match = cljs.core.some((function (p1__27276_SHARP_){
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"tool-id","tool-id",-290456894).cljs$core$IFn$_invoke$arity$1(p1__27276_SHARP_),tool_id)){
return p1__27276_SHARP_;
} else {
return null;
}
}),new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557).cljs$core$IFn$_invoke$arity$1(ctx));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"context","context",-830191113),ctx,new cljs.core.Keyword(null,"tool-id","tool-id",-290456894),tool_id,new cljs.core.Keyword(null,"allowed","allowed",1436019743),cljs.core.boolean$((await (async function (){var and__5160__auto__ = match;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"effect","effect",347343289).cljs$core$IFn$_invoke$arity$1(match),"allow");
} else {
return and__5160__auto__;
}
})()))], null);
});
/**
 * Return active actor credential rows for provider as {:credentials [...]}.
 */
knoxx.backend.infra.db.policy.list_actor_credentials_BANG_ = (async function knoxx$backend$infra$db$policy$list_actor_credentials_BANG_(_pool,provider){
if(clojure.string.blank_QMARK_(provider)){
throw (new Error("provider is required"));
} else {
}

var temp__5823__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"credentials","credentials",1373178854),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_row__GT_response,(await knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_actor_credentials_by_provider_BANG_.cljs$core$IFn$_invoke$arity$2(db,provider)))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"credentials","credentials",1373178854),cljs.core.PersistentVector.EMPTY], null);
}
});
knoxx.backend.infra.db.policy.list_permissions_BANG_ = (function knoxx$backend$infra$db$policy$list_permissions_BANG_(_pool){
var codes = cljs.core.vec(cljs.core.sort.cljs$core$IFn$_invoke$arity$1(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.mapcat.cljs$core$IFn$_invoke$arity$variadic((function (p1__27277_SHARP_){
return knoxx.backend.domain.contracts.roles.role_permissions(knoxx.backend.infra.db.policy.contracts_config(),p1__27277_SHARP_);
}),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([knoxx.backend.domain.contracts.roles.list_role_slugs(knoxx.backend.infra.db.policy.contracts_config())], 0)))));
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"permissions","permissions",67803075),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (c){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),c,new cljs.core.Keyword(null,"code","code",1586293142),c,new cljs.core.Keyword(null,"resourceKind","resourceKind",-1314642959),cljs.core.first(clojure.string.split.cljs$core$IFn$_invoke$arity$2(c,/\./)),new cljs.core.Keyword(null,"description","description",-1428560544),""], null);
}),codes)], null));
});
knoxx.backend.infra.db.policy.tool_row__GT_map = (function knoxx$backend$infra$db$policy$tool_row__GT_map(p__27281){
var map__27282 = p__27281;
var map__27282__$1 = cljs.core.__destructure_map(map__27282);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27282__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var label = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27282__$1,new cljs.core.Keyword(null,"label","label",1718410804));
var description = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27282__$1,new cljs.core.Keyword(null,"description","description",-1428560544));
var risk_level = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27282__$1,new cljs.core.Keyword(null,"risk_level","risk_level",1950920554));
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"label","label",1718410804),label,new cljs.core.Keyword(null,"description","description",-1428560544),description,new cljs.core.Keyword(null,"risk-level","risk-level",658496607),risk_level], null);
});
knoxx.backend.infra.db.policy.list_tools_BANG_ = (async function knoxx$backend$infra$db$policy$list_tools_BANG_(_pool){
var rows = (await knoxx.backend.infra.stores.mongo_policy_tools.list_tools_BANG_.cljs$core$IFn$_invoke$arity$1((await knoxx.backend.infra.db.policy.db_BANG_())));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"tools","tools",-1241731990),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.tool_row__GT_map,rows)], null);
});
knoxx.backend.infra.db.policy.get_bootstrap_context_BANG_ = (function knoxx$backend$infra$db$policy$get_bootstrap_context_BANG_(_pool,primary_org,bootstrap){
return Promise.resolve(new cljs.core.PersistentArrayMap(null, 2, ["primaryOrg",new cljs.core.PersistentArrayMap(null, 6, ["id",new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(primary_org),"slug",new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(primary_org),"name",new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(primary_org),"kind",new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(primary_org),"isPrimary",new cljs.core.Keyword(null,"is_primary","is_primary",-612440015).cljs$core$IFn$_invoke$arity$1(primary_org),"status",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(primary_org)], null),"bootstrapUser",new cljs.core.PersistentArrayMap(null, 4, ["id",cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),"email",cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"email","email",1415816706)], null)),"displayName",cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"display_name","display_name",-1494335013)], null)),"membershipId",cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null))], null)], null));
});
knoxx.backend.infra.db.policy.org_row__GT_map = (function knoxx$backend$infra$db$policy$org_row__GT_map(p__27284){
var map__27285 = p__27284;
var map__27285__$1 = cljs.core.__destructure_map(map__27285);
var data_lake_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"data_lake_count","data_lake_count",-1372574467));
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var member_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"member_count","member_count",-408355091));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
var is_primary = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"is_primary","is_primary",-612440015));
var role_count = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"role_count","role_count",-736226926));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27285__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"updated-at","updated-at",-1592622336),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"member-count","member-count",753583042),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"data-lake-count","data-lake-count",396240625),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"role-count","role-count",1122968409),new cljs.core.Keyword(null,"is-primary","is-primary",-1769000197),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[updated_at,slug,Number((function (){var or__5162__auto__ = member_count;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),name,Number((function (){var or__5162__auto__ = data_lake_count;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),status,id,kind,Number((function (){var or__5162__auto__ = role_count;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),is_primary,created_at]);
});
knoxx.backend.infra.db.policy.accumulate_org_lake_count_BANG_ = (async function knoxx$backend$infra$db$policy$accumulate_org_lake_count_BANG_(db,acc,o){
var lakes = (await knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o)));
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(acc,cljs.core.assoc,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),cljs.core.count(lakes));

return null;
});
/**
 * Resolve {org-id -> data-lake-count} for the given org rows (sequential
 * awaits; the directory twin's list-orgs! zeroes data_lake_count).
 */
knoxx.backend.infra.db.policy.org_data_lake_counts = (async function knoxx$backend$infra$db$policy$org_data_lake_counts(db,rows){
var acc = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(cljs.core.PersistentArrayMap.EMPTY);
(await knoxx.backend.infra.db.policy.promise_each(rows,cljs.core.partial.cljs$core$IFn$_invoke$arity$3(knoxx.backend.infra.db.policy.accumulate_org_lake_count_BANG_,db,acc)));

return cljs.core.deref(acc);
});
knoxx.backend.infra.db.policy.list_orgs_BANG_ = (async function knoxx$backend$infra$db$policy$list_orgs_BANG_(_pool){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var rows = (await knoxx.backend.infra.stores.mongo_policy_directory.list_orgs_BANG_.cljs$core$IFn$_invoke$arity$1(db));
var all_roles = (await knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),null], null)));
var role_counts = cljs.core.frequencies(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"org_id","org_id",1380185385),all_roles));
var lake_counts = (await knoxx.backend.infra.db.policy.org_data_lake_counts(db,rows));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"orgs","orgs",155776628),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (o){
return knoxx.backend.infra.db.policy.org_row__GT_map(cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(o,new cljs.core.Keyword(null,"role_count","role_count",-736226926),cljs.core.get.cljs$core$IFn$_invoke$arity$3(role_counts,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),(0)),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"data_lake_count","data_lake_count",-1372574467),cljs.core.get.cljs$core$IFn$_invoke$arity$3(lake_counts,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(o),(0))], 0)));
}),rows)], null);
});
knoxx.backend.infra.db.policy.org_response = (function knoxx$backend$infra$db$policy$org_response(org){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org","org",1495985),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"is-primary","is-primary",-1769000197),new cljs.core.Keyword(null,"is_primary","is_primary",-612440015).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(org)], null)], null);
});
knoxx.backend.infra.db.policy.create_org_BANG_ = (async function knoxx$backend$infra$db$policy$create_org_BANG_(pool,uid,mid,p__27288){
var map__27289 = p__27288;
var map__27289__$1 = cljs.core.__destructure_map(map__27289);
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27289__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27289__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27289__$1,new cljs.core.Keyword(null,"kind","kind",-717265803),"customer");
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27289__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
if(clojure.string.blank_QMARK_(name)){
throw (new Error("name is required"));
} else {
var s = knoxx.backend.infra.db.policy.slugify((await (async function (){var or__5162__auto__ = slug;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return name;
}
})()),"org");
var org = (await knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"slug","slug",2029314850),s,new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"kind","kind",-717265803),kind,new cljs.core.Keyword(null,"status","status",-1997798413),status], null)));
(await knoxx.backend.infra.db.policy.sync_contract_role_projections_BANG_(pool));

(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(org),new cljs.core.Keyword(null,"action","action",-811238024),"org.create",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"org",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(org)], null)));

return knoxx.backend.infra.db.policy.org_response(org);
}
});
knoxx.backend.infra.db.policy.self_org_slug = (function knoxx$backend$infra$db$policy$self_org_slug(email){
var normalized = (function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_email(email);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "user";
}
})();
return knoxx.backend.infra.db.policy.slugify((""+"self-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(clojure.string.replace(normalized,/@/,"-at-"))),"self-user");
});
knoxx.backend.infra.db.policy.ensure_self_org_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_self_org_BANG_(_pool,email,display_name){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var slug = knoxx.backend.infra.db.policy.self_org_slug(email);
var label = (await (async function (){var or__5162__auto__ = (await (async function (){var G__27290 = display_name;
var G__27290__$1 = (((G__27290 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27290)));
var G__27290__$2 = (((G__27290__$1 == null))?null:clojure.string.trim(G__27290__$1));
if((G__27290__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__27290__$2);
}
})());
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.db.policy.normalize_email(email);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "User";
}
}
})());
var name = (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(label)+" Self");
var existing = (await knoxx.backend.infra.stores.mongo_policy_directory.find_org_by_slug.cljs$core$IFn$_invoke$arity$2(db,slug));
if(cljs.core.truth_(existing)){
return existing;
} else {
return (await knoxx.backend.infra.stores.mongo_policy_directory.create_org_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"kind","kind",-717265803),"self",new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null)));
}
});
knoxx.backend.infra.db.policy.list_roles_BANG_ = (async function knoxx$backend$infra$db$policy$list_roles_BANG_(pool,p__27291){
var map__27292 = p__27291;
var map__27292__$1 = cljs.core.__destructure_map(map__27292);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27292__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var rows = (await knoxx.backend.infra.stores.mongo_policy_roles.list_roles_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null)));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"roles","roles",143379530),(await knoxx.backend.infra.db.policy.hydrate_role_maps(pool,rows))], null);
});
knoxx.backend.infra.db.policy.get_role_BANG_ = (async function knoxx$backend$infra$db$policy$get_role_BANG_(pool,role_id){
var temp__5823__auto__ = (await knoxx.backend.infra.stores.mongo_policy_roles.get_role_by_id_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),role_id));
if(cljs.core.truth_(temp__5823__auto__)){
var row = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"role","role",-736691072),cljs.core.first((await knoxx.backend.infra.db.policy.hydrate_role_maps(pool,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [row], null))))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"role","role",-736691072),null], null);
}
});
knoxx.backend.infra.db.policy.create_role_BANG_ = (async function knoxx$backend$infra$db$policy$create_role_BANG_(pool,uid,mid,p__27293){
var map__27294 = p__27293;
var map__27294__$1 = cljs.core.__destructure_map(map__27294);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27294__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27294__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27294__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var permission_codes = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27294__$1,new cljs.core.Keyword(null,"permission-codes","permission-codes",1093914418));
var tool_policies = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27294__$1,new cljs.core.Keyword(null,"tool-policies","tool-policies",-244759557));
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
if(clojure.string.blank_QMARK_(name)){
throw (new Error("name is required"));
} else {
var s = knoxx.backend.infra.db.policy.slugify((await (async function (){var or__5162__auto__ = slug;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return name;
}
})()),"role");
var role = (await knoxx.backend.infra.db.policy.ensure_role_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"slug","slug",2029314850),s,new cljs.core.Keyword(null,"scope-kind","scope-kind",-2016316465),"org",new cljs.core.Keyword(null,"built-in","built-in",1245067766),false,new cljs.core.Keyword(null,"system-managed","system-managed",-191362489),false], null)));
(await knoxx.backend.infra.db.policy.set_role_permissions_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role),(await (async function (){var or__5162__auto__ = permission_codes;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));

(await knoxx.backend.infra.db.policy.set_role_tool_policies_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role),(await (async function (){var or__5162__auto__ = tool_policies;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())));

(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"action","action",-811238024),"role.create",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"role",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role)], null)));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"role","role",-736691072),cljs.core.first((await knoxx.backend.infra.db.policy.hydrate_role_maps(pool,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [role], null))))], null);

}
}
});
knoxx.backend.infra.db.policy.credential_row__GT_map = (function knoxx$backend$infra$db$policy$credential_row__GT_map(p__27295){
var map__27296 = p__27295;
var map__27296__$1 = cljs.core.__destructure_map(map__27296);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"provider","provider",-302056900));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var account_identifier = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var secret_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"secret_json","secret_json",-724933577));
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27296__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"id","id",-1388402092),id,new cljs.core.Keyword(null,"provider","provider",-302056900),provider,new cljs.core.Keyword(null,"kind","kind",-717265803),kind,new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613),account_identifier,new cljs.core.Keyword(null,"status","status",-1997798413),status,new cljs.core.Keyword(null,"configuredFields","configuredFields",523282029),cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.str,cljs.core.keys(cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = secret_json;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)))))),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),created_at,new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),updated_at], null);
});
knoxx.backend.infra.db.policy.user_row__GT_map = (function knoxx$backend$infra$db$policy$user_row__GT_map(memberships_by_user,credentials_by_user,p__27297){
var map__27298 = p__27297;
var map__27298__$1 = cljs.core.__destructure_map(map__27298);
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"display_name","display_name",-1494335013));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"auth_provider","auth_provider",-1634726609));
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"external_subject","external_subject",-2123976135));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27298__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"updatedAt","updatedAt",1796679523),new cljs.core.Keyword(null,"credentials","credentials",1373178854),new cljs.core.Keyword(null,"displayName","displayName",-809144601),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"authProvider","authProvider",1745264718),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"memberships","memberships",1865599157),new cljs.core.Keyword(null,"externalSubject","externalSubject",-1176915620)],[email,updated_at,(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(credentials_by_user,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),display_name,created_at,auth_provider,status,id,(function (){var or__5162__auto__ = cljs.core.get.cljs$core$IFn$_invoke$arity$2(memberships_by_user,id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})(),external_subject]);
});
knoxx.backend.infra.db.policy.memberships_by_user = (function knoxx$backend$infra$db$policy$memberships_by_user(memberships){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,m){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,new cljs.core.Keyword(null,"userId","userId",575594135).cljs$core$IFn$_invoke$arity$1(m),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),m);
}),cljs.core.PersistentArrayMap.EMPTY,memberships);
});
knoxx.backend.infra.db.policy.credentials_by_user = (function knoxx$backend$infra$db$policy$credentials_by_user(credentials){
return cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,c){
return cljs.core.update.cljs$core$IFn$_invoke$arity$4(acc,new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(c),cljs.core.fnil.cljs$core$IFn$_invoke$arity$2(cljs.core.conj,cljs.core.PersistentVector.EMPTY),knoxx.backend.infra.db.policy.credential_row__GT_map(c));
}),cljs.core.PersistentArrayMap.EMPTY,credentials);
});
knoxx.backend.infra.db.policy.list_users_BANG_ = (async function knoxx$backend$infra$db$policy$list_users_BANG_(pool,p__27300){
var map__27301 = p__27300;
var map__27301__$1 = cljs.core.__destructure_map(map__27301);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27301__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var users = (await knoxx.backend.infra.stores.mongo_policy_directory.list_users_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null)));
var user_ids = cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"id","id",-1388402092),users);
var mem_rows = (await knoxx.backend.infra.stores.mongo_policy_directory.memberships_for_users_with_org_BANG_.cljs$core$IFn$_invoke$arity$3(db,user_ids,org_id));
var by_user = knoxx.backend.infra.db.policy.memberships_by_user((await knoxx.backend.infra.db.policy.hydrate_memberships(pool,mem_rows)));
var cred_rows = (cljs.core.truth_(org_id)?(await knoxx.backend.infra.stores.mongo_policy_actor_credentials.list_credentials_for_users_org_BANG_.cljs$core$IFn$_invoke$arity$3(db,user_ids,org_id)):cljs.core.PersistentVector.EMPTY);
var by_cred_user = knoxx.backend.infra.db.policy.credentials_by_user(cred_rows);
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"users","users",-713552705),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (p1__27299_SHARP_){
return knoxx.backend.infra.db.policy.user_row__GT_map(by_user,by_cred_user,p1__27299_SHARP_);
}),users)], null);
});
knoxx.backend.infra.db.policy.require_not_blank_BANG_ = (function knoxx$backend$infra$db$policy$require_not_blank_BANG_(value,message){
if(clojure.string.blank_QMARK_(value)){
throw (new Error(message));
} else {
return null;
}
});
knoxx.backend.infra.db.policy.upsert_user_actor_contract_for_membership_BANG_ = (async function knoxx$backend$infra$db$policy$upsert_user_actor_contract_for_membership_BANG_(pool,org_id,resolved_actor,email,display_name,role_slugs){
var org_row = (await knoxx.backend.infra.db.policy.find_org_by_id(pool,org_id));
return (await knoxx.backend.infra.db.policy.upsert_actor_contract_best_effort_BANG_(new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),resolved_actor,new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),display_name,new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(org_row),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"agent","agent",-766455027)], null)));
});
knoxx.backend.infra.db.policy.create_user_BANG_ = (async function knoxx$backend$infra$db$policy$create_user_BANG_(pool,uid,mid,p__27302){
var map__27303 = p__27302;
var map__27303__$1 = cljs.core.__destructure_map(map__27303);
var is_default = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27303__$1,new cljs.core.Keyword(null,"is-default","is-default",1401171070),true);
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var membership_status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27303__$1,new cljs.core.Keyword(null,"membership-status","membership-status",794952258),"active");
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var role_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"role-ids","role-ids",652985101));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27303__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
var external_subject = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27303__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var auth_provider = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27303__$1,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"local");
knoxx.backend.infra.db.policy.require_not_blank_BANG_(email,"email is required");

knoxx.backend.infra.db.policy.require_not_blank_BANG_(org_id,"org-id is required");

var dn = (await (async function (){var or__5162__auto__ = display_name;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return email;
}
})());
var resolved_slugs = (await (async function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["knowledge-worker"], null);
}
})());
var actor_contract = knoxx.backend.infra.db.policy.find_user_actor_contract_by_email(email);
var resolved_actor = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_actor_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(actor_contract);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
var or__5162__auto____$2 = knoxx.backend.infra.db.policy.user_actor_id_from_email(email);
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return knoxx.backend.infra.db.policy.default_membership_actor_id(resolved_slugs);
}
}
}
})());
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var user = (await knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),dn,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),auth_provider,new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),external_subject,new cljs.core.Keyword(null,"status","status",-1997798413),status], null)));
var ms = (await knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"status","status",-1997798413),membership_status,new cljs.core.Keyword(null,"is-default","is-default",1401171070),is_default], null)));
(await knoxx.backend.infra.db.policy.set_membership_roles_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(ms),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"role-ids","role-ids",652985101),(await (async function (){var or__5162__auto__ = role_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),resolved_slugs,new cljs.core.Keyword(null,"replace","replace",-786587770),true], null)));

(await knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(ms),resolved_actor));

(await knoxx.backend.infra.db.policy.upsert_user_actor_contract_for_membership_BANG_(pool,org_id,resolved_actor,email,dn,resolved_slugs));

(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"action","action",-811238024),"user.create_or_update",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"user",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user)], null)));

return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"user","user",1532431356),user,new cljs.core.Keyword(null,"membership","membership",254556333),ms], null);
});
knoxx.backend.infra.db.policy.secret_json__GT_clj = (function knoxx$backend$infra$db$policy$secret_json__GT_clj(value){
if((value == null)){
return cljs.core.PersistentArrayMap.EMPTY;
} else {
if(cljs.core.map_QMARK_(value)){
return value;
} else {
if(typeof value === 'string'){
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(JSON.parse(value),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
} else {
return cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(value,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));

}
}
}
});
/**
 * Resolve the active user + default-first active membership for a local
 * password login, plus the active local/password credential. Composes the
 * directory + actor-credentials twins; preserves the PG return shape. Returns
 * nil when no active user/membership matches.
 */
knoxx.backend.infra.db.policy.local_password_auth_record_BANG_ = (async function knoxx$backend$infra$db$policy$local_password_auth_record_BANG_(_pool,email){
var temp__5825__auto__ = knoxx.backend.infra.db.policy.normalize_email(email);
if(cljs.core.truth_(temp__5825__auto__)){
var normalized = temp__5825__auto__;
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var user = (await knoxx.backend.infra.stores.mongo_policy_directory.find_user_by_email_BANG_.cljs$core$IFn$_invoke$arity$2(db,normalized));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = user;
if(cljs.core.truth_(and__5160__auto__)){
return cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("active",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(user));
} else {
return and__5160__auto__;
}
})()))){
var temp__5825__auto____$1 = (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_by_email_and_org_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"user-email","user-email",2126479881),normalized,new cljs.core.Keyword(null,"active-only","active-only",2028055565),true], null)));
if(cljs.core.truth_(temp__5825__auto____$1)){
var row = temp__5825__auto____$1;
if(((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("active",new cljs.core.Keyword(null,"user_status","user_status",-1364737026).cljs$core$IFn$_invoke$arity$1(row))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2("active",new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row))))){
var cred = (await knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_credential_by_user_org_provider_kind_BANG_.cljs$core$IFn$_invoke$arity$5(db,new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),"local","password"));
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"display_name","display_name",-1494335013).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"membership-id","membership-id",-723542492),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"actor-id","actor-id",897721067),new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"secret-json","secret-json",-436252008),knoxx.backend.infra.db.policy.secret_json__GT_clj(new cljs.core.Keyword(null,"secret_json","secret_json",-724933577).cljs$core$IFn$_invoke$arity$1(cred))], null);
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
} else {
return null;
}
});
knoxx.backend.infra.db.policy.list_memberships_BANG_ = (async function knoxx$backend$infra$db$policy$list_memberships_BANG_(pool,p__27304){
var map__27305 = p__27304;
var map__27305__$1 = cljs.core.__destructure_map(map__27305);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27305__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
var rows = (await knoxx.backend.infra.stores.mongo_policy_directory.list_memberships_with_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null)));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"memberships","memberships",1865599157),(await knoxx.backend.infra.db.policy.hydrate_memberships(pool,rows))], null);
}
});
knoxx.backend.infra.db.policy.get_membership_BANG_ = (async function knoxx$backend$infra$db$policy$get_membership_BANG_(pool,membership_id){
var temp__5823__auto__ = (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id));
if(cljs.core.truth_(temp__5823__auto__)){
var row = temp__5823__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"membership","membership",254556333),cljs.core.first((await knoxx.backend.infra.db.policy.hydrate_memberships(pool,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [row], null))))], null);
} else {
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"membership","membership",254556333),null], null);
}
});
knoxx.backend.infra.db.policy.set_membership_roles_public_BANG_ = (async function knoxx$backend$infra$db$policy$set_membership_roles_public_BANG_(pool,uid,mid,membership_id,p__27306){
var map__27307 = p__27306;
var map__27307__$1 = cljs.core.__destructure_map(map__27307);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27307__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var role_ids = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27307__$1,new cljs.core.Keyword(null,"role-ids","role-ids",652985101));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27307__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27307__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var replace = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27307__$1,new cljs.core.Keyword(null,"replace","replace",-786587770),true);
var ms = (await knoxx.backend.infra.stores.mongo_policy_directory.get_membership_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id));
if(cljs.core.truth_(ms)){
} else {
throw (new Error("membership not found"));
}

var resolved_actor = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_actor_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.db.policy.normalize_actor_id(new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(ms));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.infra.db.policy.default_membership_actor_id((await (async function (){var or__5162__auto____$2 = role_slugs;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
}
}
})());
(await knoxx.backend.infra.db.policy.set_membership_roles_BANG_(pool,membership_id,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),(await (async function (){var or__5162__auto__ = org_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(ms);
}
})()),new cljs.core.Keyword(null,"role-ids","role-ids",652985101),(await (async function (){var or__5162__auto__ = role_ids;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),(await (async function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()),new cljs.core.Keyword(null,"replace","replace",-786587770),replace], null)));

(await knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_(pool,membership_id,resolved_actor));

var row_27457 = (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_row_with_user_org_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),membership_id));
(await knoxx.backend.infra.db.policy.upsert_actor_contract_best_effort_BANG_(new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"actor-id","actor-id",897721067),resolved_actor,new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(row_27457),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"display_name","display_name",-1494335013).cljs$core$IFn$_invoke$arity$1(row_27457),new cljs.core.Keyword(null,"org-slug","org-slug",-726595051),new cljs.core.Keyword(null,"org_slug","org_slug",-322631770).cljs$core$IFn$_invoke$arity$1(row_27457),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),(await (async function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})())], null)));

(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(ms),new cljs.core.Keyword(null,"action","action",-811238024),"membership.roles.update",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"membership",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),membership_id], null)));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"membership","membership",254556333),null], null);
});
knoxx.backend.infra.db.policy.data_lake_row__GT_map = (function knoxx$backend$infra$db$policy$data_lake_row__GT_map(p__27308){
var map__27309 = p__27308;
var map__27309__$1 = cljs.core.__destructure_map(map__27309);
var config_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"config_json","config_json",-1099428580));
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
var updated_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"updated_at","updated_at",-460224592));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27309__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"updated-at","updated-at",-1592622336),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"config","config",994861415),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[updated_at,slug,knoxx.backend.infra.db.policy.constraints_json__GT_clj(config_json),name,org_id,status,id,kind,created_at]);
});
knoxx.backend.infra.db.policy.list_data_lakes_BANG_ = (async function knoxx$backend$infra$db$policy$list_data_lakes_BANG_(_pool,p__27310){
var map__27311 = p__27310;
var map__27311__$1 = cljs.core.__destructure_map(map__27311);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27311__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data-lakes","data-lakes",-1773372492),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.data_lake_row__GT_map,(await knoxx.backend.infra.stores.mongo_policy_data_lakes.list_data_lakes_by_org_BANG_.cljs$core$IFn$_invoke$arity$2(db,org_id)))], null);
} else {
return null;
}
}
});
knoxx.backend.infra.db.policy.data_lake_response = (function knoxx$backend$infra$db$policy$data_lake_response(lake){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"data-lake","data-lake",-680568520),new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(lake),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(lake),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"name","name",1843675177).cljs$core$IFn$_invoke$arity$1(lake),new cljs.core.Keyword(null,"slug","slug",2029314850),new cljs.core.Keyword(null,"slug","slug",2029314850).cljs$core$IFn$_invoke$arity$1(lake),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(lake),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(lake)], null)], null);
});
knoxx.backend.infra.db.policy.create_data_lake_BANG_ = (async function knoxx$backend$infra$db$policy$create_data_lake_BANG_(pool,uid,mid,p__27312){
var map__27313 = p__27312;
var map__27313__$1 = cljs.core.__destructure_map(map__27313);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27313__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27313__$1,new cljs.core.Keyword(null,"name","name",1843675177));
var slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27313__$1,new cljs.core.Keyword(null,"slug","slug",2029314850));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27313__$1,new cljs.core.Keyword(null,"kind","kind",-717265803),"workspace_docs");
var config = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27313__$1,new cljs.core.Keyword(null,"config","config",994861415));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$3(map__27313__$1,new cljs.core.Keyword(null,"status","status",-1997798413),"active");
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
if(clojure.string.blank_QMARK_(name)){
throw (new Error("name is required"));
} else {
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
var s = knoxx.backend.infra.db.policy.slugify((await (async function (){var or__5162__auto__ = slug;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return name;
}
})()),"lake");
var lake = (await knoxx.backend.infra.stores.mongo_policy_data_lakes.create_data_lake_BANG_.cljs$core$IFn$_invoke$arity$3(db,org_id,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"name","name",1843675177),name,new cljs.core.Keyword(null,"slug","slug",2029314850),s,new cljs.core.Keyword(null,"kind","kind",-717265803),kind,new cljs.core.Keyword(null,"config-json","config-json",-2135731477),cljs.core.clj__GT_js((await (async function (){var or__5162__auto__ = config;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})())),new cljs.core.Keyword(null,"status","status",-1997798413),status], null)));
(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"action","action",-811238024),"data_lake.create",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"data_lake",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(lake)], null)));

return knoxx.backend.infra.db.policy.data_lake_response(lake);
} else {
return null;
}

}
}
});
knoxx.backend.infra.db.policy.create_session_BANG_ = (async function knoxx$backend$infra$db$policy$create_session_BANG_(_pool,p__27314){
var map__27315 = p__27314;
var map__27315__$1 = cljs.core.__destructure_map(map__27315);
var opts = map__27315__$1;
var token = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27315__$1,new cljs.core.Keyword(null,"token","token",-1211463215));
if(clojure.string.blank_QMARK_(token)){
throw (new Error("token is required"));
} else {
return (await knoxx.backend.infra.stores.mongo_policy_store.create_session_BANG_.cljs$core$IFn$_invoke$arity$2((await knoxx.backend.infra.db.policy.db_BANG_()),opts));
}
});
knoxx.backend.infra.db.policy.get_session_by_token_BANG_ = (async function knoxx$backend$infra$db$policy$get_session_by_token_BANG_(_pool,token){
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_store.get_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2(db,token));
} else {
return null;
}
});
knoxx.backend.infra.db.policy.delete_session_by_token_BANG_ = (async function knoxx$backend$infra$db$policy$delete_session_by_token_BANG_(_pool,token){
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_store.delete_session_by_token_BANG_.cljs$core$IFn$_invoke$arity$2(db,token));
} else {
return null;
}
});
knoxx.backend.infra.db.policy.cleanup_expired_sessions_BANG_ = (async function knoxx$backend$infra$db$policy$cleanup_expired_sessions_BANG_(_pool){
var temp__5823__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_store.cleanup_expired_sessions_BANG_.cljs$core$IFn$_invoke$arity$1(db));
} else {
return (0);
}
});
knoxx.backend.infra.db.policy.invite_response = (function knoxx$backend$infra$db$policy$invite_response(row,code){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"invite","invite",126355381),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"code","code",1586293142),code,new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),new cljs.core.Keyword(null,"expires_at","expires_at",-423028958).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"created-at","created-at",-89248644),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(row)], null)], null);
});
knoxx.backend.infra.db.policy.create_invite_BANG_ = (async function knoxx$backend$infra$db$policy$create_invite_BANG_(pool,uid,mid,p__27316){
var map__27317 = p__27316;
var map__27317__$1 = cljs.core.__destructure_map(map__27317);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27317__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27317__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27317__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var inviter_membership_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27317__$1,new cljs.core.Keyword(null,"inviter-membership-id","inviter-membership-id",294607735));
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
if(clojure.string.blank_QMARK_(email)){
throw (new Error("email is required"));
} else {
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
var slugs = (await (async function (){var or__5162__auto__ = role_slugs;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["basic-user"], null);
}
})());
var code = shadow.esm.esm_import$node_crypto.randomBytes((8)).toString("hex");
var expires_at = (new Date((Date.now() + ((((7) * (24)) * (3600)) * (1000)))));
var row = (await knoxx.backend.infra.stores.mongo_policy_invites.insert_invite_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"code","code",1586293142),code,new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"inviter-membership-id","inviter-membership-id",294607735),(await (async function (){var or__5162__auto__ = inviter_membership_id;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return mid;
}
})()),new cljs.core.Keyword(null,"role-slugs-json","role-slugs-json",-1985294108),JSON.stringify(cljs.core.clj__GT_js(slugs)),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),expires_at.toISOString()], null)));
(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"action","action",-811238024),"invite.create",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"invite",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row)], null)));

return knoxx.backend.infra.db.policy.invite_response(row,code);
} else {
return null;
}

}
}
});
knoxx.backend.infra.db.policy.parse_role_slugs_json = (function knoxx$backend$infra$db$policy$parse_role_slugs_json(value){
try{var parsed = (((value == null))?cljs.core.PersistentVector.EMPTY:((typeof value === 'string')?cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(JSON.parse(value)):cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$1(value)
));
if(cljs.core.sequential_QMARK_(parsed)){
return cljs.core.vec(parsed);
} else {
return cljs.core.PersistentVector.EMPTY;
}
}catch (e27318){var _ = e27318;
return cljs.core.PersistentVector.EMPTY;
}});
knoxx.backend.infra.db.policy.invite_error = (function knoxx$backend$infra$db$policy$invite_error(message,status){
var G__27319 = (new Error(message));
(G__27319["status"] = status);

return G__27319;
});
knoxx.backend.infra.db.policy.redeemed_invite_response = (function knoxx$backend$infra$db$policy$redeemed_invite_response(updated,code){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"invite","invite",126355381),new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"code","code",1586293142),code,new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"redeemed-at","redeemed-at",-1905871498),new cljs.core.Keyword(null,"redeemed_at","redeemed_at",-1486030703).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"created-at","created-at",-89248644),new cljs.core.Keyword(null,"created_at","created_at",1484050750).cljs$core$IFn$_invoke$arity$1(updated)], null)], null);
});
knoxx.backend.infra.db.policy.redeem_invite_BANG_ = (async function knoxx$backend$infra$db$policy$redeem_invite_BANG_(pool,code,email){
if(((clojure.string.blank_QMARK_(code)) || (clojure.string.blank_QMARK_(email)))){
throw (new Error("code and email are required"));
} else {
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var invite = (await knoxx.backend.infra.stores.mongo_policy_invites.pending_by_code_BANG_.cljs$core$IFn$_invoke$arity$2(db,code));
if(cljs.core.not(invite)){
throw knoxx.backend.infra.db.policy.invite_error("Invalid or expired invite code",(400));
} else {
var invite_email = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(invite))));
var req_email = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(email)));
var role_slugs = (await (async function (){var or__5162__auto__ = cljs.core.seq(knoxx.backend.infra.db.policy.parse_role_slugs_json(new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325).cljs$core$IFn$_invoke$arity$1(invite)));
if(or__5162__auto__){
return or__5162__auto__;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["basic-user"], null);
}
})());
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(invite_email,req_email)){
} else {
throw knoxx.backend.infra.db.policy.invite_error("Invite email does not match",(403));
}

var updated = (await knoxx.backend.infra.stores.mongo_policy_invites.redeem_invite_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(invite)));
(await knoxx.backend.infra.db.policy.create_user_BANG_(pool,null,null,new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"display-name","display-name",694513143),new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"invite",new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"membership-status","membership-status",794952258),"active",new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(updated),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),cljs.core.vec(role_slugs),new cljs.core.Keyword(null,"is-default","is-default",1401171070),true], null)));

return knoxx.backend.infra.db.policy.redeemed_invite_response(updated,code);
}
}
});
knoxx.backend.infra.db.policy.invite_row__GT_map = (function knoxx$backend$infra$db$policy$invite_row__GT_map(p__27320){
var map__27321 = p__27320;
var map__27321__$1 = cljs.core.__destructure_map(map__27321);
var created_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"created_at","created_at",1484050750));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var expires_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"expires_at","expires_at",-423028958));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"role_slugs","role_slugs",2101192325));
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"org_id","org_id",1380185385));
var redeemed_at = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"redeemed_at","redeemed_at",-1486030703));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"id","id",-1388402092));
var code = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27321__$1,new cljs.core.Keyword(null,"code","code",1586293142));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"email","email",1415816706),new cljs.core.Keyword(null,"expires-at","expires-at",1654982210),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"redeemed-at","redeemed-at",-1905871498),new cljs.core.Keyword(null,"code","code",1586293142),new cljs.core.Keyword(null,"created-at","created-at",-89248644)],[email,expires_at,knoxx.backend.infra.db.policy.parse_role_slugs_json(role_slugs),org_id,status,id,redeemed_at,code,created_at]);
});
knoxx.backend.infra.db.policy.list_invites_BANG_ = (async function knoxx$backend$infra$db$policy$list_invites_BANG_(_pool,p__27322){
var map__27323 = p__27322;
var map__27323__$1 = cljs.core.__destructure_map(map__27323);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27323__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27323__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
if(clojure.string.blank_QMARK_(org_id)){
throw (new Error("org-id is required"));
} else {
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"invites","invites",1962160761),cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.policy.invite_row__GT_map,(await knoxx.backend.infra.stores.mongo_policy_invites.list_invites_by_org_BANG_.cljs$core$IFn$_invoke$arity$3(db,org_id,status)))], null);
} else {
return null;
}
}
});
knoxx.backend.infra.db.policy.sync_actor_contracts_BANG_ = (async function knoxx$backend$infra$db$policy$sync_actor_contracts_BANG_(pool,primary_org){
return (await knoxx.backend.infra.db.policy.sync_actor_projections_BANG_(pool,primary_org,cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"actor","actor",-1830560481),knoxx.backend.infra.db.policy.list_actor_contracts())));
});
knoxx.backend.infra.db.policy.sync_user_from_actor_contract_BANG_ = (function knoxx$backend$infra$db$policy$sync_user_from_actor_contract_BANG_(pool,primary_org,opts){
return knoxx.backend.infra.db.policy.sync_user_from_actor_contract_BANG__STAR_(pool,primary_org,opts);
});
/**
 * Load the session secret from the Mongo config collection, generating and
 * persisting one if absent. Returns Promise<string>.
 */
knoxx.backend.infra.db.policy.recover_session_secret_BANG_ = (async function knoxx$backend$infra$db$policy$recover_session_secret_BANG_(_pool){
var temp__5823__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
return (await knoxx.backend.infra.stores.mongo_policy_store.recover_session_secret_BANG_.cljs$core$IFn$_invoke$arity$2(db,null));
} else {
throw (new Error("Mongo policy store unavailable"));
}
});
/**
 * Update a membership's actor-id and optionally its roles.
 */
knoxx.backend.infra.db.policy.update_user_actor_BANG_ = (async function knoxx$backend$infra$db$policy$update_user_actor_BANG_(pool,uid,mid,user_id,p__27324){
var map__27325 = p__27324;
var map__27325__$1 = cljs.core.__destructure_map(map__27325);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27325__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27325__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27325__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var ms = (await knoxx.backend.infra.stores.mongo_policy_directory.find_membership_by_user_and_org_BANG_.cljs$core$IFn$_invoke$arity$3((await knoxx.backend.infra.db.policy.db_BANG_()),user_id,org_id));
if(cljs.core.not(ms)){
throw (new Error("membership not found"));
} else {
var membership_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(ms);
var resolved_actor = (await (async function (){var or__5162__auto__ = knoxx.backend.infra.db.policy.normalize_actor_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = knoxx.backend.infra.db.policy.normalize_actor_id(new cljs.core.Keyword(null,"actor_id","actor_id",2086217260).cljs$core$IFn$_invoke$arity$1(ms));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return knoxx.backend.infra.db.policy.default_membership_actor_id((await (async function (){var or__5162__auto____$2 = role_slugs;
if(cljs.core.truth_(or__5162__auto____$2)){
return or__5162__auto____$2;
} else {
return cljs.core.PersistentVector.EMPTY;
}
})()));
}
}
})());
if(cljs.core.seq(role_slugs)){
(await knoxx.backend.infra.db.policy.set_membership_roles_BANG_(pool,membership_id,new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),role_slugs,new cljs.core.Keyword(null,"replace","replace",-786587770),true], null)));
} else {
}

(await knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_(pool,membership_id,resolved_actor));

(await knoxx.backend.infra.db.policy.append_audit_BANG_(pool,new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"actor-user-id","actor-user-id",584299995),uid,new cljs.core.Keyword(null,"actor-membership-id","actor-membership-id",291606239),mid,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"action","action",-811238024),"user.update_actor",new cljs.core.Keyword(null,"resource-kind","resource-kind",-2119603299),"user",new cljs.core.Keyword(null,"resource-id","resource-id",-1308422582),user_id], null)));

return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"ok","ok",967785236),true], null);
}
});
knoxx.backend.infra.db.policy.actor_credential_response = (function knoxx$backend$infra$db$policy$actor_credential_response(row){
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"credential","credential",-1519132150),(cljs.core.truth_(row)?(function (){var secret = cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"secret_json","secret_json",-724933577).cljs$core$IFn$_invoke$arity$1(row);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})(),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0));
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"accountIdentifier","accountIdentifier",-2043083613),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"configuredFields","configuredFields",523282029),new cljs.core.Keyword(null,"status","status",-1997798413),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"userId","userId",575594135),new cljs.core.Keyword(null,"secretJson","secretJson",1807839704),new cljs.core.Keyword(null,"provider","provider",-302056900)],[new cljs.core.Keyword(null,"account_identifier","account_identifier",-1949012161).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"org_id","org_id",1380185385).cljs$core$IFn$_invoke$arity$1(row),cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.name,cljs.core.keys(secret)))),new cljs.core.Keyword(null,"status","status",-1997798413).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(row),new cljs.core.Keyword(null,"user_id","user_id",993497112).cljs$core$IFn$_invoke$arity$1(row),secret,new cljs.core.Keyword(null,"provider","provider",-302056900).cljs$core$IFn$_invoke$arity$1(row)]);
})():null)], null);
});
/**
 * Upsert an actor credential by user-id + org-id + provider.
 */
knoxx.backend.infra.db.policy.upsert_actor_credential_BANG_ = (async function knoxx$backend$infra$db$policy$upsert_actor_credential_BANG_(_pool,_uid,_mid,user_id,p__27326){
var map__27327 = p__27326;
var map__27327__$1 = cljs.core.__destructure_map(map__27327);
var org_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"org-id","org-id",1485182668));
var provider = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"provider","provider",-302056900));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var account_identifier = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778));
var secret_json = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"secret-json","secret-json",-436252008));
var status = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27327__$1,new cljs.core.Keyword(null,"status","status",-1997798413));
var temp__5823__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5823__auto__)){
var db = temp__5823__auto__;
var row = (await knoxx.backend.infra.stores.mongo_policy_actor_credentials.upsert_actor_credential_BANG_.cljs$core$IFn$_invoke$arity$5(db,user_id,org_id,provider,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"kind","kind",-717265803),kind,new cljs.core.Keyword(null,"account-identifier","account-identifier",258852778),account_identifier,new cljs.core.Keyword(null,"secret-json","secret-json",-436252008),cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic((await (async function (){var or__5162__auto__ = secret_json;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})()),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)),new cljs.core.Keyword(null,"status","status",-1997798413),status], null)));
return knoxx.backend.infra.db.policy.actor_credential_response(row);
} else {
throw (new Error("Mongo policy store unavailable"));
}
});
knoxx.backend.infra.db.policy.context_pool = (function knoxx$backend$infra$db$policy$context_pool(policy_context){
return new cljs.core.Keyword(null,"pool","pool",-1814211613).cljs$core$IFn$_invoke$arity$1(policy_context);
});
knoxx.backend.infra.db.policy.configured_QMARK_ = (function knoxx$backend$infra$db$policy$configured_QMARK_(policy_context){
return cljs.core.boolean$((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"mongo?","mongo?",-901599739).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"query!","query!",1326722454).cljs$core$IFn$_invoke$arity$1(policy_context);
}
})());
});
knoxx.backend.infra.db.policy.context_primary_org = (function knoxx$backend$infra$db$policy$context_primary_org(policy_context){
return new cljs.core.Keyword(null,"primary-org","primary-org",-717687488).cljs$core$IFn$_invoke$arity$1(policy_context);
});
knoxx.backend.infra.db.policy.context_bootstrap = (function knoxx$backend$infra$db$policy$context_bootstrap(policy_context){
return new cljs.core.Keyword(null,"bootstrap","bootstrap",-462579128).cljs$core$IFn$_invoke$arity$1(policy_context);
});
knoxx.backend.infra.db.policy.context_actor_user_id = (function knoxx$backend$infra$db$policy$context_actor_user_id(policy_context){
return new cljs.core.Keyword(null,"bootstrap-user-id","bootstrap-user-id",1918461011).cljs$core$IFn$_invoke$arity$1(policy_context);
});
knoxx.backend.infra.db.policy.context_actor_membership_id = (function knoxx$backend$infra$db$policy$context_actor_membership_id(policy_context){
return new cljs.core.Keyword(null,"bootstrap-membership-id","bootstrap-membership-id",363462107).cljs$core$IFn$_invoke$arity$1(policy_context);
});
/**
 * No-op for the Mongo policy store: the shared Mongo client is owned by
 * infra.mongo-client and closed by the global shutdown path, not per
 * policy-context. Retained so graceful-shutdown's call site is unchanged.
 */
knoxx.backend.infra.db.policy.close_BANG_ = (function knoxx$backend$infra$db$policy$close_BANG_(_policy_context){
return Promise.resolve(null);
});
/**
 * Deprecated raw-SQL entrypoint. The Mongo policy store no longer executes
 * SQL, so a Mongo policy-context resolves nil here and legacy callers degrade
 * to their empty-result fallbacks. A context that injects its own :query! fn
 * (e.g. mailbox routes wiring a custom executor) still has it honored. Use the
 * named policy DB functions instead.
 */
knoxx.backend.infra.db.policy.query_BANG_ = (function knoxx$backend$infra$db$policy$query_BANG_(policy_context,sql_str,params){
var temp__5823__auto__ = new cljs.core.Keyword(null,"query!","query!",1326722454).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$2 ? f.cljs$core$IFn$_invoke$arity$2(sql_str,params) : f.call(null,sql_str,params));
} else {
return Promise.resolve(null);
}
});
knoxx.backend.infra.db.policy.bootstrap_context_BANG_ = (function knoxx$backend$infra$db$policy$bootstrap_context_BANG_(policy_context){
var temp__5823__auto__ = new cljs.core.Keyword(null,"bootstrap-context!","bootstrap-context!",-1480689717).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));
} else {
return knoxx.backend.infra.db.policy.get_bootstrap_context_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_primary_org(policy_context),knoxx.backend.infra.db.policy.context_bootstrap(policy_context));
}
});
knoxx.backend.infra.db.policy.resolve_context_BANG_ = (function knoxx$backend$infra$db$policy$resolve_context_BANG_(policy_context,headers_like){
var temp__5823__auto__ = new cljs.core.Keyword(null,"resolve-context!","resolve-context!",949348710).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(headers_like) : f.call(null,headers_like));
} else {
return knoxx.backend.infra.db.policy.resolve_request_context_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),headers_like);
}
});
knoxx.backend.infra.db.policy.sync_actor_contracts_for_context_BANG_ = (function knoxx$backend$infra$db$policy$sync_actor_contracts_for_context_BANG_(policy_context){
var temp__5823__auto__ = new cljs.core.Keyword(null,"sync-actor-contracts!","sync-actor-contracts!",1588392117).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$0 ? f.cljs$core$IFn$_invoke$arity$0() : f.call(null));
} else {
return knoxx.backend.infra.db.policy.sync_actor_contracts_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_primary_org(policy_context));
}
});
knoxx.backend.infra.db.policy.sync_user_from_actor_contract_for_context_BANG_ = (function knoxx$backend$infra$db$policy$sync_user_from_actor_contract_for_context_BANG_(policy_context,opts){
var temp__5823__auto__ = new cljs.core.Keyword(null,"sync-user-from-actor-contract!","sync-user-from-actor-contract!",1727790682).cljs$core$IFn$_invoke$arity$1(policy_context);
if(cljs.core.truth_(temp__5823__auto__)){
var f = temp__5823__auto__;
return (f.cljs$core$IFn$_invoke$arity$1 ? f.cljs$core$IFn$_invoke$arity$1(opts) : f.call(null,opts));
} else {
return knoxx.backend.infra.db.policy.sync_user_from_actor_contract_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_primary_org(policy_context),opts);
}
});
knoxx.backend.infra.db.policy.create_user_for_context_BANG_ = (function knoxx$backend$infra$db$policy$create_user_for_context_BANG_(policy_context,payload){
return knoxx.backend.infra.db.policy.create_user_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),payload);
});
knoxx.backend.infra.db.policy.local_password_auth_record_for_context_BANG_ = (function knoxx$backend$infra$db$policy$local_password_auth_record_for_context_BANG_(policy_context,email){
return knoxx.backend.infra.db.policy.local_password_auth_record_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),email);
});
knoxx.backend.infra.db.policy.create_invite_for_context_BANG_ = (function knoxx$backend$infra$db$policy$create_invite_for_context_BANG_(policy_context,payload){
return knoxx.backend.infra.db.policy.create_invite_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),payload);
});
knoxx.backend.infra.db.policy.create_org_for_context_BANG_ = (function knoxx$backend$infra$db$policy$create_org_for_context_BANG_(policy_context,payload){
return knoxx.backend.infra.db.policy.create_org_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),payload);
});
knoxx.backend.infra.db.policy.create_role_for_context_BANG_ = (function knoxx$backend$infra$db$policy$create_role_for_context_BANG_(policy_context,payload){
return knoxx.backend.infra.db.policy.create_role_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),payload);
});
knoxx.backend.infra.db.policy.create_data_lake_for_context_BANG_ = (function knoxx$backend$infra$db$policy$create_data_lake_for_context_BANG_(policy_context,payload){
return knoxx.backend.infra.db.policy.create_data_lake_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),payload);
});
knoxx.backend.infra.db.policy.set_membership_roles_for_context_BANG_ = (function knoxx$backend$infra$db$policy$set_membership_roles_for_context_BANG_(policy_context,membership_id,payload){
return knoxx.backend.infra.db.policy.set_membership_roles_public_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),membership_id,payload);
});
knoxx.backend.infra.db.policy.update_user_actor_for_context_BANG_ = (function knoxx$backend$infra$db$policy$update_user_actor_for_context_BANG_(policy_context,user_id,payload){
return knoxx.backend.infra.db.policy.update_user_actor_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),user_id,payload);
});
knoxx.backend.infra.db.policy.upsert_actor_credential_for_context_BANG_ = (function knoxx$backend$infra$db$policy$upsert_actor_credential_for_context_BANG_(policy_context,user_id,payload){
return knoxx.backend.infra.db.policy.upsert_actor_credential_BANG_(knoxx.backend.infra.db.policy.context_pool(policy_context),knoxx.backend.infra.db.policy.context_actor_user_id(policy_context),knoxx.backend.infra.db.policy.context_actor_membership_id(policy_context),user_id,payload);
});
knoxx.backend.infra.db.policy.get_actor_credential_BANG_ = (async function knoxx$backend$infra$db$policy$get_actor_credential_BANG_(_policy_context,actor_id,provider){
var temp__5825__auto__ = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(temp__5825__auto__)){
var db = temp__5825__auto__;
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"credential","credential",-1519132150),knoxx.backend.infra.stores.mongo_policy_actor_credentials.credential_row__GT_response((await knoxx.backend.infra.stores.mongo_policy_actor_credentials.get_actor_credential_by_actor_and_provider_BANG_.cljs$core$IFn$_invoke$arity$3(db,actor_id,provider)))], null);
} else {
return null;
}
});
knoxx.backend.infra.db.policy.allowlist_best_effort_BANG_ = (async function knoxx$backend$infra$db$policy$allowlist_best_effort_BANG_(pool,primary_org,opts){
if(cljs.core.seq((await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"bootstrapAllowlistEmails","bootstrapAllowlistEmails",-1359191424).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"bootstrap-allowlist-emails","bootstrap-allowlist-emails",1172382788).cljs$core$IFn$_invoke$arity$1(opts);
}
})()))){
try{return (await (knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_users_BANG_.cljs$core$IFn$_invoke$arity$3 ? knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_users_BANG_.cljs$core$IFn$_invoke$arity$3(pool,primary_org,opts) : knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_users_BANG_.call(null,pool,primary_org,opts)));
}catch (e27328){var err = e27328;
return console.warn("[policy-db] allowlist failed:",err.message);
}} else {
return null;
}
});
knoxx.backend.infra.db.policy.sync_actor_contracts_best_effort_BANG_ = (async function knoxx$backend$infra$db$policy$sync_actor_contracts_best_effort_BANG_(pool,primary_org){
try{return (await knoxx.backend.infra.db.policy.sync_actor_contracts_BANG_(pool,primary_org));
}catch (e27329){var err = e27329;
return console.warn("[policy-db] actor sync failed:",err.message);
}});
knoxx.backend.infra.db.policy.cleanup_expired_sessions_best_effort_BANG_ = (async function knoxx$backend$infra$db$policy$cleanup_expired_sessions_best_effort_BANG_(pool){
try{return (await knoxx.backend.infra.db.policy.cleanup_expired_sessions_BANG_(pool));
}catch (e27330){var _ = e27330;
return null;
}});
knoxx.backend.infra.db.policy.policy_context_map = (function knoxx$backend$infra$db$policy$policy_context_map(primary_org,bootstrap){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"pool","pool",-1814211613),null,new cljs.core.Keyword(null,"mongo?","mongo?",-901599739),true,new cljs.core.Keyword(null,"primary-org","primary-org",-717687488),primary_org,new cljs.core.Keyword(null,"bootstrap","bootstrap",-462579128),bootstrap,new cljs.core.Keyword(null,"bootstrap-user-id","bootstrap-user-id",1918461011),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"id","id",-1388402092)], null)),new cljs.core.Keyword(null,"bootstrap-membership-id","bootstrap-membership-id",363462107),cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(bootstrap,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"membership","membership",254556333),new cljs.core.Keyword(null,"id","id",-1388402092)], null))], null);
});
/**
 * Mongo-backed initialisation: connect + ensure twin indexes (guarded so a
 * bad spec never crash-loops startup), seed the primary org + contract role
 * projections + bootstrap user, run best-effort allowlist/actor-sync/cleanup,
 * then return the policy context map.
 */
knoxx.backend.infra.db.policy.initialise_policy_db_BANG_ = (async function knoxx$backend$infra$db$policy$initialise_policy_db_BANG_(opts){
var db = (await knoxx.backend.infra.db.policy.ensure_mongo_policy_db_BANG_());
if(cljs.core.truth_(db)){
} else {
throw (new Error("Mongo policy store unavailable"));
}

var primary_org = (await knoxx.backend.infra.db.policy.ensure_primary_org_BANG_(null,opts));
(await knoxx.backend.infra.db.policy.sync_contract_role_projections_BANG_(null));

var bootstrap = (await knoxx.backend.infra.db.policy.ensure_bootstrap_user_BANG_(null,primary_org,opts));
(await knoxx.backend.infra.db.policy.allowlist_best_effort_BANG_(null,primary_org,opts));

(await knoxx.backend.infra.db.policy.sync_actor_contracts_best_effort_BANG_(null,primary_org));

(await knoxx.backend.infra.db.policy.cleanup_expired_sessions_best_effort_BANG_(null));

return knoxx.backend.infra.db.policy.policy_context_map(primary_org,bootstrap);
});
/**
 * Initialise the Mongo-backed policy DB. Returns Promise<CLJS policy context |
 * nil>; nil only when Mongo is unavailable.
 */
knoxx.backend.infra.db.policy.create_policy_db = (async function knoxx$backend$infra$db$policy$create_policy_db(options){
var opts = ((cljs.core.map_QMARK_(options))?options:cljs.core.js__GT_clj.cljs$core$IFn$_invoke$arity$variadic(options,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword(null,"keywordize-keys","keywordize-keys",1310784252),true], 0)));
try{return (await knoxx.backend.infra.db.policy.initialise_policy_db_BANG_(opts));
}catch (e27331){var err = e27331;
console.error("[policy-db] Mongo policy DB init failed:",err.message);

return null;
}});
knoxx.backend.infra.db.policy.split_bootstrap_values = (function knoxx$backend$infra$db$policy$split_bootstrap_values(value){
return cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.trim,clojure.string.split.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)),/[\s,]+/)))));
});
knoxx.backend.infra.db.policy.bootstrap_allowlist_emails = (function knoxx$backend$infra$db$policy$bootstrap_allowlist_emails(opts){
return cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(clojure.string.lower_case,knoxx.backend.infra.db.policy.split_bootstrap_values((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"bootstrapAllowlistEmails","bootstrapAllowlistEmails",-1359191424).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"bootstrap-allowlist-emails","bootstrap-allowlist-emails",1172382788).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})())));
});
knoxx.backend.infra.db.policy.bootstrap_allowlist_role_slugs = (function knoxx$backend$infra$db$policy$bootstrap_allowlist_role_slugs(opts){
var role_slugs = knoxx.backend.infra.db.policy.split_bootstrap_values((function (){var or__5162__auto__ = new cljs.core.Keyword(null,"bootstrapAllowlistRoleSlugs","bootstrapAllowlistRoleSlugs",1281999922).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"bootstrap-allowlist-role-slugs","bootstrap-allowlist-role-slugs",-1359416373).cljs$core$IFn$_invoke$arity$1(opts);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "";
}
}
})());
if(cljs.core.seq(role_slugs)){
return role_slugs;
} else {
return new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, ["knowledge-worker"], null);
}
});
knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_role_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_bootstrap_allowlist_role_BANG_(pool,org_id,membership_id,slug){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var role = (await (async function (){var or__5162__auto__ = (await knoxx.backend.infra.db.policy.find_role(pool,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id], null)));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (await knoxx.backend.infra.db.policy.find_role(pool,new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"slug","slug",2029314850),slug,new cljs.core.Keyword(null,"org-id","org-id",1485182668),null], null)));
}
})());
if(cljs.core.truth_(role)){
return (await knoxx.backend.infra.stores.mongo_policy_roles.set_membership_roles_BANG_.cljs$core$IFn$_invoke$arity$4(db,membership_id,false,new cljs.core.PersistentVector(null, 1, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(role)], null)));
} else {
return null;
}
});
knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_user_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_bootstrap_allowlist_user_BANG_(pool,org_id,role_slugs,email){
var db = (await knoxx.backend.infra.db.policy.db_BANG_());
var user = (await knoxx.backend.infra.stores.mongo_policy_directory.create_user_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"email","email",1415816706),email,new cljs.core.Keyword(null,"display-name","display-name",694513143),email,new cljs.core.Keyword(null,"auth-provider","auth-provider",4882231),"bootstrap",new cljs.core.Keyword(null,"external-subject","external-subject",-265707402),null,new cljs.core.Keyword(null,"status","status",-1997798413),"active"], null)));
var ms = (await knoxx.backend.infra.stores.mongo_policy_directory.upsert_membership_BANG_.cljs$core$IFn$_invoke$arity$2(db,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"user-id","user-id",-206822291),new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(user),new cljs.core.Keyword(null,"org-id","org-id",1485182668),org_id,new cljs.core.Keyword(null,"status","status",-1997798413),"active",new cljs.core.Keyword(null,"is-default","is-default",1401171070),false], null)));
(await knoxx.backend.infra.db.policy.promise_each(role_slugs,cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_role_BANG_,pool,org_id,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(ms))));

return (await knoxx.backend.infra.db.policy.set_membership_actor_id_BANG_(pool,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(ms),knoxx.backend.infra.db.policy.default_membership_actor_id(role_slugs)));
});
knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_users_BANG_ = (async function knoxx$backend$infra$db$policy$ensure_bootstrap_allowlist_users_BANG_(pool,primary_org,opts){
var emails = knoxx.backend.infra.db.policy.bootstrap_allowlist_emails(opts);
var role_slugs = knoxx.backend.infra.db.policy.bootstrap_allowlist_role_slugs(opts);
var org_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(primary_org);
if(cljs.core.seq(emails)){
return (await Promise.all(cljs.core.into_array.cljs$core$IFn$_invoke$arity$1(cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(cljs.core.partial.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.db.policy.ensure_bootstrap_allowlist_user_BANG_,pool,org_id,role_slugs),emails))));
} else {
return null;
}
});

//# sourceMappingURL=knoxx.backend.infra.db.policy.js.map
