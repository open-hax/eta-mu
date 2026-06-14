import "./cljs_env.js";
import "./cljs.core.js";
import "./clojure.string.js";
import "./knoxx.backend.domain.policy.edn_adapter.js";
import "./knoxx.backend.domain.policy.protocol.js";
goog.provide('knoxx.backend.infra.db.actors');
knoxx.backend.infra.db.actors.normalize_actor_id = (function knoxx$backend$infra$db$actors$normalize_actor_id(value){
var G__26569 = value;
var G__26569__$1 = (((G__26569 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26569)));
var G__26569__$2 = (((G__26569__$1 == null))?null:clojure.string.trim(G__26569__$1));
if((G__26569__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26569__$2);
}
});
knoxx.backend.infra.db.actors.normalize_email = (function knoxx$backend$infra$db$actors$normalize_email(value){
var G__26570 = value;
var G__26570__$1 = (((G__26570 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26570)));
var G__26570__$2 = (((G__26570__$1 == null))?null:clojure.string.trim(G__26570__$1));
var G__26570__$3 = (((G__26570__$2 == null))?null:clojure.string.lower_case(G__26570__$2));
if((G__26570__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26570__$3);
}
});
knoxx.backend.infra.db.actors.user_actor_id_from_email = (function knoxx$backend$infra$db$actors$user_actor_id_from_email(email){
var G__26579 = email;
var G__26579__$1 = (((G__26579 == null))?null:knoxx.backend.infra.db.actors.normalize_email(G__26579));
var G__26579__$2 = (((G__26579__$1 == null))?null:clojure.string.replace(G__26579__$1,/[^a-z0-9]+/,"_"));
var G__26579__$3 = (((G__26579__$2 == null))?null:clojure.string.replace(G__26579__$2,/^_+|_+$/,""));
if((G__26579__$3 == null)){
return null;
} else {
return cljs.core.not_empty(G__26579__$3);
}
});
knoxx.backend.infra.db.actors.actor_email_from_id = (function knoxx$backend$infra$db$actors$actor_email_from_id(actor_id){
var slug = clojure.string.replace(clojure.string.replace(clojure.string.lower_case(clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(actor_id)))),/[^a-z0-9._+-]+/,"-"),/^[-.]+|[-.]+$/,"");
if(clojure.string.blank_QMARK_(slug)){
return null;
} else {
return (""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(slug)+"@actors.local");
}
});
knoxx.backend.infra.db.actors.edn_store = (function knoxx$backend$infra$db$actors$edn_store(contracts_dir){
return knoxx.backend.domain.policy.edn_adapter.create_store(contracts_dir);
});
knoxx.backend.infra.db.actors.actor_contract_file_path = (function knoxx$backend$infra$db$actors$actor_contract_file_path(contracts_dir,actor_id){
return knoxx.backend.domain.policy.edn_adapter.actor_contract_file_path(knoxx.backend.infra.db.actors.edn_store(contracts_dir),actor_id);
});
knoxx.backend.infra.db.actors.actor_summary = (function knoxx$backend$infra$db$actors$actor_summary(actor){
return new cljs.core.PersistentArrayMap(null, 8, [new cljs.core.Keyword(null,"id","id",-1388402092),new cljs.core.Keyword("actor","id","actor/id",-1462607809).cljs$core$IFn$_invoke$arity$1(actor),new cljs.core.Keyword(null,"kind","kind",-717265803),(function (){var or__5162__auto__ = new cljs.core.Keyword("actor","kind","actor/kind",-1410102686).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agent","agent",-766455027);
}
})(),new cljs.core.Keyword(null,"email","email",1415816706),knoxx.backend.infra.db.actors.normalize_email((function (){var or__5162__auto__ = new cljs.core.Keyword("actor","email","actor/email",1189986301).cljs$core$IFn$_invoke$arity$1(actor);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
if(cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword("actor","kind","actor/kind",-1410102686).cljs$core$IFn$_invoke$arity$1(actor))){
return new cljs.core.Keyword("actor","username","actor/username",2032890997).cljs$core$IFn$_invoke$arity$1(actor);
} else {
return null;
}
}
})()),new cljs.core.Keyword(null,"username","username",1605666410),(function (){var G__26595 = new cljs.core.Keyword("actor","username","actor/username",2032890997).cljs$core$IFn$_invoke$arity$1(actor);
var G__26595__$1 = (((G__26595 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26595)));
var G__26595__$2 = (((G__26595__$1 == null))?null:clojure.string.trim(G__26595__$1));
if((G__26595__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26595__$2);
}
})(),new cljs.core.Keyword(null,"org","org",1495985),(function (){var G__26596 = new cljs.core.Keyword("actor","org","actor/org",175993262).cljs$core$IFn$_invoke$arity$1(actor);
var G__26596__$1 = (((G__26596 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26596)));
var G__26596__$2 = (((G__26596__$1 == null))?null:clojure.string.trim(G__26596__$1));
if((G__26596__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26596__$2);
}
})(),new cljs.core.Keyword(null,"label","label",1718410804),(function (){var G__26597 = new cljs.core.Keyword("actor","label","actor/label",-1796720603).cljs$core$IFn$_invoke$arity$1(actor);
var G__26597__$1 = (((G__26597 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26597)));
var G__26597__$2 = (((G__26597__$1 == null))?null:clojure.string.trim(G__26597__$1));
if((G__26597__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26597__$2);
}
})(),new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.remove.cljs$core$IFn$_invoke$arity$2(clojure.string.blank_QMARK_,cljs.core.map.cljs$core$IFn$_invoke$arity$2((function (role){
if((role instanceof cljs.core.Keyword)){
return clojure.string.replace(cljs.core.name(role),/-/,"_");
} else {
if(typeof role === 'string'){
return clojure.string.replace(clojure.string.trim(role),/-/,"_");
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
})())))),new cljs.core.Keyword(null,"actor","actor",-1830560481),actor], null);
});
knoxx.backend.infra.db.actors.list_actor_contracts = (function knoxx$backend$infra$db$actors$list_actor_contracts(contracts_dir){
return cljs.core.mapv.cljs$core$IFn$_invoke$arity$2(knoxx.backend.infra.db.actors.actor_summary,knoxx.backend.domain.policy.protocol.list_actors(knoxx.backend.infra.db.actors.edn_store(contracts_dir)));
});
knoxx.backend.infra.db.actors.find_actor_contract_by_id = (function knoxx$backend$infra$db$actors$find_actor_contract_by_id(contracts_dir,actor_id){
var G__26609 = knoxx.backend.domain.policy.protocol.get_actor(knoxx.backend.infra.db.actors.edn_store(contracts_dir),actor_id);
if((G__26609 == null)){
return null;
} else {
return knoxx.backend.infra.db.actors.actor_summary(G__26609);
}
});
knoxx.backend.infra.db.actors.find_user_actor_contract_by_email = (function knoxx$backend$infra$db$actors$find_user_actor_contract_by_email(contracts_dir,email){
var temp__5825__auto__ = knoxx.backend.infra.db.actors.normalize_email(email);
if(cljs.core.truth_(temp__5825__auto__)){
var normalized_email = temp__5825__auto__;
return cljs.core.first(cljs.core.filter.cljs$core$IFn$_invoke$arity$2((function (p1__26610_SHARP_){
return ((cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(new cljs.core.Keyword(null,"user","user",1532431356),new cljs.core.Keyword(null,"kind","kind",-717265803).cljs$core$IFn$_invoke$arity$1(p1__26610_SHARP_))) && (cljs.core._EQ_.cljs$core$IFn$_invoke$arity$2(normalized_email,new cljs.core.Keyword(null,"email","email",1415816706).cljs$core$IFn$_invoke$arity$1(p1__26610_SHARP_))));
}),knoxx.backend.infra.db.actors.list_actor_contracts(contracts_dir)));
} else {
return null;
}
});
knoxx.backend.infra.db.actors.upsert_actor_contract_BANG_ = (function knoxx$backend$infra$db$actors$upsert_actor_contract_BANG_(contracts_dir,p__26615){
var map__26616 = p__26615;
var map__26616__$1 = cljs.core.__destructure_map(map__26616);
var actor_id = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"actor-id","actor-id",897721067));
var email = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"email","email",1415816706));
var display_name = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"display-name","display-name",694513143));
var org_slug = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"org-slug","org-slug",-726595051));
var role_slugs = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"role-slugs","role-slugs",-1044987158));
var kind = cljs.core.get.cljs$core$IFn$_invoke$arity$2(map__26616__$1,new cljs.core.Keyword(null,"kind","kind",-717265803));
var existing = (function (){var G__26618 = knoxx.backend.infra.db.actors.find_actor_contract_by_id(contracts_dir,actor_id);
if((G__26618 == null)){
return null;
} else {
return new cljs.core.Keyword(null,"actor","actor",-1830560481).cljs$core$IFn$_invoke$arity$1(G__26618);
}
})();
var normalized_email = knoxx.backend.infra.db.actors.normalize_email(email);
var actor = (function (){var G__26619 = (function (){var or__5162__auto__ = existing;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return cljs.core.PersistentArrayMap.EMPTY;
}
})();
var G__26619__$1 = cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26619,new cljs.core.Keyword("actor","id","actor/id",-1462607809),(function (){var or__5162__auto__ = knoxx.backend.infra.db.actors.normalize_actor_id(actor_id);
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return knoxx.backend.infra.db.actors.user_actor_id_from_email(email);
}
})())
;
var G__26619__$2 = ((cljs.core.not(new cljs.core.Keyword("actor","kind","actor/kind",-1410102686).cljs$core$IFn$_invoke$arity$1(existing)))?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26619__$1,new cljs.core.Keyword("actor","kind","actor/kind",-1410102686),(function (){var or__5162__auto__ = kind;
if(cljs.core.truth_(or__5162__auto__)){
return or__5162__auto__;
} else {
return new cljs.core.Keyword(null,"agent","agent",-766455027);
}
})()):G__26619__$1);
var G__26619__$3 = (cljs.core.truth_(normalized_email)?cljs.core.assoc.cljs$core$IFn$_invoke$arity$variadic(G__26619__$2,new cljs.core.Keyword("actor","email","actor/email",1189986301),normalized_email,cljs.core.prim_seq.cljs$core$IFn$_invoke$arity$2([new cljs.core.Keyword("actor","username","actor/username",2032890997),normalized_email], 0)):G__26619__$2);
var G__26619__$4 = (cljs.core.truth_((function (){var G__26622 = org_slug;
var G__26622__$1 = (((G__26622 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26622)));
var G__26622__$2 = (((G__26622__$1 == null))?null:clojure.string.trim(G__26622__$1));
if((G__26622__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26622__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26619__$3,new cljs.core.Keyword("actor","org","actor/org",175993262),clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(org_slug)))):G__26619__$3);
var G__26619__$5 = (cljs.core.truth_((function (){var G__26626 = display_name;
var G__26626__$1 = (((G__26626 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26626)));
var G__26626__$2 = (((G__26626__$1 == null))?null:clojure.string.trim(G__26626__$1));
if((G__26626__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26626__$2);
}
})())?cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26619__$4,new cljs.core.Keyword("actor","label","actor/label",-1796720603),clojure.string.trim((""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(display_name)))):G__26619__$4);
if(cljs.core.seq(role_slugs)){
return cljs.core.assoc.cljs$core$IFn$_invoke$arity$3(G__26619__$5,new cljs.core.Keyword("actor","roles","actor/roles",186081855),cljs.core.vec(cljs.core.distinct.cljs$core$IFn$_invoke$arity$1(cljs.core.keep.cljs$core$IFn$_invoke$arity$2((function (role){
var temp__5825__auto__ = (function (){var G__26633 = role;
var G__26633__$1 = (((G__26633 == null))?null:(""+cljs.core.str.cljs$core$IFn$_invoke$arity$1(G__26633)));
var G__26633__$2 = (((G__26633__$1 == null))?null:clojure.string.trim(G__26633__$1));
if((G__26633__$2 == null)){
return null;
} else {
return cljs.core.not_empty(G__26633__$2);
}
})();
if(cljs.core.truth_(temp__5825__auto__)){
var slug = temp__5825__auto__;
return cljs.core.keyword.cljs$core$IFn$_invoke$arity$2("role",clojure.string.replace(slug,/_/,"-"));
} else {
return null;
}
}),role_slugs))));
} else {
return G__26619__$5;
}
})();
return knoxx.backend.domain.policy.protocol.upsert_actor_BANG_(knoxx.backend.infra.db.actors.edn_store(contracts_dir),actor);
});
knoxx.backend.infra.db.actors.contract_tool_ids = (function knoxx$backend$infra$db$actors$contract_tool_ids(contracts_dir){
return knoxx.backend.domain.policy.edn_adapter.contract_tool_ids(knoxx.backend.infra.db.actors.edn_store(contracts_dir));
});

//# sourceMappingURL=knoxx.backend.infra.db.actors.js.map
