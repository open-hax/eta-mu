import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.infra.auth.authz.js";
import "./knoxx.backend.domain.time.js";
import "./knoxx.backend.infra.openplanner.memory.js";
import "./shadow.esm.esm_import$node_crypto.js";
import "./shadow.esm.esm_import$node_fs$promises.js";
import "./shadow.esm.esm_import$node_path.js";
goog.provide('knoxx.backend.infra.document_state');
if((typeof knoxx !== 'undefined') && (typeof knoxx.backend !== 'undefined') && (typeof knoxx.backend.infra !== 'undefined') && (typeof knoxx.backend.infra.document_state !== 'undefined') && (typeof knoxx.backend.infra.document_state.database_state_STAR_ !== 'undefined')){
} else {
knoxx.backend.infra.document_state.database_state_STAR_ = cljs.core.atom.cljs$core$IFn$_invoke$arity$1(null);
}
knoxx.backend.infra.document_state.js_array_seq = (function knoxx$backend$infra$document_state$js_array_seq(arr){
if((!((arr == null)))){
var iter__5649__auto__ = (function knoxx$backend$infra$document_state$js_array_seq_$_iter__27488(s__27489){
return (new cljs.core.LazySeq(null,(function (){
var s__27489__$1 = s__27489;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__27489__$1);
if(temp__5825__auto__){
var s__27489__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__27489__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__27489__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__27491 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__27490 = (0);
while(true){
if((i__27490 < size__5648__auto__)){
var i = cljs.core._nth(c__5647__auto__,i__27490);
cljs.core.chunk_append(b__27491,(arr[i]));

var G__27833 = (i__27490 + (1));
i__27490 = G__27833;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__27491),knoxx$backend$infra$document_state$js_array_seq_$_iter__27488(cljs.core.chunk_rest(s__27489__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__27491),null);
}
} else {
var i = cljs.core.first(s__27489__$2);
return cljs.core.cons((arr[i]),knoxx$backend$infra$document_state$js_array_seq_$_iter__27488(cljs.core.rest(s__27489__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(cljs.core.range.cljs$core$IFn$_invoke$arity$1(arr.length));
} else {
return null;
}
});
knoxx.backend.infra.document_state.request_session_id = (function knoxx$backend$infra$document_state$request_session_id(request){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1((function (){var or__5162__auto__ = (request["headers"]["x-knoxx-session-id"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "";
}
})()));
});
knoxx.backend.infra.document_state.database_root_dir = (function knoxx$backend$infra$document_state$database_root_dir(_runtime,config){
return shadow.esm.esm_import$node_path.resolve(new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config),".knoxx","databases");
});
knoxx.backend.infra.document_state.database_docs_dir = (function knoxx$backend$infra$document_state$database_docs_dir(runtime,config,db_id){
return shadow.esm.esm_import$node_path.join(knoxx.backend.infra.document_state.database_root_dir(runtime,config),db_id,"docs");
});
knoxx.backend.infra.document_state.database_owner_key = (function knoxx$backend$infra$document_state$database_owner_key(auth_context){
var or__5162__auto__ = (function (){var G__27508 = knoxx.backend.infra.auth.authz.ctx_org_id(auth_context);
var G__27508__$1 = (((G__27508 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27508)));
if((G__27508__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__27508__$1);
}
})();
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "__global__";
}
});
knoxx.backend.infra.document_state.default_database_id = (function knoxx$backend$infra$document_state$default_database_id(auth_context){
var temp__5823__auto__ = (function (){var G__27510 = knoxx.backend.infra.auth.authz.ctx_org_id(auth_context);
var G__27510__$1 = (((G__27510 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27510)));
if((G__27510__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__27510__$1);
}
})();
if(cljs.core.truth_(temp__5823__auto__)){
var org_id = temp__5823__auto__;
return (""+"default:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_id));
} else {
return "default";
}
});
knoxx.backend.infra.document_state.default_database_profile = (function knoxx$backend$infra$document_state$default_database_profile(var_args){
var G__27514 = arguments.length;
switch (G__27514) {
case 2:
return knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var db_id = knoxx.backend.infra.document_state.default_database_id(auth_context);
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"privateToSession","privateToSession",-73446717),new cljs.core.Keyword(null,"orgId","orgId",-73585595),new cljs.core.Keyword(null,"forumMode","forumMode",2078997894),new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882),new cljs.core.Keyword(null,"ownerSessionId","ownerSessionId",1073095462),new cljs.core.Keyword(null,"name","name",1843675177),new cljs.core.Keyword(null,"orgSlug","orgSlug",-138550998),new cljs.core.Keyword(null,"useLocalDocsBaseUrl","useLocalDocsBaseUrl",-1109521974),new cljs.core.Keyword(null,"createdAt","createdAt",-936788),new cljs.core.Keyword(null,"ownerUserId","ownerUserId",-1250504308),new cljs.core.Keyword(null,"qdrantCollection","qdrantCollection",226372371),new cljs.core.Keyword(null,"ownerMembershipId","ownerMembershipId",2136804692),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"publicDocsBaseUrl","publicDocsBaseUrl",-1708554755)],[false,knoxx.backend.infra.auth.authz.ctx_org_id(auth_context),false,knoxx.backend.infra.document_state.database_docs_dir(runtime,config,db_id),null,"Workspace Docs",knoxx.backend.infra.auth.authz.ctx_org_slug(auth_context),true,knoxx.backend.domain.time.now_iso(),knoxx.backend.infra.auth.authz.ctx_user_id(auth_context),new cljs.core.Keyword(null,"collection-name","collection-name",600435477).cljs$core$IFn$_invoke$arity$1(config),knoxx.backend.infra.auth.authz.ctx_membership_id(auth_context),db_id,""]);
}));

(knoxx.backend.infra.document_state.default_database_profile.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.document_state.default_database_record = (function knoxx$backend$infra$document_state$default_database_record(){
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"history","history",-247395220),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"progress","progress",244323547),null,new cljs.core.Keyword(null,"lastRequest","lastRequest",-738015741),null], null);
});
knoxx.backend.infra.document_state.ensure_database_state_BANG_ = (function knoxx$backend$infra$document_state$ensure_database_state_BANG_(var_args){
var G__27546 = arguments.length;
switch (G__27546) {
case 2:
return knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
if(cljs.core.truth_(cljs.core.deref(knoxx.backend.infra.document_state.database_state_STAR_))){
} else {
cljs.core.reset_BANG_(knoxx.backend.infra.document_state.database_state_STAR_,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"active-id","active-id",-59238656),"default",new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"profiles","profiles",507634713),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"records","records",1326822832),cljs.core.PersistentArrayMap.EMPTY], null));
}

cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.database_state_STAR_,(function (state){
var state__$1 = cljs.core.merge.cljs$core$IFn$_invoke$arity$variadic(cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"active-id","active-id",-59238656),"default",new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"profiles","profiles",507634713),cljs.core.PersistentArrayMap.EMPTY,new cljs.core.Keyword(null,"records","records",1326822832),cljs.core.PersistentArrayMap.EMPTY], null),state], 0));
var global_default = knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
var state__$2 = cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(state__$1,new cljs.core.Keyword(null,"profiles","profiles",507634713),(function (p1__27523_SHARP_){
if(cljs.core.contains_QMARK_(p1__27523_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(global_default))){
return p1__27523_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__27523_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(global_default),global_default);
}
})),new cljs.core.Keyword(null,"records","records",1326822832),(function (p1__27538_SHARP_){
if(cljs.core.contains_QMARK_(p1__27538_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(global_default))){
return p1__27538_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__27538_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(global_default),knoxx.backend.infra.document_state.default_database_record());
}
}));
var owner_key = knoxx.backend.infra.document_state.database_owner_key(auth_context);
var scoped_default = knoxx.backend.infra.document_state.default_database_profile.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context);
var G__27561 = state__$2;
var G__27561__$1 = (cljs.core.truth_(auth_context)?cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(cljs.core.update.cljs$core$IFn$_invoke$arity$3(G__27561,new cljs.core.Keyword(null,"profiles","profiles",507634713),(function (p1__27539_SHARP_){
if(cljs.core.contains_QMARK_(p1__27539_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_default))){
return p1__27539_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__27539_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_default),scoped_default);
}
})),new cljs.core.Keyword(null,"records","records",1326822832),(function (p1__27540_SHARP_){
if(cljs.core.contains_QMARK_(p1__27540_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_default))){
return p1__27540_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__27540_SHARP_,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_default),knoxx.backend.infra.document_state.default_database_record());
}
})),new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),(function (p1__27541_SHARP_){
if(cljs.core.contains_QMARK_(p1__27541_SHARP_,owner_key)){
return p1__27541_SHARP_;
} else {
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(p1__27541_SHARP_,owner_key,new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(scoped_default));
}
})):G__27561);
if((auth_context == null)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__27561__$1,new cljs.core.Keyword(null,"active-id","active-id",-59238656),(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"active-id","active-id",-59238656).cljs$core$IFn$_invoke$arity$1(state__$2);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(global_default);
}
})());
} else {
return G__27561__$1;
}
}));

return cljs.core.deref(knoxx.backend.infra.document_state.database_state_STAR_);
}));

(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.document_state.ensure_dir_BANG_ = (function knoxx$backend$infra$document_state$ensure_dir_BANG_(_runtime,dir_path){
return shadow.esm.esm_import$node_fs$promises.mkdir(dir_path,({"recursive": true}));
});
knoxx.backend.infra.document_state.profile_can_access_QMARK_ = (function knoxx$backend$infra$document_state$profile_can_access_QMARK_(var_args){
var G__27569 = arguments.length;
switch (G__27569) {
case 2:
return knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$2 = (function (profile,session_id){
return knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,null,session_id);
}));

(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3 = (function (profile,auth_context,session_id){
var org_id = (function (){var G__27575 = new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(profile);
var G__27575__$1 = (((G__27575 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__27575)));
if((G__27575__$1 == null)){
return null;
} else {
return cljs.core.not_empty(G__27575__$1);
}
})();
var org_allowed_QMARK_ = (cljs.core.truth_(org_id)?(((auth_context == null)) || (((knoxx.backend.infra.auth.authz.system_admin_QMARK_(auth_context)) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(org_id,(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.auth.authz.ctx_org_id(auth_context)))))))):(((auth_context == null)) || (knoxx.backend.infra.auth.authz.system_admin_QMARK_(auth_context))));
var session_allowed_QMARK_ = ((cljs.core.not(new cljs.core.Keyword(null,"privateToSession","privateToSession",-73446717).cljs$core$IFn$_invoke$arity$1(profile))) || (((clojure.string.blank_QMARK_((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ownerSessionId","ownerSessionId",1073095462).cljs$core$IFn$_invoke$arity$1(profile))))) || (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"ownerSessionId","ownerSessionId",1073095462).cljs$core$IFn$_invoke$arity$1(profile))),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(session_id)))))));
return ((org_allowed_QMARK_) && (session_allowed_QMARK_));
}));

(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.document_state.effective_active_database_id = (function knoxx$backend$infra$document_state$effective_active_database_id(var_args){
var G__27585 = arguments.length;
switch (G__27585) {
case 3:
return knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,request){
return knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4(runtime,config,request,null);
}));

(knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,request,auth_context){
var state = knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context);
var session_id = knoxx.backend.infra.document_state.request_session_id(request);
var owner_key = knoxx.backend.infra.document_state.database_owner_key(auth_context);
var default_id = knoxx.backend.infra.document_state.default_database_id(auth_context);
var active_id = (cljs.core.truth_(auth_context)?(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),owner_key], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default_id;
}
})():(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"active-id","active-id",-59238656).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default_id;
}
})());
var active_profile = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),active_id], null));
if(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(active_profile,auth_context,session_id)){
return active_id;
} else {
var or__5162__auto__ = cljs.core.some((function (p__27599){
var vec__27600 = p__27599;
var db_id = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27600,(0),null);
var profile = cljs.core.nth.cljs$core$IFn$_invoke$arity$3(vec__27600,(1),null);
if(knoxx.backend.infra.document_state.profile_can_access_QMARK_.cljs$core$IFn$_invoke$arity$3(profile,auth_context,session_id)){
return db_id;
} else {
return null;
}
}),new cljs.core.Keyword(null,"profiles","profiles",507634713).cljs$core$IFn$_invoke$arity$1(state));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return default_id;
}
}
}));

(knoxx.backend.infra.document_state.effective_active_database_id.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.document_state.active_database_profile = (function knoxx$backend$infra$document_state$active_database_profile(var_args){
var G__27608 = arguments.length;
switch (G__27608) {
case 3:
return knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,request){
return knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,null);
}));

(knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,request,auth_context){
var state = knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context);
var db_id = knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4(runtime,config,request,auth_context);
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),db_id], null));
}));

(knoxx.backend.infra.document_state.active_database_profile.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.document_state.normalize_relative_path = (function knoxx$backend$infra$document_state$normalize_relative_path(value){
return clojure.string.replace(clojure.string.replace((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(value)),/\\/,"/"),/^\/+/,"");
});
knoxx.backend.infra.document_state.sanitize_upload_name = (function knoxx$backend$infra$document_state$sanitize_upload_name(name){
var trimmed = clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name)));
var cleaned = clojure.string.replace(clojure.string.replace(clojure.string.replace(trimmed,/[\\\/]+/,"-"),/[^A-Za-z0-9._ -]/,"-"),/\s+/," ");
if(clojure.string.blank_QMARK_(cleaned)){
return "upload.bin";
} else {
return cleaned;
}
});
knoxx.backend.infra.document_state.create_db_id = (function knoxx$backend$infra$document_state$create_db_id(_runtime,name){
var base = clojure.string.replace(clojure.string.replace(clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(name))),/[^a-z0-9]+/,"-"),/^-+|-+$/,"");
var prefix = ((clojure.string.blank_QMARK_(base))?"db":base);
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(prefix)+"-"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(shadow.esm.esm_import$node_crypto.randomUUID().slice((0),(8))));
});
knoxx.backend.infra.document_state.list_files_recursive_BANG_ = (async function knoxx$backend$infra$document_state$list_files_recursive_BANG_(runtime,dir_path){
try{var entries = (await shadow.esm.esm_import$node_fs$promises.readdir(dir_path,({"withFileTypes": true})));
var nested = (await Promise.all(cljs.core.clj__GT_js((await (async function (){var iter__5649__auto__ = (function knoxx$backend$infra$document_state$list_files_recursive_BANG__$_iter__27626(s__27627){
return (new cljs.core.LazySeq(null,(function (){
var s__27627__$1 = s__27627;
while(true){
var temp__5825__auto__ = cljs.core.seq(s__27627__$1);
if(temp__5825__auto__){
var s__27627__$2 = temp__5825__auto__;
if(cljs.core.chunked_seq_QMARK_(s__27627__$2)){
var c__5647__auto__ = cljs.core.chunk_first(s__27627__$2);
var size__5648__auto__ = cljs.core.count(c__5647__auto__);
var b__27629 = cljs.core.chunk_buffer(size__5648__auto__);
if((function (){var i__27628 = (0);
while(true){
if((i__27628 < size__5648__auto__)){
var entry = cljs.core._nth(c__5647__auto__,i__27628);
cljs.core.chunk_append(b__27629,(function (){var full_path = shadow.esm.esm_import$node_path.join(dir_path,entry.name);
if(cljs.core.truth_(entry.isDirectory())){
return (knoxx.backend.infra.document_state.list_files_recursive_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.document_state.list_files_recursive_BANG_.cljs$core$IFn$_invoke$arity$2(runtime,full_path) : knoxx.backend.infra.document_state.list_files_recursive_BANG_.call(null,runtime,full_path));
} else {
return Promise.resolve([full_path]);
}
})());

var G__27868 = (i__27628 + (1));
i__27628 = G__27868;
continue;
} else {
return true;
}
break;
}
})()){
return cljs.core.chunk_cons(cljs.core.chunk(b__27629),knoxx$backend$infra$document_state$list_files_recursive_BANG__$_iter__27626(cljs.core.chunk_rest(s__27627__$2)));
} else {
return cljs.core.chunk_cons(cljs.core.chunk(b__27629),null);
}
} else {
var entry = cljs.core.first(s__27627__$2);
return cljs.core.cons((function (){var full_path = shadow.esm.esm_import$node_path.join(dir_path,entry.name);
if(cljs.core.truth_(entry.isDirectory())){
return (knoxx.backend.infra.document_state.list_files_recursive_BANG_.cljs$core$IFn$_invoke$arity$2 ? knoxx.backend.infra.document_state.list_files_recursive_BANG_.cljs$core$IFn$_invoke$arity$2(runtime,full_path) : knoxx.backend.infra.document_state.list_files_recursive_BANG_.call(null,runtime,full_path));
} else {
return Promise.resolve([full_path]);
}
})(),knoxx$backend$infra$document_state$list_files_recursive_BANG__$_iter__27626(cljs.core.rest(s__27627__$2)));
}
} else {
return null;
}
break;
}
}),null,null));
});
return iter__5649__auto__(knoxx.backend.infra.document_state.js_array_seq(entries));
})()))));
return cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentVector.EMPTY,cljs.core.mapcat.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.document_state.js_array_seq),knoxx.backend.infra.document_state.js_array_seq(nested));
}catch (e27622){var err = e27622;
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2((err["code"]),"ENOENT")){
return cljs.core.PersistentVector.EMPTY;
} else {
throw err;
}
}});
knoxx.backend.infra.document_state.file_chunk_count = (function knoxx$backend$infra$document_state$file_chunk_count(text){
return cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),Math.ceil((cljs.core.max.cljs$core$IFn$_invoke$arity$2((1),(((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(text))).length)) / (1800))));
});
knoxx.backend.infra.document_state.indexed_meta = (function knoxx$backend$infra$document_state$indexed_meta(runtime,config,db_id,rel_path){
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$2(runtime,config),new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"indexed","indexed",390758624),rel_path], null));
});
knoxx.backend.infra.document_state.document_entry_BANG_ = (async function knoxx$backend$infra$document_state$document_entry_BANG_(runtime,config,profile,db_id,abs_path){
var docs_path = new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile);
var stats = (await shadow.esm.esm_import$node_fs$promises.stat(abs_path));
var rel_path = knoxx.backend.infra.document_state.normalize_relative_path(shadow.esm.esm_import$node_path.relative(docs_path,abs_path));
var meta = knoxx.backend.infra.document_state.indexed_meta(runtime,config,db_id,rel_path);
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"name","name",1843675177),shadow.esm.esm_import$node_path.basename(abs_path),new cljs.core.Keyword(null,"relativePath","relativePath",-608773918),rel_path,new cljs.core.Keyword(null,"size","size",1098693007),(await (async function (){var or__5162__auto__ = (stats["size"]);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"indexed","indexed",390758624),cljs.core.boolean$(meta),new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666),(await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666).cljs$core$IFn$_invoke$arity$1(meta);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"indexedAt","indexedAt",323997319),new cljs.core.Keyword(null,"indexedAt","indexedAt",323997319).cljs$core$IFn$_invoke$arity$1(meta)], null);
});
knoxx.backend.infra.document_state.list_documents_BANG_ = (async function knoxx$backend$infra$document_state$list_documents_BANG_(var_args){
var G__27654 = arguments.length;
switch (G__27654) {
case 3:
return knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$3 = (async function (runtime,config,request){
return knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$4(runtime,config,request,null);
}));

(knoxx.backend.infra.document_state.list_documents_BANG_.cljs$core$IFn$_invoke$arity$4 = (async function (runtime,config,request,auth_context){
var profile = knoxx.backend.infra.document_state.active_database_profile.cljs$core$IFn$_invoke$arity$4(runtime,config,request,auth_context);
var db_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(profile);
(await knoxx.backend.infra.document_state.ensure_dir_BANG_(runtime,new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile)));

var paths = (await knoxx.backend.infra.document_state.list_files_recursive_BANG_(runtime,new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile)));
var items = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p1__27651_SHARP_){
return knoxx.backend.infra.document_state.document_entry_BANG_(runtime,config,profile,db_id,p1__27651_SHARP_);
}),paths))));
return new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"documents","documents",-1582333455),cljs.core.vec(cljs.core.sort_by.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"relativePath","relativePath",-608773918),knoxx.backend.infra.document_state.js_array_seq(items)))], null);
}));

(knoxx.backend.infra.document_state.list_documents_BANG_.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.document_state.active_record = (function knoxx$backend$infra$document_state$active_record(var_args){
var G__27669 = arguments.length;
switch (G__27669) {
case 3:
return knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
case 4:
return knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4((arguments[(0)]),(arguments[(1)]),(arguments[(2)]),(arguments[(3)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,request){
return knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4(runtime,config,request,null);
}));

(knoxx.backend.infra.document_state.active_record.cljs$core$IFn$_invoke$arity$4 = (function (runtime,config,request,auth_context){
var db_id = knoxx.backend.infra.document_state.effective_active_database_id.cljs$core$IFn$_invoke$arity$4(runtime,config,request,auth_context);
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context),new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id], null));
}));

(knoxx.backend.infra.document_state.active_record.cljs$lang$maxFixedArity = 4);

knoxx.backend.infra.document_state.active_agent_profile = (function knoxx$backend$infra$document_state$active_agent_profile(var_args){
var G__27682 = arguments.length;
switch (G__27682) {
case 2:
return knoxx.backend.infra.document_state.active_agent_profile.cljs$core$IFn$_invoke$arity$2((arguments[(0)]),(arguments[(1)]));

break;
case 3:
return knoxx.backend.infra.document_state.active_agent_profile.cljs$core$IFn$_invoke$arity$3((arguments[(0)]),(arguments[(1)]),(arguments[(2)]));

break;
default:
throw (new Error(["Invalid arity: ",arguments.length].join("")));

}
});

(knoxx.backend.infra.document_state.active_agent_profile.cljs$core$IFn$_invoke$arity$2 = (function (runtime,config){
return knoxx.backend.infra.document_state.active_agent_profile.cljs$core$IFn$_invoke$arity$3(runtime,config,null);
}));

(knoxx.backend.infra.document_state.active_agent_profile.cljs$core$IFn$_invoke$arity$3 = (function (runtime,config,auth_context){
var state = knoxx.backend.infra.document_state.ensure_database_state_BANG_.cljs$core$IFn$_invoke$arity$3(runtime,config,auth_context);
var owner_key = knoxx.backend.infra.document_state.database_owner_key(auth_context);
var active_id = (cljs.core.truth_(auth_context)?(function (){var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"active-ids","active-ids",-958452414),owner_key], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.document_state.default_database_id(auth_context);
}
})():(function (){var or__5162__auto__ = new cljs.core.Keyword(null,"active-id","active-id",-59238656).cljs$core$IFn$_invoke$arity$1(state);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "default";
}
})());
var or__5162__auto__ = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),active_id], null));
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),knoxx.backend.infra.document_state.default_database_id(auth_context)], null));
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return cljs.core.get_in.cljs$core$IFn$_invoke$arity$2(state,new cljs.core.PersistentVector(null, 2, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"profiles","profiles",507634713),"default"], null));
}
}
}));

(knoxx.backend.infra.document_state.active_agent_profile.cljs$lang$maxFixedArity = 3);

knoxx.backend.infra.document_state.ingestion_queue = (function knoxx$backend$infra$document_state$ingestion_queue(docs_path,full,selected_files,all_abs){
var wanted = (cljs.core.truth_(full)?null:cljs.core.into.cljs$core$IFn$_invoke$arity$3(cljs.core.PersistentHashSet.EMPTY,cljs.core.map.cljs$core$IFn$_invoke$arity$1(knoxx.backend.infra.document_state.normalize_relative_path),selected_files));
return cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p__27693){
var map__27697 = p__27693;
var map__27697__$1 = cljs.core.__destructure_map(map__27697);
var rel = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27697__$1,new cljs.core.Keyword(null,"rel","rel",1378823488));
var or__5162__auto__ = full;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.contains_QMARK_(wanted,rel);
}
}),cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (abs){
var rel = knoxx.backend.infra.document_state.normalize_relative_path(shadow.esm.esm_import$node_path.relative(docs_path,abs));
return new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"abs","abs",-246026477),abs,new cljs.core.Keyword(null,"rel","rel",1378823488),rel], null);
}),all_abs)));
});
knoxx.backend.infra.document_state.mark_ingestion_started_BANG_ = (function knoxx$backend$infra$document_state$mark_ingestion_started_BANG_(db_id,queue,started_at,mode,full){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.document_state.database_state_STAR_,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"progress","progress",244323547)], null),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"startedAt","startedAt",-390697471),new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"percentPrecise","percentPrecise",-1015886804),new cljs.core.Keyword(null,"stale","stale",395586896),new cljs.core.Keyword(null,"active","active",1895962068),new cljs.core.Keyword(null,"currentFile","currentFile",-711998603),new cljs.core.Keyword(null,"filesUpdated","filesUpdated",46752279),new cljs.core.Keyword(null,"totalChunks","totalChunks",-2015469577),new cljs.core.Keyword(null,"percent","percent",2031453817),new cljs.core.Keyword(null,"processedChunks","processedChunks",516451037)],[started_at,(0),mode,(0),false,true,(function (){var G__27709 = queue;
var G__27709__$1 = (((G__27709 == null))?null:cljs.core.first(G__27709));
if((G__27709__$1 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(G__27709__$1);
}
})(),(0),cljs.core.count(queue),(0),(0)]));

return cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$4(knoxx.backend.infra.document_state.database_state_STAR_,cljs.core.assoc_in,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"lastRequest","lastRequest",-738015741)], null),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"full","full",436801220),cljs.core.boolean$(full),new cljs.core.Keyword(null,"selectedFiles","selectedFiles",-2058493306),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"rel","rel",1378823488),queue))], null));
});
knoxx.backend.infra.document_state.complete_empty_ingestion_BANG_ = (function knoxx$backend$infra$document_state$complete_empty_ingestion_BANG_(db_id,started_at,mode){
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.database_state_STAR_,(function (state){
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc_in(state,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"progress","progress",244323547)], null),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"startedAt","startedAt",-390697471),new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"percentPrecise","percentPrecise",-1015886804),new cljs.core.Keyword(null,"stale","stale",395586896),new cljs.core.Keyword(null,"active","active",1895962068),new cljs.core.Keyword(null,"currentFile","currentFile",-711998603),new cljs.core.Keyword(null,"filesUpdated","filesUpdated",46752279),new cljs.core.Keyword(null,"totalChunks","totalChunks",-2015469577),new cljs.core.Keyword(null,"percent","percent",2031453817),new cljs.core.Keyword(null,"processedChunks","processedChunks",516451037)],[started_at,(0),mode,(100),false,false,null,(0),(0),(100),(0)])),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"history","history",-247395220)], null),(function (history){
return cljs.core.vec(cljs.core.take_last((50),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(history),new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"id","id",-1388402092),shadow.esm.esm_import$node_crypto.randomUUID(),new cljs.core.Keyword(null,"completedAt","completedAt",-526048405),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"chunksUpserted","chunksUpserted",-873003328),(0),new cljs.core.Keyword(null,"processedChunks","processedChunks",516451037),(0),new cljs.core.Keyword(null,"filesUpdated","filesUpdated",46752279),(0),new cljs.core.Keyword(null,"durationSeconds","durationSeconds",-316133524),(0),new cljs.core.Keyword(null,"errors","errors",-908790718),(0)], null))));
}));
}));

return Promise.resolve(new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"started","started",585705024),true,new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"selectedFiles","selectedFiles",-2058493306),cljs.core.PersistentVector.EMPTY,new cljs.core.Keyword(null,"indexedCount","indexedCount",1873958532),(0),new cljs.core.Keyword(null,"failedCount","failedCount",-487850042),(0),new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),true], null));
});
knoxx.backend.infra.document_state.read_ingestion_queue_BANG_ = (function knoxx$backend$infra$document_state$read_ingestion_queue_BANG_(queue){
return Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (p__27745){
var map__27746 = p__27745;
var map__27746__$1 = cljs.core.__destructure_map(map__27746);
var abs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27746__$1,new cljs.core.Keyword(null,"abs","abs",-246026477));
var rel = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27746__$1,new cljs.core.Keyword(null,"rel","rel",1378823488));
return (async function (){
try{var content = (await shadow.esm.esm_import$node_fs$promises.readFile(abs,"utf8"));
return new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel,new cljs.core.Keyword(null,"content","content",15833224),content,new cljs.core.Keyword(null,"error","error",-978969032),false], null);
}catch (e27754){var err = e27754;
return new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"error","error",-978969032),true,new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}})();
}),queue)));
});
knoxx.backend.infra.document_state.openplanner_documents = (function knoxx$backend$infra$document_state$openplanner_documents(db_id,project,profile,valid_items){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"id","id",-1388402092),(""+"knoxx:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(db_id)+":"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item))),new cljs.core.Keyword(null,"rel-path","rel-path",593215642),new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item),new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(item),new cljs.core.Keyword(null,"source-path","source-path",-1955873712),new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item),new cljs.core.Keyword(null,"project","project",1124394579),project,new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"database-id","database-id",1883826326),db_id,new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(profile)], null)], null);
}),valid_items);
});
knoxx.backend.infra.document_state.finish_document_ingestion_BANG_ = (function knoxx$backend$infra$document_state$finish_document_ingestion_BANG_(db_id,queue,started_at,mode,read_failed,valid_items,index_result){
var successful_rels = cljs.core.set(cljs.core.keep.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"rel-path","rel-path",593215642),new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(index_result)));
var indexed_items = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs.core.contains_QMARK_(successful_rels,new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item));
}),valid_items));
var indexed_count = cljs.core.count(indexed_items);
var failed_count = (cljs.core.count(read_failed) + new cljs.core.Keyword(null,"failed-count","failed-count",-366647954).cljs$core$IFn$_invoke$arity$2(index_result,(0)));
var chunk_count = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3(cljs.core._PLUS_,(0),cljs.core.map.cljs$core$IFn$_invoke$arity$2(cljs.core.comp.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.file_chunk_count,new cljs.core.Keyword(null,"content","content",15833224)),indexed_items));
var started_ms = (new Date(started_at)).getTime();
var duration_seconds = cljs.core.max.cljs$core$IFn$_invoke$arity$2((0),Math.round(((Date.now() - started_ms) / (1000))));
var total = cljs.core.count(queue);
var history_item = new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"id","id",-1388402092),shadow.esm.esm_import$node_crypto.randomUUID(),new cljs.core.Keyword(null,"completedAt","completedAt",-526048405),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"chunksUpserted","chunksUpserted",-873003328),chunk_count,new cljs.core.Keyword(null,"processedChunks","processedChunks",516451037),total,new cljs.core.Keyword(null,"filesUpdated","filesUpdated",46752279),indexed_count,new cljs.core.Keyword(null,"durationSeconds","durationSeconds",-316133524),duration_seconds,new cljs.core.Keyword(null,"errors","errors",-908790718),failed_count], null);
cljs.core.swap_BANG_.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.document_state.database_state_STAR_,(function (state){
var state_with_index = cljs.core.reduce.cljs$core$IFn$_invoke$arity$3((function (acc,item){
return cljs.core.assoc_in(acc,new cljs.core.PersistentVector(null, 4, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"indexed","indexed",390758624),new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item)], null),new cljs.core.PersistentArrayMap(null, 3, [new cljs.core.Keyword(null,"chunkCount","chunkCount",1427535666),knoxx.backend.infra.document_state.file_chunk_count(new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(item)),new cljs.core.Keyword(null,"indexedAt","indexedAt",323997319),knoxx.backend.domain.time.now_iso(),new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),true], null));
}),state,indexed_items);
return cljs.core.update_in.cljs$core$IFn$_invoke$arity$3(cljs.core.assoc_in(state_with_index,new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"progress","progress",244323547)], null),cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"startedAt","startedAt",-390697471),new cljs.core.Keyword(null,"errors","errors",-908790718),new cljs.core.Keyword(null,"mode","mode",654403691),new cljs.core.Keyword(null,"percentPrecise","percentPrecise",-1015886804),new cljs.core.Keyword(null,"stale","stale",395586896),new cljs.core.Keyword(null,"active","active",1895962068),new cljs.core.Keyword(null,"currentFile","currentFile",-711998603),new cljs.core.Keyword(null,"filesUpdated","filesUpdated",46752279),new cljs.core.Keyword(null,"totalChunks","totalChunks",-2015469577),new cljs.core.Keyword(null,"percent","percent",2031453817),new cljs.core.Keyword(null,"processedChunks","processedChunks",516451037)],[started_at,failed_count,mode,(100),false,false,null,indexed_count,total,(100),total])),new cljs.core.PersistentVector(null, 3, 5, cljs.core.PersistentVector.EMPTY_NODE, [new cljs.core.Keyword(null,"records","records",1326822832),db_id,new cljs.core.Keyword(null,"history","history",-247395220)], null),(function (history){
return cljs.core.vec(cljs.core.take_last((50),cljs.core.conj.cljs$core$IFn$_invoke$arity$2(cljs.core.vec(history),history_item)));
}));
}));

return new cljs.core.PersistentArrayMap(null, 7, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"started","started",585705024),true,new cljs.core.Keyword(null,"mode","mode",654403691),mode,new cljs.core.Keyword(null,"selectedFiles","selectedFiles",-2058493306),cljs.core.vec(cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"rel","rel",1378823488),queue)),new cljs.core.Keyword(null,"indexedCount","indexedCount",1873958532),indexed_count,new cljs.core.Keyword(null,"failedCount","failedCount",-487850042),failed_count,new cljs.core.Keyword(null,"openplanner","openplanner",-175854128),true], null);
});
knoxx.backend.infra.document_state.index_document_queue_BANG_ = (async function knoxx$backend$infra$document_state$index_document_queue_BANG_(config,profile,db_id,project,queue,started_at,mode){
var read_results = (await knoxx.backend.infra.document_state.read_ingestion_queue_BANG_(queue));
var items = cljs.core.vec(knoxx.backend.infra.document_state.js_array_seq(read_results));
var read_failed = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"error","error",-978969032),items));
var valid_items = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"error","error",-978969032),items));
var index_result = (await knoxx.backend.infra.openplanner.memory.batch_upsert_openplanner_documents_BANG_(config,knoxx.backend.infra.document_state.openplanner_documents(db_id,project,profile,valid_items),new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"concurrency","concurrency",595096228),(3),new cljs.core.Keyword(null,"project","project",1124394579),project,new cljs.core.Keyword(null,"visibility","visibility",1338380893),"internal",new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"database-id","database-id",1883826326),db_id,new cljs.core.Keyword(null,"org-id","org-id",1485182668),new cljs.core.Keyword(null,"orgId","orgId",-73585595).cljs$core$IFn$_invoke$arity$1(profile)], null)], null)));
return knoxx.backend.infra.document_state.finish_document_ingestion_BANG_(db_id,queue,started_at,mode,read_failed,valid_items,index_result);
});
/**
 * Ingest documents into OpenPlanner for embedding and vector storage.
 * Replaces previous metadata-only tracking with OpenPlanner /v1/documents indexing.
 */
knoxx.backend.infra.document_state.start_document_ingestion_BANG_ = (async function knoxx$backend$infra$document_state$start_document_ingestion_BANG_(runtime,config,profile,p__27780){
var map__27781 = p__27780;
var map__27781__$1 = cljs.core.__destructure_map(map__27781);
var full = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27781__$1,new cljs.core.Keyword(null,"full","full",436801220));
var selected_files = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27781__$1,new cljs.core.Keyword(null,"selected-files","selected-files",1045525459));
var db_id = new cljs.core.Keyword(null,"id","id",-1388402092).cljs$core$IFn$_invoke$arity$1(profile);
var docs_path = new cljs.core.Keyword(null,"docsPath","docsPath",-1515329882).cljs$core$IFn$_invoke$arity$1(profile);
var project = (await (async function (){var or__5162__auto__ = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "workspace";
}
})());
var all_abs = (await knoxx.backend.infra.document_state.list_files_recursive_BANG_(runtime,docs_path));
var queue = knoxx.backend.infra.document_state.ingestion_queue(docs_path,full,selected_files,all_abs);
var started_at = knoxx.backend.domain.time.now_iso();
var mode = (cljs.core.truth_(full)?"full":"selected");
knoxx.backend.infra.document_state.mark_ingestion_started_BANG_(db_id,queue,started_at,mode,full);

if((cljs.core.count(queue) === (0))){
return knoxx.backend.infra.document_state.complete_empty_ingestion_BANG_(db_id,started_at,mode);
} else {
return knoxx.backend.infra.document_state.index_document_queue_BANG_(config,profile,db_id,project,queue,started_at,mode);
}
});
/**
 * Check if a file extension is a text-like format suitable for ingestion.
 */
knoxx.backend.infra.document_state.text_like_path_QMARK_ = (function knoxx$backend$infra$document_state$text_like_path_QMARK_(path_str){
var lower = clojure.string.lower_case((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(path_str)));
var idx = lower.lastIndexOf(".");
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(idx,(-1))){
return true;
} else {
return cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 44, [".ini",null,".hcl",null,".json",null,".cljc",null,".sh",null,".yaml",null,".py",null,".tsx",null,".go",null,".zsh",null,".md",null,".log",null,".rs",null,".jsx",null,".js",null,".tf",null,".env",null,".toml",null,".php",null,".rb",null,".txt",null,".conf",null,".java",null,".graphql",null,".proto",null,".csv",null,".gql",null,".mdx",null,".ts",null,".htm",null,".less",null,".html",null,".css",null,".cljs",null,".scss",null,".clj",null,".org",null,".mjs",null,".cjs",null,".sql",null,".yml",null,".bash",null,".edn",null,".xml",null], null), null),lower.slice(idx));
}
});
/**
 * Read a single workspace file and return a result map.
 */
knoxx.backend.infra.document_state.read_workspace_file_BANG_ = (async function knoxx$backend$infra$document_state$read_workspace_file_BANG_(workspace_root,rel_path){
var abs_path = shadow.esm.esm_import$node_path.resolve(workspace_root,rel_path);
try{var stat = (await shadow.esm.esm_import$node_fs$promises.stat(abs_path));
if(cljs.core.truth_((await (async function (){var and__5160__auto__ = stat.isFile();
if(cljs.core.truth_(and__5160__auto__)){
return knoxx.backend.infra.document_state.text_like_path_QMARK_(abs_path);
} else {
return and__5160__auto__;
}
})()))){
try{var content = (await shadow.esm.esm_import$node_fs$promises.readFile(abs_path,"utf8"));
return new cljs.core.PersistentArrayMap(null, 5, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel_path,new cljs.core.Keyword(null,"abs","abs",-246026477),abs_path,new cljs.core.Keyword(null,"content","content",15833224),content,new cljs.core.Keyword(null,"size","size",1098693007),(await (async function (){var or__5162__auto__ = stat.size;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"error","error",-978969032),false], null);
}catch (e27797){var err = e27797;
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel_path,new cljs.core.Keyword(null,"abs","abs",-246026477),abs_path,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"size","size",1098693007),(0),new cljs.core.Keyword(null,"error","error",-978969032),true,new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}} else {
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel_path,new cljs.core.Keyword(null,"abs","abs",-246026477),abs_path,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"size","size",1098693007),(await (async function (){var or__5162__auto__ = stat.size;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return (0);
}
})()),new cljs.core.Keyword(null,"error","error",-978969032),true,new cljs.core.Keyword(null,"detail","detail",-1545345025),"binary or unsupported file type"], null);
}
}catch (e27789){var err = e27789;
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"rel","rel",1378823488),rel_path,new cljs.core.Keyword(null,"abs","abs",-246026477),abs_path,new cljs.core.Keyword(null,"content","content",15833224),null,new cljs.core.Keyword(null,"size","size",1098693007),(0),new cljs.core.Keyword(null,"error","error",-978969032),true,new cljs.core.Keyword(null,"detail","detail",-1545345025),(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(err))], null);
}});
/**
 * Classify a file extension into a document kind.
 */
knoxx.backend.infra.document_state.classify_document_kind = (function knoxx$backend$infra$document_state$classify_document_kind(rel_path){
var ext = (function (){var G__27808 = clojure.string.lower_case(rel_path);
var G__27808__$1 = (((G__27808 == null))?null:clojure.string.split.cljs$core$IFn$_invoke$arity$2(G__27808,/\./));
if((G__27808__$1 == null)){
return null;
} else {
return cljs.core.last(G__27808__$1);
}
})();
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 15, ["js",null,"cljc",null,"rs",null,"ts",null,"mjs",null,"py",null,"cljs",null,"cjs",null,"clj",null,"java",null,"jsx",null,"php",null,"go",null,"tsx",null,"rb",null], null), null),ext)){
return "code";
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 6, ["md",null,"rst",null,"txt",null,"mdx",null,".org",null,"adoc",null], null), null),ext)){
return "docs";
} else {
if(cljs.core.contains_QMARK_(new cljs.core.PersistentHashSet(null, new cljs.core.PersistentArrayMap(null, 7, ["json",null,"toml",null,"yml",null,"yaml",null,"conf",null,"env",null,"ini",null], null), null),ext)){
return "config";
} else {
return "docs";

}
}
}
});
/**
 * Build document maps from successful file reads.
 */
knoxx.backend.infra.document_state.build_priority_documents = (function knoxx$backend$infra$document_state$build_priority_documents(valid_items,project,source){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2((function (item){
return cljs.core.PersistentHashMap.fromArrays([new cljs.core.Keyword(null,"content","content",15833224),new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.Keyword(null,"source","source",-433931539),new cljs.core.Keyword(null,"source-path","source-path",-1955873712),new cljs.core.Keyword(null,"project","project",1124394579),new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword(null,"kind","kind",-717265803),new cljs.core.Keyword(null,"rel-path","rel-path",593215642),new cljs.core.Keyword(null,"visibility","visibility",1338380893)],[new cljs.core.Keyword(null,"content","content",15833224).cljs$core$IFn$_invoke$arity$1(item),new cljs.core.PersistentArrayMap(null, 2, [new cljs.core.Keyword(null,"priority-ingest","priority-ingest",869114081),true,new cljs.core.Keyword(null,"size","size",1098693007),new cljs.core.Keyword(null,"size","size",1098693007).cljs$core$IFn$_invoke$arity$1(item)], null),source,new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item),project,(""+"knoxx-priority:"+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item))),knoxx.backend.infra.document_state.classify_document_kind(new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item)),new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(item),"internal"]);
}),valid_items);
});
/**
 * Build the summary response for priority ingestion.
 */
knoxx.backend.infra.document_state.priority_ingest_summary = (function knoxx$backend$infra$document_state$priority_ingest_summary(indexed_count,failed_reads,failed_index_count,total_paths,indexed_files,source){
return new cljs.core.PersistentArrayMap(null, 6, [new cljs.core.Keyword(null,"ok","ok",967785236),true,new cljs.core.Keyword(null,"indexed","indexed",390758624),indexed_count,new cljs.core.Keyword(null,"failed","failed",-1397425762),(cljs.core.count(failed_reads) + failed_index_count),new cljs.core.Keyword(null,"total","total",1916810418),total_paths,new cljs.core.Keyword(null,"files","files",-472457450),cljs.core.concat.cljs$core$IFn$_invoke$arity$variadic(indexed_files,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (f){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"rel","rel",1378823488).cljs$core$IFn$_invoke$arity$1(f))+" (read error: "+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"detail","detail",-1545345025).cljs$core$IFn$_invoke$arity$1(f))+")");
}),failed_reads),cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (f){
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(new cljs.core.Keyword(null,"rel-path","rel-path",593215642).cljs$core$IFn$_invoke$arity$1(f))+" (index error)");
}),(((failed_index_count > (0)))?cljs.core.PersistentVector.EMPTY:null))], 0)),new cljs.core.Keyword(null,"source","source",-433931539),source], null);
});
/**
 * Immediately ingest specific workspace files into OpenPlanner, bypassing queues.
 * Takes workspace-relative paths, reads them from disk, and sends to /v1/documents.
 *   Returns {:ok true, :indexed N, :failed M, :files [...]} summary.
 */
knoxx.backend.infra.document_state.priority_ingest_workspace_files_BANG_ = (async function knoxx$backend$infra$document_state$priority_ingest_workspace_files_BANG_(_runtime,config,p__27818){
var map__27819 = p__27818;
var map__27819__$1 = cljs.core.__destructure_map(map__27819);
var paths = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27819__$1,new cljs.core.Keyword(null,"paths","paths",-1807389588));
var project = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27819__$1,new cljs.core.Keyword(null,"project","project",1124394579));
var source = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__27819__$1,new cljs.core.Keyword(null,"source","source",-433931539));
var workspace_root = new cljs.core.Keyword(null,"workspace-root","workspace-root",-488911547).cljs$core$IFn$_invoke$arity$1(config);
var project__$1 = (await (async function (){var or__5162__auto__ = project;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
var or__5162__auto____$1 = new cljs.core.Keyword(null,"project-name","project-name",1486861539).cljs$core$IFn$_invoke$arity$1(config);
if(cljs.core.truth_(or__5162__auto____$1)){
return or__5162__auto____$1;
} else {
return "workspace";
}
}
})());
var source__$1 = (await (async function (){var or__5162__auto__ = source;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return "knoxx-priority-ingest";
}
})());
var read_results = (await Promise.all(cljs.core.clj__GT_js(cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (rel_path){
return knoxx.backend.infra.document_state.read_workspace_file_BANG_(workspace_root,rel_path);
}),paths))));
var items = cljs.core.vec(knoxx.backend.infra.document_state.js_array_seq(read_results));
var valid = cljs.core.vec(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"error","error",-978969032),items));
var failed_reads = cljs.core.vec(cljs.core.filter.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"error","error",-978969032),items));
var docs = knoxx.backend.infra.document_state.build_priority_documents(valid,project__$1,source__$1);
if(cljs.core.seq(docs)){
var index_result = (await knoxx.backend.infra.openplanner.memory.batch_upsert_openplanner_documents_BANG_(config,docs,new cljs.core.PersistentArrayMap(null, 4, [new cljs.core.Keyword(null,"concurrency","concurrency",595096228),(5),new cljs.core.Keyword(null,"project","project",1124394579),project__$1,new cljs.core.Keyword(null,"visibility","visibility",1338380893),"internal",new cljs.core.Keyword(null,"extra","extra",1612569067),new cljs.core.PersistentArrayMap(null, 1, [new cljs.core.Keyword(null,"source","source",-433931539),source__$1], null)], null)));
return knoxx.backend.infra.document_state.priority_ingest_summary(cljs.core.count(new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(index_result)),failed_reads,new cljs.core.Keyword(null,"failed-count","failed-count",-366647954).cljs$core$IFn$_invoke$arity$2(index_result,(0)),cljs.core.count(paths),cljs.core.map.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"rel","rel",1378823488),new cljs.core.Keyword(null,"indexed","indexed",390758624).cljs$core$IFn$_invoke$arity$1(index_result)),source__$1);
} else {
return knoxx.backend.infra.document_state.priority_ingest_summary((0),failed_reads,(0),cljs.core.count(paths),cljs.core.PersistentVector.EMPTY,source__$1);
}
});

//# sourceMappingURL=knoxx.backend.infra.document_state.js.map
